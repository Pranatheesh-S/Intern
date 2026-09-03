import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { RealisticCup } from './RealisticCup';

export const DraggableCup = ({ cup, isWeighed, onDragStart, onDrop, onDragPosition, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const grabOffsetRef = useRef({ x: 40, y: 50 }); // Center of 80x100 cup
  const lastPointerRef = useRef({ x: 0, time: Date.now() });

  // Spring velocity smoothing for liquid/material tilt in portal
  const velocityXMotion = useMotionValue(0);
  const smoothVelocityX = useSpring(velocityXMotion, { damping: 40, stiffness: 300 });
  const rotateZ = useTransform(smoothVelocityX, [-600, 600], [-3.5, 3.5]);

  const checkScaleOverlap = (clientX, clientY) => {
    const scaleEl = document.querySelector('[data-droptarget="scale"]');
    if (scaleEl) {
      const scaleRect = scaleEl.getBoundingClientRect();
      const cupWidth = 80;
      const cupHeight = 100;
      const cupLeft = clientX - grabOffsetRef.current.x;
      const cupTop = clientY - grabOffsetRef.current.y;
      const cupRight = cupLeft + cupWidth;
      const cupBottom = cupTop + cupHeight;
      
      const isOver = !(
        cupRight < scaleRect.left || 
        cupLeft > scaleRect.right || 
        cupBottom < scaleRect.top || 
        cupTop > scaleRect.bottom
      );
      if (isOver) return true;
    }
    
    const elements = document.elementsFromPoint(clientX, clientY);
    return elements.some(el => el?.getAttribute?.('data-droptarget') === 'scale');
  };

  const handlePointerDown = (e) => {
    if (disabled || isWeighed) return;

    // Capture initial grab location relative to the cup element
    const rect = e.currentTarget.getBoundingClientRect();
    grabOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    setDragPos({
      x: e.clientX - grabOffsetRef.current.x,
      y: e.clientY - grabOffsetRef.current.y
    });

    lastPointerRef.current = { x: e.clientX, time: Date.now() };
    setIsDragging(true);
    if (onDragStart) onDragStart();

    const onPointerMove = (moveEvent) => {
      const currentX = moveEvent.clientX;
      const currentY = moveEvent.clientY;
      const now = Date.now();
      const dt = Math.max(1, now - lastPointerRef.current.time);
      const dx = currentX - lastPointerRef.current.x;
      
      const currentVelX = (dx / dt) * 1000;
      velocityXMotion.set(currentVelX);
      lastPointerRef.current = { x: currentX, time: now };

      setDragPos({
        x: currentX - grabOffsetRef.current.x,
        y: currentY - grabOffsetRef.current.y
      });

      if (onDragPosition) {
        const isOver = checkScaleOverlap(currentX, currentY);
        onDragPosition(isOver);
      }
    };

    const onPointerUp = (upEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      setIsDragging(false);
      velocityXMotion.set(0);
      if (onDragPosition) onDragPosition(false);

      const isOver = checkScaleOverlap(upEvent.clientX, upEvent.clientY);
      if (isOver && !disabled && !isWeighed) {
        onDrop(cup.id);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  return (
    <div style={{ position: 'relative', width: '80px', height: '100px', margin: '0 auto' }}>
      {/* Resting shadow on the card */}
      <div 
        style={{
          position: 'absolute',
          bottom: -4, left: '15%', right: '15%', height: '8px',
          background: 'rgba(87, 65, 51, 0.15)',
          borderRadius: '50%',
          filter: 'blur(3px)',
          opacity: isDragging ? 0.8 : (isWeighed ? 0.2 : 0.4),
          transition: 'opacity 0.2s'
        }}
      />
      
      {isWeighed ? (
        <div style={{ width: '100%', height: '100%', opacity: 0.45, filter: 'saturate(0.8)', pointerEvents: 'none' }}>
          <RealisticCup material={cup.id} velocityX={0} />
        </div>
      ) : (
        <>
          {/* Card Anchor Cup */}
          <div
            onPointerDown={handlePointerDown}
            style={{
              width: '100%',
              height: '100%',
              cursor: disabled ? 'default' : (isDragging ? 'grabbing' : 'grab'),
              touchAction: 'none',
              userSelect: 'none',
              opacity: isDragging ? 0 : 1, // Hidden on the card while actively rendered in top-level portal
              transition: 'opacity 0.1s'
            }}
          >
            {/* Extended grab area */}
            <div style={{ position: 'absolute', top: '-25px', bottom: '-25px', left: '-25px', right: '-25px', background: 'transparent' }} />
            <RealisticCup material={cup.id} velocityX={0} />
          </div>

          {/* Top-Level Drag Layer Portal: Renders directly under document.body with max z-index */}
          {isDragging && createPortal(
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 999999,
                overflow: 'hidden'
              }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  left: dragPos.x,
                  top: dragPos.y,
                  width: '80px',
                  height: '100px',
                  rotateZ,
                  scale: 1.08,
                  filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.35))',
                  transformOrigin: '50% 50%',
                  pointerEvents: 'none'
                }}
              >
                <RealisticCup material={cup.id} velocityX={smoothVelocityX} />
                
                {/* Dynamic diffuse lift shadow attached to the floating cup */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: -16,
                    left: '10%', right: '10%',
                    height: 14,
                    background: 'rgba(0,0,0,0.35)',
                    borderRadius: '50%',
                    filter: 'blur(8px)',
                    transform: 'scale(1.2)'
                  }}
                />
              </motion.div>
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  );
};

DraggableCup.propTypes = {
  cup: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    material: PropTypes.string,
    mass: PropTypes.number
  }).isRequired,
  isWeighed: PropTypes.bool.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDragPosition: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};
