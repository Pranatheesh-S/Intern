import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, ArrowRight, Brain } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage8_Respond({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [playError] = useSound('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', { volume: 0.5 });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const questions = [
    {
      question: "What is the main role of a Patwari in the village?",
      options: [
        "To teach in the primary school",
        "To maintain land records and maps",
        "To head the Gram Panchayat",
        "To build roads in the district"
      ],
      correctAnswer: 1,
      explanation: "A Patwari is a government official who maintains land records and sometimes maps that are generations old!"
    },
    {
      question: "The Panchayati Raj system works at how many levels (tiers)?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctAnswer: 2,
      explanation: "The Panchayati Raj system is a three-tier system: Village (Gram Panchayat), Block (Panchayat Samiti), and District (Zila Parishad)."
    },
    {
      question: "What is the highest level (tier) of the Panchayati Raj system?",
      options: [
        "Gram Panchayat",
        "Bal Panchayat",
        "Panchayat Samiti",
        "Zila Parishad"
      ],
      correctAnswer: 3,
      explanation: "The Zila Parishad operates at the district level and is the highest tier in the Panchayati Raj system."
    },
    {
      question: "Which ancient text written by Kautilya described how a state should be structured?",
      options: [
        "The Constitution",
        "Panchatantra",
        "Arthashastra",
        "Discovery of India"
      ],
      correctAnswer: 2,
      explanation: "The Arthashastra, written some 2300 years ago, explains how a state and its administration should be run from the village to the capital."
    },
    {
      question: "Who elects the members of the Gram Panchayat?",
      options: [
        "The Zila Parishad",
        "The Gram Sabha",
        "The Chief Minister",
        "The Patwari"
      ],
      correctAnswer: 1,
      explanation: "The adult villagers who are enrolled as voters form the Gram Sabha, and they directly elect the members of the Gram Panchayat."
    }
  ];

  const handleSelect = (index) => {
    if (isAnswered) return;
    playClick();
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === questions[currentQuestion].correctAnswer) {
      playSuccess();
      setScore(prev => prev + 1);
      addXp(15);
    } else {
      playError();
    }
  };

  const handleNext = () => {
    playClick();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleClaimReward = () => {
    playSuccess();
    addXp(50);
    setRewardClaimed(true);
    if(onComplete) onComplete();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '4rem', alignItems: 'center' }}>
      <section style={{ width: '100%', maxWidth: '800px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Final Challenge
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
        </div>
        
        {!quizCompleted ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Brain color="#38bdf8" /> Chapter Quiz
              </h2>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem 1rem', borderRadius: '20px', color: '#38bdf8', fontWeight: 'bold' }}>
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                className="glass-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ background: 'var(--surface)', borderLeft: '4px solid #38bdf8' }}
              >
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-heading)', marginTop: 0, marginBottom: '2rem', lineHeight: '1.4' }}>
                  {questions[currentQuestion].question}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {questions[currentQuestion].options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = isAnswered && index === questions[currentQuestion].correctAnswer;
                    const isWrong = isAnswered && isSelected && index !== questions[currentQuestion].correctAnswer;
                    
                    let bg = 'var(--bg-color)';
                    let border = '1px solid var(--border)';
                    if (isCorrect) {
                      bg = 'rgba(16, 185, 129, 0.1)';
                      border = '1px solid #10b981';
                    } else if (isWrong) {
                      bg = 'rgba(239, 68, 68, 0.1)';
                      border = '1px solid #ef4444';
                    } else if (isSelected) {
                      bg = 'var(--surface)';
                      border = '1px solid var(--accent)';
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleSelect(index)}
                        disabled={isAnswered}
                        style={{
                          padding: '1rem 1.5rem',
                          borderRadius: '12px',
                          border: border,
                          background: bg,
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: isAnswered ? 'default' : 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '1.1rem',
                          textAlign: 'left'
                        }}
                      >
                        {option}
                        {isCorrect && <CheckCircle color="#10b981" size={20} />}
                        {isWrong && <XCircle color="#ef4444" size={20} />}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}
                  >
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.5' }}>
                      {questions[currentQuestion].explanation}
                    </p>
                  </motion.div>
                )}

                {isAnswered && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <button onClick={handleNext} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
                      {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            className="glass-panel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', background: 'var(--surface)', borderLeft: '4px solid #eab308' }}
          >
            <Trophy size={80} color="#eab308" />
            <div>
              <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-heading)' }}>
                Quiz Completed!
              </h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', margin: '1rem 0' }}>
                You scored {score} out of {questions.length}!
              </p>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                You have successfully explored the Panchayati Raj system, discovered the three-tier structure, and learned about inspiring grassroots leaders.
              </p>
            </div>

            {!rewardClaimed ? (
              <button 
                onClick={handleClaimReward}
                className="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '12px' }}
              >
                Claim Final Reward (+50 XP)
              </button>
            ) : (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: '#eab308', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={28} /> XP Claimed! You are a Democracy Champion.
              </motion.div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}
