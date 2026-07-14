import React, { useState } from 'react';
import { BookOpen, Compass, Search, CheckCircle2, ArrowLeft, RefreshCw, Award, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

const ORGANISMS = [
  {
    id: 'neem',
    name: 'Neem Tree',
    type: 'plant',
    habitat: 'Land',
    details: 'A large evergreen tree known for its medicinal leaves, hard woody bark, and compound leaf structure.',
    fact: 'Neem leaves are natural pest repellents and have been used in traditional medicine for thousands of years.',
    question: 'How would you classify the Neem plant based on its stem?',
    options: ['Herb (Soft green stem)', 'Shrub (Medium woody stem)', 'Tree (Hard, thick woody trunk)'],
    correctIndex: 2,
    x: 520,
    y: 140,
    radius: 48,
    color: '#047857'
  },
  {
    id: 'hibiscus',
    name: 'Hibiscus Shrub',
    type: 'plant',
    habitat: 'Land',
    details: 'A flowering shrub with vibrant red petals, alternate leaf arrangement, and a woody but thin stem branching near the base.',
    fact: 'Hibiscus flowers are rich in antioxidants and often brewed into tart herbal teas around the world.',
    question: 'What is the branching pattern of a Shrub like Hibiscus?',
    options: ['Branches high up on a single trunk', 'Branches near the base of the stem', 'Has no branches (soft single stem)'],
    correctIndex: 1,
    x: 95,
    y: 250,
    radius: 44,
    color: '#dc2626'
  },
  {
    id: 'tulsi',
    name: 'Tulsi Herb',
    type: 'plant',
    habitat: 'Land',
    details: 'A small aromatic herb with a soft, green, non-woody stem and opposite simple leaves.',
    fact: 'Also known as Holy Basil, Tulsi is highly revered and commonly grown in Indian households for its wellness benefits.',
    question: 'Which of these is true about Herbs like Tulsi?',
    options: ['They have thick woody trunks', 'They have soft, green, and tender stems', 'They grow up to 20 feet tall'],
    correctIndex: 1,
    x: 100,
    y: 360,
    radius: 40,
    color: '#059669'
  },
  {
    id: 'butterfly',
    name: 'Monarch Butterfly',
    type: 'animal',
    habitat: 'Air/Land',
    details: 'A flying insect with colorful orange and black wings. Performs metamorphosis from caterpillar to butterfly.',
    fact: 'Monarch butterflies travel thousands of miles during their seasonal migrations.',
    question: 'What is the primary mode of movement for a butterfly?',
    options: ['Crawling using 10 legs', 'Swimming in water', 'Flying using wings'],
    correctIndex: 2,
    x: 160,
    y: 240,
    radius: 24,
    color: '#ea580c'
  },
  {
    id: 'crow',
    name: 'House Crow',
    type: 'animal',
    habitat: 'Tree/Air',
    details: 'A highly intelligent grey-necked black bird. Feeds on seeds, insects, and food scraps.',
    fact: 'Crows can recognize individual human faces and are known to use tools to solve complex puzzles.',
    question: 'How do birds like crows adapt to their habitat?',
    options: ['They have hollow bones and wings to fly', 'They have gills to breathe underwater', 'They have thick fur to survive snow'],
    correctIndex: 0,
    x: 390,
    y: 100,
    radius: 24,
    color: '#1e293b'
  },
  {
    id: 'ant',
    name: 'Black Garden Ant',
    type: 'animal',
    habitat: 'Land (Underground)',
    details: 'A tiny crawling insect that lives in highly organized colonies. Feeds on leaves, honeydew, and small pests.',
    fact: 'Ants do not have lungs; they breathe through tiny holes all over their bodies called spiracles.',
    question: 'How do ants move and search for food?',
    options: ['Flying with hidden wings', 'Crawling on their six legs', 'Slithering like a snake'],
    correctIndex: 1,
    x: 450,
    y: 260,
    radius: 16,
    color: '#0f172a'
  },
  {
    id: 'frog',
    name: 'Indian Pond Frog',
    type: 'animal',
    habitat: 'Pond (Water/Land)',
    details: 'An amphibian with smooth green skin, webbed feet for swimming, and powerful hind legs for jumping.',
    fact: 'Frogs can breathe both through their lungs on land and directly through their moist skin underwater.',
    question: 'What is the habitat of an amphibian like a frog?',
    options: ['Only deep ocean waters', 'Only high mountain dry deserts', 'Both land and freshwater ponds'],
    correctIndex: 2,
    x: 320,
    y: 270,
    radius: 28,
    color: '#16a34a'
  },
  {
    id: 'snail',
    name: 'Garden Snail',
    type: 'animal',
    habitat: 'Moist Land',
    details: 'A slow-crawling mollusk with a hard protective shell on its back. Prefers shady, moist gardens.',
    fact: 'Snails leave a trail of slime behind them to reduce friction and protect their soft bodies.',
    question: 'How does a snail protect its soft body from predators?',
    options: ['It runs away very fast', 'It retracts into its hard calcium shell', 'It stings with poisonous claws'],
    correctIndex: 1,
    x: 235,
    y: 365,
    radius: 22,
    color: '#854d0e'
  }
];

export default function VirtualBiodiversityExplorer({ onBackToDashboard }) {
  const [selectedId, setSelectedId] = useState(null);
  const [notebook, setNotebook] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionError, setQuestionError] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const activeOrganism = ORGANISMS.find(o => o.id === selectedId);
  const loggedCount = Object.keys(notebook).length;
  const isComplete = loggedCount === ORGANISMS.length;

  const handleSelectHotspot = (id) => {
    setSelectedId(id);
    setSelectedAnswer(null);
    setQuestionError(false);
  };

  const handleLogToNotebook = () => {
    if (selectedAnswer === null) {
      setQuestionError(true);
      return;
    }

    if (selectedAnswer !== activeOrganism.correctIndex) {
      setQuestionError(true);
      return;
    }

    // Correct answer - Log it
    const newNotebook = { ...notebook, [activeOrganism.id]: true };
    setNotebook(newNotebook);
    setSelectedId(null);
    setSelectedAnswer(null);
    setQuestionError(false);

    // Trigger success audio or celebrate
    if (Object.keys(newNotebook).length === ORGANISMS.length) {
      setShowCertificate(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setNotebook({});
    setSelectedId(null);
    setSelectedAnswer(null);
    setQuestionError(false);
    setShowCertificate(false);
  };

  return (
    <div style={{
      position: 'relative',
      height: '100%',
      width: '100%',
      minHeight: '600px',
      background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
      color: 'var(--text-primary)',
      fontFamily: 'system-ui, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Floating Control Panel */}
      <aside className="glass-panel" style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '1.5rem',
        width: '340px',
        background: 'rgba(var(--card-bg-rgb), 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        zIndex: 10
      }}>
        {/* Back Button & Mission */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={onBackToDashboard}
            style={{
              background: 'rgba(0,0,0,0.1)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-heading)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
              padding: '0.4rem 0.8rem',
              fontWeight: 600,
              width: 'max-content'
            }}
          >
            <ArrowLeft size={16} /> Back to Chapters
          </button>
          
          <div style={{
            background: 'var(--accent-bg)',
            borderLeft: '3px solid var(--accent)',
            padding: '0.5rem 0.75rem',
            borderRadius: '0 8px 8px 0',
          }}>
            <strong style={{ color: 'var(--accent)', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              Your Mission:
            </strong>
            <span style={{ fontSize: '0.75rem', lineHeight: '1.3', color: 'var(--text-secondary)' }}>
              Explore the garden. Find and log all 8 organisms.
            </span>
          </div>
        </div>

        {/* Notebook Checklist (Grid) */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-light)',
          padding: '0.75rem 1rem',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{
              margin: 0,
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-heading)'
            }}>
              📓 Notebook ({loggedCount}/8)
            </h3>
            <button
              onClick={handleReset}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <RefreshCw size={10} /> Reset Log
            </button>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '0.5rem'
          }}>
            {ORGANISMS.map(org => {
              const isLogged = notebook[org.id];
              return (
                <div
                  key={org.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    color: isLogged ? 'var(--text-primary)' : 'var(--text-muted)'
                  }}
                >
                  <CheckCircle2
                    size={12}
                    color={isLogged ? 'var(--success)' : 'var(--text-faint)'}
                    fill={isLogged ? 'var(--success-bg)' : 'none'}
                  />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{org.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Exploration Pane */}
      <main style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden'
      }}>
        {/* SVG Ecosystem Graphics */}
        <svg width="100%" height="100%" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="sunGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="orangeWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="60%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <radialGradient id="frogBodyGrad" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="70%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </radialGradient>
              <linearGradient id="snailBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fef9c3" />
                <stop offset="70%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#fde047" />
              </linearGradient>
              <radialGradient id="snailShellGrad" cx="40%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="70%" stopColor="#92400e" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>
              <linearGradient id="crowBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              <linearGradient id="antBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#090d16" />
              </linearGradient>
              <radialGradient id="hibiscusPetalGrad" cx="0%" cy="0%" r="100%">
                <stop offset="0%" stopColor="#9f1239" />
                <stop offset="40%" stopColor="#f43f5e" />
                <stop offset="90%" stopColor="#fda4af" />
                <stop offset="100%" stopColor="#ffe4e6" />
              </radialGradient>
              <linearGradient id="tulsiLeafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#065f46" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>

              {/* Dilate Morphology filters for crisp, bright outline borders */}
              <filter id="neemOutline" x="-20%" y="-20%" width="140%" height="140%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="0.8" result="dilated" />
                <feFlood floodColor="#86efac" result="flood" />
                <feComposite in="flood" in2="dilated" operator="in" result="outline" />
                <feMerge>
                  <feMergeNode in="outline" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="hibiscusOutline" x="-20%" y="-20%" width="140%" height="140%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="0.8" result="dilated" />
                <feFlood floodColor="#ffffff" result="flood" />
                <feComposite in="flood" in2="dilated" operator="in" result="outline" />
                <feMerge>
                  <feMergeNode in="outline" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="tulsiOutline" x="-20%" y="-20%" width="140%" height="140%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="0.8" result="dilated" />
                <feFlood floodColor="#d8b4fe" result="flood" />
                <feComposite in="flood" in2="dilated" operator="in" result="outline" />
                <feMerge>
                  <feMergeNode in="outline" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="butterflyOutline" x="-20%" y="-20%" width="140%" height="140%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="1.2" result="dilated" />
                <feFlood floodColor="#fef08a" result="flood" />
                <feComposite in="flood" in2="dilated" operator="in" result="outline" />
                <feMerge>
                  <feMergeNode in="outline" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="crowOutline" x="-20%" y="-20%" width="140%" height="140%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="1.2" result="dilated" />
                <feFlood floodColor="#ffffff" result="flood" />
                <feComposite in="flood" in2="dilated" operator="in" result="outline" />
                <feMerge>
                  <feMergeNode in="outline" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="antOutline" x="-20%" y="-20%" width="140%" height="140%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="1.2" result="dilated" />
                <feFlood floodColor="#67e8f9" result="flood" />
                <feComposite in="flood" in2="dilated" operator="in" result="outline" />
                <feMerge>
                  <feMergeNode in="outline" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="frogOutline" x="-20%" y="-20%" width="140%" height="140%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="1.2" result="dilated" />
                <feFlood floodColor="#86efac" result="flood" />
                <feComposite in="flood" in2="dilated" operator="in" result="outline" />
                <feMerge>
                  <feMergeNode in="outline" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="snailOutline" x="-20%" y="-20%" width="140%" height="140%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="1.2" result="dilated" />
                <feFlood floodColor="#fef08a" result="flood" />
                <feComposite in="flood" in2="dilated" operator="in" result="outline" />
                <feMerge>
                  <feMergeNode in="outline" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <style>{`
              @keyframes flap {
                0%, 100% { transform: scaleX(1); }
                50% { transform: scaleX(0.2); }
              }
              @keyframes flightPath {
                0% { transform: translate(160px, 240px) rotate(0deg); }
                25% { transform: translate(185px, 220px) rotate(15deg); }
                50% { transform: translate(210px, 250px) rotate(-10deg); }
                75% { transform: translate(175px, 270px) rotate(20deg); }
                100% { transform: translate(160px, 240px) rotate(0deg); }
              }
              @keyframes antCrawl {
                0% { transform: translate(450px, 300px) rotate(-90deg) scale(0.65); }
                50% { transform: translate(450px, 220px) rotate(-90deg) scale(0.65); }
                100% { transform: translate(450px, 300px) rotate(-90deg) scale(0.65); }
              }
              @keyframes frogPuff {
                0%, 100% { transform: translate(320px, 270px) scale(1.05); }
                50% { transform: translate(320px, 270px) scale(1.15); }
              }
              @keyframes snailMove {
                0% { transform: translate(235px, 365px) scale(1.1); }
                50% { transform: translate(255px, 363px) scale(1.1); }
                100% { transform: translate(235px, 365px) scale(1.1); }
              }
              @keyframes sunPulse {
                0%, 100% { transform: scale(1); opacity: 0.25; }
                50% { transform: scale(1.15); opacity: 0.45; }
              }
              @keyframes crowTilt {
                0%, 100% { transform: translate(390px, 100px) scale(1.05) rotate(0deg); }
                30% { transform: translate(390px, 100px) scale(1.05) rotate(-15deg); }
                40% { transform: translate(390px, 100px) scale(1.05) rotate(10deg); }
                70% { transform: translate(390px, 100px) scale(1.05) rotate(0deg); }
              }
              @keyframes leafFallOne {
                0% { transform: translate(490px, 70px) rotate(0deg); opacity: 0; }
                10% { opacity: 0.7; }
                90% { opacity: 0.7; }
                100% { transform: translate(410px, 290px) rotate(420deg); opacity: 0; }
              }
              @keyframes leafFallTwo {
                0% { transform: translate(520px, 50px) rotate(0deg); opacity: 0; }
                10% { opacity: 0.7; }
                90% { opacity: 0.7; }
                100% { transform: translate(470px, 250px) rotate(-380deg); opacity: 0; }
              }

              /* Pulsing glow outlines for organisms */
              @keyframes glowOrange {
                0%, 100% { filter: url(#butterflyOutline) drop-shadow(0 0 3px rgba(249, 115, 22, 0.75)); }
                50% { filter: url(#butterflyOutline) drop-shadow(0 0 12px rgba(249, 115, 22, 1)); }
              }
              @keyframes glowGreen {
                0%, 100% { filter: url(#frogOutline) drop-shadow(0 0 3px rgba(16, 185, 129, 0.75)); }
                50% { filter: url(#frogOutline) drop-shadow(0 0 12px rgba(16, 185, 129, 1)); }
              }
              @keyframes glowNeem {
                0%, 100% { filter: url(#neemOutline) drop-shadow(0 0 3px rgba(16, 185, 129, 0.75)); }
                50% { filter: url(#neemOutline) drop-shadow(0 0 12px rgba(16, 185, 129, 1)); }
              }
              @keyframes glowGold {
                0%, 100% { filter: url(#snailOutline) drop-shadow(0 0 3px rgba(234, 179, 8, 0.75)); }
                50% { filter: url(#snailOutline) drop-shadow(0 0 12px rgba(234, 179, 8, 1)); }
              }
              @keyframes glowPurple {
                0%, 100% { filter: url(#tulsiOutline) drop-shadow(0 0 3px rgba(168, 85, 247, 0.75)); }
                50% { filter: url(#tulsiOutline) drop-shadow(0 0 12px rgba(168, 85, 247, 1)); }
              }
              @keyframes glowRed {
                0%, 100% { filter: url(#hibiscusOutline) drop-shadow(0 0 3px rgba(239, 68, 68, 0.75)); }
                50% { filter: url(#hibiscusOutline) drop-shadow(0 0 12px rgba(239, 68, 68, 1)); }
              }
              @keyframes glowCyan {
                0%, 100% { filter: url(#antOutline) drop-shadow(0 0 3px rgba(6, 182, 212, 0.75)); }
                50% { filter: url(#antOutline) drop-shadow(0 0 12px rgba(6, 182, 212, 1)); }
              }
              @keyframes glowGrey {
                0%, 100% { filter: url(#crowOutline) drop-shadow(0 0 3px rgba(255, 255, 255, 0.75)); }
                50% { filter: url(#crowOutline) drop-shadow(0 0 12px rgba(255, 255, 255, 1)); }
              }

              .butterfly-glow { animation: glowOrange 2s infinite ease-in-out; }
              .frog-glow { animation: glowGreen 2s infinite ease-in-out; }
              .snail-glow { animation: glowGold 2s infinite ease-in-out; }
              .crow-glow { animation: glowGrey 2s infinite ease-in-out; }
              .ant-glow { animation: glowCyan 2s infinite ease-in-out; }
              .neem-glow { animation: glowNeem 2.4s infinite ease-in-out; }
              .hibiscus-glow { animation: glowRed 2.4s infinite ease-in-out; }
              .tulsi-glow { animation: glowPurple 2.4s infinite ease-in-out; }

              .logged-glow { filter: none !important; opacity: 0.95; }

              /* Transparent click hotspots */
              .hotspot-btn {
                border: none !important;
                background: transparent !important;
                box-shadow: none !important;
                cursor: pointer !important;
                outline: none !important;
              }

              /* Direct hover styles for SVG groups */
              .neem-glow:hover, .neem-glow:focus-visible {
                filter: url(#neemOutline) drop-shadow(0 0 16px rgba(16, 185, 129, 1)) !important;
              }
              .hibiscus-glow:hover, .hibiscus-glow:focus-visible {
                filter: url(#hibiscusOutline) drop-shadow(0 0 16px rgba(239, 68, 68, 1)) !important;
              }
              .tulsi-glow:hover, .tulsi-glow:focus-visible {
                filter: url(#tulsiOutline) drop-shadow(0 0 16px rgba(168, 85, 247, 1)) !important;
              }
              .butterfly-glow:hover, .butterfly-glow:focus-visible {
                filter: url(#butterflyOutline) drop-shadow(0 0 16px rgba(249, 115, 22, 1)) !important;
              }
              .crow-glow:hover, .crow-glow:focus-visible {
                filter: url(#crowOutline) drop-shadow(0 0 16px rgba(255, 255, 255, 1)) !important;
              }
              .ant-glow:hover, .ant-glow:focus-visible {
                filter: url(#antOutline) drop-shadow(0 0 16px rgba(6, 182, 212, 1)) !important;
              }
              .frog-glow:hover, .frog-glow:focus-visible {
                filter: url(#frogOutline) drop-shadow(0 0 16px rgba(34, 197, 94, 1)) !important;
              }
              .snail-glow:hover, .snail-glow:focus-visible {
                filter: url(#snailOutline) drop-shadow(0 0 16px rgba(234, 179, 8, 1)) !important;
              }
            `}</style>

            {/* Photorealistic Background Image with Translucent Opacity */}
            <image href="/school_garden_bg.png" width="100%" height="100%" preserveAspectRatio="none" opacity="0.85" />

            {/* Sun Rays Pulsing Overlay */}
            <circle cx="70" cy="65" r="45" fill="url(#sunGlowGrad)" style={{ animation: 'sunPulse 6s infinite ease-in-out', transformOrigin: '70px 65px' }} />

            {/* Pond Water Ripples */}
            <ellipse cx="320" cy="290" rx="35" ry="12" fill="none" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5">
              <animate attributeName="rx" values="15;95" dur="4s" repeatCount="indefinite" />
              <animate attributeName="ry" values="5;32" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="4s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="320" cy="290" rx="35" ry="12" fill="none" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5">
              <animate attributeName="rx" values="15;95" dur="4s" begin="2s" repeatCount="indefinite" />
              <animate attributeName="ry" values="5;32" dur="4s" begin="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="4s" begin="2s" repeatCount="indefinite" />
            </ellipse>

            {/* Glowing Neem Tree Leaf branch overlay */}
            <g 
              transform="translate(475, 95) scale(1.15)" 
              className={notebook.neem ? 'logged-glow' : 'neem-glow'}
              onClick={() => handleSelectHotspot('neem')}
              style={{ cursor: 'pointer', outline: 'none' }}
              tabIndex={0}
              role="button"
              aria-label="Neem Tree"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectHotspot('neem'); }}
            >
              {/* Flexible solid circular hitbox */}
              <circle cx="15" cy="20" r="45" fill="transparent" pointerEvents="all" />
              {/* Main woody stem */}
              <path d="M -5 45 Q 12 18 35 0" fill="none" stroke="#78350f" strokeWidth="2" />
              <path d="M -5 45 Q 12 18 35 0" fill="none" stroke="#047857" strokeWidth="1" strokeDasharray="1,1" />

              {/* Compound Pinnate Leaflets with veins */}
              {/* Leaflet 1 (Top tip) */}
              <g transform="translate(35, 0) rotate(-15)">
                <path d="M 0 0 C 5 -5 12 -5 15 0 C 12 5 5 5 0 0" fill="#10b981" stroke="#047857" strokeWidth="0.6" />
                <line x1="0" y1="0" x2="10" y2="0" stroke="#065f46" strokeWidth="0.4" />
              </g>
              {/* Pair 1 */}
              <g transform="translate(25, 8) rotate(-45)">
                <path d="M 0 0 C 5 -5 12 -5 15 0 C 12 5 5 5 0 0" fill="#10b981" stroke="#047857" strokeWidth="0.6" />
                <line x1="0" y1="0" x2="10" y2="0" stroke="#065f46" strokeWidth="0.4" />
              </g>
              <g transform="translate(27, 6) rotate(15)">
                <path d="M 0 0 C 5 -5 12 -5 15 0 C 12 5 5 5 0 0" fill="#059669" stroke="#047857" strokeWidth="0.6" />
                <line x1="0" y1="0" x2="10" y2="0" stroke="#065f46" strokeWidth="0.4" />
              </g>
              {/* Pair 2 */}
              <g transform="translate(15, 17) rotate(-55)">
                <path d="M 0 0 C 6 -6 14 -5 17 0 C 14 6 6 6 0 0" fill="#10b981" stroke="#047857" strokeWidth="0.6" />
                <line x1="0" y1="0" x2="11" y2="0" stroke="#065f46" strokeWidth="0.4" />
              </g>
              <g transform="translate(17, 14) rotate(5)">
                <path d="M 0 0 C 6 -6 14 -5 17 0 C 14 6 6 6 0 0" fill="#059669" stroke="#047857" strokeWidth="0.6" />
                <line x1="0" y1="0" x2="11" y2="0" stroke="#065f46" strokeWidth="0.4" />
              </g>
              {/* Pair 3 */}
              <g transform="translate(5, 27) rotate(-65)">
                <path d="M 0 0 C 7 -7 16 -6 19 0 C 16 7 7 7 0 0" fill="#10b981" stroke="#047857" strokeWidth="0.6" />
                <line x1="0" y1="0" x2="13" y2="0" stroke="#065f46" strokeWidth="0.4" />
              </g>
              <g transform="translate(7, 24) rotate(-5)">
                <path d="M 0 0 C 7 -7 16 -6 19 0 C 16 7 7 7 0 0" fill="#059669" stroke="#047857" strokeWidth="0.6" />
                <line x1="0" y1="0" x2="13" y2="0" stroke="#065f46" strokeWidth="0.4" />
              </g>
            </g>

            {/* Glowing Hibiscus Shrub flower overlay */}
            <g 
              transform="translate(95, 250) scale(1.2)" 
              className={notebook.hibiscus ? 'logged-glow' : 'hibiscus-glow'}
              onClick={() => handleSelectHotspot('hibiscus')}
              style={{ cursor: 'pointer', outline: 'none' }}
              tabIndex={0}
              role="button"
              aria-label="Hibiscus Shrub"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectHotspot('hibiscus'); }}
            >
              {/* Flexible solid circular hitbox */}
              <circle cx="0" cy="-5" r="40" fill="transparent" pointerEvents="all" />
              {/* Petal 1 */}
              <path d="M 0 0 C -12 -5 -15 -18 -5 -20 C 5 -22 8 -8 0 0" fill="url(#hibiscusPetalGrad)" opacity="0.95" />
              {/* Petal 2 */}
              <path d="M 0 0 C -16 5 -22 -5 -18 -14 C -14 -22 -2 -14 0 0" fill="url(#hibiscusPetalGrad)" opacity="0.95" />
              {/* Petal 3 */}
              <path d="M 0 0 C -14 14 -2 22 4 15 C 8 8 5 -5 0 0" fill="url(#hibiscusPetalGrad)" opacity="0.95" />
              {/* Petal 4 */}
              <path d="M 0 0 C 12 12 18 -2 12 -12 C 6 -20 -2 -10 0 0" fill="url(#hibiscusPetalGrad)" opacity="0.95" />
              {/* Petal 5 */}
              <path d="M 0 0 C 16 -5 18 -18 8 -22 C -2 -24 -8 -10 0 0" fill="url(#hibiscusPetalGrad)" opacity="0.95" />
              
              {/* Petal Veins */}
              <path d="M 0 0 Q -8 -10 -4 -16 M 0 0 Q -12 -5 -14 -10 M 0 0 Q -8 8 -2 12 M 0 0 Q 8 4 10 -4 M 0 0 Q 8 -12 4 -18" fill="none" stroke="#be123c" strokeWidth="0.6" opacity="0.7" />

              {/* Center Dark Core */}
              <circle cx="0" cy="0" r="4.5" fill="#881337" />

              {/* Long elegant staminal column */}
              <path d="M 0 0 Q 8 -10 14 -18" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              {/* Pollen buds at the tip */}
              <circle cx="14" cy="-18" r="1.5" fill="#f59e0b" />
              <circle cx="12" cy="-19" r="1.2" fill="#fbbf24" />
              <circle cx="16" cy="-17" r="1.2" fill="#fbbf24" />
              <circle cx="15" cy="-21" r="1" fill="#fde047" />
              <circle cx="10" cy="-17" r="1" fill="#fde047" />
            </g>

            {/* Glowing Tulsi Herb overlay */}
            <g 
              transform="translate(100, 360) scale(1.15)" 
              className={notebook.tulsi ? 'logged-glow' : 'tulsi-glow'}
              onClick={() => handleSelectHotspot('tulsi')}
              style={{ cursor: 'pointer', outline: 'none' }}
              tabIndex={0}
              role="button"
              aria-label="Tulsi Herb"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectHotspot('tulsi'); }}
            >
              {/* Flexible solid circular hitbox */}
              <circle cx="0" cy="5" r="35" fill="transparent" pointerEvents="all" />
              {/* Branch stems */}
              <path d="M 0 25 Q -10 5 -15 -10" fill="none" stroke="#047857" strokeWidth="1.5" />
              <path d="M 0 25 Q 10 5 15 -10" fill="none" stroke="#047857" strokeWidth="1.5" />
              <path d="M 0 25 Q 0 0 0 -18" fill="none" stroke="#047857" strokeWidth="1.8" />

              {/* Leaves with serrated outlines and green gradient */}
              <g transform="translate(-10, 8) rotate(-35)">
                <path d="M 0 0 C -8 -4 -12 2 -14 -3 C -10 -8 -4 -6 0 0" fill="url(#tulsiLeafGrad)" stroke="#115e59" strokeWidth="0.5" />
                <line x1="0" y1="0" x2="-8" y2="-2" stroke="#065f46" strokeWidth="0.4" />
              </g>
              <g transform="translate(10, 8) rotate(35)">
                <path d="M 0 0 C 8 -4 12 2 14 -3 C 10 -8 4 -6 0 0" fill="url(#tulsiLeafGrad)" stroke="#115e59" strokeWidth="0.5" />
                <line x1="0" y1="0" x2="8" y2="-2" stroke="#065f46" strokeWidth="0.4" />
              </g>
              <g transform="translate(-12, -4) rotate(-20)">
                <path d="M 0 0 C -6 -3 -10 2 -12 -2 C -8 -6 -3 -5 0 0" fill="url(#tulsiLeafGrad)" stroke="#115e59" strokeWidth="0.5" />
                <line x1="0" y1="0" x2="-8" y2="-1" stroke="#065f46" strokeWidth="0.4" />
              </g>
              <g transform="translate(12, -4) rotate(20)">
                <path d="M 0 0 C 6 -3 10 2 12 -2 C 8 -6 3 -5 0 0" fill="url(#tulsiLeafGrad)" stroke="#115e59" strokeWidth="0.5" />
                <line x1="0" y1="0" x2="8" y2="-1" stroke="#065f46" strokeWidth="0.4" />
              </g>

              {/* Purple flower spikes */}
              <g transform="translate(0, -18)">
                <line x1="0" y1="0" x2="0" y2="-15" stroke="#a855f7" strokeWidth="1.5" />
                <circle cx="0" cy="-3" r="1.5" fill="#c084fc" />
                <circle cx="0" cy="-6" r="1.5" fill="#c084fc" />
                <circle cx="0" cy="-9" r="1.2" fill="#d8b4fe" />
                <circle cx="0" cy="-12" r="1" fill="#e9d5ff" />
              </g>
              <g transform="translate(-15, -10) rotate(-15)">
                <line x1="0" y1="0" x2="0" y2="-12" stroke="#a855f7" strokeWidth="1.2" />
                <circle cx="0" cy="-2" r="1.2" fill="#c084fc" />
                <circle cx="0" cy="-5" r="1.2" fill="#c084fc" />
                <circle cx="0" cy="-8" r="1" fill="#d8b4fe" />
              </g>
              <g transform="translate(15, -10) rotate(15)">
                <line x1="0" y1="0" x2="0" y2="-12" stroke="#a855f7" strokeWidth="1.2" />
                <circle cx="0" cy="-2" r="1.2" fill="#c084fc" />
                <circle cx="0" cy="-5" r="1.2" fill="#c084fc" />
                <circle cx="0" cy="-8" r="1" fill="#d8b4fe" />
              </g>
            </g>

            {/* Indian Pond Frog overlay (with breathing animation) */}
            <g 
              style={{ animation: 'frogPuff 3s infinite ease-in-out', cursor: 'pointer', outline: 'none' }}
              onClick={() => handleSelectHotspot('frog')}
              tabIndex={0}
              role="button"
              aria-label="Indian Pond Frog"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectHotspot('frog'); }}
            >
              <g className={notebook.frog ? 'logged-glow' : 'frog-glow'}>
                {/* Flexible solid circular hitbox */}
                <circle cx="0" cy="5" r="30" fill="transparent" pointerEvents="all" />
              {/* Webbed Back Feet */}
              <path d="M -15 8 C -22 6 -28 14 -20 18 C -16 20 -10 14 -12 8" fill="#15803d" stroke="#14532d" strokeWidth="1" />
              <path d="M 15 8 C 22 6 28 14 20 18 C 16 20 10 14 12 8" fill="#15803d" stroke="#14532d" strokeWidth="1" />
              
              {/* Front Limbs */}
              <path d="M -8 10 L -12 18 C -14 21 -10 23 -8 20 L -4 12" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
              <path d="M 8 10 L 12 18 C 14 21 10 23 8 20 L 4 12" fill="#22c55e" stroke="#15803d" strokeWidth="1" />

              {/* Body with rich green radial gradient */}
              <ellipse cx="0" cy="7" rx="14" ry="11" fill="url(#frogBodyGrad)" stroke="#15803d" strokeWidth="1.5" />
              
              {/* Light green spots on back */}
              <circle cx="-6" cy="4" r="2" fill="#4ade80" opacity="0.6" />
              <circle cx="6" cy="6" r="1.5" fill="#4ade80" opacity="0.6" />
              <circle cx="-2" cy="11" r="1.8" fill="#4ade80" opacity="0.6" />
              
              {/* Throat that puffs */}
              <ellipse cx="0" cy="0" rx="9" ry="6" fill="#fef08a" opacity="0.8" />

              {/* Head */}
              <ellipse cx="0" cy="-3" rx="10" ry="8" fill="url(#frogBodyGrad)" stroke="#15803d" strokeWidth="1.5" />

              {/* Expressive big eyes */}
              <circle cx="-5" cy="-8" r="4.5" fill="#fbbf24" stroke="#15803d" strokeWidth="0.8" />
              <circle cx="-5" cy="-8" r="2" fill="#000" />
              <circle cx="-6" cy="-9.5" r="0.8" fill="#fff" />
              
              <circle cx="5" cy="-8" r="4.5" fill="#fbbf24" stroke="#15803d" strokeWidth="0.8" />
              <circle cx="5" cy="-8" r="2" fill="#000" />
              <circle cx="4" cy="-9.5" r="0.8" fill="#fff" />

              {/* Smiling mouth and nose dots */}
              <path d="M -5 1 Q 0 4 5 1" fill="none" stroke="#14532d" strokeWidth="1.5" />
              <circle cx="-1.5" cy="-2.5" r="0.4" fill="#14532d" />
              <circle cx="1.5" cy="-2.5" r="0.4" fill="#14532d" />
            </g>
            </g>

            {/* Snail overlay (with slow crawling animation) */}
            <g 
              style={{ animation: 'snailMove 25s infinite linear', cursor: 'pointer', outline: 'none' }}
              onClick={() => handleSelectHotspot('snail')}
              tabIndex={0}
              role="button"
              aria-label="Garden Snail"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectHotspot('snail'); }}
            >
              <g className={notebook.snail ? 'logged-glow' : 'snail-glow'}>
                {/* Flexible solid circular hitbox */}
                <circle cx="-3" cy="2" r="25" fill="transparent" pointerEvents="all" />
              {/* Slime trail */}
              <path d="M -22 5 Q -10 4 0 5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeDasharray="3,3" />
              
              {/* Snail Foot (slithering body) with yellow gradient */}
              <path d="M -22 5 C -15 5 -10 7 0 7 C 8 7 14 5 17 1 C 19 -2 15 -4 11 -3 C 8 -2 5 0 -22 5" fill="url(#snailBodyGrad)" stroke="#ca8a04" strokeWidth="0.8" />
              
              {/* Swirly 3D Shell */}
              <g transform="translate(-4, -1)">
                <circle cx="0" cy="0" r="9" fill="url(#snailShellGrad)" stroke="#78350f" strokeWidth="1" />
                <path d="M 0 0 C 4 3 6 -2 3 -5 C 0 -8 -6 -3 -3 2 C 0 6 7 2 5 -4" fill="none" stroke="#78350f" strokeWidth="1" />
              </g>

              {/* Eye Tentacles */}
              <line x1="12" y1="-2" x2="15" y2="-9" stroke="#fde047" strokeWidth="1.5" />
              <line x1="9" y1="-2" x2="11" y2="-9" stroke="#fde047" strokeWidth="1.5" />
              <circle cx="15" cy="-9" r="1.2" fill="#78350f" />
              <circle cx="15.2" cy="-9.2" r="0.4" fill="#fff" />
              <circle cx="11" cy="-9" r="1.2" fill="#78350f" />
              <circle cx="11.2" cy="-9.2" r="0.4" fill="#fff" />
              
              {/* Lower sensory tentacles */}
              <line x1="14" y1="1" x2="16" y2="-1" stroke="#fde047" strokeWidth="1" />
              <line x1="12" y1="2" x2="13.5" y2="0.5" stroke="#fde047" strokeWidth="1" />
            </g>
            </g>

            {/* House Crow perched overlay (with head bobbing) */}
            <g 
              style={{ animation: 'crowTilt 9s infinite ease-in-out', transformOrigin: '6px -5px', cursor: 'pointer', outline: 'none' }}
              onClick={() => handleSelectHotspot('crow')}
              tabIndex={0}
              role="button"
              aria-label="House Crow"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectHotspot('crow'); }}
            >
              <g className={notebook.crow ? 'logged-glow' : 'crow-glow'}>
                {/* Flexible solid circular hitbox */}
                <circle cx="2" cy="4" r="25" fill="transparent" pointerEvents="all" />
              {/* Claws gripping the branch */}
              <path d="M 0 6 Q -3 10 -4 14 M 2 6 Q 0 10 -1 14" stroke="#0f172a" strokeWidth="1.8" fill="none" />
              <path d="M 5 6 Q 3 10 2 14 M 7 6 Q 5 10 4 14" stroke="#0f172a" strokeWidth="1.8" fill="none" />
              
              {/* Tail Feathers */}
              <path d="M -10 3 L -26 14 L -21 17 L -7 5 Z" fill="#0f172a" />
              <path d="M -9 4 L -28 9 L -24 12 L -6 6 Z" fill="#1e293b" />
              
              {/* Wings folded */}
              <path d="M -8 1 C -18 3 -12 12 -3 8 C 3 5 0 2 -8 1" fill="#0f172a" stroke="#1e293b" strokeWidth="0.5" />

              {/* Body (glossy black-blue gradient) */}
              <ellipse cx="0" cy="2" rx="11" ry="8" fill="url(#crowBodyGrad)" stroke="#0f172a" strokeWidth="0.8" />
              
              {/* Grey Neck Collar */}
              <path d="M 4 -2 C 2 -6 8 -4 6 1 C 5 4 1 2 4 -2" fill="#475569" />

              {/* Head */}
              <circle cx="7" cy="-5" r="5.5" fill="#0f172a" />

              {/* Sharp Crow Beak */}
              <path d="M 12 -7 L 20 -5 L 11 -2 Z" fill="#0f172a" stroke="#0f172a" strokeWidth="0.5" />
              <path d="M 11.5 -4.5 L 18 -5" stroke="#1e293b" strokeWidth="0.6" />

              {/* Crow Eye */}
              <circle cx="8" cy="-6" r="1.5" fill="#fff" />
              <circle cx="8" cy="-6" r="0.8" fill="#000" />
              <circle cx="8.3" cy="-6.3" r="0.3" fill="#fff" />
            </g>
            </g>

            {/* Ant crawling up Neem Trunk */}
            <g 
              style={{ animation: 'antCrawl 15s infinite linear', cursor: 'pointer', outline: 'none' }}
              onClick={() => handleSelectHotspot('ant')}
              tabIndex={0}
              role="button"
              aria-label="Black Garden Ant"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectHotspot('ant'); }}
            >
              <g className={notebook.ant ? 'logged-glow' : 'ant-glow'}>
                {/* Flexible solid circular hitbox */}
                <circle cx="-3" cy="0" r="20" fill="transparent" pointerEvents="all" />
              {/* Abdomen segmented */}
              <ellipse cx="-8" cy="0" rx="5" ry="3.5" fill="url(#antBodyGrad)" stroke="#090d16" strokeWidth="0.5" />
              <path d="M -9 -3 L -9 3" stroke="#1e293b" strokeWidth="0.5" />
              <path d="M -7 -3 L -7 3" stroke="#1e293b" strokeWidth="0.5" />

              {/* Thorax */}
              <ellipse cx="-2" cy="0" rx="2.5" ry="2.2" fill="#0f172a" />

              {/* Head */}
              <circle cx="3" cy="0" r="2.8" fill="url(#antBodyGrad)" />
              <circle cx="3.8" cy="-1" r="0.5" fill="#fff" />
              {/* Mandibles */}
              <path d="M 5 -1 Q 7 -1.5 6.5 0.5" fill="none" stroke="#090d16" strokeWidth="0.8" />
              <path d="M 5 1 Q 7 1.5 6.5 -0.5" fill="none" stroke="#090d16" strokeWidth="0.8" />

              {/* Jointed legs */}
              <path d="M -3 0 Q -5 -6 -9 -5" fill="none" stroke="#090d16" strokeWidth="1" />
              <path d="M -3 0 Q -5 6 -9 5" fill="none" stroke="#090d16" strokeWidth="1" />
              <path d="M -2 0 Q -2 -6 -4 -7" fill="none" stroke="#090d16" strokeWidth="1" />
              <path d="M -2 0 Q -2 6 -4 7" fill="none" stroke="#090d16" strokeWidth="1" />
              <path d="M -1 0 Q 1 -5 1 -8" fill="none" stroke="#090d16" strokeWidth="1" />
              <path d="M -1 0 Q 1 5 1 8" fill="none" stroke="#090d16" strokeWidth="1" />

              {/* Antennae */}
              <path d="M 4 -1.5 Q 7 -4 10 -3" fill="none" stroke="#0f172a" strokeWidth="0.7" />
              <path d="M 4 1.5 Q 7 4 10 3" fill="none" stroke="#0f172a" strokeWidth="0.7" />
            </g>
            </g>

            {/* Monarch Butterfly flying & flapping wings */}
            <g 
              style={{ animation: 'flightPath 10s infinite linear', cursor: 'pointer', outline: 'none' }}
              onClick={() => handleSelectHotspot('butterfly')}
              tabIndex={0}
              role="button"
              aria-label="Monarch Butterfly"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectHotspot('butterfly'); }}
            >
              <g transform="scale(1.0)" className={notebook.butterfly ? 'logged-glow' : 'butterfly-glow'}>
                {/* Flexible solid circular hitbox */}
                <circle cx="0" cy="0" r="28" fill="transparent" pointerEvents="all" />
                <g style={{ animation: 'flap 0.12s infinite ease-in-out', transformOrigin: '0px 0px' }}>
                  {/* Back wings */}
                  <path d="M 0 2 C -8 10 -15 15 -18 5 C -20 -3 -10 -5 0 2" fill="url(#orangeWingGrad)" stroke="#1e293b" strokeWidth="1" />
                  <path d="M 0 2 C 8 10 15 15 18 5 C 20 -3 10 -5 0 2" fill="url(#orangeWingGrad)" stroke="#1e293b" strokeWidth="1" />
                  
                  {/* Front wings */}
                  <path d="M 0 0 C -12 -16 -28 -8 -26 4 C -24 12 -10 6 0 2" fill="url(#orangeWingGrad)" stroke="#0f172a" strokeWidth="1.5" />
                  <path d="M 0 0 C 12 -16 28 -8 26 4 C 24 12 10 6 0 2" fill="url(#orangeWingGrad)" stroke="#0f172a" strokeWidth="1.5" />
                  
                  {/* Vein details */}
                  <path d="M 0 0 Q -15 -10 -22 -4 M 0 0 Q -18 -4 -22 2 M 0 0 Q -10 -2 -18 4" fill="none" stroke="#0f172a" strokeWidth="0.8" />
                  <path d="M 0 0 Q 15 -10 22 -4 M 0 0 Q 18 -4 22 2 M 0 0 Q 10 -2 18 4" fill="none" stroke="#0f172a" strokeWidth="0.8" />
                  
                  {/* White spots */}
                  <circle cx="-24" cy="-5" r="0.8" fill="#fff" />
                  <circle cx="-22" cy="-1" r="0.8" fill="#fff" />
                  <circle cx="-23" cy="2" r="0.8" fill="#fff" />
                  <circle cx="24" cy="-5" r="0.8" fill="#fff" />
                  <circle cx="22" cy="-1" r="0.8" fill="#fff" />
                  <circle cx="23" cy="2" r="0.8" fill="#fff" />

                  {/* Body */}
                  <ellipse cx="0" cy="2" rx="2" ry="7" fill="#0f172a" />
                  <circle cx="0" cy="-6" r="2.2" fill="#0f172a" />
                  <path d="M -0.8 -7 Q -3 -12 -5 -11" fill="none" stroke="#0f172a" strokeWidth="0.8" />
                  <circle cx="-5" cy="-11" r="0.5" fill="#0f172a" />
                  <path d="M 0.8 -7 Q 3 -12 5 -11" fill="none" stroke="#0f172a" strokeWidth="0.8" />
                  <circle cx="5" cy="-11" r="0.5" fill="#0f172a" />
                </g>
              </g>
            </g>

            {/* Falling Leaves */}
            <path d="M 0 0 C -3 -5 -8 -5 -5 -1 C -2 3 -5 5 0 0 Z" fill="#15803d" opacity="0.8" style={{ animation: 'leafFallOne 14s infinite linear' }} />
            <path d="M 0 0 C -3 -5 -8 -5 -5 -1 C -2 3 -5 5 0 0 Z" fill="#22c55e" opacity="0.8" style={{ animation: 'leafFallTwo 18s infinite linear' }} />
          </svg>

        {/* Microscopic Inspection Panel Overlay */}
        {activeOrganism && (
          <div style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(250, 204, 21, 0.3)',
            padding: '1.25rem',
            borderRadius: '14px',
            width: '420px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
            zIndex: 10,
            animation: 'popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            color: 'var(--text-primary)'
          }}>
            <style>{`
              @keyframes popUp {
                0% { transform: translate(-50%, -40%) scale(0.9); opacity: 0; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
              }
            `}</style>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: activeOrganism.type === 'plant' ? 'var(--success-bg)' : 'var(--accent-bg)',
                  border: `1px solid ${activeOrganism.type === 'plant' ? 'var(--success-border)' : 'var(--accent-border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activeOrganism.type === 'plant' ? 'var(--success)' : 'var(--accent)'
                }}>
                  {activeOrganism.type === 'plant' ? '🌿' : '🐾'}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)' }}>{activeOrganism.name}</h3>
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: activeOrganism.type === 'plant' ? 'var(--success)' : 'var(--accent)', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    {activeOrganism.type} specimen
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  padding: '0 0.5rem'
                }}
              >
                ×
              </button>
            </div>

            {/* Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.5rem', fontSize: '0.8rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <div><strong>Native Habitat:</strong></div>
              <div style={{ color: 'var(--success)' }}>{activeOrganism.habitat}</div>
              <div><strong>Scientific Note:</strong></div>
              <div style={{ color: 'var(--text-secondary)', lineHeight: '1.3' }}>{activeOrganism.details}</div>
            </div>

            {/* Interesting Fact */}
            <div style={{
              background: 'var(--warning-bg)',
              borderLeft: '2px solid var(--warning)',
              padding: '0.5rem 0.75rem',
              borderRadius: '0 6px 6px 0',
              fontSize: '0.75rem',
              lineHeight: '1.3',
              color: 'var(--text-primary)',
              marginTop: '0.5rem'
            }}>
              💡 <strong>Did you know?</strong> {activeOrganism.fact}
            </div>

            {/* Quick Verification Question */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-heading)' }}>🧪 Quick Verification check:</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeOrganism.question}</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.2rem' }}>
                {activeOrganism.options.map((opt, idx) => (
                  <label
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      padding: '0.35rem 0.5rem',
                      borderRadius: '6px',
                      background: selectedAnswer === idx ? 'var(--success-bg)' : 'var(--surface)',
                      border: selectedAnswer === idx ? '1px solid var(--success)' : '1px solid var(--border-light)',
                      color: selectedAnswer === idx ? 'var(--success)' : 'var(--text-secondary)'
                    }}
                  >
                    <input
                      type="radio"
                      name="check_options"
                      checked={selectedAnswer === idx}
                      onChange={() => {
                        setSelectedAnswer(idx);
                        setQuestionError(false);
                      }}
                      style={{ display: 'none' }}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question Error Feedback */}
            {questionError && (
              <span style={{ color: 'var(--danger)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                ❌ Please select the correct verification answer to log in the notebook.
              </span>
            )}

            {/* Log Button */}
            <button
              onClick={handleLogToNotebook}
              className="primary"
              style={{
                width: '100%',
                background: 'var(--success)',
                border: '1px solid var(--success-border)',
                color: '#ffffff',
                padding: '0.55rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginTop: '1rem',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: 'var(--btn-shadow)'
              }}
            >
              Log in Notebook 📓
            </button>
          </div>
        )}

        {/* Complete Success Certificate Overlay */}
        {showCertificate && (
          <div className="glass-panel" style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--page-bg)',
            opacity: 0.95,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            zIndex: 20,
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--accent-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              marginBottom: '1rem',
              boxShadow: '0 0 20px var(--accent-bg)'
            }}>
              <Award size={48} />
            </div>

            <h2 style={{ color: 'var(--text-heading)', fontSize: '1.75rem', margin: '0 0 0.5rem 0' }}>Chapter 2 Complete!</h2>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>Junior Naturalist Certification</h3>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
              Congratulations! You successfully explored the school garden ecosystem, inspected all plant and animal species, and logged their classification characteristics correctly!
            </p>

            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-light)',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '2rem'
            }}>
              Ecosystem Score: <strong style={{ color: 'var(--success)' }}>100/100</strong>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleReset}
                className="outline"
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.85rem',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: 'none'
                }}
              >
                Explore Again
              </button>
              <button
                onClick={onBackToDashboard}
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.85rem',
                  background: '#fbbf24',
                  border: 'none',
                  color: '#022c22',
                  fontWeight: 'bold',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Back to Activities
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
