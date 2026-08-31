import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lightbulb, CheckCircle2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import imgFrostedGlass from "../../../../../assets/2.froastedglass.png";
import imgEraser from "../../../../../assets/2.eraser.jpg";
import imgButterPaper from "../../../../../assets/2.butterpaper.jpg";
import imgGlass from "../../../../../assets/2.glass.jpg";
import imgWoodenBoard from "../../../../../assets/2.woodenboard.jpg";
import imgGlassWindow from "../../../../../assets/2.glasswindow.jpg";

import imgTransparent from "../../../../../assets/2.transparent.png";
import imgTranslucent from "../../../../../assets/2.transcluent.png";
import imgOpaque from "../../../../../assets/2.opaque.png";

const trayImages = {
  Transparent: imgTransparent,
  Translucent: imgTranslucent,
  Opaque: imgOpaque,
};

// ─── Inline SVG object visuals ───────────────────────────────────────────────
function ObjectVisual({ id, size = 90 }) {
  const images = {
    tumbler: imgGlass,
    butter: imgButterPaper,
    eraser: imgEraser,
    frosted: imgFrostedGlass,
    wood: imgWoodenBoard,
    window: imgGlassWindow
  };
  return <img src={images[id]} alt={id} style={{ width: size, height: size, objectFit: 'contain', borderRadius: '8px' }} />;
}

