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
} from "lucide-react";
import ThreeDViewer from "./ThreeDViewer";
import {
  CardboardSwitchSVG,
  CompassCardboardSVG,
  DrawingPinSVG,
  SafetyPinSVG,
  BatterySVG,
  CompassSVG,
  WiresSVG,
} from "./CircuitElements";

const STEPS = [
  {
    id: "switchBoard",
    name: "Switch Board",
    desc: [
      "A sturdy base made of cardboard to hold our switch parts securely.",
      "It provides a safe, non-conductive surface to work on.",
      "The small size makes it easy to move and place in our circuit.",
      "It acts as the foundation for the drawing pins and safety pin.",
      "Cardboard is an insulator, so electricity won't flow through it!"
    ],
    hint: "Drag the switch board onto the left side of the canvas.",
    prereq: [],
  },
  {
    id: "pin1",
    name: "Drawing Pin 1",
    desc: [
      "Acts as the starting terminal for our switch, where electricity enters.",
      "Made of metal, it is a great conductor of electricity.",
      "It anchors the safety pin so it can pivot like a hinge.",
      "Pushed into the cardboard base to stay firmly in place.",
      "It forms the first half of our simple electrical switch."
    ],
    hint: "Place the first drawing pin into the switch board.",
    prereq: [],
  },
  {
    id: "safetyPin",
    name: "Safety Pin",
    desc: [
      "Made of metal, it conducts electricity and acts like a bridge.",
      "It can swing open or closed to control the flow of current.",
      "When closed, it lets electricity pass through the circuit.",
      "When open, the circuit breaks, stopping the electricity.",
      "This is exactly how light switches in your house work!"
    ],
    hint: "Attach the safety pin to the first drawing pin.",
    prereq: [],
  },
  {
    id: "pin2",
    name: "Drawing Pin 2",
    desc: [
      "Acts as the ending terminal. When touched, the bridge is complete!",
      "It is placed at a specific distance so the safety pin can reach it.",
      "Like the first pin, it is pushed securely into the cardboard base.",
      "It completes the pathway for electricity to continue flowing.",
      "It's a simple but vital part of our switch mechanism."
    ],
    hint: "Fix the second drawing pin so the safety pin can touch it.",
    prereq: [],
  },
  {
    id: "compassBoard",
    name: "Compass Bench",
    desc: [
      "A base with two nails to hold the wire straight over the compass.",
      "It creates a steady platform for the magnetic compass to sit on.",
      "The nails help stretch the copper wire directly across the compass.",
      "This setup ensures the compass is perfectly aligned with the wire.",
      "It makes Oersted's experiment easy to observe and measure!"
    ],
    hint: "Place the compass bench on the right side of the canvas.",
    prereq: [],
  },
  {
    id: "compass",
    name: "Magnetic Compass",
    desc: [
      "A tiny magnet that points North. It will wiggle if there's a magnetic field!",
      "It detects invisible magnetic forces around it.",
      "Normally, it aligns with Earth's natural magnetic field.",
      "When electricity flows nearby, its needle will deflect.",
      "This deflection proves that electricity creates magnetism!"
    ],
    hint: "Place the compass between the two nails on the compass bench.",
    prereq: [],
  },
  {
    id: "battery",
    name: "Electric Cell",
    desc: [
      "The power source! It pushes electrical energy through the wires.",
      "It converts stored chemical energy into electrical energy.",
      "It has a positive (+) terminal and a negative (-) terminal.",
      "Current flows from one terminal, through the circuit, to the other.",
      "Without it, there would be no electricity and no magnetic field!"
    ],
    hint: "Place the battery on the canvas.",
    prereq: [],
  },
  {
    id: "wires",
    name: "Connecting Wires",
    desc: [
      "Copper pathways that carry the electric current to the other parts.",
      "Covered in plastic insulation to keep the electricity safely inside.",
      "They act like water pipes, but for electrical charges instead of water.",
      "They must form a continuous, unbroken loop for current to flow.",
      "They are the final pieces needed to connect our entire circuit together!"
    ],
    hint: "Connect the battery, switch, and the nails.",
    prereq: ["switchBoard", "pin1", "safetyPin", "pin2", "compassBoard", "compass", "battery"],
  },
];

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
      }}
    >
      <div className="canvas-bg-grid" />
      {children}
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

