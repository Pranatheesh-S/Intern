import React from 'react';
import { motion } from 'framer-motion';

const COUNTRIES = [
  { name: 'India', activeStops: [0, 1, 2, 5] },
  { name: 'Nepal', activeStops: [3] },
  { name: 'Bhutan', activeStops: [4] },
  { name: 'China (Tibet)', activeStops: [0, 1, 2, 3, 4, 5] },
  { name: 'Pakistan', activeStops: [0] },
  { name: 'Afghanistan', activeStops: [0] }
];

export default function CountryTracker({ currentStopIndex }) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      justifyContent: 'center'
    }}>
      {COUNTRIES.map((country) => {
        const isActive = country.activeStops.includes(currentStopIndex);
        const hasVisited = country.activeStops.some(stop => stop < currentStopIndex);
        
        let background = 'rgba(255, 255, 255, 0.05)';
        let border = '1px solid var(--card-border)';
        let color = 'var(--text-muted)';
        let boxShadow = 'none';

        if (isActive) {
          background = 'rgba(139, 92, 246, 0.2)';
          border = '1px solid var(--accent)';
          color = '#fff';
          boxShadow = '0 0 15px rgba(139, 92, 246, 0.4)';
        } else if (hasVisited) {
          background = 'rgba(255, 255, 255, 0.02)';
          border = '1px solid rgba(255, 255, 255, 0.1)';
          color = 'rgba(255, 255, 255, 0.4)';
        }

        return (
          <motion.div
            key={country.name}
            animate={{ background, border, color, boxShadow }}
            transition={{ duration: 0.5 }}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: isActive ? 'bold' : 'normal',
              backdropFilter: 'blur(4px)'
            }}
          >
            {country.name}
          </motion.div>
        );
      })}
    </div>
  );
}
