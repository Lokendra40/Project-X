import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const STORIES = {
  'blue-poshak': {
    title: "💙 Styled Memory Showcase",
    tag: "Product Demo Story",
    theme: "blue-theme",
    image: "/assets/blue-poshak.jpg",
    content: [
      "This page shows how a couple can give one photo its own atmosphere, title, and written memory. It works especially well for moments that feel visually special, like a celebration, traditional look, event outfit, or a photo that changed the mood of the relationship in a memorable way.",
      "Instead of leaving this kind of moment inside a chat thread, the story page lets both people keep the image, the context, and the emotional meaning together in one place. It turns a single photo into part of a shared archive."
    ]
  },
  'cab-ride': {
    title: "🚕 Shared Memory Page",
    tag: "Product Demo Story",
    theme: "cab-theme",
    image: "/assets/cab-memory.jpg",
    content: [
      "This page is a demo of how one memory can hold both the photo and the full story behind it. A couple can use this area to save what happened, how it felt, why the moment mattered, and what they want to remember years later.",
      "Instead of keeping everything inside a caption, the memory page gives space for detail: where it happened, what changed in that moment, and why the photo still means something. It is meant to feel private, calm, and worth coming back to."
    ]
  },
  'new-year': {
    title: "✨ NYE 2024 Celebration",
    tag: "New Beginning",
    theme: "dark-theme",
    image: "/assets/new-year-party.jpg",
    content: [
      "The night we promised to make every tomorrow better than today. Surrounded by lights and laughter, but only focused on each other.",
      "A memory etched in gold and shadow, marking the start of a beautiful journey together."
    ]
  }
};

export default function MemoryStory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const story = STORIES[id];

  if (!story) return <div className="card"><h2>Story not found</h2><button onClick={() => navigate('/memories')}>Back</button></div>;

  return (
    <div className={`memory-story-container ${story.theme}`}>
      <button className="back-btn" onClick={() => navigate('/memories')}>← Back to Memories</button>
      
      <article className="interior-story-card">
        <div className="story-header">
           <span className="story-tag">{story.tag}</span>
           <h1 className="story-fancy-title">{story.title}</h1>
        </div>
        
        <div className="story-image-wrapper">
          <img src={story.image} alt={story.title} className="story-main-image" />
          <div className="image-overlay-glow"></div>
        </div>
        
        <div className="story-body">
          {story.content.map((p, i) => (
            <p key={i} className="story-text">{p}</p>
          ))}
        </div>
        
        <div className="story-footer">
           <div className="signature">Forever & Always</div>
        </div>
      </article>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Manrope:wght@400;600;800&display=swap');
        
        .memory-story-container {
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          animation: fadeIn 0.8s ease-out;
        }
        
        .back-btn {
          align-self: flex-start;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 10px 20px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          backdrop-filter: blur(5px);
        }
        
        .back-btn:hover {
          background: rgba(255,255,255,0.2);
          transform: translateX(-5px);
        }
        
        .interior-story-card {
          max-width: 800px;
          width: 100%;
          background: var(--card-bg);
          border-radius: 40px;
          padding: 3rem;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .story-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        
        .story-tag {
          font-family: 'Manrope', sans-serif;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.8rem;
          font-weight: 800;
          opacity: 0.6;
          display: block;
          margin-bottom: 0.5rem;
        }
        
        .story-fancy-title {
          font-family: 'Manrope', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0;
          color: var(--text-main);
          letter-spacing: -1px;
        }
        
        .story-image-wrapper {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 3rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        
        .story-main-image {
          width: 100%;
          display: block;
          transition: transform 0.8s ease;
        }
        
        .interior-story-card:hover .story-main-image {
          transform: scale(1.03);
        }
        
        .story-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          line-height: 1.8;
          font-size: 1.15rem;
          color: var(--text-main);
          opacity: 0.9;
        }
        
        .story-footer {
          margin-top: 4rem;
          text-align: center;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 2rem;
        }
        
        .signature {
          font-family: 'Great Vibes', cursive;
          font-size: 2.5rem;
          opacity: 0.7;
          color: var(--primary);
        }
        
        /* Themes */
        .blue-theme { background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%); }
        .cab-theme { background: linear-gradient(135deg, #fef9c3 0%, #fffbeb 100%); }
        .dark-theme { background: #0f172a; color: white; }
        .dark-theme .story-fancy-title { color: white; }
        .dark-theme .back-btn { color: white; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
