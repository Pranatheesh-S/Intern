import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Info, HelpCircle, Check, Award } from 'lucide-react';
import scannerResultNotebook from '../images/scanner_result_notebook.png';
import scannerResultRuler from '../images/scanner_result_ruler.png';
import scannerResultGeometry from '../images/scanner_result_geometry.png';
import scannerResultGlass from '../images/scanner_result_glass.png';
import scannerResultSpoon from '../images/scanner_result_spoon.png';
import scannerResultCandle from '../images/scanner_result_candle.png';
import isolatedTextbook from '../images/isolated_textbook.jpg';
import isolatedRuler from '../images/isolated_ruler.jpg';
import isolatedLunchbox from '../images/isolated_lunchbox.jpg';
import isolatedTumbler from '../images/isolated_tumbler.jpg';
import isolatedSpoon from '../images/isolated_spoon.jpg';
import isolatedCandle from '../images/isolated_candle.jpg';


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
    <rect x="5" y="5" width="90" height="20" rx="2" fill="rgba(167, 139, 250, 0.4)" stroke="#3B2A1F" strokeWidth="2" />
    <line x1="15" y1="5" x2="15" y2="12" stroke="#3B2A1F" strokeWidth="2" />
    <line x1="25" y1="5" x2="25" y2="10" stroke="#3B2A1F" strokeWidth="1" />
    <line x1="35" y1="5" x2="35" y2="12" stroke="#3B2A1F" strokeWidth="2" />
    <line x1="45" y1="5" x2="45" y2="10" stroke="#3B2A1F" strokeWidth="1" />
    <line x1="55" y1="5" x2="55" y2="12" stroke="#3B2A1F" strokeWidth="2" />
    <line x1="65" y1="5" x2="65" y2="10" stroke="#3B2A1F" strokeWidth="1" />
    <line x1="75" y1="5" x2="75" y2="12" stroke="#3B2A1F" strokeWidth="2" />
    <line x1="85" y1="5" x2="85" y2="10" stroke="#3B2A1F" strokeWidth="1" />
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
      icon: TextbookIcon,
      image: scannerResultNotebook,
      boardImage: isolatedTextbook 
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
      icon: RulerIcon,
      image: scannerResultRuler,
      boardImage: isolatedRuler 
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
      icon: GeometryBoxIcon,
      image: scannerResultGeometry,
      boardImage: isolatedLunchbox 
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
      icon: TumblerIcon,
      image: scannerResultGlass,
      boardImage: isolatedTumbler 
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
      icon: SpoonIcon,
      image: scannerResultSpoon,
      boardImage: isolatedSpoon 
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
      icon: CandleIcon,
      image: scannerResultCandle,
      boardImage: isolatedCandle 
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Left: Tray of items */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', height: '100%', width: '100%' }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            padding: '20px', 
            background: '#FAF8F5',
            border: '2px solid var(--lesson-border)',
            borderRadius: '12px',
            boxShadow: 'inset 0 0 40px rgba(226, 211, 185, 0.3), 0 4px 12px rgba(0,0,0,0.05)',
            height: '100%',
            minHeight: '100%',
            position: 'relative'
          }}>
            {/* Subtle corner markings */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', width: '10px', height: '10px', borderTop: '2px solid var(--lesson-border)', borderLeft: '2px solid var(--lesson-border)' }} />
            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '10px', height: '10px', borderTop: '2px solid var(--lesson-border)', borderRight: '2px solid var(--lesson-border)' }} />

            <div style={{ borderBottom: '2px dashed var(--lesson-border)', paddingBottom: '12px', marginBottom: '8px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Search size={28} color="#3B2A1F" />
                <h4 style={{ margin: 0, fontSize: '1.75rem', letterSpacing: '1px', color: '#3B2A1F', fontWeight: '900' }}>EVIDENCE BOARD</h4>
              </div>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#7A6A52', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700' }}>CASE FILE 06 • MATERIAL SAMPLES</h3>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start', background: '#A64B27', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '800', marginTop: '4px', letterSpacing: '0.5px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }} />
                {objectsToScan.length} ITEMS • READY TO SCAN
              </div>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
              gap: '12px', 
              alignItems: 'stretch',
              flex: 1,
              minHeight: 0
            }}>
              {objectsToScan.map((obj, index) => {
                const isScanned = scannedObjects[obj.id];
                const isSelected = selectedObj?.id === obj.id;
                const isScanning = isSelected && scanState === 'scanning';
                
                let borderColor = 'rgba(0,0,0,0.08)';
                let shadow = '0 4px 12px rgba(0,0,0,0.05)';
                let labelText = 'READY TO SCAN';
                let labelColor = '#7A6A52';
                let bgColor = '#FFFFFF';
                let nameColor = '#3B2A1F';
                
                if (isScanned) {
                  borderColor = '#A64B27';
                  bgColor = '#FAF8F5';
                  labelText = 'SCANNED';
                  labelColor = '#A64B27';
                } else if (isScanning) {
                  borderColor = '#A64B27';
                  shadow = '0 0 20px rgba(166, 75, 39, 0.2)';
                  labelText = 'SCANNING...';
                  labelColor = '#A64B27';
                } else if (isSelected) {
                  borderColor = '#A64B27';
                  shadow = '0 6px 16px rgba(166, 75, 39, 0.15)';
                  labelText = 'SELECTED';
                  labelColor = '#A64B27';
                }

                return (
                  <div
                    key={obj.id}
                    draggable={!isScanned}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', obj.id);
                    }}
                    onClick={() => handleScanObject(obj)}
                    className={`interactive-tray-item ${isScanned ? 'scanned-item' : ''}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1px solid ${borderColor}`,
                      background: bgColor,
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: isScanned ? 'default' : 'pointer',
                      boxShadow: shadow,
                      userSelect: 'none',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Header: Label */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#7A6A52', fontWeight: '800', letterSpacing: '0.5px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '4px', height: '12px', background: '#A64B27', borderRadius: '2px' }} />
                        <span>EVIDENCE {(index + 1).toString().padStart(2, '0')}</span>
                      </div>
                    </div>

                    {/* Image Area */}
                    <div style={{ 
                      flex: 1,
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      position: 'relative', 
                      minHeight: 0,
                      background: '#F9F9F9',
                      borderRadius: '4px',
                      marginBottom: '8px',
                      overflow: 'hidden'
                    }}>
                      {obj.boardImage || obj.image ? (
                        <img 
                          src={obj.boardImage || obj.image} 
                          alt={obj.name} 
                          style={{ 
                            display: 'block', 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'contain',
                            objectPosition: 'center',
                            mixBlendMode: 'multiply'
                          }} 
                        />
                      ) : null}
                    </div>

                    {/* Footer: Name & Status */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '900', color: nameColor, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{obj.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800', color: labelColor, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {isScanning && (
                             <motion.span
                               animate={{ opacity: [1, 0.4, 1] }}
                               transition={{ duration: 1, repeat: Infinity }}
                               style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#A64B27', display: 'inline-block' }}
                             />
                          )}
                          {labelText}
                        </span>
                        {isScanned && <Check size={16} strokeWidth={3} style={{ color: '#A64B27' }} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>\n        {/* Middle: Holographic Scanner */}
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
            height: '100%', minHeight: 0, 
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
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '3px solid #D9C9A3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={40} style={{ color: '#3B2A1F' }} />
              </div>
              <div>
                <h3 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.75rem' }}>Scan Complete!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '320px', lineHeight: '1.5' }}>
                  You have successfully scanned and identified materials for all objects. Click <strong>"Proceed to next"</strong> in the bottom right corner!
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
                  width: '200px', 
                  height: '200px', 
                  borderRadius: '50%', 
                  border: `4px solid ${scanState === 'scanning' ? '#6366f1' : scanState === 'correct' ? '#3B2A1F' : scanState === 'incorrect' ? '#ef4444' : 'var(--scanner-circle-border)'}`, 
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
                  <selectedObj.icon size={90} />
                </div>

                {/* Scanning overlay effect */}
                {scanState === 'scanning' && (
                  <motion.div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '2px solid #D9C9A3',
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
                    background: '#FFFFFF',
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
                    background: '#FFFFFF',
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
