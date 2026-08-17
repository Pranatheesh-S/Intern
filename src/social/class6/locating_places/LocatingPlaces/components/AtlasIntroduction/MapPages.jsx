import React, { useState, useRef, useEffect } from 'react';
import { Lightbulb, X, Globe2, Image as ImageIcon, Maximize2, Minimize2 } from 'lucide-react';
import physicalImg from './assets/physical-map-v2.jpeg';
import politicalImg from './assets/political.png';
import rainfallImg from './assets/thematic-map.jpeg';
import ContentScrollNav, { useScrollNav } from '../ContentScrollNav';

// The interactive 3D globe (physical / political / thematic modes) lives as a
// static asset so it can be dropped into an iframe from anywhere in the app.
const GLOBE_URL = '/atlas-globe.html';

const globeBtn = {
  width: '34px', height: '34px', borderRadius: '9px',
  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)',
  color: '#eaf0f8', cursor: 'pointer', display: 'grid', placeItems: 'center',
  transition: 'background 0.15s'
};

const PageLayout = ({
  title, subtitle, imageSrc,
  whatIsTitle, whatIs,
  featuresTitle, features,
  colorsTitle, colors,
  whyUseTitle, whyUse,
  remember, funFact,
  imageAspectRatio = '1/1',
  imageScale = 1,
  onFullyViewed,
  globeMode = 'physical',
  globeTheme,
}) => {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isGlobeOpen, setIsGlobeOpen] = useState(false);
  const [isGlobeFull, setIsGlobeFull] = useState(false);
  const [leftPage, setLeftPage] = useState(1);
  const globePanelRef = useRef(null);

  // native full screen where it exists, with a maximise fallback where it doesn't
  const toggleGlobeFull = () => {
    const el = globePanelRef.current;
    if (document.fullscreenElement) { document.exitFullscreen?.(); return; }
    if (el?.requestFullscreen) { el.requestFullscreen().catch(() => setIsGlobeFull(v => !v)); return; }
    setIsGlobeFull(v => !v);
  };

  useEffect(() => {
    const sync = () => setIsGlobeFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  useEffect(() => {
    if (!isGlobeOpen) return;
    const onKey = e => {
      if (e.key !== 'Escape') return;
      if (document.fullscreenElement) return;   // let full screen exit first
      setIsGlobeOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isGlobeOpen]);

  useEffect(() => {
    if (leftPage === 2 && onFullyViewed) {
      onFullyViewed();
    }
  }, [leftPage, onFullyViewed]);

  return (
    <>
      <div style={{ display: 'flex', width: '100%', height: '100%', padding: 0, boxSizing: 'border-box', minHeight: 0 }}>
      
      {/* Left Page (Text) — Zero-scroll, zero-overlap paged structure */}
      <div style={{ flex: '1 1 50%', minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.08)', padding: '1rem 1.25rem', boxSizing: 'border-box', overflow: 'hidden', justifyContent: 'space-between' }}>
        
        {/* Header */}
        <div style={{ flexShrink: 0, marginBottom: '6px' }}>
          <div style={{ fontSize: '12px', color: '#7c5cff', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', marginBottom: '2px', fontFamily: '"IBM Plex Mono", monospace' }}>
            Chapter 1 • Atlas Introduction
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#1e3a8a', margin: '0 0 0.2rem 0', fontFamily: 'serif', lineHeight: 1.15 }}>{title}</h2>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{subtitle}</div>
        </div>

        {/* Page Content Viewport — No scrollbars, pristine spacing */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
          
          {/* PAGE 1 of 2: What is it & Features */}
          {leftPage === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minHeight: 0, justifyContent: 'space-between', overflow: 'hidden' }}>
              {/* What is it? */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 14px', flexShrink: 0 }}>
                <h3 style={{ fontSize: '15px', color: '#1e3a8a', marginBottom: '4px', fontFamily: 'serif', marginTop: 0, fontWeight: 700 }}>{whatIsTitle}</h3>
                {whatIs.map((p, i) => <p key={i} style={{ margin: i > 0 ? '4px 0 0 0' : 0, color: '#334155', fontSize: '13.5px', lineHeight: 1.4, fontWeight: 500 }}>{p}</p>)}
              </div>

              {/* Natural / Key Features — Larger Font, No Scrollbar */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <h3 style={{ fontSize: '15px', color: '#0f172a', marginBottom: '8px', marginTop: 0, flexShrink: 0, fontWeight: 700 }}>{featuresTitle}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', flex: 1, minHeight: 0, overflow: 'hidden', alignContent: 'space-between' }}>
                  {features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#f8fafc', padding: '7px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '1.35rem', lineHeight: 1, flexShrink: 0 }}>{f.icon}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '13.5px', lineHeight: 1.2 }}>{f.title}</div>
                        <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.25, fontWeight: 500 }}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2 of 2: Colors/Symbols & Why Use */}
          {leftPage === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minHeight: 0, justifyContent: 'space-between', overflow: 'hidden' }}>
              {/* Colors / Symbols */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 14px', flexShrink: 0 }}>
                <h3 style={{ fontSize: '15px', color: '#0f172a', marginBottom: '6px', marginTop: 0, fontWeight: 700 }}>{colorsTitle}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {colors.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px' }}>{c.color}</span>
                      <span style={{ fontSize: '13.5px', color: '#334155', fontWeight: 600 }}>{c.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Use & Takeaway */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 14px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '15px', color: '#1e3a8a', marginBottom: '6px', fontFamily: 'serif', marginTop: 0, fontWeight: 700 }}>{whyUseTitle}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {whyUse.map((w, i) => (
                      <div key={i} style={{ background: '#f1f5f9', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '15px' }}>{w.icon}</span>
                        <span style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: 600 }}>{w.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #cbd5e1', color: '#1e3a8a', fontSize: '12.5px', lineHeight: 1.35, fontStyle: 'italic', fontWeight: 600 }}>
                  💡 {funFact}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Sub-Page Navigation Bar */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '6px' }}>
          <button
            onClick={() => setLeftPage(1)}
            disabled={leftPage === 1}
            style={{
              fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '13px',
              background: '#0E3556', color: '#fff', border: 'none', borderRadius: '999px',
              padding: '6px 16px', cursor: leftPage === 1 ? 'not-allowed' : 'pointer',
              opacity: leftPage === 1 ? 0.35 : 1, transition: 'all 0.2s'
            }}
          >
            ◀ Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#0E3556' }}>
            <span>Page {leftPage} of 2</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: leftPage === 1 ? '#0E3556' : '#cbd5e1' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: leftPage === 2 ? '#0E3556' : '#cbd5e1' }} />
          </div>

          <button
            onClick={() => setLeftPage(2)}
            disabled={leftPage === 2}
            style={{
              fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '13px',
              background: '#0E3556', color: '#fff', border: 'none', borderRadius: '999px',
              padding: '6px 16px', cursor: leftPage === 2 ? 'not-allowed' : 'pointer',
              opacity: leftPage === 2 ? 0.35 : 1, transition: 'all 0.2s'
            }}
          >
            Next ▶
          </button>
        </div>

      </div>

      {/* Right Page (Image Activity) — Bottom padding 3.8rem ensures no overlap with AtlasBook footer */}
      <div style={{ flex: '1 1 50%', minWidth: 0, padding: '1rem 1.25rem 3.8rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 0, overflow: 'hidden', boxSizing: 'border-box' }}>
        <div
          onClick={() => setIsGlobeOpen(true)}
          style={{
            cursor: 'pointer',
            width: '100%',
            flex: 1,
            minHeight: 0,
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid #cbd5e1',
            boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            boxSizing: 'border-box'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
        >
           <img
             src={imageSrc}
             alt={title}
             style={{
               maxWidth: '100%',
               maxHeight: '100%',
               objectFit: 'contain',
               borderRadius: '8px',
               display: 'block'
             }}
           />
           <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(14,53,86,0.92)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '13px', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.25)', whiteSpace: 'nowrap' }}>
             <Globe2 size={14} /> Open interactive 3D globe
           </div>
        </div>

        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          <button
            onClick={() => setIsGlobeOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#0E3556', color: '#fff', border: 'none', borderRadius: '999px', padding: '0.4rem 1rem', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
          >
            <Globe2 size={15} /> View on 3D Globe
          </button>
          <span
            onClick={() => setIsImageOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#5c6b7a', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
          >
            <ImageIcon size={14} /> View printed map
          </span>
        </div>
      </div>
    </div>

    <style>{`
      .left-page-scroll::-webkit-scrollbar { width: 6px; }
      .left-page-scroll::-webkit-scrollbar-track { background: transparent; }
      .left-page-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      .left-page-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    `}</style>

    {/* Image Modal */}
    {isImageOpen && (
      <div
        onClick={() => setIsImageOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <button
          onClick={() => setIsImageOpen(false)}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={32} />
        </button>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'relative', background: 'white', padding: '0.5rem', borderRadius: '12px', cursor: 'default', display: 'inline-block' }}
        >
          <img src={imageSrc} alt={title} style={{ maxWidth: '70vw', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px', display: 'block' }} />
        </div>
      </div>
    )}

    {/* 3D Globe Modal */}
    {isGlobeOpen && (
      <div
        onClick={() => setIsGlobeOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(4,8,16,0.86)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 'clamp(10px, 2.2vw, 28px)'
        }}
      >
        <div
          ref={globePanelRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: isGlobeFull ? '100%' : 'min(1400px, 100%)',
            height: isGlobeFull ? '100%' : 'min(880px, 100%)',
            background: '#05070d',
            borderRadius: isGlobeFull ? 0 : '16px',
            overflow: 'hidden',
            cursor: 'default',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: isGlobeFull ? 'none' : '0 30px 80px rgba(0,0,0,0.6)',
            border: isGlobeFull ? 'none' : '1px solid rgba(255,255,255,0.16)'
          }}
        >
          {/* toolbar — the globe's own controls sit at the corners of the canvas,
              so the window controls get their own strip rather than covering them */}
          <div style={{
            flexShrink: 0, height: '46px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: '12px', padding: '0 10px 0 16px',
            background: 'rgba(14,19,30,0.95)', borderBottom: '1px solid rgba(255,255,255,0.10)'
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#eaf0f8', fontSize: '14px', fontWeight: 700, minWidth: 0 }}>
              <Globe2 size={16} color="#6fc4ff" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Interactive 3D Globe — {title}</span>
            </span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <button
                onClick={toggleGlobeFull}
                title={isGlobeFull ? 'Exit full screen' : 'View full screen'}
                aria-label={isGlobeFull ? 'Exit full screen' : 'View full screen'}
                style={globeBtn}
              >
                {isGlobeFull ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button
                onClick={() => { if (document.fullscreenElement) document.exitFullscreen?.(); setIsGlobeOpen(false); }}
                title="Close (Esc)"
                aria-label="Close the globe"
                style={globeBtn}
              >
                <X size={18} />
              </button>
            </span>
          </div>

          <iframe
            title="Interactive 3D Globe"
            src={`${GLOBE_URL}?mode=${globeMode}${globeTheme ? `&theme=${globeTheme}` : ''}&embed=1`}
            style={{ flex: 1, minHeight: 0, width: '100%', border: 'none', display: 'block' }}
            allow="fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    )}
    </>
  );
};

export const PhysicalMapPage = ({ onFullyViewed }) => (
  <PageLayout 
    onFullyViewed={onFullyViewed}
    title="Physical Maps"
    subtitle="Maps that show Earth's natural features"
    imageSrc={physicalImg}
    globeMode="physical"
    callouts={[
      { icon: '🏔', label: 'Mountains', top: '25%', left: '20%' },
      { icon: '🌊', label: 'River', top: '70%', left: '45%' },
      { icon: '🌳', label: 'Forest', top: '75%', left: '80%' },
      { icon: '🏜', label: 'Desert', top: '35%', left: '60%' },
      { icon: '🏞', label: 'Plain', top: '80%', left: '25%' },
      { icon: '⛰', label: 'Plateau', top: '50%', left: '25%' }
    ]}
    whatIs={[
      "A Physical Map shows the natural features of the Earth.",
      "It helps us understand how the land looks without showing roads, cities, or political boundaries."
    ]}
    whatIsTitle="What is a Physical Map?"
    featuresTitle="Natural Features on a Physical Map"
    features={[
      { icon: '🏔', title: 'Mountains', desc: 'High land areas.' },
      { icon: '🏞', title: 'Plains', desc: 'Flat land suitable for farming.' },
      { icon: '🌊', title: 'Rivers', desc: 'Flowing water bodies.' },
      { icon: '🏜', title: 'Deserts', desc: 'Dry areas with very little rainfall.' },
      { icon: '🌳', title: 'Forests', desc: 'Areas covered with many trees.' },
      { icon: '⛰', title: 'Plateaus', desc: 'High flat lands.' }
    ]}
    colorsTitle="Colours Used on Physical Maps"
    colors={[
      { color: '🟢', desc: 'Plains and lowlands' },
      { color: '🟤', desc: 'Mountains and highlands' },
      { color: '🔵', desc: 'Rivers, lakes and oceans' },
      { color: '🟡', desc: 'Plateaus or higher plains' }
    ]}
    whyUseTitle="Why are Physical Maps Useful?"
    whyUse={[
      { icon: '🏕', desc: 'Planning a trip' },
      { icon: '🌾', desc: 'Learning about landforms' },
      { icon: '🏞', desc: 'Understanding rivers and mountains' }
    ]}
    remember={[
      "Physical Maps show Nature.",
      "They help us identify mountains, rivers, plains, forests and deserts."
    ]}
    funFact="The Himalayas appear as brown regions on most physical maps because they are very high mountains."
  />
);

export const PoliticalMapPage = ({ onFullyViewed }) => (
  <PageLayout 
    onFullyViewed={onFullyViewed}
    title="Political Maps"
    subtitle="Maps that show countries, states and boundaries."
    imageSrc={politicalImg}
    globeMode="political"
    callouts={[
      { icon: '📍', label: 'Capital', top: '30%', left: '50%' },
      { icon: '🏙', label: 'City', top: '60%', left: '35%' },
      { icon: '➖', label: 'Boundary', top: '45%', left: '75%' },
      { icon: '🗺', label: 'State', top: '75%', left: '60%' },
      { icon: '🌎', label: 'Country', top: '25%', left: '25%' }
    ]}
    whatIs={[
      "A Political Map shows the boundaries of countries, states, and cities.",
      "It helps us understand administrative regions made by humans."
    ]}
    whatIsTitle="What is a Political Map?"
    featuresTitle="What Can We See?"
    features={[
      { icon: '🌎', title: 'Countries', desc: 'Nations of the world.' },
      { icon: '🗺', title: 'States', desc: 'Regions within a country.' },
      { icon: '📍', title: 'Capitals', desc: 'Centers of government.' },
      { icon: '🏙', title: 'Cities', desc: 'Major human settlements.' },
      { icon: '➖', title: 'Boundaries', desc: 'Lines separating places.' }
    ]}
    colorsTitle="Common Symbols"
    colors={[
      { color: '⭐️', desc: 'Capital city' },
      { color: '⚫️', desc: 'Major city' },
      { color: '➖', desc: 'International boundary' },
      { color: '〰️', desc: 'State boundary' }
    ]}
    whyUseTitle="Why Do We Use Political Maps?"
    whyUse={[
      { icon: '🏫', desc: 'Learning about countries' },
      { icon: '✈️', desc: 'Knowing which state a city is in' },
      { icon: '🗺', desc: 'Understanding borders' }
    ]}
    remember={[
      "Political Maps show places made by people.",
      "They help us locate countries, states, cities and their borders."
    ]}
    funFact="India has 28 states and 8 Union Territories."
  />
);

export const ThematicMapPage = ({ onFullyViewed }) => (
  <PageLayout 
    onFullyViewed={onFullyViewed}
    title="Thematic Maps"
    subtitle="Maps that show one special topic."
    imageSrc={rainfallImg}
    globeMode="thematic"
    globeTheme="rain"
    callouts={[
      { icon: '🌧', label: 'High Rainfall', top: '35%', left: '25%' },
      { icon: '🌤', label: 'Low Rainfall', top: '65%', left: '45%' },
      { icon: '📊', label: 'Legend', top: '80%', left: '80%' }
    ]}
    whatIs={[
      "A Thematic Map focuses on a single topic or theme.",
      "Instead of showing landforms or borders, it shows specific data like weather, population, or crops."
    ]}
    whatIsTitle="What is a Thematic Map?"
    featuresTitle="What Can We Learn?"
    features={[
      { icon: '🌧', title: 'Rainfall', desc: 'How much it rains.' },
      { icon: '🌡', title: 'Temperature', desc: 'How hot or cold it is.' },
      { icon: '👥', title: 'Population', desc: 'Where people live.' },
      { icon: '🌾', title: 'Crops', desc: 'What grows where.' },
      { icon: '🌳', title: 'Forests', desc: 'Types of vegetation.' }
    ]}
    colorsTitle="Colours and Legends"
    colors={[
      { color: '📊', desc: 'Legends explain the colors used.' },
      { color: '🟦', desc: 'Dark blue might mean heavy rain.' },
      { color: '🟨', desc: 'Yellow might mean low rain.' },
      { color: '🔴', desc: 'Red might mean high temperature.' }
    ]}
    whyUseTitle="Why Do We Use Thematic Maps?"
    whyUse={[
      { icon: '☔️', desc: 'Understanding climate' },
      { icon: '📈', desc: 'Seeing where most people live' },
      { icon: '🚜', desc: 'Finding the best places to farm' }
    ]}
    remember={[
      "One map, one main idea.",
      "Thematic maps use colors and legends to explain specific data."
    ]}
    funFact="A rainfall map and a population map of the same place can look completely different because each focuses on a different topic."
  />
);
