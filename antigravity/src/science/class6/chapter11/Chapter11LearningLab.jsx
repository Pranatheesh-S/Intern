import React from 'react';
import ChapterLearningLab from '../../../components/ChapterLearningLab';

const CHAPTER_11_ACTIVITIES = [
  { icon: '💧', title: 'Activity 11.1 — Water Resource Mapping', desc: 'Analyze water scarcity and rain-water harvesting.', pg: 'p.162', path: '/activities/class6_chapter2/activity_0.html', sectionHeader: '11.1 — Water is Life', activityId: null },
  { icon: '🌳', title: 'Activity 11.2 — Forest Conservation', desc: 'Identify how trees protect soil erosion and purify air.', pg: 'p.165', path: '/activities/class6_chapter2/activity_1.html', sectionHeader: '11.2 — Protecting Resources', activityId: null }
];

export default function Chapter11LearningLab({ onBack, onHeaderVisibilityChange }) {
  return (
    <ChapterLearningLab 
      classNum={6}
      chapterNum={11}
      chapterTitle="Nature's Treasures"
      subjectName="SCIENCE"
      topics="Natural Resources · Water Conservation · Air Purity · Forests · Environmental Protection"
      coverGraphic="treasures"
      sloganImg={null}
      sloganExplanation="In this chapter, we explore Nature's Treasures. The Earth offers infinite treasures—pure air, fresh water, fertile soil, and thriving forests—which sustain our existence. Learning to conserve water, reduce pollution, and protect these valuable natural resources is the greatest task of our generation, ensuring that future generations can inherit a green, living planet."
      activities={CHAPTER_11_ACTIVITIES}
      onBack={onBack}
      onHeaderVisibilityChange={onHeaderVisibilityChange}
    />
  );
}
