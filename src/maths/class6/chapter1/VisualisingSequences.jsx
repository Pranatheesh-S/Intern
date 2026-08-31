import React, { useState } from 'react';
import { Sparkles, Grid, Box, Eye, Layers, RefreshCw, Trophy } from 'lucide-react';
import './theme.css';

export default function VisualisingSequences({ currentSlide = 1 }) {
  const [table2Seq, setTable2Seq] = useState('triangular');
  const [nDots, setNDots] = useState(4);
  const [cubeN, setCubeN] = useState(3);
  const [morphMode, setMorphMode] = useState('triangle');
  const [hexN, setHexN] = useState(3);

  const renderDotPattern = () => {
    if (table2Seq === 'triangular') {
      const rows = [];
      let count = 0;
      for (let r = 1; r <= nDots; r++) {
        const dots = [];
        for (let c = 0; c < r; c++) {
          count++;
          dots.push(
            <div key={c} style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)' }} />
          );
        }
        rows.push(
          <div key={r} style={{ display: 'flex', gap: '7px', justifyContent: 'center' }}>
            {dots}
          </div>
        );
      }
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', alignItems: 'center' }}>
          {rows}
          <div style={{ marginTop: '0.65rem', fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '1rem', background: 'var(--theme-badge-bg, #ccfbf1)', padding: '0.25rem 0.85rem', borderRadius: '8px', border: '1px solid var(--theme-border, #a7f3d0)' }}>
            Triangular Formula T({nDots}) = {count} Dots
          </div>
        </div>
      );
    } else {
      const grid = [];
      for (let r = 0; r < nDots; r++) {
        const row = [];
        for (let c = 0; c < nDots; c++) {
          row.push(
            <div key={c} style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)' }} />
          );
        }
        grid.push(
          <div key={r} style={{ display: 'flex', gap: '7px', justifyContent: 'center' }}>
            {row}
          </div>
        );
      }
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', alignItems: 'center' }}>
          {grid}
          <div style={{ marginTop: '0.65rem', fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '1rem', background: 'var(--theme-badge-bg, #ccfbf1)', padding: '0.25rem 0.85rem', borderRadius: '8px', border: '1px solid var(--theme-border, #a7f3d0)' }}>
            Square Formula: {nDots} × {nDots} = {nDots * nDots} Dots
          </div>
        </div>
      );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', justifyContent: 'space-between' }}>
      {/* SLIDE 1: 2D DOT PATTERNS */}
      {currentSlide === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Table 2: Visualising Sequences Using 2D Geometric Arrays
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              Representing numerical quantities as physical dot lattices reveals why sequences possess inherent geometric forms. Triangular numbers assemble naturally into stepped triangular equilateral planes, while square numbers tile compact quadratic grids.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => setTable2Seq('triangular')}
              style={{ padding: '0.45rem 1rem', borderRadius: '8px', border: table2Seq === 'triangular' ? '2px solid var(--theme-primary, #0d9488)' : '1.5px solid var(--theme-border, #a7f3d0)', background: table2Seq === 'triangular' ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff', color: table2Seq === 'triangular' ? 'var(--theme-primary-dark, #0f766e)' : '#475569', fontWeight: '900', fontSize: '0.88rem', cursor: 'pointer' }}
            >
              Triangular Numbers (Tₙ)
            </button>
            <button
              onClick={() => setTable2Seq('squares')}
              style={{ padding: '0.45rem 1rem', borderRadius: '8px', border: table2Seq === 'squares' ? '2px solid var(--theme-primary, #0d9488)' : '1.5px solid var(--theme-border, #a7f3d0)', background: table2Seq === 'squares' ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff', color: table2Seq === 'squares' ? 'var(--theme-primary-dark, #0f766e)' : '#475569', fontWeight: '900', fontSize: '0.88rem', cursor: 'pointer' }}
            >
              Square Numbers (N²)
            </button>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', padding: '0.65rem 1.15rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>Array Dimension N = {nDots}:</span>
            <input
              type="range"
              min="1"
              max="5"
              value={nDots}
              onChange={(e) => setNDots(parseInt(e.target.value, 10))}
              style={{ flex: 1, accentColor: 'var(--theme-primary, #0d9488)' }}
            />
          </div>

          <div style={{ background: '#ffffff', borderRadius: '14px', border: '2px dashed var(--theme-border-strong, #5eead4)', padding: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '130px' }}>
            {renderDotPattern()}
          </div>
        </div>
      )}

      {/* SLIDE 2: 3D ISOMETRIC CUBES */}
      {currentSlide === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              3D Cube Numbers (1, 8, 27, 64, 125 ...)
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              A cube number $N^3$ represents the volumetric total of unit cubic blocks required to construct a solid three-dimensional $N \times N \times N$ isometric prism. Each dimension adds an exponential degree of spatial freedom.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '0.65rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>Cube Dimension N = {cubeN}:</span>
            <input
              type="range"
              min="1"
              max="4"
              value={cubeN}
              onChange={(e) => setCubeN(parseInt(e.target.value, 10))}
              style={{ flex: 1, accentColor: 'var(--theme-primary, #0d9488)' }}
            />
            <span style={{ fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.95rem' }}>
              {cubeN}³ = {cubeN * cubeN * cubeN} Unit Voxels
            </span>
          </div>

          <div style={{ background: 'var(--theme-bg, #f0fdfa)', borderRadius: '14px', padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '145px', border: '1.8px solid var(--theme-border, #a7f3d0)' }}>
            <svg viewBox="0 0 260 150" style={{ width: '100%', maxWidth: '260px', height: 'auto' }}>
              {(() => {
                const elements = [];
                const originX = 130;
                const originY = 105;
                const size = 22 - cubeN * 2;

                for (let z = 0; z < cubeN; z++) {
                  for (let y = 0; y < cubeN; y++) {
                    for (let x = 0; x < cubeN; x++) {
                      const isoX = originX + (x - y) * size * Math.cos(Math.PI / 6);
                      const isoY = originY + (x + y) * size * Math.sin(Math.PI / 6) - z * size * 1.15;

                      elements.push(
                        <g key={`${x}-${y}-${z}`}>
                          <polygon
                            points={`${isoX},${isoY - size} ${isoX + size * Math.cos(Math.PI / 6)},${isoY - size + size * Math.sin(Math.PI / 6)} ${isoX},${isoY - size + 2 * size * Math.sin(Math.PI / 6)} ${isoX - size * Math.cos(Math.PI / 6)},${isoY - size + size * Math.sin(Math.PI / 6)}`}
                            fill="#5eead4"
                            stroke="#0f766e"
                            strokeWidth="0.8"
                          />
                          <polygon
                            points={`${isoX},${isoY - size + 2 * size * Math.sin(Math.PI / 6)} ${isoX + size * Math.cos(Math.PI / 6)},${isoY - size + size * Math.sin(Math.PI / 6)} ${isoX + size * Math.cos(Math.PI / 6)},${isoY + size * Math.sin(Math.PI / 6)} ${isoX},${isoY + 2 * size * Math.sin(Math.PI / 6)}`}
                            fill="#14b8a6"
                            stroke="#0f766e"
                            strokeWidth="0.8"
                          />
                          <polygon
                            points={`${isoX},${isoY - size + 2 * size * Math.sin(Math.PI / 6)} ${isoX - size * Math.cos(Math.PI / 6)},${isoY - size + size * Math.sin(Math.PI / 6)} ${isoX - size * Math.cos(Math.PI / 6)},${isoY + size * Math.sin(Math.PI / 6)} ${isoX},${isoY + 2 * size * Math.sin(Math.PI / 6)}`}
                            fill="#0d9488"
                            stroke="#0f766e"
                            strokeWidth="0.8"
                          />
                        </g>
                      );
                    }
                  }
                }
                return elements;
              })()}
            </svg>
          </div>
        </div>
      )}

      {/* SLIDE 3: THE 36 MYSTERY */}
      {currentSlide === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              The 36 Mystery — Both Triangular AND Square
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              The integer $36$ holds a rare mathematical bridge: it is simultaneously the 8th triangular number ($T_8 = 1 + 2 + \dots + 8 = 36$) and the 6th square number ($6 \times 6 = 36$). Click below to observe the continuous geometric transformation:
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
            <button
              onClick={() => setMorphMode('triangle')}
              style={{ padding: '0.45rem 1.15rem', borderRadius: '8px', border: morphMode === 'triangle' ? '2px solid var(--theme-primary, #0d9488)' : '1.5px solid var(--theme-border, #a7f3d0)', background: morphMode === 'triangle' ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff', color: morphMode === 'triangle' ? 'var(--theme-primary-dark, #0f766e)' : '#475569', fontWeight: '900', fontSize: '0.88rem', cursor: 'pointer' }}
            >
              Triangular View ($T_8 = 36$)
            </button>
            <button
              onClick={() => setMorphMode('square')}
              style={{ padding: '0.45rem 1.15rem', borderRadius: '8px', border: morphMode === 'square' ? '2px solid var(--theme-primary, #0d9488)' : '1.5px solid var(--theme-border, #a7f3d0)', background: morphMode === 'square' ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff', color: morphMode === 'square' ? 'var(--theme-primary-dark, #0f766e)' : '#475569', fontWeight: '900', fontSize: '0.88rem', cursor: 'pointer' }}
            >
              Square View ($6 \times 6 = 36$)
            </button>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '14px', border: '2px dashed var(--theme-border-strong, #5eead4)', padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '145px' }}>
            <svg viewBox="0 0 300 130" style={{ width: '100%', maxWidth: '290px', height: 'auto' }}>
              {(() => {
                const dots = [];
                let dotIndex = 0;
                for (let r = 0; r < 8; r++) {
                  for (let c = 0; c <= r; c++) {
                    const triX = 150 - (r * 13) / 2 + c * 13;
                    const triY = 12 + r * 14;

                    const sqRow = Math.floor(dotIndex / 6);
                    const sqCol = dotIndex % 6;
                    const sqX = 110 + sqCol * 15;
                    const sqY = 18 + sqRow * 16;

                    const curX = morphMode === 'triangle' ? triX : sqX;
                    const curY = morphMode === 'triangle' ? triY : sqY;

                    dots.push(
                      <circle
                        key={dotIndex}
                        cx={curX}
                        cy={curY}
                        r="4.2"
                        fill="var(--theme-primary, #0d9488)"
                        style={{ transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                      />
                    );
                    dotIndex++;
                  }
                }
                return dots;
              })()}
            </svg>
          </div>
        </div>
      )}

      {/* SLIDE 4: HEXAGONAL NUMBERS */}
      {currentSlide === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Hexagonal Numbers (1, 7, 19, 37, 61 ...)
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              Hexagonal numbers originate from packing concentric rings around a central node in regular 6-fold honeycomb symmetry. Each consecutive perimeter expands by an exact multiple of $6$:
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '0.65rem 1.15rem', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>Ring Tier N = {hexN}:</span>
            <input
              type="range"
              min="1"
              max="4"
              value={hexN}
              onChange={(e) => setHexN(parseInt(e.target.value, 10))}
              style={{ flex: 1, accentColor: 'var(--theme-primary, #0d9488)' }}
            />
            <span style={{ fontWeight: '900', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.95rem' }}>
              H({hexN}) = {3 * hexN * (hexN - 1) + 1} Dots
            </span>
          </div>

          <div style={{ background: 'var(--theme-badge-bg, #ccfbf1)', borderRadius: '12px', border: '1.8px solid var(--theme-border, #a7f3d0)', padding: '0.85rem', fontSize: '0.92rem', color: 'var(--theme-badge-text, #0f766e)', fontWeight: '900', textAlign: 'center' }}>
            Hexagonal Progression: 1 ➔ (+6) ➔ 7 ➔ (+12) ➔ 19 ➔ (+18) ➔ 37 ➔ (+24) ➔ 61 ...
          </div>
        </div>
      )}
    </div>
  );
}
