import React, { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const TOP_ITEMS = [
  { id: 'ruler', name: 'Ruler', icon: '📏', isMagnetic: false, hotspot: { x: 12.0, y: 88.0 } },
  { id: 'eraser', name: 'Eraser', icon: '🧹', isMagnetic: false, hotspot: { x: 24.0, y: 74.0 } },
  { id: 'clips', name: 'Paper Clips', icon: '📎', isMagnetic: true, hotspot: { x: 31.0, y: 83.0 } },
  { id: 'coins', name: 'Coins', icon: '🪙', isMagnetic: true, hotspot: { x: 42.0, y: 75.0 } },
];

const LEFT_ITEMS = [
  { id: 'pens', name: 'Pens', icon: '🖊️', isMagnetic: false, hotspot: { x: 11.0, y: 60.0 } },
  { id: 'bottle', name: 'Water Bottle', icon: '🍾', isMagnetic: false, hotspot: { x: 23.0, y: 50.0 } },
  { id: 'compass', name: 'Compass', icon: '🧭', isMagnetic: true, hotspot: { x: 44.0, y: 51.0 } },
];

const RIGHT_ITEMS = [
  { id: 'pencil_case', name: 'Pencil Case', icon: '👝', isMagnetic: false, hotspot: { x: 59.0, y: 77.0 } },
  { id: 'notebook', name: 'Notebook', icon: '📓', isMagnetic: false, hotspot: { x: 85.0, y: 69.0 } },
  { id: 'pencil', name: 'Pencil', icon: '✏️', isMagnetic: false, hotspot: { x: 80.0, y: 91.0 } },
];

const ALL_ITEMS = [...TOP_ITEMS, ...LEFT_ITEMS, ...RIGHT_ITEMS];

export default function MagneticTable({ onComplete }) {
  const [scanningItemId, setScanningItemId] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedResults, setScannedResults] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDragOverScanner, setIsDragOverScanner] = useState(false);
  const [lastScannedItem, setLastScannedItem] = useState(null);
  const imageRef = useRef(null);

  const startScanForItem = (item) => {
    if (scanningItemId || scannedResults[item.id]) return;

    setScanningItemId(item.id);
    setScanProgress(0);
    setLastScannedItem(null);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setScannedResults(prev => ({ ...prev, [item.id]: true }));
        setScanningItemId(null);
        setScanProgress(0);
        setLastScannedItem(item);
      }
    }, 40);
  };

  const isComplete = Object.keys(scannedResults).length === ALL_ITEMS.length;
  const activeScanningItem = ALL_ITEMS.find(i => i.id === scanningItemId);

  const handleDropOnScanner = (e) => {
    e.preventDefault();
    setIsDragOverScanner(false);
    let itemId = null;
    try {
      if (e.dataTransfer) {
        itemId = e.dataTransfer.getData('text/plain');
      }
    } catch (err) {
      console.warn(err);
    }
    if (!itemId && draggedItem) {
      itemId = draggedItem.id;
    }
    const targetItem = ALL_ITEMS.find(i => i.id === itemId);
    if (targetItem && !scannedResults[targetItem.id] && !scanningItemId) {
      startScanForItem(targetItem);
    }
    setDraggedItem(null);
  };

  const renderCard = (item) => {
    const isScanning = scanningItemId === item.id;
    const isScanned = scannedResults[item.id];
    const isMag = item.isMagnetic;

    let borderColor = '#bfdbfe';
    let bgColor = '#ffffff';
    let nameColor = '#1e40af';
    let statusText = '';
    let statusBg = 'transparent';
    let statusColor = '#2563eb';

    if (isScanning) {
      borderColor = '#38bdf8';
      bgColor = 'rgba(56, 189, 248, 0.15)';
      nameColor = '#1e40af';
      statusText = `Scanning... ${scanProgress}%`;
      statusColor = '#0284c7';
      statusBg = '#e0f2fe';
    } else if (isScanned) {
      nameColor = '#ffffff';
      if (isMag) {
        borderColor = '#10b981';
        bgColor = 'rgba(16, 185, 129, 0.25)';
        statusText = 'Magnetic ✓';
        statusColor = '#ffffff';
        statusBg = '#10b981';
      } else {
        borderColor = '#ef4444';
        bgColor = 'rgba(239, 68, 68, 0.25)';
        statusText = 'Not Magnetic ✗';
        statusColor = '#ffffff';
        statusBg = '#ef4444';
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
          padding: '0.4rem 0.5rem',
          backgroundColor: bgColor,
          borderRadius: '14px',
          border: `2px solid ${borderColor}`,
          boxShadow: isScanned 
            ? `0 0 16px ${isMag ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}` 
            : '0 2px 8px rgba(30, 64, 175, 0.08)',
          cursor: 'default',
          transition: 'all 0.25s ease',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 0,
          userSelect: 'none',
          boxSizing: 'border-box'
        }}
      >
        {isScanning && (
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: `${scanProgress}%`,
            backgroundColor: 'rgba(56, 189, 248, 0.3)', transition: 'width 0.1s linear'
          }} />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
          <span style={{ fontWeight: 700, fontSize: '0.92rem', color: nameColor, lineHeight: '1.1' }}>
            {item.name}
          </span>
        </div>

        {statusText !== '' && (
          <span style={{ 
            fontSize: '0.72rem', 
            color: statusColor, 
            backgroundColor: statusBg,
            padding: '0.15rem 0.6rem',
            borderRadius: '10px',
            marginTop: '0.3rem', 
            fontWeight: 700, 
            zIndex: 1,
            boxShadow: isScanned ? '0 2px 6px rgba(0,0,0,0.3)' : 'none'
          }}>
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
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* LEFT SIDE: LARGER REALISTIC EXPERIMENT TABLE IMAGE & SCANNING AREA */}
      <div style={{
        flex: '2.2',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(10, 15, 36, 0.95)',
        borderRadius: '18px',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        boxShadow: '0 0 25px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '0.4rem 1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 600, color: '#f8fafc' }}>
              Experiment: Test which items are magnetic!
            </h3>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
              Drag an object badge from the image and drop it into the Scanning Area below.
            </p>
          </div>
          {isComplete && (
            <button
              onClick={onComplete}
              style={{
                padding: '0.35rem 0.9rem',
                fontSize: '0.8rem',
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

        {/* Experiment Image Container with Full Area Fill */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: '#070b19'
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

          {/* Interactive Draggable Object Badges over Image (Disappears once scanned) */}
          {ALL_ITEMS.map((item) => {
            const isScanned = scannedResults[item.id];
            const isScanning = scanningItemId === item.id;

            if (isScanned) return null;

            return (
              <div
                key={item.id}
                draggable={!isScanned && !scanningItemId}
                onDragStart={(e) => {
                  if (e.dataTransfer) {
                    e.dataTransfer.setData('text/plain', item.id);
                  }
                  setDraggedItem(item);
                }}
                onClick={() => {
                  if (!isScanned && !scanningItemId) {
                    startScanForItem(item);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: `${item.hotspot.x}%`,
                  top: `${item.hotspot.y}%`,
                  transform: 'translate(-50%, -50%)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '16px',
                  backgroundColor: isScanned 
                    ? (item.isMagnetic ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)')
                    : isScanning 
                      ? 'rgba(59, 130, 246, 0.95)' 
                      : 'rgba(15, 23, 42, 0.92)',
                  border: isScanned 
                    ? (item.isMagnetic ? '2px solid #10b981' : '2px solid #ef4444')
                    : '2px solid #38bdf8',
                  color: 'white',
                  fontSize: '0.78rem',
                  fontWeight: 'bold',
                  cursor: isScanned ? 'default' : 'grab',
                  boxShadow: isScanned ? 'none' : '0 0 14px rgba(56, 189, 248, 0.75)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  zIndex: 20,
                  userSelect: 'none',
                  transition: 'all 0.25s ease'
                }}
                title={isScanned ? undefined : "Drag to Scanning Area below or tap to scan"}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
                {isScanned && (item.isMagnetic ? ' ✓' : ' ✗')}
              </div>
            );
          })}
        </div>

        {/* SCANNING AREA DROP ZONE BOX */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOverScanner(true);
          }}
          onDragLeave={() => setIsDragOverScanner(false)}
          onDrop={handleDropOnScanner}
          style={{
            padding: '0.4rem 1rem',
            backgroundColor: isDragOverScanner 
              ? 'rgba(56, 189, 248, 0.25)' 
              : activeScanningItem 
                ? 'rgba(16, 185, 129, 0.18)' 
                : 'rgba(15, 23, 42, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60px',
            height: '60px',
            boxSizing: 'border-box',
            transition: 'all 0.3s ease',
            flexShrink: 0
          }}
        >
          {activeScanningItem ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', width: '100%', maxWidth: '420px', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.4rem' }}>{activeScanningItem.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.82rem', color: '#f8fafc', fontWeight: 'bold' }}>
                  <span>Scanning {activeScanningItem.name}...</span>
                  <span>{scanProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${scanProgress}%`, height: '100%', backgroundColor: '#38bdf8', borderRadius: '4px', transition: 'width 0.05s linear', boxShadow: '0 0 10px #38bdf8' }} />
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              border: isDragOverScanner ? '2px dashed #38bdf8' : '2px dashed rgba(148, 163, 184, 0.45)',
              borderRadius: '12px',
              padding: '0.35rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: isDragOverScanner ? '#38bdf8' : '#38bdf8',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.04em'
            }}>
              <span style={{ fontSize: '1.15rem' }}>🔍</span>
              <span>{isDragOverScanner ? 'RELEASE OBJECT TO SCAN!' : 'SCAN AREA — DROP ANY OBJECT HERE TO TEST'}</span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: REDUCED COMPACT ITEM BARS WITH WHITE BG AND BLUE TEXT */}
      <div style={{
        flex: '0.85',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.5rem',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        {/* Column 1 (5 items: Ruler, Eraser, Clips, Coins, Pens) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%', flex: 1 }}>
          {ALL_ITEMS.slice(0, 5).map(renderCard)}
        </div>

        {/* Column 2 (5 items: Bottle, Compass, Case, Notebook, Pencil) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%', flex: 1 }}>
          {ALL_ITEMS.slice(5, 10).map(renderCard)}
        </div>
      </div>
    </div>
  );
}
