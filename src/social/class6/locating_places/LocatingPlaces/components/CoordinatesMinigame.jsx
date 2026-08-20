import React, { useState } from 'react';
import './CoordinatesMinigame.css';
import worldMapUrl from './world-map.jpg';

const cities = [
  { name: "Delhi", lat: 28.6, lon: 77.2, desc: "Capital of India" },
  { name: "Mumbai", lat: 19.1, lon: 72.9, desc: "Financial capital of India" },
  { name: "Kolkata", lat: 22.6, lon: 88.4, desc: "City of Joy" },
  { name: "Singapore", lat: 1.3, lon: 103.8, desc: "Island city-state in SE Asia" },
  { name: "Paris", lat: 48.9, lon: 2.3, desc: "Capital of France" }
];

export default function CoordinatesMinigame({ onComplete, onBack }) {
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [userLat, setUserLat] = useState(0);
  const [userLon, setUserLon] = useState(0);
  const [modalState, setModalState] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentCity = cities[currentCityIndex];

  const getTop = (lat) => `${((90 - lat) / 180) * 100}%`;
  
  const getLeft = (lon) => `${((lon + 180) / 360) * 100}%`;

  const handleConfirm = () => {
    const latDiff = Math.abs(userLat - currentCity.lat);
    const lonDiff = Math.abs(userLon - currentCity.lon);
    
    if (latDiff <= 6 && lonDiff <= 6) {
      setModalState('correct');
    } else {
      setModalState('incorrect');
    }
  };

  const handleNextCity = () => {
    setModalState(null);
    if (currentCityIndex < cities.length - 1) {
      setCurrentCityIndex(c => c + 1);
      setUserLat(0);
      setUserLon(0);
    } else {
      if (onComplete) onComplete();
    }
  };

  const mapRef = React.useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateCoordinatesFromEvent = (e) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    // Clamp to map boundaries
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    const lat = 90 - (y / rect.height) * 180;
    const lon = (x / rect.width) * 360 - 180;

    setUserLat(parseFloat(lat.toFixed(1)));
    setUserLon(parseFloat(lon.toFixed(1)));
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);
    updateCoordinatesFromEvent(e);
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      updateCoordinatesFromEvent(e);
    }
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="coords-minigame-container">
      {/* Left Pane - Map */}
      <div className="coords-mini-left">
        <div className="coords-mini-header">
          {onBack && (
            <button className="coords-mini-back" onClick={onBack}>
              &larr; Back to Globe
            </button>
          )}
          <div className="coords-mini-chapter">CHAPTER 1 &bull; CLASS 6 SOCIAL SCIENCE</div>
          <div className="coords-mini-title">Locating Places<br/>on the Earth</div>
        </div>
        
        <div 
          className={`coords-mini-map-box ${isFullscreen ? 'fullscreen' : ''}`}
          ref={mapRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: 'none', cursor: 'crosshair' }}
        >
          <button 
            className="fullscreen-btn" 
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(!isFullscreen); }}
            onPointerDown={(e) => e.stopPropagation()}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            )}
          </button>
          <img src={worldMapUrl} alt="World Map" className="coords-mini-map-image" style={{ pointerEvents: 'none', userSelect: 'none', WebkitUserSelect: 'none' }} draggable="false" />
          
          {/* Static Reference Lines */}
          <div className="coords-mini-equator" style={{ top: '50%' }}></div>
          <div className="coords-mini-prime-meridian" style={{ left: '50%' }}></div>

          {/* Target */}
          <div className="coords-mini-target" style={{ top: getTop(currentCity.lat), left: getLeft(currentCity.lon) }}>
            <div className="target-pulse"></div>
          </div>

          {/* User Crosshairs */}
          <div className="coords-mini-hline" style={{ top: getTop(userLat) }}></div>
          <div className="coords-mini-vline" style={{ left: getLeft(userLon) }}></div>
          <div className="coords-mini-user-point" style={{ top: getTop(userLat), left: getLeft(userLon) }}></div>
        </div>
      </div>

      {/* Right Pane - Controls */}
      <div className="coords-mini-right">
        <div className="coords-mini-task-header">
          <svg className="compass-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
          TASK 3: FIND THE PLACE
        </div>

        <div className="coords-mini-info-box">
          <h3>Pinpointing Locations</h3>
          <p>By crossing latitude and longitude, we create a global grid. Let&apos;s practice finding coordinates.</p>
        </div>

        <div className="coords-mini-city-card">
          <div className="city-card-top">
            <h2>Find {currentCity.name}</h2>
            <div className="city-counter">{currentCityIndex + 1} / {cities.length}</div>
          </div>
          <p className="city-target-desc">
            Target: {Math.abs(currentCity.lat)}&deg;{currentCity.lat >= 0 ? 'N' : 'S'}, {Math.abs(currentCity.lon)}&deg;{currentCity.lon >= 0 ? 'E' : 'W'} ({currentCity.desc})
          </p>
        </div>

        <div className="coords-mini-sliders">
          <div className="slider-row">
            <label>Latitude: {userLat}&deg;</label>
            <label>Longitude: {userLon}&deg;</label>
          </div>
          
          <div className="slider-row inputs">
            <input 
              type="range" 
              min="-90" 
              max="90" 
              value={userLat} 
              onChange={(e) => setUserLat(Number(e.target.value))} 
              className="styled-slider lat-slider" 
              style={{ background: `linear-gradient(to right, #ef4444 ${((userLat + 90) / 180) * 100}%, #e2e8f0 ${((userLat + 90) / 180) * 100}%)` }}
            />
            <input 
              type="range" 
              min="-180" 
              max="180" 
              value={userLon} 
              onChange={(e) => setUserLon(Number(e.target.value))} 
              className="styled-slider lon-slider" 
              style={{ background: `linear-gradient(to right, #38bdf8 ${((userLon + 180) / 360) * 100}%, #e2e8f0 ${((userLon + 180) / 360) * 100}%)` }}
            />
          </div>
        </div>

        <button className="coords-mini-confirm-btn" onClick={handleConfirm}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          Confirm Coordinates
        </button>
      </div>

      {/* Modal */}
      {modalState && (
        <div className="coords-mini-modal-bg">
          <div className="coords-mini-modal">
            {modalState === 'correct' ? (
              <>
                <div className="modal-icon-success">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h2>Correct!</h2>
                <p>You found {currentCity.name}. {currentCityIndex < cities.length - 1 ? "Let's find the next one!" : "Mission Accomplished!"}</p>
                <button className="modal-btn-success" onClick={handleNextCity}>Continue</button>
              </>
            ) : (
              <>
                <button className="modal-close" onClick={() => setModalState(null)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <h2>Not quite!</h2>
                <p>{currentCity.name} is at {Math.abs(currentCity.lat)}&deg;{currentCity.lat >= 0 ? 'N' : 'S'}, {Math.abs(currentCity.lon)}&deg;{currentCity.lon >= 0 ? 'E' : 'W'}. Adjust the sliders closer.</p>
                <button className="modal-btn-retry" onClick={() => setModalState(null)}>Try Again</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
