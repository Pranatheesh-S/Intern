import React, { useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

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
  auraGlow.addColorStop(0, "rgba(245, 158, 11, 0.6)");
  auraGlow.addColorStop(0.5, "rgba(239, 68, 68, 0.35)");
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
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.beginPath();
  ctx.ellipse(0, radius * 0.7, radius * 0.8, radius * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Outer Chrome Sphere
  const gSteel = ctx.createRadialGradient(-radius * 0.35, -radius * 0.35, radius * 0.1, 0, 0, radius);
  gSteel.addColorStop(0, "#FFFFFF");
  gSteel.addColorStop(0.3, "#E2E8F0");
  gSteel.addColorStop(0.7, "#64748B");
  gSteel.addColorStop(1, "#1E293B");

  ctx.fillStyle = gSteel;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Specular Highlight
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.beginPath();
  ctx.arc(-radius * 0.35, -radius * 0.35, radius * 0.28, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export default function MazeGame({ onSolve, isSolved }) {
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

    let isDragging = false;
    let animFrame = null;

    // Magnet & 3 Steel Balls state
    let mag = { x: 80, y: 80 };
    let balls = [
      { x: 80, y: 80, vx: 0, vy: 0, r: 14, id: 1 },
      { x: 100, y: 80, vx: 0, vy: 0, r: 12, id: 2 },
      { x: 80, y: 100, vx: 0, vy: 0, r: 13, id: 3 }
    ];

    handleResetRef.current = () => {
      mag = { x: 80, y: 80 };
      balls[0].x = 80; balls[0].y = 80; balls[0].vx = 0; balls[0].vy = 0;
      balls[1].x = 100; balls[1].y = 80; balls[1].vx = 0; balls[1].vy = 0;
      balls[2].x = 80; balls[2].y = 100; balls[2].vx = 0; balls[2].vy = 0;
    };

    // HIGH-DENSITY TOUGH MAZE WALL GRID
    const mazeWalls = [
      // Outer Tray Rim
      { x: 20, y: 20, w: 960, h: 14 },
      { x: 20, y: 686, w: 960, h: 14 },
      { x: 20, y: 20, w: 14, h: 680 },
      { x: 966, y: 20, w: 14, h: 680 },

      // Vertical Interlocking Walls
      { x: 140, y: 20, w: 14, h: 420 },
      { x: 140, y: 520, w: 14, h: 180 },

      { x: 260, y: 140, w: 14, h: 440 },

      { x: 380, y: 20, w: 14, h: 320 },
      { x: 380, y: 440, w: 14, h: 260 },

      { x: 500, y: 140, w: 14, h: 440 },

      { x: 620, y: 20, w: 14, h: 320 },
      { x: 620, y: 440, w: 14, h: 260 },

      { x: 740, y: 140, w: 14, h: 440 },

      { x: 860, y: 20, w: 14, h: 540 },

      // Horizontal Barriers
      { x: 20, y: 240, w: 70, h: 14 },
      { x: 140, y: 140, w: 60, h: 14 },
      { x: 140, y: 380, w: 70, h: 14 },

      { x: 260, y: 240, w: 60, h: 14 },
      { x: 260, y: 480, w: 60, h: 14 },

      { x: 380, y: 140, w: 60, h: 14 },
      { x: 380, y: 340, w: 70, h: 14 },

      { x: 500, y: 240, w: 60, h: 14 },
      { x: 500, y: 440, w: 70, h: 14 },

      { x: 620, y: 140, w: 60, h: 14 },
      { x: 620, y: 340, w: 70, h: 14 },

      { x: 740, y: 240, w: 60, h: 14 },
      { x: 740, y: 480, w: 70, h: 14 },

      { x: 860, y: 140, w: 50, h: 14 },
      { x: 860, y: 340, w: 50, h: 14 }
    ];

    const goalArea = { x: 915, y: 630, r: 48 };

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

    function step() {
      // Pull steel balls smoothly toward underboard magnet
      let allInGoal = true;

      for (const b of balls) {
        let dx = mag.x - b.x;
        let dy = mag.y - b.y;
        let dist = Math.hypot(dx, dy) || 1;

        const pullForce = Math.min(2.2, (450 / (dist + 10)));
        b.vx = (b.vx + (dx / dist) * pullForce) * 0.88;
        b.vy = (b.vy + (dy / dist) * pullForce) * 0.88;

        let nextX = b.x + b.vx;
        let nextY = b.y + b.vy;

        // Wall collisions
        for (const w of mazeWalls) {
          if (nextX + b.r > w.x && nextX - b.r < w.x + w.w &&
              nextY + b.r > w.y && nextY - b.r < w.y + w.h) {
            b.vx *= -0.3;
            b.vy *= -0.3;
            nextX = b.x;
            nextY = b.y;
            break;
          }
        }

        b.x = nextX;
        b.y = nextY;

        if (Math.hypot(b.x - goalArea.x, b.y - goalArea.y) > goalArea.r) {
          allInGoal = false;
        }
      }

      ctx.clearRect(0, 0, W, H);

      // 1. Board Surface Texture
      const gBoard = ctx.createLinearGradient(0, 0, W, H);
      gBoard.addColorStop(0, "#FEF3C7");
      gBoard.addColorStop(0.5, "#F59E0B");
      gBoard.addColorStop(1, "#D97706");
      ctx.fillStyle = gBoard;
      ctx.fillRect(0, 0, W, H);

      // Cardboard Grid Lines
      ctx.strokeStyle = "rgba(120, 53, 15, 0.15)";
      ctx.lineWidth = 1;
      for (let x = 40; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 40; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // 2. Render 3D Walls
      for (const w of mazeWalls) {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.fillRect(w.x + 6, w.y + 6, w.w, w.h);

        const gWall = ctx.createLinearGradient(w.x, w.y, w.x + w.w, w.y + w.h);
        gWall.addColorStop(0, "#065F46");
        gWall.addColorStop(0.5, "#047857");
        gWall.addColorStop(1, "#022C22");
        ctx.fillStyle = gWall;
        ctx.fillRect(w.x, w.y, w.w, w.h);

        ctx.fillStyle = "#A7F3D0";
        ctx.fillRect(w.x, w.y, w.w, 3);
        ctx.restore();
      }

      // 3. Draw Goal Sanctuary 🏰
      ctx.save();
      ctx.translate(goalArea.x, goalArea.y);

      const haloGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, goalArea.r * 1.4);
      haloGlow.addColorStop(0, "rgba(245, 158, 11, 0.65)");
      haloGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = haloGlow;
      ctx.beginPath();
      ctx.arc(0, 0, goalArea.r * 1.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, goalArea.r, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      ctx.font = "34px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🏰", 0, -2);
      ctx.restore();

      // 4. Draw Magnetic Force Rays
      for (const b of balls) {
        let dist = Math.hypot(mag.x - b.x, mag.y - b.y);
        if (dist < 400) {
          ctx.save();
          ctx.strokeStyle = "rgba(245, 158, 11, 0.85)";
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 6]);
          ctx.beginPath();
          ctx.moveTo(mag.x, mag.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 5. Draw 3D Chrome Steel Marbles
      for (const b of balls) {
        drawSteelBall(ctx, b.x, b.y, b.r);
      }

      // 6. Draw Underboard Magnet
      draw3DMagnet(ctx, mag.x, mag.y, 104, 30);

      // Check Solved
      if (!isSolvedRef.current && allInGoal) {
        isSolvedRef.current = true;
        if (onSolveRef.current) onSolveRef.current();
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
  }, []);

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
      {/* Top Controls Overlay Bar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '16px',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem'
      }}>
        <button
          onClick={() => handleResetRef.current && handleResetRef.current()}
          style={{
            padding: '0.55rem 1.25rem',
            borderRadius: '20px',
            border: '1.5px solid #A7F3D0',
            background: '#FFFFFF',
            color: '#064E3B',
            fontWeight: 900,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(6, 78, 59, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <RotateCcw size={16} /> Reset Marbles
        </button>
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
