import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Check, 
  X, 
  RotateCcw, 
  Award,
  ArrowRight,
  BookOpen
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    title: "Mall Entrance",
    question: "A curved mirror is fixed near the entrance of a shopping mall. Why is this mirror useful?",
    options: [
      { key: 'A', text: "It makes objects brighter" },
      { key: 'B', text: "It allows a larger area to be seen" },
      { key: 'C', text: "It makes people taller" },
      { key: 'D', text: "It shows only nearby objects" }
    ],
    correct: 'B',
    explanation: "Convex mirrors provide a wide field of view and help monitor large areas."
  },
  {
    id: 2,
    title: "Fun House",
    question: "A student stands near a curved mirror and sees her face enlarged. When she moves away, the image becomes upside down. What does this show?",
    options: [
      { key: 'A', text: "Mirror always enlarges images" },
      { key: 'B', text: "Image changes with distance" },
      { key: 'C', text: "Mirror behaves like a plane mirror" },
      { key: 'D', text: "Mirror only forms upright images" }
    ],
    correct: 'B',
    explanation: "Concave mirrors can form different images depending on object distance."
  },
  {
    id: 3,
    title: "Cosmetic Shop",
    question: "Why do people use certain curved mirrors while applying makeup?",
    options: [
      { key: 'A', text: "To see fine details clearly" },
      { key: 'B', text: "To see many people at once" },
      { key: 'C', text: "To reduce brightness" },
      { key: 'D', text: "To make objects look farther away" }
    ],
    correct: 'A',
    explanation: "Concave mirrors can form enlarged images of nearby objects."
  },
  {
    id: 4,
    title: "School Corridor",
    question: "Why is a curved mirror fixed near a sharp turn?",
    options: [
      { key: 'A', text: "Decoration" },
      { key: 'B', text: "To see around corners" },
      { key: 'C', text: "To shorten images" },
      { key: 'D', text: "To reflect sunlight" }
    ],
    correct: 'B',
    explanation: "Convex mirrors help prevent accidents by showing a wider area."
  }
];

export default function QuizPanel() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedKey, setSelectedKey] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = QUESTIONS[currentIdx];

  const handleOptionSelect = (key) => {
    if (answered) return;
    setSelectedKey(key);
  };

  const handleAnswerSubmit = () => {
    if (selectedKey === null || answered) return;
    
    const isCorrect = selectedKey === currentQuestion.correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setAnswered(true);
  };

  const handleNext = () => {
    setSelectedKey(null);
    setAnswered(false);
    
    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedKey(null);
    setAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '650px', margin: '0 auto', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: '#6366f1' }} size={20} />
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Knowledge Check</h3>
        </div>
        {!quizFinished && (
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(30, 41, 59, 0.6)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
            Question {currentIdx + 1} of {QUESTIONS.length}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
          >
            <h4 style={{ fontSize: '1rem', color: '#f8fafc', lineHeight: '1.5', marginBottom: '0.25rem' }}>
              <span style={{ color: '#818cf8', fontWeight: 'bold' }}>{currentQuestion.title}: </span> 
              {currentQuestion.question}
            </h4>
            <div style={{ marginBottom: '1.25rem' }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedKey === opt.key;
                const isCorrectOption = opt.key === currentQuestion.correct;
                
                let buttonStyle = {
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  padding: '1rem',
                  fontSize: '0.875rem'
                };

                if (answered) {
                  if (isCorrectOption) {
                    buttonStyle.background = 'rgba(16, 185, 129, 0.1)';
                    buttonStyle.borderColor = '#10b981';
                    buttonStyle.color = '#34d399';
                  } else if (isSelected) {
                    buttonStyle.background = 'rgba(239, 68, 68, 0.1)';
                    buttonStyle.borderColor = '#ef4444';
                    buttonStyle.color = '#f87171';
                  } else {
                    buttonStyle.opacity = 0.5;
                  }
                } else if (isSelected) {
                  buttonStyle.borderColor = '#6366f1';
                  buttonStyle.background = 'rgba(99, 102, 241, 0.1)';
                }

                return (
                  <button
                    key={opt.key}
                    onClick={() => handleOptionSelect(opt.key)}
                    disabled={answered}
                    className="outline"
                    style={buttonStyle}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                      <span style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '6px', 
                        background: isSelected ? '#6366f1' : 'rgba(255,255,255,0.04)',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        flexShrink: 0
                      }}>
                        {answered && isCorrectOption ? <Check size={14} /> : 
                         answered && isSelected ? <X size={14} /> : opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
              <AnimatePresence>
                {answered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      background: 'rgba(30, 41, 59, 0.4)',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      marginBottom: '1rem',
                      borderLeft: `4px solid ${selectedKey === currentQuestion.correct ? '#10b981' : '#ef4444'}`
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: selectedKey === currentQuestion.correct ? '#34d399' : '#f87171' }}>
                      {selectedKey === currentQuestion.correct ? '✓ CORRECT ANSWER' : '❌ INCORRECT'}
                    </span>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {!answered ? (
                  <button 
                    onClick={handleAnswerSubmit} 
                    className="primary"
                    disabled={selectedKey === null}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button onClick={handleNext} className="success" style={{ gap: '0.25rem' }}>
                    {currentIdx + 1 === QUESTIONS.length ? 'Finish Quiz' : 'Next Question'} 
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              textAlign: 'center',
              flex: 1,
              padding: '1.5rem 0'
            }}
          >
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'rgba(99, 102, 241, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '1rem',
              color: '#fbbf24'
            }}>
              <Award size={48} />
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Congratulations!</h2>
            <p style={{ maxWidth: '400px', fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
              You explored spherical mirrors and discovered how image formation changes with mirror shape and distance.
            </p>

            {/* Summary Screen */}
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '8px', padding: '1rem', textAlign: 'left', width: '100%', marginBottom: '1.5rem' }}>
              <h4 style={{ color: '#818cf8', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Key Takeaways</h4>
              <ul style={{ fontSize: '0.85rem', color: '#cbd5e1', paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>✓ Curved mirrors are called spherical mirrors.</li>
                <li>✓ A concave mirror curves inward.</li>
                <li>✓ A convex mirror curves outward.</li>
                <li>✓ Concave mirrors can produce enlarged or inverted images.</li>
                <li>✓ Convex mirrors produce smaller upright images.</li>
                <li>✓ Convex mirrors are useful for safety and surveillance.</li>
              </ul>
            </div>

            <button onClick={handleRestart} className="primary" style={{ gap: '0.5rem' }}>
              <RotateCcw size={16} /> Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
