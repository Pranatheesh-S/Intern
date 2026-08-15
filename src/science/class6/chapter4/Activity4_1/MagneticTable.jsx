import React, { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const TOP_ITEMS = [
  { id: 'ruler', name: 'Ruler', icon: '📏', isMagnetic: false, hotspot: { x: 23.5, y: 77.0 } },
  { id: 'eraser', name: 'Eraser', icon: '🧹', isMagnetic: false, hotspot: { x: 33.5, y: 71.0 } },
  { id: 'clips', name: 'Paper Clips', icon: '📎', isMagnetic: true, hotspot: { x: 38.0, y: 77.0 } },
  { id: 'coins', name: 'Coins', icon: '🪙', isMagnetic: true, hotspot: { x: 44.5, y: 72.0 } },
];

const LEFT_ITEMS = [
  { id: 'pens', name: 'Pens', icon: '🖊️', isMagnetic: false, hotspot: { x: 23.0, y: 59.0 } },
  { id: 'bottle', name: 'Water Bottle', icon: '🍾', isMagnetic: false, hotspot: { x: 30.5, y: 55.0 } },
  { id: 'compass', name: 'Compass', icon: '🧭', isMagnetic: true, hotspot: { x: 46.5, y: 57.0 } },
];

const RIGHT_ITEMS = [
  { id: 'pencil_case', name: 'Pencil Case', icon: '👝', isMagnetic: false, hotspot: { x: 55.5, y: 70.0 } },
  { id: 'notebook', name: 'Notebook', icon: '📓', isMagnetic: false, hotspot: { x: 72.0, y: 68.0 } },
  { id: 'pencil', name: 'Pencil', icon: '✏️', isMagnetic: false, hotspot: { x: 67.0, y: 78.0 } },
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
          cursor: isScanned ? 'default' : 'grab',
          transition: 'all 0.25s ease',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 0,
          userSelect: 'none'
        }}
        title={isScanned ? undefined : "Drag to Scanning Area or tap to scan"}
      >
        {isScanning && (
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: `${scanProgress}%`,
            backgroundColor: 'rgba(59, 130, 246, 0.2)', transition: 'width 0.1s linear'
          }} />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.95rem' }}>{item.icon}</span>
          <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a', lineHeight: '1.1' }}>
            {item.name}
          </span>
        </div>
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
      {/* LEFT SIDE: EXPERIMENT TABLE IMAGE & SCANNING AREA */}
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
        {/* Header */}
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
              Drag an object from the image or list and drop it into the Scanning Area below.
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

        {/* Experiment Image Container with Interactive Draggable Badges */}
        <div
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
                  padding: '0.2rem 0.55rem',
                  borderRadius: '16px',
                  backgroundColor: isScanned 
                    ? (item.isMagnetic ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)')
                    : isScanning 
                      ? 'rgba(59, 130, 246, 0.95)' 
                      : 'rgba(15, 23, 42, 0.88)',
                  border: isScanned 
                    ? (item.isMagnetic ? '2px solid #10b981' : '2px solid #ef4444')
                    : '2px solid #38bdf8',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: isScanned ? 'default' : 'grab',
                  boxShadow: isScanned ? 'none' : '0 0 12px rgba(56, 189, 248, 0.65)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
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
            padding: '0.5rem 1rem',
            backgroundColor: isDragOverScanner 
              ? 'rgba(56, 189, 248, 0.25)' 
              : activeScanningItem 
                ? 'rgba(16, 185, 129, 0.18)' 
                : 'rgba(15, 23, 42, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '68px',
            boxSizing: 'border-box',
            transition: 'all 0.3s ease'
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
          ) : lastScannedItem ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: lastScannedItem.isMagnetic ? '#10b981' : '#ef4444', fontWeight: 'bold', fontSize: '0.88rem' }}>
              <span style={{ fontSize: '1.3rem' }}>{lastScannedItem.icon}</span>
              <span>{lastScannedItem.name}: {lastScannedItem.isMagnetic ? 'Magnetic ✓ (Attracted to magnet)' : 'Not Magnetic ✗ (Not attracted to magnet)'}</span>
            </div>
          ) : (
            <div style={{
              border: isDragOverScanner ? '2px dashed #38bdf8' : '2px dashed rgba(148, 163, 184, 0.45)',
              borderRadius: '12px',
              padding: '0.4rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: isDragOverScanner ? '#38bdf8' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.82rem'
            }}>
              <span style={{ fontSize: '1.15rem' }}>📥</span>
              <span>{isDragOverScanner ? 'Release object to scan!' : 'DRAG ANY OBJECT FROM IMAGE & DROP HERE TO SCAN'}</span>
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
