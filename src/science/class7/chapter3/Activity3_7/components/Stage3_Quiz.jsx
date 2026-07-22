import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Trophy } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    question: "How must an LED be connected to a battery to make it glow?",
    options: [
      "Positive terminal to the shorter wire, negative to the longer wire",
      "Positive terminal to the longer wire, negative to the shorter wire",
      "Any wire can be connected to any terminal"
    ],
    correctAnswer: 1,
    explanation: "The longer wire is the positive terminal of the LED and must be connected to the positive terminal of the battery."
  },
  {
    id: 2,
    question: "What happens if you reverse the connections to an LED?",
    options: [
      "It does not glow",
      "It glows brighter",
      "It changes color"
    ],
    correctAnswer: 0,
    explanation: "An LED only allows current to pass in one direction. Reversing the connections blocks the current."
  },
  {
    id: 3,
    question: "What is a battery?",
    options: [
      "A single electric cell",
      "A type of light bulb",
      "A combination of two or more cells"
    ],
    correctAnswer: 2,
    explanation: "A battery is made by connecting two or more cells together, typically end-to-end (positive to negative)."
  }
];

export default function Stage3_Quiz({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const question = QUESTIONS[currentQuestion];

  const handleOptionSelect = (index) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (quizFinished) {
    return (
      <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <Trophy size={64} style={{ color: 'var(--warning)' }} />
        <h2 style={{ margin: 0, color: 'var(--text-heading)' }}>Quiz Complete!</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          You scored <strong style={{ color: 'var(--accent)' }}>{score}</strong> out of {QUESTIONS.length}
        </p>
        
        <div style={{ width: '100%', maxWidth: '400px', background: 'var(--surface)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'left', marginTop: '1rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>Key Takeaways:</h4>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <li>A battery is a combination of two or more cells.</li>
            <li>LEDs are directional and only allow current in one direction.</li>
            <li>Connect positive (+) to the longer wire, negative (-) to the shorter wire.</li>
          </ul>
        </div>

        <button onClick={onComplete} className="primary" style={{ marginTop: '1rem', padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
          Finish Activity <CheckCircle2 size={18} style={{ marginLeft: '0.5rem', display: 'inline' }} />
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: 'var(--text-heading)' }}>Concept Quiz</h3>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
          {question.question}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {question.options.map((option, idx) => {
            let isCorrect = idx === question.correctAnswer;
            let isSelected = idx === selectedOption;
            
            let bg = 'var(--surface)';
            let borderColor = 'var(--border)';
            let textColor = 'var(--text-secondary)';

            if (showExplanation) {
              if (isCorrect) {
                bg = 'var(--success-bg)';
                borderColor = 'var(--success-border)';
                textColor = 'var(--success)';
              } else if (isSelected) {
                bg = 'var(--destructive-bg)';
                borderColor = 'var(--destructive-border)';
                textColor = 'var(--destructive)';
              }
            } else if (isSelected) {
              bg = 'var(--accent-bg)';
              borderColor = 'var(--accent)';
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={showExplanation}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: `2px solid ${borderColor}`,
                  background: bg,
                  color: textColor,
                  textAlign: 'left',
                  fontSize: '1rem',
                  cursor: showExplanation ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {option}
                {showExplanation && isCorrect && <CheckCircle2 size={20} />}
                {showExplanation && isSelected && !isCorrect && <XCircle size={20} />}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '1.25rem',
              borderRadius: '8px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div>
              <strong style={{ color: selectedOption === question.correctAnswer ? 'var(--success)' : 'var(--destructive)' }}>
                {selectedOption === question.correctAnswer ? 'Correct!' : 'Incorrect.'}
              </strong>
              <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {question.explanation}
              </p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleNext} className="primary" style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {currentQuestion < QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
