import React from 'react';
import { ArrowRight, Scroll } from 'lucide-react';

export default function Stage6_Connect({ onComplete, addXp }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Connect · Ancient Blueprint
        </div>
        <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-heading)' }}>
          Governance in Ancient India
        </h2>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', background: 'var(--card-bg)', position: 'relative' }}>
        <Scroll size={40} style={{ position: 'absolute', top: '-20px', left: '20px', color: '#b45309' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          The <em>Arthaśāstra</em> is an ancient text of governance written by Kautilya (Chanakya) some 2,300 years ago. It describes an administrative structure from the village to the capital:
        </p>
        
        <div style={{ 
          background: 'rgba(180, 83, 9, 0.1)', borderLeft: '4px solid #b45309', padding: '1.5rem', 
          borderRadius: '0 8px 8px 0', marginTop: '1.5rem', fontStyle: 'italic', color: '#fcd34d' 
        }}>
          "The king shall establish a sangrahana (sub-district) for every 10 villages; a kārvatika (district) for every 100 villages; a dronamukha for every 400 villages; and a sthāniya (provincial) for every 800 villages."
        </div>

        <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6', fontWeight: 'bold' }}>
          Is it not amazing that a similar hierarchical structure was thought of so long ago? Our Panchayati Raj system is a modern reflection of these ancient roots!
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Step 6 of 7</span>
        <button onClick={() => { addXp(10); onComplete(); }} className="primary" style={{ padding: '0.8rem 1.5rem', gap: '0.5rem', borderRadius: '8px' }}>
          Final Reflection <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
