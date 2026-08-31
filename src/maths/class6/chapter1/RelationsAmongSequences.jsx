import React, { useState } from 'react';
import { Sparkles, Layers, Check, Trophy, Plus, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import './theme.css';

export default function RelationsAmongSequences({ currentSlide = 1 }) {
  const [oddN, setOddN] = useState(4);
  const [upDownN, setUpDownN] = useState(4);
  const [triN, setTriN] = useState(3);
  const [hexCubeN, setHexCubeN] = useState(3);

  // Dynamic harmonic palette for gnomons using pastel tones
  const gnomonColors = ['#0d9488', '#14b8a6', '#06b6d4', '#0284c7', '#3b82f6', '#6366f1', '#8b5cf6'];

  const handleSnapNextGnomon = () => {
    if (oddN < 6) {
      setOddN(prev => prev + 1);
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
    } else {
      setOddN(1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', justifyContent: 'space-between' }}>
      {/* SLIDE 1: ODD SUMS TO SQUARES & GNOMON MINI-GAME */}
      {currentSlide === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Why Adding Consecutive Odd Numbers Produces Square Numbers
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              Consecutive odd numbers ($1, 3, 5, 7, 9 \dots$) physically nest around expanding squares as L-shaped border bands (gnomons). Adding the $N$-th odd number ($2N - 1$) completes an exact $N \times N$ square, proving $1 + 3 + 5 + \dots + (2N - 1) = N^2$.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '0.65rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1 }}>
              <span style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>Odd Terms N = {oddN}:</span>
              <input
                type="range"
                min="1"
                max="6"
                value={oddN}
                onChange={(e) => setOddN(parseInt(e.target.value, 10))}
                style={{ flex: 1, accentColor: 'var(--theme-primary, #0d9488)' }}
              />
            </div>
            <button
              onClick={handleSnapNextGnomon}
              style={{ padding: '0.35rem 0.85rem', borderRadius: '8px', background: 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))', color: '#ffffff', border: 'none', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', boxShadow: 'var(--theme-btn-shadow, 0 4px 12px rgba(13, 148, 136, 0.25))' }}
            >
              <Plus size={14} /> Snap Layer
            </button>
            <span style={{ fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.95rem' }}>
              Sum = {oddN}² = {oddN * oddN}
            </span>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '14px', border: '2px dashed var(--theme-border-strong, #5eead4)', padding: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '140px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${oddN}, 22px)`, gap: '3px' }}>
              {Array.from({ length: oddN }).map((_, r) =>
                Array.from({ length: oddN }).map((_, c) => {
                  const layer = Math.max(r, c);
                  const color = gnomonColors[layer % gnomonColors.length];
                  return (
                    <div key={`${r}-${c}`} style={{ width: '22px', height: '22px', borderRadius: '4px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.72rem', fontWeight: '900', boxShadow: '0 2px 5px rgba(0,0,0,0.15)' }}>
                      {layer + 1}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 2: UP AND DOWN DIAGONAL PROOF */}
      {currentSlide === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Counting Up & Down: 1 + 2 + ... + N + ... + 2 + 1 = N²
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              Diagonal cross-sections decompose an $N \times N$ square grid into symmetrical parallel lines of lengths $1, 2, \dots, N, \dots, 2, 1$. Summing these counts accounts for all cells in the square, confirming this visual proof without words.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '0.65rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>Peak Apex N = {upDownN}:</span>
            <input
              type="range"
              min="1"
              max="6"
              value={upDownN}
              onChange={(e) => setUpDownN(parseInt(e.target.value, 10))}
              style={{ flex: 1, accentColor: 'var(--theme-primary, #0d9488)' }}
            />
            <span style={{ fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.95rem' }}>
              Sum = {upDownN}² = {upDownN * upDownN}
            </span>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '14px', border: '2px dashed var(--theme-border-strong, #5eead4)', padding: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '140px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${upDownN}, 22px)`, gap: '3px' }}>
              {Array.from({ length: upDownN }).map((_, r) =>
                Array.from({ length: upDownN }).map((_, c) => {
                  const diagIndex = r + c;
                  const color = gnomonColors[diagIndex % gnomonColors.length];
                  return (
                    <div key={`${r}-${c}`} style={{ width: '22px', height: '22px', borderRadius: '4px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.72rem', fontWeight: '900', boxShadow: '0 2px 5px rgba(0,0,0,0.15)' }}>
                      {diagIndex + 1}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 3: TWO TRIANGULAR NUMBERS FORM A SQUARE */}
      {currentSlide === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Two Consecutive Triangular Numbers Interlock into a Square
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              Any two successive triangular numbers fit together along their diagonal hypotenuse like puzzle pieces ($T_{N-1} + T_N = N^2$). For instance: $1 + 3 = 4$ ($2^2$), $3 + 6 = 9$ ($3^2$), and $6 + 10 = 16$ ($4^2$).
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '0.65rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>Square Size N = {triN}:</span>
            <input
              type="range"
              min="2"
              max="5"
              value={triN}
              onChange={(e) => setTriN(parseInt(e.target.value, 10))}
              style={{ flex: 1, accentColor: 'var(--theme-primary, #0d9488)' }}
            />
            <span style={{ fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.95rem' }}>
              T({triN - 1}) + T({triN}) = {triN * triN} = {triN}²
            </span>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '14px', border: '2px dashed var(--theme-border-strong, #5eead4)', padding: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '140px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${triN}, 26px)`, gap: '4px' }}>
              {Array.from({ length: triN }).map((_, r) =>
                Array.from({ length: triN }).map((_, c) => {
                  const isLower = r >= c;
                  return (
                    <div key={`${r}-${c}`} style={{ width: '26px', height: '26px', borderRadius: '5px', background: isLower ? 'var(--theme-primary, #0d9488)' : 'var(--theme-border-strong, #5eead4)', color: isLower ? '#fff' : '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.74rem', boxShadow: '0 2px 5px rgba(0,0,0,0.15)' }}>
                      {isLower ? `T${triN}` : `T${triN - 1}`}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 4: HEXAGONS TO CUBES */}
      {currentSlide === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Adding Hexagonal Numbers Assembles Complete Cube Numbers
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              Viewing a solid 3D cube from an isometric corner perspective reveals concentric hexagonal projection shells ($1, 7, 19, 37 \dots$). Summing these hexagonal layers reconstructs solid 3D cubes ($1 + 7 + 19 + 37 = 64 = 4^3$).
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '0.65rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>Cube Tier N = {hexCubeN}:</span>
            <input
              type="range"
              min="1"
              max="4"
              value={hexCubeN}
              onChange={(e) => setHexCubeN(parseInt(e.target.value, 10))}
              style={{ flex: 1, accentColor: 'var(--theme-primary, #0d9488)' }}
            />
            <span style={{ fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.95rem' }}>
              Sum = {hexCubeN}³ = {hexCubeN * hexCubeN * hexCubeN}
            </span>
          </div>

          <div style={{ background: 'var(--theme-badge-bg, #ccfbf1)', padding: '0.85rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', fontSize: '0.95rem', fontWeight: '900', color: 'var(--theme-badge-text, #0f766e)', textAlign: 'center' }}>
            {Array.from({ length: hexCubeN }).map((_, i) => (i === 0 ? 1 : 3 * (i + 1) * i + 1)).join(' + ')} = {hexCubeN * hexCubeN * hexCubeN} ({hexCubeN}³)
          </div>
        </div>
      )}
    </div>
  );
}
