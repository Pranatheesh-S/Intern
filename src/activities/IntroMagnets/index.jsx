import React, { useState, useCallback, useRef } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroMagnets({ onBackToDashboard, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastScrollTime = useRef(0);

  const scenes = [
    { img: '/scene-1.jpeg', subtitle: 'Scene 1: Reshma\'s Birthday Gift', text: 'Reshma lived in a coastal town of Kerala and loved writing short stories. Since her grandmother enjoyed listening to her stories, Reshma decided to write a special story as a birthday gift for her grandmother\'s 60th birthday.' },
    { img: '/scene-2.jpeg', subtitle: 'Scene 2: The Spice Ship', text: 'Her story was about a ship carrying spices like pepper, cardamom, and cinnamon from Kerala for trade in the olden days. The sailors used the stars at night to find the right direction across the sea.' },
    { img: '/scene-3.jpeg', subtitle: 'Scene 3: The Storm', text: 'Suddenly, in her story, the ship was caught in a fierce storm. Thick clouds covered the sky, and the stars disappeared. Reshma wondered how the sailors could continue their journey without seeing the stars.' },
    { img: '/scene-4.jpeg', subtitle: 'Scene 4: Searching for an Answer', text: 'Unable to continue her story, Reshma searched the internet and visited her school library. She discovered that sailors used a magnetic compass to find directions even when the stars were hidden.' },
    { img: '/scene-5.jpeg', subtitle: 'Scene 5: Discovering Magnets', text: 'This made Reshma curious about magnets. She remembered the magnets in her pencil box, purse, and the whiteboard duster at school. She realized that magnets were used in many everyday objects.' },
    { img: '/scene-6.jpeg', subtitle: 'Scene 6: A Story Completed', text: 'After learning how a magnetic compass works, Reshma completed her story. In her story, the sailors safely navigated through the storm using the compass. Her grandmother loved the story, and Reshma developed a new interest in learning about magnets and magnetism.' }
  ];

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, scenes.length - 1));
  }, [scenes.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const handleWheel = useCallback((e) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 700) return; // 700ms cooldown for smooth single-step scroll
    
    // Sensitivity check
    if (e.deltaY > 30) {
      handleNext();
      lastScrollTime.current = now;
    } else if (e.deltaY < -30) {
      handlePrev();
      lastScrollTime.current = now;
    }
  }, [handleNext, handlePrev]);

  return (
    <div 
      onWheel={handleWheel}
      style={{ 
        padding: '2rem', 
        maxWidth: '1200px', 
        margin: '0 auto', 
        color: 'var(--text-primary)', 
        fontFamily: 'system-ui, sans-serif', 
        height: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden' 
      }}
    >
      
      {/* Header */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', zIndex: 50 }}>
        <button 
          onClick={onBackToDashboard}
          style={{ 
            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-secondary)', 
            padding: '0.4rem 0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <ArrowLeft size={16} /> Back to Chapters
        </button>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>Introduction to Magnets: Reshma's Story</h1>
        <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', textAlign: 'center', lineHeight: '18px' }}>↕</span>
          Scroll to navigate
        </div>
      </div>

      {/* 3D Stack Container */}
      <div style={{ 
        flex: 1, 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        perspective: '1200px'
      }}>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '950px', height: '480px' }}>
          <AnimatePresence mode="popLayout">
            {scenes.map((scene, i) => {
              const offset = i - currentIndex;
              if (Math.abs(offset) > 3) return null; // optimize by not rendering distant cards

              const isPassed = offset < 0;
              const isActive = offset === 0;
              const isUpcoming = offset > 0;

              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.8, y: 100 }}
                  animate={{ 
                    opacity: isActive ? 1 : 0, 
                    scale: isActive ? 1 : (isUpcoming ? 0.8 : 1.2),
                    y: isActive ? 0 : (isUpcoming ? 50 : -50),
                    zIndex: 10 - offset,
                    pointerEvents: isActive ? 'auto' : 'none'
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                    alignItems: 'center',
                    gap: '4rem',
                    padding: '1rem',
                  }}
                >
                  <div style={{ flex: 1, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', flexBasis: '50%', height: '100%' }}>
                    <img 
                      src={scene.img} 
                      alt={scene.subtitle} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400/1e1b4b/818cf8?text=Scene+' + (i+1) }} 
                    />
                  </div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ flex: 1, flexBasis: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                  >
                    <h3 style={{ margin: '0 0 1.5rem 0', color: '#818cf8', fontSize: '2.2rem', fontWeight: 'bold' }}>{scene.subtitle}</h3>
                    <p style={{ margin: 0, color: '#e2e8f0', fontSize: '1.25rem', lineHeight: '1.8' }}>{scene.text}</p>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>



      </div>
      
      {/* Footer space with Complete Button */}
      <div style={{ height: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 50 }}>
        <AnimatePresence>
          {onComplete && currentIndex === scenes.length - 1 && (
            <motion.button 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              onClick={onComplete}
              style={{
                background: '#10b981', color: '#fff', border: 'none', padding: '1rem 2.5rem', 
                borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.background = '#059669';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = '#10b981';
              }}
            >
              <Check size={24} /> Complete Story & Continue
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
