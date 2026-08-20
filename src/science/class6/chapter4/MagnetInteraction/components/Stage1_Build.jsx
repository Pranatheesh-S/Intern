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
import SupercarShape from './SupercarShape';

const STEPS = [
  {
    id: "carA",
    name: "Lightning Supercar A (Driver Man)",
    instruction: "Drag Lightning Supercar A (with Driver Man) and drop it onto the track.",
    hint: "Drag Lightning Supercar A onto the race track workspace.",
  },
  {
    id: "carB",
    name: "Nitro Supercar B",
    instruction: "Drag Nitro Supercar B and drop it behind Supercar A.",
    hint: "Drag Nitro Supercar B onto the race track workspace.",
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
        background: isOver ? 'rgba(245, 158, 11, 0.12)' : 'rgba(18, 18, 20, 0.95)',
        border: `2px dashed ${isOver ? '#F59E0B' : '#3F3F46'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 25px rgba(0,0,0,0.6)',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ position: 'absolute', bottom: '40px', width: '100%', height: '2px', background: '#3F3F46' }} />
      {children}
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
        background: isPlaced ? 'rgba(34, 197, 94, 0.15)' : isUnlocked ? '#18181B' : 'rgba(24, 24, 27, 0.4)',
        border: `1.5px solid ${isPlaced ? '#22C55E' : isUnlocked ? '#3F3F46' : 'rgba(63, 63, 70, 0.4)'}`,
        color: '#FAFAFA',
        cursor: isDisabled ? 'not-allowed' : 'grab',
        transition: 'all 0.2s ease',
        position: 'relative',
        fontWeight: 800,
        boxShadow: isUnlocked && !isPlaced ? '0 4px 14px rgba(0, 0, 0, 0.4)' : 'none',
        userSelect: 'none',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ width: '54px', height: '42px', background: '#27272A', border: '1px solid #3F3F46', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: isUnlocked ? 1 : 0.4 }}>
        {renderThumbnail(step.id)}
      </div>
      <div style={{ textAlign: 'left', flex: 1 }}>
        <div style={{ fontSize: '0.92rem', fontWeight: '800', color: isPlaced ? '#86EFAC' : '#FAFAFA' }}>{step.name}</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 700, color: '#A1A1AA' }}>
          {isPlaced ? 'Placed' : isUnlocked ? 'Drag to workspace' : 'Locked'}
        </div>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        {isPlaced ? (
          <CheckCircle2 size={18} style={{ color: '#22C55E' }} />
        ) : !isUnlocked ? (
          <Lock size={16} style={{ color: '#71717A' }} />
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
        left: `${x}px`,
        top: `${y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        zIndex: isDragging ? 100 : 10,
        opacity: isDragging ? 0.75 : 1
      }}
    >
      {children}
    </div>
  );
}

