import React, { useState, useEffect } from 'react';

/**
 * Four-corner expand/enter fullscreen icon:
 * ┌       ┐
 * └       ┘
 */
const FullscreenEnterIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block' }}
  >
    {/* Top-Left Bracket ┌ */}
    <path d="M3 9V5a2 2 0 0 1 2-2h4" />
    {/* Top-Right Bracket ┐ */}
    <path d="M15 3h4a2 2 0 0 1 2 2v4" />
    {/* Bottom-Left Bracket └ */}
    <path d="M3 15v4a2 2 0 0 0 2 2h4" />
    {/* Bottom-Right Bracket ┘ */}
    <path d="M15 21h4a2 2 0 0 0 2-2v-4" />
  </svg>
);

/**
 * Four-corner collapse/exit fullscreen icon:
 * ┘       └
 * ┐       ┌
 */
const FullscreenExitIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block' }}
  >
    {/* Top-Left Inward Bracket ┘ */}
    <path d="M9 3v4a2 2 0 0 1-2 2H3" />
    {/* Top-Right Inward Bracket └ */}
    <path d="M15 3v4a2 2 0 0 0 2 2h4" />
    {/* Bottom-Left Inward Bracket ┐ */}
    <path d="M9 21v-4a2 2 0 0 0-2-2H3" />
    {/* Bottom-Right Inward Bracket ┌ */}
    <path d="M15 21v-4a2 2 0 0 1 2-2h4" />
  </svg>
);

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(
    typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        Boolean(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        )
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      const isCurrentlyFullscreen = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      if (!isCurrentlyFullscreen) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          await document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.msRequestFullscreen) {
          await document.documentElement.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  const tooltipText = isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen';

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      title={tooltipText}
      aria-label={tooltipText}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 999999,
        width: '42px',
        height: '42px',
        padding: 0,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        backgroundColor: isHovered ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.82)',
        color: isHovered ? '#38bdf8' : '#f8fafc',
        border: isHovered ? '1px solid rgba(56, 189, 248, 0.8)' : '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: isHovered
          ? '0 6px 20px rgba(0, 0, 0, 0.45), 0 0 14px rgba(56, 189, 248, 0.35)'
          : '0 4px 14px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        cursor: 'pointer',
        outline: 'none',
        transform: isPressed ? 'scale(0.94)' : isHovered ? 'scale(1.06)' : 'scale(1)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {isFullscreen ? <FullscreenExitIcon size={20} /> : <FullscreenEnterIcon size={20} />}
    </button>
  );
}
