import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle, ArrowRight, ArrowLeft, BookMarked, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';

export default function ChiefDetective({ data, onContinue, onBack }) {
  const BLAKE_IMG_URL = '/images/chief_detective_blake.png';
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [stampVisible, setStampVisible] = useState(false);

  useEffect(() => {
    try { playSuccess(); } catch(e) {}
    try {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch(e) {}

    const timer = setTimeout(() => {
      setStampVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [playSuccess]);

  const handleStart = () => {
    onContinue();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--lesson-surface)',
      fontFamily: '"Times New Roman", serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '16px',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      <style>
        {`
          .book-frame {
            width: 100%;
            height: 100%;
            background: var(--lesson-surface);
            border: 8px solid var(--lesson-primary);
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.18);
            position: relative;
          }
          .spread {
            display: flex;
            width: 100%;
            height: 100%;
            border-radius: 8px;
            overflow: hidden;
          }
          .page-spread {
            flex: 1;
            padding: 44px 48px 40px;
          }
          .left-page {
            background: #f6f1e4;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            overflow: hidden;
            position: relative;
          }
          .right-page {
            background: var(--lesson-surface);
            border-left: 1px solid #ece7d8;
            height: 100%;
            overflow-y: auto;
            padding-bottom: 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
          }
          
          /* ---------- LEFT PAGE ---------- */
          .back-button {
            position: absolute;
            top: 24px;
            left: 24px;
            background: rgba(255, 255, 255, 0.8);
            border: 2px solid var(--lesson-border);
            border-radius: 8px;
            padding: 8px 16px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            font-weight: bold;
            color: var(--lesson-secondary);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            z-index: 50;
            transition: all 0.2s;
          }
          .back-button:hover {
            background: white;
            color: var(--lesson-text);
            transform: translateX(-2px);
          }
          
          .speech-bubble {
            position: absolute;
            bottom: 40px;
            left: 40px;
            right: 40px;
            background: white;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            z-index: 20;
            border: 2px solid var(--lesson-border);
          }
          .speech-bubble::after {
            content: '';
            position: absolute;
            top: -16px;
            left: 40px;
            border-width: 0 16px 16px;
            border-style: solid;
            border-color: transparent transparent white;
            display: block;
            width: 0;
            z-index: 1;
          }
          .speech-bubble::before {
            content: '';
            position: absolute;
            top: -19px;
            left: 38px;
            border-width: 0 18px 18px;
            border-style: solid;
            border-color: transparent transparent var(--lesson-border);
            display: block;
            width: 0;
          }
          .speech-speaker {
            position: absolute;
            top: -16px;
            right: 24px;
            background: var(--lesson-muted);
            color: white;
            padding: 4px 16px;
            border-radius: 6px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 0.85rem;
            font-weight: bold;
            letter-spacing: 1px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }

          /* ---------- RIGHT PAGE ---------- */
          .debrief-header {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 2px;
            color: var(--lesson-success);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .debrief-title {
            font-size: 52px;
            line-height: 1.1;
            color: var(--lesson-primary);
            font-weight: 700;
            margin: 0 0 36px 0;
          }
          .debrief-box {
            background: var(--lesson-surface);
            border: 1px solid var(--lesson-border);
            border-left: 4px solid var(--lesson-success);
            border-radius: 12px;
            padding: 28px;
            margin-bottom: 40px;
          }
          .debrief-box h3 {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 18px;
            font-weight: 700;
            color: var(--lesson-muted);
            margin: 0 0 16px 0;
            display: flex;
            align-items: center;
            gap: 10px;
            letter-spacing: 1px;
          }
          
          .reward-box {
            background: var(--lesson-success-bg);
            border: 2px solid var(--lesson-success-border);
            border-radius: 12px;
            padding: 20px 28px;
            margin-bottom: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .reward-label {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 16px;
            font-weight: 700;
            color: var(--lesson-success);
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .reward-value {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 20px;
            font-weight: 600;
            color: var(--lesson-success);
          }

          .start-btn {
            background: var(--lesson-success);
            color: white;
            border: none;
            padding: 20px 40px;
            border-radius: 40px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 20px;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            box-shadow: 0 8px 20px rgba(22,163,74,0.3);
            transition: all 0.2s;
            width: fit-content;
          }
          .start-btn:hover {
            transform: translateY(-2px);
            background: var(--lesson-success);
          }

          /* STAMP ANIMATION */
          .case-stamp {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-15deg) scale(2);
            font-family: 'Courier New', Courier, monospace;
            font-size: 4rem;
            font-weight: 900;
            color: var(--lesson-success);
            border: 8px solid var(--lesson-success);
            padding: 1rem 2rem;
            border-radius: 12px;
            opacity: 0;
            pointer-events: none;
            text-shadow: 2px 2px 0px rgba(255,255,255,0.8);
            box-shadow: 0 0 0 4px rgba(255,255,255,0.8), inset 0 0 0 4px rgba(255,255,255,0.8);
          }
          
          .stamp-animate {
            animation: stampIn 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
          
          @keyframes stampIn {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) rotate(-15deg) scale(3);
            }
            50% {
              opacity: 1;
              transform: translate(-50%, -50%) rotate(-15deg) scale(0.9);
            }
            100% {
              opacity: 0.85;
              transform: translate(-50%, -50%) rotate(-15deg) scale(1);
            }
          }

          @media (max-width: 1024px) {
            .spread { flex-direction: column; overflow-y: auto; }
            .right-page { border-left: none; border-top: 1px solid #ece7d8; overflow-y: visible; }
          }
        `}
      </style>

      <motion.div 
        className="book-frame"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="spread">
          {/* LEFT PAGE */}
          <div className="page-spread left-page">
            {onBack && (
              <button className="back-button" onClick={onBack}>
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <img 
              src={BLAKE_IMG_URL} 
              alt="Chief Detective Blake" 
              style={{ height: '70%', maxHeight: '600px', objectFit: 'contain' }} 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600.png?text=Blake'; }}
            />
            <motion.div 
              className="speech-bubble"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="speech-speaker">CHIEF BLAKE</div>
              <p style={{ margin: 0, fontSize: 'var(--text-xl)', color: 'var(--lesson-text)', lineHeight: '1.6' }}>
                {data.dialogue || "Outstanding work. Headquarters is officially closing this investigation."}
              </p>
            </motion.div>
          </div>
          
          {/* RIGHT PAGE */}
          <div className="page-spread right-page">
            <div className="debrief-header">
              <CheckCircle size={24} />
              EVIDENCE REVIEW
            </div>
            
            <h1 className="debrief-title">{data.title || 'Investigation Officially Closed'}</h1>
            
            <div className="debrief-box">
              <h3><BookMarked size={20} color="var(--lesson-success)" /> FINAL OBSERVATIONS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                {data.observations && data.observations.map((obs, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <CheckCircle size={20} color="var(--lesson-success)" />
                    <span style={{ fontSize: '20px', color: 'var(--lesson-text)' }}>
                      <strong>{obs.object}:</strong> {obs.finding}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="reward-box">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="reward-label">Evidence Submitted</span>
                <span className="reward-value">{data.rewardReason || "Case Completed"}</span>
              </div>
              <Award size={40} color="var(--lesson-success)" />
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <button className="start-btn" onClick={handleStart}>
                {data.isFinal ? 'Close Case File' : 'Next Assignment'} <ArrowRight size={20} />
              </button>
            </div>

            {/* STAMP OVERLAY */}
            <div className={`case-stamp ${stampVisible ? 'stamp-animate' : ''}`}>
              {data.isFinal ? 'CASE CLOSED' : 'SOLVED'}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
