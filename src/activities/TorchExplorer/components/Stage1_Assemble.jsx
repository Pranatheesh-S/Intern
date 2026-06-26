import React, { useState } from "react";
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
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Cylinder, Box, Sphere } from "@react-three/drei";

const STEPS = [
  {
    id: "torch_body",
    name: "Torch Body",
    desc: "The main casing that holds everything.",
    hint: "Drag the Torch Body into the center of the workspace.",
    prereq: [],
  },
  {
    id: "torch_bulb",
    name: "Torch Bulb",
    desc: "Emits light when current passes through its filament.",
    hint: "Place the Torch Bulb into the front head of the torch.",
    prereq: ["torch_body"],
  },
  {
    id: "torch_switch",
    name: "Torch Switch",
    desc: "Opens and closes the electric circuit.",
    hint: "Place the switch on the designated slot on the Torch Body.",
    prereq: ["torch_body", "torch_bulb"],
  },
  {
    id: "battery_holder",
    name: "Battery Holder",
    desc: "Houses the electric cells.",
    hint: "Place the Battery Holder inside the Torch Body.",
    prereq: ["torch_body", "torch_bulb", "torch_switch"],
  },
];

function DraggableToken({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
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

function DraggableSVGGroup({ id, children, isDraggable }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      disabled: !isDraggable,
    });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: isDraggable ? (isDragging ? "grabbing" : "grab") : "default",
    touchAction: "none",
  };
  return (
    <g ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </g>
  );
}

