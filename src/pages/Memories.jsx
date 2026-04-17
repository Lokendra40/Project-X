import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Calendar from '../components/Calendar/Calendar';

export default function Memories() {
  const { memories, uploadMemory } = useAppContext();
  const [uploadFile, setUploadFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploadDate, setUploadDate] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadDate) return alert("Please select a date.");
    await uploadMemory(uploadFile, caption, uploadDate);
    setUploadFile(null);
    setCaption('');
    setUploadDate('');
    alert("Memory pinned to timeline!");
  };

  return (
    <div className="memories-page">
      <section className="card" style={{ marginBottom: '20px' }}>
        <h2>Create Memory 📸</h2>
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
          <input type="file" onChange={(e) => setUploadFile(e.target.files[0])} required className="form-input" style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }} />
          <input type="text" placeholder="Write a short caption (Max 1 line)..." maxLength="50" value={caption} onChange={(e) => setCaption(e.target.value)} required className="form-input" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
          <input type="date" value={uploadDate} onChange={(e) => setUploadDate(e.target.value)} required className="form-input" style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
          <button type="submit" className="primary-btn">Upload & Add to Calendar 🔥</button>
        </form>
      </section>

      <section className="card">
        <h2>Timeline 🗓️</h2>
        <Calendar memories={memories} />
      </section>
    </div>
  );
}
