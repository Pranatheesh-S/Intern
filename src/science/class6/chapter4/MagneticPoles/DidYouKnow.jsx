import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const facts = [
  {
    title: "Earth is a Giant Magnet",
    shortTitle: "Earth is a Giant Magnet",
    content: "Earth acts like a giant magnet! It has its own magnetic field, which helps a compass point north. This invisible magnetic shield protects our planet from solar particles."
  },
  {
    title: "William Gilbert's Discovery",
    shortTitle: "Gilbert's Discovery",
    content: "In 1600, English scientist William Gilbert studied magnets carefully and discovered that Earth behaves like a giant magnet. His work explained why compass needles point north."
  },
  {
    title: "Magnetic Poles Exist in Pairs",
    shortTitle: "Poles Exist in Pairs",
    content: "Even if you break a bar magnet into smaller pieces, every piece will still have its own North and South pole! A single isolated magnetic pole cannot exist by itself."
  },
  {
    title: "Poles Hold Maximum Strength",
    shortTitle: "Maximum Pole Strength",
    content: "When you sprinkle iron filings over a magnet, most filings cluster heavily at the two ends. This shows that a magnet's attraction strength is strongest at its poles!"
  }
];

export default function DidYouKnow() {
  const [hoveredFact, setHoveredFact] = useState(null);
  const [spokenCharIndex, setSpokenCharIndex] = useState(-1);

  const speakFact = (fact) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setSpokenCharIndex(0);

    const synth = window.speechSynthesis;
    const availableVoices = synth.getVoices();
    
    const teacherVoice = availableVoices.find(v => {
      const name = (v.name || '').toLowerCase();
      return name.includes('neerja') || name.includes('natural female') || (name.includes('female') && !name.includes('zira'));
    }) || availableVoices.find(v => v.name.includes('Jenny') || v.name.includes('Zira')) || availableVoices[0];

    const fullText = `${fact.title}. ${fact.content}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.voice = teacherVoice;
    utterance.pitch = 0.88;
    utterance.rate = 0.88;
    utterance.volume = 1.0;

    const titleOffset = fact.title.length + 2;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const contentIndex = event.charIndex - titleOffset;
        setSpokenCharIndex(contentIndex >= 0 ? contentIndex : 0);
      }
    };

    utterance.onend = () => {
      setSpokenCharIndex(fact.content.length);
    };

    utterance.onerror = () => {
      setSpokenCharIndex(-1);
    };

    synth.speak(utterance);
  };

  const handleMouseEnter = (fact) => {
    setHoveredFact(fact);
    speakFact(fact);
  };

  const handleMouseLeave = () => {
    setHoveredFact(null);
    setSpokenCharIndex(-1);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Color-only text karaoke highlighting (no background, no glow, no size changes)
  const renderHighlightedContent = (content, charIndex) => {
    if (!content) return null;
    if (charIndex === undefined || charIndex === null || charIndex < 0) {
      return <span>{content}</span>;
    }

    const words = content.split(' ');
    let currentPos = 0;

    return words.map((word, i) => {
      const startPos = currentPos;
      const endPos = currentPos + word.length;
      currentPos = endPos + 1;

      const isCurrentWord = charIndex >= startPos && charIndex <= endPos + 2;
      const isPastWord = charIndex > endPos + 2;

      let color = '#cbd5e1';
      let fontWeight = 500;

      if (isCurrentWord) {
        color = '#38bdf8'; // Cyan active spoken word
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
            {renderHighlightedContent(hoveredFact.content, spokenCharIndex)}
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
                  color: hoveredFact === fact ? '#60a5fa' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  padding: '0.4rem 0.6rem',
                  borderRadius: '8px',
                  backgroundColor: hoveredFact === fact ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  transition: 'all 0.2s ease',
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
