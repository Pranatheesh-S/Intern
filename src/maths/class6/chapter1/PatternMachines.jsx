import React, { useState } from 'react';
import TrafficSignalActivity from './TrafficSignalActivity';
import ClockActivity from './ClockActivity';
import MoonDialActivity from './MoonDialActivity';

export default function PatternMachines({ onNext, onPrev }) {
  const [activityIndex, setActivityIndex] = useState(0);

  const handleNextActivity = () => {
    if (activityIndex < 2) {
      setActivityIndex(prev => prev + 1);
    } else {
      // Finished all 3 activities
      onNext();
    }
  };

  const handlePrevActivity = () => {
    if (activityIndex > 0) {
      setActivityIndex(prev => prev - 1);
    } else {
      onPrev();
    }
  };

  return (
    <div className="dark-coords-page" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      
      {/* Top Global Navigation Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        pointerEvents: 'none' // allow clicking through empty space
      }}>
        {/* Back Button */}
        <div style={{ width: '120px', display: 'flex', justifyContent: 'flex-start' }}>
          <button onClick={handlePrevActivity} style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(2, 6, 23, 0.7)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
        </div>

        {/* Global Progress Indicator */}
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          pointerEvents: 'auto'
        }}>
          {[0, 1, 2].map(idx => (
            <div key={idx} style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: activityIndex === idx ? '#3b82f6' : 'rgba(255,255,255,0.2)',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        {/* Next Button */}
        <div style={{ width: '120px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleNextActivity} style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            color: '#60a5fa',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            transition: 'all 0.2s'
          }}>
            {activityIndex === 2 ? 'Finish' : 'Next'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: '100%' }}>
        {activityIndex === 0 && <TrafficSignalActivity onNext={handleNextActivity} />}
        {activityIndex === 1 && <ClockActivity onNext={handleNextActivity} />}
        {activityIndex === 2 && <MoonDialActivity onNext={handleNextActivity} />}
      </div>
    </div>
  );
}
