import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, Info, CheckCircle2, Play, Pause, Zap, ArrowUp } from "lucide-react";
import SupercarShape from "./SupercarShape";

export default function Stage3_Explore({ onComplete, onNext }) {
  const [magnetAPoleRight, setMagnetAPoleRight] = useState("S"); // S or N
  const [magnetBPoleLeft, setMagnetBPoleLeft] = useState("N");   // N or S
  const [carBPositionY, setCarBPositionY] = useState(120);       // Vertical Y position of Supercar B (0 to 300px)
  const [isAutoFastRace, setIsAutoFastRace] = useState(false);

  const polesMatch = magnetAPoleRight === magnetBPoleLeft; // Like poles (N-N / S-S) repel; Unlike poles (N-S / S-N) attract

  // Auto Fast Race Loop: Automatically drives Supercar B fast upwards when active!
  useEffect(() => {
    let timer = null;
    if (isAutoFastRace) {
      timer = setInterval(() => {
        setCarBPositionY((prev) => {
          if (prev >= 290) return 0; // Loop around track
          return prev + 6; // Move fast upwards!
        });
      }, 30);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoFastRace]);

  // Vertical approach distance between Supercar B (driven car) and Supercar A
  const approachDistance = Math.max(10, 300 - carBPositionY);
  const isClose = approachDistance < 180;
  const forceMagnitude = isClose ? (180 - approachDistance) * 0.95 : 0;

  // Car A vertical offset dynamics:
  // 1. Same Poles (Repel): As Car B drives fast upwards, Car A is pushed fast upwards ahead ("travel along")!
  // 2. Different Poles (Attract): As Car B backs down, Car A is pulled down toward Car B across distance!
  let carAOffsetY = 0;
  if (polesMatch) {
    // Repulsion pushes Supercar A fast upwards ahead
    carAOffsetY = -forceMagnitude * 2.2;
  } else {
    // Attraction pulls Supercar A downwards toward Supercar B
    carAOffsetY = forceMagnitude * 1.5;
  }

  const handleFinish = () => {
    onComplete();
    onNext();
  };

  return (
    <div style={{ 
      padding: '0.5rem 1rem', 
      display: 'flex', 
      gap: '1.25rem', 
      height: '100%', 
      minHeight: 0, 
      overflow: 'hidden', 
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent'
    }}>
      {/* Left Side: Vertical Race Track Canvas Area */}
      <div style={{ flex: "1.75", display: "flex", flexDirection: "column", gap: "0.75rem", height: '100%', minHeight: 0, justifyContent: 'center' }}>
        
        {/* Top Header Container */}
        <div style={{ 
          width: '100%',
          textAlign: 'center',
          background: 'rgba(24, 24, 27, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '0.5rem 1rem',
          borderRadius: '16px',
          border: '1.5px solid #3F3F46',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 0.15rem 0', fontSize: '1.35rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '-0.01em' }}>
              🏎️ Vertical Supercars Race ⬆️
            </h3>
            <p style={{ margin: 0, color: '#A1A1AA', fontSize: '0.88rem', fontWeight: 700 }}>
              Supercars face vertically UPWARD! Test Same Poles (Travel Along) vs Different Poles (Attract Across Distance).
            </p>
          </div>

          {/* Nitro Auto Fast Race Toggle Button */}
          <button
            onClick={() => setIsAutoFastRace(!isAutoFastRace)}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '25px',
              border: 'none',
              background: isAutoFastRace ? 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: isAutoFastRace ? '#FFFFFF' : '#000000',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
              transition: 'all 0.25s ease'
            }}
          >
            {isAutoFastRace ? <Pause size={18} color="#FFFFFF" /> : <Zap size={18} color="#000000" />}
            {isAutoFastRace ? "Pause Fast Race" : "⚡ NITRO FAST RACE ⬆️"}
          </button>
        </div>

        {/* Vertical Race Track Canvas */}
        <div style={{ 
          position: "relative", 
          width: "100%", 
          maxWidth: "100%",
          flex: 1, 
          minHeight: "310px", 
          background: "#090D16",
          border: "2px solid #3F3F46",
          borderRadius: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.75)"
        }}>
          {/* Vertical Asphalt Track Surface */}
          <div style={{ 
            position: "absolute", 
            inset: "0 140px", 
            background: "#1E293B", 
            borderLeft: "4px dashed #F59E0B", 
            borderRight: "4px dashed #F59E0B",
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.8)"
          }} />

          {/* Vertical Center Lane Markings */}
          <div style={{ 
            position: "absolute", 
            left: "50%", 
            top: 0, 
            bottom: 0, 
            width: "2px", 
            borderLeft: "3px dashed rgba(255,255,255,0.4)" 
          }} />

          {/* Checkered Finish Banner at Top 🏁 */}
          <div style={{
            position: "absolute",
            top: "16px",
            left: "140px",
            right: "140px",
            height: "22px",
            background: "repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 12px 12px",
            borderBottom: "2px solid #FFF",
            boxShadow: "0 4px 10px rgba(0,0,0,0.6)"
          }} />

          {/* Vertical Supercars Track Container */}
          <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            
            {/* Lightning Supercar A (Facing Vertically UPWARD ⬆️ with Driver Man) */}
            <motion.div
              animate={{ y: carAOffsetY - 80 }}
              transition={{ type: "spring", stiffness: 130, damping: 14 }}
              style={{
                position: "absolute",
                zIndex: 10
              }}
            >
              <SupercarShape 
                carType="supercarA" 
                poleRight={magnetAPoleRight} 
                width={230} 
                height={96} 
                isVertical={true}
              />

              <AnimatePresence>
                {isClose && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ 
                      position: "absolute", 
                      right: "-110px", 
                      top: "50%", 
                      transform: "translateY(-50%)", 
                      background: polesMatch ? "rgba(239, 68, 68, 0.95)" : "rgba(34, 197, 94, 0.95)", 
                      padding: "4px 10px", 
                      borderRadius: "10px", 
                      color: "#FFF", 
                      fontSize: "11px", 
                      fontWeight: "900", 
                      whiteSpace: "nowrap",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
                    }}
                  >
                    {polesMatch ? "🚀 TRAVEL ALONG FAST! ⬆️" : "🧲 PULLED BACKWARD!"}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Nitro Supercar B (Player Driven Supercar Facing Vertically UPWARD ⬆️) */}
            <motion.div
              animate={{ y: 90 - carBPositionY }}
              transition={{ type: "spring", stiffness: 150, damping: 16 }}
              style={{
                position: "absolute",
                zIndex: 10
              }}
            >
              <SupercarShape 
                carType="supercarB" 
                poleRight={magnetBPoleLeft === 'N' ? 'S' : 'N'} 
                width={230} 
                height={96} 
                isVertical={true}
              />
            </motion.div>

            {/* Vertical Magnetic Force Rays when cars approach */}
            {isClose && (
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5 }}>
                <line 
                  x1="50%" 
                  y1={200 + carAOffsetY} 
                  x2="50%" 
                  y2={340 - carBPositionY} 
                  stroke={polesMatch ? "#EF4444" : "#22C55E"} 
                  strokeWidth="4" 
                  strokeDasharray="8 6" 
                />
              </svg>
            )}

            {/* Status Banner */}
            <div style={{
              position: "absolute",
              bottom: "12px",
              padding: "0.5rem 1.2rem",
              borderRadius: "20px",
              background: polesMatch ? "rgba(239, 68, 68, 0.25)" : "rgba(34, 197, 94, 0.25)",
              border: `1.5px solid ${polesMatch ? "#EF4444" : "#22C55E"}`,
              color: polesMatch ? "#FCA5A5" : "#86EFAC",
              fontWeight: 800,
              fontSize: "0.9rem",
              boxShadow: "0 4px 14px rgba(0,0,0,0.6)"
            }}>
              {polesMatch ? "🔴 SAME POLES REPEL: Supercar A travels along fast UPWARD! ⬆️" : "🟢 DIFFERENT POLES ATTRACT: Supercar A is pulled backward across distance!"}
            </div>

          </div>
        </div>

        {/* Real-time Observation Box */}
        <div style={{ 
          background: "#18181B", 
          border: "1.5px solid #3F3F46", 
          padding: "0.85rem 1.25rem", 
          borderRadius: "16px", 
          display: "flex", 
          gap: "0.75rem", 
          alignItems: "flex-start",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)"
        }}>
          <Info size={22} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
          <p style={{ margin: 0, fontSize: "0.92rem", color: "#FAFAFA", lineHeight: "1.5", fontWeight: 600 }}>
            <strong style={{ color: '#F59E0B' }}>Race Observation:</strong> {polesMatch ? "Same magnetic poles REPEL! As Nitro Supercar B speeds upward fast, the magnetic push propels Lightning Supercar A (with Driver Man) fast upward ahead together ('travel along')!" : "Different magnetic poles ATTRACT! As Nitro Supercar B backs down, magnetic attraction pulls Lightning Supercar A backward sticking across the distance!"}
          </p>
        </div>
      </div>

      {/* Right Side: Midnight Carbon Vertical Race Controls */}
      <div style={{ 
        flex: "0.75", 
        background: "rgba(24, 24, 27, 0.95)",
        backdropFilter: "blur(10px)",
        border: "1.5px solid #3F3F46",
        borderRadius: "20px",
        padding: "1rem 1.25rem",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        minWidth: 0, 
        height: '100%',
        boxSizing: 'border-box',
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
            <Settings2 size={18} color="#F59E0B" /> Vertical Race Controls
          </h4>

          {/* Drive Supercar B Vertical Throttle */}
          <div style={{ marginBottom: "1.3rem", background: "rgba(245, 158, 11, 0.1)", border: "1.5px solid #F59E0B", padding: "0.85rem", borderRadius: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", fontWeight: "800", marginBottom: "0.45rem", color: "#F59E0B" }}>
              <span>🏎️ Drive Supercar B UP ⬆️</span>
              <span>{Math.round(carBPositionY)} px</span>
            </div>
            <input 
              type="range" 
              min="0" max="300" 
              value={carBPositionY} 
              onChange={(e) => setCarBPositionY(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#F59E0B" }} 
            />
            <div style={{ fontSize: "0.75rem", color: "#A1A1AA", marginTop: "0.35rem", fontWeight: 700 }}>
              Drag throttle upward to drive Nitro Supercar B into Supercar A!
            </div>
          </div>

          {/* Supercar A Magnet Pole */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", marginBottom: "0.4rem", color: "#A1A1AA" }}>
              Supercar A Magnet Pole
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

          {/* Supercar B Magnet Pole */}
          <div style={{ marginBottom: "1.4rem" }}>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "700", marginBottom: "0.4rem", color: "#A1A1AA" }}>
              Supercar B Magnet Pole
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
                  boxShadow: magnetBPoleLeft === "N" ? "0 4px 14px rgba(245, 158, 11, 0.4)" : "none"
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
                  boxShadow: magnetBPoleLeft === "S" ? "0 4px 14px rgba(245, 158, 11, 0.4)" : "none"
                }}
              >
                [S - N]
              </button>
            </div>
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
