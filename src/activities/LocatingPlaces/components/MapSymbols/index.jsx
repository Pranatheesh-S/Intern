import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import SymbolsChallenge from './SymbolsChallenge';
import { SYMBOL_GROUPS } from './symbolData';

export default function MapSymbols({ onComplete }) {
  const [showChallenge, setShowChallenge] = useState(false);

  if (showChallenge) {
    return <SymbolsChallenge onComplete={onComplete} onBack={() => setShowChallenge(false)} />;
  }

  return (
    <div style={{ padding: '2rem 3rem', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-block', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem', background: 'var(--accent-bg, rgba(99, 102, 241, 0.1))', padding: '0.35rem 0.85rem', borderRadius: '12px' }}>
          UNDERSTANDING MAPS
        </div>
        <h2 style={{ fontSize: '2rem', color: 'var(--text-heading)', margin: '0 0 1rem 0' }}>Map Symbols</h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Maps use small drawings called symbols to represent places and natural features. Symbols help us show many details clearly without making the map crowded.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
        {SYMBOL_GROUPS.map((group, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-heading)', margin: '0 0 1.25rem 0', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>{group.title}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
              {group.items.map((item, itemIdx) => (
                <div key={itemIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1.25rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', height: '100%' }}>
                  <div style={{ width: '80px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                    <item.Icon />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', fontWeight: '500' }}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '3rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)', fontSize: '1.1rem' }}>Remember</h3>
        <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1rem', lineHeight: 1.5 }}>
          Different maps may use different symbols, but every map includes a legend (key) that explains what each symbol means.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '2rem' }}>
        <button onClick={() => setShowChallenge(true)} className="primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}>
          Try the Symbols Challenge <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
