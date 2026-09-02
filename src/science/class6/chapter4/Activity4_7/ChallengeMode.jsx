import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, HelpCircle, CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';

const challenges = [
  {
    id: 1,
    title: "Situation 1",
    scenario: "You place a wooden sheet between a bar magnet and a compass needle.",
    question: "Will the compass needle...",
    options: ["Still deflect", "Stop moving", "Spin continuously"],
    correctAnswer: "Still deflect",
    explanation: "Magnetic force easily passes through non-magnetic materials like wood!"
  },
  {
    id: 2,
    title: "Situation 2",
    scenario: "You place a thick plastic block between a magnet and a compass.",
    question: "Will the compass needle...",
    options: ["Still deflect", "Stop moving", "Turn non-magnetic"],
    correctAnswer: "Still deflect",
    explanation: "Plastic is non-magnetic, so magnetic fields pass straight through it."
  },
  {
    id: 3,
    title: "Situation 3",
    scenario: "You test cardboard, glass, and wood one by one between magnet and compass.",
    question: "What is the common observation?",
    options: ["Field passes through all", "Field gets completely blocked", "Field changes direction"],
    correctAnswer: "Field passes through all",
    explanation: "Magnetic fields pass through all non-magnetic barrier materials!"
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
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflowY: 'auto', padding: '1rem', boxSizing: 'border-box' }}>
        <div style={{ 
          maxWidth: '520px', 
          width: '90%', 
          padding: '2.5rem 3rem', 
          textAlign: 'center', 
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)', 
          borderRadius: '30px', 
          border: '1.5px solid #FDE68A',
          boxShadow: '0 8px 30px rgba(217, 119, 6, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#1e293b', fontWeight: 800 }}>Challenge Complete!</h2>
          
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
                  fill={i < stars ? "#facc15" : "transparent"} 
                  color={i < stars ? "#facc15" : "#cbd5e1"} 
                  strokeWidth={i < stars ? 1 : 2}
                />
              </motion.div>
            ))}
          </div>
          
          <p style={{ fontSize: '1.15rem', color: '#475569', margin: '0.5rem 0', fontWeight: 600 }}>
            You earned {stars} out of 3 stars!
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%' }}>
            <button 
              onClick={resetChallenge} 
              style={{ 
                flex: 1,
                padding: '0.9rem 1.5rem', 
                fontSize: '1rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#ffffff',
                border: '2px solid #3b82f6',
                color: '#1e3a8a',
                borderRadius: '30px',
                fontWeight: 800,
                cursor: 'pointer'
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
                  padding: '0.95rem 1.8rem', 
                  fontSize: '1.05rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem',
                  borderRadius: '30px',
                  cursor: 'pointer'
                }}
              >
                Finish Activity <ArrowRight size={18} color="#ffffff" />
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
      padding: '1.5rem 1rem', 
      boxSizing: 'border-box' 
    }}>
      <div style={{ width: '100%', maxWidth: '1180px' }}>
        {/* Top Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.25rem', 
          padding: '0 0.75rem' 
        }}>
          <h2 style={{ 
            margin: 0, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            color: '#064E3B', 
            fontSize: '1.65rem', 
            fontWeight: 900,
            letterSpacing: '-0.02em'
          }}>
            <Trophy size={30} style={{ color: '#F59E0B' }} /> Predict the Outcome
          </h2>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.65rem', 
            background: '#FFFFFF', 
            padding: '0.6rem 1.4rem', 
            borderRadius: '25px', 
            border: '2px solid #A7F3D0',
            boxShadow: '0 4px 14px rgba(6, 78, 59, 0.06)'
          }}>
            <Star size={24} fill="#F59E0B" color="#F59E0B" /> 
            <span style={{ fontWeight: 900, fontSize: '1.18rem', color: '#064E3B' }}>{stars} Stars</span>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="glass-panel" style={{ 
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)', 
          border: '1.5px solid #FDE68A',
          borderRadius: '28px', 
          padding: '2.75rem 3.25rem', 
          boxShadow: '0 10px 32px rgba(217, 119, 6, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.6rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Situation Title Badge */}
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            alignSelf: 'flex-start',
            textTransform: 'uppercase', 
            fontSize: '1.05rem', 
            fontWeight: 900, 
            color: '#D97706', 
            letterSpacing: '0.08em',
            background: '#FEF3C7',
            padding: '0.5rem 1.25rem',
            borderRadius: '16px',
            border: '1.5px solid #FCD34D'
          }}>
            {c.title}
          </div>
          
          {/* Situation Scenario Text Box */}
          <div style={{ 
            fontSize: '1.45rem', 
            lineHeight: 1.6, 
            margin: 0, 
            padding: '1.5rem 2rem', 
            background: '#F0FDF4', 
            borderRadius: '20px', 
            border: '2px solid #A7F3D0', 
            borderLeft: '6px solid #D97706', 
            color: '#0F172A', 
            fontWeight: 700,
            letterSpacing: '-0.01em'
          }}>
            {c.scenario}
          </div>

          {/* Question Text */}
          <div style={{ 
            fontWeight: 900, 
            fontSize: '1.38rem', 
            color: '#064E3B', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem' 
          }}>
            <HelpCircle size={26} style={{ color: '#D97706', flexShrink: 0 }} /> 
            <span>{c.question}</span>
          </div>

          {/* Options Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '1.25rem' 
          }}>
            {c.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === c.correctAnswer;
              
              let bg = '#FFFFFF';
              let borderColor = '#CBD5E1';
              let icon = null;

              if (showResult) {
                if (isCorrect) {
                  bg = '#DCFCE7';
                  borderColor = '#16A34A';
                  icon = <CheckCircle2 size={26} color="#16A34A" />;
                } else if (isSelected) {
                  bg = '#FEE2E2';
                  borderColor = '#EF4444';
                  icon = <XCircle size={26} color="#EF4444" />;
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
                    padding: '1.4rem 1.85rem',
                    borderRadius: '20px',
                    background: bg,
                    border: `2.5px solid ${borderColor}`,
                    color: '#0F172A',
                    fontSize: '1.28rem',
                    fontWeight: 800,
                    cursor: showResult ? 'default' : 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    boxShadow: isSelected ? '0 6px 20px rgba(217, 119, 6, 0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                    opacity: showResult && !isCorrect && !isSelected ? 0.55 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!showResult) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = '#D97706';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showResult && !isSelected) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = '#CBD5E1';
                    }
                  }}
                >
                  <span>{option}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation Box */}
          {showResult && (
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ 
                padding: '1.5rem 2rem', 
                background: selectedOption === c.correctAnswer ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)', 
                borderRadius: '20px',
                border: `2px solid ${selectedOption === c.correctAnswer ? '#10b981' : '#ef4444'}`,
                borderLeftWidth: '6px'
              }}>
                <h4 style={{ 
                  margin: '0 0 0.4rem 0', 
                  fontSize: '1.38rem', 
                  fontWeight: 900, 
                  color: selectedOption === c.correctAnswer ? '#047857' : '#DC2626' 
                }}>
                  {selectedOption === c.correctAnswer ? '🎉 Brilliant Prediction!' : '❌ Not quite!'}
                </h4>
                <p style={{ margin: 0, color: '#334155', fontSize: '1.22rem', lineHeight: 1.55, fontWeight: 600 }}>
                  {c.explanation}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleNext}
                  className="gold-glow-btn"
                  style={{
                    padding: '1rem 3rem',
                    borderRadius: '30px',
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem'
                  }}
                >
                  {currentChallenge < challenges.length - 1 ? 'Next Challenge' : 'See Final Score'} <ArrowRight size={24} color="#ffffff" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
