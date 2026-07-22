import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, RefreshCw, Volume2, CheckCircle, ChevronRight, Award, ArrowLeft, BookOpen, Target, Eye, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import natureWalkScene from '../../../../assets/nature_walk_scene.png';
import { useTheme } from '../../../../ThemeContext.jsx';

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
   BONUS ORGANISMS
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

export default function VirtualBiodiversityExplorer({ onBackToDashboard, typeFilter = 'plant', onNextSection }) {
  const { theme } = useTheme();
  const [notebook, setNotebook] = useState([]); // logged target IDs
  const [bonusLog, setBonusLog] = useState([]); // logged bonus IDs

  // Bounding dimensions of the container
  const [containerSize, setContainerSize] = useState({ width: 800, height: 450 });

  // Dynamically filter target list
  const filteredTargets = React.useMemo(() => {
    if (typeFilter === 'plant') {
      return [
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
        {
          id: 'lilies',
          name: 'Pond Water Lilies',
          emoji: '🪷',
          type: 'plant',
          x: 17, y: 77, w: 14, h: 14,
          details: 'Water lilies floating in the freshwater pond, supporting small aquatic organisms and adding biological beauty.',
          fact: 'Water lily leaves have stomata on their upper surfaces instead of their lower surfaces to breathe directly in contact with air!',
          verifyQ: { q: 'Where are the stomata located on water lily leaves?', opts: ['Under the water', 'On the upper surface facing the air', 'In the roots', 'There are no stomata'], correct: 1 },
          tableInfo: { stem: 'Soft, flexible underwater stem', leaves: 'Broad floating green circular leaves', flowers: 'Large pink or white blooms', notes: 'Classified as Aquatic plant. Stomata on upper surface.' }
        },
        {
          id: 'banyan_tree',
          name: 'Grand Neem Tree',
          emoji: '🌳',
          type: 'plant',
          x: 85, y: 35, w: 20, h: 30,
          details: 'A large tree with a thick trunk and many woody branches providing shelter to birds and monkeys.',
          fact: 'Neem trees are evergreen and known for their medicinal properties, often called the village pharmacy in India.',
          verifyQ: { q: 'Which plant classification does a Neem Tree belong to?', opts: ['Herb', 'Shrub', 'Tree', 'Creeper'], correct: 2 },
          tableInfo: { stem: 'Thick, hard, woody trunk', leaves: 'Serrated green leaflets', flowers: 'Small white fragrant', notes: 'Classified as Tree. Very tall.' }
        }
      ];
    } else {
      return [
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
          verifyQ: { q: 'Where would you most likely spot a Three-Striped Palm Squirrel?', opts: ['In the sky', 'Climbing a tree trunk', 'In deep ocean water', 'Only in ice caves'], correct: 1 },
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
        }
      ];
    }
  }, [typeFilter]);

  const filteredBonus = React.useMemo(() => {
    if (typeFilter === 'plant') {
      return [];
    } else {
      return [
        {
          id: 'crow',
          name: 'House Crow (Flying)',
          emoji: '🐦‍⬛',
          x: 29, y: 13, w: 16, h: 14,
          details: 'A grey-necked bird flying in the clear sky. Crows are scavengers that eat scraps, small pests, and seeds.',
          fact: 'Crows are remarkably intelligent — they can recognize individual human faces and even use sticks as tools to fetch food!',
        },
        {
          id: 'snail',
          name: 'Garden Snail',
          emoji: '🐌',
          x: 35, y: 86, w: 12, h: 12,
          details: 'A slow-moving mollusc that carries a protective spiral shell on its back and leaves a silvery slime trail.',
          fact: 'Snails cannot hear at all — they rely solely on their sense of touch and smell to find their way around!',
        }
      ];
    }
  }, [typeFilter]);

  // Scanner state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isInsideImage, setIsInsideImage] = useState(false);
  const [hoveredTarget, setHoveredTarget] = useState(null);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [missMessage, setMissMessage] = useState('');
  const [missPos, setMissPos] = useState({ x: 0, y: 0 });

  // Hints
  const [showHints, setShowHints] = useState(false);

  // Popup state
  const [scannedOrganism, setScannedOrganism] = useState(null); // target or bonus
  const [isBonusScan, setIsBonusScan] = useState(false);
  const [verifyAnswer, setVerifyAnswer] = useState(null);
  const [verifyChecked, setVerifyChecked] = useState(false);
  const [verifyCorrect, setVerifyCorrect] = useState(false);

  const containerRef = useRef(null);
  const holdIntervalRef = useRef(null);
  const hoveredTargetRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  // Clean up Speech and Intervals
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      clearInterval(holdIntervalRef.current);
    };
  }, []);

  // Update container size dynamically to keep scanner coordinates precise
  useEffect(() => {
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
  }, []);

  // Trigger confetti upon completion
  useEffect(() => {
    if (notebook.length === filteredTargets.length && filteredTargets.length > 0) {
      confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
    }
  }, [notebook, filteredTargets]);

  const stopHolding = useCallback(() => {
    setIsHolding(false);
    setHoldProgress(0);
    clearInterval(holdIntervalRef.current);
  }, []);

  // Mouse move inside canvas
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    mousePosRef.current = { x, y };
    setMousePos({ x, y });

    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    const hitMargin = 2; // Expand target hit area slightly for smoother scanning

    // 1. Check required targets
    const target = filteredTargets.find(t =>
      pctX >= t.x - t.w / 2 - hitMargin && pctX <= t.x + t.w / 2 + hitMargin &&
      pctY >= t.y - t.h / 2 - hitMargin && pctY <= t.y + t.h / 2 + hitMargin
    );

    // 2. Check bonus targets
    const bonus = filteredBonus.find(b =>
      pctX >= b.x - b.w / 2 - hitMargin && pctX <= b.x + b.w / 2 + hitMargin &&
      pctY >= b.y - b.h / 2 - hitMargin && pctY <= b.y + b.h / 2 + hitMargin
    );

    if (target) {
      const hovered = { data: target, isBonus: false };
      setHoveredTarget(hovered);
      hoveredTargetRef.current = hovered;
    } else if (bonus) {
      const hovered = { data: bonus, isBonus: true };
      setHoveredTarget(hovered);
      hoveredTargetRef.current = hovered;
    } else {
      setHoveredTarget(null);
      hoveredTargetRef.current = null;
      if (isHolding) stopHolding();
    }
  }, [filteredTargets, filteredBonus, isHolding, stopHolding]);

  const startHolding = useCallback((e) => {
    if (e.button !== 0) return; // Only left click
    const currentHover = hoveredTargetRef.current;
    if (!currentHover) {
      setMissMessage('Try searching another area!');
      setMissPos({ x: mousePosRef.current.x, y: mousePosRef.current.y });
      setTimeout(() => setMissMessage(''), 1400);
      return;
    }

    const { data, isBonus } = currentHover;
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
    setShowHints(false);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 3rem)',
      background: 'var(--page-bg)',
      fontFamily: 'var(--geo-font)',
      color: 'var(--ink)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}>
      {/* SVG Wave filter for scanner lens distortion */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="scanner-waves">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.08" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="split-frame" style={{ flex: 1, minHeight: 0 }}>
        {/* ============ LEFT COLUMN: LESSON & JOURNAL ============ */}
        <div className="frame-page-left">
          <div className="textbook-eyebrow">Activity 2.1 · {typeFilter === 'plant' ? 'Plants Walk' : 'Animals Walk'}</div>
          <h1 className="textbook-title" style={{ fontFamily: 'var(--serif-font)' }}>
            {typeFilter === 'plant' ? '🌿 Virtual Plants Walk' : '🐾 Virtual Animals Walk'}
          </h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '13.5px', color: 'var(--mut)', lineHeight: '1.5' }}>
            <p>
              Join <b>Dr. Raghu</b> and <b>Maniram chacha</b> as we venture into the neighborhood and school garden to catalog the {typeFilter === 'plant' ? 'plant life' : 'animal life'} in our area!
            </p>
            <p>
              Your objective is to observe different {typeFilter === 'plant' ? 'plant types (herbs, shrubs, trees, and water lilies)' : 'animal behaviors and modes of movement'}. When you spot an organism on the right, <b>click and hold</b> your scanner lens on it to examine its details.
            </p>
            <p>
              You must then complete the <b>Verification MCQ</b> to confirm your observation and document it in your field notebook.
            </p>
          </div>

          <div className="textbook-explore" style={{ marginTop: '1.25rem' }}>
            ✏️ <b>Your Mission:</b> Scan and identify all <b>{filteredTargets.length} target {typeFilter === 'plant' ? 'plant' : 'animal'} species</b> to complete Table {typeFilter === 'plant' ? '2.1' : '2.2'} in your journal. Toggle hints if you need help finding them.
          </div>

          {/* Scanned Organism Verification Pane */}
          {scannedOrganism && (
            <div style={{
              background: '#ffffff',
              border: '1.5px solid var(--accent)',
              borderRadius: '12px',
              padding: '1.15rem',
              marginTop: '1.25rem',
              boxShadow: '0 8px 24px rgba(14,42,69,0.08)',
              animation: 'fadeInScale 0.25s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{scannedOrganism.emoji}</span>
                <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--navy)', fontFamily: 'var(--serif-font)' }}>
                  Scanned: {scannedOrganism.name}
                </h4>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--mut)', margin: '0 0 0.75rem 0', lineHeight: '1.45' }}>
                {scannedOrganism.details}
              </p>
              
              <div style={{
                background: 'rgba(22,163,74,0.06)',
                padding: '0.65rem 0.75rem',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--mut)',
                marginBottom: '0.85rem',
                borderLeft: '3px solid #16a34a'
              }}>
                <strong>Did you know?</strong> {scannedOrganism.fact}
              </div>

              {!isBonusScan && scannedOrganism.verifyQ && (
                <div style={{ borderTop: '1px solid var(--cardline)', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    🔬 Verification MCQ
                  </span>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '13px', fontWeight: 'bold', color: 'var(--ink)' }}>
                    {scannedOrganism.verifyQ.q}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {scannedOrganism.verifyQ.opts.map((opt, i) => {
                      let bg = '#fff';
                      let border = '1px solid var(--cardline)';
                      if (verifyChecked) {
                        if (i === scannedOrganism.verifyQ.correct) { bg = '#ecfdf5'; border = '1.5px solid #10b981'; }
                        else if (i === verifyAnswer) { bg = '#fef2f2'; border = '1.5px solid #ef4444'; }
                      } else if (verifyAnswer === i) {
                        bg = '#f4f8ff'; border = '1.5px solid var(--accent)';
                      }
                      return (
                        <button key={i} disabled={verifyChecked} onClick={() => setVerifyAnswer(i)}
                          style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '6px', border, background: bg, fontSize: '12.5px', cursor: verifyChecked ? 'default' : 'pointer', width: '100%' }}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.85rem', borderTop: '1px solid var(--cardline)', paddingTop: '0.65rem' }}>
                <button onClick={() => setScannedOrganism(null)} className="outline" style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '12px' }}>
                  Cancel
                </button>
                {isBonusScan ? (
                  <button onClick={logToNotebook} className="primary" style={{ padding: '0.35rem 0.9rem', borderRadius: '6px', fontSize: '12px', background: 'linear-gradient(135deg,#d97706,#f59e0b)' }}>
                    Log Bonus
                  </button>
                ) : !verifyChecked ? (
                  <button disabled={verifyAnswer === null} onClick={() => setVerifyChecked(true) || setVerifyCorrect(verifyAnswer === scannedOrganism.verifyQ.correct)} className="primary" style={{ padding: '0.35rem 0.9rem', borderRadius: '6px', fontSize: '12px', opacity: verifyAnswer === null ? 0.5 : 1 }}>
                    Verify
                  </button>
                ) : (
                  <button onClick={logToNotebook} disabled={!verifyCorrect} className="primary" style={{ padding: '0.35rem 0.9rem', borderRadius: '6px', fontSize: '12px', background: '#16a34a' }}>
                    📔 Log in Notebook
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Activity status checkup at bottom */}
          <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: 'var(--navy)' }}>
                Field Journal Progress
              </span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: notebook.length >= filteredTargets.length ? '#16a34a' : 'var(--accent)' }}>
                {notebook.length} / {filteredTargets.length} Logged
              </span>
            </div>
            
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ height: '100%', background: notebook.length >= filteredTargets.length ? '#10b981' : 'var(--accent)', width: `${(notebook.length / Math.max(1, filteredTargets.length)) * 100}%`, transition: 'width 0.4s ease' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setShowHints(h => !h)} className="outline" style={{ flex: 1, padding: '0.45rem', fontSize: '12.5px', borderRadius: '8px', gap: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Eye size={14} /> {showHints ? 'Hide Hints' : 'Show Hints'}
              </button>
              <button onClick={handleReset} className="outline" style={{ padding: '0.45rem', fontSize: '12.5px', borderRadius: '8px', gap: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshCw size={13} /> Reset
              </button>
            </div>

            {notebook.length >= filteredTargets.length && (
              <button 
                onClick={onNextSection || onBackToDashboard} 
                className="primary" 
                style={{ 
                  width: '100%', 
                  padding: '0.6rem', 
                  marginTop: '0.75rem', 
                  borderRadius: '8px', 
                  fontSize: '13px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.35rem', 
                  background: '#16a34a', 
                  boxShadow: '0 4px 12px rgba(22,163,74,0.25)' 
                }}
              >
                🎉 Walk Completed! {typeFilter === 'plant' ? 'Proceed to Animals Walk' : 'Proceed to Level 2'} <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ============ RIGHT COLUMN: WORKSPACE ============ */}
        <div className="frame-page-right" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--cardline)', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--mut)' }}>
              🎯 neighbourhood &amp; school garden map
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {onNextSection && (
                <button 
                  onClick={onNextSection} 
                  className="primary" 
                  style={{ 
                    fontSize: '11.5px', 
                    padding: '0.25rem 0.6rem', 
                    borderRadius: '6px', 
                    background: 'var(--accent)', 
                    border: 'none', 
                    color: '#fff', 
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Skip Walk ➔
                </button>
              )}
              <button onClick={onBackToDashboard} className="outline" style={{ fontSize: '11.5px', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                Exit Walk
              </button>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--cardline)' }}>
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseDown={startHolding}
              onMouseUp={stopHolding}
              onMouseLeave={() => { setIsInsideImage(false); stopHolding(); setHoveredTarget(null); }}
              onMouseEnter={() => setIsInsideImage(true)}
              style={{ width: '100%', height: '100%', cursor: 'none', userSelect: 'none', position: 'relative' }}
            >
              {/* Nature Walk Scene Background */}
              <img
                src={natureWalkScene}
                alt="Nature Walk Scene"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none', userSelect: 'none' }}
                draggable={false}
              />

              {/* Gold hint rings */}
              {showHints && filteredTargets.map(t => {
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
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: '2.5px solid #f59e0b',
                      boxShadow: '0 0 8px #f59e0b',
                      animation: 'hintGlow 1.5s infinite ease-in-out',
                      pointerEvents: 'none',
                      zIndex: 8,
                    }}
                  />
                );
              })}

              {/* Scanned target badges */}
              {filteredTargets.map(t => {
                const logged = notebook.includes(t.id);
                if (!logged) return null;
                return (
                  <div key={`chk-${t.id}`} style={{
                    position: 'absolute',
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#16a34a',
                    border: '2px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}>
                    <CheckCircle size={13} color="#fff" strokeWidth={3} />
                  </div>
                );
              })}

              {/* Miss message floats */}
              {missMessage && (
                <div style={{ position: 'absolute', left: `${missPos.x}px`, top: `${missPos.y - 28}px`, transform: 'translateX(-50%)', background: 'rgba(239,68,68,0.95)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', pointerEvents: 'none', zIndex: 30 }}>
                  {missMessage}
                </div>
              )}

              {/* Scanner lens */}
              {isInsideImage && (
                <div style={{
                  position: 'absolute',
                  left: `${mousePos.x}px`,
                  top: `${mousePos.y}px`,
                  transform: 'translate(-50%, -50%)',
                  width: '90px',
                  height: '60px',
                  border: hoveredTarget ? '2px solid #22d3ee' : '2px solid #3b82f6',
                  borderRadius: '8px',
                  pointerEvents: 'none',
                  zIndex: 25,
                  background: hoveredTarget ? 'rgba(34, 211, 238, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                  boxShadow: hoveredTarget ? '0 0 15px rgba(34, 211, 238, 0.5)' : '0 0 12px rgba(59, 130, 246, 0.4)',
                }}>
                  {isHolding && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', background: 'rgba(0,0,0,0.3)' }}>
                      <div style={{ height: '100%', background: hoveredTarget?.isBonus ? '#fbbf24' : '#22d3ee', width: `${holdProgress}%` }} />
                    </div>
                  )}
                  {/* Crosshairs */}
                  {[['0px','0px','borderTop','borderLeft'],['0px','auto','borderTop','borderRight'],['auto','0px','borderBottom','borderLeft'],['auto','auto','borderBottom','borderRight']].map(([t,r,b1,b2],i) => (
                    <div key={i} style={{ position: 'absolute', top: t !== 'auto' ? t : undefined, right: r !== 'auto' ? r : undefined, bottom: t === 'auto' ? '0px' : undefined, left: r === 'auto' ? '0px' : undefined, width: '8px', height: '8px', [b1]: '1.5px solid #fff', [b2]: '1.5px solid #fff', opacity: 0.8 }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Readout panel inside right page */}
          <div className="readout" style={{ marginTop: '0.85rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
              {filteredTargets.map(t => {
                const logged = notebook.includes(t.id);
                return (
                  <span key={t.id} style={{
                    fontSize: '11px',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    border: '1px solid var(--cardline)',
                    background: logged ? '#ecfdf5' : '#f8fafc',
                    color: logged ? '#10b981' : 'var(--mut)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: logged ? '600' : '400'
                  }}>
                    <span>{t.emoji}</span>
                    <span>{t.name.split(' ')[0]}</span>
                    {logged && <CheckCircle size={10} />}
                  </span>
                );
              })}
            </div>
            <div className="work" style={{ fontSize: '11px' }}>
              ✏️ <b>Scanner hint:</b> Hover the map to search. Click &amp; hold on any {typeFilter === 'plant' ? 'plant' : 'animal'} to trigger scanning. Logged species fill the left journal.
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes hintGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.65; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; box-shadow: 0 0 12px #f59e0b, inset 0 0 6px #f59e0b; }
        }
      `}</style>
    </div>
  );
}
