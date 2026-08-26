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
  Zap,
} from "lucide-react";
import ThreeDViewer from "./ThreeDViewer";
import ReferenceOverlay from "../../components/ReferenceOverlay";
import {
  CardboardSVG,
  DrawingPinSVG,
  SafetyPinSVG,
  BulbSVG,
  BatterySVG,
} from "./CircuitElements";

const STEPS = [
  {
    id: "cardboard",
    name: "Switch Board",
    desc: [
      "A sturdy base made of cardboard to hold our switch parts securely.",
      "It provides a safe, non-conductive surface to work on.",
      "The small size makes it easy to move and place in our circuit.",
      "It acts as the foundation for the drawing pins and safety pin.",
      "Cardboard is an insulator, so electricity won't flow through it!"
    ],
    hint: "Drag the switch board onto the canvas board.",
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
    id: "battery",
    name: "Electric Cell",
    desc: [
      "The power source! It pushes electrical energy through the wires.",
      "It converts stored chemical energy into electrical energy.",
      "It has a positive (+) terminal and a negative (-) terminal.",
      "Current flows from one terminal, through the circuit, to the other.",
      "Without it, there would be no electricity to light up the bulb!"
    ],
    hint: "Place the 1.5V electric cell on the canvas board.",
    prereq: [],
  },
  {
    id: "bulb",
    name: "Electric Bulb",
    desc: [
      "The load that converts electrical energy into bright light energy.",
      "Contains a thin filament that glows when heated by electric current.",
      "Sits in a blue holder with two screw terminal connections.",
      "Lights up to clearly indicate that the circuit loop is closed.",
      "Visual proof that electric charges are actively flowing!"
    ],
    hint: "Install the bulb holder and bulb on the canvas.",
    prereq: [],
  },
  {
    id: "wires",
    name: "Connecting Wires",
    desc: [
      "Copper pathways that carry electric current between components.",
      "Covered in plastic insulation to keep the electricity safely inside.",
      "They act like water pipes, carrying charges through the loop.",
      "Must form a continuous, unbroken loop for current to flow.",
      "They are the final pieces needed to connect our entire circuit together!"
    ],
    hint: "Connect the wires to link the battery, bulb, and switch.",
    prereq: ["cardboard", "pin1", "safetyPin", "pin2", "battery", "bulb"],
  },
];

const IDEALS = {
  cardboard: { x: 480, y: 240 },
  pin1: { x: 560, y: 290 },
  safetyPin: { x: 560, y: 290 },
  pin2: { x: 560, y: 410 },
  battery: { x: 220, y: 430 },
  bulb: { x: 400, y: 120 },
};

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
        display: "flex",
        flexDirection: "column",
        height: "100%",
        touchAction: "none",
        opacity: isDragging ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : isDragging ? "grabbing" : "grab",
        width: "100%",
      }}
    >
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

