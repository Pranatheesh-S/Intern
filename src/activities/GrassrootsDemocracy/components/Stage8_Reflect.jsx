import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Home, Building, Map as MapIcon, ArrowRight, ArrowLeft, X, CheckCircle, Info } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage8_Reflect({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [playOpen] = useSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', { volume: 0.3 });

  const [activeTopicIndex, setActiveTopicIndex] = useState(null);
  const [completedTopics, setCompletedTopics] = useState([]);
  
  // Disable body scroll when modal is open
  useEffect(() => {
    if (activeTopicIndex !== null) {
      document.body.style.overflow = 'hidden';
      if (!completedTopics.includes(activeTopicIndex)) {
        setCompletedTopics(prev => [...prev, activeTopicIndex]);
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeTopicIndex]);

  const topics = [
    {
      id: 'gram_sabha',
      title: 'Gram Sabha',
      subtitle: 'The Village Assembly',
      icon: Users,
      image: '/gram_sabha_illustration.png',
      color: '#0ea5e9',
      colorRgb: '14, 165, 233',
      explanation: 'The Gram Sabha is the general assembly of the village. It consists of all adults who live in the area covered by a Panchayat and have the right to vote.',
      keyPoints: [
        'Approves the annual budget and plans of the Gram Panchayat.',
        'Ensures the Panchayat is accountable to the people.',
        'Prevents misuse of village funds.'
      ],
      didYouKnow: 'Any person who is 18 years or older and has the right to vote is automatically a member of the Gram Sabha!'
    },
    {
      id: 'gram_panchayat',
      title: 'Gram Panchayat',
      subtitle: 'The Village Council',
      icon: Home,
      image: '/gram_panchayat_illustration.png',
      color: '#84cc16',
      colorRgb: '132, 204, 22',
      explanation: 'The Gram Panchayat is the executive committee of the village, elected by the Gram Sabha to implement development programs.',
      keyPoints: [
        'Constructs and maintains village infrastructure (roads, water, schools).',
        'Collects local taxes and executes government schemes.',
        'Assisted by a Secretary who keeps records and calls meetings.'
      ],
      didYouKnow: 'The Sarpanch (President) and Ward Members are elected for a term of five years.'
    },
    {
      id: 'panchayat_samiti',
      title: 'Panchayat Samiti',
      subtitle: 'The Block Council',
      icon: Building,
      image: '/panchayat_samiti_illustration.png',
      color: '#f97316',
      colorRgb: '249, 115, 22',
      explanation: 'Also known as the Janpad Panchayat, this body operates at the block level and oversees multiple Gram Panchayats.',
      keyPoints: [
        'Acts as a crucial link between the Gram Panchayat and Zila Parishad.',
        'Distributes funds to the Panchayats under its care.',
        'Prepares development plans for the entire block.'
      ],
      didYouKnow: 'A single Panchayat Samiti usually covers about 50 to 100 villages!'
    },
    {
      id: 'zila_parishad',
      title: 'Zila Parishad',
      subtitle: 'The District Council',
      icon: MapIcon,
      image: '/zila_parishad_illustration.png',
      color: '#ec4899',
      colorRgb: '236, 72, 153',
      explanation: 'The Zila Parishad is the highest tier of the Panchayati Raj system, functioning at the district level.',
      keyPoints: [
        'Makes developmental plans at the district level.',
        'Regulates the money distribution among all the Panchayat Samitis.',
        'Advises the state government on rural development.'
      ],
      didYouKnow: 'The Zila Parishad ensures that the benefits of government schemes reach the most remote villages in the district.'
    }
  ];

  const handleNext = () => {
    if (activeTopicIndex !== null && activeTopicIndex < topics.length - 1) {
      playClick();
      setActiveTopicIndex(activeTopicIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeTopicIndex !== null && activeTopicIndex > 0) {
      playClick();
      setActiveTopicIndex(activeTopicIndex - 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem', alignItems: 'center' }}>
      
      <style>{`
        @keyframes float1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 10%) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes float2 {
          0% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(-5%, -10%) scale(1); }
          100% { transform: translate(0, 0) scale(1.1); }
        }
        @keyframes particle-flow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes particle-flow-vertical {
          0% { background-position: 0 -200%; }
          100% { background-position: 0 200%; }
        }
        
        .concept-map-container {
          width: 100%;
          min-height: 500px;
          border-radius: 24px;
          position: relative;
          background: #0f172a;
          box-shadow: 0 20px 45px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 2rem;
          padding: 4rem 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .flow-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1000px;
          position: relative;
          z-index: 10;
        }
        
        .flow-connector {
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
          border-radius: 2px;
          min-width: 30px;
          margin: 0 10px;
        }
        
        .flow-connector::after {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: particle-flow 3s infinite linear;
        }

        .modal-content-grid {
          display: flex;
          flex: 1;
          overflow-y: auto;
        }
        .modal-image-col {
          width: 45%;
          padding: 2rem;
          background: rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-text-col {
          width: 55%;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          color: rgba(255,255,255,0.8);
        }

        @media (max-width: 900px) {
          .flow-container {
            flex-direction: column;
            gap: 1rem;
          }
          .flow-connector {
            width: 4px;
            height: 40px !important;
            min-width: 4px !important;
            margin: 0;
          }
          .flow-connector::after {
            background: linear-gradient(180deg, transparent, rgba(255,255,255,0.4), transparent);
            background-size: 100% 200%;
            animation: particle-flow-vertical 3s infinite linear;
          }
          .modal-content-grid {
            flex-direction: column;
          }
          .modal-image-col {
            width: 100%;
            padding: 1.5rem;
          }
          .modal-text-col {
            width: 100%;
            padding: 1.5rem;
          }
        }
      `}</style>

      <section style={{ width: '100%', maxWidth: '1100px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Concept Map
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
        </div>
        
        <h2 style={{ margin: '0 0 2rem 0', fontSize: '2.5rem', color: 'var(--text-heading)', textAlign: 'center' }}>
          The Learning Journey
        </h2>

        <div className="concept-map-container">
          
          {/* Animated SVG/CSS Background */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 60%)', top: '-20%', left: '-20%', animation: 'float1 20s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 60%)', bottom: '-20%', right: '-20%', animation: 'float2 25s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          </div>

          <div className="flow-container">
            {topics.map((topic, idx) => {
              const isCompleted = completedTopics.includes(idx);
              const isNext = !isCompleted && (idx === 0 || completedTopics.includes(idx - 1));
              const isLocked = !isCompleted && !isNext;
              
              const nodeColor = isCompleted ? '#10b981' : (isNext ? '#3b82f6' : 'rgba(255,255,255,0.2)');
              const nodeGlow = isCompleted ? 'rgba(16, 185, 129, 0.3)' : (isNext ? 'rgba(59, 130, 246, 0.4)' : 'transparent');
              
              return (
              <React.Fragment key={topic.id}>
                <motion.button
                  whileHover={!isLocked ? { scale: 1.05, y: -5, boxShadow: `0 15px 35px ${nodeGlow}` } : {}}
                  whileTap={!isLocked ? { scale: 0.95 } : {}}
                  onClick={() => { if(!isLocked) { playOpen(); setActiveTopicIndex(idx); } }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isCompleted ? 'rgba(16,185,129,0.3)' : (isNext ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.05)')}`,
                    backdropFilter: 'blur(16px)',
                    padding: '2rem 1rem',
                    borderRadius: '24px',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    width: '180px',
                    position: 'relative',
                    outline: 'none',
                    transition: 'all 0.3s',
                    opacity: isLocked ? 0.6 : 1
                  }}
                  onMouseOver={(e) => { if(!isLocked) e.currentTarget.style.border = `1px solid ${nodeColor}` }}
                  onMouseOut={(e) => { if(!isLocked) e.currentTarget.style.border = `1px solid ${isCompleted ? 'rgba(16,185,129,0.3)' : (isNext ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.05)')}` }}
                >
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: isLocked ? 'rgba(255,255,255,0.05)' : `rgba(255,255,255, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${nodeColor}`, boxShadow: `0 0 15px ${nodeGlow}` }}>
                    <topic.icon size={28} color={nodeColor} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', color: isLocked ? 'rgba(255,255,255,0.4)' : '#fff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{topic.title}</div>
                    <div style={{ color: isLocked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{topic.subtitle}</div>
                  </div>
                  {isCompleted && (
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#10b981', color: '#fff', borderRadius: '50%', padding: '4px', boxShadow: '0 4px 10px rgba(16,185,129,0.4)' }}>
                      <CheckCircle size={16} />
                    </div>
                  )}
                </motion.button>
                
                {idx < topics.length - 1 && (
                  <div className="flow-connector" style={{ opacity: isCompleted ? 1 : 0.2 }} />
                )}
              </React.Fragment>
            )})}
          </div>
        </div>
      </section>

      <div style={{ width: '100%', height: '1px', background: 'var(--border)', margin: '1rem 0' }}></div>

      <section style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-heading)' }}>
            Ready for the final challenge?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '600px', margin: '1rem auto 0 auto' }}>
            Review the concept map above to make sure you remember everything.
          </p>
        </div>

        <button 
          onClick={() => { playSuccess(); if(onComplete) onComplete(); }}
          className="primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px' }}
        >
          Take the Quiz
        </button>
      </section>

      {/* POPUP MODAL */}
      <AnimatePresence>
        {activeTopicIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
            }}
          >
             <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
               style={{
                 width: '100%', maxWidth: '1000px', background: 'rgba(30, 41, 59, 0.85)',
                 border: '1px solid rgba(255,255,255,0.15)', borderRadius: '24px',
                 overflow: 'hidden', display: 'flex', flexDirection: 'column',
                 boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
                 maxHeight: '90vh'
               }}
             >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                   <div>
                     <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                       {topics[activeTopicIndex].title}
                     </h3>
                     <span style={{ fontSize: '0.9rem', color: topics[activeTopicIndex].color }}>{topics[activeTopicIndex].subtitle}</span>
                   </div>
                   <button 
                     onClick={() => { playClick(); setActiveTopicIndex(null); }} 
                     aria-label="Close modal"
                     style={{ background: 'rgba(255, 255, 255, 0.05)', border: '2px solid rgba(239, 68, 68, 0.5)', color: '#ef4444', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'sans-serif', zIndex: 10 }}
                     onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.borderColor = '#ef4444'; }}
                     onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)'; }}
                   >
                     &#x2715;
                   </button>
                </div>
                
                {/* Modal Content */}
                <div className="modal-content-grid">
                  <div className="modal-image-col">
                     <img 
                       src={topics[activeTopicIndex].image} 
                       alt={topics[activeTopicIndex].title} 
                       style={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', objectFit: 'cover' }} 
                     />
                  </div>
                  <div className="modal-text-col">
                     <p style={{ fontSize: '1.15rem', lineHeight: '1.6', color: '#fff', margin: 0 }}>
                       {topics[activeTopicIndex].explanation}
                     </p>
                     
                     <div style={{ flex: 1 }}>
                       <h4 style={{ color: topics[activeTopicIndex].color, fontSize: '1.1rem', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                         <CheckCircle size={18} /> Key Responsibilities
                       </h4>
                       <ul style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1.05rem', color: '#e2e8f0' }}>
                         {topics[activeTopicIndex].keyPoints.map((pt, i) => (
                           <li key={i}>{pt}</li>
                         ))}
                       </ul>
                     </div>

                     <div style={{ background: `rgba(${topics[activeTopicIndex].colorRgb}, 0.1)`, padding: '1.25rem 1.5rem', borderRadius: '16px', borderLeft: `4px solid ${topics[activeTopicIndex].color}` }}>
                       <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                         <Info size={18} color={topics[activeTopicIndex].color} /> Did You Know?
                       </div>
                       <p style={{ margin: 0, fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.5' }}>{topics[activeTopicIndex].didYouKnow}</p>
                     </div>
                  </div>
                </div>
                
                {/* Modal Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 2rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                   <button 
                     disabled={activeTopicIndex === 0} 
                     onClick={handlePrev} 
                     style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: activeTopicIndex === 0 ? 'rgba(255,255,255,0.2)' : '#fff', border: 'none', cursor: activeTopicIndex === 0 ? 'not-allowed' : 'pointer', fontSize: '1.05rem', fontWeight: 'bold' }}
                   >
                     <ArrowLeft size={20}/> Previous Node
                   </button>
                   <button 
                     disabled={activeTopicIndex === topics.length - 1} 
                     onClick={handleNext} 
                     style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: activeTopicIndex === topics.length - 1 ? 'rgba(255,255,255,0.2)' : topics[activeTopicIndex].color, border: 'none', cursor: activeTopicIndex === topics.length - 1 ? 'not-allowed' : 'pointer', fontSize: '1.05rem', fontWeight: 'bold' }}
                   >
                     Next Node <ArrowRight size={20}/>
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
