import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function ChapterTabBar({
  tabs,
  currentStep,
  onTabSelect,
  onBack,
  backLabel = 'Back to Main Page',
  navRef
}) {
  return (
    <header className="edu-chapter-tab-bar">
      <div className="edu-chapter-tab-bar__row">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="edu-chapter-tab-bar__back"
            title={backLabel}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to</span>
            <span>Main Page</span>
          </button>
        )}

        <div className="edu-chapter-tab-bar__nav-scroll">
          <nav
            ref={navRef}
            className="edu-chapter-tab-bar__nav"
            style={{ '--edu-tab-count': tabs.length }}
            aria-label="Chapter sections"
          >
            {tabs.map((tab) => {
              const isActive = currentStep === tab.id;
              const isCompleted = currentStep > tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  data-active={isActive}
                  disabled={tab.locked}
                  onClick={() => !tab.locked && onTabSelect(tab.id)}
                  className={`edu-chapter-tab${isActive ? ' edu-chapter-tab--active' : ''}${tab.locked ? ' edu-chapter-tab--locked' : ''}`}
                >
                  <div className="edu-chapter-tab__num">
                    {isCompleted ? <CheckCircle size={14} aria-hidden="true" /> : tab.id}
                  </div>
                  <div className="edu-chapter-tab__text">
                    <span className="edu-chapter-tab__title">{tab.title}</span>
                    {tab.subtitle && (
                      <span className="edu-chapter-tab__subtitle">{tab.subtitle}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
