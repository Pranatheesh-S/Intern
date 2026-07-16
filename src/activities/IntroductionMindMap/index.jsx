import React, { useState } from 'react';
import { X, Volume2, VolumeX, ChevronRight, ArrowLeft } from 'lucide-react';
import villageScene from '../../assets/village_scene.png';
import { useTheme } from '../../ThemeContext.jsx';

const NODES = [
  {
    id: 'guides',
    title: '👥 The Nature Walk Guides',
    x: '55%',
    y: '45%',
    content: 'The walk is led by Dr. Raghu (a researcher) and Maniram chacha (a community elder). They help students discover and respect nature.',
    details: [
      'Dr. Raghu is a professional scientist who explains the scientific method.',
      'Maniram chacha is an expert in identifying local plants and animal calls.',
      'They teach us to observe without disrupting local habitats.',
    ],
    speechText: 'The walk is led by Doctor Raghu and Maniram chacha. Dr. Raghu is a researcher, and Maniram chacha is a community elder who mimics bird calls.',
  },
  {
    id: 'observe',
    title: '👀 Observe Carefully',
    x: '20%',
    y: '50%',
    content: 'Look closely at stems, leaves, flowers, and any unique features of plants around you.',
    details: [
      'Notice if stems are soft and green or hard and woody.',
      'Look at leaf shape and how they are arranged on branches.',
      'Note the colors, shapes, and scents of flowers.',
    ],
    speechText: 'Observe carefully. Look closely at stems, leaves, flowers, and any unique features of plants around you. Note if stems are soft or hard.',
  },
  {
    id: 'listen',
    title: '🎵 Listen & Mimic',
    x: '40%',
    y: '22%',
    content: 'Listen closely to the unique calls of different birds and learn how they communicate.',
    details: [
      'Maniram chacha mimics bird chirps to show how they communicate.',
      'Every bird species has its own unique chirp or call.',
      'Listening is as important as looking during a nature exploration.',
    ],
    speechText: 'Listen closely. Hear the unique calls of different birds and learn how they communicate. Maniram chacha mimics bird calls.',
  },
  {
    id: 'record',
    title: '📋 Record in Tables',
    x: '30%',
    y: '75%',
    content: 'Keep a notebook handy to log observations in Tables 2.1 and 2.2 separately for plants and animals.',
    details: [
      'Table 2.1: Log plant names, stems, leaf arrangement, and flowers.',
      'Table 2.2: Log animals, their habitats, and how they move.',
      'Always carry a notebook, pen, and a water bottle.',
    ],
    speechText: 'Record in tables. Keep a notebook handy to log observations in Tables 2.1 and 2.2 separately for plants and animals.',
  },
  {
    id: 'compare',
    title: '🤝 Compare & Learn',
    x: '75%',
    y: '65%',
    content: 'Compare findings with your classmates. Everyone notices something unique!',
    details: [
      'Sharing notes helps discover new species observed by others.',
      'Helps understand how diverse organisms are spread in the environment.',
      'Fosters teamwork and collaborative learning.',
    ],
    speechText: 'Compare and learn. Compare findings with your classmates. Everyone notices something unique, which helps us learn together.',
  },
];

