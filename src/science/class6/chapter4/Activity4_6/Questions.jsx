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
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '40px',
              fontSize: '1.15rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
              transition: 'all 0.25s ease',
              marginTop: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#2563eb';
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
      overflowY: 'auto',
      boxSizing: 'border-box' 
    }}>
      <div style={{ width: '100%', maxWidth: '1050px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 700 }}>Test Your Knowledge</h3>
          <div style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600 }}>
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        {/* Main Quiz Card */}
        <div className="glass-panel" style={{ 
          background: 'var(--surface)', 
          border: '2px solid #818cf8',
          borderRadius: '20px', 
          padding: '1.25rem 1.75rem', 
          boxShadow: '0 12px 35px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          width: '100%',
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          boxSizing: 'border-box'
        }}>
          {/* Title */}
          <h3 style={{ margin: 0, color: '#6366f1', fontSize: 'clamp(1.15rem, 1.8vw, 1.45rem)', fontWeight: 800 }}>
            {q.title}
          </h3>

          {/* Question Text */}
          <p style={{ margin: 0, fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)', lineHeight: '1.45', fontWeight: 600, color: 'var(--text-heading)' }}>
            {q.question}
          </p>

          {/* Option Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {q.options.map((option, index) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === q.correctAnswer;

              let bgColor = 'var(--bg)';
              let borderColor = '#cbd5e1';
              let icon = null;

              if (showFeedback) {
                if (isCorrect) {
                  bgColor = 'rgba(16, 185, 129, 0.12)';
                  borderColor = '#10b981';
                  icon = <CheckCircle size={20} color="#10b981" />;
                } else if (isSelected) {
                  bgColor = 'rgba(239, 68, 68, 0.12)';
                  borderColor = '#ef4444';
                  icon = <XCircle size={20} color="#ef4444" />;
                }
              } else if (isSelected) {
                borderColor = '#6366f1';
                bgColor = 'rgba(99, 102, 241, 0.08)';
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
                    border: `2px solid ${borderColor}`,
                    color: 'var(--text)',
                    cursor: showFeedback ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    transition: 'all 0.25s ease',
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
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ padding: '0.75rem 1.15rem', background: 'rgba(99, 102, 241, 0.06)', borderRadius: '12px', borderLeft: '5px solid #6366f1' }}>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.02rem', fontWeight: 800, color: '#6366f1' }}>Explanation</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: '1.45' }}>{q.explanation}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleNext}
                  style={{
                    padding: '0.65rem 2rem',
                    background: 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '30px',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(255, 119, 0, 0.45)',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
