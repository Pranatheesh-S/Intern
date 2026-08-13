import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Award, RefreshCw, Star, Shield, Lightbulb, Search, FileText, CheckSquare, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Stage9_Quiz({ onComplete, addXp }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const questions = [
    {
      q: 'Which of the following is correct about why we classify materials?',
      options: [
        'To make our shelves look extremely colorful',
        'For convenience and to study their properties systematically',
        'To separate metal pins from plastic toys only',
        'To make materials dissolve faster'
      ],
      correctIndex: 1,
      explanation: 'Classification divides materials into groups based on similarities and differences. This helps us locate items easily.',
      tip: "Think like a detective... what's the real reason?"
    },
    {
      q: 'Why are water tumblers NOT made of cloth fabrics?',
      options: [
        'Cloth is a hard material',
        'Cloth contains tiny pores and absorbs water, letting it leak through',
        'Cloth is too expensive to manufacture',
        'Cloth reacts chemically to turn water sour'
      ],
      correctIndex: 1,
      explanation: 'A tumbler needs to hold liquids. Since cloth is porous and absorbent, water leaks out immediately.',
      tip: "Think about what happens to your clothes in the rain!"
    },
    {
      q: 'Which pair represents the correct English translation of the Ayurvedic gunas "Mṛdu" and "Sāndra"?',
      options: [
        'Hard and Liquid',
        'Heavy and Light',
        'Soft and Solid',
        'Smooth and Rough'
      ],
      correctIndex: 2,
      explanation: 'In the Ashtanga Hridaya, Mṛdu stands for Soft, and Sāndra stands for Solid.',
      tip: "Remember the Sanskrit property pairs we learned!"
    },
    {
      q: 'Freshly cut metal surfaces exhibit lustre. If left in open air, what happens to their shine?',
      options: [
        'They shine brighter under sunlight',
        'They retain their exact same shine forever',
        'They become dull due to reaction with air and moisture (corrosion)',
        'They slowly transform into wood'
      ],
      correctIndex: 2,
      explanation: 'Metals lose their lustre and appear dull because of the action of air and moisture on them.',
      tip: "What happens to old iron keys left outside?"
    },
    {
      q: 'Which definition correctly describes "Matter" as learned in Chapter 6?',
      options: [
        'Anything that is shiny and dissolves in warm water',
        'Anything that has mass and occupies space (volume)',
        'Only solid objects like bricks and iron keys',
        'Things that can easily be cut with scissors'
      ],
      correctIndex: 1,
      explanation: 'Matter is everything around us that has mass and occupies space.',
      tip: "Think about the very first property we investigated."
    }
  ];

  const handleSelectAnswer = (index) => {
    if (isAnswered) return;
    setSelectedAns(index);
  };

  const handleVerify = () => {
    if (selectedAns === null || isAnswered) return;
    
    setIsAnswered(true);
    const isCorrect = selectedAns === questions[currentQIndex].correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      addXp(15);
    }
  };

  const handleNext = () => {
    setSelectedAns(null);
    setIsAnswered(false);
    
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      addXp(30);
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedAns(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  useEffect(() => {
    if (quizFinished) {
      onComplete();
    }
  }, [quizFinished, onComplete]);

  // Alphabet for options
  const alphabet = ['A', 'B', 'C', 'D'];
  const progressPercentage = (currentQIndex / questions.length) * 100;

  return (
    <div style={{ display: 'flex', gap: '1.5rem', width: '100%', height: '100%', alignItems: 'stretch' }}>
      
      {/* Left Sidebar */}
      <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Mission Progress */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: 'bold' }}>
            <Shield size={20} color="#4f46e5" /> Mission Progress
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '70px', height: '70px', borderRadius: '50%', 
              background: `conic-gradient(#4f46e5 ${progressPercentage}%, #e2e8f0 0)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ width: '56px', height: '56px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#4f46e5' }}>
                {Math.round(progressPercentage)}%
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '0.9rem' }}>{progressPercentage === 100 ? 'Mission Complete!' : 'Excellent!'}</div>
              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{progressPercentage === 100 ? 'Great job 🌟' : "You're doing great 🌟"}</div>
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ color: '#1e293b', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center' }}>
            Question Navigator
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {questions.map((_, idx) => {
              const isPast = idx < currentQIndex;
              const isCurrent = idx === currentQIndex;
              const isFilled = isPast || (isCurrent && isAnswered);
              return (
                <div key={idx} style={{ 
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: isFilled ? '#4f46e5' : 'transparent',
                  border: `2px solid ${isFilled || isCurrent ? '#4f46e5' : '#cbd5e1'}`,
                  color: isFilled ? 'white' : (isCurrent ? '#4f46e5' : '#94a3b8'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '0.9rem'
                }}>
                  {idx + 1}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4f46e5' }} /> Answered
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid #cbd5e1' }} /> Unanswered
            </div>
          </div>
        </div>

        {/* Detective Tip */}
        <div style={{ background: '#faf5ff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e9d5ff', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7e22ce', fontWeight: 'bold' }}>
            <Lightbulb size={20} /> Detective Tip
          </div>
          <p style={{ color: '#4c1d95', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
            Read each option carefully and think about the physical properties we investigated in the lab!
          </p>
        </div>

      </div>

      {/* Main Question Panel */}
      {!quizFinished ? (
        <div style={{ flex: 1, background: 'white', borderRadius: '24px', border: '2px solid #c7d2fe', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
          
          <div style={{ padding: '2rem 3rem', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', minHeight: 0 }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.2rem', color: '#1e293b', fontWeight: 'bold' }}>
                Question <span style={{ color: '#4f46e5' }}>{currentQIndex + 1}</span> of {questions.length}
              </div>
              <div style={{ fontSize: '1.2rem', color: '#4f46e5', fontWeight: 'bold' }}>
                Score: {score}
              </div>
            </div>

            {/* Progress Dashes */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem' }}>
              {questions.map((_, idx) => (
                <div key={idx} style={{ 
                  height: '4px', flex: 1, borderRadius: '2px',
                  background: idx < currentQIndex ? '#4f46e5' : (idx === currentQIndex ? '#818cf8' : '#e2e8f0')
                }} />
              ))}
            </div>

            {/* Question Title */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '50%', background: '#4f46e5', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                fontSize: '1.5rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}>?</div>
              <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#1e293b', lineHeight: '1.4' }}>
                {questions[currentQIndex].q}
              </h3>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {questions[currentQIndex].options.map((option, idx) => {
                const isSelected = selectedAns === idx;
                const isCorrect = idx === questions[currentQIndex].correctIndex;
                
                let borderColor = '#e2e8f0';
                let bg = 'white';
                let letterBg = '#f1f5f9';
                let letterColor = '#64748b';

                if (isAnswered) {
                  if (isCorrect) {
                    borderColor = '#22c55e'; bg = '#f0fdf4'; letterBg = '#22c55e'; letterColor = 'white';
                  } else if (isSelected) {
                    borderColor = '#ef4444'; bg = '#fef2f2'; letterBg = '#ef4444'; letterColor = 'white';
                  }
                } else if (isSelected) {
                  borderColor = '#4f46e5'; bg = '#eef2ff'; letterBg = '#4f46e5'; letterColor = 'white';
                }

                return (
                  <div 
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem 1.5rem',
                      border: `2px solid ${borderColor}`, borderRadius: '16px', background: bg,
                      cursor: isAnswered ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isSelected && !isAnswered ? '0 4px 12px rgba(79, 70, 229, 0.1)' : 'none'
                    }}
                  >
                    <div style={{ 
                      width: '36px', height: '36px', borderRadius: '50%', background: letterBg, color: letterColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem',
                      border: isSelected || isAnswered ? 'none' : '1px solid #cbd5e1'
                    }}>
                      {alphabet[idx]}
                    </div>
                    <div style={{ fontSize: '1.2rem', color: '#334155', fontWeight: isSelected ? 'bold' : 'normal' }}>
                      {option}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Verification Block / Next Button */}
            {isAnswered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem', padding: '1.5rem', borderRadius: '16px', background: selectedAns === questions[currentQIndex].correctIndex ? '#f0fdf4' : '#fef2f2', border: `2px solid ${selectedAns === questions[currentQIndex].correctIndex ? '#22c55e' : '#ef4444'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: selectedAns === questions[currentQIndex].correctIndex ? '#16a34a' : '#dc2626', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '8px' }}>
                  {selectedAns === questions[currentQIndex].correctIndex ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                  {selectedAns === questions[currentQIndex].correctIndex ? 'Correct!' : 'Incorrect'}
                </div>
                <div style={{ color: '#334155', fontSize: '1.1rem', lineHeight: '1.5' }}>
                  {questions[currentQIndex].explanation}
                </div>
              </motion.div>
            )}

          </div>

          {/* Bottom Bar */}
          <div style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0', padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Search size={32} color="#0f172a" />
              <div style={{ background: '#eef2ff', color: '#4f46e5', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 'bold', border: '1px dashed #a5b4fc' }}>
                {questions[currentQIndex].tip}
              </div>
            </div>
            
            {!isAnswered ? (
              <button 
                onClick={handleVerify} 
                disabled={selectedAns === null}
                style={{ 
                  background: selectedAns === null ? '#cbd5e1' : '#4f46e5', color: 'white',
                  border: 'none', padding: '1rem 2.5rem', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold',
                  cursor: selectedAns === null ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', boxShadow: selectedAns !== null ? '0 4px 12px rgba(79,70,229,0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Verify Answer &rarr;
              </button>
            ) : (
              <button 
                onClick={handleNext} 
                style={{ 
                  background: '#10b981', color: 'white',
                  border: 'none', padding: '1rem 2.5rem', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                  transition: 'all 0.2s'
                }}
              >
                {currentQIndex < questions.length - 1 ? 'Next Question \u2192' : 'Finish Quiz \u2192'}
              </button>
            )}
          </div>

        </div>
      ) : (
        <div style={{ flex: 1, background: 'white', borderRadius: '24px', border: '2px solid #c7d2fe', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #4f46e5', boxShadow: '0 0 25px rgba(79,70,229,0.2)' }}>
              <Award size={64} color="#4f46e5" />
            </div>
            <div>
              <h2 style={{ margin: '0 0 1rem 0', fontSize: '3rem', color: '#1e293b' }}>Chapter Completed!</h2>
              <p style={{ margin: 0, fontSize: '1.5rem', color: '#475569' }}>You scored {score} out of {questions.length} correctly.</p>
            </div>
            {score === questions.length && (
              <div style={{ padding: '1.5rem', borderRadius: '16px', background: '#f0fdf4', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', gap: '1rem', color: '#15803d', fontSize: '1.25rem', fontWeight: 'bold' }}>
                <Star size={32} fill="#22c55e" color="#22c55e" /> Perfect Score! Master Investigator Badge Unlocked!
              </div>
            )}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
              <button onClick={restartQuiz} style={{ background: 'white', color: '#4f46e5', border: '2px solid #4f46e5', padding: '1rem 2rem', borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <RefreshCw size={20} /> Restart Quiz
              </button>
              <div style={{ background: '#10b981', color: 'white', padding: '1rem 2rem', borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Click "Proceed" in Top Right!
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Right Illustration Panel */}
      <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '24px', position: 'relative', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>
          
          {/* Subtle background decoration */}
          <Brain size={150} color="#e2e8f0" style={{ position: 'absolute', top: -30, right: -30, opacity: 0.5 }} />
          <Star size={100} color="#e2e8f0" style={{ position: 'absolute', bottom: 50, left: -20, opacity: 0.5 }} />

          <img src="/images/chief_detective_blake.png" alt="Detective" style={{ width: '100%', maxWidth: '200px', objectFit: 'contain', zIndex: 2, filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }} />
          
          <div style={{ background: '#fffbeb', border: '2px solid #fde68a', borderRadius: '12px', padding: '1.5rem', width: '90%', zIndex: 3, marginTop: '-20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', transform: 'rotate(-2deg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '2px dashed #fcd34d', paddingBottom: '0.5rem' }}>
              <FileText size={18} /> Detective Notes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#78350f', fontSize: '0.95rem', fontWeight: '500' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckSquare size={16} color="#d97706" /> Observe</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckSquare size={16} color="#d97706" /> Think</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckSquare size={16} color="#d97706" /> Compare</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckSquare size={16} color="#d97706" /> Solve</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