const isPinOnCardboard = (pinPos, cardboardPos) => {
  if (!pinPos || !cardboardPos) return false;
  return (
    pinPos.x >= cardboardPos.x - 20 &&
    pinPos.x <= cardboardPos.x + 180 &&
    pinPos.y >= cardboardPos.y - 20 &&
    pinPos.y <= cardboardPos.y + 230
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
    cardboard: { x: 480, y: 240 },
    pin1: { x: 560, y: 290 },
    safetyPin: { x: 560, y: 290 },
    pin2: { x: 560, y: 410 },
    battery: { x: 220, y: 430 },
    bulb: { x: 400, y: 120 },
  });

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDraggingId, setActiveDraggingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [connectedWires, setConnectedWires] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 400, y: 300 });

  const pin1OnCardboard = isPinOnCardboard(positions.pin1, positions.cardboard);
  const pin2OnCardboard = isPinOnCardboard(positions.pin2, positions.cardboard);
  const pinsValid = pin1OnCardboard && pin2OnCardboard;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  );

  useEffect(() => {
    if (connectedWires.length === 3) {
      setPlaced((prev) => ({ ...prev, wires: true }));
      setSuccess(true);
      setShowPopup(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  }, [connectedWires]);

  const snapToIdeal = (id, x, y) => {
    return { x, y };
  };

  const isStepUnlocked = (stepId) => {
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return false;
    return step.prereq.every((pId) => placed[pId] === true);
  };

  const handleSelectTrayItem = (stepId) => {
    if (placed[stepId] && stepId !== "wires") return;
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return;

    if (!isStepUnlocked(stepId)) {
      const missingPrereqs = step.prereq.filter((pId) => !placed[pId]);
      const missingNames = missingPrereqs
        .map((pId) => STEPS.find((s) => s.id === pId)?.name)
        .join(", ");
      setError(
        `Cannot select "${step.name}". You must place the following first: ${missingNames}`
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

          if (draggedId === "cardboard") {
            x -= 80;
            y -= 105;
          }
        }

        const snapped = snapToIdeal(draggedId, x, y);
        x = snapped.x;
        y = snapped.y;

        x = Math.max(20, Math.min(780, x));
        y = Math.max(20, Math.min(580, y));

        setPositions((prev) => {
          const newPos = { ...prev, [draggedId]: { x, y } };
          if (draggedId === "cardboard") {
            const dxCard = x - prev.cardboard.x;
            const dyCard = y - prev.cardboard.y;
            newPos.pin1 = { x: prev.pin1.x + dxCard, y: prev.pin1.y + dyCard };
            newPos.pin2 = { x: prev.pin2.x + dxCard, y: prev.pin2.y + dyCard };
            newPos.safetyPin = { x: prev.safetyPin.x + dxCard, y: prev.safetyPin.y + dyCard };
          } else if (draggedId === "pin1") {
            newPos.safetyPin = { x, y };
          }
          return newPos;
        });

        if (!placed[draggedId]) {
          setPlaced((prev) => ({ ...prev, [draggedId]: true }));
          setSelectedItemId(null);

          confetti({
            particleCount: 25,
            spread: 45,
            origin: { y: 0.8 },
          });
        }
      }
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!selectedTerminal) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const svgScale = Math.min(rect.width / 800, rect.height / 600);
    const offsetX = (rect.width - 800 * svgScale) / 2;
    const offsetY = (rect.height - 600 * svgScale) / 2;

    const x = (e.clientX - rect.left - offsetX) / svgScale;
    const y = (e.clientY - rect.top - offsetY) / svgScale;
    setMousePos({ x, y });
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
      cardboard: { x: 480, y: 240 },
      pin1: { x: 560, y: 290 },
      safetyPin: { x: 560, y: 290 },
      pin2: { x: 560, y: 410 },
      battery: { x: 220, y: 430 },
      bulb: { x: 400, y: 120 },
    });
    setSelectedItemId(null);
    setSelectedTerminal(null);
    setConnectedWires([]);
    setError("");
    setSuccess(false);
    setShowPopup(false);
  };

  const getTerminalCoords = (terminalId) => {
    const bulb = positions.bulb;
    const battery = positions.battery;
    const pin1 = positions.pin1;
    const pin2 = positions.pin2;

    switch (terminalId) {
      case "battery-neg":
        return { x: battery.x - 46, y: battery.y };
      case "battery-pos":
        return { x: battery.x + 46, y: battery.y };
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

  const getWirePath = (p1, p2) => {
    const controlY = Math.max(p1.y, p2.y) + 35 + Math.abs(p1.x - p2.x) * 0.1;
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
    if (!pinsValid) {
      setError(
        "Scientific Check Warning: Both drawing pins must be placed on the Cardboard Base! Cardboard is an insulator."
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
          setError("This connection is already established!");
        } else {
          setConnectedWires((prev) => [...prev, wireId]);
          confetti({
            particleCount: 25,
            spread: 35,
            origin: { y: 0.8 },
          });
        }
      } else {
        if (t1.startsWith("battery") && t2.startsWith("battery")) {
          setError("Short Circuit! Connecting battery terminals directly causes a short circuit.");
        } else if (t1.startsWith("bulb") && t2.startsWith("bulb")) {
          setError("Connecting bulb terminals together won't power the bulb.");
        } else if (t1.startsWith("pin") && t2.startsWith("pin")) {
          setError("Connecting switch pins directly bypasses the circuit loop.");
        } else {
          setError("Invalid connection. Follow the guide lines to connect the circuit!");
        }
      }
      setSelectedTerminal(null);
    }
  };

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

  const renderThumbnailSVG = (id) => {
    switch (id) {
      case "cardboard":
        return (
          <svg viewBox="360 190 180 230" width="24" height="24" style={{ pointerEvents: "none" }}>
            <CardboardSVG x={370} y={200} />
          </svg>
        );
      case "pin1":
      case "pin2":
        return (
          <svg viewBox="430 230 40 40" width="24" height="24" style={{ pointerEvents: "none" }}>
            <DrawingPinSVG x={450} y={250} isPlaced={true} />
          </svg>
        );
      case "safetyPin":
        return (
          <svg viewBox="-20 -15 40 145" width="24" height="24" style={{ pointerEvents: "none" }}>
            <SafetyPinSVG x={0} y={0} rotation={0} isPlaced={true} />
          </svg>
        );
      case "battery":
        return (
          <svg viewBox="100 365 100 50" width="24" height="24" style={{ pointerEvents: "none" }}>
            <BatterySVG isPlaced={true} />
          </svg>
        );
      case "bulb":
        return (
          <svg viewBox="250 20 100 100" width="24" height="24" style={{ pointerEvents: "none" }}>
            <BulbSVG isPlaced={true} />
          </svg>
        );
      case "wires":
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: "none" }}>
            <path d="M4 12c0-4 3-7 8-7s8 3 8 7-3 7-8 7" stroke="var(--danger)" />
            <path d="M6 13c0-3 2.5-5 6-5s6 2 6 5-2 5-6 5" stroke="var(--warning)" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getNextStepPrompt = () => {
    if (success) return "Switch Constructed Successfully!";
    if (selectedItemId === "wires") {
      return "Instruction: Click glowing terminal dots to connect wires.";
    }
    const remaining = STEPS.filter((s) => s.id !== "wires" && !placed[s.id]);
    if (remaining.length > 0)
      return `${remaining.length} component(s) left — pick any from the Component Tray.`;
    return "All components placed! Now select Connecting Wires to link everything together.";
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
      onDragEnd={handleDragEnd}
    >
      {/* Onboarding Welcome Preview Modal */}
      {showIntro && (
        <div
          className="lab-onboarding-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1.5rem",
          }}
        >
          <div className="lab-onboarding-card">
            <div
              style={{
                background: "linear-gradient(135deg, #1e1b4b 0%, #311042 100%)",
                padding: "1.25rem 1.5rem",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div>
                <h2 style={{ margin: 0, color: "white", fontSize: "1.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Zap size={22} style={{ color: "#fbbf24" }} /> Welcome to the Electric Switch Lab!
                </h2>
                <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                  NCERT Class 7 Science Wing
                </span>
              </div>
            </div>

            <div className="lab-onboarding-body">
              {/* Completed Switch 3D Preview */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div
                  style={{
                    height: "260px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                  }}
                >
                  <ThreeDViewer componentId="completed_switch" />
                </div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center", fontStyle: "italic" }}>
                  Drag to rotate, scroll to zoom, and inspect the finished switch above!
                </span>
              </div>

              {/* Objective and Instructions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--accent-text)" }}>Your Mission:</h4>
                  <p style={{ fontSize: "0.85rem", margin: 0, color: "var(--text-secondary)", lineHeight: "1.5" }}>
                    Build a working electrical switch that can close a gap in a circuit and light up a bulb. You will assemble the parts and draw the wiring loop!
                  </p>
                </div>

                <div>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>Experiment Checklist:</h4>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "1.25rem",
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      lineHeight: "1.6",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.3rem",
                    }}
                  >
                    <li><strong>Cardboard Base:</strong> Non-conductive base to anchor the circuit parts.</li>
                    <li><strong>Two Drawing Pins:</strong> Serves as the circuit connection terminals.</li>
                    <li><strong>Safety Pin:</strong> The metallic arm that opens or closes the circuit gap.</li>
                    <li><strong>Electric Cell:</strong> The energy source that pushes the electric current.</li>
                    <li><strong>Bulb:</strong> Lights up to show that electrical current is flowing!</li>
                    <li><strong>Wires:</strong> Provides a continuous path for current to loop around.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "1rem 1.5rem",
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "flex-end",
                background: "var(--surface)",
              }}
            >
              <button
                className="primary"
                onClick={() => setShowIntro(false)}
                style={{ padding: "0.6rem 1.5rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                Let's Build It! <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          userSelect: "none",
          WebkitUserSelect: "none",
          width: "100%",
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
              Stage 1: Assemble the Circuit
            </span>
            <h2 style={{ margin: "0.2rem 0 0 0", fontSize: "1.4rem", color: "var(--text-heading)" }}>Construct the Switch</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Progress: <strong>{completedCount} / {STEPS.length}</strong>
            </span>
            <div
              style={{
                width: "100px",
                height: "6px",
                background: "var(--border)",
                borderRadius: "3px",
                overflow: "hidden",
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

        {/* 2-COLUMN TOP LAYOUT GRID: Left (Tray 300px), Right (Canvas 1fr) matching Activity 4.1! */}
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1rem", alignItems: "stretch", width: "100%" }}>
          
          {/* ============================================== */}
          {/* LEFT PANEL: COMPONENT TRAY                     */}
          {/* ============================================== */}
          <div className="glass-panel" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", height: "100%" }}>
            <div
              style={{
                display: "flex",
                gap: "0.35rem",
                alignItems: "center",
                background: "var(--neutral-bg)",
                padding: "0.6rem 0.8rem",
                borderRadius: "10px",
                border: "1px solid var(--border)",
              }}
            >
              <Info style={{ color: "var(--accent)", flexShrink: 0 }} size={16} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                {getNextStepPrompt()}
              </span>
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
                        border: `1px solid ${
                          isPlaced && !isWires
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
                        boxShadow: isSelected ? "0 0 0 2px rgba(99,102,241,0.4)" : isUnlocked && !isPlaced ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                      }}
                    >
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

          {/* ============================================== */}
          {/* RIGHT PANEL: ASSEMBLY CANVAS WORKSPACE        */}
          {/* ============================================== */}
          <div
            style={{
              flex: 1,
              position: "relative",
              minHeight: "500px",
              display: "flex",
              flexDirection: "column",
              background: "var(--canvas-bg)",
              borderRadius: "16px",
              border: "1px solid var(--canvas-border)",
              overflow: "hidden",
            }}
          >
            {/* Reference Blueprint Overlay */}
            <ReferenceOverlay title="Reference Blueprint" position="right">
              <svg width="240" height="160" viewBox="180 80 580 440" style={{ opacity: 0.85 }}>
                <CardboardSVG x={IDEALS.cardboard.x} y={IDEALS.cardboard.y} />
                <DrawingPinSVG x={IDEALS.pin1.x} y={IDEALS.pin1.y} isPlaced={true} />
                <SafetyPinSVG x={IDEALS.pin1.x} y={IDEALS.pin1.y} rotation={-35} isPlaced={true} />
                <DrawingPinSVG x={IDEALS.pin2.x} y={IDEALS.pin2.y} isPlaced={true} />
                <BulbSVG isPlaced={true} />
                <BatterySVG isPlaced={true} />
              </svg>
            </ReferenceOverlay>

            <CanvasDroppable>
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 600"
                onMouseMove={handleCanvasMouseMove}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* Dotted placement guide targets */}
                {!placed.cardboard && (
                  <rect
                    x={480}
                    y={240}
                    width={160}
                    height={210}
                    rx={12}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={1.5}
                    strokeDasharray="4,4"
                    opacity={0.3}
                  />
                )}

                {placed.cardboard && !placed.bulb && (
                  <g opacity={0.3}>
                    <rect x={360} y={98} width={80} height={20} rx={4} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" />
                    <circle cx={400} cy={63} r={22} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" />
                  </g>
                )}

                {placed.cardboard && !placed.battery && (
                  <rect x={174} y={406} width={92} height={48} rx={6} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="4,4" opacity={0.3} />
                )}

                {placed.cardboard && !placed.pin1 && (
                  <circle cx={positions.cardboard.x + 80} cy={positions.cardboard.y + 50} r={14} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" opacity={0.3} />
                )}

                {placed.cardboard && !placed.safetyPin && (
                  <g transform={`translate(${positions.cardboard.x + 80}, ${positions.cardboard.y + 50}) rotate(-35)`} opacity={0.3}>
                    <circle cx={0} cy={0} r={8} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" />
                    <line x1={0} y1={0} x2={0} y2={110} stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" />
                  </g>
                )}

                {placed.cardboard && !placed.pin2 && (
                  <circle cx={positions.cardboard.x + 80} cy={positions.cardboard.y + 170} r={14} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" opacity={0.3} />
                )}

                {/* REAL COMPONENT PLACEMENT RENDERING WITH RE-DRAGGABLE CARDBOARD */}
                {placed.cardboard && (
                  <DraggableSVGGroup id="cardboard" isDraggable={!success}>
                    <CardboardSVG x={positions.cardboard.x} y={positions.cardboard.y} />
                  </DraggableSVGGroup>
                )}

                {/* Dotted Wire Guides */}
                {placed.battery && placed.bulb && !connectedWires.includes("wire1") && (
                  <path d={getWirePath(getTerminalCoords("battery-neg"), getTerminalCoords("bulb-left"))} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeDasharray="4,4" opacity={0.3} />
                )}
                {placed.battery && placed.pin2 && !connectedWires.includes("wire2") && (
                  <path d={getWirePath(getTerminalCoords("battery-pos"), getTerminalCoords("pin2"))} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeDasharray="4,4" opacity={0.3} />
                )}
                {placed.pin1 && placed.bulb && !connectedWires.includes("wire3") && (
                  <path d={getWirePath(getTerminalCoords("pin1"), getTerminalCoords("bulb-right"))} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeDasharray="4,4" opacity={0.3} />
                )}

                {/* Solid Wires */}
                {connectedWires.includes("wire1") && (
                  <>
                    <path d={getWirePath(getTerminalCoords("battery-neg"), getTerminalCoords("bulb-left"))} fill="none" stroke="#b91c1c" strokeWidth={5} strokeLinecap="round" />
                    <path d={getWirePath(getTerminalCoords("battery-neg"), getTerminalCoords("bulb-left"))} fill="none" stroke="var(--danger)" strokeWidth={2.5} strokeLinecap="round" />
                  </>
                )}
                {connectedWires.includes("wire2") && (
                  <>
                    <path d={getWirePath(getTerminalCoords("battery-pos"), getTerminalCoords("pin2"))} fill="none" stroke="#ca8a04" strokeWidth={5} strokeLinecap="round" />
                    <path d={getWirePath(getTerminalCoords("battery-pos"), getTerminalCoords("pin2"))} fill="none" stroke="#fde047" strokeWidth={2.5} strokeLinecap="round" />
                  </>
                )}
                {connectedWires.includes("wire3") && (
                  <>
                    <path d={getWirePath(getTerminalCoords("pin1"), getTerminalCoords("bulb-right"))} fill="none" stroke="#9a3412" strokeWidth={5} strokeLinecap="round" />
                    <path d={getWirePath(getTerminalCoords("pin1"), getTerminalCoords("bulb-right"))} fill="none" stroke="#f97316" strokeWidth={2.5} strokeLinecap="round" />
                  </>
                )}

                {/* LIVE INTERACTIVE WIRE PREVIEW FOLLOWING CURSOR */}
                {selectedTerminal && (
                  <g pointerEvents="none">
                    <path
                      d={getWirePath(getTerminalCoords(selectedTerminal), mousePos)}
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth={3}
                      strokeDasharray="4,4"
                      opacity={0.85}
                      className="bulb-glowing"
                    />
                    <circle cx={mousePos.x} cy={mousePos.y} r={6} fill="#3b82f6" opacity={0.8} />
                  </g>
                )}

                {/* Bulb */}
                {placed.bulb && (
                  <DraggableSVGGroup id="bulb" isDraggable={!success}>
                    <g transform={`translate(${positions.bulb.x - 300}, ${positions.bulb.y - 102})`}>
                      <BulbSVG isPlaced={true} isOn={false} />
                    </g>
                  </DraggableSVGGroup>
                )}

                {/* Battery */}
                {placed.battery && (
                  <DraggableSVGGroup id="battery" isDraggable={!success}>
                    <g transform={`translate(${positions.battery.x - 150}, ${positions.battery.y - 390})`}>
                      <BatterySVG isPlaced={true} />
                    </g>
                  </DraggableSVGGroup>
                )}

                {/* Safety Pin */}
                {placed.safetyPin && !placed.pin1 && (
                  <DraggableSVGGroup id="safetyPin" isDraggable={!success}>
                    <SafetyPinSVG x={positions.safetyPin.x} y={positions.safetyPin.y} rotation={-35} isPlaced={true} />
                  </DraggableSVGGroup>
                )}

                {/* Pin 1 */}
                {placed.pin1 && (
                  <DraggableSVGGroup id="pin1" isDraggable={!success}>
                    <DrawingPinSVG x={positions.pin1.x} y={positions.pin1.y} label="Drawing Pin 1" isPlaced={true} />
                    {placed.safetyPin && (
                      <SafetyPinSVG x={positions.pin1.x} y={positions.pin1.y} rotation={-35} isPlaced={true} />
                    )}
                  </DraggableSVGGroup>
                )}

                {/* Pin 2 */}
                {placed.pin2 && (
                  <DraggableSVGGroup id="pin2" isDraggable={!success}>
                    <DrawingPinSVG x={positions.pin2.x} y={positions.pin2.y} label="Drawing Pin 2" isPlaced={true} />
                  </DraggableSVGGroup>
                )}

                {/* Active step pulse highlights linked dynamically to cardboard position */}
                {selectedItemId === "cardboard" && (
                  <rect
                    x={positions.cardboard.x}
                    y={positions.cardboard.y}
                    width={160}
                    height={210}
                    rx={12}
                    fill="rgba(99, 102, 241, 0.02)"
                    stroke="var(--accent)"
                    className="active-target-glow"
                  />
                )}
                {selectedItemId === "pin1" && (
                  <circle
                    cx={positions.cardboard.x + 80}
                    cy={positions.cardboard.y + 50}
                    r={14}
                    fill="none"
                    stroke="#ca8a04"
                    className="active-target-glow"
                  />
                )}
                {selectedItemId === "pin2" && (
                  <circle
                    cx={positions.cardboard.x + 80}
                    cy={positions.cardboard.y + 170}
                    r={14}
                    fill="none"
                    stroke="#ca8a04"
                    className="active-target-glow"
                  />
                )}
                {selectedItemId === "safetyPin" && (
                  <g transform={`translate(${positions.cardboard.x + 80}, ${positions.cardboard.y + 50}) rotate(-35)`}>
                    <circle cx={0} cy={0} r={14} fill="none" stroke="#ca8a04" className="active-target-glow" />
                  </g>
                )}
                {selectedItemId === "battery" && (
                  <rect x={174} y={406} width={92} height={48} rx={6} fill="rgba(99, 102, 241, 0.02)" stroke="var(--accent)" className="active-target-glow" />
                )}

                {/* Terminal dots for wiring */}
                {selectedItemId === "wires" &&
                  terminals.map((t) => {
                    const coords = getTerminalCoords(t.id);
                    const isSelected = selectedTerminal === t.id;
                    const isConnected = isTerminalConnected(t.id);
                    const strokeColor = !pinsValid ? "var(--text-muted)" : isSelected ? "#60a5fa" : t.color;
                    const fillColor = !pinsValid ? "var(--text-faint)" : isSelected ? "#3b82f6" : isConnected ? "var(--success)" : "var(--card-bg)";

                    return (
                      <g
                        key={t.id}
                        transform={`translate(${coords.x}, ${coords.y})`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleTerminalClick(t.id)}
                      >
                        <circle r={24} fill="transparent" />
                        <circle
                          r={isSelected ? 11 : 7}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={isSelected ? 3 : 2}
                          className={isSelected && pinsValid ? "bulb-glowing" : ""}
                          pointerEvents="none"
                        />
                        <circle r={4} fill={fillColor} pointerEvents="none" />
                      </g>
                    );
                  })}
              </svg>

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
                      borderRadius: "8px",
                      padding: "0.6rem 0.8rem",
                      fontSize: "0.8rem",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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
        {/* PARTS BENCH / 3D VIEWER (BOTTOM PANEL)         */}
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: activeStep || selectedItemId === "wires" ? "0.8fr 1.2fr" : "1fr",
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
                    Wires connected: {connectedWires.length}/3
                  </div>
                </div>
              </>
            ) : activeStep ? (
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
                        cursor: "default",
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
                      <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                        <span>{activeStep.name}</span>
                        <span style={{ fontSize: "0.65rem", color: "var(--accent-text)", fontWeight: "normal" }}>
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

          <button
            onClick={onComplete}
            className="success"
            disabled={!success}
            style={{ flex: 2, gap: "0.35rem" }}
          >
            Go to Stage 2 <ArrowRight size={16} />
          </button>
        </div>

        {/* Icon-Only Clean Drag Overlay layer */}
        <DragOverlay>
          {isDragging && activeStep ? (
            <div
              style={{
                width: "44px",
                height: "44px",
                background: "var(--surface)",
                border: "2px solid var(--accent)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)",
                cursor: "grabbing",
                transform: "scale(1.15)",
                pointerEvents: "none",
              }}
            >
              {renderThumbnailSVG(activeStep.id)}
            </div>
          ) : null}
        </DragOverlay>

        {/* Completion Modal */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                style={{
                  background: 'var(--surface)',
                  padding: '2rem',
                  borderRadius: '16px',
                  maxWidth: '400px',
                  width: '90%',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  textAlign: 'center',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                <h2 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', fontSize: '1.5rem' }}>Stage 1 Complete!</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.5', fontSize: '0.95rem' }}>
                  You have successfully constructed the Electric Switch Circuit. You are now ready to test the switch!
                </p>
                <button
                  onClick={onComplete}
                  className="primary"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  Proceed to Stage 2 <ArrowRight size={18} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DndContext>
  );
}
