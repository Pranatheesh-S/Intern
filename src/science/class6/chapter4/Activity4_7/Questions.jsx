import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const questions = [
  {
    id: 1,
    title: "Quiz 1",
    question: "What is placed between the bar magnet and the compass needle in this activity?",
    options: [
      "An iron sheet",
      "A wooden piece",
      "A steel plate",
      "An aluminium rod"
    ],
    correctAnswer: "A wooden piece",
    explanation: "A wooden piece is placed between the magnet and the compass to observe whether the magnetic effect passes through it."
  },
  {
    id: 2,
    title: "Quiz 2",
    question: "Which of the following materials is tested in this activity?",
    options: [
      "Iron",
      "Steel",
      "Plastic",
      "Nickel"
    ],
    correctAnswer: "Plastic",
    explanation: "Plastic is one of the non-magnetic materials tested between the magnet and the compass needle."
  },
  {
    id: 3,
    title: "Quiz 3",
    question: "What happens to the compass needle when a cardboard sheet is placed between the magnet and the compass?",
    options: [
      "It stops moving completely.",
      "It still shows deflection.",
      "It points in the opposite direction.",
      "It becomes magnetic."
    ],
    correctAnswer: "It still shows deflection.",
    explanation: "The magnetic effect passes through cardboard, so the compass needle continues to deflect."
  },
  {
    id: 4,
    title: "Quiz 4",
    question: "What can be concluded from this activity?",
    options: [
      "Magnets work only in air.",
      "Magnetic effect cannot pass through any material.",
      "Magnetic effect can pass through non-magnetic materials.",
      "Wood becomes magnetic when placed near a magnet."
    ],
    correctAnswer: "Magnetic effect can pass through non-magnetic materials.",
    explanation: "The activity shows that materials like wood, cardboard, plastic, and glass do not block the magnetic effect."
  },
  {
    id: 5,
    title: "Quiz 5",
    question: "Which observation best supports the conclusion of this activity?",
    options: [
      "The compass needle shows similar deflection even when non-magnetic materials are placed between it and the magnet.",
      "The wooden block sticks to the magnet.",
      "The compass needle changes its colour.",
      "The magnet becomes weaker after the experiment."
    ],
    correctAnswer: "The compass needle shows similar deflection even when non-magnetic materials are placed between it and the magnet.",
    explanation: "The continued deflection of the compass needle shows that the magnetic effect passes through non-magnetic materials such as wood, cardboard, plastic, and glass."
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
      overflow: 'hidden',
      boxSizing: 'border-box' 
    }}>
      <div style={{ width: '100%', maxWidth: '1050px', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', padding: '0 0.5rem' }}>
          <h3 style={{ margin: 0, color: '#71717A', fontSize: '1.1rem', fontWeight: 700 }}>Test Your Knowledge</h3>
          <div style={{ color: '#F59E0B', fontSize: '1rem', fontWeight: 700 }}>
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        {/* Main Quiz Card */}
        <div className="glass-panel" style={{ 
          background: 'rgba(24, 24, 27, 0.95)', 
          backdropFilter: 'blur(10px)',
          border: '1.5px solid #3F3F46',
          borderRadius: '18px', 
          padding: '0.85rem 1.35rem', 
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.55rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Title */}
          <h3 style={{ margin: 0, color: '#F59E0B', fontSize: 'clamp(1.05rem, 1.5vw, 1.3rem)', fontWeight: 800 }}>
            {q.title}
          </h3>

          {/* Question Text */}
          <p style={{ margin: 0, fontSize: 'clamp(0.88rem, 1.3vw, 1.02rem)', lineHeight: '1.4', fontWeight: 600, color: '#FAFAFA' }}>
            {q.question}
          </p>

          {/* Option Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {q.options.map((option, index) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === q.correctAnswer;

              let bgColor = '#27272A';
              let borderColor = '#3F3F46';
              let icon = null;

              if (showFeedback) {
                if (isCorrect) {
                  bgColor = 'rgba(34, 197, 94, 0.2)';
                  borderColor = '#22C55E';
                  icon = <CheckCircle size={18} color="#22C55E" />;
                } else if (isSelected) {
                  bgColor = 'rgba(239, 68, 68, 0.2)';
                  borderColor = '#EF4444';
                  icon = <XCircle size={18} color="#EF4444" />;
                }
              } else if (isSelected) {
                borderColor = '#F59E0B';
                bgColor = 'rgba(245, 158, 11, 0.12)';
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
                    padding: '0.6rem 1.15rem',
                    borderRadius: '10px',
                    background: bgColor,
                    border: `1.5px solid ${borderColor}`,
                    color: '#FAFAFA',
                    cursor: showFeedback ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontSize: '0.98rem',
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
            <div style={{ marginTop: '0.45rem', animation: 'fadeIn 0.35s ease' }}>
              <div style={{ padding: '0.55rem 1.15rem', background: '#27272A', borderRadius: '12px', borderLeft: '4px solid #F59E0B', border: '1px solid #3F3F46', borderLeftWidth: '4px' }}>
                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#F59E0B' }}>Explanation</h4>
                <p style={{ margin: 0, color: '#FAFAFA', fontSize: '0.9rem', lineHeight: '1.4' }}>{q.explanation}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.45rem' }}>
                <button
                  onClick={handleNextQuestion}
                  style={{
                    padding: '0.55rem 1.8rem',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: '0.96rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
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
