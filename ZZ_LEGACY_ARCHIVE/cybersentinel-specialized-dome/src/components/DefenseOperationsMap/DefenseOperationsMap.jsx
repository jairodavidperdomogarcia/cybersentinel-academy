import React, { useState, useEffect } from 'react';

const DefenseOperationsMap = ({ isSpoofed, onToggleSpoof }) => {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [is3D, setIs3D] = useState(false);
  
  // Use state for flights so they can move
  const [flights, setFlights] = useState([
    { id: 'UA-442', angle: 45, dist: 120, type: 'friendly', speed: 0.2, alt: 320, kts: 440, history: [] },
    { id: 'LH-901', angle: 160, dist: 180, type: 'friendly', speed: -0.15, alt: 280, kts: 390, history: [] },
    { id: 'AF-220', angle: 280, dist: 90, type: 'friendly', speed: 0.3, alt: 150, kts: 250, history: [] },
  ]);

  const [ghosts, setGhosts] = useState([]);

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);

      // Move real flights & Update History
      setFlights(current => current.map(f => {
        const newAngle = (f.angle + f.speed + 360) % 360;
        const newDist = f.dist + (Math.sin(Date.now() / 1000 + f.angle) * 0.2);
        
        // Add history point every ~10 frames (approx every 0.5s)
        let newHistory = f.history;
        if (Math.floor(Date.now() / 50) % 10 === 0) {
           newHistory = [...f.history, { angle: f.angle, dist: f.dist }].slice(-5); // Keep last 5 dots
        }

        return {
          ...f,
          angle: newAngle,
          dist: newDist,
          history: newHistory
        };
      }));

      // Handle ghosts
      if (isSpoofed) {
        setGhosts(current => {
          let updated = current.map(g => ({
            ...g,
            angle: (g.angle + (Math.random() - 0.5) * 5 + 360) % 360,
            dist: Math.max(10, Math.min(190, g.dist + (Math.random() - 0.5) * 10)),
            life: g.life - 1
          })).filter(g => g.life > 0);

          if (updated.length < 5 && Math.random() > 0.8) {
            updated.push({
              id: `GHOST-${Math.floor(Math.random() * 999)}`,
              angle: Math.random() * 360,
              dist: 50 + Math.random() * 100,
              type: 'hostile',
              life: 50 + Math.random() * 50,
              alt: 'ERR',
              kts: 'ERR',
              isGhost: true,
              history: []
            });
          }
          return updated;
        });
      } else {
        setGhosts([]);
      }

    }, 50);

    return () => clearInterval(interval);
  }, [isSpoofed]);

  const allBlips = [...flights, ...ghosts];

  // Helper to get XY from Polar
  const getXY = (angle, dist) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: 200 + dist * Math.cos(rad),
      y: 150 + dist * Math.sin(rad)
    };
  };

  const getBlipOpacity = (blipAngle, currentRotation) => {
    let diff = (currentRotation - blipAngle + 360) % 360;
    if (diff < 60) return 1 - (diff / 60);
    return 0.15;
  };

  // Zoom Handler
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  return (
    <div 
      onWheel={handleWheel}
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '500px', 
        background: 'rgba(2, 6, 23, 0.5)', 
        backdropFilter: 'blur(4px)', 
        borderRadius: '8px', 
        overflow: 'hidden',
        border: '2px solid #1e293b',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* HUD Header (Fixed 2D Overlay) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.95), rgba(2, 6, 23, 0))',
        zIndex: 20,
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: '#22c55e', fontFamily: 'monospace', fontSize: '0.8rem', textShadow: '0 0 5px rgba(34, 197, 94, 0.5)' }}>
            RADAR: ACTIVE (SSR MODE S)
          </span>
          <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            RANGE: {(300 / zoom).toFixed(0)}NM
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: isSpoofed ? '#ef4444' : '#22c55e',
            boxShadow: isSpoofed ? '0 0 10px #ef4444' : '0 0 5px #22c55e',
            animation: isSpoofed ? 'pulse 0.5s infinite' : 'none'
          }} />
          <span style={{ 
            color: isSpoofed ? '#ef4444' : '#22c55e', 
            fontFamily: 'monospace', 
            fontWeight: 'bold',
            fontSize: '0.8rem'
          }}>
            {isSpoofed ? 'SIGNAL INTEGRITY: CRITICAL' : 'SIGNAL INTEGRITY: NOMINAL'}
          </span>
        </div>
      </div>

      {/* 3D Viewport Container */}
      <div style={{ 
        flex: 1, 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        perspective: '1000px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: is3D 
            ? `rotateX(60deg) scale(${zoom}) translateZ(0)` 
            : `scale(${zoom}) translateZ(0)`,
          transformStyle: 'preserve-3d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="100%" height="100%" viewBox="0 0 400 300" style={{ 
            background: is3D ? 'radial-gradient(circle, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.8) 70%)' : 'rgba(5, 10, 16, 0.5)',
            boxShadow: is3D ? '0 20px 50px rgba(0,0,0,0.5)' : 'none'
          }}>
            
            {/* --- MAP LAYER (Geography) --- */}
            <g opacity="0.3" stroke="#334155" strokeWidth="1" fill="none">
               {/* Abstract Coastline */}
               <path d="M -50 50 Q 50 80 100 50 T 200 80 T 300 40 T 450 60" />
               <path d="M 250 350 Q 280 250 350 200" />
               {/* Restricted Area */}
               <path d="M 50 200 L 80 180 L 100 220 Z" stroke="#ef4444" strokeDasharray="4 2" fill="rgba(239, 68, 68, 0.1)" />
            </g>

            {/* --- AIRPORT SYMBOLS --- */}
            <g transform="translate(200, 150)">
               {/* Main Airport (Center) */}
               <path d="M -10 -5 L 10 -5 M -10 5 L 10 5" stroke="#94a3b8" strokeWidth="2" />
               <circle r="15" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" fill="none" />
               <text y="25" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="monospace">KCYB INTL</text>
            </g>

            {/* --- COMPASS RING --- */}
            <g opacity="0.6">
              <text x="200" y="20" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">N</text>
              <text x="380" y="150" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">E</text>
              <text x="200" y="290" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">S</text>
              <text x="20" y="150" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">W</text>
              
              {/* Degree ticks */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
                 const rad = (deg - 90) * (Math.PI / 180);
                 const x1 = 200 + 140 * Math.cos(rad);
                 const y1 = 150 + 140 * Math.sin(rad);
                 const x2 = 200 + 145 * Math.cos(rad);
                 const y2 = 150 + 145 * Math.sin(rad);
                 return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="1" />;
              })}
            </g>

            {/* --- RADAR GRID --- */}
            <g stroke="#1e293b" strokeWidth="1" fill="none">
              <circle cx="200" cy="150" r="50" opacity="0.3" />
              <circle cx="200" cy="150" r="100" opacity="0.3" />
              <circle cx="200" cy="150" r="140" opacity="0.5" />
            </g>

            {/* --- SWEEP LINE --- */}
            <line 
              x1="200" 
              y1="150" 
              x2="200" 
              y2="10" 
              stroke="url(#sweepGradient)" 
              strokeWidth="2"
              transform={`rotate(${rotation} 200 150)`}
              opacity="0.8"
            />
            <defs>
              <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
                <stop offset="50%" stopColor="#22c55e" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* --- BLIPS & DATA BLOCKS --- */}
            {allBlips.map((blip, i) => {
              const pos = getXY(blip.angle, blip.dist);
              const opacity = getBlipOpacity(blip.angle, rotation);
              
              // Ghost jitter
              const jitterX = blip.isGhost ? (Math.random() - 0.5) * 4 : 0;
              const jitterY = blip.isGhost ? (Math.random() - 0.5) * 4 : 0;
              const finalX = pos.x + jitterX;
              const finalY = pos.y + jitterY;

              // Determine color
              const blipColor = blip.isGhost ? "#ef4444" : "#3b82f6";
              const textColor = blip.isGhost ? "#fca5a5" : "#93c5fd";

              return (
                <g key={i}>
                  {/* History Trails (Breadcrumbs) */}
                  {blip.history && blip.history.map((h, hIdx) => {
                     const hPos = getXY(h.angle, h.dist);
                     return (
                       <circle 
                         key={hIdx} 
                         cx={hPos.x} 
                         cy={hPos.y} 
                         r="1" 
                         fill={blipColor} 
                         opacity={0.3 + (hIdx * 0.1)} // Fade out older dots
                       />
                     );
                  })}

                  {/* Main Blip */}
                  <g transform={`translate(${finalX}, ${finalY})`}>
                    {/* Symbol: Square for Civil, Diamond for Hostile/Unknown */}
                    {blip.isGhost ? (
                      <path d="M 0 -4 L 4 0 L 0 4 L -4 0 Z" fill={blipColor} opacity={opacity} />
                    ) : (
                      <rect x="-3" y="-3" width="6" height="6" fill={blipColor} opacity={opacity} />
                    )}

                    {/* Leader Line */}
                    <line x1="0" y1="0" x2="15" y2="-15" stroke={textColor} strokeWidth="0.5" opacity={opacity > 0.4 ? 0.8 : 0.2} />

                    {/* Full Data Block (Standard ATC Format) */}
                    <g transform="translate(18, -18)" opacity={opacity > 0.4 ? 1 : 0.3}>
                      {/* Counter-rotate text in 3D mode so it stands up */}
                      <g transform={is3D ? `rotateX(-60deg)` : ''} style={{ transition: 'transform 0.6s' }}>
                         <text y="0" fill={textColor} fontSize="8" fontFamily="monospace" fontWeight="bold">{blip.id}</text>
                         <text y="8" fill={textColor} fontSize="7" fontFamily="monospace">{blip.alt} {blip.kts}</text>
                      </g>
                    </g>
                  </g>
                </g>
              );
            })}
            
            {/* Overlay for Jamming */}
            {isSpoofed && (
               <g transform={is3D ? 'translate(0, -20)' : ''}>
                  <rect x="100" y="260" width="200" height="30" fill="rgba(0,0,0,0.8)" stroke="#ef4444" rx="4" />
                  <text x="200" y="280" textAnchor="middle" fill="#ef4444" fontSize="12" fontFamily="monospace" letterSpacing="2px" fontWeight="bold">
                    ⚠️ SYSTEM COMPROMISED
                  </text>
               </g>
            )}
          </svg>
        </div>
      </div>

      {/* Control Panel */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid #1e293b',
        background: '#0f172a',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        zIndex: 20
      }}>
        {/* Zoom Controls */}
        <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '4px', borderRadius: '4px' }}>
          <button 
            onClick={() => setZoom(z => Math.max(z - 0.5, 0.5))}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
            title="Alejar"
          >
             -
          </button>
          <span style={{ color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.8rem', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
            {(zoom * 100).toFixed(0)}%
          </span>
          <button 
            onClick={() => setZoom(z => Math.min(z + 0.5, 3))}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
            title="Acercar"
          >
             +
          </button>
        </div>

        {/* 3D Toggle */}
        <button
          onClick={() => setIs3D(!is3D)}
          style={{
            padding: '8px 12px',
            background: is3D ? '#0ea5e9' : '#1e293b',
            color: is3D ? '#fff' : '#94a3b8',
            border: '1px solid #38bdf8',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          {is3D ? '3D TACTICAL: ON' : '2D FLAT VIEW'}
        </button>

        {/* Spoof Toggle */}
        <button
          onClick={onToggleSpoof}
          style={{
            flex: 1,
            padding: '8px',
            background: isSpoofed ? '#450a0a' : '#1e293b',
            color: isSpoofed ? '#fca5a5' : '#e2e8f0',
            border: `1px solid ${isSpoofed ? '#ef4444' : '#475569'}`,
            borderRadius: '4px',
            fontFamily: 'monospace',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          {isSpoofed ? '🛑 DETENER ATAQUE' : '📡 INYECTAR GHOST'}
        </button>
      </div>
      
    </div>
  );
};

export default DefenseOperationsMap;
