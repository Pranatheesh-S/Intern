import React from 'react';
import MissionBriefingSpread from './MissionBriefingSpread';
import newChiefDetectiveImage from '../../../../../../assets/new chief detective .jpeg';

const barrier2Data = {
  id: 'barrier_2',
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
  rewardXP: 150,
  detectiveImage: newChiefDetectiveImage
};

export default function Barrier2_Grouping({ onContinue, onBack }) {
  return (
    <MissionBriefingSpread 
      data={barrier2Data} 
      onContinue={onContinue} 
      onBack={onBack} 
    />
  );
}
