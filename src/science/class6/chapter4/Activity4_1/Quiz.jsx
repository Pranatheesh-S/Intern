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
    <div style={{ maxWidth: '100%', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={onBack}
          className="outline"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
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
