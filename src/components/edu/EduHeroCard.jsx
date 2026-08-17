import React from 'react';

/** Blue-accent intro card on the right panel of chapter spreads. */
export default function EduHeroCard({ title, children, className = '' }) {
  return (
    <div className={`edu-hero-card hero-card ${className}`.trim()}>
      {title && <h2>{title}</h2>}
      {typeof children === 'string' ? <p>{children}</p> : children}
    </div>
  );
}
