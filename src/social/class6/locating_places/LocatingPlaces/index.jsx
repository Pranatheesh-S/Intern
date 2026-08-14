import React, { useState, useRef, useEffect } from 'react';
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
import { ActivityShell, ChapterTabBar } from '../../../../components/edu';

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
    <ActivityShell
      className={`edu-activity-shell--viewport${viewMode === 'activity' ? ' edu-activity-shell--fixed' : ''}`}
    >
      {viewMode === 'cover' && (
        <BlueprintIntro
          key={`locating-places-cover-${coverKey}`}
          onExplore={handleOpenBook}
        />
      )}

      {viewMode === 'activity' && (
        <>
      <ChapterTabBar
        navRef={navRef}
        tabs={tabs}
        currentStep={currentStep}
        onTabSelect={(id) => {
          setCurrentStep(id);
          if (id === 5) setSubStep5(0);
        }}
        onBack={handleBackToMainPage}
      />

      <div className="edu-activity-content">
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
    </ActivityShell>
  );
}
