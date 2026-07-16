import React, { useState } from 'react';
import { Map, MapPin, Clock, Compass, Globe2, ChevronDown, ChevronRight } from 'lucide-react';
import bigQuestionsImg from './assets/big-questions.png';

export default function BigQuestionsPage({ onMissionUnlock }) {
  const [discoveredCards, setDiscoveredCards] = useState([]);

  const handleDiscover = (id) => {
    if (!discoveredCards.includes(id)) {
      const newDiscovered = [...discoveredCards, id];
      setDiscoveredCards(newDiscovered);
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
      <div style={{ flex: 1, padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.08)', position: 'relative' }}>
        
        {/* Subtle decorative elements */}
        <Compass size={120} color="#cbd5e1" style={{ position: 'absolute', top: '10%', right: '5%', opacity: 0.15, pointerEvents: 'none' }} />
        <Globe2 size={150} color="#cbd5e1" style={{ position: 'absolute', bottom: '5%', left: '-5%', opacity: 0.15, pointerEvents: 'none' }} />

        <h2 style={{ fontSize: '2.5rem', color: '#1e3a8a', marginBottom: '0.5rem', fontFamily: 'serif', fontWeight: 'bold' }}>
          Big Questions
        </h2>
        
        <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.5, marginBottom: '1.5rem', zIndex: 1 }}>
          Every journey begins with a few important questions. In this chapter, you will explore how maps help us locate places, understand coordinates, and explain time across the Earth.
        </p>
        
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', width: '90%', display: 'flex', justifyContent: 'center' }}>
            <img src={bigQuestionsImg} alt="Big Questions Illustration" style={{ maxWidth: '100%', maxHeight: '45vh', objectFit: 'contain', borderRadius: '8px' }} />
          </div>
        </div>
      </div>

      {/* RIGHT PAGE */}
      <div style={{ flex: 1, padding: '1.5rem 2rem', position: 'relative', paddingBottom: '7.5rem', backgroundColor: '#ffffff', color: '#1e293b', display: 'flex', flexDirection: 'column', borderRadius: '0 4px 4px 0' }}>
        
        <h3 style={{ fontSize: '1.5rem', color: '#1e3a8a', marginBottom: '1rem', fontFamily: 'serif', fontWeight: 'bold' }}>
          What Will We Discover?
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          {cards.map((card) => {
            const isDiscovered = discoveredCards.includes(card.id);
            
            return (
              <div 
                key={card.id}
                onClick={() => handleDiscover(card.id)}
                style={{ 
                  background: isDiscovered ? '#f8fafc' : '#ffffff', 
                  border: `1px solid ${isDiscovered ? '#e2e8f0' : '#cbd5e1'}`, 
                  padding: '0.6rem 0.8rem', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  gap: '0.8rem',
                  cursor: isDiscovered ? 'default' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isDiscovered ? 'none' : '0 4px 6px rgba(0,0,0,0.05)',
                  alignItems: isDiscovered ? 'flex-start' : 'center'
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
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0,
                  transition: 'transform 0.3s'
                }}>
                  <card.icon size={18} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: isDiscovered ? '0 0 0.3rem 0' : '0', color: '#1e3a8a', fontSize: '1rem' }}>
                      {card.title}
                    </h4>
                    {!isDiscovered && (
                      <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 'bold' }}>
                        Click to discover <ChevronRight size={16} />
                      </span>
                    )}
                  </div>
                  
                  {isDiscovered && (
                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                      <p style={{ margin: '0 0 0.4rem 0', color: '#334155', fontSize: '0.85rem', lineHeight: 1.3 }}>
                        {card.question}
                      </p>
                      <div style={{ background: card.hintBg, color: card.hintColor, display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        {card.hint}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mission Box */}
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '0.8rem 1rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'opacity 0.5s', opacity: discoveredCards.length === 3 ? 1 : 0.4 }}>
          <h4 style={{ color: '#059669', fontSize: '0.95rem', margin: '0 0 0.3rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Mission
          </h4>
          <p style={{ color: '#334155', fontSize: '0.85rem', lineHeight: 1.4, margin: 0 }}>
            By the end of this chapter, you will be able to locate places on Earth, read maps confidently, and understand how coordinates and time help us navigate our world.
          </p>
          {discoveredCards.length < 3 && (
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#047857', fontStyle: 'italic' }}>
              Discover all {3 - discoveredCards.length} remaining questions to unlock your mission!
            </p>
          )}
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
