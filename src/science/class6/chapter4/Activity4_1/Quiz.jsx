import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

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

export default function Quiz({ onComplete, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleOptionSelect = (index) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    
    if (index === quizData[currentQuestion].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
    }
  };

  const currentQ = quizData[currentQuestion];
  const isFinished = currentQuestion >= quizData.length - 1 && showResult;

  if (quizFinished) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        boxSizing: 'border-box'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          padding: '3.5rem 4rem',
          borderRadius: '28px',
          border: '3px solid #818cf8',
          boxShadow: '0 20px 50px rgba(99, 102, 241, 0.2)',
          textAlign: 'center',
          maxWidth: '680px',
          width: '100%'
        }}>
          <h2 style={{ color: '#4f46e5', marginBottom: '1.25rem', fontSize: '2.6rem', fontWeight: 800 }}>Quiz Completed!</h2>
          
          <div style={{
            backgroundColor: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '20px',
            padding: '2rem 2.5rem',
            marginBottom: '2.5rem'
          }}>
            <p style={{ fontSize: '1.75rem', margin: 0, color: '#0f172a', fontWeight: 700 }}>
              You scored <span style={{ color: '#4f46e5', fontSize: '2.2rem' }}>{score}</span> out of {quizData.length}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={() => { if (onComplete) onComplete(score); }}
              style={{
                padding: '1.1rem 3rem',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '30px',
                fontSize: '1.2rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)'
              }}
            >
              Finish Activity
            </button>
          </div>
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
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '960px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem'
      }}>
        {/* Main Question Card (Larger Quiz Box) */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '2.5px solid #818cf8',
          borderRadius: '24px',
          padding: '1.75rem 2.25rem',
          boxShadow: '0 12px 35px rgba(99, 102, 241, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.9rem'
        }}>
          {/* Header Row: Title on Left | Question X of Y on Right */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#4f46e5', fontSize: '1.45rem', fontWeight: 700 }}>
              {currentQ.title}
            </h3>
            <span style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#334155',
              backgroundColor: '#e2e8f0',
              padding: '0.4rem 1rem',
              borderRadius: '12px'
            }}>
              Question {currentQuestion + 1} of {quizData.length}
            </span>
          </div>

          <p style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 600, margin: 0, lineHeight: '1.5' }}>
            {currentQ.question}
          </p>

          {/* Options List (Bigger Option Cards & Text) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentQ.options.map((option, index) => {
              let bgColor = '#f8fafc';
              let borderColor = '#cbd5e1';
              let textColor = '#1e293b';
              let icon = null;

              if (showResult) {
                if (index === currentQ.correctIndex) {
                  bgColor = 'rgba(16, 185, 129, 0.12)';
                  borderColor = '#10b981';
                  textColor = '#065f46';
                  icon = <CheckCircle size={22} color="#10b981" />;
                } else if (index === selectedOption) {
                  bgColor = 'rgba(239, 68, 68, 0.12)';
                  borderColor = '#ef4444';
                  textColor = '#991b1b';
                  icon = <XCircle size={22} color="#ef4444" />;
                }
              } else if (index === selectedOption) {
                borderColor = '#4f46e5';
                bgColor = 'rgba(79, 70, 229, 0.08)';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showResult}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.95rem 1.4rem',
                    borderRadius: '14px',
                    background: bgColor,
                    border: `2px solid ${borderColor}`,
                    color: textColor,
                    cursor: showResult ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    lineHeight: '1.4',
                    transition: 'all 0.2s ease',
                    opacity: showResult && index !== currentQ.correctIndex && index !== selectedOption ? 0.5 : 1
                  }}
                >
                  <span>{option}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Explanation Box if answered */}
          {showResult && (
            <div style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: '#f8fafc',
              borderRadius: '14px',
              borderLeft: '5px solid #4f46e5',
              borderTop: '1px solid #e2e8f0',
              borderRight: '1px solid #e2e8f0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#4f46e5', fontWeight: 700 }}>Explanation</h4>
              <p style={{ margin: 0, color: '#334155', fontSize: '1.02rem', lineHeight: '1.45' }}>
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Bottom Bar: Back on Left | Next Question ONLY shown after answering on Right */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.35rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.6rem',
                backgroundColor: '#f1f5f9',
                color: '#0f172a',
                border: '2px solid #cbd5e1',
                borderRadius: '14px',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="hover:bg-slate-200"
            >
              <ArrowLeft size={18} /> Back
            </button>

            {showResult && (
              <button
                onClick={handleNext}
                style={{
                  padding: '0.75rem 2.2rem',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                className="hover:bg-indigo-700"
              >
                {isFinished ? 'Finish Quiz' : 'Next Question'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
