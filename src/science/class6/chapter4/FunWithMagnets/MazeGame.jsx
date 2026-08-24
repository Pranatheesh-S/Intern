import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target } from 'lucide-react';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// -------------------------------------------------------------------
// Draw High-Detail Top-Down Sports Bike
// -------------------------------------------------------------------
function drawBike(ctx, x, y, size, rotation, bodyColor = '#DC2626') {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation + Math.PI / 2); // Orient forward along travel vector

  const w = size * 0.44;
  const h = size;

  // 1. Soft Dynamic Ground Shadow
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.beginPath();
  ctx.ellipse(0, 4, w * 0.62, h * 0.48, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Heavy Rubber Tires with Rims
  // Rear Tire
  ctx.fillStyle = "#18181B";
  roundRect(ctx, -w * 0.2, h * 0.18, w * 0.4, h * 0.32, 4);
  ctx.fill();
  ctx.fillStyle = "#52525B";
  ctx.fillRect(-w * 0.08, h * 0.22, w * 0.16, h * 0.24);

  // Front Tire
  ctx.fillStyle = "#18181B";
  roundRect(ctx, -w * 0.16, -h * 0.48, w * 0.32, h * 0.3, 4);
  ctx.fill();
  ctx.fillStyle = "#52525B";
  ctx.fillRect(-w * 0.06, -h * 0.44, w * 0.12, h * 0.22);

  // 3. Dual Exhaust Pipes
  ctx.fillStyle = "#3F3F46";
  ctx.fillRect(w * 0.2, h * 0.05, w * 0.12, h * 0.28);
  ctx.fillStyle = "#E4E4E7";
  ctx.fillRect(w * 0.22, h * 0.28, w * 0.08, h * 0.08);

  // 4. Main Aerodynamic Bike Body
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;

  const gBody = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  gBody.addColorStop(0, "#DC2626");
  gBody.addColorStop(0.5, "#EF4444");
  gBody.addColorStop(1, "#991B1B");
  ctx.fillStyle = gBody;

  ctx.beginPath();
  ctx.moveTo(0, -h * 0.45); // Front Nose
  ctx.lineTo(w * 0.38, -h * 0.2); // Right Shoulder
  ctx.lineTo(w * 0.26, h * 0.12);  // Right Flank
  ctx.lineTo(w * 0.18, h * 0.42);  // Rear Tail Right
  ctx.lineTo(0, h * 0.46);         // Rear Tail Tip
  ctx.lineTo(-w * 0.18, h * 0.42); // Rear Tail Left
  ctx.lineTo(-w * 0.26, h * 0.12); // Left Flank
  ctx.lineTo(-w * 0.38, -h * 0.2); // Left Shoulder
  ctx.closePath();
  ctx.fill();

  // White Racing Decal Stripes
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.36);
  ctx.lineTo(w * 0.12, -h * 0.12);
  ctx.lineTo(-w * 0.12, -h * 0.12);
  ctx.closePath();
  ctx.fill();

  // Contoured Fuel Tank
  const gTank = ctx.createLinearGradient(0, -h * 0.15, 0, h * 0.08);
  gTank.addColorStop(0, "#18181B");
  gTank.addColorStop(0.5, bodyColor);
  gTank.addColorStop(1, "#09090B");
  ctx.fillStyle = gTank;
  roundRect(ctx, -w * 0.2, -h * 0.16, w * 0.4, h * 0.24, 6);
  ctx.fill();

  // Black Leather Racing Seat
  ctx.fillStyle = "#09090B";
  roundRect(ctx, -w * 0.16, h * 0.08, w * 0.32, h * 0.26, 5);
  ctx.fill();

  ctx.restore();

  // 5. Handlebars & Grips
  ctx.fillStyle = "#18181B";
  ctx.fillRect(-w * 0.44, -h * 0.26, w * 0.88, h * 0.06);
  ctx.fillStyle = "#F59E0B";
  ctx.fillRect(-w * 0.46, -h * 0.28, w * 0.12, h * 0.09);
  ctx.fillRect(w * 0.34, -h * 0.28, w * 0.12, h * 0.09);

  // Chrome Mirrors
  ctx.fillStyle = "#E2E8F0";
  ctx.fillRect(-w * 0.48, -h * 0.34, w * 0.08, h * 0.07);
  ctx.fillRect(w * 0.4, -h * 0.34, w * 0.08, h * 0.07);

  // 6. Rider's Racing Helmet
  const helmetR = size * 0.13;
  const gHelmet = ctx.createRadialGradient(-helmetR * 0.3, -h * 0.04, 2, 0, -h * 0.02, helmetR);
  gHelmet.addColorStop(0, "#FDE047");
  gHelmet.addColorStop(0.4, "#F59E0B");
  gHelmet.addColorStop(0.8, "#B45309");
  gHelmet.addColorStop(1, "#0F172A");

  ctx.fillStyle = gHelmet;
  ctx.beginPath();
  ctx.arc(0, -h * 0.02, helmetR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Helmet Visor
  ctx.fillStyle = "#0F172A";
  ctx.beginPath();
  ctx.arc(0, -h * 0.02, helmetR * 0.85, -Math.PI * 0.85, -Math.PI * 0.15);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#0F172A";
  ctx.stroke();

  // 7. Bright Forward LED Headlight Beam Cone
  ctx.save();
  const beamGlow = ctx.createRadialGradient(0, -h * 0.48, 2, 0, -h * 0.8, size * 0.65);
  beamGlow.addColorStop(0, "rgba(254, 240, 138, 0.85)");
  beamGlow.addColorStop(0.4, "rgba(250, 204, 21, 0.3)");
  beamGlow.addColorStop(1, "rgba(250, 204, 21, 0)");
  ctx.fillStyle = beamGlow;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.45);
  ctx.lineTo(-size * 0.35, -h * 1.1);
  ctx.lineTo(size * 0.35, -h * 1.1);
  ctx.closePath();
  ctx.fill();

  // Red LED Brake Taillight
  ctx.fillStyle = "#EF4444";
  ctx.shadowColor = "#EF4444";
  ctx.shadowBlur = 8;
  ctx.fillRect(-w * 0.08, h * 0.44, w * 0.16, h * 0.04);
  ctx.restore();

  ctx.restore();
}

