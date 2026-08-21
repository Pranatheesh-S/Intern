import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Compass, MapPin, CheckCircle2, Sparkles, Navigation, Target } from 'lucide-react';

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
  auraGlow.addColorStop(0, "rgba(245, 158, 11, 0.75)");
  auraGlow.addColorStop(0.5, "rgba(239, 68, 68, 0.45)");
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
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.beginPath();
  ctx.arc(-radius * 0.35, -radius * 0.35, radius * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Town Waypoints / Landmarks
const LANDMARKS = [
  { id: 'airport', name: 'Skyline Airport ✈️', x: 230, y: 350, icon: '✈️' },
  { id: 'beach', name: 'Sunset Beach 🏖️', x: 170, y: 640, icon: '🏖️' },
  { id: 'park', name: 'Greenfield Park 🌳', x: 490, y: 470, icon: '🌳' },
  { id: 'stadium', name: 'City Stadium 🏟️', x: 670, y: 390, icon: '🏟️' },
  { id: 'hospital', name: 'Central Hospital 🏥', x: 880, y: 390, icon: '🏥' },
  { id: 'fire_station', name: 'Fire Station 🚒', x: 720, y: 560, icon: '🚒' },
  { id: 'cineplex', name: 'Star Cineplex 🎬', x: 850, y: 640, icon: '🎬' }
];

// Sequential Missions
const MISSIONS = [
  {
    id: 1,
    title: "Mission 1: Airport to Sunset Beach",
    desc: "Guide your magnetic object from Skyline Airport through town roads to Sunset Beach 🏖️!",
    start: 'airport',
    target: 'beach'
  },
  {
    id: 2,
    title: "Mission 2: Beach to City Stadium",
    desc: "Navigate past Greenfield Park to reach the City Stadium 🏟️!",
    start: 'beach',
    target: 'stadium'
  },
  {
    id: 3,
    title: "Mission 3: Stadium to Central Hospital",
    desc: "Follow the avenue right into Central Hospital 🏥!",
    start: 'stadium',
    target: 'hospital'
  },
  {
    id: 4,
    title: "Mission 4: Hospital to Fire Station",
    desc: "Guide the magnetic toy down the street to the Fire Station 🚒!",
    start: 'hospital',
    target: 'fire_station'
  }
];

// Selectable Magnetic Toy Objects
const AVATAR_OPTIONS = [
  { id: 'car', label: '🏎️ Sports Car', type: 'image', src: '/FunWithMagnets/toycar.png', size: 48 },
  { id: 'ball', label: '🔮 Steel Ball', type: 'ball', size: 22 },
  { id: 'runner', label: '🏃 Mini Man', type: 'image', src: '/FunWithMagnets/toy_runner.png', size: 44 },
  { id: 'deer', label: '🦌 Cute Deer', type: 'image', src: '/FunWithMagnets/deer.png', size: 46 },
  { id: 'robot', label: '🤖 Big Toy', type: 'image', src: '/FunWithMagnets/big_toy.png', size: 48 }
];

export default function MazeGame({ onSolve, isSolved }) {
  const [missionIdx, setMissionIdx] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState('car');
  const [visitedCount, setVisitedCount] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

  const canvasRef = useRef(null);
  const onSolveRef = useRef(onSolve);
  const isSolvedRef = useRef(isSolved);
  const handleResetRef = useRef(null);

  useEffect(() => {
    onSolveRef.current = onSolve;
    isSolvedRef.current = isSolved;
  }, [onSolve, isSolved]);

  const currentMission = MISSIONS[missionIdx] || MISSIONS[0];
  const startPoint = LANDMARKS.find(l => l.id === currentMission.start) || LANDMARKS[0];
  const targetPoint = LANDMARKS.find(l => l.id === currentMission.target) || LANDMARKS[1];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext("2d");

    // Load background image
    const bgImg = new Image();
    bgImg.src = "/FunWithMagnets/town_map_3d.jpg";

    // Load avatar images
    const avatarImages = {};
    AVATAR_OPTIONS.forEach(opt => {
      if (opt.type === 'image' && opt.src) {
        const img = new Image();
        img.src = opt.src;
        avatarImages[opt.id] = img;
      }
    });

    let isDragging = false;
    let animFrame = null;

    // Magnet and Avatar Object State
    let mag = { x: startPoint.x + 30, y: startPoint.y + 30 };
    let obj = { x: startPoint.x, y: startPoint.y, vx: 0, vy: 0, r: 24, rotation: 0 };

    handleResetRef.current = () => {
      mag = { x: startPoint.x + 30, y: startPoint.y + 30 };
      obj.x = startPoint.x;
      obj.y = startPoint.y;
      obj.vx = 0;
      obj.vy = 0;
    };

    const updateMagnetPos = (e) => {
      const r = canvas.getBoundingClientRect();
      const scaleX = canvas.width / r.width;
      const scaleY = canvas.height / r.height;
      mag.x = Math.max(30, Math.min(canvas.width - 30, (e.clientX - r.left) * scaleX));
      mag.y = Math.max(30, Math.min(canvas.height - 30, (e.clientY - r.top) * scaleY));
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
      // MAGNETIC ATTRACTION PHYSICS
      let dx = mag.x - obj.x;
      let dy = mag.y - obj.y;
      let dist = Math.hypot(dx, dy) || 1;

      // Smooth magnetic pull so object moves naturally towards magnet
      const maxSpeed = 14;
      let targetVx = (dx / dist) * Math.min(maxSpeed, dist * 0.45);
      let targetVy = (dy / dist) * Math.min(maxSpeed, dist * 0.45);

      obj.vx = obj.vx * 0.45 + targetVx * 0.55;
      obj.vy = obj.vy * 0.45 + targetVy * 0.55;

      // Update position within canvas bounds
      obj.x = Math.max(40, Math.min(W - 40, obj.x + obj.vx));
      obj.y = Math.max(40, Math.min(H - 40, obj.y + obj.vy));

      // Calculate smooth rotation angle facing movement direction
      if (Math.abs(obj.vx) > 0.5 || Math.abs(obj.vy) > 0.5) {
        obj.rotation = Math.atan2(obj.vy, obj.vx);
      }

      // 1. Draw 3D Town Map Background
      ctx.clearRect(0, 0, W, H);
      if (bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, 0, 0, W, H);
      } else {
        ctx.fillStyle = "#0F172A";
        ctx.fillRect(0, 0, W, H);
      }

      // 2. Draw Target Goal Beacon
      ctx.save();
      ctx.translate(targetPoint.x, targetPoint.y);

      // Glowing Aura
      const targetGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, 48);
      targetGlow.addColorStop(0, "rgba(245, 158, 11, 0.85)");
      targetGlow.addColorStop(0.5, "rgba(239, 68, 68, 0.5)");
      targetGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = targetGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.fill();

      // Beacon Disc
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = "20px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(targetPoint.icon, 0, 1);

      // Target Label Pill
      ctx.fillStyle = "#064E3B";
      roundRect(ctx, -60, -42, 120, 24, 12);
      ctx.fill();
      ctx.strokeStyle = "#A7F3D0";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 11px system-ui, sans-serif";
      ctx.fillText("GOAL TARGET 🎯", 0, -30);
      ctx.restore();

      // 3. Draw Magnetic Force Line & Flux Rays
      if (dist < 450) {
        ctx.save();
        ctx.strokeStyle = "rgba(245, 158, 11, 0.95)";
        ctx.lineWidth = 3.5;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(mag.x, mag.y);
        ctx.lineTo(obj.x, obj.y);
        ctx.stroke();

        // Magnetic Attraction Particles
        ctx.fillStyle = "#FDE047";
        const midX = (mag.x + obj.x) / 2;
        const midY = (mag.y + obj.y) / 2;
        ctx.beginPath();
        ctx.arc(midX, midY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Draw Selected Magnetic Toy Avatar
      const curAvatar = AVATAR_OPTIONS.find(a => a.id === selectedAvatar) || AVATAR_OPTIONS[0];
      if (curAvatar.type === 'ball') {
        drawSteelBall(ctx, obj.x, obj.y, curAvatar.size);
      } else {
        const img = avatarImages[curAvatar.id];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.save();
          ctx.translate(obj.x, obj.y);
          // Drop shadow
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 12;
          ctx.shadowOffsetY = 6;
          const sz = curAvatar.size;
          ctx.drawImage(img, -sz / 2, -sz / 2, sz, sz);
          ctx.restore();
        } else {
          drawSteelBall(ctx, obj.x, obj.y, 20);
        }
      }

      // 5. Draw 3D Underboard Magnet
      draw3DMagnet(ctx, mag.x, mag.y, 115, 34);

      // 6. Check Mission Completion Goal Hit
      if (Math.hypot(obj.x - targetPoint.x, obj.y - targetPoint.y) <= 38) {
        if (!showCelebration) {
          setShowCelebration(true);
          setVisitedCount(prev => Math.min(prev + 1, LANDMARKS.length));

          if (missionIdx < MISSIONS.length - 1) {
            setTimeout(() => {
              setMissionIdx(prev => prev + 1);
              setShowCelebration(false);
            }, 1200);
          } else {
            if (!isSolvedRef.current && onSolveRef.current) {
              isSolvedRef.current = true;
              onSolveRef.current();
            }
          }
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
  }, [missionIdx, selectedAvatar, showCelebration]);

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
      {/* Top Header Controls Row */}
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
        {/* Avatar / Toy Selector Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', pointerEvents: 'auto', background: 'rgba(255,255,255,0.92)', padding: '4px 8px', borderRadius: '22px', border: '1.5px solid #A7F3D0', boxShadow: '0 4px 14px rgba(6, 78, 59, 0.08)' }}>
          {AVATAR_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedAvatar(opt.id)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '16px',
                border: selectedAvatar === opt.id ? 'none' : '1px solid #E2E8F0',
                background: selectedAvatar === opt.id ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : '#FFFFFF',
                color: selectedAvatar === opt.id ? '#FFFFFF' : '#1E293B',
                fontWeight: 900,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: selectedAvatar === opt.id ? '0 2px 8px rgba(217, 119, 6, 0.35)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.2s ease'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Reset Position Button */}
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
          <RotateCcw size={15} color="#D97706" /> Reset to Start
        </button>
      </div>

      {/* Top Left Active Mission Card */}
      <div style={{
        position: 'absolute',
        top: '62px',
        left: '20px',
        zIndex: 30,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1.5px solid #A7F3D0',
        borderRadius: '18px',
        padding: '0.65rem 1rem',
        maxWidth: '360px',
        boxShadow: '0 8px 24px rgba(6, 78, 59, 0.12)',
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
          <Target size={18} color="#D97706" />
          <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#92400E' }}>
            {currentMission.title}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', fontWeight: 700, lineHeight: '1.4' }}>
          {currentMission.desc}
        </p>
      </div>

      {/* Bottom Right Places Visited Progress Tracker */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '20px',
        zIndex: 30,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1.5px solid #A7F3D0',
        borderRadius: '18px',
        padding: '0.65rem 1.15rem',
        boxShadow: '0 8px 24px rgba(6, 78, 59, 0.12)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        pointerEvents: 'none'
      }}>
        <Navigation size={18} color="#047857" />
        <div>
          <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 800 }}>Places Visited</div>
          <div style={{ fontSize: '0.92rem', color: '#064E3B', fontWeight: 900 }}>
            {visitedCount} / {LANDMARKS.length} Landmarks
          </div>
        </div>
      </div>

      {/* Mission Reached Celebration Banner */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 50,
              background: '#FFFFFF',
              border: '2px solid #16A34A',
              borderRadius: '24px',
              padding: '1.25rem 2rem',
              textAlign: 'center',
              boxShadow: '0 15px 40px rgba(22, 163, 74, 0.25)',
              pointerEvents: 'none'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🎉</div>
            <h3 style={{ margin: '0 0 0.2rem 0', color: '#065F46', fontSize: '1.3rem', fontWeight: 900 }}>
              Destination Reached!
            </h3>
            <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', fontWeight: 700 }}>
              Magnetic force guided your vehicle successfully!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Page 3D Town Map Canvas */}
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
