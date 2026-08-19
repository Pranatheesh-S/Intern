import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, MapPin, Award, Navigation, Map as MapIcon, Compass, HelpCircle, Sparkles } from 'lucide-react';
import IndiaSVGMap from './IndiaSVGMap';
import ChapterBackFooter from '../ChapterBackFooter';

const MISSIONS = [
  {
    id: 'ka',
    stateName: 'Karnataka',
    destination: 'Bengaluru',
    fact: 'Garden City & IT Capital of India.',
    type: 'direction',
    story: 'We are starting our journey from Chennai, Tamil Nadu.\nOur friend has invited us to visit Bengaluru in Karnataka.',
    question: 'Which cardinal direction should we travel from Chennai to reach Bengaluru?',
    options: ['West', 'North', 'South', 'East'],
    correct: 'West',
    feedbackWrong: 'Look carefully at where Bengaluru is compared to Chennai on the map. Try another direction!',
    feedbackSuccess: 'Excellent! Bengaluru lies almost directly West of Chennai. Maps help us choose the correct direction before starting.',
    learning: '🧭 Maps help us choose the correct travel directions.',
    direction: 'West',
    distance: 'Short (~350 km)'
  },
  {
    id: 'mh',
    stateName: 'Maharashtra',
    destination: 'Mumbai',
    fact: 'Financial Capital of India on the Arabian Sea coast.',
    type: 'distance',
    story: 'Now we are planning a journey to Maharashtra on the western coast.\nLet\'s compare how far Mumbai is compared to Bengaluru.',
    question: 'Looking at the map scale from Chennai, which destination is farther away?',
    options: ['Mumbai (Much farther)', 'Bengaluru (Closer)', 'Both are at equal distance'],
    correct: 'Mumbai (Much farther)',
    feedbackWrong: 'Look at the map routes: Mumbai is much further northwest than Bengaluru. Try again!',
    feedbackSuccess: 'Correct! Maps help us compare distances so we can plan travel time and resources.',
    learning: '📏 Maps help us compare distances between different cities.',
    direction: 'North-West',
    distance: 'Long (~1,300 km)'
  },
  {
    id: 'ap',
    stateName: 'Andhra Pradesh',
    destination: 'Amaravati',
    fact: 'Known as the historic Rice Bowl region of India.',
    type: 'direction',
    story: 'Next, let\'s visit our neighbouring state Andhra Pradesh.\nAmaravati is located just above Tamil Nadu along the eastern coastline.',
    question: 'Which direction should we travel from Chennai to reach Amaravati in Andhra Pradesh?',
    options: ['North', 'South', 'East', 'West'],
    correct: 'North',
    feedbackWrong: 'Andhra Pradesh lies directly upwards (North) from Tamil Nadu on the map. Try another option!',
    feedbackSuccess: 'Excellent! Amaravati is located directly North of Chennai across the state border.',
    learning: '🧭 Maps help us identify neighbouring states and their relative positions.',
    direction: 'North',
    distance: 'Medium (~450 km)'
  },
  {
    id: 'wb',
    stateName: 'West Bengal',
    destination: 'Kolkata',
    fact: 'Cultural hub of India, located near the Bay of Bengal delta.',
    type: 'direction',
    story: 'Our next adventure takes us across eastern India to West Bengal.\nKolkata lies in the upper-right quadrant of the map from Chennai.',
    question: 'Which intermediate direction must we travel from Chennai to reach Kolkata?',
    options: ['North-East', 'North-West', 'South-East', 'South-West'],
    correct: 'North-East',
    feedbackWrong: 'Kolkata lies towards the upper-right (between North and East). Try again!',
    feedbackSuccess: 'Correct! Kolkata lies in the North-East direction along the eastern coastline from Chennai.',
    learning: '🗺 Intermediate directions (NE, NW, SE, SW) give us accurate travel bearings.',
    direction: 'North-East',
    distance: 'Long (~1,650 km)'
  },
  {
    id: 'rj',
    stateName: 'Rajasthan',
    destination: 'Jaipur',
    fact: 'Famous Pink City with grand historical forts and desert heritage.',
    type: 'direction',
    story: 'Now let\'s head to the historic desert state of Rajasthan.\nJaipur is situated in the upper-left region of India from Chennai.',
    question: 'To reach Jaipur in Rajasthan from Chennai, which intermediate direction should we follow?',
    options: ['North-West', 'North-East', 'South-West', 'South-East'],
    correct: 'North-West',
    feedbackWrong: 'Look at Jaipur in the upper-left corner of the map. Between North and West is North-West. Try again!',
    feedbackSuccess: 'Great job! Jaipur lies in the North-West direction from Chennai.',
    learning: '🧭 Knowing cardinal and intermediate points helps us navigate the entire country.',
    direction: 'North-West',
    distance: 'Very Long (~2,100 km)'
  },
  {
    id: 'as',
    stateName: 'Assam',
    destination: 'Assam (Dispur)',
    fact: 'Gateway to the North-East, world-famous for lush tea gardens and the Brahmaputra river.',
    type: 'direction',
    story: 'Our final destination is far away in the eastern corner of India.\nAssam lies in the picturesque North-Eastern hill region.',
    question: 'Which direction from Chennai is Assam located on the India map?',
    options: ['North-East', 'North-West', 'South-East', 'West'],
    correct: 'North-East',
    feedbackWrong: 'Assam is located in the far upper-right corner of India. Try again!',
    feedbackSuccess: 'Perfect! Assam is located in the far North-East region of India.',
    learning: '🗺 Maps are practical, indispensable tools that guide travelers anywhere on Earth.',
    direction: 'North-East',
    distance: 'Farthest (~2,500 km)'
  }
];