// ─── Tray component ───────────────────────────────────────────────────────────
function Tray({ type, droppedItems, isDragOver, onDragOver, onDragLeave, onDrop }) {
  const configs = {
    Transparent: {
      label: 'TRANSPARENT', subtitle: 'See clearly through',
      accent: '#2563eb', accentLight: '#dbeafe', border: '#93c5fd',
      glow: 'rgba(59,130,246,0.3)',
      trayBg: 'linear-gradient(160deg, rgba(186,230,253,0.35) 0%, rgba(224,242,254,0.18) 50%, rgba(147,197,253,0.25) 100%)',
      rimTop: '#bae6fd', rimBottom: '#7dd3fc80',
      innerBg: 'rgba(224,242,254,0.18)',
      icon: <Eye size={18}/>,
      itemFilter: 'none',
      itemOverlay: null,
      itemLabelColor: '#1e293b',
      showName: true,
    },
    Translucent: {
      label: 'TRANSLUCENT', subtitle: 'See, but not clearly',
      accent: '#d97706', accentLight: '#fef3c7', border: '#fcd34d',
      glow: 'rgba(217,119,6,0.25)',
      trayBg: 'linear-gradient(160deg, rgba(254,243,199,0.65) 0%, rgba(253,230,138,0.35) 50%, rgba(252,211,77,0.22) 100%)',
      rimTop: '#fde68a', rimBottom: '#f59e0b60',
      innerBg: 'rgba(254,243,199,0.45)',
      icon: <Eye size={18}/>,
      itemFilter: 'blur(2px) saturate(0.5) brightness(1.12)',
      itemOverlay: 'rgba(255,255,255,0.38)',
      itemLabelColor: '#92400e',
      showName: true,
    },
    Opaque: {
      label: 'OPAQUE', subtitle: 'Cannot see through',
      accent: '#dc2626', accentLight: '#fee2e2', border: '#fca5a5',
      glow: 'rgba(220,38,38,0.25)',
      trayBg: 'linear-gradient(160deg, #2d3748 0%, #1a202c 50%, #0f1117 100%)',
      rimTop: '#4b5563', rimBottom: '#11111180',
      innerBg: '#1f2937',
      icon: <EyeOff size={18}/>,
      itemFilter: 'none',
      itemOverlay: '#1f2937',
      itemLabelColor: '#4b5563',
      showName: false,
    },
  };
  const c = configs[type];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      {/* Label above tray */}
      <div style={{ textAlign: 'center', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: `2px solid ${c.border}` }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '900', fontSize: '1rem', letterSpacing: '0.06em', color: c.accent }}>
          {c.icon} {c.label}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>{c.subtitle}</div>
      </div>

      {/* Physical tray */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          position: 'relative',
          flex: 1,
          minHeight: '230px',
          borderRadius: '20px',
          boxShadow: isDragOver
            ? `0 0 0 3px ${c.accent}, 0 8px 30px ${c.glow}`
            : '0 4px 15px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.2s ease',
          overflow: 'hidden',
        }}
      >
        <img 
          src={trayImages[type]} 
          alt={`${type} tray`} 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', zIndex: 0 }} 
        />

        {/* Interior */}
        <div style={{
          position: 'absolute', inset: '25px 25px 25px 25px',
          display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start',
          gap: '8px', padding: '10px 8px 8px 8px',
          overflowY: 'auto', zIndex: 1,
        }}>
          {/* Empty state */}
          {droppedItems.length === 0 && (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.45, pointerEvents: 'none' }}>
              <div style={{ fontSize: '2rem' }}>{type === 'Opaque' ? '🟫' : '📦'}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: type === 'Opaque' ? '#9ca3af' : c.accent, textAlign: 'center' }}>
                {isDragOver ? 'Release to drop' : 'Drag objects here'}
              </div>
            </div>
          )}

          {/* Dropped items */}
          <AnimatePresence>
            {droppedItems.map(item => (
              <motion.div
                key={item.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                style={{
                  width: 'calc(50% - 4px)', boxSizing: 'border-box',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  padding: '8px 6px', borderRadius: '10px',
                  background: type === 'Opaque' ? '#374151' : 'rgba(255,255,255,0.7)',
                  border: `1.5px solid ${type === 'Opaque' ? '#4b5563' : c.border}`,
                  boxShadow: type === 'Opaque' ? 'inset 0 2px 6px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.08)',
                  position: 'relative', overflow: 'hidden',
                  filter: c.itemFilter,
                }}
              >
                {/* Translucent frosted overlay */}
                {type === 'Translucent' && (
                  <div style={{ position: 'absolute', inset: 0, background: c.itemOverlay, backdropFilter: 'blur(3px)', borderRadius: '10px', zIndex: 3, pointerEvents: 'none' }}/>
                )}
                {/* Opaque black veil */}
                {type === 'Opaque' && (
                  <div style={{ position: 'absolute', inset: 0, background: c.itemOverlay, borderRadius: '10px', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#374151', border: '2px solid #4b5563', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)' }}/>
                  </div>
                )}
                <div style={{ pointerEvents: 'none', zIndex: 1 }}>
                  <ObjectVisual id={item.id} size={52}/>
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', textAlign: 'center', color: c.itemLabelColor, lineHeight: 1.2, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', zIndex: 1 }}>
                  {c.showName ? item.name : '???'}
                </div>
                {/* Success badge (visible for non-opaque) */}
                {type !== 'Opaque' && (
                  <div style={{ position: 'absolute', top: '3px', right: '3px', background: '#10b981', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4 }}>
                    <CheckCircle2 size={10} color="white"/>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Drag-over overlay */}
        {isDragOver && (
          <div style={{ position: 'absolute', inset: 0, background: `${c.accent}12`, border: `3px dashed ${c.accent}`, borderRadius: '12px 12px 20px 20px', zIndex: 6, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: `${c.accent}f0`, color: 'white', padding: '6px 18px', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem' }}>Drop here!</div>
          </div>
        )}
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
    { id: 'frosted', name: 'Frosted Glass', correct: 'Translucent', reason: 'Frosted glass obscures the view, making things look blurry.' },
    { id: 'wood', name: 'Wooden Board', correct: 'Opaque', reason: 'Wood completely blocks light.' },
    { id: 'window', name: 'Window Glass', correct: 'Transparent', reason: 'Clear window glass allows you to see perfectly through it.' },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', color: 'var(--text-primary)', overflowY: 'auto', paddingRight: '4px' }}>
      
      {/* Header */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '900' }}>
            <Eye size={24} color="var(--accent)" /> Phase 2: Activity 6.6 — Let us Classify
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Drag each object into the correct tray. Transparent lets you see clearly. Translucent blurs. Opaque hides completely.
          </p>
        </div>
        <div style={{
          background: isComplete ? '#dcfce7' : 'var(--surface)',
          border: `1px solid ${isComplete ? '#bbf7d0' : 'var(--border)'}`,
          borderRadius: '20px', padding: '8px 18px',
          fontWeight: '800', fontSize: '1rem',
          color: isComplete ? '#15803d' : 'var(--text-primary)',
          display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s',
        }}>
          {isComplete ? <><CheckCircle2 size={18} color="#15803d" /> Completed!</> : <>{classifiedCount} / 6 Classified</>}
        </div>
      </div>

      {/* Object Cards */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1rem 1.25rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <GripVertical size={13} /> Objects to Classify — drag each into its tray below
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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
                  flex: '1 1 110px', maxWidth: '145px', minWidth: '100px',
                  background: isPlaced ? '#f8fafc' : 'white',
                  border: `1.5px solid ${isPlaced ? '#cbd5e1' : '#e2e8f0'}`,
                  borderRadius: '12px', padding: '10px 8px 8px 8px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  opacity: isPlaced ? 0.36 : isDragging ? 0.5 : 1,
                  cursor: isPlaced ? 'default' : 'grab',
                  boxShadow: isPlaced ? 'none' : isDragging ? '0 10px 30px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.07)',
                  transition: 'opacity 0.2s, box-shadow 0.2s',
                  userSelect: 'none',
                  transform: isDragging ? 'rotate(-3deg) scale(1.06)' : 'none',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {isPlaced && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(16,185,129,0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 2 }}>
                    <CheckCircle2 size={28} color="#10b981" />
                  </div>
                )}
                {!isPlaced && <div style={{ position: 'absolute', top: '4px', left: '4px' }}><GripVertical size={11} color="#94a3b8" /></div>}
                <ObjectVisual id={item.id} size={82} />
                <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#1e293b', textAlign: 'center', lineHeight: 1.2 }}>{item.name}</div>
              </div>
            );
          })}
        </div>
        
        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem' }}
            >
              <span>❌</span> {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Three Physical Trays */}
      <div style={{ display: 'flex', gap: '1.25rem', minHeight: '270px' }}>
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
      <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '1.25rem 1.5rem' }}>
        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: '900', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye size={18} /> Observation Box
        </h4>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[
            { label: 'Transparent', accent: '#16a34a', border: '#bbf7d0', desc: 'Objects were seen clearly through these materials.', examples: transparentItems },
            { label: 'Translucent', accent: '#d97706', border: '#fde68a', desc: 'Objects were seen, but not clearly through these materials.', examples: translucentItems },
            { label: 'Opaque', accent: '#dc2626', border: '#fecaca', desc: 'Objects could not be seen through these materials at all.', examples: opaqueItems },
          ].map(obs => (
            <div key={obs.label} style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '1rem', border: `1px solid ${obs.border}` }}>
              <div style={{ display: 'inline-block', border: `1px solid ${obs.border}`, color: obs.accent, padding: '2px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800', marginBottom: '8px' }}>{obs.label}</div>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>{obs.desc}</p>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Examples observed: <span style={{ color: obs.accent, fontWeight: '700' }}>{obs.examples || 'None yet'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer tip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '0.75rem 1.25rem', fontSize: '0.88rem', color: '#92400e', fontWeight: '600', marginBottom: '0.5rem' }}>
        <Lightbulb size={16} color="#d97706" />
        <span><strong>Tip:</strong> Classify all 6 objects to complete this activity. Watch how each tray visually responds to the object placed inside!</span>
      </div>

    </div>
  );
}
