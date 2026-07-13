import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Check, Award, ArrowRight, BookOpen, Home, Utensils, AlertCircle } from 'lucide-react';

// Custom Item SVGs
const TextbookIcon = ({ size = 45 }) => (
  <svg width={size} height={size} viewBox="0 0 40 35" preserveAspectRatio="xMidYMid meet">
    <rect x="5" y="2" width="30" height="30" rx="3" fill="#3b82f6" />
    <path d="M5,2 L8,2 L8,32 L5,32 Z" fill="#2563eb" />
    <line x1="10" y1="7" x2="30" y2="7" stroke="#fff" strokeWidth="1.5" />
    <line x1="10" y1="12" x2="30" y2="12" stroke="#fff" strokeWidth="1.5" />
    <line x1="10" y1="17" x2="30" y2="17" stroke="#fff" strokeWidth="1.5" />
    <circle cx="4" cy="6" r="1.2" fill="#94a3b8" />
    <circle cx="4" cy="12" r="1.2" fill="#94a3b8" />
    <circle cx="4" cy="18" r="1.2" fill="#94a3b8" />
  </svg>
);

const RulerIcon = ({ size = 45 }) => (
  <svg width={size} height={size} viewBox="0 0 100 30" preserveAspectRatio="xMidYMid meet">
    <rect x="5" y="5" width="90" height="20" rx="2" fill="rgba(167, 139, 250, 0.4)" stroke="#8b5cf6" strokeWidth="2" />
    <line x1="15" y1="5" x2="15" y2="12" stroke="#8b5cf6" strokeWidth="2" />
    <line x1="25" y1="5" x2="25" y2="10" stroke="#8b5cf6" strokeWidth="1" />
    <line x1="35" y1="5" x2="35" y2="12" stroke="#8b5cf6" strokeWidth="2" />
    <line x1="45" y1="5" x2="45" y2="10" stroke="#8b5cf6" strokeWidth="1" />
    <line x1="55" y1="5" x2="55" y2="12" stroke="#8b5cf6" strokeWidth="2" />
    <line x1="65" y1="5" x2="65" y2="10" stroke="#8b5cf6" strokeWidth="1" />
    <line x1="75" y1="5" x2="75" y2="12" stroke="#8b5cf6" strokeWidth="2" />
    <line x1="85" y1="5" x2="85" y2="10" stroke="#8b5cf6" strokeWidth="1" />
  </svg>
);

const GeometryBoxIcon = ({ size = 45 }) => (
  <svg width={size} height={size} viewBox="0 0 80 40" preserveAspectRatio="xMidYMid meet">
    <rect x="5" y="5" width="70" height="30" rx="4" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
    <rect x="5" y="18" width="70" height="4" fill="#475569" />
    <circle cx="40" cy="18" r="4" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
  </svg>
);

const TumblerIcon = ({ size = 35 }) => (
  <svg width={size} height={size} viewBox="0 0 40 60" preserveAspectRatio="xMidYMid meet">
    <polygon points="5,5 35,5 30,55 10,55" fill="rgba(56, 189, 248, 0.2)" stroke="#0ea5e9" strokeWidth="2" />
    <line x1="12" y1="15" x2="16" y2="45" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
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

const CandleIcon = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 30 60" preserveAspectRatio="xMidYMid meet">
    <rect x="10" y="20" width="10" height="35" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1.5" />
    <path d="M15,10 Q20,15 15,20 Q10,15 15,10 Z" fill="#f97316" />
    <path d="M15,12 Q17,16 15,19 Q13,16 15,12 Z" fill="#fbbf24" />
    <line x1="15" y1="20" x2="15" y2="25" stroke="#000" strokeWidth="1" />
  </svg>
);

const BallIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet">
    <circle cx="25" cy="25" r="20" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
    <path d="M15,10 Q25,25 15,40" stroke="#fef08a" strokeWidth="2" fill="none" strokeDasharray="2,2" />
    <path d="M35,10 Q25,25 35,40" stroke="#fef08a" strokeWidth="2" fill="none" strokeDasharray="2,2" />
  </svg>
);

