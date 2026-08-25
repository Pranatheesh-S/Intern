import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Move, Compass, RotateCcw, HelpCircle, ArrowLeft, ArrowRight } from 'lucide-react';

// -------------------------------------------------------------------
// 1. Exact Waypoint Node Coordinate System for 3D Railway Grid Map
// -------------------------------------------------------------------
export const WAYPOINT_NODES = [
  // ── ROW 0: TOP OUTER TRACK ──
  { 
    id: 'node_0_0', 
    name: 'Top-Left Corner 🏛️', 
    shortName: 'TL Corner', 
    icon: '🏛️', 
    x: 135, 
    y: 59, 
    neighbors: ['node_0_1', 'node_1_0'] 
  },
  { 
    id: 'node_0_1', 
    name: 'Station North Track ⚡', 
    shortName: 'Station N', 
    icon: '⚡', 
    x: 377, 
    y: 59, 
    neighbors: ['node_0_0', 'node_0_2', 'node_1_1'] 
  },
  { 
    id: 'node_0_2', 
    name: 'Hospital North Track 🏥', 
    shortName: 'Hosp N', 
    icon: '🏥', 
    x: 620, 
    y: 59, 
    neighbors: ['node_0_1', 'node_0_3', 'node_1_2'] 
  },
  { 
    id: 'node_0_3', 
    name: 'Top-Right Corner 🏥', 
    shortName: 'TR Corner', 
    icon: '🏥', 
    x: 866, 
    y: 59, 
    neighbors: ['node_0_2', 'node_1_3'] 
  },

  // ── ROW 1: UPPER CROSSROAD LINE ──
  { 
    id: 'node_1_0', 
    name: 'Warehouse West Track 📦', 
    shortName: 'Ware W', 
    icon: '📦', 
    x: 115, 
    y: 203, 
    neighbors: ['node_0_0', 'node_2_0', 'node_1_1'] 
  },
  { 
    id: 'node_1_1', 
    name: 'North-West Junction 🔬', 
    shortName: 'NW Junc', 
    icon: '🔬', 
    x: 370, 
    y: 203, 
    neighbors: ['node_0_1', 'node_1_0', 'node_1_2', 'node_2_1'] 
  },
  { 
    id: 'node_1_2', 
    name: 'North-East Junction 🏢', 
    shortName: 'NE Junc', 
    icon: '🏢', 
    x: 625, 
    y: 203, 
    neighbors: ['node_0_2', 'node_1_1', 'node_1_3', 'node_2_2'] 
  },
  { 
    id: 'node_1_3', 
    name: 'Towers East Track 🏢', 
    shortName: 'Towers E', 
    icon: '🏢', 
    x: 884, 
    y: 203, 
    neighbors: ['node_0_3', 'node_2_3', 'node_1_2'] 
  },

  // ── ROW 2: LOWER CROSSROAD LINE ──
  { 
    id: 'node_2_0', 
    name: 'BioDome West Track 🌿', 
    shortName: 'Bio W', 
    icon: '🌿', 
    x: 94, 
    y: 355, 
    neighbors: ['node_1_0', 'node_3_0', 'node_2_1'] 
  },
  { 
    id: 'node_2_1', 
    name: 'South-West Junction 🚂', 
    shortName: 'SW Junc', 
    icon: '🚂', 
    x: 365, 
    y: 355, 
    neighbors: ['node_1_1', 'node_2_0', 'node_2_2', 'node_3_1'] 
  },
  { 
    id: 'node_2_2', 
    name: 'South-East Junction 🚉', 
    shortName: 'SE Junc', 
    icon: '🚉', 
    x: 633, 
    y: 355, 
    neighbors: ['node_1_2', 'node_2_1', 'node_2_3', 'node_3_2'] 
  },
  { 
    id: 'node_2_3', 
    name: 'Transit East Track 🚉', 
    shortName: 'Transit E', 
    icon: '🚉', 
    x: 903, 
    y: 355, 
    neighbors: ['node_1_3', 'node_3_3', 'node_2_2'] 
  },

  // ── ROW 3: BOTTOM OUTER TRACK ──
  { 
    id: 'node_3_0', 
    name: 'Bottom-Left Corner 🌿', 
    shortName: 'BL Corner', 
    icon: '🌿', 
    x: 75, 
    y: 517, 
    neighbors: ['node_2_0', 'node_3_1'] 
  },
  { 
    id: 'node_3_1', 
    name: 'Depot South Track 🚂', 
    shortName: 'Depot S', 
    icon: '🚂', 
    x: 358, 
    y: 517, 
    neighbors: ['node_3_0', 'node_3_2', 'node_2_1'] 
  },
  { 
    id: 'node_3_2', 
    name: 'Transit South Track 🚉', 
    shortName: 'Transit S', 
    icon: '🚉', 
    x: 642, 
    y: 517, 
    neighbors: ['node_3_1', 'node_3_3', 'node_2_2'] 
  },
  { 
    id: 'node_3_3', 
    name: 'Target: Bottom-Right Corner 🎯', 
    shortName: 'Goal', 
    icon: '🎯', 
    x: 925, 
    y: 517, 
    neighbors: ['node_2_3', 'node_3_2'] 
  }
];

