import React, { useState, useEffect } from 'react';

const SatelliteMap = ({ links, onDegrade, onReroute, isGlobalGpsCrisis }) => {
  const [rotation, setRotation] = useState(0);
  const [selectedSat, setSelectedSat] = useState(null);

  // Generate satellites based on links prop or default if not provided
  const [satellites, setSatellites] = useState([]);

  useEffect(() => {
    // Initial setup combining props with visual data
    const baseSats = links || [
        { id: 'SAT-GEO-01', orbit: 'GEO', region: 'Global', status: 'PRIMARIO' },
        { id: 'SAT-MEO-07', orbit: 'MEO', region: 'Europa', status: 'RESPALDO' },
        { id: 'SAT-LEO-21', orbit: 'LEO', region: 'Polar', status: 'EN RIESGO' }
    ];

    // Expand to a visual constellation
    const visualSats = baseSats.flatMap((sat, i) => {
        // Create a few visual companions for each logical link
        const orbitRadius = sat.orbit === 'GEO' ? 140 : sat.orbit === 'MEO' ? 100 : 70;
        const speed = sat.orbit === 'GEO' ? 0.05 : sat.orbit === 'MEO' ? 0.2 : 0.8;
        
        return [
            { ...sat, angle: i * 120, radius: orbitRadius, speed: speed, type: 'Main' },
            { ...sat, id: `${sat.id}-B`, angle: (i * 120) + 180, radius: orbitRadius, speed: speed, type: 'Replica' }
        ];
    });

    setSatellites(visualSats);
  }, [links]);

  // Animation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => (r + 0.5) % 360);
      
      setSatellites(prev => prev.map(s => {
        // Chaos factor during crisis
        let angleChange = s.speed;
        let radiusChange = 0;
        
        if (isGlobalGpsCrisis) {
            angleChange = s.speed * (Math.random() > 0.5 ? 5 : -2); // Erratic speed
            radiusChange = (Math.random() - 0.5) * 2; // Wobble radius
        }

        return {
            ...s,
            angle: (s.angle + angleChange) % 360,
            radius: isGlobalGpsCrisis ? s.radius + radiusChange : s.radius // Keep original radius in state ideally, but for visual chaos this works
        };
      }));

    }, 50);
    return () => clearInterval(interval);
  }, [isGlobalGpsCrisis]);

  const getXY = (angle, radius) => {
    const rad = (angle * Math.PI) / 180;
    // Elliptical projection for 3D feel
    return {
      x: 200 + radius * Math.cos(rad),
      y: 150 + (radius * 0.4) * Math.sin(rad) // Flatten Y for perspective
    };
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '400px',
      background: 'rgba(2, 6, 23, 0.5)',
      backdropFilter: 'blur(4px)',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '2px solid #ca8a04',
      display: 'flex',
      flexDirection: 'column'
    }}>
       {/* HUD Header */}
       <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        background: isGlobalGpsCrisis ? 'rgba(127, 29, 29, 0.9)' : 'rgba(2, 6, 23, 0.8)',
        zIndex: 10,
        borderBottom: isGlobalGpsCrisis ? '1px solid #ef4444' : '1px solid #ca8a04',
        transition: 'background 0.5s'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: isGlobalGpsCrisis ? '#fee2e2' : '#facc15', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>
            {isGlobalGpsCrisis ? '⚠️ CRITICAL ALERT: CONSTELLATION UNDER ATTACK' : 'ORBITAL COMMAND: LIVE'}
          </span>
          <span style={{ color: isGlobalGpsCrisis ? '#fca5a5' : '#9ca3af', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            TRACKING: {satellites.length} ASSETS
          </span>
        </div>
      </div>

      {/* Viewport */}
      <div style={{ flex: 1, position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 400 300">
            <defs>
                <radialGradient id="earthGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#020617" stopOpacity="1"/>
                </radialGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Stars Background */}
            <g>
                {[...Array(20)].map((_, i) => (
                    <circle 
                        key={i}
                        cx={Math.random() * 400} 
                        cy={Math.random() * 300} 
                        r={Math.random() * 1.5} 
                        fill="#fff" 
                        opacity={Math.random()}
                    />
                ))}
            </g>

            {/* Orbits (Back) */}
            <ellipse cx="200" cy="150" rx="140" ry="56" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="5 5" opacity="0.3" /> {/* GEO */}
            <ellipse cx="200" cy="150" rx="100" ry="40" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" /> {/* MEO */}
            <ellipse cx="200" cy="150" rx="70" ry="28" fill="none" stroke="#334155" strokeWidth="1" opacity="0.5" /> {/* LEO */}

            {/* Earth */}
            <g transform={`translate(200, 150)`}>
                <circle r="40" fill="url(#earthGrad)" stroke="#1d4ed8" strokeWidth="1" />
                {/* Rotating Grid Lines */}
                <path d="M -40 0 Q 0 20 40 0" stroke="#3b82f6" strokeWidth="0.5" fill="none" opacity="0.5" transform={`rotate(${rotation * -1})`} />
                <path d="M -40 0 Q 0 -20 40 0" stroke="#3b82f6" strokeWidth="0.5" fill="none" opacity="0.5" transform={`rotate(${rotation * -1})`} />
                <line x1="0" y1="-40" x2="0" y2="40" stroke="#3b82f6" strokeWidth="0.5" opacity="0.5" transform={`rotate(${rotation})`} />
                <line x1="-28" y1="-28" x2="28" y2="28" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" transform={`rotate(${rotation})`} />
                <line x1="28" y1="-28" x2="-28" y2="28" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" transform={`rotate(${rotation})`} />
            </g>

            {/* Satellites & Links */}
            {satellites.map((sat, i) => {
                const pos = getXY(sat.angle, sat.radius);
                const isBack = Math.sin(sat.angle * Math.PI / 180) < 0; // Simple Z-index hack based on angle
                const color = isGlobalGpsCrisis ? '#ef4444' : (sat.status === 'PRIMARIO' ? '#22c55e' : sat.status === 'EN RIESGO' ? '#ef4444' : '#facc15');
                
                // Determine Z-order by simply rendering back ones first? 
                // In SVG order matters. We should ideally sort. 
                // For MVP, we'll just adjust opacity/size to fake depth if behind earth
                
                const zScale = isBack ? 0.7 : 1;
                const zOpacity = isBack ? 0.6 : 1;

                return (
                    <g key={i} opacity={zOpacity}>
                        {/* Mesh Link to Earth */}
                        <line 
                            x1="200" y1="150" 
                            x2={pos.x} y2={pos.y} 
                            stroke={color} 
                            strokeWidth="0.5" 
                            opacity="0.2" 
                        />
                        
                        {/* Satellite Body */}
                        <circle 
                            cx={pos.x} 
                            cy={pos.y} 
                            r={3 * zScale} 
                            fill={color} 
                            filter="url(#glow)"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedSat(sat)}
                        />

                        {/* Label if hovered or selected */}
                        {(selectedSat === sat || !isBack) && (
                            <text 
                                x={pos.x + 5} 
                                y={pos.y - 5} 
                                fill={color} 
                                fontSize="6" 
                                fontFamily="monospace"
                                opacity={isBack ? 0.3 : 0.8}
                            >
                                {sat.id}
                            </text>
                        )}
                    </g>
                );
            })}
        </svg>

        {/* Selected Sat Details Overlay */}
        {selectedSat && (
            <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid #475569',
                padding: '8px',
                borderRadius: '4px',
                maxWidth: '200px'
            }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#facc15', fontSize: '0.8rem' }}>{selectedSat.id}</h4>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>
                    <p style={{ margin: 0 }}>Orbit: {selectedSat.orbit}</p>
                    <p style={{ margin: 0 }}>Status: {selectedSat.status}</p>
                    <p style={{ margin: 0 }}>Region: {selectedSat.region}</p>
                </div>
                <button 
                    onClick={() => setSelectedSat(null)}
                    style={{ marginTop: '4px', fontSize: '0.6rem', background: '#334155', color: '#fff', border: 'none', padding: '2px 6px', cursor: 'pointer' }}
                >
                    CLOSE
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default SatelliteMap;
