import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  RotateCcw,
  ArrowRight,
  Info,
  Lock,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
} from "lucide-react";
import ReferenceOverlay from "../../../../../components/ReferenceOverlay";
import {
  TripodSVG,
  SpiritLampSVG,
  WireGauzeSVG,
  BeakerEmptySVG,
  BeakerFullSVG,
  WaterBottleSVG,
  BakingSodaBoxSVG,
  GlassRodSVG,
  LabStandSVG,
  ThermometerSVG
} from "./LabElements";

const STEPS = [
  {
    id: "tripod",
    name: "Tripod Stand",
    desc: "A three-legged stand that provides a stable base for heating experiments.",
    hint: "Place the tripod stand in the center.",
    prereq: [],
    icon: <TripodSVG style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "spiritLamp",
    name: "Spirit Lamp",
    desc: "Provides the heat source for the experiment.",
    hint: "Place the spirit lamp beneath the tripod stand.",
    prereq: ["tripod"],
    icon: <SpiritLampSVG style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "wireGauze",
    name: "Wire Gauze",
    desc: "Distributes heat evenly and supports the beaker.",
    hint: "Place the wire gauze on top of the tripod.",
    prereq: ["tripod"],
    icon: <WireGauzeSVG style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "beaker",
    name: "Beaker",
    desc: "Glass container used to hold the solution.",
    hint: "Place the empty beaker onto the wire gauze.",
    prereq: ["wireGauze"],
    icon: <BeakerEmptySVG style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "water",
    name: "Water",
    desc: "The solvent for our experiment.",
    hint: "Pour water into the beaker.",
    prereq: ["beaker"],
    icon: <WaterBottleSVG style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "bakingSoda",
    name: "Baking Soda",
    desc: "The solute we are trying to dissolve.",
    hint: "Add baking soda to the water.",
    prereq: ["water"],
    icon: <BakingSodaBoxSVG style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "glassRod",
    name: "Glass Rod",
    desc: "Used for stirring to help the solute dissolve.",
    hint: "Place the glass rod into the beaker.",
    prereq: ["beaker"],
    icon: <GlassRodSVG style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "labStand",
    name: "Laboratory Stand",
    desc: "Holds other apparatus securely in place.",
    hint: "Place the laboratory stand next to the tripod.",
    prereq: [],
    icon: <LabStandSVG hasClamp={true} style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "thermometer",
    name: "Thermometer",
    desc: "Measures the temperature of the solution.",
    hint: "Attach the thermometer to the laboratory stand so it dips into the beaker.",
    prereq: ["labStand", "water"],
    icon: <ThermometerSVG style={{ width: '40px', height: '40px' }} />
  }
];

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
      }}
    >
      <div className="canvas-bg-grid" />
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

