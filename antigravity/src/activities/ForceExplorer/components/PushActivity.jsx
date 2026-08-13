import React, { useState, useEffect, useRef } from 'react';
import { update1DPhysics } from '../utils/physics';
import { CrateSVG, ChildSideSVG, TargetSVG, ForceArrowSVG } from './SvgAssets';

export default function PushActivity({ mass, friction, onComplete, onForceChange }) {
  const [position, setPosition] = useState(100);
  const [isPushing, setIsPushing] = useState(false);
  const [velocity, setVelocity] = useState(0);
  
  const positionRef = useRef(100);
  const velocityRef = useRef(0);
  const isPushingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const clickOffsetRef = useRef(0);
  const mouseXRef = useRef(0);
  const requestRef = useRef();
  const lastTimeRef = useRef();

  const PUSH_FORCE = 150; // Newtons

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
      isPushingRef.current = isDraggingRef.current;
      setIsPushing(isPushingRef.current);
      
      velocityRef.current = currentVelocity;
      setVelocity(currentVelocity);
      setPosition(positionRef.current);

      const currentForce = isMoving ? PUSH_FORCE : 0;
      onForceChange(currentForce);

      if (positionRef.current >= 550) {
        onComplete();
        return; 
      }
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [mass, friction]); 

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
    isPushingRef.current = false;
    setIsPushing(false);
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
      <div style={{ position: 'absolute', bottom: '30%', left: '700px', transform: 'translateY(15px)' }}>
        <TargetSVG />
      </div>

      {/* Instructions */}
      <div style={{ position: 'absolute', top: 40, width: '100%', textAlign: 'center', pointerEvents: 'none' }}>
        <h2 style={{ color: '#1f2937', margin: 0, fontSize: '2rem', textShadow: '0 2px 4px rgba(255,255,255,0.5)' }}>What is a Push?</h2>
        <p style={{ color: '#374151', fontSize: '1.2rem', marginTop: '0.5rem', fontWeight: '500' }}>
          Drag the character to the right to apply forward force and slide the crate to the target.
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
        cursor: isPushing ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect: 'none'
      }}>
        
        {/* Child (Pushing from left side) */}
        <div style={{ position: 'relative', zIndex: 2, marginRight: '-30px' }}>
          <ChildSideSVG pose={isPushing ? 'pushing' : 'idle'} isWalking={Math.abs(velocity) > 0.1} width={120} height={200} />
        </div>

        {/* Crate */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <CrateSVG width={120} height={120} />
          {isPushing && (
            <div style={{ position: 'absolute', top: 40, left: -20, zIndex: 10 }}>
              <ForceArrowSVG direction="right" width={80} height={40} label="PUSH" />
            </div>
          )}
        </div>
      </div>

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
          Click and drag the character or crate to the right to push!
        </div>
      </div>
    </div>
  );
}
