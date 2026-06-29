import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Info, AlertTriangle, Building, MapPin, Users } from 'lucide-react';

export default function Stage1_Explore({ onComplete, addXp }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (option) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    setShowFeedback(true);
    addXp(10);
  };

  const [playAmbiance, { stop: stopAmbiance }] = useSound('https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3', { volume: 0.2, loop: true });
  
  useEffect(() => {
    playAmbiance();
    return () => stopAmbiance();
  }, [playAmbiance, stopAmbiance]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Section */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Explore · The Big Questions
        </div>
        <h1 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-heading)', lineHeight: '1.2' }}>
          Grassroots <span style={{ color: '#38bdf8' }}>Democracy</span><br />
          Local Government in Rural Areas
        </h1>
      </div>

      {/* Quote */}
      <div style={{ borderLeft: '3px solid #eab308', paddingLeft: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
        <p style={{ margin: 0 }}>The real India lives in its villages.</p>
        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#eab308', fontWeight: 'bold' }}>— M.K. Gandhi</p>
      </div>

      {/* Story Introduction */}
      <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: '1.6', maxWidth: '800px' }}>
        Welcome to <strong>Lakshmanpur</strong> — a village of 200 houses tucked in the foothills of the Himalayas. 
        Before we learn the rules, let's feel the problem the rules were built to solve.
      </p>

      {/* Hero Animation: Lakshmanpur */}
      <div style={{ 
        width: '100%', height: '200px', borderRadius: '16px', overflow: 'hidden', position: 'relative', 
        background: 'linear-gradient(to bottom, #0ea5e9 0%, #38bdf8 40%, #10b981 100%)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        {/* Animated Sun */}
        <motion.div 
          animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '20px', right: '40px', width: '60px', height: '60px', background: '#fef08a', borderRadius: '50%', boxShadow: '0 0 40px #fef08a' }} 
        />
        {/* Mountains */}
        <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0 }}>
          <path d="M0,200 L0,120 L150,50 L300,140 L450,60 L600,150 L800,40 L1000,130 L1000,200 Z" fill="#065f46" opacity="0.6" />
          <path d="M0,200 L0,150 L200,90 L350,160 L550,100 L700,170 L900,80 L1000,140 L1000,200 Z" fill="#047857" opacity="0.8" />
          <path d="M0,200 L0,180 L250,130 L400,180 L650,140 L850,190 L1000,160 L1000,200 Z" fill="#059669" />
          {/* Houses */}
          <rect x="230" y="120" width="30" height="20" fill="#fcd34d" />
          <polygon points="225,120 245,105 265,120" fill="#ef4444" />
          <rect x="380" y="160" width="40" height="25" fill="#fcd34d" />
          <polygon points="370,160 400,140 430,160" fill="#ef4444" />
          <rect x="630" y="125" width="25" height="18" fill="#fcd34d" />
          <polygon points="625,125 642,110 660,125" fill="#ef4444" />
        </svg>
      </div>

      {/* Data Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--surface)' }}>
          <div style={{ color: '#eab308', fontSize: '1.75rem', fontWeight: 'bold' }}>6 lakh</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>villages across India</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--surface)' }}>
          <div style={{ color: '#eab308', fontSize: '1.75rem', fontWeight: 'bold' }}>~2/3</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>of 1.4 billion people live in rural areas</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--surface)' }}>
          <div style={{ color: '#eab308', fontSize: '1.75rem', fontWeight: 'bold' }}>700</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>people in Lakshmanpur, mostly farmers</div>
        </div>
      </div>

      {/* Interactive Question Card */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🤔 The villagers face a daily question
        </h3>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
          The fields need water. Heavy rain has damaged the main road. The primary school needs upkeep. A crop has gone missing and there's a land dispute brewing. 
          <strong> Tap the question you think villagers should be able to answer themselves:</strong>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {['A', 'B'].map((option, index) => {
            const isSelected = selectedAnswer === option;
            const text = option === 'A' 
              ? "Repairing the village road, fixing the school, sorting a small land dispute" 
              : "Every single issue should be sent to the State capital or New Delhi to decide";
            const isCorrect = option === 'A';

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={selectedAnswer !== null}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '12px',
                  background: isSelected ? (isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'var(--surface)',
                  border: `1px solid ${isSelected ? (isCorrect ? '#10b981' : '#ef4444') : 'var(--border)'}`,
                  cursor: selectedAnswer === null ? 'pointer' : 'default',
                  transition: 'all 0.2s', textAlign: 'left',
                  opacity: selectedAnswer !== null && !isSelected ? 0.5 : 1
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: isSelected ? (isCorrect ? '#10b981' : '#ef4444') : 'var(--neutral-bg)', color: isSelected ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', flexShrink: 0 }}>
                  {option}
                </div>
                <span style={{ fontSize: '0.9rem', color: isSelected ? (isCorrect ? '#10b981' : '#ef4444') : 'var(--text-primary)' }}>
                  {text}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: '1rem', borderRadius: '12px', background: selectedAnswer === 'A' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${selectedAnswer === 'A' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.5' }}
            >
              {selectedAnswer === 'A' ? (
                <><strong>Exactly!</strong> Imagine if a villager had to travel 500 km to the capital just to fix a leaking pipe. That's why India needs a system of local self-government.</>
              ) : (
                <><strong>Think about the distance...</strong> If millions of villages sent every broken road complaint to New Delhi, the government would freeze! Villages need the power to govern their own local issues.</>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Step 1 of 7 · Set the scene</span>
        <button 
          onClick={onComplete}
          disabled={!showFeedback}
          className="primary" 
          style={{ opacity: showFeedback ? 1 : 0.5, padding: '0.8rem 1.5rem', gap: '0.5rem', borderRadius: '8px' }}
        >
          Meet the system <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
