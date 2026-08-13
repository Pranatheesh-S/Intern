import React, { useState } from 'react';
import { Compass } from 'lucide-react';

export default function Stage9c_ConceptMap({ onComplete, addXp }) {
  const [activeConcept, setActiveConcept] = useState('matter');
  const [hasCompleted, setHasCompleted] = useState(false);

  const concepts = {
    matter: {
      title: 'What is Matter?',
      desc: 'Anything that occupies space (volume) and has mass is called matter. Materials are types of matter used to create everyday objects.',
      didYouKnow: 'Air is also matter! Even though you can\'t see it, it occupies volume (like filling a balloon) and has mass.'
    },
    lustre: {
      title: 'Lustre (Shine)',
      desc: 'Materials with shiny surfaces are lustrous. Metals like iron, copper, gold, and aluminium are usually lustrous, though they can look dull over time due to moisture.',
      didYouKnow: 'Freshly cut metal surfaces show the true lustre instantly because they haven\'t reacted with air yet!'
    },
    hardness: {
      title: 'Hardness & Softness',
      desc: 'Materials that can be compressed or scratched easily are soft (sponge, rubber). Materials that are difficult to compress or scratch are hard (brick, iron, stone).',
      didYouKnow: 'Ayurveda uses the terms "Mridu" (soft) and "Kathina" (hard) to classify drugs and minerals.'
    },
    transparency: {
      title: 'Transparency Levels',
      desc: 'Transparent: allows light to pass clearly (glass, clean water). Translucent: allows light partially (butter paper, frosted glass). Opaque: blocks all light (wood, metal).',
      didYouKnow: 'Clean water is transparent, but mixing mud into it makes it opaque/turbid!'
    },
    solubility: {
      title: 'Solubility in Water',
      desc: 'Soluble: substances that completely dissolve and disappear in water (sugar, salt). Insoluble: substances that do not mix or disappear (sand, sawdust, chalk).',
      didYouKnow: 'Dissolved oxygen gas in water is crucial for the survival of fish and other aquatic organisms!'
    }
  };

  const handleComplete = () => {
    if (!hasCompleted) {
      addXp(20);
      setHasCompleted(true);
      onComplete();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={22} style={{ color: 'var(--accent)' }} /> Case File Complete: Property Concept Map
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Review all the properties we investigated during this mission. Click through the categories to refresh your memory!
        </p>
      </div>

      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)', minHeight: '300px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          {Object.keys(concepts).map((key) => (
            <button
              key={key}
              onClick={() => setActiveConcept(key)}
              className={activeConcept === key ? 'primary' : 'outline'}
              style={{ fontSize: '1.05rem', padding: '0.6rem 1rem' }}
            >
              {concepts[key].title}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, background: 'var(--surface)', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)' }}>{concepts[activeConcept].title}</h4>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
            {concepts[activeConcept].desc}
          </p>
          <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '1rem', marginTop: 'auto', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--accent)' }}>Did You Know?</strong> {concepts[activeConcept].didYouKnow}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="primary" onClick={handleComplete} disabled={hasCompleted}>
          {hasCompleted ? 'Review Completed' : 'Acknowledge Summary'}
        </button>
      </div>
    </div>
  );
}
