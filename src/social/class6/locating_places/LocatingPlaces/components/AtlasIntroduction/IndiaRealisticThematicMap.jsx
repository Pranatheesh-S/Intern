import React, { useMemo } from 'react';
import indiaPhysicalReliefImg from './assets/india_3d_physical_relief.jpg';
import indiaPlainsReliefImg from './assets/india_plains_3d_relief.jpg';
import indiaPlateausReliefImg from './assets/india_plateaus_3d_relief.jpg';
import indiaForestsMapImg from './assets/india_forests_3d_relief.jpg';
import indiaRiversMapImg from './assets/india_rivers_satellite_3d.jpg';
import indiaDesertsMapImg from './assets/india_deserts_straight_map.jpg';

// Exact calibrated landmark positions on 3D Physical Relief Map (1024 x 682 viewBox)
// Bounding box: 61°E–100°E longitude, 4°N–40°N latitude (top-down orthographic)
// Formula: x = ((lon - 61) / 39) * 1024,  y = (1 - ((lat - 4) / 36)) * 682
export const MOUNTAINS_LANDMARKS = {
  'k2': { x: 408, y: 61 },
  'nanga_parbat': { x: 357, y: 74 },
  'kullu_manali': { x: 425, y: 130 },
  'nanda_devi': { x: 498, y: 166 },
  'mount_everest': { x: 681, y: 211 },
  'kanchenjunga': { x: 713, y: 216 },
  'namcha_barwa': { x: 895, y: 180 },
  'saramati': { x: 894, y: 254 },
  'guru_shikhar': { x: 310, y: 274 },
  'dhupgarh': { x: 456, y: 316 },
  'mahendragiri': { x: 614, y: 382 },
  'dodabetta': { x: 414, y: 526 },
  'anamudi': { x: 422, y: 549 },
  'gangetic_plain': { x: 540, y: 255 },
  'punjab_plain': { x: 380, y: 180 },
  'brahmaputra_plain': { x: 830, y: 240 },
  'konkan_coast': { x: 370, y: 415 },
  'malabar_coast': { x: 385, y: 535 },
  'coromandel_coast': { x: 500, y: 520 },
  'sundarbans': { x: 740, y: 290 },
  'western_ghats_rainforest': { x: 385, y: 450 },
  'gir_forest': { x: 310, y: 345 },
  'kaziranga': { x: 850, y: 240 },
  'kaziranga_forest': { x: 850, y: 240 },
  'deccan_plateau': { x: 460, y: 450 },
  'malwa_plateau': { x: 415, y: 330 },
  'chota_nagpur': { x: 620, y: 320 },
  'meghalaya_plateau': { x: 820, y: 270 },
  'thar_desert': { x: 325, y: 265 },
  'rann_of_kutch': { x: 300, y: 320 },
  'cold_desert_ladakh': { x: 430, y: 80 }
};

// Exact calibrated landmark positions on 3D Forest Biomes Map (1024 x 682 viewBox)
export const FORESTS_LANDMARKS = {
  'himalayan_tropical_forests': { x: 370, y: 175 },
  'indo_gangetic_forests': { x: 530, y: 245 },
  'central_indian_forests': { x: 400, y: 345 },
  'western_ghats_rainforest': { x: 295, y: 430 },
  'south_indian_forests': { x: 330, y: 560 },
  'north_east_hill_forests': { x: 770, y: 265 },
  'sundarbans': { x: 700, y: 320 },
  'gir_forest': { x: 210, y: 330 }
};

export const RIVERS_LANDMARKS = {
  'river_ganga': { x: 530, y: 245 },
  'river_yamuna': { x: 415, y: 208 },
  'river_indus': { x: 310, y: 110 },
  'river_brahmaputra': { x: 780, y: 203 },
  'sundarbans_delta': { x: 716, y: 312 },
  'river_narmada': { x: 430, y: 335 },
  'river_tapi': { x: 350, y: 365 },
  'river_mahanadi': { x: 610, y: 355 },
  'river_godavari': { x: 490, y: 420 },
  'river_krishna': { x: 475, y: 440 },
  'river_kaveri': { x: 455, y: 520 },
  'river_sutlej': { x: 370, y: 165 },
  'river_chenab': { x: 320, y: 140 },
  'river_luni': { x: 295, y: 255 },
  'river_chambal': { x: 425, y: 275 },
  'river_kosi': { x: 650, y: 255 },
  'river_tungabhadra': { x: 415, y: 475 },
  'river_vaigai': { x: 445, y: 555 },
  'jog_falls': { x: 360, y: 490 },
};