export const NODES_MAP = Object.fromEntries(WAYPOINT_NODES.map(n => [n.id, n]));

// -------------------------------------------------------------------
// 2. BFS Pathfinding strictly along connected railway track network
// -------------------------------------------------------------------
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

// Single Mission from Top-Left Corner (node_0_0) to Bottom-Right Corner (node_3_3)
export const MISSIONS = [
  {
    id: 1,
    title: "Magnetic Train Expedition: Top-Left to Bottom-Right",
    desc: "Guide the magnetic transit train (1 Engine + 1 Compartment) along the 3D railway tracks using the handheld guiding magnet to reach the destination beacon at Bottom-Right Corner 🎯!",
    start: 'node_0_0',
    target: 'node_3_3'
  }
];

// Helper: Direction mapping for D-Pad
export function getAvailableDirections(nodeId) {
  const node = NODES_MAP[nodeId];
  if (!node) return {};
  const dirs = {};
  node.neighbors.forEach(nId => {
    const neighbor = NODES_MAP[nId];
    if (!neighbor) return;
    const dx = neighbor.x - node.x;
    const dy = neighbor.y - node.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) dirs['E'] = nId;
      else dirs['W'] = nId;
    } else {
      if (dy > 0) dirs['S'] = nId;
      else dirs['N'] = nId;
    }
  });
  return dirs;
}

// Global audio context singleton for immediate low-latency, high-volume sound playback
let sharedAudioCtx = null;
function getAudioContext() {
  if (!sharedAudioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}

// -------------------------------------------------------------------
// High-Volume Realistic Train Engine & Track Rail Sound Synthesizer
// -------------------------------------------------------------------
export function playRealisticTrainSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Heavy Locomotive Diesel / Electric Traction Motor Rumble
    const rumbleOsc = ctx.createOscillator();
    const rumbleGain = ctx.createGain();
    const rumbleFilter = ctx.createBiquadFilter();

    rumbleOsc.type = 'sawtooth';
    rumbleOsc.frequency.setValueAtTime(68, now);
    rumbleOsc.frequency.exponentialRampToValueAtTime(125, now + 0.45);
    rumbleOsc.frequency.exponentialRampToValueAtTime(75, now + 1.05);

    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(320, now);
    rumbleFilter.Q.setValueAtTime(3.8, now);

    rumbleGain.gain.setValueAtTime(0.01, now);
    rumbleGain.gain.linearRampToValueAtTime(0.65, now + 0.08);
    rumbleGain.gain.setValueAtTime(0.55, now + 0.75);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

    rumbleOsc.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(ctx.destination);

    rumbleOsc.start(now);
    rumbleOsc.stop(now + 1.1);

    // 2. High-Energy Steel Wheel on Rail "Click-Clack, Click-Clack" Track Clatter Beats
    const chugTimes = [0.0, 0.16, 0.35, 0.52, 0.72, 0.90];
    chugTimes.forEach((offset, idx) => {
      const beatTime = now + offset;

      // Realistic noise friction burst
      const bufferSize = Math.floor(ctx.sampleRate * 0.085);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(idx % 2 === 0 ? 920 : 1380, beatTime);
      noiseFilter.Q.setValueAtTime(4.2, beatTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.75, beatTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.08);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noiseSource.start(beatTime);
      noiseSource.stop(beatTime + 0.085);

      // Low-end steel rail joint impact thud
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(idx % 2 === 0 ? 150 : 190, beatTime);
      thudOsc.frequency.exponentialRampToValueAtTime(52, beatTime + 0.075);

      thudGain.gain.setValueAtTime(0.6, beatTime);
      thudGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.075);

      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);

      thudOsc.start(beatTime);
      thudOsc.stop(beatTime + 0.08);
    });

    // 3. Electric Traction Whir / Rail Whine
    const whirOsc = ctx.createOscillator();
    const whirGain = ctx.createGain();
    whirOsc.type = 'sine';
    whirOsc.frequency.setValueAtTime(440, now);
    whirOsc.frequency.exponentialRampToValueAtTime(720, now + 0.45);
    whirOsc.frequency.exponentialRampToValueAtTime(540, now + 0.98);

    whirGain.gain.setValueAtTime(0.01, now);
    whirGain.gain.linearRampToValueAtTime(0.35, now + 0.1);
    whirGain.gain.setValueAtTime(0.28, now + 0.72);
    whirGain.gain.exponentialRampToValueAtTime(0.001, now + 1.05);

    whirOsc.connect(whirGain);
    whirGain.connect(ctx.destination);

    whirOsc.start(now);
    whirOsc.stop(now + 1.05);

  } catch (err) {}
}

