import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const connectionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      name,
      email,
      connectionCode,
      partnerId: null,
      coupleId: null, 
      createdAt: new Date().toISOString()
    });
    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function guestLogin() {
    setCurrentUser({ uid: 'guest-user', email: 'guest@example.com' });
    setUserData({
      uid: 'guest-user',
      name: 'Guest User',
      connectionCode: 'GUEST123',
      coupleId: 'demo-couple'
    });
  }

  function logout() {
    setCurrentUser(null);
    setUserData(null);
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) setUserData(userDoc.data());
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userData, signup, login, logout, guestLogin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
