import React, { useState, useRef, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';
import physicalImg from './assets/physical-map-v2.jpeg';
import politicalImg from './assets/political.png';
import rainfallImg from './assets/thematic-map.jpeg';
import ContentScrollNav, { useScrollNav } from '../ContentScrollNav';

const PageLayout = ({ 
  title, subtitle, imageSrc,
  whatIsTitle, whatIs, 
  featuresTitle, features, 
  colorsTitle, colors, 
  whyUseTitle, whyUse, 
  remember, funFact,
  imageAspectRatio = '1/1',
  imageScale = 1,
  onFullyViewed
}) => {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const scrollRef = useRef(null);
  const nav = useScrollNav(scrollRef);

  useEffect(() => {
    if (!onFullyViewed) return;
    const el = scrollRef.current;
    if (!el) return;

    const checkFullyViewed = () => {
      const { scrollHeight, clientHeight, scrollTop } = el;
      if (scrollHeight <= clientHeight + 4) {
        onFullyViewed();
        return;
      }
      if (scrollTop + clientHeight >= scrollHeight - 12) {
        onFullyViewed();
      }
    };

    checkFullyViewed();
    el.addEventListener('scroll', checkFullyViewed, { passive: true });
    const ro = new ResizeObserver(checkFullyViewed);
    ro.observe(el);
    Array.from(el.children).forEach(child => ro.observe(child));
    return () => {
      el.removeEventListener('scroll', checkFullyViewed);
      ro.disconnect();
    };
  }, [onFullyViewed]);

  return (
    <>
      <div style={{ display: 'flex', width: '100%', height: '100%', padding: 0, boxSizing: 'border-box', minHeight: 0 }}>
      
      {/* Left Page (Text) — scrollable with Back to top / Bottom nav */}
      <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.08)' }}>
        <div
          ref={scrollRef}
          className="left-page-scroll"
          style={{ flex: 1, minHeight: 0, padding: '1.25rem 1.5rem 0.5rem', overflowY: 'auto', overflowX: 'hidden' }}
        >
        {/* Header */}
        <div style={{ fontSize: '10px', color: '#7c5cff', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', marginBottom: '6px', fontFamily: '"IBM Plex Mono", monospace' }}>
          Chapter 1 • Atlas Introduction
        </div>
        <h2 style={{ fontSize: '2.2rem', color: '#1e3a8a', margin: '0 0 0.3rem 0', fontFamily: 'serif' }}>{title}</h2>
        <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1.2rem', fontWeight: 500 }}>{subtitle}</div>

        {/* What is it? */}
        <div style={{ marginBottom: '1.2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#1e3a8a', marginBottom: '0.5rem', fontFamily: 'serif', marginTop: 0 }}>{whatIsTitle}</h3>
          {whatIs.map((p, i) => <p key={i} style={{ margin: '0 0 0.5rem 0', color: '#334155', fontSize: '0.95rem', lineHeight: 1.5 }}>{p}</p>)}
        </div>

        {/* Natural Features */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', marginBottom: '1.2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.8rem', marginTop: 0 }}>{featuresTitle}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px' }}>
                <div style={{ fontSize: '1.2rem', lineHeight: 1 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1e3a8a', fontSize: '0.9rem', marginBottom: '2px' }}>{f.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.2 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', marginBottom: '1.2rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.8rem', marginTop: 0 }}>{colorsTitle}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {colors.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1rem' }}>{c.color}</span>
                <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Use */}
        <div style={{ marginBottom: '1.2rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#1e3a8a', marginBottom: '0.8rem', fontFamily: 'serif', marginTop: 0 }}>{whyUseTitle}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {whyUse.map((w, i) => (
              <div key={i} style={{ background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1rem' }}>{w.icon}</span>
                <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>{w.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Remember */}
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '10px', marginBottom: '1.2rem' }}>
          <h4 style={{ color: '#059669', margin: '0 0 6px 0', fontSize: '1rem' }}>Remember</h4>
          {remember.map((r, i) => <p key={i} style={{ margin: '0 0 4px 0', color: '#064e3b', fontSize: '0.9rem', fontWeight: 500 }}>{r}</p>)}
        </div>

        {/* Fun Fact */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb', margin: '0 0 6px 0', fontSize: '0.95rem' }}>
            <Lightbulb size={16} /> Did You Know?
          </h4>
          <p style={{ margin: 0, color: '#1e3a8a', fontSize: '0.85rem', lineHeight: 1.4 }}>{funFact}</p>
        </div>

        </div>

        {nav.hasOverflow && (
          <ContentScrollNav
            currentPage={nav.currentPage}
            pageCount={nav.pageCount}
            canGoUp={nav.canGoUp}
            canGoDown={nav.canGoDown}
            onPageUp={nav.onPageUp}
            onPageDown={nav.onPageDown}
          />
        )}
      </div>

      {/* Right Page (Image Activity) */}
      <div style={{ flex: 1, minWidth: 0, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div 
          onClick={() => setIsImageOpen(true)}
          style={{ cursor: 'pointer', width: '100%', aspectRatio: imageAspectRatio, position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
           <img src={imageSrc} alt={title} style={{ width: '100%', height: '100%', objectFit: 'contain', transform: `scale(${imageScale})` }} />
        </div>
        <span style={{ marginTop: '0.75rem', color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic' }}>
          Click the image to expand
        </span>
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
    </>
  );
};

export const PhysicalMapPage = ({ onFullyViewed }) => (
  <PageLayout 
    onFullyViewed={onFullyViewed}
    title="Physical Maps"
    subtitle="Maps that show Earth's natural features"
    imageSrc={physicalImg}
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
