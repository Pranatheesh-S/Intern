import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Layers, Home, Map, ChevronDown } from 'lucide-react';

export default function Stage2_Discover({ onComplete, addXp }) {
  const [expandedTier, setExpandedTier] = useState(null);

  const tiers = [
    { id: 'district', name: 'District Panchayat / Zila Parishad', color: '#0ea5e9', desc: 'At the top level, coordinates across the whole district.', icon: Map },
    { id: 'block', name: 'Block Panchayat / Panchayat Samiti', color: '#f97316', desc: 'The middle tier, acts as a link between District and Village.', icon: Layers },
    { id: 'village', name: 'Gram Panchayat', color: '#84cc16', desc: 'The base level, dealing directly with village matters.', icon: Home }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Discover · Three-Tier System
        </div>
        <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-heading)' }}>
          The Panchayati Raj System
        </h2>
      </div>

      <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
        Like every village in India, Lakshmanpur has a local government called a 'Panchayat'. It brings governance closer to the people so they can participate in decision-making. The system works at three levels.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', margin: '2rem 0' }}>
        {tiers.map((tier, index) => {
          const isExpanded = expandedTier === tier.id;
          const width = 100 - (index * 15) + '%'; 
          
          return (
            <motion.div 
              key={tier.id}
              onClick={() => {
                setExpandedTier(isExpanded ? null : tier.id);
                if (!isExpanded) addXp(5);
              }}
              style={{
                width: width, maxWidth: '600px', cursor: 'pointer',
                background: `linear-gradient(135deg, ${tier.color} 0%, ${tier.color}dd 100%)`,
                borderRadius: '12px', padding: '1.5rem', color: 'white',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem'
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <tier.icon size={24} />
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{tier.name}</span>
                </div>
                <ChevronDown size={20} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      {tier.desc}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Step 2 of 7</span>
        <button onClick={onComplete} className="primary" style={{ padding: '0.8rem 1.5rem', gap: '0.5rem', borderRadius: '8px' }}>
          Enter the Gram Sabha <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
