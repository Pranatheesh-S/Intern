import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Play, X, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import CoverPage from "./CoverPage";
import SloganPage from "./SloganPage";
import VerticalLevelMap from "./VerticalLevelMap";
import confetti from "canvas-confetti";

import creeperImg from "../assets/creeper.jpeg";
import climberImg from "../assets/climber.jpeg";
import scientist1Img from "../assets/Scientist1.jpeg";
import scientist2Img from "../assets/Scientist2.jpeg";
import silentValleyImg from "../assets/silent_valley.jpeg";
import protectWildlifeImg from "../assets/protect_wildlife.jpeg";
import sacredGrovesImg from "../assets/sacred_groves.jpeg";

// Context
import { useTheme } from "../ThemeContext";

// Content Lessons (Class 6 Chapter 2)
import IntroductionMindMap from "../science/class6/chapter2/IntroductionMindMap";
import GroupingBasicsBookSpread from "../science/class6/chapter2/GroupingBasicsBookSpread";

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
  'grouping_basics_concept': [
    {
      q: 'Why do we group plants and animals in science?',
      opts: [
        'To prevent them from moving around.',
        'To make it easier to study their similarities and differences.',
        'To calculate the exact number of leaves on each tree.'
      ],
      correct: 1,
      explanation: '• Classification is the process of sorting objects or living things into categories based on shared properties.\n• It helps scientists systematically understand the massive variety of life on Earth.\n• By grouping, it becomes easier to identify patterns, compare structures, and study evolutionary relationships.'
    },
    {
      q: 'Which of these is a valid scientific basis for grouping plants?',
      opts: [
        'The height and nature of its stem.',
        'The names given to them by gardeners.',
        'The total amount of shade they cast at noon.'
      ],
      correct: 0,
      explanation: '• Scientific classification of plants relies on observable, stable physical characteristics.\n• Height, stem thickness, woody nature, and where branching starts are the standard criteria.\n• Using these traits, plants are categorized into Herbs, Shrubs, Trees, Climbers, and Creepers.'
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
      },
      {
        title: 'Eminent Scientists: Dr. Salim Ali (Page 22)',
        content: 'Dr. Salim Ali (1896–1987) was an eminent Indian ornithologist and naturalist, widely known as the "Birdman of India". He conducted systematic bird surveys across India and wrote books that popularised bird-watching.',
        bullets: [
          '🔍 Pioneer: He was among the first to conduct systematic bird surveys in India.',
          '📖 Author: Wrote the landmark "Handbook of the Birds of India and Pakistan".',
          '🌿 Advocate: Played a key role in saving Silent Valley and establishing Keoladeo National Park.'
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
        title: 'Eminent Scientists: Dr. E. K. Janaki Ammal (Page 27)',
        content: 'Dr. Edavaleth Kakkat Janaki Ammal (1897–1984) was a pioneering Indian botanist and plant cytogeneticist. She made significant contributions to genetics, sugarcane breeding, and environmental conservation.',
        bullets: [
          '🌾 Sugar Breeding: Co-developed sweet sugarcane varieties suited to Indian climates.',
          '🌲 Save Silent Valley: Mobilised support to save the Silent Valley tropical rainforest from dam construction.',
          '🌸 Ethnobotany: Documented valuable traditional medicinal plants across India.'
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

function IntroStoryteller({ onComplete }) {
  const [currentScene, setCurrentScene] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [narrationVisible, setNarrationVisible] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const [isDialogueDone, setIsDialogueDone] = useState(false);
  const [dialogueStep, setDialogueStep] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const typeTimerRef = useRef(null);
  const narrationTimerRef = useRef(null);
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
        { character: "Dr. Raghu", avatar: "👨‍🔬", text: "Observe carefully — every living thing has a story to tell!", top: '22%', left: '22%', side: 'right' },
        { character: "Maniram Chacha", avatar: "🧑‍🌾", text: "I know every tree here, children. Come, follow me!", top: '18%', left: '50%', side: 'left' }
      ]
    },
    {
      img: "/Scene2_realistic.png",
      title: "🌿 Observing Diverse Plants",
      text: "As they walk, they observe different kinds of plants. Some are small herbs growing close to the ground, others are bushy shrubs, and some are grand trees with thick trunks. Dr Raghu reminds them to observe gently without plucking any leaves or flowers.",
      dialogues: [
        { character: "Dr. Raghu", avatar: "👨‍🔬", text: "This herb has a soft green stem. Can you feel how different it is from this woody shrub?", top: '25%', left: '30%', side: 'left' }
      ]
    },
    {
      img: "/Scene3_realistic.png",
      title: "🐦 Listening to Bird Calls",
      text: "Hush! Maniram chacha stops and cups his ear. He mimics a bird song, and suddenly, a beautiful response is heard from the tree canopy! The students learn to listen to the unique calls of birds and respect their home.",
      dialogues: [
        { character: "Maniram Chacha", avatar: "🧑‍🌾", text: "Shhh... *cups ear* ...listen... coo-koo-koo! 🎵", top: '18%', left: '38%', side: 'left' },
        { character: "Priya", avatar: "👧", text: "It replied! The bird actually replied to chacha!", top: '30%', left: '60%', side: 'right' }
      ]
    },
    {
      img: "/Scene4_realistic.png",
      title: "🦋 Fluttering Insects & Butterflies",
      text: "Near a cluster of wildflowers, butterflies and bees are busy gathering nectar. The students watch closely as a butterfly unfolds its delicate wings. They notice how insects play a vital role in helping flowers grow.",
      dialogues: [
        { character: "Arjun", avatar: "👦", text: "Sir! That butterfly keeps visiting the same flower again and again!", top: '32%', left: '58%', side: 'right' },
        { character: "Dr. Raghu", avatar: "👨‍🔬", text: "Yes — that is pollination! Insects help flowers reproduce.", top: '18%', left: '26%', side: 'left' }
      ]
    },
    {
      img: "/Scene5_realistic.png",
      title: "🐒 Animals in the Canopy",
      text: "A rustle in the branches reveals monkeys jumping from limb to limb, and a tiny squirrel scurrying down a trunk. The forest is alive with creatures of all sizes, each adapted to live in their part of the woods.",
      dialogues: [
        { character: "Maniram Chacha", avatar: "🧑‍🌾", text: "See that monkey? The treetops are its home — its habitat!", top: '20%', left: '42%', side: 'left' }
      ]
    },
    {
      img: "/Scene6_realistic.png",
      title: "📋 Recording in the Table",
      text: "The students take out their notebooks to record their observations in Tables 2.1 and 2.2. They separate their findings into plants and animals, marveling at the incredible diversity of life surrounding them!",
      dialogues: [
        { character: "Dr. Raghu", avatar: "👨‍🔬", text: "Table 2.1 for plants, Table 2.2 for animals. Compare your findings with your classmates!", top: '22%', left: '35%', side: 'left' }
      ]
    }
  ];

  const totalScenes = scenes.length;
  const scene = scenes[currentScene];

  useEffect(() => {
    clearTimeout(narrationTimerRef.current);
    clearTimeout(typeTimerRef.current);
    clearTimeout(dialogueTimerRef.current);
    setNarrationVisible(false);
    setTypedChars(0);
    setIsDialogueDone(false);
    setIsTypingDone(false);
    setDialogueStep(0);
    setImgLoaded(false);
    return () => {
      clearTimeout(narrationTimerRef.current);
      clearTimeout(typeTimerRef.current);
      clearTimeout(dialogueTimerRef.current);
    };
  }, [currentScene]);

  useEffect(() => {
    if (!isDialogueDone) return;
    narrationTimerRef.current = setTimeout(() => setNarrationVisible(true), 250);
    const text = scene.text;
    let i = 0;
    const type = () => {
      if (i < text.length) {
        i++;
        setTypedChars(i);
        typeTimerRef.current = setTimeout(type, 22);
      } else {
        setIsTypingDone(true);
      }
    };
    typeTimerRef.current = setTimeout(type, 450);
    return () => clearTimeout(typeTimerRef.current);
  }, [isDialogueDone, currentScene]);

  useEffect(() => {
    if (dialogueStep < scene.dialogues.length) {
      dialogueTimerRef.current = setTimeout(() => {
        setDialogueStep(p => p + 1);
      }, 1200);
    } else if (scene.dialogues.length > 0) {
      dialogueTimerRef.current = setTimeout(() => {
        setIsDialogueDone(true);
      }, 250);
    } else {
      setIsDialogueDone(true);
    }
    return () => clearTimeout(dialogueTimerRef.current);
  }, [dialogueStep, currentScene]);

  const skipTyping = () => {
    clearTimeout(typeTimerRef.current);
    clearTimeout(dialogueTimerRef.current);
    setDialogueStep(scene.dialogues.length);
    setIsDialogueDone(true);
    setNarrationVisible(true);
    setTypedChars(scene.text.length);
    setIsTypingDone(true);
  };

  const handleNext = () => { if (currentScene < totalScenes - 1) setCurrentScene(prev => prev + 1); else if (onComplete) onComplete(); };
  const handlePrev = () => { if (currentScene > 0) setCurrentScene(prev => prev - 1); };

  return (
    <div
      onClick={!isTypingDone ? skipTyping : undefined}
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(700px, 90vh, 920px)',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.28)',
        background: '#0a1220',
        cursor: !isTypingDone ? 'pointer' : 'default',
        border: '4px solid white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      
      <div style={{
        position: 'relative',
        height: '100%',
        aspectRatio: '16/9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'auto',
        maxWidth: '100%',
        maxHeight: '100%'
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
            objectFit: 'contain',
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
          const isVisible = dialogueStep > idx;
          return (
            <div key={idx} style={{
              position: 'absolute',
              top: dlg.top,
              left: dlg.left,
              right: dlg.right,
              zIndex: 13,
              width: '240px',
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
                padding: '0.6rem 0.85rem',
                boxShadow: theme === 'light' ? '0 10px 30px rgba(0,0,0,0.1)' : '0 10px 30px rgba(0,0,0,0.4)',
                color: theme === 'light' ? '#0f172a' : '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.28rem' }}>
                  <span style={{ fontSize: '1rem' }}>{dlg.avatar}</span>
                  <span style={{
                    fontSize: '0.68rem',
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
                  fontSize: '0.78rem',
                  color: theme === 'light' ? '#334155' : 'rgba(255,255,255,0.92)',
                  lineHeight: '1.45',
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

      <div style={{ position: 'absolute', top: '0.9rem', right: '0.9rem', display: 'flex', gap: '5px', zIndex: 12 }}>
        {scenes.map((_, i) => (
          <button key={i}
            onClick={(e) => { e.stopPropagation(); setCurrentScene(i); }}
            style={{
              width: i === currentScene ? '20px' : '7px', height: '7px',
              borderRadius: '4px', border: 'none', cursor: 'pointer', padding: 0,
              background: i === currentScene ? '#34d399' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
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

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        padding: '0 1rem 1.1rem',
        zIndex: 14,
        transform: narrationVisible ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        <div style={{
          width: '100%', maxWidth: '680px',
          background: '#E6BF83', 
          color: '#000000',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(160, 82, 45, 0.5)', 
          borderRadius: '16px',
          padding: '1.1rem 1.4rem 0.9rem',
          boxShadow: '0 -2px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(230, 191, 131, 0.18)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#5C4033', letterSpacing: '-0.01em' }}>
              {scene.title}
            </span>
            {!isTypingDone && (
              <button onClick={(e) => { e.stopPropagation(); skipTyping(); }} style={{
                fontSize: '0.68rem', fontWeight: '600', padding: '0.2rem 0.6rem',
                borderRadius: '6px', border: '1px solid rgba(139, 69, 19, 0.4)',
                background: 'rgba(0,0,0,0.07)', color: '#5C4033',
                cursor: 'pointer', transition: 'all 0.2s'
              }}>Skip ▶▶</button>
            )}
          </div>

          <p style={{
            margin: '0 0 0.85rem 0', fontSize: '0.855rem',
            color: '#654321', lineHeight: '1.62',
            minHeight: '3.2em', fontFamily: "'Georgia', 'Times New Roman', serif"
          }}>
            {scene.text.slice(0, typedChars)}
            {!isTypingDone && (
              <span style={{ opacity: 0.8, animation: 'intro-blink 0.65s steps(1) infinite' }}>|</span>
            )}
          </p>

          <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              disabled={currentScene === 0}
              style={{
                padding: '0.42rem 1rem', fontSize: '0.78rem', fontWeight: '600',
                borderRadius: '9px', border: '1px solid rgba(205,133,63,0.38)',
                background: 'rgba(255,255,255,0.07)', color: 'rgba(255,228,196,0.85)',
                cursor: currentScene === 0 ? 'not-allowed' : 'pointer',
                opacity: currentScene === 0 ? 0.38 : 1, transition: 'all 0.2s'
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

      <style>{`
        @keyframes intro-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
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
    <div id="pane-summary-window" className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px dashed var(--border)', paddingTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Key Takeaways
        </span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Chapter Summary
        </span>
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {summaryPoints.map((point, i) => (
            <li key={i} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {point}
            </li>
        ))}
        </ul>
    </div>
    );
}

function ChapterChallengeOverview() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

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
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Handle quiz completion
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
       confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const currentQuestion = chapterChallengeQuestions[currentQuestionIndex];

  return (
    <div className="split-frame" style={{ width: '100%', minHeight: '480px', background: 'var(--card-bg)' }}>
      {/* LEFT PANE: Question, Metadata */}
      <div className="frame-page-left" style={{ background: 'rgba(85, 62, 51, 0.25)', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <div className="textbook-eyebrow" style={{ color: 'var(--accent-text)'}}>Chapter Challenge - Question {currentQuestion.id} of {chapterChallengeQuestions.length}</div>
        <h2 style={{ fontFamily: 'var(--serif-font)', margin: '0.5rem 0 1rem 0', fontSize: '0.95rem', color: 'var(--text-heading)', whiteSpace: 'pre-line', fontWeight: '500', lineHeight: '1.7' }}>
          {currentQuestion.question}
        </h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.7rem', marginBottom: '1.5rem' }}>
            <span style={{background: 'rgba(0,0,0,0.1)', padding: '0.2rem 0.5rem', borderRadius: '10px'}}><b>Difficulty:</b> {currentQuestion.difficulty}</span>
            <span style={{background: 'rgba(0,0,0,0.1)', padding: '0.2rem 0.5rem', borderRadius: '10px'}}><b>Concept:</b> {currentQuestion.concept}</span>
        </div>
      </div>

      {/* RIGHT PANE: Options + Explanation */}
      <div className="frame-page-right" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem', padding: '2rem', transition: 'all 0.3s ease-in-out' }}>
        {/* Options container that moves up altogether when answered */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem', 
          transform: isAnswered ? 'translateY(-10px)' : 'none', 
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}>
          {currentQuestion.options.map((option, index) => {
            const isCorrect = index === currentQuestion.answerIndex;
            const isSelected = index === selectedAnswer;
            let buttonStyle = {
              display: 'block',
              width: '100%',
              padding: '1rem 1.25rem',
              border: '2px solid var(--border)',
              borderRadius: '12px',
              textAlign: 'left',
              background: 'var(--page-bg)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.9rem'
            };

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle.background = 'rgba(16, 185, 129, 0.1)';
                buttonStyle.borderColor = 'var(--success)';
              } else if (isSelected) {
                buttonStyle.background = 'rgba(239, 68, 68, 0.1)';
                buttonStyle.borderColor = 'var(--danger)';
              } else {
                 buttonStyle.opacity = 0.6;
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
            background: 'rgba(0,0,0,0.04)', 
            borderRadius: '12px', 
            padding: '1rem', 
            maxHeight: '260px', 
            overflowY: 'auto',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <h4 style={{ margin: 0, color: 'var(--accent-text)', fontSize: '0.9rem' }}>Explanation</h4>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentQuestion.explanation.map((point, i) => (
                <li 
                  key={i} 
                  className="explanation-point-animated"
                  style={{ 
                    fontSize: '0.82rem', 
                    color: 'var(--text-secondary)', 
                    lineHeight: '1.5',
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
                padding: '0.6rem 1.25rem', 
                borderRadius: '20px', 
                fontSize: '0.8rem',
                alignSelf: 'flex-end'
              }}
            >
              {currentQuestionIndex < chapterChallengeQuestions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
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
  coverBgImage,
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
  const [fsBarVisible, setFsBarVisible] = useState(false);

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
    setActiveSlide(0);
    setQuizAnswers({});
    setQuizChecked(false);
    setActiveQuizQuestionIdx(0);
  }, [activeLevelId, chapterNum, stage]);

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
      <div id="pane-quiz-window" className="glass-panel" style={{ display: (!isFullscreen || activityFocused !== true) ? 'flex' : 'none', flexDirection: 'column', gap: '1.25rem', borderTop: '1px dashed var(--border)', paddingTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {showQuiz ? '📝 CHECKPOINT QUIZ' : '💡 DID YOU KNOW?'}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {showQuiz ? `Question ${activeQuizQuestionIdx + 1} of ${levelQuiz.length}` : 'Fascinating science facts'}
          </span>
        </div>

        {showQuiz ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {quizChecked ? (
              // Quiz completed: show score summary + Did You Know again below
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
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

                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '1.5rem' }}>
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
              <div style={{ 
                padding: '1.25rem', 
                borderRadius: '16px', 
                background: 'rgba(59, 130, 246, 0.04)', 
                border: '1px solid rgba(59, 130, 246, 0.15)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.85rem',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                  <span>📝</span>
                  <span>Checkpoint Quiz Requirements</span>
                </div>
                
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  This checkpoint quiz is currently locked. Complete the following required items to unlock it:
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.25rem' }}>
                  {/* 1. Concept Lesson Status */}
                  {activeLevel.lessonId && (
                    <div 
                      onClick={() => {
                        if (!lessonDone) {
                          setActiveContentLesson(activeLevel.lessonId);
                          setActiveSlide(0);
                          setQuizAnswers({});
                          setQuizChecked(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '0.65rem 1rem', 
                        background: '#fff', 
                        border: '1px solid var(--border)', 
                        borderRadius: '10px', 
                        cursor: !lessonDone ? 'pointer' : 'default',
                        transition: 'all 0.2s' 
                      }}
                      className={!lessonDone ? "hover-scale" : ""}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                        <span>📖</span>
                        <span style={{ fontWeight: '600', color: 'var(--navy)' }}>Concept Lesson</span>
                      </div>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold', 
                        color: lessonDone ? 'var(--success)' : 'var(--accent)',
                        background: lessonDone ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px'
                      }}>
                        {lessonDone ? '✓ Completed' : '→ Click to Read'}
                      </span>
                    </div>
                  )}
                  
                  {/* 2. Activities Status */}
                  {activeLevel.activities && activeLevel.activities.map(act => {
                    const isActDone = activityStatus[act.id] === 'done';
                    return (
                      <div 
                        key={act.id}
                        onClick={() => {
                          if (!isActDone) {
                            const idx = activeLevel.activities.findIndex(a => a.id === act.id);
                            if (idx !== -1) {
                              setActiveActivityIdx(idx);
                              setActivityFocused(true);
                              const actPane = document.getElementById("pane-activity-window");
                              if (actPane) actPane.scrollIntoView({ behavior: 'smooth' });
                            }
                          }
                        }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          padding: '0.65rem 1rem', 
                          background: '#fff', 
                          border: '1px solid var(--border)', 
                          borderRadius: '10px', 
                          cursor: !isActDone ? 'pointer' : 'default',
                          transition: 'all 0.2s' 
                        }}
                        className={!isActDone ? "hover-scale" : ""}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                          <span>{act.icon || '🧩'}</span>
                          <span style={{ fontWeight: '600', color: 'var(--navy)' }}>{act.title}</span>
                        </div>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 'bold', 
                          color: isActDone ? 'var(--success)' : 'var(--accent)',
                          background: isActDone ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px'
                        }}>
                          {isActDone ? '✓ Completed' : '→ Click to Play'}
                        </span>
                      </div>
                    );
                  })}
                </div>
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
    const [placedItems, setPlacedItems] = useState({}); // { itemName: group }
    const [draggedItem, setDraggedItem] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [feedback, setFeedback] = useState('');

    const items = [
      { name: 'Metal Spoon', material: 'Metal', edibility: 'Inedible', icon: '🥄', image: '/spoon_specimen.png', desc: 'Stainless steel.' },
      { name: 'Red Apple', material: 'Organic', edibility: 'Edible', icon: '🍎', image: '/apple_specimen.png', desc: 'Fresh fruit.' },
      { name: 'Plastic Toy', material: 'Plastic', edibility: 'Inedible', icon: '🚗', image: '/toy_specimen.png', desc: 'Hard polymer.' },
      { name: 'Sourdough Bread', material: 'Organic', edibility: 'Edible', icon: '🍞', image: '/bread_specimen.png', desc: 'Baked wheat.' }
    ];

    useEffect(() => {
      setPlacedItems({});
      setFeedback('');
      setSelectedItem(null);
    }, [criteria]);

    const handleClassify = (item, group) => {
      const correctGroup = criteria === 'material' ? item.material : item.edibility;
      if (group === correctGroup) {
        setPlacedItems(prev => ({ ...prev, [item.name]: group }));
        setFeedback(`✅ Correct! ${item.name} classified under ${group}.`);
        setSelectedItem(null);
        
        const nextPlaced = { ...placedItems, [item.name]: group };
        const allDone = items.every(it => {
          const corr = criteria === 'material' ? it.material : it.edibility;
          return nextPlaced[it.name] === corr;
        });
        if (allDone) {
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
        }
      } else {
        setFeedback(`❌ Incorrect! ${item.name} does not belong in ${group}. Try again!`);
      }
    };

    const handleDragStart = (e, item) => {
      setDraggedItem(item);
    };

    const handleDrop = (e, group) => {
      e.preventDefault();
      if (draggedItem) {
        handleClassify(draggedItem, group);
        setDraggedItem(null);
      }
    };

    const handleBinClick = (group) => {
      if (selectedItem) {
        handleClassify(selectedItem, group);
      }
    };

    const handleReset = () => {
      setPlacedItems({});
      setFeedback('');
      setSelectedItem(null);
      setDraggedItem(null);
    };

    const groups = criteria === 'material' ? ['Metal', 'Plastic', 'Organic'] : ['Edible', 'Inedible'];
    const unplacedItems = items.filter(it => !placedItems[it.name]);
    const isAllSorted = items.every(it => {
      const corr = criteria === 'material' ? it.material : it.edibility;
      return placedItems[it.name] === corr;
    });

    const getBinStyle = (g) => {
      switch (g) {
        case 'Metal': return { bg: 'linear-gradient(135deg, #e3c5a8, #cba784)', border: '#a8825f', color: '#475569', labelBg: '#faf6f0' };
        case 'Plastic': return { bg: 'linear-gradient(135deg, #e3c5a8, #cba784)', border: '#a8825f', color: '#d97706', labelBg: '#faf6f0' };
        case 'Organic': return { bg: 'linear-gradient(135deg, #e3c5a8, #cba784)', border: '#a8825f', color: '#059669', labelBg: '#faf6f0' };
        case 'Edible': return { bg: 'linear-gradient(135deg, #e3c5a8, #cba784)', border: '#a8825f', color: '#059669', labelBg: '#faf6f0' };
        case 'Inedible': return { bg: 'linear-gradient(135deg, #e3c5a8, #cba784)', border: '#a8825f', color: '#b91c1c', labelBg: '#faf6f0' };
        default: return { bg: 'linear-gradient(135deg, #e3c5a8, #cba784)', border: '#a8825f', color: 'var(--navy)', labelBg: '#faf6f0' };
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', padding: '1.25rem', background: 'var(--card-bg)', backdropFilter: 'blur(8px)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔍 Dynamic Classification Board
          </span>
          <div style={{ display: 'flex', gap: '0.2rem', background: 'var(--page-bg)', padding: '0.15rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setCriteria('material')}
              className="glass-btn"
              style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.7rem',
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
                padding: '0.2rem 0.5rem',
                fontSize: '0.7rem',
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

        {/* 1. Item pool */}
        {!isAllSorted ? (
          <div>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--navy)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Drag specimens into correct bins:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', width: '100%' }}>
              {unplacedItems.map(item => {
                const isSelected = selectedItem?.name === item.name;
                return (
                  <div
                    key={item.name}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onClick={() => { setSelectedItem(item); setFeedback(''); }}
                    style={{
                      background: isSelected ? 'rgba(99, 102, 241, 0.04)' : 'rgba(255, 255, 255, 0.65)',
                      border: isSelected ? '2.5px solid var(--accent)' : '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.45rem',
                      cursor: 'grab',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isSelected ? '0 8px 16px rgba(99, 102, 241, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.02)',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ 
                      width: '100%', 
                      aspectRatio: '1', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      background: '#f8fafc',
                      border: '1px solid rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        draggable={false}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>{item.name}</span>
                      <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', lineHeight: '1.2' }}>{item.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ padding: '0.5rem', background: '#ecfdf5', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#16a34a', display: 'block' }}>
              🎉 Perfect! All items sorted correctly by {criteria === 'material' ? 'Material' : 'Edibility'}.
            </span>
            <button onClick={handleReset} className="outline" style={{ fontSize: '11px', padding: '0.2rem 0.6rem', borderRadius: '15px', marginTop: '0.4rem' }}>
              Reset Board
            </button>
          </div>
        )}

        {/* 2. Trays grid (Cardboard boxes design) */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${groups.length}, 1fr)`, gap: '0.75rem', marginTop: '0.25rem' }}>
          {groups.map(groupName => {
            const sortedHere = items.filter(it => placedItems[it.name] === groupName);
            const styleProps = getBinStyle(groupName);
            const canDrop = !!selectedItem;
            
            return (
              <div
                key={groupName}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, groupName)}
                onClick={() => handleBinClick(groupName)}
                style={{
                  background: styleProps.bg,
                  border: `2px solid ${styleProps.border}`,
                  borderRadius: '16px',
                  padding: '0.75rem',
                  minHeight: '160px',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: canDrop ? 'pointer' : 'default',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: 'inset 0 16px 0 #ab855f, inset 0 20px 20px rgba(0,0,0,0.12), inset 0 -8px 0 rgba(0,0,0,0.05), 0 8px 16px rgba(0,0,0,0.04)',
                  position: 'relative'
                }}
              >
                {/* Taped Postal Sticker Label */}
                <div style={{
                  background: styleProps.labelBg,
                  border: '1px solid rgba(183, 146, 110, 0.4)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05), inset 0 1px 0 #fff',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  color: styleProps.color,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  width: 'fit-content',
                  margin: '0 auto 0.6rem auto',
                  position: 'relative',
                  pointerEvents: 'none'
                }}>
                  {/* Taped paper sticker strip decoration */}
                  <div style={{ position: 'absolute', top: '-2px', bottom: '-2px', left: '6px', right: '6px', borderLeft: '2px solid rgba(217, 119, 6, 0.12)', borderRight: '2px solid rgba(217, 119, 6, 0.12)' }} />
                  {groupName} Bin
                </div>
                
                {/* Items container inside cardboard box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: 'auto', width: '100%' }}>
                  {sortedHere.map(item => (
                    <div
                      key={item.name}
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid rgba(183, 146, 110, 0.3)',
                        borderRadius: '8px',
                        padding: '0.35rem 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                      }}
                    >
                      <img src={item.image} style={{ width: '18px', height: '18px', borderRadius: '3px', objectFit: 'cover' }} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--navy)' }}>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Feedback alerts */}
        {feedback && (
          <div style={{
            fontSize: '12px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: feedback.startsWith('✅') ? '#10b981' : '#ef4444',
            background: feedback.startsWith('✅') ? '#ecfdf5' : '#fef2f2',
            padding: '0.4rem',
            borderRadius: '8px',
            border: `1px solid ${feedback.startsWith('✅') ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
          }}>
            {feedback}
          </div>
        )}
      </div>
    );
  }

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
        imgSrc: '/herb_plant.png',
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
        imgSrc: '/shrub_plant.png',
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
        imgSrc: '/tree_plant.png',
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', padding: '1.5rem', background: 'var(--card-bg)', backdropFilter: 'blur(10px)', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            🔬 Plant Growth Form Morpher
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tap rings/spots to magnifying cellular details!</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 100px 100px', gap: '1rem', alignItems: 'center' }}>
          <div style={{ padding: '0.85rem', borderRadius: '14px', background: stages[stage].bg, border: `1px solid ${stages[stage].color}33`, minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: stages[stage].color, fontSize: '1.1rem', fontWeight: 'bold' }}>
              {stages[stage].title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
              <span><b>Average Height:</b> {stages[stage].height}</span>
              <span><b>Stem Character:</b> {stages[stage].stem}</span>
              <span><b>NCERT Examples:</b> <i>{stages[stage].examples}</i></span>
            </div>
          </div>
          {/* Realistic View */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#ffffff', borderRadius: '16px', padding: '0.25rem', width: '100px', height: '100px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <img src={stages[stage].imgSrc} alt={stages[stage].title} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '600' }}>Realistic View</span>
          </div>
          {/* Anatomy View */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              background: '#ffffff', 
              borderRadius: '16px', 
              padding: '0.25rem', 
              width: '100px', 
              height: '100px', 
              border: '2px solid var(--accent)', 
              boxShadow: '0 4px 15px rgba(99,102,241,0.15)',
              position: 'relative'
            }}>
              {stages[stage].anatomy}
              
              {/* Pulsating interactive beacon badge */}
              <div style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#dc2626',
                color: '#fff',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 'bold',
                boxShadow: '0 0 8px rgba(220,38,38,0.6)',
                animation: 'beacon-pulse 1s infinite'
              }}>
                🔍
              </div>
            </div>
            <span style={{ fontSize: '9px', color: 'var(--accent)', fontWeight: 'bold' }}>Cellular Anatomy (Tap)</span>
          </div>
        </div>

        {/* Morph Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: '#f8fafc', padding: '0.85rem 1.25rem', borderRadius: '14px', border: '1px solid var(--cardline)' }}>
          <input 
            type="range" 
            min="0" 
            max="2" 
            value={stage} 
            onChange={(e) => { setStage(parseInt(e.target.value)); setActiveHotspot(null); }} 
            style={{ width: '100%', accentColor: stages[stage].color, cursor: 'pointer', height: '6px', borderRadius: '3px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 'bold', color: 'var(--text-muted)' }}>
            <span style={{ color: stage === 0 ? 'var(--accent)' : 'inherit', transition: 'color 0.2s' }}>Herb</span>
            <span style={{ color: stage === 1 ? 'var(--accent)' : 'inherit', transition: 'color 0.2s' }}>Shrub</span>
            <span style={{ color: stage === 2 ? 'var(--accent)' : 'inherit', transition: 'color 0.2s' }}>Tree</span>
          </div>
        </div>

        {/* Hotspot details panel */}
        {activeHotspot ? (
          <div style={{
            background: 'rgba(99,102,241,0.04)',
            borderLeft: '4px solid var(--accent)',
            borderRadius: '8px',
            padding: '0.85rem 1.1rem',
            fontSize: '13px',
            lineHeight: '1.5',
            animation: 'fadeIn 0.25s ease-out'
          }}>
            <strong style={{ color: 'var(--navy)', display: 'block', marginBottom: '0.25rem' }}>{activeHotspot.title}</strong>
            <p style={{ margin: 0, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>{activeHotspot.text}</p>
          </div>
        ) : (
          <div style={{
            background: 'var(--page-bg)',
            border: '1px dashed var(--border)',
            borderRadius: '8px',
            padding: '0.85rem 1.1rem',
            fontSize: '12.5px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span>🔍</span>
            <span><b>Directions:</b> Tap the glowing rings or points in the <b>Cellular Anatomy</b> view above to inspect growth details!</span>
          </div>
        )}

        {/* Climbers vs Creepers comparative panel (Upgraded for high visual visibility & interactive 3D flips) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          
          {/* Creeper Card Flip Container */}
          <div className="flip-card-container" onClick={() => setCreeperFlipped(f => !f)}>
            <div className={`flip-card-inner ${creeperFlipped ? 'flipped' : ''}`}>
              
              {/* Front Side: Visual */}
              <div className="flip-card-front" style={{ border: '1px solid rgba(245, 158, 11, 0.25)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                <img src={creeperImg} alt="Creeper" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.75))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1rem', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1.3rem' }}>🍉</span>
                    <strong style={{ fontSize: '15px' }}>Creepers (Spread on Ground)</strong>
                  </div>
                  <span style={{ fontSize: '11px', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.05em' }}>👉 Tap to read details</span>
                </div>
              </div>

              {/* Back Side: Details */}
              <div className="flip-card-back" style={{ background: theme === 'dark' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.03)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(245, 158, 11, 0.1)', paddingBottom: '0.4rem', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.3rem' }}>🍉</span>
                    <strong style={{ fontSize: '15px', color: '#b45309' }}>Creepers (Spread on Ground)</strong>
                  </div>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tap to view image</span>
                </div>
                <div style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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
              <div className="flip-card-front" style={{ border: '1px solid rgba(59, 130, 246, 0.25)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                <img src={climberImg} alt="Climber" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.75))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1rem', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1.3rem' }}>🍇</span>
                    <strong style={{ fontSize: '15px' }}>Climbers (Climb Up Support)</strong>
                  </div>
                  <span style={{ fontSize: '11px', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.05em' }}>👉 Tap to read details</span>
                </div>
              </div>

              {/* Back Side: Details */}
              <div className="flip-card-back" style={{ background: theme === 'dark' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.03)', border: '1px solid rgba(59, 130, 246, 0.25)', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(59, 130, 246, 0.1)', paddingBottom: '0.4rem', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.3rem' }}>🍇</span>
                    <strong style={{ fontSize: '15px', color: '#1e3a8a' }}>Climbers (Climb Up Support)</strong>
                  </div>
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tap to view image</span>
                </div>
                <div style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', padding: '1.25rem', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.02)' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔗 Venation-Root Correlation Linker
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontWeight: '500', background: 'var(--accent-bg)', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--accent-border)' }}>
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
            <circle cx="46.3%" cy="24%" r="5" fill={connections.reticulate ? '#10b981' : 'var(--page-bg)'} stroke={connections.reticulate ? '#059669' : selectedLeaf === 'reticulate' ? 'var(--accent)' : 'var(--border)'} strokeWidth="2.5" />
            {selectedLeaf === 'reticulate' && !connections.reticulate && (
              <circle cx="46.3%" cy="24%" r="7" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="5;9;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Parallel port (left, bottom) */}
            <circle cx="46.3%" cy="74%" r="5" fill={connections.parallel ? '#10b981' : 'var(--page-bg)'} stroke={connections.parallel ? '#059669' : selectedLeaf === 'parallel' ? 'var(--accent)' : 'var(--border)'} strokeWidth="2.5" />
            {selectedLeaf === 'parallel' && !connections.parallel && (
              <circle cx="46.3%" cy="74%" r="7" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="5;9;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Taproot port (right, top) */}
            <circle cx="53.7%" cy="24%" r="5" fill={connections.reticulate ? '#10b981' : 'var(--page-bg)'} stroke={connections.reticulate ? '#059669' : selectedRoot === 'taproot' ? 'var(--accent)' : 'var(--border)'} strokeWidth="2.5" />
            {selectedRoot === 'taproot' && !connections.reticulate && (
              <circle cx="53.7%" cy="24%" r="7" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="5;9;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Fibrous port (right, bottom) */}
            <circle cx="53.7%" cy="74%" r="5" fill={connections.parallel ? '#10b981' : 'var(--page-bg)'} stroke={connections.parallel ? '#059669' : selectedRoot === 'fibrous' ? 'var(--accent)' : 'var(--border)'} strokeWidth="2.5" />
            {selectedRoot === 'fibrous' && !connections.parallel && (
              <circle cx="53.7%" cy="74%" r="7" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="5;9;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>
          {/* Leaves */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Venation</span>
            
            <button
              onClick={() => selectLeaf('reticulate')}
              className="glass-btn"
              style={{ 
                padding: 0, 
                borderRadius: '12px', 
                overflow: 'hidden',
                border: connections.reticulate ? '2.5px solid var(--success)' : selectedLeaf === 'reticulate' ? '2.5px solid var(--accent)' : '1px solid var(--border)', 
                background: 'var(--page-bg)', 
                cursor: 'pointer', 
                textAlign: 'left', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.2s',
                boxShadow: selectedLeaf === 'reticulate' ? '0 6px 16px rgba(99,102,241,0.2)' : 'none',
                width: '100%'
              }}
            >
              <div style={{ width: '100%', height: '140px', overflow: 'hidden', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 120 100" style={{ background: '#f0fdf4', display: 'block' }}>
                  {/* Grid overlay */}
                  <defs>
                    <pattern id="retic-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(22, 163, 74, 0.05)" strokeWidth="0.5"/>
                    </pattern>
                    <linearGradient id="leaf-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#86efac" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#retic-grid)" />
                  
                  {/* Specimen Badge */}
                  <rect x="5" y="5" width="48" height="12" rx="4" fill="rgba(21, 128, 61, 0.1)" stroke="rgba(21, 128, 61, 0.2)" strokeWidth="0.5" />
                  <text x="8" y="13" fontSize="5" fontWeight="bold" fill="#166534" fontFamily="monospace">REF: DICOT_LEAF</text>

                  {/* Leaf Shadow */}
                  <path d="M60 15 C35 42, 35 72, 60 88 C85 72, 85 42, 60 15 Z" fill="rgba(0,0,0,0.04)" transform="translate(2, 2)" />
                  
                  {/* Leaf Blade */}
                  <path d="M60 15 C35 42, 35 72, 60 88 C85 72, 85 42, 60 15 Z" fill="url(#leaf-grad)" stroke="#166534" strokeWidth="1.2" />

                  {/* Midrib */}
                  <path d="M60 15 Q60 50 60 88" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Reticulate network of side veins */}
                  <path d="M60 30 Q45 28 39 32" fill="none" stroke="#166534" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M60 45 Q42 42 37 49" fill="none" stroke="#166534" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M60 60 Q44 58 39 67" fill="none" stroke="#166534" strokeWidth="1.0" strokeLinecap="round" />
                  <path d="M60 72 Q50 71 46 79" fill="none" stroke="#166534" strokeWidth="0.8" strokeLinecap="round" />

                  <path d="M60 30 Q75 28 81 32" fill="none" stroke="#166534" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M60 45 Q78 42 83 49" fill="none" stroke="#166534" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M60 60 Q76 58 81 67" fill="none" stroke="#166534" strokeWidth="1.0" strokeLinecap="round" />
                  <path d="M60 72 Q70 71 74 79" fill="none" stroke="#166534" strokeWidth="0.8" strokeLinecap="round" />

                  {/* Mesh Reticulation */}
                  <path d="M39 32 Q35 40 37 49" fill="none" stroke="#15803d" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.7" />
                  <path d="M37 49 Q39 58 39 67" fill="none" stroke="#15803d" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.7" />
                  <path d="M48 30 Q45 38 43 45" fill="none" stroke="#15803d" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.7" />
                  <path d="M49 46 Q47 54 46 60" fill="none" stroke="#15803d" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.7" />

                  <path d="M81 32 Q85 40 83 49" fill="none" stroke="#15803d" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.7" />
                  <path d="M83 49 Q81 58 81 67" fill="none" stroke="#15803d" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.7" />
                  <path d="M72 30 Q75 38 77 45" fill="none" stroke="#15803d" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.7" />
                  <path d="M71 46 Q73 54 74 60" fill="none" stroke="#15803d" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.7" />
                </svg>
              </div>
              <div style={{ padding: '0.6rem 0.75rem', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--navy)' }}>Reticulate</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Net-like network of veins</span>
              </div>
            </button>
            
            <button
              onClick={() => selectLeaf('parallel')}
              className="glass-btn"
              style={{ 
                padding: 0, 
                borderRadius: '12px', 
                overflow: 'hidden',
                border: connections.parallel ? '2.5px solid var(--success)' : selectedLeaf === 'parallel' ? '2.5px solid var(--accent)' : '1px solid var(--border)', 
                background: 'var(--page-bg)', 
                cursor: 'pointer', 
                textAlign: 'left', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.2s',
                boxShadow: selectedLeaf === 'parallel' ? '0 6px 16px rgba(99,102,241,0.2)' : 'none',
                width: '100%'
              }}
            >
              <div style={{ width: '100%', height: '140px', overflow: 'hidden', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 120 100" style={{ background: '#f0fdf4', display: 'block' }}>
                  <rect width="100%" height="100%" fill="url(#retic-grid)" />
                  
                  {/* Specimen Badge */}
                  <rect x="5" y="5" width="48" height="12" rx="4" fill="rgba(21, 128, 61, 0.1)" stroke="rgba(21, 128, 61, 0.2)" strokeWidth="0.5" />
                  <text x="8" y="13" fontSize="5" fontWeight="bold" fill="#166534" fontFamily="monospace">REF: MONOCOT_LEAF</text>

                  {/* Leaf Shadow */}
                  <path d="M60 5 C45 35, 45 75, 60 92 C75 75, 75 35, 60 5 Z" fill="rgba(0,0,0,0.04)" transform="translate(2, 2)" />
                  
                  {/* Slender leaf blade */}
                  <path d="M60 5 C45 35, 45 75, 60 92 C75 75, 75 35, 60 5 Z" fill="url(#leaf-grad-parallel)" stroke="#166534" strokeWidth="1.2" />
                  <defs>
                    <linearGradient id="leaf-grad-parallel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#bbf7d0" />
                      <stop offset="100%" stopColor="#15803d" />
                    </linearGradient>
                  </defs>

                  {/* Parallel veins */}
                  <path d="M60 5 C50 35, 50 75, 60 92" fill="none" stroke="#14532d" strokeWidth="1.5" />
                  <path d="M60 5 C47 35, 48 75, 60 92" fill="none" stroke="#166534" strokeWidth="0.75" />
                  <path d="M60 5 C53 35, 53 75, 60 92" fill="none" stroke="#166534" strokeWidth="0.75" />
                  <path d="M60 5 C57 35, 57 75, 60 92" fill="none" stroke="#166534" strokeWidth="0.75" />

                  <path d="M60 5 C73 35, 72 75, 60 92" fill="none" stroke="#166534" strokeWidth="0.75" />
                  <path d="M60 5 C67 35, 67 75, 60 92" fill="none" stroke="#166534" strokeWidth="0.75" />
                  <path d="M60 5 C63 35, 63 75, 60 92" fill="none" stroke="#166534" strokeWidth="0.75" />
                </svg>
              </div>
              <div style={{ padding: '0.6rem 0.75rem', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--navy)' }}>Parallel</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Veins running side-by-side</span>
              </div>
            </button>
          </div>

          {/* Roots */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Root System</span>
            
            <button
              onClick={() => selectRoot('taproot')}
              className="glass-btn"
              style={{ 
                padding: 0, 
                borderRadius: '12px', 
                overflow: 'hidden',
                border: connections.reticulate ? '2.5px solid var(--success)' : selectedRoot === 'taproot' ? '2.5px solid var(--accent)' : '1px solid var(--border)', 
                background: 'var(--page-bg)', 
                cursor: 'pointer', 
                textAlign: 'left', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.2s',
                boxShadow: selectedRoot === 'taproot' ? '0 6px 16px rgba(99,102,241,0.2)' : 'none',
                width: '100%'
              }}
            >
              <div style={{ width: '100%', height: '140px', overflow: 'hidden', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 120 100" style={{ background: '#fdf8f6', display: 'block' }}>
                  <defs>
                    <pattern id="tap-soil" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(120, 53, 4, 0.04)" strokeWidth="0.5"/>
                    </pattern>
                    <linearGradient id="taproot-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="50%" stopColor="#ea580c" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#tap-soil)" />

                  {/* Specimen Badge */}
                  <rect x="5" y="5" width="48" height="12" rx="4" fill="rgba(120, 53, 4, 0.1)" stroke="rgba(120, 53, 4, 0.2)" strokeWidth="0.5" />
                  <text x="8" y="13" fontSize="5" fontWeight="bold" fill="#78350f" fontFamily="monospace">REF: TAP_ROOT</text>

                  {/* Ground surface */}
                  <line x1="10" y1="20" x2="110" y2="20" stroke="#78350f" strokeWidth="1" strokeDasharray="3,1" />
                  <path d="M57 10 L63 10 L62 20 L58 20 Z" fill="#15803d" />
                  
                  {/* Taproot */}
                  <path d="M57 20 C57 35, 59 65, 60 85 C61 65, 63 35, 63 20 Z" fill="url(#taproot-grad)" stroke="#78350f" strokeWidth="1" />

                  {/* Lateral roots */}
                  <path d="M58 28 Q46 32 38 34" fill="none" stroke="#b45309" strokeWidth="1" strokeLinecap="round" />
                  <path d="M38 34 Q34 38 30 37" fill="none" stroke="#b45309" strokeWidth="0.6" strokeLinecap="round" />
                  
                  <path d="M59 42 Q48 48 42 53" fill="none" stroke="#b45309" strokeWidth="1" strokeLinecap="round" />
                  <path d="M59 56 Q50 63 46 72" fill="none" stroke="#b45309" strokeWidth="0.8" strokeLinecap="round" />
                  <path d="M60 70 Q54 75 51 81" fill="none" stroke="#b45309" strokeWidth="0.6" strokeLinecap="round" />

                  <path d="M62 28 Q74 32 82 34" fill="none" stroke="#b45309" strokeWidth="1" strokeLinecap="round" />
                  <path d="M82 34 Q86 38 90 37" fill="none" stroke="#b45309" strokeWidth="0.6" strokeLinecap="round" />
                  
                  <path d="M61 42 Q72 48 78 53" fill="none" stroke="#b45309" strokeWidth="1" strokeLinecap="round" />
                  <path d="M61 56 Q70 63 74 72" fill="none" stroke="#b45309" strokeWidth="0.8" strokeLinecap="round" />
                  <path d="M60 70 Q66 75 69 81" fill="none" stroke="#b45309" strokeWidth="0.6" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ padding: '0.6rem 0.75rem', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--navy)' }}>Taproot</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>One deep central thick root</span>
              </div>
            </button>
            
            <button
              onClick={() => selectRoot('fibrous')}
              className="glass-btn"
              style={{ 
                padding: 0, 
                borderRadius: '12px', 
                overflow: 'hidden',
                border: connections.parallel ? '2.5px solid var(--success)' : selectedRoot === 'fibrous' ? '2.5px solid var(--accent)' : '1px solid var(--border)', 
                background: 'var(--page-bg)', 
                cursor: 'pointer', 
                textAlign: 'left', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.2s',
                boxShadow: selectedRoot === 'fibrous' ? '0 6px 16px rgba(99,102,241,0.2)' : 'none',
                width: '100%'
              }}
            >
              <div style={{ width: '100%', height: '140px', overflow: 'hidden', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 120 100" style={{ background: '#fdf8f6', display: 'block' }}>
                  <rect width="100%" height="100%" fill="url(#tap-soil)" />

                  {/* Specimen Badge */}
                  <rect x="5" y="5" width="48" height="12" rx="4" fill="rgba(120, 53, 4, 0.1)" stroke="rgba(120, 53, 4, 0.2)" strokeWidth="0.5" />
                  <text x="8" y="13" fontSize="5" fontWeight="bold" fill="#78350f" fontFamily="monospace">REF: FIBROUS_ROOT</text>

                  {/* Ground surface */}
                  <line x1="10" y1="20" x2="110" y2="20" stroke="#78350f" strokeWidth="1" strokeDasharray="3,1" />
                  <path d="M55 10 L65 10 L65 20 L55 20 Z" fill="#166534" />
                  
                  {/* Fibrous roots */}
                  <g stroke="#b45309" fill="none" strokeLinecap="round">
                    <path d="M60 20 Q58 40 56 60 T55 85" strokeWidth="1.2" />
                    <path d="M58 20 Q61 42 63 65 T64 88" strokeWidth="1.1" />
                    <path d="M62 20 Q59 38 60 58 T59 82" strokeWidth="1.2" />
                    
                    <path d="M57 20 Q48 35 40 50 T32 75" strokeWidth="1.0" />
                    <path d="M56 20 Q44 32 34 45 T24 68" strokeWidth="0.8" />
                    <path d="M55 20 Q38 30 26 40 T16 58" strokeWidth="0.8" />
                    <path d="M58 20 Q52 45 46 65 T41 84" strokeWidth="0.9" />

                    <path d="M63 20 Q72 35 80 50 T88 75" strokeWidth="1.0" />
                    <path d="M64 20 Q76 32 86 45 T96 68" strokeWidth="0.8" />
                    <path d="M65 20 Q82 30 94 40 T104 58" strokeWidth="0.8" />
                    <path d="M62 20 Q68 45 74 65 T79 84" strokeWidth="0.9" />
                  </g>
                </svg>
              </div>
              <div style={{ padding: '0.6rem 0.75rem', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--navy)' }}>Fibrous</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Cluster of thin threadlike roots</span>
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

  const DicotSeedSVG = ({ stage }) => {
    if (stage === 'intact') {
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ maxWidth: '200px', maxHeight: '200px' }}>
          <defs>
            <radialGradient id="gramGrad" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#d4a373" />
              <stop offset="60%" stopColor="#a98467" />
              <stop offset="100%" stopColor="#6f523b" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="85" rx="35" ry="8" fill="rgba(0,0,0,0.15)" />
          <path d="M 50 15 Q 30 50 32 70 Q 35 85 50 85 Q 65 85 68 70 Q 70 50 50 15 Z" fill="url(#gramGrad)" stroke="#5c4033" strokeWidth="1.2" />
          <path d="M 48 18 Q 50 25 52 18" fill="none" stroke="#e6ccb2" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="50" cy="32" r="4.5" fill="#3d2612" />
          <circle cx="50" cy="31" r="2" fill="#f5ebe0" opacity="0.8" />
        </svg>
      );
    }
    if (stage === 'peeled') {
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ maxWidth: '200px', maxHeight: '200px' }}>
          <defs>
            <radialGradient id="gramPeeled" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fefae0" />
              <stop offset="70%" stopColor="#faedcd" />
              <stop offset="100%" stopColor="#e9d8a6" />
            </radialGradient>
          </defs>
          <path d="M 12 70 Q 5 50 20 40 T 35 60" fill="none" stroke="#a98467" strokeWidth="2.8" strokeLinecap="round" opacity="0.85" />
          <path d="M 88 70 Q 95 50 80 40 T 65 60" fill="none" stroke="#a98467" strokeWidth="2.8" strokeLinecap="round" opacity="0.85" />
          <ellipse cx="50" cy="85" rx="32" ry="8" fill="rgba(0,0,0,0.12)" />
          <path d="M 50 20 Q 33 50 35 70 Q 38 82 50 82 Q 62 82 65 70 Q 67 50 50 20 Z" fill="url(#gramPeeled)" stroke="#d4a373" strokeWidth="1.2" />
          <path d="M 50 20 Q 51 50 50 82" fill="none" stroke="#d4a373" strokeWidth="1.8" strokeDasharray="3 2" />
        </svg>
      );
    }
    return (
      <svg width="100%" height="100%" viewBox="0 0 160 100" style={{ maxWidth: '340px', maxHeight: '220px' }}>
        <defs>
          <radialGradient id="cotyledonGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fefae0" />
            <stop offset="90%" stopColor="#faedcd" />
            <stop offset="100%" stopColor="#e9c46a" />
          </radialGradient>
        </defs>
        <ellipse cx="45" cy="88" rx="35" ry="6" fill="rgba(0,0,0,0.1)" />
        <ellipse cx="115" cy="88" rx="35" ry="6" fill="rgba(0,0,0,0.1)" />
        <g transform="translate(10, 5)">
          <path d="M 35 15 Q 10 40 12 65 Q 15 80 35 80 Q 55 80 58 65 Q 60 40 35 15 Z" fill="url(#cotyledonGrad)" stroke="#d4a373" strokeWidth="1.5" />
          <text x="35" y="50" textAnchor="middle" fontSize="9.5" fill="#a98467" fontWeight="bold" opacity="0.9">Cotyledon 1</text>
        </g>
        <g transform="translate(80, 5)">
          <path d="M 35 15 Q 10 40 12 65 Q 15 80 35 80 Q 55 80 58 65 Q 60 40 35 15 Z" fill="url(#cotyledonGrad)" stroke="#d4a373" strokeWidth="1.5" />
          <text x="35" y="70" textAnchor="middle" fontSize="9.5" fill="#a98467" fontWeight="bold" opacity="0.9">Cotyledon 2</text>
          <g transform="translate(10, 38)">
            <path d="M 12 -5 Q 22 -15 15 -25 Q 10 -15 12 -5" fill="#e9f5db" stroke="#2a9d8f" strokeWidth="0.8" />
            <path d="M 12 -5 Q 2 -15 9 -25 Q 14 -15 12 -5" fill="#e9f5db" stroke="#2a9d8f" strokeWidth="0.8" />
            <path d="M 12 -5 Q 15 5 18 15 Q 12 10 12 -5" fill="#ffffff" stroke="#e76f51" strokeWidth="0.8" />
            <circle cx="12" cy="-5" r="2.5" fill="#f4a261" />
            <text x="32" y="-18" fontSize="8.5" fill="#2a9d8f" fontWeight="bold">← Plumule (Shoot)</text>
            <text x="32" y="14" fontSize="8.5" fill="#e76f51" fontWeight="bold">← Radicle (Root)</text>
          </g>
        </g>
      </svg>
    );
  };

  const MonocotSeedSVG = ({ stage }) => {
    if (stage === 'intact') {
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ maxWidth: '200px', maxHeight: '200px' }}>
          <defs>
            <linearGradient id="cornGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffea00" />
              <stop offset="70%" stopColor="#ffc300" />
              <stop offset="100%" stopColor="#ffaa00" />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="85" rx="30" ry="7" fill="rgba(0,0,0,0.15)" />
          <path d="M 50 82 L 28 45 Q 26 22 50 20 Q 74 22 72 45 Z" fill="url(#cornGrad)" stroke="#e6b800" strokeWidth="1.2" />
          <path d="M 50 82 L 35 56 Q 50 48 65 56 Z" fill="#ffffff" opacity="0.55" stroke="#fefae0" strokeWidth="0.5" />
        </svg>
      );
    }
    if (stage === 'peeled') {
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ maxWidth: '200px', maxHeight: '200px' }}>
          <defs>
            <linearGradient id="cornPeeled" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff3b0" />
              <stop offset="80%" stopColor="#fec89a" />
              <stop offset="100%" stopColor="#fca311" />
            </linearGradient>
          </defs>
          <path d="M 28 45 Q 16 30 20 18 Q 30 24 34 38" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="50" cy="85" rx="28" ry="7" fill="rgba(0,0,0,0.12)" />
          <path d="M 50 82 L 28 45 Q 26 22 50 20 Q 74 22 72 45 Z" fill="url(#cornPeeled)" stroke="#fca311" strokeWidth="1.2" />
          <path d="M 50 82 L 35 56 Q 50 48 65 56 Z" fill="#ffffff" opacity="0.65" />
        </svg>
      );
    }
    return (
      <svg width="100%" height="100%" viewBox="0 0 130 110" style={{ maxWidth: '260px', maxHeight: '220px' }}>
        <defs>
          <linearGradient id="endospermGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffe494" />
            <stop offset="100%" stopColor="#ffd166" />
          </linearGradient>
          <radialGradient id="scutellumGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e9ecef" />
          </radialGradient>
        </defs>
        <ellipse cx="65" cy="98" rx="35" ry="6" fill="rgba(0,0,0,0.12)" />
        <path d="M 65 95 L 38 52 Q 35 24 65 22 Q 95 24 92 52 Z" fill="none" stroke="#fca311" strokeWidth="2.5" />
        <path d="M 65 23 Q 94 25 91 50 Q 75 42 65 48 Q 55 42 39 50 Q 36 25 65 23 Z" fill="url(#endospermGrad)" stroke="#ffd166" strokeWidth="0.8" />
        <text x="65" y="36" textAnchor="middle" fontSize="9.5" fill="#ca6702" fontWeight="bold">Endosperm</text>
        <path d="M 39 50 L 65 94 L 91 50 Q 75 45 65 52 Q 55 45 39 50 Z" fill="url(#scutellumGrad)" stroke="#ced4da" strokeWidth="0.8" />
        <g transform="translate(65, 70)">
          <path d="M -4 -10 Q 0 -22 4 -10 Z" fill="#e9f5db" stroke="#2a9d8f" strokeWidth="0.8" />
          <path d="M -3 3 Q 0 14 3 3 Z" fill="#ffffff" stroke="#e76f51" strokeWidth="0.8" />
          <circle cx="0" cy="-3" r="2" fill="#adb5bd" />
          <text x="20" y="-12" fontSize="8" fill="#2a9d8f" fontWeight="bold">← Plumule</text>
          <text x="20" y="8" fontSize="8" fill="#e76f51" fontWeight="bold">← Radicle</text>
          <text x="-48" y="2" fontSize="8" fill="#495057" fontWeight="bold">Cotyledon →</text>
        </g>
      </svg>
    );
  };

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

        {/* Large Image box on Top */}
        <div style={{ display: 'flex', justifyContent: 'center', background: '#fff', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border)', height: '240px', alignItems: 'center', overflow: 'hidden', width: '100%' }}>
          {activeSeed === 'pea' ? (
            <DicotSeedSVG stage={!coatRemoved ? 'intact' : !seedSplit ? 'peeled' : 'split'} />
          ) : (
            <MonocotSeedSVG stage={!coatRemoved ? 'intact' : !seedSplit ? 'peeled' : 'split'} />
          )}
        </div>

        {/* Action Options at the Bottom (Side by Side) */}
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <button
            disabled={coatRemoved}
            onClick={() => { setCoatRemoved(true); setStatus('Seed coat peeled! Now click "Split Seed" to look inside.'); }}
            className="glass-btn"
            style={{ padding: '0.75rem', fontSize: '0.85rem', fontWeight: 'bold', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', background: coatRemoved ? 'rgba(0,0,0,0.04)' : 'var(--page-bg)', border: '1px solid var(--border)', cursor: coatRemoved ? 'default' : 'pointer' }}
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
            style={{ padding: '0.75rem', fontSize: '0.85rem', fontWeight: 'bold', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', background: seedSplit ? 'rgba(0,0,0,0.04)' : 'var(--page-bg)', border: '1px solid var(--border)', cursor: seedSplit ? 'default' : 'pointer' }}
          >
            ✂️ Split Seed
          </button>
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
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
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.2rem' }}>
                Slide {currentSlideIndex + 1} of {totalSlides}
              </span>
              {currentSlideIndex > 0 && (
                <button
                  onClick={() => { handleStopSpeech(); setActiveSlide(prev => Math.max(0, prev - 1)); }}
                  className="outline"
                  style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', borderRadius: '20px' }}
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
                  style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', borderRadius: '20px' }}
                >
                  Activity ➔
                </button>
              ) : (
                <button
                  disabled={slide.isQuiz && !quizChecked}
                  onClick={() => { handleStopSpeech(); setActiveSlide(prev => prev + 1); }}
                  className="primary"
                  style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', borderRadius: '20px' }}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Sandbox or Fallbacks */}
        <div className="frame-page-right" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, justifyContent: 'center', background: 'transparent', border: 'none', padding: '0' }}>
          {slide.image ? (
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
          ) : lessonId === 'grouping_basics_concept' ? (
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
        bgImage={coverBgImage}
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
      // Never disable next button so we can guide users with custom alerts when clicked
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
      
      // 1. Browse lesson slides first
      if (activeSlide < totalSlides - 1) {
        setActiveSlide(prev => prev + 1);
        setQuizAnswers({});
        setQuizChecked(false);
        return;
      }
      
      // 2. Focus activity if it isn't focused yet and we just completed slides
      if (activeLevel.activities.length > 0 && !activityFocused && activeActivityIdx === 0 && activityStatus[activeActivity.id] !== 'done') {
        setActivityFocused(true);
        setActiveActivityIdx(0);
        return;
      }
      
      // 3. Advance activities if there are multiple for this level
      if (activeActivityIdx < activeLevel.activities.length - 1) {
        setActiveActivityIdx(prev => prev + 1);
        setActivityFocused(true);
        return;
      }
      
      // 4. If current activity is not marked as Done, prompt user to do so
      if (activeActivity && activityStatus[activeActivity.id] !== 'done') {
        alert("Please complete the current activity and mark it as Done before proceeding!");
        return;
      }
      
      // 5. If we are still focusing the activity (and it's marked done), return to Show All to reveal the quiz
      if (activityFocused) {
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
      const hasQuiz = LEVEL_QUIZZES[activeLevel.lessonId];
      if (hasQuiz && !quizChecked) {
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
    return (
      <div style={isFullscreen ? {
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        backgroundImage: learningLabBg ? `url(${learningLabBg})` : 'none',
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
        backgroundImage: learningLabBg ? `url(${learningLabBg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        padding: '0',
        borderRadius: '0',
        height: learningLabBg ? '100vh' : 'auto',
        overflowY: learningLabBg ? 'auto' : 'visible',
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
          ` : ''}
        `}</style>

        {/* Master stats & control header (Sticky when not in fullscreen) */}
        {!isFullscreen && (
          <div style={{
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
              {activeLevel.activities.length > 0 && (
                <button
                  onClick={() => setActivityFocused(prev => prev === true ? null : true)}
                  className="glass-btn"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {activityFocused === true ? 'Show All' : 'Focus Activity'}
                </button>
              )}
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
                onClick={() => setIsFullscreen(false)}
                className="glass-btn primary"
              >
                Exit Fullscreen ↙
              </button>
            </div>
          </div>
        </div>
        )}


        {/* Side-by-side workspace split */}
        <div style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          width: '100%', 
          alignItems: 'stretch', 
          boxSizing: 'border-box', 
          padding: isFullscreen ? '1.5rem 1.25rem 1.5rem 1.25rem' : (learningLabBg ? '0 clamp(0.5rem, 2vw, 1.25rem) 1.5rem clamp(0.5rem, 2vw, 1.25rem)' : '0')
        }}>
          
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
              bgImage={levelMapBg}
              stickyTop={learningLabBg ? "5.5rem" : "6.5rem"}
            />
          )}

          {/* Combined Lesson & Activity Panel on right */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2rem', boxSizing: 'border-box' }}>
            
            {/* 1. TOP PANE: Interactive Lesson Window */}
            <div
              id="pane-lesson-window"
              className={activeLevel.lessonId === 'biodiversity_concept' ? '' : 'glass-panel'}
              style={{
                display: (!isFullscreen || activityFocused !== true) ? 'flex' : 'none',
                flexDirection: 'column',
                gap: activeLevel.lessonId === 'biodiversity_concept' ? '0' : '0.75rem',
                position: 'relative',
                ...(activeLevel.lessonId === 'biodiversity_concept' ? {
                  background: 'transparent', border: 'none', boxShadow: 'none', padding: 0, borderRadius: '14px', overflow: 'hidden'
                } : {})
              }}
            >
              {/* Lesson pane header — overlaid on image for biodiversity, normal otherwise */}
              {activeLevel.lessonId !== 'biodiversity_concept' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Lesson Pane
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Level {activeLevelIdx + 1} of {totalLevels}
                  </span>
                </div>
              )}

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
            {activeLevel.activities && activeLevel.activities.length > 0 && activeLevel.lessonId !== 'vocabulary_glossary' && activeLevel.lessonId !== 'chapter_challenge_overview' && (
              <div id="pane-activity-window" className="glass-panel" style={{ 
                display: (!isFullscreen || activityFocused !== false) ? 'flex' : 'none', 
                flexDirection: 'column', 
                gap: '0.75rem',
                padding: '0.75rem 1rem 1rem 1rem !important',
                border: '1px solid var(--border) !important',
                background: 'var(--card-bg) !important',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08) !important',
                borderRadius: '16px !important'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{activeActivity.title}</span>
                    {activeActivity.pg && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-muted)', background: 'var(--border)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                        {activeActivity.pg}
                      </span>
                    )}
                  </h4>
                  {activeLevel.activities.length > 1 && (
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
            <div style={{ display: (!isFullscreen || activityFocused !== true) ? 'flex' : 'none', flexDirection: 'column', gap: '0.75rem' }}>
              {(activeLevel.lessonId === 'vocabulary_glossary' || activeLevel.lessonId === 'chapter_challenge_overview')
                  ? <SummaryPane lessonId={activeLevel.lessonId} />
                  : renderQuizAndDykPane(activeLevel.lessonId)
              }
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
