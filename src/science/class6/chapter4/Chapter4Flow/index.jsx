import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Compass, 
  Target, 
  Crosshair, 
  Activity, 
  Magnet, 
  Sliders, 
  Car, 
  HelpCircle, 
  GraduationCap 
} from 'lucide-react';
import './Chapter4Flow.css';

const GOLD_COLOR = "#F59E0B";
const GOLD_GLOW = "rgba(245, 158, 11, 0.75)";

const CARDS_DATA = [
  {
    num: "01",
    id: "intro_magnets",
    title: "INTRODUCTION",
    sub: "Reshma's storm & compass",
    color: GOLD_COLOR,
    glow: GOLD_GLOW,
    image: "/ch4_cards/img_1.jpg",
    icon: Target
  },
  {
    num: "02",
    id: "activity_4_1",
    title: "MAGNETIC ITEMS",
    sub: "Predict & test",
    color: GOLD_COLOR,
    glow: GOLD_GLOW,
    image: "/ch4_cards/img_2.jpg",
    icon: Crosshair
  },
  {
    num: "03",
    id: "magnetic_poles",
    title: "POLES OF MAGNET",
    sub: "Iron filings & pole pairs",
    color: GOLD_COLOR,
    glow: GOLD_GLOW,
    image: "/ch4_cards/img_3.jpg",
    icon: Activity
  },
  {
    num: "04",
    id: "suspended_magnet",
    title: "FINDING DIRECTIONS",
    sub: "Hanging magnet N->S",
    color: GOLD_COLOR,
    glow: GOLD_GLOW,
    image: "/ch4_cards/img_4.jpg",
    icon: Compass
  },
  {
    num: "05",
    id: "magnetic_compass",
    title: "MAKE A COMPASS",
    sub: "Float magnetized needle",
    color: GOLD_COLOR,
    glow: GOLD_GLOW,
    image: "/ch4_cards/img_5.jpg",
    icon: Crosshair
  },
  {
    num: "06",
    id: "magnet_interaction",
    title: "ATTRACTION & REPULSION",
    sub: "Unlike attract, like repel",
    color: GOLD_COLOR,
    glow: GOLD_GLOW,
    image: "/ch4_cards/img_6.jpg",
    icon: Magnet
  },
  {
    num: "07",
    id: "activity_4_6",
    title: "COMPASS & MAGNET",
    sub: "Deflect needle live",
    color: GOLD_COLOR,
    glow: GOLD_GLOW,
    image: "/ch4_cards/img_7.jpg",
    icon: Compass
  },
  {
    num: "08",
    id: "activity_4_7",
    title: "THROUGH MATERIALS",
    sub: "Passes through barriers",
    color: GOLD_COLOR,
    glow: GOLD_GLOW,
    image: "/ch4_cards/img_8.jpg",
    icon: Sliders
  },
  {
    num: "09",
    id: "sci6-ch4-sec45-fun-with-magnets",
    title: "FUN WITH MAGNETS",
    sub: "Maze & runaway cars",
    color: GOLD_COLOR,
    glow: GOLD_GLOW,
    image: "/ch4_cards/img_9.jpg",
    icon: Car
  },
  {
    num: "10",
    id: "chapter_4_quiz",
    title: "TEST KNOWLEDGE",
    sub: "20 Questions on Magnets",
    color: GOLD_COLOR,
    glow: GOLD_GLOW,
    image: "/ch4_cards/img_10.jpg",
    icon: HelpCircle
  }
];

export default function Chapter4Flow({ onBackToDashboard, onLaunchActivity }) {
  return (
    <div className="hud-chapter4-wrapper">
      {/* Magnetic Field Vector Lines Background SVG */}
      <svg className="magnetic-lines-bg" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-100 450 C 200 100, 500 100, 720 450 C 940 800, 1240 800, 1540 450" stroke="rgba(37, 99, 235, 0.18)" strokeWidth="3" fill="none" />
        <path d="M-100 450 C 200 180, 500 180, 720 450 C 940 720, 1240 720, 1540 450" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="3" fill="none" />
        <path d="M-100 450 C 200 260, 500 260, 720 450 C 940 640, 1240 640, 1540 450" stroke="rgba(37, 99, 235, 0.14)" strokeWidth="2" fill="none" />
        <path d="M-100 450 C 200 340, 500 340, 720 450 C 940 560, 1240 560, 1540 450" stroke="rgba(239, 68, 68, 0.12)" strokeWidth="2" fill="none" />
        <circle cx="350" cy="450" r="280" stroke="rgba(37, 99, 235, 0.08)" strokeWidth="40" fill="none" />
        <circle cx="1090" cy="450" r="280" stroke="rgba(239, 68, 68, 0.08)" strokeWidth="40" fill="none" />
      </svg>

      <div className="hud-wrap">
        {/* Main 10 Prominent Cards Grid */}
        <div className="hud-grid">
          {CARDS_DATA.map((card, idx) => {
            return (
              <motion.div 
                key={card.id}
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.32, delay: idx * 0.03 }}
                className="hud-card" 
                onClick={() => onLaunchActivity(card.id)}
                style={{ 
                  '--border-color': card.color,
                  '--glow-color': card.glow 
                }}
              >
                {/* Card Header Bar */}
                <div className="hud-card-header">
                  <div className="hud-num-badge" style={{ borderColor: card.color, color: card.color }}>
                    {card.num}
                  </div>
                  <div className="hud-title-box">
                    <h3 className="hud-card-title">{card.title}</h3>
                    <span className="hud-card-sub">{card.sub}</span>
                  </div>
                </div>

                {/* Central 4K Magnet Artwork Thumbnail */}
                <div className="hud-art-container">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="hud-art-img" 
                  />
                  <div className="hud-art-overlay" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Navigation Bar */}
        <div className="hud-bottom-bar">
          <button 
            onClick={onBackToDashboard}
            className="hud-btn hud-btn-back"
          >
            <ArrowLeft size={18} color="#ffffff" />
            <span>BACK TO CLASS 6 WING</span>
          </button>

          <button 
            onClick={() => onLaunchActivity('chapter_4_quiz')}
            className="hud-btn hud-btn-quiz"
          >
            <GraduationCap size={20} color="#ffffff" />
            <span>QUIZ HUB</span>
          </button>
        </div>

      </div>
    </div>
  );
}
