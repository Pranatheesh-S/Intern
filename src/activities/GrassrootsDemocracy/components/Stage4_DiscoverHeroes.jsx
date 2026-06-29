import React, { useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';

export default function Stage4_DiscoverHeroes({ onComplete, addXp }) {
  const heroes = [
    { name: 'Dnyaneshwar Kamble', desc: 'First transgender Sarpanch in Maharashtra (2017). "Service to the village is service to the public."' },
    { name: 'Vandana Bahadur Maida', desc: 'First female Sarpanch of Khankhandvi. Addressed critical issues like education and sanitation.' },
    { name: 'Popatrao Baguji Pawar', desc: 'Used rainwater harvesting and tree planting to transform Hiware Bazar into a green village.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Discover · Real Changemakers
        </div>
        <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-heading)' }}>
          Exemplary Sarpanchs
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {heroes.map((hero, i) => (
          <div key={i} className="glass-panel" style={{ padding: '1.5rem', background: 'var(--card-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#eab308' }}>
              <Star size={20} fill="#eab308" />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>{hero.name}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{hero.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Step 4 of 7</span>
        <button onClick={() => { addXp(10); onComplete(); }} className="primary" style={{ padding: '0.8rem 1.5rem', gap: '0.5rem', borderRadius: '8px' }}>
          Next Step <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
