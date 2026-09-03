import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { CheckCircle, AlertCircle, Award, RefreshCw, Star, Shield, Lightbulb, Search, FileText, CheckSquare, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Stage9_Quiz({ onComplete, addXp }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [, setScore] = useState(0);
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
      } catch {
        // Confetti failed
      }
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
  const ansState = isAnswered ? (selectedAns === questions[currentQIndex].correctIndex ? 'correct' : 'incorrect') : null;

  return (
    <div style={{ display: 'flex', gap: '1.5rem', width: '100%', height: '100%', alignItems: 'stretch' }}>
      
      {/* Left Sidebar */}
      <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Mission Progress */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--lesson-text)', fontSize: 'clamp(15px, 2.2vw, 19px)', fontWeight: '800' }}>
            <Shield size={20} color="#A64B27" /> Mission Progress
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '70px', height: '70px', borderRadius: '50%', 
              background: `conic-gradient(#A64B27 ${progressPercentage}%, var(--lesson-border) 0)`,
            }}>
              <div style={{ width: '56px', height: '56px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(16px, 2.2vw, 20px)', fontWeight: '800', color: '#A64B27' }}>
                {Math.round(progressPercentage)}%
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '800', color: 'var(--lesson-text)', fontSize: 'clamp(17px, 2.5vw, 21px)' }}>{progressPercentage === 100 ? 'Mission Complete!' : 'Excellent!'}</div>
              <div style={{ color: 'var(--lesson-muted)', fontSize: 'clamp(15px, 2.2vw, 19px)', fontWeight: '600' }}>{progressPercentage === 100 ? 'Great job 🌟' : "You're doing great 🌟"}</div>
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ color: 'var(--lesson-text)', fontWeight: '800', fontSize: 'clamp(17px, 2.5vw, 21px)', textAlign: 'center' }}>
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
                  background: isFilled ? '#A64B27' : 'transparent',
                  border: `2px solid ${isFilled || isCurrent ? '#A64B27' : 'var(--lesson-border)'}`,
                  color: isFilled ? 'white' : (isCurrent ? '#A64B27' : 'var(--lesson-muted)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '800', fontSize: 'clamp(17px, 2.5vw, 21px)'
                }}>
                  {idx + 1}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: 'clamp(15px, 2.2vw, 19px)', fontWeight: '600', color: 'var(--lesson-muted)', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--lesson-secondary)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#A64B27' }} /> Answered
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid var(--lesson-border)' }} /> Unanswered
            </div>
          </div>
        </div>

        {/* Detective Tip */}
        <div style={{ background: 'var(--lesson-accent-bg)', borderRadius: '20px', padding: '1.5rem', border: '1px solid #D9C9A3', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A64B27', fontSize: 'clamp(15px, 2.2vw, 19px)', fontWeight: '800' }}>
            <Lightbulb size={20} /> Detective Tip
          </div>
          <p style={{ color: 'var(--lesson-primary)', fontSize: 'clamp(17px, 2.5vw, 21px)', fontWeight: '700', lineHeight: '1.5', margin: 0 }}>
            Read each option carefully and think about the physical properties we investigated in the lab!
          </p>
        </div>

      </div>

      {/* Main Question Panel */}
      {!quizFinished ? (
        <div style={{ flex: 1, background: 'white', borderRadius: '24px', border: '2px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
          
          <div style={{ padding: '2rem 3rem', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', minHeight: 0 }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: 'clamp(16px, 2.2vw, 19px)', fontWeight: '800', color: 'var(--lesson-text)' }}>
                Question <span style={{ color: '#A64B27' }}>{currentQIndex + 1}</span> of {questions.length}
              </div>
            </div>

            {/* Progress Dashes */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem' }}>
              {questions.map((_, idx) => (
                <div key={idx} style={{ 
                  flex: 1, height: '6px', borderRadius: '3px',
                  background: idx < currentQIndex ? '#A64B27' : (idx === currentQIndex ? '#A64B27' : 'var(--lesson-border)')
                }} />
              ))}
            </div>

            {/* Question Title */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '50%', background: 'var(--lesson-primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                fontSize: 'clamp(20px, 2.5vw, 24px)', fontWeight: '800', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}>?</div>
              <h3 style={{ margin: 0, fontSize: 'clamp(28px, 3.5vw, 36px)', fontWeight: '900', color: 'var(--lesson-text)', lineHeight: '1.4' }}>
                {questions[currentQIndex].q}
              </h3>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {questions[currentQIndex].options.map((option, idx) => {
                const isSelected = selectedAns === idx;
                const isCorrect = idx === questions[currentQIndex].correctIndex;
                
                let borderColor = 'var(--lesson-border)';
                let bg = 'white';
                let letterBg = 'var(--lesson-surface)';
                let letterColor = 'var(--lesson-muted)';

                if (isAnswered) {
                  if (isCorrect) {
                    borderColor = '#A64B27'; bg = 'var(--lesson-success-bg)'; letterBg = '#A64B27'; letterColor = 'white';
                  } else {
                    borderColor = 'var(--lesson-danger)'; bg = 'var(--lesson-danger-bg)'; letterBg = 'var(--lesson-danger)'; letterColor = 'white';
                  }
                } else if (isSelected) {
                  borderColor = 'var(--lesson-primary)'; bg = 'var(--lesson-surface)'; letterBg = 'var(--lesson-primary)'; letterColor = 'white';
                }

                return (
                  <div 
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem 1.5rem',
                      border: `2px solid ${borderColor}`, borderRadius: '16px', background: bg,
                      cursor: isAnswered ? 'default' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ 
                      width: '36px', height: '36px', borderRadius: '50%', background: letterBg, color: letterColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: 'clamp(18px, 2.5vw, 22px)',
                      border: isSelected || isAnswered ? 'none' : '1px solid var(--lesson-border)'
                    }}>
                      {alphabet[idx]}
                    </div>
                    <div style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', color: 'var(--lesson-text)', fontWeight: isSelected ? '600' : '500' }}>
                      {option}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Verification Block / Next Button */}
            {isAnswered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem', padding: '1.5rem', borderRadius: '16px', background: selectedAns === questions[currentQIndex].correctIndex ? 'var(--lesson-success-bg)' : 'var(--lesson-danger-bg)', border: `2px solid ${selectedAns === questions[currentQIndex].correctIndex ? '#A64B27' : 'var(--lesson-danger)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: selectedAns === questions[currentQIndex].correctIndex ? '#A64B27' : 'var(--lesson-danger)', fontWeight: '900', fontSize: 'clamp(20px, 3vw, 24px)', marginBottom: '8px' }}>
                  {selectedAns === questions[currentQIndex].correctIndex ? <CheckCircle size={28} /> : <AlertCircle size={28} />}
                  {selectedAns === questions[currentQIndex].correctIndex ? 'Correct!' : 'Incorrect'}
                </div>
                <div style={{ color: 'var(--lesson-text)', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: '600', lineHeight: '1.5' }}>
                  {questions[currentQIndex].explanation}
                </div>
              </motion.div>
            )}

          </div>

          {/* Bottom Bar */}
          <div style={{ background: '#FFFFFF', borderTop: '2px solid var(--lesson-border)', padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Search size={32} color="var(--lesson-text)" />
              {ansState && (
                <div style={{ background: '#FFFFFF', color: 'var(--lesson-primary)', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: 'clamp(17px, 2.5vw, 21px)', fontWeight: '800', border: '1px dashed var(--lesson-border)' }}>
                  {ansState === 'correct' ? 'Excellent logic!' : 'Not quite right!'}
                </div>
              )}
              {!ansState && (
                <div style={{ background: '#FFFFFF', color: '#A64B27', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: 'clamp(17px, 2.5vw, 21px)', fontWeight: '800', border: '1px dashed var(--lesson-border)' }}>
                  {questions[currentQIndex].tip}
                </div>
              )}
            </div>
            
            {!isAnswered ? (
              <button 
                onClick={handleVerify} 
                disabled={selectedAns === null}
                style={{ 
                  background: selectedAns === null ? 'var(--lesson-border)' : 'var(--lesson-primary)', color: '#FFFFFF',
                  border: 'none', padding: '1rem 2.5rem', borderRadius: '30px', fontSize: 'clamp(17px, 2.5vw, 20px)', fontWeight: '800',
                  cursor: selectedAns === null ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', boxShadow: selectedAns !== null ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Verify Answer &rarr;
              </button>
            ) : (
              <button 
                onClick={handleNext} 
                style={{ 
                  background: '#A64B27', color: '#FFFFFF',
                  border: 'none', padding: '1rem 2.5rem', borderRadius: '30px', fontSize: 'clamp(17px, 2.5vw, 20px)', fontWeight: '800',
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
        <div style={{ flex: 1, background: 'white', borderRadius: '24px', border: '2px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '2rem', padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #D9C9A3', boxShadow: '0 0 25px rgba(79,70,229,0.2)' }}>
              <Award size={64} color="#A64B27" />
            </div>
            <div>
              <h2 style={{ margin: '0 0 1rem 0', fontSize: 'clamp(36px, 4.5vw, 48px)', fontWeight: '900', color: 'var(--lesson-text)' }}>Chapter Completed!</h2>
              <p style={{ margin: 0, fontSize: 'clamp(20px, 2.5vw, 24px)', fontWeight: '600', color: 'var(--lesson-secondary)' }}>Master Investigator Badge Unlocked!</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={restartQuiz} style={{ background: '#A64B27', color: '#FFFFFF', border: '2px solid var(--lesson-primary)', padding: '1rem 2rem', borderRadius: '30px', fontSize: 'clamp(17px, 2.5vw, 20px)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <RefreshCw size={20} /> Retry Mission
              </button>
              <div style={{ background: '#A64B27', color: 'white', padding: '1rem 2rem', borderRadius: '30px', fontSize: 'clamp(17px, 2.5vw, 20px)', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Click &quot;Proceed to next&quot; in the bottom right corner!
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Right Illustration Panel */}
      <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ flex: 1, background: '#FFFFFF', borderRadius: '24px', position: 'relative', overflow: 'hidden', border: '1px solid var(--lesson-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>
          
          {/* Subtle background decoration */}
          <Brain size={150} color="var(--lesson-border)" style={{ position: 'absolute', top: -30, right: -30, opacity: 0.5 }} />
          <Star size={100} color="var(--lesson-border)" style={{ position: 'absolute', bottom: 50, left: -20, opacity: 0.5 }} />

          <img src="/images/chief_detective_blake.png" alt="Detective" style={{ width: '100%', maxWidth: '200px', objectFit: 'contain', zIndex: 2, filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }} />
          
          <div style={{ background: 'var(--lesson-warning-bg)', border: '2px solid var(--lesson-warning-bg)', borderRadius: '12px', padding: '1.5rem', width: '90%', zIndex: 3, marginTop: '-20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', transform: 'rotate(-2deg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--lesson-primary)', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: '800', marginBottom: '1rem', borderBottom: '2px dashed var(--lesson-warning)', paddingBottom: '0.5rem' }}>
              <FileText size={18} /> Detective Notes
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--lesson-secondary)', fontWeight: '800', fontSize: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckSquare size={16} color="#A64B27" /> Observe</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckSquare size={16} color="#A64B27" /> Think</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckSquare size={16} color="#A64B27" /> Compare</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckSquare size={16} color="#A64B27" /> Solve</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

Stage9_Quiz.propTypes = {
  onComplete: PropTypes.func.isRequired,
  addXp: PropTypes.func.isRequired
};