// -------------------------------------------------------------------
// 3. SVG Realistic Magnetic Train Sprite (1 Engine + 1 Compartment)
// -------------------------------------------------------------------
const MagneticTrainSprite = ({ x, y, rotation, isMoving, now }) => {
  const deg = (rotation * 180 / Math.PI);
  const hoverWobble = isMoving ? Math.sin(now * 0.015) * 1.5 : Math.sin(now * 0.006) * 0.8;
  const railJitter = isMoving ? Math.sin(now * 0.05) * 0.4 : 0;
  const pulse = 1 + 0.15 * Math.sin(now * 0.012);

  return (
    <g transform={`translate(${x}, ${y + railJitter})`}>
      {/* 1. Ground Footprint Shadow */}
      <g transform={`rotate(${deg})`}>
        <ellipse
          cx="-10"
          cy="0"
          rx="44"
          ry="10"
          fill="rgba(15, 23, 42, 0.5)"
          style={{ filter: 'blur(2.5px)' }}
        />

        {/* 2. Cyan Maglev Levitation Track Field */}
        <ellipse
          cx="-10"
          cy="0"
          rx={isMoving ? 42 : 38}
          ry={isMoving ? 8.5 : 7}
          fill="rgba(56, 189, 248, 0.35)"
          style={{ filter: 'blur(3px)' }}
        />

        {/* 3. Projected Headlight Cones on Track Rails */}
        <polygon
          points="20,-4 75,-20 75,20 20,4"
          fill="url(#headlightBeamGrad)"
          opacity={isMoving ? 0.85 : 0.5}
          pointerEvents="none"
        />

        {/* 4. TRAIN COMPARTMENT (Passenger / Observation Coach) */}
        <g transform={`translate(-22, ${hoverWobble * 0.65})`}>
          {/* Undercarriage Maglev Bogie Skids */}
          <rect x="-17" y="-7.5" width="34" height="15" rx="3.5" fill="#0F172A" stroke="#334155" strokeWidth="0.8" />
          
          {/* Coach Main Body (Aerodynamic Streamlined Shell) */}
          <rect x="-16" y="-6.5" width="32" height="13" rx="4" fill="url(#trainCoachGrad)" stroke="#1E293B" strokeWidth="0.8" />

          {/* Emerald / Gold Livery Racing Stripe */}
          <line x1="-15" y1="-0.5" x2="15" y2="-0.5" stroke="#059669" strokeWidth="2.2" />
          <line x1="-15" y1="1.4" x2="15" y2="1.4" stroke="#F59E0B" strokeWidth="0.8" />

          {/* Roof Aero Air Intake / Solar Ribs */}
          <rect x="-12" y="-5.5" width="24" height="2" rx="1" fill="#475569" />

          {/* Panoramic Passenger Windows (Illuminated Glass) */}
          <rect x="-13" y="-5" width="5" height="3" rx="0.8" fill="#BAE6FD" stroke="#0284C7" strokeWidth="0.5" />
          <rect x="-6" y="-5" width="5" height="3" rx="0.8" fill="#BAE6FD" stroke="#0284C7" strokeWidth="0.5" />
          <rect x="1" y="-5" width="5" height="3" rx="0.8" fill="#BAE6FD" stroke="#0284C7" strokeWidth="0.5" />
          <rect x="8" y="-5" width="5" height="3" rx="0.8" fill="#BAE6FD" stroke="#0284C7" strokeWidth="0.5" />

          {/* Rear Red Marker Tail Lights */}
          <circle cx="-15.5" cy="-4" r="1.2" fill="#EF4444" style={{ filter: 'drop-shadow(0 0 3px #EF4444)' }} />
          <circle cx="-15.5" cy="4" r="1.2" fill="#EF4444" style={{ filter: 'drop-shadow(0 0 3px #EF4444)' }} />
        </g>

        {/* 5. INTER-CAR ACCORDION GANGWAY COUPLER (Between Compartment & Engine) */}
        <g transform="translate(-5, 0)">
          <rect x="-3" y="-5" width="6" height="10" rx="1.5" fill="#1E293B" stroke="#0F172A" strokeWidth="0.8" />
          <line x1="-1" y1="-5" x2="-1" y2="5" stroke="#334155" strokeWidth="0.8" />
          <line x1="1" y1="-5" x2="1" y2="5" stroke="#334155" strokeWidth="0.8" />
        </g>

        {/* 6. TRAIN ENGINE (Leading Aerodynamic Locomotive) */}
        <g transform={`translate(14, ${hoverWobble})`}>
          {/* Undercarriage Maglev Bogie Skids */}
          <rect x="-14" y="-7.5" width="28" height="15" rx="3.5" fill="#0F172A" stroke="#334155" strokeWidth="0.8" />

          {/* Engine Main Body with Bullet Nose */}
          <path
            d="M -14 -6.5
               L 5 -6.5
               Q 15 -6.5 18 0
               Q 15 6.5 5 6.5
               L -14 6.5
               Z"
            fill="url(#trainEngineGrad)"
            stroke="#1E293B"
            strokeWidth="0.9"
          />

          {/* Emerald / Gold Aero Livery Swoosh */}
          <path
            d="M -13 -0.5
               L 5 -0.5
               Q 12 -0.5 15 0
               Q 12 0.5 5 0.5
               L -13 0.5
               Z"
            fill="#059669"
            stroke="#F59E0B"
            strokeWidth="0.6"
          />

          {/* Driver Cockpit Windshield (Curved Dark Tinted Glass) */}
          <path
            d="M 2 -4.8
               L 8 -4.8
               Q 13 -4.8 14 0
               Q 13 4.8 8 4.8
               L 2 4.8
               Q 4 0 2 -4.8 Z"
            fill="#0F172A"
            stroke="#38BDF8"
            strokeWidth="0.8"
          />
          <path
            d="M 4 -3.5
               L 8 -3.5
               Q 11.5 -3.5 12 0
               Q 11.5 3.5 8 3.5
               L 4 3.5 Z"
            fill="#38BDF8"
            opacity="0.8"
          />

          {/* Engine Side Cabin Windows */}
          <rect x="-10" y="-5.5" width="4.5" height="2.5" rx="0.6" fill="#BAE6FD" stroke="#0284C7" strokeWidth="0.5" />
          <rect x="-4" y="-5.5" width="4.5" height="2.5" rx="0.6" fill="#BAE6FD" stroke="#0284C7" strokeWidth="0.5" />

          {/* Roof Aero Air Intake / Pantograph Dome */}
          <rect x="-10" y="-2" width="12" height="4" rx="1.5" fill="#334155" />
          <circle cx="-4" cy="0" r="1.5" fill="#F59E0B" />

          {/* Dual Xenon Headlights */}
          <circle cx="16.5" cy="-2.5" r="1.5" fill="#FFFFFF" stroke="#FEF08A" strokeWidth="0.8" style={{ filter: 'drop-shadow(0 0 4px #FFFFFF)' }} />
          <circle cx="16.5" cy="2.5" r="1.5" fill="#FFFFFF" stroke="#FEF08A" strokeWidth="0.8" style={{ filter: 'drop-shadow(0 0 4px #FFFFFF)' }} />

          {/* Front Magnetic Levitation Receiver Sensor (Nose Tip) */}
          <circle cx="19" cy="0" r={3 * pulse} fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" style={{ filter: 'drop-shadow(0 0 6px #38BDF8)' }} />
          <circle cx="19" cy="0" r="1.3" fill="#FFFFFF" />
        </g>
      </g>
    </g>
  );
};

