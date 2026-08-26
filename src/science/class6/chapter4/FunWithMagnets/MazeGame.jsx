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

// -------------------------------------------------------------------
// Building Front Lawn Nameplates for Isometric Town Blocks
// -------------------------------------------------------------------
export const BUILDING_NAMEPLATES = [
  { id: 'bld_1', name: 'Magnetic Science Lab', icon: '🔬', x: 252, y: 172 },
  { id: 'bld_2', name: 'Central Hospital', icon: '🏥', x: 500, y: 172 },
  { id: 'bld_3', name: 'Corporate Sky Towers', icon: '🏢', x: 755, y: 172 },
  { id: 'bld_4', name: 'Cargo Logistics Hub', icon: '📦', x: 242, y: 326 },
  { id: 'bld_5', name: 'Grand Central Plaza', icon: '🏛️', x: 500, y: 326 },
  { id: 'bld_6', name: 'Innovation Tech Park', icon: '🌐', x: 765, y: 326 },
  { id: 'bld_7', name: 'Botanical Bio-Dome', icon: '🌿', x: 228, y: 484 },
  { id: 'bld_8', name: 'MagLev Train Depot', icon: '🚂', x: 500, y: 484 },
  { id: 'bld_9', name: 'Destination Terminal', icon: '🎯', x: 785, y: 484 },
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
// Realistic Classic High-Voltage Electric Arc & Tesla Lightning Synthesizer
// -------------------------------------------------------------------
export function playElectricLightningSound(duration = 2.3) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Master Gain & Limiter Envelope
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.linearRampToValueAtTime(0.75, now + 0.04);
    masterGain.gain.setValueAtTime(0.65, now + duration - 0.25);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Distortion WaveShaper for authentic vintage electrical arc saturation
    const waveShaper = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      // Hyperbolic distortion curve for rich electrical harmonics
      curve[i] = Math.tanh(x * 2.8);
    }
    waveShaper.curve = curve;
    waveShaper.oversample = '4x';

    // 1. Initial High-Voltage Arc Strike (Sharp "SNAP / ZAP" Transient)
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    const snapFilter = ctx.createBiquadFilter();

    snapOsc.type = 'sawtooth';
    snapOsc.frequency.setValueAtTime(3200, now);
    snapOsc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

    snapFilter.type = 'bandpass';
    snapFilter.frequency.setValueAtTime(3500, now);
    snapFilter.frequency.exponentialRampToValueAtTime(450, now + 0.12);
    snapFilter.Q.setValueAtTime(4.5, now);

    snapGain.gain.setValueAtTime(0.9, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    snapOsc.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(masterGain);

    snapOsc.start(now);
    snapOsc.stop(now + 0.15);

    // 2. FM-Modulated Jacob's Ladder Electric Arc Carrier (Classic Buzzing)
    // Carrier: 110Hz (Dual 55Hz / 110Hz harmonics)
    const carrierOsc = ctx.createOscillator();
    carrierOsc.type = 'sawtooth';
    carrierOsc.frequency.setValueAtTime(110, now);

    // FM Modulator: Creates rapid, fluttering electrical plasma instability
    const modOsc = ctx.createOscillator();
    const modGain = ctx.createGain();
    modOsc.type = 'sawtooth';
    modOsc.frequency.setValueAtTime(42, now);
    modOsc.frequency.linearRampToValueAtTime(68, now + duration * 0.5);
    modOsc.frequency.linearRampToValueAtTime(35, now + duration);

    modGain.gain.setValueAtTime(65, now);
    modGain.gain.linearRampToValueAtTime(95, now + duration * 0.5);
    modGain.gain.linearRampToValueAtTime(40, now + duration);

    modOsc.connect(carrierOsc.frequency);

    // Secondary sub-octave buzz (55Hz mains sub)
    const subOsc = ctx.createOscillator();
    subOsc.type = 'square';
    subOsc.frequency.setValueAtTime(55, now);

    // Resonance Bandpass for electrical bite
    const arcFilter = ctx.createBiquadFilter();
    arcFilter.type = 'bandpass';
    arcFilter.frequency.setValueAtTime(850, now);
    arcFilter.Q.setValueAtTime(3.2, now);

    const arcGain = ctx.createGain();
    arcGain.gain.setValueAtTime(0.55, now);

    carrierOsc.connect(arcFilter);
    subOsc.connect(arcFilter);
    arcFilter.connect(waveShaper);
    waveShaper.connect(arcGain);
    arcGain.connect(masterGain);

    carrierOsc.start(now);
    subOsc.start(now);
    modOsc.start(now);
    carrierOsc.stop(now + duration);
    subOsc.stop(now + duration);
    modOsc.stop(now + duration);

    // 3. Continuous Stochastic Micro-Spark Static Crackling (Continuous Sizzle)
    const sparkBufferSize = Math.floor(ctx.sampleRate * duration);
    const sparkBuffer = ctx.createBuffer(1, sparkBufferSize, ctx.sampleRate);
    const sparkData = sparkBuffer.getChannelData(0);
    for (let i = 0; i < sparkBufferSize; i++) {
      // Stochastic electric pulses: sparse, high-amplitude spikes
      const r = Math.random();
      if (r > 0.96) {
        sparkData[i] = (Math.random() * 2 - 1) * 0.95;
      } else if (r > 0.91) {
        sparkData[i] = (Math.random() * 2 - 1) * 0.45;
      } else {
        sparkData[i] = 0;
      }
    }

    const sparkSource = ctx.createBufferSource();
    sparkSource.buffer = sparkBuffer;

    const sparkFilter = ctx.createBiquadFilter();
    sparkFilter.type = 'highpass';
    sparkFilter.frequency.setValueAtTime(1800, now);
    sparkFilter.Q.setValueAtTime(2.0, now);

    const sparkGain = ctx.createGain();
    sparkGain.gain.setValueAtTime(0.42, now);
    sparkGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    sparkSource.connect(sparkFilter);
    sparkFilter.connect(sparkGain);
    sparkGain.connect(masterGain);

    sparkSource.start(now);
    sparkSource.stop(now + duration);

    // 4. Resonant High-Voltage Sizzle (2.8 kHz Bandpass Shimmer)
    const sizzleOsc = ctx.createOscillator();
    const sizzleFilter = ctx.createBiquadFilter();
    const sizzleGain = ctx.createGain();

    sizzleOsc.type = 'sawtooth';
    sizzleOsc.frequency.setValueAtTime(280, now);

    sizzleFilter.type = 'bandpass';
    sizzleFilter.frequency.setValueAtTime(2800, now);
    sizzleFilter.Q.setValueAtTime(5.0, now);

    sizzleGain.gain.setValueAtTime(0.2, now);

    sizzleOsc.connect(sizzleFilter);
    sizzleFilter.connect(sizzleGain);
    sizzleGain.connect(masterGain);

    sizzleOsc.start(now);
    sizzleOsc.stop(now + duration);

    masterGain.connect(ctx.destination);

  } catch (err) {}
}

