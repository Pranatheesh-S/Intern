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
      backgroundColor: '#09090B',
      position: 'relative'
    }}>
      {/* High Quality Recognizeable Physics Lab Background with Controlled Blur */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('/MagneticPoles/vintage_lab_bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px) brightness(1.18) contrast(0.96)',
          transform: 'scale(1.02)',
          zIndex: 0
        }}
      />

      {/* Dark Vector Overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(9, 9, 11, 0.45)',
          zIndex: 0
        }}
      />

      {/* Magnetic Field Vector Lines SVG */}
      <svg 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }} 
        viewBox="0 0 1440 900" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M-100 450 C 200 100, 500 100, 720 450 C 940 800, 1240 800, 1540 450" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="3" fill="none" />
        <path d="M-100 450 C 200 180, 500 180, 720 450 C 940 720, 1240 720, 1540 450" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="3" fill="none" />
      </svg>

      {/* Top Header Bar with Midnight Carbon Contrast Theme */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        padding: '0.45rem 0.85rem',
        marginBottom: '0.4rem',
        background: 'rgba(9, 9, 11, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #3F3F46',
        borderRadius: '16px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(245, 158, 11, 0.15)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100
      }}>
        {/* Left Column: Back Button */}
        <button 
          onClick={onBackToDashboard}
          style={{ 
            position: 'relative', zIndex: 100,
            padding: '0.45rem 0.95rem', 
            fontSize: '0.82rem', 
            gap: '0.4rem',
            background: '#18181B',
            color: '#FFFFFF',
            border: '1px solid #3F3F46',
            borderRadius: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={16} color="#FFFFFF" /> Back to Class 6 Chapter 4
        </button>

        {/* Center Column: Title */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
            <Compass size={22} style={{ color: '#F59E0B', filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))' }} />
            Activity 4.7: Through Materials
          </h2>
          <span style={{ fontSize: '0.78rem', color: '#71717A', fontWeight: 600 }}>Class 6 Science: Chapter 4 — Magnetic Field Passage Exploration</span>
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
                  background: isActive ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#18181B',
                  color: isActive ? '#000000' : tab.disabled ? '#52525B' : '#71717A',
                  borderRadius: '20px',
                  cursor: tab.disabled ? 'not-allowed' : 'pointer',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  transition: 'all 0.2s ease',
                  border: isActive ? 'none' : '1px solid #3F3F46',
                  boxShadow: isActive ? '0 4px 14px rgba(245, 158, 11, 0.4)' : 'none'
                }}
              >
                <Icon size={15} color={isActive ? '#000000' : tab.disabled ? '#52525B' : '#71717A'} />
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
