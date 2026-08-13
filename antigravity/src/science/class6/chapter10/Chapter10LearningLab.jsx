import React from 'react';
import ChapterLearningLab from '../../../components/ChapterLearningLab';

const CHAPTER_10_ACTIVITIES = [
  { icon: '🫁', title: 'Activity 10.1 — Observing Respiration', desc: 'Track breathing rates and gas exchange mechanisms.', pg: 'p.142', path: '/activities/class6_chapter2/activity_0.html', sectionHeader: '10.1 — Characteristics of Life', activityId: null },
  { icon: '🧠', title: 'Activity 10.2 — Stimulus & Response', desc: 'Observe plant responses to sunlight (phototropism).', pg: 'p.145', path: '/activities/class6_chapter2/activity_1.html', sectionHeader: '10.2 — Life Responses', activityId: null }
];

export default function Chapter10LearningLab({ onBack, onHeaderVisibilityChange }) {
  return (
    <ChapterLearningLab 
      classNum={6}
      chapterNum={10}
      chapterTitle="Living Creatures: Exploring their Characteristics"
      subjectName="SCIENCE"
      topics="Organisms · Life Processes · Growth · Respiration · Responses · Habitats"
      coverGraphic="living_creatures"
      sloganImg={null}
      sloganExplanation="In this chapter, we explore Living Creatures. Every organism, from the smallest amoeba to the giant banyan tree, shares fundamental traits: they grow, breathe, respond to their environment, and reproduce. Understanding the characteristics of life allows us to appreciate the delicate balance of ecological niches and how organisms adapt to survive in diverse conditions."
      activities={CHAPTER_10_ACTIVITIES}
      onBack={onBack}
      onHeaderVisibilityChange={onHeaderVisibilityChange}
    />
  );
}
