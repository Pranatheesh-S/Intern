import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Shuffle } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage5_BrickWall({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', { volume: 0.5 });
  const [playError] = useSound('https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3', { volume: 0.5 });

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matches, setMatches] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);

  const leftItems = [
    { id: 'brick', label: 'A single brick' },
    { id: 'arrangement', label: 'Arrangement of bricks' },
    { id: 'wall', label: 'The entire wall' }
  ];

  const rightItems = [
    { id: 'arrangement', label: 'Arrangement of cells' },
    { id: 'wall', label: 'Plant tissue' },
    { id: 'brick', label: 'A single cell' }
  ];

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft === selectedRight) {
        // Match!
        playSuccess();
        setMatches(prev => [...prev, selectedLeft]);
        setSelectedLeft(null);
        setSelectedRight(null);
        addXp(5); // 5 XP per match = 15 XP total
      } else {
        // Mismatch
        playError();
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 500);
      }
    }
  }, [selectedLeft, selectedRight, playSuccess, playError, addXp]);

  useEffect(() => {
    if (matches.length === 3) {
      setTimeout(() => setShowAnimation(true), 1000);
    }
  }, [matches]);

  const handleLeftClick = (id) => {
    if (!matches.includes(id)) {
      playClick();
      setSelectedLeft(id);
    }
  };

  const handleRightClick = (id) => {
    if (!matches.includes(id)) {
      playClick();
      setSelectedRight(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem' }}>
      
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-heading)', margin: '0 0 0.5rem 0' }}>The Brick Wall Analogy</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
          What similarity do you notice between the onion cells and a brick wall? Match the corresponding concepts.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>
        
        {/* Left Side: Images & Animation */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '2rem', position: 'relative' }}>
          
          <div style={{ width: '400px', height: '300px', position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            
            {/* Brick Wall Image */}
            <motion.div 
              style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url("https://images.unsplash.com/photo-1588806222718-4bba61b4ffc5?auto=format&fit=crop&w=800&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              animate={{ opacity: showAnimation ? 0 : 1 }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
            
            {/* Onion Cells Image */}
            <motion.div 
              style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/4/48/Onion_cells.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: showAnimation ? 1 : 0 }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />

          </div>

          <AnimatePresence>
            {showAnimation && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--accent)' }}
              >
                <h3 style={{ margin: 0 }}>Just like bricks make up a wall, cells make up living tissue!</h3>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right Side: Matching Game */}
        <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: 'var(--text-heading)' }}>Brick Wall</h3>
            <Shuffle size={20} color="var(--text-muted)" />
            <h3 style={{ margin: 0, color: 'var(--text-heading)' }}>Onion Cells</h3>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {leftItems.map(item => {
                const isMatched = matches.includes(item.id);
                const isSelected = selectedLeft === item.id;
                return (
                  <button
                    key={'left'+item.id}
                    onClick={() => handleLeftClick(item.id)}
                    style={{
                      padding: '1rem', borderRadius: '8px', border: `2px solid ${isMatched ? 'var(--success)' : isSelected ? 'var(--accent)' : 'var(--border)'}`,
                      background: isMatched ? 'var(--success-bg)' : isSelected ? 'var(--accent-bg)' : 'var(--surface)',
                      color: isMatched ? 'var(--success)' : isSelected ? 'var(--accent)' : 'var(--text-heading)',
                      cursor: isMatched ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center', fontWeight: 'bold'
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {rightItems.map(item => {
                const isMatched = matches.includes(item.id);
                const isSelected = selectedRight === item.id;
                return (
                  <button
                    key={'right'+item.id}
                    onClick={() => handleRightClick(item.id)}
                    style={{
                      padding: '1rem', borderRadius: '8px', border: `2px solid ${isMatched ? 'var(--success)' : isSelected ? 'var(--accent)' : 'var(--border)'}`,
                      background: isMatched ? 'var(--success-bg)' : isSelected ? 'var(--accent-bg)' : 'var(--surface)',
                      color: isMatched ? 'var(--success)' : isSelected ? 'var(--accent)' : 'var(--text-heading)',
                      cursor: isMatched ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center', fontWeight: 'bold'
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: showAnimation ? 1 : 0, height: showAnimation ? 'auto' : 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--success)', textAlign: 'center', marginTop: '1rem' }}>
              <CheckCircle size={24} style={{ marginBottom: '0.5rem' }} />
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>All matches found!</p>
            </div>
            <button className="primary" onClick={onComplete} style={{ width: '100%', padding: '1rem', borderRadius: '30px', marginTop: '1rem' }}>
              Next: Conclusion <ArrowRight size={18} />
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
