import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

export function useScrollNav(scrollRef) {
  const [state, setState] = useState({ page: 0, totalPages: 1, hasOverflow: false });

  useEffect(() => {
    const el = scrollRef?.current;
    if (!el) return;

    const update = () => {
      const { scrollHeight, clientHeight, scrollTop } = el;
      const hasOverflow = scrollHeight > clientHeight + 4;
      if (!hasOverflow) {
        setState({ page: 0, totalPages: 1, hasOverflow: false });
        return;
      }
      const totalPages = Math.max(1, Math.ceil(scrollHeight / clientHeight));
      const page = Math.min(totalPages - 1, Math.max(0, Math.round(scrollTop / clientHeight)));
      setState({ page, totalPages, hasOverflow: true });
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    Array.from(el.children).forEach(child => ro.observe(child));
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [scrollRef]);

  const goUp = useCallback(() => {
    const el = scrollRef?.current;
    if (!el) return;
    const page = Math.min(
      Math.max(0, Math.ceil(el.scrollTop / el.clientHeight) - 1),
      Math.ceil(el.scrollHeight / el.clientHeight) - 1
    );
    el.scrollTo({ top: page * el.clientHeight, behavior: 'smooth' });
  }, [scrollRef]);

  const goDown = useCallback(() => {
    const el = scrollRef?.current;
    if (!el) return;
    const totalPages = Math.max(1, Math.ceil(el.scrollHeight / el.clientHeight));
    const current = Math.min(totalPages - 1, Math.round(el.scrollTop / el.clientHeight));
    const next = Math.min(totalPages - 1, current + 1);
    el.scrollTo({ top: next * el.clientHeight, behavior: 'smooth' });
  }, [scrollRef]);

  return {
    currentPage: state.page,
    pageCount: state.totalPages,
    hasOverflow: state.hasOverflow,
    canGoUp: state.page > 0,
    canGoDown: state.page < state.totalPages - 1,
    onPageUp: goUp,
    onPageDown: goDown
  };
}

const barBtn = {
  fontFamily: '"Space Grotesk", system-ui, -apple-system, sans-serif',
  fontWeight: 700,
  fontSize: '14px',
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '10px',
  transition: 'background 0.2s, transform 0.2s, opacity 0.2s'
};

export function PageBar({ currentPage = 0, pageCount = 1, onPageUp, onPageDown, showNextBtn = true }) {
  if (pageCount <= 1) return null;
  const last = currentPage >= pageCount - 1;

  return (
    <div style={{
      flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '12px', paddingTop: '12px'
    }}>
      {/* page indicator — dots are clickable, so going back needs no second button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 600, color: '#7c8a99', fontSize: '14px' }}>
          Page {currentPage + 1} of {pageCount}
        </span>
        <span style={{ display: 'inline-flex', gap: '6px' }}>
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { if (i < currentPage) onPageUp?.(i); else if (i > currentPage) onPageDown?.(i); }}
              aria-label={`Go to page ${i + 1}`}
              style={{
                width: '9px', height: '9px', padding: 0, borderRadius: '50%', border: 'none',
                cursor: 'pointer', background: i === currentPage ? '#F5A623' : '#DCE4EC',
                transition: 'background .25s'
              }}
            />
          ))}
        </span>
      </div>

      {/* the single control, bottom right */}
      {showNextBtn && (
        <button
          type="button"
          onClick={onPageDown}
          disabled={last}
          title="Next page"
          style={{
            ...barBtn, gap: '10px', border: 'none', background: '#F59E0B', color: '#fff',
            cursor: 'pointer', padding: '12px 26px', borderRadius: '999px',
            boxShadow: '0 6px 16px rgba(245,158,11,.38)',
            opacity: last ? 0 : 1, pointerEvents: last ? 'none' : 'auto'
          }}
        >
          Next <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

export default function ContentScrollNav(props) {
  return <PageBar {...props} />;
}

export function ScrollableWithNav({ children, containerStyle, scrollStyle, className, showProgress = true, showNextBtn = true }) {
  const viewportRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const [pages, setPages] = React.useState([0]);
  const [page, setPage] = React.useState(0);
  const [dir, setDir] = React.useState(1);   // 1 = turning forward, -1 = turning back
  const sheetRef = React.useRef(null);
  const firstPaint = React.useRef(true);

  React.useLayoutEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    if (firstPaint.current) { firstPaint.current = false; return; }   // don't animate on mount
    el.style.animation = 'none';
    void el.offsetWidth;                                             // force a reflow so it replays
    el.style.animation = `${dir > 0 ? 'lpTurnFwd' : 'lpTurnBack'} 0.42s cubic-bezier(0.22, 0.61, 0.36, 1) both`;
  }, [page, dir]);

  // Offsets are read with offsetTop, which ignores the transform we use to
  // move between pages. getBoundingClientRect would be measured mid-slide and
  // hand back offsets that land in the middle of a card.
  const offsetIn = React.useCallback((el, root) => {
    let top = 0, node = el;
    while (node && node !== root) { top += node.offsetTop; node = node.offsetParent; }
    return top;
  }, []);

  // Collect the smallest blocks that still fit a page: anything taller than a
  // page is opened up and its own children used instead, so a card is never
  // sliced across two pages.
  const collect = React.useCallback((node, limit, root, out) => {
    Array.from(node.children).forEach(kid => {
      const h = kid.offsetHeight;
      if (!h) return;
      if (h > limit && kid.children.length) {
        collect(kid, limit, root, out);
      } else {
        const top = offsetIn(kid, root);
        out.push({ el: kid, top, bottom: top + h });
      }
    });
  }, [offsetIn]);

  const measure = React.useCallback(() => {
    const view = viewportRef.current, track = trackRef.current;
    if (!view || !track) return;
    const limit = view.clientHeight;
    if (!limit) return;

    const blocks = [];
    collect(track, limit, view, blocks);
    if (!blocks.length) { setPages([0]); return; }

    blocks.sort((a, b) => a.top - b.top || a.bottom - b.bottom);

    // first pass: fill each page until the next block would spill off the bottom
    const breaks = [];
    let top = blocks[0].top;
    blocks.forEach((b, i) => {
      if (b.bottom - top > limit && b.top > top + 1) {
        breaks.push(i);
        top = b.top;
      }
    });

    // second pass: never strand a heading at the foot of a page — a short block
    // directly above a break belongs with the content it introduces.
    const LEAD_MAX = 110;
    const NEAR = 34;
    const pulled = breaks.map((start, n) => {
      const floor = n === 0 ? 0 : breaks[n - 1];
      let s = start;
      for (let step = 0; step < 2; step++) {
        const prev = blocks[s - 1];
        if (!prev || s - 1 <= floor) break;
        if (prev.bottom - prev.top > LEAD_MAX) break;
        if (blocks[s].top - prev.bottom > NEAR) break;
        const pageEnd = (n + 1 < breaks.length ? blocks[breaks[n + 1] - 1] : blocks[blocks.length - 1]).bottom;
        if (pageEnd - prev.top > limit) break;
        s -= 1;
      }
      return s;
    });

    // a page starts a few px above its first block so nothing is shaved off
    const PAD = 6;
    const starts = [0, ...pulled.map(i => Math.max(0, blocks[i].top - PAD))];
    const uniqueStarts = starts.filter((v, i) => i === 0 || v > starts[i - 1]);
    setPages(uniqueStarts);
    setPage(prev => Math.min(prev, uniqueStarts.length - 1));
  }, [collect]);

  // Keep visibility in sync so items outside the active page window never bleed into view or overlap
  React.useLayoutEffect(() => {
    const view = viewportRef.current;
    const track = trackRef.current;
    if (!view || !track) return;
    const kids = Array.from(track.children);
    if (!kids.length) return;

    if (pages.length <= 1) {
      kids.forEach(k => {
        k.style.visibility = '';
        k.style.pointerEvents = '';
      });
      return;
    }

    const curStart = pages[page] || 0;
    const nextStart = page < pages.length - 1 ? pages[page + 1] : Infinity;

    kids.forEach(kid => {
      let top = 0, node = kid;
      while (node && node !== view) {
        top += node.offsetTop;
        node = node.offsetParent;
      }
      const bottom = top + kid.offsetHeight;

      const isPast = bottom <= curStart + 4;
      const isFuture = top >= nextStart - 4;

      if (isPast || isFuture) {
        kid.style.visibility = 'hidden';
        kid.style.pointerEvents = 'none';
      } else {
        kid.style.visibility = '';
        kid.style.pointerEvents = '';
      }
    });
  }, [page, pages]);

  React.useLayoutEffect(() => {
    const view = viewportRef.current, track = trackRef.current;
    if (!view || !track) return;
    const run = () => measure();
    run();
    const raf = requestAnimationFrame(run);           // after fonts/images settle
    const ro = new ResizeObserver(run);
    ro.observe(view);
    ro.observe(track);
    Array.from(track.children).forEach(kid => ro.observe(kid));
    window.addEventListener('resize', run);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('resize', run); };
  }, [measure, children]);

  const pageCount = pages.length;
  const pct = pageCount > 1 ? ((page + 1) / pageCount) * 100 : 100;
  const { display, flexDirection, gap, padding, paddingRight, paddingLeft, paddingTop, paddingBottom, ...restScroll } = scrollStyle || {};

  return (
    <div
      className={className}
      style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', ...containerStyle }}
    >
      <style>{`
        @keyframes lpTurnFwd {
          from { transform: translateX(14%) rotateY(-16deg) scale(.965); opacity: 0; }
          60%  { opacity: 1; }
          to   { transform: translateX(0) rotateY(0deg) scale(1); opacity: 1; }
        }
        @keyframes lpTurnBack {
          from { transform: translateX(-14%) rotateY(16deg) scale(.965); opacity: 0; }
          60%  { opacity: 1; }
          to   { transform: translateX(0) rotateY(0deg) scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes lpTurnFwd  { from { opacity: 0; } to { opacity: 1; } }
          @keyframes lpTurnBack { from { opacity: 0; } to { opacity: 1; } }
        }
      `}</style>
      {showProgress && pageCount > 1 && (
        <div style={{ flexShrink: 0, height: '4px', borderRadius: '999px', background: 'rgba(14,42,69,0.10)', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#F5A623', borderRadius: '999px', transition: 'width 0.35s ease' }} />
        </div>
      )}

      <div
        ref={viewportRef}
        style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative', perspective: '1600px', ...restScroll }}
      >
        {/* the sheet turns like a page; the track inside it just holds the offset */}
        <div
          ref={sheetRef}
          style={{
            height: '100%',
            transformOrigin: dir > 0 ? 'left center' : 'right center',
            willChange: 'transform, opacity'
          }}
        >
          <div
            ref={trackRef}
            style={{
              display: display || 'block',
              flexDirection,
              gap,
              padding, paddingRight, paddingLeft, paddingTop, paddingBottom,
              transform: `translateY(${-pages[page]}px)`
            }}
          >
            {children}
          </div>
        </div>
      </div>

      <PageBar
        currentPage={page}
        pageCount={pageCount}
        showNextBtn={showNextBtn}
        onPageUp={(to) => { setDir(-1); setPage(p => (typeof to === 'number' ? to : Math.max(0, p - 1))); }}
        onPageDown={(to) => { setDir(1); setPage(p => (typeof to === 'number' ? to : Math.min(pageCount - 1, p + 1))); }}
      />
    </div>
  );
}
