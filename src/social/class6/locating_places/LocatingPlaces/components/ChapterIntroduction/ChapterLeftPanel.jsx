import React from 'react';
import { ChapterLeftPanel as EduChapterLeftPanel } from '../../../../../../components/edu';
import earthImg from './assets/Earth.png';

/**
 * Locating Places chapter — left panel with chapter-specific content.
 */
export default function ChapterLeftPanel(props) {
  return (
    <EduChapterLeftPanel
      eyebrow="Chapter 1 • Class 6 Social Science"
      title="Locating Places on the Earth"
      imageSrc={earthImg}
      imageAlt="Earth from space"
      badge="Ancient Indian Astronomy"
      caption="Earth from space — a spherical globe in the cosmos"
      quote="The globe of the Earth stands in space, made up of water, earth, fire and air and is spherical. ... It is surrounded by all creatures, terrestrial as well as aquatic."
      quoteAuthor="Āryabhaṭa"
      quoteSource="Āryabhaṭīya · about 500 CE"
      {...props}
    />
  );
}
