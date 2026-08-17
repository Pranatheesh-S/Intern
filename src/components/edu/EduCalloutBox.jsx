import React from 'react';

/** Orange or green callout box on chapter spread pages. */
export default function EduCalloutBox({ variant = 'orange', title, children, className = '' }) {
  const tone = variant === 'green' ? 'green' : 'orange';
  return (
    <div className={`edu-callout-box box ${tone} ${className}`.trim()}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}
