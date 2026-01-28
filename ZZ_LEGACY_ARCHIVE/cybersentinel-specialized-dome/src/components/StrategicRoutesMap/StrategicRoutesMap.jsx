import React, { useState } from 'react';
import './StrategicRoutesMap.css';
import worldMapBg from '../../assets/world-map-bg.png';

// Geometría realista del mundo (High Fidelity SVG)
const WORLD_MAP_DATA = [
  // North America
  { id: 'nam', d: "M 150 60 L 250 50 L 350 40 L 400 50 L 300 150 L 250 250 L 200 200 L 100 150 L 50 80 Z M 200 80 L 220 80 L 220 100 L 200 100 Z" }, 
  // South America
  { id: 'sam', d: "M 280 260 L 350 280 L 400 350 L 350 450 L 300 480 L 280 400 L 250 300 Z" }, 
  // Europe
  { id: 'eur', d: "M 450 150 L 500 100 L 550 100 L 600 120 L 580 150 L 550 160 L 520 170 L 480 160 Z" }, 
  // Africa
  { id: 'afr', d: "M 480 170 L 550 170 L 600 200 L 650 300 L 600 400 L 500 350 L 450 250 Z" }, 
  // Asia
  { id: 'asia', d: "M 600 120 L 700 50 L 850 50 L 950 100 L 900 200 L 800 250 L 750 300 L 700 250 L 650 200 L 600 150 Z" }, 
  // Australia
  { id: 'aus', d: "M 750 350 L 850 350 L 900 400 L 850 450 L 750 420 Z" }
];

// ... (Rest of imports and icons remain the same)

// Iconos vectoriales para animación
const TRANSPORT_ICONS = {
  AÉREO: {
    path: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", 
    viewBox: "0 0 24 24",
    scale: 0.8
  },
  MARÍTIMO: {
    path: "M2 21c0-3 1.5-5 4-5 2 0 2.5 2 4.5 2 2.5 0 2.5-2 5-2 2 0 2.5 2 4.5 2h2l-1-6h-18l-1 6h2zm10-10l-3-6v6h3zm4 0l-1-4v4h1zm-8 0l-1-3v3h1z", 
    viewBox: "0 0 24 24",
    scale: 0.8
  },
  FERROVIARIO: {
    path: "M18 1c-2.209 0-4 1.791-4 4v5h8v-5c0-2.209-1.791-4-4-4zm-7.5 13c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm7.5 0c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zm-8 7h9v-1h-9v1z", 
    viewBox: "0 0 24 24",
    scale: 0.7
  }
};

