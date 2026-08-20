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
  ArrowRight,
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
    return { zone: "none", label: "No voltage — bulb off", color: "var(--text-faint)", brightness: 0 };

  if (battV === bulbV)
    return { zone: "active", label: "Normal glow ✅", color: "var(--success)", brightness: 100 };

  if (battV === 1.5 && bulbV === 3)
    return { zone: "active", label: "Very dim ⚠️", color: "var(--warning)", brightness: 50 };
  if (battV === 1.5 && bulbV === 6)
    return { zone: "active", label: "May not glow ⚠️", color: "var(--text-muted)", brightness: 25 };
  if (battV === 1.5 && bulbV === 9)
    return { zone: "active", label: "No visible glow ⚠️", color: "var(--text-faint)", brightness: 10 };

  if (battV === 3 && bulbV === 1.5)
    return { zone: "danger", label: "Very bright, may damage bulb ❌", color: "var(--danger)", brightness: 120 };
  if (battV === 3 && bulbV === 6)
    return { zone: "active", label: "Dim glow ⚠️", color: "var(--warning)", brightness: 50 };
  if (battV === 3 && bulbV === 9)
    return { zone: "active", label: "Very dim ⚠️", color: "var(--warning)", brightness: 30 };

  if (battV === 6 && bulbV === 1.5)
    return { zone: "burned", label: "Burns out quickly ❌", color: "var(--danger)", brightness: 0 };
  if (battV === 6 && bulbV === 3)
    return { zone: "danger", label: "Very bright, may burn out ❌", color: "var(--danger)", brightness: 120 };
  if (battV === 6 && bulbV === 9)
    return { zone: "active", label: "Dim glow ⚠️", color: "var(--warning)", brightness: 60 };

  if (battV === 9 && bulbV === 1.5)
    return { zone: "burned", label: "Immediate burn out ❌", color: "var(--danger)", brightness: 0 };
  if (battV === 9 && bulbV === 3)
    return { zone: "burned", label: "Burns out quickly ❌", color: "var(--danger)", brightness: 0 };
  if (battV === 9 && bulbV === 6)
    return { zone: "danger", label: "Very bright, possible damage ❌", color: "var(--danger)", brightness: 120 };

  return { zone: "active", label: "Unknown ⚠️", color: "var(--text-faint)", brightness: 0 };
}

