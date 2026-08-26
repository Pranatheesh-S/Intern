import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCcw } from "lucide-react";

import paperImg      from "../../../../../assets/paper image.webp";
import cardboardImg  from "../../../../../assets/cardboard image.jpg";
import woodImg       from "../../../../../assets/wood image.webp";
import copperWireImg from "../../../../../assets/copperwire image.webp";
import aluminiumImg  from "../../../../../assets/aluminiumrod image.webp";
import steelSpoonImg from "../../../../../assets/steelspoon image.webp";

const MATERIALS = [
  { id: "paper",     name: "Paper",         img: paperImg,      isShiny: false,
    shineFact: "Paper has a rough, fibrous surface that scatters light in all directions — no clear reflection." },
  { id: "cardboard", name: "Cardboard",     img: cardboardImg,  isShiny: false,
    shineFact: "Cardboard is coarse and uneven. Light scatters off it without forming a sharp reflection." },
  { id: "wood",      name: "Wood",          img: woodImg,       isShiny: false,
    shineFact: "Wood has a rough, porous surface. It absorbs and diffuses light rather than reflecting it clearly." },
  { id: "copper",    name: "Copper Wire",   img: copperWireImg, isShiny: true,
    shineFact: "Copper is a metal with a smooth surface. It reflects light sharply, producing a clear bright spot." },
  { id: "aluminium", name: "Aluminium Rod", img: aluminiumImg,  isShiny: true,
    shineFact: "Aluminium is a lustrous metal. Its polished surface reflects light strongly and clearly." },
  { id: "steel",     name: "Steel Spoon",   img: steelSpoonImg, isShiny: true,
    shineFact: "Stainless steel has a very smooth metallic surface that reflects light clearly — it is lustrous." },
];

const SHINY_IDS = new Set(MATERIALS.filter(m => m.isShiny).map(m => m.id));

