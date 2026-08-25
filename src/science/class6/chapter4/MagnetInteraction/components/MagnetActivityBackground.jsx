import React from 'react';
import morningBgUrl from './morning.jpg';

export default function MagnetActivityBackground({ style = {}, children }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        backgroundColor: '#02050D',
        backgroundImage: `url(${morningBgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        ...style
      }}
    >
      {/* Soft atmospheric overlay for UI contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 30%, transparent 50%, rgba(0, 0, 0, 0.25) 100%)',
          pointerEvents: 'none'
        }}
      />

      {children}
    </div>
  );
}