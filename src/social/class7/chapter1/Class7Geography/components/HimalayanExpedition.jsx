import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import HimalayaMissionCard from './HimalayaMissionCard';
import HimalayanMap from './HimalayanMap';
import DistanceCounter from './DistanceCounter';
import CountryTracker from './CountryTracker';
import ElevationRibbon from './ElevationRibbon';
import HimalayaProgressTimeline from './HimalayaProgressTimeline';

const DISTANCES = [0, 420, 900, 1450, 1850, 2500];

export default function HimalayanExpedition({ onComplete, addXp }) {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [travelState, setTravelState] = useState('IDLE'); // 'IDLE', 'TRAVELLING', 'COMPLETED'
  const totalStops = 6;
  const isComplete = travelState === 'COMPLETED';

  useEffect(() => {
    if (isComplete) {
      addXp(150);
    }
  }, [isComplete, addXp]);

  const handleNextStop = () => {
    if (currentStopIndex < totalStops - 1) {
      setTravelState('TRAVELLING');
    }
  };

  const handleStopReached = () => {
    setCurrentStopIndex(prev => prev + 1);
    setTravelState('IDLE');
  };

  const handleFinish = () => {
    setTravelState('COMPLETED');
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      
      {/* Top Main Layout: 100% Map with Floating Overlays */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        
        {/* Floating Top-Left Overlay: Mission Objective */}
        <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 20, width: '320px' }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            HIMALAYAN EXPEDITION
          </h5>
          <h1 style={{ margin: '0 0 1rem 0', fontSize: '1.8rem', color: 'var(--text-heading)', lineHeight: 1.1 }}>
            Explore the Himalayas
          </h1>
          <HimalayaMissionCard currentStopIndex={currentStopIndex} />
        </div>

        {/* Floating Top-Right Overlays: Distance & Countries */}
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 20 }}>
          <DistanceCounter 
            targetDistance={DISTANCES[travelState === 'TRAVELLING' ? currentStopIndex + 1 : currentStopIndex]} 
            duration={travelState === 'TRAVELLING' ? 3000 : 1000} 
          />
        </div>
        
        {/* We place Country Tracker below Distance Counter or centered top? The screenshot showed it clustered. Let's put it centered top. */}
        <div style={{ position: 'absolute', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 20, width: '50%' }}>
          <CountryTracker currentStopIndex={currentStopIndex} />
        </div>

        {/* 100% Map Area */}
        <div style={{ flex: 1, position: 'relative' }}>
          <HimalayanMap 
            currentStopIndex={currentStopIndex} 
            travelState={travelState} 
            onStopReached={handleStopReached}
            onNextStop={handleNextStop}
            onFinish={handleFinish}
          />
        </div>
        
        {/* Floating Bottom Center: Elevation Ribbon */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', width: '80%', zIndex: 20 }}>
          <ElevationRibbon currentStopIndex={currentStopIndex} totalStops={totalStops} />
        </div>
      </div>

      {/* Bottom Progress Tracker */}
      <div style={{ width: '100%', padding: '0 2.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
        <HimalayaProgressTimeline currentStopIndex={currentStopIndex} />
      </div>

      {/* Completion Overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.5, type: 'spring' }}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--accent)',
                padding: '3rem',
                borderRadius: '24px',
                textAlign: 'center',
                boxShadow: '0 0 50px rgba(139, 92, 246, 0.4)',
                maxWidth: '500px'
              }}
            >
              <h2 style={{ color: 'var(--accent)', margin: '0 0 1rem 0', fontSize: '2.5rem' }}>Congratulations!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                You have successfully travelled across the Himalayan Range.
              </p>
              
              <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  🏔 Himalayan Explorer
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-around', gap: '2rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-heading)', fontSize: '1.5rem', fontWeight: 'bold' }}>2500 km</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Distance Covered</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-heading)', fontSize: '1.5rem', fontWeight: 'bold' }}>6</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Regions Visited</div>
                  </div>
                </div>
              </div>

              <button
                onClick={onComplete}
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%'
                }}
              >
                Continue <ArrowRight size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
