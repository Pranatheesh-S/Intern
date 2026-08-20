import React, { useState, useRef, useEffect } from 'react';
import townMapStraightFig from './assets/town_map_straight_3d.jpg';

import person3d from './assets/person_3d.png';

/* ═══════════════════════════════════════════════════════════════════════
   3D TOWN MAP EXPLORER  —  Realistic Person Walker & Traffic
   
   Features:
   - Photorealistic 3D Person Walker responding to Direction Controls.
   - Auto-moving Sedan & Taxi cruising in straight directions within lanes.
   - Strict Road-Locked Grid: moves ONLY on visible asphalt road corridors.
   - Zero overlap onto buildings or static structures.
   ═══════════════════════════════════════════════════════════════════════ */

const VIEW_W = 1400;
const VIEW_H = 760;

/* ── 1. PLACES CONFIG (Strictly on Asphalt Road Corridors) ─────────── */
const PLACES = [
  { id: 'RS', x: 340, y: 255, name: 'Railway Station', full: 'Central Junction Railway Station', icon: '🚂', type: 'station', start: true, blurb: 'Express rail terminal. Trains depart and arrive here.' },
  { id: 'AP', x: 690, y: 255, name: 'Apartments', full: 'Sunview Heights Residency', icon: '🏢', type: 'apartment', blurb: 'Multi-story residential apartment towers.' },
  { id: 'PG', x: 990, y: 255, name: 'Public Garden', full: 'Rosewood Botanical Garden', icon: '🌳', type: 'garden', blurb: 'Botanical flora, flower beds and walking paths.' },
  { id: 'HO', x: 445, y: 380, name: 'Hospital', full: 'City Care Hospital', icon: '🏥', type: 'hospital', blurb: '24/7 emergency care, doctors and ambulance bay.' },
  { id: 'NP', x: 690, y: 505, name: 'Town Hall', full: 'Civic Nagar Panchayat Town Hall', icon: '🏛️', type: 'civic', blurb: 'Municipal council and public administrative office.' },
  { id: 'BK', x: 920, y: 505, name: 'Bank', full: 'Apex National Bank', icon: '🏦', type: 'bank', goal: true, blurb: 'Treasury, currency exchange and banking vaults.' },
  { id: 'SC', x: 445, y: 620, name: 'School', full: 'Greenwood Public School', icon: '🏫', type: 'school', blurb: 'Primary & high school with student playground.' },
  { id: 'MK', x: 690, y: 740, name: 'Market', full: 'Janata Central Bazaar', icon: '🛍️', type: 'market', blurb: 'Daily fresh fruits, vegetables and grocery stalls.' },
  { id: 'MU', x: 920, y: 620, name: 'Museum', full: 'Heritage Antiquities Museum', icon: '🏛️', type: 'museum', blurb: 'Classical historical museum with ancient sculptures.' },

  { id: 'E1', x: 165, y: 255, name: 'Empty Road', full: 'Road Intersection', icon: '🛣️', type: 'empty', blurb: 'Just an empty road intersection.' },
  { id: 'E2', x: 445, y: 255, name: 'Empty Road', full: 'Road Intersection', icon: '🛣️', type: 'empty', blurb: 'Just an empty road intersection.' },
  { id: 'E3', x: 920, y: 255, name: 'Empty Road', full: 'Road Intersection', icon: '🛣️', type: 'empty', blurb: 'Just an empty road intersection.' },
  { id: 'E4', x: 1210, y: 255, name: 'Empty Road', full: 'Road Intersection', icon: '🛣️', type: 'empty', blurb: 'Just an empty road intersection.' },
  { id: 'E5', x: 165, y: 505, name: 'Empty Road', full: 'Road Intersection', icon: '🛣️', type: 'empty', blurb: 'Just an empty road intersection.' },
  { id: 'E6', x: 445, y: 505, name: 'Empty Road', full: 'Road Intersection', icon: '🛣️', type: 'empty', blurb: 'Just an empty road intersection.' },
  { id: 'E7', x: 1210, y: 505, name: 'Empty Road', full: 'Road Intersection', icon: '🛣️', type: 'empty', blurb: 'Just an empty road intersection.' },
  { id: 'E8', x: 165, y: 740, name: 'Empty Road', full: 'Road Intersection', icon: '🛣️', type: 'empty', blurb: 'Just an empty road intersection.' },
  { id: 'E9', x: 445, y: 740, name: 'Empty Road', full: 'Road Intersection', icon: '🛣️', type: 'empty', blurb: 'Just an empty road intersection.' },
  { id: 'E10', x: 920, y: 740, name: 'Empty Road', full: 'Road Intersection', icon: '🛣️', type: 'empty', blurb: 'Just an empty road intersection.' },
  { id: 'E11', x: 1210, y: 740, name: 'Empty Road', full: 'Road Intersection', icon: '🛣️', type: 'empty', blurb: 'Just an empty road intersection.' },

  { id: 'L1', x: 60, y: 255, name: 'Road End', full: 'West Edge', icon: '🚧', type: 'empty', blurb: 'End of the road.' },
  { id: 'L2', x: 60, y: 505, name: 'Road End', full: 'West Edge', icon: '🚧', type: 'empty', blurb: 'End of the road.' },
  { id: 'L3', x: 60, y: 740, name: 'Road End', full: 'West Edge', icon: '🚧', type: 'empty', blurb: 'End of the road.' },

  { id: 'R1', x: 1340, y: 255, name: 'Road End', full: 'East Edge', icon: '🚧', type: 'empty', blurb: 'End of the road.' },
  { id: 'R2', x: 1340, y: 505, name: 'Road End', full: 'East Edge', icon: '🚧', type: 'empty', blurb: 'End of the road.' },
  { id: 'R3', x: 1340, y: 740, name: 'Road End', full: 'East Edge', icon: '🚧', type: 'empty', blurb: 'End of the road.' },

  { id: 'T1', x: 165, y: 100, name: 'Road End', full: 'North Edge', icon: '🚧', type: 'empty', blurb: 'End of the road.' },
  { id: 'T2', x: 445, y: 100, name: 'Road End', full: 'North Edge', icon: '🚧', type: 'empty', blurb: 'End of the road.' },
  { id: 'T3', x: 690, y: 100, name: 'Road End', full: 'North Edge', icon: '🚧', type: 'empty', blurb: 'End of the road.' },
  { id: 'T4', x: 920, y: 100, name: 'Road End', full: 'North Edge', icon: '🚧', type: 'empty', blurb: 'End of the road.' },
  { id: 'T5', x: 1210, y: 100, name: 'Road End', full: 'North Edge', icon: '🚧', type: 'empty', blurb: 'End of the road.' },
];

