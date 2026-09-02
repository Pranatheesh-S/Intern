import React from 'react';
import { Scale, Microscope } from 'lucide-react';

export default function Handbook_Mass({ stageCompleted }) {
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
              6.3.5 How heavy or light?
            </h2>
          </div>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: 'clamp(31.499999999999996px, 4.5vw, 67.5px)', height: 'clamp(31.499999999999996px, 4.5vw, 67.5px)', objectFit: 'contain' }} />
        </div>

        <p style={{ margin: '0 0 24px 0', fontSize: '0.9rem', color: 'var(--lesson-secondary)', lineHeight: '1.5' }}>
          Now that you have become familiar with properties like appearance, hardness, transparency, and solubility, 
          it is time to uncover the properties that apply to <strong>everything</strong>.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 6.3.5 Mass */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--lesson-border)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ background: 'var(--lesson-border)', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: 'var(--lesson-text)' }}>
              <Scale size={18} color="var(--lesson-secondary)" /> Mass
            </div>
            <div style={{ padding: '15px' }}>
              <p style={{ margin: '0 0 10px 0', color: 'var(--lesson-text)', lineHeight: '1.5' }}>
                When we lift an object, we feel how heavy or light it is. This is determined by a property called <strong>mass</strong>.
              </p>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--lesson-secondary)', lineHeight: '1.6' }}>
                <li>An object which is heavier has <strong>more mass</strong>.</li>
                <li>An object which is lighter has <strong>less mass</strong>.</li>
                <li>We can measure this by weighing the object on a balance scale.</li>
              </ul>
              <div style={{ marginTop: '12px', background: 'rgba(34, 197, 94, 0.1)', padding: '10px', borderRadius: '8px', borderLeft: '4px solid #A64B27', color: '#A64B27', fontSize: '0.85rem' }}>
                <strong>Note:</strong> Weight is sometimes used in common language for mass as it is determined by weighing.
              </div>
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
