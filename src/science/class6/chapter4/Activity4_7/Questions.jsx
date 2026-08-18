import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "What is placed between the bar magnet and the compass needle in this activity?",
    options: [
      "An iron sheet",
      "A wooden piece",
      "A steel plate",
      "An aluminium rod"
    ],
    correctAnswer: "A wooden piece",
    explanation: "A wooden piece is placed between the magnet and the compass to observe whether the magnetic effect passes through it."
  },
  {
    id: 2,
    question: "Which of the following materials is tested in this activity?",
    options: [
      "Iron",
      "Steel",
      "Plastic",
      "Nickel"
    ],
    correctAnswer: "Plastic",
    explanation: "Plastic is one of the non-magnetic materials tested between the magnet and the compass needle."
  },
  {
    id: 3,
    question: "What happens to the compass needle when a cardboard sheet is placed between the magnet and the compass?",
    options: [
      "It stops moving completely.",
      "It still shows deflection.",
      "It points in the opposite direction.",
      "It becomes magnetic."
    ],
    correctAnswer: "It still shows deflection.",
    explanation: "The magnetic effect passes through cardboard, so the compass needle continues to deflect."
  },
  {
    id: 4,
    question: "What can be concluded from this activity?",
    options: [
      "Magnets work only in air.",
      "Magnetic effect cannot pass through any material.",
      "Magnetic effect can pass through non-magnetic materials.",
      "Wood becomes magnetic when placed near a magnet."
    ],
    correctAnswer: "Magnetic effect can pass through non-magnetic materials.",
    explanation: "The activity shows that materials like wood, cardboard, plastic, and glass do not block the magnetic effect."
  },
  {
    id: 5,
    question: "Which observation best supports the conclusion of this activity?",
    options: [
      "The compass needle shows similar deflection even when non-magnetic materials are placed between it and the magnet.",
      "The wooden block sticks to the magnet.",
      "The compass needle changes its colour.",
      "The magnet becomes weaker after the experiment."
    ],
    correctAnswer: "The compass needle shows similar deflection even when non-magnetic materials are placed between it and the magnet.",
    explanation: "The continued deflection of the compass needle shows that the magnetic effect passes through non-magnetic materials such as wood, cardboard, plastic, and glass."
  }
];

export default function Questions({ onComplete, onNext }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionSelect = (option) => {
    if (showFeedback) return;
    setSelectedOption(option);
    setShowFeedback(true);
    
    if (option === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
      onComplete();
    }
  };

  if (isFinished) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: '80px', height: '80px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={40} />
        </div>
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Quiz Complete!</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>You scored {score} out of {questions.length}.</p>
        </div>
        <button onClick={onNext} className="primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', marginTop: '1rem' }}>
          Proceed to Challenge <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="glass-panel" style={{ padding: '2.5rem 3.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%', borderRadius: '24px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.85rem', color: 'var(--text-heading)', fontWeight: 800 }}>Concept Check</h2>
        <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', lineHeight: '1.6', margin: '0 0 1.75rem 0', fontWeight: 600 }}>
          {q.question}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {q.options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === q.correctAnswer;
            
            let bg = 'var(--surface)';
            let borderColor = 'var(--border)';
            let color = 'var(--text-primary)';

            if (showFeedback) {
              if (isCorrect) {
                bg = 'var(--success-bg)';
                borderColor = 'var(--success-border)';
                color = 'var(--success)';
              } else if (isSelected) {
                bg = 'var(--destructive-bg)';
                borderColor = 'var(--destructive-border)';
                color = 'var(--destructive)';
              } else {
                color = 'rgba(var(--text-primary-rgb), 0.5)';
              }
            } else if (isSelected) {
              bg = 'var(--accent-bg)';
              borderColor = 'var(--accent)';
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                disabled={showFeedback}
                style={{
                  padding: '1.25rem 1.75rem',
                  borderRadius: '14px',
                  background: bg,
                  border: `2px solid ${borderColor}`,
                  color: color,
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: showFeedback ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                  opacity: showFeedback && !isCorrect && !isSelected ? 0.5 : 1
                }}
              >
                {option}
                {showFeedback && isCorrect && <CheckCircle2 size={24} />}
                {showFeedback && isSelected && !isCorrect && <XCircle size={24} />}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              padding: '1.5rem 1.75rem', 
              background: selectedOption === q.correctAnswer ? 'var(--success-bg)' : 'var(--destructive-bg)', 
              borderRadius: '14px',
              border: `1.5px solid ${selectedOption === q.correctAnswer ? 'var(--success-border)' : 'var(--destructive-border)'}`,
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: selectedOption === q.correctAnswer ? 'var(--success)' : 'var(--destructive)' }}>
              {selectedOption === q.correctAnswer ? 'Correct!' : 'Incorrect.'}
            </div>
            <p style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {q.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleNext}
          disabled={!showFeedback}
          className="primary"
          style={{ opacity: showFeedback ? 1 : 0.5, padding: '0.85rem 2.5rem', fontSize: '1.25rem', fontWeight: 700, borderRadius: '12px' }}
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
}
