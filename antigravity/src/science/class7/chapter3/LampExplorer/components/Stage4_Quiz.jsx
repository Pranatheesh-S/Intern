import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';

const quizQuestions = [
  {
    id: 1,
    question: "Which part of an incandescent lamp actually glows to produce light?",
    options: ["Glass Bulb", "Filament", "Metal Case", "Metal Tip"],
    correctAnswer: 1,
    explanation: "The filament is a very thin wire that becomes extremely hot and glows when electric current passes through it."
  },
  {
    id: 2,
    question: "Does an LED (Light Emitting Diode) contain a filament?",
    options: ["Yes, a very small one", "No, it uses a semiconductor", "Yes, but it doesn't get hot", "Only in red LEDs"],
    correctAnswer: 1,
    explanation: "LEDs do not have filaments! They produce light by passing current through a semiconductor material, which makes them very efficient."
  },
  {
    id: 3,
    question: "When looking at an LED, how can you identify the positive (+) terminal?",
    options: ["It is the shorter lead", "It is painted red", "It is the longer lead", "It is thicker than the other"],
    correctAnswer: 2,
    explanation: "The longer lead of an LED is the positive (+) terminal, and the shorter lead is the negative (−) terminal."
  },
  {
    id: 4,
    question: "Which type of lamp produces MORE heat while operating?",
    options: ["Incandescent Lamp", "LED", "They produce the same amount", "Neither produces heat"],
    correctAnswer: 0,
    explanation: "Incandescent lamps produce light by heating the filament until it glows. Most of the energy is actually wasted as heat! LEDs run much cooler."
  },
  {
    id: 5,
    question: "What happens if you connect an LED backwards (reverse polarity) in a simple circuit?",
    options: ["It glows much brighter", "It changes color", "It explodes", "It does not glow at all"],
    correctAnswer: 3,
    explanation: "Unlike incandescent bulbs, LEDs only allow current to flow in one direction. If connected backwards, the circuit is broken and it will not glow."
  }
];

export default function Stage4_Quiz({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (index) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    const percentage = (score / quizQuestions.length) * 100;
    let message = "";
    if (percentage === 100) message = "Perfect Score! You are a Lamp Expert!";
    else if (percentage >= 80) message = "Great job! You know your circuits well.";
    else if (percentage >= 60) message = "Good effort! Review the differences between LEDs and filaments.";
    else message = "Keep learning! Try the lab again to solidify the concepts.";

    return (
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <CheckCircle2 size={64} style={{ color: 'var(--success)' }} />
        <div>
          <h2 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', fontSize: '2rem' }}>Quiz Complete!</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
            You scored {score} out of {quizQuestions.length} ({percentage}%)
          </p>
        </div>
        
        <div style={{ padding: '1.5rem', background: 'var(--surface)', borderRadius: '12px', width: '100%', border: '1px solid var(--border)' }}>
          <p style={{ margin: 0, color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.1rem' }}>{message}</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem' }}>
          <button 
            onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswer(null);
              setIsAnswered(false);
              setScore(0);
              setShowResults(false);
            }}
            className="outline"
            style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCcw size={18} /> Retake Quiz
          </button>
          
          <button 
            onClick={() => onComplete({ score, total: quizQuestions.length })}
            className="primary"
            style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          >
            Finish Lab <CheckCircle2 size={18} />
          </button>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.5rem' }}>Concept Check</h3>
        <div style={{ background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          Question {currentQuestion + 1} of {quizQuestions.length}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h4 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)', lineHeight: '1.5' }}>
          {question.question}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            let statusColor = 'var(--border)';
            let bgColor = 'var(--surface)';
            let textColor = 'var(--text-secondary)';

            if (isAnswered) {
              if (index === question.correctAnswer) {
                statusColor = 'var(--success)';
                bgColor = 'var(--success-bg)';
                textColor = 'var(--success)';
              } else if (isSelected) {
                statusColor = '#ef4444';
                bgColor = 'rgba(239, 68, 68, 0.1)';
                textColor = '#ef4444';
              }
            } else if (isSelected) {
              statusColor = 'var(--accent)';
              bgColor = 'var(--accent-bg)';
              textColor = 'var(--accent)';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.5rem',
                  background: bgColor,
                  border: `2px solid ${statusColor}`,
                  borderRadius: '12px',
                  color: textColor,
                  fontSize: '1.05rem',
                  textAlign: 'left',
                  cursor: isAnswered ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  transform: (isSelected && !isAnswered) ? 'translateX(5px)' : 'none'
                }}
              >
                <div style={{ 
                  width: '24px', height: '24px', borderRadius: '50%', 
                  border: `2px solid ${statusColor}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isSelected || (isAnswered && index === question.correctAnswer) ? statusColor : 'transparent'
                }}>
                  {(isAnswered && index === question.correctAnswer) && <CheckCircle2 size={16} color="white" />}
                  {(isAnswered && isSelected && index !== question.correctAnswer) && <XCircle size={16} color="white" />}
                </div>
                {option}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ 
                marginTop: '1rem', padding: '1.5rem', 
                background: 'rgba(59, 130, 246, 0.1)', 
                borderLeft: '4px solid var(--accent)',
                borderRadius: '0 8px 8px 0',
                display: 'flex', flexDirection: 'column', gap: '0.5rem'
              }}>
                <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>Explanation:</span>
                <span style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{question.explanation}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {!isAnswered ? (
          <button 
            className="primary"
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}
          >
            Check Answer
          </button>
        ) : (
          <button 
            className="primary"
            onClick={handleNext}
            style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'View Results'} <ArrowRight size={20} />
          </button>
        )}
      </div>

    </div>
  );
}
