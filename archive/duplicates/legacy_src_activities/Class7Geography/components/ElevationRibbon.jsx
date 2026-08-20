import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ElevationRibbon({ currentStopIndex, totalStops }) {
  const isComplete = currentStopIndex >= totalStops - 1;
  
  // Create an array of 40 bars to represent the mountain wall
  const bars = Array.from({ length: 40 }).map((_, i) => {
    // Math to create a mountain-like profile
    const normalized = i / 40;
    const baseHeight = Math.sin(normalized * Math.PI) * 40;
    const noise = Math.random() * 15;
    return baseHeight + noise + 10;
  });

  // Calculate how many bars to reveal based on progress
  const progressRatio = currentStopIndex / (totalStops - 1 || 1);
  const visibleBarsCount = Math.floor(progressRatio * 40);

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '2px',
        height: '60px',
        width: '100%'
      }}>
        {bars.map((height, i) => {
          const isVisible = i <= visibleBarsCount;
          return (
            <motion.div
              key={i}
              initial={{ height: 4, opacity: 0.2 }}
              animate={{ 
                height: isVisible ? height : 4,
                opacity: isVisible ? 1 : 0.2,
                background: isVisible ? 'var(--accent)' : 'var(--border)'
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                width: '6px',
                borderRadius: '3px 3px 0 0'
              }}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              textAlign: 'center',
              fontStyle: 'italic',
              background: 'rgba(139, 92, 246, 0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}
          >
            The Himalayas form a massive natural mountain wall across northern India.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
