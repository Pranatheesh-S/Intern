import React, { useState, useEffect } from "react";
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";
import confetti from "canvas-confetti";
import { Info, RotateCcw, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import ThreeDViewer from "./ThreeDViewer";

import { CardboardBaseSVG, NailSVG, NichromeWireSVG } from "./CircuitElements2D";
import { BatteryBareSVG, CardboardSwitchSVG, DrawingPinSVG, SafetyPinSVG } from "../../MagneticEffectOfCurrent/CircuitElements";
import ReferenceOverlay from "../../../components/ReferenceOverlay";

const STEPS = [
  { id: "base", name: "Cardboard Base", desc: ["Provides a safe, non-conductive foundation."], hint: "Place Cardboard Base on workspace.", prereq: [] },
  { id: "nail1", name: "Nail 1", desc: ["Acts as the first anchor for the wire."], hint: "Drag Nail 1 onto the base.", prereq: ["base"] },
  { id: "nail2", name: "Nail 2", desc: ["Acts as the second anchor for the wire."], hint: "Drag Nail 2 onto the base (about 5 cm apart).", prereq: ["nail1"] },
  { id: "nichrome", name: "Nichrome Wire", desc: ["Special wire that acts as the heating element.", "Has high resistance to electric current."], hint: "Stretch Nichrome Wire between the two nails.", prereq: ["nail2"] },
  { id: "switchBoard", name: "Switch Base", desc: ["Base for switch."], hint: "Place Switch Base.", prereq: [] },
  { id: "pin1", name: "Drawing Pin 1", desc: ["Terminal 1."], hint: "Place Pin 1 on switch board.", prereq: [] },
  { id: "safetyPin", name: "Safety Pin", desc: ["Moving part."], hint: "Attach Safety Pin.", prereq: [] },
  { id: "pin2", name: "Drawing Pin 2", desc: ["Terminal 2."], hint: "Place Pin 2 on switch board.", prereq: [] },
  { id: "battery", name: "Electric Cell", desc: ["Power source."], hint: "Place Battery.", prereq: [] },
  { id: "connect", name: "Action: Wire Circuit", desc: ["Complete the circuit."], hint: "Click terminals to connect.", prereq: ["nichrome", "battery", "pin1", "pin2", "safetyPin", "switchBoard"] }
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
        width: "100%"
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
    base: { x: 200, y: 150 }, nail1: { x: 150, y: 150 }, nail2: { x: 250, y: 150 }, nichrome: { x: 200, y: 150 },
    switchBoard: { x: 370, y: 150 }, pin1: { x: 450, y: 200 }, safetyPin: { x: 450, y: 200 }, pin2: { x: 450, y: 320 },
    battery: { x: 200, y: 350 }
  });

  const IDEALS = {
    base: { x: 200, y: 150 }, nail1: { x: 150, y: 150 }, nail2: { x: 250, y: 150 }, nichrome: { x: 200, y: 150 },
    switchBoard: { x: 370, y: 150 }, pin1: { x: 450, y: 200 }, safetyPin: { x: 450, y: 200 }, pin2: { x: 450, y: 320 },
    battery: { x: 200, y: 350 }
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
    if (connectedWires.length === 3 && !placed.connect) {
      setPlaced(prev => ({ ...prev, connect: true }));
      setSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [connectedWires, placed.connect]);

  const getTarget = (id) => {
    let target = IDEALS[id];
    if (id === "nail1" && placed.base) target = { x: positions.base.x - 50, y: positions.base.y };
    else if (id === "nail2" && placed.base) target = { x: positions.base.x + 50, y: positions.base.y };
    else if (id === "nichrome" && placed.base) target = { x: positions.base.x, y: positions.base.y };
    else if (id === "pin1" && placed.switchBoard) target = { x: positions.switchBoard.x + 80, y: positions.switchBoard.y + 50 };
    else if (id === "pin2" && placed.switchBoard) target = { x: positions.switchBoard.x + 80, y: positions.switchBoard.y + 170 };
    else if (id === "safetyPin" && placed.pin1) target = { x: positions.pin1.x, y: positions.pin1.y };
    return target;
  };

  const snapToIdeal = (id, x, y) => {
    const target = getTarget(id);
    if (!target) return { x, y };
    const dist = Math.sqrt((x - target.x) ** 2 + (y - target.y) ** 2);
    if (dist < 80) return target;
    return { x, y };
  };

  const isProperlyPlaced = (id) => {
    if (!placed[id]) return false;
    if (["battery", "connect", "base", "switchBoard", "nichrome"].includes(id)) return true;

    const target = getTarget(id);
    if (!target) return true;
    return Math.sqrt((positions[id].x - target.x)**2 + (positions[id].y - target.y)**2) < 20;
  };

  const getSaggingWirePath = (p1, p2) => {
    const controlY = Math.max(p1.y, p2.y) + 40 + Math.abs(p1.x - p2.x) * 0.1;
    return `M ${p1.x},${p1.y} C ${p1.x},${controlY} ${p2.x},${controlY} ${p2.x},${p2.y}`;
  };

  const isStepUnlocked = (stepId) => {
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return false;
    return step.prereq.every((pId) => {
      if (["connect"].includes(pId)) return placed[pId];
      return isProperlyPlaced(pId);
    });
  };

  const handleSelectTrayItem = (stepId) => {
    if (placed[stepId] && !["connect"].includes(stepId)) return;
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
          if (draggedId === "base") {
            if (placed.nail1) newPos.nail1 = { x: x - 50, y };
            if (placed.nail2) newPos.nail2 = { x: x + 50, y };
            if (placed.nichrome) newPos.nichrome = { x, y };
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

  const getTerminalCoords = (terminalId) => {
    const { battery, pin1, pin2, nail1, nail2 } = positions;
    switch (terminalId) {
      case "battery-neg": return { x: battery.x - 45, y: battery.y + 10 };
      case "battery-pos": return { x: battery.x + 46, y: battery.y + 10 };
      case "pin1": return { x: pin1.x, y: pin1.y };
      case "pin2": return { x: pin2.x, y: pin2.y };
      case "nail1": return { x: nail1.x, y: nail1.y + 10 };
      case "nail2": return { x: nail2.x, y: nail2.y + 10 };
      default: return { x: 0, y: 0 };
    }
  };

  const getIdealTerminalCoords = (terminalId) => {
    const { battery, pin1, pin2, nail1, nail2 } = IDEALS;
    switch (terminalId) {
      case "battery-neg": return { x: battery.x - 45, y: battery.y + 10 };
      case "battery-pos": return { x: battery.x + 46, y: battery.y + 10 };
      case "pin1": return { x: pin1.x, y: pin1.y };
      case "pin2": return { x: pin2.x, y: pin2.y };
      case "nail1": return { x: nail1.x, y: nail1.y + 10 };
      case "nail2": return { x: nail2.x, y: nail2.y + 10 };
      default: return { x: 0, y: 0 };
    }
  };

  const handleTerminalClick = (terminalId) => {
    if (selectedItemId !== "connect") return;
    if (!selectedTerminal) {
      setSelectedTerminal(terminalId);
    } else {
      if (selectedTerminal === terminalId) {
        setSelectedTerminal(null);
        return;
      }
      const newConn = [selectedTerminal, terminalId].sort().join("-");
      const validConns = ["battery-pos-nail1", "battery-neg-pin2", "nail2-pin1"];
      const altConns = ["battery-pos-nail2", "battery-neg-pin1", "nail1-pin2"];
      
      let wireId = null;
      if (validConns[0] === newConn || altConns[0] === newConn) wireId = "w1";
      else if (validConns[1] === newConn || altConns[1] === newConn) wireId = "w2";
      else if (validConns[2] === newConn || altConns[2] === newConn) wireId = "w3";
      
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
    { id: "nail1", color: "var(--text-secondary)" }, { id: "nail2", color: "var(--text-secondary)" },
  ];

  const renderThumbnailSVG = (id) => {
    switch (id) {
      case "base": return <svg viewBox="-100 -50 200 100" width="24" height="24"><CardboardBaseSVG isPlaced={true} /></svg>;
      case "nail1": case "nail2": return <svg viewBox="-20 -20 40 40" width="24" height="24"><NailSVG isPlaced={true} /></svg>;
      case "nichrome": return <svg viewBox="-60 -20 120 40" width="24" height="24"><NichromeWireSVG isPlaced={true} /></svg>;
      case "switchBoard": return <svg viewBox="360 140 180 230" width="24" height="24"><CardboardSwitchSVG y={150} /></svg>;
      case "pin1": case "pin2": return <svg viewBox="430 180 40 40" width="24" height="24"><DrawingPinSVG x={450} y={200} isPlaced={true} /></svg>;
      case "safetyPin": return <svg viewBox="-20 -20 40 150" width="24" height="24"><SafetyPinSVG x={0} y={0} rotation={0} isPlaced={true} /></svg>;
      case "battery": return <svg viewBox="0 0 100 60" width="24" height="24"><BatteryBareSVG /></svg>;
      case "connect": return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12c0-4 3-7 8-7s8 3 8 7-3 7-8 7" stroke="var(--danger)" /><path d="M6 13c0-3 2.5-5 6-5s6 2 6 5-2 5-6 5" stroke="var(--warning)" /></svg>;
      default: return null;
    }
  };

  const getNextStepPrompt = () => {
    if (success) return "✅ Stage Complete! The heating circuit is ready.";
    if (selectedItemId === "connect") return "Click the glowing terminals to connect the circuit.";
    const remainingToPlace = STEPS.filter((s) => !placed[s.id] && s.id !== "connect");
    if (remainingToPlace.length > 0) return `${remainingToPlace.length} component(s) left — pick any from the Component Tray.`;
    return "⚡ All physical components placed! Connect the wires.";
  };

  const activeDraggingStep = activeDraggingId ? STEPS.find((s) => s.id === activeDraggingId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="main-grid" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <span className="status-badge neutral" style={{ background: "var(--accent-bg)", color: "var(--accent-text)", fontWeight: "bold" }}>Stage 1: Build</span>
            <h2 style={{ margin: "0.2rem 0 0 0", fontSize: "1.4rem" }}>Construct the Heating Circuit</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <button onClick={() => window.location.reload()} className="outline" style={{ gap: "0.4rem", padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
              <RotateCcw size={14} /> Restart Lab
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1rem", alignItems: "stretch" }}>
          {/* LEFT PANEL: COMPONENT TRAY */}
          <div className="glass-panel" style={{ width: "320px", display: "flex", flexDirection: "column", gap: "1rem", overflow: "hidden", border: "1px solid var(--border)" }}>
            <div style={{ padding: "1rem 1rem 0 1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                Component Tray
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1, overflowY: "auto", padding: "0 1rem" }}>
              {STEPS.map((step) => {
                const isDropped = placed[step.id];
                const isProperlyPlacedOnCanvas = isDropped && isProperlyPlaced(step.id);
                const isActionStep = step.id === "connect";
                const isUnlocked = isStepUnlocked(step.id);
                const isSelected = selectedItemId === step.id;
                const isDisabled = (isDropped && !isActionStep) || !isUnlocked || (isActionStep && isDropped);

                return (
                  <div key={step.id} style={{ position: "relative" }}>
                    <button
                      onClick={() => !isDisabled && handleSelectTrayItem(step.id)}
                      disabled={isDisabled}
                      style={{
                        display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "0.75rem", padding: "0.5rem 1rem", borderRadius: "12px",
                        background: isProperlyPlacedOnCanvas ? "var(--success-bg)" : (isDropped && !isProperlyPlacedOnCanvas) ? "rgba(239, 68, 68, 0.05)" : isSelected ? "var(--accent-bg)" : isUnlocked ? "var(--surface)" : "var(--neutral-bg)",
                        border: `1px solid ${isProperlyPlacedOnCanvas ? "var(--success-border)" : (isDropped && !isProperlyPlacedOnCanvas) ? "rgba(239, 68, 68, 0.4)" : isSelected ? "var(--accent)" : isUnlocked ? "var(--accent-border)" : "var(--border)"}`,
                        color: isProperlyPlacedOnCanvas ? "var(--success)" : (isDropped && !isProperlyPlacedOnCanvas) ? "var(--danger)" : isUnlocked ? "var(--text-primary)" : "var(--text-faint)",
                        cursor: isDisabled ? "not-allowed" : "pointer", transition: "all 0.2s ease", position: "relative",
                        boxShadow: isSelected ? "0 0 0 2px rgba(99,102,241,0.4)" : "none", opacity: (isProperlyPlacedOnCanvas && !isActionStep) ? 0.6 : 1, width: "100%"
                      }}
                    >
                      <div style={{ width: "34px", height: "34px", background: "var(--border)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: isUnlocked ? 1 : 0.2 }}>
                        {renderThumbnailSVG(step.id)}
                      </div>
                      <span style={{ fontSize: "0.8rem", fontWeight: "600", textAlign: "left", opacity: isUnlocked ? 1 : 0.3, flex: 1 }}>
                        {step.name}
                      </span>
                      <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                        {isProperlyPlacedOnCanvas ? <CheckCircle2 size={16} style={{ color: "var(--success)" }} /> : !isUnlocked ? <Lock size={14} style={{ color: "var(--text-secondary)" }} /> : null}
                      </div>
                    </button>
                    {isUnlocked && !isDisabled && (
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
                  <strong style={{ color: "var(--text-primary)" }}>{STEPS.find(s => s.id === selectedItemId)?.hint || STEPS.find(s => s.id === selectedItemId)?.name}</strong>
                  <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1.2rem", color: "var(--text-faint)" }}>
                    {STEPS.find(s => s.id === selectedItemId)?.desc.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-faint)", fontStyle: "italic" }}>
                  {success ? "Circuit complete! Click 'Continue' to observe." : "Select a component from the tray to begin."}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: MAIN CANVAS */}
          <div className="glass-panel" style={{ flex: 1, position: "relative", minHeight: "480px", display: "flex", flexDirection: "column", background: "var(--canvas-bg)", borderRadius: "16px", border: "1px solid var(--canvas-border)", overflow: "hidden" }}>
            
            <ReferenceOverlay title="Reference Blueprint">
              <svg width="280" height="180" viewBox="40 80 500 320" style={{ opacity: 0.85 }}>
                {/* Components */}
                <CardboardBaseSVG x={IDEALS.base.x} y={IDEALS.base.y} isPlaced={true} />
                <NailSVG x={IDEALS.nail1.x} y={IDEALS.nail1.y} isPlaced={true} />
                <NailSVG x={IDEALS.nail2.x} y={IDEALS.nail2.y} isPlaced={true} />
                <NichromeWireSVG x1={IDEALS.nail1.x} y1={IDEALS.nail1.y} x2={IDEALS.nail2.x} y2={IDEALS.nail2.y} isPlaced={true} />

                <CardboardSwitchSVG x={IDEALS.switchBoard.x} y={IDEALS.switchBoard.y} width={160} height={210} />
                <DrawingPinSVG x={IDEALS.pin2.x} y={IDEALS.pin2.y} isPlaced={true} />
                <DrawingPinSVG x={IDEALS.pin1.x} y={IDEALS.pin1.y} isPlaced={true} />
                <SafetyPinSVG x={IDEALS.safetyPin.x} y={IDEALS.safetyPin.y} rotation={0} isPlaced={true} />
                
                <g transform={`translate(${IDEALS.battery.x - 45}, ${IDEALS.battery.y - 20})`}><BatteryBareSVG /></g>

                {/* Wires (Rendered after components so they appear on top) */}
                <path d={getSaggingWirePath(getIdealTerminalCoords("battery-pos"), getIdealTerminalCoords("nail1"))} stroke="var(--danger)" strokeWidth="4" fill="none" opacity="0.6" />
                <path d={getSaggingWirePath(getIdealTerminalCoords("battery-neg"), getIdealTerminalCoords("pin2"))} stroke="var(--text-primary)" strokeWidth="4" fill="none" opacity="0.6" />
                <path d={getSaggingWirePath(getIdealTerminalCoords("nail2"), getIdealTerminalCoords("pin1"))} stroke="#000" strokeWidth="4" fill="none" opacity="0.6" />
              </svg>
            </ReferenceOverlay>

            {selectedItemId === "connect" && (
              <div style={{ position: "absolute", top: "1rem", left: "1rem", right: "1rem", background: "var(--surface)", border: "1px solid var(--primary)", borderRadius: "12px", zIndex: 10, padding: "0.8rem 1rem", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 5px 20px rgba(14,165,233,0.15)" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(14,165,233,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Info size={18} style={{ color: "var(--primary)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 0.2rem 0", fontSize: "0.95rem" }}>Wire the Circuit</h3>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)" }}>Click two terminals (glowing dots) to connect them with a wire.</p>
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--primary)" }}>
                  {connectedWires.length} / 3 Wires
                </div>
              </div>
            )}

            {error && (
              <div style={{ position: "absolute", top: "1rem", left: "1rem", right: "1rem", background: "rgba(239, 68, 68, 0.95)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.8rem", color: "white", zIndex: 60, textAlign: "center" }}>
                {error}
              </div>
            )}

            <CanvasDroppable>
              <svg width="100%" height="100%" viewBox="0 0 600 480" style={{ display: "block" }}>
                {/* Components */}
                {placed.base && <DraggableSVGGroup id="base" isDraggable={true}><CardboardBaseSVG x={positions.base.x} y={positions.base.y} isPlaced={true} /></DraggableSVGGroup>}
                {placed.nail1 && <DraggableSVGGroup id="nail1" isDraggable={true}><NailSVG x={positions.nail1.x} y={positions.nail1.y} isPlaced={true} /></DraggableSVGGroup>}
                {placed.nail2 && <DraggableSVGGroup id="nail2" isDraggable={true}><NailSVG x={positions.nail2.x} y={positions.nail2.y} isPlaced={true} /></DraggableSVGGroup>}
                {placed.nichrome && <DraggableSVGGroup id="nichrome" isDraggable={true}><NichromeWireSVG x1={positions.nail1.x} y1={positions.nail1.y} x2={positions.nail2.x} y2={positions.nail2.y} isPlaced={true} /></DraggableSVGGroup>}

                {placed.switchBoard && <DraggableSVGGroup id="switchBoard" isDraggable={true}><CardboardSwitchSVG x={positions.switchBoard.x} y={positions.switchBoard.y} width={160} height={210} /></DraggableSVGGroup>}
                {placed.pin2 && <DraggableSVGGroup id="pin2" isDraggable={true}><DrawingPinSVG x={positions.pin2.x} y={positions.pin2.y} isPlaced={true} /></DraggableSVGGroup>}
                {placed.pin1 && <DraggableSVGGroup id="pin1" isDraggable={true}><DrawingPinSVG x={positions.pin1.x} y={positions.pin1.y} isPlaced={true} /></DraggableSVGGroup>}
                {placed.safetyPin && <DraggableSVGGroup id="safetyPin" isDraggable={true}><SafetyPinSVG x={positions.safetyPin.x} y={positions.safetyPin.y} rotation={0} isPlaced={true} /></DraggableSVGGroup>}
                
                {placed.battery && <DraggableSVGGroup id="battery" isDraggable={true}><g transform={`translate(${positions.battery.x - 45}, ${positions.battery.y - 20})`}><BatteryBareSVG /></g></DraggableSVGGroup>}

                {/* Wires (Rendered after components so they appear on top) */}
                {connectedWires.includes("w1") && <path d={getSaggingWirePath(getTerminalCoords("battery-pos"), getTerminalCoords("nail1"))} stroke="var(--danger)" strokeWidth="4" fill="none" />}
                {connectedWires.includes("w2") && <path d={getSaggingWirePath(getTerminalCoords("battery-neg"), getTerminalCoords("pin2"))} stroke="var(--text-primary)" strokeWidth="4" fill="none" />}
                {connectedWires.includes("w3") && <path d={getSaggingWirePath(getTerminalCoords("nail2"), getTerminalCoords("pin1"))} stroke="var(--warning)" strokeWidth="4" fill="none" />}
                
                {/* Wire Guidelines */}
                {selectedItemId === "connect" && !connectedWires.includes("w1") && <path d={getSaggingWirePath(getTerminalCoords("battery-pos"), getTerminalCoords("nail1"))} fill="none" stroke="var(--accent)" strokeWidth={3} strokeDasharray="6,6" opacity="0.6" />}
                {selectedItemId === "connect" && !connectedWires.includes("w2") && <path d={getSaggingWirePath(getTerminalCoords("battery-neg"), getTerminalCoords("pin2"))} fill="none" stroke="var(--accent)" strokeWidth={3} strokeDasharray="6,6" opacity="0.6" />}
                {selectedItemId === "connect" && !connectedWires.includes("w3") && <path d={getSaggingWirePath(getTerminalCoords("nail2"), getTerminalCoords("pin1"))} fill="none" stroke="var(--accent)" strokeWidth={3} strokeDasharray="6,6" opacity="0.6" />}

                {/* Terminals */}
                {selectedItemId === "connect" && terminals.map(t => {
                  const coords = getTerminalCoords(t.id);
                  const isSelected = selectedTerminal === t.id;
                  return (
                    <circle key={t.id} cx={coords.x} cy={coords.y} r={isSelected ? 10 : 8} fill={t.color} stroke={isSelected ? "white" : "transparent"} strokeWidth="2"
                      style={{ cursor: "pointer", transition: "all 0.2s" }}
                      onClick={() => handleTerminalClick(t.id)}
                      opacity={isSelected ? 1 : 0.6}
                    >
                      <animate attributeName="r" values={isSelected ? "10;12;10" : "8;10;8"} dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  );
                })}
              </svg>
            </CanvasDroppable>

            {success && (
              <div style={{ position: "absolute", bottom: "1.5rem", right: "1.5rem" }}>
                <button onClick={onComplete} className="primary" style={{ padding: "0.8rem 1.5rem", fontSize: "1rem", boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)" }}>
                  Continue to Observation <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Drag Overlay layer */}
        <DragOverlay>
          {isDragging && activeDraggingStep && !placed[activeDraggingStep.id] ? (
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
