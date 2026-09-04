import React, { useState, useRef, useEffect, Suspense } from 'react';
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
import ChapterBackFooter from './ChapterBackFooter';
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
  const [activeComponentIds, setActiveComponentIds] = useState(['0-1', '0-2', '0-3', '1-2', '1-3', '2-3', 'k4-perimeter', 'k4-diagonal']);

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
  const [labMonthIdx, setLabMonthIdx] = useState(0);
  const [labCartIdx, setLabCartIdx] = useState(0);
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
            <Canvas camera={{ position: [0, 0.2, 4.8], fov: 45 }} shadows dpr={[1, 2]}>
              <ambientLight intensity={2.0} color="#ffffff" />
              <directionalLight position={[6, 12, 8]} intensity={2.5} castShadow />
              <directionalLight position={[-6, -4, -4]} intensity={1.3} color="#ffffff" />
              <pointLight position={[0, 6, 6]} intensity={1.5} color="#ffffff" />

              <Suspense fallback={null}>
                <group position={[0, -0.05, 0]} scale={0.92}>
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
              </Suspense>

              <OrbitControls enablePan={false} maxDistance={6} minDistance={1.8} />
            </Canvas>
          </ErrorBoundary>

          <div style={{
            position: 'absolute',
            top: '12px',
            left: '14px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(8px)',
            padding: '5px 14px',
            borderRadius: '10px',
            border: '1.5px solid #BAE6FD',
            color: '#0f172a',
            fontSize: '0.82rem',
            fontWeight: '800',
            pointerEvents: 'none',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)'
          }}>
            {activeShapeActivity === 1 ? (viewMode === 'real' ? '🌍 Real-World 3D Object' : '📐 Geometric Regular Polygon 3D') : activeShapeActivity === 2 ? '🕸️ 3D Complete Graph Kn · Geoboard String Art' : activeShapeActivity === 3 ? '🔲 3D Hardwood Gnomon Blocks (Square Numbers n²)' : activeShapeActivity === 4 ? '🔺 3D Stacked Triangles (Square Numbers n²)' : '🔲 3D Studio · Drag to Orbit'}
          </div>
        </div>
      );
    }

    if (currentStep === 6) {
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <ErrorBoundary>
            <Canvas camera={{ position: currentSlide === 1 ? [0, 2.5, 5.2] : [0, 0.8, 5.2], fov: 44 }}>
              <ambientLight intensity={1.9} color="#ffffff" />
              <directionalLight position={[10, 12, 6]} intensity={2.4} color="#ffffff" castShadow />
              <group 
                position={currentSlide === 1 ? [0, -0.45, 0] : [0, 0.1, 0]} 
                scale={currentSlide === 1 ? 0.76 : 0.9}
              >
                {currentSlide === 1 && <PhotorealisticStackedTrianglesBridge3D rows={s2nTriRows} />}
                {currentSlide === 2 && <Table3KochSnowflake3D depth={s2nKochIter} />}
              </group>
              <OrbitControls enablePan={false} maxDistance={7} minDistance={2} />
            </Canvas>
          </ErrorBoundary>
        </div>
      );
    }

    if (currentStep === 7) {
      const isSlide2 = currentSlide === 2;
      const isSlide4 = currentSlide === 4;
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <ErrorBoundary>
            <Canvas 
              camera={{ position: isSlide4 ? [0, 1.3, 5.2] : [0, 0.65, 5.8], fov: 45 }} 
              dpr={[1.5, 2]} 
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <ambientLight intensity={2.0} color="#ffffff" />
              <group 
                position={isSlide2 ? [0.04, 0.08, 1.45] : isSlide4 ? [-0.05, 0.05, 0] : [0, 0.12, 0]} 
                scale={isSlide2 ? 1.15 : isSlide4 ? 0.84 : 0.92}
              >
                {currentSlide === 1 && <CalendarDesk3D selectedCenter={labSelectedCenter} monthIdx={labMonthIdx} onSelectCenter={setLabSelectedCenter} />}
                {currentSlide === 2 && <MarketProduce3D cartIdx={labCartIdx} kgPotatoes={labKgPotatoes} kgTomatoes={labKgTomatoes} checkoutStep={checkoutStep} onCheckoutComplete={() => setCheckoutStep(0)} />}
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
            <Canvas camera={{ position: [0, 1.0, 5.2], fov: 45 }}>
              <ambientLight intensity={2.0} color="#ffffff" />
              <directionalLight position={[6, 10, 8]} intensity={2.4} color="#ffffff" castShadow />
              <group position={[0, 0.05, 0]} scale={0.92}>
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

  const renderLeftPanelContent = () => (
    <div style={{ flex: 1, background: '#E0F2FE', borderRight: '1.5px solid #BAE6FD', padding: '24px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '0.75rem', fontWeight: 900, color: '#1E3A8A', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>CHAPTER 1 · CLASS 6 MATHEMATICS</div>
      <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: '2.5rem', fontWeight: 800, color: '#1E40AF', margin: '0 0 16px 0', lineHeight: 1.15 }}>Patterns in Mathematics</h1>
      
      <div style={{
        position: 'relative',
        width: '100%',
        flex: 1,
        minHeight: 0,
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 25%, #ffffff 0%, #f0fdf4 40%, #e0f2fe 100%)',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
        border: '1.5px solid #BAE6FD'
      }}>
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'rgba(255, 255, 255, 0.92)',
          color: '#0284c7',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 900,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(14, 116, 144, 0.12)',
          border: '1.5px solid #BAE6FD',
          backdropFilter: 'blur(8px)'
        }}>
          ✨ INTERACTIVE 3D
        </div>
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
      fontFamily: '"Space Grotesk", sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '100%', height: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(160deg, #F0F8FF 0%, #E6F2FF 100%)', // Pastel Blue theme background
        overflow: 'hidden', position: 'relative', borderRadius: '20px', border: '2px solid #BAE6FD',
        boxShadow: '0 8px 30px rgba(15,23,42,0.06)'
      }}>
        {/* Top Header / Tabs Area */}
        <div style={{ width: '100%', borderBottom: '1.5px solid #BAE6FD', background: 'rgba(255, 255, 255, 0.4)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', width: '100%', alignItems: 'center' }}>
            <button
              onClick={onBackToDashboard}
              title="Back to Main Page"
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '0.15rem', padding: '0.35rem 0.4rem', fontSize: '0.62rem', fontWeight: '800',
                color: '#1E3A8A', border: '1.5px solid #93C5FD', borderRadius: '10px',
                background: '#ffffff', cursor: 'pointer', flexShrink: 0,
                minHeight: '64px', width: '68px', boxSizing: 'border-box', lineHeight: 1.15, textAlign: 'center'
              }}
            >
              <ArrowLeft size={14} color="#1E3A8A" />
              <span style={{ color: '#1E3A8A', fontWeight: '800' }}>Back to</span>
              <span style={{ color: '#1E3A8A', fontWeight: '800' }}>Main Page</span>
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
                      display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.55rem',
                      background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                      border: `1.5px solid ${isActive ? '#3B82F6' : '#BAE6FD'}`,
                      borderRadius: '12px', width: '100%', minHeight: '64px', minWidth: '118px',
                      opacity: 1, cursor: tab.locked ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isActive ? '0 4px 15px rgba(59, 130, 246, 0.15)' : 'none',
                      textAlign: 'left', boxSizing: 'border-box', flexShrink: 0
                    }}
                  >
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: isActive ? '#3B82F6' : (isCompleted ? '#3B82F6' : '#94A3B8'), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>
                      {isCompleted ? <CheckCircle size={12} /> : tab.id}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', minWidth: 0, flex: 1 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#1E3A8A', lineHeight: 1.2, whiteSpace: 'normal', width: '100%' }}>{tab.title}</span>
                      <span style={{ fontSize: '0.64rem', color: isActive ? '#3B82F6' : '#64748B', lineHeight: 1.2, whiteSpace: 'normal', width: '100%', fontWeight: '700' }}>{tab.subtitle}</span>
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
          <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
            {renderLeftPanelContent()}
            <div style={{ flex: 1, background: '#FFFFFF', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <div style={{ padding: '24px 24px 0 24px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#3B82F6', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>✨ SECTION 5</div>
                <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: '2.25rem', fontWeight: 800, color: '#1E40AF', margin: '0 0 16px 0' }}>📖 Patterns in Shapes</h2>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px', minHeight: 0 }} className="hide-scrollbar chapter-content-justified">
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
              <ChapterBackFooter
                onBack={() => {
                  if (currentSlide > 1) setCurrentSlide(currentSlide - 1);
                  else { setCurrentStep(4); setCurrentSlide(1); }
                }}
                onNext={() => {
                  if (currentSlide < 5) setCurrentSlide(currentSlide + 1);
                  else { setCurrentStep(6); setCurrentSlide(1); }
                }}
                nextLabel="Next"
                nextVariant="blue"
                centerContent={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#1E3A8A' }}>
                    <span>Slide {currentSlide} of 5</span>
                  </div>
                }
              />
            </div>
          </div>
        ) : currentStep === 6 ? (
          <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
            {renderLeftPanelContent()}
            <div style={{ flex: 1, background: '#FFFFFF', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <div style={{ padding: '24px 24px 0 24px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#3B82F6', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>✨ SECTION 6</div>
                <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: '2.25rem', fontWeight: 800, color: '#1E40AF', margin: '0 0 16px 0' }}>📖 Shapes to Numbers</h2>
              </div>
              <h2 className="math-serif-title" style={{ margin: '0.15rem 0 0 0', fontSize: '1.45rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
                📖 {tabs[currentStep - 1]?.title} — {tabs[currentStep - 1]?.subtitle}
              </h2>
            </div>
            <div style={{ background: 'var(--theme-badge-bg, #ccfbf1)', color: 'var(--theme-badge-text, #0f766e)', padding: '4px 12px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: '900', border: '1px solid var(--theme-border, #a7f3d0)' }}>
              LEARNING STEP 0{currentSlide} / 0{totalSlides}
            </div>
          </div>
        ) : currentStep === 7 ? (
          <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
            {renderLeftPanelContent()}
            <div style={{ flex: 1, background: '#FFFFFF', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <div style={{ padding: '24px 24px 0 24px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#3B82F6', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>✨ SECTION 7</div>
                <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: '2.25rem', fontWeight: 800, color: '#1E40AF', margin: '0 0 16px 0' }}>📖 Real Life Math Lab</h2>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px', minHeight: 0 }} className="hide-scrollbar chapter-content-justified">
                <RealLifeMathLab 
                  currentSlide={currentSlide}
                  labMonthIdx={labMonthIdx} setLabMonthIdx={setLabMonthIdx}
                  labCartIdx={labCartIdx} setLabCartIdx={setLabCartIdx}
                  labSelectedCenter={labSelectedCenter} setLabSelectedCenter={setLabSelectedCenter}
                  labKgPotatoes={labKgPotatoes} setLabKgPotatoes={(val) => { setLabKgPotatoes(val); setCheckoutStep(0); }}
                  labKgTomatoes={labKgTomatoes} setLabKgTomatoes={(val) => { setLabKgTomatoes(val); setCheckoutStep(0); }}
                  labSelectedFlower={labSelectedFlower} setLabSelectedFlower={setLabSelectedFlower}
                  labViralRounds={labViralRounds} setLabViralRounds={setLabViralRounds}
                  checkoutStep={checkoutStep}
                  onTriggerCheckout={() => setCheckoutStep(prev => prev + 1)}
                />
              </div>
              <ChapterBackFooter
                onBack={() => {
                  if (currentSlide > 1) setCurrentSlide(currentSlide - 1);
                  else { setCurrentStep(6); setCurrentSlide(1); }
                }}
                onNext={() => {
                  if (currentSlide < 4) setCurrentSlide(currentSlide + 1);
                  else { setCurrentStep(8); setCurrentSlide(1); }
                }}
                nextLabel="Next"
                nextVariant="blue"
                centerContent={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#1E3A8A' }}>
                    <span>Slide {currentSlide} of 4</span>
                  </div>
                }
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '0.25rem',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontWeight: '800', color: 'var(--theme-heading, #0f172a)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                LEARNING STEP 0{currentSlide} / 0{totalSlides}
              </span>
              <div style={{ display: 'flex', gap: '5px' }}>
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: currentSlide === i + 1 ? 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))' : 'var(--theme-border, #a7f3d0)',
                      transition: 'all 0.2s',
                      boxShadow: currentSlide === i + 1 ? 'var(--theme-btn-shadow, 0 0 8px rgba(13, 148, 136, 0.4))' : 'none'
                    }}
                  />
                ))}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px', minHeight: 0 }} className="hide-scrollbar chapter-content-justified">
                <ChapterQuizAndSolutions 
                  currentSlide={currentSlide}
                  quizAnswers={quizAnswers} setQuizAnswers={setQuizAnswers}
                  isQuizSubmitted={isQuizSubmitted} setIsQuizSubmitted={setIsQuizSubmitted}
                  quizScore={quizScore}
                  activeQuizQuestionId={activeQuizQuestionId}
                  setActiveQuizQuestionId={setActiveQuizQuestionId}
                />
              </div>
              <ChapterBackFooter
                onBack={() => {
                  if (currentSlide > 1) setCurrentSlide(currentSlide - 1);
                  else { setCurrentStep(7); setCurrentSlide(1); }
                }}
                onNext={currentSlide < 4 ? () => setCurrentSlide(currentSlide + 1) : null}
                nextLabel={currentSlide < 4 ? "Next" : null}
                nextVariant="blue"
                centerContent={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#1E3A8A' }}>
                    <span>Slide {currentSlide} of 4</span>
                  </div>
                }
              />
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
