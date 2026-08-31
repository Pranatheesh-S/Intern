import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, HelpCircle, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';

const challenges = [
  {
    id: 1,
    title: "Situation 1",
    scenario: "You bring the North Pole of a magnet above the line (near the top/North of the compass).",
    question: "Which compass needle will point towards the North magnet?",
    options: [
      "South (Blue) needle points towards it",
      "North (Red) needle points towards it",
      "Neither needle moves"
    ],
    correctAnswer: "South (Blue) needle points towards it",
    explanation: "Opposite poles attract! The North magnet attracts the South (Blue) needle and repels the North (Red) needle away."
  },
  {
    id: 2,
    title: "Situation 2",
    scenario: "You bring the South Pole of a magnet above the line (near the top/North of the compass).",
    question: "Which compass needle will point towards the South magnet?",
    options: [
      "North (Red) needle points towards it",
      "South (Blue) needle points towards it",
      "Both needles move away"
    ],
    correctAnswer: "North (Red) needle points towards it",
    explanation: "Opposite poles attract! The South magnet attracts the North (Red) needle and repels the South (Blue) needle away."
  },
  {
    id: 3,
    title: "Situation 3",
    scenario: "You move all magnets far away from the compass.",
    question: "How will the compass needle rest naturally?",
    options: [
      "North (Red) needle points North (0°)",
      "South (Blue) needle points North (0°)",
      "It keeps spinning continuously"
    ],
    correctAnswer: "North (Red) needle points North (0°)",
    explanation: "Without any nearby magnets, the compass aligns with Earth's magnetic field, and the red North needle rests at North (0°)."
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
  };  if (isFinished) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflowY: 'auto', padding: '1rem', boxSizing: 'border-box' }}>
        <div style={{ 
          maxWidth: '520px', 
          width: '90%', 
          padding: '2.5rem 3rem', 
          textAlign: 'center', 
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)', 
          borderRadius: '30px', 
          border: '1.5px solid #FDE68A',
          boxShadow: '0 15px 40px rgba(217, 119, 6, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <h2 style={{ fontSize: '2rem', margin: 0, color: '#064E3B', fontWeight: 900 }}>Challenge Complete!</h2>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              >
                <Star 
                  size={54} 
                  fill={i < stars ? "#F59E0B" : "transparent"} 
                  color={i < stars ? "#F59E0B" : "#FDE68A"} 
                  strokeWidth={i < stars ? 1 : 2}
                />
              </motion.div>
            ))}
          </div>
          
          <p style={{ fontSize: '1.25rem', color: '#065F46', margin: '0.5rem 0', fontWeight: 700 }}>
            You earned {stars} out of 3 stars!
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%' }}>
            <button 
              onClick={resetChallenge} 
              style={{ 
                flex: 1,
                padding: '0.95rem 1.5rem', 
                fontSize: '1.05rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem',
                background: '#FFFFFF',
                border: '1.5px solid #FDE68A',
                color: '#92400E',
                borderRadius: '30px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <RotateCcw size={18} /> Try Again
            </button>
            {onComplete && (
              <button 
                onClick={onComplete} 
                className="gold-glow-btn"
                style={{ 
                  flex: 1,
                  padding: '0.95rem 1.5rem', 
                  fontSize: '1.05rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  borderRadius: '30px',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                Finish Activity <ArrowRight size={18} color="#FFFFFF" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const c = challenges[currentChallenge];

  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '0.5rem', 
      boxSizing: 'border-box' 
    }}>
      <div style={{ width: '100%', maxWidth: '1050px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#064E3B', fontSize: '1.15rem', fontWeight: 900 }}>
            <Trophy size={20} style={{ color: '#D97706' }} /> Predict the Outcome
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1.5px solid #FDE68A' }}>
            <Star size={16} fill="#F59E0B" color="#F59E0B" /> 
            <span style={{ fontWeight: '900', fontSize: '0.92rem', color: '#92400E' }}>{stars} Stars</span>
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)', 
          border: '1.5px solid #FDE68A',
          borderRadius: '24px', 
          padding: '1.75rem 2.5rem', 
          boxShadow: '0 6px 24px rgba(217, 119, 6, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ textTransform: 'uppercase', fontSize: '0.88rem', fontWeight: '900', color: '#D97706', letterSpacing: '0.05em' }}>
            {c.title}
          </div>
          
          <p style={{ fontSize: '1.15rem', lineHeight: '1.55', margin: 0, padding: '1rem 1.25rem', background: '#FFFFFF', borderRadius: '16px', borderLeft: '5px solid #D97706', border: '1.5px solid #FDE68A', borderLeftWidth: '5px', color: '#064E3B', fontWeight: 600 }}>
            {c.scenario}
          </p>

          <div style={{ fontWeight: '900', fontSize: '1.15rem', color: '#064E3B' }}>
            <HelpCircle size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem', color: '#D97706' }}/> 
            {c.question}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
            {c.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === c.correctAnswer;
              
              let bg = '#FFFFFF';
              let borderColor = '#FDE68A';
              let icon = null;

              if (showResult) {
                if (isCorrect) {
                  bg = '#DCFCE7';
                  borderColor = '#16A34A';
                  icon = <CheckCircle2 size={20} color="#16A34A" />;
                } else if (isSelected) {
                  bg = '#FEE2E2';
                  borderColor = '#EF4444';
                  icon = <XCircle size={20} color="#EF4444" />;
                }
              } else if (isSelected) {
                borderColor = '#D97706';
                bg = '#FEF3C7';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handlePredict(option)}
                  disabled={showResult}
                  style={{
                    padding: '0.95rem 1.35rem',
                    borderRadius: '16px',
                    background: bg,
                    border: `1.5px solid ${borderColor}`,
                    color: '#064E3B',
                    fontSize: '1.05rem',
                    fontWeight: '800',
                    cursor: showResult ? 'default' : 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    opacity: showResult && !isCorrect && !isSelected ? 0.6 : 1
                  }}
                >
                  <span>{option}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ 
                padding: '1rem 1.35rem', 
                background: '#FFFFFF', 
                borderRadius: '16px',
                border: '1.5px solid #FDE68A',
                borderLeft: `5px solid ${selectedOption === c.correctAnswer ? '#10B981' : '#EF4444'}`
              }}>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.1rem', fontWeight: 900, color: selectedOption === c.correctAnswer ? '#059669' : '#DC2626' }}>
                  {selectedOption === c.correctAnswer ? 'Brilliant!' : 'Not quite.'}
                </h4>
                <p style={{ margin: 0, color: '#065F46', fontSize: '1.02rem', lineHeight: '1.55', fontWeight: 600 }}>
                  {c.explanation}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleNext}
                  className="gold-glow-btn"
                  style={{
                    padding: '0.85rem 2.25rem',
                    borderRadius: '30px',
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {currentChallenge < challenges.length - 1 ? 'Next Challenge' : 'See Final Score'} <ArrowRight size={18} color="#FFFFFF" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}