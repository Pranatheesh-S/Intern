import React, { useState } from 'react';
import {
  ShieldAlert,
  Crosshair,
  Unlock,
  Lock,
  Fingerprint,
  BookOpen,
  Trophy,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './theme.css';
import { QUIZ_QUESTIONS, NCERT_SOLUTIONS_GUIDE } from './data';

export default function ChapterQuizAndSolutions({
  currentSlide = 1,
  quizAnswers,
  setQuizAnswers,
  isQuizSubmitted,
  setIsQuizSubmitted,
  quizScore,
  activeQuizQuestionId = 1,
  setActiveQuizQuestionId
}) {
  const [selectedSolutionTab, setSelectedSolutionTab] = useState('1.1');
  const [activeQuestionTier, setActiveQuestionTier] = useState(0); // 0: Q1-Q3, 1: Q4-Q6 (Slide 2) | 0: Q7-Q9, 1: Q10-Q12 (Slide 3)

  const totalQuestions = QUIZ_QUESTIONS.length;
  const passingScore = 8;
  const isMasterSafeUnlocked = isQuizSubmitted && quizScore >= passingScore;

  const handleSelect = (qId, optIdx) => {
    if (isQuizSubmitted) return;
    setActiveQuizQuestionId?.(qId);
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    setIsQuizSubmitted(true);
    if (quizScore >= passingScore) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#14b8a6', '#22c55e', '#f59e0b', '#6366f1']
      });
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setIsQuizSubmitted(false);
  };

  // Questions for Slide 2 (Q1-Q6) split into 2 sub-pages of 3 questions to prevent scrolling
  const slide2Questions = QUIZ_QUESTIONS.slice(activeQuestionTier * 3, activeQuestionTier * 3 + 3);

  // Questions for Slide 3 (Q7-Q12) split into 2 sub-pages of 3 questions to prevent scrolling
  const slide3Questions = QUIZ_QUESTIONS.slice(6 + activeQuestionTier * 3, 6 + activeQuestionTier * 3 + 3);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        justifyContent: 'space-between',
        background: '#ffffff',
        padding: '0.75rem 1rem',
        borderRadius: '16px',
        border: '1.8px solid var(--theme-border, #a7f3d0)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        color: '#1e293b'
      }}
    >
      {/* SLIDE 1: MISSION BRIEFING / DETECTIVE INTEL (LIGHT THEME) */}
      {currentSlide === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%', justifyContent: 'space-between' }}>
          <div style={{ borderBottom: '1.5px solid var(--theme-border, #a7f3d0)', paddingBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.28rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <ShieldAlert size={22} color="var(--theme-primary, #0d9488)" /> MISSION BRIEFING: OPERATION PATTERN DECRYPT
            </h3>
            <span style={{ background: 'var(--theme-badge-bg, #ccfbf1)', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.76rem', fontWeight: '800', color: 'var(--theme-badge-text, #0f766e)' }}>
              NCERT GANITA PRAKASH · CH. 1
            </span>
          </div>

          <div style={{ background: 'var(--theme-bg, #f0fdfa)', border: '1.5px solid var(--theme-border, #a7f3d0)', borderRadius: '12px', padding: '0.75rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ color: 'var(--theme-primary-dark, #0f766e)', fontSize: '0.84rem', fontWeight: '900', letterSpacing: '0.04em' }}>
              📋 MATHEMATICAL DISCOVERY DOSSIER
            </div>
            <ul style={{ margin: '0.3rem 0', paddingLeft: '1.15rem', color: '#334155', fontSize: '0.86rem', lineHeight: 1.55 }}>
              <li style={{ marginBottom: '0.35rem', textAlign: 'justify', fontSize: '1.0rem' }}>
                <strong style={{ color: 'var(--theme-heading, #134e4a)' }}>[Universal Laws]:</strong> Mathematics is the search for patterns and explanations—powering orbital gravitation, satellite GPS, and life-saving genomics.
              </li>
              <li style={{ marginBottom: '0.35rem', textAlign: 'justify', fontSize: '1.0rem' }}>
                <strong style={{ color: 'var(--theme-heading, #134e4a)' }}>[Number Theory]:</strong> Triangular (Tₙ), Square (n²), and Virahānka (1, 2, 3, 5, 8…) series represent geometric proofs and recursive growth equations.
              </li>
              <li style={{ textAlign: 'justify', fontSize: '1.0rem' }}>
                <strong style={{ color: 'var(--theme-heading, #134e4a)' }}>[Geometry Bridge]:</strong> Polygon sides equal vertices (V=E). Complete graph chords equal triangular numbers (Tₙ₋₁). Odd sums form squares (n²).
              </li>
            </ul>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.2rem' }}>
              <div style={{ background: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--theme-border, #a7f3d0)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '800' }}>TOTAL CLUES</div>
                <div style={{ fontSize: '1.05rem', fontWeight: '900', color: 'var(--theme-primary, #0d9488)' }}>{totalQuestions} Questions</div>
              </div>
              <div style={{ background: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--theme-border, #a7f3d0)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '800' }}>CLEARANCE PASS</div>
                <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#15803d' }}>≥ {passingScore}/{totalQuestions} (80%)</div>
              </div>
              <div style={{ background: '#ffffff', padding: '0.4rem 0.6rem', borderRadius: '8px', border: '1px solid var(--theme-border, #a7f3d0)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '800' }}>REWARD VAULT</div>
                <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#d97706' }}>24K Trophy</div>
              </div>
            </div>

            <div style={{ color: 'var(--theme-heading, #134e4a)', fontSize: '0.82rem', fontWeight: '800', textAlign: 'center', padding: '0.35rem', background: '#ffffff', borderRadius: '8px', border: '1px dashed var(--theme-border-strong, #5eead4)' }}>
              🎯 Navigate to Slides 2 & 3 to resolve all 12 forensic clues and unlock the master vault.
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 2: CLEARANCE LEVEL 1 (Q1 to Q6) */}
      {currentSlide === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', height: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid var(--theme-border, #a7f3d0)', paddingBottom: '0.35rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Crosshair size={20} color="var(--theme-primary, #0d9488)" /> LEVEL 1 CLEARANCE: FILES Q1 – Q6
            </h3>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                onClick={() => { setActiveQuestionTier(0); setActiveQuizQuestionId?.(1); }}
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  border: activeQuestionTier === 0 ? '1.8px solid var(--theme-primary, #0d9488)' : '1px solid var(--theme-border, #a7f3d0)',
                  background: activeQuestionTier === 0 ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff',
                  color: activeQuestionTier === 0 ? 'var(--theme-primary-dark, #0f766e)' : '#64748b',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Clues 1–3
              </button>
              <button
                onClick={() => { setActiveQuestionTier(1); setActiveQuizQuestionId?.(4); }}
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  border: activeQuestionTier === 1 ? '1.8px solid var(--theme-primary, #0d9488)' : '1px solid var(--theme-border, #a7f3d0)',
                  background: activeQuestionTier === 1 ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff',
                  color: activeQuestionTier === 1 ? 'var(--theme-primary-dark, #0f766e)' : '#64748b',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Clues 4–6
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1, justifyContent: 'space-between' }}>
            {slide2Questions.map((q) => {
              const userAns = quizAnswers[q.id];
              const isCorrect = userAns === q.correct;
              const isFocused = activeQuizQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  onClick={() => setActiveQuizQuestionId?.(q.id)}
                  style={{
                    background: isFocused ? 'var(--theme-badge-bg, #ccfbf1)' : 'var(--theme-bg, #f0fdfa)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    borderLeft: `4px solid ${isQuizSubmitted ? (isCorrect ? '#22c55e' : '#ef4444') : isFocused ? 'var(--theme-primary, #0d9488)' : '#94a3b8'}`,
                    border: isFocused ? '1.8px solid var(--theme-primary, #0d9488)' : '1px solid var(--theme-border, #a7f3d0)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--theme-heading, #134e4a)', lineHeight: 1.35, textAlign: 'left' }}>
                      <span style={{ color: 'var(--theme-primary, #0d9488)' }}>#{q.id}</span> {q.question}
                    </div>
                    <span style={{ fontSize: '0.68rem', background: '#ffffff', color: '#0f766e', padding: '1px 6px', borderRadius: '4px', border: '1px solid var(--theme-border, #a7f3d0)', flexShrink: 0, marginLeft: '0.4rem', fontWeight: '800' }}>
                      {q.pageRef} • 3D 🔍
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.35rem' }}>
                    {q.options.map((opt, idx) => {
                      const isSel = userAns === idx;
                      let bg = isSel ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff';
                      let borderColor = isSel ? 'var(--theme-primary, #0d9488)' : 'var(--theme-border, #a7f3d0)';
                      let textColor = isSel ? 'var(--theme-primary-dark, #0f766e)' : '#334155';

                      if (isQuizSubmitted) {
                        if (idx === q.correct) {
                          bg = '#dcfce7';
                          borderColor = '#22c55e';
                          textColor = '#15803d';
                        } else if (isSel) {
                          bg = '#fee2e2';
                          borderColor = '#ef4444';
                          textColor = '#b91c1c';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); handleSelect(q.id, idx); }}
                          style={{
                            padding: '0.3rem 0.5rem',
                            borderRadius: '6px',
                            border: `1.5px solid ${borderColor}`,
                            background: bg,
                            color: textColor,
                            fontSize: '0.82rem',
                            textAlign: 'left',
                            cursor: isQuizSubmitted ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.3rem',
                            lineHeight: 1.25,
                            fontWeight: isSel ? '800' : '600',
                            width: '100%'
                          }}
                        >
                          <span style={{ color: isSel ? 'var(--theme-primary, #0d9488)' : '#94a3b8', fontWeight: '900', fontSize: '0.78rem', marginTop: '0.05rem', flexShrink: 0 }}>
                            [{String.fromCharCode(65 + idx)}]
                          </span>
                          <span style={{ whiteSpace: 'normal', flex: 1 }}>
                            {opt}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SLIDE 3: CLEARANCE LEVEL 2 & DECRYPT TRIGGER (Q7 to Q12) */}
      {currentSlide === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', height: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid var(--theme-border, #a7f3d0)', paddingBottom: '0.35rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={20} color="var(--theme-primary, #0d9488)" /> LEVEL 2 CLEARANCE: MASTER VAULT (Q7–Q12)
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button
                  onClick={() => { setActiveQuestionTier(0); setActiveQuizQuestionId?.(7); }}
                  style={{
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    border: activeQuestionTier === 0 ? '1.8px solid var(--theme-primary, #0d9488)' : '1px solid var(--theme-border, #a7f3d0)',
                    background: activeQuestionTier === 0 ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff',
                    color: activeQuestionTier === 0 ? 'var(--theme-primary-dark, #0f766e)' : '#64748b',
                    fontSize: '0.76rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Clues 7–9
                </button>
                <button
                  onClick={() => { setActiveQuestionTier(1); setActiveQuizQuestionId?.(10); }}
                  style={{
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px',
                    border: activeQuestionTier === 1 ? '1.8px solid var(--theme-primary, #0d9488)' : '1px solid var(--theme-border, #a7f3d0)',
                    background: activeQuestionTier === 1 ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff',
                    color: activeQuestionTier === 1 ? 'var(--theme-primary-dark, #0f766e)' : '#64748b',
                    fontSize: '0.76rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Clues 10–12
                </button>
              </div>

              {!isQuizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '8px',
                    background: 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '900',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--theme-btn-shadow, 0 3px 10px rgba(13, 148, 136, 0.3))'
                  }}
                >
                  <Fingerprint size={14} /> DECRYPT SAFE
                </button>
              ) : (
                <button
                  onClick={handleResetQuiz}
                  style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', fontSize: '0.74rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <RotateCcw size={12} /> Retry
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1, justifyContent: 'space-between' }}>
            {slide3Questions.map((q) => {
              const userAns = quizAnswers[q.id];
              const isCorrect = userAns === q.correct;
              const isFocused = activeQuizQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  onClick={() => setActiveQuizQuestionId?.(q.id)}
                  style={{
                    background: isFocused ? 'var(--theme-badge-bg, #ccfbf1)' : 'var(--theme-bg, #f0fdfa)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    borderLeft: `4px solid ${isQuizSubmitted ? (isCorrect ? '#22c55e' : '#ef4444') : isFocused ? 'var(--theme-primary, #0d9488)' : '#94a3b8'}`,
                    border: isFocused ? '1.8px solid var(--theme-primary, #0d9488)' : '1px solid var(--theme-border, #a7f3d0)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: '800', fontSize: '0.82rem', color: 'var(--theme-heading, #134e4a)', lineHeight: 1.35 }}>
                      <span style={{ color: 'var(--theme-primary, #0d9488)' }}>#{q.id}</span> {q.question}
                    </div>
                    <span style={{ fontSize: '0.68rem', background: '#ffffff', color: '#0f766e', padding: '1px 6px', borderRadius: '4px', border: '1px solid var(--theme-border, #a7f3d0)', flexShrink: 0, marginLeft: '0.4rem', fontWeight: '800' }}>
                      {q.pageRef} • 3D 🔍
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.35rem' }}>
                    {q.options.map((opt, idx) => {
                      const isSel = userAns === idx;
                      let bg = isSel ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff';
                      let borderColor = isSel ? 'var(--theme-primary, #0d9488)' : 'var(--theme-border, #a7f3d0)';
                      let textColor = isSel ? 'var(--theme-primary-dark, #0f766e)' : '#334155';

                      if (isQuizSubmitted) {
                        if (idx === q.correct) {
                          bg = '#dcfce7';
                          borderColor = '#22c55e';
                          textColor = '#15803d';
                        } else if (isSel) {
                          bg = '#fee2e2';
                          borderColor = '#ef4444';
                          textColor = '#b91c1c';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); handleSelect(q.id, idx); }}
                          style={{
                            padding: '0.25rem 0.4rem',
                            borderRadius: '6px',
                            border: `1.5px solid ${borderColor}`,
                            background: bg,
                            color: textColor,
                            fontSize: '0.74rem',
                            textAlign: 'left',
                            cursor: isQuizSubmitted ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.3rem',
                            lineHeight: 1.2,
                            fontWeight: isSel ? '800' : '600',
                            width: '100%'
                          }}
                        >
                          <span style={{ color: isSel ? 'var(--theme-primary, #0d9488)' : '#94a3b8', fontWeight: '900', fontSize: '0.72rem', marginTop: '0.05rem', flexShrink: 0 }}>
                            [{String.fromCharCode(65 + idx)}]
                          </span>
                          <span style={{ whiteSpace: 'normal', flex: 1 }}>
                            {opt}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SLIDE 4: COMPLETE NCERT OFFICIAL SOLUTIONS MANUAL (LIGHT THEME, NO SCROLL) */}
      {currentSlide === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', height: '100%', justifyContent: 'space-between' }}>
          <div style={{ borderBottom: '1.5px solid var(--theme-border, #a7f3d0)', paddingBottom: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.24rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <BookOpen size={22} color="var(--theme-primary, #0d9488)" /> NCERT OFFICIAL SOLUTIONS MANUAL
            </h3>
            <span style={{ background: 'var(--theme-badge-bg, #ccfbf1)', color: 'var(--theme-badge-text, #0f766e)', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.76rem', fontWeight: '800' }}>
              Ganita Prakash Grade 6 Curriculum
            </span>
          </div>

          {/* Section Filter Pills */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {NCERT_SOLUTIONS_GUIDE.map((sec) => (
              <button
                key={sec.section}
                onClick={() => setSelectedSolutionTab(sec.section)}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '8px',
                  border: selectedSolutionTab === sec.section ? '2px solid var(--theme-primary, #0d9488)' : '1px solid var(--theme-border, #a7f3d0)',
                  background: selectedSolutionTab === sec.section ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff',
                  color: selectedSolutionTab === sec.section ? 'var(--theme-primary-dark, #0f766e)' : '#475569',
                  fontWeight: '900',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                § {sec.section}
              </button>
            ))}
          </div>

          {/* Selected Section Solutions Content (Fit cleanly without vertical scroll) */}
          <div
            style={{
              background: 'var(--theme-bg, #f0fdfa)',
              border: '1.5px solid var(--theme-border, #a7f3d0)',
              borderRadius: '12px',
              padding: '0.65rem 0.95rem',
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {(() => {
              const activeSec = NCERT_SOLUTIONS_GUIDE.find(s => s.section === selectedSolutionTab) || NCERT_SOLUTIONS_GUIDE[0];
              return (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--theme-border, #a7f3d0)', paddingBottom: '0.3rem' }}>
                    <span style={{ fontWeight: '900', color: 'var(--theme-heading, #134e4a)', fontSize: '0.88rem' }}>
                      § {activeSec.section} — {activeSec.title}
                    </span>
                    <span style={{ color: 'var(--theme-primary, #0d9488)', fontSize: '0.74rem', fontWeight: '800' }}>
                      {activeSec.pageRef}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1, justifyContent: 'space-around', paddingTop: '0.35rem' }}>
                    {activeSec.items.slice(0, 2).map((item, i) => (
                      <div key={i} style={{ background: '#ffffff', padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid var(--theme-border, #a7f3d0)' }}>
                        <div style={{ fontWeight: '800', color: 'var(--theme-heading, #134e4a)', fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                          {item.q}
                        </div>
                        <div style={{ color: '#15803d', fontSize: '0.78rem', lineHeight: 1.45, fontWeight: '600' }}>
                          ✅ {item.ans}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
