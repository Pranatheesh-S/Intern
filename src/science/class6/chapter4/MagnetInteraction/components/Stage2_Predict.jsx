import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ArrowRight, Play, CheckCircle2, RotateCcw, RotateCw, XCircle } from "lucide-react";

export default function Stage2_Predict({ onComplete, onNext }) {
  const [step, setStep] = useState(0); 
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setTimeout(() => {
      setStep(step + 1);
      setSelectedOption(null);
    }, 1000);
  };

  const nextExperiment = () => {
    setStep(step + 1);
  };

  const handleFinish = () => {
    onComplete();
    onNext();
  };

  return (
    <div className="glass-panel" style={{ padding: "2rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h3 style={{ margin: "0 0 1rem 0", color: "var(--text-heading)" }}>Experiment View</h3>
        
        <div style={{ 
          position: "relative", 
          width: "100%", 
          maxWidth: "500px", 
          height: "300px", 
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)"
        }}>
          <motion.div
            initial={{ x: 0 }}
            animate={{ 
              x: step === 1 ? 40 : step === 3 ? -60 : 0 
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ position: "absolute", left: "106px", display: "flex", gap: "8px", top: "180px" }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div 
                key={i} 
                style={{ width: "8px", height: "120px", filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))" }}
              >
                <svg viewBox="0 0 8 120" width="100%" height="100%">
                  <polygon points="0,15 8,15 4,0" fill="#e6b981" />
                  <polygon points="3,3 5,3 4,0" fill="#334155" />
                  <rect x="0" y="15" width="8" height="90" fill="url(#pencilGrad2)" />
                  <rect x="0" y="102" width="8" height="5" fill="#cbd5e1" />
                  <rect x="0" y="107" width="8" height="13" rx="2" fill="#f472b6" />
                  <defs>
                    <linearGradient id="pencilGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fde047" />
                      <stop offset="100%" stopColor="#ca8a04" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            ))}
            <AnimatePresence>
              {step === 1 && (
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
              {step === 3 && (
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

          <motion.div
            initial={{ x: 0 }}
            animate={{ 
              x: step === 1 ? 40 : step === 3 ? -60 : 0 
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ position: "absolute", left: "50px", top: "150px", width: "200px", height: "40px", zIndex: 10 }}
          >
            <div style={{ position: "absolute", top: "-25px", left: "50%", transform: "translateX(-50%)", fontSize: "0.85rem", fontWeight: "bold", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>Magnet A</div>
            <div style={{ width: "100%", height: "100%", display: "flex", borderRadius: "4px", overflow: "hidden", boxShadow: "0 8px 16px rgba(0,0,0,0.3)" }}>
              {step < 2 ? (
                <>
                  <div style={{ flex: 1, background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>N</div>
                  <div style={{ flex: 1, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>S</div>
                </>
              ) : (
                <>
                  <div style={{ flex: 1, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>S</div>
                  <div style={{ flex: 1, background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>N</div>
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 0, opacity: 1 }}
            animate={{ 
              x: (step === 1 || step === 3) ? -60 : 0,
              opacity: 1
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ position: "absolute", left: "350px", top: "150px", width: "120px", height: "40px", zIndex: 11 }}
          >
            <div style={{ position: "absolute", top: "-25px", left: "50%", transform: "translateX(-50%)", fontSize: "0.85rem", fontWeight: "bold", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>Magnet B</div>
            <div style={{ width: "100%", height: "100%", display: "flex", borderRadius: "4px", overflow: "hidden", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}>
              <div style={{ flex: 1, background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>N</div>
              <div style={{ flex: 1, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>S</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div style={{ flex: "1 1 350px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {step === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel" style={{ padding: "1.5rem", background: "var(--surface)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-text)", marginBottom: "1rem", fontWeight: "bold" }}>
              <HelpCircle size={20} /> Prediction 1
            </div>
            <p style={{ margin: "0 0 1.5rem 0", color: "var(--text-primary)", fontSize: "1rem", lineHeight: "1.5" }}>
              What do you think will happen if the <strong>North</strong> pole of Magnet B approaches the <strong>South</strong> pole of Magnet A?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["Magnet A moves toward Magnet B", "Magnet A moves away", "Nothing happens"].map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === "Magnet A moves toward Magnet B";
                const isWrongSelected = isSelected && !isCorrect;
                return (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect(opt)}
                    className="outline"
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      background: isWrongSelected ? "var(--danger-bg)" : isSelected ? "var(--accent-bg)" : "transparent",
                      borderColor: isWrongSelected ? "var(--danger)" : isSelected ? "var(--accent)" : "var(--border)",
                      color: isWrongSelected ? "var(--danger)" : isSelected ? "var(--accent-text)" : "inherit"
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{opt}</span>
                      {isWrongSelected && <XCircle size={18} style={{ color: 'var(--danger)' }} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: "1.5rem", background: "var(--success-bg)", border: "1px solid var(--success-border)" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--success)" }}>Observation</h4>
            <p style={{ margin: "0 0 1.5rem 0", color: "var(--text-primary)", lineHeight: "1.5" }}>
              Magnet A rolls toward Magnet B!
              <br /><br />
              <strong>Conclusion:</strong> Unlike poles attract each other.
            </p>
            <button onClick={nextExperiment} className="primary" style={{ width: "100%", padding: "0.75rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
              Next Prediction <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel" style={{ padding: "1.5rem", background: "var(--surface)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-text)", marginBottom: "1rem", fontWeight: "bold" }}>
              <HelpCircle size={20} /> Prediction 2
            </div>
            <p style={{ margin: "0 0 1.5rem 0", color: "var(--text-primary)", fontSize: "1rem", lineHeight: "1.5" }}>
              Now, we flipped Magnet A. What happens when the <strong>North</strong> pole of Magnet B approaches the <strong>North</strong> pole of Magnet A?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {["Magnet A moves toward Magnet B", "Magnet A moves away", "Nothing happens"].map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === "Magnet A moves away";
                const isWrongSelected = isSelected && !isCorrect;
                return (
                  <button
                    key={opt}
                    onClick={() => handleOptionSelect(opt)}
                    className="outline"
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      background: isWrongSelected ? "var(--danger-bg)" : isSelected ? "var(--accent-bg)" : "transparent",
                      borderColor: isWrongSelected ? "var(--danger)" : isSelected ? "var(--accent)" : "var(--border)",
                      color: isWrongSelected ? "var(--danger)" : isSelected ? "var(--accent-text)" : "inherit"
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{opt}</span>
                      {isWrongSelected && <XCircle size={18} style={{ color: 'var(--danger)' }} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: "1.5rem", background: "var(--success-bg)", border: "1px solid var(--success-border)" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--success)" }}>Observation</h4>
            <p style={{ margin: "0 0 1.5rem 0", color: "var(--text-primary)", lineHeight: "1.5" }}>
              Magnet A rolls away from Magnet B!
              <br /><br />
              <strong>Conclusion:</strong> Like poles repel each other.
            </p>
            <button onClick={handleFinish} className="primary" style={{ width: "100%", padding: "0.75rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", background: "#10b981", borderColor: "#10b981" }}>
              <CheckCircle2 size={16} /> Proceed to Sandbox Explore
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
