import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';

const GRID_COLS = 9;
const GRID_ROWS = 7;
const MIN_X = -4;
const MAX_X = 4;
const MIN_Y = -3;
const MAX_Y = 3;

const DroppableCell = ({ x, y, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${x},${y}`
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isOver ? 'rgba(255,255,255,0.5)' : 'transparent',
      }}
    >
      {children}
    </div>
  );
};

const DraggableCharacter = ({ isDragging }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: 'character'
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        position: 'absolute',
        fontSize: '2.5rem',
        zIndex: 10,
        filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))',
        opacity: isDragging ? 0 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'all 0.3s ease'
      }}
    >
      🧑‍🔬🧲
    </div>
  );
};

export default function MapGrid({ characterPos, items, activeDragId }) {
  // Generate grid cells
  const cells = [];
  // Y goes from MAX_Y down to MIN_Y so that positive Y is up
  for (let y = MAX_Y; y >= MIN_Y; y--) {
    for (let x = MIN_X; x <= MAX_X; x++) {
      const isCharacterHere = characterPos.x === x && characterPos.y === y;
      const itemHere = items.find(i => i.x === x && i.y === y);

      let decoration = null;
      let decSize = '1.4rem';
      // Approximate the island's organic shape using an ellipse formula
      const isSea = (x * x / 20.25 + y * y / 12.25) >= 0.8;
      
      if (!itemHere && !isSea) {
        const seed = Math.abs(x * 13 + y * 7) + 1; // +1 to avoid 0 for (0,0)
        if (seed % 5 === 0) { decoration = '🌿'; decSize = '1.2rem'; }
        else if (seed % 7 === 0) { decoration = '🪨'; decSize = '1.8rem'; }
        else if (seed % 11 === 0) { decoration = '🌲'; decSize = '3rem'; }
        else if (seed % 13 === 0) { decoration = '🍄'; decSize = '1.4rem'; }
        else if (seed % 17 === 0) { decoration = '🌾'; decSize = '1.3rem'; }
      }

      cells.push(
        <DroppableCell key={`${x},${y}`} x={x} y={y}>
          {decoration && (
            <div style={{ position: 'absolute', fontSize: decSize, opacity: 0.8, pointerEvents: 'none', zIndex: 0 }}>
              {decoration}
            </div>
          )}

          {/* Axis Labels removed per user request */}

          {/* Item */}
          {itemHere && (
            <div style={{ 
              fontSize: '2.2rem', 
              opacity: itemHere.discovered ? 0.6 : 1,
              filter: itemHere.discovered 
                ? (itemHere.type === 'magnetic' ? 'drop-shadow(0 0 8px #ef4444)' : 'none') 
                : 'drop-shadow(0 0 12px rgba(255, 255, 255, 1)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))',
              zIndex: 5
            }}>
              {itemHere.icon}
            </div>
          )}

          {/* Character */}
          {isCharacterHere && (
            <DraggableCharacter isDragging={activeDragId === 'character'} />
          )}
        </DroppableCell>
      );
    }
  }

  return (
    <div className="glass-panel" style={{ 
      flex: 1, 
      background: '#38bdf8', // Ocean water blue
      padding: '2rem',
      position: 'relative',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* The Island Shape */}
      <div style={{
        position: 'absolute',
        top: '10%',
        bottom: '10%',
        left: '5%',
        right: '5%',
        background: '#bef264', // Grassy island green
        borderRadius: '45% 55% 40% 60% / 55% 45% 60% 40%', // Organic blob shape
        boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.1), 10px 10px 30px rgba(0,100,200,0.3)',
        pointerEvents: 'none'
      }} />

      {/* Grid and Axes overlay */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
        height: '100%',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Main axes removed per user request */}

        {cells}
      </div>
    </div>
  );
}
