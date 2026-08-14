import React, { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const TOP_ITEMS = [
  { id: 'ruler', name: 'Ruler', isMagnetic: false, hotspot: { x: 23.5, y: 77.0, r: 12 } },
  { id: 'eraser', name: 'Eraser', isMagnetic: false, hotspot: { x: 33.5, y: 71.0, r: 10 } },
  { id: 'clips', name: 'Paper Clips', isMagnetic: true, hotspot: { x: 38.0, y: 77.0, r: 12 } },
  { id: 'coins', name: 'Coins', isMagnetic: true, hotspot: { x: 44.5, y: 72.0, r: 10 } },
];

const LEFT_ITEMS = [
  { id: 'pens', name: 'Pens', isMagnetic: false, hotspot: { x: 23.0, y: 59.0, r: 12 } },
  { id: 'bottle', name: 'Water Bottle', isMagnetic: false, hotspot: { x: 30.5, y: 55.0, r: 14 } },
  { id: 'compass', name: 'Compass', isMagnetic: true, hotspot: { x: 46.5, y: 57.0, r: 12 } },
];

const RIGHT_ITEMS = [
  { id: 'pencil_case', name: 'Pencil Case', isMagnetic: false, hotspot: { x: 55.5, y: 70.0, r: 14 } },
  { id: 'notebook', name: 'Notebook', isMagnetic: false, hotspot: { x: 72.0, y: 68.0, r: 16 } },
  { id: 'pencil', name: 'Pencil', isMagnetic: false, hotspot: { x: 67.0, y: 78.0, r: 12 } },
];

const ALL_ITEMS = [...TOP_ITEMS, ...LEFT_ITEMS, ...RIGHT_ITEMS];

export default function MagneticTable({ onComplete }) {
  const [scanningItemId, setScanningItemId] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedResults, setScannedResults] = useState({});
  const [lensPos, setLensPos] = useState(null);
  const imageRef = useRef(null);

  const startScanForItem = (item) => {
    if (scanningItemId || scannedResults[item.id]) return;

    setScanningItemId(item.id);
    setScanProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setScannedResults(prev => ({ ...prev, [item.id]: true }));
        setScanningItemId(null);
        setScanProgress(0);
      }
    }, 40);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    setLensPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleImageClick = (e) => {
    if (scanningItemId || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const unscanned = ALL_ITEMS.filter(item => !scannedResults[item.id]);
    if (unscanned.length === 0) return;

    let targetItem = null;
    let minDist = Infinity;

    unscanned.forEach(item => {
      const dist = Math.sqrt(Math.pow(clickX - item.hotspot.x, 2) + Math.pow(clickY - item.hotspot.y, 2));
      const allowedRadius = item.hotspot.r ? item.hotspot.r + 4 : 15;
      if (dist <= allowedRadius && dist < minDist) {
        minDist = dist;
        targetItem = item;
      }
    });

    if (targetItem) {
      startScanForItem(targetItem);
    }
  };

  const isComplete = Object.keys(scannedResults).length === ALL_ITEMS.length;

  const renderCard = (item) => {
    const isScanning = scanningItemId === item.id;
    const isScanned = scannedResults[item.id];
    const isMag = item.isMagnetic;

    let borderColor = '#cbd5e1';
    let bgColor = '#f8fafc';
    let statusText = '';
    let statusColor = '#2563eb';

    if (isScanning) {
      borderColor = '#3b82f6';
      bgColor = 'rgba(59, 130, 246, 0.12)';
      statusText = `Scanning... ${scanProgress}%`;
      statusColor = '#2563eb';
    } else if (isScanned) {
      if (isMag) {
        borderColor = '#10b981';
        bgColor = 'rgba(16, 185, 129, 0.12)';
        statusText = 'Magnetic ✓';
        statusColor = '#059669';
      } else {
        borderColor = '#ef4444';
        bgColor = 'rgba(239, 68, 68, 0.12)';
        statusText = 'Not Magnetic ✗';
        statusColor = '#dc2626';
      }
    }

    return (
      <div
        key={item.id}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.35rem 0.25rem',
          backgroundColor: bgColor,
          borderRadius: '12px',
          border: `2px solid ${borderColor}`,
          boxShadow: isScanned 
            ? `0 0 14px ${isMag ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}` 
            : '0 2px 8px rgba(0, 0, 0, 0.05)',
          cursor: 'default',
          transition: 'all 0.25s ease',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 0,
          userSelect: 'none'
        }}
      >
        {isScanning && (
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: `${scanProgress}%`,
            backgroundColor: 'rgba(59, 130, 246, 0.2)', transition: 'width 0.1s linear'
          }} />
        )}

        <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a', zIndex: 1, lineHeight: '1.1' }}>
          {item.name}
        </span>
        {statusText !== '' && (
          <span style={{ fontSize: '0.72rem', color: statusColor, marginTop: '0.15rem', fontWeight: isScanned ? 600 : 500, zIndex: 1 }}>
            {statusText}
          </span>
        )}
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%',
      minHeight: 0,
      gap: '0.75rem',
      boxSizing: 'border-box'
    }}>
      {/* LEFT SIDE: EXPERIMENT IMAGE (Expanded width on sides) */}
      <div style={{
        flex: '1.85',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(10, 15, 36, 0.85)',
        borderRadius: '18px',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        boxShadow: '0 0 25px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          padding: '0.5rem 1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
              Experiment: Test which items are magnetic!
            </h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
              Scan each object to find out if it is magnetic.
            </p>
          </div>
          {isComplete && (
            <button
              onClick={onComplete}
              style={{
                padding: '0.4rem 1rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                borderRadius: '20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)'
              }}
            >
              Continue <ArrowRight size={14} />
            </button>
          )}
        </div>

        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setLensPos(null)}
          onClick={handleImageClick}
          style={{
            flex: 1,
            minHeight: 0,
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'stretch',
            overflow: 'hidden',
            backgroundColor: '#070b19',
            cursor: scanningItemId ? 'default' : 'crosshair'
          }}
        >
          <img
            ref={imageRef}
            src="/Activity4_1/activity_4.1.png"
            alt="Activity items table"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              display: 'block'
            }}
          />

          {/* Lens Scanner on Hover & Active Scan */}
          {lensPos && (
            <div style={{
              position: 'absolute',
              left: lensPos.x - 36,
              top: lensPos.y - 36,
              width: 72,
              height: 72,
              borderRadius: '50%',
              border: scanningItemId ? '3px solid #10b981' : '3px solid #60a5fa',
              boxShadow: scanningItemId 
                ? '0 0 25px rgba(16, 185, 129, 0.8), 0 0 0 2px rgba(16, 185, 129, 0.4)' 
                : '0 0 20px rgba(96, 165, 250, 0.7), 0 0 0 2px rgba(99, 102, 241, 0.3)',
              background: scanningItemId ? 'rgba(16, 185, 129, 0.25)' : 'rgba(99, 102, 241, 0.18)',
              backdropFilter: 'brightness(1.25)',
              pointerEvents: 'none',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border 0.2s ease, background 0.2s ease, box-shadow 0.2s ease'
            }}>
              {scanningItemId && (
                <span style={{ fontWeight: 'bold', color: 'white', textShadow: '0 1px 4px rgba(0,0,0,0.9)', fontSize: '1.1rem' }}>
                  {scanProgress}%
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: COMPACT ITEM BARS IN 2 COLUMNS */}
      <div style={{
        flex: '0.85',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.5rem',
        height: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Column 1 (5 items: Ruler, Eraser, Clips, Coins, Pens) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%' }}>
          {ALL_ITEMS.slice(0, 5).map(renderCard)}
        </div>

        {/* Column 2 (5 items: Bottle, Compass, Case, Notebook, Pencil) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%' }}>
          {ALL_ITEMS.slice(5, 10).map(renderCard)}
        </div>
      </div>
    </div>
  );
}
