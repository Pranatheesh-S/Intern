import { useState } from 'react';
import { ArrowLeft, RefreshCw, ArrowRight } from 'lucide-react';
import './theme.css';
import useSound from 'use-sound';
import { chapterFlow } from './storyEngine';
import ChiefDetective from './components/ChiefDetective/ChiefDetective';
import InvestigationHandbook from './components/Educational/InvestigationHandbook';
import DetectiveCheckpoint from './components/Educational/DetectiveCheckpoint';
import EvidenceSummary from './components/Educational/EvidenceSummary';
import ChapterCover from './components/Educational/ChapterCover';
import ChapterIntroSpread from './components/Educational/ChapterIntroSpread';
import MissionBriefingSpread from './components/Educational/MissionBriefingSpread';
import FullscreenButton from './components/Common/FullscreenButton';
import PropTypes from 'prop-types';

const timelineTree = (() => {
  const tree = [];
  let currentBarrier = null;
  let currentStage = null;

  chapterFlow.forEach((node, index) => {
    const item = { ...node, originalIndex: index };
    let barrierId = null;
    
    if (node.title.includes('Barrier 1') || node.title.includes('Stage 6.1')) barrierId = 'Barrier 6.1';
    else if (node.title.includes('Barrier 2') || node.title.includes('Stage 6.2')) barrierId = 'Barrier 6.2';
    else if (node.title.includes('Barrier 3') || node.title.includes('Stage 6.3')) barrierId = 'Barrier 6.3';
    else if (node.title.includes('Barrier 4') || node.title.includes('Do You Know?') || node.title.includes('Concept Map')) barrierId = 'Barrier 6.4';
    else barrierId = 'Final Wrap-up';

    if (!currentBarrier || currentBarrier.id !== barrierId) {
      currentBarrier = { id: barrierId, title: barrierId, type: 'barrier', children: [] };
      tree.push(currentBarrier);
      currentStage = null;
    }

    if (barrierId === 'Barrier 6.3') {
      const stageMatch = node.title.match(/(Stage 6\.3\.\d+)/);
      if (stageMatch) {
        const stageName = stageMatch[1];
        if (!currentStage || currentStage.id !== stageName) {
          currentStage = { id: stageName, title: stageName, type: 'stage', children: [] };
          currentBarrier.children.push(currentStage);
        }
        currentStage.children.push(item);
      } else {
        currentBarrier.children.push(item);
      }
    } else {
      currentBarrier.children.push(item);
    }
  });
  return tree;
})();

