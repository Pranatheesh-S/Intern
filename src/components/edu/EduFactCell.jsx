import React from 'react';

/** Single cell in the 2-column fact grid on chapter spread pages. */
export default function EduFactCell({ label, title, description, wide = false, className = '' }) {
  return (
    <div className={`edu-fact-cell cell${wide ? ' wide' : ''} ${className}`.trim()}>
      {label && <div className="label">{label}</div>}
      {title && <div className="h">{title}</div>}
      {description && <div className="sub">{description}</div>}
    </div>
  );
}
