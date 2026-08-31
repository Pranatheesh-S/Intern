import React, { useState } from 'react';
import { Calendar, ShoppingCart, Flower2, Send, Trophy, Target, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import './theme.css';

export default function RealLifeMathLab({ 
  currentSlide = 1,
  labSelectedCenter, setLabSelectedCenter,
  labKgPotatoes, setLabKgPotatoes,
  labKgTomatoes, setLabKgTomatoes,
  labSelectedFlower, setLabSelectedFlower,
  labViralRounds, setLabViralRounds,
  checkoutStep = 0,
  onTriggerCheckout
}) {
  const calendarDays = Array.from({ length: 35 }, (_, i) => i + 1);
  const isValidCenter = labSelectedCenter > 7 && labSelectedCenter < 29 && (labSelectedCenter % 7 !== 1) && (labSelectedCenter % 7 !== 0);
  const safeCenter = isValidCenter ? labSelectedCenter : 16;
  const sRow = Math.floor((safeCenter - 1) / 7);
  const sCol = (safeCenter - 1) % 7;

  const boxIndices = [
    (sRow - 1) * 7 + (sCol - 1), (sRow - 1) * 7 + sCol, (sRow - 1) * 7 + (sCol + 1),
    sRow * 7 + (sCol - 1),       sRow * 7 + sCol,       sRow * 7 + (sCol + 1),
    (sRow + 1) * 7 + (sCol - 1), (sRow + 1) * 7 + sCol, (sRow + 1) * 7 + (sCol + 1)
  ];
  const boxValues = boxIndices.map(i => calendarDays[i]);
  const boxSum = boxValues.reduce((a, b) => a + b, 0);

  // Calendar mystery target mini-game
  const [magicTargetSum, setMagicTargetSum] = useState(144); // 16 * 9
  const [magicGameWon, setMagicGameWon] = useState(false);

  const handleSelectDay = (day) => {
    const r = Math.floor((day - 1) / 7);
    const c = (day - 1) % 7;
    if (r >= 1 && r <= 3 && c >= 1 && c <= 5) {
      setLabSelectedCenter(day);
      if (day * 9 === magicTargetSum) {
        setMagicGameWon(true);
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
          const possibleCenters = [9, 10, 11, 12, 16, 17, 18, 19, 23, 24, 25, 26];
          const newCenter = possibleCenters[Math.floor(Math.random() * possibleCenters.length)];
          setMagicTargetSum(newCenter * 9);
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              The 3×3 Calendar Magic Window
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              Select any interior date on the calendar. The cumulative sum of all 9 dates enclosed inside the $3 \times 3$ window is invariantly equal to <strong>9 × Center Date</strong>, because opposite paired dates cancel deviations symmetrically.
            </p>
          </div>

          {/* Mini-Game Target Challenge Bar */}
          <div style={{ background: 'var(--theme-badge-bg, #ccfbf1)', padding: '0.65rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} color="var(--theme-primary, #0d9488)" />
              <span style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>
                Mystery Challenge: Click the center date that sums to <strong>{magicTargetSum}</strong>!
              </span>
            </div>
            {magicGameWon ? (
              <span style={{ background: '#22c55e', color: '#ffffff', padding: '0.3rem 0.85rem', borderRadius: '8px', fontWeight: '900', fontSize: '0.88rem' }}>
                🎉 Solved! {magicTargetSum} / 9 = {safeCenter}
              </span>
            ) : (
              <span style={{ background: '#ffffff', color: 'var(--theme-primary-dark, #0f766e)', padding: '0.3rem 0.85rem', borderRadius: '8px', fontWeight: '900', fontSize: '0.85rem', border: '1px solid var(--theme-border, #a7f3d0)' }}>
                Hint: Target ÷ 9
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '0.85rem' }}>
            <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '14px', border: '1.8px solid var(--theme-border, #a7f3d0)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                {['M','T','W','T','F','S','S'].map((d, i) => <span key={i} style={{ fontSize: '0.78rem', fontWeight: '900', color: '#64748b' }}>{d}</span>)}
                {calendarDays.map(day => {
                  const isCenter = day === safeCenter;
                  const isInBox = boxValues.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => handleSelectDay(day)}
                      style={{
                        height: '24px',
                        fontSize: '0.78rem',
                        fontWeight: isCenter ? '900' : '700',
                        borderRadius: '6px',
                        border: 'none',
                        background: isCenter ? 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))' : isInBox ? 'var(--theme-badge-bg, #ccfbf1)' : '#f8fafc',
                        color: isCenter ? '#ffffff' : isInBox ? 'var(--theme-primary-dark, #0f766e)' : '#0f172a',
                        cursor: 'pointer',
                        padding: 0,
                        boxShadow: isCenter ? 'var(--theme-btn-shadow, 0 2px 8px rgba(13, 148, 136, 0.35))' : 'none'
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '14px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', flexDirection: 'column', gap: '0.4rem', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', textAlign: 'center' }}>
                Symmetric Pairs Example
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.3rem', width: '100%' }}>
                {[
                  [safeCenter - 8, safeCenter + 8],
                  [safeCenter - 7, safeCenter + 7],
                  [safeCenter - 6, safeCenter + 6],
                  [safeCenter - 1, safeCenter + 1]
                ].map((pair, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '0.2rem 0.3rem', borderRadius: '6px', fontSize: '0.75rem', textAlign: 'center', fontWeight: '700', color: '#475569', border: '1px solid #e2e8f0' }}>
                    {pair[0]} + {pair[1]} = <span style={{ color: 'var(--theme-primary, #0d9488)', fontWeight: '900' }}>{pair[0] + pair[1]}</span>
                  </div>
                ))}
              </div>
              
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '800', textAlign: 'center', marginTop: '0.1rem' }}>
                4 Pairs ({4 * 2 * safeCenter}) + Center ({safeCenter}) = {boxSum}
              </div>

              <div style={{ fontSize: '0.95rem', color: '#15803d', fontWeight: '900', background: '#dcfce7', padding: '0.35rem 0.65rem', borderRadius: '8px', border: '1px solid #86efac', textAlign: 'center', marginTop: '0.15rem' }}>
                9 × {safeCenter} = {9 * safeCenter} ✨
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 2: GROCERY MARKET */}
      {currentSlide === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Market Grocery Billing & Arithmetic Progressions
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              Every supermarket receipt applies linear progression: Total Cost = Unit Rate × Quantity. Adjust produce weights to evaluate billing arithmetic:
            </p>
          </div>

          {/* Arithmetic Progression Example Box */}
          <div style={{ background: '#ffffff', padding: '0.7rem 0.8rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1, justifyContent: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)' }}>
              Sequence Rule: Add Unit Rate (₹30 or ₹50) per kg
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginRight: '0.3rem', width: '50px' }}>🥔 ₹30:</span>
                {[30, 60, 90, 120, 150, 180, 210].map((val, i) => {
                  const kg = i + 1;
                  const isSelected = labKgPotatoes === kg;
                  return (
                    <span key={i} style={{ 
                      padding: '0.2rem 0.4rem', 
                      borderRadius: '8px', 
                      background: isSelected ? 'var(--theme-primary, #0d9488)' : '#f1f5f9', 
                      color: isSelected ? '#ffffff' : '#334155', 
                      fontWeight: isSelected ? '900' : '700',
                      fontSize: '0.85rem',
                      boxShadow: isSelected ? '0 3px 8px rgba(13, 148, 136, 0.4)' : 'none',
                      transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.25s ease',
                      zIndex: isSelected ? 2 : 1
                    }}>
                      {val}
                    </span>
                  );
                })}
                <span style={{ padding: '0.1rem', color: '#64748b', fontWeight: '800', fontSize: '0.8rem' }}>...</span>
              </div>
              
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', marginRight: '0.3rem', width: '50px' }}>🍅 ₹50:</span>
                {[50, 100, 150, 200, 250, 300, 350].map((val, i) => {
                  const kg = i + 1;
                  const isSelected = labKgTomatoes === kg;
                  return (
                    <span key={i} style={{ 
                      padding: '0.2rem 0.4rem', 
                      borderRadius: '8px', 
                      background: isSelected ? '#ef4444' : '#f1f5f9', 
                      color: isSelected ? '#ffffff' : '#334155', 
                      fontWeight: isSelected ? '900' : '700',
                      fontSize: '0.85rem',
                      boxShadow: isSelected ? '0 3px 8px rgba(239, 68, 68, 0.4)' : 'none',
                      transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.25s ease',
                      zIndex: isSelected ? 2 : 1
                    }}>
                      {val}
                    </span>
                  );
                })}
                <span style={{ padding: '0.1rem', color: '#64748b', fontWeight: '800', fontSize: '0.8rem' }}>...</span>
              </div>
            </div>
            
            <div style={{ fontSize: '0.8rem', color: 'var(--theme-heading, #134e4a)', fontWeight: '800', marginTop: '0.1rem', textAlign: 'center' }}>
              At <span style={{ color: 'var(--theme-primary, #0d9488)' }}>{labKgPotatoes}kg</span> potatoes & <span style={{ color: '#ef4444' }}>{labKgTomatoes}kg</span> tomatoes: 
              <br/> Total = <span style={{ fontWeight: '900' }}>₹{(labKgPotatoes * 30)} + ₹{(labKgTomatoes * 50)} = ₹{(labKgPotatoes * 30) + (labKgTomatoes * 50)}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div style={{ background: '#ffffff', padding: '0.85rem 1.15rem', borderRadius: '14px', border: '1.8px solid var(--theme-border, #a7f3d0)' }}>
              <div style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>🥔 Russet Potatoes (₹30/kg)</div>
              <input type="range" min="1" max="10" value={labKgPotatoes} onChange={e => setLabKgPotatoes(parseInt(e.target.value, 10))} style={{ width: '100%', accentColor: 'var(--theme-primary, #0d9488)', margin: '0.5rem 0' }} />
              <div style={{ fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.95rem' }}>{labKgPotatoes} kg = ₹{labKgPotatoes * 30}</div>
            </div>

            <div style={{ background: '#ffffff', padding: '0.85rem 1.15rem', borderRadius: '14px', border: '1.8px solid var(--theme-border, #a7f3d0)' }}>
              <div style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>🍅 Heirloom Tomatoes (₹50/kg)</div>
              <input type="range" min="1" max="10" value={labKgTomatoes} onChange={e => setLabKgTomatoes(parseInt(e.target.value, 10))} style={{ width: '100%', accentColor: 'var(--theme-primary, #0d9488)', margin: '0.5rem 0' }} />
              <div style={{ fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.95rem' }}>{labKgTomatoes} kg = ₹{labKgTomatoes * 50}</div>
            </div>
          </div>

          <button 
            onClick={() => {
              onTriggerCheckout?.();
              confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
            }}
            style={{ 
              background: checkoutStep > 0 ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))', 
              padding: '0.95rem 1.35rem', 
              borderRadius: '14px', 
              fontWeight: '900', 
              color: '#ffffff', 
              fontSize: '1.18rem', 
              textAlign: 'center', 
              boxShadow: 'var(--theme-btn-shadow, 0 4px 16px rgba(13, 148, 136, 0.35))',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              transition: 'all 0.2s ease'
            }}>
            <span>🧾 {checkoutStep > 0 ? 'Reprint Total Store Receipt' : 'Total Store Receipt'}: ₹{labKgPotatoes * 30 + labKgTomatoes * 50}</span>
          </button>
        </div>
      )}

      {/* SLIDE 3: NATURE FLOWERS */}
      {currentSlide === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Virahānka Fibonacci Numbers in Botanical Anatomy
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              Petal counts in flowering plants overwhelmingly belong to the Virahānka sequence ($3, 5, 8, 13, 21 \dots$) because the golden angle packing optimizes sunlight exposure for every petal:
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
              Powers of 2: The Chessboard Doubling Legend & Viral Reach
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.96rem', color: '#334155', lineHeight: 1.55, textAlign: 'justify', textJustify: 'inter-word' }}>
              In the celebrated Indian mathematical legend of the chessboard, placing 1 grain on square 1 and doubling each subsequent square (1 → 2 → 4 → 8 → 16 → … → 1024) shows how powers of 2 ($2^N$) grow at an astounding exponential velocity:
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
            💡 Notice: By Square 10 ($2^{10}$), you already exceed one thousand units (1,024 grains), and by the 64th square, the total grains exceed 18 quintillion ($2^{64}-1$)!
          </div>
        </div>
      )}
    </div>
  );
}
