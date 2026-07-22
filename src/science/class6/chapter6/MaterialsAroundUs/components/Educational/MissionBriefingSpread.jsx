import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Check, X, ArrowRight, ArrowLeft } from 'lucide-react';
import useSound from 'use-sound';

export default function MissionBriefingSpread({ data, onContinue, onBack }) {
  const BLAKE_IMG_URL = '/images/chief_detective_blake.png';
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
            background: #ffffff;
            border-left: 1px solid #ece7d8;
            height: 100%;
            overflow-y: auto;
            padding-bottom: 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          /* ---------- LEFT PAGE ---------- */
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
            border: 2px solid #e2e8f0;
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
            border-color: transparent transparent #e2e8f0;
            display: block;
            width: 0;
          }
          .speech-speaker {
            position: absolute;
            top: -16px;
            right: 24px;
            background: #64748b;
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
          .mission-header {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 2px;
            color: #3b4ea0;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .mission-title {
            font-size: 52px;
            line-height: 1.1;
            color: #1b2a4a;
            font-weight: 700;
            margin: 0 0 36px 0;
          }
          .mission-content {
            margin-bottom: 48px;
          }
          .mission-content p {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 26px;
            line-height: 1.6;
            color: #3b4560;
          }
          .mission-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #ef4444;
            border-radius: 12px;
            padding: 28px;
            margin-bottom: 40px;
          }
          .mission-box h3 {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 18px;
            font-weight: 700;
            color: #64748b;
            margin: 0 0 16px 0;
            display: flex;
            align-items: center;
            gap: 10px;
            letter-spacing: 1px;
          }
          .mission-box p {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 20px;
            color: #1e293b;
            line-height: 1.5;
          }
          .mission-meta {
            display: flex;
            gap: 40px;
            border-top: 1px dashed #cbd5e1;
            padding-top: 24px;
          }
          .meta-item {
            display: flex;
            flex-direction: column;
            gap: 6px;
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
            font-size: 20px;
            font-weight: 600;
            color: #0f172a;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .meta-stars {
            color: #eab308;
            font-size: 20px;
          }
          .meta-stars.empty {
            color: #cbd5e1;
          }

          .start-btn {
            background: #3b4ea0;
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
            box-shadow: 0 8px 20px rgba(59,78,160,0.3);
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
            top: 24px;
            left: 24px;
            z-index: 10000;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            color: #1e293b;
            padding: 8px 16px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: all 0.2s;
          }
          .spread-back-btn:hover {
            background: #f8fafc;
            transform: translateY(-1px);
          }
        `}
      </style>

      <button className="spread-back-btn" onClick={onBack}>
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div 
        className="book-frame"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="spread">
          {/* LEFT PAGE */}
          <div className="page-spread left-page">
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
              <p style={{ margin: 0, fontSize: 'var(--text-xl)', color: '#1e293b', lineHeight: '1.6' }}>
                {data.dialogue || "Good morning, Detective. Headquarters has received an unusual science case. Study your investigation brief carefully before proceeding!"}
              </p>
            </motion.div>
          </div>
          
          {/* RIGHT PAGE */}
          <div className="page-spread right-page">
            <div className="mission-header">
              <ShieldAlert size={20} />
              MISSION BRIEFING
            </div>
            
            <h1 className="mission-title">{data.title || 'The Classroom Mystery'}</h1>
            
            <div className="mission-content">
              <p>{data.description || "Review the handbook and proceed to the activity area to complete the required tasks for this barrier."}</p>
            </div>
            
            <div className="mission-box">
              <h3><Check size={16} color="#ef4444" /> OBJECTIVES</h3>
              {Array.isArray(data.objective) ? (
                <ul style={{ margin: 0, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.objective.map((obj, i) => (
                    <li key={i} style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '20px', color: '#1e293b', lineHeight: '1.5' }}>
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
            
            <div style={{ marginTop: '48px' }}>
              <button className="start-btn" onClick={handleStart}>
                Acknowledge & Begin <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
