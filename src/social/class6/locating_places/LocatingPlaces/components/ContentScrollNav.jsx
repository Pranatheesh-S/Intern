import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

export default function ContentScrollNav({
  currentPage = 0,
  pageCount = 1,
  canGoUp = false,
  canGoDown = false,
  onPageUp,
  onPageDown,
  showWhenSinglePage = false
}) {
  if (!showWhenSinglePage && pageCount <= 1) return null;

  return (
    <div style={{
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      paddingTop: '10px'
    }}>
      <button
        type="button"
        onClick={onPageUp}
        disabled={!canGoUp}
        aria-label="Back to top"
        style={navBtnStyle(canGoUp)}
        onMouseOver={e => { if (canGoUp) e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <ChevronUp size={22} strokeWidth={2.5} />
        Back to top
      </button>
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#5c6b7a', minWidth: '48px', textAlign: 'center' }}>
        {currentPage + 1} / {pageCount}
      </span>
      <button
        type="button"
        onClick={onPageDown}
        disabled={!canGoDown}
        aria-label="Go to bottom section"
        style={navBtnStyle(canGoDown)}
        onMouseOver={e => { if (canGoDown) e.currentTarget.style.transform = 'translateY(1px)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        Bottom
        <ChevronDown size={22} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function navBtnStyle(enabled) {
  return {
    fontFamily: '"Space Grotesk", system-ui, -apple-system, sans-serif',
    fontWeight: 600,
    fontSize: '13px',
    border: 'none',
    background: 'transparent',
    color: enabled ? '#0E3556' : '#cbd5e1',
    cursor: enabled ? 'pointer' : 'not-allowed',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '4px 6px',
    transition: 'color 0.2s, transform 0.2s'
  };
}

export function ScrollableWithNav({ children, containerStyle, scrollStyle, className }) {
  const scrollRef = React.useRef(null);
  const nav = useScrollNav(scrollRef);

  return (
    <div
      className={className}
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        ...containerStyle
      }}
    >
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          ...scrollStyle
        }}
      >
        {children}
      </div>
      {nav.hasOverflow && (
        <ContentScrollNav
          currentPage={nav.currentPage}
          pageCount={nav.pageCount}
          canGoUp={nav.canGoUp}
          canGoDown={nav.canGoDown}
          onPageUp={nav.onPageUp}
          onPageDown={nav.onPageDown}
        />
      )}
    </div>
  );
}
