import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import LostInTheCity from './components/LostInTheCity';
import AtlasIntroduction from './components/AtlasIntroduction';
import DistanceAndScale from './components/DistanceAndScale';
import Directions from './components/Directions';
import ChapterIntroduction from './components/ChapterIntroduction';
import BlueprintIntro from './components/BlueprintIntro';

export default function LocatingPlacesActivity({ onBackToDashboard }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showIntro, setShowIntro] = useState(true);
  const navRef = useRef(null);

  const tabs = [
    { id: 1, title: 'Chapter Introduction', subtitle: 'Locating Places on the Earth', locked: false },
    { id: 2, title: 'Finding Places with a Map', subtitle: 'Finding the Route', locked: currentStep < 2 },
    { id: 3, title: 'Atlas Introduction', subtitle: 'A Collection of Maps', locked: currentStep < 3 },
    { id: 4, title: 'Distance & Scale', subtitle: 'Shrinking the World', locked: currentStep < 4 },
    { id: 5, title: 'Directions', subtitle: 'Using a Compass', locked: currentStep < 5 }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  if (showIntro) {
    return <BlueprintIntro onExplore={() => setShowIntro(false)} />;
  }

  return (
    <div style={{ 
      width: '100vw', 
      marginLeft: 'calc(50% - 50vw)', 
      height: '100vh', 
      padding: 'clamp(10px, 1.5vh, 20px) clamp(20px, 3.2vw, 52px)', 
      boxSizing: 'border-box', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* Workflow Header / Tabs */}
      <nav ref={navRef} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.5rem', scrollbarWidth: 'none' }}>
        <button onClick={onBackToDashboard} className="outline" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '12px', background: 'transparent', cursor: 'pointer', marginRight: '0.5rem', flexShrink: 0 }}>
          <ArrowLeft size={16} /> Dashboard
        </button>
        {tabs.map((tab) => {
          const isActive = currentStep === tab.id;
          const isCompleted = currentStep > tab.id;
          return (
            <button
              key={tab.id}
              data-active={isActive}
              onClick={() => {
                if (!tab.locked) setCurrentStep(tab.id);
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
                {isCompleted ? <CheckCircle size={12} /> : tab.id}
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
      <div style={{ 
        width: '100%',
        margin: '0 auto',
        display: 'flex', 
        flex: 1,
        flexDirection: 'column',
        minHeight: 0
      }}>
        {currentStep === 1 && (
          <ChapterIntroduction onNextActivity={() => setCurrentStep(2)} />
        )}
        {currentStep === 2 && (
          <LostInTheCity onComplete={() => setCurrentStep(3)} />
        )}
        {currentStep === 3 && (
          <AtlasIntroduction onNextActivity={() => setCurrentStep(4)} />
        )}
        {currentStep === 4 && (
          <DistanceAndScale onComplete={() => setCurrentStep(5)} />
        )}
        {currentStep === 5 && (
          <Directions onComplete={() => alert("Next Step in Workflow: Next Lesson")} />
        )}
      </div>
    </div>
  );
}
