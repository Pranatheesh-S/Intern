import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, AlertTriangle, RefreshCw, Trophy, Award, HelpCircle, GraduationCap, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import AIMentor from './AIMentor';

const QUESTIONS = [
  {
    id: 1,
    question: "Why are gold and copper preferred for making jewelry and decorative items?",
    options: [
      { id: 'A', text: "They are completely transparent and lightweight." },
      { id: 'B', text: "They have lustre (shine) and can be polished to look bright." },
      { id: 'C', text: "They easily absorb water and stay wet." },
      { id: 'D', text: "They break easily into tiny pieces when dropped." }
    ],
    answer: 'B',
    explanation: "Metals like gold, silver, and copper possess a natural shine called lustre. This property, combined with their ability to be molded and polished, makes them excellent for jewelry and ornament making.",
    mentorText: "Think about why jewelry looks bright and shiny under sunlight! Shiny materials reflect light beautifully.",
    mentorSuccess: "Brilliant! The lustre of metals is what makes them sparkle. Gold has been prized for this exact property for thousands of years!"
  },
  {
    id: 2,
    question: "If a material can be easily scratched, cut, or compressed with your hands, it is classified as:",
    options: [
      { id: 'A', text: "A hard material" },
      { id: 'B', text: "A lustrous material" },
      { id: 'C', text: "A soft material" },
      { id: 'D', text: "An insoluble material" }
    ],
    answer: 'C',
    explanation: "Materials that can be easily scratched, compressed, or molded are called soft (like wax, chalk, eraser, and cotton). Materials that are difficult to compress or scratch are called hard (like iron, steel, and stone).",
    mentorText: "Imagine rubbing a piece of chalk against an iron key. Which one scratches the other easily?",
    mentorSuccess: "Exactly! Soft materials change shape or get scratched easily under pressure, whereas hard materials resist scratching."
  },
  {
    id: 3,
    question: "What will happen if you vigorously stir a spoonful of dry sand in a glass tumbler filled with water?",
    options: [
      { id: 'A', text: "The sand will dissolve completely and become invisible." },
      { id: 'B', text: "The sand will float permanently on top of the water surface." },
      { id: 'C', text: "The water will boil and evaporate instantly." },
      { id: 'D', text: "The sand will settle at the bottom because it is insoluble." }
    ],
    answer: 'D',
    explanation: "Sand does not dissolve in water. Materials that do not mix or disappear in water even after stirring are called insoluble. Because sand is heavier than water, it sinks and settles at the bottom.",
    mentorText: "Compare mixing salt in water versus mixing mud or sand in water. Does sand ever disappear?",
    mentorSuccess: "Spot on! Sand is insoluble and heavier than water, so it forms a separate sediment layer at the bottom."
  },
  {
    id: 4,
    question: "Why is the windshield of a car made of glass instead of metal or wood?",
    options: [
      { id: 'A', text: "Wood is much too expensive to build windshield frames." },
      { id: 'B', text: "Glass is transparent, allowing the driver to see through it clearly." },
      { id: 'C', text: "Glass is strong and will never shatter or break." },
      { id: 'D', text: "Metal is permeable and lets rainwater leak inside." }
    ],
    answer: 'B',
    explanation: "Windshields must be made of transparent materials like glass so drivers can see the road ahead clearly. Glass allows light to pass through it completely. Wood and metals are opaque and would block the driver's vision.",
    mentorText: "Think about transparency. What material property lets light pass through so we can see what's on the other side?",
    mentorSuccess: "Perfect! Transparency is vital for driving safety. It lets light pass through completely while keeping the wind and rain out."
  },
  {
    id: 5,
    question: "Why is a waterproof plastic sheet preferred over absorbent cotton cloth for making a raincoat?",
    options: [
      { id: 'A', text: "Cotton cloth absorbs rain water to keep the wearer cool." },
      { id: 'B', text: "Plastic is heavy and keeps the raincoat firmly in place during storms." },
      { id: 'C', text: "Plastic is waterproof (impermeable) and prevents water from passing through." },
      { id: 'D', text: "Cotton reflects sunlight and becomes too bright in the rain." }
    ],
    answer: 'C',
    explanation: "Plastic is impermeable to water, meaning it does not allow water molecules to pass through, keeping us dry. Cotton cloth is porous and absorbent; if used, rainwater would soak through the fabric instantly.",
    mentorText: "Remember our raincoat simulation! What happened when the child wore the cotton canvas coat in the heavy rain?",
    mentorSuccess: "Outstanding! Waterproof materials like plastic or rubber block water from penetrating, making them ideal protective gear during rain."
  }
];

