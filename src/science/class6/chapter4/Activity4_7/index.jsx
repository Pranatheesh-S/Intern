import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Compass, TestTube2, Trophy } from 'lucide-react';
import Simulation from './Simulation';
import Questions from './Questions';
import ChallengeMode from './ChallengeMode';
import DidYouKnow from './DidYouKnow';

export default function Activity4_7({ onBackToDashboard, onComplete }) {
  const [activeTab, setActiveTab] = useState('simulation');
  const [simCompleted, setSimCompleted] = useState(false);
  const [questionsCompleted, setQuestionsCompleted] = useState(false);

  const tabs = [
    { id: 'simulation', label: '1. Interactive Lab', icon: TestTube2 },
    { id: 'questions', label: '2. Concept Check', icon: BookOpen, disabled: !simCompleted },
    { id: 'challenge', label: '3. Challenge Mode', icon: Trophy, disabled: !questionsCompleted }
  ];

  return (
    <div style={{ 
      width: '100%',
      height: 'calc(100vh - 16px)', 
      maxHeight: '100vh',
      margin: '0 auto',
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      boxSizing: 'border-box',
      padding: '0.5rem 0.75rem',
      background: 'var(--bg-color)', 
      color: 'var(--text-primary)'
    }}>
      {/* Top Header Bar matching Activity 4.2 / 4.5 Standard */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        paddingBottom: '0.4rem',
        marginBottom: '0.4rem',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0
      }}>
        {/* Left Column: Back Button matching Activity 4.2 & 4.5 */}
        <button 
          onClick={onBackToDashboard}
          style={{ 
            position: 'relative', zIndex: 100,
            padding: '0.4rem 0.85rem', 
            fontSize: '0.8rem', 
            gap: '0.35rem',
            background: 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(255, 119, 0, 0.35)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <ArrowLeft size={14} color="#ffffff" /> Back to Class 6 Chapter 4
        </button>

        {/* Center Column: Title */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-heading)' }}>
            <Compass size={18} style={{ color: '#ff7700' }} />
            Activity 4.7: Through Materials
          </h2>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Class 6 Science: Chapter 4 — Magnetic Field Passage Exploration</span>
        </div>

        {/* Right Column: Active Navigation Tabs */}
        <nav className="tabs-container" style={{ display: 'flex', gap: '0.35rem', margin: 0 }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                style={{
                  padding: '0.45rem 0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #ff7700 0%, #ea580c 100%)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : tab.disabled ? '#cbd5e1' : '#1e3a8a',
                  borderRadius: '20px',
                  cursor: tab.disabled ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(255, 119, 0, 0.35)' : 'none'
                }}
              >
                <Icon size={15} color={isActive ? '#ffffff' : tab.disabled ? '#cbd5e1' : '#1e3a8a'} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Interactive Stage Container */}
      <main style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {activeTab === 'simulation' && (
            <motion.div
              key="simulation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Simulation onComplete={() => setSimCompleted(true)} onNext={() => setActiveTab('questions')} />
            </motion.div>
          )}

          {activeTab === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Questions onComplete={() => setQuestionsCompleted(true)} onNext={() => setActiveTab('challenge')} />
            </motion.div>
          )}

          {activeTab === 'challenge' && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <ChallengeMode onComplete={onComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Did You Know Bottom Navbar (Activity 4.2 Standard Footer) */}
      {activeTab !== 'questions' && (
        <footer style={{ marginTop: '0.4rem', width: '100%', flexShrink: 0, position: 'relative', zIndex: 99999 }}>
          <DidYouKnow />
        </footer>
      )}
    </div>
  );
}
