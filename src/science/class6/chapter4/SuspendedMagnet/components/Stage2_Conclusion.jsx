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
          position: 'relative', 
          width: '100%', 
          maxWidth: '500px', 
          height: '350px', 
          background: 'linear-gradient(to bottom, #38bdf8 0%, #bae6fd 60%, #4ade80 60%, #22c55e 100%)', // Sky to grass
          border: '1px solid var(--border)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
        }}>
          {/* Sun (East) */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ position: 'absolute', top: '40px', right: '40px' }}
          >
            <Sun size={64} fill="#fde047" color="#eab308" />
            <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#854d0e', marginTop: '5px' }}>EAST</div>
          </motion.div>

          {/* West */}
          <div style={{ position: 'absolute', top: '70px', left: '40px', textAlign: 'center', fontWeight: 'bold', color: '#0369a1' }}>
            WEST
          </div>

          {/* North */}
          <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', fontWeight: 'bold', color: '#1e293b' }}>
            NORTH
          </div>

          {/* South */}
          <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', fontWeight: 'bold', color: '#1e293b' }}>
            SOUTH
          </div>

          {/* Suspended Magnet */}
          <div style={{ position: 'absolute', top: '150px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '2px', height: '60px', background: '#475569' }} />
            <motion.div 
              initial={{ rotate: 0 }}
              animate={{ rotate: 90 }}
              transition={{ duration: 2, delay: 1, type: "spring" }}
              style={{ display: 'flex', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', borderRadius: '2px', overflow: 'hidden' }}
            >
              <div style={{ width: '40px', height: '15px', background: '#ef4444', color: 'white', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>N</div>
              <div style={{ width: '40px', height: '15px', background: '#3b82f6', color: 'white', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>S</div>
            </motion.div>
          </div>

          {/* Compass overlay */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.5, type: 'spring' }}
            style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(255,255,255,0.8)', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Compass size={40} color="#334155" />
          </motion.div>
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