const IntroductionMindMap = ({ onBackToDashboard }) => {
  const { theme } = useTheme();
  const [unlockedCount, setUnlockedCount] = useState(1); // show first node only
  const [activeNode, setActiveNode] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleNodeClick = (node) => {
    setActiveNode(node);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleClosePopup = (markComplete = false) => {
    setActiveNode(null);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (markComplete) {
      onBackToDashboard(true);
    } else {
      setUnlockedCount((prev) => Math.min(prev + 1, NODES.length));
    }
  };

  const handleReadAloud = () => {
    if (!activeNode) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(activeNode.speechText);
    u.rate = 0.92;
    u.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const handleStopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Determine popup position relative to the activeNode's coordinates
  let popupStyle = {};
  if (activeNode) {
    const nodeX = parseFloat(activeNode.x);
    const nodeY = parseFloat(activeNode.y);
    const isRightSide = nodeX > 50;
    const isBottomSide = nodeY > 55;

    popupStyle = {
      position: 'absolute',
      left: `${nodeX}%`,
      top: `${nodeY}%`,
      // Position the callout popup left/right/above/below of the circle point dynamically
      transform: `translate(${isRightSide ? '-108%' : '8%'}, ${isBottomSide ? '-75%' : '-25%'})`,
      zIndex: 100,
      width: '320px',
      background: theme === 'light' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(12, 20, 42, 0.96)',
      backdropFilter: 'blur(20px)',
      border: '2px solid #2563eb', // bright blue border
      borderRadius: '16px',
      padding: '1.25rem',
      color: theme === 'light' ? 'var(--text-primary)' : '#fff',
      boxShadow: theme === 'light' ? '0 8px 32px rgba(0,0,0,0.12)' : '0 8px 32px rgba(0,0,0,0.5)',
      animation: 'fadeInScale 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem',
    };
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 3rem)',
        background: 'var(--page-bg)',
        color: 'var(--text-primary)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        boxSizing: 'border-box',
      }}
    >
      {/* Container with a clean border matching Activity 2.1 */}
      <div
        style={{
          flex: 1,
          border: '1.5px solid var(--border)',
          borderRadius: '16px',
          background: 'var(--card-bg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          position: 'relative',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.9rem 1.25rem',
            borderBottom: '1.5px solid var(--border)',
            background: 'var(--page-bg)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => {
                window.speechSynthesis.cancel();
                // Complete if all explored, otherwise normal exit
                onBackToDashboard(unlockedCount >= NODES.length);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1.5px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              <ArrowLeft size={16} /> Exit Lesson
            </button>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>
                Lesson 2.1: Nature Walk Introduction
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Interactive Mind Map — click the bright blue blinking circles
              </span>
            </div>
          </div>

          {/* Progress indicators in the header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {NODES.map((n, i) => (
              <div
                key={n.id}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background:
                    i < unlockedCount
                      ? i <= unlockedCount - 2
                        ? 'var(--success)' // green for completed
                        : 'var(--accent)' // blue for current
                      : 'var(--border)', // grey for locked
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginLeft: '0.25rem' }}>
              {Math.min(unlockedCount - 1, NODES.length)} / {NODES.length} Explored
            </span>
          </div>
        </div>

        {/* Mind Map Interactive Image Canvas */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '460px' }}>
          <img
            src={villageScene}
            alt="Classroom Nature Walk Scene"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />

          {/* Hotspot Circles */}
          {NODES.map((node, idx) => {
            const isUnlocked = idx < unlockedCount;
            const isCurrent = idx === unlockedCount - 1;
            if (!isUnlocked) return null;

            return (
              <button
                key={node.id}
                onClick={() => handleNodeClick(node)}
                title={node.title}
                style={{
                  position: 'absolute',
                  left: node.x,
                  top: node.y,
                  transform: 'translate(-50%, -50%)',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  // Bright Blue color as requested
                  background: isCurrent ? '#2563eb' : '#16a34a',
                  border: '2.5px solid #fff',
                  cursor: 'pointer',
                  zIndex: 20,
                  padding: 0,
                  boxShadow: isCurrent
                    ? '0 0 0 5px rgba(37, 99, 235, 0.4), 0 0 15px rgba(37, 99, 235, 0.7)'
                    : '0 0 0 4px rgba(22, 163, 74, 0.3), 0 0 10px rgba(22, 163, 74, 0.5)',
                  // Blinking animation
                  animation: 'beaconBlink 1.6s infinite ease-in-out',
                }}
              />
            );
          })}

          {/* Render callout popup dynamically positioned next to clicked circle */}
          {activeNode && (
            <>
              {/* Overlay Backdrop to close on click outside */}
              <div
                onClick={() => handleClosePopup(false)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 80,
                  background: 'rgba(0,0,0,0.15)',
                }}
              />

              {/* Callout box */}
              <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold', color: theme === 'light' ? '#1d4ed8' : '#60a5fa', lineHeight: 1.3 }}>
                    {activeNode.title}
                  </h3>
                  <button
                    onClick={() => handleClosePopup(false)}
                    style={{
                      background: theme === 'light' ? 'var(--page-bg)' : 'rgba(255,255,255,0.08)',
                      border: theme === 'light' ? '1px solid var(--border)' : '1.5px solid rgba(255,255,255,0.15)',
                      borderRadius: '6px',
                      color: theme === 'light' ? 'var(--text-secondary)' : '#fff',
                      cursor: 'pointer',
                      padding: '0.2rem',
                      display: 'flex',
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body Text */}
                <p style={{ margin: 0, fontSize: '0.92rem', color: theme === 'light' ? 'var(--text-primary)' : 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
                  {activeNode.content}
                </p>

                {/* Details list */}
                <div style={{ borderTop: theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.1)', paddingTop: '0.6rem' }}>
                  <ul style={{ margin: 0, paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {activeNode.details.map((detail, dIdx) => (
                      <li key={dIdx} style={{ fontSize: '0.85rem', color: theme === 'light' ? 'var(--text-secondary)' : 'rgba(255,255,255,0.72)', lineHeight: 1.4 }}>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.1)', paddingTop: '0.6rem', gap: '0.5rem' }}>
                  {/* Speech */}
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button
                      onClick={handleReadAloud}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        border: theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(96,165,250,0.3)',
                        background: theme === 'light' ? 'var(--card-bg)' : (isSpeaking ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.06)'),
                        color: theme === 'light' ? 'var(--accent)' : '#93c5fd',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Volume2 size={13} /> {isSpeaking ? 'Reading…' : 'Read'}
                    </button>
                    {isSpeaking && (
                      <button
                        onClick={handleStopSpeech}
                        style={{
                          padding: '0.35rem 0.5rem',
                          borderRadius: '6px',
                          border: theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.1)',
                          background: theme === 'light' ? 'var(--page-bg)' : 'rgba(255,255,255,0.05)',
                          color: theme === 'light' ? 'var(--text-secondary)' : 'rgba(255,255,255,0.6)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        <VolumeX size={13} />
                      </button>
                    )}
                  </div>

                  {/* Next / Done CTA */}
                  <button
                    onClick={() => {
                      const isLast = unlockedCount === NODES.length;
                      handleClosePopup(isLast); // marks lesson complete if it is the 5th hotspot
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                      color: '#fff',
                      fontSize: '0.82rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(37,99,235,0.3)',
                    }}
                  >
                    {unlockedCount < NODES.length ? (
                      <>
                        Next <ChevronRight size={14} />
                      </>
                    ) : (
                      '✓ Done'
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom hint banner */}
        {unlockedCount <= NODES.length && (
          <div
            style={{
              padding: '0.65rem',
              textAlign: 'center',
              background: 'var(--page-bg)',
              borderTop: '1.5px solid var(--border)',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              fontWeight: '600',
            }}
          >
            {unlockedCount <= NODES.length
              ? `⭐ Explored ${unlockedCount - 1} of ${NODES.length} points. Click the bright blue circles to progress.`
              : '🎉 You have finished exploring all the concepts! Press Done to complete.'}
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        @keyframes beaconBlink {
          0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.9; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default IntroductionMindMap;
