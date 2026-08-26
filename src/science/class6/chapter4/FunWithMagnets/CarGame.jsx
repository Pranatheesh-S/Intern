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

function drawDetailedBarMagnet(ctx, cx, cy, w, h, flip = false) {
  ctx.save();

  // Drop Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + h * 0.45, w * 0.48, h * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  const halfW = w / 2;
  const halfH = h / 2;

  // Left Pole (South if flipped, else North)
  const leftColor = flip ? "#2563EB" : "#DC2626";
  const leftLight = flip ? "#60A5FA" : "#EF4444";
  const leftDark = flip ? "#1D4ED8" : "#991B1B";

  const gLeft = ctx.createLinearGradient(cx - halfW, cy - halfH, cx - halfW, cy + halfH);
  gLeft.addColorStop(0, leftLight);
  gLeft.addColorStop(0.5, leftColor);
  gLeft.addColorStop(1, leftDark);

  ctx.fillStyle = gLeft;
  roundRect(ctx, cx - halfW, cy - halfH, halfW, h, 6);
  ctx.fill();

  // Right Pole (North if flipped, else South)
  const rightColor = flip ? "#DC2626" : "#2563EB";
  const rightLight = flip ? "#EF4444" : "#60A5FA";
  const rightDark = flip ? "#991B1B" : "#1D4ED8";

  const gRight = ctx.createLinearGradient(cx, cy - halfH, cx, cy + halfH);
  gRight.addColorStop(0, rightLight);
  gRight.addColorStop(0.5, rightColor);
  gRight.addColorStop(1, rightDark);

  ctx.fillStyle = gRight;
  roundRect(ctx, cx, cy - halfH, halfW, h, 6);
  ctx.fill();

  // Center Metallic Dividing Line
  ctx.fillStyle = "#CBD5E1";
  ctx.fillRect(cx - 2, cy - halfH, 4, h);

  // Chrome Gloss Highlight Stripe
  const gGloss = ctx.createLinearGradient(0, cy - halfH, 0, cy - halfH * 0.3);
  gGloss.addColorStop(0, "rgba(255, 255, 255, 0.4)");
  gGloss.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gGloss;
  roundRect(ctx, cx - halfW + 2, cy - halfH + 2, w - 4, h * 0.35, 4);
  ctx.fill();

  // Pole Lettering ('S' & 'N')
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `900 ${Math.round(h * 0.52)}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowBlur = 4;

  ctx.fillText(flip ? "S" : "N", cx - halfW / 2, cy + 1);
  ctx.fillText(flip ? "N" : "S", cx + halfW / 2, cy + 1);

  ctx.restore();
}

function drawToyCar(ctx, cx, cy, w, h) {
  ctx.save();

  // 1. Soft Dynamic Ground Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + h * 0.42, w * 0.48, h * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Heavy Rubber Tires with Chrome Rims
  const wheelR = h * 0.24;
  const wheelY = cy + h * 0.34;
  const wheelOffset = w * 0.32;

  // Rear Wheel
  ctx.fillStyle = "#1E293B";
  ctx.beginPath();
  ctx.arc(cx + wheelOffset, wheelY, wheelR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#94A3B8";
  ctx.beginPath();
  ctx.arc(cx + wheelOffset, wheelY, wheelR * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Front Wheel
  ctx.fillStyle = "#1E293B";
  ctx.beginPath();
  ctx.arc(cx - wheelOffset, wheelY, wheelR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#94A3B8";
  ctx.beginPath();
  ctx.arc(cx - wheelOffset, wheelY, wheelR * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // 3. Aerodynamic Toy Car Body
  const gCar = ctx.createLinearGradient(0, cy - h * 0.2, 0, cy + h * 0.35);
  gCar.addColorStop(0, "#F59E0B");
  gCar.addColorStop(0.5, "#D97706");
  gCar.addColorStop(1, "#78350F");

  ctx.fillStyle = gCar;
  ctx.beginPath();
  roundRect(ctx, cx - w * 0.48, cy - h * 0.05, w * 0.96, h * 0.38, 10);
  ctx.fill();

  // Cabin Roof
  const gRoof = ctx.createLinearGradient(0, cy - h * 0.35, 0, cy);
  gRoof.addColorStop(0, "#FEF3C7");
  gRoof.addColorStop(1, "#F59E0B");
  ctx.fillStyle = gRoof;
  ctx.beginPath();
  roundRect(ctx, cx - w * 0.32, cy - h * 0.34, w * 0.64, h * 0.32, 8);
  ctx.fill();

  // Cabin Windows (Glass)
  ctx.fillStyle = "#0F172A";
  roundRect(ctx, cx - w * 0.28, cy - h * 0.3, w * 0.24, h * 0.22, 4);
  ctx.fill();
  roundRect(ctx, cx + w * 0.04, cy - h * 0.3, w * 0.24, h * 0.22, 4);
  ctx.fill();

  // Headlight (Yellow LED)
  ctx.fillStyle = "#FDE047";
  roundRect(ctx, cx - w * 0.48, cy + h * 0.04, w * 0.05, h * 0.15, 3);
  ctx.fill();

  // 4. Bar Magnet Mounted on Top Roof of Toy Car (N pole on left facing hand magnet!)
  drawDetailedBarMagnet(ctx, cx, cy - h * 0.45, w * 0.72, h * 0.3, false);

  ctx.restore();
}

export default function CarGame({ isPushing, onComplete }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    let carX = W * 0.52;
    let handX = W * 0.16;

    function renderScene(hX, cX, now = 0) {
      ctx.clearRect(0, 0, W, H);

      const cy = H * 0.46;
      const magnetW = 180;
      const magnetH = 54;
      const carW = 210;
      const carH = 95;

      // Track Road line
      ctx.save();
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(30, cy + carH * 0.42);
      ctx.lineTo(W - 30, cy + carH * 0.42);
      ctx.stroke();
      ctx.restore();

      // 1. Draw Hand Magnet (N Pole facing right toward car's N pole)
      drawDetailedBarMagnet(ctx, hX, cy, magnetW, magnetH, true);

      // Hand Magnet Label
      ctx.save();
      ctx.fillStyle = "#065F46";
      ctx.font = "900 13px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Your Magnet (N Pole Ahead) 🧲", hX, cy + magnetH * 0.85);
      ctx.restore();

      // 2. Draw Toy Car with Mounted Bar Magnet
      drawToyCar(ctx, cX, cy, carW, carH);

      // Toy Car Label
      ctx.save();
      ctx.fillStyle = "#065F46";
      ctx.font = "900 13px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Toy Car with Bar Magnet (N Pole Facing) 🚗", cX, cy + carH * 0.72);
      ctx.restore();

      // 3. Magnetic Repulsion Force Field Arcs between the two facing N poles
      const handNPoleX = hX + magnetW / 2;
      const carNPoleX = cX - carW * 0.36;
      const gap = carNPoleX - handNPoleX;

      if (gap < 190 && gap > 0) {
        ctx.save();
        const midX = (handNPoleX + carNPoleX) / 2;
        const repulsionStrength = 1 - (gap / 190);
        const pulse = 1 + 0.15 * Math.sin(now * 0.015);

        // Repulsion Field Arcs (Bowing outward from like poles)
        for (let i = 1; i <= 3; i++) {
          const arcSpread = i * 16 * repulsionStrength * pulse;
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + 0.2 * i * repulsionStrength})`;
          ctx.lineWidth = 3;

          // Left arc (curving back toward hand magnet)
          ctx.beginPath();
          ctx.arc(midX - 8, cy, arcSpread, -Math.PI * 0.38, Math.PI * 0.38);
          ctx.stroke();

          // Right arc (curving forward toward car)
          ctx.beginPath();
          ctx.arc(midX + 8, cy, arcSpread, Math.PI * 0.62, Math.PI * 1.38);
          ctx.stroke();
        }

        // Repulsion label badge
        ctx.fillStyle = "rgba(220, 38, 38, 0.95)";
        roundRect(ctx, midX - 58, cy - magnetH * 0.9, 116, 22, 11);
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "900 10px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("N ⚡ N (LIKE POLES REPEL)", midX, cy - magnetH * 0.9 + 11);

        ctx.restore();
      }
    }

    if (!isPushing) {
      renderScene(W * 0.16, W * 0.52);
      return;
    }

    let t = 0;
    const startHandX = W * 0.16;
    const startCarX = W * 0.52;

    function anim() {
      t += 0.022;
      const now = performance.now();

      // Hand moves forward toward car
      handX = startHandX + t * 160;

      // Car is pushed away smoothly by magnetic repulsion
      const pushTrigger = handX + 180;
      if (pushTrigger > carX) {
        carX = startCarX + (pushTrigger - startCarX) * 1.4;
      }
      if (carX > W - 140) carX = W - 140;

      renderScene(handX, carX, now);

      if (t < 1.6) {
        animRef.current = requestAnimationFrame(anim);
      } else {
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }

    animRef.current = requestAnimationFrame(anim);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPushing]);

  return (
    <canvas
      ref={canvasRef}
      width={880}
      height={260}
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: '18px',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
        border: '1.5px solid #E2E8F0',
        display: 'block',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.04)'
      }}
    />
  );
}
