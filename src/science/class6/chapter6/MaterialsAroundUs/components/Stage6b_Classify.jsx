import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lightbulb, CheckCircle2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import imgFrostedGlass from "../../../../../assets/2.froastedjar.jpg";
import imgEraser from "../../../../../assets/2.eraser.jpg";
import imgButterPaper from "../../../../../assets/2.butterpaper.jpg";
import imgGlass from "../../../../../assets/2.glass.jpg";
import imgWoodenBoard from "../../../../../assets/2.woodenboard.jpg";
import imgGlassWindow from "../../../../../assets/2.bottleplastic.jpg";

// ─── Inline SVG object visuals ───────────────────────────────────────────────
function ObjectVisual({ id, size = 90, customStyle = {} }) {
  const images = {
    tumbler: imgGlass,
    butter: imgButterPaper,
    eraser: imgEraser,
    frosted: imgFrostedGlass,
    wood: imgWoodenBoard,
    window: imgGlassWindow
  };
  return <img src={images[id]} alt={id} style={{ width: size, height: size, objectFit: 'contain', borderRadius: '8px', pointerEvents: 'none', ...customStyle }} />;
}

// ─── CSS-Based Realistic Tray Component ───────────────────────────────────────
function Tray({ type, droppedItems, isDragOver, onDragOver, onDragLeave, onDrop }) {
  const isOpaque = type === 'Opaque';
  const isTranslucent = type === 'Translucent';
  const isTransparent = type === 'Transparent';

  // Strict clean white/clear plastic palette
  const textColor = '#475569'; // slate-600
  const rimBorder = 'rgba(255,255,255,0.9)'; // bright plastic highlight

  // Outer Back/Side Shell
  const outerBack = isOpaque ? 'linear-gradient(180deg, #f8fafc, #cbd5e1)' 
                  : isTranslucent ? 'linear-gradient(180deg, rgba(255,255,255,0.6), rgba(241,245,249,0.4))'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(241,245,249,0.2))';

  // Inner Depth / Interior Wall
  const innerDepth = isOpaque ? '#e2e8f0' 
                   : isTranslucent ? 'rgba(255,255,255,0.4)' 
                   : 'rgba(255,255,255,0.1)';

  // Front Wall Outer Surface
  const frontOuter = isOpaque ? 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)' 
                   : isTranslucent ? 'linear-gradient(180deg, rgba(255,255,255,0.45), rgba(241,245,249,0.25))'
                   : 'linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))';

  const icon = isOpaque ? <EyeOff size={16}/> : <Eye size={16}/>;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>
      {/* Label above tray */}
      <div style={{ flexShrink: 0, textAlign: 'center', marginBottom: '0.4rem', paddingBottom: '0.25rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '900', fontSize: '1.09rem', letterSpacing: '0.05em', color: textColor }}>
          {icon} {type.toUpperCase()}
        </div>
        <div style={{ fontSize: '0.91rem', color: '#64748b', fontWeight: '600' }}>
          {isOpaque ? 'Cannot see through' : isTranslucent ? 'See, but not clearly' : 'See clearly through'}
        </div>
      </div>

      {/* The physical CSS Drop Container */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          position: 'relative',
          flex: 1,
          marginTop: '0.5rem',
          transform: isDragOver ? 'scale(1.03)' : 'none',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Layer 0: OUTER BACK/SIDE SHELL (Behind everything) */}
        <div style={{
          position: 'absolute', top: '0%', left: '0%', right: '0%', bottom: '0%',
          background: outerBack,
          border: '1px solid rgba(255,255,255,0.5)',
          borderTop: `6px solid ${rimBorder}`, // Back rim thickness
          borderRadius: '12px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.06)',
          zIndex: 0,
        }} />

        {/* Layer 1: INTERIOR BASKET HOLE / DEPTH */}
        <div style={{
          position: 'absolute', top: '10%', left: '4%', right: '4%', bottom: '8%',
          background: innerDepth,
          borderRadius: '6px 6px 16px 16px',
          boxShadow: isDragOver ? 'inset 0 0 0 3px rgba(59,130,246,0.3)' : 'inset 0 15px 25px rgba(0,0,0,0.08), inset 0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 1,
          transition: 'box-shadow 0.2s',
        }}>
          {/* Subtle floor depth line inside the basket */}
          <div style={{
            position: 'absolute', bottom: '15%', left: '8%', right: '8%', height: '3px',
            background: 'rgba(0,0,0,0.04)', borderRadius: '50%'
          }}/>
        </div>

        {/* Layer 2: OBJECTS CONTENT LAYER */}
        {/* Confined to start AT top: 35% so it falls directly behind the front wall! */}
        <div style={{
          position: 'absolute', top: '35%', bottom: '15%', left: '10%', right: '10%',
          display: 'flex', flexWrap: 'wrap-reverse', alignContent: 'center', justifyContent: 'center',
          gap: '8px', zIndex: 2
        }}>
          <AnimatePresence>
            {droppedItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ y: -80, opacity: 0, scale: 0.7, rotate: (i % 2 === 0 ? -15 : 15) }}
                animate={{ y: 0, opacity: 1, scale: 1, rotate: (i % 3 === 0 ? -8 : i % 3 === 1 ? 12 : -5) }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22, delay: 0.05 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ObjectVisual id={item.id} size={64}/>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Layer 3: FRONT WALL & RIM */}
        <div style={{
          position: 'absolute', top: '30%', left: '0%', right: '0%', bottom: '0%',
          background: frontOuter,
          backdropFilter: isTranslucent ? 'blur(8px)' : 'none',
          WebkitBackdropFilter: isTranslucent ? 'blur(8px)' : 'none',
          
          border: '1px solid rgba(255,255,255,0.4)',
          borderTop: `6px solid ${rimBorder}`, // Front rim thickness
          borderRadius: '4px 4px 12px 12px', 
          
          boxShadow: '0 -2px 10px rgba(0,0,0,0.02), 0 15px 30px rgba(0,0,0,0.08), inset 0 6px 15px rgba(255,255,255,0.8), inset 0 -4px 10px rgba(0,0,0,0.05)',
          zIndex: 3,
          overflow: 'hidden'
        }}>
          {/* Handle Cutout */}
          <div style={{
            position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)',
            width: '45px', height: '14px',
            background: isOpaque ? '#cbd5e1' : 'rgba(0,0,0,0.08)',
            borderRadius: '10px',
            boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.9)'
          }} />

          {/* Glossy Plastic Reflection */}
          {!isOpaque && (
            <div style={{
              position: 'absolute', top: 0, left: '20%', width: '35%', height: '100%',
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)',
              transform: 'skewX(-25deg)', pointerEvents: 'none'
            }} />
          )}
        </div>

        {/* UI OVERLAYS (Z-Index 5) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {droppedItems.length === 0 && !isDragOver && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', opacity: 0.5, marginTop: '20%' }}>
              <div style={{ fontSize: '0.97rem', fontWeight: '800', color: '#475569', background: 'rgba(255,255,255,0.7)', padding: '4px 12px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                Drag here
              </div>
            </div>
          )}
          {isDragOver && (
            <div style={{ background: '#334155', color: 'white', padding: '6px 18px', borderRadius: '20px', fontWeight: '800', fontSize: '1.03rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', marginTop: '20%' }}>
              Drop!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function Stage6b_Classify({ onComplete, addXp }) {
  const [classifications, setClassifications] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [draggingOver, setDraggingOver] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  const items = [
    { id: 'tumbler', name: 'Glass Tumbler', correct: 'Transparent', reason: 'You can see clearly through a glass tumbler.' },
    { id: 'butter', name: 'Butter Paper', correct: 'Translucent', reason: 'Butter paper allows some light to pass, but you cannot see clearly through it.' },
    { id: 'eraser', name: 'Eraser', correct: 'Opaque', reason: 'An eraser completely blocks light – you cannot see through it at all.' },
    { id: 'frosted', name: 'Frosted Jar', correct: 'Translucent', reason: 'A frosted jar obscures the view, making things look blurry.' },
    { id: 'wood', name: 'Wooden Board', correct: 'Opaque', reason: 'Wood completely blocks light.' },
    { id: 'window', name: 'Plastic Bottle', correct: 'Transparent', reason: 'A clear plastic bottle allows you to see perfectly through it.' },
  ];

  const handleDragStart = (e, id) => { e.dataTransfer.setData('text/plain', id); setDraggingId(id); };
  const handleDragEnd = () => setDraggingId(null);

  const handleDrop = (e, category) => {
    e.preventDefault();
    setDraggingOver(null);
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    const obj = items.find(i => i.id === id);
    if (!obj) return;
    if (obj.correct === category) {
      if (!classifications[id]) addXp(10);
      setClassifications(prev => ({ ...prev, [id]: category }));
      setFeedback(null);
    } else {
      setFeedback({ message: `Incorrect! ${obj.reason} Therefore, it is ${obj.correct}.` });
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const classifiedCount = Object.keys(classifications).length;
  const isComplete = classifiedCount === items.length;

  useEffect(() => {
    if (isComplete) setTimeout(() => onComplete(), 2000);
  }, [isComplete, onComplete]);

  const transparentItems = items.filter(i => classifications[i.id] === 'Transparent').map(i => i.name).join(', ');
  const translucentItems = items.filter(i => classifications[i.id] === 'Translucent').map(i => i.name).join(', ');
  const opaqueItems = items.filter(i => classifications[i.id] === 'Opaque').map(i => i.name).join(', ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', height: '100%', color: 'var(--text-primary)', overflow: 'hidden', padding: '0.5rem', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ flexShrink: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.5rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.45rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '900' }}>
            <Eye size={24} color="var(--accent)" /> Phase 2: Activity 6.6 — Let us Classify
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '1.21rem', fontWeight: '600', color: 'var(--heading-sub)' }}>
            Drag each object into the correct tray. Transparent lets you see clearly. Translucent blurs. Opaque hides completely.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
          <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '12px', padding: '10px 15px', position: 'relative', width: '200px' }}>
            <div style={{ fontSize: '0.85rem', color: '#a16207', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Lightbulb size={16} /> Detective Tip
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>Think carefully! Where would each object belong?</div>
          </div>
        </div>
      </div>

      {/* Main Classification Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          background: isComplete ? '#dcfce7' : 'var(--surface)',
          border: `1px solid ${isComplete ? '#bbf7d0' : 'var(--border)'}`,
          borderRadius: '16px', padding: '6px 14px',
          fontWeight: '800', fontSize: '1.09rem',
          color: isComplete ? '#15803d' : 'var(--text-primary)',
          display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.3s',
        }}>
          {isComplete ? <><CheckCircle2 size={16} color="#15803d" /> Completed!</> : <>{classifiedCount} / 6 Classified</>}
        </div>
      </div>

      {/* Object Cards */}
      <div style={{ flexShrink: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.5rem 1rem' }}>
        <div style={{ fontSize: '1.09rem', fontWeight: '900', letterSpacing: '0.05em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <GripVertical size={16} /> Objects to Classify — drag each into its tray below
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {items.map(item => {
            const isPlaced = !!classifications[item.id];
            const isDragging = draggingId === item.id;
            return (
              <div
                key={item.id}
                draggable={!isPlaced}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd}
                title={item.name}
                style={{
                  flex: '1 1 0', minWidth: '130px', maxWidth: '200px',
                  background: isPlaced ? '#f8fafc' : 'white',
                  border: `1.5px solid ${isPlaced ? '#cbd5e1' : '#e2e8f0'}`,
                  borderRadius: '10px', padding: '8px 10px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  opacity: isPlaced ? 0.4 : isDragging ? 0.5 : 1,
                  cursor: isPlaced ? 'default' : 'grab',
                  boxShadow: isPlaced ? 'none' : isDragging ? '0 10px 20px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.05)',
                  transition: 'opacity 0.2s, box-shadow 0.2s',
                  userSelect: 'none',
                  transform: isDragging ? 'rotate(-3deg) scale(1.05)' : 'none',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {isPlaced && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 2 }}>
                    <CheckCircle2 size={40} color="#10b981" />
                  </div>
                )}
                {!isPlaced && <div style={{ position: 'absolute', top: '6px', left: '6px' }}><GripVertical size={16} color="#94a3b8" /></div>}
                <ObjectVisual id={item.id} size={64} customStyle={{ width: '100%', height: '85px', mixBlendMode: 'multiply' }} />
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', textAlign: 'center', lineHeight: 1.1 }}>{item.name}</div>
              </div>
            );
          })}
        </div>
        
        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '1.03rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}
            >
              <span>❌</span> {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Three Physical Trays */}
      <div style={{ display: 'flex', gap: '1rem', flex: 1, minHeight: '120px' }}>
        {['Transparent', 'Translucent', 'Opaque'].map(cat => (
          <Tray
            key={cat}
            type={cat}
            droppedItems={items.filter(i => classifications[i.id] === cat)}
            isDragOver={draggingOver === cat}
            onDragOver={(e) => { e.preventDefault(); setDraggingOver(cat); }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDraggingOver(null); }}
            onDrop={(e) => handleDrop(e, cat)}
          />
        ))}
      </div>

      {/* Observation Box */}
      <div style={{ flexShrink: 0, background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '0.5rem 1.25rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.21rem', fontWeight: '900', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye size={20} /> Observation Box
        </h4>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[
            { label: 'Transparent', accent: '#16a34a', border: '#bbf7d0', examples: transparentItems },
            { label: 'Translucent', accent: '#d97706', border: '#fde68a', examples: translucentItems },
            { label: 'Opaque', accent: '#dc2626', border: '#fecaca', examples: opaqueItems },
          ].map(obs => (
            <div key={obs.label} style={{ flex: 1, background: 'white', borderRadius: '10px', padding: '0.5rem 0.85rem', border: `1px solid ${obs.border}`, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ alignSelf: 'flex-start', border: `1.5px solid ${obs.border}`, color: obs.accent, padding: '2px 10px', borderRadius: '8px', fontSize: '0.99rem', fontWeight: '900' }}>
                {obs.label}
              </div>
              <div style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                Examples observed: <span style={{ color: obs.accent, fontWeight: '800', fontSize: '1.15rem', marginLeft: '4px' }}>{obs.examples || 'None yet'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer tip */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '0.75rem 1.25rem', fontSize: '1.21rem', color: '#92400e', fontWeight: '600' }}>
        <Lightbulb size={24} color="#d97706" style={{ flexShrink: 0 }} />
        <span><strong style={{ fontSize: '1.27rem' }}>Tip:</strong> Classify all 6 objects to complete this activity. Watch how each tray visually responds to the object placed inside!</span>
      </div>

    </div>
  );
}
