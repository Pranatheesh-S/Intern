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
            You scored {score} out of {quizData.length}
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
      padding: '0.25rem 0.5rem', 
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div style={{ width: '100%', maxWidth: '1050px', display: 'flex', flexDirection: 'column' }}>
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', padding: '0 0.5rem', flexShrink: 0 }}>
          <h3 style={{ margin: 0, color: '#064E3B', fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)', fontWeight: 900 }}>Test Your Knowledge</h3>
          <div style={{ color: '#047857', fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)', fontWeight: 800 }}>
            Question {currentQuestion + 1} of {quizData.length}
          </div>
        </div>

        {/* Main Quiz Card (Sage Mint & Amber Light Theme matching Poles of Magnet) */}
        <div className="glass-panel" style={{ 
          background: '#FFFFFF', 
          border: '1.5px solid #A7F3D0',
          borderRadius: '20px', 
          padding: '1.25rem 1.75rem', 
          boxShadow: '0 6px 20px rgba(6, 78, 59, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Title */}
          <h3 style={{ margin: 0, color: '#064E3B', fontSize: 'clamp(1.15rem, 1.5vw, 1.35rem)', fontWeight: 900 }}>
            {currentQ.title}
          </h3>

          {/* Question Text */}
          <p style={{ fontSize: 'clamp(0.92rem, 1.3vw, 1.05rem)', margin: 0, lineHeight: '1.5', fontWeight: 600, color: '#334155' }}>
            {currentQ.question}
          </p>

          {/* Option Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {currentQ.options.map((option, index) => {
              let bgColor = '#FFFFFF';
              let borderColor = '#CBD5E1';
              let textColor = '#1E293B';
              let icon = null;

              if (showResult) {
                if (index === currentQ.correctIndex) {
                  bgColor = '#DCFCE7';
                  borderColor = '#16A34A';
                  textColor = '#065F46';
                  icon = <CheckCircle size={18} color="#16A34A" />;
                } else if (index === selectedOption) {
                  bgColor = '#FEE2E2';
                  borderColor = '#EF4444';
                  textColor = '#991B1B';
                  icon = <XCircle size={18} color="#EF4444" />;
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
                    borderRadius: '12px',
                    background: bgColor,
                    border: `1.5px solid ${borderColor}`,
                    color: textColor,
                    cursor: showResult ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontSize: '0.96rem',
                    fontWeight: 800,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    opacity: showResult && index !== currentQ.correctIndex && index !== selectedOption ? 0.6 : 1
                  }}
                >
                  <span>{option}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner & Next Button */}
          {showResult && (
            <div style={{ marginTop: '0.5rem', animation: 'fadeIn 0.35s ease' }}>
              <div style={{ padding: '0.75rem 1.15rem', background: '#F0FDF4', borderRadius: '12px', border: '1.5px solid #A7F3D0', borderLeft: '4px solid #D97706' }}>
                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.92rem', fontWeight: 900, color: '#064E3B' }}>Explanation</h4>
                <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: 600 }}>{currentQ.explanation}</p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.6rem' }}>
                <button
                  onClick={handleNext}
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
