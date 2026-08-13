import React from 'react';
import coverImg from '../../../../../../assets/materials-around-us-cover.png';

export default function ChapterCover({ onOpenBook, onBack }) {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        zIndex: 10000
      }}
    >
      <style>{`
        html, body, #root {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>

      <img 
        src={coverImg} 
        alt="Materials Around Us - Chapter Cover" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          border: 'none',
          margin: 0,
          padding: 0
        }}
      />

      {/* Transparent Clickable Overlay for Visual BACK Button */}
      <button
        onClick={onBack}
        aria-label="Back"
        title="Back"
        style={{
          position: 'absolute',
          left: '3.4%',
          top: '86.5%',
          width: '13%',
          height: '7.5%',
          background: 'transparent',
          border: 'none',
          borderRadius: '9999px',
          cursor: 'pointer',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          transition: 'background-color 0.15s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      />

      {/* Transparent Clickable Overlay for Visual ENTER LAB Button */}
      <button
        onClick={onOpenBook}
        aria-label="Enter Lab"
        title="Enter Lab"
        style={{
          position: 'absolute',
          left: '53.3%',
          top: '67.2%',
          width: '38.4%',
          height: '13.8%',
          background: 'transparent',
          border: 'none',
          borderRadius: '9999px',
          cursor: 'pointer',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
          transition: 'background-color 0.15s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      />
    </div>
  );
}


