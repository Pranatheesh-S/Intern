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
    objective: 'Learn about materials, then find and scan objects.',
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
        correct: 0
      }
    ]
  },
  // 5: Summary
  {
    type: 'summary',
    barrier: 1,
    title: 'Evidence Summary Logged (Barrier 1)',
    dialogue: 'Excellent work, Detective. You have successfully completed today\'s investigation. Let\'s record our findings in your permanent Investigation Handbook.',
    discoveries: [
      'Objects around us are made of one or more materials.',
      'A material is the substance used to make an object.',
      'The same object can be made of different materials (e.g. a glass tumbler vs plastic tumbler).'
    ],
    rewardReason: 'Barrier 1 Cleared',
    rewardXP: 200
  },
  // 6: Mission 2
  {
    type: 'mission',
    title: 'Grouping Materials (Barrier 2)',
    dialogue: 'Now that we know the materials, Headquarters needs to know how they are organized. Group these materials by their purpose and design a product.',
    description: 'Objects are made from specific materials based on what they are used for. In this phase, you will group items based on their properties and see how materials match their purpose.',
    objective: 'Classify materials and design a sports product.',
    difficulty: 2,
    estimatedTime: '5 minutes',
    rewardXP: 150
  },
  // 5: Activity
  { type: 'activity', id: 'stage3_use', title: 'Stage 6.2: Grouping Materials', subtitle: 'Phase 1: Organize by Purpose', component: Stage3_Classification, props: { defaultPhase: 'use' } },
  { type: 'activity', id: 'stage3_material', title: 'Stage 6.2: Grouping Materials', subtitle: 'Phase 2: Scientific Grouping', component: Stage3_Classification, props: { defaultPhase: 'material' } },
  { type: 'activity', id: 'stage3_demo', title: 'Stage 6.2: Grouping Materials', subtitle: 'Phase 3: Property Insights', component: Stage3_Classification, props: { defaultPhase: 'demo' } },
  { type: 'activity', id: 'stage5', title: 'Stage 6.2: Grouping Materials', subtitle: 'Phase 4: Suitability', component: Stage5_Suitability },
  { type: 'activity', id: 'sportsball', title: 'Stage 6.2: Grouping Materials', subtitle: 'Phase 5: Product Design', component: Stage_SportsBall },
  // 11: Checkpoint 2
  {
    type: 'checkpoint',
    id: 'checkpoint_2',
    title: 'Detective Checkpoint (Barrier 2)',
    questions: [
      {
        question: 'Why do we group objects together (Classification)?',
        options: ['Because they look identical', 'To study their common properties', 'To make them look pretty'],
        correct: 1
      },
      {
        question: 'Why is a cooking pot made of metal instead of paper?',
        options: ['Because metal is cheaper', 'Because metal allows heat to pass through for cooking', 'Because paper is too heavy'],
        correct: 1
      }
    ]
  },
  // 12: Summary 2
  {
    type: 'summary',
    barrier: 2,
    title: 'Classification Summary Logged (Barrier 2)',
    dialogue: 'Brilliant deduction, Detective. You successfully grouped materials and discovered how their properties match their purpose. Let\'s log this in your handbook.',
    discoveries: [
      'Classification means arranging objects into groups based on common properties.',
      'Materials are chosen for objects based on their specific properties (e.g. glass for windows).',
      'The same object can be grouped differently based on the property being observed.'
    ],
    rewardReason: 'Barrier 2 Cleared',
    rewardXP: 250
  },
  // 9: Mission 3
  {
    type: 'mission',
    title: 'Properties of Materials (Barrier 3)',
    dialogue: 'Detective, Barrier 3 is massive! It contains 6 distinct properties to investigate. To keep our evidence organized, Headquarters has issued a separate handbook for each of the 6 stages. Pay close attention to each one!',
    description: 'Scientists use specific tests to determine the properties of different materials. You will now conduct tests across multiple stages including Appearance, Hardness, Solubility, Floating/Sinking, and Transparency.',
    objective: 'Complete all 6 stages of Barrier 3 and fill out their respective handbooks.',
    difficulty: 4,
    estimatedTime: '15 minutes',
    rewardXP: 200
  },
  // 10: Activities
  // 10: Activities
  { type: 'activity', id: 'stage4_1', title: 'Stage 6.3.1: Appearance', subtitle: 'Phase 1: Observation Notebook', component: Stage4a_Appearance_Observe, handbook: Handbook_Appearance, layout: '450px 1fr' },
  { type: 'activity', id: 'stage4_2', title: 'Stage 6.3.1: Appearance', subtitle: 'Phase 2: Group by Appearance', component: Stage4b_Appearance_Group, handbook: Handbook_Appearance, layout: '450px 1fr' },
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
        correct: 0
      },
      {
        question: 'Are all lustrous materials metals?',
        options: ['Yes, only metals shine.', 'No, some non-metals like plastic or wax can also be shiny.'],
        correct: 1
      }
    ]
  },
  
  // Summary for 6.3.1
  {
    type: 'summary',
    barrier: 3,
    title: 'Appearance Summary Logged (Stage 6.3.1)',
    dialogue: 'Fantastic work Detective! You proved that observing and testing for lustre helps us identify materials correctly.',
    discoveries: [
      'Materials with a shiny surface are called Lustrous.',
      'Metals usually have lustre (e.g. Iron, Copper).',
      'Not all lustrous materials are metals; some are coated or polished.'
    ],
    rewardReason: 'Appearance Expert Badge',
    rewardXP: 100
  },
  
  // Mission Briefing for 6.3.2 Hardness
  {
    type: 'mission',
    title: 'Hardness (Stage 6.3.2)',
    dialogue: 'Brilliant work on appearance! Now, we must investigate how easy it is to scratch or compress the materials. This is the property of Hardness.',
    description: 'Materials can be soft (easily compressed) or hard (difficult to compress). Your next mission is to physically test the hardness of various evidence items.',
    objective: 'Test materials for hardness and categorize them.',
    difficulty: 2,
    estimatedTime: '5 minutes',
    rewardXP: 100
  },
  
  { type: 'activity', id: 'stage4_4', title: 'Stage 6.3.2: Hardness', subtitle: 'Phase 1: Observe Hardness', component: Stage4c_Hardness_Observe, handbook: Handbook_Hardness, layout: '450px 1fr' },
  { type: 'activity', id: 'stage4_5', title: 'Stage 6.3.2: Hardness', subtitle: 'Phase 2: Material Identification', component: Stage4d_MaterialIdentification, handbook: Handbook_Hardness, layout: '450px 1fr' },
  
  // Checkpoint for 6.3.2
  {
    type: 'checkpoint',
    id: 'checkpoint_3_2',
    title: 'Detective Checkpoint (Stage 6.3.2)',
    questions: [
      {
        question: 'What do we call materials that are difficult to compress or scratch?',
        options: ['Soft', 'Hard', 'Lustrous'],
        correct: 1
      },
      {
        question: 'Which of the following is an example of a soft material?',
        options: ['Iron', 'Stone', 'Sponge'],
        correct: 2
      }
    ]
  },
  
  // Summary for 6.3.2
  {
    type: 'summary',
    barrier: 3,
    title: 'Hardness Summary Logged (Stage 6.3.2)',
    dialogue: 'Excellent! You verified that hardness is determined by how easily a material can be compressed or scratched. This is vital evidence.',
    discoveries: [
      'Materials that can be compressed or scratched easily are soft.',
      'Materials that are difficult to compress or scratch are hard.',
      'Hardness is a physical property used to classify materials.'
    ],
    rewardReason: 'Hardness Expert Badge',
    rewardXP: 100
  },
  
  // Mission Briefing for 6.3.3 Transparency
  {
    type: 'mission',
    title: 'Transparency (Stage 6.3.3)',
    dialogue: 'During a stakeout, a detective must know which materials block sight and which allow it. Let\'s investigate the property of transparency.',
    description: 'Materials can be transparent, translucent, or opaque based on how much light passes through them. Your next mission is to analyze materials for surveillance visibility.',
    objective: 'Test whether materials are transparent, translucent, or opaque.',
    difficulty: 2,
    estimatedTime: '5 minutes',
    rewardXP: 100
  },
  
  { type: 'activity', id: 'stage6_a', title: 'Stage 6.3.3: Transparency', subtitle: 'Phase 1: Surveillance Simulator', component: Stage6a_Surveillance, handbook: Handbook_Transparency, layout: '450px 1fr' },
  { type: 'activity', id: 'stage6_b', title: 'Stage 6.3.3: Transparency', subtitle: 'Phase 2: Activity 6.6', component: Stage6b_Classify, handbook: Handbook_Transparency, layout: '450px 1fr' },
  
  // Checkpoint for 6.3.3
  {
    type: 'checkpoint',
    id: 'checkpoint_3_3',
    title: 'Detective Checkpoint (Stage 6.3.3)',
    questions: [
      {
        question: 'Which material allows you to see clearly through it?',
        options: ['Transparent', 'Translucent', 'Opaque'],
        correct: 0
      },
      {
        question: 'If you can see through an object, but not clearly, what property does it have?',
        options: ['Transparent', 'Translucent', 'Opaque'],
        correct: 1
      }
    ]
  },
  
  // Summary for 6.3.3
  {
    type: 'summary',
    barrier: 3,
    title: 'Transparency Summary Logged (Stage 6.3.3)',
    dialogue: 'Great detective work! You have successfully mastered how visibility works through different materials.',
    discoveries: [
      'Materials that allow light to pass through clearly are Transparent.',
      'Materials that allow some light, but not clear vision, are Translucent.',
      'Materials that block light completely are Opaque.'
    ],
    rewardReason: 'Transparency Expert Badge',
    rewardXP: 100
  },

  // Mission Briefing for 6.3.4 Solubility
  {
    type: 'mission',
    title: 'Solubility (Stage 6.3.4)',
    dialogue: 'Does everything disappear in water? Some evidence might dissolve, leaving no trace! Let\'s investigate what is soluble and what is not.',
    description: 'Materials can be soluble (dissolves in water) or insoluble (does not dissolve). Your next mission is to test materials in water and classify them.',
    objective: 'Test whether materials dissolve in water.',
    difficulty: 2,
    estimatedTime: '5 minutes',
    rewardXP: 100
  },
  
  { type: 'activity', id: 'stage7_a', title: 'Stage 6.3.4: Solubility', subtitle: 'Phase 1: Solubility Simulator', component: Stage7a_SolubilitySim, handbook: Handbook_Solubility, layout: '450px 1fr' },
  { type: 'activity', id: 'stage7_b', title: 'Stage 6.3.4: Solubility', subtitle: 'Phase 2: Classification', component: Stage7b_SolubilityClassify, handbook: Handbook_Solubility, layout: '450px 1fr' },
  
  // Checkpoint for 6.3.4
  {
    type: 'checkpoint',
    id: 'checkpoint_3_4',
    title: 'Detective Checkpoint (Stage 6.3.4)',
    questions: [
      {
        question: 'What do we call a material that completely disappears when mixed with water (like salt)?',
        options: ['Soluble', 'Insoluble', 'Opaque'],
        correct: 0
      },
      {
        question: 'Which of the following materials is Insoluble in water?',
        options: ['Sugar', 'Sand', 'Lemon Juice'],
        correct: 1
      }
    ]
  },
  
  // Summary for 6.3.4
  {
    type: 'summary',
    barrier: 3,
    title: 'Solubility Summary Logged (Stage 6.3.4)',
    dialogue: 'Fantastic work! You have successfully identified which materials dissolve in water and which do not.',
    discoveries: [
      'Materials that completely disappear in water are called Soluble.',
      'Materials that do not mix with water are called Insoluble.',
      'Water plays an important role in our body because it can dissolve a large number of materials.'
    ],
    rewardReason: 'Solubility Expert Badge',
    rewardXP: 100
  },

  // Mission for 6.3.5 Mass
  {
    type: 'mission',
    title: 'Mass (Stage 6.3.5)',
    dialogue: 'All these materials have something fundamental in common. Let\'s investigate how heavy or light they are.',
    objective: 'Experiment with mass.',
    difficulty: 2,
    estimatedTime: '3 minutes',
    rewardXP: 100
  },
  // Activities for Mass
  { type: 'activity', id: 'stage8_a', title: 'Stage 6.3.5: Mass', subtitle: 'How heavy or light?', component: Stage8a_Mass, handbook: Handbook_Mass, layout: '450px 1fr' },
  
  // Checkpoint for Mass
  {
    type: 'checkpoint',
    id: 'checkpoint_3_5',
    title: 'Detective Checkpoint (Stage 6.3.5)',
    questions: [
      {
        question: 'What property tells us how heavy or light an object is?',
        options: ['Mass', 'Volume', 'Transparency'],
        correct: 0
      },
      {
        question: 'If an object is heavier than another, it has:',
        options: ['Less mass', 'More mass', 'The same mass'],
        correct: 1
      }
    ]
  },
  
  // Summary for 6.3.5
  {
    type: 'summary',
    barrier: 3,
    title: 'Mass Summary Logged (Stage 6.3.5)',
    dialogue: 'Incredible work, Detective. You have proven that we can measure how heavy objects are.',
    discoveries: [
      'The property that makes objects heavy or light is called Mass.',
      'An object which is heavier has more mass.',
      'Weight is often used in common language to describe mass.'
    ],
    rewardReason: 'Mass Expert Badge',
    rewardXP: 150
  },

  // Mission for 6.3.6 Volume
  {
    type: 'mission',
    title: 'Space and Volume (Stage 6.3.6)',
    dialogue: 'There is one final puzzle for Barrier 3. Besides mass, what else do all materials share? Investigate the concept of volume.',
    objective: 'Experiment with space and volume.',
    difficulty: 2,
    estimatedTime: '5 minutes',
    rewardXP: 100
  },
  // Activities for Volume
  { type: 'activity', id: 'stage8_b', title: 'Stage 6.3.6: Space and Volume', subtitle: 'Phase 1: Tumbler Experiment', component: Stage8b_Volume, handbook: Handbook_Volume, layout: '450px 1fr' },
  { type: 'activity', id: 'stage8_c', title: 'Stage 6.3.6: Space and Volume', subtitle: 'Phase 2: Understanding Volume', component: Stage8c_VolumeConcept, handbook: Handbook_Volume, layout: '450px 1fr' },
  
  // Checkpoint for Volume
  {
    type: 'checkpoint',
    id: 'checkpoint_3_6',
    title: 'Detective Checkpoint (Stage 6.3.6)',
    questions: [
      {
        question: 'The amount of space occupied by an object is called its:',
        options: ['Lustre', 'Hardness', 'Volume'],
        correct: 2
      },
      {
        question: 'If a water bottle and a milk bottle both have "500 mL" written on them, they have the same:',
        options: ['Mass', 'Volume', 'Color'],
        correct: 1
      }
    ]
  },
  
  // Summary for 6.3.6
  {
    type: 'summary',
    barrier: 3,
    title: 'Volume Summary Logged (Stage 6.3.6)',
    dialogue: 'Excellent! You have uncovered the final fundamental property of all materials.',
    discoveries: [
      'The amount of space occupied by water or any object is its Volume.',
      'Labels like 500 mL on bottles indicate the volume of liquid they hold.',
      'If something has mass and occupies space, it is called Matter!'
    ],
    rewardReason: 'Volume Expert Badge',
    rewardXP: 200
  },

  // Barrier 4
  { type: 'activity', id: 'stage9_a', title: 'Barrier 4: What is Matter?', subtitle: 'Mass & Volume', component: Stage9a_WhatIsMatter, handbook: Handbook_Matter, layout: '450px 1fr' },

  // Barrier 4's Quiz
  {
    type: 'checkpoint',
    id: 'checkpoint_4',
    title: 'Detective Checkpoint (Barrier 4)',
    questions: [
      {
        question: 'Anything that occupies space and has mass is called:',
        options: ['Energy', 'Matter', 'Light'],
        correct: 1
      },
      {
        question: 'Is air considered matter?',
        options: ['Yes, because it occupies space and has mass.', 'No, because we cannot see it.'],
        correct: 0
      },
      {
        question: 'Which of the following is the standard (SI) unit of Mass?',
        options: ['Litre (L)', 'Kilogram (kg)', 'Metre (m)'],
        correct: 1
      }
    ]
  },

  // End conversation with Detective (Summary Logged)
  {
    type: 'summary',
    barrier: 4,
    title: 'Matter Summary Logged (Barrier 4)',
    dialogue: 'Brilliant work! We have explored and understood the various properties of materials in the modern world. But I am curious... how did people classify them in ancient times?',
    discoveries: [
      'Anything that occupies space and has mass is called matter.',
      'Air is matter because it occupies volume and has mass.'
    ],
    rewardReason: 'Barrier 4 Cleared',
    rewardXP: 200
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
    objective: 'Pass the Master Investigator Quiz.',
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