// -------------------------------------------------------------------
// 4. SVG Guiding Horseshoe Magnet Sprite
// -------------------------------------------------------------------
const HorseshoeMagnetSprite = ({ x, y, rotation, now }) => {
  const w = 28;
  const h = 32;
  const thickness = 8;
  const pulse = 1 + 0.12 * Math.sin(now * 0.008);
  const deg = (rotation * 180 / Math.PI) + 90;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="0" rx={28 * pulse} ry={28 * pulse} fill="url(#magnetAuraGrad)" pointerEvents="none" />
      <ellipse cx="0" cy="5" rx={w * 0.55} ry={h * 0.36} fill="rgba(0,0,0,0.35)" style={{ filter: 'blur(2px)' }} />

      <g transform={`rotate(${deg})`}>
        <rect x={-w / 2} y={-h * 0.25} width={thickness} height={h * 0.65} rx="3" fill="url(#northArmGrad)" />
        <rect x={w / 2 - thickness} y={-h * 0.25} width={thickness} height={h * 0.65} rx="3" fill="url(#southArmGrad)" />

        <path
          d={`M ${-w / 2} ${-h * 0.25} 
             A ${w * 0.48} ${w * 0.48} 0 0 1 ${w / 2} ${-h * 0.25} 
             L ${w / 2 - thickness} ${-h * 0.25} 
             A ${w * 0.48 - thickness} ${w * 0.48 - thickness} 0 0 0 ${-w / 2 + thickness} ${-h * 0.25} Z`}
          fill="url(#archBridgeGrad)"
        />

        <rect x={-w / 2} y={h * 0.4 - 7} width={thickness} height="7" rx="2" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="0.8" />
        <rect x={w / 2 - thickness} y={h * 0.4 - 7} width={thickness} height="7" rx="2" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="0.8" />

        <text x={-w / 2 + thickness / 2} y={-h * 0.02} fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle" dominantBaseline="middle">N</text>
        <text x={w / 2 - thickness / 2} y={-h * 0.02} fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle" dominantBaseline="middle">S</text>
      </g>
    </g>
  );
};