export default function Stage1_Build({ onComplete }) {
  const [placed, setPlaced] = useState({});
  const [positions, setPositions] = useState({
    labStand: { x: 210, y: 100 },
    tripod: { x: 330, y: 340 },
    spiritLamp: { x: 355, y: 390 },
    wireGauze: { x: 340, y: 340 },
    beaker: { x: 340, y: 230 },
    glassRod: { x: 400, y: 190 },
    thermometer: { x: 305, y: 140 },
  });

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  );

  const IDEALS = {
    labStand: { x: 210, y: 100 },
    tripod: { x: 330, y: 340 },
    spiritLamp: { x: 355, y: 390 },
    wireGauze: { x: 340, y: 340 },
    beaker: { x: 340, y: 230 },
    glassRod: { x: 400, y: 190 },
    thermometer: { x: 305, y: 140 },
  };

  const snapToIdeal = (id, x, y) => {
    const ideal = IDEALS[id];
    if (!ideal) {
      if (id === "water" || id === "bakingSoda") {
        if (placed.beaker) return { x: positions.beaker.x, y: positions.beaker.y };
      }
      return { x, y };
    }

    const dist = Math.sqrt((x - ideal.x) ** 2 + (y - ideal.y) ** 2);
    if (dist < 100) {
      return { x: ideal.x, y: ideal.y }; 
    }
    return { x, y }; 
  };

  const isProperlyPlaced = (id) => {
    if (!placed[id]) return false;
    if (id === "water" || id === "bakingSoda") return true;
    
    const ideal = IDEALS[id];
    if (!ideal) return true;
    const dx = positions[id].x - ideal.x;
    const dy = positions[id].y - ideal.y;
    return Math.sqrt(dx * dx + dy * dy) < 40;
  };

  const isStepUnlocked = (stepId) => {
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return false;
    return step.prereq.every((pId) => isProperlyPlaced(pId));
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
    const draggedId = activeDraggingId;
    setActiveDraggingId(null);
    if (!event.active || !draggedId) return;

    const canvas = document.getElementById("assembly-canvas");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const activeRect = event.active.rect.current.translated;
      if (activeRect) {
        let x, y;
        const svgScale = Math.min(rect.width / 800, rect.height / 600);
        const offsetX = (rect.width - 800 * svgScale) / 2;
        const offsetY = (rect.height - 600 * svgScale) / 2;
        
        if (placed[draggedId] && draggedId !== "water" && draggedId !== "bakingSoda") {
          const dx = event.delta.x / svgScale;
          const dy = event.delta.y / svgScale;
          x = positions[draggedId].x + dx;
          y = positions[draggedId].y + dy;
        } else {
          const clientX = activeRect.left + activeRect.width / 2;
          const clientY = activeRect.top + activeRect.height / 2;
          
          x = (clientX - rect.left - offsetX) / svgScale;
          y = (clientY - rect.top - offsetY) / svgScale;

          // Optional offset depending on component center
          if (draggedId === "labStand") { x -= 40; y -= 100; }
          if (draggedId === "tripod") { x -= 50; y -= 50; }
        }

        const snapped = snapToIdeal(draggedId, x, y);
        x = snapped.x;
        y = snapped.y;

        x = Math.max(0, Math.min(800, x));
        y = Math.max(0, Math.min(600, y));

        if (draggedId === "water" || draggedId === "bakingSoda") {
           // For water and baking soda, if dropped near beaker, mark placed.
           if (placed.beaker) {
              const dx = x - positions.beaker.x;
              const dy = y - positions.beaker.y;
              if (Math.sqrt(dx*dx + dy*dy) < 150) {
                 setPlaced(prev => ({ ...prev, [draggedId]: true }));
                 setSelectedItemId(null);
                 confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
              }
           }
        } else {
          setPositions((prev) => ({ ...prev, [draggedId]: { x, y } }));

          if (!placed[draggedId]) {
            setPlaced((prev) => ({ ...prev, [draggedId]: true }));
            setSelectedItemId(null); 
            confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
          }
        }
      }
    }
  };

  const handleReset = () => {
    setPlaced({});
    setPositions({
      labStand: { x: 210, y: 100 },
      tripod: { x: 330, y: 340 },
      spiritLamp: { x: 355, y: 390 },
      wireGauze: { x: 340, y: 340 },
      beaker: { x: 340, y: 230 },
      glassRod: { x: 400, y: 190 },
      thermometer: { x: 305, y: 140 },
    });
    setSelectedItemId(null);
    setError("");
  };

  const activeItem = activeDraggingId ? STEPS.find((s) => s.id === activeDraggingId) : null;
  const currentHint = activeItem || null;

  const isComplete = STEPS.every((s) => placed[s.id]);

  useEffect(() => {
    if (isComplete) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#10b981", "#f59e0b"]
      });
    }
  }, [isComplete]);

  const placedCount = Object.keys(placed).filter(k => placed[k]).length;
  const progressPercent = (placedCount / STEPS.length) * 100;

  const getNextStepPrompt = () => {
    if (isComplete) return "✅ Apparatus Constructed Successfully!";
    const remaining = STEPS.filter((s) => !placed[s.id]);
    if (remaining.length > 0) return `${remaining.length} component(s) left — pick any from the Component Tray.`;
    return "⚡ All components placed!";
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div className="main-grid" style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <span className="status-badge neutral" style={{ background: "var(--accent-bg)", color: "var(--accent-text)", fontWeight: "bold", padding: "0.2rem 0.5rem", borderRadius: "10px", fontSize: "0.8rem", marginBottom: "0.5rem", display: "inline-block" }}>
              Stage 1: Build Setup
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--text-heading)' }}>Experimental Setup</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Progress: <strong>{placedCount} / {STEPS.length}</strong></span>
            <div style={{ width: "100px", height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${progressPercent}%`, height: "100%", background: "var(--success)", transition: "width 0.3s" }} />
            </div>
            <button
              onClick={handleReset}
              className="outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1rem", alignItems: "stretch", width: "100%" }}>
          {/* LEFT PANEL: Component Tray */}
          <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", height: "100%", minHeight: "550px" }}>
            <div style={{ display: "flex", gap: "0.35rem", alignItems: "center", background: "var(--neutral-bg)", padding: "0.6rem 0.8rem", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <Info style={{ color: "var(--accent)", flexShrink: 0 }} size={16} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>{getNextStepPrompt()}</span>
            </div>

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
                        {step.icon}
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
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, fontSize: '0.8rem', marginTop: 'auto' }}
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: 'auto' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={24} color="#10b981" />
                    <h3 style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1rem', margin: 0 }}>Setup Complete!</h3>
                  </div>
                  <button
                    onClick={onComplete}
                    className="primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem', width: '100%', justifyContent: 'center' }}
                  >
                    Start Experiment <ArrowRight size={16} />
                  </button>
                </motion.div>
            )}
          </div>

          {/* RIGHT PANEL: CANVAS */}
          <div style={{ flex: 1, position: "relative", minHeight: "480px", display: "flex", flexDirection: "column", background: "var(--canvas-bg)", borderRadius: "16px", border: "1px solid var(--canvas-border)", overflow: "hidden" }}>
            
            {/* Reference Blueprint */}
            <ReferenceOverlay title="Reference Blueprint" position="right">
              <svg width="220" height="150" viewBox="150 50 400 400" style={{ opacity: 0.85 }}>
                <g transform={`translate(${IDEALS.labStand.x}, ${IDEALS.labStand.y})`}>
                  <LabStandSVG hasClamp={true} width="120" height="280" />
                </g>
                <g transform={`translate(${IDEALS.tripod.x}, ${IDEALS.tripod.y})`}>
                  <TripodSVG width="120" height="120" />
                </g>
                <g transform={`translate(${IDEALS.spiritLamp.x}, ${IDEALS.spiritLamp.y})`}>
                  <SpiritLampSVG isLit={false} width="80" height="80" />
                </g>
                <g transform={`translate(${IDEALS.wireGauze.x}, ${IDEALS.wireGauze.y})`}>
                  <WireGauzeSVG width="100" height="30" />
                </g>
                <g transform={`translate(${IDEALS.beaker.x}, ${IDEALS.beaker.y})`}>
                  <BeakerFullSVG hasSoda={true} width="100" height="120" />
                </g>
                <g transform={`translate(${IDEALS.glassRod.x}, ${IDEALS.glassRod.y}) rotate(15)`}>
                  <GlassRodSVG width="70" height="140" />
                </g>
                <g transform={`translate(${IDEALS.thermometer.x}, ${IDEALS.thermometer.y})`}>
                  <ThermometerSVG width="50" height="220" />
                </g>
              </svg>
            </ReferenceOverlay>

            <CanvasDroppable>
              <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                
                {placed.labStand && (
                  <DraggableSVGGroup id="labStand" isDraggable={true}>
                    <g transform={`translate(${positions.labStand.x}, ${positions.labStand.y})`}>
                      <LabStandSVG hasClamp={true} width="120" height="380" />
                    </g>
                  </DraggableSVGGroup>
                )}

                {placed.tripod && (
                  <DraggableSVGGroup id="tripod" isDraggable={true}>
                     <g transform={`translate(${positions.tripod.x}, ${positions.tripod.y})`}>
                      <TripodSVG width="140" height="140" />
                    </g>
                  </DraggableSVGGroup>
                )}

                {placed.spiritLamp && (
                  <DraggableSVGGroup id="spiritLamp" isDraggable={true}>
                    <g transform={`translate(${positions.spiritLamp.x}, ${positions.spiritLamp.y})`}>
                      <SpiritLampSVG isLit={false} width="90" height="90" />
                    </g>
                  </DraggableSVGGroup>
                )}
                
                {placed.wireGauze && (
                  <DraggableSVGGroup id="wireGauze" isDraggable={true}>
                    <g transform={`translate(${positions.wireGauze.x}, ${positions.wireGauze.y})`}>
                      <WireGauzeSVG width="120" height="30" />
                    </g>
                  </DraggableSVGGroup>
                )}
                
                {placed.beaker && (
                  <DraggableSVGGroup id="beaker" isDraggable={true}>
                    <g transform={`translate(${positions.beaker.x}, ${positions.beaker.y})`}>
                      {placed.water ? (
                         <BeakerFullSVG hasSoda={!!placed.bakingSoda} width="120" height="140" />
                      ) : (
                         <BeakerEmptySVG width="120" height="140" />
                      )}
                    </g>
                  </DraggableSVGGroup>
                )}
                
                {placed.glassRod && (
                  <DraggableSVGGroup id="glassRod" isDraggable={true}>
                    <g transform={`translate(${positions.glassRod.x}, ${positions.glassRod.y}) rotate(15)`}>
                      <GlassRodSVG width="70" height="140" />
                    </g>
                  </DraggableSVGGroup>
                )}
                
                {placed.thermometer && (
                  <DraggableSVGGroup id="thermometer" isDraggable={true}>
                    <g transform={`translate(${positions.thermometer.x}, ${positions.thermometer.y})`}>
                       <ThermometerSVG width="50" height="220" />
                    </g>
                  </DraggableSVGGroup>
                )}
              </svg>
            </CanvasDroppable>
          </div>
        </div>

        <DragOverlay>
          {activeItem ? (
            <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--bg-primary)', border: '2px solid #3b82f6', borderRadius: '0.75rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.9, transform: 'scale(1.1)' }}>
              <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activeItem.icon}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textAlign: 'center', color: 'var(--text-color)' }}>
                {activeItem.name}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

