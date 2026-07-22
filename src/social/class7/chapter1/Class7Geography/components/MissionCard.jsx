import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';

const checklistItems = [
  "Explore Mountains",
  "Discover Plains",
  "Cross the Desert",
  "Climb the Plateau",
  "Visit the Coast",
  "Reach the Islands",
  "Explore the Northeast"
];

export default function MissionCard({ currentStopIndex }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2.5, ease: "easeOut" }}
      style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--accent-border)',
        borderRadius: '16px',
        padding: '1.25rem',
        marginTop: '1.5rem',
        boxShadow: 'var(--card-shadow)'
      }}
    >
      <h3 style={{ 
        color: '#a855f7', 
        fontSize: '0.85rem', 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em',
        margin: '0 0 0.5rem 0'
      }}>
        Mission Objective
      </h3>
      <p style={{ 
        color: 'var(--text-heading)', 
        fontSize: '1.25rem', 
        fontWeight: '500',
        margin: '0 0 1rem 0',
        lineHeight: '1.4'
      }}>
        Find out why India is called a Mini-Continent.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {checklistItems.map((item, index) => {
          const isReached = currentStopIndex >= index;
          
          return (
            <motion.div 
              key={item}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3 + (index * 0.15) }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                color: isReached ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
            >
              <motion.div
                initial={false}
                animate={{ 
                  backgroundColor: isReached ? '#8b5cf6' : 'transparent',
                  borderColor: isReached ? '#8b5cf6' : 'rgba(148, 163, 184, 0.4)'
                }}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isReached ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Check size={12} color="#ffffff" strokeWidth={3} />
                  </motion.div>
                ) : null}
              </motion.div>
              
              <span style={{ 
                fontSize: '0.95rem',
                transition: 'color 0.3s ease'
              }}>
                {item}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
