import React, { useState, useEffect } from 'react';
import { Layers, Lightbulb, Target, CheckSquare, Square, MousePointer2, Hammer } from 'lucide-react';

export default function Handbook_Hardness({ highestUnlockedIndex = 0, currentFlowIndex = 0, stageCompleted = false }) {
  const [bookPage, setBookPage] = useState(1);
  
  // We are in 6.3.2. Activities are stage4_4 (idx 19), stage4_5 (idx 20)
  const isPhase1Done = highestUnlockedIndex > 19 || (currentFlowIndex === 19 && stageCompleted);
  const isPhase2Done = highestUnlockedIndex > 20 || (currentFlowIndex === 20 && stageCompleted);

  return (
    <div style={{
        minHeight: 0, boxSizing: 'border-box', height: '100%',
        background: 'white', borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column', 
        border: 'clamp(6px, 1.5vw, 18px) solid #1b2a4a', // Dark blue border
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

      {bookPage === 1 ? (
        <div style={{ flex: 1, minHeight: 0, padding: '24px 20px', paddingLeft: '32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto', gap: '16px' }}>
          {/* ================= LEFT PAGE ================= */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: 'var(--text-xl)', color: '#1e3a8a', fontWeight: 'bold', lineHeight: '1.3' }}>
                6.3.2 Hardness
              </h2>
              <div style={{ width: 'clamp(28px, 4vw, 60px)', height: '4px', background: '#3b82f6', borderRadius: '2px' }} />
            </div>
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sam&backgroundColor=transparent" alt="Student" style={{ width: 'clamp(42px, 6vw, 90px)', height: 'clamp(42px, 6vw, 90px)', marginTop: '-5px' }} />
          </div>

          <div style={{ fontSize: 'var(--text-base)', color: '#1e293b', lineHeight: '1.6', marginBottom: '10px' }}>
            When you press different materials with your hands, some of them may be hard to compress while others can be easily compressed.
          </div>

          {/* Soft Box */}
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 'var(--text-2xl)', marginTop: '4px' }}>☁️</div>
            <div style={{ fontSize: 'var(--text-base)', color: '#1e293b', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <strong style={{ color: '#15803d', fontSize: 'var(--text-base)' }}>Soft Materials</strong>
              <div>Materials which can be <strong style={{ color: '#15803d' }}>compressed or scratched easily</strong> are called soft.</div>
              <div><em>Examples:</em> Cotton, Sponge, Chalk, Candle.</div>
            </div>
          </div>

          {/* Hard Box */}
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 'var(--text-2xl)', marginTop: '4px' }}>🧱</div>
            <div style={{ fontSize: 'var(--text-base)', color: '#1e293b', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <strong style={{ color: '#b91c1c', fontSize: 'var(--text-base)' }}>Hard Materials</strong>
              <div>Materials which are <strong style={{ color: '#b91c1c' }}>difficult to compress</strong> or scratch are called hard.</div>
              <div><em>Examples:</em> Iron, Stone, Aluminium.</div>
            </div>
          </div>

          {/* Scratch Test Tip */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: 'auto' }}>
            <div style={{ fontSize: 'var(--text-xl)', transform: 'rotate(-45deg)' }}>📌</div>
            <div style={{ fontSize: 'var(--text-sm)', color: '#1e293b', lineHeight: '1.5' }}>
              <strong style={{ color: '#d97706', display: 'block', marginBottom: '4px' }}>The Scratch Test</strong>
              Take a metal key and try to scratch a piece of wood, stone, or candle. Some will easily get marks, others won't!
            </div>
          </div>

          {/* Page navigation */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
            <button 
              onClick={() => { setBookPage(2); }}
              style={{ background: '#1e3a8a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: 'var(--text-sm)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(30, 58, 138, 0.3)' }}
            >
              Next Page ➔
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, padding: '24px 20px', paddingLeft: '32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* ================= RIGHT PAGE ================= */}
          <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-xl)', color: '#1e3a8a', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={24} style={{ color: '#3b82f6' }} /> Investigation: Hardness
          </h2>

          <div style={{ fontSize: 'var(--text-base)', color: '#475569', lineHeight: '1.5', marginBottom: '16px' }}>
            Before determining if objects are hard or soft, we must first identify what each object is <strong>made of</strong>.
          </div>

          {/* Mission Checklist */}
          <div style={{ border: '2px solid #22c55e', borderRadius: '12px', padding: '16px', background: '#f0fdf4', marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#16a34a', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} /> MISSION CHECKLIST
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: '#166534' }}>
                <CheckSquare size={18} color="#16a34a" /> Read the Handbook
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: '#166534' }}>
                {isPhase1Done ? <CheckSquare size={18} color="#16a34a" /> : <Square size={18} color="#94a3b8" />} Phase 1: Press Test
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: '#166534' }}>
                {isPhase2Done ? <CheckSquare size={18} color="#16a34a" /> : <Square size={18} color="#94a3b8" />} Phase 2: Material ID Test
              </div>
            </div>
          </div>

          {/* How to do */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#f8fafc', marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#1e3a8a', fontSize: 'var(--text-sm)' }}>How to do:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--text-sm)', color: '#334155' }}>
                <div style={{ background: '#e0e7ff', padding: '6px', borderRadius: '8px', display: 'flex', color: '#4f46e5' }}><MousePointer2 size={16} /></div> Click an object from the list.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--text-sm)', color: '#334155' }}>
                <div style={{ background: '#e0e7ff', padding: '6px', borderRadius: '8px', display: 'flex', color: '#4f46e5' }}><Layers size={16} /></div> Choose the material it is made of.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--text-sm)', color: '#334155' }}>
                <div style={{ background: '#e0e7ff', padding: '6px', borderRadius: '8px', display: 'flex', color: '#4f46e5' }}><Lightbulb size={16} /></div> It will be added to your Evidence Board.
              </div>
            </div>
          </div>

          {/* Detective Tip */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: 'auto' }}>
            <div style={{ fontSize: 'var(--text-xl)', transform: 'rotate(-45deg)' }}>💡</div>
            <div style={{ fontSize: 'var(--text-sm)', color: '#1e293b', lineHeight: '1.5' }}>
              <strong style={{ color: '#d97706', display: 'block', marginBottom: '4px' }}>Detective Tip</strong>
              Look carefully at the object. Think about what it is usually made of.
            </div>
          </div>

          {/* Page navigation */}
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
            <button 
              onClick={() => setBookPage(1)}
              style={{ background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#64748b', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}
            >
              <span style={{ fontSize: 'var(--text-base)' }}>←</span> Previous
            </button>
            <div style={{ color: '#94a3b8', fontSize: 'var(--text-sm)' }}>Page 2</div>
          </div>
        </div>
      )}
    </div>
  );
}
