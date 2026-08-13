import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, MapPin, Award, Navigation, Map as MapIcon, Train } from 'lucide-react';
import IndiaSVGMap from './IndiaSVGMap';
import ChapterBackFooter from '../ChapterBackFooter';

const MISSIONS = [
  {
    id: 'ka',
    stateName: 'Karnataka',
    destination: 'Bengaluru',
    fact: 'Garden City of India.',
    type: 'direction',
    story: 'We are starting from Chennai, Tamil Nadu.\nOur friend has invited us to Bengaluru.',
    question: 'Which direction should we begin travelling?',
    options: ['North', 'South', 'West', 'East'],
    correct: 'West',
    feedbackWrong: 'Good try!\nLook carefully at where Bengaluru is compared to Chennai.\nTry another direction.',
    feedbackSuccess: 'Excellent!\nBengaluru lies almost exactly west of Chennai.\nMaps help us choose the correct direction while travelling.',
    learning: '🧭 Maps help us choose directions.',
    direction: 'West',
    distance: 'Short'
  },
  {
    id: 'mh',
    stateName: 'Maharashtra',
    destination: 'Mumbai',
    fact: 'India\'s financial capital.',
    type: 'distance',
    story: 'Now we are travelling farther.',
    question: 'Which city is farther from Chennai?',
    options: ['Bengaluru', 'Mumbai'],
    correct: 'Mumbai',
    feedbackWrong: 'Look at the map. Mumbai is much further away than Bengaluru. Try again!',
    feedbackSuccess: 'Maps help us compare distances.\nSome journeys are longer than others.',
    learning: '📏 Maps help us compare distances.',
    distance: 'Long'
  },
  {
    id: 'ap',
    stateName: 'Andhra Pradesh',
    destination: 'Amaravati',
    fact: 'Known as the Rice Bowl of India.',
    type: 'direction',
    story: 'Let\'s visit our neighbouring state.',
    question: 'Which direction should we travel?',
    options: ['North', 'South', 'East', 'West'],
    correct: 'North',
    feedbackWrong: 'Andhra Pradesh is just above Tamil Nadu on the map. Try another direction.',
    feedbackSuccess: 'Excellent! Andhra Pradesh is directly north of Tamil Nadu.',
    learning: '🧭 Maps help us find neighbouring states.',
    direction: 'North'
  },
  {
    id: 'wb',
    stateName: 'West Bengal',
    destination: 'Kolkata',
    fact: 'Known as the City of Joy.',
    type: 'direction',
    story: 'Our next adventure is to West Bengal.',
    question: 'Which direction should we travel?',
    options: ['East', 'West', 'South', 'North-East'],
    correct: 'North-East',
    feedbackWrong: 'Kolkata is towards the upper right side of India. Try again!',
    feedbackSuccess: 'Correct! Kolkata is in the north-east direction from Tamil Nadu.',
    learning: '🗺 Maps help us plan travel before starting.',
    direction: 'North-East'
  },
  {
    id: 'rj',
    stateName: 'Rajasthan',
    destination: 'Jaipur',
    fact: 'Famous as the Pink City.',
    type: 'direction',
    story: 'Let\'s travel to the deserts of Rajasthan.',
    question: 'Which direction should we travel?',
    options: ['North', 'South', 'North-East', 'North-West'],
    correct: 'North-West',
    feedbackWrong: 'Jaipur is in the upper left part of India. What direction is that?',
    feedbackSuccess: 'Great! Jaipur is towards the North-West.',
    learning: '🧭 Maps help us choose directions.',
    direction: 'North-West'
  },
  {
    id: 'as',
    stateName: 'Assam',
    destination: 'Assam',
    fact: 'Known for tea gardens and wildlife.',
    type: 'direction',
    story: 'Our final destination is far away in the east.',
    question: 'Which direction should we travel?',
    options: ['East', 'West', 'North-East', 'South-East'],
    correct: 'North-East',
    feedbackWrong: 'Assam is in the far upper right corner of India. Try again.',
    feedbackSuccess: 'Perfect! Assam is in the far North-East.',
    learning: '🗺 Maps are practical tools for travel.',
    direction: 'North-East'
  }
];

