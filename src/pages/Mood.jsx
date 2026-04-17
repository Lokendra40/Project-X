import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function Mood() {
  const { setDailyMood, moods } = useAppContext();

  const handleMoodSelect = async (mood) => {
    await setDailyMood(mood);
    alert(`Mood recorded: ${mood}`);
  };

  return (
    <section className="card">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>How are you feeling today?</h2>
      
      <div style={{ display: 'flex', gap: '30px', fontSize: '3rem', cursor: 'pointer', justifyContent: 'center', margin: '40px 0' }}>
        <span onClick={() => handleMoodSelect('😊')} style={{ transition: 'transform 0.2s' }} onMouseOver={e => e.target.style.transform='scale(1.2)'} onMouseOut={e => e.target.style.transform='scale(1)'}>😊</span>
        <span onClick={() => handleMoodSelect('🥰')} style={{ transition: 'transform 0.2s' }} onMouseOver={e => e.target.style.transform='scale(1.2)'} onMouseOut={e => e.target.style.transform='scale(1)'}>🥰</span>
        <span onClick={() => handleMoodSelect('😢')} style={{ transition: 'transform 0.2s' }} onMouseOver={e => e.target.style.transform='scale(1.2)'} onMouseOut={e => e.target.style.transform='scale(1)'}>😢</span>
        <span onClick={() => handleMoodSelect('😡')} style={{ transition: 'transform 0.2s' }} onMouseOver={e => e.target.style.transform='scale(1.2)'} onMouseOut={e => e.target.style.transform='scale(1)'}>😡</span>
        <span onClick={() => handleMoodSelect('😴')} style={{ transition: 'transform 0.2s' }} onMouseOver={e => e.target.style.transform='scale(1.2)'} onMouseOut={e => e.target.style.transform='scale(1)'}>😴</span>
      </div>

      <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
         <h3>Recent Mood History</h3>
         {moods && moods.length > 0 ? (
           <ul style={{ listStyle: 'none', padding: 0 }}>
             {moods.map((m, idx) => (
                <li key={idx} style={{ padding: '10px', background: '#f9f9f9', marginBottom: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>{m.mood}</span>
                  <span style={{ color: '#666' }}>{m.date} - logged by {m.userId}</span>
                </li>
             ))}
           </ul>
         ) : <p style={{ color: '#888' }}>No mood history logged yet.</p>}
      </div>
    </section>
  );
}
