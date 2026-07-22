import Stage1_Intro from './components/Stage1_Intro';
import Stage2_Identify from './components/Stage2_Identify';
import Stage3_Classification from './components/Stage3_Classification';
import Stage5_Suitability from './components/Stage5_Suitability';
import Stage_SportsBall from './components/Stage_SportsBall';
import Stage4_LustreHardness from './components/Stage4_LustreHardness';
import Stage4a_Appearance_Observe from './components/Stage4a_Appearance_Observe';
import Stage4b_Appearance_Group from './components/Stage4b_Appearance_Group';
import Stage4c_Hardness_Observe from './components/Stage4c_Hardness_Observe';
import Stage4d_MaterialIdentification from './components/Stage4d_MaterialIdentification';
import Stage6a_Surveillance from './components/Stage6a_Surveillance';
import Stage6b_Classify from './components/Stage6b_Classify';
import Stage7a_SolubilitySim from './components/Stage7a_SolubilitySim';
import Stage7b_SolubilityClassify from './components/Stage7b_SolubilityClassify';
import Stage7_SolubilityMatter from './components/Stage7_SolubilityMatter';
import Stage8a_Mass from './components/Stage8a_Mass';
import Stage8b_Volume from './components/Stage8b_Volume';
import Stage8c_VolumeConcept from './components/Stage8c_VolumeConcept';
import Stage9_Quiz from './components/Stage9_Quiz';
import Handbook_Appearance from './components/Educational/Handbook_Appearance';
import Handbook_Hardness from './components/Educational/Handbook_Hardness';
import Handbook_GroupAppearance from './components/Educational/Handbook_GroupAppearance';
import Handbook_Transparency from './components/Educational/Handbook_Transparency';
import Handbook_Solubility from './components/Educational/Handbook_Solubility';
import Handbook_Mass from './components/Educational/Handbook_Mass';
import Handbook_Volume from './components/Educational/Handbook_Volume';
import Handbook_Matter from './components/Educational/Handbook_Matter';
import Stage8_AyurvedaSummary from './components/Stage8_AyurvedaSummary';
import Stage9a_WhatIsMatter from './components/Stage9a_WhatIsMatter';
import Stage9c_ConceptMap from './components/Stage9c_ConceptMap';

