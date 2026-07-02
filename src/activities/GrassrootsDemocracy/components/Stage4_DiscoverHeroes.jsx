import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Heart, Shield, Users, Baby, Hand, CheckCircle2, BookOpen } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage4_DiscoverHeroes({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [activeHero, setActiveHero] = useState(null);
  const [balSabhaStep, setBalSabhaStep] = useState(0);
  const [electedMinisters, setElectedMinisters] = useState([]);

  const heroes = [
    { id: 'dnyaneshwar', name: 'Dnyaneshwar Kamble', title: 'First Transgender Sarpanch in Maharashtra', story: 'Elected in 2017, Dnyaneshwar faced immense social stigma but focused entirely on village development.', achievement: 'Service to the village is service to the public', changed: 'Built a stronger, more inclusive community and improved basic infrastructure.' },
    { id: 'vandana', name: 'Vandana Bahadur Maida', title: 'First Female Sarpanch of Khankhandvi', story: 'Broke traditional gender norms in her village by running for office and leading the Panchayat.', achievement: 'Addressed critical issues like education and sanitation', changed: 'Inspired other women to participate in local governance.' },
    { id: 'popatrao', name: 'Popatrao Baguji Pawar', title: 'Sarpanch of Hiware Bazar', story: 'Took over a village suffering from severe drought, poverty, and social issues.', achievement: 'Rainwater harvesting and massive tree planting', changed: 'Transformed Hiware Bazar into a green, prosperous village with a high standard of living.' }
  ];

  const minRoles = [
    { id: 'edu', title: 'Education Minister', icon: BookOpen },
    { id: 'health', title: 'Health Minister', icon: Heart },
    { id: 'env', title: 'Environment Minister', icon: Shield }
  ];

  // Need a fallback for BookOpen if not imported, replacing with Users just in case, but let's import it
  // Wait, I didn't import BookOpen here. Let's fix that.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }}>
      
      {/* 1. Real Changemakers */}
      <section>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Exemplary Sarpanchs
        </div>
        <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-heading)', marginBottom: '2rem' }}>
          Real Heroes of Grassroots
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {heroes.map((hero) => {
            const isActive = activeHero === hero.id;
            return (
              <motion.div 
                key={hero.id} 
                onClick={() => {
                  playClick();
                  setActiveHero(isActive ? null : hero.id);
                  if (!isActive) addXp(5);
                }}
                className="glass-panel" 
                style={{ 
                  padding: '1.5rem', background: isActive ? 'var(--card-bg)' : 'var(--surface)',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'transparent'}`, cursor: 'pointer'
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#eab308' }}>
                  <Star size={20} fill="#eab308" />
                </div>
                <h3 style={{ margin: '0 0 0.2rem 0', color: 'var(--text-heading)' }}>{hero.name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent)', marginBottom: '1rem', fontWeight: 'bold' }}>{hero.title}</div>
                
                <AnimatePresence>
                  {isActive && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                          <strong style={{ color: 'var(--text-secondary)' }}>The Story:</strong>
                          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', lineHeight: '1.5' }}>{hero.story}</p>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-secondary)' }}>Achievement:</strong>
                          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', lineHeight: '1.5', color: '#10b981' }}>{hero.achievement}</p>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-secondary)' }}>What Changed?</strong>
                          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', lineHeight: '1.5' }}>{hero.changed}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 2. Child Friendly Panchayat / Bal Sabha */}
      <section>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Children's Parliament
        </div>
        <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-heading)', marginBottom: '2rem' }}>
          Bal Panchayat
        </h2>

        <div className="glass-panel" style={{ padding: '2rem', background: 'var(--card-bg)' }}>
          {balSabhaStep === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', color: '#f43f5e' }}>
                <Baby size={32} />
                <h3 style={{ margin: 0 }}>The Children have complaints!</h3>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', fontStyle: 'italic' }}>"We have no playground!"</div>
                <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', fontStyle: 'italic' }}>"The school toilets are dirty."</div>
                <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', fontStyle: 'italic' }}>"The school boundary wall is broken."</div>
              </div>
              
              <button 
                onClick={() => { playClick(); setBalSabhaStep(1); addXp(10); }}
                className="primary" style={{ padding: '1rem 2rem', borderRadius: '12px' }}
              >
                Raise these issues in the Bal Sabha <Hand size={18} style={{ marginLeft: '0.5rem' }} />
              </button>
            </motion.div>
          )}

          {balSabhaStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)' }}>Elect Your Children's Parliament</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>To solve these problems, the children must form their own government. Elect ministers to handle specific issues.</p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {minRoles.map(role => {
                  const isElected = electedMinisters.includes(role.id);
                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        if (!isElected) {
                          playClick();
                          setElectedMinisters(prev => [...prev, role.id]);
                          addXp(10);
                          if (electedMinisters.length === 2) setBalSabhaStep(2);
                        }
                      }}
                      disabled={isElected}
                      style={{
                        flex: 1, minWidth: '150px', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                        background: isElected ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface)',
                        border: `1px solid ${isElected ? '#10b981' : 'var(--border)'}`,
                        cursor: isElected ? 'default' : 'pointer'
                      }}
                    >
                      <role.icon size={32} color={isElected ? '#10b981' : 'var(--text-secondary)'} />
                      <strong style={{ color: isElected ? '#10b981' : 'var(--text-primary)' }}>{role.title}</strong>
                      {isElected && <CheckCircle2 size={20} color="#10b981" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {balSabhaStep === 2 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <CheckCircle2 size={60} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ color: 'var(--text-heading)', fontSize: '1.8rem', margin: '0 0 1rem 0' }}>Problems Solved!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                  The Bal Sabha formally brought these issues to the adult Gram Panchayat. Because they organized and elected ministers, their voices were heard! The playground was built, toilets cleaned, and the wall repaired.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button 
          onClick={onComplete}
          disabled={balSabhaStep !== 2}
          className="primary" 
          style={{ opacity: balSabhaStep === 2 ? 1 : 0.5, padding: '0.8rem 1.5rem', gap: '0.5rem', borderRadius: '8px' }}
        >
          Explore Block & District Levels <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
