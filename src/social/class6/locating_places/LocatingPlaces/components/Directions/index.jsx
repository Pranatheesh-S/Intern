import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowRight, Sunrise, Sunset, Navigation, CheckCircle2, ArrowLeft, ArrowUp, ArrowDown, Map, Lightbulb, MapPin, Sun, HelpCircle, BookOpen, Globe } from 'lucide-react';
import ChapterBackFooter from '../ChapterBackFooter';
import { ScrollableWithNav } from '../ContentScrollNav';
import ExploreIndiaActivity from '../LostInTheCity/ExploreIndiaActivity';

const DIRECTIONS = [
  { 
    id: 'N', label: 'North', type: 'Main Direction', angle: 0, 
    description: <>North is one of the four <b>main directions</b>. On a compass, it is at the top. Most maps have a small arrow marked <b>'N'</b> (the <b>North Line</b>) that points North.</>, 
    note: 'Maps usually print a North arrow so you can orient every other direction from it.', 
    question: 'Where is North located on a standard map?',
    options: ['At the top', 'At the bottom', 'On the right', 'On the left'],
    correct: 'At the top',
    explanation: 'Standard maps are always aligned with North pointing to the top.',
    icon: <Navigation size={48} color="#ef4444" style={{ transform: 'rotate(0deg)' }}/> 
  },
  { 
    id: 'NE', label: 'North-East', type: 'Intermediate Direction', angle: 45, 
    description: <>North-East is an <b>intermediate direction</b>. It is exactly halfway between <b>North</b> and <b>East</b>.</>, 
    note: 'Intermediate directions (NE, SE, SW, NW) give you finer bearings between the four main ones.', 
    question: 'Which direction lies halfway between North and East?',
    options: ['North-West', 'North-East', 'South-East', 'South-West'],
    correct: 'North-East',
    explanation: 'North-East (NE) lies between North and East.',
    icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(45deg)' }}/> 
  },
  { 
    id: 'E', label: 'East', type: 'Main Direction', angle: 90, 
    description: <>East is a <b>main direction</b>, to the right of North. The <b>Sun rises in the East</b> every morning.</>, 
    note: 'Facing the sunrise, North is on your left and South on your right.', 
    question: 'Where does the Sun rise every morning?',
    options: ['In the West', 'In the East', 'In the North', 'In the South'],
    correct: 'In the East',
    explanation: 'The Sun always rises in the East.',
    icon: <Sunrise size={48} color="#f59e0b" /> 
  },
  { 
    id: 'SE', label: 'South-East', type: 'Intermediate Direction', angle: 135, 
    description: <>South-East is an <b>intermediate direction</b>. It is located halfway between <b>South</b> and <b>East</b>.</>, 
    note: "Between two cardinals — useful for describing a spot that isn't due S or due E.", 
    question: 'Which direction sits halfway between South and East?',
    options: ['South-West', 'North-East', 'South-East', 'North-West'],
    correct: 'South-East',
    explanation: 'South-East (SE) is between South and East.',
    icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(135deg)' }}/> 
  },
  { 
    id: 'S', label: 'South', type: 'Main Direction', angle: 180, 
    description: <>South is a <b>main direction</b>. It is directly opposite North, at the bottom of the compass.</>, 
    note: 'On most maps, down the page is roughly South.', 
    question: 'Which direction is directly opposite to North?',
    options: ['East', 'West', 'South', 'North-East'],
    correct: 'South',
    explanation: 'South is 180° directly opposite to North.',
    icon: <Navigation size={48} color="#3b82f6" style={{ transform: 'rotate(180deg)' }}/> 
  },
  { 
    id: 'SW', label: 'South-West', type: 'Intermediate Direction', angle: 225, 
    description: <>South-West is an <b>intermediate direction</b>. It is located halfway between <b>South</b> and <b>West</b>.</>, 
    note: 'Halfway between two cardinals, like all intermediate points.', 
    question: 'Which direction lies between South and West?',
    options: ['South-West', 'North-West', 'South-East', 'North-East'],
    correct: 'South-West',
    explanation: 'South-West (SW) lies between South and West.',
    icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(225deg)' }}/> 
  },
  { 
    id: 'W', label: 'West', type: 'Main Direction', angle: 270, 
    description: <>West is a <b>main direction</b>, to the left of North. The <b>Sun sets in the West</b> every evening.</>, 
    note: 'Facing the sunset, South is on your left and North on your right.', 
    question: 'Where does the Sun set in the evening?',
    options: ['In the East', 'In the West', 'In the North', 'In the South'],
    correct: 'In the West',
    explanation: 'The Sun sets in the West in the evening.',
    icon: <Sunset size={48} color="#f59e0b" /> 
  },
  { 
    id: 'NW', label: 'North-West', type: 'Intermediate Direction', angle: 315, 
    description: <>North-West is an <b>intermediate direction</b>. It is located halfway between <b>North</b> and <b>West</b>.</>, 
    note: 'The last of the four intermediate directions.', 
    question: 'Which direction lies halfway between North and West?',
    options: ['North-East', 'South-West', 'North-West', 'South-East'],
    correct: 'North-West',
    explanation: 'North-West (NW) sits between North and West.',
    icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(315deg)' }}/> 
  }
];

