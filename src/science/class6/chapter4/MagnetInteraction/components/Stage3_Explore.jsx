import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, Info, ArrowRight, CheckCircle2, RotateCw, RotateCcw } from "lucide-react";

export default function Stage3_Explore({ onComplete, onNext }) {
  const [magnetAPoleRight, setMagnetAPoleRight] = useState("S"); // S or N
  const [magnetBPoleLeft, setMagnetBPoleLeft] = useState("N");   // N or S
  const [distance, setDistance] = useState(150);
  const [hasPencils, setHasPencils] = useState(true);
  const [isAdjustingDistance, setIsAdjustingDistance] = useState(false);

  const polesMatch = magnetAPoleRight === magnetBPoleLeft;
  const magneticForce = distance < 180 ? (180 - distance) * 0.5 : 0; 
  
  let magnetAOffset = 0;
  
  if (hasPencils) {
    if (polesMatch) {
      magnetAOffset = -magneticForce * 2;
    } else {
      magnetAOffset = magneticForce * 1.5;
      if (magnetAOffset > distance - 10) {
        magnetAOffset = distance - 10;
      }
    }
  } else {
    if (distance < 50) {
      if (polesMatch) {
        magnetAOffset = -magneticForce * 0.2;
      } else {
        magnetAOffset = magneticForce * 0.2;
      }
    }
  }

  const handleFinish = () => {
    onComplete();
    onNext();
  };

  return (
    <div className="glass-panel" style={{ padding: "2rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 500px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        <div style={{ 
          position: "relative", 
          width: "100%", 
          height: "350px", 
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)"
        }}>
          <div style={{ position: "absolute", bottom: "80px", width: "100%", height: "2px", background: "var(--border)" }} />

          <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
            
            {hasPencils && (
              <motion.div
                animate={{ x: magnetAOffset - 44 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                style={{ position: "absolute", display: "flex", gap: "8px", bottom: "82px", zIndex: 1 }}
              >
                <img src="/pencils.png" style={{ width: "88px", height: "120px", objectFit: "contain", filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))" }} alt="Pencils" draggable="false" />
                <AnimatePresence>
                  {!polesMatch && magneticForce > 0 && isAdjustingDistance && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ position: "absolute", left: "50%", marginLeft: "-12px", bottom: "-30px", color: "var(--text-secondary)" }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                      >
                        <RotateCw size={24} />
                      </motion.div>
                    </motion.div>
                  )}
                  {polesMatch && magneticForce > 0 && isAdjustingDistance && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ position: "absolute", left: "50%", marginLeft: "-12px", bottom: "-30px", color: "var(--text-secondary)" }}
                    >
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                      >
                        <RotateCcw size={24} />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            <motion.div
              animate={{ x: magnetAOffset - 60, y: hasPencils ? 0 : 5 }}
              transition={{ type: "spring", stiffness: 80, damping: 12 }}
              style={{ position: "absolute", bottom: hasPencils ? "110px" : "82px", width: "120px", height: "40px", zIndex: 10 }}
            >
              <div style={{ position: "absolute", top: "-25px", left: "50%", transform: "translateX(-50%)", fontSize: "0.85rem", fontWeight: "bold", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>Magnet A</div>
              <div style={{ position: "absolute", top: "50%", left: "50%", width: "40px", height: "120px", transform: `translate(-50%, -50%) rotate(${magnetAPoleRight === "S" ? "-90deg" : "90deg"})` }}>
                <img src="/bar_magnet.png" style={{ width: "100%", height: "100%", objectFit: "fill", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))" }} draggable="false" alt="Magnet A" />
              </div>
            </motion.div>

            <motion.div
              animate={{ x: distance + 20 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              style={{ position: "absolute", bottom: "110px", width: "120px", height: "40px", zIndex: 11 }}
            >
              <div style={{ position: "absolute", top: "-25px", left: "50%", transform: "translateX(-50%)", fontSize: "0.85rem", fontWeight: "bold", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>Magnet B</div>
              <div style={{ position: "absolute", top: "50%", left: "50%", width: "40px", height: "120px", transform: `translate(-50%, -50%) rotate(${magnetBPoleLeft === "N" ? "-90deg" : "90deg"})` }}>
                <img src="/bar_magnet.png" style={{ width: "100%", height: "100%", objectFit: "fill", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }} draggable="false" alt="Magnet B" />
              </div>
            </motion.div>

          </div>
        </div>

        <div style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", padding: "1rem", borderRadius: "6px", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
          <Info size={20} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h4 style={{ margin: "0 0 0.25rem 0", color: "var(--accent-text)", fontSize: "0.9rem" }}>Real-time Observation</h4>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: "1.4" }}>
              {distance > 180 ? "The magnets are too far apart to exert a noticeable magnetic force on each other." : 
               !hasPencils ? "The high friction of the table makes it very hard for Magnet A to move, even though there is a magnetic force." :
               polesMatch ? "Like poles repel! The magnetic force pushes Magnet A away, and it rolls easily on the pencils." :
               "Unlike poles attract! Magnet A is pulled towards Magnet B, rolling freely on the pencils."}
            </p>
          </div>
        </div>
      </div>

      <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", background: "var(--surface)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-heading)", marginBottom: "1.5rem", fontWeight: "bold" }}>
            <Settings2 size={20} /> Experiment Controls
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
              Magnet A (Left) Orientation
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => setMagnetAPoleRight("S")} className={magnetAPoleRight === "S" ? "primary" : "outline"} style={{ flex: 1, padding: "0.5rem" }}>[N - S]</button>
              <button onClick={() => setMagnetAPoleRight("N")} className={magnetAPoleRight === "N" ? "primary" : "outline"} style={{ flex: 1, padding: "0.5rem" }}>[S - N]</button>
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
              Magnet B (Right) Orientation
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => setMagnetBPoleLeft("N")} className={magnetBPoleLeft === "N" ? "primary" : "outline"} style={{ flex: 1, padding: "0.5rem" }}>[N - S]</button>
              <button onClick={() => setMagnetBPoleLeft("S")} className={magnetBPoleLeft === "S" ? "primary" : "outline"} style={{ flex: 1, padding: "0.5rem" }}>[S - N]</button>
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
              Surface Friction
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => setHasPencils(true)} className={hasPencils ? "primary" : "outline"} style={{ flex: 1, padding: "0.5rem" }}>Pencils (Low)</button>
              <button onClick={() => setHasPencils(false)} className={!hasPencils ? "primary" : "outline"} style={{ flex: 1, padding: "0.5rem" }}>Table (High)</button>
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>
              <span>Distance</span>
              <span>{Math.round(distance)} px</span>
            </div>
            <input 
              type="range" 
              min="0" max="300" 
              value={distance} 
              onChange={(e) => setDistance(Number(e.target.value))}
              onPointerDown={() => setIsAdjustingDistance(true)}
              onPointerUp={() => setIsAdjustingDistance(false)}
              onPointerLeave={() => setIsAdjustingDistance(false)}
              style={{ width: "100%", accentColor: "var(--accent)" }} 
            />
          </div>

          <button onClick={handleFinish} className="primary" style={{ width: "100%", padding: "0.75rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", background: "#10b981", borderColor: "#10b981" }}>
            <CheckCircle2 size={16} /> Proceed to Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
