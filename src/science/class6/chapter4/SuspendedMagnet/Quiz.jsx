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
          border: '1.5px solid #FDE68A',
          boxShadow: '0 8px 30px rgba(217, 119, 6, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#064E3B', fontWeight: 900 }}>Quiz Completed! 🎉</h2>
          
          <p style={{ color: '#065F46', margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>
            You scored <strong style={{ color: '#D97706' }}>{score}</strong> out of {quizData.length}
          </p>

          <button
            onClick={() => { if (onComplete) onComplete(score); }}
            className="gold-glow-btn"
            style={{
              padding: '0.9rem 2.8rem',
              fontSize: '1.1rem',
              marginTop: '0.6rem'
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
      padding: '0.5rem 1rem', 
      overflow: 'hidden',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '1100px', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', padding: '0 0.5rem', flexShrink: 0 }}>
          <h3 style={{ margin: 0, color: '#064E3B', fontSize: '1.25rem', fontWeight: 900 }}>Test Your Knowledge</h3>
          <div style={{ color: '#047857', fontSize: '1.05rem', fontWeight: 800 }}>
            Question {currentQuestion + 1} of {quizData.length}
          </div>
        </div>

        {/* Main Quiz Card */}
        <div style={{ 
          background: '#FFFFFF', 
          border: '1.5px solid #FDE68A',
          borderRadius: '24px', 
          padding: '1.8rem 2.4rem', 
          boxShadow: '0 8px 30px rgba(217, 119, 6, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Title */}
          <h3 style={{ margin: 0, color: '#064E3B', fontSize: '1.45rem', fontWeight: 900 }}>
            {currentQ.title}
          </h3>

          {/* Question Text Area */}
          <p style={{ margin: 0, fontSize: '1.18rem', lineHeight: 1.6, fontWeight: 700, color: '#065F46' }}>
            {currentQ.question}
          </p>

          {/* Option Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentQ.options.map((option, index) => {
              let bgColor = '#FFFFFF';
              let borderColor = '#FDE68A';
              let textColor = '#065F46';
              let icon = null;

              if (showResult) {
                if (index === currentQ.correctIndex) {
                  bgColor = '#DCFCE7';
                  borderColor = '#16A34A';
                  textColor = '#065F46';
                  icon = <CheckCircle size={22} color="#16A34A" />;
                } else if (index === selectedOption) {
                  bgColor = '#FEE2E2';
                  borderColor = '#EF4444';
                  textColor = '#991B1B';
                  icon = <XCircle size={22} color="#EF4444" />;
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
                    padding: '1.05rem 1.5rem',
                    borderRadius: '16px',
                    background: bgColor,
                    border: `1.5px solid ${borderColor}`,
                    color: textColor,
                    cursor: showResult ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontSize: '1.08rem',
                    fontWeight: 800,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    opacity: showResult && index !== currentQ.correctIndex && index !== selectedOption ? 0.65 : 1
                  }}
                >
                  <span>{option}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div style={{ marginTop: '0.6rem', animation: 'fadeIn 0.35s ease' }}>
              <div style={{ padding: '1rem 1.4rem', background: '#FFFBEB', borderRadius: '16px', borderLeft: '5px solid #D97706', border: '1.5px solid #FDE68A', borderLeftWidth: '5px' }}>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', fontWeight: 900, color: '#064E3B' }}>Explanation</h4>
                <p style={{ margin: 0, color: '#065F46', fontSize: '1rem', lineHeight: 1.55, fontWeight: 600 }}>{currentQ.explanation}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.9rem' }}>
                <button
                  onClick={handleNext}
                  className="gold-glow-btn"
                  style={{
                    padding: '0.9rem 2.4rem',
                    borderRadius: '30px',
                    fontSize: '1.05rem'
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
