import React, { useState, useEffect, useRef } from 'react';
import { IndiaMapData } from './IndiaMapData';
import nasaSatelliteImg from './assets/nasa_india_satellite.jpg';
import realisticAirplaneImg from './assets/realistic_airplane_top.png';
import { 
  Plane, Compass, Navigation, Sparkles, MapPin, Landmark, 
  Layers, Maximize2, Minimize2, X, Eye, EyeOff, Mountain, Waves, Globe,
  Volume2, VolumeX, Sun, Moon, Radio, Wind, ShieldAlert, Ruler, Clock, 
  Activity, ArrowUpRight, Check
} from 'lucide-react';

export default function IndiaSVGMap({
  activeRoute, // { to: string, showBoth: boolean }
  animating,
  missionIndex,
  missions,
  mapStyle = 'physical', // 'physical' | 'satellite' | 'atlas'
  travelMode = 'plane', // 'plane' | 'train'
  soundEnabled = true,
  onToggleSound,
  onSelectCity
}) {
  const [localHover, setLocalHover] = useState(null);
  const [travelProgress, setTravelProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCityDetail, setSelectedCityDetail] = useState(null);
  const [radarAngle, setRadarAngle] = useState(0);

  // Cartographic layer toggles
  const [showGraticule, setShowGraticule] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [showRelief, setShowRelief] = useState(true);
  const [showMeridian, setShowMeridian] = useState(false);

  // Interactive Ruler / Distance measurement tool state
  const [rulerMode, setRulerMode] = useState(false);
  const [rulerStart, setRulerStart] = useState(null);
  const [rulerEnd, setRulerEnd] = useState(null);

  // Radar sweep animation
  useEffect(() => {
    const rTimer = setInterval(() => {
      setRadarAngle(a => (a + 3) % 360);
    }, 30);
    return () => clearInterval(rTimer);
  }, []);

  // Geographic affine transformation calibrated to India map SVG coordinates
  const projectCoordinates = (lat, lon) => {
    const a = 20.6606;
    const b = 0.5652;
    const c = -1416.7303;
    const d = 0.4941;
    const e = -23.4696;
    const f = 836.2510;

    return {
      x: a * lon + b * lat + c,
      y: d * lon + e * lat + f
    };
  };

  // Adjusted offsets (dx, dy) to guarantee NO overlap between city badges
  const cityData = {
    tn: {
      lat: 13.0827, lon: 80.2707, state: "Tamil Nadu", name: "Chennai",
      anchor: "start", dx: 14, dy: -4, landmark: "Marina Beach & Coromandel Coast",
      icon: "🏖️", code: "MAA", region: "Coromandel Coastal Plain", bearing: 0, distance: 0,
      elevation: "6m", climate: "Tropical Wet & Dry", river: "Cooum & Adyar Rivers",
      desc: "Starting base camp of our voyage. Located on the Coromandel coast bordering the Bay of Bengal.",
      landscape: "Golden coastal shores, palm groves, and deep blue Bay of Bengal waters."
    },
    ka: {
      lat: 12.9716, lon: 77.5946, state: "Karnataka", name: "Bengaluru",
      anchor: "end", dx: -108, dy: 8, landmark: "Vidhana Soudha & Silicon Plateau",
      icon: "🏛️", code: "BLR", region: "Deccan Plateau", bearing: 268, distance: 350,
      elevation: "920m (High Elevation)", climate: "Moderate Tropical Savanna", river: "Vrishabhavathi Basin",
      desc: "Situated at an elevation of over 900m on the Deccan Plateau, directly West of Chennai.",
      landscape: "Elevated granite plateau ridges, lush Lalbagh botanical greenery, and breezy lakes."
    },
    mh: {
      lat: 19.0760, lon: 72.8777, state: "Maharashtra", name: "Mumbai",
      anchor: "end", dx: -108, dy: -12, landmark: "Gateway of India & Arabian Sea Port",
      icon: "🏙️", code: "BOM", region: "Konkan Coastal Strip", bearing: 318, distance: 1300,
      elevation: "14m", climate: "Tropical Monsoon", river: "Ulhas & Mithi Rivers",
      desc: "Financial hub facing the Arabian Sea on the western Konkan coast, surrounded by the Western Ghats.",
      landscape: "Iconic Arabian Sea skyline, Marine Drive promenade, and misty Western Ghats in the backdrop."
    },
    ap: {
      lat: 16.5193, lon: 80.5153, state: "Andhra Pradesh", name: "Amaravati",
      anchor: "start", dx: 14, dy: -8, landmark: "Amaravati Stupa & Krishna River Delta",
      icon: "☸️", code: "VGA", region: "Eastern Coastal Plains", bearing: 358, distance: 450,
      elevation: "25m", climate: "Tropical Hot & Humid", river: "Mighty Krishna River",
      desc: "Ancient Buddhist heritage center situated on the fertile southern bank of the Krishna River.",
      landscape: "Vast fertile rice fields, wide flowing waters of the sacred Krishna River, and ancient stupas."
    },
    wb: {
      lat: 22.5726, lon: 88.3639, state: "West Bengal", name: "Kolkata",
      anchor: "start", dx: 14, dy: 6, landmark: "Howrah Bridge & Hooghly Estuary",
      icon: "🌉", code: "CCU", region: "Ganga-Brahmaputra Delta", bearing: 38, distance: 1650,
      elevation: "9m", climate: "Tropical Wet & Dry", river: "Hooghly (Ganga tributary)",
      desc: "Historic port city in the lower Ganga Delta, connected directly to the Bay of Bengal.",
      landscape: "The grand cantilever Howrah Bridge spanning the busy waters of the Hooghly River."
    },
    rj: {
      lat: 26.9124, lon: 75.7873, state: "Rajasthan", name: "Jaipur",
      anchor: "end", dx: -108, dy: -14, landmark: "Hawa Mahal & Aravalli Ridges",
      icon: "🏰", code: "JAI", region: "Semi-Arid Aravalli Foothills", bearing: 338, distance: 2100,
      elevation: "431m", climate: "Semi-Arid (Thar Desert Border)", river: "Dhanuvati & Banas Basin",
      desc: "The royal Pink City surrounded by the rugged ancient Aravalli mountain ranges.",
      landscape: "Golden Thar desert sands, rugged Aravalli hilltop forts, and terracotta pink palaces."
    },
    as: {
      lat: 26.1445, lon: 91.7362, state: "Assam", name: "Dispur (Assam)",
      anchor: "start", dx: 14, dy: -10, landmark: "Tea Valleys & Brahmaputra Floodplain",
      icon: "🍵", code: "GAU", region: "Brahmaputra Valley & Hills", bearing: 48, distance: 2500,
      elevation: "55m", climate: "Subtropical Monsoon", river: "Mighty Brahmaputra River",
      desc: "Surrounded by lush rainforests and tea hills along the perennial Brahmaputra River.",
      landscape: "Rolling emerald tea garden hills, morning mist, and the mighty braided Brahmaputra River."
    }
  };

  const nightLights = [
    { name: "Delhi", lat: 28.6139, lon: 77.2090, r: 8, intensity: 0.95 },
    { name: "Mumbai", lat: 19.0760, lon: 72.8777, r: 9, intensity: 1.0 },
    { name: "Bengaluru", lat: 12.9716, lon: 77.5946, r: 7.5, intensity: 0.9 },
    { name: "Chennai", lat: 13.0827, lon: 80.2707, r: 7.5, intensity: 0.9 },
    { name: "Kolkata", lat: 22.5726, lon: 88.3639, r: 8, intensity: 0.9 },
    { name: "Hyderabad", lat: 17.3850, lon: 78.4867, r: 7, intensity: 0.85 },
    { name: "Ahmedabad", lat: 23.0225, lon: 72.5714, r: 6.5, intensity: 0.8 },
    { name: "Jaipur", lat: 26.9124, lon: 75.7873, r: 6, intensity: 0.8 },
    { name: "Pune", lat: 18.5204, lon: 73.8567, r: 6, intensity: 0.8 },
    { name: "Lucknow", lat: 26.8467, lon: 80.9462, r: 5.5, intensity: 0.75 },
    { name: "Guwahati", lat: 26.1445, lon: 91.7362, r: 5, intensity: 0.7 }
  ];

  const stateCentroids = {};
  for (const id in cityData) {
    stateCentroids[id] = projectCoordinates(cityData[id].lat, cityData[id].lon);
  }

  const startNode = stateCentroids['tn'];

  const currentMission = missionIndex >= 0 && missionIndex < missions.length ? missions[missionIndex] : null;
  const currentDestinationId = currentMission ? currentMission.id : null;

  const completedMissionIds = [];
  if (missionIndex >= 0) {
    for (let i = 0; i < Math.min(missionIndex, missions.length); i++) {
      completedMissionIds.push(missions[i].id);
    }
  }

  // Smooth 60 FPS straight flight animation progress
  useEffect(() => {
    if (!animating) {
      setTravelProgress(0);
      return;
    }
    let start = performance.now();
    const duration = 2600; // Smooth 2.6s straight flight cruise
    let rafId;

    const animateFlight = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      setTravelProgress(progress);
      if (progress < 1) {
        rafId = requestAnimationFrame(animateFlight);
      }
    };

    rafId = requestAnimationFrame(animateFlight);
    return () => cancelAnimationFrame(rafId);
  }, [animating]);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) setIsFullscreen(false);
        if (rulerMode) {
          setRulerStart(null);
          setRulerEnd(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, rulerMode]);

  const calculateGreatCircleDistance = (c1, c2) => {
    if (!c1 || !c2) return 0;
    const R = 6371;
    const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
    const dLon = ((c2.lon - c1.lon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((c1.lat * Math.PI) / 180) *
        Math.cos((c2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const calculateBearing = (c1, c2) => {
    if (!c1 || !c2) return 0;
    const y = Math.sin(((c2.lon - c1.lon) * Math.PI) / 180) * Math.cos((c2.lat * Math.PI) / 180);
    const x =
      Math.cos((c1.lat * Math.PI) / 180) * Math.sin((c2.lat * Math.PI) / 180) -
      Math.sin((c1.lat * Math.PI) / 180) *
        Math.cos((c2.lat * Math.PI) / 180) *
        Math.cos(((c2.lon - c1.lon) * Math.PI) / 180);
    let brng = (Math.atan2(y, x) * 180) / Math.PI;
    return Math.round((brng + 360) % 360);
  };

  const getDirectionText = (brng) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    return directions[Math.round(brng / 45) % 8];
  };

  // Straight line direct vector path from Chennai to destination
  const getDirectPath = (toId) => {
    const endNode = stateCentroids[toId];
    if (!endNode || !startNode) return { d: '', cx: 0, cy: 0, angle: 0, dist: 0 };

    const dx = endNode.x - startNode.x;
    const dy = endNode.y - startNode.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Direct midpoint
    const cx = (startNode.x + endNode.x) / 2;
    const cy = (startNode.y + endNode.y) / 2;

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return {
      d: `M ${startNode.x} ${startNode.y} L ${endNode.x} ${endNode.y}`,
      cx, cy,
      angle,
      dist
    };
  };

  const getStateColor = (id, isDestination, isCompleted, isStart, isHovered) => {
    if (isStart) {
      return {
        fill: mapStyle === 'satellite' ? '#16A34A' : 'url(#tamilNaduGrad)',
        fillOpacity: mapStyle === 'satellite' ? 0.75 : 1,
        stroke: '#22C55E',
        strokeWidth: 2.5
      };
    }
    if (isDestination && !animating) {
      return {
        fill: mapStyle === 'satellite' ? '#D97706' : 'url(#destinationGrad)',
        fillOpacity: mapStyle === 'satellite' ? 0.75 : 1,
        stroke: '#F59E0B',
        strokeWidth: 2.6
      };
    }
    if (isCompleted || (animating && isDestination)) {
      return {
        fill: mapStyle === 'satellite' ? '#2563EB' : 'url(#completedGrad)',
        fillOpacity: mapStyle === 'satellite' ? 0.65 : 1,
        stroke: '#60A5FA',
        strokeWidth: 2.2
      };
    }
    if (isHovered) {
      return {
        fill: mapStyle === 'satellite' ? '#EAB308' : '#FEF9C3',
        fillOpacity: mapStyle === 'satellite' ? 0.55 : 1,
        stroke: '#FACC15',
        strokeWidth: 2
      };
    }

    if (mapStyle === 'physical') {
      if (['jk', 'la', 'hp', 'ut', 'sk', 'ar'].includes(id)) {
        return { fill: 'url(#himalayaGrad)', fillOpacity: 1, stroke: '#94A3B8', strokeWidth: 1 };
      }
      if (['rj', 'gj'].includes(id)) {
        return { fill: 'url(#desertGrad)', fillOpacity: 1, stroke: '#FDE68A', strokeWidth: 1 };
      }
      if (['pb', 'hr', 'up', 'br', 'wb', 'as', 'ml', 'tr', 'mz', 'nl', 'mn', 'kl', 'ap', 'or'].includes(id)) {
        return { fill: 'url(#plainsGrad)', fillOpacity: 1, stroke: '#86EFAC', strokeWidth: 1 };
      }
      return { fill: 'url(#plateauGrad)', fillOpacity: 1, stroke: '#FED7AA', strokeWidth: 1 };
    }

    if (mapStyle === 'satellite') {
      return {
        fill: 'url(#nasaSatellitePattern)',
        fillOpacity: 1,
        stroke: 'rgba(255, 255, 255, 0.45)',
        strokeWidth: 0.95
      };
    }

    return { fill: '#FFFFFF', fillOpacity: 1, stroke: '#CBD5E1', strokeWidth: 1 };
  };

  // Render straight vector path with perfectly aligned forward-facing airplane
  const renderFlightRoute = (toId, isExtra = false, isLiveAnimation = false) => {
    const endNode = stateCentroids[toId];
    if (!endNode) return null;

    const { d, cx, cy, dist } = getDirectPath(toId);
    const city = cityData[toId];

    const t = isLiveAnimation ? travelProgress : 1;
    // Straight linear interpolation
    const curX = (1 - t) * startNode.x + t * endNode.x;
    const curY = (1 - t) * startNode.y + t * endNode.y;

    const dx = endNode.x - startNode.x;
    const dy = endNode.y - startNode.y;
    // Exact forward heading angle in degrees (0° = pointing Right / East, 90° = South, -90° = North, 180° = West)
    const heading = Math.atan2(dy, dx) * (180 / Math.PI);

    const strokeColor = isExtra ? '#64748B' : (isLiveAnimation ? '#D97706' : '#2563EB');
    const glowColor = isExtra ? 'rgba(100,116,139,0.3)' : 'rgba(217,119,6,0.5)';

    return (
      <g key={`flight-route-${toId}${isExtra ? '-extra' : ''}`}>
        {/* Glow backdrop line */}
        <path
          d={d}
          fill="none"
          stroke={glowColor}
          strokeWidth={isLiveAnimation ? "8" : "4"}
          strokeLinecap="round"
          opacity={isLiveAnimation ? 0.8 : 0.35}
        />

        {/* Straight trajectory dash line */}
        <path
          d={d}
          fill="none"
          stroke={strokeColor}
          strokeWidth={isLiveAnimation ? "3" : "2"}
          strokeDasharray="6 5"
          strokeLinecap="round"
          opacity={isLiveAnimation ? 1 : 0.85}
        />

        {/* Distance label pill along the straight path */}
        {(!isLiveAnimation || isExtra) && city && (
          <g transform={`translate(${cx}, ${cy - 8})`} style={{ pointerEvents: 'none' }}>
            <rect
              x="-32"
              y="-9"
              width="64"
              height="18"
              rx="9"
              fill={mapStyle === 'satellite' ? '#0F172A' : '#FFFFFF'}
              stroke={strokeColor}
              strokeWidth="1.2"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.18))"
            />
            <text
              x="0"
              y="3"
              textAnchor="middle"
              fontSize="9"
              fontWeight="900"
              fill={mapStyle === 'satellite' ? '#F8FAFC' : '#1E293B'}
              fontFamily="'Space Grotesk', sans-serif"
            >
              {city.distance} km
            </text>
          </g>
        )}

        {/* Moving Straight Forward Airplane / Train */}
        {isLiveAnimation && (
          <g transform={`translate(${curX}, ${curY})`}>
            {/* Realistic Ground Altitude Shadow (Offset downwards for 3D cruising altitude effect) */}
            <g transform={`rotate(${heading})`}>
              <ellipse
                cx="-6"
                cy="16"
                rx="18"
                ry="5.5"
                fill="rgba(0, 0, 0, 0.38)"
                filter="blur(2.5px)"
              />
            </g>

            {/* Rotated Aircraft with Wake Turbulence Vapor Contrails */}
            <g transform={`rotate(${heading})`}>
              {/* Dual Turbofan Condensation Contrails trailing back */}
              <line x1="-12" y1="-5.5" x2="-90" y2="-9" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="2.2" strokeLinecap="round" filter="blur(0.8px)" />
              <line x1="-12" y1="5.5" x2="-90" y2="9" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="2.2" strokeLinecap="round" filter="blur(0.8px)" />
              <line x1="-10" y1="-5.5" x2="-45" y2="-7" stroke="rgba(186, 230, 253, 0.65)" strokeWidth="1.6" filter="blur(0.4px)" />
              <line x1="-10" y1="5.5" x2="-45" y2="7" stroke="rgba(186, 230, 253, 0.65)" strokeWidth="1.6" filter="blur(0.4px)" />

              {travelMode === 'plane' ? (
                /* Ultra-Realistic Commercial Passenger Jet (Proportional High-Altitude Scale) */
                <g transform="scale(0.48)">
                  <image
                    href={realisticAirplaneImg}
                    x="-32"
                    y="-32"
                    width="64"
                    height="64"
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.55))'
                    }}
                  />
                  {/* Port Wing Red Navigation Light */}
                  <circle cx="-6" cy="-24" r="2.2" fill="#EF4444" style={{ animation: 'ping 0.8s infinite' }} />
                  {/* Starboard Wing Green Navigation Light */}
                  <circle cx="-6" cy="24" r="2.2" fill="#22C55E" style={{ animation: 'ping 0.8s infinite' }} />
                  {/* Tail White Anti-Collision Strobe */}
                  <circle cx="-28" cy="0" r="2" fill="#FFFFFF" style={{ animation: 'ping 1.1s infinite' }} />
                  {/* Top Fuselage Red Rotating Beacon */}
                  <circle cx="-2" cy="0" r="2" fill="#DC2626" opacity="0.9" />
                </g>
              ) : (
                /* High-Speed Train Cab */
                <g transform="translate(-14, -5) scale(0.75)">
                  <rect x="0" y="0" width="30" height="10" rx="5" fill="#1E3A8A" stroke="#FFFFFF" strokeWidth="1.2" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.35))" />
                  <rect x="4" y="2" width="18" height="6" rx="2" fill="#F8FAFC" />
                  <circle cx="25" cy="5" r="2" fill="#38BDF8" />
                  <polygon points="30,3 44,1 44,9 30,7" fill="rgba(254, 240, 138, 0.45)" />
                  <circle cx="29" cy="3" r="1.3" fill="#FEF08A" />
                  <circle cx="29" cy="7" r="1.3" fill="#FEF08A" />
                </g>
              )}
            </g>

            {/* Live Flight Telemetry Tag (Remains horizontal and readable) */}
            <g transform="translate(18, -14)" style={{ pointerEvents: 'none' }}>
              <rect
                x="-4"
                y="-9"
                width="72"
                height="16"
                rx="8"
                fill="rgba(15, 23, 42, 0.88)"
                stroke="rgba(56, 189, 248, 0.7)"
                strokeWidth="1"
                backdropFilter="blur(6px)"
                filter="drop-shadow(0 2px 6px rgba(0,0,0,0.4))"
              />
              <text
                x="32"
                y="2.5"
                textAnchor="middle"
                fontSize="8"
                fontWeight="900"
                fill="#38BDF8"
                fontFamily="'Space Grotesk', sans-serif"
                letterSpacing="0.4px"
              >
                ✈️ FL380 • 850k
              </text>
            </g>
          </g>
        )}

        {/* Destination Arrival Target Beacon */}
        <g transform={`translate(${endNode.x}, ${endNode.y})`}>
          {isLiveAnimation && (
            <>
              <circle r="18" fill="none" stroke="#D97706" strokeWidth="1.8" opacity="0.7" style={{ animation: 'ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
              <circle r="10" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.85" />
            </>
          )}
          <circle
            r="6"
            fill={isExtra ? '#64748B' : (isLiveAnimation ? '#D97706' : '#2563EB')}
            stroke="#FFFFFF"
            strokeWidth="2"
            filter="drop-shadow(0 2px 5px rgba(0,0,0,0.3))"
          />
        </g>
      </g>
    );
  };

  const handleCityClick = (cityKey) => {
    const city = cityData[cityKey];
    if (!city) return;

    if (rulerMode) {
      if (!rulerStart || (rulerStart && rulerEnd)) {
        setRulerStart(cityKey);
        setRulerEnd(null);
      } else if (rulerStart && !rulerEnd && rulerStart !== cityKey) {
        setRulerEnd(cityKey);
      }
    } else {
      setSelectedCityDetail(city);
      if (onSelectCity) onSelectCity(cityKey);
    }
  };

  const containerStyle = isFullscreen ? {
    position: 'fixed',
    inset: 0,
    zIndex: 99999,
    width: '100vw',
    height: '100vh',
    background: mapStyle === 'satellite' ? '#030712' : '#F7F1E2',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxSizing: 'border-box',
    padding: '12px'
  } : {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  const rulerCity1 = rulerStart ? cityData[rulerStart] : null;
  const rulerCity2 = rulerEnd ? cityData[rulerEnd] : null;
  const rulerDist = rulerCity1 && rulerCity2 ? calculateGreatCircleDistance(rulerCity1, rulerCity2) : 0;
  const rulerBearing = rulerCity1 && rulerCity2 ? calculateBearing(rulerCity1, rulerCity2) : 0;
  const rulerDir = getDirectionText(rulerBearing);

  return (
    <div style={containerStyle}>
      
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes pulse-wave {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.05); }
        }
        @keyframes river-flow {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes city-glow {
          0%, 100% { opacity: 0.65; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.15); }
        }
      `}</style>

      {/* Top Map Context & Layer Control Bar */}
      <div style={{
        padding: '6px 10px',
        background: mapStyle === 'satellite' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.94)',
        borderBottom: '1.5px solid #F2DFBC',
        borderRadius: isFullscreen ? '14px 14px 0 0' : '0',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        gap: '4px',
        fontSize: '11px',
        fontFamily: '"Space Grotesk", sans-serif',
        color: '#78350F',
        fontWeight: 700,
        zIndex: 5
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={12} color="#16A34A" />
          <span>Base: <strong>Chennai</strong> (13°N, 80°E)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowRelief(!showRelief)}
            style={{
              background: showRelief ? '#DCFCE7' : 'transparent',
              border: '1px solid #86EFAC',
              borderRadius: '5px',
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: 800,
              color: showRelief ? '#166534' : '#94A3B8',
              cursor: 'pointer'
            }}
            title="Toggle Mountain Ranges & Relief"
          >
            ⛰️ Relief
          </button>

          <button
            onClick={() => setShowMeridian(!showMeridian)}
            style={{
              background: showMeridian ? '#F3E8FF' : 'transparent',
              border: '1px solid #D8B4FE',
              borderRadius: '5px',
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: 800,
              color: showMeridian ? '#6B21A8' : '#94A3B8',
              cursor: 'pointer'
            }}
            title="Standard Meridian 82.5° E (Indian Standard Time)"
          >
            ⏰ 82.5°E IST
          </button>


          {onToggleSound && (
            <button
              onClick={onToggleSound}
              style={{
                background: soundEnabled ? '#DCFCE7' : '#F1F5F9',
                border: `1px solid ${soundEnabled ? '#86EFAC' : '#CBD5E1'}`,
                borderRadius: '5px',
                padding: '2px 5px',
                fontSize: '10px',
                fontWeight: 800,
                color: soundEnabled ? '#166534' : '#64748B',
                cursor: 'pointer'
              }}
              title={soundEnabled ? "Mute Audio SFX" : "Unmute Audio SFX"}
            >
              {soundEnabled ? '🔊 SFX' : '🔇 Mute'}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {currentMission && cityData[currentMission.id] && (
            <span style={{ background: '#FEF3C7', padding: '2px 5px', borderRadius: '4px', border: '1px solid #FDE68A', color: '#92400E', fontWeight: 800, fontSize: '10px' }}>
              📍 {cityData[currentMission.id].name} ({cityData[currentMission.id].distance} km)
            </span>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "View Map in Fullscreen"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              background: isFullscreen ? '#EF4444' : '#0E3556',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '5px',
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {isFullscreen ? <><Minimize2 size={11} /> Exit</> : <><Maximize2 size={10} /> Fullscreen</>}
          </button>
        </div>
      </div>

      {rulerMode && (
        <div style={{
          background: '#FFF7ED',
          borderBottom: '1.5px solid #FDBA74',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#9A3412',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 6
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Ruler size={13} color="#EA580C" />
            <span>
              {!rulerStart && "Click 1st city on the map to start measuring..."}
              {rulerStart && !rulerEnd && `Point A: ${cityData[rulerStart].name}. Now click 2nd city...`}
              {rulerStart && rulerEnd && (
                <span>
                  <strong>{cityData[rulerStart].name} ➔ {cityData[rulerEnd].name}:</strong> <span style={{ color: '#15803D', background: '#DCFCE7', padding: '1px 5px', borderRadius: '4px' }}>{rulerDist} km</span> • Bearing: <span style={{ color: '#1E40AF', background: '#DBEAFE', padding: '1px 5px', borderRadius: '4px' }}>{rulerBearing}° ({rulerDir})</span> • Flight: ~{Math.round(rulerDist / 14)}m
                </span>
              )}
            </span>
          </div>

          <button
            onClick={() => {
              setRulerStart(null);
              setRulerEnd(null);
            }}
            style={{
              background: '#FED7AA',
              border: 'none',
              borderRadius: '4px',
              padding: '1px 6px',
              fontSize: '10px',
              fontWeight: 800,
              color: '#9A3412',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Main SVG Map Canvas */}
      <div style={{ 
        flex: 1, 
        minHeight: 0, 
        position: 'relative', 
        overflow: 'hidden',
        background: mapStyle === 'satellite'
          ? 'radial-gradient(ellipse at 50% 50%, #0c1a30 0%, #030712 100%)'
          : (mapStyle === 'physical'
            ? 'radial-gradient(ellipse at 60% 50%, #C7EAFE 0%, #93D4FB 40%, #38BDF8 85%, #0284C7 100%)'
            : '#F8FAFC'),
        borderRadius: isFullscreen ? '0 0 14px 14px' : '0'
      }}>
        <svg
          viewBox="-10 -10 615 690"
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        >
          <defs>
            <filter id="mapShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.16" floodColor="#0F172A" />
            </filter>

            <linearGradient id="himalayaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            <linearGradient id="desertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="60%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            <linearGradient id="plainsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F0FDF4" />
              <stop offset="70%" stopColor="#DCFCE7" />
              <stop offset="100%" stopColor="#BBF7D0" />
            </linearGradient>

            <linearGradient id="plateauGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="60%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#FED7AA" />
            </linearGradient>

            <linearGradient id="tamilNaduGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DCFCE7" />
              <stop offset="100%" stopColor="#86EFAC" />
            </linearGradient>

            <linearGradient id="destinationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>

            <linearGradient id="completedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EFF6FF" />
              <stop offset="100%" stopColor="#BFDBFE" />
            </linearGradient>

            <radialGradient id="cityGlow">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
            </radialGradient>

            <pattern id="nasaSatellitePattern" patternUnits="userSpaceOnUse" x="-10" y="-10" width="635" height="705">
              <image href={nasaSatelliteImg} x="0" y="0" width="635" height="705" preserveAspectRatio="xMidYMid slice" />
            </pattern>
          </defs>

          {/* Oceanic & Graticule Background */}
          <g opacity={mapStyle === 'satellite' ? 0.35 : 0.9}>
            {showGraticule && (
              <g stroke={mapStyle === 'satellite' ? '#334155' : '#0284C7'} strokeWidth="0.75" strokeDasharray="3 6" opacity="0.4">
                <line x1="-10" y1="180" x2="615" y2="180" />
                <line x1="-10" y1="340" x2="615" y2="340" />
                <line x1="-10" y1="500" x2="615" y2="500" />
                <line x1="130" y1="-10" x2="130" y2="690" />
                <line x1="290" y1="-10" x2="290" y2="690" />
                <line x1="450" y1="-10" x2="450" y2="690" />

                <text x="5" y="176" fontSize="8" fill="#0369A1" fontWeight="700">28° N</text>
                <text x="5" y="336" fontSize="8" fill="#0369A1" fontWeight="700">20° N</text>
                <text x="5" y="496" fontSize="8" fill="#0369A1" fontWeight="700">12° N</text>
                <text x="132" y="675" fontSize="8" fill="#0369A1" fontWeight="700">72° E</text>
                <text x="292" y="675" fontSize="8" fill="#0369A1" fontWeight="700">80° E</text>
                <text x="452" y="675" fontSize="8" fill="#0369A1" fontWeight="700">88° E</text>
              </g>
            )}

            {showGraticule && (
              <g>
                <line x1="20" y1="280" x2="570" y2="280" stroke="#D97706" strokeWidth="1.4" strokeDasharray="7 4" opacity="0.9" />
                <rect x="50" y="271" width="130" height="16" rx="4" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1" opacity="0.95" />
                <text x="55" y="282.5" fontSize="8.5" fontWeight="900" fill="#92400E" fontFamily="'Space Grotesk', sans-serif">
                  23.5° N • Tropic of Cancer
                </text>
              </g>
            )}

            {showMeridian && (
              <g>
                <line x1="340" y1="-10" x2="340" y2="690" stroke="#9333EA" strokeWidth="1.4" strokeDasharray="6 4" opacity="0.85" />
                <rect x="275" y="130" width="130" height="16" rx="4" fill="#F3E8FF" stroke="#D8B4FE" strokeWidth="1" opacity="0.95" />
                <text x="280" y="141.5" fontSize="8.5" fontWeight="900" fill="#6B21A8" fontFamily="'Space Grotesk', sans-serif">
                  82.5° E • Standard Meridian (IST)
                </text>
              </g>
            )}

            <text x="50" y="440" fontSize="11.5" fontWeight="900" fill={mapStyle === 'satellite' ? '#38BDF8' : '#0369A1'} letterSpacing="2.5" opacity="0.95" fontFamily="'Space Grotesk', sans-serif" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))">ARABIAN SEA</text>
            <text x="360" y="470" fontSize="11.5" fontWeight="900" fill={mapStyle === 'satellite' ? '#38BDF8' : '#0369A1'} letterSpacing="2.5" opacity="0.95" fontFamily="'Space Grotesk', sans-serif" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))">BAY OF BENGAL</text>
            <text x="180" y="660" fontSize="11.5" fontWeight="900" fill={mapStyle === 'satellite' ? '#38BDF8' : '#0369A1'} letterSpacing="2.5" opacity="0.95" fontFamily="'Space Grotesk', sans-serif" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))">INDIAN OCEAN</text>
            
            {showRelief && (
              <g opacity="0.95">
                <text x="290" y="32" fontSize="10" fontWeight="900" fill={mapStyle === 'satellite' ? '#FFFFFF' : '#78350F'} letterSpacing="2.5" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" filter="drop-shadow(0 2px 5px rgba(0,0,0,0.8))">
                  ▲ THE GREAT HIMALAYAS ▲
                </text>
                <text x="110" y="500" fontSize="8" fontWeight="900" fill="#22C55E" letterSpacing="1" transform="rotate(-65 110 500)" opacity="0.85" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.6))">
                  Western Ghats
                </text>
                <text x="340" y="500" fontSize="8" fontWeight="900" fill="#22C55E" letterSpacing="1" transform="rotate(45 340 500)" opacity="0.85" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.6))">
                  Eastern Ghats
                </text>
              </g>
            )}

            <g transform="translate(245, 615)" opacity="0.9">
              <ellipse cx="12" cy="16" rx="9" ry="14" fill={mapStyle === 'satellite' ? '#1E293B' : '#E2E8F0'} stroke={mapStyle === 'satellite' ? '#38BDF8' : '#94A3B8'} strokeWidth="1.2" />
              <text x="12" y="38" fontSize="9" fontWeight="900" fill={mapStyle === 'satellite' ? '#93C5FD' : '#64748B'} textAnchor="middle" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.6))">Sri Lanka</text>
            </g>

            <g transform="translate(520, 500)" opacity="0.95">
              <circle cx="0" cy="0" r="3" fill="#22C55E" />
              <circle cx="2" cy="12" r="2.5" fill="#22C55E" />
              <circle cx="4" cy="24" r="3" fill="#22C55E" />
              <circle cx="5" cy="38" r="2.5" fill="#22C55E" />
              <text x="-12" y="56" fontSize="8.5" fontWeight="900" fill="#38BDF8" fontFamily="'Space Grotesk', sans-serif" filter="drop-shadow(0 1px 4px rgba(0,0,0,0.7))">
                Andaman & Nicobar
              </text>
            </g>

            <g transform="translate(110, 565)" opacity="0.95">
              <circle cx="0" cy="0" r="2.5" fill="#22C55E" />
              <circle cx="-3" cy="10" r="2" fill="#22C55E" />
              <circle cx="-2" cy="22" r="2.2" fill="#22C55E" />
              <text x="-16" y="36" fontSize="8.5" fontWeight="900" fill="#38BDF8" fontFamily="'Space Grotesk', sans-serif" filter="drop-shadow(0 1px 4px rgba(0,0,0,0.7))">
                Lakshadweep
              </text>
            </g>
          </g>

          {/* States Polygons Layer */}
          <g filter="url(#mapShadow)">
            {IndiaMapData.locations.map((loc) => {
              const isDestination = currentDestinationId === loc.id;
              const isCompleted = completedMissionIds.includes(loc.id);
              const isStart = loc.id === 'tn';
              const isHovered = localHover === loc.id;
              const style = getStateColor(loc.id, isDestination, isCompleted, isStart, isHovered);

              return (
                <path
                  key={loc.id}
                  id={`state-${loc.id}`}
                  d={loc.path}
                  fill={style.fill}
                  fillOpacity={style.fillOpacity !== undefined ? style.fillOpacity : 1}
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setLocalHover(loc.id)}
                  onMouseLeave={() => setLocalHover(null)}
                  onClick={() => handleCityClick(loc.id)}
                />
              );
            })}
          </g>

          {/* Satellite Night City Lights Cluster Layer */}
          {mapStyle === 'satellite' && (
            <g pointerEvents="none">
              {nightLights.map((city, idx) => {
                const node = projectCoordinates(city.lat, city.lon);
                return (
                  <g key={`light-${idx}`} transform={`translate(${node.x}, ${node.y})`}>
                    <circle r={city.r * 2} fill="url(#cityGlow)" opacity={city.intensity} style={{ animation: 'city-glow 3s ease-in-out infinite' }} />
                    <circle r={city.r * 0.8} fill="#FEF08A" opacity={0.9} />
                    <circle r="1.5" fill="#FFFFFF" />
                  </g>
                );
              })}
            </g>
          )}

          {/* Major Indian River Systems Layer */}
          {showRivers && (
            <g opacity="0.95" pointerEvents="none">
              <path
                d="M 210 150 Q 280 200 350 215 T 440 270"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2"
                strokeDasharray="4 2"
                style={{ animation: 'river-flow 2s linear infinite' }}
              />
              <text x="260" y="192" fontSize="8.5" fontWeight="900" fill="#38BDF8" fontStyle="italic" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.8))">Ganga R.</text>

              <path
                d="M 520 180 Q 480 200 450 240 T 440 270"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2.2"
                strokeDasharray="4 2"
                style={{ animation: 'river-flow 2s linear infinite' }}
              />
              <text x="470" y="175" fontSize="8.5" fontWeight="900" fill="#38BDF8" fontStyle="italic" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.8))">Brahmaputra R.</text>

              <path
                d="M 280 320 Q 200 330 160 325"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1.8"
              />
              <text x="195" y="322" fontSize="8.5" fontWeight="900" fill="#38BDF8" fontStyle="italic" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.8))">Narmada R.</text>

              <path
                d="M 180 430 Q 240 450 300 450"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1.8"
              />
              <text x="195" y="440" fontSize="8.5" fontWeight="900" fill="#38BDF8" fontStyle="italic" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.8))">Krishna R.</text>
            </g>
          )}

          {/* Trajectories & Routes Layer */}
          <g>
            {completedMissionIds.map(toId => {
              if (toId === 'mh') {
                return (
                  <React.Fragment key="comp-mh-routes">
                    {renderFlightRoute('ka', true, false)}
                    {renderFlightRoute('mh', false, false)}
                  </React.Fragment>
                );
              }
              return renderFlightRoute(toId, false, false);
            })}

            {animating && activeRoute && (
              <>
                {activeRoute.showBoth && renderFlightRoute('ka', true, false)}
                {renderFlightRoute(activeRoute.to, false, true)}
              </>
            )}
          </g>

          {/* Dynamic Ruler Measurement Line Overlay */}
          {rulerStart && rulerEnd && stateCentroids[rulerStart] && stateCentroids[rulerEnd] && (
            <g pointerEvents="none">
              <line
                x1={stateCentroids[rulerStart].x}
                y1={stateCentroids[rulerStart].y}
                x2={stateCentroids[rulerEnd].x}
                y2={stateCentroids[rulerEnd].y}
                stroke="#EA580C"
                strokeWidth="3"
                strokeDasharray="5 3"
              />
              <g transform={`translate(${(stateCentroids[rulerStart].x + stateCentroids[rulerEnd].x) / 2}, ${(stateCentroids[rulerStart].y + stateCentroids[rulerEnd].y) / 2 - 10})`}>
                <rect x="-42" y="-10" width="84" height="20" rx="10" fill="#EA580C" stroke="#FFFFFF" strokeWidth="1.5" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.25))" />
                <text x="0" y="3.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="#FFFFFF" fontFamily="'Space Grotesk', sans-serif">
                  {rulerDist} km ({rulerDir})
                </text>
              </g>
            </g>
          )}

          {/* City Labels & Landmark Badges */}
          <g>
            {missionIndex >= 0 && (
              <g transform={`translate(${startNode.x}, ${startNode.y})`} style={{ cursor: 'pointer' }} onClick={() => handleCityClick('tn')}>
                <circle r="22" fill="none" stroke="#16A34A" strokeWidth="1.5" opacity="0.6" style={{ animation: 'pulse-wave 2.5s infinite' }} />
                <line
                  x1="0"
                  y1="0"
                  x2={26 * Math.cos((radarAngle * Math.PI) / 180)}
                  y2={26 * Math.sin((radarAngle * Math.PI) / 180)}
                  stroke="#16A34A"
                  strokeWidth="1.5"
                  opacity="0.8"
                />

                <circle r="7" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2.2" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.4))" />
                <text x="0" y="3.5" fontSize="9" textAnchor="middle" fill="#FFFFFF" fontWeight="900">★</text>
                
                <g transform="translate(14, -8)">
                  <rect x="0" y="-10" width="104" height="26" rx="7" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.8" filter="drop-shadow(0 3px 8px rgba(0,0,0,0.3))" />
                  <text x="6" y="3" fontSize="10.5" fontWeight="900" fill="#166534" fontFamily="'Space Grotesk', sans-serif">
                    Chennai (Base) 📍
                  </text>
                  <text x="6" y="12.5" fontSize="8.5" fontWeight="800" fill="#15803D" fontFamily="'Space Grotesk', sans-serif">
                    Tamil Nadu
                  </text>
                </g>
              </g>
            )}

            {missions.map((m) => {
              const isActive = m.id === currentDestinationId;
              const isComp = completedMissionIds.includes(m.id);
              const node = stateCentroids[m.id];
              const city = cityData[m.id];
              if (!node || !city) return null;

              // Color styles for high contrast visibility
              let badgeBg = '#FFFFFF';
              let badgeBorder = '#2563EB';
              let titleColor = '#0F172A';
              let subtitleColor = '#1D4ED8';
              let pinColor = '#2563EB';

              if (isActive) {
                badgeBg = '#FEF3C7';
                badgeBorder = '#D97706';
                titleColor = '#78350F';
                subtitleColor = '#9A3412';
                pinColor = '#D97706';
              } else if (isComp) {
                badgeBg = '#ECFDF5';
                badgeBorder = '#10B981';
                titleColor = '#065F46';
                subtitleColor = '#047857';
                pinColor = '#10B981';
              }

              return (
                <g
                  key={`city-badge-${m.id}`}
                  transform={`translate(${node.x}, ${node.y})`}
                  style={{
                    cursor: 'pointer',
                    opacity: 1,
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleCityClick(m.id)}
                >
                  {isActive && !animating && (
                    <>
                      <circle r="20" fill="none" stroke="#D97706" strokeWidth="2" opacity="0.8" style={{ animation: 'ping 1.6s infinite' }} />
                      <circle r="12" fill="#FEF3C7" opacity="0.8" />
                    </>
                  )}

                  <circle
                    r={isActive ? "8" : "6"}
                    fill={pinColor}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    filter="drop-shadow(0 2px 6px rgba(0,0,0,0.4))"
                  />

                  <g transform={`translate(${city.dx}, ${city.dy})`}>
                    <rect
                      x="0"
                      y="-10"
                      width="104"
                      height="27"
                      rx="7"
                      fill={badgeBg}
                      stroke={badgeBorder}
                      strokeWidth={isActive ? "2" : "1.5"}
                      filter="drop-shadow(0 3px 8px rgba(0,0,0,0.3))"
                    />
                    <text x="6" y="3" fontSize="10.5" fontWeight="900" fill={titleColor} fontFamily="'Space Grotesk', sans-serif">
                      {city.icon} {city.name}
                    </text>
                    <text x="6" y="13" fontSize="8.5" fontWeight="800" fill={subtitleColor} fontFamily="'Space Grotesk', sans-serif">
                      {city.state}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* Interactive 3D Compass Rose HUD */}
          <g transform="translate(540, 70)">
            <circle r="30" fill={mapStyle === 'satellite' ? '#0F172A' : '#FFFFFF'} stroke="#D97706" strokeWidth="2" filter="drop-shadow(0 3px 8px rgba(0,0,0,0.2))" />
            <circle r="25" fill="none" stroke="#FDE68A" strokeWidth="1" strokeDasharray="3 3" />
            
            <text x="0" y="-16" fontSize="9" fontWeight="900" fill="#DC2626" textAnchor="middle">N</text>
            <text x="18" y="3" fontSize="8" fontWeight="900" fill="#78350F" textAnchor="middle">E</text>
            <text x="0" y="22" fontSize="8" fontWeight="900" fill="#78350F" textAnchor="middle">S</text>
            <text x="-18" y="3" fontSize="8" fontWeight="900" fill="#78350F" textAnchor="middle">W</text>

            {/* Standard Map North Compass Rose */}
            <g transform="rotate(0)">
              <polygon points="0,-18 3,0 0,-1.5 -3,0" fill="#DC2626" stroke="#991B1B" strokeWidth="0.5" />
              <polygon points="0,18 3,0 0,1.5 -3,0" fill="#64748B" stroke="#334155" strokeWidth="0.5" />
              <circle r="2.2" fill="#D97706" stroke="#FFFFFF" strokeWidth="0.8" />
            </g>
          </g>
        </svg>


      </div>

      {selectedCityDetail && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '12px',
          zIndex: 40,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(10px)',
          border: '2px solid #D97706',
          borderRadius: '12px',
          padding: '10px 12px',
          boxShadow: '0 8px 24px rgba(60,40,20,0.18)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '24px', background: '#FEF3C7', padding: '5px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
              {selectedCityDetail.icon}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: 900, color: '#78350F' }}>
                  {selectedCityDetail.name} ({selectedCityDetail.state})
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#166534', background: '#DCFCE7', padding: '1px 5px', borderRadius: '4px' }}>
                  {selectedCityDetail.distance > 0 ? `${selectedCityDetail.distance} km from Chennai` : 'Starting Base'}
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#3D2E24', fontWeight: 600, marginTop: '1px' }}>
                <strong>Landmark:</strong> {selectedCityDetail.landmark} • <strong>Elevation:</strong> {selectedCityDetail.elevation}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                {selectedCityDetail.desc}
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedCityDetail(null)}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B'
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

    </div>
  );
}
