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
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)', 
          borderRadius: '30px', 
          border: '1.5px solid #FDE68A',
          boxShadow: '0 8px 30px rgba(217, 119, 6, 0.08)',
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
            className="gold-glow-btn"
            style={{
              padding: '1rem 3rem',
              borderRadius: '40px',
              fontSize: '1.15rem',
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
          borderRadius: '20px', 
          padding: '1.25rem 1.75rem', 
          boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)',
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
                  onClick={handleNext}
                  className="gold-glow-btn"
                  style={{
                    padding: '0.8rem 2.2rem',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                >
                  {currentQuestion === questions.length - 1 ? 'Finish & View Score' : 'Next Question'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
