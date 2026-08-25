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
          background: '#ffffff', 
          borderRadius: '30px', 
          border: '1px solid #cbd5e1',
          boxShadow: '0 15px 40px rgba(0,0,0,0.18)',
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
                style={{ 
                  flex: 1,
                  padding: '0.9rem 1.5rem', 
                  fontSize: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(217, 119, 6, 0.45)'
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
      padding: '1rem 0.5rem', 
      boxSizing: 'border-box' 
    }}>
      <div style={{ width: '100%', maxWidth: '1050px' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0 0.5rem' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#064E3B', fontSize: '1.1rem', fontWeight: 800 }}>
            <Trophy size={20} style={{ color: '#F59E0B' }} /> Predict the Outcome
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FFFFFF', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1.5px solid #A7F3D0' }}>
            <Star size={16} fill="#F59E0B" color="#F59E0B" /> 
            <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#064E3B' }}>{stars} Stars</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="glass-panel" style={{ 
          background: '#FFFFFF', 
          border: '1.5px solid #A7F3D0',
          borderRadius: '20px', 
          padding: '1.75rem 2.5rem', 
          boxShadow: '0 6px 20px rgba(6, 78, 59, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: '900', color: '#D97706', letterSpacing: '0.05em' }}>
            {c.title}
          </div>
          
          <p style={{ fontSize: '1.15rem', lineHeight: '1.5', margin: 0, padding: '1rem 1.25rem', background: '#F0FDF4', borderRadius: '12px', borderLeft: '5px solid #D97706', border: '1.5px solid #A7F3D0', borderLeftWidth: '5px', color: '#1E293B', fontWeight: 600 }}>
            {c.scenario}
          </p>

          <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#064E3B' }}>
            <HelpCircle size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem', color: '#D97706' }}/> 
            {c.question}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
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
                    padding: '0.9rem 1.35rem',
                    borderRadius: '12px',
                    background: bg,
                    border: `1.5px solid ${borderColor}`,
                    color: '#0F172A',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    cursor: showResult ? 'default' : 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                background: selectedOption === c.correctAnswer ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)', 
                borderRadius: '14px',
                borderLeft: `5px solid ${selectedOption === c.correctAnswer ? '#10b981' : '#ef4444'}`
              }}>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.1rem', fontWeight: 800, color: selectedOption === c.correctAnswer ? '#10b981' : '#ef4444' }}>
                  {selectedOption === c.correctAnswer ? 'Brilliant!' : 'Not quite.'}
                </h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.5' }}>
                  {c.explanation}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleNext}
                  style={{
                    padding: '0.75rem 2.25rem',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '30px',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(217, 119, 6, 0.45)',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {currentChallenge < challenges.length - 1 ? 'Next Challenge' : 'See Final Score'} <ArrowRight size={18} color="#ffffff" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
