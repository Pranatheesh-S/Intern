import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Play, X, ChevronLeft, ChevronRight, Volume2, VolumeX, RefreshCw, Check } from "lucide-react";
import CoverPage from "./CoverPage";
import SloganPage from "./SloganPage";
import VerticalLevelMap from "./VerticalLevelMap";
import confetti from "canvas-confetti";
import { voiceService } from "../services/elevenLabsService";

import creeperImg from "../assets/creeper.jpeg";
import climberImg from "../assets/climber.jpeg";
import scientist1Img from "../assets/Scientist1.jpeg";
import scientist2Img from "../assets/Scientist2.jpeg";
import silentValleyImg from "../assets/silent_valley.jpeg";
import protectWildlifeImg from "../assets/protect_wildlife.jpeg";
import sacredGrovesImg from "../assets/sacred_grove.png";
import darkForestBg from "../assets/dark_forest_bg.jpg";
import completedCh2Bg from "../assets/2_completed.png";
import dicotLeafImg from "../assets/dicot_leaf.png";
import monocotLeafImg from "../assets/monocot_leaf.png";
import taprootImg from "../assets/taproot.png";
import fibrousImg from "../assets/fibrousroot.png";
import dicot1Img from "../assets/dicot_1.png";
import dicot2Img from "../assets/dicot_2.png";
import dicot3Img from "../assets/dicot_3.png";
import monocot1Img from "../assets/monocot_1.png";
import monocot2Img from "../assets/monocot_2.png";
import monocot3Img from "../assets/monocot_3.png";
import herbTulsiImg from "../assets/tulsi_2.4.png";
import shrubHibiscusImg from "../assets/hib_1.png";
import tree1Img from "../assets/tree_1.png";
import treeCanopyImg from "../assets/wildlife/tree_canopy.jpg";
import spiderMonkeyImg from "../assets/wildlife/spider_monkey.jpg";
import chickpeaSplitImg from "../assets/chickpea_split.png";
import maizeCutImg from "../assets/maize_cut.png";
import scaredImg from "../assets/scared.png";
import sce5Img from "../assets/sce_5.png";

// Context
import { useTheme } from "../ThemeContext";

// Content Lessons (Class 6 Chapter 2)


// Activities (Class 6 Chapter 2 & 3)
import VirtualBiodiversityExplorerActivity from "../science/class6/chapter2/VirtualBiodiversityExplorer";
import AppreciatingBiodiversityActivity from "../science/class6/chapter2/AppreciatingBiodiversityActivity";
import InlineSortingActivity from "../science/class6/chapter2/InlineSortingActivity";
import PlantDetectiveActivity from "../science/class6/chapter2/PlantDetective";
import LeafVenationLab from "../science/class6/chapter2/LeafVenationLab";
import RootSystemsLab from "../science/class6/chapter2/RootSystemsLab";
import VenationRootCorrelationLab from "../science/class6/chapter2/VenationRootCorrelationLab";
import SeedDissectionLab from "../science/class6/chapter2/SeedDissectionLab";
import AnimalHabitatExplorerActivity from "../science/class6/chapter2/AnimalHabitatExplorer";
import FoodTestingActivity from "../science/class6/chapter3/FoodTesting";
import FatTestingActivity from "../science/class6/chapter3/FatTesting";
import ProteinTestingActivity from "../science/class6/chapter3/ProteinTesting";

import fishImg from "../assets/golden_masheer.png";
import pigeonImg from "../assets/pigeon.png";
import snailImg from "../assets/snail.png";
import cowImg from "../assets/brown_cow.png";
import tulsiImg from "../assets/specimens/tulsi.png";
import roseImg from "../assets/specimens/rose.png";
import mangoImg from "../assets/specimens/mango.png";
import banyanImg from "../assets/specimens/banyan.png";

