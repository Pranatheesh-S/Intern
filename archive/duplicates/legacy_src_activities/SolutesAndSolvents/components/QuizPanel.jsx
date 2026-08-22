import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight, Award } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "When no more salt can be dissolved in water at a given temperature, the solution is called:",
    options: [
      { id: 'a', text: "An unsaturated solution" },
      { id: 'b', text: "A saturated solution" },
      { id: 'c', text: "A dilute solution" },
      { id: 'd', text: "A pure solvent" }
    ],
    correctAnswer: 'b',
    explanation: "A saturated solution is one in which no more solute can be dissolved at that particular temperature. The salt will begin to settle at the bottom."
  },
  {
    id: 2,
    question: "The amount of solute present in a fixed quantity of solution is termed as its:",
    options: [
      { id: 'a', text: "Saturation point" },
      { id: 'b', text: "Solubility" },
      { id: 'c', text: "Concentration" },
      { id: 'd', text: "Viscosity" }
    ],
    correctAnswer: 'c',
    explanation: "Concentration refers to the amount of solute present in a fixed quantity of solution. It tells us whether a solution is dilute or concentrated."
  },
  {
    id: 3,
    question: "Which of these solutions is more concentrated?",
    options: [
      { id: 'a', text: "2 spoons of salt in 100 mL of water" },
      { id: 'b', text: "4 spoons of salt in 50 mL of water" },
      { id: 'c', text: "They have the same concentration" },
      { id: 'd', text: "Cannot be determined" }
    ],
    correctAnswer: 'b',
    explanation: "4 spoons of salt in 50 mL of water has a much higher ratio of solute (salt) to solvent (water), making it more concentrated."
  }
];

export default function QuizPanel() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (optionId) => {
    if (showResult) return;
    setSelectedAnswer(optionId);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    
    if (selectedAnswer === QUIZ_QUESTIONS[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel" 
        style={{ 
          padding: '3rem', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}
      >
        <Award size={64} style={{ color: 'var(--accent)' }} />
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Quiz Completed!</h2>
          <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            You scored {score} out of {QUIZ_QUESTIONS.length}
          </p>
        </div>
        
        <div style={{ 
          background: 'var(--surface)', 
          padding: '1.5rem', 
          borderRadius: '12px',
          width: '100%',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', fontSize: '1rem' }}>Key Takeaways:</h3>
          <ul style={{ textAlign: 'left', margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>A <strong>saturated solution</strong> can no longer dissolve additional solute.</li>
            <li><strong>Concentration</strong> describes the amount of solute in a given amount of solution.</li>
            <li><strong>Solubility</strong> is the maximum amount of solute that dissolves in a fixed quantity of solvent.</li>
          </ul>
        </div>

        <button onClick={resetQuiz} className="outline" style={{ marginTop: '1rem', padding: '0.8rem 2rem' }}>
          Retake Quiz
        </button>
      </motion.div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', minHeight: '450px', display: 'flex', flexDirection: 'column' }}>
      {/* Progress Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {QUIZ_QUESTIONS.map((_, idx) => (
          <div 
            key={idx}
            style={{
              flex: 1,
              height: '6px',
              borderRadius: '3px',
              background: idx === currentQuestion 
                ? 'var(--accent)' 
                : idx < currentQuestion 
                  ? 'var(--success)' 
                  : 'var(--border)',
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '1.4rem', color: 'var(--text-heading)', lineHeight: '1.4' }}>
              {question.question}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const isCorrect = option.id === question.correctAnswer;
              
              let borderStyle = '1px solid var(--border)';
              let bgStyle = 'var(--surface)';
              let icon = null;

              if (showResult) {
                if (isCorrect) {
                  borderStyle = '2px solid var(--success)';
                  bgStyle = 'rgba(16, 185, 129, 0.1)';
                  icon = <CheckCircle size={20} style={{ color: 'var(--success)' }} />;
                } else if (isSelected && !isCorrect) {
                  borderStyle = '2px solid var(--danger)';
                  bgStyle = 'rgba(239, 68, 68, 0.1)';
                  icon = <XCircle size={20} style={{ color: 'var(--danger)' }} />;
                }
              } else if (isSelected) {
                borderStyle = '2px solid var(--accent)';
                bgStyle = 'rgba(99, 102, 241, 0.1)';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  disabled={showResult}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    background: bgStyle,
                    border: borderStyle,
                    borderRadius: '8px',
                    cursor: showResult ? 'default' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    color: 'var(--text-heading)',
                    fontSize: '1rem'
                  }}
                >
                  <span style={{ fontWeight: isSelected ? '500' : 'normal' }}>{option.text}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ 
                  padding: '1.25rem', 
                  background: selectedAnswer === question.correctAnswer ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  border: `1px solid ${selectedAnswer === question.correctAnswer ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: '1.5'
                }}
              >
                <strong>{selectedAnswer === question.correctAnswer ? 'Correct!' : 'Not quite.'}</strong> {question.explanation}
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            {!showResult ? (
              <button 
                onClick={handleCheckAnswer}
                disabled={!selectedAnswer}
                className="primary"
                style={{ padding: '0.75rem 2rem', opacity: !selectedAnswer ? 0.5 : 1 }}
              >
                Check Answer
              </button>
            ) : (
              <button 
                onClick={handleNextQuestion}
                className="primary"
                style={{ padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
