import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Compass,
  Zap,
  Award,
  RotateCw,
  Sun,
  Shield,
  CheckCircle,
  HelpCircle,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AnglesLab({ onBackToDashboard }) {
  const [stage, setStage] = useState(1);
  const [angle1, setAngle1] = useState(30); // in degrees
  const [angle2, setAngle2] = useState(120); // in degrees
  const [draggingArm, setDraggingArm] = useState(null); // 'arm1' or 'arm2'
  const [score, setScore] = useState(0);
  const [particles, setParticles] = useState([]);
  const [classificationResults, setClassificationResults] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(0); // For Stage 3 challenges
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [xp, setXp] = useState(0);
  const [hasAligned45, setHasAligned45] = useState(false);
  const [hasAligned120, setHasAligned120] = useState(false);
  
  const canvasRef = useRef(null);
  
  // Center of our coordinate system inside the SVG
  const center = { x: 300, y: 250 };
  const armLength = 180;

  // Initialize Stage 2 particles
  useEffect(() => {
    if (stage === 2) {
      const generatedParticles = [];
      for (let i = 0; i < 8; i++) {
        // Randomly place points inside the SVG bounds
        const x = 100 + Math.random() * 400;
        const y = 80 + Math.random() * 320;
        
        // Calculate math properties relative to the static angle
        // Let's set a static angle: arm1 at 0° (east) and arm2 at 90° (north, which is -90° in screen coordinates)
        // Screen coords: center is (300, 250)
        const dx = x - center.x;
        const dy = y - center.y;
        let angle = Math.atan2(-dy, dx) * (180 / Math.PI); // Cartesian angle
        if (angle < 0) angle += 360;
        
        // Check if inside the interior of angle formed by arm1 (30°) and arm2 (120°)
        const isInterior = angle >= 30 && angle <= 120;
        
        generatedParticles.push({
          id: i,
          x,
          y,
          angle,
          isInterior,
          classified: false,
          userSelection: null, // 'interior' or 'exterior'
          correct: null,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8
        });
      }
      setParticles(generatedParticles);
      setClassificationResults([]);
    }
  }, [stage]);

  // Particle floating animation in Stage 2
  useEffect(() => {
    if (stage !== 2) return;
    
    let animationFrameId;
    const updatePhysics = () => {
      setParticles(prev => prev.map(p => {
        if (p.classified) return p; // Don't move classified particles
        
        let nx = p.x + p.vx;
        let ny = p.y + p.vy;
        
        // Bounce on boundaries
        let nvx = p.vx;
        let nvy = p.vy;
        if (nx < 80 || nx > 520) nvx = -nvx;
        if (ny < 60 || ny > 440) nvy = -nvy;
        
        // Clamp bounds
        nx = Math.max(80, Math.min(520, nx));
        ny = Math.max(60, Math.min(440, ny));

        // Update angle math
        const dx = nx - center.x;
        const dy = ny - center.y;
        let angle = Math.atan2(-dy, dx) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        const isInterior = angle >= 30 && angle <= 120;

        return {
          ...p,
          x: nx,
          y: ny,
          vx: nvx,
          vy: nvy,
          angle,
          isInterior
        };
      }));
      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [stage]);

  // Stage 3 Challenges configuration
  const challenges = [
    {
      name: "Acute Calibration",
      description: "Adjust the angle to be an ACUTE angle (greater than 0° and less than 90°).",
      check: (deg) => deg > 15 && deg < 85,
      hint: "Acute angles are sharp, narrower than a corner square."
    },
    {
      name: "Right Angle Alignment",
      description: "Calibrate the solar hinge to form a perpendicular RIGHT angle (exactly 90°).",
      check: (deg) => Math.abs(deg - 90) <= 2,
      hint: "A right angle is exactly 90 degrees, forming a perfect corner."
    },
    {
      name: "Obtuse Capture",
      description: "Open the tracker to an OBTUSE angle (greater than 90° and less than 180°).",
      check: (deg) => deg > 100 && deg < 170,
      hint: "Obtuse angles are wide, spread further than a square corner."
    },
    {
      name: "Straight Beam Zenith",
      description: "Extend the panels to align as a STRAIGHT angle (exactly 180°).",
      check: (deg) => Math.abs(deg - 180) <= 2,
      hint: "A straight angle forms a flat straight line."
    }
  ];

  // Dragging event handlers for the SVG canvas (Stage 1 and 3)
  const handlePointerDown = (e, armType) => {
    e.preventDefault();
    setDraggingArm(armType);
  };

  const handlePointerMove = (e) => {
    if (!draggingArm) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate polar angle in degrees relative to the center
    const dx = x - center.x;
    const dy = y - center.y;
    let deg = Math.atan2(-dy, dx) * (180 / Math.PI); // cartesian angle
    if (deg < 0) deg += 360;

    if (stage === 1) {
      if (draggingArm === 'arm1') {
        setAngle1(Math.round(deg));
      } else if (draggingArm === 'arm2') {
        setAngle2(Math.round(deg));
      }
    } else if (stage === 3) {
      // In Stage 3, arm1 is static at 0° (facing East), we only manipulate arm2
      setAngle2(Math.round(deg));
    }
  };

  const handlePointerUp = () => {
    setDraggingArm(null);
  };

  // Helper coordinate conversions
  const getCoordinates = (deg) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: center.x + armLength * Math.cos(rad),
      y: center.y - armLength * Math.sin(rad) // inverted y for screen coordinate system
    };
  };

  const c1 = getCoordinates(angle1);
  const c2 = getCoordinates(angle2);

  // Calculates difference angle
  const getDiffAngle = () => {
    let diff = Math.abs(angle2 - angle1);
    if (diff > 180) diff = 360 - diff;
    return Math.round(diff);
  };

  const currentDiffAngle = getDiffAngle();

  // Validate targets for Stage 1 (Real-time indicators)
  const stage1Target1Matched = Math.abs(currentDiffAngle - 45) <= 2;
  const stage1Target2Matched = Math.abs(currentDiffAngle - 120) <= 2;

  // Persist check offs when matched once in Stage 1
  useEffect(() => {
    if (stage === 1) {
      if (stage1Target1Matched && !hasAligned45) {
        setHasAligned45(true);
        setXp(x => x + 15);
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { x: 0.6, y: 0.5 }
        });
      }
      if (stage1Target2Matched && !hasAligned120) {
        setHasAligned120(true);
        setXp(x => x + 15);
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { x: 0.6, y: 0.5 }
        });
      }
    }
  }, [stage1Target1Matched, stage1Target2Matched, stage]);

  // Handles particle classification inside Stage 2
  const classifyParticle = (p, selection) => {
    const correct = p.isInterior === (selection === 'interior');
    
    setParticles(prev => prev.map(item => {
      if (item.id === p.id) {
        return {
          ...item,
          classified: true,
          userSelection: selection,
          correct
        };
      }
      return item;
    }));

    if (correct) {
      setScore(s => s + 1);
      setXp(x => x + 15);
      confetti({
        particleCount: 15,
        spread: 30,
        origin: { x: p.x / 600, y: p.y / 500 }
      });
    } else {
      setXp(x => Math.max(0, x - 5));
    }
  };

  // Handle stage transitions
  const advanceStage = () => {
    if (stage === 1) {
      setStage(2);
      setScore(0);
    } else if (stage === 2) {
      setStage(3);
      setAngle1(0); // static arm at 0 degrees
      setAngle2(45); // initial dynamic arm
    } else if (stage === 3) {
      confetti({ particleCount: 150, spread: 80 });
      onBackToDashboard();
    }
  };

  const handleStage3Verify = () => {
    const currentChallengeCheck = challenges[currentChallenge];
    if (currentChallengeCheck.check(angle2)) {
      setXp(x => x + 25);
      confetti({
        particleCount: 40,
        spread: 50
      });
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
      } else {
        // Completed all challenges
        setCalibrationProgress(100);
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      color: 'var(--text-main)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Top Header */}
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
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            <ArrowLeft size={16} /> Back to Chapters
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={20} style={{ color: '#a78bfa' }} />
              Activity 2.5: Angles & Beam Lab
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 6 Geometry • Basic Geometrical Ideas</span>
          </div>
        </div>

        {/* Progress indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(167, 139, 250, 0.1)', border: '1px solid rgba(167, 139, 250, 0.2)', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>
            <Zap size={14} style={{ color: '#a78bfa' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#a78bfa' }}>{xp} XP</span>
          </div>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {[1, 2, 3].map(s => (
              <div
                key={s}
                style={{
                  width: '32px',
                  height: '6px',
                  borderRadius: '3px',
                  background: stage >= s ? '#a78bfa' : 'rgba(255, 255, 255, 0.1)',
                  transition: 'background-color 0.3s'
                }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Lab Contents */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        flex: 1,
        minHeight: 'calc(100vh - 75px)'
      }}>
        {/* Left Control Panel / Instructions */}
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
                background: 'rgba(167, 139, 250, 0.15)',
                color: '#c084fc',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                Stage {stage} of 3
              </span>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                {stage === 1 && "Anatomy of an Angle"}
                {stage === 2 && "Interior vs Exterior"}
                {stage === 3 && "Beam Calibration"}
              </h2>
            </div>

            {/* Instruction description cards */}
            {stage === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                <p>
                  An <strong>angle</strong> is formed when two rays share a common starting point called a <strong>vertex</strong>. The two rays are called the <strong>arms</strong> of the angle.
                </p>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>Task Checklist:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" checked={hasAligned45} readOnly style={{ accentColor: '#a78bfa' }} />
                      <span style={{ color: hasAligned45 ? '#a7f3d0' : 'inherit' }}>Align panels to exactly 45°</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" checked={hasAligned120} readOnly style={{ accentColor: '#a78bfa' }} />
                      <span style={{ color: hasAligned120 ? '#a7f3d0' : 'inherit' }}>Align panels to exactly 120°</span>
                    </div>
                  </div>
                </div>
                <div style={{ background: 'rgba(167, 139, 250, 0.05)', borderLeft: '3px solid #a78bfa', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0', fontSize: '0.8rem' }}>
                  <strong>How to rotate:</strong> Click and drag the glowing round indicators at the ends of the arms to swing the solar tracker beams.
                </div>
              </div>
            )}

            {stage === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                <p>
                  An angle divides the space around it into regions:
                </p>
                <ul>
                  <li><strong>Interior</strong>: The green-tinted area bounded between the arms.</li>
                  <li><strong>Exterior</strong>: The dark space outside the boundaries of the arms.</li>
                </ul>
                <p>
                  Floaters are drifting into the laser scan. Match each particle by selecting whether it is in the <strong>Interior</strong> or <strong>Exterior</strong> region of the laser angle.
                </p>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>Success Target:</span>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Classify particles correctly to charge the beacon.</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, (score / 5) * 100)}%`, height: '100%', background: '#10b981', transition: 'all 0.3s' }} />
                    </div>
                    <span style={{ fontWeight: '600', color: '#10b981', minWidth: '35px', textAlign: 'right' }}>{score}/5</span>
                  </div>
                </div>
              </div>
            )}

            {stage === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                <p>
                  Calibrate the angle range tracker to complete the solar grid sequence. Adjust the dynamic arm to match the active challenge.
                </p>
                
                <div style={{ background: 'rgba(167, 139, 250, 0.05)', border: '1px solid rgba(167, 139, 250, 0.15)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 'bold', display: 'block', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Challenge {currentChallenge + 1} of 4:
                  </span>
                  <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {challenges[currentChallenge].name}
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {challenges[currentChallenge].description}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Classifications Guide:</span>
                  <div style={{ fontSize: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <div>• <strong>Acute</strong>: 0° to 90°</div>
                    <div>• <strong>Right</strong>: Exactly 90°</div>
                    <div>• <strong>Obtuse</strong>: 90° to 180°</div>
                    <div>• <strong>Straight</strong>: Exactly 180°</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ marginTop: '1.5rem' }}>
            {stage === 1 && (
              <button
                disabled={!(hasAligned45 && hasAligned120)}
                onClick={advanceStage}
                style={{
                  width: '100%',
                  background: (hasAligned45 && hasAligned120) ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' : 'rgba(255, 255, 255, 0.05)',
                  color: (hasAligned45 && hasAligned120) ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: (hasAligned45 && hasAligned120) ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: (hasAligned45 && hasAligned120) ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Next Stage <Play size={14} fill={ (hasAligned45 && hasAligned120) ? "#ffffff" : "transparent" } />
              </button>
            )}

            {stage === 2 && (
              <button
                disabled={score < 5}
                onClick={advanceStage}
                style={{
                  width: '100%',
                  background: score >= 5 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.05)',
                  color: score >= 5 ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: score >= 5 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: score >= 5 ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Proceed to Calibration <Play size={14} fill={score >= 5 ? "#ffffff" : "transparent"} />
              </button>
            )}

            {stage === 3 && (
              <button
                onClick={calibrationProgress >= 100 ? advanceStage : handleStage3Verify}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                {calibrationProgress >= 100 ? "Finish Lab" : "Verify Angle"}
                <CheckCircle size={16} />
              </button>
            )}
          </div>
        </aside>

        {/* Right Sandbox Canvas Area */}
        <main style={{
          background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '2rem',
          overflow: 'hidden'
        }}>
          {/* Target Alignment boxes for Stage 1 */}
          {stage === 1 && (
            <div style={{
              position: 'absolute',
              top: '20px',
              display: 'flex',
              gap: '1.5rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '0.6rem 1.2rem',
              borderRadius: '12px',
              backdropFilter: 'blur(4px)'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Target Alignments:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: stage1Target1Matched ? '#10b981' : '#ef4444' }} />
                <span style={{ color: stage1Target1Matched ? '#10b981' : 'inherit', fontWeight: '500' }}>45° (Acute)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: stage1Target2Matched ? '#10b981' : '#ef4444' }} />
                <span style={{ color: stage1Target2Matched ? '#10b981' : 'inherit', fontWeight: '500' }}>120° (Obtuse)</span>
              </div>
            </div>
          )}

          {/* Interactive SVG workspace */}
          <div style={{
            position: 'relative',
            width: '600px',
            height: '500px',
            background: 'rgba(30, 41, 59, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)'
          }}>
            <svg
              ref={canvasRef}
              width="100%"
              height="100%"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{ touchAction: 'none', cursor: draggingArm ? 'grabbing' : 'default' }}
            >
              {/* Grid Background */}
              <defs>
                <pattern id="radar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
                </pattern>
                <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(253, 224, 71, 0.2)" />
                  <stop offset="100%" stopColor="rgba(253, 224, 71, 0)" />
                </radialGradient>
                <radialGradient id="interior-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(167, 139, 250, 0.15)" />
                  <stop offset="100%" stopColor="rgba(167, 139, 250, 0.02)" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#radar-grid)" />

              {/* Concentric helper circles for aesthetic radar look */}
              <circle cx={center.x} cy={center.y} r="100" fill="none" stroke="rgba(255,255,255,0.015)" strokeDasharray="5,5" />
              <circle cx={center.x} cy={center.y} r="180" fill="none" stroke="rgba(255,255,255,0.02)" />

              {/* Sun source element in Center */}
              <circle cx={center.x} cy={center.y} r="60" fill="url(#sun-glow)" />
              <circle cx={center.x} cy={center.y} r="10" fill="#fde047" filter="drop-shadow(0 0 6px #f59e0b)" />

              {/* Highlight Angle Interior Zone */}
              {stage === 2 && (
                <path
                  d={`M ${center.x} ${center.y} 
                     L ${center.x + 220 * Math.cos((30 * Math.PI) / 180)} ${center.y - 220 * Math.sin((30 * Math.PI) / 180)} 
                     A 220 220 0 0 0 ${center.x + 220 * Math.cos((120 * Math.PI) / 180)} ${center.y - 220 * Math.sin((120 * Math.PI) / 180)} 
                     Z`}
                  fill="rgba(16, 185, 129, 0.08)"
                  stroke="rgba(16, 185, 129, 0.2)"
                  strokeDasharray="4,4"
                />
              )}

              {/* General Dynamic Angle Filled Sector (Stage 1 and 3) */}
              {stage !== 2 && (
                <path
                  d={`M ${center.x} ${center.y} 
                     L ${center.x + 80 * Math.cos((angle1 * Math.PI) / 180)} ${center.y - 80 * Math.sin((angle1 * Math.PI) / 180)} 
                     A 80 80 0 ${Math.abs(angle2 - angle1) > 180 ? 1 : 0} ${angle1 > angle2 ? 1 : 0} ${center.x + 80 * Math.cos((angle2 * Math.PI) / 180)} ${center.y - 80 * Math.sin((angle2 * Math.PI) / 180)} 
                     Z`}
                  fill="rgba(167, 139, 250, 0.12)"
                />
              )}

              {/* Laser Beam Rays (Arms) */}
              {stage === 2 ? (
                // Static Arms in Stage 2 (30° and 120°)
                <>
                  <line
                    x1={center.x}
                    y1={center.y}
                    x2={center.x + armLength * Math.cos((30 * Math.PI) / 180)}
                    y2={center.y - armLength * Math.sin((30 * Math.PI) / 180)}
                    stroke="#10b981"
                    strokeWidth="3"
                    filter="drop-shadow(0 0 4px #10b981)"
                  />
                  <line
                    x1={center.x}
                    y1={center.y}
                    x2={center.x + armLength * Math.cos((120 * Math.PI) / 180)}
                    y2={center.y - armLength * Math.sin((120 * Math.PI) / 180)}
                    stroke="#10b981"
                    strokeWidth="3"
                    filter="drop-shadow(0 0 4px #10b981)"
                  />
                </>
              ) : (
                // Dynamic drag arms (Stage 1 and 3)
                <>
                  <line
                    x1={center.x}
                    y1={center.y}
                    x2={c1.x}
                    y2={c1.y}
                    stroke="#818cf8"
                    strokeWidth="3"
                    filter="drop-shadow(0 0 4px #818cf8)"
                  />
                  <line
                    x1={center.x}
                    y1={center.y}
                    x2={c2.x}
                    y2={c2.y}
                    stroke="#c084fc"
                    strokeWidth="3"
                    filter="drop-shadow(0 0 4px #c084fc)"
                  />
                </>
              )}

              {/* Dynamic Angle text indicators overlay */}
              {stage !== 2 && (
                <text
                  x={center.x + 95 * Math.cos(((angle1 + angle2) / 2 + (Math.abs(angle1 - angle2) > 180 ? 180 : 0)) * Math.PI / 180)}
                  y={center.y - 95 * Math.sin(((angle1 + angle2) / 2 + (Math.abs(angle1 - angle2) > 180 ? 180 : 0)) * Math.PI / 180)}
                  fill="#c084fc"
                  fontSize="13"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  style={{ userSelect: 'none', filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))' }}
                >
                  {currentDiffAngle}°
                </text>
              )}

              {/* Interactive Drag Handles (Knobs) */}
              {stage !== 2 && (
                <>
                  {stage === 1 && (
                    <circle
                      cx={c1.x}
                      cy={c1.y}
                      r="12"
                      fill="#818cf8"
                      stroke="#ffffff"
                      strokeWidth="2"
                      style={{ cursor: 'grab' }}
                      onPointerDown={(e) => handlePointerDown(e, 'arm1')}
                      filter="drop-shadow(0 0 6px #818cf8)"
                    />
                  )}
                  <circle
                    cx={c2.x}
                    cy={c2.y}
                    r="12"
                    fill="#c084fc"
                    stroke="#ffffff"
                    strokeWidth="2"
                    style={{ cursor: 'grab' }}
                    onPointerDown={(e) => handlePointerDown(e, 'arm2')}
                    filter="drop-shadow(0 0 6px #c084fc)"
                  />
                </>
              )}

              {/* Vertex Label */}
              <circle cx={center.x} cy={center.y} r="6" fill="#ffffff" />
              <text
                x={center.x}
                y={center.y + 22}
                fill="#ffffff"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
                style={{ userSelect: 'none', letterSpacing: '0.05em' }}
              >
                VERTEX
              </text>
              
              {/* Ray Labels */}
              {stage === 1 && (
                <>
                  <text x={c1.x} y={c1.y - 18} fill="#818cf8" fontSize="10" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none' }}>ARM A</text>
                  <text x={c2.x} y={c2.y - 18} fill="#c084fc" fontSize="10" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none' }}>ARM B</text>
                </>
              )}
            </svg>

            {/* Floatings Particles & UI triggers for Stage 2 */}
            {stage === 2 && particles.map(p => (
              <div
                key={p.id}
                style={{
                  position: 'absolute',
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20
                }}
              >
                {/* Floater design */}
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: p.classified
                      ? (p.correct ? '#10b981' : '#ef4444')
                      : 'radial-gradient(circle, #f472b6 0%, #db2777 100%)',
                    border: '2px solid #ffffff',
                    boxShadow: '0 0 8px rgba(219, 39, 119, 0.6)',
                    cursor: p.classified ? 'default' : 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => { if(!p.classified) e.target.style.transform = 'scale(1.25)'; }}
                  onMouseOut={(e) => { if(!p.classified) e.target.style.transform = 'scale(1)'; }}
                />

                {/* Popover action triggers */}
                {!p.classified && (
                  <div
                    style={{
                      marginTop: '6px',
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '2px',
                      display: 'flex',
                      gap: '2px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                    }}
                  >
                    <button
                      onClick={() => classifyParticle(p, 'interior')}
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: 'none',
                        color: '#10b981',
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Interior
                    </button>
                    <button
                      onClick={() => classifyParticle(p, 'exterior')}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: 'none',
                        color: '#f87171',
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Exterior
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Feedback details overlay footer */}
          <div style={{
            marginTop: '1.5rem',
            width: '600px',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            {stage === 1 && (
              <span>Move the arms to test different angles. Can you spot how the vertex point remains completely stationary?</span>
            )}
            {stage === 2 && (
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Shield size={14} /> The interior region is the region shaded in green. Classify floaters inside vs outside.
              </span>
            )}
            {stage === 3 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <span>Currently Selected: <strong>{angle2}°</strong></span>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  color: angle2 < 90 ? '#a7f3d0' : angle2 === 90 ? '#60a5fa' : angle2 < 180 ? '#fde047' : '#f87171'
                }}>
                  {angle2 < 90 && "Acute Angle"}
                  {angle2 === 90 && "Right Angle"}
                  {angle2 > 90 && angle2 < 180 && "Obtuse Angle"}
                  {angle2 === 180 && "Straight Angle"}
                  {angle2 > 180 && "Reflex Angle"}
                </span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
