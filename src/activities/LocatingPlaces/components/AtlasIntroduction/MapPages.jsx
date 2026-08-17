import React, { useState } from 'react';
import { Lightbulb, X, Maximize2 } from 'lucide-react';
import physicalImg from './assets/physical-map-v2.jpeg';
import politicalImg from './assets/political.png';
import rainfallImg from './assets/thematic-map.jpeg';

// Base layout component for a two-page spread (Left Text, Right Visual)
// NO INTERNAL SCROLLBARS - EVERYTHING FITS FLUSH IN PRESENTATION VIEWPORT
const SinglePageSpread = ({ 
  eyebrow = "Chapter 1 • Atlas",
  title, 
  subtitle, 
  leftContent,
  imageSrc,
  imageAlt = "Map Visual",
  callouts = []
}) => {
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <>
      <div style={{ 
        display: 'flex', 
        width: '100%', 
        height: '100%', 
        padding: 0, 
        boxSizing: 'border-box', 
        minHeight: 0,
        overflow: 'hidden' 
      }}>
      
        {/* LEFT PAGE (Text & Educational Content) */}
        <div style={{ 
          flex: '1 1 50%', 
          minWidth: 0, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          padding: 'clamp(0.85rem, 1.8vh, 1.35rem) clamp(1rem, 1.8vw, 1.5rem)', 
          borderRight: '1px solid rgba(0,0,0,0.08)',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          <div>
            <div style={{ 
              fontSize: 'clamp(10px, 0.9vw, 11px)', 
              color: '#7c5cff', 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              fontWeight: 'bold', 
              marginBottom: '4px', 
              fontFamily: '"IBM Plex Mono", monospace' 
            }}>
              {eyebrow}
            </div>
            <h2 style={{ 
              fontSize: 'clamp(1.4rem, 2vw, 1.95rem)', 
              color: '#1e3a8a', 
              margin: '0 0 0.2rem 0', 
              fontFamily: 'serif', 
              lineHeight: 1.1 
            }}>
              {title}
            </h2>
            <div style={{ 
              fontSize: 'clamp(0.85rem, 1vw, 0.98rem)', 
              color: '#64748b', 
              marginBottom: '0.65rem', 
              fontWeight: 500, 
              lineHeight: 1.35 
            }}>
              {subtitle}
            </div>
          </div>

          <div style={{ 
            flex: 1, 
            minHeight: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-around',
            overflow: 'hidden'
          }}>
            {leftContent}
          </div>
        </div>

        {/* RIGHT PAGE (Image Visual & Callouts) */}
        <div style={{ 
          flex: '1 1 50%', 
          minWidth: 0, 
          height: '100%', 
          padding: 'clamp(0.85rem, 1.8vh, 1.35rem) clamp(1rem, 1.8vw, 1.5rem)', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          <div 
            onClick={() => setIsImageOpen(true)}
            style={{ 
              cursor: 'pointer', 
              width: '100%', 
              height: '86%', 
              position: 'relative', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              border: '1px solid rgba(0,0,0,0.1)', 
              boxShadow: '0 4px 18px rgba(0,0,0,0.06)', 
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s' 
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.01)';
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(0,0,0,0.12)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.06)';
            }}
          >
            <img 
              src={imageSrc} 
              alt={imageAlt} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                display: 'block' 
              }} 
            />

            {/* Interactive Callout Badges */}
            {callouts.map((c, i) => (
              <div 
                key={i}
                style={{
                  position: 'absolute',
                  top: c.top,
                  left: c.left,
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(4px)',
                  padding: '3px 8px',
                  borderRadius: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: 'clamp(0.72rem, 0.85vw, 0.8rem)',
                  fontWeight: 'bold',
                  color: '#1e3a8a',
                  border: '1px solid rgba(30, 58, 138, 0.15)',
                  pointerEvents: 'none'
                }}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </div>
            ))}

            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              background: 'rgba(15, 23, 42, 0.65)',
              color: 'white',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backdropFilter: 'blur(4px)'
            }}>
              <Maximize2 size={12} /> Expand
            </div>
          </div>
          <span style={{ marginTop: '0.4rem', color: '#64748b', fontSize: 'clamp(0.78rem, 0.88vw, 0.85rem)', fontStyle: 'italic' }}>
            Click image to expand view
          </span>
        </div>
      </div>

      {/* Image Modal for Fullscreen View */}
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
            style={{ 
              position: 'absolute', top: '20px', right: '20px', 
              background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', 
              cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', 
              zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}
          >
            <X size={32} />
          </button>
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              position: 'relative', background: 'white', padding: '0.5rem', 
              borderRadius: '12px', cursor: 'default', display: 'inline-block' 
            }}
          >
            <img 
              src={imageSrc} 
              alt={imageAlt} 
              style={{ maxWidth: '80vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px', display: 'block' }} 
            />
          </div>
        </div>
      )}
    </>
  );
};

