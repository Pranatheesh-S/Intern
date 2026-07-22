import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Thermometer, Battery, Flame, ArrowDown, Activity, Settings2 } from "lucide-react";
import confetti from "canvas-confetti";
import HeatingCircuit3D from "./HeatingCircuit3D";

export default function Stage3_Sandbox({ onComplete }) {
  const [switchOn, setSwitchOn] = useState(false);
  const [numCells, setNumCells] = useState(1);
  const [material, setMaterial] = useState("nichrome");
  const [length, setLength] = useState(1);
  const [thickness, setThickness] = useState(1);
  const [temperature, setTemperature] = useState(25);

  // Resistance calculation based on material, length, thickness
  // ρ (rho) values (relative for simulation):
  // Copper: 1.68, Aluminium: 2.82, Iron: 10, Nichrome: 110
  const getResistance = () => {
    let rho = 110;
    if (material === "copper") rho = 1.68;
    else if (material === "aluminium") rho = 2.82;
    else if (material === "iron") rho = 10;
    
    // R = ρ * (L / A)
    return (rho * length) / (thickness * thickness);
  };

  // Temperature simulation
  useEffect(() => {
    let interval;
    if (switchOn) {
      interval = setInterval(() => {
        setTemperature(prev => {
          // Heat generated depends on V^2 / R (if battery has internal resistance, V drops, but let's simplify)
          // Actually, Heat = I^2 * R * t. Since I = V/R, Heat Power = V^2 / R.
          // So higher resistance = LOWER power (if voltage is constant).
          // Wait! The textbook says: "A nichrome wire offers higher resistance compared to a copper wire... This resistance causes some of the electrical energy to be converted into heat energy."
          // In a simple circuit with a battery (which has internal resistance), the power dissipated by the wire is max when its resistance matches internal resistance.
          // Copper wire essentially shorts the battery, battery gets hot, wire stays cool (relatively, or gets very hot very fast and melts if thin).
          // For educational simplicity matching the textbook: 
          // Nichrome gets very hot. Copper gets slightly warm.
          // More cells = more voltage = more heat (V^2 / R).
          
          let targetTemp = 25;
          const voltage = numCells * 1.5; // 1.5V per cell
          
          if (material === "nichrome") targetTemp = 100 + (voltage * voltage) * 20 * (thickness / length);
          else if (material === "iron") targetTemp = 40 + (voltage * voltage) * 5 * (thickness / length);
          else if (material === "aluminium") targetTemp = 30 + (voltage * voltage) * 2;
          else if (material === "copper") targetTemp = 28 + (voltage * voltage) * 1;
          
          // Cap temp to 1000
          targetTemp = Math.min(targetTemp, 1000);
          
          // Heating rate
          const diff = targetTemp - prev;
          return prev + diff * 0.05; // 5% approach per 100ms
        });
      }, 100);
    } else {
      interval = setInterval(() => {
        setTemperature(prev => Math.max(prev - (prev - 25) * 0.02, 25)); // Slower cooling
      }, 100);
    }
    return () => clearInterval(interval);
  }, [switchOn, numCells, material, length, thickness]);

  return (
    <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "1.5rem", padding: "1.5rem", maxWidth: "1200px", margin: "0 auto", height: "calc(100vh - 100px)" }}>
      
      {/* LEFT PANEL - CONTROLS */}
      <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span className="status-badge neutral" style={{ background: "var(--accent-bg)", color: "var(--accent-text)", fontWeight: "bold" }}>Stage 3: Sandbox</span>
            <h2 style={{ margin: "0.2rem 0 0 0", fontSize: "1.3rem" }}>Experiment freely</h2>
          </div>
          <Settings2 style={{ color: "var(--text-muted)" }} size={24} />
        </div>

        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Investigate how current, material, length, and thickness affect the heating of the wire.
        </p>

        {/* Master Switch */}
        <div style={{ background: switchOn ? "rgba(220, 38, 38, 0.1)" : "var(--surface)", border: `2px solid ${switchOn ? "var(--danger)" : "var(--border)"}`, padding: "1rem", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Zap size={20} color={switchOn ? "var(--danger)" : "var(--text-muted)"} fill={switchOn ? "var(--danger)" : "none"} />
            <div>
              <div style={{ fontWeight: "bold", color: switchOn ? "var(--danger)" : "var(--text-primary)" }}>Main Switch</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{switchOn ? "Circuit Closed (ON)" : "Circuit Open (OFF)"}</div>
            </div>
          </div>
          <button 
            onClick={() => setSwitchOn(!switchOn)} 
            style={{ padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer", background: switchOn ? "var(--danger)" : "var(--success)", color: "white" }}
          >
            {switchOn ? "Turn OFF" : "Turn ON"}
          </button>
        </div>

        {/* Number of Cells */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--text-secondary)", display: "flex", justifyContent: "space-between" }}>
            <span>Number of Cells (Current)</span>
            <span style={{ color: "var(--primary)" }}>{numCells} {numCells === 1 ? "Cell" : "Cells"}</span>
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[1, 2, 3].map(n => (
              <button key={n} onClick={() => setNumCells(n)} className={`outline ${numCells === n ? 'active' : ''}`} style={{ flex: 1, padding: "0.5rem", background: numCells === n ? "var(--primary-bg)" : "transparent", borderColor: numCells === n ? "var(--primary)" : "var(--border)" }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Material Selection */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--text-secondary)" }}>Wire Material</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {[
              { id: "copper", name: "Copper" },
              { id: "aluminium", name: "Aluminium" },
              { id: "iron", name: "Iron" },
              { id: "nichrome", name: "Nichrome" }
            ].map(mat => (
              <button key={mat.id} onClick={() => setMaterial(mat.id)} className={`outline ${material === mat.id ? 'active' : ''}`} style={{ padding: "0.5rem", fontSize: "0.85rem", background: material === mat.id ? "var(--primary-bg)" : "transparent", borderColor: material === mat.id ? "var(--primary)" : "var(--border)" }}>
                {mat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Wire Length */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--text-secondary)" }}>
            Wire Length
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
            {[
              { val: 0.5, label: "5 cm" },
              { val: 1.0, label: "10 cm" },
              { val: 1.5, label: "15 cm" }
            ].map(opt => (
              <button 
                key={opt.val} 
                onClick={() => setLength(opt.val)} 
                className={`outline ${length === opt.val ? 'active' : ''}`} 
                style={{ padding: "0.5rem", fontSize: "0.85rem", background: length === opt.val ? "var(--primary-bg)" : "transparent", borderColor: length === opt.val ? "var(--primary)" : "var(--border)" }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Wire Thickness */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--text-secondary)" }}>
            Wire Thickness
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
            {[
              { val: 0.5, label: "Thin" },
              { val: 1.0, label: "Medium" },
              { val: 1.5, label: "Thick" }
            ].map(opt => (
              <button 
                key={opt.val} 
                onClick={() => setThickness(opt.val)} 
                className={`outline ${thickness === opt.val ? 'active' : ''}`} 
                style={{ padding: "0.5rem", fontSize: "0.85rem", background: thickness === opt.val ? "var(--primary-bg)" : "transparent", borderColor: thickness === opt.val ? "var(--primary)" : "var(--border)" }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "auto" }}>
          <button onClick={() => { confetti(); onComplete(); }} className="primary" style={{ width: "100%", padding: "0.8rem", gap: "0.5rem" }}>
            Ready for Concept Check <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* RIGHT PANEL - 3D CANVAS */}
      <div className="glass-panel" style={{ position: "relative", overflow: "hidden", borderRadius: "16px", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
        
        {/* Real-time energy conversion panel */}
        <AnimatePresence>
          {switchOn && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ position: "absolute", top: "1.5rem", left: "1.5rem", zIndex: 10, background: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(10px)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", color: "white" }}>
              <h4 style={{ margin: 0, fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "1px" }}>Energy Flow</h4>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ef4444", fontWeight: "bold" }}><Battery size={16} /> Chemical</div>
                <ArrowDown size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#0ea5e9", fontWeight: "bold" }}><Zap size={16} /> Electrical</div>
                <AnimatePresence>
                  {temperature > 30 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" }}>
                      <ArrowDown size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#f97316", fontWeight: "bold" }}><Flame size={16} /> Heat</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Temperature Gauge UI */}
        <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", zIndex: 10, background: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(10px)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Thermometer size={20} color={temperature > 300 ? "#ff3300" : temperature > 60 ? "#f97316" : "#fbbf24"} />
            <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Wire Temp</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "900", fontFamily: "monospace", color: temperature > 300 ? "#ff3300" : temperature > 60 ? "#f97316" : "#fbbf24" }}>
            {Math.round(temperature)}°C
          </div>
          <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.2)", borderRadius: "3px", overflow: "hidden", marginTop: "0.5rem" }}>
            <div style={{ width: `${Math.min(100, (temperature / 1000) * 100)}%`, height: "100%", background: temperature > 300 ? "#ff3300" : temperature > 60 ? "#f97316" : "#fbbf24", transition: "width 0.2s ease-out" }} />
          </div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "0.2rem" }}>
            {material === "nichrome" ? "High Resistance" : material === "copper" ? "Low Resistance" : "Medium Resistance"}
          </div>
        </div>

        <HeatingCircuit3D 
          switchOn={switchOn} 
          temperature={temperature} 
          numCells={numCells}
          wireLength={length}
          wireThickness={thickness}
          material={material}
        />
        
      </div>
    </div>
  );
}
