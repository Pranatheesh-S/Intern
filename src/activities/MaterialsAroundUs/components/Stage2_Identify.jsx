import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Info, HelpCircle, Check, Award } from 'lucide-react';

export default function Stage2_Identify({ onComplete, addXp }) {
  const [selectedObj, setSelectedObj] = useState(null);
  const [scannedObjects, setScannedObjects] = useState({});
  const [showHistoryReveal, setShowHistoryReveal] = useState(false);
  const [scanState, setScanState] = useState('idle'); // 'idle', 'scanning', 'correct', 'incorrect'

  const objectsToScan = [
    { id: 'plate', name: 'Plate (Thali)', correctMaterial: 'Metal', options: ['Wood', 'Metal', 'Paper', 'Glass'], desc: 'Commonly made of stainless steel (metal), but can also be glass or ceramic.' },
    { id: 'pen', name: 'Pen', correctMaterial: 'Plastic', options: ['Wood', 'Plastic', 'Glass', 'Paper'], desc: 'Typically made of plastic body, metal tips, and solvent ink.' },
    { id: 'chair', name: 'Chair', correctMaterial: 'Wood', options: ['Wood', 'Paper', 'Glass', 'Clay'], desc: 'Classic school chairs are made of wood, though modern ones use plastics or metal.' },
    { id: 'foil', name: 'Aluminium Foil', correctMaterial: 'Metal', options: ['Paper', 'Plastics', 'Metal', 'Clay'], desc: 'Made by rolling pure aluminium metal into thin sheets.' },
    { id: 'toy', name: 'Toy Car', correctMaterial: 'Plastic', options: ['Clay', 'Plastic', 'Glass', 'Paper'], desc: 'Most kids toys are molded using lightweight and colorful plastics.' },
    { id: 'window', name: 'Window glass', correctMaterial: 'Glass', options: ['Wood', 'Glass', 'Metal', 'Paper'], desc: 'Window panes are made of glass, allowing light to pass through.' }
  ];

  const handleScanObject = (obj) => {
    setSelectedObj(obj);
    setScanState('scanning');
    
    // Simulate scan animation
    setTimeout(() => {
      setScanState('idle');
    }, 1200);
  };

  const handleSelectMaterial = (material) => {
    if (!selectedObj || scanState === 'scanning') return;

    if (material === selectedObj.correctMaterial) {
      setScanState('correct');
      const newScanned = { ...scannedObjects, [selectedObj.id]: true };
      setScannedObjects(newScanned);
      addXp(15);
    } else {
      setScanState('incorrect');
    }
  };

  const allCompleted = Object.keys(scannedObjects).length === objectsToScan.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Introduction */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={22} style={{ color: 'var(--accent)' }} /> Case File: Table 6.1 (Identify Materials)
        </h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          To understand materials, detectives first list items they observe and identify the substances they are made of. Drag items to the Scanner Pad or click them to test!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 340px', gap: '1.25rem' }}>
        {/* Left: Tray of items */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '480px' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Evidence Tray</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
            {objectsToScan.map((obj) => {
              const isScanned = scannedObjects[obj.id];
              const isSelected = selectedObj?.id === obj.id;
              return (
                <button
                  key={obj.id}
                  onClick={() => handleScanObject(obj)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                    background: isScanned ? 'var(--success-bg)' : isSelected ? 'var(--accent-bg)' : 'var(--card-bg)',
                    color: isScanned ? 'var(--success)' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>{obj.name}</span>
                  {isScanned ? (
                    <span style={{ fontSize: '0.7rem', background: 'var(--success)', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Check size={10} /> {obj.correctMaterial}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Scan Me</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle: Holographic Scanner */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '480px', 
            position: 'relative', 
            background: '#0b1329', 
            borderColor: 'var(--accent)',
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

          {selectedObj ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', zIndex: 2 }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scanning Subject</span>
                <h3 style={{ margin: '0.25rem 0 0 0', color: '#fff', fontSize: '1.5rem' }}>{selectedObj.name}</h3>
              </div>

              {/* Scanning visual circle */}
              <div 
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  border: `4px solid ${scanState === 'scanning' ? '#6366f1' : scanState === 'correct' ? '#10b981' : scanState === 'incorrect' ? '#ef4444' : '#475569'}`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  boxShadow: scanState === 'scanning' ? '0 0 20px rgba(99,102,241,0.3)' : 'none',
                  transition: 'all 0.3s'
                }}
              >
                {scanState === 'scanning' ? (
                  <span style={{ color: '#6366f1', fontWeight: 'bold', fontSize: '0.85rem' }}>Scanning...</span>
                ) : scanState === 'correct' ? (
                  <Check size={40} style={{ color: '#10b981' }} />
                ) : scanState === 'incorrect' ? (
                  <HelpCircle size={40} style={{ color: '#ef4444' }} />
                ) : (
                  <Search size={40} style={{ color: '#94a3b8' }} />
                )}
              </div>

              {/* Selection Options */}
              {scanState !== 'scanning' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '80%', alignItems: 'center' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Select Identified Material:</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%' }}>
                    {selectedObj.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSelectMaterial(option)}
                        className="outline"
                        style={{
                          padding: '0.5rem',
                          fontSize: '0.8rem',
                          background: 'rgba(255,255,255,0.05)',
                          color: '#fff',
                          borderColor: 'rgba(255,255,255,0.1)'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  {scanState === 'correct' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#34d399', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.5rem', lineHeight: '1.4' }}>
                      <strong>Success!</strong> {selectedObj.desc}
                    </motion.div>
                  )}
                  {scanState === 'incorrect' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#f87171', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.5rem' }}>
                      Try again! Think about what substance primarily forms a {selectedObj.name}.
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#94a3b8' }}>
              <Search size={48} />
              <span>Select an object from the tray to begin scanning.</span>
            </div>
          )}
        </div>

        {/* Right: History Did You Know panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '480px', background: 'var(--card-bg)' }}>
          <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', padding: '0.8rem', borderRadius: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--warning)', fontWeight: 'bold', fontSize: '0.8rem' }}>
              <Info size={14} /> Did you know?
            </span>
            <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-heading)' }}>Earliest Indian Pottery</h4>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
            Pottery found in the Indian subcontinent dates back to <strong>7,000 to 8,000 years</strong> in Ganga plains (Lahuradewa) and Baluchistan (Mehrgarh). 
            Clay, a natural material, is kneaded, wheel-turned, and baked in kilns into hard **terracotta**.
          </p>

          <button 
            onClick={() => setShowHistoryReveal(!showHistoryReveal)} 
            className="outline" 
            style={{ width: '100%', padding: '0.4rem', fontSize: '0.75rem' }}
          >
            {showHistoryReveal ? 'Hide Details' : 'Read Ancient Ayurveda Link'}
          </button>

          <AnimatePresence>
            {showHistoryReveal && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden', background: 'var(--surface)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border)' }}
              >
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                  The clay used for making pots was sieved, turned over a wheel and sieved carefully. Large storage jars from the Harappan Civilisation are exhibited at the National Museum, New Delhi.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ flex: 1 }} />

          {/* Proceed button */}
          <button
            disabled={!allCompleted}
            onClick={onComplete}
            className="primary"
            style={{ width: '100%', gap: '0.5rem', padding: '0.75rem', fontSize: '0.9rem' }}
          >
            <span>Proceed to Grouping</span>
          </button>
        </div>
      </div>
    </div>
  );
}
