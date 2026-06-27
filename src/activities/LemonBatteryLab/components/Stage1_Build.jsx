import React, { useState, useEffect } from "react";
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";
import confetti from "canvas-confetti";
import { Info, RotateCcw, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { LemonSVG, CopperStripSVG, IronNailSVG, LEDSVG, VoltmeterSVG } from "./CircuitElements2D";

const STEPS = [
  { id: "lemons", name: "Lemons (x5)", desc: ["The electrolyte."], hint: "Drag all 5 lemons onto the table.", prereq: [] },
  { id: "copper", name: "Copper Strips (x5)", desc: ["Positive electrode."], hint: "Insert one copper strip into each lemon.", prereq: ["lemons"] },
  { id: "iron", name: "Iron Nails (x5)", desc: ["Negative electrode."], hint: "Insert one iron nail into each lemon.", prereq: ["copper"] },
  { id: "wires", name: "Connect Series", desc: ["Connect the cells."], hint: "Wire Iron of Lemon 1 to Copper of Lemon 2, etc.", prereq: ["iron"] },
  { id: "led", name: "LED", desc: ["Light emitting diode."], hint: "Connect LED long leg to Lemon 1 copper, short leg to Lemon 5 iron.", prereq: ["wires"] },
];

function TrayDraggable({ id, disabled, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, disabled });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={{ opacity: isDragging ? 0.4 : 1, touchAction: "none", cursor: disabled ? "not-allowed" : "grab", width: "100%" }}>
      {children}
    </div>
  );
}

function CanvasDroppable({ children }) {
  const { setNodeRef } = useDroppable({ id: "canvas" });
  return (
    <div id="assembly-canvas" ref={setNodeRef} className="canvas-container" style={{ position: "relative", width: "100%", height: "100%", minHeight: "480px", overflow: 'hidden', borderRadius: '16px' }}>
      <div className="canvas-bg-grid" />
      {children}
    </div>
  );
}

function DraggableSVGGroup({ id, children, isDraggable, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id, disabled: !isDraggable });
  let tx = 0, ty = 0;
  if (transform) {
    const canvas = document.getElementById("assembly-canvas");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const svgScale = Math.min(rect.width / 800, rect.height / 600);
      tx = transform.x / svgScale;
      ty = transform.y / svgScale;
    }
  }
  const style = {
    transform: transform ? `translate3d(${tx}px, ${ty}px, 0)` : undefined,
    cursor: isDraggable ? (isDragging ? "grabbing" : "grab") : "pointer", touchAction: "none",
  };
  return <g ref={setNodeRef} style={style} {...listeners} {...attributes} onClick={onClick}>{children}</g>;
}

