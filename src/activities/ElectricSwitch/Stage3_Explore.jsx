import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Zap,
  ZapOff,
  Battery,
  Layers,
  Scissors,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Lightbulb,
} from "lucide-react";
import {
  CardboardSVG,
  DrawingPinSVG,
  SafetyPinSVG,
  BulbSVG,
  BatterySVG,
  WiresSVG,
} from "./CircuitElements";

function getBulbProfile(battV, bulbV) {
  if (battV <= 0)
    return {
      zone: "none",
      label: "No voltage — bulb off",
      color: "#475569",
      brightness: 0,
    };

  if (battV === bulbV) {
    return {
      zone: "active",
      label: "Normal glow ✅",
      color: "#10b981",
      brightness: 100,
    };
  }

  if (battV === 1.5 && bulbV === 3)
    return {
      zone: "active",
      label: "Very dim ⚠️",
      color: "#7c6f3e",
      brightness: 50,
    };
  if (battV === 1.5 && bulbV === 6)
    return {
      zone: "active",
      label: "May not glow ⚠️",
      color: "#64748b",
      brightness: 25,
    };
  if (battV === 1.5 && bulbV === 9)
    return {
      zone: "active",
      label: "No visible glow ⚠️",
      color: "#475569",
      brightness: 10,
    };

  if (battV === 3 && bulbV === 1.5)
    return {
      zone: "danger",
      label: "Very bright, may damage bulb ❌",
      color: "#fbbf24",
      brightness: 120,
    };
  if (battV === 3 && bulbV === 6)
    return {
      zone: "active",
      label: "Dim glow ⚠️",
      color: "#a37d2c",
      brightness: 50,
    };
  if (battV === 3 && bulbV === 9)
    return {
      zone: "active",
      label: "Very dim ⚠️",
      color: "#7c6f3e",
      brightness: 30,
    };

  if (battV === 6 && bulbV === 1.5)
    return {
      zone: "burned",
      label: "Burns out quickly ❌",
      color: "#f43f5e",
      brightness: 0,
    };
  if (battV === 6 && bulbV === 3)
    return {
      zone: "danger",
      label: "Very bright, may burn out ❌",
      color: "#f97316",
      brightness: 120,
    };
  if (battV === 6 && bulbV === 9)
    return {
      zone: "active",
      label: "Dim glow ⚠️",
      color: "#a37d2c",
      brightness: 60,
    };

  if (battV === 9 && bulbV === 1.5)
    return {
      zone: "burned",
      label: "Immediate burn out ❌",
      color: "#ef4444",
      brightness: 0,
    };
  if (battV === 9 && bulbV === 3)
    return {
      zone: "burned",
      label: "Burns out quickly ❌",
      color: "#f43f5e",
      brightness: 0,
    };
  if (battV === 9 && bulbV === 6)
    return {
      zone: "danger",
      label: "Very bright, possible damage ❌",
      color: "#fbbf24",
      brightness: 120,
    };

  return {
    zone: "active",
    label: "Unknown ⚠️",
    color: "#475569",
    brightness: 0,
  };
}

