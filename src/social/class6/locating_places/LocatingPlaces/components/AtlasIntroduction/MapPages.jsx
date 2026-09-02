import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Lightbulb, X, Globe2, Image as ImageIcon, Maximize2, Minimize2, Mountain } from 'lucide-react';
import physicalImg from './assets/printed_physical_map.jpeg';
import politicalImg from './assets/political.png';
import thematicMapImg from './assets/thematic-map.jpeg';
import ContentScrollNav, { useScrollNav } from '../ContentScrollNav';
import IndiaMountainsMapExplorer from './IndiaMountainsMapExplorer';

// The interactive 3D globe (physical / political / thematic modes) lives as a
// static asset so it can be dropped into an iframe from anywhere in the app.
const GLOBE_URL = '/atlas-globe.html';

const globeBtn = {
  width: '34px', height: '34px', borderRadius: '9px',
  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)',
  color: '#eaf0f8', cursor: 'pointer', display: 'grid', placeItems: 'center',
  transition: 'background 0.15s'
};

const PageLayout = ({
  title, subtitle, imageSrc,
  whatIsTitle, whatIs,
  featuresTitle, features,
  colorsTitle, colors,
  whyUseTitle, whyUse,
  remember, funFact,
  imageAspectRatio = '1/1',
  imageScale = 1,
  onFullyViewed,
  globeMode = 'physical',
  globeTheme,
  thematicMapOptions,
}) => {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [activeMapIndex, setActiveMapIndex] = useState(0);

  const currentImageSrc = thematicMapOptions ? thematicMapOptions[activeMapIndex].src : (imageSrc || (globeMode === 'physical' ? '/maps/printed_physical_map.jpeg' : globeMode === 'political' ? '/maps/political_map.png' : '/maps/thematic_map.jpg'));
  const currentMapTitle = thematicMapOptions ? thematicMapOptions[activeMapIndex].label : title;
  const [isGlobeOpen, setIsGlobeOpen] = useState(false);
  const [isMountainsMapOpen, setIsMountainsMapOpen] = useState(false);
  const [mountainsCategory, setMountainsCategory] = useState('all');
  const [isGlobeFull, setIsGlobeFull] = useState(false);
  const [leftPage, setLeftPage] = useState(1);
  const globePanelRef = useRef(null);

  // native full screen where it exists, with a maximise fallback where it doesn't
  const toggleGlobeFull = () => {
    const el = globePanelRef.current;
    if (document.fullscreenElement) { document.exitFullscreen?.(); return; }
    if (el?.requestFullscreen) { el.requestFullscreen().catch(() => setIsGlobeFull(v => !v)); return; }
    setIsGlobeFull(v => !v);
  };

  useEffect(() => {
    const sync = () => setIsGlobeFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  useEffect(() => {
    if (!isGlobeOpen) return;
    const onKey = e => {
      if (e.key !== 'Escape') return;
      if (document.fullscreenElement) return;   // let full screen exit first
      setIsGlobeOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isGlobeOpen]);

  /* ── Content is packed to the measured page box ─────────────────────────
     Blocks are filled onto a sub-page until it is full, then a new sub-page
     starts. A tall window therefore shows fewer, fuller pages; a short or
     narrow one simply gets more pages. Nothing scrolls, nothing overlaps and
     no page is left half empty. */
  const contentRef = useRef(null);
  const innerRef = useRef(null);
  const probeRef = useRef(null);
  const [box, setBox] = useState({ w: 480, h: 560 });
  const [shrink, setShrink] = useState(0);   // budget trimmed if a page still overflows

  useEffect(() => {
    const el = contentRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    let last = { w: 0, h: 0 };
    const ro = new ResizeObserver(entries => {
      const r = entries[0].contentRect;
      if (Math.abs(last.w - r.width) < 3 && Math.abs(last.h - r.height) < 3) return;
      last = { w: r.width, h: r.height };
      setBox(last);
      setShrink(0);                          // new size, start optimistic again
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Block heights are measured from a hidden probe rather than guessed, so a
     page is filled right up to the edge — no premature break, no empty half. */
  const [m, setM] = useState(null);

  useEffect(() => {
    const el = probeRef.current;
    if (!el) return;
    const pick = k => el.querySelector(`[data-p="${k}"]`);
    const featCard = pick('features');
    const grid = featCard && featCard.querySelector('[data-grid="1"]');
    if (!featCard || !grid) return;

    const tiles = Array.from(grid.children);
    if (!tiles.length) return;
    const top0 = tiles[0].offsetTop;
    const measured = {
      gap: parseFloat(getComputedStyle(el).rowGap) || 8,
      whatIs: pick('whatIs') ? pick('whatIs').offsetHeight : 0,
      colors: pick('colors') ? pick('colors').offsetHeight : 0,
      why: pick('why') ? pick('why').offsetHeight : 0,
      cols: Math.max(1, tiles.filter(t => Math.abs(t.offsetTop - top0) < 2).length),
      tile: Math.max(...tiles.map(t => t.offsetHeight)),
      rowGap: parseFloat(getComputedStyle(grid).rowGap) || 0,
      chrome: featCard.offsetHeight - grid.offsetHeight
    };
    setM(prev => {
      if (prev && Object.keys(measured).every(k => Math.abs(prev[k] - measured[k]) < 1.5)) return prev;
      return measured;
    });
  }, [box.w, box.h, features, colors, whyUse, whatIs, funFact]);

  const packed = React.useMemo(() => {
    const all = [{ type: 'whatIs' }, { type: 'features', list: features, continued: false }, { type: 'colors' }, { type: 'why' }];
    if (!m) return [all];

    const budget = Math.max(120, box.h - shrink - 2);
    const featuresH = n => Math.ceil(n / m.cols) * (m.tile + m.rowGap) - m.rowGap + m.chrome;

    // Fill pages up to `cap`, splitting the feature grid across pages as needed.
    // `maxPerChunk` keeps those splits even (3 + 3 rather than 1 + 5).
    const packWith = (cap, maxPerChunk) => {
      const pages = [];
      let cur = [];
      let left = cap;
      const flush = () => { if (cur.length) { pages.push(cur); cur = []; left = cap; } };
      const place = (item, h) => {
        if (cur.length && h + m.gap > left) flush();
        left -= h + (cur.length ? m.gap : 0);
        cur.push(item);
      };

      place({ type: 'whatIs' }, m.whatIs);

      let rest = features;
      let firstChunk = true;
      let guard = 0;
      while (rest.length && guard++ < 24) {
        if (cur.some(b => b.type === 'features')) {
          flush();
        }
        const avail = left - (cur.length ? m.gap : 0) - m.chrome + m.rowGap;
        let rows = Math.floor(avail / (m.tile + m.rowGap));
        if (rows < 1) {
          if (cur.length) { flush(); continue; }
          rows = 1; // never loop on an empty page
        }
        const take = Math.max(1, maxPerChunk ? Math.min(rows * m.cols, maxPerChunk) : rows * m.cols);
        const chunk = rest.slice(0, take);
        rest = rest.slice(take);
        place({ type: 'features', list: chunk, continued: !firstChunk }, featuresH(chunk.length));
        firstChunk = false;
        if (rest.length) {
          flush();
        }
      }

      place({ type: 'colors' }, m.colors);
      place({ type: 'why' }, m.why);
      flush();

      // Post-merge safeguard: guarantee each page has at most ONE consolidated features box
      const mergedPages = pages.map(pg => {
        const featBlocks = pg.filter(b => b.type === 'features');
        if (featBlocks.length <= 1) return pg;
        const combinedList = featBlocks.flatMap(b => b.list);
        const firstFeatIndex = pg.findIndex(b => b.type === 'features');
        const isContinued = featBlocks[0].continued;
        return pg.reduce((acc, b, idx) => {
          if (b.type !== 'features') {
            acc.push(b);
          } else if (idx === firstFeatIndex) {
            acc.push({ type: 'features', list: combinedList, continued: isContinued });
          }
          return acc;
        }, []);
      });

      return mergedPages;
    };

    const chunkCount = pgs => pgs.reduce((n, pg) => n + pg.filter(b => b.type === 'features').length, 0);

    let pages = packWith(budget);
    if (pages.length < 2) return pages.length ? pages : [all];

    // Even out the feature split across however many chunks it needs.
    const perChunk = Math.ceil(features.length / Math.max(1, chunkCount(pages)));
    const evened = packWith(budget, perChunk);
    if (evened.length <= pages.length) pages = evened;

    // Same page count, but spread evenly — otherwise page one is crammed and
    // the last one is nearly empty.
    let lo = Math.ceil((m.whatIs + m.colors + m.why) / pages.length);
    let hi = budget;
    let best = pages;
    for (let i = 0; i < 18 && lo <= hi; i++) {
      const mid = Math.floor((lo + hi) / 2);
      const attempt = packWith(mid, perChunk);
      if (attempt.length <= pages.length) { best = attempt; hi = mid - 1; } else { lo = mid + 1; }
    }
    return best;
  }, [m, box.h, shrink, features, colors, whyUse]);

  const LEFT_PAGES = Math.max(1, packed.length);

  // Safety net only: once the blocks have been measured, verify the rendered
  // page really fits and trim a little if it does not. Never runs before the
  // measurement exists, otherwise the unmeasured first paint would starve it.
  useEffect(() => { setShrink(0); }, [m]);

  useEffect(() => {
    if (!m) return;
    const vp = contentRef.current;
    const inner = innerRef.current;
    if (!vp || !inner) return;
    if (inner.scrollHeight > vp.clientHeight + 2 && shrink < 96) {
      setShrink(s => s + 16);
    }
  });

  useEffect(() => {
    if (leftPage > LEFT_PAGES) setLeftPage(LEFT_PAGES);
  }, [leftPage, LEFT_PAGES]);

  useEffect(() => {
    if (leftPage === LEFT_PAGES && onFullyViewed) {
      onFullyViewed();
    }
  }, [leftPage, LEFT_PAGES, onFullyViewed]);

  // shared card chrome
  const pageCol = { display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vh, 10px)', flex: 1, minHeight: 0 };
  const cardBase = { border: '1.5px solid #F2DFBC', borderRadius: '14px', boxShadow: '0 2px 8px rgba(60,40,20,0.03)' };
  const headStyle = { fontSize: 'clamp(13px, 2.3vh, 15.5px)', color: '#78350F', marginTop: 0, fontWeight: 900, fontFamily: '"Fraunces", serif', flexShrink: 0 };

  const renderBlock = (block, i, probe) => {
    if (block.type === 'whatIs') {
      return (
        <div key={i} data-p={probe} style={{ ...cardBase, background: '#FFFFFF', padding: 'clamp(8px, 1.5vh, 12px) 14px', flexShrink: 0 }}>
          <h3 style={{ ...headStyle, marginBottom: '6px' }}>{whatIsTitle}</h3>
          {whatIs.map((p, k) => (
            <p
              key={k}
              style={{
                margin: k > 0 ? '6px 0 0 0' : 0,
                color: '#3D2E24',
                fontSize: 'clamp(11.5px, 2.0vh, 14px)',
                lineHeight: 1.5,
                fontWeight: 600,
                textAlign: 'justify',
                textJustify: 'inter-word'
              }}
            >
              {p}
            </p>
          ))}
        </div>
      );
    }

    if (block.type === 'features') {
      return (
        <div key={i} data-p={probe} style={{ ...cardBase, background: '#FFF9F0', padding: 'clamp(8px, 1.5vh, 12px) 12px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ ...headStyle, marginBottom: 'clamp(5px, 1.1vh, 8px)' }}>
            {block.continued ? `${featuresTitle} (continued)` : featuresTitle}
          </h3>
          <div data-grid="1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))', gap: 'clamp(4px, 0.95vh, 7px)', alignContent: 'start' }}>
            {block.list.map((f, k) => {
              const featureCategoryMap = {
                'Mountains': 'mountains',
                'Plains': 'plains',
                'Rivers': 'rivers',
                'Deserts': 'deserts',
                'Forests': 'forests',
                'Plateaus': 'plateaus'
              };
              const targetCategory = featureCategoryMap[f.title];
              const isInteractive = Boolean(targetCategory);

              return (
                <div
                  key={k}
                  onClick={() => {
                    if (isInteractive) {
                      setMountainsCategory(targetCategory);
                      setIsMountainsMapOpen(true);
                    }
                  }}
                  style={{
                    display: 'flex',
                    gap: '9px',
                    alignItems: 'flex-start',
                    background: isInteractive ? 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' : '#FFFFFF',
                    padding: 'clamp(5px, 1.05vh, 9px) 10px',
                    borderRadius: '10px',
                    border: isInteractive ? '1.5px solid #F59E0B' : '1.5px solid #F2DFBC',
                    minWidth: 0,
                    cursor: isInteractive ? 'pointer' : 'default',
                    boxShadow: isInteractive ? '0 2px 8px rgba(217, 119, 6, 0.12)' : 'none',
                    transition: 'all 0.15s'
                  }}
                  onMouseOver={(e) => {
                    if (isInteractive) e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    if (isInteractive) e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: 'clamp(0.98rem, 2.2vh, 1.35rem)', lineHeight: 1.15, flexShrink: 0 }}>{f.icon}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 800, color: isInteractive ? '#92400E' : '#78350F', fontSize: 'clamp(11.5px, 2.0vh, 14px)', lineHeight: 1.2, overflowWrap: 'anywhere', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {f.title}
                      {isInteractive && <span style={{ fontSize: '8.5px', background: '#D97706', color: '#FFF', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>3D Map ➔</span>}
                    </div>
                    <div style={{ fontSize: 'clamp(10.5px, 1.85vh, 12.5px)', color: '#3D2E24', lineHeight: 1.35, fontWeight: 600, overflowWrap: 'anywhere', textAlign: 'justify', textJustify: 'inter-word' }}>{f.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (block.type === 'colors') {
      return (
        <div key={i} data-p={probe} style={{ ...cardBase, background: '#FFFFFF', padding: 'clamp(8px, 1.5vh, 12px) 14px', flexShrink: 0 }}>
          <h3 style={{ ...headStyle, marginBottom: '6px' }}>{colorsTitle}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))', gap: 'clamp(4px, 0.95vh, 7px)' }}>
            {colors.map((c, k) => (
              <div key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', minWidth: 0 }}>
                <span style={{ fontSize: 'clamp(13px, 2.3vh, 15.5px)', lineHeight: 1.3, flexShrink: 0 }}>{c.color}</span>
                <span style={{ fontSize: 'clamp(11.5px, 2.0vh, 14px)', color: '#3D2E24', fontWeight: 600, lineHeight: 1.35, overflowWrap: 'anywhere', textAlign: 'justify', textJustify: 'inter-word' }}>{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={i} data-p={probe} style={{ ...cardBase, background: '#FFF9F0', padding: 'clamp(8px, 1.5vh, 12px) 14px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ ...headStyle, marginBottom: '6px' }}>{whyUseTitle}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 0.9vh, 7px)' }}>
          {whyUse.map((w, k) => (
            <div key={k} style={{ background: '#FFFFFF', border: '1.5px solid #F2DFBC', padding: 'clamp(5px, 1.1vh, 9px) 10px', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '10px', minWidth: 0 }}>
              <span style={{ fontSize: 'clamp(13px, 2.3vh, 15.5px)', lineHeight: 1.3, flexShrink: 0 }}>{w.icon}</span>
              <span style={{ fontSize: 'clamp(11.5px, 2.0vh, 14px)', color: '#3D2E24', fontWeight: 600, lineHeight: 1.35, overflowWrap: 'anywhere', textAlign: 'justify', textJustify: 'inter-word' }}>{w.desc}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'clamp(6px, 1.3vh, 10px)', paddingTop: '8px', borderTop: '1.5px dashed #F2DFBC', color: '#92400E', fontSize: 'clamp(11px, 1.9vh, 13px)', lineHeight: 1.4, fontWeight: 700, flexShrink: 0, textAlign: 'justify', textJustify: 'inter-word' }}>
          💡 {funFact}
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={{ display: 'flex', width: '100%', height: '100%', padding: 0, boxSizing: 'border-box', minHeight: 0 }}>
      
      {/* Left Page (Text) — Parallel Symmetrical Padding matching Right Page */}
      <div style={{ flex: '1 1 50%', minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', borderRight: '2px solid #F2DFBC', padding: '1rem 1.25rem 3.6rem 1.25rem', boxSizing: 'border-box', overflow: 'hidden', justifyContent: 'space-between', background: 'linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%)' }}>
        
        {/* Header */}
        <div style={{ flexShrink: 0, marginBottom: '6px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF3C7', border: '1px solid #FDE68A', padding: '3px 10px', borderRadius: '999px', color: '#92400E', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
            Chapter 1 • Atlas Introduction
          </div>
          <h2 style={{ fontSize: 'clamp(1.2rem, 2.7vh, 1.65rem)', color: '#78350F', margin: '0 0 0.2rem 0', fontFamily: '"Fraunces", serif', fontWeight: 900, lineHeight: 1.15 }}>{title}</h2>
          <div style={{ fontSize: 'clamp(11.5px, 2.0vh, 14px)', color: '#92400E', fontWeight: 700, lineHeight: 1.35, textAlign: 'justify', textJustify: 'inter-word' }}>{subtitle}</div>
        </div>

        {/* Page Content Viewport — packed sub-pages, never scrolls */}
        <div ref={contentRef} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          <div ref={innerRef} style={pageCol}>
            {(packed[Math.min(leftPage, LEFT_PAGES) - 1] || []).map(renderBlock)}
          </div>

          {/* hidden probe: same width, natural heights, used only for measuring */}
          <div
            ref={probeRef}
            aria-hidden="true"
            style={{ position: 'absolute', left: '-10000px', top: 0, width: box.w ? `${box.w}px` : '100%', display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vh, 10px)', visibility: 'hidden', pointerEvents: 'none' }}
          >
            {renderBlock({ type: 'whatIs' }, 'p0', 'whatIs')}
            {renderBlock({ type: 'features', list: features, continued: false }, 'p1', 'features')}
            {renderBlock({ type: 'colors' }, 'p2', 'colors')}
            {renderBlock({ type: 'why' }, 'p3', 'why')}
          </div>
        </div>

        {/* Sub-Page Navigation Bar — only when there is more than one page */}
        {LEFT_PAGES > 1 && (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1.5px solid #F2DFBC', paddingTop: '6px', marginTop: '4px' }}>
          <button
            onClick={() => setLeftPage(n => Math.max(1, n - 1))}
            disabled={leftPage === 1}
            style={{
              fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, fontSize: 'clamp(11.5px, 1.9vh, 13px)',
              background: '#FFF9F0', color: '#78350F', border: '1.5px solid #F2DFBC', borderRadius: '999px',
              padding: '5px 14px', cursor: leftPage === 1 ? 'not-allowed' : 'pointer',
              opacity: leftPage === 1 ? 0.35 : 1, transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}
          >
            ◀ Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {Array.from({ length: LEFT_PAGES }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: i + 1 === leftPage ? '18px' : '7px',
                  height: '7px',
                  borderRadius: '999px',
                  background: i + 1 === leftPage ? '#D97706' : '#F2DFBC',
                  transition: 'all 0.2s'
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setLeftPage(n => Math.min(LEFT_PAGES, n + 1))}
            disabled={leftPage === LEFT_PAGES}
            style={{
              fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, fontSize: 'clamp(11.5px, 1.9vh, 13px)',
              background: leftPage === LEFT_PAGES ? '#F7F1E2' : '#F59E0B', color: leftPage === LEFT_PAGES ? '#78350F' : '#FFFFFF',
              border: `1.5px solid ${leftPage === LEFT_PAGES ? '#F2DFBC' : '#F59E0B'}`, borderRadius: '999px',
              padding: '5px 14px', cursor: leftPage === LEFT_PAGES ? 'not-allowed' : 'pointer',
              opacity: leftPage === LEFT_PAGES ? 0.35 : 1, transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}
          >
            Next ▶
          </button>
        </div>
        )}

      </div>

      {/* Right Page (Printed Map View & Activities) — Parallel Symmetrical Padding 3.6rem */}
      <div style={{ flex: '1 1 50%', minWidth: 0, padding: '1rem 1.25rem 3.6rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', minHeight: 0, overflow: 'hidden', boxSizing: 'border-box', background: 'linear-gradient(160deg, #F7F1E2 0%, #EFE6D2 100%)' }}>
        
        {/* PRINTED MAP CONTAINER */}
        <div
          onClick={() => setIsImageOpen(true)}
          style={{
            cursor: 'pointer',
            width: '100%',
            flex: 1,
            minHeight: 0,
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid #F2DFBC',
            boxShadow: '0 8px 30px rgba(60,40,20,0.08)',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#D97706';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(217, 119, 6, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#F2DFBC';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(60,40,20,0.08)';
          }}
          title="Click to view full high-resolution printed map"
        >
          {/* Header Tag */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(4px)',
            color: '#FDE68A',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '8.5px',
            fontWeight: 800,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
          }}>
            <ImageIcon size={11} /> Printed {currentMapTitle}
          </div>

          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: 'rgba(15, 23, 42, 0.75)',
            color: '#FFF',
            padding: '2px 7px',
            borderRadius: '5px',
            fontSize: '8px',
            fontWeight: 700,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <Maximize2 size={10} /> Click to Enlarge
          </div>

          <img
            src={currentImageSrc}
            alt={currentMapTitle}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: '8px',
              display: 'block'
            }}
            onError={(e) => {
              if (e.currentTarget.dataset.retried) return;
              e.currentTarget.dataset.retried = 'true';
              if (globeMode === 'physical') e.currentTarget.src = '/maps/printed_physical_map.jpeg';
              else if (globeMode === 'political') e.currentTarget.src = '/maps/political_map.png';
              else e.currentTarget.src = '/maps/thematic_map.jpg';
            }}
          />
        </div>

        {/* INTERACTIVE CONTROLS */}
        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem', flexShrink: 0, width: '100%' }}>


          {/* Parallel Side-by-Side Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            width: '100%',
            maxWidth: '380px'
          }}>
            <button
              onClick={() => setIsGlobeOpen(true)}
              style={{
                flex: '1 1 0',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                background: '#0E3556',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                padding: '0.42rem 0.6rem',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(14, 53, 86, 0.2)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                fontFamily: '"Space Grotesk", sans-serif'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Globe2 size={15} /> View on 3D Globe
            </button>
            <button
              onClick={() => setIsImageOpen(true)}
              style={{
                flex: '1 1 0',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                background: '#D97706',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                padding: '0.42rem 0.6rem',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(217, 119, 6, 0.3)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                fontFamily: '"Space Grotesk", sans-serif'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <ImageIcon size={15} /> View Full Printed Map
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Natural Features 3D Map Explorer Modal */}
    {isMountainsMapOpen && typeof document !== 'undefined' && createPortal(
      <IndiaMountainsMapExplorer 
        initialCategory={mountainsCategory}
        onClose={() => setIsMountainsMapOpen(false)} 
      />,
      document.body
    )}

    {/* High-Resolution Printed Map Modal */}
    {isImageOpen && typeof document !== 'undefined' && createPortal(
      <div
        onClick={() => setIsImageOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: '16px'
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: 'min(1100px, 94vw)',
            height: '92vh',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            border: '2px solid #F2DFBC',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'default'
          }}
        >
          {/* Modal Header */}
          <div style={{
            height: '48px',
            background: 'linear-gradient(90deg, #1C1917 0%, #292524 100%)',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '2.5px solid #D97706',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, fontSize: '14px' }}>
              <ImageIcon size={18} color="#F59E0B" /> Printed {currentMapTitle} • NCERT Class 6 Atlas Reference
            </div>
            <button
              onClick={() => setIsImageOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#FFF',
                cursor: 'pointer',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                transition: 'background 0.15s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>

          {/* Map Viewer Body */}
          <div style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            background: '#FAF5EB',
            overflow: 'hidden'
          }}>
            {thematicMapOptions && (
              <div style={{
                display: 'flex',
                gap: '8px',
                padding: '12px 16px',
                background: '#FFFFFF',
                borderBottom: '2px solid #F2DFBC',
                overflowX: 'auto',
                flexShrink: 0
              }}>
                {thematicMapOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setActiveMapIndex(idx); }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: idx === activeMapIndex ? '2px solid #D97706' : '2px solid transparent',
                      background: idx === activeMapIndex ? '#FEF3C7' : '#F3F4F6',
                      color: idx === activeMapIndex ? '#92400E' : '#4B5563',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            )}
            
            <div style={{
              flex: 1,
              minHeight: 0,
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img
                src={currentImageSrc}
                alt={currentMapTitle}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '10px',
                boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
                border: '1px solid #E2D4B7'
              }}
              onError={(e) => {
                if (e.currentTarget.dataset.retried) return;
                e.currentTarget.dataset.retried = 'true';
                if (globeMode === 'physical') e.currentTarget.src = '/maps/printed_physical_map.jpeg';
                else if (globeMode === 'political') e.currentTarget.src = '/maps/political_map.png';
                else e.currentTarget.src = '/maps/thematic_map.jpg';
              }}
            />
          </div>
          </div>
        </div>
      </div>,
      document.body
    )}

    {/* 3D Globe Modal */}
    {isGlobeOpen && typeof document !== 'undefined' && createPortal(
      <div
        onClick={() => setIsGlobeOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(4,8,16,0.86)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 'clamp(10px, 2.2vw, 28px)'
        }}
      >
        <div
          ref={globePanelRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: isGlobeFull ? '100%' : 'min(1400px, 100%)',
            height: isGlobeFull ? '100%' : 'min(880px, 100%)',
            background: '#05070d',
            borderRadius: isGlobeFull ? 0 : '16px',
            overflow: 'hidden',
            cursor: 'default',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: isGlobeFull ? 'none' : '0 30px 80px rgba(0,0,0,0.6)',
            border: isGlobeFull ? 'none' : '1px solid rgba(255,255,255,0.16)'
          }}
        >
          {/* toolbar — the globe's own controls sit at the corners of the canvas,
              so the window controls get their own strip rather than covering them */}
          <div style={{
            flexShrink: 0, height: '46px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: '12px', padding: '0 10px 0 16px',
            background: 'rgba(14,19,30,0.95)', borderBottom: '1px solid rgba(255,255,255,0.10)'
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#eaf0f8', fontSize: '14px', fontWeight: 700, minWidth: 0 }}>
              <Globe2 size={16} color="#6fc4ff" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Interactive 3D Globe — {title}</span>
            </span>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <button
                onClick={toggleGlobeFull}
                title={isGlobeFull ? 'Exit full screen' : 'View full screen'}
                aria-label={isGlobeFull ? 'Exit full screen' : 'View full screen'}
                style={globeBtn}
              >
                {isGlobeFull ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button
                onClick={() => { if (document.fullscreenElement) document.exitFullscreen?.(); setIsGlobeOpen(false); }}
                title="Close (Esc)"
                aria-label="Close the globe"
                style={globeBtn}
              >
                <X size={18} />
              </button>
            </span>
          </div>

          <iframe
            title="Interactive 3D Globe"
            src={`${GLOBE_URL}?mode=${globeMode}${globeTheme ? `&theme=${globeTheme}` : ''}&embed=1`}
            style={{ flex: 1, minHeight: 0, width: '100%', border: 'none', display: 'block' }}
            allow="fullscreen"
            allowFullScreen
          />
        </div>
      </div>,
      document.body
    )}
    </>
  );
};

export const PhysicalMapPage = ({ onFullyViewed }) => (
  <PageLayout 
    onFullyViewed={onFullyViewed}
    title="Physical Maps"
    subtitle="Maps that show Earth's natural features like mountains and rivers"
    imageSrc={physicalImg}
    globeMode="physical"
    callouts={[
      { icon: '🏔', label: 'Mountains', top: '25%', left: '20%' },
      { icon: '🌊', label: 'River', top: '70%', left: '45%' },
      { icon: '🌳', label: 'Forest', top: '75%', left: '80%' },
      { icon: '🏜', label: 'Desert', top: '35%', left: '60%' },
      { icon: '🏞', label: 'Plain', top: '80%', left: '25%' },
      { icon: '⛰', label: 'Plateau', top: '50%', left: '25%' }
    ]}
    whatIs={[
      "A Physical Map shows the natural features of the Earth.",
      "It helps us see the shape of the land without showing roads or cities built by people."
    ]}
    whatIsTitle="What is a Physical Map?"
    featuresTitle="Natural Features on a Physical Map"
    features={[
      { icon: '🏔', title: 'Mountains', desc: 'Very tall and large rocky hills rising high above the land.' },
      { icon: '🏞', title: 'Plains', desc: 'Large flat areas of land that are great for farming and building houses.' },
      { icon: '🌊', title: 'Rivers', desc: 'Natural streams of flowing water moving across the land into the sea.' },
      { icon: '🏜', title: 'Deserts', desc: 'Very dry and sandy lands that get almost no rain all year.' },
      { icon: '🌳', title: 'Forests', desc: 'Large areas completely covered with lots of trees and plants.' },
      { icon: '⛰', title: 'Plateaus', desc: 'Large flat lands that are raised high up like a table.' }
    ]}
    colorsTitle="Colours Used on Physical Maps"
    colors={[
      { color: '🟢', desc: 'Green represents plains, river valleys, and low flat lands.' },
      { color: '🟤', desc: 'Brown is used for high mountains and tall hills.' },
      { color: '🔵', desc: 'Blue shows water like rivers, lakes, seas, and oceans.' },
      { color: '🟡', desc: 'Yellow is used to show high flat lands called plateaus.' }
    ]}
    whyUseTitle="Why are Physical Maps Useful?"
    whyUse={[
      { icon: '🏕', desc: 'Planning outdoor trips and finding paths through nature' },
      { icon: '🌾', desc: 'Learning about different land shapes on Earth' },
      { icon: '🏞', desc: 'Seeing where water flows and where mountains are located' }
    ]}
    remember={[
      "Physical Maps show nature.",
      "They help us find mountains, rivers, plains, forests and deserts."
    ]}
    funFact="The Himalayas are colored dark brown on physical maps because they are some of the tallest mountains in the world!"
  />
);

export const PoliticalMapPage = ({ onFullyViewed }) => (
  <PageLayout 
    onFullyViewed={onFullyViewed}
    title="Political Maps"
    subtitle="Maps that show countries, states, cities and their borders"
    imageSrc={politicalImg}
    globeMode="political"
    callouts={[
      { icon: '📍', label: 'Capital', top: '30%', left: '50%' },
      { icon: '🏙', label: 'City', top: '60%', left: '35%' },
      { icon: '➖', label: 'Boundary', top: '45%', left: '75%' },
      { icon: '🗺', label: 'State', top: '75%', left: '60%' },
      { icon: '🌎', label: 'Country', top: '25%', left: '25%' }
    ]}
    whatIs={[
      "A Political Map shows the borders of countries, states, and cities.",
      "It helps us see the different regions and governments created by people."
    ]}
    whatIsTitle="What is a Political Map?"
    featuresTitle="What Can We See?"
    features={[
      { icon: '🌎', title: 'Countries', desc: 'Different nations around the world with their own governments.' },
      { icon: '🗺', title: 'States', desc: 'Smaller regions or states inside a country.' },
      { icon: '📍', title: 'Capitals', desc: 'Important cities where the government of a state or country works.' },
      { icon: '🏙', title: 'Cities', desc: 'Big towns where many people live and work.' },
      { icon: '➖', title: 'Boundaries', desc: 'The lines on the map that separate states and countries.' }
    ]}
    colorsTitle="Common Symbols"
    colors={[
      { color: '⭐️', desc: 'Stars are used to show capital cities.' },
      { color: '⚫️', desc: 'Black dots are used to show important cities.' },
      { color: '➖', desc: 'Thick lines show the borders between different countries.' },
      { color: '〰️', desc: 'Dotted or dashed lines show the borders between states.' }
    ]}
    whyUseTitle="Why Do We Use Political Maps?"
    whyUse={[
      { icon: '🏫', desc: 'Learning about the different countries and states in the world' },
      { icon: '✈️', desc: 'Finding out which state a city belongs to when traveling' },
      { icon: '🗺', desc: 'Seeing the borders that separate different nations' }
    ]}
    remember={[
      "Political Maps show places made by people.",
      "They help us locate countries, states, cities and their borders."
    ]}
    funFact="India currently has 28 states and 8 Union Territories, each with its own borders on the map."
  />
);

export const ThematicMapPage = ({ onFullyViewed }) => (
  <PageLayout 
    onFullyViewed={onFullyViewed}
    title="Thematic Maps"
    subtitle="Maps that focus on one special topic like soil, rainfall, or crops"
    globeMode="thematic"
    globeTheme="rain"
    thematicMapOptions={[
      { icon: '🌱', label: 'Major Soil Types', src: thematicMapImg },
      { icon: '🌧', label: 'Annual Rainfall', src: '/maps/flat_thematic_rainfall_map.jpg' },
      { icon: '🌡', label: 'Temperature Distribution', src: '/maps/flat_thematic_temperature_map.jpg' },
      { icon: '👥', label: 'Population Density', src: '/maps/flat_thematic_population_density_map.jpg' },
      { icon: '🌳', label: 'Forest Cover', src: '/maps/flat_thematic_forest_cover_map.jpg' }
    ]}
    callouts={[
      { icon: '🌱', label: 'Alluvial Soil', top: '33%', left: '42%' },
      { icon: '🧱', label: 'Black Soil', top: '50%', left: '30%' },
      { icon: '🔴', label: 'Red & Yellow Soil', top: '56%', left: '50%' },
      { icon: '📊', label: 'Soil Legend', top: '75%', left: '72%' }
    ]}
    whatIs={[
      "A Thematic Map focuses on one special topic or theme.",
      "Instead of showing borders, it shows specific information like rainfall, types of crops, or soil."
    ]}
    whatIsTitle="What is a Thematic Map?"
    featuresTitle="What Can We Learn from Thematic Maps?"
    features={[
      { icon: '🌱', title: 'Soil Types', desc: 'Shows where different kinds of soil are found for farming.' },
      { icon: '🌧', title: 'Rainfall', desc: 'Shows how much rain falls in different areas across the year.' },
      { icon: '🌡', title: 'Temperature', desc: 'Shows how hot or cold different regions get.' },
      { icon: '🌾', title: 'Crops & Agriculture', desc: 'Shows where crops like rice, wheat, and cotton grow best.' },
      { icon: '🌳', title: 'Forests & Wildlife', desc: 'Shows where different types of forests and animals are located.' }
    ]}
    colorsTitle="Colours and Legends"
    colors={[
      { color: '📊', desc: 'The legend box explains what each color or pattern means on the map.' },
      { color: '🟩', desc: 'Light green shows good soil for farming near rivers.' },
      { color: '⬛️', desc: 'Dark grey shows black soil that is great for growing cotton.' },
      { color: '🟥', desc: 'Red and yellow colors show older, rocky soils.' },
      { color: '🌲', desc: 'Deep green shows forest soils found on mountains.' },
      { color: '🟨', desc: 'Yellow shows soils found in areas with very heavy rain.' },
      { color: '🏜️', desc: 'Beige colors show dry and sandy soils in deserts.' }
    ]}
    whyUseTitle="Why Do We Use Thematic Maps?"
    whyUse={[
      { icon: '🚜', desc: 'Finding the best places to grow different crops' },
      { icon: '☔️', desc: 'Knowing where it will rain the most during the year' },
      { icon: '📈', desc: 'Seeing where people live and where natural resources are found' }
    ]}
    remember={[
      "One map, one main idea.",
      "Thematic maps use distinct colors and a legend box to explain specific information."
    ]}
    funFact="A soil map and a rainfall map of India cover the exact same land, but they tell us two completely different stories!"
  />
);
