import React from 'react';
import coverImage from '../../../../../../assets/materials-around-us-cover.png';

export default function ChapterCover({ onOpenBook, onBack }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        zIndex: 10000,
        userSelect: 'none',
        backgroundColor: '#FFFFFF'
      }}
    >
      <style>{`
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
        }
      `}</style>

      <img
        src={coverImage}
        alt="Materials Around Us - Chemistry Lab Cover"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block'
        }}
      />

      {/* Transparent Clickable Overlay for ENTER LAB button */}
      <button
        onClick={onOpenBook}
        aria-label="Enter Lab"
        title="Enter Lab"
        style={{
          position: 'absolute',
          top: 'calc(67.87% + 1.5vh)',
          left: '53.68%',
          width: '37.79%',
          height: '13.38%',
          background: '#A64B27',
          border: 'none',
          borderRadius: '9999px',
          cursor: 'pointer',
          outline: 'none',
          transition: 'transform 0.15s ease, filter 0.15s ease',
          zIndex: 2
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.filter = 'brightness(1.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1.0)';
          e.currentTarget.style.filter = 'brightness(1.0)';
        }}
      />

      {/* Transparent Clickable Overlay for BACK button */}
      <button
        onClick={onBack}
        aria-label="Back"
        title="Back"
        style={{
          position: 'absolute',
          top: 'calc(87.21% + 1.5vh)',
          left: '3.78%',
          width: '12.44%',
          height: '6.54%',
          background: '#A64B27',
          border: 'none',
          borderRadius: '9999px',
          cursor: 'pointer',
          outline: 'none',
          transition: 'transform 0.15s ease, filter 0.15s ease',
          zIndex: 2
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)';
          e.currentTarget.style.filter = 'brightness(1.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1.0)';
          e.currentTarget.style.filter = 'brightness(1.0)';
        }}
      />
    </div>
  );
}

