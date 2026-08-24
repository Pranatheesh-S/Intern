import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Target } from 'lucide-react';

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
  ctx.rotate(rotation + Math.PI / 2); // Orient forward along travel direction

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

  // 3. Dual Exhaust Pipes (Gunmetal & Chrome)
  ctx.fillStyle = "#3F3F46";
  ctx.fillRect(w * 0.2, h * 0.05, w * 0.12, h * 0.28);
  ctx.fillStyle = "#E4E4E7";
  ctx.fillRect(w * 0.22, h * 0.28, w * 0.08, h * 0.08);

  // 4. Main Aerodynamic Bike Body / Fairing
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;

  // Body Gradient
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

  // Helmet Tinted Visor
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
// 1. Waypoint Node Coordinate System & Adjacency Graph (1000 x 563)
// -------------------------------------------------------------------
export const WAYPOINT_NODES = [
  { id: 'lighthouse', name: 'Lighthouse 🏮', x: 160, y: 165, icon: '🏮', neighbors: ['coast_guard', 'observatory', 'seaport'] },
  { id: 'coast_guard', name: 'Coast Guard Station 🚤', x: 275, y: 95, icon: '🚤', neighbors: ['lighthouse', 'observatory_top'] },
  { id: 'observatory_top', name: 'North Sea Channel 🌊', x: 472, y: 96, icon: '🌊', neighbors: ['coast_guard', 'windfarm_top', 'observatory'] },
  { id: 'windfarm_top', name: 'Wind Turbine Point 💨', x: 800, y: 92, icon: '💨', neighbors: ['observatory_top', 'shipyard'] },
  { id: 'observatory', name: 'Underwater Observatory 🔮', x: 438, y: 178, icon: '🔮', neighbors: ['observatory_top', 'lighthouse', 'shipyard', 'sanctuary'] },
  { id: 'shipyard', name: 'Shipyard & Dry Dock 🛠️', x: 622, y: 185, icon: '🛠️', neighbors: ['windfarm_top', 'observatory', 'windfarm', 'oil_rig'] },
  { id: 'windfarm', name: 'Offshore Wind Farm 💨', x: 952, y: 180, icon: '💨', neighbors: ['shipyard', 'aquarium'] },
  { id: 'seaport', name: 'Seaport & Container Yard ⚓', x: 118, y: 282, icon: '⚓', neighbors: ['lighthouse', 'sanctuary'] },
  { id: 'sanctuary', name: 'Bird Sanctuary 🦜', x: 256, y: 276, icon: '🦜', neighbors: ['seaport', 'observatory', 'oil_rig', 'marina'] },
  { id: 'oil_rig', name: 'Offshore Oil Rig 🛢️', x: 586, y: 282, icon: '🛢️', neighbors: ['sanctuary', 'shipyard', 'aquarium', 'aquarium_bottom', 'island'] },
  { id: 'aquarium', name: 'Ocean Aquarium Research 🐬', x: 792, y: 280, icon: '🐬', neighbors: ['oil_rig', 'windfarm', 'aquarium_right', 'icerock'] },
  { id: 'aquarium_right', name: 'East Pier 🚢', x: 932, y: 276, icon: '🚢', neighbors: ['aquarium'] },
  { id: 'marina', name: 'Marina & Boardwalk ⛵', x: 236, y: 468, icon: '⛵', neighbors: ['sanctuary', 'aquarium_bottom'] },
  { id: 'aquarium_bottom', name: 'South Channel Hub 🌊', x: 450, y: 468, icon: '🌊', neighbors: ['marina', 'oil_rig', 'island'] },
  { id: 'island', name: 'Tropical Island 🌴', x: 624, y: 375, icon: '🌴', neighbors: ['oil_rig', 'aquarium_bottom', 'icerock'] },
  { id: 'icerock', name: 'Polar Ice Rock 🧊', x: 796, y: 468, icon: '🧊', neighbors: ['island', 'aquarium'] }
];

const NODES_MAP = Object.fromEntries(WAYPOINT_NODES.map(n => [n.id, n]));

// BFS Pathfinding along connected road nodes
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

