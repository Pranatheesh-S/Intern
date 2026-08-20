import React, { useEffect, useRef, useState } from 'react';

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
  const auraGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, w * 0.9);
  auraGlow.addColorStop(0, "rgba(245, 158, 11, 0.5)");
  auraGlow.addColorStop(0.5, "rgba(239, 68, 68, 0.25)");
  auraGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = auraGlow;
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.9, 0, Math.PI * 2);
  ctx.fill();

  // Drop Shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
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

  // Metallic Seam Divider
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

function drawLion(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);

  // Soft Drop Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.beginPath();
  ctx.ellipse(0, size * 0.38, size * 0.35, size * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Lion Fluffy Mane Outer
  ctx.fillStyle = "#B45309";
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.46, 0, Math.PI * 2);
  ctx.fill();

  // Lion Inner Mane Accent
  ctx.fillStyle = "#D97706";
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.38, 0, Math.PI * 2);
  ctx.fill();

  // Lion Face Base
  ctx.fillStyle = "#F59E0B";
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = "#B45309";
  ctx.beginPath(); ctx.arc(-size * 0.24, -size * 0.28, size * 0.1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(size * 0.24, -size * 0.28, size * 0.1, 0, Math.PI * 2); ctx.fill();

  // Muzzle & Nose
  ctx.fillStyle = "#FEF3C7";
  ctx.beginPath(); ctx.arc(0, size * 0.08, size * 0.14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#78350F";
  ctx.beginPath(); ctx.arc(0, size * 0.02, size * 0.06, 0, Math.PI * 2); ctx.fill();

  // Fierce Playful Eyes
  ctx.fillStyle = "#0F172A";
  ctx.beginPath(); ctx.arc(-size * 0.1, -size * 0.08, size * 0.04, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(size * 0.1, -size * 0.08, size * 0.04, 0, Math.PI * 2); ctx.fill();

  // Label Tag
  ctx.fillStyle = "#18181B";
  ctx.strokeStyle = "#EF4444";
  ctx.lineWidth = 1;
  roundRect(ctx, -26, -size * 0.62, 52, 16, 4);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#EF4444";
  ctx.font = "900 10px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🦁 LION", 0, -size * 0.62 + 8);

  ctx.restore();
}

export default function MazeGame({ onSolve, isSolved }) {
  const canvasRef = useRef(null);

  const onSolveRef = useRef(onSolve);
  const isSolvedRef = useRef(isSolved);

  const [warningText, setWarningText] = useState("🧲 Drag the Magnet to help the Deer run through the forest to safety!");

  useEffect(() => {
    onSolveRef.current = onSolve;
    isSolvedRef.current = isSolved;
  }, [onSolve, isSolved]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext("2d");

    // Load 3D Deer Image
    const deerImg = new Image();
    deerImg.src = "/FunWithMagnets/deer.png";

    let mzDrag = false;
    let animFrame = null;
    let runTime = 0;

    // Deer position at START (top left)
    let deer = { x: 100, y: 100, vx: 0, vy: 0 };
    // Magnet position under deer
    let mzMag = { x: 100, y: 100 };
    // Chasing Lion position (starts behind deer)
    let lion = { x: 45, y: 45 };

    // Goal Rescue Sanctuary at bottom right
    const mzExit = { x: 700, y: 700, r: 44 };

    // LOGICAL FOREST MAZE WALL BARRIERS
    const wallThick = 22;
    const mzWalls = [
      // Outer Perimeter Hedge Walls
      { x: 30, y: 30, w: 740, h: wallThick },
      { x: 30, y: 30, w: wallThick, h: 740 },
      { x: 30, y: 744, w: 600, h: wallThick },
      { x: 744, y: 30, w: wallThick, h: 600 },

      // Forest Hedge Barriers (Forming logical paths and turns)
      { x: 150, y: 150, w: 480, h: wallThick },
      { x: 150, y: 150, w: wallThick, h: 320 },
      { x: 270, y: 270, w: 360, h: wallThick },
      { x: 630, y: 270, w: wallThick, h: 260 },
      { x: 150, y: 470, w: 360, h: wallThick },
      { x: 270, y: 390, w: wallThick, h: 220 },
      { x: 390, y: 590, w: 354, h: wallThick },
      { x: 510, y: 470, w: wallThick, h: 220 }
    ];

    const mzDown = (e) => {
      const r = canvas.getBoundingClientRect();
      const scaleX = canvas.width / r.width;
      const scaleY = canvas.height / r.height;
      const mouseX = (e.clientX - r.left) * scaleX;
      const mouseY = (e.clientY - r.top) * scaleY;
      
      if (Math.hypot(mouseX - mzMag.x, mouseY - mzMag.y) < 90) {
        mzDrag = true;
        canvas.setPointerCapture(e.pointerId);
      }
    };

    const mzMove = (e) => {
      if (!mzDrag) return;
      const r = canvas.getBoundingClientRect();
      const scaleX = canvas.width / r.width;
      const scaleY = canvas.height / r.height;
      mzMag.x = Math.max(30, Math.min(canvas.width - 30, (e.clientX - r.left) * scaleX));
      mzMag.y = Math.max(30, Math.min(canvas.height - 30, (e.clientY - r.top) * scaleY));
    };

    const mzUp = () => {
      mzDrag = false;
    };

    canvas.addEventListener("pointerdown", mzDown);
    canvas.addEventListener("pointermove", mzMove);
    window.addEventListener("pointerup", mzUp);

    function mzBlocked(x, y) {
      for (const w of mzWalls) {
        if (x > w.x - 18 && x < w.x + w.w + 18 && y > w.y - 18 && y < w.y + w.h + 18) return true;
      }
      return false;
    }

    function stepMaze() {
      runTime += 0.05;
      let dx = mzMag.x - deer.x;
      let dy = mzMag.y - deer.y;
      let dist = Math.hypot(dx, dy) || 1;

      // Magnetic Pull Physics: Pulls the Deer along the forest paths
      const pullForce = Math.min(1.2, (230 / (dist + 12)));
      deer.vx = (deer.vx + (dx / dist) * pullForce) * 0.86;
      deer.vy = (deer.vy + (dy / dist) * pullForce) * 0.86;
      
      let nx = deer.x + deer.vx;
      let ny = deer.y + deer.vy;

      if (!mzBlocked(nx, deer.y)) {
        deer.x = Math.max(30, Math.min(W - 30, nx));
      } else {
        deer.vx *= -0.2;
      }

      if (!mzBlocked(deer.x, ny)) {
        deer.y = Math.max(30, Math.min(H - 30, ny));
      } else {
        deer.vy *= -0.2;
      }

      // Lion AI Chase Physics: The Lion pursues the Deer along the path
      let ldx = deer.x - lion.x;
      let ldy = deer.y - lion.y;
      let ldist = Math.hypot(ldx, ldy) || 1;

      const lionSpeed = 1.05; // Lion steady chase speed
      if (ldist > 35) {
        let lnx = lion.x + (ldx / ldist) * lionSpeed;
        let lny = lion.y + (ldy / ldist) * lionSpeed;
        if (!mzBlocked(lnx, lion.y)) lion.x = lnx;
        if (!mzBlocked(lion.x, lny)) lion.y = lny;
      }

      // Check distance between Lion and Deer
      if (ldist < 40) {
        setWarningText("⚠️ LION IS CLOSING IN! Pull the magnet fast to rescue the Deer!");
      } else {
        setWarningText("🧲 Drag the Magnet to help the Deer run through the forest to safety!");
      }

      ctx.clearRect(0, 0, W, H);

      // 1. Enchanted Forest Canvas Background
      ctx.fillStyle = "#022C22";
      ctx.fillRect(0, 0, W, H);

      // Forest Trees Detail
      ctx.fillStyle = "#064E3B";
      for (let tx = 50; tx < W; tx += 90) {
        for (let ty = 50; ty < H; ty += 90) {
          ctx.beginPath(); ctx.arc(tx, ty, 6, 0, Math.PI * 2); ctx.fill();
        }
      }

      // 2. Dirt Trail Forest Paths (With Glowing Gold Borders)
      ctx.fillStyle = "#B45309";
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 2.5;

      roundRect(ctx, 52, 52, 696, 696, 16); ctx.fill(); ctx.stroke();
      roundRect(ctx, 172, 172, 456, 456, 12); ctx.fill(); ctx.stroke();

      // Forest Acorns / Berries Collectibles
      ctx.fillStyle = "#F59E0B";
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1.5;
      const itemPositions = [
        {x: 210, y: 95}, {x: 400, y: 95}, {x: 690, y: 210},
        {x: 570, y: 330}, {x: 210, y: 330}, {x: 210, y: 530},
        {x: 450, y: 530}, {x: 570, y: 650}
      ];
      for (const item of itemPositions) {
        ctx.beginPath();
        ctx.arc(item.x, item.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#000000";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🌿", item.x, item.y);
        ctx.fillStyle = "#F59E0B";
      }

      // 3. Draw Forest Hedge & Wood Walls
      for (const w of mzWalls) {
        // Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
        roundRect(ctx, w.x + 3, w.y + 3, w.w, w.h, 6);
        ctx.fill();

        // Hedge Body
        const gHedge = ctx.createLinearGradient(w.x, w.y, w.x + w.w, w.y + w.h);
        gHedge.addColorStop(0, "#166534");
        gHedge.addColorStop(1, "#14532D");
        ctx.fillStyle = gHedge;
        ctx.strokeStyle = "#052E16";
        ctx.lineWidth = 1.5;
        roundRect(ctx, w.x, w.y, w.w, w.h, 6);
        ctx.fill();
        ctx.stroke();
      }

      // START Sign Banner (Top Left)
      ctx.fillStyle = "#2563EB";
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      roundRect(ctx, 55, 55, 90, 32, 8);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🏁 START", 100, 71);

      // 4. Draw Goal Rescue Sanctuary (Bottom Right Exit)
      ctx.save();
      const goalPulse = 1 + Math.sin(runTime * 4) * 0.08;
      ctx.fillStyle = "rgba(34, 197, 94, 0.4)";
      ctx.strokeStyle = "#22C55E";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(mzExit.x, mzExit.y, mzExit.r * goalPulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 15px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🏰 SANCTUARY", mzExit.x, mzExit.y);
      ctx.restore();

      // 5. Draw Chasing Lion
      drawLion(ctx, lion.x, lion.y, 60);

      // 6. Draw Magnetic Field Rays between Magnet and Deer
      if (dist < 260) {
        ctx.save();
        ctx.strokeStyle = "rgba(245, 158, 11, 0.8)";
        ctx.lineWidth = 3.5;
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = -runTime * 40;
        ctx.beginPath();
        ctx.moveTo(mzMag.x, mzMag.y);
        ctx.lineTo(deer.x, deer.y);
        ctx.stroke();
        ctx.restore();
      }

      // 7. Draw 3D Deer Character (Smooth Motion - No Shaking)
      ctx.save();
      ctx.translate(deer.x, deer.y);

      // Smooth vertical stride bounce
      const currentSpeed = Math.hypot(deer.vx, deer.vy);
      const isRunning = currentSpeed > 0.25;
      const strideBounce = isRunning ? Math.abs(Math.sin(runTime * 8)) * -4 : 0;

      ctx.translate(0, strideBounce);

      // Drop Shadow under Deer hooves
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.ellipse(0, 34, 26, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Render 3D Deer Image (88x88 px)
      if (deerImg.complete && deerImg.naturalWidth !== 0) {
        const deerSize = 88;
        ctx.drawImage(deerImg, -deerSize / 2, -deerSize / 2, deerSize, deerSize);
      } else {
        // Fallback Deer Badge
        ctx.fillStyle = "#B45309";
        ctx.beginPath();
        ctx.arc(0, -5, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("🦌", 0, 0);
      }
      ctx.restore();

      // 8. Draw Magnet under the board
      draw3DMagnet(ctx, mzMag.x, mzMag.y, 96, 28);

      // Check Goal Rescue Solved
      if (!isSolvedRef.current && Math.hypot(deer.x - mzExit.x, deer.y - mzExit.y) < mzExit.r) {
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={800} 
        style={{ 
          maxWidth: '100%', 
          maxHeight: 'calc(100vh - 170px)', 
          width: 'auto', 
          height: 'auto', 
          aspectRatio: '1/1', 
          objectFit: 'contain', 
          touchAction: 'none',
          borderRadius: '24px',
          border: '2px solid #3F3F46',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7)'
        }} 
      />
      <div style={{ fontSize: '0.88rem', color: '#F59E0B', fontWeight: 800, textAlign: 'center' }}>
        {warningText}
      </div>
    </div>
  );
}
