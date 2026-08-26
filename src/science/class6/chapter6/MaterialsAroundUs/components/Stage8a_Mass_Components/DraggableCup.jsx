import React, { useState } from 'react';
import { motion, useMotionValue, useVelocity, useSpring, useTransform } from 'framer-motion';
import { RealisticCup } from './RealisticCup';

export const DraggableCup = ({ cup, isWeighed, onDrop, disabled }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const velocityX = useVelocity(x);
  const velocityY = useVelocity(y);

  // Smooth velocity for tilt
  const smoothVelocityX = useSpring(velocityX, { damping: 50, stiffness: 400 });
  const smoothVelocityY = useSpring(velocityY, { damping: 50, stiffness: 400 });

  // Rotate based on velocity
  const rotateY = useTransform(smoothVelocityX, [-1000, 1000], [-15, 15]);
  const rotateX = useTransform(smoothVelocityY, [-1000, 1000], [15, -15]);
  
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    
    // Find elements under the cursor drop point
    const elements = document.elementsFromPoint(info.point.x, info.point.y);
    const isOverScale = elements.some(el => el.getAttribute('data-droptarget') === 'scale');

    if (isOverScale && !disabled && !isWeighed) {
      onDrop(cup.id);
    }
  };
  
  return (
    <div style={{ position: 'relative', width: '80px', height: '100px', margin: '0 auto' }}>
      {/* Background shadow for the slot when cup is removed or being dragged */}
      <div 
        style={{
          position: 'absolute',
          bottom: -5, left: '10%', right: '10%', height: '10px',
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '50%',
          filter: 'blur(2px)',
        }}
      />
      
      <motion.div
        drag={!disabled && !isWeighed}
        dragSnapToOrigin={true}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{
          x, y,
          rotateX, rotateY,
          scale: isDragging ? 1.05 : 1,
          z: isDragging ? 50 : 0,
          cursor: (disabled || isWeighed) ? 'default' : (isDragging ? 'grabbing' : 'grab'),
          touchAction: 'none',
          perspective: 1000,
          transformStyle: 'preserve-3d',
          zIndex: isDragging ? 100 : 1,
          width: '100%',
          height: '100%',
          opacity: isWeighed ? 0.4 : 1,
          userSelect: 'none'
        }}
        whileHover={{ scale: (disabled || isWeighed) ? 1 : 1.02 }}
        whileTap={{ scale: (disabled || isWeighed) ? 1 : 1.05 }}
      >
        <RealisticCup material={cup.id} velocityX={smoothVelocityX} />
        
        {/* Dynamic Contact Shadow that follows the cup */}
        <motion.div 
          style={{
            position: 'absolute',
            bottom: -15, left: '15%', right: '15%', height: '12px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '50%',
            filter: 'blur(4px)',
            opacity: isDragging ? 0.6 : 0,
            scale: isDragging ? 0.8 : 1,
            pointerEvents: 'none'
          }}
        />
      </motion.div>
    </div>
  );
};
