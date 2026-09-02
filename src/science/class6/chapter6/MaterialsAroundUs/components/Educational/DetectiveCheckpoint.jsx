import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check, X, ArrowRight, CheckCircle2, Megaphone, Lock, Unlock, ClipboardList, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';

export default function DetectiveCheckpoint({ data, onComplete, addXp }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [unlockedDiscoveries, setUnlockedDiscoveries] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showCaseLog, setShowCaseLog] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const BLAKE_IMG_URL = '/images/chief_detective_blake.png';

  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [playError] = useSound('https://assets.mixkit.co/active_storage/sfx/2997/2997-preview.mp3', { volume: 0.5 });

  const q = data.questions[currentQ];
  const maxScore = data.questions.length * 10;

  // Calculate how many discoveries to unlock per question
  const unlockPerQuestion = Math.ceil(data.discoveries.length / data.questions.length);

  const handleSelect = (idx) => {
    if (isVerified) return; // Can't change after verifying
    setSelected(idx);
  };

  const handleVerify = () => {
    if (selected === null) return;
    setIsVerified(true);

    if (selected === q.correct) {
      setIsCorrect(true);
      setScore(prev => prev + 10);
      try { playSuccess(); } catch (e) { }
      if (addXp) addXp(20);

      // Unlock discoveries
      setUnlockedDiscoveries(prev => Math.min(prev + unlockPerQuestion, data.discoveries.length));
    } else {
      setIsCorrect(false);
      try { playError(); } catch (e) { }
    }
  };

  const handleNext = () => {
    if (currentQ < data.questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setIsVerified(false);
      setIsCorrect(null);
      setShowHint(false);
    } else {
      // Quiz complete
      setQuizComplete(true);
      setShowCaseLog(true);
      setUnlockedDiscoveries(data.discoveries.length); // Ensure all are unlocked at the end
      if (addXp) addXp(50); // Completion bonus
      onComplete(); // Tells parent the stage is complete, enabling "Proceed to next"
    }
  };

  const handleComplete = () => {
    setShowCaseLog(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 6fr)', gap: '1rem', padding: '1rem', background: 'var(--lesson-surface)', overflow: 'hidden', height: '100%', position: 'relative' }}>
      <style>{`
        .left-page-checkpoint {
          background: #f6f1e4;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: stretch;
          height: 100%;
          overflow: hidden;
          position: relative;
          padding: 24px 28px 24px;
          border-radius: 16px;
          border: 1px solid var(--lesson-border);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .left-hero-wrapper-chk {
          width: 100%;
          margin-bottom: 12px;
          overflow: hidden;
        }
        .hero-img-chk {
          width: 100%;
          height: clamp(480px, 60vh, 650px);
          object-fit: cover;
          object-position: top center;
          display: block;
          box-shadow: 0 6px 16px rgba(0,0,0,0.12);
        }
        .speech-bubble-chk {
          position: relative;
          margin-top: 4px;
          width: 100%;
          background: white;
          padding: 2.5rem 1.8rem;
          min-height: 180px;
          display: flex;
          align-items: center;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          z-index: 20;
          border: 2px solid var(--lesson-border);
          flex: 0 0 auto;
        }
        .speech-speaker-chk {
          position: absolute;
          top: -14px;
          left: 24px;
          background: var(--lesson-accent);
          color: white;
          padding: 4px 16px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 1.5px;
          box-shadow: 0 4px 12px rgba(131, 39, 41, 0.3);
        }
      `}</style>

      {/* Left Column: Mission Briefing */}
      <div className="left-page-checkpoint">
        <div className="left-hero-wrapper-chk">
          <img 
            src={BLAKE_IMG_URL} 
            alt="Chief Detective" 
            className="hero-img-chk"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600.png?text=Blake'; }}
          />
        </div>
        <motion.div 
          className="speech-bubble-chk"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="speech-speaker-chk">CHIEF BLAKE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ margin: 0, fontSize: 'clamp(20px, 2.5vh, 26px)', color: 'var(--lesson-text)', lineHeight: '1.45', fontWeight: '500' }}>
              {data.dialogue || "Well done, detective! You've explored the Barrier. Now let's verify your understanding and log our discoveries."}
            </p>
            <p style={{ margin: 0, fontSize: 'clamp(18px, 2.2vh, 22px)', color: 'var(--lesson-secondary)', lineHeight: '1.45', fontWeight: '600' }}>
              Answer each question carefully. Correct answers will be added to our Case Log.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Middle Column: Quiz Interface */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--lesson-border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>

        {/* Header */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--lesson-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--lesson-surface)', padding: '10px', borderRadius: '12px', color: 'var(--lesson-accent)' }}>
              <ShieldAlert size={28} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 'clamp(26px, 3.5vw, 34px)', fontWeight: '900', color: 'var(--lesson-text)' }}>{data.title || "Detective Checkpoint"}</h2>
              <p style={{ margin: 0, fontSize: 'clamp(17px, 2.5vw, 21px)', fontWeight: '500', color: 'var(--lesson-muted)' }}>Verify your understanding to record our findings.</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {!quizComplete ? (
          <div style={{ padding: '2rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--lesson-secondary)', fontWeight: '600' }}>Question {currentQ + 1} of {data.questions.length}</span>
              <div style={{ flex: 1, height: '6px', background: 'var(--lesson-border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--lesson-accent)', width: `${((currentQ + 1) / data.questions.length) * 100}%`, transition: 'width 0.3s ease' }} />
              </div>
            </div>

            <h3 style={{ margin: '0 0 2rem 0', fontSize: 'clamp(19px, 2.5vw, 23px)', fontWeight: '700', color: 'var(--lesson-text)', display: 'flex', gap: '12px' }}>
              <div style={{ background: 'var(--lesson-accent)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>
                Q
              </div>
              {q.question}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {q.options.map((opt, idx) => {
                const isSelected = selected === idx;
                let bg = 'white';
                let border = '1px solid var(--lesson-border)';
                let iconColor = 'var(--lesson-muted)';

                if (isSelected) {
                  bg = 'var(--lesson-accent-bg)';
                  border = '1px solid var(--lesson-accent)';
                  iconColor = 'var(--lesson-accent)';
                }

                if (isVerified) {
                  if (idx === q.correct) {
                    bg = 'var(--lesson-success-bg)';
                    border = '1px solid var(--lesson-success)';
                    iconColor = 'var(--lesson-success)';
                  } else if (isSelected) {
                    bg = 'var(--lesson-danger-bg)';
                    border = '1px solid var(--lesson-danger)';
                    iconColor = 'var(--lesson-danger)';
                  } else {
                    bg = 'var(--lesson-surface)';
                    border = '1px solid var(--lesson-border)';
                    iconColor = 'var(--lesson-border)';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isVerified}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '1rem', borderRadius: '12px',
                      background: bg, border: border,
                      cursor: isVerified ? 'default' : 'pointer',
                      textAlign: 'left', transition: 'all 0.2s',
                      boxShadow: isSelected && !isVerified ? '0 4px 6px -1px rgba(139, 92, 246, 0.1)' : 'none'
                    }}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: `2px solid ${iconColor}`, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span style={{ fontSize: 'clamp(17px, 2.5vw, 21px)', fontWeight: '500', color: 'var(--lesson-text)', flex: 1 }}>{opt}</span>
                    {isVerified && idx === q.correct && (
                      <div style={{ background: 'var(--lesson-success)', color: 'white', borderRadius: '50%', padding: '4px' }}>
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                    {isVerified && isSelected && idx !== q.correct && (
                      <div style={{ background: 'var(--lesson-danger)', color: 'white', borderRadius: '50%', padding: '4px' }}>
                        <X size={16} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Actions */}
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', minHeight: '60px', gap: '1rem' }}>
              {isVerified ? (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: isCorrect ? 'var(--lesson-success-bg)' : 'var(--lesson-danger-bg)', padding: '1rem 1.5rem', borderRadius: '12px', border: `1px solid ${isCorrect ? 'var(--lesson-success-border)' : 'var(--lesson-danger-border)'}`, flex: 1 }}>
                  <div style={{ background: isCorrect ? 'var(--lesson-success)' : 'var(--lesson-danger)', color: 'white', padding: '8px', borderRadius: '50%', flexShrink: 0 }}>
                    {isCorrect ? <Check size={20} strokeWidth={3} /> : <X size={20} strokeWidth={3} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 'clamp(17px, 2.5vw, 21px)', fontWeight: '800', color: isCorrect ? 'var(--lesson-success)' : '#991b1b', marginBottom: '4px' }}>
                      {isCorrect ? 'Great job, Detective!' : 'Not quite right!'}
                    </div>
                    <div style={{ fontSize: 'clamp(17px, 2.5vw, 21px)', fontWeight: '600', color: isCorrect ? 'var(--lesson-success)' : 'var(--lesson-danger)', lineHeight: '1.55' }}>
                      {q.explanation || (isCorrect ? "You've got it right." : "The correct answer has been highlighted.")}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  {!showHint ? (
                    <button
                      onClick={() => setShowHint(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid var(--lesson-border)', background: 'white', color: 'var(--lesson-muted)', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <Lightbulb size={18} /> Need a hint?
                    </button>
                  ) : (
                    <div style={{ background: 'var(--lesson-warning-bg)', border: '1px solid var(--lesson-warning-bg)', padding: '0.75rem 1.25rem', borderRadius: '8px', color: 'var(--lesson-primary)', fontSize: 'clamp(17px, 2.5vw, 21px)', fontWeight: '600', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <Lightbulb size={18} color="var(--lesson-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ lineHeight: '1.4' }}>
                        <strong>Hint:</strong> {q.hint || "Think about the properties we just learned!"}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!isVerified ? (
                <button
                  onClick={handleVerify}
                  disabled={selected === null}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem 2rem', borderRadius: '8px', background: selected !== null ? 'var(--lesson-accent)' : 'var(--lesson-muted)', color: 'white', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: selected !== null ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
                >
                  Verify Answer <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem 2rem', borderRadius: '8px', background: 'var(--lesson-success)', color: 'white', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                >
                  {currentQ < data.questions.length - 1 ? 'Next Question' : 'Complete Review'} <ArrowRight size={18} />
                </button>
              )}
            </div>

          </div>
        ) : (
          <div style={{ padding: '3rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--lesson-success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'white' }}>
              <CheckCircle2 size={48} />
            </div>
            <h2 style={{ color: 'var(--lesson-text)', margin: '0 0 1rem 0', fontSize: 'clamp(30px, 3.5vw, 36px)', fontWeight: '900' }}>Checkpoint Complete!</h2>
            <p style={{ color: 'var(--lesson-secondary)', fontSize: 'clamp(18px, 2.5vw, 21px)', fontWeight: '600', maxWidth: '400px', marginBottom: '2rem' }}>
              Excellent work! All discoveries have been securely logged to the Case File.
              <br/><br/>
              <span style={{ fontSize: '0.9rem', color: 'var(--lesson-muted)' }}>Click "Proceed to next" in the bottom right corner to continue.</span>
            </p>
          </div>
        )}
      </div>


      {quizComplete && showCaseLog && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid var(--lesson-border)',
              borderRadius: '20px',
              padding: '2.5rem',
              maxWidth: '680px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--lesson-accent)' }}>
              <ClipboardList size={40} />
            </div>
            <h2 style={{ margin: '0 0 1.5rem 0', color: 'var(--lesson-text)', fontSize: '2rem', fontWeight: 800 }}>CASE LOG</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', marginBottom: '2rem' }}>
              {data.discoveries.map((discovery, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', fontSize: '22px', fontWeight: 600, color: 'var(--lesson-text)', lineHeight: '1.5', background: 'var(--lesson-surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--lesson-border)' }}>
                  <div style={{ color: 'var(--lesson-success)', flexShrink: 0, marginTop: '2px' }}><CheckCircle2 size={20} /></div>
                  <div>{discovery}</div>
                </div>
              ))}
            </div>

            <button
              onClick={handleComplete}
              style={{
                background: 'var(--lesson-accent)',
                color: 'white',
                border: 'none',
                padding: '1rem 3rem',
                borderRadius: '10px',
                fontSize: '22px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'background 0.2s',
                boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)'
              }}
            >
              CONTINUE
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
