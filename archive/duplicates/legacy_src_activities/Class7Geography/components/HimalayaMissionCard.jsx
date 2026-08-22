import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

export default function HimalayaMissionCard({ currentStopIndex }) {
  const objectives = [
    { text: 'Start in Kashmir', minIndex: 0 },
    { text: 'Travel across the Himalayas', minIndex: 2 },
    { text: 'Visit six regions', minIndex: 5 },
    { text: 'Measure 2500 km', minIndex: 4 },
    { text: 'Reach Arunachal Pradesh', minIndex: 5 }
  ];

  return (
    <div style={{
      background: 'var(--card-bg)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--accent-border)',
      borderRadius: '16px',
      padding: '1.75rem',
      marginTop: '2rem',
      boxShadow: 'var(--card-shadow)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative gradient orb */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--accent)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Mission Objective
        </h3>
        
        <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-heading)', fontSize: '1.1rem', fontWeight: '500', lineHeight: 1.5 }}>
          Travel from Kashmir to Arunachal Pradesh. Discover the complete Himalayan Range.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {objectives.map((obj, i) => {
            const isCompleted = currentStopIndex >= obj.minIndex;
            
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)'
                }}
              >
                {isCompleted ? (
                  <CheckCircle size={18} color="var(--accent)" />
                ) : (
                  <Circle size={18} color="var(--text-muted)" opacity={0.5} />
                )}
                <span style={{ fontSize: '0.95rem', textDecoration: isCompleted ? 'line-through' : 'none', opacity: isCompleted ? 0.8 : 1 }}>
                  {obj.text}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
