import React, { useState } from 'react';
import MemoryModal from '../Modals/MemoryModal';

export default function Calendar({ memories }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    setShowModal(true);
  };

  const renderGrid = () => {
    const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const grid = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
       grid.push(<div key={`empty-${i}`} className="cal-cell empty border-none bg-transparent pointer-events-none"></div>);
    }
    
    for (let d = 1; d <= days; d++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const hasMemory = memories.find(m => m.date === dateStr);
      
      grid.push(
        <div key={d} className={`cal-cell ${hasMemory ? 'has-memory' : ''}`} onClick={() => handleDayClick(dateStr)}>
          {d}
          {hasMemory && <span className="cal-dot">❤️</span>}
        </div>
      );
    }
    return grid;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
         <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="secondary-btn">◀ Prev</button>
         <h3 style={{ margin: 0 }}>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
         <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="secondary-btn">Next ▶</button>
      </div>
      
      <div className="cal-grid">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="cal-header">{d}</div>)}
        {renderGrid()}
      </div>

      {showModal && (
        <MemoryModal 
          selectedDate={selectedDate} 
          memories={memories.filter(m => m.date === selectedDate)} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}
