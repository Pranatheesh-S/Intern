import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';
import useSound from 'use-sound';

// Stages and Components
import IntroBriefing from './components/IntroBriefing';
import Stage1_Intro from './components/Stage1_Intro';
import Stage2_Identify from './components/Stage2_Identify';
import Stage3_Classification from './components/Stage3_Classification';
import Stage4_LustreHardness from './components/Stage4_LustreHardness';
import Stage5_Suitability from './components/Stage5_Suitability';
import Stage_SportsBall from './components/Stage_SportsBall';
import Stage6_Transparency from './components/Stage6_Transparency';
import Stage7_SolubilityMatter from './components/Stage7_SolubilityMatter';
import Stage8_AyurvedaSummary from './components/Stage8_AyurvedaSummary';
import Stage9_Quiz from './components/Stage9_Quiz';

export default function MaterialsAroundUsActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('intro');
  const [progress, setProgress] = useState({
    intro: false,
    stage1: false,
    stage2: false,
    stage3: false,
    stage5: false,
    sportsball: false,
    stage4: false,
    stage6: false,
    stage7_sol: false,
    stage7_mat: false,
    summary: false,
    quiz: false
  });
  const [xp, setXp] = useState(0);
  const [resetKeys, setResetKeys] = useState({
    intro: 0,
    stage1: 0,
    stage2: 0,
    stage3: 0,
    stage5: 0,
    sportsball: 0,
    stage4: 0,
    stage6: 0,
    stage7_sol: 0,
    stage7_mat: 0,
    summary: 0,
    quiz: 0
  });
  const [congratsMessage, setCongratsMessage] = useState(null);

  const navRef = useRef(null);

  useEffect(() => {
    if (navRef.current) {
      const activeEl = navRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeTab]);

  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });

  const addXp = (amount) => {
    setXp(prev => prev + amount);
    try {
      playSuccess();
    } catch (e) {
      console.log('Audio playback error', e);
    }
  };

  const handleStageComplete = (stageId, nextStageId) => {
    setProgress(prev => {
      const nextProgress = { ...prev, [stageId]: true };
      
      if (stageId === 'intro') {
        setCongratsMessage({
          title: "Mission Accepted! 🕵️‍♂️",
          text: "Let's head straight into the classroom and begin finding the evidence.",
          icon: "🔍",
          buttonText: "Begin Investigation"
        });
      } else if (stageId === 'stage2') {
        setCongratsMessage({
          title: "Barrier 1 Cleared! 🌟",
          text: "Outstanding work! You've successfully scanned all evidence and identified the base materials. Let's group them now.",
          icon: "🔓",
          buttonText: "Unlock Barrier 2"
        });
      } else if (stageId === 'sportsball') {
        setCongratsMessage({
          title: "Barrier 2 Cleared! 🏆",
          text: "You successfully designed the sports product and grouped materials! Next, let's test specific properties.",
          icon: "🔓",
          buttonText: "Unlock Barrier 3"
        });
      } else if (stageId === 'stage7_sol') {
        setCongratsMessage({
          title: "Barrier 3 Cleared! 🧪",
          text: "Brilliant analysis! You have categorized materials by lustre, hardness, transparency, and solubility. Now let's explore matter itself.",
          icon: "🔓",
          buttonText: "Unlock Barrier 4"
        });
      } else if (stageId === 'quiz') {
        setCongratsMessage({
          title: "Case Closed! 🏆",
          text: "Congratulations, Master Investigator! You have solved all experimental barriers, successfully analyzed the materials, and completed the chapter.",
          icon: "🎉",
          buttonText: "Finish Investigation"
        });
      }
      
      return nextProgress;
    });

    if (nextStageId) {
      setActiveTab(nextStageId);
    }
  };

  const handleResetCurrentStage = () => {
    setResetKeys(prev => ({
      ...prev,
      [activeTab]: prev[activeTab] + 1
    }));
  };

  const tabs = [
    {
      id: 'intro', num: 1, title: 'Introduction', subtitle: 'Mission Briefing',
      component: <IntroBriefing key={`intro-${resetKeys.intro}`} onComplete={() => handleStageComplete('intro', 'stage1')} addXp={addXp} />
    },
    {
      id: 'stage1', num: 2, title: 'Barrier 1: 6.1 Observing Objects Around Us', subtitle: 'Phase 1: Find Objects',
      component: <Stage1_Intro key={`stage1-${resetKeys.stage1}`} onComplete={() => handleStageComplete('stage1', 'stage2')} addXp={addXp} />,
      locked: !progress.intro
    },
    {
      id: 'stage2', num: 3, title: 'Barrier 1: 6.1 Observing Objects Around Us', subtitle: 'Phase 2: Scan Evidence',
      component: <Stage2_Identify key={`stage2-${resetKeys.stage2}`} onComplete={() => handleStageComplete('stage2', 'stage3')} addXp={addXp} />,
      locked: !progress.stage1
    },
    {
      id: 'stage3', num: 4, title: 'Barrier 2: 6.2 How to Group Materials?', subtitle: 'Phase 1: Classification',
      component: <Stage3_Classification key={`stage3-${resetKeys.stage3}`} onComplete={() => handleStageComplete('stage3', 'stage5')} addXp={addXp} />,
      locked: !progress.stage2
    },
    {
      id: 'stage5', num: 5, title: 'Barrier 2: 6.2 How to Group Materials?', subtitle: 'Phase 2: Suitability',
      component: <Stage5_Suitability key={`stage5-${resetKeys.stage5}`} onComplete={() => handleStageComplete('stage5', 'sportsball')} addXp={addXp} />,
      locked: !progress.stage3
    },
    {
      id: 'sportsball', num: 6, title: 'Barrier 2: 6.2 How to Group Materials?', subtitle: 'Phase 3: Product Design',
      component: <Stage_SportsBall key={`sportsball-${resetKeys.sportsball}`} onComplete={() => handleStageComplete('sportsball', 'stage4')} addXp={addXp} />,
      locked: !progress.stage5
    },
    {
      id: 'stage4', num: 7, title: 'Barrier 3: 6.3 Properties of Materials', subtitle: 'Stage 6.3.1 & 6.3.2: Appearance & Hardness',
      component: <Stage4_LustreHardness key={`stage4-${resetKeys.stage4}`} onComplete={() => handleStageComplete('stage4', 'stage6')} addXp={addXp} />,
      locked: !progress.sportsball
    },
    {
      id: 'stage6', num: 8, title: 'Barrier 3: 6.3 Properties of Materials', subtitle: 'Stage 6.3.3: Transparency',
      component: <Stage6_Transparency key={`stage6-${resetKeys.stage6}`} onComplete={() => handleStageComplete('stage6', 'stage7_sol')} addXp={addXp} />,
      locked: !progress.stage4
    },
    {
      id: 'stage7_sol', num: 9, title: 'Barrier 3: 6.3 Properties of Materials', subtitle: 'Stage 6.3.4: Solubility',
      component: <Stage7_SolubilityMatter mode="solubility" key={`stage7_sol-${resetKeys.stage7_sol}`} onComplete={() => handleStageComplete('stage7_sol', 'stage7_mat')} addXp={addXp} />,
      locked: !progress.stage6
    },
    {
      id: 'stage7_mat', num: 10, title: 'Barrier 4: 6.4 What is Matter?', subtitle: 'Mass and Space',
      component: <Stage7_SolubilityMatter mode="matter" key={`stage7_mat-${resetKeys.stage7_mat}`} onComplete={() => handleStageComplete('stage7_mat', 'summary')} addXp={addXp} />,
      locked: !progress.stage7_sol
    },
    {
      id: 'summary', num: 11, title: 'Summary', subtitle: 'Concept Map',
      component: <Stage8_AyurvedaSummary key={`summary-${resetKeys.summary}`} onComplete={() => handleStageComplete('summary', 'quiz')} addXp={addXp} />,
      locked: !progress.stage7_mat
    },
    {
      id: 'quiz', num: 12, title: 'Final Quiz', subtitle: 'Master Investigator',
      component: <Stage9_Quiz key={`quiz-${resetKeys.quiz}`} onComplete={() => handleStageComplete('quiz', null)} addXp={addXp} />,
      locked: !progress.summary
    }
  ];

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div style={{ maxWidth: '1800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={onBackToDashboard} 
            className="outline" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem', borderColor: 'var(--border)', borderRadius: '8px' }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-heading)' }}>Chapter 6: Materials Around Us</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Material Investigation Lab • Active Learning Simulation</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '1.2rem' }}>
              {progress.quiz ? '🏆' : progress.barrier3 ? '🎖️' : progress.barrier1 ? '🕵️‍♂️' : '🔍'}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rank</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>
                {progress.quiz ? 'Master Investigator' : progress.barrier3 ? 'Senior Analyst' : progress.barrier1 ? 'Active Investigator' : 'Novice Detective'}
              </span>
            </div>
          </div>
          <button 
            onClick={handleResetCurrentStage}
            className="outline"
            style={{
              padding: '0.45rem 0.8rem',
              fontSize: '0.8rem',
              gap: '0.35rem',
              borderColor: 'var(--danger-border)',
              color: 'var(--danger)',
              background: 'var(--danger-bg)',
              fontWeight: 'bold',
              borderRadius: '20px'
            }}
          >
            <RefreshCw size={12} /> Reset Lab
          </button>
          <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '0.4rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308', fontWeight: 'bold', fontSize: '0.85rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308', boxShadow: '0 0 8px #eab308' }} />
            {xp} XP
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Sidebar: Timeline Progress */}
        <div className="glass-panel" style={{ 
          background: 'var(--card-bg)', 
          border: '1px solid var(--border)', 
          borderRadius: '12px', 
          padding: '1.5rem 1rem', 
          position: 'sticky', 
          top: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-heading)', fontWeight: 'bold' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            Timeline Progress
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const isCompleted = progress[tab.id];
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (!tab.locked) {
                      try { playClick(); } catch (e) {}
                      setActiveTab(tab.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    color: isActive ? 'var(--text-heading)' : 'var(--text-primary)',
                    opacity: tab.locked ? 0.5 : 1,
                    borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                    cursor: tab.locked ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    borderRadius: '0 8px 8px 0'
                  }}
                >
                  <div style={{ marginTop: '0.1rem' }}>
                    {isCompleted ? (
                      <CheckCircle size={14} style={{ color: '#10b981' }} />
                    ) : (
                      <div style={{ width: '14px', height: '14px', background: isActive ? 'var(--accent)' : 'var(--text-muted)', borderRadius: '2px' }} />
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 'bold' : 'normal' }}>
                      {tab.title}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {tab.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content */}
        <div style={{ display: 'flex', gap: '1.5rem', width: '100%' }}>
          
          {/* Vertical Timeline Node */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              background: 'var(--accent-bg)', 
              border: '2px solid var(--accent)',
              color: 'var(--accent)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 'bold', 
              fontSize: '0.85rem',
              zIndex: 2 
            }}>
              {activeTabData?.num}
            </div>
            <div style={{ width: '2px', flex: 1, background: 'var(--border)', marginTop: '0.5rem', opacity: 0.5 }} />
          </div>

          {/* Active Component Area */}
          <div style={{ flex: 1, minWidth: 0, paddingBottom: '4rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', fontWeight: 'bold' }}>
                {activeTabData?.title}
              </span>
              <h2 style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', color: 'var(--text-heading)' }}>
                {activeTabData?.subtitle}
              </h2>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ width: '100%' }}
              >
                {activeTabData?.component}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Congrats Overlay Modal */}
      <AnimatePresence>
        {congratsMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1.5rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel"
              style={{
                maxWidth: '450px',
                width: '100%',
                background: 'var(--card-bg)',
                border: '2px solid var(--accent)',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem'
              }}
            >
              <div style={{ fontSize: '3rem' }}>{congratsMessage.icon || '🎉'}</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)' }}>
                  {congratsMessage.title}
                </h3>
                <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {congratsMessage.text}
                </p>
              </div>
              <button
                className="primary"
                onClick={() => {
                  setCongratsMessage(null);
                }}
                style={{ padding: '0.6rem 2rem', fontSize: '0.9rem', fontWeight: 'bold' }}
              >
                {congratsMessage.buttonText || 'Continue Mission'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
