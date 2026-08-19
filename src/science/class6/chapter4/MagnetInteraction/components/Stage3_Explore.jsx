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
    <div style={{ 
      padding: '1.25rem 1.75rem', 
      display: 'flex', 
      gap: '1.75rem', 
      height: '100%', 
      minHeight: 0, 
      overflow: 'hidden', 
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent'
    }}>
      {/* Left Side: Interactive Workspace */}
      <div style={{ flex: "1.35", display: "flex", flexDirection: "column", gap: "1rem", height: '100%', justifyContent: 'center' }}>
        
        <div style={{ 
          position: "relative", 
          width: "100%", 
          height: "300px", 
          background: "#f8fafc",
          border: "2px solid #cbd5e1",
          borderRadius: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          boxShadow: "inset 0 0 25px rgba(0,0,0,0.05), 0 8px 25px rgba(0,0,0,0.07)"
        }}>
          <div style={{ position: "absolute", bottom: "80px", width: "100%", height: "2px", background: "#cbd5e1" }} />

          <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center" }}>
            
            {hasPencils && (
              <motion.div
                animate={{ x: magnetAOffset - 44 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                style={{ position: "absolute", display: "flex", gap: "8px", bottom: "82px", zIndex: 1 }}
              >
                <img src="/MagnetInteraction/pencils.png" style={{ width: "88px", height: "120px", objectFit: "contain", filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))" }} alt="Pencils" draggable="false" />
                <AnimatePresence>
                  {!polesMatch && magneticForce > 0 && isAdjustingDistance && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ position: "absolute", left: "50%", marginLeft: "-12px", bottom: "-30px", color: "#1e293b" }}
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
                      style={{ position: "absolute", left: "50%", marginLeft: "-12px", bottom: "-30px", color: "#1e293b" }}
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
              <div style={{ position: "absolute", top: "-25px", left: "50%", transform: "translateX(-50%)", fontSize: "0.85rem", fontWeight: "bold", color: "#1e293b", whiteSpace: "nowrap" }}>Magnet A</div>
              <div style={{ position: "absolute", top: "50%", left: "50%", width: "40px", height: "120px", transform: `translate(-50%, -50%) rotate(${magnetAPoleRight === "S" ? "-90deg" : "90deg"})` }}>
                <img src="/Shared/bar_magnet.png" style={{ width: "100%", height: "100%", objectFit: "fill", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))" }} draggable="false" alt="Magnet A" />
              </div>
            </motion.div>

            <motion.div
              animate={{ x: distance + 20 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              style={{ position: "absolute", bottom: "110px", width: "120px", height: "40px", zIndex: 11 }}
            >
              <div style={{ position: "absolute", top: "-25px", left: "50%", transform: "translateX(-50%)", fontSize: "0.85rem", fontWeight: "bold", color: "#1e293b", whiteSpace: "nowrap" }}>Magnet B</div>
              <div style={{ position: "absolute", top: "50%", left: "50%", width: "40px", height: "120px", transform: `translate(-50%, -50%) rotate(${magnetBPoleLeft === "N" ? "-90deg" : "90deg"})` }}>
                <img src="/Shared/bar_magnet.png" style={{ width: "100%", height: "100%", objectFit: "fill", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }} draggable="false" alt="Magnet B" />
              </div>
            </motion.div>

          </div>
        </div>

        {/* Real-time Observation Box */}
        <div style={{ 
          background: "#ffffff", 
          border: "1.5px solid #CCECE7", 
          padding: "1.1rem 1.4rem", 
          borderRadius: "16px", 
          display: "flex", 
          gap: "0.75rem", 
          alignItems: "flex-start",
          boxShadow: "0 4px 14px rgba(15, 118, 110, 0.04)"
        }}>
          <Info size={22} color="#F43F5E" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h4 style={{ margin: "0 0 0.25rem 0", color: "#134E4A", fontSize: "1.05rem", fontWeight: 800 }}>Real-time Observation</h4>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#115E59", lineHeight: "1.5", fontWeight: 600 }}>
              {distance > 180 ? "The magnets are too far apart to exert a noticeable magnetic force on each other." : 
               !hasPencils ? "The high friction of the table makes it very hard for Magnet A to move, even though there is a magnetic force." :
               polesMatch ? "Like poles repel! The magnetic force pushes Magnet A away, and it rolls easily on the pencils." :
               "Unlike poles attract! Magnet A is pulled towards Magnet B, rolling freely on the pencils."}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Frosted Glacial Teal Panel */}
      <div style={{ 
        flex: "0.85", 
        background: 'linear-gradient(135deg, #F0FDF9 0%, #E6F7F5 100%)',
        border: '1.5px solid #CCECE7',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 8px 25px rgba(15, 118, 110, 0.06)',
        display: "flex", 
        flexDirection: "column", 
        gap: "1.25rem", 
        overflowY: "auto" 
      }}>
        <div style={{ 
          padding: "1.25rem 1.4rem", 
          background: "#ffffff", 
          border: "1.5px solid #CCECE7", 
          borderRadius: "16px",
          boxShadow: "0 4px 14px rgba(15, 118, 110, 0.04)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#134E4A", marginBottom: "1.25rem", fontWeight: 800, fontSize: "1.15rem" }}>
            <Settings2 size={20} color="#F43F5E" /> Experiment Controls
          </div>

          {/* Magnet A Orientation */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", marginBottom: "0.4rem", color: "#115E59" }}>
              Magnet A (Left) Orientation
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button 
                onClick={() => setMagnetAPoleRight("S")} 
                style={{ 
                  flex: 1, 
                  padding: "0.55rem",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: magnetAPoleRight === "S" ? "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)" : "#ffffff",
                  color: magnetAPoleRight === "S" ? "#ffffff" : "#0F766E",
                  border: magnetAPoleRight === "S" ? "none" : "1.5px solid #CCECE7",
                  boxShadow: magnetAPoleRight === "S" ? "0 4px 12px rgba(244, 63, 94, 0.4)" : "none"
                }}
              >
                [N - S]
              </button>
              <button 
                onClick={() => setMagnetAPoleRight("N")} 
                style={{ 
                  flex: 1, 
                  padding: "0.55rem",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: magnetAPoleRight === "N" ? "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)" : "#ffffff",
                  color: magnetAPoleRight === "N" ? "#ffffff" : "#0F766E",
                  border: magnetAPoleRight === "N" ? "none" : "1.5px solid #CCECE7",
                  boxShadow: magnetAPoleRight === "N" ? "0 4px 12px rgba(244, 63, 94, 0.4)" : "none"
                }}
              >
                [S - N]
              </button>
            </div>
          </div>

          {/* Magnet B Orientation */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", marginBottom: "0.4rem", color: "#115E59" }}>
              Magnet B (Right) Orientation
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button 
                onClick={() => setMagnetBPoleLeft("N")} 
                style={{ 
                  flex: 1, 
                  padding: "0.55rem",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: magnetBPoleLeft === "N" ? "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)" : "#ffffff",
                  color: magnetBPoleLeft === "N" ? "#ffffff" : "#0F766E",
                  border: magnetBPoleLeft === "N" ? "none" : "1.5px solid #CCECE7",
                  boxShadow: magnetBPoleLeft === "N" ? "0 4px 12px rgba(244, 63, 94, 0.4)" : "none"
                }}
              >
                [N - S]
              </button>
              <button 
                onClick={() => setMagnetBPoleLeft("S")} 
                style={{ 
                  flex: 1, 
                  padding: "0.55rem",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: magnetBPoleLeft === "S" ? "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)" : "#ffffff",
                  color: magnetBPoleLeft === "S" ? "#ffffff" : "#0F766E",
                  border: magnetBPoleLeft === "S" ? "none" : "1.5px solid #CCECE7",
                  boxShadow: magnetBPoleLeft === "S" ? "0 4px 12px rgba(244, 63, 94, 0.4)" : "none"
                }}
              >
                [S - N]
              </button>
            </div>
          </div>

          {/* Surface Friction */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", marginBottom: "0.4rem", color: "#115E59" }}>
              Surface Friction
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button 
                onClick={() => setHasPencils(true)} 
                style={{ 
                  flex: 1, 
                  padding: "0.55rem",
                  borderRadius: "10px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: hasPencils ? "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)" : "#ffffff",
                  color: hasPencils ? "#ffffff" : "#0F766E",
                  border: hasPencils ? "none" : "1.5px solid #CCECE7",
                  boxShadow: hasPencils ? "0 4px 12px rgba(244, 63, 94, 0.4)" : "none"
                }}
              >
                Pencils (Low)
              </button>
              <button 
                onClick={() => setHasPencils(false)} 
                style={{ 
                  flex: 1, 
                  padding: "0.55rem",
                  borderRadius: "10px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: !hasPencils ? "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)" : "#ffffff",
                  color: !hasPencils ? "#ffffff" : "#0F766E",
                  border: !hasPencils ? "none" : "1.5px solid #CCECE7",
                  boxShadow: !hasPencils ? "0 4px 12px rgba(244, 63, 94, 0.4)" : "none"
                }}
              >
                Table (High)
              </button>
            </div>
          </div>

          {/* Distance Slider */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", fontWeight: "700", marginBottom: "0.4rem", color: "#115E59" }}>
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
              style={{ width: "100%", accentColor: "#F43F5E" }} 
            />
          </div>

          <button 
            onClick={handleFinish} 
            style={{ 
              width: "100%", 
              padding: "0.85rem 1.5rem", 
              fontSize: "1rem", 
              fontWeight: 800, 
              borderRadius: "30px", 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              gap: "0.6rem",
              background: "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(244, 63, 94, 0.45)"
            }}
          >
            <CheckCircle2 size={18} color="#ffffff" /> Proceed to Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
