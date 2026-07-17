import Stage1_Intro from './components/Stage1_Intro';
import Stage2_Identify from './components/Stage2_Identify';
import Stage3_Classification from './components/Stage3_Classification';
import Stage5_Suitability from './components/Stage5_Suitability';
import Stage_SportsBall from './components/Stage_SportsBall';
import Stage4_LustreHardness from './components/Stage4_LustreHardness';
import Stage4a_Appearance_Observe from './components/Stage4a_Appearance_Observe';
import Stage4b_Appearance_Group from './components/Stage4b_Appearance_Group';
import Stage4c_Hardness_Observe from './components/Stage4c_Hardness_Observe';
import Stage6_Transparency from './components/Stage6_Transparency';
import Stage7_SolubilityMatter from './components/Stage7_SolubilityMatter';
import Stage8_AyurvedaSummary from './components/Stage8_AyurvedaSummary';
import Stage9_Quiz from './components/Stage9_Quiz';

export const chapterFlow = [
  // 0: Intro Mission
  {
    type: 'mission',
    title: 'The Classroom Mystery',
    dialogue: 'Good morning, Detective. Headquarters has received an unusual science case. Strange objects have appeared in the classroom. Study today\'s handbook carefully, then begin your investigation.',
    description: 'We need to classify and identify the properties of everyday objects found around the classroom. Your first task is to understand what these materials are made of.',
    objective: 'Learn about materials, then find and scan objects.',
    difficulty: 1,
    estimatedTime: '5 minutes',
    rewardXP: 100
  },

  // 2: Activity
  { type: 'activity', id: 'stage1', title: 'Barrier 1: Practical Investigation', subtitle: 'Phase 1: Find Objects', component: Stage1_Intro },
  // 3: Activity
  { type: 'activity', id: 'stage2', title: 'Barrier 1: Practical Investigation', subtitle: 'Phase 2: Scan Evidence', component: Stage2_Identify },
  // 4: Checkpoint
  {
    type: 'checkpoint',
    id: 'checkpoint_1',
    title: 'Detective Checkpoint',
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
    title: 'Evidence Summary Logged',
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
    title: 'Grouping Materials',
    dialogue: 'Now that we know the materials, Headquarters needs to know how they are organized. Group these materials by their purpose and design a product.',
    description: 'Objects are made from specific materials based on what they are used for. In this phase, you will group items based on their properties and see how materials match their purpose.',
    objective: 'Classify materials and design a sports product.',
    difficulty: 2,
    estimatedTime: '5 minutes',
    rewardXP: 150
  },
  // 5: Activity
  { type: 'activity', id: 'stage3_use', title: 'Barrier 2: Grouping Materials', subtitle: 'Phase 1: Organize by Purpose', component: Stage3_Classification, props: { defaultPhase: 'use' } },
  { type: 'activity', id: 'stage3_material', title: 'Barrier 2: Grouping Materials', subtitle: 'Phase 2: Scientific Grouping', component: Stage3_Classification, props: { defaultPhase: 'material' } },
  { type: 'activity', id: 'stage3_demo', title: 'Barrier 2: Grouping Materials', subtitle: 'Phase 3: Property Insights', component: Stage3_Classification, props: { defaultPhase: 'demo' } },
  { type: 'activity', id: 'stage5', title: 'Barrier 2: Grouping Materials', subtitle: 'Phase 4: Suitability', component: Stage5_Suitability },
  { type: 'activity', id: 'sportsball', title: 'Barrier 2: Grouping Materials', subtitle: 'Phase 5: Product Design', component: Stage_SportsBall },
  // 11: Checkpoint 2
  {
    type: 'checkpoint',
    id: 'checkpoint_2',
    title: 'Detective Checkpoint',
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
    title: 'Classification Summary Logged',
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
    title: 'Properties of Materials',
    dialogue: 'We have another mystery to solve. Why do some materials shine while others do not? Why are some transparent? Investigate these properties.',
    description: 'Scientists use specific tests to determine the properties of different materials. You will now conduct tests for lustre, hardness, transparency, and solubility in water.',
    objective: 'Test lustre, hardness, transparency, and solubility.',
    difficulty: 3,
    estimatedTime: '7 minutes',
    rewardXP: 200
  },
  // 10: Activities
  { type: 'activity', id: 'stage4_1', title: 'Barrier 3: Appearance', subtitle: 'Phase 1: Observation Notebook', component: Stage4a_Appearance_Observe },
  { type: 'activity', id: 'stage4_2', title: 'Barrier 3: Appearance', subtitle: 'Phase 2: Group by Appearance', component: Stage4b_Appearance_Group },
  {
    type: 'debrief',
    barrier: 3,
    title: 'Detective Debrief',
    dialogue: 'Materials with shiny surfaces are called Lustrous. Usually metals. BUT... Are all lustrous materials metals? No! Things like plastic spoons or wax can be shiny without being metals.',
    observations: [
      { object: 'Iron / Copper', finding: 'Shiny = Lustrous' },
      { object: 'Wood / Paper', finding: 'Not shiny = Non-lustrous' }
    ],
    rewardReason: 'Appearance Observations',
    rewardXP: 100
  },
  { type: 'activity', id: 'stage4_3', title: 'Barrier 3: Properties', subtitle: 'Phase 3: Lustre Testing', component: Stage4_LustreHardness, props: { mode: 'lustre_only' } },
  { type: 'activity', id: 'stage4_4', title: 'Barrier 3: Properties', subtitle: 'Phase 4: Observe Hardness', component: Stage4c_Hardness_Observe },
  { type: 'activity', id: 'stage4_5', title: 'Barrier 3: Properties', subtitle: 'Phase 5: Scratch Investigation', component: Stage4_LustreHardness, props: { mode: 'hardness_only' } },
  {
    type: 'debrief',
    barrier: 3,
    title: 'Hardness Conclusion',
    dialogue: 'Excellent! Materials which can be compressed or scratched easily are soft, while those difficult to compress or scratch are hard. But remember: Hardness is relative! Rubber is harder than sponge but softer than iron.',
    observations: [
      { object: 'Sponge', finding: 'Compresses = Soft' },
      { object: 'Iron', finding: 'Unscratchable = Hard' }
    ],
    rewardReason: 'Hardness Observations',
    rewardXP: 100
  },
  { type: 'activity', id: 'stage6', title: 'Barrier 3: Properties', subtitle: 'Phase 2: Transparency', component: Stage6_Transparency },
  { type: 'activity', id: 'stage7_sol', title: 'Barrier 3: Properties', subtitle: 'Phase 3: Solubility', component: Stage7_SolubilityMatter, props: { mode: 'solubility' } },
  // 13: Debrief 3
  {
    type: 'debrief',
    barrier: 3,
    title: 'Properties Uncovered',
    dialogue: 'Outstanding work. You\'ve analyzed key properties of materials. This evidence is crucial for Headquarters.',
    observations: [
      { object: 'Metals', finding: 'Lustrous & Hard' },
      { object: 'Glass', finding: 'Transparent' },
      { object: 'Salt/Sugar', finding: 'Soluble in Water' }
    ],
    rewardReason: 'Barrier 3 Cleared',
    rewardXP: 300
  },
  // 14: Mission 4
  {
    type: 'mission',
    title: 'What is Matter?',
    dialogue: 'There is one final puzzle. All these materials have something fundamental in common. Investigate the concept of matter.',
    objective: 'Experiment with mass and space.',
    difficulty: 2,
    estimatedTime: '4 minutes',
    rewardXP: 150
  },
  // 15: Activities
  { type: 'activity', id: 'stage7_mat', title: 'Barrier 4: Matter', subtitle: 'Phase 1: Mass & Space', component: Stage7_SolubilityMatter, props: { mode: 'matter' } },
  { type: 'activity', id: 'summary', title: 'Summary', subtitle: 'Concept Map', component: Stage8_AyurvedaSummary },
  // 17: Debrief 4
  {
    type: 'debrief',
    barrier: 4,
    title: 'Matter Understood',
    dialogue: 'Incredible work, Detective. You have proven that all these materials share fundamental physical laws.',
    observations: [
      { object: 'Matter', finding: 'Has mass & occupies space' },
      { object: 'Materials', finding: 'Are types of matter' }
    ],
    rewardReason: 'Barrier 4 Cleared',
    rewardXP: 350
  },
  // 18: Mission Final
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
    barrier: 5,
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