// Backward-compatibility aliases
export const playRealisticTrainSound = playElectricLightningSound;
export const playElectricZapSound = playElectricLightningSound;

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
          <circle cx="19" cy="0" r={3 * pulse} fill="#FACC15" stroke="#FFFFFF" strokeWidth="1" style={{ filter: 'drop-shadow(0 0 6px #FACC15)' }} />
          <circle cx="19" cy="0" r="1.3" fill="#FFFFFF" />
        </g>
      </g>
    </g>
  );
};

// -------------------------------------------------------------------
// 4. Miniature Isometric Electric Pole Sprite (Starting, Destination, and Possible Next Nodes)
// -------------------------------------------------------------------
const ElectricPoleSprite = ({ 
  x, 
  y, 
  isConnected, 
  isStart,
  isTarget, 
  isCurrent, 
  isActiveMovingTarget,
  now, 
  onClick 
}) => {
  const isSpecial = isStart || isTarget;

  // If not a connected node, not the moving target, and not start/target milestone, do not render
  if (!isConnected && !isActiveMovingTarget && !isSpecial) {
    return null;
  }

  // Sizing & scaling: Start and Destination poles are slightly bigger (1.35x)
  const scale = isSpecial ? 1.35 : 1.0;

  return (
    <g 
      transform={`translate(${x}, ${y}) scale(${scale})`}
      onClick={onClick}
      style={{ cursor: isConnected ? 'pointer' : 'default' }}
    >
      {/* 1. Ground Footprint Shadow */}
      <ellipse
        cx="0"
        cy="2"
        rx={isSpecial ? 9 : 7}
        ry={isSpecial ? 3.8 : 3}
        fill="rgba(15, 23, 42, 0.45)"
        style={{ filter: 'blur(0.8px)' }}
      />

      {/* 2. Metallic Base Anchor Plate */}
      <rect
        x={isSpecial ? "-5.5" : "-4.5"}
        y="-1"
        width={isSpecial ? "11" : "9"}
        height={isSpecial ? "2.8" : "2.5"}
        rx="1"
        fill="#334155"
        stroke="#1E293B"
        strokeWidth="0.5"
      />
      <circle cx="-2.5" cy="0.2" r="0.5" fill="#94A3B8" />
      <circle cx="2.5" cy="0.2" r="0.5" fill="#94A3B8" />

      {/* 3. Small Isometric Steel Pole / Pylon Mast */}
      <g>
        {/* Tapered Mast Column */}
        <polygon
          points="-2,-1 2,-1 1,-19 -1,-19"
          fill="url(#poleSteelGrad)"
          stroke="#1E293B"
          strokeWidth="0.5"
        />

        {/* Chiseled Center Highlight Ridge */}
        <line x1="0" y1="-1" x2="0" y2="-19" stroke="rgba(255,255,255,0.35)" strokeWidth="0.4" />

        {/* Dual Ceramic Insulator Crossarms */}
        <line x1="-5" y1="-13" x2="5" y2="-13" stroke="#475569" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="-4.2" cy="-13" r="1.1" fill="#D97706" stroke="#78350F" strokeWidth="0.3" />
        <circle cx="4.2" cy="-13" r="1.1" fill="#D97706" stroke="#78350F" strokeWidth="0.3" />

        {/* Tesla Induction Ring Torus */}
        <ellipse
          cx="0"
          cy="-19"
          rx="3.2"
          ry="1.6"
          fill="#475569"
          stroke="#1E293B"
          strokeWidth="0.5"
        />

        {/* Top Glowing Yellow Light & Emitter Lamp */}
        <g pointerEvents="none">
          {/* Ambient Warm Yellow Radial Glow (Extra bright & large for start/destination) */}
          <circle
            cx="0"
            cy="-21"
            r={isSpecial ? (13 + Math.sin(now * 0.007) * 2.5) : (6 + Math.sin(now * 0.008) * 0.8)}
            fill={isSpecial ? "rgba(250, 204, 21, 0.65)" : "rgba(250, 204, 21, 0.45)"}
            style={{ filter: isSpecial ? 'blur(3px)' : 'blur(1.5px)' }}
          />

          {isSpecial && (
            <circle
              cx="0"
              cy="-21"
              r={7.5 + Math.sin(now * 0.012) * 1.5}
              fill="rgba(254, 240, 138, 0.8)"
              style={{ filter: 'blur(1.5px)' }}
            />
          )}

          {/* Luminous Yellow Light Bulb Core */}
          <circle
            cx="0"
            cy="-21"
            r={isSpecial ? 4.2 : 3.2}
            fill="url(#yellowLightBulbGrad)"
            stroke={isSpecial ? "#FFFFFF" : "#F59E0B"}
            strokeWidth={isSpecial ? "0.9" : "0.6"}
            style={{ filter: isSpecial ? 'drop-shadow(0 0 6px #FACC15)' : 'drop-shadow(0 0 4px #FACC15)' }}
          />

          {/* White-Hot Filament Glint */}
          <circle cx="0" cy="-21" r={isSpecial ? 1.8 : 1.3} fill="#FFFFFF" />
          <circle cx="-0.8" cy="-21.8" r={isSpecial ? 0.9 : 0.6} fill="#FFFFFF" opacity="0.9" />

          {/* Continuous Pulsing Wave Ring for Start / Destination */}
          {isSpecial && (
            <circle
              cx="0"
              cy="-21"
              r={6 + ((now * 0.012) % 7)}
              fill="none"
              stroke="#FEF08A"
              strokeWidth="0.8"
              opacity={1 - ((now * 0.012) % 7) / 7}
            />
          )}
        </g>
      </g>

      {/* Milestone Badge on Top of Start / Destination Pole */}
      {isStart && (
        <g transform="translate(0, -32)" pointerEvents="none">
          <rect x="-24" y="-6.5" width="48" height="13" rx="6.5" fill="#064E3B" stroke="#34D399" strokeWidth="1.1" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
          <text x="0" y="3" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="900" fontFamily="system-ui, sans-serif">
            START 🚩
          </text>
        </g>
      )}

      {isTarget && (
        <g transform="translate(0, -32)" pointerEvents="none">
          <rect x="-35" y="-6.5" width="70" height="13" rx="6.5" fill="#78350F" stroke="#FACC15" strokeWidth="1.2" style={{ filter: 'drop-shadow(0 2px 5px rgba(245,158,11,0.5))' }} />
          <text x="0" y="3" textAnchor="middle" fill="#FEF08A" fontSize="6.8" fontWeight="900" fontFamily="system-ui, sans-serif">
            DESTINATION 🎯
          </text>
        </g>
      )}
    </g>
  );
};

