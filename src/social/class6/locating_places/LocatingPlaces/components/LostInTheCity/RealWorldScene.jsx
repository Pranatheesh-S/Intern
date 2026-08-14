import React from 'react';
import { Map, Navigation } from 'lucide-react';
import townBg from './assets/cartoon_street_view_simple.png';

export default function RealWorldScene({ hasStarted, onDiscoverMap }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Background Image - Bustling Street */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url(${townBg})`, // Generated Indian street scene with distinct path to school
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: hasStarted ? 'brightness(0.75)' : 'brightness(1)',
        transition: 'filter 0.5s ease'
      }} />

      {/* Subtle gradient overlay to ensure text readability */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.5) 100%)',
        pointerEvents: 'none'
      }} />

      {/* UI Elements that appear when exploring */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '2.5rem',
        opacity: hasStarted ? 1 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: hasStarted ? 'auto' : 'none'
      }}>
        
        {/* Top bar with objective */}
        <div style={{
          alignSelf: 'center',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(12px)',
          padding: '1rem 2rem',
          borderRadius: '30px',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <Navigation size={20} style={{ color: '#60a5fa' }} />
          <span style={{ fontSize: '1.1rem', fontWeight: '500', letterSpacing: '0.3px' }}>
            Look around the town to find a way to navigate.
          </span>
        </div>

        {/* AR Marker for Tourist Board / Map */}
        <div style={{
          position: 'absolute',
          top: '55%',
          left: '35%', // Positioned as if on a wall or board in the background
          transform: 'translate(-50%, -50%)'
        }}>
          <button
            onClick={onDiscoverMap}
            style={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,1)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4), 0 0 0 6px rgba(255,255,255,0.2)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              color: '#0f172a'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.5), 0 0 0 8px rgba(255,255,255,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4), 0 0 0 6px rgba(255,255,255,0.2)';
            }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '50%',
              marginBottom: '0.25rem',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
            }}>
              <Map size={32} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
              <span style={{ fontWeight: '700', fontSize: '1.2rem', color: '#1e293b' }}>Town Map</span>
              <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}>Click to examine</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
