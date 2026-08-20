import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Target, Lightbulb, Book, MapPin, Link2, BarChart3, Building2, Compass, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import India from '@svg-maps/india';
import ChapterBackFooter from '../ChapterBackFooter';
import { ScrollableWithNav } from '../ContentScrollNav';

const IndiaMapSilhouette = () => (
  <svg viewBox={India.viewBox} width="48" height="48" style={{ filter: 'drop-shadow(0 4px 6px rgba(124, 92, 255, 0.2))' }}>
    {India.locations.map(location => (
      <path key={location.id} d={location.path} fill="var(--violet)" />
    ))}
  </svg>
);

const SchoolVector = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="90" rx="45" ry="8" fill="#a7d1a2" />
    <rect x="25" y="40" width="50" height="50" fill="#e6a87c" />
    <rect x="35" y="30" width="30" height="15" fill="#c48a60" />
    <polygon points="50,15 25,30 75,30" fill="#cd6b5c" />
    <rect x="42" y="65" width="16" height="25" fill="#8c5840" />
    <rect x="30" y="50" width="10" height="10" fill="#8ed1fc" />
    <rect x="60" y="50" width="10" height="10" fill="#8ed1fc" />
    <circle cx="50" cy="24" r="5" fill="#f4d03f" />
    <line x1="50" y1="15" x2="50" y2="5" stroke="#7f8c8d" strokeWidth="2" />
    <polygon points="50,5 65,10 50,15" fill="#e74c3c" />
  </svg>
);

const HouseVector = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="90" rx="40" ry="8" fill="#a7d1a2" />
    <rect x="25" y="45" width="50" height="45" fill="#f5d693" />
    <polygon points="50,20 15,45 85,45" fill="#e07a5f" />
    <rect x="40" y="65" width="16" height="25" fill="#a07a60" />
    <rect x="62" y="55" width="10" height="12" fill="#8ed1fc" />
    <rect x="28" y="55" width="10" height="12" fill="#8ed1fc" />
  </svg>
);

