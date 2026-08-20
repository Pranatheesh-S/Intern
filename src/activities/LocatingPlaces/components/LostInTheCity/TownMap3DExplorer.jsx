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

/* ── 1. PLACES CONFIG (STRICTLY ROAD-LOCKED WITHIN ASPHALT LANES) ──────── */
const ROAD_X = {
  WEST_LANE: 50,      // West Lane (far left edge)
  HOSPITAL_WAY: 345,  // Hospital Way (between Railway Station/Hospital/School and Pond/Town Hall/Market)
  CIVIC_WAY: 500,     // Civic Way (Town Hall Plaza & Market Center)
  BANK_ROAD: 650,     // Bank Road (between Town Hall/Market and Bank/Museum)
  EAST_LANE: 955,     // East Lane (right side of Apex Bank and Museum)
  FAR_EAST: 1345,     // Far East Avenue
};

const ROAD_Y = {
  NORTH_AVE: 280,     // Northern Avenue running across top
  CENTRAL_BLVD: 505,  // Central Boulevard running across center
  SOUTHERN_RD: 735,   // Southern Road running along bottom
};

const PLACES = [
  // ── ROW 1: NORTHERN AVENUE (Y = 280) ──
  { id: 'W_N', x: ROAD_X.WEST_LANE, y: ROAD_Y.NORTH_AVE, name: 'West Dead End', full: 'Road Closure / Dead End', icon: '🚧', type: 'empty', blurb: 'Closed road perimeter.' },
  { id: 'RS', x: ROAD_X.HOSPITAL_WAY, y: ROAD_Y.NORTH_AVE, name: 'Railway Station', full: 'Central Junction Railway Station', icon: '🚂', type: 'station', start: true, blurb: 'Express rail terminal concourse along Northern Ave & Hospital Way.' },
  { id: 'AP', x: ROAD_X.CIVIC_WAY, y: ROAD_Y.NORTH_AVE, name: 'Apartments', full: 'Sunview Heights Residency', icon: '🏢', type: 'apartment', blurb: 'Multi-story residential apartment towers along Northern Ave.' },
  { id: 'PG', x: ROAD_X.EAST_LANE, y: ROAD_Y.NORTH_AVE, name: 'Public Garden', full: 'Rosewood Botanical Garden', icon: '🌳', type: 'garden', blurb: 'Botanical greenhouse and floral park along Northern Ave.' },
  { id: 'E_N', x: ROAD_X.FAR_EAST, y: ROAD_Y.NORTH_AVE, name: 'East Dead End', full: 'Road Closure / Dead End', icon: '🚧', type: 'empty', blurb: 'Closed road perimeter.' },

  // ── ROW 2: CENTRAL BOULEVARD (Y = 505) ──
  { id: 'W_C', x: ROAD_X.WEST_LANE, y: ROAD_Y.CENTRAL_BLVD, name: 'West Dead End', full: 'Road Closure / Dead End', icon: '🚧', type: 'empty', blurb: 'Closed road perimeter.' },
  { id: 'HO', x: ROAD_X.HOSPITAL_WAY, y: ROAD_Y.CENTRAL_BLVD, name: 'Hospital', full: 'City Care Hospital', icon: '🏥', type: 'hospital', blurb: '24/7 emergency trauma center at Central Blvd & Hospital Way.' },
  { id: 'NP', x: ROAD_X.CIVIC_WAY, y: ROAD_Y.CENTRAL_BLVD, name: 'Town Hall', full: 'Civic Nagar Panchayat Town Hall', icon: '🏛️', type: 'civic', blurb: 'Municipal civic council plaza at Central Blvd.' },
  { id: 'BK', x: ROAD_X.BANK_ROAD, y: ROAD_Y.CENTRAL_BLVD, name: 'Bank', full: 'Apex National Bank', icon: '🏦', type: 'bank', goal: true, blurb: 'Treasury & banking vaults at Central Blvd & Bank Road.' },
  { id: 'E_C', x: ROAD_X.EAST_LANE, y: ROAD_Y.CENTRAL_BLVD, name: 'East Dead End', full: 'Road Closure / Dead End', icon: '🚧', type: 'empty', blurb: 'Closed road perimeter.' },
  { id: 'FE_C', x: ROAD_X.FAR_EAST, y: ROAD_Y.CENTRAL_BLVD, name: 'Far East Dead End', full: 'Road Closure / Dead End', icon: '🚧', type: 'empty', blurb: 'Closed road perimeter.' },

  // ── ROW 3: SOUTHERN ROAD (Y = 735) ──
  { id: 'W_S', x: ROAD_X.WEST_LANE, y: ROAD_Y.SOUTHERN_RD, name: 'West Dead End', full: 'Road Closure / Dead End', icon: '🚧', type: 'empty', blurb: 'Closed road perimeter.' },
  { id: 'SC', x: ROAD_X.HOSPITAL_WAY, y: ROAD_Y.SOUTHERN_RD, name: 'School', full: 'Greenwood Public School', icon: '🏫', type: 'school', blurb: 'Primary & high school campus at Southern Road & Hospital Way.' },
  { id: 'MK', x: ROAD_X.CIVIC_WAY, y: ROAD_Y.SOUTHERN_RD, name: 'Market', full: 'Janata Central Bazaar', icon: '🛍️', type: 'market', blurb: 'Fresh daily bazaar and fruit market stalls on Southern Road.' },
  { id: 'MU', x: ROAD_X.BANK_ROAD, y: ROAD_Y.SOUTHERN_RD, name: 'Museum', full: 'Heritage Antiquities Museum', icon: '🏛️', type: 'museum', blurb: 'Classical historical museum on Southern Road & Bank Road.' },
  { id: 'E_S', x: ROAD_X.EAST_LANE, y: ROAD_Y.SOUTHERN_RD, name: 'East Dead End', full: 'Road Closure / Dead End', icon: '🚧', type: 'empty', blurb: 'Closed road perimeter.' },
  { id: 'FE_S', x: ROAD_X.FAR_EAST, y: ROAD_Y.SOUTHERN_RD, name: 'Far East Dead End', full: 'Road Closure / Dead End', icon: '🚧', type: 'empty', blurb: 'Closed road perimeter.' }
];

