import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Sun, Moon, ArrowRight } from 'lucide-react';
import useSound from 'use-sound';
import { useTheme } from '../../ThemeContext.jsx';
import { chapterFlow } from './storyEngine';
import ChiefDetective from './components/ChiefDetective/ChiefDetective';
import InvestigationHandbook from './components/Educational/InvestigationHandbook';
import DetectiveCheckpoint from './components/Educational/DetectiveCheckpoint';
import EvidenceSummary from './components/Educational/EvidenceSummary';
import ChapterCover from './components/Educational/ChapterCover';
import ChapterIntroSpread from './components/Educational/ChapterIntroSpread';
import MissionBriefingSpread from './components/Educational/MissionBriefingSpread';

export default function MaterialsAroundUsActivity({ onBackToDashboard }) {
  const [currentFlowIndex, setCurrentFlowIndex] = useState(0);
  const [highestUnlockedIndex, setHighestUnlockedIndex] = useState(0);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [stageCompleted, setStageCompleted] = useState(false);
  const [xp, setXp] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [showCover, setShowCover] = useState(true);
  const [showIntroSpread, setShowIntroSpread] = useState(false);
  
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  
  const addXp = (amount) => {
    setXp(prev => prev + amount);
    try { playSuccess(); } catch (e) {}
  };

  const handleNext = () => {
    setStageCompleted(false);
    if (currentFlowIndex < chapterFlow.length - 1) {
      const nextIndex = currentFlowIndex + 1;
      setCurrentFlowIndex(nextIndex);
      if (nextIndex > highestUnlockedIndex) {
        setHighestUnlockedIndex(nextIndex);
      }
    }
  };
  
  const currentNode = chapterFlow[currentFlowIndex];
  
  // Handlers for Mission / Debrief
  const handleMissionAccept = () => {
    if (currentNode.rewardXP && currentNode.type === 'mission') {
      addXp(currentNode.rewardXP);
    }
    handleNext();
  };

  const handleDebriefContinue = () => {
    if (currentNode.rewardXP && (currentNode.type === 'debrief' || currentNode.type === 'summary')) {
      addXp(currentNode.rewardXP);
    }
    if (currentNode.isFinal) {
      onBackToDashboard();
    } else {
      handleNext();
    }
  };

  const handleStageComplete = () => {
    setStageCompleted(true);
  };

  // Global Theme Hook
  const { theme, toggleTheme } = useTheme();

  if (showCover) {
    return <ChapterCover onOpenBook={() => { setShowCover(false); setShowIntroSpread(true); }} onBack={onBackToDashboard} />;
  }

  if (showIntroSpread) {
    return <ChapterIntroSpread onContinue={() => setShowIntroSpread(false)} onBack={() => { setShowIntroSpread(false); setShowCover(true); }} />;
  }

  return (
    <div className="activity-workspace flex h-screen bg-[#eaf6fb] overflow-hidden font-geo" style={{ paddingTop: '60px' }}>
      {/* ═══════════════════════════════════════════
          GLOBAL ACTION BAR (WINDOW CHROME)
          ═══════════════════════════════════════════ */}
      <div className="global-action-bar">
        <div className="global-action-bar-left">
          <button 
            onClick={onBackToDashboard} 
            className="outline" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', gap: '0.5rem', borderRadius: '8px' }}
          >
            <ArrowLeft size={16} /> Dashboard
          </button>
        </div>

        <div className="global-action-bar-center">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '1.2rem' }}>🕵️‍♂️</span>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-heading)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Science Detective
              </span>
            </div>
          </div>
        </div>
        
        <div className="global-action-bar-right">
          <button 
            onClick={() => {
              if (currentFlowIndex > 0) {
                setCurrentFlowIndex(prev => prev - 1);
              } else {
                setShowIntroSpread(true);
              }
            }}
            className="outline"
            style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', gap: '0.5rem', borderRadius: '8px', color: 'var(--text-primary)' }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <button 
            className="outline" 
            onClick={toggleTheme}
            title="Toggle Theme"
            style={{ padding: '0.5rem', borderRadius: '8px', color: 'var(--text-primary)' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button 
            onClick={() => setResetKey(prev => prev + 1)}
            className="outline"
            style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', gap: '0.5rem', borderRadius: '8px', color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
          >
            <RefreshCw size={14} /> Reset Activity
          </button>

          {currentNode.type === 'activity' && (
            <button 
              onClick={handleNext}
              disabled={!stageCompleted}
              className={stageCompleted ? 'primary' : 'outline'}
              style={{ 
                padding: '0.45rem 1rem', 
                fontSize: '0.9rem', 
                gap: '0.5rem', 
                borderRadius: '8px',
                opacity: stageCompleted ? 1 : 0.5,
                cursor: stageCompleted ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s'
              }}
            >
              Proceed to next <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsTimelineOpen(!isTimelineOpen)}
          style={{
            position: 'absolute',
            left: isTimelineOpen ? '320px' : '0px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 51,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderLeft: 'none',
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
            padding: '16px 8px',
            cursor: 'pointer',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Toggle Timeline"
        >
          <ArrowRight size={16} style={{ transform: isTimelineOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
        </button>

        {/* Timeline Sidebar */}
        <div 
          className="timeline-flyout"
          style={{ 
            position: 'absolute', 
            left: 0,
            top: 0, bottom: 0, zIndex: 50, 
            background: 'var(--surface)', borderRight: '1px solid var(--border)', 
            display: 'flex', flexDirection: 'column', 
            overflow: 'hidden', boxShadow: isTimelineOpen ? '4px 0 20px rgba(0,0,0,0.2)' : 'none',
            width: '320px', 
            transform: isTimelineOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease'
          }}
        >
          <div style={{ width: '320px', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Investigation Progress
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {chapterFlow.map((node, idx) => {
                const isActive = currentFlowIndex === idx || (node.type === 'mission' && currentFlowIndex > idx && chapterFlow[currentFlowIndex].type === 'activity' && chapterFlow.findIndex((n, i) => i > idx && n.type !== 'activity') > currentFlowIndex);
                const isLocked = idx > highestUnlockedIndex;
                const isPast = idx <= highestUnlockedIndex && !isActive;
                
                let icon = '🎯';
                if (node.type === 'activity') icon = '🧪';
                if (node.type === 'debrief' || node.type === 'summary') icon = '📝';
                if (node.type === 'handbook') icon = '📖';
                if (node.type === 'checkpoint') icon = '✅';
                
                return (
                  <button 
                    key={idx} 
                    disabled={isLocked}
                    onClick={() => {
                      if (!isLocked) {
                        try { playSuccess(); } catch (e) {}
                        setCurrentFlowIndex(idx);
                        setIsTimelineOpen(false);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: isActive ? 'var(--accent-bg)' : 'transparent',
                      border: `1px solid ${isActive ? 'var(--accent-border)' : 'transparent'}`,
                      color: isPast ? 'var(--text-muted)' : isActive ? 'var(--accent)' : 'var(--text-primary)',
                      transition: 'all 0.2s',
                      opacity: isLocked ? 0.4 : 1,
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{icon}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: 0 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 'bold' : 'normal', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {node.title}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {node.type === 'mission' ? 'Mission Briefing' : node.type === 'activity' ? node.subtitle : 'Evidence Review'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area - Full Width */}
        <div className="activity-content" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', overflowY: currentNode.type === 'activity' ? 'hidden' : 'auto' }}>
          {currentNode.type === 'mission' && (
            <MissionBriefingSpread 
              data={currentNode} 
              onContinue={handleMissionAccept} 
              onBack={() => {
                if (currentFlowIndex > 0) {
                  setCurrentFlowIndex(prev => prev - 1);
                } else {
                  setShowIntroSpread(true);
                }
              }} 
            />
          )}
          
          {currentNode.type === 'debrief' && (
            <ChiefDetective mode="debrief" data={currentNode} onContinue={handleDebriefContinue} />
          )}
          
          {currentNode.type === 'activity' && (
            ['quiz', 'summary'].includes(currentNode.id) ? (
              <currentNode.component 
                key={`${currentNode.id}-${resetKey}`}
                {...(currentNode.props || {})} 
                onComplete={handleStageComplete} 
                addXp={addXp} 
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flex: 1, minHeight: 0, padding: '1.5rem' }}>
                {/* Left Side: Handbook */}
                <InvestigationHandbook 
                  highestUnlockedIndex={highestUnlockedIndex} 
                  currentFlowIndex={currentFlowIndex} 
                  stageCompleted={stageCompleted} 
                />
                
                {/* Right Side: Activity */}
                <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: '4px' }}>
                  <currentNode.component 
                    key={`${currentNode.id}-${resetKey}`}
                    {...(currentNode.props || {})} 
                    onComplete={handleStageComplete} 
                    addXp={addXp} 
                  />
                </div>
              </div>
            )
          )}

          {currentNode.type === 'handbook' && (() => {
            const nextNode = chapterFlow[currentFlowIndex + 1];
            return (
              <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
                {nextNode && nextNode.type === 'activity' && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', filter: 'blur(12px)', transform: 'scale(1.05)' }}>
                      <nextNode.component {...(nextNode.props || {})} addXp={()=>{}} onComplete={()=>{}} />
                    </div>
                  </div>
                )}
                <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                  <InvestigationHandbook data={currentNode} onComplete={handleNext} />
                </div>
              </div>
            );
          })()}

          {currentNode.type === 'checkpoint' && (() => {
            let lastActivityNode = null;
            for (let i = currentFlowIndex - 1; i >= 0; i--) {
              if (chapterFlow[i].type === 'activity') {
                lastActivityNode = chapterFlow[i];
                break;
              }
            }
            return (
              <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
                {lastActivityNode && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', filter: 'blur(12px)', transform: 'scale(1.05)' }}>
                      <lastActivityNode.component {...(lastActivityNode.props || {})} addXp={()=>{}} onComplete={()=>{}} />
                    </div>
                  </div>
                )}
                <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                  <DetectiveCheckpoint data={currentNode} onComplete={handleNext} addXp={addXp} />
                </div>
              </div>
            );
          })()}

          {currentNode.type === 'summary' && (() => {
            let lastActivityNode = null;
            for (let i = currentFlowIndex - 1; i >= 0; i--) {
              if (chapterFlow[i].type === 'activity') {
                lastActivityNode = chapterFlow[i];
                break;
              }
            }
            return (
              <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
                {lastActivityNode && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', filter: 'blur(12px)', transform: 'scale(1.05)' }}>
                      <lastActivityNode.component {...(lastActivityNode.props || {})} addXp={()=>{}} onComplete={()=>{}} />
                    </div>
                  </div>
                )}
                <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                  <EvidenceSummary data={currentNode} onComplete={handleDebriefContinue} />
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
