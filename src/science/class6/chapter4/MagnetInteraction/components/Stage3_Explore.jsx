import React, { useState } from "react";
import { Info, CheckCircle2 } from "lucide-react";
import CinematicSkyFlightCanvas from "./CinematicSkyFlightCanvas";

export default function Stage3_Explore({ onComplete, onNext }) {
  // Two pole modes: "same" (Like Poles - Repel) or "different" (Unlike Poles - Attract & Crash)
  const [interactionMode, setInteractionMode] = useState("same");
  const [isRunning, setIsRunning] = useState(true);
  const [hasTestedSame, setHasTestedSame] = useState(false);
  const [hasTestedDifferent, setHasTestedDifferent] = useState(false);

  const polesMatch = interactionMode === "same";

  const handleSelectMode = (mode) => {
    setInteractionMode(mode);
    if (mode === "same") setHasTestedSame(true);
    if (mode === "different") setHasTestedDifferent(true);
  };

  const handleFinish = () => {
    onComplete();
    onNext();
  };

  return (
    <div style={{ 
      padding: '0.5rem 1rem', 
      display: 'grid', 
      gridTemplateColumns: '1fr 340px',
      gap: '1rem', 
      height: '100%', 
      minHeight: 0, 
      overflow: 'hidden', 
      boxSizing: 'border-box',
      background: 'transparent'
    }}>
      {/* Left Side: Maximized Flight Simulation Canvas */}
      <div style={{ display: "flex", flexDirection: "column", height: '100%', minHeight: 0, width: '100%' }}>
        {/* Full-Height Flight Simulation Canvas */}
        <div style={{ 
          position: "relative", 
          width: "100%", 
          height: "100%",
          flex: 1, 
          minHeight: 0, 
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
            isRunning={isRunning}
            polesMatch={polesMatch}
          />
        </div>
      </div>

      {/* Right Side: Compact Flight Simulation Controls Container */}
      <div style={{ 
        width: "340px", 
        background: "#FFFFFF",
        border: "1.5px solid #A7F3D0",
        borderRadius: "20px",
        padding: "1rem 1.15rem",
        boxShadow: "0 6px 20px rgba(6, 78, 59, 0.06)",
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "flex-start", 
        minWidth: 0, 
        height: '100%',
        boxSizing: 'border-box',
        overflowY: "auto",
        gap: "0.75rem"
      }}>
        {/* Status Banner with Larger Text */}
        <div style={{
          width: "100%",
          padding: "1rem 1.15rem",
          borderRadius: "16px",
          background: polesMatch ? "#DCFCE7" : "#FEE2E2",
          border: `1.5px solid ${polesMatch ? "#16A34A" : "#EF4444"}`,
          color: polesMatch ? "#065F46" : "#991B1B",
          fontWeight: 900,
          fontSize: "1.05rem",
          lineHeight: 1.4,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          boxSizing: "border-box",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {polesMatch 
            ? "🟢 SAME POLES: Flights approach from left & right — Like poles (N + N) repel, executing left & right cross-turns!" 
            : "💥 DIFFERENT POLES: In-line flight from left to right — Opposite poles (N + S) attract in a straight line!"}
        </div>

        {/* Step-by-Step Interactive Guidance Card */}
        <div style={{
          padding: "0.85rem 1rem",
          background: "#F0FDF4",
          border: "1.5px solid #A7F3D0",
          borderRadius: "14px",
          boxShadow: "0 2px 6px rgba(6, 78, 59, 0.04)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.3rem" }}>
            <Info size={18} color="#065F46" />
            <span style={{ fontSize: "0.92rem", fontWeight: 900, color: "#064E3B" }}>📋 Step Instructions</span>
          </div>
          <p style={{ margin: 0, fontSize: "0.84rem", color: "#334155", lineHeight: "1.45", fontWeight: 700 }}>
            {!hasTestedSame && !hasTestedDifferent && (
              <span>👉 <strong>Step 1:</strong> Select <strong>Same Poles</strong> to observe magnetic wing repulsion into separate corridors!</span>
            )}
            {hasTestedSame && !hasTestedDifferent && (
              <span>👉 <strong>Step 2:</strong> Now select <strong>Different Poles</strong> to observe magnetic attraction & mid-air contact!</span>
            )}
            {hasTestedDifferent && !hasTestedSame && (
              <span>👉 <strong>Step 2:</strong> Now select <strong>Same Poles</strong> to observe magnetic wing repulsion into separate corridors!</span>
            )}
            {hasTestedSame && hasTestedDifferent && (
              <span>🎉 <strong>All Explored!</strong> You have tested both magnetic modes. Click <strong>Proceed to Quiz</strong> below!</span>
            )}
          </p>
        </div>

        {/* Controls Container in Exact Order */}
        <div style={{ 
          padding: "1rem", 
          background: "#F0FDF4", 
          border: "1.5px solid #A7F3D0", 
          borderRadius: "16px",
          boxShadow: "0 2px 8px rgba(6, 78, 59, 0.04)",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem"
        }}>
          {/* 1. Start / Stop Flight Animation Button */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              borderRadius: '14px',
              border: 'none',
              background: isRunning 
                ? 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' 
                : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '0.96rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: isRunning 
                ? '0 4px 14px rgba(239, 68, 68, 0.35)' 
                : '0 4px 14px rgba(16, 185, 129, 0.35)',
              transition: 'all 0.25s ease'
            }}
          >
            {isRunning ? "⏸️ Stop Flight Animation" : "▶️ Start Flight Animation"}
          </button>

          {/* 2. Same Poles Button */}
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

          {/* 3. Different Poles Button */}
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

        {/* Proceed to Quiz Button */}
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
            marginTop: "auto",
            transition: "all 0.2s ease"
          }}
        >
          <CheckCircle2 size={18} color="#FFFFFF" /> Proceed to Quiz
        </button>
      </div>
    </div>
  );
}
