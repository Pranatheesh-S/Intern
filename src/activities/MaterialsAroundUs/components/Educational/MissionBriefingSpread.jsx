import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Check, X, ArrowRight, ArrowLeft } from 'lucide-react';
import useSound from 'use-sound';
import newChiefDetectiveImage from '../../../../assets/new chief detective .jpeg';

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
      background: '#ffffff',
      fontFamily: 'Georgia, "Times New Roman", serif',
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
            background: #ffffff;
            border: 8px solid #1b2a4a;
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
            align-items: center;
            height: 100%;
            overflow: hidden;
            position: relative;
            padding: 24px 28px 76px;
          }
          .left-content-block {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: clamp(260px, 42vh, 400px);
          }
          .left-hero-wrapper {
            width: 100%;
            margin-bottom: 12px;
          }
          .barrier2-hero-img, .default-hero-img {
            width: 100%;
            height: clamp(480px, 60vh, 650px);
            object-fit: cover;
            object-position: top center;
            display: block;
            box-shadow: 0 6px 16px rgba(0,0,0,0.12);
          }

          /* ---------- RIGHT PAGE ---------- */
          .right-page {
            background: #ffffff;
            border-left: 1px solid #ece7d8;
            height: 100%;
            overflow-y: auto;
            padding: 32px 40px 28px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
          }
          
          /* ---------- LEFT PAGE SPEECH BUBBLE ---------- */
          .speech-bubble {
            position: relative;
            width: 100%;
            background: white;
            padding: 2.5rem 1.8rem;
            min-height: 180px;
            display: flex;
            align-items: center;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.1);
            z-index: 20;
            border: 2px solid #e2e8f0;
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
            border-color: transparent transparent #e2e8f0;
            display: block;
            width: 0;
          }
          .speech-speaker {
            position: absolute;
            top: -15px;
            right: 20px;
            background: #64748b;
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
            color: #3b4ea0;
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .mission-title {
            font-size: clamp(41px, 5vh, 53px);
            line-height: 1.12;
            color: #1b2a4a;
            font-weight: 700;
            margin: 0 0 22px 0;
            font-family: Georgia, "Times New Roman", serif;
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
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #ef4444;
            border-radius: 12px;
            padding: 22px 26px;
            margin-bottom: 22px;
            width: 100%;
          }
          .mission-box h3 {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 19px;
            font-weight: 700;
            color: #3b4ea0;
            margin: 0 0 12px 0;
            display: flex;
            align-items: center;
            gap: 10px;
            letter-spacing: 1px;
          }
          .mission-box p, .mission-box li {
            font-family: Arial, Helvetica, sans-serif;
            font-size: clamp(20px, 2.5vh, 25px);
            color: #1e293b;
            line-height: 1.45;
            font-weight: 600;
          }
          .mission-meta {
            display: flex;
            gap: 48px;
            border-top: 1px dashed #cbd5e1;
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
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .meta-value {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 22px;
            font-weight: 600;
            color: #0f172a;
            display: flex;
            align-items: center;
            gap: 7px;
          }
          .meta-stars {
            color: #eab308;
            font-size: 24px;
          }
          .meta-stars.empty {
            color: #cbd5e1;
          }

          .start-btn {
            background: #4052a0;
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
            background: #2a3a80;
          }

          @media (max-width: 1024px) {
            .spread { flex-direction: column; overflow-y: auto; }
            .right-page { border-left: none; border-top: 1px solid #ece7d8; overflow-y: visible; }
          }
          .spread-back-btn {
            position: absolute;
            bottom: 18px;
            left: 24px;
            top: auto;
            z-index: 10000;
            background: #ffffff;
            border: 2px solid #cbd5e1;
            color: #1e293b;
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
            background: #f8fafc;
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
            <div className="left-content-block">
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
                <p style={{ margin: 0, fontSize: 'clamp(26px, 3vh, 34px)', color: '#1e293b', lineHeight: '1.45', fontWeight: '500' }}>
                  {data.dialogue || "Good morning, Detective. Headquarters has received an unusual science case. Study your investigation brief carefully before proceeding!"}
                </p>
              </motion.div>
            </div>

            <button className="spread-back-btn" onClick={onBack}>
              <ArrowLeft size={20} /> Back
            </button>
          </div>
          
          {/* RIGHT PAGE */}
          <div className="page-spread right-page">
            <div className="mission-header">
              <ShieldAlert size={22} />
              MISSION BRIEFING
            </div>
            
            <h1 className="mission-title">{data.title || 'The Classroom Mystery'}</h1>
            
            <div className="mission-content">
              <p>{data.description || "Review the handbook and proceed to the activity area to complete the required tasks for this barrier."}</p>
            </div>
            
            <div className="mission-box">
              <h3><Check size={18} color="#ef4444" /> OBJECTIVES</h3>
              {Array.isArray(data.objective) ? (
                <ul style={{ margin: 0, paddingLeft: '26px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  {data.objective.map((obj, i) => (
                    <li key={i} style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 'clamp(20px, 2.5vh, 25px)', color: '#1e293b', lineHeight: '1.45' }}>
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
            
            <div style={{ marginTop: '4px' }}>
              <button className="start-btn" onClick={handleStart}>
                Acknowledge & Begin <ArrowRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
