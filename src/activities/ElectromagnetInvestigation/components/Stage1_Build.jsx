import React, { useState, useEffect } from "react";
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowRight, Info, Lock, CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
import ThreeDViewer from "./ThreeDViewer";

import { ChartPaperSVG, IronNailSVG, CopperCoilSVG, CompassSVG, PaperClipsSVG } from "./CircuitElements2D";
import { BatterySVG, CardboardSwitchSVG, DrawingPinSVG, SafetyPinSVG } from "../../MagneticEffectOfCurrent/CircuitElements";
import ReferenceOverlay from "../../../components/ReferenceOverlay";

const STEPS = [
  { id: "chart_paper", name: "Chart Paper", desc: [
    "Rolled into a hollow cylindrical shape.",
    "Acts as an air-core for the coil.",
    "Provides structure to wrap the wire around.",
    "Does not interact with the magnetic field."
  ], hint: "Place Chart Paper on workspace.", prereq: [] },
  { id: "wire", name: "Copper Coil", desc: [
    "Insulated copper wire wound into a solenoid.",
    "Creates a magnetic field when current flows.",
    "Wrapped around the chart paper cylinder.",
    "Forms the main coil of the electromagnet."
  ], hint: "Drag Copper Coil onto Chart Paper.", prereq: ["chart_paper"] },
  { id: "switchBoard", name: "Switch Base", desc: [
    "Provides a sturdy non-conductive base.",
    "Secures the switch components in place.",
    "Prevents short circuits on the table.",
    "Serves as the foundation for the control mechanism."
  ], hint: "Place Switch Base.", prereq: [] },
  { id: "pin1", name: "Drawing Pin 1", desc: [
    "Acts as the first contact terminal.",
    "Secures the safety pin to the base.",
    "Connects to the copper coil wire.",
    "Made of conductive brass or steel."
  ], hint: "Place Pin 1 on switch board.", prereq: [] },
  { id: "safetyPin", name: "Safety Pin", desc: [
    "Functions as the movable switch bridge.",
    "Conducts electricity when closed.",
    "Completes the circuit loop.",
    "Can easily be opened to break the circuit."
  ], hint: "Attach Safety Pin.", prereq: [] },
  { id: "pin2", name: "Drawing Pin 2", desc: [
    "Acts as the second contact terminal.",
    "Receives the safety pin when closed.",
    "Connects to the battery's positive terminal.",
    "Completes the switch assembly."
  ], hint: "Place Pin 2 on switch board.", prereq: [] },
  { id: "battery", name: "Electric Cell", desc: [
    "Provides the electrical energy.",
    "Has positive (+) and negative (-) terminals.",
    "Drives current through the closed circuit.",
    "Powers the electromagnet."
  ], hint: "Place Battery.", prereq: [] },
  { id: "connect", name: "Action: Wire Circuit", desc: [
    "Links all components with conductive wires.",
    "Forms a closed loop for current.",
    "Connects battery to switch to coil.",
    "Essential for the circuit to function."
  ], hint: "Click terminals to connect.", prereq: ["wire", "battery", "pin1", "pin2", "safetyPin", "switchBoard"] },
  { id: "compass1", name: "Compass (End A)", desc: [
    "Detects the presence of a magnetic field.",
    "Placed near the left end of the coil.",
    "Needle deflects according to polarity.",
    "Helps visualize invisible magnetic lines."
  ], hint: "Drag Compass to left of coil.", prereq: ["connect"] },
  { id: "compass2", name: "Compass (End B)", desc: [
    "Detects the presence of a magnetic field.",
    "Placed near the right end of the coil.",
    "Deflects opposite to compass 1.",
    "Confirms the two poles of the magnet."
  ], hint: "Drag Compass to right of coil.", prereq: ["connect"] },
  { id: "test_air", name: "Action: Test Air-Core", desc: [
    "Tests the coil with only air inside.",
    "Creates a relatively weak magnetic field.",
    "Causes minor compass needle deflection.",
    "Proves that the coil alone has magnetism."
  ], hint: "CLICK THE SWITCH ON THE BOARD to turn on the current.", prereq: ["compass1", "compass2"] },
  { id: "nail", name: "Iron Nail", desc: [
    "Acts as a solid magnetic core.",
    "Made of ferromagnetic iron.",
    "Inserted into the hollow chart paper.",
    "Significantly boosts magnetic strength."
  ], hint: "Drag Iron Nail into cylinder.", prereq: ["test_air"] },
  { id: "paper_clips", name: "Iron Clips", desc: [
    "Place clips to test magnetic strength.",
    "Will stick to the iron nail when ON."
  ], hint: "Drag clips near the coil.", prereq: ["nail"] },
  { id: "test_iron", name: "Action: Test Iron-Core", desc: [
    "Tests the coil with the iron core.",
    "Creates a very strong magnetic field.",
    "Causes major compass needle deflection.",
    "Demonstrates how cores affect electromagnets."
  ], hint: "CLICK THE SWITCH ON THE BOARD to turn on the current.", prereq: ["paper_clips"] }
];

