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
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import ThreeDViewer from "./ThreeDViewer";
import {
  CardboardSVG,
  DrawingPinSVG,
  SafetyPinSVG,
  BulbSVG,
  BatterySVG,
  WiresSVG,
} from "./CircuitElements";

const STEPS = [
  {
    id: "cardboard",
    name: "Cardboard Base",
    desc: "Acts as an insulating platform to build the switch on.",
    hint: "Drag the cardboard base onto the canvas board.",
    prereq: [],
  },
  {
    id: "pin1",
    name: "First Drawing Pin",
    desc: "Serves as the pivot point/anchor for the safety pin.",
    hint: "Place the first drawing pin into the cardboard base.",
    prereq: [],
  },
  {
    id: "safetyPin",
    name: "Safety Pin",
    desc: "The movable conductor that will close or open the gap.",
    hint: "Attach the safety pin to the first drawing pin.",
    prereq: [],
  },
  {
    id: "pin2",
    name: "Second Drawing Pin",
    desc: "The contact terminal that the safety pin will touch to close the circuit.",
    hint: "Fix the second drawing pin so the safety pin can touch it.",
    prereq: [],
  },
  {
    id: "battery",
    name: "Electric Cell (Battery)",
    desc: "The source of electrical energy for the circuit.",
    hint: "Place the 1.5V electric cell on the canvas board.",
    prereq: [],
  },
  {
    id: "bulb",
    name: "Electric Bulb",
    desc: "The load/device that will indicate if current is flowing.",
    hint: "Install the bulb holder and bulb.",
    prereq: [],
  },
  {
    id: "wires",
    name: "Connecting Wires",
    desc: "Provide a path for electric current to flow through.",
    hint: "Connect the wires to link the battery, bulb, and switch.",
    prereq: ["cardboard", "pin1", "safetyPin", "pin2", "battery", "bulb"],
  },
];

// Draggable wrapper component
function DraggableToken({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
    });

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

// Droppable Canvas component

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
  const { setNodeRef } = useDroppable({
    id: "canvas",
  });
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

// Draggable SVG Group component for modifying coordinates on the canvas
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

// Helper to verify if drawing pins are inside cardboard base bounds (160 x 210)
const isPinOnCardboard = (pinPos, cardboardPos) => {
  if (!pinPos || !cardboardPos) return false;
  return (
    pinPos.x >= cardboardPos.x &&
    pinPos.x <= cardboardPos.x + 160 &&
    pinPos.y >= cardboardPos.y &&
    pinPos.y <= cardboardPos.y + 210
  );
};

