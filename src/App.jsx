import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import {
  BookOpen,
  Zap,
  FlaskConical,
  Dna,
  ArrowLeft,
  Compass,
  Play,
  ArrowRight,
  Home,
  Sun,
  Moon,
  Hammer,
  Battery,
  Flame,
  Search,
  X
} from 'lucide-react';
import { useTheme } from './ThemeContext.jsx';
import VerticalLevelMap from './components/VerticalLevelMap';
const ElectricSwitchActivity = lazy(() => import('./activities/ElectricSwitch'));
const ElectricCircuitActivity = lazy(() => import('./activities/ElectricCircuit'));
const ActivityTemplate = lazy(() => import('./activities/ActivityTemplate'));
const GeographyExpeditionActivity = lazy(() => import('./activities/Class7Geography'));
const SphericalMirrorsActivity = lazy(() => import('./activities/SphericalMirrors'));
const FoodTestingActivity = lazy(() => import('./activities/FoodTesting'));
const FatTestingActivity = lazy(() => import('./activities/FatTesting'));
const ProteinTestingActivity = lazy(() => import('./activities/ProteinTesting'));
const MaterialsPropertiesActivity = lazy(() => import('./activities/MaterialsProperties'));
const MagneticPolesActivity = lazy(() => import('./activities/MagneticPoles'));
const SuspendedMagnetActivity = lazy(() => import('./activities/SuspendedMagnet'));
const MagneticCompassActivity = lazy(() => import('./activities/MagneticCompass'));
const MagnetInteractionActivity = lazy(() => import('./activities/MagnetInteraction'));
const LinearMotionActivity = lazy(() => import('./activities/LinearMotion'));
const CircularMotionActivity = lazy(() => import('./activities/CircularMotion'));
const HeatingEffectActivity = lazy(() => import('./activities/HeatingEffectOfCurrent'));
const LemonBatteryLabActivity = lazy(() => import('./activities/LemonBatteryLab'));
const TorchExplorerActivity = lazy(() => import('./activities/TorchExplorer'));
const LampExplorerActivity = lazy(() => import('./activities/LampExplorer'));
const Activity3_7 = lazy(() => import('./activities/Activity3_7'));
const Activity3_11 = lazy(() => import('./activities/Activity3_11'));
const MagneticEffectOfCurrentActivity = lazy(() => import('./activities/MagneticEffectOfCurrent'));
const ElectromagnetInvestigationActivity = lazy(() => import('./activities/ElectromagnetInvestigation'));
const GrassrootsDemocracyActivity = lazy(() => import('./activities/GrassrootsDemocracy'));
const LocatingPlacesActivity = lazy(() => import('./activities/LocatingPlaces'));
const Activity9_1 = lazy(() => import('./activities/SolutesAndSolvents'));
const LineSegmentLabActivity = lazy(() => import('./activities/LineSegmentLab'));
const ParallelIntersectingLabActivity = lazy(() => import('./activities/ParallelIntersectingLab'));
const CurvesRegionsLabActivity = lazy(() => import('./activities/CurvesRegionsLab'));
const AnglesLabActivity = lazy(() => import('./activities/AnglesLab'));
const PolygonsLabActivity = lazy(() => import('./activities/PolygonsLab'));
const CirclesLabActivity = lazy(() => import('./activities/CirclesLab'));
const VirtualBiodiversityExplorerActivity = lazy(() => import('./activities/VirtualBiodiversityExplorer'));
const PlantDetectiveActivity = lazy(() => import('./activities/PlantDetective'));
const AnimalHabitatExplorerActivity = lazy(() => import('./activities/AnimalHabitatExplorer'));
const Activity9_2 = lazy(() => import('./activities/SolubilityOfBakingSoda'));
const ForceExplorerActivity = lazy(() => import('./activities/ForceExplorer'));
const MicroscopeDiscovery = lazy(() => import('./activities/MicroscopeDiscovery'));
const MaterialDetectiveActivity = lazy(() => import('./activities/MaterialDetective'));
const MaterialsAroundUsActivity = lazy(() => import('./activities/MaterialsAroundUs'));
const Activity4_1 = lazy(() => import('./activities/Activity4_1'));
const Activity4_6 = lazy(() => import('./activities/Activity4_6'));
const Activity4_7 = lazy(() => import('./activities/Activity4_7'));
const FunWithMagnets = lazy(() => import('./activities/FunWithMagnets'));
const Chapter4Flow = lazy(() => import('./activities/Chapter4Flow'));
const IntroMagnets = lazy(() => import('./activities/IntroMagnets'));
const AppreciatingBiodiversityActivity = lazy(() => import('./activities/AppreciatingBiodiversityActivity'));
const LeafVenationLab = lazy(() => import('./activities/LeafVenationLab'));
const RootSystemsLab = lazy(() => import('./activities/RootSystemsLab'));
const VenationRootCorrelationLab = lazy(() => import('./activities/VenationRootCorrelationLab'));
const SeedDissectionLab = lazy(() => import('./activities/SeedDissectionLab'));
const IntroductionMindMap = lazy(() => import('./activities/IntroductionMindMap'));
const InlineSortingActivity = lazy(() => import('./activities/InlineSortingActivity'));
const GroupingBasicsBookSpread = lazy(() => import('./activities/GroupingBasicsBookSpread'));
import './App.css';
import sanskritSlogan from './assets/sanskrit_slogan.png';



const contentLessonsData = {
  'biodiversity_concept': {
    title: 'Introduction',
    slides: [
      {
        title: '🌿 The Nature Walk Begins',
        content: 'The lesson begins with an exciting nature walk led by Dr Raghu and Maniram chacha. During the walk, the students observe different plants, trees, birds, butterflies, monkeys, and many other living things around them. They learn to watch nature carefully, listen to the unique calls of birds, and respect all living creatures without disturbing them.',
        bullets: [
          '👀 Observe carefully — notice stems, leaves, flowers, and any interesting features.',
          '🎵 Listen! Maniram chacha mimics bird calls to show how animals communicate.',
          '📋 Record your observations in Tables 2.1 and 2.2 — plants and animals separately.',
          '🤝 Compare your findings with classmates — everyone notices something different!'
        ]
      }
    ]
  },
  'grouping_basics_concept': {
    title: '2.2 How to Group Plants & Animals?',
    slides: [
      {
        title: 'The Purpose of Classification',
        content: 'Grouping (classification) is the method of sorting things into groups based on their similarities and differences. It makes it easier to understand, compare, and study the vast diversity of living beings.',
        bullets: [
          'Helps in systematic cataloging.',
          'Reveals relationships between different species.',
          'Prevents confusion when studying millions of living things.'
        ]
      },
      {
        title: 'Criteria for Grouping',
        content: 'Just like you organize books in a schoolbag, scientists group organisms using specific criteria:',
        bullets: [
          '🌸 Flowers: Grouping into flowering and non-flowering plants.',
          '🌿 Stems: Grouping by soft, green vs hard, woody stems.',
          '🥗 Eating Habits: What they eat and how they feed.',
          '📍 Place they live: Ground, trees, water, or air.'
        ]
      },
      {
        title: 'Concept Checkpoint',
        isQuiz: true,
        questions: [
          {
            q: 'Why do we group plants and animals in science?',
            opts: [
              'To prevent them from moving around.',
              'To make it easier to study their similarities and differences.',
              'To calculate the exact number of leaves on each tree.'
            ],
            correct: 1
          },
          {
            q: 'Which of these is a valid scientific basis for grouping plants?',
            opts: [
              'The height and nature of its stem.',
              'The names given to them by gardeners.',
              'The total amount of shade they cast at noon.'
            ],
            correct: 0
          }
        ]
      }
    ]
  },
  'plant_variety_concept': {
    title: '2.2.1-A Plant Classification',
    slides: [
      {
        title: 'Herbs, Shrubs, and Trees',
        content: 'Plants display an incredible range of sizes and forms. We categorize them based on their height, stem thickness, and branch levels:',
        bullets: [
          '🌿 Herbs: Short plants with soft, green, and tender stems that bend easily (e.g. Grass, Tomato, Coriander, Tulsi).',
          '🌺 Shrubs: Medium height, thin woody stems branching out close to the base/ground (e.g. Rose, Lemon, Hibiscus).',
          '🌳 Trees: Tall plants with thick, hard brown woody trunks branching high up (e.g. Mango, Banyan, Neem, Deodar).'
        ]
      },
      {
        title: 'Climbers & Creepers',
        content: 'Some plants have weak stems that cannot stand upright on their own:',
        bullets: [
          '🍉 Creepers: Plants that creep and spread horizontally along the ground (e.g., Pumpkin, Watermelon, Sweet Potato).',
          '🍇 Climbers: Plants that climb up using neighboring structures or trees for support (e.g., Money Plant, Pea Plant, Grapevine).'
        ]
      },
      {
        title: 'Concept Checkpoint',
        isQuiz: true,
        questions: [
          {
            q: 'Which plant type branches close to the ground and has thin, woody stems?',
            opts: [
              'Trees',
              'Herbs',
              'Shrubs'
            ],
            correct: 2
          },
          {
            q: 'Watermelon plants spread horizontally along the soil. They are classified as:',
            opts: [
              'Climbers',
              'Creepers',
              'Trees'
            ],
            correct: 1
          }
        ]
      }
    ]
  },
  'venation_roots_concept': {
    title: '2.2.1-B Leaf Venations & Root Systems Correlation',
    slides: [
      {
        title: 'Leaf Venation Patterns',
        content: 'Veins are thin lines running across a leaf. The pattern formed by these veins is called leaf venation:',
        bullets: [
          '🕸️ Reticulate Venation: Veins form a net-like mesh on both sides of a thick midrib (e.g., Hibiscus, Mustard, Rose, Sadabahar).',
          '📏 Parallel Venation: Veins run parallel to each other from the base to tip (e.g., Grass, Banana, Lemongrass, Wheat, Maize).'
        ],
        svg: 'venation'
      },
      {
        title: 'Root Systems',
        content: 'Roots anchor the plant and absorb water. There are two primary root types:',
        bullets: [
          '🥕 Taproot: A single, thick primary root growing deep vertically, with smaller side branches (lateral roots) (e.g., Mustard, Gram).',
          '🌾 Fibrous Roots: A bunch of thin, equal-sized roots arising together from the base of the stem (e.g., Grass, Wheat, Maize).'
        ],
        svg: 'roots'
      },
      {
        title: 'The Great Correlation',
        content: 'NCERT notes show a fascinating 1-to-1 relationship in plants. You can tell a root system just by looking at its leaves!',
        bullets: [
          '🕸️ Reticulate Venation ⇄ 🥕 Taproot System (e.g., Mustard, Sadabahar, Chickpea).',
          '📏 Parallel Venation ⇄ 🌾 Fibrous Root System (e.g., Lemongrass, Grass, Wheat).'
        ],
        svg: 'correlation'
      },
      {
        title: 'Concept Checkpoint',
        isQuiz: true,
        questions: [
          {
            q: 'What root system is correlated with reticulate leaf venation?',
            opts: [
              'Fibrous Root System',
              'Taproot System',
              'Adventitious Root System'
            ],
            correct: 1
          },
          {
            q: 'Which of the following leaf-root pairs matches Lemongrass?',
            opts: [
              'Parallel Venation and Fibrous Roots',
              'Reticulate Venation and Taproots',
              'Parallel Venation and Taproots'
            ],
            correct: 0
          }
        ]
      }
    ]
  },
  'cotyledons_concept': {
    title: '2.2.1-C Seeds & Cotyledons',
    slides: [
      {
        title: 'What is a Cotyledon?',
        content: 'Inside a seed coat is the embryo and cotyledons (seed leaves) which store food reserves for the germinating plant:',
        bullets: [
          '🥜 Dicotyledons (Dicots): Seeds that easily split into two halves (e.g. Gram, Chickpea, Pea, Kidney Beans).',
          '🌽 Monocotyledons (Monocots): Seeds with a single cotyledon that cannot be split (e.g. Maize, Wheat, Rice, Grass).'
        ],
        svg: 'cotyledon'
      },
      {
        title: 'The Triad Correlation',
        content: 'Combining seeds, venation, and roots, we have two primary plant divisions:',
        bullets: [
          '🌱 Monocots: 1 Cotyledon ⇄ Parallel Venation ⇄ Fibrous Roots (e.g., Wheat, Maize, Grass).',
          '🌳 Dicots: 2 Cotyledons ⇄ Reticulate Venation ⇄ Taproots (e.g., Gram, Mustard, Rose).'
        ]
      },
      {
        title: 'Concept Checkpoint',
        isQuiz: true,
        questions: [
          {
            q: 'How many cotyledons does a chickpea seed have?',
            opts: [
              'One (Monocot)',
              'Two (Dicot)',
              'Three'
            ],
            correct: 1
          },
          {
            q: 'A plant with parallel leaf venation and fibrous roots is expected to have seeds with:',
            opts: [
              'One cotyledon (Monocot)',
              'Two cotyledons (Dicot)',
              'No cotyledons'
            ],
            correct: 0
          }
        ]
      }
    ]
  },
  'grouping_animals_concept': {
    title: '2.2.2 How to Group Animals?',
    slides: [
      {
        title: 'Animal Locomotion Modes',
        content: 'Unlike plants, animals move from place to place (locomotion). They use different body parts depending on their anatomy:',
        bullets: [
          '🐜 Ants / Goats / Cows: Legs to walk, run, or climb.',
          '🦅 Birds / Houseflies: Wings to fly through the air.',
          '🐟 Fishes: Fins and streamlined tails to swim in water.'
        ]
      },
      {
        title: 'Locomotion Reference',
        content: 'Review Activity 2.9 (Table 2.5) details of animal movements and organs used:',
        bullets: [
          '🐜 Ant: Crawls using legs.',
          '🐐 Goat: Walks, runs, and leaps using muscular legs.',
          '🐦 Pigeon: Walks on legs and flies using wings.',
          '🐟 Fish: Swims in water using fins.'
        ]
      },
      {
        title: 'Concept Checkpoint',
        isQuiz: true,
        questions: [
          {
            q: 'Which body part is primarily adapted for swimming in aquatic animals like fish?',
            opts: [
              'Webbed wings',
              'Muscular legs',
              'Fins and streamlined tail'
            ],
            correct: 2
          },
          {
            q: 'Pigeons can move by:',
            opts: [
              'Only flying in the air',
              'Both walking on legs and flying with wings',
              'Swimming and hopping'
            ],
            correct: 1
          }
        ]
      }
    ]
  },
  'adaptations_concept': {
    title: '2.3 Plants & Animals in Different Surroundings',
    slides: [
      {
        title: 'What is Adaptation?',
        content: 'An adaptation is a physical or behavioral feature that helps an organism survive and reproduce in its specific habitat:',
        bullets: [
          '🌵 Cactus: Fleshy water-storing stems, leaves modified into spines to prevent water loss in hot deserts.',
          '🌲 Deodar: Conical shape with sloping branches to let heavy mountain snow slide off easily.'
        ]
      },
      {
        title: 'Camel Adaptations: Hot vs Cold Deserts',
        content: 'Camels live in deserts, but show different features depending on temperature (Activity 2.10):',
        bullets: [
          '🐪 Hot Desert Camel (Rajasthan): 1 hump for fat storage, long legs to keep body away from hot sand, wide padded hooves.',
          '🐫 Cold Desert Camel (Ladakh): 2 humps, shorter sturdy legs for mountain rocks, thick shaggy wool coat to survive sub-zero winters.'
        ]
      },
      {
        title: 'Biodiversity Conservation & Pioneers',
        content: 'Appreciating and conserving biodiversity is vital for our survival. Key NCERT highlights:',
        bullets: [
          '🦅 Salim Ali: India\'s famous ornithologist (Birdman of India) who documented bird habitats and led sanctuaries.',
          '🐅 Conservation projects: "Project Tiger" (1973) and "Cheetah Reintroduction Project" (2022).',
          '🌳 Sacred Groves: Traditionally protected forest patches (like in Western Ghats) guarded by local communities.'
        ]
      },
      {
        title: 'Concept Checkpoint',
        isQuiz: true,
        questions: [
          {
            q: 'How does a cold desert camel (Ladakh) differ from a hot desert camel?',
            opts: [
              'It has only one hump and no hair.',
              'It has two humps and a thick shaggy hair coat.',
              'It has gills to breathe underwater.'
            ],
            correct: 1
          },
          {
            q: 'What is a "Sacred Grove" in NCERT terminology?',
            opts: [
              'A plantation of agricultural crops.',
              'A forest area traditionally protected by local communities.',
              'A desert area where camels gather.'
            ],
            correct: 1
          }
        ]
      }
    ]
  }
};

