import React, { useState, useEffect } from 'react';
import { Compass, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Stage8_AyurvedaSummary({ onComplete, addXp }) {
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (!hasCompleted) {
      addXp(20);
      setHasCompleted(true);
      setTimeout(() => onComplete(), 2000); // Auto complete after reading
    }
  }, [hasCompleted, addXp, onComplete]);

  const gunasData = [
    { sanskrit1: 'guru', eng1: 'heavy', sanskrit2: 'laghu', eng2: 'light in weight' },
    { sanskrit1: 'manda', eng1: 'slow', sanskrit2: 'tīkṣhṇa', eng2: 'quick, fast' },
    { sanskrit1: 'hima', eng1: 'cold', sanskrit2: 'uṣhṇa', eng2: 'hot' },
    { sanskrit1: 'snigdha', eng1: 'unctous', sanskrit2: 'rukṣha', eng2: 'dry' },
    { sanskrit1: 'ślakṣhaṇa', eng1: 'smooth', sanskrit2: 'khara', eng2: 'rough' },
    { sanskrit1: 'sāndra', eng1: 'solid', sanskrit2: 'drava', eng2: 'liquid' },
    { sanskrit1: 'mṛidu', eng1: 'soft', sanskrit2: 'kaṭhina', eng2: 'hard' },
    { sanskrit1: 'sthira', eng1: 'stable', sanskrit2: 'khāla', eng2: 'moving, unstable' },
    { sanskrit1: 'sūkṣhma', eng1: 'subtle, small', sanskrit2: 'sthūla', eng2: 'big, gross' },
    { sanskrit1: 'viśhada', eng1: 'non slimy', sanskrit2: 'picchhila', eng2: 'slimy' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', flex: 1, overflowY: 'auto', paddingRight: '1rem', paddingBottom: '2rem' }}>
      
      {/* Chief Detective Monologue */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '10px' }}>
        <img 
          src="/images/chief_detective_blake.png" 
          alt="Chief Detective" 
          style={{ width: '100px', height: '100px', filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.15))', objectFit: 'contain' }}
        />
        <div style={{ flex: 1, background: '#f8fafc', padding: '20px', borderRadius: '0 20px 20px 20px', border: '1px solid #cbd5e1', position: 'relative' }}>
          {/* Speech bubble tail */}
          <div style={{ position: 'absolute', left: '-10px', top: '20px', width: '0', height: '0', borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '10px solid #cbd5e1' }}></div>
          <div style={{ position: 'absolute', left: '-8px', top: '20px', width: '0', height: '0', borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '10px solid #f8fafc' }}></div>
          
          <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#3b82f6', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: 'var(--text-sm)' }}>CHIEF DETECTIVE</span>
          </h4>
          <p style={{ margin: 0, color: '#334155', fontSize: 'var(--text-lg)', lineHeight: '1.6' }}>
            "We have thoroughly explored and understood the various properties of materials in the modern world. But wait! Most of the materials that we see today would have also existed earlier. I am curious to know... how did people classify them back then?"
          </p>
        </div>
      </div>

      {/* Do You Know Section */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '2px solid #b45309', background: '#fffbeb', padding: '2rem' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--text-3xl)', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={32} /> Do You Know? (Ancient Classification)
        </h3>
        
        <p style={{ margin: 0, fontSize: 'var(--text-xl)', color: '#78350f', lineHeight: '1.6' }}>
          A similar classification system existed in ancient India. <strong>Ayurveda</strong>, one of the Indian medical systems, has a system of grouping things using <strong>20 properties</strong> (<em>guṇa</em>—ten pairs of opposite properties).
        </p>
        
        <div style={{ background: 'rgba(255, 255, 255, 0.6)', padding: '2rem', borderRadius: '12px', textAlign: 'center', fontStyle: 'italic', color: '#92400e', margin: '1rem 0' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>गुरु मन्द हिम स्निग्ध श्लक्षण सान्द्र मृदु स्थिराः।</p>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>गुणाः ससूक्ष्म विशदाः विंशतिः स विपर्ययाः॥</p>
          <p style={{ margin: 0, fontSize: 'var(--text-lg)' }}>(Aṣhṭānga hṛidaya Sūtra sthāna 1.18)</p>
        </div>

        <p style={{ margin: 0, fontSize: 'var(--text-xl)', color: '#78350f', lineHeight: '1.6' }}>
          The shloka precisely talks about the 20 properties, which are used to describe all physical matter in Ayurveda. These properties can also be used to describe all living systems (plants, animals and humans), the environment and also food!
        </p>
      </div>

      {/* Properties Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
        <h4 style={{ fontSize: 'var(--text-2xl)', color: 'var(--text-heading)', margin: '0 0 0.5rem 0' }}>The 10 Pairs of Opposite Properties:</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {gunasData.map((pair, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ 
                background: 'var(--surface)', 
                border: '1px solid var(--border)', 
                borderRadius: '16px', 
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: '#b45309' }}>{pair.sanskrit1}</span>
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>({pair.eng1})</span>
              </div>
              
              <div style={{ padding: '0 20px', color: 'var(--accent)', fontWeight: 'bold', fontSize: 'var(--text-2xl)' }}>×</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-end', textAlign: 'right' }}>
                <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: '#10b981' }}>{pair.sanskrit2}</span>
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>({pair.eng2})</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Footer Instructions */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', minHeight: '40px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Review the ancient properties, then click "Proceed to next" when you are ready for the final concept map.</p>
      </div>

    </div>
  );
}