const BY_ID = {};
PLACES.forEach(p => { BY_ID[p.id] = p; });

const nodeXY = (id) => ({ x: BY_ID[id].x, y: BY_ID[id].y });

/* ── 2. ADJACENCY & ROAD PATHS ─────────────────────────────────────── */
const ADJ = {
  // Row 1
  L1: { E: 'E1' },
  E1: { W: 'L1', E: 'RS', N: 'T1', S: 'E5' },
  RS: { W: 'E1', E: 'E2' },
  E2: { W: 'RS', E: 'AP', N: 'T2', S: 'HO' },
  AP: { W: 'E2', E: 'E3', N: 'T3', S: 'NP' },
  E3: { W: 'AP', E: 'PG', N: 'T4', S: 'BK' },
  PG: { W: 'E3', E: 'E4' },
  E4: { W: 'PG', E: 'R1', N: 'T5', S: 'E7' },
  R1: { W: 'E4' },

  // Row 2
  L2: { E: 'E5' },
  E5: { W: 'L2', E: 'E6', N: 'E1', S: 'E8' },
  E6: { W: 'E5', E: 'NP', N: 'HO', S: 'SC' },
  NP: { W: 'E6', E: 'BK', N: 'AP', S: 'MK' },
  BK: { W: 'NP', E: 'E7', N: 'E3', S: 'MU' },
  E7: { W: 'BK', E: 'R2', N: 'E4', S: 'E11' },
  R2: { W: 'E7' },

  // Row 3
  L3: { E: 'E8' },
  E8: { W: 'L3', E: 'E9', N: 'E5' },
  E9: { W: 'E8', E: 'MK', N: 'SC' },
  MK: { W: 'E9', E: 'E10', N: 'NP' },
  E10: { W: 'MK', E: 'E11', N: 'MU' },
  E11: { W: 'E10', E: 'R3', N: 'E7' },
  R3: { W: 'E11' },

  // Vertical connections that are places
  T1: { S: 'E1' },
  T2: { S: 'E2' },
  T3: { S: 'AP' },
  T4: { S: 'E3' },
  T5: { S: 'E4' },

  HO: { N: 'E2', S: 'E6' },
  SC: { N: 'E6', S: 'E9' },
  MU: { N: 'BK', S: 'E10' }
};

function getRoadPoints(a, b) {
  const ax = BY_ID[a].x, ay = BY_ID[a].y;
  const bx = BY_ID[b].x, by = BY_ID[b].y;
  return [[ax, ay], [bx, by]];
}

const DIR_WORD = { N: 'North', S: 'South', E: 'East', W: 'West' };

/* ── 3. STREET NAME PLATES ─────────────────────────────────────────── */
const STREETS = [
  { id: 's1', name: 'NORTHERN AVE', x: 570, y: 255, angle: 0 },
  { id: 's2', name: 'NORTHERN AVE', x: 1080, y: 255, angle: 0 },
  { id: 's3', name: 'CENTRAL BLVD', x: 570, y: 505, angle: 0 },
  { id: 's4', name: 'CENTRAL BLVD', x: 1080, y: 505, angle: 0 },
  { id: 's5', name: 'SOUTHERN ROAD', x: 570, y: 740, angle: 0 },
  { id: 's6', name: 'WEST LANE', x: 165, y: 380, angle: -90 },
  { id: 's7', name: 'HOSPITAL WAY', x: 445, y: 380, angle: -90 },
  { id: 's8', name: 'TOWN HALL ST', x: 700, y: 380, angle: -90 },
  { id: 's9', name: 'BANK ROAD', x: 955, y: 380, angle: -90 },
  { id: 's10', name: 'EAST LANE', x: 1210, y: 380, angle: -90 },
];

function streetBetween(aId, bId) {
  const ax = BY_ID[aId].x, ay = BY_ID[aId].y;
  const bx = BY_ID[bId].x, by = BY_ID[bId].y;
  if (ay === by) {
    if (ay === 255) return 'NORTHERN AVE';
    if (ay === 505) return 'CENTRAL BLVD';
    if (ay === 740) return 'SOUTHERN ROAD';
  }
  if (ax === bx) {
    if (ax === 165) return 'WEST LANE';
    if (ax === 445) return 'HOSPITAL WAY';
    if (ax === 700) return 'TOWN HALL ST';
    if (ax === 955) return 'BANK ROAD';
    if (ax === 1210) return 'EAST LANE';
  }
  return 'the road';
}

