import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Compass, Crosshair, ArrowRight, ArrowLeft, CheckCircle2, BookOpen } from 'lucide-react';
import './CoordinatesPageBook.css';
import worldMapUrl from './world-map.jpg';
import Globe3D from './Globe3D';

export default function CoordinatesPage({ onNextActivity, onBack }) {
  const [currentStep, setCurrentStep] = useState(0); // 0-4: Book, 5-7: Tasks
  const [latVal, setLatVal] = useState(0);
  const [lonVal, setLonVal] = useState(0);
  
  // Task 3 (Quiz) State
  const [gridLat, setGridLat] = useState(0);
  const [gridLon, setGridLon] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const getHemi = (val, isLat) => {
    if (val === 0) return isLat ? 'Equator' : 'Prime Meridian';
    if (isLat) return val > 0 ? 'Northern' : 'Southern';
    return val > 0 ? 'Eastern' : 'Western';
  };

  const checkAnswer = () => {
    // Delhi is 29N, 77E
    if (Math.abs(gridLat - 29) <= 5 && Math.abs(gridLon - 77) <= 5) {
      setQuizCompleted(true);
    } else {
      alert("Not quite! Delhi is at 29°N, 77°E. Adjust the sliders closer.");
    }
  };

  const WorldMap2D = () => {
    const W = 360, H = 180;
    const px = ((gridLon + 180) / 360) * W;
    const py = ((90 - gridLat) / 180) * H;
    const targetPx = ((77 + 180) / 360) * W;
    const targetPy = ((90 - 29) / 180) * H;

    return (
      <div style={{ position: 'absolute', inset: 0, background: '#08213a', overflow: 'hidden', borderRadius: '12px' }}>
        <img src={worldMapUrl} alt="World Map" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'fill', opacity: 0.5 }} />
        <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
          {/* Grid Lines */}
          <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1={W / 2} y1="0" x2={W / 2} y2={H} stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Target Box */}
          <circle cx={targetPx} cy={targetPy} r="6" fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" strokeWidth="1.5">
            <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* User Selection */}
          <line x1={px} y1={0} x2={px} y2={H} stroke="#38bdf8" strokeDasharray="2 2" strokeWidth="1" />
          <line x1={0} y1={py} x2={W} y2={py} stroke="#38bdf8" strokeDasharray="2 2" strokeWidth="1" />
          <circle cx={px} cy={py} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
        </svg>
      </div>
    );
  };

  const ChessboardVisual = () => (
    <div style={{ width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', borderRadius: '12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', background: '#94a3b8', padding: '4px', borderRadius: '8px', border: '4px solid #475569' }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} style={{ width: '40px', height: '40px', background: (Math.floor(i/4) + i%4) % 2 === 0 ? '#fff' : '#64748b' }} />
        ))}
      </div>
      <p style={{ marginTop: '16px', fontWeight: 'bold', color: '#334155' }}>Grid Coordinate System</p>
    </div>
  );

  return (
    <div className="coords-page">
      <div className="coords-book">
        
        {/* ============ MAIN CONTENT AREA ============ */}
        <div className="coords-main-content">
          
          {/* LEFT PAGE */}
          <div className="coords-left">
            <div className="coords-eyebrow">CHAPTER 1 • CLASS 6 SOCIAL SCIENCE</div>
            <h1 className="coords-chtitle">Locating Places<br/>on the Earth</h1>
            
            <div className="coords-illus" style={{ background: currentStep === 0 ? 'transparent' : undefined }}>
              {currentStep === 0 && <ChessboardVisual />}
              {currentStep === 1 && <div style={{ position: 'absolute', inset: 0 }}><Globe3D currentTask={0} latVal={0} lonVal={0} gridLat={0} gridLon={0} /></div>}
              {currentStep === 2 && <div style={{ position: 'absolute', inset: 0 }}><Globe3D currentTask={1} latVal={0} lonVal={0} gridLat={0} gridLon={0} /></div>}
              {currentStep === 3 && <div style={{ position: 'absolute', inset: 0 }}><Globe3D currentTask={2} latVal={0} lonVal={0} gridLat={0} gridLon={0} /></div>}
              {currentStep === 4 && <div style={{ position: 'absolute', inset: 0 }}><Globe3D currentTask={3} latVal={0} lonVal={0} gridLat={29} gridLon={77} /></div>}
              {currentStep === 5 && <div style={{ position: 'absolute', inset: 0 }}><Globe3D currentTask={1} latVal={latVal} lonVal={0} gridLat={0} gridLon={0} /></div>}
              {currentStep === 6 && <div style={{ position: 'absolute', inset: 0 }}><Globe3D currentTask={2} latVal={0} lonVal={lonVal} gridLat={0} gridLon={0} /></div>}
              {currentStep === 7 && <WorldMap2D />}
            </div>
          </div>

          {/* RIGHT PAGE */}
          <div className="coords-right">
            <div className="coords-rhead">
              {currentStep < 5 ? (
                <>
                  <BookOpen size={32} color="var(--navy)" style={{ flexShrink: 0 }} />
                  <span style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentStep === 0 && 'UNDERSTANDING COORDINATES'}
                    {currentStep === 1 && 'MAPPING THE EARTH'}
                    {currentStep === 2 && 'LATITUDES'}
                    {currentStep === 3 && 'LONGITUDES'}
                    {currentStep === 4 && 'LATITUDE + LONGITUDE'}
                  </span>
                </>
              ) : (
                <>
                  <Compass size={32} color="var(--navy)" style={{ flexShrink: 0 }} />
                  <span style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentStep === 5 && 'TASK 1: LATITUDE'}
                    {currentStep === 6 && 'TASK 2: LONGITUDE'}
                    {currentStep === 7 && 'TASK 3: FIND THE PLACE'}
                  </span>
                </>
              )}
            </div>

            <div className="coords-content">
              <AnimatePresence mode="wait">
                
                {/* BOOK PAGE 1 */}
                {currentStep === 0 && (
                  <motion.div key="book0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>Understanding Coordinates</h3>
                      <p>Imagine a big market with neat rows of shops. If you tell a friend, "Meet me at the 7th shop in the 5th row," they can find you instantly.</p>
                      <p style={{ marginTop: '12px' }}>Similarly, in a game of chess, players record their moves using letters (a-h) and numbers (1-8). By saying "d4", they pinpoint one exact square on the board.</p>
                      <p style={{ marginTop: '12px' }}>To locate a place precisely, we always need <strong>two pieces of information</strong> to form a coordinate.</p>
                    </div>
                  </motion.div>
                )}

                {/* BOOK PAGE 2 */}
                {currentStep === 1 && (
                  <motion.div key="book1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>Mapping the Earth</h3>
                      <p>The Earth is approximately spherical, spinning in space. The best way to represent our planet is using a <strong>globe</strong>.</p>
                      <p style={{ marginTop: '12px' }}>Representing a curved, 3D sphere perfectly on a flat sheet of paper is very difficult because it causes the shapes and sizes of continents to distort.</p>
                      <p style={{ marginTop: '12px' }}>Because the Earth is a sphere, we need a special coordinate system that wraps around it to locate places accurately.</p>
                    </div>
                  </motion.div>
                )}

                {/* BOOK PAGE 3 */}
                {currentStep === 2 && (
                  <motion.div key="book2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>Latitudes</h3>
                      <p>The <strong>Equator</strong> is an imaginary line that runs horizontally around the center of the Earth. It is at <strong>0° latitude</strong>.</p>
                      <p style={{ marginTop: '12px' }}>The circles that run parallel to the Equator are called <strong>parallels of latitude</strong>.</p>
                      <ul style={{ marginTop: '12px', paddingLeft: '20px', color: 'var(--text)', lineHeight: 1.6 }}>
                        <li>The Equator divides the Earth into the Northern and Southern Hemispheres.</li>
                        <li>Latitude increases as we move north or south.</li>
                        <li>The North Pole is at <strong>90°N</strong>.</li>
                        <li>The South Pole is at <strong>90°S</strong>.</li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* BOOK PAGE 4 */}
                {currentStep === 3 && (
                  <motion.div key="book3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>Longitudes</h3>
                      <p>Unlike latitude, we need lines that run vertically from the North Pole to the South Pole. These are called <strong>meridians of longitude</strong>.</p>
                      <p style={{ marginTop: '12px' }}>The meridian that passes through Greenwich, England is called the <strong>Prime Meridian</strong>. It is at <strong>0° longitude</strong>.</p>
                      <ul style={{ marginTop: '12px', paddingLeft: '20px', color: 'var(--text)', lineHeight: 1.6 }}>
                        <li>The Prime Meridian divides the Earth into the Eastern and Western Hemispheres.</li>
                        <li>Longitude is measured East (E) or West (W).</li>
                        <li>The lines extend up to <strong>180°</strong> on the opposite side of the Earth.</li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* BOOK PAGE 5 */}
                {currentStep === 4 && (
                  <motion.div key="book4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>Latitude + Longitude</h3>
                      <p>By crossing parallels of latitude and meridians of longitude, we create a <strong>global grid</strong>.</p>
                      <p style={{ marginTop: '12px' }}>Just like the market rows or the chessboard, these two pieces of information allow us to locate any place on Earth exactly!</p>
                      <div style={{ background: '#ecfdf5', border: '2px solid #a7f3d0', padding: '16px', borderRadius: '12px', marginTop: '16px' }}>
                        <h4 style={{ color: 'var(--green)', margin: '0 0 8px 0', fontSize: '15px' }}>Example: Delhi</h4>
                        <p style={{ color: '#065f46', margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
                          The capital of India, Delhi, is located exactly at <strong>29°N</strong> latitude and <strong>77°E</strong> longitude. (Shown as the glowing dot on the globe).
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TASK 1: LATITUDE */}
                {currentStep === 5 && (
                  <motion.div key="task1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>The Parallels of Latitude</h3>
                      <p>Latitude tells us how far North or South of the Equator a place is. These lines run east-west around the globe like belts.</p>
                    </div>
                    <div>
                      <label className="coords-control-label">Move the slider to explore Latitude:</label>
                      <input type="range" style={{ width: '100%', accentColor: 'var(--blue)', height: '10px' }} min="-90" max="90" value={latVal} onChange={e => setLatVal(Number(e.target.value))} />
                    </div>
                    <div className="coords-grid">
                      <div className="coords-fact">
                        <div className="lab l-blue">Current Latitude</div>
                        <div className="v">{Math.abs(latVal)}° {latVal > 0 ? 'N' : latVal < 0 ? 'S' : ''}</div>
                      </div>
                      <div className="coords-fact">
                        <div className="lab l-green">Hemisphere</div>
                        <div className="v">{getHemi(latVal, true)}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TASK 2: LONGITUDE */}
                {currentStep === 6 && (
                  <motion.div key="task2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero">
                      <h3>The Meridians of Longitude</h3>
                      <p>Longitude tells us how far East or West a place is. These lines run from the North Pole to the South Pole.</p>
                    </div>
                    <div>
                      <label className="coords-control-label">Move the slider to explore Longitude:</label>
                      <input type="range" style={{ width: '100%', accentColor: 'var(--blue)', height: '10px' }} min="-180" max="180" value={lonVal} onChange={e => setLonVal(Number(e.target.value))} />
                    </div>
                    <div className="coords-grid">
                      <div className="coords-fact">
                        <div className="lab l-orange">Current Longitude</div>
                        <div className="v">{Math.abs(lonVal)}° {lonVal > 0 ? 'E' : lonVal < 0 ? 'W' : ''}</div>
                      </div>
                      <div className="coords-fact">
                        <div className="lab l-violet">Hemisphere</div>
                        <div className="v">{getHemi(lonVal, false)}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TASK 3: FIND THE PLACE */}
                {currentStep === 7 && (
                  <motion.div key="task3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="coords-task-container">
                    <div className="coords-hero" style={{ padding: 'clamp(12px, 1.5vw, 20px)' }}>
                      <h3>Pinpointing Locations</h3>
                      <p>By crossing latitude and longitude, we create a global grid. Let's practice finding coordinates.</p>
                    </div>

                    {!quizCompleted ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 1.5vw, 20px)', flex: 1 }}>
                        <div style={{ background: 'var(--navy)', color: '#fff', padding: 'clamp(12px, 1.5vw, 20px)', borderRadius: '12px' }}>
                          <div style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: '900', fontFamily: 'var(--serif)' }}>Find Delhi</div>
                          <div style={{ fontSize: '16px', marginTop: '4px', color: '#93c5fd' }}>Target: 29°N, 77°E (Capital of India)</div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ flex: 1 }}>
                            <label className="coords-control-label">Latitude: {gridLat}°</label>
                            <input type="range" style={{ width: '100%', accentColor: '#ef4444', height: '10px' }} min="-90" max="90" value={gridLat} onChange={e => setGridLat(Number(e.target.value))} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label className="coords-control-label">Longitude: {gridLon}°</label>
                            <input type="range" style={{ width: '100%', accentColor: '#fbbf24', height: '10px' }} min="-180" max="180" value={gridLon} onChange={e => setGridLon(Number(e.target.value))} />
                          </div>
                        </div>

                        <button 
                          onClick={checkAnswer}
                          style={{ width: '100%', background: 'var(--blue)', color: '#fff', border: 'none', padding: 'clamp(12px, 1.5vw, 16px)', borderRadius: '12px', fontSize: 'clamp(15px, 1.5vw, 18px)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: 'auto' }}
                        >
                          <Crosshair size={22} /> Confirm Coordinates
                        </button>
                      </div>
                    ) : (
                      <div style={{ background: '#ecfdf5', border: '2px solid #a7f3d0', padding: 'clamp(20px, 2.5vw, 32px)', borderRadius: '16px', textAlign: 'center', margin: 'auto 0' }}>
                        <CheckCircle2 size={56} color="var(--green)" style={{ margin: '0 auto 12px' }} />
                        <h3 style={{ color: 'var(--green)', margin: '0 0 12px 0', fontSize: 'clamp(22px, 2.5vw, 28px)', fontFamily: 'var(--serif)' }}>Excellent Job!</h3>
                        <p style={{ color: '#065f46', margin: 0, fontSize: 'clamp(15px, 1.5vw, 18px)', lineHeight: 1.5 }}>
                          You have successfully located Delhi at 29°N, 77°E using the global grid!
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ============ BOTTOM NAVIGATION (RESERVED SPACE) ============ */}
        <div className="coords-rfoot">
          <div className="coords-pageind" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Map size={20} color="var(--mut)" />
            {currentStep < 5 ? `Page ${currentStep + 1} of 5` : `Step ${currentStep - 4} of 3`}
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {currentStep > 0 && (
              <button className="coords-next" onClick={() => setCurrentStep(t => t - 1)} style={{ background: 'transparent', color: 'var(--navy)', border: '1px solid var(--cardline)' }}>
                <ArrowLeft size={18} /> Previous
              </button>
            )}

            {currentStep < 4 ? (
              <button className="coords-next" onClick={() => setCurrentStep(t => t + 1)}>
                Next Page <ArrowRight size={18} />
              </button>
            ) : currentStep === 4 ? (
              <button className="coords-next" onClick={() => setCurrentStep(5)} style={{ background: 'var(--green)' }}>
                Now let's practice! <ArrowRight size={18} />
              </button>
            ) : currentStep < 7 ? (
              <button className="coords-next" onClick={() => setCurrentStep(t => t + 1)}>
                Next Concept <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                className="coords-next" 
                disabled={!quizCompleted}
                onClick={onNextActivity}
                style={{ opacity: quizCompleted ? 1 : 0.5 }}
              >
                Complete Activity <CheckCircle2 size={18} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
