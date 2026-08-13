import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import India from '@svg-maps/india';
import { ArrowRight, MapPin } from 'lucide-react';

const STOPS = [
  { id: 'kashmir', label: 'Kashmir', x: 155, y: 70, title: 'Kashmir', 
    desc1: 'Welcome to Kashmir! The Himalayan expedition begins here.', 
    desc2: 'Snow-covered mountains stretch across the horizon, marking the western end of the Himalayan range.',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80', distance: 0 },
  { id: 'himachal', label: 'Himachal Pradesh', x: 200, y: 130, title: 'Himachal Pradesh', 
    desc1: 'This region is famous for beautiful hill stations and dense forests.', 
    desc2: 'Many people visit these mountains throughout the year.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', distance: 420 },
  { id: 'uttarakhand', label: 'Uttarakhand', x: 245, y: 165, title: 'Uttarakhand', 
    desc1: 'Several important rivers begin in these mountains.', 
    desc2: 'Millions of people depend on the water flowing from these glaciers.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', distance: 900 },
  { id: 'nepal', label: 'Nepal', x: 350, y: 220, title: 'Nepal', 
    desc1: 'The world\'s highest mountain, Mount Everest, stands here.', 
    desc2: 'It is one of the tallest parts of the Himalayan range.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80', distance: 1450 },
  { id: 'bhutan', label: 'Bhutan', x: 470, y: 235, title: 'Bhutan', 
    desc1: 'Bhutan is surrounded by the eastern Himalayas.', 
    desc2: 'Its mountains are known for their breathtaking landscapes.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80', distance: 1850 },
  { id: 'arunachal', label: 'Arunachal Pradesh', x: 510, y: 215, title: 'Arunachal Pradesh', 
    desc1: 'You have reached the eastern end of the Himalayas.', 
    desc2: 'The journey across nearly 2500 kilometres is now complete.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80', distance: 2500 }
];

// Highlighted states along the route
const ROUTE_STATES = ['jk', 'la', 'hp', 'ut', 'sk', 'ar', 'as'];

export default function HimalayanMap({ currentStopIndex, travelState, onStopReached, onNextStop, onFinish }) {
  const currentStop = STOPS[currentStopIndex];
  const nextStop = STOPS[Math.min(currentStopIndex + 1, STOPS.length - 1)];

  // Progress is a continuous value from 0 to 5
  const progress = useMotionValue(currentStopIndex);
  
  // Transform progress into X and Y coordinates for camera and beacon
  const stopIndices = STOPS.map((_, i) => i);
  const stopXs = STOPS.map(s => s.x);
  const stopYs = STOPS.map(s => s.y);
  
  const beaconX = useTransform(progress, stopIndices, stopXs);
  const beaconY = useTransform(progress, stopIndices, stopYs);
  
  // Scale and camera offsets
  const cameraScale = useTransform(progress, [0, 5], [1, 1.25]); // Zoom slightly as we go east
  const cameraX = useTransform(beaconX, x => (306 - x) * 0.4);
  const cameraY = useTransform(beaconY, y => (150 - y) * 0.4);

  useEffect(() => {
    // Preload next image
    if (nextStop && nextStop.image) {
      const img = new Image();
      img.src = nextStop.image;
    }
  }, [nextStop]);

  useEffect(() => {
    if (travelState === 'TRAVELLING') {
      const targetIndex = currentStopIndex + 1;
      
      const animation = animate(progress, targetIndex, {
        duration: 3,
        ease: "easeInOut",
        onComplete: () => {
          onStopReached();
        }
      });
      
      return animation.stop;
    } else {
      progress.set(currentStopIndex); // Ensure we are perfectly aligned when IDLE
    }
  }, [travelState, currentStopIndex]);

  // Use simple straight lines for the route path to match our linear interpolation beacon
  const pathD = `M ${STOPS[0].x} ${STOPS[0].y} ` + STOPS.map((s, i) => {
    if (i === 0) return '';
    return `L ${s.x} ${s.y}`;
  }).join(' ');

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '500px', overflow: 'hidden' }}>
      
      <motion.div
        style={{ 
          width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, display: 'flex', justifyContent: 'center',
          scale: cameraScale,
          x: cameraX,
          y: cameraY
        }}
      >
        <svg viewBox="0 0 612 400" style={{ width: '100%', height: '100%', maxWidth: '900px' }}>
          
          {/* Base Map States */}
          <g style={{ filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.1))' }}>
            {India.locations.map(location => {
              const isHimalayan = ROUTE_STATES.includes(location.id);
              const isReached = isHimalayan && currentStopIndex > 0;
              
              return (
                <motion.path
                  key={location.id}
                  d={location.path}
                  fill={isHimalayan ? 'rgba(139, 92, 246, 0.15)' : 'var(--card-bg)'}
                  stroke={isHimalayan ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.05)'}
                  strokeWidth="1"
                />
              );
            })}
          </g>
          
          {/* Faint route background */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="3"
            strokeDasharray="6 6"
          />

          {/* Active Glowing Route Interpolation */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="#10B981"
            strokeWidth="4"
            style={{ 
              pathLength: useTransform(progress, [0, 5], [0, 1]),
              filter: 'drop-shadow(0 0 8px #10B981)' 
            }}
          />

          {/* Highest Peaks highlight near Nepal */}
          <AnimatePresence>
            {currentStopIndex >= 3 && (
              <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                {/* Everest */}
                <path d="M 390 220 L 395 200 L 400 220 Z" fill="#fff" opacity="0.9" />
                <text x="395" y="195" fill="#fff" fontSize="8" textAnchor="middle">Mount Everest</text>
                
                {/* Kanchenjunga */}
                <path d="M 430 225 L 435 205 L 440 225 Z" fill="#fff" opacity="0.9" />
                <text x="435" y="200" fill="#fff" fontSize="8" textAnchor="middle">Kanchenjunga</text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* Static Waypoint Markers */}
          {STOPS.map((stop, index) => {
            const isReached = currentStopIndex >= index;
            return (
              <g key={stop.id} transform={`translate(${stop.x}, ${stop.y})`}>
                <circle
                  r="4"
                  fill={isReached ? '#10B981' : 'var(--border)'}
                  stroke={isReached ? '#059669' : 'transparent'}
                  strokeWidth="1.5"
                />
                <text 
                  x="0" 
                  y="-15" 
                  fill={isReached ? '#fff' : 'var(--text-muted)'} 
                  fontSize="8" 
                  fontWeight={isReached ? 'bold' : 'normal'}
                  textAnchor="middle"
                  style={{ pointerEvents: 'none' }}
                >
                  {stop.label}
                </text>
              </g>
            );
          })}

          {/* Animated Glowing Explorer Beacon */}
          <motion.g style={{ x: beaconX, y: beaconY }}>
            <motion.circle
              r="8"
              fill="#fff"
              stroke="#8b5cf6"
              strokeWidth="2"
              style={{ filter: 'drop-shadow(0 0 10px #8b5cf6)' }}
            />
            {travelState === 'TRAVELLING' && (
              <motion.circle
                r="8"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
            {travelState === 'IDLE' && (
              <motion.circle
                r="6"
                fill="none"
                stroke="#10B981"
                strokeWidth="4"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.g>
        </svg>
      </motion.div>

      {/* Cinematic Discovery Popup - Moved outside the camera so it acts as a fixed UI overlay */}
      <AnimatePresence>
        {travelState === 'IDLE' && (
          <motion.div
            key={currentStop.id}
            initial={{ opacity: 0, scale: 0.9, x: 20, y: "-50%", filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, x: 0, y: "-50%", filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, x: 20, y: "-50%", filter: 'blur(10px)' }}
            transition={{ delay: 0.5, duration: 0.6, type: 'spring' }} // 500ms delay as requested
            style={{
              position: 'absolute',
              right: '2.5rem',
              top: '50%',
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              width: '420px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05) inset',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Image Section */}
            <div style={{ width: '100%', height: '180px', position: 'relative' }}>
              <img 
                src={currentStop.image} 
                alt={currentStop.label} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,1), transparent)' }} />
              <h4 style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', margin: 0, color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {currentStop.title}
              </h4>
            </div>

            {/* Content Section */}
            <div style={{ padding: '1.5rem' }}>
              <p style={{ margin: '0 0 1rem 0', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                {currentStop.desc1} {currentStop.desc2}
              </p>

              {/* Progress Details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stop</div>
                  <div style={{ fontSize: '1.1rem', color: 'var(--accent)', fontWeight: 'bold' }}>{currentStopIndex + 1} / {STOPS.length}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Distance Covered</div>
                  <div style={{ fontSize: '1.1rem', color: '#10B981', fontWeight: 'bold' }}>{currentStop.distance} km</div>
                </div>
              </div>

              {/* Action Button */}
              {currentStopIndex < STOPS.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onNextStop}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, var(--accent) 0%, #6366f1 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)'
                  }}
                >
                  Next Stop <ArrowRight size={18} />
                </motion.button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ textAlign: 'center', color: '#10B981', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <MapPin size={20} /> Destination Reached
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onFinish}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: '#fff',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
                    }}
                  >
                    Finish Expedition
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
