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

export default function LocatingPlacesActivity({ onBackToDashboard }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [subStep5, setSubStep5] = useState(0);
  const [viewMode, setViewMode] = useState('cover'); // 'cover' = Open Book page, 'activity' = chapter tabs
  const [coverKey, setCoverKey] = useState(0);
  const navRef = useRef(null);

  const handleBackToMainPage = () => {
    setViewMode('cover');
    setCurrentStep(1);
    setSubStep5(0);
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
    <div data-theme="light" style={{
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
        background: '#f8fafc'
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
              fontSize: 'clamp(14px, 0.95vw, 16px)',
              fontWeight: 700,
              color: '#0E3556',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              background: 'transparent',
              cursor: 'pointer',
              flexShrink: 0,
              minHeight: 'clamp(64px, 6vh, 78px)',
              width: 'clamp(72px, 6vw, 96px)',
              boxSizing: 'border-box',
              lineHeight: 1.15,
              textAlign: 'center'
            }}
          >
            <ArrowLeft size={13} />
            <span>Back to</span>
            <span>Main Page</span>
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
                if (!tab.locked) {
                  setCurrentStep(tab.id);
                  if (tab.id === 5) setSubStep5(0);
                }
              }}
              disabled={tab.locked}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.55rem',
                background: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
                border: `1px solid ${isActive ? '#6366f1' : '#cbd5e1'}`,
                borderRadius: '12px',
                width: '100%',
                minHeight: 'clamp(64px, 6vh, 78px)',
                minWidth: '118px',
                opacity: tab.locked ? 0.72 : 1,
                cursor: tab.locked ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 15px rgba(99, 102, 241, 0.15)' : 'none',
                textAlign: 'left',
                boxSizing: 'border-box',
                flexShrink: 0
              }}
            >
              <div style={{ width: 'clamp(24px, 1.9vw, 30px)', height: 'clamp(24px, 1.9vw, 30px)', borderRadius: '7px', background: isActive ? '#6366f1' : '#cbd5e1', color: isActive ? '#fff' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(14px, 1.05vw, 17px)', fontWeight: 800, flexShrink: 0 }}>
                {isCompleted ? <CheckCircle size={11} /> : tab.id}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: 'clamp(14px, 1.05vw, 18px)', fontWeight: 800, color: '#0E3556', lineHeight: 1.22, whiteSpace: 'normal', width: '100%' }}>{tab.title}</span>
                <span style={{ fontSize: 'clamp(14px, 0.95vw, 16px)', fontWeight: 500, color: '#47586b', lineHeight: 1.25, whiteSpace: 'normal', width: '100%' }}>{tab.subtitle}</span>
              </div>
            </button>
          );
        })}
          </nav>
        </div>

        {/* Chapter progress — one notch per step, filled as the chapter is worked through */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', padding: '0 2px' }}>
          <span style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 'clamp(11px, 0.75vw, 13px)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#5c6b7a',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}>
            Chapter progress
          </span>

          <div style={{ position: 'relative', flex: 1, minWidth: 0, height: '10px' }}>
            {/* notches */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: '4px' }}>
              {tabs.map(t => (
                <div
                  key={t.id}
                  style={{
                    flex: 1,
                    borderRadius: '999px',
                    background: currentStep > t.id
                      ? '#0E3556'
                      : currentStep === t.id
                        ? 'linear-gradient(90deg, #0E3556 0%, #F5A623 100%)'
                        : 'rgba(14,42,69,0.10)',
                    boxShadow: currentStep === t.id ? '0 0 0 2px rgba(245,166,35,0.28)' : 'none',
                    transition: 'background 0.35s ease, box-shadow 0.35s ease'
                  }}
                />
              ))}
            </div>
          </div>

          <span style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 'clamp(11px, 0.75vw, 13px)',
            fontWeight: 700,
            color: '#0E3556',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}>
            {currentStep} / {tabs.length}
          </span>
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
        {currentStep === 5 && subStep5 === 0 && (
          <Directions onComplete={() => setSubStep5(1)} onBack={() => setCurrentStep(4)} />
        )}
        {currentStep === 5 && subStep5 === 1 && (
          <div style={{ flex: 1, height: '100%', minHeight: 0, position: 'relative' }}>
            <ExploreIndiaActivity 
              onBeginChapter={() => { setSubStep5(0); setCurrentStep(6); }} 
              onBack={() => setSubStep5(0)}
            />
          </div>
        )}
        {currentStep === 6 && (
          <MapSymbols onComplete={() => setCurrentStep(7)} onBack={() => { setSubStep5(1); setCurrentStep(5); }} />
        )}
        {currentStep === 7 && (
          <CoordinatesPage onNextActivity={() => setCurrentStep(8)} onBack={() => setCurrentStep(6)} />
        )}
        {currentStep === 8 && (
          <TimeZonesPage onBack={() => setCurrentStep(7)} />
        )}
      </div>
        </>
      )}
    </div>
  );
}
