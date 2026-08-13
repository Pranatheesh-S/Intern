import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './Chapter4Flow.css';

const ALL_CARDS = [
  { key: "opening", id: "intro_magnets", n: "Intro", title: "The Opening", sub: "Reshma's storm & compass", tag: "Pages 61–62", icon: "🧲", accent: "#7C9EFF", steps: "7 steps" }, 
  { key: "s41", id: "activity_4_1", n: "4.1", title: "Magnetic Items", sub: "Predict & test Table 4.1", tag: "Act 4.1", icon: "🧲", accent: "#5CE1B9", steps: "7 steps" }, 
  { key: "s42", id: "magnetic_poles", n: "4.2", title: "Poles of Magnet", sub: "Iron filings & pole pairs", tag: "Act 4.2", icon: "⚡", accent: "#FFC24D", steps: "8 steps" }, 
  { key: "s43", id: "suspended_magnet", n: "4.3", title: "Finding Directions", sub: "Hanging magnet N–S", tag: "Act 4.3", icon: "🌍", accent: "#5D9BF0", steps: "7 steps" }, 
  { key: "s44", id: "magnetic_compass", n: "4.4", title: "Make a Compass", sub: "Float magnetized needle", tag: "Act 4.4", icon: "🧭", accent: "#FF7A6E", steps: "7 steps" }, 
  { key: "s45", id: "magnet_interaction", n: "4.5", title: "Attraction & Repulsion", sub: "Unlike attract, like repel", tag: "Act 4.5", icon: "↔️", accent: "#7C9EFF", steps: "6 steps" }, 
  { key: "s46", id: "activity_4_6", n: "4.6", title: "Compass & Magnet", sub: "Deflect needle live", tag: "Act 4.6", icon: "🎯", accent: "#5CE1B9", steps: "6 steps" }, 
  { key: "s47", id: "activity_4_7", n: "4.7", title: "Through Materials", sub: "Passes through barriers", tag: "Act 4.7", icon: "🚧", accent: "#FFC24D", steps: "6 steps" }, 
  { key: "fun", id: "sci6-ch4-sec45-fun-with-magnets", n: "Fun", title: "Fun with Magnets", sub: "Maze & runaway cars", tag: "Sec 4.5", icon: "🎮", accent: "#FF7A6E", steps: "7 steps" }, 
  { key: "quiz", id: "chapter_4_quiz", n: "Quiz", title: "Test Knowledge", sub: "20 Questions on Magnets", tag: "Quiz", icon: "🧠", accent: "#9C27B0", steps: "20 Qs" }
];

export default function Chapter4Flow({ onBackToDashboard, onLaunchActivity }) {
  return (
    <div className="chapter4-dashboard-wrapper">
      <div className="wrap" id="home">
        
        {/* Top Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <button 
            onClick={onBackToDashboard}
            style={{ 
              background: 'transparent', border: '1px solid var(--line)', color: 'var(--ink)', 
              padding: '0.35rem 0.75rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.8rem'
            }}
          >
            <ArrowLeft size={14} /> Back to Class 6 Wing
          </button>
        </div>



        <div className="sechead">
          <h2>Chapter Activities & Assessment</h2>
          <div className="line"></div>
          <div className="count">10 Modules</div>
        </div>
        
        <div className="grid">
          {ALL_CARDS.map(lab => (
            <div 
              key={lab.key} 
              className="card" 
              onClick={() => onLaunchActivity(lab.id)}
              style={{ '--accent': lab.accent }}
            >
              <div className="accentbar" style={{ background: lab.accent }}></div>
              <div className="tagchip">{lab.tag}</div>
              <div className="top">
                <div className="ico">{lab.icon}</div>
                <div>
                  <div className="nchip" style={{ background: lab.accent }}>{lab.n}</div>
                  <h3>{lab.title}</h3>
                  <div className="sub">{lab.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
