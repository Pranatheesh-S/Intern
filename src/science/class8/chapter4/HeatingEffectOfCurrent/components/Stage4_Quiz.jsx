import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, Zap, RefreshCcw } from "lucide-react";
import confetti from "canvas-confetti";

const QUESTIONS = [
  {
    id: 1,
    question: "Why does the nichrome wire become hot?",
    options: [
      "It stores heat from the air.",
      "Electrical energy is converted into heat.",
      "The battery burns it directly.",
      "Friction from the connecting wires heats it."
    ],
    correctAnswer: 1,
    explanation: "When electric current flows through a conductor like nichrome, it faces resistance. This resistance causes some of the electrical energy to be converted into heat energy."
  },
  {
    id: 2,
    question: "Which wire is commonly used as a heating element because of its high resistance?",
    options: ["Copper", "Aluminium", "Nichrome", "Plastic"],
    correctAnswer: 2,
    explanation: "Nichrome offers higher resistance compared to copper or aluminium of the same size, making it ideal for converting electrical energy into heat in appliances like heaters and toasters."
  },
  {
    id: 3,
    question: "What happens when you use two cells instead of one in the heating circuit?",
    options: [
      "Less heat is produced.",
      "The wire cools down faster.",
      "More heat is produced.",
      "The material of the wire changes."
    ],
    correctAnswer: 2,
    explanation: "Using more cells increases the magnitude of the electric current. The amount of heat generated depends on the electric current, so more current produces more heat."
  },
  {
    id: 4,
    question: "Which factor affects the amount of heat produced in a wire?",
    options: [
      "Wire material",
      "Magnitude of current",
      "Wire length and thickness",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "The heat generated in a wire depends on its material, thickness, length, the magnitude of the electric current, and the duration for which the current flows."
  },
  {
    id: 5,
    question: "Why should the switch not remain ON for too long during this experiment?",
    options: [
      "The wire may become excessively hot and cause burns.",
      "The magnetic field will become too strong.",
      "The wire will turn into gold.",
      "The battery will recharge itself."
    ],
    correctAnswer: 0,
    explanation: "Safety first! If the current flows for an extended period, the nichrome wire can become extremely hot, posing a burn hazard."
  }
];

export default function Stage4_Quiz({ onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswer = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    if (index === QUESTIONS[currentQ].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
      if (score >= 3) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel" style={{ padding: "3rem", textAlign: "center", maxWidth: "600px", width: "100%" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: score >= 3 ? "var(--success-bg)" : "var(--warning-bg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            {score >= 3 ? <CheckCircle2 size={40} style={{ color: "var(--success)" }} /> : <RefreshCcw size={40} style={{ color: "var(--warning)" }} />}
          </div>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            {score >= 3 ? "Excellent Work!" : "Good Try!"}
          </h2>
          <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>
            You scored {score} out of {QUESTIONS.length}
          </p>

          <div style={{ background: "var(--surface)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border)", textAlign: "left", marginBottom: "2rem" }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Zap size={20} style={{ color: "var(--primary)" }} /> What We Learned
            </h3>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", fontSize: "0.95rem", color: "var(--text-primary)", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <li><strong>Energy Conversion:</strong> Electric current passing through a conductor converts electrical energy into heat energy.</li>
              <li><strong>Resistance Matters:</strong> Materials with high resistance, like nichrome, produce more heat and are used as heating elements.</li>
              <li><strong>Variables:</strong> The amount of heat depends on the wire's material, length, thickness, and the magnitude of current (number of cells).</li>
            </ul>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button onClick={restartQuiz} className="outline" style={{ padding: "0.8rem 1.5rem", fontSize: "1rem", gap: "0.5rem" }}>
              <RefreshCcw size={18} /> Retry Quiz
            </button>
            <button onClick={onComplete} className="primary" style={{ padding: "0.8rem 1.5rem", fontSize: "1rem" }}>
              Finish Lab
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const q = QUESTIONS[currentQ];

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ margin: 0 }}>Concept Check</h2>
        <div style={{ display: "flex", gap: "0.2rem" }}>
          {QUESTIONS.map((_, i) => (
            <div key={i} style={{ width: "30px", height: "6px", borderRadius: "3px", background: i < currentQ ? "var(--primary)" : i === currentQ ? "var(--primary-bg)" : "var(--border)", transition: "all 0.3s" }} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQ} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.2 }}>
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.3rem", marginBottom: "1.5rem", lineHeight: "1.4" }}>
              <span style={{ color: "var(--primary)", marginRight: "0.5rem" }}>Q{currentQ + 1}.</span>
              {q.question}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {q.options.map((opt, i) => {
                const isSelected = selectedAnswer === i;
                const isCorrect = i === q.correctAnswer;
                
                let bg = "var(--surface)";
                let border = "var(--border)";
                let icon = null;

                if (showResult) {
                  if (isCorrect) {
                    bg = "var(--success-bg)";
                    border = "var(--success)";
                    icon = <CheckCircle2 size={20} style={{ color: "var(--success)" }} />;
                  } else if (isSelected) {
                    bg = "var(--danger-bg)";
                    border = "var(--danger)";
                    icon = <XCircle size={20} style={{ color: "var(--danger)" }} />;
                  }
                } else if (isSelected) {
                  border = "var(--primary)";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={showResult}
                    style={{
                      padding: "1rem 1.5rem",
                      borderRadius: "12px",
                      background: bg,
                      border: `2px solid ${border}`,
                      textAlign: "left",
                      fontSize: "1.05rem",
                      cursor: showResult ? "default" : "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s"
                    }}
                  >
                    <span>{opt}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "1.5rem", padding: "1.5rem", background: selectedAnswer === q.correctAnswer ? "var(--success-bg)" : "var(--warning-bg)", borderRadius: "12px", border: `1px solid ${selectedAnswer === q.correctAnswer ? "var(--success)" : "var(--warning)"}` }}>
                <h4 style={{ margin: "0 0 0.5rem 0", color: selectedAnswer === q.correctAnswer ? "var(--success)" : "var(--warning)" }}>
                  {selectedAnswer === q.correctAnswer ? "Correct!" : "Not quite."}
                </h4>
                <p style={{ margin: 0, color: "var(--text-primary)", lineHeight: "1.5" }}>{q.explanation}</p>
                
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                  <button onClick={handleNext} className="primary" style={{ gap: "0.5rem", padding: "0.6rem 1.2rem" }}>
                    {currentQ < QUESTIONS.length - 1 ? "Next Question" : "See Results"} <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