export default function Stage4_Quiz({ onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // 'A', 'B', 'C', 'D'
  const [answersStatus, setAnswersStatus] = useState([]); // Array of boolean (correct/incorrect)
  const [isFinished, setIsFinished] = useState(false);
  const [mentorState, setMentorState] = useState('idle');
  const [mentorText, setMentorText] = useState("Let's test your material knowledge! Read the first question and select your answer.");

  const currentQuestion = QUESTIONS[currentIdx];

  const handleSelectOption = (optionId) => {
    if (selectedOption !== null) return; // Prevent double selection

    const isCorrect = optionId === currentQuestion.answer;
    setSelectedOption(optionId);
    
    // Save answer status
    const updatedStatus = [...answersStatus];
    updatedStatus[currentIdx] = isCorrect;
    setAnswersStatus(updatedStatus);

    if (isCorrect) {
      setMentorState('success');
      setMentorText(currentQuestion.mentorSuccess);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 }
      });
    } else {
      setMentorState('error');
      setMentorText(`Oops! That's not correct. Let's look at the correct explanation.`);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setMentorState('idle');
    
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setMentorText(`Question ${currentIdx + 2}: Read carefully and choose your answer.`);
    } else {
      setIsFinished(true);
      const score = answersStatus.filter(x => x).length;
      if (score === QUESTIONS.length) {
        // Perfect score confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
      setMentorText(`Quiz completed! You scored ${score}/${QUESTIONS.length}. Click 'Complete Activity' to save your findings.`);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswersStatus([]);
    setIsFinished(false);
    setMentorState('idle');
    setMentorText("Let's test your material knowledge! Read the first question and select your answer.");
  };

  const totalCorrect = answersStatus.filter(x => x).length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
      
      {/* Main Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {!isFinished ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-panel"
            style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            {/* Header / Progress indicators */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: '12px',
                  background: 'var(--accent-bg)',
                  color: 'var(--accent-text)',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  Question {currentIdx + 1} of {QUESTIONS.length}
                </span>
              </div>

              {/* Progress circles */}
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {QUESTIONS.map((q, idx) => {
                  let bg = 'rgba(255, 255, 255, 0.05)';
                  let border = '1px solid var(--border)';
                  let content = null;

                  if (idx === currentIdx) {
                    bg = 'var(--accent-bg)';
                    border = '1.5px solid var(--accent)';
                  } else if (answersStatus[idx] === true) {
                    bg = 'rgba(16, 185, 129, 0.2)';
                    border = '1px solid var(--success)';
                    content = <Check size={8} style={{ color: 'var(--success)' }} />;
                  } else if (answersStatus[idx] === false) {
                    bg = 'rgba(239, 68, 68, 0.2)';
                    border = '1px solid var(--danger)';
                    content = <X size={8} style={{ color: 'var(--danger)' }} />;
                  }

                  return (
                    <div
                      key={q.id}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: bg,
                        border: border,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.6rem'
                      }}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question Text */}
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-heading)', lineHeight: '1.5' }}>
              {currentQuestion.question}
            </h3>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrect = opt.id === currentQuestion.answer;
                const isIncorrect = isSelected && !isCorrect;
                const hasAnswered = selectedOption !== null;

                let btnBg = 'var(--surface)';
                let btnBorder = '1px solid var(--border)';
                let btnColor = 'var(--text-primary)';
                
                if (hasAnswered) {
                  if (isCorrect) {
                    btnBg = 'rgba(16, 185, 129, 0.12)';
                    btnBorder = '2px solid var(--success)';
                    btnColor = 'var(--success-text)';
                  } else if (isIncorrect) {
                    btnBg = 'rgba(239, 68, 68, 0.12)';
                    btnBorder = '2px solid var(--danger)';
                    btnColor = 'var(--danger-text)';
                  } else {
                    // Non-selected options when answered
                    btnBg = 'var(--surface)';
                    btnBorder = '1px solid var(--border)';
                    btnColor = 'var(--text-muted)';
                  }
                }

                return (
                  <motion.button
                    key={opt.id}
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(opt.id)}
                    whileHover={!hasAnswered ? { scale: 1.01 } : {}}
                    style={{
                      background: btnBg,
                      border: btnBorder,
                      borderRadius: '12px',
                      padding: '0.85rem 1.25rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      color: btnColor,
                      cursor: hasAnswered ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontWeight: isSelected ? '600' : 'normal',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isSelected 
                        ? (isCorrect ? 'var(--success)' : 'var(--danger)') 
                        : (hasAnswered && isCorrect ? 'var(--success)' : 'rgba(255,255,255,0.06)'),
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected || (hasAnswered && isCorrect) ? '#fff' : 'var(--text-muted)',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {hasAnswered && isCorrect ? <Check size={12} /> : (hasAnswered && isIncorrect ? <X size={12} /> : opt.id)}
                    </div>
                    <span style={{ flex: 1 }}>{opt.text}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation / Next Trigger */}
            <AnimatePresence>
              {selectedOption !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'var(--canvas-bg)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    borderLeft: selectedOption === currentQuestion.answer 
                      ? '4px solid var(--success)' 
                      : '4px solid var(--danger)',
                    marginTop: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold', color: selectedOption === currentQuestion.answer ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {selectedOption === currentQuestion.answer ? (
                        <>🎉 Correct Answer!</>
                      ) : (
                        <>💡 Review Concept</>
                      )}
                    </h5>
                    <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {currentQuestion.explanation}
                    </p>
                  </div>

                  <button
                    onClick={handleNext}
                    className="primary"
                    style={{
                      alignSelf: 'flex-end',
                      padding: '0.5rem 1.25rem',
                      fontSize: '0.8rem',
                      gap: '0.35rem',
                      marginTop: '0.25rem'
                    }}
                  >
                    {currentIdx < QUESTIONS.length - 1 ? 'Next Question' : 'View Results'} <ArrowRight size={12} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        ) : (
          /* Final Results Dashboard */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel"
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem'
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: totalCorrect >= 3 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: totalCorrect >= 3 ? 'var(--success)' : 'var(--warning)',
              border: totalCorrect >= 3 ? '3px solid var(--success-border)' : '3px solid var(--warning-border)'
            }}>
              {totalCorrect === QUESTIONS.length ? <Trophy size={40} /> : <Award size={40} />}
            </div>

            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-heading)' }}>
                {totalCorrect === QUESTIONS.length ? "Perfect Score! Master Detective 🕵️‍♂️✨" : 
                 totalCorrect >= 3 ? "Great Job, Detective! 🔍" : "Good Effort, Junior Detective! 📚"}
              </h3>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                You scored <strong>{totalCorrect}</strong> out of <strong>{QUESTIONS.length}</strong> questions correctly.
              </p>
            </div>

            {/* Visual Circular Score Ring */}
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0.5rem 0' }}>
              <svg width="120" height="120" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
                {/* Score Fill Ring */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={totalCorrect >= 3 ? "var(--success)" : "var(--warning)"}
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * totalCorrect) / QUESTIONS.length }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>
                  {Math.round((totalCorrect / QUESTIONS.length) * 100)}%
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Score</span>
              </div>
            </div>

            <div style={{
              background: 'var(--surface)',
              borderRadius: '12px',
              padding: '1.25rem',
              width: '100%',
              maxWidth: '450px',
              textAlign: 'left',
              fontSize: '0.85rem',
              border: '1px solid var(--border)'
            }}>
              <h5 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <GraduationCap size={16} /> Concept Checklist Summary:
              </h5>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                <li>Lustre determines light reflectivity (shine) for jewelry selection. ✓</li>
                <li>Hardness determines resistance to scratching (keys vs chalk). ✓</li>
                <li>Solubility classifies how materials dissolve in water. ✓</li>
                <li>Transparency allows windshields to transmit light safely. ✓</li>
                <li>Permeability controls raincoat water protection. ✓</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '380px', marginTop: '0.5rem' }}>
              <button
                onClick={handleReset}
                className="outline"
                style={{ flex: 1, fontSize: '0.85rem', gap: '0.35rem' }}
              >
                <RefreshCw size={14} /> Retake Quiz
              </button>
              
              <button
                onClick={onComplete}
                className="success"
                style={{ flex: 1, fontSize: '0.85rem', gap: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Trophy size={14} /> Finish Lab & Save
              </button>
            </div>
          </motion.div>
        )}

      </div>

      {/* Sidebar Area with AIMentor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Progress Tracker Card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Award size={16} style={{ color: 'var(--accent)' }} />
            Quiz Scoreboard
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span>Total Questions:</span>
              <span style={{ fontWeight: 'bold' }}>{QUESTIONS.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span>Answered:</span>
              <span style={{ fontWeight: 'bold' }}>{answersStatus.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span>Correct answers:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>{totalCorrect}</span>
            </div>
            
            {/* Visual progress bar */}
            <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden', marginTop: '0.5rem' }}>
              <div style={{
                height: '100%',
                width: `${(answersStatus.length / QUESTIONS.length) * 100}%`,
                background: 'var(--accent)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>

        <AIMentor
          state={mentorState}
          text={mentorText}
        />

      </div>

    </div>
  );
}
