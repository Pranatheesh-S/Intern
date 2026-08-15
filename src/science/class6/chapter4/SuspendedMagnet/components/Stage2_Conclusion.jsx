import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sun, Navigation, ArrowRight, Flag } from 'lucide-react';

export default function Stage2_Conclusion({ onComplete }) {
  const handleFinish = () => {
    onComplete();
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      {/* Left Side: Illustration Area */}
      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Finding Directions</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Using the Sun to find our way.
          </p>
        </div>

        {/* Scene */}
        <div style={{ 
          width: '100%', 
          maxWidth: '500px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <img 
            src="/SuspendedMagnet/holding_compass.png" 
            alt="Holding a compass" 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* Right Side: Explanation */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
          <h4 style={{ color: 'var(--text-heading)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Navigation size={20} style={{ color: 'var(--accent)' }} /> 
            How do we know which way is North?
          </h4>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            If we notice the direction where the <strong>Sun rises</strong>, we know that is <strong>East</strong>. 
            Once we know East, we can figure out West (opposite), North (left of East), and South (right of East).
          </p>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            A freely suspended magnet will always align itself along the <strong>North-South</strong> axis. This makes magnets incredibly useful for navigation!
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
          className="glass-panel"
          style={{ padding: '1.5rem', background: 'var(--success-bg)', border: '1px solid var(--success-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <p style={{ margin: 0, color: 'var(--success)', fontSize: '0.95rem', fontWeight: '500', lineHeight: '1.5', textAlign: 'center' }}>
            You have successfully completed this activity!
          </p>
          <button 
            onClick={handleFinish}
            className="primary"
            style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: '#10b981', borderColor: '#10b981' }}
          >
            <Flag size={16} /> Finish Activity
          </button>
        </motion.div>
      </div>
    </div>
  );
}
