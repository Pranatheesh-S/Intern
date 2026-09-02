import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, HelpCircle, Check, Award, Weight } from 'lucide-react';

export default function Stage7_SolubilityMatter({ onComplete, addXp, mode = 'both' }) {
  // Solubility state
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const [stirState, setStirState] = useState('idle'); // 'idle', 'stirring', 'resolved'
  const [solubilityResults, setSolubilityResults] = useState({});

  // ORS state
  const [orsIngredients, setOrsIngredients] = useState({ sugar: 0, salt: 0 });
  const [orsResult, setOrsResult] = useState(null);

  // Mass state
  const [weighedCup, setWeighedCup] = useState(null);

  // Volume state
  const [volumeSelect, setVolumeSelect] = useState(null);

  const substances = [
    { id: 'sugar', name: 'Sugar', correct: 'Soluble', desc: 'Disappears completely. Dissolves in water.', effectColor: 'rgba(255,255,255,0.1)' },
    { id: 'salt', name: 'Salt', correct: 'Soluble', desc: 'Disappears completely. Dissolves in water.', effectColor: 'rgba(255,255,255,0.1)' },
    { id: 'chalk', name: 'Chalk Powder', correct: 'Insoluble', desc: 'Water turns turbid/cloudy. Chalk powder does not disappear.', effectColor: 'var(--lesson-border)' },
    { id: 'sand', name: 'Sand', correct: 'Insoluble', desc: 'Settles down at the bottom of the beaker.', effectColor: 'var(--lesson-warning)' },
    { id: 'sawdust', name: 'Sawdust', correct: 'Insoluble', desc: 'Floats on the surface of the water, does not dissolve.', effectColor: 'var(--lesson-accent)' }
  ];

  const cups = [
    { id: 'water', name: 'Cup A (Water)', mass: '120g' },
    { id: 'sand', name: 'Cup B (Sand)', mass: '250g' },
    { id: 'pebbles', name: 'Cup C (Pebbles)', mass: '380g' }
  ];

  const handleStir = () => {
    if (!selectedSubstance) return;
    setStirState('stirring');

    setTimeout(() => {
      setStirState('resolved');
      setSolubilityResults(prev => ({ ...prev, [selectedSubstance.id]: selectedSubstance.correct }));
      addXp(10);
    }, 1500);
  };

  const handleMixOrs = () => {
    if (orsIngredients.sugar === 6 && orsIngredients.salt === 1) {
      setOrsResult('perfect');
      addXp(20);
    } else {
      setOrsResult('incorrect');
    }
  };

  const allSolubilityTested = Object.keys(solubilityResults).length === substances.length;
  const orsCompleted = orsResult === 'perfect';
  const massTested = weighedCup !== null;
  const volumeTested = volumeSelect !== null;

  const isCompleted = mode === 'solubility' ? (allSolubilityTested && orsCompleted) : mode === 'matter' ? (massTested && volumeTested) : (allSolubilityTested && orsCompleted && massTested && volumeTested);

  useEffect(() => {
    if (isCompleted) {
      onComplete();
    }
  }, [isCompleted, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Intro */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--lesson-accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--lesson-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Beaker size={22} style={{ color: 'var(--lesson-accent)' }} /> 
          {mode === 'solubility' ? 'Solubility in Water' : mode === 'matter' ? 'What is Matter?' : '6.3.4 - 6.4: Solubility, Mass, Volume & Matter'}
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--lesson-secondary)', lineHeight: '1.5' }}>
          {mode === 'solubility' ? 'Let\'s explore solubility by testing if different substances dissolve in water.' : mode === 'matter' ? 'Let\'s explore mass (how heavy it is) and volume (space occupied).' : 'Let\'s explore chemical and physical properties: solubility in water, mass, and volume.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mode === 'both' ? '1fr 1fr' : '1fr', gap: '1.5rem', maxWidth: mode === 'both' ? '100%' : '600px', margin: '0 auto' }}>
        {/* Left: Solubility stirrer */}
        {(mode === 'solubility' || mode === 'both') && (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--lesson-border)' }}>
            <div style={{ borderBottom: '1px solid var(--lesson-border)', paddingBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>1. Beaker Solubility Tester</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
              {substances.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => { setSelectedSubstance(sub); setStirState('idle'); }}
                  className={selectedSubstance?.id === sub.id ? 'outline active' : 'outline'}
                  style={{ padding: '0.5rem 0.8rem', fontSize: '0.9rem' }}
                >
                  {sub.name} {solubilityResults[sub.id] ? '✓' : ''}
                </button>
              ))}
            </div>

            {/* Stirring beaker simulation */}
            <div 
              style={{ 
                height: '140px', 
                background: 'var(--lesson-text)', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                position: 'relative' 
              }}
            >
              {selectedSubstance ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%', height: '100%', position: 'relative' }}>
                  <svg width="60" height="80" viewBox="0 0 60 80" style={{ marginTop: '15px' }}>
                    {/* Beaker */}
                    <path d="M10,10 L10,70 Q10,75 15,75 L45,75 Q50,75 50,70 L50,10" fill="none" stroke="white" strokeWidth="3" />
                    {/* Water liquid */}
                    <rect 
                      x="12" y="35" width="36" height="38" rx="2" 
                      fill={stirState === 'resolved' && selectedSubstance.correct === 'Insoluble' ? selectedSubstance.effectColor : 'rgba(56, 189, 248, 0.4)'} 
                      style={{ transition: 'fill 0.5s' }}
                    />
                    {/* Stirring spoon */}
                    {stirState === 'stirring' && (
                      <motion.line 
                        x1="30" y1="15" x2="30" y2="55" 
                        stroke="var(--lesson-border)" strokeWidth="4" 
                        animate={{ x: [20, 40, 20], rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                      />
                    )}
                  </svg>

                  {stirState === 'idle' && (
                    <button 
                      onClick={handleStir} 
                      className="primary" 
                      style={{ position: 'absolute', bottom: '10px', padding: '0.4rem 0.9rem', fontSize: '0.9rem' }}
                    >
                      Stir Solution
                    </button>
                  )}

                  {stirState === 'resolved' && (
                    <div style={{ position: 'absolute', bottom: '5px', textAlign: 'center', fontSize: '0.9rem', color: 'white', padding: '0 0.5rem', lineHeight: '1.3' }}>
                      <strong style={{ color: selectedSubstance.correct === 'Soluble' ? '#34d399' : 'var(--lesson-warning)' }}>
                        {selectedSubstance.correct}!
                      </strong> {selectedSubstance.desc}
                    </div>
                  )}
                </div>
              ) : (
                <span style={{ fontSize: '1rem', color: 'var(--lesson-muted)' }}>Select a substance to mix</span>
              )}
            </div>

            {/* ORS Mini challenge */}
            <div style={{ background: 'var(--lesson-success-bg)', border: '1px solid var(--lesson-success-border)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <strong style={{ fontSize: '1rem', color: 'var(--lesson-success)' }}>Make ORS (Oral Rehydration Solution)</strong>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ fontSize: '0.95rem', color: 'var(--lesson-secondary)' }}>
                  Sugar: <strong>{orsIngredients.sugar} tsp</strong> (Needs 6) <br/>
                  Salt: <strong>{orsIngredients.salt} tsp</strong> (Needs 1)
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button onClick={() => setOrsIngredients(prev => ({ ...prev, sugar: Math.min(prev.sugar + 8, 8) }))} className="outline" style={{ padding: '0.4rem', fontSize: '0.9rem' }}>+Sugar</button>
                  <button onClick={() => setOrsIngredients(prev => ({ ...prev, salt: Math.min(prev.salt + 1, 3) }))} className="outline" style={{ padding: '0.4rem', fontSize: '0.9rem' }}>+Salt</button>
                  <button onClick={() => setOrsIngredients({ sugar: 0, salt: 0 })} className="outline" style={{ padding: '0.4rem', fontSize: '0.9rem' }}>Clear</button>
                </div>
              </div>
              <button onClick={handleMixOrs} className="success" style={{ padding: '0.5rem', fontSize: '0.95rem' }}>Prepare & Stir ORS</button>
              {orsResult === 'perfect' && <span style={{ fontSize: '0.95rem', color: 'var(--lesson-success)', fontWeight: 'bold' }}>✓ Perfect! 6 sugar + 1 salt in water forms life-saving ORS!</span>}
              {orsResult === 'incorrect' && <span style={{ fontSize: '0.95rem', color: 'var(--lesson-danger)' }}>Incorrect proportions, read the book instructions: 6 sugar, 1 salt!</span>}
            </div>
          </div>
        )}

        {/* Right: Mass, Volume and Matter definition */}
        {(mode === 'matter' || mode === 'both') && (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--lesson-border)' }}>
            <div style={{ borderBottom: '1px solid var(--lesson-border)', paddingBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>{mode === 'both' ? '2. Mass, Volume & Matter' : 'Mass, Volume & Matter'}</span>
            </div>

            {/* Weighing scale */}
            <div style={{ background: 'var(--lesson-surface)', padding: '0.75rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--lesson-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Weight size={18} /> Weighing Cup (Measure Mass)
              </span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {cups.map((c) => (
                  <button 
                    key={c.id} 
                    onClick={() => setWeighedCup(c)} 
                    className={weighedCup?.id === c.id ? 'outline active' : 'outline'}
                    style={{ padding: '0.5rem', fontSize: '0.9rem', flex: 1 }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              {weighedCup && (
                <div style={{ background: '#0b1329', padding: '0.75rem', borderRadius: '4px', textAlign: 'center', color: 'var(--lesson-success)', fontWeight: 'bold', fontSize: '1rem' }}>
                  Digital Balance: {weighedCup.mass} (Mass = quantity of matter)
                </div>
              )}
            </div>

            {/* Volume selection */}
            <div style={{ background: 'var(--lesson-surface)', padding: '0.75rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--lesson-primary)' }}>
                Occupied Space (Volume)
              </span>
              <p style={{ fontSize: '0.95rem', color: 'var(--lesson-secondary)', margin: 0, lineHeight: '1.4' }}>
                A half-filled glass tumbler contains less space representation of water than a fully-filled one. What is this occupied space?
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setVolumeSelect('wrong')} className={volumeSelect === 'wrong' ? 'danger' : 'outline'} style={{ flex: 1, padding: '0.5rem', fontSize: '0.95rem' }}>Mass</button>
                <button onClick={() => setVolumeSelect('correct')} className={volumeSelect === 'correct' ? 'success' : 'outline'} style={{ flex: 1, padding: '0.5rem', fontSize: '0.95rem' }}>Volume</button>
              </div>
            </div>

            {/* Definition of Matter */}
            {isCompleted && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ background: 'var(--lesson-accent-bg)', border: '1px solid var(--lesson-accent-border)', padding: '1rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                <strong style={{ fontSize: '1rem', color: 'var(--lesson-accent-text)' }}>Unified Definition of Matter:</strong>
                <p style={{ fontSize: '1rem', color: 'var(--lesson-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Everything that has <strong>mass</strong> (weighs something) and occupies <strong>space</strong> (volume) is called <strong>Matter</strong>. 
                  Gases (like oxygen in water) are also matter!
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', minHeight: '60px' }}>
        {isCompleted && (
          <div style={{ background: 'var(--lesson-success-bg)', border: '1px solid var(--lesson-success-border)', padding: '1rem 2rem', borderRadius: '8px', color: 'var(--lesson-success)', fontWeight: 'bold', fontSize: '1rem' }}>
            Lab Complete! Click "Proceed to next" in the bottom right corner.
          </div>
        )}
      </div>
    </div>
  );
}
