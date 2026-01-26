import React, { useState, useEffect } from 'react';
import { Shield, Activity, Power, Skull, AlertTriangle, Lock } from 'lucide-react';
import worldMapBg from '../../assets/world-map-bg.png';
import './GlobalWarRoom.css';

// Componente Visual de Motor de Supervivencia (Holograma)
const SurvivalEngineVisual = ({ isGlobalCrisis }) => {
  return (
    <div className={`globe-wrapper ${isGlobalCrisis ? 'crisis-active' : ''}`}>
      <div className="globe-core"></div>
      <div className="orbit-ring ring-1"></div>
      <div className="orbit-ring ring-2"></div>
      <div className="orbit-ring ring-3"></div>
      
      {/* HUD Overlay */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        textAlign: 'center', zIndex: 10, textShadow: '0 0 10px black'
      }}>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: isGlobalCrisis ? '#ef4444' : '#0ea5e9' }}>
          {isGlobalCrisis ? 'CRITICAL' : 'OPTIMAL'}
        </div>
        <div style={{ fontSize: '0.8rem', letterSpacing: '2px', opacity: 0.8 }}>
          SURVIVAL ENGINE STATUS
        </div>
      </div>
    </div>
  );
};

const GlobalWarRoom = ({ onExit }) => {
  const [defconLevel, setDefconLevel] = useState(5); // 5=Normal, 1=Nuclear
  const [scenario, setScenario] = useState('MONITORING'); // MONITORING, BLACK_SKY, EMP_OMEGA, SURVIVAL_IV
  
  // Efectos visuales derivados
  const isBlackSky = scenario === 'BLACK_SKY';
  const isOmega = scenario === 'EMP_OMEGA';
  const isSurvivalIV = scenario === 'SURVIVAL_IV';

  // Determine container class based on mode
  const getContainerClass = () => {
    if (isBlackSky) return 'war-room-container mode-black-sky scanlines';
    if (isOmega) return 'war-room-container mode-omega scanlines';
    if (isSurvivalIV) return 'war-room-container mode-survival scanlines';
    return 'war-room-container scanlines';
  };

  // Simulación de datos globales
  const [gridStatus, setGridStatus] = useState(100);
  const [commsIntegrity, setCommsIntegrity] = useState(100);
  const [globalPanic, setGlobalPanic] = useState(12);

  // Nuevas métricas para Emulator IV
  const [survivalMetrics, setSurvivalMetrics] = useState({
    agua: 98,
    energia: 96,
    transporte: 88,
    defensa: 92
  });

  // Estados de Regiones para visualización detallada
  const [regions, setRegions] = useState([
    { id: 'NA', name: 'NORTH AMERICA', status: 'ONLINE', x: 25, y: 30 },
    { id: 'SA', name: 'SOUTH AMERICA', status: 'ONLINE', x: 35, y: 70 },
    { id: 'EU', name: 'EUROPE', status: 'ONLINE', x: 52, y: 25 },
    { id: 'AF', name: 'AFRICA', status: 'ONLINE', x: 50, y: 55 },
    { id: 'AS', name: 'ASIA', status: 'ONLINE', x: 75, y: 35 },
    { id: 'OC', name: 'OCEANIA', status: 'ONLINE', x: 85, y: 75 },
    { id: 'AN', name: 'ANTARCTICA', status: 'ONLINE', x: 50, y: 90 },
  ]);

  useEffect(() => {
    let interval;
    if (isBlackSky) {
      // Secuencia de apagón en cascada (Black Sky)
      let failureStep = 0;
      interval = setInterval(() => {
        setRegions(prev => prev.map((r, i) => {
           // Apagar una región cada 2 segundos
           if (i <= failureStep) return { ...r, status: 'OFFLINE' };
           return r;
        }));
        
        failureStep++;

        setGridStatus(prev => Math.max(0, prev - 15)); // Caída rápida
        setCommsIntegrity(prev => Math.max(0, prev - 5));
        setGlobalPanic(prev => Math.min(100, prev + 10)); // Pánico sube rápido
      }, 1500);
    } else if (isOmega) {
      // Fallo inmediato y corrupción (Omega)
      setRegions(prev => prev.map(r => ({ ...r, status: 'CORRUPTED' })));
      setGridStatus(0);
      setCommsIntegrity(0);
      setGlobalPanic(100);
    } else if (isSurvivalIV) {
      // Modo Supervivencia: Degradación de métricas específicas
      interval = setInterval(() => {
        setSurvivalMetrics(prev => ({
          agua: Math.max(0, prev.agua - (Math.random() * 5 + 2)),
          energia: Math.max(0, prev.energia - (Math.random() * 8 + 3)),
          transporte: Math.max(0, prev.transporte - (Math.random() * 6 + 2)),
          defensa: Math.max(0, prev.defensa - (Math.random() * 4 + 1)),
        }));
        setGlobalPanic(prev => Math.min(100, prev + 5));
      }, 800);
    } else {
      // Recovery
      setRegions(prev => prev.map(r => ({ ...r, status: 'ONLINE' })));
      setGridStatus(prev => Math.min(100, prev + 5));
      setCommsIntegrity(prev => Math.min(100, prev + 5));
      setGlobalPanic(prev => Math.max(12, prev - 2));
      setSurvivalMetrics({
        agua: 98,
        energia: 96,
        transporte: 88,
        defensa: 92
      });
    }
    return () => clearInterval(interval);
  }, [scenario, isBlackSky, isOmega, isSurvivalIV]);

  const handleExit = () => {
    if (onExit) onExit();
    window.close(); // Force close attempt
  };

  // Determine critical state for Survival IV
  const isSurvivalCritical = isSurvivalIV && Object.values(survivalMetrics).some(v => v < 30);

  return (
    <div className={getContainerClass()}>
      
      {/* GLITCH OVERLAY FOR OMEGA */}
      {isOmega && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.1) 4px)',
          animation: 'glitch 0.1s infinite'
        }} />
      )}

      {/* HEADER */}
      <header className="war-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Shield size={42} strokeWidth={1.5} />
          <div className="header-title">
            <h1>GLOBAL WAR ROOM</h1>
            <small style={{ letterSpacing: '2px', opacity: 0.8 }}>STRATEGIC COMMAND // UN LEVEL CLEARANCE</small>
          </div>
        </div>
        
        <div className="defcon-display">
          <span>DEFCON</span>
          <span style={{ color: defconLevel === 1 ? 'red' : defconLevel === 3 ? 'orange' : 'inherit' }}>
            {defconLevel}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <nav className="nav-links">
             <a href="http://localhost:4000/WEB_PLATFORM/" target="_blank" rel="noopener noreferrer" className="nav-link">CMD CENTER</a>
             <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="nav-link">STRAT HUB</a>
             <a href="http://localhost:3007" target="_blank" rel="noopener noreferrer" className="nav-link">SPEC DOME</a>
          </nav>
          <button onClick={handleExit} className="btn-exit">
            EXIT SYSTEM
          </button>
        </div>
      </header>

      {/* LEFT PANEL: THREAT SELECTOR */}
      <aside className="sidebar">
        <h2 className="panel-title">SCENARIO INJECTION</h2>
        
        <button 
          onClick={() => { setScenario('MONITORING'); setDefconLevel(5); }}
          className={`scenario-btn ${scenario === 'MONITORING' ? 'active' : ''}`}
        >
          <div className="btn-content">
            <Activity size={20} /> MONITORING
          </div>
          <small>Standard Global Surveillance</small>
        </button>

        <button 
          onClick={() => { setScenario('BLACK_SKY'); setDefconLevel(3); }}
          className={`scenario-btn ${scenario === 'BLACK_SKY' ? 'active' : ''}`}
        >
          <div className="btn-content">
            <Power size={20} /> BLACK SKY
          </div>
          <small>Grid Collapse / Zero Energy</small>
        </button>

        <button 
          onClick={() => { setScenario('EMP_OMEGA'); setDefconLevel(1); }}
          className={`scenario-btn ${scenario === 'EMP_OMEGA' ? 'active' : ''}`}
        >
          <div className="btn-content">
            <Skull size={20} /> OMEGA EVENT
          </div>
          <small>Total Infrastructure Loss</small>
        </button>

        <button 
          onClick={() => { setScenario('SURVIVAL_IV'); setDefconLevel(2); }}
          className={`scenario-btn ${scenario === 'SURVIVAL_IV' ? 'active' : ''}`}
        >
          <div className="btn-content">
            <Activity size={20} /> EMULATOR IV
          </div>
          <small>Global Survival Engine</small>
        </button>
      </aside>

      {/* CENTER: MAIN VISUALIZATION */}
      <main className="main-display">
        
        {/* SURVIVAL ENGINE OVERLAY */}
        {isSurvivalIV ? (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '30px'
          }}>
             <SurvivalEngineVisual isGlobalCrisis={isSurvivalCritical} />
             
             {/* Survival Metrics Grid */}
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '600px' }}>
                {Object.entries(survivalMetrics).map(([key, value]) => (
                  <div key={key} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', border: '1px solid #333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', textTransform: 'uppercase' }}>
                      <span>{key}</span>
                      <span style={{ color: value < 30 ? '#ef4444' : '#0ea5e9' }}>{value.toFixed(1)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: '#111' }}>
                      <div style={{ 
                        width: `${value}%`, height: '100%', 
                        background: value < 30 ? '#ef4444' : '#0ea5e9',
                        boxShadow: `0 0 10px ${value < 30 ? '#ef4444' : '#0ea5e9'}`
                      }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        ) : (
          /* GLOBAL MAP GRID (Standard View) */
          <div className="map-grid" style={{ '--map-bg': `url(${worldMapBg})` }}>
             {/* REGION NODES */}
             {regions.map((region) => (
               <div key={region.id} className={`map-node ${region.status === 'ONLINE' ? 'status-online' : ''}`} style={{
                 left: `${region.x}%`,
                 top: `${region.y}%`,
                 opacity: region.status === 'OFFLINE' ? 0.3 : 1,
                 filter: region.status === 'CORRUPTED' ? 'blur(4px)' : 'none'
               }}>
                 <div className="node-icon" />
                 <div className="node-label">
                   {region.name}
                   <div style={{ fontSize: '0.6rem', color: region.status === 'ONLINE' ? '#10b981' : 'red' }}>
                     [{region.status}]
                   </div>
                 </div>
               </div>
             ))}

             {/* CONNECTIVITY LINES (SVG Overlay) */}
             <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.3 }}>
               <defs>
                 <filter id="glow">
                   <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                   <feMerge>
                     <feMergeNode in="coloredBlur"/>
                     <feMergeNode in="SourceGraphic"/>
                   </feMerge>
                 </filter>
               </defs>
               <path d="M 250 150 L 520 125 L 750 175 L 850 375" fill="none" stroke="currentColor" strokeWidth="2" filter="url(#glow)" strokeDasharray="5,5" />
               <path d="M 250 150 L 350 350" fill="none" stroke="currentColor" strokeWidth="2" filter="url(#glow)" strokeDasharray="5,5" />
               <path d="M 520 125 L 500 275" fill="none" stroke="currentColor" strokeWidth="2" filter="url(#glow)" strokeDasharray="5,5" />
             </svg>
          </div>
        )}

        {/* CENTER ALERT OVERLAY (For Standard Modes) */}
        {(isBlackSky || isOmega) && (
          <div className="alert-overlay">
            <h1 className="alert-title">
              {isOmega ? 'FATAL ERROR' : 'GRID DOWN'}
            </h1>
            <div className="alert-message">
              {isOmega ? 'DATA CORRUPTION DETECTED - SYSTEM PURGE IMMINENT' : 'CRITICAL INFRASTRUCTURE FAILURE - CASCADING BLACKOUT'}
            </div>
            {isOmega && <Skull size={100} style={{ marginTop: '30px', animation: 'glitch 0.2s infinite' }} />}
            {isBlackSky && <Power size={100} style={{ marginTop: '30px', opacity: 0.5 }} />}
          </div>
        )}
      </main>

      {/* RIGHT PANEL: TELEMETRY */}
      <aside className="sidebar sidebar-right">
        <h2 className="panel-title">GLOBAL TELEMETRY</h2>
        
        <div className="metric-container">
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>GRID STABILITY</span>
            <span>{gridStatus.toFixed(1)}%</span>
          </label>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" style={{ width: `${gridStatus}%` }} />
          </div>
        </div>

        <div className="metric-container">
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>COMMS UPTIME</span>
            <span>{commsIntegrity.toFixed(1)}%</span>
          </label>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" style={{ width: `${commsIntegrity}%` }} />
          </div>
        </div>

        <div className="metric-container">
          <label style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>CIVIL UNREST</span>
            <span style={{ color: globalPanic > 50 ? 'red' : 'inherit' }}>{globalPanic.toFixed(0)}%</span>
          </label>
          <div className="metric-bar-bg">
            <div className="metric-bar-fill" style={{ 
              width: `${globalPanic}%`, 
              background: globalPanic > 50 ? 'red' : 'currentColor' 
            }} />
          </div>
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid currentColor', paddingTop: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
            <AlertTriangle size={20} /> SYSTEM ALERTS
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: '1.5' }}>
            > NO THREATS DETECTED IN SECTOR 7G<br/>
            > SATELLITE UPLINK STABLE<br/>
            > FIREWALL INTEGRITY: 98.4%
          </div>
        </div>
      </aside>

      {/* FOOTER */}
      <footer className="war-footer">
        <div>SESSION ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
        <div>AUTHORIZED PERSONNEL ONLY</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Lock size={14} /> ENCRYPTED CONNECTION
        </div>
      </footer>
    </div>
  );
};

export default GlobalWarRoom;