const BY_ID = {};
PLACES.forEach(p => { BY_ID[p.id] = p; });

const nodeXY = (id) => ({ x: BY_ID[id].x, y: BY_ID[id].y });

/* ── 2. ADJACENCY & ROAD PATHS (STRICTLY ON ASPHALT ROAD INTERSECTIONS) ── */
const ADJ = {
  // Row 1 (Northern Ave, Y = 280)
  W_N: { E: 'RS' },
  RS: { W: 'W_N', E: 'AP', S: 'HO' },
  AP: { W: 'RS', E: 'PG', S: 'NP' },
  PG: { W: 'AP', E: 'E_N', S: 'E_C' },
  E_N: { W: 'PG' },

  // Row 2 (Central Blvd, Y = 505)
  W_C: { E: 'HO', N: 'W_N', S: 'W_S' },
  HO: { W: 'W_C', E: 'NP', N: 'RS', S: 'SC' },
  NP: { W: 'HO', E: 'BK', N: 'AP', S: 'MK' },
  BK: { W: 'NP', E: 'E_C', S: 'MU' },
  E_C: { W: 'BK', E: 'FE_C', N: 'PG', S: 'E_S' },
  FE_C: { W: 'E_C', S: 'FE_S' },

  // Row 3 (Southern Road, Y = 735)
  W_S: { E: 'SC', N: 'W_C' },
  SC: { W: 'W_S', E: 'MK', N: 'HO' },
  MK: { W: 'SC', E: 'MU', N: 'NP' },
  MU: { W: 'MK', E: 'E_S', N: 'BK' },
  E_S: { W: 'MU', E: 'FE_S', N: 'E_C' },
  FE_S: { W: 'E_S', N: 'FE_C' }
};

function getRoadPoints(a, b) {
  const ax = BY_ID[a].x, ay = BY_ID[a].y;
  const bx = BY_ID[b].x, by = BY_ID[b].y;
  return [[ax, ay], [bx, by]];
}

const DIR_WORD = { N: 'North', S: 'South', E: 'East', W: 'West' };

/* ── 3. STREET NAME PLATES ─────────────────────────────────────────── */
const STREETS = [
  { id: 's1', name: 'NORTHERN AVE', x: 420, y: 280, angle: 0 },
  { id: 's2', name: 'NORTHERN AVE', x: 780, y: 280, angle: 0 },
  { id: 's3', name: 'CENTRAL BLVD', x: 420, y: 505, angle: 0 },
  { id: 's4', name: 'CENTRAL BLVD', x: 780, y: 505, angle: 0 },
  { id: 's5', name: 'SOUTHERN ROAD', x: 420, y: 735, angle: 0 },
  { id: 's6', name: 'SOUTHERN ROAD', x: 780, y: 735, angle: 0 },
  { id: 's7', name: 'WEST LANE', x: 50, y: 390, angle: -90 },
  { id: 's8', name: 'HOSPITAL WAY', x: 345, y: 390, angle: -90 },
  { id: 's9', name: 'BANK ROAD', x: 650, y: 620, angle: -90 },
  { id: 's10', name: 'EAST LANE', x: 955, y: 390, angle: -90 },
];

