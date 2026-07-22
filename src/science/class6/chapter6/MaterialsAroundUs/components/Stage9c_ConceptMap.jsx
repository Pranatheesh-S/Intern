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
      color: '#22c55e',
      bg: '#f0fdf4',
      icon: <Box size={24} color="#22c55e" />,
      desc: 'Anything that occupies space (volume) and has mass is called matter.',
      prefix: 'Matter',
      summary: 'is everything around us that has mass and occupies space.',
      x: 320, y: 30, w: 240, h: 140,
      path: "M 500 350 C 500 250, 440 200, 440 170"
    },
    lustre: {
      id: 'lustre',
      title: 'Lustre (Shine)',
      color: '#a855f7',
      bg: '#faf5ff',
      icon: <Sparkles size={24} color="#a855f7" />,
      desc: "The way a material's surface reflects light. Examples: Gold, Silver, Plastic",
      prefix: 'Lustre',
      summary: 'helps us identify how a material looks by its shine.',
      x: 40, y: 160, w: 240, h: 150,
      path: "M 500 350 C 400 350, 300 230, 280 230"
    },
    hardness: {
      id: 'hardness',
      title: 'Hardness & Softness',
      color: '#3b82f6',
      bg: '#eff6ff',
      icon: <Hammer size={24} color="#3b82f6" />,
      desc: 'The ability of a material to resist scratching or pressure. Examples: Iron (hard), Chalk (soft)',
      prefix: 'Hardness & softness',
      summary: 'tell us how strong or weak a material is when pressed or scratched.',
      x: 720, y: 160, w: 240, h: 160,
      path: "M 500 350 C 600 350, 700 240, 720 240"
    },
    transparency: {
      id: 'transparency',
      title: 'Transparency Levels',
      color: '#eab308',
      bg: '#fefce8',
      icon: <Eye size={24} color="#eab308" />,
      desc: 'How much light can pass through a material. Examples: Glass (transparent), Wood (opaque)',
      prefix: 'Transparency',
      summary: 'helps us know whether we can see through a material or not.',
      x: 60, y: 400, w: 250, h: 160,
      path: "M 500 350 C 400 350, 320 480, 310 480"
    },
    solubility: {
      id: 'solubility',
      title: 'Solubility in Water',
      color: '#06b6d4',
      bg: '#ecfeff',
      icon: <Droplets size={24} color="#06b6d4" />,
      desc: 'The ability of a material to dissolve in water. Examples: Salt (soluble), Sand (insoluble)',
      prefix: 'Solubility',
      summary: 'helps us know whether a material dissolves in water or not.',
      x: 680, y: 400, w: 250, h: 150,
      path: "M 500 350 C 600 350, 680 470, 680 470"
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
      <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0, background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Book size={40} color="#4f46e5" />
          <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#10b981', borderRadius: '50%', padding: '4px', border: '3px solid white' }}>
            <Compass size={20} color="white" />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#1e3a8a', fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Case File Complete: Property Concept Map
          </h2>
          <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: '1.5' }}>
            Review all the properties we investigated during this mission.<br/>
            Click through the categories to refresh your memory!
          </p>
        </div>
        <img src="/images/chief_detective_blake.png" alt="Detective" style={{ width: '100px', height: '100px', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} />
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', gap: '1rem', flex: 1, minHeight: 0 }}>
        
        {/* Left Map Panel */}
        <div style={{ flex: 2, background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          
          {/* Navigation Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', zIndex: 10 }}>
            {Object.values(concepts).map(c => (
              <button
                key={c.id}
                onClick={() => handleConceptClick(c.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '0.95rem',
                  background: activeConcept === c.id ? c.color : 'white',
                  color: activeConcept === c.id ? 'white' : c.color,
                  border: `2px solid ${c.color}`,
                  transition: 'all 0.2s',
                  boxShadow: activeConcept === c.id ? `0 4px 12px ${c.color}40` : 'none',
                  filter: explored.includes(c.id) ? 'none' : 'grayscale(100%) opacity(0.6)'
                }}
              >
                {React.cloneElement(c.icon, { color: activeConcept === c.id ? 'white' : c.color, size: 18 })}
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
                  background: 'radial-gradient(circle, #1e3a8a, #0f172a)',
                  borderRadius: '50%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  color: 'white', textAlign: 'center',
                  boxShadow: '0 8px 24px rgba(30, 58, 138, 0.4)',
                  border: '6px solid #e0e7ff',
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
                      <div style={{ background: 'white', padding: '8px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {c.icon}
                      </div>
                      <div style={{ color: c.color, fontWeight: 'bold', fontSize: '18px' }}>{c.title}</div>
                    </div>
                    <div style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5' }}>
                      {c.desc}
                    </div>
                  </div>
                </foreignObject>
              ))}

            </svg>
          </div>

        </div>

        {/* Right Summary Panel */}
        <div style={{ flex: 1, background: '#faf5ff', borderRadius: '16px', border: '1px solid #e9d5ff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem', borderBottom: '1px solid #e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Brain size={24} color="#9333ea" />
            <h3 style={{ margin: 0, color: '#7e22ce', fontSize: '1.3rem' }}>Quick Summary</h3>
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
                <div style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  <strong style={{ color: c.color }}>{c.prefix}</strong> {c.summary}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '1.5rem', background: '#f0fdf4', borderTop: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.1rem' }}>Great job, Detective!</div>
              <div style={{ color: '#15803d', fontSize: '0.9rem' }}>You've learned so much today!</div>
            </div>
            <Trophy size={40} color="#eab308" />
          </div>

        </div>

      </div>

    </div>
  );
}
