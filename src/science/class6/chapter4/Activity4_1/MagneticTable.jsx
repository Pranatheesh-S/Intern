import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, XCircle, Activity, Radio, Search, Maximize2, Minimize2 } from 'lucide-react';
import './Activity4_1.css';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

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
    let cardShadow = '0 3px 12px rgba(0, 0, 0, 0.04)';
    let nameColor = '#0F172A';
    let subColor = '#475569';

    if (isDragOver) {
      cardBg = 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)';
      cardBorder = '2px dashed #0284C7';
      cardShadow = '0 0 20px rgba(2, 132, 199, 0.4)';
    } else if (isScanning) {
      cardBg = 'linear-gradient(135deg, #F0FDF4 0%, #E0F2FE 100%)';
      cardBorder = '2px solid #0284C7';
      cardShadow = '0 0 20px rgba(2, 132, 199, 0.35)';
    } else if (isScanned) {
      if (isMag) {
        cardBg = 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)';
        cardBorder = '1.5px solid #86EFAC';
        cardShadow = '0 4px 14px rgba(22, 163, 74, 0.18)';
        nameColor = '#064E3B';
        subColor = '#047857';
      } else {
        cardBg = 'linear-gradient(135deg, #FFF1F2 0%, #FEE2E2 100%)';
        cardBorder = '1.5px solid #FCA5A5';
        cardShadow = '0 4px 14px rgba(239, 68, 68, 0.15)';
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
          padding: '0.55rem 0.75rem',
          background: cardBg,
          borderRadius: '16px',
          border: cardBorder,
          boxShadow: cardShadow,
          cursor: isScanned ? 'default' : 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 0,
          userSelect: 'none',
          boxSizing: 'border-box',
          transform: isDragOver ? 'scale(1.03)' : 'scale(1)',
        }}
        title={isScanned ? `${item.name}: ${item.desc}` : `Drag ${item.name} from the experiment table here!`}
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

        {/* Top Section: Squircle Avatar + Item Title + Material Tag + Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 3, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0 }}>
            {/* 3D Squircle Icon Frame */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '11px',
              background: isScanned 
                ? (isMag ? 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)' : 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)')
                : 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.35rem',
              boxShadow: isScanned
                ? (isMag ? '0 2px 8px rgba(22, 163, 74, 0.25)' : '0 2px 8px rgba(220, 38, 38, 0.2)')
                : '0 2px 6px rgba(0, 0, 0, 0.06)',
              border: isScanned
                ? (isMag ? '1px solid #86EFAC' : '1px solid #FCA5A5')
                : '1px solid #E2E8F0',
              flexShrink: 0
            }}>
              {item.icon}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontWeight: 900, fontSize: '0.98rem', color: nameColor, lineHeight: '1.15', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
              </span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <span style={{
                  fontSize: '0.72rem',
                  color: subColor,
                  fontWeight: 700,
                  background: 'rgba(255, 255, 255, 0.85)',
                  padding: '1px 6px',
                  borderRadius: '6px',
                  border: '1px solid rgba(0,0,0,0.06)'
                }}>
                  {item.material}
                </span>
              </div>
            </div>
          </div>

          {/* Right Status Pill */}
          {isScanned ? (
            <div
              style={{
                padding: '4px 9px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: isMag ? 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)' : 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                color: '#FFFFFF',
                boxShadow: isMag ? '0 2px 8px rgba(22, 163, 74, 0.35)' : '0 2px 8px rgba(220, 38, 38, 0.35)',
                flexShrink: 0,
              }}
            >
              {isMag ? <CheckCircle2 size={13} color="#FFFFFF" /> : <XCircle size={13} color="#FFFFFF" />}
              {isMag ? 'Magnetic' : 'Non-Mag'}
            </div>
          ) : isScanning ? (
            <div
              style={{
                fontSize: '0.76rem',
                fontWeight: 900,
                color: '#0284C7',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#E0F2FE',
                padding: '3px 8px',
                borderRadius: '8px',
                border: '1px solid #7DD3FC'
              }}
            >
              <Activity size={13} className="animate-spin" />
              <span>{scanProgress}%</span>
            </div>
          ) : null}
        </div>

        {/* Middle / Bottom Interactive Bay */}
        <div style={{ marginTop: '0.35rem', zIndex: 3 }}>
          {isScanning ? (
            /* Live Spectrogram Waveform */
            <div style={{
              background: 'rgba(2, 132, 199, 0.08)',
              border: '1px solid rgba(2, 132, 199, 0.25)',
              borderRadius: '8px',
              padding: '0.3rem 0.55rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '0.72rem', color: '#0284C7', fontWeight: 900, letterSpacing: '0.3px' }}>ANALYZING:</span>
              <div style={{ display: 'flex', gap: '3px', flex: 1, alignItems: 'flex-end', height: '12px' }}>
                {[40, 85, 50, 100, 70, 90, 45, 80, 60, 95].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${(h * (scanProgress % 50)) / 45}%`,
                      maxHeight: '100%',
                      background: 'linear-gradient(to top, #0284C7, #38BDF8)',
                      borderRadius: '1px',
                    }}
                  />
                ))}
              </div>
            </div>
          ) : isScanned ? (
            /* Result Property Verdict Banner */
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: isMag ? 'rgba(22, 163, 74, 0.12)' : 'rgba(220, 38, 38, 0.08)',
              border: isMag ? '1px solid rgba(22, 163, 74, 0.25)' : '1px solid rgba(220, 38, 38, 0.2)',
              borderRadius: '8px',
              padding: '0.28rem 0.55rem'
            }}>
              <span style={{
                fontSize: '0.76rem',
                color: isMag ? '#15803D' : '#991B1B',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {isMag ? '🧲 Attracted to Magnet' : '🛡️ No Attraction (Inert)'}
              </span>
              <span style={{
                fontSize: '0.68rem',
                color: isMag ? '#166534' : '#7F1D1D',
                fontWeight: 700,
                background: 'rgba(255, 255, 255, 0.85)',
                padding: '1px 6px',
                borderRadius: '4px'
              }}>
                {item.desc}
              </span>
            </div>
          ) : (
            /* Unscanned State: Futuristic Target Cradle Sensor Bay */
            <div style={{
              background: isDragOver
                ? 'linear-gradient(135deg, #BAE6FD 0%, #7DD3FC 100%)'
                : 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
              border: isDragOver ? '2px dashed #0284C7' : '1.5px dashed #CBD5E1',
              borderRadius: '9px',
              padding: '0.35rem 0.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              boxShadow: isDragOver ? '0 0 12px rgba(2, 132, 199, 0.35)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '0.85rem' }}>🎯</span>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: isDragOver ? '#0369A1' : '#64748B'
                }}>
                  {isDragOver ? 'Release to Scan!' : 'Drop Slot'}
                </span>
              </div>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: isDragOver ? '#0284C7' : '#94A3B8',
                background: isDragOver ? '#FFFFFF' : 'rgba(255,255,255,0.9)',
                padding: '2px 7px',
                borderRadius: '6px',
                border: '1px solid rgba(0,0,0,0.06)'
              }}>
                Sensor Bay
              </span>
            </div>
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

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              zIndex: 40,
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1.5px solid rgba(255, 255, 255, 0.85)',
              borderRadius: '12px',
              padding: '6px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              color: '#0F172A',
              fontSize: '0.78rem',
              fontWeight: 800,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            {isFullscreen ? <Minimize2 size={14} color="#0F172A" /> : <Maximize2 size={14} color="#0F172A" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

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
              <Radio size={18} color="#0284C7" className="animate-pulse" />
              <span style={{ fontSize: '0.98rem', fontWeight: 900, color: '#064E3B', letterSpacing: '0.4px' }}>
                MAGNETIC SPECTROMETER
              </span>
            </div>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '14px',
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
                padding: '0.3rem 0.6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 800 }}>🧲 Magnetic:</span>
              <strong style={{ fontSize: '0.95rem', color: '#15803D', fontWeight: 900 }}>{magneticCount}</strong>
            </div>
            <div
              style={{
                background: 'linear-gradient(135deg, #FFF1F2 0%, #FEE2E2 100%)',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
                padding: '0.3rem 0.6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.82rem', color: '#991B1B', fontWeight: 800 }}>🛡️ Non-Mag:</span>
              <strong style={{ fontSize: '0.95rem', color: '#B91C1C', fontWeight: 900 }}>{nonMagneticCount}</strong>
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
              className="gold-glow-btn"
              style={{
                padding: '0.95rem 2.5rem',
                fontSize: '1.1rem',
                marginTop: '0.35rem',
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
              border: '2px solid #FCD34D',
              borderRadius: '28px',
              padding: '2.2rem 2.8rem',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(180, 83, 9, 0.2)',
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
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(217, 119, 6, 0.25)',
              }}
            >
              <CheckCircle2 size={38} color="#D97706" />
            </div>

            <h2 style={{ fontSize: '1.75rem', margin: 0, color: '#78350F', fontWeight: 900 }}>
              All 10 Materials Analyzed! 🎉
            </h2>
            <p style={{ color: '#334155', margin: 0, fontSize: '1.05rem', lineHeight: 1.55, fontWeight: 600 }}>
              You identified <strong style={{ color: '#D97706' }}>{magneticCount} Magnetic materials</strong> (Iron, Steel, Nickel) and <strong style={{ color: '#DC2626' }}>{nonMagneticCount} Non-Magnetic materials</strong> (Wood, Plastic, Rubber, Glass, Paper)!
            </p>
            <button
              onClick={onComplete}
              className="gold-glow-btn"
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                marginTop: '0.4rem',
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
