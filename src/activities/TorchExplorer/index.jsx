import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Zap, Battery, CheckCircle, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import Stage1_Assemble from './components/Stage1_Assemble';
import Stage2_CellExplore from './components/Stage2_CellExplore';
import Stage3_BatteryTest from './components/Stage3_BatteryTest';
import Stage4_Quiz from './components/Stage4_Quiz';

export default function TorchExplorerActivity({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('assemble');
  const [progress, setProgress] = useState({
    assemble: false,
    cellExplore: false,
    batteryTest: false,
    quiz: false
  });

  const [torchState, setTorchState] = useState({
    bulbPlaced: false,
    switchPlaced: false,
    cellsPlaced: false,
    cellOrientation: 'correct' // 'correct', 'reversed', 'same'
  });

  const handleStageComplete = (stageId, data = null) => {
    setProgress(prev => ({ ...prev, [stageId]: true }));
    
    if (stageId === 'assemble') {
      setActiveTab('cellExplore');
    } else if (stageId === 'cellExplore') {
      setActiveTab('batteryTest');
    } else if (stageId === 'batteryTest') {
      setActiveTab('quiz');
    }
  };

  const tabs = [
    { id: 'assemble', name: '1. Build', icon: Settings2, component: <Stage1_Assemble onComplete={() => handleStageComplete('assemble')} /> },
    { id: 'cellExplore', name: '2. Explore Cell', icon: Zap, component: <Stage2_CellExplore onComplete={() => handleStageComplete('cellExplore')} />, locked: !progress.assemble },
    { id: 'batteryTest', name: '3. Battery Test', icon: Battery, component: <Stage3_BatteryTest onComplete={() => handleStageComplete('batteryTest')} />, locked: !progress.cellExplore },
    { id: 'quiz', name: '4. Quiz', icon: HelpCircle, component: <Stage4_Quiz onComplete={() => handleStageComplete('quiz')} />, locked: !progress.batteryTest }
  ];

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
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
            <ArrowLeft size={14} /> Back to Class 6 Chapter 3
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Torch Explorer Lab</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Electricity and Circuits (Activities 3.1 - 3.3)</span>
          </div>
        </div>

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

      <main style={{ minHeight: '480px', marginBottom: '2rem' }}>
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

      <footer className="glass-panel" style={{ marginTop: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <Info style={{ color: 'var(--accent)', flexShrink: 0 }} size={20} />
          <div>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-heading)' }}>
              Educational Tip
            </h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-faint)', lineHeight: '1.5' }}>
              A torch bulb glows when an electric current passes through its filament. Connecting multiple cells forms a <strong>battery</strong>. In a standard torch, cells are connected in a <strong>series connection</strong> (the positive (+) terminal of one cell touches the negative (−) terminal of the next). This series connection adds up their voltages to make the bulb glow brightly! 
              <br/><br/>
              <em>Why not parallel?</em> In a parallel connection (where all positives connect together), the voltage stays the same as a single cell, which wouldn't be enough to make a standard torch bulb shine bright.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
