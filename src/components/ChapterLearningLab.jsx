import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import CoverPage from "./CoverPage";
import SloganPage from "./SloganPage";
import VerticalLevelMap from "./VerticalLevelMap";
import confetti from "canvas-confetti";

// Context
import { useTheme } from "../ThemeContext";

// Content Lessons (Class 6 Chapter 2)
import IntroductionMindMap from "../activities/IntroductionMindMap";
import GroupingBasicsBookSpread from "../activities/GroupingBasicsBookSpread";

// Activities (Class 6 Chapter 2 & 3)
import VirtualBiodiversityExplorerActivity from "../activities/VirtualBiodiversityExplorer";
import AppreciatingBiodiversityActivity from "../activities/AppreciatingBiodiversityActivity";
import InlineSortingActivity from "../activities/InlineSortingActivity";
import PlantDetectiveActivity from "../activities/PlantDetective";
import LeafVenationLab from "../activities/LeafVenationLab";
import RootSystemsLab from "../activities/RootSystemsLab";
import VenationRootCorrelationLab from "../activities/VenationRootCorrelationLab";
import SeedDissectionLab from "../activities/SeedDissectionLab";
import AnimalHabitatExplorerActivity from "../activities/AnimalHabitatExplorer";
import FoodTestingActivity from "../activities/FoodTesting";
import FatTestingActivity from "../activities/FatTesting";
import ProteinTestingActivity from "../activities/ProteinTesting";

const LEVEL_QUIZZES = {
  'biodiversity_concept': [
    {
      q: 'Who led the students on the school garden nature walk?',
      opts: [
        'Dr. Raghu and Maniram chacha',
        'The school Principal',
        'A forest ranger'
      ],
      correct: 0
    },
    {
      q: 'What tables are used to record observations of plants and animals respectively?',
      opts: [
        'Table 1.1 and 1.2',
        'Table 2.1 and 2.2',
        'Table 3.1 and 3.2'
      ],
      correct: 1
    }
  ],
  'grouping_basics_concept': [
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
  ],
  'plant_variety_concept': [
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
  ],
  'venation_roots_concept': [
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
      q: 'Which of the following leaf-root pairs matches Grass?',
      opts: [
        'Parallel Venation and Fibrous Roots',
        'Reticulate Venation and Taproots',
        'Parallel Venation and Taproots'
      ],
      correct: 0
    }
  ],
  'cotyledons_concept': [
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
  ],
  'grouping_animals_concept': [
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
  ],
  'adaptations_concept': [
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
};

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
          '🕸️ Reticulate Venation: Veins form a net-like mesh on both sides of a thick midrib (e.g., Hibiscus, Sadabahar).',
          '📏 Parallel Venation: Veins run parallel to each other from the base to tip (e.g., Grass, Wheat, Maize).'
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
          '🕸️ Reticulate Venation ⇄ 🥕 Taproot System (e.g., Sadabahar, Chickpea).',
          '📏 Parallel Venation ⇄ 🌾 Fibrous Root System (e.g., Grass, Wheat).'
        ],
        svg: 'correlation'
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
      }
    ]
  }
};

const LEVEL_DYK = {
  biodiversity_concept: [
    'Plants and animals around us may look calm, but they all respond to light, water, and touch in different ways.',
    'A plant is living even when it stays rooted because it grows, breathes, and makes food from sunlight.',
    'Field notebooks like Table 2.1 and 2.2 help scientists compare organisms by their features and behavior.'
  ],
  grouping_basics_concept: [
    'Classification helps scientists organise millions of organisms so they can study similarities and differences easily.',
    'Plants can be grouped by their stem, leaf shape, flower presence, and how they reproduce.',
    'Animals are grouped by habitat, body parts, and how they move — walk, fly, swim or crawl.'
  ],
  plant_variety_concept: [
    'Trees usually have a single thick trunk, while shrubs have many thin woody branches close to the ground.',
    'Herbs have soft green stems that bend easily and are often used for medicine or cooking.',
    'Climbers use other plants or structures to support their stems as they grow upward.'
  ],
  venation_roots_concept: [
    'Reticulate venation looks like a net of veins, while parallel venation has lines running side by side.',
    'A taproot grows deep into the soil, while fibrous roots spread out in many thin strands near the surface.',
    'In many plants, leaf shape can help predict what kind of root system the plant has.'
  ],
  cotyledons_concept: [
    'Monocot seeds have one cotyledon and usually show parallel leaf veins.',
    'Dicot seeds have two cotyledons and usually show reticulate leaf veins.',
    'Cotyledons store food for the young plant when it first sprouts from the seed.'
  ],
  grouping_animals_concept: [
    'Birds are grouped separately because they have wings and can fly using feathers.',
    'Some animals live on land, some in water, and some in both places — this is how habitats are classified.',
    'Warm-blooded animals keep their bodies at a nearly constant temperature, unlike cold-blooded animals.'
  ],
  adaptations_concept: [
    'Camels have special feet to walk on sand and a hump to store fat for dry periods.',
    'Animals in cold regions often have thick fur or fat to stay warm.',
    'Some plants in deserts have thick stems to store water and small leaves to reduce water loss.'
  ]
};

const CHAPTER_2_LEVELS = [
  {
    id: 'lvl-1',
    title: '2.1 — Diversity Around Us',
    lessonId: 'biodiversity_concept',
    icon: '🌿',
    activities: [
      { id: 'sec-2-1-act', title: 'Activity 2.1 — Plants (Table 2.1)', activityId: 'virtual_biodiversity', icon: '🌿', desc: 'Record real plants — tap the leaves, stems and flowers.', pg: 'p.11', path: '/activities/class6_chapter2/activity_0.html' },
      { id: 'sec-2-1-act-2', title: 'Activity 2.1 — Animals (Table 2.2)', activityId: 'virtual_biodiversity', icon: '🐾', desc: 'Where animals live, what they eat and how they move.', pg: 'p.12', path: '/activities/class6_chapter2/activity_1.html' }
    ]
  },
  {
    id: 'lvl-2',
    title: '2.2 — How to Group Plants & Animals?',
    lessonId: 'grouping_basics_concept',
    icon: '🧩',
    activities: [
      { id: 'sec-2-2-act', title: 'Activity 2.2 — Let us appreciate', activityId: 'appreciating_biodiversity', icon: '🎨', desc: 'A live class blackboard reveals biodiversity.', pg: 'p.13', path: '/activities/class6_chapter2/activity_2.html' },
      { id: 'sec-2-3-act', title: 'Activity 2.3: Let Us Group (Card Sorting)', activityId: 'inline_sorting', icon: '🧩', desc: 'The same living things regroup by any feature you pick.', pg: 'p.14–15', path: '/activities/class6_chapter2/activity_3.html' }
    ]
  },
  {
    id: 'lvl-3',
    title: '2.2.1-A — Herbs, Shrubs & Trees',
    lessonId: 'plant_variety_concept',
    icon: '🌱',
    activities: [
      { id: 'sec-2-4-act', title: 'Activity 2.4 — Herbs, shrubs & trees', activityId: 'plant_detective_stem', icon: '🌱', desc: 'Grow a plant; watch it be named live. Fill Table 2.3.', pg: 'p.15–16', path: '/activities/class6_chapter2/activity_4.html' }
    ]
  },
  {
    id: 'lvl-4',
    title: '2.2.1-B — Leaf Venation & Root Systems',
    lessonId: 'venation_roots_concept',
    icon: '🍃',
    activities: [
      { id: 'sec-2-5-act', title: 'Activity 2.5 — Leaf venation', activityId: 'leaf_venation_lab', icon: '🍃', desc: 'Sort leaves: reticulate (net-like) vs parallel.', pg: 'p.17', path: '/activities/class6_chapter2/activity_5.html' },
      { id: 'sec-2-6-act', title: 'Activity 2.6 — Roots', activityId: 'root_systems_lab', icon: '🥕', desc: 'Sort roots into taproot or fibrous.', pg: 'p.18', path: '/activities/class6_chapter2/activity_6.html' },
      { id: 'sec-2-7-act', title: 'Activity 2.7 — Relate & analyse', activityId: 'venation_root_correlation', icon: '🔗', desc: 'Discover the venation–root link. Fill Table 2.4.', pg: 'p.19', path: '/activities/class6_chapter2/activity_7.html' }
    ]
  },
  {
    id: 'lvl-5',
    title: '2.2.1-C — Seeds & Cotyledons',
    lessonId: 'cotyledons_concept',
    icon: '🥜',
    activities: [
      { id: 'sec-2-8-act', title: 'Activity 2.8 — Seeds (dicot/monocot)', activityId: 'seed_dissection_lab', icon: '🥜', desc: 'Compare seeds and tie the whole chapter together.', pg: 'p.20', path: '/activities/class6_chapter2/activity_8.html' }
    ]
  },
  {
    id: 'lvl-6',
    title: '2.2.2 — How to Group Animals?',
    lessonId: 'grouping_animals_concept',
    icon: '🏃',
    activities: [
      { id: 'sec-2-9-act', title: 'Activity 2.9 — Animal movement', activityId: 'animal_locomotion', icon: '🏃', desc: 'Group animals by the body part they move with. Table 2.5.', pg: 'p.21–22', path: '/activities/class6_chapter2/activity_9.html' }
    ]
  },
  {
    id: 'lvl-7',
    title: '2.3 — Surroundings & Adaptations',
    lessonId: 'adaptations_concept',
    icon: '🗺️',
    activities: [
      { id: 'sec-2-10-act', title: 'Activity 2.10 — Different surroundings', activityId: 'animal_habitat_matching', icon: '🗺️', desc: 'Sort life into desert, mountains, ocean and forest.', pg: 'p.23–24', path: '/activities/class6_chapter2/activity_10.html' },
      { id: 'sec-2-11-act', title: 'Adaptations — Camels', activityId: null, icon: '🐪', desc: 'Compare a hot-desert and cold-desert camel.', pg: 'p.25–26', path: '/activities/class6_chapter2/activity_11.html' },
      { id: 'sec-2-12-act', title: 'Habitats — land, water & both', activityId: null, icon: '🏡', desc: 'Sort living things into terrestrial, aquatic or amphibian.', pg: 'p.27–28', path: '/activities/class6_chapter2/activity_12.html' }
    ]
  },
  {
    id: 'lvl-8',
    title: 'Glossary & Vocabulary',
    lessonId: 'vocabulary_glossary',
    icon: '🔑',
    activities: [
      { id: 'sec-2-13-act', title: 'Sacred Groves & Keywords', activityId: null, icon: '🔑', desc: 'Sacred groves, plus a tappable glossary of every keyword.', pg: 'p.29', path: '/activities/class6_chapter2/activity_13.html' }
    ]
  },
  {
    id: 'lvl-9',
    title: 'Chapter Challenge',
    lessonId: 'chapter_challenge_overview',
    icon: '🏆',
    activities: [
      { id: 'sec-2-14-act', title: 'Chapter Challenge — enhance our learning', activityId: null, icon: '🏆', desc: 'The chapter\'s own exercises — Venn sort, flowchart logic, scored.', pg: 'p.31–33', path: '/activities/class6_chapter2/activity_14.html' }
    ]
  }
];

