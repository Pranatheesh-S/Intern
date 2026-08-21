import React from 'react';
import { Layers, Lightbulb, Target, CheckSquare, Square, MousePointer2, Move, Eye } from 'lucide-react';

export default function Handbook_GroupAppearance({ highestUnlockedIndex, currentFlowIndex, stageCompleted }) {
  // Using similar state logic to existing handbooks, though here we'll assume phases might be passed or just static for visuals
  // From the image, some checkboxes are checked, some are not.
  const isPhase1Done = true;
  const isPhase2Done = true;
  const isPhase3Done = false;
  const isPhase4Done = false;

  return (
    <div style={{
        minHeight: 0, boxSizing: 'border-box', height: '100%',
        background: 'white', borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column', 
        border: 'clamp(6px, 1.5vw, 18px) solid var(--text-heading)', // Dark blue border as requested
        position: 'relative',
        overflow: 'hidden',
        padding: '24px 20px',
        gap: '16px',
        overflowY: 'auto'
    }}>
      {/* Title */}
      <h2 style={{ margin: '0', fontSize: 'var(--text-xl)', color: 'var(--text-heading)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Layers size={24} style={{ color: 'var(--accent)' }} /> Investigation: Group by Appearance
      </h2>

      {/* Intro Text */}
      <div style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
        Materials can be different in the way they look. Let's group them based on how their surface appears when light falls on them.
      </div>

      {/* Yellow Tip Box */}
      <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <Lightbulb size={20} color="#eab308" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: 'var(--text-sm)', color: '#854d0e', lineHeight: '1.4' }}>
          Look carefully under the lamp.<br/>
          Drag each item to the correct group.
        </div>
      </div>

      {/* Mission Checklist */}
      <div style={{ border: '2px solid #22c55e', borderRadius: '12px', padding: '16px', background: '#f0fdf4' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#16a34a', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={18} /> MISSION CHECKLIST
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: '#166534' }}>
            {isPhase1Done ? <CheckSquare size={18} color="#16a34a" /> : <Square size={18} color="#16a34a" />} Read the Handbook
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: '#166534' }}>
            {isPhase2Done ? <CheckSquare size={18} color="#16a34a" /> : <Square size={18} color="#16a34a" />} Observe the materials
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: '#166534' }}>
            {isPhase3Done ? <CheckSquare size={18} color="var(--text-muted)" /> : <Square size={18} color="var(--text-muted)" />} Group by appearance
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', color: '#166534' }}>
            {isPhase4Done ? <CheckSquare size={18} color="var(--text-muted)" /> : <Square size={18} color="var(--text-muted)" />} Test with the lamp
          </div>
        </div>
      </div>

      {/* How to do */}
      <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', background: 'var(--surface)' }}>
        <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-heading)', fontSize: 'var(--text-sm)' }}>How to do:</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
            <div style={{ background: 'var(--surface)', padding: '6px', borderRadius: '8px', display: 'flex', color: 'var(--accent)' }}><MousePointer2 size={16} /></div> Drag an item from the tray
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
            <div style={{ background: 'var(--surface)', padding: '6px', borderRadius: '8px', display: 'flex', color: 'var(--accent)' }}><Move size={16} /></div> Drop it in the right group
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
            <div style={{ background: 'var(--surface)', padding: '6px', borderRadius: '8px', display: 'flex', color: 'var(--accent)' }}><Eye size={16} /></div> Click the lamp to observe again
          </div>
        </div>
      </div>

      {/* Detective Tip */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: 'auto', paddingTop: '10px' }}>
        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Detective" style={{ width: 'clamp(42px, 6vw, 90px)', height: 'clamp(42px, 6vw, 90px)' }} />
        <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: '12px', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', position: 'relative', flex: 1, border: '1px solid var(--border)' }}>
          <div style={{ position: 'absolute', left: '-6px', top: '20px', width: '10px', height: '10px', background: 'var(--surface)', borderLeft: '1px solid var(--border)', borderBottom: '1px solid var(--border)', transform: 'rotate(45deg)' }} />
          Remember, shiny surfaces reflect more light!
        </div>
      </div>
    </div>
  );
}
