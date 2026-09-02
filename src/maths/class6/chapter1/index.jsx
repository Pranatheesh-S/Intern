import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import WhatMaths from './WhatMaths';
import PatternsEverywhere from './PatternsEverywhere';
import ManActivity from './ManActivity';
import PatternMachines from './PatternMachines';
import PatternsInNumbers from './PatternsInNumbers';
import NumberSequencesTable from './NumberSequencesTable';
import VisualisingSequences from './VisualisingSequences';
import RelationsAmongSequences from './RelationsAmongSequences';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ErrorBoundary from '../../../components/ErrorBoundary';
import PatternsInShapes, {
  Table3Polygons3D,
  Table3CompleteGraphs3D,
  Table3StackedSquares3D,
  Table3StackedTriangles3D,
  Table3KochSnowflake3D,
  PhotorealisticStackedTrianglesBridge3D,
  POLYGONS_DATA,
  COMPLETE_GRAPHS_MODULAR_DATA
} from './PatternsInShapes';
import ShapesToNumbers from './ShapesToNumbers';
import RealLifeMathLab from './RealLifeMathLab';
import ChapterQuizAndSolutions from './ChapterQuizAndSolutions';
import {
  BotanicalFlower3D,
  MarketProduce3D,
  CalendarDesk3D,
  CelestialOrrery3D,
  AncientManuscript3D,
  VoxelCube3D,
  GnomonPuzzle3D,
  DetectiveVaultDesk3D,
  QuizPhotorealisticLab3D,
  PhotorealisticViralHandshakeNetwork3D
} from './RealisticMath3D';
import { PASTEL_THEMES, SEQUENCES, QUIZ_QUESTIONS } from './data';
import './MathsChapter1Dark.css';

export { PASTEL_THEMES, SEQUENCES, QUIZ_QUESTIONS };

