import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useHybridVoice } from '../../../../hooks/useHybridVoice';

const facts = [
  {
    id: 'metal_magnetic',
    title: "Not every metal is magnetic",
    shortTitle: "Not every metal is magnetic",
    content: "A magnet does not attract every metal. Iron, nickel, and cobalt stick to magnets, but metals like aluminium, copper, silver, and gold do not. That is why some metal objects are magnetic while others are not!",
    audioUrl: '/audio/not_every_metal.mp3'
  },
  {
    id: 'electricity_magnetism',
    title: "Electricity and magnetism",
    shortTitle: "Electricity and magnetism",
    content: "More than 200 years ago, scientist Hans Christian Ørsted noticed that a compass needle moved near an electric wire. This discovery showed that electricity and magnetism are connected.",
    audioUrl: '/audio/electricity_magnetism.mp3'
  },
  {
    id: 'recycling_magnets',
    title: "Magnets in recycling",
    shortTitle: "Magnets in recycling",
    content: "Magnets are used in recycling centres to separate iron and steel from other waste. This helps recycle metals faster and keeps the environment cleaner.",
    audioUrl: '/audio/recycling_magnets.mp3'
  },
  {
    id: 'data_storage',
    title: "Data storage",
    shortTitle: "Data storage",
    content: "Many modern devices, such as computers and data storage systems, use tiny magnets to store information. These magnets help keep your photos, videos, and files safe.",
    audioUrl: '/audio/data_storage.mp3'
  }
];

export default function DidYouKnow() {
  const [hoveredFact, setHoveredFact] = useState(null);
  const { speak, stop, spokenCharIndex } = useHybridVoice();

  const handleMouseEnter = (fact) => {
    setHoveredFact(fact);
    const fullText = `${fact.title}. ${fact.content}`;
    speak({
      text: fullText,
      audioUrl: fact.audioUrl
    });
  };

  const handleMouseLeave = () => {
    setHoveredFact(null);
    stop();
  };

  // Color-only text karaoke highlighting (no background, no glow, no size changes)
  const renderHighlightedContent = (content, title, charIndex) => {
    if (!content) return null;
    if (charIndex === undefined || charIndex === null || charIndex < 0) {
      return <span>{content}</span>;
    }

    const titleOffset = title ? title.length + 2 : 0;
    const adjustedIndex = charIndex - titleOffset;

    const words = content.split(' ');
    let currentPos = 0;

    return words.map((word, i) => {
      const startPos = currentPos;
      const endPos = currentPos + word.length;
      currentPos = endPos + 1;

      const isCurrentWord = adjustedIndex >= startPos && adjustedIndex <= endPos + 2;
      const isPastWord = adjustedIndex > endPos + 2;

      let color = '#cbd5e1';
      let fontWeight = 500;

     if (isCurrentWord) {
        color = '#ff7700'; // Bright Orange active spoken word
      } else if (isPastWord) {
        color = '#f1f5f9'; // Bright read word
      }

      return (
        <span
          key={i}
          style={{
            color,
            fontWeight,
            transition: 'color 0.15s ease',
            display: 'inline-block',
            marginRight: '0.25rem'
          }}
        >
          {word}
        </span>
      );
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Floating Hover Tooltip Card */}
      {hoveredFact && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 14px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '95%',
          maxWidth: '700px',
          background: 'linear-gradient(145deg, #0b132b, #1c2541)',
          border: '2px solid #a78bfa',
          borderRadius: '22px',
          padding: '1.25rem 1.75rem',
          color: '#f8fafc',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(167, 139, 250, 0.4)',
          zIndex: 100000,
          pointerEvents: 'none',
          backdropFilter: 'blur(16px)',
          transition: 'all 0.25s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span>
            <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8' }}>
              {hoveredFact.title}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '1.02rem', lineHeight: '1.65', color: '#cbd5e1' }}>
            {renderHighlightedContent(hoveredFact.content, hoveredFact.title, spokenCharIndex)}
          </p>
        </div>
      )}

      {/* Main Bottom Bar */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.95))',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25), 0 0 20px rgba(139, 92, 246, 0.15)',
        borderRadius: '24px',
        padding: '0.6rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box',
        height: '54px',
        minHeight: '54px'
      }}>
        {/* Brain Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, paddingRight: '0.75rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🧠</span>
        </div>

        {/* Fact items horizontally */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-around', height: '100%' }}>
          {facts.map((fact, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <div style={{ width: '1px', height: '60%', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
              )}
              <div
                onMouseEnter={() => handleMouseEnter(fact)}
                onMouseLeave={handleMouseLeave}
                style={{
                  color: hoveredFact === fact ? '#ff7700' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  padding: '0.4rem 0.6rem',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  transition: 'color 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '1rem' }}>👉</span>
                <span>{fact.shortTitle}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Sparkle Icon */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, paddingLeft: '0.5rem', color: '#60a5fa' }}>
          <Sparkles size={18} />
        </div>
      </div>
    </div>
  );
}
