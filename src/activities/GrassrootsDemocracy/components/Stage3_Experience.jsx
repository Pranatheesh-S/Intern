import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, UserCheck, FileText, Map, PieChart, Home, User, Bell, Droplet, MapPin, Hammer, AlertTriangle, BookOpen, CheckCircle2, Shield, Search } from 'lucide-react';
import useSound from 'use-sound';

// -----------------------------------------
// COMPONENT 1: Panchayat Formation Animation
// -----------------------------------------
const PanchayatFormation = () => {
  const [animStep, setAnimStep] = useState(0);
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  
  const advance = () => {
    playClick();
    if (animStep < 4) setAnimStep(s => s + 1);
  };

  const reset = () => {
    playClick();
    setAnimStep(0);
  };

  return (
    <div className="glass-panel" style={{ padding: '2.5rem', background: 'var(--card-bg)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
      <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '1.6rem' }}>
        <UserCheck size={28} /> The Gram Panchayat is Formed
      </h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.1rem', marginBottom: '2rem' }}>
        A village isn't just governed by one person. Click 'Next Step' to see how the democratic structure is built from the ground up!
      </p>

      <div style={{ position: 'relative', height: '320px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
        
        {/* Village Wards Area */}
        <div style={{ display: 'flex', gap: '2rem', position: 'absolute', top: animStep < 3 ? '50%' : '15%', transform: 'translateY(-50%)', transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          {[1, 2, 3].map(ward => (
            <div key={ward} style={{ width: '110px', height: '130px', background: animStep >= 0 ? 'var(--canvas-bg)' : 'transparent', border: animStep >= 0 ? '2px dashed var(--accent)' : 'none', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '1rem', transition: 'all 0.5s', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent)' }}>Ward {ward}</span>
              <AnimatePresence>
                {animStep >= 1 && (
                  <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ marginTop: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '45px', height: '45px', background: 'var(--accent)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' }}><User size={24} /></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '0.4rem', color: 'var(--text-primary)' }}>Panch</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Sarpanch Area */}
        <AnimatePresence>
          {animStep >= 2 && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1, top: animStep < 3 ? '15%' : '45%' }} style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <div style={{ width: '65px', height: '65px', background: 'var(--success)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white', boxShadow: '0 6px 15px rgba(16, 185, 129, 0.4)' }}><UserCheck size={32} /></div>
              <span style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '0.5rem', color: 'var(--success)', background: 'var(--success-bg)', padding: '0.2rem 0.8rem', borderRadius: '12px' }}>Sarpanch</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gram Panchayat Building */}
        <AnimatePresence>
          {animStep >= 3 && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ position: 'absolute', bottom: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ padding: '1.2rem 2.5rem', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white', border: '2px solid #334155', borderRadius: '20px', boxShadow: '0 15px 30px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Home size={36} color="#38bdf8" />
                <span style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '0.05em' }}>Gram Panchayat</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--accent)', flex: 1, minWidth: '300px' }}>
          {animStep === 0 && "1. The village is divided into multiple Wards."}
          {animStep === 1 && "2. Each Ward elects one representative (the Panch)."}
          {animStep === 2 && "3. The entire village elects the Sarpanch."}
          {animStep === 3 && "4. The Panchs + Sarpanch group together."}
          {animStep === 4 && "🎉 They form the Gram Panchayat for a 5-year term!"}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {animStep > 0 && <button onClick={reset} className="outline">Reset</button>}
          <button onClick={advance} className="primary" disabled={animStep === 4}>
            {animStep === 4 ? "Formation Complete" : "Next Step"} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------
// COMPONENT 2: Interactive Character Card
// -----------------------------------------
const InteractiveCharacterCard = ({ role, name, icon: Icon, color, bg, hotspots }) => {
  const [activeSpot, setActiveSpot] = useState(null);
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });

  return (
    <div className="glass-panel" style={{ padding: '2rem', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `3px solid ${color}`, boxShadow: `0 8px 20px ${bg}` }}>
          <Icon size={40} />
        </div>
        <div>
          <h3 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.8rem' }}>{role}</h3>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.3rem', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>{name}</div>
        </div>
      </div>

      <div style={{ position: 'relative', flex: 1, background: 'var(--card-bg)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        
        {hotspots.map((spot, i) => (
          <button 
            key={i} 
            onClick={() => { playClick(); setActiveSpot(i); }}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', 
              padding: '1.2rem 1rem', background: activeSpot === i ? color : 'var(--surface)', 
              color: activeSpot === i ? 'white' : 'var(--text-primary)', 
              border: `2px solid ${activeSpot === i ? color : 'var(--border)'}`, 
              borderRadius: '16px', cursor: 'pointer',
              transition: 'all 0.2s', width: '130px',
              boxShadow: activeSpot === i ? `0 10px 20px ${bg}` : '0 4px 6px rgba(0,0,0,0.05)'
            }}
          >
            <spot.icon size={28} color={activeSpot === i ? 'white' : color} />
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', textAlign: 'center', lineHeight: '1.2' }}>{spot.label}</span>
          </button>
        ))}
        
      </div>

      <div style={{ marginTop: '1.5rem', minHeight: '100px', padding: '1.5rem', background: activeSpot !== null ? bg : 'transparent', border: activeSpot !== null ? `2px solid ${color}` : '2px dashed var(--border)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'all 0.3s' }}>
        {activeSpot !== null ? (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} key={activeSpot} style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '500', lineHeight: '1.5' }}>
            <span style={{ fontWeight: '800', color: color, display: 'block', marginBottom: '0.4rem', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{hotspots[activeSpot].label}</span>
            {hotspots[activeSpot].desc}
          </motion.div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontStyle: 'italic' }}>
            Click the interactive items above to explore their duties.
          </div>
        )}
      </div>

    </div>
  );
};

