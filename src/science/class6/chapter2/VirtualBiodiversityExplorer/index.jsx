import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, RefreshCw, Volume2, CheckCircle, ChevronRight, Award, ArrowLeft, BookOpen, Target, Eye, ArrowRight, Sprout, Leaf, Flower2, Sparkles, Footprints, Lightbulb } from 'lucide-react';
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
import { sounds } from './utils/soundEffects';

import frogImg from '../../../../assets/frog.png';
import antImg from '../../../../assets/ant.png';
import crowImg from '../../../../assets/crow.png';
import butterflyImg from '../../../../assets/butterfly.png';
import sparrowImg from '../../../../assets/sparrow.png';
import squirrelImg from '../../../../assets/squirrel.png';
import cowImg from '../../../../assets/brown_cow.png';

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

const PLANT_BUTTON_THEMES = {
  hibiscus: {
    bg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
    border: '1px solid rgba(244, 63, 94, 0.35)',
    color: '#881337',
    shadow: '0 2px 8px rgba(225, 29, 72, 0.12)',
    hoverBg: 'linear-gradient(135deg, #fecdd3 0%, #fda4af 100%)'
  },
  tulsi: {
    bg: 'linear-gradient(135deg, #e6f4ea 0%, #d1fae5 100%)',
    border: '1px solid rgba(16, 185, 129, 0.35)',
    color: '#064e3b',
    shadow: '0 2px 8px rgba(16, 185, 129, 0.12)',
    hoverBg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
  },
  grass: {
    bg: 'linear-gradient(135deg, #ecfccb 0%, #d9f99d 100%)',
    border: '1px solid rgba(132, 204, 22, 0.35)',
    color: '#365314',
    shadow: '0 2px 8px rgba(132, 204, 22, 0.12)',
    hoverBg: 'linear-gradient(135deg, #d9f99d 0%, #bef264 100%)'
  },
  neem: {
    bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    border: '1px solid rgba(34, 197, 94, 0.35)',
    color: '#14532d',
    shadow: '0 2px 8px rgba(34, 197, 94, 0.12)',
    hoverBg: 'linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)'
  },
  rose: {
    bg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
    border: '1px solid rgba(251, 113, 133, 0.35)',
    color: '#9f1239',
    shadow: '0 2px 8px rgba(244, 63, 94, 0.12)',
    hoverBg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)'
  },
  sunflower: {
    bg: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)',
    border: '1px solid rgba(234, 179, 8, 0.35)',
    color: '#713f12',
    shadow: '0 2px 8px rgba(234, 179, 8, 0.12)',
    hoverBg: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)'
  }
};

const ANIMAL_BUTTON_THEMES = {
  crow: {
    bg: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    border: '1px solid rgba(71, 85, 105, 0.35)',
    color: '#1e293b',
    shadow: '0 2px 8px rgba(71, 85, 105, 0.12)',
    hoverBg: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'
  },
  sparrow: {
    bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    border: '1px solid rgba(180, 83, 9, 0.35)',
    color: '#78350f',
    shadow: '0 2px 8px rgba(180, 83, 9, 0.12)',
    hoverBg: 'linear-gradient(135deg, #fde68a 0%, #fcd34d 100%)'
  },
  cow: {
    bg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
    border: '1px solid rgba(194, 65, 12, 0.35)',
    color: '#7c2d12',
    shadow: '0 2px 8px rgba(194, 65, 12, 0.12)',
    hoverBg: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)'
  },
  squirrel: {
    bg: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)',
    border: '1px solid rgba(202, 138, 4, 0.35)',
    color: '#713f12',
    shadow: '0 2px 8px rgba(202, 138, 4, 0.12)',
    hoverBg: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)'
  },
  butterfly: {
    bg: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
    border: '1px solid rgba(147, 51, 234, 0.35)',
    color: '#581c87',
    shadow: '0 2px 8px rgba(147, 51, 234, 0.12)',
    hoverBg: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)'
  },
  frog: {
    bg: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
    border: '1px solid rgba(13, 148, 136, 0.35)',
    color: '#134e4a',
    shadow: '0 2px 8px rgba(13, 148, 136, 0.12)',
    hoverBg: 'linear-gradient(135deg, #99f6e4 0%, #5eead4 100%)'
  },
  ant: {
    bg: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
    border: '1px solid rgba(225, 29, 72, 0.35)',
    color: '#881337',
    shadow: '0 2px 8px rgba(225, 29, 72, 0.12)',
    hoverBg: 'linear-gradient(135deg, #fecdd3 0%, #fda4af 100%)'
  }
};

