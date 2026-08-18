import React, { useState, useEffect } from 'react';
import { Map, MapPin, Clock, Compass, Globe2, ChevronRight, ChevronLeft, Maximize2, X } from 'lucide-react';
import compassMapImg from './assets/CompassMap.jpg';
import ChapterBackFooter from '../ChapterBackFooter';
import RotatingCompass from './RotatingCompass';

const PAGE_PADDING = 'clamp(20px, 2.6vw, 42px)';
const HEADER_TITLE_STYLE = {
  fontSize: 'clamp(1.75rem, 2.8vw, 2.6rem)',
  color: '#78350F',
  margin: 0,
  fontFamily: '"Fraunces", serif',
  fontWeight: 900,
  lineHeight: 1.15
};

export default function BigQuestionsPage({ onBack, onMissionUnlock, onBeginChapter }) {
  const [activeCardId, setActiveCardId] = useState('maps');
  const [discoveredCards, setDiscoveredCards] = useState(['maps']);
  const [artZoomed, setArtZoomed] = useState(false);

  useEffect(() => {
    if (!artZoomed) return;
    const onKey = e => { if (e.key === 'Escape') setArtZoomed(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [artZoomed]);

  const handleCardClick = (id) => {
    setActiveCardId(prev => prev === id ? null : id);
    if (!discoveredCards.includes(id)) {
      const nextDiscovered = [...discoveredCards, id];
      setDiscoveredCards(nextDiscovered);
      if (nextDiscovered.length === 3 && onMissionUnlock) {
        onMissionUnlock();
      }
    }
  };

  const cards = [
    {
      id: 'maps',
      title: 'Maps',
      icon: Map,
      color: '#D97706',
      bgLight: '#FEF3C7',
      bgClosed: '#FFFFFF',
      bgOpen: '#FFF9F0',
      borderColor: '#F2DFBC',
      question: 'What is a map and how do we use it? What are its main components?',
      hint: "You'll learn about: Maps • Symbols • Directions • Scale",
      hintColor: '#92400E',
      hintBg: '#FEF3C7'
    },
    {
      id: 'coordinates',
      title: 'Coordinates',
      icon: MapPin,
      color: '#7C3AED',
      bgLight: '#F3E8FF',
      bgClosed: '#FFFFFF',
      bgOpen: '#FFF9F0',
      borderColor: '#F2DFBC',
      question: 'What are coordinates? How can latitude and longitude be used to mark any location on the Earth?',
      hint: "You'll learn about: Latitude • Longitude • Globe",
      hintColor: '#5B21B6',
      hintBg: '#EDE9FE'
    },
    {
      id: 'time',
      title: 'Time',
      icon: Clock,
      color: '#16A34A',
      bgLight: '#DCFCE7',
      bgClosed: '#FFFFFF',
      bgOpen: '#FFF9F0',
      borderColor: '#F2DFBC',
      question: 'How are local time and standard time related to longitude?',
      hint: "You'll learn about: Time Zones • Standard Time",
      hintColor: '#166534',
      hintBg: '#DCFCE7'
    }
  ];

  const columnShell = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    minWidth: 0,
    background: 'linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%)',
    boxSizing: 'border-box'
  };

  const headerShell = {
    flexShrink: 0,
    padding: '16px 24px 12px',
    borderBottom: '1.5px solid #F2DFBC',
    display: 'flex',
    alignItems: 'flex-end',
    boxSizing: 'border-box'
  };

  const bodyShell = {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: '14px 20px',
    boxSizing: 'border-box',
    justifyContent: 'space-between',
    overflow: 'hidden'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        flex: 1,
        minHeight: 0,
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* LEFT COLUMN — Matching Page 2 Left Blueprint Styling */}
        <div style={{
          ...columnShell,
          background: 'linear-gradient(160deg, #F7F1E2 0%, #EFE6D2 100%)',
          borderRight: '2px solid #F2DFBC',
          position: 'relative'
        }}>
          <Compass size={120} color="#b45309" style={{ position: 'absolute', top: '18%', right: '5%', opacity: 0.08, pointerEvents: 'none' }} />
          <Globe2 size={150} color="#b45309" style={{ position: 'absolute', bottom: '8%', left: '-4%', opacity: 0.08, pointerEvents: 'none' }} />

          <div style={{ ...headerShell, borderBottom: '1.5px solid #F2DFBC' }}>
            <h2 style={HEADER_TITLE_STYLE}>Every Place Has an Address</h2>
          </div>

          <div style={{ ...bodyShell, position: 'relative', zIndex: 1, gap: '14px' }}>
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #F2DFBC',
              borderRadius: '16px',
              padding: '14px 18px',
              boxShadow: '0 4px 14px rgba(60,40,20,0.05)',
              flexShrink: 0
            }}>
              <p style={{ fontSize: '15px', color: '#3D2E24', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                Your home has an address, and so does every place on Earth. In this chapter you will learn how maps locate places, how latitude and longitude give each one an exact address, and why the time on the clock changes as you travel.
              </p>
            </div>

            <div style={{ flex: 1, minHeight: 0, display: 'flex', alignSelf: 'stretch', width: '100%' }}>
              <RotatingCompass />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={columnShell}>
          <div style={headerShell}>
            <h2 style={HEADER_TITLE_STYLE}>What Will We Discover?</h2>
          </div>

          <div style={bodyShell}>
            {/* Accordion Concept Cards — Differentiated Color Schemes */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden' }}>
              {cards.map((card) => {
                const isOpen = activeCardId === card.id;

                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    style={{
                      background: isOpen ? card.bgOpen : card.bgClosed,
                      border: isOpen ? `2px solid ${card.color}` : `1.5px solid ${card.borderColor}`,
                      borderLeft: `6px solid ${card.color}`,
                      padding: '14px 18px',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: isOpen ? '10px' : '0px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isOpen ? '0 4px 14px rgba(60,40,20,0.08)' : '0 2px 6px rgba(60,40,20,0.03)',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          background: card.bgLight,
                          color: card.color,
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <card.icon size={20} />
                        </div>
                        <h4 style={{ margin: 0, color: '#78350F', fontSize: '19px', fontWeight: 900, lineHeight: 1.2, fontFamily: '"Fraunces", serif' }}>
                          {card.title}
                        </h4>
                      </div>

                      <span style={{ fontSize: '13.5px', color: card.color, display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, flexShrink: 0, fontFamily: '"Space Grotesk", sans-serif' }}>
                        {isOpen ? 'Click to collapse' : 'Click to discover'}
                        <ChevronRight size={18} style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </span>
                    </div>

                    {isOpen && (
                      <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <p style={{ margin: 0, color: '#3D2E24', fontSize: '14.5px', lineHeight: 1.5, fontWeight: 600 }}>
                          {card.question}
                        </p>
                        <div>
                          <span style={{ background: card.hintBg, color: card.hintColor, display: 'inline-block', padding: '5px 12px', borderRadius: '8px', fontSize: '13.5px', fontWeight: 800 }}>
                            {card.hint}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mission Box — Matching Warm Cream Palette */}
            <div style={{ flexShrink: 0, marginTop: '8px' }}>
              <div style={{ background: '#FEF3C7', border: '1.5px solid #FDE68A', borderRadius: '16px', padding: '12px 16px', boxShadow: '0 4px 12px rgba(60,40,20,0.04)' }}>
                <h4 style={{ color: '#92400E', fontSize: '13px', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
                  Mission
                </h4>
                <p style={{ color: '#78350F', fontSize: '14.5px', lineHeight: 1.45, margin: 0, fontWeight: 600 }}>
                  By the end of this chapter, you will be able to locate places on Earth, read maps confidently, and understand how coordinates and time help us navigate our world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {artZoomed && (
        <div
          onClick={() => setArtZoomed(false)}
          role="dialog"
          aria-modal="true"
          style={{ position: 'fixed', inset: 0, zIndex: 100002, background: 'rgba(9,26,44,0.72)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px, 3vw, 48px)', cursor: 'zoom-out' }}
        >
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: '1400px', background: '#FBF7EE', borderRadius: '18px', padding: 'clamp(12px, 1.6vw, 22px)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)', cursor: 'default' }}>
            <button
              type="button"
              onClick={() => setArtZoomed(false)}
              aria-label="Close the figure (Esc)"
              style={{ position: 'absolute', top: '12px', right: '12px', width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #d6e0ec', background: '#fff', color: '#0E3556', display: 'grid', placeItems: 'center', cursor: 'pointer', zIndex: 2, boxShadow: '0 6px 16px rgba(14,42,69,0.16)' }}
            >
              <X size={20} />
            </button>
            <img
              src={compassMapImg}
              alt="Authentic brass directional navigation compass on atlas map"
              style={{ width: '100%', maxHeight: '82vh', objectFit: 'contain', borderRadius: '12px', display: 'block', margin: '0 auto' }}
            />
          </div>
        </div>
      )}

      <ChapterBackFooter
        onBack={onBack}
        nextLabel="Start Exploring"
        onNext={onBeginChapter}
        nextVariant="amber"
        centerContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5c6b7a', fontWeight: 600, fontSize: '14px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21.5z" stroke="#5c6b7a" strokeWidth="1.5"></path><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5A2.5 2.5 0 0 1 20 21.5z" stroke="#5c6b7a" strokeWidth="1.5"></path></svg>
            Page 2 of 2
          </div>
        }
      />
    </div>
  );
}