/* ── 4. REALISTIC ARTICULATED 3D HUMAN EXPLORER (NATURAL BIPEDAL WALK) ── */
const Realistic3DPerson = ({ x, y, angle, isWalking }) => {
  const facingLeft = angle === 'W' || angle === 270;
  
  return (
    <g transform={`translate(${x},${y})`} pointerEvents="none">
      {/* 1. Dynamic Dual Foot Shadows */}
      <g opacity="0.85">
        {/* Main Ambient Ground Shadow */}
        <ellipse cx="0" cy="3" rx="20" ry="7" fill="rgba(0,0,0,0.35)" style={{ filter: 'blur(3px)' }} />
        {/* Left Foot Contact Shadow */}
        <ellipse
          cx="-8"
          cy="3"
          rx="9"
          ry="4"
          fill="rgba(0,0,0,0.75)"
          style={{
            filter: 'blur(1px)',
            animation: isWalking ? 'leftFootShadow 0.65s infinite ease-in-out' : 'none'
          }}
        />
        {/* Right Foot Contact Shadow */}
        <ellipse
          cx="8"
          cy="3"
          rx="9"
          ry="4"
          fill="rgba(0,0,0,0.75)"
          style={{
            filter: 'blur(1px)',
            animation: isWalking ? 'rightFootShadow 0.65s infinite ease-in-out' : 'none'
          }}
        />
      </g>

      {/* 2. Asphalt Footstep Dust / Stepping Ripples */}
      {isWalking && (
        <g opacity="0.6">
          <circle cx="-10" cy="3" r="5" fill="#FDE68A" style={{ filter: 'blur(1.5px)', animation: 'stepDustLeft 0.65s infinite ease-out' }} />
          <circle cx="10" cy="3" r="5" fill="#FDE68A" style={{ filter: 'blur(1.5px)', animation: 'stepDustRight 0.65s infinite ease-out' }} />
        </g>
      )}

      {/* 3. GPS Location Beacon / Target Ground Ring */}
      {!isWalking && (
        <circle
          cx="0"
          cy="0"
          r="22"
          fill="none"
          stroke="#F59E0B"
          style={{ animation: 'pulseRing 1.8s infinite cubic-bezier(0.2, 0.8, 0.2, 1)' }}
        />
      )}
      <circle
        cx="0"
        cy="0"
        r="18"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="1.8"
        opacity="0.8"
        strokeDasharray={isWalking ? '4 2' : 'none'}
      />
      <g transform={`rotate(${{ N: 0, E: 90, S: 180, W: 270 }[angle] || 0})`}>
        <polygon
          points="0,-26 5,-18 -5,-18"
          fill="#F59E0B"
          style={{
            filter: 'drop-shadow(0 0 5px #F59E0B)',
            animation: isWalking ? 'dirArrowBob 0.3s infinite ease-in-out' : 'none'
          }}
        />
      </g>

      {/* 4. Articulated Skeletal Animated Human Character */}
      <g
        transform={`translate(0, 2) scale(${facingLeft ? -1.08 : 1.08}, 1.08)`}
        style={{
          transformOrigin: '0 0',
        }}
      >
        <svg
          x="-35"
          y="-85"
          width="70"
          height="90"
          viewBox="-35 -85 70 90"
          overflow="visible"
        >
          <defs>
            <linearGradient id="skinGrad3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FDBA74" />
            </linearGradient>
            <linearGradient id="hairGrad3D" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5C381E" />
              <stop offset="100%" stopColor="#2E1B0E" />
            </linearGradient>
            <linearGradient id="jacketGrad3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="60%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
            <linearGradient id="jacketInner3D" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
            <linearGradient id="pantsGrad3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="shoeGrad3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="70%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <linearGradient id="backpackGrad3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
          </defs>

          {/* ── BACK ARM ── */}
          <g
            style={{
              transformOrigin: '-5px -52px',
              animation: isWalking ? 'backArmSwing 0.65s infinite ease-in-out' : 'none'
            }}
          >
            <rect x="-10" y="-52" width="7" height="15" rx="3.5" fill="url(#jacketGrad3D)" />
            <g style={{ transformOrigin: '-7px -38px', animation: isWalking ? 'backForearmBend 0.65s infinite ease-in-out' : 'none' }}>
              <rect x="-9.5" y="-38" width="6" height="14" rx="3" fill="#B45309" />
              <circle cx="-6.5" cy="-23" r="3.5" fill="url(#skinGrad3D)" />
            </g>
          </g>

          {/* ── BACKPACK ── */}
          <g style={{ animation: isWalking ? 'torsoBob 0.65s infinite ease-in-out' : 'idleBreathing 2s infinite ease-in-out' }}>
            <rect x="-17" y="-62" width="10" height="24" rx="4" fill="url(#backpackGrad3D)" stroke="#0369A1" strokeWidth="0.8" />
            <rect x="-19" y="-65" width="12" height="7" rx="3" fill="#0284C7" />
            <rect x="-16" y="-52" width="4" height="11" rx="2" fill="#F59E0B" opacity="0.9" />
          </g>

          {/* ── BACK / LEFT LEG ── */}
          <g
            style={{
              transformOrigin: '-3px -30px',
              animation: isWalking ? 'leftLegSwing 0.65s infinite ease-in-out' : 'none'
            }}
          >
            <rect x="-6" y="-30" width="7" height="16" rx="3.5" fill="url(#pantsGrad3D)" />
            <g style={{ transformOrigin: '-2.5px -15px', animation: isWalking ? 'leftKneeBend 0.65s infinite ease-in-out' : 'none' }}>
              <rect x="-5.5" y="-15" width="6" height="15" rx="3" fill="#1E293B" />
              <g transform="translate(-6.5, -2)">
                <path d="M 0 0 L 11 0 Q 14 0 14 -3 L 13 -6 Q 10 -6 8 -4 L 2 -4 Z" fill="url(#shoeGrad3D)" />
                <rect x="-1" y="-1" width="16" height="2.5" rx="1" fill="#FFFFFF" />
                <line x1="5" y1="-4" x2="8" y2="-4" stroke="#FFFFFF" strokeWidth="1" />
              </g>
            </g>
          </g>

          {/* ── FRONT / RIGHT LEG ── */}
          <g
            style={{
              transformOrigin: '4px -30px',
              animation: isWalking ? 'rightLegSwing 0.65s infinite ease-in-out' : 'none'
            }}
          >
            <rect x="1" y="-30" width="7.5" height="16" rx="3.5" fill="url(#pantsGrad3D)" />
            <g style={{ transformOrigin: '4.5px -15px', animation: isWalking ? 'rightKneeBend 0.65s infinite ease-in-out' : 'none' }}>
              <rect x="1.5" y="-15" width="6.5" height="15" rx="3" fill="#1E293B" />
              <g transform="translate(0.5, -2)">
                <path d="M 0 0 L 11 0 Q 14 0 14 -3 L 13 -6 Q 10 -6 8 -4 L 2 -4 Z" fill="url(#shoeGrad3D)" />
                <rect x="-1" y="-1" width="16" height="2.5" rx="1" fill="#FFFFFF" />
                <line x1="5" y1="-4" x2="8" y2="-4" stroke="#FFFFFF" strokeWidth="1" />
              </g>
            </g>
          </g>

          {/* ── TORSO & HEAD ── */}
          <g
            style={{
              transformOrigin: '0 -30px',
              animation: isWalking
                ? 'torsoBob 0.65s infinite ease-in-out'
                : 'idleBreathing 2.2s infinite ease-in-out'
            }}
          >
            {/* Belt */}
            <rect x="-8" y="-33" width="16" height="6" rx="2" fill="#0F172A" />
            <rect x="-2" y="-33" width="4" height="4" rx="1" fill="#F59E0B" />

            {/* Jacket Body */}
            <path
              d="M -9 -33 L -11 -56 Q -11 -60 -6 -61 L 6 -61 Q 11 -60 11 -56 L 9 -33 Z"
              fill="url(#jacketGrad3D)"
              stroke="#92400E"
              strokeWidth="0.8"
            />
            <path d="M -3 -61 L 0 -33 L 3 -61 Z" fill="url(#jacketInner3D)" />
            <line x1="0" y1="-61" x2="0" y2="-33" stroke="#FFFFFF" strokeWidth="1" />
            <polygon points="-6,-61 0,-54 6,-61 8,-64 -8,-64" fill="#B45309" />

            {/* Neck */}
            <rect x="-3" y="-66" width="6" height="6" rx="2" fill="url(#skinGrad3D)" />

            {/* 3D Head */}
            <g transform="translate(0, -68)">
              <circle cx="0" cy="-6" r="9.5" fill="url(#skinGrad3D)" />
              <circle cx="-9" cy="-6" r="2.5" fill="url(#skinGrad3D)" />
              <circle cx="9" cy="-6" r="2.5" fill="url(#skinGrad3D)" />

              <ellipse cx="3.5" cy="-6.5" rx="1.5" ry="2.2" fill="#1E293B" />
              <circle cx="4.2" cy="-7.2" r="0.6" fill="#FFFFFF" />
              <path d="M 1.5 -10 Q 4 -11.5 6.5 -10" fill="none" stroke="#5C381E" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 2 -3.5 Q 4.5 -1.5 7 -3.5" fill="none" stroke="#C2410C" strokeWidth="1.2" strokeLinecap="round" />
              <ellipse cx="5" cy="-3.8" rx="2" ry="1.2" fill="#FCA5A5" opacity="0.6" />

              <path
                d="M -10 -7 C -11 -16 -4 -19 3 -18 C 9 -17 12 -12 11 -7 C 9 -8 7 -6 7 -4 C 5 -10 0 -10 -2 -8 C -4 -11 -9 -9 -10 -7 Z"
                fill="url(#hairGrad3D)"
              />
              <path d="M 3 -18 Q 8 -19 11 -13 Q 8 -13 6 -11 Z" fill="#78350F" />
            </g>

            {/* ── FRONT ARM ── */}
            <g
              style={{
                transformOrigin: '7px -52px',
                animation: isWalking ? 'frontArmSwing 0.65s infinite ease-in-out' : 'none'
              }}
            >
              <rect x="3.5" y="-52" width="7.5" height="15" rx="3.75" fill="url(#jacketGrad3D)" />
              <g style={{ transformOrigin: '7px -38px', animation: isWalking ? 'frontForearmBend 0.65s infinite ease-in-out' : 'none' }}>
                <rect x="4" y="-38" width="6.5" height="14" rx="3.2" fill="#D97706" />
                <circle cx="7.2" cy="-23" r="3.8" fill="url(#skinGrad3D)" />
                <g transform="translate(6, -24) rotate(-15)">
                  <rect x="-3" y="-3" width="7" height="9" rx="1.5" fill="#0F172A" stroke="#F59E0B" strokeWidth="0.8" />
                  <rect x="-2" y="-2" width="5" height="5" fill="#F59E0B" opacity="0.9" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </g>
    </g>
  );
};



