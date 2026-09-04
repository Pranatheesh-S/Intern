import React, { useState } from 'react';
import './CoordinatesMinigame.css';
import worldMapUrl from './world-map.jpg';

const cities = [
  { name: "Delhi", lat: 28.6, lon: 77.2, desc: "Capital of India", flag: "🇮🇳", funFact: "Delhi's Red Fort was built by the same emperor who commissioned the Taj Mahal!" },
  { name: "Mumbai", lat: 19.1, lon: 72.9, desc: "Financial capital of India", flag: "🇮🇳", funFact: "Mumbai was originally an archipelago of seven separate islands!" },
  { name: "Kolkata", lat: 22.6, lon: 88.4, desc: "City of Joy", flag: "🇮🇳", funFact: "Kolkata has the oldest operating electric tram network in Asia." },
  { name: "Singapore", lat: 1.3, lon: 103.8, desc: "Island city-state in SE Asia", flag: "🇸🇬", funFact: "Singapore consists of one main island and 63 smaller satellite islands." },
  { name: "Paris", lat: 48.9, lon: 2.3, desc: "Capital of France", flag: "🇫🇷", funFact: "The Eiffel Tower was originally intended to be a temporary installation!" }
];

export default function CoordinatesMinigame({ onComplete, onBack }) {
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [userLat, setUserLat] = useState(0);
  const [userLon, setUserLon] = useState(0);
  const [modalState, setModalState] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [options, setOptions] = useState([]);
  const [guessFeedback, setGuessFeedback] = useState(null);

  const currentCity = cities[currentCityIndex];

  React.useEffect(() => {
    const others = cities.filter(c => c.name !== currentCity.name).sort(() => 0.5 - Math.random()).slice(0, 3);
    const allOptions = [currentCity, ...others].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  }, [currentCityIndex]);

  const getTop = (lat) => `${((90 - lat) / 180) * 100}%`;
  const getLeft = (lon) => `${((lon + 180) / 360) * 100}%`;

  const latDiff = Math.abs(userLat - currentCity.lat);
  const lonDiff = Math.abs(userLon - currentCity.lon);
  const totalDiff = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
  
  let tempClass = "cold";
  if (totalDiff < 3) tempClass = "hot";
  else if (totalDiff < 15) tempClass = "warm";

  const handleConfirm = () => {
    if (latDiff <= 1.5 && lonDiff <= 1.5) {
      setModalState('question');
    } else {
      setModalState('incorrect');
    }
  };

  const handleNextCity = () => {
    setModalState(null);
    setShowCelebration(false);
    setGuessFeedback(null);
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
          <div className="coords-mini-title">Locating Places on the Earth</div>
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
          
          {/* Axis Labels */}
          {[-60, -45, -30, -15, 0, 15, 30, 45, 60].map(lat => (
            <div key={`lat-${lat}`} className="map-axis-label lat-label" style={{ top: getTop(lat) }}>
              {lat === 0 ? '0°' : `${Math.abs(lat)}°${lat > 0 ? 'N' : 'S'}`}
            </div>
          ))}
          {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map(lon => (
            <React.Fragment key={`lon-${lon}`}>
              <div className="map-axis-label lon-label-bottom" style={{ left: getLeft(lon) }}>
                {lon === 0 ? '0°' : `${Math.abs(lon)}°${lon > 0 ? 'E' : 'W'}`}
              </div>
              <div className="map-axis-label lon-label-top" style={{ left: getLeft(lon) }}>
                {lon === 0 ? '0°' : `${Math.abs(lon)}°${lon > 0 ? 'E' : 'W'}`}
              </div>
            </React.Fragment>
          ))}

          {/* Static Reference Lines */}
          <div className="coords-mini-equator" style={{ top: '50%' }}></div>
          <div className="coords-mini-prime-meridian" style={{ left: '50%' }}></div>

          {/* Target */}
          <div className="coords-mini-target" style={{ top: getTop(currentCity.lat), left: getLeft(currentCity.lon) }}>
            <div className="target-pulse"></div>
            {showCelebration && <div className="celebration-ripple"></div>}
          </div>

          {/* User Crosshairs */}
          <div className={`coords-mini-hline ${tempClass}`} style={{ top: getTop(userLat) }}></div>
          <div className={`coords-mini-vline ${tempClass}`} style={{ left: getLeft(userLon) }}></div>
          <div className={`coords-mini-user-point ${tempClass}`} style={{ top: getTop(userLat), left: getLeft(userLon) }}></div>
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
            <h2>Move to Coordinates</h2>
            <div className="city-counter">{currentCityIndex + 1} / {cities.length}</div>
          </div>
          <p className="city-target-desc" style={{ fontSize: '18px', padding: '10px 0' }}>
            Target: <strong>{Math.abs(currentCity.lat)}&deg;{currentCity.lat >= 0 ? 'N' : 'S'}, {Math.abs(currentCity.lon)}&deg;{currentCity.lon >= 0 ? 'E' : 'W'}</strong>
          </p>
        </div>

        <div className="coords-mini-sliders">
          <div className="slider-row">
            <label>Latitude</label>
            <label>Longitude</label>
          </div>
          
          <div className="slider-row inputs">
            <div className="slider-wrapper">
              <div className="slider-tooltip lat-tooltip" style={{ left: `${((userLat + 90) / 180) * 100}%` }}>
                {Math.abs(userLat).toFixed(1)}&deg;{userLat >= 0 ? 'N' : 'S'}
              </div>
              <input 
                type="range" 
                min="-90" 
                max="90" 
                step="0.1"
                value={userLat} 
                onChange={(e) => setUserLat(Number(e.target.value))} 
                className="styled-slider lat-slider" 
                style={{ background: `linear-gradient(to right, #ef4444 ${((userLat + 90) / 180) * 100}%, #e2e8f0 ${((userLat + 90) / 180) * 100}%)` }}
              />
            </div>
            
            <div className="slider-wrapper">
              <div className="slider-tooltip lon-tooltip" style={{ left: `${((userLon + 180) / 360) * 100}%` }}>
                {Math.abs(userLon).toFixed(1)}&deg;{userLon >= 0 ? 'E' : 'W'}
              </div>
              <input 
                type="range" 
                min="-180" 
                max="180" 
                step="0.1"
                value={userLon} 
                onChange={(e) => setUserLon(Number(e.target.value))} 
                className="styled-slider lon-slider" 
                style={{ background: `linear-gradient(to right, #38bdf8 ${((userLon + 180) / 360) * 100}%, #e2e8f0 ${((userLon + 180) / 360) * 100}%)` }}
              />
            </div>
          </div>
        </div>

        <button className="coords-mini-confirm-btn" onClick={handleConfirm}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="M13 13l6 6"></path></svg>
          Confirm Coordinates
        </button>
      </div>

      {/* Modal */}
      {modalState && (
        <div className="coords-mini-modal-bg">
          <div className="coords-mini-modal">
            {modalState === 'question' ? (
              <>
                <h2>Which city is this?</h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px', margin: '24px 0'}}>
                  {options.map(opt => (
                    <button 
                      key={opt.name}
                      style={{
                        background: '#FFF9F0', border: '2px solid #F2DFBC', color: '#78350F', 
                        padding: '16px', borderRadius: '12px', cursor: 'pointer', 
                        fontSize: '16px', fontWeight: 'bold', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = '#F2DFBC'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = '#FFF9F0'; }}
                      onClick={() => {
                        if(opt.name === currentCity.name) {
                          setModalState('correct');
                          setShowCelebration(true);
                          setGuessFeedback(null);
                        } else {
                          setGuessFeedback(`Not ${opt.name}. Try again!`);
                        }
                      }}
                    >
                      <span>{opt.name}</span>
                      <span>{opt.flag}</span>
                    </button>
                  ))}
                </div>
                {guessFeedback && <div style={{color: '#ef4444', fontWeight: 'bold', fontSize: '15px'}}>{guessFeedback}</div>}
              </>
            ) : modalState === 'correct' ? (
              <>
                <div className="modal-icon-success">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h2>Correct!</h2>
                <p style={{fontSize: '18px', fontWeight: '800', color: '#16A34A', marginBottom: '16px'}}>
                  Yes, the city is {currentCity.name}! {currentCity.flag}
                </p>
                <div className="modal-fun-fact">
                  <strong>Fun Fact:</strong> {currentCity.funFact}
                </div>
                <button className="modal-btn-success" onClick={handleNextCity}>
                  {currentCityIndex < cities.length - 1 ? "Next City" : "Finish"}
                </button>
              </>
            ) : (
              <>
                <button className="modal-close" onClick={() => setModalState(null)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <h2>Not quite!</h2>
                <p>You haven't reached the target coordinates yet. Adjust the sliders closer to {Math.abs(currentCity.lat)}&deg;{currentCity.lat >= 0 ? 'N' : 'S'}, {Math.abs(currentCity.lon)}&deg;{currentCity.lon >= 0 ? 'E' : 'W'}.</p>
                <button className="modal-btn-retry" onClick={() => setModalState(null)}>Try Again</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