export default function Stage1_Build({ onComplete }) {
  const [placed, setPlaced] = useState({
    switchBoard: false,
    pin1: false,
    safetyPin: false,
    pin2: false,
    compassBoard: false,
    compass: false,
    battery: false,
    wires: false,
  });

  const [positions, setPositions] = useState({
    switchBoard: { x: 370, y: 200 },
    compassBoard: { x: 120, y: 60 },
    pin1: { x: 450, y: 250 },
    safetyPin: { x: 450, y: 250 },
    pin2: { x: 450, y: 370 },
    compass: { x: 250, y: 150 },
    battery: { x: 44, y: 366 },
  });

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [connectedWires, setConnectedWires] = useState([]);
  const [selectedTerminal, setSelectedTerminal] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  );

  useEffect(() => {
    if (connectedWires.length === 4) {
      setPlaced((prev) => ({ ...prev, wires: true }));
      setSuccess(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  }, [connectedWires]);

  const IDEALS = {
    switchBoard: { x: 370, y: 200 },
    compassBoard: { x: 120, y: 60 },
    pin1: { x: 450, y: 250 },
    safetyPin: { x: 450, y: 250 },
    pin2: { x: 450, y: 370 },
    compass: { x: 250, y: 150 }, 
    battery: { x: 44, y: 366 },
  };

  const snapToIdeal = (id, x, y) => {
    const ideal = IDEALS[id];
    if (!ideal) return { x, y };

    const dist = Math.sqrt((x - ideal.x) ** 2 + (y - ideal.y) ** 2);
    if (dist < 40) {
      return ideal; 
    }
    return { x, y }; 
  };

  const isProperlyPlaced = (id) => {
    if (!placed[id]) return false;
    
    if (id === "safetyPin") return true; 

    if (id === "compass") {
      const dx = positions.compass.x - (positions.compassBoard.x + 130);
      const dy = positions.compass.y - (positions.compassBoard.y + 90);
      return Math.sqrt(dx * dx + dy * dy) < 40;
    }
    if (id === "pin1") {
      const dx = positions.pin1.x - (positions.switchBoard.x + 80);
      const dy = positions.pin1.y - (positions.switchBoard.y + 50);
      return Math.sqrt(dx * dx + dy * dy) < 40;
    }
    if (id === "pin2") {
      const dx = positions.pin2.x - (positions.switchBoard.x + 80);
      const dy = positions.pin2.y - (positions.switchBoard.y + 170);
      return Math.sqrt(dx * dx + dy * dy) < 40;
    }
    
    return true; 
  };

  const isStepUnlocked = (stepId) => {
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return false;
    if (stepId === "wires") {
      return step.prereq.every((pId) => isProperlyPlaced(pId));
    }
    return step.prereq.every((pId) => placed[pId] === true);
  };

  const handleSelectTrayItem = (stepId) => {
    if (placed[stepId] && stepId !== "wires") return;
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return;

    if (!isStepUnlocked(stepId)) {
      if (stepId === "wires") {
        setError(`❌ Cannot select "${step.name}" yet. Ensure all components are snapped correctly to their final positions.`);
      } else {
        setError(`❌ Cannot select "${step.name}" yet. Check prerequisites.`);
      }
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
        const svgScale = Math.min(rect.width / 600, rect.height / 480);
        const offsetX = (rect.width - 600 * svgScale) / 2;
        const offsetY = (rect.height - 480 * svgScale) / 2;
        
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

          if (draggedId === "switchBoard") { x -= 80; y -= 105; }
          if (draggedId === "compassBoard") { x -= 100; y -= 75; }
        }

        const snapped = snapToIdeal(draggedId, x, y);
        x = snapped.x;
        y = snapped.y;

        x = Math.max(0, Math.min(600, x));
        y = Math.max(0, Math.min(480, y));

        setPositions((prev) => {
          const newPos = { ...prev, [draggedId]: { x, y } };
          if (draggedId === "pin1") {
            newPos.safetyPin = { x, y }; 
          }
          if (draggedId === "compassBoard") {
            // Move compass proportionally if it is placed
            if (placed.compass) {
              const dx = x - prev.compassBoard.x;
              const dy = y - prev.compassBoard.y;
              newPos.compass = { x: prev.compass.x + dx, y: prev.compass.y + dy };
            }
          }
          return newPos;
        });

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
      switchBoard: false,
      pin1: false,
      safetyPin: false,
      pin2: false,
      compassBoard: false,
      compass: false,
      battery: false,
      wires: false,
    });
    setPositions({
      switchBoard: { x: 370, y: 200 },
      compassBoard: { x: 120, y: 60 },
      pin1: { x: 450, y: 250 },
      safetyPin: { x: 450, y: 250 },
      pin2: { x: 450, y: 370 },
      compass: { x: 250, y: 150 },
      battery: { x: 44, y: 366 },
    });
    setSelectedItemId(null);
    setConnectedWires([]);
    setSelectedTerminal(null);
    setError("");
    setSuccess(false);
  };

  const getTerminalCoords = (terminalId) => {
    const battery = positions.battery;
    const pin1 = positions.pin1;
    const pin2 = positions.pin2;
    const compassBoard = positions.compassBoard;

    switch (terminalId) {
      case "battery-neg": return { x: battery.x, y: battery.y + 20 };
      case "battery-pos": return { x: battery.x + 91, y: battery.y + 20 };
      case "pin1": return { x: pin1.x, y: pin1.y };
      case "pin2": return { x: pin2.x, y: pin2.y };
      case "nail1": return { x: compassBoard.x + 40, y: compassBoard.y + 90 };
      case "nail2": return { x: compassBoard.x + 200, y: compassBoard.y + 90 };
      default: return { x: 0, y: 0 };
    }
  };

  const getWirePath = (p1, p2) => {
    const controlY = Math.max(p1.y, p2.y) + 40 + Math.abs(p1.x - p2.x) * 0.1;
    return `M ${p1.x},${p1.y} C ${p1.x},${controlY} ${p2.x},${controlY} ${p2.x},${p2.y}`;
  };

  const getWireKey = (t1, t2) => {
    return [t1, t2].sort().join(" <-> ");
  };

  const handleTerminalClick = (terminalId) => {
    setError("");
    if (!selectedTerminal) {
      setSelectedTerminal(terminalId);
    } else {
      if (selectedTerminal === terminalId) {
        setSelectedTerminal(null);
        return;
      }

      const t1 = selectedTerminal;
      const t2 = terminalId;
      const wireKey = getWireKey(t1, t2);

      const standardValid = {
        "battery-pos <-> pin2": "w1",
        "nail2 <-> pin1": "w2",
        "battery-neg <-> nail1": "w3",
        "nail1 <-> nail2": "w4",
      };

      const wireId = standardValid[wireKey];

      if (wireId) {
        if (connectedWires.includes(wireId)) {
          setError("ℹ️ This connection is already established!");
        } else {
          setConnectedWires((prev) => [...prev, wireId]);
          confetti({ particleCount: 25, spread: 35, origin: { y: 0.8 } });
        }
      } else {
        if (t1.startsWith("battery") && t2.startsWith("battery")) {
          setError("❌ Short Circuit! Don't connect battery terminals directly.");
        } else {
          setError("❌ Invalid connection. Think about the circuit loop needed for Oersted's experiment.");
        }
      }
      setSelectedTerminal(null);
    }
  };

  const terminals = [
    { id: "battery-neg", label: "Battery (-)", color: "var(--text-primary)" },
    { id: "battery-pos", label: "Battery (+)", color: "var(--danger)" },
    { id: "pin1", label: "Pin 1", color: "var(--warning)" },
    { id: "pin2", label: "Pin 2", color: "var(--warning)" },
    { id: "nail1", label: "Nail 1", color: "var(--text-secondary)" },
    { id: "nail2", label: "Nail 2", color: "var(--text-secondary)" },
  ];

  const physicalSteps = STEPS.map(s => s.id).filter(id => id !== "wires");
  const physicalPlacedCount = physicalSteps.filter((k) => placed[k]).length;
  const completedCount = physicalPlacedCount + (placed.wires ? 1 : 0);
  const progressPercent = (completedCount / STEPS.length) * 100;

  const activeStep = STEPS.find((s) => s.id === selectedItemId);

  const renderThumbnailSVG = (id) => {
    switch (id) {
      case "switchBoard": return <svg viewBox="360 190 180 230" width="24" height="24"><CardboardSwitchSVG /></svg>;
      case "pin1":
      case "pin2": return <svg viewBox="430 230 40 40" width="24" height="24"><DrawingPinSVG x={450} y={250} isPlaced={true} /></svg>;
      case "safetyPin": return <svg viewBox="-20 -20 40 150" width="24" height="24"><SafetyPinSVG x={0} y={0} rotation={0} isPlaced={true} /></svg>;
      case "compassBoard": return <svg viewBox="100 50 250 180" width="24" height="24"><CompassCardboardSVG /></svg>;
      case "compass": return <svg viewBox="170 85 100 100" width="24" height="24"><CompassSVG isPlaced={true} /></svg>;
      case "battery": return <svg viewBox="40 365 100 50" width="24" height="24"><BatterySVG isPlaced={true} /></svg>;
      case "wires": return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12c0-4 3-7 8-7s8 3 8 7-3 7-8 7" stroke="var(--danger)" /><path d="M6 13c0-3 2.5-5 6-5s6 2 6 5-2 5-6 5" stroke="var(--warning)" /></svg>;
      default: return null;
    }
  };

  const getNextStepPrompt = () => {
    if (success) return "✅ Circuit Constructed Successfully!";
    if (selectedItemId === "wires") return "Instruction: Click the glowing terminals to connect the circuit automatically.";
    const remaining = STEPS.filter((s) => s.id !== "wires" && !placed[s.id]);
    if (remaining.length > 0) return `${remaining.length} component(s) left — pick any from the Component Tray.`;
    return "⚡ All components placed! Now select Connecting Wires to link everything together.";
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="main-grid" style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <span className="status-badge neutral" style={{ background: "var(--accent-bg)", color: "var(--accent-text)", fontWeight: "bold" }}>
              Stage 1: Assemble the Circuit
            </span>
            <h2 style={{ margin: "0.2rem 0 0 0", fontSize: "1.4rem" }}>Construct the Oersted Circuit</h2>
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

            <h3 style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-primary)" }}>Component Tray</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", alignContent: "start" }}>
              {STEPS.map((step) => {
                const isPlaced = placed[step.id];
                const isWires = step.id === "wires";
                const isUnlocked = isStepUnlocked(step.id);
                const isSelected = selectedItemId === step.id;
                const isDisabled = (isPlaced && !isWires) || !isUnlocked;

                return (
                  <TrayDraggable key={step.id} id={step.id} disabled={isDisabled}>
<button
                    key={step.id}
                    onClick={() => handleSelectTrayItem(step.id)}
                    disabled={isDisabled}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0.6rem 0.4rem", borderRadius: "12px",
                      background: isPlaced && !isWires ? "var(--success-bg)" : isSelected ? "var(--accent-bg)" : isUnlocked ? "var(--surface)" : "var(--neutral-bg)",
                      border: `1px solid ${isPlaced && !isWires ? "var(--success-border)" : isSelected ? "var(--accent)" : isUnlocked ? "var(--accent-border)" : "var(--border)"}`,
                      color: isPlaced && !isWires ? "var(--success)" : isUnlocked ? "var(--text-primary)" : "var(--text-faint)",
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
                      {isPlaced && !isWires ? (
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
          </div>

          {/* RIGHT PANEL: CANVAS */}
          <div style={{ flex: 1, position: "relative", minHeight: "480px", display: "flex", flexDirection: "column", background: "var(--canvas-bg)", borderRadius: "16px", border: "1px solid var(--canvas-border)", overflow: "hidden" }}>
            <CanvasDroppable>
              <svg width="100%" height="100%" viewBox="0 0 600 480" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                
                {/* Visual Guidelines */}
                {!placed.switchBoard && (
                  <rect x={370} y={200} width={160} height={210} rx={12} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="4,4" opacity={0.3} />
                )}
                {!placed.compassBoard && (
                  <rect x={120} y={60} width={260} height={180} rx={12} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="4,4" opacity={0.3} />
                )}
                {!placed.pin1 && (
                  <circle cx={450} cy={250} r={14} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" opacity={0.3} />
                )}
                {!placed.pin2 && (
                  <circle cx={450} cy={370} r={14} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" opacity={0.3} />
                )}

                {/* Real Placed Items */}
                {placed.switchBoard && (
                  <DraggableSVGGroup id="switchBoard" isDraggable={!placed.wires}>
                    <CardboardSwitchSVG x={positions.switchBoard.x} y={positions.switchBoard.y} />
                  </DraggableSVGGroup>
                )}
                {placed.compassBoard && (
                  <DraggableSVGGroup id="compassBoard" isDraggable={!placed.wires}>
                    <CompassCardboardSVG x={positions.compassBoard.x} y={positions.compassBoard.y} />
                  </DraggableSVGGroup>
                )}
                
                {placed.pin1 && (
                  <DraggableSVGGroup id="pin1" isDraggable={!placed.wires}>
                    <DrawingPinSVG x={positions.pin1.x} y={positions.pin1.y} label="PIN 1" isPlaced={true} />
                    {placed.safetyPin && (
                      <SafetyPinSVG x={positions.pin1.x} y={positions.pin1.y} rotation={-30} isPlaced={true} />
                    )}
                  </DraggableSVGGroup>
                )}
                
                {placed.pin2 && (
                  <DraggableSVGGroup id="pin2" isDraggable={!placed.wires}>
                    <DrawingPinSVG x={positions.pin2.x} y={positions.pin2.y} label="PIN 2" isPlaced={true} />
                  </DraggableSVGGroup>
                )}
                
                {placed.safetyPin && !placed.pin1 && (
                  <DraggableSVGGroup id="safetyPin" isDraggable={!placed.wires}>
                    <SafetyPinSVG x={positions.safetyPin.x} y={positions.safetyPin.y} rotation={-30} isPlaced={true} />
                  </DraggableSVGGroup>
                )}
                
                {placed.compass && (
                  <DraggableSVGGroup id="compass" isDraggable={!placed.wires}>
                    <g transform={`translate(${positions.compass.x - 250}, ${positions.compass.y - 150})`}>
                      <CompassSVG x={250} y={150} isPlaced={true} />
                    </g>
                  </DraggableSVGGroup>
                )}
                
                {placed.battery && (
                  <DraggableSVGGroup id="battery" isDraggable={!placed.wires}>
                    <g transform={`translate(${positions.battery.x - 44}, ${positions.battery.y - 366})`}>
                      <BatterySVG isPlaced={true} />
                    </g>
                  </DraggableSVGGroup>
                )}
                
                {/* DOTTED GUIDES FOR WIRES */}
                {selectedItemId === "wires" && (
                   <g opacity={0.5}>
                     {!connectedWires.includes("w1") && <path d={getWirePath(getTerminalCoords("battery-pos"), getTerminalCoords("pin2"))} fill="none" stroke="var(--accent)" strokeWidth={3} strokeDasharray="6,6" />}
                     {!connectedWires.includes("w2") && <path d={getWirePath(getTerminalCoords("pin1"), getTerminalCoords("nail2"))} fill="none" stroke="var(--accent)" strokeWidth={3} strokeDasharray="6,6" />}
                     {!connectedWires.includes("w3") && <path d={getWirePath(getTerminalCoords("nail1"), getTerminalCoords("battery-neg"))} fill="none" stroke="var(--accent)" strokeWidth={3} strokeDasharray="6,6" />}
                     {!connectedWires.includes("w4") && <path d={`M ${getTerminalCoords("nail1").x},${getTerminalCoords("nail1").y} L ${getTerminalCoords("nail2").x},${getTerminalCoords("nail2").y}`} fill="none" stroke="var(--accent)" strokeWidth={3} strokeDasharray="6,6" />}
                   </g>
                )}

                {/* DYNAMIC WIRES */}
                {connectedWires.includes("w1") && (
                  <>
                    <path d={getWirePath(getTerminalCoords("battery-pos"), getTerminalCoords("pin2"))} fill="none" stroke="#ca8a04" strokeWidth={5} strokeLinecap="round" />
                    <path d={getWirePath(getTerminalCoords("battery-pos"), getTerminalCoords("pin2"))} fill="none" stroke="#fde047" strokeWidth={2.5} strokeLinecap="round" />
                  </>
                )}
                {connectedWires.includes("w2") && (
                  <>
                    <path d={getWirePath(getTerminalCoords("pin1"), getTerminalCoords("nail2"))} fill="none" stroke="#b91c1c" strokeWidth={5} strokeLinecap="round" />
                    <path d={getWirePath(getTerminalCoords("pin1"), getTerminalCoords("nail2"))} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" />
                  </>
                )}
                {connectedWires.includes("w3") && (
                  <>
                    <path d={getWirePath(getTerminalCoords("nail1"), getTerminalCoords("battery-neg"))} fill="none" stroke="#374151" strokeWidth={5} strokeLinecap="round" />
                    <path d={getWirePath(getTerminalCoords("nail1"), getTerminalCoords("battery-neg"))} fill="none" stroke="#6b7280" strokeWidth={2.5} strokeLinecap="round" />
                  </>
                )}
                {connectedWires.includes("w4") && (
                  <>
                    <path d={`M ${getTerminalCoords("nail1").x},${getTerminalCoords("nail1").y} L ${getTerminalCoords("nail2").x},${getTerminalCoords("nail2").y}`} fill="none" stroke="#b45309" strokeWidth={6} strokeLinecap="round" />
                    <path d={`M ${getTerminalCoords("nail1").x},${getTerminalCoords("nail1").y} L ${getTerminalCoords("nail2").x},${getTerminalCoords("nail2").y}`} fill="none" stroke="#f59e0b" strokeWidth={3} strokeLinecap="round" />
                  </>
                )}

                {/* TERMINAL DOTS FOR WIRE CONNECTION */}
                {selectedItemId === "wires" && terminals.map(t => {
                  const coords = getTerminalCoords(t.id);
                  const isSelected = selectedTerminal === t.id;
                  let isConnected = false;
                  if (t.id === "battery-pos" || t.id === "pin2") isConnected = connectedWires.includes("w1");
                  if (t.id === "pin1" || t.id === "nail2") isConnected = connectedWires.includes("w2");
                  if (t.id === "battery-neg" || t.id === "nail1") isConnected = connectedWires.includes("w3");
                  
                  // nail1 and nail2 are also connected by w4
                  if (t.id === "nail1" || t.id === "nail2") {
                    isConnected = isConnected || connectedWires.includes("w4");
                  }

                  const strokeColor = isSelected ? "#60a5fa" : t.color;
                  const fillColor = isSelected ? "#3b82f6" : isConnected ? "var(--success)" : "var(--card-bg)";

                  return (
                    <g key={t.id} transform={`translate(${coords.x}, ${coords.y})`} style={{ cursor: "pointer" }} onClick={() => handleTerminalClick(t.id)}>
                      <circle r={isSelected ? 11 : 7} fill="none" stroke={strokeColor} strokeWidth={isSelected ? 3 : 2} className={isSelected ? "bulb-glowing" : ""} />
                      <circle r={4} fill={fillColor} />
                    </g>
                  );
                })}
              </svg>

              {/* Error overlay on canvas */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{ position: "absolute", top: "0.75rem", left: "0.75rem", right: "0.75rem", background: "rgba(239, 68, 68, 0.95)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.8rem", color: "var(--card-bg)", display: "flex", alignItems: "center", gap: "0.4rem", boxShadow: "0 4px 12px var(--border)", zIndex: 40 }}
                  >
                    <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </CanvasDroppable>
          </div>
        </div>

        {/* ============================================== */}
        {/* PARTS BENCH (BOTTOM PANEL)                     */}
        {/* ============================================== */}
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1rem", background: "var(--card-bg)", borderColor: "var(--border)", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "0.95rem", color: "var(--accent-text)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span>🧊</span> 3D Viewer
            </h3>
            {activeStep && (
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                💡 Click & Drag model below to inspect
              </span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: activeStep || selectedItemId === "wires" ? "0.8fr 1.2fr" : "1fr", gap: "1rem", minHeight: "180px" }}>
            {selectedItemId === "wires" ? (
              <>
                <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface)", height: "180px", position: "relative" }}>
                  <ThreeDViewer componentId="wires" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.5rem" }}>
                  <h4 style={{ margin: 0, fontSize: "1rem", color: "var(--text-heading)" }}>Connecting Wires</h4>
                  <ul style={{ margin: "0.25rem 0 0 1rem", padding: 0, fontSize: "0.75rem", color: "var(--text-faint)", lineHeight: "1.4", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    <li>Click on the glowing terminal points on the canvas to draw wires and connect your components.</li>
                    <li>Copper pathways that carry the electric current to the other parts.</li>
                    <li>Covered in plastic insulation to keep the electricity safely inside.</li>
                    <li>They must form a continuous, unbroken loop for current to flow.</li>
                    <li>They are the final pieces needed to connect our entire circuit together!</li>
                  </ul>
                  <div style={{ fontSize: "0.75rem", color: "var(--accent-text)", fontWeight: "bold", marginTop: "0.5rem" }}>
                    Wires connected: {connectedWires.length}/4
                  </div>
                </div>
              </>
            ) : activeStep ? (
              <>
                <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface)", height: "180px", position: "relative" }}>
                  <ThreeDViewer componentId={activeStep.id} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "1rem", color: "var(--text-heading)" }}>{activeStep.name}</h4>
                    <ul style={{ margin: "0.25rem 0 0 1rem", padding: 0, fontSize: "0.75rem", color: "var(--text-faint)", lineHeight: "1.4", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                      {Array.isArray(activeStep.desc) 
                        ? activeStep.desc.map((line, i) => <li key={i}>{line}</li>)
                        : <li>{activeStep.desc}</li>}
                    </ul>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "bold" }}>HOW TO ASSEMBLE:</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", background: "var(--accent-bg)", border: "1px dashed rgba(99, 102, 241, 0.4)", borderRadius: "10px", color: "var(--accent-text)", fontSize: "0.8rem", fontWeight: "600", boxShadow: "0 4px 10px rgba(99,102,241,0.1)", cursor: "default" }}>
<div style={{ width: "28px", height: "28px", background: "var(--border)", borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {renderThumbnailSVG(activeStep.id)}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                          <span>{activeStep.name}</span>
                          <span style={{ fontSize: "0.65rem", color: "var(--accent-text)", fontWeight: "normal" }}>Drag from Component Tray to Workspace</span>
                        </div>
                      </div>
                    
                  </div>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "180px", color: "var(--text-secondary)", textAlign: "center", padding: "1rem" }}>
                <p style={{ margin: 0, fontSize: "0.85rem", maxWidth: "280px" }}>
                  Select an unlocked component from the <strong>Component Tray</strong> above to inspect and drag it onto the workspace.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer controls */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button onClick={handleReset} className="outline" style={{ flex: 1, gap: "0.35rem" }}>
            <RotateCcw size={16} /> Reset Lab
          </button>
          <button onClick={onComplete} className="success" disabled={!success} style={{ flex: 2, gap: "0.35rem" }}>
            Go to Stage 2 <ArrowRight size={16} />
          </button>
        </div>

        {/* Drag Overlay layer */}
        <DragOverlay>
          {isDragging && activeStep ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", background: "rgba(99, 102, 241, 0.25)", border: "2px solid #818cf8", borderRadius: "10px", color: "var(--accent-text)", fontSize: "0.8rem", fontWeight: "600", boxShadow: "0 8px 24px rgba(99,102,241,0.15)", backdropFilter: "blur(4px)", cursor: "grabbing", opacity: 0.9, transform: "scale(1.05)" }}>
              <div style={{ width: "28px", height: "28px", background: "var(--border)", borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {renderThumbnailSVG(activeStep.id)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                <span>{activeStep.name}</span>
                <span style={{ fontSize: "0.65rem", color: "#a5b4fc" }}>Placing in workspace...</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>

      </div>
    </DndContext>
  );
}
