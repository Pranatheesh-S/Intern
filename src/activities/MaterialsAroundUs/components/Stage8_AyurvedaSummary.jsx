import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Check, Award, Compass } from 'lucide-react';

export default function Stage8_AyurvedaSummary({ onComplete, addXp }) {
  // Gunas matchup state
  const [selectedGuna, setSelectedGuna] = useState(null);
  const [gunaMatches, setGunaMatches] = useState({}); // { guru: 'Heavy', mridu: 'Soft', etc }
  
  // Concept map state
  const [activeConcept, setActiveConcept] = useState('matter');

  const gunasData = [
    { sanskrit: 'guru', english: 'Heavy', pairedWith: 'laghu (light)' },
    { sanskrit: 'mṛdu', english: 'Soft', pairedWith: 'kaṭhina (hard)' },
    { sanskrit: 'sāndra', english: 'Solid', pairedWith: 'drava (liquid)' },
    { sanskrit: 'ślakṣaṇa', english: 'Smooth', pairedWith: 'khara (rough)' }
  ];

  const handleMatch = (sanskrit, english) => {
    const item = gunasData.find(g => g.sanskrit === sanskrit);
    if (item.english === english) {
      setGunaMatches(prev => ({ ...prev, [sanskrit]: english }));
      addXp(10);
    }
  };

  const gunasCompleted = Object.keys(gunaMatches).length === gunasData.length;

  useEffect(() => {
    if (gunasCompleted) {
      onComplete();
    }
  }, [gunasCompleted, onComplete]);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Intro */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={22} style={{ color: 'var(--accent)' }} /> 6.4: Ancient India Classification & Summary
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Ayurveda (ancient Indian medical system) classified physical matter using 20 properties (*guna*—10 pairs of opposites). Let's review these pairs!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.5rem' }}>
        {/* Ancient Scroll Ayurveda Matcher */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            border: '2px solid #D9C9A3', 
            background: 'var(--warning-bg)',
            color: 'var(--text-primary)'
          }}
        >
          <div style={{ borderBottom: '1px solid var(--warning-border)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.15rem', color: 'var(--warning)' }}>Ancient Wisdom scroll (Ashtanga Hridaya)</span>
          </div>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
            Match the Sanskrit Ayurvedic properties (Gunas) to their correct English opposites:
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {gunasData.map((g) => {
              const isMatched = gunaMatches[g.sanskrit] !== undefined;
              return (
                <button
                  key={g.sanskrit}
                  onClick={() => setSelectedGuna(g.sanskrit)}
                  className={selectedGuna === g.sanskrit ? 'outline active' : 'outline'}
                  disabled={isMatched}
                  style={{
                    fontSize: '0.95rem',
                    padding: '0.5rem 0.8rem',
                    borderColor: 'var(--warning-border)',
                    textTransform: 'capitalize',
                    background: isMatched ? 'var(--success-bg)' : 'transparent',
                    color: isMatched ? 'var(--success)' : 'var(--text-primary)'
                  }}
                >
                  {g.sanskrit} {isMatched ? '✓' : ''}
                </button>
              );
            })}
          </div>

          {/* Target Match selectors */}
          {selectedGuna && (
            <div style={{ background: 'var(--surface)', padding: '0.75rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Match <strong>{selectedGuna}</strong> with:</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%' }}>
                {gunasData.map((g) => (
                  <button
                    key={g.english}
                    onClick={() => { handleMatch(selectedGuna, g.english); setSelectedGuna(null); }}
                    className="outline"
                    style={{ padding: '0.5rem', fontSize: '0.95rem' }}
                  >
                    {g.english}
                  </button>
                ))}
              </div>
            </div>
          )}

          {gunasCompleted && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '1rem', borderRadius: '8px', fontSize: '1rem', color: 'var(--success)', lineHeight: '1.5' }}
            >
              <strong>Match complete!</strong> Ancient India categorized food and minerals based on: <br/>
              • Guru (Heavy) vs Laghu (Light) <br/>
              • Mridu (Soft) vs Kathina (Hard) <br/>
              • Sandra (Solid) vs Drava (Liquid)
            </motion.div>
          )}
        </div>

        {/* Interactive Concept Map */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>Interactive Concept Map</span>
          </div>

          {/* Node buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
            {Object.keys(concepts).map((key) => (
              <button
                key={key}
                onClick={() => setActiveConcept(key)}
                className={activeConcept === key ? 'primary' : 'outline'}
                style={{ fontSize: '0.95rem', padding: '0.5rem 0.8rem' }}
              >
                {concepts[key].title}
              </button>
            ))}
          </div>

          {/* Concept Detail */}
          <div style={{ flex: 1, background: 'var(--surface)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>{concepts[activeConcept].title}</h4>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              {concepts[activeConcept].desc}
            </p>
            <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.75rem', marginTop: '0.75rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              <strong>Did You Know?</strong> {concepts[activeConcept].didYouKnow}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', minHeight: '60px' }}>
        {gunasCompleted && (
          <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '1rem 2rem', borderRadius: '8px', color: 'var(--success)', fontWeight: 'bold', fontSize: '1rem' }}>
            Review Complete! Click "Proceed to next" in the bottom right corner.
          </div>
        )}
      </div>
    </div>
  );
}
