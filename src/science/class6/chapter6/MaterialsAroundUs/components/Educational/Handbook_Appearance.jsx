import React, { useState, useEffect } from 'react';
import { Layers, Lightbulb, Target, CheckSquare, Square, MousePointer2, Move, Eye } from 'lucide-react';

export default function Handbook_Appearance({ highestUnlockedIndex = 0, currentFlowIndex = 0, stageCompleted = false }) {
  const [bookPage, setBookPage] = useState(1);
  const [isHandbookRead, setIsHandbookRead] = useState(false);

  // We are in 6.3.1. Activities are stage4_1 (idx 14), stage4_2 (idx 15), stage4_3 (idx 17)
  const isPhase1Done = highestUnlockedIndex > 14 || (currentFlowIndex === 14 && stageCompleted);
  const isPhase2Done = highestUnlockedIndex > 15 || (currentFlowIndex === 15 && stageCompleted);
  const isPhase3Done = highestUnlockedIndex > 15 || (currentFlowIndex === 15 && stageCompleted); // Just linking them to phase 2 for now

  return (
    <div style={{
        minHeight: 0, boxSizing: 'border-box', height: '100%',
        background: 'white', borderRadius: '8px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column', 
        border: 'clamp(6px, 1.5vw, 18px) solid var(--lesson-primary)',
        position: 'relative',
        overflow: 'hidden'
    }}>
      {/* Book Spine (Right Edge) */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '30px', background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1))', pointerEvents: 'none', zIndex: 10 }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '2px', background: 'rgba(0,0,0,0.1)', zIndex: 10 }} />

      {bookPage === 1 ? (
        <div style={{ flex: 1, minHeight: 0, padding: '24px 20px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto', gap: '16px' }}>
          {/* ================= LEFT PAGE ================= */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: 'var(--text-xl)', color: 'var(--lesson-primary)', fontWeight: 'bold', lineHeight: '1.3' }}>
                Observe and Identify<br/>Appearance of Materials
              </h2>
              <div style={{ width: 'clamp(28px, 4vw, 60px)', height: '4px', background: '#A64B27', borderRadius: '2px' }} />
            </div>
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Annie&backgroundColor=transparent" alt="Student" style={{ width: 'clamp(56px, 8vw, 120px)', height: 'clamp(56px, 8vw, 120px)', marginTop: '-10px' }} />
          </div>

          {/* Box 1: Blue dashed */}
          <div style={{ background: '#FFFFFF', border: '1px dashed var(--lesson-border)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 'var(--text-2xl)', marginTop: '4px' }}>💡</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--lesson-text)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>Materials can look different from each other.</div>
              <div>Some have shiny surfaces, while others look dull.</div>
              <div>They may also differ in <strong style={{ color: '#A64B27' }}>colour</strong> and <strong style={{ color: '#A64B27' }}>texture</strong>, such as smooth or rough.</div>
            </div>
          </div>

          {/* Box 2: Purple */}
          <div style={{ background: 'var(--lesson-accent-bg)', border: '1px solid #D9C9A3', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 'var(--text-2xl)', marginTop: '4px' }}>✨</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--lesson-text)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <strong style={{ color: '#A64B27', fontSize: 'var(--text-base)' }}>Lustrous vs Non-lustrous</strong>
              <div>Materials with shiny surfaces are called <strong style={{ color: '#A64B27' }}>lustrous</strong>. Metals like iron, copper and aluminium are usually lustrous.</div>
              <div>Paper, wood and rubber are examples of <strong style={{ color: '#A64B27' }}>non-lustrous</strong> materials.</div>
            </div>
          </div>

          {/* Box 3: Yellow */}
          <div style={{ background: 'var(--lesson-warning-bg)', border: '1px solid var(--lesson-warning-bg)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 'var(--text-xl)', marginTop: '2px', transform: 'rotate(-45deg)' }}>📌</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--lesson-text)', lineHeight: '1.5' }}>
              <strong style={{ color: '#A64B27', display: 'block', marginBottom: '4px' }}>Remember!</strong>
              Not everything that shines is a metal!
            </div>
          </div>

          {/* Page navigation */}
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
            <div style={{ color: 'var(--lesson-muted)', fontSize: 'var(--text-sm)' }}>Page 1</div>
            <button 
              onClick={() => { setBookPage(2); setIsHandbookRead(true); }}
              style={{ background: 'var(--lesson-primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: 'var(--text-sm)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(30, 58, 138, 0.3)' }}
            >
              Next Page ➔
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, padding: '24px 20px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* ================= RIGHT PAGE ================= */}
          <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-xl)', color: 'var(--lesson-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={24} style={{ color: '#A64B27' }} /> Investigation: Group by Appearance
          </h2>

          <div style={{ fontSize: 'var(--text-base)', color: 'var(--lesson-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
            Materials can be different in the way they look. Let's group them based on how their surface appears when light falls on them.
          </div>

          {/* Yellow Tip Box */}
          <div style={{ background: 'var(--lesson-warning-bg)', border: '1px solid #D9C9A3', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
            <Lightbulb size={20} color="var(--lesson-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--lesson-secondary)', lineHeight: '1.4' }}>
              Look carefully under the lamp.<br/>
              Drag each item to the correct group.
            </div>
          </div>

          {/* Mission Checklist */}
          <div style={{ border: '2px solid #D9C9A3', borderRadius: '12px', padding: '16px', background: 'var(--lesson-success-bg)', marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#A64B27', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} /> MISSION CHECKLIST
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: '#A64B27' }}>
                {isHandbookRead ? <CheckSquare size={18} color="#A64B27" /> : <Square size={18} color="#A64B27" />} Read the Handbook
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: '#A64B27' }}>
                {isPhase1Done ? <CheckSquare size={18} color="#A64B27" /> : <Square size={18} color="var(--lesson-muted)" />} Observe the materials
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: '#A64B27' }}>
                {isPhase2Done ? <CheckSquare size={18} color="#A64B27" /> : <Square size={18} color="var(--lesson-muted)" />} Group by appearance
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: '#A64B27' }}>
                {isPhase3Done ? <CheckSquare size={18} color="#A64B27" /> : <Square size={18} color="var(--lesson-muted)" />} Test with the lamp
              </div>
            </div>
          </div>

          {/* How to do */}
          <div style={{ border: '1px solid var(--lesson-border)', borderRadius: '12px', padding: '16px', background: '#FFFFFF', marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: 'var(--lesson-primary)', fontSize: 'var(--text-sm)' }}>How to do:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--text-sm)', color: 'var(--lesson-text)' }}>
                <div style={{ background: '#FFFFFF', padding: '6px', borderRadius: '8px', display: 'flex', color: '#A64B27' }}><MousePointer2 size={16} /></div> Drag an item from the tray
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--text-sm)', color: 'var(--lesson-text)' }}>
                <div style={{ background: '#FFFFFF', padding: '6px', borderRadius: '8px', display: 'flex', color: '#A64B27' }}><Move size={16} /></div> Drop it in the right group
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--text-sm)', color: 'var(--lesson-text)' }}>
                <div style={{ background: '#FFFFFF', padding: '6px', borderRadius: '8px', display: 'flex', color: '#A64B27' }}><Eye size={16} /></div> Click the lamp to observe again
              </div>
            </div>
          </div>

          {/* Detective Tip */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', marginBottom: '16px' }}>
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Detective" style={{ width: 'clamp(42px, 6vw, 90px)', height: 'clamp(42px, 6vw, 90px)' }} />
            <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '12px', fontSize: 'var(--text-sm)', color: 'var(--lesson-text)', position: 'relative', flex: 1, border: '1px solid var(--lesson-border)' }}>
              <div style={{ position: 'absolute', left: '-6px', top: '20px', width: '10px', height: '10px', background: '#FFFFFF', borderLeft: '1px solid var(--lesson-border)', borderBottom: '1px solid var(--lesson-border)', transform: 'rotate(45deg)' }} />
              Remember, shiny surfaces reflect more light!
            </div>
          </div>

          {/* Page navigation */}
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
            <button 
              onClick={() => setBookPage(1)}
              style={{ background: 'white', border: '1px solid var(--lesson-border)', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--lesson-muted)', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}
            >
              <span style={{ fontSize: 'var(--text-base)' }}>←</span> Previous
            </button>
            <div style={{ color: 'var(--lesson-muted)', fontSize: 'var(--text-sm)' }}>Page 2</div>
          </div>
        </div>
      )}
    </div>
  );
}
