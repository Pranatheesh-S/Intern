import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, Home } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage6_Conclusion({ onComplete, addXp }) {
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', { volume: 0.5 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playFanfare] = useSound('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', { volume: 0.6 });

  const [step, setStep] = useState(0); // 0: single, 1: many, 2: leaf, 3: plant
  const [showTeaser, setShowTeaser] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Zoom out sequence
    if (step < 3) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 2500);
      return () => clearTimeout(timer);
    } else if (step === 3 && !completed) {
      setTimeout(() => {
        playFanfare();
        addXp(20); // Completion bonus
        setCompleted(true);
      }, 1000);
    }
  }, [step, completed, playFanfare, addXp]);

  const handleRevealTeaser = () => {
    playClick();
    setShowTeaser(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-heading)', margin: '0 0 0.5rem 0' }}>Cells are the Building Blocks of Plants</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
          Every plant is made up of millions of cells. Cells are the basic structural and functional units of living things.
        </p>
      </div>

      {/* Visual Zoom Out Sequence */}
      <div style={{ width: '600px', height: '400px', background: 'var(--surface)', borderRadius: '24px', position: 'relative', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="single" initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 1 }} style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '8rem' }}>
              🦠
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="many" initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 1 }} style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '5rem', flexWrap: 'wrap', gap: '1rem', padding: '2rem' }}>
              🦠🦠🦠🦠🦠🦠🦠🦠🦠🦠🦠🦠🦠🦠🦠
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="leaf" initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 1 }} style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12rem' }}>
              🌿
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="plant" initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }} style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '15rem' }}>
              🌳
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Teaser */}
      {completed && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginTop: '2rem' }}>
          
          {!showTeaser ? (
            <button className="outline" onClick={handleRevealTeaser} style={{ padding: '1rem 3rem', fontSize: '1.2rem', borderRadius: '30px' }}>
              What about animals? 🤔
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '4rem' }}>
                🐯 🦅 🐋
              </div>
              <h3 style={{ color: 'var(--accent)', margin: 0 }}>You'll explore animal cells in the upcoming activity!</h3>
              
              <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '1rem 2rem', borderRadius: '12px', border: '1px solid var(--success)', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={24} />
                <h2 style={{ margin: 0 }}>Lab Completed! (+20 XP Bonus)</h2>
              </div>

              <button className="primary" onClick={onComplete} style={{ padding: '1rem 3rem', fontSize: '1.2rem', borderRadius: '30px', marginTop: '1rem' }}>
                <Home size={20} style={{ marginRight: '0.5rem' }} /> Return to Dashboard
              </button>
            </motion.div>
          )}

        </motion.div>
      )}

    </div>
  );
}