// Custom Subcomponents for Grouped Levels
function IntroStoryteller({ onComplete }) {
  const [currentScene, setCurrentScene] = useState(0);
  
  const scenes = [
    {
      img: "/IntroPicture1.png",
      title: "🌱 The Nature Walk Begins",
      text: "Dr Raghu and Maniram chacha lead the students out of the classroom into a nearby patch of forest. The air is fresh and filled with the scent of wet soil and leaves. The kids are excited to discover what secrets the nature walk holds!"
    },
    {
      img: "/IntroPicture2.png",
      title: "🌿 Observing Diverse Plants",
      text: "As they walk, they observe different kinds of plants. Some are small herbs growing close to the ground, others are bushy shrubs, and some are grand trees with thick trunks. Dr Raghu reminds them to observe gently without plucking any leaves or flowers."
    },
    {
      img: "/IntroPicture3.png",
      title: "🐦 Listening to Bird Calls",
      text: "Hush! Maniram chacha stops and cups his ear. He mimics a bird song, and suddenly, a beautiful response is heard from the tree canopy! The students learn to listen to the unique calls of birds and respect their home."
    },
    {
      img: "/IntroPicture4.png",
      title: "🦋 Fluttering Insects & Butterflies",
      text: "Near a cluster of wildflowers, butterflies and bees are busy gathering nectar. The students watch closely as a butterfly unfolds its delicate wings. They notice how insects play a vital role in helping flowers grow."
    },
    {
      img: "/IntroPicture5.png",
      title: "🐒 Animals in the Canopy",
      text: "A rustle in the branches reveals monkeys jumping from limb to limb, and a tiny squirrel scurrying down a trunk. The forest is alive with creatures of all sizes, each adapted to live in their part of the woods."
    },
    {
      img: "/IntroPicture6.png",
      title: "📋 Recording in the Table",
      text: "The students take out their notebooks to record their observations in Tables 2.1 and 2.2. They separate their findings into plants and animals, marveling at the incredible diversity of life surrounding them!"
    }
  ];

  const handleNext = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const handlePrev = () => {
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
    }
  };

  return (
    <div className="split-frame" style={{ width: '100%', minHeight: '480px' }}>
      {/* LEFT COLUMN: Narrative & Controls */}
      <div className="frame-page-left">
        <div className="textbook-eyebrow">Class 6 Science · Introduction</div>
        <h1 className="textbook-title" style={{ fontFamily: 'var(--serif-font)', margin: '0 0 1rem 0', fontSize: '1.6rem' }}>
          Virtual Nature Walk
        </h1>
        
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.65', flex: 1, margin: 0 }}>
          {scenes[currentScene].text}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <button 
            onClick={handlePrev} 
            disabled={currentScene === 0}
            className="outline" 
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', borderRadius: '8px' }}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.78rem', alignSelf: 'center', color: 'var(--text-muted)' }}>
            Scene {currentScene + 1} of 6
          </span>
          <button 
            onClick={handleNext} 
            className="primary" 
            style={{ padding: '0.35rem 0.9rem', fontSize: '0.78rem', borderRadius: '8px' }}
          >
            {currentScene === scenes.length - 1 ? "Finish Story ➔" : "Next Scene"}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Scene Visual */}
      <div className="frame-page-right" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, justifyContent: 'center', alignItems: 'stretch', border: '1px solid var(--border)', background: 'transparent' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
            {scenes[currentScene].title}
          </span>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '12px', background: 'transparent' }}>
          <img 
            src={scenes[currentScene].img} 
            alt={scenes[currentScene].title} 
            style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '360px', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
          />
        </div>
      </div>
    </div>
  );
}

