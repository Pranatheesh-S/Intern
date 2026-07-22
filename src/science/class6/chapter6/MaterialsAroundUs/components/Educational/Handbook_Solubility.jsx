import React from 'react';
import { Droplets, GlassWater, AlertCircle, Lock } from 'lucide-react';

export default function Handbook_Solubility({ stageCompleted }) {
  const isPhase2 = window.location.href.includes('stage7b') || stageCompleted;

  return (
    <div style={{
        height: '100%',
        background: '#ffffff', 
        borderRadius: '16px',
        border: '12px solid #1b2a4a',
        display: 'flex', flexDirection: 'column', 
        color: '#1e293b',
        fontFamily: 'Inter, system-ui, sans-serif',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
        overflow: 'hidden'
    }}>
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: '#1e3a8a', fontWeight: 'bold' }}>
              6.3.4 Solubility
            </h2>
          </div>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
        </div>

        <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5', marginBottom: '24px' }}>
          Explore what disappears in water and what does not.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Soluble Box */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ color: '#16a34a' }}><Droplets size={20} /></div>
            <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <strong style={{ color: '#16a34a', fontSize: '0.95rem' }}>Soluble Materials</strong>
              <div>Materials that <strong style={{ color: '#16a34a' }}>completely disappear</strong> or dissolve when mixed in water.</div>
              <div style={{ color: '#64748b' }}>Examples: Salt, Sugar, Oxygen gas.</div>
            </div>
          </div>

          {/* Insoluble Box */}
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ color: '#dc2626' }}><AlertCircle size={20} /></div>
            <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <strong style={{ color: '#dc2626', fontSize: '0.95rem' }}>Insoluble Materials</strong>
              <div>Materials that <strong style={{ color: '#dc2626' }}>do not mix</strong> with water and do not disappear even after stirring.</div>
              <div style={{ color: '#64748b' }}>Examples: Sand, Sawdust, Chalk powder, Oil.</div>
            </div>
          </div>

          {/* ORS Box */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '8px' }}>
            <div style={{ color: '#2563eb' }}><GlassWater size={20} /></div>
            <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <strong style={{ color: '#2563eb', fontSize: '0.95rem' }}>Detective Fact: ORS</strong>
              <div>Water plays an important role in our body because it can dissolve a large number of materials. Oral Rehydration Solution (ORS) uses soluble sugar and salt to treat dehydration!</div>
            </div>
          </div>
        </div>

      </div>

      {/* Page navigation */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          disabled
          style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'not-allowed', color: '#94a3b8', fontSize: '14px', fontWeight: 'bold' }}
        >
          <span>←</span> Previous
        </button>
        <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>Page 1</div>
        <button 
          disabled
          style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'not-allowed', color: '#94a3b8', fontSize: '14px', fontWeight: 'bold' }}
        >
          Next <span>→</span>
        </button>
      </div>

    </div>
  );
}
