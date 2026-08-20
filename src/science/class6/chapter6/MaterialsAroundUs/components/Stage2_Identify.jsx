import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Info, HelpCircle, Check, Award } from 'lucide-react';
import scannerIdleBg from '../images/scanner_pad_bg.png';
import scannerActiveBg from '../images/scanner_active_bg.png';
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

// Custom Item SVGs removed to use actual realistic PNGs
const BigTumblerVisual = ({ width = "100%", height = "100%" }) => (
  <svg width={width} height={height} viewBox="0 0 100 130" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
        <stop offset="15%" stopColor="rgba(255,255,255,0.4)" />
        <stop offset="30%" stopColor="rgba(255,255,255,0.05)" />
        <stop offset="70%" stopColor="rgba(255,255,255,0.02)" />
        <stop offset="85%" stopColor="rgba(255,255,255,0.3)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
      </linearGradient>
      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(56, 189, 248, 0.3)" />
        <stop offset="100%" stopColor="rgba(14, 165, 233, 0.5)" />
      </linearGradient>
    </defs>
    {/* Base rim (back) */}
    <ellipse cx="50" cy="115" rx="30" ry="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    {/* Liquid */}
    <path d="M 23 60 L 21 115 A 30 8 0 0 0 79 115 L 77 60 A 34 9 0 0 1 23 60 Z" fill="url(#waterGrad)" />
    {/* Liquid top */}
    <ellipse cx="50" cy="60" rx="27" ry="6" fill="rgba(56, 189, 248, 0.4)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    {/* Glass body */}
    <path d="M 15 15 L 21 115 A 30 8 0 0 0 79 115 L 85 15 Z" fill="url(#glassGrad)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
    {/* Base rim (front) */}
    <path d="M 21 115 A 30 8 0 0 0 79 115" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
    {/* Top rim */}
    <ellipse cx="50" cy="15" rx="35" ry="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
    {/* Top rim inner reflection */}
    <ellipse cx="50" cy="16" rx="33" ry="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    {/* Side highlight */}
    <path d="M 22 25 L 26 110" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
    <path d="M 26 26 L 30 108" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export default function Stage2_Identify({ onComplete, addXp }) {
  const [selectedObj, setSelectedObj] = useState(null);
  const [scannedObjects, setScannedObjects] = useState({});
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
      image: scannerResultRuler,
      boardImage: isolatedRuler
    },
    {
      id: 'lunchbox',
      name: 'Lunch Box',
      correctMaterial: 'Metal',
      options: ['Paper', 'Plastic', 'Glass', 'Metal'],
      explanations: {
        'Metal': 'Metal is strong, durable, and protects the food inside.',
        'Paper': 'Paper would easily crush and leak.',
        'Plastic': 'Some are plastic, but this sturdy box is made of metal.',
        'Glass': 'Glass would shatter easily in a school bag.'
      },
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
      image: scannerResultCandle,
      boardImage: isolatedCandle
    }
  ];

  const handleScanObject = (obj) => {
    setSelectedObj(obj);
    setSelectedMaterialOption(scannedObjects[obj.id] ? obj.correctMaterial : null);
    setScanState('scanning');
  };

  React.useEffect(() => {
    let timer1, timer2;
    if (scanState === 'scanning') {
      timer1 = setTimeout(() => {
        setScanState('scan_complete');
      }, 3000);
    } else if (scanState === 'scan_complete') {
      timer2 = setTimeout(() => {
        if (selectedObj && scannedObjects[selectedObj.id]) {
          setScanState('correct');
        } else {
          setScanState('awaiting_material');
        }
      }, 1000);
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [scanState, selectedObj, scannedObjects]);

  const handleSelectMaterial = (material) => {
    if (!selectedObj || scanState === 'scanning' || scanState === 'scan_complete') return;

    setSelectedMaterialOption(material);

    if (material === selectedObj.correctMaterial) {
      setScanState('correct');
      const newScanned = { ...scannedObjects, [selectedObj.id]: true };
      setScannedObjects(newScanned);
      addXp(15);

      if (Object.keys(newScanned).length === objectsToScan.length) {
        onComplete();
      }

    } else {
      setScanState('incorrect');
    }
  };

  const allCompleted = Object.keys(scannedObjects).length === objectsToScan.length;

  const getScannerBackground = () => {
    if (scanState === 'scanning' || isDraggingOver) return `url('${scannerActiveBg}')`;
    if (selectedObj) return `url('${scannerActiveBg}')`;
    return `url('${scannerIdleBg}')`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', flex: 1, minHeight: 0 }}>
      <style>{`
        :root {
          --scanner-border: 2px solid #94a3b8;
          --scanner-text: #1e293b;
          --scanner-subtext: #ffffff;
          --scanner-circle-bg: rgba(0, 0, 0, 0.2);
          --scanner-circle-border: #94a3b8;
          --scanner-subject-color: #ffffff;
        }
        [data-theme="dark"] {
          --scanner-border: 2px solid var(--accent);
          --scanner-text: #ffffff;
          --scanner-subtext: #ffffff;
          --scanner-circle-bg: rgba(255, 255, 255, 0.03);
          --scanner-circle-border: #475569;
          --scanner-subject-color: #ffffff;
        }
        .interactive-tray-item:hover {
          border-color: var(--accent) !important;
          transform: translateY(-1px);
        }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 40%) minmax(0, 60%)', gap: '1.25rem', flex: 1, minHeight: 0, height: '100%', overflow: 'hidden', paddingLeft: '1rem', alignItems: 'stretch' }}>
        {/* Left: Tray of items */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', height: '100%', width: '100%' }}>
          <div className="glass-panel" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.75rem', 
            padding: '1rem', 
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            height: '100%',
            minHeight: '100%'
          }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem', flexShrink: 0 }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', letterSpacing: '1px', color: 'var(--text-heading)', fontWeight: 'bold' }}>EVIDENCE BOARD</h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem', letterSpacing: '0.5px' }}>CASE FILE 06 • MATERIAL SAMPLES</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent)', marginTop: '0.4rem', fontWeight: 'bold' }}>{objectsToScan.length} ITEMS • READY TO SCAN</div>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gridTemplateRows: 'repeat(3, minmax(0, 1fr))',
              gap: '12px', 
              alignItems: 'stretch',
              flex: 1,
              minHeight: 0
            }}>
              {objectsToScan.map((obj, index) => {
                const isScanned = scannedObjects[obj.id];
                const isSelected = selectedObj?.id === obj.id;
                const isScanning = isSelected && scanState === 'scanning';
                
                let borderColor = 'var(--border)';
                let glow = 'none';
                let labelText = 'READY TO SCAN';
                let labelColor = 'var(--text-secondary)';
                
                if (isScanned) {
                  borderColor = 'var(--success)';
                  labelText = 'SCANNED';
                  labelColor = 'var(--success)';
                } else if (isScanning) {
                  borderColor = 'var(--accent)';
                  glow = '0 0 10px rgba(99, 102, 241, 0.4)';
                  labelText = 'SCANNING...';
                  labelColor = 'var(--accent)';
                } else if (isSelected) {
                  borderColor = 'var(--accent)';
                  glow = '0 0 15px rgba(99, 102, 241, 0.2)';
                  labelText = 'SELECTED FOR SCAN';
                  labelColor = 'var(--accent)';
                }

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
                      padding: '6px 8px',
                      borderRadius: '8px',
                      border: `1px solid ${borderColor}`,
                      background: 'var(--card-bg)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      cursor: isScanned ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      userSelect: 'none',
                      position: 'relative',
                      boxShadow: glow
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.6rem', color: 'var(--text-secondary)', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                      <span>EVIDENCE {(index + 1).toString().padStart(2, '0')}</span>
                      {isScanned && <Check size={12} strokeWidth={3} style={{ color: 'var(--success)' }} />}
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: '100%', 
                      flex: 1,
                      minHeight: 0,
                      borderRadius: '6px', 
                      background: '#ffffff', 
                      position: 'relative', 
                      overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                      {obj.boardImage || obj.image ? (
                        <img 
                          src={obj.boardImage || obj.image} 
                          alt={obj.name} 
                          style={{ 
                            display: 'block', 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: 'center',
                            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' 
                          }} 
                        />
                      ) : null}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', marginTop: '2px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{obj.name}</span>
                      <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: labelColor, display: 'flex', alignItems: 'center', gap: '4px', minHeight: '14px' }}>
                        {isScanning && (
                           <motion.span
                             animate={{ opacity: [1, 0.4, 1] }}
                             transition={{ duration: 1, repeat: Infinity }}
                             style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }}
                           />
                        )}
                        {labelText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Middle: Holographic Scanner Area */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          minHeight: 0, 
          overflow: 'hidden',
          borderRadius: '12px',
          border: isDraggingOver ? '3px dashed var(--accent)' : 'var(--scanner-border)',
          transition: 'border 0.25s'
        }}>
          
          {/* TOP: SCAN VIEWPORT */}
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
              position: 'relative',
              backgroundImage: getScannerBackground(),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              overflow: 'hidden',
              border: 'none',
              borderRadius: 0
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.2)', zIndex: 1 }} />

            {/* The Scanned Object */}
            {selectedObj && !allCompleted && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3,
                transition: 'all 0.4s ease-in-out'
              }}>
                {selectedObj.id === 'glass' ? (
                  <BigTumblerVisual width="40%" height="70%" />
                ) : (
                  <img 
                    src={selectedObj.image} 
                    alt={selectedObj.name} 
                    style={{ 
                      width: '80%', 
                      height: '80%', 
                      objectFit: 'contain',
                      WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                      maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                      mixBlendMode: 'lighten',
                      filter: 'drop-shadow(0 0 25px rgba(56, 189, 248, 0.4))' 
                    }} 
                  />
                )}
                
                {/* Scanning effect */}
                {scanState === 'scanning' && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: 0, left: '10%', right: '10%',
                      height: '4px',
                      background: 'rgba(56, 189, 248, 0.9)',
                      boxShadow: '0 0 15px #38bdf8, 0 0 30px #38bdf8',
                      zIndex: 5
                    }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </div>
            )}

            {/* Completion or Idle States */}
            <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              {allCompleted ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', zIndex: 5, textAlign: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.6)', borderRadius: '16px', backdropFilter: 'blur(8px)' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '3px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
                    <Award size={40} style={{ color: '#10b981' }} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#ffffff', fontSize: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Scan Complete!</h3>
                    <p style={{ color: '#e2e8f0', fontSize: '1.1rem', marginTop: '0.75rem', maxWidth: '340px', lineHeight: '1.5', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                      You have successfully scanned and identified materials for all objects. Click <strong style={{ color: '#ffffff' }}>"Proceed to next"</strong> in the top right!
                    </p>
                  </div>
                </div>
              ) : !selectedObj ? (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', minHeight: 0, overflow: 'hidden', gap: '0.75rem', position: 'relative', alignItems: 'center', justifyContent: 'center', color: 'var(--scanner-subtext)', textAlign: 'center', padding: '1.5rem', zIndex: 2 }}>
                  <Search size={48} />
                  <span style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>Scanner Active</span>
                  <span style={{ fontSize: '1rem', opacity: 0.8, maxWidth: '280px', lineHeight: '1.5' }}>
                    Drag an object from the Evidence Tray and drop it here to scan it!
                  </span>
                </div>
              ) : null}
            </div>

            {/* Scan Complete Indicator inside viewport */}
            {scanState === 'scan_complete' && !allCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#10b981',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  letterSpacing: '2px',
                  background: 'var(--surface)',
                  padding: '1rem 2rem',
                  borderRadius: '2rem',
                  border: '1px solid #10b981',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
                  zIndex: 10,
                  backdropFilter: 'blur(8px)'
                }}
              >
                <Check size={28} /> SCAN COMPLETE
              </motion.div>
            )}

            {/* Overlay: IDENTIFICATION / DATA AREA inside Scanner Viewport */}
            {selectedObj && (scanState === 'awaiting_material' || scanState === 'incorrect' || scanState === 'correct') && !allCompleted && (
              <div style={{ 
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
                padding: '1rem'
              }}>
                <style>{`
                  [data-theme="dark"] .scanner-glass-panel {
                    background: rgba(15, 23, 42, 0.75) !important;
                    border-color: rgba(255, 255, 255, 0.1) !important;
                  }
                `}</style>
                <div className="scanner-glass-panel" style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  borderRadius: '16px',
                  padding: '1.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '420px'
                }}>
                
                {scanState !== 'correct' ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '500px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: '#10b981', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                      <Check size={18} /> SCAN COMPLETE
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ color: 'var(--text-heading)', fontSize: '1.2rem', fontWeight: 'bold' }}>IDENTIFY MATERIAL</span>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>{selectedObj.name.toUpperCase()}</div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', marginTop: '0.5rem' }}>
                      {selectedObj.options.map((option) => {
                        const isOptionSelected = selectedMaterialOption === option;
                        const isCorrect = option === selectedObj.correctMaterial;
                        const hasScannedThis = scannedObjects[selectedObj.id];
      
                        let btnStyle = {
                          padding: '1rem 0.5rem',
                          fontSize: '1rem',
                          background: 'var(--card-bg)',
                          color: 'var(--text-primary)',
                          borderColor: 'var(--border)',
                          transition: 'all 0.2s',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        };
      
                        if (hasScannedThis && isCorrect) {
                          btnStyle.background = 'rgba(16, 185, 129, 0.1)';
                          btnStyle.color = '#10b981';
                          btnStyle.borderColor = '#10b981';
                          btnStyle.fontWeight = 'bold';
                        } else if (isOptionSelected && scanState === 'incorrect') {
                          btnStyle.background = 'rgba(239, 68, 68, 0.1)';
                          btnStyle.color = '#ef4444';
                          btnStyle.borderColor = '#ef4444';
                        }
      
                        return (
                          <button
                            key={option}
                            onClick={() => handleSelectMaterial(option)}
                            className="outline"
                            style={btnStyle}
                            disabled={hasScannedThis}
                          >
                            {option.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                    
                    {selectedMaterialOption && selectedMaterialOption !== selectedObj.correctMaterial && (
                      <motion.div
                        key={`${selectedObj.id}-${selectedMaterialOption}`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ width: '100%', marginTop: '0.5rem' }}
                      >
                        <div style={{
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          lineHeight: '1.4',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444'
                        }}>
                          <strong>Try again!</strong> {selectedObj.explanations[selectedMaterialOption]}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '500px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '1rem', fontWeight: 800, letterSpacing: '1px' }}>
                        <Check size={20} /> MATERIAL IDENTIFIED
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                      <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '0.25rem', fontWeight: 700 }}>OBJECT</div>
                        <div style={{ color: 'var(--text-heading)', fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.5px' }}>{selectedObj.name.toUpperCase()}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '0.25rem', fontWeight: 700 }}>MATERIAL</div>
                        <div style={{ color: 'var(--accent)', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '1px' }}>{selectedMaterialOption.toUpperCase()}</div>
                      </div>
                    </div>
    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px', fontWeight: 700 }}>PROPERTIES</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {(() => {
                          let text = selectedObj.explanations[selectedMaterialOption];
                          const prefix = selectedMaterialOption + ' is ';
                          if (text.toLowerCase().startsWith(prefix.toLowerCase())) {
                            text = text.substring(prefix.length);
                          }
                          if (text.endsWith('.')) text = text.substring(0, text.length - 1);
                          const parts = text.split(/,\s*and\s+|,\s*|\s+and\s+/).map(p => p.trim()).filter(p => p.length > 0);
                          return parts.map((part, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.4rem 0.75rem', borderRadius: '4px', fontWeight: 600 }}>
                              <span style={{ color: '#10b981' }}>✓</span> {part.charAt(0).toUpperCase() + part.slice(1)}
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
    
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                      <button
                        onClick={() => {
                          setSelectedObj((prev) => prev?.id === selectedObj.id ? null : prev);
                          setScanState((prev) => prev === 'correct' ? 'idle' : prev);
                          setSelectedMaterialOption((prev) => prev === selectedMaterialOption ? null : prev);
                        }}
                        className="primary"
                        style={{
                          padding: '0.75rem 2rem',
                          fontSize: '1rem',
                          fontWeight: 800,
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        OK, GOT IT
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
