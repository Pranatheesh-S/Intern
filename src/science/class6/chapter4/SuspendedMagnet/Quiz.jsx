import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const quizData = [
  {
    id: 1,
    title: "Quiz 1",
    question: "When a bar magnet is suspended freely, which direction does its North pole point towards?",
    options: [
      "Geographic North",
      "Geographic South",
      "Geographic East",
      "Geographic West"
    ],
    correctIndex: 0,
    explanation: "A freely suspended bar magnet always aligns itself along the Earth's North-South magnetic axis. The North-seeking pole points toward Geographic North."
  },
  {
    id: 2,
    title: "Quiz 2",
    question: "If you rotate a freely suspended magnet and let it settle, where will it point?",
    options: [
      "Random direction every time",
      "Always along the North-South direction",
      "Always towards the Sun",
      "Always along the East-West direction"
    ],
    correctIndex: 1,
    explanation: "No matter how many times you spin or disturb a freely suspended magnet, it will always come to rest along the exact same North-South line."
  },
  {
    id: 3,
    title: "Quiz 3",
    question: "Which ancient device used a freely suspended magnet or magnetic needle to find directions?",
    options: [
      "Sundial",
      "Magnetic Compass",
      "Astrolabe",
      "Telescope"
    ],
    correctIndex: 1,
    explanation: "A magnetic compass contains a light magnetized needle pivoted on a pin that rotates freely to indicate directions."
  }
];

export default function Quiz({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = quizData[currentQuestion];

  const handleOptionSelect = (index) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    if (index === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
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
          background: '#FFFFFF', 
          borderRadius: '24px', 
          border: '1.5px solid #A7F3D0',
          boxShadow: '0 8px 25px rgba(6, 78, 59, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#064E3B', fontWeight: 900 }}>Quiz Completed! 🎉</h2>
          
          <p style={{ color: '#334155', margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
            You scored {score} out of {quizData.length}
          </p>

          <button
            onClick={() => { if (onComplete) onComplete(score); }}
            style={{
              padding: '1.1rem 3rem',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '40px',
              fontSize: '1.15rem',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(217, 119, 6, 0.4)',
              transition: 'all 0.25s ease',
              marginTop: '0.5rem'
            }}
          >
            Finish Activity
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', padding: '0 0.5rem', flexShrink: 0 }}>
          <h3 style={{ margin: 0, color: '#047857', fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', fontWeight: 800 }}>Test Your Knowledge</h3>
          <div style={{ color: '#D97706', fontSize: 'clamp(0.85rem, 1.3vw, 1rem)', fontWeight: 800 }}>
            Question {currentQuestion + 1} of {quizData.length}
          </div>
        </div>

        {/* Main Quiz Card (Sage Mint Light Theme) */}
        <div style={{ 
          background: '#FFFFFF', 
          border: '1.5px solid #A7F3D0',
          borderRadius: '24px', 
          padding: '1.25rem 1.75rem', 
          boxShadow: '0 8px 25px rgba(6, 78, 59, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Title */}
          <h3 style={{ margin: 0, color: '#D97706', fontSize: 'clamp(1.15rem, 1.6vw, 1.4rem)', fontWeight: 900 }}>
            {currentQ.title}
          </h3>

          {/* Question Text Area */}
          <p style={{ margin: 0, fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', lineHeight: '1.5', fontWeight: 700, color: '#064E3B' }}>
            {currentQ.question}
          </p>

          {/* Option Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {currentQ.options.map((option, index) => {
              let bgColor = '#F8FAFC';
              let borderColor = '#CBD5E1';
              let textColor = '#1E293B';
              let icon = null;

              if (showResult) {
                if (index === currentQ.correctIndex) {
                  bgColor = '#DCFCE7';
                  borderColor = '#16A34A';
                  textColor = '#065F46';
                  icon = <CheckCircle size={20} color="#16A34A" />;
                } else if (index === selectedOption) {
                  bgColor = '#FEE2E2';
                  borderColor = '#EF4444';
                  textColor = '#991B1B';
                  icon = <XCircle size={20} color="#EF4444" />;
                }
              } else if (index === selectedOption) {
                borderColor = '#D97706';
                bgColor = '#FEF3C7';
                textColor = '#92400E';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showResult}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '14px',
                    background: bgColor,
                    border: `1.5px solid ${borderColor}`,
                    color: textColor,
                    cursor: showResult ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontSize: '1rem',
                    fontWeight: 700,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                    opacity: showResult && index !== currentQ.correctIndex && index !== selectedOption ? 0.65 : 1
                  }}
                >
                  <span>{option}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Question Button */}
          {showResult && (
            <div style={{ marginTop: '0.55rem', animation: 'fadeIn 0.35s ease' }}>
              <div style={{ padding: '0.85rem 1.25rem', background: '#F0FDF4', borderRadius: '16px', borderLeft: '4px solid #D97706', border: '1.5px solid #A7F3D0', borderLeftWidth: '5px' }}>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 900, color: '#D97706' }}>Explanation</h4>
                <p style={{ margin: 0, color: '#334155', fontSize: '0.92rem', lineHeight: '1.5', fontWeight: 600 }}>{currentQ.explanation}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button
                  onClick={handleNext}
                  style={{
                    padding: '0.75rem 2rem',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '30px',
                    fontSize: '1rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(217, 119, 6, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {currentQuestion === quizData.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
