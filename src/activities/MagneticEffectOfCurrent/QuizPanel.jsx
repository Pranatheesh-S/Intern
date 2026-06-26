import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const QUESTIONS = [
  {
    id: 1,
    text: "What happens to the magnetic compass needle when the electric switch is turned ON?",
    options: [
      "It points randomly",
      "It deflects from its original direction",
      "It starts spinning continuously",
      "Nothing happens"
    ],
    correctAnswer: 1,
    explanation: "When electric current flows through the wire, it produces a magnetic field that interacts with the compass needle, causing it to deflect."
  },
  {
    id: 2,
    text: "When the switch is turned OFF and current stops flowing, what does the compass needle do?",
    options: [
      "Returns to its original North-South direction",
      "Remains in the deflected position",
      "Reverses its direction entirely",
      "Becomes permanently magnetized"
    ],
    correctAnswer: 0,
    explanation: "Once the current stops, the magnetic field disappears. The compass needle then aligns itself back with the Earth's natural magnetic field."
  },
  {
    id: 3,
    text: "What does this experiment (Oersted's experiment) demonstrate?",
    options: [
      "Magnets can produce electricity",
      "Heat is produced by electric current",
      "Electric current produces a magnetic effect",
      "Cardboard is a good conductor of electricity"
    ],
    correctAnswer: 2,
    explanation: "This experiment proves that an electric current flowing through a conductor creates a magnetic field around it, known as the magnetic effect of electric current."
  }
];

export default function QuizPanel() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleSelectAnswer = (index) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === QUESTIONS[currentQuestion].correctAnswer) {
      setScore(s => s + 1);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      if (score === QUESTIONS.length - 1) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 }
        });
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    return (
      <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text-heading)' }}>
          Quiz Completed!
        </h2>
        <div style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          color: score === QUESTIONS.length ? 'var(--success)' : 'var(--accent)',
          marginBottom: '1rem' 
        }}>
          {score} / {QUESTIONS.length}
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {score === QUESTIONS.length 
            ? "Perfect score! You have mastered the concept of the magnetic effect of electric current."
            : "Good effort! Review the experiment to understand how current affects the compass."}
        </p>
        <button className="primary" onClick={handleRetry} style={{ padding: '0.75rem 2rem' }}>
          Try Again
        </button>
      </div>
    );
  }

  const question = QUESTIONS[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="main-grid" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="status-badge neutral" style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
            Concept Check
          </span>
          <h2 style={{ margin: '0.5rem 0 0 0' }}>Knowledge Verification</h2>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          {question.text}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {question.options.map((option, index) => {
            let bgColor = 'var(--surface)';
            let borderColor = 'var(--border)';
            let textColor = 'var(--text-primary)';
            
            if (isAnswered) {
              if (index === question.correctAnswer) {
                bgColor = 'var(--success-bg)';
                borderColor = 'var(--success-border)';
                textColor = 'var(--success)';
              } else if (index === selectedAnswer) {
                bgColor = 'var(--danger-bg)';
                borderColor = 'var(--danger-border)';
                textColor = 'var(--danger)';
              } else {
                opacity = 0.6;
              }
            } else if (selectedAnswer === index) {
              bgColor = 'var(--accent-bg)';
              borderColor = 'var(--accent)';
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={isAnswered}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  color: textColor,
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  cursor: isAnswered ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: (isAnswered && index !== question.correctAnswer && index !== selectedAnswer) ? 0.5 : 1
                }}
              >
                <div style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  background: 'var(--card-bg)',
                  border: `1px solid ${borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span style={{ flex: 1 }}>{option}</span>
                
                {isAnswered && index === question.correctAnswer && <CheckCircle size={20} color="var(--success)" />}
                {isAnswered && index === selectedAnswer && index !== question.correctAnswer && <XCircle size={20} color="var(--danger)" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              marginTop: '2rem',
              padding: '1.25rem',
              borderRadius: '12px',
              background: isCorrect ? 'var(--success-bg)' : 'var(--danger-bg)',
              border: `1px solid ${isCorrect ? 'var(--success-border)' : 'var(--danger-border)'}`
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <HelpCircle size={20} style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)', flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', color: isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                  {isCorrect ? "Correct!" : "Not quite right."}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                  {question.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button 
            className="primary" 
            onClick={handleNext}
            disabled={!isAnswered}
            style={{ opacity: isAnswered ? 1 : 0.5, cursor: isAnswered ? 'pointer' : 'not-allowed' }}
          >
            {currentQuestion < QUESTIONS.length - 1 ? "Next Question" : "View Results"}
          </button>
        </div>
      </div>
    </div>
  );
}
