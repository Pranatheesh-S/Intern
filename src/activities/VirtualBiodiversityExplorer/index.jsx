import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, RefreshCw, Volume2, CheckCircle, ChevronRight, Award, ArrowLeft, BookOpen, Target, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import natureWalkScene from '../../assets/nature_walk_scene.png';
import { useTheme } from '../../ThemeContext.jsx';

/* ─────────────────────────────────────────────
   TARGET ORGANISMS (8 required species)
───────────────────────────────────────────── */
const TARGET_ORGANISMS = [
  {
    id: 'frog',
    name: 'Indian Pond Frog',
    emoji: '🐸',
    type: 'animal',
    x: 27, y: 83, w: 14, h: 14,
    details: 'Lives both in the freshwater pond and on moist soil shores. Its green skin is smooth, and its feet are webbed for swimming.',
    fact: 'Frogs can breathe through their lungs on land and directly through their moist skin underwater — they are true amphibians!',
    verifyQ: { q: 'What type of habitat does an Indian Pond Frog live in?', opts: ['Only on dry land', 'Only in deep ocean', 'Both in freshwater and on moist shores', 'Only in desert sand'], correct: 2 },
    tableInfo: { stem: '—', leaves: '—', flowers: '—', notes: 'Locomotion: Jumps and swims. Amphibian. Lives near pond.' },
  },
  {
    id: 'squirrel',
    name: 'Three-Striped Palm Squirrel',
    emoji: '🐿️',
    type: 'animal',
    x: 91, y: 63, w: 14, h: 22,
    details: 'A quick terrestrial rodent found climbing tree trunks, feeding on nuts, seeds, and berries. It has three distinctive pale stripes on its back.',
    fact: 'Squirrels accidentally plant thousands of trees each year by forgetting where they buried their nut stashes!',
    verifyQ: { q: 'Where would you most likely spot a Three-Striped Palm Squirrel?', opts: ['In the ocean', 'Climbing a tree trunk', 'Flying in the sky', 'Burrowing underground'], correct: 1 },
    tableInfo: { stem: '—', leaves: '—', flowers: '—', notes: 'Locomotion: Runs and climbs. Lives on trees and land.' },
  },
  {
    id: 'butterfly',
    name: 'Monarch Butterfly',
    emoji: '🦋',
    type: 'animal',
    x: 55, y: 75, w: 14, h: 14,
    details: 'A flying insect feeding on the sweet nectar of garden flowers. Moves dynamically from bloom to bloom, helping in pollination.',
    fact: 'Butterflies taste their food using tiny sensory receptors on their feet — not their mouths!',
    verifyQ: { q: 'How does a butterfly help plants?', opts: ['It eats all the leaves', 'It digs up roots', 'It helps in pollination by carrying pollen', 'It blocks sunlight'], correct: 2 },
    tableInfo: { stem: '—', leaves: '—', flowers: '—', notes: 'Locomotion: Flies using wings. Feeds on flower nectar.' },
  },
  {
    id: 'monkey',
    name: 'Rhesus Macaque (Monkey)',
    emoji: '🐒',
    type: 'animal',
    x: 81, y: 16, w: 16, h: 22,
    details: 'A wild mammal seen perched high on tree branches, jumping between trees and grooming its group members in a social fashion.',
    fact: 'Monkeys use vocal calls, facial expressions, and body language to communicate warnings, greetings, and emotions to their group!',
    verifyQ: { q: 'Which habitat do Rhesus Macaque monkeys primarily live in?', opts: ['Underground burrows', 'Treetops in forests', 'Deep ocean', 'Arctic tundra'], correct: 1 },
    tableInfo: { stem: '—', leaves: '—', flowers: '—', notes: 'Locomotion: Jumps and climbs. Lives high on trees.' },
  },
  {
    id: 'sparrow',
    name: 'House Sparrows (Perched)',
    emoji: '🐦',
    type: 'animal',
    x: 71, y: 38, w: 16, h: 14,
    details: 'Small birds chirping and resting on tree branches. They feed on insects, small seeds, and breadcrumbs near human settlements.',
    fact: 'House Sparrows have lived alongside humans for over 10,000 years — they are one of the most widespread birds on Earth!',
    verifyQ: { q: 'What do House Sparrows primarily eat?', opts: ['Large mammals', 'Insects and small seeds', 'Big fish', 'Tree bark'], correct: 1 },
    tableInfo: { stem: '—', leaves: '—', flowers: '—', notes: 'Locomotion: Flies and hops. Perches on branches.' },
  },
  {
    id: 'crow',
    name: 'House Crow (Flying)',
    emoji: '🐦‍⬛',
    type: 'animal',
    x: 29, y: 13, w: 16, h: 14,
    details: 'A grey-necked bird flying in the clear sky. Crows are scavengers that eat scraps, small pests, and seeds.',
    fact: 'Crows are remarkably intelligent — they can recognize individual human faces and even use sticks as tools to fetch food!',
    verifyQ: { q: 'What is a crow classified as in terms of its diet?', opts: ['Pure herbivore', 'Scavenger that eats scraps and pests', 'Deep-sea predator', 'Insect only feeder'], correct: 1 },
    tableInfo: { stem: '—', leaves: '—', flowers: '—', notes: 'Locomotion: Flies. Soars in the open air.' },
  },
  {
    id: 'rose_plants',
    name: 'Hibiscus & Rose Bushes',
    emoji: '🌺',
    type: 'plant',
    x: 10, y: 62, w: 18, h: 18,
    details: 'Flowering shrubs with multiple thin but woody stems branching near the ground level. Produce vibrant red and pink blooms.',
    fact: 'Shrubs are medium-sized plants with hard woody stems, but unlike trees they do not have a single thick main trunk!',
    verifyQ: { q: 'Which plant classification do Hibiscus and Rose Bushes belong to?', opts: ['Herbs (soft stem)', 'Trees (single thick trunk)', 'Shrubs (woody stems, no main trunk)', 'Aquatic plants'], correct: 2 },
    tableInfo: { stem: 'Hard, thin woody stems branching near base', leaves: 'Simple, alternate arrangement', flowers: 'Vibrant red and pink', notes: 'Classified as Shrub. Medium height.' },
  },
  {
    id: 'tulsi',
    name: 'Tulsi & Grass Herbs',
    emoji: '🌿',
    type: 'plant',
    x: 69, y: 89, w: 18, h: 16,
    details: 'Small leafy green plants growing close to the ground, with soft tender stems and highly aromatic leaves.',
    fact: 'Tulsi (Holy Basil) is considered sacred in India and has been used in traditional medicine for over 3,000 years!',
    verifyQ: { q: 'What is the key feature that identifies Tulsi as an herb?', opts: ['It has a thick woody trunk', 'It lives underwater', 'It has soft green non-woody stems', 'It only grows in snow'], correct: 2 },
    tableInfo: { stem: 'Soft, green, tender non-woody stem', leaves: 'Opposite simple green leaves', flowers: 'Small purplish spikes', notes: 'Classified as Herb. Very short height.' },
  },
];

