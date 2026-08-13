import React, { useState } from 'react';
import { ArrowLeft, Award, Beaker } from 'lucide-react';

import Stage1_WhyMicroscope from './Stage1_WhyMicroscope';
import Stage2_SlidePreparation from './Stage2_SlidePreparation';
import Stage3_MicroscopeObservation from './Stage3_MicroscopeObservation';
import Stage4_CellExploration from './Stage4_CellExploration';
import Stage5_BrickWall from './Stage5_BrickWall';
import Stage6_Conclusion from './Stage6_Conclusion';

export default function MicroscopeDiscovery({ onBackToDashboard, addXp }) {
  const [currentStage, setCurrentStage] = useState(1);
  const [localXp, setLocalXp] = useState(0);

  const handleAddXp = (amount) => {
    setLocalXp(prev => prev + amount);
    if (addXp) addXp(amount);
  };

  const handleNextStage = () => {
    setCurrentStage(prev => prev + 1);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={onBackToDashboard}
          className="outline"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <Award size={18} color="var(--accent)" />
            <strong style={{ color: 'var(--accent)' }}>{localXp} XP</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <Beaker size={18} color="var(--primary)" />
            <strong style={{ color: 'var(--primary)' }}>Stage {currentStage} / 6</strong>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
        {currentStage === 1 && <Stage1_WhyMicroscope onComplete={handleNextStage} addXp={handleAddXp} />}
        {currentStage === 2 && <Stage2_SlidePreparation onComplete={handleNextStage} addXp={handleAddXp} />}
        {currentStage === 3 && <Stage3_MicroscopeObservation onComplete={handleNextStage} addXp={handleAddXp} />}
        {currentStage === 4 && <Stage4_CellExploration onComplete={handleNextStage} addXp={handleAddXp} />}
        {currentStage === 5 && <Stage5_BrickWall onComplete={handleNextStage} addXp={handleAddXp} />}
        {currentStage === 6 && <Stage6_Conclusion onComplete={onBackToDashboard} addXp={handleAddXp} />}
      </div>
    </div>
  );
}
