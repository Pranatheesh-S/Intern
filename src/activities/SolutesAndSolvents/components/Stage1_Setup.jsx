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
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  Info,
  Lock,
  CheckCircle2,
  AlertCircle,
  RotateCcw
} from "lucide-react";

const STEPS = [
  {
    id: "tumbler",
    name: "Glass Tumbler",
    desc: [
      "A clean, transparent glass tumbler.",
      "We use transparent glass so we can clearly observe the dissolution process.",
    ],
    hint: "Place the Glass Tumbler on the center of the lab bench.",
    prereq: [],
  },
  {
    id: "pitcher",
    name: "Water Pitcher",
    desc: [
      "A pitcher filled with clean water.",
      "Water acts as the solvent in our experiment.",
    ],
    hint: "Drag the Water Pitcher to the Tumbler to pour water into it.",
    prereq: ["tumbler"],
  },
  {
    id: "saltBowl",
    name: "Salt Bowl",
    desc: [
      "A small bowl containing common table salt (sodium chloride).",
      "Salt acts as the solute that will dissolve in the water.",
    ],
    hint: "Place the Salt Bowl on the lab bench.",
    prereq: ["pitcher"],
  },
  {
    id: "spoon",
    name: "Spoon",
    desc: [
      "A metallic spoon used for stirring.",
      "Stirring helps to distribute the solute particles and speed up dissolution.",
    ],
    hint: "Place the Spoon next to the Salt Bowl.",
    prereq: ["saltBowl"],
  },
];

// SVGs
const TumblerSVG = ({ isFilled }) => (
  <svg viewBox="0 0 100 120" width="100%" height="100%">
    {/* Back rim */}
    <ellipse cx="50" cy="15" rx="35" ry="10" fill="none" stroke="#cbd5e1" strokeWidth="2" />
    
    {/* Water fill if applicable */}
    {isFilled && (
      <path 
        d="M 18,60 C 18,60 50,65 82,60 L 80,105 C 80,113 70,118 50,118 C 30,118 20,113 20,105 Z" 
        fill="rgba(56, 189, 248, 0.4)" 
      />
    )}

    {/* Body */}
    <path 
      d="M 15,15 L 20,105 C 20,115 30,120 50,120 C 70,120 80,115 80,105 L 85,15" 
      fill="rgba(241, 248, 255, 0.5)" 
      stroke="#94a3b8" 
      strokeWidth="4" 
    />
    
    {/* Front rim */}
    <path 
      d="M 15,15 C 15,25 35,30 50,30 C 65,30 85,25 85,15" 
      fill="none" 
      stroke="#94a3b8" 
      strokeWidth="4" 
    />
    
    {/* Water top line */}
    {isFilled && (
      <path 
        d="M 18,60 C 30,65 70,65 82,60" 
        fill="none" 
        stroke="#38bdf8" 
        strokeWidth="2" 
      />
    )}
  </svg>
);

const PitcherSVG = ({ isPouring }) => (
  <svg viewBox="0 0 120 150" width="100%" height="100%" style={{ transform: isPouring ? 'rotate(-30deg)' : 'none', transition: 'transform 0.5s' }}>
    {/* Handle */}
    <path d="M 85,50 C 120,40 120,90 90,100" fill="none" stroke="#7dd3fc" strokeWidth="8" strokeLinecap="round" />
    
    {/* Body */}
    <path d="M 30,20 C 40,20 40,10 50,10 C 60,10 60,20 70,20 L 90,130 C 90,145 70,150 50,150 C 30,150 10,145 10,130 Z" fill="rgba(56, 189, 248, 0.5)" stroke="#7dd3fc" strokeWidth="4" />
    
    {/* Spout */}
    <path d="M 30,20 L 10,35 L 20,45" fill="rgba(56, 189, 248, 0.5)" stroke="#7dd3fc" strokeWidth="4" />
    
    {/* Pouring water effect */}
    {isPouring && (
      <path d="M 5,40 L -20,100" stroke="rgba(56, 189, 248, 0.8)" strokeWidth="6" strokeDasharray="10, 5" className="pouring-water" />
    )}
  </svg>
);

