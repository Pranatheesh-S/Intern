import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, RotateCcw, Info, ArrowRight, Lock, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';
import MagnetActivityBackground from './MagnetActivityBackground';
import { 
  DndContext, 
  useDraggable, 
  useDroppable, 
  DragOverlay, 
  PointerSensor, 
  TouchSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';

const STEPS = [
  {
    id: "carA",
    name: "Magnetic Airplane A (Left Lane)",
    instruction: "Drag Airplane A (Front: North [N], Rear: South [S]) onto the left flight corridor.",
    hint: "Place Airplane A in the left airspace lane.",
  },
  {
    id: "carB",
    name: "Magnetic Airplane B (Right Lane)",
    instruction: "Drag Airplane B (Front: North [N], Rear: South [S]) alongside Airplane A into the right flight corridor.",
    hint: "Place Airplane B in the right airspace lane.",
  }
];

function CanvasDroppable({ children }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'canvas-droppable' });
  return (
    <div 
      ref={setNodeRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: '#020617',
        border: 'none',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 10px 35px rgba(6, 78, 59, 0.15)',
        transition: 'all 0.2s ease'
      }}
    >
      {/* 3D WebGL / GLSL Infinite Animated Cloud Sea & Volumetric God Rays */}
      <MagnetActivityBackground />
      
      {/* Center Dashed Corridor Divider Beam */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        left: '50%', 
        width: '2px', 
        borderLeft: '2px dashed rgba(255, 255, 255, 0.65)', 
        transform: 'translateX(-50%)', 
        zIndex: 2 
      }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

function TrayItemCard({ step, isPlaced, isUnlocked, renderThumbnail }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `tray-${step.id}`,
    disabled: isPlaced || !isUnlocked,
    data: { source: 'tray', itemId: step.id }
  });

  const isDisabled = isPlaced || !isUnlocked;
  const isCurrent = isUnlocked && !isPlaced;

  return (
    <div 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes}
      style={{
        opacity: isDragging ? 0.35 : 1,
        touchAction: 'none',
        width: '100%',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        gap: '0.75rem', 
        padding: '1rem', 
        borderRadius: '16px',
        background: isPlaced ? '#DCFCE7' : isCurrent ? '#FEF3C7' : '#FFFFFF',
        border: isPlaced 
          ? '1.5px solid #86EFAC' 
          : isCurrent 
          ? '2px solid #F59E0B' 
          : '1.5px solid #FDE68A',
        color: '#064E3B',
        cursor: isDisabled ? 'not-allowed' : 'grab',
        transition: 'all 0.25s ease',
        position: 'relative',
        fontWeight: 800,
        boxShadow: isCurrent ? '0 4px 14px rgba(245, 158, 11, 0.18)' : '0 2px 8px rgba(0,0,0,0.03)',
        userSelect: 'none',
        boxSizing: 'border-box',
        flex: 1,
        minHeight: 0
      }}
    >
      <div style={{ 
        width: '100%', 
        flex: 1,
        minHeight: 0,
        background: isPlaced ? '#F0FDF4' : '#FFFBEB', 
        border: `1.5px solid ${isPlaced ? '#A7F3D0' : '#FDE68A'}`, 
        borderRadius: '12px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexShrink: 0, 
        opacity: isUnlocked ? 1 : 0.4, 
        padding: '0.85rem', 
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: '6px', 
          left: '10px', 
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: isPlaced ? '#059669' : isUnlocked ? '#D97706' : '#CBD5E1',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem', 
          fontWeight: 900
        }}>
          {step.id === 'carA' ? '1' : '2'}
        </div>
        {renderThumbnail(step.id)}
      </div>
      
      <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
        <div style={{ fontSize: '1.18rem', fontWeight: 900, color: isPlaced ? '#047857' : '#064E3B' }}>{step.name}</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
          {isPlaced ? (
            <><CheckCircle2 size={18} style={{ color: '#16A34A' }} /> <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#15803D' }}>Placed in Airspace</span></>
          ) : !isUnlocked ? (
            <><Lock size={16} style={{ color: '#94A3B8' }} /> <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#94A3B8' }}>Locked</span></>
          ) : (
            <span style={{ fontSize: '0.98rem', fontWeight: 700, color: '#92400E' }}>👉 Drag to sky corridor</span>
          )}
        </div>
      </div>
    </div>
  );
}

function PlacedElement({ id, x, y, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `placed-${id}`,
    data: { source: 'placed', itemId: id }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: isDragging ? 0.35 : 1,
        touchAction: 'none',
        cursor: 'grab',
        zIndex: isDragging ? 50 : 10,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {children}
    </div>
  );
}