// -------------------------------------------------------------------
// 5. Realistic Yellow Electrifying Lightning Energy Line (Pulls the Train)
// -------------------------------------------------------------------
const ElectricLightningTether = ({ poleX, poleY, trainX, trainY, trainRotation, isDest, now }) => {
  // Start from top emitter of target electric pole (adjusted for larger destination pole)
  const x1 = poleX;
  const y1 = isDest ? poleY - 28.3 : poleY - 21;

  // End at front magnetic receiver sensor of leading train locomotive
  const x2 = trainX + Math.cos(trainRotation) * 33;
  const y2 = trainY + Math.sin(trainRotation) * 33;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);

  if (dist < 6) return null;

  const ux = dx / dist;
  const uy = dy / dist;
  const nx = -uy;
  const ny = ux;

  // Generate 8-segment procedural crackling lightning path
  const numSegs = 8;
  const mainPoints = [`${x1.toFixed(1)},${y1.toFixed(1)}`];
  const forkPoints1 = [];

  for (let i = 1; i < numSegs; i++) {
    const t = i / numSegs;
    // High-frequency animated chaotic lightning jitter
    const noise = Math.sin(now * 0.05 + i * 3.7) * 0.55 + Math.sin(now * 0.11 + i * 7.1) * 0.45;
    const envelope = Math.sin(t * Math.PI);
    const maxDisplace = Math.min(7, dist * 0.08) * envelope;
    const offset = noise * maxDisplace;

    const px = x1 + ux * (dist * t) + nx * offset;
    const py = y1 + uy * (dist * t) + ny * offset;
    mainPoints.push(`${px.toFixed(1)},${py.toFixed(1)}`);

    // Micro forked branch in the middle
    if (i === 3 || i === 4) {
      const forkOffset = offset + (Math.sin(now * 0.08 + i) * 6 + 4);
      forkPoints1.push(`${(x1 + ux * (dist * t) + nx * forkOffset).toFixed(1)},${(y1 + uy * (dist * t) + ny * forkOffset).toFixed(1)}`);
    }
  }
  mainPoints.push(`${x2.toFixed(1)},${y2.toFixed(1)}`);

  const mainPath = `M ${mainPoints.join(' L ')}`;

  // Streaming magnetic electric energy particles (Flowing from Pole -> Train Nose to signify PULL)
  const particles = [];
  const numParticles = 6;
  for (let i = 0; i < numParticles; i++) {
    // Flowing gracefully from 0 (pole) to 1 (train)
    const pT = ((now * 0.0012 + i / numParticles) % 1);
    const pNoise = Math.sin(now * 0.03 + i * 2.1) * 3 * Math.sin(pT * Math.PI);
    const px = x1 + ux * (dist * pT) + nx * pNoise;
    const py = y1 + uy * (dist * pT) + ny * pNoise;
    const pr = 1.8 + Math.sin(pT * Math.PI) * 1.8;
    const opacity = Math.sin(pT * Math.PI);
    particles.push({ px, py, pr, opacity, key: i });
  }

  return (
    <g pointerEvents="none">
      {/* 1. Luminous Soft Yellow Atmospheric Glow Tube */}
      <path
        d={mainPath}
        fill="none"
        stroke="#F59E0B"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
        style={{ filter: 'blur(2px)' }}
      />

      {/* 2. Secondary Energetic Yellow Lightning Core Arc */}
      <path
        d={mainPath}
        fill="none"
        stroke="#FACC15"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 0 3px #FACC15)' }}
      />

      {/* 3. Micro Forked Branch Bolts */}
      {forkPoints1.length > 0 && (
        <path
          d={`M ${mainPoints[2]} L ${forkPoints1.join(' L ')}`}
          fill="none"
          stroke="#FEF08A"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.75"
        />
      )}

      {/* 4. White-Hot Plasma Filament Line */}
      <path
        d={mainPath}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />

      {/* 5. Streaming Magnetic Flow Particles */}
      {particles.map(p => (
        <circle
          key={p.key}
          cx={p.px}
          cy={p.py}
          r={p.pr}
          fill="#FFFFFF"
          stroke="#FEF08A"
          strokeWidth="0.6"
          opacity={p.opacity}
          style={{ filter: 'drop-shadow(0 0 3px #FACC15)' }}
        />
      ))}

      {/* 6. Train Nose Receiver Ionization Corona Ring */}
      <circle
        cx={x2}
        cy={y2}
        r={4 + Math.sin(now * 0.03) * 1.5}
        fill="rgba(250, 204, 21, 0.4)"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        style={{ filter: 'drop-shadow(0 0 5px #FACC15)' }}
      />
      <circle cx={x2} cy={y2} r="1.5" fill="#FFFFFF" />

      {/* 7. Pole Top Emitter High-Voltage Spark Burst */}
      <circle
        cx={x1}
        cy={y1}
        r={3.5 + Math.sin(now * 0.025) * 1.2}
        fill="rgba(254, 240, 138, 0.6)"
        stroke="#FFFFFF"
        strokeWidth="1"
        style={{ filter: 'drop-shadow(0 0 4px #F59E0B)' }}
      />
    </g>
  );
};

