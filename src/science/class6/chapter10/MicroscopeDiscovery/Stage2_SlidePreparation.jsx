import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage2_SlidePreparation({ onComplete, addXp }) {
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', { volume: 0.5 });
  const [playError] = useSound('https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3', { volume: 0.5 });
  const [playPop] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', msg: string }
  const [isWaiting, setIsWaiting] = useState(false);

  const steps = [
    { id: 'water_wash', toolId: 'water', instruction: "Wash the onion bulb", errorMsg: "We must clean the onion first to remove dirt.", xp: 2 },
    { id: 'knife', toolId: 'knife', instruction: "Cut the onion vertically", errorMsg: "We need to cut the onion to reach the fleshy inner layers.", xp: 2 },
    { id: 'forceps', toolId: 'forceps', instruction: "Remove the thin transparent peel", errorMsg: "Use forceps to gently remove the thin inner layer (onion peel).", xp: 2 },
    { id: 'petri', toolId: 'petri', instruction: "Place the peel inside a Petri dish", errorMsg: "The peel will dry out in the air! Put it in the Petri dish.", xp: 2 },
    { id: 'saffranin', toolId: 'saffranin', instruction: "Add Saffranin stain", errorMsg: "We need to stain the cells red/pink so their parts are clearly visible.", xp: 2 },
    { id: 'timer', toolId: 'timer', instruction: "Wait for 30 seconds for the stain to set", errorMsg: "We must wait for the stain to absorb into the cell walls.", xp: 2 },
    { id: 'water_rinse', toolId: 'water', instruction: "Wash away the excess stain", errorMsg: "Too much stain will make the slide too dark. Wash the excess.", xp: 2 },
    { id: 'slide', toolId: 'slide', instruction: "Place a clean glass slide on the table", errorMsg: "We need a clean glass slide to mount the peel.", xp: 2 },
    { id: 'brush', toolId: 'brush', instruction: "Transfer the stained peel onto the glass slide", errorMsg: "Use the brush carefully so the peel doesn't fold or break.", xp: 2 },
    { id: 'glycerin', toolId: 'glycerin', instruction: "Add a drop of Glycerin", errorMsg: "Glycerin prevents the cells from drying out and improves visual clarity.", xp: 2 },
    { id: 'coverslip', toolId: 'coverslip', instruction: "Place a cover slip over the peel", errorMsg: "The cover slip flattens the specimen and protects it. Place it gently to avoid air bubbles.", xp: 2 },
    { id: 'microscope', toolId: 'microscope', instruction: "Observe the slide under the microscope", errorMsg: "The slide is ready! Take it to the microscope.", xp: 2 },
  ];

  const tools = [
    { id: 'onion', name: 'Onion Bulb', icon: '🧅' },
    { id: 'water', name: 'Distilled Water', icon: '💧' },
    { id: 'knife', name: 'Scalpel / Knife', icon: '🔪' },
    { id: 'forceps', name: 'Forceps', icon: '🥢' },
    { id: 'petri', name: 'Petri Dish', icon: '🧫' },
    { id: 'saffranin', name: 'Saffranin Stain', icon: '🩸' },
    { id: 'timer', name: 'Timer Clock', icon: '⏱️' },
    { id: 'slide', name: 'Glass Slide', icon: '▭' },
    { id: 'brush', name: 'Thin Brush', icon: '🖌️' },
    { id: 'glycerin', name: 'Glycerin', icon: '🧪' },
    { id: 'coverslip', name: 'Cover Slip', icon: '◻️' },
    { id: 'microscope', name: 'Microscope', icon: '🔬' },
  ];

  const handleToolDrop = (toolId) => {
    if (isWaiting || currentStepIndex >= steps.length) return;

    const currentStep = steps[currentStepIndex];

    if (toolId === currentStep.toolId) {
      // Correct Tool
      playPop();
      if (toolId === 'timer') {
        setIsWaiting(true);
        setFeedback({ type: 'success', msg: "Waiting 30 seconds for stain to set..." });
        setTimeout(() => {
          setIsWaiting(false);
          playSuccess();
          setFeedback({ type: 'success', msg: "Great! The peel is now stained properly." });
          addXp(currentStep.xp);
          setCurrentStepIndex(prev => prev + 1);
        }, 3000); // 3 seconds in UI time
      } else {
        playSuccess();
        setFeedback({ type: 'success', msg: "Correct! " + currentStep.instruction + " done." });
        addXp(currentStep.xp);
        setCurrentStepIndex(prev => prev + 1);
      }
    } else {
      // Wrong Tool
      playError();
      setFeedback({ type: 'error', msg: currentStep.errorMsg });
    }
  };

  const currentStepInfo = steps[currentStepIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem' }}>
      
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-heading)', margin: '0 0 0.5rem 0' }}>Preparing a Microscope Slide</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
          Follow the correct laboratory sequence to prepare a temporary mount of an onion peel. Drag the correct tools into the center workspace.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>
        
        {/* Left Toolbar */}
        <div style={{ 
          width: '280px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)',
          padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', overflowY: 'auto',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-heading)' }}>Lab Equipment</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {tools.map(tool => (
              <motion.div
                key={tool.id}
                drag
                dragSnapToOrigin
                onDragEnd={(e, info) => {
                  // Very basic hit detection (if dropped towards the right)
                  if (info.offset.x > 100) {
                    handleToolDrop(tool.id);
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1, zIndex: 10 }}
                style={{ 
                  background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px',
                  padding: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                  cursor: 'grab', userSelect: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>{tool.icon}</span>
                <span style={{ fontSize: '0.75rem', textAlign: 'center', fontWeight: '500', color: 'var(--text-secondary)' }}>{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Center Workspace */}
        <div style={{ 
          flex: 1, background: '#f8fafc', borderRadius: '16px', border: '2px dashed var(--border)',
          display: 'flex', flexDirection: 'column', padding: '2rem', position: 'relative'
        }}>
          
          {/* Current Instruction */}
          {currentStepInfo ? (
            <div style={{ background: 'var(--accent-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--accent-border)', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0, color: 'var(--accent)', fontSize: '1.2rem' }}>
                Task {currentStepIndex + 1}: {currentStepInfo.instruction}
              </h3>
            </div>
          ) : (
            <div style={{ background: 'var(--success-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--success)', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0, color: 'var(--success)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle /> Slide Preparation Complete!
              </h3>
            </div>
          )}

          {/* Feedback Banner */}
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div 
                key={feedback.msg}
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ 
                  padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: feedback.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                  color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)',
                  border: `1px solid ${feedback.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
                }}
              >
                {feedback.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                <strong>{feedback.msg}</strong>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Visual Workspace Area (Drop target visualization) */}
          <div style={{ 
            flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', 
            background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            position: 'relative'
          }}>
            <span style={{ position: 'absolute', top: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 'bold' }}>
              DROP TOOLS HERE
            </span>
            
            {/* Visualizing the current state of the experiment */}
            <div style={{ fontSize: '4rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {currentStepIndex >= 0 && currentStepIndex < 2 && <span>🧅</span>}
              {currentStepIndex >= 2 && currentStepIndex < 4 && <span>🧅🥢</span>}
              {currentStepIndex >= 4 && currentStepIndex < 7 && <span>🧫🩸</span>}
              {currentStepIndex >= 7 && currentStepIndex < 11 && <span>▭</span>}
              {currentStepIndex >= 11 && <span>🔬</span>}
              {isWaiting && (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Clock size={48} color="var(--warning)" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Next Stage Button */}
          {currentStepIndex >= steps.length && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <button className="primary" onClick={onComplete} style={{ padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '30px' }}>
                Next: Observe the Slide <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
