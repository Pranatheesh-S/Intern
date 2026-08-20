import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    title: "Quiz 1",
    question: "When the North pole of Magnet A is brought near the North pole of Magnet B, what happens?",
    options: ["They attract each other.", "They repel each other.", "They stick together permanently.", "Nothing happens."],
    correctAnswer: "They repel each other.",
    explanation: "Like poles (North–North or South–South) repel each other."
  },
  {
    id: 2,
    title: "Quiz 2",
    question: "Which pair of magnetic poles will attract each other?",
    options: ["North Pole and North Pole", "South Pole and South Pole", "North Pole and South Pole", "Two North Poles of the same magnet"],
    correctAnswer: "North Pole and South Pole",
    explanation: "Unlike poles (North and South) attract each other."
  },
  {
    id: 3,
    title: "Quiz 3",
    question: "What property of a magnet helps identify its poles in this activity?",
    options: ["Colour of the magnet", "Shape of the magnet", "Attraction and repulsion between magnets", "Weight of the magnet"],
    correctAnswer: "Attraction and repulsion between magnets",
    explanation: "By observing whether two poles attract or repel, the poles of a magnet can be identified."
  },
  {
    id: 4,
    title: "Quiz 4",
    question: "A student observes that two poles of different magnets push each other away. What can be concluded?",
    options: ["The magnets are not magnetic.", "The poles facing each other are unlike poles.", "The poles facing each other are like poles.", "The magnets have lost their magnetism."],
    correctAnswer: "The poles facing each other are like poles.",
    explanation: "Repulsion occurs only when like poles (North–North or South–South) face each other."
  },
  {
    id: 5,
    title: "Quiz 5",
    question: "Which statement correctly describes the behaviour of magnetic poles?",
    options: ["Like poles attract and unlike poles repel.", "All poles attract each other.", "Like poles repel and unlike poles attract.", "Magnetic poles neither attract nor repel."],
    correctAnswer: "Like poles repel and unlike poles attract.",
    explanation: "The fundamental property of magnets is that like poles repel, while unlike poles attract. This is confirmed through the activity."
  }
];

export default function Stage4_Quiz({ onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = QUESTIONS[currentQ];

  const handleOptionSelect = (option) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);
    
    if (option === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
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
          boxShadow: '0 8px 30px rgba(6, 78, 59, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#064E3B', fontWeight: 900 }}>Quiz Completed! 🎉</h2>
          
          <p style={{ color: '#334155', margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
            You scored {score} out of {QUESTIONS.length}
          </p>

          <button
            onClick={() => { if (onComplete) onComplete(score); }}
            style={{
              padding: '0.85rem 2.5rem',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '30px',
              fontSize: '1.05rem',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
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
      padding: '0.75rem 0.5rem', 
      boxSizing: 'border-box',
      overflowY: 'auto'
    }}>
      <div style={{ width: '100%', maxWidth: '1050px', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', padding: '0 0.5rem', flexShrink: 0 }}>
          <h3 style={{ margin: 0, color: '#064E3B', fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', fontWeight: 900 }}>Test Your Knowledge</h3>
          <div style={{ color: '#047857', fontSize: 'clamp(0.85rem, 1.3vw, 1rem)', fontWeight: 800 }}>
            Question {currentQ + 1} of {QUESTIONS.length}
          </div>
        </div>

        {/* Main Quiz Card */}
        <div className="glass-panel" style={{ 
          background: '#FFFFFF', 
          border: '1.5px solid #A7F3D0',
          borderRadius: '20px', 
          padding: '1.25rem 1.75rem', 
          boxShadow: '0 6px 20px rgba(6, 78, 59, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Title */}
          <h3 style={{ margin: 0, color: '#064E3B', fontSize: 'clamp(1.15rem, 1.8vw, 1.45rem)', fontWeight: 900 }}>
            {question.title}
          </h3>

          {/* Question Text */}
          <p style={{ margin: 0, fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)', lineHeight: '1.45', fontWeight: 600, color: '#334155' }}>
            {question.question}
          </p>

          {/* Option Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {question.options.map((opt, index) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === question.correctAnswer;

              let bgColor = '#FFFFFF';
              let borderColor = '#CBD5E1';
              let textColor = '#1E293B';
              let icon = null;

              if (showResult) {
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
                  key={opt}
                  onClick={() => handleOptionSelect(opt)}
                  disabled={showResult}
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
                    cursor: showResult ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontSize: '1rem',
                    fontWeight: 800,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    opacity: showResult && !isCorrect && !isSelected ? 0.6 : 1
                  }}
                >
                  <span>{opt}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Question Button */}
          {showResult && (
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem 1.15rem', background: '#F0FDF4', borderRadius: '12px', borderLeft: '4px solid #D97706', border: '1.5px solid #A7F3D0', borderLeftWidth: '4px' }}>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem', fontWeight: 900, color: '#064E3B' }}>Explanation</h4>
                <p style={{ margin: 0, color: '#334155', fontSize: '0.95rem', lineHeight: '1.5', fontWeight: 600 }}>{question.explanation}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                >
                  {currentQ === QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