/* ─────────────────────────────────────────────
   BONUS ORGANISMS (scannable for fun, no MCQ required)
   ───────────────────────────────────────────── */
const BONUS_ORGANISMS = [
  {
    id: 'peacock',
    name: 'Pond Water Lilies',
    emoji: '🪷',
    x: 17, y: 77, w: 14, h: 14,
    details: "Water lilies floating in the freshwater pond, supporting small aquatic organisms and adding biological beauty.",
    fact: "Water lily leaves have stomata on their upper surfaces instead of their lower surfaces to breathe directly in contact with air!",
  },
  {
    id: 'snail',
    name: 'Garden Snail',
    emoji: '🐌',
    x: 35, y: 86, w: 12, h: 12,
    details: "A slow-moving mollusc that carries a protective spiral shell on its back and leaves a silvery slime trail.",
    fact: "Snails cannot hear at all — they rely solely on their sense of touch and smell to find their way around!",
  }
];

const QUIZ_QUESTIONS = [
  { q: 'Why do we observe plants during the nature walk?', opts: ['To memorize their names', 'To compare their features', 'To collect all flowers', 'To remove weeds'], correct: 1, explain: 'Observation helps us compare features like leaf arrangement, stems, and heights between different plant types.' },
  { q: 'Which part of a plant can be soft or hard?', opts: ['Flower', 'Stem', 'Seed', 'Fruit'], correct: 1, explain: 'Stems can be soft and green (in herbs) or hard and woody (in shrubs and trees).' },
  { q: 'Which is the correct way to collect materials for a scrapbook?', opts: ['Pluck fresh flowers', 'Break branches', 'Collect fallen leaves', 'Remove small plants'], correct: 2, explain: 'To protect biodiversity, we should only collect fallen leaves or flowers and never harm living plants.' },
  { q: 'Why should we not disturb plants and animals?', opts: ['They may disappear forever', 'Nature should be respected', 'It wastes time', 'It is difficult'], correct: 1, explain: 'Living creatures belong to nature and should be respected. We must observe them without disturbing their habitats.' },
  { q: 'Which feature can be observed in flowers?', opts: ['Colour', 'Shape', 'Scent', 'All of these'], correct: 3, explain: 'Flowers differ in all these features—color, shape, and scent—to attract different pollinating insects.' },
  { q: 'Which observation is suitable for animals?', opts: ['Stem type', 'Leaf arrangement', 'Way they move', 'Flower colour'], correct: 2, explain: 'Unlike plants, animals are capable of locomotion. Observing how they move helps in classifying them.' },
  { q: 'Why do students record observations in a table?', opts: ['To make work longer', 'To organise information clearly', 'To decorate the notebook', 'To copy from friends'], correct: 1, explain: 'Tables help scientists organize large amounts of observation details systematically for comparison.' },
  { q: 'Which skill is most important during this activity?', opts: ['Guessing', 'Careful observation', 'Running fast', 'Drawing only'], correct: 1, explain: 'Careful observation is the key skill required in science to gather factual evidence about the natural world.' },
];

