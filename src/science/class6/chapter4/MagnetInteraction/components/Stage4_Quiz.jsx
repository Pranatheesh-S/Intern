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
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflowY: 'auto', padding: '1rem', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ 
          maxWidth: '520px', 
          width: '90%', 
          padding: '2.5rem 3rem', 
          textAlign: 'center', 
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)', 
          borderRadius: '24px', 
          border: '1.5px solid #FDE68A',
          boxShadow: '0 8px 30px rgba(217, 119, 6, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#064E3B', fontWeight: 900 }}>Quiz Completed! 🎉</h2>
          
          <p style={{ color: '#065F46', margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>
            You scored <strong style={{ color: '#047857' }}>{score}</strong> out of {QUESTIONS.length}
          </p>

          <button
            onClick={() => { if (onComplete) onComplete(score); }}
            className="gold-glow-btn"
            style={{
              padding: '0.9rem 2.8rem',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 900,
              cursor: 'pointer',
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
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', padding: '0 0.5rem', flexShrink: 0 }}>
          <h3 style={{ margin: 0, color: '#064E3B', fontSize: '1.25rem', fontWeight: 900 }}>Test Your Knowledge</h3>
          <div style={{ color: '#047857', fontSize: '1.02rem', fontWeight: 800 }}>
            Question {currentQ + 1} of {QUESTIONS.length}
          </div>
        </div>

        {/* Main Quiz Card */}
        <div className="glass-panel" style={{ 
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)', 
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
            {question.title}
          </h3>

          {/* Question Text */}
          <p style={{ margin: 0, fontSize: '1.16rem', lineHeight: '1.6', fontWeight: 600, color: '#065F46' }}>
            {question.question}
          </p>

          {/* Option Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {question.options.map((opt) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === question.correctAnswer;

              let bgColor = '#FFFFFF';
              let borderColor = '#FDE68A';
              let textColor = '#065F46';
              let icon = null;

              if (showResult) {
                if (isCorrect) {
                  bgColor = '#DCFCE7';
                  borderColor = '#10B981';
                  textColor = '#064E3B';
                  icon = <CheckCircle size={22} color="#10B981" />;
                } else if (isSelected) {
                  bgColor = '#FEE2E2';
                  borderColor = '#EF4444';
                  textColor = '#991B1B';
                  icon = <XCircle size={22} color="#EF4444" />;
                }
              } else if (isSelected) {
                borderColor = '#10B981';
                bgColor = '#DCFCE7';
                textColor = '#064E3B';
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
            <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ padding: '1rem 1.4rem', background: '#F0FDF4', borderRadius: '16px', border: '1.5px solid #A7F3D0', borderLeft: '5px solid #059669' }}>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', fontWeight: 900, color: '#064E3B' }}>Explanation</h4>
                <p style={{ margin: 0, color: '#065F46', fontSize: '1rem', lineHeight: '1.55', fontWeight: 600 }}>{question.explanation}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleNextQuestion}
                  className="gold-glow-btn"
                  style={{
                    padding: '0.9rem 2.4rem',
                    borderRadius: '30px',
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    cursor: 'pointer'
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
