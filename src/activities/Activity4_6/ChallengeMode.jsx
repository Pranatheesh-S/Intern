import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, HelpCircle, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';

const challenges = [
  {
    id: 1,
    title: "Situation 1",
    scenario: "You bring the North Pole of Magnet A near the North Pole of Magnet B.",
    question: "Will the compass needle...",
    options: ["Move towards", "Move away", "Stay still"],
    correctAnswer: "Move away",
    explanation: "Like poles repel! The North Pole repels another North Pole."
  },
  {
    id: 2,
    title: "Situation 2",
    scenario: "You bring the South Pole of a magnet near the North Pole of a compass.",
    question: "Will the compass needle...",
    options: ["Move towards", "Move away", "Stay still"],
    correctAnswer: "Move towards",
    explanation: "Unlike poles attract! The South Pole attracts the North Pole."
  },
  {
    id: 3,
    title: "Situation 3",
    scenario: "You move all magnets far away from the compass.",
    question: "Will the compass needle...",
    options: ["Move towards", "Move away", "Stay still"],
    correctAnswer: "Stay still",
    explanation: "Without a nearby strong magnet, the compass needle will simply point North due to Earth's magnetic field and stay still relative to local objects."
  }
];

export default function ChallengeMode({ onComplete }) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [stars, setStars] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handlePredict = (option) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);
    
    if (option === challenges[currentChallenge].correctAnswer) {
      setStars(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetChallenge = () => {
    setCurrentChallenge(0);
    setStars(0);
    setSelectedOption(null);
    setShowResult(false);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <h2 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', fontSize: '2rem' }}>Challenge Complete!</h2>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <Star 
                size={64} 
                fill={i < stars ? "#facc15" : "transparent"} 
                color={i < stars ? "#facc15" : "var(--border)"} 
                strokeWidth={i < stars ? 1 : 2}
              />
            </motion.div>
          ))}
        </div>
        
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', margin: '1rem 0' }}>
          You earned {stars} out of 3 stars!
          {stars === 3 ? " Perfect prediction skills!" : stars > 0 ? " Good job, keep exploring!" : " Let's review the concepts and try again."}
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={resetChallenge} className="outline" style={{ padding: '0.75rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RotateCcw size={18} /> Try Again
          </button>
          {onComplete && (
            <button onClick={onComplete} className="primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Continue to Next Part <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    );
  }

  const c = challenges[currentChallenge];

  return (
    <div className="main-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
          <Trophy size={24} style={{ color: '#facc15' }} /> Predict the Outcome
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <Star size={16} fill="#facc15" color="#facc15" /> 
          <span style={{ fontWeight: 'bold' }}>{stars} Stars</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', letterSpacing: '0.05em', marginBottom: '1rem' }}>
          {c.title}
        </div>
        
        <p style={{ fontSize: '1.2rem', lineHeight: '1.5', margin: '0 0 2rem 0', padding: '1rem', background: 'var(--surface)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
          {c.scenario}
        </p>

        <div style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
          <HelpCircle size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem', color: 'var(--text-muted)' }}/> 
          {c.question}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {c.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === c.correctAnswer;
            
            let bg = 'var(--surface)';
            let borderColor = 'var(--border)';
            let color = 'var(--text-primary)';

            if (showResult) {
              if (isCorrect) {
                bg = 'var(--success-bg)';
                borderColor = 'var(--success-border)';
                color = 'var(--success)';
              } else if (isSelected) {
                bg = 'var(--destructive-bg)';
                borderColor = 'var(--destructive-border)';
                color = 'var(--destructive)';
              }
            } else if (isSelected) {
              bg = 'var(--accent-bg)';
              borderColor = 'var(--accent)';
            }

            return (
              <button
                key={idx}
                onClick={() => handlePredict(option)}
                disabled={showResult}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: bg,
                  border: `2px solid ${borderColor}`,
                  color: color,
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: showResult ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  opacity: showResult && !isCorrect && !isSelected ? 0.5 : 1
                }}
              >
                {option}
                {showResult && isCorrect && <CheckCircle2 size={18} />}
                {showResult && isSelected && !isCorrect && <XCircle size={18} />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ 
                padding: '1.5rem', 
                background: selectedOption === c.correctAnswer ? 'var(--success-bg)' : 'var(--destructive-bg)', 
                borderRadius: '12px',
                border: `1px solid ${selectedOption === c.correctAnswer ? 'var(--success-border)' : 'var(--destructive-border)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ fontWeight: 'bold', color: selectedOption === c.correctAnswer ? 'var(--success)' : 'var(--destructive)' }}>
                  {selectedOption === c.correctAnswer ? 'Brilliant!' : 'Not quite.'}
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {c.explanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button
            onClick={handleNext}
            disabled={!showResult}
            className="primary"
            style={{ opacity: showResult ? 1 : 0.5, padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {currentChallenge < challenges.length - 1 ? 'Next Challenge' : 'See Final Score'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
