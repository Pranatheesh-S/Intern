import React from 'react';
import ChapterLearningLab from '../../../components/ChapterLearningLab';
import sanskritSlogan from '../../../assets/sanskrit_slogan.png';

import coverBgImage from '../../../assets/cover_page_ch2.png';
import learningLabBg from '../../../assets/class_6_ch2_learning_lab_bg.png';
import levelMapBg from '../../../assets/class_6_ch2_level_map.jpg';

const CHAPTER_2_ACTIVITIES = [
  { icon: '🌿', title: 'Activity 2.1 — Plants (Table 2.1)', desc: 'Record real plants — tap the leaves, stems and flowers.', pg: 'p.11', path: '/activities/class6_chapter2/activity_0.html', sectionHeader: '2.1 — Diversity in Plants & Animals Around Us', activityId: 'virtual_biodiversity' },
  { icon: '🐾', title: 'Activity 2.1 — Animals (Table 2.2)', desc: 'Where animals live, what they eat and how they move.', pg: 'p.12', path: '/activities/class6_chapter2/activity_1.html', sectionHeader: '2.1 — Diversity in Plants & Animals Around Us', activityId: 'virtual_biodiversity' },
  { icon: '🎨', title: 'Activity 2.2 — Let us appreciate', desc: 'A live class blackboard reveals biodiversity.', pg: 'p.13', path: '/activities/class6_chapter2/activity_2.html', sectionHeader: '2.1 — Diversity in Plants & Animals Around Us', activityId: 'appreciating_biodiversity' },
  { icon: '🧩', title: '2.2 / Activity 2.3 — How to group', desc: 'The same living things regroup by any feature you pick.', pg: 'p.14–15', path: '/activities/class6_chapter2/activity_3.html', sectionHeader: '2.2 — How to Group Plants & Animals?', activityId: 'inline_sorting' },
  { icon: '🌱', title: 'Activity 2.4 — Herbs, shrubs & trees', desc: 'Grow a plant; watch it be named live. Fill Table 2.3.', pg: 'p.15–16', path: '/activities/class6_chapter2/activity_4.html', sectionHeader: '2.2 — How to Group Plants & Animals?', activityId: 'plant_detective_stem' },
  { icon: '🍃', title: 'Activity 2.5 — Leaf venation', desc: 'Sort leaves: reticulate (net-like) vs parallel.', pg: 'p.17', path: '/activities/class6_chapter2/activity_5.html', sectionHeader: '2.2 — How to Group Plants & Animals?', activityId: 'leaf_venation_lab' },
  { icon: '🥕', title: 'Activity 2.6 — Roots', desc: 'Sort roots into taproot or fibrous.', pg: 'p.18', path: '/activities/class6_chapter2/activity_6.html', sectionHeader: '2.2 — How to Group Plants & Animals?', activityId: 'root_systems_lab' },
  { icon: '🔗', title: 'Activity 2.7 — Relate & analyse', desc: 'Discover the venation–root link. Fill Table 2.4.', pg: 'p.19', path: '/activities/class6_chapter2/activity_7.html', sectionHeader: '2.2 — How to Group Plants & Animals?', activityId: 'venation_root_correlation' },
  { icon: '🥜', title: 'Activity 2.8 — Seeds (dicot/monocot)', desc: 'Compare seeds and tie the whole chapter together.', pg: 'p.20', path: '/activities/class6_chapter2/activity_8.html', sectionHeader: '2.2 — How to Group Plants & Animals?', activityId: 'seed_dissection_lab' },
  { icon: '🏃', title: '2.2.2 / Activity 2.9 — Animal movement', desc: 'Group animals by the body part they move with. Table 2.5.', pg: 'p.21–22', path: '/activities/class6_chapter2/activity_9.html', sectionHeader: '2.2 — How to Group Plants & Animals?', activityId: 'animal_locomotion' },
  { icon: '🗺️', title: '2.3 / Activity 2.10 — Different surroundings', desc: 'Sort life into desert, mountains, ocean and forest.', pg: 'p.23–24', path: '/activities/class6_chapter2/activity_10.html', sectionHeader: '2.3 — Plants & Animals in Different Surroundings', activityId: 'animal_habitat_matching' },
  { icon: '🐪', title: 'Adaptations — Camels', desc: 'Compare a hot-desert and cold-desert camel.', pg: 'p.25–26', path: '/activities/class6_chapter2/activity_11.html', sectionHeader: '2.3 — Plants & Animals in Different Surroundings', activityId: null },
  { icon: '🏡', title: 'Habitats — land, water & both', desc: 'Sort living things into terrestrial, aquatic or amphibian.', pg: 'p.27–28', path: '/activities/class6_chapter2/activity_12.html', sectionHeader: '2.3 — Plants & Animals in Different Surroundings', activityId: null },
  { icon: '🔑', title: 'Sacred Groves & Keywords', desc: 'Sacred groves, plus a tappable glossary of every keyword.', pg: 'p.29', path: '/activities/class6_chapter2/activity_13.html', sectionHeader: '2.3 — Plants & Animals in Different Surroundings', activityId: null },
  { icon: '🏆', title: 'Chapter Challenge — enhance our learning', desc: 'The chapter\'s own exercises — Venn sort, flowchart logic, scored.', pg: 'p.31–33', path: '/activities/class6_chapter2/activity_14.html', sectionHeader: 'Chapter Challenge — Let us enhance our learning', activityId: null }
];

export default function Chapter2LearningLab({ onBack, onHeaderVisibilityChange }) {
  return (
    <ChapterLearningLab 
      classNum={6}
      chapterNum={2}
      chapterTitle="Diversity in the Living World"
      subjectName="SCIENCE"
      topics="Plants · Animals · Habitats · Adaptation · Classification"
      coverGraphic="diversity"
      sloganImg={sanskritSlogan}
      sloganExplanation="In this chapter, we explore Diversity in the Living World. Just like the trees in this ancient verse selflessly support all other life by offering shade and food, every living organism is interconnected. Plants, animals, and humans depend on each other, forming a beautiful, cooperative web of life. Understanding and protecting this biological diversity is not just science—it is our duty to the planet."
      activities={CHAPTER_2_ACTIVITIES}
      onBack={onBack}
      onHeaderVisibilityChange={onHeaderVisibilityChange}
      coverBgImage={coverBgImage}
      learningLabBg={learningLabBg}
      levelMapBg={levelMapBg}
    />
  );
}
