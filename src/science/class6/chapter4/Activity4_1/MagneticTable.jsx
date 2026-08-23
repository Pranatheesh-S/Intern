import React, { useState, useRef } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, XCircle, Activity, Radio, Search } from 'lucide-react';

const ALL_ITEMS = [
  { id: 'ruler', name: 'Ruler', icon: '📏', material: 'Plastic / Wood', isMagnetic: false, hotspot: { x: 12.0, y: 88.0 }, desc: 'Dielectric polymer' },
  { id: 'eraser', name: 'Eraser', icon: '🧹', material: 'Rubber', isMagnetic: false, hotspot: { x: 24.0, y: 74.0 }, desc: 'Non-ferrous elastomer' },
  { id: 'clips', name: 'Paper Clips', icon: '📎', material: 'Steel (Iron)', isMagnetic: true, hotspot: { x: 31.0, y: 83.0 }, desc: 'Ferromagnetic alloy' },
  { id: 'coins', name: 'Coins', icon: '🪙', material: 'Nickel Alloy', isMagnetic: true, hotspot: { x: 42.0, y: 75.0 }, desc: 'Ferromagnetic core' },
  { id: 'pens', name: 'Pens', icon: '🖊️', material: 'Plastic', isMagnetic: false, hotspot: { x: 11.0, y: 60.0 }, desc: 'Synthetic polymer' },
  { id: 'bottle', name: 'Water Bottle', icon: '🍾', material: 'Glass', isMagnetic: false, hotspot: { x: 23.0, y: 50.0 }, desc: 'Non-magnetic silica' },
  { id: 'compass', name: 'Compass', icon: '🧭', material: 'Magnetic Needle', isMagnetic: true, hotspot: { x: 44.0, y: 51.0 }, desc: 'Permanent magnet' },
  { id: 'pencil_case', name: 'Pencil Case', icon: '👝', material: 'Fabric Cloth', isMagnetic: false, hotspot: { x: 59.0, y: 77.0 }, desc: 'Organic textile' },
  { id: 'notebook', name: 'Notebook', icon: '📓', material: 'Paper', isMagnetic: false, hotspot: { x: 85.0, y: 69.0 }, desc: 'Cellulose fiber' },
  { id: 'pencil', name: 'Pencil', icon: '✏️', material: 'Wood & Graphite', isMagnetic: false, hotspot: { x: 80.0, y: 91.0 }, desc: 'Carbon & cellulose' },
];

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
      progress += 4;
      setScanProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setScannedResults(prev => {
          const updated = { ...prev, [item.id]: true };
          if (Object.keys(updated).length === ALL_ITEMS.length) {
            setTimeout(() => {
              setShowCompletionPopup(true);
            }, 1200);
          }
          return updated;
        });
        setScanningItemId(null);
        setScanProgress(0);
      }
    }, 32);
  };

  const isComplete = Object.keys(scannedResults).length === ALL_ITEMS.length;
  const scannedCount = Object.keys(scannedResults).length;
  const magneticCount = Object.keys(scannedResults).filter(id => ALL_ITEMS.find(i => i.id === id)?.isMagnetic).length;
  const nonMagneticCount = scannedCount - magneticCount;

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
    // Strictly scan only when the correct dragged item is dropped on its respective card
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

    let cardBg = 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)';
    let cardBorder = '1.5px solid #E2E8F0';
    let cardShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
    let nameColor = '#0F172A';
    let subColor = '#64748B';

    if (isDragOver) {
      cardBg = 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)';
      cardBorder = '2px dashed #0284C7';
      cardShadow = '0 0 16px rgba(2, 132, 199, 0.35)';
    } else if (isScanning) {
      cardBg = 'linear-gradient(135deg, #F0FDF4 0%, #E0F2FE 100%)';
      cardBorder = '2px solid #0284C7';
      cardShadow = '0 0 16px rgba(2, 132, 199, 0.3)';
    } else if (isScanned) {
      if (isMag) {
        cardBg = 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)';
        cardBorder = '1.5px solid #16A34A';
        cardShadow = '0 2px 12px rgba(22, 163, 74, 0.2)';
        nameColor = '#064E3B';
        subColor = '#047857';
      } else {
        cardBg = 'linear-gradient(135deg, #FFF1F2 0%, #FEE2E2 100%)';
        cardBorder = '1.5px solid #EF4444';
        cardShadow = '0 2px 12px rgba(239, 68, 68, 0.2)';
        nameColor = '#7F1D1D';
        subColor = '#991B1B';
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
          justifyContent: 'space-between',
          padding: '0.45rem 0.6rem',
          background: cardBg,
          borderRadius: '12px',
          border: cardBorder,
          boxShadow: cardShadow,
          cursor: isScanned ? 'default' : 'default',
          transition: 'all 0.22s ease',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 0,
          userSelect: 'none',
          boxSizing: 'border-box',
        }}
        title={isScanned ? `${item.name}: ${item.desc}` : `Drag and drop ${item.name} badge here to scan!`}
      >
        {/* Holographic Laser Scanner Beam FX */}
        {isScanning && (
          <>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: `${scanProgress}%`,
                background: 'linear-gradient(90deg, rgba(2, 132, 199, 0.1) 0%, rgba(2, 132, 199, 0.35) 100%)',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${scanProgress}%`,
                width: '3px',
                background: '#0284C7',
                boxShadow: '0 0 10px #0284C7, 0 0 18px #38BDF8',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />
          </>
        )}

        {/* Top Row: Icon, Name & Material Tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
            <span style={{ fontSize: '1.15rem', flexShrink: 0 }}>{item.icon}</span>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontWeight: 800, fontSize: '0.82rem', color: nameColor, lineHeight: '1.1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
              </span>
              <span style={{ fontSize: '0.64rem', color: subColor, fontWeight: 600 }}>
                {item.material}
              </span>
            </div>
          </div>

          {/* Right Status Indicator */}
          {isScanned ? (
            <div
              style={{
                padding: '2px 7px',
                borderRadius: '8px',
                fontSize: '0.66rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                background: isMag ? '#16A34A' : '#DC2626',
                color: '#FFFFFF',
                boxShadow: isMag ? '0 2px 6px rgba(22, 163, 74, 0.35)' : '0 2px 6px rgba(220, 38, 38, 0.35)',
                flexShrink: 0,
              }}
            >
              {isMag ? <CheckCircle2 size={11} color="#FFFFFF" /> : <XCircle size={11} color="#FFFFFF" />}
              {isMag ? 'Magnetic' : 'Non-Mag'}
            </div>
          ) : isScanning ? (
            <div
              style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                color: '#0284C7',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <Activity size={12} className="animate-spin" />
              <span>{scanProgress}%</span>
            </div>
          ) : (
            <div
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                color: '#64748B',
                background: '#F1F5F9',
                padding: '2px 6px',
                borderRadius: '6px',
                border: '1px dashed #CBD5E1',
              }}
            >
              Drop here
            </div>
          )}
        </div>

        {/* Live Magnetic Frequency Spectrogram / Status Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3, marginTop: '0.15rem' }}>
          {isScanning ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
              <span style={{ fontSize: '0.62rem', color: '#0284C7', fontWeight: 800 }}>ANALYZING:</span>
              <div style={{ display: 'flex', gap: '2px', flex: 1, alignItems: 'flex-end', height: '8px' }}>
                {[60, 90, 45, 100, 70, 85, 40].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${(h * (scanProgress % 50)) / 45}%`,
                      maxHeight: '100%',
                      background: '#0284C7',
                      borderRadius: '1px',
                    }}
                  />
                ))}
              </div>
            </div>
          ) : isScanned ? (
            <span style={{ fontSize: '0.64rem', color: isMag ? '#047857' : '#B91C1C', fontWeight: 700, lineHeight: 1 }}>
              {isMag ? '🧲 Attracted to Magnet' : '🛡️ No Attraction (Inert)'}
            </span>
          ) : (
            <span style={{ fontSize: '0.62rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Search size={9} /> Drag & drop from table
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        minHeight: 0,
        gap: '0.75rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* LEFT SIDE: EXPERIMENT TABLE IMAGE (FULL HEIGHT) */}
      <div
        style={{
          flex: '2.1',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1.5px solid #A7F3D0',
          boxShadow: '0 4px 20px rgba(6, 78, 59, 0.06)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '0.5rem 1rem',
            borderBottom: '1.5px solid #A7F3D0',
            backgroundColor: '#F0FDF4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1rem' }}>🔬</span>
            <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#064E3B' }}>
              Experiment Table: Drag & Drop Items to the Scanner
            </h3>
          </div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#064E3B' }}>
            Tested: <strong style={{ color: '#D97706' }}>{scannedCount}</strong> / 10
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
            backgroundColor: '#070b19',
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
              display: 'block',
            }}
          />

          {/* Interactive Draggable Object Badges over Image (Disappears once scanned, NO "TEST" word) */}
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
                  padding: '0.28rem 0.75rem',
                  borderRadius: '16px',
                  backgroundColor: isScanning
                    ? 'rgba(2, 132, 199, 0.95)'
                    : 'rgba(15, 23, 42, 0.92)',
                  border: isScanning
                    ? '2px solid #38BDF8'
                    : '1.5px solid rgba(255, 255, 255, 0.85)',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'grab',
                  boxShadow: '0 0 16px rgba(56, 189, 248, 0.65), 0 4px 12px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  zIndex: 20,
                  userSelect: 'none',
                  transition: 'all 0.22s ease',
                  backdropFilter: 'blur(6px)',
                }}
                title={`Drag ${item.name} to its scanner slot on the right`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE: LIGHT THEMED LINEAR GRADIENT SCANNER HUB */}
      <div
        style={{
          flex: '1.05',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(145deg, #FFFFFF 0%, #F0FDF4 50%, #ECFEFF 100%)',
          border: '1.5px solid #A7F3D0',
          borderRadius: '18px',
          boxShadow: '0 6px 24px rgba(6, 78, 59, 0.08)',
          overflow: 'hidden',
          boxSizing: 'border-box',
          height: '100%',
        }}
      >
        {/* Scanner HUD Header */}
        <div
          style={{
            padding: '0.6rem 0.85rem',
            background: 'linear-gradient(135deg, #ECFDF5 0%, #E0F2FE 100%)',
            borderBottom: '1.5px solid #A7F3D0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Radio size={16} color="#0284C7" className="animate-pulse" />
              <span style={{ fontSize: '0.86rem', fontWeight: 900, color: '#064E3B', letterSpacing: '0.4px' }}>
                MAGNETIC SPECTROMETER
              </span>
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                background: isComplete ? '#DCFCE7' : '#E0F2FE',
                border: isComplete ? '1px solid #16A34A' : '1px solid #0284C7',
                color: isComplete ? '#16A34A' : '#0284C7',
              }}
            >
              {isComplete ? 'ALL SCANNED ✓' : `${scannedCount}/10 TESTED`}
            </span>
          </div>

          {/* Live Score & Telemetry Mini Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                border: '1px solid #86EFAC',
                borderRadius: '8px',
                padding: '0.25rem 0.55rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 800 }}>🧲 Magnetic:</span>
              <strong style={{ fontSize: '0.82rem', color: '#15803D', fontWeight: 900 }}>{magneticCount}</strong>
            </div>
            <div
              style={{
                background: 'linear-gradient(135deg, #FFF1F2 0%, #FEE2E2 100%)',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
                padding: '0.25rem 0.55rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.7rem', color: '#991B1B', fontWeight: 800 }}>🛡️ Non-Mag:</span>
              <strong style={{ fontSize: '0.82rem', color: '#B91C1C', fontWeight: 900 }}>{nonMagneticCount}</strong>
            </div>
          </div>
        </div>

        {/* 2-Column Scanner Slots Grid */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.45rem',
            padding: '0.55rem',
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          {/* Column 1 (5 items) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', height: '100%', flex: 1 }}>
            {ALL_ITEMS.slice(0, 5).map(renderCard)}
          </div>

          {/* Column 2 (5 items) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', height: '100%', flex: 1 }}>
            {ALL_ITEMS.slice(5, 10).map(renderCard)}
          </div>
        </div>
      </div>

      {/* INITIAL INSTRUCTION POP-UP MODAL */}
      {showInstructionModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #A7F3D0',
              borderRadius: '28px',
              padding: '2.2rem 2.8rem',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(6, 78, 59, 0.2)',
              maxWidth: '520px',
              width: '90%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.15rem',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.2)',
              }}
            >
              <Sparkles size={34} color="#059669" />
            </div>

            <h2 style={{ fontSize: '1.6rem', margin: 0, color: '#064E3B', fontWeight: 900 }}>
              Magnetic Material Scanner 🧲
            </h2>
            <p style={{ margin: 0, color: '#475569', fontSize: '1.05rem', lineHeight: 1.55, fontWeight: 600 }}>
              Drag an object from the experiment table and drop it onto its matching slot on the right to scan its magnetic properties!
            </p>

            <button
              onClick={() => setShowInstructionModal(false)}
              style={{
                padding: '0.95rem 2.5rem',
                fontSize: '1.1rem',
                fontWeight: 900,
                borderRadius: '30px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.25s ease',
                marginTop: '0.35rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Start Scanning <ArrowRight size={20} color="#FFFFFF" />
            </button>
          </div>
        </div>
      )}

      {/* CENTER POP-UP OVERLAY FOR LARGE CONTINUE BUTTON AFTER ALL ITEMS ARE SCANNED */}
      {showCompletionPopup && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #A7F3D0',
              borderRadius: '28px',
              padding: '2.2rem 2.8rem',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(6, 78, 59, 0.25)',
              maxWidth: '520px',
              width: '90%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.15rem',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCircle2 size={38} color="#059669" />
            </div>

            <h2 style={{ fontSize: '1.75rem', margin: 0, color: '#064E3B', fontWeight: 900 }}>
              All 10 Materials Analyzed! 🎉
            </h2>
            <p style={{ color: '#334155', margin: 0, fontSize: '1.05rem', lineHeight: 1.55, fontWeight: 600 }}>
              You identified <strong style={{ color: '#059669' }}>{magneticCount} Magnetic materials</strong> (Iron, Steel, Nickel) and <strong style={{ color: '#DC2626' }}>{nonMagneticCount} Non-Magnetic materials</strong> (Wood, Plastic, Rubber, Glass, Paper)!
            </p>
            <button
              onClick={onComplete}
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                fontWeight: 900,
                borderRadius: '30px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 6px 20px rgba(217, 119, 6, 0.4)',
                transition: 'all 0.25s ease',
                marginTop: '0.4rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Continue to Quiz <ArrowRight size={22} color="#FFFFFF" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
