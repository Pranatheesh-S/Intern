import React, { useState } from 'react';
import { BookOpen, HelpCircle, Check, Award, ArrowLeft, Volume2, VolumeX, ArrowRight, Play } from 'lucide-react';
import sanskritSlogan from '../../assets/sanskrit_slogan.png';
import { useTheme } from '../../ThemeContext.jsx';

export default function IntroductionMindMap({ onBackToDashboard }) {
  const { theme } = useTheme();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleReadAloud = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const lessonSpeechText = `
    Chapter 2, Diversity in the Living World.
    The lesson begins with an exciting nature walk led by Doctor Raghu and Maniram chacha.
    During the walk, the students observe different plants, trees, birds, butterflies, monkeys, and many other living things around them.
    They learn to watch nature carefully, listen to the unique calls of birds, and respect all living creatures without disturbing them.
    Dr Raghu is a researcher, and Maniram chacha is a community elder who mimics bird calls.
  `;

  return (
    <div className="book-container">
      <div className="book-spread">
        
        {/* ============ LEFT PAGE ============ */}
        <div className="book-page-left">
          <div className="textbook-eyebrow">Lesson 2.1 · Class 6 Science</div>
          <h1 className="textbook-title" style={{ fontFamily: 'var(--serif-font)' }}>
            Diversity in the<br />Living World
          </h1>

          {/* Slogan Board Mounted Box */}
          <div style={{
            position: 'relative',
            background: 'var(--paper2)',
            padding: '1rem',
            borderRadius: '12px',
            border: '2px solid var(--cardline)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '1.25rem 0',
            flex: 1,
            minHeight: '260px'
          }}>
            <img 
              src={sanskritSlogan} 
              alt="Sanskrit Slogan" 
              style={{
                width: '100%',
                maxHeight: '220px',
                objectFit: 'contain',
                mixBlendMode: 'multiply',
                borderRadius: '6px'
              }}
            />
            <div style={{ 
              marginTop: '0.75rem', 
              fontSize: '0.75rem', 
              fontFamily: 'var(--mono-font)', 
              color: 'var(--navy)', 
              textAlign: 'center',
              letterSpacing: '0.04em'
            }}>
              Fig 2.1: A Sanskrit Subhashita (wise saying) describing the selfless, giving nature of trees.
            </div>
          </div>

          <div style={{ 
            marginTop: 'auto', 
            fontSize: '0.85rem', 
            lineHeight: '1.6', 
            color: 'var(--ink)', 
            background: '#ffffff',
            borderLeft: '4px solid var(--amber)',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <span style={{ fontWeight: '700', color: 'var(--navy)', display: 'block', marginBottom: '0.25rem' }}>Ecosystem Wisdom</span>
            Noble people, like trees, bear the heat of the sun to provide shade and fruits for others. This traditional Indian verse reminds us of the deep interdependence between humans, plants, and our shared environment.
          </div>
        </div>

        {/* ============ RIGHT PAGE ============ */}
        <div className="book-page-right">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--cardline)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--navy)', fontWeight: '700', fontSize: '18px', fontFamily: 'var(--geo-font)' }}>
              <BookOpen size={20} strokeWidth={2.2} />
              The Nature Walk Begins
            </div>
          </div>

          {/* Scrollable contents */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="hide-scrollbar">
            <div className="textbook-hero">
              <h3>Exploring nature with Dr. Raghu &amp; Maniram chacha</h3>
              <p>The lesson begins with an exciting nature walk in the local area and school garden. Students learn to watch nature carefully, listen to the calls of different birds, and record their findings systemically.</p>
            </div>

            <div className="textbook-grid">
              <div className="textbook-fact">
                <div className="lab" style={{ color: 'var(--blue)' }}>Guides</div>
                <div className="v">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  Raghu &amp; Maniram
                </div>
                <div className="note">Dr. Raghu is a researcher; Maniram chacha mimics bird calls and knows local nature.</div>
              </div>

              <div className="textbook-fact">
                <div className="lab" style={{ color: 'var(--violet)' }}>Observer Duty</div>
                <div className="v">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--violet)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                  Observe Carefully
                </div>
                <div className="note">Notice stem width, leaf sizes, and flower colors without breaking or plucking them.</div>
              </div>

              <div className="textbook-fact">
                <div className="lab" style={{ color: 'var(--green)' }}>Bird Call Mimics</div>
                <div className="v">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                  Listen &amp; Learn
                </div>
                <div className="note">Identify unique vocalizations. Each animal communicates differently in its environment.</div>
              </div>

              <div className="textbook-fact">
                <div className="lab" style={{ color: 'var(--orange)' }}>Log Book</div>
                <div className="v">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Tables 2.1 &amp; 2.2
                </div>
                <div className="note">Observe and record plants in Table 2.1, and animals in Table 2.2 separately.</div>
              </div>
            </div>

            <div className="textbook-connect">
              <h4>◎ Core Insights of our Nature Walk</h4>
              <div className="lk">
                <span className="dot"></span>
                <span>We observe **biological variety**—an immense range of different plants and animals living in the same habitat.</span>
              </div>
              <div className="lk">
                <span className="dot"></span>
                <span>We learn **interconnection**—how insects rely on flowers for food, and plants rely on animals for seed dispersal.</span>
              </div>
            </div>

            <div className="textbook-timeline">
              <div className="pt"><i></i><b>1. Walk</b><span>Enter Garden</span></div>
              <div className="pt"><i></i><b>2. Watch</b><span>Observe Plants</span></div>
              <div className="pt"><i></i><b>3. Listen</b><span>Bird Calls</span></div>
              <div className="pt"><i></i><b>4. Log</b><span>Fill Tables</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--cardline)', paddingTop: '0.75rem' }}>
            <div style={{ color: 'var(--mut)', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              Page 1 of 1
            </div>
            <button
              onClick={() => { handleStopSpeech(); onBackToDashboard(true); }}
              className="primary"
              style={{
                fontFamily: 'var(--geo-font)',
                fontWeight: '700',
                padding: '0.65rem 1.5rem',
                borderRadius: '999px',
                fontSize: '13px',
                display: 'inline-flex',
                gap: '6px',
                alignItems: 'center',
                boxShadow: '0 8px 20px rgba(14,53,86,0.2)'
              }}
            >
              Finish Lesson <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
