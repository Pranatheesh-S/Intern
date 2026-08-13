import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Compass,
  Zap,
  Award,
  RefreshCw,
  Play,
  CheckCircle,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CirclesLab({ onBackToDashboard }) {
  const [stage, setStage] = useState(1);
  const [radius, setRadius] = useState(100);
  const [sweepAngle, setSweepAngle] = useState(0); // for rotating sweep line animation
  const [stage1Matched, setStage1Matched] = useState(false);
  const [isDraggingRadius, setIsDraggingRadius] = useState(false); // directly drag circle boundary
  const [stage2Chords, setStage2Chords] = useState([]); // List of targets tracked as chords
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [stage3SectorAngle1, setStage3SectorAngle1] = useState(30);
  const [stage3SectorAngle2, setStage3SectorAngle2] = useState(120);
  const [stage3ChordY, setStage3ChordY] = useState(150); // Chord line height for segment
  const [xp, setXp] = useState(0);

  const canvasRef = useRef(null);
  const center = { x: 300, y: 220 };
  
  // Rotating sweep line animation for authentic sonar look
  useEffect(() => {
    let animationFrameId;
    const rotateSweep = () => {
      setSweepAngle(prev => (prev + 1.2) % 360);
      animationFrameId = requestAnimationFrame(rotateSweep);
    };
    animationFrameId = requestAnimationFrame(rotateSweep);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Stage 1 calibration match
  useEffect(() => {
    setStage1Matched(radius === 150);
  }, [radius]);

  // Stage 2 target paths (Static entries for tracking)
  const targets = [
    { id: 1, name: "Meteor Delta", p1: { x: 150, y: 120 }, p2: { x: 450, y: 120 }, chordColor: '#f87171', sweepFlag: 0 },
    { id: 2, name: "Debris Beta", p1: { x: 130, y: 280 }, p2: { x: 470, y: 280 }, chordColor: '#60a5fa', sweepFlag: 1 },
    { id: 3, name: "Satellite Alpha", p1: { x: 120, y: 220 }, p2: { x: 480, y: 220 }, chordColor: '#34d399', isDiameter: true, sweepFlag: 0 } // passing through center
  ];

  const handleTrackTarget = (t) => {
    if (stage2Chords.includes(t.id)) return;
    
    setStage2Chords(prev => [...prev, t.id]);
    setXp(x => x + 15);
    confetti({
      particleCount: 15,
      spread: 30,
      origin: { x: (t.p1.x + t.p2.x) / 1200, y: (t.p1.y + t.p2.y) / 880 }
    });
  };

  const advanceStage = () => {
    if (stage === 1) {
      setStage(2);
      setStage2Chords([]);
    } else if (stage === 2) {
      setStage(3);
    } else if (stage === 3) {
      confetti({ particleCount: 150, spread: 80 });
      onBackToDashboard();
    }
  };

  const handleStartDragRadius = (e) => {
    e.preventDefault();
    setIsDraggingRadius(true);
  };

  const handlePointerMove = (e) => {
    if (isDraggingRadius) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const newRadius = Math.max(40, Math.min(180, Math.round(clientX - center.x)));
      if (Math.abs(newRadius - 150) <= 2) {
        setRadius(150);
      } else {
        setRadius(newRadius);
      }
    }
  };

  const handlePointerUp = () => {
    setIsDraggingRadius(false);
  };

  // Convert angles to coordinates on circle boundary (radius = 180)
  const getCirclePoint = (angle) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center.x + 180 * Math.cos(rad),
      y: center.y - 180 * Math.sin(rad)
    };
  };

  const sectorP1 = getCirclePoint(stage3SectorAngle1);
  const sectorP2 = getCirclePoint(stage3SectorAngle2);

  // Targets in Stage 3 to isolate
  const stage3Target1Matched = stage3SectorAngle1 <= 45 && stage3SectorAngle2 >= 135;
  // Segment matches when chord y cuts close to the warning signal coordinates
  const stage3Target2Matched = stage3ChordY >= 100 && stage3ChordY <= 140;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      color: 'var(--text-main)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(8px)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onBackToDashboard}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={16} /> Back to Chapters
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio size={20} style={{ color: '#facc15' }} />
              Activity 2.7: Sonar Radar Scope
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 6 Geometry • Basic Geometrical Ideas</span>
          </div>
        </div>

        {/* XP and progress indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(250, 204, 21, 0.1)', border: '1px solid rgba(250, 204, 21, 0.2)', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>
            <Zap size={14} style={{ color: '#facc15' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#facc15' }}>{xp} XP</span>
          </div>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {[1, 2, 3].map(s => (
              <div
                key={s}
                style={{
                  width: '32px',
                  height: '6px',
                  borderRadius: '3px',
                  background: stage >= s ? '#facc15' : 'rgba(255, 255, 255, 0.1)',
                  transition: 'background-color 0.3s'
                }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        flex: 1,
        minHeight: 'calc(100vh - 75px)'
      }}>
        {/* Left Side Info Panel */}
        <aside style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRight: '1px solid var(--border)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backdropFilter: 'blur(6px)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{
                background: 'rgba(250, 204, 21, 0.15)',
                color: '#facc15',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                Stage {stage} of 3
              </span>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                {stage === 1 && "Radius & Diameter"}
                {stage === 2 && "Chords & Arcs"}
                {stage === 3 && "Sectors vs Segments"}
              </h2>
            </div>

            {stage === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                <div style={{ background: 'rgba(250, 204, 21, 0.08)', borderLeft: '3px solid #facc15', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0' }}>
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>YOUR MISSION:</strong>
                  Calibrate the sonar scope's sweep radius to exactly <strong>150px</strong> to align with the radar grid.
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>Steps to Solve:</span>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <li><strong>Drag the blue circle handle</strong> directly on the scope, or adjust the slider above.</li>
                    <li>Observe that <strong>Radius ($r$)</strong> connects center to boundary, while <strong>Diameter ($d$)</strong> spans the entire circle ($d = 2r$).</li>
                  </ul>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>Task Checklist:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" checked={stage1Matched} readOnly style={{ accentColor: '#facc15' }} />
                    <span style={{ color: stage1Matched ? '#a7f3d0' : 'inherit' }}>Calibrate sweep radius to 150px</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                  <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Dynamic Measurement:</span>
                  <div>Radius: <strong style={{ color: '#facc15' }}>{radius}px</strong></div>
                  <div>Diameter: <strong>{radius * 2}px</strong></div>
                </div>
              </div>
            )}

            {stage === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                <div style={{ background: 'rgba(250, 204, 21, 0.08)', borderLeft: '3px solid #facc15', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0' }}>
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>YOUR MISSION:</strong>
                  Identify and track incoming satellite and debris trajectories on the scope.
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>Steps to Solve:</span>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <li>Tap the red target blips on the scope to trace their trajectory lines.</li>
                    <li>Observe how they define a <strong>Chord</strong> (segment connecting two boundary points) and an <strong>Arc</strong> (boundary path curve).</li>
                    <li>Notice that Satellite Alpha is the <strong>longest chord</strong> (Diameter) because it passes directly through the center!</li>
                  </ul>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>Targets Tracked:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {targets.map(t => (
                      <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" checked={stage2Chords.includes(t.id)} readOnly style={{ accentColor: '#facc15' }} />
                        <span style={{ color: stage2Chords.includes(t.id) ? '#a7f3d0' : 'inherit' }}>
                          {t.name} {t.isDiameter && "(Diameter)"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {stage === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                <div style={{ background: 'rgba(250, 204, 21, 0.08)', borderLeft: '3px solid #facc15', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0' }}>
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>YOUR MISSION:</strong>
                  Isolate critical sectors and segments to guide incoming sweeps and establish safety boundaries.
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>Steps to Solve:</span>
                  <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <li>Adjust the Sector sliders above to capture a <strong>Sector</strong> (pie slice region between two radii) covering <strong>45° to 135°</strong>.</li>
                    <li>Adjust the Segment height slider to set a <strong>Segment</strong> (region cut off by a horizontal chord line) at height <strong>100px to 140px</strong>.</li>
                  </ol>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>Task Checklist:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" checked={stage3Target1Matched} readOnly style={{ accentColor: '#facc15' }} />
                      <span style={{ color: stage3Target1Matched ? '#a7f3d0' : 'inherit' }}>Isolate sector sweep (angles 45°-135°)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" checked={stage3Target2Matched} readOnly style={{ accentColor: '#facc15' }} />
                      <span style={{ color: stage3Target2Matched ? '#a7f3d0' : 'inherit' }}>Segment cut at y: 100px-140px</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action trigger footer buttons */}
          <div style={{ marginTop: '1.5rem' }}>
            {stage === 1 && (
              <button
                disabled={!stage1Matched}
                onClick={advanceStage}
                style={{
                  width: '100%',
                  background: stage1Matched ? 'linear-gradient(135deg, #facc15 0%, #d97706 100%)' : 'rgba(255, 255, 255, 0.05)',
                  color: stage1Matched ? '#000000' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: stage1Matched ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: stage1Matched ? '0 4px 12px rgba(250, 204, 21, 0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Proceed to Sonar <Play size={14} fill={stage1Matched ? "#000000" : "transparent"} />
              </button>
            )}

            {stage === 2 && (
              <button
                disabled={stage2Chords.length < 3}
                onClick={advanceStage}
                style={{
                  width: '100%',
                  background: stage2Chords.length >= 3 ? 'linear-gradient(135deg, #facc15 0%, #d97706 100%)' : 'rgba(255, 255, 255, 0.05)',
                  color: stage2Chords.length >= 3 ? '#000000' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: stage2Chords.length >= 3 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: stage2Chords.length >= 3 ? '0 4px 12px rgba(250, 204, 21, 0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Isolate Slices <Play size={14} fill={stage2Chords.length >= 3 ? "#000000" : "transparent"} />
              </button>
            )}

            {stage === 3 && (
              <button
                disabled={!(stage3Target1Matched && stage3Target2Matched)}
                onClick={advanceStage}
                style={{
                  width: '100%',
                  background: (stage3Target1Matched && stage3Target2Matched) ? 'linear-gradient(135deg, #facc15 0%, #d97706 100%)' : 'rgba(255, 255, 255, 0.05)',
                  color: (stage3Target1Matched && stage3Target2Matched) ? '#000000' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: (stage3Target1Matched && stage3Target2Matched) ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: (stage3Target1Matched && stage3Target2Matched) ? '0 4px 12px rgba(250, 204, 21, 0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Finish Radar Sweep <CheckCircle size={16} />
              </button>
            )}
          </div>
        </aside>

        {/* Right Sonar View */}
        <main style={{
          background: 'radial-gradient(circle at center, #022c22 0%, #020617 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '2rem',
          overflow: 'hidden'
        }}>
          {/* Slider Controls overlay box */}
          {stage === 1 && (
            <div style={{
              position: 'absolute',
              top: '20px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.8rem 1.5rem',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              width: '320px',
              zIndex: 10,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Radar Calibration range:</span>
              <input
                type="range"
                min="40"
                max="180"
                value={radius}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (Math.abs(val - 150) <= 2) {
                    setRadius(150);
                  } else {
                    setRadius(val);
                  }
                }}
                style={{ width: '100%', accentColor: '#facc15' }}
              />
            </div>
          )}

          {stage === 3 && (
            <div style={{
              position: 'absolute',
              top: '20px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.8rem 1.5rem',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              width: '320px',
              zIndex: 10,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Sector Start Angle: {stage3SectorAngle1}°</span>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={stage3SectorAngle1}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (Math.abs(val - 45) <= 2) {
                      setStage3SectorAngle1(45);
                    } else {
                      setStage3SectorAngle1(val);
                    }
                  }}
                  style={{ width: '100%', accentColor: '#facc15' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Sector End Angle: {stage3SectorAngle2}°</span>
                <input
                  type="range"
                  min="90"
                  max="180"
                  value={stage3SectorAngle2}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (Math.abs(val - 135) <= 2) {
                      setStage3SectorAngle2(135);
                    } else {
                      setStage3SectorAngle2(val);
                    }
                  }}
                  style={{ width: '100%', accentColor: '#facc15' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Segment Chord Height (y): {stage3ChordY}px</span>
                <input
                  type="range"
                  min="60"
                  max="200"
                  value={stage3ChordY}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (Math.abs(val - 120) <= 3) {
                      setStage3ChordY(120);
                    } else {
                      setStage3ChordY(val);
                    }
                  }}
                  style={{ width: '100%', accentColor: '#facc15' }}
                />
              </div>
            </div>
          )}

          {/* Interactive SVG Radar Scope */}
          <div style={{
            position: 'relative',
            width: '600px',
            height: '440px',
            background: 'rgba(2, 44, 34, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.05)'
          }}>
            <svg
              width="100%"
              height="100%"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{ touchAction: 'none' }}
            >
              {/* Glow filter definition */}
              <defs>
                <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Polar sweep grids */}
              <circle cx={center.x} cy={center.y} r="180" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="2" />
              <circle cx={center.x} cy={center.y} r="120" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeDasharray="4,4" />
              <circle cx={center.x} cy={center.y} r="60" fill="none" stroke="rgba(16, 185, 129, 0.05)" />

              {/* Horizontal / Vertical crosshairs */}
              <line x1={center.x - 200} y1={center.y} x2={center.x + 200} y2={center.y} stroke="rgba(16, 185, 129, 0.1)" />
              <line x1={center.x} y1={center.y - 200} x2={center.x} y2={center.y + 200} stroke="rgba(16, 185, 129, 0.1)" />

              {/* Rotating Sweep Line */}
              <line
                x1={center.x}
                y1={center.y}
                x2={center.x + 180 * Math.cos((sweepAngle * Math.PI) / 180)}
                y2={center.y - 180 * Math.sin((sweepAngle * Math.PI) / 180)}
                stroke="rgba(16, 185, 129, 0.3)"
                strokeWidth="2"
              />

              {/* Stage 1: Sweep Radius and Diameter visualization */}
              {stage === 1 && (
                <>
                  {/* The calibrated circle */}
                  <circle cx={center.x} cy={center.y} r={radius} fill="rgba(250, 204, 21, 0.03)" stroke="#facc15" strokeWidth="2" filter="url(#neon-glow)" />
                  
                  {/* Center node */}
                  <circle cx={center.x} cy={center.y} r="5" fill="#ffffff" />
                  <text x={center.x} y={center.y - 12} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">CENTER (O)</text>

                  {/* Draw Diameter segment horizontally inside the circle (d = 2r) */}
                  <line x1={center.x - radius} y1={center.y} x2={center.x + radius} y2={center.y} stroke="#f87171" strokeWidth="3" opacity="0.8" />

                  {/* Dimension Guide underneath for Diameter to prevent center text overlay */}
                  <g opacity="0.75">
                    {/* Horizontal dimension line */}
                    <line x1={center.x - radius} y1={center.y + radius + 15} x2={center.x + radius} y2={center.y + radius + 15} stroke="#f87171" strokeWidth="1.5" strokeDasharray="2,2" />
                    {/* Left extension line */}
                    <line x1={center.x - radius} y1={center.y} x2={center.x - radius} y2={center.y + radius + 20} stroke="rgba(248, 113, 113, 0.4)" strokeWidth="1" />
                    {/* Right extension line */}
                    <line x1={center.x + radius} y1={center.y} x2={center.x + radius} y2={center.y + radius + 20} stroke="rgba(248, 113, 113, 0.4)" strokeWidth="1" />
                    {/* Left tick */}
                    <line x1={center.x - radius} y1={center.y + radius + 11} x2={center.x - radius} y2={center.y + radius + 19} stroke="#f87171" strokeWidth="1.5" />
                    {/* Right tick */}
                    <line x1={center.x + radius} y1={center.y + radius + 11} x2={center.x + radius} y2={center.y + radius + 19} stroke="#f87171" strokeWidth="1.5" />
                    {/* Dimension Text */}
                    <text x={center.x} y={center.y + radius + 32} fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">DIAMETER (d = 2r)</text>
                  </g>

                  {/* Rotated Radius group (rotates -45 degrees) */}
                  <g transform={`translate(${center.x}, ${center.y}) rotate(-45)`}>
                    {/* Draw Radius segment */}
                    <line x1="0" y1="0" x2={radius} y2="0" stroke="#60a5fa" strokeWidth="3" />
                    {/* Radius text parallel to segment */}
                    <text x={radius / 2} y="-8" fill="#60a5fa" fontSize="10" fontWeight="bold" textAnchor="middle">RADIUS (r)</text>

                    {/* Circle edge drag handle positioned at the end of the radius segment */}
                    <circle
                      cx={radius}
                      cy="0"
                      r="9"
                      fill="#60a5fa"
                      stroke="#ffffff"
                      strokeWidth="2"
                      style={{ cursor: 'move', touchAction: 'none' }}
                      onPointerDown={handleStartDragRadius}
                      filter="drop-shadow(0 0 5px #60a5fa)"
                    />
                  </g>
                </>
              )}

              {/* Stage 2: Sonar targets and Chord/Arc clicks */}
              {stage === 2 && targets.map(t => {
                const isTracked = stage2Chords.includes(t.id);
                return (
                  <g key={t.id} style={{ cursor: isTracked ? 'default' : 'pointer' }} onClick={() => handleTrackTarget(t)}>
                    {/* Draw Chord segment lines */}
                    {isTracked && (
                      <>
                        <line
                          x1={t.p1.x}
                          y1={t.p1.y}
                          x2={t.p2.x}
                          y2={t.p2.y}
                          stroke={t.chordColor}
                          strokeWidth="3"
                          filter="url(#neon-glow)"
                        />
                        <text
                          x={(t.p1.x + t.p2.x) / 2}
                          y={t.p1.y - 8}
                          fill={t.chordColor}
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {t.isDiameter ? "DIAMETER CHORD" : "CHORD"}
                        </text>

                        {/* Highlight Arc segment curve */}
                        <path
                          d={`M ${t.p1.x} ${t.p1.y} A 180 180 0 0 ${t.sweepFlag} ${t.p2.x} ${t.p2.y}`}
                          fill="none"
                          stroke="#facc15"
                          strokeWidth="4"
                        />
                        <text
                          x={(t.p1.x + t.p2.x) / 2}
                          y={t.p1.y + 18}
                          fill="#facc15"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          ARC
                        </text>
                      </>
                    )}

                    {/* Target blip coordinate dots */}
                    <circle
                      cx={t.p1.x}
                      cy={t.p1.y}
                      r="7"
                      fill={isTracked ? t.chordColor : '#ef4444'}
                      filter="drop-shadow(0 0 4px #ef4444)"
                    />
                    <circle
                      cx={t.p2.x}
                      cy={t.p2.y}
                      r="7"
                      fill={isTracked ? t.chordColor : '#ef4444'}
                      filter="drop-shadow(0 0 4px #ef4444)"
                    />
                  </g>
                );
              })}

              {/* Stage 3: Sector and Segment partitions overlay */}
              {stage === 3 && (
                <>
                  {/* Draw Sector sweep zone (translucent angle pie) */}
                  <path
                    d={`M ${center.x} ${center.y} 
                       L ${sectorP1.x} ${sectorP1.y} 
                       A 180 180 0 0 0 ${sectorP2.x} ${sectorP2.y} 
                       Z`}
                    fill="rgba(250, 204, 21, 0.12)"
                    stroke="#facc15"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={center.x + 60 * Math.cos(((stage3SectorAngle1 + stage3SectorAngle2) / 2) * Math.PI / 180)}
                    y={center.y - 60 * Math.sin(((stage3SectorAngle1 + stage3SectorAngle2) / 2) * Math.PI / 180)}
                    fill="#facc15"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    SECTOR
                  </text>

                  {/* Draw Segment (bounded by chord and arc) */}
                  {/* Chord line segment at stage3ChordY */}
                  {(() => {
                    // Compute chord intersections with circle r = 180 (center: 300, 220)
                    // (x - 300)^2 + (y - 220)^2 = 180^2
                    // Let y = stage3ChordY. Solve for x.
                    const dy = stage3ChordY - center.y;
                    const r2_dy2 = 180 * 180 - dy * dy;
                    if (r2_dy2 > 0) {
                      const dx = Math.sqrt(r2_dy2);
                      const x1 = center.x - dx;
                      const x2 = center.x + dx;
                      return (
                        <g>
                          <line x1={x1} y1={stage3ChordY} x2={x2} y2={stage3ChordY} stroke="#60a5fa" strokeWidth="3" />
                          <path
                            d={`M ${x1} ${stage3ChordY} A 180 180 0 0 0 ${x2} ${stage3ChordY} Z`}
                            fill="rgba(96, 165, 250, 0.15)"
                          />
                          {/* Segment label positioned safely higher to prevent overlapping with Sector label */}
                          <text x="300" y={stage3ChordY - 22} fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle">
                            SEGMENT
                          </text>
                        </g>
                      );
                    }
                    return null;
                  })()}
                </>
              )}
            </svg>
          </div>
        </main>
      </div>
    </div>
  );
}
