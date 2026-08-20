import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Zap, ArrowRight, Check, AlertCircle } from 'lucide-react';

// Completely Mixed Magnetic & Non-Magnetic Objects Grid
const OBJECT_ITEMS = [
  { id: 'pencil_wood', name: 'Wooden Pencil', icon: '✏️', glow: 'transparent', isMagnetic: false, material: 'Wood' },
  { id: 'clip_lime', name: 'Steel Paperclip', icon: '📎', glow: 'rgba(16, 185, 129, 0.6)', isMagnetic: true, material: 'Steel' },
  { id: 'comb_plastic', name: 'Plastic Comb', icon: '🪮', glow: 'transparent', isMagnetic: false, material: 'Plastic' },
  { id: 'bead_red', name: 'Magnetic Bead', icon: '🔴', glow: 'rgba(239, 68, 68, 0.6)', isMagnetic: true, material: 'Magnetized Iron' },
  { id: 'paper_slip', name: 'Paper Slip', icon: '📄', glow: 'transparent', isMagnetic: false, material: 'Paper' },
  { id: 'washer_chrome', name: 'Steel Washer', icon: '⚙️', glow: 'rgba(148, 163, 184, 0.6)', isMagnetic: true, material: 'Iron Alloy' },
  { id: 'eraser_rubber', name: 'Rubber Eraser', icon: '🧹', glow: 'transparent', isMagnetic: false, material: 'Rubber' },
  { id: 'ring_cyan', name: 'Metal Key Ring', icon: '🔑', glow: 'rgba(6, 182, 212, 0.6)', isMagnetic: true, material: 'Steel' },
  { id: 'stick_wood', name: 'Wooden Stick', icon: '🪵', glow: 'transparent', isMagnetic: false, material: 'Wood' },
  { id: 'star_gold', name: 'Golden Steel Star', icon: '⭐', glow: 'rgba(245, 158, 11, 0.6)', isMagnetic: true, material: 'Gold-Plated Steel' }
];

