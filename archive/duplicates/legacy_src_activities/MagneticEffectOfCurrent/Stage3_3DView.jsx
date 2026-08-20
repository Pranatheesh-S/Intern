import React from 'react';
import ThreeDViewer from './ThreeDViewer';
import { Info } from 'lucide-react';

export default function Stage3_3DView({ onComplete }) {
  const [compassPosition, setCompassPosition] = React.useState("below");

  const toggleCompassPosition = () => {
    setCompassPosition(prev => prev === "below" ? "above" : "below");
  };
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '480px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <span className="status-badge neutral" style={{ background: "var(--accent-bg)", color: "var(--accent-text)", fontWeight: "bold" }}>
            Stage 3: 3D Visualization
          </span>
          <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.25rem' }}>Explore the Circuit in 3D</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Rotate and zoom to see how the components are physically arranged.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "1.5rem", alignItems: "stretch", flex: 1, minHeight: '500px' }}>
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <ThreeDViewer componentId="fullCircuit" compassPosition={compassPosition} onToggleCompassPosition={toggleCompassPosition} />
          </div>
          
          {/* Overlay Buttons on Right Side */}
          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', flexDirection: 'row', gap: '12px', zIndex: 10 }}>
            <button 
              className="secondary" 
              onClick={toggleCompassPosition}
              style={{ padding: '0.75rem 1.2rem', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer', background: 'rgba(30, 41, 59, 0.85)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(4px)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)' }}
            >
              {compassPosition === "below" ? "Move Compass Above Wire" : "Move Compass Below Wire"}
            </button>
            <button 
              className="primary" 
              onClick={onComplete}
              style={{ padding: '0.75rem 1.2rem', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)' }}
            >
              Continue to Quiz
            </button>
          </div>
        </div>

        {/* Right Side Panel */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height: '100%', boxSizing: 'border-box' }}>
            <h4 style={{ margin: '0 0 1.25rem 0', color: 'var(--accent)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={24} /> Scientific Reason
            </h4>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
              A compass needle always aligns with the magnetic field around it. When electric current flows through the wire, it creates a circular magnetic field whose direction is opposite above and below the wire. Therefore, the compass needle deflects in different directions depending on whether it is placed above or below the current-carrying wire.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
