import React from 'react';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';

const VARIANT_CLASS = {
  navy: 'edu-btn--navy',
  green: 'edu-btn--green',
  blue: 'edu-btn--blue',
  outline: 'edu-btn--outline'
};

export default function EduButton({
  children,
  onClick,
  disabled = false,
  variant = 'green',
  type = 'button',
  className = '',
  iconLeft = null,
  iconRight = null,
  ariaLabel
}) {
  const variantClass = VARIANT_CLASS[variant] || VARIANT_CLASS.green;

  return (
    <button
      type={type}
      className={`edu-btn ${variantClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}

export function ChapterBackFooter({
  onBack,
  nextLabel,
  onNext,
  nextDisabled = false,
  nextVariant = 'green',
  centerContent = null
}) {
  if (!onBack && !nextLabel) return null;

  return (
    <footer className="edu-bottom-footer">
      <div className="edu-bottom-footer__side">
        {onBack ? (
          <EduButton variant="navy" onClick={onBack} iconLeft={<ArrowLeft size={16} strokeWidth={2.5} />}>
            Back
          </EduButton>
        ) : (
          <span aria-hidden="true" style={{ width: 1 }} />
        )}
      </div>

      {centerContent && (
        <div className="edu-bottom-footer__center">{centerContent}</div>
      )}

      <div className="edu-bottom-footer__side" style={{ marginLeft: centerContent ? 0 : 'auto' }}>
        {nextLabel && onNext ? (
          <EduButton
            variant={nextVariant}
            onClick={onNext}
            disabled={nextDisabled}
            iconRight={
              !nextDisabled && (
                nextVariant === 'navy'
                  ? <ChevronRight size={16} strokeWidth={2.5} />
                  : <ArrowRight size={16} strokeWidth={2.5} />
              )
            }
          >
            {nextLabel}
          </EduButton>
        ) : (
          <span aria-hidden="true" style={{ width: 1 }} />
        )}
      </div>
    </footer>
  );
}
