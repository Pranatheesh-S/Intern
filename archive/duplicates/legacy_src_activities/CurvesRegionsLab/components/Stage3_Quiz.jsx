import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Stage3_Quiz({ onComplete, addXp, onBackToDashboard }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const questions = [
    {
      text: "Which of the following describes a simple closed curve?",
      options: [
        "A curve that crosses over itself multiple times",
        "A curve whose start and end points do not meet",
        "A curve whose endpoints meet and which does not cross itself",
        "A straight line segment with two endpoints"
      ],
      correct: 2,
      feedback: "Correct! A simple closed curve is a loop where the start and end points connect, and it does not cross itself at any point."
    },
    {
      text: "Is a point on the boundary of a closed loop considered to be in the interior of the loop?",
      options: [
        "Yes, anything inside or on the line is interior",
        "No, the boundary is a distinct part, separate from the interior and exterior",
        "No, any point on the boundary is part of the exterior",
        "Yes, but only if the curve is non-simple"
      ],
      correct: 1,
      feedback: "Correct! The boundary of a closed curve is entirely distinct from both the interior (inside) and the exterior (outside)."
    },
    {
      text: "A runner runs around a circular running track. The path of the track itself represents which region?",
      options: [
        "The interior of the loop",
        "The exterior of the loop",
        "The boundary of the loop",
        "A non-simple crossing point"
      ],
      correct: 2,
      feedback: "Correct! The running track outline itself forms the boundary of the closed loop."
    }
  ];

  const handleSelectOption = (idx) => {
    if (showFeedback) return;
    setSelectedOpt(idx);
    setShowFeedback(true);

    if (idx === questions[currentIdx].correct) {
      setScore(prev => prev + 1);
      addXp(50);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setShowFeedback(false);
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    }
  };

  const currentQuestion = questions[currentIdx];

  return (
    <div style={{ maxWidth: '650px', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {!quizFinished ? (
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Progress bar */}
          <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold' }}>
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 'bold', marginLeft: 'auto' }}>
              Score: {score}/{questions.length}
            </span>
          </div>

          {/* Question Text */}
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc', lineHeight: '1.5' }}>
            {currentQuestion.text}
          </h3>

          {/* Options list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrectOpt = idx === currentQuestion.correct;
              
              let btnStyle = {
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                textAlign: 'left',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#cbd5e1',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              };

              if (showFeedback) {
                if (isCorrectOpt) {
                  btnStyle.background = 'rgba(16, 185, 129, 0.15)';
                  btnStyle.borderColor = '#10b981';
                  btnStyle.color = '#34d399';
                } else if (isSelected) {
                  btnStyle.background = 'rgba(239, 68, 68, 0.15)';
                  btnStyle.borderColor = '#ef4444';
                  btnStyle.color = '#f87171';
                } else {
                  btnStyle.opacity = 0.5;
                  btnStyle.cursor = 'not-allowed';
                }
              }

              return (
                <button 
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showFeedback}
                  style={btnStyle}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {showFeedback && isCorrectOpt && <CheckCircle2 size={16} style={{ color: '#10b981' }} />}
                    {showFeedback && isSelected && !isCorrectOpt && <XCircle size={16} style={{ color: '#ef4444' }} />}
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback section */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ 
                  background: selectedOpt === currentQuestion.correct ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                  border: `1px dashed ${selectedOpt === currentQuestion.correct ? '#10b981' : '#ef4444'}`,
                  borderRadius: '8px',
                  padding: '1rem',
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                  color: selectedOpt === currentQuestion.correct ? '#34d399' : '#f87171'
                }}>
                  {currentQuestion.feedback}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {showFeedback && (
            <button 
              onClick={handleNext}
              className="primary"
              style={{ width: '100%', gap: '0.5rem', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}
            >
              <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
              <ArrowRight size={14} />
            </button>
          )}

        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', background: '#090d16', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifycenter: 'center', color: '#a78bfa', marginBottom: '0.5rem' }}>
            <Trophy size={36} />
          </div>
          
          <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.75rem' }}>Concept Check Cleared!</h2>
          
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '400px' }}>
            You scored <strong>{score} out of {questions.length}</strong>! You have mastered Curves, simple loops, and closed plane regions.
          </p>

          <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '0.6rem 1.2rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--success)' }}>
            🌟 Total +{score * 50} XP Gained!
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
            <button 
              onClick={onBackToDashboard} 
              className="outline" 
              style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}
            >
              Back to Maths Menu
            </button>
            <button 
              onClick={onComplete} 
              className="primary" 
              style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}
            >
              Finish Chapter Activity
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
