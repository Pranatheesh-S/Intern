import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import LostInTheCity from './components/LostInTheCity';
import AtlasIntroduction from './components/AtlasIntroduction';
import DistanceAndScale from './components/DistanceAndScale';
import Directions from './components/Directions';

export default function LocatingPlacesActivity({ onBackToDashboard }) {
  const [currentStep, setCurrentStep] = useState(1);
  const navRef = useRef(null);

  const tabs = [
    { id: 1, title: 'Lost in a New Town', subtitle: 'Finding the Route', locked: false },
    { id: 2, title: 'Atlas Introduction', subtitle: 'A Collection of Maps', locked: currentStep < 2 },
    { id: 3, title: 'Distance & Scale', subtitle: 'Shrinking the World', locked: currentStep < 3 },
    { id: 4, title: 'Directions', subtitle: 'Using a Compass', locked: currentStep < 4 }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

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
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 6 • Geography • Locating Places on the Earth</span>
          </div>
        </div>
      </div>

      {/* Workflow Header / Tabs */}
      <nav ref={navRef} style={{ flexShrink: 0, display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem', scrollbarWidth: 'none' }}>
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
        flexDirection: 'column',
        gap: '3rem'
      }}>
        {currentStep === 1 && (
          <LostInTheCity onComplete={() => setCurrentStep(2)} />
        )}
        {currentStep === 2 && (
          <AtlasIntroduction onNextActivity={() => setCurrentStep(3)} />
        )}
        {currentStep === 3 && (
          <DistanceAndScale onComplete={() => setCurrentStep(4)} />
        )}
        {currentStep === 4 && (
          <Directions onComplete={() => alert("Next Step in Workflow: Symbols")} />
        )}
      </div>
    </div>
  );
}
