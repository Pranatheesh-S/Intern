import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';

import vidTumblerCloth from '../../../../../assets/3.cloth_tumbler.mp4';
import vidTumblerPaper from '../../../../../assets/3.paper_tumbler.mp4';
import vidTumblerGlass from '../../../../../assets/3.glass_tumbler.mp4';
import vidTumblerMetal from '../../../../../assets/3.steel_tumbler.mp4';
import vidPotPaper from '../../../../../assets/3.paper_pot.mp4';
import vidPotMetal from '../../../../../assets/3.steel_pot.mp4';

export default function Stage5_Suitability({ onComplete, addXp }) {
  // Tumbler state
  const [tumblerMaterial, setTumblerMaterial] = useState('cloth');
  const [tumblerTested, setTumblerTested] = useState(false);
  const [tumblerSuccess, setTumblerSuccess] = useState(false);

  // Pot state
  const [potMaterial, setPotMaterial] = useState('paper');
  const [potTested, setPotTested] = useState(false);
  const [potSuccess, setPotSuccess] = useState(false);

  const handleTumblerTest = (mat) => {
    setTumblerMaterial(mat);
    setTumblerTested(true);
    if (mat === 'glass' || mat === 'metal') {
      if (!tumblerSuccess) {
        setTumblerSuccess(true);
        addXp(15);
      }
    }
  };

  const handlePotTest = (mat) => {
    setPotMaterial(mat);
    setPotTested(true);
    if (mat === 'metal') {
      if (!potSuccess) {
        setPotSuccess(true);
        addXp(15);
      }
    }
  };

  const renderTumblerAnimation = () => {
    let vidSrc = null;
    if (tumblerMaterial === 'cloth') {
      vidSrc = vidTumblerCloth;
    } else if (tumblerMaterial === 'paper') {
      vidSrc = vidTumblerPaper;
    } else if (tumblerMaterial === 'glass') {
      vidSrc = vidTumblerGlass;
    } else if (tumblerMaterial === 'metal') {
      vidSrc = vidTumblerMetal;
    }

    if (!vidSrc) return null;

    return (
      <motion.video 
        key={tumblerMaterial}
        src={vidSrc} 
        autoPlay
        loop
        muted
        disablePictureInPicture
        playsInline
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  };

  const renderPotAnimation = () => {
    let vidSrc = null;
    if (potMaterial === 'paper') {
      vidSrc = vidPotPaper;
    } else if (potMaterial === 'metal') {
      vidSrc = vidPotMetal;
    }

    if (!vidSrc) return null;

    return (
      <motion.video 
        key={potMaterial}
        src={vidSrc} 
        autoPlay
        loop
        muted
        disablePictureInPicture
        playsInline
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  };

  const isCompleted = tumblerSuccess && potSuccess;

  useEffect(() => {
    if (isCompleted) {
      onComplete();
    }
  }, [isCompleted, onComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Intro */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--lesson-accent-border)', flex: '0 0 auto' }}>
        <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--heading-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={22} style={{ color: 'var(--lesson-accent)' }} /> Activity 6.3: Let Us Think (Material Suitability)
        </h3>
        <p style={{ margin: 0, fontSize: '1.45rem', color: 'var(--heading-sub)', lineHeight: '1.4' }}>
          Why are windows made of glass and cooking pots made of metal? We choose materials based on their properties and purpose.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'stretch', flex: '1 1 auto', minHeight: 0 }}>
        {/* Tumbler Designer */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid var(--lesson-border)', minHeight: 0 }}>
          <div style={{ borderBottom: '1px solid var(--lesson-border)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: '0 0 auto' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.9rem' }}>1. Storing Water: The Tumbler Test</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flex: '0 0 auto' }}>
            {['cloth', 'paper', 'glass', 'metal'].map((mat) => (
              <button
                key={mat}
                onClick={() => handleTumblerTest(mat)}
                className={tumblerMaterial === mat ? 'outline active' : 'outline'}
                style={{ textTransform: 'capitalize', padding: '0.5rem 0.8rem', fontSize: '1.45rem' }}
              >
                {mat}
              </button>
            ))}
          </div>

          <div style={{ flex: '1 1 auto', minHeight: 0, background: 'var(--neutral-bg)', border: '1px solid var(--lesson-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {tumblerMaterial ? renderTumblerAnimation() : <span style={{ fontSize: '1.45rem', color: 'var(--lesson-muted)' }}>Select a tumbler material</span>}
          </div>

          <div style={{ fontSize: '1.45rem', color: 'var(--lesson-secondary)', lineHeight: '1.4', minHeight: '60px', display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
            {tumblerMaterial === 'cloth' && <span style={{ color: 'var(--lesson-danger)' }}><strong>Leakage!</strong> Cloth has porous holes. Water slips through instantly.</span>}
            {tumblerMaterial === 'paper' && <span style={{ color: 'var(--lesson-danger)' }}><strong>Collapse!</strong> Paper absorbs water and loses structural strength.</span>}
            {(tumblerMaterial === 'glass' || tumblerMaterial === 'metal') && <span style={{ color: 'var(--lesson-success)' }}><strong>Perfect!</strong> Glass and Metal are non-porous and hold liquids perfectly.</span>}
          </div>
        </div>

        {/* Stove Cooking pot */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid var(--lesson-border)', minHeight: 0 }}>
          <div style={{ borderBottom: '1px solid var(--lesson-border)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: '0 0 auto' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.9rem' }}>2. Direct Flame: The Cooking Pot</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flex: '0 0 auto' }}>
            {['paper', 'metal'].map((mat) => (
              <button
                key={mat}
                onClick={() => handlePotTest(mat)}
                className={potMaterial === mat ? 'outline active' : 'outline'}
                style={{ textTransform: 'capitalize', padding: '0.5rem 0.8rem', fontSize: '1.45rem' }}
              >
                {mat === 'paper' ? 'Paper Pot' : 'Stainless Steel Pot'}
              </button>
            ))}
          </div>

          <div style={{ flex: '1 1 auto', minHeight: 0, background: 'var(--neutral-bg)', border: '1px solid var(--lesson-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {potMaterial ? renderPotAnimation() : <span style={{ fontSize: '1.45rem', color: 'var(--lesson-muted)' }}>Select a pot material</span>}
          </div>

          <div style={{ fontSize: '1.45rem', color: 'var(--lesson-secondary)', lineHeight: '1.4', minHeight: '60px', display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
            {potMaterial === 'paper' && <span style={{ color: 'var(--lesson-danger)' }}><strong>Danger!</strong> Paper is combustible and catches fire easily.</span>}
            {potMaterial === 'metal' && <span style={{ color: 'var(--lesson-success)' }}><strong>Safe!</strong> Stainless steel is fire-resistant and conducts heat perfectly.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

