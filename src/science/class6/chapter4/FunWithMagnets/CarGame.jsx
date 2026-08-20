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

function drawBar(ctx, cx, cy, w, h, flip = false) {
  ctx.save();
  const g1 = ctx.createLinearGradient(cx - w / 2, 0, cx, 0);
  g1.addColorStop(0, flip ? "#4477C7" : "#F07070");
  g1.addColorStop(1, flip ? "#7FB2F0" : "#C74444");
  ctx.fillStyle = g1;
  roundRect(ctx, cx - w / 2, cy - h / 2, w / 2, h, 5);
  ctx.fill();
  const g2 = ctx.createLinearGradient(cx, 0, cx + w / 2, 0);
  g2.addColorStop(0, flip ? "#C74444" : "#4477C7");
  g2.addColorStop(1, flip ? "#F07070" : "#7FB2F0");
  ctx.fillStyle = g2;
  roundRect(ctx, cx, cy - h / 2, w / 2, h, 5);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold " + (h * 0.55) + "px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(flip ? "S" : "N", cx - w / 4, cy);
  ctx.fillText(flip ? "N" : "S", cx + w / 4, cy);
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

    let carX = W * 0.42;

    const barImage = new Image();
    barImage.src = "/FunWithMagnets/mini_bar.png";
    const carImage = new Image();
    carImage.src = "/FunWithMagnets/toycar.png";
    
    function drawCars(handX) {
      const cy = H / 2;
      ctx.clearRect(0, 0, W, H);
      
      // hand magnet
      ctx.save();
      ctx.translate(handX, cy);
      if (barImage.complete && barImage.naturalWidth !== 0) {
        ctx.rotate(Math.PI);
        ctx.drawImage(barImage, -70, -20, 140, 40);
      } else {
        drawBar(ctx, 0, 0, 140, 40, true);
      }
      ctx.restore();
      ctx.fillStyle = "#6C77A8";
      ctx.font = "14px Segoe UI";
      ctx.textAlign = "center";
      ctx.fillText("your magnet", handX, cy + 45);
      
      // car with magnet
      if (carImage.complete && carImage.naturalWidth !== 0) {
        // Adjust the size and position as needed to fit the original car dimensions
        ctx.drawImage(carImage, carX - 60, cy - 25, 120, 70);
      } else {
        ctx.fillStyle = "#3A4680";
        roundRect(ctx, carX - 60, cy - 16, 120, 40, 8);
        ctx.fill();
        ctx.fillStyle = "#222A3B";
        ctx.beginPath();
        ctx.arc(carX - 32, cy + 28, 14, 0, 7);
        ctx.arc(carX + 32, cy + 28, 14, 0, 7);
        ctx.fill();
      }
      if (!carImage.complete || carImage.naturalWidth === 0) {
        ctx.save();
        ctx.translate(carX, cy - 28);
        if (barImage.complete && barImage.naturalWidth !== 0) {
          ctx.drawImage(barImage, -44, -12, 88, 24);
        } else {
          drawBar(ctx, 0, 0, 88, 24);
        }
        ctx.restore();
      }
      ctx.fillStyle = "#6C77A8";
      ctx.font = "14px Segoe UI";
      ctx.fillText("toy car", carX, cy + 60);
    }

    if (!isPushing) {
      drawCars(W * 0.15);
      return;
    }

    let t = 0;
    let handX = W * 0.15;
    
    function anim() {
      t += 0.025;
      handX = W * 0.15 + t * 140;
      carX = Math.max(carX, W * 0.42 + Math.max(0, (handX - W * 0.22)) * 2.4);
      if (carX > W - 40) carX = W - 40;
      
      drawCars(handX);
      
      if (t < 1.4) {
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
    <canvas ref={canvasRef} width={800} height={240} style={{ width: '100%', height: 'auto' }} />
  );
}
