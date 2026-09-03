import React from 'react';
import { Eye, ShieldAlert, EyeOff, Lock, Unlock } from 'lucide-react';

export default function Handbook_Transparency({ currentFlowIndex, stageCompleted }) {
  // Phase 1 is Surveillance Simulator
  // Phase 2 is Activity 6.6 Classifier
  const isPhase2 = window.location.href.includes('stage6_b') || stageCompleted;

  return (
    <div style={{
        minHeight: 0, boxSizing: 'border-box', height: '100%',
        background: 'white', borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column', 
        border: '12px solid #D9C9A3',
        position: 'relative',
        fontFamily: 'Arial, Helvetica, sans-serif',
        overflow: 'hidden'
    }}>
      {/* Notebook spine */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '20px', background: 'linear-gradient(to right, #94a3b8, #cbd5e1)', borderRight: '1px solid #64748b', zIndex: 10 }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{ width: '12px', height: '16px', background: 'white', borderRadius: '8px', margin: '20px auto', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }} />
        ))}
      </div>
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '2px', background: 'rgba(0,0,0,0.1)', zIndex: 10 }} />

      <div style={{ padding: '24px 20px', paddingLeft: '32px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#3B2A1F', fontWeight: 'bold', lineHeight: '1.3' }}>
              6.3.3 Transparency
            </h2>
            <div style={{ width: '40px', height: '4px', background: '#FFFFFF', borderRadius: '2px' }} />
          </div>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
        </div>

        <div style={{ fontSize: '15px', color: '#1e293b', lineHeight: '1.6', marginBottom: '24px' }}>
          Explore materials through which one can see or cannot see.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Transparent Box */}
          <div style={{ background: '#FFFFFF', border: '1px solid #D9C9A3', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ color: '#22c55e', marginTop: '4px' }}><Eye size={28} /></div>
            <div style={{ fontSize: '15px', color: '#1e293b', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <strong style={{ color: '#15803d', fontSize: '16px' }}>Transparent</strong>
              <div>Materials through which things can be <strong style={{ color: '#15803d' }}>seen clearly</strong>.</div>
              <div><em>Examples:</em> Glass, water, air, cellophane paper.</div>
            </div>
          </div>

          {/* Translucent Box */}
          <div style={{ background: '#FFFFFF', border: '1px solid #D9C9A3', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ color: '#d97706', marginTop: '4px' }}><ShieldAlert size={28} /></div>
            <div style={{ fontSize: '15px', color: '#1e293b', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <strong style={{ color: '#b45309', fontSize: '16px' }}>Translucent</strong>
              <div>Materials through which objects can be seen, <strong style={{ color: '#b45309' }}>but not clearly</strong>.</div>
              <div><em>Examples:</em> Butter paper, frosted glass.</div>
            </div>
          </div>

          {/* Opaque Box */}
          <div style={{ background: '#FFFFFF', border: '1px solid #D9C9A3', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ color: '#ef4444', marginTop: '4px' }}><EyeOff size={28} /></div>
            <div style={{ fontSize: '15px', color: '#1e293b', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <strong style={{ color: '#b91c1c', fontSize: '16px' }}>Opaque</strong>
              <div>Materials through which you are <strong style={{ color: '#b91c1c' }}>not able to see at all</strong>.</div>
              <div><em>Examples:</em> Wood, cardboard, metals.</div>
            </div>
          </div>
        </div>

      </div>

      {/* Progress Footer */}
      <div style={{ padding: '16px 20px', paddingLeft: '32px', borderTop: '1px solid #e2e8f0', background: '#FFFFFF' }}>
        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Mission Progress</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          {/* Phase 1 Indicator */}
          <div style={{ 
            width: '28px', height: '28px', borderRadius: '50%', 
            background: isPhase2 ? '#22c55e' : '#3b82f6', 
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold'
          }}>
            1
          </div>
          
          <div style={{ height: '2px', flex: 1, background: isPhase2 ? '#22c55e' : '#e2e8f0' }} />
          
          {/* Phase 2 Indicator */}
          <div style={{ 
            width: '28px', height: '28px', borderRadius: '50%', 
            background: isPhase2 ? '#3b82f6' : 'white', 
            border: `1px solid ${isPhase2 ? '#3b82f6' : '#cbd5e1'}`,
            color: isPhase2 ? 'white' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold'
          }}>
            {isPhase2 ? 2 : <Lock size={14} />}
          </div>
          
        </div>
      </div>

    </div>
  );
}
