import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Map, Layers, Home, CheckCircle2 } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage5_Decide({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  
  const [issues, setIssues] = useState([
    { id: 'hospital', text: 'We need a big District Hospital', tier: 'district', status: 'village' },
    { id: 'road', text: 'Connect 5 villages with a tar road', tier: 'block', status: 'village' }
  ]);

  const [activeTier, setActiveTier] = useState('village');

  const handleForward = (issueId, currentTier) => {
    playClick();
    let nextTier = 'block';
    if (currentTier === 'block') nextTier = 'district';

    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        if (nextTier === issue.tier) {
          playSuccess();
          addXp(15);
        }
        return { ...issue, status: nextTier };
      }
      return issue;
    }));
  };

  const allResolved = issues.every(i => i.status === i.tier);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }}>
      
      <section>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Beyond the Village
        </div>
        <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-heading)', marginBottom: '1rem' }}>
          Block & District Panchayat
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Not all problems can be solved by a single village. The Gram Panchayat must forward large-scale requests to the Panchayat Samiti (Block level), which then coordinates with the Zila Parishad (District level). Let's see how information flows!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Tiers */}
          {['district', 'block', 'village'].map((tierName) => {
            let label = '';
            let icon = null;
            let color = '';
            if (tierName === 'district') { label = 'Zila Parishad (District Level)'; icon = Map; color = '#0ea5e9'; }
            if (tierName === 'block') { label = 'Panchayat Samiti (Block Level)'; icon = Layers; color = '#f97316'; }
            if (tierName === 'village') { label = 'Gram Panchayat (Village Level)'; icon = Home; color = '#84cc16'; }

            const tierIssues = issues.filter(i => i.status === tierName);

            return (
              <div key={tierName} className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface)', borderLeft: `4px solid ${color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: color, marginBottom: '1rem' }}>
                  {React.createElement(icon, { size: 24 })}
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>{label}</h3>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <AnimatePresence>
                    {tierIssues.length === 0 && tierName !== 'village' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem' }}>Waiting for requests...</motion.div>
                    )}
                    {tierIssues.map(issue => (
                      <motion.div 
                        key={issue.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1rem', flex: '1 1 250px' }}
                      >
                        <div style={{ fontWeight: 'bold' }}>"{issue.text}"</div>
                        
                        {issue.tier === tierName ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 'bold' }}>
                            <CheckCircle2 size={18} /> Request Approved!
                          </div>
                        ) : (
                          <button onClick={() => handleForward(issue.id, tierName)} className="outline" style={{ fontSize: '0.85rem', padding: '0.5rem' }}>
                            Forward to Higher Level
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {allResolved && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>Perfect Information Flow!</h3>
            <p style={{ color: 'var(--text-primary)', margin: 0 }}>
              You successfully forwarded the road request to the Block level (since it connects multiple villages), and the hospital request all the way to the District level! This is exactly how the 3-tier Panchayati Raj system distributes responsibility.
            </p>
          </motion.div>
        )}

      </section>

      {/* Footer Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button 
          onClick={onComplete}
          disabled={!allResolved}
          className="primary" 
          style={{ opacity: allResolved ? 1 : 0.5, padding: '0.8rem 1.5rem', gap: '0.5rem', borderRadius: '8px' }}
        >
          Discover the Ancient Connection <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
