import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import BackgroundEffects from './BackgroundEffects';
import MissionCard from './MissionCard';
import ExpeditionMap from './ExpeditionMap';
import ProgressTracker from './ProgressTracker';

export default function IntroductionPage({ onBeginExpedition, onExit }) {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    // Determine when the intro sequence finishes (7 stops)
    if (currentStopIndex === 7) {
      setTimeout(() => setIsIdle(true), 1500);
    }
  }, [currentStopIndex]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: 'calc(100vh - 150px)',
      backgroundColor: 'var(--page-bg)',
      background: 'var(--page-bg-gradient)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'row',
      color: 'var(--text-primary)',
      borderRadius: '16px',
      border: '1px solid var(--card-border)',
      boxShadow: 'var(--card-shadow)'
    }}>
      <BackgroundEffects />

      {/* Left Section - 40% */}
      <div style={{
        width: '40%',
        minWidth: '400px',
        padding: '4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        zIndex: 10,
        position: 'relative'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <div style={{
            color: 'var(--accent)',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            letterSpacing: '0.15em',
            marginBottom: '1rem'
          }}>
            EXPEDITION 01
          </div>
          
          <h1 style={{
            fontSize: '3rem',
            lineHeight: '1.1',
            margin: '0 0 1.5rem 0',
            fontWeight: '800',
            color: 'var(--text-heading)',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>
            Discover the Geography of India
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            lineHeight: '1.6',
            color: 'var(--text-secondary)',
            margin: '0 0 2rem 0',
            maxWidth: '90%'
          }}>
            India is one of the most geographically diverse countries in the world.
            <br/><br/>
            During this expedition, you will travel across mountains, rivers, deserts, plateaus, coasts and islands to discover how geography shapes people's lives.
          </p>
        </motion.div>

        <MissionCard currentStopIndex={currentStopIndex} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isIdle ? 1 : 0.4 }}
          transition={{ duration: 1 }}
          style={{ marginTop: '3rem' }}
        >
          <button
            onClick={onBeginExpedition}
            disabled={!isIdle}
            style={{
              padding: '1.25rem 3rem',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              backgroundColor: isIdle ? 'var(--accent)' : 'var(--button-disabled)',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              cursor: isIdle ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: isIdle ? '0 10px 25px rgba(0, 0, 0, 0.2)' : 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (isIdle) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(168, 85, 247, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (isIdle) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(168, 85, 247, 0.4)';
              }
            }}
          >
            Begin Expedition <ArrowRight />
          </button>
        </motion.div>
      </div>

      {/* Right Section - 60% */}
      <div style={{
        width: '60%',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <ExpeditionMap 
          currentStopIndex={currentStopIndex} 
          onStopReached={(index) => setCurrentStopIndex(index)}
        />
        <ProgressTracker currentStopIndex={currentStopIndex} />
      </div>

      {/* Media query for responsive design (tablet/mobile stacking) is ideally handled via external CSS, but using inline styles for now. In a full app, we'd use CSS modules or styled-components. */}
    </div>
  );
}