export const PLATEAUS_LANDMARKS = {
  'deccan_plateau': { x: 460, y: 450 },
  'malwa_plateau': { x: 415, y: 330 },
  'chota_nagpur': { x: 620, y: 320 },
  'meghalaya_plateau': { x: 820, y: 270 }
};

export const DESERTS_LANDMARKS = {
  'thar_desert': { x: 390, y: 220 },
  'rann_of_kutch': { x: 360, y: 270 },
  'cold_desert_ladakh': { x: 460, y: 60 },
  'cold_desert_spiti': { x: 510, y: 140 }
};

export const PLAINS_LANDMARKS = {
  'gangetic_plain': { x: 525, y: 240 },
  'punjab_plain': { x: 340, y: 185 },
  'brahmaputra_plain': { x: 795, y: 228 },
  'rajasthan_plains': { x: 285, y: 245 },
  'gujarat_plains': { x: 250, y: 340 },
  'konkan_coast': { x: 308, y: 430 },
  'malabar_coast': { x: 370, y: 590 },
  'coromandel_coast': { x: 462, y: 505 },
  'northern_circars': { x: 565, y: 380 }
};

export const projectCoords = (lat, lon, placeId = null, category = 'mountains') => {
  if (category === 'plains' && placeId && PLAINS_LANDMARKS[placeId]) {
    return PLAINS_LANDMARKS[placeId];
  }
  if (category === 'mountains' && placeId && MOUNTAINS_LANDMARKS[placeId]) {
    return MOUNTAINS_LANDMARKS[placeId];
  }
  if (category === 'forests' && placeId && FORESTS_LANDMARKS[placeId]) {
    return FORESTS_LANDMARKS[placeId];
  }
  if (category === 'rivers' && placeId && RIVERS_LANDMARKS[placeId]) {
    return RIVERS_LANDMARKS[placeId];
  }
  if (category === 'deserts' && placeId && DESERTS_LANDMARKS[placeId]) {
    return DESERTS_LANDMARKS[placeId];
  }
  if (category === 'plateaus' && placeId && PLATEAUS_LANDMARKS[placeId]) {
    return PLATEAUS_LANDMARKS[placeId];
  }
  
  // Default top-down projection formula
  const minLon = 61.0, maxLon = 100.0;
  const minLat = 4.0, maxLat = 40.0;
  const x = ((lon - minLon) / (maxLon - minLon)) * 1024;
  const y = (1 - ((lat - minLat) / (maxLat - minLat))) * 682;
  return { x: +x.toFixed(1), y: +y.toFixed(1) };
};

