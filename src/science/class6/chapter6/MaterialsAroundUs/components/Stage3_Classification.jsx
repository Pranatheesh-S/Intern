import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Check, Award, ArrowRight, BookOpen, Home, Utensils, AlertCircle } from 'lucide-react';

// Custom Item SVGs
const RegisterIcon = ({ size = 45 }) => (
  <svg width={size} height={size} viewBox="0 0 40 45" preserveAspectRatio="xMidYMid meet">
    <rect x="5" y="2" width="30" height="40" rx="2" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
    <rect x="5" y="2" width="6" height="40" fill="#3b82f6" />
    <line x1="15" y1="10" x2="30" y2="10" stroke="#94a3b8" strokeWidth="2" />
    <line x1="15" y1="16" x2="30" y2="16" stroke="#94a3b8" strokeWidth="2" />
    <line x1="15" y1="22" x2="30" y2="22" stroke="#94a3b8" strokeWidth="2" />
    <line x1="15" y1="28" x2="30" y2="28" stroke="#94a3b8" strokeWidth="2" />
  </svg>
);

const DusterIcon = ({ size = 45 }) => (
  <svg width={size} height={size} viewBox="0 0 50 30" preserveAspectRatio="xMidYMid meet">
    <rect x="5" y="15" width="40" height="10" rx="2" fill="#475569" />
    <rect x="5" y="5" width="40" height="10" rx="2" fill="#b45309" />
  </svg>
);

const ChalkIcon = ({ size = 45 }) => (
  <svg width={size} height={size} viewBox="0 0 20 50" preserveAspectRatio="xMidYMid meet">
    <rect x="5" y="5" width="10" height="40" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
    <path d="M5,10 Q10,15 15,10" fill="none" stroke="#e2e8f0" strokeWidth="1" />
  </svg>
);

const RemoteIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 30 60" preserveAspectRatio="xMidYMid meet">
    <rect x="5" y="2" width="20" height="56" rx="4" fill="#334155" />
    <circle cx="15" cy="10" r="3" fill="#ef4444" />
    <circle cx="15" cy="20" r="5" fill="#1e293b" />
    <rect x="10" y="30" width="10" height="4" rx="1" fill="#94a3b8" />
    <rect x="10" y="38" width="10" height="4" rx="1" fill="#94a3b8" />
    <rect x="10" y="46" width="10" height="4" rx="1" fill="#94a3b8" />
  </svg>
);

const TShirtIcon = ({ size = 45 }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet">
    <path d="M 15,10 Q 25,20 35,10 L 45,15 L 40,25 L 35,22 L 35,45 L 15,45 L 15,22 L 10,25 L 5,15 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" strokeLinejoin="round" />
    <path d="M 15,10 Q 25,20 35,10" fill="none" stroke="#f87171" strokeWidth="2" />
  </svg>
);

const BallIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet">
    <circle cx="25" cy="25" r="20" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
    <path d="M15,10 Q25,25 15,40" stroke="#fef08a" strokeWidth="2" fill="none" strokeDasharray="2,2" />
    <path d="M35,10 Q25,25 35,40" stroke="#fef08a" strokeWidth="2" fill="none" strokeDasharray="2,2" />
  </svg>
);

const PlateIcon = ({ size = 45 }) => (
  <svg width={size} height={size} viewBox="0 0 60 20" preserveAspectRatio="xMidYMid meet">
    <ellipse cx="30" cy="10" rx="25" ry="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
    <ellipse cx="30" cy="10" rx="15" ry="4" fill="none" stroke="#e2e8f0" strokeWidth="1" />
  </svg>
);

const SpoonIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 60 20" preserveAspectRatio="xMidYMid meet" style={{ transform: 'rotate(-45deg)' }}>
    <ellipse cx="15" cy="10" rx="10" ry="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
    <rect x="23" y="8" width="30" height="4" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
  </svg>
);