export default function Directions({ onComplete, onBack }) {
  const [activeTab, setActiveTab] = useState('compass'); // 'compass' | 'india-map'
  const [activeDir, setActiveDir] = useState(null);
  const [viewedDirs, setViewedDirs] = useState(new Set());
  const [hoveredDir, setHoveredDir] = useState(null);
  const [pulseCompass, setPulseCompass] = useState(false);
  const [infoPage, setInfoPage] = useState(1);
  const [answers, setAnswers] = useState({});

  const isAllViewed = viewedDirs.size === 8;

  const handleDirClick = (id) => {
    setActiveDir(id);
    setViewedDirs(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleAnswerQuestion = (dirId, opt) => {
    setAnswers(prev => ({ ...prev, [dirId]: opt }));
  };

  const getActiveInfo = () => DIRECTIONS.find(d => d.id === activeDir);

  // SVG path for a 45-degree pie slice (one eighth of a circle)
  const createPieSlice = () => {
    const r = 50;
    const startAngle = -22.5 * (Math.PI / 180);
    const endAngle = 22.5 * (Math.PI / 180);
    const x1 = 50 + r * Math.sin(startAngle);
    const y1 = 50 - r * Math.cos(startAngle);
    const x2 = 50 + r * Math.sin(endAngle);
    const y2 = 50 - r * Math.cos(endAngle);
    return `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
  };

  // If India Map Activity is active
  if (activeTab === 'india-map') {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, background: 'linear-gradient(160deg, #F7F1E2 0%, #EFE6D2 100%)', borderRadius: '16px', border: '2px solid #F2DFBC', boxShadow: '0 8px 30px rgba(60,40,20,0.06)', overflow: 'hidden' }}>
        {/* Top Sub-Navigation Switcher Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1.25rem', background: '#FFF9F0', borderBottom: '1.5px solid #F2DFBC', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('compass')}
              style={{ padding: '7px 16px', borderRadius: '999px', border: '1.5px solid #F2DFBC', background: '#FFFFFF', color: '#78350F', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: '"Space Grotesk", sans-serif', transition: 'all 0.2s' }}
            >
              <Compass size={15} color="#D97706" /> Finding Directions (Compass)
            </button>
            <button
              style={{ padding: '7px 16px', borderRadius: '999px', border: 'none', background: '#D97706', color: '#ffffff', fontSize: '13px', fontWeight: 800, cursor: 'default', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: '"Space Grotesk", sans-serif', boxShadow: '0 2px 8px rgba(217,119,6,0.3)' }}
            >
              <Globe size={15} color="#ffffff" /> Travel Across India (6 Locations)
            </button>
          </div>
          <button
            onClick={() => setActiveTab('compass')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', background: '#FFF9F0', border: '1.5px solid #F2DFBC', borderRadius: '999px', color: '#78350F', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer', fontFamily: '"Space Grotesk", sans-serif' }}
          >
            <ArrowLeft size={14} /> Back to Compass
          </button>
        </div>

        {/* The 6-Location India Map Mission */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <ExploreIndiaActivity 
            onBeginChapter={onComplete} 
            onBack={() => setActiveTab('compass')} 
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg, #F7F1E2 0%, #EFE6D2 100%)', overflow: 'hidden', borderRadius: '16px', border: '2px solid #F2DFBC', boxShadow: '0 8px 30px rgba(60,40,20,0.06)' }}>
      
      {/* Top Bar with Activity Mode Switcher */}
      <div style={{ padding: '0.6rem 1.25rem', borderBottom: '1.5px solid #F2DFBC', background: '#FFF9F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{ padding: '7px 16px', borderRadius: '999px', border: 'none', background: '#D97706', color: '#ffffff', fontSize: '13px', fontWeight: 800, cursor: 'default', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: '"Space Grotesk", sans-serif', boxShadow: '0 2px 8px rgba(217,119,6,0.3)' }}
          >
            <Compass size={15} color="#ffffff" /> Finding Directions (Compass)
          </button>
          <button
            onClick={() => setActiveTab('india-map')}
            style={{ padding: '7px 16px', borderRadius: '999px', border: '1.5px solid #F2DFBC', background: '#FFFFFF', color: '#78350F', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: '"Space Grotesk", sans-serif', transition: 'all 0.2s' }}
          >
            <Globe size={15} color="#D97706" /> Travel Across India (6 Locations)
          </button>
        </div>

        {activeDir !== null && (
          <button 
            onClick={() => setActiveDir(null)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', background: '#FFF9F0', border: '1.5px solid #F2DFBC', borderRadius: '999px', color: '#78350F', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}
          >
            <ArrowLeft size={14} /> Back to Overview
          </button>
        )}
      </div>

      {/* Two Column Layout: Parallel 1fr 1fr Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* LEFT: Information Panel */}
        <div style={{ minWidth: 0, minHeight: 0, background: 'linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%)', borderRight: '2px solid #F2DFBC', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'clamp(12px, 1.6vw, 20px)', overflow: 'hidden' }}>
          
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              {!activeDir ? (
                <motion.div key={infoPage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 'clamp(6px, 1.1vh, 10px)' }}>
                  
                  {infoPage === 1 && (
                    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.2vh, 12px)', justifyContent: 'space-between' }}>
                      {/* Section 1 - Intro */}
                      <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: 'clamp(10px, 1.4vh, 14px) 14px', border: '1.5px solid #F2DFBC', boxShadow: '0 2px 8px rgba(60,40,20,0.03)', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '8px', border: '1px solid #FDE68A', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            <Compass size={14} color="#D97706" /> Finding Directions
                          </span>
                        </div>
                        <p style={{ color: '#3D2E24', fontSize: 'clamp(12px, 1.85vh, 13.5px)', lineHeight: 1.45, margin: 0, fontWeight: 600, textAlign: 'justify', textJustify: 'inter-word' }}>
                          Maps have <b>three main parts</b>: Directions, <span style={{ background: '#FEF3C7', color: '#92400E', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>Distance</span>, and <span style={{ background: '#FEF3C7', color: '#92400E', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>Symbols</span>. Directions help us find our way and tell us where places are.
                        </p>
                      </div>

                      {/* Section 2 - The Four Cardinal Directions */}
                      <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: 'clamp(10px, 1.4vh, 14px) 14px', border: '1.5px solid #F2DFBC', boxShadow: '0 2px 8px rgba(60,40,20,0.03)', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <h3 style={{ color: '#78350F', fontSize: 'clamp(13px, 2vh, 14.5px)', margin: 0, fontWeight: 900, fontFamily: '"Fraunces", serif' }}>The Four Main Directions</h3>
                          <span style={{ fontSize: '10.5px', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '8px', fontWeight: 800, border: '1px solid #FDE68A' }}>
                            Cardinal Directions
                          </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                          <button
                            onClick={() => handleDirClick('N')}
                            style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', padding: '8px 4px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.15s', fontFamily: '"Space Grotesk", sans-serif' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'none'}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#DC2626', fontWeight: 900, fontSize: '12px' }}><ArrowUp size={13} strokeWidth={3} /> NORTH</div>
                            <div style={{ fontSize: '10px', color: '#991B1B', marginTop: '2px', fontWeight: 700 }}>Top of Map</div>
                          </button>

                          <button
                            onClick={() => handleDirClick('E')}
                            style={{ background: '#FEF3C7', border: '1.5px solid #FDE68A', padding: '8px 4px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.15s', fontFamily: '"Space Grotesk", sans-serif' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'none'}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#D97706', fontWeight: 900, fontSize: '12px' }}><ArrowRight size={13} strokeWidth={3} /> EAST</div>
                            <div style={{ fontSize: '10px', color: '#92400E', marginTop: '2px', fontWeight: 700 }}>Right Side</div>
                          </button>

                          <button
                            onClick={() => handleDirClick('S')}
                            style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE', padding: '8px 4px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.15s', fontFamily: '"Space Grotesk", sans-serif' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'none'}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#2563EB', fontWeight: 900, fontSize: '12px' }}><ArrowDown size={13} strokeWidth={3} /> SOUTH</div>
                            <div style={{ fontSize: '10px', color: '#1E40AF', marginTop: '2px', fontWeight: 700 }}>Bottom</div>
                          </button>

                          <button
                            onClick={() => handleDirClick('W')}
                            style={{ background: '#FAF5FF', border: '1.5px solid #E9D5FF', padding: '8px 4px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.15s', fontFamily: '"Space Grotesk", sans-serif' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'none'}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#7C3AED', fontWeight: 900, fontSize: '12px' }}><ArrowLeft size={13} strokeWidth={3} /> WEST</div>
                            <div style={{ fontSize: '10px', color: '#5B21B6', marginTop: '2px', fontWeight: 700 }}>Left Side</div>
                          </button>
                        </div>
                      </div>

                      {/* Section 3 - Intermediate Directions (NE, SE, SW, NW) */}
                      <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: 'clamp(10px, 1.4vh, 14px) 14px', border: '1.5px solid #F2DFBC', boxShadow: '0 2px 8px rgba(60,40,20,0.03)', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <h3 style={{ color: '#78350F', fontSize: 'clamp(13px, 2vh, 14.5px)', margin: 0, fontWeight: 900, fontFamily: '"Fraunces", serif' }}>In-Between Directions</h3>
                          <span style={{ fontSize: '10px', color: '#92400E', fontWeight: 700 }}>Halfway points</span>
                        </div>
                        <p style={{ color: '#3D2E24', margin: '0 0 6px 0', fontSize: 'clamp(11px, 1.75vh, 12.5px)', fontWeight: 600, textAlign: 'justify', textJustify: 'inter-word' }}>
                          These directions help us point to places more exactly. They are halfway between the four main directions.
                        </p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                          {[
                            { id: 'NE', name: 'North-East', desc: 'Between N & E' },
                            { id: 'SE', name: 'South-East', desc: 'Between S & E' },
                            { id: 'SW', name: 'South-West', desc: 'Between S & W' },
                            { id: 'NW', name: 'North-West', desc: 'Between N & W' },
                          ].map(item => (
                            <button
                              key={item.id}
                              onClick={() => handleDirClick(item.id)}
                              style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', borderRadius: '8px', padding: '6px 4px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s', fontFamily: '"Space Grotesk", sans-serif' }}
                              onMouseOver={e => { e.currentTarget.style.background = '#FEF3C7'; e.currentTarget.style.borderColor = '#D97706'; }}
                              onMouseOut={e => { e.currentTarget.style.background = '#FFF9F0'; e.currentTarget.style.borderColor = '#F2DFBC'; }}
                            >
                              <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#78350F' }}>{item.id}</div>
                              <div style={{ fontSize: '9.5px', color: '#92400E', marginTop: '1px', fontWeight: 700 }}>{item.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Section 4 - Solar Orientation Hands-on Rule */}
                      <div style={{ background: '#FEF3C7', borderRadius: '12px', padding: 'clamp(10px, 1.4vh, 14px) 14px', border: '1.5px solid #FDE68A', boxShadow: '0 2px 8px rgba(180,83,9,0.06)', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#92400E', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                          <Sun size={13} color="#D97706" /> Find Directions Using the Sun
                        </div>
                        <p style={{ margin: '0 0 6px 0', fontSize: 'clamp(11px, 1.75vh, 12.5px)', color: '#78350F', lineHeight: 1.35, fontWeight: 600, textAlign: 'justify', textJustify: 'inter-word' }}>
                          Stand early in the morning and face the <b>rising Sun</b> with your arms open:
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                          <div style={{ background: '#FFFFFF', border: '1px solid #FDE68A', padding: '5px 8px', borderRadius: '6px', fontSize: '11px', color: '#78350F', fontWeight: 600 }}>
                            🌅 <b>Front</b>: <span style={{ background: '#FEF3C7', color: '#92400E', padding: '1px 4px', borderRadius: '3px', fontWeight: 800 }}>EAST</span> (Sunrise)
                          </div>
                          <div style={{ background: '#FFFFFF', border: '1px solid #FDE68A', padding: '5px 8px', borderRadius: '6px', fontSize: '11px', color: '#78350F', fontWeight: 600 }}>
                            🌄 <b>Back</b>: <span style={{ background: '#FEF3C7', color: '#92400E', padding: '1px 4px', borderRadius: '3px', fontWeight: 800 }}>WEST</span> (Sunset)
                          </div>
                          <div style={{ background: '#FFFFFF', border: '1px solid #FDE68A', padding: '5px 8px', borderRadius: '6px', fontSize: '11px', color: '#78350F', fontWeight: 600 }}>
                            👈 <b>Left Hand</b>: <span style={{ background: '#FEF3C7', color: '#92400E', padding: '1px 4px', borderRadius: '3px', fontWeight: 800 }}>NORTH</span>
                          </div>
                          <div style={{ background: '#FFFFFF', border: '1px solid #FDE68A', padding: '5px 8px', borderRadius: '6px', fontSize: '11px', color: '#78350F', fontWeight: 600 }}>
                            👉 <b>Right Hand</b>: <span style={{ background: '#FEF3C7', color: '#92400E', padding: '1px 4px', borderRadius: '3px', fontWeight: 800 }}>SOUTH</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {infoPage === 2 && (
                    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.3vh, 12px)', justifyContent: 'space-between' }}>
                      {/* Section 1 - The North Line on Maps */}
                      <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: 'clamp(12px, 1.8vh, 16px) 16px', border: '1.5px solid #F2DFBC', boxShadow: '0 2px 8px rgba(60,40,20,0.03)', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#92400E', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            <Navigation size={13} color="#D97706" /> Map Conventions
                          </div>
                          <span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 900, border: '1px solid #FDE68A' }}>
                            North Arrow 🧭
                          </span>
                        </div>
                        <h3 style={{ margin: '0 0 6px 0', color: '#78350F', fontSize: 'clamp(13.5px, 2.2vh, 15.5px)', fontWeight: 900, fontFamily: '"Fraunces", serif' }}>
                          What is the <span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: '4px', border: '1px solid #FDE68A' }}>North Line (N)</span>?
                        </h3>
                        <p style={{ color: '#3D2E24', fontSize: 'clamp(12px, 1.85vh, 13px)', lineHeight: 1.5, margin: '0 0 8px 0', fontWeight: 600, textAlign: 'justify', textJustify: 'inter-word' }}>
                          Most maps do not show all directions. Instead, they show an arrow with <b>'N'</b> at the top right. This is the <b>North Line</b>. If you know North, you can easily find South, East, and West.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFF9F0', border: '1px dashed #F2DFBC', padding: '6px 10px', borderRadius: '8px', fontSize: '11.5px', color: '#78350F', fontWeight: 700 }}>
                          <span>📍</span>
                          <span>Standard orientation rule: <b>North is at the top of every standard map</b>.</span>
                        </div>
                      </div>

                      {/* Section 2 - The Magnetic Compass Fact & Science */}
                      <div style={{ background: '#FFF9F0', borderRadius: '12px', padding: 'clamp(12px, 1.8vh, 16px) 16px', border: '1.5px solid #F2DFBC', boxShadow: '0 2px 8px rgba(60,40,20,0.03)', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#92400E', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                          <Lightbulb size={14} color="#D97706" /> How Does a Compass Work?
                        </div>
                        <p style={{ color: '#3D2E24', margin: '0 0 8px 0', fontSize: 'clamp(12px, 1.85vh, 13px)', lineHeight: 1.5, fontWeight: 600, textAlign: 'justify', textJustify: 'inter-word' }}>
                          A <b>compass</b> is a small tool used to find directions. It has a needle that spins. This needle <b>always points North-South</b> because our Earth is like a giant magnet.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                          <div style={{ background: '#FFFFFF', border: '1px solid #F2DFBC', padding: '6px 8px', borderRadius: '6px', fontSize: '11px', color: '#92400E', fontWeight: 700 }}>
                            🧲 <b>Red Tip</b>: Points to Magnetic North
                          </div>
                          <div style={{ background: '#FFFFFF', border: '1px solid #F2DFBC', padding: '6px 8px', borderRadius: '6px', fontSize: '11px', color: '#1E40AF', fontWeight: 700 }}>
                            ⚪ <b>Silver Tip</b>: Points to South
                          </div>
                        </div>
                      </div>

                      {/* Section 3 - Directions Explored Tracker */}
                      <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: 'clamp(12px, 1.8vh, 16px) 16px', border: '1.5px solid #F2DFBC', boxShadow: '0 2px 8px rgba(60,40,20,0.03)', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#78350F' }}>Directions Explored ({viewedDirs.size}/8)</span>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: isAllViewed ? '#166534' : '#92400E' }}>
                            {isAllViewed ? '✓ All Explored!' : 'Click points on compass to complete'}
                          </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                          {DIRECTIONS.map(d => {
                            const isExplored = viewedDirs.has(d.id);
                            return (
                              <button
                                key={d.id}
                                onClick={() => handleDirClick(d.id)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '4px',
                                  padding: '7px 8px',
                                  borderRadius: '8px',
                                  background: isExplored ? '#DCFCE7' : '#FFF9F0',
                                  color: isExplored ? '#166534' : '#78350F',
                                  fontSize: '12px',
                                  fontWeight: 800,
                                  border: isExplored ? '1.5px solid #86EFAC' : '1.5px solid #F2DFBC',
                                  cursor: 'pointer',
                                  fontFamily: '"Space Grotesk", sans-serif',
                                  transition: 'all 0.15s'
                                }}
                              >
                                {d.id} {isExplored && <CheckCircle2 size={12} />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              ) : (
                /* Detail Bearing View when a direction is clicked */
                <motion.div key={activeDir} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px', minHeight: 0 }}>
                  
                  {/* Direction Title Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FFFFFF', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #F2DFBC', flexShrink: 0 }}>
                    <div style={{ display: 'inline-flex', padding: '0.35rem', background: '#FFF9F0', borderRadius: '10px', border: '1.5px solid #F2DFBC' }}>
                      {getActiveInfo()?.icon}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.3rem', margin: 0, color: '#78350F', lineHeight: 1.15, fontFamily: '"Fraunces", serif', fontWeight: 900 }}>
                        {getActiveInfo()?.label}
                      </h2>
                      <div style={{ fontSize: '11.5px', color: '#92400E', fontWeight: 700, marginTop: '2px' }}>
                        {getActiveInfo()?.type} • Compass Bearing: {getActiveInfo()?.angle}°
                      </div>
                    </div>
                  </div>

                  {/* Direction Explanation */}
                  <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #F2DFBC', flexShrink: 0 }}>
                    <p style={{ color: '#3D2E24', fontSize: '12.5px', lineHeight: 1.45, margin: 0, fontWeight: 600, textAlign: 'justify', textJustify: 'inter-word' }}>
                      {getActiveInfo()?.description}
                    </p>
                  </div>

                  {/* Quick Check Interactive Question */}
                  <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #F2DFBC', boxShadow: '0 2px 8px rgba(60,40,20,0.03)', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#78350F', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <HelpCircle size={14} color="#D97706" /> Quick Check: {getActiveInfo()?.question}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {getActiveInfo()?.options.map(opt => {
                        const userAns = answers[activeDir];
                        const isCorrect = opt === getActiveInfo()?.correct;
                        const isSelected = userAns === opt;
                        let bg = '#FFF9F0', borderColor = '#F2DFBC', textColor = '#78350F';
                        
                        if (userAns) {
                          if (isCorrect) { bg = '#DCFCE7'; borderColor = '#16A34A'; textColor = '#166534'; }
                          else if (isSelected) { bg = '#FEE2E2'; borderColor = '#EF4444'; textColor = '#991B1B'; }
                        }

                        return (
                          <button
                            key={opt}
                            onClick={() => handleAnswerQuestion(activeDir, opt)}
                            style={{
                              background: bg, border: `1.5px solid ${borderColor}`, color: textColor,
                              padding: '6px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 800,
                              cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', fontFamily: '"Space Grotesk", sans-serif'
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {answers[activeDir] && (
                      <div style={{ marginTop: '6px', fontSize: '11.5px', fontWeight: 800, color: answers[activeDir] === getActiveInfo()?.correct ? '#166534' : '#991B1B', textAlign: 'justify', textJustify: 'inter-word' }}>
                        {answers[activeDir] === getActiveInfo()?.correct ? `✓ Correct! ${getActiveInfo()?.explanation}` : `✗ Not quite! ${getActiveInfo()?.explanation}`}
                      </div>
                    )}
                  </div>

                  {/* Map Tip Box */}
                  <div style={{ background: '#FEF3C7', padding: '8px 12px', borderRadius: '10px', border: '1.5px solid #FDE68A', display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                     <Lightbulb size={16} color="#D97706" style={{ flexShrink: 0 }} />
                     <p style={{ color: '#78350F', fontSize: '11.5px', margin: 0, lineHeight: 1.35, fontWeight: 600, textAlign: 'justify', textJustify: 'inter-word' }}>
                       <b>Map Tip:</b> {getActiveInfo()?.note}
                     </p>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sub-page Navigation Footer — Parallel Symmetrical Baseline */}
          <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px solid #F2DFBC', paddingTop: '8px', marginTop: '6px' }}>
            {!activeDir ? (
              <>
                <button
                  onClick={() => setInfoPage(1)}
                  disabled={infoPage === 1}
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, fontSize: '12px',
                    background: infoPage === 1 ? '#F7F1E2' : '#FFF9F0', color: infoPage === 1 ? '#A8A29E' : '#78350F', border: '1.5px solid #F2DFBC', borderRadius: '999px',
                    padding: '6px 15px', cursor: infoPage === 1 ? 'default' : 'pointer',
                    opacity: infoPage === 1 ? 0.45 : 1, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px'
                  }}
                >
                  ◀ Overview
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#78350F' }}>
                  <span>Page {infoPage} of 2</span>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: infoPage === 1 ? '#D97706' : '#F2DFBC' }} />
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: infoPage === 2 ? '#D97706' : '#F2DFBC' }} />
                </div>
                {infoPage === 1 ? (
                  <button
                    onClick={() => setInfoPage(2)}
                    style={{
                      fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, fontSize: '12px',
                      background: '#F59E0B', color: '#FFFFFF', border: '1.5px solid #D97706', borderRadius: '999px',
                      padding: '6px 15px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px',
                      boxShadow: '0 2px 6px rgba(245,158,11,0.25)'
                    }}
                  >
                    Key Concepts ▶
                  </button>
                ) : (
                  <button
                    onClick={() => setPulseCompass(true)}
                    style={{
                      fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, fontSize: '12px',
                      background: '#FEF3C7', color: '#92400E', border: '1.5px solid #FDE68A', borderRadius: '999px',
                      padding: '6px 15px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    Explore Compass 🧭
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setActiveDir(null)}
                style={{
                  margin: '0 auto',
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '6px 18px', background: '#FFF9F0', border: '1.5px solid #F2DFBC',
                  borderRadius: '999px', color: '#78350F', fontSize: '12px', fontWeight: 800,
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: '"Space Grotesk", sans-serif'
                }}
              >
                <ArrowLeft size={14} /> Return to Main Overview
              </button>
            )}
          </div>

        </div>

        {/* RIGHT: Interactive Compass Area */}
        <div style={{ minWidth: 0, minHeight: 0, padding: 'clamp(12px, 1.6vw, 20px)', background: 'radial-gradient(circle at center, #2C1B10 0%, #170E08 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          
          {/* Decorative background glow */}
          <div style={{ position: 'absolute', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(217, 119, 6, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Compass Title Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(254, 243, 199, 0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(253, 230, 138, 0.3)', padding: '4px 14px', borderRadius: '999px', color: '#FEF3C7', fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0, zIndex: 10 }}>
            <Compass size={13} color="#FDE68A" /> Interactive Magnetic Compass
          </div>

          {/* Realistic Compass */}
          <motion.div 
            animate={pulseCompass ? { scale: [1, 1.05, 1], boxShadow: ['0 30px 60px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.8), inset 0 -2px 10px rgba(0,0,0,0.4)', '0 30px 100px rgba(56,189,248,0.8), inset 0 2px 10px rgba(255,255,255,0.8), inset 0 -2px 10px rgba(0,0,0,0.4)', '0 30px 60px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.8), inset 0 -2px 10px rgba(0,0,0,0.4)'] } : {}}
            transition={{ duration: 0.5 }}
            style={{ position: 'relative', width: 'min(330px, 44vh)', height: 'min(330px, 44vh)', borderRadius: '50%', background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 50%, #475569 100%)', boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.8), inset 0 -2px 10px rgba(0,0,0,0.4)', padding: '12px', flexShrink: 0 }}
          >
            
            {/* Inner Dark Dial */}
            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #1e293b 0%, #020617 80%)', boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.8), 0 2px 5px rgba(255,255,255,0.2)' }}>
              
              {/* Dial Markings */}
              <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {Array.from({length: 36}).map((_, i) => (
                  <line key={i} x1="50" y1="2" x2="50" y2={i % 9 === 0 ? "8" : "4"} stroke="rgba(255,255,255,0.2)" strokeWidth={i % 9 === 0 ? "1" : "0.5"} transform={`rotate(${i * 10} 50 50)`} />
                ))}
              </svg>

              {/* The Needle */}
              <motion.div 
                animate={{ rotate: getActiveInfo()?.angle || 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))', zIndex: 10 }}
              >
                {/* North Half */}
                <svg width="24" height="180" viewBox="0 0 30 240" style={{ position: 'absolute' }}>
                   <path d="M 15 12 L 30 120 L 15 120 Z" fill="#ef4444" />
                   <path d="M 15 12 L 0 120 L 15 120 Z" fill="#dc2626" />
                </svg>
                {/* South Half */}
                <svg width="24" height="180" viewBox="0 0 30 240" style={{ position: 'absolute', transform: 'rotate(180deg)' }}>
                   <path d="M 15 12 L 30 120 L 15 120 Z" fill="#e2e8f0" />
                   <path d="M 15 12 L 0 120 L 15 120 Z" fill="#cbd5e1" />
                </svg>
                {/* Center Pin */}
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'linear-gradient(135deg, #fcd34d 0%, #b45309 100%)', boxShadow: '0 2px 5px rgba(0,0,0,0.5)', zIndex: 15 }} />
              </motion.div>

              {/* Interactive Slices and Labels */}
              {DIRECTIONS.map((dir) => {
                const isActive = activeDir === dir.id;
                const isHovered = hoveredDir === dir.id;
                
                return (
                  <div key={dir.id} style={{ position: 'absolute', inset: 0 }}>
                    {/* Invisible Clickable Pie Slice */}
                    <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, transform: `rotate(${dir.angle}deg)`, zIndex: 20, pointerEvents: 'none' }}>
                      <path 
                        d={createPieSlice()} 
                        fill={isActive ? 'rgba(56, 189, 248, 0.18)' : (isHovered ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.001)')}
                        onMouseEnter={() => setHoveredDir(dir.id)}
                        onMouseLeave={() => setHoveredDir(null)}
                        onClick={() => handleDirClick(dir.id)}
                        style={{ transition: 'fill 0.2s', cursor: 'pointer', pointerEvents: 'all' }}
                      />
                    </svg>
                    
                    {/* Label */}
                    <div style={{
                      position: 'absolute', 
                      inset: 0, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      paddingTop: '12px',
                      transform: `rotate(${dir.angle}deg)`,
                      pointerEvents: 'none',
                      zIndex: 15
                    }}>
                      <div style={{
                        transform: `rotate(-${dir.angle}deg)`,
                        color: isActive ? '#38bdf8' : (isHovered ? '#fff' : '#94a3b8'),
                        fontWeight: '900',
                        fontSize: dir.id.length === 1 ? '1.35rem' : '1.05rem',
                        textShadow: isActive ? '0 0 10px rgba(56, 189, 248, 0.9)' : 'none',
                        transition: 'all 0.2s',
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}>
                        {dir.id}
                      </div>
                      {/* Active Indicator Dot */}
                      {isActive && (
                         <div style={{ marginTop: '2px', width: '5px', height: '5px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 10px #38bdf8' }} />
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Glass Reflection Overlay */}
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(160deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%)', pointerEvents: 'none', zIndex: 25 }} />
            </div>
          </motion.div>

          {/* Prompt below compass */}
          <div style={{ zIndex: 30, display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 600 }}>
              💡 Click any quadrant on the compass to point the needle
            </span>
          </div>
        </div>

      </div>

      <ChapterBackFooter
        onBack={onBack}
        nextLabel="Explore Directions using India Map →"
        onNext={() => setActiveTab('india-map')}
        nextVariant="amber"
      />
    </div>
  );
}
