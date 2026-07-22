import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Info, HelpCircle, Check, Award } from 'lucide-react';

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

export default function Stage2_Identify({ onComplete, addXp }) {
  const [selectedObj, setSelectedObj] = useState(null);
  const [scannedObjects, setScannedObjects] = useState({});
  const [showHistoryReveal, setShowHistoryReveal] = useState(false);
  const [scanState, setScanState] = useState('idle'); // 'idle', 'scanning', 'correct', 'incorrect'
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedMaterialOption, setSelectedMaterialOption] = useState(null);

  const objectsToScan = [
    { 
      id: 'textbook', 
      name: 'Textbook', 
      correctMaterial: 'Paper', 
      options: ['Wood', 'Metal', 'Paper', 'Glass'], 
      explanations: {
        'Paper': 'Paper is thin, flexible, and bound into pages for reading.',
        'Wood': 'Wood is rigid and cannot form flexible pages.',
        'Metal': 'Metal is heavy and hard.',
        'Glass': 'Glass is fragile and transparent.'
      },
      icon: TextbookIcon 
    },
    { 
      id: 'ruler', 
      name: 'Ruler', 
      correctMaterial: 'Plastic', 
      options: ['Wood', 'Plastic', 'Metal', 'Glass'], 
      explanations: {
        'Plastic': 'Plastic is lightweight, flexible, and can be easily molded into transparent rulers.',
        'Wood': 'A wood ruler is opaque and more rigid.',
        'Metal': 'Metal is very hard, heavy, and rigid.',
        'Glass': 'Glass is too fragile and dangerous for a school bag.'
      },
      icon: RulerIcon 
    },
    { 
      id: 'geometry', 
      name: 'Geometry Box', 
      correctMaterial: 'Metal', 
      options: ['Paper', 'Plastic', 'Glass', 'Metal'], 
      explanations: {
        'Metal': 'Metal is strong, durable, and protects the delicate tools inside.',
        'Paper': 'Paper would easily crush and tear.',
        'Plastic': 'Some are plastic, but this heavy-duty box is made of metal.',
        'Glass': 'Glass would shatter instantly in a school bag.'
      },
      icon: GeometryBoxIcon 
    },
    { 
      id: 'glass', 
      name: 'Tumbler', 
      correctMaterial: 'Glass', 
      options: ['Paper', 'Glass', 'Metal', 'Fabric'], 
      explanations: {
        'Glass': 'Glass is transparent, rigid, and holds liquids perfectly.',
        'Paper': 'Paper would get soggy and collapse.',
        'Metal': 'Metal is opaque, so you cannot see the liquid inside.',
        'Fabric': 'Fabric is porous and liquids leak right through it.'
      },
      icon: TumblerIcon 
    },
    { 
      id: 'spoon', 
      name: 'Spoon', 
      correctMaterial: 'Metal', 
      options: ['Fabric', 'Ceramic', 'Metal', 'Plastic'], 
      explanations: {
        'Metal': 'Metal is extremely durable, lustrous, and safe for eating.',
        'Fabric': 'Fabric is soft and cannot hold food.',
        'Ceramic': 'Ceramic spoons exist but are very fragile.',
        'Plastic': 'Plastic can melt in hot soups.'
      },
      icon: SpoonIcon 
    },
    { 
      id: 'candle', 
      name: 'Candle', 
      correctMaterial: 'Wax', 
      options: ['Ceramic', 'Wood', 'Wax', 'Plastic'], 
      explanations: {
        'Wax': 'Wax melts easily when heated by the wick to produce light.',
        'Ceramic': 'Ceramic does not melt to fuel a flame.',
        'Wood': 'Wood burns away completely as fuel, catching fire entirely.',
        'Plastic': 'Plastic releases toxic fumes when burned and melts dangerously.'
      },
      icon: CandleIcon 
    }
  ];

  const handleScanObject = (obj) => {
    setSelectedObj(obj);
    setSelectedMaterialOption(scannedObjects[obj.id] ? obj.correctMaterial : null);
    
    if (scannedObjects[obj.id]) {
      setScanState('correct');
    } else {
      setScanState('scanning');
      // Simulate scan animation
      setTimeout(() => {
        setScanState('idle');
      }, 1200);
    }
  };

  const handleSelectMaterial = (material) => {
    if (!selectedObj || scanState === 'scanning') return;

    setSelectedMaterialOption(material);

    if (material === selectedObj.correctMaterial) {
      setScanState('correct');
      const newScanned = { ...scannedObjects, [selectedObj.id]: true };
      setScannedObjects(newScanned);
      addXp(15);
      
      if (Object.keys(newScanned).length === objectsToScan.length) {
        onComplete();
      }
      
      // Auto-reset the scanner back to idle after giving them time to read the explanation
      setTimeout(() => {
        setSelectedObj((prev) => prev?.id === selectedObj.id ? null : prev);
        setScanState((prev) => prev === 'correct' ? 'idle' : prev);
        setSelectedMaterialOption((prev) => prev === material ? null : prev);
      }, 3500);
    } else {
      setScanState('incorrect');
    }
  };

  const allCompleted = Object.keys(scannedObjects).length === objectsToScan.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', flex: 1, minHeight: 0 }}>
      <style>{`
        :root {
          --scanner-bg: linear-gradient(to bottom, #e2e8f0 0%, #f1f5f9 100%);
          --scanner-border: 2px dashed #94a3b8;
          --scanner-text: #1e293b;
          --scanner-subtext: #475569;
          --scanner-circle-bg: rgba(0, 0, 0, 0.03);
          --scanner-circle-border: #94a3b8;
          --scanner-subject-color: #0f172a;
        }
        [data-theme="dark"] {
          --scanner-bg: #0b1329;
          --scanner-border: 2px dashed var(--accent);
          --scanner-text: #ffffff;
          --scanner-subtext: #94a3b8;
          --scanner-circle-bg: rgba(255, 255, 255, 0.03);
          --scanner-circle-border: #475569;
          --scanner-subject-color: #ffffff;
        }
        .interactive-tray-item:hover {
          border-color: var(--accent) !important;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Introduction */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={22} style={{ color: 'var(--accent)' }} /> Case File: Table 6.1 (Identify Materials)
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)' }}>
          To understand materials, detectives first list items they observe and identify the substances they are made of. Drag items to the Scanner Pad or click them to test!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 38%) 1fr', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        {/* Left: Tray of items */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: 0 }}>
          <h4 style={{ margin: 0, fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', flexShrink: 0 }}>Evidence Tray</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
            {objectsToScan.map((obj) => {
              const isScanned = scannedObjects[obj.id];
              const isSelected = selectedObj?.id === obj.id;
              const IconComponent = obj.icon;
              return (
                <div
                  key={obj.id}
                  draggable={!isScanned}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', obj.id);
                  }}
                  onClick={() => handleScanObject(obj)}
                  className="interactive-tray-item"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                    background: isScanned ? 'var(--success-bg)' : isSelected ? 'var(--accent-bg)' : 'var(--card-bg)',
                    color: isScanned ? 'var(--success)' : 'var(--text-primary)',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '1rem',
                    cursor: isScanned ? 'default' : 'grab',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    userSelect: 'none',
                    position: 'relative',
                    boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.15)' : 'none'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '52px', 
                    height: '52px', 
                    borderRadius: '12px', 
                    background: isScanned ? 'rgba(16, 185, 129, 0.15)' : 'var(--surface)', 
                    color: isScanned ? 'var(--success)' : 'var(--accent)',
                    flexShrink: 0,
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                    border: '1px solid var(--border)'
                  }}>
                    <IconComponent size={30} />
                  </div>
                  <span style={{ fontWeight: isSelected ? 'bold' : '600', fontSize: '1rem', lineHeight: '1.2', flex: 1 }}>{obj.name}</span>
                  
                  {isScanned && (
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

        {/* Middle: Holographic Scanner */}
        <div 
          className="glass-panel" 
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDraggingOver(true)}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingOver(false);
            const objId = e.dataTransfer.getData('text/plain');
            const found = objectsToScan.find(o => o.id === objId);
            if (found) {
              handleScanObject(found);
            }
          }}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flex: 1,
            minHeight: 'clamp(350px, 50vh, 600px)',
            position: 'relative', 
            background: isDraggingOver ? 'var(--accent-bg)' : 'var(--scanner-bg)', 
            border: isDraggingOver ? '3px dashed var(--accent)' : 'var(--scanner-border)',
            transition: 'all 0.25s ease-in-out',
            overflow: 'hidden'
          }}
        >
          {/* Scanning lines */}
          {scanState === 'scanning' && (
            <motion.div 
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '4px',
                background: 'rgba(99, 102, 241, 0.8)',
                boxShadow: '0 0 15px #6366f1, 0 0 30px #6366f1',
                zIndex: 5
              }}
              animate={{ top: ['5%', '95%', '5%'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {allCompleted ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', zIndex: 2, textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '3px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={40} style={{ color: '#10b981' }} />
              </div>
              <div>
                <h3 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.75rem' }}>Scan Complete!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '320px', lineHeight: '1.5' }}>
                  You have successfully scanned and identified materials for all objects. Click <strong>"Proceed to next"</strong> in the top right!
                </p>
              </div>
            </div>
          ) : selectedObj ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', zIndex: 2 }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: 'var(--scanner-subtext)', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Scanning Subject</span>
                <h3 style={{ margin: '0.25rem 0 0 0', color: 'var(--scanner-subject-color)', fontSize: '1.6rem' }}>{selectedObj.name}</h3>
              </div>

              {/* Scanning visual circle */}
              <div 
                style={{ 
                  width: 'clamp(130px, 15vw, 160px)', 
                  height: 'clamp(130px, 15vw, 160px)', 
                  borderRadius: '50%', 
                  border: `4px solid ${scanState === 'scanning' ? '#6366f1' : scanState === 'correct' ? '#10b981' : scanState === 'incorrect' ? '#ef4444' : 'var(--scanner-circle-border)'}`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'var(--scanner-circle-bg)',
                  boxShadow: scanState === 'scanning' ? '0 0 25px rgba(99,102,241,0.4)' : 'none',
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
              >
                {/* Render the actual object icon inside the scanner circle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: scanState === 'scanning' ? 'scale(1.15)' : 'scale(1)',
                  filter: scanState === 'scanning' ? 'brightness(1.2)' : 'none',
                  transition: 'transform 0.3s',
                  zIndex: 2
                }}>
                  <selectedObj.icon size={65} />
                </div>

                {/* Scanning overlay effect */}
                {scanState === 'scanning' && (
                  <motion.div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '2px solid #6366f1',
                      zIndex: 3
                    }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}

                {/* Status Badges */}
                {scanState === 'correct' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    right: '-8px',
                    background: '#10b981',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    zIndex: 4
                  }}>
                    <Check size={20} />
                  </div>
                )}
                {scanState === 'incorrect' && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    right: '-8px',
                    background: '#ef4444',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    zIndex: 4
                  }}>
                    <HelpCircle size={20} />
                  </div>
                )}
              </div>

              {/* Selection Options */}
              {scanState !== 'scanning' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '85%', alignItems: 'center' }}>
                  <span style={{ color: 'var(--scanner-subtext)', fontSize: '0.95rem', fontWeight: 'bold' }}>Select Identified Material:</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%' }}>
                    {selectedObj.options.map((option) => {
                      const isOptionSelected = selectedMaterialOption === option;
                      const isCorrect = option === selectedObj.correctMaterial;
                      const hasScannedThis = scannedObjects[selectedObj.id];

                        let btnStyle = {
                          padding: '0.85rem 0.5rem',
                          fontSize: '1rem',
                          background: 'var(--surface)',
                          color: 'var(--text-primary)',
                          borderColor: 'var(--border)',
                          transition: 'all 0.2s',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        };

                      if (hasScannedThis && isCorrect) {
                        btnStyle.background = 'rgba(16, 185, 129, 0.15)';
                        btnStyle.color = 'var(--success)';
                        btnStyle.borderColor = 'var(--success)';
                        btnStyle.fontWeight = 'bold';
                      } else if (isOptionSelected && scanState === 'incorrect') {
                        btnStyle.background = 'rgba(239, 68, 68, 0.15)';
                        btnStyle.color = 'var(--danger)';
                        btnStyle.borderColor = 'var(--danger)';
                      }

                      return (
                        <button
                          key={option}
                          onClick={() => handleSelectMaterial(option)}
                          className="outline"
                          style={btnStyle}
                          disabled={hasScannedThis}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  
                  {selectedMaterialOption && (
                    <motion.div 
                      key={`${selectedObj.id}-${selectedMaterialOption}`}
                      initial={{ opacity: 0, y: 5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      style={{ 
                        fontSize: '0.95rem', 
                        textAlign: 'center', 
                        marginTop: '0.5rem', 
                        lineHeight: '1.5',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        width: '100%',
                        background: selectedMaterialOption === selectedObj.correctMaterial ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${selectedMaterialOption === selectedObj.correctMaterial ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                        color: selectedMaterialOption === selectedObj.correctMaterial ? 'var(--success)' : 'var(--danger)'
                      }}
                    >
                      <strong>{selectedMaterialOption === selectedObj.correctMaterial ? 'Success!' : 'Try again!'}</strong>{' '}
                      {selectedObj.explanations[selectedMaterialOption]}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--scanner-subtext)', textAlign: 'center', padding: '1.5rem' }}>
              <Search size={48} />
              <span style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>Scanner Active</span>
              <span style={{ fontSize: '1rem', opacity: 0.8, maxWidth: '280px', lineHeight: '1.5' }}>
                Drag an object from the Evidence Tray and drop it here to scan it!
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
