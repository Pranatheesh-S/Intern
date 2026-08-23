import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, CheckCircle2, AlertCircle, Info, Target, GripHorizontal } from 'lucide-react';

const RealisticCup = ({ material }) => {
  return (
    <svg viewBox="0 0 100 120" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
      <defs>
        <pattern id="sandPat" patternUnits="userSpaceOnUse" width="12" height="12">
          <rect width="12" height="12" fill="#d4b483" />
          <circle cx="2" cy="2" r="0.8" fill="#a06030" opacity="0.6"/>
          <circle cx="8" cy="4" r="1.2" fill="#e6d3a8" opacity="0.8"/>
          <circle cx="4" cy="9" r="1" fill="#8b4513" opacity="0.5"/>
          <circle cx="10" cy="10" r="0.8" fill="#5c3a21" opacity="0.4"/>
          <circle cx="6" cy="6" r="0.5" fill="#f4e4c1" opacity="0.7"/>
        </pattern>
        <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(56, 189, 248, 0.3)" />
          <stop offset="50%" stopColor="rgba(56, 189, 248, 0.6)" />
          <stop offset="100%" stopColor="rgba(14, 165, 233, 0.4)" />
        </linearGradient>
        <linearGradient id="glassGlare" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="20%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="80%" stopColor="rgba(255,255,255,0.0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
        </linearGradient>
      </defs>

      {/* Back Wall of Cylinder Jar */}
      <path d="M 20 45 L 80 45 L 80 105 A 30 8 0 0 1 20 105 Z" fill="rgba(240, 245, 250, 0.4)" stroke="rgba(200, 210, 220, 0.5)" strokeWidth="1"/>
      <ellipse cx="50" cy="45" rx="30" ry="8" fill="rgba(240, 245, 250, 0.3)" stroke="rgba(200, 210, 220, 0.5)" strokeWidth="1.5" />

      {/* Materials */}
      {material === 'water' && (
        <g>
          {/* Liquid Body */}
          <path d="M 20 70 L 80 70 L 80 105 A 30 8 0 0 1 20 105 Z" fill="url(#waterGrad)" />
          {/* Liquid Surface */}
          <ellipse cx="50" cy="70" rx="30" ry="8" fill="rgba(125, 211, 252, 0.5)" stroke="rgba(56, 189, 248, 0.7)" strokeWidth="1"/>
          <ellipse cx="50" cy="70" rx="28" ry="6.5" fill="rgba(255, 255, 255, 0.3)" />
        </g>
      )}

      {material === 'sand' && (
        <g>
          {/* Sand Body */}
          <path d="M 20 70 Q 35 67, 50 71 T 80 69 L 80 105 A 30 8 0 0 1 20 105 Z" fill="url(#sandPat)" />
          {/* Sand Surface Line */}
          <path d="M 20 70 Q 35 67, 50 71 T 80 69" fill="none" stroke="#b47b44" strokeWidth="1.5" opacity="0.6"/>
        </g>
      )}

      {material === 'pebbles' && (
        <g>
          {/* Very bottom filler to remove tiny gaps at the extreme edge */}
          <path d="M 25 100 L 75 100 L 80 105 A 30 8 0 0 1 20 105 Z" fill="#57534e" opacity="0.6"/>

          {/* Layer 1 - Bottom (y~102) */}
          <ellipse cx="26" cy="103" rx="5" ry="3.5" fill="#78716c" transform="rotate(-15 26 103)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="35" cy="104" rx="4" ry="3" fill="#a8a29e" transform="rotate(20 35 104)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="44" cy="103" rx="6" ry="4" fill="#57534e" transform="rotate(-5 44 103)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="54" cy="104" rx="5" ry="3.5" fill="#8b7355" transform="rotate(30 54 104)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="64" cy="102" rx="4.5" ry="3.5" fill="#d6d3d1" transform="rotate(-25 64 102)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="74" cy="103" rx="5" ry="3.5" fill="#a8a29e" transform="rotate(10 74 103)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>

          {/* Layer 2 (y~97) */}
          <ellipse cx="24" cy="98" rx="4" ry="3" fill="#8b7355" transform="rotate(10 24 98)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="32" cy="97" rx="5" ry="4" fill="#6a635a" transform="rotate(-35 32 97)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="41" cy="99" rx="4.5" ry="3" fill="#a8a29e" transform="rotate(15 41 99)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="50" cy="96" rx="5.5" ry="4" fill="#9c9385" transform="rotate(-10 50 96)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="59" cy="98" rx="4" ry="3.5" fill="#57534e" transform="rotate(45 59 98)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="68" cy="96" rx="4.5" ry="3" fill="#78716c" transform="rotate(-20 68 96)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="76" cy="97" rx="4" ry="3.5" fill="#d6d3d1" transform="rotate(20 76 97)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>

          {/* Layer 3 (y~91) */}
          <ellipse cx="27" cy="92" rx="5" ry="4" fill="#a8a29e" transform="rotate(-40 27 92)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="36" cy="91" rx="4" ry="3.5" fill="#78716c" transform="rotate(25 36 91)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="45" cy="93" rx="5.5" ry="3" fill="#d6d3d1" transform="rotate(-5 45 93)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="54" cy="90" rx="4.5" ry="4" fill="#6a635a" transform="rotate(15 54 90)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="63" cy="91" rx="5" ry="3.5" fill="#a8a29e" transform="rotate(-30 63 91)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="73" cy="92" rx="4.5" ry="3" fill="#57534e" transform="rotate(35 73 92)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>

          {/* Layer 4 (y~85) */}
          <ellipse cx="24" cy="87" rx="4.5" ry="3" fill="#57534e" transform="rotate(35 24 87)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="33" cy="85" rx="5" ry="4" fill="#8b7355" transform="rotate(-15 33 85)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="42" cy="86" rx="4" ry="3.5" fill="#d6d3d1" transform="rotate(20 42 86)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="51" cy="84" rx="5.5" ry="3.5" fill="#78716c" transform="rotate(-10 51 84)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="60" cy="86" rx="4" ry="3" fill="#9c9385" transform="rotate(40 60 86)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="69" cy="84" rx="4.5" ry="3.5" fill="#6a635a" transform="rotate(-25 69 84)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="76" cy="86" rx="4" ry="3" fill="#a8a29e" transform="rotate(15 76 86)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>

          {/* Layer 5 (y~79) */}
          <ellipse cx="28" cy="81" rx="5" ry="3.5" fill="#9c9385" transform="rotate(-5 28 81)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="37" cy="79" rx="4.5" ry="4" fill="#57534e" transform="rotate(30 37 79)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="47" cy="81" rx="5" ry="3" fill="#a8a29e" transform="rotate(-20 47 81)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="56" cy="78" rx="4" ry="3.5" fill="#78716c" transform="rotate(15 56 78)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="65" cy="80" rx="4.5" ry="3" fill="#8b7355" transform="rotate(-40 65 80)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="74" cy="79" rx="4" ry="3.5" fill="#57534e" transform="rotate(10 74 79)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>

          {/* Layer 6 (y~73) - Surface */}
          <ellipse cx="25" cy="75" rx="4" ry="3" fill="#d6d3d1" transform="rotate(25 25 75)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="33" cy="74" rx="4.5" ry="3.5" fill="#6a635a" transform="rotate(-15 33 74)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="42" cy="73" rx="5" ry="3" fill="#78716c" transform="rotate(10 42 73)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="52" cy="75" rx="4.5" ry="4" fill="#a8a29e" transform="rotate(-35 52 75)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="61" cy="73" rx="4" ry="3.5" fill="#57534e" transform="rotate(20 61 73)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="70" cy="75" rx="3.5" ry="2.5" fill="#9c9385" transform="rotate(-5 70 75)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="77" cy="74" rx="4" ry="3" fill="#a8a29e" transform="rotate(30 77 74)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>

          {/* Some surface overlapping pebbles */}
          <ellipse cx="38" cy="70" rx="4" ry="3" fill="#8b7355" transform="rotate(-25 38 70)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="48" cy="69" rx="4.5" ry="3.5" fill="#d6d3d1" transform="rotate(15 48 69)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
          <ellipse cx="58" cy="71" rx="3.5" ry="2.5" fill="#6a635a" transform="rotate(-40 58 71)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
        </g>
      )}

      {/* Front of the Cylinder (Glass glare and reflection) */}
      <path d="M 20 45 L 80 45 L 80 105 A 30 8 0 0 1 20 105 Z" fill="url(#glassGlare)" />
      
      {/* Front rim */}
      <path d="M 20 45 A 30 8 0 0 0 80 45" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
      <path d="M 18 45 A 32 9 0 0 0 82 45" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" /> {/* Outer rim detail */}
      
      {/* Left Highlight */}
      <path d="M 23 55 L 23 95" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" />
      {/* Right Edge Glow */}
      <path d="M 77 55 L 77 95" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
      
      {/* Bottom Curve Highlight */}
      <path d="M 28 103 A 22 6 0 0 0 72 103" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export default function Stage8a_Mass({ onComplete, addXp }) {
  const [weighedItems, setWeighedItems] = useState({});
  const [currentOnScale, setCurrentOnScale] = useState(null);

  const cups = [
    { id: 'water', label: 'Cup A', material: 'Water', mass: 44.92 },
    { id: 'sand', label: 'Cup B', material: 'Sand', mass: 85.30 },
    { id: 'pebbles', label: 'Cup C', material: 'Pebbles', mass: 142.15 }
  ];

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('cup_id', id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('cup_id');
    if (id) {
      const cup = cups.find(c => c.id === id);
      setCurrentOnScale(cup);
      if (!weighedItems[id]) {
        setWeighedItems(prev => ({ ...prev, [id]: true }));
        addXp(15);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveFromScale = () => {
    setCurrentOnScale(null);
  };

  const progressCount = Object.keys(weighedItems).length;
  const isComplete = progressCount === 3;

  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', color: 'var(--text-primary)' }}>
      
      {/* Header */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Scale size={24} color="var(--accent)" /> Phase 1: How heavy or light?
          </h3>
          <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
            Activity 6.8: Let us measure. Drag each cup to the digital balance to record its mass.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', minHeight: 0 }}>
        
        {/* Lab Area */}
        <div style={{ flex: 1.5, background: '#fcfaf6', borderRadius: '16px', border: '1px solid #d6c6b4', padding: '1.5rem', display: 'flex', position: 'relative' }}>
          
          {/* Left Side: Material Evidence */}
          <div style={{ width: '50%', flexShrink: 0, display: 'flex', flexDirection: 'column', paddingRight: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.4rem', fontWeight: '800', color: '#574133', borderBottom: '1px solid #d6c6b4', paddingBottom: '0.5rem' }}>MATERIAL EVIDENCE</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '1.5rem' }}>
              {cups.map(cup => {
                const isOnScale = currentOnScale?.id === cup.id;
                const hasBeenWeighed = weighedItems[cup.id];
                
                return (
                  <div 
                    key={cup.id}
                    draggable={!isOnScale}
                    onDragStart={(e) => handleDragStart(e, cup.id)}
                    style={{ 
                      opacity: isOnScale ? 0.4 : 1,
                      cursor: isOnScale ? 'default' : 'grab',
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      background: '#fcf6ea', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #c8b6a6',
                      boxShadow: '0 4px 6px rgba(87, 65, 51, 0.08)'
                    }}
                  >
                    <div style={{ 
                      position: 'relative', width: '4.5rem', height: '5.2rem', 
                      display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'visible', flexShrink: 0
                    }}>
                      <div style={{ position: 'absolute', bottom: '-4px', width: '3.5rem', height: '8px', background: 'rgba(87, 65, 51, 0.15)', borderRadius: '50%', filter: 'blur(2px)' }} />
                      <RealisticCup material={cup.id} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#574133', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <GripHorizontal size={16} color="#a89f91" /> {cup.label}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#8a7b6e' }}>{cup.material}</div>
                    </div>
                    {hasBeenWeighed && <CheckCircle2 size={24} color="#d97706" style={{ marginLeft: 'auto' }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Weighing Station */}
          <div style={{ flex: 1, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', borderLeft: '2px dashed #d6c6b4' }}>
            <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.4rem', fontWeight: '800', color: '#574133', borderBottom: '1px solid #d6c6b4', paddingBottom: '0.5rem' }}>DIGITAL WEIGHING STATION</h4>
            
            <div 
              style={{ 
                flex: 1,
                background: 'rgba(255,255,255,0.6)', 
                border: currentOnScale ? '2px solid #d97706' : '2px dashed #d6c6b4', 
                borderRadius: '16px', 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                position: 'relative'
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {/* Help Arrow & Text (only when empty) */}
              {!currentOnScale && (
                <div style={{ position: 'absolute', left: '50%', top: '35%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 10 L 20 50" stroke="#a89f91" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
                    <path d="M12 42 L 20 50 L 28 42" stroke="#a89f91" strokeWidth="2" fill="transparent" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div style={{ color: '#8a7b6e', fontSize: '1.2rem', fontWeight: '700', textAlign: 'center', maxWidth: '140px', lineHeight: '1.4' }}>
                    Drag a jar here to weigh it
                  </div>
                </div>
              )}

              {/* Wrapper for Cup and Scale to keep them perfectly aligned regardless of container height */}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* Object on scale (Positioned correctly ON the pan) */}
                <AnimatePresence>
                  {currentOnScale && (
                    <motion.div
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      onClick={handleRemoveFromScale}
                      style={{ 
                        position: 'absolute', bottom: '6.5625rem', zIndex: 10, cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'
                      }}
                      title="Click to remove"
                    >
                      <div style={{ 
                        position: 'relative', width: '6.5rem', height: '7.5rem', 
                        display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'visible'
                      }}>
                        <RealisticCup material={currentOnScale.id} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* The Digital Scale (Reference Image Match) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                {/* Silver Pan */}
                <div style={{ 
                  width: '15rem', height: '1.5rem', 
                  background: 'linear-gradient(to bottom, #f3f4f6, #9ca3af)', 
                  borderRadius: '0.5rem 0.5rem 0.25rem 0.25rem', 
                  border: '1px solid #6b7280', 
                  borderBottom: 'none',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.9), 0 4px 6px -1px rgba(0,0,0,0.2)',
                  position: 'relative', zIndex: 3
                }} />
                
                {/* Main Body */}
                <div style={{ 
                  width: '16.25rem', height: '6.25rem', 
                  background: 'linear-gradient(to bottom, #e5e7eb, #d1d5db)', 
                  borderRadius: '0.5rem 0.5rem 1.5rem 1.5rem', 
                  border: '1px solid #9ca3af', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), inset 0 -4px 6px rgba(255,255,255,0.4)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px 20px',
                  position: 'relative', top: '-2px', zIndex: 2
                }}>
                  {/* Black Front Panel */}
                  <div style={{
                    width: '100%', height: '100%',
                    background: '#1f2937',
                    borderRadius: '1rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    {/* Screen */}
                    <div style={{ 
                      width: '8.75rem', height: '2.25rem',
                      background: '#dcfce7', border: '2px inset #4ade80', borderRadius: '0.25rem', 
                      display: 'flex', justifyContent: 'flex-end', alignItems: 'center', 
                      padding: '0 0.5rem', fontSize: '1.6rem', fontWeight: '800', color: '#064e3b',
                      boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)'
                    }}>
                      {currentOnScale ? `${currentOnScale.mass.toFixed(2)} g` : '0.00 g'}
                    </div>
                    {/* Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '11.25rem', marginTop: 'auto' }}>
                      <button style={{ background: '#d97706', border: 'none', borderRadius: '1rem', padding: '0.25rem 1rem', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>ON/TARE</button>
                      <button style={{ background: '#d97706', border: 'none', borderRadius: '1rem', padding: '0.25rem 1rem', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>UNIT</button>
                    </div>
                  </div>
                </div>
              </div>
              
              </div>
            </div>
          </div>
        </div>

        {/* Observation Console */}
        <div style={{ flex: 1, background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <Info size={20} /> Observation Log
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
            {cups.map(cup => {
              const isWeighed = weighedItems[cup.id];
              return (
                <div key={cup.id} style={{ 
                  background: 'white', padding: '12px', borderRadius: '8px', border: `1px solid ${isWeighed ? '#bbf7d0' : 'var(--border)'}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '45px', height: '55px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RealisticCup material={cup.id} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{cup.label}</div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-muted)' }}>{cup.material}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: isWeighed ? '#15803d' : 'var(--text-muted)' }}>
                    {isWeighed ? `${cup.mass} g` : '?.?? g'}
                  </div>
                </div>
              );
            })}
          </div>


        </div>
      </div>

      {/* Footer Progress */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d97706' }}>
          <Target size={20} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: '700' }}>Weigh all 3 cups to uncover their mass.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', background: isComplete ? '#dcfce7' : 'var(--surface)', padding: '8px 16px', borderRadius: '20px', border: `1px solid ${isComplete ? '#bbf7d0' : 'var(--border)'}`, transition: 'all 0.3s' }}>
            {isComplete ? (
              <><span style={{ color: '#16a34a' }}>Completed!</span> <CheckCircle2 size={20} color="#16a34a" /></>
            ) : (
              <>{progressCount} / 3 Weighed</>
            )}
          </div>
        </div>
      </div>
      {isComplete && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fcf6ea', padding: '1.5rem', borderRadius: '12px', border: '1px solid #c8b6a6', boxShadow: '0 4px 6px rgba(87, 65, 51, 0.08)', width: '100%' }}>
          <div style={{ color: '#574133', fontSize: '1.4rem', fontWeight: '900', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={24} /> INFERENCE
          </div>
          <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700', color: '#574133', lineHeight: '1.6' }}>
            Even though all cups are the same size and half-filled, they have different weights! 
            The property that makes them heavy or light is called <strong style={{ color: '#d97706', fontWeight: '900', fontSize: '1.4rem' }}>MASS</strong>. Pebbles have the most mass.
          </p>
        </motion.div>
      )}

    </div>
  );
}
