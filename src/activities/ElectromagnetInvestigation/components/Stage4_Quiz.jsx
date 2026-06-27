import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, Home } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What happens when current flows through the cylindrical coil?",
    options: [
      { id: "a", text: "It becomes magnetic." },
      { id: "b", text: "It melts." },
      { id: "c", text: "Nothing happens." },
      { id: "d", text: "The battery becomes magnetic." }
    ],
    correctAnswer: "a",
    explanation: "A current-carrying coil generates a magnetic field and behaves like a magnet."
  },
  {
    id: 2,
    question: "Why does inserting an iron nail increase the magnetic strength?",
    options: [
      { id: "a", text: "The iron core strengthens the electromagnet." },
      { id: "b", text: "The iron blocks the current." },
      { id: "c", text: "The iron is a good conductor of heat." },
      { id: "d", text: "It doesn't increase the strength." }
    ],
    correctAnswer: "a",
    explanation: "The iron core concentrates the magnetic field lines, producing a much stronger electromagnet than an air core."
  },
  {
    id: 3,
    question: "When the switch is turned OFF:",
    options: [
      { id: "a", text: "Magnetism disappears." },
      { id: "b", text: "Magnetism increases." },
      { id: "c", text: "Compass spins continuously." },
      { id: "d", text: "Battery becomes stronger." }
    ],
    correctAnswer: "a",
    explanation: "An electromagnet is temporary; it loses its magnetism almost instantly when the electric current stops flowing."
  },
  {
    id: 4,
    question: "If the North pole of the compass is attracted to End A, then End A is:",
    options: [
      { id: "a", text: "North" },
      { id: "b", text: "South" },
      { id: "c", text: "Neutral" }
    ],
    correctAnswer: "b",
    explanation: "Unlike magnetic poles attract each other. If the North pole of the compass is attracted to End A, End A must be a South pole."
  },
  {
    id: 5,
    question: "What happens when the battery connections are reversed?",
    options: [
      { id: "a", text: "The electromagnet loses its magnetism forever." },
      { id: "b", text: "The electromagnet becomes twice as strong." },
      { id: "c", text: "The North and South poles of the electromagnet interchange." },
      { id: "d", text: "Nothing happens." }
    ],
    correctAnswer: "c",
    explanation: "Reversing the direction of the current reverses the direction of the magnetic field, flipping the North and South poles."
  },
  {
    id: 6,
    question: "Which of the following increases the strength of an electromagnet?",
    options: [
      { id: "a", text: "More turns of wire" },
      { id: "b", text: "More current (more cells)" },
      { id: "c", text: "An iron core" },
      { id: "d", text: "All of the above" }
    ],
    correctAnswer: "d",
    explanation: "The strength of an electromagnet depends on the number of turns, the magnitude of the current, and the presence of a magnetic core."
  }
];

export default function Stage4_Quiz({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];

  const handleSelectAnswer = (optionId) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(optionId);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    setIsAnswerChecked(true);
    
    if (selectedAnswer === question.correctAnswer) {
      setScore(prev => prev + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setQuizComplete(true);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
    }
  };

  if (quizComplete) {
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    let message = "";
    if (percentage === 100) message = "Perfect Score! You are an Electromagnetism Expert! 🏆";
    else if (percentage >= 80) message = "Great job! You understand electromagnets very well! 🌟";
    else if (percentage >= 60) message = "Good effort! You've got the basics down! 👍";
    else message = "Keep learning! Review the sandbox to understand the concepts better. 📚";

    return (
      <div className="main-grid" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel"
          style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
        >
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--success-bg)', border: '4px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
              {percentage}%
            </span>
          </div>
          
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', color: 'var(--text-heading)' }}>
              Quiz Complete!
            </h2>
            <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              You scored {score} out of {QUIZ_QUESTIONS.length}
            </p>
          </div>

          <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--accent)', fontWeight: '500' }}>
            {message}
          </p>

          {/* Activity Summary Box */}
          <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'left', marginTop: '1rem', maxWidth: '100%' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-heading)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              What we learned in this lab:
            </h3>
            <ul style={{ margin: 0, padding: '0 0 0 1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              <li><strong>Activity 4.2:</strong> Build a simple electromagnet using a nail, coil, and battery. Observe that paper clips stick only when current flows.</li>
              <li><strong>Activity 4.3:</strong> Improve the setup by making a cylindrical coil, compare the air-core coil with an iron-core electromagnet, and observe compass deflection.</li>
              <li><strong>Activity 4.4:</strong> Use the same electromagnet to identify the North and South poles with a compass, then reverse the battery and observe the poles swap.</li>
            </ul>
          </div>

          <button onClick={onComplete} className="primary" style={{ marginTop: '1rem', padding: '0.75rem 2rem', gap: '0.5rem', fontSize: '1rem' }}>
            <Home size={18} /> Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="main-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="status-badge neutral" style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
            Stage 4: Concept Check
          </span>
        </div>
        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
          Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
        </span>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <HelpCircle size={28} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
          <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-heading)', lineHeight: '1.4' }}>
            {question.question}
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const showCorrect = isAnswerChecked && option.id === question.correctAnswer;
            const showIncorrect = isAnswerChecked && isSelected && !isCorrect;

            let borderColor = 'var(--border)';
            let bgColor = 'var(--surface)';
            let icon = null;

            if (showCorrect) {
              borderColor = 'var(--success)';
              bgColor = 'var(--success-bg)';
              icon = <CheckCircle2 size={20} color="var(--success)" />;
            } else if (showIncorrect) {
              borderColor = 'var(--danger)';
              bgColor = 'var(--danger-bg)';
              icon = <XCircle size={20} color="var(--danger)" />;
            } else if (isSelected) {
              borderColor = 'var(--accent)';
              bgColor = 'var(--accent-bg)';
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                disabled={isAnswerChecked}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  background: bgColor,
                  border: `2px solid ${borderColor}`,
                  color: 'var(--text-primary)',
                  fontSize: '1.05rem',
                  textAlign: 'left',
                  cursor: isAnswerChecked ? 'default' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{option.text}</span>
                {icon}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {isAnswerChecked && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              style={{
                background: isCorrect ? 'var(--success-bg)' : 'var(--danger-bg)',
                border: `1px solid ${isCorrect ? 'var(--success-border)' : 'var(--danger-border)'}`,
                borderRadius: '10px',
                padding: '1.25rem',
                marginTop: '0.5rem'
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem 0', color: isCorrect ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                {isCorrect ? "Correct!" : "Not quite right."}
              </h4>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                {question.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          {!isAnswerChecked ? (
            <button 
              onClick={handleCheckAnswer} 
              disabled={!selectedAnswer}
              className="primary" 
              style={{ padding: '0.75rem 2rem', fontSize: '1.05rem' }}
            >
              Check Answer
            </button>
          ) : (
            <button 
              onClick={handleNextQuestion} 
              className="primary" 
              style={{ padding: '0.75rem 2rem', fontSize: '1.05rem', gap: '0.5rem' }}
            >
              {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}
              <ArrowRight size={18} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
