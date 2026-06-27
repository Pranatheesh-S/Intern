import React, { useState, useEffect } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
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
import ThreeDViewer from "./ThreeDViewer";
import { IronNailSVG, CopperCoilSVG } from "./CircuitElements2D";
import { BatterySVG, CardboardSwitchSVG, DrawingPinSVG, SafetyPinSVG } from "../../MagneticEffectOfCurrent/CircuitElements";

const STEPS = [
  {
    id: "switchBoard",
    name: "Switch Base",
    desc: [
      "Provides a sturdy non-conductive base.",
      "Secures the switch components in place.",
      "Prevents short circuits on the table.",
      "Serves as the foundation for the control mechanism."
    ],
    hint: "Place the switch base on the workspace.",
    prereq: [],
  },
  {
    id: "pin1",
    name: "Drawing Pin 1",
    desc: [
      "Acts as the first contact terminal.",
      "Secures the safety pin to the base.",
      "Connects to the copper coil wire.",
      "Made of conductive brass or steel."
    ],
    hint: "Place Pin 1 on the switch base.",
    prereq: [],
  },
  {
    id: "safetyPin",
    name: "Safety Pin",
    desc: [
      "Functions as the movable switch bridge.",
      "Conducts electricity when closed.",
      "Completes the circuit loop.",
      "Can easily be opened to break the circuit."
    ],
    hint: "Attach Safety Pin to Pin 1.",
    prereq: [],
  },
  {
    id: "pin2",
    name: "Drawing Pin 2",
    desc: [
      "Acts as the second contact terminal.",
      "Receives the safety pin when closed.",
      "Connects to the battery's positive terminal.",
      "Completes the switch assembly."
    ],
    hint: "Place Pin 2 on the switch base.",
    prereq: [],
  },
  {
    id: "nail",
    name: "Iron Nail",
    desc: [
      "Acts as the magnetic core.",
      "Made of ferromagnetic iron material.",
      "Concentrates the magnetic field lines.",
      "Becomes a temporary magnet when current flows."
    ],
    hint: "Drag the Iron Nail onto the workspace.",
    prereq: [],
  },
  {
    id: "wire",
    name: "Copper Coil",
    desc: [
      "Insulated copper wire wound in a coil.",
      "Creates a magnetic field when current flows.",
      "More turns create a stronger magnetic field.",
      "Wrapped around the iron nail core."
    ],
    hint: "Drag the Copper Coil onto the Iron Nail.",
    prereq: [],
  },
  {
    id: "battery",
    name: "Electric Cell",
    desc: [
      "Provides the electrical energy.",
      "Has positive (+) and negative (-) terminals.",
      "Drives current through the closed circuit.",
      "Powers the electromagnet."
    ],
    hint: "Place the Battery onto the workspace.",
    prereq: [],
  },
  {
    id: "connect",
    name: "Connecting Wires",
    desc: [
      "Links all components with conductive wires.",
      "Forms a closed loop for current.",
      "Connects battery to switch to coil.",
      "Essential for the circuit to function."
    ],
    hint: "Click the terminals to connect the circuit.",
    prereq: ["nail", "wire", "battery", "pin1", "pin2", "safetyPin", "switchBoard"],
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
        overflow: 'hidden',
        borderRadius: '16px'
      }}
    >
      <div className="canvas-bg-grid" />
      {children}
    </div>
  );
}