/* ── 6. WRONG DIRECTION POPUP ──────────────────────────────────────── */
const WrongDirPopup = ({ show, direction }) => {
  if (!show) return null;
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: 'calc(50% - 155px)',
      transform: 'translate(-50%, -50%)',
      zIndex: 999,
      background: 'linear-gradient(145deg, #1E293B, #0F172A)',
      border: '2px solid #EF4444',
      borderRadius: '16px',
      padding: '16px 24px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 20px rgba(239,68,68,0.25)',
      textAlign: 'center',
      minWidth: '220px',
    }}>
      <div style={{ fontSize: '24px', marginBottom: '4px' }}>⚠️</div>
      <div style={{ fontSize: '15px', fontWeight: 900, color: '#FCA5A5', fontFamily: 'Space Grotesk, sans-serif' }}>
        NO ROAD {direction.toUpperCase()}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginTop: '4px' }}>
        You must walk along asphalt road corridors and sidewalks.
      </div>
    </div>
  );
};

const EmptyRoadPopup = ({ show }) => {
  if (!show) return null;
  return (
    <div style={{
      position: 'absolute',
      top: '28%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 999,
      background: 'linear-gradient(145deg, #1E293B, #0F172A)',
      border: '2px solid #EF4444',
      borderRadius: '16px',
      padding: '16px 22px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 20px rgba(239,68,68,0.3)',
      textAlign: 'center',
      minWidth: '260px',
      pointerEvents: 'none'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '4px' }}>⚠️</div>
      <div style={{ fontSize: '15px', fontWeight: 900, color: '#FCA5A5', fontFamily: 'Space Grotesk, sans-serif' }}>
        WRONG DIRECTION!
      </div>
      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginTop: '4px' }}>
        No buildings nearby on this road.
      </div>
      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
        Turn back and navigate toward a landmark!
      </div>
    </div>
  );
};

