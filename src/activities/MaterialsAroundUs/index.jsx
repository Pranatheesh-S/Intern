import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import useSound from 'use-sound';

// Stages
import Stage1_Intro from './components/Stage1_Intro';
import Stage2_Identify from './components/Stage2_Identify';
import Stage3_Classification from './components/Stage3_Classification';
import Stage4_LustreHardness from './components/Stage4_LustreHardness';
import Stage5_Suitability from './components/Stage5_Suitability';
import Stage6_Transparency from './components/Stage6_Transparency';
import Stage7_SolubilityMatter from './components/Stage7_SolubilityMatter';
import Stage8_AyurvedaSummary from './components/Stage8_AyurvedaSummary';
import Stage9_Quiz from './components/Stage9_Quiz';

export default function MaterialsAroundUsActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('intro');
  const [progress, setProgress] = useState({
    intro: false,
    identify: false,
    classify: false,
    lustreHardness: false,
    suitability: false,
    transparency: false,
    solubilityMatter: false,
    ayurvedaSummary: false,
    quiz: false
  });
  const [xp, setXp] = useState(0);
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
    setProgress(prev => ({ ...prev, [stageId]: true }));
    if (nextStageId) {
      setActiveTab(nextStageId);
    }
  };

  const tabs = [
    {
      id: 'intro',
      num: 1,
      title: 'Introduction',
      subtitle: 'Classroom Chat',
      component: <Stage1_Intro onComplete={() => handleStageComplete('intro', 'identify')} addXp={addXp} />
    },
    {
      id: 'identify',
      num: 2,
      title: 'Identify',
      subtitle: 'Table 6.1 Scanner',
      component: <Stage2_Identify onComplete={() => handleStageComplete('identify', 'classify')} addXp={addXp} />,
      locked: !progress.intro
    },
    {
      id: 'classify',
      num: 3,
      title: 'Classification',
      subtitle: 'Grouping & Ordering',
      component: <Stage3_Classification onComplete={() => handleStageComplete('classify', 'lustreHardness')} addXp={addXp} />,
      locked: !progress.identify
    },
    {
      id: 'lustreHardness',
      num: 4,
      title: 'Lustre & Hardness',
      subtitle: 'Scratch & Sandpaper',
      component: <Stage4_LustreHardness onComplete={() => handleStageComplete('lustreHardness', 'suitability')} addXp={addXp} />,
      locked: !progress.classify
    },
    {
      id: 'suitability',
      num: 5,
      title: 'Suitability',
      subtitle: 'Tumbler Designer',
      component: <Stage5_Suitability onComplete={() => handleStageComplete('suitability', 'transparency')} addXp={addXp} />,
      locked: !progress.lustreHardness
    },
    {
      id: 'transparency',
      num: 6,
      title: 'Transparency',
      subtitle: 'Hide and Seek',
      component: <Stage6_Transparency onComplete={() => handleStageComplete('transparency', 'solubilityMatter')} addXp={addXp} />,
      locked: !progress.suitability
    },
    {
      id: 'solubilityMatter',
      num: 7,
      title: 'Solubility & Mass',
      subtitle: 'Define Matter',
      component: <Stage7_SolubilityMatter onComplete={() => handleStageComplete('solubilityMatter', 'ayurvedaSummary')} addXp={addXp} />,
      locked: !progress.transparency
    },
    {
      id: 'ayurvedaSummary',
      num: 8,
      title: 'Summary',
      subtitle: 'Ayurveda & Map',
      component: <Stage8_AyurvedaSummary onComplete={() => handleStageComplete('ayurvedaSummary', 'quiz')} addXp={addXp} />,
      locked: !progress.solubilityMatter
    },
    {
      id: 'quiz',
      num: 9,
      title: 'Quiz',
      subtitle: 'Master Investigator',
      component: <Stage9_Quiz onComplete={() => handleStageComplete('quiz', null)} addXp={addXp} />,
      locked: !progress.ayurvedaSummary
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={onBackToDashboard} 
            className="outline" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem', borderColor: 'var(--border)', borderRadius: '8px' }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Material Investigation Lab</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 6 • Science • Chapter 6 (Materials Around Us)</span>
          </div>
        </div>
        
        <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '0.4rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308', fontWeight: 'bold', fontSize: '0.85rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308', boxShadow: '0 0 8px #eab308' }} />
          {xp} XP
        </div>
      </div>

      {/* Tabs list */}
      <nav ref={navRef} style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isCompleted = progress[tab.id];
          return (
            <button
              key={tab.id}
              data-active={isActive}
              onClick={() => {
                if (!tab.locked) {
                  try {
                    playClick();
                  } catch (e) {}
                  setActiveTab(tab.id);
                }
              }}
              disabled={tab.locked}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 1.25rem',
                background: isActive ? 'var(--surface)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '12px',
                minWidth: 'max-content',
                opacity: tab.locked ? 0.4 : 1,
                cursor: tab.locked ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 15px rgba(99, 102, 241, 0.15)' : 'none'
              }}
            >
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: isActive ? 'var(--accent)' : 'var(--border)', color: isActive ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {isCompleted ? <CheckCircle size={12} style={{ color: '#10b981' }} /> : tab.num}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: isActive ? 'var(--text-heading)' : 'var(--text-primary)' }}>{tab.title}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{tab.subtitle}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <main style={{ minHeight: '600px', width: '100%' }}>
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
      </main>
    </div>
  );
}
