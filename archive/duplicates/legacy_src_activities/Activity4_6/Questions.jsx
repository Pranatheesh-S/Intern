import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "What happens when the North pole of a bar magnet is brought close to the North pole of a magnetic compass?",
    options: [
      "The compass needle does not move.",
      "The compass needle moves away from the magnet.",
      "The compass needle points upward.",
      "The compass needle starts spinning continuously."
    ],
    correctAnswer: "The compass needle moves away from the magnet.",
    explanation: "The North pole of the magnet repels the North-seeking end of the compass needle, causing it to move away."
  },
  {
    id: 2,
    question: "What happens when the South pole of a bar magnet is brought close to the North pole of a magnetic compass?",
    options: [
      "The compass needle moves away.",
      "The compass needle is attracted towards the magnet.",
      "The compass needle stops moving permanently.",
      "The compass needle points downward."
    ],
    correctAnswer: "The compass needle is attracted towards the magnet.",
    explanation: "Unlike poles attract each other, so the North-seeking end of the compass needle moves towards the South pole of the magnet."
  },
  {
    id: 3,
    question: "Why does the compass needle deflect when a bar magnet is brought near it?",
    options: [
      "The magnet changes the colour of the needle.",
      "The magnetic force of the bar magnet acts on the compass needle.",
      "The compass becomes heavier.",
      "Air pushes the compass needle."
    ],
    correctAnswer: "The magnetic force of the bar magnet acts on the compass needle.",
    explanation: "The magnetic field of the bar magnet exerts a force on the magnetic compass needle, causing it to deflect."
  },
  {
    id: 4,
    question: "Which instrument is used in this activity to observe the effect of a nearby magnet?",
    options: [
      "Thermometer",
      "Compass",
      "Spring balance",
      "Measuring cylinder"
    ],
    correctAnswer: "Compass",
    explanation: "A magnetic compass is used to observe how its needle responds when a bar magnet is brought close."
  },
  {
    id: 5,
    question: "What can be concluded from this activity?",
    options: [
      "A nearby magnet can change the direction of a compass needle.",
      "A compass needle is not magnetic.",
      "A magnet attracts every object placed near it.",
      "A compass always points towards a nearby magnet."
    ],
    correctAnswer: "A nearby magnet can change the direction of a compass needle.",
    explanation: "A bar magnet exerts a magnetic force on the compass needle, causing it to deflect from its usual North–South direction."
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
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '100%', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-heading)' }}>Concept Check</h2>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
          {q.question}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                  padding: '1rem 1.5rem',
                  borderRadius: '12px',
                  background: bg,
                  border: `2px solid ${borderColor}`,
                  color: color,
                  fontSize: '1rem',
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
                {showFeedback && isCorrect && <CheckCircle2 size={20} />}
                {showFeedback && isSelected && !isCorrect && <XCircle size={20} />}
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
              padding: '1.5rem', 
              background: selectedOption === q.correctAnswer ? 'var(--success-bg)' : 'var(--destructive-bg)', 
              borderRadius: '12px',
              border: `1px solid ${selectedOption === q.correctAnswer ? 'var(--success-border)' : 'var(--destructive-border)'}`,
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <div style={{ fontWeight: 'bold', color: selectedOption === q.correctAnswer ? 'var(--success)' : 'var(--destructive)' }}>
              {selectedOption === q.correctAnswer ? 'Correct!' : 'Incorrect.'}
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
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
          style={{ opacity: showFeedback ? 1 : 0.5, padding: '0.75rem 2rem' }}
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
}
