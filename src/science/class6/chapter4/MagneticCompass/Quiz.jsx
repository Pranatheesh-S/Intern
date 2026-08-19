import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const quizData = [
  {
    id: 1,
    title: "Quiz 1",
    question: "What is the main purpose of stroking an iron needle with one pole of a bar magnet repeatedly in the same direction?",
    options: [
      "To clean the needle",
      "To sharpen the needle",
      "To make the needle magnetic",
      "To change the colour of the needle"
    ],
    correctIndex: 2,
    explanation: "Repeated stroking in the same direction transfers magnetic properties to the iron needle, making it a magnet."
  },
  {
    id: 2,
    title: "Quiz 2",
    question: "Why should the bar magnet be lifted after each stroke instead of moving it back over the needle?",
    options: [
      "To avoid scratching the needle",
      "To ensure all strokes are made in the same direction",
      "To cool the magnet",
      "To increase the weight of the needle"
    ],
    correctIndex: 1,
    explanation: "Lifting the magnet after each stroke maintains a single stroking direction, which is necessary to magnetise the needle effectively."
  },
  {
    id: 3,
    title: "Quiz 3",
    question: "How can you confirm that the iron needle has become magnetic?",
    options: [
      "It changes its colour.",
      "It becomes heavier.",
      "It attracts small iron objects such as pins.",
      "It becomes longer."
    ],
    correctIndex: 2,
    explanation: "A magnetised needle attracts iron objects like pins, indicating that it has become magnetic."
  },
  {
    id: 4,
    title: "Quiz 4",
    question: "What happens when the magnetised needle is floated on a cork in water?",
    options: [
      "It sinks immediately.",
      "It remains in a random direction.",
      "It settles in the North–South direction.",
      "It rotates continuously without stopping."
    ],
    correctIndex: 2,
    explanation: "A freely floating magnetised needle aligns itself in the North–South direction due to Earth's magnetic field."
  },
  {
    id: 5,
    title: "Quiz 5",
    question: "What can be concluded if the magnetised needle always points in the same direction after being rotated?",
    options: [
      "The needle has become non-magnetic.",
      "The needle behaves like a freely suspended magnet.",
      "The cork has become magnetic.",
      "The water is magnetic."
    ],
    correctIndex: 1,
    explanation: "A magnetised needle consistently aligns in the North–South direction, just like a freely suspended magnet."
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
      height: '100%',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '0.5rem', 
      boxSizing: 'border-box',
      overflowY: 'auto'
    }}>
      <div style={{ width: '100%', maxWidth: '1050px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', padding: '0 0.5rem', flexShrink: 0 }}>
          <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', fontWeight: 700 }}>Test Your Knowledge</h3>
          <div style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.85rem, 1.3vw, 1rem)', fontWeight: 600 }}>
            Question {currentQuestion + 1} of {quizData.length}
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
            {currentQ.title}
          </h3>

          {/* Question Text */}
          <p style={{ margin: 0, fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)', lineHeight: '1.45', fontWeight: 600, color: 'var(--text-heading)' }}>
            {currentQ.question}
          </p>

          {/* Option Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {currentQ.options.map((option, index) => {
              let bgColor = 'var(--bg)';
              let borderColor = '#cbd5e1';
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
                borderColor = '#6366f1';
                bgColor = 'rgba(99, 102, 241, 0.08)';
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
                    color: 'var(--text)',
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

          {/* Explanation & Next Question Button */}
          {showResult && (
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ padding: '1rem 1.35rem', background: 'rgba(99, 102, 241, 0.06)', borderRadius: '14px', borderLeft: '5px solid #6366f1' }}>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#6366f1' }}>Explanation</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.5' }}>{currentQ.explanation}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleNext}
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
