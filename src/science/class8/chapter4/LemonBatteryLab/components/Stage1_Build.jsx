import React, { useState, useEffect } from "react";
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";
import confetti from "canvas-confetti";
import { Info, RotateCcw, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { LemonSVG, CopperStripSVG, IronNailSVG, LEDSVG, VoltmeterSVG } from "./CircuitElements2D";
import ReferenceOverlay from "../../../../../components/ReferenceOverlay";
import blueprintImg from "../../../../../assets/lemon_battery_blueprint.png";

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
  const [placed, setPlaced] = useState({ lemons: 0, copper: 0, iron: 0, wires: 0, led: false, ledWires: 0 });
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
    if (placed.ledWires === 2) {
      setSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [placed.ledWires]);

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
    const svgScale = Math.min(rect.width / 800, rect.height / 600);
    
    if (id.startsWith('placed-lemon-')) {
       const index = id.split('-')[2];
       if (e.delta) {
          setPositions(p => ({
            ...p,
            [`lemon${index}`]: {
              x: p[`lemon${index}`].x + (e.delta.x / svgScale),
              y: p[`lemon${index}`].y + (e.delta.y / svgScale)
            }
          }));
       }
       return;
    }
    
    if (id === 'placed-led') {
       if (e.delta) {
          setPositions(p => ({
            ...p,
            led: {
              x: p.led.x + (e.delta.x / svgScale),
              y: p.led.y + (e.delta.y / svgScale)
            }
          }));
       }
       return;
    }

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
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1rem", alignItems: "stretch", width: '100%' }}>
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
              if (step.id === 'led') isDone = placed.led && placed.ledWires === 2;
              
              const isSelected = selectedItemId === step.id;
              
              return (
                <div key={step.id} onClick={() => handleSelectTrayItem(step.id)} style={{ position: 'relative', cursor: unlocked ? 'pointer' : 'not-allowed', opacity: unlocked ? 1 : 0.6, border: `2px solid ${isSelected ? 'var(--primary)' : isDone ? 'var(--success-border)' : 'var(--border)'}`, borderRadius: '12px', padding: '0.75rem', background: isSelected ? 'var(--primary-light)' : 'var(--surface)', transition: 'all 0.2s' }}>
                  {!unlocked && <Lock size={14} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", color: "var(--text-faint)" }} />}
                  {isDone && <CheckCircle2 size={14} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", color: "var(--success)" }} />}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", height: "100%" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50px" }}>
                      {step.id === 'lemons' && <svg width="100" height="60"><LemonSVG scale={0.5} x={0} y={-20} /></svg>}
                      {step.id === 'copper' && <svg width="40" height="60"><CopperStripSVG scale={0.7} x={15} y={10} /></svg>}
                      {step.id === 'iron' && <svg width="40" height="60"><IronNailSVG scale={0.7} x={15} y={10} /></svg>}
                      {step.id === 'wires' && (
                        <svg width="60" height="60" viewBox="0 0 40 40">
                          <path d="M 5,20 C 15,0 25,40 35,20" fill="none" stroke="#475569" strokeWidth="3" />
                          <circle cx="5" cy="20" r="3" fill="#ef4444" />
                          <circle cx="35" cy="20" r="3" fill="#10b981" />
                        </svg>
                      )}
                      {step.id === 'led' && <svg width="60" height="60"><LEDSVG scale={0.5} x={5} y={-5} /></svg>}
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: "600", textAlign: "center", color: isSelected ? 'var(--primary)' : 'var(--text-secondary)' }}>
                      {step.id === 'lemons' ? `Lemons (x${5 - placed.lemons})` : 
                       step.id === 'copper' ? `Copper Strips (x${5 - placed.copper})` : 
                       step.id === 'iron' ? `Iron Nails (x${5 - placed.iron})` : 
                       step.id === 'wires' ? `Connect Series (x${4 - placed.wires})` : 
                       step.name}
                    </span>
                  </div>
                  {unlocked && !isDone && step.id !== 'wires' && (
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
          
          <ReferenceOverlay title="Lemon Battery Blueprint">
            <img src={blueprintImg} alt="Lemon Battery Reference" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </ReferenceOverlay>

          <CanvasDroppable>
            <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ position: "absolute", top: 0, left: 0 }}>
              
              {/* Wiring (Simulated Clickable) */}
              {[1, 2, 3, 4].map(i => {
                if (placed.iron < 5) return null; // Only show placeholders when nails are in
                const startX = positions[`lemon${i}`].x + 19;
                const startY = positions[`lemon${i}`].y - 35;
                const endX = positions[`lemon${i+1}`].x - 20;
                const endY = positions[`lemon${i+1}`].y - 30;
                const midX = (startX + endX) / 2;
                const midY = Math.min(startY, endY) - 30;
                
                const d = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
                const isConnected = placed.wires >= i;
                const isNext = placed.wires === (i - 1);

                return (
                  <g key={`wire-${i}`}>
                    {!isConnected && isNext && (
                      <path 
                        d={d} 
                        fill="none" 
                        stroke="rgba(0,0,0,0)" 
                        strokeWidth="24" 
                        style={{ cursor: "pointer", pointerEvents: "stroke" }}
                        onClick={() => setPlaced(p => ({ ...p, wires: p.wires + 1 }))}
                      />
                    )}
                    {(isConnected || isNext) && (
                      <path 
                        d={d} 
                        fill="none" 
                        stroke={isConnected ? "#3b82f6" : "#94a3b8"} 
                        strokeWidth={isConnected ? "4" : "3"}
                        strokeDasharray={isConnected ? "none" : "6,6"}
                        style={{ pointerEvents: "none" }}
                      />
                    )}
                  </g>
                );
              })}
              
              {placed.led && (
                <>
                  {/* LED Wire 1 (Anode to Lemon 1) */}
                  <g>
                    {placed.ledWires < 1 && (
                      <path 
                        d={`M ${positions.led.x-10} ${positions.led.y+40} Q ${positions.led.x-30} ${positions.led.y+60} ${positions.lemon1.x-20} ${positions.lemon1.y-30}`}
                        fill="none" 
                        stroke="rgba(0,0,0,0)" 
                        strokeWidth="24" 
                        style={{ cursor: "pointer", pointerEvents: "stroke" }}
                        onClick={() => setPlaced(p => ({ ...p, ledWires: p.ledWires + 1 }))}
                      />
                    )}
                    <path 
                      d={`M ${positions.led.x-10} ${positions.led.y+40} Q ${positions.led.x-30} ${positions.led.y+60} ${positions.lemon1.x-20} ${positions.lemon1.y-30}`}
                      fill="none" 
                      stroke={placed.ledWires >= 1 ? "#ef4444" : "#fca5a5"} 
                      strokeWidth={placed.ledWires >= 1 ? "4" : "3"} 
                      strokeDasharray={placed.ledWires >= 1 ? "none" : "6,6"}
                      style={{ pointerEvents: "none" }}
                    />
                    {placed.ledWires < 1 && (
                      <circle cx={positions.led.x-25} cy={positions.led.y+50} r="6" fill="#ef4444" style={{ pointerEvents: "none", animation: "pulse 1.5s infinite" }} />
                    )}
                  </g>

                  {/* LED Wire 2 (Cathode to Lemon 5) */}
                  <g>
                    {placed.ledWires === 1 && (
                      <path 
                        d={`M ${positions.led.x+10} ${positions.led.y+30} Q ${positions.led.x+30} ${positions.led.y+50} ${positions.lemon5.x+19} ${positions.lemon5.y-35}`}
                        fill="none" 
                        stroke="rgba(0,0,0,0)" 
                        strokeWidth="24" 
                        style={{ cursor: "pointer", pointerEvents: "stroke" }}
                        onClick={() => setPlaced(p => ({ ...p, ledWires: p.ledWires + 1 }))}
                      />
                    )}
                    {(placed.ledWires >= 1) && (
                      <path 
                        d={`M ${positions.led.x+10} ${positions.led.y+30} Q ${positions.led.x+30} ${positions.led.y+50} ${positions.lemon5.x+19} ${positions.lemon5.y-35}`}
                        fill="none" 
                        stroke={placed.ledWires === 2 ? "#3b82f6" : "#93c5fd"} 
                        strokeWidth={placed.ledWires === 2 ? "4" : "3"} 
                        strokeDasharray={placed.ledWires === 2 ? "none" : "6,6"}
                        style={{ pointerEvents: "none" }}
                      />
                    )}
                    {placed.ledWires === 1 && (
                      <circle cx={positions.led.x+25} cy={positions.led.y+40} r="6" fill="#3b82f6" style={{ pointerEvents: "none", animation: "pulse 1.5s infinite" }} />
                    )}
                  </g>
                </>
              )}

              {/* Components */}
              {[1,2,3,4,5].map(i => (
                placed.lemons >= i && (
                  <DraggableSVGGroup
                    key={`placed-lemon-${i}`}
                    id={`placed-lemon-${i}`}
                    isDraggable={true}
                  >
                    <LemonSVG 
                      x={positions[`lemon${i}`].x - 50} 
                      y={positions[`lemon${i}`].y - 50} 
                      hasCopper={placed.copper >= i}
                      hasIron={placed.iron >= i}
                    />
                  </DraggableSVGGroup>
                )
              ))}

              {placed.led && (
                <DraggableSVGGroup
                  key="placed-led"
                  id="placed-led"
                  isDraggable={true}
                >
                  <LEDSVG x={positions.led.x - 40} y={positions.led.y - 40} isGlowing={success} />
                </DraggableSVGGroup>
              )}
              
            </svg>
          </CanvasDroppable>

          {/* Controls */}

          {success && (
            <div style={{ position: "absolute", bottom: "1.5rem", right: "1.5rem", zIndex: 50 }}>
              <button onClick={onComplete} className="primary" style={{ padding: "0.75rem 1.5rem", fontSize: "1rem", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}>
                Continue to Testing <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <DragOverlay dropAnimation={null}>
        {activeDraggingId ? (
          <div style={{ opacity: 0.8, filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.2))" }}>
             {activeDraggingId.startsWith('lemons') && <svg width="100" height="100" style={{ overflow: 'visible' }}><LemonSVG scale={1} x={0} y={0} /></svg>}
             {activeDraggingId.startsWith('copper') && <svg width="50" height="100" style={{ overflow: 'visible' }}><CopperStripSVG scale={1} x={15} y={0} /></svg>}
             {activeDraggingId.startsWith('iron') && <svg width="50" height="100" style={{ overflow: 'visible' }}><IronNailSVG scale={1} x={15} y={0} /></svg>}
             {activeDraggingId.startsWith('wires') && (
                <svg width="60" height="60" viewBox="0 0 40 40">
                  <path d="M 5,20 C 15,0 25,40 35,20" fill="none" stroke="#475569" strokeWidth="3" />
                </svg>
             )}
             {activeDraggingId.startsWith('led') && <svg width="80" height="100" style={{ overflow: 'visible' }}><LEDSVG scale={1} x={0} y={0} /></svg>}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
