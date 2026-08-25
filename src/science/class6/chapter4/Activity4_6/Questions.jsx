import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const questions = [
  {
    id: 1,
    title: "Quiz 1",
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
    title: "Quiz 2",
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
    title: "Quiz 3",
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
    title: "Quiz 4",
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
    title: "Quiz 5",
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

  const q = questions[currentQuestion];

  const handleOptionSelect = (option) => {
    if (showFeedback) return;
    setSelectedOption(option);
    setShowFeedback(true);
    
    if (option === q.correctAnswer) {
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
    }
  };

  if (isFinished) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflowY: 'auto', padding: '1rem', boxSizing: 'border-box' }}>
        <div style={{ 
          maxWidth: '520px', 
          width: '90%', 
          padding: '2.5rem 3rem', 
          textAlign: 'center', 
          background: '#ffffff', 
          borderRadius: '30px', 
          border: '1px solid #cbd5e1',
          boxShadow: '0 15px 40px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#1e293b', fontWeight: 800 }}>Quiz Completed!</h2>
          
          <p style={{ color: '#475569', margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>
            You scored {score} out of {questions.length}
          </p>

          <button
            onClick={() => {
              if (onComplete) onComplete(score);
              if (onNext) onNext();
            }}
            style={{
              padding: '1.1rem 3rem',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '40px',
              fontSize: '1.15rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(217, 119, 6, 0.4)',
              transition: 'all 0.25s ease',
              marginTop: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(217, 119, 6, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(217, 119, 6, 0.4)';
            }}
          >
            Proceed to Challenge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '0.5rem', 
      overflow: 'hidden',
      boxSizing: 'border-box' 
    }}>
      <div style={{ width: '100%', maxWidth: '1050px', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', padding: '0 0.5rem', flexShrink: 0 }}>
          <h3 style={{ margin: 0, color: '#064E3B', fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)', fontWeight: 900 }}>Test Your Knowledge</h3>
          <div style={{ color: '#047857', fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)', fontWeight: 800 }}>
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        {/* Main Quiz Card matching Poles of Magnet */}
        <div className="glass-panel" style={{ 
          background: '#FFFFFF', 
          border: '1.5px solid #A7F3D0',
          borderRadius: '20px', 
          padding: '1.25rem 1.75rem', 
          boxShadow: '0 6px 20px rgba(6, 78, 59, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Title */}
          <h3 style={{ margin: 0, color: '#064E3B', fontSize: 'clamp(1.15rem, 1.5vw, 1.35rem)', fontWeight: 900 }}>
            {q.title}
          </h3>

          {/* Question Text */}
          <p style={{ fontSize: 'clamp(0.92rem, 1.3vw, 1.05rem)', margin: 0, lineHeight: '1.5', fontWeight: 600, color: '#334155' }}>
            {q.question}
          </p>

          {/* Option Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {q.options.map((option, index) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === q.correctAnswer;

              let bgColor = '#FFFFFF';
              let borderColor = '#CBD5E1';
              let textColor = '#1E293B';
              let icon = null;

              if (showFeedback) {
                if (isCorrect) {
                  bgColor = '#DCFCE7';
                  borderColor = '#16A34A';
                  textColor = '#065F46';
                  icon = <CheckCircle size={18} color="#16A34A" />;
                } else if (isSelected) {
                  bgColor = '#FEE2E2';
                  borderColor = '#EF4444';
                  textColor = '#991B1B';
                  icon = <XCircle size={18} color="#EF4444" />;
                }
              } else if (isSelected) {
                borderColor = '#D97706';
                bgColor = '#FEF3C7';
                textColor = '#92400E';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  disabled={showFeedback}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '12px',
                    background: bgColor,
                    border: `1.5px solid ${borderColor}`,
                    color: textColor,
                    cursor: showFeedback ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontSize: '0.96rem',
                    fontWeight: 800,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    opacity: showFeedback && !isCorrect && !isSelected ? 0.6 : 1
                  }}
                >
                  <span>{option}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Question Button */}
          {showFeedback && (
            <div style={{ marginTop: '0.5rem', animation: 'fadeIn 0.35s ease' }}>
              <div style={{ padding: '0.75rem 1.15rem', background: '#F0FDF4', borderRadius: '12px', border: '1.5px solid #A7F3D0', borderLeft: '4px solid #D97706' }}>
                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.92rem', fontWeight: 900, color: '#064E3B' }}>Explanation</h4>
                <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: 600 }}>{q.explanation}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.6rem' }}>
                <button
                  onClick={handleNextQuestion}
                  style={{
                    padding: '0.75rem 2rem',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: '0.96rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {currentQuestion === questions.length - 1 ? 'Proceed to Challenge Mode' : 'Next Question'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
