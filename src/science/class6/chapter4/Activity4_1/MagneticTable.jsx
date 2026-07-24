import React, { useState, useRef } from 'react';
import { ArrowRight, Scan, Magnet, XCircle } from 'lucide-react';

const ITEMS = [
  { id: 'pens', name: 'Pens (Plastic)', isMagnetic: false, hotspot: { x: 12.2, y: 67.6, r: 8 } },
  { id: 'bottle', name: 'Water Bottle (Stainless Steel)', isMagnetic: false, hotspot: { x: 26.6, y: 49.2, r: 8 } },
  { id: 'compass', name: 'Compass (Metal)', isMagnetic: true, hotspot: { x: 45.2, y: 50.9, r: 10 } }, 
  { id: 'ruler', name: 'Ruler (Plastic)', isMagnetic: false, hotspot: { x: 10.7, y: 88.2, r: 8 } },
  { id: 'eraser', name: 'Eraser (Rubber)', isMagnetic: false, hotspot: { x: 24.5, y: 74.7, r: 6 } },
  { id: 'clips', name: 'Paper Clips (Metal)', isMagnetic: true, hotspot: { x: 30.8, y: 83.4, r: 6 } },
  { id: 'coins', name: 'Coins (Metal)', isMagnetic: false, hotspot: { x: 42.1, y: 75.4, r: 6 } },
  { id: 'pencil_case', name: 'Pencil Case (Fabric)', isMagnetic: false, hotspot: { x: 59.4, y: 76.1, r: 10 } },
  { id: 'notebook', name: 'Notebook (Paper)', isMagnetic: false, hotspot: { x: 88.8, y: 71.7, r: 12 } },
  { id: 'pencil', name: 'Pencil (Wood)', isMagnetic: false, hotspot: { x: 81.8, y: 91.4, r: 8 } }
];

export default function MagneticTable({ onComplete }) {
  const [scanningItemId, setScanningItemId] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedResults, setScannedResults] = useState({});
  const [lensPos, setLensPos] = useState(null);
  const [lastClickedPos, setLastClickedPos] = useState(null);
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    setLensPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleImageClick = (e) => {
    if (scanningItemId) return;
    
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // For calibration:
    setLastClickedPos({ x: clickX.toFixed(1), y: clickY.toFixed(1) });

    const clickedItem = ITEMS.find(item => {
      if (item.hotspot.x === null || item.hotspot.y === null) return false;
      if (scannedResults[item.id]) return false; // Skip already scanned items
      const dist = Math.sqrt(Math.pow(clickX - item.hotspot.x, 2) + Math.pow(clickY - item.hotspot.y, 2));
      return dist <= item.hotspot.r;
    });

    if (!clickedItem) return;

    setScanningItemId(clickedItem.id);
    setScanProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setScannedResults(prev => ({ ...prev, [clickedItem.id]: true }));
        setScanningItemId(null);
        setScanProgress(0);
      }
    }, 40);
  };

  const isComplete = Object.keys(scannedResults).length === ITEMS.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <div style={{ 
        backgroundColor: 'var(--surface)', 
        borderRadius: '12px', 
        border: '1px solid var(--border)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        color: 'var(--text-primary)',
        width: '100%',
        margin: '0 auto',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {/* Header */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--text-heading)', fontSize: '1.25rem' }}>Experiment: Test which items are magnetic!</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Hover over the image and click to scan items.</p>
        </div>

        {/* Activity Image with Scanner */}
        <div 
          ref={imageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setLensPos(null)}
          onClick={handleImageClick}
          style={{ position: 'relative', overflow: 'hidden', cursor: scanningItemId ? 'default' : 'crosshair', borderBottom: '1px solid var(--border)' }}
        >
          <img src="/activity_4.1.png" alt="Activity items" style={{ width: '100%', height: 'auto', display: 'block' }} />
          
          {lensPos && (
            <div style={{
              position: 'absolute',
              left: lensPos.x - 40,
              top: lensPos.y - 40,
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: scanningItemId ? '3px solid #10b981' : '3px solid var(--accent)',
              boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 20px rgba(99,102,241,0.2)',
              background: scanningItemId ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.1)',
              backdropFilter: 'brightness(1.2)',
              pointerEvents: 'none',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border-color 0.2s, background-color 0.2s'
            }}>
               {scanningItemId && <span style={{ fontWeight: 'bold', color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.8)', fontSize: '1.2rem' }}>{scanProgress}%</span>}
            </div>
          )}
        </div>

        {/* Item List Log */}
        <div style={{ padding: '2rem', paddingTop: '1.5rem', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {ITEMS.map(item => {
              const isScanning = scanningItemId === item.id;
              const isScanned = scannedResults[item.id];
              const isMag = item.isMagnetic;

              return (
                <div 
                  key={item.id}
                  style={{ 
                    position: 'relative',
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem 1rem', 
                    backgroundColor: isScanned ? (isMag ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'var(--surface-hover)', 
                    borderRadius: '8px', 
                    border: isScanned ? (isMag ? '1px solid #10b981' : '1px solid #ef4444') : '1px solid var(--border)',
                    opacity: (!isScanned && !isScanning) ? 0.6 : 1,
                    transition: 'all 0.2s',
                    overflow: 'hidden'
                  }}
                >
                  {isScanning && (
                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, bottom: 0, width: `${scanProgress}%`,
                      backgroundColor: 'rgba(16, 185, 129, 0.2)', transition: 'width 0.1s linear'
                    }} />
                  )}

                  <span style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)', zIndex: 1, marginBottom: isScanned ? '0.5rem' : 0 }}>
                    {item.name}
                  </span>

                  {isScanned && (
                    <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.25rem', color: isMag ? '#10b981' : '#ef4444', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {isMag ? <Magnet size={16} /> : <XCircle size={16} />}
                      {isMag ? 'Magnetic' : 'Not Magnetic'}
                    </div>
                  )}

                  {!isScanned && !isScanning && (
                    <div style={{ zIndex: 1, color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      Not scanned yet
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Continue Action */}
        <div style={{
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'var(--surface-hover)',
        }}>
          <button
            onClick={onComplete}
            disabled={!isComplete}
            className="primary"
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              cursor: isComplete ? 'pointer' : 'not-allowed',
              background: isComplete ? 'var(--accent)' : 'var(--border)',
              color: isComplete ? 'white' : 'var(--text-muted)'
            }}
          >
            {isComplete ? 'Continue' : 'Scan all items'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