// ── Torch observation modal ────────────────────────────────────────────────────
const TorchObservation = ({ mat, onDone }) => {
  const [torchOn, setTorchOn] = useState(false);
  const [hasObserved, setHasObserved] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleToggle = (isOn) => {
    setTorchOn(isOn);
    if (isOn) setHasObserved(true);
  };
  
  const handleSubmit = () => { if (answer) setSubmitted(true); };
  const correct = answer === (mat.isShiny ? "shiny" : "dull");

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      borderRadius: 16, overflow: "hidden",
      background: "#181512",
      border: "1px solid rgba(255,255,255,0.05)",
      boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
    }}>
      {/* Header */}
      <div style={{
        padding: "1rem 1.5rem",
        background: "transparent",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
      }}>
        <span style={{ fontSize: "2rem" }}>🔦</span>
        <div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fde68a", letterSpacing: "0.5px" }}>
            Investigating: {mat.name}
          </div>
          <div style={{ fontSize: "1.2rem", color: "#b8a898", marginTop: 4 }}>
            {hasObserved ? "✓ Observed! Now classify the surface." : "Use the torch to test how light reflects."}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        
        {/* Left: Investigation Area */}
        <div style={{ flex: 1, position: "relative", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div style={{
            position: "relative", flex: 1, width: "100%", minHeight: 0,
            borderRadius: 12, overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
            background: "#000000", display: "flex", justifyContent: "center", alignItems: "center"
          }}>
            <img src={mat.img} alt={mat.name} draggable="false" style={{
              width: "100%", height: "100%", objectFit: "contain",
              filter: torchOn ? "brightness(0.95)" : "brightness(0.5)",
              transition: "filter 0.2s",
            }} />

            {/* Fixed Torch Icon at Top Center */}
            <div style={{
              position: "absolute", top: 0, left: "50%",
              transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center",
              zIndex: 20,
              filter: torchOn
                ? "drop-shadow(0 4px 12px rgba(255,244,100,0.5))"
                : "drop-shadow(0 2px 6px rgba(0,0,0,0.7))",
              transition: "filter 0.2s",
            }}>
              {/* Torch Handle */}
              <div style={{
                width: 20, height: 35,
                background: "linear-gradient(to right, #334155, #64748b, #334155)",
                borderBottom: "2px solid #1e293b",
              }} />
              {/* Torch Head */}
              <div style={{
                width: 44, height: 22,
                background: "linear-gradient(to right, #475569, #94a3b8, #475569)",
                clipPath: "polygon(25% 0, 75% 0, 100% 100%, 0 100%)",
                borderBottom: torchOn ? "3px solid #fef08a" : "3px solid #334155",
              }} />
            </div>

            {/* Light beam from top-center */}
            {torchOn && (
              <div style={{
                position: "absolute", top: 57, left: "50%",
                width: "100%", height: "calc(100% - 57px)", transform: "translateX(-50%)",
                background: "linear-gradient(to bottom, rgba(255,244,180,0.5) 0%, rgba(255,230,120,0.15) 60%, transparent 100%)",
                pointerEvents: "none",
                clipPath: "polygon(44% 0%, 56% 0%, 90% 100%, 10% 100%)",
                zIndex: 10,
              }} />
            )}

            {torchOn && (
              <>
                {/* Torch light effect branches based on material property */}
                {mat.isShiny ? (
                  <>
                    {/* Sharp bright spot for shiny objects */}
                    <div style={{
                      position: "absolute", top: "55%", left: "50%",
                      width: "30%", paddingBottom: "30%", borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,240,0.5) 20%, transparent 60%)",
                      transform: "translate(-50%,-50%)",
                      filter: "blur(1px)", pointerEvents: "none", zIndex: 15,
                    }} />
                    {/* Directional reflected light beam for shiny objects */}
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                      style={{
                        position: "absolute", top: "55%", left: "50%",
                        width: "120px", height: "450px",
                        background: "linear-gradient(to top, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)",
                        transform: "translate(-50%, -100%) rotate(45deg)",
                        transformOrigin: "bottom center",
                        filter: "blur(12px)", pointerEvents: "none", zIndex: 14,
                      }} 
                    />
                  </>
                ) : (
                  <>
                    {/* Soft, spread-out diffuse light for dull objects */}
                    <div style={{
                      position: "absolute", top: "55%", left: "50%",
                      width: "45%", paddingBottom: "45%", borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 50%, transparent 85%)",
                      transform: "translate(-50%,-50%)",
                      filter: "blur(12px)", pointerEvents: "none", zIndex: 15,
                    }} />
                  </>
                )}

                {mat.isShiny && (
                  <>
                    {/* Yellow/Golden Shine Symbols on the object (Big, Medium, Small) spread out */}
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.15, 0.95] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      style={{
                        position: "absolute", top: "35%", left: "35%",
                        width: "48px", height: "48px", color: "#fde047",
                        filter: "drop-shadow(0 0 12px rgba(253,224,71,0.8))",
                        zIndex: 35, pointerEvents: "none", transform: "translate(-50%, -50%)"
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C12 0 12 10.5 24 12C12 13.5 12 24 12 24C12 24 12 13.5 0 12C12 10.5 12 0 12 0Z" /></svg>
                    </motion.div>
                    <motion.div
                      animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.9, 1.1, 0.9] }}
                      transition={{ repeat: Infinity, duration: 2.1, ease: "easeInOut", delay: 0.7 }}
                      style={{
                        position: "absolute", top: "60%", left: "55%",
                        width: "32px", height: "32px", color: "#fef08a",
                        filter: "drop-shadow(0 0 8px rgba(254,240,138,0.7))",
                        zIndex: 35, pointerEvents: "none", transform: "translate(-50%, -50%)"
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C12 0 12 10.5 24 12C12 13.5 12 24 12 24C12 24 12 13.5 0 12C12 10.5 12 0 12 0Z" /></svg>
                    </motion.div>
                    <motion.div
                      animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.9] }}
                      transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut", delay: 1.2 }}
                      style={{
                        position: "absolute", top: "45%", left: "70%",
                        width: "20px", height: "20px", color: "#fef08a",
                        filter: "drop-shadow(0 0 6px rgba(254,240,138,0.6))",
                        zIndex: 35, pointerEvents: "none", transform: "translate(-50%, -50%)"
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C12 0 12 10.5 24 12C12 13.5 12 24 12 24C12 24 12 13.5 0 12C12 10.5 12 0 12 0Z" /></svg>
                    </motion.div>
                  </>
                )}
              </>
            )}
            
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "16px 20px",
              background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
              fontSize: "1.8rem", fontWeight: 900, color: "#ffffff", letterSpacing: "1px",
              zIndex: 20,
            }}>
              {mat.name}
            </div>
          </div>

          {/* Classification & Feedback moved below image */}
          <div style={{ display: "flex", gap: "1rem", flexShrink: 0 }}>
            {/* Classification buttons */}
            <AnimatePresence mode="wait">
              {hasObserved && !submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    flex: 1, display: "flex", flexDirection: "column", gap: "0.65rem",
                    padding: "1.25rem", background: "rgba(0,0,0,0.4)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)"
                  }}
                >
                  <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#fde68a", textAlign: "center", marginBottom: 4 }}>
                    What did you observe?
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", flex: 1 }}>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setAnswer("shiny")}
                      style={{
                        flex: 1, padding: "0.75rem 0.5rem", borderRadius: 10,
                        background: answer === "shiny"
                          ? "linear-gradient(135deg, #ca8a04, #a16207)"
                          : "rgba(202,138,4,0.1)",
                        color: answer === "shiny" ? "#fff" : "#fef08a",
                        fontWeight: 900, fontSize: "1.25rem", cursor: "pointer",
                        border: answer === "shiny" ? "2px solid #ca8a04" : "1px solid rgba(202,138,4,0.3)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px"
                      }}>
                      <span>Shiny</span>
                      <span style={{ fontSize: "1rem", fontWeight: 600, opacity: 0.8, textAlign: "center" }}>Light reflected clearly</span>
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setAnswer("dull")}
                      style={{
                        flex: 1, padding: "0.75rem 0.5rem", borderRadius: 10,
                        background: answer === "dull"
                          ? "linear-gradient(135deg, #475569, #334155)"
                          : "rgba(71,85,105,0.1)",
                        color: answer === "dull" ? "#fff" : "#cbd5e1",
                        fontWeight: 900, fontSize: "1.25rem", cursor: "pointer",
                        border: answer === "dull" ? "2px solid #64748b" : "1px solid rgba(71,85,105,0.3)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px"
                      }}>
                      <span>Dull</span>
                      <span style={{ fontSize: "1rem", fontWeight: 600, opacity: 0.8, textAlign: "center" }}>No clear reflection</span>
                    </motion.button>
                  </div>
                  {answer && (
                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      style={{
                        padding: "0.85rem", borderRadius: 10,
                        background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                        color: "#fff", fontWeight: 900, fontSize: "1.3rem",
                        border: "none", cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
                        marginTop: 6
                      }}>
                      Confirm Observation →
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feedback */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    flex: 1, padding: "1.25rem", borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: correct ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                    display: "flex", flexDirection: "column", gap: "1rem",
                  }}
                >
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: correct ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                    border: "1px solid " + (correct ? "#22c55e" : "#ef4444"),
                    borderRadius: 8, padding: "12px 16px",
                  }}>
                    {correct ? <Check size={24} color="#86efac"/> : <X size={24} color="#fca5a5"/>}
                    <span style={{ fontSize: "1.25rem", fontWeight: 900, color: correct ? "#86efac" : "#fca5a5", lineHeight: 1.3 }}>
                      {correct
                        ? (mat.isShiny ? "✓ Correct! The " + mat.name + " reflects light clearly." : "✓ Correct! The " + mat.name + " does not reflect light clearly.")
                        : "Not quite — " + (mat.isShiny ? "this surface is actually shiny." : "this surface is actually dull.")}
                    </span>
                  </div>
                  <div style={{ fontSize: "1.15rem", color: "#d6cbbf", fontStyle: "italic", lineHeight: 1.4, flex: 1 }}>
                    {mat.shineFact}
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => onDone(answer)}
                    style={{
                      padding: "0.85rem", borderRadius: 10,
                      background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                      color: "#fff", fontWeight: 900, fontSize: "1.35rem",
                      border: "none", cursor: "pointer", marginTop: 4
                    }}>
                    Next Object →
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Controls Panel */}
        <div style={{
          width: "400px", padding: "1.5rem 1.25rem", borderLeft: "1px solid rgba(255,255,255,0.08)",
          background: "transparent", display: "flex", flexDirection: "column", gap: "1rem", overflowY: "auto"
        }}>
          
          <div style={{
            background: "rgba(0,0,0,0.4)", borderRadius: 12,
            padding: "1.25rem", border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{ fontSize: "1.4rem", color: "#fde68a", marginBottom: 8, fontWeight: 900 }}>
              Observation
            </div>
            <div style={{ fontSize: "1.15rem", color: "#e2d9c8", lineHeight: 1.4, marginBottom: 16 }}>
              Turn the torch ON and OFF and observe what happens to the light.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={() => handleToggle(true)}
                style={{
                  padding: "0.85rem", borderRadius: 10,
                  background: torchOn ? "linear-gradient(135deg, #f59e0b, #d97706)" : "rgba(245,158,11,0.15)",
                  color: torchOn ? "#fff" : "#fcd34d", border: torchOn ? "2px solid #f59e0b" : "2px solid rgba(245,158,11,0.3)",
                  fontSize: "1.3rem", fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10
                }}
              >
                🔦 TORCH ON
              </button>
              <button
                onClick={() => handleToggle(false)}
                style={{
                  padding: "0.85rem", borderRadius: 10,
                  background: !torchOn ? "linear-gradient(135deg, #1e293b, #0f172a)" : "rgba(30,41,59,0.5)",
                  color: !torchOn ? "#fff" : "#94a3b8", border: !torchOn ? "2px solid #334155" : "2px solid rgba(30,41,59,0.5)",
                  fontSize: "1.3rem", fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10
                }}
              >
                🔕 TORCH OFF
              </button>
            </div>
          </div>

          <div style={{
            background: "rgba(0,0,0,0.4)", borderRadius: 12, padding: "2rem 1.75rem",
            border: "1px solid rgba(255,255,255,0.05)",
            fontSize: "1.5rem", color: "#e2d9c8", lineHeight: 1.6,
          }}>
            <div style={{ fontWeight: 900, color: "#fef08a", marginBottom: 12, fontSize: "1.7rem" }}>Watch for:</div>
            <ul style={{ margin: 0, paddingLeft: "2rem", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>Does a bright spot appear?</li>
              <li>Is the reflection clear or soft?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Material card in grid ─────────────────────────────────────────────────────
const MaterialCard = ({ mat, state, onClick }) => {
  const isActive = state === "active";
  const isDone   = state === "done";
  return (
    <motion.div
      layout
      onClick={() => !isDone && onClick(mat.id)}
      whileHover={!isDone ? { scale: 1.04, y: -3 } : {}}
      whileTap={!isDone ? { scale: 0.97 } : {}}
      style={{
        position: "relative", borderRadius: 14, overflow: "hidden",
        display: "flex", flexDirection: "column", height: "100%",
        cursor: isDone ? "default" : "pointer",
        border: isActive ? "3px solid #f59e0b"
               : isDone ? "3px solid " + (mat.isShiny ? "#fbbf24" : "#94a3b8")
               : "3px solid transparent",
        transition: "border 0.25s", background: "#1e1a14",
        boxShadow: isActive
          ? "0 0 0 4px rgba(245,158,11,0.25), 0 8px 24px rgba(0,0,0,0.5)"
          : "0 4px 16px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, background: "transparent" }}>
        <img src={mat.img} alt={mat.name} style={{
          width: "100%", height: "100%", objectFit: "cover",
          objectPosition: "center", display: "block",
          filter: isDone && mat.isShiny
            ? "brightness(1.15) contrast(1.08) saturate(1.1)"
            : isDone ? "brightness(0.88) contrast(1.05)"
            : "brightness(0.9) contrast(1.05)",
          transition: "filter 0.4s ease",
        }} />
        {isDone && (
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: mat.isShiny ? "rgba(245,158,11,0.92)" : "rgba(100,116,139,0.92)",
            borderRadius: 24, padding: "6px 16px",
            fontSize: "1.35rem", fontWeight: 900, color: "#fff",
            display: "flex", alignItems: "center", gap: 6, backdropFilter: "blur(4px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}>
            {mat.isShiny ? "✨ Shiny" : "🌑 Dull"}
          </div>
        )}
        {isActive && (
          <motion.div
            animate={{ opacity: [0.7, 0, 0.7], scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            style={{
              position: "absolute", inset: 0, borderRadius: 12,
              border: "3px solid #fbbf24", pointerEvents: "none",
            }}
          />
        )}
        {!isDone && !isActive && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.25)",
            opacity: 0, transition: "opacity 0.2s",
          }} className="hover-show">
            <span style={{ fontSize: "2.5rem" }}>🔦</span>
          </div>
        )}
      </div>
      <div style={{
        textAlign: "center", padding: "12px 6px 16px",
        fontSize: "1.5rem", fontWeight: 900,
        color: isDone ? (mat.isShiny ? "#fcd34d" : "#94a3b8") : "#e2d9c8",
      }}>
        {mat.name}
      </div>
    </motion.div>
  );
};

// ── Final Challenge ───────────────────────────────────────────────────────────
const FinalChallenge = ({ onSolve }) => {
  const [selected, setSelected] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const toggle = (id) => {
    if (submitted) return;
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const submit = () => {
    const ok = selected.size === SHINY_IDS.size && [...selected].every(id => SHINY_IDS.has(id));
    setIsCorrect(ok);
    setSubmitted(true);
    if (ok) setTimeout(onSolve, 2800);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      style={{
        background: "linear-gradient(135deg, #0f0c07 0%, #1a1508 100%)",
        border: "2px solid #b45309", borderRadius: 20, padding: "2rem",
        maxWidth: 520, margin: "0 auto",
        display: "flex", flexDirection: "column", gap: "1.25rem",
        boxShadow: "0 12px 48px rgba(0,0,0,0.7)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: 4 }}>🕵️</div>
        <h3 style={{ margin: 0, fontSize: "1.3rem", color: "#fde68a", fontWeight: 900 }}>
          Shine Detective Challenge
        </h3>
        <p style={{ margin: "0.4rem 0 0", fontSize: "0.88rem", color: "#b8a898" }}>
          Based on your torch observations — which objects were shiny?
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
        {MATERIALS.map(mat => {
          const sel    = selected.has(mat.id);
          const wrong  = submitted && sel && !mat.isShiny;
          const missed = submitted && !sel && mat.isShiny;
          return (
            <motion.div key={mat.id}
              whileHover={!submitted ? { scale: 1.04 } : {}}
              whileTap={!submitted ? { scale: 0.96 } : {}}
              onClick={() => toggle(mat.id)}
              style={{
                borderRadius: 12, overflow: "hidden", cursor: submitted ? "default" : "pointer",
                border: wrong ? "2px solid #ef4444" : missed ? "2px solid #f59e0b" : sel ? "2px solid #22c55e" : "2px solid rgba(255,255,255,0.1)",
                background: sel ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)",
                transition: "all 0.2s", position: "relative",
              }}
            >
              <img src={mat.img} alt={mat.name} draggable="false"
                style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block",
                  filter: sel ? "brightness(1.1)" : "brightness(0.75)" }} />
              <div style={{ padding: "5px 6px", textAlign: "center", fontSize: "0.72rem", fontWeight: 700, color: sel ? "#86efac" : "#9ca3af" }}>
                {sel && <Check size={11} style={{ marginRight: 3, verticalAlign: "middle" }} />}
                {mat.name}
              </div>
              {missed && (
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(245,158,11,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem",
                }}>✨</div>
              )}
            </motion.div>
          );
        })}
      </div>
      {submitted ? (
        isCorrect ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: 6 }}>🎉</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#86efac", marginBottom: 6 }}>Case Solved!</div>
            <p style={{ margin: 0, fontSize: "0.83rem", color: "#a09080", lineHeight: 1.6 }}>
              Some materials reflect light clearly and appear <strong style={{ color: "#fde68a" }}>shiny</strong>,
              while others scatter light and appear <strong style={{ color: "#94a3b8" }}>dull</strong>.
            </p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: 10, padding: "0.75rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.85rem", color: "#fca5a5", fontWeight: 700 }}>
              Not quite! Yellow = ones you missed. Try again!
            </div>
            <button onClick={() => { setSelected(new Set()); setSubmitted(false); }}
              style={{ marginTop: 8, padding: "0.4rem 1.2rem", borderRadius: 8,
                background: "transparent", border: "1px solid #f87171",
                color: "#fca5a5", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700 }}>
              Try Again
            </button>
          </motion.div>
        )
      ) : (
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={submit} disabled={selected.size === 0}
          style={{
            padding: "0.75rem", borderRadius: 12,
            background: selected.size === 0 ? "#374151" : "linear-gradient(135deg, #ca8a04, #a16207)",
            color: selected.size === 0 ? "#6b7280" : "#fff",
            fontWeight: 800, fontSize: "0.95rem",
            border: "none", cursor: selected.size === 0 ? "not-allowed" : "pointer",
            boxShadow: selected.size > 0 ? "0 4px 16px rgba(161,98,7,0.4)" : "none",
            transition: "all 0.2s",
          }}>
          Submit My Answer →
        </motion.button>
      )}
    </motion.div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export default function Stage4a_Appearance_Observe({ onComplete, addXp }) {
  const [observations, setObservations]     = useState({});
  const [activeMat, setActiveMat]           = useState(null);
  const [challengeSolved, setChallengeSolved] = useState(false);

  const doneCount = Object.keys(observations).length;
  const allDone   = doneCount === MATERIALS.length;

  const handleCardClick = (id) => {
    if (observations[id]) return;
    setActiveMat(id);
  };

  const handleObservationDone = (answer) => {
    const mat = MATERIALS.find(m => m.id === activeMat);
    setObservations(prev => ({
      ...prev,
      [activeMat]: { result: mat.isShiny ? "shiny" : "dull", answer },
    }));
    setActiveMat(null);
  };

  const handleChallengeSolved = () => {
    setChallengeSolved(true);
    addXp(60);
    setTimeout(onComplete, 1200);
  };

  const handleReset = () => {
    setObservations({});
    setActiveMat(null);
    setChallengeSolved(false);
  };

  const mats = MATERIALS.map(m => ({ ...m }));
  const activeMaterial = mats.find(m => m.id === activeMat);
  const showChallengePanel = allDone && !challengeSolved;

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: "0.6rem",
      width: "100%", height: "100%", overflow: "hidden",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      position: "relative",
    }}>
      {/* Title */}
      <div className="glass-panel" style={{
        padding: "0.85rem 1.25rem",
        border: "1px solid var(--accent-border)",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.6rem", color: "var(--text-heading)", fontWeight: 900 }}>
            🔦 Shine Hunt – Torch Observation Lab
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: "1.1rem", color: "#d97706", fontWeight: 700 }}>
            Shine the torch on each object and observe what happens to the light.
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", gap: "0.6rem", flex: 1, minHeight: 0, overflow: "hidden" }}>

        {/* Scene area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: 0, overflow: "hidden", position: "relative" }}>

          {!showChallengePanel ? (
            <>
              <div style={{
                background: "linear-gradient(135deg, rgba(161,98,7,0.2), rgba(120,53,15,0.15))",
                border: "1px solid rgba(161,98,7,0.4)", borderRadius: 10,
                padding: "0.65rem 1rem", fontSize: "1.1rem",
                color: "#d97706", fontWeight: 800, flexShrink: 0,
              }}>
                🔦 Click any material to open the torch observation.{doneCount > 0 ? "  (" + doneCount + "/6 done)" : ""}
              </div>

              <div style={{
                flex: 1, minHeight: 0, overflow: "hidden",
                display: activeMat ? "none" : "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(2, 1fr)",
                gap: "0.65rem",
              }}>
                {mats.map(mat => {
                  const state = observations[mat.id] ? "done" : activeMat === mat.id ? "active" : "idle";
                  return <MaterialCard key={mat.id} mat={mat} state={state} onClick={handleCardClick} />;
                })}
              </div>

              {/* Torch observation inline replacing grid */}
              <AnimatePresence>
                {activeMat && activeMaterial && (
                  <motion.div
                    key={"torch-" + activeMat}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    style={{ position: "absolute", inset: 0, zIndex: 30 }}
                  >
                    <TorchObservation mat={activeMaterial} onDone={handleObservationDone} />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div style={{ flex: 1, minHeight: 0, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
              <FinalChallenge onSolve={handleChallengeSolved} />
            </div>
          )}
        </div>

        {/* Detective Board */}
        <div className="glass-panel" style={{
          width: 340, flexShrink: 0,
          display: "flex", flexDirection: "column",
          padding: "1rem", overflow: "hidden",
        }}>
          <div style={{
            fontWeight: 900, fontSize: "1.6rem", color: "#d97706",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "0.5rem", marginBottom: "0.5rem",
          }}>
            🔎 Shine Detective
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1, overflow: "hidden" }}>
            {MATERIALS.map(mat => {
              const obs = observations[mat.id];
              return (
                <motion.div key={mat.id} layout style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: obs ? (mat.isShiny ? "rgba(251,191,36,0.12)" : "rgba(100,116,139,0.12)") : "rgba(255,255,255,0.04)",
                  borderRadius: 14, padding: "8px 14px",
                  border: obs ? "1px solid " + (mat.isShiny ? "rgba(251,191,36,0.3)" : "rgba(100,116,139,0.3)") : "1px solid rgba(255,255,255,0.06)",
                  transition: "all 0.3s",
                }}>
                  <img src={mat.img} alt={mat.name} draggable="false"
                    style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {mat.name}
                    </div>
                    <div style={{ fontSize: "1.1rem", marginTop: 4 }}>
                      {obs ? (
                        <span style={{ color: mat.isShiny ? "#fcd34d" : "#94a3b8", fontWeight: 800 }}>
                          {mat.isShiny ? "✨ Shiny" : "🌑 Dull"}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontWeight: 700 }}>? Not observed</span>
                      )}
                    </div>
                  </div>
                  {obs && <Check size={22} color={mat.isShiny ? "#fbbf24" : "#64748b"} />}
                </motion.div>
              );
            })}
          </div>

          {/* Shine Record */}
          <div style={{
            marginTop: "0.75rem", padding: "1rem 1.25rem",
            background: "rgba(0,0,0,0.4)", borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#e2d9c8", marginBottom: "0.75rem" }}>
              Shine Record
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", color: "#fde68a", fontWeight: 800 }}>
                <span>✨ Shiny Objects</span>
                <span>{Object.values(observations).filter(o => o.result === "shiny").length} / 6</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", color: "#cbd5e1", fontWeight: 800 }}>
                <span>🌑 Dull Objects</span>
                <span>{Object.values(observations).filter(o => o.result === "dull").length} / 6</span>
              </div>
            </div>
          </div>

          {allDone && !challengeSolved && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: "0.85rem",
                background: "rgba(124,58,237,0.18)", border: "1px solid rgba(167,139,250,0.4)",
                borderRadius: 12, padding: "0.85rem",
                fontSize: "1.1rem", color: "#c4b5fd", fontWeight: 800, lineHeight: 1.4, textAlign: "center",
              }}>
              🎯 All observed!<br/>
              <span style={{ color: "#a78bfa" }}>Final challenge →</span>
            </motion.div>
          )}
          {challengeSolved && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{
                marginTop: "0.85rem",
                background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)",
                borderRadius: 12, padding: "0.85rem",
                fontSize: "1.2rem", color: "#86efac", fontWeight: 800, textAlign: "center",
              }}>
              🎉 Case Solved!
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
