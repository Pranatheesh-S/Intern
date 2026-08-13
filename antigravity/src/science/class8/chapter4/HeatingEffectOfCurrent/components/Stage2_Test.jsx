import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Thermometer, Battery, Flame, ArrowDown } from "lucide-react";
import confetti from "canvas-confetti";
import HeatingCircuit3D from "./HeatingCircuit3D";

const investigations = [
  {
    id: 1,
    title: "Predict: What will happen?",
    question: "What will happen when you turn the switch ON?",
    options: ["Nothing happens", "The wire becomes warm", "The battery becomes hot"],
    correctAnswer: 1,
    explanation: "When current flows through a conductor with high resistance like nichrome, electrical energy is converted into heat energy, making the wire warm.",
    requiresAction: false
  },
  {
    id: 2,
    title: "Observe Heating",
    instruction: "Turn the switch ON to verify your prediction.",
    hint: "Click the switch on the circuit.",
    requiresAction: true,
    actionKey: "switchOn",
    expectedState: true
  },
  {
    id: 3,
    title: "Observe Cooling",
    instruction: "Now turn the switch OFF and observe the temperature.",
    hint: "Click the switch again.",
    requiresAction: true,
    actionKey: "switchOn",
    expectedState: false
  }
];

export default function Stage2_Test({ onComplete }) {
  const [currentInvestigation, setCurrentInvestigation] = useState(0);
  const [predictionState, setPredictionState] = useState({ selected: null, checked: false });
  const [switchOn, setSwitchOn] = useState(false);
  const [temperature, setTemperature] = useState(25);
  const [completed, setCompleted] = useState(false);

  const inv = investigations[currentInvestigation];

  // Temperature simulation
  useEffect(() => {
    let interval;
    if (switchOn) {
      interval = setInterval(() => {
        setTemperature(prev => Math.min(prev + (300 - prev) * 0.1, 300));
      }, 100);
    } else {
      interval = setInterval(() => {
        setTemperature(prev => Math.max(prev - (prev - 25) * 0.05, 25));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [switchOn]);

  useEffect(() => {
    if (inv && inv.requiresAction) {
      let isCorrectState = false;
      if (inv.actionKey === "switchOn" && switchOn === inv.expectedState) {
        isCorrectState = true;
      }
      
      if (isCorrectState) {
        if (currentInvestigation < investigations.length - 1) {
          setTimeout(() => setCurrentInvestigation(prev => prev + 1), 2000);
        } else {
          setCompleted(true);
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
      }
    }
  }, [switchOn, currentInvestigation, inv]);

  const handlePrediction = (index) => {
    if (predictionState.checked) return;
    setPredictionState({ selected: index, checked: true });
    setTimeout(() => {
      setCurrentInvestigation(1);
    }, 2500);
  };

  const toggleSwitch = () => {
    if (inv && inv.requiresAction) {
      setSwitchOn(!switchOn);
    }
  };

  return (
    <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "1.5rem", padding: "1.5rem", maxWidth: "1200px", margin: "0 auto", height: "calc(100vh - 100px)" }}>
      
      {/* LEFT PANEL */}
      <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", overflowY: "auto" }}>
        <div>
          <span className="status-badge warning" style={{ background: "var(--warning-bg)", color: "var(--warning)" }}>Stage 2: Test & Observe</span>
          <h2 style={{ margin: "0.5rem 0", fontSize: "1.4rem" }}>{inv?.title || "Investigation Complete"}</h2>
        </div>

        {!completed && inv && (
          <AnimatePresence mode="wait">
            {!inv.requiresAction ? (
              <motion.div key="predict" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p style={{ margin: 0, fontSize: "1.05rem", color: "var(--text-primary)", fontWeight: "500" }}>{inv.question}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {inv.options.map((opt, i) => {
                    const isSelected = predictionState.selected === i;
                    const isCorrect = i === inv.correctAnswer;
                    const showResult = predictionState.checked;
                    let bg = "var(--surface)";
                    let border = "var(--border)";
                    if (showResult) {
                      if (isCorrect) { bg = "var(--success-bg)"; border = "var(--success)"; }
                      else if (isSelected) { bg = "var(--danger-bg)"; border = "var(--danger)"; }
                    } else if (isSelected) { border = "var(--primary)"; }

                    return (
                      <button key={i} onClick={() => handlePrediction(i)} disabled={predictionState.checked} style={{ padding: "0.8rem", borderRadius: "8px", background: bg, border: `2px solid ${border}`, textAlign: "left", cursor: predictionState.checked ? "default" : "pointer", transition: "all 0.2s" }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {predictionState.checked && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ background: predictionState.selected === inv.correctAnswer ? "var(--success-bg)" : "var(--danger-bg)", padding: "1rem", borderRadius: "8px", border: `1px solid ${predictionState.selected === inv.correctAnswer ? "var(--success)" : "var(--danger)"}` }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-primary)" }}>{inv.explanation}</p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div key="action" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ background: "var(--primary-bg)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--primary-border)" }}>
                  <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--primary)" }}>Action Required</h3>
                  <p style={{ margin: 0, fontSize: "1.05rem", color: "var(--text-primary)" }}>{inv.instruction}</p>
                  <p style={{ margin: "1rem 0 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>💡 Hint: {inv.hint}</p>
                </div>
                
                {/* Real-time energy conversion panel */}
                {switchOn && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: "var(--surface)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
                    <h4 style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Energy Conversion</h4>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ef4444", fontWeight: "bold" }}><Battery size={16} /> Chemical Energy</div>
                      <ArrowDown size={14} style={{ color: "var(--text-muted)" }} />
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#0ea5e9", fontWeight: "bold" }}><Zap size={16} /> Electrical Energy</div>
                      <ArrowDown size={14} style={{ color: "var(--text-muted)" }} />
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#f97316", fontWeight: "bold" }}><Flame size={16} /> Heat Energy</div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {completed && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1, justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "var(--success-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Thermometer size={30} style={{ color: "var(--success)" }} />
            </div>
            <div>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>Observation Complete!</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                You've successfully observed the heating effect of electric current. As current passed through the nichrome wire, it resisted the flow and converted electrical energy into heat.
              </p>
            </div>
            <button onClick={onComplete} className="primary" style={{ width: "100%", padding: "0.8rem", marginTop: "1rem" }}>
              Continue to Sandbox <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </div>

      {/* RIGHT PANEL - 3D CANVAS */}
      <div className="glass-panel" style={{ position: "relative", overflow: "hidden", borderRadius: "16px", border: "1px solid var(--border)" }}>
        
        {/* Interactive Switch Overlay */}
        {inv && inv.requiresAction && (
          <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
            <button onClick={toggleSwitch} style={{ padding: "1rem 2rem", fontSize: "1.2rem", fontWeight: "bold", borderRadius: "50px", border: "none", background: switchOn ? "var(--danger)" : "var(--success)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", transition: "all 0.2s" }}>
              <Zap size={20} fill={switchOn ? "transparent" : "currentColor"} />
              {switchOn ? "Turn Switch OFF" : "Turn Switch ON"}
            </button>
          </div>
        )}

        {/* Temperature Gauge UI */}
        <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", zIndex: 10, background: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(10px)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Thermometer size={20} color={temperature > 100 ? "#ff3300" : "#fbbf24"} />
            <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Temperature</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "900", fontFamily: "monospace", color: temperature > 100 ? "#ff3300" : "#fbbf24" }}>
            {Math.round(temperature)}°C
          </div>
          <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.2)", borderRadius: "3px", overflow: "hidden", marginTop: "0.5rem" }}>
            <div style={{ width: `${Math.min(100, (temperature / 500) * 100)}%`, height: "100%", background: temperature > 100 ? "#ff3300" : "#fbbf24", transition: "width 0.2s ease-out" }} />
          </div>
        </div>

        <HeatingCircuit3D switchOn={switchOn} temperature={temperature} />
      </div>
    </div>
  );
}
