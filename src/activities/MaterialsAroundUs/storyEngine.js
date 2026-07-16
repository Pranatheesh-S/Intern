import Stage1_Intro from './components/Stage1_Intro';
import Stage2_Identify from './components/Stage2_Identify';
import Stage3_Classification from './components/Stage3_Classification';
import Stage5_Suitability from './components/Stage5_Suitability';
import Stage_SportsBall from './components/Stage_SportsBall';
import Stage4_LustreHardness from './components/Stage4_LustreHardness';
import Stage6_Transparency from './components/Stage6_Transparency';
import Stage7_SolubilityMatter from './components/Stage7_SolubilityMatter';
import Stage8_AyurvedaSummary from './components/Stage8_AyurvedaSummary';
import Stage9_Quiz from './components/Stage9_Quiz';

export const chapterFlow = [
  // 0: Intro Mission
  {
    type: 'mission',
    title: 'The Classroom Mystery',
    dialogue: 'Good morning, Detective. Headquarters has received an unusual science case. Strange objects have appeared in the classroom, and we need your keen eyes to identify them.',
    objective: 'Find and scan objects to identify their base materials.',
    difficulty: 1,
    estimatedTime: '3 minutes',
    rewardXP: 100
  },
  // 1: Activity
  { type: 'activity', id: 'stage1', title: 'Barrier 1: Observing Objects', subtitle: 'Phase 1: Find Objects', component: Stage1_Intro },
  // 2: Activity
  { type: 'activity', id: 'stage2', title: 'Barrier 1: Observing Objects', subtitle: 'Phase 2: Scan Evidence', component: Stage2_Identify },
  // 3: Debrief 1
  {
    type: 'debrief',
    barrier: 1,
    title: 'Objects Identified',
    dialogue: 'Excellent observation. That\'s exactly what experienced investigators notice. You\'ve successfully identified the materials.',
    observations: [
      { object: 'Textbook', finding: 'Paper' },
      { object: 'Tumbler', finding: 'Glass' },
      { object: 'Ruler', finding: 'Plastic' }
    ],
    rewardReason: 'Barrier 1 Cleared',
    rewardXP: 200
  },
  // 4: Mission 2
  {
    type: 'mission',
    title: 'Grouping Materials',
    dialogue: 'Now that we know the materials, Headquarters needs to know how they are organized. Group these materials by their purpose and design a product.',
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
  // 8: Debrief 2
  {
    type: 'debrief',
    barrier: 2,
    title: 'Materials Grouped',
    dialogue: 'Brilliant deduction. You successfully grouped materials and designed a functional product based on material properties.',
    observations: [
      { object: 'Leather', finding: 'Durable & Flexible' },
      { object: 'Rubber', finding: 'Bouncy & Grippy' },
      { object: 'Categorization', finding: 'Purpose-driven' }
    ],
    rewardReason: 'Barrier 2 Cleared',
    rewardXP: 250
  },
  // 9: Mission 3
  {
    type: 'mission',
    title: 'Properties of Materials',
    dialogue: 'We have another mystery to solve. Why do some materials shine while others do not? Why are some transparent? Investigate these properties.',
    objective: 'Test lustre, hardness, transparency, and solubility.',
    difficulty: 3,
    estimatedTime: '7 minutes',
    rewardXP: 200
  },
  // 10: Activities
  { type: 'activity', id: 'stage4', title: 'Barrier 3: Properties', subtitle: 'Phase 1: Lustre & Hardness', component: Stage4_LustreHardness },
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