// -------------------------------------------------------------------
// 6. MAIN INTERACTIVE MAZE COMPONENT (SVG/DOM LAYERED ARCHITECTURE)
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
  const [traversedSegments, setTraversedSegments] = useState([]);
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
  
  // Smooth Slow Stately Speed: 2300ms per segment for majestic magnetic pull dynamics
  const MOVE_DURATION = 2300;

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
    setTraversedSegments([]);

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

    // Play high-volume realistic train sound & electric zap immediately when movement starts
    playRealisticTrainSound();
    playElectricZapSound();

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
          const segFromX = animFromRef.current.x;
          const segFromY = animFromRef.current.y;

          if (Math.hypot(finalX - segFromX, finalY - segFromY) > 2) {
            setTraversedSegments(prev => {
              const alreadyHas = prev.some(s =>
                (Math.hypot(s.x1 - segFromX, s.y1 - segFromY) < 3 && Math.hypot(s.x2 - finalX, s.y2 - finalY) < 3) ||
                (Math.hypot(s.x1 - finalX, s.y1 - finalY) < 3 && Math.hypot(s.x2 - segFromX, s.y2 - segFromY) < 3)
              );
              if (alreadyHas) return prev;
              return [...prev, { x1: segFromX, y1: segFromY, x2: finalX, y2: finalY, id: `${segFromX}_${segFromY}_${finalX}_${finalY}` }];
            });
          }

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

      {/* 1. Mission Briefing Pop-up */}
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

          {/* Electric Pole Gradients */}
          <linearGradient id="poleSteelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="30%" stopColor="#94A3B8" />
            <stop offset="70%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <radialGradient id="poleEmitterGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FEF08A" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>

          {/* Glowing Yellow Light Bulb Gradient */}
          <radialGradient id="yellowLightBulbGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FEF08A" />
            <stop offset="75%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>

          {/* Lightning Gradients */}
          <radialGradient id="yellowLightningGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#FACC15" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
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

        {/* 1b. Building Front Lawn Nameplates */}
        <g pointerEvents="none">
          {BUILDING_NAMEPLATES.map((bld) => (
            <g key={bld.id} transform={`translate(${bld.x}, ${bld.y})`}>
              {/* Ground Anchor Shadow */}
              <ellipse cx="0" cy="8" rx="34" ry="3.5" fill="rgba(15, 23, 42, 0.4)" style={{ filter: 'blur(1px)' }} />
              
              {/* Lawn Stake Post */}
              <line x1="0" y1="2" x2="0" y2="8" stroke="#334155" strokeWidth="1.5" />
              
              {/* Nameplate Badge Plate */}
              <rect
                x="-54"
                y="-8"
                width="108"
                height="15"
                rx="7.5"
                fill="rgba(15, 23, 42, 0.88)"
                stroke="#38BDF8"
                strokeWidth="1"
                style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))' }}
              />
              
              {/* Icon */}
              <text x="-44" y="3" fontSize="8">{bld.icon}</text>
              
              {/* Building Name Text */}
              <text
                x="-33"
                y="3"
                textAnchor="start"
                fill="#F8FAFC"
                fontSize="6.8"
                fontWeight="800"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="0.02em"
              >
                {bld.name}
              </text>
            </g>
          ))}
        </g>

        {/* 2. White Dotted Path Line Strictly Confined to Traversed Railway Tracks */}
        <g pointerEvents="none">
          {/* Completed Track Segments */}
          {traversedSegments.map((seg) => (
            <g key={seg.id}>
              {/* Soft luminous underlay */}
              <line
                x1={seg.x1}
                y1={seg.y1}
                x2={seg.x2}
                y2={seg.y2}
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth="6"
                strokeLinecap="round"
                style={{ filter: 'blur(2px)' }}
              />
              {/* Crisp High-Contrast White Dotted Line strictly on tracks */}
              <line
                x1={seg.x1}
                y1={seg.y1}
                x2={seg.x2}
                y2={seg.y2}
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeDasharray="4 8"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.9))' }}
              />
            </g>
          ))}

          {/* Active Currently Traversed Track Segment */}
          {trainState.isMoving && animFromRef.current && (
            <g key="live-active-track-segment">
              <line
                x1={animFromRef.current.x}
                y1={animFromRef.current.y}
                x2={trainState.x}
                y2={trainState.y}
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth="6"
                strokeLinecap="round"
                style={{ filter: 'blur(2px)' }}
              />
              <line
                x1={animFromRef.current.x}
                y1={animFromRef.current.y}
                x2={trainState.x}
                y2={trainState.y}
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeDasharray="4 8"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.9))' }}
              />
            </g>
          )}
        </g>

        {/* 3. Interactive Electric Poles (Starting, Destination, and Possible Next Nodes) */}
        {WAYPOINT_NODES.map((node) => {
          const isConnected = NODES_MAP[currentNodeIdRef.current]?.neighbors.includes(node.id);
          const isCurrent = currentNodeIdRef.current === node.id;
          const isVisited = visitedHistory.includes(node.id);
          const isStart = node.id === currentMission.start;
          const isTarget = node.id === targetPoint.id;
          const isActiveMovingTarget = trainState.isMoving && animToRef.current && (animToRef.current.x === node.x && animToRef.current.y === node.y);

          return (
            <ElectricPoleSprite
              key={node.id}
              x={node.x}
              y={node.y}
              isConnected={isConnected}
              isActiveMovingTarget={isActiveMovingTarget}
              isStart={isStart}
              isCurrent={isCurrent}
              isVisited={isVisited}
              isTarget={isTarget}
              now={now}
              onClick={() => isConnected && navigateToNode(node.id)}
            />
          );
        })}

        {/* 4. Active Yellow Electrifying Lightning Energy Line Pulling the Train */}
        {trainState.isMoving && animToRef.current && (
          <ElectricLightningTether
            poleX={animToRef.current.x}
            poleY={animToRef.current.y}
            trainX={trainState.x}
            trainY={trainState.y}
            trainRotation={trainState.rotation}
            isDest={animToRef.current.x === targetPoint.x && animToRef.current.y === targetPoint.y}
            now={now}
          />
        )}

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
