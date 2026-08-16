import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const DISTANCES = [0, 420, 900, 1450, 1850, 2500];

export default function DistanceCounter({ targetDistance, duration = 1000 }) {
  const [displayDistance, setDisplayDistance] = useState(0);

  useEffect(() => {
    let start = displayDistance;
    const end = targetDistance;
    if (start === end) return;
    
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeInOutQuad
      const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      setDisplayDistance(Math.floor(start + (end - start) * easeProgress));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [targetDistance, duration]);

  return (
    <div style={{
      background: 'var(--card-bg)',
      backdropFilter: 'blur(10px)',
      border: '1px solid var(--card-border)',
      padding: '1rem',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '150px'
    }}>
      <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Distance Travelled
      </h5>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
        <span style={{ color: 'var(--text-heading)', fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
          {displayDistance}
        </span>
        <span style={{ color: 'var(--accent)', fontSize: '1rem', fontWeight: 'bold' }}>
          km
        </span>
      </div>
    </div>
  );
}
