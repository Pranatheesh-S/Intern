import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import LostInTheCity from './components/LostInTheCity';
import AtlasIntroduction from './components/AtlasIntroduction';
import DistanceAndScale from './components/DistanceAndScale';
import Directions from './components/Directions';
import ChapterIntroduction from './components/ChapterIntroduction';
import BlueprintIntro from './components/BlueprintIntro';
import MapSymbols from './components/MapSymbols';
import CoordinatesPage from './components/CoordinatesPage';
import TimeZonesPage from './components/TimeZonesPage';
import ExploreIndiaActivity from './components/LostInTheCity/ExploreIndiaActivity';
import MiscellaneousPage from './components/MiscellaneousPage';

export default function LocatingPlacesActivity({ onBackToDashboard }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState('cover');
  const [coverKey, setCoverKey] = useState(0);
  const navRef = useRef(null);

  const handleBackToMainPage = () => {
    setViewMode('cover');
    setCurrentStep(1);
    setCoverKey(k => k + 1);
    window.scrollTo(0, 0);
  };

  const handleOpenBook = () => {
    setViewMode('activity');
    window.scrollTo(0, 0);
  };

  const tabs = [
    { id: 1, title: 'Chapter Introduction', subtitle: 'Locating Places on the Earth', locked: false },
    { id: 2, title: 'Finding Places with a Map', subtitle: 'Finding the Route', locked: currentStep < 2 },
    { id: 3, title: 'Atlas Introduction', subtitle: 'A Collection of Maps', locked: currentStep < 3 },
    { id: 4, title: 'Distance & Scale', subtitle: 'Shrinking the World', locked: currentStep < 4 },
    { id: 5, title: 'Directions', subtitle: 'Using a Compass', locked: currentStep < 5 },
    { id: 6, title: 'Symbols', subtitle: 'Understanding Map Symbols', locked: currentStep < 6 },
    { id: 7, title: 'Coordinates', subtitle: 'Latitude, Longitude & the Grid', locked: currentStep < 7 },
    { id: 8, title: 'Time Zones', subtitle: 'Locating Places on the Earth', locked: currentStep < 8 }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  useEffect(() => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentStep, viewMode]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 101,
      boxSizing: 'border-box',
      ...(viewMode === 'activity' ? {
        padding: 'clamp(16px, 2.5vh, 24px) clamp(16px, 2.5vw, 24px)',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--background, #f8fafc)'
      } : {})
    }}>
      {viewMode === 'cover' && (
        <BlueprintIntro
          key={`locating-places-cover-${coverKey}`}
          onExplore={handleOpenBook}
        />
      )}

      {viewMode === 'activity' && (
        <>
          {/* Workflow Header / Tabs */}
          <div style={{ flexShrink: 0, width: '100%', minWidth: 0, marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.5rem', width: '100%', minWidth: 0 }}>
              <button
                type="button"
                onClick={handleBackToMainPage}
                className="outline"
                title="Back to Main Page"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.15rem',
                  padding: '0.35rem 0.4rem',
                  fontSize: '0.62rem',
                  fontWeight: '800',
                  color: '#0f172a',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  background: '#ffffff',
                  cursor: 'pointer',
                  flexShrink: 0,
                  minHeight: '64px',
                  width: '68px',
                  boxSizing: 'border-box',
                  lineHeight: 1.15,
                  textAlign: 'center'
                }}
              >
                <ArrowLeft size={14} color="#0f172a" />
                <span style={{ color: '#0f172a', fontWeight: '800' }}>Back to</span>
                <span style={{ color: '#0f172a', fontWeight: '800' }}>Main Page</span>
              </button>

              <nav
                ref={navRef}
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
                  gap: '0.4rem',
                  overflowX: 'auto',
                  scrollbarWidth: 'thin',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
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
                        gap: '0.5rem',
                        padding: '0.45rem 0.55rem',
                        background: isActive ? '#ffffff' : '#f8fafc',
                        border: `1.5px solid ${isActive ? '#F5A623' : '#cbd5e1'}`,
                        borderRadius: '12px',
                        width: '100%',
                        minHeight: '64px',
                        minWidth: '118px',
                        opacity: 1,
                        cursor: tab.locked ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isActive ? '0 4px 15px rgba(245, 166, 35, 0.25)' : 'none',
                        textAlign: 'left',
                        boxSizing: 'border-box',
                        flexShrink: 0
                      }}
                    >
                      <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: isActive ? '#F5A623' : (isCompleted ? '#F5A623' : '#64748b'), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>
                        {isCompleted ? <CheckCircle size={12} /> : tab.id}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', minWidth: 0, flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.2, whiteSpace: 'normal', width: '100%' }}>{tab.title}</span>
                        <span style={{ fontSize: '0.64rem', color: isActive ? '#d97706' : '#334155', lineHeight: 1.2, whiteSpace: 'normal', width: '100%', fontWeight: '700' }}>{tab.subtitle}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

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
              <LostInTheCity onComplete={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />
            )}
            {currentStep === 3 && (
              <AtlasIntroduction onNextActivity={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />
            )}
            {currentStep === 4 && (
              <DistanceAndScale onComplete={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} />
            )}
            {currentStep === 5 && (
              <Directions onComplete={() => setCurrentStep(6)} onBack={() => setCurrentStep(4)} />
            )}
            {currentStep === 6 && (
              <MapSymbols onComplete={() => setCurrentStep(7)} onBack={() => setCurrentStep(5)} />
            )}
            {currentStep === 7 && (
              <CoordinatesPage onNextActivity={() => setCurrentStep(8)} onBack={() => setCurrentStep(6)} />
            )}
            {currentStep === 8 && (
              <TimeZonesPage onNextActivity={() => setCurrentStep(9)} onBack={() => setCurrentStep(7)} />
            )}
            {currentStep === 9 && (
              <MiscellaneousPage onBackToDashboard={handleBackToMainPage} onBack={() => setCurrentStep(8)} />
            )}
          </div>
        </>
      )}
    </div>
  );
}



