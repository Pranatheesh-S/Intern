import React from 'react';
import ChapterLearningLab from '../../../components/ChapterLearningLab';

const CHAPTER_3_ACTIVITIES = [
  { icon: '🍲', title: 'Introduction to Food & Nutrients', desc: 'Understand carbohydrates, proteins, fats and vitamins.', pg: 'p.35', path: '/activities/class6_chapter2/activity_0.html', sectionHeader: '3.1 — Components of Food', activityId: null },
  { icon: '🍽️', title: 'Activity 3.1 — Planning a Balanced Diet', desc: 'Organize a balanced diet plate for three meals.', pg: 'p.37', path: '/activities/class6_chapter2/activity_1.html', sectionHeader: '3.2 — Healthy Body & Balance', activityId: null },
  { icon: '🧪', title: 'Activity 3.2 — Starch Detection Test', desc: 'Test potato, rice and flour using iodine solution.', pg: 'p.39', path: '/activities/class6_chapter2/activity_3.html', sectionHeader: '3.3 — Food Laboratory Tests', activityId: 'food_testing' },
  { icon: '🧈', title: 'Activity 3.3 — Fat Detection Test', desc: 'Observe translucent paper patches for fats.', pg: 'p.41', path: '/activities/class6_chapter2/activity_4.html', sectionHeader: '3.3 — Food Laboratory Tests', activityId: 'fat_testing' },
  { icon: '🧪', title: 'Activity 3.4 — Protein Detection Test', desc: 'Test egg, milk and beans using copper sulfate and caustic soda.', pg: 'p.43', path: '/activities/class6_chapter2/activity_5.html', sectionHeader: '3.3 — Food Laboratory Tests', activityId: 'protein_testing' }
];

export default function Chapter3LearningLab({ onBack, onHeaderVisibilityChange }) {
  return (
    <ChapterLearningLab 
      classNum={6}
      chapterNum={3}
      chapterTitle="Mindful Eating: A Path to a Healthy Body"
      subjectName="SCIENCE"
      topics="Nutrients · Balanced Diet · Food Testing · Starch · Fats · Proteins"
      coverGraphic="diet"
      sloganImg={null}
      sloganExplanation="In this chapter, we explore Mindful Eating. Our body is a temple, and what we put inside it defines our growth, energy, and health. We will explore key nutrients (carbohydrates, proteins, fats, vitamins, minerals) and conduct hands-on chemical tests to detect their presence in our daily food items, guiding us towards a balanced, mindful diet."
      activities={CHAPTER_3_ACTIVITIES}
      onBack={onBack}
      onHeaderVisibilityChange={onHeaderVisibilityChange}
    />
  );
}
