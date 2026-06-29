import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, UserCheck, CheckCircle2, FileText, Landmark, Map } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage3_Experience({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState(10);
  const [improvements, setImprovements] = useState([]);

  const issues = [
    { id: 'road', name: 'Repair Main Road', cost: 4 },
    { id: 'school', name: 'Fix School Roof', cost: 3 },
    { id: 'water', name: 'New Water Pump', cost: 5 },
    { id: 'hospital', name: 'Village Dispensary', cost: 6 }
  ];

  const handleVote = () => {
    playClick();
    addXp(20);
    setStep(1);
  };

  const handleBuy = (issue) => {
    if (budget >= issue.cost && !improvements.includes(issue.id)) {
      playClick();
      setBudget(prev => prev - issue.cost);
      setImprovements([...improvements, issue.id]);
      addXp(10);
      if (improvements.length >= 1) {
        setStep(2);
      }
    }
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '2rem', background: 'var(--card-bg)' }}>
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
              <Users size={28} color="var(--primary)" /> The Gram Sabha is gathering
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.1rem' }}>
              The Gram Sabha is a meeting of all adults who live in the area covered by a Panchayat. Anyone who is 18 years old or more and has the right to vote is a member. 
            </p>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.6', fontSize: '1.1rem', fontWeight: 'bold' }}>
              Today is special! It's election day for the new Sarpanch (Panchayat President). Cast your vote:
            </p>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              <button onClick={handleVote} className="outline" style={{ flex: 1, minWidth: '200px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', borderRadius: '12px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--neutral-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👩🏽</div>
                <strong style={{ fontSize: '1.2rem' }}>Meera Devi</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Promises better schools</span>
              </button>
              <button onClick={handleVote} className="outline" style={{ flex: 1, minWidth: '200px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', borderRadius: '12px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--neutral-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>👨🏽</div>
                <strong style={{ fontSize: '1.2rem' }}>Ramesh Kumar</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Promises better farming</span>
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {step >= 1 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-panel" style={{ padding: '2rem', background: 'var(--card-bg)' }}>
              <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '1.5rem' }}>
                <UserCheck size={28} /> The Sarpanch is Elected!
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.1rem' }}>
                Every village Panchayat is divided into wards. Each ward elects a representative known as the Ward Member (Panch). All the members of the Gram Sabha also elect a Sarpanch who is the Panchayat President.
              </p>
              
              <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Landmark size={20} /> Budget Allocation Simulation
                </h4>
                <p style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  The Gram Panchayat has received a budget of <strong>₹{budget} Lakhs</strong> from the state government. The Gram Sabha must now approve where this money goes. Click on the issues to solve them!
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {issues.map(issue => {
                    const isBought = improvements.includes(issue.id);
                    const canAfford = budget >= issue.cost;
                    return (
                      <button 
                        key={issue.id} 
                        onClick={() => handleBuy(issue)}
                        disabled={isBought || !canAfford}
                        style={{
                          padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start',
                          background: isBought ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface)',
                          border: `1px solid ${isBought ? '#10b981' : 'var(--border)'}`,
                          opacity: (!isBought && !canAfford) ? 0.5 : 1, cursor: (isBought || !canAfford) ? 'default' : 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span style={{ color: isBought ? '#10b981' : 'var(--text-primary)', fontWeight: 'bold' }}>{issue.name}</span>
                          {isBought && <CheckCircle2 size={16} color="#10b981" />}
                        </div>
                        <span style={{ background: 'var(--neutral-bg)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Cost: ₹{issue.cost}L
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
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
                  The Gram Panchayat has a Secretary who is also the Secretary of the Gram Sabha. This person is <strong>not elected</strong> but appointed by the government. The Secretary is responsible for calling the meeting of the Gram Sabha and Gram Panchayat and keeping a record of the proceedings.
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
                  Measuring land and keeping land records is the main work of the Patwari. The Patwari is known by different names in different states. They are responsible for a group of villages, maintaining and updating the records of the village.
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
