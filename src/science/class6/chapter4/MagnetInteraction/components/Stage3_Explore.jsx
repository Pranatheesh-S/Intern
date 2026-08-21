import React, { useState } from "react";
import { Settings2, Info, CheckCircle2, Pause, Zap } from "lucide-react";
import CinematicSkyFlightCanvas from "./CinematicSkyFlightCanvas";

export default function Stage3_Explore({ onComplete, onNext }) {
  // Two pole modes: "same" (Like Poles - Repel) or "different" (Unlike Poles - Attract & Crash)
  const [interactionMode, setInteractionMode] = useState("same");
  const [isAutoFastRace, setIsAutoFastRace] = useState(false);

  const polesMatch = interactionMode === "same";
  const facingWingA = "S";
  const facingWingB = interactionMode === "same" ? "S" : "N";

  const handleSelectMode = (mode) => {
    setInteractionMode(mode);
  };

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
      {/* Left Side: Cinematic 3D Flight Simulation Canvas */}
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
              ✈️ Photorealistic Airliner Flight Simulation ⬆️
            </h3>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.88rem', fontWeight: 600 }}>
              Authentic 3D Flight Dynamics: Like poles repel into wide outer corridors; Unlike poles attract and collide mid-air!
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

        {/* Cinematic Sunset Cloud Ocean & Realistic 3D Flight Simulation Canvas */}
        <div style={{ 
          position: "relative", 
          width: "100%", 
          maxWidth: "100%",
          flex: 1, 
          minHeight: "410px", 
          background: "#020617", 
          border: "1.5px solid #A7F3D0",
          borderRadius: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          boxShadow: "0 10px 35px rgba(6, 78, 59, 0.15)"
        }}>
          <CinematicSkyFlightCanvas 
            interactionMode={interactionMode}
            isAutoFastRace={isAutoFastRace}
            polesMatch={polesMatch}
          />

          {/* Status Banner at Bottom of Canvas */}
          <div style={{
            position: "absolute",
            bottom: "14px",
            padding: "0.55rem 1.35rem",
            borderRadius: "20px",
            background: polesMatch ? "rgba(220, 252, 231, 0.95)" : "rgba(254, 226, 226, 0.95)",
            backdropFilter: "blur(8px)",
            border: `1.5px solid ${polesMatch ? "#16A34A" : "#EF4444"}`,
            color: polesMatch ? "#065F46" : "#991B1B",
            fontWeight: 900,
            fontSize: "0.92rem",
            boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
            zIndex: 30
          }}>
            {polesMatch 
              ? "🟢 SAME FACING WINGS (S ↔ S): Aerodynamic repulsion banks airliners apart into wide safety corridors! ⬆️" 
              : "💥 DIFFERENT FACING WINGS (S ↔ N): Magnetic pull forces high-speed mid-air collision & uncontrolled spin!"}
          </div>
        </div>
      </div>

      {/* Right Side: Sky Navigation Controls & Flight Observation Box */}
      <div style={{ 
        flex: "0.85", 
        background: "#FFFFFF",
        border: "1.5px solid #A7F3D0",
        borderRadius: "20px",
        padding: "1.1rem 1.25rem",
        boxShadow: "0 6px 20px rgba(6, 78, 59, 0.06)",
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "flex-start", 
        minWidth: 0, 
        height: '100%',
        boxSizing: 'border-box',
        overflowY: "auto" 
      }}>
        {/* Flight Observation Box */}
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
            <strong style={{ color: '#064E3B' }}>Flight Observation:</strong> Facing wings: Airliner A Right Wing (<span style={{ color: facingWingA === 'N' ? '#EF4444' : '#2563EB', fontWeight: 900 }}>{facingWingA}</span>) vs Airliner B Left Wing (<span style={{ color: facingWingB === 'N' ? '#EF4444' : '#2563EB', fontWeight: 900 }}>{facingWingB}</span>). {polesMatch ? "Like poles REPEL! Both aircraft bank outward with realistic aerodynamics and fly in separated lanes." : "Unlike poles ATTRACT! Magnetic pull draws the airliners together leading to mid-air wing contact & friction sparks!"}
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
          gap: "0.95rem"
        }}>
          <h4 style={{ color: "#064E3B", margin: 0, fontSize: "1.05rem", fontWeight: 900, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Settings2 size={18} color="#D97706" /> Sky Navigation Controls
          </h4>

          {/* Drive Jet Flight B Vertical Throttle (Function disabled alone, preserved in UI) */}
          <div style={{ background: "#FEF3C7", border: "1.5px solid #F59E0B", padding: "0.85rem", borderRadius: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", fontWeight: "900", marginBottom: "0.45rem", color: "#92400E" }}>
              <span>✈️ Fly White Airplane B UP ⬆️</span>
              <span style={{ background: "#FDE68A", padding: "2px 8px", borderRadius: "6px" }}>93 px</span>
            </div>
            <input 
              type="range" 
              min="0" max="300" 
              value={93} 
              disabled={true}
              style={{ width: "100%", accentColor: "#D97706", cursor: "not-allowed", opacity: 0.65 }} 
            />
            <div style={{ fontSize: "0.78rem", color: "#78350F", marginTop: "0.35rem", fontWeight: 700 }}>
              Drag throttle upward to fly Airplane B into Flight A!
            </div>
          </div>

          {/* ONLY TWO BUTTONS: Same Poles vs Different Poles */}
          <div>
            <label style={{ display: "block", fontSize: "0.92rem", fontWeight: "900", marginBottom: "0.55rem", color: "#064E3B" }}>
              Magnetic Pole Interaction Mode:
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              <button 
                onClick={() => handleSelectMode("same")} 
                style={{ 
                  width: "100%", 
                  padding: "0.85rem 1rem",
                  borderRadius: "14px",
                  fontSize: "0.95rem",
                  fontWeight: 900,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: interactionMode === "same" ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" : "#FFFFFF",
                  color: interactionMode === "same" ? "#FFFFFF" : "#1E293B",
                  border: interactionMode === "same" ? "none" : "1.5px solid #CBD5E1",
                  boxShadow: interactionMode === "same" ? "0 4px 14px rgba(16, 185, 129, 0.35)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <span>🛡️ Same Poles</span>
                <span style={{ fontSize: "0.82rem", opacity: 0.9, background: interactionMode === "same" ? "rgba(255,255,255,0.25)" : "#F1F5F9", padding: "2px 8px", borderRadius: "8px" }}>
                  Repels Apart ⬅️ ➡️
                </span>
              </button>

              <button 
                onClick={() => handleSelectMode("different")} 
                style={{ 
                  width: "100%", 
                  padding: "0.85rem 1rem",
                  borderRadius: "14px",
                  fontSize: "0.95rem",
                  fontWeight: 900,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: interactionMode === "different" ? "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)" : "#FFFFFF",
                  color: interactionMode === "different" ? "#FFFFFF" : "#1E293B",
                  border: interactionMode === "different" ? "none" : "1.5px solid #CBD5E1",
                  boxShadow: interactionMode === "different" ? "0 4px 14px rgba(239, 68, 68, 0.35)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <span>💥 Different Poles</span>
                <span style={{ fontSize: "0.82rem", opacity: 0.9, background: interactionMode === "different" ? "rgba(255,255,255,0.25)" : "#F1F5F9", padding: "2px 8px", borderRadius: "8px" }}>
                  Attracts & Collides 💥
                </span>
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
