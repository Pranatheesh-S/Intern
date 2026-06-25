import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, GraduationCap } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What indicates the presence of fat in a food item?",
    options: ["It turns blue-black", "It leaves a translucent oily patch on paper", "It dissolves completely in water", "It changes colour to red"],
    correctAnswer: 1,
    explanation: "Fats leave an oily patch on paper that allows light to faintly pass through (translucent)."
  },
  {
    id: 2,
    question: "Why do some food items without fat initially leave a wet patch on the paper?",
    options: ["They contain oils that evaporate", "They contain a little water that dries up later", "They are melting", "They are absorbing the paper"],
    correctAnswer: 1,
    explanation: "Foods like potato or cucumber contain water. The water leaves a wet patch initially, but if you let it dry, the patch disappears, proving it wasn't an oily fat patch."
  },
  {
    id: 3,
    question: "Based on the experiment, which of these items contains fat?",
    options: ["Bread", "Boiled Rice", "Crushed Peanuts", "Cucumber"],
    correctAnswer: 2,
    explanation: "Crushed peanuts left a permanent oily patch on the paper that lets light through faintly, indicating the presence of fats."
  }
];

export default function QuizPanel() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];

  const handleSelectOption = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <GraduationCap size={48} style={{ color: 'var(--success)', margin: '0 auto 1rem auto' }} />
        <h2 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)' }}>Quiz Completed!</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-faint)', marginBottom: '2rem' }}>
          You scored {score} out of {QUIZ_QUESTIONS.length}
        </p>
        <button 
          onClick={() => {
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setScore(0);
            setIsFinished(false);
          }}
          className="outline"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GraduationCap size={20} style={{ color: 'var(--accent)' }} />
          Concept Quiz
        </h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-faint)', background: 'var(--border)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
          Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
        </span>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ margin: '0 0 2rem 0', fontSize: '1.25rem', color: 'var(--text-heading)', lineHeight: '1.4' }}>
          {question.question}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
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
                key={index}
                onClick={() => handleSelectOption(index)}
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
                <span>{option}</span>
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
                background: selectedAnswer === question.correctAnswer ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                borderLeft: `4px solid ${selectedAnswer === question.correctAnswer ? 'var(--success)' : 'var(--danger)'}`,
                borderRadius: '4px'
              }}>
                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-heading)', fontSize: '0.95rem' }}>
                  {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-faint)', lineHeight: '1.5' }}>
                  {question.explanation}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button 
                  onClick={handleNext}
                  className="primary"
                  style={{ gap: '0.5rem', padding: '0.5rem 1rem' }}
                >
                  {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'} <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
