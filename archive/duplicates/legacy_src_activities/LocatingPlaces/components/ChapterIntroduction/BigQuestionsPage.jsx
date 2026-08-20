import React, { useState, useRef } from 'react';
import { Map, MapPin, Clock, Compass, Globe2, ChevronDown, ChevronRight } from 'lucide-react';
import bigQuestionsImg from './assets/big-questions.png';

export default function BigQuestionsPage({ onMissionUnlock, onBeginChapter }) {
  const [discoveredCards, setDiscoveredCards] = useState([]);
  const scrollContainerRef = useRef(null);

  const handleDiscover = (id) => {
    if (!discoveredCards.includes(id)) {
      const newDiscovered = [...discoveredCards, id];
      setDiscoveredCards(newDiscovered);
      
      // Auto-scroll so the next card in the sequence is visible
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

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {/* LEFT PAGE */}
      <div style={{ flex: 1, padding: 'clamp(20px, 2.6vw, 42px) clamp(20px, 2.6vw, 42px) 16px clamp(20px, 2.6vw, 42px)', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.08)', position: 'relative' }}>
        
        {/* Subtle decorative elements */}
        <Compass size={120} color="#cbd5e1" style={{ position: 'absolute', top: '10%', right: '5%', opacity: 0.15, pointerEvents: 'none' }} />
        <Globe2 size={150} color="#cbd5e1" style={{ position: 'absolute', bottom: '5%', left: '-5%', opacity: 0.15, pointerEvents: 'none' }} />

        <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', color: '#1e3a8a', marginBottom: 'clamp(0.5rem, 1vh, 0.5rem)', fontFamily: 'serif', fontWeight: 'bold' }}>
          Big Questions
        </h2>
        
        <p style={{ fontSize: 'clamp(1rem, 1.3vw, 1.2rem)', color: '#334155', lineHeight: 1.5, marginBottom: 'clamp(1rem, 2vh, 1.5rem)', zIndex: 1 }}>
          Every journey begins with a few important questions. In this chapter, you will explore how maps help us locate places, understand coordinates, and explain time across the Earth.
        </p>
        
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, minHeight: 0 }}>
          <div style={{ background: '#f8fafc', padding: 'clamp(1rem, 2vh, 2rem)', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', width: '90%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={bigQuestionsImg} alt="Big Questions Illustration" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
          </div>
        </div>
      </div>

      {/* RIGHT PAGE */}
      <div style={{ flex: 1, padding: 'clamp(20px, 2.6vw, 42px) clamp(20px, 2.6vw, 42px) 16px clamp(20px, 2.6vw, 42px)', position: 'relative', backgroundColor: '#ffffff', color: '#1e293b', display: 'flex', flexDirection: 'column', borderRadius: '0 4px 4px 0' }}>
        
        <h3 style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', color: '#1e3a8a', marginBottom: 'clamp(0.8rem, 1.5vh, 1.2rem)', fontFamily: 'serif', fontWeight: 'bold' }}>
          What Will We Discover?
        </h3>

        <div ref={scrollContainerRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 1vh, 0.5rem)', paddingRight: '4px' }}>
          {cards.map((card) => {
            const isDiscovered = discoveredCards.includes(card.id);
            
            return (
              <div 
                key={card.id}
                id={`bq-card-${card.id}`}
                onClick={() => handleDiscover(card.id)}
                style={{ 
                  background: isDiscovered ? '#f8fafc' : '#ffffff', 
                  border: `1px solid ${isDiscovered ? '#e2e8f0' : '#cbd5e1'}`, 
                  padding: 'clamp(0.6rem, 1.2vh, 0.8rem) clamp(0.8rem, 1.5vw, 1.2rem)', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  gap: 'clamp(0.6rem, 1vw, 1rem)',
                  cursor: isDiscovered ? 'default' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isDiscovered ? 'none' : '0 4px 6px rgba(0,0,0,0.05)',
                  alignItems: isDiscovered ? 'flex-start' : 'center',
                  flexShrink: 0
                }}
                onMouseOver={(e) => {
                  if (!isDiscovered) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = card.color;
                  }
                }}
                onMouseOut={(e) => {
                  if (!isDiscovered) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }
                }}
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
                  flexShrink: 0,
                  transition: 'transform 0.3s'
                }}>
                  <card.icon size={20} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: isDiscovered ? '0 0 0.3rem 0' : '0', color: '#1e3a8a', fontSize: 'clamp(1rem, 1.4vw, 1.25rem)' }}>
                      {card.title}
                    </h4>
                    {!isDiscovered && (
                      <span style={{ fontSize: 'clamp(0.85rem, 1vw, 1rem)', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 'bold' }}>
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

        {/* Mission Box & Navigation */}
        <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: 'clamp(0.8rem, 1.5vh, 1.2rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'opacity 0.5s', opacity: discoveredCards.length === 3 ? 1 : 0.4 }}>
            <h4 style={{ color: '#059669', fontSize: 'clamp(1rem, 1.2vw, 1.2rem)', margin: '0 0 0.3rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Mission
            </h4>
            <p style={{ color: '#334155', fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)', lineHeight: 1.4, margin: 0 }}>
              By the end of this chapter, you will be able to locate places on Earth, read maps confidently, and understand how coordinates and time help us navigate our world.
            </p>
            {discoveredCards.length < 3 && (
              <p style={{ margin: '0.5rem 0 0 0', fontSize: 'clamp(0.85rem, 1vw, 0.95rem)', color: '#047857', fontStyle: 'italic' }}>
                Discover all {3 - discoveredCards.length} remaining questions to unlock your mission!
              </p>
            )}
          </div>
          
          {/* Bottom Footer Area */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '10px',
            marginTop: '10px',
            borderTop: '1px solid #e4ebf3'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5c6b7a', fontWeight: 600, fontSize: '13px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21.5z" stroke="#5c6b7a" strokeWidth="1.5"></path><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5A2.5 2.5 0 0 1 20 21.5z" stroke="#5c6b7a" strokeWidth="1.5"></path></svg>
              Page 2 of 2
            </div>
            
            <div style={{ opacity: discoveredCards.length === 3 ? 1 : 0, transition: 'opacity 0.5s', pointerEvents: discoveredCards.length === 3 ? 'auto' : 'none' }}>
              <button 
                onClick={onBeginChapter} 
                style={{ 
                  background: '#16a34a', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '30px', 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer', 
                  boxShadow: '0 4px 15px rgba(22, 163, 74, 0.4)', 
                  transition: 'transform 0.2s', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem' 
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Start Exploring <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