export default function ExploreIndiaActivity({ onBeginChapter, onBack }) {
  const [missionIndex, setMissionIndex] = useState(-1); // -1 = intro, 0-5 = missions, 6 = complete
  const [feedback, setFeedback] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [travelDiary, setTravelDiary] = useState([]);
  
  // For the map animation state
  const [activeRoute, setActiveRoute] = useState(null);

  const handleStart = () => {
    setMissionIndex(0);
  };

  const handleAnswer = (option) => {
    if (animating) return;
    const mission = MISSIONS[missionIndex];
    
    if (option === mission.correct) {
      setFeedback({ type: 'success', text: mission.feedbackSuccess });
      setAnimating(true);
      
      // Trigger map animation
      setActiveRoute({ 
        to: mission.id, 
        showBoth: mission.type === 'distance' 
      });

      // After animation, allow continuing
      setTimeout(() => {
        setAnimating(false);
      }, 2600);
      
    } else {
      setFeedback({ type: 'error', text: mission.feedbackWrong, picked: option });
    }
  };

  const handleNextMission = () => {
    const mission = MISSIONS[missionIndex];
    setTravelDiary(prev => [...prev, mission]);
    setFeedback(null);
    setActiveRoute(null);
    setMissionIndex(prev => prev + 1);
  };

  // Full-width Breadcrumb Progress Bar
  const renderBreadcrumbBar = () => {
    if (missionIndex < 0 || missionIndex >= MISSIONS.length) return null;

    return (
      <div style={{
        padding: '8px 18px',
        background: '#FFF9F0',
        borderBottom: '2px solid #F2DFBC',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        flexShrink: 0
      }}>
        <span style={{ fontSize: '12px', fontWeight: 900, color: '#166534', background: '#DCFCE7', padding: '4px 9px', borderRadius: '8px', border: '1.5px solid #86EFAC', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle size={13} color="#16A34A" /> Chennai (Start)
        </span>
        
        {MISSIONS.map((m, idx) => {
          const isPast = idx < missionIndex;
          const isCur = idx === missionIndex;
          
          let bg = '#FFFFFF';
          let border = '1.5px solid #E2D2B8';
          let color = '#3D2E24';

          if (isPast) {
            bg = '#DCFCE7';
            border = '1.5px solid #86EFAC';
            color = '#166534';
          } else if (isCur) {
            bg = '#FEF3C7';
            border = '2px solid #D97706';
            color = '#92400E';
          }
          
          return (
            <React.Fragment key={m.id}>
              <span style={{ color: '#B45309', fontSize: '12px', fontWeight: 900 }}>→</span>
              <span style={{
                fontSize: '12px',
                fontWeight: isCur ? 900 : 700,
                color,
                background: bg,
                border,
                padding: '4px 9px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: isCur ? '0 2px 6px rgba(217,119,6,0.18)' : 'none'
              }}>
                {isPast && <CheckCircle size={12} color="#16A34A" />}
                {m.destination}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Intro View (100% Fit, Zero Scroll)
  const renderIntro = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', overflow: 'hidden' }}>
      <div style={{
        background: 'linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%)',
        border: '2px solid #F2DFBC',
        borderRadius: '18px',
        padding: '28px 24px',
        boxShadow: '0 6px 24px rgba(60, 40, 20, 0.06)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: '42px', marginBottom: '8px' }}>🌍</div>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF3C7', border: '1px solid #FDE68A', padding: '3px 10px', borderRadius: '999px', color: '#92400E', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          <Sparkles size={13} color="#D97706" /> Interactive Geography Mission
        </div>

        <h2 style={{ fontFamily: '"Fraunces", serif', color: '#92400E', fontSize: '26px', fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.2 }}>
          Travel Across India!
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px', textAlign: 'center', maxWidth: '480px' }}>
          <p style={{ margin: 0, fontFamily: '"Space Grotesk", sans-serif', color: '#3D2E24', fontSize: '14.5px', fontWeight: 600, lineHeight: 1.5 }}>
            We have explored how directions work on a compass.
          </p>
          <p style={{ margin: 0, fontFamily: '"Space Grotesk", sans-serif', color: '#3D2E24', fontSize: '14.5px', fontWeight: 600, lineHeight: 1.5 }}>
            Now let's use a <span style={{ color: '#92400E', background: '#FEF3C7', border: '1.5px solid #FDE68A', padding: '1px 6px', borderRadius: '5px', fontWeight: 800 }}>Map of India</span> to travel from our starting point in <span style={{ color: '#166534', background: '#DCFCE7', border: '1.5px solid #86EFAC', padding: '1px 6px', borderRadius: '5px', fontWeight: 800 }}>Chennai, Tamil Nadu</span> to <span style={{ color: '#1E40AF', background: '#DBEAFE', border: '1.5px solid #93C5FD', padding: '1px 6px', borderRadius: '5px', fontWeight: 800 }}>6 destinations</span>.
          </p>
          <p style={{ margin: '2px 0 0 0', fontFamily: '"Space Grotesk", sans-serif', color: '#B45309', fontSize: '14px', fontWeight: 800 }}>
            🧭 Choose the correct direction to navigate each mission!
          </p>
        </div>

        <button 
          onClick={handleStart}
          style={{ background: '#16A34A', color: '#FFFFFF', border: 'none', padding: '12px 32px', borderRadius: '30px', fontSize: '14.5px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Begin Journey (6 Missions) <ChevronRight size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );

  // Completion View (100% Fit, Zero Scroll)
  const renderComplete = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', overflow: 'hidden' }}>
      <div style={{
        background: 'linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%)',
        border: '2px solid #86EFAC',
        borderRadius: '18px',
        padding: '26px 24px',
        boxShadow: '0 6px 24px rgba(60, 40, 20, 0.06)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '42px', marginBottom: '8px' }}>🎉</div>
        <h2 style={{ fontFamily: '"Fraunces", serif', color: '#166534', fontSize: '25px', fontWeight: 900, margin: '0 0 8px 0' }}>
          All 6 Journeys Completed!
        </h2>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#3D2E24', fontSize: '14.5px', fontWeight: 700, marginBottom: '16px', maxWidth: '440px' }}>
          Congratulations! You successfully navigated all 6 travel destinations across India using directions and distances on the map.
        </p>
        
        <div style={{ background: '#FFFFFF', border: '1.5px solid #F2DFBC', padding: '16px 20px', borderRadius: '14px', textAlign: 'left', marginBottom: '20px', width: '100%', maxWidth: '440px', boxShadow: '0 3px 10px rgba(60,40,20,0.04)' }}>
          <p style={{ fontFamily: '"Fraunces", serif', color: '#92400E', fontSize: '14.5px', margin: '0 0 10px 0', fontWeight: 900 }}>Key Learnings from this Map Activity:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#3D2E24', fontSize: '13px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="#16A34A" /> Finding North, South, East, and West</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="#16A34A" /> Using Intermediate Directions (NE, NW, SE, SW)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="#16A34A" /> Comparing travel distances across states</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} color="#16A34A" /> Reading and navigating standard maps</div>
          </div>
        </div>

        <div>
          <button
            onClick={onBeginChapter}
            style={{ background: '#F59E0B', color: '#FFFFFF', border: 'none', padding: '11px 26px', borderRadius: '999px', fontSize: '13.5px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(245,158,11,0.38)' }}
          >
            Continue to Next Lesson: Map Symbols →
          </button>
        </div>
      </div>
    </div>
  );

  // Active Mission View (100% Fit, Zero Scroll, Perfect Parallel Alignment)
  const renderMission = () => {
    const mission = MISSIONS[missionIndex];

    return (
      <div style={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%)',
        border: '2px solid #F2DFBC',
        borderRadius: '18px',
        padding: '18px 20px',
        boxShadow: '0 6px 20px rgba(60,40,20,0.06)',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexShrink: 0 }}>
          <div>
            <div style={{ color: '#92400E', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px', background: '#FEF3C7', display: 'inline-block', padding: '2px 8px', borderRadius: '6px', border: '1px solid #FDE68A' }}>
              Mission {missionIndex + 1} of 6
            </div>
            <h3 style={{ fontFamily: '"Fraunces", serif', color: '#78350F', fontSize: '21px', margin: '2px 0 1px 0', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Destination: {mission.destination}
            </h3>
            <div style={{ fontSize: '12.5px', color: '#3D2E24', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif' }}>
              📍 {mission.stateName} • <span style={{ color: '#B45309', fontWeight: 600 }}>{mission.fact}</span>
            </div>
          </div>
          <div style={{ background: '#FEF3C7', border: '1.5px solid #FDE68A', padding: '5px 10px', borderRadius: '9px', color: '#92400E', fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} color="#D97706" /> {mission.direction}
          </div>
        </div>

        {/* Story Prompt */}
        <div style={{ background: '#FFFFFF', border: '1px solid #F2DFBC', padding: '10px 12px', borderRadius: '11px', marginBottom: '8px', flexShrink: 0 }}>
          {mission.story.split('\n').map((line, i) => (
            <p key={i} style={{ margin: '0 0 2px 0', fontSize: '13.5px', color: '#3D2E24', lineHeight: 1.4, fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif' }}>{line}</p>
          ))}
        </div>

        {/* Question & Options */}
        <div style={{ marginBottom: '8px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#78350F', fontSize: '14px', fontWeight: 900, marginBottom: '8px', fontFamily: '"Space Grotesk", sans-serif' }}>
            <HelpCircle size={16} color="#D97706" /> {mission.question}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {mission.options.map(opt => {
              let isSelectedCorrect = feedback?.type === 'success' && opt === mission.correct;
              let isSelectedWrong = feedback?.type === 'error' && feedback.picked === opt;
              
              let optBg = '#FFFFFF';
              let optBorder = '#E2D2B8';
              let optColor = '#3D2E24';

              if (isSelectedCorrect) {
                optBg = '#DCFCE7';
                optBorder = '#16A34A';
                optColor = '#166534';
              } else if (isSelectedWrong) {
                optBg = '#FEE2E2';
                optBorder = '#EF4444';
                optColor = '#991B1B';
              }

              return (
                <button 
                  key={opt}
                  onClick={() => !animating && !feedback?.type && handleAnswer(opt)}
                  disabled={!!feedback?.type || animating}
                  style={{
                    padding: '9px 10px',
                    background: optBg,
                    border: `1.5px solid ${optBorder}`,
                    borderRadius: '9px',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: optColor,
                    cursor: (!!feedback?.type || animating) ? 'default' : 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(60,40,20,0.04)',
                    fontFamily: '"Space Grotesk", sans-serif'
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert Box */}
        {feedback && (
          <div style={{ 
            background: feedback.type === 'success' ? '#F0FDF4' : '#FEF2F2', 
            border: `1.5px solid ${feedback.type === 'success' ? '#86EFAC' : '#FECACA'}`, 
            padding: '10px 12px', 
            borderRadius: '10px',
            marginBottom: '6px',
            flexShrink: 0
          }}>
            <div style={{ color: feedback.type === 'success' ? '#166534' : '#991B1B', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              {feedback.type === 'success' ? <Award size={16} color="#16A34A" style={{ flexShrink: 0 }} /> : <Navigation size={16} color="#EF4444" style={{ flexShrink: 0, transform: 'rotate(180deg)' }} />}
              <div style={{ whiteSpace: 'pre-line', lineHeight: 1.35, fontFamily: '"Space Grotesk", sans-serif' }}>
                {feedback.text}
              </div>
            </div>
            
            {feedback.type === 'error' && (
              <button onClick={() => setFeedback(null)} style={{ marginTop: '6px', background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '5px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
                Try Another Direction
              </button>
            )}

            {feedback.type === 'success' && !animating && (
              <button 
                onClick={handleNextMission} 
                style={{ marginTop: '8px', background: missionIndex === MISSIONS.length - 1 ? '#16A34A' : '#F59E0B', color: '#FFFFFF', border: 'none', padding: '7px 16px', borderRadius: '7px', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', boxShadow: missionIndex === MISSIONS.length - 1 ? '0 2px 8px rgba(22,163,74,0.35)' : '0 2px 8px rgba(245,158,11,0.38)' }}
              >
                {missionIndex === MISSIONS.length - 1 ? 'Complete Activity 🎉' : 'Next Destination →'}
              </button>
            )}
          </div>
        )}
        
        {/* Learning Insight Banner */}
        {missionIndex > 0 && !feedback?.type && (
          <div style={{ padding: '8px 10px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '9px', color: '#78350F', fontSize: '12px', fontWeight: 800, textAlign: 'center', fontFamily: '"Space Grotesk", sans-serif', flexShrink: 0 }}>
            {MISSIONS[missionIndex - 1].learning}
          </div>
        )}

      </div>
    );
  };

  return (
    <div style={{ 
      '--primary': '#3b82f6',
      '--primary-light': '#eff6ff',
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      height: '100%', 
      minHeight: 0,
      overflow: 'hidden',
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      background: 'linear-gradient(160deg, #F7F1E2 0%, #EFE6D2 100%)'
    }}>
      {/* Top Breadcrumb Bar (Full Width) */}
      {renderBreadcrumbBar()}

      {/* Main Parallel 2-Column Content Area (100% viewport fit, No Scroll) */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, flexDirection: 'row', padding: '12px 14px', gap: '12px', alignItems: 'stretch', overflow: 'hidden' }}>
        
        {/* LEFT PANEL: Enhanced Large Interactive Map (Parallel Aligned) */}
        <div style={{ 
          flex: '1 1 50%', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%)',
          border: '2px solid #F2DFBC',
          borderRadius: '18px',
          boxShadow: '0 6px 20px rgba(60,40,20,0.06)',
          overflow: 'hidden',
          padding: '10px',
          position: 'relative',
          height: '100%',
          boxSizing: 'border-box'
        }}>
          <IndiaSVGMap 
            activeRoute={activeRoute}
            animating={animating}
            missionIndex={missionIndex}
            missions={MISSIONS}
          />
        </div>

        {/* RIGHT PANEL: Mission Controls (Matching Height & Zero Scroll) */}
        <div style={{ 
          flex: '1 1 50%', 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: 0,
          height: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {missionIndex === -1 && renderIntro()}
          {missionIndex >= 0 && missionIndex < MISSIONS.length && renderMission()}
          {missionIndex >= MISSIONS.length && renderComplete()}
        </div>

      </div>

      <ChapterBackFooter
        onBack={onBack}
        nextLabel={
          missionIndex === -1
            ? 'Start Journey (Mission 1)'
            : missionIndex >= MISSIONS.length
              ? 'Next Activity'
              : 'Next'
        }
        onNext={
          missionIndex === -1
            ? () => setMissionIndex(0)
            : missionIndex >= MISSIONS.length
              ? onBeginChapter
              : handleNextMission
        }
        nextVariant={missionIndex >= MISSIONS.length ? 'green' : 'navy'}
      />
    </div>
  );
}
