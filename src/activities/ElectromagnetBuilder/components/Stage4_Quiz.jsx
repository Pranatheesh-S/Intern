import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Trophy } from 'lucide-react';

const quizData = [
  {
    id: 1,
    question: "What causes the iron nail to become magnetic?",
    options: ["Heat", "Electric current", "Sunlight", "Pressure"],
    correctAnswer: 1,
    explanation: "Electric current flowing through the wire coil creates a magnetic field around it, which temporarily magnetizes the iron core."
  },
  {
    id: 2,
    question: "When does the nail lose its magnetism?",
    options: ["When the current stops", "When the battery is touched", "Never", "Only after one hour"],
    correctAnswer: 0,
    explanation: "An electromagnet is a temporary magnet. It loses its magnetism almost immediately when the electric current stops flowing."
  },
  {
    id: 3,
    question: "How can the strength of an electromagnet be increased?",
    options: ["Increase the number of turns", "Increase current", "Both of the above", "None"],
    correctAnswer: 2,
    explanation: "You can make an electromagnet stronger by increasing the number of coils wrapped around the core, or by increasing the electrical current (e.g., adding more cells)."
  },
  {
    id: 4,
    question: "Why should the battery not remain connected continuously?",
    options: ["It will catch fire immediately", "It may become weak or discharge quickly", "The nail will melt", "The paper clips will break"],
    correctAnswer: 1,
    explanation: "A continuous flow of current through a short coil with low resistance acts almost like a short circuit, causing the battery to drain very quickly and potentially overheat."
  },
  {
    id: 5,
    question: "Which material makes the best temporary electromagnet core?",
    options: ["Plastic", "Wood", "Iron", "Rubber"],
    correctAnswer: 2,
    explanation: "Iron is an excellent magnetic material that easily becomes magnetized when exposed to a magnetic field and loses it quickly when the field is removed, making it perfect for temporary electromagnets."
  }
];

export default function Stage4_Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (index) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswerChecked(true);
    if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setScore(0);
    setShowResults(false);
  };

  const q = quizData[currentQuestion];
  const isCorrect = selectedAnswer === q?.correctAnswer;

  return (
    <div className="main-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="status-badge neutral" style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
            Stage 4: Concept Quiz
          </span>
          <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '1.4rem' }}>Test Your Understanding</h2>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div 
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              {/* Progress Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Question {currentQuestion + 1} of {quizData.length}</span>
                <span>Score: {score}</span>
              </div>
              
              <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${((currentQuestion) / quizData.length) * 100}%`, background: 'var(--accent)', transition: 'width 0.3s ease' }} />
              </div>

              {/* Question */}
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-heading)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                {q.question}
              </h3>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {q.options.map((opt, i) => {
                  let optStyle = {
                    padding: '1rem',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'var(--surface)',
                    cursor: isAnswerChecked ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  };

                  if (isAnswerChecked) {
                    if (i === q.correctAnswer) {
                      optStyle.background = 'var(--success-bg)';
                      optStyle.borderColor = 'var(--success)';
                      optStyle.color = 'var(--success-text)';
                    } else if (i === selectedAnswer) {
                      optStyle.background = 'var(--danger-bg)';
                      optStyle.borderColor = 'var(--danger)';
                      optStyle.color = 'var(--danger-text)';
                    }
                  } else if (selectedAnswer === i) {
                    optStyle.borderColor = 'var(--accent)';
                    optStyle.background = 'var(--accent-bg)';
                  }

                  return (
                    <button 
                      key={i}
                      onClick={() => handleOptionSelect(i)}
                      style={optStyle}
                      className={!isAnswerChecked && selectedAnswer !== i ? 'quiz-option-hover' : ''}
                    >
                      <span style={{ fontSize: '0.95rem' }}>{opt}</span>
                      {isAnswerChecked && i === q.correctAnswer && <CheckCircle2 size={18} color="var(--success)" />}
                      {isAnswerChecked && i === selectedAnswer && i !== q.correctAnswer && <XCircle size={18} color="var(--danger)" />}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Action Button */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <AnimatePresence>
                  {isAnswerChecked && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      style={{ 
                        padding: '1rem', 
                        borderRadius: '8px', 
                        background: isCorrect ? 'var(--success-bg)' : 'var(--danger-bg)',
                        borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}`,
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start'
                      }}
                    >
                      <AlertCircle size={20} color={isCorrect ? 'var(--success)' : 'var(--danger)'} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', color: isCorrect ? 'var(--success-text)' : 'var(--danger-text)' }}>
                          {isCorrect ? "Correct!" : "Not quite right."}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                          {q.explanation}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isAnswerChecked ? (
                  <button 
                    onClick={handleCheckAnswer}
                    disabled={selectedAnswer === null}
                    className="primary"
                    style={{ padding: '0.875rem', fontSize: '1rem', justifyContent: 'center' }}
                  >
                    Check Answer
                  </button>
                ) : (
                  <button 
                    onClick={handleNextQuestion}
                    className="primary"
                    style={{ padding: '0.875rem', fontSize: '1rem', justifyContent: 'center' }}
                  >
                    {currentQuestion < quizData.length - 1 ? 'Next Question' : 'View Results'}
                  </button>
                )}
              </div>

            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '2rem 0' }}
            >
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: score === quizData.length ? 'var(--success-bg)' : 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Trophy size={40} color={score === quizData.length ? 'var(--success)' : 'var(--accent)'} />
              </div>
              
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-heading)' }}>
                Quiz Complete!
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                You scored {score} out of {quizData.length}
              </p>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={resetQuiz} className="outline" style={{ gap: '0.5rem' }}>
                  <RefreshCw size={16} /> Retake Quiz
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
