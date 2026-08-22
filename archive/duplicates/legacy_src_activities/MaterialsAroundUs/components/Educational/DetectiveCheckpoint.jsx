import React, { useState } from 'react';
import { ShieldAlert, Check, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';

export default function DetectiveCheckpoint({ data, onComplete, addXp }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [view, setView] = useState('intro'); // 'intro' or 'quiz'
  
  const BLAKE_IMG_URL = '/images/chief_detective_blake.png';

  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [playError] = useSound('https://assets.mixkit.co/active_storage/sfx/2997/2997-preview.mp3', { volume: 0.5 });

  const q = data.questions[currentQ];

  const SpeechBubble = ({ text }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        position: 'absolute', bottom: '30px', left: '-20px', right: '-20px',
        background: 'white', padding: '1.25rem 1.5rem', borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)', zIndex: 20
      }}
    >
      <div style={{
        position: 'absolute', top: '-14px', left: '24px', background: '#64748b', color: 'white',
        padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold',
        letterSpacing: '1px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        CHIEF BLAKE
      </div>
      <div style={{
        position: 'absolute', top: '-12px', left: '12px', width: 0, height: 0,
        borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
        borderBottom: '12px solid white', zIndex: -1
      }} />
      <p style={{ margin: 0, fontSize: '1.05rem', color: '#1e293b', lineHeight: '1.5', fontWeight: '500' }}>{text}</p>
    </motion.div>
  );

  if (view === 'intro') {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', gap: '4rem' }}>
        <div style={{ position: 'relative', height: '450px', width: '320px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <img 
            src={BLAKE_IMG_URL} 
            alt="Chief Detective" 
            style={{ height: '450px', objectFit: 'contain' }} 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/200x450.png?text=Blake'; }}
          />
          <SpeechBubble text="Let's check your knowledge from this Barrier before we record our findings! Are you ready?" />
        </div>
        
        <button 
          className="primary" 
          onClick={() => setView('quiz')} 
          style={{ padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
        >
          Start Checkpoint <ArrowRight size={20} />
        </button>
      </div>
    );
  }

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    
    if (idx === q.correct) {
      setIsCorrect(true);
      try { playSuccess(); } catch(e){}
      if (addXp) addXp(50);
      
      setTimeout(() => {
        if (currentQ < data.questions.length - 1) {
          setCurrentQ(prev => prev + 1);
          setSelected(null);
          setIsCorrect(null);
        } else {
          onComplete();
        }
      }, 1500);
    } else {
      setIsCorrect(false);
      try { playError(); } catch(e){}
      // Let them try again
      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
      }, 1000);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '4px solid var(--accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <ShieldAlert size={32} color="var(--accent)" />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>{data.title || "Detective Checkpoint"}</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Verify your understanding to proceed.</p>
          </div>
        </div>

        <div style={{ minHeight: '250px' }}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                {q.question}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {q.options.map((opt, idx) => {
                  let bg = 'var(--surface)';
                  let border = '1px solid var(--border)';
                  
                  if (selected === idx) {
                    if (isCorrect) {
                      bg = 'var(--success-bg)';
                      border = '1px solid var(--success)';
                    } else if (isCorrect === false) {
                      bg = 'var(--danger-bg)';
                      border = '1px solid var(--danger)';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={selected !== null && isCorrect}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '1rem', borderRadius: '8px',
                        background: bg, border: border,
                        cursor: selected !== null && isCorrect ? 'default' : 'pointer',
                        color: 'var(--text-primary)', textAlign: 'left', fontSize: '1rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt}
                      {selected === idx && isCorrect && <Check color="var(--success)" />}
                      {selected === idx && isCorrect === false && <X color="var(--danger)" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Question {currentQ + 1} of {data.questions.length}
        </div>
      </div>
    </div>
  );
}
