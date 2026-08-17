import React from 'react';

/** "Did You Know?" / highlight fact card used across chapter spreads. */
export default function EduFactCard({ icon = '💡', title = 'Did You Know?', children, className = '' }) {
  return (
    <div className={`edu-fact-card fact-card ${className}`.trim()}>
      <div className="icon" aria-hidden="true">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{children}</p>
      </div>
    </div>
  );
}
