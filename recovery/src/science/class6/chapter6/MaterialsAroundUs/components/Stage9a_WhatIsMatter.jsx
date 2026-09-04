import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle2, Circle, Scale, Droplets } from 'lucide-react';
import AirExperiments3D from './AirExperiments3D';

export default function Stage9a_WhatIsMatter({ onComplete, addXp }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [clueRevealed, setClueRevealed] = useState(false);
  
  const handleAnswer = (val) => {
    if (clueRevealed) return;
    setSelectedAnswer(val);
  };
  
  const handleSubmit = () => {
    if (selectedAnswer && !clueRevealed) {
      setClueRevealed(true);
      if (typeof addXp === 'function') addXp(20);
      if (typeof onComplete === 'function') {
        setTimeout(onComplete, 500);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%', background: 'var(--lesson-background)', overflow: 'hidden' }}>
      
      {/* LEFT SIDEBAR (MOCK) */}
      <div style={{ width: '280px', flexShrink: 0, borderRight: '1px solid var(--lesson-border)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#FFFFFF' }}>
         <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            <div>
               <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--lesson-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>CASE 6.4</div>
               <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--lesson-primary)', lineHeight: '1.1' }}>The Mystery<br/>of Matter</div>
            </div>
         </div>
         <div style={{ fontSize: '0.85rem', color: 'var(--lesson-secondary)', fontStyle: 'italic', paddingLeft: '8px', borderLeft: '2px solid var(--lesson-border)' }}>
            Follow the clues to crack what &apos;matter&apos; really means.
         </div>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 10px', background: 'white', border: '1px solid var(--lesson-border)', borderRadius: '8px', position: 'relative', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ position: 'absolute', left: -1, top: '50%', transform: 'translateY(-50%)', width: '4px', height: '60%', background: '#A64B27', borderTopRightRadius: '4px', borderBottomRightRadius: '4px' }}></div>
                <div style={{ flexShrink: 0, background: '#A64B27', color: 'white', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>1</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                   <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#A64B27' }}>Barrier 4:</div>
                   <div style={{ fontSize: '0.95rem', fontWeight: '900', color: 'var(--lesson-primary)' }}>What is Matter?</div>
                   <div style={{ fontSize: '0.8rem', color: '#A64B27' }}>Mass & Volume</div>
                </div>
            </div>
            
            {[
              { num: 2, top: 'Detective Checkpoint', mid: '(Barrier 4)', bot: 'Evidence Review' },
              { num: 3, top: 'Do You Know?', mid: 'Ancient Classification', bot: '' },
              { num: 4, top: 'Concept Map', mid: 'Property Review', bot: '' },
              { num: 5, top: 'Final Wrap-up', mid: '', bot: '' }
            ].map((item) => (
              <div key={item.num} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 10px', opacity: 0.6 }}>
                  <div style={{ flexShrink: 0, border: '2px solid var(--lesson-muted)', color: 'var(--lesson-muted)', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>{item.num}</div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                     <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--lesson-primary)' }}>{item.top}</div>
                     {item.mid && <div style={{ fontSize: '0.85rem', color: 'var(--lesson-text)' }}>{item.mid}</div>}
                     {item.bot && <div style={{ fontSize: '0.8rem', color: 'var(--lesson-secondary)' }}>{item.bot}</div>}
                  </div>
              </div>
            ))}
         </div>
         
         <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--lesson-primary)', textTransform: 'uppercase' }}>Clues found</div>
            <div style={{ display: 'flex', gap: '8px' }}>
               {clueRevealed ? <CheckCircle2 size={24} color="#A64B27" /> : <Circle size={24} color="var(--lesson-border)" />}
               <Circle size={24} color="var(--lesson-border)" />
               <Circle size={24} color="var(--lesson-border)" />
            </div>
         </div>
      </div>
      
      {/* RIGHT MAIN CONTENT */}
      <div style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
         <div style={{ flex: 1, background: '#FFFFFF', borderRadius: '24px', border: '1px solid var(--lesson-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', padding: '24px', gap: '16px', overflow: 'hidden' }}>
            
            {/* Header / Intro */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--lesson-border)', paddingBottom: '12px', flexShrink: 0 }}>
               <img src="/images/chief_detective_blake.png" alt="Aura" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
               <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--lesson-primary)' }}>Detective Aura: Let&apos;s begin with a simple situation.</div>
                  <div style={{ fontSize: '1rem', color: 'var(--lesson-text)' }}>What are we trying to find out here?</div>
               </div>
            </div>
            
            {/* Section 1: Bottle Observation */}
            <div style={{ display: 'flex', gap: '20px', flexShrink: 0 }}>
               <div style={{ flex: '0 0 180px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'var(--lesson-background)', borderRadius: '16px', padding: '12px', border: '1px solid var(--lesson-border)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--lesson-primary)' }}>Observe the scene</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--lesson-text)', textAlign: 'center', fontWeight: 'bold' }}>Why can&apos;t we fill this bottle completely?</div>
                  <div style={{ flex: 1, width: '100%', minHeight: '80px', position: 'relative' }}>
                     <img src="/images/volume_overflow.png" alt="Bottle" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--lesson-secondary)' }}>Some space is still left.</div>
               </div>
               
               <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--lesson-primary)' }}>What could be stopping the water?</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--lesson-secondary)', fontWeight: 'bold' }}>Think and choose:</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                     {['The bottle', 'The water', 'Something else inside'].map(opt => (
                        <button 
                           key={opt}
                           onClick={() => handleAnswer(opt)}
                           style={{ 
                              display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', 
                              borderRadius: '8px', cursor: clueRevealed ? 'default' : 'pointer',
                              background: selectedAnswer === opt ? 'var(--lesson-success-bg)' : 'white',
                              border: `1px solid ${selectedAnswer === opt ? '#A64B27' : 'var(--lesson-border)'}`,
                              color: 'var(--lesson-primary)', fontWeight: '600', fontSize: '0.9rem'
                           }}
                        >
                           {selectedAnswer === opt ? <CheckCircle2 size={16} color="#A64B27" /> : <Circle size={16} color="var(--lesson-muted)" />}
                           {opt}
                        </button>
                     ))}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                     <button 
                        onClick={handleSubmit}
                        disabled={!selectedAnswer || clueRevealed}
                        style={{ background: '#A64B27', color: '#FFFFFF', border: 'none', padding: '6px 20px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9rem', opacity: (!selectedAnswer || clueRevealed) ? 0.5 : 1, cursor: (!selectedAnswer || clueRevealed) ? 'default' : 'pointer' }}
                     >
                        Submit ✓
                     </button>
                  </div>
               </div>
            </div>
            
            {/* Clue Revealed Area */}
            <AnimatePresence>
               {clueRevealed && (
                  <motion.div 
                     initial={{ opacity: 0, height: 0, y: 10 }}
                     animate={{ opacity: 1, height: 'auto', y: 0 }}
                     style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}
                  >
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--lesson-success-bg)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--lesson-success-border)', flexShrink: 0 }}>
                        <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                        <div style={{ flex: 1 }}>
                           <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#A64B27' }}>Clue revealed!</div>
                           <div style={{ fontSize: '0.95rem', color: 'var(--lesson-text)' }}>There is something inside the bottle that takes up <strong style={{ color: 'var(--lesson-primary)' }}>space</strong>. That something is <strong style={{ color: 'var(--lesson-primary)' }}>matter</strong>.</div>
                        </div>
                        <HelpCircle size={28} color="#A64B27" opacity={0.5} />
                     </div>
                     
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--lesson-primary)' }}>What is matter?</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'white', borderRadius: '8px', border: '1px solid var(--lesson-border)' }}>
                           <CheckCircle2 size={18} color="#A64B27" />
                           <div style={{ fontSize: '1rem', color: 'var(--lesson-text)' }}>
                              Anything that <strong style={{ color: 'var(--lesson-primary)', background: 'var(--lesson-highlight)', padding: '0 4px' }}>occupies space</strong> and <strong style={{ color: 'var(--lesson-primary)', background: 'var(--lesson-highlight)', padding: '0 4px' }}>has mass</strong> is called matter.
                           </div>
                        </div>
                     </div>
                     
                     <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                        <div style={{ flex: 1, background: 'var(--lesson-background)', borderRadius: '12px', border: '1px solid var(--lesson-border)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <div style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--lesson-primary)' }}>Mass</div>
                              <Scale size={20} color="var(--lesson-secondary)" />
                           </div>
                           <div style={{ fontSize: '0.85rem', color: 'var(--lesson-text)' }}>The <strong>quantity of matter</strong>.</div>
                           <div style={{ fontSize: '0.8rem', color: 'var(--lesson-secondary)', marginTop: '2px' }}>Measured in kilogram (<strong>kg</strong>) and gram (<strong>g</strong>).</div>
                        </div>
                        
                        <div style={{ flex: 1, background: 'var(--lesson-background)', borderRadius: '12px', border: '1px solid var(--lesson-border)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <div style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--lesson-primary)' }}>Volume</div>
                              <Droplets size={20} color="var(--lesson-secondary)" />
                           </div>
                           <div style={{ fontSize: '0.85rem', color: 'var(--lesson-text)' }}>The <strong>space occupied</strong> by matter.</div>
                           <div style={{ fontSize: '0.8rem', color: 'var(--lesson-secondary)', marginTop: '2px' }}>Measured in litre (<strong>L</strong>), millilitre (<strong>mL</strong>), and cubic metre (<strong>m³</strong>).</div>
                        </div>
                     </div>
                     
                     <div style={{ display: 'flex', gap: '12px', flexShrink: 0, minHeight: 0 }}>
                         <div style={{ flex: 1, background: 'var(--lesson-warning-bg)', borderRadius: '12px', border: '1px dashed var(--lesson-warning-border)', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--lesson-text)' }}>Important Fact:</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--lesson-primary)' }}>1 m³ = 1000 L</div>
                         </div>
                     </div>
                     
                     <AirExperiments3D />
                     
                  </motion.div>
               )}
            </AnimatePresence>
            
         </div>
      </div>
    </div>
  );
}

Stage9a_WhatIsMatter.propTypes = {
  onComplete: PropTypes.func,
  addXp: PropTypes.func
};
