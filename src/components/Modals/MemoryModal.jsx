import React from 'react';

export default function MemoryModal({ selectedDate, memories, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
      background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', 
      alignItems: 'center', zIndex: 1000
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        background: '#fff', padding: '20px', borderRadius: '12px', 
        maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto', position: 'relative'
      }}>
        <button className="close-btn" onClick={onClose} style={{
          position: 'absolute', top: '10px', right: '10px', background: 'none', 
          border: 'none', fontSize: '20px', cursor: 'pointer'
        }}>✕</button>
        
        <h3 style={{ marginTop: '10px' }}>Memories for {selectedDate}</h3>
        
        <div className="modal-memories" style={{ marginTop: '20px' }}>
           {memories.length > 0 ? (
             memories.map(m => (
               <div key={m.id} style={{marginBottom: '20px'}}>
                 {m.imageUrl && <img src={m.imageUrl} style={{width: '100%', borderRadius: '8px'}} alt="memory" />}
                 <p style={{textAlign: 'center', fontStyle: 'italic', marginTop: '10px'}}>{m.caption}</p>
               </div>
             ))
           ) : <p style={{ color: '#888' }}>No memories uploaded on this day yet.</p>}
        </div>
      </div>
    </div>
  );
}
