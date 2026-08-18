import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, RotateCcw, Info, ArrowRight, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { 
  DndContext, 
  useDraggable, 
  useDroppable, 
  DragOverlay, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';

const STEPS = [
  {
    id: "pencils",
    name: "3 Pencils",
    instruction: "Drag 3 pencils and place them parallel to each other on the table.",
    hint: "Place the pencils horizontally on the workspace to act as rollers.",
    dropTarget: { minX: 100, maxX: 500, minY: 150, maxY: 300 }
  },
  {
    id: "magnetA",
    name: "Magnet A",
    instruction: "Place one bar magnet over the pencils.",
    hint: "Place Magnet A resting horizontally across the pencils.",
    dropTarget: { minX: 150, maxX: 450, minY: 100, maxY: 250 }
  },
  {
    id: "magnetB",
    name: "Magnet B",
    instruction: "Bring one end of Magnet B near the end of Magnet A.",
    hint: "Place Magnet B to the right of Magnet A on the workspace.",
    dropTarget: { minX: 350, maxX: 650, minY: 100, maxY: 250 }
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
        background: isOver ? '#f0f9ff' : '#f8fafc',
        border: `2px dashed ${isOver ? '#2563eb' : '#cbd5e1'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ position: 'absolute', bottom: '40px', width: '100%', height: '2px', background: '#cbd5e1' }} />
      <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {children}
      </svg>
    </div>
  );
}

function TrayDraggable({ id, disabled, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `tray-${id}`,
    disabled: disabled,
    data: { source: 'tray', itemId: id }
  });

  return (
    <div 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes}
      style={{ opacity: isDragging ? 0.4 : 1, touchAction: 'none' }}
    >
      {children}
    </div>
  );
}

function DraggableSVGGroup({ id, isDraggable, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `placed-${id}`,
    disabled: !isDraggable,
    data: { source: 'placed', itemId: id }
  });

  return (
    <g 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes}
      style={{ cursor: isDraggable ? 'grab' : 'default', opacity: isDragging ? 0.5 : 1 }}
    >
      {children}
    </g>
  );
}

export default function Stage1_Build({ onComplete, onNext }) {
  const [placed, setPlaced] = useState({ pencils: false, magnetA: false, magnetB: false });
  const [positions, setPositions] = useState({
    pencils: { x: 260, y: 160 },
    magnetA: { x: 260, y: 130 },
    magnetB: { x: 440, y: 130 }
  });
  const [selectedItemId, setSelectedItemId] = useState("pencils");
  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
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

  const handleDragStart = (event) => {
    const { active } = event;
    const itemId = active.data.current?.itemId;
    setActiveDraggingId(itemId);
    setError(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDraggingId(null);

    if (!over || over.id !== 'canvas-droppable') return;

    const itemId = active.data.current?.itemId;
    const source = active.data.current?.source;

    if (source === 'tray') {
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
    } else if (source === 'placed') {
      const delta = event.delta;
      setPositions(prev => ({
        ...prev,
        [itemId]: {
          x: prev[itemId].x + delta.x,
          y: prev[itemId].y + delta.y
        }
      }));
    }
  };

  const handleReset = () => {
    setPlaced({ pencils: false, magnetA: false, magnetB: false });
    setPositions({
      pencils: { x: 260, y: 160 },
      magnetA: { x: 260, y: 130 },
      magnetB: { x: 440, y: 130 }
    });
    setSelectedItemId("pencils");
    setError(null);
    setSuccess(false);
  };

  const completedCount = Object.values(placed).filter(Boolean).length;
  const progressPercent = (completedCount / STEPS.length) * 100;
  const activeStep = STEPS.find((s) => s.id === selectedItemId);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
        
        {/* Top Header Row: Title & Subtitle side-by-side on left */}
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

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "1.25rem", flex: 1, minHeight: 0 }}>
          {/* Left Column: 3D Parts Bench (Space freed by removing 3D Inspector) */}
          <div style={{ 
            padding: "1.25rem", 
            display: "flex", 
            flexDirection: "column", 
            gap: "1.25rem", 
            background: "#ffffff",
            border: "2px solid #2563eb",
            borderRadius: "16px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            overflowY: "auto"
          }}>
            <h4 style={{ margin: 0, borderBottom: "1.5px solid #e2e8f0", paddingBottom: "0.6rem", color: "#1e3a8a", fontWeight: 800, fontSize: "1.15rem" }}>
              🧊 3D Parts Bench
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", flex: 1 }}>
              {STEPS.map((step) => {
                const isPlaced = placed[step.id];
                const isUnlocked = isStepUnlocked(step.id);
                const isSelected = selectedItemId === step.id;
                const isDisabled = isPlaced || !isUnlocked;

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
                  <TrayDraggable key={step.id} id={step.id} disabled={isDisabled}>
                    <button
                      key={step.id}
                      onClick={() => handleSelectTrayItem(step.id)}
                      disabled={isDisabled}
                      style={{
                        width: "100%",
                        display: "flex", 
                        alignItems: "center", 
                        gap: "1rem", 
                        padding: "0.85rem 1rem", 
                        borderRadius: "14px",
                        background: isPlaced ? "rgba(16, 185, 129, 0.1)" : isSelected ? "linear-gradient(135deg, #ff7700 0%, #ea580c 100%)" : isUnlocked ? "#f8fafc" : "#f1f5f9",
                        border: `2px solid ${isPlaced ? "#10b981" : isSelected ? "#ea580c" : isUnlocked ? "#3b82f6" : "#cbd5e1"}`,
                        color: isPlaced ? "#065f46" : isSelected ? "#ffffff" : isUnlocked ? "#1e3a8a" : "#94a3b8",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        position: "relative",
                        fontWeight: 700,
                        boxShadow: isSelected ? "0 4px 14px rgba(255, 119, 0, 0.4)" : "none"
                      }}
                    >
                      <div style={{ width: "40px", height: "40px", background: "rgba(0,0,0,0.05)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: isUnlocked ? 1 : 0.3 }}>
                        {renderThumbnailSVG(step.id)}
                      </div>
                      <div style={{ textAlign: "left", flex: 1 }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: "800" }}>{step.name}</div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.8, fontWeight: 500 }}>
                          {isPlaced ? "Placed" : isUnlocked ? "Ready to drag" : "Locked"}
                        </div>
                      </div>
                      <div style={{ marginLeft: "auto" }}>
                        {isPlaced ? (
                          <CheckCircle2 size={18} style={{ color: "#10b981" }} />
                        ) : !isUnlocked ? (
                          <Lock size={16} style={{ color: "#94a3b8" }} />
                        ) : null}
                      </div>
                    </button>
                  </TrayDraggable>
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
                <CanvasDroppable>
                  {/* Pencils SVG */}
                  {placed.pencils && (
                    <DraggableSVGGroup id="pencils" isDraggable={true}>
                      <g transform={`translate(${positions.pencils.x - 40}, ${positions.pencils.y - 60})`} filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.3))">
                        <image href="/MagnetInteraction/pencils.png" x="0" y="0" width="84" height="120" preserveAspectRatio="xMidYMid meet" />
                      </g>
                    </DraggableSVGGroup>
                  )}

                  {/* Magnet A SVG */}
                  {placed.magnetA && (
                    <DraggableSVGGroup id="magnetA" isDraggable={true}>
                      <g transform={`translate(${positions.magnetA.x - 60}, ${positions.magnetA.y - 20})`} filter="drop-shadow(0px 8px 10px rgba(0,0,0,0.4))">
                        <text x="60" y="-10" fill="#1e293b" fontSize="14" fontWeight="bold" textAnchor="middle">Magnet A</text>
                        <image href="/Shared/bar_magnet.png" x="40" y="-40" width="40" height="120" transform="rotate(-90 60 20)" preserveAspectRatio="none" />
                      </g>
                    </DraggableSVGGroup>
                  )}

                  {/* Magnet B SVG */}
                  {placed.magnetB && (
                    <DraggableSVGGroup id="magnetB" isDraggable={true}>
                      <g transform={`translate(${positions.magnetB.x - 60}, ${positions.magnetB.y - 20})`} filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))">
                        <text x="60" y="-10" fill="#1e293b" fontSize="14" fontWeight="bold" textAnchor="middle">Magnet B</text>
                        <image href="/Shared/bar_magnet.png" x="40" y="-40" width="40" height="120" transform="rotate(90 60 20)" preserveAspectRatio="none" />
                      </g>
                    </DraggableSVGGroup>
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
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(11, 19, 43, 0.75)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                borderRadius: '20px',
                padding: '1.5rem'
              }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                style={{
                  background: '#ffffff',
                  border: '3px solid #10b981',
                  borderRadius: '24px',
                  padding: '2rem 2.5rem',
                  maxWidth: '480px',
                  width: '90%',
                  textAlign: 'center',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1.2rem'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle2 size={38} color="#10b981" />
                </div>

                <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '1.5rem', fontWeight: 800 }}>
                  Setup Complete! 🎉
                </h3>

                <p style={{ margin: 0, color: '#065f46', fontSize: '1.02rem', lineHeight: '1.5', fontWeight: 700 }}>
                  Excellent! Magnet A is correctly placed across the pencils, and Magnet B is ready for interaction.
                </p>

                <button 
                  onClick={() => {
                    onComplete();
                    onNext();
                  }} 
                  style={{ 
                    marginTop: '0.5rem',
                    padding: '0.85rem 2.4rem', 
                    fontSize: '1.05rem', 
                    fontWeight: 800, 
                    borderRadius: '30px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.6rem',
                    background: 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(255, 119, 0, 0.5)',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  Proceed to Prediction <ArrowRight size={20} color="#ffffff" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDraggingId && !placed[activeDraggingId] ? (
          <div style={{ opacity: 0.85, pointerEvents: "none" }}>
            {activeDraggingId === "pencils" && (
              <div style={{ display: "flex", gap: "4px" }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ width: "6px", height: "80px", background: "linear-gradient(90deg, #fde047, #ca8a04)", borderRadius: "3px" }} />
                ))}
              </div>
            )}
            {activeDraggingId === "magnetA" && (
              <div style={{ width: "120px", height: "24px", position: "relative" }}>
                <img src="/Shared/bar_magnet.png" style={{ position: "absolute", top: "50%", left: "50%", width: "24px", height: "120px", transform: "translate(-50%, -50%) rotate(-90deg)", objectFit: "fill", borderRadius: "4px" }} alt="" />
              </div>
            )}
            {activeDraggingId === "magnetB" && (
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
