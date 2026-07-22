import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Check, ArrowRight } from 'lucide-react';
import useSound from 'use-sound';
import mapBg from './assets/Map.png';

export default function MissionCheckpoint({ onComplete }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });

  const [currentQuestion, setCurrentQuestion] = useState(1);

  // Q1 State
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [q1Attempts, setQ1Attempts] = useState(0);
  const [q1Status, setQ1Status] = useState(null); // 'correct', 'incorrect', 'revealed'

  // Q2 State
  const [q2Answer, setQ2Answer] = useState(null);

  // Q3 State
  const [q3Answer, setQ3Answer] = useState(null);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);

  const checkpointRef = useRef(null);

  useEffect(() => {
    // Scroll into view when component mounts
    if (checkpointRef.current) {
      checkpointRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const buildings = [
    { id: 'Railway Station', x: 20.5, y: 25, width: 17, height: 22 },
    { id: 'Apartments', x: 39, y: 14, width: 20, height: 16 },
    { id: 'Park', x: 60, y: 24.5, width: 20, height: 25 },
    { id: 'School', x: 83.5, y: 23, width: 25, height: 28 },
    { id: 'Hospital', x: 20.5, y: 52.5, width: 19, height: 25 },
    { id: 'Market', x: 48, y: 52.5, width: 36, height: 25 },
    { id: 'Bank', x: 80.5, y: 52.5, width: 29, height: 25 },
  ];

  const handleBuildingClick = (buildingId) => {
    if (q1Status === 'correct' || q1Status === 'revealed') return;
    
    playClick();
    setSelectedBuilding(buildingId);

    if (buildingId === 'Hospital') {
      playSuccess();
      setQ1Status('correct');
      setTimeout(() => setCurrentQuestion(2), 2000);
    } else {
      const attempts = q1Attempts + 1;
      setQ1Attempts(attempts);
      setQ1Status('incorrect');
      
      if (attempts >= 2) {
        setTimeout(() => {
          setSelectedBuilding('Hospital');
          setQ1Status('revealed');
          setTimeout(() => setCurrentQuestion(2), 3000);
        }, 1500);
      }
    }
  };

  const renderQuestion1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <h4 style={{ margin: '0 0 0.2rem 0', color: 'var(--text-heading)', fontSize: '1.2rem' }}>Question 1</h4>
        <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 'bold' }}>
          Mark the Hospital on the map.
        </p>
        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Click on the building that represents the Hospital.
        </p>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '550px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <img src={mapBg} alt="Interactive Map" style={{ width: '100%', height: 'auto', display: 'block' }} />
        
        {/* Clickable Overlay */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'auto' }} viewBox="0 0 100 100" preserveAspectRatio="none">
          {buildings.map(b => {
            const isSelected = selectedBuilding === b.id;
            const isTarget = b.id === 'Hospital';
            
            let strokeColor = 'transparent';
            let strokeWidth = '0';
            let filter = 'none';

            if (isSelected) {
              if (q1Status === 'correct' || q1Status === 'revealed') {
                strokeColor = '#10b981';
                strokeWidth = '0.8';
                filter = 'drop-shadow(0 0 2px rgba(16, 185, 129, 0.8))';
              } else if (q1Status === 'incorrect') {
                strokeColor = '#ef4444';
                strokeWidth = '0.5';
              }
            } else if (isTarget && q1Status === 'revealed') {
              strokeColor = '#10b981';
              strokeWidth = '0.8';
              filter = 'drop-shadow(0 0 2px rgba(16, 185, 129, 0.8))';
            }

            return (
              <rect
                key={b.id}
                x={b.x - b.width / 2}
                y={b.y - b.height / 2}
                width={b.width}
                height={b.height}
                fill="transparent"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                style={{ cursor: (q1Status === 'correct' || q1Status === 'revealed') ? 'default' : 'pointer', filter, transition: 'all 0.3s' }}
                onClick={() => handleBuildingClick(b.id)}
              />
            );
          })}
        </svg>

        {/* Feedback Cards */}
        <AnimatePresence>
          {q1Status === 'correct' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.95)', padding: '0.8rem 1.5rem', borderRadius: '12px', border: '2px solid #10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <Check size={20} color="#10b981" />
              <div>
                <strong style={{ color: '#065f46', display: 'block' }}>Correct!</strong>
                <span style={{ color: '#475569', fontSize: '0.9rem' }}>This is the Hospital.</span>
              </div>
            </motion.div>
          )}
          {q1Status === 'incorrect' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.95)', padding: '0.8rem 1.5rem', borderRadius: '12px', border: '2px solid #ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <div>
                <strong style={{ color: '#991b1b', display: 'block' }}>Not quite.</strong>
                <span style={{ color: '#475569', fontSize: '0.9rem' }}>Try once more.</span>
              </div>
            </motion.div>
          )}
          {q1Status === 'revealed' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.95)', padding: '0.8rem 1.5rem', borderRadius: '12px', border: '2px solid #10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <div>
                <span style={{ color: '#475569', fontSize: '0.9rem', display: 'block' }}>The Hospital is located here.</span>
                <strong style={{ color: '#065f46' }}>Keep observing the map carefully!</strong>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {q1Status && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
           <button className="outline" onClick={() => setCurrentQuestion(2)} style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>Skip to Next</button>
        </div>
      )}
    </div>
  );

  const renderMCQ = (qNum, question, options, correctAnswer, explanation, state, setState) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <h4 style={{ margin: '0 0 0.2rem 0', color: 'var(--text-heading)', fontSize: '1.2rem' }}>Question {qNum}</h4>
        <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 'bold' }}>
          {question}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {options.map((opt) => {
          const isSelected = state === opt;
          const isCorrect = opt === correctAnswer;
          
          let bg = 'var(--surface)';
          let border = 'var(--border)';
          let shadow = 'none';

          if (state !== null) {
            if (isSelected) {
              bg = isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)';
              border = isCorrect ? '#10b981' : '#ef4444';
              shadow = isCorrect ? '0 8px 24px rgba(16, 185, 129, 0.15)' : '0 8px 24px rgba(239, 68, 68, 0.15)';
            } else if (isCorrect) {
              // Highlight correct answer if they got it wrong
              bg = 'rgba(16, 185, 129, 0.08)';
              border = '#10b981';
            }
          }

          return (
            <button
              key={opt}
              onClick={() => {
                if (state === null) {
                  playClick();
                  if (opt === correctAnswer) playSuccess();
                  setState(opt);
                }
              }}
              disabled={state !== null}
              style={{
                padding: '1rem 1.5rem', 
                borderRadius: '16px', 
                textAlign: 'left',
                background: bg,
                border: `2px solid ${border}`,
                cursor: state === null ? 'pointer' : 'default', 
                transition: 'all 0.25s ease',
                opacity: state !== null && !isSelected && !isCorrect ? 0.5 : 1,
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                boxShadow: shadow
              }}
            >
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${state !== null && (isSelected || isCorrect) ? border : 'var(--text-muted)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 {(state !== null && (isSelected || isCorrect)) && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: border }} />}
              </div>
              <span style={{ fontSize: '1.05rem', color: 'var(--text-heading)', fontWeight: 'bold' }}>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {state !== null && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1rem', padding: '1.25rem', borderRadius: '16px', background: state === correctAnswer ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${state === correctAnswer ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: state === correctAnswer ? '#059669' : '#b91c1c', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            {state === correctAnswer ? 'Correct!' : `Correct Answer: ${correctAnswer}`}
          </div>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
            {explanation}
          </p>
        </motion.div>
      )}

      {state !== null && qNum < 3 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="primary" onClick={() => setCurrentQuestion(qNum + 1)} style={{ padding: '0.8rem 1.5rem', borderRadius: '12px' }}>Next Question</button>
        </div>
      )}

      {state !== null && qNum === 3 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="primary" onClick={() => setShowCompletionPopup(true)} style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', background: '#10b981' }}>Finish Mission</button>
        </div>
      )}
    </div>
  );

  return (
    <motion.section 
      ref={checkpointRef}
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ type: 'spring', damping: 25 }}
    >
      <div className="glass-panel" style={{ padding: '2.5rem', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={20} color="var(--accent-text)" />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', fontWeight: 'bold' }}>
            MISSION CHECKPOINT
          </h3>
        </div>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '800px', marginBottom: '1.5rem' }}>
          Let's answer a few questions about the map.
        </p>

        {/* Content */}
        {currentQuestion === 1 && renderQuestion1()}
        
        {currentQuestion === 2 && renderMCQ(
          2,
          "What do the blue-coloured areas on the map represent?",
          ["Buildings", "Roads", "Water Bodies", "Trees"],
          "Water Bodies",
          "Blue colour usually represents water such as rivers or lakes.",
          q2Answer,
          setQ2Answer
        )}

        {currentQuestion === 3 && renderMCQ(
          3,
          "Which place is farthest from the Railway Station?",
          ["Apartments", "Hospital", "Bank"],
          "Bank",
          "The Bank is farther from the Railway Station than the Apartments or the Hospital.",
          q3Answer,
          setQ3Answer
        )}

        {/* Completion State POPUP */}
        {showCompletionPopup && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: 'spring', damping: 25 }} style={{ background: 'var(--surface)', padding: '3rem', borderRadius: '24px', textAlign: 'center', maxWidth: '450px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)' }}>
                 <span style={{ fontSize: '2.5rem' }}>🕵️</span>
               </div>
               <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: 'var(--text-primary)', marginTop: 0 }}>Mission Complete!</h2>
               <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.1rem' }}>
                 You successfully explored the city map and answered all the checkpoint questions. You are now ready to learn more about maps.
               </p>
               <div style={{ padding: '0.5rem 1rem', borderRadius: '20px', background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '2.5rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                 Map Observer
               </div>
               <button 
                  onClick={onComplete}
                  style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '1.25rem 2rem', borderRadius: '14px', fontSize: '1.15rem', fontWeight: 'bold', cursor: 'pointer', width: '100%', boxShadow: '0 4px 12px rgba(147,51,234,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  Continue to Atlas <ArrowRight size={20} />
                </button>
            </motion.div>
          </div>
        )}

      </div>
    </motion.section>
  );
}
