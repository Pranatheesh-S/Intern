import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import India from '@svg-maps/india';

const STATE_TO_REGION = {
  // Himalayas
  jk: 'himalayas', la: 'himalayas', hp: 'himalayas', ut: 'himalayas', sk: 'himalayas', ar: 'himalayas',
  // Plains
  pb: 'plains', hr: 'plains', up: 'plains', br: 'plains', wb: 'plains', dl: 'plains', ch: 'plains',
  // Desert
  rj: 'desert',
  // Plateau
  mp: 'plateau', mh: 'plateau', ka: 'plateau', tg: 'plateau', ct: 'plateau', jh: 'plateau', or: 'plateau',
  // West Coast
  gj: 'west_coast', ga: 'west_coast', kl: 'west_coast', dd: 'west_coast', dn: 'west_coast',
  // East Coast
  ap: 'east_coast', tn: 'east_coast', py: 'east_coast',
  // Islands
  an: 'islands', ld: 'islands',
  // Northeast
  as: 'northeast', ml: 'northeast', nl: 'northeast', mn: 'northeast', mz: 'northeast', tr: 'northeast'
};

const REGION_COLORS = {
  himalayas: { fill: '#C7D2FE', border: '#6366F1' },
  plains: { fill: '#D1FAE5', border: '#10B981' },
  desert: { fill: '#FEF3C7', border: '#F59E0B' },
  plateau: { fill: '#FBCFE8', border: '#EC4899' },
  west_coast: { fill: '#DBEAFE', border: '#3B82F6' },
  east_coast: { fill: '#E9D5FF', border: '#8B5CF6' },
  northeast: { fill: '#BBF7D0', border: '#22C55E' },
  islands: { fill: '#BAE6FD', border: '#0EA5E9' },
  default: { fill: 'var(--card-bg)', border: 'rgba(139, 92, 246, 0.3)' }
};

// Coordinates adjusted for viewBox="0 0 612 696"
const REGIONS = [
  { id: 'himalayas', label: 'Himalayas', description: 'Snow-covered Mountains', x: 200, y: 100, color: REGION_COLORS.himalayas.border },
  { id: 'plains', label: 'Northern Plains', description: 'Fertile River Valleys', x: 280, y: 250, color: REGION_COLORS.plains.border },
  { id: 'desert', label: 'Thar Desert', description: 'Golden Sand Dunes', x: 120, y: 280, color: REGION_COLORS.desert.border },
  { id: 'plateau', label: 'Peninsular Plateau', description: 'Rocky Elevated Terrain', x: 250, y: 400, color: REGION_COLORS.plateau.border },
  { id: 'west_coast', label: 'Western Coast', description: 'Arabian Sea Shoreline', x: 150, y: 500, color: REGION_COLORS.west_coast.border },
  { id: 'east_coast', label: 'Eastern Coast', description: 'Bay of Bengal Shoreline', x: 280, y: 550, color: REGION_COLORS.east_coast.border },
  { id: 'islands', label: 'Islands', description: 'Tropical Archipelagos', x: 500, y: 600, color: REGION_COLORS.islands.border },
  { id: 'northeast', label: 'Northeast', description: 'Dense Green Hills', x: 480, y: 250, color: REGION_COLORS.northeast.border }
];

