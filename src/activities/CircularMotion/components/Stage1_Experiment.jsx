import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCw, ArrowRight } from 'lucide-react';

export default function Stage1_Experiment({ onComplete }) {
  const [isWhirling, setIsWhirling] = useState(false);
  const [hasWhirled, setHasWhirled] = useState(false);

  const handleWhirl = () => {
    setIsWhirling(true);
    setHasWhirled(true);
    // After a few seconds of whirling, enable the next button
    setTimeout(() => {
      setIsWhirling(false);
    }, 4000); // 4 seconds of whirling
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', fontSize: '1.5rem' }}>Let us investigate Circular Motion</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Tie an eraser (or a potato) to one end of a thread. Hold the other end of the thread with your hand and whirl it.
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-color)',
        borderRadius: '12px',
        padding: '3rem',
        border: '1px solid var(--border)',
        minHeight: '400px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Canvas for whirling */}
        <div style={{
          position: 'relative',
          width: '300px',
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Circular path guide (optional, faint) */}
          <div style={{
            position: 'absolute',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            border: '2px dashed rgba(255, 255, 255, 0.1)',
            pointerEvents: 'none'
          }} />

          {/* Pivot point (hand) */}
          <div style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'var(--accent)',
            zIndex: 10,
            boxShadow: '0 0 10px var(--accent)'
          }} />

          {/* Rotating container for string and eraser */}
          <motion.div
            style={{
              position: 'absolute',
              width: '240px',
              height: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              originX: 0.5, // Center of the container
            }}
            animate={{
              rotate: isWhirling ? 360 * 4 : 0 // Rotate 4 times if whirling
            }}
            transition={{
              duration: isWhirling ? 4 : 0,
              ease: "linear",
              repeat: isWhirling ? Infinity : 0
            }}
          >
            {/* The string (from center to right edge) */}
            <div style={{
              position: 'absolute',
              right: '20px', // End of the string
              left: '120px', // Center pivot
              height: '2px',
              background: '#9ca3af', // Gray string
            }} />

            {/* The eraser */}
            <div style={{
              width: '40px',
              height: '30px',
              background: '#f87171', // Redish eraser
              borderRadius: '4px',
              border: '2px solid #ef4444',
              zIndex: 11,
              marginRight: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '0.6rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}>
              Eraser
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', zIndex: 20 }}>
          <button 
            className="primary" 
            onClick={handleWhirl}
            disabled={isWhirling}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
          >
            {isWhirling ? <RotateCw className="spin" size={18} /> : <Play size={18} />}
            {isWhirling ? "Whirling..." : "Whirl the Eraser"}
          </button>
        </div>

      </div>

      {hasWhirled && !isWhirling && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}
        >
          <button 
            className="primary" 
            onClick={onComplete}
            style={{ 
              background: 'var(--success)', 
              borderColor: 'var(--success-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem'
            }}
          >
            I've observed the motion <ArrowRight size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
}
// ArrowRight import missing, I will add it via multi_replace later or just add it now. Wait, I can't multi_replace easily if it's not created yet. I will fix it by re-creating or just doing it right the first time.
