import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, RotateCcw, CheckCircle2, XCircle, ChevronRight, GraduationCap } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    question: "What is a Force?",
    options: ["Only a push", "Only a pull", "A push or a pull", "Neither"],
    correct: 2,
    explanation: "A force is fundamentally defined as a push or a pull upon an object resulting from its interaction with another object."
  },
  {
    question: "When you drag a box across the floor, which force resists your movement?",
    options: ["Gravity", "Friction", "Magnetic Force", "Lift"],
    correct: 1,
    explanation: "Friction is the resistance that one surface or object encounters when moving over another."
  },
  {
    question: "What must you overcome to lift a heavy crate off the ground?",
    options: ["Air Resistance", "Gravity", "Magnetic Force", "Friction"],
    correct: 1,
    explanation: "Gravity pulls mass downwards, so you must apply an upward force greater than gravity to lift an object."
  },
  {
    question: "Carrying a box requires you to...",
    options: [
      "Only push the box forward",
      "Only pull the box backward",
      "Apply both an upward force (to hold it) and a forward force (to move)",
      "Drop it and roll it"
    ],
    correct: 2,
    explanation: "When carrying an object, you are constantly fighting gravity with an upward lift, while applying a forward push/pull to move."
  }
];

export default function QuizAndDashboard({ onRestart }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswer = (index) => {
    if (showExplanation) return;
    
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === QUIZ_QUESTIONS[currentQuestion].correct) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setSelectedOption(null);
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setQuizComplete(true);
    }
  };

  if (quizComplete) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <GraduationCap size={48} style={{ color: 'var(--success)', margin: '0 auto 1rem auto' }} />
          <h2 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)' }}>Force Explorer Badge Earned!</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-faint)', marginBottom: '2rem' }}>
            You mastered Push, Pull, Lift, and Carry! <br/>
            Quiz Score: {score} out of {QUIZ_QUESTIONS.length}
          </p>
          <button 
            onClick={onRestart}
            className="outline"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={20} style={{ color: 'var(--accent)' }} />
            Knowledge Check
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-faint)', background: 'var(--border)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ margin: '0 0 2rem 0', fontSize: '1.25rem', color: 'var(--text-heading)', lineHeight: '1.4' }}>
          {q.question}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {q.options.map((opt, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = i === q.correct;
            const showCorrectness = showExplanation && (isSelected || isCorrect);
            
            let borderColor = 'var(--border)';
            let bgColor = 'var(--surface)';
            
            if (showCorrectness) {
              if (isCorrect) {
                borderColor = 'var(--success)';
                bgColor = 'rgba(16, 185, 129, 0.1)';
              } else if (isSelected) {
                borderColor = 'var(--danger)';
                bgColor = 'rgba(239, 68, 68, 0.1)';
              }
            } else if (isSelected) {
              borderColor = 'var(--accent)';
              bgColor = 'rgba(99, 102, 241, 0.1)';
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  color: 'var(--text-heading)',
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  cursor: showExplanation ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <span>{opt}</span>
                {showCorrectness && (
                  isCorrect ? <CheckCircle2 size={18} style={{ color: 'var(--success)' }} /> : 
                  (isSelected ? <XCircle size={18} style={{ color: 'var(--danger)' }} /> : null)
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ marginTop: '1.5rem', overflow: 'hidden' }}
            >
              <div style={{ 
                padding: '1rem', 
                background: selectedOption === q.correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                borderLeft: `4px solid ${selectedOption === q.correct ? 'var(--success)' : 'var(--danger)'}`,
                borderRadius: '4px'
              }}>
                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-heading)', fontSize: '0.95rem' }}>
                  {selectedOption === q.correct ? 'Correct!' : 'Incorrect'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-faint)', lineHeight: '1.5' }}>
                  {q.explanation}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button 
                  onClick={nextQuestion}
                  className="primary"
                  style={{ gap: '0.5rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center' }}
                >
                  {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'} <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
