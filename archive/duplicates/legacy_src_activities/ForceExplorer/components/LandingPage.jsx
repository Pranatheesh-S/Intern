import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { TreeSVG, CloudSVG } from './SvgAssets';

export default function LandingPage({ onStart }) {
  return (
    <div style={{
      flex: 1,
      position: 'relative',
      background: 'linear-gradient(to bottom, #87CEEB 0%, #e0f6ff 60%, #a3b18a 60%, #588157 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: '10%', left: '10%' }}>
        <motion.div animate={{ x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}>
          <CloudSVG width={120} height={80} />
        </motion.div>
      </div>
      <div style={{ position: 'absolute', top: '20%', right: '15%' }}>
        <motion.div animate={{ x: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}>
          <CloudSVG width={180} height={100} opacity={0.6} />
        </motion.div>
      </div>

      <div style={{ position: 'absolute', bottom: '25%', left: '5%' }}>
        <TreeSVG width={150} height={200} />
      </div>
      <div style={{ position: 'absolute', bottom: '20%', right: '10%' }}>
        <TreeSVG width={100} height={150} />
      </div>
      
      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(10px)',
          padding: '3rem',
          borderRadius: '24px',
          boxShadow: 'var(--card-shadow)',
          textAlign: 'center',
          maxWidth: '600px',
          zIndex: 10
        }}
      >
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0', color: 'var(--text-heading)', fontWeight: 800 }}>
          <span style={{ color: 'var(--accent)' }}>Force</span> Explorer
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
          Welcome to Activity 5.1! Get ready to explore the four main types of force: 
          <strong> Push, Pull, Lift, and Carry</strong>.
          <br /><br />
          Experience how friction and mass affect movement, and test your skills in the physics simulator!
        </p>

        <button 
          className="primary interactive"
          onClick={onStart}
          style={{
            padding: '1rem 2.5rem',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            borderRadius: '50px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Play fill="white" size={24} /> Start Learning <ArrowRight size={20} />
        </button>
      </motion.div>
    </div>
  );
}
