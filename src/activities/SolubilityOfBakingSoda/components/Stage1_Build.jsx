import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  RotateCcw,
  ArrowRight,
  Info,
  Lock,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Droplet
} from "lucide-react";
import {
  TripodSVG,
  SpiritLampSVG,
  WireGauzeSVG,
  BeakerEmptySVG,
  BeakerFullSVG,
  WaterBottleSVG,
  BakingSodaBoxSVG,
  GlassRodSVG,
  LabStandSVG,
  ThermometerSVG
} from "./LabElements";

const STEPS = [
  {
    id: "tripod",
    name: "Tripod Stand",
    desc: "A three-legged stand that provides a stable base for heating experiments.",
    hint: "Place the tripod stand in the center.",
    prereq: [],
    icon: <TripodSVG style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "spiritLamp",
    name: "Spirit Lamp",
    desc: "Provides the heat source for the experiment.",
    hint: "Place the spirit lamp beneath the tripod stand.",
    prereq: ["tripod"],
    icon: <SpiritLampSVG style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "wireGauze",
    name: "Wire Gauze",
    desc: "Distributes heat evenly and supports the beaker.",
    hint: "Place the wire gauze on top of the tripod.",
    prereq: ["tripod"],
    icon: <WireGauzeSVG style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "beaker",
    name: "Beaker",
    desc: "Glass container used to hold the solution.",
    hint: "Place the empty beaker onto the wire gauze.",
    prereq: ["wireGauze"],
    icon: <BeakerEmptySVG style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "water",
    name: "Water",
    desc: "The solvent for our experiment.",
    hint: "Pour water into the beaker.",
    prereq: ["beaker"],
    icon: <WaterBottleSVG style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "bakingSoda",
    name: "Baking Soda",
    desc: "The solute we are trying to dissolve.",
    hint: "Add baking soda to the water.",
    prereq: ["water"],
    icon: <BakingSodaBoxSVG style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "glassRod",
    name: "Glass Rod",
    desc: "Used for stirring to help the solute dissolve.",
    hint: "Place the glass rod into the beaker.",
    prereq: ["beaker"],
    icon: <GlassRodSVG style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "labStand",
    name: "Laboratory Stand",
    desc: "Holds other apparatus securely in place.",
    hint: "Place the laboratory stand next to the tripod.",
    prereq: [],
    icon: <LabStandSVG hasClamp={true} style={{ width: '40px', height: '40px' }} />
  },
  {
    id: "thermometer",
    name: "Thermometer",
    desc: "Measures the temperature of the solution.",
    hint: "Attach the thermometer to the laboratory stand so it dips into the beaker.",
    prereq: ["labStand", "water"],
    icon: <ThermometerSVG style={{ width: '40px', height: '40px' }} />
  }
];

function DraggableItem({ id, item, isLocked }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: isLocked,
  });

  const baseStyle = {
    position: 'relative',
    padding: '0.75rem',
    borderRadius: '0.75rem',
    border: '2px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: isLocked ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    touchAction: "none",
    minWidth: "90px",
    height: "100px",
    borderColor: isLocked ? 'var(--border)' : (isDragging ? '#3b82f6' : 'var(--border)'),
    backgroundColor: isLocked ? 'rgba(0, 0, 0, 0.05)' : (isDragging ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-primary)'),
    boxShadow: isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
    transform: isDragging ? 'scale(1.05)' : 'none',
    zIndex: isDragging ? 50 : 1,
    opacity: isLocked ? 0.6 : 1
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={baseStyle}
      className={!isLocked && !isDragging ? 'draggable-hover' : ''}
    >
      {isLocked && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.05)', borderRadius: '0.75rem', backdropFilter: 'blur(1px)' }}>
          <Lock size={24} color="var(--text-muted)" />
        </div>
      )}
      <div style={{ pointerEvents: 'none', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {item.icon}
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.25, color: 'var(--text-color)' }}>
        {item.name}
      </span>
    </div>
  );
}

