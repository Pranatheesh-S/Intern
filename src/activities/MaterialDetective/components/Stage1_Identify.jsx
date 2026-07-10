import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import AIMentor from './AIMentor';
import ThreeDObjectViewer from './ThreeDObjectViewer';

const OBJECTS = [
  {
    id: 'spoon',
    name: 'Shiny Spoon',
    material: 'Metal',
    description: 'A smooth, heavy spoon used for eating soup.',
    hint: 'It does not break when dropped, feels cold, and shines under light.',
    correctMsg: 'Brilliant! The spoon is made of Metal (Steel). Metals are chosen because they are shiny (lustrous), strong, and do not break easily.',
    wrongMsgs: {
      Wood: "A wooden spoon wouldn't show this bright metallic shine (lustre) and is much thicker and less rigid.",
      Glass: "A glass spoon would be extremely fragile and dangerous, as it could easily break and shatter in your mouth!",
      Plastic: "A plastic spoon is light and has low heat resistance, whereas this spoon is heavy, cold to the touch, and conducts heat rapidly.",
      Leather: "Leather is soft and flexible; you cannot scoop liquid with a floppy leather spoon!",
      Cotton: "Cotton is soft and highly absorbent; it would soak up liquid rather than scoop it."
    },
    color: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
    icon: '🥄'
  },
  {
    id: 'chair',
    name: 'Study Chair',
    material: 'Wood',
    description: 'A sturdy chair to sit on while studying.',
    hint: 'It comes from trees, feels warm, and has beautiful organic grain patterns.',
    correctMsg: 'Spot on! This chair is made of Wood. Wood is strong, easy to shape, and is a natural material derived from trees.',
    wrongMsgs: {
      Metal: "A metal chair would be much heavier, cold to touch, and have a shiny, metallic surface instead of these woody fibers.",
      Glass: "A glass chair would be transparent, but highly dangerous and fragile, easily shattering when someone sits down.",
      Plastic: "A plastic chair is synthetic and lightweight, but this one has natural grain rings and organic structures.",
      Leather: "Leather is flexible and soft; it needs a solid frame underneath and cannot stand upright as a chair on its own.",
      Cotton: "Cotton is a soft fabric; a chair needs rigid structural strength to support human weight."
    },
    color: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
    icon: '🪑'
  },
  {
    id: 'tumbler',
    name: 'Glass Tumbler',
    material: 'Glass',
    description: 'A transparent cup for holding water.',
    hint: 'You can see right through it, but be careful—it is fragile and breaks easily!',
    correctMsg: 'Excellent! The tumbler is made of Glass. Glass is transparent, allowing us to see the liquid inside, and holds water perfectly without leaking.',
    wrongMsgs: {
      Wood: "A wooden cup is opaque and absorbs liquids over time, whereas we need transparent, impermeable material.",
      Metal: "A metal tumbler is shiny and opaque; you wouldn't be able to see the color and height of the liquid inside.",
      Plastic: "A plastic tumbler could hold water, but this tumbler is fragile, heavy, and shines with a crystal-like transparency unique to glass.",
      Leather: "Leather is flexible and permeable; a leather tumbler would eventually soak through and warp.",
      Cotton: "A cotton cup is porous and absorbent; water would leak out instantly!"
    },
    color: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    icon: '🥛'
  },
  {
    id: 'ruler',
    name: 'Flexible Ruler',
    material: 'Plastic',
    description: 'A clear measuring ruler that can bend slightly.',
    hint: 'It is lightweight, synthetic, waterproof, and can be easily colored.',
    correctMsg: 'Correct! The ruler is made of Plastic. Plastics are synthetic materials that are light, durable, and can be molded into precise shapes.',
    wrongMsgs: {
      Wood: "A wooden ruler is thick, completely opaque, and organic; this ruler is transparent and synthetic.",
      Metal: "A metal ruler is heavy, reflects light with high lustre, and is difficult to bend without permanent damage.",
      Glass: "A glass ruler would be rigid and transparent, but extremely dangerous because it can easily shatter in a pencil box.",
      Leather: "Leather is too floppy and soft; a ruler must be flat and rigid enough to draw straight lines.",
      Cotton: "Cotton is a soft fabric; you cannot measure or draw straight lines with a piece of cloth!"
    },
    color: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
    icon: '📏'
  },
  {
    id: 'boot',
    name: 'Outdoor Boot',
    material: 'Leather',
    description: 'A tough, water-resistant boot for walking.',
    hint: 'Made from animal hide, it is flexible, durable, and protects your feet.',
    correctMsg: 'Great job! The boot is made of Leather. Leather is flexible, breathable, and tough, making it perfect for shoes.',
    wrongMsgs: {
      Wood: "A wooden shoe would be rigid, heavy, and extremely uncomfortable to walk in, as it cannot flex with your foot.",
      Metal: "A metal boot would be heavy, rigid, cold, and loud. It doesn't flex or breathe.",
      Glass: "A glass boot would shatter under your weight, cutting your feet! It is rigid and extremely fragile.",
      Plastic: "A plastic boot is possible, but it does not have this natural skin texture, breathability, and tough fibrous structure.",
      Cotton: "A cotton shoe (like a canvas sneaker) is soft and gets soaked instantly in water, while this boot is designed to be tough and water-resistant."
    },
    color: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    icon: '🥾'
  },
  {
    id: 'shirt',
    name: 'Cotton Shirt',
    material: 'Cotton',
    description: 'A soft, breathable shirt to wear in summer.',
    hint: 'It is a plant-based fabric that absorbs sweat and feels very soft against your skin.',
    correctMsg: 'Perfect! The shirt is made of Cotton. Cotton is a soft fiber collected from cotton plants, which is spun into breathable fabric.',
    wrongMsgs: {
      Wood: "Wood is rigid and hard; a shirt made of wood would lock your body in place and scratch your skin!",
      Metal: "A metal shirt (like chainmail) is heavy, cold, and rigid, offering no sweat absorption or softness.",
      Glass: "A glass shirt is rigid and fragile; it would break into sharp pieces as you move!",
      Plastic: "A plastic shirt (like a plastic bag) is impermeable and makes you sweat, lacking the soft, breathable texture of cotton fabric.",
      Leather: "A leather jacket exists, but this thin, lightweight summer shirt is woven from soft plant fibers."
    },
    color: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    icon: '👕'
  }
];

