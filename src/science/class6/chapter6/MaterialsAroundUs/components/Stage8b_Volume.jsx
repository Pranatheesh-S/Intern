import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Droplet, CheckCircle2, AlertCircle,
  RefreshCw, Hand, Info, HelpCircle, LayoutGrid, FlaskConical
} from 'lucide-react';

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const GRAVITY      = 900;   // px/s²  — particle sim
const POUR_TILT    = 35;    // degrees — bottle must be at least this tilted to pour
const MAX_TILT     = 75;    // degrees — visual tilt cap while over tumbler
const FILL_SPEED   = 0.30;  // fractional/s how fast the tumbler fills
const PARTICLE_RATE = 3;    // particles per frame while pouring

/* ─────────────────────────────────────────────
   TUMBLER LAYOUT (in the 560-wide SVG canvas)
   Positions are canvas-space (origin = top-left)
───────────────────────────────────────────── */
const TUMBLER_A = { cx: 250, cy: 260, hitR: 90 };
const TUMBLER_B = { cx: 420, cy: 260, hitR: 90 };

/* ─────────────────────────────────────────────
   BOTTLE INITIAL STATE
───────────────────────────────────────────── */
const BOTTLE_INIT = { x: 20, y: 40 }; // canvas-space, bottom-left anchor

const THINK_OPTIONS = [
  "The bottle will hold all the water without any change.",
  "The bottle will overflow because it cannot hold all the water.",
  "The water will disappear when poured into the bottle.",
  "The bottle will become larger to hold the extra water."
];
const THINK_CORRECT_INDEX = 1;

