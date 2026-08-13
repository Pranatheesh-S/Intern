import React from 'react';

export default function BlueprintIntro({ onExplore }) {
  return (
    <div className="blueprint-intro-container">
      <style>{`
        .blueprint-intro-container {
          --ink:#EAF6FB; --paper1:#0A3A5C; --paper2:#062033; --line:rgba(255,255,255,.09);
          --line2:rgba(255,255,255,.17); --cyan:#7FD0F0; --amber:#F5A623; --amber2:#FFB944;
          --serif:"Fraunces","Iowan Old Style",Palatino,Georgia,serif;
          --mono:"IBM Plex Mono","SF Mono",ui-monospace,Menlo,monospace;
          --geo:"Space Grotesk",system-ui,-apple-system,sans-serif;
          
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 100000;
          font-family: var(--geo);
          color: var(--ink);
          overflow: hidden;
          background: radial-gradient(130% 120% at 78% 12%, var(--paper1), var(--paper2));
        }

        .cover { position: relative; width: 100vw; height: 100vh; overflow: hidden; }

        /* full-bleed survey grid */
        .grid {
          position: absolute; inset: 0; pointer-events: none;
          background:
            repeating-linear-gradient(0deg, transparent 0 33px, var(--line) 33px 34px),
            repeating-linear-gradient(90deg, transparent 0 33px, var(--line) 33px 34px);
        }
        .grid::after {
          content: ""; position: absolute; inset: 0;
          background:
            repeating-linear-gradient(0deg, transparent 0 135px, var(--line2) 135px 136px),
            repeating-linear-gradient(90deg, transparent 0 135px, var(--line2) 135px 136px);
        }
        .frame {
          position: absolute; inset: clamp(16px, 2.4vw, 34px);
          border: 1px solid rgba(255,255,255,.22); border-radius: 12px; pointer-events: none;
        }
        .etick {
          position: absolute; font-family: var(--mono); font-size: clamp(9px, 1vw, 11px);
          letter-spacing: .14em; color: var(--cyan); opacity: .75;
        }

        /* two-column landscape layout */
        .layout {
          position: absolute; inset: clamp(16px, 2.4vw, 34px); display: grid;
          grid-template-columns: minmax(0, 0.92fr) 1px minmax(0, 1.08fr); align-items: center;
          padding: clamp(20px, 3.5vw, 56px); gap: clamp(20px, 4vw, 64px);
        }

        /* left: the map plot */
        .plot {
          position: relative; aspect-ratio: 1; width: 100%; max-width: min(46vh, 460px); justify-self: center;
          border: 1px solid rgba(127,208,240,.28); border-radius: 14px;
          background: rgba(6,32,53,.35); display: grid; place-items: center;
        }
        .plot .glab {
          position: absolute; font-family: var(--mono); font-size: clamp(8px, .9vw, 10px);
          letter-spacing: .14em; color: var(--cyan); opacity: .7;
        }
        .plot .glab.tl { top: 8px; left: 10px; }
        .plot .glab.tr { top: 8px; right: 10px; }
        .plot .glab.bl { bottom: 8px; left: 10px; }
        .plot .glab.br { bottom: 8px; right: 10px; }
        
        .pin { position: relative; }
        .pin .cross i { position: absolute; background: rgba(127,208,240,.5); }
        .pin .cross .h { width: min(30vh, 300px); height: 1px; left: calc(-1 * min(15vh, 150px)); top: 0; }
        .pin .cross .v { height: min(30vh, 300px); width: 1px; top: calc(-1 * min(15vh, 150px)); left: 0; }
        .pin .dot {
          position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--amber); box-shadow: 0 0 0 5px rgba(245,166,35,.22);
        }
        .pin .ping {
          position: absolute; left: 50%; top: 50%; width: 18px; height: 18px; border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 0 0 rgba(245,166,35,.55); animation: ping 2.6s ease-out infinite;
        }
        .pin .lab {
          position: absolute; left: calc(50% + 16px); top: calc(50% - 34px);
          font-family: var(--mono); font-size: clamp(9px, 1vw, 11px);
          letter-spacing: .08em; color: var(--amber); white-space: nowrap;
        }
        @keyframes ping {
          0% { box-shadow: 0 0 0 0 rgba(245,166,35,.5); }
          70% { box-shadow: 0 0 0 34px rgba(245,166,35,0); }
          100% { box-shadow: 0 0 0 0 rgba(245,166,35,0); }
        }

        /* meridian divider */
        .meridian {
          position: relative; width: 1px; height: 74%; justify-self: center;
          background: repeating-linear-gradient(180deg, rgba(255,255,255,.35) 0 6px, transparent 6px 12px);
        }
        .meridian span {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-90deg);
          font-family: var(--mono); font-size: clamp(8px, .85vw, 10px); letter-spacing: .2em;
          color: var(--cyan); white-space: nowrap;
          background: var(--paper2); padding: 4px 8px; opacity: .85;
        }

        /* right: title cartouche */
        .text { max-width: 560px; text-align: left; }
        .pill {
          display: inline-block; font-family: var(--mono); font-size: clamp(10px, 1.05vw, 12px);
          letter-spacing: .26em; padding: 8px 18px; border-radius: 999px;
          background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.3); color: var(--ink);
        }
        .coord {
          font-family: var(--mono); font-size: clamp(11px, 1.2vw, 13px);
          letter-spacing: .13em; color: var(--cyan); margin: clamp(16px, 2.2vw, 26px) 0 6px;
        }
        .title {
          font-family: var(--serif); font-weight: 600; font-size: clamp(48px, 7.6vw, 104px);
          line-height: .92; color: #fff; letter-spacing: -.015em; margin: 0;
        }
        .title em { font-style: normal; color: var(--cyan); }
        .metae {
          display: flex; align-items: center; gap: 14px; margin-top: clamp(16px, 2.4vw, 28px);
        }
        .metae .no {
          font-family: var(--mono); font-size: clamp(11px, 1.2vw, 13px); letter-spacing: .2em;
          color: var(--ink); border: 1px solid rgba(255,255,255,.3); padding: 6px 12px; border-radius: 8px;
        }
        .metae .ch {
          font-family: var(--geo); font-weight: 700; font-size: clamp(16px, 2.1vw, 24px);
          color: #fff; letter-spacing: .02em;
        }
        .chsub {
          font-family: var(--mono); font-size: clamp(9px, 1vw, 11px); letter-spacing: .16em;
          color: var(--cyan); text-transform: uppercase; margin-top: 10px; opacity: .8;
        }
        .cta {
          margin-top: clamp(24px, 3.4vw, 42px); font-family: var(--geo); font-weight: 700;
          border: none; cursor: pointer; background: var(--amber); color: var(--paper2);
          padding: clamp(13px, 1.6vw, 17px) clamp(28px, 3.4vw, 40px); border-radius: 12px;
          font-size: clamp(14px, 1.6vw, 17px); box-shadow: 0 14px 34px rgba(245,166,35,.32);
          transition: all .2s; display: inline-flex; gap: 10px; align-items: center;
        }
        .cta:hover, .cta:focus-visible { background: var(--amber2); transform: translateY(-2px); outline: none; }

        .corner-brand {
          position: absolute; bottom: clamp(20px, 2.8vw, 40px); right: clamp(24px, 3.4vw, 52px);
          display: flex; align-items: center; gap: 9px; z-index: 3;
        }
        .corner-brand .logo {
          width: 26px; height: 26px; border-radius: 7px; background: var(--amber); color: var(--paper2);
          display: grid; place-items: center; font-weight: 800; font-family: var(--geo); font-size: 15px;
        }
        .corner-brand b { font-size: 12px; color: #fff; }
        .corner-brand span { font-family: var(--mono); font-size: 9px; letter-spacing: .1em; color: rgba(234,246,251,.6); display: block; }

        /* portrait / small: stack */
        @media (max-aspect-ratio:1/1), (max-width:760px){
          .layout {
            grid-template-columns: 1fr; grid-template-rows: auto; justify-items: center; text-align: center;
            gap: clamp(18px, 4vh, 36px); overflow: auto;
          }
          .text { text-align: center; }
          .meridian { display: none; }
          .plot { max-width: min(40vh, 320px); }
          .text { max-width: 100%; }
          .metae { justify-content: center; }
          .corner-brand { position: static; margin: 12px auto 0; justify-content: center; }
        }
        @media(prefers-reduced-motion:reduce){ .pin .ping{ animation: none; } }
      `}</style>

      <div className="cover">
        <div className="grid"></div>
        <div className="frame"></div>
        <span className="etick" style={{ top: 'clamp(22px, 3vw, 42px)', left: 'clamp(22px, 3vw, 42px)' }}>90°N</span>
        <span className="etick" style={{ top: 'clamp(22px, 3vw, 42px)', right: 'clamp(22px, 3vw, 42px)' }}>0°</span>
        <span className="etick" style={{ bottom: 'clamp(22px, 3vw, 42px)', left: 'clamp(22px, 3vw, 42px)' }}>EQUATOR</span>
        <span className="etick" style={{ bottom: 'clamp(22px, 3vw, 42px)', right: 'clamp(22px, 3vw, 42px)' }}>180°</span>

        <div className="layout">
          {/* LEFT · the plotted map */}
          <div className="plot">
            <span className="glab tl">75.8°E</span><span className="glab tr">N ↑</span>
            <span className="glab bl">SHEET 01</span><span className="glab br">SST · CH 01</span>
            <div className="pin">
              <div className="cross"><i className="h"></i><i className="v"></i></div>
              <div className="ping"></div>
              <div className="dot"></div>
              <div className="lab">◎ 23.26°N · 77.41°E</div>
            </div>
          </div>

          {/* MERIDIAN */}
          <div className="meridian"><span>PRIME MERIDIAN · 0°</span></div>

          {/* RIGHT · title cartouche */}
          <div className="text">
            <span className="pill">CLASS 6 · SOCIAL SCIENCE</span>
            <div className="coord">◎ PLOTTING YOUR POSITION ON EARTH</div>
            <h1 className="title">Social&nbsp;<em>Science</em></h1>
            <div className="metae">
              <span className="no">CH 01 / 05</span>
              <span className="ch">Locating Places on the Earth</span>
            </div>
            <div className="chsub">Maps · Coordinates · Latitude &amp; Longitude · Time zones</div>
            <button className="cta" onClick={onExplore}>Open Book&nbsp;→</button>
          </div>
        </div>

        <div className="corner-brand">
          <div className="logo">F</div>
          <div><b>FuturaX</b><span>AI-NATIVE LEARNING LAB</span></div>
        </div>
      </div>
    </div>
  );
}
