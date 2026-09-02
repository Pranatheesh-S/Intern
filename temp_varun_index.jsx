import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Gamepad2, Globe2, Star } from 'lucide-react';
import WhatMaths from './WhatMaths';
import PatternsEverywhere from './PatternsEverywhere';
import ManActivity from './ManActivity';
import PatternMachines from './PatternMachines';
import PatternsInNumbers from './PatternsInNumbers';
import NumberSequencesTable from './NumberSequencesTable';
import VisualisingSequences from './VisualisingSequences';
import RelationsAmongSequences from './RelationsAmongSequences';
import './MathsChapter1Dark.css';

export default function Class6MathsChapter1({ onBackToDashboard }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const navRef = useRef(null);

  const handleBackToMainPage = () => {
    if (onBackToDashboard) {
      onBackToDashboard();
    }
  };

  const tabs = [
    { id: 1, label: '1.1', title: 'What is Mathematics?', subtitle: 'Patterns everywhere ΓÇö and why they matter', locked: false },
    { id: 2, label: '1.2', title: 'Patterns in Numbers', subtitle: 'Table 1 ┬╖ the ten famous sequences', locked: currentStep < 2 },
    { id: 3, label: '1.3', title: 'Visualising Sequences', subtitle: 'Dot-pattern builder ┬╖ Table 2', locked: currentStep < 3 },
    { id: 4, label: '1.4', title: 'Relations Among Sequences', subtitle: 'Why odd numbers make squares', locked: currentStep < 4 },
    { id: 5, label: '1.5', title: 'Patterns in Shapes', subtitle: 'Polygons, graphs, snowflakes ┬╖ Table 3', locked: currentStep < 5 },
    { id: 6, label: '1.6', title: 'Shapes ΓåÆ Numbers', subtitle: 'Counting sides, lines and triangles', locked: currentStep < 6 },
    { id: 7, label: '≡ƒîì', title: 'Real-Life Lab', subtitle: 'Market bills ┬╖ calendar magic ┬╖ flowers ┬╖ cricket ┬╖ diyas ┬╖ viral messages', locked: currentStep < 7 },
    { id: 8, label: 'Γ¡É', title: 'Summary & Final Quiz', subtitle: '15 questions ┬╖ earn the last badge', locked: currentStep < 8 }
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
  }, [currentStep]);

  const handleNext = () => {
    if (subStep < 4) setSubStep(prev => prev + 1);
    else { setCurrentStep(2); setSubStep(1); }
  };
  const handlePrev = () => {
    if (subStep > 1) setSubStep(prev => prev - 1);
    else handleBackToMainPage();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 101,
      boxSizing: 'border-box',
      padding: 'clamp(16px, 2.5vh, 24px) clamp(16px, 2.5vw, 24px)',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--background, #f8fafc)'
    }}>
      {/* Workflow Header / Tabs */}
      <div style={{ flexShrink: 0, width: '100%', minWidth: 0, marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', width: '100%', minWidth: 0 }}>
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
              
              const getIcon = () => {
                if (isCompleted) return <CheckCircle size={12} />;
                if (tab.id === 7) return <Globe2 size={12} />;
                if (tab.id === 8) return <Star size={12} />;
                return tab.label;
              };

              return (
                <button
                  key={tab.id}
                  data-active={isActive}
                  onClick={() => {
                    if (!tab.locked) {
                      setCurrentStep(tab.id);
                      setSubStep(1);
                    }
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
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: isActive ? '#F5A623' : (isCompleted ? '#F5A623' : '#64748b'), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold', flexShrink: 0 }}>
                    {getIcon()}
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
        minHeight: 0,
        backgroundColor: 'transparent',
        overflowY: 'auto',
        paddingRight: '0.5rem' // to avoid scrollbar overlap
      }}>
        {currentStep === 1 ? (
          <>
            {subStep === 1 && <WhatMaths onNext={handleNext} onPrev={handlePrev} />}
            {subStep === 2 && <PatternsEverywhere onNext={handleNext} onPrev={handlePrev} />}
            {subStep === 3 && <ManActivity onNext={handleNext} onPrev={handlePrev} />}
            {subStep === 4 && <PatternMachines onNext={handleNext} onPrev={handlePrev} />}
          </>
        ) : currentStep === 2 ? (
          <>
            {subStep === 1 && <PatternsInNumbers onNext={() => setSubStep(2)} />}
            {subStep === 2 && <NumberSequencesTable onNext={() => { setCurrentStep(3); setSubStep(1); }} />}
          </>
        ) : currentStep === 3 ? (
          <VisualisingSequences onNext={() => { setCurrentStep(4); setSubStep(1); }} />
        ) : currentStep === 4 ? (
          <RelationsAmongSequences onNext={() => { setCurrentStep(5); setSubStep(1); }} />
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #cbd5e1',
            borderRadius: '16px',
            backgroundColor: '#ffffff'
          }}>
            <h2 style={{ color: '#64748b' }}>{tabs.find(t => t.id === currentStep)?.title} Content Area</h2>
            <p style={{ color: '#94a3b8' }}>Component content goes here...</p>
          </div>
        )}

        {/* Bottom Navigation */}
        {currentStep > 2 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            margin: '1rem 0',
            flexShrink: 0 
          }}>
            <button 
              style={{ padding: '0.75rem 1.5rem', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => {
                setCurrentStep(prev => prev - 1);
                setSubStep(1);
              }}
            >
              Back
            </button>
            {currentStep < 8 && (
              <button 
                className="primary" 
                style={{ padding: '0.75rem 1.5rem', background: '#F5A623', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(245, 166, 35, 0.3)' }}
                onClick={() => {
                  setCurrentStep(prev => prev + 1);
                  setSubStep(1);
                }}
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
