import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Trophy, Layers } from 'lucide-react';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function draw3DMagnet(ctx, cx, cy, w, h) {
  ctx.save();
  ctx.translate(cx, cy);

  // Outer Magnetic Attraction Field Aura
  const auraGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, w * 0.95);
  auraGlow.addColorStop(0, "rgba(245, 158, 11, 0.65)");
  auraGlow.addColorStop(0.5, "rgba(239, 68, 68, 0.4)");
  auraGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = auraGlow;
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.95, 0, Math.PI * 2);
  ctx.fill();

  // Drop Shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 8;

  // Magnet Body Base
  roundRect(ctx, -w / 2, -h / 2, w, h, 10);
  ctx.fillStyle = "#18181B";
  ctx.fill();

  // North Pole (Red)
  const gNorth = ctx.createLinearGradient(-w / 2, 0, 0, 0);
  gNorth.addColorStop(0, "#EF4444");
  gNorth.addColorStop(1, "#B91C1C");
  ctx.fillStyle = gNorth;
  roundRect(ctx, -w / 2, -h / 2, w / 2, h, 10);
  ctx.fill();

  // Seam Divider
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(-2, -h / 2, 4, h);

  // South Pole (Blue)
  const gSouth = ctx.createLinearGradient(0, 0, w / 2, 0);
  gSouth.addColorStop(0, "#3B82F6");
  gSouth.addColorStop(1, "#1E40AF");
  ctx.fillStyle = gSouth;
  roundRect(ctx, 0, -h / 2, w / 2, h, 10);
  ctx.fill();

  // Pole Labels
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 " + Math.round(h * 0.55) + "px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("N", -w / 4, 1);
  ctx.fillText("S", w / 4, 1);

  ctx.restore();
}

