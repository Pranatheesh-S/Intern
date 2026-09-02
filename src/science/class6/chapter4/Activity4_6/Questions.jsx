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
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)', 
          borderRadius: '30px', 
          border: '1.5px solid #FDE68A',
          boxShadow: '0 15px 40px rgba(217, 119, 6, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <h2 style={{ fontSize: '2rem', margin: 0, color: '#064E3B', fontWeight: 900 }}>Quiz Completed!</h2>
          
          <p style={{ color: '#065F46', margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
            You scored {score} out of {questions.length}
          </p>

          <button
            onClick={() => {
              if (onComplete) onComplete(score);
              if (onNext) onNext();
            }}
            className="gold-glow-btn"
            style={{
              padding: '1.1rem 3rem',
              borderRadius: '40px',
              fontSize: '1.18rem',
              fontWeight: 900,
              cursor: 'pointer',
              marginTop: '0.5rem'
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
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)', 
          border: '1.5px solid #FDE68A',
          borderRadius: '24px', 
          padding: '1.5rem 2rem', 
          boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Title */}
          <h3 style={{ margin: 0, color: '#064E3B', fontSize: 'clamp(1.2rem, 1.5vw, 1.4rem)', fontWeight: 900 }}>
            {q.title}
          </h3>

          {/* Question Text */}
          <p style={{ fontSize: 'clamp(0.98rem, 1.3vw, 1.12rem)', margin: 0, lineHeight: '1.55', fontWeight: 600, color: '#064E3B' }}>
            {q.question}
          </p>

          {/* Option Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {q.options.map((option, index) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === q.correctAnswer;

              let bgColor = '#FFFFFF';
              let borderColor = '#FDE68A';
              let textColor = '#064E3B';
              let icon = null;

              if (showFeedback) {
                if (isCorrect) {
                  bgColor = '#DCFCE7';
                  borderColor = '#16A34A';
                  textColor = '#065F46';
                  icon = <CheckCircle size={20} color="#16A34A" />;
                } else if (isSelected) {
                  bgColor = '#FEE2E2';
                  borderColor = '#EF4444';
                  textColor = '#991B1B';
                  icon = <XCircle size={20} color="#EF4444" />;
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
                    padding: '0.85rem 1.35rem',
                    borderRadius: '16px',
                    background: bgColor,
                    border: `1.5px solid ${borderColor}`,
                    color: textColor,
                    cursor: showFeedback ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontSize: '1.02rem',
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
              <div style={{ padding: '0.85rem 1.25rem', background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #FDE68A', borderLeft: '5px solid #D97706' }}>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 900, color: '#064E3B' }}>Explanation</h4>
                <p style={{ margin: 0, color: '#065F46', fontSize: '0.96rem', lineHeight: '1.55', fontWeight: 600 }}>{q.explanation}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button
                  onClick={handleNext}
                  className="gold-glow-btn"
                  style={{
                    padding: '0.85rem 2.25rem',
                    borderRadius: '25px',
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
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
