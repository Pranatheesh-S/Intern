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
  const [dragOverCardId, setDragOverCardId] = useState(null);
  const [showInstructionModal, setShowInstructionModal] = useState(true);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
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
        setScannedResults(prev => {
          const updated = { ...prev, [item.id]: true };
          if (Object.keys(updated).length === ALL_ITEMS.length) {
            // Wait 1.5 seconds (1500ms) after scanning all objects before popping up the completion button
            setTimeout(() => {
              setShowCompletionPopup(true);
            }, 1500);
          }
          return updated;
        });
        setScanningItemId(null);
        setScanProgress(0);
      }
    }, 40);
  };

  const isComplete = Object.keys(scannedResults).length === ALL_ITEMS.length;

  const handleDropOnCard = (e, targetItem) => {
    e.preventDefault();
    setDragOverCardId(null);
    let itemId = null;
    try {
      if (e.dataTransfer) {
        itemId = e.dataTransfer.getData('text/plain');
      }
    } catch (err) {
      console.warn(err);
    }

    const itemToScan = ALL_ITEMS.find(i => i.id === itemId) || draggedItem;
    // Strict check: Only scan if dragged item matches the target box!
    if (itemToScan && itemToScan.id === targetItem.id) {
      if (!scannedResults[targetItem.id] && !scanningItemId) {
        startScanForItem(targetItem);
      }
    }
    setDraggedItem(null);
  };

  const renderCard = (item) => {
    const isScanning = scanningItemId === item.id;
    const isScanned = scannedResults[item.id];
    const isMag = item.isMagnetic;
    const isDragOver = dragOverCardId === item.id;

    let borderColor = isDragOver ? '#38bdf8' : '#bfdbfe';
    let bgColor = isDragOver ? 'rgba(56, 189, 248, 0.2)' : '#ffffff';
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
        onDragOver={(e) => {
          e.preventDefault();
          if (!isScanned && !scanningItemId) {
            setDragOverCardId(item.id);
          }
        }}
        onDragLeave={() => setDragOverCardId(null)}
        onDrop={(e) => handleDropOnCard(e, item)}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.4rem 0.5rem',
          backgroundColor: bgColor,
          borderRadius: '14px',
          border: isDragOver ? '2px dashed #38bdf8' : `2px solid ${borderColor}`,
          boxShadow: isScanned 
            ? `0 0 16px ${isMag ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}` 
            : isDragOver
              ? '0 0 16px rgba(56, 189, 248, 0.6)'
              : '0 2px 8px rgba(30, 64, 175, 0.08)',
          cursor: isScanned ? 'default' : 'grab',
          transition: 'all 0.25s ease',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 0,
          userSelect: 'none',
          boxSizing: 'border-box'
        }}
        title={isScanned ? undefined : `Drag ${item.name} badge and drop here to test`}
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
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* LEFT SIDE: EXPERIMENT TABLE IMAGE (FULL HEIGHT) */}
      <div style={{
        flex: '2.2',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
      backgroundColor: 'rgba(24, 24, 27, 0.95)',
      borderRadius: '18px',
      border: '1.5px solid #3F3F46',
      boxShadow: '0 0 25px rgba(0, 0, 0, 0.6)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        padding: '0.5rem 1rem',
        borderBottom: '1px solid #3F3F46',
        backgroundColor: '#18181B',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#F59E0B' }}>
            Experiment: Test which items are magnetic!
          </h3>
        </div>
      </div>

        {/* Experiment Image Container with Full Height Area Fill */}
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
                title={isScanned ? undefined : `Drag ${item.name} to its matching box on the right`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
                {isScanned && (item.isMagnetic ? ' ✓' : ' ✗')}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE: ITEM BARS (DROP TARGETS & SCAN PROGRESS) */}
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

      {/* INITIAL INSTRUCTION POP-UP MODAL */}
      {showInstructionModal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '30px',
            padding: '2.5rem 3rem',
            textAlign: 'center',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.18)',
            maxWidth: '520px',
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <h2 style={{ fontSize: '1.6rem', margin: 0, color: '#1e293b', fontWeight: 800 }}>Instructions</h2>
            <p style={{ margin: 0, color: '#475569', fontSize: '1.15rem', lineHeight: 1.5, fontWeight: 600 }}>
              Drag an object from the table image and drop it into its matching box on the right side to test!
            </p>

            <button
              onClick={() => setShowInstructionModal(false)}
              style={{
                padding: '1.1rem 3rem',
                fontSize: '1.15rem',
                fontWeight: 800,
                borderRadius: '40px',
                backgroundColor: '#0D9488',
                background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 6px 20px rgba(13, 148, 136, 0.4)',
                transition: 'all 0.25s ease',
                marginTop: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Start Experiment <ArrowRight size={22} color="#ffffff" />
            </button>
          </div>
        </div>
      )}

      {/* CENTER POP-UP OVERLAY FOR LARGE CONTINUE BUTTON AFTER ALL ITEMS ARE SCANNED */}
      {showCompletionPopup && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #CCECE7',
            borderRadius: '30px',
            padding: '2.5rem 3rem',
            textAlign: 'center',
            boxShadow: '0 15px 40px rgba(15, 118, 110, 0.18)',
            maxWidth: '520px',
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#134E4A', fontWeight: 800 }}>Table Complete! 🎉</h2>
            <p style={{ color: '#115E59', margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>
              You have successfully tested all objects on the magnetic table!
            </p>
            <button
              onClick={onComplete}
              style={{
                padding: '1.1rem 3rem',
                fontSize: '1.15rem',
                fontWeight: 800,
                borderRadius: '40px',
                background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                boxShadow: '0 6px 20px rgba(244, 63, 94, 0.45)',
                transition: 'all 0.25s ease',
                marginTop: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Continue to Quiz <ArrowRight size={24} color="#ffffff" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