// -----------------------------------------
// COMPONENT 3: Mini Practical Activity
// -----------------------------------------
const ProblemSolver = ({ onComplete }) => {
  const problems = [
    { desc: "The main village road has huge potholes.", correct: "Sarpanch (Gram Panchayat)", explanation: "The Gram Panchayat (led by the Sarpanch) is responsible for building and maintaining village infrastructure like roads, drainage, and water sources." },
    { desc: "Two farmers are arguing over where their field boundary lies.", correct: "Patwari", explanation: "The Patwari maintains all land records, measures boundaries, and resolves land disputes." },
    { desc: "An official record of the Gram Sabha meeting decisions needs to be documented.", correct: "Secretary", explanation: "The Secretary is the government-appointed official who calls meetings, documents decisions, and maintains official village records." },
    { desc: "The village needs to decide whether to prioritize building a new well or a school.", correct: "Gram Sabha", explanation: "Major decisions and prioritization of funds must be discussed and approved by the entire Gram Sabha (all adult villagers)." }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [playError] = useSound('https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3', { volume: 0.5 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });

  const handleSelect = (option) => {
    if (feedback && feedback.type === 'success') return; // Prevent clicking after correct
    
    if (option === problems[currentIndex].correct) {
      playSuccess();
      setFeedback({ type: 'success', text: problems[currentIndex].explanation });
    } else {
      playError();
      setFeedback({ type: 'error', text: `Not quite! The ${option} doesn't handle this. Try again.` });
    }
  };

  const nextProblem = () => {
    playClick();
    setFeedback(null);
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      onComplete();
    }
  };

  const options = ["Sarpanch (Gram Panchayat)", "Secretary", "Patwari", "Gram Sabha"];

  return (
    <div className="glass-panel" style={{ padding: '2.5rem', background: 'var(--card-bg)', borderRadius: '24px', borderTop: '4px solid #f59e0b' }}>
      <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', color: 'var(--text-heading)' }}>
        <AlertTriangle size={32} color="#f59e0b" /> Who Should Solve This?
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '2.5rem' }}>
        A villager has encountered a problem. Based on what you've learned, select the correct official or body to handle it!
      </p>

      <div style={{ background: 'var(--surface)', padding: '2.5rem', borderRadius: '20px', border: '2px solid var(--border)', marginBottom: '2.5rem', textAlign: 'center', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '1rem' }}>Scenario {currentIndex + 1} of {problems.length}</div>
        <div style={{ fontSize: '1.6rem', color: 'var(--text-primary)', fontWeight: 'bold', lineHeight: '1.5' }}>"{problems[currentIndex].desc}"</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {options.map(opt => (
          <button key={opt} onClick={() => handleSelect(opt)} className="outline" style={{ padding: '1.25rem', fontSize: '1.15rem', borderRadius: '16px', border: '2px solid var(--border)', background: 'var(--surface)' }}>
            {opt}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} style={{ padding: '1.5rem', background: feedback.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)', border: `2px solid ${feedback.type === 'success' ? 'var(--success)' : 'var(--danger)'}`, borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              {feedback.type === 'success' ? <CheckCircle2 size={28} color="var(--success)" style={{ flexShrink: 0, marginTop: '0.2rem' }} /> : <AlertTriangle size={28} color="var(--danger)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />}
              <div style={{ color: 'var(--text-primary)', fontSize: '1.2rem', lineHeight: '1.6', fontWeight: '500' }}>{feedback.text}</div>
            </div>
            {feedback.type === 'success' && (
              <button onClick={nextProblem} className="success" style={{ alignSelf: 'flex-end', padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '12px' }}>
                {currentIndex < problems.length - 1 ? "Next Scenario" : "Finish Activity"} <ArrowRight size={20} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// -----------------------------------------
// MAIN STAGE COMPONENT
// -----------------------------------------
export default function Stage3_Experience({ onComplete, addXp, setElectedSarpanch }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  
  const [step, setStep] = useState(0);
  const [votedFor, setVotedFor] = useState(null);
  const [activityCompleted, setActivityCompleted] = useState(false);

  const handleVote = (candidate) => {
    playClick();
    setVotedFor(candidate);
    if(setElectedSarpanch) setElectedSarpanch(candidate);
    setStep(1);
  };

  const continueAfterVote = () => {
    playSuccess();
    addXp(20);
    setStep(2);
  };

  const handleActivityComplete = () => {
    playSuccess();
    addXp(30);
    setActivityCompleted(true);
  };

  const secretaryHotspots = [
    { icon: BookOpen, label: "Meeting Register", desc: "Records the decisions and attendance of Gram Sabha meetings." },
    { icon: Bell, label: "Notice Board", desc: "Announces upcoming meetings and village notices to everyone." },
    { icon: Shield, label: "Government Seal", desc: "The Secretary is a government-appointed official, not an elected one." },
    { icon: FileText, label: "Village Records", desc: "Maintains official village documents and development plans." }
  ];

  const patwariHotspots = [
    { icon: Map, label: "Land Map", desc: "Maintains accurate maps of all agricultural and residential land." },
    { icon: Search, label: "Survey Equip", desc: "Measures land boundaries to resolve disputes between farmers." },
    { icon: Droplet, label: "Crop Records", desc: "Records what crops are grown in each field during every season." },
    { icon: FileText, label: "Village Register", desc: "Updates ownership records whenever land is bought or sold." }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', paddingBottom: '6rem' }}>
      
      {/* 1. Gram Panchayat & Gram Sabha */}
      <section>
        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Gram Panchayat & Gram Sabha
        </div>
        <h2 style={{ margin: 0, fontSize: '2.8rem', color: 'var(--text-heading)', marginBottom: '2rem' }}>
          Democracy in Action
        </h2>

        {step === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '3rem', background: 'var(--card-bg)', borderRadius: '24px' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', color: 'var(--text-heading)' }}>
              <Users size={32} color="var(--accent)" /> The Gram Sabha is gathering
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1.2rem' }}>
              The Gram Sabha consists of <strong>all eligible adult voters</strong> in the village. Anyone who is 18 years old or more and has the right to vote is a member. 
            </p>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.6', fontSize: '1.15rem', fontWeight: 'bold', marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', borderLeft: '6px solid var(--accent)' }}>
              These members elect the Sarpanch (Panchayat President). Today is election day! Two candidates are running, each with different development priorities.
            </p>
            
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => handleVote('Meera Devi')} className="outline" style={{ flex: 1, minWidth: '250px', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', borderRadius: '20px', background: 'var(--surface)' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--neutral-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>👩🏽</div>
                <div style={{ textAlign: 'center' }}>
                  <strong style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem', color: 'var(--text-heading)' }}>Meera Devi</strong>
                  <span style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>Focus: Better Schools & Clinics</span>
                </div>
                <div style={{ marginTop: '0.5rem', padding: '0.8rem 1.5rem', background: 'var(--accent)', color: 'white', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>Vote for Meera</div>
              </button>

              <button onClick={() => handleVote('Ramesh Kumar')} className="outline" style={{ flex: 1, minWidth: '250px', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', borderRadius: '20px', background: 'var(--surface)' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--neutral-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>👨🏽</div>
                <div style={{ textAlign: 'center' }}>
                  <strong style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem', color: 'var(--text-heading)' }}>Ramesh Kumar</strong>
                  <span style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>Focus: Roads & Agriculture</span>
                </div>
                <div style={{ marginTop: '0.5rem', padding: '0.8rem 1.5rem', background: 'var(--accent)', color: 'white', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}>Vote for Ramesh</div>
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, height: 0 }} className="glass-panel" style={{ padding: '3rem', background: 'var(--card-bg)', borderRadius: '24px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PieChart size={40} />
                </div>
              </div>
              <h3 style={{ margin: '0 0 2rem 0', fontSize: '2.2rem', color: 'var(--text-heading)' }}>Election Results</h3>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginBottom: '3rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{votedFor === 'Meera Devi' ? '👩🏽' : '👨🏽'}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>{votedFor}</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10b981', marginTop: '0.5rem' }}>58%</div>
                  <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'bold', letterSpacing: '0.1em' }}>WINNER</div>
                </div>
                
                <div style={{ width: '2px', background: 'var(--border)' }}></div>
                
                <div style={{ textAlign: 'center', opacity: 0.5 }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{votedFor === 'Meera Devi' ? '👨🏽' : '👩🏽'}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>{votedFor === 'Meera Devi' ? 'Ramesh Kumar' : 'Meera Devi'}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-muted)', marginTop: '0.5rem' }}>42%</div>
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '2rem', borderRadius: '16px', color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '2.5rem', border: '2px solid rgba(16,185,129,0.2)' }}>
                <strong>Congratulations!</strong> {votedFor} has secured the majority vote and is officially the new Sarpanch. This demonstrates how democratic decision-making works in a Gram Sabha!
              </div>

              <button onClick={continueAfterVote} className="success" style={{ padding: '1.2rem 2.5rem', fontSize: '1.2rem', borderRadius: '16px' }}>
                Continue Learning <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '2rem' }}>
              <PanchayatFormation />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 2. Secretary & Patwari */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '2.4rem', color: 'var(--text-heading)', marginBottom: '2rem' }}>The Officials Behind the Scenes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
              
              <InteractiveCharacterCard 
                role="The Secretary" 
                name="Government Appointed Official" 
                icon={FileText} 
                color="#38bdf8" 
                bg="rgba(56, 189, 248, 0.15)"
                hotspots={secretaryHotspots}
              />

              <InteractiveCharacterCard 
                role="The Patwari" 
                name="Village Land Record Officer" 
                icon={Map} 
                color="#eab308" 
                bg="rgba(234, 179, 8, 0.15)"
                hotspots={patwariHotspots}
              />

            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 3. Problem Solver Activity */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2rem' }}>
             <ProblemSolver onComplete={handleActivityComplete} />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer Navigation */}
      <AnimatePresence>
        {activityCompleted && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button 
              onClick={onComplete}
              className="primary" 
              style={{ padding: '1.5rem 3rem', gap: '1rem', borderRadius: '100px', fontSize: '1.4rem', boxShadow: '0 10px 30px rgba(79, 70, 229, 0.4)' }}
            >
              Meet Real Changemakers <ArrowRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
