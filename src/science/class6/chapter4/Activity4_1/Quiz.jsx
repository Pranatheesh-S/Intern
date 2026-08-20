import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const quizData = [
  {
    id: 1,
    title: "Predict Before Testing",
    question: "Before bringing a magnet near a plastic ruler, what is the most reasonable prediction?",
    options: [
      "It will be strongly attracted because it is long.",
      "It will be attracted because it is green.",
      "It will not be attracted because plastic is a non-magnetic material.",
      "It will become a magnet immediately."
    ],
    correctIndex: 2,
    explanation: "Plastic is a non-magnetic material, so it is not attracted to a magnet. The size or colour of an object does not determine whether it is magnetic."
  },
  {
    id: 2,
    title: "Identify the Material",
    question: "Which of the following objects is most likely to be attracted to a magnet?",
    options: [
      "Wooden pencil",
      "Plastic ruler",
      "Iron nail",
      "Rubber eraser"
    ],
    correctIndex: 2,
    explanation: "An iron nail is made of a magnetic material, so it is attracted to a magnet. Wood, plastic, and rubber are non-magnetic materials."
  },
  {
    id: 3,
    title: "Identify the Magnetic Material",
    question: "Which object is most likely to be attracted by a magnet?",
    options: [
      "Glass tumbler",
      "Steel paper clip",
      "Cotton handkerchief",
      "Plastic sharpener"
    ],
    correctIndex: 1,
    explanation: "A paper clip made of steel contains a magnetic material, so it is attracted to a magnet. Glass, cotton, and plastic are non-magnetic."
  },
  {
    id: 4,
    title: "Understanding Predictions and Observations",
    question: "Why do students record both prediction and observation in the activity table?",
    options: [
      "To decorate the activity record.",
      "To compare what they expected with what actually happened.",
      "To count how many objects were used.",
      "To identify the colour of each object."
    ],
    correctIndex: 1,
    explanation: "Making a prediction helps students think before experimenting, while the observation shows the actual result. Comparing both improves scientific thinking."
  },
  {
    id: 5,
    title: "Drawing a Conclusion",
    question: "After testing many classroom objects, a student finds that only the iron nail, steel key, and paper clip stick to the magnet. What is the best conclusion?",
    options: [
      "Magnets attract objects of every shape.",
      "Magnets attract all heavy objects.",
      "Magnets attract only objects made of magnetic materials.",
      "Magnets attract only new objects."
    ],
    correctIndex: 2,
    explanation: "The activity shows that only objects made of magnetic materials (such as iron and steel) are attracted to magnets. The attraction does not depend on the object's age, size, or weight."
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
      overflow: 'hidden'
    }}>
      <div style={{ width: '100%', maxWidth: '1050px', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', padding: '0 0.5rem', flexShrink: 0 }}>
          <h3 style={{ margin: 0, color: '#71717A', fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', fontWeight: 700 }}>Test Your Knowledge</h3>
          <div style={{ color: '#F59E0B', fontSize: 'clamp(0.85rem, 1.3vw, 1rem)', fontWeight: 700 }}>
            Question {currentQuestion + 1} of {quizData.length}
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
            {currentQ.title}
          </h3>

          {/* Question Text */}
          <p style={{ margin: 0, fontSize: 'clamp(0.88rem, 1.3vw, 1.02rem)', lineHeight: '1.4', fontWeight: 600, color: '#FAFAFA' }}>
            {currentQ.question}
          </p>

          {/* Option Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {currentQ.options.map((option, index) => {
              let bgColor = '#27272A';
              let borderColor = '#3F3F46';
              let icon = null;

              if (showResult) {
                if (index === currentQ.correctIndex) {
                  bgColor = 'rgba(34, 197, 94, 0.2)';
                  borderColor = '#22C55E';
                  icon = <CheckCircle size={18} color="#22C55E" />;
                } else if (index === selectedOption) {
                  bgColor = 'rgba(239, 68, 68, 0.2)';
                  borderColor = '#EF4444';
                  icon = <XCircle size={18} color="#EF4444" />;
                }
              } else if (index === selectedOption) {
                borderColor = '#F59E0B';
                bgColor = 'rgba(245, 158, 11, 0.12)';
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
                    padding: '0.6rem 1.15rem',
                    borderRadius: '10px',
                    background: bgColor,
                    border: `1.5px solid ${borderColor}`,
                    color: '#FAFAFA',
                    cursor: showResult ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontSize: '0.98rem',
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
            <div style={{ marginTop: '0.45rem', animation: 'fadeIn 0.35s ease' }}>
              <div style={{ padding: '0.55rem 1.15rem', background: '#27272A', borderRadius: '12px', borderLeft: '4px solid #F59E0B', border: '1px solid #3F3F46', borderLeftWidth: '4px' }}>
                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.92rem', fontWeight: 800, color: '#F59E0B' }}>Explanation</h4>
                <p style={{ margin: 0, color: '#FAFAFA', fontSize: '0.9rem', lineHeight: '1.4' }}>{currentQ.explanation}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.45rem' }}>
                <button
                  onClick={handleNext}
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
