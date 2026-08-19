import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';

import imgTumblerCloth from '../images/b3_tumbler_cloth.png';
import imgTumblerPaper from '../images/b3_tumbler_paper.png';
import imgTumblerGlass from '../images/b3_tumbler_glass.png';
import imgTumblerMetal from '../images/b3_tumbler_metal.png';
import imgPotPaper from '../images/b3_pot_paper.png';
import imgPotMetal from '../images/b3_pot_metal.png';

export default function Stage5_Suitability({ onComplete, addXp }) {
  // Tumbler state
  const [tumblerMaterial, setTumblerMaterial] = useState(null);
  const [tumblerTested, setTumblerTested] = useState(false);
  const [tumblerSuccess, setTumblerSuccess] = useState(false);

  // Pot state
  const [potMaterial, setPotMaterial] = useState(null);
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
    let imgSrc = null;
    let animateProps = {};
    if (tumblerMaterial === 'cloth') {
      imgSrc = imgTumblerCloth;
      animateProps = { y: [0, 5, -5, 0], transition: { duration: 0.4 } };
    } else if (tumblerMaterial === 'paper') {
      imgSrc = imgTumblerPaper;
      animateProps = { scale: [1, 0.95, 1], transition: { duration: 0.4 } };
    } else if (tumblerMaterial === 'glass') {
      imgSrc = imgTumblerGlass;
      animateProps = { scale: [0.8, 1], opacity: [0, 1], transition: { duration: 0.5 } };
    } else if (tumblerMaterial === 'metal') {
      imgSrc = imgTumblerMetal;
      animateProps = { scale: [0.8, 1], opacity: [0, 1], transition: { duration: 0.5 } };
    }

    if (!imgSrc) return null;

    return (
      <motion.img 
        key={tumblerMaterial}
        src={imgSrc} 
        alt={`Tumbler made of ${tumblerMaterial}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, ...animateProps }}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    );
  };

  const renderPotAnimation = () => {
    let imgSrc = null;
    let animateProps = {};
    if (potMaterial === 'paper') {
      imgSrc = imgPotPaper;
      animateProps = { x: [-5, 5, -5, 5, 0], transition: { duration: 0.4 } };
    } else if (potMaterial === 'metal') {
      imgSrc = imgPotMetal;
      animateProps = { scale: [0.8, 1], opacity: [0, 1], transition: { duration: 0.5 } };
    }

    if (!imgSrc) return null;

    return (
      <motion.img 
        key={potMaterial}
        src={imgSrc} 
        alt={`Pot made of ${potMaterial}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, ...animateProps }}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Intro */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={22} style={{ color: 'var(--accent)' }} /> Activity 6.3: Let Us Think (Material Suitability)
        </h3>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Why is a window made of glass and not wood? Why is a cooking pot made of metal and not paper? 
          We choose materials based on their <strong>properties</strong> and the <strong>purpose</strong> of the object.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
        {/* Tumbler Designer */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>1. Storing Water: The Tumbler Test</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {['cloth', 'paper', 'glass', 'metal'].map((mat) => (
              <button
                key={mat}
                onClick={() => handleTumblerTest(mat)}
                className={tumblerMaterial === mat ? 'outline active' : 'outline'}
                style={{ textTransform: 'capitalize', padding: '0.5rem 0.8rem', fontSize: '1rem' }}
              >
                {mat}
              </button>
            ))}
          </div>

          <div style={{ height: '370px', minHeight: '350px', background: 'var(--neutral-bg)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0.5rem', boxSizing: 'border-box' }}>
            {tumblerMaterial ? renderTumblerAnimation() : <span style={{ fontSize: '1rem', color: '#64748b' }}>Select a tumbler material</span>}
          </div>

          <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5', minHeight: '52px', display: 'flex', alignItems: 'center' }}>
            {tumblerMaterial === 'cloth' && <span style={{ color: 'var(--danger)' }}><strong>Leakage!</strong> Cloth has porous holes. Water slips through instantly.</span>}
            {tumblerMaterial === 'paper' && <span style={{ color: 'var(--danger)' }}><strong>Collapse!</strong> Paper absorbs water and loses structural strength.</span>}
            {(tumblerMaterial === 'glass' || tumblerMaterial === 'metal') && <span style={{ color: 'var(--success)' }}><strong>Perfect!</strong> Glass and Metal are non-porous and hold liquids perfectly.</span>}
          </div>
        </div>

        {/* Stove Cooking pot */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.15rem' }}>2. Direct Flame: The Cooking Pot</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {['paper', 'metal'].map((mat) => (
              <button
                key={mat}
                onClick={() => handlePotTest(mat)}
                className={potMaterial === mat ? 'outline active' : 'outline'}
                style={{ textTransform: 'capitalize', padding: '0.5rem 0.8rem', fontSize: '1rem' }}
              >
                {mat === 'paper' ? 'Paper Pot' : 'Stainless Steel Pot'}
              </button>
            ))}
          </div>

          <div style={{ height: '370px', minHeight: '350px', background: 'var(--neutral-bg)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0.5rem', boxSizing: 'border-box' }}>
            {potMaterial ? renderPotAnimation() : <span style={{ fontSize: '1rem', color: '#64748b' }}>Select a pot material</span>}
          </div>

          <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.5', minHeight: '52px', display: 'flex', alignItems: 'center' }}>
            {potMaterial === 'paper' && <span style={{ color: 'var(--danger)' }}><strong>Danger!</strong> Paper is combustible and catches fire easily.</span>}
            {potMaterial === 'metal' && <span style={{ color: 'var(--success)' }}><strong>Safe!</strong> Stainless steel is fire-resistant and conducts heat perfectly.</span>}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem', minHeight: '50px' }}>
        <AnimatePresence>
          {isCompleted && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '1rem 2rem', borderRadius: '8px', color: 'var(--success)', fontWeight: 'bold', fontSize: '1rem' }}
            >
              Tests Complete! Click "Proceed to next" in the top right.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

