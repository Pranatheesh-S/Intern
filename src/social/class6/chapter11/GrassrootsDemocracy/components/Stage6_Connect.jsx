import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Scroll, Clock, ArrowDown } from 'lucide-react';
import useSound from 'use-sound';
import AncientVillageScene from './AncientVillageScene';
import AncientRootsAnimation from './AncientRootsAnimation';

export default function Stage6_Connect({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [step, setStep] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }}>
      
      <section>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Ancient Connection
        </div>
        <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-heading)', marginBottom: '2rem' }}>
          Echoes from the Past
        </h2>

        <div style={{ position: 'relative', padding: '2rem 0' }}>
          {/* Vertical Timeline Line */}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '4px', background: 'var(--border)', transform: 'translateX(-50%)', borderRadius: '4px' }}></div>

          {/* Point 1: Ancient India */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: '4rem', position: 'relative' }}>
            <div style={{ width: '45%', minWidth: '300px', display: 'flex', justifyContent: 'flex-end', paddingRight: '2rem' }}>
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '1.5rem', background: 'var(--card-bg)', textAlign: 'right', position: 'relative', width: '100%' }}>
                <div className="timeline-dot" style={{ position: 'absolute', top: '20px', right: '-45px', width: '20px', height: '20px', background: '#b45309', borderRadius: '50%', zIndex: 2, border: '4px solid var(--bg)' }}></div>
                <div style={{ color: '#b45309', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                   300 BCE <Clock size={20} />
                </div>
                <h3 style={{ margin: '0 0 1rem 0' }}>The Arthaśāstra</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Written by Kautilya (Chanakya) over 2,300 years ago. It described an administrative structure starting from the village level.</p>
                <div style={{ background: 'rgba(180, 83, 9, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '1rem', fontStyle: 'italic', color: 'var(--text-primary)', borderRight: '4px solid #b45309' }}>
                  "Establish a sangrahana for 10 villages... a kārvatika for 100 villages."
                </div>
              </motion.div>
            </div>
            <div style={{ width: '45%', minWidth: '300px', display: 'flex', justifyContent: 'flex-start', paddingLeft: '2rem' }}>
               <AncientVillageScene />
            </div>
          </div>

          {/* Point 2: Modern India */}
          {step >= 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'relative' }}>
              <div style={{ width: '45%', minWidth: '300px', display: 'flex', justifyContent: 'flex-end', paddingRight: '2rem' }}>
                 <AncientRootsAnimation />
              </div>
              <div style={{ width: '45%', minWidth: '300px', display: 'flex', justifyContent: 'flex-start', paddingLeft: '2rem' }}>
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-panel" style={{ padding: '1.5rem', background: 'var(--card-bg)', textAlign: 'left', position: 'relative', width: '100%' }}>
                  <div className="timeline-dot" style={{ position: 'absolute', top: '20px', left: '-45px', width: '20px', height: '20px', background: '#10b981', borderRadius: '50%', zIndex: 2, border: '4px solid var(--bg)' }}></div>
                  <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={20} /> Today
                  </div>
                  <h3 style={{ margin: '0 0 1rem 0' }}>Panchayati Raj</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Our modern 3-tier system is a direct reflection of these ancient roots, proving that decentralized local governance has always been in India's DNA.</p>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '1rem', fontWeight: 'bold', color: 'var(--text-primary)', borderLeft: '4px solid #10b981' }}>
                    Gram Panchayat (Village) → Panchayat Samiti (Block) → Zila Parishad (District)
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button 
          onClick={() => { playClick(); addXp(10); onComplete(); }}
          className="primary" 
          style={{ padding: '0.8rem 1.5rem', gap: '0.5rem', borderRadius: '8px' }}
        >
          Review & Complete Chapter <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
