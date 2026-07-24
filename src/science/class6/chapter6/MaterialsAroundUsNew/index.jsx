import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './MaterialsAroundUsNew.css';

import p04Image from '../MaterialsAroundUs/images/p04_mb_master_v2.png';
import p05Image from '../MaterialsAroundUs/images/p05_hb_master_v2.png';
import p11Image from '../MaterialsAroundUs/images/p11_cp_master_v3.png';
import chiefBlakePortrait from '../MaterialsAroundUs/images/r1_chief_blake_portrait.png';

const pages = [
  {
    id: 'P04',
    image: p04Image,
    segmentIndex: 0,
    stepText: 'Step 1 of 8',
    dialogue: [
      "Welcome, rookie. We have a new case today. Look around you—everything you see is made of something.",
      "But what exactly is that 'something'?"
    ],
    noteTitle: "DETECTIVE'S NOTE",
    noteContent: [
      "Today we begin with the first step in our journey.",
      "Let's observe the objects around us and discover the materials that make them what they are."
    ],
    bannerText: "Observe carefully, Question everything, Investigate deeply, Understand clearly.",
    cta: "Start Observing"
  },
  {
    id: 'P05',
    image: p05Image,
    segmentIndex: 0,
    stepText: 'Step 2 of 8',
    dialogue: [
      "Great detectives always start with careful observation.",
      "Let's look closely at different materials. What do you notice about their appearance?"
    ],
    noteTitle: "WHAT TO DO",
    noteContent: [
      "• Look at each material carefully.",
      "• Notice their color, shine, texture and shape.",
      "• Think about what makes them different."
    ],
    bannerText: "Good observation is the first step to a great discovery!",
    cta: "Next"
  },
  {
    id: 'P11',
    image: p11Image,
    segmentIndex: 0,
    stepText: 'Step 8 of 8',
    dialogue: [
      "Excellent work, detectives!",
      "You have successfully scanned the room and identified that one object can be made of different materials.",
      "Good detectives always keep clear records!"
    ],
    noteTitle: "DETECTIVE CHECKPOINT",
    noteContent: [
      "✓ I looked around the classroom.",
      "✓ I identified different objects.",
      "✓ I understood that materials make objects."
    ],
    bannerText: "Great detective work! You have recorded your observations.",
    cta: "Proceed to next investigation"
  }
];

const TimelineSegments = [
  { id: '6.1', label: 'Observing Objects Around Us' },
  { id: '6.2', label: 'How to Group Materials?' },
  { id: '6.3.1', label: 'Appearance' },
  { id: '6.3.2', label: 'Hardness' },
  { id: '6.3.3', label: 'Transparency' },
  { id: '6.3.4', label: 'Solubility' },
  { id: '6.3.5', label: 'Mass' },
  { id: '6.3.6', label: 'Space and Volume' },
  { id: '6.4', label: 'What is Matter?' },
  { id: '★', label: 'Final Wrap-up' }
];

export default function MaterialsAroundUsNewActivity({ onBackToDashboard }) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPage = pages[currentPageIndex];

  const handleNext = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Dashboard button clicked!");
    onBackToDashboard();
  };

  return (
    <div className="detective-wrapper">
      <div className="detective-container">
        
        {/* Dashboard Navigation Button */}
        <button 
          className="nav-back-btn" 
          onClick={handleDashboardClick} 
          style={{ position: 'absolute', top: '20px', left: '30px', zIndex: 9999, pointerEvents: 'auto', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} /> DASHBOARD
        </button>

        {/* Background Image */}
        <div 
          className="background-layer"
        style={{ backgroundImage: `url(${currentPage.image})` }}
      />
      
      {/* Top Nav & Timeline (Zone F) */}
      <div className="top-nav">
        
        <div className="timeline-container">
          <div className="timeline-line" />
          
          {TimelineSegments.map((segment, index) => {
            const isCurrent = index === currentPage.segmentIndex;
            return (
              <div key={segment.id} className={`timeline-node ${isCurrent ? 'active' : ''}`}>
                <div className="node-circle">{segment.id}</div>
                <div className="node-label">{segment.label}</div>
              </div>
            );
          })}
        </div>
        <div className="step-indicator">{currentPage.stepText}</div>
      </div>

      {/* Dialogue Box (Zone B) */}
      {currentPage.dialogue && (
        <div className="dialogue-box">
          <div className="portrait-container">
            <img src={chiefBlakePortrait} alt="Chief Blake" className="portrait-img" />
          </div>
          <div className="dialogue-title">Chief Blake</div>
          {currentPage.dialogue.map((line, idx) => (
            <div key={idx} className="dialogue-text">{line}</div>
          ))}
        </div>
      )}

      {/* Paper Note Panel (Zone C / Right Side) */}
      {currentPage.noteTitle && (
        <div className="paper-note" style={{ top: '25%', right: '5%', width: '22%' }}>
          <div className="note-title">{currentPage.noteTitle}</div>
          <div className="note-content">
            {currentPage.noteContent.map((line, idx) => (
              <p key={idx} style={{ marginBottom: '10px' }}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {/* Action Banner (Zone D & E) */}
      {currentPage.bannerText && (
        <div className="action-banner">
          {currentPageIndex > 0 && (
            <button className="action-btn back-btn" onClick={handlePrev} style={{ backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.3)' }}>
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <div className="banner-text">{currentPage.bannerText}</div>
          <button className="action-btn" onClick={handleNext}>
            {currentPage.cta} <ArrowRight size={16} />
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