// -------------------------------------------------------------------
// Draw Guiding Horseshoe Magnet
// -------------------------------------------------------------------
function drawMagnet(ctx, x, y, size, rotation, now) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation + Math.PI / 2); // Orient forward along travel vector

  const w = size * 0.76;
  const h = size * 0.85;

  // 1. Magnetic Field Ambient Aura Glow
  const pulse = 1 + 0.14 * Math.sin(now * 0.008);
  const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, size * 0.85 * pulse);
  glow.addColorStop(0, "rgba(56, 189, 248, 0.45)");
  glow.addColorStop(0.5, "rgba(14, 165, 233, 0.18)");
  glow.addColorStop(1, "rgba(14, 165, 233, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.85 * pulse, 0, Math.PI * 2);
  ctx.fill();

  // 2. Soft Dynamic Ground Shadow
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
  ctx.beginPath();
  ctx.ellipse(0, 5, w * 0.55, h * 0.36, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Realistic U-Shaped Horseshoe Magnet
  const thickness = w * 0.28;
  const armHeight = h * 0.65;
  const archRadius = w * 0.48;

  // North Arm (Red / Left)
  const gNorth = ctx.createLinearGradient(-w / 2, 0, -w / 2 + thickness, 0);
  gNorth.addColorStop(0, "#EF4444");
  gNorth.addColorStop(0.5, "#F87171");
  gNorth.addColorStop(1, "#DC2626");

  // South Arm (Blue / Right)
  const gSouth = ctx.createLinearGradient(w / 2 - thickness, 0, w / 2, 0);
  gSouth.addColorStop(0, "#2563EB");
  gSouth.addColorStop(0.5, "#60A5FA");
  gSouth.addColorStop(1, "#1D4ED8");

  // Draw North Arm
  ctx.beginPath();
  roundRect(ctx, -w / 2, -h * 0.25, thickness, armHeight, 3);
  ctx.fillStyle = gNorth;
  ctx.fill();

  // Draw South Arm
  ctx.beginPath();
  roundRect(ctx, w / 2 - thickness, -h * 0.25, thickness, armHeight, 3);
  ctx.fillStyle = gSouth;
  ctx.fill();

  // Top Curved Arch (Curved Bridge connecting N and S)
  const gArch = ctx.createLinearGradient(-w / 2, -h * 0.25, w / 2, -h * 0.25);
  gArch.addColorStop(0, "#DC2626");
  gArch.addColorStop(0.48, "#475569");
  gArch.addColorStop(0.52, "#475569");
  gArch.addColorStop(1, "#1D4ED8");

  ctx.beginPath();
  ctx.arc(0, -h * 0.25, archRadius, Math.PI, 0, false);
  ctx.arc(0, -h * 0.25, archRadius - thickness, 0, Math.PI, true);
  ctx.closePath();
  ctx.fillStyle = gArch;
  ctx.fill();

  // Silver / Chrome Pole Tips (Poles)
  ctx.fillStyle = "#F1F5F9";
  ctx.strokeStyle = "#94A3B8";
  ctx.lineWidth = 1;
  // Left Pole Tip (North)
  roundRect(ctx, -w / 2, armHeight - h * 0.25 - 6, thickness, 7, 2);
  ctx.fill();
  ctx.stroke();
  // Right Pole Tip (South)
  roundRect(ctx, w / 2 - thickness, armHeight - h * 0.25 - 6, thickness, 7, 2);
  ctx.fill();
  ctx.stroke();

  // Pole Labels ('N' and 'S')
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 9px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("N", -w / 2 + thickness / 2, -h * 0.02);
  ctx.fillText("S", w / 2 - thickness / 2, -h * 0.02);

  ctx.restore();
}

// -------------------------------------------------------------------
// Draw Animated Magnetic Force Tether / Field Line
// -------------------------------------------------------------------
function drawMagneticTether(ctx, magnetX, magnetY, bikeX, bikeY, now) {
  const dist = Math.hypot(magnetX - bikeX, magnetY - bikeY);
  if (dist < 4) return;

  ctx.save();

  // 1. Broad soft atmospheric magnetic aura
  ctx.beginPath();
  ctx.moveTo(magnetX, magnetY);
  ctx.lineTo(bikeX, bikeY);
  ctx.strokeStyle = "rgba(56, 189, 248, 0.22)";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.stroke();

  // 2. Glowing core magnetic beam
  const pulse = 0.75 + 0.25 * Math.sin(now * 0.01);
  ctx.beginPath();
  ctx.moveTo(magnetX, magnetY);
  ctx.lineTo(bikeX, bikeY);
  ctx.strokeStyle = `rgba(14, 165, 233, ${0.85 * pulse})`;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.stroke();

  // 3. Dynamic traveling flux energy dashes (Magnet -> Bike)
  ctx.beginPath();
  ctx.moveTo(magnetX, magnetY);
  ctx.lineTo(bikeX, bikeY);
  ctx.setLineDash([7, 7]);
  ctx.lineDashOffset = -now * 0.045;
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 4. Flux Particle Energy Sparks
  const numParticles = 3;
  for (let i = 1; i <= numParticles; i++) {
    const pT = ((now * 0.0018 + i / numParticles) % 1);
    const px = magnetX + (bikeX - magnetX) * pT;
    const py = magnetY + (bikeY - magnetY) * pT;
    const pRadius = 2.2 + Math.sin(pT * Math.PI) * 1.8;

    ctx.beginPath();
    ctx.arc(px, py, pRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(186, 230, 253, ${0.95 * Math.sin(pT * Math.PI)})`;
    ctx.fill();
  }

  ctx.restore();
}

// -------------------------------------------------------------------
// 1. Waypoint Node Coordinate System (Town Grid Map)
// -------------------------------------------------------------------
export const WAYPOINT_NODES = [
  // 1. START POINT (Left Top Circle)
  { 
    id: 'node_start', 
    name: 'Start: West Station 🚂', 
    x: 65, 
    y: 195, 
    icon: '🚀', 
    neighbors: ['node_hospital_top'] 
  },

  // 2. Hospital North Junction
  { 
    id: 'node_hospital_top', 
    name: 'Hospital North 🏥', 
    x: 275, 
    y: 195, 
    icon: '🏥', 
    neighbors: ['node_start', 'node_park_west'] 
  },

  // 3. Park Corner West Junction (Turn to go South)
  { 
    id: 'node_park_west', 
    name: 'Park West Corner 🌲', 
    x: 360, 
    y: 195, 
    icon: '🌲', 
    neighbors: ['node_hospital_top', 'node_market_top_left'] 
  },

  // 4. Market North-West Junction
  { 
    id: 'node_market_top_left', 
    name: 'Market North-West 🎪', 
    x: 360, 
    y: 365, 
    icon: '🎪', 
    neighbors: ['node_park_west', 'node_market_top_mid', 'node_school_south'] 
  },

  // 5. Market Top Center Street
  { 
    id: 'node_market_top_mid', 
    name: 'Market Top Street 🛒', 
    x: 450, 
    y: 365, 
    icon: '🛒', 
    neighbors: ['node_market_top_left', 'node_market_top_right'] 
  },

  // 6. Market North-East Junction
  { 
    id: 'node_market_top_right', 
    name: 'Market North-East 🛍️', 
    x: 690, 
    y: 365, 
    icon: '🛍️', 
    neighbors: ['node_market_top_mid', 'node_court_north_lane'] 
  },

  // 7. Court North Lane (Going South towards Destination)
  { 
    id: 'node_court_north_lane', 
    name: 'Court North Lane 🏢', 
    x: 690, 
    y: 440, 
    icon: '🏢', 
    neighbors: ['node_market_top_right', 'node_court_south_junction'] 
  },

  // 8. School South Ave (Alternative South Route)
  { 
    id: 'node_school_south', 
    name: 'School South Ave 🎒', 
    x: 360, 
    y: 535, 
    icon: '🎒', 
    neighbors: ['node_market_top_left', 'node_market_south_mid'] 
  },

  // 9. Market South Center Street
  { 
    id: 'node_market_south_mid', 
    name: 'Market South Street 🏪', 
    x: 530, 
    y: 535, 
    icon: '🏪', 
    neighbors: ['node_school_south', 'node_court_south_junction'] 
  },

  // 10. Court South Road Crossing
  { 
    id: 'node_court_south_junction', 
    name: 'Court South Crossing 🏛️', 
    x: 690, 
    y: 535, 
    icon: '🏛️', 
    neighbors: ['node_court_north_lane', 'node_market_south_mid', 'node_destination'] 
  },

  // 11. FINAL DESTINATION (Bottom Right Circle)
  { 
    id: 'node_destination', 
    name: 'Target: Heritage Court 🎯', 
    x: 885, 
    y: 535, 
    icon: '🎯', 
    neighbors: ['node_court_south_junction'] 
  }
];

const NODES_MAP = Object.fromEntries(WAYPOINT_NODES.map(n => [n.id, n]));

// BFS Pathfinding strictly along connected road graph
function findShortestPath(startId, targetId) {
  if (startId === targetId) return [startId];
  const queue = [[startId]];
  const visited = new Set([startId]);

  while (queue.length > 0) {
    const path = queue.shift();
    const currentId = path[path.length - 1];
    const node = NODES_MAP[currentId];
    if (!node) continue;

    for (const neighborId of node.neighbors) {
      if (neighborId === targetId) {
        return [...path, neighborId];
      }
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push([...path, neighborId]);
      }
    }
  }
  return null;
}

// Single Mission from Start to Final Destination
export const MISSIONS = [
  {
    id: 1,
    title: "City Expedition: West Station to Heritage Court",
    desc: "Drive your sports bike through the designated road street junctions to reach the final destination at Heritage Court 🏛️!",
    start: 'node_start',
    target: 'node_destination'
  }
];

export default function MazeGame({ onSolve, isSolved, onVisitedCountChange, registerReset, registerDirectionMove }) {
  const [missionIdx, setMissionIdx] = useState(0);
  const [visitedCount, setVisitedCount] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showMissionPopup, setShowMissionPopup] = useState(false);

  const canvasRef = useRef(null);
  const onSolveRef = useRef(onSolve);
  const isSolvedRef = useRef(isSolved);
  const handleResetRef = useRef(null);
  const handleDirectionMoveRef = useRef(null);

  useEffect(() => {
    onSolveRef.current = onSolve;
    isSolvedRef.current = isSolved;
  }, [onSolve, isSolved]);

  useEffect(() => {
    if (onVisitedCountChange) onVisitedCountChange(visitedCount, WAYPOINT_NODES.length);
  }, [visitedCount, onVisitedCountChange]);

  useEffect(() => {
    if (registerReset) {
      registerReset(() => {
        if (handleResetRef.current) handleResetRef.current();
      });
    }
  }, [registerReset]);

  useEffect(() => {
    if (registerDirectionMove) {
      registerDirectionMove((dir) => {
        if (handleDirectionMoveRef.current) handleDirectionMoveRef.current(dir);
      });
    }
  }, [registerDirectionMove]);

  const currentMission = MISSIONS[missionIdx] || MISSIONS[0];
  const startPoint = NODES_MAP[currentMission.start] || WAYPOINT_NODES[0];
  const targetPoint = NODES_MAP[currentMission.target] || WAYPOINT_NODES[1];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.width;
    const H = canvas.height;
    const ctx = canvas.getContext("2d");

    // Load 4K town grid map background
    const bgImg = new Image();
    bgImg.src = "/FunWithMagnets/town_map_4k.jpg";

    let animFrame = null;
    let hoveredNodeId = null;

    // Movement & Animation State
    let currentNodeId = currentMission.start;
    let pathQueue = []; // Sequence of next nodes along the road
    let isMoving = false;
    let moveStartTime = 0;
    const MOVE_DURATION = 380; // ms per road segment

    let animFrom = { x: startPoint.x, y: startPoint.y };
    let animTo = { x: startPoint.x, y: startPoint.y };

    let bike = {
      x: startPoint.x,
      y: startPoint.y,
      rotation: 0
    };

    let magnet = {
      x: startPoint.x + 72,
      y: startPoint.y,
      rotation: 0
    };

    handleResetRef.current = () => {
      currentNodeId = currentMission.start;
      pathQueue = [];
      isMoving = false;
      const startNode = NODES_MAP[currentMission.start] || WAYPOINT_NODES[0];
      bike.x = startNode.x;
      bike.y = startNode.y;
      bike.rotation = 0;
      magnet.x = startNode.x + 72;
      magnet.y = startNode.y;
      magnet.rotation = 0;
      animFrom = { x: startNode.x, y: startNode.y };
      animTo = { x: startNode.x, y: startNode.y };
    };

    // Helper: start travel along the next paved road segment
    const startNextSegment = () => {
      if (pathQueue.length === 0) {
        isMoving = false;
        return;
      }
      const nextId = pathQueue.shift();
      const nextNode = NODES_MAP[nextId];
      if (!nextNode) {
        isMoving = false;
        return;
      }

      const cur = NODES_MAP[currentNodeId] || { x: bike.x, y: bike.y };
      animFrom = { x: cur.x, y: cur.y };
      animTo = { x: nextNode.x, y: nextNode.y };
      currentNodeId = nextId;
      isMoving = true;
      moveStartTime = performance.now();

      // Dynamic rotation strictly facing the road vector
      const dx = nextNode.x - animFrom.x;
      const dy = nextNode.y - animFrom.y;
      if (dx !== 0 || dy !== 0) {
        const moveAngle = Math.atan2(dy, dx);
        bike.rotation = moveAngle;
        magnet.rotation = moveAngle;
      }
    };

    // Move to a specific target node via BFS shortest road path
    const navigateToNode = (targetId) => {
      if (targetId === currentNodeId && !isMoving) return;
      const path = findShortestPath(currentNodeId, targetId);
      if (path && path.length > 1) {
        pathQueue = path.slice(1);
        if (!isMoving) {
          startNextSegment();
        }
      }
    };

    // Directional control movement (North, South, East, West)
    const moveInDirection = (dir) => {
      const cur = NODES_MAP[currentNodeId];
      if (!cur) return;

      let targetDx = 0;
      let targetDy = 0;

      if (dir === 'up' || dir === 'north' || dir === 'N') { targetDx = 0; targetDy = -1; }
      else if (dir === 'down' || dir === 'south' || dir === 'S') { targetDx = 0; targetDy = 1; }
      else if (dir === 'left' || dir === 'west' || dir === 'W') { targetDx = -1; targetDy = 0; }
      else if (dir === 'right' || dir === 'east' || dir === 'E') { targetDx = 1; targetDy = 0; }

      let bestNeighbor = null;
      let bestScore = -Infinity;

      cur.neighbors.forEach((nId) => {
        const neighbor = NODES_MAP[nId];
        if (!neighbor) return;
        const dx = neighbor.x - cur.x;
        const dy = neighbor.y - cur.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) return;

        const score = (dx / dist) * targetDx + (dy / dist) * targetDy;
        if (score > bestScore) {
          bestScore = score;
          bestNeighbor = nId;
        }
      });

      if (bestNeighbor && bestScore > 0.05) {
        if (!isMoving) {
          pathQueue = [bestNeighbor];
          startNextSegment();
        } else {
          pathQueue.push(bestNeighbor);
        }
      }
    };

    handleDirectionMoveRef.current = moveInDirection;

    // Keyboard support (Arrows / WASD)
    const handleKeyDown = (e) => {
      if (showMissionPopup) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        moveInDirection('up');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        moveInDirection('down');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        moveInDirection('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        moveInDirection('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    function step() {
      const now = performance.now();

      // 1. Smooth Interpolation along Paved Road Line (Magnet Leads, Bike Follows)
      if (isMoving) {
        const elapsed = now - moveStartTime;
        const rawT = Math.min(1, elapsed / MOVE_DURATION);

        const dx = animTo.x - animFrom.x;
        const dy = animTo.y - animFrom.y;
        const moveAngle = Math.atan2(dy, dx);
        const segmentDist = Math.hypot(dx, dy);

        // Magnet leads forward first along the road segment with increased gap
        const tMagnet = Math.min(1, rawT * 1.25);
        const smoothTMagnet = tMagnet * tMagnet * (3 - 2 * tMagnet);
        const leadDist = Math.min(72, segmentDist * 0.55);

        magnet.x = animFrom.x + dx * smoothTMagnet + Math.cos(moveAngle) * leadDist * (1 - smoothTMagnet * 0.3);
        magnet.y = animFrom.y + dy * smoothTMagnet + Math.sin(moveAngle) * leadDist * (1 - smoothTMagnet * 0.3);
        magnet.rotation = moveAngle;

        // Bike follows smoothly behind the magnet along the magnetic tether
        const tBike = Math.max(0, (rawT - 0.1) / 0.9);
        const smoothTBike = tBike * tBike * (3 - 2 * tBike);

        bike.x = animFrom.x + dx * smoothTBike;
        bike.y = animFrom.y + dy * smoothTBike;
        bike.rotation = moveAngle;

        if (rawT >= 1) {
          bike.x = animTo.x;
          bike.y = animTo.y;
          magnet.x = animTo.x + Math.cos(moveAngle) * 72;
          magnet.y = animTo.y + Math.sin(moveAngle) * 72;
          magnet.rotation = moveAngle;

          // Check if destination reached
          if (currentNodeId === targetPoint.id) {
            pathQueue = [];
            isMoving = false;
            if (!showCelebration) {
              setShowCelebration(true);
              setVisitedCount(prev => Math.min(prev + 1, WAYPOINT_NODES.length));

              if (missionIdx < MISSIONS.length - 1) {
                setTimeout(() => {
                  setMissionIdx(prev => prev + 1);
                  setShowCelebration(false);
                  setShowMissionPopup(true);
                }, 1200);
              } else {
                if (!isSolvedRef.current && onSolveRef.current) {
                  isSolvedRef.current = true;
                  onSolveRef.current();
                }
              }
            }
          } else {
            startNextSegment();
          }
        }
      } else {
        // Stationary: Magnet hovers ahead of the bike with generous 72px gap & subtle magnetic floating
        const hoverOffset = 72;
        const floatWobbleX = Math.cos(now * 0.005) * 2;
        const floatWobbleY = Math.sin(now * 0.005) * 2;
        magnet.x = bike.x + Math.cos(bike.rotation) * hoverOffset + floatWobbleX;
        magnet.y = bike.y + Math.sin(bike.rotation) * hoverOffset + floatWobbleY;
        magnet.rotation = bike.rotation;
      }

      // 2. Draw Background Map
      ctx.clearRect(0, 0, W, H);
      if (bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, 0, 0, W, H);
      } else {
        ctx.fillStyle = "#0A2440";
        ctx.fillRect(0, 0, W, H);
      }

      // 3. Draw Interactive Road Waypoint Nodes
      const cur = NODES_MAP[currentNodeId];
      WAYPOINT_NODES.forEach((node) => {
        const isConnected = cur && cur.neighbors.includes(node.id);

        ctx.save();
        ctx.translate(node.x, node.y);

        if (isConnected) {
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI * 2);
        ctx.fillStyle = isConnected ? "#0284C7" : "rgba(14, 165, 233, 0.8)";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();

        ctx.restore();
      });

      // 4. Draw Target Destination Beacon
      ctx.save();
      ctx.translate(targetPoint.x, targetPoint.y);

      const pulseScale = 1 + 0.15 * Math.sin(now * 0.005);
      const targetGlow = ctx.createRadialGradient(0, 0, 4, 0, 0, 36 * pulseScale);
      targetGlow.addColorStop(0, "rgba(245, 158, 11, 0.95)");
      targetGlow.addColorStop(0.5, "rgba(239, 68, 68, 0.5)");
      targetGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = targetGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 36 * pulseScale, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = "16px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(targetPoint.icon, 0, 1);

      ctx.fillStyle = "#064E3B";
      roundRect(ctx, -55, -36, 110, 20, 10);
      ctx.fill();
      ctx.strokeStyle = "#A7F3D0";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 9px system-ui, sans-serif";
      ctx.fillText("DESTINATION 🎯", 0, -26);
      ctx.restore();

      // 5. Draw Animated Magnetic Force Line / Tether
      drawMagneticTether(ctx, magnet.x, magnet.y, bike.x, bike.y, now);

      // 6. Draw Sports Bike on Road
      drawBike(ctx, bike.x, bike.y, 48, bike.rotation, '#DC2626');

      // 7. Draw Leading Guiding Horseshoe Magnet
      drawMagnet(ctx, magnet.x, magnet.y, 34, magnet.rotation, now);

      animFrame = requestAnimationFrame(step);
    }

    step();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [missionIdx, showCelebration, showMissionPopup]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      boxSizing: 'border-box',
      position: 'relative'
    }}>

      {/* Mission Briefing Center Pop-up */}
      <AnimatePresence>
        {showMissionPopup && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                maxWidth: '440px',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
                border: '3px solid #F59E0B'
              }}
            >
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
              }}>
                <Target size={36} color="#D97706" />
              </div>
              
              <h2 style={{ margin: '0 0 1rem 0', color: '#92400E', fontSize: '1.6rem', fontWeight: 900 }}>
                {currentMission.title}
              </h2>
              
              <p style={{ margin: '0 0 1.75rem 0', color: '#334155', fontSize: '1.1rem', lineHeight: 1.5, fontWeight: 600 }}>
                {currentMission.desc}
              </p>

              <button
                onClick={() => setShowMissionPopup(false)}
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#FFFFFF',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(217, 119, 6, 0.4)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Start Mission
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              Great navigation! Your bike successfully reached the destination!
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
          objectFit: 'fill',
          touchAction: 'none',
          borderRadius: '20px',
          border: '2.5px solid #A7F3D0',
          boxShadow: '0 12px 35px rgba(6, 78, 59, 0.12)',
          display: 'block'
        }}
      />
    </div>
  );
}
