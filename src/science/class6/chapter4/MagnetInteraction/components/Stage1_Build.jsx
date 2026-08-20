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

const STEPS = [
  {
    id: "pencils",
    name: "3 Pencils",
    instruction: "Drag 3 pencils and place them parallel to each other on the table.",
    hint: "Place the pencils horizontally on the workspace to act as rollers.",
  },
  {
    id: "magnetA",
    name: "Magnet A",
    instruction: "Place one bar magnet over the pencils.",
    hint: "Place Magnet A resting horizontally across the pencils.",
  },
  {
    id: "magnetB",
    name: "Magnet B",
    instruction: "Bring one end of Magnet B near the end of Magnet A.",
    hint: "Place Magnet B to the right of Magnet A on the workspace.",
  }
];

function CanvasDroppable({ children, onClick }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'canvas-droppable' });
  return (
    <div 
      ref={setNodeRef}
      onClick={onClick}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: isOver ? '#f0f9ff' : '#f8fafc',
        border: `2px dashed ${isOver ? '#10b981' : '#cbd5e1'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
    >
      <div style={{ position: 'absolute', bottom: '40px', width: '100%', height: '2px', background: '#cbd5e1' }} />
      {children}
    </div>
  );
}

function TrayItemCard({ step, isPlaced, isUnlocked, isSelected, onClick, renderThumbnailSVG }) {
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
      onClick={onClick}
      style={{
        opacity: isDragging ? 0.4 : 1,
        touchAction: 'none',
        width: '100%',
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        padding: '0.85rem 1rem', 
        borderRadius: '14px',
        background: isPlaced ? 'rgba(255, 255, 255, 0.95)' : isSelected ? '#ffffff' : isUnlocked ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.4)',
        border: `2px solid ${isPlaced ? '#047857' : isSelected ? '#059669' : isUnlocked ? '#059669' : 'rgba(0, 0, 0, 0.2)'}`,
        color: '#000000',
        cursor: isDisabled ? 'not-allowed' : 'grab',
        transition: 'all 0.2s ease',
        position: 'relative',
        fontWeight: 800,
        boxShadow: isSelected ? '0 4px 14px rgba(0, 0, 0, 0.15)' : 'none',
        userSelect: 'none',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ width: '40px', height: '40px', background: 'rgba(0, 0, 0, 0.08)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: isUnlocked ? 1 : 0.4 }}>
        {renderThumbnailSVG(step.id)}
      </div>
      <div style={{ textAlign: 'left', flex: 1 }}>
        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#000000' }}>{step.name}</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 700, color: '#1e293b' }}>
          {isPlaced ? 'Placed' : isUnlocked ? 'Ready to drag/click' : 'Locked'}
        </div>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        {isPlaced ? (
          <CheckCircle2 size={18} style={{ color: '#047857' }} />
        ) : !isUnlocked ? (
          <Lock size={16} style={{ color: '#475569' }} />
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
  const [placed, setPlaced] = useState({ pencils: false, magnetA: false, magnetB: false });
  const [positions, setPositions] = useState({
    pencils: { x: 220, y: 140 },
    magnetA: { x: 200, y: 110 },
    magnetB: { x: 380, y: 110 }
  });
  const [selectedItemId, setSelectedItemId] = useState("pencils");
  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const isStepUnlocked = (stepId) => {
    if (stepId === "pencils") return true;
    if (stepId === "magnetA") return placed.pencils;
    if (stepId === "magnetB") return placed.magnetA;
    return false;
  };

  const handleSelectTrayItem = (stepId) => {
    if (!placed[stepId] && isStepUnlocked(stepId)) {
      setSelectedItemId(stepId);
    }
  };

  const placeItem = (itemId) => {
    if (!isStepUnlocked(itemId)) {
      setError(`Please complete the previous step first!`);
      return;
    }

    const nextPlaced = { ...placed, [itemId]: true };
    setPlaced(nextPlaced);

    const remainingStep = STEPS.find(s => !nextPlaced[s.id] && isStepUnlocked(s.id));
    if (remainingStep) {
      setSelectedItemId(remainingStep.id);
    }

    if (nextPlaced.pencils && nextPlaced.magnetA && nextPlaced.magnetB) {
      setSuccess(true);
    }
  };

  const handleCanvasClick = () => {
    if (selectedItemId && !placed[selectedItemId] && isStepUnlocked(selectedItemId)) {
      placeItem(selectedItemId);
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const itemId = active.data.current?.itemId;
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

    if (source === 'tray') {
      placeItem(itemId);
    } else if (source === 'placed' && delta) {
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
    setPlaced({ pencils: false, magnetA: false, magnetB: false });
    setPositions({
      pencils: { x: 220, y: 140 },
      magnetA: { x: 200, y: 110 },
      magnetB: { x: 380, y: 110 }
    });
    setSelectedItemId("pencils");
    setError(null);
    setSuccess(false);
  };

  const completedCount = Object.values(placed).filter(Boolean).length;
  const progressPercent = (completedCount / STEPS.length) * 100;
  const activeStep = STEPS.find((s) => s.id === selectedItemId);

  const renderThumbnailSVG = (id) => {
    switch (id) {
      case "pencils": return (
        <svg viewBox="-5 -5 60 50" width="28" height="28">
          <g transform="translate(0, 5)">
            {[...Array(6)].map((_, i) => (
              <g key={i} transform={`translate(${i * 8}, 0)`}>
                <polygon points="0,5 4,5 2,0" fill="#e6b981" />
                <polygon points="1.5,1.5 2.5,1.5 2,0" fill="#334155" />
                <rect x="0" y="5" width="4" height="22" fill="#fde047" />
                <rect x="0" y="27" width="4" height="4" fill="#f472b6" rx="1" />
              </g>
            ))}
          </g>
        </svg>
      );
      case "magnetA": return (
        <svg viewBox="0 0 100 40" width="28" height="28">
          <image href="/Shared/bar_magnet.png" x="30" y="-30" width="40" height="100" transform="rotate(-90 50 20)" />
        </svg>
      );
      case "magnetB": return (
        <svg viewBox="0 0 100 40" width="28" height="28">
          <image href="/Shared/bar_magnet.png" x="30" y="-30" width="40" height="100" transform="rotate(90 50 20)" />
        </svg>
      );
      default: return null;
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div style={{ 
        padding: '1.25rem 1.75rem', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '1rem', 
        height: '100%', 
        minHeight: 0, 
        overflow: 'hidden', 
        boxSizing: 'border-box',
        background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #0f172a 100%)',
        border: '1.5px solid #1e40af',
        borderRadius: '20px',
        boxShadow: '0 12px 35px rgba(11, 19, 43, 0.4)',
        position: 'relative'
      }}>
        
        {/* Top Header Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "1.25rem", flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, color: "#ffffff", fontSize: "1.45rem", fontWeight: 800 }}>Build the Experiment</h3>
            <span style={{ fontSize: "0.98rem", color: "#94a3b8", fontWeight: 600 }}>
              Assemble the setup as shown in Fig. 4.8.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "160px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem", color: "#cbd5e1", fontWeight: 700 }}>
                <span>Progress</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div style={{ width: "100%", height: "7px", background: "rgba(255, 255, 255, 0.15)", borderRadius: "4px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  style={{ height: "100%", background: success ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #ff7700 0%, #ea580c 100%)" }}
                />
              </div>
            </div>
            <button 
              onClick={handleReset} 
              style={{ 
                padding: "0.55rem", 
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ff7700 0%, #ea580c 100%)",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(255, 119, 0, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }} 
              title="Reset Assembly"
            >
              <RotateCcw size={16} color="#ffffff" />
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "270px 1fr", gap: "1.25rem", flex: 1, minHeight: 0 }}>
          {/* Left Column: Light Green 3D Parts Bench Panel with Black Text */}
          <div style={{ 
            padding: "1.25rem", 
            display: "flex", 
            flexDirection: "column", 
            gap: "1.25rem", 
            background: "linear-gradient(145deg, #a7f3d0 0%, #6ee7b7 100%)",
            border: "2px solid #059669",
            borderRadius: "16px",
            boxShadow: "0 8px 25px rgba(5, 150, 105, 0.25)",
            overflowY: "auto",
            color: "#000000"
          }}>
            <h4 style={{ margin: 0, borderBottom: "1.5px solid #059669", paddingBottom: "0.6rem", color: "#000000", fontWeight: 800, fontSize: "1.15rem" }}>
              🧊 3D Parts Bench
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", flex: 1 }}>
              {STEPS.map((step) => {
                const isPlaced = placed[step.id];
                const isUnlocked = isStepUnlocked(step.id);
                const isSelected = selectedItemId === step.id;

                return (
                  <TrayItemCard 
                    key={step.id}
                    step={step}
                    isPlaced={isPlaced}
                    isUnlocked={isUnlocked}
                    isSelected={isSelected}
                    onClick={() => handleSelectTrayItem(step.id)}
                    renderThumbnailSVG={renderThumbnailSVG}
                  />
                );
              })}
            </div>
          </div>

          {/* Right Column: Drag-and-Drop Workspace */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minHeight: 0 }}>
            <div style={{ 
              flex: 1, 
              padding: "1.1rem 1.35rem", 
              display: "flex", 
              flexDirection: "column",
              background: "#ffffff",
              border: "2px solid #2563eb",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
              minHeight: 0,
              overflow: "hidden"
            }}>
              
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{ background: "#fee2e2", color: "#991b1b", padding: "0.6rem 0.85rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem", fontSize: "0.88rem", border: "1.5px solid #f87171", fontWeight: 700 }}
                  >
                    <AlertCircle size={18} color="#991b1b" /> {error}
                  </motion.div>
                )}
                {activeStep && !error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ background: "#eff6ff", color: "#1e40af", padding: "0.6rem 0.85rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem", fontSize: "0.88rem", border: "1.5px solid #93c5fd", fontWeight: 700 }}
                  >
                    <Info size={18} color="#2563eb" /> {activeStep.hint}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Full Workspace Canvas */}
              <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
                <CanvasDroppable onClick={handleCanvasClick}>
                  {/* Pencils */}
                  {placed.pencils && (
                    <PlacedElement 
                      id="pencils" 
                      x={positions.pencils.x + (activeDraggingId === 'placed-pencils' ? dragDelta.x : 0)} 
                      y={positions.pencils.y + (activeDraggingId === 'placed-pencils' ? dragDelta.y : 0)}
                    >
                      <div style={{ filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))" }}>
                        <img src="/MagnetInteraction/pencils.png" style={{ width: "100px", height: "130px", objectFit: "contain", userSelect: "none" }} draggable="false" alt="Pencils" />
                      </div>
                    </PlacedElement>
                  )}

                  {/* Magnet A */}
                  {placed.magnetA && (
                    <PlacedElement 
                      id="magnetA" 
                      x={positions.magnetA.x + (activeDraggingId === 'placed-magnetA' ? dragDelta.x : 0)} 
                      y={positions.magnetA.y + (activeDraggingId === 'placed-magnetA' ? dragDelta.y : 0)}
                    >
                      <div style={{ filter: "drop-shadow(0px 8px 10px rgba(0,0,0,0.4))", position: "relative" }}>
                        <div style={{ position: "absolute", top: "-22px", left: "50%", transform: "translateX(-50%)", fontSize: "14px", fontWeight: "bold", color: "#1e293b", whiteSpace: "nowrap" }}>Magnet A</div>
                        <img src="/Shared/bar_magnet.png" style={{ width: "40px", height: "120px", transform: "rotate(-90deg)", objectFit: "fill", userSelect: "none" }} draggable="false" alt="Magnet A" />
                      </div>
                    </PlacedElement>
                  )}

                  {/* Magnet B */}
                  {placed.magnetB && (
                    <PlacedElement 
                      id="magnetB" 
                      x={positions.magnetB.x + (activeDraggingId === 'placed-magnetB' ? dragDelta.x : 0)} 
                      y={positions.magnetB.y + (activeDraggingId === 'placed-magnetB' ? dragDelta.y : 0)}
                    >
                      <div style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))", position: "relative" }}>
                        <div style={{ position: "absolute", top: "-22px", left: "50%", transform: "translateX(-50%)", fontSize: "14px", fontWeight: "bold", color: "#1e293b", whiteSpace: "nowrap" }}>Magnet B</div>
                        <img src="/Shared/bar_magnet.png" style={{ width: "40px", height: "120px", transform: "rotate(90deg)", objectFit: "fill", userSelect: "none" }} draggable="false" alt="Magnet B" />
                      </div>
                    </PlacedElement>
                  )}
                </CanvasDroppable>
              </div>

            </div>
          </div>
        </div>

        {/* Success Modal Pop-up Overlay matching Activity 4.3 standard */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(6px)',
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
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '30px',
                  padding: '2.5rem 3rem',
                  maxWidth: '520px',
                  width: '90%',
                  textAlign: 'center',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.25rem'
                }}
              >
                <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.8rem', fontWeight: 800 }}>
                  Setup Complete! 🎉
                </h2>

                <p style={{ margin: 0, color: '#475569', fontSize: '1.2rem', lineHeight: '1.5', fontWeight: 600 }}>
                  Excellent! Magnet A is correctly placed across the pencils, and Magnet B is ready for interaction.
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
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                >
                  Proceed to Prediction <ArrowRight size={22} color="#ffffff" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDraggingId && activeDraggingId.startsWith('tray-') ? (
          <div style={{ opacity: 0.85, pointerEvents: "none" }}>
            {activeDraggingId.includes("pencils") && (
              <div style={{ display: "flex", gap: "4px" }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ width: "6px", height: "80px", background: "linear-gradient(90deg, #fde047, #ca8a04)", borderRadius: "3px" }} />
                ))}
              </div>
            )}
            {activeDraggingId.includes("magnetA") && (
              <div style={{ width: "120px", height: "24px", position: "relative" }}>
                <img src="/Shared/bar_magnet.png" style={{ position: "absolute", top: "50%", left: "50%", width: "24px", height: "120px", transform: "translate(-50%, -50%) rotate(-90deg)", objectFit: "fill", borderRadius: "4px" }} alt="" />
              </div>
            )}
            {activeDraggingId.includes("magnetB") && (
              <div style={{ width: "80px", height: "24px", position: "relative" }}>
                <img src="/Shared/bar_magnet.png" style={{ position: "absolute", top: "50%", left: "50%", width: "24px", height: "80px", transform: "translate(-50%, -50%) rotate(90deg)", objectFit: "fill", borderRadius: "4px" }} alt="" />
              </div>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