// -------------------------------------------------------------------
// 5. SVG Animated Magnetic Flux Tether & Flowing Energy Particles
// -------------------------------------------------------------------
const MagneticFluxTetherSprite = ({ magnetX, magnetY, trainX, trainY, now }) => {
  const dist = Math.hypot(magnetX - trainX, magnetY - trainY);
  if (dist < 4) return null;

  const pulse = 0.75 + 0.25 * Math.sin(now * 0.01);
  const dashOffset = -now * 0.045;

  const numParticles = 4;
  const particles = [];
  for (let i = 1; i <= numParticles; i++) {
    const pT = (now * 0.0016 + i / numParticles) % 1;
    const px = magnetX + (trainX - magnetX) * pT;
    const py = magnetY + (trainY - magnetY) * pT;
    const pr = 2.5 + Math.sin(pT * Math.PI) * 2;
    const opacity = Math.sin(pT * Math.PI) * 0.95;
    particles.push({ px, py, pr, opacity, key: i });
  }

  return (
    <g pointerEvents="none">
      <line x1={magnetX} y1={magnetY} x2={trainX} y2={trainY} stroke="rgba(56, 189, 248, 0.25)" strokeWidth="14" strokeLinecap="round" />
      <line x1={magnetX} y1={magnetY} x2={trainX} y2={trainY} stroke={`rgba(14, 165, 233, ${0.85 * pulse})`} strokeWidth="4" strokeLinecap="round" />
      <line
        x1={magnetX}
        y1={magnetY}
        x2={trainX}
        y2={trainY}
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeDasharray="7 7"
        strokeDashoffset={dashOffset}
      />
      {particles.map(p => (
        <circle key={p.key} cx={p.px} cy={p.py} r={p.pr} fill="#BAE6FD" opacity={p.opacity} style={{ filter: 'drop-shadow(0 0 4px #38BDF8)' }} />
      ))}
    </g>
  );
};

// -------------------------------------------------------------------
// 6. LIVE COMPASS WITH HIGHLIGHTED CARDINAL WORD HUD
// -------------------------------------------------------------------
const LiveCompassHUD = ({ angle = 0, currentDir = 'E' }) => {
  const norm = (angle % 360 + 360) % 360;
  let activeCardinal = currentDir || 'E';
  if (norm >= 315 || norm < 45) activeCardinal = 'E';
  else if (norm >= 45 && norm < 135) activeCardinal = 'S';
  else if (norm >= 135 && norm < 225) activeCardinal = 'W';
  else if (norm >= 225 && norm < 315) activeCardinal = 'N';

  const dirFullNames = { N: 'NORTH', E: 'EAST', S: 'SOUTH', W: 'WEST' };

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      right: '18px',
      zIndex: 20,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(15, 23, 42, 0.92)',
      backdropFilter: 'blur(8px)',
      border: '2px solid #38BDF8',
      borderRadius: '16px',
      padding: '6px 14px 6px 10px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      pointerEvents: 'none'
    }}>
      <svg width="44" height="44" viewBox="-24 -24 48 48" style={{ display: 'block', overflow: 'visible' }}>
        <circle r="21" fill="#1E293B" stroke="#475569" strokeWidth="2" />

        <g transform={`rotate(${angle})`} style={{ transition: 'transform 0.25s ease-out' }}>
          <polygon points="0,-18 4.5,0 0,-2" fill="#EF4444" />
          <polygon points="0,-18 -4.5,0 0,-2" fill="#F87171" />
          <polygon points="0,18 4.5,0 0,2" fill="#94A3B8" />
          <polygon points="0,18 -4.5,0 0,2" fill="#CBD5E1" />
          <circle r="3.5" fill="#38BDF8" stroke="#0F172A" strokeWidth="1" />
        </g>

        <text x="0" y="-12" textAnchor="middle" fontSize="7.5" fontWeight="900" fill={activeCardinal === 'N' ? '#FEF08A' : '#EF4444'}>N</text>
        <text x="0" y="18" textAnchor="middle" fontSize="7.5" fontWeight="900" fill={activeCardinal === 'S' ? '#FEF08A' : '#94A3B8'}>S</text>
        <text x="-14" y="3" textAnchor="middle" fontSize="7" fontWeight="900" fill={activeCardinal === 'W' ? '#FEF08A' : '#94A3B8'}>W</text>
        <text x="14" y="3" textAnchor="middle" fontSize="7" fontWeight="900" fill={activeCardinal === 'E' ? '#FEF08A' : '#94A3B8'}>E</text>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Live Compass
        </div>
        <div style={{ fontSize: '13px', fontWeight: 900, color: '#38BDF8', letterSpacing: '0.08em', textShadow: '0 0 10px rgba(56, 189, 248, 0.6)' }}>
          HEADING: {dirFullNames[activeCardinal]}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// 7. MAIN INTERACTIVE MAZE COMPONENT (SVG/DOM LAYERED ARCHITECTURE)
