import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Calendar from '../components/Calendar/Calendar';

export default function Memories() {
  const { memories, uploadMemory } = useAppContext();
  const navigate = useNavigate();
  const [uploadFile, setUploadFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploadDate, setUploadDate] = useState('');

  const featuredStories = [
    { id: 'blue-poshak', title: 'Blue Poshak', image: '/assets/blue-poshak.jpg', tag: 'Traditional' },
    { id: 'cab-ride', title: 'The Cab Ride', image: '/assets/cab-memory.jpg', tag: 'Significant' },
    { id: 'new-year', title: 'NYE 2024', image: '/assets/new-year-party.jpg', tag: 'Celebration' },
  ];

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
      <section className="featured-section" style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '15px' }}>Featured Stories ✨</h2>
        <div className="stories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {featuredStories.map(story => (
            <div key={story.id} className="story-preview-card" onClick={() => navigate(`/memory/${story.id}`)} style={{ cursor: 'pointer', borderRadius: '20px', overflow: 'hidden', position: 'relative', height: '320px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', transition: 'transform 0.3s' }}>
              <img src={story.image} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px', color: 'white' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8 }}>{story.tag}</span>
                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{story.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '25px', alignItems: 'start' }}>
        <section className="card">
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
    </div>
  );
}

