import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const quizData = [
  {
    id: 1,
    title: "Quiz 1",
    question: "When a bar magnet is freely suspended, it always comes to rest in which direction?",
    options: [
      "East–West",
      "North–South",
      "Northeast–Southwest",
      "Any direction"
    ],
    correctIndex: 1,
    explanation: "A freely suspended magnet always aligns itself in the North–South direction."
  },
  {
    id: 2,
    title: "Quiz 2",
    question: "What is the end of a freely suspended magnet that points towards the North called?",
    options: [
      "South Pole",
      "East Pole",
      "North Pole",
      "Magnetic End"
    ],
    correctIndex: 2,
    explanation: "The end of the magnet that points towards the north is called the North Pole."
  },
  {
    id: 3,
    title: "Quiz 3",
    question: "Why is a bar magnet tied with a thread in this activity?",
    options: [
      "To make it heavier",
      "To allow it to rotate freely",
      "To increase its magnetic strength",
      "To keep it clean"
    ],
    correctIndex: 1,
    explanation: "The thread allows the magnet to rotate freely until it settles in the North–South direction."
  },
  {
    id: 4,
    title: "Quiz 4",
    question: "Which instrument is based on the property of a freely suspended magnet?",
    options: [
      "Barometer",
      "Compass",
      "Stopwatch",
      "Spring Balance"
    ],
    correctIndex: 1,
    explanation: "A magnetic compass works because its needle is a small freely suspended magnet that aligns itself in the North–South direction."
  },
  {
    id: 5,
    title: "Quiz 5",
    question: "If the direction in which the suspended magnet comes to rest is marked, it can help us to identify the ________.",
    options: [
      "Colour of the magnet",
      "Weight of the magnet",
      "North and South directions",
      "Length of the magnet"
    ],
    correctIndex: 2,
    explanation: "A freely suspended magnet points towards the North and South, helping us find directions."
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