// Sequential Missions
const MISSIONS = [
  {
    id: 1,
    title: "Mission 1: Lighthouse to Seaport Yard",
    desc: "Use direction controls or click connected nodes to navigate from the Lighthouse 🏮 to the Seaport & Container Yard ⚓!",
    start: 'lighthouse',
    target: 'seaport'
  },
  {
    id: 2,
    title: "Mission 2: Seaport Yard to Shipyard",
    desc: "Ride your bike through the channel roads eastward to the Shipyard & Dry Dock 🛠️!",
    start: 'seaport',
    target: 'shipyard'
  },
  {
    id: 3,
    title: "Mission 3: Shipyard to Underwater Observatory",
    desc: "Steer along the route to reach the glass Underwater Observatory Dome 🔮!",
    start: 'shipyard',
    target: 'observatory'
  },
  {
    id: 4,
    title: "Mission 4: Observatory to Offshore Wind Farm",
    desc: "Ride east to explore the clean energy Offshore Wind Farm 💨!",
    start: 'observatory',
    target: 'windfarm'
  },
  {
    id: 5,
    title: "Mission 5: Wind Farm to Offshore Oil Rig",
    desc: "Guide your bike into the Offshore Oil Rig platform 🛢️!",
    start: 'windfarm',
    target: 'oil_rig'
  },
  {
    id: 6,
    title: "Mission 6: Oil Rig to Tropical Island",
    desc: "Navigate across the roads to reach the lush Tropical Island 🌴!",
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
    title: "Mission 8: Marina to Polar Ice Rock",
    desc: "Embark on the final grand expedition across the route to reach the Polar Ice Rock 🧊!",
    start: 'marina',
    target: 'icerock'
  }
];