function TrayDraggable({ id, disabled, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    disabled: disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        opacity: isDragging ? 0.4 : 1,
        touchAction: "none",
        cursor: disabled ? "not-allowed" : "grab",
      }}
    >
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
  
  let tx = 0;
  let ty = 0;
  if (transform) {
    const canvas = document.getElementById("assembly-canvas");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const svgScale = Math.min(rect.width / 600, rect.height / 480);
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
  const [placed, setPlaced] = useState({});
  const [positions, setPositions] = useState({
    chart_paper: { x: 200, y: 150 }, wire: { x: 200, y: 150 },
    switchBoard: { x: 370, y: 150 }, pin1: { x: 450, y: 200 }, safetyPin: { x: 450, y: 200 }, pin2: { x: 450, y: 320 },
    battery: { x: 200, y: 350 }, compass1: { x: 80, y: 150 }, compass2: { x: 320, y: 150 },
    nail: { x: 200, y: 150 }, paper_clips: { x: 340, y: 230 }
  });

  const IDEALS = {
    chart_paper: { x: 200, y: 150 }, wire: { x: 200, y: 150 },
    switchBoard: { x: 370, y: 150 }, pin1: { x: 450, y: 200 }, safetyPin: { x: 450, y: 200 }, pin2: { x: 450, y: 320 },
    battery: { x: 200, y: 350 }, compass1: { x: 80, y: 150 }, compass2: { x: 320, y: 150 },
    nail: { x: 200, y: 150 }, paper_clips: { x: 340, y: 230 }
  };

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [connectedWires, setConnectedWires] = useState([]);
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [switchOn, setSwitchOn] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }));

  useEffect(() => {
    if (connectedWires.length === 3 && !placed.connect) {
      setPlaced(prev => ({ ...prev, connect: true }));
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    }
  }, [connectedWires, placed.connect]);
  
  useEffect(() => {
    if (placed.test_iron && !success) {
      setSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [placed.test_iron, success]);

  const snapToIdeal = (id, x, y) => {
    let ideal = IDEALS[id];
    if (id === 'pin1' && placed.switchBoard) ideal = { x: positions.switchBoard.x + 80, y: positions.switchBoard.y + 50 };
    if (id === 'pin2' && placed.switchBoard) ideal = { x: positions.switchBoard.x + 80, y: positions.switchBoard.y + 170 };
    if (id === 'safetyPin' && placed.pin1) ideal = { x: positions.pin1.x, y: positions.pin1.y };
    if (id === 'wire' && placed.chart_paper) ideal = { x: positions.chart_paper.x, y: positions.chart_paper.y };
    if (id === 'nail' && placed.chart_paper) ideal = { x: positions.chart_paper.x, y: positions.chart_paper.y };
    if (!ideal) return { x, y };
    const dist = Math.sqrt((x - ideal.x) ** 2 + (y - ideal.y) ** 2);
    if (dist < 50) return ideal;
    return { x, y };
  };

  const isProperlyPlaced = (id) => {
    if (!placed[id]) return false;
    if (["safetyPin", "chart_paper", "battery", "compass1", "compass2", "test_air", "test_iron", "connect", "paper_clips"].includes(id)) return true;
    if (id === "wire") return Math.sqrt((positions.wire.x - positions.chart_paper.x)**2 + (positions.wire.y - positions.chart_paper.y)**2) < 10;
    if (id === "nail") return Math.sqrt((positions.nail.x - positions.chart_paper.x)**2 + (positions.nail.y - positions.chart_paper.y)**2) < 10;
    if (id === "pin1") return Math.sqrt((positions.pin1.x - (positions.switchBoard.x + 80))**2 + (positions.pin1.y - (positions.switchBoard.y + 50))**2) < 10;
    if (id === "pin2") return Math.sqrt((positions.pin2.x - (positions.switchBoard.x + 80))**2 + (positions.pin2.y - (positions.switchBoard.y + 170))**2) < 10;
    return true;
  };

  const isStepUnlocked = (stepId) => {
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return false;
    return step.prereq.every((pId) => {
      if (["connect", "test_air", "test_iron"].includes(pId)) return placed[pId];
      return isProperlyPlaced(pId);
    });
  };

  const handleSelectTrayItem = (stepId) => {
    if (placed[stepId] && !["connect", "test_air", "test_iron"].includes(stepId)) return;
    const step = STEPS.find((s) => s.id === stepId);
    if (!isStepUnlocked(stepId)) {
      setError(`❌ Cannot select "${step.name}" yet. Complete previous steps!`);
      return;
    }
    setError("");
    setSelectedItemId(stepId);
  };

  const handleDragStart = (event) => {
    setIsDragging(true);
    setActiveDraggingId(event.active.id);
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
          x = positions[draggedId].x + event.delta.x / svgScale;
          y = positions[draggedId].y + event.delta.y / svgScale;
        } else {
          x = ((activeRect.left + activeRect.width / 2) - rect.left - offsetX) / svgScale;
          y = ((activeRect.top + activeRect.height / 2) - rect.top - offsetY) / svgScale;
          if (draggedId === "switchBoard") { x -= 80; y -= 105; }
        }

        const snapped = snapToIdeal(draggedId, x, y);
        x = Math.max(0, Math.min(600, snapped.x));
        y = Math.max(0, Math.min(480, snapped.y));

        setPositions((prev) => {
          const newPos = { ...prev, [draggedId]: { x, y } };
          if (draggedId === "pin1" && placed.safetyPin) newPos.safetyPin = { x, y }; 
          if (draggedId === "chart_paper") {
            if (placed.wire) newPos.wire = { x, y };
            if (placed.nail) newPos.nail = { x, y };
          }
          if (draggedId === "switchBoard") {
            if (placed.pin1 && isProperlyPlaced("pin1")) { newPos.pin1 = { x: x + 80, y: y + 50 }; if (placed.safetyPin) newPos.safetyPin = { x: x + 80, y: y + 50 }; }
            if (placed.pin2 && isProperlyPlaced("pin2")) newPos.pin2 = { x: x + 80, y: y + 170 };
          }
          return newPos;
        });

        if (!placed[draggedId]) {
          setPlaced((prev) => ({ ...prev, [draggedId]: true }));
          setSelectedItemId(null); 
          confetti({ particleCount: 20, spread: 40, origin: { y: 0.8 } });
        }
      }
    }
  };

  const handleSwitchToggle = () => {
    if (!placed.connect) return;
    setSwitchOn(!switchOn);
    
    // Auto complete test stages when switch is toggled
    if (!switchOn) { // turning on
      if (selectedItemId === "test_air" && placed.compass1 && placed.compass2 && !placed.nail) {
        setPlaced(prev => ({ ...prev, test_air: true }));
        setSelectedItemId(null);
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      } else if (selectedItemId === "test_iron" && placed.nail && placed.paper_clips) {
        setPlaced(prev => ({ ...prev, test_iron: true }));
        setSelectedItemId(null);
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      }
    }
  };

  const getTerminalCoords = (terminalId) => {
    const { battery, pin1, pin2, wire } = positions;
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

  const handleTerminalClick = (terminalId) => {
    setError("");
    if (!selectedTerminal) {
      setSelectedTerminal(terminalId);
    } else {
      if (selectedTerminal === terminalId) { setSelectedTerminal(null); return; }
      const wireKey = [selectedTerminal, terminalId].sort().join(" <-> ");
      const standardValid = { "battery-pos <-> pin2": "w1", "coil-right <-> pin1": "w2", "battery-neg <-> coil-left": "w3" };
      const wireId = standardValid[wireKey];
      if (wireId) {
        if (!connectedWires.includes(wireId)) {
          setConnectedWires((prev) => [...prev, wireId]);
        }
      } else setError("❌ Invalid connection.");
      setSelectedTerminal(null);
    }
  };

  const terminals = [
    { id: "battery-neg", color: "var(--text-primary)" }, { id: "battery-pos", color: "var(--danger)" },
    { id: "pin1", color: "var(--warning)" }, { id: "pin2", color: "var(--warning)" },
    { id: "coil-left", color: "var(--text-secondary)" }, { id: "coil-right", color: "var(--text-secondary)" },
  ];

  const renderThumbnailSVG = (id) => {
    switch (id) {
      case "chart_paper": return <svg viewBox="-100 -20 200 40" width="24" height="24"><ChartPaperSVG isPlaced={true} /></svg>;
      case "wire": return <svg viewBox="-100 -60 200 120" width="24" height="24"><CopperCoilSVG isPlaced={true} /></svg>;
      case "nail": return <svg viewBox="-100 -20 200 40" width="24" height="24"><IronNailSVG isPlaced={true} /></svg>;
      case "paper_clips": return <svg viewBox="-25 -15 50 45" width="24" height="24"><PaperClipsSVG isPlaced={true} /></svg>;
      case "switchBoard": return <svg viewBox="360 140 180 230" width="24" height="24"><CardboardSwitchSVG y={150} /></svg>;
      case "pin1": case "pin2": return <svg viewBox="430 180 40 40" width="24" height="24"><DrawingPinSVG x={450} y={200} isPlaced={true} /></svg>;
      case "safetyPin": return <svg viewBox="-20 -20 40 150" width="24" height="24"><SafetyPinSVG x={0} y={0} rotation={0} isPlaced={true} /></svg>;
      case "battery": return <svg viewBox="40 340 100 70" width="24" height="24"><BatterySVG isPlaced={true} y={350} /></svg>;
      case "compass1": case "compass2": return <svg viewBox="-30 -30 60 60" width="24" height="24"><CompassSVG isPlaced={true} /></svg>;
      case "test_iron": return <RotateCcw size={24} color="#fca5a5" />;
      case "connect": case "test_air": return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12c0-4 3-7 8-7s8 3 8 7-3 7-8 7" stroke="var(--danger)" /><path d="M6 13c0-3 2.5-5 6-5s6 2 6 5-2 5-6 5" stroke="var(--warning)" /></svg>;
      default: return null;
    }
  };

  const getNextStepPrompt = () => {
    if (success) return "✅ Stage Complete! You built and tested the electromagnet.";
    if (selectedItemId === "connect") return "Click the glowing terminals to connect the circuit.";
    if (selectedItemId === "test_air") return "Turn the switch ON to test the air-core coil.";
    if (selectedItemId === "test_iron") return "Turn the switch ON to test the iron-core coil.";
    const remainingToPlace = STEPS.filter((s) => !placed[s.id] && !["connect", "test_air", "test_iron"].includes(s.id));
    if (remainingToPlace.length > 0) return `${remainingToPlace.length} component(s) left — pick any from the Component Tray.`;
    return "⚡ All physical components placed! Follow the remaining action steps.";
  };

  // Compass deflection logic based on switch and nail
  let compass1Rot = switchOn ? -40 : 0;
  let compass2Rot = switchOn ? 40 : 0;
  if (switchOn && placed.nail) {
    compass1Rot = -75;
    compass2Rot = 75;
  }

  const activeDraggingStep = activeDraggingId ? STEPS.find((s) => s.id === activeDraggingId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="main-grid" style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <span className="status-badge neutral" style={{ background: "var(--accent-bg)", color: "var(--accent-text)", fontWeight: "bold" }}>Stage 1: Build & Test</span>
            <h2 style={{ margin: "0.2rem 0 0 0", fontSize: "1.4rem" }}>Construct the Electromagnet</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <button onClick={() => window.location.reload()} className="outline" style={{ gap: "0.4rem", padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
              <RotateCcw size={14} /> Restart Lab
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1rem", alignItems: "stretch" }}>
          {/* LEFT PANEL */}
          <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", height: "100%" }}>
            <div style={{ display: "flex", gap: "0.35rem", alignItems: "center", background: "var(--neutral-bg)", padding: "0.6rem 0.8rem", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <Info style={{ color: "var(--accent)", flexShrink: 0 }} size={16} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>{getNextStepPrompt()}</span>
            </div>

            <h3 style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-primary)" }}>Assembly Steps</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", alignContent: "start", flex: 1, overflowY: "auto", paddingRight: "4px" }}>
              {STEPS.map((step) => {
                const isPlaced = placed[step.id];
                const isActionStep = ["connect", "test_air", "test_iron"].includes(step.id);
                const isUnlocked = isStepUnlocked(step.id);
                const isSelected = selectedItemId === step.id;
                const isDisabled = (isPlaced && !isActionStep) || !isUnlocked || (isActionStep && isPlaced);

                return (
                  <TrayDraggable key={step.id} id={step.id} disabled={isDisabled}>
                    <button onClick={() => handleSelectTrayItem(step.id)} disabled={isDisabled}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0.6rem 0.4rem", borderRadius: "12px",
                        background: isPlaced ? "var(--success-bg)" : isSelected ? "var(--accent-bg)" : isUnlocked ? "var(--surface)" : "var(--neutral-bg)",
                        border: `1px solid ${isPlaced ? "var(--success-border)" : isSelected ? "var(--accent)" : isUnlocked ? "var(--accent-border)" : "var(--border)"}`,
                        color: isPlaced ? "var(--success)" : isUnlocked ? "var(--text-primary)" : "var(--text-faint)",
                        cursor: isDisabled ? "not-allowed" : "pointer", transition: "all 0.2s ease", position: "relative", minHeight: "72px",
                        boxShadow: isSelected ? "0 0 0 2px rgba(99,102,241,0.4)" : "none", opacity: (isPlaced && !isActionStep) ? 0.6 : 1, width: "100%"
                      }}>
                      <div style={{ width: "34px", height: "34px", background: "var(--border)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.35rem", opacity: isUnlocked ? 1 : 0.2 }}>
                        {renderThumbnailSVG(step.id)}
                      </div>
                      <span style={{ fontSize: "0.68rem", fontWeight: "600", textAlign: "center", width: "100%", opacity: isUnlocked ? 1 : 0.3 }}>{step.name}</span>
                      <div style={{ position: "absolute", top: "5px", right: "5px" }}>
                        {isPlaced ? <CheckCircle2 size={12} style={{ color: "var(--success)" }} /> : !isUnlocked ? <Lock size={10} style={{ color: "var(--text-secondary)" }} /> : null}
                      </div>
                    </button>
                  </TrayDraggable>
                );
              })}
            </div>
            
            {success && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '0.8rem', borderRadius: '8px', color: 'var(--text-primary)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--success)', fontSize: '0.85rem' }}>Investigation Complete!</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', lineHeight: '1.5' }}>
                    <strong>Why test Air-Core first?</strong> To prove the coil itself creates a weak magnetic field.<br/><br/>
                    <strong>What changed with the Iron Core?</strong> The iron nail concentrated the magnetic field lines, making it a much stronger electromagnet!
                  </p>
                </div>
                <button onClick={onComplete} className="primary" style={{ width: '100%', gap: '0.5rem' }}>Proceed to Predict & Test <ArrowRight size={16} /></button>
              </motion.div>
            )}
          </div>

          {/* RIGHT PANEL: CANVAS */}
          <div style={{ flex: 1, position: "relative", minHeight: "480px", display: "flex", flexDirection: "column", background: "var(--canvas-bg)", borderRadius: "16px", border: "1px solid var(--canvas-border)", overflow: "hidden" }}>
            
            {/* Reference Blueprint */}
            <ReferenceOverlay title="Reference Blueprint">
              <svg width="280" height="180" viewBox="40 80 500 320" style={{ opacity: 0.85 }}>
                <ChartPaperSVG x={IDEALS.chart_paper.x} y={IDEALS.chart_paper.y} isPlaced={true} />
                <IronNailSVG x={IDEALS.nail.x} y={IDEALS.nail.y} isPlaced={true} />
                <CopperCoilSVG x={IDEALS.wire.x} y={IDEALS.wire.y} isPlaced={true} />
                <CardboardSwitchSVG x={IDEALS.switchBoard.x} y={IDEALS.switchBoard.y} />
                <DrawingPinSVG x={IDEALS.pin1.x} y={IDEALS.pin1.y} isPlaced={true} />
                <DrawingPinSVG x={IDEALS.pin2.x} y={IDEALS.pin2.y} isPlaced={true} />
                <SafetyPinSVG x={IDEALS.safetyPin.x} y={IDEALS.safetyPin.y} rotation={-30} isPlaced={true} />
                <g transform={`translate(${IDEALS.battery.x - 44}, ${IDEALS.battery.y - 366})`}><BatterySVG isPlaced={true} /></g>
                <CompassSVG x={IDEALS.compass1.x} y={IDEALS.compass1.y} isPlaced={true} />
                <CompassSVG x={IDEALS.compass2.x} y={IDEALS.compass2.y} isPlaced={true} />
                <path d={getWirePath({ x: IDEALS.battery.x + 91, y: IDEALS.battery.y + 20 }, { x: IDEALS.pin2.x, y: IDEALS.pin2.y })} fill="none" stroke="#ca8a04" strokeWidth={5} strokeLinecap="round" />
                <path d={getWirePath({ x: IDEALS.pin1.x, y: IDEALS.pin1.y }, { x: IDEALS.wire.x + 80, y: IDEALS.wire.y - 50 })} fill="none" stroke="#b91c1c" strokeWidth={5} strokeLinecap="round" />
                <path d={getWirePath({ x: IDEALS.wire.x - 70, y: IDEALS.wire.y - 50 }, { x: IDEALS.battery.x, y: IDEALS.battery.y + 20 })} fill="none" stroke="#374151" strokeWidth={5} strokeLinecap="round" />
              </svg>
            </ReferenceOverlay>

            <CanvasDroppable>
              <svg width="100%" height="100%" viewBox="0 0 600 480" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                {/* Guidelines */}
                {!placed.chart_paper && <rect x={IDEALS.chart_paper.x - 80} y={IDEALS.chart_paper.y - 10} width={160} height={20} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="4,4" opacity={0.3} />}
                {!placed.switchBoard && <rect x={IDEALS.switchBoard.x} y={IDEALS.switchBoard.y} width={160} height={210} rx={12} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="4,4" opacity={0.3} />}
                {!placed.battery && <rect x={IDEALS.battery.x} y={IDEALS.battery.y} width={100} height={40} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="4,4" opacity={0.3} />}

                {/* Placed Items */}
                {placed.chart_paper && <DraggableSVGGroup id="chart_paper" isDraggable={!placed.connect}><ChartPaperSVG x={positions.chart_paper.x} y={positions.chart_paper.y} isPlaced={true} /></DraggableSVGGroup>}
                {placed.nail && <DraggableSVGGroup id="nail" isDraggable={!placed.test_iron}><IronNailSVG x={positions.nail.x} y={positions.nail.y} isPlaced={true} /></DraggableSVGGroup>}
                {placed.paper_clips && <DraggableSVGGroup id="paper_clips" isDraggable={!placed.test_iron}><PaperClipsSVG x={positions.paper_clips.x} y={positions.paper_clips.y} isPlaced={true} /></DraggableSVGGroup>}
                {placed.wire && <DraggableSVGGroup id="wire" isDraggable={!placed.connect}><CopperCoilSVG x={positions.wire.x} y={positions.wire.y} isPlaced={true} /></DraggableSVGGroup>}
                
                {placed.switchBoard && <DraggableSVGGroup id="switchBoard" isDraggable={!placed.connect}><CardboardSwitchSVG x={positions.switchBoard.x} y={positions.switchBoard.y} /></DraggableSVGGroup>}
                {placed.pin1 && <DraggableSVGGroup id="pin1" isDraggable={!placed.connect}><DrawingPinSVG x={positions.pin1.x} y={positions.pin1.y} label="PIN 1" isPlaced={true} />{placed.safetyPin && <SafetyPinSVG x={positions.pin1.x} y={positions.pin1.y} rotation={switchOn ? 0 : -30} isPlaced={true} />}</DraggableSVGGroup>}
                {placed.pin2 && <DraggableSVGGroup id="pin2" isDraggable={!placed.connect}><DrawingPinSVG x={positions.pin2.x} y={positions.pin2.y} label="PIN 2" isPlaced={true} /></DraggableSVGGroup>}
                {placed.safetyPin && !placed.pin1 && <DraggableSVGGroup id="safetyPin" isDraggable={!placed.connect}><SafetyPinSVG x={positions.safetyPin.x} y={positions.safetyPin.y} rotation={-30} isPlaced={true} /></DraggableSVGGroup>}
                {placed.battery && <DraggableSVGGroup id="battery" isDraggable={!placed.connect}><g transform={`translate(${positions.battery.x - 44}, ${positions.battery.y - 366})`}><BatterySVG isPlaced={true} /></g></DraggableSVGGroup>}
                {placed.compass1 && <DraggableSVGGroup id="compass1" isDraggable={true}><CompassSVG x={positions.compass1.x} y={positions.compass1.y} isPlaced={true} needleRotation={compass1Rot} /></DraggableSVGGroup>}
                {placed.compass2 && <DraggableSVGGroup id="compass2" isDraggable={true}><CompassSVG x={positions.compass2.x} y={positions.compass2.y} isPlaced={true} needleRotation={compass2Rot} /></DraggableSVGGroup>}

                {/* Invisible click target for switch toggling when ready */}
                {placed.connect && (
                   <rect x={positions.pin1.x - 30} y={positions.pin1.y - 20} width={120} height={120} fill="transparent" style={{ cursor: 'pointer' }} onClick={handleSwitchToggle} />
                )}

                {/* Pulsing indicator for Action Steps */}
                {(selectedItemId === "test_air" || selectedItemId === "test_iron") && !placed[selectedItemId] && (
                  <g pointerEvents="none">
                    <rect x={positions.pin1.x - 40} y={positions.pin1.y - 30} width={100} height={150} rx={12} fill="none" stroke="#ef4444" strokeWidth={3} strokeDasharray="8 8">
                      <animate attributeName="stroke-dashoffset" values="16;0" dur="1s" repeatCount="indefinite" />
                    </rect>
                    <text x={positions.pin1.x + 10} y={positions.pin1.y - 45} fill="#ef4444" fontSize="14" fontWeight="bold" textAnchor="middle">
                      CLICK SWITCH TO TEST!
                    </text>
                  </g>
                )}

                {/* Wires */}
                {selectedItemId === "connect" && (
                   <g opacity={0.5}>
                     {!connectedWires.includes("w1") && <path d={getWirePath(getTerminalCoords("battery-pos"), getTerminalCoords("pin2"))} fill="none" stroke="var(--accent)" strokeWidth={3} strokeDasharray="6,6" />}
                     {!connectedWires.includes("w2") && <path d={getWirePath(getTerminalCoords("pin1"), getTerminalCoords("coil-right"))} fill="none" stroke="var(--accent)" strokeWidth={3} strokeDasharray="6,6" />}
                     {!connectedWires.includes("w3") && <path d={getWirePath(getTerminalCoords("coil-left"), getTerminalCoords("battery-neg"))} fill="none" stroke="var(--accent)" strokeWidth={3} strokeDasharray="6,6" />}
                   </g>
                )}
                {connectedWires.includes("w1") && <><path d={getWirePath(getTerminalCoords("battery-pos"), getTerminalCoords("pin2"))} fill="none" stroke="#ca8a04" strokeWidth={5} strokeLinecap="round" /><path d={getWirePath(getTerminalCoords("battery-pos"), getTerminalCoords("pin2"))} fill="none" stroke="#fde047" strokeWidth={2.5} strokeLinecap="round" /></>}
                {connectedWires.includes("w2") && <><path d={getWirePath(getTerminalCoords("pin1"), getTerminalCoords("coil-right"))} fill="none" stroke="#b91c1c" strokeWidth={5} strokeLinecap="round" /><path d={getWirePath(getTerminalCoords("pin1"), getTerminalCoords("coil-right"))} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" /></>}
                {connectedWires.includes("w3") && <><path d={getWirePath(getTerminalCoords("coil-left"), getTerminalCoords("battery-neg"))} fill="none" stroke="#374151" strokeWidth={5} strokeLinecap="round" /><path d={getWirePath(getTerminalCoords("coil-left"), getTerminalCoords("battery-neg"))} fill="none" stroke="#6b7280" strokeWidth={2.5} strokeLinecap="round" /></>}

                {selectedItemId === "connect" && terminals.map(t => {
                  const coords = getTerminalCoords(t.id);
                  const isSelected = selectedTerminal === t.id;
                  let isConnected = false;
                  if (t.id === "battery-pos" || t.id === "pin2") isConnected = connectedWires.includes("w1");
                  if (t.id === "pin1" || t.id === "coil-right") isConnected = connectedWires.includes("w2");
                  if (t.id === "battery-neg" || t.id === "coil-left") isConnected = connectedWires.includes("w3");
                  return (
                    <g key={t.id} transform={`translate(${coords.x}, ${coords.y})`} style={{ cursor: "pointer" }} onClick={() => handleTerminalClick(t.id)}>
                      <circle r={isSelected ? 11 : 7} fill="none" stroke={isSelected ? "#60a5fa" : t.color} strokeWidth={isSelected ? 3 : 2} className={isSelected ? "bulb-glowing" : ""} />
                      <circle r={4} fill={isSelected ? "#3b82f6" : isConnected ? "var(--success)" : "var(--card-bg)"} />
                    </g>
                  );
                })}
              </svg>
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} style={{ position: "absolute", top: "0.75rem", left: "0.75rem", right: "0.75rem", background: "rgba(239, 68, 68, 0.95)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.8rem", color: "var(--card-bg)", display: "flex", alignItems: "center", gap: "0.4rem", zIndex: 40 }}>
                    <AlertCircle size={14} /> <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </CanvasDroppable>
          </div>
        </div>

        {/* BOTTOM PANEL: PARTS BENCH */}
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1rem", background: "var(--card-bg)", borderColor: "var(--border)", borderRadius: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "0.95rem", color: "var(--accent-text)", display: "flex", alignItems: "center", gap: "0.35rem" }}><Info size={14} /> Parts Bench</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem", minHeight: "180px" }}>
            {selectedItemId && !["connect", "test_air", "test_iron"].includes(selectedItemId) ? (
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 0.8, borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface)", height: "180px" }}>
                  {/* Ideally 3D viewer goes here, reusing the old one but without breaking */}
                   <ThreeDViewer componentId={selectedItemId} />
                </div>
                <div style={{ flex: 1.2, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "1rem", color: "var(--text-heading)" }}>{STEPS.find(s => s.id === selectedItemId)?.name}</h4>
                    <ul style={{ margin: "0.25rem 0 0 1rem", padding: 0, fontSize: "0.75rem", color: "var(--text-faint)", lineHeight: "1.4", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                      {STEPS.find(s => s.id === selectedItemId)?.desc.map((line, i) => <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "bold" }}>HOW TO ASSEMBLE:</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", background: "var(--accent-bg)", border: "1px dashed rgba(99, 102, 241, 0.4)", borderRadius: "10px", color: "var(--accent-text)", fontSize: "0.8rem", fontWeight: "600", boxShadow: "0 4px 10px rgba(99,102,241,0.1)", cursor: "default" }}>
                      <div style={{ width: "28px", height: "28px", background: "var(--border)", borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {renderThumbnailSVG(selectedItemId)}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                        <span>{STEPS.find(s => s.id === selectedItemId)?.name}</span>
                        <span style={{ fontSize: "0.65rem", color: "var(--accent-text)", fontWeight: "normal" }}>Drag from Component Tray to Workspace</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedItemId ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-primary)" }}>
                Follow the instructions on the canvas to complete this action step.
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-faint)" }}>
                Select an unlocked step from the left panel.
              </div>
            )}
          </div>
        </div>

        {/* Drag Overlay layer */}
        <DragOverlay dropAnimation={null}>
          {isDragging && activeDraggingStep ? (
            <div style={{ display: "inline-flex", opacity: 0.8, filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.2))", pointerEvents: "none", transform: "scale(1.5)", transformOrigin: "center" }}>
              {renderThumbnailSVG(activeDraggingStep.id)}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
