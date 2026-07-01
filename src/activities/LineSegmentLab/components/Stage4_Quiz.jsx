import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Check, X, Award, ArrowRight, RefreshCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

const QUESTIONS = [
  {
    id: 1,
    question: "What is the shortest path between any two distinct points A and B called?",
    options: [
      { text: "A Curved Line", isCorrect: false },
      { text: "A Line Segment (AB)", isCorrect: true },
      { text: "A Ray", isCorrect: false },
      { text: "An Intersecting Line", isCorrect: false }
    ],
    explanation: "A line segment represents the absolute shortest distance between two points. Any curved, zigzag, or wavy path will always be longer than the straight line segment."
  },
  {
    id: 2,
    question: "Which geometrical shape has only ONE fixed endpoint and extends infinitely in the other direction?",
    options: [
      { text: "A Line", isCorrect: false },
      { text: "A Line Segment", isCorrect: false },
      { text: "A Ray", isCorrect: true },
      { text: "A Point", isCorrect: false }
    ],
    explanation: "A Ray (like a ray of light starting from the Sun) has a fixed starting point but extends infinitely in one direction."
  },
  {
    id: 3,
    question: "Why is a Divider (calipers) considered more accurate than a Ruler for comparing line segments?",
    options: [
      { text: "It has two sharp legs that can lock the exact length and eliminate parallax errors", isCorrect: true },
      { text: "It is heavier and stays in place better", isCorrect: false },
      { text: "It is longer than a standard ruler", isCorrect: false },
      { text: "It measures in millimeters instead of centimeters", isCorrect: false }
    ],
    explanation: "A ruler has thickness and requires looking at mark lines straight on (90°). Looking from an angle causes parallax error. A divider physically carries the exact distance from one segment to another without errors."
  },
  {
    id: 4,
    question: "How many endpoints does a standard Line (← →) have?",
    options: [
      { text: "Two endpoints", isCorrect: false },
      { text: "One endpoint", isCorrect: false },
      { text: "Zero endpoints", isCorrect: true },
      { text: "Four endpoints", isCorrect: false }
    ],
    explanation: "A line extends infinitely in both directions, meaning it has no beginning and no end. Therefore, it has zero endpoints."
  }
];

export default function Stage4_Quiz({ onComplete, addXp, onBackToDashboard }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]); // tracks correct/incorrect for each question
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUESTIONS[currentIdx];

  const handleSelectOption = (index, isCorrect) => {
    if (selectedOpt !== null) return; // already answered this question
    setSelectedOpt(index);
    setShowExplanation(true);
    
    const updatedAnswers = [...answers, isCorrect];
    setAnswers(updatedAnswers);

    if (isCorrect) {
      setScore(prev => prev + 1);
      addXp(50);
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
    } else {
      try {
        // play simple error vibration if supported or error audio
        navigator.vibrate?.(50);
      } catch (e) {}
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setShowExplanation(false);
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
      addXp(100);
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel" 
        style={{ 
          maxWidth: '550px', 
          margin: '2rem auto', 
          padding: '2.5rem', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}
      >
        <div style={{ 
          width: '70px', 
          height: '70px', 
          borderRadius: '50%', 
          background: 'rgba(139, 92, 246, 0.1)', 
          border: '1.5px solid rgba(139, 92, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#a78bfa'
        }}>
          <Award size={36} />
        </div>

        <div>
          <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Quiz Completed!</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            You scored <strong>{score} out of {QUESTIONS.length}</strong> correct answers.
          </p>
        </div>

        {/* Progress Grid representation */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {answers.map((ans, idx) => (
            <div 
              key={idx}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: ans ? 'var(--success-bg)' : 'var(--danger-bg)',
                border: `1px solid ${ans ? 'var(--success-border)' : 'var(--danger-border)'}`,
                color: ans ? 'var(--success)' : 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {ans ? <Check size={16} /> : <X size={16} />}
            </div>
          ))}
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button onClick={onBackToDashboard} className="primary" style={{ width: '100%', gap: '0.5rem', justifyContent: 'center' }}>
            Finish Activity & Return <ArrowRight size={16} />
          </button>
          <button onClick={handleRestart} className="outline" style={{ width: '100%', gap: '0.5rem', justifyContent: 'center' }}>
            <RefreshCcw size={14} /> Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ maxWidth: '650px', margin: '1rem auto' }}>
      {/* Top Question Tracker Dots */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', padding: '0 0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
          Question {currentIdx + 1} of {QUESTIONS.length}
        </span>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {QUESTIONS.map((_, idx) => {
            const isCurrent = idx === currentIdx;
            const isAnswered = idx < answers.length;
            const wasCorrect = answers[idx];

            return (
              <div 
                key={idx}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isCurrent ? 'var(--accent)' : (isAnswered ? (wasCorrect ? 'var(--success)' : 'var(--danger)') : 'var(--border)'),
                  transition: 'all 0.2s'
                }}
              />
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="glass-panel" 
          style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* Question Text */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <HelpCircle size={22} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-heading)', lineHeight: '1.4' }}>
              {currentQ.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedOpt === oIdx;
              const hasBeenAnswered = selectedOpt !== null;
              
              let borderStyle = 'var(--border)';
              let bgStyle = 'transparent';
              let colorStyle = 'var(--text-primary)';

              if (isSelected) {
                if (opt.isCorrect) {
                  borderStyle = 'var(--success)';
                  bgStyle = 'var(--success-bg)';
                  colorStyle = 'var(--success)';
                } else {
                  borderStyle = 'var(--danger)';
                  bgStyle = 'var(--danger-bg)';
                  colorStyle = 'var(--danger)';
                }
              } else if (hasBeenAnswered && opt.isCorrect) {
                // Highlight correct option if student got it wrong
                borderStyle = 'var(--success-border)';
                bgStyle = 'var(--success-bg)';
                colorStyle = 'var(--success)';
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx, opt.isCorrect)}
                  disabled={hasBeenAnswered}
                  className="outline"
                  style={{
                    justifyContent: 'space-between',
                    padding: '0.9rem 1.25rem',
                    textAlign: 'left',
                    width: '100%',
                    border: `1.5px solid ${borderStyle}`,
                    background: bgStyle,
                    color: colorStyle,
                    opacity: hasBeenAnswered && !isSelected && !opt.isCorrect ? 0.45 : 1,
                    transition: 'all 0.2s',
                    cursor: hasBeenAnswered ? 'not-allowed' : 'pointer'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{opt.text}</span>
                  {hasBeenAnswered && opt.isCorrect && <Check size={16} color="var(--success)" />}
                  {isSelected && !opt.isCorrect && <X size={16} color="var(--danger)" />}
                </button>
              );
            })}
          </div>

          {/* Explanation / Progression */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}
              >
                <div style={{ background: 'var(--neutral-bg)', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Concept Insight
                  </span>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {currentQ.explanation}
                  </p>
                </div>

                <button onClick={handleNext} className="primary" style={{ alignSelf: 'flex-end', gap: '0.35rem' }}>
                  {currentIdx === QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'} <ArrowRight size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
