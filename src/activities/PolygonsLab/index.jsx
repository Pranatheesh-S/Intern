import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Hammer,
  Zap,
  Award,
  RefreshCw,
  Play,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PolygonsLab({ onBackToDashboard }) {
  const [stage, setStage] = useState(1);
  const [selectedPegs, setSelectedPegs] = useState([]); // List of {x, y, id}
  const [polygonClosed, setPolygonClosed] = useState(false);
  const [currentShapeType, setCurrentShapeType] = useState('None');
  const [stage2Task, setStage2Task] = useState(1); // 1: Adjacent Sides, 2: Opposite Sides, 3: Opposite Angles
  const [selectedElements, setSelectedElements] = useState([]); // for Stage 2 selections
  const [bridgeRigid, setBridgeRigid] = useState(false); // Stage 3 reinforces state
  const [stressTesting, setStressTesting] = useState(false);
  const [stressResult, setStressResult] = useState(null); // 'collapsed' or 'passed'
  const [xp, setXp] = useState(0);

  // Stage 1 interactive drawing-drag states
  const [isDrawingDrag, setIsDrawingDrag] = useState(false);
  const [dragCursorPos, setDragCursorPos] = useState(null);

  // Stage 3 interactive dragging states & handlers
  const [draggingNode, setDraggingNode] = useState(null); // 'triangleTop' | 'quadTopLeft' | 'quadTopRight'
  const [quadShear, setQuadShear] = useState(0);
  const [dragFeedback, setDragFeedback] = useState("");
  const svgRef = React.useRef(null);

  const handlePegPointerDown = (e, peg) => {
    if (polygonClosed || stage !== 1) return;
    e.preventDefault();
    setIsDrawingDrag(true);
    
    // Convert client coordinates to SVG coordinates
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDragCursorPos({ x, y });

    // Handle normal selection click logic
    if (selectedPegs.length >= 3 && peg.id === selectedPegs[0].id) {
      setSelectedPegs(prev => [...prev, peg]);
      setIsDrawingDrag(false);
      setDragCursorPos(null);
      confetti({ particleCount: 20, spread: 40 });
      return;
    }

    if (selectedPegs.length > 0 && peg.id === selectedPegs[selectedPegs.length - 1].id) {
      return;
    }

    if (selectedPegs.some(p => p.id === peg.id)) {
      return;
    }

    setSelectedPegs(prev => [...prev, peg]);
  };

  const handlePointerDown = (e, node) => {
    if (stressTesting) return;
    e.preventDefault();
    setDraggingNode(node);
    setStressResult(null);
    if (node === 'triangleTop') {
      setDragFeedback("Triangle is rigid! Its angles cannot change without altering side lengths.");
    } else if (node === 'quadTopLeft' || node === 'quadTopRight') {
      if (bridgeRigid) {
        setDragFeedback("Locked! The diagonal strut splits it into two rigid triangles.");
      } else {
        setDragFeedback("Deforming! Drag left/right to shear the quadrilateral deck.");
      }
    }
  };

  const handlePointerMove = (e) => {
    if (stage === 1 && isDrawingDrag) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setDragCursorPos({ x, y });

      // Proximity detection for grid pegs
      for (const peg of pegs) {
        const dist = Math.sqrt((peg.x - x) ** 2 + (peg.y - y) ** 2);
        if (dist < 18) { // peg snap radius
          // If start peg and we have at least 3 points, close it
          if (selectedPegs.length >= 3 && peg.id === selectedPegs[0].id) {
            if (selectedPegs[selectedPegs.length - 1].id !== peg.id) {
              setSelectedPegs(prev => [...prev, peg]);
              setIsDrawingDrag(false);
              setDragCursorPos(null);
              confetti({ particleCount: 25, spread: 45 });
            }
            return;
          }

          // Ignore if already selected
          if (selectedPegs.some(p => p.id === peg.id)) {
            continue;
          }

          // Otherwise, connect the peg!
          setSelectedPegs(prev => [...prev, peg]);
          break;
        }
      }
      return;
    }

    if (stage === 3 && draggingNode) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (draggingNode === 'triangleTop') {
        return;
      }
      if (draggingNode === 'quadTopLeft' || draggingNode === 'quadTopRight') {
        if (bridgeRigid) {
          const originalX = draggingNode === 'quadTopLeft' ? 370 : 450;
          const diff = x - originalX;
          setQuadShear(Math.max(-2, Math.min(2, diff)));
        } else {
          const originalX = draggingNode === 'quadTopLeft' ? 370 : 450;
          const diff = x - originalX;
          setQuadShear(Math.max(-40, Math.min(40, diff)));
        }
      }
    }
  };

  const handlePointerUp = () => {
    if (stage === 1) {
      setIsDrawingDrag(false);
      setDragCursorPos(null);
    }
    if (stage === 3) {
      setDraggingNode(null);
      setDragFeedback("");
      setQuadShear(0); // Snap back to normal
    }
  };

  // Stage 1 Peg Grid coordinates (4x4)
  const pegs = [];
  const startX = 150;
  const startY = 100;
  const spacing = 100;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      pegs.push({
        id: r * 4 + c,
        x: startX + c * spacing,
        y: startY + r * spacing
      });
    }
  }

  // Polygon validation logic for Stage 1
  useEffect(() => {
    if (selectedPegs.length < 3) {
      setPolygonClosed(false);
      setCurrentShapeType('None');
      return;
    }

    // Check if the last point connects back to the first point
    const first = selectedPegs[0];
    const last = selectedPegs[selectedPegs.length - 1];
    
    // We auto-close or allow user to click the first peg again to close it
    const closed = selectedPegs.length >= 3 && first.id === last.id;
    setPolygonClosed(closed);

    if (closed) {
      const verticesCount = selectedPegs.length - 1; // subtract the duplicated close vertex
      if (verticesCount === 3) {
        setCurrentShapeType('Triangle (3 Vertices, 3 Sides)');
        setXp(x => x + 10);
      } else if (verticesCount === 4) {
        setCurrentShapeType('Quadrilateral (4 Vertices, 4 Sides)');
        setXp(x => x + 15);
      } else if (verticesCount === 5) {
        setCurrentShapeType('Pentagon (5 Vertices, 5 Sides)');
        setXp(x => x + 20);
      } else {
        setCurrentShapeType(`Polygon with ${verticesCount} Sides`);
      }
    } else {
      setCurrentShapeType('Open Chain (Not closed)');
    }
  }, [selectedPegs]);

  const handlePegClick = (peg) => {
    if (polygonClosed) return; // Reset needed to draw a new polygon

    // Check if clicking the first peg to close
    if (selectedPegs.length >= 3 && peg.id === selectedPegs[0].id) {
      setSelectedPegs(prev => [...prev, peg]);
      confetti({ particleCount: 20, spread: 40 });
      return;
    }

    // Prevent duplicate consecutive taps
    if (selectedPegs.length > 0 && peg.id === selectedPegs[selectedPegs.length - 1].id) {
      return;
    }

    // Prevent duplicate non-start nodes inside the path (no self-intersections for standard geometry)
    if (selectedPegs.some(p => p.id === peg.id)) {
      return;
    }

    setSelectedPegs(prev => [...prev, peg]);
  };

  const handleResetStage1 = () => {
    setSelectedPegs([]);
    setPolygonClosed(false);
    setCurrentShapeType('None');
  };

  // Stage 2 setup nodes
  // Pre-drawn Quadrilateral ABCD: A(200, 150), B(400, 150), C(450, 320), D(180, 320)
  const quadNodes = {
    A: { name: 'A', x: 220, y: 140 },
    B: { name: 'B', x: 380, y: 140 },
    C: { name: 'C', x: 440, y: 300 },
    D: { name: 'D', x: 160, y: 300 }
  };

  const stage2TaskAnswers = {
    1: {
      desc: "Tap two ADJACENT SIDES (sides sharing a common vertex pin, e.g. AB and BC).",
      validate: (selected) => {
        if (selected.length !== 2) return false;
        const [s1, s2] = selected;
        // adjacent sides must share a common letter in their names
        const chars = (s1 + s2).split('');
        const uniqueChars = new Set(chars);
        return uniqueChars.size === 3; // e.g. AB + BC -> A, B, C (3 letters, B shared)
      }
    },
    2: {
      desc: "Tap two OPPOSITE SIDES (sides sharing no common vertices, e.g. AB and CD).",
      validate: (selected) => {
        if (selected.length !== 2) return false;
        const [s1, s2] = selected;
        const chars = (s1 + s2).split('');
        const uniqueChars = new Set(chars);
        return uniqueChars.size === 4; // e.g. AB + CD -> A, B, C, D (no common letter)
      }
    },
    3: {
      desc: "Tap two OPPOSITE ANGLES (angles at opposite corners, e.g. Angle A and Angle C).",
      validate: (selected) => {
        if (selected.length !== 2) return false;
        const [a1, a2] = selected;
        return (a1 === 'A' && a2 === 'C') || (a1 === 'C' && a2 === 'A') ||
               (a1 === 'B' && a2 === 'D') || (a1 === 'D' && a2 === 'B');
      }
    }
  };

  const handleStage2Select = (elementName) => {
    if (selectedElements.includes(elementName)) {
      setSelectedElements(prev => prev.filter(e => e !== elementName));
      return;
    }
    if (selectedElements.length < 2) {
      setSelectedElements(prev => [...prev, elementName]);
    }
  };

  const verifyStage2Selection = () => {
    const current = stage2TaskAnswers[stage2Task];
    if (current.validate(selectedElements)) {
      setXp(x => x + 20);
      confetti({ particleCount: 30, spread: 40 });
      if (stage2Task < 3) {
        setStage2Task(t => t + 1);
        setSelectedElements([]);
      } else {
        // Complete Stage 2
        setStage(3);
        setSelectedElements([]);
      }
    } else {
      setSelectedElements([]);
      setXp(x => Math.max(0, x - 5));
      alert("Incorrect selection! Review adjacent or opposite rules in the sidebar and try again.");
    }
  };

  // Stage 3 Bridge Stress Test simulation
  const handleStressTest = () => {
    setStressTesting(true);
    setStressResult(null);

    // Simulate 3 seconds vibration/loading
    setTimeout(() => {
      setStressTesting(false);
      if (bridgeRigid) {
        setStressResult('passed');
        setXp(x => x + 50);
        confetti({ particleCount: 100, spread: 70 });
      } else {
        setStressResult('collapsed');
        setXp(x => Math.max(0, x - 10));
      }
    }, 2500);
  };

  const advanceStage = () => {
    if (stage === 1) {
      setStage(2);
    } else if (stage === 3) {
      onBackToDashboard();
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
              <Hammer size={20} style={{ color: '#60a5fa' }} />
              Activity 2.6: Polygon Bridge Builder
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 6 Geometry • Basic Geometrical Ideas</span>
          </div>
        </div>

        {/* XP and Stage Tracker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.2)', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>
            <Zap size={14} style={{ color: '#60a5fa' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#60a5fa' }}>{xp} XP</span>
          </div>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {[1, 2, 3].map(s => (
              <div
                key={s}
                style={{
                  width: '32px',
                  height: '6px',
                  borderRadius: '3px',
                  background: stage >= s ? '#60a5fa' : 'rgba(255, 255, 255, 0.1)',
                  transition: 'background-color 0.3s'
                }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Grid Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        flex: 1,
        minHeight: 'calc(100vh - 75px)'
      }}>
        {/* Left Sidebar */}
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
                background: 'rgba(96, 165, 250, 0.15)',
                color: '#60a5fa',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                Stage {stage} of 3
              </span>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                {stage === 1 && "Polygon Assembly"}
                {stage === 2 && "Adjacent vs Opposite"}
                {stage === 3 && "Stress Test & Diagonals"}
              </h2>
            </div>

            {stage === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                <div style={{ background: 'rgba(96, 165, 250, 0.08)', borderLeft: '3px solid #60a5fa', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0' }}>
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>YOUR MISSION:</strong>
                  Assemble a closed polygon shape (e.g. Triangle or Quadrilateral) on the grid!
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>Steps to Play:</span>
                  <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <li><strong>Drag-Draw</strong> or <strong>Tap</strong> pegs consecutively to connect them with side beams.</li>
                    <li>Connect the final beam back to the <strong>starting peg</strong> to fully close the loop.</li>
                  </ul>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                  <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Active Shape:</span>
                  <strong style={{ color: polygonClosed ? '#10b981' : '#f59e0b', fontSize: '0.9rem' }}>{currentShapeType}</strong>
                </div>
              </div>
            )}

            {stage === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                <div style={{ background: 'rgba(96, 165, 250, 0.08)', borderLeft: '3px solid #60a5fa', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0' }}>
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>YOUR MISSION:</strong>
                  Identify geometric relationships in the quadrilateral ABCD.
                </div>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <li><strong>Adjacent Sides</strong>: Share a corner peg (e.g. AB and BC share peg B).</li>
                  <li><strong>Opposite Sides</strong>: Parallel/facing sides that do not touch (e.g. AB and CD).</li>
                  <li><strong>Opposite Angles</strong>: Diagonal corners facing each other (e.g. Angle A and Angle C).</li>
                </ul>
                <div style={{ background: 'rgba(96, 165, 250, 0.05)', border: '1px solid rgba(96, 165, 250, 0.15)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 'bold', display: 'block', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Task {stage2Task} of 3:
                  </span>
                  <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '500' }}>
                    {stage2TaskAnswers[stage2Task].desc}
                  </p>
                </div>
              </div>
            )}

            {stage === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                <div style={{ background: 'rgba(96, 165, 250, 0.08)', borderLeft: '3px solid #60a5fa', padding: '0.75rem 1rem', borderRadius: '0 8px 8px 0' }}>
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>YOUR MISSION:</strong>
                  Reinforce the right side of the bridge so it doesn't collapse!
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>Steps to Solve:</span>
                  <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <li><strong>Drag the top joints</strong> of the red deck left/right to see how easily an unbraced quadrilateral shears and collapses.</li>
                    <li>Click <strong>"Add Diagonal Strut"</strong> to divide the quadrilateral into two rigid triangles. Try dragging the joints now to feel the difference!</li>
                    <li>Click <strong>"Run Stress Test"</strong> to safely guide the train across!</li>
                  </ol>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>Task Checklist:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" checked={bridgeRigid} readOnly style={{ accentColor: '#60a5fa' }} />
                    <span style={{ color: bridgeRigid ? '#a7f3d0' : 'inherit' }}>Reinforce with diagonal bracing</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action trigger footer buttons */}
          <div style={{ marginTop: '1.5rem' }}>
            {stage === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={handleResetStage1}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-main)',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <RefreshCw size={14} /> Clear Polygon
                </button>
                <button
                  disabled={!polygonClosed}
                  onClick={advanceStage}
                  style={{
                    width: '100%',
                    background: polygonClosed ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'rgba(255, 255, 255, 0.05)',
                    color: polygonClosed ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                    border: 'none',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: polygonClosed ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: polygonClosed ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Confirm Polygon <Play size={14} fill={polygonClosed ? "#ffffff" : "transparent"} />
                </button>
              </div>
            )}

            {stage === 2 && (
              <button
                disabled={selectedElements.length !== 2}
                onClick={verifyStage2Selection}
                style={{
                  width: '100%',
                  background: selectedElements.length === 2 ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedElements.length === 2 ? '#ffffff' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: selectedElements.length === 2 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                Verify Selection <CheckCircle size={16} />
              </button>
            )}

            {stage === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    setBridgeRigid(r => !r);
                    setStressResult(null);
                  }}
                  style={{
                    width: '100%',
                    background: bridgeRigid ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: bridgeRigid ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
                    color: bridgeRigid ? '#60a5fa' : 'var(--text-main)',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  {bridgeRigid ? "Remove Diagonal Strut" : "Add Diagonal Strut (Bracing)"}
                </button>
                
                <button
                  onClick={stressResult === 'passed' ? advanceStage : handleStressTest}
                  disabled={stressTesting}
                  style={{
                    width: '100%',
                    background: stressResult === 'passed' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: stressTesting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                  }}
                >
                  {stressTesting ? "Stress Testing..." : stressResult === 'passed' ? "Finish Lab" : "Run Stress Test"}
                  <CheckCircle size={16} />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Work Area */}
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
          {/* Header readout overlays for current selection / stress status */}
          <div style={{
            position: 'absolute',
            top: '20px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '0.6rem 1.2rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            display: 'flex',
            gap: '1rem'
          }}>
            {stage === 1 && (
              <span>Polygons must be fully closed loops. Tap peg coordinates to trace beams.</span>
            )}
            {stage === 2 && (
              <span>Selected Element Names: <strong style={{ color: '#60a5fa' }}>{selectedElements.join(', ') || 'None'}</strong></span>
            )}
            {stage === 3 && (
              <span style={{ color: dragFeedback ? '#facc15' : stressResult === 'collapsed' ? '#f87171' : stressResult === 'passed' ? '#34d399' : 'inherit', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {dragFeedback ? (
                  dragFeedback
                ) : stressResult === 'collapsed' ? (
                  <><AlertTriangle size={14} /> Bridge Collapsed! Quadrilaterals shear under compression.</>
                ) : stressResult === 'passed' ? (
                  <><CheckCircle size={14} /> Bridge holds firm! Diagonal cables successfully distribute load through triangulation.</>
                ) : (
                  "Drag the top joints left/right to test their rigidity, or run the stress test!"
                )}
              </span>
            )}
          </div>

          {/* Sandbox Canvas box */}
          <div style={{
            position: 'relative',
            width: '600px',
            height: '450px',
            background: 'rgba(30, 41, 59, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)'
          }}>
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{ touchAction: 'none' }}
            >
              {/* Pattern and gradient defs */}
              <defs>
                <pattern id="radar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
                </pattern>
                <linearGradient id="cliff-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                <linearGradient id="grass-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>

              {/* Pattern grids */}
              <rect width="100%" height="100%" fill="url(#radar-grid)" />

              {/* Stage 1 Render components */}
              {stage === 1 && (
                <>
                  {/* Peg Grid points */}
                  {pegs.map(p => {
                    const isSelected = selectedPegs.some(sel => sel.id === p.id);
                    return (
                      <circle
                        key={p.id}
                        cx={p.x}
                        cy={p.y}
                        r="12" // larger hit target for better touch/drag accuracy
                        fill={isSelected ? '#60a5fa' : 'rgba(255, 255, 255, 0.15)'}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? '2' : '1'}
                        style={{ cursor: 'pointer', touchAction: 'none' }}
                        onPointerDown={(e) => handlePegPointerDown(e, p)}
                        filter={isSelected ? 'drop-shadow(0 0 8px #60a5fa)' : 'none'}
                      />
                    );
                  })}

                  {/* Temporary dashed rubber-band line during active drag-drawing */}
                  {isDrawingDrag && dragCursorPos && selectedPegs.length > 0 && !polygonClosed && (
                    <line
                      x1={selectedPegs[selectedPegs.length - 1].x}
                      y1={selectedPegs[selectedPegs.length - 1].y}
                      x2={dragCursorPos.x}
                      y2={dragCursorPos.y}
                      stroke="#60a5fa"
                      strokeWidth="2.5"
                      strokeDasharray="4,4"
                      opacity="0.7"
                      style={{ pointerEvents: 'none' }}
                    />
                  )}

                  {/* Draw edges (Lines) connecting pegs */}
                  {selectedPegs.map((peg, idx) => {
                    if (idx === 0) return null;
                    const prev = selectedPegs[idx - 1];
                    return (
                      <line
                        key={`edge-${idx}`}
                        x1={prev.x}
                        y1={prev.y}
                        x2={peg.x}
                        y2={peg.y}
                        stroke="#60a5fa"
                        strokeWidth="3"
                        filter="drop-shadow(0 0 4px #60a5fa)"
                      />
                    );
                  })}
                </>
              )}

              {/* Stage 2 Pre-drawn Quadrilateral */}
              {stage === 2 && (
                <>
                  {/* Edges of Quadrilateral ABCD (Interactive click zones) */}
                  {[
                    { key: 'AB', x1: quadNodes.A.x, y1: quadNodes.A.y, x2: quadNodes.B.x, y2: quadNodes.B.y },
                    { key: 'BC', x1: quadNodes.B.x, y1: quadNodes.B.y, x2: quadNodes.C.x, y2: quadNodes.C.y },
                    { key: 'CD', x1: quadNodes.C.x, y1: quadNodes.C.y, x2: quadNodes.D.x, y2: quadNodes.D.y },
                    { key: 'DA', x1: quadNodes.D.x, y1: quadNodes.D.y, x2: quadNodes.A.x, y2: quadNodes.A.y }
                  ].map(edge => {
                    const isSelected = selectedElements.includes(edge.key);
                    return (
                      <line
                        key={edge.key}
                        x1={edge.x1}
                        y1={edge.y1}
                        x2={edge.x2}
                        y2={edge.y2}
                        stroke={isSelected ? '#facc15' : 'rgba(255, 255, 255, 0.3)'}
                        strokeWidth={isSelected ? '5' : '3'}
                        filter={isSelected ? 'drop-shadow(0 0 6px #facc15)' : 'none'}
                        style={{ cursor: stage2Task !== 3 ? 'pointer' : 'default' }}
                        onClick={() => stage2Task !== 3 && handleStage2Select(edge.key)}
                      />
                    );
                  })}

                  {/* Corner nodes for angle tap checks */}
                  {Object.values(quadNodes).map(node => {
                    const isSelected = selectedElements.includes(node.name);
                    return (
                      <g key={node.name} style={{ cursor: stage2Task === 3 ? 'pointer' : 'default' }} onClick={() => stage2Task === 3 && handleStage2Select(node.name)}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="12"
                          fill={isSelected ? '#facc15' : 'rgba(255, 255, 255, 0.1)'}
                          stroke="#ffffff"
                          strokeWidth="2"
                          filter={isSelected ? 'drop-shadow(0 0 6px #facc15)' : 'none'}
                        />
                        <text
                          x={node.x}
                          y={node.y + 4}
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                          style={{ userSelect: 'none' }}
                        >
                          {node.name}
                        </text>
                      </g>
                    );
                  })}
                </>
              )}

              {/* Stage 3 Bridge Stress Simulation */}
              {stage === 3 && (
                <>
                  {/* Gorge Abutments (aligned perfectly at y: 220 to prevent floating) */}
                  {/* Left Cliff */}
                  <rect x="0" y="220" width="120" height="8" fill="url(#grass-grad)" />
                  <rect x="0" y="228" width="120" height="222" fill="url(#cliff-grad)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  
                  {/* Right Cliff */}
                  <rect x="480" y="220" width="120" height="8" fill="url(#grass-grad)" />
                  <rect x="480" y="228" width="120" height="222" fill="url(#cliff-grad)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  
                  {/* Gorge Label */}
                  <text x="300" y="380" fill="rgba(255, 255, 255, 0.15)" fontSize="16" fontWeight="bold" textAnchor="middle" letterSpacing="0.1em">RIVER GORGE</text>

                  {/* Bridge deck framework coordinates */}
                  <g style={{
                    transform: (stressTesting && !bridgeRigid) ? 'translateY(15px) rotate(4deg)' : 'none',
                    transformOrigin: '120px 220px',
                    transition: 'transform 1.5s ease-in-out'
                  }}>
                    {/* Triangular side truss (Rigid) */}
                    <polygon points="120,220 220,120 300,220" fill="none" stroke="#60a5fa" strokeWidth="3" />
                    <line x1="120" y1="220" x2="300" y2="220" stroke="#60a5fa" strokeWidth="5" />
                    
                    {/* Quadrilateral side truss (Deforms) */}
                    <polygon
                      points={ (stressTesting && !bridgeRigid) ? "300,220 370,140 450,150 480,220" : `300,220 ${370 + quadShear},120 ${450 + quadShear},120 480,220` }
                      fill="none"
                      stroke={bridgeRigid ? "#60a5fa" : "#f87171"}
                      strokeWidth="3"
                      style={{ transition: stressTesting ? 'points 1.5s ease-in-out' : 'none' }}
                    />
                    <line x1="300" y1="220" x2="480" y2="220" stroke={bridgeRigid ? "#60a5fa" : "#f87171"} strokeWidth="5" />

                    {/* Solid diagonal reinforcing strut if active */}
                    {bridgeRigid && (
                      <line
                        x1="300"
                        y1="220"
                        x2={(stressTesting && !bridgeRigid) ? 450 : (450 + quadShear)}
                        y2={(stressTesting && !bridgeRigid) ? 150 : 120}
                        stroke="#60a5fa"
                        strokeWidth="3"
                        strokeDasharray="4,4"
                        filter="drop-shadow(0 0 4px #60a5fa)"
                      />
                    )}
                  </g>

                  {/* Ghost guiding/interactive line when NOT braced */}
                  {!bridgeRigid && !stressTesting && (
                    <>
                      <line
                        x1="300"
                        y1="220"
                        x2={450 + quadShear}
                        y2={120}
                        stroke="rgba(96, 165, 250, 0.2)"
                        strokeWidth="2.5"
                        strokeDasharray="3,3"
                        style={{ pointerEvents: 'none' }}
                      />
                      <g style={{ cursor: 'pointer' }} onClick={() => setBridgeRigid(true)}>
                        <circle cx={375 + quadShear/2} cy={170} r="14" fill="#0f172a" stroke="#60a5fa" strokeWidth="2" filter="drop-shadow(0 0 6px rgba(96, 165, 250, 0.4))" />
                        <text x={375 + quadShear/2} y={174} fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle">+</text>
                        <text x={375 + quadShear/2} y={193} fill="#60a5fa" fontSize="8" fontWeight="bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>+ BRACE</text>
                      </g>
                    </>
                  )}

                  {/* Interactive remove brace button when braced */}
                  {bridgeRigid && !stressTesting && (
                    <g style={{ cursor: 'pointer' }} onClick={() => setBridgeRigid(false)}>
                      <circle cx={375 + quadShear/2} cy={170} r="12" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5" filter="drop-shadow(0 0 4px rgba(239, 68, 68, 0.3))" />
                      <text x={375 + quadShear/2} y={174} fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle">×</text>
                      <text x={375 + quadShear/2} y={191} fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>REMOVE</text>
                    </g>
                  )}

                  {/* Joint labels & Handles (hidden during stress testing or collapsed state to prevent floating discrepancies) */}
                  {!(stressTesting || stressResult === 'collapsed') && (
                    <>
                      {/* Joint labels */}
                      <text x="220" y="102" fill="#60a5fa" fontSize="8" fontWeight="bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>RIGID POINT</text>
                      <text x={410 + quadShear} y="98" fill={bridgeRigid ? '#34d399' : '#f87171'} fontSize="8" fontWeight="bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>
                        {bridgeRigid ? "BRACED DECK (RIGID)" : "UNBRACED DECK (SHEARABLE)"}
                      </text>

                      {/* Joint handles */}
                      {/* Triangle top node */}
                      <circle
                        key="triangle-top"
                        cx="220"
                        cy="120"
                        r="8"
                        fill="#60a5fa"
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter="drop-shadow(0 0 4px #60a5fa)"
                        style={{ cursor: 'grab' }}
                        onPointerDown={(e) => handlePointerDown(e, 'triangleTop')}
                      />
                      {/* Quadrilateral top-left node */}
                      <circle
                        key="quad-top-left"
                        cx={370 + quadShear}
                        cy={120}
                        r="8"
                        fill={bridgeRigid ? '#34d399' : '#f87171'}
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter={`drop-shadow(0 0 4px ${bridgeRigid ? '#34d399' : '#f87171'})`}
                        style={{ cursor: 'grab' }}
                        onPointerDown={(e) => handlePointerDown(e, 'quadTopLeft')}
                      />
                      {/* Quadrilateral top-right node */}
                      <circle
                        key="quad-top-right"
                        cx={450 + quadShear}
                        cy={120}
                        r="8"
                        fill={bridgeRigid ? '#34d399' : '#f87171'}
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter={`drop-shadow(0 0 4px ${bridgeRigid ? '#34d399' : '#f87171'})`}
                        style={{ cursor: 'grab' }}
                        onPointerDown={(e) => handlePointerDown(e, 'quadTopRight')}
                      />
                    </>
                  )}

                  {/* Animated train/truck moving across during stress test */}
                  {stressTesting && (
                    <g style={{
                      transform: 'translateX(0)',
                      animation: 'trainMove 2.5s linear forwards'
                    }}>
                      <rect x="0" y="195" width="50" height="20" fill="#facc15" rx="3" />
                      <circle cx="10" cy="217" r="4" fill="#ffffff" />
                      <circle cx="40" cy="217" r="4" fill="#ffffff" />
                    </g>
                  )}
                </>
              )}
            </svg>

            {/* Keyframe animation for vehicle movement */}
            <style>{`
              @keyframes trainMove {
                0% { transform: translate(40px, 0); }
                40% { transform: translate(260px, 0); }
                60% { transform: translate(320px, ${!bridgeRigid ? '18px' : '0px'}); }
                100% { transform: translate(520px, ${!bridgeRigid ? '80px' : '0px'}); }
              }
            `}</style>
          </div>
        </main>
      </div>
    </div>
  );
}