const SaltBowlSVG = () => (
  <svg viewBox="0 0 100 60" width="100%" height="100%">
    {/* Salt pile */}
    <path d="M 15,30 C 15,5 85,5 85,30" fill="#f8fafc" />
    {/* Bowl */}
    <path d="M 5,30 C 5,60 95,60 95,30" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="3" />
    <ellipse cx="50" cy="30" rx="45" ry="8" fill="none" stroke="#94a3b8" strokeWidth="2" />
  </svg>
);

const SpoonSVG = () => (
  <svg viewBox="0 0 120 30" width="100%" height="100%">
    <path d="M 10,15 C 10,0 40,0 40,15 C 40,30 10,30 10,15" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
    <path d="M 40,15 L 110,15" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

// Draggable wrapper
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

function DraggableSVGGroup({ id, children, isDraggable, additionalTransform }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      disabled: !isDraggable,
    });

  const finalTransform = transform 
    ? { x: transform.x + (additionalTransform?.x || 0), y: transform.y + (additionalTransform?.y || 0) } 
    : additionalTransform;

  const style = {
    transform: finalTransform
      ? `translate3d(${finalTransform.x}px, ${finalTransform.y}px, 0)`
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

export default function Stage1_Setup({ onComplete }) {
  const [placed, setPlaced] = useState({
    tumbler: false,
    pitcher: false,
    saltBowl: false,
    spoon: false,
  });

  const [positions, setPositions] = useState({
    tumbler: { x: 400, y: 300 },
    pitcher: { x: 600, y: 200 },
    saltBowl: { x: 200, y: 350 },
    spoon: { x: 280, y: 400 },
  });

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPouring, setIsPouring] = useState(false);
  const [isTumblerFilled, setIsTumblerFilled] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  );

  useEffect(() => {
    if (placed.tumbler && placed.pitcher && placed.saltBowl && placed.spoon && isTumblerFilled) {
      setSuccess(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  }, [placed, isTumblerFilled]);

  const IDEALS = {
    tumbler: { x: 400, y: 350 },
    pitcher: { x: 550, y: 350 }, // Pitcher's final spot after pouring
    saltBowl: { x: 250, y: 380 },
    spoon: { x: 320, y: 420 },
  };

  const snapToIdeal = (id, x, y) => {
    let idealX, idealY;
    let snapDistance = 60;

    if (id === "pitcher" && placed.tumbler && !isTumblerFilled) {
      // Snap to pour area above tumbler
      idealX = positions.tumbler.x + 80;
      idealY = positions.tumbler.y - 120;
      snapDistance = 100;
      
      const dist = Math.sqrt((x - idealX) ** 2 + (y - idealY) ** 2);
      if (dist < snapDistance) {
        return { x: idealX, y: idealY, isPourTarget: true };
      }
    }

    const ideal = IDEALS[id];
    if (!ideal) return { x, y };
    idealX = ideal.x;
    idealY = ideal.y;

    const dist = Math.sqrt((x - idealX) ** 2 + (y - idealY) ** 2);
    if (dist < snapDistance) {
      return { x: idealX, y: idealY }; 
    }
    return { x, y }; 
  };

  const isStepUnlocked = (stepId) => {
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return false;
    return step.prereq.every((pId) => placed[pId] === true);
  };

  const handleSelectTrayItem = (stepId) => {
    if (placed[stepId]) return;
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return;

    if (!isStepUnlocked(stepId)) {
      setError(`❌ Cannot select "${step.name}" yet. Check prerequisites.`);
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

  const [activeDragDelta, setActiveDragDelta] = useState({ x: 0, y: 0 });

  const handleDragMove = (event) => {
    setActiveDragDelta({ x: event.delta.x, y: event.delta.y });
  };

  const handleDragEnd = (event) => {
    setIsDragging(false);
    setActiveDragDelta({ x: 0, y: 0 });
    let draggedId = activeDraggingId;
    setActiveDraggingId(null);
    if (!event.active || !draggedId) return;

    if (draggedId.startsWith("canvas-")) {
      draggedId = draggedId.replace("canvas-", "");
    }

    const canvas = document.getElementById("assembly-canvas");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const activeRect = event.active.rect.current.translated;
      if (activeRect) {
        let x, y;
        const svgScale = Math.min(rect.width / 800, rect.height / 600);
        const offsetX = (rect.width - 800 * svgScale) / 2;
        const offsetY = (rect.height - 600 * svgScale) / 2;
        
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

          // Adjust center offsets based on element sizes
          if (draggedId === "tumbler") { x -= 40; y -= 60; }
          if (draggedId === "pitcher") { x -= 60; y -= 75; }
          if (draggedId === "saltBowl") { x -= 50; y -= 30; }
          if (draggedId === "spoon") { x -= 60; y -= 15; }
        }

        const snapped = snapToIdeal(draggedId, x, y);
        x = snapped.x;
        y = snapped.y;

        x = Math.max(0, Math.min(800, x));
        y = Math.max(0, Math.min(600, y));

        if (draggedId === "pitcher" && snapped.isPourTarget && !isTumblerFilled) {
          // Trigger pour animation
          setIsPouring(true);
          setPositions((prev) => ({ ...prev, [draggedId]: { x, y } }));
          setTimeout(() => {
            setIsTumblerFilled(true);
            setIsPouring(false);
            setPlaced((prev) => ({ ...prev, pitcher: true }));
            // Move pitcher back to ideal spot
            setPositions((prev) => ({ ...prev, pitcher: IDEALS.pitcher }));
            setSelectedItemId(null); 
            confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
          }, 1500);
          return;
        }

        setPositions((prev) => ({ ...prev, [draggedId]: { x, y } }));

        if (!placed[draggedId]) {
          setPlaced((prev) => ({ ...prev, [draggedId]: true }));
          setSelectedItemId(null); 
          confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
        }
      }
    }
  };

  const handleReset = () => {
    setPlaced({
      tumbler: false,
      pitcher: false,
      saltBowl: false,
      spoon: false,
    });
    setPositions({
      tumbler: { x: 400, y: 300 },
      pitcher: { x: 600, y: 200 },
      saltBowl: { x: 200, y: 350 },
      spoon: { x: 280, y: 400 },
    });
    setSelectedItemId(null);
    setError("");
    setSuccess(false);
    setIsTumblerFilled(false);
    setIsPouring(false);
  };

  const completedCount = Object.values(placed).filter(v => v).length;
  const progressPercent = (completedCount / STEPS.length) * 100;

  const renderThumbnailSVG = (id) => {
    switch (id) {
      case "tumbler": return <svg viewBox="0 0 100 120" width="24" height="24"><TumblerSVG isFilled={false} /></svg>;
      case "pitcher": return <svg viewBox="0 0 120 150" width="24" height="24"><PitcherSVG isPouring={false} /></svg>;
      case "saltBowl": return <svg viewBox="0 0 100 60" width="24" height="24"><SaltBowlSVG /></svg>;
      case "spoon": return <svg viewBox="0 0 120 30" width="24" height="24"><SpoonSVG /></svg>;
      default: return null;
    }
  };

  const getNextStepPrompt = () => {
    if (success) return "✅ Experiment Setup Complete!";
    const remaining = STEPS.filter((s) => !placed[s.id] && isStepUnlocked(s.id));
    if (remaining.length > 0) return `${remaining.length} component(s) ready — pick any from the Component Tray.`;
    return "Place items to continue.";
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div className="main-grid" style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <span className="status-badge neutral" style={{ background: "var(--accent-bg)", color: "var(--accent-text)", fontWeight: "bold" }}>
              Stage 1: Assemble the Experiment
            </span>
            <h2 style={{ margin: "0.2rem 0 0 0", fontSize: "1.4rem" }}>Setup the Apparatus</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Progress: <strong>{completedCount} / {STEPS.length}</strong></span>
            <div style={{ width: "100px", height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${progressPercent}%`, height: "100%", background: "var(--success)", transition: "width 0.3s" }} />
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1rem", alignItems: "stretch" }}>
          {/* LEFT PANEL: Component Tray */}
          <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", height: "100%" }}>
            <div style={{ display: "flex", gap: "0.35rem", alignItems: "center", background: "var(--neutral-bg)", padding: "0.6rem 0.8rem", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <Info style={{ color: "var(--accent)", flexShrink: 0 }} size={16} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>{getNextStepPrompt()}</span>
            </div>

            {error && (
              <div style={{ padding: "0.5rem 0.75rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", fontSize: "0.75rem", color: "var(--danger)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <h3 style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-primary)" }}>Component Tray</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", alignContent: "start" }}>
              {STEPS.map((step) => {
                const isPlaced = placed[step.id];
                const isUnlocked = isStepUnlocked(step.id);
                const isSelected = selectedItemId === step.id;
                const isDisabled = isPlaced || !isUnlocked;

                return (
                  <TrayDraggable key={step.id} id={step.id} disabled={isDisabled}>
                    <button
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
            
            {success && (
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="primary" 
                  onClick={onComplete} 
                  style={{ width: '100%', fontSize: '0.9rem', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  Start Experiment <ArrowRight size={16} />
                </motion.button>
              </div>
            )}
          </div>

          {/* RIGHT PANEL: CANVAS */}
          <div style={{ flex: 1, position: "relative", minHeight: "480px", display: "flex", flexDirection: "column", background: "var(--canvas-bg)", borderRadius: "16px", border: "1px solid var(--canvas-border)", overflow: "hidden" }}>
            
            <button 
              onClick={handleReset}
              className="outline"
              style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 100, fontSize: '0.75rem', padding: '0.3rem 0.6rem', gap: '0.35rem' }}
            >
              <RotateCcw size={12} /> Reset
            </button>

            <div id="assembly-canvas" style={{ position: "relative", width: "100%", height: "100%" }}>
              
              <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                <style>{`
                  @keyframes pourWater {
                    0% { stroke-dashoffset: 20; opacity: 0; }
                    50% { opacity: 1; }
                    100% { stroke-dashoffset: 0; opacity: 0; }
                  }
                  .pouring-water {
                    animation: pourWater 0.5s linear infinite;
                  }
                `}</style>
                
                {/* Draggable Components */}
                {placed.tumbler && (
                  <DraggableSVGGroup id="canvas-tumbler" isDraggable={true}>
                    <g transform={`translate(${positions.tumbler.x}, ${positions.tumbler.y})`}>
                      <svg x="0" y="0" width="80" height="100"><TumblerSVG isFilled={isTumblerFilled} /></svg>
                    </g>
                  </DraggableSVGGroup>
                )}

                {/* Indicator for pouring water */}
                <AnimatePresence>
                  {activeDraggingId && activeDraggingId.includes("pitcher") && placed.tumbler && !isTumblerFilled && (
                    <g>
                      <foreignObject x="0" y="0" width="800" height="600" style={{ pointerEvents: 'none' }}>
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          style={{ 
                            position: 'absolute', 
                            left: `${positions.tumbler.x + 100}px`, 
                            top: `${positions.tumbler.y - 120}px`, 
                            background: 'white', 
                            color: 'var(--accent)', 
                            padding: '0.4rem 0.8rem', 
                            borderRadius: '8px', 
                            fontWeight: '600', 
                            fontSize: '0.85rem', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            border: '1px solid var(--accent)',
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.4rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <span>💧</span> Drop here to pour
                        </motion.div>
                      </foreignObject>
                    </g>
                  )}
                </AnimatePresence>

                {placed.saltBowl && (
                  <DraggableSVGGroup id="canvas-saltBowl" isDraggable={true}>
                    <g transform={`translate(${positions.saltBowl.x}, ${positions.saltBowl.y})`}>
                      <svg x="0" y="0" width="100" height="60"><SaltBowlSVG /></svg>
                    </g>
                  </DraggableSVGGroup>
                )}

                {placed.spoon && (
                  <DraggableSVGGroup id="canvas-spoon" isDraggable={true}>
                    <g transform={`translate(${positions.spoon.x}, ${positions.spoon.y})`}>
                      <svg x="0" y="0" width="120" height="30"><SpoonSVG /></svg>
                    </g>
                  </DraggableSVGGroup>
                )}

                {(placed.pitcher || isPouring) && (
                  <DraggableSVGGroup id="canvas-pitcher" isDraggable={!isPouring}>
                    <g transform={`translate(${positions.pitcher.x}, ${positions.pitcher.y})`}>
                      <svg x="0" y="0" width="120" height="150"><PitcherSVG isPouring={isPouring} /></svg>
                    </g>
                  </DraggableSVGGroup>
                )}

                <AnimatePresence>
                  {isPouring && (
                    <g>
                      <foreignObject x="0" y="0" width="800" height="600" style={{ pointerEvents: 'none' }}>
                        <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(56, 189, 248, 0.9)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.2rem' }}>💧</span> Pouring water into the tumbler...
                        </div>
                      </foreignObject>
                    </g>
                  )}
                </AnimatePresence>

              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
        {activeDraggingId && !placed[activeDraggingId] ? (
          <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8, pointerEvents: 'none' }}>
            {renderThumbnailSVG(activeDraggingId)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