// ============================================================================
// PHYSICAL MAPS PAGES (PAGES 1, 2, 3)
// ============================================================================

export const PhysicalMapPage1 = () => (
  <SinglePageSpread 
    title="Physical Maps"
    subtitle="Maps that show Earth's natural features"
    imageSrc={physicalImg}
    imageAlt="Physical Map of India showing landforms"
    callouts={[
      { icon: '🏔', label: 'Mountains', top: '22%', left: '25%' },
      { icon: '🌊', label: 'Rivers', top: '55%', left: '48%' },
      { icon: '🏞', label: 'Plains', top: '75%', left: '30%' }
    ]}
    leftContent={
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #1e3a8a' }}>
          <h3 style={{ fontSize: 'clamp(1.05rem, 1.2vw, 1.2rem)', color: '#1e3a8a', margin: '0 0 0.5rem 0', fontFamily: 'serif' }}>
            What is a Physical Map?
          </h3>
          <p style={{ margin: '0 0 0.5rem 0', color: '#334155', fontSize: 'clamp(0.9rem, 1vw, 1rem)', lineHeight: 1.5 }}>
            A Physical Map shows the natural features of the Earth.
          </p>
          <p style={{ margin: 0, color: '#334155', fontSize: 'clamp(0.9rem, 1vw, 1rem)', lineHeight: 1.5 }}>
            It helps us understand how the land looks without showing roads, cities, or political boundaries.
          </p>
        </div>

        <div style={{ background: '#e0f2fe', padding: '0.9rem 1.1rem', borderRadius: '10px', border: '1px solid #bae6fd' }}>
          <h4 style={{ color: '#0369a1', margin: '0 0 0.35rem 0', fontSize: 'clamp(0.95rem, 1.05vw, 1.05rem)' }}>
            Key Idea
          </h4>
          <p style={{ margin: 0, color: '#0c4a6e', fontSize: 'clamp(0.88rem, 0.95vw, 0.95rem)', lineHeight: 1.45 }}>
            Physical maps illustrate natural geography created by Earth—such as elevation, water bodies, and terrain.
          </p>
        </div>
      </div>
    }
  />
);