export default function Stage3_Classification({ onComplete, addXp }) {
  const [phase, setPhase] = useState('briefing'); // 'briefing', 'use', 'material', 'demo'
  const [usePlacements, setUsePlacements] = useState({});
  const [materialPlacements, setMaterialPlacements] = useState({});
  const [inspectedItems, setInspectedItems] = useState({});
  const [activeDemoId, setActiveDemoId] = useState('textbook');
  const [draggingOverShelf, setDraggingOverShelf] = useState(null);
  const [draggingOverBasket, setDraggingOverBasket] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const items = [
    { id: 'textbook', name: 'Textbook', icon: TextbookIcon, correctUse: 'School Shelf', correctMaterial: 'Paper' },
    { id: 'ruler', name: 'Ruler', icon: RulerIcon, correctUse: 'School Shelf', correctMaterial: 'Plastic' },
    { id: 'geometry', name: 'Geometry Box', icon: GeometryBoxIcon, correctUse: 'School Shelf', correctMaterial: 'Metal' },
    { id: 'glass', name: 'Tumbler', icon: TumblerIcon, correctUse: 'Kitchen Shelf', correctMaterial: 'Glass' },
    { id: 'plate', name: 'Plate', icon: PlateIcon, correctUse: 'Kitchen Shelf', correctMaterial: 'Ceramic' },
    { id: 'spoon', name: 'Spoon', icon: SpoonIcon, correctUse: 'Kitchen Shelf', correctMaterial: 'Metal' },
    { id: 'candle', name: 'Candle', icon: CandleIcon, correctUse: 'Home Shelf', correctMaterial: 'Wax' },
    { id: 'cricket_ball', name: 'Cricket Ball', icon: BallIcon, correctUse: 'Home Shelf', correctMaterial: 'Leather' }
  ];

  const handleUseSort = (itemId, targetShelf) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    if (item.correctUse === targetShelf) {
      setUsePlacements(prev => ({ ...prev, [itemId]: targetShelf }));
      setErrorMessage('');
      addXp(5);
    } else {
      setErrorMessage(`"${item.name}" belongs on the ${item.correctUse}, not the ${targetShelf}!`);
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
      setErrorMessage(`"${item.name}" is made of ${item.correctMaterial}, not ${targetMaterial}!`);
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  const allUseSorted = Object.keys(usePlacements).length === items.length;
  const allMaterialSorted = Object.keys(materialPlacements).length === items.length;
  const inspectedCount = Object.keys(inspectedItems).length;
  const canFinishDemo = inspectedCount >= 3;

  const handleInspect = (id) => {
    setActiveDemoId(id);
    setInspectedItems(prev => ({ ...prev, [id]: true }));
  };

  const getDemoProperties = (id) => {
    switch (id) {
      case 'textbook':
        return [
          { label: 'Primary Use', value: 'School Item 🎒' },
          { label: 'Base Material', value: 'Paper 📄' },
          { label: 'Surface Texture', value: 'Smooth & Flexible ☁️' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'ruler':
        return [
          { label: 'Primary Use', value: 'School Item 🎒' },
          { label: 'Base Material', value: 'Plastic 🧪' },
          { label: 'Surface Texture', value: 'Hard & Smooth 💎' },
          { label: 'Transparency', value: 'Transparent/Translucent 🔍' }
        ];
      case 'geometry':
        return [
          { label: 'Primary Use', value: 'School Item 🎒' },
          { label: 'Base Material', value: 'Metal 🦾' },
          { label: 'Surface Texture', value: 'Hard & Cold 🧊' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      case 'glass':
        return [
          { label: 'Primary Use', value: 'Kitchen Item 🍳' },
          { label: 'Base Material', value: 'Glass 💎' },
          { label: 'Surface Texture', value: 'Hard & Smooth ✨' },
          { label: 'Transparency', value: 'Transparent 🔍' }
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
      case 'candle':
        return [
          { label: 'Primary Use', value: 'Home Item 🏠' },
          { label: 'Base Material', value: 'Wax 🕯️' },
          { label: 'Surface Texture', value: 'Soft & Waxy ☁️' },
          { label: 'Transparency', value: 'Translucent 🌫️' }
        ];
      case 'cricket_ball':
        return [
          { label: 'Primary Use', value: 'Home Item 🏠' },
          { label: 'Base Material', value: 'Leather 🏏' },
          { label: 'Surface Texture', value: 'Hard & Stitched 🧵' },
          { label: 'Transparency', value: 'Opaque 🌑' }
        ];
      default:
        return [];
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Dynamic phase header */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LayoutGrid size={22} style={{ color: 'var(--accent)' }} /> 
          {phase === 'briefing' && 'Case Briefing: Stage 1 Report'}
          {phase === 'use' && 'Case File 02 – Organizing by Purpose'}
          {phase === 'material' && 'Case File 02 – Scientific Classification'}
          {phase === 'demo' && 'Case File 02 – Multi-Property Insights'}
        </h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
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
              <h3 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.5rem' }}>Investigation Report: Stage 1</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                You have successfully identified the base materials of all classroom evidence.
              </p>
            </div>

            <div style={{ 
              width: '100%', 
              background: 'var(--surface)', 
              borderRadius: '12px', 
              padding: '1.25rem', 
              border: '1px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              textAlign: 'left'
            }}>
              {items.slice(0, 6).map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--success)' }}>✓</span>
                  <strong>{item.name}:</strong> 
                  <span style={{ color: 'var(--accent)' }}>{item.correctMaterial}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: '480px' }}>
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
            style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}
          >
            {/* Left Drawer */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '620px' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Evidence Tray</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', flex: 1, overflowY: 'auto', alignContent: 'start', paddingRight: '0.25rem' }}>
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
                        padding: '1rem 0.5rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        background: isSorted ? 'var(--success-bg)' : 'var(--card-bg)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        opacity: isSorted ? 0.6 : 1,
                        cursor: isSorted ? 'default' : 'grab',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        userSelect: 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: '56px', 
                        height: '56px', 
                        borderRadius: '12px', 
                        background: isSorted ? 'rgba(16, 185, 129, 0.15)' : 'var(--surface)', 
                        color: isSorted ? 'var(--success)' : 'var(--accent)',
                        flexShrink: 0,
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                        border: '1px solid var(--border)'
                      }}>
                        <IconComponent size={32} />
                      </div>
                      <span style={{ fontWeight: '600', fontSize: '0.85rem', lineHeight: '1.2' }}>{item.name}</span>

                      {!isSorted ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                          <select
                            value=""
                            onChange={(e) => handleUseSort(item.id, e.target.value)}
                            style={{ fontSize: '0.7rem', padding: '0.3rem', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none', width: '90px' }}
                          >
                            <option value="" disabled>Shelf</option>
                            <option value="School Shelf">School</option>
                            <option value="Home Shelf">Home</option>
                            <option value="Kitchen Shelf">Kitchen</option>
                          </select>
                        </div>
                      ) : (
                        <div style={{ 
                          position: 'absolute', 
                          top: '6px', 
                          right: '6px', 
                          background: 'var(--success)', 
                          borderRadius: '50%', 
                          width: '20px', 
                          height: '20px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: shelf.color, fontWeight: 'bold', fontSize: '0.95rem' }}>
                        {shelf.icon}
                        <span>{shelf.name}</span>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'flex-end', minHeight: '65px' }}>
                        {sortedHere.map((item) => (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={item.id}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '0.4rem',
                              filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.15))'
                            }}
                          >
                              <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--text-secondary)', background: 'var(--surface)', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                {item.name}
                              </span>
                              <div style={{ transform: 'translateY(1px)' }}>
                                <item.icon size={55} />
                              </div>
                          </motion.div>
                        ))}
                        {sortedHere.length === 0 && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>Empty Shelf</span>
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel"
                  style={{
                    background: 'var(--success-bg)',
                    border: '1px solid var(--success-border)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--success)', lineHeight: '1.5' }}>
                    👨‍🏫 <strong>Teacher says:</strong> "Excellent. You classified objects according to their purpose or everyday use. Let's see how a scientist might analyze them differently."
                  </p>
                  <button
                    className="primary"
                    onClick={() => {
                      setErrorMessage('');
                      setPhase('material');
                    }}
                    style={{ selfAlign: 'flex-end', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.25rem', fontSize: '0.8rem', width: 'fit-content' }}
                  >
                    Proceed to Scientific Material Grouping <ArrowRight size={14} />
                  </button>
                </motion.div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem' }}>
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
            style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}
          >
            {/* Left Drawer */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '620px' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Evidence Tray</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', flex: 1, overflowY: 'auto', alignContent: 'start', paddingRight: '0.25rem' }}>
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
                        padding: '1rem 0.5rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        background: isSorted ? 'var(--success-bg)' : 'var(--card-bg)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        opacity: isSorted ? 0.6 : 1,
                        cursor: isSorted ? 'default' : 'grab',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        userSelect: 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: '56px', 
                        height: '56px', 
                        borderRadius: '12px', 
                        background: isSorted ? 'rgba(16, 185, 129, 0.15)' : 'var(--surface)', 
                        color: isSorted ? 'var(--success)' : 'var(--accent)',
                        flexShrink: 0,
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                        border: '1px solid var(--border)'
                      }}>
                        <IconComponent size={32} />
                      </div>
                      <span style={{ fontWeight: '600', fontSize: '0.85rem', lineHeight: '1.2' }}>{item.name}</span>

                      {!isSorted ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                          <select
                            value=""
                            onChange={(e) => handleMaterialSort(item.id, e.target.value)}
                            style={{ fontSize: '0.7rem', padding: '0.3rem', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--surface)', color: 'var(--text-primary)', outline: 'none', width: '90px' }}
                          >
                            <option value="" disabled>Material</option>
                            <option value="Paper">Paper</option>
                            <option value="Wood">Wood</option>
                            <option value="Plastic">Plastic</option>
                            <option value="Glass">Glass</option>
                            <option value="Metal">Metal</option>
                            <option value="Fabric">Fabric</option>
                            <option value="Ceramic">Ceramic</option>
                            <option value="Wax">Wax</option>
                            <option value="Leather">Leather</option>
                          </select>
                        </div>
                      ) : (
                        <div style={{ 
                          position: 'absolute', 
                          top: '6px', 
                          right: '6px', 
                          background: 'var(--success)', 
                          borderRadius: '50%', 
                          width: '20px', 
                          height: '20px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Material Baskets grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { name: 'Paper', color: '#60a5fa' },
                  { name: 'Wood', color: '#f59e0b' },
                  { name: 'Plastic', color: '#a78bfa' },
                  { name: 'Glass', color: '#38bdf8' },
                  { name: 'Metal', color: '#94a3b8' },
                  { name: 'Fabric', color: '#f43f5e' },
                  { name: 'Ceramic', color: '#fb7185' },
                  { name: 'Wax', color: '#fcd34d' },
                  { name: 'Leather', color: '#a16207' }
                ].map((basket) => {
                  const sortedHere = items.filter(i => materialPlacements[i.id] === basket.name);
                  const isDraggingOverMe = draggingOverBasket === basket.name;
                  return (
                    <div
                      key={basket.name}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDraggingOverBasket(basket.name);
                      }}
                      onDragLeave={() => setDraggingOverBasket(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDraggingOverBasket(null);
                        const itemId = e.dataTransfer.getData('text/plain');
                        handleMaterialSort(itemId, basket.name);
                      }}
                      style={{
                        background: isDraggingOverMe ? 'rgba(var(--accent-rgb), 0.1)' : 'var(--surface)',
                        border: isDraggingOverMe ? '2px dashed var(--accent)' : '1.5px solid var(--border)',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        minHeight: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-heading)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: basket.color }} />
                        <span>{basket.name} Basket</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {sortedHere.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              padding: '0.2rem 0.5rem',
                              background: 'var(--card-bg)',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                              <div style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <item.icon size={12} />
                              </div>
                              <span>{item.name}</span>
                          </div>
                        ))}
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
              {allMaterialSorted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel"
                  style={{
                    background: 'var(--success-bg)',
                    border: '1px solid var(--success-border)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--success)', lineHeight: '1.5' }}>
                    👨‍🏫 <strong>Teacher says:</strong> "Excellent. You classified objects by material. Notice how the same <strong>Notebook</strong> that belonged to the School Shelf now belongs to the <strong>Paper Basket</strong>. This shows that the same object can belong to different groups depending on the property we look at!"
                  </p>
                  <button
                    className="primary"
                    onClick={() => {
                      setErrorMessage('');
                      setPhase('demo');
                    }}
                    style={{ selfAlign: 'flex-end', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.25rem', fontSize: '0.8rem', width: 'fit-content' }}
                  >
                    Analyze Multi-Property Connections <ArrowRight size={14} />
                  </button>
                </motion.div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem' }}>
                  💡 Tip: Drag items to their correct material basket, or select from the dropdown.
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
            style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}
          >
            {/* Left list of items */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '480px' }}>
              <h4 style={{ margin: 0, fontSize: '0.9' , borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Select Object to Inspect</h4>
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
                        padding: '0.5rem 0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--surface)', borderRadius: '4px' }}>
                          <item.icon size={16} />
                        </div>
                        {item.name}
                      </span>
                      {isInspected && <span style={{ fontSize: '0.7rem', color: isActive ? '#fff' : 'var(--success)' }}>✓ Seen</span>}
                    </button>
                  );
                })}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                Objects Inspected: <strong>{inspectedCount} / 3</strong> (Need 3)
              </div>
            </div>

            {/* Right Card / Demo Visualization */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Profile Card */}
              <div className="glass-panel" style={{ background: 'var(--card-bg)', border: '1px solid var(--accent)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    {React.createElement(items.find(i => i.id === activeDemoId)?.icon || TextbookIcon, { size: 40 })}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.25rem' }}>
                      {items.find(i => i.id === activeDemoId)?.name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Multi-Property Classification Profile</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {getDemoProperties(activeDemoId).map((prop, idx) => (
                    <div key={idx} style={{ background: 'var(--surface)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {prop.label}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '0.15rem', display: 'block' }}>
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
                  <h4 style={{ margin: 0, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                    <Award size={18} /> Lesson Outcomes Confirmed!
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
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
                  <button
                    className="primary"
                    onClick={onComplete}
                    style={{ selfAlign: 'flex-end', marginTop: '0.5rem', padding: '0.6rem 2rem', fontWeight: 'bold' }}
                  >
                    Complete Evidence Analysis Case
                  </button>
                </motion.div>
              ) : (
                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
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
