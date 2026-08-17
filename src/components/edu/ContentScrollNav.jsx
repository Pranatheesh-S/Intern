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
    <div className="edu-scroll-nav">
      <button
        type="button"
        onClick={onPageUp}
        disabled={!canGoUp}
        aria-label="Back to top"
        className="edu-btn edu-btn--ghost-nav"
      >
        <ChevronUp size={22} strokeWidth={2.5} />
        Back to top
      </button>
      <span className="edu-scroll-nav__label">
        {currentPage + 1} / {pageCount}
      </span>
      <button
        type="button"
        onClick={onPageDown}
        disabled={!canGoDown}
        aria-label="Go to bottom section"
        className="edu-btn edu-btn--ghost-nav"
      >
        Bottom
        <ChevronDown size={22} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export function ScrollableWithNav({ children, containerClassName = '', scrollClassName = '' }) {
  return (
    <div className={`edu-scroll-container ${containerClassName}`.trim()}>
      <div className={`edu-scroll-region ${scrollClassName}`.trim()}>
        {children}
      </div>
    </div>
  );
}

export function SectionHeader({ icon, children, className = '' }) {
  return (
    <h2 className={`edu-section-heading ${className}`.trim()}>
      {icon && <span className="edu-section-heading-icon" aria-hidden="true">{icon}</span>}
      {children}
    </h2>
  );
}

export function KeyIdeaCard({ emoji, label, title, description }) {
  return (
    <div className="edu-key-idea-card">
      <div className="edu-key-idea-emoji" aria-hidden="true">{emoji}</div>
      <div className="edu-key-idea-body">
        <div className="edu-key-idea-label">{label}</div>
        <div className="edu-key-idea-title">{title}</div>
        <div className="edu-key-idea-desc">{description}</div>
      </div>
    </div>
  );
}

export function ActivityShell({ children, fixed = false, className = '' }) {
  return (
    <div className={`edu-activity-shell${fixed ? ' edu-activity-shell--fixed' : ''} ${className}`.trim()}>
      {children}
    </div>
  );
}
