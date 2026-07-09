import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { update1DPhysics } from '../utils/physics';
import { CrateSVG, ChildSideSVG, TargetSVG, ForceArrowSVG } from './SvgAssets';

export default function PullActivity({ mass, friction, onComplete, onForceChange }) {
  const [position, setPosition] = useState(100);
  const [isPulling, setIsPulling] = useState(false);
  const [velocity, setVelocity] = useState(0);
  
  const positionRef = useRef(100);
  const velocityRef = useRef(0);
  const isPullingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const clickOffsetRef = useRef(0);
  const mouseXRef = useRef(0);
  const requestRef = useRef();
  const lastTimeRef = useRef();

  const PULL_FORCE = 150; // Newtons

  const animate = time => {
    if (lastTimeRef.current != undefined) {
      const dt = (time - lastTimeRef.current) / 1000;
      let isMoving = false;
      let currentVelocity = 0;

      if (isDraggingRef.current) {
        const targetPosition = mouseXRef.current - clickOffsetRef.current;
        const boundedTarget = Math.max(100, Math.min(targetPosition, 550));
        
        // Prevent moving backwards (to the left)
        const finalTarget = Math.max(positionRef.current, boundedTarget);
        const delta = finalTarget - positionRef.current;
        
        let targetVelocity = 0;
        if (delta > 0) {
          isMoving = true; 
          targetVelocity = delta / dt;
          positionRef.current = finalTarget;
        }
        
        // Smooth the velocity to prevent animation flickering when moving slowly
        currentVelocity = velocityRef.current * 0.8 + targetVelocity * 0.2;
        if (Math.abs(currentVelocity) < 1) currentVelocity = 0;
      }

      // Pose stays active as long as they are dragging
      isPullingRef.current = isDraggingRef.current;
      setIsPulling(isPullingRef.current);
      
      velocityRef.current = currentVelocity;
      setVelocity(currentVelocity);
      setPosition(positionRef.current);

      const currentForce = isMoving ? PULL_FORCE : 0;
      onForceChange(currentForce);

      // Check win condition (Target is at x = 600)
      if (positionRef.current >= 550) {
        onComplete();
        return; // Stop animation loop
      }
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [mass, friction]); // Re-bind if mass or friction changes

  // Update refs when state changes from handlers
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    clickOffsetRef.current = e.clientX - positionRef.current;
    mouseXRef.current = e.clientX;
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (isDraggingRef.current) {
      mouseXRef.current = e.clientX;
    }
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
    isPullingRef.current = false;
    setIsPulling(false);
    if (e.target.hasPointerCapture(e.pointerId)) {
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#e0f6ff' }}>
      
      {/* Ground */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '30%',
        background: friction === 0.05 ? '#e9ecef' : friction === 0.3 ? '#8b5a2b' : '#c2b280',
        borderTop: '4px solid rgba(0,0,0,0.1)'
      }} />

      {/* Target area */}
      <div style={{ position: 'absolute', bottom: '30%', left: '600px', transform: 'translateY(15px)' }}>
        <TargetSVG />
      </div>

      {/* Instructions */}
      <div style={{ position: 'absolute', top: 40, width: '100%', textAlign: 'center', pointerEvents: 'none' }}>
        <h2 style={{ color: '#1f2937', margin: 0, fontSize: '2rem', textShadow: '0 2px 4px rgba(255,255,255,0.5)' }}>What is a Pull?</h2>
        <p style={{ color: '#374151', fontSize: '1.2rem', marginTop: '0.5rem', fontWeight: '500' }}>
          Drag the character to the right to pull the crate towards the target.
        </p>
      </div>

      {/* Physics Objects */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ 
        position: 'absolute', 
        bottom: '30%', 
        left: position, 
        display: 'flex', 
        alignItems: 'flex-end',
        transition: 'none', // Controlled strictly by react state / RAF
        cursor: isPulling ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect: 'none'
      }}>
        
        {/* Crate */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <CrateSVG width={120} height={120} />
          {/* Rope connecting crate to child (child is to the right) */}
          <svg style={{ position: 'absolute', top: 50, right: -60, width: 60, height: 20, zIndex: 0 }}>
            <path d={isPulling ? "M 0,10 L 60,0" : "M 0,10 Q 30,20 60,0"} stroke="#e9c46a" strokeWidth="4" fill="none" />
          </svg>
        </div>

        {/* Child */}
        <div style={{ position: 'relative', zIndex: 2, marginLeft: '40px' }}>
          {/* Child facing left (pose='pulling') pulling the crate towards the right */}
          <ChildSideSVG pose={isPulling ? 'pulling' : 'idle'} isWalking={Math.abs(velocity) > 0.1} width={120} height={200} />
          {isPulling && (
            <div style={{ position: 'absolute', top: -30, left: 20 }}>
              <ForceArrowSVG direction="right" width={80} height={40} label="PULL" />
            </div>
          )}
        </div>
      </div>

      {/* Interaction Help */}
      <div style={{ position: 'absolute', bottom: 40, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          padding: '1rem 2rem',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '50px',
          fontWeight: 'bold',
          color: '#1f2937',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          pointerEvents: 'none'
        }}>
          Click and drag the character or crate to the right to pull!
        </div>
      </div>

      {/* Debug velocity (optional) 
      <div style={{ position: 'absolute', top: 10, left: 10 }}>
        V: {velocity.toFixed(2)} p: {position.toFixed(0)}
      </div> */}
    </div>
  );
}
