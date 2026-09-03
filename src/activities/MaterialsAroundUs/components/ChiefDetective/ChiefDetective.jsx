import React, { useState, useEffect } from 'react';
import MissionCard from './MissionCard';
import RewardCard from './RewardCard';
import './animations.css';

// We use the image from the appDataDir (for local testing you might need to copy it to public, but we'll use a placeholder or relative path here)
const BLAKE_IMG_URL = '/images/chief_detective_blake.png'; // Assume we will copy the image here

export default function ChiefDetective({ 
  mode, // 'mission' or 'debrief'
  data, // The mission or debrief data object
  onContinue,
  isUnlocked = true // Used to trigger unlock animations if transitioning
}) {
  const [stampVisible, setStampVisible] = useState(false);

  useEffect(() => {
    if (mode === 'debrief') {
      const timer = setTimeout(() => {
        setStampVisible(true);
      }, 500); // Stamp appears after 0.5s
      return () => clearTimeout(timer);
    } else {
      setStampVisible(false);
    }
  }, [mode]);

  // Determine Blake's state based on mode
  let blakeClass = 'blake-idle';
  if (mode === 'debrief') {
    blakeClass = 'blake-celebrate';
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="blake-container">
        {/* Left: Character Sprite */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <img 
            src={BLAKE_IMG_URL} 
            alt="Chief Detective Blake" 
            className={`blake-sprite ${blakeClass}`} 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500.png?text=Chief+Detective+Blake'; }}
          />
        </div>

        {/* Right: Tablet Interface */}
        <div className="investigation-tablet fade-slide-up">
          <div className="tablet-header">
            <span>FuturaX Inv. OS</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          
          <div className="tablet-screen">
            {mode === 'mission' && (
              <MissionCard mission={data} onAccept={onContinue} />
            )}
            
            {mode === 'debrief' && (
              <RewardCard debrief={data} onContinue={onContinue} />
            )}
          </div>
          
          {/* Stamp overlay on top of tablet */}
          {stampVisible && mode === 'debrief' && (
            <div className="case-stamp-container">
              <div className={`case-stamp ${data.isFinal ? 'success' : ''}`}>
                {data.isFinal ? 'CASE CLOSED' : `CASE ${data.barrier} SOLVED`} ✓
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
