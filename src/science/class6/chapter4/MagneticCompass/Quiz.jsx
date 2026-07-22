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
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '1rem' }}>
        <div className="glass-panel" style={{ background: 'var(--surface)', padding: '3rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Quiz Completed!</h2>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>You scored {score} out of {quizData.length}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={() => { if (onComplete) onComplete(score); }}
              style={{
                padding: '0.75rem 2rem',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
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
    <div style={{ maxWidth: '100%', margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>Test Your Knowledge</h3>
        <div style={{ color: 'var(--text-muted)' }}>
          Question {currentQuestion + 1} of {quizData.length}
        </div>
      </div>

      <div className="glass-panel" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent)' }}>{currentQ.title}</h3>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: '1.5' }}>{currentQ.question}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentQ.options.map((option, index) => {
            let bgColor = 'var(--bg)';
            let borderColor = 'var(--border)';
            let icon = null;

            if (showResult) {
              if (index === currentQ.correctIndex) {
                bgColor = 'rgba(16, 185, 129, 0.1)';
                borderColor = '#10b981';
                icon = <CheckCircle size={20} color="#10b981" />;
              } else if (index === selectedOption) {
                bgColor = 'rgba(239, 68, 68, 0.1)';
                borderColor = '#ef4444';
                icon = <XCircle size={20} color="#ef4444" />;
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
                  padding: '1rem',
                  borderRadius: '8px',
                  background: bgColor,
                  border: `2px solid ${borderColor}`,
                  color: 'var(--text)',
                  cursor: showResult ? 'default' : 'pointer',
                  textAlign: 'left',
                  fontSize: '1rem',
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
          <div style={{ marginTop: '2rem', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Explanation</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>{currentQ.explanation}</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={handleNext}
                style={{
                  padding: '0.75rem 2rem',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
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
