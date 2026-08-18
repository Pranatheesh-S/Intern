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
      <div style={{ maxWidth: '680px', margin: '2rem auto', padding: '1rem' }}>
        <div className="glass-panel" style={{ background: 'var(--surface)', padding: '3.5rem 4rem', borderRadius: '28px', border: '2px solid var(--accent)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--accent)', marginBottom: '1.25rem', fontSize: '2.6rem', fontWeight: 800 }}>Quiz Completed!</h2>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1.5px solid var(--accent)',
            borderRadius: '20px',
            padding: '2rem 2.5rem',
            marginBottom: '2.5rem'
          }}>
            <p style={{ fontSize: '1.75rem', margin: 0, fontWeight: 700 }}>
              You scored <span style={{ color: 'var(--accent)', fontSize: '2.4rem' }}>{score}</span> out of {quizData.length}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={() => { if (onComplete) onComplete(score); }}
              style={{
                padding: '1.1rem 3rem',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(0,0,0,0.3)'
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
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 3rem', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 700 }}>Test Your Knowledge</h3>
        <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 600 }}>
          Question {currentQuestion + 1} of {quizData.length}
        </div>
      </div>

      <div className="glass-panel" style={{ background: 'var(--surface)', padding: '2.5rem 3.5rem', borderRadius: '24px', boxShadow: '0 12px 35px rgba(0,0,0,0.12)' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--accent)', fontSize: '1.65rem', fontWeight: 800 }}>{currentQ.title}</h3>
        <p style={{ fontSize: '1.35rem', marginBottom: '2.25rem', lineHeight: '1.6', fontWeight: 600 }}>{currentQ.question}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentQ.options.map((option, index) => {
            let bgColor = 'var(--bg)';
            let borderColor = 'var(--border)';
            let icon = null;

            if (showResult) {
              if (index === currentQ.correctIndex) {
                bgColor = 'rgba(16, 185, 129, 0.1)';
                borderColor = '#10b981';
                icon = <CheckCircle size={24} color="#10b981" />;
              } else if (index === selectedOption) {
                bgColor = 'rgba(239, 68, 68, 0.1)';
                borderColor = '#ef4444';
                icon = <XCircle size={24} color="#ef4444" />;
              }
            } else if (index === selectedOption) {
              borderColor = 'var(--accent)';
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
                  padding: '1.2rem 1.6rem',
                  borderRadius: '14px',
                  background: bgColor,
                  border: `2px solid ${borderColor}`,
                  color: 'var(--text)',
                  cursor: showResult ? 'default' : 'pointer',
                  textAlign: 'left',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
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
          <div style={{ marginTop: '2.25rem', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ padding: '1.25rem 1.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', borderLeft: '5px solid var(--accent)' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.15rem', fontWeight: 800 }}>Explanation</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.2rem' }}>{currentQ.explanation}</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
              <button
                onClick={handleNext}
                style={{
                  padding: '0.85rem 2.5rem',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                {isFinished ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