/* ── 7. MAIN TOWN MAP 3D COMPONENT ─────────────────────────────────── */
const TownMap3DExplorer = ({ onComplete, onNext }) => {
  const START = 'RS';
  const GOAL = 'BK';

  const [cur, setCur] = useState(START);
  const [personPos, setPersonPos] = useState(nodeXY(START));
  const [isWalking, setIsWalking] = useState(false);
  const [heading, setHeading] = useState('E');
  const [activeStreet, setActiveStreet] = useState('M.G. ROAD');
  const [trail, setTrail] = useState([nodeXY(START)]);
  const [visited, setVisited] = useState({ [START]: true });
  const [log, setLog] = useState([{ text: `Ready at ${BY_ID[START].name}. Walk to ${BY_ID[GOAL].name}!`, ok: true }]);
  const [won, setWon] = useState(false);
  const [wrongDir, setWrongDir] = useState(null);
  const [emptyWarn, setEmptyWarn] = useState(false);

  /* ── ZOOM, PAN & MAP-ALONE FULLSCREEN STATE ── */
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMapOnlyFullscreen, setIsMapOnlyFullscreen] = useState(false);

  /* ── DRAGGABLE & MINIMIZABLE DIRECTION CONTROLS STATE ── */
  const viewportRef = useRef(null);
  const [dpadPos, setDpadPos] = useState(null);
  const [isDpadDragging, setIsDpadDragging] = useState(false);
  const [dpadDragOffset, setDpadDragOffset] = useState({ x: 0, y: 0 });
  const [isDpadMinimized, setIsDpadMinimized] = useState(false);
  const [isSidebarDpadMinimized, setIsSidebarDpadMinimized] = useState(false);

  const handleZoomIn = () => setZoom(z => Math.min(3.5, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => {
    setZoom(z => {
      const next = Math.max(0.65, +(z - 0.25).toFixed(2));
      return next;
    });
  };
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const centerOnPlayer = () => {
    setPan({
      x: (VIEW_W / 2 - personPos.x) * 0.85,
      y: (VIEW_H / 2 - personPos.y) * 0.85
    });
  };
  const toggleMapOnlyFullscreen = () => {
    setIsMapOnlyFullscreen(v => !v);
  };

  const handleMouseDown = (e) => {
    if (!isDpadDragging) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1 && !isDpadDragging) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleWheel = (e) => {
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    setZoom(z => Math.max(0.65, Math.min(3.5, +(z * zoomFactor).toFixed(2))));
  };

  const startDpadDrag = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const vp = viewportRef.current;
    if (!vp) return;
    const rect = vp.getBoundingClientRect();
    const currentX = dpadPos ? dpadPos.x : (rect.width - 205);
    const currentY = dpadPos ? dpadPos.y : (rect.height - (isDpadMinimized ? 65 : 225));
    setIsDpadDragging(true);
    setDpadDragOffset({
      x: e.clientX - rect.left - currentX,
      y: e.clientY - rect.top - currentY
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
    if (isDpadDragging && viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left - dpadDragOffset.x;
      const rawY = e.clientY - rect.top - dpadDragOffset.y;
      const dpadW = isDpadMinimized ? 170 : 190;
      const dpadH = isDpadMinimized ? 50 : 230;
      const clampedX = Math.max(10, Math.min(rect.width - dpadW - 10, rawX));
      const clampedY = Math.max(10, Math.min(rect.height - dpadH - 10, rawY));
      setDpadPos({ x: clampedX, y: clampedY });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches.length === 1) {
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDpadDragging(false);
  };

  const logRef = useRef(null);
  const rafRef = useRef(null);


  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  /* ── KEYBOARD ARROW CONTROLS (FULLSCREEN & NORMAL) ── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        walkTo('N');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        walkTo('S');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        walkTo('W');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        walkTo('E');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cur, isWalking, won]);

  const walkTo = (dir) => {
    if (isWalking || won) return;
    const targetId = ADJ[cur] && ADJ[cur][dir];
    if (!targetId) {
      setWrongDir(DIR_WORD[dir]);
      setTimeout(() => setWrongDir(null), 1400);
      return;
    }

    const target = BY_ID[targetId];
    const street = streetBetween(cur, targetId);
    const points = getRoadPoints(cur, targetId);

    setIsWalking(true);
    setHeading(dir);
    setActiveStreet(street);
    setWrongDir(null);

    const startPos = { ...personPos };
    const endPos = nodeXY(targetId);
    const duration = 1100;
    const startT = performance.now();

    const step = (now) => {
      const elapsed = now - startT;
      const t = Math.min(1, elapsed / duration);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const cx = points[0][0] + (points[1][0] - points[0][0]) * ease;
      const cy = points[0][1] + (points[1][1] - points[0][1]) * ease;
      setPersonPos({ x: cx, y: cy });

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setPersonPos(endPos);
        setIsWalking(false);
        setCur(targetId);
        setTrail(tr => [...tr, endPos]);
        setVisited(v => ({ ...v, [targetId]: true }));
        setLog(l => [...l, { text: `Walked ${DIR_WORD[dir]} along ${street} to ${target.name}.`, ok: true }]);

        if (target.type === 'empty') {
          setEmptyWarn(true);
          setTimeout(() => setEmptyWarn(false), 2800);
          setLog(l => [...l, { text: `⚠️ Wrong Direction! No buildings nearby on this road. Turn back or navigate toward a landmark!`, ok: false }]);
        }

        if (targetId === GOAL) {
          setWon(true);
          setLog(l => [...l, { text: `🎉 Reached the ${BY_ID[GOAL].name}! Navigation successfully completed.`, ok: true }]);
          if (onComplete) onComplete();
        }
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  const reset = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setCur(START);
    setPersonPos(nodeXY(START));
    setIsWalking(false);
    setHeading('E');
    setActiveStreet('M.G. ROAD');
    setTrail([nodeXY(START)]);
    setVisited({ [START]: true });
    setWon(false);
    setWrongDir(null);
    setLog([{ text: `Returned to ${BY_ID[START].name}. Reach the ${BY_ID[GOAL].name}!`, ok: true }]);
  };

  const curPlace = BY_ID[cur];
  const available = {
    N: ADJ[cur]?.N ? BY_ID[ADJ[cur].N] : null,
    S: ADJ[cur]?.S ? BY_ID[ADJ[cur].S] : null,
    E: ADJ[cur]?.E ? BY_ID[ADJ[cur].E] : null,
    W: ADJ[cur]?.W ? BY_ID[ADJ[cur].W] : null,
  };

  const DirBtn = ({ dir, label, arrow, gridArea, isCompact }) => {
    const nb = available[dir];
    const off = !nb || isWalking || won;
    return (
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          walkTo(dir);
        }}
        disabled={off}
        title={nb ? `Walk ${DIR_WORD[dir]} to ${nb.name}` : `No road going ${DIR_WORD[dir]}`}
        style={{
          gridArea,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: isCompact ? '0px' : '2px',
          border: off ? '1.5px dashed #334155' : '2px solid #F59E0B',
          background: off
            ? 'rgba(15,23,42,0.6)'
            : 'linear-gradient(145deg, #D97706 0%, #B45309 100%)',
          color: off ? '#64748B' : '#FFFFFF',
          opacity: off ? 0.35 : 1,
          borderRadius: '12px',
          padding: isCompact ? '6px 2px' : '10px 4px',
          cursor: off ? 'not-allowed' : 'pointer',
          pointerEvents: off ? 'none' : 'auto',
          fontWeight: 800,
          transition: 'all 0.15s ease',
          boxShadow: off ? 'none' : '0 4px 14px rgba(217,119,6,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ fontSize: isCompact ? '11px' : '13px', lineHeight: 1 }}>{arrow}</span>
          <span style={{ fontSize: isCompact ? '13px' : '15px', fontWeight: 900, fontFamily: 'Space Grotesk, sans-serif' }}>{label}</span>
        </div>
        {!isCompact && (
          <span style={{ fontSize: '9px', fontWeight: 700, opacity: 0.9, maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {nb ? nb.name : '—'}
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: isMapOnlyFullscreen ? 'fixed' : 'relative',
        inset: isMapOnlyFullscreen ? 0 : 'auto',
        zIndex: isMapOnlyFullscreen ? 99999 : 1,
        width: isMapOnlyFullscreen ? '100vw' : '100%',
        height: isMapOnlyFullscreen ? '100vh' : '100%',
        display: 'flex',
        padding: isMapOnlyFullscreen ? 0 : '14px',
        gap: isMapOnlyFullscreen ? 0 : '14px',
        overflow: 'hidden',
        background: isMapOnlyFullscreen ? '#090D16' : '#0B1120',
        fontFamily: '"Space Grotesk", sans-serif',
        boxSizing: 'border-box'
      }}
    >
      <style>{`
        /* ── NATURAL BIPEDAL WALKING ANIMATION SKELETON ── */

        /* 1. Torso vertical bounce + slight forward tilt */
        @keyframes torsoBob {
          0%   { transform: translateY(0px) rotate(-1deg); }
          25%  { transform: translateY(-5px) rotate(1deg); }
          50%  { transform: translateY(0px) rotate(-1deg); }
          75%  { transform: translateY(-5px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(-1deg); }
        }

        /* 2. Left Leg Hip Rotation */
        @keyframes leftLegSwing {
          0%   { transform: rotate(-30deg); }
          25%  { transform: rotate(-4deg); }
          50%  { transform: rotate(30deg); }
          75%  { transform: rotate(4deg); }
          100% { transform: rotate(-30deg); }
        }

        /* 3. Left Knee Bend */
        @keyframes leftKneeBend {
          0%   { transform: rotate(8deg); }
          25%  { transform: rotate(42deg); }
          50%  { transform: rotate(4deg); }
          75%  { transform: rotate(0deg); }
          100% { transform: rotate(8deg); }
        }

        /* 4. Right Leg Hip Rotation (180deg out of phase) */
        @keyframes rightLegSwing {
          0%   { transform: rotate(30deg); }
          25%  { transform: rotate(4deg); }
          50%  { transform: rotate(-30deg); }
          75%  { transform: rotate(-4deg); }
          100% { transform: rotate(30deg); }
        }

        /* 5. Right Knee Bend */
        @keyframes rightKneeBend {
          0%   { transform: rotate(4deg); }
          25%  { transform: rotate(0deg); }
          50%  { transform: rotate(8deg); }
          75%  { transform: rotate(42deg); }
          100% { transform: rotate(4deg); }
        }

        /* 6. Front Arm Swing */
        @keyframes frontArmSwing {
          0%   { transform: rotate(-28deg); }
          50%  { transform: rotate(28deg); }
          100% { transform: rotate(-28deg); }
        }
        @keyframes frontForearmBend {
          0%   { transform: rotate(-10deg); }
          50%  { transform: rotate(-32deg); }
          100% { transform: rotate(-10deg); }
        }

        /* 7. Back Arm Swing */
        @keyframes backArmSwing {
          0%   { transform: rotate(28deg); }
          50%  { transform: rotate(-28deg); }
          100% { transform: rotate(28deg); }
        }
        @keyframes backForearmBend {
          0%   { transform: rotate(-32deg); }
          50%  { transform: rotate(-10deg); }
          100% { transform: rotate(-32deg); }
        }

        /* 8. Foot Shadow Pulsing with Step Contact */
        @keyframes leftFootShadow {
          0%   { transform: scale(0.65); opacity: 0.35; }
          50%  { transform: scale(1.15); opacity: 0.85; }
          100% { transform: scale(0.65); opacity: 0.35; }
        }
        @keyframes rightFootShadow {
          0%   { transform: scale(1.15); opacity: 0.85; }
          50%  { transform: scale(0.65); opacity: 0.35; }
          100% { transform: scale(1.15); opacity: 0.85; }
        }

        /* 9. Footstep Dust Ripples */
        @keyframes stepDustLeft {
          0%, 45% { r: 2px; opacity: 0; }
          50%     { r: 5px; opacity: 0.8; }
          75%     { r: 14px; opacity: 0; }
          100%    { r: 2px; opacity: 0; }
        }
        @keyframes stepDustRight {
          0%      { r: 5px; opacity: 0.8; }
          25%     { r: 14px; opacity: 0; }
          50%, 95%{ r: 2px; opacity: 0; }
          100%    { r: 5px; opacity: 0.8; }
        }

        /* 10. Idle Breathing */
        @keyframes idleBreathing {
          0%   { transform: translateY(0px) scale(1, 1); }
          50%  { transform: translateY(-2.5px) scale(0.99, 1.015); }
          100% { transform: translateY(0px) scale(1, 1); }
        }

        @keyframes pulseRing {
          0% { r: 18px; opacity: 0.85; stroke-width: 2.5px; }
          100% { r: 40px; opacity: 0; stroke-width: 0.5px; }
        }

        @keyframes dirArrowBob {
          0% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }
      `}</style>

      {/* ══════════ BOX 1: 3D MAP VIEWPORT (STANDALONE BOX) ══════════ */}
      <div
        ref={viewportRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
        style={{
          flex: 1,
          position: 'relative',
          minWidth: 0,
          background: '#090D16',
          borderRadius: isMapOnlyFullscreen ? 0 : '18px',
          border: isMapOnlyFullscreen ? 'none' : '2px solid rgba(245, 158, 11, 0.28)',
          boxShadow: isMapOnlyFullscreen ? 'none' : '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >

        <WrongDirPopup show={!!wrongDir} direction={wrongDir} />
        <EmptyRoadPopup show={emptyWarn} />

        {/* ── FLOATING ZOOM & FULLSCREEN TOOLBAR (MAP INSPECTION) ── */}
        <div style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          zIndex: 120,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '12px',
          padding: '6px 10px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
        }}>
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            style={{
              background: '#1E293B',
              border: '1px solid #334155',
              color: '#F59E0B',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
          >
            +
          </button>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#F1F5F9', minWidth: '40px', textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            style={{
              background: '#1E293B',
              border: '1px solid #334155',
              color: '#F59E0B',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
          >
            -
          </button>
          <button
            type="button"
            onClick={handleResetView}
            title="Reset Zoom & Pan (Fit to Viewport)"
            style={{
              background: '#1E293B',
              border: '1px solid #334155',
              color: '#94A3B8',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
          >
            ⟲
          </button>

          <button
            type="button"
            onClick={centerOnPlayer}
            title="Focus & Center Map on Player"
            style={{
              background: '#1E293B',
              border: '1px solid #334155',
              color: '#F59E0B',
              cursor: 'pointer',
              padding: '0 8px',
              height: '32px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s'
            }}
          >
            📍 Focus
          </button>

          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 2px' }} />

          {/* Fullscreen Map Toggle (Shows Map Alone) */}
          <button
            type="button"
            onClick={toggleMapOnlyFullscreen}
            title={isMapOnlyFullscreen ? "Exit Map Full Screen" : "View Map Alone in Full Screen"}
            style={{
              background: isMapOnlyFullscreen ? '#EF4444' : '#F59E0B',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.15s'
            }}
          >
            {isMapOnlyFullscreen ? '✕ Exit Fullscreen' : '⛶ Fullscreen Map'}
          </button>
        </div>

        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 100,
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '999px',
          padding: '4px 12px',
          color: '#94A3B8',
          fontSize: '10.5px',
          fontWeight: 700,
          pointerEvents: 'none'
        }}>
          🖐️ Click & drag to move map • Scroll to zoom
        </div>

        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{
              transformOrigin: `${VIEW_W / 2}px ${VIEW_H / 2}px`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out'
            }}
          >
            <defs>
              <linearGradient id="headlightBeam3D" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* ---------- 1. Map Background Image ---------- */}
            <image
              href={townMapStraightFig}
              x="0"
              y="0"
              width={VIEW_W}
              height={VIEW_H}
              preserveAspectRatio="none"
            />

            {/* ---------- 2. Street Name Badges ---------- */}
            <g id="ce-streets" pointerEvents="none">
              {STREETS.map(s => {
                const hot = activeStreet === s.name;
                const wdt = s.name.length * 6.6 + 18;
                return (
                  <g key={s.id} transform={`translate(${s.x},${s.y}) rotate(${s.angle})`}>
                    <rect
                      x={-wdt / 2}
                      y="-10"
                      width={wdt}
                      height="20"
                      rx="6"
                      fill={hot ? '#F59E0B' : 'rgba(15,23,42,0.85)'}
                      stroke={hot ? '#FFFFFF' : '#64748B'}
                      strokeWidth={hot ? 1.8 : 1}
                      style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.6))' }}
                    />
                    <text
                      x="0"
                      y="4.5"
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="800"
                      fill={hot ? '#1E293B' : '#E2E8F0'}
                      fontFamily="Space Grotesk, sans-serif"
                      letterSpacing="0.6px"
                    >
                      {s.name}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* ---------- 3. Clean Route Trail Ribbon ---------- */}
            {trail.length > 1 && (
              <>
                <polyline
                  points={trail.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.35"
                />
                <polyline
                  points={trail.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                />
              </>
            )}

            {/* ---------- 4. Clean Waypoints on Asphalt ---------- */}
            {PLACES.map(p => {
              const isCur = cur === p.id;
              const isGoal = p.id === GOAL;
              const isSeen = visited[p.id];
              const isEmpty = p.type === 'empty';

              if (isEmpty) {
                return (
                  <g key={p.id} transform={`translate(${p.x},${p.y})`} pointerEvents="none">
                    <circle
                      cx="0"
                      cy="0"
                      r={isCur ? 10 : 5}
                      fill={isCur ? '#F59E0B' : isSeen ? '#64748B' : '#334155'}
                      stroke="#FFFFFF"
                      strokeWidth={isCur ? 2 : 1}
                      opacity={isCur ? 1 : 0.45}
                    />
                  </g>
                );
              }

              return (
                <g key={p.id} transform={`translate(${p.x},${p.y})`} pointerEvents="none">
                  <circle
                    cx="0"
                    cy="0"
                    r={isCur ? 13 : isGoal ? 12 : 7}
                    fill={isCur ? '#F59E0B' : isGoal ? '#10B981' : isSeen ? '#475569' : '#1E293B'}
                    stroke="#FFFFFF"
                    strokeWidth={isCur ? 2.5 : 1.5}
                    opacity={isCur || isGoal ? 1 : 0.75}
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                  />
                  <circle cx="0" cy="0" r={isCur ? 4.5 : 2.5} fill="#FFFFFF" />
                </g>
              );
            })}

            {/* ---------- 7. Realistic 3D Person Walker (Player Directions) ---------- */}
            <Realistic3DPerson
              x={personPos.x}
              y={personPos.y}
              angle={heading}
              isWalking={isWalking}
            />
          </g>
        </svg>

        {/* ── DRAGGABLE & MINIMIZABLE FLOATING DIRECTION CONTROLS (FULLSCREEN) ── */}
        {isMapOnlyFullscreen && (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: dpadPos ? `${dpadPos.x}px` : 'auto',
              top: dpadPos ? `${dpadPos.y}px` : 'auto',
              right: dpadPos ? 'auto' : '20px',
              bottom: dpadPos ? 'auto' : '20px',
              zIndex: 160,
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(14px)',
              border: '2px solid rgba(245, 158, 11, 0.45)',
              borderRadius: isDpadMinimized ? '999px' : '20px',
              padding: isDpadMinimized ? '8px 14px' : '10px 14px 12px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.75), 0 0 20px rgba(217, 119, 6, 0.3)',
              display: 'flex',
              flexDirection: isDpadMinimized ? 'row' : 'column',
              alignItems: 'center',
              gap: isDpadMinimized ? '10px' : '8px',
              userSelect: 'none',
              cursor: isDpadDragging ? 'grabbing' : 'default',
              transition: isDpadDragging ? 'none' : 'box-shadow 0.2s ease, border-radius 0.2s ease'
            }}
          >
            {/* Drag Handle & Header */}
            <div
              onMouseDown={startDpadDrag}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: isDpadMinimized ? 'auto' : '100%',
                gap: '8px',
                cursor: 'grab',
                padding: '2px 0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '11px', color: '#64748B', cursor: 'grab', letterSpacing: '-1px' }}>⋮⋮</span>
                <span style={{ fontSize: '10px', fontWeight: 900, color: '#F59E0B', letterSpacing: '0.6px' }}>
                  🧭 {isDpadMinimized ? 'CONTROLS' : 'DIRECTION CONTROLS'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {!isDpadMinimized && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); reset(); }}
                    title="Reset Position"
                    style={{
                      background: 'transparent',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#94A3B8',
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '2px 5px',
                      cursor: 'pointer'
                    }}
                  >
                    ↺
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsDpadMinimized(v => !v); }}
                  title={isDpadMinimized ? 'Expand Direction Controls' : 'Minimize Direction Controls'}
                  style={{
                    background: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '6px',
                    color: '#E2E8F0',
                    fontSize: '10px',
                    fontWeight: 900,
                    padding: '2px 6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isDpadMinimized ? '➕' : '➖'}
                </button>
              </div>
            </div>

            {/* Expanded D-Pad Content */}
            {!isDpadMinimized && (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 48px)',
                  gridTemplateRows: 'repeat(3, 44px)',
                  gridTemplateAreas: `
                    ". N ."
                    "W . E"
                    ". S ."
                  `,
                  gap: '6px'
                }}>
                  <DirBtn dir="N" label="N" arrow="▲" gridArea="N" isCompact />
                  <DirBtn dir="W" label="W" arrow="◀" gridArea="W" isCompact />
                  <DirBtn dir="E" label="E" arrow="▶" gridArea="E" isCompact />
                  <DirBtn dir="S" label="S" arrow="▼" gridArea="S" isCompact />
                </div>

                <div style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#F1F5F9',
                  textAlign: 'center',
                  background: 'rgba(30, 41, 59, 0.9)',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  maxWidth: '160px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  📍 {curPlace.name}
                </div>
              </>
            )}
          </div>
        )}

        {/* Bottom-Left Compass & Corridor HUD */}
        <div style={{
          position: 'absolute',
          bottom: isMapOnlyFullscreen ? '20px' : '14px',
          left: isMapOnlyFullscreen ? '20px' : '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(15,23,42,0.92)',
          border: '1px solid rgba(245,158,11,0.4)',
          borderRadius: '14px',
          padding: '8px 16px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          zIndex: 110
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="34" height="34" viewBox="-20 -20 40 40">
              <circle r="18" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
              <g transform={`rotate(${{ N: 0, E: 90, S: 180, W: 270 }[heading]})`} style={{ transition: 'transform 0.25s ease' }}>
                <polygon points="0,-14 4,0 0,-1" fill="#EF4444" />
                <polygon points="0,-14 -4,0 0,-1" fill="#F87171" />
                <polygon points="0,14 4,0 0,1" fill="#94A3B8" />
                <polygon points="0,14 -4,0 0,1" fill="#CBD5E1" />
              </g>
            </svg>
            <div>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#94A3B8', letterSpacing: '1px' }}>HEADING</div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#F59E0B' }}>{DIR_WORD[heading].toUpperCase()}</div>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: '#334155' }} />

          <div>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#94A3B8', letterSpacing: '1px' }}>CORRIDOR</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#F1F5F9' }}>{activeStreet}</div>
          </div>
        </div>
      </div>

      {/* ══════════ BOX 2: DIRECTION & NAVIGATION CONTROL STATION (STANDALONE BOX) ══════════ */}
      <div style={{
        width: '300px',
        flexShrink: 0,
        height: '100%',
        background: 'linear-gradient(165deg, #1E293B 0%, #0F172A 100%)',
        borderRadius: '18px',
        border: '2px solid rgba(245, 158, 11, 0.22)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        display: isMapOnlyFullscreen ? 'none' : 'flex',
        flexDirection: 'column',
        padding: '10px 12px',
        gap: '8px',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        <div style={{
          background: won ? 'linear-gradient(145deg, #064E3B, #065F46)' : 'linear-gradient(145deg, #1E293B, #0F172A)',
          border: `1.5px solid ${won ? '#10B981' : '#F59E0B'}`, borderRadius: '12px', padding: '8px 10px'
        }}>
          <div style={{ fontSize: '9.5px', fontWeight: 900, color: won ? '#6EE7B7' : '#F59E0B', letterSpacing: '0.8px' }}>
            🎯 NAVIGATION MISSION
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC', marginTop: '3px', lineHeight: 1.35 }}>
            {won
              ? '🎉 Mission Complete! You reached the Bank.'
              : <>Walk from <b>Railway Station</b> to <b>Bank</b>.</>}
          </div>

          {won && onNext && (
            <button
              type="button"
              onClick={onNext}
              style={{
                marginTop: '8px',
                width: '100%',
                background: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '12px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
              }}
            >
              Continue to Map Questions ➔
            </button>
          )}
        </div>

        <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '8px 10px' }}>
          <div style={{ fontSize: '9px', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.8px' }}>📍 CURRENT LOCATION</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '20px' }}>{curPlace.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{curPlace.name}</div>
              <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{curPlace.full}</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '8px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isSidebarDpadMinimized ? '0' : '6px' }}>
            <span style={{ fontSize: '9px', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.8px' }}>🧭 DIRECTION CONTROLS</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <button
                type="button"
                onClick={reset}
                style={{
                  background: 'transparent', border: '1px solid #475569', borderRadius: '5px',
                  color: '#94A3B8', fontSize: '9px', fontWeight: 700, padding: '1px 5px', cursor: 'pointer'
                }}
              >
                ↺ Reset
              </button>
              <button
                type="button"
                onClick={() => setIsSidebarDpadMinimized(v => !v)}
                title={isSidebarDpadMinimized ? "Expand Controls" : "Minimize Controls"}
                style={{
                  background: '#0F172A', border: '1px solid #475569', borderRadius: '5px',
                  color: '#CBD5E1', fontSize: '9px', fontWeight: 700, padding: '1px 5px', cursor: 'pointer'
                }}
              >
                {isSidebarDpadMinimized ? '➕' : '➖'}
              </button>
            </div>
          </div>

          {!isSidebarDpadMinimized && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(3, 38px)',
              gridTemplateAreas: `
                ". N ."
                "W . E"
                ". S ."
              `,
              gap: '5px'
            }}>
              <DirBtn dir="N" label="N" arrow="▲" gridArea="N" isCompact />
              <DirBtn dir="W" label="W" arrow="◀" gridArea="W" isCompact />
              <DirBtn dir="E" label="E" arrow="▶" gridArea="E" isCompact />
              <DirBtn dir="S" label="S" arrow="▼" gridArea="S" isCompact />
            </div>
          )}
        </div>

        <div style={{ background: '#090D16', border: '1px solid #1E293B', borderRadius: '12px', padding: '8px 10px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ fontSize: '9px', fontWeight: 900, color: '#F59E0B', letterSpacing: '0.8px', marginBottom: '4px' }}>📋 GPS TRAVEL LOG</div>
          <div ref={logRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px', scrollbarWidth: 'none' }}>
            {log.map((l, i) => (
              <div key={i} style={{
                fontSize: '10.5px', lineHeight: 1.3, padding: '4px 6px', borderRadius: '5px',
                background: l.ok ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.15)',
                color: l.ok ? '#E2E8F0' : '#FCA5A5',
                borderLeft: `2.5px solid ${l.ok ? '#F59E0B' : '#EF4444'}`
              }}>
                {l.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TownMap3DExplorer;
