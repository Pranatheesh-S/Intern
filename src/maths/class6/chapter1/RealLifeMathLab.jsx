import React, { useState, useMemo } from 'react';
import { Calendar, ShoppingCart, Flower2, Send, Trophy, Target, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CALENDAR_MAGIC_DATASET, getMonthCalendarGrid, getValidCentersForMonth, GROCERY_MARKET_DATASET } from './data';
import './theme.css';

export default function RealLifeMathLab({ 
  currentSlide = 1,
  labMonthIdx = 0, setLabMonthIdx = () => {},
  labCartIdx = 0, setLabCartIdx = () => {},
  labSelectedCenter, setLabSelectedCenter,
  labKgPotatoes, setLabKgPotatoes,
  labKgTomatoes, setLabKgTomatoes,
  labSelectedFlower, setLabSelectedFlower,
  labViralRounds, setLabViralRounds,
  checkoutStep = 0,
  onTriggerCheckout
}) {
  const currentMonth = CALENDAR_MAGIC_DATASET[labMonthIdx] || CALENDAR_MAGIC_DATASET[0];
  const grid = useMemo(() => getMonthCalendarGrid(currentMonth), [currentMonth]);
  const validCenters = useMemo(() => getValidCentersForMonth(currentMonth), [currentMonth]);

  const centerInfo = useMemo(() => {
    const found = validCenters.find(c => c.day === labSelectedCenter);
    if (found) return found;
    return validCenters.find(c => c.day === currentMonth.defaultCenter) || validCenters[0] || {
      day: 16,
      row: 2,
      col: 3,
      sum: 144,
      boxValues: [],
      pairs: []
    };
  }, [validCenters, labSelectedCenter, currentMonth]);

  const safeCenter = centerInfo.day;
  const boxValues = centerInfo.boxValues || [];
  const boxSum = centerInfo.sum;
  const pairs = centerInfo.pairs || [];

  // Calendar mystery target mini-game
  const [magicTargetSum, setMagicTargetSum] = useState(144); // 16 * 9
  const [magicGameWon, setMagicGameWon] = useState(false);

  const handleSelectDay = (day) => {
    const isVal = validCenters.some(c => c.day === day);
    if (isVal) {
      setLabSelectedCenter(day);
      if (day * 9 === magicTargetSum) {
        setMagicGameWon(true);
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
          const remainingTargets = currentMonth.mysteryTargets.filter(t => t !== magicTargetSum);
          const nextTarget = remainingTargets.length > 0 
            ? remainingTargets[Math.floor(Math.random() * remainingTargets.length)]
            : validCenters[Math.floor(Math.random() * validCenters.length)].sum;
          setMagicTargetSum(nextTarget);
          setMagicGameWon(false);
        }, 1800);
      }
    }
  };

  const FLOWERS = {
    lily: { name: 'White Lily', petals: 3, img: '🌸' },
    buttercup: { name: 'Buttercup', petals: 5, img: '🌼' },
    delphinium: { name: 'Delphinium', petals: 8, img: '🌺' },
    marigold: { name: 'Marigold', petals: 13, img: '🌻' }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', justifyContent: 'space-between' }}>
      {/* SLIDE 1: CALENDAR MAGIC & MYSTERY TARGET GAME */}
      {currentSlide === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
                The 3×3 Calendar Magic Window
              </h3>
              <span style={{ fontSize: '0.72rem', background: '#ccfbf1', color: '#0f766e', padding: '2px 8px', borderRadius: '10px', fontWeight: '900', border: '1px solid #99f6e4' }}>
                9 × Center Date Rule
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.86rem', color: '#334155', lineHeight: 1.45, textAlign: 'justify' }}>
              Click any valid center date on the calendar. If you add up all 9 dates in the $3 \times 3$ window around it, the total is always exactly <strong>9 times the center date</strong>!
              This happens because opposite dates balance each other out across the center.
            </p>
          </div>

          {/* Dataset Month Switcher Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#475569', textTransform: 'uppercase' }}>
              Select Calendar:
            </span>
            {CALENDAR_MAGIC_DATASET.map((m, idx) => {
              const isSelected = labMonthIdx === idx;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setLabMonthIdx(idx);
                    setLabSelectedCenter(m.defaultCenter);
                    setMagicTargetSum(m.mysteryTargets[0]);
                    setMagicGameWon(false);
                  }}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '12px',
                    border: isSelected ? '1.5px solid var(--theme-primary, #0d9488)' : '1.5px solid #cbd5e1',
                    background: isSelected ? 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#334155',
                    fontWeight: '800',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: isSelected ? '0 2px 6px rgba(13, 148, 136, 0.3)' : 'none'
                  }}
                >
                  <span>{m.icon}</span>
                  <span>{m.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* Mini-Game Target Challenge Bar */}
          <div style={{ background: 'var(--theme-badge-bg, #ccfbf1)', padding: '0.45rem 0.85rem', borderRadius: '10px', border: '1.5px solid var(--theme-border, #a7f3d0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Target size={18} color="var(--theme-primary, #0d9488)" />
              <span style={{ fontWeight: '900', fontSize: '0.82rem', color: 'var(--theme-heading, #134e4a)' }}>
                Mystery Challenge: Click the center date that sums to <strong>{magicTargetSum}</strong>!
              </span>
            </div>
            {magicGameWon ? (
              <span style={{ background: '#22c55e', color: '#ffffff', padding: '0.2rem 0.65rem', borderRadius: '6px', fontWeight: '900', fontSize: '0.78rem' }}>
                🎉 Solved! {magicTargetSum} ÷ 9 = {safeCenter}
              </span>
            ) : (
              <span style={{ background: '#ffffff', color: 'var(--theme-primary-dark, #0f766e)', padding: '0.2rem 0.65rem', borderRadius: '6px', fontWeight: '900', fontSize: '0.76rem', border: '1px solid var(--theme-border, #a7f3d0)' }}>
                Hint: Target ÷ 9
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '0.65rem' }}>
            {/* 2D Real-Month Calendar Grid */}
            <div style={{ background: '#ffffff', padding: '0.6rem', borderRadius: '12px', border: '1.5px solid var(--theme-border, #a7f3d0)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: '900', color: currentMonth.headerColor }}>
                  {currentMonth.name} ({currentMonth.daysInMonth} Days)
                </span>
                <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '700' }}>
                  Center: <strong>{safeCenter}</strong>
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', textAlign: 'center' }}>
                {['M','T','W','T','F','S','S'].map((d, i) => (
                  <span key={i} style={{ fontSize: '0.72rem', fontWeight: '900', color: '#64748b' }}>{d}</span>
                ))}
                {grid.map((row, rIdx) =>
                  row.map((day, cIdx) => {
                    if (day === null) {
                      return <div key={`null-${rIdx}-${cIdx}`} style={{ height: '22px' }} />;
                    }
                    const isCenter = day === safeCenter;
                    const isInBox = boxValues.includes(day);
                    const isValidC = validCenters.some(c => c.day === day);

                    return (
                      <button
                        key={`d-${day}`}
                        onClick={() => handleSelectDay(day)}
                        disabled={!isValidC}
                        title={isValidC ? `Click to center on ${day}` : `Border date (cannot be center of 3x3)`}
                        style={{
                          height: '22px',
                          fontSize: '0.72rem',
                          fontWeight: isCenter ? '900' : isInBox ? '800' : '600',
                          borderRadius: '5px',
                          border: isCenter ? '1.5px solid #d97706' : 'none',
                          background: isCenter 
                            ? 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))' 
                            : isInBox 
                            ? 'var(--theme-badge-bg, #ccfbf1)' 
                            : isValidC 
                            ? '#f8fafc' 
                            : '#f1f5f9',
                          color: isCenter ? '#ffffff' : isInBox ? 'var(--theme-primary-dark, #0f766e)' : isValidC ? '#0f172a' : '#94a3b8',
                          cursor: isValidC ? 'pointer' : 'default',
                          padding: 0,
                          boxShadow: isCenter ? 'var(--theme-btn-shadow, 0 2px 8px rgba(13, 148, 136, 0.35))' : 'none',
                          opacity: isValidC || isInBox ? 1 : 0.6
                        }}
                      >
                        {day}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Quick Center Selectors */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap', paddingTop: '0.2rem', borderTop: '1px dashed #e2e8f0' }}>
                <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: '800' }}>Valid Centers:</span>
                {validCenters.slice(0, 6).map(vc => (
                  <button
                    key={`quick-${vc.day}`}
                    onClick={() => handleSelectDay(vc.day)}
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: vc.day === safeCenter ? '900' : '700',
                      padding: '1px 6px',
                      borderRadius: '5px',
                      border: vc.day === safeCenter ? '1px solid #0d9488' : '1px solid #e2e8f0',
                      background: vc.day === safeCenter ? '#0d9488' : '#f8fafc',
                      color: vc.day === safeCenter ? '#ffffff' : '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    {vc.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Symmetric Pairs & Mathematical Proof Card */}
            <div style={{ background: '#ffffff', padding: '0.55rem 0.75rem', borderRadius: '12px', border: '1.5px solid var(--theme-border, #a7f3d0)', display: 'flex', flexDirection: 'column', gap: '0.35rem', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', textAlign: 'center' }}>
                4 Symmetrical Pairs Across Center {safeCenter}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.25rem', width: '100%' }}>
                {pairs.map((p, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '0.2rem 0.35rem', borderRadius: '6px', fontSize: '0.7rem', textAlign: 'center', fontWeight: '700', color: '#475569', border: `1px solid ${p.color}40`, borderLeft: `3px solid ${p.color}` }}>
                    {p.a} + {p.b} = <strong style={{ color: p.color }}>{p.pairSum}</strong>
                  </div>
                ))}
              </div>
              
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '800', textAlign: 'center' }}>
                4 Pairs ({4 * 2 * safeCenter}) + Center ({safeCenter}) = {boxSum}
              </div>

              <div style={{ fontSize: '0.88rem', color: '#15803d', fontWeight: '900', background: '#dcfce7', padding: '0.3rem 0.55rem', borderRadius: '8px', border: '1px solid #86efac', textAlign: 'center' }}>
                9 × {safeCenter} = {9 * safeCenter} ✨
              </div>

              <div style={{ fontSize: '0.68rem', color: '#64748b', background: '#f8fafc', padding: '0.3rem 0.45rem', borderRadius: '6px', textAlign: 'justify', lineHeight: 1.35 }}>
                💡 <strong>Why?</strong> Each opposite pair has $(C - k)$ and $(C + k)$. When added together, the $+k$ and $-k$ cancel out to give exactly $2C$!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 2: GROCERY MARKET */}
      {currentSlide === 2 && (() => {
        const activeCart = GROCERY_MARKET_DATASET[labCartIdx] || GROCERY_MARKET_DATASET[0];
        const item1 = activeCart.item1;
        const item2 = activeCart.item2;
        const cost1 = labKgPotatoes * item1.rate;
        const cost2 = labKgTomatoes * item2.rate;
        const totalBill = cost1 + cost2;
        const totalWeight = labKgPotatoes + labKgTomatoes;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', height: '100%', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
                  Market Grocery Billing & Arithmetic Progressions
                </h3>
                <span style={{ fontSize: '0.72rem', background: '#ccfbf1', color: '#0f766e', padding: '2px 8px', borderRadius: '10px', fontWeight: '900', border: '1px solid #99f6e4' }}>
                  Constant Rate (AP) Rule
                </span>
              </div>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.86rem', color: '#334155', lineHeight: 1.45, textAlign: 'justify' }}>
                When buying produce by the kilogram, the total cost increases by the exact same unit price for every extra kg added. This constant increase forms an <strong>Arithmetic Progression (AP)</strong>!
              </p>
            </div>

            {/* Produce Cart Selection Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#475569', textTransform: 'uppercase' }}>
                Market Produce Cart:
              </span>
              {GROCERY_MARKET_DATASET.map((cart, idx) => {
                const isSelected = labCartIdx === idx;
                return (
                  <button
                    key={cart.id}
                    onClick={() => {
                      setLabCartIdx(idx);
                      setLabKgPotatoes(cart.item1.defaultKg);
                      setLabKgTomatoes(cart.item2.defaultKg);
                    }}
                    style={{
                      padding: '0.22rem 0.55rem',
                      borderRadius: '12px',
                      border: isSelected ? '1.5px solid var(--theme-primary, #0d9488)' : '1.5px solid #cbd5e1',
                      background: isSelected ? 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#334155',
                      fontWeight: '800',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: isSelected ? '0 2px 6px rgba(13, 148, 136, 0.3)' : 'none'
                    }}
                  >
                    <span>{cart.icon}</span>
                    <span>{cart.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Arithmetic Progression Sequence Display */}
            <div style={{ background: '#ffffff', padding: '0.55rem 0.75rem', borderRadius: '12px', border: '1.5px solid var(--theme-border, #a7f3d0)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)' }}>
                AP Pattern: Repeated Addition of Unit Rate
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '100%', alignItems: 'center' }}>
                {/* Item 1 Sequence */}
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#475569', minWidth: '70px', textAlign: 'right' }}>
                    {item1.emoji} ₹{item1.rate}/kg:
                  </span>
                  {item1.apSequence.slice(0, 7).map((val, i) => {
                    const kg = i + 1;
                    const isSelected = labKgPotatoes === kg;
                    return (
                      <span key={`ap1-${i}`} style={{
                        padding: '0.15rem 0.35rem',
                        borderRadius: '6px',
                        background: isSelected ? 'var(--theme-primary, #0d9488)' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#334155',
                        fontWeight: isSelected ? '900' : '700',
                        fontSize: '0.76rem',
                        boxShadow: isSelected ? '0 2px 6px rgba(13, 148, 136, 0.4)' : 'none',
                        transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }}>
                        ₹{val}
                      </span>
                    );
                  })}
                  <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>...</span>
                </div>

                {/* Item 2 Sequence */}
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#475569', minWidth: '70px', textAlign: 'right' }}>
                    {item2.emoji} ₹{item2.rate}/kg:
                  </span>
                  {item2.apSequence.slice(0, 7).map((val, i) => {
                    const kg = i + 1;
                    const isSelected = labKgTomatoes === kg;
                    return (
                      <span key={`ap2-${i}`} style={{
                        padding: '0.15rem 0.35rem',
                        borderRadius: '6px',
                        background: isSelected ? '#ef4444' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#334155',
                        fontWeight: isSelected ? '900' : '700',
                        fontSize: '0.76rem',
                        boxShadow: isSelected ? '0 2px 6px rgba(239, 68, 68, 0.4)' : 'none',
                        transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                        transition: 'all 0.2s ease'
                      }}>
                        ₹{val}
                      </span>
                    );
                  })}
                  <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>...</span>
                </div>
              </div>

              <div style={{ fontSize: '0.76rem', color: 'var(--theme-heading, #134e4a)', fontWeight: '800', textAlign: 'center' }}>
                At <span style={{ color: 'var(--theme-primary, #0d9488)' }}>{labKgPotatoes} kg {item1.shortName}</span> & <span style={{ color: '#ef4444' }}>{labKgTomatoes} kg {item2.shortName}</span>:
                {' '}Total = <strong style={{ color: '#0f766e' }}>₹{cost1} + ₹{cost2} = ₹{totalBill}</strong>
              </div>
            </div>

            {/* Produce Sliders Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
              <div style={{ background: '#ffffff', padding: '0.65rem 0.95rem', borderRadius: '12px', border: '1.5px solid var(--theme-border, #a7f3d0)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '900', fontSize: '0.84rem', color: 'var(--theme-heading, #134e4a)' }}>
                    {item1.emoji} {item1.name}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>₹{item1.rate}/kg</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={labKgPotatoes}
                  onChange={e => setLabKgPotatoes(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: 'var(--theme-primary, #0d9488)', margin: '0.35rem 0' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.86rem' }}>
                    {labKgPotatoes} kg
                  </span>
                  <span style={{ fontWeight: '900', color: '#0d9488', fontSize: '0.88rem' }}>
                    = ₹{cost1}
                  </span>
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '0.65rem 0.95rem', borderRadius: '12px', border: '1.5px solid var(--theme-border, #a7f3d0)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '900', fontSize: '0.84rem', color: 'var(--theme-heading, #134e4a)' }}>
                    {item2.emoji} {item2.name}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700' }}>₹{item2.rate}/kg</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={labKgTomatoes}
                  onChange={e => setLabKgTomatoes(parseInt(e.target.value, 10))}
                  style={{ width: '100%', accentColor: '#ef4444', margin: '0.35rem 0' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '900', color: '#b91c1c', fontSize: '0.86rem' }}>
                    {labKgTomatoes} kg
                  </span>
                  <span style={{ fontWeight: '900', color: '#ef4444', fontSize: '0.88rem' }}>
                    = ₹{cost2}
                  </span>
                </div>
              </div>
            </div>

            {/* Real Farm & Botanical Dataset Specs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.45rem',
              background: '#f8fafc',
              padding: '0.4rem 0.65rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              fontSize: '0.72rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontWeight: '800', color: '#0f766e' }}>
                  🌱 {item1.name} (<em>{item1.variety}</em>)
                </span>
                <span style={{ color: '#64748b' }}>
                  📍 Origin: {item1.origin} • ⚖️ ~{item1.unitWeight} • 🥗 {item1.nutrition}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontWeight: '800', color: '#b91c1c' }}>
                  🌱 {item2.name} (<em>{item2.variety}</em>)
                </span>
                <span style={{ color: '#64748b' }}>
                  📍 Origin: {item2.origin} • ⚖️ ~{item2.unitWeight} • 🥗 {item2.nutrition}
                </span>
              </div>
            </div>

            {/* Print Store Receipt Button */}
            <button 
              onClick={() => {
                onTriggerCheckout?.();
                confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
              }}
              style={{ 
                background: checkoutStep > 0 ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))', 
                padding: '0.75rem 1.15rem', 
                borderRadius: '12px', 
                fontWeight: '900', 
                color: '#ffffff', 
                fontSize: '1.05rem', 
                textAlign: 'center', 
                boxShadow: 'var(--theme-btn-shadow, 0 4px 14px rgba(13, 148, 136, 0.35))',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}>
              <span>🧾 {checkoutStep > 0 ? 'Reprint Total Store Receipt' : 'Print Total Store Receipt'}: ₹{totalBill}</span>
            </button>
          </div>
        );
      })()}

      {/* SLIDE 3: NATURE FLOWERS */}
      {currentSlide === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Fibonacci Numbers in Nature
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              Did you know that the number of petals on most flowers follows a special math pattern called the Fibonacci sequence (3, 5, 8, 13, 21...)? This helps the flower get the most sunlight!
            </p>
          </div>

          {/* Fibonacci Sequence Example Box */}
          <div style={{ background: '#ffffff', padding: '0.8rem 1rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)' }}>
              Sequence Rule: Add the previous two numbers
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              {[1, 1, 2, 3, 5, 8, 13, 21].map((num, i) => {
                const isSelected = FLOWERS[labSelectedFlower]?.petals === num;
                return (
                  <span key={i} style={{ 
                    padding: '0.25rem 0.55rem', 
                    borderRadius: '8px', 
                    background: isSelected ? 'var(--theme-primary, #0d9488)' : '#f1f5f9', 
                    color: isSelected ? '#ffffff' : '#334155', 
                    fontWeight: isSelected ? '900' : '700',
                    fontSize: '0.95rem',
                    boxShadow: isSelected ? '0 3px 10px rgba(13, 148, 136, 0.4)' : 'none',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.25s ease'
                  }}>
                    {num}
                  </span>
                )
              })}
              <span style={{ padding: '0.2rem', color: '#64748b', fontWeight: '800', fontSize: '0.9rem' }}>...</span>
            </div>
            
            <div style={{ fontSize: '0.85rem', color: 'var(--theme-heading, #134e4a)', fontWeight: '800', marginTop: '0.2rem', textAlign: 'center', height: '2rem' }}>
              {labSelectedFlower && FLOWERS[labSelectedFlower] ? (
                <>
                  The {FLOWERS[labSelectedFlower].name} has {FLOWERS[labSelectedFlower].petals} petals <br/>
                  <span style={{ color: 'var(--theme-primary, #0d9488)', fontWeight: '900' }}>
                    ({FLOWERS[labSelectedFlower].petals === 3 ? '1 + 2 = 3' : FLOWERS[labSelectedFlower].petals === 5 ? '2 + 3 = 5' : FLOWERS[labSelectedFlower].petals === 8 ? '3 + 5 = 8' : '5 + 8 = 13'})
                  </span>
                </>
              ) : (
                <span style={{ color: '#64748b' }}>Select a flower below to see its pattern.</span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
            {Object.keys(FLOWERS).map(k => (
              <button
                key={k}
                onClick={() => setLabSelectedFlower(k)}
                style={{
                  padding: '0.85rem 0.55rem',
                  borderRadius: '14px',
                  border: labSelectedFlower === k ? '2.5px solid var(--theme-primary, #0d9488)' : '1.8px solid var(--theme-border, #a7f3d0)',
                  background: labSelectedFlower === k ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: labSelectedFlower === k ? 'var(--theme-btn-shadow, 0 4px 14px rgba(13, 148, 136, 0.25))' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ fontSize: '1.9rem' }}>{FLOWERS[k].img}</div>
                <div style={{ fontWeight: '900', fontSize: '0.88rem', color: 'var(--theme-heading, #134e4a)' }}>{FLOWERS[k].name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--theme-primary, #0d9488)', fontWeight: '900' }}>{FLOWERS[k].petals} Petals</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SLIDE 4: EXPONENTIAL DOUBLING & POWERS OF 2 */}
      {currentSlide === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Powers of 2: The Chessboard Legend
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.96rem', color: '#334155', lineHeight: 1.55, textAlign: 'justify', textJustify: 'inter-word' }}>
              There is an old Indian legend about a king who agreed to put 1 grain of rice on the first square of a chessboard, and then double it on every next square (1 → 2 → 4 → 8 → 16...). This shows how fast powers of 2 ($2^N$) can grow!
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '0.75rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>Step N = {labViralRounds}:</span>
            <input
              type="range"
              min="0"
              max="10"
              value={labViralRounds}
              onChange={e => setLabViralRounds(parseInt(e.target.value, 10))}
              style={{ flex: 1, accentColor: 'var(--theme-primary, #0d9488)' }}
            />
            <span style={{ fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '1.05rem', minWidth: '130px', textAlign: 'right' }}>
              2^{labViralRounds} = {Math.pow(2, labViralRounds)}
            </span>
          </div>

          {/* Quick Exponential Jumps Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem' }}>
            {[
              { exp: '2⁰', val: 1, label: '1st Square' },
              { exp: '2³', val: 8, label: '4th Square' },
              { exp: '2⁶', val: 64, label: '7th Square' },
              { exp: '2¹⁰', val: 1024, label: '11th Square' },
            ].map(item => (
              <button
                key={item.exp}
                onClick={() => setLabViralRounds(item.exp === '2⁰' ? 0 : item.exp === '2³' ? 3 : item.exp === '2⁶' ? 6 : 10)}
                style={{
                  padding: '0.45rem 0.5rem',
                  borderRadius: '10px',
                  border: labViralRounds === (item.exp === '2⁰' ? 0 : item.exp === '2³' ? 3 : item.exp === '2⁶' ? 6 : 10) ? '2px solid var(--theme-primary, #0d9488)' : '1.5px solid var(--theme-border, #a7f3d0)',
                  background: labViralRounds === (item.exp === '2⁰' ? 0 : item.exp === '2³' ? 3 : item.exp === '2⁶' ? 6 : 10) ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff',
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div style={{ fontWeight: '900', fontSize: '0.86rem', color: 'var(--theme-heading, #134e4a)' }}>{item.exp} = {item.val}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.label}</div>
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--theme-bg, #f0fdfa)', padding: '0.65rem 1.05rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', fontSize: '0.88rem', color: 'var(--theme-heading, #134e4a)', fontWeight: '800', lineHeight: 1.45 }}>
            💡 Notice: By the 11th square ($2^{10}$), you already have over 1,000 grains of rice. By the 64th square, you would have over 18 quintillion grains! That's more rice than in the entire world!
          </div>
        </div>
      )}
    </div>
  );
}