export default function Stage3_Explore({ onComplete }) {
  const [isPinConnected, setIsPinConnected] = useState(false);
  const [batteryPresent, setBatteryPresent] = useState(true);
  const [wireConnected, setWireConnected] = useState(true);
  const [pinMaterial, setPinMaterial] = useState("metal");

  const [voltage, setVoltage] = useState(1.5);
  const [bulbV, setBulbV] = useState(1.5);

  const [burnAnim, setBurnAnim] = useState(false);
  const prevZoneRef = useRef("low");

  const profile = getBulbProfile(voltage, bulbV);
  const isConductor = pinMaterial === "metal";
  const circuitClosed = isPinConnected && batteryPresent && wireConnected && isConductor;

  const isBurned =
    circuitClosed &&
    (profile.zone === "burned" ||
      profile.label.includes("burn out") ||
      profile.label.includes("damage"));
  const isCurrentFlowing = circuitClosed && !isBurned;
  const isBulbOn = isCurrentFlowing;
  const brightness = isBulbOn ? profile.brightness : 0;

  useEffect(() => {
    if (circuitClosed && profile.zone === "burned" && prevZoneRef.current !== "burned") {
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
        desc: "No voltage source means no energy to push electrons.",
        status: "warning",
      };
    if (!wireConnected)
      return {
        title: "Wire Broken (Open Circuit)",
        desc: "A broken wire interrupts the path. Current needs a continuous loop.",
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
  const expBg = {
    success: { bg: "var(--success-bg)", border: "var(--success-border)", text: "var(--success)" },
    danger:  { bg: "var(--danger-bg)", border: "var(--danger-border)", text: "var(--danger)" },
    warning: { bg: "var(--warning-bg)", border: "var(--warning-border)", text: "var(--warning)" },
    neutral: { bg: "var(--neutral-bg)", border: "var(--border)", text: "var(--text-secondary)" },
  };
  const expStyle = expBg[exp.status] || expBg.neutral;

  return (
    <div className="main-grid" style={{ userSelect: "none", WebkitUserSelect: "none" }}>
      {/* ── LEFT PANEL ── */}
      <div
        className="glass-panel"
        style={{ display: "flex", flexDirection: "column", gap: "1rem", overflowY: "auto" }}
      >
        <div>
          <span
            className="status-badge neutral"
            style={{ background: "var(--success-bg)", color: "var(--success)", borderColor: "var(--success-border)" }}
          >
            Stage 3: Sandbox Lab
          </span>
          <h2 style={{ marginTop: "0.5rem", marginBottom: "0.25rem" }}>Circuit Explorer</h2>
          <p style={{ fontSize: "0.85rem", margin: 0, color: "var(--text-muted)" }}>
            Change voltage, toggle components, and discover how electricity behaves.
          </p>
        </div>

        {/* ── VOLTAGE EXPERIMENT ── */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Zap size={15} style={{ color: "var(--warning)" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)" }}>
              Voltage Experiment
            </span>
          </div>

          {/* Battery voltage */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span
              style={{
                fontSize: "0.82rem",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <Battery size={13} /> Battery Voltage
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.3rem" }}>
              {[1.5, 3, 6, 9].map((v) => (
                <button
                  key={`batt-${v}`}
                  onClick={() => setVoltage(v)}
                  style={{
                    padding: "0.3rem 0",
                    borderRadius: "7px",
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    border: `1.5px solid ${voltage === v ? "var(--accent-border)" : "var(--border)"}`,
                    background: voltage === v ? "var(--accent-bg)" : "var(--btn-bg)",
                    color: voltage === v ? "var(--accent-text)" : "var(--text-muted)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {v}V
                </button>
              ))}
            </div>
          </div>

          {/* Bulb voltage rating */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginTop: "0.5rem" }}
          >
            <span
              style={{
                fontSize: "0.82rem",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <Lightbulb size={13} /> Bulb Voltage Rating
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.3rem" }}>
              {[1.5, 3, 6, 9].map((v) => (
                <button
                  key={`bulb-${v}`}
                  onClick={() => setBulbV(v)}
                  style={{
                    padding: "0.3rem 0",
                    borderRadius: "7px",
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    border: `1.5px solid ${bulbV === v ? "var(--warning-border)" : "var(--border)"}`,
                    background: bulbV === v ? "var(--warning-bg)" : "var(--btn-bg)",
                    color: bulbV === v ? "var(--warning)" : "var(--text-muted)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {v}V
                </button>
              ))}
            </div>
          </div>

          {/* Zone badge */}
          <div
            style={{
              background: profile.zone === "burned" ? "var(--danger-bg)" : profile.zone === "danger" ? "var(--warning-bg)" : "var(--success-bg)",
              border: `1px solid ${profile.zone === "burned" ? "var(--danger-border)" : profile.zone === "danger" ? "var(--warning-border)" : "var(--success-border)"}`,
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

        {/* ── SANDBOX CONTROLS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {/* Science report */}
          <div
            style={{
              background: expStyle.bg,
              border: `1px solid ${expStyle.border}`,
              borderRadius: "10px",
              padding: "0.8rem",
            }}
          >
            <h4
              style={{
                margin: "0 0 0.3rem 0",
                fontSize: "0.85rem",
                color: expStyle.text,
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              {exp.status === "success" ? <CheckCircle size={14} /> : <ZapOff size={14} />}{" "}
              {exp.title}
            </h4>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {exp.desc}
            </p>
          </div>

          {/* Toggle controls */}
          {[
            {
              label: "Safety Pin Switch",
              action: () => setIsPinConnected((p) => !p),
              btnLabel: isPinConnected ? "Closed (ON)" : "Open (OFF)",
              icon: isPinConnected ? (
                <ToggleRight size={14} style={{ color: "var(--success)" }} />
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
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{ctrl.label}</span>
              <button
                onClick={ctrl.action}
                className="outline"
                style={{ padding: "0.35rem 0.7rem", fontSize: "0.78rem", gap: "0.3rem" }}
              >
                {ctrl.icon} {ctrl.btnLabel}
              </button>
            </div>
          ))}

          {/* Material selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span
              style={{
                fontSize: "0.82rem",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <Layers size={13} /> Safety Pin Material
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.35rem" }}>
              {[
                ["metal", "Metal", "var(--accent-text)", "var(--accent-bg)", "var(--accent-border)"],
                ["plastic", "Plastic", "var(--success)", "var(--success-bg)", "var(--success-border)"],
                ["wood", "Wood", "var(--warning)", "var(--warning-bg)", "var(--warning-border)"],
              ].map(([id, label, clr, bgActive, borderActive]) => (
                <button
                  key={id}
                  onClick={() => setPinMaterial(id)}
                  style={{
                    fontSize: "0.72rem",
                    padding: "0.45rem 0.2rem",
                    borderRadius: "7px",
                    border: `1.5px solid ${pinMaterial === id ? borderActive : "var(--border)"}`,
                    background: pinMaterial === id ? bgActive : "var(--btn-bg)",
                    color: pinMaterial === id ? clr : "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto", paddingTop: "0.5rem" }}>
          <button
            onClick={handleReset}
            className="outline"
            style={{ gap: "0.35rem", flex: 1 }}
          >
            <RotateCcw size={14} /> Reset
          </button>
          {onComplete && (
            <button
              onClick={onComplete}
              className="success"
              style={{ gap: "0.35rem", flex: 2 }}
            >
              Go to Quiz <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL — Circuit Canvas ── */}
      <div className="canvas-container" style={{ padding: "2rem", userSelect: "none", WebkitUserSelect: "none" }}>
        <div className="canvas-bg-grid" />

        {/* Status badges */}
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
              background: "var(--accent-bg)",
              border: "1px solid var(--accent-border)",
              color: "var(--accent-text)",
            }}
          >
            {voltage}V Battery
          </span>
        </div>

        {/* SVG Circuit */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          style={{ width: "100%", height: "100%", userSelect: "none", WebkitUserSelect: "none" }}
        >
          <CardboardSVG x={480} y={240} />

          <g transform="translate(100, 18)">
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
          </g>

          <AnimatePresence>
            {burnAnim && (
              <motion.text
                x={400}
                y={50}
                fontSize={28}
                initial={{ opacity: 1, y: 50 }}
                animate={{ opacity: 0, y: 20 }}
                transition={{ duration: 1.8 }}
              >
                🔥
              </motion.text>
            )}
          </AnimatePresence>

          {isBulbOn && (
            <circle
              cx={400}
              cy={95}
              r={28 + brightness * 0.12}
              fill="none"
              stroke="var(--warning)"
              strokeWidth={3}
              opacity={0.15 + brightness * 0.005}
              style={{ filter: "blur(5px)", transition: "all 0.4s" }}
            />
          )}

          <g transform="translate(70, 40)">
            <BatterySVG
              isPlaced={batteryPresent}
              isTarget={!batteryPresent}
              onClick={() => setBatteryPresent((p) => !p)}
            />
          </g>

          <WiresSVG
            isWireConnected={true}
            isBatteryPresent={batteryPresent}
            isBulbPresent={true}
            arePinsPlaced={true}
            isCurrentFlowing={isCurrentFlowing}
            isBroken={!wireConnected}
            onClick={() => setWireConnected((p) => !p)}
          />

          <DrawingPinSVG x={560} y={290} label="Drawing Pin 1" isPlaced={true} />

          <g onClick={() => setIsPinConnected((p) => !p)} style={{ cursor: "pointer" }}>
            <SafetyPinSVG x={560} y={290} rotation={isPinConnected ? 0 : -35} isPlaced={true} material={pinMaterial} />
          </g>

          <DrawingPinSVG x={560} y={410} label="Drawing Pin 2" isPlaced={true} />
        </svg>

        {/* Live overlay */}
        {(isBulbOn || isBurned) && (
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "0.45rem 0.75rem",
              display: "flex",
              gap: "1rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {[
              { l: "Batt V", v: `${voltage}V`, c: "var(--accent-text)" },
              { l: "Bulb V", v: `${bulbV}V`, c: "var(--success)" },
              {
                l: "Brightness",
                v: isBurned ? "🔥 BURNED" : `${brightness}%`,
                c: isBurned ? "var(--danger)" : "var(--warning)",
              },
            ].map((m) => (
              <div
                key={m.l}
                style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <span style={{ fontSize: "0.58rem", color: "var(--text-faint)", fontWeight: "700" }}>
                  {m.l}
                </span>
                <span style={{ fontSize: "0.8rem", fontWeight: "800", color: m.c }}>{m.v}</span>
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
          <span style={{ fontSize: "0.7rem", color: "var(--text-faint)", fontWeight: "bold" }}>
            SANDBOX MODE
          </span>
          <span style={{ fontSize: "0.68rem", color: "var(--text-faint)" }}>
            Tap battery, wires or switch directly
          </span>
        </div>
      </div>
    </div>
  );
}