function DroppableWorkspace({ placedItems, isHovering }) {
  const { setNodeRef } = useDroppable({
    id: "workspace",
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '500px',
        borderRadius: '1rem',
        border: isHovering ? '2px solid #3b82f6' : '2px dashed var(--border)',
        backgroundColor: isHovering ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-secondary)',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Background hint */}
      {!Object.keys(placedItems).length && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '1rem' }}>
          <FlaskConical size={64} opacity={0.3} />
          <p style={{ fontWeight: 500, fontSize: '1.125rem' }}>Drag components here to build the setup</p>
        </div>
      )}

      {/* Assembly Canvas */}
      <div style={{ position: 'relative', width: '400px', height: '400px' }}>
        {/* Lab Stand (Background) */}
        <AnimatePresence>
          {placedItems["labStand"] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ position: 'absolute', left: '10px', top: '0px', width: '120px', height: '380px' }}
            >
              <LabStandSVG hasClamp={true} style={{ width: '100%', height: '100%' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tripod */}
        <AnimatePresence>
          {placedItems["tripod"] && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ position: 'absolute', left: '130px', top: '240px', width: '140px', height: '140px' }}
            >
              <TripodSVG style={{ width: '100%', height: '100%' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spirit Lamp */}
        <AnimatePresence>
          {placedItems["spiritLamp"] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ position: 'absolute', left: '155px', top: '290px', width: '90px', height: '90px' }}
            >
              <SpiritLampSVG isLit={false} style={{ width: '100%', height: '100%' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wire Gauze */}
        <AnimatePresence>
          {placedItems["wireGauze"] && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ position: 'absolute', left: '140px', top: '240px', width: '120px', height: '30px' }}
            >
              <WireGauzeSVG style={{ width: '100%', height: '100%' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Beaker & Water & Baking Soda */}
        <AnimatePresence>
          {placedItems["beaker"] && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ position: 'absolute', left: '140px', top: '130px', width: '120px', height: '140px' }}
            >
              {placedItems["water"] ? (
                <BeakerFullSVG hasSoda={!!placedItems["bakingSoda"]} style={{ width: '100%', height: '100%' }} />
              ) : (
                <BeakerEmptySVG style={{ width: '100%', height: '100%' }} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glass Rod */}
        <AnimatePresence>
          {placedItems["glassRod"] && (
            <motion.div
              initial={{ opacity: 0, x: 50, y: -50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              style={{ position: 'absolute', left: '200px', top: '90px', width: '70px', height: '140px', transformOrigin: 'bottom left', rotate: '15deg' }}
            >
              <GlassRodSVG style={{ width: '100%', height: '100%' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thermometer */}
        <AnimatePresence>
          {placedItems["thermometer"] && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ position: 'absolute', left: '105px', top: '40px', width: '50px', height: '220px' }}
            >
              <ThermometerSVG style={{ width: '100%', height: '100%' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Stage1_Build({ onComplete }) {
  const [placed, setPlaced] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [showError, setShowError] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setShowError(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const id = active.id;

    if (over && over.id === "workspace") {
      setPlaced((prev) => ({ ...prev, [id]: true }));
    }
    setActiveId(null);
  };

  const activeItem = activeId ? STEPS.find((s) => s.id === activeId) : null;
  const currentHint = activeItem || null;

  const isComplete = STEPS.every((s) => placed[s.id]);

  useEffect(() => {
    if (isComplete) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#10b981", "#f59e0b"]
      });
    }
  }, [isComplete]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 160px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--text-heading)' }}>Experimental Setup</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Drag and drop the components to build the laboratory setup.</p>
        </div>
        <button
          onClick={() => setPlaced({})}
          className="outline"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[snapCenterToCursor]}
      >
        <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: '550px', flexWrap: 'wrap' }}>
          {/* Component Tray & Info */}
          <div style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontWeight: 'bold', margin: 0, color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Component Tray
                </h3>
              </div>
              <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  {STEPS.map((step) => {
                    if (placed[step.id]) return null;
                    return (
                      <DraggableItem
                        key={step.id}
                        id={step.id}
                        item={step}
                        isLocked={false}
                      />
                    );
                  })}
                </div>
                {STEPS.every((s) => placed[s.id]) && (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '0.5rem', minHeight: '150px' }}>
                    <CheckCircle2 size={48} color="#10b981" opacity={0.8} />
                    <p style={{ fontWeight: 500 }}>All components placed</p>
                  </div>
                )}
              </div>
            </div>

            {/* Info Panel */}
            <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--accent-border)' }}>
              <h3 style={{ fontWeight: 'bold', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', marginTop: 0 }}>
                <Info size={20} /> Guidance
              </h3>
              {currentHint ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p style={{ color: 'var(--text-color)', fontWeight: 500, margin: 0 }}>{currentHint.desc}</p>
                </div>
              ) : isComplete ? (
                <p style={{ color: 'var(--text-color)', fontWeight: 500, margin: 0 }}>
                  Excellent job! The experimental setup is ready. Click the button to proceed.
                </p>
              ) : (
                <p style={{ color: 'var(--text-color)', fontWeight: 500, margin: 0 }}>
                  Drag any components from the tray into the workspace to assemble the setup.
                </p>
              )}
            </div>
          </div>

          {/* Workspace Area */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <DroppableWorkspace placedItems={placed} isHovering={!!activeId} />
            
            {showError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}
              >
                <AlertCircle size={20} />
                {showError}
              </motion.div>
            )}

            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
                      <CheckCircle2 size={32} color="#10b981" />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1.125rem', margin: 0 }}>Setup Complete!</h3>
                      <p style={{ color: '#10b981', fontWeight: 500, margin: 0 }}>You have successfully assembled the experimental apparatus.</p>
                    </div>
                  </div>
                  <button
                    onClick={onComplete}
                    className="primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                  >
                    Start Experiment <ArrowRight size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <DragOverlay>
          {activeItem ? (
            <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--bg-primary)', border: '2px solid #3b82f6', borderRadius: '0.75rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.9, transform: 'scale(1.1)' }}>
              <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activeItem.icon}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textAlign: 'center', color: 'var(--text-color)' }}>
                {activeItem.name}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <style>{`
        .draggable-hover:hover {
          border-color: #60a5fa !important;
          background-color: rgba(59, 130, 246, 0.1) !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
