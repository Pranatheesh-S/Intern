import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const quizData = [
  {
    id: 1,
    title: "Quiz 1",
    question: "Where do most iron filings stick on a bar magnet?",
    options: [
      "At the centre",
      "At the poles (ends)",
      "Only on one side",
      "Nowhere"
    ],
    correctIndex: 1,
    explanation: "Most iron filings collect at the two ends of a bar magnet, called the poles."
  },
  {
    id: 2,
    title: "Quiz 2",
    question: "What do iron filings help us observe?",
    options: [
      "The colour of the magnet",
      "The magnetic effect around the magnet",
      "The weight of the magnet",
      "The temperature of the magnet"
    ],
    correctIndex: 1,
    explanation: "Iron filings show where the magnetic effect is strongest around a magnet."
  },
  {
    id: 3,
    title: "Quiz 3",
    question: "Which part of a bar magnet attracts the maximum number of iron filings?",
    options: [
      "Middle",
      "Poles",
      "Flat surface only",
      "Entire magnet equally"
    ],
    correctIndex: 1,
    explanation: "The magnetic force is strongest at the poles, so more iron filings stick there."
  },
  {
    id: 4,
    title: "Quiz 4",
    question: "Can a magnet have only one pole?",
    options: [
      "Yes, only North Pole",
      "Yes, only South Pole",
      "No, every magnet has both North and South poles.",
      "Only broken magnets have one pole."
    ],
    correctIndex: 2,
    explanation: "A magnet always has both a North Pole and a South Pole, even if it is broken."
  },
  {
    id: 5,
    title: "Quiz 5",
    question: "If a bar magnet is broken into two pieces, what will each piece become?",
    options: [
      "Only a North Pole",
      "Only a South Pole",
      "A smaller magnet with both North and South poles",
      "A non-magnetic object"
    ],
    correctIndex: 2,
    explanation: "Each broken piece becomes a complete magnet with its own North and South poles."
  }
];

export default function Quiz({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

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
      if (onComplete) onComplete(score);
    }
  };

  const currentQ = quizData[currentQuestion];
  const isFinished = currentQuestion >= quizData.length - 1 && showResult;

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
