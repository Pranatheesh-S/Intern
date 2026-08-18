import React, { useState } from 'react';
import Globe3D from './Globe3D';
import CoordinatesMinigame from './CoordinatesMinigame';
import './CoordinatesPageBook.css';
import './CoordinatesPageDark.css';

const stepsData = [
  {
    stepNum: 1,
    title: "Return to the Globe",
    paragraphs: [
      "Let us look closely at a globe — a small model of our round Earth. Because a ball has no corners or edges, we cannot simply say a place is \"in the corner\".",
      "To pinpoint any place exactly, mapmakers imagine a network of lines drawn across the globe. Over the next steps we will draw those lines one by one."
    ],
    keyIdea: "The lines on a globe are imaginary — we only picture them to help locate places.",
    task: 0, lat: 0
  },
  {
    stepNum: 2,
    title: "The North & South Poles",
    paragraphs: [
      "Rotate the globe and two points stay fixed — one at the very top and one at the very bottom. These are the North Pole and the South Pole.",
      "The Earth spins around an imaginary rod that joins them, called its axis (shown in gold). The poles are our starting references for every other line."
    ],
    keyIdea: "The North Pole and South Pole are the two fixed ends of Earth's axis.",
    task: 4, lat: 0
  },
  {
    stepNum: 3,
    title: "The Equator",
    paragraphs: [
      "Exactly halfway between the two poles is a circle that runs right around the middle of the Earth. This is the Equator.",
      "It is the largest circle on the globe and divides the Earth into a Northern half and a Southern half. Its value is 0°."
    ],
    keyIdea: "The Equator is the halfway circle between the poles — latitude 0°.",
    task: 1, lat: 0
  },
  {
    stepNum: 4,
    title: "What is Latitude?",
    paragraphs: [
      "Imagine you stand on the Equator and travel towards one of the poles. Your distance from the Equator keeps increasing.",
      "Latitude is exactly this — a measure of how far north or south of the Equator a place is."
    ],
    keyIdea: "Latitude measures your distance north or south of the Equator.",
    task: 1, lat: 0
  },
  {
    stepNum: 5,
    title: "Parallels of Latitude",
    paragraphs: [
      "At any point on that journey you can draw an imaginary line running east-west, parallel to the Equator. Such a line is called a parallel of latitude, and it forms a circle around the Earth.",
      "The Equator is the largest of these circles; the parallels grow smaller as we move towards either pole."
    ],
    keyIdea: "A parallel of latitude runs east-west and makes a circle; the circles shrink towards the poles.",
    task: 5, lat: 0 
  },
  {
    stepNum: 6,
    title: "Latitude in Degrees",
    paragraphs: [
      <span key="1">Latitudes are written in <strong>degrees</strong>. By convention, the Equator is latitude <strong>0°</strong>.</span>,
      <span key="2">The two poles are the highest latitudes — <strong>90° North</strong> and <strong>90° South</strong>, written <strong>90°N</strong> and <strong>90°S</strong>. So latitude runs from 0° up to 90° on each side.</span>
    ],
    keyIdea: <span key="ki6">Equator = <strong>0°</strong> · North Pole = <strong>90°N</strong> · South Pole = <strong>90°S</strong>.</span>,
    task: 7, lat: 0 
  },
  {
    stepNum: 7,
    title: "Latitude and Climate",
    paragraphs: [
      <span key="1">Latitude is linked to <strong>climate</strong>. The coloured belts on the globe show the three zones. Near the Equator it is generally <strong>hot</strong> — the <strong>torrid</strong> zone (orange), bounded by the <strong>Tropic of Cancer</strong> (23½°N) and <strong>Tropic of Capricorn</strong> (23½°S).</span>,
      <div key="2" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '12px 0' }}>
        <span style={{ background: '#f97316', color: '#fff', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 'bold' }}>Torrid - hot</span>
        <span style={{ background: '#22c55e', color: '#fff', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 'bold' }}>Temperate - mild</span>
        <span style={{ background: '#3b82f6', color: '#fff', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 'bold' }}>Frigid - cold</span>
      </div>,
      <span key="3">Moving away from the Equator the climate becomes <strong>temperate</strong> (green, mild); beyond the <strong>Arctic Circle</strong> (66½°N) and <strong>Antarctic Circle</strong> (66½°S) it is <strong>frigid</strong> (blue, very cold). Latitude also helps explain the <strong>seasons</strong>.</span>
    ],
    keyIdea: <span key="ki7">Torrid (hot) near the Equator → Temperate (mild) → Frigid (cold) near the poles.</span>,
    task: 8, lat: 0 
  },
  {
    stepNum: 8,
    title: "The Prime Meridian",
    paragraphs: [
      <span key="1">Longitude needs a <strong>starting line</strong>, just as latitude has the Equator. That line is the <strong>Prime Meridian</strong>.</span>,
      <span key="2">In <strong>1884</strong>, nations agreed that the meridian passing through <strong>Greenwich</strong>, in London, would be the international standard — so it is also called the <strong>Greenwich Meridian</strong>. It is marked <strong>0° longitude</strong>.</span>
    ],
    keyIdea: <span key="ki8">The <strong>Prime Meridian</strong> (through Greenwich, London) is the <strong>0°</strong> starting line for longitude.</span>,
    task: 2, lon: 0 
  },
  {
    stepNum: 9,
    title: "What is Longitude?",
    paragraphs: [
      <span key="1">Now imagine standing on the Prime Meridian and travelling <strong>east or west</strong> along the Equator. Your <strong>distance</strong> from the Prime Meridian keeps increasing.</span>,
      <span key="2"><strong>Longitude</strong> is exactly this — a measure of how far <strong>east or west</strong> of the Prime Meridian a place is.<br/><br/><span style={{opacity: 0.8}}>(Latitude measured distance <strong>north–south</strong>; longitude measures it <strong>east–west</strong>.)</span></span>
    ],
    keyIdea: <span key="ki9">Longitude measures your distance <strong>east or west</strong> of the Prime Meridian.</span>,
    task: 2, lon: 0 
  },
  {
    stepNum: 10,
    title: "Meridians of Longitude",
    paragraphs: [
      <span key="1">Travel from the <strong>North Pole to the South Pole</strong> by the shortest line. Whether you pass through Europe and Africa or through Asia, the distance is the <strong>same</strong>. These pole-to-pole lines are the <strong>meridians of longitude</strong> — all <strong>half-circles</strong> that meet at the two poles.</span>,
      <div key="2" style={{ textAlign: 'center', margin: '24px 0' }}>
        <span style={{ fontSize: '72px', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}>🍊</span>
      </div>,
      <span key="3">An orange 🍊 — its segment lines run pole to pole, just like meridians.</span>
    ],
    keyIdea: <span key="ki10">Meridians of longitude are half-circles from pole to pole — like the segment lines of an <strong>orange</strong>.</span>,
    task: 3, gridLat: 0, gridLon: 0
  },
  {
    stepNum: 11,
    title: "Longitude in Degrees",
    paragraphs: [
      <span key="1">Longitude is measured in <strong>degrees</strong>, from <strong>0° to 180°</strong>, adding <strong>E</strong> for east or <strong>W</strong> for west of the Prime Meridian.</span>,
      <span key="2">For example, <strong>New York</strong> is <strong>74°W</strong>, <strong>Delhi</strong> is <strong>77°E</strong>, and <strong>Tokyo</strong> is <strong>140°E</strong> — shown by the <strong style={{color: '#f97316'}}>orange pins</strong> on the globe.</span>
    ],
    keyIdea: <span key="ki11">Longitude runs <strong>0° to 180°</strong>, East or West — e.g. Delhi <strong>77°E</strong>, New York <strong>74°W</strong>, Tokyo <strong>140°E</strong>.</span>,
    task: 6, lon: 77 
  },
  {
    stepNum: 12,
    title: "Longitude and Time",
    paragraphs: [
      <span key="1">The Earth spins on its axis. Picture a lamp as the <strong>Sun</strong> lighting one side of the globe. As the Earth turns <strong>eastward</strong>, it is morning for some places, midday for others, and night for the rest.</span>,
      <span key="2">So when it is breakfast time in one country, it is lunchtime in another and people are asleep in a third. That is why a place’s <strong>longitude</strong> also tells us its <strong>time</strong>.</span>
    ],
    keyIdea: <span key="ki12">Because the Earth spins, <strong>longitude is closely linked to the time</strong> of day.</span>,
    task: 3, gridLat: 0, gridLon: 0
  },
  {
    stepNum: 13,
    title: "Finding Any Place",
    paragraphs: [
      <span key="1">Put the parallels and the meridians together and they form a complete net — the <strong>global grid</strong>, or <strong>graticule</strong>. Every place now sits where one line of latitude <strong>crosses</strong> one line of longitude.</span>,
      <span key="2">We give its <strong>latitude first</strong>, then its <strong>longitude</strong>. For example, <strong>New Delhi</strong> is <strong>28.6°N, 77.2°E</strong> — a single, exact address.</span>
    ],
    keyIdea: <span key="ki13">Any place = (<strong>latitude, longitude</strong>) — latitude always written first.</span>,
    task: 10, gridLat: 28.6, gridLon: 77.2 
  },
  {
    stepNum: 14,
    title: "India's Ancient Prime Meridian",
    paragraphs: [
      <span key="1">Travel back more than <strong>1,500 years</strong>! Long before Greenwich was chosen as the global standard, ancient Indian astronomers needed a central reference line to map the stars and calculate time.</span>,
      <span key="2">They established their own Prime Meridian running through the ancient city of <strong>Ujjayini</strong> (modern-day Ujjain). Great scholars like <strong>Aryabhata</strong> and <strong>Varahamihira</strong> used this central meridian for all their brilliant astronomical calculations.</span>
    ],
    keyIdea: <span key="ki14"><strong>Ujjayini</strong> served as the Prime Meridian of ancient India over 1,500 years ago.</span>,
    task: 9
  },
  {
    stepNum: 15,
    title: "Find the Place",
    paragraphs: [],
    task: 15
  },
  {
    stepNum: 16,
    title: "Western & Eastern Hemispheres",
    paragraphs: [
      <span key="1">Cut the globe along the <strong>Prime Meridian (0&deg;)</strong> and the <strong>180&deg;</strong> line, and it falls into two halves that we can see <strong>fully</strong>.</span>,
      <span key="2">The left half (blue) is the <strong>Western Hemisphere</strong> (0&deg;&ndash;180&deg; West); the right half (orange) is the <strong>Eastern Hemisphere</strong> (0&deg;&ndash;180&deg; East). India lies in the Eastern Hemisphere.</span>
    ],
    keyIdea: <span key="ki16">The <strong>Prime Meridian</strong> splits Earth into the <strong>Western</strong> and <strong>Eastern</strong> hemispheres.</span>,
    task: 11
  },
  {
    stepNum: 17,
    title: "Northern & Southern Hemispheres",
    paragraphs: [
      <span key="1">Now cut the globe along the <strong>Equator (0&deg;)</strong> instead. Again it opens into two halves shown <strong>fully</strong>.</span>,
      <span key="2">The top half (green) is the <strong>Northern Hemisphere</strong>; the bottom half (purple) is the <strong>Southern Hemisphere</strong>. India lies in the Northern Hemisphere.</span>
    ],
    keyIdea: <span key="ki17">The <strong>Equator</strong> splits Earth into the <strong>Northern</strong> and <strong>Southern</strong> hemispheres.</span>,
    task: 12
  },
  {
    stepNum: 18,
    title: "The Four Quarters",
    paragraphs: [
      <span key="1">Use <strong>both</strong> dividing lines at once and the globe splits into <strong>four quarters</strong>: Northern-Eastern, Northern-Western, Southern-Eastern and Southern-Western.</span>,
      <span key="2">Every place on Earth sits in exactly <strong>one</strong> of these quarters.</span>
    ],
    keyIdea: <span key="ki18">The Equator and the Prime Meridian together divide Earth into <strong>four</strong> quarters.</span>,
    task: 13
  }
];