export const chapterFlow = [
  // 0: Intro Mission
  {
    type: 'mission',
    title: 'The Classroom Mystery (Barrier 1)',
    dialogue: 'Good morning, Detective. Headquarters has received an unusual science case. Strange objects have appeared in the classroom. Study today\'s handbook carefully, then begin your investigation.',
    description: 'We need to classify and identify the properties of everyday objects found around the classroom. Your first task is to understand what these materials are made of.',
    objective: [
      'Phase 1: Find Objects',
      'Phase 2: Scan Evidence'
    ],
    difficulty: 1,
    estimatedTime: '5 minutes',
    rewardXP: 100
  },

  // 2: Activity
  { type: 'activity', id: 'stage1', title: 'Stage 6.1: Objects Around Us', subtitle: 'Phase 1: Find Objects', component: Stage1_Intro },
  // 3: Activity
  { type: 'activity', id: 'stage2', title: 'Stage 6.1: Objects Around Us', subtitle: 'Phase 2: Scan Evidence', component: Stage2_Identify },
  // 4: Checkpoint
  {
    type: 'checkpoint',
    id: 'checkpoint_1',
    title: 'Detective Checkpoint (Barrier 1)',
    questions: [
      {
        question: 'What do we call the "stuff" that an object is made of?',
        options: ['Matter', 'Material', 'Thing'],
        correct: 1
      },
      {
        question: 'Can a single object like a plate be made from different materials (like glass, steel, or plastic)?',
        options: ['Yes', 'No'],
        correct: 0,
        hint: 'Think about the different types of plates you have seen in your kitchen.',
        explanation: 'Yes! A plate is just a shape/object, but it can be manufactured using glass, plastic, steel, or even paper.'
      }
    ],
    dialogue: 'Excellent work, Detective. You have successfully completed today\'s investigation. Let\'s record our findings in your permanent Investigation Handbook.',
    discoveries: [
      'Objects around us are made of one or more materials.',
      'A material is the substance used to make an object.',
      'The same object can be made of different materials (e.g. a glass tumbler vs plastic tumbler).'
    ]
  },
  // 6: Mission 2
  {
    type: 'mission',
    title: 'Grouping Materials (Barrier 2)',
    dialogue: 'Now that we know the materials, Headquarters needs to know how they are organized. Group these materials by their purpose and design a product.',
    description: 'Objects are made from specific materials based on what they are used for. In this phase, you will group items based on their properties and see how materials match their purpose.',
    objective: [
      'Phase 1: Organize by Purpose',
      'Phase 2: Scientific Grouping',
      'Phase 3: Suitability',
      'Phase 4: Product Design'
    ],
    difficulty: 2,
    estimatedTime: '5 minutes',
    rewardXP: 150
  },
  // 5: Activity
  { type: 'activity', id: 'stage3_use', title: 'Stage 6.2: Grouping Materials', subtitle: 'Phase 1: Organize by Purpose', component: Stage3_Classification, props: { defaultPhase: 'use' } },
  { type: 'activity', id: 'stage3_material', title: 'Stage 6.2: Grouping Materials', subtitle: 'Phase 2: Scientific Grouping', component: Stage3_Classification, props: { defaultPhase: 'material' } },
  { type: 'activity', id: 'stage5', title: 'Stage 6.2: Grouping Materials', subtitle: 'Phase 3: Suitability', component: Stage5_Suitability },
  { type: 'activity', id: 'sportsball', title: 'Stage 6.2: Grouping Materials', subtitle: 'Phase 4: Product Design', component: Stage_SportsBall },
  // 11: Checkpoint 2
  {
    type: 'checkpoint',
    id: 'checkpoint_2',
    title: 'Detective Checkpoint (Barrier 2)',
    questions: [
      {
        question: 'Why do we group objects together (Classification)?',
        options: ['Because they look identical', 'To study their common properties', 'To make them look pretty'],
        correct: 1,
        hint: 'Consider how sorting books by subject makes them easier to find.',
        explanation: 'We classify objects to study their common properties systematically. It makes studying their patterns much easier and organized.'
      },
      {
        question: 'Why is a cooking pot made of metal instead of paper?',
        options: ['Because metal is cheaper', 'Because metal allows heat to pass through for cooking', 'Because paper is too heavy'],
        correct: 1,
        hint: 'What happens to paper when it gets near fire?',
        explanation: 'Materials are chosen based on their properties. Metal is heat resistant and conducts heat well for cooking, while paper would catch fire.'
      }
    ],
    dialogue: 'Brilliant deduction, Detective. You successfully grouped materials and discovered how their properties match their purpose. Let\'s log this in your handbook.',
    discoveries: [
      'Classification means arranging objects into groups based on common properties.',
      'Materials are chosen for objects based on their specific properties (e.g. glass for windows).',
      'The same object can be grouped differently based on the property being observed.'
    ]
  },
  // 9: Mission 3 (Appearance)
  {
    type: 'mission',
    title: 'Appearance (Stage 6.3.1)',
    dialogue: 'Detective, Barrier 3 is massive! It contains 6 distinct properties to investigate. We will start with the first one: Appearance. To keep our evidence organized, Headquarters has issued a separate handbook for each stage.',
    description: 'Scientists use specific tests to determine the properties of different materials. In this stage, you will observe how materials look, group them by their visual properties, and specifically test if they reflect light (lustre).',
    objective: [
      'Phase 1: Observation Notebook',
      'Phase 2: Group by Appearance',
      'Phase 3: Lustre Testing'
    ],
    difficulty: 3,
    estimatedTime: '8 minutes',
    rewardXP: 100
  },
  // 10: Activities
  // 10: Activities
  { type: 'activity', id: 'stage4_1', title: 'Stage 6.3.1: Appearance', subtitle: 'Phase 1: Observation Notebook', component: Stage4a_Appearance_Observe, handbook: Handbook_Appearance, layout: '3fr 7fr' },
  { type: 'activity', id: 'stage4_2', title: 'Stage 6.3.1: Appearance', subtitle: 'Phase 2: Group by Appearance', component: Stage4b_Appearance_Group, handbook: Handbook_Appearance, layout: '3fr 7fr' },
  { type: 'activity', id: 'stage4_3', title: 'Stage 6.3.1: Appearance', subtitle: 'Phase 3: Lustre Testing', component: Stage4_LustreHardness, props: { mode: 'lustre_only' }, handbook: Handbook_Appearance },
  
  // Checkpoint for 6.3.1
  {
    type: 'checkpoint',
    id: 'checkpoint_3_1',
    title: 'Detective Checkpoint (Stage 6.3.1)',
    questions: [
      {
        question: 'What do we call materials that have a shiny surface, like iron or gold?',
        options: ['Lustrous', 'Dull', 'Transparent'],
        correct: 0,
        hint: 'It sounds like "luster".',
        explanation: 'Materials with a shiny, reflective surface possess a property called "lustre" (or being lustrous).'
      },
      {
        question: 'Are all lustrous materials metals?',
        options: ['Yes, only metals shine.', 'No, some non-metals like plastic or wax can also be shiny.'],
        correct: 1,
        hint: 'Think about a polished diamond or shiny plastic.',
        explanation: 'While metals are naturally lustrous, non-metals can also have a shiny surface or be polished to become lustrous.'
      }
    ],
    dialogue: 'Fantastic work Detective! You proved that observing and testing for lustre helps us identify materials correctly.',
    discoveries: [
      'Materials with a shiny surface are called Lustrous.',
      'Metals usually have lustre (e.g. Iron, Copper).',
      'Not all lustrous materials are metals; some are coated or polished.'
    ]
  },
  
  // Mission Briefing for 6.3.2 Hardness
  {
    type: 'mission',
    title: 'Hardness (Stage 6.3.2)',
    dialogue: 'Brilliant work on appearance! Now, we must investigate how easy it is to scratch or compress the materials. This is the property of Hardness.',
    description: 'Materials can be soft (easily compressed) or hard (difficult to compress). Your next mission is to physically test the hardness of various evidence items and identify materials based on these physical traits.',
    objective: [
      'Phase 1: Observe Hardness',
      'Phase 2: Material Identification'
    ],
    difficulty: 2,
    estimatedTime: '5 minutes',
    rewardXP: 100
  },
  
  { type: 'activity', id: 'stage4_4', title: 'Stage 6.3.2: Hardness', subtitle: 'Phase 1: Observe Hardness', component: Stage4c_Hardness_Observe, handbook: Handbook_Hardness, layout: '3fr 7fr' },
  { type: 'activity', id: 'stage4_5', title: 'Stage 6.3.2: Hardness', subtitle: 'Phase 2: Material Identification', component: Stage4d_MaterialIdentification, handbook: Handbook_Hardness, layout: '3fr 7fr' },
  
  // Checkpoint for 6.3.2
  {
    type: 'checkpoint',
    id: 'checkpoint_3_2',
    title: 'Detective Checkpoint (Stage 6.3.2)',
    questions: [
      {
        question: 'What do we call materials that are difficult to compress or scratch?',
        options: ['Soft', 'Hard', 'Lustrous'],
        correct: 1,
        hint: 'The opposite of soft.',
        explanation: 'Hardness is a property of a material that measures how strongly it resists scratching or compression.'
      },
      {
        question: 'Which of the following is an example of a soft material?',
        options: ['Iron', 'Stone', 'Sponge'],
        correct: 2,
        hint: 'Which of these would compress easily if you squeezed it?',
        explanation: 'Sponge is a soft material because it compresses very easily when pressed, unlike iron or wood.'
      }
    ],
    dialogue: 'Excellent! You verified that hardness is determined by how easily a material can be compressed or scratched. This is vital evidence.',
    discoveries: [
      'Materials that can be compressed or scratched easily are soft.',
      'Materials that are difficult to compress or scratch are hard.',
      'Hardness is a physical property used to classify materials.'
    ]
  },
  
  // Mission Briefing for 6.3.3 Transparency
  {
    type: 'mission',
    title: 'Transparency (Stage 6.3.3)',
    dialogue: 'During a stakeout, a detective must know which materials block sight and which allow it. Let\'s investigate the property of transparency.',
    description: 'Materials can be transparent, translucent, or opaque based on how much light passes through them. Your next mission is to analyze materials using our surveillance simulator.',
    objective: [
      'Phase 1: Surveillance Simulator',
      'Phase 2: Classify Materials'
    ],
    difficulty: 2,
    estimatedTime: '5 minutes',
    rewardXP: 100
  },
  
  { type: 'activity', id: 'stage6_a', title: 'Stage 6.3.3: Transparency', subtitle: 'Phase 1: Surveillance Simulator', component: Stage6a_Surveillance, handbook: Handbook_Transparency, layout: '3fr 7fr' },
  { type: 'activity', id: 'stage6_b', title: 'Stage 6.3.3: Transparency', subtitle: 'Phase 2: Activity 6.6', component: Stage6b_Classify, handbook: Handbook_Transparency, layout: '3fr 7fr' },
  
  // Checkpoint for 6.3.3
  {
    type: 'checkpoint',
    id: 'checkpoint_3_3',
    title: 'Detective Checkpoint (Stage 6.3.3)',
    questions: [
      {
        question: 'Which material allows you to see clearly through it?',
        options: ['Transparent', 'Translucent', 'Opaque'],
        correct: 0,
        hint: 'Think of clear window glass.',
        explanation: 'Transparent materials allow light to pass through them completely, letting you see objects on the other side clearly.'
      },
      {
        question: 'If you can see through an object, but not clearly, what property does it have?',
        options: ['Transparent', 'Translucent', 'Opaque'],
        correct: 1,
        hint: 'It starts with "T" but is not transparent.',
        explanation: 'Translucent materials allow only some light to pass through, creating a blurred or frosted view.'
      }
    ],
    dialogue: 'Great detective work! You have successfully mastered how visibility works through different materials.',
    discoveries: [
      'Materials that allow light to pass through clearly are Transparent.',
      'Materials that allow some light, but not clear vision, are Translucent.',
      'Materials that block light completely are Opaque.'
    ]
  },

  // Mission Briefing for 6.3.4 Solubility
  {
    type: 'mission',
    title: 'Solubility (Stage 6.3.4)',
    dialogue: 'Does everything disappear in water? Some evidence might dissolve, leaving no trace! Let\'s investigate what is soluble and what is not.',
    description: 'Materials can be soluble (dissolves in water) or insoluble (does not dissolve). Your next mission is to test materials in our water simulator and classify them.',
    objective: [
      'Phase 1: Solubility Simulator',
      'Phase 2: Classification'
    ],
    difficulty: 2,
    estimatedTime: '5 minutes',
    rewardXP: 100
  },
  
  { type: 'activity', id: 'stage7_a', title: 'Stage 6.3.4: Solubility', subtitle: 'Phase 1: Solubility Simulator', component: Stage7a_SolubilitySim, handbook: Handbook_Solubility, layout: '3fr 7fr' },
  { type: 'activity', id: 'stage7_b', title: 'Stage 6.3.4: Solubility', subtitle: 'Phase 2: Classification', component: Stage7b_SolubilityClassify, handbook: Handbook_Solubility, layout: '3fr 7fr' },
  
  // Checkpoint for 6.3.4
  {
    type: 'checkpoint',
    id: 'checkpoint_3_4',
    title: 'Detective Checkpoint (Stage 6.3.4)',
    questions: [
      {
        question: 'What do we call a material that completely disappears when mixed with water (like salt)?',
        options: ['Soluble', 'Insoluble', 'Opaque'],
        correct: 0,
        hint: 'It dissolves and becomes a solution.',
        explanation: 'Materials that dissolve completely in water are called Soluble. Salt and sugar are common soluble materials.'
      },
      {
        question: 'Which of the following materials is Insoluble in water?',
        options: ['Sugar', 'Sand', 'Lemon Juice'],
        correct: 1,
        hint: 'Which of these would settle at the bottom if stirred in a glass of water?',
        explanation: 'Sand does not dissolve in water; it will eventually settle at the bottom, making it Insoluble.'
      }
    ],
    dialogue: 'Fantastic work! You have successfully identified which materials dissolve in water and which do not.',
    discoveries: [
      'Materials that completely disappear in water are called Soluble.',
      'Materials that do not mix with water are called Insoluble.',
      'Water plays an important role in our body because it can dissolve a large number of materials.'
    ]
  },

  // Mission for 6.3.5 Mass
  {
    type: 'mission',
    title: 'Mass (Stage 6.3.5)',
    dialogue: 'All these materials have something fundamental in common. Let\'s investigate how heavy or light they are.',
    description: 'Mass tells us the amount of matter inside an object. You will compare different items to see which has more mass.',
    objective: [
      'Phase 1: How heavy or light?'
    ],
    difficulty: 2,
    estimatedTime: '3 minutes',
    rewardXP: 100
  },
  // Activities for Mass
  { type: 'activity', id: 'stage8_a', title: 'Stage 6.3.5: Mass', subtitle: 'How heavy or light?', component: Stage8a_Mass, handbook: Handbook_Mass, layout: '3fr 7fr' },
  
  // Checkpoint for Mass
  {
    type: 'checkpoint',
    id: 'checkpoint_3_5',
    title: 'Detective Checkpoint (Stage 6.3.5)',
    questions: [
      {
        question: 'What property tells us how heavy or light an object is?',
        options: ['Mass', 'Volume', 'Transparency'],
        correct: 0,
        hint: 'This is often confused with weight, but refers to the amount of matter.',
        explanation: 'Mass is the measure of the amount of matter in an object, which makes it feel heavy or light.'
      },
      {
        question: 'If an object is heavier than another, it has:',
        options: ['Less mass', 'More mass', 'The same mass'],
        correct: 1,
        hint: 'Heavier means there is more "stuff" inside it.',
        explanation: 'A heavier object contains more matter, meaning it has more mass.'
      }
    ],
    dialogue: 'Incredible work, Detective. You have proven that we can measure how heavy objects are.',
    discoveries: [
      'The property that makes objects heavy or light is called Mass.',
      'An object which is heavier has more mass.',
      'Weight is often used in common language to describe mass.'
    ]
  },

  // Mission for 6.3.6 Volume
  {
    type: 'mission',
    title: 'Space and Volume (Stage 6.3.6)',
    dialogue: 'There is one final puzzle for Barrier 3. Besides mass, what else do all materials share? Investigate the concept of volume.',
    description: 'Matter occupies space. We call this space Volume. You will conduct the Tumbler Experiment to see how objects displace liquid.',
    objective: [
      'Phase 1: Tumbler Experiment',
      'Phase 2: Understanding Volume'
    ],
    difficulty: 2,
    estimatedTime: '5 minutes',
    rewardXP: 100
  },
  // Activities for Volume
  { type: 'activity', id: 'stage8_b', title: 'Stage 6.3.6: Space and Volume', subtitle: 'Phase 1: Tumbler Experiment', component: Stage8b_Volume, handbook: Handbook_Volume, layout: '3fr 7fr' },
  { type: 'activity', id: 'stage8_c', title: 'Stage 6.3.6: Space and Volume', subtitle: 'Phase 2: Understanding Volume', component: Stage8c_VolumeConcept, handbook: Handbook_Volume, layout: '3fr 7fr' },
  
  // Checkpoint for Volume
  {
    type: 'checkpoint',
    id: 'checkpoint_3_6',
    title: 'Detective Checkpoint (Stage 6.3.6)',
    questions: [
      {
        question: 'The amount of space occupied by an object is called its:',
        options: ['Lustre', 'Hardness', 'Volume'],
        correct: 2,
        hint: 'It sounds like turning up the sound, but refers to 3D space.',
        explanation: 'Volume is the measure of the three-dimensional space that an object or substance occupies.'
      },
      {
        question: 'If a water bottle and a milk bottle both have "500 mL" written on them, they have the same:',
        options: ['Mass', 'Volume', 'Color'],
        correct: 1
      }
    ],
    dialogue: 'Excellent! You have uncovered the final fundamental property of all materials.',
    discoveries: [
      'The amount of space occupied by water or any object is its Volume.',
      'Labels like 500 mL on bottles indicate the volume of liquid they hold.',
      'If something has mass and occupies space, it is called Matter!'
    ]
  },

  // Barrier 4
  { type: 'activity', id: 'stage9_a', title: 'Barrier 4: What is Matter?', subtitle: 'Mass & Volume', component: Stage9a_WhatIsMatter, handbook: Handbook_Matter, layout: '3fr 7fr' },

  // Barrier 4's Quiz
  {
    type: 'checkpoint',
    id: 'checkpoint_4',
    title: 'Detective Checkpoint (Barrier 4)',
    questions: [
      {
        question: 'Anything that occupies space and has mass is called:',
        options: ['Energy', 'Matter', 'Light'],
        correct: 1,
        hint: 'It is the scientific word for all physical "stuff" in the universe.',
        explanation: 'Matter is the fundamental term for anything that has mass and takes up space (volume).'
      },
      {
        question: 'Is air considered matter?',
        options: ['Yes, because it occupies space and has mass.', 'No, because we cannot see it.'],
        correct: 0,
        hint: 'Think about blowing up a balloon. Does it take up space and have weight?',
        explanation: 'Yes! Air takes up space (inflating a balloon) and has mass (a full balloon is slightly heavier than an empty one), so it is matter.'
      },
      {
        question: 'Which of the following is the standard (SI) unit of Mass?',
        options: ['Litre (L)', 'Kilogram (kg)', 'Metre (m)'],
        correct: 1,
        hint: 'You use this when measuring body weight or buying vegetables.',
        explanation: 'The Kilogram (kg) is the standard SI unit used by scientists globally to measure mass.'
      }
    ],
    dialogue: 'Brilliant work! We have explored and understood the various properties of materials in the modern world. But I am curious... how did people classify them in ancient times?',
    discoveries: [
      'Anything that occupies space and has mass is called matter.',
      'Air is matter because it occupies volume and has mass.'
    ]
  },

  // Do You Know Box (Ancient Classification)
  { type: 'activity', id: 'summary', title: 'Do You Know?', subtitle: 'Ancient Classification', component: Stage8_AyurvedaSummary },

  // Interactive Concept Map
  { type: 'activity', id: 'summary', title: 'Concept Map', subtitle: 'Property Review', component: Stage9c_ConceptMap },

  // Mission Final Quiz (NOT a barrier)
  {
    type: 'mission',
    title: 'Final Quiz',
    dialogue: 'This is your final investigation. Trust your observations and review the evidence you have collected. Headquarters is waiting for the final report.',
    objective: [
      'Complete the Master Investigator Quiz'
    ],
    difficulty: 3,
    estimatedTime: '5 minutes',
    rewardXP: 500
  },
  // 19: Quiz
  { type: 'activity', id: 'quiz', title: 'Final Quiz', subtitle: 'Master Investigator', component: Stage9_Quiz },
  // 20: Case Closed
  {
    type: 'debrief',
    isFinal: true,
    title: 'Investigation Officially Closed',
    dialogue: 'Outstanding work. Headquarters is officially closing this investigation. You are a Master Investigator!',
    observations: [
      { object: 'Chapter 6', finding: 'Materials Around Us Mastered' }
    ],
    rewardReason: 'Case Completed',
    rewardXP: 1000
  }
];
