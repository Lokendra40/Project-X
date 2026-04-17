import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
  const { userData } = useAuth();
  const { messages, sendMessage } = useAppContext();
  const [newMessage, setNewMessage] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      await sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <section className="card" style={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
      <h2>Love Chat 💬</h2>
      
      <div style={{ flex: 1, overflowY: 'auto', background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.length === 0 && <p style={{ textAlign: 'center', color: '#999' }}>No messages yet. Send a lovely note!</p>}
        {messages.map((msg) => {
           const isMine = msg.senderId === userData?.uid;
           return (
            <div key={msg.id} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
              <span style={{ 
                background: isMine ? '#ffb3c1' : '#fff', 
                color: isMine ? '#fff' : '#333',
                padding: '10px 15px', 
                borderRadius: isMine ? '15px 15px 0 15px' : '15px 15px 15px 0', 
                display: 'inline-block',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                border: isMine ? 'none' : '1px solid #eee'
              }}>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '4px', textAlign: isMine ? 'right' : 'left' }}>
                  {isMine ? 'You' : msg.senderName} 
                </div>
                {msg.text}
              </span>
            </div>
          );
        })}
      </div>
      
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          placeholder="Type a sweet message..." 
          style={{ flex: 1, padding: '15px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none' }} 
        />
        <button type="submit" className="primary-btn" style={{ borderRadius: '25px', padding: '0 25px' }}>Send 💌</button>
      </form>
    </section>
  );
}
