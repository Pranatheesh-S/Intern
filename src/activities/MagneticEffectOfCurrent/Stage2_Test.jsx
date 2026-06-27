import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, Info, Sparkles, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import {
  CardboardSwitchSVG,
  CompassCardboardSVG,
  DrawingPinSVG,
  SafetyPinSVG,
  BatterySVG,
  CompassSVG,
  WiresSVG,
} from "./CircuitElements";

export default function Stage2_Test({ onComplete }) {
  const [switchOn, setSwitchOn] = useState(false);
  const [hasTestedOn, setHasTestedOn] = useState(false);
  const [hasTestedOff, setHasTestedOff] = useState(false);

  const handleToggleSwitch = () => {
    const newState = !switchOn;
    setSwitchOn(newState);
    
    if (newState && !hasTestedOn) {
      setHasTestedOn(true);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } else if (!newState && hasTestedOn && !hasTestedOff) {
      setHasTestedOff(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const isTestingComplete = hasTestedOn && hasTestedOff;

  return (
    <div className="main-grid" style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <span className="status-badge neutral" style={{ background: "var(--accent-bg)", color: "var(--accent-text)", fontWeight: "bold" }}>
            Stage 2: Test the Magnetic Effect
          </span>
          <h2 style={{ margin: "0.2rem 0 0 0", fontSize: "1.4rem" }}>Oersted's Experiment</h2>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1rem", alignItems: "stretch" }}>
        {/* LEFT PANEL */}
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", height: "100%" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", background: "var(--neutral-bg)", padding: "0.8rem", borderRadius: "10px", border: "1px solid var(--border)" }}>
            <Info style={{ color: "var(--accent)", flexShrink: 0 }} size={18} />
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              Toggle the switch to observe the effect of electric current on the magnetic compass.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", color: "var(--text-primary)" }}>Tasks:</h3>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", opacity: hasTestedOn ? 0.6 : 1 }}>
              {hasTestedOn ? <CheckCircle2 size={16} color="var(--success)" /> : <div style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px solid var(--text-faint)" }} />}
              <span style={{ fontSize: "0.85rem", textDecoration: hasTestedOn ? "line-through" : "none" }}>1. Turn the switch ON</span>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", opacity: hasTestedOff ? 0.6 : 1 }}>
              {hasTestedOff ? <CheckCircle2 size={16} color="var(--success)" /> : <div style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px solid var(--text-faint)" }} />}
              <span style={{ fontSize: "0.85rem", textDecoration: hasTestedOff ? "line-through" : "none" }}>2. Turn the switch OFF</span>
            </div>
          </div>

          <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--surface)", borderRadius: "10px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", textAlign: "center" }}>
            <h4 style={{ margin: 0, fontSize: "0.9rem" }}>Circuit Controls</h4>
            <button 
              onClick={handleToggleSwitch}
              className="primary" 
              style={{ width: "100%", display: "flex", justifyContent: "center", gap: "0.5rem", background: switchOn ? "var(--danger)" : "var(--success)" }}
            >
              <Power size={16} /> {switchOn ? "TURN OFF" : "TURN ON"}
            </button>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>You can also click the Safety Pin on the board.</p>
          </div>

          <AnimatePresence>
            {isTestingComplete && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "auto" }}>
                <div style={{ background: "var(--success-bg)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--success-border)", marginBottom: "1rem" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--success)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Sparkles size={16} /> Discovery Made!
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                    Notice how when the current flows, the compass needle gets deflected from its original direction. When the current stops, the needle returns to its original direction! This shows that an electric current produces a magnetic field.
                  </p>
                </div>
                <button onClick={onComplete} className="primary" style={{ width: "100%" }}>Proceed to Quiz</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL: INTERACTIVE CANVAS */}
        <div className="glass-panel" style={{ padding: "0", position: "relative", minHeight: "480px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
          <div className="canvas-bg-grid" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
          
          <svg width="600" height="480" viewBox="0 0 600 480" style={{ zIndex: 10, overflow: "visible" }}>
            {/* The base components (always placed since Stage 1 is complete) */}
            <CardboardSwitchSVG x={370} y={200} />
            <CompassCardboardSVG x={120} y={60} />
            
            <DrawingPinSVG x={450} y={250} isPlaced={true} />
            <DrawingPinSVG x={450} y={370} isPlaced={true} />
            
            {/* Compass - deflecting based on switch state */}
            {/* Normal: 0 deg. Deflected: 45 deg */}
            <CompassSVG x={250} y={150} isPlaced={true} deflection={switchOn ? 45 : 0} />
            
            <BatterySVG isPlaced={true} />
            
            {/* Wires */}
            <WiresSVG 
              isWireConnected={true} 
              isBatteryPresent={true} 
              isCompassPlaced={true} 
              arePinsPlaced={true} 
              isCurrentFlowing={switchOn} 
            />

            {/* Safety Pin (Interactive Switch) */}
            <SafetyPinSVG 
              x={450} 
              y={250} 
              rotation={switchOn ? 0 : -30} 
              isPlaced={true} 
              onClick={handleToggleSwitch} 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
