import React, { useState, useEffect } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  DragOverlay
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  RotateCcw,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Cylinder, Text } from "@react-three/drei";

const STEPS = [
  {
    id: "pencils",
    name: "6 Round Pencils",
    desc: "Act as rollers to reduce friction.",
    hint: "Drag the pencils onto the workspace.",
    prereq: [],
  },
  {
    id: "magnetA",
    name: "Magnet A",
    desc: "The magnet that will rest on the pencils.",
    hint: "Place Magnet A horizontally across the pencils.",
    prereq: ["pencils"],
  },
  {
    id: "magnetB",
    name: "Magnet B",
    desc: "The magnet you will hold to test interaction.",
    hint: "Place Magnet B beside the setup to complete the assembly.",
    prereq: ["pencils", "magnetA"],
  },
];

// Draggable wrapper for 3D Viewer
function DraggableToken({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    touchAction: "none",
    cursor: isDragging ? "grabbing" : "grab",
    zIndex: isDragging ? 1000 : 10,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

// Droppable Canvas

// Draggable wrapper for Component Tray
function TrayDraggable({ id, disabled, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    disabled: disabled,
  });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={{ display: 'flex', flexDirection: 'column', height: '100%', touchAction: 'none', opacity: isDragging ? 0.4 : 1, cursor: disabled ? "not-allowed" : (isDragging ? "grabbing" : "grab") }}>
      {children}
    </div>
  );
}

function CanvasDroppable({ children }) {
  const { setNodeRef } = useDroppable({ id: "canvas" });
  return (
    <div
      id="assembly-canvas"
      ref={setNodeRef}
      className="canvas-container"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "480px",
        background: "var(--surface)",
        borderRadius: "8px",
        border: "2px solid var(--border)",
        overflow: "hidden"
      }}
    >
      <svg viewBox="0 0 600 480" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%' }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {children}
      </svg>
    </div>
  );
}

// Draggable SVG Group for components placed on Canvas
function DraggableSVGGroup({ id, children, isDraggable }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      disabled: !isDraggable,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    cursor: isDraggable ? (isDragging ? "grabbing" : "grab") : "default",
    touchAction: "none",
  };

  return (
    <g ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </g>
  );
}

