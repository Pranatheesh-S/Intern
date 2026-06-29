import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, UserCheck, Hand, PlusCircle } from 'lucide-react';

export default function Stage3_Experience({ onComplete, addXp }) {
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState(10);
  const [improvements, setImprovements] = useState([]);

  const issues = [
    { id: 'road', name: 'Repair Main Road', cost: 4, icon: PlusCircle },
    { id: 'school', name: 'Fix School Roof', cost: 3, icon: PlusCircle },
    { id: 'water', name: 'New Water Pump', cost: 5, icon: PlusCircle },
    { id: 'hospital', name: 'Village Dispensary', cost: 6, icon: PlusCircle }
  ];

  const handleVote = () => {
    addXp(20);
    setStep(1);
  };

  const handleBuy = (issue) => {
    if (budget >= issue.cost && !improvements.includes(issue.id)) {
      setBudget(prev => prev - issue.cost);
      setImprovements([...improvements, issue.id]);
      addXp(10);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Experience · The Gram Sabha
        </div>
        <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-heading)' }}>
          Run the Village
        </h2>
      </div>

      {step === 0 && (
        <div className="glass-panel" style={{ padding: '2rem', background: 'var(--card-bg)' }}>
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="var(--primary)" /> Welcome to the Gram Sabha
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            All adults in Lakshmanpur are gathered. It's time to elect the Sarpanch! There are two candidates.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button onClick={handleVote} className="outline" style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', borderRadius: '12px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--neutral-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👩🏽</div>
              <strong>Candidate A</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Focuses on Education</span>
            </button>
            <button onClick={handleVote} className="outline" style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', borderRadius: '12px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--neutral-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👨🏽</div>
              <strong>Candidate B</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Focuses on Agriculture</span>
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="glass-panel" style={{ padding: '2rem', background: 'var(--card-bg)' }}>
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
            <UserCheck size={20} /> You elected the Sarpanch!
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Now, the Gram Panchayat has a budget of <strong>₹{budget} Lakhs</strong>. Prioritize the village needs!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
            {issues.map(issue => {
              const isBought = improvements.includes(issue.id);
              const canAfford = budget >= issue.cost;
              return (
                <button 
                  key={issue.id} 
                  onClick={() => handleBuy(issue)}
                  disabled={isBought || !canAfford}
                  style={{
                    padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: isBought ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface)',
                    border: `1px solid ${isBought ? '#10b981' : 'var(--border)'}`,
                    opacity: (!isBought && !canAfford) ? 0.5 : 1, cursor: (isBought || !canAfford) ? 'default' : 'pointer'
                  }}
                >
                  <span style={{ color: isBought ? '#10b981' : 'var(--text-primary)', fontWeight: 'bold' }}>{issue.name}</span>
                  <span style={{ background: 'var(--neutral-bg)', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ₹{issue.cost}L
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <button onClick={onComplete} className="primary" style={{ padding: '0.8rem 1.5rem', gap: '0.5rem', borderRadius: '8px' }}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
