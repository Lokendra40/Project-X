import React from 'react';

export default function Card({ title, children, className = '', linkTitle, onLinkClick }) {
  return (
    <section className={`card ${className}`}>
      {(title || linkTitle) && (
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          {title && <h2 className="card-title" style={{ margin: 0 }}>{title}</h2>}
          {linkTitle && (
            <button onClick={onLinkClick} style={{ background: 'none', border: 'none', color: '#ff6b81', cursor: 'pointer', fontWeight: 'bold' }}>
              {linkTitle}
            </button>
          )}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </section>
  );
}
