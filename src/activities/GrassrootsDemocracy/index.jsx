import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Stage1_Explore from './components/Stage1_Explore';
import Stage2_Discover from './components/Stage2_Discover';
import Stage3_Experience from './components/Stage3_Experience';
import Stage4_DiscoverHeroes from './components/Stage4_DiscoverHeroes';
import Stage5_Decide from './components/Stage5_Decide';
import Stage6_Connect from './components/Stage6_Connect';
import Stage7_Reflect from './components/Stage7_Reflect';
import useSound from 'use-sound';

export default function GrassrootsDemocracyActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('explore');
  const [progress, setProgress] = useState({
    explore: false,
    discover1: false,
    experience: false,
    discover2: false,
    decide: false,
    connect: false,
    reflect: false
  });
  const [xp, setXp] = useState(0);

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
    { id: 'explore', num: 1, title: 'Introduction', subtitle: 'Lakshmanpur Village', component: <Stage1_Explore onComplete={() => handleStageComplete('explore', 'discover1')} addXp={addXp} /> },
    { id: 'discover1', num: 2, title: 'Structure', subtitle: 'Panchayati Raj System', component: <Stage2_Discover onComplete={() => handleStageComplete('discover1', 'experience')} addXp={addXp} />, locked: !progress.explore },
    { id: 'experience', num: 3, title: 'Gram Panchayat', subtitle: 'Gram Sabha & Roles', component: <Stage3_Experience onComplete={() => handleStageComplete('experience', 'discover2')} addXp={addXp} />, locked: !progress.discover1 },
    { id: 'discover2', num: 4, title: 'Changemakers', subtitle: 'Bal Panchayat', component: <Stage4_DiscoverHeroes onComplete={() => handleStageComplete('discover2', 'decide')} addXp={addXp} />, locked: !progress.experience },
    { id: 'decide', num: 5, title: 'Block & District', subtitle: 'Information Flow', component: <Stage5_Decide onComplete={() => handleStageComplete('decide', 'connect')} addXp={addXp} />, locked: !progress.discover2 },
    { id: 'connect', num: 6, title: 'Ancient Roots', subtitle: 'Arthaśāstra', component: <Stage6_Connect onComplete={() => handleStageComplete('connect', 'reflect')} addXp={addXp} />, locked: !progress.decide },
    { id: 'reflect', num: 7, title: 'Summary', subtitle: 'Concept Map & Quiz', component: <Stage7_Reflect onComplete={() => handleStageComplete('reflect', null)} addXp={addXp} />, locked: !progress.connect }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBackToDashboard} className="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem', borderColor: 'var(--border)', borderRadius: '8px' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>FuturaX Social Lab</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 6 • Civics • Chapter 11</span>
          </div>
        </div>
        
        <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '0.4rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308', fontWeight: 'bold', fontSize: '0.85rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308', boxShadow: '0 0 8px #eab308' }} />
          {xp} XP
        </div>
      </div>

      {/* Tabs */}
      <nav style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isCompleted = progress[tab.id];
          return (
            <button
              key={tab.id}
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

      {/* Main Content Area */}
      <main style={{ minHeight: '600px' }}>
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
