import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, ArrowRight, Flag } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    question: "Which poles attract each other?",
    options: ["North–North", "South–South", "North–South", "None"],
    correctAnswer: "North–South",
    explanation: "Unlike poles (North and South) attract each other."
  },
  {
    id: 2,
    question: "Which poles repel each other?",
    options: ["North–South", "South–North", "North–North and South–South", "None"],
    correctAnswer: "North–North and South–South",
    explanation: "Like poles always repel each other."
  },
  {
    id: 3,
    question: "Why is Magnet A placed on round pencils in this experiment?",
    options: [
      "To make the magnet stronger",
      "To reduce friction and allow easy movement",
      "To prevent the magnet from breaking",
      "To act as insulators"
    ],
    correctAnswer: "To reduce friction and allow easy movement",
    explanation: "The round pencils act as rollers, reducing friction so the magnetic force can easily push or pull the magnet."
  },
  {
    id: 4,
    question: "True or False: Like poles attract each other.",
    options: ["True", "False"],
    correctAnswer: "False",
    explanation: "False. Like poles repel each other. Unlike poles attract."
  },
  {
    id: 5,
    question: "What happens when the South pole of one magnet approaches the North pole of another?",
    options: [
      "They repel and move apart",
      "They attract and pull towards each other",
      "They lose their magnetism",
      "Nothing happens"
    ],
    correctAnswer: "They attract and pull towards each other",
    explanation: "Because South and North are unlike poles, they exert an attractive force on each other."
  }
];

export default function Stage4_Quiz({ onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (option) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);
    
    if (option === QUESTIONS[currentQ].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowResult(false);
    setCurrentQ(prev => prev + 1);
  };

  const handleFinish = () => {
    onComplete();
  };

  const isCompleted = currentQ >= QUESTIONS.length;

  if (isCompleted) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel"
          style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '500px', background: 'var(--surface)' }}
        >
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
            <Flag size={40} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Activity Complete!</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              You scored {score} out of {QUESTIONS.length}
            </p>
          </div>
          
          <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden', margin: '1rem 0' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(score / QUESTIONS.length) * 100}%` }}
              style={{ height: '100%', background: 'var(--success)' }}
            />
          </div>

          <button 
            onClick={handleFinish}
            className="primary"
            style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: '#10b981', borderColor: '#10b981', fontSize: '1rem' }}
          >
            <CheckCircle2 size={20} /> Finish Activity
          </button>
        </motion.div>
      </div>
    );
  }

  const question = QUESTIONS[currentQ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem', background: 'var(--surface)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
          <span>Score: {score}</span>
        </div>

        <h3 style={{ margin: '0 0 2rem 0', color: 'var(--text-heading)', fontSize: '1.25rem', lineHeight: '1.4' }}>
          {question.question}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt === question.correctAnswer;
            
            let bg = 'var(--surface)';
            let border = 'var(--border)';
            let color = 'var(--text-primary)';

            if (showResult) {
              if (isCorrect) {
                bg = 'var(--success-bg)';
                border = 'var(--success-border)';
                color = 'var(--success)';
              } else if (isSelected && !isCorrect) {
                bg = 'var(--destructive-bg)';
                border = 'var(--destructive-border)';
                color = 'var(--destructive)';
              }
            } else if (isSelected) {
              bg = 'var(--accent-bg)';
              border = 'var(--accent)';
              color = 'var(--accent-text)';
            }

            return (
              <button
                key={opt}
                onClick={() => handleOptionSelect(opt)}
                disabled={showResult}
                className="outline"
                style={{
                  padding: '1.25rem',
                  textAlign: 'left',
                  background: bg,
                  borderColor: border,
                  color: color,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  fontSize: '1rem'
                }}
              >
                {opt}
                {showResult && isCorrect && (
                  <CheckCircle2 size={20} style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
                )}
                {showResult && isSelected && !isCorrect && (
                  <AlertCircle size={20} style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)' }} />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              style={{ marginTop: '2rem' }}
            >
              <div style={{ 
                padding: '1.25rem', 
                borderRadius: '8px', 
                background: selectedOption === question.correctAnswer ? 'var(--success-bg)' : 'var(--destructive-bg)',
                border: `1px solid ${selectedOption === question.correctAnswer ? 'var(--success-border)' : 'var(--destructive-border)'}`,
                color: selectedOption === question.correctAnswer ? 'var(--success)' : 'var(--destructive)'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {selectedOption === question.correctAnswer ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  {selectedOption === question.correctAnswer ? "Correct!" : "Incorrect"}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', opacity: 0.9 }}>
                  {question.explanation}
                </p>
              </div>

              <button 
                onClick={handleNextQuestion}
                className="primary"
                style={{ width: '100%', marginTop: '1rem', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                {currentQ === QUESTIONS.length - 1 ? 'View Results' : 'Next Question'} <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
