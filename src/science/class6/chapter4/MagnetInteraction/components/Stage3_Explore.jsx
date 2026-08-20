import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, Info, CheckCircle2, Pause, Zap, Plane } from "lucide-react";
import FlightShape from "./FlightShape";

export default function Stage3_Explore({ onComplete, onNext }) {
  const [magnetAPoleLeft, setMagnetAPoleLeft] = useState("N"); // 'N' (Left Wing N, Right Wing S) or 'S' (Left Wing S, Right Wing N)
  const [magnetBPoleLeft, setMagnetBPoleLeft] = useState("N"); // 'N' (Left Wing N, Right Wing S) or 'S' (Left Wing S, Right Wing N)
  const [flightBPositionY, setFlightBPositionY] = useState(120); // Vertical Y position of Flight B (Manual Slider)
  const [isAutoFastRace, setIsAutoFastRace] = useState(false);

  // Facing wings between the two parallel white jet flights:
  // Flight A (Left Side) facing wing = Right Wing = (magnetAPoleLeft === 'N' ? 'S' : 'N')
  // Flight B (Right Side) facing wing = Left Wing = magnetBPoleLeft
  const facingWingA = magnetAPoleLeft === "N" ? "S" : "N";
  const facingWingB = magnetBPoleLeft;
  const polesMatch = facingWingA === facingWingB; // Like poles (N-N / S-S) repel; Unlike poles (N-S / S-N) attract

  // Vertical approach distance between Flight B (driven jet) and Flight A
  const approachDistance = Math.max(10, 300 - flightBPositionY);
  const isClose = approachDistance < 180;
  const forceMagnitude = isClose ? (180 - approachDistance) * 0.95 : 0;

  // Flight A vertical offset dynamics:
  let flightAOffsetY = 0;
  if (polesMatch) {
    flightAOffsetY = -forceMagnitude * 2.2;
  } else {
    flightAOffsetY = forceMagnitude * 1.5;
  }

  // Horizontal Airway Lane Positions based on Facing Wing Magnetic Poles:
  // - Same Facing Poles (Repel): Flights push further APART to outer sky corridors!
  // - Different Facing Poles (Attract): Flights pull CLOSER toward the center airway divider line!
  const redFlightLeftPos = polesMatch ? "calc(50% - 200px)" : "calc(50% - 128px)";
  const blueFlightLeftPos = polesMatch ? "calc(50% + 100px)" : "calc(50% + 28px)";

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
      {/* Left Side: Infinite Sky Flight Corridor Canvas Area */}
      <div style={{ flex: "2", display: "flex", flexDirection: "column", gap: "0.75rem", height: '100%', minHeight: 0, justifyContent: 'center' }}>
        
        {/* Top Header Container */}
        <div style={{ 
          width: '100%',
          textAlign: 'center',
          background: '#FFFFFF',
          padding: '0.65rem 1.25rem',
          borderRadius: '20px',
          border: '1.5px solid #A7F3D0',
          boxShadow: '0 4px 16px rgba(6, 78, 59, 0.06)',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 0.15rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#064E3B', letterSpacing: '-0.01em' }}>
              ✈️ Real Airplanes High-Sky Flight Navigation ⬆️
            </h3>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.88rem', fontWeight: 600 }}>
              Pristine White Aircraft: Left Wing = North (Red), Right Wing = South (Blue)! Test Wing Attraction & Repulsion in Flight.
            </p>
          </div>

          {/* Nitro Auto Fast Flight Toggle Button */}
          <button
            onClick={() => setIsAutoFastRace(!isAutoFastRace)}
            style={{
              padding: '0.65rem 1.35rem',
              borderRadius: '25px',
              border: 'none',
              background: isAutoFastRace ? 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
              transition: 'all 0.25s ease'
            }}
          >
            {isAutoFastRace ? <Pause size={18} color="#FFFFFF" /> : <Zap size={18} color="#FFFFFF" />}
            {isAutoFastRace ? "Pause Fast Flight" : "⚡ NITRO FAST FLIGHT ⬆️"}
          </button>
        </div>

        {/* Photorealistic Aerial Sky Canvas with Moving Clouds */}
        <div style={{ 
          position: "relative", 
          width: "100%", 
          maxWidth: "100%",
          flex: 1, 
          minHeight: "410px", 
          background: "linear-gradient(180deg, #0284C7 0%, #0369A1 40%, #075985 75%, #0C4A6E 100%)", // Aerial High Altitude Sky
          border: "1.5px solid #A7F3D0",
          borderRadius: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          boxShadow: "0 8px 25px rgba(6, 78, 59, 0.08)"
        }}>
          {/* Real Aerial Landscape Terrain Map Overlay underneath clouds */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 70%), radial-gradient(ellipse at 20% 80%, rgba(245, 158, 11, 0.12) 0%, transparent 60%)",
            filter: "blur(20px)",
            pointerEvents: "none",
            zIndex: 1
          }} />

          {/* Animated Photorealistic Fluffy Clouds Layer 1 (Drifting down during Flight) */}
          <motion.div
            animate={{ y: isAutoFastRace ? [0, 500] : 0 }}
            transition={{ duration: 1.1, repeat: isAutoFastRace ? Infinity : 0, ease: "linear" }}
            style={{
              position: "absolute",
              top: "-250px", left: "-60px", right: "-60px", bottom: "-250px",
              backgroundImage: `
                radial-gradient(circle at 25% 15%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.3) 30%, transparent 60%),
                radial-gradient(circle at 75% 45%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.25) 35%, transparent 65%),
                radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.2) 40%, transparent 70%)
              `,
              filter: "blur(4px)",
              pointerEvents: "none",
              zIndex: 2
            }}
          />

          {/* Animated Photorealistic Fluffy Clouds Layer 2 (Faster Upper Wispy Clouds) */}
          <motion.div
            animate={{ y: isAutoFastRace ? [0, 600] : 0 }}
            transition={{ duration: 0.8, repeat: isAutoFastRace ? Infinity : 0, ease: "linear" }}
            style={{
              position: "absolute",
              top: "-250px", left: "-60px", right: "-60px", bottom: "-250px",
              backgroundImage: `
                radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.6) 0%, transparent 50%),
                radial-gradient(circle at 15% 65%, rgba(255, 255, 255, 0.65) 0%, transparent 55%)
              `,
              filter: "blur(2px)",
              pointerEvents: "none",
              zIndex: 3
            }}
          />

          {/* Sky Airway Flight Corridor Boundaries & Center Divider */}
          <div style={{ position: "absolute", inset: "0 60px", borderLeft: "2px dashed rgba(255,255,255,0.45)", borderRight: "2px dashed rgba(255,255,255,0.45)", pointerEvents: "none", zIndex: 4 }} />
          
          {/* Animated Center Airway Dashed Divider */}
          <motion.div 
            animate={{ y: isAutoFastRace ? [0, 60] : 0 }}
            transition={{ duration: 0.18, repeat: isAutoFastRace ? Infinity : 0, ease: "linear" }}
            style={{ 
              position: "absolute", 
              left: "50%", 
              top: "-60px", 
              bottom: "-60px", 
              width: "3px", 
              background: "repeating-linear-gradient(0deg, #FFFFFF 0px 30px, transparent 30px 60px)",
              transform: "translateX(-50%)",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
              zIndex: 4
            }} 
          />

          {/* Vertical Supercars / Flights Track Container */}
          <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            
            {/* White Airplane Flight A (Left Side/Airway) */}
            <motion.div
              animate={{
                left: redFlightLeftPos,
                y: isAutoFastRace ? [-32, -28, -32] : (flightAOffsetY - 80)
              }}
              transition={
                isAutoFastRace 
                  ? { y: { duration: 0.15, repeat: Infinity, ease: "easeInOut" }, left: { type: "spring", stiffness: 120, damping: 14 } } 
                  : { type: "spring", stiffness: 130, damping: 14 }
              }
              style={{
                position: "absolute",
                zIndex: 10
              }}
            >
              <FlightShape 
                flightType="flightA" 
                poleLeft={magnetAPoleLeft} 
                width={240} 
                height={110} 
                isVertical={true}
              />

              {/* High-Speed Jet Contrail Exhaust Streams */}
              {isAutoFastRace && (
                <>
                  <div style={{ 
                    position: "absolute", 
                    bottom: "-50px", 
                    left: "calc(50% - 14px)", 
                    width: "8px", 
                    height: "55px", 
                    background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(239,68,68,0.7) 40%, transparent 100%)",
                    borderRadius: "4px",
                    filter: "blur(2px)",
                    boxShadow: "0 0 8px rgba(255,255,255,0.8)"
                  }} />
                  <div style={{ 
                    position: "absolute", 
                    bottom: "-50px", 
                    left: "calc(50% + 6px)", 
                    width: "8px", 
                    height: "55px", 
                    background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(239,68,68,0.7) 40%, transparent 100%)",
                    borderRadius: "4px",
                    filter: "blur(2px)",
                    boxShadow: "0 0 8px rgba(255,255,255,0.8)"
                  }} />
                </>
              )}

              <AnimatePresence>
                {isClose && !isAutoFastRace && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ 
                      position: "absolute", 
                      left: "-120px", 
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
                    {polesMatch ? "🚀 WINGS REPEL APART! ⬆️" : "🧲 WINGS ATTRACT CLOSER!"}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* White Airplane Flight B (Right Side/Airway) */}
            <motion.div
              animate={{
                left: blueFlightLeftPos,
                y: isAutoFastRace ? [-29, -31, -29] : (90 - flightBPositionY)
              }}
              transition={
                isAutoFastRace 
                  ? { y: { duration: 0.15, repeat: Infinity, ease: "easeInOut" }, left: { type: "spring", stiffness: 120, damping: 14 } } 
                  : { type: "spring", stiffness: 150, damping: 16 }
              }
              style={{
                position: "absolute",
                zIndex: 10
              }}
            >
              <FlightShape 
                flightType="flightB" 
                poleLeft={magnetBPoleLeft} 
                width={240} 
                height={110} 
                isVertical={true}
              />

              {/* High-Speed Jet Contrail Exhaust Streams */}
              {isAutoFastRace && (
                <>
                  <div style={{ 
                    position: "absolute", 
                    bottom: "-50px", 
                    left: "calc(50% - 14px)", 
                    width: "8px", 
                    height: "55px", 
                    background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(56,189,248,0.7) 40%, transparent 100%)",
                    borderRadius: "4px",
                    filter: "blur(2px)",
                    boxShadow: "0 0 8px rgba(255,255,255,0.8)"
                  }} />
                  <div style={{ 
                    position: "absolute", 
                    bottom: "-50px", 
                    left: "calc(50% + 6px)", 
                    width: "8px", 
                    height: "55px", 
                    background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(56,189,248,0.7) 40%, transparent 100%)",
                    borderRadius: "4px",
                    filter: "blur(2px)",
                    boxShadow: "0 0 8px rgba(255,255,255,0.8)"
                  }} />
                </>
              )}
            </motion.div>

            {/* Vertical Magnetic Force Rays connecting White Airplanes */}
            {isClose && !isAutoFastRace && (
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5 }}>
                <line 
                  x1={polesMatch ? "calc(50% - 145px)" : "calc(50% - 72px)"} 
                  y1={200 + flightAOffsetY} 
                  x2={polesMatch ? "calc(50% + 145px)" : "calc(50% + 72px)"} 
                  y2={340 - flightBPositionY} 
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
              background: isAutoFastRace ? "#FEF3C7" : (polesMatch ? "#FEE2E2" : "#DCFCE7"),
              border: `1.5px solid ${isAutoFastRace ? "#F59E0B" : (polesMatch ? "#EF4444" : "#16A34A")}`,
              color: isAutoFastRace ? "#92400E" : (polesMatch ? "#991B1B" : "#065F46"),
              fontWeight: 900,
              fontSize: "0.9rem",
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
              zIndex: 20
            }}>
              {isAutoFastRace 
                ? (polesMatch ? "⚡ HIGH-SKY FAST FLIGHT (SAME WINGS): White airplanes fly further APART through clouds! ⬆️" : "⚡ HIGH-SKY FAST FLIGHT (DIFFERENT WINGS): White airplanes fly CLOSER to center line! ⬆️")
                : (polesMatch ? "🔴 SAME FACING WING POLES REPEL: White airplanes move further APART across sky! ⬆️" : "🟢 DIFFERENT FACING WING POLES ATTRACT: White airplanes move CLOSER separated by center line!")}
            </div>

          </div>
        </div>
      </div>

      {/* Right Side: Sky Navigation Controls & Flight Observation Box at Top */}
      <div style={{ 
        flex: "0.85", 
        background: "#FFFFFF",
        border: "1.5px solid #A7F3D0",
        borderRadius: "20px",
        padding: "1rem 1.25rem",
        boxShadow: "0 6px 20px rgba(6, 78, 59, 0.06)",
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "flex-start", 
        minWidth: 0, 
        height: '100%',
        boxSizing: 'border-box',
        overflowY: "auto" 
      }}>
        {/* Flight Observation Box - Top of Right Side Container */}
        <div style={{ 
          background: "#F0FDF4", 
          border: "1.5px solid #A7F3D0", 
          padding: "0.85rem 1.15rem", 
          borderRadius: "16px", 
          display: "flex", 
          gap: "0.75rem", 
          alignItems: "flex-start",
          boxShadow: "0 2px 8px rgba(6, 78, 59, 0.04)",
          marginBottom: "0.85rem"
        }}>
          <Info size={22} color="#D97706" style={{ flexShrink: 0, marginTop: "2px" }} />
          <p style={{ margin: 0, fontSize: "0.88rem", color: "#334155", lineHeight: "1.5", fontWeight: 600 }}>
            <strong style={{ color: '#064E3B' }}>Flight Observation:</strong> White Airplane Body. Left Wing = <span style={{ color: '#EF4444', fontWeight: 900 }}>North (Red N)</span>, Right Wing = <span style={{ color: '#2563EB', fontWeight: 900 }}>South (Blue S)</span>. {polesMatch ? "Same facing wing poles REPEL! Airplanes push further APART to outer sky corridors!" : "Different facing wing poles ATTRACT! Airplanes pull CLOSER together separated by the center line!"}
          </p>
        </div>

        <div style={{ 
          padding: "1.15rem", 
          background: "#F0FDF4", 
          border: "1.5px solid #A7F3D0", 
          borderRadius: "16px",
          boxShadow: "0 2px 8px rgba(6, 78, 59, 0.04)",
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem"
        }}>
          <h4 style={{ color: "#064E3B", margin: 0, fontSize: "1.05rem", fontWeight: 900, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Settings2 size={18} color="#D97706" /> Sky Navigation Controls
          </h4>

          {/* Drive Jet Flight B Vertical Throttle */}
          <div style={{ background: "#FEF3C7", border: "1.5px solid #F59E0B", padding: "0.85rem", borderRadius: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", fontWeight: "900", marginBottom: "0.45rem", color: "#92400E" }}>
              <span>✈️ Fly White Airplane B UP ⬆️</span>
              <span>{Math.round(flightBPositionY)} px</span>
            </div>
            <input 
              type="range" 
              min="0" max="300" 
              value={flightBPositionY} 
              disabled={isAutoFastRace}
              onChange={(e) => setFlightBPositionY(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#D97706", cursor: isAutoFastRace ? "not-allowed" : "pointer" }} 
            />
            <div style={{ fontSize: "0.78rem", color: "#78350F", marginTop: "0.35rem", fontWeight: 700 }}>
              {isAutoFastRace ? "⚡ Nitro Fast Flight is active in sky!" : "Drag throttle upward to fly Airplane B into Flight A!"}
            </div>
          </div>

          {/* Flight A Wing Magnetic Poles */}
          <div>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "800", marginBottom: "0.4rem", color: "#334155" }}>
              Flight A Wing Poles [Left Wing - Right Wing]
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button 
                onClick={() => setMagnetAPoleLeft("N")} 
                style={{ 
                  flex: 1, 
                  padding: "0.55rem",
                  borderRadius: "12px",
                  fontSize: "0.88rem",
                  fontWeight: 900,
                  cursor: "pointer",
                  background: magnetAPoleLeft === "N" ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" : "#FFFFFF",
                  color: magnetAPoleLeft === "N" ? "#FFFFFF" : "#1E293B",
                  border: magnetAPoleLeft === "N" ? "none" : "1.5px solid #CBD5E1",
                  boxShadow: magnetAPoleLeft === "N" ? "0 4px 14px rgba(217, 119, 6, 0.35)" : "none"
                }}
              >
                🔴 Left (N) - 🔵 Right (S)
              </button>
              <button 
                onClick={() => setMagnetAPoleLeft("S")} 
                style={{ 
                  flex: 1, 
                  padding: "0.55rem",
                  borderRadius: "12px",
                  fontSize: "0.88rem",
                  fontWeight: 900,
                  cursor: "pointer",
                  background: magnetAPoleLeft === "S" ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" : "#FFFFFF",
                  color: magnetAPoleLeft === "S" ? "#FFFFFF" : "#1E293B",
                  border: magnetAPoleLeft === "S" ? "none" : "1.5px solid #CBD5E1",
                  boxShadow: magnetAPoleLeft === "S" ? "0 4px 14px rgba(217, 119, 6, 0.35)" : "none"
                }}
              >
                🔵 Left (S) - 🔴 Right (N)
              </button>
            </div>
          </div>

          {/* Flight B Wing Magnetic Poles */}
          <div>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "800", marginBottom: "0.4rem", color: "#334155" }}>
              Flight B Wing Poles [Left Wing - Right Wing]
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button 
                onClick={() => setMagnetBPoleLeft("N")} 
                style={{ 
                  flex: 1, 
                  padding: "0.55rem",
                  borderRadius: "12px",
                  fontSize: "0.88rem",
                  fontWeight: 900,
                  cursor: "pointer",
                  background: magnetBPoleLeft === "N" ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" : "#FFFFFF",
                  color: magnetBPoleLeft === "N" ? "#FFFFFF" : "#1E293B",
                  border: magnetBPoleLeft === "N" ? "none" : "1.5px solid #CBD5E1",
                  boxShadow: magnetBPoleLeft === "N" ? "0 4px 14px rgba(217, 119, 6, 0.35)" : "none"
                }}
              >
                🔴 Left (N) - 🔵 Right (S)
              </button>
              <button 
                onClick={() => setMagnetBPoleLeft("S")} 
                style={{ 
                  flex: 1, 
                  padding: "0.55rem",
                  borderRadius: "12px",
                  fontSize: "0.88rem",
                  fontWeight: 900,
                  cursor: "pointer",
                  background: magnetBPoleLeft === "S" ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" : "#FFFFFF",
                  color: magnetBPoleLeft === "S" ? "#FFFFFF" : "#1E293B",
                  border: magnetBPoleLeft === "S" ? "none" : "1.5px solid #CBD5E1",
                  boxShadow: magnetBPoleLeft === "S" ? "0 4px 14px rgba(217, 119, 6, 0.35)" : "none"
                }}
              >
                🔵 Left (S) - 🔴 Right (N)
              </button>
            </div>
          </div>

          <button 
            onClick={handleFinish} 
            style={{ 
              width: "100%", 
              padding: "0.85rem 1.5rem", 
              fontSize: "0.95rem", 
              fontWeight: 900, 
              borderRadius: "25px", 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              gap: "0.6rem",
              background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(217, 119, 6, 0.35)",
              marginTop: "0.4rem"
            }}
          >
            <CheckCircle2 size={18} color="#FFFFFF" /> Proceed to Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