const CATEGORY_MAP_THEMES = {
  mountains: {
    badge: '🏔️ 3D Mountain Orography & Peaks Map',
    image: indiaPhysicalReliefImg,
    aspectRatio: '1024 / 682',
    viewBox: '0 0 1024 682',
    filter: 'contrast(1.1) saturate(1.1) brightness(1.0)',
    bgGrad: 'radial-gradient(ellipse at 50% 30%, #172554 0%, #030712 100%)',
    primaryColor: '#F59E0B'
  },
  rivers: {
    badge: '🌊 River Systems & Drainage Basins Map',
    image: indiaRiversMapImg,
    aspectRatio: '1024 / 682',
    viewBox: '0 0 1024 682',
    filter: 'contrast(1.08) saturate(1.18) brightness(1.02)',
    bgGrad: 'radial-gradient(ellipse at 50% 50%, #082f49 0%, #020617 100%)',
    primaryColor: '#0284C7'
  },
  plains: {
    badge: '🏞️ Alluvial Basins & Coastal Plains Map',
    image: indiaPlainsReliefImg,
    aspectRatio: '1024 / 682',
    viewBox: '0 0 1024 682',
    filter: 'contrast(1.06) saturate(1.12) brightness(1.02)',
    bgGrad: 'radial-gradient(ellipse at 50% 40%, #064e3b 0%, #020617 100%)',
    primaryColor: '#10B981'
  },
  deserts: {
    badge: '🏜️ 3D Great Thar & Arid Relief Map',
    image: indiaDesertsMapImg,
    aspectRatio: '1024 / 576',
    viewBox: '0 0 1024 576',
    filter: 'contrast(1.08) saturate(1.15) brightness(1.02)',
    bgGrad: 'radial-gradient(ellipse at 35% 45%, #2d1806 0%, #0c0803 100%)',
    primaryColor: '#D97706'
  },
  forests: {
    badge: '🌳 Rainforest Canopy & Biosphere Sanctuaries Map',
    image: indiaForestsMapImg,
    aspectRatio: '1024 / 682',
    viewBox: '0 0 1024 682',
    filter: 'contrast(1.1) saturate(1.2) brightness(0.95)',
    bgGrad: 'radial-gradient(ellipse at 40% 60%, #064e3b 0%, #022c22 100%)',
    primaryColor: '#10B981'
  },
  plateaus: {
    badge: '⛰️ Deccan Basalt & Geological Tablelands Map',
    image: indiaPhysicalReliefImg,
    aspectRatio: '1024 / 682',
    viewBox: '0 0 1024 682',
    filter: 'contrast(1.06) saturate(1.12) brightness(1.02)',
    bgGrad: 'radial-gradient(ellipse at 45% 60%, #1e1b4b 0%, #020617 100%)',
    primaryColor: '#8B5CF6'
  }
};

