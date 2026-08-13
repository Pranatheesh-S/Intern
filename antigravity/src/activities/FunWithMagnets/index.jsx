import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './FunWithMagnets.css';
import MazeGame from './MazeGame';
import CarGame from './CarGame';
import { useTheme } from '../../ThemeContext.jsx';

const STEPS = ["Predict", "Magnetic Maze", "Runaway Car", "Magnet Care", "Easy", "Medium", "Hard"];

export default function FunWithMagnets({ onBackToDashboard, onComplete }) {
  const { theme } = useTheme();
  
  const [step, setStep] = useState(0);
  const [xp, setXp] = useState(0);
  const [visited, setVisited] = useState(new Set([0]));
  const [qEasy, setQEasy] = useState(false);
  const [qMed, setQMed] = useState(false);
  const [qHard, setQHard] = useState(false);
  const [score, setScore] = useState(0);
  const [ext, setExt] = useState({});
  const [toast, setToast] = useState({ text: '', show: false });
  const [showMazeModal, setShowMazeModal] = useState(false);

  // Handle XP
  const addXP = (n, label) => {
    setXp(prev => prev + n);
  };

  const go = (i) => {
    setStep(i);
    setVisited(prev => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleComplete = () => {
    if (onComplete) {
      setTimeout(() => onComplete(), 1000);
    }
  };

  const renderNav = (canProceed, label = "Continue") => (
    <div className="btnrow">
      {step > 0 && <button className="btn ghost" onClick={() => go(step - 1)}>Back</button>}
      {step < STEPS.length - 1 && (
        <button className="btn" disabled={!canProceed} onClick={() => go(step + 1)}>
          {label}
        </button>
      )}
    </div>
  );

  const [predictAns, setPredictAns] = useState(null);
  const [carPushing, setCarPushing] = useState(false);
  
  const [q1Ans, setQ1Ans] = useState(null);
  const [q2Ans, setQ2Ans] = useState(null);
  const [q3Ans, setQ3Ans] = useState(null);

  const getChoiceClass = (ansState, ok) => {
    if (ansState === null) return "choice";
    if (ansState.correct === ok) return "choice " + (ok ? "right" : "wrong");
    if (!ansState.correct && ok) return "choice right lock";
    return "choice lock";
  };

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="card">
            <div className="kicker">PAGES 71-73 · SECTION 4.5 · FUN WITH MAGNETS</div>
            <h1 style={{ fontSize: "2rem" }}>Magnets can move things without touching them.</h1>
            <p className="lead" style={{ fontSize: "1.5rem", lineHeight: "1.6" }}>Now that you know magnetism passes through non-magnetic materials, you can build toys and tricks. Predict: in a "magnetic maze," you move a magnet <b>under</b> a cardboard tray to guide a steel ball on top. What makes the ball move?</p>
            <div className="choices">
              {[
                { label: "You tilt the tray", ok: false, xp: 0, l: '' },
                { label: "The magnet's pull reaches through the cardboard and drags the steel ball", ok: true, xp: 10, l: 'exactly' },
                { label: "You blow on the ball", ok: false, xp: 0, l: '' },
                { label: "The ball rolls on its own", ok: false, xp: 0, l: '' }
              ].map((c, idx) => (
                <button 
                  key={idx} 
                  className={getChoiceClass(predictAns, c.ok)} 
                  onClick={() => {
                    if (predictAns) return;
                    setPredictAns({ correct: c.ok });
                    if (c.ok) addXP(c.xp, c.l);
                  }}
                >
                  <span className="key">{['A','B','C','D'][idx]}</span>{c.label}
                </button>
              ))}
            </div>
            {predictAns && (
              <div className="reveal show">
                <b>Magnetism through the cardboard.</b> The steel ball is a magnetic material, and the magnet's pull passes through the non-magnetic tray - so wherever you move the magnet, the ball follows. Let's play it.
              </div>
            )}
            {renderNav(predictAns !== null, "Play the maze")}
          </div>
        );
      case 1:
        return (
          <div className="card">
            <div className="kicker">TRICK 1 · THE MAGNETIC MAZE</div>
            <h1>Guide the ball to the exit.</h1>
            <p className="lead"><b>Drag the magnet</b> (under the tray) to pull the steel ball 🔵 through the cardboard to the green ✅ exit, without crossing the pink walls.</p>
            <div className="sim">
              <MazeGame isSolved={ext.maze} onSolve={() => {
                if (!ext.maze) {
                  setExt(prev => ({...prev, maze: true}));
                  addXP(16, "maze solved!");
                  setTimeout(() => {
                    setShowMazeModal(true);
                  }, 500);
                }
              }} />
              <div className="hint" style={{ marginTop: '10px', fontSize: '13px', color: 'var(--mut-local)', textAlign: 'center' }}>
                {ext.maze ? "✓ Solved! The pull reached through the cardboard." : "👆 Drag the magnet to move the steel ball to the exit."}
              </div>
            </div>
            {ext.maze && (
              <div className="reveal show">
                <b>Solved - through the cardboard!</b> You never touched the ball; the magnet's pull reached through the tray. This is the same principle as the "magnetic garland" dancing on a board and the tricks in the next steps.
              </div>
            )}
            {renderNav(ext.maze)}
          </div>
        );
      case 2:
        return (
          <div className="card">
            <div className="kicker">TRICK 2 · RUNAWAY CARS</div>
            <h1>Make a toy car flee without touching it.</h1>
            <p className="lead">Fix a bar magnet on a toy car, and hold another magnet in your hand. Point <b>like poles</b> at each other (N toward N). Tap "Push" and watch.</p>
            <div className="sim">
              <CarGame isPushing={carPushing} onComplete={() => {
                if (!ext.cars) {
                  setExt(prev => ({...prev, cars: true}));
                  addXP(14, "cars!");
                }
              }} />
              <div className="btnrow" style={{ marginTop: '12px', justifyContent: 'center' }}>
                <button className="btn" disabled={carPushing} onClick={() => setCarPushing(true)}>
                  Bring N pole toward car's N pole
                </button>
                <span className="note" style={{ marginLeft: '10px' }}>
                  {ext.cars && "The car fled - like poles repel!"}
                </span>
              </div>
            </div>
            {ext.cars && (
              <div className="reveal show">
                <b>The car races away!</b> Like poles repel, so the hand magnet pushes the car's magnet - and the whole car - forward, with no contact. Point unlike poles instead and the car would chase your hand. Same pole rule, turned into a toy.
              </div>
            )}
            {renderNav(ext.cars)}
          </div>
        );
      case 3:
        return (
          <div className="card">
            <div className="kicker">PAGE 73 · KEEPING MAGNETS SAFE</div>
            <h1>Look after your magnets.</h1>
            <p className="lead">Magnets lose their power if mistreated. Read the care rules, then answer.</p>
            <div className="sim">
              <div style={{ display: 'grid', gap: '8px' }}>
                <div style={{ background: 'var(--panel2-local)', border: '1px solid var(--line-local)', borderRadius: '9px', padding: '10px 12px', fontSize: '13px' }}>
                  🚫 Don't <b>drop, hammer or heat</b> magnets - it scrambles their magnetism.
                </div>
                <div style={{ background: 'var(--panel2-local)', border: '1px solid var(--line-local)', borderRadius: '9px', padding: '10px 12px', fontSize: '13px' }}>
                  📱 Keep them away from <b>phones, cards, TVs and other devices</b>.
                </div>
                <div style={{ background: 'var(--panel2-local)', border: '1px solid var(--line-local)', borderRadius: '9px', padding: '10px 12px', fontSize: '13px' }}>
                  🧲 <b>Store bar magnets in pairs</b>, unlike poles together, with a wooden spacer and iron "keepers" across the ends.
                </div>
              </div>
            </div>
            <h2>Why store bar magnets in pairs with unlike poles together?</h2>
            <div className="choices">
              {[
                { label: "To make them heavier", ok: false, xp: 0, l: '' },
                { label: "To help them keep their magnetism for longer", ok: true, xp: 12, l: 'good care' },
                { label: "To change their colour", ok: false, xp: 0, l: '' }
              ].map((c, idx) => (
                <button 
                  key={idx} 
                  className={getChoiceClass(q1Ans, c.ok)} 
                  onClick={() => {
                    if (q1Ans) return;
                    setQ1Ans({ correct: c.ok });
                    if (c.ok) addXP(c.xp, c.l);
                  }}
                >
                  <span className="key">{['A','B','C'][idx]}</span>{c.label}
                </button>
              ))}
            </div>
            {q1Ans && (
              <div className="reveal show">
                <b>To preserve their magnetism.</b> Proper storage - pairs with unlike poles together and keepers across the ends - stops magnets from weakening over time. Along with avoiding drops, heat and hammering, that keeps them strong for years.
              </div>
            )}
            {renderNav(q1Ans !== null, "To the questions")}
          </div>
        );
      case 4:
        return (
          <div className="card">
            <span className="qbadge easy">● EASY</span>
            <div className="kicker">CHECK YOUR UNDERSTANDING</div>
            <h1>Question 1</h1>
            <p className="lead">In the magnetic maze, the steel ball moves because:</p>
            <div className="choices">
              {[
                { label: "The magnet's pull passes through the tray and drags the ball", ok: true },
                { label: "The tray is tilted", ok: false },
                { label: "The ball is alive", ok: false },
                { label: "Air blows it along", ok: false }
              ].map((c, idx) => (
                <button 
                  key={idx} 
                  className={getChoiceClass(q2Ans, c.ok)} 
                  onClick={() => {
                    if (q2Ans) return;
                    setQ2Ans({ correct: c.ok });
                    if (c.ok) {
                      setScore(prev => prev + 1);
                      addXP(10, 'correct');
                      setQEasy(true);
                    }
                  }}
                >
                  <span className="key">{['A','B','C','D'][idx]}</span>{c.label}
                </button>
              ))}
            </div>
            {q2Ans && (
              <div className="reveal show">
                <b>Magnetism through the tray.</b> The pull reaches through the non-magnetic cardboard and moves the steel ball - no touching needed. (Recall level.)
              </div>
            )}
            {renderNav(q2Ans !== null)}
          </div>
        );
      case 5:
        return (
          <div className="card">
            <span className="qbadge med">●● MEDIUM</span>
            <div className="kicker">CHECK YOUR UNDERSTANDING</div>
            <h1>Question 2</h1>
            <p className="lead">A toy car has a bar magnet fixed on it. You bring the <b>North</b> pole of a hand magnet toward the car's <b>North</b> pole. The car:</p>
            <div className="choices">
              {[
                { label: "Comes toward your hand", ok: false },
                { label: "Moves away from your hand", ok: true },
                { label: "Stays perfectly still", ok: false },
                { label: "Flips upside down", ok: false }
              ].map((c, idx) => (
                <button 
                  key={idx} 
                  className={getChoiceClass(q3Ans, c.ok)} 
                  onClick={() => {
                    if (q3Ans) return;
                    setQ3Ans({ correct: c.ok });
                    if (c.ok) {
                      setScore(prev => prev + 1);
                      addXP(15, 'correct');
                      setQMed(true);
                    }
                  }}
                >
                  <span className="key">{['A','B','C','D'][idx]}</span>{c.label}
                </button>
              ))}
            </div>
            {q3Ans && (
              <div className="reveal show">
                <b>It moves away.</b> Like poles (N and N) repel, so the hand magnet pushes the car's magnet - and the car - away, without touching it. Turn the hand magnet around (S toward N) and the car would chase you instead. (Apply the pole rule to a toy.)
              </div>
            )}
            {renderNav(q3Ans !== null)}
          </div>
        );
      case 6:
        return (
          <div className="card">
            <span className="qbadge hard">●●● HARD</span>
            <div className="kicker">THINK LIKE A SCIENTIST</div>
            <h1>Question 3</h1>
            <p className="lead">Atharv's favourite bar magnet used to lift 10 steel pins. After he left it lying loose in a hot toolbox and it was knocked about for months, it now lifts only 2. Using this chapter, which explanation AND fix are both correct?</p>
            <div className="choices">
              {[
                { label: "The pins got heavier; buy heavier pins", ok: false },
                { label: "Heat and knocking scrambled its magnetism; in future, store magnets in pairs with unlike poles together and avoid heat and drops", ok: true },
                { label: "Magnets always fade in exactly six months; nothing can be done", ok: false },
                { label: "The toolbox absorbed the pins; empty the toolbox", ok: false }
              ].map((c, idx) => (
                <button 
                  key={idx} 
                  className={getChoiceClass(qHard, c.ok)} 
                  onClick={() => {
                    if (qHard) return;
                    setQHard({ correct: c.ok });
                    if (c.ok) {
                      setScore(prev => prev + 1);
                      addXP(20, 'correct');
                    }
                  }}
                >
                  <span className="key">{['A','B','C','D'][idx]}</span>{c.label}
                </button>
              ))}
            </div>
            {qHard && (
              <>
                <div className="reveal show">
                  <b>Mistreatment weakened it - and careful storage prevents it.</b> Dropping, knocking and heat disturb the aligned tiny magnets inside, so the magnet lifts fewer pins. The chapter's care rules are the fix: store magnets in pairs (unlike poles together, with keepers) and keep them away from heat, hammering and hard knocks. (Apply cause + remedy together.)
                </div>
                {qHard.correct && (
                  <>
                    <div className="hr"></div>
                    <div>
                      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div><div className="big">{score + (qHard.correct ? 1 : 0)}/3</div><div className="meta">QUESTIONS CORRECT</div></div>
                        <div className="badge">🎉 MAGNET PLAYMAKER · Fun with Magnets complete</div>
                      </div>
                      <div className="sumgrid">
                        <div className="sum"><b>Move without touching</b><span>Magnetism reaches through non-magnetic materials to pull steel.</span></div>
                        <div className="sum"><b>The maze & garland</b><span>A magnet under a tray guides a steel ball or dances a garland.</span></div>
                        <div className="sum"><b>Like poles repel</b><span>N-toward-N pushes a magnet-car away - a runaway toy.</span></div>
                        <div className="sum"><b>Care for magnets</b><span>Avoid drops, heat, devices; store in pairs with keepers.</span></div>
                      </div>
                      <p className="note">You've now explored every activity in Chapter 4. Reshma has her story - and you have the science behind it.</p>
                      <div className="btnrow">
                        <button className="btn" onClick={() => { if(onComplete) onComplete(); else onBackToDashboard(); }}>Finish Activity</button>
                        <button className="btn ghost" onClick={() => window.location.reload()}>Play again</button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            {renderNav(false)}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fun-with-magnets" data-theme={theme} style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-local)' }}>
      <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--panel-local)', borderBottom: '1px solid var(--line-local)', zIndex: 100, position: 'sticky', top: 0 }}>
        <button onClick={onBackToDashboard} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--ink-local)', border: '1px solid var(--line-local)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h2 style={{ margin: 0, color: 'var(--ink-local)', fontSize: '1.1rem' }}>Fun with Magnets</h2>
      </div>
      
      <div style={{ flex: 1 }}>
        <div>
          <div className="wrap">
            <header style={{ display: 'none' }}><div className="logo">Fx</div>
              <div className="meta"><b>Fun with Magnets + Magnet Care</b>FuturaX Lab · Science · Grade 6 · Chapter 4 (pages 71-73)</div>
              <div className="spacer"></div>
              <div className="xp"><span className="dot"></span><span>{xp}</span> XP</div>
            </header>
            

            
            <main>
              {renderContent()}
              <AnimatePresence>
                {showMazeModal && (
                  <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      style={{ background: 'var(--panel-local)', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxWidth: '400px', textAlign: 'center', border: '1px solid var(--line-local)' }}
                    >
                      <h3 style={{ marginTop: 0, color: 'var(--ink-local)', fontSize: '1.5rem', marginBottom: '1rem' }}>🎉 Great Job!</h3>
                      <p style={{ color: 'var(--mut-local)', marginBottom: '2rem', lineHeight: 1.5, fontSize: '1.1rem' }}>
                        You successfully navigated the magnetic maze! Ready to move to the next trick?
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button 
                          className="btn ghost" 
                          onClick={() => setShowMazeModal(false)}
                          style={{ flex: 1 }}
                        >
                          Stay Here
                        </button>
                        <button 
                          className="btn" 
                          onClick={() => {
                            setShowMazeModal(false);
                            go(2);
                          }}
                          style={{ flex: 1 }}
                        >
                          Next Trick
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </main>
          </div>

        </div>
      </div>
    </div>
  );
}
