import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, MapPin, Award } from 'lucide-react';
import IndiaSVGMap from './IndiaSVGMap';

const JOURNEY = [
  { id: 'tn', stateName: 'Tamil Nadu' },
  { id: 'ka', stateName: 'Karnataka', fact: 'Bengaluru is known as India\'s Silicon Valley.' },
  { id: 'mh', stateName: 'Maharashtra', fact: 'Mumbai is India\'s financial hub.' },
  { id: 'mp', stateName: 'Madhya Pradesh', fact: 'Known as the heart of India.' },
  { id: 'up', stateName: 'Uttar Pradesh', fact: 'The most populous state in India.' },
  { id: 'dl', stateName: 'Delhi', fact: 'Delhi is India\'s capital city.' },
];

const ADJACENCY = {
  'tn': ['ka', 'kl', 'ap', 'py'],
  'ka': ['mh', 'tg', 'ap', 'tn', 'kl', 'ga'],
  'mh': ['gj', 'mp', 'ct', 'tg', 'ka', 'ga', 'dn', 'dd'],
  'mp': ['rj', 'up', 'ct', 'mh', 'gj'],
  'up': ['ut', 'hp', 'hr', 'dl', 'rj', 'mp', 'ct', 'jh', 'br']
};

export default function ExploreIndiaActivity({ onBeginChapter, onBack }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedJourneys, setCompletedJourneys] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [activeState, setActiveState] = useState({ id: 'tn' });

  const isCompleted = currentStep >= JOURNEY.length - 1;
  const currentTarget = JOURNEY[currentStep + 1];

  const handleStateClick = (loc) => {
    if (isCompleted) return;

    if (loc.id === currentTarget.id) {
      setFeedback({ type: 'success', text: `Great! We have entered ${currentTarget.stateName}.` });
      
      setCompletedJourneys([...completedJourneys, { from: activeState.id, to: loc.id }]);
      setActiveState({ id: loc.id });
    } else {
      const neighbors = ADJACENCY[activeState.id] || [];
      if (neighbors.includes(loc.id)) {
        setFeedback({ type: 'error', text: 'That\'s a neighbouring state, but we need to head North towards Delhi. Try another neighbour!' });
      } else {
        setFeedback({ type: 'error', text: 'That state is too far away. Let\'s first travel through a neighbouring state.' });
      }
    }
  };

  const handleNextMission = () => {
    setFeedback(null);
    setCurrentStep(prev => prev + 1);
  };

  return (
    <div style={{ 
      '--primary': '#3b82f6',
      '--primary-light': '#eff6ff',
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      height: '100%', 
      fontFamily: '"Space Grotesk", system-ui, sans-serif' 
    }}>
      <div style={{ padding: '0.75rem 2rem', borderBottom: '1px solid rgba(0,0,0,0.08)', background: '#fff', zIndex: 10 }}>
        <button 
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', background: 'transparent', border: 'none', color: '#5c6b7a', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.color = '#20303f'}
          onMouseOut={(e) => e.currentTarget.style.color = '#5c6b7a'}
        >
          <ChevronRight style={{ transform: 'rotate(180deg)' }} size={18} /> Back to Map
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', minHeight: 0, overflow: 'hidden' }}>
      
      {/* LEFT PANEL: Interactive Map */}
      <div style={{ 
        flex: 1.4, 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRight: '1px solid rgba(0,0,0,0.08)', 
        position: 'relative',
        background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)'
      }}>
        <div style={{ flex: 1, background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', padding: '16px' }}>
          <IndiaSVGMap 
            activeState={activeState}
            onStateClick={handleStateClick}
            completedJourneys={completedJourneys}
          />
        </div>
        
        {/* Visual Legend */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '16px', fontSize: '12px', color: '#666', fontWeight: 500 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }} />
            Current Location
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '20px', height: '2px', borderTop: '2px dashed var(--primary)' }} />
            Journey Route
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Mission Info */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto', boxSizing: 'border-box', background: 'var(--card-bg)' }}>
        
        {!isCompleted ? (
          <>
            <div style={{ marginBottom: '24px', background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <h1 style={{ fontSize: '24px', color: 'var(--primary)', marginBottom: '8px', lineHeight: 1.2 }}>Explore India with a Map</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.5 }}>
                Maps help us travel not only inside a town, but also across an entire country. Let's begin our journey from Tamil Nadu and visit some famous places in India.
              </p>
            </div>

            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: '#f59e0b', marginBottom: '16px', fontWeight: 700 }}>Today's Journey</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {JOURNEY.map((stop, index) => {
                  const isPast = index < currentStep;
                  const isCurrent = index === currentStep;
                  const isFuture = index > currentStep;
                  
                  return (
                    <div key={stop.id} style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                          width: '24px', height: '24px', borderRadius: '50%', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isPast ? '#10b981' : (isCurrent ? 'var(--primary)' : '#f3f4f6'),
                          color: isPast || isCurrent ? 'white' : '#9ca3af',
                          zIndex: 2
                        }}>
                          {isPast ? <CheckCircle size={14} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isCurrent ? 'white' : '#d1d5db' }} />}
                        </div>
                        {index < JOURNEY.length - 1 && (
                          <div style={{ width: '2px', flex: 1, background: isPast ? '#10b981' : '#e5e7eb', margin: '4px 0' }} />
                        )}
                      </div>
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: isCurrent ? 700 : 500,
                        color: isPast ? '#10b981' : (isCurrent ? 'var(--primary)' : '#9ca3af'),
                        paddingTop: '1px',
                        paddingBottom: index < JOURNEY.length - 1 ? '16px' : '0'
                      }}>
                        {stop.stateName}
                      </div>
                    </div>
                  );
                })}
              </div>

              {feedback?.type === 'success' ? (
                <div style={{ background: 'var(--primary-light)', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600, marginBottom: '8px' }}>
                    <MapPin size={18} /> Reached {currentTarget.stateName}
                  </div>
                  <div style={{ fontSize: '15px', color: 'var(--text-dark)', marginBottom: '16px' }}>
                    <strong>Did you know?</strong> {currentTarget.fact}
                  </div>
                  <button 
                    onClick={handleNextMission}
                    style={{
                      background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px',
                      fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px'
                    }}
                  >
                    Next destination... <ChevronRight size={16} />
                  </button>
                </div>
              ) : (
                <div style={{ padding: '16px', background: 'var(--primary-light)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                  <h2 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Mission</h2>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-dark)' }}>
                    We are currently in <span style={{ color: 'var(--primary)' }}>{JOURNEY[currentStep].stateName}</span>.
                  </div>
                  <div style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Which neighbouring state should we travel to first?
                  </div>
                </div>
              )}
            </div>

            {feedback && feedback.type === 'error' && (
              <div style={{ 
                padding: '16px', 
                borderRadius: '8px', 
                background: '#fef2f2',
                border: '1px solid #ef4444',
                color: '#991b1b',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                animation: 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both'
              }}>
                <div style={{ fontWeight: 500 }}>{feedback.text}</div>
              </div>
            )}
          </>
        ) : (
          <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '64px', height: '64px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#10b981' }}>
                <MapPin size={32} />
              </div>
              <h2 style={{ fontSize: '28px', color: 'var(--text-dark)', marginBottom: '16px' }}>Journey Complete!</h2>
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                Excellent! You travelled across India using a map.
              </p>
              <div style={{ background: 'var(--background)', padding: '24px', borderRadius: '12px', marginBottom: '32px' }}>
                <p style={{ fontSize: '16px', color: 'var(--text-dark)', fontWeight: 500, lineHeight: 1.5, marginBottom: '16px' }}>
                  Imagine doing this journey without a map. Would it have been easy?
                </p>
                <p style={{ fontSize: '15px', color: 'var(--primary)', fontWeight: 600, lineHeight: 1.5 }}>
                  Maps become even more useful when we travel across large places.
                </p>
              </div>

              <button 
                onClick={onBeginChapter} 
                style={{ 
                  background: '#16a34a', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '30px', 
                  fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(22, 163, 74, 0.4)', 
                  display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Continue Learning <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
}