export default function Stage1_Build({ onComplete }) {
  const [placed, setPlaced] = useState({
    cardboard: false,
    pin1: false,
    safetyPin: false,
    pin2: false,
    battery: false,
    bulb: false,
    wires: false,
  });

  const [positions, setPositions] = useState({
    cardboard: { x: 370, y: 200 },
    pin1: { x: 450, y: 250 },
    safetyPin: { x: 450, y: 250 },
    pin2: { x: 450, y: 370 },
    battery: { x: 150, y: 390 },
    bulb: { x: 300, y: 102 },
  });

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Wire Connection States
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [connectedWires, setConnectedWires] = useState([]); // Array containing 'wire1', 'wire2', 'wire3'

  // Scientific validation: Switch pins must reside on the insulating cardboard board
  const pin1OnCardboard = isPinOnCardboard(positions.pin1, positions.cardboard);
  const pin2OnCardboard = isPinOnCardboard(positions.pin2, positions.cardboard);
  const pinsValid = pin1OnCardboard && pin2OnCardboard;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
  );

  // Auto-complete validation once all 3 wires are connected
  useEffect(() => {
    if (connectedWires.length === 3) {
      setPlaced((prev) => ({ ...prev, wires: true }));
      setSuccess(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  }, [connectedWires]);

  // Snaps components to ideal positions if close enough
  const snapToIdeal = (id, x, y) => {
    const ideals = {
      cardboard: { x: 370, y: 200 },
      pin1: { x: 450, y: 250 },
      safetyPin: { x: 450, y: 250 },
      pin2: { x: 450, y: 370 },
      battery: { x: 150, y: 390 },
      bulb: { x: 300, y: 102 },
    };
    const ideal = ideals[id];
    if (!ideal) return { x, y };

    const dist = Math.sqrt((x - ideal.x) ** 2 + (y - ideal.y) ** 2);
    if (dist < 40) {
      return ideal; // snap
    }
    return { x, y }; // keep free dropped pos
  };

  const isStepUnlocked = (stepId) => {
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return false;
    const prereqsMet = step.prereq.every((pId) => placed[pId] === true);
    if (stepId === "wires") {
      return prereqsMet && pinsValid;
    }
    return prereqsMet;
  };

  const handleSelectTrayItem = (stepId) => {
    if (placed[stepId] && stepId !== "wires") return;
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return;

    if (!isStepUnlocked(stepId)) {
      if (stepId === "wires" && step.prereq.every((pId) => placed[pId])) {
        setError(
          "⚠️ Scientific Check Warning: Both drawing pins must be placed on the Cardboard Base! The cardboard sheet acts as an insulator preventing current from leaking into the table/surface."
        );
        return;
      }
      const missingPrereqs = step.prereq.filter((pId) => !placed[pId]);
      const missingNames = missingPrereqs
        .map((pId) => STEPS.find((s) => s.id === pId)?.name)
        .join(", ");
      setError(
        `❌ Cannot select "${step.name}". You must place the following first: ${missingNames}`,
      );
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
        
        // Calculate true SVG scale and offsets because of preserveAspectRatio="xMidYMid meet"
        const svgScale = Math.min(rect.width / 600, rect.height / 480);
        const offsetX = (rect.width - 600 * svgScale) / 2;
        const offsetY = (rect.height - 480 * svgScale) / 2;
        
        if (placed[draggedId]) {
          // If already placed, use precise drag delta rather than bounding box math
          const dx = event.delta.x / svgScale;
          const dy = event.delta.y / svgScale;
          x = positions[draggedId].x + dx;
          y = positions[draggedId].y + dy;
        } else {
          // Dragged from tray
          const clientX = activeRect.left + activeRect.width / 2;
          const clientY = activeRect.top + activeRect.height / 2;
          
          x = (clientX - rect.left - offsetX) / svgScale;
          y = (clientY - rect.top - offsetY) / svgScale;

          // Cardboard SVG uses top-left coordinates, not center.
          // Subtract half width and height (160x210) to map drag center correctly.
          if (draggedId === "cardboard") {
            x -= 80;
            y -= 105;
          }
        }

        // Apply snapping
        const snapped = snapToIdeal(draggedId, x, y);
        x = snapped.x;
        y = snapped.y;

        // Keep inside reasonable bounds of the canvas area
        x = Math.max(20, Math.min(580, x));
        y = Math.max(20, Math.min(460, y));

        setPositions((prev) => {
          const newPos = { ...prev, [draggedId]: { x, y } };
          if (draggedId === "pin1") {
            newPos.safetyPin = { x, y }; // Safety pin anchors to pin 1
          }
          if (draggedId === "cardboard") {
            const dx = x - prev.cardboard.x;
            const dy = y - prev.cardboard.y;
            
            // If the pin is currently placed on the cardboard, move it!
            const pin1OnBoard = Math.abs(prev.pin1.x - (prev.cardboard.x + 80)) < 2 && Math.abs(prev.pin1.y - (prev.cardboard.y + 50)) < 2;
            if (placed.pin1 && pin1OnBoard) {
              newPos.pin1 = { x: prev.pin1.x + dx, y: prev.pin1.y + dy };
              if (placed.safetyPin) newPos.safetyPin = { x: prev.safetyPin.x + dx, y: prev.safetyPin.y + dy };
            }

            const pin2OnBoard = Math.abs(prev.pin2.x - (prev.cardboard.x + 80)) < 2 && Math.abs(prev.pin2.y - (prev.cardboard.y + 170)) < 2;
            if (placed.pin2 && pin2OnBoard) {
              newPos.pin2 = { x: prev.pin2.x + dx, y: prev.pin2.y + dy };
            }
          }
          return newPos;
        });

        // Set placed state (if it was from the parts bench)
        if (!placed[draggedId]) {
          setPlaced((prev) => ({ ...prev, [draggedId]: true }));
          setSelectedItemId(null); // Clear selected item from 3D Viewer

          confetti({
            particleCount: 25,
            spread: 45,
            origin: { y: 0.8 },
          });
        }
      }
    }
  };

  const handleReset = () => {
    setPlaced({
      cardboard: false,
      pin1: false,
      safetyPin: false,
      pin2: false,
      battery: false,
      bulb: false,
      wires: false,
    });
    setPositions({
      cardboard: { x: 370, y: 200 },
      pin1: { x: 450, y: 250 },
      safetyPin: { x: 450, y: 250 },
      pin2: { x: 450, y: 370 },
      battery: { x: 150, y: 390 },
      bulb: { x: 300, y: 102 },
    });
    setSelectedItemId(null);
    setSelectedTerminal(null);
    setConnectedWires([]);
    setError("");
    setSuccess(false);
  };

  // Helper to calculate actual terminal coordinates based on placed component coordinates
  const getTerminalCoords = (terminalId) => {
    const bulb = positions.bulb;
    const battery = positions.battery;
    const pin1 = positions.pin1;
    const pin2 = positions.pin2;

    switch (terminalId) {
      case "battery-neg":
        return { x: battery.x - 46, y: battery.y };
      case "battery-pos":
        return { x: battery.x + 42, y: battery.y };
      case "bulb-left":
        return { x: bulb.x - 30, y: bulb.y };
      case "bulb-right":
        return { x: bulb.x + 30, y: bulb.y };
      case "pin1":
        return { x: pin1.x, y: pin1.y };
      case "pin2":
        return { x: pin2.x, y: pin2.y };
      default:
        return { x: 0, y: 0 };
    }
  };

  // Generate a sagging curved wire path between two points
  const getWirePath = (p1, p2) => {
    const controlY = Math.max(p1.y, p2.y) + 30 + Math.abs(p1.x - p2.x) * 0.1;
    return `M ${p1.x},${p1.y} C ${p1.x},${controlY} ${p2.x},${controlY} ${p2.x},${p2.y}`;
  };

  const getWireKey = (t1, t2) => {
    return [t1, t2].sort().join(" <-> ");
  };

  const isTerminalConnected = (tId) => {
    if (tId === "battery-neg" || tId === "bulb-left") {
      return connectedWires.includes("wire1");
    }
    if (tId === "battery-pos" || tId === "pin2") {
      return connectedWires.includes("wire2");
    }
    if (tId === "pin1" || tId === "bulb-right") {
      return connectedWires.includes("wire3");
    }
    return false;
  };

  const handleTerminalClick = (terminalId) => {
    setError("");
    
    // Ensure the wires step is fully unlocked (all prerequisites placed and valid)
    if (!isStepUnlocked("wires")) {
      // Just ignore clicks if they shouldn't be wiring yet
      return;
    }
    
    if (!pinsValid) {
      setError(
        "⚠️ Scientific Check Warning: Both drawing pins must be placed on the Cardboard Base! The cardboard sheet acts as an insulator preventing current from leaking into the table/surface."
      );
      return;
    }
    
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
        "battery-neg <-> bulb-left": "wire1",
        "battery-pos <-> pin2": "wire2",
        "bulb-right <-> pin1": "wire3",
      };

      const wireId = standardValid[wireKey];

      if (wireId) {
        if (connectedWires.includes(wireId)) {
          setError("ℹ️ This connection is already established!");
        } else {
          setConnectedWires((prev) => [...prev, wireId]);
          confetti({
            particleCount: 25,
            spread: 35,
            origin: { y: 0.8 },
          });
        }
      } else {
        // Detailed pedagogical feedback for incorrect connections
        if (t1.startsWith("battery") && t2.startsWith("battery")) {
          setError(
            "❌ Short Circuit! Connecting the positive and negative terminals of a battery directly causes a short circuit.",
          );
        } else if (t1.startsWith("bulb") && t2.startsWith("bulb")) {
          setError(
            "❌ Connecting the bulb terminals together won't power the bulb. You need to connect it to the battery and switch.",
          );
        } else if (t1.startsWith("pin") && t2.startsWith("pin")) {
          setError(
            "❌ Connecting the switch pins directly bypasses the circuit loop.",
          );
        } else {
          setError(
            "❌ Invalid connection. Follow the dotted guide lines to connect the circuit!",
          );
        }
      }
      setSelectedTerminal(null);
    }
  };

  // Custom progress helpers
  const physicalSteps = [
    "cardboard",
    "pin1",
    "safetyPin",
    "pin2",
    "battery",
    "bulb",
  ];
  const physicalPlacedCount = physicalSteps.filter((k) => placed[k]).length;
  const completedCount = physicalPlacedCount + (placed.wires ? 1 : 0);
  const progressPercent = (completedCount / STEPS.length) * 100;

  const activeStep = STEPS.find((s) => s.id === selectedItemId);

  // Render SVG thumbnails for parts tray & parts bench
  const renderThumbnailSVG = (id) => {
    switch (id) {
      case "cardboard":
        return (
          <svg
            viewBox="360 190 180 230"
            width="24"
            height="24"
            style={{ pointerEvents: "none" }}
          >
            <CardboardSVG />
          </svg>
        );
      case "pin1":
      case "pin2":
        return (
          <svg
            viewBox="430 230 40 40"
            width="24"
            height="24"
            style={{ pointerEvents: "none" }}
          >
            <DrawingPinSVG x={450} y={250} isPlaced={true} />
          </svg>
        );
      case "safetyPin":
        return (
          <svg
            viewBox="-20 -20 40 150"
            width="24"
            height="24"
            style={{ pointerEvents: "none" }}
          >
            <SafetyPinSVG x={0} y={0} rotation={0} isPlaced={true} />
          </svg>
        );
      case "battery":
        return (
          <svg
            viewBox="100 365 100 50"
            width="24"
            height="24"
            style={{ pointerEvents: "none" }}
          >
            <BatterySVG isPlaced={true} />
          </svg>
        );
      case "bulb":
        return (
          <svg
            viewBox="250 20 100 100"
            width="24"
            height="24"
            style={{ pointerEvents: "none" }}
          >
            <BulbSVG isPlaced={true} />
          </svg>
        );
      case "wires":
        return (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pointerEvents: "none" }}
          >
            {/* Outer red loop */}
            <path d="M4 12c0-4 3-7 8-7s8 3 8 7-3 7-8 7" stroke="var(--danger)" />
            {/* Inner yellow loop */}
            <path d="M6 13c0-3 2.5-5 6-5s6 2 6 5-2 5-6 5" stroke="var(--warning)" />
            {/* Left metallic tip */}
            <path d="M4 12H2" stroke="var(--text-faint)" strokeWidth="1.5" />
            {/* Right metallic tip */}
            <path d="M20 12h2" stroke="var(--text-faint)" strokeWidth="1.5" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getNextStepPrompt = () => {
    if (success) return "✅ Switch Constructed Successfully!";
    if (selectedItemId === "wires") {
      if (!pinsValid) {
        return "⚠️ Scientific Check: Place both Drawing Pins on the Cardboard Base first!";
      }
      return "Instruction: Click a glowing terminal dot, then click another to connect them with a wire.";
    }
    const placedCount = Object.values(placed).filter(Boolean).length;
    if (placedCount === 0)
      return "🔬 Choose any component from the tray below and drag it onto the canvas to begin!";
    const remaining = STEPS.filter((s) => s.id !== "wires" && !placed[s.id]);
    if (remaining.length > 0)
      return `🔧 ${remaining.length} component${remaining.length > 1 ? "s" : ""} left — pick any from the tray and place them on the canvas.`;
    return "⚡ All components placed! Now select Connecting Wires to link everything together.";
  };

  const terminals = [
    { id: "battery-neg", label: "Battery (-)", color: "var(--danger)" },
    { id: "battery-pos", label: "Battery (+)", color: "var(--danger)" },
    { id: "bulb-left", label: "Bulb Terminal A", color: "#3b82f6" },
    { id: "bulb-right", label: "Bulb Terminal B", color: "#3b82f6" },
    { id: "pin1", label: "Drawing Pin 1", color: "#ca8a04" },
    { id: "pin2", label: "Drawing Pin 2", color: "#ca8a04" },
  ];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <div
        className="main-grid"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header Navigation with Progress */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div>
            <span
              className="status-badge neutral"
              style={{
              background: "var(--accent-bg)",
                color: "var(--accent-text)",
                fontWeight: "bold",
              }}
            >
              Stage 1: Build the Switch
            </span>
            <h2 style={{ margin: "0.2rem 0 0 0", fontSize: "1.4rem" }}>
              Construct the Switch
            </h2>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Progress:{" "}
              <strong>
                {completedCount} / {STEPS.length}
              </strong>
            </span>
            <div
              style={{
                width: "100px",
                height: "6px",
                background: "var(--border)",
                borderRadius: "3px",
                overflow: "hidden",
                alignSelf: "center",
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "var(--success)",
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "1rem",
            alignItems: "stretch",
          }}
        >
          {/* ============================================== */}
          {/* COMPONENTS SECTION (LEFT PANEL)                */}
          {/* ============================================== */}
          <div
            className="glass-panel"
            style={{
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              height: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
                background: "var(--neutral-bg)",
                padding: "0.6rem 0.8rem",
                borderRadius: "10px",
                border: "1px solid var(--border)",
              }}
            >
              <Info style={{ color: "var(--accent)", flexShrink: 0 }} size={16} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                {getNextStepPrompt()}
              </span>
            </div>

            <h3 style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-primary)" }}>
              Component Tray
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
                alignContent: "start",
              }}
            >
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
                    className="tray-btn"
                    onClick={() => handleSelectTrayItem(step.id)}
                    disabled={isDisabled}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0.6rem 0.4rem",
                      borderRadius: "12px",
                      background:
                        isPlaced && !isWires
                          ? "var(--success-bg)"
                          : isSelected
                            ? "var(--accent-bg)"
                            : isUnlocked
                              ? "var(--surface)"
                              : "var(--neutral-bg)",
                      border: `1px solid ${isPlaced && !isWires
                          ? "var(--success-border)"
                          : isSelected
                            ? "var(--accent)"
                            : isUnlocked
                              ? "var(--accent-border)"
                              : "var(--border)"
                        }`,
                      color:
                        isPlaced && !isWires
                          ? "var(--success)"
                          : isUnlocked
                            ? "var(--text-primary)"
                            : "var(--text-faint)",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                      position: "relative",
                      minHeight: "72px",
                      boxShadow: isSelected
                        ? "0 0 0 2px rgba(99,102,241,0.4)"
                        : isUnlocked && !isPlaced
                          ? "0 1px 4px rgba(0,0,0,0.08)"
                          : "none",
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        background: "var(--border)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "0.35rem",
                        opacity: isUnlocked ? 1 : 0.2,
                        transition: "opacity 0.2s",
                      }}
                    >
                      {renderThumbnailSVG(step.id)}
                    </div>

                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: "600",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        width: "100%",
                        opacity: isUnlocked ? 1 : 0.3,
                      }}
                    >
                      {step.name}
                    </span>

                    {/* Badge: check if placed, lock if locked */}
                    <div
                      style={{ position: "absolute", top: "5px", right: "5px" }}
                    >
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

          {/* ============================================== */}
          {/* ASSEMBLY WORKSPACE (RIGHT PANEL)               */}
          {/* ============================================== */}
          <div
            style={{
              flex: 1,
              position: "relative",
              minHeight: "480px",
              display: "flex",
              flexDirection: "column",
              background: "var(--canvas-bg)",
              borderRadius: "16px",
              border: "1px solid var(--canvas-border)",
              overflow: "hidden",
            }}
          >
            <CanvasDroppable>
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 600 480"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* Initial Dotted Placement Guide Lines Removed */}

                {/* REAL COMPONENT PLACEMENT RENDERING */}
                {/* Cardboard Base (Bottom Layer) */}
                {placed.cardboard && (
                  <DraggableSVGGroup id="cardboard" isDraggable={!success}>
                    <CardboardSVG
                      x={positions.cardboard.x}
                      y={positions.cardboard.y}
                    />
                  </DraggableSVGGroup>
                )}

                {/* DOTTED WIRE GUIDE LINES (Help students know which terminals connect) */}
                {/* Guide 1: Battery Neg -> Bulb Left */}
                {placed.battery &&
                  placed.bulb &&
                  !connectedWires.includes("wire1") && (
                    <path
                      d={getWirePath(
                        getTerminalCoords("battery-neg"),
                        getTerminalCoords("bulb-left"),
                      )}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth={2.5}
                      strokeDasharray="4,4"
                      opacity={0.3}
                    />
                  )}
                {/* Guide 2: Battery Pos -> Pin 2 */}
                {placed.battery &&
                  placed.pin2 &&
                  !connectedWires.includes("wire2") && (
                    <path
                      d={getWirePath(
                        getTerminalCoords("battery-pos"),
                        getTerminalCoords("pin2"),
                      )}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth={2.5}
                      strokeDasharray="4,4"
                      opacity={0.3}
                    />
                  )}
                {/* Guide 3: Pin 1 -> Bulb Right */}
                {placed.pin1 &&
                  placed.bulb &&
                  !connectedWires.includes("wire3") && (
                    <path
                      d={getWirePath(
                        getTerminalCoords("pin1"),
                        getTerminalCoords("bulb-right"),
                      )}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth={2.5}
                      strokeDasharray="4,4"
                      opacity={0.3}
                    />
                  )}

                {/* SOLID PLACED WIRES */}
                {/* Wire 1 */}
                {connectedWires.includes("wire1") && (
                  <>
                    <path
                      d={getWirePath(
                        getTerminalCoords("battery-neg"),
                        getTerminalCoords("bulb-left"),
                      )}
                      fill="none"
                      stroke="#b91c1c"
                      strokeWidth={5}
                      strokeLinecap="round"
                    />
                    <path
                      d={getWirePath(
                        getTerminalCoords("battery-neg"),
                        getTerminalCoords("bulb-left"),
                      )}
                      fill="none"
                      stroke="var(--danger)"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                    />
                  </>
                )}
                {/* Wire 2 */}
                {connectedWires.includes("wire2") && (
                  <>
                    <path
                      d={getWirePath(
                        getTerminalCoords("battery-pos"),
                        getTerminalCoords("pin2"),
                      )}
                      fill="none"
                      stroke="#ca8a04"
                      strokeWidth={5}
                      strokeLinecap="round"
                    />
                    <path
                      d={getWirePath(
                        getTerminalCoords("battery-pos"),
                        getTerminalCoords("pin2"),
                      )}
                      fill="none"
                      stroke="#fde047"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                    />
                  </>
                )}
                {/* Wire 3 */}
                {connectedWires.includes("wire3") && (
                  <>
                    <path
                      d={getWirePath(
                        getTerminalCoords("pin1"),
                        getTerminalCoords("bulb-right"),
                      )}
                      fill="none"
                      stroke="#9a3412"
                      strokeWidth={5}
                      strokeLinecap="round"
                    />
                    <path
                      d={getWirePath(
                        getTerminalCoords("pin1"),
                        getTerminalCoords("bulb-right"),
                      )}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                    />
                  </>
                )}

                {/* Bulb */}
                {placed.bulb && (
                  <DraggableSVGGroup id="bulb" isDraggable={!success}>
                    <g
                      transform={`translate(${positions.bulb.x - 300}, ${positions.bulb.y - 102})`}
                    >
                      <BulbSVG isPlaced={true} isOn={false} />
                    </g>
                  </DraggableSVGGroup>
                )}

                {/* Battery */}
                {placed.battery && (
                  <DraggableSVGGroup id="battery" isDraggable={!success}>
                    <g
                      transform={`translate(${positions.battery.x - 150}, ${positions.battery.y - 390})`}
                    >
                      <BatterySVG isPlaced={true} />
                    </g>
                  </DraggableSVGGroup>
                )}

                {/* Safety Pin (Rendered independently ONLY if pin1 is not placed yet) */}
                {placed.safetyPin && !placed.pin1 && (
                  <DraggableSVGGroup id="safetyPin" isDraggable={!success} additionalTransform={activeDraggingId === "cardboard" && isPinOnCardboard(positions.safetyPin, positions.cardboard) ? activeDragDelta : null}>
                    <SafetyPinSVG
                      x={positions.safetyPin.x}
                      y={positions.safetyPin.y}
                      rotation={-35}
                      isPlaced={true}
                    />
                  </DraggableSVGGroup>
                )}

                {/* Pin 1 & Safety Pin (If pin1 is placed, safetyPin anchors/drags with it) */}
                {placed.pin1 && (
                  <DraggableSVGGroup id="pin1" isDraggable={!success} additionalTransform={activeDraggingId === "cardboard" && isPinOnCardboard(positions.pin1, positions.cardboard) ? activeDragDelta : null}>
                    <DrawingPinSVG
                      x={positions.pin1.x}
                      y={positions.pin1.y}
                      label="Drawing Pin 1"
                      isPlaced={true}
                    />
                    {placed.safetyPin && (
                      <SafetyPinSVG
                        x={positions.pin1.x}
                        y={positions.pin1.y}
                        rotation={-35}
                        isPlaced={true}
                      />
                    )}
                  </DraggableSVGGroup>
                )}

                {/* Pin 2 */}
                {placed.pin2 && (
                  <DraggableSVGGroup id="pin2" isDraggable={!success} additionalTransform={activeDraggingId === "cardboard" && isPinOnCardboard(positions.pin2, positions.cardboard) ? activeDragDelta : null}>
                    <DrawingPinSVG
                      x={positions.pin2.x}
                      y={positions.pin2.y}
                      label="Drawing Pin 2"
                      isPlaced={true}
                    />
                  </DraggableSVGGroup>
                )}

                {/* Visual highlight target outline during component dragging */}
                {isDragging && activeStep && (
                  <g className="pulse-target" style={{ opacity: 0.8 }}>
                    {activeStep.id === "cardboard" && (
                      <rect
                        x={370}
                        y={200}
                        width={160}
                        height={210}
                        rx={12}
                        fill="rgba(99, 102, 241, 0.05)"
                        stroke="var(--accent)"
                        strokeWidth={2.5}
                        strokeDasharray="5,5"
                      />
                    )}
                    {activeStep.id === "pin1" && (
                      <circle
                        cx={450}
                        cy={250}
                        r={14}
                        fill="rgba(99, 102, 241, 0.05)"
                        stroke="var(--accent)"
                        strokeWidth={2.5}
                        strokeDasharray="3,3"
                      />
                    )}
                    {activeStep.id === "safetyPin" && (
                      <g transform="translate(450, 250) rotate(-35)">
                        <circle
                          cx={0}
                          cy={0}
                          r={10}
                          fill="none"
                          stroke="var(--accent)"
                          strokeWidth={2}
                          strokeDasharray="3,3"
                        />
                        <line
                          x1={0}
                          y1={0}
                          x2={0}
                          y2={110}
                          stroke="var(--accent)"
                          strokeWidth={2}
                          strokeDasharray="3,3"
                        />
                      </g>
                    )}
                    {activeStep.id === "pin2" && (
                      <circle
                        cx={450}
                        cy={370}
                        r={14}
                        fill="rgba(99, 102, 241, 0.05)"
                        stroke="var(--accent)"
                        strokeWidth={2.5}
                        strokeDasharray="3,3"
                      />
                    )}
                    {activeStep.id === "battery" && (
                      <rect
                        x={104}
                        y={366}
                        width={92}
                        height={48}
                        rx={6}
                        fill="rgba(99, 102, 241, 0.05)"
                        stroke="var(--accent)"
                        strokeWidth={2.5}
                        strokeDasharray="5,5"
                      />
                    )}
                    {activeStep.id === "bulb" && (
                      <g>
                        <rect
                          x={260}
                          y={80}
                          width={80}
                          height={20}
                          rx={4}
                          fill="rgba(99, 102, 241, 0.05)"
                          stroke="var(--accent)"
                          strokeWidth={2.5}
                          strokeDasharray="3,3"
                        />
                        <circle
                          cx={300}
                          cy={45}
                          r={22}
                          fill="none"
                          stroke="var(--accent)"
                          strokeWidth={2.5}
                          strokeDasharray="3,3"
                        />
                      </g>
                    )}
                  </g>
                )}

                {/* INTERACTIVE TERMINAL DOTS FOR WIRE CONNECTION MODE */}
                {selectedItemId === "wires" &&
                  terminals.map((t) => {
                    const coords = getTerminalCoords(t.id);
                    const isSelected = selectedTerminal === t.id;
                    const isConnected = isTerminalConnected(t.id);
                    const strokeColor = !pinsValid
                      ? "var(--text-muted)"
                      : isSelected
                        ? "#60a5fa"
                        : t.color;
                    const fillColor = !pinsValid
                      ? "var(--text-faint)"
                      : isSelected
                        ? "#3b82f6"
                        : isConnected
                          ? "var(--success)"
                          : "var(--card-bg)";

                    return (
                      <g
                        key={t.id}
                        transform={`translate(${coords.x}, ${coords.y})`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleTerminalClick(t.id)}
                      >
                        <circle
                          r={isSelected ? 11 : 7}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={isSelected ? 3 : 2}
                          className={
                            isSelected && pinsValid ? "bulb-glowing" : ""
                          }
                          style={{
                            opacity: pinsValid ? 1 : 0.6,
                            transition: "all 0.2s",
                          }}
                        />
                        <circle
                          r={4}
                          fill={fillColor}
                          style={{
                            opacity: pinsValid ? 1 : 0.6,
                            transition: "all 0.2s",
                          }}
                        />
                      </g>
                    );
                  })}
              </svg>

              {/* Interactive Guides & Feedback */}
              <div
                style={{
                  position: "absolute",
                  bottom: "0.75rem",
                  left: "0.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.15rem",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text-secondary)",
                    fontWeight: "bold",
                    letterSpacing: "0.05em",
                  }}
                >
                  WORKSPACE ASSEMBLY
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                  {selectedItemId === "wires"
                    ? selectedTerminal
                      ? `Connecting from: ${terminals.find((t) => t.id === selectedTerminal)?.label}`
                      : "Wires selected: Click terminal dots to connect"
                    : activeStep
                      ? `Ready to place: ${activeStep.name}`
                      : "Workspace awaits components..."}
                </span>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      left: "0.75rem",
                      right: "0.75rem",
                      background: "rgba(239, 68, 68, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      padding: "0.6rem 0.8rem",
                      fontSize: "0.8rem",
                      color: "var(--card-bg)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      boxShadow: "0 4px 12px var(--border)",
                      zIndex: 40,
                    }}
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
        <div
          className="glass-panel"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            padding: "1rem",
            background: "var(--card-bg)",
            borderColor: "var(--border)",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContext: "space-between",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "0.95rem",
                color: "var(--accent-text)",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <span>🧊</span> 3D Viewer
            </h3>
            {activeStep && (
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                💡 Click & Drag model below to inspect
              </span>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                activeStep || selectedItemId === "wires" ? "1.2fr 1fr" : "1fr",
              gap: "1rem",
              minHeight: "180px",
            }}
          >
            {selectedItemId === "wires" ? (
              <>
                <div
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    height: "180px",
                    position: "relative",
                  }}
                >
                  <ThreeDViewer componentId="wires" />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: "1rem", color: "var(--text-heading)" }}>
                    Connecting Wires
                  </h4>
                  {!pinsValid ? (
                    <div
                      style={{
                        background: "var(--danger-bg)",
                        border: "1px solid var(--danger-border)",
                        borderRadius: "8px",
                        padding: "0.6rem",
                        color: "var(--danger)",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--danger)",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.2rem",
                        }}
                      >
                        ⚠️ Scientific Check Warning
                      </strong>
                      <p
                        style={{
                          margin: "0.3rem 0 0 0",
                          fontSize: "0.7rem",
                          color: "var(--text-secondary)",
                          lineHeight: "1.3",
                        }}
                      >
                        Both drawing pins must be placed on the Cardboard Base.
                        <strong>Why?</strong> Cardboard is an{" "}
                        <strong>insulator</strong> (non-conductor). Placing
                        drawing pins directly on the workspace would leak
                        electric current if the underlying table is conductive.
                        The cardboard sheet provides a safe insulating base.
                      </p>
                      <p
                        style={{
                          margin: "0.4rem 0 0 0",
                          fontSize: "0.68rem",
                          color: "var(--danger)",
                          fontWeight: "bold",
                        }}
                      >
                        👉 Drag the drawing pins or the cardboard base on the
                        canvas to correct their positions.
                      </p>
                    </div>
                  ) : (
                    <>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.75rem",
                          color: "var(--text-faint)",
                          lineHeight: "1.4",
                        }}
                      >
                        Click on the glowing terminal points on the canvas to
                        draw wires and connect your components.
                      </p>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--accent-text)",
                          fontWeight: "bold",
                          marginTop: "0.5rem",
                        }}
                      >
                        Wires connected: {connectedWires.length}/3
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : activeStep ? (
              <>
                {/* 3D Viewer Panel */}
                <div
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    height: "180px",
                    position: "relative",
                  }}
                >
                  <ThreeDViewer componentId={activeStep.id} />
                </div>

                {/* Info and Draggable Area */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                  }}
                >
                  <div>
                    <h4
                      style={{ margin: 0, fontSize: "1rem", color: "var(--text-heading)" }}
                    >
                      {activeStep.name}
                    </h4>
                    <p
                      style={{
                        margin: "0.25rem 0 0 0",
                        fontSize: "0.75rem",
                        color: "var(--text-faint)",
                        lineHeight: "1.4",
                      }}
                    >
                      {activeStep.desc}
                    </p>
                  </div>

                  {/* Draggable Token handle */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--text-muted)",
                        fontWeight: "bold",
                      }}
                    >
                      HOW TO ASSEMBLE:
                    </span>
                    
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 0.75rem",
                          background: "var(--accent-bg)",
                          border: "1px dashed rgba(99, 102, 241, 0.4)",
                          borderRadius: "10px",
                          color: "var(--accent-text)",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          boxShadow: "0 4px 10px rgba(99,102,241,0.1)",
                        }}
                      >
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            background: "var(--border)",
                            borderRadius: "6px",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {renderThumbnailSVG(activeStep.id)}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "left",
                          }}
                        >
                          <span>{activeStep.name}</span>
                          <span
                            style={{
                              fontSize: "0.65rem",
                              color: "var(--accent-text)",
                              fontWeight: "normal",
                            }}
                          >
                            Drag from Component Tray to Workspace
                          </span>
                        </div>
                      </div>
                    
                  </div>
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "180px",
                  color: "var(--text-secondary)",
                  textAlign: "center",
                  padding: "1rem",
                }}
              >
                <p
                  style={{ margin: 0, fontSize: "0.85rem", maxWidth: "280px" }}
                >
                  Select an unlocked component from the{" "}
                  <strong>Component Tray</strong> below to inspect and drag it
                  onto the workspace.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer controls */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button
            onClick={handleReset}
            className="outline"
            style={{ flex: 1, gap: "0.35rem" }}
          >
            <RotateCcw size={16} /> Reset Lab
          </button>

          <button
            onClick={onComplete}
            className="success"
            disabled={!success}
            style={{ flex: 2, gap: "0.35rem" }}
          >
            Go to Stage 2 <ArrowRight size={16} />
          </button>
        </div>

        {/* Drag Overlay layer */}
        <DragOverlay>
          {isDragging && activeStep ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                background: "rgba(99, 102, 241, 0.25)",
                border: "2px solid #818cf8",
                borderRadius: "10px",
                color: "var(--accent-text)",
                fontSize: "0.8rem",
                fontWeight: "600",
                boxShadow: "0 8px 24px rgba(99,102,241,0.15)",
                backdropFilter: "blur(4px)",
                cursor: "grabbing",
                opacity: 0.9,
                transform: "scale(1.05)",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  background: "var(--border)",
                  borderRadius: "6px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {renderThumbnailSVG(activeStep.id)}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "left",
                }}
              >
                <span>{activeStep.name}</span>
                <span style={{ fontSize: "0.65rem", color: "#a5b4fc" }}>
                  Placing in workspace...
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
