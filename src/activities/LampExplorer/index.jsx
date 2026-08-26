import React, { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react';
import Stage1_Explore from './components/Stage1_Explore';
import Stage2_Observe from './components/Stage2_Observe';
import Stage3_Compare from './components/Stage3_Compare';
import Stage4_Quiz from './components/Stage4_Quiz';

const stages = [
  { id: 1, title: '1. Explore Lamp', icon: BookOpen },
  { id: 2, title: '2. Observe Glow', icon: BookOpen },
  { id: 3, title: '3. Compare LED', icon: BookOpen },
  { id: 4, title: '4. Quiz', icon: CheckCircle2 }
];

export default function LampExplorerActivity({ onBackToDashboard }) {
  const [currentStage, setCurrentStage] = useState(1);
  const [completedStages, setCompletedStages] = useState([false, false, false, false]);
  const [quizResults, setQuizResults] = useState(null);

  const handleStageComplete = (stageIndex, results = null) => {
    setCompletedStages(prev => {
      const next = [...prev];
      next[stageIndex] = true;
      return next;
    });
    
    if (results) {
      setQuizResults(results);
    }
    
    if (stageIndex + 1 < stages.length) {
      setCurrentStage(stageIndex + 2);
    }
  };

  const progress = (completedStages.filter(Boolean).length / stages.length) * 100;

  return (
    <div className="activity-container glass-panel" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Activity Header */}
      <div className="activity-header" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
        <div>
          <button 
            onClick={onBackToDashboard}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem', marginBottom: '1rem' }}
          >
            <ArrowLeft size={14} /> Back to Class 7 Chapter 3
          </button>
          <h2 style={{ margin: 0, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Lamp Explorer Lab
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Electricity and Circuits (Activities 3.4 - 3.5)
          </span>
        </div>
        
        {/* Progress Tracker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div style={{ width: '150px', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)', transition: 'width 0.3s' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isCompleted = completedStages[idx];
              const isActive = currentStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setCurrentStage(stage.id)}
                  disabled={idx > 0 && !completedStages[idx - 1] && !isCompleted && !isActive}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    border: 'none',
                    background: isActive ? 'var(--accent)' : isCompleted ? 'var(--success-bg)' : 'transparent',
                    color: isActive ? 'white' : isCompleted ? 'var(--success)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    cursor: (idx > 0 && !completedStages[idx - 1] && !isCompleted && !isActive) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={14} />
                  {stage.title} {isCompleted && <CheckCircle2 size={14} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '2rem', background: 'var(--bg-color)' }}>
        {currentStage === 1 && <Stage1_Explore onComplete={() => handleStageComplete(0)} />}
        {currentStage === 2 && <Stage2_Observe onComplete={() => handleStageComplete(1)} />}
        {currentStage === 3 && <Stage3_Compare onComplete={() => handleStageComplete(2)} />}
        {currentStage === 4 && <Stage4_Quiz onComplete={(results) => handleStageComplete(3, results)} />}
      </div>

    </div>
  );
}
