import React from 'react';
import { motion } from 'framer-motion';

/**
 * Full-screen book spread shell — Materials Around Us master layout.
 * Content slots preserve each chapter's own educational material.
 */
export default function EduBookSpread({
  overlayClassName = '',
  frameClassName = '',
  backButton = null,
  nextButton = null,
  leftPage,
  rightPage,
  rightPageRef = null,
  onRightScroll = null,
  animate = true
}) {
  const frame = (
    <div className={`edu-book-frame book-frame ${frameClassName}`.trim()}>
      <div className="edu-book-spread spread">
        <div className="edu-page-left page-spread left-page">{leftPage}</div>
        <div
          className="edu-page-right page-spread right-page"
          ref={rightPageRef}
          onScroll={onRightScroll}
        >
          {rightPage}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`edu-book-overlay ${overlayClassName}`.trim()}>
      {backButton}
      {nextButton}
      {animate ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ width: '100%', height: '100%' }}
        >
          {frame}
        </motion.div>
      ) : (
        frame
      )}
    </div>
  );
}
