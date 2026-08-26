import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Compass, TestTube2, Trophy } from 'lucide-react';
import Simulation from './Simulation';
import Questions from './Questions';
import ChallengeMode from './ChallengeMode';
import DidYouKnow from './DidYouKnow';

export default function Activity4_6({ onBackToDashboard, onComplete }) {
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
      padding: '0.65rem 0.85rem',
      backgroundColor: '#ECFDF5',
      position: 'relative',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Soft Decorative Ambient Background Glows */}
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(167, 243, 208, 0.45) 0%, rgba(236, 253, 245, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(253, 230, 138, 0.35) 0%, rgba(236, 253, 245, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Top Header Bar matching Activity 4.3 styling */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'auto 1fr auto', 
        alignItems: 'center', 
        padding: '0.5rem 1rem',
        marginBottom: '0.5rem',
        background: '#FFFFFF',
        border: '1.5px solid #A7F3D0',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(6, 78, 59, 0.06)',
        flexShrink: 0,
        position: 'relative',
        zIndex: 100
      }}>
        {/* Left Column: Back Button */}
        <button 
          onClick={onBackToDashboard}
          style={{ 
            position: 'relative', zIndex: 100,
            padding: '0.5rem 1rem', 
            fontSize: '0.85rem', 
            gap: '0.45rem',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={16} color="#FFFFFF" /> Back to Chapter 4
        </button>

        {/* Center Column: Title */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem', color: '#064E3B', letterSpacing: '-0.01em' }}>
            <Compass size={24} style={{ color: '#D97706' }} />
            Activity 4.6: Compass & Bar Magnet
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>Class 6 Science — Make Your Own Magnet & Explore Induction</span>
        </div>

        {/* Right Column: Active Navigation Tabs */}
        <nav className="tabs-container" style={{ display: 'flex', gap: '0.4rem', margin: 0 }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                style={{
                  opacity: tab.disabled ? 0.45 : 1,
                  cursor: tab.disabled ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  borderRadius: '25px',
                  background: isActive ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#F8FAFC',
                  color: isActive ? '#FFFFFF' : tab.disabled ? '#94A3B8' : '#334155',
                  border: isActive ? 'none' : '1.5px solid #CBD5E1',
                  boxShadow: isActive ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={isActive ? '#FFFFFF' : tab.disabled ? '#94A3B8' : '#334155'} />
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
