import React from 'react';
import { motion } from 'framer-motion';

const STOPS = [
  'Kashmir',
  'Himachal',
  'Uttarakhand',
  'Nepal',
  'Bhutan',
  'Arunachal'
];

export default function HimalayaProgressTimeline({ currentStopIndex }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '1rem 0'
    }}>
      {STOPS.map((stop, i) => {
        const isCompleted = currentStopIndex > i;
        const isActive = currentStopIndex === i;
        
        let color = 'var(--text-muted)';
        if (isCompleted) color = '#10B981'; // Green
        else if (isActive) color = 'var(--accent)';

        return (
          <React.Fragment key={stop}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
              
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: color,
                boxShadow: isActive ? '0 0 10px var(--accent)' : 'none',
                position: 'relative'
              }}>
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      borderRadius: '50%',
                      background: 'var(--accent)'
                    }}
                  />
                )}
              </div>
              
              <span style={{
                position: 'absolute',
                top: '20px',
                fontSize: '0.7rem',
                color,
                fontWeight: isActive || isCompleted ? 'bold' : 'normal',
                whiteSpace: 'nowrap'
              }}>
                {stop}
              </span>
            </div>

            {i < STOPS.length - 1 && (
              <div style={{
                width: '40px',
                height: '2px',
                background: currentStopIndex > i ? '#10B981' : 'var(--border)',
                margin: '0 8px',
                marginBottom: '15px'
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