export default function Stage8b_Volume({ onComplete, addXp }) {

  /* ── Bottle position/drag ── */
  const [bottlePos,  setBottlePos]  = useState(BOTTLE_INIT);
  const [isDragging, setIsDragging] = useState(false);
  const [bottleTilt, setBottleTilt] = useState(0);   // visual rotate degrees

  /* ── Water levels ── */
  const [waterLevelA, setWaterLevelA] = useState(0); // 0→0.50
  const [waterLevelB, setWaterLevelB] = useState(0); // 0→0.92
  const [bottleFill,  setBottleFill]  = useState(1.0);

  /* ── Canvas for realistic water stream ── */
  const canvasRef = useRef(null);
  const dropletsRef = useRef([]);
  const ripplesRef = useRef([]);
  const rippleIdRef = useRef(0);

  /* ── Think-more ── */
  const [selectedOption, setSelectedOption] = useState(null);
  const [thinkFeedback, setThinkFeedback] = useState(null);

  /* ── Refs (physics loop reads these synchronously) ── */
  const containerRef    = useRef(null);
  const grabOffsetRef   = useRef({ x: 0, y: 0 });
  const bottlePosRef    = useRef(BOTTLE_INIT);
  const isDraggingRef   = useRef(false);
  const bottleTiltRef   = useRef(0);
  const waterLevelARef  = useRef(0);
  const waterLevelBRef  = useRef(0);
  const bottleFillRef   = useRef(1.0);
  const animFrameRef    = useRef(null);
  const lastTimeRef     = useRef(performance.now());
  const activeTargetRef = useRef(null);
  const innerContainerRef = useRef(null);
  
  /* ── Auto-Pour Integration ── */
  const autoStateRef    = useRef('IDLE'); // 'IDLE' | 'POUR_A' | 'POUR_B'
  const bottleVisualRef = useRef({ pos: BOTTLE_INIT, tilt: 0 }); // Tracks Framer Motion visual state

  const colors = {
    cardBg:        '#fdfbf7',
    cardBorder:    '#e7e5e4',
    textDark:      '#431407',
    textMedium:    '#57534e',
    accent:        '#c2410c',
    successBg:     '#f0fdf4',
    successBorder: '#bbf7d0',
    successText:   '#166534',
    thinkBg:       '#fff7ed',
    thinkBorder:   '#ffedd5',
    thinkText:     '#9a3412',
  };

  /* ──────────────────────────────────────
     HELPER: canvas bounding-box origin
  ────────────────────────────────────── */
  const getCanvasRect = () => containerRef.current?.getBoundingClientRect();

  /* ──────────────────────────────────────
     HELPER: bottle mouth position in canvas-space
     The SVG bottle is 120×240, origin at top-left of motion.div.
     The bottle neck opening (ellipse cx=60 cy=22) is the mouth.
     The motion.div is positioned bottom:bottlePos.y, left:bottlePos.x
     in the 560-wide canvas.
  ────────────────────────────────────── */
  const getMouthCanvas = (pos, tilt) => {
    const tiltRad = (tilt * Math.PI) / 180;
    // transformOrigin of the bottle is '60px 40px' (pivot near cap)
    // mouth in local space relative to pivot: (0, -18) roughly
    // so mouth rotates around pivot (60,40):
    //   local mouth = (60, 22)  →  delta = (0, -18)
    //   rotated delta = (-18*sin(tilt), -18*cos(tilt))
    const pivotLocalX = 60;
    const pivotLocalY = 40;
    const mouthLocalX = 60;
    const mouthLocalY = 22;
    const dx = mouthLocalX - pivotLocalX;
    const dy = mouthLocalY - pivotLocalY;
    const cos = Math.cos(tiltRad);
    const sin = Math.sin(tiltRad);
    const rotDx = dx * cos - dy * sin;
    const rotDy = dx * sin + dy * cos;

    // The motion.div left=pos.x, bottom=pos.y  →  top = canvasH - pos.y - 240
    // We need canvasH. Use 320px as a safe estimate (we'll subtract from flex container).
    const canvasH = containerRef.current ? containerRef.current.clientHeight : 340;
    const divTop  = canvasH - pos.y - 240;  // top of the 240px-tall bottle div
    const divLeft = pos.x;

    const pivotX = divLeft + pivotLocalX;
    const pivotY = divTop  + pivotLocalY;

    return {
      x: pivotX + rotDx,
      y: pivotY + rotDy,
    };
  };

  /* ──────────────────────────────────────
     PHYSICS LOOP
  ────────────────────────────────────── */
  useEffect(() => {
    let running = true;

    const loop = (now) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      const pos      = bottleVisualRef.current.pos;
      const tilt     = bottleVisualRef.current.tilt;
      const autoState = autoStateRef.current;

      /* ── determine active tumbler based on auto-state ── */
      let target = null;
      if (autoState === 'POUR_A' && tilt >= POUR_TILT) target = 'A';
      else if (autoState === 'POUR_B' && tilt <= -POUR_TILT) target = 'B';
      
      activeTargetRef.current = target;

      /* ── fill tumblers ── */
      if (target === 'A') {
        const next = Math.min(0.50, waterLevelARef.current + FILL_SPEED * dt);
        const poured = next - waterLevelARef.current;
        waterLevelARef.current = next;
        setWaterLevelA(next);
        
        // When tumbler reaches target, force bottle to exactly 0 to conserve water visually.
        if (next >= 0.50) {
          bottleFillRef.current = 0;
          setBottleFill(0);
        } else {
          bottleFillRef.current = Math.max(0, bottleFillRef.current - poured * 0.68);
          setBottleFill(bottleFillRef.current);
        }
        
        if (next >= 0.50 && autoState === 'POUR_A') {
          autoStateRef.current = 'IDLE';
          setBottleTilt(0);
          bottleTiltRef.current = 0;
          setBottlePos(BOTTLE_INIT);
          bottlePosRef.current = BOTTLE_INIT;
        }
      } else if (target === 'B') {
        const next = Math.min(0.95, waterLevelBRef.current + FILL_SPEED * dt);
        const poured = next - waterLevelBRef.current;
        waterLevelBRef.current = next;
        setWaterLevelB(next);
        
        // When tumbler reaches target, force bottle to exactly 0 to conserve water visually.
        if (next >= 0.95) {
          bottleFillRef.current = 0;
          setBottleFill(0);
        } else {
          bottleFillRef.current = Math.max(0, bottleFillRef.current - poured * 0.75);
          setBottleFill(bottleFillRef.current);
        }
        
        if (next >= 0.95 && autoState === 'POUR_B') {
          autoStateRef.current = 'IDLE';
          setBottleTilt(0);
          bottleTiltRef.current = 0;
          setBottlePos(BOTTLE_INIT);
          bottlePosRef.current = BOTTLE_INIT;
        }
      }

      const ctx = canvasRef.current?.getContext('2d');
      if (canvasRef.current && innerContainerRef.current) {
        // Fix the canvas resolution to match the INNER container exactly, not the outer flex container.
        if (canvasRef.current.width !== innerContainerRef.current.clientWidth) canvasRef.current.width = innerContainerRef.current.clientWidth;
        if (canvasRef.current.height !== innerContainerRef.current.clientHeight) canvasRef.current.height = innerContainerRef.current.clientHeight;
      }
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (target) {
        // Find exactly where the bottle mouth and tumbler surface are visually rendered in the DOM
        const mouthEl = document.getElementById('bottle-mouth-ref');
        const tumblerSurfaceEl = document.getElementById(`tumbler-${target.toLowerCase()}-surface`);
        const canvasRect = canvasRef.current?.getBoundingClientRect();

        if (mouthEl && tumblerSurfaceEl && canvasRect) {
          const mouthRect = mouthEl.getBoundingClientRect();
          const surfaceRect = tumblerSurfaceEl.getBoundingClientRect();
          
          // Convert from viewport coordinates to canvas internal coordinates
          const mouth = {
            x: mouthRect.left + mouthRect.width / 2 - canvasRect.left,
            y: mouthRect.top + mouthRect.height / 2 - canvasRect.top
          };
          const surfaceY = surfaceRect.top + surfaceRect.height / 2 - canvasRect.top;

          const tiltRad = (tilt * Math.PI) / 180;
          const speed = 50 + Math.abs(tilt) * 0.2; // Gentle, realistic pour
          const vx = Math.sin(tiltRad) * speed;
          const vy = Math.cos(tiltRad) * speed;

          // Calculate stream path
          const pts = [];
          let t = 0;
          let cx, cy;
          const step = 0.02;
          while (t < 2) {
            cx = mouth.x + vx * t;
            cy = mouth.y + vy * t + 0.5 * GRAVITY * t * t;
            pts.push({x: cx, y: cy});
            if (cy >= surfaceY) {
              pts[pts.length - 1].y = surfaceY;
              break;
            }
            t += step;
          }

          if (pts.length > 1) {
            const timeOffset = performance.now() * 0.015;
            
            // Draw realistic irregular liquid stream
            // It starts narrow at the mouth and gets slightly wider/more irregular as it falls
            
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            pts.forEach((p, i) => {
               const progress = i / pts.length;
               // Wiggle increases as it falls, simulating breaking stream
               const amplitude = progress * 1.5;
               const wiggle = Math.sin(timeOffset + i * 0.4) * amplitude;
               ctx.lineTo(p.x + wiggle, p.y);
            });
            
            // Main transparent blue body
            ctx.strokeStyle = 'rgba(150, 210, 240, 0.5)'; 
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            // Inner highlight for volumetric depth
            ctx.beginPath();
            ctx.moveTo(pts[0].x - 0.5, pts[0].y);
            pts.forEach((p, i) => {
               const progress = i / pts.length;
               const amplitude = progress * 1.5;
               const wiggle = Math.sin(timeOffset + i * 0.4) * amplitude;
               ctx.lineTo(p.x + wiggle - 0.5, p.y);
            });
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Subtle impact disturbance (not a cartoon ripple)
            const last = pts[pts.length - 1];
            ctx.beginPath();
            ctx.ellipse(last.x, surfaceY, 6 + Math.random() * 2, 1.5, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();

            // Few irregular tiny droplets breaking from stream
            for (let i = 0; i < 2; i++) {
              if (Math.random() > 0.4) continue;
              const dt = Math.random() * 0.6 + 0.4; // bottom half of stream
              const idx = Math.floor(dt * (pts.length - 1));
              if (idx < 1) continue;
              const p = pts[idx];
              const drift = (Math.random() - 0.5) * 6;
              ctx.beginPath();
              ctx.arc(p.x + drift, p.y, Math.random() * 1.0 + 0.5, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(200, 235, 255, 0.6)';
              ctx.fill();
            }
          } // closes if (pts.length > 1)
        } // closes if (mouthEl && tumblerSurfaceEl && canvasRect)
      } // closes if (target)

      // Update and draw ripples
      const newRipples = [];
      ripplesRef.current.forEach(r => {
        const age = (now - r.created) / 1000;
        const radius = r.radius + age * 30; // expand quickly
        const alpha = Math.max(0, r.alpha - age * 0.6);
        if (alpha > 0 && radius < r.maxRadius) {
          newRipples.push({ ...r, radius, alpha });
          ctx.beginPath();
          ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(180,225,250,${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });
      ripplesRef.current = newRipples;

      animFrameRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ──────────────────────────────────────
     COMPLETION TRIGGER
  ────────────────────────────────────── */
  useEffect(() => {
    if (waterLevelA >= 0.49 && waterLevelB >= 0.90) {
      if (typeof addXp === 'function') addXp(20);
      if (typeof onComplete === 'function') onComplete();
    }
  }, [waterLevelA, waterLevelB, addXp, onComplete]);

  /* ──────────────────────────────────────
     DRAG HANDLERS
  ────────────────────────────────────── */
  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    if (autoStateRef.current !== 'IDLE') return; // Cannot grab while auto-pouring
    e.currentTarget.setPointerCapture(e.pointerId);

    const rect = getCanvasRect();
    if (!rect) return;

    const clientX = e.clientX;
    const clientY = e.clientY;
    const canvasH = rect.height;

    const bx = bottlePosRef.current.x;
    const by = bottlePosRef.current.y;

    const bottleClientLeft = rect.left + bx;
    const bottleClientTop  = rect.top  + (canvasH - by - 240);

    grabOffsetRef.current = {
      x: clientX - bottleClientLeft,
      y: clientY - bottleClientTop,
    };

    setIsDragging(true);
    isDraggingRef.current = true;
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    if (autoStateRef.current !== 'IDLE') return; // Ignore drag if auto-pouring
    
    const rect = getCanvasRect();
    if (!rect) return;

    const canvasH = rect.height;
    const canvasW = rect.width;

    const newLeft = e.clientX - rect.left - grabOffsetRef.current.x;
    const newTop  = e.clientY - rect.top  - grabOffsetRef.current.y;

    const clampedLeft = Math.max(-30, Math.min(canvasW - 90,  newLeft));
    const clampedTop  = Math.max(-60, Math.min(canvasH - 80,  newTop));

    const newX = clampedLeft;
    const newY = canvasH - clampedTop - 240;

    const next = { x: newX, y: newY };
    bottlePosRef.current = next;
    setBottlePos(next);

    const bottleCenterX = newX + 60;
    const bottleCenterY = canvasH - newY - 120;

    const dA = Math.hypot(bottleCenterX - TUMBLER_A.cx, bottleCenterY - TUMBLER_A.cy);
    const dB = Math.hypot(bottleCenterX - TUMBLER_B.cx, bottleCenterY - TUMBLER_B.cy);

    if (dA < TUMBLER_A.hitR * 1.5 && waterLevelARef.current < 0.50) {
      autoStateRef.current = 'POUR_A';
      setIsDragging(false);
      isDraggingRef.current = false;
      // Pour A from the left: bottle tilts clockwise (+45 deg).
      // mouth dx offset = +12.7 from pivot. To align with cx: pos.x = cx - 72.7
      const tPos = { x: TUMBLER_A.cx - 72, y: 130 };
      bottlePosRef.current = tPos;
      setBottlePos(tPos);
      const tTilt = 45;
      bottleTiltRef.current = tTilt;
      setBottleTilt(tTilt);
      return;
    }

    if (dB < TUMBLER_B.hitR * 1.5 && waterLevelBRef.current < 0.95) {
      autoStateRef.current = 'POUR_B';
      setIsDragging(false);
      isDraggingRef.current = false;
      // Pour B from the right: bottle tilts counter-clockwise (-45 deg).
      // mouth dx offset = -12.7 from pivot. To align with cx: pos.x = cx - 47.3
      const tPos = { x: TUMBLER_B.cx - 48, y: 130 };
      bottlePosRef.current = tPos;
      setBottlePos(tPos);
      const tTilt = -45;
      bottleTiltRef.current = tTilt;
      setBottleTilt(tTilt);
      return;
    }

    // Natural sway based on horizontal movement when outside pour zones
    const dx = newX - bottlePosRef.current.x;
    const targetTilt = Math.max(-15, Math.min(15, dx * -1.5));
    bottleTiltRef.current = targetTilt;
    setBottleTilt(targetTilt);
  }, []);

  const handlePointerUp = useCallback(() => {
    if (autoStateRef.current !== 'IDLE') return; // Do not interrupt auto-pouring
    setIsDragging(false);
    isDraggingRef.current = false;
    setBottleTilt(0);
    bottleTiltRef.current = 0;
    activeTargetRef.current = null;
    dropletsRef.current = [];
    ripplesRef.current = [];
  }, []);

  /* ──────────────────────────────────────
     RESET
  ────────────────────────────────────── */
  const resetActivity = () => {
    autoStateRef.current = 'IDLE';
    setBottlePos(BOTTLE_INIT);
    bottlePosRef.current = BOTTLE_INIT;
    setIsDragging(false);
    isDraggingRef.current = false;
    setBottleTilt(0);
    bottleTiltRef.current = 0;
    setWaterLevelA(0);
    waterLevelARef.current = 0;
    setWaterLevelB(0);
    waterLevelBRef.current = 0;
    setBottleFill(1.0);
    bottleFillRef.current = 1.0;
    dropletsRef.current = [];
    ripplesRef.current = [];
    setThinkFeedback(null);
    setSelectedOption(null);
  };

  /* ──────────────────────────────────────
     THINK MORE
  ────────────────────────────────────── */
  const handleCheckAnswer = (index) => {
    if (index === THINK_CORRECT_INDEX) {
      setThinkFeedback({ type: 'success', text: 'Correct! The bottle has a limited capacity. If the tumbler contains more water than it can hold, the extra water will overflow.' });
    } else {
      setThinkFeedback({ type: 'hint', text: "Think about the bottle's capacity. Can it hold more water than its maximum capacity?" });
    }
  };

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', gap: '0.75rem',
        width: '100%', height: '100vh', maxHeight: '100vh',
        overflow: 'hidden', color: colors.textDark,
        padding: '0.75rem', boxSizing: 'border-box',
      }}
    >
      {/* ── Top Header ── */}
      <div style={{
        background: colors.cardBg, border: `1px solid ${colors.cardBorder}`,
        borderRadius: '12px', padding: '0.75rem 1.25rem',
        display: 'flex', flexDirection: 'column', gap: '0.25rem',
        flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}>
        <h2 style={{ margin: 0, fontSize: '1.6rem', color: colors.textDark, display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold' }}>
          <Box size={28} color={colors.textDark} /> Phase 2: Space and Volume
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: colors.textMedium, fontSize: '1.05rem' }}>
          <Info size={16} />
          <span>Section 6.3.6: Pour water from the bottle into the two identical tumblers to observe volume.</span>
        </div>
      </div>

      {/* ── Main Split Layout ── */}
      <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minHeight: 0, overflow: 'hidden' }}>

        {/* ────────── LEFT PANEL ────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 0 }}>
          <div style={{
            background: colors.cardBg, borderRadius: '12px',
            border: `1px solid ${colors.cardBorder}`, padding: '1rem',
            display: 'flex', flexDirection: 'column', flex: 1,
            position: 'relative', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', minHeight: 0,
          }}>

            {/* Header / Prompt */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexShrink: 0 }}>
              <div>
                <h3 style={{ margin: 0, color: colors.textDark, fontSize: '1.4rem', fontWeight: 'bold' }}>Pour Water</h3>
                <div style={{ fontSize: '1.05rem', color: colors.textMedium, marginTop: '4px' }}>
                  {waterLevelA === 0
                    ? 'Drag the bottle over a tumbler and tilt it to pour water.'
                    : waterLevelB === 0
                      ? 'Now drag the bottle over Tumbler B to fill it almost completely.'
                      : 'Both tumblers have been measured!'}
                </div>
              </div>
              <button
                onClick={resetActivity}
                style={{
                  background: 'white', border: `1px solid ${colors.accent}`,
                  color: colors.accent, padding: '6px 12px', borderRadius: '8px',
                  fontSize: '1rem', fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                }}
              >
                <RefreshCw size={16} /> Reset
              </button>
            </div>

            {/* ── Lab Viewport ── */}
            <div
              ref={containerRef}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                flex: 1, position: 'relative', borderRadius: '12px',
                overflow: 'hidden',
                minHeight: 0,
                background: 'radial-gradient(circle at 50% 25%, #ffffff 0%, #f4f2ee 35%, #e2ded5 70%, #d1cbbd 100%)',
                border: `1.5px solid ${colors.cardBorder}`,
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                userSelect: 'none', touchAction: 'none',
              }}
            >
              {/* 560-wide canvas content */}
              <div ref={innerContainerRef} style={{ width: '560px', height: '100%', position: 'relative' }}>
                <svg style={{ width: 0, height: 0, position: 'absolute', pointerEvents: 'none' }}>
                  <defs>
                    <linearGradient id="glassFront" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
                      <stop offset="6%" stopColor="rgba(255,255,255,0.2)" />
                      <stop offset="15%" stopColor="rgba(255,255,255,0.0)" />
                      <stop offset="85%" stopColor="rgba(255,255,255,0.0)" />
                      <stop offset="94%" stopColor="rgba(0,0,0,0.08)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
                    </linearGradient>
                    <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(160,215,245,0.45)" />
                      <stop offset="50%" stopColor="rgba(100,180,220,0.65)" />
                      <stop offset="100%" stopColor="rgba(30,120,160,0.85)" />
                    </linearGradient>
                    <linearGradient id="bottleGlassFront" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                      <stop offset="8%" stopColor="rgba(255,255,255,0.3)" />
                      <stop offset="20%" stopColor="rgba(255,255,255,0.0)" />
                      <stop offset="80%" stopColor="rgba(255,255,255,0.0)" />
                      <stop offset="92%" stopColor="rgba(0,0,0,0.1)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* ── Realistic physical water stream (Canvas) ── */}
                <canvas
                  ref={canvasRef}
                  width={560}
                  height={340}
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    pointerEvents: 'none', zIndex: 30,
                  }}
                />

                {/* ── Tumblers ── */}
                <div style={{ position: 'absolute', left: '190px', bottom: '40px', display: 'flex', gap: '50px', zIndex: 15 }}>
                  {/* Tumbler A */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative' }}>
                    {/* Realistic Contact Shadow Layering */}
                    <div style={{ position: 'absolute', bottom: '-2px', left: '50%', transform: 'translateX(-50%)', width: '70px', height: '8px', background: 'rgba(10, 5, 5, 0.7)', filter: 'blur(2px)', zIndex: -1, borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%)', width: '110px', height: '16px', background: 'rgba(20, 15, 10, 0.3)', filter: 'blur(5px)', zIndex: -2, borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-10px', left: '60%', transform: 'translateX(-50%) skewX(-40deg)', width: '150px', height: '30px', background: 'linear-gradient(to right, rgba(30,20,15,0.15), rgba(30,20,15,0))', filter: 'blur(8px)', zIndex: -3, borderRadius: '50%' }} />

                    <div style={{ position: 'relative', width: '120px', height: '170px', marginBottom: '8px' }}>
                      <svg width="120" height="170" viewBox="0 0 120 170" style={{ position: 'relative', zIndex: 2, display: 'block', overflow: 'visible' }}>
                        <defs>
                          <clipPath id="tumblerClipA">
                            <path d="M 20 20 L 28 150 C 28 160, 92 160, 92 150 L 100 20 Z" />
                          </clipPath>
                        </defs>

                        {/* Inner Back Wall of Glass */}
                        <path d="M 20 20 L 28 150 C 28 160, 92 160, 92 150 L 100 20 Z" fill="rgba(0,0,0,0.03)" />
                        
                        {/* WATER LEVEL */}
                        {waterLevelA > 0 && (
                           <g>
                              {/* Main water body */}
                              <path d={`M ${20 + 8*(1-waterLevelA)} ${150 - 130*waterLevelA} L 28 150 C 28 160, 92 160, 92 150 L ${100 - 8*(1-waterLevelA)} ${150 - 130*waterLevelA} Z`} fill="url(#waterGrad)" />
                              
                              {/* Water Base Depth */}
                              <ellipse cx="60" cy="150" rx="32" ry="6" fill="rgba(10, 80, 130, 0.6)" />
                              
                              {/* Water Surface (Meniscus) */}
                              <ellipse cx="60" cy={150 - 130*waterLevelA} rx={40 - 8*(1-waterLevelA)} ry={7} fill="rgba(180, 230, 255, 0.4)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
                              
                              {/* Meniscus Depth Ring */}
                              <ellipse cx="60" cy={151 - 130*waterLevelA} rx={39 - 8*(1-waterLevelA)} ry={6.5} fill="none" stroke="rgba(0, 50, 100, 0.3)" strokeWidth="2" />
                           </g>
                        )}
                        <rect id="tumbler-a-surface" x="0" y={150 - (130 * waterLevelA)} width="120" height="2" fill="transparent" pointerEvents="none" />

                        {/* Front Glass Cylinder */}
                        <path d="M 20 20 L 28 150 C 28 160, 92 160, 92 150 L 100 20 Z" fill="url(#glassFront)" />
                        
                        {/* Fresnel Edges (Left) */}
                        <path d="M 20 20 L 28 150" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 22 20 L 30 150" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" strokeLinecap="round" />
                        
                        {/* Fresnel Edges (Right) */}
                        <path d="M 100 20 L 92 150" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 98 20 L 90 150" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />

                        {/* Thick Glass Base (Refractive Block) */}
                        <path d="M 28 150 C 28 160, 92 160, 92 150 L 90 156 C 90 165, 30 165, 30 156 Z" fill="rgba(255,255,255,0.6)" />
                        <ellipse cx="60" cy="156" rx="30" ry="5.5" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
                        <ellipse cx="60" cy="158" rx="28" ry="4.5" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />

                        {/* Top Rim */}
                        <ellipse cx="60" cy="20" rx="40" ry="7" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.9)" strokeWidth="3" />
                        <ellipse cx="60" cy="20" rx="37" ry="6" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
                        
                        {/* Soft Specular Glare (Front) */}
                        <path d="M 32 30 L 38 140" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="8" filter="blur(1.5px)" />
                        {/* Sharp Specular Core */}
                        <path d="M 33 30 L 39 140" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />

                        {/* Secondary Glare (Right) */}
                        <path d="M 88 30 L 82 140" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" filter="blur(1.5px)" />
                      </svg>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid #d6c6b4', borderRadius: '8px', padding: '4px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                      <div style={{ fontWeight: '800', fontSize: '1.05rem', color: colors.textDark }}>Tumbler A</div>
                      <div style={{ fontSize: '0.85rem', color: colors.textMedium, fontWeight: '600' }}>
                        {waterLevelA > 0 ? `${Math.round(waterLevelA * 100)}% Volume` : 'Empty (200ml)'}
                      </div>
                    </div>
                  </div>

                  {/* Tumbler B */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative' }}>
                    {/* Realistic Contact Shadow Layering */}
                    <div style={{ position: 'absolute', bottom: '-2px', left: '50%', transform: 'translateX(-50%)', width: '70px', height: '8px', background: 'rgba(10, 5, 5, 0.7)', filter: 'blur(2px)', zIndex: -1, borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%)', width: '110px', height: '16px', background: 'rgba(20, 15, 10, 0.3)', filter: 'blur(5px)', zIndex: -2, borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-10px', left: '60%', transform: 'translateX(-50%) skewX(-40deg)', width: '150px', height: '30px', background: 'linear-gradient(to right, rgba(30,20,15,0.15), rgba(30,20,15,0))', filter: 'blur(8px)', zIndex: -3, borderRadius: '50%' }} />

                    <div style={{ position: 'relative', width: '120px', height: '170px', marginBottom: '8px' }}>
                      <svg width="120" height="170" viewBox="0 0 120 170" style={{ position: 'relative', zIndex: 2, display: 'block', overflow: 'visible' }}>
                        <defs>
                          <clipPath id="tumblerClipB">
                            <path d="M 20 20 L 28 150 C 28 160, 92 160, 92 150 L 100 20 Z" />
                          </clipPath>
                        </defs>

                        {/* Inner Back Wall of Glass */}
                        <path d="M 20 20 L 28 150 C 28 160, 92 160, 92 150 L 100 20 Z" fill="rgba(0,0,0,0.03)" />
                        
                        {/* WATER LEVEL */}
                        {waterLevelB > 0 && (
                           <g>
                              {/* Main water body */}
                              <path d={`M ${20 + 8*(1-waterLevelB)} ${150 - 130*waterLevelB} L 28 150 C 28 160, 92 160, 92 150 L ${100 - 8*(1-waterLevelB)} ${150 - 130*waterLevelB} Z`} fill="url(#waterGrad)" />
                              
                              {/* Water Base Depth */}
                              <ellipse cx="60" cy="150" rx="32" ry="6" fill="rgba(10, 80, 130, 0.6)" />
                              
                              {/* Water Surface (Meniscus) */}
                              <ellipse cx="60" cy={150 - 130*waterLevelB} rx={40 - 8*(1-waterLevelB)} ry={7} fill="rgba(180, 230, 255, 0.4)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
                              
                              {/* Meniscus Depth Ring */}
                              <ellipse cx="60" cy={151 - 130*waterLevelB} rx={39 - 8*(1-waterLevelB)} ry={6.5} fill="none" stroke="rgba(0, 50, 100, 0.3)" strokeWidth="2" />
                           </g>
                        )}
                        <rect id="tumbler-b-surface" x="0" y={150 - (130 * waterLevelB)} width="120" height="2" fill="transparent" pointerEvents="none" />

                        {/* Front Glass Cylinder */}
                        <path d="M 20 20 L 28 150 C 28 160, 92 160, 92 150 L 100 20 Z" fill="url(#glassFront)" />
                        
                        {/* Fresnel Edges (Left) */}
                        <path d="M 20 20 L 28 150" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 22 20 L 30 150" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" strokeLinecap="round" />
                        
                        {/* Fresnel Edges (Right) */}
                        <path d="M 100 20 L 92 150" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="3" strokeLinecap="round" />
                        <path d="M 98 20 L 90 150" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />

                        {/* Thick Glass Base (Refractive Block) */}
                        <path d="M 28 150 C 28 160, 92 160, 92 150 L 90 156 C 90 165, 30 165, 30 156 Z" fill="rgba(255,255,255,0.6)" />
                        <ellipse cx="60" cy="156" rx="30" ry="5.5" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
                        <ellipse cx="60" cy="158" rx="28" ry="4.5" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />

                        {/* Top Rim */}
                        <ellipse cx="60" cy="20" rx="40" ry="7" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.9)" strokeWidth="3" />
                        <ellipse cx="60" cy="20" rx="37" ry="6" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
                        
                        {/* Soft Specular Glare (Front) */}
                        <path d="M 32 30 L 38 140" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="8" filter="blur(1.5px)" />
                        {/* Sharp Specular Core */}
                        <path d="M 33 30 L 39 140" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />

                        {/* Secondary Glare (Right) */}
                        <path d="M 88 30 L 82 140" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" filter="blur(1.5px)" />
                      </svg>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid #d6c6b4', borderRadius: '8px', padding: '4px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                      <div style={{ fontWeight: '800', fontSize: '1.05rem', color: colors.textDark }}>Tumbler B</div>
                      <div style={{ fontSize: '0.85rem', color: colors.textMedium, fontWeight: '600' }}>
                        {waterLevelB >= 0.95 ? 'Almost Full' : waterLevelB > 0 ? `${Math.round(waterLevelB * 100)}% Volume` : 'Empty (200ml)'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Draggable Bottle ── */}
                <motion.div
                  onPointerDown={handlePointerDown}
                  onUpdate={(latest) => {
                    bottleVisualRef.current = {
                      pos: { x: parseFloat(latest.left) || 0, y: parseFloat(latest.bottom) || 0 },
                      tilt: parseFloat(latest.rotate) || 0
                    };
                  }}
                  animate={{
                    left:   `${bottlePos.x}px`,
                    bottom: `${bottlePos.y}px`,
                    rotate: bottleTilt,
                    scale:  isDragging ? 1.04 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  style={{
                    position: 'absolute',
                    width: '120px', height: '240px',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    zIndex: 1000,
                    transformOrigin: '60px 40px',
                    touchAction: 'none',
                    userSelect: 'none',
                  }}
                >
                  {/* Bottle Visuals - Enhanced Realism */}
                  <div style={{ position: 'relative', width: '120px', height: '240px' }}>
                    {/* Bottle Shadow */}
                    <div style={{ 
                      position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', 
                      width: '80px', height: '10px', 
                      background: 'rgba(15, 10, 5, 0.8)', 
                      filter: `blur(${isDragging ? 8 : 2}px)`, 
                      opacity: isDragging ? 0.3 : 1,
                      zIndex: 0, borderRadius: '50%',
                      transition: 'all 0.1s' 
                    }} />

                    <svg width="120" height="240" viewBox="0 0 120 240" style={{ position: 'relative', zIndex: 2, display: 'block', overflow: 'visible' }}>
                      <defs>
                        <clipPath id="bottleClip2">
                          <path d="M 46 22 L 74 22 L 74 52 C 74 65, 98 82, 98 108 L 98 215 C 98 226, 88 232, 76 232 L 44 232 C 32 232, 22 226, 22 215 L 22 108 C 22 82, 46 65, 46 52 Z" />
                        </clipPath>
                      </defs>

                      {/* Inner Back Wall */}
                      <path d="M 46 22 L 74 22 L 74 52 C 74 65, 98 82, 98 108 L 98 215 C 98 226, 88 232, 76 232 L 44 232 C 32 232, 22 226, 22 215 L 22 108 C 22 82, 46 65, 46 52 Z" fill="rgba(0,0,0,0.03)" />

                      {/* Water inside */}
                      {bottleFill > 0 && (
                        <g>
                          <g clipPath="url(#bottleClip2)">
                            <rect x="0" y={232 - 180 * bottleFill} width="120" height={180 * bottleFill + 15} fill="url(#waterGrad)" />
                          </g>
                          {/* Surface meniscus */}
                          <ellipse cx="60" cy={232 - 180 * bottleFill} rx={bottleFill > 0.68 ? 16 : 38} ry={bottleFill > 0.68 ? 3 : 6} fill="rgba(180, 230, 255, 0.4)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" />
                        </g>
                      )}

                      {/* Front wall */}
                      <path d="M 46 22 L 74 22 L 74 52 C 74 65, 98 82, 98 108 L 98 215 C 98 226, 88 232, 76 232 L 44 232 C 32 232, 22 226, 22 215 L 22 108 C 22 82, 46 65, 46 52 Z" fill="url(#bottleGlassFront)" />
                      
                      {/* Edge Thickness Fresnel */}
                      <path d="M 46 22 L 74 22 L 74 52 C 74 65, 98 82, 98 108 L 98 215 C 98 226, 88 232, 76 232 L 44 232 C 32 232, 22 226, 22 215 L 22 108 C 22 82, 46 65, 46 52 Z" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
                      
                      {/* Left Highlight */}
                      <path d="M 25 102 L 25 212" stroke="rgba(255,255,255,0.9)" strokeWidth="4" strokeLinecap="round" filter="blur(1px)" />
                      <path d="M 26 105 L 26 210" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />

                      {/* Right shadow */}
                      <path d="M 95 105 L 95 210" stroke="rgba(0,0,0,0.3)" strokeWidth="3" strokeLinecap="round" />

                      {/* Base Thickness */}
                      <path d="M 32 231 Q 60 238 88 231 L 86 234 Q 60 240 34 234 Z" fill="rgba(255,255,255,0.6)" />
                      <path d="M 32 231 Q 60 238 88 231" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="3" />
                      <path d="M 30 228 Q 60 235 90 228" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />

                      {/* Rim / open mouth */}
                      <ellipse id="bottle-mouth-ref" cx="60" cy="22" rx="14" ry="4.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.95)" strokeWidth="2" />
                      <ellipse cx="60" cy="22" rx="13" ry="3.5" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />

                    <g 
                      style={{
                        transform: Math.abs(bottleTilt) > 5 ? 'translateY(-30px) rotate(-15deg)' : 'translateY(0) rotate(0)',
                        opacity: Math.abs(bottleTilt) > 5 ? 0 : 1,
                        transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.4s ease-out',
                        transformOrigin: '60px 14px',
                        pointerEvents: 'none'
                      }}
                    >
                      {/* Collar (neck ring stays attached to cap) */}
                      <rect x="44" y="22" width="32" height="5" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
                      <rect x="46" y="23" width="28" height="2" rx="1" fill="rgba(255,255,255,0.4)" />

                      {/* Cap body */}
                      <rect x="43" y="5" width="34" height="22" rx="3" fill="#0ea5e9" stroke="#0284c7" strokeWidth="1.5" />
                      {/* Top rim of cap */}
                      <ellipse cx="60" cy="5" rx="17" ry="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                      {/* Cap highlight */}
                      <rect x="46" y="9" width="28" height="3" rx="1" fill="rgba(255,255,255,0.5)" />
                      {/* Ridges */}
                      <g fill="rgba(0,0,0,0.15)">
                        <rect x="48" y="11" width="1.5" height="14" />
                        <rect x="52" y="11" width="1.5" height="14" />
                        <rect x="56" y="11" width="1.5" height="14" />
                        <rect x="60" y="11" width="1.5" height="14" />
                        <rect x="64" y="11" width="1.5" height="14" />
                        <rect x="68" y="11" width="1.5" height="14" />
                      </g>
                    </g>
                  </svg>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Step indicators */}
            <div style={{ marginTop: '0.75rem', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {[
                  { label: 'Drag the bottle',   icon: <Hand size={18} color={colors.textMedium} />,        active: waterLevelA === 0 },
                  { label: 'Pour into tumbler',  icon: <Droplet size={18} color={colors.textMedium} />,    active: waterLevelA > 0 && waterLevelB === 0 },
                  { label: 'Observe volume level', icon: <AlertCircle size={18} color={colors.textMedium} />, active: waterLevelB > 0 },
                ].map((step, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div style={{ color: colors.textMedium }}>›</div>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: `1px solid ${colors.cardBorder}`, padding: '10px 14px', borderRadius: '10px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', opacity: step.active ? 1 : 0.6 }}>
                      <div style={{ width: '24px', height: '24px', background: colors.accent, color: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 }}>{i + 1}</div>
                      {step.icon}
                      <div style={{ fontSize: '1rem', color: colors.textDark, fontWeight: 'bold' }}>{step.label}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ────────── RIGHT PANEL ────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0, overflow: 'hidden' }}>

          {/* Investigation Log */}
          <div style={{ background: colors.cardBg, borderRadius: '12px', border: `1px solid ${colors.cardBorder}`, padding: '0.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', flexShrink: 0 }}>
            <h4 style={{ margin: 0, fontSize: '1.15rem', color: colors.textDark, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
              <LayoutGrid size={18} color={colors.textDark} /> Investigation Log
            </h4>
            <AnimatePresence mode="popLayout">
              {waterLevelA >= 0.50 && (
                <motion.div key="obsA" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', padding: '0.6rem 1rem', borderRadius: '10px', border: `1px solid ${colors.cardBorder}`, display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '36px', height: '48px', position: 'relative', flexShrink: 0 }}>
                    <img src="/images/realistic_tumbler_water_half.jpg" alt="Tumbler A" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                  </div>
                  <div>
                    <div style={{ color: colors.accent, fontWeight: 'bold', fontSize: '1.15rem' }}>Observation 1</div>
                    <div style={{ fontSize: '1.05rem', color: colors.textDark, marginTop: '2px', lineHeight: '1.4' }}>Tumbler A is half-filled with water (50% Volume).</div>
                  </div>
                </motion.div>
              )}
              {waterLevelB >= 0.95 && (
                <motion.div key="obsB" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', padding: '0.6rem 1rem', borderRadius: '10px', border: `1px solid ${colors.cardBorder}`, display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '36px', height: '48px', position: 'relative', flexShrink: 0 }}>
                    <img src="/images/realistic_tumbler_water_full.jpg" alt="Tumbler B" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                  </div>
                  <div>
                    <div style={{ color: colors.accent, fontWeight: 'bold', fontSize: '1.15rem' }}>Observation 2</div>
                    <div style={{ fontSize: '1.05rem', color: colors.textDark, marginTop: '2px', lineHeight: '1.4' }}>Tumbler B is almost completely filled with water.</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {waterLevelA < 0.50 && waterLevelB < 0.95 && (
              <div style={{ textAlign: 'center', color: colors.textMedium, fontSize: '1.05rem', padding: '0.75rem 0', fontStyle: 'italic' }}>
                Waiting for observations...
              </div>
            )}
          </div>

          {/* Scientific Conclusion */}
          <AnimatePresence>
            {waterLevelB >= 0.90 && (
              <motion.div key="conclusion" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} style={{ background: colors.successBg, padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.successBorder}`, flexShrink: 0 }}>
                <div style={{ color: colors.successText, fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
                  🧪 Scientific Conclusion
                </div>
                <div style={{ fontSize: '1.05rem', color: colors.successText, lineHeight: '1.4', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}><CheckCircle2 size={18} color={colors.successText} style={{ flexShrink: 0, marginTop: '2px' }} /> Even though the tumblers have the same capacity, the water levels differ.</div>
                  <div style={{ display: 'flex', gap: '10px' }}><CheckCircle2 size={18} color={colors.successText} style={{ flexShrink: 0, marginTop: '2px' }} /> The water in Tumbler A occupies less space than the water in Tumbler B.</div>
                  <div style={{ display: 'flex', gap: '10px' }}><CheckCircle2 size={18} color={colors.successText} style={{ flexShrink: 0, marginTop: '2px' }} /> The space occupied by an object or substance is called its <strong>volume!</strong></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Think More */}
          <AnimatePresence>
            {waterLevelB >= 0.90 && (
              <motion.div key="think" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ background: colors.thinkBg, padding: '0.6rem 0.75rem', borderRadius: '12px', border: `1px solid ${colors.thinkBorder}`, display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0, boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: colors.accent, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem' }}>
                    <HelpCircle size={18} /> Think More!
                  </div>
                </div>
                <div style={{ fontSize: '1rem', color: colors.thinkText, lineHeight: '1.2', fontWeight: 'bold' }}>
                  What if we pour the water from Tumbler B back into the bottle? What will you observe?
                </div>
                <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: colors.textDark, opacity: 0.85, lineHeight: '1.2' }}>
                  <Info size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                  Hint: The bottle may not be able to hold all the water. What might happen if there is more water than the bottle can hold?
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {THINK_OPTIONS.map((opt, i) => {
                      const isCorrectSelection = thinkFeedback && thinkFeedback.type === 'success' && selectedOption === i;
                      return (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectedOption(i);
                          handleCheckAnswer(i);
                        }}
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          border: `2px solid ${isCorrectSelection ? '#22c55e' : (selectedOption === i ? colors.accent : colors.cardBorder)}`,
                          background: isCorrectSelection ? '#f0fdf4' : (selectedOption === i ? '#fff7ed' : 'white'),
                          color: isCorrectSelection ? '#15803d' : (selectedOption === i ? colors.accent : colors.textDark),
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontWeight: selectedOption === i ? '600' : '500',
                          boxShadow: selectedOption === i ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ 
                          width: '18px', height: '18px', borderRadius: '50%', 
                          border: `2px solid ${isCorrectSelection ? '#22c55e' : (selectedOption === i ? colors.accent : '#cbd5e1')}`,
                          display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0,
                          background: 'white'
                        }}>
                          {isCorrectSelection ? (
                             <CheckCircle2 size={14} color="#15803d" />
                          ) : (
                             selectedOption === i && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: colors.accent }} />
                          )}
                        </div>
                        {opt}
                      </div>
                    )})}
                  </div>
                  <AnimatePresence>
                    {thinkFeedback && (
                      <motion.div key="feedback" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: thinkFeedback.type === 'success' ? colors.successBg : '#fef2f2', border: `1px solid ${thinkFeedback.type === 'success' ? colors.successBorder : '#fecaca'}`, color: thinkFeedback.type === 'success' ? colors.successText : '#b91c1c', fontSize: '0.95rem', fontWeight: '500', display: 'flex', alignItems: 'flex-start', gap: '8px', boxSizing: 'border-box' }}>
                          {thinkFeedback.type === 'success' ? <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} /> : <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />}
                          <div>{thinkFeedback.text}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
