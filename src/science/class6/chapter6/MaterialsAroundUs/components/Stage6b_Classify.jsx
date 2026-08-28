import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lightbulb, CheckCircle2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Inline SVG object visuals ───────────────────────────────────────────────
function ObjectVisual({ id, size = 90 }) {
  const s = size;
  switch (id) {
    case 'tumbler': return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="tG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a8d8f0" stopOpacity="0.6"/>
            <stop offset="40%" stopColor="#e0f4ff" stopOpacity="0.9"/>
            <stop offset="70%" stopColor="#b8e4f5" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#7ac5e8" stopOpacity="0.5"/>
          </linearGradient>
          <linearGradient id="tHL" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d="M28 18 L72 18 L65 85 L35 85 Z" fill="url(#tG)" stroke="#5ab3d4" strokeWidth="1.5"/>
        <rect x="26" y="15" width="48" height="6" rx="3" fill="#7cd0f0" stroke="#4ab0d0" strokeWidth="1"/>
        <path d="M33 58 Q50 55 67 58 L65 85 L35 85 Z" fill="#60c4ec" fillOpacity="0.45"/>
        <rect x="34" y="20" width="10" height="55" rx="5" fill="url(#tHL)"/>
        <path d="M38 22 L40 75" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round"/>
      </svg>
    );
    case 'butter': return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="bG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fefce8"/>
            <stop offset="50%" stopColor="#fef3c7"/>
            <stop offset="100%" stopColor="#fde68a"/>
          </linearGradient>
        </defs>
        <ellipse cx="52" cy="88" rx="36" ry="4" fill="rgba(0,0,0,0.1)"/>
        <path d="M20 25 Q25 20 35 22 Q50 18 65 21 Q78 20 82 28 Q80 45 82 60 Q80 75 76 80 Q60 82 50 80 Q35 82 22 78 Q18 65 20 50 Q18 35 20 25 Z" fill="url(#bG)" stroke="#d4b96a" strokeWidth="1"/>
        <path d="M20 25 Q35 30 50 28 Q65 26 82 28" stroke="#c9a830" strokeWidth="0.8" strokeOpacity="0.5" fill="none"/>
        <ellipse cx="42" cy="48" rx="10" ry="7" fill="#fde68a" fillOpacity="0.6"/>
        <ellipse cx="62" cy="62" rx="8" ry="6" fill="#fde68a" fillOpacity="0.5"/>
        <path d="M65 21 L82 28 L72 26 Z" fill="#e8c547" fillOpacity="0.4"/>
        <path d="M30 40 Q40 37 50 40 Q60 43 70 40" stroke="#c9a830" strokeWidth="0.5" strokeOpacity="0.4" fill="none"/>
        <path d="M28 55 Q38 52 52 55 Q62 58 72 55" stroke="#c9a830" strokeWidth="0.5" strokeOpacity="0.4" fill="none"/>
      </svg>
    );
    case 'eraser': return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="eG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fda4af"/>
            <stop offset="100%" stopColor="#f43f5e"/>
          </linearGradient>
          <linearGradient id="eBand" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1d4ed8"/>
            <stop offset="100%" stopColor="#3b82f6"/>
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="84" rx="30" ry="5" fill="rgba(0,0,0,0.15)"/>
        <g transform="rotate(-10 50 50)">
          <rect x="14" y="34" width="72" height="36" rx="4" fill="url(#eG)" stroke="#e11d48" strokeWidth="1"/>
          <rect x="14" y="34" width="72" height="12" rx="4" fill="#fecdd3"/>
          <rect x="44" y="34" width="22" height="36" fill="url(#eBand)"/>
          <rect x="44" y="34" width="22" height="12" fill="#60a5fa"/>
          <rect x="16" y="35" width="28" height="2" rx="1" fill="white" fillOpacity="0.4"/>
        </g>
        <ellipse cx="24" cy="79" rx="3" ry="1.5" fill="#fda4af" transform="rotate(-15 24 79)"/>
        <ellipse cx="68" cy="81" rx="2.5" ry="1.5" fill="#3b82f6" transform="rotate(10 68 81)"/>
      </svg>
    );
    case 'frosted': return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="fG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.85"/>
            <stop offset="50%" stopColor="#eff6ff" stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.75"/>
          </linearGradient>
        </defs>
        <rect x="12" y="12" width="76" height="76" rx="4" fill="#94a3b8" stroke="#64748b" strokeWidth="2"/>
        <rect x="10" y="47" width="80" height="6" fill="#78909c"/>
        <rect x="47" y="10" width="6" height="80" fill="#78909c"/>
        <rect x="14" y="14" width="31" height="31" rx="2" fill="url(#fG)" stroke="#bfdbfe" strokeWidth="0.5"/>
        <rect x="55" y="14" width="31" height="31" rx="2" fill="url(#fG)" stroke="#bfdbfe" strokeWidth="0.5"/>
        <rect x="14" y="55" width="31" height="31" rx="2" fill="url(#fG)" stroke="#bfdbfe" strokeWidth="0.5"/>
        <rect x="55" y="55" width="31" height="31" rx="2" fill="url(#fG)" stroke="#bfdbfe" strokeWidth="0.5"/>
        {[18,26,34,22,30,16,24,32,28].map((x,i) => <circle key={i} cx={x} cy={22+(i%3)*7} r="1.2" fill="white" fillOpacity="0.6"/>)}
        {[58,66,74,62,70,60,68,64,72].map((x,i) => <circle key={i} cx={x} cy={22+(i%3)*7} r="1.2" fill="white" fillOpacity="0.6"/>)}
        <ellipse cx="29" cy="70" rx="10" ry="6" fill="#94a3b8" fillOpacity="0.25"/>
        <ellipse cx="70" cy="70" rx="10" ry="6" fill="#94a3b8" fillOpacity="0.25"/>
        <line x1="16" y1="16" x2="24" y2="24" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round"/>
      </svg>
    );
    case 'wood': return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="wG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c8a46a"/>
            <stop offset="50%" stopColor="#a0733a"/>
            <stop offset="100%" stopColor="#8b5e2a"/>
          </linearGradient>
        </defs>
        <path d="M15 72 L85 72 L85 82 L15 82 Z" fill="#7a4f20"/>
        <path d="M85 35 L95 40 L95 82 L85 72 Z" fill="#6b3d12"/>
        <rect x="15" y="28" width="70" height="44" rx="2" fill="url(#wG)"/>
        <path d="M20 36 Q50 33 80 36" stroke="#8b5e2a" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
        <path d="M20 44 Q50 41 80 44" stroke="#7a4f20" strokeWidth="0.8" strokeOpacity="0.4" fill="none"/>
        <path d="M20 52 Q48 49 80 52" stroke="#8b5e2a" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
        <path d="M22 60 Q50 57 78 60" stroke="#7a4f20" strokeWidth="0.8" strokeOpacity="0.4" fill="none"/>
        <path d="M22 68 Q52 65 78 68" stroke="#8b5e2a" strokeWidth="0.8" strokeOpacity="0.3" fill="none"/>
        <ellipse cx="62" cy="42" rx="6" ry="4" fill="#7a4f20" fillOpacity="0.5"/>
        <ellipse cx="62" cy="42" rx="3" ry="2" fill="#5c3614" fillOpacity="0.5"/>
        <rect x="15" y="28" width="70" height="8" rx="2" fill="white" fillOpacity="0.15"/>
        <rect x="15" y="28" width="70" height="44" rx="2" fill="none" stroke="#7a4f20" strokeWidth="1.2"/>
      </svg>
    );
    case 'window': return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="winG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.75"/>
            <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.65"/>
          </linearGradient>
        </defs>
        <rect x="10" y="10" width="80" height="80" rx="5" fill="#78909c" stroke="#546e7a" strokeWidth="2"/>
        <rect x="8" y="47" width="84" height="6" fill="#78909c"/>
        <rect x="47" y="8" width="6" height="84" fill="#78909c"/>
        <rect x="12" y="12" width="33" height="33" rx="2" fill="url(#winG)"/>
        <rect x="55" y="12" width="33" height="33" rx="2" fill="url(#winG)"/>
        <rect x="12" y="55" width="33" height="33" rx="2" fill="url(#winG)"/>
        <rect x="55" y="55" width="33" height="33" rx="2" fill="url(#winG)"/>
        <rect x="12" y="12" width="33" height="12" rx="2" fill="#93c5fd" fillOpacity="0.5"/>
        <rect x="55" y="12" width="33" height="12" rx="2" fill="#93c5fd" fillOpacity="0.5"/>
        <line x1="14" y1="14" x2="28" y2="28" stroke="white" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round"/>
        <line x1="57" y1="14" x2="71" y2="28" stroke="white" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round"/>
        <rect x="16" y="28" width="6" height="10" fill="#64748b" fillOpacity="0.15" rx="1"/>
        <rect x="24" y="30" width="6" height="8" fill="#64748b" fillOpacity="0.15" rx="1"/>
      </svg>
    );
    default: return null;
  }
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
          borderRadius: '12px 12px 20px 20px',
          boxShadow: isDragOver
            ? `0 0 0 3px ${c.accent}, 0 8px 30px ${c.glow}`
            : '0 6px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
          transition: 'box-shadow 0.2s ease',
          background: c.trayBg,
          border: `2px solid ${c.rimTop}`,
          overflow: 'hidden',
        }}
      >
        {/* Rim top highlight */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '20px', background: `linear-gradient(180deg, ${c.rimTop} 0%, transparent 100%)`, borderRadius: '12px 12px 0 0', zIndex: 2, pointerEvents: 'none' }}/>

        {/* Interior */}
        <div style={{
          position: 'absolute', inset: '20px 10px 14px 10px',
          background: c.innerBg,
          borderRadius: '4px 4px 14px 14px',
          border: `1px solid ${c.rimTop}30`,
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

        {/* Rim bottom shadow */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '24px', background: `linear-gradient(0deg, ${c.rimBottom} 0%, transparent 100%)`, borderRadius: '0 0 20px 20px', zIndex: 2, pointerEvents: 'none' }}/>

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
