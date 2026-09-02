import React, { useState } from 'react';
import { ArrowRightLeft, Users, Hexagon, Triangle, Plus, UserPlus, Trophy, Circle } from 'lucide-react';
import confetti from 'canvas-confetti';
import './theme.css';

export default function ShapesToNumbers({ 
  currentSlide = 1,
  s2nShapeSides, setS2NShapeSides,
  s2nPeopleCount, setS2NPeopleCount,
  s2nTriRows, setS2NTriRows,
  s2nKochIter, setS2NKochIter
}) {
  const [interactivePeople, setInteractivePeople] = useState(4);

  const handleAddPerson = () => {
    if (interactivePeople < 8) {
      setInteractivePeople(prev => prev + 1);
      confetti({ particleCount: 30, spread: 55, origin: { y: 0.6 } });
    } else {
      setInteractivePeople(3);
    }
  };

  const interactiveHandshakes = (interactivePeople * (interactivePeople - 1)) / 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', justifyContent: 'space-between' }}>
      {/* SLIDE 1: POLYGONS SIDES = VERTICES */}
      {false && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Bridge 1: Regular Polygons ⟷ Counting Numbers
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              In any simple polygon, the number of sides is always exactly the same as the number of corners! Move the slider to see how the sides and corners match up:
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '0.75rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Hexagon size={24} color="var(--theme-primary, #0d9488)" />
            <span style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>Sides (N) = {s2nShapeSides}:</span>
            <input
              type="range"
              min="3"
              max="8"
              value={s2nShapeSides}
              onChange={(e) => setS2NShapeSides(parseInt(e.target.value, 10))}
              style={{ flex: 1, accentColor: 'var(--theme-primary, #0d9488)' }}
            />
            <span style={{ fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.95rem' }}>
              {s2nShapeSides} Corners
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem' }}>
            {[
              { name: 'Triangle', sides: 3 },
              { name: 'Quadrilateral', sides: 4 },
              { name: 'Pentagon', sides: 5 },
              { name: 'Hexagon', sides: 6 },
            ].map(p => (
              <div key={p.name} style={{ background: s2nShapeSides === p.sides ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff', padding: '0.65rem 1rem', borderRadius: '10px', border: s2nShapeSides === p.sides ? '2px solid var(--theme-primary, #0d9488)' : '1.5px solid var(--theme-border, #a7f3d0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)' }}>
                <span style={{ fontWeight: '900', color: 'var(--theme-heading, #134e4a)', fontSize: '0.88rem' }}>{p.name}</span>
                <span style={{ fontSize: '0.88rem', color: 'var(--theme-primary, #0d9488)', fontWeight: '900' }}>{p.sides} Edges</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--theme-bg, #f0fdfa)', padding: '0.75rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', color: 'var(--theme-heading, #134e4a)', fontWeight: '800', fontSize: '0.92rem', textAlign: 'justify', textJustify: 'inter-word' }}>
            ✅ Rule: Because every corner joins exactly two sides, the number of corners is always equal to the number of sides (Corners = Sides).
          </div>
        </div>
      )}

      {/* SLIDE 2: COMPLETE GRAPHS & HANDSHAKES MINI-GAME */}
      {false && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Bridge 2: The Handshake Network & Triangular Numbers
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              If $N$ friends meet up and everyone shakes hands with everyone else exactly once, the total number of handshakes is a Triangular Number! You can find it using the formula $N \times (N - 1) \div 2$.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '0.75rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Users size={24} color="var(--theme-primary, #0d9488)" />
            <span style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>People N = {s2nPeopleCount}:</span>
            <input
              type="range"
              min="2"
              max="7"
              value={s2nPeopleCount}
              onChange={(e) => setS2NPeopleCount(parseInt(e.target.value, 10))}
              style={{ flex: 1, accentColor: 'var(--theme-primary, #0d9488)' }}
            />
            <span style={{ fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.95rem' }}>
              {(s2nPeopleCount * (s2nPeopleCount - 1)) / 2} Handshakes
            </span>
          </div>

          {/* Interactive Network Simulator Bar */}
          <div style={{ background: '#ffffff', padding: '0.75rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={18} color="var(--theme-primary, #0d9488)" />
              <span style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>Interactive Party Size: {interactivePeople} People</span>
            </div>
            <button
              onClick={handleAddPerson}
              style={{ padding: '0.4rem 1rem', borderRadius: '8px', background: 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))', color: '#ffffff', border: 'none', fontWeight: '900', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', boxShadow: 'var(--theme-btn-shadow, 0 4px 14px rgba(13, 148, 136, 0.35))' }}
            >
              <Plus size={14} /> Add Attendee
            </button>
            <span style={{ background: 'var(--theme-badge-bg, #ccfbf1)', padding: '0.35rem 0.85rem', borderRadius: '8px', fontWeight: '900', color: 'var(--theme-badge-text, #0f766e)', fontSize: '0.95rem' }}>
              {interactiveHandshakes} Chords (T_{interactivePeople - 1})
            </span>
          </div>

          <div style={{ background: 'var(--theme-bg, #f0fdfa)', padding: '0.75rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)', fontWeight: '800', textAlign: 'justify', textJustify: 'inter-word' }}>
            Calculation: {Array.from({ length: s2nPeopleCount - 1 }).map((_, i) => s2nPeopleCount - 1 - i).join(' + ')} = {(s2nPeopleCount * (s2nPeopleCount - 1)) / 2} (Triangular Number T_{s2nPeopleCount - 1})
          </div>
        </div>
      )}

      {/* SLIDE 3: STACKED TRIANGLES TO SQUARES */}
      {currentSlide === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Bridge 3: Stacking Wooden Blocks ⟷ Square Numbers
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              If you build a square using wooden blocks on a desk, each new L-shaped layer needs the next odd number of blocks (1, 3, 5, 7...). Adding them up always makes a perfect square!
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '0.75rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Hexagon size={24} color="var(--theme-primary, #0d9488)" />
            <span style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>Square Size = {s2nTriRows}x{s2nTriRows}:</span>
            <input
              type="range"
              min="1"
              max="6"
              value={s2nTriRows}
              onChange={(e) => setS2NTriRows(parseInt(e.target.value, 10))}
              style={{ flex: 1, accentColor: 'var(--theme-primary, #0d9488)' }}
            />
            <span style={{ fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.95rem' }}>
              {s2nTriRows * s2nTriRows} Blocks
            </span>
          </div>

          {/* Odd Numbers to Squares Sequence Example Box */}
          <div style={{ background: '#ffffff', padding: '0.85rem 1.15rem', borderRadius: '14px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem', flex: 1, justifyContent: 'center' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', textAlign: 'center' }}>
              Sequence Rule: Summing Consecutive Odd Numbers
            </div>
            
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', minHeight: '3rem' }}>
              {[1, 3, 5, 7, 9, 11].map((num, i) => {
                const tier = i + 1;
                const isSelected = tier <= s2nTriRows;
                const isCurrent = tier === s2nTriRows;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {isSelected && i > 0 && <span style={{ color: 'var(--theme-primary, #0d9488)', fontWeight: '900', fontSize: '1rem' }}>+</span>}
                    <span style={{ 
                      padding: '0.35rem 0.65rem', 
                      borderRadius: '10px', 
                      background: isSelected ? (isCurrent ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'var(--theme-badge-bg, #ccfbf1)') : '#f8fafc', 
                      color: isSelected ? (isCurrent ? '#ffffff' : 'var(--theme-primary-dark, #0f766e)') : '#94a3b8', 
                      fontWeight: isSelected ? '900' : '700',
                      fontSize: '1rem',
                      boxShadow: isCurrent ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none',
                      transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      border: isSelected && !isCurrent ? '1.5px solid var(--theme-border, #a7f3d0)' : isCurrent ? '1.5px solid transparent' : '1px solid #e2e8f0',
                      zIndex: isCurrent ? 10 : 1
                    }}>
                      {num}
                    </span>
                  </div>
                )
              })}
              <span style={{ padding: '0.2rem', color: '#64748b', fontWeight: '900', fontSize: '1rem', marginLeft: '0.3rem' }}>...</span>
            </div>
            
            <div style={{ fontSize: '0.88rem', color: '#475569', fontWeight: '800', marginTop: '0.3rem', textAlign: 'center', background: '#f1f5f9', padding: '0.6rem 1rem', borderRadius: '10px', width: '100%' }}>
              Sum of first <span style={{ color: 'var(--theme-primary, #0d9488)', fontWeight: '900' }}>{s2nTriRows} odd numbers</span> = <span style={{ color: '#d97706', fontWeight: '900', fontSize: '1.1rem' }}>{s2nTriRows * s2nTriRows}</span>
              <div style={{ color: '#15803d', fontWeight: '900', fontSize: '1rem', marginTop: '0.35rem' }}>
                Which is exactly {s2nTriRows}² ✨
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 4: KOCH SNOWFLAKE FORMULA */}
      {currentSlide === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Bridge 4: Koch Snowflake ↔ 3 × Powers of 4
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              In each step of drawing the Koch Snowflake, every straight line splits into 4 smaller lines. This means the total number of lines multiplies by 4 every single time!
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '0.75rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>Depth Iteration k = {s2nKochIter}:</span>
            <input
              type="range"
              min="0"
              max="4"
              value={s2nKochIter}
              onChange={(e) => setS2NKochIter(parseInt(e.target.value, 10))}
              style={{ flex: 1, accentColor: 'var(--theme-primary, #0d9488)' }}
            />
            <span style={{ fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.95rem' }}>
              {3 * Math.pow(4, s2nKochIter)} Segments
            </span>
          </div>

          {/* Koch Snowflake Sequence Example Box */}
          <div style={{ background: '#ffffff', padding: '0.85rem 1.15rem', borderRadius: '14px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem', flex: 1, justifyContent: 'center' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', textAlign: 'center' }}>
              Sequence Rule: Multiply by 4 each Iteration
            </div>
            
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', minHeight: '3rem' }}>
              {[3, 12, 48, 192, 768].map((num, i) => {
                const isSelected = i <= s2nKochIter;
                const isCurrent = i === s2nKochIter;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {isSelected && i > 0 && <span style={{ color: 'var(--theme-primary, #0d9488)', fontWeight: '900', fontSize: '1rem', marginTop: '0.1rem' }}>×4</span>}
                    <span style={{ 
                      padding: '0.35rem 0.65rem', 
                      borderRadius: '10px', 
                      background: isSelected ? (isCurrent ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'var(--theme-badge-bg, #ccfbf1)') : '#f8fafc', 
                      color: isSelected ? (isCurrent ? '#ffffff' : 'var(--theme-primary-dark, #0f766e)') : '#94a3b8', 
                      fontWeight: isSelected ? '900' : '700',
                      fontSize: '1rem',
                      boxShadow: isCurrent ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none',
                      transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      border: isSelected && !isCurrent ? '1.5px solid var(--theme-border, #a7f3d0)' : isCurrent ? '1.5px solid transparent' : '1px solid #e2e8f0',
                      zIndex: isCurrent ? 10 : 1
                    }}>
                      {num}
                    </span>
                  </div>
                )
              })}
              <span style={{ padding: '0.2rem', color: '#64748b', fontWeight: '900', fontSize: '1rem', marginLeft: '0.3rem' }}>...</span>
            </div>
            
            <div style={{ fontSize: '0.88rem', color: '#475569', fontWeight: '800', marginTop: '0.3rem', textAlign: 'center', background: '#f1f5f9', padding: '0.6rem 1rem', borderRadius: '10px', width: '100%' }}>
              Iteration <span style={{ color: 'var(--theme-primary, #0d9488)', fontWeight: '900' }}>k = {s2nKochIter}</span> ➜ <span style={{ color: '#d97706', fontWeight: '900', fontSize: '1.1rem' }}>{3 * Math.pow(4, s2nKochIter)} Segments</span>
              <div style={{ color: '#15803d', fontWeight: '900', fontSize: '1rem', marginTop: '0.35rem' }}>
                Formula: 3 × 4<sup style={{fontSize:'0.75rem', fontWeight:'900'}}>k</sup> ✨
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
