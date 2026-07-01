import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, UserCheck, FileText, Map, PieChart } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage3_Experience({ onComplete, addXp, setElectedSarpanch }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [step, setStep] = useState(0);
  const [votedFor, setVotedFor] = useState(null);

  const handleVote = (candidate) => {
    playClick();
    setVotedFor(candidate);
    if(setElectedSarpanch) setElectedSarpanch(candidate);
    setStep(1);
  };

  const continueAfterVote = () => {
    playSuccess();
    addXp(20);
    setStep(2);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }}>
      
      {/* 1. Gram Panchayat & Gram Sabha */}
      <section>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Gram Panchayat & Gram Sabha
        </div>
        <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-heading)', marginBottom: '2rem' }}>
          Democracy in Action
        </h2>

        {step === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '2.5rem', background: 'var(--card-bg)', borderRadius: '24px' }}>
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
              <Users size={28} color="var(--primary)" /> The Gram Sabha is gathering
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.1rem' }}>
              The Gram Sabha consists of <strong>all eligible adult voters</strong> in the village. Anyone who is 18 years old or more and has the right to vote is a member. 
            </p>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.6', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '1rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
              These members elect the Sarpanch (Panchayat President). Today is election day! Two candidates are running, each with different development priorities.
            </p>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              <button onClick={() => handleVote('Meera Devi')} className="outline" style={{ flex: 1, minWidth: '200px', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', borderRadius: '16px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--neutral-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>👩🏽</div>
                <div style={{ textAlign: 'center' }}>
                  <strong style={{ fontSize: '1.3rem', display: 'block', marginBottom: '0.25rem' }}>Meera Devi</strong>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Focus: Better Schools & Clinics</span>
                </div>
                <div style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Vote for Meera</div>
              </button>

              <button onClick={() => handleVote('Ramesh Kumar')} className="outline" style={{ flex: 1, minWidth: '200px', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', borderRadius: '16px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--neutral-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>👨🏽</div>
                <div style={{ textAlign: 'center' }}>
                  <strong style={{ fontSize: '1.3rem', display: 'block', marginBottom: '0.25rem' }}>Ramesh Kumar</strong>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Focus: Roads & Agriculture</span>
                </div>
                <div style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Vote for Ramesh</div>
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, height: 0 }} className="glass-panel" style={{ padding: '2.5rem', background: 'var(--card-bg)', borderRadius: '24px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PieChart size={32} />
                </div>
              </div>
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.8rem', color: 'var(--text-heading)' }}>Election Results</h3>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{votedFor === 'Meera Devi' ? '👩🏽' : '👨🏽'}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>{votedFor}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>58%</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>WINNER</div>
                </div>
                
                <div style={{ width: '1px', background: 'var(--border)' }}></div>
                
                <div style={{ textAlign: 'center', opacity: 0.6 }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{votedFor === 'Meera Devi' ? '👨🏽' : '👩🏽'}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>{votedFor === 'Meera Devi' ? 'Ramesh Kumar' : 'Meera Devi'}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>42%</div>
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                <strong>Congratulations!</strong> {votedFor} has secured the majority vote and is officially the new Sarpanch. This demonstrates how democratic decision-making works in a Gram Sabha!
              </div>

              <button onClick={continueAfterVote} className="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '12px' }}>
                Continue Learning
              </button>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-panel" style={{ padding: '2.5rem', background: 'var(--card-bg)', borderRadius: '24px' }}>
              <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '1.5rem' }}>
                <UserCheck size={28} /> The Gram Panchayat is Formed
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.1rem' }}>
                Every village Panchayat is divided into wards. Each ward elects a representative known as the Ward Member (Panch). The <strong>Panchs</strong> and the <strong>Sarpanch</strong> (whom you just elected) together form the Gram Panchayat for a term of five years.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 2. Secretary & Patwari */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-heading)', marginBottom: '1.5rem' }}>Other Important Roles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              
              <div className="glass-panel" style={{ padding: '2rem', background: 'var(--surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', color: '#38bdf8' }}>
                    <FileText size={32} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--text-heading)' }}>The Secretary</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', textTransform: 'uppercase' }}>Government Appointed</div>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                  The Gram Panchayat has a Secretary who is also the Secretary of the Gram Sabha. This person is <strong>not elected</strong> but appointed by the government. The Secretary is responsible for calling the meeting of the Gram Sabha and keeping records.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '2rem', background: 'var(--surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '12px', color: '#eab308' }}>
                    <Map size={32} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--text-heading)' }}>The Patwari</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', textTransform: 'uppercase' }}>Land Record Officer</div>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                  Measuring land and keeping land records is the main work of the Patwari. They are responsible for a group of villages, maintaining and updating the records of the village.
                </p>
              </div>

            </div>

            {/* Footer Navigation */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button 
                onClick={onComplete}
                className="primary" 
                style={{ padding: '0.8rem 1.5rem', gap: '0.5rem', borderRadius: '8px' }}
              >
                Meet Real Changemakers <ArrowRight size={16} />
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

    </div>
  );
}