export const PhysicalMapPage2 = () => (
  <SinglePageSpread 
    title="Physical Maps"
    subtitle="Natural Features on a Physical Map"
    imageSrc={physicalImg}
    imageAlt="Physical features on map"
    callouts={[
      { icon: '🏜', label: 'Desert', top: '35%', left: '20%' },
      { icon: '⛰', label: 'Plateau', top: '55%', left: '42%' },
      { icon: '🌳', label: 'Forest', top: '75%', left: '70%' }
    ]}
    leftContent={
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: 'clamp(1rem, 1.1vw, 1.1rem)', color: '#0f172a', margin: '0 0 0.65rem 0' }}>
          Natural Features Shown:
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
          {[
            { icon: '🏔', title: 'Mountains', desc: 'High land areas.' },
            { icon: '🏞', title: 'Plains', desc: 'Flat land suitable for farming.' },
            { icon: '🌊', title: 'Rivers', desc: 'Flowing water bodies.' },
            { icon: '🏜', title: 'Deserts', desc: 'Dry areas with very little rainfall.' },
            { icon: '🌳', title: 'Forests', desc: 'Areas covered with many trees.' },
            { icon: '⛰', title: 'Plateaus', desc: 'High flat lands.' }
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', background: '#f8fafc', padding: '6px 8px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '1.2rem', lineHeight: 1 }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#1e3a8a', fontSize: 'clamp(0.85rem, 0.95vw, 0.92rem)', marginBottom: '1px' }}>{f.title}</div>
                <div style={{ fontSize: 'clamp(0.78rem, 0.85vw, 0.85rem)', color: '#475569', lineHeight: 1.25 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    }
  />
);

export const PhysicalMapPage3 = () => (
  <SinglePageSpread 
    title="Physical Maps"
    subtitle="Colours Used & Why They Are Useful"
    imageSrc={physicalImg}
    imageAlt="Colors on physical map"
    leftContent={
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {/* Colours */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
          <h4 style={{ fontSize: 'clamp(0.92rem, 1vw, 1rem)', color: '#0f172a', margin: '0 0 0.4rem 0' }}>Colours Used on Physical Maps:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            {[
              { color: '🟢', desc: 'Plains and lowlands' },
              { color: '🟤', desc: 'Mountains and highlands' },
              { color: '🔵', desc: 'Rivers, lakes and oceans' },
              { color: '🟡', desc: 'Plateaus or higher plains' }
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'clamp(0.8rem, 0.88vw, 0.88rem)', color: '#334155' }}>
                <span>{c.color}</span> <span>{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Use */}
        <div style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
          <h4 style={{ fontSize: 'clamp(0.92rem, 1vw, 1rem)', color: '#1e3a8a', margin: '0 0 0.4rem 0' }}>Why Are Physical Maps Useful?</h4>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { icon: '🏕', desc: 'Planning a trip' },
              { icon: '🌾', desc: 'Learning landforms' },
              { icon: '🏞', desc: 'Understanding rivers' }
            ].map((w, i) => (
              <div key={i} style={{ flex: 1, background: '#fff', padding: '5px 6px', borderRadius: '6px', textAlign: 'center', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '1rem', display: 'block' }}>{w.icon}</span>
                <span style={{ fontSize: 'clamp(0.75rem, 0.82vw, 0.82rem)', color: '#1e293b', fontWeight: 600 }}>{w.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Remember & Fact */}
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.6rem 0.85rem', borderRadius: '8px' }}>
          <h4 style={{ color: '#059669', margin: '0 0 3px 0', fontSize: 'clamp(0.85rem, 0.92vw, 0.92rem)' }}>Remember</h4>
          <p style={{ margin: '0 0 3px 0', color: '#064e3b', fontSize: 'clamp(0.8rem, 0.88vw, 0.88rem)', fontWeight: 500 }}>
            Physical Maps show Nature. They help us identify mountains, rivers, plains, forests and deserts.
          </p>
          <div style={{ fontSize: 'clamp(0.78rem, 0.85vw, 0.85rem)', color: '#047857', display: 'flex', alignItems: 'center', gap: '4px', fontStyle: 'italic', marginTop: '3px' }}>
            <Lightbulb size={14} /> Did You Know? The Himalayas appear brown because they are very high mountains.
          </div>
        </div>
      </div>
    }
  />
);

// ============================================================================
// POLITICAL MAPS PAGES (PAGES 4, 5, 6)
// ============================================================================

export const PoliticalMapPage1 = () => (
  <SinglePageSpread 
    title="Political Maps"
    subtitle="Maps that show countries, states and boundaries."
    imageSrc={politicalImg}
    imageAlt="Political Map of India"
    callouts={[
      { icon: '📍', label: 'Capital City', top: '30%', left: '42%' },
      { icon: '➖', label: 'State Boundary', top: '50%', left: '60%' }
    ]}
    leftContent={
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #1e3a8a' }}>
          <h3 style={{ fontSize: 'clamp(1.05rem, 1.2vw, 1.2rem)', color: '#1e3a8a', margin: '0 0 0.5rem 0', fontFamily: 'serif' }}>
            What is a Political Map?
          </h3>
          <p style={{ margin: '0 0 0.5rem 0', color: '#334155', fontSize: 'clamp(0.9rem, 1vw, 1rem)', lineHeight: 1.5 }}>
            A Political Map shows the boundaries of countries, states, and cities.
          </p>
          <p style={{ margin: 0, color: '#334155', fontSize: 'clamp(0.9rem, 1vw, 1rem)', lineHeight: 1.5 }}>
            It helps us understand administrative regions made by humans.
          </p>
        </div>

        <div style={{ background: '#e0f2fe', padding: '0.9rem 1.1rem', borderRadius: '10px', border: '1px solid #bae6fd' }}>
          <h4 style={{ color: '#0369a1', margin: '0 0 0.35rem 0', fontSize: 'clamp(0.95rem, 1.05vw, 1.05rem)' }}>
            Key Idea
          </h4>
          <p style={{ margin: 0, color: '#0c4a6e', fontSize: 'clamp(0.88rem, 0.95vw, 0.95rem)', lineHeight: 1.45 }}>
            Political maps focus on human geography—showing where one nation or state ends and another begins.
          </p>
        </div>
      </div>
    }
  />
);

export const PoliticalMapPage2 = () => (
  <SinglePageSpread 
    title="Political Maps"
    subtitle="What Can We See?"
    imageSrc={politicalImg}
    imageAlt="Political features on map"
    callouts={[
      { icon: '🌎', label: 'Country', top: '25%', left: '25%' },
      { icon: '🏙', label: 'Major City', top: '65%', left: '35%' },
      { icon: '🗺', label: 'State', top: '75%', left: '60%' }
    ]}
    leftContent={
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: 'clamp(1rem, 1.1vw, 1.1rem)', color: '#0f172a', margin: '0 0 0.65rem 0' }}>
          What Can We See on Political Maps:
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { icon: '🌎', title: 'Countries', desc: 'Nations of the world.' },
            { icon: '🗺', title: 'States', desc: 'Regions within a country.' },
            { icon: '📍', title: 'Capitals', desc: 'Centers of government.' },
            { icon: '🏙', title: 'Cities', desc: 'Major human settlements.' },
            { icon: '➖', title: 'Boundaries', desc: 'Lines separating places.' }
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '1.15rem', lineHeight: 1 }}>{f.icon}</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 'bold', color: '#1e3a8a', fontSize: 'clamp(0.85rem, 0.95vw, 0.92rem)' }}>{f.title}:</span>
                <span style={{ fontSize: 'clamp(0.8rem, 0.88vw, 0.88rem)', color: '#475569' }}>{f.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    }
  />
);