export default function Stage3_Explore() {
  const [isPinConnected, setIsPinConnected] = useState(false);
  const [batteryPresent, setBatteryPresent] = useState(true);
  const [wireConnected, setWireConnected] = useState(true);
  const [pinMaterial, setPinMaterial] = useState("metal");

  // Using explicit voltages for the simulation
  const [voltage, setVoltage] = useState(1.5);
  const [bulbV, setBulbV] = useState(1.5);

  const [burnAnim, setBurnAnim] = useState(false);
  const prevZoneRef = useRef("low");

  const profile = getBulbProfile(voltage, bulbV);
  const isConductor = pinMaterial === "metal";
  const circuitClosed =
    isPinConnected && batteryPresent && wireConnected && isConductor;

  const isBurned =
    circuitClosed &&
    (profile.zone === "burned" ||
      profile.label.includes("burn out") ||
      profile.label.includes("damage"));
  const isCurrentFlowing = circuitClosed && !isBurned;
  const isBulbOn = isCurrentFlowing;

  const brightness = isBulbOn ? profile.brightness : 0;

  useEffect(() => {
    if (
      circuitClosed &&
      profile.zone === "burned" &&
      prevZoneRef.current !== "burned"
    ) {
      setBurnAnim(true);
      setTimeout(() => setBurnAnim(false), 2000);
    }
    prevZoneRef.current = profile.zone;
  }, [profile.zone, circuitClosed]);

  const handleReset = () => {
    setIsPinConnected(false);
    setBatteryPresent(true);
    setWireConnected(true);
    setPinMaterial("metal");
    setVoltage(1.5);
    setBulbV(1.5);
    setBurnAnim(false);
  };

  const getExplanation = () => {
    if (isBurned)
      return {
        title: "Bulb Damaged!",
        desc: `The ${voltage}V battery overpowered the ${bulbV}V bulb. Too much current flowed through the filament, damaging it.`,
        status: "danger",
      };
    if (!isPinConnected)
      return {
        title: "Switch is OFF (Open Circuit)",
        desc: "The safety pin is rotated away, leaving an air gap. Air is a poor conductor so current cannot flow.",
        status: "neutral",
      };
    if (!batteryPresent)
      return {
        title: "Battery Missing",
        desc: "No voltage source means no energy to push electrons. The circuit is incomplete without a battery.",
        status: "warning",
      };
    if (!wireConnected)
      return {
        title: "Wire Broken (Open Circuit)",
        desc: "A broken wire interrupts the path. Current needs a continuous loop to flow.",
        status: "warning",
      };
    if (!isConductor)
      return {
        title: `${pinMaterial === "plastic" ? "Plastic" : "Wood"} is an Insulator`,
        desc: "Insulators block current flow regardless of physical contact.",
        status: "danger",
      };

    if (voltage === bulbV)
      return {
        title: "Normal Operation",
        desc: `The ${voltage}V battery perfectly matches the ${bulbV}V bulb. The bulb glows normally.`,
        status: "success",
      };
    if (voltage < bulbV)
      return {
        title: "Underpowered",
        desc: `The ${voltage}V battery is less than the ${bulbV}V bulb rating. The bulb glows dimly or not at all.`,
        status: "warning",
      };
    return {
      title: "Overpowered (Danger)",
      desc: `The ${voltage}V battery is stronger than the ${bulbV}V bulb rating. The bulb glows brightly and might fuse.`,
      status: "danger",
    };
  };
  const exp = getExplanation();
  const expColors = {
    success: "#34d399",
    danger: "#f87171",
    warning: "#fbbf24",
    neutral: "#e2e8f0",
  };

  return (
    <div className="main-grid">
      <div
        className="glass-panel"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          overflowY: "auto",
        }}
      >
        <div>
          <span
            className="status-badge neutral"
            style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}
          >
            Stage 3: Sandbox Lab
          </span>
          <h2 style={{ marginTop: "0.5rem", marginBottom: "0.25rem" }}>
            Circuit Explorer
          </h2>
          <p style={{ fontSize: "0.85rem", margin: 0, color: "#94a3b8" }}>
            Change voltage, toggle components, and discover how electricity
            behaves.
          </p>
        </div>

        <div
          style={{
            background: "rgba(30,41,59,0.6)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: "14px",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Zap size={15} style={{ color: "#fbbf24" }} />
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: "700",
                color: "#cbd5e1",
              }}
            >
              Voltage Experiment
            </span>
          </div>

          {/* Battery options */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}
          >
            <span
              style={{
                fontSize: "0.82rem",
                color: "#cbd5e1",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <Battery size={13} /> Battery Voltage
            </span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "0.3rem",
              }}
            >
              {[1.5, 3, 6, 9].map((v) => {
                return (
                  <button
                    key={`batt-${v}`}
                    onClick={() => setVoltage(v)}
                    style={{
                      padding: "0.3rem 0",
                      borderRadius: "7px",
                      fontSize: "0.72rem",
                      fontWeight: "700",
                      border: `1px solid ${voltage === v ? "#60a5fa" : "rgba(255,255,255,0.07)"}`,
                      background:
                        voltage === v
                          ? `rgba(96, 165, 250, 0.2)`
                          : "rgba(15,23,42,0.4)",
                      color: voltage === v ? "#60a5fa" : "#64748b",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {v}V
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bulb options */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              marginTop: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.82rem",
                color: "#cbd5e1",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <Lightbulb size={13} /> Bulb Voltage Rating
            </span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "0.3rem",
              }}
            >
              {[1.5, 3, 6, 9].map((v) => {
                return (
                  <button
                    key={`bulb-${v}`}
                    onClick={() => setBulbV(v)}
                    style={{
                      padding: "0.3rem 0",
                      borderRadius: "7px",
                      fontSize: "0.72rem",
                      fontWeight: "700",
                      border: `1px solid ${bulbV === v ? "#fbbf24" : "rgba(255,255,255,0.07)"}`,
                      background:
                        bulbV === v
                          ? `rgba(251, 191, 36, 0.2)`
                          : "rgba(15,23,42,0.4)",
                      color: bulbV === v ? "#fbbf24" : "#64748b",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {v}V
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              background: `${profile.color}18`,
              border: `1px solid ${profile.color}44`,
              borderRadius: "8px",
              padding: "0.5rem 0.7rem",
              marginTop: "0.5rem",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.75rem",
                fontWeight: "600",
                color: profile.color,
              }}
            >
              {profile.zone === "burned" && !circuitClosed
                ? `⚡ ${voltage}V set — close the switch to see the effect (will burn at this voltage!)`
                : profile.label}
            </p>
          </div>


        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
        >
          <div
            style={{
              background:
                exp.status === "success"
                  ? "rgba(16,185,129,0.08)"
                  : exp.status === "danger"
                    ? "rgba(239,68,68,0.08)"
                    : exp.status === "warning"
                      ? "rgba(245,158,11,0.08)"
                      : "rgba(30,41,59,0.6)",
              border: `1px solid ${exp.status === "success" ? "rgba(16,185,129,0.2)" : exp.status === "danger" ? "rgba(239,68,68,0.2)" : exp.status === "warning" ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: "10px",
              padding: "0.8rem",
            }}
          >
            <h4
              style={{
                margin: "0 0 0.3rem 0",
                fontSize: "0.85rem",
                color: expColors[exp.status],
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              {exp.status === "success" ? (
                <CheckCircle size={14} />
              ) : (
                <ZapOff size={14} />
              )}{" "}
              {exp.title}
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: "0.75rem",
                color: "#cbd5e1",
                lineHeight: 1.5,
              }}
            >
              {exp.desc}
            </p>
          </div>

          {[
            {
              label: "Safety Pin Switch",
              action: () => setIsPinConnected((p) => !p),
              btnLabel: isPinConnected ? "Closed (ON)" : "Open (OFF)",
              icon: isPinConnected ? (
                <ToggleRight size={14} style={{ color: "#34d399" }} />
              ) : (
                <ToggleLeft size={14} />
              ),
            },
            {
              label: "Power Source (Battery)",
              action: () => setBatteryPresent((p) => !p),
              btnLabel: batteryPresent ? "Remove Battery" : "Replace Battery",
              icon: <Battery size={14} />,
            },
            {
              label: "Wires Pathway",
              action: () => setWireConnected((p) => !p),
              btnLabel: wireConnected ? "Cut Wire" : "Repair Wire",
              icon: <Scissors size={14} />,
            },
          ].map((ctrl) => (
            <div
              key={ctrl.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>
                {ctrl.label}
              </span>
              <button
                onClick={ctrl.action}
                className="outline"
                style={{
                  padding: "0.35rem 0.7rem",
                  fontSize: "0.78rem",
                  gap: "0.3rem",
                }}
              >
                {ctrl.icon} {ctrl.btnLabel}
              </button>
            </div>
          ))}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}
          >
            <span
              style={{
                fontSize: "0.82rem",
                color: "#cbd5e1",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <Layers size={13} /> Safety Pin Material
            </span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0.35rem",
              }}
            >
              {[
                ["metal", "Metal", "#6366f1"],
                ["plastic", "Plastic", "#06b6d4"],
                ["wood", "Wood", "#b45309"],
              ].map(([id, label, clr]) => (
                <button
                  key={id}
                  onClick={() => setPinMaterial(id)}
                  style={{
                    fontSize: "0.72rem",
                    padding: "0.45rem 0.2rem",
                    borderRadius: "7px",
                    border: `1px solid ${pinMaterial === id ? clr : "rgba(255,255,255,0.04)"}`,
                    background: pinMaterial === id ? `${clr}22` : "#0f172a",
                    color: pinMaterial === id ? clr : "#64748b",
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="outline"
          style={{ gap: "0.35rem", marginTop: "auto" }}
        >
          <RotateCcw size={14} /> Reset Sandbox
        </button>
      </div>

      <div className="canvas-container" style={{ padding: "2rem" }}>
        <div className="canvas-bg-grid" />

        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            display: "flex",
            gap: "0.35rem",
            zIndex: 10,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <span
            className={`status-badge ${batteryPresent ? "neutral" : "warning"}`}
            style={{ textTransform: "none" }}
          >
            {batteryPresent ? "Battery OK" : "Battery Removed"}
          </span>
          <span
            className={`status-badge ${wireConnected ? "neutral" : "warning"}`}
            style={{ textTransform: "none" }}
          >
            {wireConnected ? "Wires OK" : "Wire Cut"}
          </span>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: "700",
              padding: "0.2rem 0.6rem",
              borderRadius: "20px",
              background: `${profile.color}22`,
              border: `1px solid ${profile.color}55`,
              color: profile.color,
            }}
          >
            {voltage}V Battery
          </span>
        </div>

        <svg
          width="100%"
          height="100%"
          viewBox="0 0 600 480"
          style={{ maxWidth: "600px", maxHeight: "480px" }}
        >
          <CardboardSVG />

          <g
            style={{
              filter: isBurned
                ? "grayscale(1) brightness(0.3)"
                : `brightness(${0.35 + brightness / 130})`,
              transition: "filter 0.4s",
            }}
          >
            <BulbSVG isPlaced={true} isOn={isBulbOn} />
          </g>

          <AnimatePresence>
            {burnAnim && (
              <motion.text
                x={270}
                y={20}
                fontSize={28}
                initial={{ opacity: 1, y: 20 }}
                animate={{ opacity: 0, y: -10 }}
                transition={{ duration: 1.8 }}
              >
                🔥
              </motion.text>
            )}
          </AnimatePresence>

          {isBulbOn && (
            <circle
              cx={300}
              cy={55}
              r={28 + brightness * 0.12}
              fill="none"
              stroke={profile.color}
              strokeWidth={3}
              opacity={0.15 + brightness * 0.005}
              style={{ filter: "blur(5px)", transition: "all 0.4s" }}
            />
          )}

          <BatterySVG
            isPlaced={batteryPresent}
            isTarget={!batteryPresent}
            onClick={() => setBatteryPresent((p) => !p)}
          />

          <WiresSVG
            isWireConnected={true}
            isBatteryPresent={batteryPresent}
            isBulbPresent={true}
            arePinsPlaced={true}
            isCurrentFlowing={isCurrentFlowing}
            isBroken={!wireConnected}
            onClick={() => setWireConnected((p) => !p)}
          />

          <DrawingPinSVG
            x={450}
            y={250}
            label="Drawing Pin 1"
            isPlaced={true}
          />

          <motion.g
            animate={{ rotate: isPinConnected ? 0 : -35 }}
            transition={{ type: "spring", stiffness: 90, damping: 10 }}
            style={{ originX: "450px", originY: "250px", cursor: "pointer" }}
            onClick={() => setIsPinConnected((p) => !p)}
          >
            <SafetyPinSVG
              x={450}
              y={250}
              rotation={0}
              isPlaced={true}
              material={pinMaterial}
            />
          </motion.g>

          <DrawingPinSVG
            x={450}
            y={370}
            label="Drawing Pin 2"
            isPlaced={true}
          />
        </svg>

        {(isBulbOn || isBurned) && (
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              background: "rgba(15,23,42,0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "0.45rem 0.75rem",
              display: "flex",
              gap: "1rem",
              backdropFilter: "blur(4px)",
            }}
          >
            {[
              { l: "Batt V", v: `${voltage}V`, c: "#60a5fa" },
              { l: "Bulb V", v: `${bulbV}V`, c: "#34d399" },
              {
                l: "Brightness",
                v: isBurned ? "🔥 BURNED" : `${brightness}%`,
                c: isBurned ? "#ef4444" : "#fbbf24",
              },
            ].map((m) => (
              <div
                key={m.l}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.58rem",
                    color: "#64748b",
                    fontWeight: "700",
                  }}
                >
                  {m.l}
                </span>
                <span
                  style={{ fontSize: "0.8rem", fontWeight: "800", color: m.c }}
                >
                  {m.v}
                </span>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            right: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
            pointerEvents: "none",
          }}
        >
          <span
            style={{ fontSize: "0.7rem", color: "#475569", fontWeight: "bold" }}
          >
            SANDBOX MODE
          </span>
          <span style={{ fontSize: "0.68rem", color: "#334155" }}>
            Tap battery, wires or switch directly
          </span>
        </div>
      </div>
    </div>
  );
}
