import React from 'react';
import { ArrowLeft, BookOpen, Hand, Ruler, Eye, Activity, MapPin, Bus, ArrowRightLeft, Gamepad2 } from 'lucide-react';
import './Chapter5Flow.css';

const LABS = [
  { key: "intro", id: "sci6-ch5-intro", n: "Intro", title: "Deepa's Measuring Muddle", sub: "A char angula, a tailor's tape and a shopkeeper's rod \u2014 what do they have in common with a geometry-box scale?", tag: "Pages 79\u201380", icon: <BookOpen size={24} color="#7C9EFF" />, accent: "#7C9EFF", group: "journey" },
  { key: "51", id: "sci6-ch5-activity-5-1", n: "5.1", title: "How do we Measure?", sub: "Five friends, five handspans, one table \u2014 measure with your own balisht and see why the counts never quite agree.", tag: "Activity 5.1", icon: <Hand size={24} color="#5CE1B9" />, accent: "#5CE1B9", group: "journey" },
  { key: "52", id: "sci6-ch5-activity-5-2", n: "5.2", title: "Standard Units", sub: "Slide along a live metre scale and watch km, m, cm and mm snap into place \u2014 1 km = 1000 m = 100000 cm.", tag: "Activity 5.2", icon: <Ruler size={24} color="#FFC24D" />, accent: "#FFC24D", group: "journey" },
  { key: "53", id: "sci6-ch5-activity-5-3", n: "5.3", title: "Correct Way of Measuring", sub: "Line up your eye at point B, not A or C \u2014 plus the trick for reading a scale with a broken, worn-off zero.", tag: "Activity 5.3", icon: <Eye size={24} color="#5D9BF0" />, accent: "#5D9BF0", group: "journey" },
  { key: "54", id: "sci6-ch5-activity-5-4", n: "5.4", title: "Finding Length of a Curve", sub: "String lights along a curved archway \u2014 trace it with a thread, then straighten the thread against a scale.", tag: "Activity 5.4", icon: <Activity size={24} color="#FF7A6E" />, accent: "#FF7A6E", group: "journey" },
  { key: "55", id: "sci6-ch5-activity-5-5", n: "5.5", title: "Describing Position", sub: "School or garden \u2014 which is closer? It depends entirely on the reference point you measure distance from.", tag: "Activity 5.5", icon: <MapPin size={24} color="#7C9EFF" />, accent: "#7C9EFF", group: "journey" },
  { key: "56", id: "sci6-ch5-activity-5-6", n: "5.6", title: "Moving Things", sub: "Are the bus passengers moving or still? Sort objects into rest and motion, and justify each call you make.", tag: "Activity 5.6", icon: <Bus size={24} color="#5CE1B9" />, accent: "#5CE1B9", group: "journey" },
  { key: "57", id: "sci6-ch5-activity-5-7", n: "5.7", title: "Types of Motion", sub: "Drop an eraser, whirl one on a thread, let a swing rock free \u2014 spot linear, circular and oscillatory motion.", tag: "Activity 5.7", icon: <ArrowRightLeft size={24} color="#FFC24D" />, accent: "#FFC24D", group: "journey" },
  { key: "fun", id: "sci6-ch5-section-5-8", n: "Fun", title: "Rollercoaster Challenge", sub: "A ball rolls from A to F \u2014 map every straight, looped and swinging stretch of track to its type of motion.", tag: "Section 5.8", icon: <Gamepad2 size={24} color="#FF7A6E" />, accent: "#FF7A6E", group: "journey" }
];

export default function Chapter5Flow({ onBackToDashboard, onLaunchActivity }) {
  return (
    <div className="chapter5-dashboard-wrapper">
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
            <div className="kick">GRADE 6 · SCIENCE · CHAPTER 5</div>
            <h1>Measurement of Length and Motion</h1>
            <p>
              The whole chapter as hands-on physics labs &mdash; page by page, activity by activity. Every simulation runs on live-computed physics: a scale you can slide and sight along, handspans that vary person to person, a thread that traces a curve, and objects that drift, spin or swing about a reference point. Pick a lab below, or continue where you left off.
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

      </div>
    </div>
  );
}
