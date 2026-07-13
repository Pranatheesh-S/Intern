import React, { useState } from 'react';
import { Map, Compass, Navigation } from 'lucide-react';
import mapBg from './assets/Map.png';

export default function MapViewScene({ onComplete }) {
  const [showRoute, setShowRoute] = useState(false);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#f8fafc', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      {/* Background Map Image Container */}
      <div style={{ position: 'relative', width: '100%', height: '100%', maxWidth: '1200px' }}>
        <img 
          src={mapBg} 
          alt="Town Map" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
        />

        {/* Animated Path Overlay */}
        {showRoute && (
          <svg 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            {/* Accurate path from Railway Station to School */}
            <path 
              d="M 16 38 L 16 42 L 83 42 L 83 34" 
              fill="none" 
              stroke="#2563eb" 
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1.5 2.5"
              style={{ 
                animation: 'march 1s linear infinite, fadeIn 0.8s ease-out forwards',
                filter: 'drop-shadow(0 0 1px rgba(37, 99, 235, 0.8))',
                opacity: 0
              }}
            />
          </svg>
        )}
      </div>

      {/* UI OVERLAYS */}


      {/* Find Route Button */}
      {!showRoute && (
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}>
          <button 
            onClick={() => setShowRoute(true)}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4), 0 0 0 4px rgba(255,255,255,0.8)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
          >
            <Navigation size={20} />
            Find Route
          </button>
        </div>
      )}

      {/* Continue Button (appears after route is found) */}
      {showRoute && (
        <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 30, animation: 'fadeInDelay 1s ease-out forwards', opacity: 0 }}>
          <button 
            onClick={onComplete}
            style={{
              background: '#16a34a', // Green for continuation
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(22, 163, 74, 0.4), 0 0 0 4px rgba(255,255,255,0.8)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Continue with quiz
          </button>
        </div>
      )}

      <style>
        {`
          @keyframes march {
            from { stroke-dashoffset: 4; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeInDelay {
            0%, 50% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
