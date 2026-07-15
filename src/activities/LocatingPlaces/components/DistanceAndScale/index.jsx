import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Map, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function DistanceAndScale({ onComplete }) {
  const [step, setStep] = useState(1);
  const [q1Answered, setQ1Answered] = useState(null); // 'yes', 'no'
  const [q1ShowNotebook, setQ1ShowNotebook] = useState(false);
  const [q2Answer, setQ2Answer] = useState(null);
  const [q5Answer, setQ5Answer] = useState(null);
  const [q6Answer, setQ6Answer] = useState(null);

  const handleNext = () => setStep((s) => s + 1);

  // Reusable vector scene (the "2km road")
  const renderRoadScene = (scale = 1, showNotebook = false) => (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '350px', background: '#dcfce7', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Background Grid */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <motion.div 
        animate={{ scale }} 
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        style={{ width: '80%', position: 'relative', display: 'flex', alignItems: 'center' }}
      >
        {/* The Road */}
        <div style={{ width: '100%', height: '40px', background: '#475569', borderRadius: '4px', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%', height: '2px', background: 'white', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'white', opacity: 0.5 }} />
        </div>

        {/* Buildings */}
        <div style={{ position: 'absolute', left: '10%', bottom: '50px', width: '60px', height: '60px', background: '#ef4444', borderRadius: '8px', boxShadow: '0 4px 0 #b91c1c' }}><div style={{textAlign:'center', color:'white', fontWeight:'bold', marginTop:'15px', fontSize:'0.8rem'}}>School</div></div>
        <div style={{ position: 'absolute', left: '45%', top: '50px', width: '50px', height: '40px', background: '#10b981', borderRadius: '25px', boxShadow: '0 4px 0 #047857' }}><div style={{textAlign:'center', color:'white', fontWeight:'bold', marginTop:'10px', fontSize:'0.8rem'}}>Park</div></div>
        <div style={{ position: 'absolute', right: '10%', bottom: '50px', width: '70px', height: '50px', background: '#3b82f6', borderRadius: '8px', boxShadow: '0 4px 0 #1d4ed8' }}><div style={{textAlign:'center', color:'white', fontWeight:'bold', marginTop:'15px', fontSize:'0.8rem'}}>Hospital</div></div>
      </motion.div>
      
      <motion.div animate={{ scale }} transition={{ duration: 0.8, ease: 'easeInOut' }} style={{ marginTop: '2rem', padding: '0.5rem 1rem', background: '#ffffff', borderRadius: '20px', fontWeight: 'bold', color: '#334155', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        Actual Distance: 2 kilometres
      </motion.div>

      {/* Notebook Overlay for Step 1 */}
      <AnimatePresence>
        {showNotebook && (
          <motion.div
            initial={{ opacity: 0, scale: 1.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ position: 'absolute', top: '10%', bottom: '10%', left: '25%', right: '25%', background: 'rgba(255,255,255,0.75)', border: '4px solid #94a3b8', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', pointerEvents: 'none', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ width: '100%', height: '30px', borderBottom: '2px solid #ef4444', opacity: 0.3 }} />
            {Array.from({length: 8}).map((_, i) => (
               <div key={i} style={{ width: '100%', height: '30px', borderBottom: '1px solid #3b82f6', opacity: 0.2 }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div style={{ width: '100%', height: '750px', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
      
      {/* Top Bar for Back Button */}
      {step > 1 && (
        <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', background: 'var(--card-bg)' }}>
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      )}

      {/* Two Column Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* LEFT: Interactive Learning Area */}
        <div style={{ flex: '1 1 70%', padding: '2rem', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            
            {/* Step 1 & 2 Visual */}
            {(step === 1 || step === 2) && (
              <motion.div key="scene1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ width: '100%', height: '100%' }}>
                {renderRoadScene(step === 2 && q2Answer === 'Shrink the Road' ? 0.3 : 1, q1ShowNotebook)}
              </motion.div>
            )}

            {/* Step 3 Visual (Split Comparison) */}
            {step === 3 && (
              <motion.div key="scene3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ width: '100%', height: '100%', display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#475569' }}>Real World</h3>
                  {renderRoadScene(1)}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#475569' }}>Map</h3>
                  {renderRoadScene(0.4)}
                  <div style={{ marginTop: '-40px', padding: '0.4rem 1rem', background: '#4f46e5', color: 'white', borderRadius: '12px', fontWeight: 'bold', zIndex: 10 }}>4 centimetres</div>
                </div>
              </motion.div>
            )}

            {/* Step 4 Visual (Textbook Example) */}
            {step === 4 && (
              <motion.div key="scene4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                <div style={{ width: '300px', height: '60px', background: '#fcd34d', border: '2px solid #fbbf24', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', padding: '0 10px', boxShadow: '0 10px 25px rgba(251, 191, 36, 0.2)' }}>
                   {Array.from({length: 10}).map((_, i) => (
                     <div key={i} style={{ flex: 1, height: i % 5 === 0 ? '20px' : '10px', borderLeft: '2px solid #b45309' }} />
                   ))}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>1 cm</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                  <div style={{ width: '2px', height: '40px', background: 'currentColor' }} />
                  <span>represents</span>
                  <div style={{ width: '2px', height: '40px', background: 'currentColor' }} />
                </div>
                <div style={{ padding: '1.5rem 3rem', background: '#10b981', color: 'white', borderRadius: '24px', fontSize: '2rem', fontWeight: 'bold', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)' }}>
                  500 metres
                </div>
              </motion.div>
            )}

            {/* Step 5 Visual */}
            {step === 5 && (
              <motion.div key="scene5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ width: '100%', height: '100%', display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ padding: '2rem', background: 'white', color: '#1e293b', borderRadius: '20px', boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: q5Answer === '500 metres' ? '4px solid #10b981' : '4px solid transparent' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Illustration A</div>
                  <div style={{ fontSize: '2rem' }}>📏 1 cm</div>
                  <div style={{ color: '#94a3b8' }}>↓</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>500 metres</div>
                </div>
                <div style={{ padding: '2rem', background: 'white', color: '#1e293b', borderRadius: '20px', boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: q5Answer === '500 kilometres' ? '4px solid #ef4444' : '4px solid transparent' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Illustration B</div>
                  <div style={{ fontSize: '2rem' }}>📏 1 cm</div>
                  <div style={{ color: '#94a3b8' }}>↓</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>500 kilometres</div>
                </div>
              </motion.div>
            )}

            {/* Step 6 Visual */}
            {step === 6 && (
              <motion.div key="scene6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ width: '80px', height: '80px', background: '#ef4444', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>School</div>
                  <div style={{ position: 'relative', width: '200px', height: '10px', background: '#475569', borderRadius: '5px' }}>
                    <div style={{ position: 'absolute', top: '-30px', left: '0', width: '100%', textAlign: 'center', fontWeight: 'bold', color: '#334155' }}>Distance on map: 2 cm</div>
                  </div>
                  <div style={{ width: '80px', height: '80px', background: '#8b5cf6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>Library</div>
                </div>
                <div style={{ padding: '1rem 2rem', background: 'white', borderRadius: '16px', boxShadow: 'var(--card-shadow)', fontWeight: 'bold', fontSize: '1.5rem', color: '#4f46e5' }}>
                  Scale: 1 cm = 500 m
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>

        {/* RIGHT: Explanation Panel */}
        <div style={{ flex: '0 0 40%', minWidth: '400px', background: 'var(--card-bg)', padding: '2.5rem', borderLeft: '1px solid var(--border)', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            
            {/* Step 1 Content */}
            {step === 1 && (
              <motion.div key="panel1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid var(--border)' }}>
                  <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)' }}>Observation</h3>
                  <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', margin: '0 0 1rem 0' }}>The school is about 2 kilometres from the park.</p>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Can we draw such a huge distance on a notebook page?</p>
                </div>
                
                {!q1ShowNotebook ? (
                  <button className="primary" onClick={() => setQ1ShowNotebook(true)} style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    Let's Find Out
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ color: 'var(--text-heading)', fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>Can this entire road fit on this page?</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button onClick={() => setQ1Answered('yes')} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: q1Answered === 'yes' ? '2px solid #ef4444' : '2px solid var(--border)', background: q1Answered === 'yes' ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>Yes</button>
                      <button onClick={() => setQ1Answered('no')} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: q1Answered === 'no' ? '2px solid #10b981' : '2px solid var(--border)', background: q1Answered === 'no' ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>No</button>
                    </div>
                    {q1Answered === 'yes' && <p style={{ color: '#ef4444', margin: 0 }}>Try looking carefully. The road is much longer than the page.</p>}
                    {q1Answered === 'no' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <p style={{ color: '#10b981', fontWeight: 'bold', margin: '0 0 1.5rem 0' }}>Exactly! Real places are much larger than paper.</p>
                        <button className="primary" onClick={handleNext} style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>Next</button>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2 Content */}
            {step === 2 && (
              <motion.div key="panel2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 style={{ color: 'var(--text-heading)', margin: '0 0 2rem 0' }}>How do maps solve this problem?</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {['Fold the Road', 'Shrink the Road', 'Remove the Road'].map(opt => {
                    const isSelected = q2Answer === opt;
                    const isCorrect = opt === 'Shrink the Road';
                    return (
                      <button 
                        key={opt}
                        onClick={() => setQ2Answer(opt)}
                        style={{ padding: '1.25rem', borderRadius: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '1.1rem', border: isSelected ? (isCorrect ? '2px solid #10b981' : '2px solid #ef4444') : '2px solid var(--border)', background: isSelected ? (isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'var(--surface)', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {q2Answer && q2Answer !== 'Shrink the Road' && <p style={{ color: '#ef4444', marginTop: '1.5rem', fontWeight: 'bold' }}>That wouldn't help us create a useful map.</p>}
                {q2Answer === 'Shrink the Road' && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '2rem' }}>
                     <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>Excellent!</h3>
                     <p style={{ color: 'var(--text-secondary)', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>Maps reduce the size of everything while keeping their positions correct.</p>
                     <button className="primary" onClick={handleNext} style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>Next</button>
                   </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 3 Content */}
            {step === 3 && (
              <motion.div key="panel3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Real Distance</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>2 km</div>
                    <div style={{ color: 'var(--border)', fontSize: '1.5rem', margin: '0.5rem 0' }}>↓</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Map Distance</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>4 cm</div>
                  </div>
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>Map Scale</h3>
                <p style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>This relationship is called the Map Scale. It tells us how much real distance is represented on the map.</p>
                <button className="primary" onClick={handleNext} style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>See an Example</button>
              </motion.div>
            )}

            {/* Step 4 Content */}
            {step === 4 && (
              <motion.div key="panel4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 style={{ margin: '0 0 2rem 0', color: 'var(--text-heading)' }}>Example</h2>
                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '1.2rem', lineHeight: 1.6, margin: '0 0 2rem 0' }}>Every <strong style={{ color: 'var(--text-heading)' }}>1 centimetre</strong> on this map represents <strong style={{ color: '#10b981' }}>500 metres</strong> in the real world.</p>
                  <button className="primary" onClick={handleNext} style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>Check Understanding</button>
                </div>
              </motion.div>
            )}

            {/* Step 5 Content */}
            {step === 5 && (
              <motion.div key="panel5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-heading)' }}>Which scale belongs to our city map?</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {['500 metres', '500 kilometres'].map(opt => {
                    const isSelected = q5Answer === opt;
                    const isCorrect = opt === '500 metres';
                    return (
                      <button 
                        key={opt}
                        onClick={() => setQ5Answer(opt)}
                        style={{ padding: '1.25rem', borderRadius: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '1.1rem', border: isSelected ? (isCorrect ? '2px solid #10b981' : '2px solid #ef4444') : '2px solid var(--border)', background: isSelected ? (isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'var(--surface)', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {q5Answer === '500 kilometres' && <p style={{ color: '#ef4444', marginTop: '1.5rem', fontWeight: 'bold' }}>Think about the size of a city. Kilometres are too huge for this scale!</p>}
                {q5Answer === '500 metres' && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '2rem' }}>
                     <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>Great!</h3>
                     <p style={{ color: 'var(--text-secondary)', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>Small city maps usually use smaller real distances like metres.</p>
                     <button className="primary" onClick={handleNext} style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>Final Activity</button>
                   </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 6 Content */}
            {step === 6 && (
              <motion.div key="panel6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {q6Answer !== '1000 metres' ? (
                  <>
                    <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-heading)' }}>How far are they in real life?</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {['500 metres', '1000 metres', '1500 metres'].map(opt => {
                        const isSelected = q6Answer === opt;
                        const isCorrect = opt === '1000 metres';
                        return (
                          <button 
                            key={opt}
                            onClick={() => setQ6Answer(opt)}
                            style={{ padding: '1.25rem', borderRadius: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '1.1rem', border: isSelected && !isCorrect ? '2px solid #ef4444' : '2px solid var(--border)', background: isSelected && !isCorrect ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface)', cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', background: 'var(--surface)', padding: '3rem 2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                     <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)' }}>
                       <Map size={32} color="#10b981" />
                     </div>
                     <h2 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)' }}>Excellent!</h2>
                     <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>You discovered why maps use a scale. 2 cm means 2 × 500 = 1000 metres.</p>
                     <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)', borderRadius: '20px', fontWeight: 'bold', marginBottom: '2rem' }}>
                       🌟 Scale Explorer
                     </div>
                     <button className="primary" onClick={onComplete} style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                       Continue to Directions <ArrowRight size={20} />
                     </button>
                  </motion.div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