export default function ExpeditionMap({ currentStopIndex, onStopReached }) {
  const [activeInfo, setActiveInfo] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    // Sequence the animation automatically for the intro
    let timer;
    if (currentStopIndex < REGIONS.length - 1) {
      timer = setTimeout(() => {
        onStopReached(currentStopIndex + 1);
      }, 1500); // 1.5 seconds per stop
    }
    
    // Show info card temporarily
    setActiveInfo(REGIONS[currentStopIndex]);
    const infoTimer = setTimeout(() => {
      setActiveInfo(null);
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearTimeout(infoTimer);
    };
  }, [currentStopIndex, onStopReached]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Container for Map and camera effects */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          x: [0, -10, 10, 0],
          y: [0, 5, -5, 0]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ position: 'relative', width: '90%', height: '90%', maxWidth: '700px', maxHeight: '800px' }}
      >
        <svg viewBox={India.viewBox} style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.2))' }}>
          
          {/* Base Map States */}
          {India.locations.map(location => {
            const regionId = STATE_TO_REGION[location.id];
            // Find the index of this region in our REGIONS array
            const regionIndex = REGIONS.findIndex(r => r.id === regionId);
            
            // If the route has reached this region, color it. Otherwise, use default dark color.
            const isReached = regionIndex !== -1 && currentStopIndex >= regionIndex;
            const fillColor = isReached ? REGION_COLORS[regionId].fill : REGION_COLORS.default.fill;
            const strokeColor = isReached ? REGION_COLORS[regionId].border : REGION_COLORS.default.border;

            return (
              <motion.path
                key={location.id}
                d={location.path}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth="1.5"
                initial={false}
                animate={{
                  fill: fillColor,
                  stroke: strokeColor
                }}
                transition={{ duration: 0.8 }}
                onMouseEnter={() => {
                  if (regionIndex !== -1) setHoverInfo(REGIONS[regionIndex]);
                }}
                onMouseLeave={() => setHoverInfo(null)}
                style={{ cursor: regionIndex !== -1 ? 'pointer' : 'default' }}
              />
            );
          })}

          {/* Glowing Animated Route connecting the regions */}
          <motion.path
            d={`M ${REGIONS[0].x} ${REGIONS[0].y} ` + REGIONS.map((r, i) => i > 0 ? `L ${r.x} ${r.y}` : '').join(' ')}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: (currentStopIndex) / (REGIONS.length - 1) }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ filter: 'drop-shadow(0 0 8px #8b5cf6)' }}
          />

          {/* Region Markers */}
          {REGIONS.map((region, index) => {
            const isReached = currentStopIndex >= index;
            const isActive = currentStopIndex === index;

            return (
              <g key={region.id} transform={`translate(${region.x}, ${region.y})`}>
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: isReached ? 1 : 0 }}
                  transition={{ type: 'spring' }}
                  r="6"
                  fill={region.color}
                  onMouseEnter={() => setHoverInfo(region)}
                  onMouseLeave={() => setHoverInfo(null)}
                  style={{ cursor: 'pointer' }}
                />
                {isActive && (
                  <motion.circle
                    r="12"
                    fill="none"
                    stroke={region.color}
                    strokeWidth="2"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ pointerEvents: 'none' }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Info Popup */}
        <AnimatePresence>
          {(hoverInfo || activeInfo) && (
            <motion.div
              key={(hoverInfo || activeInfo).id}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                left: `${((hoverInfo || activeInfo).x / 612) * 100}%`,
                top: `${((hoverInfo || activeInfo).y / 696) * 100 - 2}%`,
                pointerEvents: 'none',
                zIndex: 50,
              }}
            >
              <div style={{
                transform: (hoverInfo || activeInfo).x > 400 ? 'translate(-95%, -100%)' : 'translate(-50%, -100%)',
                background: 'var(--card-bg)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${(hoverInfo || activeInfo).color}`,
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                boxShadow: `var(--card-shadow)`
              }}>
                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-heading)', fontSize: '1rem' }}>{(hoverInfo || activeInfo).label}</h4>
                <p style={{ margin: 0, color: 'var(--map-popup-desc)', fontSize: '0.8rem' }}>{(hoverInfo || activeInfo).description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* Estimated Journey Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          background: 'var(--card-bg)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--card-border)',
          padding: '1rem',
          borderRadius: '12px',
          zIndex: 30
        }}
      >
        <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Expedition Details</h5>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div>
            <div style={{ color: 'var(--text-heading)', fontSize: '1.1rem', fontWeight: 'bold' }}>20 Min</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Duration</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-heading)', fontSize: '1.1rem', fontWeight: 'bold' }}>7</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Stops</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-heading)', fontSize: '1.1rem', fontWeight: 'bold' }}>15+</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Activities</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