// -------------------------------------------------------------------
export default function MazeGame({ 
  onSolve, 
  isSolved, 
  onVisitedCountChange, 
  onNodeChange,
  hintDir,
  registerReset, 
  registerDirectionMove,
  registerHint
}) {
  const [missionIdx, setMissionIdx] = useState(0);
  const [visitedCount, setVisitedCount] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showMissionPopup, setShowMissionPopup] = useState(false);

  // Train and magnet animation state
  const [now, setNow] = useState(0);
  const [visitedHistory, setVisitedHistory] = useState(['node_0_0']);
  const [trainState, setTrainState] = useState({
    x: WAYPOINT_NODES[0].x,
    y: WAYPOINT_NODES[0].y,
    rotation: 0,
    isMoving: false
  });
  const [magnetState, setMagnetState] = useState({
    x: WAYPOINT_NODES[0].x + 72,
    y: WAYPOINT_NODES[0].y,
    rotation: 0
  });

  const onSolveRef = useRef(onSolve);
  const isSolvedRef = useRef(isSolved);
  const animFrameRef = useRef(null);

  // Navigation state refs
  const currentMission = MISSIONS[missionIdx] || MISSIONS[0];
  const startPoint = NODES_MAP[currentMission.start] || WAYPOINT_NODES[0];
  const targetPoint = NODES_MAP[currentMission.target] || WAYPOINT_NODES[15];

  const currentNodeIdRef = useRef(currentMission.start);
  const pathQueueRef = useRef([]);
  const isMovingRef = useRef(false);
  const moveStartTimeRef = useRef(0);
  const animFromRef = useRef({ x: startPoint.x, y: startPoint.y, angle: 0 });
  const animToRef = useRef({ x: startPoint.x, y: startPoint.y, angle: 0 });
  
  // Smooth Stately Speed: 1050ms per segment for realistic train dynamics
  const MOVE_DURATION = 1050;

  useEffect(() => {
    onSolveRef.current = onSolve;
    isSolvedRef.current = isSolved;
  }, [onSolve, isSolved]);

  useEffect(() => {
    if (onVisitedCountChange) onVisitedCountChange(visitedCount, WAYPOINT_NODES.length);
  }, [visitedCount, onVisitedCountChange]);

  useEffect(() => {
    if (onNodeChange) onNodeChange(currentNodeIdRef.current, isMovingRef.current);
  }, [onNodeChange]);

  // Reset Handler
  const handleReset = () => {
    currentNodeIdRef.current = currentMission.start;
    pathQueueRef.current = [];
    isMovingRef.current = false;
    const startNode = NODES_MAP[currentMission.start] || WAYPOINT_NODES[0];
    animFromRef.current = { x: startNode.x, y: startNode.y, angle: 0 };
    animToRef.current = { x: startNode.x, y: startNode.y, angle: 0 };
    setVisitedHistory([startNode.id]);

    setTrainState({
      x: startNode.x,
      y: startNode.y,
      rotation: 0,
      isMoving: false
    });
    setMagnetState({
      x: startNode.x + 72,
      y: startNode.y,
      rotation: 0
    });

    if (onNodeChange) onNodeChange(startNode.id, false);
  };

  useEffect(() => {
    if (registerReset) {
      registerReset(handleReset);
    }
  }, [registerReset]);

  // Travel next segment in queue
  const startNextSegment = () => {
    if (pathQueueRef.current.length === 0) {
      isMovingRef.current = false;
      setTrainState(prev => ({ ...prev, isMoving: false }));
      if (onNodeChange) onNodeChange(currentNodeIdRef.current, false);
      return;
    }

    const nextId = pathQueueRef.current.shift();
    const nextNode = NODES_MAP[nextId];
    if (!nextNode) {
      isMovingRef.current = false;
      setTrainState(prev => ({ ...prev, isMoving: false }));
      if (onNodeChange) onNodeChange(currentNodeIdRef.current, false);
      return;
    }

    const cur = NODES_MAP[currentNodeIdRef.current] || { x: trainState.x, y: trainState.y };
    const dx = nextNode.x - cur.x;
    const dy = nextNode.y - cur.y;
    const targetAngle = (dx !== 0 || dy !== 0) ? Math.atan2(dy, dx) : trainState.rotation;

    animFromRef.current = { x: cur.x, y: cur.y, angle: trainState.rotation };
    animToRef.current = { x: nextNode.x, y: nextNode.y, angle: targetAngle };
    currentNodeIdRef.current = nextId;
    isMovingRef.current = true;
    moveStartTimeRef.current = performance.now();

    // Play high-volume realistic train sound immediately when movement starts
    playRealisticTrainSound();

    setTrainState(prev => ({ ...prev, isMoving: true }));
    setVisitedHistory(prev => (prev.includes(nextId) ? prev : [...prev, nextId]));
    if (onNodeChange) onNodeChange(nextId, true);
  };

  // Move to targeted node via shortest path
  const navigateToNode = (targetId) => {
    if (targetId === currentNodeIdRef.current && !isMovingRef.current) return;
    const path = findShortestPath(currentNodeIdRef.current, targetId);
    if (path && path.length > 1) {
      pathQueueRef.current = path.slice(1);
      if (!isMovingRef.current) {
        startNextSegment();
      }
    }
  };

  // Move via direction input
  const moveInDirection = (dir) => {
    const cur = NODES_MAP[currentNodeIdRef.current];
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
      if (!isMovingRef.current) {
        pathQueueRef.current = [bestNeighbor];
        startNextSegment();
      } else {
        pathQueueRef.current.push(bestNeighbor);
      }
    }
  };

  useEffect(() => {
    if (registerDirectionMove) {
      registerDirectionMove(moveInDirection);
    }
  }, [registerDirectionMove]);

  // Hint calculation
  const getNextHintDirection = () => {
    const shortest = findShortestPath(currentNodeIdRef.current, targetPoint.id);
    if (shortest && shortest.length > 1) {
      const nextId = shortest[1];
      const cur = NODES_MAP[currentNodeIdRef.current];
      const nextNode = NODES_MAP[nextId];
      if (cur && nextNode) {
        const dx = nextNode.x - cur.x;
        const dy = nextNode.y - cur.y;
        if (Math.abs(dx) > Math.abs(dy)) {
          return dx > 0 ? 'E' : 'W';
        } else {
          return dy > 0 ? 'S' : 'N';
        }
      }
    }
    return null;
  };

  useEffect(() => {
    if (registerHint) {
      registerHint(getNextHintDirection);
    }
  }, [registerHint]);

  // Keyboard navigation
  useEffect(() => {
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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMissionPopup]);

  // Main 60 FPS continuous animation loop with smooth easing and rotation slerp
  useEffect(() => {
    const step = () => {
      const currentTime = performance.now();
      setNow(currentTime);

      if (isMovingRef.current) {
        const elapsed = currentTime - moveStartTimeRef.current;
        const rawT = Math.min(1, elapsed / MOVE_DURATION);

        const dx = animToRef.current.x - animFromRef.current.x;
        const dy = animToRef.current.y - animFromRef.current.y;
        const segmentDist = Math.hypot(dx, dy);

        // Smooth Ease-In-Out Quadratic curve for realistic train physics
        const tSmooth = rawT < 0.5 ? 2 * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 2) / 2;

        // Smooth rotation interpolation (shortest angular difference)
        const startAngle = animFromRef.current.angle;
        const targetAngle = animToRef.current.angle;
        let angleDiff = targetAngle - startAngle;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        const smoothAngle = startAngle + angleDiff * Math.min(1, rawT * 2.2);

        // Leading magnet smooth motion (glides ahead to pull the train)
        const tMagnet = Math.min(1, rawT * 1.18);
        const smoothTMagnet = tMagnet < 0.5 ? 2 * tMagnet * tMagnet : 1 - Math.pow(-2 * tMagnet + 2, 2) / 2;
        const leadDist = Math.min(74, segmentDist * 0.55 + 20);

        const magX = animFromRef.current.x + dx * smoothTMagnet + Math.cos(smoothAngle) * leadDist * (1 - smoothTMagnet * 0.25);
        const magY = animFromRef.current.y + dy * smoothTMagnet + Math.sin(smoothAngle) * leadDist * (1 - smoothTMagnet * 0.25);

        // Trailing train smooth motion
        const trainX = animFromRef.current.x + dx * tSmooth;
        const trainY = animFromRef.current.y + dy * tSmooth;

        setTrainState({
          x: trainX,
          y: trainY,
          rotation: smoothAngle,
          isMoving: true
        });

        setMagnetState({
          x: magX,
          y: magY,
          rotation: smoothAngle
        });

        if (rawT >= 1) {
          const finalX = animToRef.current.x;
          const finalY = animToRef.current.y;

          setTrainState({
            x: finalX,
            y: finalY,
            rotation: targetAngle,
            isMoving: false
          });

          setMagnetState({
            x: finalX + Math.cos(targetAngle) * 72,
            y: finalY + Math.sin(targetAngle) * 72,
            rotation: targetAngle
          });

          const isDest = (currentNodeIdRef.current === targetPoint.id);

          if (isDest) {
            pathQueueRef.current = [];
            isMovingRef.current = false;
            if (onNodeChange) onNodeChange(currentNodeIdRef.current, false);

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
        const hoverOffset = 72;
        const floatWobbleX = Math.cos(currentTime * 0.005) * 2;
        const floatWobbleY = Math.sin(currentTime * 0.005) * 2;

        setMagnetState(prev => ({
          ...prev,
          x: trainState.x + Math.cos(trainState.rotation) * hoverOffset + floatWobbleX,
          y: trainState.y + Math.sin(trainState.rotation) * hoverOffset + floatWobbleY,
          rotation: trainState.rotation
        }));
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [trainState.x, trainState.y, trainState.rotation, missionIdx, showCelebration]);

  const compassAngleDeg = (trainState.rotation * 180 / Math.PI);

  // Dynamic live path covered by the train (including the currently traversed segment)
  const dynamicCoveredPathPoints = (() => {
    const pts = visitedHistory
      .slice(0, -1)
      .map(id => NODES_MAP[id])
      .filter(Boolean)
      .map(n => `${n.x},${n.y}`);
    
    pts.push(`${trainState.x.toFixed(1)},${trainState.y.toFixed(1)}`);
    return pts.join(' ');
  })();

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
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* 1. Live Compass HUD (Top-Right of Map) */}
      <LiveCompassHUD angle={compassAngleDeg} />

      {/* 2. Mission Briefing Pop-up */}
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
                border: '3px solid #38BDF8'
              }}
            >
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: '#E0F2FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)'
              }}>
                <Target size={36} color="#0284C7" />
              </div>
              
              <h2 style={{ margin: '0 0 1rem 0', color: '#0369A1', fontSize: '1.6rem', fontWeight: 900 }}>
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
                  background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                  color: '#FFFFFF',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(2, 132, 199, 0.4)',
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

      {/* 3. Destination Celebration Banner */}
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
              Great navigation! The magnetic train successfully reached the destination beacon!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Declarative SVG / DOM Layered Simulation Viewport */}
      <svg
        viewBox="0 0 1000 563"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '20px',
          border: '2.5px solid #A7F3D0',
          boxShadow: '0 12px 35px rgba(6, 78, 59, 0.12)',
          display: 'block',
          background: '#000000'
        }}
      >
        <defs>
          <linearGradient id="northArmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>

          <linearGradient id="southArmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <linearGradient id="archBridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="48%" stopColor="#475569" />
            <stop offset="52%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          <radialGradient id="magnetAuraGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
          </radialGradient>

          {/* Train Gradients */}
          <linearGradient id="trainEngineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="30%" stopColor="#334155" />
            <stop offset="70%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          <linearGradient id="trainCoachGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="25%" stopColor="#1E293B" />
            <stop offset="85%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <linearGradient id="headlightBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(254, 240, 138, 0.75)" />
            <stop offset="40%" stopColor="rgba(56, 189, 248, 0.4)" />
            <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
          </linearGradient>
        </defs>

        {/* 1. Exact High Quality 3D Isometric Railway Transit Grid Map */}
        <image
          href="/FunWithMagnets/rail_transit_map_4k.jpg"
          x="0"
          y="0"
          width="1000"
          height="563"
          preserveAspectRatio="none"
        />

        {/* 2. White Dotted Path Line Covered by Train */}
        {dynamicCoveredPathPoints && (
          <g pointerEvents="none">
            {/* Soft luminous underlay */}
            <polyline
              points={dynamicCoveredPathPoints}
              fill="none"
              stroke="rgba(255, 255, 255, 0.35)"
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'blur(2px)' }}
            />
            {/* Crisp High-Contrast White Dotted Line */}
            <polyline
              points={dynamicCoveredPathPoints}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeDasharray="4 8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.9))' }}
            />
          </g>
        )}

        {/* 3. Interactive Nodes Over Orange Dots (16 Waypoint Dots) */}
        {WAYPOINT_NODES.map((node) => {
          const isConnected = NODES_MAP[currentNodeIdRef.current]?.neighbors.includes(node.id);
          const isCurrent = currentNodeIdRef.current === node.id;
          const isVisited = visitedHistory.includes(node.id);

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={() => navigateToNode(node.id)}
              style={{ cursor: isConnected ? 'pointer' : 'default' }}
            >
              {/* Active Pulse Ring over Orange Dot */}
              {isConnected && (
                <circle
                  cx="0"
                  cy="0"
                  r={10 + 2 * Math.sin(now * 0.008)}
                  fill="rgba(56, 189, 248, 0.3)"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                />
              )}

              {/* Waypoint Indicator Circle */}
              <circle
                cx="0"
                cy="0"
                r="6"
                fill={isCurrent ? '#0284C7' : (isConnected ? '#38BDF8' : (isVisited ? '#059669' : '#F59E0B'))}
                stroke="#FFFFFF"
                strokeWidth="1.5"
                opacity={isConnected || isCurrent ? 1 : 0.65}
              />
            </g>
          );
        })}

        {/* 4. Target Destination Beacon over Destination Orange Dot (node_3_3) */}
        <g transform={`translate(${targetPoint.x}, ${targetPoint.y})`}>
          <circle cx="0" cy="0" r={24 + 3 * Math.sin(now * 0.006)} fill="rgba(245, 158, 11, 0.35)" />
          <circle cx="0" cy="0" r="15" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2.5" />
          <text x="0" y="4.5" textAnchor="middle" fontSize="12">{targetPoint.icon}</text>

          <g transform="translate(0, -24)" pointerEvents="none">
            <rect x="-46" y="-8" width="92" height="16" rx="8" fill="#064E3B" stroke="#A7F3D0" strokeWidth="1.5" />
            <text x="0" y="3" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="900" fontFamily="system-ui, sans-serif">
              DESTINATION 🎯
            </text>
          </g>
        </g>

        {/* 5. Realistic Magnetic Train Sprite (1 Engine + 1 Compartment) */}
        <MagneticTrainSprite
          x={trainState.x}
          y={trainState.y}
          rotation={trainState.rotation}
          isMoving={trainState.isMoving}
          now={now}
        />
      </svg>
    </div>
  );
}
