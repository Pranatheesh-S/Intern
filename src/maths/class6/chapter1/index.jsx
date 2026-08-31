
import React, { useState, useRef } from 'react';
import { ArrowLeft, Sparkles, Compass, Calculator, Grid, Layers, Hexagon, ArrowRightLeft, Award, Maximize2, ShieldCheck, CheckCircle2, Eye, Box, Globe2, BookOpen, Palette } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ErrorBoundary from '../../../components/ErrorBoundary';
import confetti from 'canvas-confetti';
import WhatMaths from './WhatMaths';
import PatternsEverywhere from './PatternsEverywhere';
import ManActivity from './ManActivity';
import PatternMachines from './PatternMachines';
import PatternsInNumbers from './PatternsInNumbers';
import NumberSequencesTable from './NumberSequencesTable';
import VisualisingSequences from './VisualisingSequences';
import RelationsAmongSequences from './RelationsAmongSequences';
import './MathsChapter1Dark.css';
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
import './theme.css';

export { PASTEL_THEMES, SEQUENCES, QUIZ_QUESTIONS };

export default function Class6MathsChapter1({ onBackToDashboard }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [pastelTheme, setPastelTheme] = useState('periwinkle');
  const navRef = useRef(null);

  // Section 1.5 Shared Table 3 State
  const [activeActivity, setActiveActivity] = useState(1);
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

  const currentPolygon = POLYGONS_DATA[polygonIdx || 0] || POLYGONS_DATA[0];
  const currentGraph = COMPLETE_GRAPHS_MODULAR_DATA[graphIdx || 0] || COMPLETE_GRAPHS_MODULAR_DATA[0];

  const tabs = [
    { id: 1, label: '1.1', title: 'Chapter Introduction', subtitle: 'Patterns in Mathematics' },
    { id: 2, label: '1.2', title: 'Number Sequences', subtitle: 'Table 1 · 10 Famous Patterns' },
    { id: 3, label: '1.3', title: 'Visualising Numbers', subtitle: 'Dot Grids & 3D Cubes' },
    { id: 4, label: '1.4', title: 'Relations in Patterns', subtitle: 'Odd Sums & Visual Proofs' },
    { id: 5, label: '1.5', title: 'Patterns in Shapes', subtitle: 'Table 3 · Shape Sequences' },
    { id: 6, label: '1.6', title: 'Shapes ⇌ Numbers', subtitle: 'Geometry to Algebra Bridge' },
    { id: 7, label: '1.7', title: 'Real-Life Math Lab', subtitle: 'Calendar, Rates & Nature' },
    { id: 8, label: '1.8', title: 'Summary & Quiz', subtitle: 'Assessment & Detective Lab' }
  ];

  const getSlidesForStep = (step) => {
    switch (step) {
      case 5: return 5;
      case 6: return 2;
      default: return 4;
    }
  };

  const handleSubNext = () => {
    if (subStep < 4) setSubStep(prev => prev + 1);
    else { setCurrentStep(2); setSubStep(1); }
  };
  const handleSubPrev = () => {
    if (subStep > 1) setSubStep(prev => prev - 1);
    else onBackToDashboard();
  };

  const totalSlides = getSlidesForStep(currentStep);

  const handleNext = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(prev => prev + 1);
    } else if (currentStep < 8) {
      setCurrentStep(prev => prev + 1);
      setCurrentSlide(1);
    } else if (currentStep === 8 && currentSlide === totalSlides) {
      if (onBackToDashboard) {
        onBackToDashboard();
      }
    }
  };

  const handleBack = () => {
    if (currentSlide > 1) {
      setCurrentSlide(prev => prev - 1);
    } else if (currentStep > 1) {
      const prevStep = currentStep - 1;
      const prevStepTotalSlides = getSlidesForStep(prevStep);
      setCurrentStep(prevStep);
      setCurrentSlide(prevStepTotalSlides);
    } else if (onBackToDashboard) {
      onBackToDashboard();
    }
  };

  const renderLeftShowcase = () => {
    if (currentStep === 5) {
      const activeShapeActivity = currentSlide;
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '18px', overflow: 'hidden', background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #f8fafc 60%, #e2e8f0 100%)', border: '1.8px solid var(--theme-border, #a7f3d0)', boxShadow: '0 8px 24px rgba(13, 148, 136, 0.08)' }}>
          <ErrorBoundary fallback={<div style={{ color: 'var(--theme-heading, #134e4a)', padding: '1.2rem', fontWeight: '800' }}>3D Studio initializing...</div>}>
            <Canvas camera={{ position: [0, 0.1, 3.2], fov: 45 }} shadows dpr={[1, 2]}>
              <ambientLight intensity={1.9} />
              <directionalLight position={[6, 12, 8]} intensity={2.5} castShadow />
              <directionalLight position={[-6, -4, -4]} intensity={1.3} color="#ffffff" />
              <pointLight position={[0, 6, 6]} intensity={1.5} color="#ffffff" />

              <group scale={0.65}>
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

          <div style={{ position: 'absolute', top: '12px', left: '14px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(6px)', padding: '5px 12px', borderRadius: '10px', border: '1.5px solid var(--theme-border, #a7f3d0)', color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.82rem', fontWeight: '800', pointerEvents: 'none', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
            {activeShapeActivity === 1 ? (viewMode === 'real' ? '🌍 Real-World 3D Object' : '📐 Geometric Regular Polygon 3D') : activeShapeActivity === 2 ? '✈️ 3D Direct City Flight Network (Airways)' : activeShapeActivity === 3 ? '🎨 3D Handcrafted Ceramic Heritage Tiles' : activeShapeActivity === 4 ? '🎱 3D Billiards 15-Ball Triangle Rack' : '🔲 3D Studio · Drag to Orbit'}
          </div>

          <div style={{ position: 'absolute', bottom: '12px', right: '14px', background: 'rgba(255, 255, 255, 0.98)', padding: '5px 14px', borderRadius: '10px', border: '1.5px solid var(--theme-border, #a7f3d0)', color: 'var(--theme-heading, #134e4a)', fontSize: '0.84rem', fontWeight: '900', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
            {activeShapeActivity === 1 && `${POLYGONS_DATA[polygonIdx || 0]?.sides}-gon (${POLYGONS_DATA[polygonIdx || 0]?.name})`}
            {activeShapeActivity === 2 && `✈️ ${COMPLETE_GRAPHS_MODULAR_DATA[graphIdx || 0]?.n} Cities (${COMPLETE_GRAPHS_MODULAR_DATA[graphIdx || 0]?.total} Flight Routes)`}
            {activeShapeActivity === 3 && `Athangudi Layer ${placedSquareLayers}/${squareSize}`}
            {activeShapeActivity === 4 && `Billiards Rack Row ${placedTriLayers}/${triangleRows} (${(placedTriLayers * (placedTriLayers + 1)) / 2} Balls)`}
            {activeShapeActivity === 5 && `Kolam Depth ${kochDepth} (${3 * Math.pow(4, kochDepth)} Segments)`}
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '18px', overflow: 'hidden', background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #f0fdfa 60%, #ccfbf1 100%)', border: '1.8px solid var(--theme-border, #a7f3d0)', boxShadow: '0 6px 20px rgba(13, 148, 136, 0.06)' }}>
            <ErrorBoundary>
              <Canvas camera={{ position: [0, 0.8, 3.8], fov: 45 }}>
                <ambientLight intensity={1.8} />
                <pointLight position={[0, 0, 0]} intensity={3.5} color="#fef08a" />
                <directionalLight position={[5, 8, 5]} intensity={2.2} />
                <CelestialOrrery3D />
                <OrbitControls enablePan={false} maxDistance={6} minDistance={2} />
              </Canvas>
            </ErrorBoundary>
          </div>
        );
      case 2:
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '18px', overflow: 'hidden', background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #f0fdfa 60%, #ccfbf1 100%)', border: '1.8px solid var(--theme-border, #a7f3d0)', boxShadow: '0 6px 20px rgba(13, 148, 136, 0.06)' }}>
            <ErrorBoundary>
              <Canvas camera={{ position: [0, 1.2, 3.6], fov: 45 }}>
                <ambientLight intensity={2.0} />
                <AncientManuscript3D />
                <OrbitControls enablePan={false} maxDistance={6} minDistance={2} />
              </Canvas>
            </ErrorBoundary>
          </div>
        );
      case 3:
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '18px', overflow: 'hidden', background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #f0fdfa 60%, #ccfbf1 100%)', border: '1.8px solid var(--theme-border, #a7f3d0)', boxShadow: '0 6px 20px rgba(13, 148, 136, 0.06)' }}>
            <ErrorBoundary>
              <Canvas camera={{ position: [0, 1.2, 4.2], fov: 45 }}>
                <ambientLight intensity={2.0} />
                <VoxelCube3D />
                <OrbitControls enablePan={false} maxDistance={6} minDistance={2} />
              </Canvas>
            </ErrorBoundary>
          </div>
        );
      case 4:
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '18px', overflow: 'hidden', background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #f0fdfa 60%, #ccfbf1 100%)', border: '1.8px solid var(--theme-border, #a7f3d0)', boxShadow: '0 6px 20px rgba(13, 148, 136, 0.06)' }}>
            <ErrorBoundary>
              <Canvas camera={{ position: [0, 1.8, 3.8], fov: 45 }}>
                <ambientLight intensity={2.0} />
                <GnomonPuzzle3D />
                <OrbitControls enablePan={false} maxDistance={6} minDistance={2} />
              </Canvas>
            </ErrorBoundary>
          </div>
        );
      case 6:
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '18px', overflow: 'hidden', background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #f0fdfa 60%, #ccfbf1 100%)', border: '1.8px solid var(--theme-border, #a7f3d0)', boxShadow: '0 6px 20px rgba(13, 148, 136, 0.06)' }}>
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
      case 7:
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '18px', overflow: 'hidden', background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #f0fdfa 60%, #ccfbf1 100%)', border: '1.8px solid var(--theme-border, #a7f3d0)', boxShadow: '0 6px 20px rgba(13, 148, 136, 0.06)' }}>
            <ErrorBoundary>
              <Canvas camera={{ position: [0, 0.8, 4.2], fov: 45 }}>
                <ambientLight intensity={2.0} />
                <group scale={0.65}>
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
      case 8:
      default:
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '18px', overflow: 'hidden', background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #f0fdfa 60%, #ccfbf1 100%)', border: '1.8px solid var(--theme-border, #a7f3d0)', boxShadow: '0 6px 20px rgba(13, 148, 136, 0.06)' }}>
            <ErrorBoundary>
              <Canvas camera={{ position: [0, 1.2, 4.2], fov: 45 }}>
                <ambientLight intensity={1.8} />
                <group scale={0.65}>
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
  };

  return (
    <div 
      className={`theme-${pastelTheme}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 101,
        boxSizing: 'border-box',
        padding: '10px 16px',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--theme-bg, #f0fdfa)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: 'hidden',
        transition: 'background 0.25s ease'
      }}
    >
      <div style={{ flexShrink: 0, width: '100%', marginBottom: '0.45rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
          <button
            type="button"
            onClick={onBackToDashboard}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.15rem',
              padding: '0.3rem 0.5rem',
              fontSize: '0.72rem',
              fontWeight: '900',
              color: 'var(--theme-heading, #134e4a)',
              border: '1.8px solid var(--theme-border, #a7f3d0)',
              borderRadius: '14px',
              background: '#ffffff',
              cursor: 'pointer',
              flexShrink: 0,
              minHeight: '54px',
              width: '74px',
              boxSizing: 'border-box',
              lineHeight: 1.15,
              textAlign: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={17} color="var(--theme-primary, #0d9488)" />
            <span>Dashboard</span>
          </button>

          <nav
            ref={navRef}
            style={{
              flex: 1,
              minWidth: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(8, minmax(95px, 1fr))',
              gap: '0.35rem',
              overflow: 'hidden'
            }}
          >
            {tabs.map((tab) => {
              const isActive = currentStep === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentStep(tab.id);
                    setCurrentSlide(1);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.5rem',
                    background: isActive ? 'var(--theme-card-bg, #ffffff)' : 'var(--theme-workbench-bg, #f0fdf4)',
                    border: `2px solid ${isActive ? 'var(--theme-primary, #0d9488)' : 'var(--theme-border, #a7f3d0)'}`,
                    borderRadius: '14px',
                    width: '100%',
                    minHeight: '54px',
                    cursor: 'pointer',
                    boxShadow: isActive ? 'var(--theme-btn-shadow, 0 4px 14px rgba(13, 148, 136, 0.22))' : 'none',
                    textAlign: 'left',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: isActive ? 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))' : 'var(--theme-border-strong, #5eead4)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.76rem',
                    fontWeight: '900',
                    flexShrink: 0
                  }}>
                    {tab.id}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '900', color: isActive ? 'var(--theme-primary-dark, #0f766e)' : 'var(--theme-heading, #134e4a)', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                      {tab.title}
                    </span>
                    <span style={{ fontSize: '0.64rem', color: isActive ? 'var(--theme-primary, #0d9488)' : '#64748b', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', fontWeight: '700' }}>
                      {tab.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div style={{
        flex: 1,
        minHeight: 0,
        display: currentStep <= 4 ? 'block' : 'grid',
        gridTemplateColumns: currentStep <= 4 ? 'none' : '1fr 1fr',
        gap: '16px',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        {currentStep > 4 && (
        <div style={{
          background: '#ffffff',
          borderRadius: '22px',
          border: '1.8px solid var(--theme-border, #a7f3d0)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.05)',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.7rem',
          height: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: 'var(--theme-primary, #0d9488)', fontWeight: '900', fontSize: '0.82rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                CHAPTER 1 · CLASS 6 MATHEMATICS
              </div>
              <h1 className="math-serif-title" style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)', margin: '0.15rem 0 0 0' }}>
                Patterns in Mathematics
              </h1>
            </div>
            <div style={{
              background: 'var(--theme-badge-bg, #ccfbf1)',
              border: '1.5px solid var(--theme-border, #a7f3d0)',
              color: 'var(--theme-badge-text, #0f766e)',
              padding: '4px 10px',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: '900',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <Eye size={14} /> Live 3D Studio
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0, width: '100%', position: 'relative' }}>
            {renderLeftShowcase()}
          </div>
        </div>
        )}

        <div style={{
          background: '#ffffff',
          borderRadius: '22px',
          border: '1.8px solid var(--theme-border, #a7f3d0)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.05)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          height: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          {currentStep > 4 && (
          <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--theme-primary, #0d9488)', fontWeight: '900', fontSize: '0.82rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                ✨ SECTION {currentStep}
              </div>
              <h2 className="math-serif-title" style={{ margin: '0.15rem 0 0 0', fontSize: '1.45rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
                📖 {tabs[currentStep - 1]?.title} — {tabs[currentStep - 1]?.subtitle}
              </h2>
            </div>
            <div style={{ background: 'var(--theme-badge-bg, #ccfbf1)', color: 'var(--theme-badge-text, #0f766e)', padding: '4px 12px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: '900', border: '1px solid var(--theme-border, #a7f3d0)' }}>
              Slide {currentSlide} / {totalSlides}
            </div>
          </div>
          )}

          <div
            style={{
              background: currentStep <= 4 ? 'transparent' : 'var(--theme-workbench-bg, #f0fdf4)',
              borderRadius: '18px',
              border: currentStep <= 4 ? 'none' : '1.8px solid var(--theme-border, #a7f3d0)',
              padding: currentStep <= 4 ? '0' : '1rem 1.25rem',
              flex: 1,
              minHeight: 0,
              overflow: currentStep <= 4 ? 'visible' : 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
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
            ) : currentStep === 5 && currentSlide === 1 ? (
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
            ) : currentStep === 6 ? (
              <ShapesToNumbers 
                currentSlide={currentSlide}
                s2nShapeSides={s2nShapeSides} setS2NShapeSides={setS2NShapeSides}
                s2nPeopleCount={s2nPeopleCount} setS2NPeopleCount={setS2NPeopleCount}
                s2nTriRows={s2nTriRows} setS2NTriRows={setS2NTriRows}
                s2nKochIter={s2nKochIter} setS2NKochIter={setS2NKochIter}
              />
            ) : currentStep === 7 ? (
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
            ) : (
              <ChapterQuizAndSolutions 
                currentSlide={currentSlide}
                quizAnswers={quizAnswers} setQuizAnswers={setQuizAnswers}
                isQuizSubmitted={isQuizSubmitted} setIsQuizSubmitted={setIsQuizSubmitted}
                quizScore={quizScore}
                activeQuizQuestionId={activeQuizQuestionId}
                setActiveQuizQuestionId={setActiveQuizQuestionId}
              />
            )}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '0.25rem',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontWeight: '900', color: 'var(--theme-heading, #134e4a)', fontSize: '0.88rem' }}>
                Slide {currentSlide} of {totalSlides}
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
            </div>

            {currentStep > 4 && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  className="math-pill-btn-back"
                  onClick={handleBack}
                >
                  &lt; Back
                </button>
                <button
                  className="math-pill-btn-next"
                  onClick={handleNext}
                >
                  {currentStep === 8 && currentSlide === totalSlides ? 'Finish Chapter' : 'Next >'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
