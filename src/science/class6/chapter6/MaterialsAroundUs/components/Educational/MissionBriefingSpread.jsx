import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Check, X, ArrowRight, ArrowLeft } from 'lucide-react';
import useSound from 'use-sound';
import newChiefDetectiveImage from '../../../../../../assets/new chief detective .jpeg';

export default function MissionBriefingSpread({ data, onContinue, onBack }) {
  const BLAKE_IMG_URL = '/images/chief_detective_blake.png';
  const isBarrier2 = data?.title?.includes('Barrier 2') || data?.title?.includes('Grouping Materials') || data?.id === 'barrier_2';
  const detectiveImg = data?.detectiveImage || (isBarrier2 ? newChiefDetectiveImage : BLAKE_IMG_URL);
  
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });

  const handleStart = () => {
    try { playSuccess(); } catch (e) {}
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
          }
          .left-page {
            background: #f6f1e4;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: stretch;
            height: 100%;
            overflow: hidden;
            position: relative;
            padding: 24px 28px 76px;
          }
          .left-hero-wrapper {
            width: 100%;
            margin-bottom: 12px;
            overflow: hidden;
          }
          .barrier2-hero-img {
            width: 100%;
            height: clamp(480px, 60vh, 650px);
            object-fit: cover;
            object-position: top center;
            display: block;
            filter: drop-shadow(0 6px 16px rgba(0,0,0,0.12));
          }
          .default-hero-img {
            width: 100%;
            height: clamp(480px, 60vh, 650px);
            object-fit: cover;
            object-position: top center;
            display: block;
            box-shadow: 0 6px 16px rgba(0,0,0,0.12);
          }

          /* ---------- RIGHT PAGE ---------- */
          .right-page {
            background: var(--lesson-surface);
            border-left: 1px solid #ece7d8;
            height: 100%;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          .right-page-content {
            width: 100%;
            height: 100%;
            overflow-y: auto;
            padding: 32px 40px 96px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            box-sizing: border-box;
          }
          
          /* ---------- LEFT PAGE SPEECH BUBBLE ---------- */
          .speech-bubble {
            position: relative;
            margin-top: 4px;
            width: 100%;
            background: white;
            padding: 2.5rem 1.8rem;
            min-height: 180px;
            display: flex;
            align-items: center;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.1);
            z-index: 20;
            border: 2px solid var(--lesson-border);
            flex: 0 0 auto;
          }
          .speech-bubble::after {
            content: '';
            position: absolute;
            top: -14px;
            left: 32px;
            border-width: 0 14px 14px;
            border-style: solid;
            border-color: transparent transparent white;
            display: block;
            width: 0;
            z-index: 1;
          }
          .speech-bubble::before {
            content: '';
            position: absolute;
            top: -17px;
            left: 30px;
            border-width: 0 16px 16px;
            border-style: solid;
            border-color: transparent transparent var(--lesson-border);
            display: block;
            width: 0;
          }
          .speech-speaker {
            position: absolute;
            top: -15px;
            right: 20px;
            background: var(--lesson-muted);
            color: white;
            padding: 4px 16px;
            border-radius: 6px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 1.08rem;
            font-weight: bold;
            letter-spacing: 1px;
            box-shadow: 0 3px 6px rgba(0,0,0,0.1);
          }

          /* ---------- RIGHT PAGE CONTENT ---------- */
          .mission-header {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 1.8px;
            color: var(--lesson-primary);
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .mission-title {
            font-size: clamp(35px, 4.3vh, 46px);
            line-height: 1.15;
            color: var(--lesson-primary);
            font-weight: 700;
            margin: 0 0 22px 0;
            font-family: Georgia, "Times New Roman", serif;
            word-break: keep-all;
          }
          .mission-content {
            margin-bottom: 22px;
            width: 100%;
          }
          .mission-content p {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            font-size: clamp(23px, 2.8vh, 29px);
            line-height: 1.5;
            color: #3b4560;
          }
          .mission-box {
            background: var(--lesson-surface);
            border: 1px solid var(--lesson-border);
            border-left: 4px solid var(--lesson-danger);
            border-radius: 12px;
            padding: 22px 26px;
            margin-bottom: 22px;
            width: 100%;
          }
          .mission-box h3 {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 19px;
            font-weight: 700;
            color: var(--lesson-primary);
            margin: 0 0 12px 0;
            display: flex;
            align-items: center;
            gap: 10px;
            letter-spacing: 1px;
          }
          .mission-box p, .mission-box li {
            font-family: Arial, Helvetica, sans-serif;
            font-size: clamp(20px, 2.5vh, 25px);
            color: var(--lesson-text);
            line-height: 1.45;
            font-weight: 600;
          }
          .mission-meta {
            display: flex;
            gap: 48px;
            border-top: 1px dashed var(--lesson-border);
            padding-top: 18px;
            margin-bottom: 22px;
            width: 100%;
          }
          .meta-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
          .meta-label {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 16px;
            font-weight: 700;
            color: var(--lesson-muted);
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .meta-value {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 22px;
            font-weight: 600;
            color: var(--lesson-text);
            display: flex;
            align-items: center;
            gap: 7px;
          }
          .meta-stars {
            color: var(--lesson-warning);
            font-size: 24px;
          }
          .meta-stars.empty {
            color: var(--lesson-border);
          }

          .start-btn {
            position: absolute;
            bottom: 18px;
            right: 28px;
            z-index: 10000;
            background: var(--lesson-primary);
            color: white;
            border: none;
            padding: 18px 44px;
            border-radius: 42px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 22px;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 14px;
            box-shadow: 0 6px 18px rgba(64,82,160,0.3);
            transition: all 0.2s;
            width: fit-content;
          }
          .start-btn:hover {
            transform: translateY(-2px);
            background: var(--lesson-primary);
          }

          @media (max-width: 1024px) {
            .spread { flex-direction: column; overflow-y: auto; }
            .right-page { border-left: none; border-top: 1px solid #ece7d8; overflow-y: visible; }
            .right-page-content { overflow-y: visible; height: auto; padding-bottom: 96px; }
          }
          .spread-back-btn {
            position: absolute;
            bottom: 18px;
            left: 24px;
            top: auto;
            z-index: 10000;
            background: var(--lesson-surface);
            border: 2px solid var(--lesson-border);
            color: var(--lesson-text);
            padding: 12px 26px;
            border-radius: 11px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 19px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 5px 14px rgba(0,0,0,0.09);
            transition: all 0.2s;
          }
          .spread-back-btn:hover {
            background: var(--lesson-surface);
            transform: translateY(-1px);
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
            <div className="left-hero-wrapper">
              <img 
                src={detectiveImg} 
                alt="Chief Detective" 
                className={isBarrier2 ? "barrier2-hero-img" : "default-hero-img"}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600.png?text=Blake'; }}
              />
            </div>
            <motion.div 
              className="speech-bubble"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="speech-speaker">CHIEF BLAKE</div>
              <p style={{ margin: 0, fontSize: 'clamp(26px, 3vh, 34px)', color: 'var(--lesson-text)', lineHeight: '1.45', fontWeight: '500' }}>
                {data.dialogue || "Good morning, Detective. Headquarters has received an unusual science case. Study your investigation brief carefully before proceeding!"}
              </p>
            </motion.div>

            <button className="spread-back-btn" onClick={onBack}>
              <ArrowLeft size={20} /> Back
            </button>
          </div>
          
          {/* RIGHT PAGE */}
          <div className="page-spread right-page">
            <div className="right-page-content">
              <div className="mission-header">
                <ShieldAlert size={22} />
                MISSION BRIEFING
              </div>
              
              <h1 className="mission-title">
                {typeof data?.title === 'string' ? data.title.replace('Barrier 2', 'Barrier\u00A02') : (data?.title || 'The Classroom Mystery')}
              </h1>
              
              <div className="mission-content">
                <p>{data.description || "Review the handbook and proceed to the activity area to complete the required tasks for this barrier."}</p>
              </div>
              
              <div className="mission-box">
                <h3><Check size={18} color="var(--lesson-danger)" /> OBJECTIVES</h3>
                {Array.isArray(data.objective) ? (
                  <ul style={{ margin: 0, paddingLeft: '26px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                    {data.objective.map((obj, i) => (
                      <li key={i} style={{ fontSize: 'clamp(20px, 2.5vh, 25px)', color: 'var(--lesson-text)', lineHeight: '1.45' }}>
                        {obj}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{data.objective || "Complete the investigation."}</p>
                )}
              </div>
              
              <div className="mission-meta">
                <div className="meta-item">
                  <span className="meta-label">Difficulty</span>
                  <span className="meta-value">
                    {[1, 2, 3].map(star => (
                      <span key={star} className={`meta-stars ${star > (data.difficulty || 1) ? 'empty' : ''}`}>★</span>
                    ))}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Est. Time</span>
                  <span className="meta-value">⏱ {data.estimatedTime || '5 minutes'}</span>
                </div>
              </div>
            </div>

            <button className="start-btn" onClick={handleStart}>
              Acknowledge & Begin <ArrowRight size={22} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
