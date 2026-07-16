import React, { useState } from 'react';
import MapViewScene from './MapViewScene';
import MissionCheckpoint from './MissionCheckpoint';
import RealWorldScene from './RealWorldScene';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function LostInTheCity({ onComplete }) {
  const [view, setView] = useState('intro'); // 'intro', 'map'
  const [checkpointStarted, setCheckpointStarted] = useState(false);

  const handleBack = () => {
    if (checkpointStarted) {
      setCheckpointStarted(false);
    } else if (view === 'map') {
      setView('intro');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '2rem' }}>
      
      {view === 'intro' ? (
        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap', minHeight: '60vh' }}>
          
          <div style={{ flex: '1 1 45%', minWidth: '320px', padding: '1rem' }}>
            <h1 style={{ fontSize: '3rem', color: 'var(--text-heading)', margin: '0 0 1.5rem 0', lineHeight: 1.1 }}>
              Finding Places with a Map
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Maps help us choose routes, reach destinations, and make decisions at road junctions. Let's see how a simple town map can help a boy navigate from the Railway Station.
            </p>
            <button 
              className="primary" 
              onClick={() => setView('map')}
              style={{ padding: '1.25rem 2.5rem', fontSize: '1.25rem', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold' }}
            >
              Start Exploring <ArrowRight size={24} />
            </button>
          </div>
          
          <div style={{ flex: '1 1 45%', minWidth: '320px', height: '450px', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--card-shadow)', border: '1px solid var(--border)' }}>
            <RealWorldScene hasStarted={false} />
          </div>

        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {/* Back Button for Map Phase */}
          <button 
            onClick={handleBack} 
            style={{ 
              position: 'absolute', 
              top: '-3rem', 
              left: 0, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              cursor: 'pointer', 
              fontSize: '0.9rem', 
              fontWeight: 'bold' 
            }}
          >
            <ArrowLeft size={16} /> {checkpointStarted ? 'Back to Map' : 'Back to Intro'}
          </button>

          {/* Interactive Map Journey */}
          {!checkpointStarted && (
            <MapViewScene onComplete={() => setCheckpointStarted(true)} />
          )}
          
          {/* MISSION CHECKPOINT */}
          {checkpointStarted && <MissionCheckpoint onComplete={onComplete} />}
        </div>
      )}
    </div>
  );
}