export default function IndiaRealisticThematicMap({
  category = 'mountains',
  places = [],
  selectedPlace = null,
  hoveredPlaceId = null,
  onSelectPlace,
  onHoverPlace,
  zoomLevel = 1
}) {
  const currentTheme = CATEGORY_MAP_THEMES[category] || CATEGORY_MAP_THEMES.mountains;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: currentTheme.bgGrad
    }}>
      {/* 2. MAIN SCALABLE 3D MAP CONTAINER (100% Fully Visible & Covers All Space) */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'center center',
        transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}>
        <div style={{
          position: 'relative',
          aspectRatio: currentTheme.aspectRatio || '1024 / 682',
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          display: 'grid',
          placeItems: 'center',
          objectFit: 'contain'
        }}>
          {/* Base Image strictly filling the 1024/682 container */}
          <img
            src={currentTheme.image}
            alt={currentTheme.badge}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              filter: currentTheme.filter,
              display: 'block',
              transition: 'filter 0.3s ease'
            }}
          />

          {/* 3. HIGH-PRECISION VECTOR OVERLAY MATCHING 100% OF THE IMAGE */}
          <svg
            viewBox={currentTheme.viewBox || "0 0 1024 682"}
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
          <defs>
            <filter id="badgeShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.85" floodColor="#020617" />
            </filter>
            <filter id="selectedGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodOpacity="0.95" floodColor="#F59E0B" />
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.9" floodColor="#000000" />
            </filter>
            <filter id="hoverGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodOpacity="0.85" floodColor="#38BDF8" />
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.8" floodColor="#000000" />
            </filter>
            <linearGradient id="selectedBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
          </defs>

          {/* INTERACTIVE PINPOINT MARKERS & ACTIVE PLACE NAME BADGE */}
          {[...places]
            .sort((a, b) => {
              const aActive = (selectedPlace && a.id === selectedPlace.id) ? 2 : (a.id === hoveredPlaceId ? 1 : 0);
              const bActive = (selectedPlace && b.id === selectedPlace.id) ? 2 : (b.id === hoveredPlaceId ? 1 : 0);
              return aActive - bActive;
            })
            .map(place => {
              const pt = projectCoords(place.lat, place.lon, place.id, category);
              const isSelected = selectedPlace && place.id === selectedPlace.id;
              const isHovered = place.id === hoveredPlaceId;
              const showLabel = isSelected || isHovered;

              const catColors = {
                mountains: '#F59E0B',
                plains: '#10B981',
                rivers: '#0284C7',
                deserts: '#D97706',
                forests: '#059669',
                plateaus: '#8B5CF6'
              };
              const markerColor = catColors[place.category] || currentTheme.primaryColor;
              const displayName = place.name.split('(')[0].trim();
              const textLen = displayName.length;
              const cardWidth = Math.max(110, textLen * 9.2 + 38);
              const cardHeight = 30;

              // Smart boundary-safe offset positioning
              let offsetX = 14;
              if (pt.x > 720) {
                offsetX = -cardWidth - 12;
              } else if (pt.x < 260) {
                offsetX = 14;
              } else {
                const isLeft = (place.labelOffsetX !== undefined && place.labelOffsetX < 0);
                offsetX = isLeft ? -cardWidth - 12 : (place.labelOffsetX || 14);
              }
              const offsetY = place.labelOffsetY !== undefined ? (place.labelOffsetY - 4) : -15;

              return (
                <g
                  key={place.id}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  onClick={() => onSelectPlace(place.id)}
                  onMouseEnter={() => onHoverPlace(place.id)}
                  onMouseLeave={() => onHoverPlace(null)}
                  style={{
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  {/* Pulsing Dual Radar Ring when Selected */}
                  {isSelected && (
                    <>
                      <circle
                        r={category === 'rivers' ? "28" : "22"}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="3"
                        opacity="0.85"
                        style={{ animation: 'ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite' }}
                      />
                      <circle
                        r={category === 'rivers' ? "18" : "15"}
                        fill="rgba(245, 158, 11, 0.3)"
                        stroke="#FDE047"
                        strokeWidth="1.8"
                      />
                    </>
                  )}

                  {/* Hover Aura for unselected points */}
                  {isHovered && !isSelected && (
                    <circle
                      r={category === 'rivers' ? "18" : "14"}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      opacity="0.9"
                    />
                  )}

                  {/* Center Core Marker Pin */}
                  <circle
                    r={isSelected ? (category === 'rivers' ? "9.5" : "8.5") : (isHovered ? "7.5" : "6")}
                    fill={isSelected ? '#F59E0B' : markerColor}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? "2.8" : "2"}
                    filter="drop-shadow(0 2px 6px rgba(0,0,0,0.75))"
                    style={{ transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  />

                  {/* SINGLE ACTIVE HIGHLIGHTED PLACE NAME BADGE (Increased Font Size) */}
                  {showLabel && (
                    <g
                      filter={isSelected ? "url(#selectedGlow)" : "url(#hoverGlow)"}
                      style={{ transition: 'all 0.2s ease', pointerEvents: 'none' }}
                    >
                      {/* Badge Background Pill */}
                      <rect
                        x={offsetX}
                        y={offsetY}
                        width={cardWidth}
                        height={cardHeight}
                        rx="8"
                        fill="url(#selectedBadgeGrad)"
                        stroke={isSelected ? '#F59E0B' : '#38BDF8'}
                        strokeWidth={isSelected ? "2.6" : "2"}
                        opacity="0.98"
                      />

                      {/* Radiant Indicator Dot */}
                      <circle
                        cx={offsetX + 12}
                        cy={offsetY + (cardHeight / 2)}
                        r={isSelected ? 4.5 : 3.5}
                        fill={isSelected ? '#FDE047' : '#38BDF8'}
                      />

                      {/* Big Prominent Place Name Text */}
                      <text
                        x={offsetX + 22}
                        y={offsetY + (cardHeight / 2) + 5}
                        fill={isSelected ? '#FEF08A' : '#FFFFFF'}
                        fontSize="14"
                        fontWeight="900"
                        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                        letterSpacing="0.025em"
                      >
                        {displayName}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