export default function CoordinatesPage({ onNextActivity, onBack }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const totalGlobeSteps = 18;

  const handleNext = () => {
    if (currentStepIdx < totalGlobeSteps) {
      setCurrentStepIdx(c => c + 1);
    } else {
      if (onNextActivity) onNextActivity();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(c => c - 1);
    } else {
      if (onBack) onBack();
    }
  };

  if (currentStepIdx === 0) {
    return (
      <div className="coords-page">
        <div className="coords-book">
          <div className="coords-main-content">
            {/* Left Page */}
            <div className="coords-left">
              <div className="coords-eyebrow">CHAPTER 1 &bull; CLASS 6 SOCIAL SCIENCE</div>
              <h1 className="coords-chtitle">Locating Places<br/>on the Earth</h1>
              <div className="coords-illus" style={{ background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '1px solid #cbd5e1', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)' }}>
                <svg width="240" height="240" viewBox="0 0 4 4" style={{ border: '4px solid #64748b', borderRadius: '4px', background: '#fff' }}>
                  <rect x="0" y="0" width="1" height="1" fill="#64748b"/>
                  <rect x="2" y="0" width="1" height="1" fill="#64748b"/>
                  <rect x="1" y="1" width="1" height="1" fill="#64748b"/>
                  <rect x="3" y="1" width="1" height="1" fill="#64748b"/>
                  <rect x="0" y="2" width="1" height="1" fill="#64748b"/>
                  <rect x="2" y="2" width="1" height="1" fill="#64748b"/>
                  <rect x="1" y="3" width="1" height="1" fill="#64748b"/>
                  <rect x="3" y="3" width="1" height="1" fill="#64748b"/>
                </svg>
                <div style={{ marginTop: '20px', fontWeight: '800', color: '#1e293b', fontSize: '15px' }}>Grid Coordinate System</div>
              </div>
            </div>
            
            {/* Right Page */}
            <div className="coords-right">
              <div className="coords-rhead" style={{ fontSize: '32px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                UNDERSTANDING COORDINATES
              </div>
              <div className="coords-content">
                <div className="coords-task-container" style={{ justifyContent: 'flex-start', paddingTop: '10px' }}>
                  <div className="coords-hero" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '28px' }}>Understanding Coordinates</h3>
                    <p style={{ marginBottom: '20px', fontSize: '18px', lineHeight: '1.7' }}>
                      Imagine a big market with neat rows of shops. If you tell a friend, "Meet me at the 7th shop in the 5th row," they can find you instantly.
                    </p>
                    <p style={{ marginBottom: '20px', fontSize: '18px', lineHeight: '1.7' }}>
                      Similarly, in a game of chess, players record their moves using letters (a-h) and numbers (1-8). By saying "d4", they pinpoint one exact square on the board.
                    </p>
                    <p style={{ fontSize: '18px', lineHeight: '1.7' }}>
                      To locate a place precisely, we always need <strong>two pieces of information</strong> to form a coordinate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="coords-rfoot">
            <div className="coords-pageind" style={{ fontSize: '16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              Page 1 of {totalGlobeSteps + 1}
            </div>
            <button className="coords-next" onClick={handleNext} style={{ fontSize: '16px', padding: '12px 26px' }}>
              Next Page &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeGlobeIdx = currentStepIdx - 1;

  if (activeGlobeIdx === 14) {
    return (
      <CoordinatesMinigame 
        onComplete={() => {
          setCurrentStepIdx(16);
        }}
        onBack={handlePrev}
      />
    );
  }

  const step = stepsData[activeGlobeIdx] || stepsData[stepsData.length - 1];

  const getTopTitle = () => {
    if (activeGlobeIdx >= 15) return "Hemispheres — How the Earth is Divided";
    return "The Global Grid — Latitude & Longitude";
  };

  return (
    <div className="dark-coords-page">
      <div className="dark-coords-main-content">
        <div className="dark-coords-left">
          <div className="dark-top-title">{getTopTitle()}</div>
          
          <div className="dark-globe-container">
            <Globe3D 
              currentTask={step.task} 
              latVal={step.lat} 
              lonVal={step.lon || 0} 
              gridLat={step.gridLat || 0} 
              gridLon={step.gridLon || 0} 
            />
          </div>

          <div className="dark-bottom-nav">
            <button className="dark-nav-btn" onClick={handlePrev}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>
            <div className="dark-nav-dots">
              {Array.from({ length: totalGlobeSteps }).map((_, i) => (
                <div key={i} className={`dark-nav-dot ${i === activeGlobeIdx ? 'active' : ''}`} />
              ))}
            </div>
            <button className="dark-nav-btn next" onClick={handleNext}>
              {activeGlobeIdx === totalGlobeSteps - 1 ? 'Finish' : 'Next'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="dark-coords-right">
          <div className="dark-step-eyebrow">STEP {activeGlobeIdx + 1} OF {totalGlobeSteps}</div>
          <h2 className="dark-step-title">{step.title}</h2>
          
          {step.paragraphs.map((p, idx) => (
            <div key={idx} className="dark-step-text">{p}</div>
          ))}

          {step.keyIdea && (
            <div className="dark-key-idea-box">
              <div className="dark-key-idea-title">KEY IDEA</div>
              <div className="dark-key-idea-text">{step.keyIdea}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