const ANIMAL_IMAGE_ASSETS = {
  frog: frogImg,
  ant: antImg,
  crow: crowImg,
  butterfly: butterflyImg,
  sparrow: sparrowImg,
  squirrel: squirrelImg,
  cow: cowImg,
  'Indian Pond Frog': frogImg,
  'Ant': antImg,
  'Crow': crowImg,
  'Butterfly': butterflyImg,
  'Sparrow': sparrowImg,
  'Squirrel': squirrelImg,
  'Cow': cowImg
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
  const [infoCardAnimal, setInfoCardAnimal] = useState(null);
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
          id: 'crow',
          name: 'Crow',
          popupName: 'Crow',
          emoji: '🐦‍⬛',
          type: 'animal',
          x: 11, y: 18, w: 20, h: 32,
          details: 'A clever grey-necked bird that flies in the open sky and perches on tree branches. Crows are intelligent scavengers with sharp sight and strong wings.',
          fact: 'Crows are remarkably intelligent — they can recognize individual human faces and use tools to fetch food!',
          verifyQ: { q: 'What is a crow classified as in terms of its diet?', opts: ['Pure herbivore', 'Scavenger that eats scraps and pests', 'Deep-sea predator', 'Insect only feeder'], correct: 1 },
          tableInfo: { stem: '—', leaves: '—', flowers: '—', notes: 'Locomotion: Flies using wings. Perches on branches.' },
        },
        {
          id: 'sparrow',
          name: 'Sparrow',
          popupName: 'Sparrow',
          emoji: '🐦',
          type: 'animal',
          x: 47.5, y: 27, w: 11, h: 14,
          details: 'A small, friendly bird perched on tree branches. Sparrows chirp cheerfully and feed on tiny seeds, grains, and insects near garden trees.',
          fact: 'House Sparrows have lived alongside humans for over 10,000 years — they are one of the most widespread birds on Earth!',
          verifyQ: { q: 'What do House Sparrows primarily eat?', opts: ['Large mammals', 'Insects and small seeds', 'Big fish', 'Tree bark'], correct: 1 },
          tableInfo: { stem: '—', leaves: '—', flowers: '—', notes: 'Locomotion: Flies and hops. Perches on branches.' },
        },
        {
          id: 'cow',
          name: 'Cow',
          popupName: 'Cow',
          emoji: '🐄',
          type: 'animal',
          x: 84, y: 42.5, w: 28, h: 37,
          details: 'A large domestic herbivore that grazes peacefully on fresh green grass and hay. Cows move calmly on four legs and provide healthy milk.',
          fact: 'Cows have best friends and get happy when spending time together in green pastures!',
          verifyQ: { q: 'What type of food does a cow eat?', opts: ['Fish and meat', 'Grass and hay', 'Insects only', 'Tree bark'], correct: 1 },
          tableInfo: { stem: '—', leaves: '—', flowers: '—', notes: 'Locomotion: Walks on four legs. Terrestrial herbivore.' },
        },
        {
          id: 'squirrel',
          name: 'Squirrel',
          popupName: 'Squirrel',
          emoji: '🐿️',
          type: 'animal',
          x: 16.5, y: 56, w: 29, h: 30,
          details: 'A quick and nimble rodent with three pale stripes along its back. It climbs tree trunks rapidly and nibbles on nuts, seeds, and berries.',
          fact: 'Squirrels accidentally plant thousands of trees each year by forgetting where they buried their stashes!',
          verifyQ: { q: 'Where would you most likely spot a Three-Striped Palm Squirrel?', opts: ['In the ocean', 'Climbing a tree trunk or rock', 'Flying in the sky', 'Burrowing underground'], correct: 1 },
          tableInfo: { stem: '—', leaves: '—', flowers: '—', notes: 'Locomotion: Runs and climbs. Lives on trees and land.' },
        },
        {
          id: 'butterfly',
          name: 'Butterfly',
          popupName: 'Butterfly',
          emoji: '🦋',
          type: 'animal',
          x: 49, y: 54.5, w: 10, h: 19,
          details: 'A colorful flying insect with delicate wings fluttering around garden flowers. It feeds on nectar using its long proboscis and helps pollinate flowers.',
          fact: 'Butterflies taste their food using tiny sensory receptors on their feet — not their mouths!',
          verifyQ: { q: 'How does a butterfly help plants?', opts: ['It eats all the leaves', 'It digs up roots', 'It helps in pollination by carrying pollen', 'It blocks sunlight'], correct: 2 },
          tableInfo: { stem: '—', leaves: '—', flowers: '—', notes: 'Locomotion: Flies using wings. Feeds on flower nectar.' },
        },
        {
          id: 'frog',
          name: 'Indian Pond Frog',
          popupName: 'Indian Pond Frog',
          emoji: '🐸',
          type: 'animal',
          x: 81, y: 84, w: 22, h: 22,
          details: 'An amphibian with smooth green skin resting near ponds and moist shores. It uses its strong hind legs to jump on land and webbed feet to swim swiftly in water.',
          fact: 'Frogs can breathe through their lungs on land and directly through their moist skin underwater — they are true amphibians!',
          verifyQ: { q: 'What type of habitat does an Indian Pond Frog live in?', opts: ['Only on dry land', 'Only in deep ocean', 'Both in freshwater and on moist shores', 'Only in desert sand'], correct: 2 },
          tableInfo: { stem: '—', leaves: '—', flowers: '—', notes: 'Locomotion: Jumps and swims. Amphibian. Lives near pond.' },
        },
        {
          id: 'ant',
          name: 'Ant',
          popupName: 'Ant',
          emoji: '🐜',
          type: 'animal',
          x: 35, y: 91, w: 38, h: 14,
          details: 'Tiny, hardworking social insects crawling together along the soil. Ants communicate using scent trails and can carry loads many times their own weight!',
          fact: 'Ants are incredibly strong — an ant can carry objects up to 50 times its own body weight!',
          verifyQ: { q: 'How do ants move and work together?', opts: ['They fly individually', 'They crawl in social trails using scent clues', 'They swim underwater', 'They jump over trees'], correct: 1 },
          tableInfo: { stem: '—', leaves: '—', flowers: '—', notes: 'Locomotion: Crawls on six legs. Lives in colonies.' },
        }
      ];
    }
  }, [typeFilter]);

  const filteredBonus = React.useMemo(() => {
    return [];
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

  // Clean up Speech and Intervals - Silence guard for p.11 (typeFilter === 'plant')
  useEffect(() => {
    if (typeFilter === 'plant') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      sounds.setMuted(true);
      sounds.stopSpeech();
    } else {
      sounds.setMuted(false);
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      sounds.stopSpeech();
      sounds.setMuted(false);
      clearInterval(holdIntervalRef.current);
    };
  }, [typeFilter]);

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
    const hitMargin = 1; // Precise boundary margin

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
      if (typeFilter === 'plant') {
        setMissMessage('Try searching another area!');
        setMissPos({ x: mousePosRef.current.x, y: mousePosRef.current.y });
        setTimeout(() => setMissMessage(''), 1400);
      }
      return;
    }

    const { data, isBonus } = currentHover;

    if (typeFilter === 'animal') {
      if (!notebook.includes(data.id)) {
        setNotebook(prev => [...prev, data.id]);
      }
      setInfoCardAnimal(data);
      return;
    }
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
      height: '560px',
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
        <div 
          className="frame-page-left act21-dark-left" 
          style={{ 
            background: '#123D2A',
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            boxSizing: 'border-box',
            justifyContent: 'space-between'
          }}
        >
          {typeFilter === 'plant' ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'space-around',
              minHeight: 0,
              paddingBottom: '1rem'
            }}>
              <div>
                <div className="textbook-eyebrow" style={{ marginBottom: '0.35rem', fontSize: '1.25rem', fontWeight: '700', letterSpacing: '0.15em' }}>
                  Activity 2.1 · Plants Walk
                </div>
                <h1 className="textbook-title" style={{ 
                  fontFamily: 'var(--serif-font)',
                  color: '#ffffff',
                  fontSize: 'clamp(1.75rem, 2.2vw, 2.15rem)',
                  fontWeight: '900',
                  lineHeight: '1.2',
                  textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                  letterSpacing: '0.01em',
                  margin: '0 0 0.5rem 0'
                }}>
                  🌿 Virtual Plants Walk
                </h1>
              </div>

              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.5rem'
              }}>
                <p style={{ 
                  color: '#fbbf24', 
                  margin: 0, 
                  fontSize: 'clamp(1.18rem, 1.45vw, 1.32rem)', 
                  lineHeight: '1.75',
                  letterSpacing: '0.01em'
                }}>
                  Join <b style={{ fontWeight: 'bold', color: '#fbbf24' }}>Dr. Raghu</b> and <b style={{ fontWeight: 'bold', color: '#fbbf24' }}>Maniram chacha</b> as we venture into the neighborhood and school garden to catalog the <b style={{ fontWeight: 'bold', color: '#fbbf24' }}>plant life</b> in our area!
                </p>
                <p style={{ 
                  color: '#fbbf24', 
                  margin: 0, 
                  fontSize: 'clamp(1.18rem, 1.45vw, 1.32rem)', 
                  lineHeight: '1.75',
                  letterSpacing: '0.01em'
                }}>
                  Your objective is to observe different plant types (herbs, shrubs, trees, and water lilies). When you spot an organism on the right, <b>click and hold</b> your scanner lens on it to examine its details.
                </p>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'space-around',
              minHeight: 0,
              paddingBottom: '0.5rem'
            }}>
              <div>
                <div className="textbook-eyebrow" style={{ marginBottom: '0.35rem', fontSize: '1.25rem', fontWeight: '700', letterSpacing: '0.15em' }}>
                  Activity 2.1 · Animals Walk
                </div>
                <h1 className="textbook-title" style={{ 
                  fontFamily: 'var(--serif-font)',
                  color: '#ffffff',
                  fontSize: 'clamp(1.75rem, 2.2vw, 2.15rem)',
                  fontWeight: '900',
                  lineHeight: '1.2',
                  textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                  letterSpacing: '0.01em',
                  margin: '0 0 0.5rem 0'
                }}>
                  🐾 Virtual Animals Walk
                </h1>
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.25rem'
              }}>
                <p style={{ 
                  color: '#fbbf24', 
                  margin: 0, 
                  fontSize: 'clamp(1.12rem, 1.35vw, 1.25rem)', 
                  lineHeight: '1.7',
                  letterSpacing: '0.01em'
                }}>
                  Join <b style={{ fontWeight: 'bold', color: '#fbbf24' }}>Dr. Raghu</b> and <b style={{ fontWeight: 'bold', color: '#fbbf24' }}>Maniram chacha</b> as we venture into the neighborhood and school garden to catalog the <b style={{ fontWeight: 'bold', color: '#fbbf24' }}>animal life</b> in our area!
                </p>
                <p style={{ 
                  color: '#fbbf24', 
                  margin: 0, 
                  fontSize: 'clamp(1.12rem, 1.35vw, 1.25rem)', 
                  lineHeight: '1.7',
                  letterSpacing: '0.01em'
                }}>
                  Your objective is to observe different animals and their behaviours. When you spot an animal on the right, <b>click and hold</b> your scanner lens directly on it to examine its details.
                </p>
              </div>
            </div>
          )}

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
            {typeFilter === 'plant' ? (
              <>
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
                      fontWeight: 'bold', 
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    Continue to Animals (Table 2.2) <ChevronRight size={16} />
                  </button>
                )}
              </>
            ) : (
              <>
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
                      fontWeight: 'bold',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.35rem', 
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' 
                    }}
                  >
                    🎉 Walk Completed! Proceed to Next Activity <ArrowRight size={14} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* ============ RIGHT COLUMN: WORKSPACE ============ */}
        <div className="frame-page-right" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, paddingTop: 0 }}>
          <div style={{ 
            flex: 1, 
            minHeight: 0, 
            position: 'relative', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.12)',
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
                  objectFit: typeFilter === 'animal' ? 'contain' : 'cover', 
                  objectPosition: 'center',
                  display: 'block', 
                  pointerEvents: 'none', 
                  userSelect: 'none' 
                }}
                draggable={false}
              />

              {/* Gold hint rings */}
              {showHints && filteredTargets.map(t => {
                const isAnimal = typeFilter === 'animal';
                const ringSize = isAnimal 
                  ? { width: '56px', height: '56px' }
                  : { width: '36px', height: '36px' };
                return (
                  <div
                    key={`hint-${t.id}`}
                    style={{
                      position: 'absolute',
                      left: `${t.x}%`,
                      top: `${t.y}%`,
                      transform: 'translate(-50%, -50%)',
                      borderRadius: '50%',
                      border: '3px solid #FFD54A',
                      boxShadow: '0 0 16px rgba(255, 213, 74, 0.9), inset 0 0 8px rgba(255, 213, 74, 0.4)',
                      animation: 'hintGlow 1.5s infinite ease-in-out',
                      pointerEvents: 'none',
                      zIndex: 8,
                      ...ringSize
                    }}
                  />
                );
              })}

              {/* Scanned target badges */}
              {typeFilter === 'plant' && filteredTargets.map(t => {
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
              {missMessage && typeFilter === 'plant' && (
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
                  border: hoveredTarget ? '2.5px solid #22d3ee' : '2px solid #3b82f6',
                  borderRadius: '8px',
                  pointerEvents: 'none',
                  zIndex: 25,
                  background: hoveredTarget ? 'rgba(34, 211, 238, 0.25)' : 'rgba(59, 130, 246, 0.15)',
                  boxShadow: hoveredTarget ? '0 0 18px rgba(34, 211, 238, 0.6)' : '0 0 10px rgba(59, 130, 246, 0.3)',
                }}>
                  {isHolding && typeFilter === 'plant' && (
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

              {/* Scanned/Hovered Target Popup Label */}
              {isInsideImage && hoveredTarget && (
                <div style={{
                  position: 'absolute',
                  left: `${mousePos.x}px`,
                  top: `${mousePos.y - 48}px`,
                  transform: 'translateX(-50%)',
                  background: 'rgba(15, 23, 42, 0.95)',
                  color: '#ffffff',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '13.5px',
                  fontWeight: 'bold',
                  border: '1.5px solid #22d3ee',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.4), 0 0 12px rgba(34,211,238,0.5)',
                  pointerEvents: 'none',
                  zIndex: 35,
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.4px'
                }}>
                  {hoveredTarget.data.popupName || hoveredTarget.data.name}
                </div>
              )}
            </div>
          </div>

          {/* Readout panel inside right page */}
          <div className="readout" style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              {filteredTargets.map(t => {
                const logged = notebook.includes(t.id);
                const isPlant = typeFilter === 'plant';
                const theme = isPlant 
                  ? (PLANT_BUTTON_THEMES[t.id.toLowerCase()] || PLANT_BUTTON_THEMES.tulsi) 
                  : (ANIMAL_BUTTON_THEMES[t.id.toLowerCase()] || ANIMAL_BUTTON_THEMES.sparrow);
                
                return (
                  <button 
                    key={t.id} 
                    style={{
                      fontSize: '14px',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '10px',
                      border: theme.border,
                      background: theme.bg,
                      color: theme.color,
                      boxShadow: theme.shadow,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      outline: 'none',
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (theme) {
                        e.currentTarget.style.background = theme.hoverBg;
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.18)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (theme) {
                        e.currentTarget.style.background = theme.bg;
                        e.currentTarget.style.transform = 'translateY(0px)';
                        e.currentTarget.style.boxShadow = theme.shadow;
                      }
                    }}
                    onClick={() => typeFilter === 'plant' ? setInfoCardPlant(t) : setInfoCardAnimal(t)}
                  >
                    <span style={{ fontSize: '16px' }}>{t.emoji}</span>
                    <span style={{ color: theme.color, fontWeight: '700' }}>
                      {t.popupName || t.name.split(' ')[0]}
                    </span>
                    {isPlant && logged && <CheckCircle size={14} color={theme.color} strokeWidth={2.5} />}
                  </button>
                );
              })}
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
            width: '100vw',
            height: '100vh',
            zIndex: 99999999,
            background: 'rgba(9, 13, 22, 0.98)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            overflow: 'hidden',
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
                top: '1.25rem',
                right: '1.25rem',
                zIndex: 100,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '22px',
                fontWeight: 'bold',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease'
              }}
            >
              ✕
            </button>

            {/* LEFT SIDE — Plant Image (65% width, displaying complete uncropped image extending full height) */}
            <div 
              style={{
                width: '65%',
                flex: '0 0 65%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                boxSizing: 'border-box',
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
                  objectFit: 'contain', 
                  objectPosition: 'center',
                  filter: 'drop-shadow(0 12px 30px rgba(0, 0, 0, 0.6))'
                }} 
              />
            </div>

            {/* RIGHT SIDE — Observation Content (35% width, Dark Navy #071B3D Panel) */}
            <div 
              style={{
                width: '35%',
                flex: '0 0 35%',
                height: '100%',
                overflowY: 'auto',
                padding: '2rem 1.8rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                background: '#071B3D',
                borderLeft: '1px solid rgba(34, 197, 94, 0.25)',
                boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid rgba(34, 197, 94, 0.25)', paddingBottom: '0.85rem', paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span style={{ fontSize: '2.5rem', lineHeight: '1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{infoCardPlant.emoji}</span>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.95rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                      {infoCardPlant.name}
                    </h2>
                    <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      Textbook Table 2.1 — Observations
                    </span>
                  </div>
                </div>
              </div>

              {/* Observation Details Table — Modern Botanical Information Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, justifyContent: 'space-around', margin: '1rem 0' }}>
                {/* 1. STEM CARD */}
                <div style={{ 
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #f0fbf5 0%, #e3f6ec 100%)', 
                  padding: '1rem 1.25rem', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(22, 163, 74, 0.28)', 
                  boxShadow: '0 4px 16px rgba(22, 163, 74, 0.08), 0 1px 4px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.15rem'
                }}>
                  {/* Left 52px circular green icon */}
                  <div style={{
                    width: '52px',
                    height: '52px',
                    minWidth: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.35)',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    <Sprout color="#ffffff" size={26} strokeWidth={2.4} />
                  </div>

                  {/* Content (Heading + Description) */}
                  <div style={{ position: 'relative', zIndex: 2, flex: 1 }}>
                    <div style={{ fontSize: '13px', color: '#15803d', fontWeight: '900', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.8px' }}>
                      • STEM
                    </div>
                    <div style={{ background: '#071B3D', borderRadius: '7px', padding: '8px 12px', color: '#FFFFFF', fontWeight: '700', fontSize: '15px', lineHeight: '1.45' }}>
                      {infoCardPlant.tableInfo?.stem || '—'}
                    </div>
                  </div>

                  {/* Right faint botanical silhouette */}
                  <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.14, pointerEvents: 'none', zIndex: 1 }}>
                    <path d="M50 95 V25" />
                    <path d="M50 65 Q30 55 20 35 Q40 40 50 65" fill="#16a34a" />
                    <path d="M50 45 Q70 35 80 15 Q60 20 50 45" fill="#16a34a" />
                    <path d="M50 25 Q35 15 30 5 Q45 8 50 25" fill="#16a34a" />
                  </svg>
                </div>

                {/* 2. LEAVES CARD */}
                <div style={{ 
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #f2f9ff 0%, #e2f2fe 100%)', 
                  padding: '1rem 1.25rem', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(37, 99, 235, 0.28)', 
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08), 0 1px 4px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.15rem'
                }}>
                  {/* Left 52px circular blue icon */}
                  <div style={{
                    width: '52px',
                    height: '52px',
                    minWidth: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    <Leaf color="#ffffff" size={26} strokeWidth={2.4} />
                  </div>

                  {/* Content (Heading + Description) */}
                  <div style={{ position: 'relative', zIndex: 2, flex: 1 }}>
                    <div style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: '900', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.8px' }}>
                      • LEAVES
                    </div>
                    <div style={{ background: '#071B3D', borderRadius: '7px', padding: '8px 12px', color: '#FFFFFF', fontWeight: '700', fontSize: '15px', lineHeight: '1.45' }}>
                      {infoCardPlant.tableInfo?.leaves || '—'}
                    </div>
                  </div>

                  {/* Right faint botanical silhouette */}
                  <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.14, pointerEvents: 'none', zIndex: 1 }}>
                    <path d="M15 85 Q20 20 85 15 Q80 80 15 85 Z" fill="#2563eb" />
                    <path d="M15 85 Q50 50 85 15" stroke="#ffffff" strokeWidth="2.5" />
                    <path d="M40 60 Q55 58 65 45" stroke="#ffffff" strokeWidth="2" />
                    <path d="M55 45 Q70 43 80 30" stroke="#ffffff" strokeWidth="2" />
                    <path d="M30 70 Q45 75 55 70" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                </div>

                {/* 3. FLOWERS CARD */}
                <div style={{ 
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #fdf4f9 0%, #fbe8f3 100%)', 
                  padding: '1rem 1.25rem', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(219, 39, 119, 0.28)', 
                  boxShadow: '0 4px 16px rgba(219, 39, 119, 0.08), 0 1px 4px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.15rem'
                }}>
                  {/* Left 52px circular pink/magenta icon */}
                  <div style={{
                    width: '52px',
                    height: '52px',
                    minWidth: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(219, 39, 119, 0.35)',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    <Flower2 color="#ffffff" size={26} strokeWidth={2.4} />
                  </div>

                  {/* Content (Heading + Description) */}
                  <div style={{ position: 'relative', zIndex: 2, flex: 1 }}>
                    <div style={{ fontSize: '13px', color: '#be185d', fontWeight: '900', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.8px' }}>
                      • FLOWERS
                    </div>
                    <div style={{ background: '#071B3D', borderRadius: '7px', padding: '8px 12px', color: '#FFFFFF', fontWeight: '700', fontSize: '15px', lineHeight: '1.45' }}>
                      {infoCardPlant.tableInfo?.flowers || '—'}
                    </div>
                  </div>

                  {/* Right faint botanical silhouette */}
                  <svg width="120" height="120" viewBox="0 0 100 100" fill="#db2777" style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.14, pointerEvents: 'none', zIndex: 1 }}>
                    <circle cx="50" cy="50" r="14" fill="#be185d" />
                    <ellipse cx="50" cy="20" rx="12" ry="18" />
                    <ellipse cx="50" cy="80" rx="12" ry="18" />
                    <ellipse cx="20" cy="50" rx="18" ry="12" />
                    <ellipse cx="80" cy="50" rx="18" ry="12" />
                    <ellipse cx="28" cy="28" rx="14" ry="14" transform="rotate(45 28 28)" />
                    <ellipse cx="72" cy="28" rx="14" ry="14" transform="rotate(-45 72 28)" />
                    <ellipse cx="28" cy="72" rx="14" ry="14" transform="rotate(-45 28 72)" />
                    <ellipse cx="72" cy="72" rx="14" ry="14" transform="rotate(45 72 72)" />
                  </svg>
                </div>

                {/* 4. ANY OTHER OBSERVATIONS / FEATURES CARD */}
                <div style={{ 
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #fffdf0 0%, #fef8d8 100%)', 
                  padding: '1rem 1.25rem', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(217, 119, 6, 0.28)', 
                  boxShadow: '0 4px 16px rgba(217, 119, 6, 0.08), 0 1px 4px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.15rem'
                }}>
                  {/* Left 52px circular orange/golden icon */}
                  <div style={{
                    width: '52px',
                    height: '52px',
                    minWidth: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    <Sparkles color="#ffffff" size={26} strokeWidth={2.4} />
                  </div>

                  {/* Content (Heading + Description) */}
                  <div style={{ position: 'relative', zIndex: 2, flex: 1 }}>
                    <div style={{ fontSize: '13px', color: '#b45309', fontWeight: '900', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.8px' }}>
                      • ANY OTHER OBSERVATIONS / FEATURES
                    </div>
                    <div style={{ background: '#071B3D', borderRadius: '7px', padding: '8px 12px', color: '#FFFFFF', fontWeight: '700', fontSize: '15px', lineHeight: '1.45' }}>
                      {infoCardPlant.tableInfo?.notes || infoCardPlant.tableInfo?.other || '—'}
                    </div>
                  </div>

                  {/* Right faint botanical silhouette */}
                  <svg width="120" height="120" viewBox="0 0 100 100" fill="#d97706" style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.14, pointerEvents: 'none', zIndex: 1 }}>
                    <path d="M50 0 L60 38 L98 50 L60 62 L50 100 L40 62 L2 50 L40 38 Z" />
                    <circle cx="75" cy="22" r="7" />
                    <circle cx="25" cy="78" r="5" />
                  </svg>
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

      {/* Textbook Table 2.2 Animal Information Card Modal */}
      {infoCardAnimal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999999,
            background: 'rgba(9, 13, 22, 0.98)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setInfoCardAnimal(null)}
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
              onClick={() => setInfoCardAnimal(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                zIndex: 100,
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '22px',
                fontWeight: 'bold',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
              }}
            >
              ✕
            </button>

            {/* LEFT SIDE — Animal Image (65% width, maximum available space matching Plant Observation layout) */}
            <div 
              style={{
                width: '65%',
                flex: '0 0 65%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                boxSizing: 'border-box',
                background: 'linear-gradient(135deg, #090d16 0%, #1e293b 100%)',
                borderRight: '1px solid rgba(56, 189, 248, 0.3)',
                overflow: 'hidden'
              }}
            >
              <img 
                src={infoCardAnimal.img || ANIMAL_IMAGE_ASSETS[infoCardAnimal.id] || ANIMAL_IMAGE_ASSETS[infoCardAnimal.name]} 
                alt={infoCardAnimal.name} 
                style={{ 
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  objectFit: 'contain', 
                  objectPosition: 'center',
                  filter: 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.75))'
                }} 
              />
            </div>

            {/* RIGHT SIDE — Animal Observation Details (35% width, Deep Navy #071B3D) */}
            <div 
              style={{
                width: '35%',
                flex: '0 0 35%',
                height: '100%',
                overflowY: 'auto',
                padding: '2.2rem 2rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                background: '#071B3D',
                borderLeft: '1px solid rgba(56, 189, 248, 0.25)',
                boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.4)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', borderBottom: '2px solid rgba(56, 189, 248, 0.25)', paddingBottom: '1.1rem', paddingTop: '0.25rem' }}>
                <span style={{ fontSize: '3rem', lineHeight: '1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{infoCardAnimal.emoji}</span>
                <div>
                  <h2 style={{ margin: 0, fontSize: '2.25rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                    {infoCardAnimal.popupName || infoCardAnimal.name}
                  </h2>
                  <span style={{ fontSize: '13.5px', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Textbook Table 2.2 — Animal Observation
                  </span>
                </div>
              </div>

              {/* Observation Cards Container — Vertically Balanced to Fill Space */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', flex: 1, justifyContent: 'space-around', margin: '1.25rem 0' }}>
                {/* 1. Animal Description & Behavior Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #102A4C 0%, #0a1c36 100%)',
                  padding: '1.45rem 1.65rem',
                  borderRadius: '18px',
                  border: '1.5px solid rgba(56, 189, 248, 0.45)',
                  borderLeft: '7px solid #38BDF8',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35), 0 0 18px rgba(56, 189, 248, 0.12)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  {/* Subtle Habitat Watermark Pattern */}
                  <div style={{
                    position: 'absolute',
                    right: '-15px',
                    bottom: '-15px',
                    opacity: 0.06,
                    pointerEvents: 'none',
                    color: '#38BDF8'
                  }}>
                    <Footprints size={120} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'rgba(56, 189, 248, 0.16)',
                      border: '1.5px solid rgba(56, 189, 248, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Footprints size={22} color="#38BDF8" />
                    </div>
                    <div style={{ fontSize: '20px', color: '#38BDF8', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      • ANIMAL DESCRIPTION &amp; BEHAVIOR
                    </div>
                  </div>
                  <div style={{ fontSize: '20px', color: '#FFFFFF', fontWeight: '700', lineHeight: '1.48', position: 'relative', zIndex: 1 }}>
                    {infoCardAnimal.details}
                  </div>
                </div>

                {/* 2. Did You Know Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #103B3A 0%, #082625 100%)',
                  padding: '1.45rem 1.65rem',
                  borderRadius: '18px',
                  border: '1.5px solid rgba(34, 197, 94, 0.45)',
                  borderLeft: '7px solid #22C55E',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35), 0 0 18px rgba(34, 197, 94, 0.12)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  {/* Subtle Habitat Watermark Pattern */}
                  <div style={{
                    position: 'absolute',
                    right: '-15px',
                    bottom: '-15px',
                    opacity: 0.06,
                    pointerEvents: 'none',
                    color: '#4ADE80'
                  }}>
                    <Lightbulb size={120} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'rgba(34, 197, 94, 0.16)',
                      border: '1.5px solid rgba(34, 197, 94, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Lightbulb size={22} color="#4ADE80" />
                    </div>
                    <div style={{ fontSize: '20px', color: '#4ADE80', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      💡 DID YOU KNOW?
                    </div>
                  </div>
                  <div style={{ fontSize: '20px', color: '#FFFFFF', fontWeight: '700', lineHeight: '1.48', position: 'relative', zIndex: 1 }}>
                    {infoCardAnimal.fact}
                  </div>
                </div>
              </div>

              {/* Footer close button */}
              <button
                onClick={() => setInfoCardAnimal(null)}
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                ✓ Close &amp; Select Another Animal
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes hintGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.8; box-shadow: 0 0 14px rgba(255, 213, 74, 0.9), inset 0 0 8px rgba(255, 213, 74, 0.4); }
          50% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; box-shadow: 0 0 22px rgba(255, 213, 74, 1), inset 0 0 12px rgba(255, 213, 74, 0.6); }
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