function drawSteelBall(ctx, x, y, radius) {
  ctx.save();
  ctx.translate(x, y);

  // Drop Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.beginPath();
  ctx.ellipse(0, radius * 0.7, radius * 0.8, radius * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Outer Chrome Sphere
  const gSteel = ctx.createRadialGradient(-radius * 0.35, -radius * 0.35, radius * 0.1, 0, 0, radius);
  gSteel.addColorStop(0, "#FFFFFF");
  gSteel.addColorStop(0.35, "#E2E8F0");
  gSteel.addColorStop(0.7, "#64748B");
  gSteel.addColorStop(1, "#0F172A");

  ctx.fillStyle = gSteel;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Specular Highlight
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.beginPath();
  ctx.arc(-radius * 0.35, -radius * 0.35, radius * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 3 Distinct Stages with Custom Background Colors & Wall Layouts
const MAZE_STAGES = [
  {
    id: 1,
    name: 'Stage 1: Emerald Gateway',
    bgGradient: ['#064E3B', '#047857', '#022C22'],
    wallFill: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    wallBorder: '#A7F3D0',
    gridColor: 'rgba(167, 243, 208, 0.15)',
    startPos: { x: 80, y: 80 },
    goal: { x: 910, y: 630, r: 50 },
    walls: [
      { x: 20, y: 20, w: 960, h: 14 },
      { x: 20, y: 686, w: 960, h: 14 },
      { x: 20, y: 20, w: 14, h: 680 },
      { x: 966, y: 20, w: 14, h: 680 },

      { x: 180, y: 20, w: 14, h: 480 },
      { x: 360, y: 200, w: 14, h: 490 },
      { x: 540, y: 20, w: 14, h: 480 },
      { x: 720, y: 200, w: 14, h: 490 },

      { x: 180, y: 240, w: 120, h: 14 },
      { x: 540, y: 240, w: 120, h: 14 }
    ]
  },
  {
    id: 2,
    name: 'Stage 2: Cosmic Sapphire Vault',
    bgGradient: ['#0F172A', '#1E1B4B', '#0284C7'],
    wallFill: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
    wallBorder: '#38BDF8',
    gridColor: 'rgba(56, 189, 248, 0.18)',
    startPos: { x: 80, y: 630 },
    goal: { x: 910, y: 90, r: 50 },
    walls: [
      { x: 20, y: 20, w: 960, h: 14 },
      { x: 20, y: 686, w: 960, h: 14 },
      { x: 20, y: 20, w: 14, h: 680 },
      { x: 966, y: 20, w: 14, h: 680 },

      { x: 220, y: 140, w: 14, h: 550 },
      { x: 440, y: 20, w: 14, h: 550 },
      { x: 660, y: 140, w: 14, h: 550 },

      { x: 220, y: 340, w: 140, h: 14 },
      { x: 440, y: 200, w: 140, h: 14 },
      { x: 660, y: 440, w: 140, h: 14 }
    ]
  },
  {
    id: 3,
    name: 'Stage 3: Golden Amber Fortress',
    bgGradient: ['#451A03', '#78350F', '#D97706'],
    wallFill: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    wallBorder: '#FDE047',
    gridColor: 'rgba(253, 224, 71, 0.2)',
    startPos: { x: 80, y: 80 },
    goal: { x: 500, y: 630, r: 50 },
    walls: [
      { x: 20, y: 20, w: 960, h: 14 },
      { x: 20, y: 686, w: 960, h: 14 },
      { x: 20, y: 20, w: 14, h: 680 },
      { x: 966, y: 20, w: 14, h: 680 },

      { x: 150, y: 20, w: 14, h: 420 },
      { x: 300, y: 180, w: 14, h: 510 },
      { x: 450, y: 20, w: 14, h: 420 },
      { x: 600, y: 180, w: 14, h: 510 },
      { x: 750, y: 20, w: 14, h: 420 },

      { x: 150, y: 260, w: 80, h: 14 },
      { x: 450, y: 260, w: 80, h: 14 }
    ]
  }
];

export default function MazeGame({ onSolve, isSolved }) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const canvasRef = useRef(null);

  const onSolveRef = useRef(onSolve);
  const isSolvedRef = useRef(isSolved);

  useEffect(() => {
    onSolveRef.current = onSolve;
    isSolvedRef.current = isSolved;
  }, [onSolve, isSolved]);

  const handleResetRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext("2d");

    const stage = MAZE_STAGES[currentStageIdx];

    let isDragging = false;
    let animFrame = null;

    // Underboard Magnet & ONE Single 3D Steel Ball State
    let mag = { x: stage.startPos.x, y: stage.startPos.y };
    let ball = { x: stage.startPos.x, y: stage.startPos.y, vx: 0, vy: 0, r: 18 };

    handleResetRef.current = () => {
      mag = { x: stage.startPos.x, y: stage.startPos.y };
      ball.x = stage.startPos.x;
      ball.y = stage.startPos.y;
      ball.vx = 0;
      ball.vy = 0;
    };

    const updateMagnetPos = (e) => {
      const r = canvas.getBoundingClientRect();
      const scaleX = canvas.width / r.width;
      const scaleY = canvas.height / r.height;
      mag.x = Math.max(40, Math.min(canvas.width - 40, (e.clientX - r.left) * scaleX));
      mag.y = Math.max(40, Math.min(canvas.height - 40, (e.clientY - r.top) * scaleY));
    };

    const mzDown = (e) => {
      isDragging = true;
      canvas.setPointerCapture(e.pointerId);
      updateMagnetPos(e);
    };

    const mzMove = (e) => {
      if (!isDragging) return;
      updateMagnetPos(e);
    };

    const mzUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("pointerdown", mzDown);
    canvas.addEventListener("pointermove", mzMove);
    window.addEventListener("pointerup", mzUp);

    // Wall collision helper with sliding physics
    function checkWallCollision(x, y, radius) {
      for (const w of stage.walls) {
        if (x + radius > w.x && x - radius < w.x + w.w &&
            y + radius > w.y && y - radius < w.y + w.h) {
          return true;
        }
      }
      return false;
    }

    function step() {
      // MAGNETIC ATTRACTION & SMOOTH SLIDING PHYSICS
      let dx = mag.x - ball.x;
      let dy = mag.y - ball.y;
      let dist = Math.hypot(dx, dy) || 1;

      // Strong magnetic force so ball ALWAYS comes along with magnet!
      const maxSpeed = 16;
      let targetVx = (dx / dist) * Math.min(maxSpeed, dist * 0.45);
      let targetVy = (dy / dist) * Math.min(maxSpeed, dist * 0.45);

      ball.vx = ball.vx * 0.4 + targetVx * 0.6;
      ball.vy = ball.vy * 0.4 + targetVy * 0.6;

      // Move X independently for smooth wall sliding
      let nextX = ball.x + ball.vx;
      if (!checkWallCollision(nextX, ball.y, ball.r)) {
        ball.x = nextX;
      } else {
        ball.vx = 0;
      }

      // Move Y independently for smooth wall sliding
      let nextY = ball.y + ball.vy;
      if (!checkWallCollision(ball.x, nextY, ball.r)) {
        ball.y = nextY;
      } else {
        ball.vy = 0;
      }

      // 1. Draw Distinct Stage Background Gradient
      ctx.clearRect(0, 0, W, H);
      const gBoard = ctx.createLinearGradient(0, 0, W, H);
      gBoard.addColorStop(0, stage.bgGradient[0]);
      gBoard.addColorStop(0.5, stage.bgGradient[1]);
      gBoard.addColorStop(1, stage.bgGradient[2]);
      ctx.fillStyle = gBoard;
      ctx.fillRect(0, 0, W, H);

      // Distinct Stage Blueprint Grid Lines
      ctx.strokeStyle = stage.gridColor;
      ctx.lineWidth = 1.5;
      for (let x = 40; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 40; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // 2. Render Stage 3D Walls
      for (const w of stage.walls) {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(w.x + 8, w.y + 8, w.w, w.h);

        ctx.fillStyle = stage.wallBorder;
        ctx.fillRect(w.x, w.y, w.w, w.h);

        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.fillRect(w.x + 3, w.y + 3, w.w - 6, w.h - 6);
        ctx.restore();
      }

      // 3. Draw Goal Castle Sanctuary 🏰
      ctx.save();
      ctx.translate(stage.goal.x, stage.goal.y);

      const haloGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, stage.goal.r * 1.5);
      haloGlow.addColorStop(0, "rgba(245, 158, 11, 0.7)");
      haloGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = haloGlow;
      ctx.beginPath();
      ctx.arc(0, 0, stage.goal.r * 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, stage.goal.r, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      ctx.font = "38px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🏰", 0, -2);
      ctx.restore();

      // 4. Draw Magnetic Force Rays to Single Marble
      if (dist < 500) {
        ctx.save();
        ctx.strokeStyle = "rgba(245, 158, 11, 0.9)";
        ctx.lineWidth = 3.5;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(mag.x, mag.y);
        ctx.lineTo(ball.x, ball.y);
        ctx.stroke();
        ctx.restore();
      }

      // 5. Draw ONE Single 3D Steel Ball
      drawSteelBall(ctx, ball.x, ball.y, ball.r);

      // 6. Draw Underboard Magnet
      draw3DMagnet(ctx, mag.x, mag.y, 110, 32);

      // Check Stage Victory Goal Collision
      if (Math.hypot(ball.x - stage.goal.x, ball.y - stage.goal.y) <= stage.goal.r) {
        if (!isSolvedRef.current && onSolveRef.current) {
          isSolvedRef.current = true;
          onSolveRef.current();
        }
      }

      animFrame = requestAnimationFrame(step);
    }

    step();

    return () => {
      cancelAnimationFrame(animFrame);
      canvas.removeEventListener("pointerdown", mzDown);
      canvas.removeEventListener("pointermove", mzMove);
      window.removeEventListener("pointerup", mzUp);
    };
  }, [currentStageIdx]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.4rem',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* Top Bar: Stage Selector & Controls */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '16px',
        left: '16px',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }}>
        {/* Stage Selector Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', pointerEvents: 'auto' }}>
          {MAZE_STAGES.map((stg, idx) => (
            <button
              key={stg.id}
              onClick={() => setCurrentStageIdx(idx)}
              style={{
                padding: '0.5rem 1.1rem',
                borderRadius: '18px',
                border: currentStageIdx === idx ? '2px solid #F59E0B' : '1.5px solid #CBD5E1',
                background: currentStageIdx === idx ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#FFFFFF',
                color: currentStageIdx === idx ? '#FFFFFF' : '#1E293B',
                fontWeight: 900,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Layers size={14} /> Stage {stg.id}
            </button>
          ))}
        </div>

        {/* Reset Button */}
        <button
          onClick={() => handleResetRef.current && handleResetRef.current()}
          style={{
            padding: '0.5rem 1.2rem',
            borderRadius: '18px',
            border: '1.5px solid #A7F3D0',
            background: '#FFFFFF',
            color: '#064E3B',
            fontWeight: 900,
            fontSize: '0.82rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(6, 78, 59, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            pointerEvents: 'auto'
          }}
        >
          <RotateCcw size={15} /> Reset Marble
        </button>
      </div>

      {/* Stage Title Display */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: '24px',
        zIndex: 30,
        color: '#FFFFFF',
        fontWeight: 900,
        fontSize: '1rem',
        textShadow: '0 2px 8px rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem'
      }}>
        <Trophy size={18} color="#FDE047" /> {MAZE_STAGES[currentStageIdx].name}
      </div>

      {/* Full Page 3D Canvas */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={720}
        style={{
          width: '100%',
          height: '100%',
          maxHeight: 'calc(100vh - 160px)',
          objectFit: 'contain',
          touchAction: 'none',
          borderRadius: '24px',
          border: '2.5px solid #A7F3D0',
          boxShadow: '0 12px 35px rgba(6, 78, 59, 0.12)',
          cursor: 'grab'
        }}
      />
    </div>
  );
}
