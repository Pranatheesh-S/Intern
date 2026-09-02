import React from 'react';
import { Box, Microscope } from 'lucide-react';

export default function Handbook_Volume({ stageCompleted }) {
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
        
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: 'var(--lesson-primary)', fontWeight: 'bold' }}>
              6.3.6 Space and Volume
            </h2>
          </div>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: 'clamp(31.499999999999996px, 4.5vw, 67.5px)', height: 'clamp(31.499999999999996px, 4.5vw, 67.5px)', objectFit: 'contain' }} />
        </div>

        <p style={{ margin: '0 0 24px 0', fontSize: '0.9rem', color: 'var(--lesson-secondary)', lineHeight: '1.5' }}>
          After learning about mass, there is one more fundamental property that all objects share.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 6.3.6 Volume */}
          <div style={{ background: 'var(--lesson-success-bg)', border: '1px solid var(--lesson-success-border)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ background: 'var(--lesson-success-bg)', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#A64B27' }}>
              <Box size={18} color="#A64B27" /> Space and Volume
            </div>
            <div style={{ padding: '15px' }}>
              <p style={{ margin: '0 0 10px 0', color: '#A64B27', lineHeight: '1.5' }}>
                Have you noticed how your bag takes up a seat? Or how water fills a tumbler? This is because everything occupies space.
              </p>
              <div style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--lesson-success-border)', color: '#A64B27', fontWeight: '500' }}>
                The amount of space occupied by an object or substance is called its <strong>volume</strong>.
              </div>
              <p style={{ margin: '10px 0 0 0', color: '#A64B27', lineHeight: '1.5', fontSize: '0.9rem' }}>
                We often see labels like "500 mL" on drinking water or milk bottles. These indicate the volume of the liquid inside.
              </p>
            </div>
          </div>

          {/* Detective Tip */}
          <div style={{ background: 'var(--lesson-warning-bg)', border: '1px solid var(--lesson-warning-bg)', borderRadius: '12px', padding: '15px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ background: 'var(--lesson-warning)', padding: '8px', borderRadius: '50%', flexShrink: 0 }}>
              <Microscope size={20} color="white" />
            </div>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#A64B27', fontSize: '1.05rem' }}>What is Matter?</h4>
              <p style={{ margin: 0, color: 'var(--lesson-primary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                If something has <strong>mass</strong> and occupies <strong>space</strong> (volume), we call it <strong>Matter</strong>! All materials are matter.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page navigation */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--lesson-surface)', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          disabled
          style={{ background: '#A64B27', border: '1px solid var(--lesson-border)', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'not-allowed', color: '#FFFFFF', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}
        >
          <span>←</span> Previous
        </button>
        <div style={{ color: 'var(--lesson-muted)', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>Page 1</div>
        <button 
          disabled
          style={{ background: '#A64B27', border: '1px solid var(--lesson-border)', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'not-allowed', color: '#FFFFFF', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}
        >
          Next <span>→</span>
        </button>
      </div>
    </div>
  );
}