export default function Stage1_Build({ onComplete, onNext }) {
  const [placed, setPlaced] = useState({
    pencils: false,
    magnetA: false,
    magnetB: false,
  });

  const [positions, setPositions] = useState({
    pencils: { x: 300, y: 250 },
    magnetA: { x: 300, y: 200 },
    magnetB: { x: 450, y: 200 },
  });

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const snapToIdeal = (id, x, y) => {
    const ideals = {
      pencils: { x: 300, y: 250 },
      magnetA: { x: 300, y: 250 },
      magnetB: { x: 480, y: 250 },
    };
    const ideal = ideals[id];
    if (!ideal) return { x, y };

    // Snap radius
    const dist = Math.sqrt((x - ideal.x) ** 2 + (y - ideal.y) ** 2);
    if (dist < 60) {
      return ideal; // snap
    }
    return { x, y }; // keep free dropped pos
  };

  const isStepUnlocked = (stepId) => {
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return false;
    
    if (stepId === "magnetB") {
      const isMagnetAOnPencils = placed.magnetA && placed.pencils && 
        Math.sqrt((positions.magnetA.x - positions.pencils.x) ** 2 + (positions.magnetA.y - positions.pencils.y) ** 2) <= 60;
      return isMagnetAOnPencils;
    }

    return step.prereq.every((pId) => placed[pId] === true);
  };

  const handleSelectTrayItem = (stepId) => {
    if (placed[stepId]) return;
    const step = STEPS.find((s) => s.id === stepId);
    if (!isStepUnlocked(stepId)) {
      if (stepId === "magnetB" && placed.magnetA) {
        setError("❌ Magnet B is locked! You must first place Magnet A exactly on top of the pencils.");
        return;
      }
      const missingPrereqs = step.prereq.filter((pId) => !placed[pId]);
      const missingNames = missingPrereqs
        .map((pId) => STEPS.find((s) => s.id === pId)?.name)
        .join(", ");
      setError(`❌ Cannot select "${step.name}". You must place the following first: ${missingNames}`);
      return;
    }
    setError("");
    setSelectedItemId(stepId);
  };

  const handleDragStart = (event) => {
    setIsDragging(true);
    setActiveDraggingId(event.active.id);
    setSelectedItemId(event.active.id);
    setError("");
  };

  const handleDragEnd = (event) => {
    setIsDragging(false);
    const draggedId = activeDraggingId;
    setActiveDraggingId(null);
    if (!event.active || !draggedId) return;

    const canvas = document.getElementById("assembly-canvas");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const activeRect = event.active.rect.current.translated;
      if (activeRect) {
        let x, y;
        
        // Calculate true SVG scale and offsets
        const svgScale = Math.min(rect.width / 600, rect.height / 480);
        const offsetX = (rect.width - 600 * svgScale) / 2;
        const offsetY = (rect.height - 480 * svgScale) / 2;
        
        if (placed[draggedId]) {
          // Move already placed component
          const dx = event.delta.x / svgScale;
          const dy = event.delta.y / svgScale;
          x = positions[draggedId].x + dx;
          y = positions[draggedId].y + dy;
        } else {
          // Dropped from 3D Viewer
          const clientX = activeRect.left + activeRect.width / 2;
          const clientY = activeRect.top + activeRect.height / 2;
          
          x = (clientX - rect.left - offsetX) / svgScale;
          y = (clientY - rect.top - offsetY) / svgScale;
        }

        const snapped = snapToIdeal(draggedId, x, y);
        x = snapped.x;
        y = snapped.y;

        let currentError = "";

        // --- Positional Validation ---
        if (draggedId === "magnetA") {
          const distToPencils = Math.sqrt((x - positions.pencils.x) ** 2 + (y - positions.pencils.y) ** 2);
          if (distToPencils > 60) {
            currentError = "ℹ️ You placed Magnet A. Now, drag it directly on top of the pencils so it can roll freely!";
          }
        }

        if (draggedId === "magnetB") {
          const distToMagnetA = Math.sqrt((x - positions.magnetA.x) ** 2 + (y - positions.magnetA.y) ** 2);
          if (distToMagnetA < 180) {
            setError("⚠️ Magnet B must be kept at a larger distance from Magnet A so they don't snap together yet.");
            // Reset position if already placed but moved illegally
            if (placed.magnetB) {
               setPositions(prev => ({ ...prev, magnetB: { x: prev.magnetA.x + 200, y: prev.magnetA.y } }));
            }
            return;
          }
        }

        setError(currentError);
        setPositions((prev) => ({ ...prev, [draggedId]: { x, y } }));

        if (!placed[draggedId]) {
          // Initial drop bounds check
          if (x > 0 && x < 600 && y > 0 && y < 480) {
            setPlaced((prev) => ({ ...prev, [draggedId]: true }));
            setSelectedItemId(null);
            
            // Check success logic
            if (draggedId === "magnetB") {
              setTimeout(() => {
                setSuccess(true);
                confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
              }, 300);
            } else {
              confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
            }
          } else {
            setError("Place the item clearly inside the assembly workspace.");
          }
        }
      }
    }
  };

  const handleReset = () => {
    setPlaced({ pencils: false, magnetA: false, magnetB: false });
    setPositions({
      pencils: { x: 300, y: 250 },
      magnetA: { x: 300, y: 200 },
      magnetB: { x: 450, y: 200 },
    });
    setSelectedItemId(null);
    setError("");
    setSuccess(false);
  };

  const completedCount = Object.values(placed).filter(Boolean).length;
  const progressPercent = (completedCount / STEPS.length) * 100;
  const activeStep = STEPS.find((s) => s.id === selectedItemId);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="main-grid" style={{ gridTemplateColumns: "1fr", gap: "1rem", padding: "1rem", maxWidth: "100%", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ margin: "0 0 0.25rem 0", color: "var(--text-heading)" }}>Build the Experiment</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Assemble the setup as shown in Fig. 4.8.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "150px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                <span>Progress</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  style={{ height: "100%", background: success ? "var(--success)" : "var(--accent)" }}
                />
              </div>
            </div>
            <button onClick={handleReset} className="outline" style={{ padding: "0.5rem", borderRadius: "50%" }} title="Reset Assembly">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "1.5rem" }}>
          <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem", background: "var(--surface)" }}>
            <h4 style={{ margin: 0, borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>🧊 3D Viewer</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", alignContent: "start", flex: 1 }}>
              {STEPS.map((step) => {
                const isPlaced = placed[step.id];
                const isUnlocked = isStepUnlocked(step.id);
                const isSelected = selectedItemId === step.id;
                const isDisabled = isPlaced || !isUnlocked;

                const renderThumbnailSVG = (id) => {
                  switch (id) {
                    case "pencils": return (
                      <svg viewBox="-5 -5 60 50" width="24" height="24">
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
                      <svg viewBox="0 0 100 40" width="24" height="24">
                        <image href="/Shared/bar_magnet.png" x="30" y="-30" width="40" height="100" transform="rotate(-90 50 20)" />
                      </svg>
                    );
                    case "magnetB": return (
                      <svg viewBox="0 0 100 40" width="24" height="24">
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
                      className="tray-btn"
                      onClick={() => handleSelectTrayItem(step.id)}
                      disabled={isDisabled}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0.6rem 0.4rem", borderRadius: "12px",
                        background: isPlaced ? "var(--success-bg)" : isSelected ? "var(--accent-bg)" : isUnlocked ? "var(--surface)" : "var(--neutral-bg)",
                        border: `1px solid ${isPlaced ? "var(--success-border)" : isSelected ? "var(--accent)" : isUnlocked ? "var(--accent-border)" : "var(--border)"}`,
                        color: isPlaced ? "var(--success)" : isUnlocked ? "var(--text-primary)" : "var(--text-faint)",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        position: "relative",
                        minHeight: "72px",
                        boxShadow: isSelected ? "0 0 0 2px rgba(99,102,241,0.4)" : isUnlocked && !isPlaced ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                      }}
                    >
                      <div style={{ width: "34px", height: "34px", background: "var(--border)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.35rem", opacity: isUnlocked ? 1 : 0.2, transition: "opacity 0.2s" }}>
                        {renderThumbnailSVG(step.id)}
                      </div>
                      <span style={{ fontSize: "0.68rem", fontWeight: "600", textAlign: "center", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", width: "100%", opacity: isUnlocked ? 1 : 0.3 }}>
                        {step.name}
                      </span>
                      <div style={{ position: "absolute", top: "5px", right: "5px" }}>
                        {isPlaced ? (
                          <CheckCircle2 size={12} style={{ color: "var(--success)" }} />
                        ) : !isUnlocked ? (
                          <Lock size={10} style={{ color: "var(--text-secondary)" }} />
                        ) : null}
                      </div>
                    </button>
                  </TrayDraggable>
                );
              })}
            </div>

            {activeStep && (
              <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.8rem", color: "var(--text-secondary)" }}>Inspector</h5>
                <div style={{ width: "100%", height: "120px", background: "#f8fafc", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border)" }}>
                  <Canvas camera={{ position: [0, 2, 4], fov: 40 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 5, 5]} intensity={1} />
                    {activeStep.id === "pencils" && (
                      <group position={[0, -0.5, 0]}>
                        {[...Array(6)].map((_, i) => (
                          <group key={i} position={[0, 0, (i - 2.5) * 0.25]} rotation={[0, 0, Math.PI / 2]}>
                            {/* Body */}
                            <Cylinder args={[0.1, 0.1, 2.2, 16]} position={[0, 0, 0]}>
                              <meshStandardMaterial color="#fde047" />
                            </Cylinder>
                            {/* Wood Tip */}
                            <Cylinder args={[0.03, 0.1, 0.4, 16]} position={[0, 1.3, 0]}>
                              <meshStandardMaterial color="#e6b981" />
                            </Cylinder>
                            {/* Lead Tip */}
                            <Cylinder args={[0, 0.03, 0.15, 16]} position={[0, 1.575, 0]}>
                              <meshStandardMaterial color="#334155" />
                            </Cylinder>
                            {/* Ferrule (Metal) */}
                            <Cylinder args={[0.105, 0.105, 0.15, 16]} position={[0, -1.175, 0]}>
                              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
                            </Cylinder>
                            {/* Eraser */}
                            <Cylinder args={[0.1, 0.1, 0.2, 16]} position={[0, -1.35, 0]}>
                              <meshStandardMaterial color="#f472b6" />
                            </Cylinder>
                          </group>
                        ))}
                      </group>
                    )}
                    {(activeStep.id === "magnetA") && (
                      <group>
                        <Box args={[1, 0.3, 0.5]} position={[-0.5, 0, 0]}>
                          <meshStandardMaterial color="#ef4444" />
                        </Box>
                        <Box args={[1, 0.3, 0.5]} position={[0.5, 0, 0]}>
                          <meshStandardMaterial color="#3b82f6" />
                        </Box>
                        <Text position={[-0.5, 0, 0.26]} fontSize={0.2} color="white" fontWeight="bold">N</Text>
                        <Text position={[0.5, 0, 0.26]} fontSize={0.2} color="white" fontWeight="bold">S</Text>
                        <Text position={[-0.5, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.2} color="white" fontWeight="bold">N</Text>
                        <Text position={[0.5, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.2} color="white" fontWeight="bold">S</Text>
                      </group>
                    )}
                    {(activeStep.id === "magnetB") && (
                      <group>
                        <Box args={[1, 0.3, 0.5]} position={[-0.5, 0, 0]}>
                          <meshStandardMaterial color="#3b82f6" />
                        </Box>
                        <Box args={[1, 0.3, 0.5]} position={[0.5, 0, 0]}>
                          <meshStandardMaterial color="#ef4444" />
                        </Box>
                        <Text position={[-0.5, 0, 0.26]} fontSize={0.2} color="white" fontWeight="bold">S</Text>
                        <Text position={[0.5, 0, 0.26]} fontSize={0.2} color="white" fontWeight="bold">N</Text>
                        <Text position={[-0.5, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.2} color="white" fontWeight="bold">S</Text>
                        <Text position={[0.5, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.2} color="white" fontWeight="bold">N</Text>
                      </group>
                    )}
                    <OrbitControls enableZoom={true} enablePan={false} />
                  </Canvas>
                </div>
                
                <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
                  
                    <div style={{ padding: "0.5rem 1rem", background: "var(--accent)", color: "white", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                      Drag to Workspace <ArrowRight size={14} />
                    </div>
                  
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="glass-panel" style={{ flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column" }}>
              
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{ background: "var(--destructive-bg)", color: "var(--destructive)", padding: "0.75rem", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", fontSize: "0.85rem", border: "1px solid var(--destructive-border)" }}
                  >
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}
                {activeStep && !error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ background: "rgba(59, 130, 246, 0.1)", color: "var(--accent-text)", padding: "0.75rem", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", fontSize: "0.85rem", border: "1px solid rgba(59, 130, 246, 0.2)" }}
                  >
                    <Info size={16} /> {activeStep.hint}
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ flex: 1, position: "relative" }}>
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
                        <text x="60" y="-10" fill="var(--text-secondary)" fontSize="14" fontWeight="bold" textAnchor="middle">Magnet A</text>
                        <image href="/Shared/bar_magnet.png" x="40" y="-40" width="40" height="120" transform="rotate(-90 60 20)" preserveAspectRatio="none" />
                      </g>
                    </DraggableSVGGroup>
                  )}

                  {/* Magnet B SVG */}
                  {placed.magnetB && (
                    <DraggableSVGGroup id="magnetB" isDraggable={true}>
                      <g transform={`translate(${positions.magnetB.x - 60}, ${positions.magnetB.y - 20})`} filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))">
                        <text x="60" y="-10" fill="var(--text-secondary)" fontSize="14" fontWeight="bold" textAnchor="middle">Magnet B</text>
                        <image href="/Shared/bar_magnet.png" x="40" y="-40" width="40" height="120" transform="rotate(90 60 20)" preserveAspectRatio="none" />
                      </g>
                    </DraggableSVGGroup>
                  )}

                  <defs>
                    <linearGradient id="pencilGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fde047" />
                      <stop offset="100%" stopColor="#ca8a04" />
                    </linearGradient>
                  </defs>
                </CanvasDroppable>
              </div>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: "1.5rem", background: "var(--success-bg)", padding: "1.25rem", borderRadius: "8px", border: "1px solid var(--success-border)", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--success)", fontWeight: "bold" }}>
                      <CheckCircle2 size={24} />
                      Setup Complete!
                    </div>
                    <p style={{ margin: 0, color: "var(--success)", fontSize: "0.9rem", textAlign: "center" }}>
                      Excellent! Magnet A is correctly placed across the pencils, and Magnet B is ready for interaction.
                    </p>
                    <button 
                      onClick={() => {
                        onComplete();
                        onNext();
                      }} 
                      className="primary" 
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 2rem" }}
                    >
                      Proceed to Prediction <ArrowRight size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDraggingId && !placed[activeDraggingId] ? (
          <div style={{ opacity: 0.8, pointerEvents: "none" }}>
            {/* Show a mini visual representation when dragging from parts bench */}
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
