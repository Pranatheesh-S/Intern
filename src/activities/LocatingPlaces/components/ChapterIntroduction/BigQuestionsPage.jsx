import React, { useState, useRef } from 'react';
import { Map, MapPin, Clock, Compass, Globe2, ChevronRight } from 'lucide-react';
import bigQuestionsImg from './assets/big-questions-new.png';
import ChapterBackFooter from '../ChapterBackFooter';

const PAGE_PADDING = 'clamp(20px, 2.6vw, 42px)';
const HEADER_TITLE_STYLE = {
  fontSize: 'clamp(1.75rem, 2.8vw, 2.6rem)',
  color: '#1e3a8a',
  margin: 0,
  fontFamily: 'serif',
  fontWeight: 'bold',
  lineHeight: 1.15
};

export default function BigQuestionsPage({ onBack, onMissionUnlock, onBeginChapter }) {
  const [discoveredCards, setDiscoveredCards] = useState([]);
  const scrollContainerRef = useRef(null);

  const handleDiscover = (id) => {
    if (!discoveredCards.includes(id)) {
      const newDiscovered = [...discoveredCards, id];
      setDiscoveredCards(newDiscovered);

      const currentIndex = cards.findIndex(c => c.id === id);
      const nextCard = cards[currentIndex + 1];
      const targetId = nextCard ? `bq-card-${nextCard.id}` : `bq-card-${id}`;

      setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 150);

      if (newDiscovered.length === 3 && onMissionUnlock) {
        onMissionUnlock();
      }
    }
  };

  const cards = [
    {
      id: 'maps',
      title: 'Maps',
      icon: Map,
      color: '#2563eb',
      bgLight: '#dbeafe',
      question: 'What is a map and how do we use it? What are its main components?',
      hint: "You'll learn about: Maps • Symbols • Directions • Scale",
      hintColor: '#0369a1',
      hintBg: '#e0f2fe'
    },
    {
      id: 'coordinates',
      title: 'Coordinates',
      icon: MapPin,
      color: '#9333ea',
      bgLight: '#f3e8ff',
      question: 'What are coordinates? How can latitude and longitude be used to mark any location on the Earth?',
      hint: "You'll learn about: Latitude • Longitude • Globe",
      hintColor: '#7e22ce',
      hintBg: '#f3e8ff'
    },
    {
      id: 'time',
      title: 'Time',
      icon: Clock,
      color: '#d97706',
      bgLight: '#fef3c7',
      question: 'How are local time and standard time related to longitude?',
      hint: "You'll learn about: Time Zones • Standard Time",
      hintColor: '#b45309',
      hintBg: '#fef3c7'
    }
  ];

  const applyCardHover = (e, card, isDiscovered) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.08)';
    e.currentTarget.style.borderTopColor = card.color;
    e.currentTarget.style.borderRightColor = card.color;
    e.currentTarget.style.borderBottomColor = card.color;
    e.currentTarget.style.borderLeftColor = card.color;
    if (!isDiscovered) {
      e.currentTarget.style.background = '#f8fafc';
    }
  };

  const resetCardHover = (e, card, isDiscovered) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = isDiscovered ? 'none' : '0 4px 6px rgba(0,0,0,0.05)';
    e.currentTarget.style.borderTopColor = isDiscovered ? '#e2e8f0' : '#cbd5e1';
    e.currentTarget.style.borderRightColor = isDiscovered ? '#e2e8f0' : '#cbd5e1';
    e.currentTarget.style.borderBottomColor = isDiscovered ? '#e2e8f0' : '#cbd5e1';
    e.currentTarget.style.borderLeftColor = isDiscovered ? card.color : '#cbd5e1';
    e.currentTarget.style.background = isDiscovered ? '#f8fafc' : '#ffffff';
  };

  const columnShell = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    minWidth: 0,
    background: '#ffffff',
    boxSizing: 'border-box'
  };

  const headerShell = {
    flexShrink: 0,
    minHeight: 'clamp(72px, 9vh, 96px)',
    padding: `${PAGE_PADDING} ${PAGE_PADDING} 16px`,
    borderBottom: '1px solid #e4ebf3',
    display: 'flex',
    alignItems: 'flex-end',
    boxSizing: 'border-box'
  };

  const bodyShell = {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: `16px ${PAGE_PADDING} ${PAGE_PADDING}`,
    boxSizing: 'border-box'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        flex: 1,
        minHeight: 0,
        width: '100%'
      }}>
        {/* LEFT COLUMN */}
        <div style={{ ...columnShell, borderRight: '1px solid rgba(0,0,0,0.08)', position: 'relative' }}>
          <Compass size={120} color="#cbd5e1" style={{ position: 'absolute', top: '18%', right: '5%', opacity: 0.12, pointerEvents: 'none' }} />
          <Globe2 size={150} color="#cbd5e1" style={{ position: 'absolute', bottom: '8%', left: '-4%', opacity: 0.12, pointerEvents: 'none' }} />

          <div style={headerShell}>
            <h2 style={HEADER_TITLE_STYLE}>Big Questions</h2>
          </div>

          <div style={{ ...bodyShell, position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 'clamp(1rem, 1.3vw, 1.2rem)', color: '#334155', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              Every journey begins with a few important questions. In this chapter, you will explore how maps help us locate places, understand coordinates, and explain time across the Earth.
            </p>

            <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={bigQuestionsImg}
                alt="Big Questions Illustration"
                style={{ width: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.12))' }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={columnShell}>
          <div style={headerShell}>
            <h2 style={HEADER_TITLE_STYLE}>What Will We Discover?</h2>
          </div>

          <div style={bodyShell}>
            <div
              ref={scrollContainerRef}
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(0.5rem, 1vh, 0.75rem)',
                marginBottom: '12px'
              }}
            >
              {cards.map((card) => {
                const isDiscovered = discoveredCards.includes(card.id);

                return (
                  <div
                    key={card.id}
                    id={`bq-card-${card.id}`}
                    onClick={() => !isDiscovered && handleDiscover(card.id)}
                    style={{
                      background: isDiscovered ? '#f8fafc' : '#ffffff',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderTopColor: isDiscovered ? '#e2e8f0' : '#cbd5e1',
                      borderRightColor: isDiscovered ? '#e2e8f0' : '#cbd5e1',
                      borderBottomColor: isDiscovered ? '#e2e8f0' : '#cbd5e1',
                      borderLeftWidth: '4px',
                      borderLeftColor: isDiscovered ? card.color : '#cbd5e1',
                      padding: 'clamp(0.6rem, 1.2vh, 0.8rem) clamp(0.8rem, 1.5vw, 1.2rem)',
                      borderRadius: '12px',
                      display: 'flex',
                      gap: 'clamp(0.6rem, 1vw, 1rem)',
                      cursor: isDiscovered ? 'default' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: isDiscovered ? 'none' : '0 4px 6px rgba(0,0,0,0.05)',
                      alignItems: isDiscovered ? 'flex-start' : 'center',
                      flexShrink: 0,
                      boxSizing: 'border-box'
                    }}
                    onMouseOver={(e) => applyCardHover(e, card, isDiscovered)}
                    onMouseOut={(e) => resetCardHover(e, card, isDiscovered)}
                  >
                    <div style={{
                      background: card.bgLight,
                      color: card.color,
                      width: 'clamp(36px, 4vw, 48px)',
                      height: 'clamp(36px, 4vw, 48px)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <card.icon size={20} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <h4 style={{ margin: isDiscovered ? '0 0 0.3rem 0' : '0', color: '#1e3a8a', fontSize: 'clamp(1rem, 1.4vw, 1.25rem)' }}>
                          {card.title}
                        </h4>
                        {!isDiscovered && (
                          <span style={{ fontSize: 'clamp(0.85rem, 1vw, 1rem)', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 'bold', flexShrink: 0 }}>
                            Click to discover <ChevronRight size={18} />
                          </span>
                        )}
                      </div>

                      {isDiscovered && (
                        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                          <p style={{ margin: '0 0 0.4rem 0', color: '#334155', fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)', lineHeight: 1.4 }}>
                            {card.question}
                          </p>
                          <div style={{ background: card.hintBg, color: card.hintColor, display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: 'clamp(0.85rem, 1vw, 0.95rem)', fontWeight: 'bold' }}>
                            {card.hint}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ flexShrink: 0 }}>
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: 'clamp(0.8rem, 1.5vh, 1.2rem)' }}>
                <h4 style={{ color: '#059669', fontSize: 'clamp(1rem, 1.2vw, 1.2rem)', margin: '0 0 0.3rem 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Mission
                </h4>
                <p style={{ color: '#334155', fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)', lineHeight: 1.4, margin: 0 }}>
                  By the end of this chapter, you will be able to locate places on Earth, read maps confidently, and understand how coordinates and time help us navigate our world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChapterBackFooter
        onBack={onBack}
        nextLabel="Start Exploring"
        onNext={onBeginChapter}
        nextVariant="green"
        centerContent={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5c6b7a', fontWeight: 600, fontSize: '13px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21.5z" stroke="#5c6b7a" strokeWidth="1.5"></path><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5A2.5 2.5 0 0 1 20 21.5z" stroke="#5c6b7a" strokeWidth="1.5"></path></svg>
            Page 2 of 2
          </div>
        }
      />
    </div>
  );
}
