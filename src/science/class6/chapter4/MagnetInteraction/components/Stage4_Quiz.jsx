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
            You scored {score} out of {QUESTIONS.length}
          </p>

          <button
            onClick={() => { if (onComplete) onComplete(score); }}
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
            Finish Activity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1rem 0.5rem', 
      boxSizing: 'border-box' 
    }}>
      <div style={{ width: '100%', maxWidth: '1050px' }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 700 }}>Test Your Knowledge</h3>
          <div style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600 }}>
            Question {currentQ + 1} of {QUESTIONS.length}
          </div>
        </div>

        {/* Main Quiz Card */}
        <div className="glass-panel" style={{ 
          background: 'var(--surface)', 
          border: '2px solid #818cf8',
          borderRadius: '20px', 
          padding: '1.75rem 2.5rem', 
          boxShadow: '0 12px 35px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Title */}
          <h3 style={{ margin: 0, color: '#6366f1', fontSize: '1.45rem', fontWeight: 800 }}>
            {question.title}
          </h3>

          {/* Question Text */}
          <p style={{ margin: 0, fontSize: '1.2rem', lineHeight: '1.5', fontWeight: 600, color: 'var(--text-heading)' }}>
            {question.question}
          </p>

          {/* Option Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {question.options.map((opt, index) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === question.correctAnswer;

              let bgColor = 'var(--bg)';
              let borderColor = '#cbd5e1';
              let icon = null;

              if (showResult) {
                if (isCorrect) {
                  bgColor = 'rgba(16, 185, 129, 0.12)';
                  borderColor = '#10b981';
                  icon = <CheckCircle size={22} color="#10b981" />;
                } else if (isSelected) {
                  bgColor = 'rgba(239, 68, 68, 0.12)';
                  borderColor = '#ef4444';
                  icon = <XCircle size={22} color="#ef4444" />;
                }
              } else if (isSelected) {
                borderColor = '#6366f1';
                bgColor = 'rgba(99, 102, 241, 0.08)';
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
                    padding: '0.9rem 1.35rem',
                    borderRadius: '12px',
                    background: bgColor,
                    border: `2px solid ${borderColor}`,
                    color: 'var(--text)',
                    cursor: showResult ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    transition: 'all 0.25s ease',
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
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ padding: '1rem 1.35rem', background: 'rgba(99, 102, 241, 0.06)', borderRadius: '14px', borderLeft: '5px solid #6366f1' }}>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#6366f1' }}>Explanation</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.5' }}>{question.explanation}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleNextQuestion}
                  style={{
                    padding: '0.75rem 2.25rem',
                    background: 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '30px',
                    fontSize: '1.15rem',
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
