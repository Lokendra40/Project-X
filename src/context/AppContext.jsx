import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, storage } from '../services/firebase';
import {
  collection, query, onSnapshot, addDoc, serverTimestamp, doc, setDoc, orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const { userData } = useAuth();
  const [memories, setMemories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [specialDates, setSpecialDates] = useState([]);
  const [moods, setMoods] = useState([]);
  const [loveStats, setLoveStats] = useState({
    daysTogether: 0, totalMemories: 0, messagesSent: 0, loveScore: 100
  });

  const coupleId = userData?.coupleId || "demo-couple-id";

  useEffect(() => {
    if (!coupleId) return;

    const qMemories = query(collection(db, "couples", coupleId, "memories"), orderBy("createdAt", "desc"));
    const unsubMemories = onSnapshot(qMemories, snap => setMemories(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qMessages = query(collection(db, "couples", coupleId, "messages"), orderBy("createdAt", "asc"));
    const unsubMessages = onSnapshot(qMessages, snap => setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qDates = query(collection(db, "couples", coupleId, "specialDates"), orderBy("date", "asc"));
    const unsubDates = onSnapshot(qDates, snap => setSpecialDates(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => { unsubMemories(); unsubMessages(); unsubDates(); };
  }, [coupleId]);

  useEffect(() => {
    setLoveStats({
      daysTogether: specialDates.length > 0 ? Math.floor((new Date() - new Date(specialDates[0].date)) / (1000 * 60 * 60 * 24)) : 0,
      totalMemories: memories.length,
      messagesSent: messages.length,
      loveScore: Math.min(100, 50 + (memories.length * 2) + (messages.length * 0.1))
    });
  }, [memories, messages, specialDates]);

  async function uploadMemory(file, caption, date) {
    if (!coupleId || !userData) return;
    const url = file ? await (async () => {
       const storageRef = ref(storage, `memories/${coupleId}/${Date.now()}_${file.name}`);
       await uploadBytes(storageRef, file);
       return await getDownloadURL(storageRef);
    })() : "https://placekitten.com/200/300"; // Fallback demo
    
    await addDoc(collection(db, "couples", coupleId, "memories"), {
      imageUrl: url, caption, date, uploadedBy: userData.uid, createdAt: serverTimestamp()
    });
  }

  async function sendMessage(text) {
    if (!coupleId || !userData || !text.trim()) return;
    await addDoc(collection(db, "couples", coupleId, "messages"), {
      text, senderId: userData.uid, senderName: userData.name, createdAt: serverTimestamp()
    });
  }

  async function setDailyMood(moodEmoji) {
    if (!coupleId || !userData) return;
    const today = new Date().toISOString().split('T')[0];
    await setDoc(doc(db, "couples", coupleId, "moods", `${userData.uid}_${today}`), {
      userId: userData.uid, mood: moodEmoji, date: today, timestamp: serverTimestamp()
    });
  }

  return (
    <AppContext.Provider value={{ memories, messages, specialDates, moods, loveStats, uploadMemory, sendMessage, setDailyMood }}>
      {children}
    </AppContext.Provider>
  );
}
