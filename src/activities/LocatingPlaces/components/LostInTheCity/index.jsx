import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import RealWorldScene from './RealWorldScene';
import MapViewScene from './MapViewScene';
import MissionCheckpoint from './MissionCheckpoint';

export default function LostInTheCity({ onComplete }) {
  const [activeScene, setActiveScene] = useState('real-world');
  const [hasStarted, setHasStarted] = useState(false);
  const [checkpointStarted, setCheckpointStarted] = useState(false);
  
  // Handlers to trigger the transition
  const handleTransitionToMap = () => {
    setActiveScene('transitioning');
    setTimeout(() => {
      setActiveScene('map-view');
    }, 850); // 850ms transition to match the CSS
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '2rem' }}>
      {/* MAP EXPLORATION BOX */}
      <div style={{ 
        width: '100%', 
        aspectRatio: '16/9',
        minHeight: '700px',
        maxHeight: '85vh',
        display: 'flex', 
        backgroundColor: 'var(--page-bg)',
        background: 'var(--page-bg-gradient)',
        borderRadius: '24px',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--card-shadow)',
        overflow: 'hidden' 
      }}>
      
      {/* LEFT PANEL */}
      <div style={{ 
        flex: '0 0 35%', 
        minWidth: '350px', 
        padding: '2rem 2.5rem', 
        borderRight: '1px solid var(--border)', 
        background: 'var(--card-bg)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        boxShadow: '4px 0 20px rgba(0,0,0,0.05)',
        overflowY: 'auto'
      }}>
        {/* Chapter Badge */}
        <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', background: 'var(--accent-bg)', color: 'var(--accent-text)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', alignSelf: 'flex-start', marginBottom: '2rem' }}>
          Theme A: India and the World
        </div>

        {/* Main Heading */}
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-heading)', margin: '0 0 1rem 0', lineHeight: 1.1 }}>
          Lost in a New Town
        </h1>

        {/* Description */}
        <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          <p style={{ margin: '0 0 0.75rem 0' }}>Imagine you have arrived in a new town for the first time.</p>
          <p style={{ margin: '0 0 0.75rem 0' }}>You need to reach your new school.</p>
          <p style={{ margin: 0 }}>Can you find the correct route?</p>
        </div>

        {/* Mission Card */}
        <div style={{ background: 'var(--surface)', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: 'auto' }}>
          <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={18} /> Mission
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--text-muted)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>Starting Point</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>🚉 Railway Station</div>
              </div>
            </div>
            
            <div style={{ width: '2px', height: '24px', background: 'var(--border)', margin: '0 0 0 5px' }} />

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--accent)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>Destination</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>🏫 School</div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Button */}
        <div style={{ height: '60px', marginTop: '1.5rem', display: 'flex', alignItems: 'center' }}>
          {activeScene === 'real-world' && !hasStarted && (
            <button 
              className="primary" 
              onClick={() => setHasStarted(true)}
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '12px', transition: 'transform 0.2s', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Start Exploring
            </button>
          )}
        </div>
      </div>

      {/* RIGHT PANEL - Interactive Hero Area */}
      <div style={{ 
        flex: 1, 
        position: 'relative', 
        overflow: 'hidden',
        background: '#1a1a1a'
      }}>
        {/* Real World Scene - Slides down to simulate camera moving UP */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          transition: 'transform 850ms cubic-bezier(0.4, 0, 0.2, 1), opacity 850ms ease-in-out',
          transform: activeScene === 'transitioning' || activeScene === 'map-view' ? 'translateY(100%) scale(0.95)' : 'translateY(0) scale(1)',
          opacity: activeScene === 'transitioning' || activeScene === 'map-view' ? 0 : 1,
          pointerEvents: activeScene === 'real-world' ? 'auto' : 'none'
        }}>
          <RealWorldScene 
            hasStarted={hasStarted}
            onDiscoverMap={handleTransitionToMap}
          />
        </div>

        {/* Map View Scene - Slides down from top to simulate camera settling */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          transition: 'transform 850ms cubic-bezier(0.4, 0, 0.2, 1), opacity 850ms ease-in-out',
          transform: activeScene === 'real-world' ? 'translateY(-100%) scale(1.05)' : 'translateY(0) scale(1)',
          opacity: activeScene === 'real-world' ? 0 : 1,
          pointerEvents: activeScene === 'map-view' ? 'auto' : 'none'
        }}>
          {activeScene !== 'real-world' && <MapViewScene onComplete={() => setCheckpointStarted(true)} />}
        </div>

      </div>
    </div>
      
      {/* MISSION CHECKPOINT */}
      {checkpointStarted && <MissionCheckpoint onComplete={onComplete} />}
    </div>
  );
}
