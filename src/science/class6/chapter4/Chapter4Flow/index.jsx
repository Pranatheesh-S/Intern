import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import './Chapter4Flow.css';

const LABS = [
  { key: "opening", id: "intro_magnets", n: "Intro", title: "The Opening", sub: "Reshma's storm & the compass mystery", tag: "Pages 61\u201362", icon: "🧲", accent: "#7C9EFF", steps: 7, group: "journey" }, 
  { key: "s41", id: "activity_4_1", n: "4.1", title: "Magnetic & Non-magnetic", sub: "Predict-then-test Table 4.1", tag: "Activity 4.1", icon: "🧲", accent: "#5CE1B9", steps: 7, group: "journey" }, 
  { key: "s42", id: "magnetic_poles", n: "4.2", title: "Poles of Magnet", sub: "Iron filings & poles-in-pairs", tag: "Activity 4.2", icon: "⚡", accent: "#FFC24D", steps: 8, group: "journey" }, 
  { key: "s43", id: "suspended_magnet", n: "4.3", title: "Finding Directions", sub: "A hanging magnet points North\u2013South", tag: "Activity 4.3", icon: "🌍", accent: "#5D9BF0", steps: 7, group: "journey" }, 
  { key: "s44", id: "magnetic_compass", n: "4.4", title: "Make a Compass", sub: "Magnetise & float your own needle", tag: "Activity 4.4", icon: "🧭", accent: "#FF7A6E", steps: 7, group: "journey" }, 
  { key: "s45", id: "magnet_interaction", n: "4.5", title: "Attraction & Repulsion", sub: "Unlike attract, like repel", tag: "Activity 4.5", icon: "↔️", accent: "#7C9EFF", steps: 6, group: "journey" }, 
  { key: "s46", id: "activity_4_6", n: "4.6", title: "Compass & Magnet", sub: "Deflect the needle live", tag: "Activity 4.6", icon: "🎯", accent: "#5CE1B9", steps: 6, group: "journey" }, 
  { key: "s47", id: "activity_4_7", n: "4.7", title: "Through Materials", sub: "Magnetism passes through barriers", tag: "Activity 4.7", icon: "🚧", accent: "#FFC24D", steps: 6, group: "journey" }, 
  { key: "fun", id: "sci6-ch4-sec45-fun-with-magnets", n: "Fun", title: "Fun with Magnets", sub: "Maze, runaway cars & magnet care", tag: "Section 4.5", icon: "🎮", accent: "#FF7A6E", steps: 7, group: "journey" }, 
  { key: "complete", id: "sci6-ch4-exploring-magnets-full", n: "All", title: "Full Chapter \u2014 12 Sections", sub: "The complete page-by-page lab in one flow", tag: "Combined edition", icon: "📖", accent: "#7C9EFF", steps: 12, group: "combined" }, 
  { key: "flagship", id: "sci6-ch4-exploring-magnets-flagship", n: "Flag", title: "Flagship \u2014 9 Steps", sub: "Condensed all-activities flagship build", tag: "Combined edition", icon: "⭐", accent: "#FFC24D", steps: 9, group: "combined" }
];

export default function Chapter4Flow({ onBackToDashboard, onLaunchActivity }) {


  return (
    <div className="chapter4-dashboard-wrapper">
      <div className="wrap" id="home">
        
        {/* Back Button added to integrate with your app navigation */}
        <div style={{ marginBottom: '1rem' }}>
          <button 
            onClick={onBackToDashboard}
            style={{ 
              background: 'transparent', border: '1px solid var(--line)', color: 'var(--ink)', 
              padding: '0.4rem 0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem'
            }}
          >
            <ArrowLeft size={16} /> Back to Class 6 Wing
          </button>
        </div>

        <div className="topbar">
          <div className="logo">Fx</div>
          <div className="brand">
            <b>FuturaX Learning</b>
            <span>Interactive Physics Labs</span>
          </div>
          <div className="spacer"></div>

        </div>

        <div className="hero">
          <div className="htext">
            <div className="kick">GRADE 6 · SCIENCE · CHAPTER 4</div>
            <h1>Exploring Magnets</h1>
            <p>
              The whole chapter as hands-on physics labs &mdash; page by page, activity by activity. Every simulation runs on live-computed physics: real magnetic fields, a settling compass, iron filings that gather at the poles. Pick a lab below, or continue where you left off.
            </p>
            <div className="cta">
              <button className="btn" onClick={() => onLaunchActivity(LABS[0].id)}>Start the journey</button>
            </div>
          </div>

        </div>

        <div className="sechead">
          <h2>The Chapter, Page by Page</h2>
          <div className="line"></div>
          <div className="count">{LABS.filter(l => l.group === 'journey').length} activities</div>
        </div>
        
        <div className="grid">
          {LABS.filter(l => l.group === 'journey').map(lab => (
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

        <div className="sechead" style={{ marginTop: '4rem' }}>
          <h2>Test Your Knowledge</h2>
          <div className="line"></div>
        </div>

        <div className="grid">
          <div 
            className="card" 
            onClick={() => onLaunchActivity('chapter_4_quiz')}
            style={{ '--accent': '#9C27B0' }}
          >
            <div className="accentbar" style={{ background: '#9C27B0' }}></div>
            <div className="tagchip">Assessment</div>
            <div className="top">
              <div className="ico">🧠</div>
              <div>
                <div className="nchip" style={{ background: '#9C27B0' }}>Quiz</div>
                <h3>Test Your Knowledge</h3>
                <div className="sub">20 Questions on Magnets</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