const LEVEL_QUIZZES = {
  'biodiversity_concept': [
    {
      q: 'Who led the students on the school garden nature walk?',
      opts: [
        'Dr. Raghu and Maniram chacha',
        'The school Principal',
        'A forest ranger'
      ],
      correct: 0,
      explanation: '• During the nature walk described in the textbook, the students were accompanied by their science teacher, Dr. Raghu.\n• They were also accompanied by the school gardener, Maniram chacha.\n• Maniram chacha helped guide the students by mimicking various bird calls and showing them the plant life.'
    },
    {
      q: 'What tables are used to record observations of plants and animals respectively?',
      opts: [
        'Table 1.1 and 1.2',
        'Table 2.1 and 2.2',
        'Table 3.1 and 3.2'
      ],
      correct: 1,
      explanation: '• According to the textbook activities for Chapter 2, the observations are organized into specific tables.\n• Table 2.1 is designated for recording observations of plants (stems, leaves, etc.).\n• Table 2.2 is designated for recording observations of animals (where they are found, how they move).'
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
      correct: 2,
      explanation: '• Shrubs are medium-sized woody plants that typically branch out near the soil level.\n• Their stems are hard but relatively thin compared to the trunks of large trees.\n• Common textbook examples of shrubs include Rose, Hibiscus, and Lemon plants.'
    },
    {
      q: 'Watermelon plants spread horizontally along the soil. They are classified as:',
      opts: [
        'Climbers',
        'Creepers',
        'Trees'
      ],
      correct: 1,
      explanation: '• Watermelon plants have very weak, soft green stems that cannot support the weight of the plant or its heavy fruit upright.\n• As a result, they spread horizontally across the ground and are classified as Creepers.\n• Unlike Climbers, they do not wrap around supports to climb upward.'
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
      correct: 1,
      explanation: '• Reticulate venation features a net-like vein structure branching on both sides of a central midrib.\n• In nature, plants with reticulate venation are strongly correlated with the Taproot system.\n• A Taproot system consists of one thick main root growing deep vertically, with smaller side branches.'
    },
    {
      q: 'Which of the following leaf-root pairs matches Grass?',
      opts: [
        'Parallel Venation and Fibrous Roots',
        'Reticulate Venation and Taproots',
        'Parallel Venation and Taproots'
      ],
      correct: 0,
      explanation: '• Grass is a monocot plant with long, narrow leaves whose veins run parallel from base to tip (Parallel Venation).\n• Grass roots form a dense cluster of thin, equal-sized roots arising from the base of the stem (Fibrous Roots).\n• This venation-root correlation is a universal rule for grass and related monocot species.'
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
      correct: 1,
      explanation: '• Chickpea seeds can easily be split apart into two equal halves, which are the seed leaves or cotyledons.\n• Plants with two cotyledons are called dicotyledonous or Dicots.\n• Dicots typically have reticulate leaf venation and taproots.'
    },
    {
      q: 'A plant with parallel leaf venation and fibrous roots is expected to have seeds with:',
      opts: [
        'One cotyledon (Monocot)',
        'Two cotyledons (Dicot)',
        'No cotyledons'
      ],
      correct: 0,
      explanation: '• Monocotyledonous plants (Monocots) possess exactly one cotyledon in their seeds.\n• This cotyledon count is universally correlated with parallel leaf venation and fibrous root systems.\n• Examples include wheat, maize, rice, and grass.'
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
      correct: 2,
      explanation: '• Fish have a streamlined body shape that reduces friction and drag while moving through water.\n• Their flat fins provide stability, balance, and steer direction.\n• The powerful muscular tail drives locomotion, pushing the fish forward.'
    },
    {
      q: 'Pigeons can move by:',
      opts: [
        'Only flying in the air',
        'Both walking on legs and flying with wings',
        'Swimming and hopping'
      ],
      correct: 1,
      explanation: '• Pigeons possess forelimbs modified into wings covered with feathers, which allow them to fly efficiently.\n• They also have strong hind limbs (legs) with claws that enable them to walk, run, and perch on branches.\n• This dual mode of locomotion helps them feed and escape predators.'
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
      correct: 1,
      explanation: '• Camels native to the cold deserts of Ladakh (Bactrian camels) have two humps instead of one.\n• They grow a very thick, shaggy coat of hair to insulate themselves against the sub-zero temperatures of high altitudes.\n• This adaptation protects them during harsh winters.'
    },
    {
      q: 'What is a "Sacred Grove" in NCERT terminology?',
      opts: [
        'A plantation of agricultural crops.',
        'A forest area traditionally protected by local communities.',
        'A desert area where camels gather.'
      ],
      correct: 1,
      explanation: '• Sacred Groves are patches of forest reserves set aside and strictly protected by indigenous and local communities.\n• These areas are associated with religious taboos, local deities, or traditional conservation rules.\n• They serve as crucial refuges for rare plants and wildlife, preserving biodiversity.'
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

  'plant_variety_concept': {
    title: '2.2.1-A Plant Classification',
    slides: [
      {
        title: 'Activity 2.4: Let us group',
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
    title: 'Activity 2.5: Let Us Compare',
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
    title: 'Activity 2.8: Let us compare - Seeds & Cotyledons',
    slides: [
      {
        title: 'Activity 2.8: Let us compare - Seeds & Cotyledons',
        content: 'Inside a seed coat is the embryo and cotyledons (seed leaves) which store food reserves for the germinating plant:',
        bullets: [
          '🥜 Dicotyledons (Dicots): Seeds that easily split into two halves (e.g. Gram, Chickpea, Pea, Kidney Beans).',
          '🌽 Monocotyledons (Monocots): Seeds with a single cotyledon that cannot be split (e.g. Maize, Wheat, Rice, Grass).'
        ],
        svg: 'cotyledon'
      },
      {
        title: 'Activity 2.8: Let us compare - Seeds & Cotyledons',
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
      },
      {
        title: 'Eminent Scientists: Dr. Janaki Ammal (Page 22)',
        content: "Dr. Janaki Ammal (1897–1984) was an eminent Indian botanist and environmentalist who studied and protected India's rich plant diversity. She played an important role in documenting plants and protecting forests and biodiversity.",
        bullets: [
          '🔬 Plant Explorer: She explored and studied many plants across India, including medicinal plants.',
          '📚 Plant Researcher: She helped identify, classify, and document a large number of plant species.',
          '🌿 Nature Protector: She played a key role in protecting the Silent Valley rainforest and its biodiversity.',
          '🏞️ Pioneer: She became a leading scientist and the first woman to hold the position of Director-level leadership in the Botanical Survey of India.'
        ],
        image: 'Scientist2'
      },
      {
        title: 'Save Silent Valley Movement (Page 23)',
        content: 'The Silent Valley Movement was a social movement aimed at protecting the Silent Valley tropical rainforest in Kerala from being flooded by a hydroelectric dam project.',
        bullets: [
          '📍 Silent Valley: A tropical rainforest in Kerala, home to many rare species like the Lion-tailed Macaque.',
          '⚡ Hydroelectric Project: In 1973, a dam was proposed on the Kunthipuzha river, threatening the forest.',
          '✊ Public Protest: Local communities, scientists, and environmentalists campaigned to save it, leading to the forest being declared a National Park in 1984.'
        ],
        image: 'silent_valley'
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
        title: 'Eminent Scientists: Dr. Salim Ali (Page 27)',
        content: 'Dr. Salim Ali (1896–1987) was an eminent Indian ornithologist and naturalist, widely known as the “Birdman of India”. He conducted systematic bird surveys across India and wrote books that popularised bird-watching.',
        bullets: [
          '🔎 Pioneer: He was among the first to conduct systematic bird surveys in India.',
          '📖 Author: Wrote the landmark “Handbook of the Birds of India and Pakistan”.',
          '🌿 Conservationist: Played an important role in protecting birds, habitats, and wildlife conservation in India.',
          '🏞️ Nature Protector: His work helped promote the conservation of important bird habitats and protected areas.'
        ],
        image: 'Scientist1'
      },
      {
        title: 'Protecting Wildlife & Ecosystems (Page 28)',
        content: 'Protecting habitats is the key to conserving biodiversity. Governments and communities set up protected areas to protect animals and plants from hunting and habitat loss.',
        bullets: [
          '🐅 Project Tiger (1973): India\'s landmark conservation initiative to ensure a viable population of Bengal tigers.',
          '🐆 Cheetah Reintroduction (2022): Relocating African cheetahs to Kuno National Park to restore grasslands.',
          '🤝 Collective Responsibility: Conserving nature benefits human well-being and ecological balance.'
        ],
        image: 'protect_wildlife'
      },
      {
        title: 'Sacred Groves (Page 29)',
        content: 'Sacred groves are patches of forest reserves strictly protected by local communities due to cultural, traditional, or religious beliefs.',
        bullets: [
          '🏹 Local Conservation: No cutting of wood or hunting is allowed in these patches.',
          '🌱 Biodiversity Refuges: Save rare and endangered plants, animals, and soil microorganisms.',
          '📍 Distribution: Widely found in Western Ghats (Maharashtra, Karnataka, Kerala), Meghalaya, and Rajasthan.'
        ],
        image: 'sacred_groves'
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
      { id: 'sec-2-1-act-2', title: 'Activity 2.1 — Animals (Table 2.2)', activityId: 'virtual_biodiversity', icon: '🐾', desc: 'Where animals live, what they eat and how they move.', pg: 'p.12', path: '/activities/class6_chapter2/activity_1.html' },
      { id: 'sec-2-2-act', title: 'Activity 2.2 — Let us appreciate', activityId: 'appreciating_biodiversity', icon: '🎨', desc: 'A live class blackboard reveals biodiversity.', pg: 'p.13', path: '/activities/class6_chapter2/activity_2.html' },
      { id: 'sec-2-3-act', title: 'Activity 2.3: Let Us Group (Card Sorting)', activityId: 'inline_sorting', icon: '🧩', desc: 'The same living things regroup by any feature you pick.', pg: 'p.14–15', path: '/activities/class6_chapter2/activity_3.html' }
    ]
  },
  {
    id: 'lvl-3',
    title: '2.2.1 How to group plants?',
    lessonId: 'plant_variety_concept',
    icon: '🌱',
    activities: [
      { id: 'sec-2-4-act', title: 'Activity 2.4 — Herbs, shrubs & trees', activityId: 'plant_detective_stem', icon: '🌱', desc: 'Grow a plant; watch it be named live. Fill Table 2.3.', pg: 'p.15–16', path: '/activities/class6_chapter2/activity_4.html' }
    ]
  },
  {
    id: 'lvl-4',
    title: 'Activity 2.5: Let Us Compare',
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
    title: 'Activity 2.8: Let us compare - Seeds & Cotyledons',
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

const CHAPTER_2_FLOW = [
  /* 1. Cover Page */
  { type: 'stage', stage: 'cover', name: 'Cover Page' },
  /* 2. Slogan Page */
  { type: 'stage', stage: 'slogan', name: 'Slogan Page' },
  /* 3. Scenes Page */
  { type: 'stage', stage: 'scenes', name: 'Scenes Page' },
  /* 4. Activity 2.1 — Plants */
  { type: 'lab', levelId: 'lvl-1', actIdx: 0, focused: true, subStep: null, slide: 0, name: 'Activity 2.1 — Plants' },
  /* 5. Activity 2.1 — Animals */
  { type: 'lab', levelId: 'lvl-1', actIdx: 1, focused: true, subStep: null, slide: 0, name: 'Activity 2.1 — Animals' },
  /* 6. Activity 2.2 — Let Us Appreciate */
  { type: 'lab', levelId: 'lvl-1', actIdx: 2, focused: true, subStep: 'appreciate', slide: 0, name: 'Activity 2.2 — Let Us Appreciate' },
  /* 7. Class Board */
  { type: 'lab', levelId: 'lvl-1', actIdx: 2, focused: true, subStep: 'board', slide: 0, name: 'Class Board' },
  /* 8. Ecosystem Quiz */
  { type: 'lab', levelId: 'lvl-1', actIdx: 2, focused: true, subStep: 'quiz', slide: 0, name: 'Ecosystem Quiz' },
  /* 9. Activity 2.3 — Classification Lab */
  { type: 'lab', levelId: 'lvl-1', actIdx: 3, focused: true, subStep: null, slide: 0, name: 'Activity 2.3 — Classification Lab' },
  /* 10. 2.2.1 — How to Group Plants? */
  { type: 'lab', levelId: 'lvl-3', actIdx: 0, focused: false, subStep: null, slide: 0, name: '2.2.1 — How to Group Plants?' },
  /* 11. Activity 2.4 — Let Us Group */
  { type: 'lab', levelId: 'lvl-3', actIdx: 0, focused: false, subStep: null, slide: 1, name: 'Activity 2.4 — Let Us Group' },
  /* 12. Activity 2.4 — Herbs, Shrubs & Trees */
  { type: 'lab', levelId: 'lvl-3', actIdx: 0, focused: true, subStep: null, slide: 0, name: 'Activity 2.4 — Herbs, Shrubs & Trees' },
  /* 13. Lesson Pane — Activity 2.5: Let Us Compare */
  { type: 'lab', levelId: 'lvl-4', actIdx: 0, focused: false, subStep: null, slide: 0, name: 'Lesson Pane — Activity 2.5: Let Us Compare' },
  /* 14. Activity 2.5 — Leaf Venation Pattern */
  { type: 'lab', levelId: 'lvl-4', actIdx: 0, focused: true, subStep: null, slide: 0, name: 'Activity 2.5 — Leaf Venation Pattern' },
  /* 15. Activity 2.6 — Roots */
  { type: 'lab', levelId: 'lvl-4', actIdx: 1, focused: true, subStep: null, slide: 0, name: 'Activity 2.6 — Roots' },
  /* 16. Activity 2.7 — Relate and Analyse */
  { type: 'lab', levelId: 'lvl-4', actIdx: 2, focused: true, subStep: null, slide: 0, name: 'Activity 2.7 — Relate and Analyse' },
  /* 17. Lesson Pane — Activity 2.8: Let Us Compare — Seeds and Cotyledons */
  { type: 'lab', levelId: 'lvl-5', actIdx: 0, focused: false, subStep: null, slide: 0, name: 'Lesson Pane — Activity 2.8: Let Us Compare — Seeds and Cotyledons' },
  /* 18. Activity 2.8 — Seeds (Dicot/Monocot) */
  { type: 'lab', levelId: 'lvl-5', actIdx: 0, focused: true, subStep: null, slide: 0, name: 'Activity 2.8 — Seeds (Dicot/Monocot)' },
  /* 19. 2.2.2 — How to Group Animals? */
  { type: 'lab', levelId: 'lvl-6', actIdx: 0, focused: false, subStep: null, slide: 0, name: '2.2.2 — How to Group Animals?' },
  /* 20. Animal Locomotion */
  { type: 'lab', levelId: 'lvl-6', actIdx: 0, focused: false, subStep: null, slide: 1, name: 'Animal Locomotion' },
  /* 21. Activity 2.9 — Animal Locomotion */
  { type: 'lab', levelId: 'lvl-6', actIdx: 0, focused: true, subStep: null, slide: 0, name: 'Activity 2.9 — Animal Locomotion' },
  /* 22. 2.3 — Surroundings & Adaptations */
  { type: 'lab', levelId: 'lvl-7', actIdx: 0, focused: false, subStep: null, slide: 0, name: '2.3 — Surroundings & Adaptations' },
  /* 23. Activity 2.10 — Different Surroundings / Habitats & Adaptations */
  { type: 'lab', levelId: 'lvl-7', actIdx: 0, focused: true, subStep: null, slide: 0, name: 'Activity 2.10 — Different Surroundings / Habitats & Adaptations' },
  /* 24. Chapter 2 Key Vocabulary */
  { type: 'lab', levelId: 'lvl-8', actIdx: 0, focused: false, subStep: null, slide: 0, name: 'Chapter 2 Key Vocabulary' },
  /* 25–49. Chapter Challenge Questions 1 to 25 */
  ...Array.from({ length: 25 }, (_, i) => ({
    type: 'challenge',
    levelId: 'lvl-9',
    qIdx: i,
    completed: false,
    name: `Chapter Challenge — Question ${i + 1}`
  })),
  /* 50. Chapter 2 Completed */
  { type: 'completed', levelId: 'lvl-9', completed: true, name: 'Chapter 2 Completed' }
];

// ── Voice profiles for character-specific Indian English speech synthesis ─────
// Distinct voice identities:
// • Dr. Raghu (Young Adult Male Teacher): pitch 0.94, rate 0.90
// • Maniram Chacha (Elderly Man): deep aged texture pitch 0.58, rate 0.72
// • Priya (School Girl / Child): bright youthful pitch 1.62, rate 1.02
// • Arjun (School Boy / Child): curious youthful pitch 1.42, rate 1.05
const VOICE_PROFILES = {
  'Dr. Raghu': {
    pitch: 0.96,
    rate: 0.88,
    gender: 'adultMale',
    inKeywords: ['ravi', 'prabhat', 'male', 'india', 'indian', 'en-in', 'hi-in'],
    enKeywords: ['guy', 'david', 'mark', 'george', 'male']
  },
  'Maniram Chacha': {
    pitch: 0.58,
    rate: 0.72,
    gender: 'agedMale',
    inKeywords: ['valluvar', 'prabhat', 'ravi', 'india', 'indian'],
    enKeywords: ['james', 'george', 'fred', 'uk male']
  },
  'Priya': {
    pitch: 1.62,
    rate: 1.02,
    gender: 'childGirl',
    inKeywords: ['heera', 'neerja', 'veena', 'ananya', 'kavya', 'female'],
    enKeywords: ['zira', 'samantha', 'victoria', 'female']
  },
  'Arjun': {
    pitch: 1.42,
    rate: 1.05,
    gender: 'childBoy',
    inKeywords: ['prabhat', 'ravi', 'india', 'indian'],
    enKeywords: ['alex', 'daniel', 'karen', 'male']
  },
  'Female Teacher': {
    pitch: 1.05,
    rate: 0.95,
    gender: 'adultFemale',
    inKeywords: ['heera', 'neerja', 'veena', 'female'],
    enKeywords: ['zira', 'susan', 'female']
  }
};

function speakWithProfile(text, characterName, muteFlag, onEndCallback, onErrorCallback) {
  if (muteFlag || !('speechSynthesis' in window)) return null;
  window.speechSynthesis.cancel();

  // Natural conversational text preprocessing for expressive pauses and stage directions
  let spokenText = text;
  if (spokenText.includes('coo-koo-koo') || spokenText.includes('cups ear')) {
    spokenText = spokenText
      .replace(/Shhh\.\.\./gi, 'Shh... ... ')
      .replace(/\*cups ear\*/gi, '... cups ear, ... ')
      .replace(/listen\.\.\./gi, 'listen... ... ')
      .replace(/coo-koo-koo!/gi, 'coo... koo... koo!')
      .replace(/🎵/g, '');
  }

  const profile = VOICE_PROFILES[characterName] || { pitch: 1.0, rate: 1.0, gender: 'adultMale', inKeywords: [], enKeywords: [] };
  const utt = new SpeechSynthesisUtterance(spokenText);
  utt.pitch = profile.pitch;
  utt.rate  = profile.rate;
  utt.volume = 1.0;

  if (onEndCallback) utt.onend = onEndCallback;
  if (onErrorCallback) utt.onerror = onErrorCallback;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    // 1. Prioritize Indian English / Indian voices (lang en-IN, hi-IN or name containing india/indian/prabhat/heera/neerja/ravi)
    const indianVoices = voices.filter(v => 
      (v.lang && (v.lang.toLowerCase().includes('in') || v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('hi-in'))) ||
      /india|indian|hindi|prabhat|heera|neerja|ravi|veena/i.test(v.name)
    );

    let matchedVoice = null;
    if (indianVoices.length > 0) {
      if (profile.inKeywords) {
        for (const kw of profile.inKeywords) {
          matchedVoice = indianVoices.find(v => v.name.toLowerCase().includes(kw));
          if (matchedVoice) break;
        }
      }
      if (!matchedVoice) {
        if (profile.gender === 'agedMale') {
          const males = indianVoices.filter(v => /male|prabhat|ravi/i.test(v.name));
          matchedVoice = males.length > 1 ? males[1] : (males[0] || indianVoices[0]);
        } else if (profile.gender === 'adultMale') {
          const males = indianVoices.filter(v => /male|prabhat|ravi/i.test(v.name));
          matchedVoice = males[0] || indianVoices[0];
        } else if (profile.gender === 'childBoy') {
          const males = indianVoices.filter(v => /male|prabhat|ravi/i.test(v.name));
          matchedVoice = males.length > 1 ? males[males.length - 1] : (males[0] || indianVoices[0]);
        } else {
          const females = indianVoices.filter(v => /female|heera|neerja|veena/i.test(v.name));
          matchedVoice = females[0] || indianVoices[0];
        }
      }
    }

    // 2. Fallback to English voices if no Indian voice is installed on current system
    if (!matchedVoice) {
      const englishVoices = voices.filter(v => v.lang && v.lang.startsWith('en'));
      const pool = englishVoices.length > 0 ? englishVoices : voices;

      if (profile.enKeywords) {
        for (const kw of profile.enKeywords) {
          matchedVoice = pool.find(v => v.name.toLowerCase().includes(kw));
          if (matchedVoice) break;
        }
      }

      if (!matchedVoice) {
        if (profile.gender === 'agedMale') {
          const males = pool.filter(v => /male|david|mark|guy|james|fred|george/i.test(v.name));
          matchedVoice = males.length > 1 ? males[1] : (males[0] || pool[0]);
        } else if (profile.gender === 'adultMale') {
          const males = pool.filter(v => /male|david|mark|guy|james/i.test(v.name));
          matchedVoice = males[0] || pool[0];
        } else if (profile.gender === 'childGirl') {
          const females = pool.filter(v => /female|zira|samantha|victoria|susan|karen|jessica|jenny/i.test(v.name));
          matchedVoice = females[0] || pool[0];
        } else if (profile.gender === 'childBoy') {
          const males = pool.filter(v => /male|alex|daniel/i.test(v.name));
          matchedVoice = males.length > 1 ? males[males.length - 1] : (males[0] || pool[0]);
        } else if (profile.gender === 'adultFemale') {
          const females = pool.filter(v => /female|zira|samantha|victoria/i.test(v.name));
          matchedVoice = females[0] || pool[0];
        }
      }
    }

    if (matchedVoice) {
      utt.voice = matchedVoice;
    }
  }

  window.speechSynthesis.speak(utt);
  return utt;
}

function speakIndianMaleNarrator(text, muteFlag, onEndCallback, onErrorCallback) {
  if (muteFlag || !('speechSynthesis' in window)) return null;
  window.speechSynthesis.cancel();

  // Natural pacing & educational pauses for Class 6 students
  let spokenText = text
    .replace(/—/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

  const utt = new SpeechSynthesisUtterance(spokenText);
  utt.pitch = 0.98; // Natural, resonant adult male educator pitch
  utt.rate = 0.88;  // Clear, moderate pacing for Class 6 comprehension
  utt.volume = 1.0;

  if (onEndCallback) utt.onend = onEndCallback;
  if (onErrorCallback) utt.onerror = onErrorCallback;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    // 1. Prioritize Indian English male voices (en-IN, hi-IN, Prabhat, Ravi, etc.)
    const indianVoices = voices.filter(v => 
      (v.lang && (v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('hi-in') || v.lang.toLowerCase().includes('in'))) ||
      /india|indian|hindi|prabhat|ravi|veena|heera|neerja/i.test(v.name)
    );

    let matchedVoice = null;
    if (indianVoices.length > 0) {
      // Find explicitly male Indian voice first (e.g. Prabhat, Ravi, Male)
      matchedVoice = indianVoices.find(v => /prabhat|ravi|male/i.test(v.name) && !/female|heera|neerja|veena/i.test(v.name));
      if (!matchedVoice) {
        matchedVoice = indianVoices.find(v => !/female|heera|neerja|veena/i.test(v.name));
      }
      if (!matchedVoice) {
        matchedVoice = indianVoices[0];
      }
    }

    // 2. Fallback to natural clear English male narrator voice if no Indian voice is installed
    if (!matchedVoice) {
      const englishMaleVoices = voices.filter(v => 
        v.lang && v.lang.startsWith('en') &&
        /male|david|mark|guy|james|george|alex|daniel|natural|online/i.test(v.name) &&
        !/female|zira|samantha|victoria|susan|karen|jessica|jenny/i.test(v.name)
      );
      matchedVoice = englishMaleVoices[0] || voices.find(v => v.lang && v.lang.startsWith('en')) || voices[0];
    }

    if (matchedVoice) {
      utt.voice = matchedVoice;
    }
  }

  window.speechSynthesis.speak(utt);
  return utt;
}

function IntroStoryteller({ onComplete, onBack }) {
  const [currentScene, setCurrentScene] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [dialogueStep, setDialogueStep] = useState(0);
  const [isNarrationMuted, setIsNarrationMuted] = useState(false);
  const dialogueTimerRef = useRef(null);
  const { theme = 'dark' } = useTheme() || {};

  const scenes = [
    {
      img: "/Scene0_realistic.png",
      title: "🌿 Welcome to the Living World",
      text: "Welcome to Chapter 2: Diversity in the Living World! Step outside and look around — every tree, flower, bird, and insect is a unique living being. In this chapter, we embark on a nature walk to discover the incredible variety of life on Earth.",
      dialogues: []
    },
    {
      img: "/Scene1_realistic.png",
      title: "🌱 The Nature Walk Begins",
      text: "Dr Raghu and Maniram chacha lead the students out of the classroom into a nearby patch of forest. The air is fresh and filled with the scent of wet soil and leaves. The kids are excited to discover what secrets the nature walk holds!",
      dialogues: [
        { character: "Dr. Raghu",      avatar: "👨‍🔬", text: "Observe carefully — every living thing has a story to tell!",    top: '5%', left: '3%',  side: 'left' },
        { character: "Maniram Chacha", avatar: "🧑‍🌾", text: "I know every tree here, children. Come, follow me!",            top: '5%', right: '3%', side: 'right' }
      ]
    },
    {
      img: "/Scene2_realistic.png",
      title: "🌿 Observing Diverse Plants",
      text: "As they walk, they observe different kinds of plants. Some are small herbs growing close to the ground, others are bushy shrubs, and some are grand trees with thick trunks. Dr Raghu reminds them to observe gently without plucking any leaves or flowers.",
      dialogues: [
        { character: "Dr. Raghu", avatar: "👨‍🔬", text: "This herb has a soft green stem. Can you feel how different it is from this woody shrub?", top: '5%', right: '3%', side: 'right' }
      ]
    },
    {
      img: "/Scene5_realistic.png",
      title: "🐦 Listening to Bird Calls",
      text: "Hush! Maniram chacha stops and cups his ear. He mimics a bird song, and suddenly, a beautiful response is heard from the tree canopy! The students learn to listen to the unique calls of birds and respect their home.",
      dialogues: [
        { character: "Maniram Chacha", avatar: "🧑‍🌾", text: "Shhh... *cups ear* ...listen... coo-koo-koo! 🎵",              top: '11%', left: '19%', side: 'right' },
        { character: "Priya",          avatar: "👧",    text: "It replied! The bird actually replied to chacha!",             top: '4%',  right: '3%', side: 'right' }
      ]
    },
    {
      img: sce5Img,
      title: "🦋 Fluttering Insects & Butterflies",
      text: "Near a cluster of wildflowers, butterflies and bees are busy gathering nectar. The students watch closely as a butterfly unfolds its delicate wings. They notice how insects play a vital role in helping flowers grow.",
      dialogues: [
        { character: "Arjun",     avatar: "👦",    text: "Sir! That butterfly keeps visiting the same flower again and again!", top: '4%', right: '3%', side: 'right' },
        { character: "Dr. Raghu", avatar: "👨‍🔬", text: "Yes — that is pollination! Insects help flowers reproduce.",         top: '4%', left: '3%',  side: 'left' }
      ]
    },
    {
      img: "/Scene3_realistic.png",
      title: "🐒 Animals in the Canopy",
      text: "A rustle in the branches reveals monkeys jumping from limb to limb, and a tiny squirrel scurrying down a trunk. The forest is alive with creatures of all sizes, each adapted to live in their part of the woods.",
      dialogues: [
        { character: "Maniram Chacha", avatar: "🧑‍🌾", text: "See that monkey? The treetops are its home — its habitat!", top: '4%', right: '3%', side: 'right' }
      ]
    },
    {
      img: "/Scene6_realistic.png",
      title: "📋 Recording in the Table",
      text: "The students take out their notebooks to record their observations in Tables 2.1 and 2.2. They separate their findings into plants and animals, marveling at the incredible diversity of life surrounding them!",
      dialogues: [
        { character: "Dr. Raghu", avatar: "👨‍🔬", text: "Table 2.1 for plants, Table 2.2 for animals. Compare your findings with your classmates!", top: '5%', right: '3%', side: 'right' }
      ]
    }
  ];

  const totalScenes = scenes.length;
  const scene = scenes[currentScene];

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearTimeout(dialogueTimerRef.current);
    setDialogueStep(0);
    setImgLoaded(false);

    // Speak center information box narration with Indian male teacher voice immediately as scene opens
    let speakTimer = null;
    if (!isNarrationMuted && 'speechSynthesis' in window) {
      speakTimer = setTimeout(() => {
        const doSpeak = () => {
          speakIndianMaleNarrator(scene.text, isNarrationMuted);
        };
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          doSpeak();
        } else {
          window.speechSynthesis.onvoiceschanged = () => { doSpeak(); };
        }
      }, 100);
    }

    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      clearTimeout(dialogueTimerRef.current);
      if (speakTimer) clearTimeout(speakTimer);
    };
  }, [currentScene, isNarrationMuted]);

  useEffect(() => {
    let active = true;

    if (dialogueStep < scene.dialogues.length) {
      const dlg = scene.dialogues[dialogueStep];
      const nextStep = () => {
        if (active) {
          clearTimeout(dialogueTimerRef.current);
          setDialogueStep(p => p + 1);
        }
      };

      // Character dialogue boxes display silently (no character voice audio) for natural reading duration
      const readingDuration = Math.max(2200, Math.min(3800, dlg.text.length * 45));
      dialogueTimerRef.current = setTimeout(nextStep, readingDuration);
    }

    return () => {
      active = false;
      clearTimeout(dialogueTimerRef.current);
    };
  }, [dialogueStep, currentScene]);

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsNarrationMuted(prev => {
      if (!prev && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      return !prev;
    });
  };

  const handleNext = () => { if (currentScene < totalScenes - 1) setCurrentScene(prev => prev + 1); else if (onComplete) onComplete(); };
  const handlePrev = () => { if (currentScene > 0) setCurrentScene(prev => prev - 1); };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
        overflow: 'hidden',
        boxShadow: 'none',
        background: '#0a1220',
        cursor: 'default',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      
      <div style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
      }}>
        <img
          key={scene.img}
          src={scene.img}
          alt={scene.title}
          onLoad={() => setImgLoaded(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.5s ease',
            opacity: imgLoaded ? 1 : 0
          }}
        />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.65) 78%, rgba(0,0,0,0.82) 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        {scene.dialogues.map((dlg, idx) => {
          const isVisible = dialogueStep >= idx && imgLoaded;
          return (
            <div key={idx} style={{
              position: 'absolute',
              top: dlg.top,
              left: dlg.left,
              right: dlg.right,
              zIndex: 13,
              width: '290px',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.92)',
              transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
              pointerEvents: 'none'
            }}>
              <div style={{
                position: 'relative',
                background: theme === 'light' ? 'rgba(255, 255, 255, 0.96)' : 'rgba(10, 22, 40, 0.88)',
                backdropFilter: 'blur(16px)',
                border: theme === 'light' ? '1.5px solid rgba(5, 150, 105, 0.35)' : '1.5px solid rgba(52, 211, 153, 0.28)',
                borderRadius: dlg.side === 'left' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                padding: '0.75rem 1rem',
                boxShadow: theme === 'light' ? '0 10px 30px rgba(0,0,0,0.1)' : '0 10px 30px rgba(0,0,0,0.4)',
                color: theme === 'light' ? '#0f172a' : '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.15rem' }}>{dlg.avatar}</span>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    color: theme === 'light' ? '#059669' : '#34d399',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em'
                  }}>
                    {dlg.character}
                  </span>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '0.96rem',
                  color: theme === 'light' ? '#334155' : 'rgba(255,255,255,0.95)',
                  lineHeight: '1.5',
                  fontStyle: 'italic',
                  fontWeight: '550'
                }}>
                  "{dlg.text}"
                </p>

                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: dlg.side === 'left' ? '20px' : 'auto',
                  right: dlg.side === 'right' ? '20px' : 'auto',
                  width: 0,
                  height: 0,
                  borderStyle: 'solid',
                  borderWidth: '8px 8px 0 8px',
                  borderColor: `${theme === 'light' ? 'rgba(255, 255, 255, 0.96)' : 'rgba(10, 22, 40, 0.88)'} transparent transparent transparent`,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute', top: '0.9rem', left: '0.9rem', zIndex: 12,
        background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(10px)',
        borderRadius: '8px', padding: '0.28rem 0.7rem',
        fontSize: '0.64rem', fontWeight: '700', color: '#34d399',
        textTransform: 'uppercase', letterSpacing: '0.1em'
      }}>
        Class 6 · Scene {currentScene + 1} of {totalScenes}
      </div>

      {onBack && (
        <div style={{
          position: 'absolute', bottom: '1.2rem', left: '1.2rem', zIndex: 15
        }}>
          <button 
            onClick={(e) => { e.stopPropagation(); onBack(); }}
            style={{
              padding: '0.7rem 1.4rem', fontSize: '0.9rem', fontWeight: '700',
              borderRadius: '8px', border: 'none',
              background: '#10b981', color: '#fff',
              backdropFilter: 'blur(12px)', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            ← Back to Slogan
          </button>
        </div>
      )}

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        padding: '0 1rem 1.1rem',
        zIndex: 14,
        transform: 'translateY(0)',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{
          width: '100%', maxWidth: '780px',
          background: '#E6BF83', 
          color: '#000000',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(160, 82, 45, 0.5)', 
          borderRadius: '16px',
          padding: '1.4rem 1.8rem 1.2rem',
          boxShadow: '0 -2px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(230, 191, 131, 0.18)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.28rem', fontWeight: '800', color: '#5C4033', letterSpacing: '-0.01em' }}>
              {scene.title}
            </span>
          </div>

          <p style={{
            margin: '0 0 0.85rem 0', fontSize: '1.18rem',
            color: '#523418', lineHeight: '1.68', fontWeight: '500',
            minHeight: '3.2em', fontFamily: "'Georgia', 'Times New Roman', serif"
          }}>
            {scene.text}
          </p>

          <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              disabled={currentScene === 0}
              style={{
                padding: '0.45rem 1.1rem', fontSize: '0.82rem', fontWeight: '700',
                borderRadius: '9px', border: 'none',
                background: currentScene === 0 ? 'rgba(255,255,255,0.1)' : '#10b981',
                color: '#fff',
                cursor: currentScene === 0 ? 'not-allowed' : 'pointer',
                opacity: currentScene === 0 ? 0.4 : 1, transition: 'all 0.2s',
                boxShadow: currentScene === 0 ? 'none' : '0 3px 12px rgba(16, 185, 129, 0.4)'
              }}>← Prev</button>
            <button onClick={(e) => { e.stopPropagation(); handleNext(); }}
              style={{
                padding: '0.42rem 1.3rem', fontSize: '0.78rem', fontWeight: '700',
                borderRadius: '9px', border: 'none',
                background: currentScene === totalScenes - 1
                  ? 'linear-gradient(135deg,#059669,#34d399)'
                  : 'linear-gradient(135deg,#b45309,#d97706)',
                color: '#fff', cursor: 'pointer',
                boxShadow: '0 3px 12px rgba(0,0,0,0.35)', transition: 'all 0.2s'
              }}>
              {currentScene === totalScenes - 1 ? 'Finish Story ✓' : 'Next Scene →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VocabularyGlossary({ onMatchComplete }) {
  const [activeTab, setActiveTab] = useState('glossary'); // 'glossary' or 'game'
  const [flippedCardId, setFlippedCardId] = useState(null);
  
  const terms = [
    { id: 'habitat', word: 'Habitat', desc: 'The natural home or environment of a plant, animal, or other organism.', eg: 'A pond is the habitat for frogs and lotus plants.', image: treeCanopyImg },
    { id: 'adaptation', word: 'Adaptation', desc: 'A physical or behavioral feature that helps an organism survive in its habitat.', eg: 'Camels have broad padded feet to walk on hot desert sand.', image: spiderMonkeyImg },
    { id: 'herbs', word: 'Herbs', desc: 'Small plants with soft, green, and tender stems that bend easily.', eg: 'Grass, coriander, tomato, and tulsi are common herbs.', image: herbTulsiImg },
    { id: 'shrubs', word: 'Shrubs', desc: 'Medium-sized plants with thin, woody stems branching out close to the ground.', eg: 'Hibiscus, rose, and lemon plants grow as shrubs.', image: shrubHibiscusImg },
    { id: 'trees', word: 'Trees', desc: 'Tall plants with thick, hard, woody trunks branching high above the ground.', eg: 'Mango, neem, pine, and banyan trees grow tall.', image: tree1Img },
    { id: 'reticulate', word: 'Reticulate Venation', desc: 'A net-like pattern of veins on both sides of the leaf midrib.', eg: 'Hibiscus, sadabahar, and rose leaves show net venation.', image: dicotLeafImg },
    { id: 'parallel', word: 'Parallel Venation', desc: 'Veins running parallel to each other from the base of the leaf to the tip.', eg: 'Grass, wheat, maize, and banana leaves have parallel veins.', image: monocotLeafImg },
    { id: 'taproot', word: 'Taproot System', desc: 'A single, thick primary root growing deep vertically, with smaller side branches.', eg: 'Mustard, carrots, and chickpea plants have taproots.', image: taprootImg },
    { id: 'fibrous', word: 'Fibrous Roots', desc: 'A bunch of thin, equal-sized roots arising together from the base of the stem.', eg: 'Grass, wheat, onions, and maize have fibrous root systems.', image: fibrousImg },
    { id: 'monocot', word: 'Monocot', desc: 'A seed with a single cotyledon (seed leaf) that cannot be split into two halves.', eg: 'Maize, wheat, and rice seeds are monocots.', image: maizeCutImg },
    { id: 'dicot', word: 'Dicot', desc: 'A seed with two cotyledons (seed leaves) that easily split into two halves.', eg: 'Gram, peas, almonds, and kidney beans are dicot seeds.', image: chickpeaSplitImg },
    { id: 'sacred', word: 'Sacred Groves', desc: 'Traditionally protected forest patches guarded by local communities for wildlife conservation.', eg: 'Sacred groves in the Western Ghats protect unique plants and animals.', image: scaredImg }
  ];

  // 2-Column Match Game State
  const [gameDefs, setGameDefs] = useState([]);
  const [gameWords, setGameWords] = useState([]);
  const [selectedDef, setSelectedDef] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [errorPair, setErrorPair] = useState(null); // { defId, wordId }
  const [attempts, setAttempts] = useState(0);

  const containerRef = useRef(null);
  const defRefs = useRef({});
  const wordRefs = useRef({});
  const [lines, setLines] = useState([]);

  // Initialize or reset game with 6 definitions and deranged words
  const initGame = useCallback(() => {
    const pool = [...terms].sort(() => 0.5 - Math.random()).slice(0, 6);
    const defs = pool.map((t, idx) => ({ id: t.id, text: t.desc, num: idx + 1 }));
    
    const wordsBase = pool.map(t => ({ id: t.id, text: t.word }));
    let shuffled = [...wordsBase].sort(() => 0.5 - Math.random());
    let safety = 0;
    while (safety < 30 && shuffled.some((w, i) => w.id === defs[i].id)) {
      shuffled = [...wordsBase].sort(() => 0.5 - Math.random());
      safety++;
    }
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const words = shuffled.map((w, idx) => ({ ...w, letter: letters[idx] }));

    setGameDefs(defs);
    setGameWords(words);
    setMatchedPairs([]);
    setSelectedDef(null);
    setSelectedWord(null);
    setErrorPair(null);
    setAttempts(0);
  }, []);

  useEffect(() => {
    if (activeTab === 'game') {
      initGame();
    }
  }, [activeTab, initGame]);

  // Update SVG connection lines dynamically
  const updateLines = useCallback(() => {
    if (!containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const newLines = [];

    matchedPairs.forEach(id => {
      const dEl = defRefs.current[id];
      const wEl = wordRefs.current[id];
      if (dEl && wEl) {
        const dRect = dEl.getBoundingClientRect();
        const wRect = wEl.getBoundingClientRect();
        newLines.push({
          id: `matched-${id}`,
          x1: dRect.right - cRect.left,
          y1: dRect.top + dRect.height / 2 - cRect.top,
          x2: wRect.left - cRect.left,
          y2: wRect.top + wRect.height / 2 - cRect.top,
          status: 'matched'
        });
      }
    });

    if (errorPair) {
      const dEl = defRefs.current[errorPair.defId];
      const wEl = wordRefs.current[errorPair.wordId];
      if (dEl && wEl) {
        const dRect = dEl.getBoundingClientRect();
        const wRect = wEl.getBoundingClientRect();
        newLines.push({
          id: 'error-line',
          x1: dRect.right - cRect.left,
          y1: dRect.top + dRect.height / 2 - cRect.top,
          x2: wRect.left - cRect.left,
          y2: wRect.top + wRect.height / 2 - cRect.top,
          status: 'error'
        });
      }
    }

    setLines(newLines);
  }, [matchedPairs, errorPair]);

  useEffect(() => {
    updateLines();
    const handleResize = () => updateLines();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(updateLines, 60);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [updateLines, gameDefs, gameWords, activeTab]);

  // Matching logic
  const handleDefClick = (defId) => {
    if (matchedPairs.includes(defId) || errorPair) return;
    if (selectedDef === defId) {
      setSelectedDef(null);
      return;
    }
    setSelectedDef(defId);
    if (selectedWord) {
      evaluateMatch(defId, selectedWord);
    }
  };

  const handleWordClick = (wordId) => {
    if (matchedPairs.includes(wordId) || errorPair) return;
    if (selectedWord === wordId) {
      setSelectedWord(null);
      return;
    }
    setSelectedWord(wordId);
    if (selectedDef) {
      evaluateMatch(selectedDef, wordId);
    }
  };

  const evaluateMatch = (dId, wId) => {
    if (dId === wId) {
      const newMatched = [...matchedPairs, dId];
      setMatchedPairs(newMatched);
      setSelectedDef(null);
      setSelectedWord(null);
      confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 } });
      if (newMatched.length === 6 && onMatchComplete) {
        onMatchComplete();
      }
    } else {
      setAttempts(a => a + 1);
      setErrorPair({ defId: dId, wordId: wId });
      setTimeout(() => {
        setErrorPair(null);
        setSelectedDef(null);
        setSelectedWord(null);
      }, 600);
    }
  };

  return (
    <div className="split-frame" style={{ width: '100%', minHeight: '520px', gap: '1.25rem' }}>
      {/* LEFT COLUMN: Controls & Info */}
      <div className="frame-page-left act24-mint-left" style={{
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)',
        border: '1.5px solid rgba(167, 243, 208, 0.95)',
        borderRadius: '16px',
        padding: '1.35rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(16px)'
      }}>
        <div>
          <div style={{ 
            fontSize: '0.88rem', 
            fontWeight: '900', 
            color: '#0284c7', 
            textTransform: 'uppercase', 
            letterSpacing: '0.06em',
            marginBottom: '0.45rem',
            background: 'rgba(14, 165, 233, 0.18)',
            padding: '0.35rem 0.8rem',
            borderRadius: '8px',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            display: 'inline-block'
          }}>
            Class 6 Science · Chapter 2
          </div>

          <h1 style={{ 
            fontFamily: 'var(--serif-font)', 
            margin: '0.45rem 0 0.85rem 0', 
            fontSize: '1.75rem',
            fontWeight: '900',
            color: '#0f172a',
            letterSpacing: '0.01em'
          }}>
            Key Vocabulary
          </h1>
          
          <p style={{ 
            fontSize: '1.02rem', 
            color: '#334155', 
            fontWeight: '700',
            lineHeight: '1.6', 
            margin: '0 0 1.25rem 0'
          }}>
            Mastering scientific terms is key to understanding the diversity of plants and animals. Use this interactive pane to study glossary words or test yourself.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Choose Mode:
          </span>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button 
              onClick={() => setActiveTab('glossary')}
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                fontSize: '0.92rem',
                fontWeight: '900',
                borderRadius: '10px',
                cursor: 'pointer',
                background: activeTab === 'glossary' 
                  ? '#f59e0b' 
                  : '#ffffff',
                border: activeTab === 'glossary' 
                  ? 'none' 
                  : '1.5px solid rgba(167, 243, 208, 0.95)',
                color: activeTab === 'glossary' ? '#1a0f05' : '#0f172a',
                boxShadow: activeTab === 'glossary' ? '0 4px 14px rgba(245, 158, 11, 0.4)' : '0 2px 6px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              📖 Glossary
            </button>
            <button 
              onClick={() => setActiveTab('game')}
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                fontSize: '0.92rem',
                fontWeight: '900',
                borderRadius: '10px',
                cursor: 'pointer',
                background: activeTab === 'game' 
                  ? '#f59e0b' 
                  : '#ffffff',
                border: activeTab === 'game' 
                  ? 'none' 
                  : '1.5px solid rgba(167, 243, 208, 0.95)',
                color: activeTab === 'game' ? '#1a0f05' : '#0f172a',
                boxShadow: activeTab === 'game' ? '0 4px 14px rgba(245, 158, 11, 0.4)' : '0 2px 6px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              🎮 Match Game
            </button>
          </div>
        </div>

        {activeTab === 'game' && (
          <div style={{
            background: 'rgba(240, 253, 244, 0.95)',
            border: '1.5px solid rgba(167, 243, 208, 0.95)',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            marginTop: '1.25rem',
            fontSize: '0.9rem',
            color: '#0f172a',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <span style={{ fontWeight: '900', color: '#0284c7', display: 'block', marginBottom: '6px' }}>Match Game Progress:</span>
            <span>Matched: <b style={{ color: '#16a34a', transition: 'all 0.3s ease' }}>{matchedPairs.length} / 6</b> pairs</span>
            <span style={{ marginLeft: '14px' }}>Attempts: <b style={{ color: '#b45309', transition: 'all 0.3s ease' }}>{attempts}</b></span>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Grid Space */}
      <div className="frame-page-right" style={{ 
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)',
        border: '2px solid rgba(167, 243, 208, 0.95)',
        borderRadius: '16px',
        padding: '1.15rem 1.35rem',
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: 0, 
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(16px)'
      }}>
        {/* Main Matcher / Glossary Header */}
        <div style={{ 
          borderBottom: '2px solid rgba(167, 243, 208, 0.95)', 
          paddingBottom: '0.65rem', 
          marginBottom: '0.85rem' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ 
              fontSize: '1.2rem', 
              fontWeight: '900', 
              color: '#0284c7',
              letterSpacing: '0.01em'
            }}>
              {activeTab === 'glossary' ? '📕 Interactive Textbook Glossary' : '🎯 Definition Matcher'}
            </span>
          </div>
          {activeTab === 'game' && (
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.88rem', color: '#334155', fontWeight: '700' }}>
              Match each definition with the correct scientific term.
            </p>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {activeTab === 'glossary' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.95rem' }}>
              {terms.map(t => {
                const isFlipped = flippedCardId === t.id;
                return (
                  <div 
                    key={t.id}
                    onClick={() => setFlippedCardId(isFlipped ? null : t.id)}
                    style={{
                      background: isFlipped 
                        ? 'rgba(240, 253, 244, 0.98)' 
                        : '#ffffff',
                      border: isFlipped ? '2px solid #0284c7' : '2px solid rgba(167, 243, 208, 0.95)',
                      borderRadius: '14px',
                      padding: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      minHeight: '160px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: isFlipped ? '0 0 16px rgba(14, 165, 233, 0.2)' : '0 4px 14px rgba(0,0,0,0.06)'
                    }}
                  >
                    {isFlipped ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', height: '100%' }}>
                        <span style={{ fontSize: '0.92rem', color: '#0f172a', lineHeight: '1.5', fontWeight: 700 }}>
                          <strong style={{ color: '#0284c7' }}>Def:</strong> {t.desc}
                        </span>
                        <span style={{ fontSize: '0.84rem', color: '#15803d', fontStyle: 'italic', fontWeight: 700, marginTop: 'auto' }}>
                          Ex: {t.eg}
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                        <div style={{
                          width: '100%',
                          height: '112px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: '1.5px solid rgba(167, 243, 208, 0.95)',
                          background: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px 8px',
                          boxSizing: 'border-box',
                          marginBottom: '0.65rem',
                          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.9), 0 2px 8px rgba(0, 0, 0, 0.04)'
                        }}>
                          <img 
                            src={t.image} 
                            alt={t.word} 
                            style={{ 
                              maxWidth: '100%', 
                              maxHeight: '100%', 
                              width: 'auto', 
                              height: 'auto', 
                              objectFit: 'contain', 
                              display: 'block',
                              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08)) contrast(1.05)'
                            }} 
                          />
                        </div>
                        <span style={{ fontSize: '0.98rem', fontWeight: '900', color: '#0f172a', textAlign: 'center', lineHeight: '1.2' }}>
                          {t.word}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: '700', marginTop: '0.25rem' }}>
                          Click for definition ↻
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div ref={containerRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '440px', gap: '0.75rem' }}>
              {/* SVG Connector Overlay */}
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
                {lines.map(line => {
                  const cX = (line.x1 + line.x2) / 2;
                  const pathData = `M ${line.x1} ${line.y1} C ${cX} ${line.y1}, ${cX} ${line.y2}, ${line.x2} ${line.y2}`;
                  return (
                    <path
                      key={line.id}
                      d={pathData}
                      fill="none"
                      stroke={line.status === 'matched' ? '#16a34a' : '#dc2626'}
                      strokeWidth={line.status === 'matched' ? '3.5' : '2.5'}
                      strokeDasharray={line.status === 'error' ? '6 4' : 'none'}
                      style={{
                        transition: 'all 0.25s ease',
                        filter: line.status === 'matched' ? 'drop-shadow(0 0 6px rgba(22, 163, 74, 0.4))' : 'drop-shadow(0 0 6px rgba(220, 38, 38, 0.4))'
                      }}
                    />
                  );
                })}
              </svg>

              {/* 2-Column Matching Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 36px 1fr', gap: '0.5rem', flex: 1, alignItems: 'stretch' }}>
                {/* LEFT COLUMN: DEFINITIONS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '0.15rem 0.35rem', 
                    fontSize: '0.85rem', 
                    fontWeight: '900', 
                    color: '#b45309', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <span style={{ 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      background: 'rgba(245, 158, 11, 0.2)', 
                      border: '1.5px solid #f59e0b',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.75rem',
                      fontWeight: '900',
                      color: '#b45309'
                    }}>D</span>
                    DEFINITIONS
                  </div>

                  {gameDefs.map((def) => {
                    const isMatched = matchedPairs.includes(def.id);
                    const isSelected = selectedDef === def.id;
                    const isError = errorPair && errorPair.defId === def.id;

                    return (
                      <div
                        key={def.id}
                        ref={el => defRefs.current[def.id] = el}
                        onClick={() => handleDefClick(def.id)}
                        style={{
                          position: 'relative',
                          flex: 1,
                          minHeight: '54px',
                          padding: '0.55rem 0.85rem',
                          borderRadius: '12px',
                          cursor: isMatched ? 'default' : 'pointer',
                          border: isMatched 
                            ? '2px solid #22c55e' 
                            : isError 
                              ? '2px solid #dc2626' 
                              : isSelected 
                                ? '2px solid #f59e0b' 
                                : '2px solid rgba(167, 243, 208, 0.95)',
                          background: isMatched 
                            ? 'rgba(220, 252, 231, 0.7)' 
                            : isError 
                              ? 'rgba(254, 226, 226, 0.8)' 
                              : isSelected 
                                ? 'rgba(254, 243, 199, 0.9)' 
                                : '#ffffff',
                          boxShadow: isSelected 
                            ? '0 0 14px rgba(245, 158, 11, 0.25)' 
                            : isMatched 
                              ? '0 0 10px rgba(34, 197, 94, 0.15)' 
                              : '0 2px 8px rgba(0,0,0,0.04)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          opacity: isMatched ? 0.75 : 1,
                          animation: isError ? 'matcher-shake 0.45s ease' : isMatched ? 'pulse-success 0.3s ease' : 'none',
                          transition: 'border 0.2s, background 0.2s, box-shadow 0.2s'
                        }}
                      >
                        {/* Yellow circular number badge */}
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: isMatched ? '#16a34a' : '#f59e0b',
                          color: isMatched ? '#ffffff' : '#1a0f05',
                          fontWeight: '900',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}>
                          {isMatched ? '✓' : def.num}
                        </div>

                        <div style={{ flex: 1, fontSize: '0.84rem', color: '#0f172a', fontWeight: '700', lineHeight: '1.3' }}>
                          {def.text}
                        </div>

                        {/* Right connection anchor node */}
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: isMatched ? '#16a34a' : isSelected ? '#f59e0b' : '#0284c7',
                          border: '2px solid #ffffff',
                          boxShadow: isSelected ? '0 0 10px #f59e0b' : isMatched ? '0 0 8px #16a34a' : 'none',
                          position: 'absolute',
                          right: '-6px',
                          top: 'calc(50% - 6px)',
                          zIndex: 2,
                          transition: 'all 0.2s ease'
                        }} />
                      </div>
                    );
                  })}
                </div>

                {/* CENTER INSTRUCTION COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', opacity: 0.65 }}>
                  <span style={{ fontSize: '1.2rem', color: '#0284c7' }}>↔</span>
                  <span style={{ fontSize: '0.65rem', color: '#0284c7', fontWeight: '800', textTransform: 'uppercase', writingMode: 'vertical-rl', letterSpacing: '0.12em' }}>
                    Connect
                  </span>
                </div>

                {/* RIGHT COLUMN: WORDS (TERMS) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '0.15rem 0.35rem', 
                    fontSize: '0.85rem', 
                    fontWeight: '900', 
                    color: '#0284c7', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <span style={{ 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '4px', 
                      background: 'rgba(14, 165, 233, 0.18)', 
                      border: '1.5px solid rgba(56, 189, 248, 0.4)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.75rem',
                      fontWeight: '900',
                      color: '#0284c7'
                    }}>W</span>
                    WORDS (TERMS)
                  </div>

                  {gameWords.map((word) => {
                    const isMatched = matchedPairs.includes(word.id);
                    const isSelected = selectedWord === word.id;
                    const isError = errorPair && errorPair.wordId === word.id;

                    return (
                      <div
                        key={word.id}
                        ref={el => wordRefs.current[word.id] = el}
                        onClick={() => handleWordClick(word.id)}
                        style={{
                          position: 'relative',
                          flex: 1,
                          minHeight: '54px',
                          padding: '0.55rem 0.85rem',
                          borderRadius: '12px',
                          cursor: isMatched ? 'default' : 'pointer',
                          border: isMatched 
                            ? '2px solid #22c55e' 
                            : isError 
                              ? '2px solid #dc2626' 
                              : isSelected 
                                ? '2px solid #0284c7' 
                                : '2px solid rgba(167, 243, 208, 0.95)',
                          background: isMatched 
                            ? 'rgba(220, 252, 231, 0.7)' 
                            : isError 
                              ? 'rgba(254, 226, 226, 0.8)' 
                              : isSelected 
                                ? 'rgba(224, 242, 254, 0.9)' 
                                : '#ffffff',
                          boxShadow: isSelected 
                            ? '0 0 14px rgba(14, 165, 233, 0.25)' 
                            : isMatched 
                              ? '0 0 10px rgba(34, 197, 94, 0.15)' 
                              : '0 2px 8px rgba(0,0,0,0.04)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          opacity: isMatched ? 0.75 : 1,
                          animation: isError ? 'matcher-shake 0.45s ease' : isMatched ? 'pulse-success 0.3s ease' : 'none',
                          transition: 'border 0.2s, background 0.2s, box-shadow 0.2s'
                        }}
                      >
                        {/* Left connection anchor node */}
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: isMatched ? '#16a34a' : isSelected ? '#0284c7' : '#0284c7',
                          border: '2px solid #ffffff',
                          boxShadow: isSelected ? '0 0 10px #0284c7' : isMatched ? '0 0 8px #16a34a' : 'none',
                          position: 'absolute',
                          left: '-6px',
                          top: 'calc(50% - 6px)',
                          zIndex: 2,
                          transition: 'all 0.2s ease'
                        }} />

                        {/* Cyan square letter badge */}
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: isMatched ? '#16a34a' : '#0284c7',
                          color: '#ffffff',
                          fontWeight: '900',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}>
                          {isMatched ? '✓' : word.letter}
                        </div>

                        <div style={{ flex: 1, fontSize: '0.92rem', color: '#0f172a', fontWeight: '800' }}>
                          {word.text}
                        </div>

                        {isMatched && (
                          <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: '800' }}>🔒</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MATCH FEEDBACK & SUCCESS BANNER */}
              {matchedPairs.length === 6 && (
                <div style={{ marginTop: '0.5rem', textAlign: 'center', padding: '0.65rem 1rem', background: 'rgba(220, 252, 231, 0.9)', borderRadius: '12px', border: '2px solid #22c55e' }}>
                  <h4 style={{ margin: 0, color: '#15803d', fontSize: '1.05rem', fontWeight: 900 }}>🎉 Excellent Job! All Terms Matched!</h4>
                </div>
              )}

              {/* BOTTOM LEGEND & RESET */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                borderTop: '2px solid rgba(167, 243, 208, 0.95)', 
                paddingTop: '0.65rem', 
                marginTop: 'auto', 
                fontSize: '0.85rem' 
              }}>
                <div style={{ display: 'flex', gap: '1.15rem', alignItems: 'center', color: '#334155', fontWeight: '700' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#16a34a', fontWeight: '900' }}>✓</span> Correct Match
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#dc2626', fontWeight: '900' }}>✕</span> Wrong Match
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>🔒</span> Matched
                  </span>
                </div>
                <button 
                  onClick={initGame}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    background: '#ffffff',
                    border: '1.5px solid rgba(167, 243, 208, 0.95)',
                    color: '#0f172a',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ↻ Reset Game
                </button>
              </div>

              <style>{`
                @keyframes matcher-shake {
                  0%, 100% { transform: translateX(0); }
                  20%, 60% { transform: translateX(-6px); }
                  40%, 80% { transform: translateX(6px); }
                }
                @keyframes pulse-success {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.02); }
                  100% { transform: scale(1); }
                }
              `}</style>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryPane({ lessonId }) {
  const summaries = {
    vocabulary_glossary: [
      "Classification is the process of sorting living things into groups based on shared properties, making them easier to study.",
      "Plants are primarily classified by their stems into Herbs (soft, green), Shrubs (thin, woody, branching at base), and Trees (thick, woody trunk).",
      "There is a strong correlation between a plant's leaf vein pattern (venation) and its root structure.",
      "Reticulate (net-like) venation is typically paired with a Taproot system (one main root).",
      "Parallel (straight line) venation is typically paired with a Fibrous root system (a bundle of thin roots)."
    ],
    chapter_challenge_overview: [
      "Seeds are classified by their number of seed leaves (cotyledons): Monocots (one) and Dicots (two).",
      "The Monocot/Dicot classification links directly to venation and root type, forming a complete predictive model for plant traits.",
      "Animals are grouped based on their mode of movement (locomotion) like walking, flying, or swimming, and their natural home (habitat).",
      "Adaptation refers to special features that help organisms survive in their specific environment, such as a camel's hump or a polar bear's thick fur.",
      "Conserving biodiversity through methods like protecting Sacred Groves is vital for ecological balance."
    ]
  };

  const summaryPoints = summaries[lessonId] || [];

  return (
    <div id="pane-summary-window" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '0.85rem', 
      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)',
      border: '2px solid rgba(167, 243, 208, 0.95)',
      borderRadius: '16px',
      padding: '1.25rem 1.65rem',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
      backdropFilter: 'blur(16px)',
      marginTop: '1rem',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(167, 243, 208, 0.95)', paddingBottom: '0.65rem' }}>
        <span style={{ 
          fontSize: '1.25rem', 
          fontWeight: '900', 
          color: '#0284c7', 
          textTransform: 'uppercase', 
          letterSpacing: '0.06em'
        }}>
          KEY TAKEAWAYS
        </span>
        <span style={{ 
          fontSize: '0.88rem', 
          fontWeight: '800',
          color: '#0284c7',
          background: 'rgba(14, 165, 233, 0.18)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          padding: '0.3rem 0.85rem',
          borderRadius: '8px'
        }}>
          Chapter Summary
        </span>
      </div>
      <div style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {summaryPoints.map((point, i) => (
          <div key={i} style={{ 
            fontSize: '0.98rem', 
            color: '#0f172a', 
            fontWeight: '700',
            lineHeight: '1.55',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            background: '#ffffff',
            border: '1.5px solid rgba(167, 243, 208, 0.95)',
            borderRadius: '10px',
            padding: '0.6rem 0.95rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}>
            <span style={{ color: '#0284c7', fontSize: '1.15rem', lineHeight: '1.2', flexShrink: 0, fontWeight: '900' }}>•</span>
            <span style={{ flex: 1 }}>{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChapterChallengeOverview({ onBack, onComplete, onViewSummary, onCompletionStateChange, activeQuestionIndex, onQuestionChange, isCompleted: isCompletedProp }) {
  const [internalQIndex, setInternalQIndex] = useState(0);
  const currentQuestionIndex = typeof activeQuestionIndex === 'number' ? activeQuestionIndex : internalQIndex;
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [internalCompleted, setInternalCompleted] = useState(false);
  const isCompleted = typeof isCompletedProp === 'boolean' ? isCompletedProp : internalCompleted;
  const celebrationSpokenRef = useRef(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [currentQuestionIndex]);

  const chapterChallengeQuestions = [
    {
        id: 1,
        bloomLevel: 'Analyse',
        difficulty: 'Medium',
        concept: 'Biodiversity, Nature Walk',
        question: "During a nature walk, four students made the following observations about two parks.\n• Student A: Park X has many kinds of plants, birds, butterflies, and insects.\n• Student B: Park Y has mostly one type of grass and only crows.\n• Student C: Park X has plants of different heights and flowering seasons.\n• Student D: Park Y has more benches and walking paths.\nWhich observation BEST supports the idea that Park X has greater biodiversity?",
        options: [ "Student A's observation", "Student B's observation", "Student D's observation", "Both Student B and Student D" ],
        answerIndex: 0,
        explanation: [
            "A place has greater biodiversity when it contains many different kinds of living organisms.",
            "Student A observed different plants, birds, butterflies, and insects, showing a rich variety of life.",
            "Student C also supports biodiversity, but Student A directly highlights the diversity of living organisms.",
            "Benches and walking paths do not indicate biodiversity."
        ]
    },
      {
        id: 2,
        bloomLevel: 'Apply',
        difficulty: 'Medium',
        concept: 'Nature Walk (Activity 2.1)',
        question: "While exploring a school garden, Riya plucks several flowers to examine them closely.\nAman observes the flowers without touching them and writes notes in his notebook.\nWho is following the objective of the nature walk correctly?",
        options: [ "Only Riya", "Only Aman", "Both Riya and Aman", "Neither of them" ],
        answerIndex: 1,
        explanation: [
            "The purpose of a nature walk is to observe nature carefully without disturbing plants or animals.",
            "Aman records his observations while respecting nature.",
            "Riya damages the plants by plucking flowers unnecessarily.",
            "Respecting living organisms is an important scientific attitude and also supports biodiversity conservation."
        ]
    },
    {
        id: 3,
        bloomLevel: 'Analyse',
        difficulty: 'Challenging',
        concept: 'Grouping of Plants',
        question: "Four students grouped the same set of plants differently.\n• Student A: Based on flower colour\n• Student B: Based on stem hardness\n• Student C: Based on leaf arrangement\n• Student D: Based on plant height\nThey argued that only one grouping method was correct.\nWhich statement is scientifically correct?",
        options: [ "Only Student D is correct.", "Only Student A is correct.", "All four grouping methods can be correct if the chosen feature is used consistently.", "Plants can be grouped only by their names." ],
        answerIndex: 2,
        explanation: [
            "Plants can be grouped using different observable characteristics such as height, stem type, leaf arrangement, or flower colour.",
            "The purpose of grouping is to organise plants based on similarities.",
            "There is no single correct method of grouping; what matters is using one feature consistently."
        ]
    },
    {
        id: 4,
        bloomLevel: 'Apply',
        difficulty: 'Easy',
        concept: 'Herbs, Shrubs and Trees',
        question: "A plant is shorter than a child. It has a soft, green stem and no woody branches.\nWhich group does it most likely belong to?",
        options: [ "Tree", "Shrub", "Herb", "Climber" ],
        answerIndex: 2,
        explanation: [
            "Herbs are usually small plants with soft, green, and tender stems.",
            "They do not have thick woody trunks like trees or hard woody stems like shrubs.",
            "The description matches the characteristics of a herb."
        ]
    },
    {
        id: 5,
        bloomLevel: 'Evaluate',
        difficulty: 'Challenging',
        concept: 'Biodiversity and Interdependence',
        question: "A village cuts down almost all its large fruit trees.\nWhich change is MOST likely to happen first?",
        options: [ "Birds that depend on those trees for food and shelter may decrease.", "Fish in a nearby pond will immediately disappear.", "The number of mountains in the area will reduce.", "All insects in the village will become extinct." ],
        answerIndex: 0,
        explanation: [
            "Plants and animals depend on one another in many ways.",
            "Fruit trees provide food, nesting places, and shelter for many birds.",
            "If these trees are removed, the bird population may decline due to loss of resources.",
            "This demonstrates the interdependence of living organisms."
        ]
    },
    {
        id: 6,
        bloomLevel: 'Analyse',
        difficulty: 'Medium',
        concept: 'Climbers and Creepers',
        question: "Two plants are growing in a garden.\n• Plant P has a weak stem and grows upward by wrapping around a pole.\n• Plant Q has a weak stem and spreads along the ground without any support.\nWhich statement correctly identifies these plants?",
        options: [ "Plant P is a creeper and Plant Q is a climber.", "Plant P is a climber and Plant Q is a creeper.", "Both are herbs.", "Both are shrubs." ],
        answerIndex: 1,
        explanation: [
            "Climbers have weak stems and need support to grow upward.",
            "Creepers also have weak stems but spread along the ground.",
            "Plant P uses a pole, so it's a climber; Plant Q grows on the ground, so it's a creeper."
        ]
    },
    {
        id: 7,
        bloomLevel: 'Apply',
        difficulty: 'Medium',
        concept: 'Leaf Venation',
        question: "A student observes a leaf with many veins forming a net-like pattern around a thick middle vein.\nWhat type of venation does this leaf have?",
        options: [ "Parallel venation", "Fibrous venation", "Reticulate venation", "Circular venation" ],
        answerIndex: 2,
        explanation: [
            "In reticulate venation, the veins form a network around the main vein of the leaf.",
            "This pattern is commonly seen in plants such as hibiscus and mango.",
            "Recognising venation helps in grouping plants and is related to the root system type."
        ]
    },
    {
        id: 8,
        bloomLevel: 'Analyse',
        difficulty: 'Challenging',
        concept: 'Relationship between Leaf Venation and Root System',
        question: "A student finds an unknown plant with parallel venation in its leaves.\nWithout digging up the plant, which prediction is MOST reasonable?",
        options: [ "It is likely to have a fibrous root system.", "It must have a taproot.", "It cannot have roots.", "The type of root cannot be related to leaf venation." ],
        answerIndex: 0,
        explanation: [
            "Most plants with parallel venation also have fibrous roots.",
            "This relationship is a general rule taught in the Grade 6 curriculum.",
            "Therefore, predicting a fibrous root system is scientifically reasonable based on this observed pattern."
        ]
    },
    {
        id: 9,
        bloomLevel: 'Apply',
        difficulty: 'Medium',
        concept: 'Monocots and Dicots',
        question: "A student soaks a seed, removes its seed coat, and notices that it has two cotyledons.\nWhich additional feature is MOST likely to be present in the mature plant?",
        options: [ "Parallel venation and fibrous roots", "Reticulate venation and taproot", "No leaves", "Weak stem that always creeps on the ground" ],
        answerIndex: 1,
        explanation: [
            "Seeds with two cotyledons belong to dicot plants.",
            "Most dicots have reticulate venation in their leaves and a taproot system.",
            "Observing one feature (cotyledons) often helps predict the others (venation, root type)."
        ]
    },
    {
        id: 10,
        bloomLevel: 'Evaluate',
        difficulty: 'Challenging',
        concept: 'Importance of Grouping',
        question: "A science club collected photographs of 150 different plants.\nOne student suggested arranging them randomly, while another suggested grouping them based on stem type, leaf venation, and plant height.\nWhy is the second suggestion better?",
        options: [ "It makes studying similarities and differences easier.", "It changes the plants into new species.", "It increases the number of plants collected.", "It helps plants grow faster." ],
        answerIndex: 0,
        explanation: [
            "Grouping helps organise information in a meaningful way.",
            "When plants are grouped by common characteristics, comparing them becomes easier.",
            "It is an important scientific method used in biology to study biodiversity efficiently."
        ]
    },
    {
        id: 11,
        bloomLevel: 'Analyse',
        difficulty: 'Medium',
        concept: 'Grouping Animals Based on Movement',
        question: "A group of students prepared the following table after observing animals.\nAnimal\tBody Part Used for Movement\nFish\tFins\nGoat\tLegs\nPigeon\tLegs and Wings\nHousefly\tLegs and Wings\nWhich conclusion is MOST appropriate?",
        options: [ "All animals use the same body parts for movement.", "Animals use different body parts depending on how they move.", "Only birds can move from one place to another.", "Fish use wings for swimming." ],
        answerIndex: 1,
        explanation: [
            "Different animals move in different ways depending on their body structure.",
            "The table clearly shows that fish use fins, goats use legs, and birds use both legs and wings.",
            "Observing movement is one way to group animals scientifically."
        ]
    },
    {
        id: 12,
        bloomLevel: 'Apply',
        difficulty: 'Medium',
        concept: 'Adaptation',
        question: "A farmer brings a fish out of water and keeps it on dry land.\nWhat is the BEST explanation for why the fish cannot survive for long?",
        options: [ "Fish need water because their bodies are adapted to live in water.", "Fish become smaller outside water.", "Fish forget how to swim on land.", "Fish only eat food found in ponds." ],
        answerIndex: 0,
        explanation: [
            "Fish are adapted to aquatic habitats.",
            "Their gills are specialized to take oxygen from water, not air.",
            "Adaptations help organisms survive only in their suitable habitats."
        ]
    },
    {
        id: 13,
        bloomLevel: 'Analyse',
        difficulty: 'Challenging',
        concept: 'Desert Adaptations (Camel)',
        question: "A camel living in the hot desert has long legs and wide hooves.\nWhy are these features useful?",
        options: [ "They help the camel walk on loose sand without sinking easily.", "They help the camel climb tall trees.", "They allow the camel to swim faster.", "They help the camel catch birds." ],
        answerIndex: 0,
        explanation: [
            "Camels have special adaptations for desert life.",
            "Long legs keep their bodies away from the hot sand.",
            "Wide hooves spread their weight over a larger area, preventing sinking."
        ]
    },
    {
        id: 14,
        bloomLevel: 'Evaluate',
        difficulty: 'Challenging',
        concept: 'Habitat',
        question: "Assertion (A): A habitat provides food, water, air and shelter to living organisms.\nReason (R): Every plant and animal can survive equally well in any habitat.\nChoose the correct answer.",
        options: [ "Both A and R are true, and R explains A.", "Both A and R are true, but R does not explain A.", "A is true, but R is false.", "A is false, but R is true." ],
        answerIndex: 2,
        explanation: [
            "Assertion (A) is true: A habitat provides the essential resources for survival.",
            "Reason (R) is false: Different organisms are adapted to different habitats and cannot survive equally well everywhere.",
            "A fish cannot survive in a desert, and a camel cannot survive underwater."
        ]
    },
    {
        id: 15,
        bloomLevel: 'Analyse',
        difficulty: 'Challenging',
        concept: 'Biodiversity Conservation',
        question: "A town plans to cut down a forest to build a large shopping complex.\nWhich students have made scientifically correct statements?\n• Student P: Many animals may lose their homes.\n• Student Q: Biodiversity may decrease.\n• Student R: Habitat destruction can affect food chains.\n• Student S: Trees will immediately turn into grass.",
        options: [ "Only P and Q", "P, Q and R", "Only S", "Q and S only" ],
        answerIndex: 1,
        explanation: [
            "Statements P, Q, and R are all correct ecological effects of deforestation.",
            "Forests provide habitats (P), so their destruction reduces biodiversity (Q) and disturbs food chains (R).",
            "Statement S is incorrect as trees do not turn into grass."
        ]
    },
    {
        id: 16,
        bloomLevel: 'Apply',
        difficulty: 'Medium',
        concept: 'Terrestrial, Aquatic and Amphibians',
        question: "A teacher asks students to group the following animals based on their habitats:\nFish, Frog, Camel, Whale\nWhich option correctly groups them?",
        options: [ "Terrestrial – Camel; Aquatic – Fish, Whale; Amphibian – Frog", "Terrestrial – Camel, Frog; Aquatic – Fish; Amphibian – Whale", "Terrestrial – Camel; Aquatic – Fish, Frog; Amphibian – Whale", "Terrestrial – Whale; Aquatic – Camel; Amphibian – Fish" ],
        answerIndex: 0,
        explanation: [
            "Terrestrial animals like camels live on land.",
            "Aquatic animals like fish and whales live in water.",
            "Amphibians like frogs can live both on land and in water."
        ]
    },
    {
        id: 17,
        bloomLevel: 'Analyse',
        difficulty: 'Challenging',
        concept: 'Adaptations of Deodar Tree',
        question: "A deodar tree grows in snowy mountains. It has a conical shape with sloping branches.\nWhat is the BEST reason for these features?",
        options: [ "They help snow slide off easily, preventing damage to the branches.", "They help the tree store more fruits.", "They make the tree grow faster than all other plants.", "They help insects climb the tree." ],
        answerIndex: 0,
        explanation: [
            "Deodar trees are adapted to regions with heavy snowfall.",
            "Their conical shape and sloping branches allow snow to slide off easily.",
            "This prevents branches from breaking under the weight of the snow."
        ]
    },
    {
        id: 18,
        bloomLevel: 'Evaluate',
        difficulty: 'Challenging',
        concept: 'Scientists – Janaki Ammal & Salim Ali',
        question: "Two students prepared reports on famous Indian scientists.\n• Student A: Janaki Ammal worked to document and conserve India's plant biodiversity.\n• Student B: Salim Ali studied birds, their habitats and migration.\nWhich statement is correct?",
        options: [ "Only Student A is correct.", "Only Student B is correct.", "Both students are correct.", "Neither student is correct." ],
        answerIndex: 2,
        explanation: [
            "Both statements are correct.",
            "Janaki Ammal was a renowned Indian botanist.",
            "Salim Ali, the 'Birdman of India,' was a famous ornithologist."
        ]
    },
    {
        id: 19,
        bloomLevel: 'Analyse',
        difficulty: 'Medium',
        concept: 'Habitat Destruction and Conservation',
        question: "A wetland is filled with soil to construct buildings.\nWhich change is MOST likely to happen?",
        options: [ "Aquatic plants and animals may lose their habitat.", "Desert plants will immediately grow there.", "Fish will become land animals.", "The biodiversity of the wetland will increase automatically." ],
        answerIndex: 0,
        explanation: [
            "Wetlands are habitats for many aquatic plants and animals.",
            "Destroying a wetland means these organisms lose their homes, food sources, and breeding places.",
            "This leads to a decrease in biodiversity."
        ]
    },
    {
        id: 20,
        bloomLevel: 'Evaluate',
        difficulty: 'Challenging',
        concept: 'Conservation',
        question: "Which action BEST supports the conservation of biodiversity?",
        options: [ "Protecting sacred groves, conserving tiger habitats and restoring cheetah populations.", "Cutting forests to build more roads through wildlife habitats.", "Hunting endangered animals to reduce competition.", "Removing all wild plants from forests." ],
        answerIndex: 0,
        explanation: [
            "Conservation aims to protect plants, animals, and their habitats.",
            "Actions like protecting sacred groves, Project Tiger, and the Cheetah Reintroduction Project are real conservation efforts.",
            "The other options all lead to biodiversity loss."
        ]
    },
    {
        id: 21,
        bloomLevel: 'Analyse',
        difficulty: 'Challenging',
        concept: 'Adaptations of Rhododendron',
        question: "Two rhododendron plants are observed in different mountain regions.\n• Plant A: Short with small leaves, growing on windy mountain tops.\n• Plant B: Taller with larger leaves, growing in a less windy mountain area.\nWhich conclusion is the BEST?",
        options: [ "Both plants are different species.", "Plant features can vary as adaptations to different environmental conditions.", "Plant A is unhealthy because it is shorter.", "Leaf size is not related to the environment." ],
        answerIndex: 1,
        explanation: [
            "Plants in different environments often develop different features to survive.",
            "Shorter plants with smaller leaves are better adapted to windy conditions.",
            "These differences are adaptations, not necessarily signs of different species or poor health."
        ]
    },
    {
        id: 22,
        bloomLevel: 'Apply',
        difficulty: 'Medium',
        concept: 'Adaptations of Duck',
        question: "A duck has webbed feet, while a pigeon does not.\nWhich activity do the duck's webbed feet help it perform most efficiently?",
        options: [ "Climbing trees", "Swimming in water", "Digging deep burrows", "Running very fast on land" ],
        answerIndex: 1,
        explanation: [
            "Webbed feet have skin stretched between the toes, creating a broad surface.",
            "This structure is an adaptation that helps ducks push against water and swim efficiently.",
            "Body part structures are closely related to an animal's habitat and lifestyle."
        ]
    },
    {
        id: 23,
        bloomLevel: 'Evaluate',
        difficulty: 'Challenging',
        concept: 'Activity 2.3 – Grouping Organisms',
        question: "During Activity 2.3, four groups classified the same set of animals using different features.\n• Group A: Habitat\n• Group B: Food habits\n• Group C: Body colour\n• Group D: Type of movement\nThe teacher said that all four groups had valid classifications.\nWhy did the teacher say this?",
        options: [ "Animals can be grouped using different observable characteristics.", "There is only one correct way to classify animals.", "Classification depends only on the names of animals.", "Colour is the only scientific basis for grouping." ],
        answerIndex: 0,
        explanation: [
            "Scientific grouping can be based on many different observable features.",
            "As long as the chosen feature is used consistently, the grouping is scientifically valid.",
            "Different classification methods help us study biodiversity from different perspectives."
        ]
    },
    {
        id: 24,
        bloomLevel: 'Analyse',
        difficulty: 'Medium',
        concept: 'Biodiversity and Interdependence',
        question: "A forest has many flowering plants. Due to excessive pesticide use, most butterflies disappear.\nWhich effect is MOST likely?",
        options: [ "Pollination of many flowering plants may decrease.", "Trees will immediately stop producing oxygen.", "Rivers in the forest will dry up overnight.", "All birds will disappear at once." ],
        answerIndex: 0,
        explanation: [
            "Butterflies are important pollinators, carrying pollen from one flower to another.",
            "If their population decreases, many flowering plants may produce fewer seeds and fruits.",
            "This demonstrates the interdependence between plants and animals in an ecosystem."
        ]
    },
    {
        id: 25,
        bloomLevel: 'Create / Evaluate',
        difficulty: 'Challenging',
        concept: 'Biodiversity Conservation',
        question: "Your school wants to improve biodiversity on its campus.\nWhich plan would be MOST effective?",
        options: [ "Plant only one type of ornamental plant throughout the campus.", "Plant a variety of native trees, shrubs and herbs, provide water for birds, and avoid disturbing nests.", "Remove all insects because they look unpleasant.", "Cut old trees every year to make the campus look cleaner." ],
        answerIndex: 1,
        explanation: [
            "A healthy ecosystem contains a variety of plants and animals.",
            "Planting a variety of native species provides food and shelter for local wildlife.",
            "Conserving biodiversity requires protecting and creating suitable habitats."
        ]
    }
  ];

  const handleAnswerSelect = (optionIndex) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < chapterChallengeQuestions.length - 1) {
      if (onQuestionChange) {
        onQuestionChange(currentQuestionIndex + 1);
      } else {
        setInternalQIndex(currentQuestionIndex + 1);
      }
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Completed all 25 questions!
      setInternalCompleted(true);
      if (onCompletionStateChange) onCompletionStateChange(true);
      if (onComplete) onComplete();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const completionAudioPlayedRef = useRef(false);

  useEffect(() => {
    if (isCompleted && !completionAudioPlayedRef.current) {
      completionAudioPlayedRef.current = true;
      const textToSpeak = "Excellent work! You have successfully completed all the Chapter 2 challenges.";
      
      const timer = setTimeout(() => {
        if (typeof voiceService !== 'undefined' && voiceService.speak) {
          voiceService.speak({
            text: textToSpeak,
            role: 'ancient_man', // Realistic adult male voice
            onError: () => {
              speakWithProfile(textToSpeak, 'Dr. Raghu', false);
            }
          });
        } else {
          speakWithProfile(textToSpeak, 'Dr. Raghu', false);
        }
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  const currentQuestion = chapterChallengeQuestions[currentQuestionIndex];

  if (isCompleted) {
    return (
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundImage: `url(${completedCh2Bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2.5rem 2rem 2.2rem 2rem',
        boxSizing: 'border-box',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Top: Central Completion Heading */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          paddingTop: '0.25rem'
        }}>
          <h1 style={{
            fontFamily: 'var(--serif-font)',
            fontSize: 'clamp(2rem, 3.5vw, 2.7rem)',
            fontWeight: '900',
            color: '#14532d',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            margin: 0,
            textShadow: '0 2px 14px rgba(255, 255, 255, 0.95), 0 0 24px rgba(255, 255, 255, 0.85)'
          }}>
            CHAPTER 2 COMPLETED!
          </h1>
        </div>

        {/* Lower Body / Torso Area: Encouraging Message (ZERO face obstruction, sits completely below all faces) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          marginTop: 'auto',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(20, 83, 45, 0.3)',
            borderRadius: '16px',
            padding: '0.75rem 1.75rem',
            boxShadow: '0 8px 28px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(20, 83, 45, 0.15)',
            maxWidth: '740px',
            width: '90%',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}>
            <p style={{
              fontSize: 'clamp(1.15rem, 1.8vw, 1.42rem)',
              fontWeight: '900',
              color: '#14532d',
              lineHeight: '1.4',
              letterSpacing: '0.01em',
              margin: 0,
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.95)'
            }}>
              “Excellent work! You have successfully completed all the Chapter 2 challenges.”
            </p>
          </div>
        </div>

        {/* Bottom Action Area with ONLY Back to Chapters */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => {
              if (onBack) {
                onBack();
              }
            }}
            style={{
              padding: '0.95rem 2.75rem',
              fontSize: '1.1rem',
              fontWeight: '800',
              borderRadius: '14px',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
              border: '1.5px solid #38bdf8',
              color: '#ffffff',
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.45), 0 0 16px rgba(14, 165, 233, 0.5)',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(14, 165, 233, 0.7)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.45), 0 0 16px rgba(14, 165, 233, 0.5)'; }}
          >
            🏠 Back to Chapters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="split-frame" style={{ width: '100%', minHeight: '480px', gap: '1.25rem' }}>
      {/* LEFT PANE: Question, Metadata */}
      <div className="frame-page-left act24-mint-left" style={{ 
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)', 
        border: '1.5px solid rgba(167, 243, 208, 0.95)',
        borderRadius: '16px',
        padding: '1.5rem 1.75rem', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(16px)'
      }}>
        <div style={{ 
          fontSize: '1.15rem', 
          fontWeight: '900', 
          color: '#b45309', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          borderBottom: '2px solid rgba(167, 243, 208, 0.95)', 
          paddingBottom: '0.65rem', 
          marginBottom: '1rem' 
        }}>
          CHAPTER CHALLENGE - QUESTION {currentQuestion.id} OF {chapterChallengeQuestions.length}
        </div>
        <h2 style={{ 
          fontFamily: 'var(--serif-font)', 
          margin: '0 0 1.25rem 0', 
          fontSize: '1.18rem', 
          color: '#0f172a', 
          whiteSpace: 'pre-line', 
          fontWeight: '700', 
          lineHeight: '1.75'
        }}>
          {currentQuestion.question}
        </h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', fontSize: '0.85rem', marginTop: 'auto', paddingTop: '1rem' }}>
            <span style={{ background: '#ffffff', border: '1.5px solid rgba(167, 243, 208, 0.95)', color: '#0f172a', padding: '0.35rem 0.85rem', borderRadius: '8px', fontWeight: '700', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}><b style={{ color: '#0284c7' }}>Difficulty:</b> {currentQuestion.difficulty}</span>
            <span style={{ background: '#ffffff', border: '1.5px solid rgba(167, 243, 208, 0.95)', color: '#0f172a', padding: '0.35rem 0.85rem', borderRadius: '8px', fontWeight: '700', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}><b style={{ color: '#0284c7' }}>Concept:</b> {currentQuestion.concept}</span>
        </div>
      </div>

      {/* RIGHT PANE: Options + Explanation */}
      <div className="frame-page-right" style={{ 
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)',
        border: '2px solid rgba(167, 243, 208, 0.95)',
        borderRadius: '16px',
        padding: '1.5rem 1.75rem', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        gap: '1rem', 
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(16px)',
        transition: 'all 0.3s ease-in-out' 
      }}>
        {/* Options container that moves up altogether when answered */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.85rem', 
          transform: isAnswered ? 'translateY(-10px)' : 'none', 
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}>
          {currentQuestion.options.map((option, index) => {
            const isCorrect = index === currentQuestion.answerIndex;
            const isSelected = index === selectedAnswer;
            let buttonStyle = {
              display: 'block',
              width: '100%',
              padding: '1.1rem 1.35rem',
              border: '2px solid rgba(167, 243, 208, 0.95)',
              borderRadius: '12px',
              textAlign: 'left',
              background: '#ffffff',
              color: '#0f172a',
              fontWeight: '800',
              fontSize: '1.05rem',
              cursor: isAnswered ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
              lineHeight: '1.4'
            };

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle.background = 'rgba(220, 252, 231, 0.95)';
                buttonStyle.borderColor = '#22c55e';
                buttonStyle.color = '#15803d';
                buttonStyle.boxShadow = '0 0 16px rgba(34, 197, 94, 0.3)';
              } else if (isSelected) {
                buttonStyle.background = 'rgba(254, 226, 226, 0.95)';
                buttonStyle.borderColor = '#dc2626';
                buttonStyle.color = '#991b1b';
                buttonStyle.boxShadow = '0 0 16px rgba(220, 38, 38, 0.3)';
              } else {
                 buttonStyle.opacity = 0.5;
              }
            }

            return (
              <button key={index} onClick={() => handleAnswerSelect(index)} disabled={isAnswered} style={buttonStyle}>
                {option}
              </button>
            );
          })}
        </div>

        {/* Explanation appears below, sliding/opening down */}
        {isAnswered && (
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '14px', 
            padding: '1.15rem 1.25rem', 
            maxHeight: '260px', 
            overflowY: 'auto',
            border: '2px solid rgba(167, 243, 208, 0.95)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <h4 style={{ margin: 0, color: '#0284c7', fontSize: '1.05rem', fontWeight: '900' }}>Explanation</h4>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentQuestion.explanation.map((point, i) => (
                <li 
                  key={i} 
                  className="explanation-point-animated"
                  style={{ 
                    fontSize: '0.92rem', 
                    color: '#0f172a', 
                    lineHeight: '1.6',
                    fontWeight: '600',
                    animationDelay: `${i * 0.25}s` 
                  }}
                >
                  {point}
                </li>
              ))}
            </ul>

            <button 
              onClick={handleNextQuestion} 
              className="primary" 
              style={{ 
                marginTop: '0.75rem', 
                padding: '0.65rem 1.5rem', 
                borderRadius: '10px', 
                fontSize: '0.95rem',
                fontWeight: '900',
                background: '#f59e0b',
                border: 'none',
                color: '#1a0f05',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
                alignSelf: 'flex-end',
                transition: 'all 0.2s ease'
              }}
            >
              {currentQuestionIndex < chapterChallengeQuestions.length - 1 ? 'Next Question →' : 'Finish Quiz ✓'}
            </button>
          </div>
        )}
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
  onSoundButtonVisibilityChange,
  coverBgImage,
  coverBgVideo,
  learningLabBg,
  levelMapBg,
}) {
  const { theme } = useTheme();
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
  const [showBriefing, setShowBriefing] = useState(false);
  const [fsBarVisible, setFsBarVisible] = useState(false);

  // Level Map Auto-hide States
  const [isLevelMapOpen, setIsLevelMapOpen] = useState(false);

  useEffect(() => {
    if (chapterNum === 2) {
      const isBeforeOrAtScenes = stage === 'cover' || stage === 'slogan' || stage === 'scenes';
      onSoundButtonVisibilityChange?.(isBeforeOrAtScenes);
    }
  }, [chapterNum, stage, onSoundButtonVisibilityChange]);
  const hoverTimeoutRef = useRef(null);

  const handleLevelMapEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsLevelMapOpen(true);
  };

  const handleLevelMapLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsLevelMapOpen(false);
    }, 400);
  };

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
  const [activeQuizQuestionIdx, setActiveQuizQuestionIdx] = useState(0);
  const [dykExpanded, setDykExpanded] = useState(false);

  // Progress tracking states
  const [contentLessonProgress, setContentLessonProgress] = useState({});
  const [activityStatus, setActivityStatus] = useState({});
  const [isChapter2Completed, setIsChapter2Completed] = useState(false);

  // Chapter 2 strict 50-step sequence state
  const [ch2FlowIndex, setCh2FlowIndex] = useState(0);
  const [appreciatingSubStep, setAppreciatingSubStep] = useState('appreciate');
  const [challengeQuestionIdx, setChallengeQuestionIdx] = useState(0);

  const goToChapter2Step = (targetIndex) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (targetIndex < 0) {
      onBack();
      return;
    }
    if (targetIndex >= CHAPTER_2_FLOW.length) {
      return;
    }
    
    const step = CHAPTER_2_FLOW[targetIndex];
    setCh2FlowIndex(targetIndex);

    if (step.type === 'stage') {
      setStage(step.stage);
      setIsChapter2Completed(false);
      return;
    }

    setStage('lab');
    if (step.type === 'lab') {
      setActiveLevelId(step.levelId);
      setActiveActivityIdx(step.actIdx || 0);
      setActivityFocused(step.focused);
      setActiveSlide(step.slide || 0);
      if (step.subStep) {
        setAppreciatingSubStep(step.subStep);
      }
      setIsChapter2Completed(false);
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    } else if (step.type === 'challenge') {
      setActiveLevelId('lvl-9');
      setChallengeQuestionIdx(step.qIdx);
      setIsChapter2Completed(false);
      setActivityFocused(false);
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    } else if (step.type === 'completed') {
      setActiveLevelId('lvl-9');
      setIsChapter2Completed(true);
      setActivityFocused(false);
    }
  };

  const timelineContainerRef = useRef(null);

  const activeLevel = CHAPTER_2_LEVELS.find(l => l.id === activeLevelId) || CHAPTER_2_LEVELS[0];
  const totalLevels = CHAPTER_2_LEVELS.length;
  const activeLevelIdx = CHAPTER_2_LEVELS.findIndex(l => l.id === activeLevelId);
  const activeActivity = activeLevel.activities ? (activeLevel.activities[activeActivityIdx] || activeLevel.activities[0]) : null;
  const isCompleted = activeActivity ? activityStatus[activeActivity.id] === 'done' : false;

  useEffect(() => {
    if (chapterNum !== 2 || stage !== 'lab') return;
    setQuizAnswers({});
    setQuizChecked(false);
    setActiveQuizQuestionIdx(0);
    if (activeLevelId !== 'lvl-9') {
      setIsChapter2Completed(false);
    }
  }, [activeLevelId, chapterNum, stage]);

  // Strict Silence Guard for Activity 2.1 — Plants (Table 2.1) — p.11
  const isCh2PlantsP11 = chapterNum === 2 && stage === 'lab' && activeLevelId === 'lvl-1' && activeActivityIdx === 0;

  useEffect(() => {
    if (isCh2PlantsP11) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isCh2PlantsP11]);

  useEffect(() => {
    if (onHeaderVisibilityChange) {
      if (stage === 'lab') {
        const isFullscreenActive = isFullscreen || !!activeContentLesson || !!activeActivitySectionId;
        onHeaderVisibilityChange(!isFullscreenActive);
      } else {
        // Hide header on Cover and Slogan stages
        onHeaderVisibilityChange(false);
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
    // For Chapter 2, go through scenes then checkpoint before entering the lab
    if (chapterNum === 2) {
      setStage("scenes");
    } else {
      setStage("lab");
    }
  };

  const handleEnterLabDirectly = () => {
    // Enter lab at Activity 2.1 Plants (lvl-1, activity index 0) with activity focused
    setActiveLevelId("lvl-1");
    setActiveActivityIdx(0);
    setActivityFocused(true);
    setShowBriefing(false);
    setStage("lab");
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const handleExitLab = () => {
    // If chapterNum is 2, the back button exits straight to main chapters menu via onBack
    if (chapterNum === 2) {
      onBack();
    } else {
      setStage("slogan");
    }
  };

  const [isReading, setIsReading] = useState(false);

  const handleReadAloud = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsReading(false);
    };
    utterance.onerror = () => {
      setIsReading(false);
    };
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  const handleStopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
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
            isFullscreen={isFullscreen}
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
                setActivityFocused(null);
                setTimeout(() => {
                  const quizPaneEl = document.getElementById("pane-quiz-window");
                  if (quizPaneEl) {
                    quizPaneEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }
            }}
          />
        );
      }
      case "appreciating_biodiversity":
        return (
          <AppreciatingBiodiversityActivity 
            onBackToDashboard={onBack} 
            subStep={appreciatingSubStep}
            onSubStepChange={(s) => {
              setAppreciatingSubStep(s);
              if (s === 'board') setCh2FlowIndex(6);
              if (s === 'quiz') setCh2FlowIndex(7);
            }}
          />
        );
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
    const isCh2SceneQuiz = chapterNum === 2 && lessonId === 'biodiversity_concept';

    return (
      <div id="pane-quiz-window" className="glass-panel" style={{ display: (!isFullscreen || activityFocused !== true) ? 'flex' : 'none', flexDirection: 'column', gap: '1.25rem', borderTop: '1px dashed var(--border)', paddingTop: '2.5rem' }}>
        {(!showQuiz || !isCh2SceneQuiz) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border)', paddingBottom: '1rem' }}>
          <span style={{ fontSize: '1.45rem', fontWeight: '900', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'rgba(99,102,241,0.18)', padding: '0.5rem 1.25rem', borderRadius: '12px', border: '2px solid rgba(99,102,241,0.4)', boxShadow: '0 4px 14px rgba(99,102,241,0.2)' }}>
            {showQuiz ? '📝 CHECKPOINT QUIZ' : '💡 DID YOU KNOW?'}
          </span>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {showQuiz ? `Question ${activeQuizQuestionIdx + 1} of ${levelQuiz.length}` : (
              chapterNum === 2 ? (
                <button 
                  onClick={() => setDykExpanded(!dykExpanded)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    background: dykExpanded ? 'var(--card-bg)' : 'var(--accent)',
                    color: dykExpanded ? 'var(--text-secondary)' : '#fff',
                    border: dykExpanded ? '1px solid var(--border)' : '1px solid var(--accent)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: dykExpanded ? 'none' : '0 2px 8px rgba(99,102,241,0.25)'
                  }}
                >
                  {dykExpanded ? 'Close ✕' : 'Explore Facts ➔'}
                </button>
              ) : 'Fascinating science facts'
            )}
          </div>
        </div>
        )}

        {showQuiz ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {quizChecked || isCh2SceneQuiz ? (
              // Quiz completed: show score summary + Did You Know again below
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {!isCh2SceneQuiz && (
                  <div style={{ padding: '1.5rem', borderRadius: '18px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-heading)' }}>
                        🎉 Quiz Completed!
                      </span>
                      <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                        Your Score: <b>{levelQuiz.filter((qObj, qIdx) => quizAnswers[qIdx] === qObj.correct).length} / {levelQuiz.length}</b> Correct
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <button
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizChecked(false);
                          setActiveQuizQuestionIdx(0);
                        }}
                        className="glass-btn"
                        style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
                      >
                        🔄 Retry Quiz
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ borderTop: isCh2SceneQuiz ? 'none' : '1px dashed var(--border)', paddingTop: isCh2SceneQuiz ? '0' : '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '0.95rem', color: 'var(--text-heading)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>
                    💡 Reinforce Your Learning
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {dykList.slice(0, 3).map((fact, idx) => {
                      const colors = [
                        { bg: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(129,140,248,0.02) 100%)', border: 'rgba(99,102,241,0.2)', icon: '💡', accent: 'var(--accent)' },
                        { bg: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(251,191,36,0.02) 100%)', border: 'rgba(245,158,11,0.2)', icon: '✨', accent: 'var(--warning)' },
                        { bg: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(52,211,153,0.02) 100%)', border: 'rgba(16,185,129,0.2)', icon: '🌱', accent: 'var(--success)' }
                      ];
                      const design = colors[idx % colors.length];
                      return (
                        <div key={idx} style={{ padding: '1.45rem', borderRadius: '20px', background: design.bg, border: `2px solid ${design.border}`, display: 'flex', gap: '1.1rem', alignItems: 'flex-start', boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                          <span style={{ fontSize: '1.85rem', lineHeight: '1' }}>{design.icon}</span>
                          <div style={{ flex: 1 }}>
                            <strong style={{ display: 'block', marginBottom: '0.4rem', color: design.accent, fontSize: '1.05rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              Fact {idx + 1}
                            </strong>
                            <p style={{ margin: 0, fontSize: '1.12rem', color: 'var(--text-heading)', fontWeight: '700', lineHeight: '1.6' }}>
                              {fact}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              // Active question view (one-at-a-time)
              (() => {
                const qIdx = activeQuizQuestionIdx;
                const qObj = levelQuiz[qIdx];
                const selectedOpt = quizAnswers[qIdx];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = selectedOpt === qObj.correct;

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="glass-panel" style={{ padding: '1.75rem', border: '1px solid var(--border)', borderRadius: '20px', background: 'var(--card-bg)', backdropFilter: 'blur(8px)', boxShadow: '0 8px 32px rgba(0,0,0,0.02)' }}>
                      <p style={{ margin: '0 0 1.5rem 0', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--text-heading)', lineHeight: '1.4' }}>
                        Q{qIdx + 1}: {qObj.q}
                      </p>
                      
                      <div style={{ display: 'grid', gap: '1.2rem' }}>
                        {qObj.opts.map((opt, oIdx) => {
                          const isSelected = selectedOpt === oIdx;
                          const isCorrectOption = qObj.correct === oIdx;

                          // Visual state calculations
                          let borderStyle = '1px solid var(--border)';
                          let bgStyle = 'var(--page-bg)';
                          let colorStyle = 'var(--text-primary)';
                          let opacityVal = 1;

                          if (isAnswered) {
                            if (isCorrectOption) {
                              borderStyle = '2.5px solid var(--success)';
                              bgStyle = 'rgba(16, 185, 129, 0.1)';
                              colorStyle = 'var(--success)';
                            } else if (isSelected) {
                              borderStyle = '2.5px solid var(--danger)';
                              bgStyle = 'rgba(239, 68, 68, 0.1)';
                              colorStyle = 'var(--danger)';
                            } else {
                              opacityVal = 0.55;
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={isAnswered}
                              onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                              style={{
                                textAlign: 'left',
                                padding: '1.1rem 1.4rem',
                                borderRadius: '14px',
                                border: borderStyle,
                                background: bgStyle,
                                color: colorStyle,
                                opacity: opacityVal,
                                cursor: isAnswered ? 'default' : 'pointer',
                                fontSize: '1.05rem',
                                fontWeight: isSelected || (isAnswered && isCorrectOption) ? 'bold' : 'normal',
                                width: '100%',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {isAnswered && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem', borderTop: '1px dashed var(--border)', paddingTop: '1.25rem' }}>
                          <div style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            {isCorrect ? '🎉 Correct Answer!' : '❌ Incorrect Answer.'}
                          </div>

                          <div style={{ padding: '1.1rem 1.4rem', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.04)', borderLeft: '5px solid var(--accent)' }}>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>
                              💡 Why this is the answer (Reasoning):
                            </strong>
                            <p style={{ margin: 0, fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: '1.65', whiteSpace: 'pre-line' }}>
                              {qObj.explanation}
                            </p>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                            {qIdx < levelQuiz.length - 1 ? (
                              <button
                                onClick={() => setActiveQuizQuestionIdx(prev => prev + 1)}
                                className="glass-btn primary"
                                style={{ padding: '0.65rem 1.5rem', fontSize: '0.95rem' }}
                              >
                                Next Question ➔
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setQuizChecked(true);
                                  confetti({ particleCount: 80, spread: 80, origin: { y: 0.8 } });
                                }}
                                className="glass-btn primary"
                                style={{ padding: '0.65rem 1.5rem', fontSize: '0.95rem', background: 'var(--success)', borderColor: 'var(--success)' }}
                              >
                                Finish Quiz ➔
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        ) : (
          /* Quiz not unlocked yet: show DYK facts */
          <div style={{ 
            display: 'grid', 
            gridTemplateRows: (chapterNum !== 2 || dykExpanded) ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            marginTop: (chapterNum === 2 && !dykExpanded) ? '0' : '0.5rem'
          }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '1rem',
                opacity: (chapterNum !== 2 || dykExpanded) ? 1 : 0,
                transform: (chapterNum !== 2 || dykExpanded) ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                paddingBottom: '0.5rem'
              }}>
              {dykList.slice(0, 3).map((fact, idx) => {
                const colors = [
                  { bg: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(129,140,248,0.02) 100%)', border: 'rgba(99,102,241,0.2)', icon: '💡', accent: 'var(--accent)' },
                  { bg: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(251,191,36,0.02) 100%)', border: 'rgba(245,158,11,0.2)', icon: '✨', accent: 'var(--warning)' },
                  { bg: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(52,211,153,0.02) 100%)', border: 'rgba(16,185,129,0.2)', icon: '🌱', accent: 'var(--success)' }
                ];
                const design = colors[idx % colors.length];
                return (
                  <div key={idx} style={{ padding: '1.45rem', borderRadius: '20px', background: design.bg, border: `2px solid ${design.border}`, display: 'flex', gap: '1.1rem', alignItems: 'flex-start', boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                    <span style={{ fontSize: '1.85rem', lineHeight: '1' }}>{design.icon}</span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'block', marginBottom: '0.4rem', color: design.accent, fontSize: '1.05rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Fact {idx + 1}
                      </strong>
                      <p style={{ margin: 0, fontSize: '1.12rem', color: 'var(--text-heading)', fontWeight: '700', lineHeight: '1.6' }}>
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
    );
  };


  function PlantVarietyMorpher() {
    const [stage, setStage] = useState(0);
    const [activeHotspot, setActiveHotspot] = useState(null);
    const [creeperFlipped, setCreeperFlipped] = useState(false);
    const [climberFlipped, setClimberFlipped] = useState(false);

    const stages = [
      {
        title: '🌿 Herb',
        height: 'Short (usually less than 1 meter)',
        stem: 'Soft, green, and tender stem. Very easy to bend without breaking.',
        examples: 'Tomato, Basil, Wheat, Grass',
        color: '#10b981',
        bg: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(52,211,153,0.02) 100%)',
        desc: 'Herbs are small plants with soft, non-woody stems. They contain a high water concentration in their cells.',
        imgSrc: tulsiImg,
        anatomy: (
          <svg width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <clipPath id="herb-clip">
                <circle cx="50" cy="50" r="38" />
              </clipPath>
            </defs>
            <circle cx="50" cy="50" r="39" fill="#10b981" />
            <image 
              href="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=200&q=80" 
              x="12" y="12" width="76" height="76" 
              clipPath="url(#herb-clip)" 
            />
            {/* Overlay a subtle green radial mask to blend with Pith */}
            <circle cx="50" cy="50" r="38" fill="rgba(16, 185, 129, 0.15)" clipPath="url(#herb-clip)" pointerEvents="none" />
            
            {/* Capillaries / Vascular Bundles (Interactive Hotspots) */}
            {[
              { cx: 50, cy: 22, id: 'capillary', name: '💧 Vascular Capillaries' },
              { cx: 50, cy: 78, id: 'capillary', name: '💧 Vascular Capillaries' },
              { cx: 22, cy: 50, id: 'capillary', name: '💧 Vascular Capillaries' },
              { cx: 78, cy: 50, id: 'capillary', name: '💧 Vascular Capillaries' },
              { cx: 30, cy: 30, id: 'capillary', name: '💧 Vascular Capillaries' },
              { cx: 70, cy: 30, id: 'capillary', name: '💧 Vascular Capillaries' },
              { cx: 30, cy: 70, id: 'capillary', name: '💧 Vascular Capillaries' },
              { cx: 70, cy: 70, id: 'capillary', name: '💧 Vascular Capillaries' }
            ].map((pt, i) => (
              <g key={i} className="anatomy-hotspot" onClick={() => setActiveHotspot({
                title: pt.name,
                text: '• In herbs, water and mineral transport is handled by ring-arranged vascular capillaries (xylem/phloem).\n• Since there is no thick wood or bark, the surrounding tissues are soft, green parenchyma cells, making the stem highly flexible.'
              })}>
                <circle cx={pt.cx} cy={pt.cy} r="6.5" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 0 2px rgba(59,130,246,0.5))' }} />
                <circle cx={pt.cx} cy={pt.cy} r="2.5" fill="#2563eb" />
              </g>
            ))}
            {/* Center Pith */}
            <circle cx="50" cy="50" r="14" fill="rgba(200, 230, 201, 0.85)" stroke="#81c784" strokeWidth="1" />
            <text x="50" y="52" textAnchor="middle" fill="#1b5e20" fontSize="6.5" fontWeight="bold">PITH</text>
          </svg>
        )
      },
      {
        title: '🌺 Shrub',
        height: 'Medium height (typically 1 to 3 meters)',
        stem: 'Hard, thin, woody stem. Branches emerge close to the soil level.',
        examples: 'Rose, Hibiscus, Lemon, Henna',
        color: '#d97706',
        bg: 'linear-gradient(135deg, rgba(217,119,6,0.06) 0%, rgba(251,191,36,0.02) 100%)',
        desc: 'Shrubs are medium-sized plants with hard stems branching near the ground. They lack a single clear trunk.',
        imgSrc: roseImg,
        anatomy: (
          <svg width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <clipPath id="shrub-clip">
                <circle cx="50" cy="50" r="35" />
              </clipPath>
            </defs>
            <circle cx="50" cy="50" r="36" fill="#d97706" />
            <image 
              href="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=200&q=80" 
              x="14" y="14" width="72" height="72" 
              clipPath="url(#shrub-clip)" 
            />
            {/* Thin Wood Core (Hotspot) */}
            <circle 
              cx="50" cy="50" r="26" 
              className="anatomy-hotspot pulse-ring-element"
              fill="rgba(254, 215, 170, 0.45)" stroke="#ea580c" strokeWidth="2.5"
              style={{ filter: 'drop-shadow(0 0 3px rgba(234,88,12,0.3))' }}
              onClick={() => setActiveHotspot({
                title: '🪵 Thin Wood Core',
                text: '• Shrubs develop a thin core of lignified woody xylem tissue.\n• This wood provides rigid structural support allowing them to stand upright, but it remains thin compared to trees, keeping stems slender and slightly bendable.'
              })}
            />
            {/* Thorns */}
            {[
              { x1: 50, y1: 15, x2: 50, y2: 4, path: "M48,15 L50,4 L52,15 Z" },
              { x1: 50, y1: 85, x2: 50, y2: 96, path: "M48,85 L50,96 L52,85 Z" },
              { x1: 15, y1: 50, x2: 4, y2: 50, path: "M15,48 L4,50 L15,52 Z" },
              { x1: 85, y1: 50, x2: 96, y2: 50, path: "M85,48 L96,50 L85,52 Z" }
            ].map((th, i) => (
              <path 
                key={i} 
                d={th.path}
                className="anatomy-hotspot"
                fill="#9a3412" stroke="#451a03" strokeWidth="1"
                onClick={() => setActiveHotspot({
                  title: '🌵 Protective Thorns / Prickles',
                  text: '• Many shrubs, like Wild Rose, develop thorns directly from their epidermal stem layer.\n• These sharp extensions act as a mechanical defense mechanism to deter herbivores from eating their leaves and stems.'
                })}
              />
            ))}
            <circle cx="50" cy="50" r="9" fill="#9a3412" opacity="0.9" />
            <circle cx="50" cy="50" r="5" fill="#fdba74" />
          </svg>
        )
      },
      {
        title: '🌳 Tree',
        height: 'Tall (usually exceeding 3 meters)',
        stem: 'Thick, hard, brown woody trunk. Branches start high up.',
        examples: 'Neem, Mango, Banyan, Coconut',
        color: '#1e3a8a',
        bg: 'linear-gradient(135deg, rgba(30,58,138,0.06) 0%, rgba(59,130,246,0.02) 100%)',
        desc: 'Trees are tall woody plants with a single main supporting trunk. They grow continuously for many years.',
        imgSrc: banyanImg,
        anatomy: (
          <svg width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <clipPath id="tree-clip">
                <circle cx="50" cy="50" r="38" />
              </clipPath>
            </defs>
            <circle cx="50" cy="50" r="40" fill="#451a03" />
            <image 
              href="https://images.unsplash.com/photo-1546482502-04b017f1190f?auto=format&fit=crop&w=200&q=80" 
              x="10" y="10" width="80" height="80" 
              clipPath="url(#tree-clip)" 
            />
            {/* Semi-transparent bark cork hotspot */}
            <circle 
              cx="50" cy="50" r="38" 
              className="anatomy-hotspot"
              fill="rgba(69, 26, 3, 0.2)" stroke="#ffd700" strokeWidth="1.5" strokeDasharray="3,3"
              onClick={() => setActiveHotspot({
                title: '🟫 Outer Cork Bark',
                text: '• The outer bark is a thick layer of dead cork cells.\n• It serves as a rugged shield protecting the tree trunk against physical damage, fires, insects, water loss, and freezing mountain cold.'
              })}
            />
            {/* Annual growth rings overlay */}
            {[28, 20, 12].map((r, i) => (
              <circle 
                key={i} cx="50" cy="50" r={r} 
                className="anatomy-hotspot pulse-ring-element"
                fill="none" stroke="rgba(255, 215, 0, 0.45)" strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 3px rgba(255,215,0,0.3))' }}
                onClick={() => setActiveHotspot({
                  title: '⭕ Annual Growth Rings',
                  text: '• Concentric rings formed by secondary growth xylem divisions each season.\n• Fast spring growth creates wide light rings; slow summer growth creates thin dark rings. Counting them estimates trunk age!'
                })}
              />
            ))}
            <circle cx="50" cy="50" r="6" fill="#451a03" />
          </svg>
        )
      }
    ];

    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.25rem', 
        width: '100%', 
        padding: '1.5rem', 
        background: 'linear-gradient(145deg, rgba(246, 252, 248, 0.97) 0%, rgba(236, 247, 241, 0.95) 100%)', 
        backdropFilter: 'blur(16px)', 
        borderRadius: '20px', 
        border: '1.5px solid rgba(167, 243, 208, 0.85)', 
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)' 
      }}>
        <div style={{ borderBottom: '1.5px solid rgba(167, 243, 208, 0.85)', paddingBottom: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#047857', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            🔬 Plant Growth Form Morpher
          </span>
          <span style={{ fontSize: '12px', color: '#065f46', fontWeight: '700' }}>Tap rings/spots to magnifying cellular details!</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 100px', gap: '1rem', alignItems: 'center' }}>
          <div style={{ padding: '0.85rem 1rem', borderRadius: '14px', background: stages[stage].bg, border: `1.5px solid ${stages[stage].color}44`, minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 2px 8px rgba(6, 78, 59, 0.05)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: stages[stage].color, fontSize: '1.15rem', fontWeight: '800' }}>
              {stages[stage].title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '14.5px', color: '#064e3b', lineHeight: '1.5', fontWeight: '700' }}>
              <span><b>Average Height:</b> {stages[stage].height}</span>
              <span><b>Stem Character:</b> {stages[stage].stem}</span>
              <span><b>NCERT Examples:</b> <i style={{ color: '#047857' }}>{stages[stage].examples}</i></span>
            </div>
          </div>
          {/* Realistic View */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#ffffff', borderRadius: '16px', padding: '0.25rem', width: '100px', height: '100px', border: '1.5px solid rgba(167, 243, 208, 0.85)', boxShadow: '0 4px 12px rgba(6, 78, 59, 0.08)', overflow: 'hidden' }}>
              <img src={stages[stage].imgSrc} alt={stages[stage].title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
            </div>
            <span style={{ fontSize: '10px', color: '#047857', fontWeight: '800' }}>Realistic View</span>
          </div>
        </div>

        {/* Morph Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: '#ffffff', padding: '0.85rem 1.25rem', borderRadius: '14px', border: '1.5px solid rgba(167, 243, 208, 0.85)', boxShadow: '0 2px 8px rgba(6, 78, 59, 0.04)' }}>
          <input 
            type="range" 
            min="0" 
            max="2" 
            value={stage} 
            onChange={(e) => { setStage(parseInt(e.target.value)); setActiveHotspot(null); }} 
            style={{ width: '100%', accentColor: stages[stage].color, cursor: 'pointer', height: '6px', borderRadius: '3px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800', color: '#064e3b' }}>
            <span style={{ color: stage === 0 ? '#047857' : 'inherit', transition: 'color 0.2s' }}>Herb</span>
            <span style={{ color: stage === 1 ? '#d97706' : 'inherit', transition: 'color 0.2s' }}>Shrub</span>
            <span style={{ color: stage === 2 ? '#1e3a8a' : 'inherit', transition: 'color 0.2s' }}>Tree</span>
          </div>
        </div>

        {/* Hotspot details panel */}
        {activeHotspot ? (
          <div style={{
            background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
            borderLeft: '4px solid #eab308',
            border: '1.5px solid #fde047',
            borderLeftWidth: '4px',
            borderRadius: '10px',
            padding: '0.85rem 1.1rem',
            fontSize: '13.5px',
            lineHeight: '1.55',
            boxShadow: '0 2px 8px rgba(234, 179, 8, 0.15)',
            animation: 'fadeIn 0.25s ease-out'
          }}>
            <strong style={{ color: '#854d0e', display: 'block', marginBottom: '0.25rem', fontWeight: '800' }}>{activeHotspot.title}</strong>
            <p style={{ margin: 0, color: '#713f12', whiteSpace: 'pre-line', fontWeight: '700' }}>{activeHotspot.text}</p>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
            borderLeft: '4px solid #eab308',
            border: '1.5px solid #fde047',
            borderLeftWidth: '4px',
            borderRadius: '10px',
            padding: '0.85rem 1.1rem',
            fontSize: '13.5px',
            color: '#713f12',
            fontWeight: '700',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(234, 179, 8, 0.15)'
          }}>
            <span>🔍</span>
            <span><b>Directions:</b> Tap the glowing rings or points in the <b>Cellular Anatomy</b> view above to inspect growth details!</span>
          </div>
        )}

        {/* Climbers vs Creepers comparative panel (Upgraded for high visual visibility & interactive 3D flips) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', borderTop: '1.5px solid rgba(167, 243, 208, 0.85)', paddingTop: '1.25rem' }}>
          
          {/* Creeper Card Flip Container */}
          <div className="flip-card-container" onClick={() => setCreeperFlipped(f => !f)}>
            <div className={`flip-card-inner ${creeperFlipped ? 'flipped' : ''}`}>
              
              {/* Front Side: Visual */}
              <div className="flip-card-front" style={{ border: '1.5px solid rgba(245, 158, 11, 0.5)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', borderRadius: '14px' }}>
                <img src={creeperImg} alt="Creeper" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.75))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1rem', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1.3rem' }}>🍉</span>
                    <strong style={{ fontSize: '15px' }}>Creepers (Spread on Ground)</strong>
                  </div>
                  <span style={{ fontSize: '11px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>👉 Tap to read details</span>
                </div>
              </div>

              {/* Back Side: Details */}
              <div className="flip-card-back" style={{ background: '#ffffff', border: '1.5px solid rgba(245, 158, 11, 0.45)', borderRadius: '14px', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', paddingBottom: '0.4rem', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.3rem' }}>🍉</span>
                    <strong style={{ fontSize: '15px', color: '#b45309', fontWeight: '800' }}>Creepers (Spread on Ground)</strong>
                  </div>
                  <span style={{ fontSize: '10px', color: '#854d0e', textTransform: 'uppercase', fontWeight: '700' }}>Tap to view image</span>
                </div>
                <div style={{ margin: 0, fontSize: '13.5px', lineHeight: '1.55', color: '#064e3b', fontWeight: '700', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span>🌱 <b>Growth Habit:</b> They creep horizontally along the ground and spread out on the surface of the soil.</span>
                  <span>⚠️ <b>Stem Weakness:</b> Their stems are so thin and fragile that they <b>cannot grow vertically</b> at all, even with external supports.</span>
                  <span>🍉 <b>Fruits:</b> Frequently produce large, heavy fruits (like Watermelon or Pumpkin) that must rest on the ground.</span>
                </div>
              </div>

            </div>
          </div>

          {/* Climber Card Flip Container */}
          <div className="flip-card-container" onClick={() => setClimberFlipped(f => !f)}>
            <div className={`flip-card-inner ${climberFlipped ? 'flipped' : ''}`}>
              
              {/* Front Side: Visual */}
              <div className="flip-card-front" style={{ border: '1.5px solid rgba(2, 132, 199, 0.5)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', borderRadius: '14px' }}>
                <img src={climberImg} alt="Climber" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.75))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1rem', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1.3rem' }}>🍇</span>
                    <strong style={{ fontSize: '15px' }}>Climbers (Climb Up Support)</strong>
                  </div>
                  <span style={{ fontSize: '11px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>👉 Tap to read details</span>
                </div>
              </div>

              {/* Back Side: Details */}
              <div className="flip-card-back" style={{ background: '#ffffff', border: '1.5px solid rgba(2, 132, 199, 0.45)', borderRadius: '14px', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(2, 132, 199, 0.2)', paddingBottom: '0.4rem', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.3rem' }}>🍇</span>
                    <strong style={{ fontSize: '15px', color: '#0369a1', fontWeight: '800' }}>Climbers (Climb Up Support)</strong>
                  </div>
                  <span style={{ fontSize: '10px', color: '#0284c7', textTransform: 'uppercase', fontWeight: '700' }}>Tap to view image</span>
                </div>
                <div style={{ margin: 0, fontSize: '13.5px', lineHeight: '1.55', color: '#064e3b', fontWeight: '700', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span>🎋 <b>Growth Habit:</b> They grow vertically by clasping onto nearby supports (sticks, trees, or walls).</span>
                  <span>🔗 <b>Adaptation:</b> They develop special climbing organs called coiled <b>Tendrils</b> or sticky roots to latch and pull themselves up.</span>
                  <span>☀️ <b>Goal:</b> Climbing allows their leaves to reach higher areas with direct sunlight (e.g., Pea, Grapevine, Money Plant).</span>
                </div>
              </div>

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', padding: '1.25rem', background: 'linear-gradient(145deg, rgba(246, 252, 248, 0.97) 0%, rgba(236, 247, 241, 0.95) 100%)', borderRadius: '20px', border: '1.5px solid rgba(167, 243, 208, 0.85)', boxShadow: '0 16px 40px rgba(0,0,0,0.35)' }}>
        <div style={{ borderBottom: '1.5px solid rgba(167, 243, 208, 0.85)', paddingBottom: '0.55rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '0.92rem', fontWeight: '900', color: '#064e3b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔗 Venation-Root Correlation Linker
          </span>
          <span style={{ fontSize: '0.92rem', color: '#ffffff', fontWeight: '800', background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '0.35rem 0.95rem', borderRadius: '12px', border: '1.5px solid #92400e', boxShadow: '0 2px 8px rgba(245,158,11,0.35)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
            👉 Tap matching cards on left & right to link
          </span>
        </div>

        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
          {/* Connection lines and ports overlay */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
            {/* Reticulate -> Taproot line */}
            {connections.reticulate && (
              <>
                <line x1="46.3%" y1="24%" x2="53.7%" y2="24%" stroke="#34d399" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
                <line x1="46.3%" y1="24%" x2="53.7%" y2="24%" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                <line x1="46.3%" y1="24%" x2="53.7%" y2="24%" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
              </>
            )}

            {/* Parallel -> Fibrous line */}
            {connections.parallel && (
              <>
                <line x1="46.3%" y1="74%" x2="53.7%" y2="74%" stroke="#34d399" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
                <line x1="46.3%" y1="74%" x2="53.7%" y2="74%" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                <line x1="46.3%" y1="74%" x2="53.7%" y2="74%" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
              </>
            )}

            {/* Reticulate port (left, top) */}
            <circle cx="46.3%" cy="24%" r="5" fill={connections.reticulate ? '#10b981' : '#ffffff'} stroke={connections.reticulate ? '#059669' : selectedLeaf === 'reticulate' ? '#0284c7' : '#94a3b8'} strokeWidth="2.5" />
            {selectedLeaf === 'reticulate' && !connections.reticulate && (
              <circle cx="46.3%" cy="24%" r="7" fill="none" stroke="#0284c7" strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="5;9;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Parallel port (left, bottom) */}
            <circle cx="46.3%" cy="74%" r="5" fill={connections.parallel ? '#10b981' : '#ffffff'} stroke={connections.parallel ? '#059669' : selectedLeaf === 'parallel' ? '#0284c7' : '#94a3b8'} strokeWidth="2.5" />
            {selectedLeaf === 'parallel' && !connections.parallel && (
              <circle cx="46.3%" cy="74%" r="7" fill="none" stroke="#0284c7" strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="5;9;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Taproot port (right, top) */}
            <circle cx="53.7%" cy="24%" r="5" fill={connections.reticulate ? '#10b981' : '#ffffff'} stroke={connections.reticulate ? '#059669' : selectedRoot === 'taproot' ? '#0284c7' : '#94a3b8'} strokeWidth="2.5" />
            {selectedRoot === 'taproot' && !connections.reticulate && (
              <circle cx="53.7%" cy="24%" r="7" fill="none" stroke="#0284c7" strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="5;9;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Fibrous port (right, bottom) */}
            <circle cx="53.7%" cy="74%" r="5" fill={connections.parallel ? '#10b981' : '#ffffff'} stroke={connections.parallel ? '#059669' : selectedRoot === 'fibrous' ? '#0284c7' : '#94a3b8'} strokeWidth="2.5" />
            {selectedRoot === 'fibrous' && !connections.parallel && (
              <circle cx="53.7%" cy="74%" r="7" fill="none" stroke="#0284c7" strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="5;9;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>
          {/* Leaves */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#064e3b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Venation</span>
            
            <button
              onClick={() => selectLeaf('reticulate')}
              className="glass-btn"
              style={{ 
                padding: 0, 
                borderRadius: '14px', 
                overflow: 'hidden',
                border: connections.reticulate ? '2.5px solid #059669' : selectedLeaf === 'reticulate' ? '2.5px solid #0284c7' : '1.5px solid rgba(167, 243, 208, 0.9)', 
                background: connections.reticulate ? '#f0fdf4' : selectedLeaf === 'reticulate' ? '#f0f9ff' : '#ffffff', 
                cursor: 'pointer', 
                textAlign: 'left', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.2s',
                boxShadow: connections.reticulate ? '0 4px 14px rgba(5,150,105,0.2)' : selectedLeaf === 'reticulate' ? '0 4px 14px rgba(2,132,199,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                width: '100%'
              }}
            >
              <div style={{ width: '100%', height: '140px', overflow: 'hidden', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                <img src={dicotLeafImg} alt="Dicot / Reticulate Venation" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#f8fafc' }} />
              </div>
              <div style={{ padding: '0.75rem 0.9rem', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#064e3b' }}>Reticulate</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Net-like network of veins</span>
              </div>
            </button>
            
            <button
              onClick={() => selectLeaf('parallel')}
              className="glass-btn"
              style={{ 
                padding: 0, 
                borderRadius: '14px', 
                overflow: 'hidden',
                border: connections.parallel ? '2.5px solid #059669' : selectedLeaf === 'parallel' ? '2.5px solid #0284c7' : '1.5px solid rgba(167, 243, 208, 0.9)', 
                background: connections.parallel ? '#f0fdf4' : selectedLeaf === 'parallel' ? '#f0f9ff' : '#ffffff', 
                cursor: 'pointer', 
                textAlign: 'left', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.2s',
                boxShadow: connections.parallel ? '0 4px 14px rgba(5,150,105,0.2)' : selectedLeaf === 'parallel' ? '0 4px 14px rgba(2,132,199,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                width: '100%'
              }}
            >
              <div style={{ width: '100%', height: '140px', overflow: 'hidden', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                <img src={monocotLeafImg} alt="Monocot / Parallel Venation" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#f8fafc' }} />
              </div>
              <div style={{ padding: '0.75rem 0.9rem', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#064e3b' }}>Parallel</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Veins running side-by-side</span>
              </div>
            </button>
          </div>

          {/* Roots */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#064e3b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Root System</span>
            
            <button
              onClick={() => selectRoot('taproot')}
              className="glass-btn"
              style={{ 
                padding: 0, 
                borderRadius: '14px', 
                overflow: 'hidden',
                border: connections.reticulate ? '2.5px solid #059669' : selectedRoot === 'taproot' ? '2.5px solid #0284c7' : '1.5px solid rgba(167, 243, 208, 0.9)', 
                background: connections.reticulate ? '#f0fdf4' : selectedRoot === 'taproot' ? '#f0f9ff' : '#ffffff', 
                cursor: 'pointer', 
                textAlign: 'left', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.2s',
                boxShadow: connections.reticulate ? '0 4px 14px rgba(5,150,105,0.2)' : selectedRoot === 'taproot' ? '0 4px 14px rgba(2,132,199,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                width: '100%'
              }}
            >
              <div style={{ width: '100%', height: '140px', overflow: 'hidden', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                <img src={taprootImg} alt="Taproot" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#f8fafc' }} />
              </div>
              <div style={{ padding: '0.75rem 0.9rem', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#064e3b' }}>Taproot</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>One deep central thick root</span>
              </div>
            </button>
            
            <button
              onClick={() => selectRoot('fibrous')}
              className="glass-btn"
              style={{ 
                padding: 0, 
                borderRadius: '14px', 
                overflow: 'hidden',
                border: connections.parallel ? '2.5px solid #059669' : selectedRoot === 'fibrous' ? '2.5px solid #0284c7' : '1.5px solid rgba(167, 243, 208, 0.9)', 
                background: connections.parallel ? '#f0fdf4' : selectedRoot === 'fibrous' ? '#f0f9ff' : '#ffffff', 
                cursor: 'pointer', 
                textAlign: 'left', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.2s',
                boxShadow: connections.parallel ? '0 4px 14px rgba(5,150,105,0.2)' : selectedRoot === 'fibrous' ? '0 4px 14px rgba(2,132,199,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                width: '100%'
              }}
            >
              <div style={{ width: '100%', height: '140px', overflow: 'hidden', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                <img src={fibrousImg} alt="Fibrous Root" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#f8fafc' }} />
              </div>
              <div style={{ padding: '0.75rem 0.9rem', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#064e3b' }}>Fibrous</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155' }}>Cluster of thin threadlike roots</span>
              </div>
            </button>
          </div>
        </div>

        {status && (
          <div style={{ padding: '0.6rem 0.9rem', borderRadius: '10px', background: '#ffffff', border: '1.5px solid rgba(167, 243, 208, 0.9)', fontSize: '0.88rem', fontWeight: '700', color: status.startsWith('❌') ? '#b91c1c' : '#064e3b', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
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

    const getSeedImage = () => {
      if (activeSeed === 'pea') {
        if (!coatRemoved) return dicot1Img;
        if (!seedSplit) return dicot2Img;
        return dicot3Img;
      } else {
        if (!coatRemoved) return monocot1Img;
        if (!seedSplit) return monocot2Img;
        return monocot3Img;
      }
    };

    const getSeedAlt = () => {
      if (activeSeed === 'pea') {
        if (!coatRemoved) return 'Dicot (Gram) Seed';
        if (!seedSplit) return 'Dicot (Gram) Peeled Seed';
        return 'Dicot (Gram) Split Cotyledons';
      } else {
        if (!coatRemoved) return 'Monocot (Maize) Seed';
        if (!seedSplit) return 'Monocot (Maize) Peeled Seed';
        return 'Monocot (Maize) Split Seed';
      }
    };

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        width: '100%',
        padding: '1.25rem',
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)',
        backdropFilter: 'blur(16px)',
        borderRadius: '16px',
        border: '2px solid rgba(167, 243, 208, 0.95)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(167, 243, 208, 0.95)', paddingBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🥜 Interactive Seed Dissector
          </span>
          <div style={{ display: 'flex', gap: '0.35rem', background: '#ffffff', padding: '0.2rem', borderRadius: '8px', border: '1.5px solid rgba(167, 243, 208, 0.95)' }}>
            <button
              onClick={() => handleSelect('pea')}
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: '900',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: activeSeed === 'pea' ? '#f59e0b' : 'transparent',
                color: activeSeed === 'pea' ? '#1a0f05' : '#0f172a',
                transition: 'all 0.2s ease'
              }}
            >
              Dicot (Gram)
            </button>
            <button
              onClick={() => handleSelect('maize')}
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '0.78rem',
                fontWeight: '900',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: activeSeed === 'maize' ? '#f59e0b' : 'transparent',
                color: activeSeed === 'maize' ? '#1a0f05' : '#0f172a',
                transition: 'all 0.2s ease'
              }}
            >
              Monocot (Maize)
            </button>
          </div>
        </div>

        {/* Large Image box on Top */}
        <div style={{ display: 'flex', justifyContent: 'center', background: '#ffffff', borderRadius: '12px', padding: '1rem', border: '1.5px solid rgba(167, 243, 208, 0.95)', height: '240px', alignItems: 'center', overflow: 'hidden', width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <img 
            src={getSeedImage()} 
            alt={getSeedAlt()}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Action Options at the Bottom (Side by Side) */}
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <button
            disabled={coatRemoved}
            onClick={() => { setCoatRemoved(true); setStatus('Seed coat peeled! Now click "Split Seed" to look inside.'); }}
            style={{
              padding: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: '900',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              borderRadius: '10px',
              background: coatRemoved ? '#e2e8f0' : '#f59e0b',
              color: coatRemoved ? '#64748b' : '#1a0f05',
              border: coatRemoved ? '1.5px solid #cbd5e1' : 'none',
              cursor: coatRemoved ? 'default' : 'pointer',
              boxShadow: coatRemoved ? 'none' : '0 4px 14px rgba(245, 158, 11, 0.35)',
              transition: 'all 0.2s ease'
            }}
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
            style={{
              padding: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: '900',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              borderRadius: '10px',
              background: seedSplit ? '#e2e8f0' : '#f59e0b',
              color: seedSplit ? '#64748b' : '#1a0f05',
              border: seedSplit ? '1.5px solid #cbd5e1' : 'none',
              cursor: seedSplit ? 'default' : 'pointer',
              boxShadow: seedSplit ? 'none' : '0 4px 14px rgba(245, 158, 11, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            ✂️ Split Seed
          </button>
        </div>

        <div style={{ padding: '0.65rem 0.9rem', borderRadius: '10px', background: 'rgba(240, 253, 244, 0.95)', border: '1.5px solid rgba(167, 243, 208, 0.95)', fontSize: '0.85rem', color: '#0f172a', fontWeight: '700' }}>
          {status}
        </div>
      </div>
    );
  }

  function AnimalLocomotionGrid() {
    const [placed, setPlaced] = useState({ fish: null, pigeon: null, snail: null, cow: null });
    const [draggingId, setDraggingId] = useState(null);
    const [selectedAnimal, setSelectedAnimal] = useState(null); // Click fallback selection
    const [result, setResult] = useState('Drag each animal card and drop it into its correct locomotion mode dropzone, or tap to place.');
    const [dragOverZone, setDragOverZone] = useState(null);

    const data = {
      fish: { id: 'fish', name: 'Fish', image: fishImg, movement: 'swim', organ: 'Fins & tail', text: 'Uses flexible body muscles and fins to push through water.' },
      pigeon: { id: 'pigeon', name: 'Pigeon', image: pigeonImg, movement: 'fly', organ: 'Wings & light bones', text: 'Uses streamlined body, flight feathers, and modified forelimbs to fly.' },
      snail: { id: 'snail', name: 'Snail', image: snailImg, movement: 'crawl', organ: 'Muscular foot', text: 'Crawls slowly by producing continuous muscular waves on its underbelly.' },
      cow: { id: 'cow', name: 'Cow', image: cowImg, movement: 'walk', organ: 'Four legs', text: 'Walks and runs on land with stable skeletal limbs.' }
    };

    const specimenKeys = ['fish', 'pigeon', 'snail', 'cow'];

    const dropzones = [
      { id: 'swim', label: 'Swim 🏊', theme: { active: '#0284c7', bg: 'rgba(224, 242, 254, 0.9)', border: '#38bdf8' } },
      { id: 'fly', label: 'Fly 🦅', theme: { active: '#7c3aed', bg: 'rgba(243, 232, 255, 0.9)', border: '#c084fc' } },
      { id: 'walk', label: 'Walk 🚶', theme: { active: '#b45309', bg: 'rgba(254, 243, 199, 0.9)', border: '#f59e0b' } },
      { id: 'crawl', label: 'Crawl 🐌', theme: { active: '#15803d', bg: 'rgba(220, 252, 231, 0.9)', border: '#4ade80' } }
    ];

    const handleDragStart = (e, animalId) => {
      e.dataTransfer.setData("text/plain", animalId);
    };

    const handleDrop = (animalId, moveType) => {
      const target = data[animalId];
      if (!target) return;
      if (target.movement === moveType) {
        setPlaced(prev => {
          const updated = { ...prev, [animalId]: moveType };
          const allDone = specimenKeys.every(k => k === animalId ? true : updated[k] !== null);
          if (allDone) {
            setResult(`🎉 Grand Locomotion Discovery Complete! You mapped all specimens correctly.`);
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
          } else {
            setResult(`✅ Correct! ${target.name} uses ${target.organ} to ${moveType}. (${target.text})`);
          }
          return updated;
        });
        setSelectedAnimal(null);
      } else {
        setResult(`❌ Incorrect: ${target.name} does not move by ${moveType}ing. Try another dropzone!`);
      }
    };

    const handleResetGrid = () => {
      setPlaced({ fish: null, pigeon: null, snail: null, cow: null });
      setSelectedAnimal(null);
      setResult('Drag each animal card and drop it into its correct locomotion mode dropzone, or tap to place.');
    };

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        width: '100%',
        padding: '1.25rem 1.4rem',
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)',
        backdropFilter: 'blur(16px)',
        borderRadius: '16px',
        border: '2px solid rgba(167, 243, 208, 0.95)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
      }}>
        
        <style>{`
          @keyframes scaleUp {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(167, 243, 208, 0.95)', paddingBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🏃 Locomotion Organ Mapper
          </span>
          <button 
            onClick={handleResetGrid} 
            style={{
              background: '#ffffff',
              border: '1.5px solid rgba(167, 243, 208, 0.95)',
              color: '#0f172a',
              borderRadius: '8px',
              padding: '0.35rem 0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.85rem',
              fontWeight: '800',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease'
            }}
          >
            <RefreshCw size={14} color="#0284c7" /> Reset
          </button>
        </div>

        {/* SPECIMEN TRAY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
          <span style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a' }}>Animal Specimen Tray</span>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            minHeight: '260px', 
            padding: '1rem 1.25rem', 
            background: 'rgba(240, 253, 244, 0.6)', 
            borderRadius: '14px', 
            border: '2px dashed rgba(167, 243, 208, 0.95)', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexWrap: 'nowrap',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {specimenKeys.filter(k => !placed[k]).length === 0 ? (
              <div style={{ fontSize: '1.05rem', color: '#16a34a', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}>
                ✅ All animal specimens successfully placed!
              </div>
            ) : (
              specimenKeys.map(k => {
                if (placed[k]) return null;
                const isSelected = selectedAnimal === k;
                return (
                  <div
                    key={k}
                    draggable
                    onDragStart={(e) => {
                      setDraggingId(k);
                      handleDragStart(e, k);
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    onClick={() => {
                      if (selectedAnimal === k) {
                        setSelectedAnimal(null);
                      } else {
                        setSelectedAnimal(k);
                        setResult(`Selected ${data[k].name}. Tap a dropzone below to place it.`);
                      }
                    }}
                    style={{
                      flex: '1 1 0',
                      maxWidth: '190px',
                      minWidth: '135px',
                      height: '230px',
                      borderRadius: '14px',
                      background: '#ffffff',
                      border: isSelected ? '2.5px solid #0284c7' : draggingId === k ? '2px dashed #0284c7' : '2px solid rgba(167, 243, 208, 0.95)',
                      boxShadow: isSelected ? '0 0 22px rgba(14, 165, 233, 0.35)' : '0 4px 14px rgba(0,0,0,0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'grab',
                      userSelect: 'none',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isSelected ? 'scale(1.05)' : 'none',
                      opacity: draggingId === k ? 0.4 : 1,
                      position: 'relative',
                      padding: '0.75rem 0.65rem 0.65rem 0.65rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '175px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      background: '#f0fdf4',
                      borderRadius: '10px'
                    }}>
                      <img 
                        src={data[k].image} 
                        alt={data[k].name} 
                        style={{ 
                          maxWidth: '92%', 
                          maxHeight: '92%', 
                          width: 'auto', 
                          height: 'auto', 
                          objectFit: 'contain', 
                          borderRadius: '8px', 
                          pointerEvents: 'none',
                          transform: k === 'cow' ? 'scale(1.22)' : k === 'snail' ? 'scale(1.18)' : k === 'pigeon' ? 'scale(1.14)' : 'scale(1.14)',
                          transformOrigin: 'center center'
                        }} 
                      />
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: '900', color: '#0f172a', textAlign: 'center', marginTop: '6px' }}>
                      {data[k].name}
                    </span>
                    {isSelected && (
                      <div style={{ position: 'absolute', top: -6, right: -6, background: '#0284c7', color: '#ffffff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '900', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
                        ✓
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* DROPZONES GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', width: '100%' }}>
          {dropzones.map(zone => {
            const placedKeys = specimenKeys.filter(k => placed[k] === zone.id);
            const isHovered = dragOverZone === zone.id;
            const hasPlaced = placedKeys.length > 0;
            const borderStyle = isHovered 
              ? `2px solid ${zone.theme.active}` 
              : hasPlaced 
              ? '2px solid #22c55e' 
              : `2px dashed rgba(167, 243, 208, 0.95)`;
            const bgStyle = isHovered 
              ? zone.theme.bg 
              : hasPlaced 
              ? 'rgba(220, 252, 231, 0.8)' 
              : '#ffffff';

            return (
              <div
                key={zone.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!isHovered) setDragOverZone(zone.id);
                }}
                onDragLeave={() => setDragOverZone(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverZone(null);
                  const animalId = e.dataTransfer.getData("text/plain") || draggingId;
                  if (animalId) {
                    handleDrop(animalId, zone.id);
                  }
                }}
                onClick={() => {
                  if (selectedAnimal) {
                    handleDrop(selectedAnimal, zone.id);
                  }
                }}
                style={{
                  minHeight: '52px',
                  borderRadius: '12px',
                  border: borderStyle,
                  background: bgStyle,
                  padding: '0.45rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  transition: 'all 0.2s',
                  cursor: selectedAnimal ? 'pointer' : 'default',
                  boxShadow: isHovered ? `0 4px 18px ${zone.theme.bg}` : '0 2px 6px rgba(0,0,0,0.04)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0f172a', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                  {zone.label}
                </div>

                {hasPlaced ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', width: '100%' }}>
                    {placedKeys.map(placedAnimal => (
                      <div key={placedAnimal} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', width: '100%', justifyContent: 'flex-start', textAlign: 'left', animation: 'scaleUp 0.3s ease-out' }}>
                        <img 
                          src={data[placedAnimal].image} 
                          alt={data[placedAnimal].name} 
                          style={{ width: '32px', height: '32px', objectFit: 'contain', background: '#ffffff', border: '1.5px solid rgba(167, 243, 208, 0.95)', borderRadius: '6px', padding: '2px' }} 
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.05rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            {data[placedAnimal].name} <Check size={14} color="#16a34a" strokeWidth={3.5} />
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: '700' }}>
                            ⚙️ {data[placedAnimal].organ}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.15, fontWeight: '700' }}>
                    {selectedAnimal 
                      ? `Tap to place ${data[selectedAnimal].name} here` 
                      : `Drag specimen here`}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* FEEDBACK BANNER */}
        <div style={{ 
          padding: '0.65rem 0.95rem', 
          borderRadius: '12px', 
          background: result.startsWith('❌') ? 'rgba(254, 226, 226, 0.9)' : result.startsWith('🎉') || result.startsWith('✅') ? 'rgba(220, 252, 231, 0.9)' : 'rgba(240, 253, 244, 0.95)', 
          border: `2px solid ${result.startsWith('❌') ? '#dc2626' : result.startsWith('🎉') || result.startsWith('✅') ? '#22c55e' : 'rgba(167, 243, 208, 0.95)'}`, 
          fontSize: '0.88rem', 
          color: '#0f172a', 
          fontWeight: '700',
          lineHeight: 1.4,
          transition: 'all 0.3s'
        }}>
          {result}
        </div>

      </div>
    );
  }

  function AdaptationClimator() {
    const [tab, setTab] = useState('hot');

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.1rem',
        width: '100%',
        minHeight: '100%',
        padding: '1.6rem 1.75rem',
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)',
        backdropFilter: 'blur(16px)',
        borderRadius: '16px',
        border: '2px solid rgba(167, 243, 208, 0.95)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        boxSizing: 'border-box'
      }}>
        {/* Dashboard Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid rgba(167, 243, 208, 0.95)',
          paddingBottom: '0.65rem',
          marginBottom: '0.25rem'
        }}>
          <span style={{
            fontSize: '1.22rem',
            fontWeight: '900',
            color: '#0284c7',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem'
          }}>
            🗺️ Survival Adaptations Dashboard
          </span>
        </div>

        {/* Tab Switcher Pills */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          {[
            { id: 'hot', label: 'Hot Desert', icon: '🐪' },
            { id: 'cold', label: 'Cold Desert', icon: '🐫' },
            { id: 'mountain', label: 'Mountain', icon: '🌲' },
            { id: 'pioneers', label: 'Groves / Pioneers', icon: '🌿' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '0.65rem 1.15rem',
                borderRadius: '10px',
                fontSize: '0.96rem',
                fontWeight: '900',
                cursor: 'pointer',
                border: tab === t.id ? 'none' : '1.5px solid rgba(167, 243, 208, 0.95)',
                background: tab === t.id
                  ? '#f59e0b'
                  : '#ffffff',
                color: tab === t.id ? '#1a0f05' : '#0f172a',
                boxShadow: tab === t.id ? '0 4px 14px rgba(245, 158, 11, 0.4)' : '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Cards */}
        {tab === 'hot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem', width: '100%', flex: 1 }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderRadius: '14px',
              background: '#ffffff',
              border: '2px solid rgba(167, 243, 208, 0.95)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
              fontSize: '1.08rem',
              lineHeight: '1.65',
              color: '#0f172a'
            }}>
              <b style={{ color: '#b45309', fontSize: '1.2rem', display: 'block', marginBottom: '0.4rem' }}>
                🐪 Rajasthan Camel:
              </b>
              Long legs (keeps body above hot sand), wide padded hooves, stores fat in its hump.
            </div>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderRadius: '14px',
              background: '#ffffff',
              border: '2px solid rgba(167, 243, 208, 0.95)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
              fontSize: '1.08rem',
              lineHeight: '1.65',
              color: '#0f172a'
            }}>
              <b style={{ color: '#15803d', fontSize: '1.2rem', display: 'block', marginBottom: '0.4rem' }}>
                🌵 Cactus:
              </b>
              Stem becomes fleshy/green to perform photosynthesis and store water. Leaves turn to spines.
            </div>
          </div>
        )}

        {tab === 'cold' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem', width: '100%', flex: 1 }}>
            <div style={{
              padding: '1.35rem 1.6rem',
              borderRadius: '14px',
              background: '#ffffff',
              border: '2px solid rgba(167, 243, 208, 0.95)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
              fontSize: '1.08rem',
              lineHeight: '1.65',
              color: '#0f172a'
            }}>
              <b style={{ color: '#0284c7', fontSize: '1.2rem', display: 'block', marginBottom: '0.4rem' }}>
                🐫 Ladakh Camel:
              </b>
              Two humps, short study limbs to scale mountain paths, shaggy thick woolly hair coat for sub-zero climate.
            </div>
          </div>
        )}

        {tab === 'mountain' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem', width: '100%', flex: 1 }}>
            <div style={{
              padding: '1.35rem 1.6rem',
              borderRadius: '14px',
              background: '#ffffff',
              border: '2px solid rgba(167, 243, 208, 0.95)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
              fontSize: '1.08rem',
              lineHeight: '1.65',
              color: '#0f172a'
            }}>
              <b style={{ color: '#6d28d9', fontSize: '1.2rem', display: 'block', marginBottom: '0.4rem' }}>
                🌲 Mountain Pine/Deodar:
              </b>
              Sloping branches let snow slide off. Conical shape and needle-thin leaves protect against frost.
            </div>
          </div>
        )}

        {tab === 'pioneers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', flex: 1 }}>
            <div style={{
              padding: '1.05rem 1.35rem',
              borderRadius: '12px',
              background: '#ffffff',
              border: '2px solid rgba(167, 243, 208, 0.95)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
              fontSize: '1.05rem',
              lineHeight: '1.6',
              color: '#0f172a'
            }}>
              • <b style={{ color: '#0284c7' }}>Dr. Salim Ali:</b> India's Birdman, mapped ornithological habitats.
            </div>
            <div style={{
              padding: '1.05rem 1.35rem',
              borderRadius: '12px',
              background: '#ffffff',
              border: '2px solid rgba(167, 243, 208, 0.95)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
              fontSize: '1.05rem',
              lineHeight: '1.6',
              color: '#0f172a'
            }}>
              • <b style={{ color: '#b45309' }}>Project Tiger (1973):</b> Landmark preservation scheme for national tiger populations.
            </div>
            <div style={{
              padding: '1.05rem 1.35rem',
              borderRadius: '12px',
              background: '#ffffff',
              border: '2px solid rgba(167, 243, 208, 0.95)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
              fontSize: '1.05rem',
              lineHeight: '1.6',
              color: '#0f172a'
            }}>
              • <b style={{ color: '#15803d' }}>Sacred Groves:</b> Local community forest reserves where woodcutting is banned.
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

    const isPlantVarietyConcept = lessonId === 'plant_variety_concept';
    const isVenationRootsConcept = lessonId === 'venation_roots_concept';
    const isCotyledonsConcept = lessonId === 'cotyledons_concept';
    const isPlantConcept = isPlantVarietyConcept || isVenationRootsConcept;
    const isAdaptationsConcept = lessonId === 'adaptations_concept';
    const isGroupingAnimalsConcept = lessonId === 'grouping_animals_concept';
    const isCh2Concept = chapterNum === 2;
    const isEnlargedTextConcept = isPlantConcept || isAdaptationsConcept;

    const isScientistSlide = (isGroupingAnimalsConcept && currentSlideIndex === 2) || (isAdaptationsConcept && currentSlideIndex === 2);
    const isAdaptationsSlide1Or2 = isAdaptationsConcept && (currentSlideIndex === 0 || currentSlideIndex === 1);
    const isAdaptationsSlide5 = isAdaptationsConcept && currentSlideIndex === 4;

    return (
      <div 
        className="split-frame" 
        style={{ 
          width: '100%', 
          minHeight: isAdaptationsSlide1Or2 ? '620px' : '560px',
          ...(isAdaptationsSlide1Or2 ? {
            gridTemplateColumns: '0.62fr 1.38fr',
            gap: '1.25rem'
          } : {})
        }}
      >
        {/* LEFT COLUMN: Concept text & slideshow buttons */}
        <div 
          className={`frame-page-left ${isCh2Concept || isPlantConcept ? 'act24-mint-left' : ''}`} 
          style={{
            ...(isGroupingAnimalsConcept ? { padding: '1.25rem 1.4rem' } : {}),
            ...(isPlantVarietyConcept ? { padding: '1.35rem 1.5rem', display: 'flex', flexDirection: 'column' } : {}),
            ...(isAdaptationsSlide1Or2 ? { padding: '1.5rem 1.6rem', display: 'flex', flexDirection: 'column', minHeight: '100%' } : {}),
            ...(isCh2Concept ? {
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)',
              border: '1.5px solid rgba(167, 243, 208, 0.95)',
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(16px)'
            } : {}),
            ...(isAdaptationsSlide5 ? {
              alignSelf: 'start'
            } : {})
          }}
        >
          {isCh2Concept ? (
            <div>
              <div className="textbook-eyebrow" style={{ 
                fontSize: '14px', 
                color: '#ffffff', 
                fontWeight: '800', 
                letterSpacing: '0.06em',
                display: 'inline-block',
                background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                border: '1.5px solid #064e3b',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(6, 95, 70, 0.25)',
                marginBottom: '0.5rem'
              }}>
                {activeLevel.title}
              </div>
              <h1 className="textbook-title" style={{
                fontFamily: 'var(--serif-font)',
                margin: '0 0 0.85rem 0',
                fontSize: isScientistSlide ? '1.75rem' : '2.1rem',
                color: '#0f172a',
                fontWeight: '900',
                lineHeight: '1.2'
              }}>
                {slide.title}
              </h1>
            </div>
          ) : (
            <>
              <div className="textbook-eyebrow" style={{ color: '#38bdf8', fontSize: isGroupingAnimalsConcept ? '0.96rem' : (isEnlargedTextConcept ? '1.05rem' : '0.85rem'), fontWeight: '800', marginBottom: isGroupingAnimalsConcept ? '0.35rem' : undefined }}>
                {activeLevel.title}
              </div>
              <h1 className="textbook-title" style={{
                fontFamily: 'var(--serif-font)',
                margin: isGroupingAnimalsConcept ? '0 0 0.65rem 0' : '0 0 0.85rem 0',
                fontSize: isGroupingAnimalsConcept ? (isScientistSlide ? '1.45rem' : '1.65rem') : (isScientistSlide ? '1.75rem' : (isEnlargedTextConcept ? '2.1rem' : '1.65rem')),
                color: '#38bdf8',
                fontWeight: '800'
              }}>
                {slide.title}
              </h1>
            </>
          )}
          
          <p style={{
            fontSize: (isAdaptationsSlide1Or2 || isAdaptationsSlide5) ? '1.18rem' : (isPlantVarietyConcept ? '1.08rem' : (isCh2Concept ? '1.05rem' : (isGroupingAnimalsConcept ? (isScientistSlide ? '1.02rem' : '1.12rem') : (isScientistSlide ? '1.05rem' : (isEnlargedTextConcept ? '1.22rem' : '1.02rem'))))),
            color: isCh2Concept ? '#1e293b' : '#fde047',
            lineHeight: (isAdaptationsSlide1Or2 || isAdaptationsSlide5) ? '1.6' : (isPlantVarietyConcept ? '1.58' : (isGroupingAnimalsConcept ? '1.5' : (isScientistSlide ? '1.45' : '1.65'))),
            margin: isPlantVarietyConcept ? '0 0 1rem 0' : (isGroupingAnimalsConcept ? '0 0 0.75rem 0' : '0 0 0.85rem 0'),
            fontWeight: isCh2Concept ? '700' : '500'
          }}>
            {slide.content}
          </p>

          {slide.bullets && (
            isPlantVarietyConcept ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem',
                margin: '0 0 1rem 0',
                flex: 1
              }}>
                {slide.bullets.map((b, i) => {
                  let badgeColor = '#065f46';
                  let badgeBg = '#dcfce7';
                  let badgeBorder = '#86efac';
                  
                  if (b.includes('Shrubs')) {
                    badgeColor = '#9a3412';
                    badgeBg = '#ffedd5';
                    badgeBorder = '#fed7aa';
                  } else if (b.includes('Trees')) {
                    badgeColor = '#15803d';
                    badgeBg = '#dcfce7';
                    badgeBorder = '#86efac';
                  } else if (b.includes('Creepers')) {
                    badgeColor = '#0369a1';
                    badgeBg = '#e0f2fe';
                    badgeBorder = '#7dd3fc';
                  } else if (b.includes('Climbers')) {
                    badgeColor = '#7c2d12';
                    badgeBg = '#fef3c7';
                    badgeBorder = '#fde68a';
                  }

                  const parts = b.split(': ');
                  return (
                    <div key={i} style={{
                      background: '#ffffff',
                      border: '1.5px solid rgba(167, 243, 208, 0.95)',
                      borderRadius: '14px',
                      padding: '1.1rem 1.25rem',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      flex: 1
                    }}>
                      {parts.length > 1 ? (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{
                              background: badgeBg,
                              color: badgeColor,
                              border: `1.5px solid ${badgeBorder}`,
                              padding: '0.22rem 0.75rem',
                              borderRadius: '8px',
                              fontWeight: '900',
                              fontSize: '1.08rem',
                              letterSpacing: '0.01em'
                            }}>
                              {parts[0]}
                            </span>
                          </div>
                          <div style={{ color: '#1e293b', fontSize: '1.05rem', lineHeight: '1.58', fontWeight: '600', paddingLeft: '0.15rem' }}>
                            {parts[1]}
                          </div>
                        </>
                      ) : (
                        <div style={{ color: '#0f172a', fontSize: '1.08rem', lineHeight: '1.58', fontWeight: '700' }}>
                          {b}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : isVenationRootsConcept ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                margin: '0 0 0.85rem 0'
              }}>
                {slide.bullets.map((b, i) => {
                  let badgeColor = '#064e3b';
                  let badgeBg = '#dcfce7';
                  let badgeBorder = '#86efac';
                  
                  if (b.includes('Parallel')) {
                    badgeColor = '#0369a1';
                    badgeBg = '#e0f2fe';
                    badgeBorder = '#7dd3fc';
                  } else if (b.includes('Taproot')) {
                    badgeColor = '#92400e';
                    badgeBg = '#fef3c7';
                    badgeBorder = '#fde68a';
                  } else if (b.includes('Fibrous')) {
                    badgeColor = '#9a3412';
                    badgeBg = '#ffedd5';
                    badgeBorder = '#fed7aa';
                  }

                  const parts = b.split(': ');
                  return (
                    <div key={i} style={{
                      background: '#ffffff',
                      border: '1.5px solid rgba(167, 243, 208, 0.95)',
                      borderRadius: '12px',
                      padding: '0.7rem 0.95rem',
                      boxShadow: '0 2px 8px rgba(0, 30, 15, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}>
                      {parts.length > 1 ? (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{
                              background: badgeBg,
                              color: badgeColor,
                              border: `1px solid ${badgeBorder}`,
                              padding: '0.18rem 0.65rem',
                              borderRadius: '6px',
                              fontWeight: '800',
                              fontSize: '0.96rem',
                              letterSpacing: '0.02em'
                            }}>
                              {parts[0]}
                            </span>
                          </div>
                          <div style={{ color: '#334155', fontSize: '1.02rem', lineHeight: '1.48', fontWeight: '600', paddingLeft: '0.15rem' }}>
                            {parts[1]}
                          </div>
                        </>
                      ) : (
                        <div style={{ color: '#0f172a', fontSize: '1.05rem', lineHeight: '1.48', fontWeight: '700' }}>
                          {b}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : isCh2Concept ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: (isAdaptationsSlide1Or2 || isAdaptationsSlide5) ? '0.75rem' : '0.55rem',
                margin: (isAdaptationsSlide1Or2 || isAdaptationsSlide5) ? '0 0 1rem 0' : '0 0 0.85rem 0'
              }}>
                {slide.bullets.map((b, i) => (
                  <div key={i} style={{
                    background: '#ffffff',
                    border: '1.5px solid rgba(167, 243, 208, 0.95)',
                    borderRadius: (isAdaptationsSlide1Or2 || isAdaptationsSlide5) ? '12px' : '10px',
                    padding: (isAdaptationsSlide1Or2 || isAdaptationsSlide5) ? '0.85rem 1.15rem' : '0.6rem 0.85rem',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                    color: '#0f172a',
                    fontSize: (isAdaptationsSlide1Or2 || isAdaptationsSlide5) ? '1.14rem' : '0.96rem',
                    lineHeight: (isAdaptationsSlide1Or2 || isAdaptationsSlide5) ? '1.55' : '1.5',
                    fontWeight: '700'
                  }}>
                    • {b}
                  </div>
                ))}
              </div>
            ) : (
              <ul style={{
                margin: isGroupingAnimalsConcept ? '0 0 0.85rem 0' : '0 0 1.25rem 0',
                paddingLeft: isGroupingAnimalsConcept ? '1.25rem' : '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: isGroupingAnimalsConcept ? (isScientistSlide ? '0.38rem' : '0.55rem') : (isScientistSlide ? '0.4rem' : (isEnlargedTextConcept ? '0.55rem' : '0.4rem'))
              }}>
                {slide.bullets.map((b, i) => (
                  <li key={i} style={{
                    fontSize: isGroupingAnimalsConcept ? (isScientistSlide ? '0.94rem' : '1.04rem') : (isScientistSlide ? '0.98rem' : (isEnlargedTextConcept ? '1.14rem' : '0.95rem')),
                    color: '#fde047',
                    lineHeight: isGroupingAnimalsConcept ? '1.48' : (isScientistSlide ? '1.4' : '1.6'),
                    fontWeight: '500'
                  }}>
                    {b}
                  </li>
                ))}
              </ul>
            )
          )}

          {isVenationRootsConcept && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.95), rgba(255, 255, 255, 0.98))',
              border: '1.5px dashed #059669',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              marginTop: 'auto',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.06)'
            }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #059669, #047857)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.15rem',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(4, 120, 87, 0.25)'
              }}>
                🔬
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Lab Diagnostic Tip
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a', lineHeight: '1.35' }}>
                  {currentSlideIndex === 0 && 'Inspect leaf veins carefully: net-mesh indicates reticulate, straight lines indicate parallel.'}
                  {currentSlideIndex === 1 && 'Observe root structure: one main thick taproot vs multiple equal fibrous threadlike roots.'}
                  {currentSlideIndex === 2 && 'Plants show exact correlation: Reticulate leaf ⇄ Taproot, Parallel leaf ⇄ Fibrous roots.'}
                </span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: isAdaptationsSlide5 ? '1.1rem' : 'auto', paddingTop: isGroupingAnimalsConcept ? '0.75rem' : '1rem', borderTop: isCh2Concept || isPlantConcept ? '1.5px solid rgba(167, 243, 208, 0.7)' : '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {chapterNum !== 2 && (
                <button
                  onClick={() => {
                    if (isReading) {
                      handleStopSpeech();
                    } else {
                      handleReadAloud(`${slide.title}. ${slide.content || ''}. ${slide.bullets ? slide.bullets.join('. ') : ''}`);
                    }
                  }}
                  className="outline"
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.35rem 0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    borderRadius: '20px',
                    background: isReading ? 'rgba(99,102,241,0.08)' : 'transparent',
                    borderColor: isReading ? 'var(--accent)' : 'var(--border)',
                    color: isReading ? 'var(--accent)' : 'var(--text-primary)',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                  title={isReading ? "Stop Reading" : "Read Aloud"}
                >
                  {isReading ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  <span>{isReading ? 'Stop' : 'Read'}</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: isCh2Concept || isPlantConcept ? '#047857' : 'var(--text-muted)', fontWeight: isCh2Concept || isPlantConcept ? '700' : 'normal', marginRight: '0.2rem' }}>
                Slide {currentSlideIndex + 1} of {totalSlides}
              </span>
              {currentSlideIndex > 0 && (
                <button
                  onClick={() => { handleStopSpeech(); setActiveSlide(prev => Math.max(0, prev - 1)); }}
                  className="outline"
                  style={{ 
                    padding: '0.35rem 0.8rem', 
                    fontSize: '0.75rem', 
                    borderRadius: '20px',
                    ...(isCh2Concept || isPlantConcept ? {
                      border: '1.5px solid #10b981',
                      color: '#065f46',
                      fontWeight: '800',
                      background: '#ffffff'
                    } : {})
                  }}
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
                  style={{ 
                    padding: '0.35rem 0.8rem', 
                    fontSize: '0.75rem', 
                    borderRadius: '20px',
                    ...(isCh2Concept || isPlantConcept ? {
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      borderColor: '#059669',
                      fontWeight: '800'
                    } : {})
                  }}
                >
                  Activity ➔
                </button>
              ) : (
                <button
                  disabled={slide.isQuiz && !quizChecked}
                  onClick={() => { handleStopSpeech(); setActiveSlide(prev => prev + 1); }}
                  className="primary"
                  style={{ 
                    padding: '0.35rem 0.8rem', 
                    fontSize: '0.75rem', 
                    borderRadius: '20px',
                    ...(isCh2Concept || isPlantConcept ? {
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      borderColor: '#059669',
                      fontWeight: '800'
                    } : {})
                  }}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Sandbox or Fallbacks */}
        <div className="frame-page-right" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, justifyContent: 'center', background: 'transparent', border: 'none', padding: '0', width: '100%', height: '100%' }}>
          {slide.image ? (
            (isAdaptationsConcept || lessonId === 'grouping_animals_concept') ? (
              <div style={{
                width: '100%',
                height: slide.image === 'sacred_groves' ? 'auto' : '100%',
                minHeight: slide.image === 'sacred_groves' ? 'auto' : '100%',
                maxHeight: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                margin: 0,
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                border: '2px solid rgba(167, 243, 208, 0.95)',
                background: '#ffffff'
              }}>
                <img 
                  src={slide.image === 'Scientist2' ? scientist2Img :
                       slide.image === 'silent_valley' ? silentValleyImg :
                       slide.image === 'Scientist1' ? scientist1Img :
                       slide.image === 'protect_wildlife' ? protectWildlifeImg :
                       slide.image === 'sacred_groves' ? sacredGrovesImg : ''} 
                  alt={slide.title} 
                  style={{
                    width: '100%',
                    height: slide.image === 'sacred_groves' ? 'auto' : '100%',
                    maxHeight: '100%',
                    objectFit: slide.image === 'sacred_groves' ? 'contain' : 'cover',
                    objectPosition: 'center',
                    display: 'block'
                  }} 
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <div style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  border: '1px solid var(--border)',
                  width: '100%',
                  maxHeight: '380px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: theme === 'dark' ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(8px)'
                }}>
                  <img 
                    src={slide.image === 'Scientist2' ? scientist2Img :
                         slide.image === 'silent_valley' ? silentValleyImg :
                         slide.image === 'Scientist1' ? scientist1Img :
                         slide.image === 'protect_wildlife' ? protectWildlifeImg :
                         slide.image === 'sacred_groves' ? sacredGrovesImg : ''} 
                    alt={slide.title} 
                    style={{ width: '100%', height: 'auto', maxHeight: '360px', objectFit: 'contain', borderRadius: '12px' }} 
                  />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '8px' }}>
                  Textbook Reference Visual (Page {slide.image === 'Scientist2' ? '22' : slide.image === 'silent_valley' ? '23' : slide.image === 'Scientist1' ? '27' : slide.image === 'protect_wildlife' ? '28' : '29'})
                </span>
              </div>
            )
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
        onNext={() => {
          if (chapterNum === 2) {
            goToChapter2Step(1);
          } else {
            handleNextToSlogan();
          }
        }}
        bgImage={coverBgImage}
        bgVideo={coverBgVideo}
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
        onBack={() => {
          if (chapterNum === 2) {
            goToChapter2Step(0);
          } else {
            handleBackToCover();
          }
        }}
        onEnterLab={() => {
          if (chapterNum === 2) {
            goToChapter2Step(2);
          } else {
            handleEnterLab();
          }
        }}
      />
    );
  }

  // Stage: scenes (Chapter 2 — IntroStoryteller scenes before entering lab)
  if (stage === "scenes" && chapterNum === 2) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: '#0a1220',
        zIndex: 9999,
        overflow: 'hidden'
      }}>
        <IntroStoryteller
          onComplete={() => {
            goToChapter2Step(3);
          }}
          onBack={() => {
            goToChapter2Step(1);
          }}
        />
      </div>
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
      if (chapterNum === 2) {
        goToChapter2Step(ch2FlowIndex - 1);
        return;
      }

      // Exception: From lvl-1 Animals, "Previous" goes to Plants
      if (activeLevel.id === 'lvl-1' && activityFocused === true && activeActivityIdx === 1) {
        setActiveActivityIdx(0);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        return;
      }
      
      // Exception: From lvl-1 Plants, "Previous" goes back to scenes
      if (activeLevel.id === 'lvl-1') {
        setStage("scenes");
        return;
      }

      if (activityFocused === true) {
        setActivityFocused(false);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        return;
      }
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
      } else {
        if (chapterNum === 2) {
          setStage("slogan");
        } else {
          onBack();
        }
      }
    };

    const isNextDisabled = () => {
      // Never disable next button so we can guide users with custom alerts when clicked
      return false;
    };

    const handleNextControl = () => {
      if (chapterNum === 2) {
        goToChapter2Step(ch2FlowIndex + 1);
        return;
      }

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
      
      // 1. Browse lesson slides first
      if (activeSlide < totalSlides - 1) {
        setActiveSlide(prev => prev + 1);
        setQuizAnswers({});
        setQuizChecked(false);
        return;
      }
      
      // 2. Focus activity if it isn't focused yet and we just completed slides
      if (activeLevel.activities.length > 0 && !activityFocused && activeActivityIdx === 0 && (chapterNum === 2 ? false : activityStatus[activeActivity.id] !== 'done')) {
        setActivityFocused(true);
        setActiveActivityIdx(0);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        return;
      }
      
      // 3. Advance activities if there are multiple for this level
      if (activeActivityIdx < activeLevel.activities.length - 1) {
        setActiveActivityIdx(prev => prev + 1);
        setActivityFocused(true);
        return;
      }
      
      // 4. If current activity is not marked as Done, prompt user to do so
      // Exception: Chapter 2 (chapterNum === 2) and lvl-1 navigate freely without requiring 'done' or showing completion alert
      if (chapterNum !== 2 && activeActivity && activityStatus[activeActivity.id] !== 'done' && activeLevel.id !== 'lvl-1') {
        alert("Please complete the current activity and mark it as Done before proceeding!");
        return;
      }
      
      // 5. If we are still focusing the activity (and it's marked done), return to Show All to reveal the quiz
      // Exception: lvl-1 navigates directly without unfocusing to show quiz
      if (activityFocused && activeLevel.id !== 'lvl-1') {
        setActivityFocused(null);
        setTimeout(() => {
          const quizPaneEl = document.getElementById("pane-quiz-window");
          if (quizPaneEl) {
            quizPaneEl.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        return;
      }
      
      // 6. Check if subheading quiz exists and is completed
      // Exception: Chapter 2 (chapterNum === 2) users navigate freely without requiring Checkpoint Quiz restriction
      const isActivity21ToActivity22 = activeLevel.id === 'lvl-1';
      const hasQuiz = LEVEL_QUIZZES[activeLevel.lessonId];
      if (chapterNum !== 2 && hasQuiz && !quizChecked && !isActivity21ToActivity22) {
        alert("Please complete the Checkpoint Quiz and check your answers first!");
        setTimeout(() => {
          const quizPaneEl = document.getElementById("pane-quiz-window");
          if (quizPaneEl) {
            quizPaneEl.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
        return;
      }
      
      // 7. Proceed to next subheading level
      if (activeLevelIdx < totalLevels - 1) {
        setActivityFocused(null);
        setActiveLevelId(CHAPTER_2_LEVELS[activeLevelIdx + 1].id);
        setActiveActivityIdx(0);
        setActiveSlide(0);
        setQuizAnswers({});
        setQuizChecked(false);
      }
    };

    // Use dark theme background for Chapter 2 activities, Key Vocabulary / Glossary, and Chapter Challenge
    const isDarkThemePage = chapterNum === 2 && (
      (activeLevel && (
        activeLevel.id === 'lvl-1' ||
        activeLevel.id === 'lvl-3' ||
        activeLevel.id === 'lvl-4' ||
        activeLevel.id === 'lvl-5' ||
        activeLevel.id === 'lvl-6' ||
        activeLevel.id === 'lvl-7' ||
        activeLevel.id === 'lvl-8' ||
        activeLevel.id === 'lvl-9'
      )) ||
      (activeActivitySectionId === 'sec-2-2-act' || 
       activeActivitySectionId === 'sec-2-3-act' || 
       activeActivitySectionId === 'sec-2-4-act' || 
       activeActivitySectionId === 'sec-2-5-act' || 
       activeActivitySectionId === 'sec-2-6-act' ||
       activeActivitySectionId === 'sec-2-7-act' ||
       activeActivitySectionId === 'sec-2-8-act' ||
       activeActivitySectionId === 'sec-2-9-act' ||
       activeActivitySectionId === 'sec-2-10-act' ||
       activeActivitySectionId === 'sec-2-13-act' ||
       activeActivitySectionId === 'sec-2-14-act') ||
      (activityFocused && activeActivity && (
        activeActivity.activityId === 'virtual_biodiversity' ||
        activeActivity.activityId === 'appreciating_biodiversity' ||
        activeActivity.activityId === 'inline_sorting' ||
        activeActivity.activityId === 'plant_detective_stem' ||
        activeActivity.activityId === 'leaf_venation_lab' ||
        activeActivity.activityId === 'root_systems_lab' ||
        activeActivity.activityId === 'venation_root_correlation' ||
        activeActivity.activityId === 'seed_dissection_lab' ||
        activeActivity.activityId === 'animal_locomotion' ||
        activeActivity.activityId === 'animal_habitat_matching'
      ))
    );
    const dynamicBg = isDarkThemePage ? darkForestBg : learningLabBg;

    return (
      <div style={isFullscreen ? {
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        backgroundImage: dynamicBg ? `url(${dynamicBg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'var(--page-bg)',
        zIndex: 99999,
        overflowY: 'auto',
        overflowX: 'hidden',
        boxSizing: 'border-box'
      } : {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
        backgroundImage: dynamicBg ? `url(${dynamicBg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        padding: '0',
        borderRadius: '0',
        height: (chapterNum === 2 && activeLevel.lessonId === 'chapter_challenge_overview' && isChapter2Completed) ? '100vh' : (learningLabBg ? '100vh' : 'auto'),
        overflowY: (chapterNum === 2 && activeLevel.lessonId === 'chapter_challenge_overview' && isChapter2Completed) ? 'hidden' : (learningLabBg ? 'auto' : 'visible'),
        overflowX: 'hidden',
        minHeight: learningLabBg ? '100vh' : 'auto'
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
          
          /* Interactive 3D Flip Card Animation Styles */
          .flip-card-container {
            perspective: 1000px;
            width: 100%;
            height: 315px;
            cursor: pointer;
          }
          .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            transform-style: preserve-3d;
          }
          .flip-card-inner.flipped {
            transform: rotateY(180deg);
          }
          .flip-card-front, .flip-card-back {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 16px;
            overflow: hidden;
          }
          .flip-card-front {
            z-index: 2;
            transform: rotateY(0deg);
          }
          .flip-card-back {
            transform: rotateY(180deg);
            z-index: 1;
            overflow-y: auto;
          }
          
          /* Dynamic Glassmorphic Panel styling when background image is present */
          ${learningLabBg ? `
            .glass-panel {
              background: ${theme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)'} !important;
              backdrop-filter: blur(8px) !important;
              border: 1px solid rgba(255, 255, 255, 0.12) !important;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
            }
            .frame-page-left {
              background: ${theme === 'dark' ? 'rgba(15, 23, 42, 0.88)' : 'rgba(244, 236, 223, 0.88)'} !important;
              backdrop-filter: blur(8px) !important;
              border: 1px solid rgba(255, 255, 255, 0.12) !important;
            }
            .frame-page-left.appreciate-dark-left {
              background: #123D2A !important;
              backdrop-filter: blur(16px) !important;
              border: 1.5px solid rgba(52, 211, 153, 0.4) !important;
            }
            .frame-page-left.act21-dark-left {
              background: #123D2A !important;
            }
            .frame-page-left.act23-mint-left {
              background: linear-gradient(145deg, rgba(246, 252, 248, 0.97) 0%, rgba(236, 247, 241, 0.95) 100%) !important;
            }
            .frame-page-right.act23-mint-right {
              background: linear-gradient(145deg, rgba(246, 252, 248, 0.97) 0%, rgba(236, 247, 241, 0.95) 100%) !important;
            }
            .frame-page-left.act24-mint-left {
              background: linear-gradient(145deg, rgba(246, 252, 248, 0.97) 0%, rgba(236, 247, 241, 0.95) 100%) !important;
              border: 1.5px solid rgba(167, 243, 208, 0.85) !important;
              box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35) !important;
            }
          ` : ''}
          
          /* Chapter 2 specific header hover effect */
          .ch2-hover-header {
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .ch2-hover-header:hover {
            opacity: 1;
          }
          .ch2-hover-header:not(:hover) * {
            pointer-events: none;
          }
        `}</style>

        {/* Master stats & control header (Sticky when not in fullscreen) */}
        {!isFullscreen && chapterNum !== 2 && (
          <div 
            className={chapterNum === 2 ? 'ch2-hover-header' : ''}
            style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: learningLabBg ? '1px solid rgba(255,255,255,0.2)' : 'none',
            borderBottom: learningLabBg ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border)',
            padding: learningLabBg ? '0.85rem 1.5rem' : '0.5rem 0 1rem 0',
            flexWrap: 'wrap',
            gap: '1rem',
            position: 'sticky',
            top: learningLabBg ? '1rem' : 0,
            background: learningLabBg ? (theme === 'dark' ? 'rgba(15, 23, 42, 0.3)' : 'rgba(255, 255, 255, 0.3)') : 'var(--page-bg)',
            backdropFilter: learningLabBg ? 'blur(24px)' : 'none',
            boxShadow: learningLabBg ? '0 8px 32px rgba(0, 0, 0, 0.08)' : 'none',
            borderRadius: learningLabBg ? '16px' : '0',
            margin: learningLabBg ? '1.25rem clamp(0.5rem, 2vw, 1.25rem) 1.5rem clamp(0.5rem, 2vw, 1.25rem)' : '0 0 1.5rem 0',
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

            {chapterNum !== 2 && (
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
                        setActivityStatus(prev => {
                          const newStatus = prev[activeActivity.id] === 'done' ? 'none' : 'done';
                          if (newStatus === 'done') {
                            setActivityFocused(null);
                            setTimeout(() => {
                              const quizPaneEl = document.getElementById("pane-quiz-window");
                              if (quizPaneEl) {
                                quizPaneEl.scrollIntoView({ behavior: 'smooth' });
                              }
                            }, 300);
                          }
                          return { ...prev, [activeActivity.id]: newStatus };
                        });
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
            )}
          </div>
        )}

        {/* Floating controls in Fullscreen Mode — auto-hide on hover */}
        {isFullscreen && (
          <div
            onMouseEnter={() => setFsBarVisible(true)}
            onMouseLeave={() => setFsBarVisible(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10000 }}
          >
            {/* Peek trigger zone — always visible tiny strip */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '16px',
              background: 'transparent', cursor: 'pointer'
            }} />

            {/* Toggle pill button (top-right) */}
            <button
              onClick={() => setFsBarVisible(p => !p)}
              title={fsBarVisible ? 'Hide controls' : 'Show controls'}
              style={{
                position: 'absolute',
                top: fsBarVisible ? '3.6rem' : '0.45rem',
                right: '1rem',
                zIndex: 10001,
                width: '32px', height: '22px',
                borderRadius: '0 0 10px 10px',
                background: 'rgba(15,23,42,0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderTop: 'none',
                color: '#fff', fontSize: '0.65rem',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                transition: 'top 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              {fsBarVisible ? '▲' : '▼'}
            </button>

            {/* Actual controls bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem clamp(0.5rem, 2vw, 1.25rem)',
              background: learningLabBg ? (theme === 'dark' ? 'rgba(10,16,30,0.82)' : 'rgba(255,255,255,0.82)') : 'var(--page-bg)',
              backdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
              transform: fsBarVisible ? 'translateY(0)' : 'translateY(-100%)',
              transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
              pointerEvents: fsBarVisible ? 'auto' : 'none'
            }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', textAlign: 'left' }}>
              <div style={{ 
                fontSize: '0.7rem', 
                fontWeight: 'bold', 
                color: learningLabBg ? (theme === 'dark' ? '#34d399' : '#059669') : 'var(--accent)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                lineHeight: 1 
              }}>
                Fullscreen Focus
              </div>
              <div style={{ 
                fontSize: '0.85rem', 
                fontWeight: '700', 
                color: learningLabBg ? (theme === 'dark' ? '#ffffff' : '#0f172a') : 'var(--text-primary)', 
                lineHeight: 1.2,
                textShadow: learningLabBg ? (theme === 'dark' ? '0 1px 3px rgba(0,0,0,0.6)' : '0 1px 2px rgba(255,255,255,0.75)') : 'none'
              }}>
                {activeLevel.title}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {/* Prev and Next moved to bottom navigation */}
              {activeLevel.activities.length > 0 && (
                <button
                  onClick={() => setActivityFocused(prev => prev === true ? null : true)}
                  className="glass-btn"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {activityFocused === true ? 'Show All' : 'Focus Activity'}
                </button>
              )}
              {activeActivity && !(chapterNum === 2 && activeLevel.id === 'lvl-1') && (
                <button
                  onClick={() => {
                    setActivityStatus(prev => {
                      const newStatus = prev[activeActivity.id] === 'done' ? 'none' : 'done';
                      if (newStatus === 'done') {
                        setActivityFocused(null);
                        setTimeout(() => {
                          const quizPaneEl = document.getElementById("pane-quiz-window");
                          if (quizPaneEl) {
                            quizPaneEl.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 300);
                      }
                      return { ...prev, [activeActivity.id]: newStatus };
                    });
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
          </div>
        </div>
        )}        {/* Side-by-side workspace split */}
        <div style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          width: '100%', 
          alignItems: 'stretch', 
          boxSizing: 'border-box', 
          height: (chapterNum === 2 && activeLevel.lessonId === 'chapter_challenge_overview' && isChapter2Completed) ? '100vh' : 'auto',
          maxHeight: (chapterNum === 2 && activeLevel.lessonId === 'chapter_challenge_overview' && isChapter2Completed) ? '100vh' : 'none',
          overflow: (chapterNum === 2 && activeLevel.lessonId === 'chapter_challenge_overview' && isChapter2Completed) ? 'hidden' : 'visible',
          padding: (chapterNum === 2 && activeLevel.lessonId === 'chapter_challenge_overview' && isChapter2Completed) 
            ? '0.75rem 1rem' 
            : (isFullscreen 
                ? '1.5rem 1.25rem 1.5rem 1.25rem' 
                : (learningLabBg 
                    ? (chapterNum === 2 ? '1rem clamp(0.5rem, 2vw, 1.25rem) 1.5rem clamp(0.5rem, 2vw, 1.25rem)' : '0 clamp(0.5rem, 2vw, 1.25rem) 1.5rem clamp(0.5rem, 2vw, 1.25rem)') 
                    : '0'))
        }}>
          
          {/* Level map on left (hidden in fullscreen) */}
          {!isFullscreen && (
            <div 
              onMouseEnter={handleLevelMapEnter}
              onMouseLeave={handleLevelMapLeave}
              style={{
                position: 'fixed',
                left: isLevelMapOpen ? '0' : '-300px',
                top: learningLabBg ? (chapterNum === 2 ? "1.5rem" : "5.5rem") : "6.5rem",
                bottom: '1.5rem',
                width: '300px',
                zIndex: 50,
                transition: 'left 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                boxShadow: isLevelMapOpen ? '10px 0 30px rgba(0,0,0,0.5)' : 'none'
              }}
            >
              <div style={{ flex: 1, height: '100%', position: 'relative' }}>
                <VerticalLevelMap 
                  sections={CHAPTER_2_LEVELS.map(lvl => ({
                    id: lvl.id,
                    title: lvl.title,
                    isCompleted: isLevelCompleted(lvl)
                  }))}
                  activeSectionId={activeLevelId}
                  onSelectNode={(nodeId) => {
                    if (chapterNum === 2) {
                      const idx = CHAPTER_2_FLOW.findIndex(s => s.levelId === nodeId);
                      if (idx >= 0) goToChapter2Step(idx);
                    } else {
                      setActiveLevelId(nodeId);
                      setActiveActivityIdx(0);
                      setActiveSlide(0);
                      setActivityFocused(false);
                    }
                  }}
                  bgImage={levelMapBg}
                  stickyTop="0"
                />
              </div>

              {/* Trigger Tab */}
              <div 
                onClick={() => setIsLevelMapOpen(!isLevelMapOpen)}
                style={{
                  position: 'absolute',
                  right: '-36px',
                  top: '40%',
                  width: '36px',
                  height: '110px',
                  background: 'rgba(6, 30, 20, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderLeft: 'none',
                  borderRadius: '0 12px 12px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '4px 0 15px rgba(0,0,0,0.3)',
                  color: '#fbbf24',
                  transition: 'background 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(6, 30, 20, 0.85)'}
              >
                <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px', color: '#fff', marginBottom: '8px' }}>
                  LEVEL MAP
                </div>
                <ChevronRight size={20} style={{ transform: isLevelMapOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
              </div>
            </div>
          )}

          {/* Combined Lesson & Activity Panel on right */}
          <div style={{ 
            flex: 1, 
            minWidth: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: (chapterNum === 2 && activeLevel.lessonId === 'chapter_challenge_overview' && isChapter2Completed) ? '0' : '2rem', 
            height: (chapterNum === 2 && activeLevel.lessonId === 'chapter_challenge_overview' && isChapter2Completed) ? '100%' : 'auto',
            maxHeight: (chapterNum === 2 && activeLevel.lessonId === 'chapter_challenge_overview' && isChapter2Completed) ? '100%' : 'none',
            overflow: (chapterNum === 2 && activeLevel.lessonId === 'chapter_challenge_overview' && isChapter2Completed) ? 'hidden' : 'visible',
            boxSizing: 'border-box' 
          }}>
            
            {/* 1. TOP PANE: Interactive Lesson Window */}
            <div
              id="pane-lesson-window"
              className={(activeLevel.lessonId === 'biodiversity_concept' || (activeLevel.lessonId === 'chapter_challenge_overview' && isChapter2Completed)) ? '' : 'glass-panel'}
              style={{
                display: (chapterNum === 2 ? (!showBriefing && (activityFocused === null || activityFocused === false)) : (!isFullscreen || activityFocused !== true)) ? 'flex' : 'none',
                flexDirection: 'column',
                gap: (activeLevel.lessonId === 'biodiversity_concept' || (activeLevel.lessonId === 'chapter_challenge_overview' && isChapter2Completed)) ? '0' : '0.75rem',
                position: 'relative',
                ...((activeLevel.lessonId === 'biodiversity_concept' || (activeLevel.lessonId === 'chapter_challenge_overview' && isChapter2Completed)) ? {
                  background: 'transparent', border: 'none', boxShadow: 'none', padding: 0, borderRadius: '14px', overflow: 'hidden', height: isChapter2Completed ? '100%' : 'auto', maxHeight: isChapter2Completed ? '100%' : 'none'
                } : {})
              }}
            >
              {/* Lesson pane header — overlaid on image for biodiversity, normal otherwise, hidden when completed */}
              {activeLevel.lessonId !== 'biodiversity_concept' && !(activeLevel.lessonId === 'chapter_challenge_overview' && isChapter2Completed) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ 
                    fontSize: '1.28rem', 
                    fontWeight: '900', 
                    color: '#38bdf8', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.08em',
                    textShadow: '0 0 16px rgba(56, 189, 248, 0.65), 0 2px 10px rgba(56, 189, 248, 0.45)'
                  }}>
                    Lesson Pane
                  </span>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: '700',
                    color: '#bae6fd',
                    background: 'rgba(14, 165, 233, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '6px'
                  }}>
                    Level {activeLevelIdx + 1} of {totalLevels}
                  </span>
                </div>
              )}

              {activeLevel.lessonId === 'biodiversity_concept' ? (
                chapterNum === 2 ? null : (
                  <IntroStoryteller 
                    onComplete={() => {
                      setContentLessonProgress(prev => ({ ...prev, biodiversity_concept: true }));
                      setActivityFocused(true);
                      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
                    }} 
                    onBack={() => {}}
                  />
                )
              ) : activeLevel.lessonId === 'vocabulary_glossary' ? (
                <VocabularyGlossary 
                  onMatchComplete={() => {
                    setContentLessonProgress(prev => ({ ...prev, vocabulary_glossary: true }));
                  }}
                />
              ) : activeLevel.lessonId === 'chapter_challenge_overview' ? (
                <ChapterChallengeOverview 
                  onBack={handleExitLab}
                  activeQuestionIndex={challengeQuestionIdx}
                  onQuestionChange={(q) => {
                    setChallengeQuestionIdx(q);
                    setCh2FlowIndex(24 + q);
                  }}
                  isCompleted={isChapter2Completed}
                  onViewSummary={() => {
                    goToChapter2Step(23);
                  }}
                  onComplete={() => {
                    setContentLessonProgress(prev => ({ ...prev, chapter_challenge_overview: true }));
                    setIsChapter2Completed(true);
                    setCh2FlowIndex(49);
                  }}
                  onCompletionStateChange={(completed) => {
                    setIsChapter2Completed(completed);
                    if (completed) setCh2FlowIndex(49);
                  }}
                />
              ) : (
                renderLessonPaneInline(activeLevel.lessonId)
              )}
            </div>

            {/* 2. MIDDLE PANE: Full Interactive Activity Window */}
            {activeLevel.activities && activeLevel.activities.length > 0 && activeLevel.lessonId !== 'vocabulary_glossary' && activeLevel.lessonId !== 'chapter_challenge_overview' && (
              <div id="pane-activity-window" className="glass-panel" style={{ 
                display: (chapterNum === 2 ? (activityFocused === true) : (!isFullscreen || activityFocused !== false)) ? 'flex' : 'none', 
                flexDirection: 'column', 
                gap: '0.75rem',
                padding: '0.75rem 1rem 1rem 1rem !important',
                border: '1px solid var(--border) !important',
                background: 'var(--card-bg) !important',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08) !important',
                borderRadius: '16px !important'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <h4 style={{ 
                    margin: 0, 
                    fontSize: (activeActivity.id === 'sec-2-1-act' || activeActivity.id === 'sec-2-1-act-2' || activeActivity.id === 'sec-2-2-act' || activeActivity.activityId === 'appreciating_biodiversity' || activeActivity.id === 'sec-2-8-act' || activeActivity.activityId === 'seed_dissection_lab' || activeActivity.id === 'sec-2-9-act' || activeActivity.activityId === 'animal_locomotion' || activeActivity.id === 'sec-2-10-act' || activeActivity.activityId === 'animal_habitat_matching') ? '1.45rem' : '1.15rem', 
                    fontWeight: '900', 
                    color: (activeActivity.id === 'sec-2-1-act' || activeActivity.id === 'sec-2-1-act-2' || activeActivity.id === 'sec-2-2-act' || activeActivity.activityId === 'appreciating_biodiversity' || activeActivity.id === 'sec-2-8-act' || activeActivity.activityId === 'seed_dissection_lab' || activeActivity.id === 'sec-2-9-act' || activeActivity.activityId === 'animal_locomotion' || activeActivity.id === 'sec-2-10-act' || activeActivity.activityId === 'animal_habitat_matching') ? '#38bdf8' : 'var(--text-heading)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    textShadow: (activeActivity.id === 'sec-2-1-act' || activeActivity.id === 'sec-2-1-act-2' || activeActivity.id === 'sec-2-2-act' || activeActivity.activityId === 'appreciating_biodiversity' || activeActivity.id === 'sec-2-10-act' || activeActivity.activityId === 'animal_habitat_matching') ? '0 2px 12px rgba(56, 189, 248, 0.45)' : 'none'
                  }}>
                    <span>{activeActivity.title}</span>
                    {activeActivity.pg && (
                      <span style={{ 
                        fontSize: (activeActivity.id === 'sec-2-1-act' || activeActivity.id === 'sec-2-1-act-2' || activeActivity.id === 'sec-2-2-act' || activeActivity.activityId === 'appreciating_biodiversity' || activeActivity.id === 'sec-2-8-act' || activeActivity.activityId === 'seed_dissection_lab' || activeActivity.id === 'sec-2-9-act' || activeActivity.activityId === 'animal_locomotion' || activeActivity.id === 'sec-2-10-act' || activeActivity.activityId === 'animal_habitat_matching') ? '0.9rem' : '0.75rem', 
                        fontWeight: 'bold', 
                        color: (activeActivity.id === 'sec-2-1-act' || activeActivity.id === 'sec-2-1-act-2' || activeActivity.id === 'sec-2-2-act' || activeActivity.activityId === 'appreciating_biodiversity' || activeActivity.id === 'sec-2-8-act' || activeActivity.activityId === 'seed_dissection_lab' || activeActivity.id === 'sec-2-9-act' || activeActivity.activityId === 'animal_locomotion' || activeActivity.id === 'sec-2-10-act' || activeActivity.activityId === 'animal_habitat_matching') ? '#ffffff' : 'var(--text-muted)', 
                        background: (activeActivity.id === 'sec-2-1-act' || activeActivity.id === 'sec-2-1-act-2' || activeActivity.id === 'sec-2-2-act' || activeActivity.activityId === 'appreciating_biodiversity' || activeActivity.id === 'sec-2-8-act' || activeActivity.activityId === 'seed_dissection_lab' || activeActivity.id === 'sec-2-9-act' || activeActivity.activityId === 'animal_locomotion' || activeActivity.id === 'sec-2-10-act' || activeActivity.activityId === 'animal_habitat_matching') ? '#1e3a8a' : 'var(--border)', 
                        border: (activeActivity.id === 'sec-2-1-act' || activeActivity.id === 'sec-2-1-act-2' || activeActivity.id === 'sec-2-2-act' || activeActivity.activityId === 'appreciating_biodiversity' || activeActivity.id === 'sec-2-8-act' || activeActivity.activityId === 'seed_dissection_lab' || activeActivity.id === 'sec-2-9-act' || activeActivity.activityId === 'animal_locomotion' || activeActivity.id === 'sec-2-10-act' || activeActivity.activityId === 'animal_habitat_matching') ? '1px solid #38bdf8' : 'none',
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '6px' 
                      }}>
                        {activeActivity.pg}
                      </span>
                    )}
                  </h4>
                  {activeLevel.activities.length > 1 && activeLevel.id !== 'lvl-1' && (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
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
                              padding: '0.35rem 0.75rem', 
                              fontSize: '0.8rem', 
                              borderRadius: '6px', 
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              boxShadow: activeActivityIdx === aIdx ? '0 4px 10px rgba(99,102,241,0.2)' : 'none'
                            }}
                          >
                            {btnLabel}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{ 
                  width: '100%', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  position: 'relative'
                }}>
                  {activeActivity.activityId ? (
                    renderCustomSandbox(activeActivity.activityId, (action) => {
                      setActivityStatus(prev => ({ ...prev, [activeActivity.id]: 'done' }));
                      confetti({ particleCount: 60, spread: 60, origin: { y: 0.75 } });
                      if (action === 'next_activity') {
                        setActiveActivityIdx(prev => Math.min(activeLevel.activities.length - 1, prev + 1));
                        setActivityFocused(true);
                      } else if (action === 'go_to_quiz') {
                        setActivityFocused(null);
                        setTimeout(() => {
                          const quizPaneEl = document.getElementById("pane-quiz-window");
                          if (quizPaneEl) {
                            quizPaneEl.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 300);
                      } else {
                        setActivityFocused(null);
                      }
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
            )}

            {/* 3. BOTTOM PANE: Quiz & DYK Pane */}
            <div style={{ display: (chapterNum === 2 ? (!showBriefing && (activityFocused === null || activityFocused === false)) : (!isFullscreen || activityFocused !== true)) ? 'flex' : 'none', flexDirection: 'column', gap: '0.75rem' }}>
              {activeLevel.lessonId === 'vocabulary_glossary'
                  ? <SummaryPane lessonId={activeLevel.lessonId} />
                  : activeLevel.lessonId === 'chapter_challenge_overview'
                  ? null
                  : renderQuizAndDykPane(activeLevel.lessonId)
              }
            </div>

            {/* 4. BOTTOM NAVIGATION PANE */}
            {!(chapterNum === 2 && activeLevel.lessonId === 'chapter_challenge_overview' && isChapter2Completed) && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: (chapterNum === 2 ? '0.4rem 0 0.25rem 0' : '2rem 0 1rem 0'),
                borderTop: '1px solid var(--border)',
                marginTop: (chapterNum === 2 ? '0.25rem' : '1rem'),
                width: '100%'
              }}>
                <button
                  onClick={handlePrevControl}
                  className={`glass-btn ${chapterNum === 2 ? 'primary' : ''}`}
                  style={{
                    padding: '0.8rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    background: chapterNum === 2 ? 'var(--accent)' : undefined,
                    color: chapterNum === 2 ? '#ffffff' : undefined,
                    border: chapterNum === 2 ? 'none' : undefined,
                    boxShadow: chapterNum === 2 ? '0 4px 12px rgba(99,102,241,0.3)' : undefined
                  }}
                >
                  ← Previous
                </button>
                
                <button
                  onClick={handleNextControl}
                  className="glass-btn primary"
                  style={{
                    padding: '0.8rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    background: 'var(--accent)',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
                  }}
                >
                  {(() => {
                    if (showBriefing === true) {
                      if (activeLevel.activities && activeLevel.activities.length > 0) {
                        const actTitle = activeLevel.activities[0].title;
                        const shortTitle = actTitle.includes("—") ? actTitle.split("—")[0].trim() : actTitle;
                        return `Continue to ${shortTitle} →`;
                      }
                      return "Continue →";
                    } else if (activityFocused === true) {
                      return "Next Activity →";
                    } else {
                      const lessonData = typeof contentLessonsData !== 'undefined' ? contentLessonsData[activeLevel.lessonId] : null;
                      const maxSlides = lessonData ? lessonData.slides.length : 1;
                      if (activeSlide < maxSlides - 1) {
                        return "Next Scene →";
                      } else {
                        return "Next →";
                      }
                    }
                  })()}
                </button>
              </div>
            )}
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
