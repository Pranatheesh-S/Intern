import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import IntroductionPage from './components/IntroductionPage';
import HimalayanExpedition from './components/HimalayanExpedition';
import WhyHimalayasMatter from './components/WhyHimalayasMatter';
import BackgroundEffects from './components/BackgroundEffects';

export default function GeographyExpeditionActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('intro');
  const [progress, setProgress] = useState({
    intro: false,
    himalayas: false,
    whyHimalayas: false
  });
  const [xp, setXp] = useState(0);
  const navRef = useRef(null);

  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });

  const addXp = (amount) => {
    setXp(prev => prev + amount);
    playSuccess();
  };

  const handleStageComplete = (stageId, nextStageId) => {
    setProgress(prev => ({ ...prev, [stageId]: true }));
    if (nextStageId) {
      setActiveTab(nextStageId);
    }
  };

  const tabs = [
    { id: 'intro', num: 1, title: 'Introduction', subtitle: 'Geography of India', component: <IntroductionPage onBeginExpedition={() => handleStageComplete('intro', 'himalayas')} addXp={addXp} /> },
    { id: 'himalayas', num: 2, title: 'Himalayas', subtitle: 'Himalayan Expedition', component: <HimalayanExpedition onComplete={() => handleStageComplete('himalayas', 'why-matter')} addXp={addXp} />, locked: !progress.intro },
    { id: 'why-matter', num: 3, title: 'Significance', subtitle: 'Why the Himalayas Matter', component: <WhyHimalayasMatter onComplete={() => handleStageComplete('whyHimalayas', null)} addXp={addXp} />, locked: !progress.himalayas }
  ];

  useEffect(() => {
    if (navRef.current) {
      const activeEl = navRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeTab]);

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '1rem 2rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBackToDashboard} className="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem', borderColor: 'var(--border)', borderRadius: '8px' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>FuturaX Social Lab</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 7 • Geography • Chapter 1</span>
          </div>
        </div>
        
        <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '0.4rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308', fontWeight: 'bold', fontSize: '0.85rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308', boxShadow: '0 0 8px #eab308' }} />
          {xp} XP
        </div>
      </div>

      {/* Tabs */}
      <nav ref={navRef} style={{ flexShrink: 0, display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isCompleted = progress[tab.id];
          return (
            <button
              key={tab.id}
              data-active={isActive}
              onClick={() => {
                if (!tab.locked) {
                  playClick();
                  setActiveTab(tab.id);
                }
              }}
              disabled={tab.locked}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 1rem',
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
                {isCompleted ? <CheckCircle size={12} /> : tab.num}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: isActive ? 'var(--text-heading)' : 'var(--text-primary)' }}>{tab.title}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{tab.subtitle}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Main Content Area - General Window Size */}
      <div style={{ 
        width: '100%',
        aspectRatio: '16/9',
        minHeight: '700px',
        maxHeight: 'calc(100vh - 150px)',
        margin: '0 auto',
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'var(--page-bg)',
        background: 'var(--page-bg-gradient)',
        borderRadius: '24px',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--card-shadow)',
        overflow: 'hidden'
      }}>
        <BackgroundEffects />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
          >
            {tabs.find(t => t.id === activeTab)?.component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
