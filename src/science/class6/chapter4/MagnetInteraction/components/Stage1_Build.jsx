import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, RotateCcw, Info, ArrowRight, Lock, AlertCircle } from 'lucide-react';
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
import FlightShape from './FlightShape';

const STEPS = [
  {
    id: "carA",
    name: "Magnetic Airplane A (Left Lane)",
    instruction: "Drag Airplane A (Left Wing: North, Right Wing: South) onto the left flight corridor.",
    hint: "Place Airplane A in the left airspace lane.",
  },
  {
    id: "carB",
    name: "Magnetic Airplane B (Right Lane)",
    instruction: "Drag Airplane B alongside Airplane A into the right flight corridor to test magnetic pole interactions.",
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
        background: isOver ? 'rgba(217, 119, 6, 0.15)' : '#0C4A6E',
        border: `2px dashed ${isOver ? '#D97706' : '#A7F3D0'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 20px rgba(6, 78, 59, 0.04)',
        transition: 'all 0.2s ease'
      }}
    >
      <img 
        src="/MagnetInteraction/aerial_clouds_bg.jpg" 
        alt="Aerial Clouds Sky" 
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.05) contrast(0.95)', zIndex: 1 }} 
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(2, 132, 199, 0.15)', zIndex: 1, pointerEvents: 'none' }} />
      
      {/* Center Dashed Corridor Beam */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        left: '50%', 
        width: '2px', 
        borderLeft: '2px dashed rgba(255, 255, 255, 0.5)', 
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
        alignItems: 'center', 
        gap: '1rem', 
        padding: '0.85rem 1rem', 
        borderRadius: '14px',
        background: isPlaced ? '#DCFCE7' : isUnlocked ? '#FFFFFF' : '#F8FAFC',
        border: `1.5px solid ${isPlaced ? '#16A34A' : isUnlocked ? '#A7F3D0' : '#E2E8F0'}`,
        color: '#1E293B',
        cursor: isDisabled ? 'not-allowed' : 'grab',
        transition: 'all 0.2s ease',
        position: 'relative',
        fontWeight: 800,
        boxShadow: isUnlocked && !isPlaced ? '0 2px 8px rgba(6, 78, 59, 0.04)' : 'none',
        userSelect: 'none',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ width: '54px', height: '42px', background: '#F0FDF4', border: '1.5px solid #A7F3D0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: isUnlocked ? 1 : 0.4 }}>
        {renderThumbnail(step.id)}
      </div>
      <div style={{ textAlign: 'left', flex: 1 }}>
        <div style={{ fontSize: '0.92rem', fontWeight: '900', color: isPlaced ? '#065F46' : '#064E3B' }}>{step.name}</div>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isPlaced ? '#16A34A' : '#475569' }}>
          {isPlaced ? 'Placed' : isUnlocked ? 'Drag to sky corridor' : 'Locked'}
        </div>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        {isPlaced ? (
          <CheckCircle2 size={18} style={{ color: '#16A34A' }} />
        ) : !isUnlocked ? (
          <Lock size={16} style={{ color: '#94A3B8' }} />
        ) : null}
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
        zIndex: isDragging ? 50 : 10
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
    carA: { x: 120, y: 80 },
    carB: { x: 380, y: 80 }
  });

  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [success, setSuccess] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  const isStepUnlocked = (stepId) => {
    if (stepId === "carA") return true;
    if (stepId === "carB") return placed.carA;
    return false;
  };

  const handleDragStart = (event) => {
    setActiveDraggingId(event.active.id);
    setDragDelta({ x: 0, y: 0 });
  };

  const handleDragMove = (event) => {
    setDragDelta({ x: event.delta.x, y: event.delta.y });
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
          x: Math.max(20, Math.min(600, prev[elementId].x + event.delta.x)),
          y: Math.max(20, Math.min(300, prev[elementId].y + event.delta.y))
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
      carA: { x: 120, y: 80 },
      carB: { x: 380, y: 80 }
    });
    setSuccess(false);
  };

  const completedCount = Object.values(placed).filter(Boolean).length;
  const progressPercent = (completedCount / STEPS.length) * 100;
  const activeStep = STEPS.find((s) => !placed[s.id] && isStepUnlocked(s.id));

  const renderThumbnail = (id) => {
    switch (id) {
      case "carA": return <FlightShape flightType="flightA" poleLeft="N" width={38} height={42} />;
      case "carB": return <FlightShape flightType="flightB" poleLeft="S" width={38} height={42} />;
      default: return null;
    }
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
        background: 'transparent'
      }}>
      
        {/* Top Header Container */}
        <div style={{ 
          width: '100%',
          textAlign: 'center',
          background: '#FFFFFF',
          padding: '0.65rem 1.25rem',
          borderRadius: '20px',
          border: '1.5px solid #A7F3D0',
          boxShadow: '0 4px 16px rgba(6, 78, 59, 0.06)',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 0.15rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#064E3B', letterSpacing: '-0.01em' }}>
              Build the Experiment: Magnetic Airplanes Setup
            </h3>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.88rem', fontWeight: 600 }}>
              Position Airplane A and Airplane B into parallel flight corridors to test magnetic wing attraction & repulsion.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "160px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem", color: "#475569", fontWeight: 700 }}>
                <span>Progress</span>
                <span style={{ color: "#D97706", fontWeight: 900 }}>{Math.round(progressPercent)}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#E2E8F0", borderRadius: "4px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  style={{ height: "100%", background: success ? "linear-gradient(135deg, #16A34A 0%, #15803D 100%)" : "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}
                />
              </div>
            </div>
            <button 
              onClick={handleReset} 
              style={{ 
                padding: "0.55rem 0.95rem", 
                borderRadius: "12px",
                background: "#FFFFFF",
                color: "#1E293B",
                border: "1.5px solid #CBD5E1",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.85rem",
                fontWeight: 800
              }} 
            >
              <RotateCcw size={16} color="#D97706" /> Reset
            </button>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '320px 1fr', 
          gap: '1.25rem', 
          flex: 1, 
          minHeight: 0,
          boxSizing: 'border-box'
        }}>
          {/* Left Column: Interactive Parts Tray */}
          <div style={{ 
            background: "#FFFFFF",
            border: "1.5px solid #A7F3D0",
            borderRadius: "20px",
            padding: "1rem 1.25rem",
            boxShadow: "0 6px 20px rgba(6, 78, 59, 0.06)",
            display: "flex", 
            flexDirection: "column", 
            minHeight: 0,
            overflowY: "auto"
          }}>
            <h4 style={{ color: "#064E3B", margin: "0 0 0.85rem 0", fontSize: "1.05rem", fontWeight: 900, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              📦 Flight Components
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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

            {/* Educational Theory Callout Box */}
            <div style={{ 
              marginTop: "auto", 
              padding: "0.85rem", 
              background: "#F0FDF4", 
              border: "1.5px solid #A7F3D0", 
              borderRadius: "14px",
              boxShadow: "0 2px 8px rgba(6, 78, 59, 0.04)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.35rem" }}>
                <Info size={18} color="#D97706" />
                <span style={{ fontSize: "0.88rem", fontWeight: 900, color: "#064E3B" }}>Core Scientific Law</span>
              </div>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#334155", lineHeight: "1.45", fontWeight: 600 }}>
                • <strong>Unlike Poles (N + S):</strong> Attract and pull aircraft closer together.<br />
                • <strong>Like Poles (N + N / S + S):</strong> Repel and push aircraft further apart!
              </p>
            </div>
          </div>

          {/* Right Column: Active Interactive Canvas */}
          <div style={{ 
            background: "#FFFFFF",
            border: "1.5px solid #A7F3D0",
            borderRadius: "20px",
            padding: "1rem 1.25rem",
            boxShadow: "0 6px 20px rgba(6, 78, 59, 0.06)",
            display: "flex", 
            flexDirection: "column", 
            minHeight: 0,
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.65rem' }}>
              
              {/* Dynamic Guidance Banner */}
              <AnimatePresence mode="wait">
                {activeStep ? (
                  <motion.div
                    key={activeStep.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{ 
                      padding: "0.65rem 1.15rem", 
                      background: "#FEF3C7", 
                      border: "1.5px solid #F59E0B", 
                      borderRadius: "14px",
                      color: "#92400E",
                      fontSize: "0.88rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      boxShadow: "0 2px 8px rgba(217, 119, 6, 0.08)"
                    }}
                  >
                    <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0 }} />
                    <span><strong>Step {STEPS.findIndex(s => s.id === activeStep.id) + 1}:</strong> {activeStep.instruction}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      padding: "0.65rem 1.15rem", 
                      background: "#DCFCE7", 
                      border: "1.5px solid #16A34A", 
                      borderRadius: "14px",
                      color: "#065F46",
                      fontSize: "0.88rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      boxShadow: "0 2px 8px rgba(22, 163, 74, 0.08)"
                    }}
                  >
                    <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0 }} />
                    <span>All airplanes positioned in parallel flight corridors! Proceed to explore attraction and repulsion in flight.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Full Workspace Canvas */}
              <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
                <CanvasDroppable>
                  {/* Lightning Jet Flight A */}
                  {placed.carA && (
                    <PlacedElement 
                      id="carA" 
                      x={positions.carA.x + (activeDraggingId === 'placed-carA' ? dragDelta.x : 0)} 
                      y={positions.carA.y + (activeDraggingId === 'placed-carA' ? dragDelta.y : 0)}
                    >
                      <FlightShape flightType="flightA" poleLeft="N" width={180} height={210} />
                    </PlacedElement>
                  )}

                  {/* Nitro Jet Flight B */}
                  {placed.carB && (
                    <PlacedElement 
                      id="carB" 
                      x={positions.carB.x + (activeDraggingId === 'placed-carB' ? dragDelta.x : 0)} 
                      y={positions.carB.y + (activeDraggingId === 'placed-carB' ? dragDelta.y : 0)}
                    >
                      <FlightShape flightType="flightB" poleLeft="S" width={180} height={210} />
                    </PlacedElement>
                  )}
                </CanvasDroppable>
              </div>

            </div>
          </div>
        </div>

        {/* Success Modal Pop-up Overlay */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(6, 78, 59, 0.45)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100
              }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #A7F3D0',
                  borderRadius: '24px',
                  padding: '2.25rem 2.75rem',
                  maxWidth: '540px',
                  width: '90%',
                  textAlign: 'center',
                  boxShadow: '0 12px 40px rgba(6, 78, 59, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.1rem'
                }}
              >
                <h2 style={{ margin: 0, color: '#064E3B', fontSize: '1.8rem', fontWeight: 900 }}>
                  Setup Complete! 🎉
                </h2>

                <p style={{ margin: 0, color: '#334155', fontSize: '1.05rem', lineHeight: '1.5', fontWeight: 700 }}>
                  Airplane A and Airplane B are positioned in parallel flight corridors with their magnetic wings. Ready to test unlike pole attraction and like pole repulsion in flight!
                </p>

                <button 
                  onClick={() => {
                    onComplete();
                    onNext();
                  }} 
                  style={{ 
                    marginTop: '0.5rem',
                    padding: '0.85rem 2.5rem', 
                    fontSize: '1.05rem', 
                    fontWeight: 900, 
                    borderRadius: '25px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  Proceed to Explore <ArrowRight size={20} color="#FFFFFF" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDraggingId && activeDraggingId.startsWith('tray-') ? (
          <div style={{ opacity: 0.9, pointerEvents: "none" }}>
            {activeDraggingId.includes("carA") && (
              <FlightShape flightType="flightA" poleLeft="N" width={180} height={210} />
            )}
            {activeDraggingId.includes("carB") && (
              <FlightShape flightType="flightB" poleLeft="S" width={180} height={210} />
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
