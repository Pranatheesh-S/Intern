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

            {/* 3D Magnet A Component */}
            <motion.div
              animate={{ x: hasPencils ? magnetAOffset - 120 : (polesMatch ? (distance < 50 ? -25 : 0) : (distance < 50 ? 25 : 0)) - 120 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              style={{
                position: "absolute",
                bottom: "140px",
                width: "240px",
                height: "55px",
                borderRadius: "12px",
                display: "flex",
                overflow: "hidden",
                border: "2px solid rgba(255,255,255,0.35)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
                zIndex: 2
              }}
            >
              {magnetAPoleRight === "S" ? (
                <>
                  <div style={{ flex: 1, background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 900, fontSize: "1.4rem" }}>N</div>
                  <div style={{ width: "4px", background: "linear-gradient(180deg, #FFFFFF 0%, #71717A 100%)", zIndex: 2 }} />
                  <div style={{ flex: 1, background: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 900, fontSize: "1.4rem" }}>S</div>
                </>
              ) : (
                <>
                  <div style={{ flex: 1, background: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 900, fontSize: "1.4rem" }}>S</div>
                  <div style={{ width: "4px", background: "linear-gradient(180deg, #FFFFFF 0%, #71717A 100%)", zIndex: 2 }} />
                  <div style={{ flex: 1, background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 900, fontSize: "1.4rem" }}>N</div>
                </>
              )}
            </motion.div>

            {/* 3D Magnet B Component */}
            <div
              style={{
                position: "absolute",
                bottom: "140px",
                left: `calc(50% + ${distance / 2}px)`,
                width: "240px",
                height: "55px",
                borderRadius: "12px",
                display: "flex",
                overflow: "hidden",
                border: "2px solid rgba(255,255,255,0.35)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
                zIndex: 2
              }}
            >
              {magnetBPoleLeft === "N" ? (
                <>
                  <div style={{ flex: 1, background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 900, fontSize: "1.4rem" }}>N</div>
                  <div style={{ width: "4px", background: "linear-gradient(180deg, #FFFFFF 0%, #71717A 100%)", zIndex: 2 }} />
                  <div style={{ flex: 1, background: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 900, fontSize: "1.4rem" }}>S</div>
                </>
              ) : (
                <>
                  <div style={{ flex: 1, background: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 900, fontSize: "1.4rem" }}>S</div>
                  <div style={{ width: "4px", background: "linear-gradient(180deg, #FFFFFF 0%, #71717A 100%)", zIndex: 2 }} />
                  <div style={{ flex: 1, background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 900, fontSize: "1.4rem" }}>N</div>
                </>
              )}
            </div>

            {/* Interaction Result Banner */}
            <div style={{
              position: "absolute",
              top: "15px",
              padding: "0.5rem 1.2rem",
              borderRadius: "20px",
              background: polesMatch ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)",
              border: `1.5px solid ${polesMatch ? "#EF4444" : "#22C55E"}`,
              color: polesMatch ? "#FCA5A5" : "#86EFAC",
              fontWeight: 800,
              fontSize: "0.92rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
            }}>
              {polesMatch ? "🔴 LIKE POLES REPEL (Push Away)" : "🟢 UNLIKE POLES ATTRACT (Pull Together)"}
            </div>

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
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#1e293b", lineHeight: "1.5" }}>
            <strong>Observation:</strong> {polesMatch ? "The magnets push away from each other when like poles are facing. Notice how the distance changes as they repel." : "The magnets pull toward each other when unlike poles are facing. The magnetic force acts across the gap."}
          </p>
        </div>
      </div>

      {/* Right Side: Midnight Carbon Controls Panel */}
      <div style={{ 
        flex: "0.85", 
        background: "rgba(24, 24, 27, 0.95)",
        backdropFilter: "blur(10px)",
        border: "1.5px solid #3F3F46",
        borderRadius: "20px",
        padding: "1.25rem 1.5rem",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        minWidth: 0, 
        overflowY: "auto" 
      }}>
        <div style={{ 
          padding: "1.15rem", 
          background: "#18181B", 
          border: "1.5px solid #3F3F46", 
          borderRadius: "16px",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)"
        }}>
          <h4 style={{ color: "#F59E0B", margin: "0 0 1rem 0", fontSize: "1.05rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Settings2 size={18} color="#F59E0B" /> Experiment Controls
          </h4>

          {/* Magnet A Orientation */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", marginBottom: "0.4rem", color: "#A1A1AA" }}>
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
                  fontWeight: 800,
                  cursor: "pointer",
                  background: magnetAPoleRight === "S" ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" : "#27272A",
                  color: magnetAPoleRight === "S" ? "#000000" : "#FAFAFA",
                  border: magnetAPoleRight === "S" ? "none" : "1.5px solid #3F3F46",
                  boxShadow: magnetAPoleRight === "S" ? "0 4px 12px rgba(245, 158, 11, 0.4)" : "none"
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
                  fontWeight: 800,
                  cursor: "pointer",
                  background: magnetAPoleRight === "N" ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" : "#27272A",
                  color: magnetAPoleRight === "N" ? "#000000" : "#FAFAFA",
                  border: magnetAPoleRight === "N" ? "none" : "1.5px solid #3F3F46",
                  boxShadow: magnetAPoleRight === "N" ? "0 4px 12px rgba(245, 158, 11, 0.4)" : "none"
                }}
              >
                [S - N]
              </button>
            </div>
          </div>

          {/* Magnet B Orientation */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", marginBottom: "0.4rem", color: "#A1A1AA" }}>
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
                  fontWeight: 800,
                  cursor: "pointer",
                  background: magnetBPoleLeft === "N" ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" : "#27272A",
                  color: magnetBPoleLeft === "N" ? "#000000" : "#FAFAFA",
                  border: magnetBPoleLeft === "N" ? "none" : "1.5px solid #3F3F46",
                  boxShadow: magnetBPoleLeft === "N" ? "0 4px 12px rgba(245, 158, 11, 0.4)" : "none"
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
                  fontWeight: 800,
                  cursor: "pointer",
                  background: magnetBPoleLeft === "S" ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" : "#27272A",
                  color: magnetBPoleLeft === "S" ? "#000000" : "#FAFAFA",
                  border: magnetBPoleLeft === "S" ? "none" : "1.5px solid #3F3F46",
                  boxShadow: magnetBPoleLeft === "S" ? "0 4px 12px rgba(245, 158, 11, 0.4)" : "none"
                }}
              >
                [S - N]
              </button>
            </div>
          </div>

          {/* Surface Friction */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", marginBottom: "0.4rem", color: "#A1A1AA" }}>
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
                  fontWeight: 800,
                  cursor: "pointer",
                  background: hasPencils ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" : "#27272A",
                  color: hasPencils ? "#000000" : "#FAFAFA",
                  border: hasPencils ? "none" : "1.5px solid #3F3F46",
                  boxShadow: hasPencils ? "0 4px 12px rgba(245, 158, 11, 0.4)" : "none"
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
                  fontWeight: 800,
                  cursor: "pointer",
                  background: !hasPencils ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" : "#27272A",
                  color: !hasPencils ? "#000000" : "#FAFAFA",
                  border: !hasPencils ? "none" : "1.5px solid #3F3F46",
                  boxShadow: !hasPencils ? "0 4px 12px rgba(245, 158, 11, 0.4)" : "none"
                }}
              >
                Table (High)
              </button>
            </div>
          </div>

          {/* Distance Slider */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", fontWeight: "700", marginBottom: "0.4rem", color: "#A1A1AA" }}>
              <span>Distance</span>
              <span style={{ color: "#F59E0B", fontWeight: 800 }}>{Math.round(distance)} px</span>
            </div>
            <input 
              type="range" 
              min="0" max="300" 
              value={distance} 
              onChange={(e) => setDistance(Number(e.target.value))}
              onPointerDown={() => setIsAdjustingDistance(true)}
              onPointerUp={() => setIsAdjustingDistance(false)}
              onPointerLeave={() => setIsAdjustingDistance(false)}
              style={{ width: "100%", accentColor: "#F59E0B" }} 
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
              background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
              color: "#000000",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(245, 158, 11, 0.4)"
            }}
          >
            <CheckCircle2 size={18} color="#000000" /> Proceed to Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
