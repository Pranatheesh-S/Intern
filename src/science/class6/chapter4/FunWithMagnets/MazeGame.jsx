import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Compass, MapPin, CheckCircle2, Sparkles, Navigation, Target, Anchor } from 'lucide-react';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// 3D Underboard Controller Magnet
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

// Draw Top-down Ship with attached magnetic core
function drawShipWithMagnet(ctx, x, y, size, rotation, shipImg) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // 1. Attached Magnetic Core Base mounted on the ship deck
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  const magW = size * 0.45;
  const magH = size * 0.16;

  // North (Red) & South (Blue) Mini Magnet attached to ship deck
  ctx.fillStyle = "#EF4444";
  roundRect(ctx, -magW / 2, -magH / 2 + size * 0.05, magW / 2, magH, 3);
  ctx.fill();

  ctx.fillStyle = "#3B82F6";
  roundRect(ctx, 0, -magH / 2 + size * 0.05, magW / 2, magH, 3);
  ctx.fill();

  // 2. Draw Top-down Ship Sprite (Crisp, direct top view, pointing UP)
  if (shipImg && shipImg.complete && shipImg.naturalWidth > 0) {
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 6;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.save();
    ctx.rotate(-Math.PI / 2); // Align sprite bow with motion vector
    ctx.drawImage(shipImg, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  // 3. Magnetic Flux Glow Indicator
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(245, 158, 11, 0.75)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.38, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawSteelBall(ctx, x, y, radius) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.beginPath();
  ctx.ellipse(0, radius * 0.7, radius * 0.8, radius * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

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

  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.beginPath();
  ctx.arc(-radius * 0.35, -radius * 0.35, radius * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 9 Exact Nautical Maritime Map Landmarks
const LANDMARKS = [
  { id: 'lighthouse', name: 'Lighthouse 🏮', x: 175, y: 120, icon: '🏮' },
  { id: 'observatory', name: 'Underwater Observatory 🔮', x: 500, y: 130, icon: '🔮' },
  { id: 'windfarm', name: 'Offshore Wind Farm 💨', x: 825, y: 130, icon: '💨' },
  { id: 'seaport', name: 'Seaport & Container Yard ⚓', x: 165, y: 340, icon: '⚓' },
  { id: 'shipyard', name: 'Shipyard & Dry Dock 🛠️', x: 500, y: 340, icon: '🛠️' },
  { id: 'oil_rig', name: 'Offshore Oil Rig 🛢️', x: 835, y: 340, icon: '🛢️' },
  { id: 'marina', name: 'Marina & Boardwalk ⛵', x: 165, y: 515, icon: '⛵' },
  { id: 'island', name: 'Tropical Island 🌴', x: 500, y: 515, icon: '🌴' },
  { id: 'icerock', name: 'Ice Rock 🧊', x: 835, y: 515, icon: '🧊' }
];

// Sequential Missions Navigating the 3D Map Grid
const MISSIONS = [
  {
    id: 1,
    title: "Mission 1: Lighthouse to Seaport Yard",
    desc: "Use the Joystick or drag the magnet to guide your ship from the Lighthouse 🏮 south to the Seaport & Container Yard ⚓!",
    start: 'lighthouse',
    target: 'seaport'
  },
  {
    id: 2,
    title: "Mission 2: Seaport Yard to Shipyard",
    desc: "Navigate through the middle channel eastward to the Shipyard & Dry Dock 🛠️!",
    start: 'seaport',
    target: 'shipyard'
  },
  {
    id: 3,
    title: "Mission 3: Shipyard to Underwater Observatory",
    desc: "Steer north along the center sea lane to reach the Underwater Observatory Dome 🔮!",
    start: 'shipyard',
    target: 'observatory'
  },
  {
    id: 4,
    title: "Mission 4: Observatory to Offshore Wind Farm",
    desc: "Sail east to explore the clean energy Offshore Wind Farm 💨!",
    start: 'observatory',
    target: 'windfarm'
  },
  {
    id: 5,
    title: "Mission 5: Wind Farm to Offshore Oil Rig",
    desc: "Guide your ship south into the deep-sea Offshore Oil Rig platform 🛢️!",
    start: 'windfarm',
    target: 'oil_rig'
  },
  {
    id: 6,
    title: "Mission 6: Oil Rig to Tropical Island",
    desc: "Navigate across the southern canals to anchor at the lush Tropical Island 🌴!",
    start: 'oil_rig',
    target: 'island'
  },
  {
    id: 7,
    title: "Mission 7: Island to Marina & Boardwalk",
    desc: "Steer westward past the docks to reach the Marina & Boardwalk ⛵!",
    start: 'island',
    target: 'marina'
  },
  {
    id: 8,
    title: "Mission 8: Marina to Glacial Ice Rock",
    desc: "Embark on the final grand expedition across the ocean to reach the mysterious Ice Rock 🧊!",
    start: 'marina',
    target: 'icerock'
  }
];

// Complete 3x3 Sea Lane Grid Tracks (Width: 1000, Height: 563)
const CANAL_TRACKS = [
  // Horizontal Sea Lanes
  { x1: 175, y1: 120, x2: 825, y2: 120 }, // Top Lane
  { x1: 165, y1: 205, x2: 835, y2: 205 }, // Upper Mid Lane
  { x1: 165, y1: 340, x2: 835, y2: 340 }, // Middle Lane
  { x1: 165, y1: 410, x2: 835, y2: 410 }, // Lower Mid Lane
  { x1: 165, y1: 515, x2: 835, y2: 515 }, // Bottom Lane

  // Vertical Sea Lanes
  { x1: 165, y1: 120, x2: 165, y2: 515 }, // Left Col (Lighthouse - Seaport - Marina)
  { x1: 330, y1: 120, x2: 330, y2: 515 }, // Col 1-2 Interconnector
  { x1: 500, y1: 120, x2: 500, y2: 515 }, // Center Col (Observatory - Shipyard - Island)
  { x1: 665, y1: 120, x2: 665, y2: 515 }, // Col 2-3 Interconnector
  { x1: 835, y1: 120, x2: 835, y2: 515 }, // Right Col (Wind Farm - Oil Rig - Ice Rock)

  // Direct spurs into landmark hubs
  { x1: 175, y1: 120, x2: 165, y2: 205 },
  { x1: 500, y1: 130, x2: 500, y2: 205 },
  { x1: 825, y1: 130, x2: 835, y2: 205 },
  { x1: 165, y1: 340, x2: 165, y2: 410 },
  { x1: 500, y1: 340, x2: 500, y2: 410 },
  { x1: 835, y1: 340, x2: 835, y2: 410 }
];

// Project point onto line segment
function projectPointOnSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return { x: x1, y: y1, distSq: (px - x1) * (px - x1) + (py - y1) * (py - y1), t: 0 };

  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  const distSq = (px - projX) * (px - projX) + (py - projY) * (py - projY);
  return { x: projX, y: projY, distSq, t, dx, dy };
}

// Find closest position constrained strictly to sea route canal tracks
function clampToCanalTracks(px, py) {
  let closest = null;
  let minDistSq = Infinity;

  CANAL_TRACKS.forEach(track => {
    const p = projectPointOnSegment(px, py, track.x1, track.y1, track.x2, track.y2);
    if (p.distSq < minDistSq) {
      minDistSq = p.distSq;
      closest = { ...p, track };
    }
  });

  return closest;
}

const AVATAR_OPTIONS = [
  { id: 'ship', label: '🚢 Magnetic Ship', type: 'ship', src: '/FunWithMagnets/topdown_ship.png', size: 52 },
  { id: 'ball', label: '🔮 Steel Ball', type: 'ball', size: 20 },
  { id: 'car', label: '🏎️ Sports Car', type: 'image', src: '/FunWithMagnets/toycar.png', size: 44 }
];

export default function MazeGame({ onSolve, isSolved }) {
  const [missionIdx, setMissionIdx] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState('ship');
  const [visitedCount, setVisitedCount] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0, active: false });

  const canvasRef = useRef(null);
  const onSolveRef = useRef(onSolve);
  const isSolvedRef = useRef(isSolved);
  const handleResetRef = useRef(null);
  const joystickVectorRef = useRef({ x: 0, y: 0 });

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

    // Load new 3D nautical sea map background
    const bgImg = new Image();
    bgImg.src = "/FunWithMagnets/nautical_sea_map.jpg";

    // Load topdown ship and avatar images
    const avatarImages = {};
    AVATAR_OPTIONS.forEach(opt => {
      if (opt.src) {
        const img = new Image();
        img.src = opt.src;
        avatarImages[opt.id] = img;
      }
    });

    let isDragging = false;
    let animFrame = null;

    // Magnet and Avatar Object State
    let mag = { x: startPoint.x + 35, y: startPoint.y + 35 };
    let obj = { x: startPoint.x, y: startPoint.y, vx: 0, vy: 0, r: 22, rotation: 0 };

    handleResetRef.current = () => {
      mag = { x: startPoint.x + 35, y: startPoint.y + 35 };
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

    // Keyboard support (Arrows / WASD)
    const keys = { up: false, down: false, left: false, right: false };
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = true;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = false;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    function step() {
      // 1. Process Joystick & Keyboard inputs to drive controller magnet
      const jv = joystickVectorRef.current;
      let moveMagX = jv.x * 6;
      let moveMagY = jv.y * 6;

      if (keys.up) moveMagY -= 4;
      if (keys.down) moveMagY += 4;
      if (keys.left) moveMagX -= 4;
      if (keys.right) moveMagX += 4;

      if (moveMagX !== 0 || moveMagY !== 0) {
        mag.x = Math.max(30, Math.min(W - 30, mag.x + moveMagX));
        mag.y = Math.max(30, Math.min(H - 30, mag.y + moveMagY));
      }

      // 2. Magnetic Attraction Calculation
      const dx = mag.x - obj.x;
      const dy = mag.y - obj.y;
      const dist = Math.hypot(dx, dy) || 1;

      // Desired velocity towards magnet
      const maxSpeed = 7.5;
      const targetSpeed = Math.min(maxSpeed, dist * 0.18);
      const desiredVx = (dx / dist) * targetSpeed;
      const desiredVy = (dy / dist) * targetSpeed;

      // Next tentative position
      const nextX = obj.x + desiredVx;
      const nextY = obj.y + desiredVy;

      // 3. Strict Sea Route Track Constraint: Snap strictly to canal lines
      const clamped = clampToCanalTracks(nextX, nextY);
      if (clamped) {
        const moveDist = Math.hypot(clamped.x - obj.x, clamped.y - obj.y);
        
        // Update position smoothly along canal
        obj.x = clamped.x;
        obj.y = clamped.y;

        // Smooth rotation following the current canal track heading
        if (moveDist > 0.15) {
          const trackAngle = Math.atan2(clamped.dy, clamped.dx);
          const dot = desiredVx * clamped.dx + desiredVy * clamped.dy;
          const targetHeading = dot >= 0 ? trackAngle : trackAngle + Math.PI;

          let diff = targetHeading - obj.rotation;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          obj.rotation += diff * 0.18;
        }
      }

      // 4. Draw Nautical Sea Map Background
      ctx.clearRect(0, 0, W, H);
      if (bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, 0, 0, W, H);
      } else {
        ctx.fillStyle = "#0A2440";
        ctx.fillRect(0, 0, W, H);
      }

      // 5. Draw Glowing Sea Route Canals Guide
      ctx.save();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.22)";
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      CANAL_TRACKS.forEach(t => {
        ctx.moveTo(t.x1, t.y1);
        ctx.lineTo(t.x2, t.y2);
      });
      ctx.stroke();
      ctx.restore();

      // 6. Draw Target Destination Beacon
      ctx.save();
      ctx.translate(targetPoint.x, targetPoint.y);

      // Beacon Aura
      const targetGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, 42);
      targetGlow.addColorStop(0, "rgba(245, 158, 11, 0.9)");
      targetGlow.addColorStop(0.5, "rgba(239, 68, 68, 0.5)");
      targetGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = targetGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 42, 0, Math.PI * 2);
      ctx.fill();

      // Beacon Disc
      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = "18px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(targetPoint.icon, 0, 1);

      // Target Label Pill
      ctx.fillStyle = "#064E3B";
      roundRect(ctx, -55, -38, 110, 22, 11);
      ctx.fill();
      ctx.strokeStyle = "#A7F3D0";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 10px system-ui, sans-serif";
      ctx.fillText("DESTINATION 🎯", 0, -27);
      ctx.restore();

      // 7. Draw Magnetic Flux Line connecting Controller Magnet to Ship
      if (dist < 400) {
        ctx.save();
        ctx.strokeStyle = "rgba(245, 158, 11, 0.95)";
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(mag.x, mag.y);
        ctx.lineTo(obj.x, obj.y);
        ctx.stroke();

        // Magnetic Attraction Particles
        ctx.fillStyle = "#FDE047";
        const midX = (mag.x + obj.x) / 2;
        const midY = (mag.y + obj.y) / 2;
        ctx.beginPath();
        ctx.arc(midX, midY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 8. Draw Selected Avatar (Top-down Ship with attached Magnet)
      const curAvatar = AVATAR_OPTIONS.find(a => a.id === selectedAvatar) || AVATAR_OPTIONS[0];
      if (curAvatar.id === 'ship') {
        const shipImg = avatarImages['ship'];
        drawShipWithMagnet(ctx, obj.x, obj.y, curAvatar.size, obj.rotation, shipImg);
      } else if (curAvatar.type === 'ball') {
        drawSteelBall(ctx, obj.x, obj.y, curAvatar.size);
      } else {
        const img = avatarImages[curAvatar.id];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.save();
          ctx.translate(obj.x, obj.y);
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetY = 5;
          const sz = curAvatar.size;
          ctx.drawImage(img, -sz / 2, -sz / 2, sz, sz);
          ctx.restore();
        } else {
          drawSteelBall(ctx, obj.x, obj.y, 20);
        }
      }

      // 9. Draw Controller Magnet underneath
      draw3DMagnet(ctx, mag.x, mag.y, 110, 32);

      // 10. Destination Goal Reached Check
      if (Math.hypot(obj.x - targetPoint.x, obj.y - targetPoint.y) <= 36) {
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
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [missionIdx, selectedAvatar, showCelebration]);

  // Virtual Joystick Handlers
  const handleJoystickMove = (e) => {
    const container = e.currentTarget.getBoundingClientRect();
    const centerX = container.left + container.width / 2;
    const centerY = container.top + container.height / 2;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const maxRadius = container.width / 2 - 18;
    const dist = Math.hypot(dx, dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    const normX = dx / maxRadius;
    const normY = dy / maxRadius;

    setJoystickPos({ x: dx, y: dy, active: true });
    joystickVectorRef.current = { x: normX, y: normY };
  };

  const handleJoystickEnd = () => {
    setJoystickPos({ x: 0, y: 0, active: false });
    joystickVectorRef.current = { x: 0, y: 0 };
  };

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
        {/* Avatar / Toy Selector */}
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

      {/* Bottom Left Virtual Joystick */}
      <div style={{
        position: 'absolute',
        bottom: '18px',
        left: '20px',
        zIndex: 40,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1.5px solid rgba(56, 189, 248, 0.4)',
        borderRadius: '24px',
        padding: '10px 14px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span style={{ fontSize: '0.72rem', color: '#7DD3FC', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
          🕹️ Magnet Joystick
        </span>
        <div
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); handleJoystickMove(e); }}
          onPointerMove={(e) => { if (joystickPos.active) handleJoystickMove(e); }}
          onPointerUp={handleJoystickEnd}
          onPointerCancel={handleJoystickEnd}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #1E293B 0%, #0F172A 100%)',
            border: '2px solid rgba(56, 189, 248, 0.5)',
            boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: 'grab',
            touchAction: 'none'
          }}
        >
          {/* Compass Rings */}
          <div style={{ position: 'absolute', inset: '10px', borderRadius: '50%', border: '1px dashed rgba(56, 189, 248, 0.25)', pointerEvents: 'none' }} />
          
          {/* Moving Knob */}
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: joystickPos.active ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
            border: '2px solid #FFFFFF',
            boxShadow: joystickPos.active ? '0 0 16px rgba(245, 158, 11, 0.8)' : '0 4px 12px rgba(0, 0, 0, 0.4)',
            transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
            transition: joystickPos.active ? 'none' : 'transform 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 900
          }}>
            🧲
          </div>
        </div>
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
            <h3 style={{ margin: '0 0 0.2rem 0', color: '#064E3B', fontSize: '1.3rem', fontWeight: 900 }}>
              Destination Reached!
            </h3>
            <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', fontWeight: 700 }}>
              Magnetic force successfully guided your ship along the sea route!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Page 3D Sea Route Maze Canvas */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={563}
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
