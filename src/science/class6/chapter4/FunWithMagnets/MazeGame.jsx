import React, { useEffect, useRef } from 'react';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawBar(ctx, cx, cy, w, h) {
  ctx.save();
  const g1 = ctx.createLinearGradient(cx - w / 2, 0, cx, 0);
  g1.addColorStop(0, "#F07070");
  g1.addColorStop(1, "#C74444");
  ctx.fillStyle = g1;
  roundRect(ctx, cx - w / 2, cy - h / 2, w / 2, h, 5);
  ctx.fill();
  const g2 = ctx.createLinearGradient(cx, 0, cx + w / 2, 0);
  g2.addColorStop(0, "#4477C7");
  g2.addColorStop(1, "#7FB2F0");
  ctx.fillStyle = g2;
  roundRect(ctx, cx, cy - h / 2, w / 2, h, 5);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold " + (h * 0.55) + "px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("N", cx - w / 4, cy);
  ctx.fillText("S", cx + w / 4, cy);
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use actual dimensions for higher DPI if necessary, but keep original logic for now
    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext("2d");

    let mzDrag = false;
    let animFrame = null;

    const wallThick = 20;
    let mzBall = { x: 100, y: 120, vx: 0, vy: 0 };
    let mzMag = { x: 100, y: 120 };
    const mzExit = { x: 700, y: 750, r: 22 };
    const mzWalls = [
      { x: 60, y: 60, w: 540, h: wallThick },
      { x: 60, y: 60, w: wallThick, h: 680 },
      { x: 60, y: 720, w: 220, h: wallThick },
      { x: 340, y: 720, w: 280, h: wallThick },
      { x: 720, y: 60, w: wallThick, h: 280 },
      { x: 660, y: 200, w: wallThick, h: 280 },
      { x: 720, y: 440, w: wallThick, h: 300 },
      { x: 560, y: 60, w: wallThick, h: 100 },
      { x: 380, y: 140, w: 180, h: wallThick },
      { x: 480, y: 140, w: wallThick, h: 140 },
      { x: 580, y: 180, w: 120, h: wallThick },
      { x: 580, y: 180, w: wallThick, h: 140 },
      { x: 140, y: 160, w: wallThick, h: 120 },
      { x: 140, y: 260, w: 200, h: wallThick },
      { x: 240, y: 260, w: wallThick, h: 100 },
      { x: 240, y: 340, w: 160, h: wallThick },
      { x: 200, y: 400, w: 340, h: wallThick },
      { x: 200, y: 400, w: wallThick, h: 140 },
      { x: 260, y: 520, w: wallThick, h: 160 },
      { x: 340, y: 480, w: 160, h: wallThick },
      { x: 420, y: 480, w: wallThick, h: 120 },
      { x: 420, y: 580, w: 160, h: wallThick },
      { x: 540, y: 380, w: 100, h: wallThick },
      { x: 540, y: 380, w: wallThick, h: 100 },
      { x: 640, y: 380, w: wallThick, h: 160 },
      { x: 540, y: 520, w: 120, h: wallThick },
      { x: 600, y: 580, w: wallThick, h: 140 },
      { x: 600, y: 660, w: 140, h: wallThick },
      { x: 60, y: 500, w: 80, h: wallThick },
      { x: 120, y: 500, w: wallThick, h: 120 },
      { x: 60, y: 600, w: 80, h: wallThick },
      { x: 260, y: 640, w: 280, h: wallThick },
      { x: 400, y: 720, w: wallThick, h: 80 },
      { x: 660, y: 720, w: wallThick, h: 80 },
      { x: 660, y: 780, w: 80, h: wallThick }
    ];

    const mzDown = (e) => {
      const r = canvas.getBoundingClientRect();
      const scaleX = canvas.width / r.width;
      const scaleY = canvas.height / r.height;
      const mouseX = (e.clientX - r.left) * scaleX;
      const mouseY = (e.clientY - r.top) * scaleY;
      
      if (Math.hypot(mouseX - mzMag.x, mouseY - mzMag.y) < 70) {
        mzDrag = true;
        canvas.setPointerCapture(e.pointerId);
      }
    };

    const mzMove = (e) => {
      if (!mzDrag) return;
      const r = canvas.getBoundingClientRect();
      const scaleX = canvas.width / r.width;
      const scaleY = canvas.height / r.height;
      mzMag.x = Math.max(20, Math.min(canvas.width - 20, (e.clientX - r.left) * scaleX));
      mzMag.y = Math.max(20, Math.min(canvas.height - 20, (e.clientY - r.top) * scaleY));
    };

    const mzUp = () => {
      mzDrag = false;
    };

    canvas.addEventListener("pointerdown", mzDown);
    canvas.addEventListener("pointermove", mzMove);
    window.addEventListener("pointerup", mzUp);

    function mzBlocked(x, y) {
      for (const w of mzWalls) {
        if (x > w.x - 8 && x < w.x + w.w + 8 && y > w.y - 8 && y < w.y + w.h + 8) return true;
      }
      return false;
    }

    function stepMaze() {
      let dx = mzMag.x - mzBall.x, dy = mzMag.y - mzBall.y, dist = Math.hypot(dx, dy) || 1;
      const pull = Math.min(0.6, 120 / (dist * dist) * 20);
      mzBall.vx = (mzBall.vx + dx / dist * pull) * 0.85;
      mzBall.vy = (mzBall.vy + dy / dist * pull) * 0.85;
      
      let nx = mzBall.x + mzBall.vx, ny = mzBall.y + mzBall.vy;
      if (!mzBlocked(nx, mzBall.y)) mzBall.x = Math.max(10, Math.min(W - 10, nx)); else mzBall.vx *= -0.3;
      if (!mzBlocked(mzBall.x, ny)) mzBall.y = Math.max(10, Math.min(H - 10, ny)); else mzBall.vy *= -0.3;
      
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#24252A";
      roundRect(ctx, 4, 4, W - 8, H - 8, 10);
      ctx.fill();
      ctx.fillStyle = "#A350D1";
      for (const w of mzWalls) {
        roundRect(ctx, w.x, w.y, w.w, w.h, 5);
        ctx.fill();
      }
      
      ctx.fillStyle = "rgba(92,225,185,.25)";
      ctx.strokeStyle = "#5CE1B9";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mzExit.x, mzExit.y, mzExit.r, 0, 7);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#5CE1B9";
      ctx.font = "16px Segoe UI";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✓", mzExit.x, mzExit.y);
      
      ctx.fillStyle = "#C8D0E8";
      ctx.beginPath();
      ctx.arc(mzBall.x, mzBall.y, 9, 0, 7);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.5)";
      ctx.beginPath();
      ctx.arc(mzBall.x - 3, mzBall.y - 3, 3, 0, 7);
      ctx.fill();
      
      ctx.globalAlpha = 0.6;
      ctx.save();
      ctx.translate(mzMag.x, mzMag.y);
      drawBar(ctx, 0, 0, 70, 18);
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(124,158,255,.3)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(mzMag.x, mzMag.y, 44, 0, 7);
      ctx.stroke();
      ctx.setLineDash([]);
      
      if (!isSolvedRef.current && Math.hypot(mzBall.x - mzExit.x, mzBall.y - mzExit.y) < mzExit.r) {
        isSolvedRef.current = true;
        if (onSolveRef.current) onSolveRef.current();
      }
      animFrame = requestAnimationFrame(stepMaze);
    }

    stepMaze();

    return () => {
      cancelAnimationFrame(animFrame);
      canvas.removeEventListener("pointerdown", mzDown);
      canvas.removeEventListener("pointermove", mzMove);
      window.removeEventListener("pointerup", mzUp);
    };
  }, []);

  return (
    <canvas ref={canvasRef} width={800} height={800} style={{ width: '100%', height: 'auto', touchAction: 'none' }} />
  );
}