export default function ExploreIndiaActivity({ onBeginChapter, onBack }) {
  const [missionIndex, setMissionIndex] = useState(-1); // -1 = intro, 0-5 = missions, 6 = complete
  const [feedback, setFeedback] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [travelDiary, setTravelDiary] = useState([]);
  
  // For the map animation state
  const [activeRoute, setActiveRoute] = useState(null); // { to: 'ka', showBoth: false }

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
      }, 3000); // 3 second animation
      
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

  const renderIntro = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '30px', justifyContent: 'center' }}>
      <div style={{ background: '#fff', border: '1px solid #e4ebf3', borderRadius: '16px', padding: '40px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌍</div>
        <h2 style={{ fontFamily: '"Fraunces", serif', color: '#0E3556', fontSize: '28px', marginBottom: '16px' }}>Travel Across India!</h2>
        <div style={{ color: '#5c6b7a', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p>We have already used a map to travel inside a small town.</p>
          <p>Now let's use a map to travel across India.</p>
          <p>Our journey begins in Chennai, Tamil Nadu.</p>
          <p>Help us visit different places by choosing the correct direction and learning how maps guide travellers.</p>
        </div>
        <button 
          onClick={handleStart}
          style={{ background: '#16a34a', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '30px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(22, 163, 74, 0.4)', transition: 'transform 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Ready? Let's begin!
        </button>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '30px', overflowY: 'auto' }}>
      <div style={{ background: '#fff', border: '1px solid #e4ebf3', borderRadius: '16px', padding: '40px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ fontFamily: '"Fraunces", serif', color: '#16a34a', fontSize: '28px', marginBottom: '16px' }}>Journey Complete!</h2>
        <p style={{ color: '#20303f', fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Wonderful! You successfully travelled across India using a map.</p>
        
        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', textAlign: 'left', marginBottom: '32px', display: 'inline-block' }}>
          <p style={{ color: '#5c6b7a', fontSize: '15px', marginBottom: '16px', fontWeight: 600 }}>Today you discovered that maps help us:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#334155', fontSize: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={18} color="#16a34a" /> Choose directions</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={18} color="#16a34a" /> Compare distances</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={18} color="#16a34a" /> Plan journeys</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={18} color="#16a34a" /> Reach new places</div>
          </div>
        </div>

        <p style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic', marginBottom: '32px' }}>
          The next lessons will teach you how maps measure distance, show directions, and locate places precisely.
        </p>
      </div>
    </div>
  );

  const renderMission = () => {
    const mission = MISSIONS[missionIndex];

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        
        {/* Progress Tracker */}
        <div style={{ padding: '20px 30px 0', display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle size={14} /> Tamil Nadu
          </span>
          {MISSIONS.map((m, idx) => {
            const isPast = idx < missionIndex;
            const isCur = idx === missionIndex;
            let color = '#94a3b8';
            if (isPast) color = '#16a34a';
            if (isCur) color = '#3b82f6';
            
            return (
              <React.Fragment key={m.id}>
                <span style={{ color: '#cbd5e1', fontSize: '12px' }}>→</span>
                <span style={{ fontSize: '13px', fontWeight: isCur ? 700 : 600, color, display: 'flex', alignItems: 'center', gap: '4px', background: isCur ? '#eff6ff' : 'transparent', padding: isCur ? '4px 8px' : '0', borderRadius: '6px' }}>
                  {isPast && <CheckCircle size={14} />}
                  {m.destination}
                </span>
              </React.Fragment>
            );
          })}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 30px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Mission Card */}
          <div style={{ background: '#fff', border: '1px solid #e4ebf3', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ color: '#7c5cff', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  Mission {missionIndex + 1} of 6
                </div>
                <h3 style={{ fontFamily: '"Fraunces", serif', color: '#0E3556', fontSize: '24px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Destination: {mission.destination}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontStyle: 'italic' }}>
                  {mission.fact}
                </div>
              </div>
              <div style={{ background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', color: '#475569' }}>
                <MapPin size={20} />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
              {mission.story.split('\n').map((line, i) => (
                <p key={i} style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#334155', lineHeight: 1.5 }}>{line}</p>
              ))}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px', fontWeight: 600 }}>{mission.question}</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {mission.options.map(opt => {
                  let isSelectedCorrect = feedback?.type === 'success' && opt === mission.correct;
                  let isSelectedWrong = feedback?.type === 'error' && feedback.picked === opt;
                  
                  return (
                    <button 
                      key={opt}
                      onClick={() => !animating && !feedback?.type && handleAnswer(opt)}
                      disabled={!!feedback?.type || animating}
                      style={{
                        padding: '16px',
                        background: isSelectedCorrect ? '#dcfce7' : isSelectedWrong ? '#fee2e2' : '#fff',
                        border: `2px solid ${isSelectedCorrect ? '#16a34a' : isSelectedWrong ? '#ef4444' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: isSelectedCorrect ? '#166534' : isSelectedWrong ? '#991b1b' : '#334155',
                        cursor: (!!feedback?.type || animating) ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {feedback && (
              <div style={{ 
                background: feedback.type === 'success' ? '#f0fdf4' : '#fff1f2', 
                border: `1px solid ${feedback.type === 'success' ? '#bbf7d0' : '#fecdd3'}`, 
                padding: '16px', 
                borderRadius: '12px',
                marginTop: '20px',
                animation: 'fadeIn 0.3s ease-out'
              }}>
                <div style={{ color: feedback.type === 'success' ? '#166534' : '#991b1b', fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  {feedback.type === 'success' ? <Award size={20} style={{ flexShrink: 0 }} /> : <Navigation size={20} style={{ flexShrink: 0, transform: 'rotate(180deg)' }} />}
                  <div style={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                    {feedback.text}
                  </div>
                </div>
                
                {feedback.type === 'error' && (
                  <button onClick={() => setFeedback(null)} style={{ marginTop: '12px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                    Try Again
                  </button>
                )}

                {feedback.type === 'success' && !animating && (
                  <button 
                    onClick={handleNextMission} 
                    style={{ marginTop: '16px', background: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    Continue Journey <ChevronRight size={18} />
                  </button>
                )}
              </div>
            )}
            
            {/* Learning Insight */}
            {missionIndex > 0 && !feedback?.type && (
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', color: '#64748b', fontSize: '14px', fontWeight: 500, fontStyle: 'italic', textAlign: 'center' }}>
                {MISSIONS[missionIndex - 1].learning}
              </div>
            )}

          </div>

          {/* Travel Diary */}
          {travelDiary.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #e4ebf3', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                <MapIcon size={16} /> Travel Diary
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {travelDiary.map((entry, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ color: '#16a34a' }}><CheckCircle size={18} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#334155', fontSize: '14px' }}>{entry.destination}</div>
                      <div style={{ display: 'flex', gap: '12px', color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                        {entry.direction && <span>Direction: <b>{entry.direction}</b></span>}
                        {entry.distance && <span>Distance: <b>{entry.distance}</b></span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
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
      fontFamily: '"Space Grotesk", system-ui, sans-serif' 
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ display: 'flex', flex: 1, minHeight: 0, flexDirection: 'row' }}>
      
      {/* LEFT PANEL: Interactive Map */}
      <div style={{ 
        flex: 1.2, 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRight: '1px solid rgba(0,0,0,0.08)', 
        position: 'relative',
        background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)'
      }}>
        <div style={{ flex: 1, background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', padding: '16px' }}>
          <IndiaSVGMap 
            activeRoute={activeRoute}
            animating={animating}
            missionIndex={missionIndex}
            missions={MISSIONS}
          />
        </div>
      </div>

      {/* RIGHT PANEL: Mission Controls */}
      <div style={{ flex: 1, backgroundColor: '#fcfdfd', color: '#20303f', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {missionIndex === -1 && renderIntro()}
        {missionIndex >= 0 && missionIndex < MISSIONS.length && renderMission()}
        {missionIndex >= MISSIONS.length && renderComplete()}
      </div>

      </div>

      <ChapterBackFooter
        onBack={onBack}
        nextLabel={missionIndex >= MISSIONS.length ? 'Continue to Next Lesson' : undefined}
        onNext={missionIndex >= MISSIONS.length ? onBeginChapter : undefined}
        nextVariant="blue"
      />
    </div>
  );
}