export default function Stage1_Build({ onComplete }) {
  const [placed, setPlaced] = useState({ lemons: 0, copper: 0, iron: 0, wires: 0, led: false });
  const [positions, setPositions] = useState({
    lemon1: { x: 150, y: 350 }, lemon2: { x: 280, y: 350 }, lemon3: { x: 410, y: 350 }, lemon4: { x: 540, y: 350 }, lemon5: { x: 670, y: 350 },
    led: { x: 410, y: 150 }
  });

  const IDEALS = {
    lemon1: { x: 150, y: 350 }, lemon2: { x: 280, y: 350 }, lemon3: { x: 410, y: 350 }, lemon4: { x: 540, y: 350 }, lemon5: { x: 670, y: 350 },
    led: { x: 410, y: 150 }
  };

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }));

  useEffect(() => {
    if (placed.led) {
      setSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [placed.led]);

  const isStepUnlocked = (stepId) => {
    if (stepId === "lemons") return true;
    if (stepId === "copper") return placed.lemons === 5;
    if (stepId === "iron") return placed.copper === 5;
    if (stepId === "wires") return placed.iron === 5;
    if (stepId === "led") return placed.wires === 4; // 4 inter-connections
    return false;
  };

  const handleSelectTrayItem = (stepId) => {
    if (!isStepUnlocked(stepId)) {
      setError(`Complete previous steps before selecting ${stepId}.`);
      return;
    }
    setError("");
    setSelectedItemId(stepId);
  };

  const handleDragStart = (e) => {
    setActiveDraggingId(e.active.id);
    setSelectedItemId(e.active.id.split('-')[0]); // handles multiple items like lemons-1
  };

  const handleDragEnd = (e) => {
    setActiveDraggingId(null);
    if (!e.active) return;

    const id = e.active.id;
    const canvas = document.getElementById("assembly-canvas");
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const activeRect = e.active.rect.current.translated;
    
    if (id.startsWith('lemons')) {
      if (placed.lemons < 5) {
        setPlaced(p => ({ ...p, lemons: p.lemons + 1 }));
      }
    } else if (id.startsWith('copper')) {
      if (placed.copper < 5) setPlaced(p => ({ ...p, copper: p.copper + 1 }));
    } else if (id.startsWith('iron')) {
      if (placed.iron < 5) setPlaced(p => ({ ...p, iron: p.iron + 1 }));
    } else if (id === 'led') {
      setPlaced(p => ({ ...p, led: true }));
    }
    setSelectedItemId(null);
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1rem", alignItems: "stretch" }}>
        {/* LEFT PANEL */}
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)", background: "var(--surface)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle2 size={16} className={success ? "text-success" : "text-muted"} />
              Component Tray
            </h3>
            <button onClick={() => { setPlaced({ lemons: 0, copper: 0, iron: 0, wires: 0, led: false }); setError(""); setSuccess(false); }} className="icon-btn" title="Reset Workspace" style={{ padding: "0.4rem" }}>
              <RotateCcw size={14} />
            </button>
          </div>
          
          <div style={{ padding: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", overflowY: "auto", flex: 1, alignContent: "start" }}>
            {STEPS.map((step) => {
              const unlocked = isStepUnlocked(step.id);
              let isDone = false;
              if (step.id === 'lemons') isDone = placed.lemons === 5;
              if (step.id === 'copper') isDone = placed.copper === 5;
              if (step.id === 'iron') isDone = placed.iron === 5;
              if (step.id === 'wires') isDone = placed.wires === 4;
              if (step.id === 'led') isDone = placed.led;
              
              const isSelected = selectedItemId === step.id;
              
              return (
                <div key={step.id} onClick={() => handleSelectTrayItem(step.id)} style={{ position: 'relative', cursor: unlocked ? 'pointer' : 'not-allowed', opacity: unlocked ? 1 : 0.6, border: `2px solid ${isSelected ? 'var(--primary)' : isDone ? 'var(--success-border)' : 'var(--border)'}`, borderRadius: '12px', padding: '0.75rem', background: isSelected ? 'var(--primary-light)' : 'var(--surface)', transition: 'all 0.2s' }}>
                  {!unlocked && <Lock size={14} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", color: "var(--text-faint)" }} />}
                  {isDone && <CheckCircle2 size={14} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", color: "var(--success)" }} />}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", height: "100%" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: '1.5rem', fontFamily: 'monospace' }}>[ ]</span>
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: "600", textAlign: "center", color: isSelected ? 'var(--primary)' : 'var(--text-secondary)' }}>
                      {step.name}
                    </span>
                  </div>
                  {unlocked && !isDone && (
                    <TrayDraggable id={step.id}>
                      <div style={{ position: "absolute", inset: 0, zIndex: 10 }} />
                    </TrayDraggable>
                  )}
                </div>
              );
            })}
          </div>
          
          <div style={{ padding: "1rem", borderTop: "1px solid var(--border)", background: "var(--neutral-bg)", minHeight: "120px" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Info size={14} /> Instructions
            </h4>
            {error ? (
              <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--danger)", lineHeight: "1.4" }}>{error}</p>
            ) : selectedItemId ? (
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                <strong style={{ color: "var(--text-primary)" }}>{STEPS.find(s => s.id === selectedItemId)?.hint}</strong>
                <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1.2rem", color: "var(--text-faint)" }}>
                  {STEPS.find(s => s.id === selectedItemId)?.desc.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-faint)", fontStyle: "italic" }}>
                {success ? "Circuit complete! Click 'Continue' to test." : "Select a component from the tray to begin."}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, position: "relative", minHeight: "480px", display: "flex", flexDirection: "column", background: "var(--canvas-bg)", borderRadius: "16px", border: "1px solid var(--canvas-border)", overflow: "hidden" }}>
          
          <CanvasDroppable>
            <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ position: "absolute", top: 0, left: 0 }}>
              
              {/* Wiring (Simulated) */}
              {placed.wires > 0 && <line x1={positions.lemon1.x+30} y1={positions.lemon1.y-20} x2={positions.lemon2.x-30} y2={positions.lemon2.y-20} stroke="#333" strokeWidth="3" />}
              {placed.wires > 1 && <line x1={positions.lemon2.x+30} y1={positions.lemon2.y-20} x2={positions.lemon3.x-30} y2={positions.lemon3.y-20} stroke="#333" strokeWidth="3" />}
              {placed.wires > 2 && <line x1={positions.lemon3.x+30} y1={positions.lemon3.y-20} x2={positions.lemon4.x-30} y2={positions.lemon4.y-20} stroke="#333" strokeWidth="3" />}
              {placed.wires > 3 && <line x1={positions.lemon4.x+30} y1={positions.lemon4.y-20} x2={positions.lemon5.x-30} y2={positions.lemon5.y-20} stroke="#333" strokeWidth="3" />}
              
              {placed.led && (
                <>
                  <path d={`M ${positions.led.x-20},${positions.led.y+40} L ${positions.lemon1.x-30},${positions.lemon1.y-20}`} stroke="#ef4444" strokeWidth="3" fill="none" />
                  <path d={`M ${positions.led.x+20},${positions.led.y+40} L ${positions.lemon5.x+30},${positions.lemon5.y-20}`} stroke="#3b82f6" strokeWidth="3" fill="none" />
                </>
              )}

              {/* Components */}
              {[1,2,3,4,5].map(i => (
                placed.lemons >= i && (
                  <LemonSVG 
                    key={`lemon-${i}`} 
                    x={positions[`lemon${i}`].x - 50} 
                    y={positions[`lemon${i}`].y - 50} 
                    hasCopper={placed.copper >= i}
                    hasIron={placed.iron >= i}
                  />
                )
              ))}

              {placed.led && <LEDSVG x={positions.led.x - 40} y={positions.led.y - 40} isGlowing={success} />}
              
            </svg>
          </CanvasDroppable>

          {/* Controls */}
          {placed.iron === 5 && placed.wires < 4 && (
            <div style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 50 }}>
               <button onClick={() => setPlaced(p => ({ ...p, wires: p.wires + 1 }))} className="primary">Connect Next Wire</button>
            </div>
          )}

          {success && (
            <div style={{ position: "absolute", bottom: "1.5rem", right: "1.5rem", zIndex: 50 }}>
              <button onClick={onComplete} className="primary" style={{ padding: "0.75rem 1.5rem", fontSize: "1rem", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}>
                Continue to Testing <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <DragOverlay>
        {activeDraggingId ? (
          <div style={{ transform: "scale(1.2)", opacity: 0.8, filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.2))" }}>
             <span style={{ fontSize: '3rem', fontFamily: 'monospace', background: 'white', border: '2px solid black', padding: '10px' }}>[ ]</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
