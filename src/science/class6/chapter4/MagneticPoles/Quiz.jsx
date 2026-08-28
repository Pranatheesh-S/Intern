import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './MagneticPoles.css';

const quizData = [
  {
    id: 1,
    title: "Quiz 1",
    question: "Where do most iron filings stick on a bar magnet?",
    options: [
      "At the centre",
      "At the poles (ends)",
      "Only on one side",
      "Nowhere"
    ],
    correctIndex: 1,
    explanation: "Most iron filings collect at the two ends of a bar magnet, called the poles."
  },
  {
    id: 2,
    title: "Quiz 2",
    question: "What do iron filings help us observe?",
    options: [
      "The colour of the magnet",
      "The magnetic effect around the magnet",
      "The weight of the magnet",
      "The temperature of the magnet"
    ],
    correctIndex: 1,
    explanation: "Iron filings show where the magnetic effect is strongest around a magnet."
  },
  {
    id: 3,
    title: "Quiz 3",
    question: "Which part of a bar magnet attracts the maximum number of iron filings?",
    options: [
      "Middle",
      "Poles",
      "Flat surface only",
      "Entire magnet equally"
    ],
    correctIndex: 1,
    explanation: "The magnetic force is strongest at the poles, so more iron filings stick there."
  },
  {
    id: 4,
    title: "Quiz 4",
    question: "Can a magnet have only one pole?",
    options: [
      "Yes, only North Pole",
      "Yes, only South Pole",
      "No, every magnet has both North and South poles.",
      "Only broken magnets have one pole."
    ],
    correctIndex: 2,
    explanation: "A magnet always has both a North Pole and a South Pole, even if it is broken."
  },
  {
    id: 5,
    title: "Quiz 5",
    question: "If a bar magnet is broken into two pieces, what will each piece become?",
    options: [
      "One piece with N pole, one with S pole",
      "Two complete magnets, each with N and S poles",
      "Pieces with no poles",
      "Pieces with only North poles"
    ],
    correctIndex: 1,
    explanation: "When a magnet is broken in half, each piece automatically forms its own pair of North and South poles."
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
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflowY: 'auto', padding: '1rem', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }}>
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
          gap: '1.25rem'
        }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#92400E', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 900 }}>Quiz Completed! 🎉</h2>
          
          <p style={{ color: '#78350F', margin: 0, fontSize: '1.2rem', fontWeight: 600, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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
      boxSizing: 'border-box',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '1100px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', padding: '0 0.5rem', flexShrink: 0 }}>
          <h3 style={{ margin: 0, color: '#92400E', fontSize: '1.25rem', fontWeight: 900 }}>Test Your Knowledge</h3>
          <div style={{ color: '#B45309', fontSize: '1.02rem', fontWeight: 800 }}>
            Question {currentQuestion + 1} of {quizData.length}
          </div>
        </div>

        <div className="glass-panel" style={{ 
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
          <h3 style={{ margin: 0, color: '#92400E', fontSize: '1.45rem', fontWeight: 900 }}>{currentQ.title}</h3>
          <p style={{ fontSize: '1.16rem', margin: 0, lineHeight: 1.6, fontWeight: 600, color: '#78350F' }}>{currentQ.question}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentQ.options.map((option, index) => {
              let bgColor = '#FFFFFF';
              let borderColor = '#FDE68A';
              let textColor = '#78350F';
              let icon = null;

              if (showResult) {
                if (index === currentQ.correctIndex) {
                  bgColor = '#FEF3C7';
                  borderColor = '#D97706';
                  textColor = '#92400E';
                  icon = <CheckCircle size={22} color="#D97706" />;
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
                    fontSize: '1.06rem',
                    fontWeight: 700,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    opacity: showResult && index !== currentQ.correctIndex && index !== selectedOption ? 0.6 : 1
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
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', fontWeight: 900, color: '#92400E' }}>Explanation</h4>
                <p style={{ margin: 0, color: '#78350F', fontSize: '1rem', lineHeight: 1.55, fontWeight: 600 }}>{currentQ.explanation}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.9rem' }}>
                <button
                  onClick={handleNext}
                  className="gold-glow-btn"
                  style={{
                    padding: '0.9rem 2.4rem',
                    fontSize: '1.05rem',
                    borderRadius: '30px'
                  }}
                >
                  {isFinished ? 'Finish Quiz' : 'Next Question'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