export default function VirtualBiodiversityExplorer({ onBackToDashboard }) {
  const { theme } = useTheme();
  const [phase, setPhase] = useState('intro'); // intro | game | quiz | cert
  const [notebook, setNotebook] = useState([]); // logged target IDs
  const [bonusLog, setBonusLog] = useState([]); // logged bonus IDs

  // Bounding dimensions of the container
  const [containerSize, setContainerSize] = useState({ width: 800, height: 450 });

  // Scanner state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isInsideImage, setIsInsideImage] = useState(false);
  const [hoveredTarget, setHoveredTarget] = useState(null);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [missMessage, setMissMessage] = useState('');
  const [missPos, setMissPos] = useState({ x: 0, y: 0 });

  // Floating panel / Hints
  const [showHints, setShowHints] = useState(false);
  const [isPanelHovered, setIsPanelHovered] = useState(false);

  // Popup state
  const [scannedOrganism, setScannedOrganism] = useState(null); // target or bonus
  const [isBonusScan, setIsBonusScan] = useState(false);
  const [verifyAnswer, setVerifyAnswer] = useState(null);
  const [verifyChecked, setVerifyChecked] = useState(false);
  const [verifyCorrect, setVerifyCorrect] = useState(false);

  // Quiz state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  const containerRef = useRef(null);
  const holdIntervalRef = useRef(null);

  // Clean up Speech and Intervals
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      clearInterval(holdIntervalRef.current);
    };
  }, []);

  // Update container size dynamically to keep scanner coordinates precise
  useEffect(() => {
    if (phase !== 'game' || !containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [phase]);

  // Mouse move inside canvas
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    // 1. Check required targets
    const target = TARGET_ORGANISMS.find(t =>
      pctX >= t.x - t.w / 2 && pctX <= t.x + t.w / 2 &&
      pctY >= t.y - t.h / 2 && pctY <= t.y + t.h / 2
    );

    // 2. Check bonus targets
    const bonus = BONUS_ORGANISMS.find(b =>
      pctX >= b.x - b.w / 2 && pctX <= b.x + b.w / 2 &&
      pctY >= b.y - b.h / 2 && pctY <= b.y + b.h / 2
    );

    if (target) {
      setHoveredTarget({ data: target, isBonus: false });
    } else if (bonus) {
      setHoveredTarget({ data: bonus, isBonus: true });
    } else {
      setHoveredTarget(null);
      if (isHolding) stopHolding();
    }
  }, [isHolding]);

  const startHolding = useCallback((e) => {
    if (e.button !== 0) return; // Only left click
    if (!hoveredTarget) {
      setMissMessage('Try searching another area!');
      setMissPos({ x: mousePos.x, y: mousePos.y });
      setTimeout(() => setMissMessage(''), 1400);
      return;
    }

    const { data, isBonus } = hoveredTarget;
    const isAlreadyLogged = isBonus 
      ? bonusLog.includes(data.id) 
      : notebook.includes(data.id);

    if (isAlreadyLogged) {
      setMissMessage('Already logged! ✓');
      setMissPos({ x: mousePos.x, y: mousePos.y });
      setTimeout(() => setMissMessage(''), 1400);
      return;
    }

    setIsHolding(true);
    setHoldProgress(0);
    let prog = 0;

    holdIntervalRef.current = setInterval(() => {
      prog += 8; // charges in ~1.2 seconds
      if (prog >= 100) {
        clearInterval(holdIntervalRef.current);
        setHoldProgress(100);
        setIsHolding(false);
        setScannedOrganism(data);
        setIsBonusScan(isBonus);
        setVerifyAnswer(null);
        setVerifyChecked(false);
        setVerifyCorrect(false);
      } else {
        setHoldProgress(prog);
      }
    }, 100);
  }, [hoveredTarget, mousePos, notebook, bonusLog]);

  const stopHolding = useCallback(() => {
    setIsHolding(false);
    setHoldProgress(0);
    clearInterval(holdIntervalRef.current);
  }, []);

  const logToNotebook = () => {
    if (!scannedOrganism) return;
    if (isBonusScan) {
      if (!bonusLog.includes(scannedOrganism.id)) {
        setBonusLog(prev => [...prev, scannedOrganism.id]);
      }
    } else {
      if (!notebook.includes(scannedOrganism.id)) {
        setNotebook(prev => [...prev, scannedOrganism.id]);
      }
    }
    setScannedOrganism(null);
    setVerifyAnswer(null);
    setVerifyChecked(false);
    setVerifyCorrect(false);
  };

  const handleReset = () => {
    setNotebook([]);
    setBonusLog([]);
    setScannedOrganism(null);
    stopHolding();
    setPhase('game');
    setShowHints(false);
  };

  // Quiz checks
  const handleCheckAnswer = () => {
    setQuizChecked(true);
    setQuizAnswers(prev => ({
      ...prev,
      [currentQIndex]: selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct
    }));
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setQuizChecked(false);
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setPhase('cert');
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 3rem)',
      background: 'var(--page-bg)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}>
      {/* SVG Wave filter for the scanner lens distortion */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="scanner-waves">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.08" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* ────── INTRO PHASE ────── */}
      {phase === 'intro' && (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '1160px', // Restructured: Widescreen view utilizing full space
          margin: '0 auto',
          padding: '2.5rem 1.5rem',
          boxSizing: 'border-box',
          gap: '2.5rem',
          animation: 'fadeIn 0.4s ease-out'
        }}>
          {/* Header section */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '0.95rem',
              fontWeight: 800,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '0.25rem'
            }}>
              Phase 1: Concept Introduction
            </div>
            <h1 style={{
              margin: 0,
              fontSize: '2.8rem', // larger, clearer title font
              color: 'var(--text-heading)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              Understanding Biodiversity
            </h1>
          </div>

          {/* Main Content Grid (Two Columns) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1.3fr',
            gap: '2.5rem',
            width: '100%',
            alignItems: 'stretch'
          }}>
            {/* Left Column: Interactive Icon Shield & Concept Summary */}
            <div className="glass-panel" style={{
              background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(99, 102, 241, 0.02) 100%)',
              borderRadius: '16px',
              border: '1.5px solid var(--border)',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
              textAlign: 'left',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.04)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative background element */}
              <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-20%',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              <div style={{
                background: 'rgba(99, 102, 241, 0.12)',
                borderRadius: '50%',
                padding: '2.25rem',
                border: '3px dashed var(--accent)',
                boxShadow: '0 0 35px rgba(99, 102, 241, 0.15)',
                alignSelf: 'center'
              }}>
                <Target size={60} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <p style={{
                  fontSize: '1.35rem', // increased size to match activity 2.2
                  color: 'var(--text-primary)',
                  lineHeight: '1.75',
                  margin: 0,
                  fontWeight: '450',
                  textAlign: 'left'
                }}>
                  <strong style={{ color: 'var(--accent)' }}>Biodiversity</strong> is the rich variety of all living organisms — plants, animals, insects, and fungi — living together in mutual interdependence. Every species plays a vital role in the ecological balance of our planet.
                </p>
              </div>
            </div>

            {/* Right Column: Premium Concept Cards */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              justifyContent: 'center'
            }}>
              {[
                {
                  title: '🤝 Interdependence',
                  desc: 'No living organism lives in isolation. Every species supports others in the ecosystem to maintain balance.',
                  gradient: 'linear-gradient(to right, rgba(59, 130, 246, 0.03), rgba(59, 130, 246, 0.07))',
                  border: 'rgba(59, 130, 246, 0.15)',
                  leftBar: '6px solid #3b82f6',
                  titleColor: '#1e3a8a'
                },
                {
                  title: '🌱 Mutual Benefits',
                  desc: 'Plants produce oxygen and food. Animals fertilise soil, pollinate flowers, and disperse seeds for propagation.',
                  gradient: 'linear-gradient(to right, rgba(16, 185, 129, 0.03), rgba(16, 185, 129, 0.07))',
                  border: 'rgba(16, 185, 129, 0.15)',
                  leftBar: '6px solid #10b981',
                  titleColor: '#065f46'
                },
                {
                  title: '🚀 Your Mission',
                  desc: 'Move the digital scanner over the scene to locate, identify, and log 8 target species in your field notebook!',
                  gradient: 'linear-gradient(to right, rgba(245, 158, 11, 0.03), rgba(245, 158, 11, 0.07))',
                  border: 'rgba(245, 158, 11, 0.15)',
                  leftBar: '6px solid #f59e0b',
                  titleColor: '#b45309'
                }
              ].map((card, i) => (
                <div
                  key={i}
                  className="glass-panel"
                  style={{
                    background: card.gradient,
                    border: `1.5px solid ${card.border}`,
                    borderLeft: card.leftBar,
                    borderRadius: '16px',
                    padding: '1.5rem 2rem',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'default',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.02)';
                  }}
                >
                  <h3 style={{
                    margin: '0 0 0.25rem 0',
                    fontSize: '1.4rem', // increased title font size
                    color: 'var(--text-heading)',
                    fontWeight: 'bold'
                  }}>
                    {card.title}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '1.15rem', // increased description font size to match 2.2
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5'
                  }}>
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.25rem',
            width: '100%',
            marginTop: '0.5rem'
          }}>
            <button
              onClick={onBackToDashboard}
              className="outline"
              style={{
                padding: '0.8rem 1.75rem',
                fontSize: '1.1rem',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Exit Activity
            </button>
            <button
              onClick={() => setPhase('game')}
              className="primary"
              style={{
                padding: '0.8rem 2.25rem',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '700',
                background: 'linear-gradient(135deg, var(--accent) 0%, #4f46e5 100%)',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                border: 'none',
                color: '#fff',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)';
              }}
            >
              Start Nature Walk <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ────── GAME PHASE ────── */}
      {phase === 'game' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          {/* Top Control Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.6rem 1.25rem',
            background: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 14, 30, 0.85)',
            backdropFilter: 'blur(10px)',
            borderBottom: theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.08)',
            zIndex: 30,
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => { window.speechSynthesis.cancel(); stopHolding(); onBackToDashboard(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  border: theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.2)',
                  background: theme === 'light' ? 'var(--page-bg)' : 'rgba(255,255,255,0.06)',
                  color: theme === 'light' ? 'var(--text-primary)' : '#fff',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={14} /> Exit Game
              </button>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: theme === 'light' ? 'var(--text-heading)' : '#fff' }}>Phase 2: Interactive Nature Walk</div>
                <div style={{ fontSize: '0.72rem', color: theme === 'light' ? 'var(--text-muted)' : 'rgba(255,255,255,0.55)' }}>Scan 8 species to log them in the notebook</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {/* Progress info */}
              <div style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                background: notebook.length >= 8 ? 'rgba(22,163,74,0.18)' : 'rgba(99,102,241,0.15)',
                border: `1px solid ${notebook.length >= 8 ? '#4ade80' : 'rgba(99,102,241,0.5)'}`,
                color: notebook.length >= 8 ? (theme === 'light' ? '#16a34a' : '#4ade80') : (theme === 'light' ? 'var(--accent)' : '#818cf8'),
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}>
                {notebook.length} / 8 Logged
              </div>
              <button
                onClick={handleReset}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  border: theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.15)',
                  background: theme === 'light' ? 'var(--page-bg)' : 'rgba(255,255,255,0.06)',
                  color: theme === 'light' ? 'var(--text-secondary)' : 'rgba(255,255,255,0.7)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <RefreshCw size={13} /> Reset
              </button>
            </div>
          </div>

          {/* Interactive Game Canvas */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseDown={startHolding}
              onMouseUp={stopHolding}
              onMouseLeave={() => { setIsInsideImage(false); stopHolding(); setHoveredTarget(null); }}
              onMouseEnter={() => setIsInsideImage(true)}
              style={{ width: '100%', cursor: 'none', userSelect: 'none', position: 'relative' }}
            >
              {/* Nature Walk Scene Background — Natural responsive sizing (no object-fit crop bugs) */}
              <img
                src={natureWalkScene}
                alt="Nature Walk Scene"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px', pointerEvents: 'none', userSelect: 'none' }}
                draggable={false}
              />

              {/* Gold hint rings when showHints is true */}
              {showHints && TARGET_ORGANISMS.map(t => {
                const logged = notebook.includes(t.id);
                if (logged) return null;
                return (
                  <div
                    key={`hint-${t.id}`}
                    style={{
                      position: 'absolute',
                      left: `${t.x}%`,
                      top: `${t.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: '3px solid #f59e0b', // gold ring
                      boxShadow: '0 0 10px #f59e0b',
                      animation: 'hintGlow 1.5s infinite ease-in-out',
                      pointerEvents: 'none',
                      zIndex: 8,
                    }}
                  />
                );
              })}

              {/* Scanned target checkmark green badges */}
              {TARGET_ORGANISMS.map(t => {
                const logged = notebook.includes(t.id);
                if (!logged) return null;
                return (
                  <div key={`chk-${t.id}`} style={{
                    position: 'absolute',
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#16a34a',
                    border: '2.5px solid #fff',
                    boxShadow: '0 0 12px rgba(22,163,74,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}>
                    <CheckCircle size={15} color="#fff" strokeWidth={3} />
                  </div>
                );
              })}

              {/* Miss message floats */}
              {missMessage && (
                <div style={{ position: 'absolute', left: `${missPos.x}px`, top: `${missPos.y - 36}px`, transform: 'translateX(-50%)', background: 'rgba(239,68,68,0.92)', color: '#fff', padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 'bold', pointerEvents: 'none', zIndex: 30, boxShadow: '0 4px 10px rgba(0,0,0,0.3)', animation: 'bounceUp 0.3s ease' }}>
                  {missMessage}
                </div>
              )}

              {/* Clean Blue Translucent Glass Scanner Rectangle (100px x 70px) */}
              {isInsideImage && (
                <div style={{
                  position: 'absolute',
                  left: `${mousePos.x}px`,
                  top: `${mousePos.y}px`,
                  transform: 'translate(-50%, -50%)',
                  width: '100px',
                  height: '70px',
                  border: hoveredTarget ? '2.5px solid #22d3ee' : '2.5px solid #3b82f6',
                  borderRadius: '8px',
                  pointerEvents: 'none',
                  zIndex: 25,
                  background: hoveredTarget ? 'rgba(34, 211, 238, 0.22)' : 'rgba(59, 130, 246, 0.22)',
                  backdropFilter: 'blur(1px)',
                  boxShadow: hoveredTarget ? '0 0 20px rgba(34, 211, 238, 0.6)' : '0 0 16px rgba(59, 130, 246, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {/* Hold Progress Bar */}
                  {isHolding && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: 'rgba(0,0,0,0.3)' }}>
                      <div style={{ height: '100%', background: hoveredTarget?.isBonus ? '#fbbf24' : '#22d3ee', width: `${holdProgress}%` }} />
                    </div>
                  )}
                  {/* Corner crosshairs */}
                  {[['0px','0px','borderTop','borderLeft'],['0px','auto','borderTop','borderRight'],['auto','0px','borderBottom','borderLeft'],['auto','auto','borderBottom','borderRight']].map(([t,r,b1,b2],i) => (
                    <div key={i} style={{ position: 'absolute', top: t !== 'auto' ? t : undefined, right: r !== 'auto' ? r : undefined, bottom: t === 'auto' ? '0px' : undefined, left: r === 'auto' ? '0px' : undefined, width: '10px', height: '10px', [b1]: '2px solid #fff', [b2]: '2px solid #fff', opacity: 0.8 }} />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom-Center Floating Glass Panel (Collapses & Expands smoothly on hover) */}
            <div
              onMouseEnter={() => setIsPanelHovered(true)}
              onMouseLeave={() => setIsPanelHovered(false)}
              style={{
                position: 'fixed',
                bottom: '1.75rem',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                width: isPanelHovered ? '480px' : '380px',
                height: isPanelHovered ? '320px' : '52px',
                background: theme === 'light'
                  ? (isPanelHovered ? 'rgba(255, 255, 255, 0.98)' : 'rgba(243, 244, 246, 0.95)')
                  : (isPanelHovered ? 'rgba(10, 18, 40, 0.97)' : 'rgba(15, 23, 42, 0.85)'),
                backdropFilter: 'blur(20px)',
                border: theme === 'light'
                  ? (isPanelHovered ? '2px solid var(--accent)' : '1.5px solid var(--border)')
                  : (isPanelHovered ? '2px solid rgba(99, 102, 241, 0.65)' : '1.5px solid rgba(99, 102, 241, 0.4)'),
                borderRadius: isPanelHovered ? '24px' : '26px',
                padding: '0.75rem 1.5rem',
                color: theme === 'light' ? 'var(--text-primary)' : '#fff',
                boxShadow: theme === 'light'
                  ? (notebook.length >= 8 ? '0 12px 40px rgba(34, 197, 94, 0.18)' : '0 12px 40px rgba(99, 102, 241, 0.18)')
                  : (notebook.length >= 8 
                    ? '0 12px 40px rgba(34, 197, 94, 0.35), 0 0 15px rgba(34, 197, 94, 0.15)'
                    : '0 12px 40px rgba(99, 102, 241, 0.35), 0 0 15px rgba(99, 102, 241, 0.15)'),
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              {/* Header inside floating pill */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                height: isPanelHovered ? '28px' : '100%', 
                flexShrink: 0 
              }}>
                <span style={{ 
                  fontSize: '0.92rem', 
                  fontWeight: 'bold', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: notebook.length >= 8 
                    ? (theme === 'light' ? '#16a34a' : '#4ade80') 
                    : (theme === 'light' ? 'var(--accent)' : '#c7d2fe')
                }}>
                  <Target size={18} color={notebook.length >= 8 ? (theme === 'light' ? '#16a34a' : '#4ade80') : (theme === 'light' ? 'var(--accent)' : '#818cf8')} style={{ animation: notebook.length >= 8 ? 'none' : 'pulse 2s infinite' }} />
                  {notebook.length >= 8 ? '🎉 Nature Walk Ready!' : `🔍 Logged: ${notebook.length} / 8 Species`}
                </span>
                <span style={{ 
                  fontSize: '0.72rem', 
                  color: theme === 'light' ? 'var(--text-muted)' : 'rgba(255,255,255,0.4)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.08em',
                  fontWeight: '600'
                }}>
                  {isPanelHovered ? 'Hover away to close' : 'Hover to open'}
                </span>
              </div>

              {/* Extended panel content (Visible only when hovered) */}
              <div style={{
                flex: 1,
                opacity: isPanelHovered ? 1 : 0,
                transition: 'opacity 0.2s ease',
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                overflowY: 'auto',
                pointerEvents: isPanelHovered ? 'auto' : 'none',
              }}>
                <div style={{ fontSize: '0.85rem', color: theme === 'light' ? 'var(--text-secondary)' : 'rgba(255,255,255,0.7)', lineHeight: 1.45 }}>
                  Find all 8 highlighted targets by scanning them. Turn on Hints if you get stuck!
                </div>

                {/* Target checklist grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '0.6rem', 
                  borderTop: theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.1)', 
                  paddingTop: '0.75rem',
                  paddingBottom: '0.5rem'
                }}>
                  {TARGET_ORGANISMS.map(t => {
                    const logged = notebook.includes(t.id);
                    return (
                      <div 
                        key={t.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem', 
                          fontSize: '0.85rem', 
                          color: logged 
                            ? (theme === 'light' ? '#15803d' : '#4ade80') 
                            : (theme === 'light' ? 'var(--text-muted)' : 'rgba(255,255,255,0.45)'),
                          background: logged 
                            ? (theme === 'light' ? 'rgba(22, 163, 74, 0.06)' : 'rgba(74, 222, 128, 0.08)') 
                            : (theme === 'light' ? 'var(--page-bg)' : 'rgba(255, 255, 255, 0.03)'),
                          border: logged 
                            ? (theme === 'light' ? '1px solid rgba(22, 163, 74, 0.25)' : '1px solid rgba(74, 222, 128, 0.3)') 
                            : (theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(255, 255, 255, 0.06)'),
                          borderRadius: '10px',
                          padding: '0.45rem 0.8rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{ filter: logged ? 'none' : 'grayscale(100%)', opacity: logged ? 1 : 0.4, fontSize: '1rem' }}>{t.emoji}</span>
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px', fontWeight: logged ? '600' : '400' }}>{t.name}</span>
                        {logged && <CheckCircle size={13} color={theme === 'light' ? '#16a34a' : '#4ade80'} style={{ marginLeft: 'auto' }} />}
                      </div>
                    );
                  })}
                </div>

                {/* Controls in Expanded View */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderTop: theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.1)', 
                  paddingTop: '0.75rem', 
                  marginTop: 'auto' 
                }}>
                  {/* Hint Toggle */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowHints(h => !h); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 1rem',
                      borderRadius: '8px',
                      border: theme === 'light' ? '1.5px solid #d97706' : '1.5px solid rgba(245,158,11,0.5)',
                      background: showHints 
                        ? (theme === 'light' ? 'rgba(217, 119, 6, 0.15)' : 'rgba(245,158,11,0.2)') 
                        : (theme === 'light' ? 'var(--page-bg)' : 'rgba(245,158,11,0.05)'),
                      color: theme === 'light' ? '#d97706' : '#fbbf24',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme === 'light' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(245,158,11,0.25)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = showHints 
                      ? (theme === 'light' ? 'rgba(217, 119, 6, 0.15)' : 'rgba(245,158,11,0.2)') 
                      : (theme === 'light' ? 'var(--page-bg)' : 'rgba(245,158,11,0.05)')}
                  >
                    <Eye size={14} /> {showHints ? 'Hide Hints' : 'Show Hints'}
                  </button>

                  {/* Proceed to Quiz button */}
                  {notebook.length >= 8 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhase('quiz');
                        setCurrentQIndex(0);
                        setSelectedOpt(null);
                        setQuizChecked(false);
                        setQuizAnswers({});
                      }}
                      style={{
                        padding: '0.45rem 1.25rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      Start Quiz →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Scan Popup Modal (Verification Gate) */}
          {scannedOrganism && (
            <>
              <div onClick={() => { setScannedOrganism(null); stopHolding(); }} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
              <div onClick={e => e.stopPropagation()} style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                zIndex: 60,
                width: 'min(520px, 92vw)',
                background: theme === 'light' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(12,18,40,0.96)',
                backdropFilter: 'blur(24px)',
                border: theme === 'light' ? '1.5px solid var(--border)' : '1.5px solid rgba(96,165,250,0.3)',
                borderRadius: '20px',
                padding: '2rem',
                color: theme === 'light' ? 'var(--text-primary)' : '#fff',
                boxShadow: theme === 'light' ? '0 12px 48px rgba(0,0,0,0.1)' : '0 12px 48px rgba(0,0,0,0.6)',
                animation: 'popupIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: isBonusScan ? '#fbbf24' : '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                      {isBonusScan ? '⭐ Bonus Discovery!' : '🌿 Species Detected!'}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', color: theme === 'light' ? 'var(--text-heading)' : '#fff' }}>{scannedOrganism.emoji} {scannedOrganism.name}</h3>
                  </div>
                  <button onClick={() => setScannedOrganism(null)} style={{ background: theme === 'light' ? 'var(--page-bg)' : 'rgba(255,255,255,0.07)', border: theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: theme === 'light' ? 'var(--text-secondary)' : '#fff', cursor: 'pointer', padding: '0.3rem', display: 'flex' }}>
                    <X size={18} />
                  </button>
                </div>

                {/* Description */}
                <p style={{ margin: 0, fontSize: '1rem', color: theme === 'light' ? 'var(--text-primary)' : 'rgba(255,255,255,0.85)', lineHeight: '1.65' }}>{scannedOrganism.details}</p>

                {/* Did You Know */}
                <div style={{
                  background: theme === 'light' ? 'rgba(22,163,74,0.08)' : 'rgba(22,163,74,0.1)',
                  padding: '0.9rem 1rem',
                  borderRadius: '10px',
                  borderLeft: '4px solid #4ade80',
                  fontSize: '0.9rem',
                  color: theme === 'light' ? 'var(--text-secondary)' : 'rgba(255,255,255,0.8)',
                  lineHeight: '1.6'
                }}>
                  <strong style={{ color: '#4ade80' }}>💡 Did You Know?</strong> {scannedOrganism.fact}
                </div>

                {/* Verification MCQ — only for non-bonus */}
                {!isBonusScan && scannedOrganism.verifyQ && (
                  <div style={{ borderTop: theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>🔬 Verification Check</div>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', color: theme === 'light' ? 'var(--text-heading)' : 'rgba(255,255,255,0.85)', fontWeight: 'bold' }}>{scannedOrganism.verifyQ.q}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {scannedOrganism.verifyQ.opts.map((opt, i) => {
                        let bg = theme === 'light' ? 'var(--page-bg)' : 'rgba(255,255,255,0.04)';
                        let border = theme === 'light' ? 'var(--border)' : 'rgba(255,255,255,0.1)';
                        if (verifyChecked) {
                          if (i === scannedOrganism.verifyQ.correct) { bg = 'rgba(22,163,74,0.18)'; border = '#4ade80'; }
                          else if (i === verifyAnswer) { bg = 'rgba(239,68,68,0.18)'; border = '#f87171'; }
                        } else if (verifyAnswer === i) {
                          bg = 'rgba(99,102,241,0.15)'; border = 'rgba(99,102,241,0.6)';
                        }
                        return (
                          <button key={i} disabled={verifyChecked} onClick={() => setVerifyAnswer(i)}
                            style={{ textAlign: 'left', padding: '0.65rem 0.9rem', borderRadius: '8px', border: `1px solid ${border}`, background: bg, color: theme === 'light' ? 'var(--text-primary)' : 'rgba(255,255,255,0.88)', fontSize: '0.9rem', cursor: verifyChecked ? 'default' : 'pointer', transition: 'all 0.2s', width: '100%' }}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {verifyChecked && (
                      <div style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: verifyCorrect ? (theme === 'light' ? '#15803d' : '#4ade80') : (theme === 'light' ? '#b91c1c' : '#f87171'), fontWeight: 'bold' }}>
                        {verifyCorrect ? '✅ Correct! You may log this species.' : '❌ Not quite — but you can try again later!'}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', borderTop: theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                  <button onClick={() => setScannedOrganism(null)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: theme === 'light' ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.15)', background: theme === 'light' ? 'var(--page-bg)' : 'rgba(255,255,255,0.05)', color: theme === 'light' ? 'var(--text-secondary)' : 'rgba(255,255,255,0.7)', fontSize: '0.87rem', cursor: 'pointer' }}>
                    Keep Searching
                  </button>
                  {/* For bonus → always enable log button */}
                  {isBonusScan ? (
                    <button onClick={logToNotebook} style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#d97706,#f59e0b)', color: '#fff', fontSize: '0.87rem', fontWeight: 'bold', cursor: 'pointer' }}>
                      ⭐ Log as Bonus
                    </button>
                  ) : !verifyChecked ? (
                    <button
                      disabled={verifyAnswer === null}
                      onClick={() => {
                        const correct = verifyAnswer === scannedOrganism.verifyQ.correct;
                        setVerifyChecked(true);
                        setVerifyCorrect(correct);
                      }}
                      style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: 'none', background: verifyAnswer !== null ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : (theme === 'light' ? 'var(--border)' : 'rgba(255,255,255,0.08)'), color: theme === 'light' && verifyAnswer === null ? 'var(--text-muted)' : '#fff', fontSize: '0.87rem', fontWeight: 'bold', cursor: verifyAnswer !== null ? 'pointer' : 'default', opacity: verifyAnswer === null ? 0.5 : 1 }}>
                      Verify Answer
                    </button>
                  ) : (
                    <button
                      onClick={logToNotebook}
                      disabled={!verifyCorrect}
                      style={{ padding: '0.5rem 1.2rem', borderRadius: '8px', border: 'none', background: verifyCorrect ? 'linear-gradient(135deg,#16a34a,#22c55e)' : (theme === 'light' ? 'var(--border)' : 'rgba(255,255,255,0.08)'), color: theme === 'light' && !verifyCorrect ? 'var(--text-muted)' : '#fff', fontSize: '0.87rem', fontWeight: 'bold', cursor: verifyCorrect ? 'pointer' : 'not-allowed', opacity: verifyCorrect ? 1 : 0.5 }}>
                      {verifyCorrect ? '📔 Log in Notebook' : 'Answer Incorrectly'}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ────── QUIZ PHASE ────── */}
      {phase === 'quiz' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '1.5rem', maxWidth: '720px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase' }}>Phase 3: Concept Quiz</div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)' }}>Nature Walk Review</h2>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Q {currentQIndex + 1} / {QUIZ_QUESTIONS.length}</div>
          </div>

          <div style={{ width: '100%', padding: '2rem', border: '1px solid var(--accent)', borderRadius: '16px', background: 'var(--card-bg)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-heading)', lineHeight: 1.5 }}>
              Q{currentQIndex + 1}. {QUIZ_QUESTIONS[currentQIndex].q}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {QUIZ_QUESTIONS[currentQIndex].opts.map((opt, i) => {
                let border = '1px solid var(--border)';
                let bg = 'var(--page-bg)';
                if (quizChecked) {
                  if (i === QUIZ_QUESTIONS[currentQIndex].correct) { border = '2px solid var(--success)'; bg = 'rgba(5,150,105,0.08)'; }
                  else if (i === selectedOpt) { border = '2px solid var(--danger)'; bg = 'rgba(220,38,38,0.08)'; }
                } else if (selectedOpt === i) { border = '2px solid var(--accent)'; bg = 'rgba(99,102,241,0.08)'; }
                return (
                  <button key={i} disabled={quizChecked} onClick={() => setSelectedOpt(i)}
                    style={{ textAlign: 'left', padding: '0.9rem 1.25rem', borderRadius: '8px', border, background: bg, color: 'var(--text-primary)', fontSize: '1rem', cursor: quizChecked ? 'default' : 'pointer', transition: 'all 0.18s', width: '100%' }}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {quizChecked && (
              <div style={{ background: selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? 'rgba(5,150,105,0.07)' : 'rgba(220,38,38,0.07)', borderLeft: `4px solid ${selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? 'var(--success)' : 'var(--danger)'}`, padding: '1rem 1.25rem', borderRadius: '8px', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong style={{ color: selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? 'var(--success)' : 'var(--danger)' }}>
                  {selectedOpt === QUIZ_QUESTIONS[currentQIndex].correct ? '✅ Correct!' : '❌ Incorrect.'}
                </strong> {QUIZ_QUESTIONS[currentQIndex].explain}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '1.2rem' }}>
              {!quizChecked ? (
                <button disabled={selectedOpt === null} onClick={handleCheckAnswer} className="primary" style={{ padding: '0.55rem 1.4rem', fontSize: '0.9rem', borderRadius: '8px', cursor: selectedOpt !== null ? 'pointer' : 'not-allowed', opacity: selectedOpt === null ? 0.5 : 1 }}>
                  Verify Answer
                </button>
              ) : (
                <button onClick={handleNextQuestion} className="primary" style={{ padding: '0.55rem 1.4rem', fontSize: '0.9rem', borderRadius: '8px', cursor: 'pointer' }}>
                  {currentQIndex === QUIZ_QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ────── CERTIFICATE PHASE ────── */}
      {phase === 'cert' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '2.5rem', maxWidth: '620px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: 'linear-gradient(135deg,rgba(217,119,6,0.15),rgba(99,102,241,0.1))', border: '2px dashed var(--accent)', borderRadius: '24px', padding: '3rem 2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
            <div style={{ background: 'rgba(217,119,6,0.2)', borderRadius: '50%', padding: '1.25rem', border: '2px solid rgb(217,119,6)' }}>
              <Award size={64} style={{ color: 'rgb(217,119,6)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: 'var(--text-heading)' }}>Activity 2.1 Completed!</h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Excellent work, Field Scientist! You successfully logged all 8 organisms and demonstrated your understanding of biodiversity.
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', width: '100%', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              ⭐ Score: {Object.values(quizAnswers).filter(Boolean).length} / {QUIZ_QUESTIONS.length} Quiz Questions Correct
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleReset} className="outline" style={{ padding: '0.6rem 1.25rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '8px', cursor: 'pointer' }}>
              <RefreshCw size={15} /> Reset
            </button>
            <button onClick={onBackToDashboard} className="primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.95rem', borderRadius: '8px', cursor: 'pointer' }}>
              Back to Chapter 2
            </button>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @keyframes bounceUp { from { opacity:0; transform: translateX(-50%) translateY(6px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
        @keyframes popupIn  { from { opacity:0; transform: translate(-50%,-48%) scale(0.9); } to { opacity:1; transform: translate(-50%,-50%) scale(1); } }
        @keyframes hintGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.65; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; box-shadow: 0 0 16px #f59e0b, inset 0 0 8px #f59e0b; }
        }
      `}</style>
    </div>
  );
}