const StrategicRoutesMap = ({ 
  corredores = [], 
  crisisLevel = 0, 
  showAnimation = true, 
  showLabels = true,
  showLegend = true,
  showOverlayLabels = true,
  showCriticalDots = true,
  isGlobalGpsCrisis
}) => {
  const [hoveredRoute, setHoveredRoute] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  // Resolver visibilidad basada en showLabels (legacy/master switch)
  const displayLegend = showLabels && showLegend;
  const displayOverlayLabels = showLabels && showOverlayLabels;
  const displayCriticalDots = showLabels && showCriticalDots;

  const nodeDetails = {
    suez: { name: 'CANAL DE SUEZ', status: 'CRÍTICO', wait: '48h', ships: 124, risk: 'Alta piratería en Mar Rojo' },
    gibraltar: { name: 'ESTRECHO GIBRALTAR', status: 'FLUIDO', wait: '2h', ships: 45, risk: 'Monitoreo constante' },
    panama: { name: 'CANAL DE PANAMÁ', status: 'RESTRINGIDO', wait: '120h', ships: 89, risk: 'Sequía severa - Calado reducido' },
    venezuela: { name: 'HUB ENERGÉTICO VZLA', status: 'ESTRATÉGICO', wait: '24h', ships: 32, risk: 'Sanciones / Bloqueo Naval' }
  };

  const calculateRouteImportance = (corredor) => {
    let score = 0;
    if (corredor.modo === 'AÉREO') score += 40;
    if (corredor.modo === 'MARÍTIMO') score += 35;
    if (corredor.modo === 'FERROVIARIO') score += 25;
    if (corredor.estado === 'CORTADO') score += 30;
    if (corredor.estado === 'INESTABLE') score += 20;
    if (corredor.estado === 'TENSO') score += 10;
    if (corredor.estado === 'PRIORITARIO') score += 15;
    if (corredor.capacidad < 30) score += 25;
    else if (corredor.capacidad < 60) score += 15;
    else if (corredor.capacidad < 80) score += 5;
    if (corredor.retrasoHoras > 24) score += 20;
    else if (corredor.retrasoHoras > 12) score += 15;
    else if (corredor.retrasoHoras > 6) score += 10;
    return Math.min(100, score);
  };

  const routePaths = [
    {
      id: 'marine', 
      // Ruta Marítima Energética (Azul): Shanghai -> Malacca -> Suez -> Gibraltar -> VENEZUELA
      d: "M 836 163 Q 820 200, 788 246 T 680 260 T 590 167 T 485 150 Q 400 180, 320 230", 
      color: "#3b82f6" // Azul (Blue-500)
    },
    {
      id: 'air', 
      // Ruta Aérea Táctica (Rojo): Dubai -> Europa (Borde) -> Golfo de México (Evita cruzar EE.UU. por tierra)
      // Ajustado para desembocar en el Golfo de México (Coords aprox: 260, 190)
      d: "M 650 180 Q 560 130, 490 140 T 260 190",
      color: "#ef4444" // Rojo (Red-500)
    },
    {
      id: 'rail', 
      // Ruta Transoceánica Sur (Verde): China -> Cabo de Buena Esperanza -> CENTRO ATLÁNTICO -> Panamá
      // Trayectoria ajustada: Pasa MUY al sur de África (540, 450) y sube por el MEDIO del Atlántico (Control 490, 280)
      // para evitar tocar absolutamente nada de Sudamérica (Brasil/Venezuela).
      d: "M 836 163 Q 750 280, 650 350 T 540 450 Q 490 280, 279 225",
      color: "#22c55e" // Verde (Green-500)
    }
  ];

  const getRouteConfig = (corredor, index) => {
    const pathConfig = routePaths[index] || routePaths[0];
    const importance = calculateRouteImportance(corredor);
    
    return {
      ...pathConfig,
      importance,
      isCritical: importance > 70,
      isMajor: importance > 40 && importance <= 70,
      width: 2 + (importance / 20), 
      opacity: corredor.estado === 'CORTADO' ? 0.3 : 0.8,
      icon: TRANSPORT_ICONS[corredor.modo] || TRANSPORT_ICONS['AÉREO']
    };
  };

  return (
    <div className="strategic-routes-map">
      <svg className="map-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1"/>
          </pattern>
          <pattern id="scan-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
             <rect width="2" height="2" fill="rgba(6, 182, 212, 0.05)" />
          </pattern>
          
          {/* Filters for Glow */}
          <filter id="glow-intense" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        {/* 1. Capa de Imagen de Fondo */}
        <image 
          href={worldMapBg} 
          x="0" 
          y="0" 
          width="1000" 
          height="500" 
          preserveAspectRatio="none" 
          opacity="0.85" 
        />

        {/* 1.5 Capa Vectorial (Wireframe) */}
        <g className="world-vectors" opacity="0.4">
          {WORLD_MAP_DATA.map(region => (
            <path 
              key={region.id}
              d={region.d}
              fill="rgba(2, 6, 23, 0.2)"
              stroke="#38bdf8" 
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* 2. Grid Overlay (Sutil) */}
        <rect x="0" y="0" width="1000" height="500" fill="url(#grid-pattern)" opacity="0.2" />

        {/* 3. Risk Zones (Piracy/Weather) */}
        <g className="risk-zone" opacity="0.3">
           {/* Horn of Africa / Red Sea Piracy Zone */}
           <circle cx="560" cy="200" r="40" fill="url(#scan-pattern)" stroke="#ef4444" strokeWidth="0.5">
             <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
           </circle>
           <text x="560" y="250" textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="monospace" letterSpacing="1">PIRACY WARNING</text>
        </g>

        {/* Rutas SVG */}
        {corredores.map((corredor, index) => {
          const config = getRouteConfig(corredor, index);
          // Usamos el color definido en routePaths (Azul, Rojo, Verde) explícitamente
          const strokeColor = config.color;
          
          return (
            <g key={corredor.id} 
               className={`route-group ${corredor.estado === 'CORTADO' ? 'blocked' : ''}`}
               onMouseEnter={() => setHoveredRoute(corredor.id)}
               onMouseLeave={() => setHoveredRoute(null)}
            >
              {/* Glow Effect */}
              <path 
                d={config.d}
                fill="none"
                stroke={strokeColor}
                strokeWidth={config.width + 4}
                strokeOpacity="0.2"
                strokeLinecap="round"
                filter="url(#glow-intense)"
              />
              
              {/* Base Line */}
              <path 
                className="route-path-base"
                d={config.d}
                fill="none"
                stroke={strokeColor}
                strokeWidth={2}
                strokeOpacity="0.5"
                strokeDasharray="5 10"
              />

              {/* Active Animated Line */}
              <path 
                className="route-path-active"
                d={config.d}
                fill="none"
                stroke={strokeColor}
                strokeWidth={config.width}
                strokeOpacity="1"
                strokeLinecap="round"
                strokeDasharray={corredor.estado === 'CORTADO' ? "10 20" : "20 30"}
              >
                {showAnimation && (
                  <animate 
                    attributeName="stroke-dashoffset" 
                    from="1000" 
                    to="0" 
                    dur={corredor.estado === 'CORTADO' ? "60s" : "15s"} 
                    repeatCount="indefinite" 
                  />
                )}
              </path>

              {/* Moving Icons (Multiple Units Traffic) */}
              {showAnimation && corredor.estado !== 'CORTADO' && (
                <g>
                  {[0, 1, 2].map((unitIndex) => {
                    const dur = 20 - (config.importance / 10);
                    const begin = -(dur / 3) * unitIndex; // Distribute units along path
                    
                    // Crisis Effects
                    const unitColor = isGlobalGpsCrisis ? '#ef4444' : '#fff';
                    const unitLabel = isGlobalGpsCrisis ? 'LOST' : `${corredor.id.split('-')[0]}-${100 + unitIndex}`;
                    const labelColor = isGlobalGpsCrisis ? '#ef4444' : strokeColor;

                    return (
                      <g key={`unit-${unitIndex}`}>
                        <g transform={`scale(${0.06 * config.width + 0.6})`}> 
                           <g> {/* Wrapper for crisis rotation/wobble */}
                             <path 
                               d={config.icon.path} 
                               fill={unitColor}
                               filter="url(#glow-intense)"
                               transform="rotate(90, 12, 12)"
                           />
                           {isGlobalGpsCrisis && (
                             <>
                               <animateTransform 
                                  attributeName="transform"
                                  type="rotate"
                                  values="0 12 12; 45 12 12; -45 12 12; 0 12 12"
                                  dur="2s"
                                  repeatCount="indefinite"
                                  additive="sum"
                               />
                               <animateTransform 
                                  attributeName="transform"
                                  type="translate"
                                  values="0 0; 10 -10; -5 15; 0 0"
                                  dur="5s"
                                  repeatCount="indefinite"
                                  additive="sum"
                               />
                             </>
                           )}
                         </g>
                           
                           {/* Unit Label (Tiny ID) */}
                           <text x="26" y="16" fill={labelColor} fontSize="10" fontFamily="monospace" opacity="0.8" fontWeight={isGlobalGpsCrisis ? 'bold' : 'normal'}>
                             {unitLabel}
                           </text>
                        </g>
                        <animateMotion 
                          dur={`${dur}s`} 
                          begin={`${begin}s`}
                          repeatCount="indefinite"
                          path={config.d}
                          rotate="auto"
                          calcMode="linear"
                        />
                      </g>
                    );
                  })}
                </g>
              )}
            </g>
          );
        })}

        {/* Global Crisis Overlay */}
        {isGlobalGpsCrisis && (
            <g>
                <rect x="300" y="20" width="400" height="40" fill="rgba(127, 29, 29, 0.9)" rx="4" stroke="#ef4444" strokeWidth="1">
                    <animate attributeName="opacity" values="0.9;0.7;0.9" dur="1s" repeatCount="indefinite" />
                </rect>
                <text x="500" y="45" textAnchor="middle" fill="#fee2e2" fontSize="14" fontFamily="monospace" fontWeight="bold" letterSpacing="2">
                    ⚠ CRITICAL FAILURE: GPS SIGNAL LOST
                </text>
                <text x="500" y="55" textAnchor="middle" fill="#fca5a5" fontSize="8" fontFamily="monospace">
                   FLEET DRIFTING - MANUAL CONTROL REQUIRED
                </text>
            </g>
        )}

        {displayCriticalDots && (
          <>
            {/* Suez (Coords: 590, 167) */}
            <g 
              transform="translate(590, 167)" 
              className="critical-node-group"
              onClick={() => setSelectedNode(selectedNode === 'suez' ? null : 'suez')}
              style={{ cursor: 'pointer' }}
            >
               <circle r={selectedNode === 'suez' ? 30 : 20} fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.5">
                 <animate attributeName="r" values={selectedNode === 'suez' ? "30;40" : "10;30"} dur="2s" repeatCount="indefinite" />
                 <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
               </circle>
               <circle r="6" fill={selectedNode === 'suez' ? "#fff" : "#ef4444"} stroke="#fff" strokeWidth="1" />
            </g>
            
            {/* Gibraltar (Coords: 485, 150) */}
            <g 
              transform="translate(485, 150)"
              className="critical-node-group"
              onClick={() => setSelectedNode(selectedNode === 'gibraltar' ? null : 'gibraltar')}
              style={{ cursor: 'pointer' }}
            >
               <circle r={selectedNode === 'gibraltar' ? 25 : 15} fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.5">
                 <animate attributeName="r" values={selectedNode === 'gibraltar' ? "25;35" : "5;20"} dur="2.5s" repeatCount="indefinite" />
                 <animate attributeName="opacity" values="0.6;0" dur="2.5s" repeatCount="indefinite" />
               </circle>
               <circle r="5" fill={selectedNode === 'gibraltar' ? "#fff" : "#3b82f6"} stroke="#fff" strokeWidth="1" />
            </g>

            {/* Panamá (Coords: 279, 225) */}
            <g 
              transform="translate(279, 225)"
              className="critical-node-group"
              onClick={() => setSelectedNode(selectedNode === 'panama' ? null : 'panama')}
              style={{ cursor: 'pointer' }}
            >
               <circle r={selectedNode === 'panama' ? 15 : 5} fill={selectedNode === 'panama' ? "#fff" : "#f59e0b"} stroke="#fff" strokeWidth="1" />
               {selectedNode === 'panama' && (
                 <circle r="15" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.5">
                    <animate attributeName="r" values="15;25" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="1.5s" repeatCount="indefinite" />
                 </circle>
               )}
            </g>

            {/* Venezuela (Coords: 320, 230) - Energy Hub */}
            <g 
              transform="translate(320, 230)"
              className="critical-node-group"
              onClick={() => setSelectedNode(selectedNode === 'venezuela' ? null : 'venezuela')}
              style={{ cursor: 'pointer' }}
            >
               <circle r={selectedNode === 'venezuela' ? 25 : 12} fill="none" stroke="#10b981" strokeWidth="1.5">
                 <animate attributeName="r" values={selectedNode === 'venezuela' ? "25;35" : "8;20"} dur="2s" repeatCount="indefinite" />
                 <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
               </circle>
               <circle r="6" fill={selectedNode === 'venezuela' ? "#fff" : "#10b981"} stroke="#fff" strokeWidth="1" />
            </g>
          </>
        )}
      </svg>

      {displayOverlayLabels && (
        <div className="map-overlay-labels">
          <div className="node-label suez" style={{ left: '58%', top: '28%' }}>⚓ SUEZ</div>
          <div className="node-label gibraltar" style={{ left: '45%', top: '25%' }}>🌊 GIBRALTAR</div>
          <div className="node-label panama" style={{ left: '28%', top: '63%' }}>🚢 PANAMÁ</div>
        </div>
      )}

      {displayLegend && (
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-line critical"></div>
            <span>Ruta crítica (&gt;70%)</span>
          </div>
          <div className="legend-item">
            <div className="legend-line normal"></div>
            <span>Ruta normal</span>
          </div>
          <div className="legend-item">
            <div className="legend-node"></div>
            <span>Nodo único de fallo</span>
          </div>
        </div>
      )}

      {hoveredRoute && !selectedNode && (
        <div className="route-tooltip">
          {(() => {
            const corredor = corredores.find(c => c.id === hoveredRoute);
            if (!corredor) return null;
            const importance = calculateRouteImportance(corredor);
            return (
              <>
                <h4 className="tooltip-header">
                  {corredor.etiqueta}
                </h4>
                <div className="tooltip-content">
                  <div className="tooltip-row">
                    <span className="tooltip-label">Importancia</span>
                    <span className="tooltip-value" style={{ color: importance > 70 ? '#fca5a5' : '#86efac' }}>
                      {importance}/100
                    </span>
                  </div>
                  <div className="tooltip-row">
                    <span className="tooltip-label">Estado</span>
                    <span className="tooltip-value" style={{ color: corredor.estado === 'CORTADO' ? '#ef4444' : '#4ade80' }}>
                      {corredor.estado}
                    </span>
                  </div>
                  <div className="tooltip-row">
                    <span className="tooltip-label">Impacto Económico</span>
                    <span className="tooltip-value" style={{ color: '#fcd34d' }}>
                      ${(importance * 10000).toLocaleString()}/día
                    </span>
                  </div>
                  {corredor.modo === 'AÉREO' && (
                    <div className="tooltip-row" style={{ marginTop: '4px', color: '#fbbf24', fontSize: '0.75rem' }}>
                      <span>⚠️ Transporte de fármacos críticos</span>
                    </div>
                  )}
                  {corredor.modo === 'MARÍTIMO' && (
                    <div className="tooltip-row" style={{ marginTop: '4px', color: '#60a5fa', fontSize: '0.75rem' }}>
                      <span>⚠️ Componentes electrónicos</span>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {selectedNode && (
        <div className="route-tooltip" style={{ 
          top: 'auto', 
          bottom: '16px', 
          right: '16px',
          border: '1px solid #6366f1',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 className="tooltip-header" style={{ margin: 0, color: '#818cf8' }}>
              {nodeDetails[selectedNode].name}
            </h4>
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedNode(null); }}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: '#64748b', 
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '0 4px'
              }}
            >
              ×
            </button>
          </div>
          
          <div className="tooltip-content">
             <div className="tooltip-row">
               <span className="tooltip-label">Estatus Operativo</span>
               <span className="tooltip-value" style={{ color: '#fff' }}>{nodeDetails[selectedNode].status}</span>
             </div>
             <div className="tooltip-row">
               <span className="tooltip-label">Tiempo Espera</span>
               <span className="tooltip-value" style={{ color: '#facc15' }}>{nodeDetails[selectedNode].wait}</span>
             </div>
             <div className="tooltip-row">
               <span className="tooltip-label">Buques en Cola</span>
               <span className="tooltip-value" style={{ color: '#38bdf8' }}>{nodeDetails[selectedNode].ships}</span>
             </div>
             <div style={{ 
               marginTop: '12px', 
               padding: '8px', 
               background: 'rgba(239, 68, 68, 0.1)', 
               borderLeft: '2px solid #ef4444',
               fontSize: '0.75rem',
               color: '#fca5a5'
             }}>
               <strong>ALERTA DE INTELIGENCIA:</strong><br/>
               {nodeDetails[selectedNode].risk}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategicRoutesMap;
