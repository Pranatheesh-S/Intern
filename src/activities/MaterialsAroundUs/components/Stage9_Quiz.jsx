import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Award, RefreshCw, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Stage9_Quiz({ onComplete, addXp }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const questions = [
    {
      q: 'Which of the following is correct about why we classify materials?',
      options: [
        'To make our shelves look extremely colorful',
        'For convenience and to study their properties systematically',
        'To separate metal pins from plastic toys only',
        'To make materials dissolve faster'
      ],
      correctIndex: 1,
      explanation: 'Classification divides materials into groups based on similarities and differences. This helps us locate items easily and observe patterns in their properties.'
    },
    {
      q: 'Why are water tumblers NOT made of cloth fabrics?',
      options: [
        'Cloth is a hard material',
        'Cloth contains tiny pores and absorbs water, letting it leak through',
        'Cloth is too expensive to manufacture',
        'Cloth reacts chemically to turn water sour'
      ],
      correctIndex: 1,
      explanation: 'A tumbler needs to hold liquids. Since cloth is porous and absorbent, water leaks out immediately. We must choose a material that is rigid and non-porous.'
    },
    {
      q: 'Which pair represents the correct English translation of the Ayurvedic gunas "Mṛdu" and "Sāndra"?',
      options: [
        'Hard and Liquid',
        'Heavy and Light',
        'Soft and Solid',
        'Smooth and Rough'
      ],
      correctIndex: 2,
      explanation: 'In the Ashtanga Hridaya shlokas, Mṛdu stands for Soft (opposite of Kathina / Hard), and Sāndra stands for Solid (opposite of Drava / Liquid).'
    },
    {
      q: 'Freshly cut metal surfaces exhibit lustre. If left in open air, what happens to their shine?',
      options: [
        'They shine brighter under sunlight',
        'They retain their exact same shine forever',
        'They become dull due to reaction with air and moisture (corrosion)',
        'They slowly transform into wood'
      ],
      correctIndex: 2,
      explanation: 'Metals lose their lustre and appear dull because of the action of air and moisture on them. Scraping them with sandpaper restores the shiny layer.'
    },
    {
      q: 'Which definition correctly describes "Matter" as learned in Chapter 6?',
      options: [
        'Anything that is shiny and dissolves in warm water',
        'Anything that has mass and occupies space (volume)',
        'Only solid objects like bricks and iron keys',
        'Things that can easily be cut with scissors'
      ],
      correctIndex: 1,
      explanation: 'Matter is the unified definition of everything around us that has mass (weighs something) and occupies space (volume).'
    }
  ];

  const handleSelectAnswer = (index) => {
    if (isAnswered) return;
    setSelectedAns(index);
  };

  const handleVerify = () => {
    if (selectedAns === null || isAnswered) return;
    
    setIsAnswered(true);
    const isCorrect = selectedAns === questions[currentQIndex].correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      addXp(15);
    }
  };

  const handleNext = () => {
    setSelectedAns(null);
    setIsAnswered(false);
    
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      addXp(30);
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedAns(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  useEffect(() => {
    if (quizFinished) {
      onComplete();
    }
  }, [quizFinished, onComplete]);

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
      {!quizFinished ? (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Question {currentQIndex + 1} of {questions.length}</span>
            <span style={{ fontSize: '1rem', color: 'var(--accent)', fontWeight: 'bold' }}>Score: {score}</span>
          </div>

          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)', lineHeight: '1.5' }}>
            {questions[currentQIndex].q}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {questions[currentQIndex].options.map((option, idx) => {
              const isSelected = selectedAns === idx;
              const isCorrect = idx === questions[currentQIndex].correctIndex;
              
              let btnBg = 'var(--card-bg)';
              let btnBorder = 'var(--border)';
              let textColor = 'var(--text-primary)';

              if (isAnswered) {
                if (isCorrect) {
                  btnBg = 'var(--success-bg)';
                  btnBorder = 'var(--success-border)';
                  textColor = 'var(--success)';
                } else if (isSelected) {
                  btnBg = 'var(--danger-bg)';
                  btnBorder = 'var(--danger-border)';
                  textColor = 'var(--danger)';
                }
              } else if (isSelected) {
                btnBg = 'var(--accent-bg)';
                btnBorder = 'var(--accent)';
                textColor = 'var(--accent-text)';
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={isAnswered}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: `1px solid ${btnBorder}`,
                    background: btnBg,
                    color: textColor,
                    fontSize: '1rem',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    fontWeight: isSelected ? 'bold' : 'normal',
                    cursor: isAnswered ? 'default' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                background: selectedAns === questions[currentQIndex].correctIndex ? 'var(--success-bg)' : 'var(--danger-bg)',
                border: `1px solid ${selectedAns === questions[currentQIndex].correctIndex ? 'var(--success-border)' : 'var(--danger-border)'}`,
                display: 'flex',
                gap: '0.5rem',
                fontSize: '1rem',
                color: selectedAns === questions[currentQIndex].correctIndex ? 'var(--success)' : 'var(--danger)',
                lineHeight: '1.5'
              }}
            >
              {selectedAns === questions[currentQIndex].correctIndex ? (
                <CheckCircle size={18} style={{ flexShrink: 0 }} />
              ) : (
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
              )}
              <div>
                <strong>{selectedAns === questions[currentQIndex].correctIndex ? 'Correct!' : 'Incorrect.'}</strong> {questions[currentQIndex].explanation}
              </div>
            </motion.div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            {!isAnswered ? (
              <button 
                onClick={handleVerify} 
                disabled={selectedAns === null} 
                className="primary" 
                style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
              >
                Verify Answer
              </button>
            ) : (
              <button 
                onClick={handleNext} 
                className="primary" 
                style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
              >
                {currentQIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel" 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', border: '1px solid var(--accent)', padding: '2rem 1.5rem', textAlign: 'center' }}
        >
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent)', boxShadow: '0 0 15px var(--accent-border)' }}>
            <Award size={48} style={{ color: 'var(--accent)' }} />
          </div>

          <div>
            <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-heading)' }}>Chapter Completed!</h3>
            <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>You scored {score} out of {questions.length} questions correctly.</span>
          </div>

          {score === questions.length ? (
            <div style={{ padding: '1rem', borderRadius: '8px', background: 'var(--success-bg)', border: '1px solid var(--success-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '1rem', fontWeight: 'bold' }}>
              <Star size={18} fill="var(--success)" /> Perfect Score! Master Investigator Badge Unlocked!
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem' }}>
            <button onClick={restartQuiz} className="outline" style={{ flex: 1, gap: '0.5rem', padding: '0.75rem', fontSize: '1rem' }}>
              <RefreshCw size={16} /> Restart Quiz
            </button>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: '8px', color: 'var(--success)', fontWeight: 'bold', fontSize: '1rem' }}>
              Click "Proceed" in Top Right!
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
