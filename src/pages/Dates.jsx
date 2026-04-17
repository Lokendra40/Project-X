import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Dates() {
  const { specialDates } = useAppContext();
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');

  const handleAddDate = (e) => {
    e.preventDefault();
    alert("Date added logic would go here!");
  };

  return (
    <div className="dates-page">
      <section className="card" style={{ marginBottom: '20px' }}>
        <h2>Special Dates 🎉</h2>
        <form onSubmit={handleAddDate} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
           <input type="text" placeholder="E.g., Anniversary, Trip..." value={newTitle} onChange={e => setNewTitle(e.target.value)} required className="form-input" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
           <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
           <button type="submit" className="primary-btn">Save Date ✨</button>
        </form>
      </section>

      <section className="card">
        <h3>Upcoming Countdowns</h3>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {specialDates.length > 0 ? specialDates.map(sd => (
            <div key={sd.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#fff0f5', borderRadius: '8px', borderLeft: '4px solid #ffb3c1' }}>
               <div>
                 <strong style={{ display: 'block', fontSize: '1.1rem' }}>{sd.name}</strong>
                 <small style={{ color: '#666' }}>{new Date(sd.date).toLocaleDateString()}</small>
               </div>
               <div style={{ background: '#fff', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', color: '#ff6b81', display: 'flex', alignItems: 'center' }}>
                 {Math.ceil((new Date(sd.date) - new Date()) / (1000 * 60 * 60 * 24))} Days
               </div>
            </div>
          )) : <p style={{ color: '#888' }}>No dates added yet.</p>}
        </div>
      </section>
    </div>
  );
}
