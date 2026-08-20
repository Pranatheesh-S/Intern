import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Check, X, ArrowRight, CheckCircle2, Megaphone, Lock, Unlock, ClipboardList, Lightbulb, Star } from 'lucide-react';
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
      try { playSuccess(); } catch(e){}
      if (addXp) addXp(20);
      
      // Unlock discoveries
      setUnlockedDiscoveries(prev => Math.min(prev + unlockPerQuestion, data.discoveries.length));
    } else {
      setIsCorrect(false);
      try { playError(); } catch(e){}
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
      setUnlockedDiscoveries(data.discoveries.length); // Ensure all are unlocked at the end
      if (addXp) addXp(50); // Completion bonus
      if (onComplete) onComplete();
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div style={{ flex: 1, display: 'flex', gap: '1rem', padding: '1rem', background: '#f8fafc', overflow: 'hidden', height: '100%' }}>
      
      {/* Left Column: Mission Briefing */}
      <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
        
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4f46e5', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem', alignSelf: 'flex-start' }}>
            <Megaphone size={20} /> Mission Briefing
          </div>
          
          <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
            {data.dialogue || "Well done, detective! You've explored the Barrier. Now let's verify your understanding and log our discoveries."}
          </p>

          <img 
            src={BLAKE_IMG_URL} 
            alt="Chief Blake" 
            style={{ height: '180px', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }} 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/150x200.png?text=Blake'; }}
          />
          
          <div style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', marginTop: '-10px', zIndex: 10 }}>
            CHIEF BLAKE
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', marginTop: '1rem', fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', textAlign: 'center' }}>
            Answer each question carefully. Correct answers will be added to our Case Log.
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5', fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '1rem' }}>
            <Shield size={16} /> Progress
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            {data.questions.map((_, idx) => (
              <div key={idx} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: idx < currentQ ? '#10b981' : (idx === currentQ ? '#6366f1' : '#e2e8f0'),
                  color: 'white', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 2
                }}>
                  {idx < currentQ ? <Check size={14} /> : (idx + 1)}
                </div>
                {idx < data.questions.length - 1 && (
                  <div style={{ 
                    position: 'absolute', left: '24px', top: '11px', height: '2px', width: '30px',
                    background: idx < currentQ ? '#10b981' : '#e2e8f0', zIndex: 1
                  }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
            {currentQ} of {data.questions.length} completed
          </div>
        </div>
      </div>

      {/* Middle Column: Quiz Interface */}
      <div style={{ flex: 2, background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#e0e7ff', padding: '10px', borderRadius: '12px', color: '#4f46e5' }}>
              <ShieldAlert size={28} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>{data.title || "Detective Checkpoint"}</h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Verify your understanding to record our findings.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1.1rem', fontWeight: 'bold', color: '#4f46e5' }}>
            Score: {score} / {maxScore} <Star size={20} fill="#eab308" color="#eab308" />
          </div>
        </div>

        {/* Content */}
        {!quizComplete ? (
          <div style={{ padding: '2rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600' }}>Question {currentQ + 1} of {data.questions.length}</span>
              <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#4f46e5', width: `${((currentQ + 1) / data.questions.length) * 100}%`, transition: 'width 0.3s ease' }} />
              </div>
            </div>

            <h3 style={{ margin: '0 0 2rem 0', fontSize: '1.25rem', color: '#0f172a', display: 'flex', gap: '12px' }}>
              <div style={{ background: '#4f46e5', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>
                Q
              </div>
              {q.question}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {q.options.map((opt, idx) => {
                const isSelected = selected === idx;
                let bg = 'white';
                let border = '1px solid #cbd5e1';
                let iconColor = '#94a3b8';
                
                if (isSelected) {
                  bg = '#f5f3ff';
                  border = '1px solid #8b5cf6';
                  iconColor = '#8b5cf6';
                }
                
                if (isVerified) {
                  if (idx === q.correct) {
                    bg = '#f0fdf4';
                    border = '1px solid #22c55e';
                    iconColor = '#22c55e';
                  } else if (isSelected) {
                    bg = '#fef2f2';
                    border = '1px solid #ef4444';
                    iconColor = '#ef4444';
                  } else {
                    bg = '#f8fafc';
                    border = '1px solid #e2e8f0';
                    iconColor = '#cbd5e1';
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
                    <span style={{ fontSize: '1.05rem', color: '#1e293b', flex: 1 }}>{opt}</span>
                    {isVerified && idx === q.correct && (
                      <div style={{ background: '#22c55e', color: 'white', borderRadius: '50%', padding: '4px' }}>
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                    {isVerified && isSelected && idx !== q.correct && (
                      <div style={{ background: '#ef4444', color: 'white', borderRadius: '50%', padding: '4px' }}>
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
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: isCorrect ? '#f0fdf4' : '#fef2f2', padding: '1rem 1.5rem', borderRadius: '12px', border: `1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}`, flex: 1 }}>
                  <div style={{ background: isCorrect ? '#22c55e' : '#ef4444', color: 'white', padding: '8px', borderRadius: '50%', flexShrink: 0 }}>
                    {isCorrect ? <Check size={20} strokeWidth={3} /> : <X size={20} strokeWidth={3} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: isCorrect ? '#166534' : '#991b1b', marginBottom: '4px' }}>
                      {isCorrect ? 'Great job, Detective!' : 'Not quite right!'}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: isCorrect ? '#15803d' : '#b91c1c', lineHeight: '1.4' }}>
                      {q.explanation || (isCorrect ? "You've got it right." : "The correct answer has been highlighted.")}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  {!showHint ? (
                    <button 
                      onClick={() => setShowHint(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#64748b', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <Lightbulb size={18} /> Need a hint?
                    </button>
                  ) : (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '0.75rem 1.25rem', borderRadius: '8px', color: '#92400e', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <Lightbulb size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
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
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem 2rem', borderRadius: '8px', background: selected !== null ? '#4f46e5' : '#94a3b8', color: 'white', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: selected !== null ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
                >
                  Verify Answer <ArrowRight size={18} />
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem 2rem', borderRadius: '8px', background: '#10b981', color: 'white', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                >
                  {currentQ < data.questions.length - 1 ? 'Next Question' : 'Complete Review'} <ArrowRight size={18} />
                </button>
              )}
            </div>

          </div>
        ) : (
          <div style={{ padding: '3rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'white' }}>
              <CheckCircle2 size={48} />
            </div>
            <h2 style={{ color: '#0f172a', margin: '0 0 1rem 0' }}>Checkpoint Complete!</h2>
            <p style={{ color: '#475569', fontSize: '1.1rem', maxWidth: '400px', marginBottom: '2rem' }}>
              Excellent work! You scored {score} out of {maxScore}. All discoveries have been securely logged to the Case File.
              <br/><br/>
              <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Click "Proceed to next" in the bottom right corner to continue.</span>
            </p>
          </div>
        )}
      </div>

      {/* Right Column: Case Log */}
      <div style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
        
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4f46e5', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            <ClipboardList size={20} /> Today's Discoveries
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.5rem 0' }}>
            Your correct answers unlock discoveries.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {data.discoveries.map((discovery, idx) => {
              const isUnlocked = idx < unlockedDiscoveries;
              
              // Split discovery if it has a bold prefix pattern (Optional, but looks nice if data has it)
              let title = `Discovery ${idx + 1}`;
              let text = discovery;
              
              if (isUnlocked) {
                return (
                  <div key={idx} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #bbf7d0', background: '#f0fdf4', display: 'flex', gap: '12px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#22c55e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold', fontSize: '0.75rem' }}>
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#166534', fontSize: '0.9rem', marginBottom: '6px' }}>{title}</div>
                      <div style={{ fontSize: '0.85rem', color: '#15803d', lineHeight: '1.4' }}>{text}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                      <CheckCircle2 size={20} color="#22c55e" />
                    </div>
                  </div>
                );
              } else {
                // Locked state
                return (
                  <div key={idx} style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold', fontSize: '0.75rem' }}>
                      {idx + 1}
                    </div>
                    <div style={{ fontWeight: '500', color: '#64748b', fontSize: '0.9rem', flex: 1 }}>
                      Discovery locked
                    </div>
                    <Lock size={16} color="#94a3b8" />
                  </div>
                );
              }
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