export const PoliticalMapPage3 = () => (
  <SinglePageSpread 
    title="Political Maps"
    subtitle="Symbols Used & Why They Are Useful"
    imageSrc={politicalImg}
    imageAlt="Political map symbols"
    leftContent={
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {/* Common Symbols */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
          <h4 style={{ fontSize: 'clamp(0.92rem, 1vw, 1rem)', color: '#0f172a', margin: '0 0 0.4rem 0' }}>Common Symbols:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            {[
              { color: '⭐️', desc: 'Capital city' },
              { color: '⚫️', desc: 'Major city' },
              { color: '➖', desc: 'International boundary' },
              { color: '〰️', desc: 'State boundary' }
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'clamp(0.8rem, 0.88vw, 0.88rem)', color: '#334155' }}>
                <span>{c.color}</span> <span>{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Use */}
        <div style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
          <h4 style={{ fontSize: 'clamp(0.92rem, 1vw, 1rem)', color: '#1e3a8a', margin: '0 0 0.4rem 0' }}>Why Do We Use Political Maps?</h4>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { icon: '🏫', desc: 'Learning countries' },
              { icon: '✈️', desc: 'Locating states' },
              { icon: '🗺', desc: 'Understanding borders' }
            ].map((w, i) => (
              <div key={i} style={{ flex: 1, background: '#fff', padding: '5px 6px', borderRadius: '6px', textAlign: 'center', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '1rem', display: 'block' }}>{w.icon}</span>
                <span style={{ fontSize: 'clamp(0.75rem, 0.82vw, 0.82rem)', color: '#1e293b', fontWeight: 600 }}>{w.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Remember & Fact */}
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.6rem 0.85rem', borderRadius: '8px' }}>
          <h4 style={{ color: '#059669', margin: '0 0 3px 0', fontSize: 'clamp(0.85rem, 0.92vw, 0.92rem)' }}>Remember</h4>
          <p style={{ margin: '0 0 3px 0', color: '#064e3b', fontSize: 'clamp(0.8rem, 0.88vw, 0.88rem)', fontWeight: 500 }}>
            Political Maps show places made by people. They help us locate countries, states, cities and their borders.
          </p>
          <div style={{ fontSize: 'clamp(0.78rem, 0.85vw, 0.85rem)', color: '#047857', display: 'flex', alignItems: 'center', gap: '4px', fontStyle: 'italic', marginTop: '3px' }}>
            <Lightbulb size={14} /> Did You Know? India has 28 states and 8 Union Territories.
          </div>
        </div>
      </div>
    }
  />
);

// ============================================================================
// THEMATIC MAPS PAGES (PAGES 7, 8, 9)
// ============================================================================

export const ThematicMapPage1 = () => (
  <SinglePageSpread 
    title="Thematic Maps"
    subtitle="Maps that show one special topic."
    imageSrc={rainfallImg}
    imageAlt="Thematic Rainfall Map"
    callouts={[
      { icon: '🌧', label: 'High Rainfall', top: '35%', left: '25%' },
      { icon: '🌤', label: 'Low Rainfall', top: '65%', left: '45%' }
    ]}
    leftContent={
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #1e3a8a' }}>
          <h3 style={{ fontSize: 'clamp(1.05rem, 1.2vw, 1.2rem)', color: '#1e3a8a', margin: '0 0 0.5rem 0', fontFamily: 'serif' }}>
            What is a Thematic Map?
          </h3>
          <p style={{ margin: '0 0 0.5rem 0', color: '#334155', fontSize: 'clamp(0.9rem, 1vw, 1rem)', lineHeight: 1.5 }}>
            A Thematic Map focuses on a single topic or theme.
          </p>
          <p style={{ margin: 0, color: '#334155', fontSize: 'clamp(0.9rem, 1vw, 1rem)', lineHeight: 1.5 }}>
            Instead of showing landforms or borders, it shows specific data like weather, population, or crops.
          </p>
        </div>

        <div style={{ background: '#e0f2fe', padding: '0.9rem 1.1rem', borderRadius: '10px', border: '1px solid #bae6fd' }}>
          <h4 style={{ color: '#0369a1', margin: '0 0 0.35rem 0', fontSize: 'clamp(0.95rem, 1.05vw, 1.05rem)' }}>
            Key Idea
          </h4>
          <p style={{ margin: 0, color: '#0c4a6e', fontSize: 'clamp(0.88rem, 0.95vw, 0.95rem)', lineHeight: 1.45 }}>
            One map, one specific topic! Thematic maps present targeted geographical information clearly.
          </p>
        </div>
      </div>
    }
  />
);

export const ThematicMapPage2 = () => (
  <SinglePageSpread 
    title="Thematic Maps"
    subtitle="What Can We Learn?"
    imageSrc={rainfallImg}
    imageAlt="Thematic map topics"
    callouts={[
      { icon: '📊', label: 'Map Legend', top: '80%', left: '70%' }
    ]}
    leftContent={
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: 'clamp(1rem, 1.1vw, 1.1rem)', color: '#0f172a', margin: '0 0 0.65rem 0' }}>
          What Can We Learn from Thematic Maps:
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { icon: '🌧', title: 'Rainfall', desc: 'How much it rains.' },
            { icon: '🌡', title: 'Temperature', desc: 'How hot or cold it is.' },
            { icon: '👥', title: 'Population', desc: 'Where people live.' },
            { icon: '🌾', title: 'Crops', desc: 'What grows where.' },
            { icon: '🌳', title: 'Forests', desc: 'Types of vegetation.' }
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '1.15rem', lineHeight: 1 }}>{f.icon}</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 'bold', color: '#1e3a8a', fontSize: 'clamp(0.85rem, 0.95vw, 0.92rem)' }}>{f.title}:</span>
                <span style={{ fontSize: 'clamp(0.8rem, 0.88vw, 0.88rem)', color: '#475569' }}>{f.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    }
  />
);

