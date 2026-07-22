import React, { useState, useEffect, useRef } from 'react';
import { update1DPhysics } from '../utils/physics';
import { CrateSVG, ChildSideSVG, TargetSVG, ForceArrowSVG } from './SvgAssets';

export default function CarryActivity({ mass, friction, onComplete, onForceChange }) {
  const [position, setPosition] = useState(100);
  const [isCarrying, setIsCarrying] = useState(false);
  const [velocity, setVelocity] = useState(0);
  
  const positionRef = useRef(100);
  const velocityRef = useRef(0);
  const isCarryingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const clickOffsetRef = useRef(0);
  const mouseXRef = useRef(0);
  const requestRef = useRef();
  const lastTimeRef = useRef();

  // In carry, we just move horizontally at a constant speed while button is held
  // We apply a force to overcome friction, plus an upward force to overcome gravity.
  const animate = time => {
    if (lastTimeRef.current != undefined) {
      const dt = (time - lastTimeRef.current) / 1000;
      
      let isMoving = false;
      let currentVelocity = 0;
      
      if (isDraggingRef.current) {
        const targetPosition = mouseXRef.current - clickOffsetRef.current;
        const boundedTarget = Math.max(100, Math.min(targetPosition, 650));
        
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

      velocityRef.current = currentVelocity;
      setVelocity(currentVelocity);

      isCarryingRef.current = isDraggingRef.current;
      setIsCarrying(isCarryingRef.current);
      setPosition(positionRef.current);

      const horizontalForce = isMoving ? 150 : 0;
      const currentForce = isMoving ? horizontalForce + (mass * 9.81) : 0;
      onForceChange(currentForce);

      if (positionRef.current >= 650) {
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
  }, [mass]); 

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
    isCarryingRef.current = false;
    setIsCarrying(false);
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
        background: '#8b5a2b',
        borderTop: '4px solid rgba(0,0,0,0.1)'
      }} />

      {/* Target area */}
      <div style={{ position: 'absolute', bottom: '30%', left: '750px', transform: 'translateY(15px)' }}>
        <TargetSVG />
      </div>

      {/* Instructions */}
      <div style={{ position: 'absolute', top: 40, width: '100%', textAlign: 'center', pointerEvents: 'none', zIndex: 10 }}>
        <h2 style={{ color: '#1f2937', margin: 0, fontSize: '2rem', textShadow: '0 2px 4px rgba(255,255,255,0.5)' }}>What is Carry?</h2>
        <p style={{ color: '#374151', fontSize: '1.2rem', marginTop: '0.5rem', fontWeight: '500' }}>
          Drag the character to the right to carry the crate.
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
        cursor: isCarrying ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect: 'none'
      }}>
        
        {/* Child Carrying */}
        <div style={{ position: 'relative', zIndex: 1, width: 120, height: 200 }}>
          {isCarrying ? (
             <div style={{ position: 'absolute', zIndex: 0, top: 46, left: 105 }}>
                <CrateSVG width={80} height={80} />
                <div style={{ position: 'absolute', top: -35, left: 10 }}>
                  <ForceArrowSVG direction="up" width={60} height={30} label="LIFT" />
                </div>
                <div style={{ position: 'absolute', top: 25, right: -45 }}>
                  <ForceArrowSVG direction="right" width={60} height={30} label="WALK" />
                </div>
             </div>
          ) : (
            <div style={{ position: 'absolute', zIndex: 0, top: 120, left: 120 }}>
                <CrateSVG width={80} height={80} />
            </div>
          )}
          
          <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
            <ChildSideSVG pose={isCarrying ? 'carrying' : 'idle'} isWalking={Math.abs(velocity) > 0.1} width={120} height={200} />
          </div>
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
          Click and drag the character or crate to the right to carry!
        </div>
      </div>
    </div>
  );
}