export default function Class6MathsChapter1({ onBackToDashboard }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const navRef = useRef(null);

  // Section 1.5 Shared Table 3 State
  const [viewMode, setViewMode] = useState('real');
  const [polygonIdx, setPolygonIdx] = useState(0);
  const [placedPolyEdges, setPlacedPolyEdges] = useState(3);

  const [graphIdx, setGraphIdx] = useState(2);
  const [activeComponentIds, setActiveComponentIds] = useState(['k4-square', 'k4-cross']);

  const [squareSize, setSquareSize] = useState(3);
  const [placedSquareLayers, setPlacedSquareLayers] = useState(3);

  const [triangleRows, setTriangleRows] = useState(3);
  const [placedTriLayers, setPlacedTriLayers] = useState(3);

  const [kochDepth, setKochDepth] = useState(1);

  // Section 1.6 ShapesToNumbers State
  const [s2nShapeSides, setS2NShapeSides] = useState(3);
  const [s2nPeopleCount, setS2NPeopleCount] = useState(5);
  const [s2nTriRows, setS2NTriRows] = useState(3);
  const [s2nKochIter, setS2NKochIter] = useState(0);

  // Section 1.7 RealLifeMathLab State
  const [labSelectedCenter, setLabSelectedCenter] = useState(16);
  const [labKgPotatoes, setLabKgPotatoes] = useState(3);
  const [labKgTomatoes, setLabKgTomatoes] = useState(2);
  const [labSelectedFlower, setLabSelectedFlower] = useState('lily');
  const [labViralRounds, setLabViralRounds] = useState(5);
  const [checkoutStep, setCheckoutStep] = useState(0);

  // Section 1.8 Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [activeQuizQuestionId, setActiveQuizQuestionId] = useState(1);
  const quizScore = (QUIZ_QUESTIONS || []).filter(q => quizAnswers[q.id] === q.correct).length;

  const tabs = [
    { id: 1, title: 'Chapter Introduction', subtitle: 'Patterns in Mathematics', locked: false },
    { id: 2, title: 'Number Sequences', subtitle: 'Table 1 · 10 Famous Patterns', locked: false },
    { id: 3, title: 'Visualising Numbers', subtitle: 'Dot Grids & 3D Cubes', locked: false },
    { id: 4, title: 'Relations in Patterns', subtitle: 'Odd Sums & Visual Proofs', locked: false },
    { id: 5, title: 'Patterns in Shapes', subtitle: 'Table 3 · Shape Sequences', locked: false },
    { id: 6, title: 'Shapes ⇌ Numbers', subtitle: 'Geometry to Algebra Bridge', locked: false },
    { id: 7, title: 'Real-Life Math Lab', subtitle: 'Calendar, Rates & Nature', locked: false },
    { id: 8, title: 'Summary & Quiz', subtitle: 'Assessment & Detective Lab', locked: false }
  ];

  // Sub-step handlers for Sections 1-4 (Varun's navigation)
  const handleSubNext = () => {
    if (subStep < 4) setSubStep(prev => prev + 1);
    else { setCurrentStep(2); setSubStep(1); }
  };
  const handleSubPrev = () => {
    if (subStep > 1) setSubStep(prev => prev - 1);
    else onBackToDashboard();
  };

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Auto-scroll active tab into view
  useEffect(() => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentStep]);

  const renderTopShowcase = () => {
    if (currentStep === 5) {
      const activeShapeActivity = currentSlide;
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <ErrorBoundary fallback={<div style={{ color: '#0f172a', padding: '1.2rem', fontWeight: '800' }}>3D Studio initializing...</div>}>
            <Canvas camera={{ position: [0, 0.1, 3.2], fov: 45 }} shadows dpr={[1, 2]}>
              <ambientLight intensity={1.9} />
              <directionalLight position={[6, 12, 8]} intensity={2.5} castShadow />
              <directionalLight position={[-6, -4, -4]} intensity={1.3} color="#ffffff" />
              <pointLight position={[0, 6, 6]} intensity={1.5} color="#ffffff" />

              <group scale={1.15}>
              {activeShapeActivity === 1 && (
                <Table3Polygons3D
                  polygon={POLYGONS_DATA[polygonIdx || 0] || POLYGONS_DATA[0]}
                  placedEdges={placedPolyEdges}
                  viewMode={viewMode}
                />
              )}
              {activeShapeActivity === 2 && (
                <Table3CompleteGraphs3D
                  graph={COMPLETE_GRAPHS_MODULAR_DATA[graphIdx || 0] || COMPLETE_GRAPHS_MODULAR_DATA[0]}
                  activeComponentIds={activeComponentIds}
                />
              )}
              {activeShapeActivity === 3 && (
                <Table3StackedSquares3D
                  rows={squareSize}
                  placedLayers={placedSquareLayers}
                />
              )}
              {activeShapeActivity === 4 && (
                <Table3StackedTriangles3D
                  rows={triangleRows}
                  placedRows={placedTriLayers}
                />
              )}
              {activeShapeActivity === 5 && (
                <Table3KochSnowflake3D
                  depth={kochDepth}
                />
              )}
              </group>

              <OrbitControls enablePan={false} maxDistance={6} minDistance={1.8} />
            </Canvas>
          </ErrorBoundary>

          <div style={{ position: 'absolute', top: '12px', left: '14px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(6px)', padding: '5px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.82rem', fontWeight: '800', pointerEvents: 'none', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
            {activeShapeActivity === 1 ? (viewMode === 'real' ? '🌍 Real-World 3D Object' : '📐 Geometric Regular Polygon 3D') : activeShapeActivity === 2 ? '✈️ 3D Direct City Flight Network (Airways)' : activeShapeActivity === 3 ? '🎨 3D Handcrafted Ceramic Heritage Tiles' : activeShapeActivity === 4 ? '🎱 3D Billiards 15-Ball Triangle Rack' : '🔲 3D Studio · Drag to Orbit'}
          </div>
        </div>
      );
    }

    if (currentStep === 6) {
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <ErrorBoundary>
            <Canvas camera={{ position: [0, 2.2, 3.8], fov: 44 }}>
              <ambientLight intensity={1.8} />
              <directionalLight position={[10, 12, 6]} intensity={2.4} castShadow />
              {currentSlide === 1 && <PhotorealisticStackedTrianglesBridge3D rows={s2nTriRows} />}
              {currentSlide === 2 && <Table3KochSnowflake3D depth={s2nKochIter} />}
              <OrbitControls enablePan={false} maxDistance={7} minDistance={2} />
            </Canvas>
          </ErrorBoundary>
        </div>
      );
    }

    if (currentStep === 7) {
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <ErrorBoundary>
            <Canvas camera={{ position: [0, 0.8, 4.2], fov: 45 }}>
              <ambientLight intensity={2.0} />
              <group scale={1.15}>
              {currentSlide === 1 && <CalendarDesk3D selectedCenter={labSelectedCenter} />}
              {currentSlide === 2 && <MarketProduce3D kgPotatoes={labKgPotatoes} kgTomatoes={labKgTomatoes} checkoutStep={checkoutStep} onCheckoutComplete={() => setCheckoutStep(0)} />}
              {currentSlide === 3 && <BotanicalFlower3D flowerKey={labSelectedFlower} />}
              {currentSlide === 4 && <PhotorealisticViralHandshakeNetwork3D viralRounds={labViralRounds} />}
              </group>
              <OrbitControls enablePan={true} enableZoom={true} maxDistance={8} minDistance={1.4} />
            </Canvas>
          </ErrorBoundary>
        </div>
      );
    }

    if (currentStep === 8) {
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <ErrorBoundary>
            <Canvas camera={{ position: [0, 1.2, 4.2], fov: 45 }}>
              <ambientLight intensity={1.8} />
              <group scale={1.1}>
              <QuizPhotorealisticLab3D
                activeQuestionId={activeQuizQuestionId}
                isSubmitted={isQuizSubmitted}
                score={quizScore}
                totalClues={QUIZ_QUESTIONS.length}
                currentSlide={currentSlide}
                userAnswer={quizAnswers[activeQuizQuestionId]}
              />
              </group>
              <OrbitControls enablePan={true} enableZoom={true} minDistance={1.4} maxDistance={8} />
            </Canvas>
          </ErrorBoundary>
        </div>
      );
    }

    return null;
  };

  const renderBottomNav = (totalSlides, nextStepIndex, prevStepIndex) => (
    <div className="math-bottom-nav">
      <div className="math-slide-indicator">Slide {currentSlide} of {totalSlides}</div>
      <div className="math-nav-dots">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div key={i} className={`math-nav-dot ${currentSlide === i + 1 ? 'active' : ''}`} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="math-btn-back" onClick={() => {
          if (currentSlide > 1) setCurrentSlide(currentSlide - 1);
          else if (prevStepIndex) { setCurrentStep(prevStepIndex); setCurrentSlide(1); }
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          Back
        </button>
        <button className="math-btn-next" onClick={() => {
          if (currentSlide < totalSlides) setCurrentSlide(currentSlide + 1);
          else if (nextStepIndex) { setCurrentStep(nextStepIndex); setCurrentSlide(1); }
        }}>
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  );

  const renderLeftPanelContent = () => (
    <div className="math-left-panel">
      <div className="math-chapter-eyebrow">CHAPTER 1 · CLASS 6 MATHEMATICS</div>
      <h1 className="math-chapter-title">Patterns in Mathematics</h1>
      
      <div className="math-3d-container">
        <div className="math-3d-label">✨ INTERACTIVE 3D</div>
        <div className="math-3d-hint">💡 Drag to Rotate · Scroll to Zoom</div>
        {renderTopShowcase()}
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 101,
      boxSizing: 'border-box',
      padding: 'clamp(16px, 2.5vh, 24px) clamp(16px, 2.5vw, 24px)',
      display: 'flex',
      flexDirection: 'column',
      background: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      overflow: 'hidden'
    }}>
      {/* Workflow Header / Tabs */}
      <div style={{ flexShrink: 0, width: '100%', minWidth: 0, marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.5rem', width: '100%', minWidth: 0 }}>
          <button
            type="button"
            onClick={onBackToDashboard}
            title="Back to Main Page"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.15rem',
              padding: '0.35rem 0.4rem',
              fontSize: '0.62rem',
              fontWeight: '800',
              color: '#0f172a',
              border: '1.5px solid #cbd5e1',
              borderRadius: '10px',
              background: '#ffffff',
              cursor: 'pointer',
              flexShrink: 0,
              minHeight: '64px',
              width: '68px',
              boxSizing: 'border-box',
              lineHeight: 1.15,
              textAlign: 'center'
            }}
          >
            <ArrowLeft size={14} color="#0f172a" />
            <span style={{ color: '#0f172a', fontWeight: '800' }}>Back to</span>
            <span style={{ color: '#0f172a', fontWeight: '800' }}>Main Page</span>
          </button>

          <nav
            ref={navRef}
            style={{
              flex: 1,
              minWidth: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(8, minmax(0, 1fr))',
              gap: '0.4rem',
              overflowX: 'auto',
              scrollbarWidth: 'thin',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {tabs.map((tab) => {
              const isActive = currentStep === tab.id;
              const isCompleted = currentStep > tab.id;
              return (
                <button
                  key={tab.id}
                  data-active={isActive}
                  onClick={() => {
                    if (!tab.locked) {
                      setCurrentStep(tab.id);
                      setCurrentSlide(1);
                      setSubStep(1);
                    }
                  }}
                  disabled={tab.locked}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.55rem',
                    background: isActive ? '#ffffff' : '#f8fafc',
                    border: `1.5px solid ${isActive ? '#8b5cf6' : '#cbd5e1'}`,
                    borderRadius: '12px',
                    width: '100%',
                    minHeight: '64px',
                    minWidth: '118px',
                    opacity: 1,
                    cursor: tab.locked ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? '0 4px 15px rgba(139, 92, 246, 0.25)' : 'none',
                    textAlign: 'left',
                    boxSizing: 'border-box',
                    flexShrink: 0
                  }}
                >
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: isActive ? '#8b5cf6' : (isCompleted ? '#8b5cf6' : '#64748b'), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>
                    {isCompleted ? <CheckCircle size={12} /> : tab.id}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.2, whiteSpace: 'normal', width: '100%' }}>{tab.title}</span>
                    <span style={{ fontSize: '0.64rem', color: isActive ? '#8b5cf6' : '#334155', lineHeight: 1.2, whiteSpace: 'normal', width: '100%', fontWeight: '700' }}>{tab.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        minHeight: 0
      }}>
        {currentStep === 1 ? (
          <>
            {subStep === 1 && <WhatMaths onNext={handleSubNext} onPrev={handleSubPrev} />}
            {subStep === 2 && <PatternsEverywhere onNext={handleSubNext} onPrev={handleSubPrev} />}
            {subStep === 3 && <ManActivity onNext={handleSubNext} onPrev={handleSubPrev} />}
            {subStep === 4 && <PatternMachines onNext={handleSubNext} onPrev={handleSubPrev} />}
          </>
        ) : currentStep === 2 ? (
          <>
            {subStep === 1 && <PatternsInNumbers onNext={() => setSubStep(2)} />}
            {subStep === 2 && <NumberSequencesTable onNext={() => { setCurrentStep(3); setSubStep(1); }} />}
          </>
        ) : currentStep === 3 ? (
          <VisualisingSequences onNext={() => { setCurrentStep(4); setSubStep(1); }} />
        ) : currentStep === 4 ? (
          <RelationsAmongSequences onNext={() => { setCurrentStep(5); setCurrentSlide(1); }} />
        ) : currentStep === 5 ? (
          <div className="math-responsive-layout">
            {renderLeftPanelContent()}
            <div className="math-right-panel">
              <div className="math-section-header-area">
                <div className="math-section-eyebrow">✨ SECTION 5</div>
                <h2 className="math-section-title">📖 Patterns in Shapes</h2>
              </div>
              <div className="math-inner-content-card">
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', minHeight: 0 }} className="hide-scrollbar">
                  <PatternsInShapes
                    activeActivity={currentSlide}
                    setActiveActivity={(id) => setCurrentSlide(id)}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    polygonIdx={polygonIdx}
                    setPolygonIdx={setPolygonIdx}
                    placedPolyEdges={placedPolyEdges}
                    setPlacedPolyEdges={setPlacedPolyEdges}
                    graphIdx={graphIdx}
                    setGraphIdx={setGraphIdx}
                    activeComponentIds={activeComponentIds}
                    setActiveComponentIds={setActiveComponentIds}
                    squareSize={squareSize}
                    setSquareSize={setSquareSize}
                    placedSquareLayers={placedSquareLayers}
                    setPlacedSquareLayers={setPlacedSquareLayers}
                    triangleRows={triangleRows}
                    setTriangleRows={setTriangleRows}
                    placedTriLayers={placedTriLayers}
                    setPlacedTriLayers={setPlacedTriLayers}
                    kochDepth={kochDepth}
                    setKochDepth={setKochDepth}
                  />
                </div>
                <div style={{ padding: '0 20px 16px 20px', flexShrink: 0 }}>
                  {renderBottomNav(5, 6, 4)}
                </div>
              </div>
            </div>
          </div>
        ) : currentStep === 6 ? (
          <div className="math-responsive-layout">
            {renderLeftPanelContent()}
            <div className="math-right-panel">
              <div className="math-section-header-area">
                <div className="math-section-eyebrow">✨ SECTION 6</div>
                <h2 className="math-section-title">📖 Shapes to Numbers</h2>
              </div>
              <div className="math-inner-content-card">
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', minHeight: 0 }} className="hide-scrollbar">
                  <ShapesToNumbers 
                    currentSlide={currentSlide}
                    s2nShapeSides={s2nShapeSides} setS2NShapeSides={setS2NShapeSides}
                    s2nPeopleCount={s2nPeopleCount} setS2NPeopleCount={setS2NPeopleCount}
                    s2nTriRows={s2nTriRows} setS2NTriRows={setS2NTriRows}
                    s2nKochIter={s2nKochIter} setS2NKochIter={setS2NKochIter}
                  />
                </div>
                <div style={{ padding: '0 20px 16px 20px', flexShrink: 0 }}>
                  {renderBottomNav(2, 7, 5)}
                </div>
              </div>
            </div>
          </div>
        ) : currentStep === 7 ? (
          <div className="math-responsive-layout">
            {renderLeftPanelContent()}
            <div className="math-right-panel">
              <div className="math-section-header-area">
                <div className="math-section-eyebrow">✨ SECTION 7</div>
                <h2 className="math-section-title">📖 Real Life Math Lab</h2>
              </div>
              <div className="math-inner-content-card">
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', minHeight: 0 }} className="hide-scrollbar">
                  <RealLifeMathLab 
                    currentSlide={currentSlide}
                    labSelectedCenter={labSelectedCenter} setLabSelectedCenter={setLabSelectedCenter}
                    labKgPotatoes={labKgPotatoes} setLabKgPotatoes={(val) => { setLabKgPotatoes(val); setCheckoutStep(0); }}
                    labKgTomatoes={labKgTomatoes} setLabKgTomatoes={(val) => { setLabKgTomatoes(val); setCheckoutStep(0); }}
                    labSelectedFlower={labSelectedFlower} setLabSelectedFlower={setLabSelectedFlower}
                    labViralRounds={labViralRounds} setLabViralRounds={setLabViralRounds}
                    checkoutStep={checkoutStep}
                    onTriggerCheckout={() => setCheckoutStep(prev => prev + 1)}
                  />
                </div>
                <div style={{ padding: '0 20px 16px 20px', flexShrink: 0 }}>
                  {renderBottomNav(4, 8, 6)}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="math-responsive-layout">
            {renderLeftPanelContent()}
            <div className="math-right-panel">
              <div className="math-section-header-area">
                <div className="math-section-eyebrow">✨ SECTION 8</div>
                <h2 className="math-section-title">📖 Chapter Quiz & Solutions</h2>
              </div>
              <div className="math-inner-content-card">
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', minHeight: 0 }} className="hide-scrollbar">
                  <ChapterQuizAndSolutions 
                    currentSlide={currentSlide}
                    quizAnswers={quizAnswers} setQuizAnswers={setQuizAnswers}
                    isQuizSubmitted={isQuizSubmitted} setIsQuizSubmitted={setIsQuizSubmitted}
                    quizScore={quizScore}
                    activeQuizQuestionId={activeQuizQuestionId}
                    setActiveQuizQuestionId={setActiveQuizQuestionId}
                  />
                </div>
                <div style={{ padding: '0 20px 16px 20px', flexShrink: 0 }}>
                  {renderBottomNav(4, null, 7)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