function streetBetween(aId, bId) {
  const ax = BY_ID[aId].x, ay = BY_ID[aId].y;
  const bx = BY_ID[bId].x, by = BY_ID[bId].y;
  if (ay === by) {
    if (ay === 280) return 'NORTHERN AVE';
    if (ay === 505) return 'CENTRAL BLVD';
    if (ay === 735) return 'SOUTHERN ROAD';
  }
  if (ax === bx) {
    if (ax === 50) return 'WEST LANE';
    if (ax === 345) return 'HOSPITAL WAY';
    if (ax === 500) return 'CIVIC WAY';
    if (ax === 650) return 'BANK ROAD';
    if (ax === 955) return 'EAST LANE';
    if (ax === 1345) return 'FAR EAST AVENUE';
  }
  return 'TOWN CORRIDOR';
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



/* ── 6. WRONG DIRECTION & DEAD END POPUPS ──────────────────────────── */
const WrongDirPopup = ({ show, direction }) => {
  if (!show) return null;
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: 'calc(50% - 150px)',
      transform: 'translate(-50%, -50%)',
      zIndex: 999,
      background: 'linear-gradient(145deg, #1E293B, #0F172A)',
      border: '2px solid #EF4444',
      borderRadius: '16px',
      padding: '16px 24px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 20px rgba(239,68,68,0.25)',
      textAlign: 'center',
      minWidth: '240px',
    }}>
      <div style={{ fontSize: '24px', marginBottom: '4px' }}>🚫</div>
      <div style={{ fontSize: '15px', fontWeight: 900, color: '#FCA5A5', fontFamily: 'Space Grotesk, sans-serif' }}>
        NO ROAD {direction.toUpperCase()}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginTop: '4px' }}>
        Road closed. You cannot walk through buildings.
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
      padding: '16px 24px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 25px rgba(239,68,68,0.35)',
      textAlign: 'center',
      minWidth: '280px',
      pointerEvents: 'none'
    }}>
      <div style={{ fontSize: '26px', marginBottom: '4px' }}>⚠️</div>
      <div style={{ fontSize: '15.5px', fontWeight: 900, color: '#FCA5A5', fontFamily: 'Space Grotesk, sans-serif' }}>
        WRONG DIRECTION!
      </div>
      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#F87171', marginTop: '4px' }}>
        Road Closure / Dead End ahead!
      </div>
      <div style={{ fontSize: '11.5px', color: '#CBD5E1', marginTop: '3px' }}>
        No buildings nearby. Turn back toward a landmark!
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
  const [visitedSequence, setVisitedSequence] = useState([START]);
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
        if (target.type !== 'empty') {
          setVisitedSequence(seq => seq.includes(targetId) ? seq : [...seq, targetId]);
        }
        setLog(l => [...l, { text: `Walked ${DIR_WORD[dir]} along ${street} to ${target.name}.`, ok: true }]);

        if (target.type === 'empty') {
          setEmptyWarn(true);
          setTimeout(() => setEmptyWarn(false), 3000);
          setLog(l => [...l, { text: `⚠️ Wrong Direction! Road closure / dead end ahead. No buildings nearby. Turn back toward a landmark!`, ok: false }]);
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
    setActiveStreet('NORTHERN AVE');
    setTrail([nodeXY(START)]);
    setVisited({ [START]: true });
    setVisitedSequence([START]);
    setWon(false);
    setWrongDir(null);
    setEmptyWarn(false);
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

        {/* ── PLACES VISITED BREADCRUMB BAR (TOP BAR WITHOUT OVERLAP) ── */}
        <div
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '12px',
            padding: '5px 12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            maxWidth: 'calc(100% - 410px)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
            <span style={{ fontSize: '11px' }}>📍</span>
            <span style={{ fontSize: '9.5px', fontWeight: 900, color: '#F59E0B', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              VISITED ({visitedSequence.filter(id => BY_ID[id] && BY_ID[id].type !== 'empty').length})
            </span>
            <span style={{ color: '#475569', fontSize: '11px' }}>|</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {visitedSequence.filter(id => BY_ID[id] && BY_ID[id].type !== 'empty').map((id, idx, arr) => {
              const p = BY_ID[id];
              const isLatest = id === cur;
              const isGoalNode = id === GOAL;
              return (
                <React.Fragment key={id}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: isLatest
                      ? 'linear-gradient(135deg, rgba(245,158,11,0.3) 0%, rgba(217,119,6,0.15) 100%)'
                      : 'rgba(30, 41, 59, 0.8)',
                    border: isLatest
                      ? '1.5px solid #F59E0B'
                      : (isGoalNode ? '1.5px solid #10B981' : '1px solid #334155'),
                    borderRadius: '7px',
                    padding: '2px 7px',
                    color: isLatest ? '#FDE68A' : (isGoalNode ? '#6EE7B7' : '#E2E8F0'),
                    fontSize: '10.5px',
                    fontWeight: 800
                  }}>
                    <span style={{ fontSize: '12px' }}>{p.icon}</span>
                    <span>{p.name}</span>
                  </div>
                  {idx < arr.length - 1 && (
                    <span style={{ color: '#F59E0B', fontSize: '8.5px', fontWeight: 900 }}>➔</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
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