export default function MaterialsAroundUsActivity({ onBackToDashboard }) {
  const [currentFlowIndex, setCurrentFlowIndex] = useState(0);
  const [highestUnlockedIndex, setHighestUnlockedIndex] = useState(0);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [stageCompleted, setStageCompleted] = useState(false);
  const [, setXp] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [showCover, setShowCover] = useState(true);
  const [showIntroSpread, setShowIntroSpread] = useState(false);
  const [showHandbook, setShowHandbook] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState({ 
    'Barrier 6.1': true, 'Barrier 6.2': true, 'Barrier 6.3': true, 'Barrier 6.4': true, 'Final Wrap-up': true,
    'Stage 6.3.1': true, 'Stage 6.3.2': true, 'Stage 6.3.3': true, 'Stage 6.3.4': true, 'Stage 6.3.5': true, 'Stage 6.3.6': true
  });
  
  const toggleNode = (id) => setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));

  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });

  // Pour Water activity (stage8_b) must be completely silent — no audio of any kind.
  const isSilentStage = () => chapterFlow[currentFlowIndex]?.id === 'stage8_b';

  const addXp = (amount) => {
    setXp(prev => prev + amount);
    if (!isSilentStage()) {
      try { playSuccess(); } catch (err) { console.warn('Audio playback failed', err); }
    }
  };

  const handleNext = () => {
    setStageCompleted(false);
    setShowHandbook(false);
    if (currentFlowIndex < chapterFlow.length - 1) {
      const nextIndex = currentFlowIndex + 1;
      setCurrentFlowIndex(nextIndex);
      if (nextIndex > highestUnlockedIndex) {
        setHighestUnlockedIndex(nextIndex);
      }
    }
  };
  
  const currentNode = chapterFlow[currentFlowIndex];
  
  const handleMissionAccept = () => {
    if (currentNode.rewardXP && currentNode.type === 'mission') {
      addXp(currentNode.rewardXP);
    }
    setStageCompleted(false);
    if (currentFlowIndex < chapterFlow.length - 1) {
      const nextIndex = currentFlowIndex + 1;
      const nextNode = chapterFlow[nextIndex];
      
      if (nextNode && (nextNode.id === 'stage2' || nextNode.id === 'stage3_use' || nextNode.id === 'stage4_1' || nextNode.id === 'stage4_2' || nextNode.id === 'stage4_4' || nextNode.id === 'stage4_5' || nextNode.id === 'stage6_a' || nextNode.id === 'stage7_a' || nextNode.id === 'stage8_a' || nextNode.id === 'stage8_b')) {
        setShowHandbook(false);
      } else {
        setShowHandbook(true);
      }
      
      setCurrentFlowIndex(nextIndex);
      if (nextIndex > highestUnlockedIndex) {
        setHighestUnlockedIndex(nextIndex);
      }
    }
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
    console.log('[Parent] Activity completion state updating to TRUE');
    setStageCompleted(true);
  };

  return (
    <>
      <FullscreenButton />
      {showCover ? (
        <ChapterCover onOpenBook={() => { setShowCover(false); setShowIntroSpread(true); }} onBack={onBackToDashboard} />
      ) : showIntroSpread ? (
        <ChapterIntroSpread onContinue={() => setShowIntroSpread(false)} onBack={() => { setShowIntroSpread(false); setShowCover(true); }} />
      ) : (
        <div className="activity-workspace materials-around-us-theme flex h-screen bg-[var(--lesson-surface)] overflow-hidden" style={{ paddingTop: 0, paddingBottom: '72px' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsTimelineOpen(!isTimelineOpen)}
          style={{
            position: 'absolute',
            left: isTimelineOpen ? '320px' : '0px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 101,
            background: 'var(--lesson-surface)',
            border: '1px solid var(--lesson-border)',
            borderLeft: 'none',
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
            padding: '16px 8px',
            cursor: 'pointer',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            color: 'var(--lesson-text)',
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
            top: 0, bottom: 0, zIndex: 100, 
            background: 'var(--lesson-surface)', borderRight: '1px solid var(--lesson-border)', 
            display: 'flex', flexDirection: 'column', 
            overflow: 'hidden', boxShadow: isTimelineOpen ? '4px 0 20px rgba(0,0,0,0.2)' : 'none',
            width: '320px', 
            transform: isTimelineOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease'
          }}
        >
          <div style={{ width: '320px', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: 'var(--lesson-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Investigation Progress
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {(() => {
                const renderTimelineItem = (item, indentLevel = 0) => {
                  const idx = item.originalIndex;
                  const isActive = currentFlowIndex === idx || (item.type === 'mission' && currentFlowIndex > idx && chapterFlow[currentFlowIndex].type === 'activity' && chapterFlow.findIndex((n, i) => i > idx && n.type !== 'activity') > currentFlowIndex);
                  const isLocked = idx > highestUnlockedIndex;
                  const isPast = idx <= highestUnlockedIndex && !isActive;
                  
                  let icon = '🎯';
                  if (item.type === 'activity') icon = '🧪';
                  if (item.type === 'debrief' || item.type === 'summary') icon = '📝';
                  if (item.type === 'handbook') icon = '📖';
                  if (item.type === 'checkpoint') icon = '✅';
                  
                  return (
                    <button 
                      key={`item-${idx}`} 
                      disabled={isLocked}
                      onClick={() => {
                        if (!isLocked) {
                          if (!isSilentStage()) { try { playSuccess(); } catch (err) { console.warn('Audio playback failed', err); } }
                          if (item.type === 'mission') {
                            setShowHandbook(true);
                          } else {
                            setShowHandbook(false);
                          }
                          setCurrentFlowIndex(idx);
                          setIsTimelineOpen(false);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        marginLeft: `${indentLevel * 1}rem`,
                        borderRadius: '8px',
                        background: isActive ? 'var(--lesson-accent-bg)' : 'transparent',
                        border: `1px solid ${isActive ? 'var(--lesson-accent-border)' : 'transparent'}`,
                        color: isPast ? 'var(--lesson-muted)' : isActive ? 'var(--lesson-accent)' : 'var(--lesson-text)',
                        transition: 'all 0.2s',
                        opacity: isLocked ? 0.4 : 1,
                        cursor: isLocked ? 'not-allowed' : 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{icon}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: 0 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 'bold' : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--lesson-muted)' }}>
                          {item.type === 'mission' ? 'Mission Briefing' : item.type === 'activity' ? item.subtitle : 'Evidence Review'}
                        </span>
                      </div>
                    </button>
                  );
                };

                const renderTimelineGroup = (group, indentLevel = 0) => {
                  const isExpanded = expandedNodes[group.id];
                  
                  const getFirstIndex = (node) => {
                    if (node.originalIndex !== undefined) return node.originalIndex;
                    if (node.children && node.children.length > 0) return getFirstIndex(node.children[0]);
                    return 999;
                  };
                  const firstIndex = getFirstIndex(group);
                  const isLocked = firstIndex > highestUnlockedIndex;

                  return (
                    <div key={group.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <button
                        disabled={isLocked}
                        onClick={() => toggleNode(group.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          padding: '0.6rem 0.75rem',
                          marginLeft: `${indentLevel * 1}rem`,
                          borderRadius: '8px',
                          background: 'rgba(0,0,0,0.03)',
                          border: 'none',
                          color: isLocked ? 'var(--lesson-muted)' : 'var(--lesson-text)',
                          fontWeight: 'bold',
                          cursor: isLocked ? 'not-allowed' : 'pointer',
                          textAlign: 'left',
                          opacity: isLocked ? 0.6 : 1
                        }}
                      >
                        <span style={{ fontSize: '0.9rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.title}</span>
                        <span style={{ fontSize: '0.8rem', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: 'var(--lesson-muted)' }}>▶</span>
                      </button>
                      {isExpanded && !isLocked && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                          {group.children.map(child => {
                            if (child.type === 'stage' || child.type === 'barrier') {
                              return renderTimelineGroup(child, indentLevel + 0.5);
                            } else {
                              return renderTimelineItem(child, indentLevel + 0.5);
                            }
                          })}
                        </div>
                      )}
                    </div>
                  );
                };

                return timelineTree.map(group => renderTimelineGroup(group, 0));
              })()}
            </div>
          </div>
        </div>

        {/* Main Content Area - Full Width */}
        <div className="activity-content" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', overflowY: currentNode.type === 'activity' ? 'hidden' : 'auto', marginLeft: isTimelineOpen ? '320px' : '0px', transition: 'margin-left 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
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
            <ChiefDetective 
              mode="debrief" 
              data={currentNode} 
              onContinue={handleDebriefContinue} 
              onBack={() => {
                if (currentFlowIndex > 0) {
                  setCurrentFlowIndex(prev => prev - 1);
                } else {
                  setShowIntroSpread(true);
                }
              }}
            />
          )}
          
          {currentNode.type === 'activity' && (
            ['quiz', 'summary'].includes(currentNode.id) ? (
              <currentNode.component 
                key={`${currentNode.id}-${resetKey}`}
                {...(currentNode.props || {})} 
                onComplete={handleStageComplete} 
                addXp={addXp} 
              />
            ) : showHandbook ? (
              <div style={{ flex: 1, minHeight: 0, padding: '1.5rem', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', boxSizing: 'border-box' }}>
                <InvestigationHandbook 
                  highestUnlockedIndex={highestUnlockedIndex} 
                  currentFlowIndex={currentFlowIndex} 
                  stageCompleted={stageCompleted} 
                  onNext={() => setShowHandbook(false)}
                />
              </div>
            ) : (
              <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '1.5rem', width: '100%', height: '100%', boxSizing: 'border-box' }}>
                <currentNode.component 
                  key={`${currentNode.id}-${resetKey}`}
                  {...(currentNode.props || {})} 
                  onComplete={handleStageComplete} 
                  addXp={addXp} 
                />
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

          {currentNode.type === 'checkpoint' && (
            <div style={{ flex: 1, display: 'flex', background: 'var(--bg-color)', overflow: 'hidden' }}>
              <DetectiveCheckpoint key={`${currentNode.id}-${resetKey}`} data={currentNode} onComplete={handleStageComplete} addXp={addXp} />
            </div>
          )}

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

      {/* ═══════════════════════════════════════════
          GLOBAL BOTTOM ACTION BAR
          ═══════════════════════════════════════════ */}
      <div className="global-action-bar">
        <div className="global-action-bar-left">
          <button 
            onClick={onBackToDashboard} 
            className="outline" 
            style={{ padding: '0.85rem 1.6rem', fontSize: '1.45rem', fontWeight: 'bold', gap: '0.75rem', borderRadius: '10px', display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeft size={24} /> Dashboard
          </button>

          <button 
            onClick={() => {
              if (currentNode.id === 'sportsball') {
                const prevIndex = chapterFlow.findIndex(node => node.id === 'stage5');
                if (prevIndex !== -1) {
                  setShowHandbook(false);
                  setCurrentFlowIndex(prevIndex);
                  return;
                }
              }

              if (currentNode.id === 'stage5') {
                const prevIndex = chapterFlow.findIndex(node => node.id === 'stage3_material');
                if (prevIndex !== -1) {
                  setShowHandbook(false);
                  setCurrentFlowIndex(prevIndex);
                  return;
                }
              }

              if (currentNode.id === 'stage3_material') {
                const prevIndex = chapterFlow.findIndex(node => node.id === 'stage3_use');
                if (prevIndex !== -1) {
                  setShowHandbook(false);
                  setCurrentFlowIndex(prevIndex);
                  return;
                }
              }

              if (currentNode.id === 'stage2') {
                const prevIndex = chapterFlow.findIndex(node => node.title === 'Phase 2: Identification');
                if (prevIndex !== -1) {
                  setShowHandbook(false);
                  setCurrentFlowIndex(prevIndex);
                  return;
                }
              }

              if (currentNode.id === 'stage7_a') {
                const prevIndex = currentFlowIndex - 1;
                if (prevIndex >= 0) {
                  setShowHandbook(true);
                  setCurrentFlowIndex(prevIndex);
                  return;
                }
              }

              if (currentNode.id === 'stage7_b') {
                const prevIndex = chapterFlow.findIndex(node => node.id === 'stage7_a');
                if (prevIndex !== -1) {
                  setShowHandbook(false);
                  setCurrentFlowIndex(prevIndex);
                  return;
                }
              }

              if (currentNode.id === 'stage8_a') {
                const prevIndex = currentFlowIndex - 1;
                if (prevIndex >= 0) {
                  setShowHandbook(false);
                  setCurrentFlowIndex(prevIndex);
                  return;
                }
              }

              if (currentNode.id === 'stage8_b' || currentNode.id === 'stage8_c') {
                const prevIndex = currentFlowIndex - 1;
                if (prevIndex >= 0) {
                  setShowHandbook(false);
                  setCurrentFlowIndex(prevIndex);
                  return;
                }
              }

              if (!showHandbook && currentNode.type === 'activity' && !['stage8_b', 'stage8_c', 'stage3_use', 'stage4_1', 'stage4_2', 'stage4_4', 'stage4_5', 'stage6_a'].includes(currentNode.id)) {
                setShowHandbook(true);
              } else if (currentFlowIndex > 0) {
                const prevIndex = currentFlowIndex - 1;
                const prevNode = chapterFlow[prevIndex];
                if (prevNode && prevNode.type === 'mission') {
                  setShowHandbook(true);
                } else {
                  setShowHandbook(false);
                }
                setCurrentFlowIndex(prevIndex);
              } else {
                setShowIntroSpread(true);
              }
            }}
            className="outline"
            style={{ padding: '0.85rem 1.6rem', fontSize: '1.45rem', fontWeight: 'bold', gap: '0.75rem', borderRadius: '10px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeft size={24} /> Back
          </button>
        </div>

        <div className="global-action-bar-center">
          {/* Science Detective removed as requested */}
        </div>
        
        <div className="global-action-bar-right">
          <button 
            onClick={() => {
              setResetKey(prev => prev + 1);
              setStageCompleted(false);
            }}
            className="outline"
            style={{ padding: '0.85rem 1.6rem', fontSize: '1.45rem', fontWeight: 'bold', gap: '0.75rem', borderRadius: '10px', color: 'var(--danger)', borderColor: 'var(--danger-border)', display: 'flex', alignItems: 'center' }}
          >
            <RefreshCw size={22} /> Reset Activity
          </button>

          {(currentNode.type === 'activity' || currentNode.type === 'checkpoint') && (
            <button 
              onClick={showHandbook && !['stage8_b', 'stage8_c', 'stage3_use', 'stage4_1', 'stage4_2', 'stage4_4', 'stage4_5', 'stage6_a'].includes(currentNode.id) ? () => setShowHandbook(false) : handleNext}
              disabled={(showHandbook && !['stage8_b', 'stage8_c', 'stage3_use', 'stage4_1', 'stage4_2', 'stage4_4', 'stage4_5', 'stage6_a'].includes(currentNode.id)) ? false : !(stageCompleted || currentNode.id === 'stage2')}
              className={((showHandbook && !['stage8_b', 'stage8_c', 'stage3_use', 'stage4_1', 'stage4_2', 'stage4_4', 'stage4_5', 'stage6_a'].includes(currentNode.id)) || stageCompleted || currentNode.id === 'stage2') ? 'primary' : 'outline'}
              style={{ 
                padding: '0.85rem 1.8rem', 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                gap: '0.75rem', 
                borderRadius: '10px',
                opacity: ((showHandbook && !['stage8_b', 'stage8_c', 'stage3_use', 'stage4_1', 'stage4_2', 'stage4_4', 'stage4_5', 'stage6_a'].includes(currentNode.id)) || stageCompleted || currentNode.id === 'stage2') ? 1 : 0.5,
                cursor: ((showHandbook && !['stage8_b', 'stage8_c', 'stage3_use', 'stage4_1', 'stage4_2', 'stage4_4', 'stage4_5', 'stage6_a'].includes(currentNode.id)) || stageCompleted || currentNode.id === 'stage2') ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Proceed to next <ArrowRight size={26} />
            </button>
          )}
        </div>
      </div>
    </div>
    )}
  </>
  );
}

MaterialsAroundUsActivity.propTypes = {
  onBackToDashboard: PropTypes.func.isRequired
};
