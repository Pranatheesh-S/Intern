import React, { useState, useEffect } from 'react';
import { Sparkles, Maximize2, Minimize2 } from 'lucide-react';

export default function Earth3DGlobe() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  return (
    <div style={{
      position: isFullScreen ? 'fixed' : 'relative',
      top: isFullScreen ? 0 : 'auto',
      left: isFullScreen ? 0 : 'auto',
      width: isFullScreen ? '100vw' : '100%',
      height: isFullScreen ? '100vh' : '100%',
      zIndex: isFullScreen ? 99999 : 1,
      minHeight: 0,
      background: '#000000',
      borderRadius: isFullScreen ? 0 : '16px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: isFullScreen ? 'none' : '0 10px 30px rgba(14,42,69,0.3)',
      userSelect: 'none',
      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* Top Header Badge & Fullscreen Button */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '14px',
        right: '14px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }}>
        <div style={{
          background: '#D97706',
          color: '#ffffff',
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontWeight: 800,
          fontSize: '11.5px',
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          padding: '6px 14px',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 12px rgba(217, 119, 6, 0.4)',
          pointerEvents: 'auto'
        }}>
          <Sparkles size={13} color="#ffffff" />
          <span>ANCIENT INDIAN ASTRONOMY</span>
        </div>

        <button
          type="button"
          onClick={() => setIsFullScreen(!isFullScreen)}
          title={isFullScreen ? 'Exit Full Screen (Esc)' : 'View Full Screen'}
          aria-label={isFullScreen ? 'Exit Full Screen' : 'View Full Screen'}
          style={{
            background: 'rgba(255,255,255,0.92)',
            color: '#0F172A',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            pointerEvents: 'auto',
            transition: 'transform 0.15s'
          }}
        >
          {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Embed Interactive 3D Globe Folder Model */}
      <iframe
        src="/interactive-3d-globe/index.html"
        title="Interactive 3D Earth Globe Model"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
          flex: '1 1 auto',
          background: '#000000'
        }}
      />

      {/* Bottom Caption matching Screenshot */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '14px',
        right: '14px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#ffffff',
        fontFamily: '"Fraunces", Georgia, serif',
        fontWeight: 700,
        fontSize: '13.5px',
        textShadow: '0 2px 8px rgba(0,0,0,0.95)',
        pointerEvents: 'none'
      }}>
        <span>Earth from space — a spherical globe in the cosmos</span>
        <span style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '11.5px',
          fontWeight: 600,
          color: '#FEF08A',
          opacity: 0.95
        }}>
          💡 Drag to Rotate · Scroll to Zoom
        </span>
      </div>
    </div>
  );
}
