import React from 'react';
import { MapPin } from 'lucide-react';

export default function MissionCard() {
  return (
    <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
      <h3 style={{ color: 'var(--accent)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MapPin size={18} /> Mission
      </h3>
      <p style={{ color: 'var(--text-heading)', fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
        The people living below the Himalayas do not have enough water.
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
        Can you build a natural water system to help them?
      </p>
    </div>
  );
}