const TumblerIcon = ({ size = 35 }) => (
  <svg width={size} height={size} viewBox="0 0 40 60" preserveAspectRatio="xMidYMid meet">
    <polygon points="5,5 35,5 30,55 10,55" fill="rgba(56, 189, 248, 0.2)" stroke="#0ea5e9" strokeWidth="2" />
    <line x1="12" y1="15" x2="16" y2="45" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

export default function Stage3_Classification({ defaultPhase = 'use', onComplete, addXp }) {
  const phase = defaultPhase; // controlled externally via props
  const [usePlacements, setUsePlacements] = useState({});
  const [materialPlacements, setMaterialPlacements] = useState({});
  const [inspectedItems, setInspectedItems] = useState({});
  const [activeDemoId, setActiveDemoId] = useState('remote');
  const [draggingOverShelf, setDraggingOverShelf] = useState(null);
  const [draggingOverBasket, setDraggingOverBasket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const allItems = [
    { id: 'register', name: 'Attendance Register', icon: RegisterIcon, correctUse: 'School Shelf', correctMaterial: 'Paper', useHint: 'Think about where teachers take attendance.', materialHint: 'Think about what the pages are made of.' },
    { id: 'duster', name: 'Blackboard Duster', icon: DusterIcon, correctUse: 'School Shelf', correctMaterial: 'Wood', useHint: 'Think about where this is used to erase a chalkboard.', materialHint: 'Think about what the hard back part is usually made of.' },
    { id: 'remote', name: 'TV Remote', icon: RemoteIcon, correctUse: 'Home Shelf', correctMaterial: 'Plastic', useHint: 'Think about where you watch TV.', materialHint: 'Think about what hard, light material electronic casings are made of.' },
    { id: 'tshirt', name: 'T-Shirt', icon: TShirtIcon, correctUse: 'Home Shelf', correctMaterial: 'Cloth', useHint: 'Think about where you keep your clothes.', materialHint: 'Think about what soft, woven material clothes are made from.' },
    { id: 'spoon', name: 'Spoon', icon: SpoonIcon, correctUse: 'Kitchen Shelf', correctMaterial: 'Metal', useHint: 'Think about where you eat your meals.', materialHint: 'Think about what shiny, hard material is used for cutlery.' },
    { id: 'glass', name: 'Tumbler', icon: TumblerIcon, correctUse: 'Kitchen Shelf', correctMaterial: 'Glass', useHint: 'Think about where you usually drink water.', materialHint: 'Think about what transparent, breakable material is used for drinking.' }
  ];

  const items = allItems;

  const handleUseSort = (itemId, targetShelf) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    if (item.correctUse === targetShelf) {
      setUsePlacements(prev => ({ ...prev, [itemId]: targetShelf }));
      setErrorMessage('');
      addXp(5);
    } else {
      setErrorMessage(`"${item.name}" doesn't belong here. ${item.useHint}`);
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  const handleMaterialSort = (itemId, targetMaterial) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    if (item.correctMaterial === targetMaterial) {
      setMaterialPlacements(prev => ({ ...prev, [itemId]: targetMaterial }));
      setErrorMessage('');
      addXp(5);
    } else {
      setErrorMessage(`Incorrect material. ${item.materialHint}`);
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  const allUseSorted = Object.keys(usePlacements).length === allItems.length;
  const allMaterialSorted = Object.keys(materialPlacements).length === items.length;
  const inspectedCount = Object.keys(inspectedItems).length;
  const canFinishDemo = inspectedCount >= 3;

  const handleInspect = (id) => {
    setActiveDemoId(id);
    setInspectedItems(prev => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    if (phase === 'use' && allUseSorted) {
      onComplete();
    } else if (phase === 'material' && allMaterialSorted) {
      onComplete();
    } else if (phase === 'demo' && canFinishDemo) {
      onComplete();
    }
  }, [phase, allUseSorted, allMaterialSorted, canFinishDemo, onComplete]);

  const getDemoProperties = (id) => {
    switch (id) {
      case 'register':
        return [
          { label: 'Primary Use', value: 'School Item 🎒' },
          { label: 'Base Material', value: 'Paper 📄' },
          { label: 'Surface Texture', value: 'Smooth & Flexible ☁️' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'duster':
        return [
          { label: 'Primary Use', value: 'School Item 🎒' },
          { label: 'Base Material', value: 'Wood 🪵' },
          { label: 'Surface Texture', value: 'Hard back, soft front ☁️' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'chalk':
        return [
          { label: 'Primary Use', value: 'School Item 🎒' },
          { label: 'Base Material', value: 'Chalk 🏔️' },
          { label: 'Surface Texture', value: 'Dusty & Brittle 🌫️' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'remote':
        return [
          { label: 'Primary Use', value: 'Home Item 🏠' },
          { label: 'Base Material', value: 'Plastic 🧪' },
          { label: 'Surface Texture', value: 'Hard & Smooth 💎' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'tshirt':
        return [
          { label: 'Primary Use', value: 'Home Item 🏠' },
          { label: 'Base Material', value: 'Cloth 🧶' },
          { label: 'Surface Texture', value: 'Soft & Flexible 👕' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'cricket_ball':
        return [
          { label: 'Primary Use', value: 'Home Item 🏠' },
          { label: 'Base Material', value: 'Leather 🏏' },
          { label: 'Surface Texture', value: 'Hard & Stitched 🧵' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'plate':
        return [
          { label: 'Primary Use', value: 'Kitchen Item 🍳' },
          { label: 'Base Material', value: 'Ceramic 🏺' },
          { label: 'Surface Texture', value: 'Hard & Smooth 🍽️' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'spoon':
        return [
          { label: 'Primary Use', value: 'Kitchen Item 🍳' },
          { label: 'Base Material', value: 'Metal 🦾' },
          { label: 'Surface Texture', value: 'Hard & Lustrous ✨' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'glass':
        return [
          { label: 'Primary Use', value: 'Kitchen Item 🍳' },
          { label: 'Base Material', value: 'Glass 💎' },
          { label: 'Surface Texture', value: 'Hard & Smooth ✨' },
          { label: 'Transparency', value: 'Transparent 🔍' }
        ];
      default:
        return [];
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', flex: 1, minHeight: 0 }}>
      {/* Dynamic phase header */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LayoutGrid size={22} style={{ color: 'var(--accent)' }} /> 
          {phase === 'briefing' && 'Case Briefing: Stage 1 Report'}
          {phase === 'use' && 'Case File 02 – Organizing by Purpose'}
          {phase === 'material' && 'Case File 02 – Scientific Classification'}
          {phase === 'demo' && 'Case File 02 – Multi-Property Insights'}
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          {phase === 'briefing' && 'Review your findings from the classroom scan before analyzing them.'}
          {phase === 'use' && 'Drag collected items to shelves, or select them based on how they are used.'}
          {phase === 'material' && 'Drag items to their material baskets, or select the correct material.'}
          {phase === 'demo' && 'Inspect how the same objects fit into different groups depending on the property we look at.'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Phase 0: Briefing */}
        {phase === 'briefing' && (
          <motion.div
            key="briefing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass-panel"
            style={{
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '1.5rem',
              maxWidth: '650px',
              margin: '2rem auto'
            }}
          >
            <div style={{ fontSize: '3rem' }}>🕵️‍♂️</div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.75rem' }}>Investigation Report: Stage 1</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>
                You have successfully identified the base materials of all classroom evidence.
              </p>
            </div>

            <div style={{ 
              width: '100%', 
              background: 'var(--surface)', 
              borderRadius: '12px', 
              padding: '1.5rem', 
              border: '1px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              textAlign: 'left'
            }}>
              {items.slice(0, 6).map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--success)' }}>✓</span>
                  <strong>{item.name}:</strong> 
                  <span style={{ color: 'var(--accent)' }}>{item.correctMaterial}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: '520px', lineHeight: '1.5' }}>
              "Excellent work, Detective! Now that we know what these objects are made of, we must analyze and organize them to reveal scientific property patterns."
            </div>

            <button
              className="primary"
              onClick={() => setPhase('use')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', fontWeight: 'bold' }}
            >
              Start Evidence Analysis <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {/* Phase 1: Organize by USE */}
        {phase === 'use' && (
          <motion.div
            key="use"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 38%) 1fr', gap: '1.25rem', flex: 1, minHeight: 0 }}
          >
            {/* Left Drawer */}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, alignSelf: 'start' }}>
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', flexShrink: 0 }}>Evidence Tray</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem', paddingTop: '0.5rem' }}>
                {items.map((item) => {
                  const isSorted = usePlacements[item.id] !== undefined;
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.id}
                      draggable={!isSorted}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', item.id);
                      }}
                      className="interactive-tray-item"
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        background: isSorted ? 'var(--success-bg)' : 'var(--card-bg)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        opacity: isSorted ? 0.7 : 1,
                        cursor: isSorted ? 'default' : 'grab',
                        transition: 'all 0.2s',
                        userSelect: 'none',
                        position: 'relative'
                      }}
                    >
                      {/* Top row: icon + name + check */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '10px', 
                          background: isSorted ? 'rgba(16, 185, 129, 0.15)' : 'var(--surface)', 
                          color: isSorted ? 'var(--success)' : 'var(--accent)',
                          flexShrink: 0,
                          border: '1px solid var(--border)'
                        }}>
                          <IconComponent size={24} />
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '0.95rem', lineHeight: '1.2', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                        {isSorted && (
                          <div style={{ 
                            background: 'var(--success)', 
                            borderRadius: '50%', 
                            width: '20px', 
                            height: '20px', 
                            flexShrink: 0,
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: 'white'
                          }}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      {/* Bottom row: dropdown (only when not sorted) */}
                      {!isSorted && (
                        <select
                          value=""
                          onChange={(e) => handleUseSort(item.id, e.target.value)}
                          style={{ fontSize: '0.85rem', padding: '0.3rem 0.5rem', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none', width: '100%', cursor: 'pointer' }}
                        >
                          <option value="" disabled>Select Shelf ▾</option>
                          <option value="School Shelf">School</option>
                          <option value="Home Shelf">Home</option>
                          <option value="Kitchen Shelf">Kitchen</option>
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

            {/* Right: Shelves visual */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { name: 'School Shelf', icon: <BookOpen size={16} />, color: '#3b82f6', plankColor: '#94a3b8' },
                  { name: 'Home Shelf', icon: <Home size={16} />, color: '#f97316', plankColor: '#94a3b8' },
                  { name: 'Kitchen Shelf', icon: <Utensils size={16} />, color: '#10b981', plankColor: '#94a3b8' }
                ].map((shelf) => {
                  const sortedHere = items.filter(i => usePlacements[i.id] === shelf.name);
                  const isDraggingOverMe = draggingOverShelf === shelf.name;
                  return (
                    <div
                      key={shelf.name}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDraggingOverShelf(shelf.name);
                      }}
                      onDragLeave={() => setDraggingOverShelf(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDraggingOverShelf(null);
                        const itemId = e.dataTransfer.getData('text/plain');
                        handleUseSort(itemId, shelf.name);
                      }}
                      style={{
                        background: isDraggingOverMe ? 'rgba(var(--accent-rgb), 0.05)' : 'linear-gradient(to bottom, var(--surface) 0%, var(--card-bg) 100%)',
                        border: isDraggingOverMe ? '2px dashed var(--accent)' : '1px solid var(--border)',
                        borderBottom: `14px solid ${shelf.plankColor}`,
                        borderRadius: '12px 12px 6px 6px',
                        padding: '1rem 1rem 0 1rem', // 0 bottom padding so items sit flush on the bottom border
                        minHeight: '145px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        transition: 'all 0.2s',
                        boxShadow: 'inset 0 -25px 25px -25px rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: shelf.color, fontWeight: 'bold', fontSize: '1.15rem' }}>
                        {shelf.icon}
                        <span>{shelf.name}</span>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'flex-end', minHeight: '65px' }}>
                        {sortedHere.map((item) => (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={item.id}
                            title={item.name}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-end',
                              filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.15))',
                              cursor: 'default'
                            }}
                          >
                            <div style={{ transform: 'translateY(1px)' }}>
                              <item.icon size={55} />
                            </div>
                          </motion.div>
                        ))}
                        {sortedHere.length === 0 && (
                          <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>Empty Shelf</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Error messages overlay */}
              {errorMessage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--danger)', fontSize: '0.8rem' }}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Complete state message */}
              {allUseSorted ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--success)', fontWeight: 'bold', fontSize: '0.95rem' }}>
                  <Check size={18} />
                  <span>All objects grouped successfully! Click "Proceed to next"</span>
                </div>
              ) : (
                <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem' }}>
                  💡 Tip: Drag items directly into the shelves, or use the drop-downs on the left.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Phase 2: Organize by MATERIAL */}
        {phase === 'material' && (
          <motion.div
            key="material"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 38%) 1fr', gap: '1.25rem', flex: 1, minHeight: 0 }}
          >
            {/* Left Drawer */}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, alignSelf: 'start' }}>
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', flexShrink: 0 }}>Evidence Tray</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingRight: '0.25rem' }}>
                {items.map((item) => {
                  const isSorted = materialPlacements[item.id] !== undefined;
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.id}
                      draggable={!isSorted}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', item.id);
                      }}
                      className="interactive-tray-item"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        background: isSorted ? 'var(--success-bg)' : 'var(--card-bg)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        opacity: isSorted ? 0.7 : 1,
                        cursor: isSorted ? 'default' : 'grab',
                        transition: 'all 0.2s',
                        userSelect: 'none',
                        position: 'relative'
                      }}
                    >
                      {/* Top row: icon + name + check */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '10px', 
                          background: isSorted ? 'rgba(16, 185, 129, 0.15)' : 'var(--surface)', 
                          color: isSorted ? 'var(--success)' : 'var(--accent)',
                          flexShrink: 0,
                          border: '1px solid var(--border)'
                        }}>
                          <IconComponent size={24} />
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '0.95rem', lineHeight: '1.2', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                        {isSorted && (
                          <div style={{ 
                            background: 'var(--success)', 
                            borderRadius: '50%', 
                            width: '20px', 
                            height: '20px', 
                            flexShrink: 0,
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: 'white'
                          }}>
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      {/* Bottom row: dropdown (only when not sorted) */}
                      {!isSorted && (
                        <select
                          value=""
                          onChange={(e) => handleMaterialSort(item.id, e.target.value)}
                          style={{ fontSize: '0.85rem', padding: '0.3rem 0.5rem', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none', width: '100%', cursor: 'pointer' }}
                        >
                          <option value="" disabled>Select Material ▾</option>
                          <option value="Paper">Paper</option>
                          <option value="Wood">Wood</option>
                          <option value="Plastic">Plastic</option>
                          <option value="Glass">Glass</option>
                          <option value="Metal">Metal</option>
                          <option value="Cloth">Cloth</option>
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

            {/* Right: Illustrated Material Baskets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', overflowY: 'auto' }}>
              {[
                { name: 'Paper', color: '#2563eb', icon: '📄', emoji: '♻️', bgLight: '#eff6ff', borderColor: '#93c5fd' },
                { name: 'Wood', color: '#92400e', icon: '🪵', emoji: '🪵', bgLight: '#fef3c7', borderColor: '#d97706' },
                { name: 'Plastic', color: '#16a34a', icon: '🧴', emoji: '♻️', bgLight: '#f0fdf4', borderColor: '#4ade80' },
                { name: 'Metal', color: '#64748b', icon: '🔩', emoji: '🔧', bgLight: '#f1f5f9', borderColor: '#94a3b8' },
                { name: 'Glass', color: '#0891b2', icon: '🥛', emoji: '♻️', bgLight: '#ecfeff', borderColor: '#67e8f9' },
                { name: 'Cloth', color: '#dc2626', icon: '👕', emoji: '👕', bgLight: '#fff1f2', borderColor: '#fca5a5' }
              ].map((basket) => {
                const sortedHere = items.filter(i => materialPlacements[i.id] === basket.name);
                const isDraggingOverMe = draggingOverBasket === basket.name;
                const basketSvgs = {
                  Paper: (
                    <svg width="54" height="48" viewBox="0 0 54 48">
                      <ellipse cx="27" cy="44" rx="20" ry="4" fill="rgba(0,0,0,0.1)" />
                      <path d="M7 16 L10 42 L44 42 L47 16 Z" fill="#1d4ed8" />
                      <path d="M7 16 L10 42 L44 42 L47 16 Z" fill="none" stroke="#1e3a8a" strokeWidth="1.5" />
                      {[0,1,2,3,4,5].map(i=><line key={i} x1={9+i*6} y1="16" x2={10+i*5.5} y2="42" stroke="#1e3a8a" strokeWidth="1" opacity="0.5"/>)}
                      <path d="M5 14 Q27 10 49 14 Q27 18 5 14Z" fill="#2563eb" />
                      <path d="M12 8 Q27 5 42 8 L44 16 Q27 12 10 16 Z" fill="#3b82f6" opacity="0.4" />
                    </svg>
                  ),
                  Wood: (
                    <svg width="54" height="48" viewBox="0 0 54 48">
                      <ellipse cx="27" cy="44" rx="20" ry="4" fill="rgba(0,0,0,0.1)" />
                      <path d="M7 16 L10 42 L44 42 L47 16 Z" fill="#a16207" />
                      {[0,1,2,3,4,5].map(i=><line key={i} x1={9+i*6} y1="16" x2={10+i*5.5} y2="42" stroke="#78350f" strokeWidth="1.5" opacity="0.6"/>)}
                      <path d="M5 14 Q27 10 49 14 Q27 18 5 14Z" fill="#b45309" />
                    </svg>
                  ),
                  Plastic: (
                    <svg width="54" height="48" viewBox="0 0 54 48">
                      <ellipse cx="27" cy="44" rx="20" ry="4" fill="rgba(0,0,0,0.1)" />
                      <path d="M7 14 L10 42 L44 42 L47 14 Z" fill="#15803d" />
                      {Array.from({length:5},(_,r)=>Array.from({length:4},(_,c)=>(
                        <rect key={`${r}-${c}`} x={10+c*9} y={16+r*5} width="7" height="3" rx="1" fill="none" stroke="#14532d" strokeWidth="1" opacity="0.5" />
                      )))}
                      <path d="M5 12 Q27 8 49 12 Q27 16 5 12Z" fill="#16a34a" />
                    </svg>
                  ),
                  Metal: (
                    <svg width="54" height="48" viewBox="0 0 54 48">
                      <ellipse cx="27" cy="44" rx="20" ry="4" fill="rgba(0,0,0,0.1)" />
                      <path d="M7 16 L10 42 L44 42 L47 16 Z" fill="#64748b" />
                      {Array.from({length:4},(_,r)=>Array.from({length:5},(_,c)=>(
                        <rect key={`${r}-${c}`} x={9+c*7.5} y={17+r*6} width="5" height="4" rx="1" fill="none" stroke="#334155" strokeWidth="1" opacity="0.6" />
                      )))}
                      <path d="M5 14 Q27 10 49 14 Q27 18 5 14Z" fill="#94a3b8" />
                    </svg>
                  ),
                  Glass: (
                    <svg width="54" height="48" viewBox="0 0 54 48">
                      <ellipse cx="27" cy="44" rx="20" ry="4" fill="rgba(0,0,0,0.1)" />
                      <path d="M7 16 L10 42 L44 42 L47 16 Z" fill="rgba(6,182,212,0.4)" stroke="#0891b2" strokeWidth="1.5" />
                      {[0,1,2,3,4,5].map(i=><line key={i} x1={9+i*6} y1="16" x2={10+i*5.5} y2="42" stroke="#0e7490" strokeWidth="1" opacity="0.4"/>)}
                      <path d="M5 14 Q27 10 49 14 Q27 18 5 14Z" fill="#06b6d4" />
                    </svg>
                  ),
                  Cloth: (
                    <svg width="54" height="48" viewBox="0 0 54 48">
                      <ellipse cx="27" cy="44" rx="20" ry="4" fill="rgba(0,0,0,0.1)" />
                      <path d="M7 16 L10 42 L44 42 L47 16 Z" fill="#b45309" />
                      {[0,1,2,3,4,5].map(i=><line key={i} x1={9+i*6} y1="16" x2={10+i*5.5} y2="42" stroke="#78350f" strokeWidth="1.5" opacity="0.5"/>)}
                      <path d="M5 14 Q27 10 49 14 Q27 18 5 14Z" fill="#d97706" />
                      <rect x="14" y="10" width="8" height="8" rx="2" fill="#ef4444" opacity="0.8" />
                      <rect x="24" y="8" width="8" height="8" rx="2" fill="#3b82f6" opacity="0.8" />
                      <rect x="34" y="10" width="8" height="8" rx="2" fill="#10b981" opacity="0.8" />
                    </svg>
                  )
                };

                return (
                  <div
                    key={basket.name}
                    onDragOver={(e) => { e.preventDefault(); setDraggingOverBasket(basket.name); }}
                    onDragLeave={() => setDraggingOverBasket(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDraggingOverBasket(null);
                      handleMaterialSort(e.dataTransfer.getData('text/plain'), basket.name);
                    }}
                    style={{
                      background: isDraggingOverMe ? basket.bgLight : 'white',
                      border: isDraggingOverMe ? `2px dashed ${basket.color}` : `1.5px solid ${basket.borderColor}`,
                      borderRadius: '12px',
                      padding: '0.6rem 0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.2s',
                      boxShadow: isDraggingOverMe ? `0 0 0 3px ${basket.bgLight}` : '0 1px 4px rgba(0,0,0,0.08)',
                      minHeight: '68px'
                    }}
                  >
                    {/* Basket Illustration */}
                    <div style={{ flexShrink: 0 }}>
                      {basketSvgs[basket.name]}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: '800', fontSize: '0.85rem', color: basket.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          {basket.name} Basket
                        </span>
                        <span style={{ fontSize: '1rem' }}>{basket.emoji}</span>
                      </div>

                      {/* Drop Zone */}
                      <div style={{
                        border: `2px dashed ${isDraggingOverMe ? basket.color : basket.borderColor}`,
                        borderRadius: '8px',
                        padding: '0.3rem 0.5rem',
                        minHeight: '28px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.3rem',
                        alignItems: 'center',
                        background: isDraggingOverMe ? basket.bgLight : 'transparent',
                        transition: 'all 0.15s'
                      }}>
                        {sortedHere.length === 0 ? (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            {isDraggingOverMe ? 'Drop here!' : 'Drop items here...'}
                          </span>
                        ) : (
                          sortedHere.map(item => (
                            <motion.span
                              key={item.id}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              style={{
                                background: basket.bgLight,
                                border: `1px solid ${basket.borderColor}`,
                                borderRadius: '6px',
                                padding: '0.15rem 0.5rem',
                                fontSize: '0.78rem',
                                fontWeight: '600',
                                color: basket.color,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <Check size={10} />
                              {item.name}
                            </motion.span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Error / tip */}
              {errorMessage ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.6rem 1rem', borderRadius: '8px', color: '#dc2626', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                  <AlertCircle size={15} />
                  <span>{errorMessage}</span>
                </div>
              ) : allMaterialSorted ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '0.6rem 1rem', borderRadius: '8px', color: 'var(--success)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  <Check size={16} /> All objects sorted! Click "Proceed to next"
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.25rem' }}>
                  💡 Tip: Drag items to baskets, or use the dropdowns on the left.
                </div>
              )}
            </div>
          </motion.div>
        )}


        {/* Phase 3: Multi-Property Inspection Demo */}
        {phase === 'demo' && (
          <motion.div
            key="demo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, 220px) 1fr', gap: '1.5rem', flex: 1, minHeight: 0 }}
          >
            {/* Left list of items */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: 'clamp(250px, 40vh, 500px)', minWidth: 0 }}>
              <h4 style={{ margin: 0, fontSize: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Select Object to Inspect</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, overflowY: 'auto' }}>
                {items.map((item) => {
                  const isInspected = inspectedItems[item.id];
                  const isActive = activeDemoId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleInspect(item.id)}
                      className={isActive ? 'primary' : 'outline'}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '0.2rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        textAlign: 'left',
                        overflow: 'hidden'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%', overflow: 'hidden' }}>
                        <div style={{ width: '20px', height: '20px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--surface)', borderRadius: '4px' }}>
                          <item.icon size={13} />
                        </div>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{item.name}</span>
                      </span>
                      {isInspected && (
                        <span style={{ fontSize: '0.78rem', color: isActive ? 'rgba(255,255,255,0.85)' : 'var(--success)', paddingLeft: '24px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          ✓ Seen
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', flexShrink: 0 }}>
                Objects Inspected: <strong>{inspectedCount} / 3</strong>
              </div>
            </div>

            {/* Right Card / Demo Visualization */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Profile Card */}
              <div className="glass-panel" style={{ background: 'var(--card-bg)', border: '1px solid var(--accent)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    {React.createElement(items.find(i => i.id === activeDemoId)?.icon || RemoteIcon, { size: 40 })}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.5rem' }}>
                      {items.find(i => i.id === activeDemoId)?.name}
                    </h3>
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Multi-Property Classification Profile</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {getDemoProperties(activeDemoId).map((prop, idx) => (
                    <div key={idx} style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>
                        {prop.label}
                      </span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '0.3rem', display: 'block' }}>
                        {prop.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conclusion Box */}
              {canFinishDemo ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel"
                  style={{
                    background: 'var(--card-bg)',
                    border: '2px solid var(--success-border)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <h4 style={{ margin: 0, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
                    <Award size={22} /> Lesson Outcomes Confirmed!
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--success)' }}>✔</span>
                      <span>Classification depends entirely on the property selected.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--success)' }}>✔</span>
                      <span>The same object belongs to different categories simultaneously.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--success)' }}>✔</span>
                      <span>There is no single correct way to classify objects.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--success)' }}>✔</span>
                      <span>Scientists choose properties based on their study goals.</span>
                    </div>
                  </div>
                  <p style={{ marginTop: '0.75rem', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'right' }}>
                    Click "Proceed to next" in the top right!
                  </p>
                </motion.div>
              ) : (
                <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                    🕵️‍♂️ <strong>Detective Mission:</strong> Click on at least <strong>{3 - inspectedCount} more</strong> objects in the left panel to examine how different criteria classify them.
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
