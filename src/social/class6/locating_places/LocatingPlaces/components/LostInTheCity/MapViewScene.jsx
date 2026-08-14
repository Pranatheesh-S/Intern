import React, { useState } from 'react';
import { Compass, Navigation, CheckCircle2, User, AlertCircle, ArrowRight } from 'lucide-react';
import mapBg from './assets/town_map_fig1.jpg';
import { MAP_NODES, MAP_EDGES, isBankReachable } from './MapGraph';

export default function MapViewScene({ onComplete }) {
  const [phase, setPhase] = useState('idle'); // idle, walking, junction, wrong, success
  const [currentNode, setCurrentNode] = useState('Start');
  const [visitedNodes, setVisitedNodes] = useState(['Start']);
  const [journeyLog, setJourneyLog] = useState(['✓ Started at Railway Station']);
  const [showError, setShowError] = useState(false);

  // Boy animation state
  const [boyPos, setBoyPos] = useState({ x: MAP_NODES.Start.x, y: MAP_NODES.Start.y });
  
  const handleStart = () => {
    setPhase('junction');
  };

  const walkTo = (nextId, direction) => {
    const isCorrect = isBankReachable(nextId, visitedNodes);
    setPhase('walking');
    
    if (isCorrect) {
      setBoyPos({ x: MAP_NODES[nextId].x, y: MAP_NODES[nextId].y });
      setTimeout(() => {
        setVisitedNodes(prev => [...prev, nextId]);
        setCurrentNode(nextId);
        setJourneyLog(prev => [...prev, `✓ Travelled ${direction}`]);
        
        if (nextId === 'Bank') {
          setPhase('success');
        } else {
          setPhase('junction');
        }
      }, 2000); // 2 seconds walking
    } else {
      // Wrong path - walk 30% of the way
      const start = MAP_NODES[currentNode];
      const end = MAP_NODES[nextId];
      const wrongX = start.x + (end.x - start.x) * 0.3;
      const wrongY = start.y + (end.y - start.y) * 0.3;
      setBoyPos({ x: wrongX, y: wrongY });
      
      setTimeout(() => {
        setPhase('wrong');
        setShowError(true);
      }, 800); // faster stop
    }
  };

  const handleWrongClose = () => {
    setShowError(false);
    // Return boy to current node
    setBoyPos({ x: MAP_NODES[currentNode].x, y: MAP_NODES[currentNode].y });
    setPhase('junction');
  };

  const isWalking = phase === 'walking' || phase === 'wrong';

  return (
    <>
      <style>{`
        @keyframes breathe {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
        @keyframes walkBounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-6px); }
        }
      `}</style>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'stretch' }}>
        
        {/* LEFT COLUMN: Map View */}
        <div style={{ 
          flex: '1 1 65%', 
          position: 'relative', 
          minWidth: '350px', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          border: '1px solid #d6e0ec', 
          background: '#eef2f6',
          boxShadow: '0 8px 30px rgba(14,42,69,0.08)'
        }}>
          <img src={mapBg} alt="Town Map" style={{ width: '100%', height: 'auto', display: 'block' }} />
          
          {/* SVG Overlay for Path Highlighting */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}>
            {visitedNodes.map((nodeId, idx) => {
              if (idx === 0) return null;
              const prev = MAP_NODES[visitedNodes[idx - 1]];
              const curr = MAP_NODES[nodeId];
              return (
                <line 
                  key={idx}
                  x1={`${prev.x}%`} y1={`${prev.y}%`}
                  x2={`${curr.x}%`} y2={`${curr.y}%`}
                  stroke="rgba(147, 51, 234, 0.6)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(147, 51, 234, 0.8))' }}
                />
              );
            })}
          </svg>

          {/* Boy Character */}
          <div style={{
            position: 'absolute',
            left: `${boyPos.x}%`,
            top: `${boyPos.y}%`,
            transform: 'translate(-50%, -75%)',
            transition: isWalking ? 'left 2s linear, top 2s linear' : 'left 0.8s ease, top 0.8s ease',
            zIndex: 20
          }}>
            <div style={{
              animation: isWalking ? 'walkBounce 0.3s infinite alternate' : 'breathe 1.5s infinite alternate',
              width: '36px',
              height: '36px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              border: '2px solid #6366f1'
            }}>
              <User size={20} color="#6366f1" />
            </div>
          </div>

          {/* Decision Arrows */}
          {phase === 'junction' && currentNode !== 'Bank' && (
            <div style={{
              position: 'absolute',
              left: `${MAP_NODES[currentNode].x}%`,
              top: `${MAP_NODES[currentNode].y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 30,
            }}>
              {Object.entries(MAP_EDGES[currentNode] || {}).map(([direction, nextId]) => {
                let dx = 0, dy = 0;
                if (direction === 'North') dy = -45;
                if (direction === 'South') dy = 45;
                if (direction === 'East') dx = 45;
                if (direction === 'West') dx = -45;
                
                return (
                  <button
                    key={direction}
                    onClick={() => walkTo(nextId, direction)}
                    style={{
                      position: 'absolute',
                      left: dx,
                      top: dy,
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(147, 51, 234, 0.95)',
                      color: 'white',
                      border: '2px solid white',
                      borderRadius: '20px',
                      padding: '6px 14px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(147,51,234,0.5)',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
                  >
                    {direction}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        {/* RIGHT COLUMN: Mission Panel */}
        <div style={{ 
          flex: '1 1 30%', 
          minWidth: '280px', 
          background: '#ffffff', 
          padding: '2rem', 
          borderRadius: '24px', 
          border: '1px solid #d6e0ec', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem',
          boxShadow: '0 8px 30px rgba(14,42,69,0.08)'
        }}>
          <div>
            <h3 style={{ color: '#5c6b7a', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '1px' }}>
              <Compass size={18} /> Mission
            </h3>
            <p style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#20303f', lineHeight: 1.4 }}>
              Help the boy reach the Bank.
            </p>
            <p style={{ fontSize: '1rem', color: '#47586b', marginTop: '0.5rem', lineHeight: 1.4 }}>
              There may be more than one correct path. Choose the correct road whenever you reach a junction.
            </p>
          </div>

          {phase === 'idle' && (
            <button 
              onClick={handleStart}
              className="primary" 
              style={{ padding: '1.25rem', fontSize: '1.1rem', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', border: 'none', background: '#6366f1', color: 'white', fontWeight: 'bold' }}
            >
              <Navigation size={20} /> Let's Go
            </button>
          )}

          {phase !== 'idle' && (
            <>
              {/* Progress */}
              <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #d6e0ec' }}>
                <h4 style={{ color: '#5c6b7a', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.5px' }}>Progress</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Railway Station</div>
                  <ArrowRight size={16} color="#5c6b7a" />
                  <div style={{ color: '#6366f1', fontWeight: 'bold', fontSize: '1rem' }}>{MAP_NODES[currentNode]?.name}</div>
                  <ArrowRight size={16} color="#5c6b7a" />
                  <div style={{ opacity: 0.5, fontSize: '1rem' }}>Bank</div>
                </div>
              </div>

              {/* Journey Log */}
              <div style={{ flex: 1 }}>
                 <h4 style={{ color: '#5c6b7a', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.5px' }}>Journey Log</h4>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                   {journeyLog.map((log, i) => (
                     <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: '#47586b' }}>
                       <CheckCircle2 size={16} color="#10b981" /> {log}
                     </div>
                   ))}
                 </div>
              </div>
            </>
          )}
        </div>

        {/* ERROR POPUP */}
        {showError && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
             <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '24px', textAlign: 'center', maxWidth: '350px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
               <AlertCircle size={56} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
               <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#20303f' }}>Oops!</h3>
               <p style={{ marginBottom: '2rem', color: '#47586b', lineHeight: 1.5 }}>This road doesn't lead to the Bank. Try another direction.</p>
               <button onClick={handleWrongClose} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>Choose Again</button>
             </div>
          </div>
        )}

        {/* SUCCESS POPUP */}
        {phase === 'success' && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
             <div style={{ background: '#ffffff', padding: '3rem', borderRadius: '24px', textAlign: 'center', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
               <CheckCircle2 size={72} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
               <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#20303f' }}>Congratulations!</h2>
               <p style={{ marginBottom: '2.5rem', color: '#47586b', lineHeight: 1.6, fontSize: '1.1rem' }}>
                 You helped the boy reach the Bank using the town map. 
                 Maps help us choose the correct route and reach places easily.
               </p>
               <button onClick={() => { setPhase('completed'); onComplete(); }} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '1.25rem 2rem', borderRadius: '14px', fontSize: '1.15rem', fontWeight: 'bold', cursor: 'pointer', width: '100%', boxShadow: '0 4px 12px rgba(147,51,234,0.3)' }}>
                 Continue to Quiz
               </button>
             </div>
          </div>
        )}
      </div>
    </>
  );
}