export default function Stage1_Build({ onComplete, onNext }) {
  const [placed, setPlaced] = useState({ carA: false, carB: false });
  const [positions, setPositions] = useState({
    carA: { x: 140, y: 110 },
    carB: { x: 420, y: 110 }
  });
  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const isStepUnlocked = (stepId) => {
    if (stepId === "carA") return true;
    if (stepId === "carB") return placed.carA;
    return false;
  };

  const placeItem = (itemId) => {
    if (!isStepUnlocked(itemId)) {
      setError(`Please drag & drop items in order: 1. Car A (with Driver Man) → 2. Car B.`);
      return;
    }

    const nextPlaced = { ...placed, [itemId]: true };
    setPlaced(nextPlaced);
    setError(null);

    if (nextPlaced.carA && nextPlaced.carB) {
      setSuccess(true);
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveDraggingId(active.id);
    setDragDelta({ x: 0, y: 0 });
    setError(null);
  };

  const handleDragMove = (event) => {
    setDragDelta(event.delta);
  };

  const handleDragEnd = (event) => {
    const { active, delta } = event;
    setActiveDraggingId(null);
    setDragDelta({ x: 0, y: 0 });

    const itemId = active.data.current?.itemId;
    const source = active.data.current?.source;

    if (source === 'tray' && itemId) {
      placeItem(itemId);
    } else if (source === 'placed' && delta && itemId) {
      setPositions(prev => ({
        ...prev,
        [itemId]: {
          x: Math.max(20, Math.min(600, prev[itemId].x + delta.x)),
          y: Math.max(20, Math.min(220, prev[itemId].y + delta.y))
        }
      }));
    }
  };

  const handleReset = () => {
    setPlaced({ carA: false, carB: false });
    setPositions({
      carA: { x: 140, y: 110 },
      carB: { x: 420, y: 110 }
    });
    setError(null);
    setSuccess(false);
  };

  const completedCount = Object.values(placed).filter(Boolean).length;
  const progressPercent = (completedCount / STEPS.length) * 100;
  const activeStep = STEPS.find((s) => !placed[s.id] && isStepUnlocked(s.id));

  const renderThumbnail = (id) => {
    switch (id) {
      case "carA": return <SupercarShape carType="supercarA" width={48} height={28} />;
      case "carB": return <SupercarShape carType="supercarB" width={48} height={28} />;
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
          background: 'rgba(24, 24, 27, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '0.5rem 1rem',
          borderRadius: '16px',
          border: '1.5px solid #3F3F46',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 0.15rem 0', fontSize: '1.35rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '-0.01em' }}>
              Build the Experiment
            </h3>
            <p style={{ margin: 0, color: '#A1A1AA', fontSize: '0.88rem', fontWeight: 700 }}>
              Assemble the setup with Car A (Driver Man) and Car B as shown in Fig. 4.8.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "160px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem", color: "#A1A1AA", fontWeight: 700 }}>
                <span>Progress</span>
                <span style={{ color: "#F59E0B", fontWeight: 800 }}>{Math.round(progressPercent)}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#18181B", border: "1px solid #3F3F46", borderRadius: "4px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  style={{ height: "100%", background: success ? "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)" : "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}
                />
              </div>
            </div>
            <button 
              onClick={handleReset} 
              style={{ 
                padding: "0.55rem 0.95rem", 
                borderRadius: "10px",
                background: "#18181B",
                color: "#FAFAFA",
                border: "1.5px solid #3F3F46",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.85rem",
                fontWeight: 700
              }} 
              title="Reset Assembly"
            >
              <RotateCcw size={16} color="#FAFAFA" /> Reset
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "270px 1fr", gap: "1.25rem", flex: 1, minHeight: 0 }}>
          {/* Left Column: Midnight Carbon 3D Parts Bench Panel */}
          <div style={{ 
            padding: "1.15rem", 
            display: "flex", 
            flexDirection: "column", 
            gap: "1rem", 
            background: "rgba(24, 24, 27, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1.5px solid #3F3F46",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
            overflowY: "auto",
            color: "#FAFAFA"
          }}>
            <h4 style={{ margin: 0, borderBottom: "1.5px solid #3F3F46", paddingBottom: "0.6rem", color: "#F59E0B", fontWeight: 800, fontSize: "1.15rem" }}>
              🧊 3D Parts Bench
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", flex: 1 }}>
              {STEPS.map((step) => {
                const isPlaced = placed[step.id];
                const isUnlocked = isStepUnlocked(step.id);

                return (
                  <TrayItemCard 
                    key={step.id}
                    step={step}
                    isPlaced={isPlaced}
                    isUnlocked={isUnlocked}
                    renderThumbnail={renderThumbnail}
                  />
                );
              })}
            </div>
          </div>

          {/* Right Column: Drag-and-Drop Workspace Canvas */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minHeight: 0 }}>
            <div style={{ 
              flex: 1, 
              padding: "1rem 1.25rem", 
              display: "flex", 
              flexDirection: "column",
              background: "rgba(18, 18, 20, 0.95)",
              border: "1.5px solid #3F3F46",
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
              minHeight: 0,
              overflow: "hidden"
            }}>
              
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{ background: "rgba(239, 68, 68, 0.2)", color: "#FCA5A5", padding: "0.55rem 0.85rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem", fontSize: "0.88rem", border: "1.5px solid #EF4444", fontWeight: 700 }}
                  >
                    <AlertCircle size={18} color="#EF4444" /> {error}
                  </motion.div>
                )}
                {activeStep && !error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ background: "#18181B", color: "#F59E0B", padding: "0.55rem 0.85rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem", fontSize: "0.88rem", border: "1.5px solid #3F3F46", fontWeight: 700 }}
                  >
                    <Info size={18} color="#F59E0B" /> {activeStep.hint}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Full Workspace Canvas */}
              <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
                <CanvasDroppable>
                  {/* Lightning Supercar A with Driver Man */}
                  {placed.carA && (
                    <PlacedElement 
                      id="carA" 
                      x={positions.carA.x + (activeDraggingId === 'placed-carA' ? dragDelta.x : 0)} 
                      y={positions.carA.y + (activeDraggingId === 'placed-carA' ? dragDelta.y : 0)}
                    >
                      <SupercarShape carType="supercarA" poleRight="S" width={230} height={100} />
                    </PlacedElement>
                  )}

                  {/* Nitro Supercar B */}
                  {placed.carB && (
                    <PlacedElement 
                      id="carB" 
                      x={positions.carB.x + (activeDraggingId === 'placed-carB' ? dragDelta.x : 0)} 
                      y={positions.carB.y + (activeDraggingId === 'placed-carB' ? dragDelta.y : 0)}
                    >
                      <SupercarShape carType="supercarB" poleRight="N" width={230} height={100} />
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
                background: 'rgba(9, 9, 11, 0.85)',
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
                  background: '#18181B',
                  border: '1.5px solid #3F3F46',
                  borderRadius: '24px',
                  padding: '2.25rem 2.75rem',
                  maxWidth: '520px',
                  width: '90%',
                  textAlign: 'center',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 25px rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.1rem'
                }}
              >
                <h2 style={{ margin: 0, color: '#FAFAFA', fontSize: '1.8rem', fontWeight: 800 }}>
                  Setup Complete! 🎉
                </h2>

                <p style={{ margin: 0, color: '#A1A1AA', fontSize: '1.1rem', lineHeight: '1.5', fontWeight: 600 }}>
                  Excellent! Car A (with Driver Man) and Car B are placed and ready for testing attraction and repulsion.
                </p>

                <button 
                  onClick={() => {
                    onComplete();
                    onNext();
                  }} 
                  style={{ 
                    marginTop: '0.5rem',
                    padding: '1.1rem 3rem', 
                    fontSize: '1.15rem', 
                    fontWeight: 800, 
                    borderRadius: '40px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: '#000000',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(245, 158, 11, 0.45)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  Proceed to Explore <ArrowRight size={22} color="#000000" />
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
              <SupercarShape carType="supercarA" poleRight="S" width={230} height={100} />
            )}
            {activeDraggingId.includes("carB") && (
              <SupercarShape carType="supercarB" poleRight="N" width={230} height={100} />
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
