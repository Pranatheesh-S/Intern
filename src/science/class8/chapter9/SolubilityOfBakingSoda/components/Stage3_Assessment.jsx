import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award, BookOpen, Lightbulb } from 'lucide-react';

export default function Stage3_Assessment() {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [activeFactIndex, setActiveFactIndex] = useState(0);

  const questions = [
    {
      q: "What is a saturated solution?",
      options: [
        "A solution that cannot dissolve any more solute at a given temperature.",
        "A solution that contains no solute.",
        "A solution that can dissolve infinite solute.",
        "A solution that is very hot."
      ],
      ans: 0
    },
    {
      q: "Why does baking soda dissolve more at higher temperatures?",
      options: [
        "Because water molecules slow down.",
        "Because kinetic energy increases, allowing water molecules to break apart more solute.",
        "Because the beaker expands.",
        "Because baking soda melts."
      ],
      ans: 1
    },
    {
      q: "At which temperature is maximum solubility observed in our experiment?",
      options: ["20°C", "50°C", "70°C", "0°C"],
      ans: 2
    },
    {
      q: "Does temperature affect solubility?",
      options: [
        "No, solubility is constant.",
        "Yes, solubility generally increases with temperature for solid solutes.",
        "Yes, but only for gases.",
        "It only affects the color."
      ],
      ans: 1
    },
    {
      q: "What happens to a saturated solution when heated?",
      options: [
        "It boils immediately.",
        "It becomes supersaturated.",
        "It freezes.",
        "It behaves as an unsaturated solution and can dissolve more solute."
      ],
      ans: 3
    }
  ];

  const funFacts = [
    "Hot tea dissolves sugar much faster than cold iced tea!",
    "Most solid substances become more soluble as the temperature of the solvent increases.",
    "Temperature increases molecular motion, creating more space between liquid molecules for the solid to dissolve."
  ];

  const handleOptionClick = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    
    if (idx === questions[currentQ].ans) {
      setIsCorrect(true);
      setScore(s => s + 1);
    } else {
      setIsCorrect(false);
    }

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(c => c + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setScore(0);
    setShowResults(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  // Confetti particles for perfect score
  const Confetti = () => (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, x: Math.random() * 400, opacity: 1, rotate: 0 }}
          animate={{ 
            y: 300, 
            x: Math.random() * 400, 
            opacity: 0, 
            rotate: Math.random() * 360 
          }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][i % 5]
          }}
        />
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        {/* Quiz Section */}
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
          <h3 style={{ margin: 0, marginBottom: '1.5rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} /> Knowledge Check
          </h3>
          
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div 
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Question {currentQ + 1} of {questions.length}
                </div>
                <h4 style={{ margin: 0, marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-color)' }}>
                  {questions[currentQ].q}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {questions[currentQ].options.map((opt, idx) => {
                    let bgColor = 'rgba(255, 255, 255, 0.05)';
                    let borderColor = 'var(--border)';
                    let icon = null;

                    if (selectedOption !== null) {
                      if (idx === questions[currentQ].ans) {
                        bgColor = 'rgba(16, 185, 129, 0.1)';
                        borderColor = 'var(--success)';
                        icon = <CheckCircle size={16} color="var(--success)" />;
                      } else if (idx === selectedOption) {
                        bgColor = 'rgba(239, 68, 68, 0.1)';
                        borderColor = 'var(--danger)';
                        icon = <XCircle size={16} color="var(--danger)" />;
                      }
                    }

                    return (
                      <motion.button
                        key={idx}
                        whileHover={selectedOption === null ? { scale: 1.02 } : {}}
                        whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                        onClick={() => handleOptionClick(idx)}
                        disabled={selectedOption !== null}
                        style={{
                          padding: '1rem',
                          textAlign: 'left',
                          background: bgColor,
                          border: `1px solid ${borderColor}`,
                          borderRadius: '8px',
                          color: 'var(--text-color)',
                          cursor: selectedOption === null ? 'pointer' : 'default',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.9rem'
                        }}
                      >
                        {opt}
                        {icon}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '2rem 0' }}
              >
                {score === questions.length && <Confetti />}
                
                <Award size={64} style={{ color: score === questions.length ? 'gold' : 'var(--accent-color)', margin: '0 auto', marginBottom: '1rem' }} />
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-heading)' }}>
                  Quiz Completed!
                </h3>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', margin: '1rem 0' }}>
                  You scored <strong style={{ color: 'var(--text-heading)' }}>{score}</strong> out of {questions.length}
                </p>
                <button onClick={resetQuiz} className="outline" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
                  Retake Quiz
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Conclusion & Fun Facts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--accent-color)' }}>
            <h3 style={{ margin: 0, marginBottom: '1rem', color: 'var(--text-heading)' }}>Conclusion</h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              "The experiment demonstrates that the solubility of baking soda increases with temperature. A saturated solution at a lower temperature behaves as an unsaturated solution when heated, allowing more solute to dissolve."
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
              <Lightbulb size={120} />
            </div>
            <h3 style={{ margin: 0, marginBottom: '1.5rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lightbulb size={20} style={{ color: 'var(--warning)' }} /> Fun Facts
            </h3>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFactIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ minHeight: '80px', display: 'flex', alignItems: 'center' }}
              >
                <p style={{ fontSize: '1.1rem', color: 'var(--text-color)', fontStyle: 'italic', margin: 0 }}>
                  "{funFacts[activeFactIndex]}"
                </p>
              </motion.div>
            </AnimatePresence>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              {funFacts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFactIndex(idx)}
                  style={{
                    width: '10px', height: '10px', borderRadius: '50%', padding: 0,
                    background: activeFactIndex === idx ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.2)',
                    border: 'none', cursor: 'pointer'
                  }}
                  aria-label={`Show fact ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
