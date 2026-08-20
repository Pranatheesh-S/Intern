import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, RefreshCw, Volume2, CheckCircle, ChevronRight, Award, ArrowLeft, BookOpen, Target, Eye, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import activityPlantsImage from '../../../../assets/2.1_plant.png';
import activityAnimalsImage from '../../../../assets/activity_2.1 animals.png';
import grassImage from '../../../../assets/grass.png';
import roseImage from '../../../../assets/rose.png';
import sunflowerImage from '../../../../assets/sunflower.png';
import hibiscusImage from '../../../../assets/hibiscus.png';
import tulsiImage from '../../../../assets/tulsi.png';
import neemImage from '../../../../assets/neem.png';
import { useTheme } from '../../../../ThemeContext.jsx';

const PLANT_CROPPED_IMAGES = {
  grass: grassImage,
  rose: roseImage,
  tulsi: tulsiImage,
  hibiscus: hibiscusImage,
  neem: neemImage,
  sunflower: sunflowerImage,
  Grass: grassImage,
  Rose: roseImage,
  Tulsi: tulsiImage,
  Hibiscus: hibiscusImage,
  Neem: neemImage,
  Sunflower: sunflowerImage,
};

/* Crop positions for plants from Scene 8 image asset (activity_plants_image.png) */
const PLANT_CROP_STYLES = {
  hibiscus: {
    backgroundSize: '320% 320%',
    backgroundPosition: '20% 44%'
  },
  tulsi: {
    backgroundSize: '300% 300%',
    backgroundPosition: '48% 88%'
  },
  neem: {
    backgroundSize: '240% 240%',
    backgroundPosition: '92% 20%'
  },
  grass: {
    backgroundSize: '360% 360%',
    backgroundPosition: '78% 86%'
  },
  rose: {
    backgroundSize: '320% 320%',
    backgroundPosition: '55% 52%'
  },
  pond: {
    backgroundSize: '280% 280%',
    backgroundPosition: '12% 88%'
  }
};

/* ─────────────────────────────────────────────
   TARGET ORGANISMS (8 required species)
───────────────────────────────────────────── */
const TARGET_ORGANISMS = [
  {
    id: 'frog',
    name: 'Indian Pond Frog',
    emoji: '🐸',
    type: 'animal',
    x: 22, y: 78, w: 12, h: 12,
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
    x: 81, y: 63, w: 12, h: 14,
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
    x: 45, y: 58, w: 12, h: 12,
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
    x: 49, y: 26, w: 14, h: 20,
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
    x: 20, y: 30, w: 18, h: 14,
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
    id: 'hibiscus',
    name: 'Hibiscus',
    emoji: '🌺',
    type: 'plant',
    x: 29, y: 46, w: 28, h: 32,
    details: 'Red Hibiscus flowers and bush growing on the center-left.',
    fact: 'Hibiscus flowers have vibrant red petals and are common flowering shrubs!',
    verifyQ: { q: 'Which plant classification does Hibiscus belong to?', opts: ['Herbs', 'Trees', 'Shrubs', 'Aquatic plants'], correct: 2 },
    tableInfo: { stem: 'Woody stems branching near base', leaves: 'Green serrated leaves', flowers: 'Red Hibiscus flowers', notes: 'Classified as Shrub. Medium height.' },
  },
  {
    id: 'tulsi',
    name: 'Tulsi',
    emoji: '🌿',
    type: 'plant',
    x: 48, y: 78, w: 28, h: 36,
    details: 'Tulsi plant growing in the foreground with vertical flower spikes and aromatic leaves.',
    fact: 'Tulsi (Holy Basil) is an important medicinal herb with soft green stems.',
    verifyQ: { q: 'What type of plant is Tulsi?', opts: ['Tree', 'Shrub', 'Herb', 'Climber'], correct: 2 },
    tableInfo: { stem: 'Soft green non-woody stem', leaves: 'Aromatic simple leaves', flowers: 'Purple-white spikes', notes: 'Classified as Herb.' }
  },
  {
    id: 'grass',
    name: 'Grass',
    emoji: '🌱',
    type: 'plant',
    x: 72, y: 77, w: 24, h: 30,
    details: 'Green grass clump growing on the bottom-right near the tree.',
    fact: 'Grasses are small herbs with narrow leaves and parallel vein patterns.',
    verifyQ: { q: 'Which category does Grass belong to?', opts: ['Tree', 'Herb', 'Shrub', 'Woody climber'], correct: 1 },
    tableInfo: { stem: 'Thin green stem', leaves: 'Long narrow parallel veins', flowers: 'Tiny spikelets', notes: 'Classified as Herb.' }
  },
  {
    id: 'rose',
    name: 'Rose',
    emoji: '🌹',
    type: 'plant',
    x: 53, y: 51, w: 26, h: 28,
    details: 'Pink Rose bush with flowering blooms located in the center-right area.',
    fact: 'Roses are thorny flowering shrubs with woody stems branching near the ground.',
    verifyQ: { q: 'What type of stem does a Rose bush have?', opts: ['Soft green stem', 'Thin woody stem with thorns', 'Massive trunk', 'Underwater stem'], correct: 1 },
    tableInfo: { stem: 'Thin woody stem with thorns', leaves: 'Compound serrated leaves', flowers: 'Pink Rose blooms', notes: 'Classified as Shrub.' }
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
    x: 34, y: 86, w: 10, h: 10,
    details: "A slow-moving mollusc that carries a protective spiral shell on its back and leaves a silvery slime trail.",
    fact: "Snails cannot hear at all — they rely solely on their sense of touch and smell to find their way around!",
  }
];

