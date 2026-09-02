import React from 'react';
import { Droplets, GlassWater, AlertCircle, Lock } from 'lucide-react';

export default function Handbook_Solubility({ stageCompleted }) {
  const isPhase2 = window.location.href.includes('stage7b') || stageCompleted;

  return (
    <div style={{
        height: '100%',
        background: '#FFFFFF', 
        borderRadius: '16px',
        border: 'clamp(6px, 1.5vw, 18px) solid var(--lesson-primary)',
        display: 'flex', flexDirection: 'column', 
        color: 'var(--lesson-text)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
        overflow: 'hidden'
    }}>
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: 'var(--lesson-primary)', fontWeight: 'bold' }}>
              6.3.4 Solubility
            </h2>
          </div>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: 'clamp(31.499999999999996px, 4.5vw, 67.5px)', height: 'clamp(31.499999999999996px, 4.5vw, 67.5px)', objectFit: 'contain' }} />
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--lesson-secondary)', lineHeight: '1.5', marginBottom: '24px' }}>
          Explore what disappears in water and what does not.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Soluble Box */}
          <div style={{ background: 'var(--lesson-success-bg)', border: '1px solid var(--lesson-success-border)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ color: '#A64B27' }}><Droplets size={20} /></div>
            <div style={{ fontSize: '0.85rem', color: 'var(--lesson-secondary)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <strong style={{ color: '#A64B27', fontSize: '0.95rem' }}>Soluble Materials</strong>
              <div>Materials that <strong style={{ color: '#A64B27' }}>completely disappear</strong> or dissolve when mixed in water.</div>
              <div style={{ color: 'var(--lesson-muted)' }}>Examples: Salt, Sugar, Oxygen gas.</div>
            </div>
          </div>

          {/* Insoluble Box */}
          <div style={{ background: 'var(--lesson-danger-bg)', border: '1px solid var(--lesson-danger-border)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--lesson-danger)' }}><AlertCircle size={20} /></div>
            <div style={{ fontSize: '0.85rem', color: 'var(--lesson-secondary)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <strong style={{ color: 'var(--lesson-danger)', fontSize: '0.95rem' }}>Insoluble Materials</strong>
              <div>Materials that <strong style={{ color: 'var(--lesson-danger)' }}>do not mix</strong> with water and do not disappear even after stirring.</div>
              <div style={{ color: 'var(--lesson-muted)' }}>Examples: Sand, Sawdust, Chalk powder, Oil.</div>
            </div>
          </div>

          {/* ORS Box */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--lesson-border)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '8px' }}>
            <div style={{ color: '#A64B27' }}><GlassWater size={20} /></div>
            <div style={{ fontSize: '0.85rem', color: 'var(--lesson-secondary)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <strong style={{ color: '#A64B27', fontSize: '0.95rem' }}>Detective Fact: ORS</strong>
              <div>Water plays an important role in our body because it can dissolve a large number of materials. Oral Rehydration Solution (ORS) uses soluble sugar and salt to treat dehydration!</div>
            </div>
          </div>
        </div>

      </div>

      {/* Page navigation */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--lesson-surface)', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          disabled
          style={{ background: \'#A64B27\', border: '1px solid var(--lesson-border)', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'not-allowed', color: \'#FFFFFF\', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}
        >
          <span>←</span> Previous
        </button>
        <div style={{ color: 'var(--lesson-muted)', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>Page 1</div>
        <button 
          disabled
          style={{ background: \'#A64B27\', border: '1px solid var(--lesson-border)', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'not-allowed', color: \'#FFFFFF\', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}
        >
          Next <span>→</span>
        </button>
      </div>

    </div>
  );
}
