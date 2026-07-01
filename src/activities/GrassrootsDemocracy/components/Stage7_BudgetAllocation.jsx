import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calculator, IndianRupee, Landmark, ShieldCheck } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage7_BudgetAllocation({ onComplete, addXp, electedSarpanch }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [playError] = useSound('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3', { volume: 0.5 });
  
  const [step, setStep] = useState(0); // 0 = Input, 1 = Report
  
  const TOTAL_BUDGET = 1000000;
  
  // Define categories and their thresholds
  // Minimums sum to 7,00,000, leaving 3,00,000 for flexibility.
  const categories = [
    { id: 'road', name: 'Road Repair', min: 150000, icon: '🛣️', overlayX: 35, overlayY: 70 },
    { id: 'school', name: 'School Maintenance', min: 100000, icon: '🏫', overlayX: 20, overlayY: 55 },
    { id: 'water', name: 'Drinking Water', min: 120000, icon: '🚰', overlayX: 90, overlayY: 66 },
    { id: 'health', name: 'Health Centre', min: 100000, icon: '🏥', overlayX: 78, overlayY: 35 },
    { id: 'agriculture', name: 'Agriculture', min: 80000, icon: '🌾', overlayX: 68, overlayY: 65 },
    { id: 'drainage', name: 'Drainage', min: 50000, icon: '💧', overlayX: 50, overlayY: 85 },
    { id: 'lights', name: 'Street Lights', min: 50000, icon: '💡', overlayX: 43, overlayY: 67 },
    { id: 'welfare', name: 'Community Welfare', min: 50000, icon: '🤝', overlayX: 50, overlayY: 53 }
  ];

  const [allocations, setAllocations] = useState(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: 0 }), {})
  );

  const [errorMsg, setErrorMsg] = useState('');

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + (val || 0), 0);
  const remainingBudget = TOTAL_BUDGET - totalAllocated;

  const handleInputChange = (id, value) => {
    const num = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setAllocations(prev => ({ ...prev, [id]: num }));
    setErrorMsg('');
  };

  const handleSubmit = () => {
    if (remainingBudget !== 0) {
      playError();
      setErrorMsg(`You must allocate exactly ₹10,00,000. You have ₹${remainingBudget.toLocaleString('en-IN')} remaining.`);
      return;
    }
    if (totalAllocated > TOTAL_BUDGET) {
      playError();
      setErrorMsg(`You exceeded the budget by ₹${Math.abs(remainingBudget).toLocaleString('en-IN')}!`);
      return;
    }
    
    playSuccess();
    addXp(50);
    setStep(1);
  };

  const evaluateAllocation = (id, amount) => {
    const cat = categories.find(c => c.id === id);
    if (amount === 0) return { status: '❌', class: 'error', desc: 'No allocation.' };
    if (amount < cat.min / 2) return { status: '❌', class: 'error', desc: 'Severely underfunded.' };
    if (amount < cat.min) return { status: '⚠', class: 'warning', desc: 'Partial repairs completed.' };
    if (amount >= cat.min + 50000) return { status: '⭐', class: 'excellent', desc: 'Excellent development!' };
    return { status: '✅', class: 'success', desc: 'Needs met successfully.' };
  };

  const getOverallScore = () => {
    let score = 0;
    Object.keys(allocations).forEach(id => {
      const result = evaluateAllocation(id, allocations[id]).status;
      if (result === '⭐') score += 100;
      else if (result === '✅') score += 80;
      else if (result === '⚠') score += 40;
    });
    return Math.round(score / categories.length);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }}>
      
      <section>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Practical Application
        </div>
        <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-heading)', marginBottom: '1rem' }}>
          Budget Allocation
        </h2>
        
        <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '1rem 1.5rem', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #38bdf8' }}>
          <ShieldCheck size={28} color="#38bdf8" />
          <span>Welcome to the office, <strong>Sarpanch {electedSarpanch || 'Leader'}</strong>! It is time to make decisions for Lakshmanpur.</span>
        </div>

        {step === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '2.5rem', background: 'var(--card-bg)', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
              
              <div style={{ flex: '1 1 300px' }}>
                <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
                  <Landmark size={24} color="var(--primary)" /> Village Fund
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem', marginBottom: '2rem' }}>
                  The government has granted your Panchayat <strong>₹10,00,000</strong>. Allocate funds to the sectors below. You must spend the entire budget to submit your plan, but choose wisely!
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {categories.map(cat => (
                    <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--surface)', padding: '1rem', borderRadius: '12px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                      <div style={{ flex: 1, fontWeight: 'bold' }}>{cat.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>₹</span>
                        <input 
                          type="text" 
                          value={allocations[cat.id] === 0 ? '' : allocations[cat.id].toLocaleString('en-IN')}
                          onChange={(e) => handleInputChange(cat.id, e.target.value)}
                          placeholder="0"
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100px', fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'right' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ flex: '0 0 350px', position: 'sticky', top: '2rem' }}>
                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: `2px solid ${remainingBudget === 0 ? '#10b981' : (remainingBudget < 0 ? '#ef4444' : 'var(--border)')}` }}>
                  <h4 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', color: 'var(--text-heading)' }}>
                    <Calculator size={20} /> Budget Summary
                  </h4>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    <span>Total Budget:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>₹10,00,000</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    <span>Allocated:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>₹{totalAllocated.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: remainingBudget === 0 ? '#10b981' : (remainingBudget < 0 ? '#ef4444' : 'var(--text-heading)') }}>
                    <span>Remaining:</span>
                    <span>₹{remainingBudget.toLocaleString('en-IN')}</span>
                  </div>

                  {errorMsg && (
                    <div style={{ marginTop: '1.5rem', color: '#ef4444', fontSize: '0.9rem', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                      {errorMsg}
                    </div>
                  )}

                  <button 
                    onClick={handleSubmit} 
                    className="primary" 
                    style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1.1rem', borderRadius: '12px', opacity: remainingBudget === 0 ? 1 : 0.6 }}
                  >
                    Submit Budget
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel" style={{ padding: '2.5rem', background: 'var(--card-bg)', borderRadius: '24px' }}>
              
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '2rem', color: 'var(--text-heading)', textAlign: 'center' }}>
                Village Development Report
              </h3>
              
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Overall Development Score</span>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>{getOverallScore()}%</div>
              </div>

              {/* Visual Report Image overlay */}
              <div style={{ 
                width: '100%', 
                height: '460px', 
                borderRadius: '24px', 
                position: 'relative', 
                background: '#1e293b',
                boxShadow: '0 20px 45px rgba(0,0,0,0.3)', 
                border: '1px solid var(--border)',
                marginBottom: '3rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: "url('/lakshmanpur_clean_background.png')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '100%',
                  height: '100%',
                }} />
                
                {/* Overlays for met requirements */}
                {categories.map(cat => {
                  const status = evaluateAllocation(cat.id, allocations[cat.id]).status;
                  if (status === '✅' || status === '⭐') {
                    return (
                      <motion.div 
                        key={cat.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.5 }}
                        style={{
                          position: 'absolute',
                          left: `${cat.overlayX}%`,
                          top: `${cat.overlayY}%`,
                          transform: 'translate(-50%, -50%)',
                          background: 'rgba(255, 255, 255, 0.9)',
                          padding: '0.5rem',
                          borderRadius: '50%',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          fontSize: '1.5rem',
                          border: '2px solid #10b981',
                          zIndex: 10
                        }}
                      >
                        {cat.icon}
                      </motion.div>
                    );
                  }
                  return null;
                })}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {categories.map(cat => {
                  const evalResult = evaluateAllocation(cat.id, allocations[cat.id]);
                  return (
                    <div key={cat.id} style={{ display: 'flex', gap: '1rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', borderLeft: `4px solid ${evalResult.status === '❌' ? '#ef4444' : (evalResult.status === '⚠' ? '#f59e0b' : '#10b981')}` }}>
                      <div style={{ fontSize: '2rem' }}>{evalResult.status}</div>
                      <div>
                        <strong style={{ fontSize: '1.1rem', display: 'block', color: 'var(--text-heading)' }}>{cat.name}</strong>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>₹{allocations[cat.id].toLocaleString('en-IN')} allocated</span>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{evalResult.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3rem' }}>
                <button 
                  onClick={() => { playClick(); onComplete(); }}
                  className="primary" 
                  style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Proceed to Chapter Summary <ArrowRight size={18} />
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </section>
    </div>
  );
}