export const ThematicMapPage3 = () => (
  <SinglePageSpread 
    title="Thematic Maps"
    subtitle="Colours, Legends & Why They Are Useful"
    imageSrc={rainfallImg}
    imageAlt="Thematic map legends and colors"
    leftContent={
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {/* Colours and Legends */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
          <h4 style={{ fontSize: 'clamp(0.92rem, 1vw, 1rem)', color: '#0f172a', margin: '0 0 0.4rem 0' }}>Colours and Legends:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            {[
              { color: '📊', desc: 'Legends explain colors' },
              { color: '🟦', desc: 'Dark blue = Heavy rain' },
              { color: '🟨', desc: 'Yellow = Low rain' },
              { color: '🔴', desc: 'Red = High temp' }
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'clamp(0.8rem, 0.88vw, 0.88rem)', color: '#334155' }}>
                <span>{c.color}</span> <span>{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Use */}
        <div style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
          <h4 style={{ fontSize: 'clamp(0.92rem, 1vw, 1rem)', color: '#1e3a8a', margin: '0 0 0.4rem 0' }}>Why Do We Use Thematic Maps?</h4>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { icon: '☔️', desc: 'Climate patterns' },
              { icon: '📈', desc: 'Population density' },
              { icon: '🚜', desc: 'Farming zones' }
            ].map((w, i) => (
              <div key={i} style={{ flex: 1, background: '#fff', padding: '5px 6px', borderRadius: '6px', textAlign: 'center', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '1rem', display: 'block' }}>{w.icon}</span>
                <span style={{ fontSize: 'clamp(0.75rem, 0.82vw, 0.82rem)', color: '#1e293b', fontWeight: 600 }}>{w.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Remember & Fact */}
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.6rem 0.85rem', borderRadius: '8px' }}>
          <h4 style={{ color: '#059669', margin: '0 0 3px 0', fontSize: 'clamp(0.85rem, 0.92vw, 0.92rem)' }}>Remember</h4>
          <p style={{ margin: '0 0 3px 0', color: '#064e3b', fontSize: 'clamp(0.8rem, 0.88vw, 0.88rem)', fontWeight: 500 }}>
            One map, one main idea. Thematic maps use colors and legends to explain specific data.
          </p>
          <div style={{ fontSize: 'clamp(0.78rem, 0.85vw, 0.85rem)', color: '#047857', display: 'flex', alignItems: 'center', gap: '4px', fontStyle: 'italic', marginTop: '3px' }}>
            <Lightbulb size={14} /> Did You Know? A rainfall map and population map look different because each focuses on a different topic.
          </div>
        </div>
      </div>
    }
  />
);
