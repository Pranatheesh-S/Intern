import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, XCircle, Activity, Radio, Search, Maximize2, Minimize2, Magnet, Lock } from 'lucide-react';
import './Activity4_1.css';

const ALL_ITEMS = [
  { id: 'pens', name: 'Pens', icon: '🖊️', material: 'Plastic', isMagnetic: false, hotspot: { x: 4.2, y: 72.0 }, desc: 'Synthetic polymer', crop: { sx: 80, sy: 390, sw: 220, sh: 360 } },
  { id: 'ruler', name: 'Ruler', icon: '📏', material: 'Plastic / Wood', isMagnetic: false, hotspot: { x: 16.6, y: 84.3 }, desc: 'Dielectric polymer', crop: { sx: 50, sy: 790, sw: 340, sh: 160 } },
  { id: 'bottle', name: 'Water Bottle', icon: '🍾', material: 'Glass', isMagnetic: false, hotspot: { x: 28.7, y: 48.3 }, desc: 'Non-magnetic silica', crop: { sx: 310, sy: 295, sw: 140, sh: 380 } },
  { id: 'eraser', name: 'Eraser', icon: '🧹', material: 'Rubber', isMagnetic: false, hotspot: { x: 31.1, y: 70.1 }, desc: 'Non-ferrous elastomer', crop: { sx: 350, sy: 685, sw: 120, sh: 75 } },
  { id: 'clips', name: 'Paper Clips', icon: '📎', material: 'Steel (Iron)', isMagnetic: true, hotspot: { x: 35.1, y: 90.8 }, desc: 'Ferromagnetic alloy', crop: { sx: 415, sy: 740, sw: 210, sh: 115 } },
  { id: 'coins', name: 'Coins', icon: '🪙', material: 'Nickel Alloy', isMagnetic: true, hotspot: { x: 47.0, y: 82.2 }, desc: 'Ferromagnetic core', crop: { sx: 620, sy: 695, sw: 175, sh: 85 } },
  { id: 'compass', name: 'Compass', icon: '🧭', material: 'Magnetic Needle', isMagnetic: true, hotspot: { x: 55.5, y: 51.2 }, desc: 'Permanent magnet', crop: { sx: 655, sy: 345, sw: 180, sh: 220 } },
  { id: 'pencil_case', name: 'Pencil Case', icon: '👝', material: 'Fabric Cloth', isMagnetic: false, hotspot: { x: 69.8, y: 71.8 }, desc: 'Organic textile', crop: { sx: 830, sy: 635, sw: 340, sh: 230 } },
  { id: 'pencil', name: 'Pencil', icon: '✏️', material: 'Wood & Graphite', isMagnetic: false, hotspot: { x: 87.5, y: 86.7 }, desc: 'Carbon & cellulose', crop: { sx: 1175, sy: 745, sw: 340, sh: 200 } },
  { id: 'notebook', name: 'Notebook', icon: '📓', material: 'Paper', isMagnetic: false, hotspot: { x: 95.8, y: 71.4 }, desc: 'Cellulose fiber', crop: { sx: 1205, sy: 575, sw: 445, sh: 235 } },
];

