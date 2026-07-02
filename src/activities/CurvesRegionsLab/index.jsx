import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Stage1_CurveDrawer from './components/Stage1_CurveDrawer';
import Stage2_RegionRescue from './components/Stage2_RegionRescue';
import Stage3_Quiz from './components/Stage3_Quiz';
import useSound from 'use-sound';

export default function CurvesRegionsLabActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('curve_drawer');
  const [progress, setProgress] = useState({
    curve_drawer: false,
    region_rescue: false,
    concept_quiz: false
  });
  const [xp, setXp] = useState(0);

  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });

  const addXp = (amount) => {
    setXp(prev => prev + amount);
    try {
      playSuccess();
    } catch (e) {
      console.warn("Audio block failed", e);
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
      id: 'curve_drawer', 
      num: 1, 
      title: 'Curves', 
      subtitle: 'Curve Drawer', 
      component: <Stage1_CurveDrawer onComplete={() => handleStageComplete('curve_drawer', 'region_rescue')} addXp={addXp} /> 
    },
    { 
      id: 'region_rescue', 
      num: 2, 
      title: 'Regions', 
      subtitle: 'Region Rescue', 
      component: <Stage2_RegionRescue onComplete={() => handleStageComplete('region_rescue', 'concept_quiz')} addXp={addXp} />,
      locked: !progress.curve_drawer 
    },
    { 
      id: 'concept_quiz', 
      num: 3, 
      title: 'Concept Check', 
      subtitle: 'Geometry Quiz', 
      component: <Stage3_Quiz onComplete={() => handleStageComplete('concept_quiz', null)} addXp={addXp} onBackToDashboard={onBackToDashboard} />,
      locked: !progress.region_rescue 
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      {/* Top Header Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)', 
        paddingBottom: '1rem', 
        flexWrap: 'wrap', 
        gap: '1rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={onBackToDashboard} 
            className="outline" 
            style={{ 
              padding: '0.4rem 0.8rem', 
              fontSize: '0.8rem', 
              gap: '0.35rem', 
              borderColor: 'var(--border)', 
              borderRadius: '8px' 
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>FuturaX Math Lab</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 6 • Mathematics • Chapter 4: Basic Geometrical Ideas</span>
          </div>
        </div>
        
        <div style={{ 
          background: 'rgba(139, 92, 246, 0.1)', 
          border: '1px solid rgba(139, 92, 246, 0.3)', 
          padding: '0.4rem 0.8rem', 
          borderRadius: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          color: '#a78bfa', 
          fontWeight: 'bold', 
          fontSize: '0.85rem' 
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', boxShadow: '0 0 8px #8b5cf6' }} />
          {xp} XP
        </div>
      </div>

      {/* Tabs */}
      <nav style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        overflowX: 'auto', 
        paddingBottom: '1rem', 
        marginBottom: '1.5rem', 
        scrollbarWidth: 'none' 
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isCompleted = progress[tab.id];
          return (
            <button
              key={tab.id}
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
                padding: '0.5rem 1rem',
                background: isActive ? 'var(--surface)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '12px',
                minWidth: 'max-content',
                opacity: tab.locked ? 0.4 : 1,
                cursor: tab.locked ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 15px rgba(139, 92, 246, 0.15)' : 'none'
              }}
            >
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '6px', 
                background: isActive ? 'var(--accent)' : 'var(--border)', 
                color: isActive ? '#fff' : 'var(--text-muted)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '0.75rem', 
                fontWeight: 'bold' 
              }}>
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