export default function DistanceAndScale({ onComplete, onBack }) {
  // State for new guided activity
  const [selectedDistance, setSelectedDistance] = useState(4);
  const [isCalculated, setIsCalculated] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState(null); // 'correct', 'incorrect', or null
  const [subpage, setSubpage] = useState('measure');
  const [rightPage, setRightPage] = useState(1);
  const [leftPage, setLeftPage] = useState(1);

  const realDistance = selectedDistance * 500;

  return (
    <div className="distance-scale-container">
      <style>{`
        .distance-scale-container {
          --navy: #78350F; --ink: #3D2E24; --mut: #92400E; --card: #FFF9F0; --cardline: #F2DFBC;
          --amber: #D97706; --blue: #2563EB; --green: #16A34A; --violet: #7C3AED;
          --paper1: #FFF9F0; --paper2: #FBF3E3;
          --serif: "Fraunces", Georgia, serif; --mono: "Space Grotesk", sans-serif; --geo: "Space Grotesk", system-ui, sans-serif;
          
          font-family: var(--geo);
          color: var(--ink);
          height: 100%;
          display: flex;
          flex-direction: column;
          min-height: 650px;
          box-sizing: border-box;
          border-radius: 16px;
          background: linear-gradient(160deg, #F7F1E2 0%, #EFE6D2 100%);
        }
        
        .distance-scale-container * {
          box-sizing: border-box;
        }

        .ds-spread {
          flex: 1; display: grid; grid-template-columns: 0.92fr 1.08fr; border-radius: 16px; overflow: hidden; position: relative;
          border: 2px solid #F2DFBC; box-shadow: 0 8px 30px rgba(60,40,20,0.06);
          background: #EFE6D2;
        }
        .ds-spread::after { content:""; position:absolute; left:47%; top:0; bottom:0; width:2px; background: #F2DFBC; z-index:3; }
        .ds-ribbon { position:absolute; top:-6px; left:44%; width:20px; height:64px; background:#D97706; z-index:4; border-radius:0 0 3px 3px; }
        
        .ds-left { background:linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%); padding:clamp(12px,1.5vw,20px); display:flex; flex-direction:column; min-height:0; overflow:hidden; }
        .ds-eyebrow { font-family:var(--geo); font-size:clamp(12px,0.85vw,13px); letter-spacing:.1em; text-transform:uppercase; color:var(--amber); font-weight:800; margin-bottom: 0; }
        .ds-h1 { font-family:var(--serif); font-weight:900; color:var(--navy); font-size:clamp(26px,3.2vw,44px); line-height:1; margin:2px 0; }
        .ds-sub { font-family:var(--serif); font-style:italic; color:#92400E; font-size:clamp(14px,1.5vw,18px); margin-bottom:clamp(6px,1vw,10px); }
        .ds-left p { font-size:14px; line-height:1.45; color:var(--ink); margin-bottom:8px; margin-top:0; font-weight:600; }
        .ds-left p b { color:var(--navy); font-weight:800; }
        
        .ds-comp { display:flex; gap:8px; margin:4px 0 14px; flex-wrap:wrap; }
        .ds-comp span { cursor: pointer; font-family:var(--geo); font-size: 13.5px; font-weight:700; padding:6px 14px; border-radius:8px; border:1.5px solid #F2DFBC; background:#FFF9F0; color:#92400E; user-select: none; }
        .ds-comp span.ds-on { background:#92400E; color:#fff; border-color:#92400E; }
        
        .ds-scaleex { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:6px 0 14px; }
        .ds-scaleex .ds-e { background:#FFFFFF; border:1.5px solid #F2DFBC; border-radius:10px; padding:11px 13px; }
        .ds-scaleex .ds-e .ds-k { font-family:var(--geo); font-size: 12px; letter-spacing:.06em; color:#92400E; text-transform:uppercase; margin-bottom:0; font-weight:800; }
        .ds-scaleex .ds-e .ds-v { font-weight:800; color:var(--navy); font-size:clamp(14px,1.6vw,18px); margin-top:3px; margin-bottom:0; }
        
        .ds-dyk { margin-top:auto; background:#FEF3C7; border:1.5px solid #FDE68A; border-left:5px solid var(--amber); border-radius:10px; padding:clamp(12px,1.6vw,18px); }
        .ds-dyk h4 { display:flex; gap:7px; align-items:center; color:#92400E; font-weight:800; font-size: 14px; margin-bottom:5px; margin-top:0; }
        .ds-dyk p { color:#78350F; font-size: 13.5px; line-height:1.45; margin:0; font-weight:600; }
        
        .ds-right { background:linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%); padding:clamp(18px,2.4vw,36px); display:flex; flex-direction:column; min-height:0; position:relative; border-left:2px solid #F2DFBC; }
        .ds-rlabel { display:flex; align-items:center; gap:8px; color:var(--navy); font-family:var(--serif); font-weight:900; font-size:clamp(22px,2.5vw,28px); margin-bottom: 4px; }
        .ds-rsub { font-size: 13.5px; color: var(--mut); margin-bottom: 12px; font-weight: 600; }
        
        .ds-scroll { flex:1; min-height:0; overflow:hidden; padding-right:12px; display:flex; flex-direction:column; gap:20px; position: relative; }
        .ds-scroll::-webkit-scrollbar { width:6px; }
        .ds-scroll::-webkit-scrollbar-thumb { background:#F2DFBC; border-radius:3px; }

        .ds-step-card {
          background: #FFFFFF;
          border: 1.5px solid #F2DFBC;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(60,40,20,0.03);
        }
        
        .ds-step-title {
          font-family: var(--geo);
          font-weight: 800;
          font-size: 14px;
          color: var(--navy);
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          flex-direction: column;
        }
        .ds-step-title-num {
          font-family: var(--geo);
          font-size: 12px;
          color: var(--amber);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
          font-weight: 800;
        }

        .ds-step1-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
        }
        .ds-step1-badge {
          background: var(--blue);
          color: #fff;
          font-family: var(--geo);
          font-weight: 900;
          font-size: 24px;
          padding: 12px 32px;
          border-radius: 999px;
          box-shadow: 0 6px 16px rgba(47,109,240,0.25);
        }
        .ds-step1-desc {
          font-size: 14px;
          color: var(--ink);
          line-height: 1.5;
          max-width: 280px;
          margin: 0;
        }

        .ds-step2-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .ds-seg-group {
          display: flex;
          gap: 12px;
          width: 100%;
        }
        .ds-seg-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          border-radius: 12px;
          border: 1.5px solid var(--cardline);
          background: #FFF9F0;
          cursor: pointer;
          font-family: var(--geo);
          font-size: 14px;
          font-weight: 800;
          color: #78350F;
          transition: all 0.2s;
        }
        .ds-seg-btn.ds-seg-active {
          border-color: var(--amber);
          background: #FEF3C7;
          color: #92400E;
        }
        .ds-seg-circle {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid currentColor;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ds-seg-btn.ds-seg-active .ds-seg-circle::after {
          content: '';
          width: 8px;
          height: 8px;
          background: currentColor;
          border-radius: 50%;
        }

        .ds-calc-box {
          background: #FFF9F0;
          border: 1.5px solid #F2DFBC;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .ds-calc-row {
          display: flex;
          align-items: center;
          gap: 16px;
          font-family: var(--geo);
          font-size: 20px;
          font-weight: 800;
          color: var(--navy);
        }
        .ds-calc-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .ds-calc-label {
          font-family: var(--geo);
          font-size: 12px;
          color: var(--mut);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 800;
        }
        .ds-calc-val {
          background: #FFFFFF;
          padding: 6px 16px;
          border-radius: 8px;
          border: 1.5px solid #F2DFBC;
          color: var(--navy);
          font-weight: 800;
        }
        .ds-calc-val-q {
          background: var(--amber);
          color: #fff;
          border: none;
          font-weight: 800;
        }

        .ds-primary-btn {
          background: var(--amber);
          color: #fff;
          font-family: var(--geo);
          font-weight: 800;
          font-size: 14px;
          padding: 14px 32px;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(217,119,6,0.3);
          transition: all 0.2s;
          width: 100%;
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .ds-primary-btn:hover {
          background: #B45309;
          color: #fff;
          transform: scale(1.02);
        }
        .ds-primary-btn:active {
          transform: scale(0.98);
        }

        .ds-result-card {
          background: #DCFCE7;
          border: 1.5px solid #86EFAC;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: ds-fade 0.4s ease-out;
        }
        @keyframes ds-fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .ds-res-title {
          color: #166534;
          font-size: 22px;
          font-weight: 900;
          margin: 8px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ds-res-text {
          font-size: 14px;
          color: var(--ink);
          margin-bottom: 12px;
          font-weight: 600;
        }
        .ds-res-big {
          font-size: 32px;
          font-weight: 900;
          color: #166534;
          background: #fff;
          padding: 8px 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(22,101,52,0.1);
          border: 1.5px solid #86EFAC;
        }
        
        .ds-res-comp {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1.5px solid #86EFAC;
        }
        
        .ds-rem-card {
          background: #FEF3C7;
          border: 1.5px solid #FDE68A;
          border-radius: 12px;
          padding: 16px;
        }
        .ds-rem-title {
          font-family: var(--geo);
          font-weight: 800;
          font-size: 14px;
          color: #92400E;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ds-rem-list {
          margin: 0;
          padding-left: 20px;
          color: var(--ink);
          font-size: 13.5px;
          line-height: 1.5;
          font-weight: 600;
        }

        .ds-chal-btn {
          background: #fff;
          border: 2px solid var(--cardline);
          border-radius: 12px;
          padding: 12px;
          font-family: var(--geo);
          font-weight: 800;
          font-size: 14px;
          color: var(--navy);
          cursor: pointer;
          flex: 1;
          transition: all 0.2s;
        }
        .ds-chal-btn:hover { border-color: var(--blue); color: var(--blue); }
        .ds-chal-correct { background: var(--green); border-color: var(--green); color: #fff; pointer-events: none; }
        .ds-chal-incorrect { background: #fee2e2; border-color: #ef4444; color: #ef4444; pointer-events: none; }
        
        .ds-next-act {
          position: sticky;
          bottom: 0;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-top: 16px;
          padding-bottom: 16px;
          background: linear-gradient(to top, #FFF9F0 80%, transparent);
          z-index: 10;
        }
        
        .ds-nav-btn {
          font-family: var(--geo); font-weight: 700; border: none; cursor: pointer;
          background: var(--amber); color: #fff; padding: 12px 24px; border-radius: 999px; font-size: 14px; transition: all .2s;
          box-shadow: 0 4px 15px rgba(245, 166, 35, 0.4);
        }
        .ds-nav-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 166, 35, 0.5);
        }
        .ds-complete-btn {
          font-family: var(--geo); font-weight: 700; border: none; cursor: pointer;
          background: var(--green); color: #fff; padding: 12px 24px; border-radius: 999px; font-size: 14px; transition: all .2s;
          box-shadow: 0 4px 15px rgba(18, 161, 95, 0.4);
        }
        .ds-complete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(18, 161, 95, 0.5);
        }

        /* NEW LEFT PANEL STYLES */
        .ds-left-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
          gap: clamp(6px, 1vh, 12px);
        }

        .ds-left-section {
          display: flex;
          flex-direction: column;
        }
        
        .ds-s1-header {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .ds-s2-what {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .ds-s3-visual {
          flex: 1;
          min-height: 0;
          position: relative;
          background-color: #FFF9F0;
          background-image: 
            linear-gradient(#F2DFBC 1px, transparent 1px),
            linear-gradient(90deg, #F2DFBC 1px, transparent 1px);
          background-size: 20px 20px;
          border: 1.5px solid #F2DFBC;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          overflow: hidden;
        }
        
        .ds-s4-examples {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .ds-section-heading {
          font-family: var(--geo);
          font-weight: 800;
          font-size: clamp(14px, 1.3vw, 15px);
          margin: 0 0 6px 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .ds-h-blue { color: var(--blue); }
        .ds-h-purple { color: var(--violet); }
        .ds-h-green { color: var(--green); }
        
        /* What is Scale Blocks */
        .ds-what-blocks {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          justify-content: space-between;
        }
        .ds-what-block {
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 6px;
        }
        .ds-what-icon {
          color: var(--amber);
          flex-shrink: 0;
          margin-top: 1px;
        }
        .ds-what-text {
          font-family: var(--geo);
          font-size: 14px;
          font-weight: 600;
          color: var(--ink);
          line-height: 1.3;
          margin: 0;
        }

        /* Main Visual Redesign */
        .ds-rw-zone {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        
        .ds-zone-badge {
          background: var(--navy);
          color: #fff;
          font-family: var(--geo);
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.08em;
          padding: 4px 14px;
          border-radius: 999px;
          text-transform: uppercase;
          box-shadow: 0 4px 10px rgba(120,53,15,0.2);
          margin-bottom: 8px;
        }
        
        .ds-zone-badge-green {
          background: var(--green);
          box-shadow: 0 4px 10px rgba(22,163,74,0.2);
        }

        .ds-scene {
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          position: relative;
        }

        .ds-ruler-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 12px;
          position: relative;
        }

        .ds-ruler {
          width: 90%;
          height: 2.5px;
          background: var(--amber);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ds-ruler::before, .ds-ruler::after {
          content: "";
          position: absolute;
          border-style: solid;
          border-width: 4px 6px;
          top: -3px;
        }
        
        .ds-ruler::before { left: -4px; border-color: transparent var(--amber) transparent transparent; }
        .ds-ruler::after { right: -4px; border-color: transparent transparent transparent var(--amber); }

        .ds-ruler-map { background: var(--green); }
        .ds-ruler-map::before { border-color: transparent var(--green) transparent transparent; }
        .ds-ruler-map::after { border-color: transparent transparent transparent var(--green); }

        .ds-ruler-label {
          background: #FFF9F0;
          border: 1.5px solid var(--amber);
          color: var(--navy);
          font-family: var(--geo);
          font-weight: 800;
          font-size: 13.5px;
          padding: 2px 10px;
          border-radius: 999px;
          position: absolute;
          top: -10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }
        
        .ds-ruler-label-map {
          border-color: var(--green);
          color: var(--green);
          top: auto;
          bottom: -14px;
        }

        .ds-scale-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin: 6px 0;
          z-index: 3;
        }
        
        .ds-hero-badge {
          background: var(--amber);
          color: #fff;
          font-family: var(--geo);
          font-weight: 900;
          font-size: clamp(18px, 2.5vw, 24px);
          padding: 8px 32px;
          border-radius: 999px;
          box-shadow: 0 6px 20px rgba(217,119,6,0.3);
        }
        
        .ds-hero-caption {
          font-family: var(--geo);
          font-size: 13px;
          color: var(--mut);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 800;
        }

        .ds-callout {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(255, 249, 240, 0.95);
          backdrop-filter: blur(4px);
          border: 1.5px solid #F2DFBC;
          border-radius: 8px;
          padding: 6px 10px;
          box-shadow: 0 4px 12px rgba(60,40,20,0.05);
          max-width: 135px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          z-index: 4;
        }
        
        .ds-callout-title {
          font-size: 13px;
          font-weight: 800;
          color: var(--amber);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .ds-callout-text {
          font-family: var(--geo);
          font-size: 13px;
          font-weight: 600;
          color: var(--ink);
          line-height: 1.3;
          margin: 0;
        }
        
        /* Examples */
        .ds-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .ds-card {
          background: #FFFFFF;
          border: 1.5px solid #F2DFBC;
          border-radius: 10px;
          padding: 8px 12px;
          box-shadow: 0 2px 8px rgba(60,40,20,0.03);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ds-card-icon {
          flex: 0 0 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ds-card-content {
          flex: 1;
        }
        .ds-card-title {
          font-family: var(--geo);
          font-weight: 800;
          font-size: 14px;
          color: var(--violet);
          margin-bottom: 1px;
        }
        .ds-card-val {
          font-family: var(--geo);
          font-weight: 900;
          font-size: clamp(14px, 1.4vw, 16px);
          color: var(--navy);
          margin-bottom: 1px;
        }
        .ds-card-cap {
          font-size: 14px;
          color: var(--mut);
          line-height: 1.15;
        }

        @media (max-aspect-ratio:1/1), (max-width:900px) {
          .ds-spread { grid-template-columns:1fr; }
          .ds-spread::after { display:none; }
          .ds-left { min-height:auto; }
          .ds-cards-grid { grid-template-columns: 1fr; }
          .ds-what-blocks { flex-direction: column; gap: 12px; }
          .ds-what-block { flex-direction: row; align-items: center; }
        }
      `}</style>

      {subpage === 'measure' ? (
        <div className="ds-spread" style={{ flex: 1, minHeight: 0 }}>
          <div className="ds-ribbon"></div>

          {/* LEFT · concept */}
          <div className="ds-left">
            <div className="ds-left-layout">

              {/* Section 1: Header */}
              <div className="ds-s1-header">
                <div className="ds-eyebrow">Chapter 1 · Distance &amp; Scale</div>
                <h1 className="ds-h1">Shrinking the World</h1>
                <div className="ds-sub">How a huge place fits on paper</div>
              </div>

              {leftPage === 1 && (
                <>
                  {/* Section 2: What is Scale? */}
                  <div className="ds-s2-what">
                    <h3 className="ds-section-heading ds-h-blue">
                      <Map size={20} strokeWidth={2.5} /> What is Scale?
                    </h3>
                    <div className="ds-what-blocks">
                      <div className="ds-what-block">
                        <Map className="ds-what-icon" size={24} strokeWidth={2.5} />
                        <p className="ds-what-text">Maps are smaller than the real world.</p>
                      </div>
                      <div className="ds-what-block">
                        <Target className="ds-what-icon" size={24} strokeWidth={2.5} />
                        <p className="ds-what-text">Scale tells us how much the real world has been reduced.</p>
                      </div>
                      <div className="ds-what-block">
                        <Lightbulb className="ds-what-icon" size={24} strokeWidth={2.5} />
                        <p className="ds-what-text">The same length on two maps can represent different real distances.</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Main Visual */}
                  <div className="ds-s3-visual">
                    <div style={{ position: 'absolute', opacity: 0.04, right: '-30px', top: '-30px', pointerEvents: 'none' }}>
                      <Compass size={180} />
                    </div>

                    <div style={{ position: 'absolute', top: '20%', bottom: '20%', width: '1px', background: 'rgba(47,109,240,0.2)', zIndex: 1, left: '50%', transform: 'translateX(-50%)' }}></div>

                    {/* Zone 1: Real World */}
                    <div className="ds-rw-zone">
                      <div className="ds-zone-badge">Real World</div>
                      <div className="ds-scene">
                        <SchoolVector size={72} />
                        <div className="ds-ruler-container">
                          <div className="ds-ruler">
                            <div className="ds-ruler-label">500 metres</div>
                          </div>
                        </div>
                        <HouseVector size={72} />
                      </div>
                    </div>

                    {/* Zone 2: Scale Badge */}
                    <div className="ds-scale-hero">
                      <div className="ds-hero-badge">1 cm = 500 m</div>
                      <div className="ds-hero-caption">Map Scale</div>
                    </div>

                    {/* Zone 3: Map */}
                    <div className="ds-rw-zone" style={{ width: '35%' }}>
                      <div className="ds-zone-badge ds-zone-badge-green">Map</div>
                      <div className="ds-scene">
                        <SchoolVector size={32} />
                        <div className="ds-ruler-container">
                          <div className="ds-ruler ds-ruler-map">
                            <div className="ds-ruler-label ds-ruler-label-map">1 cm</div>
                          </div>
                        </div>
                        <HouseVector size={32} />
                      </div>
                    </div>

                    {/* Remember Callout */}
                    <div className="ds-callout">
                      <div className="ds-callout-title">
                        <Lightbulb size={10} strokeWidth={3} /> Remember
                      </div>
                      <p className="ds-callout-text">Maps are smaller, but the scale tells us the real distance.</p>
                    </div>
                  </div>
                </>
              )}

              {leftPage === 2 && (
                <>
                  {/* Section 4: Examples */}
                  <div className="ds-s4-examples" style={{ flex: 1 }}>
                    <h3 className="ds-section-heading ds-h-purple">
                      <Book size={20} strokeWidth={2.5} /> Examples
                    </h3>
                    <div className="ds-cards-grid">
                      <div className="ds-card">
                        <div className="ds-card-icon">
                          <Building2 size={40} color="var(--amber)" strokeWidth={1.5} />
                        </div>
                        <div className="ds-card-content">
                          <div className="ds-card-title">Town Map</div>
                          <div className="ds-card-val">1 cm = 500 m</div>
                          <div className="ds-card-cap">Shows a small area.</div>
                        </div>
                      </div>
                      <div className="ds-card">
                        <div className="ds-card-icon">
                          <IndiaMapSilhouette />
                        </div>
                        <div className="ds-card-content">
                          <div className="ds-card-title">India Map</div>
                          <div className="ds-card-val">2.5 cm = 500 km</div>
                          <div className="ds-card-cap">Shows a much larger area.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Did You Know */}
                  <div className="ds-dyk">
                    <h4><Lightbulb size={16} strokeWidth={2.5} /> Did You Know?</h4>
                    <p>A map of your school uses a large scale (like 1 cm = 10 m), while a map of the whole country uses a small scale (like 1 cm = 100 km).</p>
                  </div>
                </>
              )}

              {/* Left Page Navigation */}
              <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #d8c8a4', paddingTop: '6px', marginTop: '6px' }}>
                <button
                  onClick={() => setLeftPage(1)}
                  disabled={leftPage === 1}
                  style={{
                    fontFamily: 'var(--geo)', fontWeight: 700, fontSize: '12px',
                    background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '999px',
                    padding: '4px 12px', cursor: leftPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: leftPage === 1 ? 0.35 : 1
                  }}
                >
                  ◀ Prev
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: '#8a6a3a' }}>
                  <span>Page {leftPage} of 2</span>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: leftPage === 1 ? 'var(--navy)' : '#d8c8a4' }} />
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: leftPage === 2 ? 'var(--navy)' : '#d8c8a4' }} />
                </div>
                <button
                  onClick={() => setLeftPage(2)}
                  disabled={leftPage === 2}
                  style={{
                    fontFamily: 'var(--geo)', fontWeight: 700, fontSize: '12px',
                    background: '#F59E0B', color: '#fff', border: 'none', borderRadius: '999px',
                    padding: '4px 12px', cursor: leftPage === 2 ? 'not-allowed' : 'pointer',
                    opacity: leftPage === 2 ? 0.35 : 1
                  }}
                >
                  Next ▶
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT · guided activity */}
          <div className="ds-right">
            <div className="ds-rlabel">📏 Let's Explore — Measure the Real Distance</div>
            <div className="ds-rsub">Let's find the real distance using the map scale.</div>

            <div className="ds-scroll">

              {/* Step 1: Know the Scale */}
              {rightPage === 1 && (
                <div className="ds-step-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="ds-step-title">
                    <span className="ds-step-title-num">Step 1</span>
                    Know the Scale
                  </div>
                  <div className="ds-step1-content">
                    <div className="ds-step1-badge">1 cm = 500 m</div>
                    <p className="ds-step1-desc">
                      <MapPin size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px', color: 'var(--amber)' }} />
                      This means that every 1 cm on the map represents 500 metres in the real world.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Measure the Road */}
              {rightPage === 2 && (
                <div className="ds-step-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="ds-step-title">
                    <div className="ds-step-title-num">Step 2</div>
                    <div>Measure the Road</div>
                  </div>
                  <div className="ds-step2-content">
                    <div className="ds-scene" style={{ width: `${selectedDistance * 15}%`, minWidth: '120px', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)', margin: '0 auto', marginBottom: '8px' }}>
                      <SchoolVector size={40} />
                      <div className="ds-ruler-container" style={{ paddingBottom: '12px' }}>
                        <div className="ds-ruler ds-ruler-map" style={{ width: '100%' }}>
                          <div className="ds-ruler-label ds-ruler-label-map">{selectedDistance} cm</div>
                        </div>
                      </div>
                      <HouseVector size={40} />
                    </div>

                    <div className="ds-seg-group">
                      {[2, 4, 6].map(val => (
                        <button
                          key={val}
                          className={`ds-seg-btn ${selectedDistance === val ? 'ds-seg-active' : ''}`}
                          onClick={() => {
                            setSelectedDistance(val);
                            setIsCalculated(false);
                          }}
                        >
                          <div className="ds-seg-circle"></div>
                          {val} cm
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Calculate */}
              {rightPage === 3 && (
                <div className="ds-step-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="ds-step-title">
                    <span className="ds-step-title-num">Step 3</span>
                    Let's Calculate
                  </div>

                  <div className="ds-calc-box">
                    <div className="ds-calc-row">
                      <div className="ds-calc-item">
                        <span className="ds-calc-label">Map Distance</span>
                        <span className="ds-calc-val">{selectedDistance} cm</span>
                      </div>
                      <div>×</div>
                      <div className="ds-calc-item">
                        <span className="ds-calc-label">Scale</span>
                        <span className="ds-calc-val">500 m</span>
                      </div>
                      <div>=</div>
                      <div className="ds-calc-item">
                        <span className="ds-calc-label">Real Distance</span>
                        <span className="ds-calc-val ds-calc-val-q">?</span>
                      </div>
                    </div>
                  </div>

                  {!isCalculated && (
                    <button
                      className="ds-primary-btn"
                      onClick={() => {
                        setIsCalculated(true);
                        setRightPage(4);
                      }}
                    >
                      Find the Real Distance
                    </button>
                  )}
                </div>
              )}

              {/* Step 4: Result */}
              {rightPage === 4 && isCalculated && (
                <div className="ds-result-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="ds-res-text"><b>{selectedDistance} cm</b> on the map represents</div>
                  <div className="ds-res-big">{realDistance.toLocaleString()} metres</div>
                  <div className="ds-res-text" style={{ marginTop: '12px', marginBottom: 0 }}>in the real world.</div>

                  <div className="ds-res-comp">
                    <div className="ds-scene">
                      <SchoolVector size={30} />
                      <div className="ds-ruler-container" style={{ paddingBottom: '12px' }}>
                        <div className="ds-ruler ds-ruler-map" style={{ width: '40%' }}>
                          <div className="ds-ruler-label ds-ruler-label-map">{selectedDistance} cm</div>
                        </div>
                      </div>
                      <HouseVector size={30} />
                    </div>
                    <div style={{ textAlign: 'center', color: 'var(--green)', fontSize: '14px' }}>↓</div>
                    <div className="ds-scene">
                      <SchoolVector size={50} />
                      <div className="ds-ruler-container" style={{ paddingBottom: '12px' }}>
                        <div className="ds-ruler" style={{ width: '90%' }}>
                          <div className="ds-ruler-label">{realDistance.toLocaleString()} metres</div>
                        </div>
                      </div>
                      <HouseVector size={50} />
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-page navigation */}
              <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: 'auto' }}>
                <button
                  onClick={() => setRightPage(p => Math.max(1, p - 1))}
                  disabled={rightPage === 1}
                  style={{
                    fontFamily: 'var(--geo)', fontWeight: 700, fontSize: '12px',
                    background: '#0E3556', color: '#fff', border: 'none', borderRadius: '999px',
                    padding: '5px 12px', cursor: rightPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: rightPage === 1 ? 0.35 : 1
                  }}
                >
                  ◀ Prev
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#5c6b7a' }}>
                  <span>Step {rightPage} of {isCalculated ? 4 : 3}</span>
                </div>
                <button
                  onClick={() => {
                    const maxPage = isCalculated ? 4 : 3;
                    setRightPage(p => Math.min(maxPage, p + 1));
                  }}
                  disabled={rightPage === (isCalculated ? 4 : 3)}
                  style={{
                    fontFamily: 'var(--geo)', fontWeight: 700, fontSize: '12px',
                    background: '#F59E0B', color: '#fff', border: 'none', borderRadius: '999px',
                    padding: '5px 12px', cursor: rightPage === (isCalculated ? 4 : 3) ? 'not-allowed' : 'pointer',
                    opacity: rightPage === (isCalculated ? 4 : 3) ? 0.35 : 1
                  }}
                >
                  Next ▶
                </button>
              </div>

            </div>
          </div>
        </div>
      ) : (
        <ScrollableWithNav containerStyle={{ flex: 1, minHeight: 0 }}>
          <TamilNaduSubpage />
        </ScrollableWithNav>
      )}
      <ChapterBackFooter
        onBack={onBack}
        nextLabel={
          subpage === 'measure'
            ? (isCalculated ? 'Real-Life Example' : 'Next')
            : 'Continue to Directions'
        }
        onNext={
          subpage === 'measure'
            ? (isCalculated ? () => setSubpage('tamil-nadu') : onComplete)
            : onComplete
        }
        nextVariant={subpage === 'measure' ? 'blue' : 'navy'}
      />
    </div>
  );
}

const TamilNaduSubpage = () => {
  const [scaleFactor, setScaleFactor] = useState(1);
  const [isDetailedView, setIsDetailedView] = useState(false);

  return (
    <div className="ds-spread">
      <div className="ds-ribbon"></div>

      {/* LEFT SIDE (Book) */}
      <div className="ds-left" style={{ padding: 'clamp(20px, 3vw, 40px)' }}>
        <div className="ds-eyebrow">Chapter 1 • Distance & Scale</div>
        <h2 className="ds-h1" style={{ fontSize: 'clamp(24px, 2.8vw, 36px)', marginTop: '4px' }}>Maps Represent Real Places</h2>
        <div className="ds-sub" style={{ marginBottom: '1.5rem', lineHeight: 1.3 }}>A small map can represent a very large place.</div>



        {/* India Map Illustration / Detailed View */}
        <div style={{ flex: 1, minHeight: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '16px 0 0 0', width: '100%' }}>
          <div style={{ background: '#eaf2f8', borderRadius: '16px', border: '1px solid #d5e3ef', padding: '40px', boxSizing: 'border-box', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>

            <AnimatePresence mode="wait">
              {!isDetailedView ? (
                <motion.div
                  key="india-map"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  style={{ position: 'absolute', height: '100%', aspectRatio: '612 / 696', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  {/* Ocean Labels */}
                  <div style={{ position: 'absolute', top: '58%', left: '-4%', transform: 'rotate(-8deg)', textTransform: 'uppercase', color: '#0ea5e9', opacity: 0.75, letterSpacing: '3px', fontWeight: 700, fontSize: '14px', zIndex: 0 }}>Arabian<br />Sea</div>
                  <div style={{ position: 'absolute', top: '64%', left: '84%', textTransform: 'uppercase', color: '#0ea5e9', opacity: 0.75, letterSpacing: '3px', fontWeight: 700, fontSize: '14px', textAlign: 'center', zIndex: 0 }}>Bay of<br />Bengal</div>
                  <div style={{ position: 'absolute', top: '94%', left: '55%', transform: 'translateX(-50%)', textTransform: 'uppercase', color: '#0ea5e9', opacity: 0.65, letterSpacing: '4px', fontWeight: 700, fontSize: '15px', zIndex: 0 }}>Indian Ocean</div>

                  {/* Blinking Pointer to TN */}
                  <motion.div
                    animate={{ x: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    style={{ position: 'absolute', top: '82%', left: '46%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px', zIndex: 10, pointerEvents: 'none' }}
                  >
                    <svg width="28" height="12" viewBox="0 0 28 12" fill="none">
                      <path d="M28 6L4 6" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="4 3" />
                      <path d="M10 2L4 6L10 10" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div style={{ background: '#e11d48', color: 'white', padding: '6px 12px', borderRadius: '16px', fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 6px 12px rgba(225,29,72,0.3)', whiteSpace: 'nowrap' }}>
                      Click to Explore
                    </div>
                  </motion.div>

                  {/* Map SVG */}
                  <svg viewBox={India.viewBox} style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 10px 20px rgba(14,42,69,0.12))', zIndex: 1, position: 'relative' }}>
                    {India.locations.map(location => (
                      <motion.path
                        key={location.id}
                        d={location.path}
                        fill={location.id === 'tn' ? '#84cc16' : '#ffffff'}
                        stroke={location.id === 'tn' ? '#4d7c0f' : '#cbd5e1'}
                        strokeWidth={location.id === 'tn' ? "2" : "1.2"}
                        style={location.id === 'tn' ? { filter: 'drop-shadow(0 0 8px rgba(132, 204, 22, 0.45))', cursor: 'pointer' } : {}}
                        whileHover={location.id === 'tn' ? { filter: 'brightness(1.08) drop-shadow(0 4px 12px rgba(132, 204, 22, 0.6))' } : {}}
                        onClick={() => location.id === 'tn' && setIsDetailedView(true)}
                      />
                    ))}
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  key="tn-map"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                >
                  {/* Back Button */}
                  <button
                    onClick={() => setIsDetailedView(false)}
                    style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #d5e3ef', padding: '8px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#0f172a', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', zIndex: 10 }}
                  >
                    <span>←</span> Back to India Map
                  </button>

                  <div style={{ position: 'relative', height: '65%', aspectRatio: '87 / 117', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <svg viewBox="168 551 87 117" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 12px rgba(14,42,69,0.08))', zIndex: 1, position: 'relative' }}>
                      {India.locations.map(location => location.id === 'tn' && (
                        <path
                          key={location.id}
                          d={location.path}
                          fill="#ffffff"
                          stroke="#3b82f6"
                          strokeWidth="0.5"
                        />
                      ))}
                    </svg>

                    {/* Chennai Connector Line */}
                    <div style={{ position: 'absolute', top: '12%', left: '83%', width: '5%', height: '1px', borderTop: '1.5px dashed #64748b', zIndex: 2 }} />
                    {/* Kanyakumari Connector Line */}
                    <div style={{ position: 'absolute', top: '98%', left: '35%', width: '53%', height: '1px', borderTop: '1.5px dashed #64748b', zIndex: 2 }} />

                    {/* Measurement Bracket */}
                    <div style={{ position: 'absolute', top: '12%', left: '90%', height: '86%', width: '2px', background: '#3b82f6', zIndex: 3 }} />
                    <div style={{ position: 'absolute', top: '12%', left: '88%', width: '4%', height: '2px', background: '#3b82f6', zIndex: 3 }} />
                    <div style={{ position: 'absolute', top: '98%', left: '88%', width: '4%', height: '2px', background: '#3b82f6', zIndex: 3 }} />

                    {/* Distance Label */}
                    <div style={{ position: 'absolute', top: '55%', left: '90%', transform: 'translate(-50%, -50%)', background: '#ffffff', padding: '8px 24px', borderRadius: '30px', fontSize: '14px', fontWeight: '900', color: '#1d4ed8', border: '2px solid #3b82f6', zIndex: 5, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(37,99,235,0.15)' }}>
                      ≈ 625 km
                    </div>

                    {/* Chennai Marker & Label */}
                    <div style={{ position: 'absolute', top: '12%', left: '81%', transform: 'translate(-50%, -100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 4 }}>
                      <div style={{ background: 'white', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '6px', whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>Chennai</div>
                      <MapPin size={22} color="#e11d48" fill="#fff" strokeWidth={2.5} style={{ filter: 'drop-shadow(0 3px 6px rgba(225,29,72,0.35))' }} />
                    </div>

                    {/* Kanyakumari Marker & Label */}
                    <div style={{ position: 'absolute', top: '98%', left: '33%', transform: 'translate(-50%, -100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 4 }}>
                      <div style={{ background: 'white', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '6px', whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>Kanyakumari</div>
                      <MapPin size={22} color="#e11d48" fill="#fff" strokeWidth={2.5} style={{ filter: 'drop-shadow(0 3px 6px rgba(225,29,72,0.35))' }} />
                    </div>
                  </div>

                  <div style={{ background: 'white', border: '1px solid #d5e3ef', borderRadius: '12px', padding: '16px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', zIndex: 10, marginTop: '24px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: '4px' }}>Real-Life Example</div>
                    <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.4 }}>
                      The straight-line distance between Chennai and Kanyakumari is about 625 km. On a map, this large real-world distance is represented using only a few centimetres because maps are drawn to scale.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (Interactive) */}
      <div className="ds-right" style={{ padding: 'clamp(16px, 2vw, 32px)', display: 'flex', flexDirection: 'column' }}>
        <h2 className="ds-h1" style={{ fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: '4px' }}>Let's Explore — Tamil Nadu on a Map</h2>
        <div style={{ fontSize: '14px', color: '#5c6b7a', marginBottom: '16px' }}>See how a real-world distance becomes much smaller on a map using a scale.</div>

        {/* Example Block */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ background: '#2f6df0', color: '#fff', padding: '4px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Example</span>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#0E3556' }}>Chennai to Kanyakumari</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '12px 16px', borderRadius: '16px', border: '1px solid #e2e8f0', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '28px' }}>🌍</div>
                <div>
                  <div style={{ fontSize: '14px', color: '#5c6b7a', fontWeight: 700, textTransform: 'uppercase' }}>Real-world Distance</div>
                  <div style={{ fontSize: '14px', color: '#475569', marginTop: '2px', lineHeight: 1.3 }}>The approximate straight-line distance between Chennai and Kanyakumari is about 625 km.</div>
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#1e3a8a', whiteSpace: 'nowrap', flexShrink: 0 }}>≈ 625 km</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#2f6df0' }}>
              <ArrowRight size={20} />
              <div style={{ fontSize: '14px', fontWeight: 800, background: '#e0e7ff', padding: '6px 16px', borderRadius: '12px' }}>Example Map Scale: 1 cm = 125 km</div>
              <ArrowRight size={20} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0f9ff', padding: '12px 16px', borderRadius: '16px', border: '1px solid #bae6fd', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '28px' }}>🗺️</div>
                <div>
                  <div style={{ fontSize: '14px', color: '#0369a1', fontWeight: 700, textTransform: 'uppercase' }}>Distance on the Map</div>
                  <div style={{ fontSize: '14px', color: '#0369a1', marginTop: '2px', lineHeight: 1.3 }}>Using the given scale, the real-world distance is represented by a shorter distance on the map.</div>
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#0284c7', whiteSpace: 'nowrap', flexShrink: 0 }}>5 cm</div>
            </div>
          </div>
        </div>

        {/* Remember Block */}
        <div style={{ background: '#ecfdf5', padding: '16px 20px', borderRadius: '16px', border: '1px solid #a7f3d0', flexShrink: 0 }}>
          <h4 style={{ margin: '0 0 6px 0', color: '#059669', fontSize: '14px', fontWeight: 800 }}>Remember</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#065f46', lineHeight: 1.5 }}>
            Maps reduce real-world distances using a scale. Although the map is much smaller than the real world, the distances remain proportional and accurately represent actual locations.
          </p>
        </div>

      </div>
    </div>
  );
};
