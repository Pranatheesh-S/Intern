import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Trophy } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    question: "What is the primary purpose of the switch in a torch?",
    options: [
      "To produce electrical energy for the bulb.",
      "To open and close the electric circuit.",
      "To change the direction of the current.",
      "To hold the cells tightly together."
    ],
    correctAnswer: 1,
    explanation: "A switch is a simple device that either breaks the circuit (turns it off) or completes it (turns it on)."
  },
  {
    id: 2,
    question: "Which part of an electric cell is the positive (+) terminal?",
    options: [
      "The flat metal disc at the bottom.",
      "The outer plastic wrapper.",
      "The small metal cap at the top.",
      "The chemical paste inside."
    ],
    correctAnswer: 2,
    explanation: "The metal cap represents the positive terminal, while the flat metal disc represents the negative terminal."
  },
  {
    id: 3,
    question: "What happens if you reverse the direction of one cell in a two-cell torch?",
    options: [
      "The bulb will glow even brighter.",
      "The bulb will glow normally.",
      "The bulb will not glow because the circuit is broken.",
      "The torch will explode."
    ],
    correctAnswer: 2,
    explanation: "For current to flow, the positive terminal of one cell must connect to the negative terminal of the next cell. Reversing a cell breaks this flow."
  },
  {
    id: 4,
    question: "Why do some torches use two or more cells instead of just one?",
    options: [
      "To make the torch heavier.",
      "To provide a higher voltage so the bulb glows brighter.",
      "Because one cell cannot fit properly.",
      "To prevent the filament from burning out."
    ],
    correctAnswer: 1,
    explanation: "Connecting multiple cells end-to-end forms a battery. This provides more electrical energy, making the bulb glow brighter."
  },
  {
    id: 5,
    question: "Which of the following is the correct way to arrange two cells inside a torch?",
    options: [
      "Positive to Positive: (+)---(-)  (-)---(+)",
      "Negative to Negative: (-)---(+)  (+)---(-)",
      "Positive to Negative: (-)---(+)  (-)---(+)",
      "Both cells placed side-by-side."
    ],
    correctAnswer: 2,
    explanation: "Cells must be connected in series: the positive terminal of the first cell connects to the negative terminal of the second cell."
  }
];

export default function Stage4_Quiz({ onComplete }) {
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
            <li>A switch controls the flow of electricity.</li>
            <li>Cells have a positive cap and a negative flat disc.</li>
            <li>Cells must be arranged correctly (+ to -) to form a working battery.</li>
          </ul>
        </div>

        <button onClick={onComplete} className="primary" style={{ marginTop: '1rem', padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
          Finish Lab <CheckCircle2 size={18} style={{ marginLeft: '0.5rem', display: 'inline' }} />
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
