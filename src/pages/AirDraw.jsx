import React from 'react';

export default function AirDraw() {
  return (
    <div className="airdraw-container" style={{ height: 'calc(100vh - 100px)', borderRadius: '16px', overflow: 'hidden', background: '#000', position: 'relative' }}>
      <iframe 
        src="./air-draw/index.html" 
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          borderRadius: '16px'
        }}
        title="AirDraw AI"
        allow="camera"
      />
    </div>
  );
}