export default function VirtualBiodiversityExplorer({ onBackToDashboard, typeFilter = 'plant', onNextSection, isFullscreen = false }) {
  const { theme } = useTheme();
  const [notebook, setNotebook] = useState([]);
  const [bonusLog, setBonusLog] = useState([]);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 450 });
  const [infoCardPlant, setInfoCardPlant] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const filteredTargets = React.useMemo(() => {
    if (typeFilter === 'plant') {
      return [
        {
          id: 'hibiscus',
          name: 'Hibiscus',
          emoji: '🌺',
          type: 'plant',
          x: 29, y: 46, w: 28, h: 32,
          details: 'Red Hibiscus flowers and bush growing on the center-left.',
          fact: 'Hibiscus flowers have vibrant red petals and are common flowering shrubs!',
          verifyQ: { q: 'Which plant classification does Hibiscus belong to?', opts: ['Herbs', 'Trees', 'Shrubs', 'Aquatic plants'], correct: 2 },
          tableInfo: { 
            stem: 'Thin, hard, woody stem branching out near base', 
            leaves: 'Green simple leaves with serrated margins', 
            flowers: 'Large, bright red flowers', 
            notes: 'Medium height shrub; branches close to ground' 
          },
        },
        {
          id: 'tulsi',
          name: 'Tulsi',
          emoji: '🌿',
          type: 'plant',
          x: 48, y: 78, w: 28, h: 36,
          details: 'Tulsi plant growing in the foreground with vertical flower spikes and aromatic leaves.',
          fact: 'Tulsi (Holy Basil) is an important medicinal herb with soft green stems.',
          verifyQ: { q: 'What type of plant is Tulsi?', opts: ['Tree', 'Shrub', 'Herb', 'Climber'], correct: 2 },
          tableInfo: { 
            stem: 'Soft, green, non-woody herbaceous stem', 
            leaves: 'Small, oval, highly aromatic simple leaves', 
            flowers: 'Tiny purple-white flowers on vertical spikes', 
            notes: 'Short herb; medicinal plant found in home gardens' 
          }
        },
        {
          id: 'grass',
          name: 'Grass',
          emoji: '🌱',
          type: 'plant',
          x: 72, y: 77, w: 24, h: 30,
          details: 'Green grass clump growing on the bottom-right near the tree.',
          fact: 'Grasses are small herbs with narrow leaves and parallel vein patterns.',
          verifyQ: { q: 'Which category does Grass belong to?', opts: ['Tree', 'Herb', 'Shrub', 'Woody climber'], correct: 1 },
          tableInfo: { 
            stem: 'Thin, green, soft, hollow stem', 
            leaves: 'Long, narrow leaves with parallel vein patterns', 
            flowers: 'Tiny inconspicuous spikelets', 
            notes: 'Short herb; covers ground lawns, fibrous roots' 
          }
        },
        {
          id: 'neem',
          name: 'Neem',
          emoji: '🌳',
          type: 'plant',
          x: 85, y: 35, w: 22, h: 42,
          details: 'Grand Neem tree with thick trunk and broad canopy on the right.',
          fact: 'Neem trees are evergreen trees with medicinal properties.',
          verifyQ: { q: 'Which plant classification does a Neem Tree belong to?', opts: ['Herb', 'Shrub', 'Tree', 'Creeper'], correct: 2 },
          tableInfo: { 
            stem: 'Thick, hard, scaly brown woody trunk with bark', 
            leaves: 'Compound pinnate serrated green leaflets', 
            flowers: 'Small, white, fragrant flowers', 
            notes: 'Tall tree; evergreen with broad canopy' 
          }
        },
        {
          id: 'rose',
          name: 'Rose',
          emoji: '🌹',
          type: 'plant',
          x: 53, y: 51, w: 26, h: 28,
          details: 'Pink Rose bush with flowering blooms located in the center-right area.',
          fact: 'Roses are thorny flowering shrubs with woody stems branching near the ground.',
          verifyQ: { q: 'What type of stem does a Rose bush have?', opts: ['Soft green stem', 'Thin woody stem with thorns', 'Massive trunk', 'Underwater stem'], correct: 1 },
          tableInfo: { 
            stem: 'Thin woody stem with sharp thorns', 
            leaves: 'Compound leaves with serrated edges', 
            flowers: 'Pink or red fragrant rose blooms', 
            notes: 'Medium height shrub with thorny branches' 
          }
        },
        {
          id: 'sunflower',
          name: 'Sunflower',
          emoji: '🌻',
          type: 'plant',
          x: 63, y: 48, w: 22, h: 28,
          details: 'Tall flowering plant with large bright yellow petals turning toward sunlight.',
          fact: 'Sunflowers exhibit heliotropism — young sunflowers follow the sun from east to west every day!',
          verifyQ: { 
            q: 'Which feature is characteristic of a Sunflower?', 
            opts: ['Underwater stem', 'Large yellow flower head with a dark brown central disc', 'Scaly tree trunk', 'No flowers'], 
            correct: 1 
          },
          tableInfo: { 
            stem: 'Tall, strong, green stem with a rough, slightly hairy surface', 
            leaves: 'Large, broad green leaves with a rough texture and prominent veins', 
            flowers: 'Large bright yellow flower head with a dark brown central disc', 
            notes: 'Tall flowering plant; flower head turns toward sunlight; produces edible seeds' 
          }
        }
      ];
    } else {
      return [
        {
          id: 'frog',
          name: 'Indian Pond Frog',
          emoji: '🐸',
          type: 'animal',
          x: 22, y: 78, w: 12, h: 12,
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
          x: 81, y: 63, w: 12, h: 16,
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
          x: 45, y: 58, w: 12, h: 12,
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
          x: 49, y: 26, w: 14, h: 16,
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
          x: 20, y: 30, w: 12, h: 12,
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
          x: 28, y: 14, w: 14, h: 12,
          details: 'A grey-necked bird flying in the clear sky. Crows are scavengers that eat scraps, small pests, and seeds.',
          fact: 'Crows are remarkably intelligent — they can recognize individual human faces and even use sticks as tools to fetch food!',
        },
        {
          id: 'snail',
          name: 'Garden Snail',
          emoji: '🐌',
          x: 34, y: 86, w: 10, h: 10,
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
    e.preventDefault(); // Prevent text selection and zoom-related drag behaviors
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
    if (scannedOrganism.type === 'plant') {
      setInfoCardPlant(scannedOrganism);
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
      height: '660px',
      background: 'var(--page-bg)',
      fontFamily: 'var(--geo-font)',
      color: 'var(--ink)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflow: 'hidden',
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

      <div className="split-frame" style={{ flex: 1, height: 0 }}>
        {/* ============ LEFT COLUMN: LESSON & JOURNAL ============ */}
        <div className="frame-page-left">
          <div className="textbook-eyebrow">Activity 2.1 · {typeFilter === 'plant' ? 'Plants Walk' : 'Animals Walk'}</div>
          <h1 className="textbook-title" style={{ fontFamily: 'var(--serif-font)' }}>
            {typeFilter === 'plant' ? '🌿 Virtual Plants Walk' : '🐾 Virtual Animals Walk'}
          </h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '13.5px', color: '#ffffff', lineHeight: '1.5' }}>
            <p style={{ color: '#ffffff' }}>
              Join <b>Dr. Raghu</b> and <b>Maniram chacha</b> as we venture into the neighborhood and school garden to catalog the {typeFilter === 'plant' ? 'plant life' : 'animal life'} in our area!
            </p>
            <p style={{ color: '#ffffff' }}>
              Your objective is to observe different {typeFilter === 'plant' ? 'plant types (herbs, shrubs, trees, and water lilies)' : 'animal behaviors and modes of movement'}. When you spot an organism on the right, <b>click and hold</b> your scanner lens on it to examine its details.
            </p>
            <p style={{ color: '#ffffff' }}>
              You must then complete the <b>Verification MCQ</b> to confirm your observation and document it in your field notebook.
            </p>
          </div>

          <div className="textbook-explore" style={{ marginTop: '1.25rem' }}>
            ✏️ <b>Your Mission:</b> Scan and identify all <b>{filteredTargets.length} target {typeFilter === 'plant' ? 'plant' : 'animal'} species</b> to complete Table {typeFilter === 'plant' ? '2.1' : '2.2'} in your journal. Toggle hints if you need help finding them.
          </div>

          {/* Scanned Organism Verification Pane */}
          {scannedOrganism && (
            <div style={{
              background: 'var(--card-bg)',
              border: '1.5px solid var(--accent)',
              borderRadius: '12px',
              padding: '1.15rem',
              marginTop: '1.25rem',
              boxShadow: 'var(--card-shadow)',
              animation: 'fadeInScale 0.25s ease'
            }}>
              {typeFilter === 'plant' && (
                <div 
                  style={{
                    width: '100%',
                    height: '140px',
                    borderRadius: '8px',
                    marginBottom: '0.75rem',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.12)',
                    backgroundImage: `url(${activityPlantsImage})`,
                    backgroundRepeat: 'no-repeat',
                    ...(PLANT_CROP_STYLES[scannedOrganism.id] || { backgroundSize: '250% 250%', backgroundPosition: '50% 50%' })
                  }}
                />
              )}
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
                background: 'var(--success-bg)',
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
                      let bg = 'var(--surface)';
                      let border = '1px solid var(--cardline)';
                      if (verifyChecked) {
                        if (i === scannedOrganism.verifyQ.correct) { bg = 'var(--success-bg)'; border = '1.5px solid #10b981'; }
                        else if (i === verifyAnswer) { bg = 'var(--danger-bg)'; border = '1.5px solid #ef4444'; }
                      } else if (verifyAnswer === i) {
                        bg = 'var(--accent-bg)'; border = '1.5px solid var(--accent)';
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.25rem', borderBottom: '1px solid var(--cardline)', marginBottom: '0.5rem' }}>
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

          <div style={{ 
            flex: 1, 
            minHeight: 0, 
            position: 'relative', 
            borderRadius: '12px', 
            border: '1px solid var(--cardline)',
            background: '#090d16',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseDown={startHolding}
              onMouseUp={stopHolding}
              onMouseLeave={() => { setIsInsideImage(false); stopHolding(); setHoveredTarget(null); }}
              onMouseEnter={() => setIsInsideImage(true)}
              style={{ 
                width: '100%', 
                height: 'auto',
                aspectRatio: '3/2',
                maxHeight: '100%',
                maxWidth: '100%',
                cursor: 'none', 
                userSelect: 'none', 
                position: 'relative' 
              }}
            >
              {/* Clickable hotspots for plants */}
              {typeFilter === 'plant' && filteredTargets.map(t => (
                <div
                  key={`click-area-${t.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setInfoCardPlant(t);
                  }}
                  title={`Click to view ${t.name} observations`}
                  style={{
                    position: 'absolute',
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${t.w}%`,
                    height: `${t.h}%`,
                    cursor: 'pointer',
                    borderRadius: '8px',
                    zIndex: 20
                  }}
                />
              ))}

              {/* Nature Walk Scene Background */}
              <img
                src={typeFilter === 'plant' ? activityPlantsImage : activityAnimalsImage}
                alt="Nature Walk Scene"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  display: 'block', 
                  pointerEvents: 'none', 
                  userSelect: 'none' 
                }}
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

              {/* Click-and-hold popup containing ONLY the object's correct name */}
              {isInsideImage && isHolding && hoveredTarget && (
                <div style={{
                  position: 'absolute',
                  left: `${mousePos.x}px`,
                  top: `${mousePos.y - 45}px`,
                  transform: 'translateX(-50%)',
                  background: 'rgba(15, 23, 42, 0.95)',
                  color: '#ffffff',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  border: '1.5px solid #22d3ee',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.35), 0 0 10px rgba(34,211,238,0.5)',
                  pointerEvents: 'none',
                  zIndex: 35,
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.3px'
                }}>
                  {hoveredTarget.data.name}
                </div>
              )}
            </div>
          </div>

          {/* Readout panel inside right page */}
          <div className="readout" style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.25rem' }}>
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
                    fontWeight: logged ? '600' : '400',
                    cursor: 'pointer'
                  }} onClick={() => setInfoCardPlant(t)}>
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

      {/* Textbook Table 2.1 Plant Observations Popup Modal */}
      {infoCardPlant && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(9, 13, 22, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setInfoCardPlant(null)}
        >
          <div 
            style={{
              position: 'relative',
              width: '100vw',
              height: '100vh',
              maxWidth: '100vw',
              maxHeight: '100vh',
              background: '#0f172a',
              display: 'flex',
              flexDirection: 'row',
              color: '#f8fafc',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button Top Right */}
            <button 
              onClick={() => setInfoCardPlant(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                zIndex: 100,
                background: 'rgba(15, 23, 42, 0.12)',
                border: '1px solid rgba(15, 23, 42, 0.2)',
                color: '#0f172a',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '20px',
                fontWeight: 'bold',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease'
              }}
            >
              ✕
            </button>

            {/* LEFT SIDE — Plant Image (65% width, filling complete available height top to bottom edge) */}
            <div 
              style={{
                width: '65%',
                flex: '0 0 65%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                background: 'linear-gradient(135deg, #090d16 0%, #1e293b 100%)',
                borderRight: '1px solid rgba(34, 197, 94, 0.3)',
                overflow: 'hidden'
              }}
            >
              <img 
                src={PLANT_CROPPED_IMAGES[infoCardPlant.id] || PLANT_CROPPED_IMAGES[infoCardPlant.name]} 
                alt={infoCardPlant.name} 
                style={{ 
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center',
                  filter: 'drop-shadow(0 12px 30px rgba(0, 0, 0, 0.6))'
                }} 
              />
            </div>

            {/* RIGHT SIDE — Existing Observation Content (35% width, Light-Grey Frosted Glass Panel) */}
            <div 
              style={{
                width: '35%',
                flex: '0 0 35%',
                height: '100%',
                overflowY: 'auto',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                background: 'rgba(248, 250, 252, 0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid rgba(15, 23, 42, 0.12)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span style={{ fontSize: '2.75rem' }}>{infoCardPlant.emoji}</span>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.95rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
                      {infoCardPlant.name}
                    </h2>
                    <span style={{ fontSize: '13px', color: '#14532d', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      Textbook Table 2.1 — Plant Observations
                    </span>
                  </div>
                </div>
              </div>

              {/* Observation Details Table — Raised Bright White Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', flex: 1, justifyContent: 'space-around', margin: '1.25rem 0' }}>
                <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '12px', borderLeft: '5px solid #16a34a', border: '1px solid rgba(15, 23, 42, 0.14)', borderLeftWidth: '5px', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)' }}>
                  <div style={{ fontSize: '13.5px', color: '#15803d', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.6px' }}>
                    • Stem
                  </div>
                  <div style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', lineHeight: '1.45' }}>
                    {infoCardPlant.tableInfo?.stem || '—'}
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '12px', borderLeft: '5px solid #2563eb', border: '1px solid rgba(15, 23, 42, 0.14)', borderLeftWidth: '5px', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)' }}>
                  <div style={{ fontSize: '13.5px', color: '#1d4ed8', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.6px' }}>
                    • Leaves
                  </div>
                  <div style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', lineHeight: '1.45' }}>
                    {infoCardPlant.tableInfo?.leaves || '—'}
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '12px', borderLeft: '5px solid #db2777', border: '1px solid rgba(15, 23, 42, 0.14)', borderLeftWidth: '5px', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)' }}>
                  <div style={{ fontSize: '13.5px', color: '#be185d', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.6px' }}>
                    • Flowers
                  </div>
                  <div style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', lineHeight: '1.45' }}>
                    {infoCardPlant.tableInfo?.flowers || '—'}
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '12px', borderLeft: '5px solid #d97706', border: '1px solid rgba(15, 23, 42, 0.14)', borderLeftWidth: '5px', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)' }}>
                  <div style={{ fontSize: '13.5px', color: '#b45309', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.6px' }}>
                    • Any other observations / features
                  </div>
                  <div style={{ fontSize: '18px', color: '#0f172a', fontWeight: '700', lineHeight: '1.45' }}>
                    {infoCardPlant.tableInfo?.notes || infoCardPlant.tableInfo?.other || '—'}
                  </div>
                </div>
              </div>

              {/* Footer action */}
              <button
                onClick={() => setInfoCardPlant(null)}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  background: '#16a34a',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)'
                }}
              >
                ✓ Close &amp; Select Another Plant
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes hintGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.65; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; box-shadow: 0 0 12px #f59e0b, inset 0 0 6px #f59e0b; }
        }
      `}</style>

      {/* Full-Screen Image Viewer / Lightbox */}
      {lightboxImage && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setLightboxImage(null)}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setLightboxImage(null)}
              title="Close full-screen view"
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                zIndex: 10,
                background: 'rgba(15, 23, 42, 0.9)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
              }}
            >
              ✕
            </button>
            <img 
              src={lightboxImage.src} 
              alt={lightboxImage.alt} 
              style={{ 
                maxWidth: '90vw', 
                maxHeight: '85vh', 
                objectFit: 'contain', 
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                border: '1.5px solid rgba(255, 255, 255, 0.2)'
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
