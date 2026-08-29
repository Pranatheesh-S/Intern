import React, { useState } from 'react';
import { BookOpen, ChevronRight, Award, Volume2, VolumeX, ArrowRight, HelpCircle } from 'lucide-react';
import { useTheme } from '../../../../ThemeContext.jsx';

export default function GroupingBasicsBookSpread({ onBackToDashboard }) {
  const { theme } = useTheme();
  
  // Tabs and general phases
  const [activeTab, setActiveTab] = useState('criteria'); // criteria | quiz
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Quiz state
  const [answers, setAnswers] = useState({ q1: null, q2: null });
  const [checked, setChecked] = useState({ q1: false, q2: false });
  const [correct, setCorrect] = useState({ q1: false, q2: false });

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `
        Chapter 2, Section 2.2: How to Group Plants and Animals?
        Grouping, also known as classification, is the scientific method of sorting living things into groups based on their similarities and differences.
        This makes it much easier to understand, compare, and study the vast diversity of life.
        Scientists use key criteria like flowers, stems, eating habits, and the place they live.
      `;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const q1Correct = answers.q1 === 1;
  const q2Correct = answers.q2 === 0;
  const quizDone = checked.q1 && checked.q2 && correct.q1 && correct.q2;

  return (
    <div className="book-container">
      <div className="book-spread">
        
        {/* ============ LEFT PAGE ============ */}
        <div className="book-page-left">
          <div className="textbook-eyebrow">Lesson 2.2 · Class 6 Science</div>
          <h1 className="textbook-title" style={{ fontFamily: 'var(--serif-font)' }}>
            How to Group<br />Plants &amp; Animals?
          </h1>

          {/* Interactive Classification SVG Diagram */}
          <div style={{
            background: '#ffffff',
            padding: '1rem',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            border: '1px solid rgba(14,53,86,0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '1.25rem 0',
            flex: 1,
            minHeight: '260px'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--mut)', textTransform: 'uppercase', marginBottom: '10px' }}>
              🌳 Living World Taxonomy Tree
            </span>
            <svg viewBox="0 0 320 200" style={{ width: '100%', height: '100%', maxHeight: '200px' }}>
              {/* Lines */}
              <line x1="160" y1="40" x2="80" y2="100" stroke="var(--navy)" strokeWidth="2.5" />
              <line x1="160" y1="40" x2="240" y2="100" stroke="var(--navy)" strokeWidth="2.5" />
              
              <line x1="80" y1="100" x2="40" y2="155" stroke="var(--blue)" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="80" y1="100" x2="120" y2="155" stroke="var(--blue)" strokeWidth="1.5" strokeDasharray="3 3" />
              
              <line x1="240" y1="100" x2="200" y2="155" stroke="var(--violet)" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="240" y1="100" x2="280" y2="155" stroke="var(--violet)" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Main Root Node */}
              <rect x="100" y="15" width="120" height="30" rx="15" fill="var(--navy)" />
              <text x="160" y="34" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">Living World</text>

              {/* Plant Node */}
              <rect x="35" y="85" width="90" height="26" rx="6" fill="#ecfdf5" stroke="var(--green)" strokeWidth="2" />
              <text x="80" y="102" fill="var(--green)" fontSize="11" fontWeight="bold" textAnchor="middle">🌱 Plants</text>

              {/* Animal Node */}
              <rect x="195" y="85" width="90" height="26" rx="6" fill="#fef2f2" stroke="var(--orange)" strokeWidth="2" />
              <text x="240" y="102" fill="var(--orange)" fontSize="11" fontWeight="bold" textAnchor="middle">🐯 Animals</text>

              {/* Leaf Nodes */}
              <text x="40" y="170" fill="var(--mut)" fontSize="9" textAnchor="middle">Herbs / Shrubs</text>
              <text x="120" y="170" fill="var(--mut)" fontSize="9" textAnchor="middle">Trees</text>
              <text x="200" y="170" fill="var(--mut)" fontSize="9" textAnchor="middle">Terrestrial</text>
              <text x="280" y="170" fill="var(--mut)" fontSize="9" textAnchor="middle">Aquatic</text>
            </svg>
          </div>

          <blockquote className="textbook-quote" style={{ marginTop: 'auto' }}>
            <p>"Science is organized knowledge. Wisdom is organized life."</p>
            <span className="by">— Immanuel Kant</span>
          </blockquote>
        </div>

        {/* ============ RIGHT PAGE ============ */}
        <div className="book-page-right">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--cardline)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '4px', background: '#f8fafc', border: '1px solid var(--cardline)', borderRadius: '8px', padding: '3px' }}>
              <button 
                onClick={() => setActiveTab('criteria')} 
                style={{ fontSize: '11.5px', padding: '0.35rem 0.75rem', borderRadius: '6px', background: activeTab === 'criteria' ? '#fff' : 'transparent', border: activeTab === 'criteria' ? '1px solid var(--cardline)' : 'none', fontWeight: activeTab === 'criteria' ? 'bold' : 'normal' }}
              >
                1. Criteria
              </button>
              <button 
                onClick={() => setActiveTab('quiz')} 
                style={{ fontSize: '11.5px', padding: '0.35rem 0.75rem', borderRadius: '6px', background: activeTab === 'quiz' ? '#fff' : 'transparent', border: activeTab === 'quiz' ? '1px solid var(--cardline)' : 'none', fontWeight: activeTab === 'quiz' ? 'bold' : 'normal' }}
              >
                2. Checkpoint {quizDone && '✓'}
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="hide-scrollbar">
            
            {/* TAB 1: CRITERIA */}
            {activeTab === 'criteria' && (
              <>
                <div className="textbook-hero">
                  <h3>The Purpose of Classification</h3>
                  <p>Grouping (classification) is the method of sorting things into groups based on their similarities and differences. It makes it easier to understand, compare, and study the vast diversity of living beings systematically.</p>
                </div>

                <div style={{ fontSize: '12.5px', fontWeight: 'bold', color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  📊 Keys for Scientific Grouping
                </div>

                <div className="textbook-grid">
                  <div className="textbook-fact">
                    <div className="lab" style={{ color: 'var(--blue)' }}>🌸 Flowers</div>
                    <div className="v">Flowering/Non-flowering</div>
                    <div className="note">Classifying plants based on the presence of seeds/flowers.</div>
                  </div>

                  <div className="textbook-fact">
                    <div className="lab" style={{ color: 'var(--violet)' }}>🌿 Stems</div>
                    <div className="v">Soft vs Woody stems</div>
                    <div className="note">Separating herbs (soft green stems) from shrubs and trees.</div>
                  </div>

                  <div className="textbook-fact">
                    <div className="lab" style={{ color: 'var(--green)' }}>🥗 Eating Habits</div>
                    <div className="v">What they eat</div>
                    <div className="note">Classifying animals based on herbivore, carnivore, or omnivore diets.</div>
                  </div>

                  <div className="textbook-fact">
                    <div className="lab" style={{ color: 'var(--orange)' }}>📍 Habitat</div>
                    <div className="v">Place they live</div>
                    <div className="note">Grouping by environment: aquatic, terrestrial, or aerial.</div>
                  </div>
                </div>

                <div className="textbook-connect">
                  <h4>◎ Why we group</h4>
                  <div className="lk"><span className="dot"></span><span>Helps in <b>systematic cataloging</b> of million of species.</span></div>
                  <div className="lk"><span className="dot"></span><span>Reveals <b>evolutionary relationships</b> between different groups.</span></div>
                </div>
              </>
            )}

            {/* TAB 2: CONCEPT CHECKPOINT */}
            {activeTab === 'quiz' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Q1 */}
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid var(--cardline)' }}>
                  <p style={{ margin: '0 0 0.6rem 0', fontSize: '13px', fontWeight: 'bold', color: 'var(--ink)' }}>
                    Q1. Why do we group plants and animals in science?
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {[
                      'To prevent them from moving around.',
                      'To make it easier to study their similarities and differences.',
                      'To calculate the exact number of leaves on each tree.'
                    ].map((opt, i) => {
                      let bg = '#fff';
                      let border = '1px solid var(--cardline)';
                      if (checked.q1) {
                        if (i === 1) { bg = '#ecfdf5'; border = '1.5px solid #10b981'; }
                        else if (i === answers.q1) { bg = '#fef2f2'; border = '1.5px solid #ef4444'; }
                      } else if (answers.q1 === i) {
                        bg = '#f4f8ff'; border = '1.5px solid var(--accent)';
                      }
                      return (
                        <button key={i} disabled={checked.q1} onClick={() => setAnswers(prev => ({ ...prev, q1: i }))}
                          style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '6px', border, background: bg, fontSize: '12px', cursor: checked.q1 ? 'default' : 'pointer' }}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {!checked.q1 && answers.q1 !== null && (
                    <button onClick={() => setChecked(prev => ({ ...prev, q1: true })) || setCorrect(prev => ({ ...prev, q1: q1Correct }))}
                      style={{ marginTop: '0.5rem', padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '11px', background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                      Verify
                    </button>
                  )}
                  {checked.q1 && (
                    <div style={{ fontSize: '11.5px', marginTop: '0.4rem', fontWeight: 'bold', color: correct.q1 ? '#10b981' : '#ef4444' }}>
                      {correct.q1 ? '✅ Correct!' : '❌ Incorrect, try again by resetting.'}
                    </div>
                  )}
                </div>

                {/* Q2 */}
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid var(--cardline)' }}>
                  <p style={{ margin: '0 0 0.6rem 0', fontSize: '13px', fontWeight: 'bold', color: 'var(--ink)' }}>
                    Q2. Which of these is a valid scientific basis for grouping plants?
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {[
                      'The height and nature of its stem.',
                      'The names given to them by gardeners.',
                      'The total amount of shade they cast at noon.'
                    ].map((opt, i) => {
                      let bg = '#fff';
                      let border = '1px solid var(--cardline)';
                      if (checked.q2) {
                        if (i === 0) { bg = '#ecfdf5'; border = '1.5px solid #10b981'; }
                        else if (i === answers.q2) { bg = '#fef2f2'; border = '1.5px solid #ef4444'; }
                      } else if (answers.q2 === i) {
                        bg = '#f4f8ff'; border = '1.5px solid var(--accent)';
                      }
                      return (
                        <button key={i} disabled={checked.q2} onClick={() => setAnswers(prev => ({ ...prev, q2: i }))}
                          style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '6px', border, background: bg, fontSize: '12px', cursor: checked.q2 ? 'default' : 'pointer' }}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {!checked.q2 && answers.q2 !== null && (
                    <button onClick={() => setChecked(prev => ({ ...prev, q2: true })) || setCorrect(prev => ({ ...prev, q2: q2Correct }))}
                      style={{ marginTop: '0.5rem', padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '11px', background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                      Verify
                    </button>
                  )}
                  {checked.q2 && (
                    <div style={{ fontSize: '11.5px', marginTop: '0.4rem', fontWeight: 'bold', color: correct.q2 ? '#10b981' : '#ef4444' }}>
                      {correct.q2 ? '✅ Correct!' : '❌ Incorrect, try again.'}
                    </div>
                  )}
                </div>

                {(!correct.q1 && checked.q1 || !correct.q2 && checked.q2) && (
                  <button onClick={() => { setAnswers({ q1: null, q2: null }); setChecked({ q1: false, q2: false }); setCorrect({ q1: false, q2: false }); }}
                    style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '0.4rem', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                    Reset Checkpoint
                  </button>
                )}
              </div>
            )}

          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--cardline)', paddingTop: '0.75rem' }}>
            <div style={{ color: 'var(--mut)', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              Page 1 of 1
            </div>
            
            <button
              onClick={() => { handleStopSpeech(); onBackToDashboard(quizDone); }}
              className="primary"
              style={{
                fontFamily: 'var(--geo-font)',
                fontWeight: '700',
                padding: '0.65rem 1.5rem',
                borderRadius: '999px',
                fontSize: '13px',
                display: 'inline-flex',
                gap: '6px',
                alignItems: 'center',
                boxShadow: '0 8px 20px rgba(14,53,86,0.2)'
              }}
            >
              Finish Lesson <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