const MATERIALS = ['Wood', 'Metal', 'Glass', 'Plastic', 'Leather', 'Cotton'];

export default function Stage1_Identify({ onComplete }) {
  const [selectedObj, setSelectedObj] = useState(null);
  const [identified, setIdentified] = useState({});
  const [mentorState, setMentorState] = useState('idle');
  const [mentorText, setMentorText] = useState(
    "Welcome to the Crime Scene, Detective! 🕵️‍♂️ We have 6 objects here. We need to identify what materials they are made of. Click on any object on the workbench to inspect it."
  );
  const [mentorHint, setMentorHint] = useState("");

  const handleSelectObject = (obj) => {
    setSelectedObj(obj);
    if (identified[obj.id]) {
      setMentorState('success');
      setMentorText(obj.correctMsg);
      setMentorHint("");
    } else {
      setMentorState('idle');
      setMentorText(`Analyzing the ${obj.name}. ${obj.description} What material do you think this object is made of?`);
      setMentorHint("");
    }
  };

  const handleSelectMaterial = (materialName) => {
    if (!selectedObj) return;

    if (materialName === selectedObj.material) {
      const nextIdentified = { ...identified, [selectedObj.id]: true };
      setIdentified(nextIdentified);
      setMentorState('success');
      setMentorText(selectedObj.correctMsg);
      setMentorHint("");
    } else {
      setMentorState('error');
      const scientificReason = selectedObj.wrongMsgs?.[materialName] || `Oops! That doesn't seem right for the ${selectedObj.name}. Let's look closer.`;
      setMentorText(scientificReason);
      setMentorHint(selectedObj.hint);
    }
  };

  const identifiedCount = Object.keys(identified).length;
  const isFinished = identifiedCount === OBJECTS.length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: '1.25rem', alignItems: 'stretch' }}>
      {/* 1. Left Side: Detective's Workbench */}
      <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>🛠️</span> Workbench
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
          Inspect each object on the desk and scan its composition. Identify all 6 to solve Case 1!
        </p>

        {/* Grid of Objects - vertical 2-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          padding: '0.75rem',
          background: 'var(--canvas-bg)',
          borderRadius: '12px',
          border: '2px dashed var(--accent)',
          flex: 1,
          alignContent: 'start'
        }}>
          {OBJECTS.map((obj) => {
            const isDone = identified[obj.id];
            const isCurrent = selectedObj?.id === obj.id;

            return (
              <motion.button
                key={obj.id}
                onClick={() => handleSelectObject(obj)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: obj.color,
                  border: isCurrent 
                    ? '3px solid var(--accent)' 
                    : isDone 
                      ? '3px solid var(--success)' 
                      : '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1rem 0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  minHeight: '100px',
                  position: 'relative',
                  boxShadow: isCurrent 
                    ? '0 0 12px rgba(99, 102, 241, 0.4)' 
                    : 'none',
                  color: '#1e293b'
                }}
              >
                {/* Status Indicator Badge */}
                <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
                  {obj.icon}
                </span>
                
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  color: '#0f172a',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  {obj.name}
                </span>

                {isDone && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '4px', 
                    right: '4px', 
                    background: 'white', 
                    borderRadius: '50%',
                    padding: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 2. Center: Large section box to view objects in 360 view & small section below for options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Top: 360 View Box */}
        <div className="glass-panel" style={{ 
          padding: '1.25rem', 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1,
          position: 'relative'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-heading)' }}>
            <Eye size={18} /> 360° Object Viewer
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0.75rem 0' }}>
            Click and drag the model to rotate and inspect it in 360 degrees.
          </p>

          <div style={{
            flex: 1,
            borderRadius: '12px',
            background: 'var(--canvas-bg)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '280px'
          }}>
            {selectedObj ? (
              <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                <ThreeDObjectViewer objectId={selectedObj.id} />
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>
                Select an object from the workbench to inspect it in 360°
              </div>
            )}
          </div>
        </div>

        {/* Bottom: Lens Scanner / Options */}
        <div className="glass-panel" style={{ 
          padding: '1.25rem', 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          border: '1.5px solid var(--accent-border)',
          minHeight: '120px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <AnimatePresence mode="wait">
            {selectedObj ? (
              <motion.div
                key={selectedObj.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ width: '100%' }}
              >
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-heading)' }}>
                  Lens Scanner: {selectedObj.name}
                </h4>
                <p style={{ margin: '0.25rem 0 0.75rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Select the core material used to make this object:
                </p>

                {identified[selectedObj.id] ? (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    color: 'var(--success)', 
                    background: 'var(--success-bg)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--success-border)',
                    fontWeight: 'bold',
                    fontSize: '0.8rem'
                  }}>
                    <CheckCircle2 size={16} />
                    Composition verified: {selectedObj.material}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {MATERIALS.map((mat) => (
                      <button
                        key={mat}
                        onClick={() => handleSelectMaterial(mat)}
                        className="outline"
                        style={{
                          padding: '0.3rem 0.7rem',
                          fontSize: '0.75rem',
                          borderRadius: '8px',
                          background: 'var(--surface)',
                          cursor: 'pointer'
                        }}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
                Lens Scanner ready. Choose an object to scan.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Right: Progress & AI Mentor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Case Progress */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-heading)' }}>
            Case 1 Progress
          </h4>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
            <div style={{ flex: 1, height: '8px', background: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${(identifiedCount / OBJECTS.length) * 100}%`, 
                background: 'var(--success)',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
              {identifiedCount}/{OBJECTS.length}
            </span>
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {isFinished 
              ? "All materials identified! You can now solve the case and proceed to classification."
              : "Scan objects to locate and verify their molecular makeup."}
          </div>

          <button 
            onClick={() => {
              setIdentified({});
              setSelectedObj(null);
              setMentorState('idle');
              setMentorText("Progress reset! Click on any object on the workbench to inspect it.");
              setMentorHint("");
            }}
            className="outline" 
            style={{ 
              width: '100%', 
              marginTop: '0.75rem', 
              fontSize: '0.8rem', 
              padding: '0.4rem',
              borderRadius: '8px',
              gap: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RefreshCw size={12} /> Reset Stage
          </button>

          {isFinished && (
            <motion.button
              onClick={onComplete}
              className="success"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                marginTop: '1rem',
                fontSize: '0.85rem',
                padding: '0.6rem',
                gap: '0.35rem'
              }}
            >
              Solve Case & Proceed <ArrowRight size={14} />
            </motion.button>
          )}
        </div>

        {/* AI Mentor */}
        <AIMentor 
          state={mentorState} 
          text={mentorText} 
          hint={mentorHint} 
        />
      </div>
    </div>
  );
}