function VocabularyGlossary({ onMatchComplete }) {
  const [activeTab, setActiveTab] = useState('glossary'); // 'glossary' or 'game'
  const [flippedCardId, setFlippedCardId] = useState(null);
  
  const terms = [
    { id: 'habitat', word: 'Habitat', desc: 'The natural home or environment of a plant, animal, or other organism.', eg: 'A pond is the habitat for frogs and lotus plants.', icon: '🏡' },
    { id: 'adaptation', word: 'Adaptation', desc: 'A physical or behavioral feature that helps an organism survive in its habitat.', eg: 'Camels have broad padded feet to walk on hot desert sand.', icon: '🐫' },
    { id: 'herbs', word: 'Herbs', desc: 'Small plants with soft, green, and tender stems that bend easily.', eg: 'Grass, coriander, tomato, and tulsi are common herbs.', icon: '🌿' },
    { id: 'shrubs', word: 'Shrubs', desc: 'Medium-sized plants with thin, woody stems branching out close to the ground.', eg: 'Hibiscus, rose, and lemon plants grow as shrubs.', icon: '🌹' },
    { id: 'trees', word: 'Trees', desc: 'Tall plants with thick, hard, woody trunks branching high above the ground.', eg: 'Mango, neem, pine, and banyan trees grow tall.', icon: '🌳' },
    { id: 'reticulate', word: 'Reticulate Venation', desc: 'A net-like pattern of veins on both sides of the leaf midrib.', eg: 'Hibiscus, sadabahar, and rose leaves show net venation.', icon: '🕸️' },
    { id: 'parallel', word: 'Parallel Venation', desc: 'Veins running parallel to each other from the base of the leaf to the tip.', eg: 'Grass, wheat, maize, and banana leaves have parallel veins.', icon: '📏' },
    { id: 'taproot', word: 'Taproot System', desc: 'A single, thick primary root growing deep vertically, with smaller side branches.', eg: 'Mustard, carrots, and chickpea plants have taproots.', icon: '🥕' },
    { id: 'fibrous', word: 'Fibrous Roots', desc: 'A bunch of thin, equal-sized roots arising together from the base of the stem.', eg: 'Grass, wheat, onions, and maize have fibrous root systems.', icon: '🌾' },
    { id: 'monocot', word: 'Monocot', desc: 'A seed with a single cotyledon (seed leaf) that cannot be split into two halves.', eg: 'Maize, wheat, and rice seeds are monocots.', icon: '🌽' },
    { id: 'dicot', word: 'Dicot', desc: 'A seed with two cotyledons (seed leaves) that easily split into two halves.', eg: 'Gram, peas, almonds, and kidney beans are dicot seeds.', icon: '🫘' },
    { id: 'sacred', word: 'Sacred Groves', desc: 'Traditionally protected forest patches guarded by local communities for wildlife conservation.', eg: 'Sacred groves in the Western Ghats protect unique plants and animals.', icon: '🏹' }
  ];

  // Match Game State
  const [gameShuffled, setGameShuffled] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (activeTab === 'game') {
      const pool = [...terms].sort(() => 0.5 - Math.random()).slice(0, 6);
      const termsPool = pool.map(t => ({ id: t.id, text: t.word, type: 'term' }));
      const defsPool = pool.map(t => ({ id: t.id, text: t.desc, type: 'def' }));
      setGameShuffled([...termsPool, ...defsPool].sort(() => 0.5 - Math.random()));
      setMatchedPairs([]);
      setSelectedTerm(null);
      setAttempts(0);
    }
  }, [activeTab]);

  const handleCardClick = (card) => {
    if (matchedPairs.includes(card.id)) return;
    
    if (!selectedTerm) {
      setSelectedTerm(card);
    } else {
      if (selectedTerm.type !== card.type && selectedTerm.id === card.id) {
        const newMatches = [...matchedPairs, card.id];
        setMatchedPairs(newMatches);
        setSelectedTerm(null);
        confetti({ particleCount: 40, spread: 40, origin: { y: 0.8 } });
        if (newMatches.length === 6 && onMatchComplete) {
          onMatchComplete();
        }
      } else {
        setAttempts(a => a + 1);
        setSelectedTerm(card);
      }
    }
  };

  return (
    <div className="split-frame" style={{ width: '100%', minHeight: '480px' }}>
      {/* LEFT COLUMN: Controls & Info */}
      <div className="frame-page-left">
        <div className="textbook-eyebrow">Class 6 Science · Chapter 2</div>
        <h1 className="textbook-title" style={{ fontFamily: 'var(--serif-font)', margin: '0 0 1rem 0', fontSize: '1.6rem' }}>
          Key Vocabulary
        </h1>
        
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
          Mastering scientific terms is key to understanding the diversity of plants and animals. Use this interactive pane to study glossary words or test yourself.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Choose Mode:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('glossary')}
              className={activeTab === 'glossary' ? 'primary' : 'outline'}
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', borderRadius: '8px' }}
            >
              📖 Glossary
            </button>
            <button 
              onClick={() => setActiveTab('game')}
              className={activeTab === 'game' ? 'primary' : 'outline'}
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', borderRadius: '8px' }}
            >
              🎮 Match Game
            </button>
          </div>
        </div>

        {activeTab === 'game' && (
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginTop: '1.25rem',
            fontSize: '13px'
          }}>
            <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Match Game Progress:</span>
            <span>Matched: <b>{matchedPairs.length} / 6</b> pairs</span>
            <span style={{ marginLeft: '12px' }}>Attempts: <b>{attempts}</b></span>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Grid Space */}
      <div className="frame-page-right" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
            {activeTab === 'glossary' ? '📕 Interactive Textbook Glossary' : '🎯 Definition Matcher'}
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {activeTab === 'glossary' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.85rem' }}>
              {terms.map(t => {
                const isFlipped = flippedCardId === t.id;
                return (
                  <div 
                    key={t.id}
                    onClick={() => setFlippedCardId(isFlipped ? null : t.id)}
                    style={{
                      background: isFlipped ? 'var(--accent-glow, rgba(99, 102, 241, 0.05))' : 'var(--card-bg)',
                      border: isFlipped ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      minHeight: '130px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                  >
                    {isFlipped ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                          <strong>Def:</strong> {t.desc}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontStyle: 'italic', marginTop: 'auto' }}>
                          Ex: {t.eg}
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', height: '100%', padding: '0.5rem 0' }}>
                        <span style={{ fontSize: '2.5rem' }}>{t.icon}</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-heading)', textAlign: 'center' }}>
                          {t.word}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.85rem' }}>
              {gameShuffled.map((card, idx) => {
                const isMatched = matchedPairs.includes(card.id);
                const isSelected = selectedTerm && selectedTerm.id === card.id && selectedTerm.type === card.type;
                
                return (
                  <button
                    key={idx}
                    disabled={isMatched}
                    onClick={() => handleCardClick(card)}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: isMatched 
                        ? '1.5px solid var(--success-border, #10b981)' 
                        : isSelected 
                          ? '2px solid var(--accent)' 
                          : '1.5px solid var(--border)',
                      background: isMatched 
                        ? 'rgba(16, 185, 129, 0.08)' 
                        : isSelected 
                          ? 'rgba(99, 102, 241, 0.06)' 
                          : 'var(--card-bg)',
                      color: isMatched ? 'var(--success)' : 'var(--text-primary)',
                      cursor: isMatched ? 'default' : 'pointer',
                      textAlign: 'left',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s ease',
                      opacity: isMatched ? 0.65 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      minHeight: '75px',
                      boxSizing: 'border-box',
                      width: '100%'
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', background: card.type === 'term' ? 'rgba(99,102,241,0.1)' : 'rgba(245,158,11,0.1)', padding: '4px 8px', borderRadius: '4px', color: card.type === 'term' ? 'var(--accent)' : 'var(--warning)', fontWeight: 'bold' }}>
                      {card.type === 'term' ? 'W' : 'D'}
                    </span>
                    <span style={{ flex: 1, lineHeight: '1.35', whiteSpace: 'normal', overflow: 'visible' }}>{card.text}</span>
                  </button>
                );
              })}
            </div>
          )}
          {matchedPairs.length === 6 && (
            <div style={{ marginTop: '1.5rem', textAlign: 'center', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', border: '1px solid var(--success)' }}>
              <h4 style={{ margin: 0, color: 'var(--success)', fontSize: '1.2rem' }}>🎉 Excellent Job! Vocabulary Mastered!</h4>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>You successfully matched all terms. Click Next in the top controls to proceed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChapterChallengeOverview() {
  return (
    <div className="split-frame" style={{ width: '100%', minHeight: '360px' }}>
      {/* LEFT COLUMN: Info */}
      <div className="frame-page-left">
        <div className="textbook-eyebrow">Class 6 Science · Chapter 2 Evaluation</div>
        <h1 className="textbook-title" style={{ fontFamily: 'var(--serif-font)', margin: '0 0 1rem 0', fontSize: '1.6rem' }}>
          Chapter Challenge
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 1.25rem 0' }}>
          This final interactive console compiles everything you have learned in Chapter 2. You will be evaluated on your understanding of:
        </p>
        <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <li>🌱 Plant Classification (Herbs, Shrubs, Trees, Climbers, Creepers)</li>
          <li>🕸️ Leaf Venation and Root Systems Correlation</li>
          <li>🐫 Animal Movements and Habitat Adaptations</li>
        </ul>
      </div>

      {/* RIGHT COLUMN: Action Invitation */}
      <div className="frame-page-right" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, justifyContent: 'center', border: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.75rem' }}>🏆</span>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--text-heading)', fontWeight: 'bold' }}>Scored Evaluation Ready</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0' }}>
            Scroll down to the bottom pane to run the scored Venn sorting and flowchart logic interactive console!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChapterLearningLab({
  classNum,
  chapterNum,
  chapterTitle,
  subjectName,
  topics,
  coverGraphic,
  sloganImg,
  sloganExplanation,
  activities,
  onBack,
  onHeaderVisibilityChange,
}) {
  const [stage, setStage] = useState("cover"); // Stages: 'cover', 'slogan', 'lab'
  
  // Dashboard states
  const [activeContentLesson, setActiveContentLesson] = useState(null);
  const [activeActivitySectionId, setActiveActivitySectionId] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(chapterNum === 2 ? "lvl-1" : null);
  const [pointerTop, setPointerTop] = useState(0);
  const [pointerLeft, setPointerLeft] = useState(0);

  // Grouped Lab Dashboard States (Chapter 2)
  const [activeLevelId, setActiveLevelId] = useState("lvl-1");
  const [activeActivityIdx, setActiveActivityIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activityFocused, setActivityFocused] = useState(null);

  const isLevelCompleted = (lvl) => {
    if (activityStatus[lvl.id] === 'done') return true;
    const lessonDone = lvl.lessonId ? !!contentLessonProgress[lvl.lessonId] : true;
    const activitiesDone = lvl.activities.every(act => activityStatus[act.id] === 'done');
    return lessonDone && activitiesDone;
  };

  // Lesson view states
  const [activeSlide, setActiveSlide] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizChecked, setQuizChecked] = useState(false);

  // Progress tracking states
  const [contentLessonProgress, setContentLessonProgress] = useState({});
  const [activityStatus, setActivityStatus] = useState({});

  const timelineContainerRef = useRef(null);

  const activeLevel = CHAPTER_2_LEVELS.find(l => l.id === activeLevelId) || CHAPTER_2_LEVELS[0];
  const totalLevels = CHAPTER_2_LEVELS.length;
  const activeLevelIdx = CHAPTER_2_LEVELS.findIndex(l => l.id === activeLevelId);
  const activeActivity = activeLevel.activities ? (activeLevel.activities[activeActivityIdx] || activeLevel.activities[0]) : null;
  const isCompleted = activeActivity ? activityStatus[activeActivity.id] === 'done' : false;

  useEffect(() => {
    if (chapterNum !== 2 || stage !== 'lab') return;
    const lesson = contentLessonsData[activeLevel.lessonId];
    if (lesson && activeSlide >= lesson.slides.length) {
      setActiveSlide(0);
      setQuizAnswers({});
      setQuizChecked(false);
    }
  }, [activeLevelId, chapterNum, stage]);

  useEffect(() => {
    if (onHeaderVisibilityChange) {
      if (stage === 'lab') {
        const isFullscreenActive = isFullscreen || !!activeContentLesson || !!activeActivitySectionId;
        onHeaderVisibilityChange(!isFullscreenActive);
      } else {
        onHeaderVisibilityChange(true);
      }
    }
  }, [stage, activeContentLesson, activeActivitySectionId, isFullscreen, onHeaderVisibilityChange]);

  const handleNextToSlogan = () => {
    setStage("slogan");
  };

  const handleBackToCover = () => {
    setStage("cover");
  };

  const handleEnterLab = () => {
    setStage("lab");
  };

  const handleExitLab = () => {
    // If chapterNum is 2, the back button exits straight to main chapters menu via onBack
    if (chapterNum === 2) {
      onBack();
    } else {
      setStage("slogan");
    }
  };

  const handleReadAloud = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    window.speechSynthesis.cancel();
  };

  // Build the sections list dynamically based on chapterNum
  const sections = chapterNum === 2
    ? CHAPTER_2_LEVELS.map(lvl => ({
        id: lvl.id,
        title: lvl.title,
        icon: lvl.icon,
        type: 'level',
        lessonId: lvl.lessonId,
        activities: lvl.activities,
        isCompleted: isLevelCompleted(lvl)
      }))
    : activities.map((act, index) => ({
        id: `sec-${chapterNum}-${index}`,
        title: act.title,
        type: 'activity',
        activityId: act.activityId,
        icon: act.icon,
        desc: act.desc,
        pg: act.pg,
        path: act.path
      }));

  // Update pointer scrolling logic
  useEffect(() => {
    if (stage !== 'lab' || activeContentLesson || activeActivitySectionId) return;

    let ticking = false;

    const updatePointer = () => {
      const sectionEls = Array.from(document.querySelectorAll('.timeline-section'));
      if (sectionEls.length === 0) return;

      let bestMatch = sectionEls[0];
      let minDistance = Infinity;
      const targetY = window.innerHeight * 0.35; // 35% down the viewport

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
    // Run initial updates
    setTimeout(updatePointer, 100);
    setTimeout(updatePointer, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [stage, activeContentLesson, activeActivitySectionId]);

  // Open custom React simulation activity
  const renderCustomSandbox = (actId, onBack) => {
    const activeLevel = CHAPTER_2_LEVELS.find(l => l.id === activeLevelId) || CHAPTER_2_LEVELS[0];
    const activeActivity = activeLevel.activities ? (activeLevel.activities[activeActivityIdx] || activeLevel.activities[0]) : null;

    switch (actId) {
      case "virtual_biodiversity": {
        const typeFilter = (activeActivity && activeActivity.id === 'sec-2-1-act-2') ? 'animal' : 'plant';
        return (
          <VirtualBiodiversityExplorerActivity 
            onBackToDashboard={onBack} 
            typeFilter={typeFilter}
            onNextSection={() => {
              if (activeActivity) {
                setActivityStatus(prev => ({ ...prev, [activeActivity.id]: 'done' }));
              }
              if (typeFilter === 'plant') {
                setActiveActivityIdx(1);
                const activityPaneEl = document.getElementById("pane-activity-window");
                if (activityPaneEl) {
                  activityPaneEl.scrollIntoView({ behavior: 'smooth' });
                }
              } else {
                const totalLevels = CHAPTER_2_LEVELS.length;
                const activeLevelIdx = CHAPTER_2_LEVELS.findIndex(l => l.id === activeLevelId);
                if (activeLevelIdx < totalLevels - 1) {
                  setActiveLevelId(CHAPTER_2_LEVELS[activeLevelIdx + 1].id);
                  setActiveActivityIdx(0);
                  setActiveSlide(0);
                  setQuizAnswers({});
                  setQuizChecked(false);
                } else {
                  onBack();
                }
              }
            }}
          />
        );
      }
      case "appreciating_biodiversity":
        return <AppreciatingBiodiversityActivity onBackToDashboard={onBack} />;
      case "inline_sorting":
        return <InlineSortingActivity onBackToDashboard={onBack} />;
      case "plant_detective_stem":
        return <PlantDetectiveActivity onBackToDashboard={onBack} />;
      case "leaf_venation_lab":
        return <LeafVenationLab onBackToDashboard={onBack} />;
      case "root_systems_lab":
        return <RootSystemsLab onBackToDashboard={onBack} />;
      case "venation_root_correlation":
        return <VenationRootCorrelationLab onBackToDashboard={onBack} />;
      case "seed_dissection_lab":
        return <SeedDissectionLab onBackToDashboard={onBack} />;
      case "animal_locomotion":
        return <AnimalHabitatExplorerActivity key="animal_locomotion" onBackToDashboard={onBack} initialPhase={3} />;
      case "animal_habitat_matching":
        return <AnimalHabitatExplorerActivity key="animal_habitat_matching" onBackToDashboard={onBack} initialPhase={1} />;
      case "food_testing":
        return <FoodTestingActivity onBackToDashboard={onBack} />;
      case "fat_testing":
        return <FatTestingActivity onBackToDashboard={onBack} />;
      case "protein_testing":
        return <ProteinTestingActivity onBackToDashboard={onBack} />;
      default:
        return null;
    }
  };

  // Render slideshow for content review lessons
  const renderFullscreenLessonView = () => {
    const lesson = contentLessonsData[activeContentLesson];
    if (!lesson) return null;
    const totalSlides = lesson.slides.length;
    const currentSlideIndex = Math.min(activeSlide, Math.max(0, totalSlides - 1));
    const slide = lesson.slides[currentSlideIndex];
    const isLastSlide = currentSlideIndex === totalSlides - 1;

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
              {slide.isQuiz && !quizChecked && (
                <button
                  onClick={() => setQuizChecked(true)}
                  className="primary"
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1.35rem', borderRadius: '8px' }}
                >
                  Check Answers
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
                  disabled={slide.isQuiz && !quizChecked}
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

  const getLessonDyk = (lessonId) => {
    return LEVEL_DYK[lessonId] || [
      'Explore the lesson details carefully and revisit the activity to notice real-life examples.',
      'Use the main concepts to answer questions in your notebook and discuss them with classmates.',
      'Science learning is stronger when you connect observations with the textbook idea.'
    ];
  };

  const renderQuizAndDykPane = (lessonId) => {
    const dykList = getLessonDyk(lessonId);
    const levelQuiz = LEVEL_QUIZZES[lessonId];
    
    // Check if lesson and activities are completed
    const lessonDone = activeLevel.lessonId ? !!contentLessonProgress[activeLevel.lessonId] : true;
    const activityDone = activeLevel.activities ? activeLevel.activities.every(act => activityStatus[act.id] === 'done') : true;
    
    const showQuiz = lessonDone && activityDone && levelQuiz;

    return (
      <div id="pane-quiz-window" className="glass-panel" style={{ display: (!isFullscreen || activityFocused !== true) ? 'flex' : 'none', flexDirection: 'column', gap: '1rem', borderTop: '1px dashed var(--border)', paddingTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {showQuiz ? '📝 CHECKPOINT QUIZ' : '💡 DID YOU KNOW?'}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {showQuiz ? 'Test your knowledge on this concept' : 'Fascinating science facts'}
          </span>
        </div>

        {showQuiz ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* 2-Column Side-by-Side Question Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {levelQuiz.map((qObj, qIdx) => {
                const selectedOpt = quizAnswers[qIdx];
                const isCorrect = selectedOpt === qObj.correct;
                return (
                  <div key={qIdx} className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '16px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', boxShadow: '0 8px 32px rgba(0,0,0,0.02)' }}>
                    <p style={{ margin: '0 0 0.85rem 0', fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-heading)', lineHeight: '1.4' }}>
                      Q{qIdx + 1}: {qObj.q}
                    </p>
                    <div style={{ display: 'grid', gap: '0.65rem' }}>
                      {qObj.opts.map((opt, oIdx) => {
                        const isSelected = selectedOpt === oIdx;
                        return (
                          <button
                            key={oIdx}
                            disabled={quizChecked}
                            onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                            style={{
                              textAlign: 'left',
                              padding: '0.85rem 1.15rem',
                              borderRadius: '12px',
                              border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                              background: isSelected ? 'rgba(99,102,241,0.08)' : 'var(--page-bg)',
                              color: 'var(--text-primary)',
                              cursor: quizChecked ? 'default' : 'pointer',
                              fontSize: '0.92rem',
                              width: '100%',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {quizChecked && (
                      <div style={{ marginTop: '0.85rem', color: isCorrect ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {isCorrect ? '✅ Correct!' : `❌ Incorrect (Correct: ${qObj.opts[qObj.correct]})`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!quizChecked ? (
              <button
                onClick={() => setQuizChecked(true)}
                className="glass-btn primary"
                style={{ alignSelf: 'flex-start', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
              >
                Check Answers
              </button>
            ) : (
              // Quiz completed: show score summary + Did You Know again below
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ padding: '1rem 1.25rem', borderRadius: '16px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-heading)' }}>
                    Your Score: {levelQuiz.filter((qObj, qIdx) => quizAnswers[qIdx] === qObj.correct).length} / {levelQuiz.length} Correct
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 'bold' }}>
                    {levelQuiz.filter((qObj, qIdx) => quizAnswers[qIdx] === qObj.correct).length === levelQuiz.length ? '🏆 Perfect Score! Proceed to next section.' : '👍 Good job! Review the facts below.'}
                  </span>
                </div>

                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-heading)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>
                    💡 Reinforce Your Learning
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {dykList.slice(0, 3).map((fact, idx) => {
                      const colors = [
                        { bg: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(129,140,248,0.02) 100%)', border: 'rgba(99,102,241,0.2)', icon: '💡', accent: 'var(--accent)' },
                        { bg: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(251,191,36,0.02) 100%)', border: 'rgba(245,158,11,0.2)', icon: '✨', accent: 'var(--warning)' },
                        { bg: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(52,211,153,0.02) 100%)', border: 'rgba(16,185,129,0.2)', icon: '🌱', accent: 'var(--success)' }
                      ];
                      const design = colors[idx % colors.length];
                      return (
                        <div key={idx} style={{ padding: '1.25rem', borderRadius: '16px', background: design.bg, border: `1px solid ${design.border}`, display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>{design.icon}</span>
                          <div style={{ flex: 1 }}>
                            <strong style={{ display: 'block', marginBottom: '0.25rem', color: design.accent, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Fact {idx + 1}
                            </strong>
                            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                              {fact}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Quiz not unlocked yet: show DYK facts */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {dykList.slice(0, 3).map((fact, idx) => {
                const colors = [
                  { bg: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(129,140,248,0.02) 100%)', border: 'rgba(99,102,241,0.2)', icon: '💡', accent: 'var(--accent)' },
                  { bg: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(251,191,36,0.02) 100%)', border: 'rgba(245,158,11,0.2)', icon: '✨', accent: 'var(--warning)' },
                  { bg: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(52,211,153,0.02) 100%)', border: 'rgba(16,185,129,0.2)', icon: '🌱', accent: 'var(--success)' }
                ];
                const design = colors[idx % colors.length];
                return (
                  <div key={idx} style={{ padding: '1.25rem', borderRadius: '16px', background: design.bg, border: `1px solid ${design.border}`, display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>{design.icon}</span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'block', marginBottom: '0.25rem', color: design.accent, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Fact {idx + 1}
                      </strong>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {fact}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            {lessonId === 'biodiversity_concept' && (
              <div style={{ padding: '1rem 1.25rem', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem' }}>
                <span>🌱</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  <b>Activity Tip:</b> Focus on the plants and animals in the scene. Use hints if needed, then hold the scanner until it verifies the organism.
                </span>
              </div>
            )}
            {levelQuiz && (
              <div style={{ padding: '1rem 1.25rem', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem' }}>
                <span>📝</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  <b>Checkpoint Quiz:</b> Complete the lesson pages and the activity pane above to unlock this subheading's check-point quiz.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ─── INTERACTIVE LESSON MODULES (LEVELS 2 to 7) ───

  function GroupingBasicsInteractive() {
    const [criteria, setCriteria] = useState('material');
    const items = [
      { name: 'Metal Spoon', material: 'Metal', edibility: 'Inedible', icon: '🥄', desc: 'Stainless steel.' },
      { name: 'Red Apple', material: 'Organic', edibility: 'Edible', icon: '🍎', desc: 'Fresh fruit.' },
      { name: 'Plastic Toy', material: 'Plastic', edibility: 'Inedible', icon: '🚗', desc: 'Hard polymer.' },
      { name: 'Sourdough Bread', material: 'Organic', edibility: 'Edible', icon: '🍞', desc: 'Baked wheat.' },
    ];

    const groups = criteria === 'material' 
      ? {
          'Metal': items.filter(i => i.material === 'Metal'),
          'Plastic': items.filter(i => i.material === 'Plastic'),
          'Organic': items.filter(i => i.material === 'Organic')
        }
      : {
          'Edible': items.filter(i => i.edibility === 'Edible'),
          'Inedible': items.filter(i => i.edibility === 'Inedible')
        };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', padding: '1.25rem', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔍 Dynamic Classification Board
          </span>
          <div style={{ display: 'flex', gap: '0.2rem', background: 'var(--page-bg)', padding: '0.2rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setCriteria('material')}
              className="glass-btn"
              style={{
                padding: '0.25rem 0.55rem',
                fontSize: '0.72rem',
                borderRadius: '6px',
                border: 'none',
                background: criteria === 'material' ? 'var(--accent)' : 'transparent',
                color: criteria === 'material' ? '#fff' : 'var(--text-primary)'
              }}
            >
              By Material
            </button>
            <button
              onClick={() => setCriteria('edibility')}
              className="glass-btn"
              style={{
                padding: '0.25rem 0.55rem',
                fontSize: '0.72rem',
                borderRadius: '6px',
                border: 'none',
                background: criteria === 'edibility' ? 'var(--accent)' : 'transparent',
                color: criteria === 'edibility' ? '#fff' : 'var(--text-primary)'
              }}
            >
              By Edibility
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Object.keys(groups).map((groupName) => (
            <div key={groupName} style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.75rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
                📂 Group: {groupName}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {groups[groupName].map((item) => (
                  <div
                    key={item.name}
                    className="glass-panel"
                    style={{
                      background: 'var(--page-bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '0.4rem 0.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      flex: '1 1 120px'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{item.name}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function PlantVarietyMorpher() {
    const [stage, setStage] = useState(0);
    const [vineType, setVineType] = useState('creeper');

    const stages = [
      {
        title: '🌿 Herb',
        height: 'Short (usually < 1 meter)',
        stem: 'Soft, tender green stem. Easy to bend.',
        examples: 'Sadabahar, Grass, Coriander',
        color: '#10b981',
        bg: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(52,211,153,0.01) 100%)',
        desc: 'Short height, green stems, tender branches.',
        graphic: (
          <svg width="90" height="90" viewBox="0 0 100 100">
            <path d="M50,90 Q40,60 30,50 Q45,55 50,30 Q55,55 70,50 Q60,60 50,90" fill="#34d399" stroke="#059669" strokeWidth="2" />
            <line x1="50" y1="90" x2="50" y2="30" stroke="#059669" strokeWidth="2.5" />
            <circle cx="50" cy="30" r="3" fill="#fb7185" />
          </svg>
        )
      },
      {
        title: '🌺 Shrub',
        height: 'Medium (1 to 3 meters)',
        stem: 'Hard and thin woody stem branching near base.',
        examples: 'Rose, Lemon, Hibiscus',
        color: '#d97706',
        bg: 'linear-gradient(135deg, rgba(217,119,6,0.06) 0%, rgba(251,191,36,0.01) 100%)',
        desc: 'Branches start close to the ground; woody but thin stem.',
        graphic: (
          <svg width="90" height="90" viewBox="0 0 100 100">
            <line x1="50" y1="90" x2="50" y2="60" stroke="#78350f" strokeWidth="3" />
            <path d="M50,75 Q30,55 20,40" stroke="#78350f" strokeWidth="2" fill="none" />
            <path d="M50,75 Q70,55 80,40" stroke="#78350f" strokeWidth="2" fill="none" />
            <circle cx="20" cy="40" r="8" fill="#059669" fillOpacity="0.8" />
            <circle cx="80" cy="40" r="8" fill="#059669" fillOpacity="0.8" />
            <circle cx="50" cy="50" r="10" fill="#10b981" />
            <circle cx="50" cy="50" r="3" fill="#f43f5e" />
          </svg>
        )
      },
      {
        title: '🌳 Tree',
        height: 'Tall (usually > 3 meters)',
        stem: 'Thick, hard brown woody trunk branching high.',
        examples: 'Neem, Mango, Banyan',
        color: '#1e3a8a',
        bg: 'linear-gradient(135deg, rgba(30,58,138,0.06) 0%, rgba(59,130,246,0.01) 100%)',
        desc: 'Single solid trunk with branches starting high up.',
        graphic: (
          <svg width="90" height="90" viewBox="0 0 100 100">
            <rect x="45" y="50" width="10" height="40" fill="#451a03" />
            <circle cx="50" cy="30" r="20" fill="#047857" />
            <circle cx="35" cy="35" r="14" fill="#065f46" />
            <circle cx="65" cy="35" r="14" fill="#065f46" />
          </svg>
        )
      }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', padding: '1.25rem', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.02)' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🌱 Plant Growth Form Morpher
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', background: stages[stage].bg, border: `1px solid ${stages[stage].color}22` }}>
            <h4 style={{ margin: '0 0 0.35rem 0', color: stages[stage].color, fontSize: '0.9rem' }}>
              {stages[stage].title}
            </h4>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              <b>Height:</b> {stages[stage].height}
            </span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              <b>Stem:</b> {stages[stage].stem}
            </span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
              <b>Examples:</b> <i>{stages[stage].examples}</i>
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', background: '#fff', borderRadius: '12px', padding: '0.4rem', border: '1px solid var(--border)' }}>
            {stages[stage].graphic}
          </div>
        </div>

        {/* Morph Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <input 
            type="range" 
            min="0" 
            max="2" 
            value={stage} 
            onChange={(e) => setStage(parseInt(e.target.value))} 
            style={{ width: '100%', accentColor: stages[stage].color, cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
            <span style={{ color: stage === 0 ? 'var(--accent)' : 'inherit' }}>Herb</span>
            <span style={{ color: stage === 1 ? 'var(--accent)' : 'inherit' }}>Shrub</span>
            <span style={{ color: stage === 2 ? 'var(--accent)' : 'inherit' }}>Tree</span>
          </div>
        </div>

        {/* Weak Stems panel */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.65rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>
              🍂 Weak Stems (Climbers vs Creepers)
            </span>
            <div style={{ display: 'flex', gap: '0.2rem', background: 'var(--page-bg)', padding: '0.1rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <button
                onClick={() => setVineType('creeper')}
                className="glass-btn"
                style={{ padding: '0.15rem 0.4rem', fontSize: '0.68rem', borderRadius: '4px', background: vineType === 'creeper' ? 'var(--accent)' : 'transparent', color: vineType === 'creeper' ? '#fff' : 'var(--text-primary)' }}
              >
                Creeper
              </button>
              <button
                onClick={() => setVineType('climber')}
                className="glass-btn"
                style={{ padding: '0.15rem 0.4rem', fontSize: '0.68rem', borderRadius: '4px', background: vineType === 'climber' ? 'var(--accent)' : 'transparent', color: vineType === 'climber' ? '#fff' : 'var(--text-primary)' }}
              >
                Climber
              </button>
            </div>
          </div>

          <div style={{ padding: '0.6rem 0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.4)', border: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>{vineType === 'creeper' ? '🍉' : '🍇'}</span>
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: '0.75rem', color: 'var(--text-heading)', display: 'block' }}>
                {vineType === 'creeper' ? 'Creepers spread on ground' : 'Climbers climb up support'}
              </strong>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                {vineType === 'creeper' 
                  ? 'Weak-stemmed plants that crawl horizontally. E.g., Watermelon, Pumpkin.' 
                  : 'Weak-stemmed plants that climb walls or fences using tendrils. E.g., Pea plant, Grapes.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function VenationRootsCorrelationExplorer() {
    const [selectedLeaf, setSelectedLeaf] = useState(null);
    const [selectedRoot, setSelectedRoot] = useState(null);
    const [status, setStatus] = useState('');
    const [connections, setConnections] = useState({ reticulate: false, parallel: false });

    const handleMatch = (leaf, root) => {
      if (leaf === 'reticulate' && root === 'taproot') {
        setConnections(prev => ({ ...prev, reticulate: true }));
        setStatus('✅ Link Established: Reticulate leaf ⇄ Taproot system.');
        setSelectedLeaf(null);
        setSelectedRoot(null);
      } else if (leaf === 'parallel' && root === 'fibrous') {
        setConnections(prev => ({ ...prev, parallel: true }));
        setStatus('✅ Link Established: Parallel leaf ⇄ Fibrous root system.');
        setSelectedLeaf(null);
        setSelectedRoot(null);
      } else {
        setStatus('❌ Incorrect link! Parallel leaves do not correlate with taproots.');
      }
    };

    const selectLeaf = (id) => {
      setSelectedLeaf(id);
      if (selectedRoot) handleMatch(id, selectedRoot);
      else setStatus(`Leaf "${id}" selected. Tap its corresponding root system.`);
    };

    const selectRoot = (id) => {
      setSelectedRoot(id);
      if (selectedLeaf) handleMatch(selectedLeaf, id);
      else setStatus(`Root "${id}" selected. Tap its corresponding leaf venation.`);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', padding: '1.25rem', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.02)' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔗 Venation-Root Correlation Linker
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Leaves */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Venation</span>
            <button
              onClick={() => selectLeaf('reticulate')}
              className="glass-btn"
              style={{ padding: '0.6rem', borderRadius: '10px', border: connections.reticulate ? '1.5px solid var(--success)' : selectedLeaf === 'reticulate' ? '1.5px solid var(--accent)' : '1px solid var(--border)', background: 'var(--page-bg)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span style={{ fontSize: '1.25rem' }}>🕸️</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Reticulate</span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Net-like veins</span>
              </div>
            </button>
            <button
              onClick={() => selectLeaf('parallel')}
              className="glass-btn"
              style={{ padding: '0.6rem', borderRadius: '10px', border: connections.parallel ? '1.5px solid var(--success)' : selectedLeaf === 'parallel' ? '1.5px solid var(--accent)' : '1px solid var(--border)', background: 'var(--page-bg)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span style={{ fontSize: '1.25rem' }}>📏</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Parallel</span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Straight veins</span>
              </div>
            </button>
          </div>

          {/* Roots */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Root System</span>
            <button
              onClick={() => selectRoot('taproot')}
              className="glass-btn"
              style={{ padding: '0.6rem', borderRadius: '10px', border: connections.reticulate ? '1.5px solid var(--success)' : selectedRoot === 'taproot' ? '1.5px solid var(--accent)' : '1px solid var(--border)', background: 'var(--page-bg)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span style={{ fontSize: '1.25rem' }}>🥕</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Taproot</span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>One thick root</span>
              </div>
            </button>
            <button
              onClick={() => selectRoot('fibrous')}
              className="glass-btn"
              style={{ padding: '0.6rem', borderRadius: '10px', border: connections.parallel ? '1.5px solid var(--success)' : selectedRoot === 'fibrous' ? '1.5px solid var(--accent)' : '1px solid var(--border)', background: 'var(--page-bg)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span style={{ fontSize: '1.25rem' }}>🌾</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Fibrous</span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Bunches of fibers</span>
              </div>
            </button>
          </div>
        </div>

        {status && (
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'var(--page-bg)', border: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {status}
          </div>
        )}
      </div>
    );
  }

  function SeedDissector() {
    const [activeSeed, setActiveSeed] = useState('pea');
    const [coatRemoved, setCoatRemoved] = useState(false);
    const [seedSplit, setSeedSplit] = useState(false);
    const [status, setStatus] = useState('Select a seed and click "Peel Seed Coat".');

    const handleSelect = (id) => {
      setActiveSeed(id);
      setCoatRemoved(false);
      setSeedSplit(false);
      setStatus('Seed swapped. Open it up to inspect.');
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', padding: '1.25rem', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🥜 Interactive Seed Dissector
          </span>
          <div style={{ display: 'flex', gap: '0.2rem', background: 'var(--page-bg)', padding: '0.1rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <button
              onClick={() => handleSelect('pea')}
              className="glass-btn"
              style={{ padding: '0.15rem 0.4rem', fontSize: '0.68rem', borderRadius: '4px', background: activeSeed === 'pea' ? 'var(--accent)' : 'transparent', color: activeSeed === 'pea' ? '#fff' : 'var(--text-primary)' }}
            >
              Dicot (Gram)
            </button>
            <button
              onClick={() => handleSelect('maize')}
              className="glass-btn"
              style={{ padding: '0.15rem 0.4rem', fontSize: '0.68rem', borderRadius: '4px', background: activeSeed === 'maize' ? 'var(--accent)' : 'transparent', color: activeSeed === 'maize' ? '#fff' : 'var(--text-primary)' }}
            >
              Monocot (Maize)
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              disabled={coatRemoved}
              onClick={() => { setCoatRemoved(true); setStatus('Seed coat peeled! Now click "Split Seed" to look inside.'); }}
              className="glass-btn"
              style={{ padding: '0.45rem', fontSize: '0.75rem', fontWeight: 'bold', background: coatRemoved ? 'rgba(0,0,0,0.04)' : 'var(--page-bg)', border: '1px solid var(--border)', cursor: coatRemoved ? 'default' : 'pointer' }}
            >
              🔓 Peel Seed Coat
            </button>
            <button
              disabled={seedSplit}
              onClick={() => {
                if (!coatRemoved) {
                  setStatus('⚠️ Remove the outer seed coat first!');
                  return;
                }
                setSeedSplit(true);
                setStatus(activeSeed === 'pea' 
                  ? '🌱 Dicot splits cleanly into TWO food-storing cotyledons.' 
                  : '🚫 Monocot does not split. It has a single solid cotyledon.');
              }}
              className="glass-btn"
              style={{ padding: '0.45rem', fontSize: '0.75rem', fontWeight: 'bold', background: seedSplit ? 'rgba(0,0,0,0.04)' : 'var(--page-bg)', border: '1px solid var(--border)', cursor: seedSplit ? 'default' : 'pointer' }}
            >
              ✂️ Split Seed
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', background: '#fff', borderRadius: '12px', padding: '0.5rem', border: '1px solid var(--border)', height: '80px', alignItems: 'center' }}>
            {activeSeed === 'pea' ? (
              !coatRemoved ? <span style={{ fontSize: '2rem' }}>🫛</span> : !seedSplit ? <span style={{ fontSize: '2rem' }}>🧆</span> : <span style={{ fontSize: '2rem' }}>👐</span>
            ) : (
              !coatRemoved ? <span style={{ fontSize: '2rem' }}>🌽</span> : !seedSplit ? <span style={{ fontSize: '2rem' }}>🟡</span> : <span style={{ fontSize: '2rem' }}>☝️</span>
            )}
          </div>
        </div>

        <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'var(--page-bg)', border: '1px solid var(--border)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          {status}
        </div>
      </div>
    );
  }

  function AnimalLocomotionGrid() {
    const [selected, setSelected] = useState('fish');
    const [action, setAction] = useState('');
    const [result, setResult] = useState('Select an animal to inspect locomotion.');

    const data = {
      fish: { name: 'Fish', icon: '🐟', movement: 'swim', organ: 'Fins & tail', text: 'Uses flexible muscles & fins.' },
      pigeon: { name: 'Pigeon', icon: '🐦', movement: 'fly', organ: 'Wings & claws', text: 'Uses flight feathers to fly.' },
      goat: { name: 'Goat', icon: '🐐', movement: 'walk', organ: 'Four legs', text: 'Walks and runs on land.' },
      snail: { name: 'Snail', icon: '🐌', movement: 'crawl', organ: 'Muscular foot', text: 'Crawls slowly using a slide-foot.' }
    };

    const checkLocomotion = (moveType) => {
      setAction(moveType);
      const target = data[selected];
      if (target.movement === moveType) {
        setResult(`✅ Correct! ${target.name} uses ${target.organ} to ${moveType}. (${target.text})`);
      } else {
        setResult(`❌ Incorrect: ${target.name} does not move by ${moveType}ing.`);
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', padding: '1.25rem', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.02)' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🏃 Locomotion Organ Mapper
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
          {Object.keys(data).map(k => (
            <button
              key={k}
              onClick={() => { setSelected(k); setAction(''); setResult(`Selected ${data[k].name}. Select how it moves.`); }}
              className="glass-btn"
              style={{ padding: '0.5rem', borderRadius: '10px', border: selected === k ? '1.5px solid var(--accent)' : '1px solid var(--border)', background: 'var(--page-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <span style={{ fontSize: '1.5rem' }}>{data[k].icon}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{data[k].name}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
          {['walk', 'fly', 'swim', 'crawl'].map(a => (
            <button
              key={a}
              onClick={() => checkLocomotion(a)}
              className="glass-btn"
              style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem', textTransform: 'capitalize', background: action === a ? 'rgba(99,102,241,0.06)' : 'var(--page-bg)', border: '1px solid var(--border)' }}
            >
              {a}
            </button>
          ))}
        </div>

        <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'var(--page-bg)', border: '1px solid var(--border)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          {result}
        </div>
      </div>
    );
  }

  function AdaptationClimator() {
    const [tab, setTab] = useState('hot');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', padding: '1.25rem', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🗺️ Survival Adaptations Dashboard
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.2rem', overflowX: 'auto' }}>
          {['hot', 'cold', 'mountain', 'pioneers'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="glass-btn"
              style={{ padding: '0.25rem 0.45rem', borderRadius: '5px', fontSize: '0.68rem', background: tab === t ? 'var(--accent)' : 'var(--page-bg)', color: tab === t ? '#fff' : 'var(--text-primary)' }}
            >
              {t === 'hot' ? 'Hot Desert' : t === 'cold' ? 'Cold Desert' : t === 'mountain' ? 'Mountain' : 'Groves/Pioneers'}
            </button>
          ))}
        </div>

        {tab === 'hot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.72rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)' }}>
              <b>🐪 Rajasthan Camel:</b> Long legs (keeps body above hot sand), wide padded hooves, stores fat in its hump.
            </div>
            <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)' }}>
              <b>🌵 Cactus:</b> Stem becomes fleshy/green to perform photosynthesis and store water. Leaves turn to spines.
            </div>
          </div>
        )}

        {tab === 'cold' && (
          <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.1)', fontSize: '0.72rem' }}>
            <b>🐫 Ladakh Camel:</b> Two humps, short study limbs to scale mountain paths, shaggy thick woolly hair coat for sub-zero climate.
          </div>
        )}

        {tab === 'mountain' && (
          <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)', fontSize: '0.72rem' }}>
            <b>🌲 Mountain Pine/Deodar:</b> Sloping branches let snow slide off. Conical shape and needle-thin leaves protect against frost.
          </div>
        )}

        {tab === 'pioneers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--page-bg)', border: '1px solid var(--border)' }}>
              • <b>Dr. Salim Ali:</b> India\'s Birdman, mapped ornithological habitats.
            </div>
            <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--page-bg)', border: '1px solid var(--border)' }}>
              • <b>Project Tiger (1973):</b> Landmark preservation scheme for national tiger populations.
            </div>
            <div style={{ padding: '0.4rem', borderRadius: '6px', background: 'var(--page-bg)', border: '1px solid var(--border)' }}>
              • <b>Sacred Groves:</b> Local community forest reserves where woodcutting is banned.
            </div>
          </div>
        )}
      </div>
    );
  }

  const renderLessonPaneInline = (lessonId) => {
    const lesson = contentLessonsData[lessonId];
    if (!lesson) return (
      <div style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Lesson is unavailable. Please select another section.
      </div>
    );
    const totalSlides = lesson.slides.length;
    const currentSlideIndex = Math.min(activeSlide, Math.max(0, totalSlides - 1));
    const slide = lesson.slides[currentSlideIndex];
    const isLastSlide = currentSlideIndex === totalSlides - 1;

    return (
      <div className="split-frame" style={{ width: '100%', minHeight: '520px' }}>
        {/* LEFT COLUMN: Concept text & slideshow buttons */}
        <div className="frame-page-left">
          <div className="textbook-eyebrow">{activeLevel.title}</div>
          <h1 className="textbook-title" style={{ fontFamily: 'var(--serif-font)', margin: '0 0 1rem 0', fontSize: '1.4rem' }}>
            {slide.title}
          </h1>
          
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
            {slide.content}
          </p>

          {slide.bullets && (
            <ul style={{ margin: '0 0 1.5rem 0', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {slide.bullets.map((b, i) => (
                <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {b}
                </li>
              ))}
            </ul>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                onClick={() => handleReadAloud(`${slide.title}. ${slide.content || ''}. ${slide.bullets ? slide.bullets.join('. ') : ''}`)}
                className="outline"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: '6px' }}
              >
                🔊 Read
              </button>
              <button
                onClick={handleStopSpeech}
                className="outline"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', borderRadius: '6px' }}
              >
                Stop
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '0.25rem' }}>
                Slide {currentSlideIndex + 1} of {totalSlides}
              </span>
              {currentSlideIndex > 0 && (
                <button
                  onClick={() => { handleStopSpeech(); setActiveSlide(prev => Math.max(0, prev - 1)); }}
                  className="outline"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '6px' }}
                >
                  Prev
                </button>
              )}
              {isLastSlide ? (
                <button
                  disabled={slide.isQuiz && !quizChecked}
                  onClick={() => {
                    setContentLessonProgress(prev => ({ ...prev, [lessonId]: true }));
                    const activityPaneEl = document.getElementById("pane-activity-window");
                    if (activityPaneEl) {
                      activityPaneEl.scrollIntoView({ behavior: 'smooth' });
                    }
                    setActivityFocused(true);
                  }}
                  className="primary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '6px' }}
                >
                  Activity ➔
                </button>
              ) : (
                <button
                  disabled={slide.isQuiz && !quizChecked}
                  onClick={() => { handleStopSpeech(); setActiveSlide(prev => prev + 1); }}
                  className="primary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '6px' }}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Sandbox or Fallbacks */}
        <div className="frame-page-right" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, justifyContent: 'center', background: 'transparent', border: 'none', padding: '0' }}>
          {lessonId === 'grouping_basics_concept' ? (
            <GroupingBasicsInteractive />
          ) : lessonId === 'plant_variety_concept' ? (
            <PlantVarietyMorpher />
          ) : lessonId === 'venation_roots_concept' ? (
            <VenationRootsCorrelationExplorer />
          ) : lessonId === 'cotyledons_concept' ? (
            <SeedDissector />
          ) : lessonId === 'grouping_animals_concept' ? (
            <AnimalLocomotionGrid />
          ) : lessonId === 'adaptations_concept' ? (
            <AdaptationClimator />
          ) : slide.svg ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', justifyContent: 'center', width: '100%', padding: '2rem 1.25rem', background: 'var(--card-bg)', borderRadius: '20px', boxShadow: '0 18px 40px rgba(14, 42, 69, 0.08)' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Visual Illustration
              </span>
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '640px', gap: '2rem' }}>
                {slide.svg === 'venation' && (
                  <div style={{ display: 'flex', gap: '2rem', width: '100%', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', width: '100%' }}>
                      <svg width="140" height="140" viewBox="0 0 100 100">
                        <path d="M50,10 C80,30 80,70 50,90 C20,70 20,30 50,10 Z" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="2.5"/>
                        <line x1="50" y1="10" x2="50" y2="90" stroke="#047857" strokeWidth="3"/>
                      </svg>
                      <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-heading)', fontWeight: 'bold', marginTop: '4px' }}>Reticulate</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <svg width="90" height="90" viewBox="0 0 100 100">
                        <path d="M50,10 C65,30 65,80 50,95 C35,80 35,30 50,10 Z" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="2.5"/>
                        <line x1="50" y1="10" x2="50" y2="95" stroke="#047857" strokeWidth="2.5"/>
                      </svg>
                      <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-heading)', fontWeight: 'bold', marginTop: '4px' }}>Parallel</span>
                    </div>
                  </div>
                )}
                {slide.svg === 'roots' && (
                  <div style={{ display: 'flex', gap: '2rem', width: '100%', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', width: '100%' }}>
                      <svg width="90" height="90" viewBox="0 0 100 100">
                        <line x1="10" y1="20" x2="90" y2="20" stroke="var(--border)" strokeWidth="2.5"/>
                        <path d="M50,20 C53,40 52,70 50,90 C48,70 47,40 50,20 Z" fill="#d97706" stroke="#b45309" strokeWidth="2.5"/>
                      </svg>
                      <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-heading)', fontWeight: 'bold', marginTop: '4px' }}>Taproot</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <svg width="90" height="90" viewBox="0 0 100 100">
                        <line x1="10" y1="20" x2="90" y2="20" stroke="var(--border)" strokeWidth="2.5"/>
                        <path d="M50,20 Q60,40 55,85 M50,20 Q40,40 45,85 M50,20 Q45,50 65,80" stroke="#b45309" strokeWidth="2" fill="none"/>
                      </svg>
                      <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-heading)', fontWeight: 'bold', marginTop: '4px' }}>Fibrous Root</span>
                    </div>
                  </div>
                )}
                {slide.svg === 'correlation' && (
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.25rem' }}>🕸️ ⇄ 🥕</span>
                      <span style={{ fontSize: '1.25rem' }}>📏 ⇄ 🌾</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-heading)', fontWeight: 'bold' }}>Venation &amp; Roots Correlation</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '3rem' }}>📖</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>
                Takeaway Summary
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '240px' }}>
                Carefully read the left details before continuing to the lab exercises.
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main navigation / layout stages
  if (stage === "cover") {
    return (
      <CoverPage
        classNum={classNum}
        subjectName={subjectName}
        chapterNum={chapterNum}
        title={chapterTitle}
        topics={topics}
        coverGraphic={coverGraphic}
        onBack={onBack}
        onNext={handleNextToSlogan}
      />
    );
  }

  if (stage === "slogan") {
    return (
      <SloganPage
        chapterNum={chapterNum}
        title={chapterTitle}
        sloganImg={sloganImg}
        sloganExplanation={sloganExplanation}
        onBack={handleBackToCover}
        onEnterLab={handleEnterLab}
      />
    );
  }

  // Stage: lab
  if (activeContentLesson) {
    if (activeContentLesson === 'biodiversity_concept') {
      return (
        <IntroductionMindMap 
          onBackToDashboard={(completed) => {
            if (completed) {
              setContentLessonProgress(prev => ({ ...prev, [activeContentLesson]: true }));
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
            if (completed) {
              setContentLessonProgress(prev => ({ ...prev, [activeContentLesson]: true }));
            }
            setActiveContentLesson(null);
          }}
        />
      );
    }
    return renderFullscreenLessonView();
  }

  if (activeActivitySectionId) {
    const activeSection = sections.find(s => s.id === activeActivitySectionId);
    if (activeSection) {
      if (activeSection.activityId) {
        return renderCustomSandbox(activeSection.activityId, (completed) => {
          setActivityStatus(prev => ({ ...prev, [activeSection.id]: 'done' }));
          setActiveActivitySectionId(null);
        });
      } else {
        return (
          <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100vw",
            height: "100dvh",
            background: "var(--page-bg)",
            color: "var(--text-primary)"
          }}>
            {/* Header bar for standard page iframe */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem 2rem",
              borderBottom: "1px solid var(--border)",
              background: "var(--card-bg)"
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Standard Textbook Page
                </span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: "var(--text-heading)" }}>{activeSection.title}</h3>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={() => {
                    setActivityStatus(prev => ({ 
                      ...prev, 
                      [activeSection.id]: prev[activeSection.id] === 'done' ? 'none' : 'done' 
                    }));
                  }}
                  className="outline"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: activityStatus[activeSection.id] === 'done' ? 'var(--success)' : 'var(--text-primary)',
                    borderColor: activityStatus[activeSection.id] === 'done' ? 'var(--success)' : 'var(--border)',
                  }}
                >
                  {activityStatus[activeSection.id] === 'done' ? '✓ Done' : 'Mark Done'}
                </button>
                <button
                  onClick={() => setActiveActivitySectionId(null)}
                  className="primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Back to Map
                </button>
              </div>
            </div>
            <iframe
              src={activeSection.path}
              title={activeSection.title}
              style={{
                flex: 1,
                width: "100%",
                border: "none",
                background: "#ffffff"
              }}
            />
          </div>
        );
      }
    }
  }

  // Dashboard Map + Split Timeline View
  if (chapterNum === 2 && stage === 'lab') {
    // Calculate progress ring variables
    const progressItems = [
      { id: 'sec-2-1-act' }, { id: 'sec-2-1-act-2' }, { id: 'sec-2-2-act' }, { id: 'sec-2-3-act' },
      { id: 'sec-2-4-act' }, { id: 'sec-2-5-act' }, { id: 'sec-2-6-act' }, { id: 'sec-2-7-act' },
      { id: 'sec-2-8-act' }, { id: 'sec-2-9-act' }, { id: 'sec-2-10-act' }, { id: 'sec-2-11-act' },
      { id: 'sec-2-12-act' }, { id: 'sec-2-13-act' }, { id: 'sec-2-14-act' }
    ];
    const completedActCount = progressItems.filter(item => activityStatus[item.id] === 'done').length;
    const totalActCount = progressItems.length;
    const pctVal = Math.round((completedActCount / totalActCount) * 100);
    const strokeDashoffset = 169.6 - (169.6 * pctVal) / 100;

    // Controls
    const handlePrevControl = () => {
      setActivityFocused(false);
      if (activeLevel.lessonId === 'vocabulary_glossary' || activeLevel.lessonId === 'chapter_challenge_overview') {
        setActiveLevelId(CHAPTER_2_LEVELS[activeLevelIdx - 1].id);
        setActiveActivityIdx(0);
        setActiveSlide(0);
        setQuizAnswers({});
        setQuizChecked(false);
        return;
      }
      const lesson = contentLessonsData[activeLevel.lessonId];
      if (activeSlide > 0) {
        setActiveSlide(prev => prev - 1);
        setQuizAnswers({});
        setQuizChecked(false);
      } else if (activeActivityIdx > 0) {
        setActiveActivityIdx(prev => prev - 1);
      } else if (activeLevelIdx > 0) {
        setActiveLevelId(CHAPTER_2_LEVELS[activeLevelIdx - 1].id);
        const prevLevel = CHAPTER_2_LEVELS[activeLevelIdx - 1];
        setActiveActivityIdx(Math.max(0, prevLevel.activities.length - 1));
        setActiveSlide(0);
        setQuizAnswers({});
        setQuizChecked(false);
      }
    };

    const isNextDisabled = () => {
      if (activeLevelIdx === totalLevels - 1 && activeActivityIdx === activeLevel.activities.length - 1) {
        return true;
      }
      if (activeActivity && activityStatus[activeActivity.id] !== 'done') {
        return true;
      }
      const hasQuiz = LEVEL_QUIZZES[activeLevel.lessonId];
      if (hasQuiz && !quizChecked) {
        return true;
      }
      return false;
    };

    const handleNextControl = () => {
      if (activeLevel.lessonId === 'vocabulary_glossary' || activeLevel.lessonId === 'chapter_challenge_overview') {
        if (activeLevelIdx < totalLevels - 1) {
          setActivityFocused(null);
          setActiveLevelId(CHAPTER_2_LEVELS[activeLevelIdx + 1].id);
          setActiveActivityIdx(0);
          setActiveSlide(0);
          setQuizAnswers({});
          setQuizChecked(false);
        }
        return;
      }
      const lesson = contentLessonsData[activeLevel.lessonId];
      const totalSlides = lesson ? lesson.slides.length : 1;
      
      if (activeSlide < totalSlides - 1) {
        setActiveSlide(prev => prev + 1);
        setQuizAnswers({});
        setQuizChecked(false);
      } else if (activeActivityIdx === 0 && activeLevel.activities.length > 0 && !activityFocused) {
        const activityPaneEl = document.getElementById("pane-activity-window");
        if (activityPaneEl) {
          activityPaneEl.scrollIntoView({ behavior: 'smooth' });
        }
        setActivityFocused(true);
        setActiveActivityIdx(0);
      } else if (activeActivityIdx < activeLevel.activities.length - 1) {
        setActiveActivityIdx(prev => prev + 1);
      } else if (activeLevelIdx < totalLevels - 1) {
        // Safety validation before jumping to next level
        if (activeActivity) {
          const isCurrentCompleted = activityStatus[activeActivity.id] === 'done';
          if (!isCurrentCompleted) {
            alert("Please complete the current activity and mark it as Done before proceeding to the next level!");
            return;
          }
        }
        setActivityFocused(null);
        setActiveLevelId(CHAPTER_2_LEVELS[activeLevelIdx + 1].id);
        setActiveActivityIdx(0);
        setActiveSlide(0);
        setQuizAnswers({});
        setQuizChecked(false);
      }
    };

    return (
      <div style={isFullscreen ? {
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        background: 'var(--page-bg)',
        zIndex: 99999,
        overflowY: 'auto',
        overflowX: 'hidden',
        boxSizing: 'border-box'
      } : {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <style>{`
          .glass-btn {
            background: var(--card-bg);
            border: 1px solid var(--border);
            color: var(--text-primary);
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            transition: all 0.2s ease;
          }
          .glass-btn:hover:not(:disabled) {
            border-color: var(--accent);
            background: rgba(99, 102, 241, 0.05);
          }
          .glass-btn:disabled {
            opacity: 0.35;
            cursor: not-allowed;
          }
          .glass-btn.primary {
            background: var(--accent);
            border-color: var(--accent);
            color: #fff;
          }
          .glass-btn.primary:hover:not(:disabled) {
            background: var(--accent-hover, #4f46e5);
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.4);
          }
          .ring-container {
            position: relative;
            width: 50px;
            height: 50px;
            flex-shrink: 0;
          }
          .ring-container svg {
            transform: rotate(-90deg);
          }
          .ring-text {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.72rem;
            font-weight: bold;
            color: var(--success);
          }
        `}</style>

        {/* Master stats & control header (Sticky when not in fullscreen) */}
        {!isFullscreen && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '1rem',
            paddingTop: '0.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
            position: 'sticky',
            top: 0,
            background: 'var(--page-bg)',
            zIndex: 110
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button onClick={handleExitLab} className="glass-btn">
                <ArrowLeft size={14} /> Exit Chapter
              </button>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', color: "var(--text-heading)" }}>
                  Chapter {chapterNum}: {chapterTitle}
                </h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grouped Lessons & Lab Activities</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {/* Mastery ring stats */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="ring-container">
                  <svg width="50" height="50" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="27" fill="none" stroke="var(--border)" strokeWidth="6" />
                    <circle 
                      cx="32" cy="32" r="27" 
                      fill="none" 
                      stroke="var(--success)" 
                      strokeWidth="6" 
                      strokeLinecap="round" 
                      strokeDasharray="169.6" 
                      strokeDashoffset={strokeDashoffset} 
                      style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                    />
                  </svg>
                  <div className="ring-text">{pctVal}%</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>
                    {completedActCount} of {totalActCount} done
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Chapter Mastery
                  </span>
                </div>
              </div>

              {/* Navigation buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={handlePrevControl} 
                  disabled={activeLevelIdx === 0 && activeSlide === 0 && activeActivityIdx === 0}
                  className="glass-btn"
                >
                  ‹ Prev
                </button>
                <button 
                  onClick={handleNextControl}
                  disabled={isNextDisabled()}
                  className="glass-btn"
                >
                  Next ›
                </button>
                {activeActivity && (
                  <button
                    onClick={() => {
                      setActivityStatus(prev => ({
                        ...prev,
                        [activeActivity.id]: prev[activeActivity.id] === 'done' ? 'none' : 'done'
                      }));
                    }}
                    className="glass-btn"
                    style={{ color: isCompleted ? 'var(--success)' : 'inherit', borderColor: isCompleted ? 'var(--success)' : 'var(--border)' }}
                  >
                    {isCompleted ? '✓ Done' : 'Mark Done'}
                  </button>
                )}
                <button 
                  onClick={() => {
                    setIsFullscreen(true);
                    setActivityFocused(null);
                  }}
                  className="glass-btn primary"
                >
                  Open Fullscreen ↗
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating controls in Fullscreen Mode */}
        {isFullscreen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
            padding: '0.85rem 1rem',
            background: 'var(--page-bg)',
            borderBottom: '1px solid var(--border)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            zIndex: 10000
          }}>
            <button 
              onClick={handlePrevControl} 
              disabled={activeLevelIdx === 0 && activeSlide === 0 && activeActivityIdx === 0}
              className="glass-btn"
            >
              ‹ Prev
            </button>
            <button 
              onClick={handleNextControl}
              disabled={isNextDisabled()}
              className="glass-btn"
            >
              Next ›
            </button>
            {activeActivity && (
              <button
                onClick={() => {
                  setActivityStatus(prev => ({
                    ...prev,
                    [activeActivity.id]: prev[activeActivity.id] === 'done' ? 'none' : 'done'
                  }));
                }}
                className="glass-btn"
                style={{ color: isCompleted ? 'var(--success)' : 'inherit', borderColor: isCompleted ? 'var(--success)' : 'var(--border)' }}
              >
                {isCompleted ? '✓ Done' : 'Mark Done'}
              </button>
            )}
            <button 
              onClick={() => setIsFullscreen(false)}
              className="glass-btn primary"
            >
              Exit Fullscreen ↙
            </button>
          </div>
        )}

        {/* Side-by-side workspace split */}
        <div style={{ display: 'flex', gap: '1.5rem', width: '100%', alignItems: 'flex-start', boxSizing: 'border-box', paddingTop: isFullscreen ? '5.2rem' : 0 }}>
          
          {/* Level map on left (hidden in fullscreen) */}
          {!isFullscreen && (
            <VerticalLevelMap 
              sections={CHAPTER_2_LEVELS.map(lvl => ({
                id: lvl.id,
                title: lvl.title,
                isCompleted: isLevelCompleted(lvl)
              }))}
              activeSectionId={activeLevelId}
              onSelectNode={(nodeId) => {
                setActiveLevelId(nodeId);
                setActiveActivityIdx(0);
                setActiveSlide(0);
                setActivityFocused(false);
              }}
            />
          )}

          {/* Combined Lesson & Activity Panel on right */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', boxSizing: 'border-box' }}>
            {isFullscreen && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', padding: '0 0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Fullscreen Focus
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {activeLevel.title}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {activeLevel.activities.length > 0 && (
                    <button
                      onClick={() => setActivityFocused(prev => prev === true ? null : true)}
                      className="glass-btn"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {activityFocused === true ? 'Show Both' : 'Focus Activity'}
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {/* 1. TOP PANE: Interactive Lesson Window */}
            <div id="pane-lesson-window" className="glass-panel" style={{ display: (!isFullscreen || activityFocused !== true) ? 'flex' : 'none', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Lesson Pane
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Level {activeLevelIdx + 1} of {totalLevels}
                </span>
              </div>

              {activeLevel.lessonId === 'biodiversity_concept' ? (
                <IntroStoryteller 
                  onComplete={() => {
                    setContentLessonProgress(prev => ({ ...prev, biodiversity_concept: true }));
                    const activityPaneEl = document.getElementById("pane-activity-window");
                    if (activityPaneEl) {
                      activityPaneEl.scrollIntoView({ behavior: 'smooth' });
                    }
                    setActivityFocused(true);
                  }} 
                />
              ) : activeLevel.lessonId === 'vocabulary_glossary' ? (
                <VocabularyGlossary 
                  onMatchComplete={() => {
                    setContentLessonProgress(prev => ({ ...prev, vocabulary_glossary: true }));
                  }}
                />
              ) : activeLevel.lessonId === 'chapter_challenge_overview' ? (
                <ChapterChallengeOverview />
              ) : (
                renderLessonPaneInline(activeLevel.lessonId)
              )}
            </div>

            {/* 2. MIDDLE PANE: Full Interactive Activity Window */}
            {activeLevel.activities && activeLevel.activities.length > 0 && (
              <div id="pane-activity-window" className="glass-panel" style={{ display: (!isFullscreen || activityFocused !== false) ? 'flex' : 'none', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isCompleted ? 'var(--success)' : 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Activity Pane {activeActivity.pg && `(${activeActivity.pg})`}
                  </span>
                  {activeLevel.activities.length > 1 && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {activeLevel.activities.map((act, aIdx) => {
                        let btnLabel = `${aIdx + 1}`;
                        if (activeLevel.id === 'lvl-1') {
                          btnLabel = aIdx === 0 ? '🌿 Plants Walk' : '🐾 Animals Walk';
                        } else {
                          const parts = act.title.split(' — ');
                          if (parts[1]) {
                            btnLabel = parts[1];
                          } else {
                            const subparts = act.title.split(': ');
                            if (subparts[1]) btnLabel = subparts[1];
                          }
                        }
                        return (
                          <button
                            key={act.id}
                            onClick={() => {
                              setActiveActivityIdx(aIdx);
                              setActivityFocused(true);
                            }}
                            className={`glass-btn ${activeActivityIdx === aIdx ? 'primary' : ''}`}
                            style={{ 
                              padding: '0.5rem 1rem', 
                              fontSize: '0.85rem', 
                              borderRadius: '8px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              boxShadow: activeActivityIdx === aIdx ? '0 4px 12px rgba(99,102,241,0.25)' : 'none'
                            }}
                          >
                            {btnLabel}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--card-bg)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-heading)' }}>
                    {activeActivity.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0' }}>
                    {activeActivity.desc}
                  </p>

                  <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', background: 'var(--surface)', position: 'relative' }}>
                    {activeActivity.activityId ? (
                      renderCustomSandbox(activeActivity.activityId, (completed) => {
                        setActivityStatus(prev => ({ ...prev, [activeActivity.id]: 'done' }));
                        confetti({ particleCount: 60, spread: 60, origin: { y: 0.75 } });
                      })
                    ) : (
                      <iframe 
                        src={activeActivity.path}
                        title={activeActivity.title}
                        style={{
                          width: '100%',
                          height: '600px',
                          border: 'none',
                          background: 'var(--surface)'
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. BOTTOM PANE: Quiz & DYK Pane */}
            <div style={{ display: (!isFullscreen || activityFocused !== true) ? 'flex' : 'none', flexDirection: 'column', gap: '0.75rem' }}>
              {renderQuizAndDykPane(activeLevel.lessonId)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', width: '100%', boxSizing: 'border-box' }}>
      <style>{`
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

      {/* Lab Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={handleExitLab}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Slogan Page
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: "var(--text-heading)" }}>Chapter {chapterNum}: {chapterTitle}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Learning Map & Lab Activities</span>
        </div>
      </div>

      {/* Map & Timeline Side-by-Side */}
      <div style={{ display: 'flex', gap: '2rem', width: '100%', alignItems: 'flex-start', boxSizing: 'border-box' }}>
        
        {/* Winding road Level Map on the left */}
        <VerticalLevelMap 
          sections={sections.map(sec => ({
            ...sec,
            isCompleted: sec.type === 'content' 
              ? !!contentLessonProgress[sec.lessonId]
              : activityStatus[sec.id] === 'done'
          }))}
          activeSectionId={activeSectionId}
        />

        {/* Scrollable list of activities on the right */}
        <div ref={timelineContainerRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative' }}>
          
          {/* Active section pointer glow circle */}
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
            const isCompleted = isContent 
              ? !!contentLessonProgress[sec.lessonId]
              : activityStatus[sec.id] === 'done';

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
                
                <div className="timeline-node" style={{
                  background: isCompleted ? 'var(--success)' : 'var(--accent)',
                  boxShadow: isCompleted ? '0 0 0 2px var(--success)' : '0 0 0 2px var(--accent)'
                }}>{idx + 1}</div>
                
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
                      📖 {isCompleted ? 'Review Concept Lesson ✓' : 'Open Concept Lesson'}
                    </button>
                  </div>
                ) : (
                  <div className="glass-panel" style={{ 
                    flex: 1, 
                    padding: '1.5rem', 
                    border: isCompleted ? '1px solid var(--success-border)' : '1px solid var(--border)',
                    background: isCompleted 
                      ? 'linear-gradient(to bottom right, var(--card-bg), rgba(16, 185, 129, 0.05))' 
                      : 'var(--card-bg)' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: isCompleted ? 'var(--success)' : 'var(--accent)', textTransform: 'uppercase' }}>
                        Curriculum Lab Activity {sec.pg && `(${sec.pg})`}
                      </span>
                      {isCompleted && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 'bold' }}>✓ Done</span>
                      )}
                    </div>
                    <h3 style={{ margin: '0.25rem 0 0.75rem 0', fontSize: '1.25rem', color: 'var(--text-heading)' }}>
                      {sec.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                      {sec.desc || 'Explore hands-on activities and interactive simulation checkouts.'}
                    </p>
                    <button
                      onClick={() => setActiveActivitySectionId(sec.id)}
                      className="primary"
                      style={{ 
                        gap: '0.35rem', 
                        fontSize: '0.8rem', 
                        padding: '0.5rem 1rem',
                        background: isCompleted ? 'var(--success)' : 'var(--accent)'
                      }}
                    >
                      <Play size={12} fill="#ffffff" /> {isCompleted ? 'Reopen Activity' : 'Open Lab Activity'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
