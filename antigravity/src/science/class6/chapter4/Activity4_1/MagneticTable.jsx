import React, { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const TOP_ITEMS = [
  { id: 'ruler', name: 'Ruler', subText: '(Plastic - 90)', isMagnetic: false, hotspot: { x: 23.5, y: 77.0, r: 12 } },
  { id: 'eraser', name: 'Eraser', subText: '(Rubber - 90)', isMagnetic: false, hotspot: { x: 33.5, y: 71.0, r: 10 } },
  { id: 'clips', name: 'Paper Clips', subText: '(Metal - 90)', isMagnetic: true, hotspot: { x: 38.0, y: 77.0, r: 12 } },
  { id: 'coins', name: 'Coins', subText: '(Metal - 90)', isMagnetic: true, hotspot: { x: 44.5, y: 72.0, r: 10 } },
];

const LEFT_ITEMS = [
  { id: 'pens', name: 'Pens', subText: '(Plastic - 90)', isMagnetic: false, hotspot: { x: 23.0, y: 59.0, r: 12 } },
  { id: 'bottle', name: 'Water Bottle', subText: '(Stainless Steel - 90)', isMagnetic: false, hotspot: { x: 30.5, y: 55.0, r: 14 } },
  { id: 'compass', name: 'Compass', subText: '(Metal - 90)', isMagnetic: true, hotspot: { x: 46.5, y: 57.0, r: 12 } },
];

const RIGHT_ITEMS = [
  { id: 'pencil_case', name: 'Pencil Case', subText: '(Fabric - 90)', isMagnetic: false, hotspot: { x: 55.5, y: 70.0, r: 14 } },
  { id: 'notebook', name: 'Notebook', subText: '(Paper - 90)', isMagnetic: false, hotspot: { x: 72.0, y: 68.0, r: 16 } },
  { id: 'pencil', name: 'Pencil', subText: '(Wood - 90)', isMagnetic: false, hotspot: { x: 67.0, y: 78.0, r: 12 } },
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

    const clickedItem = ALL_ITEMS.find(item => {
      if (scannedResults[item.id]) return false;
      const dist = Math.sqrt(Math.pow(clickX - item.hotspot.x, 2) + Math.pow(clickY - item.hotspot.y, 2));
      return dist <= item.hotspot.r;
    });

    if (clickedItem) {
      startScanForItem(clickedItem);
    }
  };

  const isComplete = Object.keys(scannedResults).length === ALL_ITEMS.length;

  const renderCard = (item) => {
    const isScanning = scanningItemId === item.id;
    const isScanned = scannedResults[item.id];
    const isMag = item.isMagnetic;

    let borderColor = 'rgba(255, 255, 255, 0.1)';
    let bgColor = 'rgba(15, 23, 42, 0.6)';
    let statusText = '(not scanned yet)';
    let statusColor = '#94a3b8';

    if (isScanning) {
      borderColor = '#3b82f6';
      bgColor = 'rgba(59, 130, 246, 0.15)';
      statusText = `Scanning... ${scanProgress}%`;
      statusColor = '#60a5fa';
    } else if (isScanned) {
      if (isMag) {
        borderColor = 'rgba(16, 185, 129, 0.6)';
        bgColor = 'rgba(16, 185, 129, 0.12)';
        statusText = 'Magnetic ✓';
        statusColor = '#34d399';
      } else {
        borderColor = 'rgba(239, 68, 68, 0.6)';
        bgColor = 'rgba(239, 68, 68, 0.12)';
        statusText = 'Not Magnetic ✗';
        statusColor = '#f87171';
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
          padding: '0.6rem 0.5rem',
          backgroundColor: bgColor,
          borderRadius: '14px',
          border: `1px solid ${borderColor}`,
          boxShadow: isScanned ? `0 0 12px ${isMag ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` : '0 4px 12px rgba(0,0,0,0.2)',
          cursor: 'default',
          transition: 'all 0.25s ease',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '65px',
          userSelect: 'none'
        }}
      >
        {isScanning && (
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: `${scanProgress}%`,
            backgroundColor: 'rgba(59, 130, 246, 0.3)', transition: 'width 0.1s linear'
          }} />
        )}

        <span style={{ fontWeight: 600, fontSize: '0.92rem', color: '#ffffff', zIndex: 1, lineHeight: '1.2' }}>
          {item.name}
        </span>
        <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.15rem', zIndex: 1 }}>
          {item.subText}
        </span>
        <span style={{ fontSize: '0.72rem', color: statusColor, marginTop: '0.15rem', fontWeight: isScanned ? 600 : 400, zIndex: 1 }}>
          {statusText}
        </span>
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      minHeight: 0,
      gap: '0.75rem',
      boxSizing: 'border-box'
    }}>
      {/* Top Row: 4 Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.75rem',
        flexShrink: 0,
        width: '100%'
      }}>
        {TOP_ITEMS.map(renderCard)}
      </div>

      {/* Middle Grid: Left Col (3 Cards) | Center Image | Right Col (3 Cards) */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        flex: 1,
        minHeight: 0,
        alignItems: 'stretch',
        width: '100%'
      }}>
        {/* Left Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '190px',
          flexShrink: 0
        }}>
          {LEFT_ITEMS.map(renderCard)}
        </div>

        {/* Center Container (Image Box) */}
        <div style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(10, 15, 36, 0.7)',
          borderRadius: '18px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 0 25px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Header text inside center box */}
          <div style={{
            padding: '0.6rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                Experiment: Test which items are magnetic!
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                Hover over the image and click directly on the items to scan them.
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

          {/* Image & Hotspots Container */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setLensPos(null)}
            onClick={handleImageClick}
            style={{
              flex: 1,
              minHeight: 0,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
                objectFit: 'contain',
                display: 'block'
              }}
            />

            {/* Scanned Badge Badges on Image */}
            {ALL_ITEMS.map(item => {
              const isScanned = scannedResults[item.id];
              if (!isScanned) return null;
              return (
                <div
                  key={`badge-${item.id}`}
                  style={{
                    position: 'absolute',
                    left: `${item.hotspot.x}%`,
                    top: `${item.hotspot.y}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: item.isMagnetic ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    pointerEvents: 'none',
                    zIndex: 5,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.name}: {item.isMagnetic ? 'Magnetic' : 'Not Magnetic'}
                </div>
              );
            })}

            {/* Lens Scanner */}
            {lensPos && (
              <div style={{
                position: 'absolute',
                left: lensPos.x - 36,
                top: lensPos.y - 36,
                width: 72,
                height: 72,
                borderRadius: '50%',
                border: scanningItemId ? '3px solid #10b981' : '3px solid #60a5fa',
                boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 20px rgba(99,102,241,0.2)',
                background: scanningItemId ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                backdropFilter: 'brightness(1.2)',
                pointerEvents: 'none',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {scanningItemId && (
                  <span style={{ fontWeight: 'bold', color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.8)', fontSize: '1.1rem' }}>
                    {scanProgress}%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '190px',
          flexShrink: 0
        }}>
          {RIGHT_ITEMS.map(renderCard)}
        </div>
      </div>
    </div>
  );
}


