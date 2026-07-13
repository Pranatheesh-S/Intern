import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FolderSync, Wrench, CheckCircle, ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';
import Stage1_Identify from './components/Stage1_Identify';
import Stage2_Classify from './components/Stage2_Classify';
import Stage3_Design from './components/Stage3_Design';
import Stage4_Quiz from './components/Stage4_Quiz';

export default function MaterialDetectiveActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('identify');
  const [progress, setProgress] = useState({
    identify: false,
    classify: false,
    design: false,
    quiz: false
  });

  const handleStageComplete = (stageId) => {
    setProgress(prev => {
      const nextProgress = { ...prev, [stageId]: true };
      
      // Auto-advance tabs
      if (stageId === 'identify') {
        setActiveTab('classify');
      } else if (stageId === 'classify') {
        setActiveTab('design');
      } else if (stageId === 'design') {
        setActiveTab('quiz');
      } else if (stageId === 'quiz') {
        onBackToDashboard();
      }
      
      return nextProgress;
    });
  };

  const tabs = [
    { 
      id: 'identify', 
      name: '1. Scan & Identify', 
      icon: Search, 
      component: <Stage1_Identify onComplete={() => handleStageComplete('identify')} /> 
    },
    { 
      id: 'classify', 
      name: '2. Group & Sort', 
      icon: FolderSync, 
      component: <Stage2_Classify onComplete={() => handleStageComplete('classify')} />,
      locked: !progress.identify 
    },
    { 
      id: 'design', 
      name: '3. Material Studio', 
      icon: Wrench, 
      component: <Stage3_Design onComplete={() => handleStageComplete('design')} />,
      locked: !progress.classify 
    },
    { 
      id: 'quiz', 
      name: '4. Final Quiz', 
      icon: GraduationCap, 
      component: <Stage4_Quiz onComplete={() => handleStageComplete('quiz')} />,
      locked: !progress.design 
    }
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Subheader Navigation with Back Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={onBackToDashboard} 
            className="outline" 
            style={{ 
              padding: '0.4rem 0.8rem', 
              fontSize: '0.8rem', 
              gap: '0.35rem',
              borderColor: 'var(--border)'
            }}
          >
            <ArrowLeft size={14} /> Back to Chapters
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} style={{ color: 'var(--accent)' }} />
              Material Detective Case
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 6 Science: Chapter 6 — Materials Around Us</span>
          </div>
        </div>

        {/* Tabbed Navigation Bar */}
        <nav className="tabs-container">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isCompleted = progress[tab.id];
            
            return (
              <button
                key={tab.id}
                onClick={() => !tab.locked && setActiveTab(tab.id)}
                disabled={tab.locked}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                style={{
                  opacity: tab.locked ? 0.4 : 1,
                  cursor: tab.locked ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.85rem'
                }}
              >
                <Icon size={14} />
                <span>{tab.name}</span>
                {isCompleted && (
                  <CheckCircle size={12} style={{ color: 'var(--success)', marginLeft: '0.15rem' }} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Stage Panel */}
      <div style={{ minHeight: '520px', marginBottom: '2rem' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tabs.find(t => t.id === activeTab)?.component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
