import React from 'react';
import { motion } from 'framer-motion';
import deskImage from '../images/intro_briefing_desk.png';

export default function IntroBriefing({ onComplete, addXp }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%',
        minHeight: '500px',
        backgroundImage: `url(${deskImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        position: 'relative'
      }}
    >
      <div style={{
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '1.5rem', 
        padding: '2.5rem', 
        background: 'rgba(20, 25, 35, 0.85)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        textAlign: 'center',
        maxWidth: '650px',
        margin: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{ 
        width: '80px', 
        height: '80px', 
        borderRadius: '50%', 
        background: 'rgba(99, 102, 241, 0.1)', 
        border: '2px solid #D9C9A3',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#A64B27',
        fontSize: '2.5rem'
      }}>
        🕵️‍♂️
      </div>

      <div>
        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#A64B27' }}>Active Assignment</span>
        <h2 style={{ margin: '0.25rem 0 0.75rem 0', fontSize: '1.8rem', color: 'var(--lesson-primary)' }}>Mission: Material Detective</h2>
        <div style={{ height: '2px', width: '60px', background: '#A64B27', margin: '0.5rem auto 1rem' }} />
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--lesson-secondary)', lineHeight: '1.6', maxWidth: '520px' }}>
          Welcome, <strong>Detective</strong>! Your mission is to explore your classroom and investigate the <strong>materials around you</strong>.
          You will scan objects to discover what substances they are made of, test their physical properties, and solve hands-on science puzzles.
        </p>
      </div>

      <div style={{ 
        background: '#FFFFFF', 
        border: '1px solid var(--lesson-border)', 
        borderRadius: '10px', 
        padding: '1rem 1.5rem', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.5rem',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--lesson-text)' }}>
          <span>🔒</span> <span><strong>Barrier 1:</strong> 6.1 Observing Objects Around Us</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--lesson-text)' }}>
          <span>🔒</span> <span><strong>Barrier 2:</strong> 6.2 How to Group Materials?</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--lesson-text)' }}>
          <span>🔒</span> <span><strong>Barrier 3:</strong> 6.3 Different Properties of Materials</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--lesson-text)' }}>
          <span>🔒</span> <span><strong>Barrier 4:</strong> 6.4 What is Matter?</span>
        </div>
      </div>

        <button 
          onClick={() => {
            addXp(10);
            onComplete();
          }}
          className="primary"
          style={{ padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 'bold', gap: '0.5rem', marginTop: '0.5rem' }}
        >
          <span>Accept Case File & Begin Investigation</span>
        </button>
      </div>
    </motion.div>
  );
}