export default function Stage1_Assemble({ onComplete }) {
  const [placed, setPlaced] = useState({
    torch_body: false,
    torch_bulb: false,
    torch_switch: false,
    battery_holder: false,
  });

  const [snapped, setSnapped] = useState({
    torch_body: false,
    torch_bulb: false,
    torch_switch: false,
    battery_holder: false,
  });

  const [positions, setPositions] = useState({
    torch_body: { x: 300, y: 240 },
    torch_bulb: { x: 450, y: 150 },
    torch_switch: { x: 450, y: 300 },
    battery_holder: { x: 450, y: 380 },
  });

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const isStepUnlocked = (stepId) => {
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return false;
    return step.prereq.every((pId) => snapped[pId] === true);
  };

  const handleSelectTrayItem = (stepId) => {
    if (snapped[stepId]) return;
    const step = STEPS.find((s) => s.id === stepId);
    if (!isStepUnlocked(stepId)) {
      const missingPrereqs = step.prereq.filter((pId) => !snapped[pId]);
      const missingNames = missingPrereqs
        .map((pId) => STEPS.find((s) => s.id === pId)?.name)
        .join(", ");
      setError(`❌ Cannot select "${step.name}". You must place and snap: ${missingNames} first.`);
      return;
    }
    setError("");
    setSelectedItemId(stepId);
  };

  const handleDragStart = (event) => {
    setActiveDraggingId(event.active.id);
    setError("");
  };

  const handleDragEnd = (event) => {
    const draggedId = activeDraggingId;
    setActiveDraggingId(null);
    if (!event.active || !draggedId) return;

    const canvas = document.getElementById("assembly-canvas");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const activeRect = event.active.rect.current.translated;
      if (activeRect) {
        const svgScale = Math.min(rect.width / 600, rect.height / 480);
        const offsetX = (rect.width - 600 * svgScale) / 2;
        const offsetY = (rect.height - 480 * svgScale) / 2;
        
        let x, y;
        if (placed[draggedId]) {
          const dx = event.delta.x / svgScale;
          const dy = event.delta.y / svgScale;
          x = positions[draggedId].x + dx;
          y = positions[draggedId].y + dy;
        } else {
          const clientX = activeRect.left + activeRect.width / 2;
          const clientY = activeRect.top + activeRect.height / 2;
          x = (clientX - rect.left - offsetX) / svgScale;
          y = (clientY - rect.top - offsetY) / svgScale;
        }

        // Snapping logic
        let didSnap = false;
        
        if (draggedId === "torch_body") {
          // Body just needs to be fully inside the frame. 
          // Bounding box of body is roughly x-140 to x+110, y-45 to y+50.
          if (x > 140 && x < 490 && y > 50 && y < 430) {
            didSnap = true;
          }
        } else {
          const bodyPos = positions.torch_body;
          const targets = {
            torch_bulb: { x: bodyPos.x + 85, y: bodyPos.y },
            torch_switch: { x: bodyPos.x - 20, y: bodyPos.y - 30 },
            battery_holder: { x: bodyPos.x - 45, y: bodyPos.y },
          };
          
          const target = targets[draggedId];
          if (target) {
            const dist = Math.sqrt((x - target.x) ** 2 + (y - target.y) ** 2);
            if (dist < 60) {
              x = target.x;
              y = target.y;
              didSnap = true;
            }
          }
        }

        // We allow placing anywhere inside the canvas (0-600, 0-480)
        if (x > 0 && x < 600 && y > 0 && y < 480) {
          setPositions((prev) => ({ ...prev, [draggedId]: { x, y } }));
          setPlaced((prev) => ({ ...prev, [draggedId]: true }));
          
          if (didSnap) {
            setSnapped((prev) => ({ ...prev, [draggedId]: true }));
            setSelectedItemId(null);
            setError("");
            
            // Check success
            if (draggedId === "battery_holder") {
              setTimeout(() => {
                setSuccess(true);
                confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
              }, 300);
            } else {
              confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
            }
          } else {
            // It was placed, but not snapped.
            if (draggedId === "torch_body") {
              setError(`⚠️ The Torch Body is too close to the edge. Move it fully inside the frame!`);
            } else {
              setError(`⚠️ The ${STEPS.find(s=>s.id===draggedId).name} is not in the correct spot. Move it closer to its snap point!`);
            }
          }
        } else {
          if (!placed[draggedId]) {
            setError("Place the item clearly inside the assembly workspace.");
          }
        }
      }
    }
  };

  const handleReset = () => {
    setPlaced({ torch_body: false, torch_bulb: false, torch_switch: false, battery_holder: false });
    setSnapped({ torch_body: false, torch_bulb: false, torch_switch: false, battery_holder: false });
    setPositions({
      torch_body: { x: 300, y: 240 },
      torch_bulb: { x: 450, y: 150 },
      torch_switch: { x: 450, y: 300 },
      battery_holder: { x: 450, y: 380 },
    });
    setSelectedItemId(null);
    setError("");
    setSuccess(false);
  };

  const completedCount = Object.values(snapped).filter(Boolean).length;
  const progressPercent = (completedCount / STEPS.length) * 100;
  const activeStep = STEPS.find((s) => s.id === selectedItemId);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="main-grid" style={{ gridTemplateColumns: "1fr", gap: "1rem", padding: "1rem", maxWidth: "900px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ margin: "0 0 0.25rem 0", color: "var(--text-heading)" }}>Stage 1: Assemble the Torch</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Explore a real torch and identify its internal components.
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
            <button onClick={handleReset} className="outline" style={{ padding: "0.5rem", borderRadius: "50%" }}>
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "1.5rem" }}>
          <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem", background: "var(--surface)" }}>
            <h4 style={{ margin: 0, borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>Parts Bench</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
              {STEPS.map((step) => {
                const isPlaced = placed[step.id];
                const isSnapped = snapped[step.id];
                const isUnlocked = isStepUnlocked(step.id);
                const isSelected = selectedItemId === step.id;

                return (
                  <button
                    key={step.id}
                    onClick={() => handleSelectTrayItem(step.id)}
                    disabled={isSnapped}
                    style={{
                      padding: "0.75rem",
                      borderRadius: "6px",
                      border: `1px solid ${isSelected ? "var(--accent)" : isSnapped ? "var(--success-border)" : "var(--border)"}`,
                      background: isSelected ? "var(--accent-bg)" : isSnapped ? "var(--success-bg)" : "var(--surface)",
                      opacity: isSnapped ? 0.6 : isUnlocked ? 1 : 0.5,
                      textAlign: "left",
                      cursor: isSnapped ? "default" : isUnlocked ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.2s"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: "bold", color: isSnapped ? "var(--success)" : "var(--text-primary)" }}>
                        {step.name}
                      </div>
                    </div>
                    {isSnapped && <CheckCircle2 size={16} style={{ color: "var(--success)" }} />}
                  </button>
                );
              })}
            </div>

            {activeStep && (
              <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.8rem", color: "var(--text-secondary)" }}>Inspector</h5>
                <div style={{ width: "100%", height: "120px", background: "#f8fafc", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--border)" }}>
                  <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 10, 5]} intensity={1} />
                    {activeStep.id === "torch_body" && (
                      <group rotation={[0, 0, -Math.PI / 2]}>
                        {/* Main casing */}
                        <Cylinder args={[0.4, 0.4, 2.5, 32]} position={[0, -0.5, 0]}>
                          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
                        </Cylinder>
                        {/* Torch Head */}
                        <Cylinder args={[0.7, 0.4, 1, 32]} position={[0, 1.25, 0]}>
                          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
                        </Cylinder>
                        {/* Switch slot */}
                        <Box args={[0.3, 0.6, 0.2]} position={[0.4, -0.2, 0]}>
                          <meshStandardMaterial color="#0f172a" />
                        </Box>
                      </group>
                    )}
                    {activeStep.id === "torch_bulb" && (
                      <group rotation={[0, 0, 0]} scale={1.5}>
                        {/* Glass dome */}
                        <Sphere args={[0.25, 32, 32]} position={[0, 0.25, 0]}>
                          <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.1} />
                        </Sphere>
                        {/* Filament */}
                        <Cylinder args={[0.02, 0.02, 0.2]} position={[0, 0.25, 0]}>
                          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
                        </Cylinder>
                        {/* Metal Base */}
                        <Cylinder args={[0.15, 0.15, 0.25, 32]} position={[0, -0.05, 0]}>
                          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
                        </Cylinder>
                        <Cylinder args={[0.16, 0.16, 0.05, 32]} position={[0, -0.2, 0]}>
                          <meshStandardMaterial color="#cbd5e1" metalness={1} roughness={0.1} />
                        </Cylinder>
                      </group>
                    )}
                    {activeStep.id === "torch_switch" && (
                      <group scale={1.2}>
                        {/* Switch Base */}
                        <Box args={[0.8, 0.15, 0.4]}>
                          <meshStandardMaterial color="#334155" roughness={0.7} />
                        </Box>
                        {/* Switch slider */}
                        <Box args={[0.35, 0.2, 0.3]} position={[0, 0.1, 0]}>
                          <meshStandardMaterial color="#ef4444" roughness={0.4} />
                        </Box>
                      </group>
                    )}
                    {activeStep.id === "battery_holder" && (
                      <group rotation={[0, 0, -Math.PI / 2]}>
                        <Cylinder args={[0.3, 0.3, 2.2, 32]} position={[0, 0, 0]}>
                          <meshStandardMaterial color="#64748b" transparent opacity={0.3} wireframe />
                        </Cylinder>
                        {/* Spring */}
                        <Cylinder args={[0.2, 0.2, 0.1, 16]} position={[0, -1.05, 0]}>
                          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
                        </Cylinder>
                      </group>
                    )}
                    <OrbitControls enableZoom={true} enablePan={false} />
                  </Canvas>
                </div>
                {/* Only show the drag button if it hasn't been placed on the canvas yet */}
                {!placed[activeStep.id] ? (
                  <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
                    <DraggableToken id={activeStep.id}>
                      <div style={{ padding: "0.5rem 1rem", background: "var(--accent)", color: "white", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                        Drag to Workspace <ArrowRight size={14} />
                      </div>
                    </DraggableToken>
                  </div>
                ) : (
                  <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
                    <div style={{ padding: "0.5rem 1rem", background: "var(--surface)", color: "var(--text-secondary)", border: "1px dashed var(--border)", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      Item is in Workspace
                    </div>
                  </div>
                )}
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
                  
                  {/* SVG Filters for Realism */}
                  <defs>
                    <linearGradient id="metalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="20%" stopColor="#94a3b8" />
                      <stop offset="50%" stopColor="#334155" />
                      <stop offset="80%" stopColor="#64748b" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                    <linearGradient id="bulbBaseGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="50%" stopColor="#e2e8f0" />
                      <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>
                    <radialGradient id="glassGrad" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.3" />
                    </radialGradient>
                    <linearGradient id="switchGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                    <linearGradient id="interiorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0f172a" />
                      <stop offset="50%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                  </defs>

                  <style>
                    {`
                      @keyframes pulse-dash {
                        0% { stroke-dashoffset: 20; opacity: 0.6; }
                        50% { opacity: 1; }
                        100% { stroke-dashoffset: 0; opacity: 0.6; }
                      }
                      .drop-zone {
                        fill: rgba(59, 130, 246, 0.1);
                        stroke: #3b82f6;
                        stroke-width: 2;
                        stroke-dasharray: 4 4;
                        animation: pulse-dash 2s linear infinite;
                      }
                    `}
                  </style>

                  {placed.torch_body && (
                    <DraggableSVGGroup id="torch_body" isDraggable={!snapped.torch_body || !snapped.torch_bulb}>
                      <g transform={`translate(${positions.torch_body.x - 140}, ${positions.torch_body.y - 45})`} filter="drop-shadow(2px 10px 12px rgba(0,0,0,0.4))">
                        {/* Torch Interior (visible before battery holder is placed) */}
                        <path d="M 40,25 L 200,25 L 200,65 L 40,65 Z" fill="url(#interiorGrad)" />
                        
                        {/* Main Casing Outline */}
                        <path d="M 30,20 L 200,20 L 200,70 L 30,70 Q 15,45 30,20 Z" fill="url(#metalGrad)" />
                        
                        {/* Torch Head (Reflector Casing) */}
                        <path d="M 200,20 L 250,-5 L 250,95 L 200,70 Z" fill="url(#metalGrad)" />
                        
                        {/* Head trim */}
                        <path d="M 245,-5 L 255,-5 L 255,95 L 245,95 Z" fill="#1e293b" />

                        {/* Switch Slot on top */}
                        <rect x="100" y="15" width="45" height="5" fill="#0f172a" rx="2" />
                        
                        {/* Cutaway inner compartment */}
                        <rect x="40" y="30" width="140" height="30" fill="url(#interiorGrad)" rx="5" />
                        
                        {/* Reflector inner cone */}
                        <path d="M 200,30 L 240,5 L 240,85 L 200,60 Z" fill="#94a3b8" />

                        {/* DROP ZONES */}
                        {isStepUnlocked("battery_holder") && !snapped.battery_holder && (
                          <rect x="40" y="30" width="130" height="30" className="drop-zone" rx="4" />
                        )}
                        {isStepUnlocked("torch_bulb") && !snapped.torch_bulb && (
                          <circle cx="215" cy="45" r="16" className="drop-zone" />
                        )}
                        {isStepUnlocked("torch_switch") && !snapped.torch_switch && (
                          <rect x="102" y="8" width="40" height="14" className="drop-zone" rx="4" />
                        )}

                      </g>
                    </DraggableSVGGroup>
                  )}

                  {placed.battery_holder && (
                    <DraggableSVGGroup id="battery_holder" isDraggable={!snapped.battery_holder}>
                      <g transform={`translate(${positions.battery_holder.x - 65}, ${positions.battery_holder.y - 15})`} filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))">
                        {/* Battery Holder Tube */}
                        <rect x="0" y="0" width="130" height="30" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 4" rx="4" />
                        <rect x="0" y="0" width="130" height="30" fill="#3b82f6" opacity="0.1" rx="4" />
                        
                        {/* Spring at back (-) */}
                        <path d="M 5,5 L 0,10 L 8,15 L 0,20 L 8,25" fill="none" stroke="#94a3b8" strokeWidth="2" />
                        
                        {/* Contact at front (+) */}
                        <rect x="125" y="5" width="5" height="20" fill="#cbd5e1" rx="2" />
                        
                        <text x="65" y="19" fill="#93c5fd" fontSize="10" fontWeight="600" textAnchor="middle" letterSpacing="1">BATTERY COMPARTMENT</text>
                      </g>
                    </DraggableSVGGroup>
                  )}

                  {placed.torch_bulb && (
                    <DraggableSVGGroup id="torch_bulb" isDraggable={!snapped.torch_bulb}>
                      <g transform={`translate(${positions.torch_bulb.x - 15}, ${positions.torch_bulb.y - 15})`} filter="drop-shadow(0px 2px 5px rgba(0,0,0,0.3))">
                        {/* Metal Screw Base (Left) */}
                        <rect x="0" y="9" width="12" height="12" fill="url(#bulbBaseGrad)" rx="2" />
                        <line x1="3" y1="9" x2="3" y2="21" stroke="#475569" strokeWidth="1" />
                        <line x1="6" y1="9" x2="6" y2="21" stroke="#475569" strokeWidth="1" />
                        <line x1="9" y1="9" x2="9" y2="21" stroke="#475569" strokeWidth="1" />
                        <circle cx="-3" cy="15" r="3" fill="#cbd5e1" />

                        {/* Bulb Glass (Right) */}
                        <circle cx="22" cy="15" r="14" fill="url(#glassGrad)" />
                        <circle cx="26" cy="10" r="4" fill="#ffffff" opacity="0.6" /> {/* Highlight */}
                        
                        {/* Filament inside */}
                        <path d="M 12,13 L 20,10 L 20,20 L 12,17" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                        <circle cx="20" cy="15" r="1" fill="#f59e0b" />
                      </g>
                    </DraggableSVGGroup>
                  )}

                  {placed.torch_switch && (
                    <DraggableSVGGroup id="torch_switch" isDraggable={!snapped.torch_switch}>
                      <g transform={`translate(${positions.torch_switch.x - 20}, ${positions.torch_switch.y - 5})`} filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.5))">
                        {/* Switch Base Track */}
                        <rect x="0" y="0" width="40" height="10" fill="#1e293b" rx="5" />
                        {/* Slider Button */}
                        <rect x="15" y="-5" width="18" height="14" fill="url(#switchGrad)" rx="3" />
                        {/* Grip Grooves */}
                        <line x1="20" y1="-2" x2="20" y2="6" stroke="#991b1b" strokeWidth="1.5" />
                        <line x1="24" y1="-2" x2="24" y2="6" stroke="#991b1b" strokeWidth="1.5" />
                        <line x1="28" y1="-2" x2="28" y2="6" stroke="#991b1b" strokeWidth="1.5" />
                      </g>
                    </DraggableSVGGroup>
                  )}

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
                      Excellent! You've assembled the main components of the torch. Now let's explore how it actually works.
                    </p>
                    <button 
                      onClick={onComplete} 
                      className="primary" 
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 2rem" }}
                    >
                      Proceed to Explore Cell <ArrowRight size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeDraggingId && !placed[activeDraggingId] ? (
          <div style={{ opacity: 0.8, pointerEvents: "none" }}>
            {activeDraggingId === "torch_body" && (
              <svg width="240" height="120">
                <path d="M 30,20 L 200,20 L 200,70 L 30,70 Q 15,45 30,20 Z" fill="#64748b" />
                <path d="M 200,20 L 250,-5 L 250,95 L 200,70 Z" fill="#94a3b8" />
                <rect x="100" y="15" width="45" height="5" fill="#0f172a" rx="2" />
                <rect x="40" y="30" width="140" height="30" fill="#1e293b" rx="5" />
              </svg>
            )}
            {activeDraggingId === "torch_bulb" && (
              <svg width="50" height="40">
                <circle cx="22" cy="15" r="14" fill="#bae6fd" opacity="0.8" />
                <rect x="0" y="9" width="12" height="12" fill="#94a3b8" rx="2" />
              </svg>
            )}
            {activeDraggingId === "torch_switch" && (
              <svg width="40" height="20">
                <rect x="0" y="0" width="40" height="10" fill="#1e293b" rx="5" />
                <rect x="15" y="-5" width="18" height="14" fill="#ef4444" rx="3" />
              </svg>
            )}
            {activeDraggingId === "battery_holder" && (
              <svg width="130" height="30">
                <rect x="0" y="0" width="130" height="30" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 4" rx="4" />
              </svg>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
