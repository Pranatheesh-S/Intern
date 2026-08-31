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
import PatternsInShapes from './PatternsInShapes';
import ShapesToNumbers from './ShapesToNumbers';
import RealLifeMathLab from './RealLifeMathLab';
import ChapterQuizAndSolutions from './ChapterQuizAndSolutions';
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
                    border: `1.5px solid ${isActive ? '#F5A623' : '#cbd5e1'}`,
                    borderRadius: '12px',
                    width: '100%',
                    minHeight: '64px',
                    minWidth: '118px',
                    opacity: 1,
                    cursor: tab.locked ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? '0 4px 15px rgba(245, 166, 35, 0.25)' : 'none',
                    textAlign: 'left',
                    boxSizing: 'border-box',
                    flexShrink: 0
                  }}
                >
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: isActive ? '#F5A623' : (isCompleted ? '#F5A623' : '#64748b'), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>
                    {isCompleted ? <CheckCircle size={12} /> : tab.id}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.2, whiteSpace: 'normal', width: '100%' }}>{tab.title}</span>
                    <span style={{ fontSize: '0.64rem', color: isActive ? '#d97706' : '#334155', lineHeight: 1.2, whiteSpace: 'normal', width: '100%', fontWeight: '700' }}>{tab.subtitle}</span>
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
    </div>
  );
}