function CroppedObjectViewer({ item, scanProgress }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!item || !item.crop) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = (img) => {
      if (!img || !img.naturalWidth) return;
      const { sx, sy, sw, sh } = item.crop;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || 160;
      const h = rect.height || 125;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, w, h);

      // Fit cropped region within canvas maintaining exact aspect ratio
      const scale = Math.min((w - 12) / sw, (h - 12) / sh);
      const dw = sw * scale;
      const dh = sh * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;

      // Draw rounded clipped region for high visual quality
      ctx.save();
      const r = 8;
      ctx.beginPath();
      ctx.moveTo(dx + r, dy);
      ctx.lineTo(dx + dw - r, dy);
      ctx.quadraticCurveTo(dx + dw, dy, dx + dw, dy + r);
      ctx.lineTo(dx + dw, dy + dh - r);
      ctx.quadraticCurveTo(dx + dw, dy + dh, dx + dw - r, dy + dh);
      ctx.lineTo(dx + r, dy + dh);
      ctx.quadraticCurveTo(dx, dy + dh, dx, dy + dh - r);
      ctx.lineTo(dx, dy + r);
      ctx.quadraticCurveTo(dx, dy, dx + r, dy);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      ctx.restore();
    };

    const existingImg = document.querySelector('img[src*="activity_4.1.png"]');
    if (existingImg && existingImg.complete && existingImg.naturalWidth > 0) {
      render(existingImg);
    } else {
      const img = new Image();
      img.src = '/Activity4_1/activity_4.1.png';
      img.onload = () => render(img);
    }
  }, [item]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      maxHeight: '160px',
      position: 'relative',
      borderRadius: '14px',
      background: 'rgba(15, 23, 42, 0.94)',
      border: '1.5px solid #38BDF8',
      boxShadow: '0 0 16px rgba(56, 189, 248, 0.3), inset 0 0 14px rgba(2, 132, 199, 0.25)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />

      {/* Laser Scanning Line Sweep synced to progress */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${scanProgress}%`,
          width: '2.5px',
          background: '#38BDF8',
          boxShadow: '0 0 10px #38BDF8, 0 0 18px #0284C7',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      {/* Corner Reticles */}
      <div style={{ position: 'absolute', top: 4, left: 4, width: 8, height: 8, borderTop: '2px solid #38BDF8', borderLeft: '2px solid #38BDF8', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderTop: '2px solid #38BDF8', borderRight: '2px solid #38BDF8', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 4, left: 4, width: 8, height: 8, borderBottom: '2px solid #38BDF8', borderLeft: '2px solid #38BDF8', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 4, right: 4, width: 8, height: 8, borderBottom: '2px solid #38BDF8', borderRight: '2px solid #38BDF8', pointerEvents: 'none' }} />

      {/* Item Label Badge */}
      <div style={{
        position: 'absolute',
        bottom: 4,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(3, 7, 18, 0.88)',
        border: '1px solid rgba(56, 189, 248, 0.45)',
        borderRadius: '6px',
        padding: '2px 8px',
        fontSize: '0.66rem',
        fontWeight: 900,
        color: '#E0F2FE',
        letterSpacing: '0.4px',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 5,
      }}>
        ISOLATED OBJECT
      </div>
    </div>
  );
}

export default function MagneticTable({ onComplete, onTableCompleted }) {
  const [scanningItemId, setScanningItemId] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedResults, setScannedResults] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDragOverScanner, setIsDragOverScanner] = useState(false);
  const [activeScannerItem, setActiveScannerItem] = useState(null);
  const [showInstructionModal, setShowInstructionModal] = useState(true);
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
    setActiveScannerItem(item);
    setScanProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setScanProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setScannedResults(prev => ({ ...prev, [item.id]: true }));
        setScanningItemId(null);
        setActiveScannerItem(null);
        setScanProgress(0);
      }
    }, 28);
  };

  const isComplete = Object.keys(scannedResults).length === ALL_ITEMS.length;
  const scannedCount = Object.keys(scannedResults).length;
  const magneticCount = Object.keys(scannedResults).filter(id => ALL_ITEMS.find(i => i.id === id)?.isMagnetic).length;
  const nonMagneticCount = scannedCount - magneticCount;

  useEffect(() => {
    if (isComplete && onTableCompleted) {
      onTableCompleted(true);
    }
  }, [isComplete, onTableCompleted]);

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

    const itemToScan = ALL_ITEMS.find(i => i.id === itemId) || draggedItem;
    if (itemToScan) {
      if (!scannedResults[itemToScan.id] && !scanningItemId) {
        startScanForItem(itemToScan);
      }
    }
    setDraggedItem(null);
  };

  const renderCard = (item) => {
    const isScanning = scanningItemId === item.id;
    const isScanned = scannedResults[item.id];
    const isMag = item.isMagnetic;

    let cardBg = '#FFFFFF';
    let cardBorder = '1.5px solid #FDE68A';
    let cardShadow = '0 3px 12px rgba(217, 119, 6, 0.05)';
    let nameColor = '#064E3B';
    let subColor = '#065F46';

    if (isScanning) {
      cardBg = 'linear-gradient(135deg, #FEF3C7 0%, #E0F2FE 100%)';
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
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 0.95rem',
          minHeight: '56px',
          height: '100%',
          background: cardBg,
          borderRadius: '14px',
          border: cardBorder,
          boxShadow: cardShadow,
          cursor: 'default',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          overflow: 'hidden',
          userSelect: 'none',
          boxSizing: 'border-box',
        }}
        title={isScanned ? `${item.name}: ${item.desc}` : `${item.name} — Pending analysis in Spectrometer Scanner`}
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

        {/* Left: Item Icon + (Object Name on Line 1, Magnetic/Non-Magnetic on Line 2) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          minWidth: 0,
          width: '100%',
          position: 'relative',
          zIndex: 3,
        }}>
          <span style={{
            fontSize: '1.95rem',
            lineHeight: 1,
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {item.icon}
          </span>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '2px',
            minWidth: 0,
            flex: 1,
          }}>
            <span style={{
              fontSize: '1.02rem',
              fontWeight: 900,
              color: nameColor,
              letterSpacing: '0.2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {item.name}
            </span>

            {/* Next Line: Magnetic / Non-Magnetic Status inside the card */}
            {isScanning ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#0284C7',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  whiteSpace: 'nowrap',
                }}
              >
                <Activity size={12} className="animate-spin" color="#0284C7" />
                <span>Scanning {scanProgress}%</span>
              </div>
            ) : isScanned ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: isMag ? '#15803D' : '#B91C1C',
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  whiteSpace: 'nowrap',
                }}
              >
                {isMag ? <CheckCircle2 size={13} color="#15803D" /> : <XCircle size={13} color="#B91C1C" />}
                <span>{isMag ? 'Magnetic' : 'Non-Magnetic'}</span>
              </div>
            ) : null}
          </div>
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
      {/* LEFT SIDE: EXPERIMENT TABLE IMAGE (Warm Amber Theme) */}
      <div
        style={{
          flex: '2.1',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)',
          borderRadius: '24px',
          border: '1.5px solid #FDE68A',
          boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '0.6rem 1.1rem',
            borderBottom: '1.5px solid #FDE68A',
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span style={{ fontSize: '1.15rem' }}>🔬</span>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#064E3B' }}>
              Experiment Table: Drag & Drop Items to the Scanner
            </h3>
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#064E3B' }}>
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

          {/* Interactive Draggable Object Badges over Image (Box shape, placed exactly on the white paper labels) */}
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
                  padding: '0.68rem 0.95rem',
                  minHeight: '38px',
                  borderRadius: '9px',
                  backgroundColor: isScanning
                    ? 'rgba(2, 132, 199, 0.95)'
                    : 'rgba(15, 23, 42, 0.90)',
                  border: isScanning
                    ? '2px solid #38BDF8'
                    : '1.5px solid rgba(254, 240, 138, 0.9)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'grab',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.55), 0 0 12px rgba(245, 158, 11, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 20,
                  userSelect: 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  backdropFilter: 'blur(8px)',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box',
                }}
                title={`Drag ${item.name} to its scanner slot on the right`}
              >
                <span style={{ letterSpacing: '0.3px' }}>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE: WARM AMBER THEMED LINEAR GRADIENT SCANNER HUB */}
      <div
        style={{
          flex: '1.05',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)',
          border: '1.5px solid #FDE68A',
          borderRadius: '24px',
          boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)',
          overflow: 'hidden',
          boxSizing: 'border-box',
          height: '100%',
        }}
      >
        {/* Scanner HUD Header */}
        <div
          style={{
            padding: '0.65rem 0.95rem',
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            borderBottom: '1.5px solid #FDE68A',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio size={20} color="#D97706" className="animate-pulse" />
              <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#064E3B', letterSpacing: '0.4px' }}>
                MAGNETIC SPECTROMETER
              </span>
            </div>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 900,
                padding: '3px 10px',
                borderRadius: '14px',
                background: isComplete ? '#DCFCE7' : '#FEF3C7',
                border: isComplete ? '1.5px solid #16A34A' : '1.5px solid #F59E0B',
                color: isComplete ? '#16A34A' : '#D97706',
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
              <span style={{ fontSize: '0.82rem', color: '#991B1B', fontWeight: 800 }}>🛡️ Non-Magnetic:</span>
              <strong style={{ fontSize: '0.95rem', color: '#B91C1C', fontWeight: 900 }}>{nonMagneticCount}</strong>
            </div>
          </div>
        </div>

        {/* HOLOGRAPHIC SCANNING CHAMBER (Drag & Drop Scanner Area: Deep Sci-Fi / Cyber Laboratory Theme) */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!scanningItemId) {
              setIsDragOverScanner(true);
            }
          }}
          onDragLeave={() => setIsDragOverScanner(false)}
          onDrop={handleDropOnScanner}
          style={{
            minHeight: '185px',
            margin: '0.55rem 0.75rem 0.35rem',
            borderRadius: '20px',
            background: isDragOverScanner
              ? 'linear-gradient(135deg, #07263E 0%, #03456D 50%, #0284C7 100%)'
              : scanningItemId
              ? 'linear-gradient(135deg, #091222 0%, #0F172A 50%, #1E293B 100%)'
              : isComplete
              ? 'linear-gradient(135deg, #05241C 0%, #064E3B 50%, #022C22 100%)'
              : 'linear-gradient(135deg, #0A1120 0%, #0F172A 60%, #172554 100%)',
            border: isDragOverScanner
              ? '2.5px dashed #38BDF8'
              : scanningItemId
              ? '2px solid #38BDF8'
              : isComplete
              ? '2px solid #10B981'
              : '2px dashed #38BDF8',
            boxShadow: isDragOverScanner
              ? '0 0 28px rgba(56, 189, 248, 0.4), inset 0 0 18px rgba(56, 189, 248, 0.2)'
              : scanningItemId
              ? '0 0 26px rgba(56, 189, 248, 0.35), inset 0 0 16px rgba(2, 132, 199, 0.2)'
              : isComplete
              ? '0 6px 25px rgba(16, 185, 129, 0.3), inset 0 0 18px rgba(52, 211, 153, 0.2)'
              : '0 8px 24px rgba(15, 23, 42, 0.2), inset 0 0 20px rgba(56, 189, 248, 0.08)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'stretch',
            padding: '1rem',
            boxSizing: 'border-box',
            transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            flexShrink: 0,
          }}
        >
          {/* Laser Sweep FX across entire chamber when scanning */}
          {scanningItemId && (
            <>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: `${scanProgress}%`,
                  background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.05) 0%, rgba(56, 189, 248, 0.3) 100%)',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${scanProgress}%`,
                  width: '3px',
                  background: '#38BDF8',
                  boxShadow: '0 0 14px #38BDF8, 0 0 24px #0284C7',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              />
            </>
          )}

          {/* Scanning Mode: Object on LEFT (40%), Real-Time Spectrometer Analysis on RIGHT (60%) */}
          {scanningItemId && ALL_ITEMS.find(i => i.id === scanningItemId) ? (() => {
            const scanningItem = ALL_ITEMS.find(i => i.id === scanningItemId);
            return (
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', zIndex: 3 }}>
                {/* Left 40%: Isolated Object Preview while scanning */}
                <div
                  style={{
                    width: '40%',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    paddingRight: '0.4rem',
                    boxSizing: 'border-box',
                  }}
                >
                  <CroppedObjectViewer
                    item={scanningItem}
                    scanProgress={scanProgress}
                  />
                </div>

                {/* Right 60%: Real-Time Permeability and Spectrometer Data */}
                <div
                  style={{
                    width: '60%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    paddingLeft: '1rem',
                    position: 'relative',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.85rem', lineHeight: 1 }}>{scanningItem.icon}</span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#F8FAFC' }}>{scanningItem.name}</span>
                        <span style={{ fontSize: '0.82rem', color: '#FDE68A', fontWeight: 700 }}>Material: {scanningItem.material}</span>
                      </div>
                    </div>

                    {/* Frequency Visualizer */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '20px', width: '88%' }}>
                      {[35, 75, 95, 60, 100, 80, 45, 90, 70, 85, 55, 90, 40].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: `${Math.max(20, (h * ((scanProgress * 3 + i * 20) % 100)) / 100)}%`,
                            background: 'linear-gradient(to top, #38BDF8, #F59E0B)',
                            borderRadius: '2px',
                            transition: 'height 0.08s ease',
                          }}
                        />
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Activity size={15} className="animate-spin" color="#38BDF8" />
                      <span style={{ fontSize: '0.86rem', fontWeight: 900, color: '#38BDF8' }}>
                        ANALYZING PERMEABILITY... {scanProgress}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })() : isComplete ? (
            /* Completion Celebration Card in Scanning Chamber */
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', zIndex: 3, gap: '1rem', padding: '0.5rem 1rem', boxSizing: 'border-box' }}>
              <div style={{
                width: '130px',
                height: '100%',
                maxHeight: '140px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.15) 0%, rgba(245, 158, 11, 0.25) 100%)',
                border: '1.5px solid #F59E0B',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.25), inset 0 0 15px rgba(251, 191, 36, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                padding: '0.5rem',
                flexShrink: 0,
                boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: '2.6rem', lineHeight: 1 }}>🏆</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#FDE68A', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  10/10 Analyzed
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 3px 10px rgba(217, 119, 6, 0.35)',
                    flexShrink: 0
                  }}>
                    <CheckCircle2 size={20} color="#D97706" />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 900 }}>
                    All 10 Materials Analyzed! 🎉
                  </h3>
                </div>

                <p style={{ margin: 0, fontSize: '0.84rem', color: '#E0F2FE', fontWeight: 700, lineHeight: 1.45 }}>
                  Identified <strong style={{ color: '#FBBF24' }}>{magneticCount} Magnetic materials</strong> (Iron, Steel, Nickel) and <strong style={{ color: '#FCA5A5' }}>{nonMagneticCount} Non-Magnetic materials</strong> (Wood, Plastic, Rubber, Glass, Paper)!
                </p>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '10px',
                  background: 'rgba(52, 211, 153, 0.18)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#34D399',
                  marginTop: '2px',
                }}>
                  <Sparkles size={13} color="#34D399" />
                  <span>Activity Complete • Ready for Knowledge Quiz</span>
                </div>
              </div>
            </div>
          ) : (
            /* Idle Ready State: CENTERED Across the Whole Scanning Chamber */
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '0.85rem',
                zIndex: 3,
                boxSizing: 'border-box',
                padding: '1rem',
              }}
            >
              <span
                style={{
                  fontSize: '1.08rem',
                  color: isDragOverScanner ? '#38BDF8' : '#F8FAFC',
                  fontWeight: 800,
                  lineHeight: 1.5,
                  letterSpacing: '0.2px',
                  maxWidth: '520px',
                }}
              >
                {isDragOverScanner
                  ? 'Release item to detect magnetic properties'
                  : 'Drag any object name from the experiment table and drop here to scan'}
              </span>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.38rem 1.15rem',
                  borderRadius: '14px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1.5px solid rgba(56, 189, 248, 0.45)',
                  fontSize: '0.88rem',
                  fontWeight: 900,
                  color: '#38BDF8',
                  letterSpacing: '0.4px',
                  boxShadow: '0 0 16px rgba(56, 189, 248, 0.2)'
                }}
              >
                <Sparkles size={15} color="#38BDF8" />
                <span>SPECTROMETER SENSOR READY</span>
              </div>
            </div>
          )}
        </div>

        {/* 2-Column Scanner Slots Grid in Lower Half (Fills vertical height dynamically to eliminate empty space) */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(5, 1fr)',
            gridAutoFlow: 'column',
            gap: '0.45rem',
            padding: '0.55rem 0.75rem',
            overflowY: 'auto',
            overflowX: 'hidden',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          {ALL_ITEMS.map(renderCard)}
        </div>

        {/* RIGHT SIDE BOTTOM ACTION BAR: ENLARGED PROCEED TO QUIZ */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            background: isComplete 
              ? 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)' 
              : '#FFFFFF',
            borderTop: '2px solid #FDE68A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexShrink: 0,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            {isComplete ? (
              <>
                <CheckCircle2 size={24} color="#16A34A" style={{ flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.08rem', fontWeight: 900, color: '#064E3B', letterSpacing: '-0.01em' }}>
                    All 10 scanned! Ready for quiz.
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#047857' }}>
                    Click button to start Knowledge Quiz
                  </span>
                </div>
              </>
            ) : (
              <>
                <Lock size={22} color="#64748B" style={{ flexShrink: 0 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', letterSpacing: '-0.01em' }}>
                    Scan all objects to unlock quiz
                  </span>
                  <span style={{
                    fontSize: '0.92rem',
                    fontWeight: 900,
                    padding: '3px 10px',
                    borderRadius: '10px',
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    color: '#475569'
                  }}>
                    ({scannedCount}/10)
                  </span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={isComplete ? onComplete : undefined}
            disabled={!isComplete}
            className={isComplete ? 'gold-glow-btn' : ''}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.85rem 1.95rem',
              fontSize: '1.08rem',
              fontWeight: 900,
              borderRadius: '16px',
              background: isComplete ? undefined : '#E2E8F0',
              color: isComplete ? '#FFFFFF' : '#94A3B8',
              border: isComplete ? 'none' : '1.5px solid #CBD5E1',
              cursor: isComplete ? 'pointer' : 'not-allowed',
              opacity: isComplete ? 1 : 0.7,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.25s ease',
              boxShadow: isComplete ? '0 6px 20px rgba(217, 119, 6, 0.35)' : 'none'
            }}
            title={isComplete ? 'Proceed to Knowledge Quiz' : 'Scan all 10 objects to unlock the quiz'}
          >
            {!isComplete && <Lock size={20} color="#94A3B8" />}
            Proceed to Quiz {isComplete && <ArrowRight size={22} color="#FFFFFF" />}
          </button>
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
              background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)',
              border: '2px solid #FDE68A',
              borderRadius: '28px',
              padding: '2.2rem 2.8rem',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(217, 119, 6, 0.2)',
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
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(217, 119, 6, 0.2)',
              }}
            >
              <Sparkles size={34} color="#D97706" />
            </div>

            <h2 style={{ fontSize: '1.6rem', margin: 0, color: '#064E3B', fontWeight: 900 }}>
              Magnetic Material Scanner 🧲
            </h2>
            <p style={{ margin: 0, color: '#065F46', fontSize: '1.05rem', lineHeight: 1.55, fontWeight: 700 }}>
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

    </div>
  );
}
