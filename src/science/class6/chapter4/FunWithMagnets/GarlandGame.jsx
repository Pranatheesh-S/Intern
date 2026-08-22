import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Zap, ArrowRight, Check } from 'lucide-react';

const OBJECT_ITEMS = [
  // Magnetic Objects
  { id: 'clip_lime', name: 'Steel Paperclip', color: '#10B981', icon: '📎', glow: 'rgba(16, 185, 129, 0.5)', isMagnetic: true },
  { id: 'bead_red', name: 'Magnetic Bead', color: '#EF4444', icon: '🔴', glow: 'rgba(239, 68, 68, 0.5)', isMagnetic: true },
  { id: 'washer_chrome', name: 'Steel Washer', color: '#94A3B8', icon: '⚙️', glow: 'rgba(148, 163, 184, 0.5)', isMagnetic: true },
  { id: 'ring_cyan', name: 'Metal Key Ring', color: '#06B6D4', icon: '🔑', glow: 'rgba(6, 182, 212, 0.5)', isMagnetic: true },
  { id: 'star_gold', name: 'Golden Steel Star', color: '#F59E0B', icon: '⭐', glow: 'rgba(245, 158, 11, 0.5)', isMagnetic: true },

  // Non-Magnetic Objects
  { id: 'pencil_wood', name: 'Wooden Pencil', color: '#D97706', icon: '✏️', glow: 'transparent', isMagnetic: false },
  { id: 'eraser_rubber', name: 'Rubber Eraser', color: '#F43F5E', icon: '🧹', glow: 'transparent', isMagnetic: false },
  { id: 'paper_slip', name: 'Paper Slip', color: '#64748B', icon: '📄', glow: 'transparent', isMagnetic: false },
  { id: 'comb_plastic', name: 'Plastic Comb', color: '#8B5CF6', icon: '🪮', glow: 'transparent', isMagnetic: false },
  { id: 'stick_wood', name: 'Wooden Stick', color: '#B45309', icon: '🪵', glow: 'transparent', isMagnetic: false }
];

export default function GarlandGame({ onComplete, onPlayMaze }) {
  const [chain, setChain] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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
      setToastMsg(`❌ ${item.name} is Non-Magnetic! Wood/Plastic does not stick to magnets.`);
      setTimeout(() => setToastMsg(null), 2500);
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
        overflow: 'hidden'
      }}
    >
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
        {/* Rich Science Laboratory Background Image */}
        <img 
          src="/SuspendedMagnet/wooden_stand_lab_bg.jpg" 
          alt="Science Laboratory Background" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            opacity: 0.9
          }} 
        />

        {/* Non-Magnetic / Duplicate Warning Toast */}
        {toastMsg && (
          <div style={{
            position: 'absolute',
            top: '16px',
            background: '#FEE2E2',
            border: '1.5px solid #EF4444',
            color: '#991B1B',
            padding: '0.65rem 1.4rem',
            borderRadius: '20px',
            fontWeight: 800,
            fontSize: '0.92rem',
            zIndex: 100,
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
            animation: 'bounceIn 0.3s ease'
          }}>
            {toastMsg}
          </div>
        )}

        {/* Larger 3D Arc Suspension Stand */}
        <div style={{
          position: 'absolute',
          top: '55px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10
        }}>
          {/* Ornate Golden Brass Arch Beam */}
          <div style={{
            width: '280px',
            height: '18px',
            background: 'linear-gradient(135deg, #FDE047 0%, #D97706 50%, #78350F 100%)',
            borderRadius: '9px',
            boxShadow: '0 6px 15px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.7)'
          }} />
          <div style={{ width: '5px', height: '40px', background: '#94A3B8' }} />

          {/* Larger 3D Bar Magnet (250px x 56px) */}
          <div style={{
            width: '250px',
            height: '56px',
            borderRadius: '14px',
            display: 'flex',
            border: '3px solid #FFFFFF',
            boxShadow: '0 15px 40px rgba(0,0,0,0.45), 0 0 30px rgba(245, 158, 11, 0.4)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', color: '#FFFFFF', fontWeight: 900, fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>N</div>
            <div style={{ width: '4px', background: '#FFFFFF' }} />
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)', color: '#FFFFFF', fontWeight: 900, fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</div>
          </div>
        </div>

        {/* Larger Attached Garland Chain Items (58px x 60px) */}
        <div style={{
          position: 'absolute',
          top: '166px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 20
        }}>
          {chain.map((item, idx) => (
            <div 
              key={item.instanceId || idx}
              style={{
                width: '58px',
                height: '60px',
                borderRadius: '16px',
                background: item.color,
                border: '3px solid #FFFFFF',
                boxShadow: `0 10px 25px rgba(0,0,0,0.3), 0 0 20px ${item.glow}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                color: '#FFFFFF',
                marginTop: idx === 0 ? '0' : '-10px',
                position: 'relative',
                animation: 'bounceIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              {item.icon}
              <div style={{
                position: 'absolute',
                top: '-5px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#FDE047',
                border: '1.5px solid #78350F'
              }} />
            </div>
          ))}

          {/* Magnetic Snap Target Ring */}
          <div style={{
            marginTop: '10px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '3px dashed #D97706',
            background: 'rgba(245, 158, 11, 0.25)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
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
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: draggedItem.color,
            border: '3px solid #FFFFFF',
            boxShadow: `0 15px 35px rgba(0,0,0,0.5)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.2rem',
            zIndex: 9999,
            pointerEvents: 'none'
          }}>
            {draggedItem.icon}
          </div>
        )}
      </div>

      {/* Right Column: Mission Control & Expanded Object Tray (Fills Container Space) */}
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
            Tap or drag objects from the tray below. Each magnetic item can be added <strong>only once</strong>! Non-magnetic items will drop away.
          </p>

          {/* Expanded Rich Object Tray Grid Filling Space */}
          <div style={{
            background: '#F0FDF4',
            border: '1.5px solid #A7F3D0',
            borderRadius: '22px',
            padding: '1.1rem'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#047857', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Zap size={16} color="#047857" /> OBJECT TRAY (TAP OR DRAG EACH OBJECT ONCE)
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