export default function App() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [activeSubject, setActiveSubject] = useState(() => {
    const params = new URLSearchParams(window.location.hash.replace('#', '?'));
    return params.get('subject') || null;
  });
  const [activeActivity, setActiveActivity] = useState(() => {
    const params = new URLSearchParams(window.location.hash.replace('#', '?'));
    return params.get('activity') || null;
  });
  const [activeSection, setActiveSection] = useState(() => {
    const params = new URLSearchParams(window.location.hash.replace('#', '?'));
    return params.get('section') || null;
  });
  const [activeActivityPhase, setActiveActivityPhase] = useState(1);
  const [sortCorrectCounts, setSortCorrectCounts] = useState({});
  const [selectedSortItem, setSelectedSortItem] = useState(null);
  const [sortStatusMsg, setSortStatusMsg] = useState('');
  const [showSortSuccess, setShowSortSuccess] = useState(false);
  const [activeContentLesson, setActiveContentLesson] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [contentLessonProgress, setContentLessonProgress] = useState({});

  const [activeSectionId, setActiveSectionId] = useState(null);
  const sidebarItemRefs = useRef({});
  const timelineContainerRef = useRef(null);
  const [pointerTop, setPointerTop] = useState(0);
  const [pointerLeft, setPointerLeft] = useState(0);

  useEffect(() => {
    if (activeSubject !== 'class6' || activeActivity !== 'chapter2') return;

    let ticking = false;

    const updatePointer = () => {
      const sectionEls = Array.from(document.querySelectorAll('.timeline-section'));
      if (sectionEls.length === 0) return;

      let bestMatch = sectionEls[0];
      let minDistance = Infinity;
      const targetY = window.innerHeight * 0.35; // 35% down the screen

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const isAtBottom = window.scrollY >= maxScroll - 10;
      const lastEl = sectionEls[sectionEls.length - 1];
      const lastRect = lastEl ? lastEl.getBoundingClientRect() : null;
      const lastVisible = lastRect ? lastRect.top < window.innerHeight : false;

      if (isAtBottom && lastVisible) {
        bestMatch = lastEl;
      } else {
        sectionEls.forEach(el => {
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top - targetY);
          // Also if the element spans across the targetY, it's definitely the active one
          if (rect.top <= targetY && rect.bottom >= targetY) {
             bestMatch = el;
             minDistance = 0;
          } else if (distance < minDistance) {
            minDistance = distance;
            bestMatch = el;
          }
        });
      }

      if (bestMatch && timelineContainerRef.current) {
        setActiveSectionId(bestMatch.id);
        const nodeEl = bestMatch.querySelector('.timeline-node');
        if (nodeEl) {
          const containerRect = timelineContainerRef.current.getBoundingClientRect();
          const nodeRect = nodeEl.getBoundingClientRect();
          
          const nodeCenterY = (nodeRect.top - containerRect.top) + (nodeRect.height / 2);
          const nodeCenterX = (nodeRect.left - containerRect.left) + (nodeRect.width / 2);
          
          setPointerTop(nodeCenterY);
          setPointerLeft(nodeCenterX);
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePointer);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial update
    setTimeout(updatePointer, 100);
    setTimeout(updatePointer, 500); // extra safety after images/fonts might load

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSubject, activeActivity, activeContentLesson]);

  useEffect(() => {
    if (activeSectionId && sidebarItemRefs.current[activeSectionId]) {
      sidebarItemRefs.current[activeSectionId].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeSectionId]);

  useEffect(() => {
    const handleHashChange = () => {
      const params = new URLSearchParams(window.location.hash.replace('#', '?'));
      setActiveSubject(params.get('subject') || null);
      setActiveActivity(params.get('activity') || null);
      setActiveSection(params.get('section') || null);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Objective 2: Focus Mode (Content First Learning)
    // Automatically hide header and sidebars during immersive interactive labs
    const isOverview = !activeActivity || activeActivity.startsWith('chapter') || activeActivity === 'boilerplate';
    if (!isOverview) {
      document.body.classList.add('focus-mode-active');
    } else {
      document.body.classList.remove('focus-mode-active');
    }

    // Inactivity Timer for Focus Mode UI
    let timeout;
    const handleMouseMove = () => {
      // User is active, show the UI (if hovered)
      document.body.classList.remove('ui-inactive');
      clearTimeout(timeout);
      
      // If we are in an activity, start the 2.5s auto-hide countdown
      if (!isOverview) {
        timeout = setTimeout(() => {
          document.body.classList.add('ui-inactive');
        }, 2500);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [activeActivity]);

  useEffect(() => {
    let title = "FuturaX Interactive Labs";
    if (activeActivity) {
      const activityNames = {
        'electric_switch': 'Electric Switch Lab',
        'electric_circuit': 'Electric Circuit Lab',
        'lamp_explorer': 'Lamp Explorer Lab',
        'activity_3_7': 'Electric Components Lab',
        'activity_3_11': 'Conductivity Lab',
        'torch_explorer': 'Torch Explorer Lab',
        'spherical_mirrors': 'Spherical Mirrors Lab',
        'materials_properties': 'Properties of Materials Lab',
        'food_testing': 'Food Testing Lab',
        'fat_testing': 'Fat Testing Lab',
        'protein_testing': 'Protein Testing Lab',
        'magnetic_poles': 'Magnetic Poles Lab',
        'suspended_magnet': 'Suspended Magnet Lab',
        'magnetic_compass': 'Magnetic Compass Lab',
        'magnet_interaction': 'Magnet Interaction Lab',
        'activity_4_6': 'Compass and Bar Magnet Lab',
        'activity_4_7': 'Activity 4.7',
        'linear_motion': 'Linear Motion Lab',
        'circular_motion': 'Circular Motion Lab',
        'material_detective': 'Material Detective Lab',
        '5.1': 'Force Explorer Lab',
        '4.1': 'Magnetic Effect of Current Lab',
        'electromagnet_investigation': 'Electromagnet Investigation Lab',
        'heating_effect': 'Heating Effect Lab',
        'lemon_battery': 'Lemon Battery Lab',
        '9.1': 'Solutions Lab 1',
        '9.2': 'Solutions Lab 2',
        'chapter11': 'Grassroots Democracy Lab',
        'locating_places': 'Locating Places Lab',
        'chapter1': 'Geography Expedition Lab'
      };
      const name = activityNames[activeActivity] || 'Interactive Lab';
      title = `${name} | FuturaX`;
    } else if (activeSubject) {
      const subjectNames = {
        'science_lab': 'Interactive Science Lab',
        'social_lab': 'FuturaX Social Lab',
        'class6': 'Class 6th Science Wing',
        'class7': 'Class 7th Science Wing',
        'class8': 'Class 8th Science Wing',
        'class9': 'Class 9th Science Wing',
        'class6_social': 'Class 6th Social Wing',
        'class7_social': 'Class 7th Social Wing'
      };
      const name = subjectNames[activeSubject] || 'Interactive Lab';
      title = `${name} | FuturaX`;
    }
    document.title = title;
  }, [activeSubject, activeActivity]);

  const navigateTo = (subject, activity, section = null) => {
    const params = new URLSearchParams();
    if (subject) params.set('subject', subject);
    if (activity) params.set('activity', activity);
    if (section) params.set('section', section);
    window.location.hash = params.toString();
  };

  const handleBackToSubjects = () => {
    if (activeSubject === 'science_lab' || activeSubject === 'social_lab' || activeSubject === 'math_lab') {
      navigateTo(null, null);
    } else if (activeSubject && (activeSubject.endsWith('_social') || activeSubject.startsWith('class6_social') || activeSubject.startsWith('class7_social'))) {
      navigateTo('social_lab', null);
    } else if (activeSubject && activeSubject.endsWith('_maths')) {
      navigateTo('math_lab', null);
    } else if (activeSubject && activeSubject.startsWith('class')) {
      navigateTo('science_lab', null);
    } else {
      navigateTo(null, null);
    }
  };

  const handleBackToLabs = () => {
    navigateTo(activeSubject, null);
  };

  // Renders the main subject selector dashboard
  const renderSubjectSelector = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
        <h3 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Compass size={18} style={{ color: 'var(--accent-text)' }} /> Welcome to FuturaX Interactive Learning Labs
        </h3>
        <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Explore curriculum-aligned active-learning simulations, virtual experiments, and conceptual checkouts across different departments.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Science Department Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: '1px solid #3b82f6', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FlaskConical size={32} style={{ color: '#3b82f6' }} />
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-heading)' }}>Science Department</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Physics, Chemistry, and Biology virtual labs spanning from basic concepts to advanced high school experiments.
          </p>
          <button onClick={() => navigateTo('science_lab', null)} className="primary" style={{ width: '100%', gap: '0.5rem', justifyContent: 'center', fontSize: '0.9rem', padding: '0.75rem', background: '#3b82f6', borderColor: '#3b82f6' }}>
            Enter Science Wing <ArrowRight size={16} />
          </button>
        </div>

        {/* Mathematics Department Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: '1px solid #8b5cf6', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Compass size={32} style={{ color: '#8b5cf6' }} />
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-heading)' }}>Mathematics Department</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Interactive geometry, coordinate mapping, algebraic visualizers, and mathematical problem-solving labs.
          </p>
          <button onClick={() => navigateTo('math_lab', null)} className="primary" style={{ width: '100%', gap: '0.5rem', justifyContent: 'center', fontSize: '0.9rem', padding: '0.75rem', background: '#8b5cf6', borderColor: '#8b5cf6' }}>
            Enter Mathematics Wing <ArrowRight size={16} />
          </button>
        </div>

        {/* Social Sciences Department Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: '1px solid #e11d48', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen size={32} style={{ color: '#e11d48' }} />
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-heading)' }}>Social Sciences Department</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore history, civics, and geography through interactive terrains, governance simulations, and more.
          </p>
          <button onClick={() => navigateTo('social_lab', null)} className="primary" style={{ width: '100%', gap: '0.5rem', justifyContent: 'center', fontSize: '0.9rem', padding: '0.75rem', background: '#e11d48', borderColor: '#e11d48' }}>
            Enter Social Sciences Wing <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // Renders Science Lab main dashboard
  const renderScienceLabWings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={handleBackToSubjects}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Interactive Science Lab</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Explore Science Subjects Interactively</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.25rem',
        marginTop: '0.5rem'
      }}>
        {/* Subject Card 1: Class 6th */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px' }}>
            2 CHAPTERS ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={22} style={{ color: 'var(--warning)' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Class 6th Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore introductory science concepts with interactive experiments designed specifically for 6th-grade students.
          </p>

          <button
            onClick={() => navigateTo('class6', null)}
            className="outline"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Explore Class 6th <ArrowRight size={14} />
          </button>
        </div>

        {/* Subject Card 2: Class 7th */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--accent-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px' }}>
            3 CHAPTERS ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <FlaskConical size={22} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Class 7th Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Dive into advanced interactive experiments including electricity, spherical mirrors, and more curriculum-aligned labs.
          </p>

          <button
            onClick={() => navigateTo('class7', null)}
            className="outline"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Enter Class 7th <ArrowRight size={14} />
          </button>
        </div>

        {/* Subject Card 3: Class 8th */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--warning-bg)', color: 'var(--warning)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px' }}>
            1 CHAPTER ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Dna size={22} style={{ color: 'var(--success)' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Class 8th Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore food webs and ecosystems, dissect cell organelles under a virtual microscope, and model human respiratory systems.
          </p>

          <button
            onClick={() => navigateTo('class8', null)}
            className="outline"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Explore Class 8th <ArrowRight size={14} />
          </button>
        </div>

        {/* Subject Card 4: Class 9th */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--warning-bg)', color: 'var(--warning)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px' }}>
            0 CHAPTERS ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={22} style={{ color: '#db2777' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Class 9th Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore high school science fundamentals with complex virtual labs and conceptual checkouts.
          </p>

          <button
            onClick={() => navigateTo('class9', null)}
            className="outline"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Explore Class 9th <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  // Renders Math Lab main dashboard
  const renderMathLabWings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={handleBackToSubjects}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Mathematics Department</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Explore Mathematics Interactively</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.25rem',
        marginTop: '0.5rem'
      }}>
        {/* Math Card 1: Class 6th */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--accent-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px' }}>
            1 CHAPTER ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={22} style={{ color: '#8b5cf6' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Class 6th Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore geometry and numbers through visual, interactive coordinate systems and measuring tools.
          </p>

          <button
            onClick={() => navigateTo('class6_maths', null)}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Enter Class 6th <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  // Renders Social Lab main dashboard
  const renderSocialLabWings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={handleBackToSubjects}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>FuturaX Social Lab</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Explore Social Sciences Interactively</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.25rem',
        marginTop: '0.5rem'
      }}>
        {/* Social Card 1: Class 6th */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px' }}>
            1 CHAPTER ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={22} style={{ color: 'var(--warning)' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Class 6th Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore foundational social science concepts, government structures, and civic duties through interactive experiences designed for 6th-grade students.
          </p>

          <button
            onClick={() => navigateTo('class6_social', null)}
            className="outline"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Explore Class 6th <ArrowRight size={14} />
          </button>
        </div>

        {/* Social Card 2: Class 7th */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--accent-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px' }}>
            1 CHAPTER ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <FlaskConical size={22} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Class 7th Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Dive into advanced interactive social studies including history, geography, and political structures.
          </p>

          <button
            onClick={() => navigateTo('class7_social', null)}
            className="outline"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Enter Class 7th <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );

  const CLASS_6_SOCIAL_CHAPTERS = [
    { num: 1, title: "Locating Places on the Earth" },
    { num: 2, title: "Diversity and Discrimination" },
    { num: 3, title: "What is Government?" },
    { num: 4, title: "Key Elements of a Democratic Government" },
    { num: 5, title: "Panchayati Raj" },
    { num: 6, title: "Rural Administration" },
    { num: 7, title: "Urban Administration" },
    { num: 8, title: "Rural Livelihoods" },
    { num: 9, title: "Urban Livelihoods" },
    { num: 10, title: "Exploring History" },
    { num: 11, title: "Grassroots Democracy" }
  ];

  const renderClass6SocialWing = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Subheader Wing Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <button
            onClick={() => navigateTo('social_lab', null)}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} /> Back to Social Lab
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Class 6th Wing (Social)</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Demonstrations & Labs for Class 6 Social Science</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {CLASS_6_SOCIAL_CHAPTERS.map(chapter => {
            if (chapter.num === 1) {
              return (
                <div
                  key={chapter.num}
                  className="glass-panel"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '1.5rem',
                    border: '1px solid var(--accent-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Chapter
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <BookOpen size={20} style={{ color: 'var(--accent-text)', marginTop: '0.25rem' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-text)', fontWeight: '500' }}>{chapter.title}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                    Introduce maps by experiencing what it's like to navigate without one. Learn how maps help locate places.
                  </p>

                  <button 
                    onClick={() => navigateTo('class6_social', 'locating_places')}
                    className="primary" 
                    style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                  >
                    Open Chapter <ArrowRight size={14} />
                  </button>
                </div>
              );
            }

            if (chapter.num === 11) {
              return (
                <div
                  key={chapter.num}
                  className="glass-panel"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '1.5rem',
                    border: '1px solid var(--accent-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Chapter
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <BookOpen size={20} style={{ color: 'var(--accent-text)', marginTop: '0.25rem' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-text)', fontWeight: '500' }}>{chapter.title}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                    Dive into Grassroots Democracy. Explore the Panchayati Raj system, local administration, and civic participation interactively.
                  </p>

                  <button 
                    onClick={() => navigateTo('class6_social', `chapter${chapter.num}`)}
                    className="primary" 
                    style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                  >
                    Open Chapter <ArrowRight size={14} />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={chapter.num}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  padding: '1.5rem',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--warning-bg)', color: 'var(--warning)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Coming Soon
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <BookOpen size={20} style={{ color: '#818cf8', marginTop: '0.25rem' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{chapter.title}</p>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                  Interactive social science concepts and virtual scenarios for this chapter.
                </p>

                <button
                  disabled
                  className="outline"
                  style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem', opacity: 0.5, cursor: 'not-allowed' }}
                >
                  Module Locked
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const CLASS_7_SOCIAL_CHAPTERS = [
    { num: 1, title: "Geography of India" },
    { num: 2, title: "Inside Our Earth" },
    { num: 3, title: "Our Changing Earth" },
    { num: 4, title: "Air" },
    { num: 5, title: "Water" },
    { num: 6, title: "Natural Vegetation and Wildlife" },
    { num: 7, title: "Human Environment - Settlement, Transport and Communication" },
    { num: 8, title: "Human Environment Interactions" },
    { num: 9, title: "Life in the Temperate Grasslands" },
    { num: 10, title: "Life in the Deserts" },
    { num: 11, title: "Tracing Changes Through a Thousand Years" },
    { num: 12, title: "New Kings and Kingdoms" }
  ];

  const renderClass7SocialWing = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Subheader Wing Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <button
            onClick={() => navigateTo('social_lab', null)}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} /> Back to Social Lab
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Class 7th Wing (Social)</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Demonstrations & Labs for Class 7 Social Science</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {CLASS_7_SOCIAL_CHAPTERS.map(chapter => {
            if (chapter.num === 1) {
              return (
                <div
                  key={chapter.num}
                  className="glass-panel"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '1.5rem',
                    border: '1px solid var(--accent-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Chapter
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <BookOpen size={20} style={{ color: 'var(--accent-text)', marginTop: '0.25rem' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-text)', fontWeight: '500' }}>{chapter.title}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                    Explore the geography of India through an immersive expedition across its diverse landscapes and regions.
                  </p>

                  <button 
                    onClick={() => navigateTo('class7_social', `chapter${chapter.num}`)}
                    className="primary" 
                    style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                  >
                    Open Chapter <ArrowRight size={14} />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={chapter.num}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  padding: '1.5rem',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--warning-bg)', color: 'var(--warning)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Coming Soon
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <BookOpen size={20} style={{ color: '#818cf8', marginTop: '0.25rem' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{chapter.title}</p>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                  Interactive social science concepts and virtual scenarios for this chapter.
                </p>

                <button
                  disabled
                  className="outline"
                  style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem', opacity: 0.5, cursor: 'not-allowed' }}
                >
                  Module Locked
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const CLASS_6_CHAPTERS = [
    { num: 1, title: "The Wonderful World of Science" },
    { num: 2, title: "Diversity in the Living World" },
    { num: 3, title: "Mindful Eating: A Path to a Healthy Body" },
    { num: 4, title: "Exploring Magnets" },
    { num: 5, title: "Measurement of Length and Motion" },
    { num: 6, title: "Materials Around Us" },
    { num: 7, title: "Temperature and its Measurement" },
    { num: 8, title: "A Journey through States of Water" },
    { num: 9, title: "Methods of Separation in Everyday Life" },
    { num: 10, title: "Living Creatures: Exploring their Characteristics" },
    { num: 11, title: "Nature's Treasures" },
    { num: 12, title: "Beyond Earth" }
  ];

  // Renders Class 6th Activities List
  const renderClass6Wing = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Subheader Wing Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <button
            onClick={handleBackToSubjects}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Class 6th Wing</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Demonstrations & Labs for Class 6</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {CLASS_6_CHAPTERS.map(chapter => {
            if (chapter.num === 2 || chapter.num === 3 || chapter.num === 4 || chapter.num === 5 || chapter.num === 6) {
              return (
                <div
                  key={chapter.num}
                  className="glass-panel"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '1.5rem',
                    border: '1px solid var(--accent-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Chapter
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <BookOpen size={20} style={{ color: 'var(--accent-text)', marginTop: '0.25rem' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-text)', fontWeight: '500' }}>{chapter.title}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                    {chapter.num === 2
                      ? "Virtual Biodiversity Explorer, Plant Detective, and Animal Habitat Explorer."
                      : chapter.num === 3 
                        ? "Includes Activity 3.5: Testing for Starch." 
                        : chapter.num === 4 
                          ? "Includes Activity 4.1: Appearance, hardness, and effect of hammering on different materials."
                          : chapter.num === 5
                            ? "Includes Activity 5.3: Linear Motion and observation of moving objects."
                            : "Includes Activities 6.1, 6.2, and 6.3: Material Detective case study."}
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                    <button 
                      onClick={() => {
                        if (chapter.num === 6) navigateTo('class6', 'materials_around_us');
                        else if (chapter.num === 4) navigateTo('class6', 'chapter4_flow');
                        else navigateTo('class6', `chapter${chapter.num}`);
                      }}
                      className="outline" 
                      style={{ flex: 1, gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                    >
                      <BookOpen size={14} /> Open Chapter
                    </button>
                    <button 
                      onClick={() => navigateTo('class6', `chapter${chapter.num}`)}
                      className="primary" 
                      style={{ flex: 1, gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                    >
                      Activity Page <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={chapter.num}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  padding: '1.5rem',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--warning-bg)', color: 'var(--warning)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Coming Soon
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <BookOpen size={20} style={{ color: '#818cf8', marginTop: '0.25rem' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{chapter.title}</p>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                  Interactive science concepts, virtual experiments, and quizzes for this chapter.
                </p>

                <button
                  disabled
                  className="outline"
                  style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem', opacity: 0.5, cursor: 'not-allowed' }}
                >
                  Module Locked
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const CLASS_6_MATHS_CHAPTERS = [
    { num: 1, title: "Knowing our Numbers" },
    { num: 2, title: "Whole Numbers" },
    { num: 3, title: "Playing with Numbers" },
    { num: 4, title: "Basic Geometrical Ideas" },
    { num: 5, title: "Understanding Elementary Shapes" },
    { num: 6, title: "Integers" },
    { num: 7, title: "Fractions" },
    { num: 8, title: "Decimals" },
    { num: 9, title: "Data Handling" },
    { num: 10, title: "Mensuration" },
    { num: 11, title: "Algebra" },
    { num: 12, title: "Ratio and Proportion" },
    { num: 13, title: "Symmetry" },
    { num: 14, title: "Practical Geometry" }
  ];

  // Renders Class 6th Maths wing
  const renderClass6MathsWing = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <button
            onClick={handleBackToSubjects}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} /> Back to Subjects
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Class 6th Mathematics Wing</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Geometry & Arithmetic Labs for Class 6</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {CLASS_6_MATHS_CHAPTERS.map(chapter => {
            if (chapter.num === 4) {
              return (
                <div
                  key={chapter.num}
                  className="glass-panel"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '1.5rem',
                    border: '1px solid var(--accent-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Chapter
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <BookOpen size={20} style={{ color: 'var(--accent-text)', marginTop: '0.25rem' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-text)', fontWeight: '500' }}>{chapter.title}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                    Includes Activity 2.2: Defining Line Segment. Learn the difference between segments, rays, and lines with threads and dividers.
                  </p>

                  <button
                    onClick={() => navigateTo('class6_maths', 'chapter4')}
                    className="primary"
                    style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                  >
                     Open Chapter <ArrowRight size={14} />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={chapter.num}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  padding: '1.5rem',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--warning-bg)', color: 'var(--warning)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Coming Soon
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <BookOpen size={20} style={{ color: '#818cf8', marginTop: '0.25rem' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{chapter.title}</p>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                  Interactive mathematical concept simulations and exercises for this chapter.
                </p>

                <button
                  disabled
                  className="outline"
                  style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem', opacity: 0.5, cursor: 'not-allowed' }}
                >
                  Module Locked
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderClass6MathsChapter4 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class6_maths', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Mathematics Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 4 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Activity 2.2 Card */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Hammer size={20} style={{ color: '#8b5cf6' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 2.2</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Line Segment Explorer. Connect endpoints with various threads and drag them to discover that the straight line segment is the shortest distance.
          </p>

          <button
            onClick={() => navigateTo('class6_maths', 'line_segment_lab')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 2.3 Card */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Hammer size={20} style={{ color: '#10b981' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 2.3</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Intersection City & Parallel Rails. Drag nodes to build crossings and parallel train lines, and observe points of intersection vs. constant distance.
          </p>

          <button
            onClick={() => navigateTo('class6_maths', 'parallel_intersecting_lab')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 2.4 Card */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Hammer size={20} style={{ color: '#ec4899' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 2.4</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Robo-Pen Curve Escape. Draw curves and drag items to categorize Interior, Boundary, and Exterior regions.
          </p>

          <button
            onClick={() => navigateTo('class6_maths', 'curves_regions_lab')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 2.5 Card */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={20} style={{ color: '#a78bfa' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 2.5</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Solar Alignment Hinge. Drag tracking panels to align beams, identify Vertex/Arms, and measure solar path angles.
          </p>

          <button
            onClick={() => navigateTo('class6_maths', 'angles_lab')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 2.6 Card */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Hammer size={20} style={{ color: '#60a5fa' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 2.6</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Geo-Truss Bridge Builder. Build structures using polygon sides, vertices, and diagonals. Run stress tests to confirm rigidity.
          </p>

          <button
            onClick={() => navigateTo('class6_maths', 'polygons_lab')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 2.7 Card */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={20} style={{ color: '#facc15' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 2.7</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Radar Scope Observatory. Sweeps radius and diameter circles. Map out target arcs, chords, sectors, and segments.
          </p>

          <button
            onClick={() => navigateTo('class6_maths', 'circles_lab')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClass6Chapter2 = () => {
    const sections = [
      { id: 'sec-2-1',       title: 'Introduction', type: 'content',  lessonId: 'biodiversity_concept' },
      { id: 'sec-2-1-act',   title: 'Activity 2.1: Nature Walk — Observe & Record', type: 'activity', activityId: 'virtual_biodiversity' },
      { id: 'sec-2-2-act',   title: 'Activity 2.2: Let Us Appreciate — Memory Board', type: 'activity', activityId: 'appreciating_biodiversity' },
      { id: 'sec-2-2',       title: '2.2 How to Group Plants & Animals?', type: 'content',  lessonId: 'grouping_basics_concept' },
      { id: 'sec-2-3-act',   title: 'Activity 2.3: Let Us Group (Card Sorting)', type: 'activity', activityId: 'inline_sorting' },
      { id: 'sec-2-2-1-a',   title: '2.2.1-A Plant Classification: Herbs, Shrubs & Trees', type: 'content',  lessonId: 'plant_variety_concept' },
      { id: 'sec-2-4-act',   title: 'Activity 2.4: Stems & Heights — Classify Plants', type: 'activity', activityId: 'plant_detective_stem' },
      { id: 'sec-2-2-1-b',   title: '2.2.1-B Leaf Venation & Root Systems', type: 'content',  lessonId: 'venation_roots_concept' },
      { id: 'sec-2-5-act',   title: 'Activity 2.5: Leaf Venation Lightbox Lab', type: 'activity', activityId: 'leaf_venation_lab' },
      { id: 'sec-2-6-act',   title: 'Activity 2.6: Root Excavation Station', type: 'activity', activityId: 'root_systems_lab' },
      { id: 'sec-2-7-act',   title: 'Activity 2.7: Venation ↔ Root Correlation (Table 2.4)', type: 'activity', activityId: 'venation_root_correlation' },
      { id: 'sec-2-2-1-c',   title: '2.2.1-C Seeds & Cotyledons (Monocot / Dicot)', type: 'content',  lessonId: 'cotyledons_concept' },
      { id: 'sec-2-8-act',   title: 'Activity 2.8: Seed Dissection — Chickpea vs Maize', type: 'activity', activityId: 'seed_dissection_lab' },
      { id: 'sec-2-2-2',     title: '2.2.2 How to Group Animals?', type: 'content',  lessonId: 'grouping_animals_concept' },
      { id: 'sec-2-9-act',   title: 'Activity 2.9: Observe Animal Locomotion & Body Parts', type: 'activity', activityId: 'animal_locomotion' },
      { id: 'sec-2-3',       title: '2.3 Plants & Animals in Different Surroundings', type: 'content',  lessonId: 'adaptations_concept' },
      { id: 'sec-2-10-act',  title: 'Activity 2.10: Match Animals to Habitats & Adaptations', type: 'activity', activityId: 'animal_habitat_matching' }
    ];    /* contentLessonsData moved to module scope */

    const sortItems = [
      { id: 'rose', name: '🌹 Rose Plant', type: 'shrub', desc: 'Medium height, woody stem branching near base.' },
      { id: 'grass', name: '🌱 Grass', type: 'herb', desc: 'Short, soft green stem with no woodiness.' },
      { id: 'banyan', name: '🌳 Banyan Tree', type: 'tree', desc: 'Very tall, thick hard brown trunk.' },
      { id: 'tomato', name: '🍅 Tomato Plant', type: 'herb', desc: 'Short, green tender stem.' },
      { id: 'hibiscus', name: '🌺 Hibiscus', type: 'shrub', desc: 'Medium height, woody branches branching near ground.' },
      { id: 'mango', name: '🥭 Mango Tree', type: 'tree', desc: 'Tall, thick woody trunk branching high up.' }
    ];

    const handleSortItemClick = (item) => {
      if (sortCorrectCounts[item.id]) return; // already categorized
      setSelectedSortItem(item);
      setSortStatusMsg('');
    };

    const handleSortBinClick = (binType) => {
      if (!selectedSortItem) return;
      if (selectedSortItem.type === binType) {
        setSortCorrectCounts(prev => {
          const next = { ...prev, [selectedSortItem.id]: binType };
          const allCorrect = Object.keys(next).length === 6;
          if (allCorrect) {
            setShowSortSuccess(true);
          }
          return next;
        });
        setSelectedSortItem(null);
        setSortStatusMsg(`Correct! ${selectedSortItem.name} is categorized under ${binType.toUpperCase()}S.`);
      } else {
        setSortStatusMsg(`Incorrect. Think about the stem and size of ${selectedSortItem.name}!`);
      }
    };

    const handleResetSortGame = () => {
      setSortCorrectCounts({});
      setSelectedSortItem(null);
      setSortStatusMsg('');
      setShowSortSuccess(false);
    };

    const handleReadAloud = (text) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      } else {
        alert('Text to speech is not supported in this browser.');
      }
    };

    const handleStopSpeech = () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };

    const renderFullscreenLessonView = () => {
      const lesson = contentLessonsData[activeContentLesson];
      const slide = lesson.slides[activeSlide];
      const totalSlides = lesson.slides.length;
      const isLastSlide = activeSlide === totalSlides - 1;

      return (
        <div style={{
          width: '100%',
          minHeight: 'calc(100vh - 3rem)',
          background: 'var(--page-bg)',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '1.5rem',
          boxSizing: 'border-box'
        }}>
          {/* Unified exit control header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '900px',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  handleStopSpeech();
                  setActiveContentLesson(null);
                }}
                className="outline"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-primary)'
                }}
              >
                <X size={16} /> Exit Lesson
              </button>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>
                  {lesson.title}
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Textbook Concept Review</span>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '900px',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            background: 'var(--card-bg)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--accent-text)', fontWeight: 'bold' }}>
                  {slide.title}
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleReadAloud(`${slide.title}. ${slide.content || ''}. ${slide.bullets ? slide.bullets.join('. ') : ''}`)}
                    className="outline"
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', borderRadius: '8px' }}
                  >
                    🔊 Read Aloud
                  </button>
                  <button
                    onClick={handleStopSpeech}
                    className="outline"
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', borderRadius: '8px' }}
                  >
                    Stop
                  </button>
                </div>
              </div>

              {!slide.isQuiz ? (
                <div style={{ display: 'grid', gridTemplateColumns: slide.svg ? '1fr 280px' : '1fr', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <p style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.75' }}>
                      {slide.content}
                    </p>
                    {slide.bullets && (
                      <ul style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {slide.bullets.map((b, i) => (
                          <li key={i} style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {slide.svg && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                      {slide.svg === 'venation' && (
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                          <div style={{ textAlign: 'center' }}>
                            <svg width="100" height="100" viewBox="0 0 100 100">
                              <path d="M50,10 C80,30 80,70 50,90 C20,70 20,30 50,10 Z" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="2"/>
                              <line x1="50" y1="10" x2="50" y2="90" stroke="#047857" strokeWidth="2.5"/>
                            </svg>
                            <span style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-heading)', fontWeight: 'bold', marginTop: '0.35rem' }}>Reticulate</span>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <svg width="100" height="100" viewBox="0 0 100 100">
                              <path d="M50,10 C65,30 65,80 50,95 C35,80 35,30 50,10 Z" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="2"/>
                              <line x1="50" y1="10" x2="50" y2="95" stroke="#047857" strokeWidth="2"/>
                            </svg>
                            <span style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-heading)', fontWeight: 'bold', marginTop: '0.35rem' }}>Parallel</span>
                          </div>
                        </div>
                      )}
                      {slide.svg === 'roots' && (
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                          <div style={{ textAlign: 'center' }}>
                            <svg width="100" height="100" viewBox="0 0 100 100">
                              <line x1="10" y1="20" x2="90" y2="20" stroke="var(--border)" strokeWidth="2"/>
                              <path d="M50,20 C53,40 52,70 50,90 C48,70 47,40 50,20 Z" fill="#d97706" stroke="#b45309" strokeWidth="2"/>
                            </svg>
                            <span style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-heading)', fontWeight: 'bold', marginTop: '0.35rem' }}>Taproot</span>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <svg width="100" height="100" viewBox="0 0 100 100">
                              <line x1="10" y1="20" x2="90" y2="20" stroke="var(--border)" strokeWidth="2"/>
                              <path d="M50,20 Q60,40 55,85 M50,20 Q40,40 45,85" stroke="#b45309" strokeWidth="1.5" fill="none"/>
                            </svg>
                            <span style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-heading)', fontWeight: 'bold', marginTop: '0.35rem' }}>Fibrous Root</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {slide.questions.map((qObj, qIdx) => {
                    const selectedOpt = quizAnswers[qIdx];
                    const isCorrect = selectedOpt === qObj.correct;
                    return (
                      <div key={qIdx} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                        <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold', fontSize: '1.15rem', color: 'var(--text-heading)' }}>
                          Q{qIdx + 1}: {qObj.q}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {qObj.opts.map((opt, oIdx) => {
                            const isCurrentSelected = selectedOpt === oIdx;
                            return (
                              <button
                                key={oIdx}
                                disabled={quizChecked}
                                onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                                style={{
                                  textAlign: 'left',
                                  padding: '0.85rem 1.35rem',
                                  borderRadius: '8px',
                                  border: isCurrentSelected 
                                    ? '2px solid var(--accent)' 
                                    : '1px solid var(--border)',
                                  background: isCurrentSelected 
                                    ? 'rgba(99, 102, 241, 0.08)' 
                                    : 'var(--page-bg)',
                                  color: 'var(--text-primary)',
                                  fontSize: '1.05rem',
                                  cursor: quizChecked ? 'default' : 'pointer',
                                  width: '100%',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {quizChecked && (
                          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: isCorrect ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', fontSize: '1rem' }}>
                            {isCorrect ? '✅ Correct!' : `❌ Incorrect (Correct: ${qObj.opts[qObj.correct]})`}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                Slide {activeSlide + 1} of {totalSlides}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {activeSlide > 0 && (
                  <button
                    onClick={() => { handleStopSpeech(); setActiveSlide(prev => prev - 1); }}
                    className="outline"
                    style={{ fontSize: '0.9rem', padding: '0.45rem 1.15rem', borderRadius: '8px' }}
                  >
                    Previous
                  </button>
                )}
                {isLastSlide ? (
                  <button
                    disabled={slide.isQuiz && !quizChecked}
                    onClick={() => {
                      setContentLessonProgress(prev => ({ ...prev, [activeContentLesson]: true }));
                      setActiveContentLesson(null);
                    }}
                    className="primary"
                    style={{ fontSize: '0.9rem', padding: '0.5rem 1.35rem', borderRadius: '8px' }}
                  >
                    Finish Lesson
                  </button>
                ) : (
                  <button
                    onClick={() => { handleStopSpeech(); setActiveSlide(prev => prev + 1); }}
                    className="primary"
                    style={{ fontSize: '0.9rem', padding: '0.5rem 1.35rem', borderRadius: '8px' }}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };

    if (activeContentLesson) {
      if (activeContentLesson === 'biodiversity_concept') {
        return (
          <IntroductionMindMap 
            onBackToDashboard={(completed) => {
              handleStopSpeech();
              if (completed) {
                setContentLessonProgress(prev => ({ ...prev, biodiversity_concept: true }));
              }
              setActiveContentLesson(null);
            }} 
          />
        );
      }
      if (activeContentLesson === 'grouping_basics_concept') {
        return (
          <GroupingBasicsBookSpread 
            onBackToDashboard={(completed) => {
              handleStopSpeech();
              if (completed) {
                setContentLessonProgress(prev => ({ ...prev, grouping_basics_concept: true }));
              }
              setActiveContentLesson(null);
            }}
          />
        );
      }
      return renderFullscreenLessonView();
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .timeline-thread {
            position: absolute;
            left: 20px;
            top: 24px;
            bottom: -24px;
            width: 3px;
            background: linear-gradient(180deg, var(--accent) 0%, var(--border) 100%);
            z-index: 1;
          }
          .timeline-node {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: var(--accent);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            font-size: 0.7rem;
            font-weight: bold;
            border: 3px solid var(--page-bg);
            box-shadow: 0 0 0 2px var(--accent);
          }
        `}</style>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <button
            onClick={() => navigateTo('class6', null)}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} /> Back to Class 6 Wing
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 2: Diversity in the Living World</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NCERT curriculum explorer</span>
          </div>
        </div>

        {/* Dr. Raghu's Field Binder / Scrapbook (Replaces Book) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '100%', // fully expanded to utilize entire screen width
          alignSelf: 'center',
          background: 'radial-gradient(circle at center, #523525 0%, #29180f 100%)', // heavy wooden board
          padding: '38px 30px 30px 30px',
          borderRadius: '20px',
          border: '5px solid #3c2215', // beveled edge trim
          boxShadow: '0 25px 65px rgba(0,0,0,0.65), inset 0 0 35px rgba(0,0,0,0.9)',
          position: 'relative',
          marginBottom: '2.5rem',
          overflow: 'visible'
        }}>
          {/* Top-Left Vintage Brass Corner Bracket */}
          <div style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
            borderRadius: '20px 0 0 0',
            borderTop: '2.5px solid #fbbf24',
            borderLeft: '2.5px solid #fbbf24',
            zIndex: 10,
            boxShadow: '1px 1px 4px rgba(0,0,0,0.4)'
          }} />

          {/* Top-Right Vintage Brass Corner Bracket */}
          <div style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '40px',
            height: '40px',
            background: 'linear-gradient(225deg, #b45309 0%, #78350f 100%)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
            borderRadius: '0 20px 0 0',
            borderTop: '2.5px solid #fbbf24',
            borderRight: '2.5px solid #fbbf24',
            zIndex: 10,
            boxShadow: '-1px 1px 4px rgba(0,0,0,0.4)'
          }} />

          {/* Bottom-Left Vintage Brass Corner Bracket */}
          <div style={{
            position: 'absolute',
            bottom: '-2px',
            left: '-2px',
            width: '40px',
            height: '40px',
            background: 'linear-gradient(45deg, #b45309 0%, #78350f 100%)',
            clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
            borderRadius: '0 0 0 20px',
            borderBottom: '2.5px solid #fbbf24',
            borderLeft: '2.5px solid #fbbf24',
            zIndex: 10,
            boxShadow: '1px -1px 4px rgba(0,0,0,0.4)'
          }} />

          {/* Bottom-Right Vintage Brass Corner Bracket */}
          <div style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
            clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
            borderRadius: '0 0 20px 0',
            borderBottom: '2.5px solid #fbbf24',
            borderRight: '2.5px solid #fbbf24',
            zIndex: 10,
            boxShadow: '-1px -1px 4px rgba(0,0,0,0.4)'
          }} />

          {/* Metal Clipboard Binder Clip at the top center */}
          <div style={{
            position: 'absolute',
            top: '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '190px',
            height: '34px',
            background: 'linear-gradient(to bottom, #e5e7eb, #9ca3af, #4b5563)',
            border: '1.5px solid #374151',
            borderRadius: '6px',
            boxShadow: '0 5px 12px rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15
          }}>
            {/* Inner clip spring bar */}
            <div style={{
              width: '60px',
              height: '6px',
              background: '#374151',
              borderRadius: '3px',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)'
            }} />
            <div style={{
              position: 'absolute',
              left: '24px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#4b5563',
              border: '1px solid #1f2937'
            }} />
            <div style={{
              position: 'absolute',
              right: '24px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#4b5563',
              border: '1px solid #1f2937'
            }} />
          </div>

          {/* Two paper sheets laid out side-by-side with organic rotations */}
          <div style={{
            display: 'flex',
            gap: '1.75rem',
            width: '100%',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 2
          }}>
            
            {/* Left Sheet: Sanskrit Slogan Image Mount */}
            <div style={{
              flex: 1.1, // slightly wider to fit slogan image beautifully
              background: '#faf8f4', // warm recycled paper tone
              backgroundImage: 'linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px)', // scientific grid lines
              backgroundSize: '20px 20px',
              padding: '2.25rem 2rem',
              borderRadius: '4px',
              boxShadow: '3px 12px 28px rgba(0,0,0,0.35)',
              transform: 'rotate(-1.2deg) translateY(2px)', // organic tilt
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0,0,0,0.06)',
              minHeight: '380px'
            }}>
              {/* Translucent washi tape at top-left corner */}
              <div style={{
                position: 'absolute',
                top: '-14px',
                left: '-12px',
                width: '75px',
                height: '24px',
                background: 'rgba(217, 119, 6, 0.22)', // semi-transparent golden tape
                backdropFilter: 'blur(0.5px)',
                transform: 'rotate(-28deg)',
                borderLeft: '1px dashed rgba(255,255,255,0.4)',
                borderRight: '1px dashed rgba(255,255,255,0.4)',
                boxShadow: '1px 2px 4px rgba(0,0,0,0.05)',
                zIndex: 10
              }} />

              {/* Punched spiral notebook holes at inner right edge */}
              <div style={{
                position: 'absolute',
                top: '16px',
                bottom: '16px',
                right: '8px',
                width: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: 0.16,
                pointerEvents: 'none'
              }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3f2c20', border: '1px solid rgba(0,0,0,0.3)' }} />
                ))}
              </div>

              {/* Image Mount with vintage photo corners to show maximum slogan */}
              <div style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0.4rem',
                boxSizing: 'border-box'
              }}>
                <img
                  src={sanskritSlogan}
                  alt="Sanskrit Slogan"
                  style={{
                    width: '100%',
                    maxHeight: '480px', // scaled up to match fully expanded board
                    objectFit: 'contain',
                    borderRadius: '4px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                    background: '#fff' // clean contrast backing
                  }}
                />
                
                {/* Photo mounting corners (small retro black/dark-brown corners) */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '18px', height: '18px', background: '#3a2216', clipPath: 'polygon(0 0, 100% 0, 0 100%)', zIndex: 5 }} />
                <div style={{ position: 'absolute', top: 0, right: 0, width: '18px', height: '18px', background: '#3a2216', clipPath: 'polygon(0 0, 100% 0, 100% 100%)', zIndex: 5 }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '18px', height: '18px', background: '#3a2216', clipPath: 'polygon(0 0, 0 100%, 100% 100%)', zIndex: 5 }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '18px', height: '18px', background: '#3a2216', clipPath: 'polygon(100% 0, 0 100%, 100% 100%)', zIndex: 5 }} />
              </div>
            </div>

            {/* Right Sheet: Explanation text */}
            <div style={{
              flex: 1,
              background: '#faf8f4', // matching warm paper tone
              backgroundImage: 'linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px)', // scientific grid lines
              backgroundSize: '20px 20px',
              padding: '2.5rem 2.25rem',
              borderRadius: '4px',
              boxShadow: '5px 12px 28px rgba(0,0,0,0.35)',
              transform: 'rotate(0.8deg) translateY(-2px)', // opposite organic tilt
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              border: '1px solid rgba(0,0,0,0.06)',
              minHeight: '380px'
            }}>
              {/* Translucent washi tape at top-right corner */}
              <div style={{
                position: 'absolute',
                top: '-14px',
                right: '-12px',
                width: '75px',
                height: '24px',
                background: 'rgba(217, 119, 6, 0.22)', // matching tape
                backdropFilter: 'blur(0.5px)',
                transform: 'rotate(32deg)',
                borderLeft: '1px dashed rgba(255,255,255,0.4)',
                borderRight: '1px dashed rgba(255,255,255,0.4)',
                boxShadow: '1px 2px 4px rgba(0,0,0,0.05)',
                zIndex: 10
              }} />

              {/* Punched spiral notebook holes at inner left edge */}
              <div style={{
                position: 'absolute',
                top: '16px',
                bottom: '16px',
                left: '8px',
                width: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: 0.16,
                pointerEvents: 'none'
              }}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3f2c20', border: '1px solid rgba(0,0,0,0.3)' }} />
                ))}
              </div>

              {/* Typewriter catalog tag */}
              <div style={{
                position: 'absolute',
                top: '0.85rem',
                right: '1.25rem',
                fontFamily: 'Courier New, monospace',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: '#8b5a2b',
                opacity: 0.85,
                letterSpacing: '0.08em'
              }}>
                [ 📁 FIELD ENTRY #2.1 ]
              </div>

              {/* Clean botanical heading */}
              <h4 style={{
                margin: '0.5rem 0 1rem 0',
                fontSize: '1.45rem',
                color: '#065f46', // deep evergreen color
                fontFamily: 'Georgia, serif',
                fontWeight: 'bold',
                borderBottom: '2.5px solid rgba(6, 95, 70, 0.15)',
                paddingBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                Why is this saying here?
              </h4>

              {/* High-contrast modern typography narrative - increased font & height for visibility */}
              <p style={{
                margin: 0,
                fontSize: '1.16rem', // increased size
                lineHeight: '1.85', // increased line-height
                color: '#1a202c', // darker font color for high contrast
                fontFamily: 'system-ui, -apple-system, sans-serif',
                textAlign: 'left'
              }}>
                In this chapter, we explore <strong style={{ color: '#065f46' }}>Diversity in the Living World</strong>. Just like the trees in this ancient verse selflessly support all other life by offering shade and food, every living organism is interconnected. Plants, animals, and humans depend on each other, forming a beautiful, cooperative web of life. Understanding and protecting this biological diversity is not just science—it is our duty to the planet.
              </p>
            </div>

          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', width: '100%', alignItems: 'flex-start' }}>
          <VerticalLevelMap 
            sections={sections.map(sec => ({
              ...sec,
              isCompleted: sec.type === 'content' 
                ? !!contentLessonProgress[sec.lessonId]
                : sec.activityId === 'inline_sorting' ? showSortSuccess : false
            }))}
            activeSectionId={activeSectionId}
          />

          <div ref={timelineContainerRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: `${pointerLeft}px`,
              top: `${pointerTop}px`,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.15)',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.4), inset 0 0 10px rgba(99, 102, 241, 0.2)',
              border: '2px solid var(--accent)',
              transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
              zIndex: 10,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              opacity: pointerTop === 0 && pointerLeft === 0 ? 0 : 1
            }} />
            {sections.map((sec, idx) => {
              const isContent = sec.type === 'content';
              return (
                <div key={sec.id} id={sec.id} className="timeline-section" style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
                  {idx < sections.length - 1 && (
                    <svg
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '24px',
                        bottom: '-28px',
                        width: '20px',
                        height: 'calc(100% + 4px)',
                        zIndex: 1,
                        overflow: 'visible'
                      }}
                      viewBox="0 0 20 100"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M 10,0 L 14,50 L 10,100"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="3"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  <div className="timeline-node">{idx + 1}</div>
                  
                  {isContent ? (
                    <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase' }}>
                        NCERT Text Section
                      </span>
                      <h3 style={{ margin: '0.25rem 0 0.75rem 0', fontSize: '1.25rem', color: 'var(--text-heading)' }}>
                        {sec.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
                        {contentLessonsData[sec.lessonId]?.slides[0]?.content || 'Read standard NCERT curriculum concepts in detail.'}
                      </p>
                      <button
                        onClick={() => {
                          setActiveContentLesson(sec.lessonId);
                          setActiveSlide(0);
                          setQuizAnswers({});
                          setQuizChecked(false);
                        }}
                        className="primary"
                        style={{ gap: '0.35rem', fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                      >
                        📖 {contentLessonProgress[sec.lessonId] ? 'Review Concept Lesson' : 'Open Concept Lesson'} {contentLessonProgress[sec.lessonId] && '✓'}
                      </button>
                    </div>
                  ) : (
                    <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', border: '1px solid var(--success-border)', background: 'linear-gradient(to bottom right, var(--card-bg), rgba(16, 185, 129, 0.03))' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--success)', textTransform: 'uppercase' }}>
                        Curriculum Lab Activity
                      </span>
                      <h3 style={{ margin: '0.25rem 0 0.75rem 0', fontSize: '1.25rem', color: 'var(--text-heading)' }}>
                        {sec.title}
                      </h3>
                      
                      {sec.activityId === 'virtual_biodiversity' && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                          Go on a virtual nature walk! Log living things observed in the neighbourhood and school garden — track names, habitats, and interesting features in Tables 2.1 & 2.2.
                        </p>
                      )}
                      {sec.activityId === 'appreciating_biodiversity' && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                          Close your eyes for 10 seconds and think of one plant and one animal. Then add your choice to the virtual class memory board and discover the amazing diversity your whole class remembers together!
                        </p>
                      )}
                      {sec.activityId === 'inline_sorting' && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                          Activity 2.3: Help group different plants into Herbs, Shrubs, and Trees based on their heights, stem bendability, and branching patterns in this interactive classification card lab.
                        </p>
                      )}
                      {sec.activityId === 'plant_detective_stem' && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                          Activity 2.4: Observe plant height, stem colour, and bendability. Use these clues to classify plants into Herbs, Shrubs, and Trees — just like a real botanist!
                        </p>
                      )}
                      {sec.activityId === 'leaf_venation_lab' && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                          Activity 2.5: Select a leaf specimen and illuminate it on the virtual lightbox. Watch veins glow under light — identify Reticulate (net-like) vs Parallel venation across 5 different plant leaves.
                        </p>
                      )}
                      {sec.activityId === 'root_systems_lab' && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                          Activity 2.6: Select a potted plant and dig it up layer by layer. Wash the exposed roots and classify them — Taproot System (one thick main root) or Fibrous Root System (many thin equal roots).
                        </p>
                      )}
                      {sec.activityId === 'venation_root_correlation' && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                          Activity 2.7: Fill in Table 2.4 — record both the leaf venation type and root system for 5 plants. Then discover the golden rule: Reticulate ↔ Taproot, Parallel ↔ Fibrous!
                        </p>
                      )}
                      {sec.activityId === 'seed_dissection_lab' && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                          Activity 2.8: Soak chickpea and maize seeds, peel off the seed coat, and compare cotyledon count — 2 cotyledons (Dicot) vs 1 cotyledon (Monocot). The science of seed anatomy revealed!
                        </p>
                      )}
                      {sec.activityId === 'animal_locomotion' && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                          Activity 2.9: Observe how ants, goats, pigeons, houseflies, and fish move. List the body parts each animal uses and fill Table 2.5 to understand locomotion diversity.
                        </p>
                      )}
                      {sec.activityId === 'animal_habitat_matching' && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                          Activity 2.10: Match animals to their habitats — hot desert, cold desert, mountain, forest, and aquatic — and explain the adaptations that help them survive.
                        </p>
                      )}

                      <button
                        onClick={() => {
                          if (sec.activityId === 'virtual_biodiversity') {
                            navigateTo('class6', 'virtual_biodiversity');
                          } else if (sec.activityId === 'appreciating_biodiversity') {
                            navigateTo('class6', 'appreciating_biodiversity');
                          } else if (sec.activityId === 'inline_sorting') {
                            navigateTo('class6', 'inline_sorting');
                          } else if (sec.activityId === 'plant_detective_stem') {
                            navigateTo('class6', 'plant_detective');
                          } else if (sec.activityId === 'leaf_venation_lab') {
                            navigateTo('class6', 'leaf_venation_lab');
                          } else if (sec.activityId === 'root_systems_lab') {
                            navigateTo('class6', 'root_systems_lab');
                          } else if (sec.activityId === 'venation_root_correlation') {
                            navigateTo('class6', 'venation_root_correlation');
                          } else if (sec.activityId === 'seed_dissection_lab') {
                            navigateTo('class6', 'seed_dissection_lab');
                          } else if (sec.activityId === 'animal_locomotion') {
                            setActiveActivityPhase(3);
                            navigateTo('class6', 'animal_habitat');
                          } else if (sec.activityId === 'animal_habitat_matching') {
                            setActiveActivityPhase(1);
                            navigateTo('class6', 'animal_habitat');
                          }
                        }}
                        className="primary"
                        style={{ gap: '0.35rem', background: 'var(--success)', borderColor: 'var(--success)', fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                      >
                        <Play size={12} fill="#ffffff" /> Launch Lab Activity <ArrowRight size={12} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {activeContentLesson && (() => {
          const lesson = contentLessonsData[activeContentLesson];
          const slide = lesson.slides[activeSlide];
          const totalSlides = lesson.slides.length;
          const isLastSlide = activeSlide === totalSlides - 1;

          return (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10000,
                background: 'var(--page-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '850px',
                height: '90%',
                maxHeight: '620px',
                display: 'grid',
                gridTemplateRows: '60px 1fr 60px',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'var(--card-bg)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.05)' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-heading)' }}>
                    {lesson.title}
                  </h4>
                  <button
                    onClick={() => {
                      handleStopSpeech();
                      setActiveContentLesson(null);
                    }}
                    className="outline"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                  >
                    Close Lesson
                  </button>
                </div>

                <div style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--accent-text)' }}>
                      {slide.title}
                    </h2>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleReadAloud(`${slide.title}. ${slide.content || ''}. ${slide.bullets ? slide.bullets.join('. ') : ''}`)}
                        className="outline"
                        style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        🔊 Read Aloud
                      </button>
                      <button
                        onClick={handleStopSpeech}
                        className="outline"
                        style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                      >
                        Stop
                      </button>
                    </div>
                  </div>

                  {!slide.isQuiz ? (
                    <div style={{ display: 'grid', gridTemplateColumns: slide.svg ? '1fr 240px' : '1fr', gap: '2rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                          {slide.content}
                        </p>
                        {slide.bullets && (
                          <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {slide.bullets.map((b, i) => (
                              <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {slide.svg && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                          {slide.svg === 'venation' && (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                              <div style={{ textAlign: 'center' }}>
                                <svg width="90" height="90" viewBox="0 0 100 100">
                                  <path d="M50,10 C80,30 80,70 50,90 C20,70 20,30 50,10 Z" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="2"/>
                                  <line x1="50" y1="10" x2="50" y2="90" stroke="#047857" strokeWidth="2.5"/>
                                </svg>
                                <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-heading)', fontWeight: 'bold', marginTop: '0.25rem' }}>Reticulate</span>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <svg width="90" height="90" viewBox="0 0 100 100">
                                  <path d="M50,10 C65,30 65,80 50,95 C35,80 35,30 50,10 Z" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="2"/>
                                  <line x1="50" y1="10" x2="50" y2="95" stroke="#047857" strokeWidth="2"/>
                                </svg>
                                <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-heading)', fontWeight: 'bold', marginTop: '0.25rem' }}>Parallel</span>
                              </div>
                            </div>
                          )}
                          {slide.svg === 'roots' && (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                              <div style={{ textAlign: 'center' }}>
                                <svg width="90" height="90" viewBox="0 0 100 100">
                                  <line x1="10" y1="20" x2="90" y2="20" stroke="var(--border)" strokeWidth="2"/>
                                  <path d="M50,20 C53,40 52,70 50,90 C48,70 47,40 50,20 Z" fill="#d97706" stroke="#b45309" strokeWidth="2"/>
                                </svg>
                                <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-heading)', fontWeight: 'bold', marginTop: '0.25rem' }}>Taproot</span>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <svg width="90" height="90" viewBox="0 0 100 100">
                                  <line x1="10" y1="20" x2="90" y2="20" stroke="var(--border)" strokeWidth="2"/>
                                  <path d="M50,20 Q60,40 55,85 M50,20 Q40,40 45,85" stroke="#b45309" strokeWidth="1.5" fill="none"/>
                                </svg>
                                <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-heading)', fontWeight: 'bold', marginTop: '0.25rem' }}>Fibrous Root</span>
                              </div>
                            </div>
                          )}
                          {slide.svg === 'correlation' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--accent-bg)', padding: '0.35rem 0.6rem', borderRadius: '6px' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)' }}>🕸️ Reticulate ⇄ 🥕 Taproot</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--success-bg)', padding: '0.35rem 0.6rem', borderRadius: '6px' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--success)' }}>📏 Parallel ⇄ 🌾 Fibrous</span>
                              </div>
                            </div>
                          )}
                          {slide.svg === 'cotyledon' && (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                              <div style={{ textAlign: 'center' }}>
                                <svg width="90" height="90" viewBox="0 0 120 100">
                                  <path d="M60,45 C25,35 25,75 60,75 Z M60,45 C95,35 95,75 60,75 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
                                </svg>
                                <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-heading)', fontWeight: 'bold' }}>Dicot</span>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <svg width="90" height="90" viewBox="0 0 120 100">
                                  <path d="M60,15 C85,15 90,75 60,85 C30,75 35,15 60,15 Z" fill="#fbbf24" fillOpacity="0.2" stroke="#d97706" strokeWidth="1.5"/>
                                </svg>
                                <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-heading)', fontWeight: 'bold' }}>Monocot</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Select the correct answers for each question to complete this concept section.
                      </p>
                      {slide.questions.map((qObj, qIdx) => {
                        const userSel = quizAnswers[qIdx];
                        return (
                          <div key={qIdx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-heading)', display: 'block', marginBottom: '0.5rem' }}>
                              Question {qIdx + 1}: {qObj.q}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {qObj.opts.map((optText, optIdx) => {
                                const isSelected = userSel === optIdx;
                                const isCorrectOpt = optIdx === qObj.correct;
                                let btnBorder = 'var(--border)';
                                let btnBg = 'transparent';
                                if (isSelected) {
                                  btnBorder = quizChecked ? (isCorrectOpt ? 'var(--success)' : 'var(--warning)') : 'var(--accent)';
                                  btnBg = quizChecked ? (isCorrectOpt ? 'var(--success-bg)' : 'var(--warning-bg)') : 'var(--accent-bg)';
                                }
                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => { if (!quizChecked) setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx })); }}
                                    className="outline"
                                    style={{ justifyContent: 'flex-start', textAlign: 'left', fontSize: '0.8rem', padding: '0.5rem 0.75rem', borderColor: btnBorder, background: btnBg }}
                                  >
                                    {optText}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                      {quizChecked ? (
                        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                          {Object.entries(quizAnswers).every(([qI, val]) => val === slide.questions[qI].correct) ? (
                            <button
                              onClick={() => {
                                setContentLessonProgress(prev => ({ ...prev, [activeContentLesson]: true }));
                                setActiveContentLesson(null);
                              }}
                              className="primary"
                              style={{ fontSize: '0.8rem', padding: '0.5rem 1.2rem' }}
                            >
                              Finish Lesson
                            </button>
                          ) : (
                            <button onClick={() => { setQuizChecked(false); setQuizAnswers({}); }} className="outline" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>Retry Quiz</button>
                          )}
                        </div>
                      ) : (
                        <button
                          disabled={Object.keys(quizAnswers).length < slide.questions.length}
                          onClick={() => setQuizChecked(true)}
                          className="primary"
                          style={{ alignSelf: 'center', fontSize: '0.8rem', padding: '0.5rem 1.5rem' }}
                        >
                          Check Answers
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.5rem', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Slide {activeSlide + 1} of {totalSlides}</div>
                  <div style={{ flex: 1, height: '4px', background: 'var(--border)', margin: '0 2rem', borderRadius: '2px' }}>
                    <div style={{ height: '100%', background: 'var(--accent)', width: `${((activeSlide + 1) / totalSlides) * 100}%` }} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button disabled={activeSlide === 0} onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))} className="outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>Prev</button>
                    {!isLastSlide && <button onClick={() => setActiveSlide(prev => Math.min(totalSlides - 1, prev + 1))} className="outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>Next</button>}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {['virtual_biodiversity', 'plant_detective', 'animal_habitat', 'inline_sorting', 'appreciating_biodiversity'].includes(activeActivity) && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'var(--page-bg)', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s' }}>
            {activeActivity === 'virtual_biodiversity' && <VirtualBiodiversityExplorerActivity onBackToDashboard={() => navigateTo('class6', 'chapter2')} />}
            {activeActivity === 'plant_detective' && <PlantDetectiveActivity onBackToDashboard={() => navigateTo('class6', 'chapter2')} />}
            {activeActivity === 'animal_habitat' && <AnimalHabitatExplorerActivity onBackToDashboard={() => navigateTo('class6', 'chapter2')} initialPhase={activeActivityPhase} />}
            {activeActivity === 'inline_sorting' && (
              <InlineSortingActivity 
                onBackToDashboard={(completed) => {
                  if (completed) {
                    setShowSortSuccess(true);
                  }
                  navigateTo('class6', 'chapter2');
                }} 
              />
            )}
            {activeActivity === 'appreciating_biodiversity' && <AppreciatingBiodiversityActivity onBackToDashboard={() => navigateTo('class6', 'chapter2')} />}
          </div>
        )}
      </div>
    );
  };

  const renderClass6Chapter3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class6', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 6 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 3 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <FlaskConical size={20} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 3.5</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Testing for Starch. Learn how to identify starch in food items using dilute iodine solution.
          </p>

          <button
            onClick={() => navigateTo('class6', 'food_testing')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 3.6 Card */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <FlaskConical size={20} style={{ color: '#06b6d4' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 3.6</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Testing for Fats. Learn how to identify fats using the paper press test.
          </p>

          <button
            onClick={() => navigateTo('class6', 'fat_testing')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 3.7 Card */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <FlaskConical size={20} style={{ color: '#06b6d4' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 3.7</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Testing for Proteins. Use the Biuret test to discover which foods contain protein.
          </p>

          <button
            onClick={() => navigateTo('class6', 'protein_testing')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClass6Chapter4 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => navigateTo('class6', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 6 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 4 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>

        {/* Activity 4.2 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} style={{ color: '#f59e0b' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.2</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Magnetic Poles. Investigate where iron filings stick to a magnet and what happens when a magnet is broken.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'magnetic_poles')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 4.3 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={20} style={{ color: '#ef4444' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.3</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            A Freely Suspended Magnet. Spin a magnet and observe which direction it always points when it comes to rest.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'suspended_magnet')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 4.4 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={20} style={{ color: '#ef4444' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.4</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Make a Simple Magnetic Compass. Learn how to magnetize an iron needle and use it to find directions by floating it on water.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'magnetic_compass')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 4.5 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Hammer size={20} style={{ color: '#8b5cf6' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.5</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Interaction Between Two Bar Magnets. Build the setup, predict outcomes, and explore attraction and repulsion in a sandbox.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'magnet_interaction')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
        {/* Activity 4.6 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={20} style={{ color: '#0ea5e9' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.6</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Compass and Bar Magnet. Explore attraction and repulsion, and see how a compass needle reacts to magnetic poles.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'activity_4_6')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 4.7 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={20} style={{ color: '#0ea5e9' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.7</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Compass and Bar Magnet. Explore attraction and repulsion, and see how a compass needle reacts to magnetic poles.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'activity_4_7')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClass6Chapter5 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => navigateTo('class6', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 6 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 5 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={20} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 5.3</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Linear Motion. Predict and observe which objects move in a straight line when pushed or rolled.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'linear_motion')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 5.4 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={20} style={{ color: '#8b5cf6' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 5.4</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Circular Motion. Whirl an object on a thread and observe its circular path compared to a merry-go-round.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'circular_motion')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClass6Chapter6 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => navigateTo('class6', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 6 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 6 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Search size={20} style={{ color: '#ec4899' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Material Detective</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Activities 6.1 - 6.3: Scan objects, classify materials based on properties, and choose suitable elements for product design.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'material_detective')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Case <ArrowRight size={14} />
          </button>
        </div>


      </div>
    </div>
  );

  const renderClass7Chapter3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class7', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 7 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 3 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Activity Card 1: Torch Explorer */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activities 3.1, 3.2 & 3.3</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            NCERT Class 7 Chapter 3 (Activities 3.1, 3.2 & 3.3). Assemble a torch, explore electric cells, and build working batteries.
          </p>

          <button
            onClick={() => navigateTo('class7', 'torch_explorer')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity Card: Lamp Explorer */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} style={{ color: '#10b981' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activities 3.4 & 3.5</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Lamp Explorer. Disassemble an incandescent lamp, observe its filament, and compare it with an LED.
          </p>

          <button
            onClick={() => navigateTo('class7', 'lamp_explorer')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lamp Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity Card 2: Electric Circuit */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} style={{ color: '#3b82f6' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 3.6</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Connecting a cell to a lamp. Predict and test whether different wire arrangements will make a lamp glow.
          </p>

          <button
            onClick={() => navigateTo('class7', 'electric_circuit')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity Card 3: Activity 3.7 */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} style={{ color: '#ec4899' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 3.7</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Test a double-cell battery and learn why an LED is a one-way street for electric current.
          </p>

          <button
            onClick={() => navigateTo('class7', 'activity_3_7')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity Card 2: Electric Switch */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} style={{ color: '#f59e0b' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activities 3.8 & 3.9</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            NCERT Class 7 Chapter 3 (Activities 3.8 & 3.9). Learn how to build a switch, predict electrical flows, and test materials like wood, plastic, or metals.
          </p>

          <button
            onClick={() => navigateTo('class7', 'electric_switch')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Switch Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity Card 4: Activity 3.11 */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} style={{ color: '#eab308' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 3.11</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Conductors and Insulators. Build a tester to identify which materials allow electric current to pass through.
          </p>

          <button
            onClick={() => navigateTo('class7', 'activity_3_11')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClass7Chapter4 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class7', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 7 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 4 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Activity 4.1 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <FlaskConical size={20} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.1</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Properties of Materials. Test the appearance, hardness, and hammering effect on various materials.
          </p>

          <button 
            onClick={() => navigateTo('class7', 'materials_properties')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClass7Chapter11 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class7', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 7 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 11 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Activity Card 2: Spherical Mirrors */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <BookOpen size={20} style={{ color: '#ec4899' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Spherical Mirrors</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            NCERT Class 7 Chapter 11. Explore Image Formation using Concave and Convex Surfaces. Interactive virtual experiments and concept checks.
          </p>

          <button
            onClick={() => navigateTo('class7', 'spherical_mirrors')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Mirrors Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const CLASS_7_CHAPTERS = [
    { num: 1, title: "The Ever-Evolving World of Science" },
    { num: 2, title: "Exploring Substances: Acidic, Basic, and Neutral" },
    { num: 3, title: "Electricity: Circuits and their Components" },
    { num: 4, title: "The World of Metals and Non-metals" },
    { num: 5, title: "Changes Around Us: Physical and Chemical" },
    { num: 6, title: "Adolescence: A Stage of Growth and Change" },
    { num: 7, title: "Heat Transfer in Nature" },
    { num: 8, title: "Measurement of Time and Motion" },
    { num: 9, title: "Life Processes in Animals" },
    { num: 10, title: "Life Processes in Plants" },
    { num: 11, title: "Light: Shadows and Reflections" },
    { num: 12, title: "Earth, Moon, and the Sun" }
  ];

  // Renders Class 7th Activities List
  const renderClass7Wing = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Subheader Wing Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <button
            onClick={handleBackToSubjects}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Class 7th Wing</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Demonstrations & Labs for Class 7</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {CLASS_7_CHAPTERS.map(chapter => {
            if (chapter.num === 3 || chapter.num === 4 || chapter.num === 11) {
              return (
                <div
                  key={chapter.num}
                  className="glass-panel"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '1.5rem',
                    border: '1px solid var(--accent-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Chapter
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <BookOpen size={20} style={{ color: 'var(--accent-text)', marginTop: '0.25rem' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-text)', fontWeight: '500' }}>{chapter.title}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                    {chapter.num === 3
                      ? "Includes Torch Explorer and Electric Switch. Learn about electrical flows, cells, and test materials."
                      : chapter.num === 4
                      ? "Includes Properties of Materials. Test the appearance, hardness, and hammering effect on various materials."
                      : "Includes Spherical Mirrors. Explore Image Formation using Concave and Convex Surfaces."}
                  </p>

                  <button 
                    onClick={() => navigateTo('class7', `chapter${chapter.num}`)}
                    className="primary" 
                    style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                  >
                    Open Chapter <ArrowRight size={14} />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={chapter.num}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  padding: '1.5rem',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--warning-bg)', color: 'var(--warning)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Coming Soon
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <BookOpen size={20} style={{ color: '#818cf8', marginTop: '0.25rem' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{chapter.title}</p>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                  Interactive science concepts, virtual experiments, and quizzes for this chapter.
                </p>

                <button
                  disabled
                  className="outline"
                  style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem', opacity: 0.5, cursor: 'not-allowed' }}
                >
                  Module Locked
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderClass8Chapter4 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class8', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 8 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 4 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Activity 4.1 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <FlaskConical size={20} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.1</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Magnetic Effect of Electric Current (Oersted's experiment). Observe how current affects a compass needle.
          </p>

          <button 
            onClick={() => navigateTo('class8', '4.1')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Electromagnet Investigation Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activities 4.2, 4.3 & 4.4</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Electromagnet Investigation. Explore how a current-carrying coil behaves like a magnet, use an iron core, and test polarity with compasses.
          </p>

          <button 
            onClick={() => navigateTo('class8', 'electromagnet_investigation')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} style={{ color: '#ef4444' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.5</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Heating Effect of Electric Current. Build a circuit with nichrome wire and observe how electrical energy converts into heat.
          </p>

          <button 
            onClick={() => navigateTo('class8', 'heating_effect')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Lemon Battery Lab Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Battery size={20} style={{ color: '#eab308' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.6</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Lemon Battery Lab. Construct a working battery using lemons, copper strips, and iron nails to light an LED.
          </p>

          <button 
            onClick={() => navigateTo('class8', 'lemon_battery')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClass8Chapter5 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class8', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 8 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 5 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Play size={20} style={{ color: '#ef4444' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 5.1</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Force Explorer. Explore the four types of force: Push, Pull, Lift, and Carry in an interactive physics simulation.
          </p>

          <button 
            onClick={() => navigateTo('class8', '5.1')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Force Explorer <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClass8Chapter9 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class8', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 8 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 9 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Activity 9.1 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <FlaskConical size={20} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 9.1</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore the amazing world of solutes, solvents, and solutions.
          </p>

          <button 
            onClick={() => navigateTo('class8', '9.1')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 9.2 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--accent-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Flame size={20} style={{ color: '#db2777' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 9.2</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore how temperature affects the solubility of baking soda.
          </p>

          <button 
            onClick={() => navigateTo('class8', '9.2')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const CLASS_8_CHAPTERS = [
    { num: 1, title: "Crop Production and Management" },
    { num: 2, title: "Microorganisms: Friend and Foe" },
    { num: 3, title: "Synthetic Fibres and Plastics" },
    { num: 4, title: "Materials: Metals and Non-Metals" },
    { num: 5, title: "Coal and Petroleum" },
    { num: 6, title: "Combustion and Flame" },
    { num: 7, title: "Conservation of Plants and Animals" },
    { num: 8, title: "Cell - Structure and Functions" },
    { num: 9, title: "The Amazing World of Solutes, Solvents, and Solutions" },
    { num: 10, title: "Reaching the Age of Adolescence" },
    { num: 11, title: "Force and Pressure" },
    { num: 12, title: "Friction" },
    { num: 13, title: "Sound" },
    { num: 14, title: "Chemical Effects of Electric Current" },
    { num: 15, title: "Some Natural Phenomena" },
    { num: 16, title: "Light" },
    { num: 17, title: "Stars and the Solar System" },
    { num: 18, title: "Pollution of Air and Water" }
  ];

  const renderClass8Wing = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Subheader Wing Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <button
            onClick={handleBackToSubjects}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Class 8th Wing</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Demonstrations & Labs for Class 8</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {CLASS_8_CHAPTERS.map(chapter => {
            if (chapter.num === 2 || chapter.num === 4 || chapter.num === 5 || chapter.num === 9) {
              return (
                <div
                  key={chapter.num}
                  className="glass-panel"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '1.5rem',
                    border: '1px solid var(--accent-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Chapter
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <BookOpen size={20} style={{ color: 'var(--accent-text)', marginTop: '0.25rem' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-text)', fontWeight: '500' }}>{chapter.title}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                    {chapter.num === 2 ? "Interactive Lab 1: Discovering the Invisible World. Learn about magnification, slide preparation, and cell observation." : 
                     chapter.num === 4 ? "Includes Materials: Metals and Non-Metals. Test the appearance, hardness, and hammering effect on various materials." : 
                     chapter.num === 5 ? "Includes Activity 5.1: Force Explorer." :
                     "Includes Activity 9.1: Solutes, Solvents, and Solutions."}
                  </p>

                  <button 
                    onClick={() => navigateTo('class8', `chapter${chapter.num}`)}
                    className="primary" 
                    style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                  >
                    Open Chapter <ArrowRight size={14} />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={chapter.num}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  padding: '1.5rem',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--warning-bg)', color: 'var(--warning)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Coming Soon
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <BookOpen size={20} style={{ color: '#818cf8', marginTop: '0.25rem' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{chapter.title}</p>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                  Interactive science concepts, virtual experiments, and quizzes for this chapter.
                </p>

                <button
                  disabled
                  className="outline"
                  style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem', opacity: 0.5, cursor: 'not-allowed' }}
                >
                  Module Locked
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Renders Under Construction screen for Chemistry or Biology
  const renderUnderConstruction = (subjectName, IconComponent, colorHex) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={handleBackToSubjects}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{subjectName} Wing</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Modules and Experiments</span>
        </div>
      </div>

      <div className="glass-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 2rem',
        gap: '1rem',
        border: '1px dashed var(--border)'
      }}> 
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'var(--neutral-bg)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colorHex
        }}>
          <IconComponent size={32} />
        </div>
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0' }}>{subjectName} Lab Under Construction</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-faint)', maxWidth: '420px', lineHeight: '1.5' }}>
            We are designing beautiful, interactive molecular and genetic experiments for the {subjectName} curriculum. Check back soon!
          </p>
        </div>
        <button
          onClick={handleBackToSubjects}
          className="outline"
          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', marginTop: '0.5rem' }}
        >
          {subjectName.toLowerCase().includes('social') ? 'Return to Social Lab' : 'Return to Science Lab'}
        </button>
      </div>
    </div>
  );

  const isFullscreen = (activeActivity && !['chapter2', 'chapter3', 'chapter4', 'chapter5', 'chapter6', 'chapter11', 'chapter4_flow', 'chapter9'].includes(activeActivity)) || !!activeContentLesson;

  return (
    <div className="app-container">
      {/* Invisible Triggers for Focus Mode Reveal */}
      <div className="focus-trigger-top" />
      <div className="focus-trigger-left" />

      {/* Page Title Header */}
      {!isFullscreen && (
        <header className="header" style={{ marginBottom: activeSubject ? '1.5rem' : '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="header-title">
                <BookOpen style={{ color: 'var(--accent)' }} size={24} />
                <h1 style={{ fontSize: '1.75rem' }}>FuturaX Interactive Labs</h1>
              </div>
              <p className="header-subtitle">
                Active-learning simulations and concept reviews for science and social science
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Theme Toggle */}
              <button 
                className="outline" 
                onClick={toggleTheme}
                style={{ 
                  padding: '0.4rem 0.8rem', 
                  fontSize: '0.85rem', 
                  gap: '0.5rem', 
                  borderRadius: '8px',
                  borderColor: 'var(--border)'
                }}
              >
                {theme === 'dark' ? (
                  <><Sun size={14} /> <span>Light Theme</span></>
                ) : (
                  <><Moon size={14} /> <span>Dark Theme</span></>
                )}
              </button>
            </div>
            {activeSubject && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  onClick={handleBackToSubjects}
                  title="Go back to Dashboard"
                >
                  <Home size={14} />
                  <span style={{ cursor: 'pointer' }}>Dashboard</span>
                </div>
                <ArrowRight size={10} />
                <span
                  style={{ color: 'var(--text-secondary)', textTransform: 'capitalize', cursor: activeActivity ? 'pointer' : 'default' }}
                  onClick={() => activeActivity && handleBackToLabs()}
                  title={activeActivity ? "Go back to class" : ""}
                >
                  {activeSubject === 'class6' ? 'Class 6th' :
                    activeSubject === 'class6_maths' ? 'Class 6th Maths' :
                    activeSubject === 'class7' ? 'Class 7th' :
                      activeSubject === 'class8' ? 'Class 8th' : 
                        activeSubject === 'class9' ? 'Class 9th' :
                          activeSubject === 'science_lab' ? 'Science Lab' :
                            activeSubject === 'social_lab' ? 'Social Lab' :
                              activeSubject === 'class6_social' ? 'Class 6th (Social)' :
                                activeSubject === 'class7_social' ? 'Class 7th (Social)' : 'Class'}
                </span>
                {activeActivity && (
                  <>
                    <ArrowRight size={10} />
                    <span style={{ color: 'var(--accent-text)' }}>
                      {activeActivity === 'electric_switch' ? 'Activities 3.8 & 3.9' : 
                       activeActivity === 'torch_explorer' ? 'Activities 3.1, 3.2 & 3.3' :
                       activeActivity === 'spherical_mirrors' ? 'Spherical Mirrors' : 
                       activeActivity === 'food_testing' ? 'Food Testing' :
                       activeActivity === 'fat_testing' ? 'Fat Testing' :
                       activeActivity === 'protein_testing' ? 'Protein Testing' :
                       activeActivity === 'materials_properties' ? 'Properties of Materials' :
                       activeActivity === 'magnetic_poles' ? 'Magnetic Poles' :
                       activeActivity === 'suspended_magnet' ? 'Suspended Magnet' :
                       activeActivity === 'magnetic_compass' ? 'Make a Compass' :
                       activeActivity === 'magnet_interaction' ? 'Magnet Interaction' :
                       activeActivity === 'activity_3_11' ? 'Activity 3.11' :
                       activeActivity === 'linear_motion' ? 'Linear Motion' :
                       activeActivity === 'magnetic_effect' ? 'Activity 4.1' :
                       activeActivity === 'electromagnet_investigation' ? 'Activities 4.2, 4.3 & 4.4' :
                       activeActivity === 'heating_effect' ? 'Activity 4.5' :
                       activeActivity === 'line_segment_lab' ? 'Activity 2.2: Line Segment Lab' :
                       activeActivity === 'parallel_intersecting_lab' ? 'Activity 2.3: Parallel & Intersecting Lines' :
                       activeActivity === 'curves_regions_lab' ? 'Activity 2.4: Curves & Closed Regions' :
                       activeActivity === 'virtual_biodiversity' ? 'Activity 2.1 — Virtual Biodiversity Explorer' :
                       activeActivity === 'plant_detective' ? 'Plant Detective Lab' :
                       activeActivity === 'animal_habitat' ? 'Animal Habitat Explorer' :
                       activeActivity === '9.2' ? 'Activity 9.2' :
                       'Template Demo'}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </header>
      )}

      {/* Main Workspace content */}
      <main className="content-wrapper">
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', color: 'var(--text-muted)' }}>
            Loading activity...
          </div>
        }>
        {/* HIERARCHICAL ROUTER */}
        {activeSubject === null ? (
          renderSubjectSelector()
        ) : activeSubject === 'science_lab' ? (
          renderScienceLabWings()
        ) : activeSubject === 'math_lab' ? (
          renderMathLabWings()
        ) : activeSubject === 'class7' ? (
          activeActivity === 'electric_switch' ? (
            <ElectricSwitchActivity onBackToDashboard={() => navigateTo('class7', 'chapter3')} />
          ) : activeActivity === 'electric_circuit' ? (
            <ElectricCircuitActivity onBackToDashboard={() => navigateTo('class7', 'chapter3')} />
          ) : activeActivity === 'lamp_explorer' ? (
            <LampExplorerActivity onBackToDashboard={() => navigateTo('class7', 'chapter3')} />
          ) : activeActivity === 'activity_3_7' ? (
            <Activity3_7 onBackToDashboard={() => navigateTo('class7', 'chapter3')} />
          ) : activeActivity === 'activity_3_11' ? (
            <Activity3_11 onBackToDashboard={() => navigateTo('class7', 'chapter3')} />
          ) : activeActivity === 'torch_explorer' ? (
            <TorchExplorerActivity onBackToDashboard={() => navigateTo('class7', 'chapter3')} />
          ) : activeActivity === 'spherical_mirrors' ? (
            <SphericalMirrorsActivity onBackToDashboard={() => navigateTo('class7', 'chapter11')} />
          ) : activeActivity === 'materials_properties' ? (
            <MaterialsPropertiesActivity onBackToDashboard={() => navigateTo('class7', 'chapter4')} />
          ) : activeActivity === 'boilerplate' ? (
            <ActivityTemplate onBackToDashboard={() => navigateTo('class7', null)} />
          ) : activeActivity === 'chapter3' ? (
            renderClass7Chapter3()
          ) : activeActivity === 'chapter4' ? (
            renderClass7Chapter4()
          ) : activeActivity === 'chapter11' ? (
            renderClass7Chapter11()
          ) : (
            renderClass7Wing()
          )
        ) : activeSubject === 'class6' ? (
          activeActivity === 'food_testing' ? (
            <FoodTestingActivity onBackToDashboard={() => navigateTo('class6', 'chapter3')} />
          ) : activeActivity === 'fat_testing' ? (
            <FatTestingActivity onBackToDashboard={() => navigateTo('class6', 'chapter3')} />
          ) : activeActivity === 'protein_testing' ? (
            <ProteinTestingActivity onBackToDashboard={() => navigateTo('class6', 'chapter3')} />
          ) : activeActivity === 'intro_magnets' ? (
            <IntroMagnets 
              onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} 
              onComplete={() => navigateTo('class6', 'chapter4_flow', 'act-4-1')}
            />
          ) : activeActivity === 'activity_4_1' ? (
            <Activity4_1 
              onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} 
              onComplete={() => navigateTo('class6', 'chapter4_flow', 'sec-4-2')}
            />
          ) : activeActivity === 'magnetic_poles' ? (
            <MagneticPolesActivity onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} onComplete={() => navigateTo('class6', 'chapter4_flow', 'sec-4-3')} />
          ) : activeActivity === 'suspended_magnet' ? (
            <SuspendedMagnetActivity onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} onComplete={() => navigateTo('class6', 'chapter4_flow', 'act-4-4')} />
          ) : activeActivity === 'magnetic_compass' ? (
            <MagneticCompassActivity onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} onComplete={() => navigateTo('class6', 'chapter4_flow', 'sec-4-4')} />
          ) : activeActivity === 'magnet_interaction' ? (
            <MagnetInteractionActivity onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} onComplete={() => navigateTo('class6', 'chapter4_flow', 'act-4-6')} />
          ) : activeActivity === 'activity_4_6' ? (
            <Activity4_6 onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} onComplete={() => navigateTo('class6', 'chapter4_flow', 'act-4-7')} />
          ) : activeActivity === 'activity_4_7' ? (
            <Activity4_7 onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} onComplete={() => navigateTo('class6', 'chapter4_flow')} />
          ) : activeActivity === 'sci6-ch4-sec45-fun-with-magnets' ? (
            <FunWithMagnets onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} onComplete={() => navigateTo('class6', 'chapter4_flow')} />
          ) : activeActivity === 'linear_motion' ? (
            <LinearMotionActivity onBackToDashboard={() => navigateTo('class6', 'chapter5')} />
          ) : activeActivity === 'circular_motion' ? (
            <CircularMotionActivity onBackToDashboard={() => navigateTo('class6', 'chapter5')} />
          ) : activeActivity === 'virtual_biodiversity' ? (
            <VirtualBiodiversityExplorerActivity onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'appreciating_biodiversity' ? (
            <AppreciatingBiodiversityActivity onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'inline_sorting' ? (
            <InlineSortingActivity 
              onBackToDashboard={(completed) => {
                if (completed) setShowSortSuccess(true);
                navigateTo('class6', 'chapter2');
              }} 
            />
          ) : activeActivity === 'plant_detective' ? (
            <PlantDetectiveActivity onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'leaf_venation_lab' ? (
            <LeafVenationLab onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'root_systems_lab' ? (
            <RootSystemsLab onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'venation_root_correlation' ? (
            <VenationRootCorrelationLab onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'seed_dissection_lab' ? (
            <SeedDissectionLab onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'animal_habitat' ? (
            <AnimalHabitatExplorerActivity onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'chapter2' ? (
            renderClass6Chapter2()
          ) : activeActivity === 'material_detective' ? (
            <MaterialDetectiveActivity onBackToDashboard={() => navigateTo('class6', 'chapter6')} />
          ) : activeActivity === 'materials_around_us' ? (
            <MaterialsAroundUsActivity onBackToDashboard={() => navigateTo('class6', null)} />
          ) : activeActivity === 'chapter3' ? (
            renderClass6Chapter3()
          ) : activeActivity === 'chapter4' ? (
            renderClass6Chapter4()
          ) : activeActivity === 'chapter4_flow' ? (
            <Chapter4Flow 
              onBackToDashboard={() => navigateTo('class6', null)} 
              onLaunchActivity={(act) => navigateTo('class6', act)} 
              initialSection={activeSection}
            />
          ) : activeActivity === 'chapter5' ? (
            renderClass6Chapter5()
          ) : activeActivity === 'chapter6' ? (
            renderClass6Chapter6()
          ) : (
            renderClass6Wing()
          )
        ) : activeSubject === 'class8' ? (
          activeActivity === '4.1' ? (
            <MagneticEffectOfCurrentActivity onBackToDashboard={() => navigateTo('class8', 'chapter4')} />
          ) : activeActivity === 'electromagnet_investigation' ? (
            <ElectromagnetInvestigationActivity onBackToDashboard={() => navigateTo('class8', 'chapter4')} />
          ) : activeActivity === 'heating_effect' ? (
            <HeatingEffectActivity onBackToDashboard={() => navigateTo('class8', 'chapter4')} />
          ) : activeActivity === 'lemon_battery' ? (
            <LemonBatteryLabActivity onBackToDashboard={() => navigateTo('class8', 'chapter4')} />
          ) : activeActivity === '9.1' ? (
            <Activity9_1 onBackToDashboard={() => navigateTo('class8', 'chapter9')} />
          ) : activeActivity === '9.2' ? (
            <Activity9_2 onBackToDashboard={() => navigateTo('class8', 'chapter9')} />
          ) : activeActivity === '5.1' ? (
            <ForceExplorerActivity onBackToDashboard={() => navigateTo('class8', 'chapter5')} />
          ) : activeActivity === 'chapter2' ? (
            <MicroscopeDiscovery onBackToDashboard={() => navigateTo('class8', null)} />
          ) : activeActivity === 'chapter4' ? (
            renderClass8Chapter4()
          ) : activeActivity === 'chapter5' ? (
            renderClass8Chapter5()
          ) : activeActivity === 'chapter9' ? (
            renderClass8Chapter9()
          ) : (
            renderClass8Wing()
          )
        ) : activeSubject === 'class9' ? (
          renderUnderConstruction('Class 9th', Zap, '#ec4899')
        ) : activeSubject === 'social_lab' ? (
          renderSocialLabWings()
        ) : activeSubject === 'class6_social' ? (
          activeActivity === 'chapter11' ? (
            <GrassrootsDemocracyActivity onBackToDashboard={() => navigateTo('class6_social', null)} />
          ) : activeActivity === 'locating_places' ? (
            <LocatingPlacesActivity onBackToDashboard={() => navigateTo('class6_social', null)} />
          ) : (
            renderClass6SocialWing()
          )
        ) : activeSubject === 'class7_social' ? (
          activeActivity === 'chapter1' ? (
            <GeographyExpeditionActivity onBackToDashboard={() => navigateTo('class7_social', null)} />
          ) : (
            renderClass7SocialWing()
          )
        ) : activeSubject === 'class6_maths' ? (
          activeActivity === 'line_segment_lab' ? (
            <LineSegmentLabActivity onBackToDashboard={() => navigateTo('class6_maths', 'chapter4')} />
          ) : activeActivity === 'parallel_intersecting_lab' ? (
            <ParallelIntersectingLabActivity onBackToDashboard={() => navigateTo('class6_maths', 'chapter4')} />
          ) : activeActivity === 'curves_regions_lab' ? (
            <CurvesRegionsLabActivity onBackToDashboard={() => navigateTo('class6_maths', 'chapter4')} />
          ) : activeActivity === 'angles_lab' ? (
            <AnglesLabActivity onBackToDashboard={() => navigateTo('class6_maths', 'chapter4')} />
          ) : activeActivity === 'polygons_lab' ? (
            <PolygonsLabActivity onBackToDashboard={() => navigateTo('class6_maths', 'chapter4')} />
          ) : activeActivity === 'circles_lab' ? (
            <CirclesLabActivity onBackToDashboard={() => navigateTo('class6_maths', 'chapter4')} />
          ) : activeActivity === 'chapter4' ? (
            renderClass6MathsChapter4()
          ) : (
            renderClass6MathsWing()
          )
        ) : null}
        </Suspense>
      </main>

      {/* Floating Theme Toggle for Focus Mode */}
      {activeActivity && (
        <button
          className="outline"
          onClick={toggleTheme}
          title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--card-bg)',
            boxShadow: 'var(--card-shadow)',
            borderColor: 'var(--border)'
          }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      )}
    </div>
  );
}
