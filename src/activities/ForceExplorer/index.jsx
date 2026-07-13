import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import PullActivity from './components/PullActivity';
import PushActivity from './components/PushActivity';
import CarryActivity from './components/CarryActivity';
import QuizAndDashboard from './components/QuizAndDashboard';

const STAGES = ['landing', 'pull', 'push', 'carry', 'quiz'];

export default function ForceExplorer({ onBackToDashboard }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [mass, setMass] = useState(20);
  const [friction, setFriction] = useState(0.3);
  const [currentForce, setCurrentForce] = useState(0);

  const currentStage = STAGES[stageIndex];

  const nextStage = () => {
    if (stageIndex < STAGES.length - 1) {
      setStageIndex(stageIndex + 1);
    }
  };

  const restart = () => {
    setStageIndex(0);
    setMass(20);
    setFriction(0.3);
  };

  const renderStage = () => {
    switch (currentStage) {
      case 'landing':
        return <LandingPage onStart={nextStage} />;
      case 'pull':
        return <PullActivity mass={mass} friction={friction} onComplete={nextStage} onForceChange={setCurrentForce} />;
      case 'push':
        return <PushActivity mass={mass} friction={friction} onComplete={nextStage} onForceChange={setCurrentForce} />;
      case 'carry':
        return <CarryActivity mass={mass} friction={friction} onComplete={nextStage} onForceChange={setCurrentForce} />;
      case 'quiz':
        return <QuizAndDashboard onRestart={restart} />;
      default:
        return null;
    }
  };

  const showSidebar = ['pull', 'push', 'carry'].includes(currentStage);

  return (
    <div style={{ width: '100%', minHeight: '600px', display: 'flex', background: 'var(--page-bg)', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--border)' }}>
      
      {/* Main Activity Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
        
        {/* Global Back Button */}
        <button 
          onClick={onBackToDashboard} 
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            zIndex: 50,
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            color: 'var(--text-primary)',
            fontWeight: '600'
          }}
        >
          ← Back
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', height: '100%', display: 'flex' }}
          >
            {renderStage()}
          </motion.div>
        </AnimatePresence>
      </div>

      
    </div>
  );
}
