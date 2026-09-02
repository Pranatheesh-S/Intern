import React from 'react';
import { Eye, ShieldAlert, EyeOff, Lock } from 'lucide-react';

export default function Handbook_Transparency({ stageCompleted }) {
  const isPhase2 = window.location.href.includes('stage6_b') || stageCompleted;

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
              6.3.3 Transparency
            </h2>
          </div>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: 'clamp(31.499999999999996px, 4.5vw, 67.5px)', height: 'clamp(31.499999999999996px, 4.5vw, 67.5px)', objectFit: 'contain' }} />
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--lesson-secondary)', lineHeight: '1.5', marginBottom: '24px' }}>
          Explore materials through which one can see or cannot see.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Transparent Box */}
          <div style={{ background: 'var(--lesson-success-bg)', border: '1px solid var(--lesson-success-border)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ color: '#A64B27' }}><Eye size={20} /></div>
            <div style={{ fontSize: '0.85rem', color: 'var(--lesson-secondary)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <strong style={{ color: '#A64B27', fontSize: '0.95rem' }}>Transparent</strong>
              <div>Materials through which things can be <strong style={{ color: '#A64B27' }}>seen clearly</strong>.</div>
              <div style={{ color: 'var(--lesson-muted)' }}>Examples: Glass, water, air, cellophane paper.</div>
            </div>
          </div>

          {/* Translucent Box */}
          <div style={{ background: 'var(--lesson-warning-bg)', border: '1px solid #D9C9A3', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ color: '#ca8a04' }}><ShieldAlert size={20} /></div>
            <div style={{ fontSize: '0.85rem', color: 'var(--lesson-secondary)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <strong style={{ color: '#ca8a04', fontSize: '0.95rem' }}>Translucent</strong>
              <div>Materials through which objects can be seen, <strong style={{ color: '#ca8a04' }}>but not clearly</strong>.</div>
              <div style={{ color: 'var(--lesson-muted)' }}>Examples: Butter paper, frosted glass.</div>
            </div>
          </div>

          {/* Opaque Box */}
          <div style={{ background: 'var(--lesson-danger-bg)', border: '1px solid var(--lesson-danger-border)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--lesson-danger)' }}><EyeOff size={20} /></div>
            <div style={{ fontSize: '0.85rem', color: 'var(--lesson-secondary)', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <strong style={{ color: 'var(--lesson-danger)', fontSize: '0.95rem' }}>Opaque</strong>
              <div>Materials through which you are <strong style={{ color: 'var(--lesson-danger)' }}>not able to see at all</strong>.</div>
              <div style={{ color: 'var(--lesson-muted)' }}>Examples: Wood, cardboard, metals.</div>
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