export default function GarlandGame({ onComplete, onPlayMaze }) {
  const [chain, setChain] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [nonMagModalItem, setNonMagModalItem] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const containerRef = useRef(null);

  // Directly attach item to the garland chain if magnetic (Only once per item!)
  const attachItem = (item) => {
    // Check if item is already added
    if (chain.some(attached => attached.id === item.id)) {
      setToastMsg(`⚠️ ${item.name} is already attached to the garland!`);
      setTimeout(() => setToastMsg(null), 2000);
      return;
    }

    if (!item.isMagnetic) {
      // Show Center Pop-up Modal for Non-Magnetic Objects!
      setNonMagModalItem(item);
      return;
    }

    setChain(prev => [...prev, { ...item, instanceId: Date.now() }]);
  };

  const handleDragStart = (item, e) => {
    if (chain.some(attached => attached.id === item.id)) return;
    setDraggedItem(item);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handlePointerMove = (e) => {
    if (!draggedItem || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handlePointerUp = () => {
    if (!draggedItem) return;
    attachItem(draggedItem);
    setDraggedItem(null);
  };

  useEffect(() => {
    if (chain.length >= 5 && onComplete) {
      onComplete();
    }
  }, [chain]);

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: '1.25rem',
        padding: '0.5rem',
        boxSizing: 'border-box',
        touchAction: 'none',
        userSelect: 'none',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Center Pop-up Modal for Non-Magnetic Objects with OK Button */}
      {nonMagModalItem && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(6, 78, 59, 0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #EF4444',
            borderRadius: '24px',
            padding: '2rem 2.5rem',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(239, 68, 68, 0.3)',
            maxWidth: '480px',
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.1rem',
            animation: 'bounceIn 0.3s ease'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem'
            }}>
              {nonMagModalItem.icon}
            </div>

            <h2 style={{ margin: 0, color: '#991B1B', fontSize: '1.65rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={24} color="#EF4444" /> Non-Magnetic Object!
            </h2>

            <p style={{ margin: 0, color: '#334155', fontSize: '1rem', lineHeight: '1.5', fontWeight: 600 }}>
              <strong>{nonMagModalItem.name}</strong> is made of <strong>{nonMagModalItem.material}</strong>, which is a non-magnetic material. It is not attracted by magnets and cannot form a garland chain!
            </p>

            <button
              onClick={() => setNonMagModalItem(null)}
              style={{
                padding: '0.85rem 3rem',
                fontSize: '1.1rem',
                fontWeight: 900,
                borderRadius: '30px',
                background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
                transition: 'all 0.2s ease',
                marginTop: '0.5rem'
              }}
            >
              OK, Got It!
            </button>
          </div>
        </div>
      )}

      {/* Left Column: 3D Garland Crafting Arch Canvas with Laboratory Background */}
      <div style={{
        flex: '1.6',
        background: '#FAF8F5',
        border: '1.5px solid #A7F3D0',
        borderRadius: '24px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        boxShadow: '0 8px 25px rgba(6, 78, 59, 0.08)'
      }}>
        {/* Validated Science Laboratory Background Image */}
        <img 
          src="/SuspendedMagnet/wooden_stand_lab_bg.jpg" 
          alt="Garland Crafting Scene Background" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            opacity: 0.95
          }} 
        />

        {/* Duplicate Toast Warning */}
        {toastMsg && (
          <div style={{
            position: 'absolute',
            top: '16px',
            background: '#FEF3C7',
            border: '1.5px solid #F59E0B',
            color: '#92400E',
            padding: '0.65rem 1.4rem',
            borderRadius: '20px',
            fontWeight: 800,
            fontSize: '0.92rem',
            zIndex: 100,
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
          }}>
            {toastMsg}
          </div>
        )}

        {/* 3D Arc Suspension Stand */}
        <div style={{
          position: 'absolute',
          top: '50px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10
        }}>
          {/* Ornate Golden Brass Arch Beam */}
          <div style={{
            width: '290px',
            height: '18px',
            background: 'linear-gradient(135deg, #FDE047 0%, #D97706 50%, #78350F 100%)',
            borderRadius: '9px',
            boxShadow: '0 6px 15px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.7)'
          }} />
          <div style={{ width: '5px', height: '42px', background: '#94A3B8' }} />

          {/* 3D Bar Magnet (260px x 58px) */}
          <div style={{
            width: '260px',
            height: '58px',
            borderRadius: '14px',
            display: 'flex',
            border: '3px solid #FFFFFF',
            boxShadow: '0 15px 40px rgba(0,0,0,0.45), 0 0 30px rgba(245, 158, 11, 0.4)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', color: '#FFFFFF', fontWeight: 900, fontSize: '1.45rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>N</div>
            <div style={{ width: '4px', background: '#FFFFFF' }} />
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)', color: '#FFFFFF', fontWeight: 900, fontSize: '1.45rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</div>
          </div>
        </div>

        {/* Attached Garland Objects (CLEAN OBJECT ALONE, NO BOX BACKGROUND) */}
        <div style={{
          position: 'absolute',
          top: '168px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 20
        }}>
          {chain.map((item, idx) => (
            <div 
              key={item.instanceId || idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: idx === 0 ? '0' : '-12px',
                position: 'relative',
                animation: 'bounceIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              {/* Golden Link Ring connecting objects */}
              {idx > 0 && (
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: '2.5px solid #FDE047',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  marginBottom: '-4px',
                  zIndex: 30
                }} />
              )}

              {/* Clean Object Alone (No Box Background) */}
              <span style={{
                fontSize: '3.4rem',
                filter: `drop-shadow(0 8px 16px rgba(0,0,0,0.6)) drop-shadow(0 0 12px ${item.glow})`
              }}>
                {item.icon}
              </span>
            </div>
          ))}

          {/* Magnetic Snap Target Ring */}
          <div style={{
            marginTop: '12px',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            border: '3px dashed #D97706',
            background: 'rgba(245, 158, 11, 0.25)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.88rem',
            color: '#FFFFFF',
            fontWeight: 900,
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.35)'
          }}>
            Snap
          </div>
        </div>

        {/* Floating Ghost of Item Being Dragged */}
        {draggedItem && (
          <div style={{
            position: 'absolute',
            left: mousePos.x - 30,
            top: mousePos.y - 30,
            fontSize: '3.4rem',
            filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.6))',
            zIndex: 9999,
            pointerEvents: 'none'
          }}>
            {draggedItem.icon}
          </div>
        )}
      </div>

      {/* Right Column: Mission Control & Mixed Object Tray Grid */}
      <div style={{
        flex: '0.9',
        height: '100%',
        background: '#FFFFFF',
        border: '1.5px solid #A7F3D0',
        borderRadius: '24px',
        padding: '1.35rem 1.6rem',
        boxShadow: '0 8px 25px rgba(6, 78, 59, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        <div>
          {/* Header Row: Parallel "GARLAND MISSION" Badge & "Play Steel Ball Maze" Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginBottom: '0.85rem'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#FEF3C7',
              color: '#92400E',
              padding: '0.55rem 1rem',
              borderRadius: '18px',
              fontSize: '0.8rem',
              fontWeight: 900,
              letterSpacing: '1px'
            }}>
              <Sparkles size={15} color="#92400E" /> GARLAND MISSION
            </div>

            {onPlayMaze && (
              <button
                onClick={onPlayMaze}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '18px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                Play Maze <ArrowRight size={16} color="#FFFFFF" />
              </button>
            )}
          </div>

          <h3 style={{ margin: '0 0 0.45rem 0', color: '#064E3B', fontSize: '1.65rem', fontWeight: 900, lineHeight: '1.2' }}>
            Build a Magnet Garland 📿
          </h3>

          <p style={{ margin: '0 0 1.1rem 0', color: '#334155', fontSize: '0.95rem', lineHeight: '1.5', fontWeight: 600 }}>
            Tap or drag objects from the mixed tray below. Only <strong>magnetic items</strong> stick through magnetic induction! Non-magnetic items will show a warning popup.
          </p>

          {/* Mixed Object Tray Grid */}
          <div style={{
            background: '#F0FDF4',
            border: '1.5px solid #A7F3D0',
            borderRadius: '22px',
            padding: '1.1rem'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#047857', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Zap size={16} color="#047857" /> OBJECT TRAY (MIXED MAGNETIC & NON-MAGNETIC)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {OBJECT_ITEMS.map((item) => {
                const isAttached = chain.some(attached => attached.id === item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => attachItem(item)}
                    onPointerDown={(e) => handleDragStart(item, e)}
                    style={{
                      padding: '0.75rem 1rem',
                      background: isAttached ? '#E2E8F0' : '#FFFFFF',
                      border: `1.5px solid ${isAttached ? '#94A3B8' : '#CBD5E1'}`,
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: isAttached ? 'not-allowed' : 'pointer',
                      opacity: isAttached ? 0.55 : 1,
                      boxShadow: isAttached ? 'none' : '0 3px 8px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '1.6rem' }}>{item.icon}</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: isAttached ? '#64748B' : '#1E293B' }}>{item.name}</span>
                    </div>
                    {isAttached && <Check size={16} color="#16A34A" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
