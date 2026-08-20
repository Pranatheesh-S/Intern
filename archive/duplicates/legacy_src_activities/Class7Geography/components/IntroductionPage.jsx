import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import MissionCard from './MissionCard';
import ExpeditionMap from './ExpeditionMap';

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
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative'
    }}>

      {/* Left Section - 40% */}
      <div style={{
        width: '40%',
        minWidth: '350px',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflowY: 'auto',
        scrollbarWidth: 'none',
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
            fontSize: '2.5rem',
            lineHeight: '1.2',
            margin: '0 0 1rem 0',
            fontWeight: '800',
            color: 'var(--text-heading)',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>
            Discover the Geography of India
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.5',
            color: 'var(--text-secondary)',
            margin: '0 0 1.5rem 0',
            maxWidth: '100%'
          }}>
            Travel across mountains, rivers, deserts, plateaus, coasts, and islands to discover how geography shapes people's lives in one of the most diverse countries in the world.
          </p>
        </motion.div>

        <MissionCard currentStopIndex={currentStopIndex} />

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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isIdle ? 1 : 0 }}
          transition={{ duration: 1 }}
          style={{ position: 'absolute', bottom: '2.5rem', right: '2.5rem', zIndex: 100 }}
        >
          <button
            onClick={onBeginExpedition}
            disabled={!isIdle}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              backgroundColor: 'var(--accent)',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              cursor: isIdle ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 10px 25px rgba(168, 85, 247, 0.3)',
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
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(168, 85, 247, 0.3)';
              }
            }}
          >
            Begin Expedition <ArrowRight />
          </button>
        </motion.div>
      </div>

      {/* Media query for responsive design (tablet/mobile stacking) is ideally handled via external CSS, but using inline styles for now. In a full app, we'd use CSS modules or styled-components. */}
    </div>
  );
}