export default function MazeGame({ onSolve, isSolved, onVisitedCountChange, registerReset, registerDirectionMove }) {
  const [missionIdx, setMissionIdx] = useState(0);
  const [visitedCount, setVisitedCount] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showMissionPopup, setShowMissionPopup] = useState(true);

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

    // Load 3D nautical sea map background
    const bgImg = new Image();
    bgImg.src = "/FunWithMagnets/nautical_grid_map.jpg";

    let animFrame = null;
    let hoveredNodeId = null;

    // Movement & Animation State
    let currentNodeId = currentMission.start;
    let pathQueue = []; // Array of next node IDs to travel through
    let isMoving = false;
    let moveStartTime = 0;
    const MOVE_DURATION = 420; // ms per road segment

    let animFrom = { x: startPoint.x, y: startPoint.y };
    let animTo = { x: startPoint.x, y: startPoint.y };

    let bike = {
      x: startPoint.x,
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
      animFrom = { x: startNode.x, y: startNode.y };
      animTo = { x: startNode.x, y: startNode.y };
    };

    // Helper to start moving to next node in pathQueue
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

      // Set bike rotation to face forward along movement vector
      const dx = nextNode.x - animFrom.x;
      const dy = nextNode.y - animFrom.y;
      if (dx !== 0 || dy !== 0) {
        bike.rotation = Math.atan2(dy, dx);
      }
    };

    // Navigate to a destination node via shortest road path
    const navigateToNode = (targetId) => {
      if (targetId === currentNodeId && !isMoving) return;
      const path = findShortestPath(currentNodeId, targetId);
      if (path && path.length > 1) {
        pathQueue = path.slice(1); // Exclude current node
        if (!isMoving) {
          startNextSegment();
        }
      }
    };

    // Directional control movement
    const moveInDirection = (dir) => {
      const cur = NODES_MAP[currentNodeId];
      if (!cur) return;

      // Find neighbor best matching the direction
      let bestNeighbor = null;
      let bestScore = -Infinity;

      // Define direction vector weights in isometric view
      // UP/NORTH: y decreases (-y), DOWN/SOUTH: y increases (+y)
      // LEFT/WEST: x decreases (-x), RIGHT/EAST: x increases (+x)
      let targetDx = 0;
      let targetDy = 0;

      if (dir === 'up' || dir === 'north' || dir === 'N') { targetDx = 0.2; targetDy = -1; }
      else if (dir === 'down' || dir === 'south' || dir === 'S') { targetDx = -0.2; targetDy = 1; }
      else if (dir === 'left' || dir === 'west' || dir === 'W') { targetDx = -1; targetDy = 0.2; }
      else if (dir === 'right' || dir === 'east' || dir === 'E') { targetDx = 1; targetDy = -0.2; }

      cur.neighbors.forEach((nId) => {
        const neighbor = NODES_MAP[nId];
        if (!neighbor) return;
        const dx = neighbor.x - cur.x;
        const dy = neighbor.y - cur.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) return;

        // Dot product with normalized direction vector
        const score = (dx / dist) * targetDx + (dy / dist) * targetDy;
        if (score > bestScore) {
          bestScore = score;
          bestNeighbor = nId;
        }
      });

      if (bestNeighbor && bestScore > 0.1) {
        if (!isMoving) {
          pathQueue = [bestNeighbor];
          startNextSegment();
        } else {
          pathQueue.push(bestNeighbor);
        }
      }
    };

    handleDirectionMoveRef.current = moveInDirection;

    // Canvas click: click directly on a node to travel there
    const handleCanvasClick = (e) => {
      const r = canvas.getBoundingClientRect();
      const scaleX = canvas.width / r.width;
      const scaleY = canvas.height / r.height;
      const clickX = (e.clientX - r.left) * scaleX;
      const clickY = (e.clientY - r.top) * scaleY;

      // Find clicked node within 32px tolerance
      for (const node of WAYPOINT_NODES) {
        if (Math.hypot(clickX - node.x, clickY - node.y) <= 32) {
          navigateToNode(node.id);
          break;
        }
      }
    };

    const handleCanvasMouseMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const scaleX = canvas.width / r.width;
      const scaleY = canvas.height / r.height;
      const mouseX = (e.clientX - r.left) * scaleX;
      const mouseY = (e.clientY - r.top) * scaleY;

      let found = null;
      for (const node of WAYPOINT_NODES) {
        if (Math.hypot(mouseX - node.x, mouseY - node.y) <= 30) {
          found = node.id;
          break;
        }
      }
      hoveredNodeId = found;
      canvas.style.cursor = found ? 'pointer' : 'default';
    };

    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);

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

      // 1. Process Smooth Translation along Road Lines
      if (isMoving) {
        const elapsed = now - moveStartTime;
        const rawT = Math.min(1, elapsed / MOVE_DURATION);
        // Smoothstep interpolation (ease-in-out)
        const t = rawT * rawT * (3 - 2 * rawT);

        bike.x = animFrom.x + (animTo.x - animFrom.x) * t;
        bike.y = animFrom.y + (animTo.y - animFrom.y) * t;

        if (rawT >= 1) {
          bike.x = animTo.x;
          bike.y = animTo.y;

          // Check if destination goal reached
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
            // Continue along pathQueue if any nodes remain
            startNextSegment();
          }
        }
      }

      // 2. Draw Background Map
      ctx.clearRect(0, 0, W, H);
      if (bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, 0, 0, W, H);
      } else {
        ctx.fillStyle = "#0A2440";
        ctx.fillRect(0, 0, W, H);
      }

      // 3. Draw Interactive Waypoint Node Rings
      const cur = NODES_MAP[currentNodeId];
      WAYPOINT_NODES.forEach((node) => {
        const isTarget = node.id === targetPoint.id;
        const isHovered = node.id === hoveredNodeId;
        const isConnected = cur && cur.neighbors.includes(node.id);

        ctx.save();
        ctx.translate(node.x, node.y);

        // Node Glow when Hovered or Connected
        if (isConnected || isHovered) {
          ctx.beginPath();
          ctx.arc(0, 0, isHovered ? 20 : 16, 0, Math.PI * 2);
          ctx.fillStyle = isHovered ? "rgba(56, 189, 248, 0.45)" : "rgba(56, 189, 248, 0.2)";
          ctx.fill();
        }

        // Inner waypoint circle
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fillStyle = isConnected ? "#0284C7" : (isHovered ? "#38BDF8" : "rgba(14, 165, 233, 0.75)");
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();

        ctx.restore();
      });

      // 4. Draw Target Destination Beacon
      ctx.save();
      ctx.translate(targetPoint.x, targetPoint.y);

      // Pulsing Beacon Aura
      const pulseScale = 1 + 0.15 * Math.sin(now * 0.005);
      const targetGlow = ctx.createRadialGradient(0, 0, 4, 0, 0, 36 * pulseScale);
      targetGlow.addColorStop(0, "rgba(245, 158, 11, 0.95)");
      targetGlow.addColorStop(0.5, "rgba(239, 68, 68, 0.5)");
      targetGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = targetGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 36 * pulseScale, 0, Math.PI * 2);
      ctx.fill();

      // Beacon Disc
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

      // Target Label Pill
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

      // 5. Draw Sports Bike
      drawBike(ctx, bike.x, bike.y, 50, bike.rotation, '#DC2626');

      animFrame = requestAnimationFrame(step);
    }

    step();

    return () => {
      cancelAnimationFrame(animFrame);
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('mousemove', handleCanvasMouseMove);
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
              Great navigation! Your bike successfully reached the landmark destination!
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
