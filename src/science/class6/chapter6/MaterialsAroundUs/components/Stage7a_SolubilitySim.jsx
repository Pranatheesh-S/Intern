/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Droplets, Target, Camera } from 'lucide-react';

import sugarVid from '../../../../../assets/sugar_soluble.mp4';
import saltVid from '../../../../../assets/salt_soluble.mp4';
import chalkVid from '../../../../../assets/chalk_insoluble.mp4';
import sandVid from '../../../../../assets/sand_insoluble.mp4';
import sawdustVid from '../../../../../assets/sawdust_insoluble.mp4';

const materialVideos = {
  sugar: sugarVid,
  salt: saltVid,
  chalk: chalkVid,
  sand: sandVid,
  sawdust: sawdustVid
};

export default function Stage7a_SolubilitySim({ onComplete, addXp }) {
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const [stirState, setStirState] = useState('idle'); // idle, stirring (video playing), resolved
  const [observations, setObservations] = useState({});
  const videoRef = useRef(null);

  const substances = [
    { 
      id: 'sugar', name: 'Sugar', type: 'Soluble', image: '/images/solubility_sugar.png',
      desc: 'Sugar completely disappears when stirred into water.',
      conclusion: 'Materials that dissolve in water are called Soluble.',
      waterColor: '#7dd3fc', turbidity: 0, solidVisible: false
    },
    { 
      id: 'salt', name: 'Salt', type: 'Soluble', image: '/images/solubility_salt.png',
      desc: 'Salt completely disappears when stirred into water.',
      conclusion: 'Materials that dissolve in water are called Soluble.',
      waterColor: '#7dd3fc', turbidity: 0, solidVisible: false
    },
    { 
      id: 'chalk', name: 'Chalk Powder', type: 'Insoluble', image: '/images/solubility_chalk.png',
      desc: 'The water turns cloudy and chalk powder does not disappear.',
      conclusion: 'Materials that do not dissolve in water are Insoluble.',
      waterColor: '#f1f5f9', turbidity: 0.8, solidVisible: true, solidColor: '#f1f5f9', settle: false
    },
    { 
      id: 'sand', name: 'Sand', type: 'Insoluble', image: '/images/solubility_sand.png',
      desc: 'Sand settles down at the bottom of the beaker.',
      conclusion: 'Sand is Insoluble in water.',
      waterColor: '#7dd3fc', turbidity: 0.2, solidVisible: true, solidColor: '#eab308', settle: true
    },
    { 
      id: 'sawdust', name: 'Sawdust', type: 'Insoluble', image: '/images/solubility_sawdust.png',
      desc: 'Sawdust floats on the surface of the water.',
      conclusion: 'Sawdust is Insoluble in water.',
      waterColor: '#7dd3fc', turbidity: 0.1, solidVisible: true, solidColor: '#d97706', float: true
    }
  ];

  const handleSelect = (sub) => {
    setSelectedSubstance(sub);
    setStirState('stirring');
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
    }
  };

  const handleVideoEnd = () => {
    setStirState('resolved');
    if (!observations[selectedSubstance.id]) {
      setObservations(prev => ({ ...prev, [selectedSubstance.id]: true }));
      addXp(15);
    }
  };

  const obsCount = Object.keys(observations).length;
  const isComplete = obsCount === substances.length;

  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', color: 'var(--lesson-text)' }}>
      
      {/* Header */}
      <div style={{ background: 'var(--lesson-background)', border: '1px solid var(--lesson-border)', borderRadius: '16px', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--heading-main)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold' }}>
            <Search size={32} color="var(--lesson-accent)" /> Phase 1: Solubility Simulator
          </h3>
          <p style={{ margin: 0, fontSize: '1.15rem', color: 'var(--heading-sub)', fontWeight: '500' }}>
            Activity 6.7: Let us explore how different materials behave when we mix them in water.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'white', border: '1px solid #D9C9A3', borderRadius: '12px', padding: '12px 18px', position: 'relative', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '1rem', color: 'var(--lesson-primary)', fontWeight: '600' }}>Does everything dissolve?</div>
            <div style={{ fontSize: '1rem', color: 'var(--lesson-primary)', fontWeight: '600' }}>Add to water, then stir!</div>
            <div style={{ position: 'absolute', right: '-8px', top: '24px', width: '16px', height: '16px', background: 'white', borderRight: '1px solid #d6d3d1', borderBottom: '1px solid #d6d3d1', transform: 'rotate(-45deg)' }} />
          </div>
          <img src="/images/chief_detective_blake.png" alt="Chief" style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--lesson-border)' }}>
        
        {/* Left Side: Experiment */}
        <div style={{ flex: '1 1 50%', minWidth: 0, maxWidth: '50%', padding: '1.5rem', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--lesson-border)', boxSizing: 'border-box' }}>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '2rem' }}>
              Materials to Test
            </h3>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', alignContent: 'start', justifyItems: 'center', width: '100%' }}>
              {substances.map((sub) => {
                const isSelected = selectedSubstance?.id === sub.id;
                const isObserved = observations[sub.id];
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSelect(sub)}
                    style={{
                      background: isSelected ? 'var(--lesson-surface)' : 'white',
                      border: `2px solid ${isSelected ? '#A64B27' : 'var(--lesson-border)'}`,
                      color: isSelected ? 'var(--lesson-primary)' : 'var(--lesson-text)',
                      padding: '1.5rem 1rem',
                      borderRadius: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '1rem',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 4px 15px rgba(166, 75, 39, 0.2)' : '0 4px 10px rgba(0,0,0,0.05)',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      width: '100%',
                      maxWidth: '220px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                      <div style={{ width: '100%', height: '100%', background: '#FFFFFF', borderRadius: '50%', padding: '12px', border: '1px solid var(--lesson-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                        <img src={sub.image} alt={sub.name} style={{ width: '55px', height: '55px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                      </div>
                      {isObserved && (
                        <div style={{ position: 'absolute', top: -5, right: -5, background: '#A64B27', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>✓</div>
                      )}
                    </div>
                    <span style={{ fontSize: '1.1rem', textAlign: 'center', lineHeight: '1.3', width: '100%', wordWrap: 'break-word' }}>{sub.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Observation Console */}
        <div style={{ flex: '1 1 50%', minWidth: 0, maxWidth: '50%', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--heading-section)', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--lesson-border)', paddingBottom: '1rem', fontSize: '1.75rem' }}>
            <Camera size={28} color="var(--lesson-accent)" /> Observation Console
          </h4>
          
          <AnimatePresence mode="wait">
            {selectedSubstance && stirState === 'resolved' ? (
              <motion.div
                key={selectedSubstance.id + stirState}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--lesson-background)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--lesson-border)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ color: '#A64B27', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Material</div>
                  <div style={{ fontSize: '1.5rem', color: 'var(--lesson-primary)', fontWeight: 'bold' }}>{selectedSubstance.name}</div>
                </div>

                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #D9C9A3', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ color: 'var(--heading-section)', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Observation</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 'bold', color: selectedSubstance.type === 'Soluble' ? 'var(--lesson-success)' : 'var(--lesson-accent)' }}>
                    {selectedSubstance.type === 'Soluble' ? 'Disappears in water' : 'Does not disappear'}
                  </div>
                  <div style={{ color: '#44403c', fontSize: '1.1rem', lineHeight: '1.5' }}>
                    {selectedSubstance.desc}
                  </div>
                </div>

                <div style={{ background: selectedSubstance.type === 'Soluble' ? 'var(--lesson-success-bg)' : 'var(--lesson-background)', borderRadius: '12px', padding: '1.5rem', border: `1px solid ${selectedSubstance.type === 'Soluble' ? 'var(--lesson-success-border)' : 'var(--lesson-border)'}`, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ color: selectedSubstance.type === 'Soluble' ? '#A64B27' : '#A64B27', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Conclusion</div>
                  <div style={{ color: selectedSubstance.type === 'Soluble' ? '#14532d' : 'var(--lesson-primary)', fontSize: '1.25rem', lineHeight: '1.5', fontWeight: 'bold' }}>
                    {selectedSubstance.conclusion}
                  </div>
                </div>
              </motion.div>
            ) : selectedSubstance && stirState === 'stirring' ? (
              <motion.div 
                key="video-playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0, position: 'relative', background: 'transparent' }}
              >
                <video
                  ref={videoRef}
                  src={materialVideos[selectedSubstance.id]}
                  autoPlay
                  muted
                  playsInline
                  onEnded={handleVideoEnd}
                  style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: '12px', border: '1px solid var(--lesson-border)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                />
              </motion.div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: '#78716c', textAlign: 'center', border: '2px dashed #d6d3d1', borderRadius: '12px', padding: '2rem', background: '#FFFFFF' }}>
                <div style={{ background: 'white', padding: '15px', borderRadius: '50%', border: '1px solid var(--lesson-border)' }}>
                  <Droplets size={40} color="#a8a29e" />
                </div>
                <span style={{ fontSize: '1.1rem' }}>Select a material and stir to observe its solubility.</span>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Footer Progress */}
      <div style={{ 
        background: 'var(--lesson-background)', 
        border: '1px solid var(--lesson-border)', 
        borderRadius: '12px', 
        padding: '12px 24px', 
        minHeight: '64px',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#A64B27' }}>
          <div style={{ background: 'var(--lesson-warning-bg)', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={20} />
          </div>
          <span style={{ color: 'var(--lesson-primary)', fontSize: '1.05rem', fontWeight: 'bold' }}>Test all 5 materials to see if they are soluble or insoluble.</span>
        </div>

        <div style={{ 
          fontSize: '1rem', 
          fontWeight: 'bold', 
          color: obsCount === substances.length ? '#A64B27' : 'var(--lesson-secondary)',
          background: obsCount === substances.length ? 'var(--lesson-success-bg)' : '#f5f5f4',
          padding: '6px 12px',
          borderRadius: '16px',
          border: `1px solid ${obsCount === substances.length ? 'var(--lesson-success-border)' : 'var(--lesson-border)'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {obsCount === substances.length && <span>✓</span>}
          {obsCount} / {substances.length} Tested
        </div>
      </div>

    </div>
  );
}

Stage7a_SolubilitySim.propTypes = {
  onComplete: PropTypes.func.isRequired,
  addXp: PropTypes.func
};
