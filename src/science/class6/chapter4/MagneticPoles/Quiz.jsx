import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

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
            You scored {score} out of {quizData.length}
          </p>

          <button
            onClick={() => { if (onComplete) onComplete(score); }}
            style={{
              padding: '1.1rem 3rem',
              background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '40px',
              fontSize: '1.15rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(244, 63, 94, 0.4)',
              transition: 'all 0.25s ease',
              marginTop: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
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
      padding: '0.75rem 0.5rem', 
      boxSizing: 'border-box',
      overflowY: 'auto'
    }}>
      <div style={{ width: '100%', maxWidth: '1050px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', padding: '0 0.5rem', flexShrink: 0 }}>
          <h3 style={{ margin: 0, color: '#0F766E', fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', fontWeight: 700 }}>Test Your Knowledge</h3>
          <div style={{ color: '#0F766E', fontSize: 'clamp(0.85rem, 1.3vw, 1rem)', fontWeight: 600 }}>
            Question {currentQuestion + 1} of {quizData.length}
          </div>
        </div>

        <div className="glass-panel" style={{ 
          background: '#FFFFFF', 
          border: '2px solid #CCECE7',
          borderRadius: '20px', 
          padding: '1.25rem 1.75rem', 
          boxShadow: '0 12px 35px rgba(15, 118, 110, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ margin: 0, color: '#134E4A', fontSize: 'clamp(1.15rem, 1.8vw, 1.45rem)', fontWeight: 800 }}>{currentQ.title}</h3>
          <p style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)', margin: 0, lineHeight: '1.45', fontWeight: 600, color: '#115E59' }}>{currentQ.question}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {currentQ.options.map((option, index) => {
              let bgColor = '#F0FDF9';
              let borderColor = '#CCECE7';
              let icon = null;

              if (showResult) {
                if (index === currentQ.correctIndex) {
                  bgColor = 'rgba(16, 185, 129, 0.12)';
                  borderColor = '#10b981';
                  icon = <CheckCircle size={22} color="#10b981" />;
                } else if (index === selectedOption) {
                  bgColor = 'rgba(239, 68, 68, 0.12)';
                  borderColor = '#ef4444';
                  icon = <XCircle size={22} color="#ef4444" />;
                }
              } else if (index === selectedOption) {
                borderColor = '#0D9488';
                bgColor = 'rgba(13, 148, 136, 0.08)';
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
                    padding: '0.9rem 1.35rem',
                    borderRadius: '12px',
                    background: bgColor,
                    border: `2px solid ${borderColor}`,
                    color: '#134E4A',
                    cursor: showResult ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    transition: 'all 0.25s ease',
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
            <div style={{ marginTop: '1.25rem', animation: 'fadeIn 0.5s ease' }}>
              <div style={{ padding: '1rem 1.35rem', background: '#F0FDF9', borderRadius: '14px', borderLeft: '5px solid #0D9488' }}>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#134E4A' }}>Explanation</h4>
                <p style={{ margin: 0, color: '#115E59', fontSize: '1.1rem', lineHeight: '1.5' }}>{currentQ.explanation}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button
                  onClick={handleNext}
                  style={{
                    padding: '0.75rem 2.25rem',
                    background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '30px',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(244, 63, 94, 0.4)',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
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
