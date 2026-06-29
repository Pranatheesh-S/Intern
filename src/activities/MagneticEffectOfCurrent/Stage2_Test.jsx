import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, Info, Sparkles, CheckCircle2, RefreshCcw, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import {
  CardboardSwitchSVG,
  DrawingPinSVG,
  SafetyPinSVG,
  CompassCardboardSVG,
  CompassSVG,
  BatterySVG,
  WiresSVG
} from "./CircuitElements";

export default function Stage2_Test({ onComplete }) {
  const [switchOn, setSwitchOn] = useState(false);
  const [hasTestedOn, setHasTestedOn] = useState(false);
  const [hasTestedOff, setHasTestedOff] = useState(false);
  const [isBatteryFlipped, setIsBatteryFlipped] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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

  useEffect(() => {
    if (isTestingComplete) {
      setTimeout(() => setShowPopup(true), 2500);
    }
  }, [isTestingComplete]);

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
            
            <div 
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", opacity: hasTestedOn ? 0.6 : 1, cursor: !switchOn ? "pointer" : "default" }}
              onClick={() => { if (!switchOn) handleToggleSwitch(); }}
            >
              {hasTestedOn ? <CheckCircle2 size={16} color="var(--success)" /> : <div style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px solid var(--text-faint)" }} />}
              <span style={{ fontSize: "0.85rem", textDecoration: hasTestedOn ? "line-through" : "none" }}>1. Turn the switch ON</span>
            </div>
            
            <div 
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", opacity: hasTestedOff ? 0.6 : 1, cursor: switchOn ? "pointer" : "default" }}
              onClick={() => { if (switchOn) handleToggleSwitch(); }}
            >
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
            <button
              onClick={() => setIsBatteryFlipped(!isBatteryFlipped)}
              className="outline"
              style={{ width: "100%", display: "flex", justifyContent: "center", gap: "0.5rem" }}
            >
              <RefreshCcw size={16} /> Flip Battery
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL: INTERACTIVE CANVAS */}
        <div className="glass-panel" style={{ padding: "0", position: "relative", minHeight: "480px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--canvas-bg)" }}>
          <div className="canvas-bg-grid" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
          
          <svg width="600" height="480" viewBox="0 0 600 480" style={{ zIndex: 10, overflow: "visible" }}>
            {/* The base components (always placed since Stage 1 is complete) */}
            <CardboardSwitchSVG x={400} y={200} />
            <CompassCardboardSVG x={120} y={60} />
            
            <DrawingPinSVG x={480} y={250} isPlaced={true} />
            <DrawingPinSVG x={480} y={370} isPlaced={true} />
            
            {/* Compass - deflecting based on switch state */}
            {/* Normal: 0 deg. Deflected: 45 or -45 deg */}
            <CompassSVG x={250} y={150} isPlaced={true} deflection={switchOn ? (isBatteryFlipped ? -45 : 45) : 0} />
            
            <BatterySVG isPlaced={true} isFlipped={isBatteryFlipped} />
            
            {/* Wires */}
            <WiresSVG 
              isWireConnected={true} 
              isBatteryPresent={true} 
              isCompassPlaced={true} 
              arePinsPlaced={true} 
              isCurrentFlowing={switchOn} 
              isBatteryFlipped={isBatteryFlipped}
            />

            {/* Safety Pin (Interactive Switch) */}
            <SafetyPinSVG 
              x={480} 
              y={250} 
              rotation={switchOn ? 0 : -30} 
              isPlaced={true} 
              onClick={handleToggleSwitch} 
            />
          </svg>
          
          {/* Battery Reversed Popup */}
          <AnimatePresence>
            {isBatteryFlipped && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  width: "250px",
                  maxWidth: "calc(100% - 40px)",
                  background: "var(--card-bg)",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--accent-border)",
                  boxShadow: "var(--card-shadow)",
                  zIndex: 20,
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                  backdropFilter: "blur(8px)"
                }}
              >
                <Info size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  Changing the battery terminals changes the direction of current in the wire. This reverses the magnetic field around the wire, causing the compass needle to turn in the opposite direction.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', maxWidth: '400px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center', border: '1px solid var(--border)' }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✨</div>
              <h2 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', fontSize: '1.5rem' }}>Discovery Made!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.5', fontSize: '0.95rem' }}>
                You have successfully observed Oersted's Experiment! You saw that an electric current produces a magnetic field, deflecting the compass needle.
              </p>
              <button onClick={onComplete} className="primary" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                Proceed to Quiz <ArrowRight size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