function DraggableSVGGroup({ id, children, isDraggable, additionalTransform }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: id, disabled: !isDraggable });

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
  const [placed, setPlaced] = useState({
    switchBoard: false,
    pin1: false,
    safetyPin: false,
    pin2: false,
    nail: false,
    wire: false,
    battery: false,
    connect: false,
  });

  const [positions, setPositions] = useState({
    switchBoard: { x: 370, y: 150 },
    pin1: { x: 450, y: 200 },
    safetyPin: { x: 450, y: 200 },
    pin2: { x: 450, y: 320 },
    nail: { x: 200, y: 200 },
    wire: { x: 200, y: 200 },
    battery: { x: 200, y: 350 },
  });

  const IDEALS = {
    switchBoard: { x: 370, y: 150 },
    pin1: { x: 450, y: 200 },
    safetyPin: { x: 450, y: 200 },
    pin2: { x: 450, y: 320 },
    nail: { x: 200, y: 200 },
    wire: { x: 200, y: 200 },
    battery: { x: 200, y: 350 },
  };

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [connectedWires, setConnectedWires] = useState([]);
  const [selectedTerminal, setSelectedTerminal] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  useEffect(() => {
    if (connectedWires.length === 3 && !success) {
      setPlaced((prev) => ({ ...prev, connect: true }));
      setSuccess(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  }, [connectedWires, success]);

  const snapToIdeal = (id, x, y) => {
    let ideal = IDEALS[id];
    
    // Dynamic ideals for dependent components
    if (id === 'pin1' && placed.switchBoard) ideal = { x: positions.switchBoard.x + 80, y: positions.switchBoard.y + 50 };
    if (id === 'pin2' && placed.switchBoard) ideal = { x: positions.switchBoard.x + 80, y: positions.switchBoard.y + 170 };
    if (id === 'safetyPin' && placed.pin1) ideal = { x: positions.pin1.x, y: positions.pin1.y };
    if (id === 'wire' && placed.nail) ideal = { x: positions.nail.x, y: positions.nail.y };

    if (!ideal) return { x, y };
    const dist = Math.sqrt((x - ideal.x) ** 2 + (y - ideal.y) ** 2);
    if (dist < 50) return ideal; // Snapping radius
    return { x, y };
  };

  const isProperlyPlaced = (id) => {
    if (!placed[id]) return false;
    if (id === "safetyPin") return true;
    if (id === "wire") {
      const dx = positions.wire.x - positions.nail.x;
      const dy = positions.wire.y - positions.nail.y;
      return Math.sqrt(dx * dx + dy * dy) < 10; // Tight check since it should snap
    }
    if (id === "pin1") {
      const dx = positions.pin1.x - (positions.switchBoard.x + 80);
      const dy = positions.pin1.y - (positions.switchBoard.y + 50);
      return Math.sqrt(dx * dx + dy * dy) < 10;
    }
    if (id === "pin2") {
      const dx = positions.pin2.x - (positions.switchBoard.x + 80);
      const dy = positions.pin2.y - (positions.switchBoard.y + 170);
      return Math.sqrt(dx * dx + dy * dy) < 10;
    }
    return true;
  };

  const isStepUnlocked = (stepId) => {
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return false;
    if (stepId === "connect") {
      return step.prereq.every((pId) => isProperlyPlaced(pId));
    }
    return step.prereq.every((pId) => placed[pId] === true);
  };

  const handleSelectTrayItem = (stepId) => {
    if (placed[stepId] && stepId !== "connect") return;
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return;

    if (!isStepUnlocked(stepId)) {
      if (stepId === "connect") {
        const misplaced = step.prereq.filter(pId => !isProperlyPlaced(pId));
        const names = misplaced.map(m => STEPS.find(s => s.id === m).name).join(', ');
        setError(`❌ Cannot connect wires. Please drag these components into their proper snapped positions: ${names}`);
      } else {
        setError(`❌ Cannot select "${step.name}" yet. Complete previous steps first.`);
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
        }

        const snapped = snapToIdeal(draggedId, x, y);
        x = snapped.x;
        y = snapped.y;

        x = Math.max(0, Math.min(600, x));
        y = Math.max(0, Math.min(480, y));

        setPositions((prev) => {
          const newPos = { ...prev, [draggedId]: { x, y } };
          if (draggedId === "pin1" && placed.safetyPin) {
            newPos.safetyPin = { x, y }; 
          }
          if (draggedId === "nail" && placed.wire) {
            newPos.wire = { x, y };
          }
          // If switchboard moves, check if pins were snapped to it and move them too
          if (draggedId === "switchBoard") {
            if (placed.pin1 && isProperlyPlaced("pin1")) {
              newPos.pin1 = { x: x + 80, y: y + 50 };
              if (placed.safetyPin) newPos.safetyPin = { x: x + 80, y: y + 50 };
            }
            if (placed.pin2 && isProperlyPlaced("pin2")) {
              newPos.pin2 = { x: x + 80, y: y + 170 };
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

  const getTerminalCoords = (terminalId) => {
    const battery = positions.battery;
    const pin1 = positions.pin1;
    const pin2 = positions.pin2;
    const wire = positions.wire;

    switch (terminalId) {
      case "battery-neg": return { x: battery.x, y: battery.y + 20 };
      case "battery-pos": return { x: battery.x + 91, y: battery.y + 20 };
      case "pin1": return { x: pin1.x, y: pin1.y };
      case "pin2": return { x: pin2.x, y: pin2.y };
      case "coil-left": return { x: wire.x - 70, y: wire.y - 50 };
      case "coil-right": return { x: wire.x + 80, y: wire.y - 50 };
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
        "coil-right <-> pin1": "w2",
        "battery-neg <-> coil-left": "w3"
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
        setError("❌ Invalid connection. Think about the circuit loop needed.");
      }
      setSelectedTerminal(null);
    }
  };

  const handleRestart = () => {
    setPlaced({
      switchBoard: false,
      pin1: false,
      safetyPin: false,
      pin2: false,
      nail: false,
      wire: false,
      battery: false,
      connect: false,
    });
    setPositions(IDEALS);
    setConnectedWires([]);
    setSelectedTerminal(null);
    setSelectedItemId(null);
    setError("");
    setSuccess(false);
  };

  const terminals = [
    { id: "battery-neg", color: "var(--text-primary)" },
    { id: "battery-pos", color: "var(--danger)" },
    { id: "pin1", color: "var(--warning)" },
    { id: "pin2", color: "var(--warning)" },
    { id: "coil-left", color: "var(--text-secondary)" },
    { id: "coil-right", color: "var(--text-secondary)" },
  ];

  const physicalSteps = STEPS.map(s => s.id).filter(id => id !== "connect");
  const physicalPlacedCount = physicalSteps.filter((k) => placed[k]).length;
  const completedCount = physicalPlacedCount + (placed.connect ? 1 : 0);
  const progressPercent = (completedCount / STEPS.length) * 100;

  const activeStep = STEPS.find((s) => s.id === selectedItemId);

  const renderThumbnailSVG = (id) => {
    switch (id) {
      case "switchBoard": return <svg viewBox="360 140 180 230" width="24" height="24"><CardboardSwitchSVG y={150} /></svg>;
      case "pin1":
      case "pin2": return <svg viewBox="430 180 40 40" width="24" height="24"><DrawingPinSVG x={450} y={200} isPlaced={true} /></svg>;
      case "safetyPin": return <svg viewBox="-20 -20 40 150" width="24" height="24"><SafetyPinSVG x={0} y={0} rotation={0} isPlaced={true} /></svg>;
      case "nail": return <svg viewBox="-100 -20 200 40" width="24" height="24"><IronNailSVG isPlaced={true} /></svg>;
      case "wire": return <svg viewBox="-100 -60 200 120" width="24" height="24"><CopperCoilSVG isPlaced={true} /></svg>;
      case "battery": return <svg viewBox="40 340 100 70" width="24" height="24"><BatterySVG isPlaced={true} y={350} /></svg>;
      case "connect": return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12c0-4 3-7 8-7s8 3 8 7-3 7-8 7" stroke="var(--danger)" /><path d="M6 13c0-3 2.5-5 6-5s6 2 6 5-2 5-6 5" stroke="var(--warning)" /></svg>;
      default: return null;
    }
  };

  const getNextStepPrompt = () => {
    if (success) return "✅ Circuit Constructed Successfully!";
    if (selectedItemId === "connect") return "Instruction: Click the glowing terminals to connect the circuit automatically.";
    const remainingToPlace = STEPS.filter((s) => s.id !== "connect" && !placed[s.id]);
    if (remainingToPlace.length > 0) return `${remainingToPlace.length} component(s) left — pick any from the Component Tray.`;
    
    // Check if any placed components are NOT properly placed
    const misplaced = STEPS.filter(s => s.id !== "connect" && placed[s.id] && !isProperlyPlaced(s.id));
    if (misplaced.length > 0) {
      return `⚠️ Some components are not snapped into their targets! Follow the dotted "SNAP HERE" guidelines.`;
    }

    return "⚡ All components correctly snapped! Now select Connecting Wires to link everything together.";
  };

  const activeDraggingStep = activeDraggingId ? STEPS.find((s) => s.id === activeDraggingId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div className="main-grid" style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <span className="status-badge neutral" style={{ background: "var(--accent-bg)", color: "var(--accent-text)", fontWeight: "bold" }}>
              Stage 1: Assemble the Circuit
            </span>
            <h2 style={{ margin: "0.2rem 0 0 0", fontSize: "1.4rem" }}>Construct the Electromagnet</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <button onClick={handleRestart} className="outline" style={{ gap: "0.4rem", padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
              <RotateCcw size={14} /> Restart Lab
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Progress: <strong>{completedCount} / {STEPS.length}</strong></span>
              <div style={{ width: "100px", height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${progressPercent}%`, height: "100%", background: "var(--success)", transition: "width 0.3s" }} />
              </div>
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
                const isConnect = step.id === "connect";
                const isUnlocked = isStepUnlocked(step.id);
                const isSelected = selectedItemId === step.id;
                const isDisabled = (isPlaced && !isConnect) || !isUnlocked;

                return (
                  <TrayDraggable key={step.id} id={step.id} disabled={isDisabled}>
                    <button
                      className="tray-btn"
                      onClick={() => handleSelectTrayItem(step.id)}
                      disabled={isDisabled}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0.6rem 0.4rem", borderRadius: "12px",
                      background: isPlaced && !isConnect ? "var(--success-bg)" : isSelected ? "var(--accent-bg)" : isUnlocked ? "var(--surface)" : "var(--neutral-bg)",
                      border: `1px solid ${isPlaced && !isConnect ? "var(--success-border)" : isSelected ? "var(--accent)" : isUnlocked ? "var(--accent-border)" : "var(--border)"}`,
                      color: isPlaced && !isConnect ? "var(--success)" : isUnlocked ? "var(--text-primary)" : "var(--text-faint)",
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
                      {isPlaced && !isConnect ? (
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
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 'auto' }}>
                <button onClick={onComplete} className="primary" style={{ width: '100%', gap: '0.5rem' }}>
                  Proceed to Test <ArrowRight size={16} />
                </button>
              </motion.div>
            )}
          </div>

          {/* RIGHT PANEL: CANVAS */}
          <div style={{ flex: 1, position: "relative", minHeight: "480px", display: "flex", flexDirection: "column", background: "var(--canvas-bg)", borderRadius: "16px", border: "1px solid var(--canvas-border)", overflow: "hidden" }}>
            <CanvasDroppable>
              <svg width="100%" height="100%" viewBox="0 0 600 480" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                
                {/* Visual Guidelines (Initial Fixed Targets) Removed */}

                {/* Real Placed Items */}
                {placed.switchBoard && (
                  <DraggableSVGGroup id="switchBoard" isDraggable={!placed.connect}>
                    <CardboardSwitchSVG x={positions.switchBoard.x} y={positions.switchBoard.y} />
                  </DraggableSVGGroup>
                )}
                
                {placed.pin1 && (
                  <DraggableSVGGroup id="pin1" isDraggable={!placed.connect} additionalTransform={activeDraggingId === "switchBoard" && isProperlyPlaced("pin1") ? activeDragDelta : null}>
                    <DrawingPinSVG x={positions.pin1.x} y={positions.pin1.y} label="PIN 1" isPlaced={true} />
                  </DraggableSVGGroup>
                )}
                
                {placed.safetyPin && (
                  <DraggableSVGGroup id="safetyPin" isDraggable={!placed.connect} additionalTransform={activeDraggingId === "switchBoard" && isProperlyPlaced("pin1") ? activeDragDelta : null}>
                    <SafetyPinSVG x={positions.safetyPin.x} y={positions.safetyPin.y} rotation={-30} isPlaced={true} />
                  </DraggableSVGGroup>
                )}
                
                {placed.pin2 && (
                  <DraggableSVGGroup id="pin2" isDraggable={!placed.connect} additionalTransform={activeDraggingId === "switchBoard" && isProperlyPlaced("pin2") ? activeDragDelta : null}>
                    <DrawingPinSVG x={positions.pin2.x} y={positions.pin2.y} label="PIN 2" isPlaced={true} />
                  </DraggableSVGGroup>
                )}

                {placed.nail && (
                  <DraggableSVGGroup id="nail" isDraggable={!placed.connect}>
                    <IronNailSVG x={positions.nail.x} y={positions.nail.y} isPlaced={true} />
                  </DraggableSVGGroup>
                )}

                {placed.wire && (
                  <DraggableSVGGroup id="wire" isDraggable={!placed.connect} additionalTransform={activeDraggingId === "nail" && isProperlyPlaced("wire") ? activeDragDelta : null}>
                    <CopperCoilSVG x={positions.wire.x} y={positions.wire.y} isPlaced={true} />
                  </DraggableSVGGroup>
                )}
                
                {placed.battery && (
                  <DraggableSVGGroup id="battery" isDraggable={!placed.connect}>
                    <g transform={`translate(${positions.battery.x - 44}, ${positions.battery.y - 366})`}>
                      <BatterySVG isPlaced={true} />
                    </g>
                  </DraggableSVGGroup>
                )}
                
                {/* DOTTED GUIDES FOR WIRES */}
                {selectedItemId === "connect" && (
                   <g opacity={0.5}>
                     {!connectedWires.includes("w1") && <path d={getWirePath(getTerminalCoords("battery-pos"), getTerminalCoords("pin2"))} fill="none" stroke="var(--accent)" strokeWidth={3} strokeDasharray="6,6" />}
                     {!connectedWires.includes("w2") && <path d={getWirePath(getTerminalCoords("pin1"), getTerminalCoords("coil-right"))} fill="none" stroke="var(--accent)" strokeWidth={3} strokeDasharray="6,6" />}
                     {!connectedWires.includes("w3") && <path d={getWirePath(getTerminalCoords("coil-left"), getTerminalCoords("battery-neg"))} fill="none" stroke="var(--accent)" strokeWidth={3} strokeDasharray="6,6" />}
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
                    <path d={getWirePath(getTerminalCoords("pin1"), getTerminalCoords("coil-right"))} fill="none" stroke="#b91c1c" strokeWidth={5} strokeLinecap="round" />
                    <path d={getWirePath(getTerminalCoords("pin1"), getTerminalCoords("coil-right"))} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" />
                  </>
                )}
                {connectedWires.includes("w3") && (
                  <>
                    <path d={getWirePath(getTerminalCoords("coil-left"), getTerminalCoords("battery-neg"))} fill="none" stroke="#374151" strokeWidth={5} strokeLinecap="round" />
                    <path d={getWirePath(getTerminalCoords("coil-left"), getTerminalCoords("battery-neg"))} fill="none" stroke="#6b7280" strokeWidth={2.5} strokeLinecap="round" />
                  </>
                )}

                {/* TERMINAL DOTS FOR WIRE CONNECTION */}
                {selectedItemId === "connect" && terminals.map(t => {
                  const coords = getTerminalCoords(t.id);
                  const isSelected = selectedTerminal === t.id;
                  let isConnected = false;
                  if (t.id === "battery-pos" || t.id === "pin2") isConnected = connectedWires.includes("w1");
                  if (t.id === "pin1" || t.id === "coil-right") isConnected = connectedWires.includes("w2");
                  if (t.id === "battery-neg" || t.id === "coil-left") isConnected = connectedWires.includes("w3");

                  const strokeColor = isSelected ? "#60a5fa" : t.color;
                  const fillColor = isSelected ? "#3b82f6" : isConnected ? "var(--success)" : "var(--card-bg)";

                  return (
                    <g key={t.id} transform={`translate(${coords.x}, ${coords.y})`} style={{ cursor: "pointer" }} onClick={() => handleTerminalClick(t.id)}>
                      <circle r={isSelected ? 11 : 7} fill="none" stroke={strokeColor} strokeWidth={isSelected ? 3 : 2} className={isSelected ? "bulb-glowing" : ""} />
                      <circle r={4} fill={fillColor} />
                    </g>
                  );
                })}

                {/* ACTIVE DRAG TARGETS (Helpers) */}
                {isDragging && activeDraggingId === "pin1" && placed.switchBoard && (
                  <g>
                    <circle cx={positions.switchBoard.x + 80} cy={positions.switchBoard.y + 50} r={18} fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4,4" opacity={0.8} className="pulse-target" />
                    <text x={positions.switchBoard.x + 80} y={positions.switchBoard.y + 54} fill="var(--accent)" fontSize="10" textAnchor="middle" fontWeight="bold">SNAP PIN 1 HERE</text>
                  </g>
                )}
                {isDragging && activeDraggingId === "pin2" && placed.switchBoard && (
                  <g>
                    <circle cx={positions.switchBoard.x + 80} cy={positions.switchBoard.y + 170} r={18} fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4,4" opacity={0.8} className="pulse-target" />
                    <text x={positions.switchBoard.x + 80} y={positions.switchBoard.y + 174} fill="var(--accent)" fontSize="10" textAnchor="middle" fontWeight="bold">SNAP PIN 2 HERE</text>
                  </g>
                )}
                {isDragging && activeDraggingId === "wire" && placed.nail && (
                  <g>
                    <rect x={positions.nail.x - 70} y={positions.nail.y - 20} width={140} height={40} fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4,4" opacity={0.8} className="pulse-target" />
                    <text x={positions.nail.x} y={positions.nail.y + 4} fill="var(--accent)" fontSize="10" textAnchor="middle" fontWeight="bold">SNAP COIL HERE</text>
                  </g>
                )}
                {isDragging && activeDraggingId === "safetyPin" && placed.pin1 && (
                  <g>
                    <circle cx={positions.pin1.x} cy={positions.pin1.y} r={16} fill="var(--warning-bg)" stroke="var(--warning)" strokeWidth={2} strokeDasharray="3,3" opacity={0.8} className="pulse-target" />
                    <text x={positions.pin1.x} y={positions.pin1.y + 24} fill="var(--warning)" fontSize="9" textAnchor="middle" fontWeight="bold">ATTACH PIN</text>
                  </g>
                )}
              </svg>

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

        {/* BOTTOM PANEL: PARTS BENCH */}
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1rem", background: "var(--card-bg)", borderColor: "var(--border)", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "0.95rem", color: "var(--accent-text)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Info size={14} /> Parts Bench
            </h3>
            {activeStep && (
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                💡 Click & Drag item below to the workspace above
              </span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: activeStep ? "0.8fr 1.2fr" : "1fr", gap: "1rem", minHeight: "180px" }}>
            {activeStep ? (
              <>
                <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface)", height: "180px", position: "relative" }}>
                   <ThreeDViewer componentId={activeStep.id} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "1rem", color: "var(--text-heading)" }}>{activeStep.name}</h4>
                    <ul style={{ margin: "0.25rem 0 0 1rem", padding: 0, fontSize: "0.75rem", color: "var(--text-faint)", lineHeight: "1.4", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                      {activeStep.desc.map((line, i) => <li key={i}>{line}</li>)}
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-faint)", fontSize: "0.85rem", fontStyle: "italic" }}>
                Select an unlocked component from the Component Tray to inspect and place it.
              </div>
            )}
          </div>
        </div>

        {/* Drag Overlay layer */}
        <DragOverlay>
          {isDragging && activeDraggingStep ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", background: "rgba(99, 102, 241, 0.25)", border: "2px solid #818cf8", borderRadius: "10px", color: "var(--accent-text)", fontSize: "0.8rem", fontWeight: "600", boxShadow: "0 8px 24px rgba(99,102,241,0.15)", backdropFilter: "blur(4px)", cursor: "grabbing", opacity: 0.9, transform: "scale(1.05)" }}>
              <div style={{ width: "28px", height: "28px", background: "var(--border)", borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {renderThumbnailSVG(activeDraggingStep.id)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                <span>{activeDraggingStep.name}</span>
                <span style={{ fontSize: "0.65rem", color: "#a5b4fc" }}>Placing in workspace...</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
