import React from 'react';
import { motion } from 'framer-motion';

const STOPS = [
  { icon: '🏔', label: 'Himalayas' },
  { icon: '🌾', label: 'Plains' },
  { icon: '🏜', label: 'Desert' },
  { icon: '⛰', label: 'Plateau' },
  { icon: '🌊', label: 'Coast' },
  { icon: '🏝', label: 'Islands' },
  { icon: '🌧', label: 'Northeast' }
];

export default function ProgressTracker({ currentStopIndex }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'var(--card-bg)',
      backdropFilter: 'blur(10px)',
      padding: '0.75rem 1.5rem',
      borderRadius: '50px',
      border: '1px solid var(--card-border)',
      zIndex: 20
    }}>
      {STOPS.map((stop, index) => {
        const isReached = currentStopIndex >= index;
        const isActive = currentStopIndex === index;
        
        return (
          <React.Fragment key={stop.label}>
            <motion.div
              animate={{
                scale: isActive ? 1.2 : 1,
                opacity: isReached ? 1 : 0.4,
                filter: isActive ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none'
              }}
              style={{
                fontSize: '1.25rem',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {stop.icon}
            </motion.div>
            
            {index < STOPS.length - 1 && (
              <div style={{
                width: '30px',
                height: '2px',
                background: 'var(--border-light)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: currentStopIndex > index ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    background: '#8b5cf6',
                    boxShadow: '0 0 5px #8b5cf6'
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
