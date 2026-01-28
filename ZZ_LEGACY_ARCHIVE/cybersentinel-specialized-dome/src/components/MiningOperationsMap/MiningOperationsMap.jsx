import React from 'react';

const MiningOperationsMap = ({ pressure, temp, valveStatus, scadaStatus }) => {
  // Normalizar valores para visualización
  // Presión base ~850, Peligro > 1200. Max visual ~1500
  const pressurePct = Math.min((pressure / 1500) * 100, 100);
  
  // Temperatura base ~65, Peligro > 90. Max visual ~120
  // const tempPct = Math.min((temp / 120) * 100, 100);

  const isCritical = pressure > 1100 || temp > 90;
  const isCompromised = scadaStatus === 'COMPROMETIDO';
  const isLocked = scadaStatus === 'ACCESO DENEGADO (2002)';

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px', position: 'relative', background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', overflow: 'hidden', borderRadius: '8px' }}>
      
      {/* SVG SCADA Interface */}
      <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
        
        {/* Grid de fondo tipo ingeniería */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30, 41, 59, 0.5)" strokeWidth="1"/>
          </pattern>
          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isCritical ? "#ef4444" : "#3b82f6"} />
            <stop offset="100%" stopColor={isCritical ? "#7f1d1d" : "#1e3a8a"} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* --- Tuberías de Conexión --- */}
        {/* Main Feed Pipe */}
        <path 
          d="M 50 300 L 200 300 L 200 150 L 300 150" 
          fill="none" 
          stroke="#334155" 
          strokeWidth="12" 
        />
        {/* Fluid Animation in Pipe */}
        <path 
          d="M 50 300 L 200 300 L 200 150 L 300 150" 
          fill="none" 
          stroke={isCritical ? "#ef4444" : isLocked ? "#64748b" : "#0ea5e9"} 
          strokeWidth="6" 
          strokeDasharray="20 10"
          strokeOpacity="0.8"
        >
          {/* Si está bloqueado (sabotaje 2002), no hay animación de flujo */}
          {!isLocked && (
            <animate attributeName="stroke-dashoffset" from="300" to="0" dur={isCritical ? "0.5s" : "2s"} repeatCount="indefinite" />
          )}
        </path>

        {/* --- Tanque Principal (Pressure Vessel) --- */}
        <g transform="translate(300, 50)">
          {/* Tank Body */}
          <rect x="0" y="0" width="150" height="200" rx="10" fill="rgba(15, 23, 42, 0.8)" stroke={isLocked ? "#94a3b8" : "#64748b"} strokeWidth="2" />
          
          {/* Liquid Level */}
          <rect 
            x="5" 
            y={200 - (200 * pressurePct / 100)} 
            width="140" 
            height={(200 * pressurePct / 100)} 
            rx="5" 
            fill={isLocked ? "#475569" : "url(#liquidGradient)"} 
            opacity="0.8"
          >
            {!isLocked && (
              <>
                <animate attributeName="y" dur="0.5s" calcMode="spline" keySplines="0.4 0 0.2 1" values={`${200 - (200 * pressurePct / 100)};${200 - (200 * pressurePct / 100)}`} />
                <animate attributeName="height" dur="0.5s" calcMode="spline" keySplines="0.4 0 0.2 1" values={`${(200 * pressurePct / 100)};${(200 * pressurePct / 100)}`} />
              </>
            )}
          </rect>

          {/* Pressure Gauge Lines */}
          {[20, 40, 60, 80].map(p => (
            <line key={p} x1="150" y1={200 - (p * 2)} x2="160" y2={200 - (p * 2)} stroke="#475569" strokeWidth="2" />
          ))}

          {/* Label */}
          <text x="75" y="100" textAnchor="middle" fill="#fff" fontSize="12" opacity="0.5" style={{ pointerEvents: 'none' }}>
            TK-101
          </text>
        </g>

        {/* --- Unidad de Procesamiento (Centrifugadora) --- */}
        <g transform="translate(550, 150)">
          <circle cx="50" cy="50" r="60" fill="none" stroke="#475569" strokeWidth="4" />
          <circle cx="50" cy="50" r="50" fill="none" stroke={isCritical ? "#ef4444" : isLocked ? "#94a3b8" : "#10b981"} strokeWidth="4" strokeDasharray="60 100">
            {!isLocked && (
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur={isCritical ? "0.2s" : "4s"} repeatCount="indefinite" />
            )}
          </circle>
          
          {/* Core */}
          <circle cx="50" cy="50" r="30" fill="#1e293b" stroke="#334155" />
          <text x="50" y="55" textAnchor="middle" fill="#94a3b8" fontSize="10">PROC-A</text>
        </g>

        {/* --- Connecting Pipe Tank -> Proc --- */}
        <path d="M 450 150 L 500 150" fill="none" stroke="#334155" strokeWidth="12" />
        <path d="M 450 150 L 500 150" fill="none" stroke={valveStatus.includes('CERRADO') ? "#ef4444" : "#0ea5e9"} strokeWidth="6" strokeDasharray="10 10">
           {!valveStatus.includes('CERRADO') && !isLocked && <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />}
        </path>

        {/* --- Valve Indicator --- */}
        <g transform="translate(465, 130)">
          <rect x="0" y="0" width="20" height="40" fill={valveStatus.includes('CERRADO') ? "#ef4444" : "#22c55e"} stroke="#fff" strokeWidth="1" />
          <text x="10" y="-10" textAnchor="middle" fill="#fff" fontSize="10">V-01</text>
          {isLocked && (
            <text x="10" y="55" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">LOCKED</text>
          )}
        </g>

        {/* --- Data Overlays (HMI Style) --- */}
        <g transform="translate(50, 50)">
          <rect width="140" height="80" fill="rgba(2, 6, 23, 0.9)" stroke="#1e293b" rx="4" />
          <text x="10" y="20" fill="#94a3b8" fontSize="10" fontFamily="monospace">PRESIÓN SISTEMA</text>
          <text x="10" y="45" fill={isCritical ? "#ef4444" : isLocked ? "#94a3b8" : "#fff"} fontSize="24" fontFamily="monospace" fontWeight="bold">
            {pressure} <tspan fontSize="12" fill="#64748b">PSI</tspan>
          </text>
          {isCritical && <text x="10" y="70" fill="#ef4444" fontSize="10" fontWeight="bold" filter="url(#glow)">ALERTA CRÍTICA</text>}
        </g>

        {/* --- Status Overlay for 2002 Sabotage --- */}
        {isLocked && (
           <g transform="translate(250, 320)">
             <rect width="300" height="40" fill="rgba(0,0,0,0.8)" stroke="#ef4444" rx="4" />
             <text x="150" y="25" textAnchor="middle" fill="#ef4444" fontSize="14" fontFamily="monospace" fontWeight="bold">
               ⚠️ REMOTE ACCESS REVOKED
             </text>
           </g>
        )}

        <g transform="translate(50, 150)">
          <rect width="140" height="80" fill="rgba(2, 6, 23, 0.9)" stroke="#1e293b" rx="4" />
          <text x="10" y="20" fill="#94a3b8" fontSize="10" fontFamily="monospace">TEMPERATURA</text>
          <text x="10" y="45" fill={temp > 90 ? "#f59e0b" : "#fff"} fontSize="24" fontFamily="monospace" fontWeight="bold">
            {temp} <tspan fontSize="12" fill="#64748b">°C</tspan>
          </text>
        </g>

      </svg>

      {/* Cyber Attack Overlay Effect */}
      {isCompromised && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'repeating-linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.1) 10px, rgba(239, 68, 68, 0.2) 10px, rgba(239, 68, 68, 0.2) 20px)',
          pointerEvents: 'none',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid #ef4444',
            color: '#ef4444',
            padding: '20px',
            fontFamily: 'monospace',
            fontSize: '2rem',
            fontWeight: 'bold',
            animation: 'pulse 0.5s infinite'
          }}>
            SYSTEM COMPROMISED
          </div>
        </div>
      )}
    </div>
  );
};

export default MiningOperationsMap;
