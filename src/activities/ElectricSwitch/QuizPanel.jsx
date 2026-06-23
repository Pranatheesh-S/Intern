import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  Check, 
  X, 
  RotateCcw, 
  Award,
  ArrowRight,
  BookOpen
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    question: "Why does the bulb glow when the safety pin touches both drawing pins?",
    options: [
      { key: 'A', text: "The safety pin generates its own electrical energy." },
      { key: 'B', text: "It completes the circuit, creating a closed path for current to flow." },
      { key: 'C', text: "The drawing pins heat up the wires, making the bulb glow." }
    ],
    correct: 'B',
    explanation: "A switch works by completing the loop. When the safety pin (a conductor) touches both pins, it closes the gap in the circuit, allowing electric current to flow continuously."
  },
  {
    id: 2,
    question: "What would happen if we replaced the metal safety pin with a plastic paperclip?",
    options: [
      { key: 'A', text: "The bulb would glow brighter than before." },
      { key: 'B', text: "The bulb would not glow because plastic is an insulator." },
      { key: 'C', text: "The plastic paperclip would melt due to the electricity." }
    ],
    correct: 'B',
    explanation: "Plastic is an insulator, meaning it does not allow electric current to pass through it. Replacing a conductor with an insulator keeps the circuit open electrically."
  },
  {
    id: 3,
    question: "An electric switch is a device that is designed to:",
    options: [
      { key: 'A', text: "Generate electricity from mechanical movement." },
      { key: 'B', text: "Store electrical charge like a battery." },
      { key: 'C', text: "Either complete (close) or break (open) a circuit." }
    ],
    correct: 'C',
    explanation: "A switch is a simple controller. In the ON position it completes (closes) the path for current, and in the OFF position it breaks (opens) the path."
  },
  {
    id: 4,
    question: "If a wire in the circuit is cut or disconnected, the circuit is called:",
    options: [
      { key: 'A', text: "An open circuit." },
      { key: 'B', text: "A closed circuit." },
      { key: 'C', text: "A parallel circuit." }
    ],
    correct: 'A',
    explanation: "An open circuit has a break or gap in its path. Current cannot flow across a physical gap, so the load (bulb) remains inactive."
  },
  {
    id: 5,
    question: "Which component acts as the source of electrical energy in our circuit?",
    options: [
      { key: 'A', text: "The steel safety pin." },
      { key: 'B', text: "The 1.5V electric cell (battery)." },
      { key: 'C', text: "The electric bulb holder." }
    ],
    correct: 'B',
    explanation: "The battery (electric cell) is the energy source. It converts stored chemical energy into electrical energy, pushing the current around the circuit."
  }
];

export default function QuizPanel() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedKey, setSelectedKey] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = QUESTIONS[currentIdx];

  const handleOptionSelect = (key) => {
    if (answered) return;
    setSelectedKey(key);
  };

  const handleAnswerSubmit = () => {
    if (selectedKey === null || answered) return;
    
    const isCorrect = selectedKey === currentQuestion.correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setAnswered(true);
  };

  const handleNext = () => {
    setSelectedKey(null);
    setAnswered(false);
    
    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);
      // Trigger confetti if they got a perfect score!
      if (score + (selectedKey === currentQuestion.correct ? 1 : 0) === QUESTIONS.length) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedKey(null);
    setAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  // Result assessment text
  const getFeedbackMessage = () => {
    const percentage = (score / QUESTIONS.length) * 100;
    if (percentage === 100) return "Expert Electrician! 🎓 You've mastered switches and circuits!";
    if (percentage >= 60) return "Great job! You have a solid grasp of how circuits work. 👍";
    return "Keep practicing! Review the sandbox and stages to reinforce your concepts. 📚";
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '650px', margin: '0 auto', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: '#6366f1' }} size={20} />
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Concept Challenge</h3>
        </div>
        {!quizFinished && (
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(30, 41, 59, 0.6)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
            Question {currentIdx + 1} of {QUESTIONS.length}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!quizFinished ? (
          /* Question Panel */
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
          >
            {/* Question Text */}
            <h4 style={{ fontSize: '1rem', color: '#f8fafc', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              {currentQuestion.question}
            </h4>

            {/* Options list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedKey === opt.key;
                const isCorrectOption = opt.key === currentQuestion.correct;
                
                let buttonStyle = {
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  padding: '1rem',
                  fontSize: '0.875rem'
                };

                // Style logic after answering
                if (answered) {
                  if (isCorrectOption) {
                    buttonStyle.background = 'rgba(16, 185, 129, 0.1)';
                    buttonStyle.borderColor = '#10b981';
                    buttonStyle.color = '#34d399';
                  } else if (isSelected) {
                    buttonStyle.background = 'rgba(239, 68, 68, 0.1)';
                    buttonStyle.borderColor = '#ef4444';
                    buttonStyle.color = '#f87171';
                  } else {
                    buttonStyle.opacity = 0.5;
                  }
                } else if (isSelected) {
                  buttonStyle.borderColor = '#6366f1';
                  buttonStyle.background = 'rgba(99, 102, 241, 0.1)';
                }

                return (
                  <button
                    key={opt.key}
                    onClick={() => handleOptionSelect(opt.key)}
                    disabled={answered}
                    className="outline"
                    style={buttonStyle}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                      <span style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '6px', 
                        background: isSelected ? '#6366f1' : 'rgba(255,255,255,0.04)',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        flexShrink: 0
                      }}>
                        {answered && isCorrectOption ? <Check size={14} /> : 
                         answered && isSelected ? <X size={14} /> : opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next controls */}
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
              <AnimatePresence>
                {answered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      background: 'rgba(30, 41, 59, 0.4)',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      marginBottom: '1rem',
                      borderLeft: `4px solid ${selectedKey === currentQuestion.correct ? '#10b981' : '#ef4444'}`
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: selectedKey === currentQuestion.correct ? '#34d399' : '#f87171' }}>
                      {selectedKey === currentQuestion.correct ? '✓ CORRECT ANSWER' : '❌ INCORRECT'}
                    </span>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {!answered ? (
                  <button 
                    onClick={handleAnswerSubmit} 
                    className="primary"
                    disabled={selectedKey === null}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button onClick={handleNext} className="success" style={{ gap: '0.25rem' }}>
                    {currentIdx + 1 === QUESTIONS.length ? 'Finish Quiz' : 'Next Question'} 
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Finished Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              textAlign: 'center',
              flex: 1,
              padding: '1.5rem 0'
            }}
          >
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'rgba(99, 102, 241, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '1rem',
              color: '#fbbf24'
            }}>
              <Award size={48} />
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Quiz Completed!</h2>
            
            <div style={{ margin: '0.5rem 0 1rem 0' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff' }}>
                {score}
              </span>
              <span style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: 'bold' }}>
                /{QUESTIONS.length}
              </span>
            </div>

            <p style={{ maxWidth: '400px', fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
              {getFeedbackMessage()}
            </p>

            <button onClick={handleRestart} className="primary" style={{ gap: '0.5rem' }}>
              <RotateCcw size={16} /> Restart Quiz
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