export default function Stage1_Build({ onComplete, onNext }) {
  const [placed, setPlaced] = useState({
    carA: false,
    carB: false
  });

  const [positions, setPositions] = useState({
    carA: { x: 190, y: 220 },
    carB: { x: 470, y: 220 }
  });

  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [success, setSuccess] = useState(false);
  const [activePopup, setActivePopup] = useState(0); // 0: carA, 1: carB, 2: observe, null: hidden

  React.useEffect(() => {
    if (placed.carA && !placed.carB) {
      setActivePopup(1);
    } else if (placed.carA && placed.carB) {
      setActivePopup(2);
    }
  }, [placed]);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 }
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 100, tolerance: 5 }
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  const isStepUnlocked = (stepId) => {
    if (stepId === "carA") return true;
    if (stepId === "carB") return placed.carA;
    return false;
  };

  const handleDragStart = (event) => {
    setActiveDraggingId(event.active.id);
  };

  const handleDragMove = (event) => {
    setDragDelta(event.delta);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDraggingId(null);
    setDragDelta({ x: 0, y: 0 });

    if (!over || over.id !== 'canvas-droppable') return;

    if (active.id.startsWith('tray-')) {
      const stepId = active.data.current?.itemId;
      if (!stepId || !isStepUnlocked(stepId)) return;

      const newPlaced = { ...placed, [stepId]: true };
      setPlaced(newPlaced);

      if (Object.values(newPlaced).every(Boolean)) {
        setSuccess(true);
      }
    } else if (active.id.startsWith('placed-')) {
      const elementId = active.data.current?.itemId;
      if (!elementId) return;

      setPositions(prev => ({
        ...prev,
        [elementId]: {
          x: Math.max(80, Math.min(650, prev[elementId].x + event.delta.x)),
          y: Math.max(80, Math.min(380, prev[elementId].y + event.delta.y))
        }
      }));
    }
  };

  const handleReset = () => {
    setPlaced({
      carA: false,
      carB: false
    });
    setPositions({
      carA: { x: 190, y: 220 },
      carB: { x: 470, y: 220 }
    });
    setSuccess(false);
    setActivePopup(0);
  };

  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const renderThumbnail = (id) => {
    return (
      <img 
        src="/MagnetInteraction/real_airliner_north_south.png" 
        alt={id === "carA" ? "Airplane A" : "Airplane B"} 
        style={{ width: '100%', height: '100%', maxHeight: '120px', objectFit: 'contain' }} 
      />
    );
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div style={{ 
        padding: '0.5rem 1rem', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '0.75rem', 
        height: '100%', 
        minHeight: 0, 
        overflow: 'hidden', 
        boxSizing: 'border-box',
        background: 'transparent',
        position: 'relative'
      }}>
      
        {/* Main 2-Column Layout (Activity Area on LEFT, Components Container on RIGHT) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 440px', 
          gap: '1.25rem', 
          flex: 1, 
          height: '100%',
          minHeight: 0,
          boxSizing: 'border-box'
        }}>
          {/* LEFT Column: Full-Bleed Activity Area (Borderless) */}
          <div style={{ 
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: 0,
            overflow: 'hidden',
            borderRadius: '24px'
          }}>
            <CanvasDroppable>
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

              {/* Magnetic Airliner A (Fills Left Airspace Corridor) */}
              {placed.carA && (
                <PlacedElement 
                  id="carA" 
                  x="25%" 
                  y="50%"
                >
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img 
                      src="/MagnetInteraction/real_airliner_north_south.png" 
                      alt="Airplane A" 
                      style={{ 
                        width: 'clamp(320px, 36vw, 460px)', 
                        height: 'auto', 
                        objectFit: 'contain', 
                        filter: 'drop-shadow(0 22px 42px rgba(0,0,0,0.65))',
                        userSelect: 'none',
                        pointerEvents: 'none'
                      }} 
                    />
                  </div>
                </PlacedElement>
              )}

              {/* Magnetic Airliner B (Fills Right Airspace Corridor) */}
              {placed.carB && (
                <PlacedElement 
                  id="carB" 
                  x="75%" 
                  y="50%"
                >
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img 
                      src="/MagnetInteraction/real_airliner_north_south.png" 
                      alt="Airplane B" 
                      style={{ 
                        width: 'clamp(320px, 36vw, 460px)', 
                        height: 'auto', 
                        objectFit: 'contain', 
                        filter: 'drop-shadow(0 22px 42px rgba(0,0,0,0.65))',
                        userSelect: 'none',
                        pointerEvents: 'none'
                      }} 
                    />
                  </div>
                </PlacedElement>
              )}
            </CanvasDroppable>
          </div>

          <div style={{ 
            background: "linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)",
            border: "1.5px solid #FDE68A",
            borderRadius: "24px",
            padding: "1.25rem 1.4rem",
            boxShadow: "0 6px 24px rgba(217, 119, 6, 0.08)",
            display: "flex", 
            flexDirection: "column", 
            minHeight: 0,
            overflowY: "hidden",
            gap: "0.85rem",
            fontFamily: "system-ui, -apple-system, sans-serif"
          }}>
            {/* Header Area inside right container (Unboxed) */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.2rem 0.2rem 0.35rem 0.2rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#064E3B', lineHeight: 1.3 }}>
                  ✈️ Build Setup
                </h3>
                <span style={{ fontSize: '0.9rem', color: '#047857', fontWeight: 800 }}>
                  Place Magnetic Airplanes
                </span>
              </div>
              <button 
                onClick={handleReset} 
                style={{ 
                  padding: "0.5rem 1rem", 
                  borderRadius: "14px",
                  background: "#FFFFFF",
                  color: "#92400E",
                  border: "1.5px solid #FDE68A",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  fontSize: "0.92rem",
                  fontWeight: 800,
                  flexShrink: 0,
                  transition: "all 0.2s ease"
                }} 
              >
                <RotateCcw size={15} color="#D97706" /> Reset
              </button>
            </div>

            {/* Flight Components List */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: "0 0 0.5rem 0" }}>
                <h4 style={{ color: "#064E3B", margin: 0, fontSize: "1.12rem", fontWeight: 900, display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  📦 Flight Components
                </h4>
                <span style={{
                  background: '#DCFCE7',
                  color: '#15803D',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '10px',
                  border: '1.5px solid #86EFAC'
                }}>
                  Step {placed.carA && placed.carB ? 2 : placed.carA ? 1 : 0} of 2
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, minHeight: 0 }}>
                {STEPS.map((step) => (
                  <TrayItemCard 
                    key={step.id} 
                    step={step} 
                    isPlaced={placed[step.id]} 
                    isUnlocked={isStepUnlocked(step.id)} 
                    renderThumbnail={renderThumbnail} 
                  />
                ))}
              </div>
            </div>

            {/* Proceed to Explore Button */}
            <button 
              onClick={() => {
                onComplete();
                onNext();
              }}
              disabled={!success}
              className={success ? 'gold-glow-btn' : ''}
              style={{ 
                width: '100%',
                padding: '0.95rem 1.4rem', 
                fontSize: '1.08rem', 
                fontWeight: 900, 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.65rem',
                background: success ? undefined : '#F1F5F9',
                color: success ? '#FFFFFF' : '#94A3B8',
                border: success ? undefined : '1.5px solid #CBD5E1',
                cursor: success ? 'pointer' : 'not-allowed',
                transition: 'all 0.25s ease'
              }}
            >
              Proceed to Explore <ArrowRight size={20} color={success ? "#FFFFFF" : "#94A3B8"} />
            </button>
          </div>

        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDraggingId && activeDraggingId.startsWith('tray-') ? (
          <div style={{ opacity: 0.9, pointerEvents: "none" }}>
            <img 
              src="/MagnetInteraction/real_airliner_north_south.png" 
              alt="Dragging Airliner" 
              style={{ 
                width: 'clamp(320px, 36vw, 460px)', 
                height: 'auto', 
                objectFit: 'contain', 
                filter: 'drop-shadow(0 22px 42px rgba(0,0,0,0.75))',
                pointerEvents: 'none'
              }} 
            />
          </div>
        ) : null}
      </DragOverlay>

      {/* Instruction Popups */}
      <AnimatePresence>
        {activePopup !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(2, 6, 23, 0.65)',
              zIndex: 100,
              backdropFilter: 'blur(6px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #FDE68A',
                borderRadius: '24px',
                padding: '2.2rem',
                maxWidth: '440px',
                boxShadow: '0 12px 40px rgba(69, 26, 3, 0.2)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              <div style={{ width: '58px', height: '58px', background: '#FEF3C7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FDE68A' }}>
                <Info size={30} color="#D97706" />
              </div>
              
              <h3 style={{ margin: 0, color: '#064E3B', fontSize: '1.45rem', fontWeight: 900 }}>
                {activePopup === 0 && "Step 1: Left Airspace"}
                {activePopup === 1 && "Step 2: Right Airspace"}
                {activePopup === 2 && "Observation"}
              </h3>
              
              <p style={{ margin: 0, color: '#065F46', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.6 }}>
                {activePopup === 0 && (
                  <>Drag <strong>Airplane A</strong> from the tray into the <strong>Left flight corridor</strong>.</>
                )}
                {activePopup === 1 && (
                  <>Drag <strong>Airplane B</strong> into the <strong>Right parallel flight corridor</strong>.</>
                )}
                {activePopup === 2 && (
                  <>Observe the magnetic poles (Front: North [N], Rear: South [S]) before proceeding to test flight interactions!</>
                )}
              </p>
              
              <button
                onClick={() => setActivePopup(null)}
                className="gold-glow-btn"
                style={{
                  marginTop: '0.5rem',
                  padding: '0.85rem 2.6rem',
                  borderRadius: '25px',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                Got it! <CheckCircle2 size={18} color="#FFFFFF" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DndContext>
  );
}
