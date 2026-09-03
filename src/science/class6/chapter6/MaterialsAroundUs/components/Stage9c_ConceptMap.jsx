import React, { useState } from 'react';
import { Compass, Book, Box, Sparkles, Hammer, Eye, Droplets, Trophy, Brain, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Stage9c_ConceptMap({ onComplete, addXp }) {
  const [activeConcept, setActiveConcept] = useState('matter');
  const [explored, setExplored] = useState(['matter']);

  const concepts = {
    matter: {
      id: 'matter',
      title: 'What is Matter?',
      color: 'var(--lesson-success)',
      bg: 'var(--lesson-success-bg)',
      icon: <Box size={24} color="var(--lesson-success)" />,
      desc: 'Anything that occupies space (volume) and has mass is called matter.',
      prefix: 'Matter',
      summary: 'is everything around us that has mass and occupies space.',
      x: 350, y: 10, w: 300, h: 160,
      path: "M 500 350 C 500 270, 500 220, 500 170"
    },
    lustre: {
      id: 'lustre',
      title: 'Lustre (Shine)',
      color: 'var(--lesson-text)',
      bg: 'var(--lesson-accent-bg)',
      icon: <Sparkles size={24} color="var(--lesson-primary)" />,
      desc: "The way a material's surface reflects light. Examples: Gold, Silver, Plastic",
      prefix: 'Lustre',
      summary: 'helps us identify how a material looks by its shine.',
      x: 20, y: 170, w: 300, h: 160,
      path: "M 500 350 C 400 350, 360 250, 320 250"
    },
    hardness: {
      id: 'hardness',
      title: 'Hardness & Softness',
      color: 'var(--lesson-text)',
      bg: 'var(--lesson-surface)',
      icon: <Hammer size={24} color="var(--lesson-primary)" />,
      desc: 'The ability of a material to resist scratching or pressure. Examples: Iron (hard), Chalk (soft)',
      prefix: 'Hardness & softness',
      summary: 'tell us how strong or weak a material is when pressed or scratched.',
      x: 680, y: 170, w: 300, h: 160,
      path: "M 500 350 C 600 350, 640 250, 680 250"
    },
    transparency: {
      id: 'transparency',
      title: 'Transparency Levels',
      color: 'var(--lesson-warning)',
      bg: 'var(--lesson-warning-bg)',
      icon: <Eye size={24} color="var(--lesson-warning)" />,
      desc: 'How much light can pass through a material. Examples: Glass (transparent), Wood (opaque)',
      prefix: 'Transparency',
      summary: 'helps us know whether we can see through a material or not.',
      x: 40, y: 400, w: 300, h: 160,
      path: "M 500 350 C 400 350, 360 480, 340 480"
    },
    solubility: {
      id: 'solubility',
      title: 'Solubility in Water',
      color: 'var(--lesson-text)',
      bg: 'var(--lesson-accent-bg)',
      icon: <Droplets size={24} color="var(--lesson-primary)" />,
      desc: 'The ability of a material to dissolve in water. Examples: Salt (soluble), Sand (insoluble)',
      prefix: 'Solubility',
      summary: 'helps us know whether a material dissolves in water or not.',
      x: 660, y: 400, w: 300, h: 160,
      path: "M 500 350 C 600 350, 640 480, 660 480"
    }
  };

  const handleConceptClick = (id) => {
    setActiveConcept(id);
    if (!explored.includes(id)) {
      const newExplored = [...explored, id];
      setExplored(newExplored);
      if (newExplored.length === Object.keys(concepts).length) {
        addXp(20);
        onComplete();
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', overflowY: 'auto', paddingRight: '0.5rem' }}>
      
      {/* Top Header */}
      <div style={{ background: 'var(--lesson-surface)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--lesson-border)', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0, background: 'var(--lesson-surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Book size={40} color="var(--lesson-primary)" />
          <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'var(--lesson-success)', borderRadius: '50%', padding: '4px', border: '3px solid white' }}>
            <Compass size={20} color="white" />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--lesson-primary)', fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Case File Complete: Property Concept Map
          </h2>
          <p style={{ margin: 0, color: 'var(--lesson-secondary)', fontSize: '1.05rem', lineHeight: '1.5' }}>
            Review all the properties we investigated during this mission.<br/>
            Click through the categories to refresh your memory!
          </p>
        </div>
        <img src="/images/chief_detective_blake.png" alt="Detective" style={{ width: '100px', height: '100px', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} />
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', gap: '1rem', flex: 1, minHeight: 0 }}>
        
        {/* Left Map Panel */}
        <div style={{ flex: 2, background: 'var(--lesson-surface)', borderRadius: '16px', border: '1px solid var(--lesson-border)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          
          {/* Navigation Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center', marginBottom: '1.2rem', zIndex: 10 }}>
            {Object.values(concepts).map(c => (
              <button
                key={c.id}
                onClick={() => handleConceptClick(c.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
                  fontWeight: '600', fontSize: '0.85rem',
                  background: activeConcept === c.id ? c.color : 'white',
                  color: activeConcept === c.id ? 'white' : c.color,
                  border: `2px solid ${c.color}`,
                  transition: 'all 0.2s',
                  boxShadow: activeConcept === c.id ? `0 4px 12px ${c.color}40` : 'none',
                  filter: explored.includes(c.id) ? 'none' : 'grayscale(100%) opacity(0.6)'
                }}
              >
                {React.cloneElement(c.icon, { color: activeConcept === c.id ? 'white' : c.color, size: 16 })}
                {c.title}
              </button>
            ))}
          </div>

          {/* SVG Concept Map */}
          <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: '550px' }}>
            <svg viewBox="0 0 1000 600" style={{ width: '100%', height: '100%' }}>
              
              {/* Connecting Lines */}
              {Object.values(concepts).map(c => (
                <path 
                  key={`line-${c.id}`} 
                  d={c.path} 
                  fill="transparent" 
                  stroke={c.color} 
                  strokeWidth={activeConcept === c.id ? "6" : "3"} 
                  strokeDasharray={activeConcept === c.id ? "0" : "5,5"}
                  style={{ 
                    transition: 'all 0.3s ease',
                    filter: explored.includes(c.id) ? 'none' : 'grayscale(100%) opacity(0.4)'
                  }}
                />
              ))}

              {/* Center Node */}
              <foreignObject x="400" y="250" width="200" height="200">
                <div style={{ 
                  width: '100%', height: '100%', 
                  background: 'radial-gradient(circle, var(--lesson-primary), var(--lesson-text))',
                  borderRadius: '50%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  color: 'white', textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(30, 58, 138, 0.4)',
                  border: '6px solid var(--lesson-surface)',
                  padding: '20px'
                }}>
                  <div style={{ fontSize: '26px', fontWeight: 'bold', lineHeight: '1.2' }}>Properties<br/>of Matter</div>
                </div>
              </foreignObject>

              {/* Concept Cards */}
              {Object.values(concepts).map(c => (
                <foreignObject key={`card-${c.id}`} x={c.x} y={c.y} width={c.w} height={c.h}>
                  <div 
                    onClick={() => handleConceptClick(c.id)}
                    style={{
                      width: '100%', height: '100%',
                      background: c.bg,
                      border: `2px solid ${c.color}`,
                      borderRadius: '16px',
                      padding: '16px',
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', gap: '10px',
                      boxShadow: activeConcept === c.id ? `0 8px 20px ${c.color}60` : '0 4px 6px rgba(0,0,0,0.05)',
                      transform: activeConcept === c.id ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                      opacity: activeConcept === c.id ? 1 : 0.85,
                      filter: explored.includes(c.id) ? 'none' : 'grayscale(100%) opacity(0.7)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ background: 'white', padding: '10px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {React.cloneElement(c.icon, { size: 28 })}
                      </div>
                      <div style={{ color: c.color, fontWeight: 'bold', fontSize: '20px' }}>{c.title}</div>
                    </div>
                    <div style={{ color: 'var(--lesson-secondary)', fontSize: '15px', lineHeight: '1.5' }}>
                      {c.desc}
                    </div>
                  </div>
                </foreignObject>
              ))}

            </svg>
          </div>

        </div>

        {/* Right Summary Panel */}
        <div style={{ flex: 1, background: 'var(--lesson-warning-bg)', borderRadius: '16px', border: '1px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem', borderBottom: '1px solid var(--lesson-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Brain size={24} color="var(--lesson-primary)" />
            <h3 style={{ margin: 0, color: 'var(--lesson-primary)', fontSize: '1.3rem' }}>Quick Summary</h3>
          </div>
          
          <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1, overflowY: 'auto' }}>
            {Object.values(concepts).map(c => (
              <div 
                key={`summary-${c.id}`} 
                style={{ 
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  padding: '0.75rem', borderRadius: '12px',
                  background: activeConcept === c.id ? 'white' : 'transparent',
                  boxShadow: activeConcept === c.id ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  border: activeConcept === c.id ? `1px solid ${c.color}40` : '1px solid transparent',
                  transition: 'all 0.3s',
                  filter: explored.includes(c.id) ? 'none' : 'grayscale(100%) opacity(0.6)'
                }}
              >
                <div style={{ background: c.color, color: 'white', padding: '8px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {React.cloneElement(c.icon, { color: 'white', size: 18 })}
                </div>
                <div style={{ color: 'var(--lesson-text)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  <strong style={{ color: c.color }}>{c.prefix}</strong> {c.summary}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '1.5rem', background: 'var(--lesson-success-bg)', borderTop: '1px solid var(--lesson-success-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: 'var(--lesson-success)', fontWeight: 'bold', fontSize: '1.1rem' }}>Great job, Detective!</div>
              <div style={{ color: 'var(--lesson-success)', fontSize: '0.9rem' }}>You've learned so much today!</div>
            </div>
            <Trophy size={40} color="var(--lesson-warning)" />
          </div>

        </div>

      </div>

    </div>
  );
}
