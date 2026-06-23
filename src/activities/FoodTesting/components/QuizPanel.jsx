import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, GraduationCap } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which solution is used to test for the presence of starch in food items?",
    options: ["Dilute Sodium Hydroxide", "Dilute Iodine Solution", "Copper Sulphate Solution", "Vinegar"],
    correctAnswer: 1,
    explanation: "Dilute Iodine solution is specifically used to test for starch. It changes colour upon reacting with starch."
  },
  {
    id: 2,
    question: "What colour change indicates a positive test for starch?",
    options: ["Reddish-brown", "Yellowish-orange", "Blue-black", "Greenish-blue"],
    correctAnswer: 2,
    explanation: "The food item turns blue-black if it contains starch when iodine is dropped on it."
  },
  {
    id: 3,
    question: "Based on the experiment, which of the following items contains starch?",
    options: ["Cucumber", "Boiled Rice", "Crushed Peanuts", "Butter"],
    correctAnswer: 1,
    explanation: "Boiled rice turns blue-black with iodine, indicating the presence of starch. Peanuts and butter contain fats, not starch."
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
        <GraduationCap size={48} style={{ color: '#10b981', margin: '0 auto 1rem auto' }} />
        <h2 style={{ margin: '0 0 1rem 0', color: '#ffffff' }}>Quiz Completed!</h2>
        <p style={{ fontSize: '1.2rem', color: '#cbd5e1', marginBottom: '2rem' }}>
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
        <h3 style={{ margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GraduationCap size={20} style={{ color: '#6366f1' }} />
          Concept Quiz
        </h3>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
          Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
        </span>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ margin: '0 0 2rem 0', fontSize: '1.25rem', color: '#ffffff', lineHeight: '1.4' }}>
          {question.question}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showCorrectness = showExplanation && (isSelected || isCorrect);
            
            let borderColor = 'rgba(255,255,255,0.1)';
            let bgColor = 'rgba(255,255,255,0.03)';
            
            if (showCorrectness) {
              if (isCorrect) {
                borderColor = '#10b981';
                bgColor = 'rgba(16, 185, 129, 0.1)';
              } else if (isSelected) {
                borderColor = '#ef4444';
                bgColor = 'rgba(239, 68, 68, 0.1)';
              }
            } else if (isSelected) {
              borderColor = '#6366f1';
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
                  color: '#f8fafc',
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
                  isCorrect ? <CheckCircle2 size={18} style={{ color: '#10b981' }} /> : 
                  (isSelected ? <XCircle size={18} style={{ color: '#ef4444' }} /> : null)
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
                borderLeft: `4px solid ${selectedAnswer === question.correctAnswer ? '#10b981' : '#ef4444'}`,
                borderRadius: '4px'
              }}>
                <h4 style={{ margin: '0 0 0.25rem 0', color: '#ffffff', fontSize: '0.95rem' }}>
                  {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5' }}>
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
