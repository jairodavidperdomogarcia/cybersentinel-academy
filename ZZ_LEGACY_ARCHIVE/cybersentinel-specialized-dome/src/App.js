import React, { useState, useEffect } from 'react';
import { Shield, Anchor, Truck, Pickaxe, Globe, AlertTriangle, Save, Clock, Flame, Activity, Zap } from 'lucide-react';
import './App.css';
import StrategicRoutesMap from './components/StrategicRoutesMap';
import MiningOperationsMap from './components/MiningOperationsMap';
import SatelliteMap from './components/SatelliteMap';
import ATCRadarMap from './components/DefenseOperationsMap'; // Reutilizamos el componente visual para Aviación
import MissionFailedScreen from './components/MissionFailedScreen';
import { Plane } from 'lucide-react'; // Importamos icono de avión
import SystemErrorBoundary from './components/SystemErrorBoundary';

// Visualizador Holográfico del Motor de Supervivencia (Emulator 4 Core Visuals)
const SurvivalEngineVisual = ({ isGlobalCrisis }) => {
  return (
    <div style={{
      width: '80px',
      height: '80px',
      marginRight: '16px',
      flexShrink: 0,
      position: 'relative',
      filter: isGlobalCrisis ? 'drop-shadow(0 0 8px rgba(239,68,68,0.6))' : 'drop-shadow(0 0 5px rgba(34,197,94,0.4))',
      transition: 'all 0.5s'
    }}>
      <div className="globe-wrapper" style={{ border: isGlobalCrisis ? '2px solid #ef4444' : '1px solid #1f2937' }}>
        <div className="globe-grid" style={{ animation: isGlobalCrisis ? 'spin 4s linear infinite' : 'none' }} />

        <div className="orbit-ring" style={{ animationDuration: isGlobalCrisis ? '1s' : '16s', borderColor: isGlobalCrisis ? '#ef4444' : 'rgba(255,255,255,0.3)' }}>
          <div className={`sat-dot ${isGlobalCrisis ? 'sat-dot--danger' : 'sat-dot--primary'}`} />
        </div>

        <div className="orbit-ring" style={{ inset: '26%', animationDuration: isGlobalCrisis ? '1.5s' : '22s', borderColor: isGlobalCrisis ? '#ef4444' : 'rgba(59,130,246,0.4)' }}>
          <div className={`sat-dot ${isGlobalCrisis ? 'sat-dot--danger' : 'sat-dot--backup'}`} />
        </div>

        <div className="orbit-ring" style={{ inset: '34%', animationDuration: isGlobalCrisis ? '2s' : '28s', borderColor: isGlobalCrisis ? '#ef4444' : 'rgba(239,68,68,0.4)' }}>
          <div className="sat-dot sat-dot--danger" />
        </div>
        
        {isGlobalCrisis && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(239, 68, 68, 0.2)',
            animation: 'pulse 0.5s infinite'
          }} />
        )}
      </div>
    </div>
  );
};

// Monitor de Estabilidad Global (Emulador 4 Core)
const GlobalStabilityMonitor = ({ isGlobalCrisis }) => {
  const [metrics, setMetrics] = useState({
    agua: 98,
    energia: 96,
    transporte: 88,
    defensa: 92
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        // Aceleramos dramáticamente la caída (Entropy Boost)
        agua: isGlobalCrisis ? Math.max(0, prev.agua - (Math.random() * 5 + 2)) : Math.min(100, prev.agua + Math.random() * 3),
        energia: isGlobalCrisis ? Math.max(0, prev.energia - (Math.random() * 8 + 3)) : Math.min(100, prev.energia + Math.random() * 4),
        transporte: isGlobalCrisis ? Math.max(0, prev.transporte - (Math.random() * 6 + 2)) : Math.min(100, prev.transporte + Math.random() * 2),
        defensa: isGlobalCrisis ? Math.max(0, prev.defensa - (Math.random() * 4 + 1)) : Math.min(100, prev.defensa + Math.random() * 2),
      }));
    }, 800); // Intervalo más rápido (0.8s vs 2s) para feedback inmediato
    return () => clearInterval(interval);
  }, [isGlobalCrisis]);

  const getColor = (val) => val > 80 ? '#22c55e' : val > 40 ? '#f59e0b' : '#ef4444';
  
  // Detectar si alguna métrica está en niveles críticos (< 30%)
  const isCriticalLevel = Object.values(metrics).some(val => val < 30);

  return (
    <div className={isCriticalLevel ? 'critical-alert-active' : ''} style={{
      background: isGlobalCrisis ? 'rgba(69, 10, 10, 0.9)' : '#020617', // Fondo rojo sutil en crisis
      borderBottom: '1px solid #1f2937',
      padding: '12px 0',
      marginBottom: '0',
      borderTop: '1px solid #1e293b',
      transition: 'background 0.5s'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <SurvivalEngineVisual isGlobalCrisis={isGlobalCrisis || isCriticalLevel} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              color: isGlobalCrisis || isCriticalLevel ? '#fca5a5' : '#94a3b8',
              letterSpacing: '0.15em',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 'bold'
            }}>
              <Activity size={16} className={isGlobalCrisis || isCriticalLevel ? 'animate-pulse' : ''} /> 
              EMULATOR IV: GLOBAL SURVIVAL ENGINE
            </div>
            
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {Object.entries(metrics).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '80px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase' }}>{key}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: getColor(val) }}>{Math.round(val)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${val}%`,
                      height: '100%',
                      background: getColor(val),
                      borderRadius: '2px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: (isGlobalCrisis || isCriticalLevel) ? `0 0 8px ${getColor(val)}` : 'none'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
           fontFamily: 'monospace',
           fontSize: '1rem',
           color: isGlobalCrisis || isCriticalLevel ? '#fff' : '#22c55e',
           fontWeight: 'bold',
           animation: isGlobalCrisis || isCriticalLevel ? 'pulse 0.5s infinite' : 'none',
           padding: '8px 16px',
           background: isGlobalCrisis || isCriticalLevel ? '#ef4444' : 'rgba(34, 197, 94, 0.1)',
           borderRadius: '4px',
           border: isGlobalCrisis || isCriticalLevel ? '2px solid #fca5a5' : '1px solid rgba(34, 197, 94, 0.3)',
           boxShadow: isGlobalCrisis || isCriticalLevel ? '0 0 20px rgba(239, 68, 68, 0.5)' : 'none',
           textAlign: 'center',
           minWidth: '200px'
        }}>
          {isGlobalCrisis ? '⚠️ CIVILIZATION COLLAPSE' : isCriticalLevel ? '⚠️ CRITICAL FAILURE' : 'SYSTEM OPTIMAL'}
        </div>
      </div>
    </div>
  );
};

// Dominio de Transporte (Mejorado con Google Earth)
const TransportDomain = ({ isGlobalGpsCrisis }) => {
  const [corredores, setCorredores] = useState([
    {
      id: 'MAR-ATL-01',
      modo: 'MARÍTIMO',
      etiqueta: 'Corredor Atlántico',
      origen: 'Shenzhen',
      destino: 'Rotterdam',
      capacidad: 72,
      estado: 'TENSO',
      retrasoHoras: 24
    },
    {
      id: 'AIRE-EUR-02',
      modo: 'AÉREO',
      etiqueta: 'Puente Aéreo Crítico',
      origen: 'Doha',
      destino: 'Frankfurt',
      capacidad: 84,
      estado: 'PRIORITARIO',
      retrasoHoras: 6
    },
    {
      id: 'RAIL-EUR-03',
      modo: 'FERROVIARIO',
      etiqueta: 'Corredor Terrestre',
      origen: 'Varsovia',
      destino: 'Hamburgo',
      capacidad: 63,
      estado: 'INESTABLE',
      retrasoHoras: 12
    }
  ]);

  const [decision, setDecision] = useState(null);

  const simularDisrupcion = index => {
    setCorredores(actual =>
      actual.map((c, i) =>
        i === index
          ? {
              ...c,
              estado: c.estado === 'CORTADO' ? 'TENSO' : 'CORTADO',
              capacidad: c.estado === 'CORTADO' ? Math.min(c.capacidad + 25, 100) : Math.max(c.capacidad - 30, 5),
              retrasoHoras: c.estado === 'CORTADO' ? Math.max(c.retrasoHoras - 24, 0) : c.retrasoHoras + 36
            }
          : c
      )
    );
  };

  const priorizarTipo = tipo => {
    setDecision(tipo);
    setCorredores(actual =>
      actual.map(c =>
        tipo === 'farmacos'
          ? c.modo === 'AÉREO'
            ? { ...c, estado: 'PRIORITARIO', retrasoHoras: Math.max(c.retrasoHoras - 4, 0) }
            : { ...c, retrasoHoras: c.retrasoHoras + 8 }
          : c.modo === 'MARÍTIMO'
          ? { ...c, estado: 'PRIORITARIO', retrasoHoras: Math.max(c.retrasoHoras - 12, 0) }
          : { ...c, retrasoHoras: c.retrasoHoras + 6 }
      )
    );
  };

  const normalizarRed = () => {
    setDecision(null);
    setCorredores(actual =>
      actual.map(c => ({
        ...c,
        estado: c.estado === 'CORTADO' ? 'TENSO' : c.estado,
        capacidad: Math.min(c.capacidad + 10, 100),
        retrasoHoras: Math.max(c.retrasoHoras - 8, 0)
      }))
    );
  };

  // Funciones para Google Earth
  const abrirCanalSuez = () => {
    window.open('https://earth.google.com/web/@30.5931,32.3215,100a,20000d,35y,0h,0t,0r', '_blank', 'noopener,noreferrer');
  };

  const abrirPuertosUSA = () => {
    window.open('https://earth.google.com/web/@37.7749,-122.4194,1000a,50000d,35y,0h,0t,0r', '_blank', 'noopener,noreferrer');
  };

  const abrirRedFerroviaria = () => {
    window.open('https://earth.google.com/web/@50.1109,8.6821,2000a,500000d,35y,0h,0t,0r', '_blank', 'noopener,noreferrer');
  };

  const abrirMapaGlobal = () => {
    window.open('https://earth.google.com/web/@25.0,0.0,3000000a,5000000d,35y,0h,0t,0r', '_blank', 'noopener,noreferrer');
  };

  const scoreResiliencia = (() => {
    const penalizacion = corredores.reduce((acc, c) => {
      const base =
        c.estado === 'CORTADO' ? 30 : c.estado === 'INESTABLE' ? 18 : c.estado === 'TENSO' ? 10 : 4;
      return acc + base + c.retrasoHoras / 4;
    }, 0);
    const bruto = 100 - penalizacion;
    const ajustado = Math.max(5, Math.min(95, bruto));
    return Math.round(ajustado);
  })();

  const colorScore =
    scoreResiliencia >= 75 ? '#22c55e' : scoreResiliencia >= 45 ? '#fbbf24' : '#f97316';

  return (
    <div
      className="domain-view"
      style={{
        padding: '24px',
        background: 'rgba(11, 17, 32, 0.7)',
        backdropFilter: 'blur(8px)',
        color: '#4ade80',
        border: '2px solid #16a34a',
        borderRadius: '8px'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Truck size={32} />
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              SISTEMA DE TRANSPORTE MULTIMODAL
            </h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>
              Orquestación de puertos, espacio aéreo y corredores ferroviarios en tiempo casi real.
            </p>
          </div>
        </div>
        <div
          style={{
            padding: '8px 14px',
            borderRadius: '999px',
            border: '1px solid #16a34a',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            color: '#bbf7d0',
            background: 'rgba(22,163,74,0.1)'
          }}
        >
          Multimodal: sincronización crítica de flujos
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Nueva visualización de mapa */}
          <div style={{ 
            marginBottom: '20px', 
            background: 'rgba(2, 6, 23, 0.6)', 
            backdropFilter: 'blur(4px)', 
            padding: '20px', 
            borderRadius: '12px', 
            border: '1px solid rgba(30, 41, 59, 0.8)', 
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)', 
            position: 'relative', 
            overflow: 'hidden' 
          }}> 
            {/* Efecto de gradiente sutil en el fondo */} 
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              width: '200px', 
              height: '100px', 
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', 
              zIndex: 0 
            }}></div> 
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px', 
              position: 'relative', 
              zIndex: 1 
            }}> 
              <div> 
                <h3 style={{ 
                  margin: '0 0 4px 0', 
                  color: '#4ade80', 
                  fontSize: '1.1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  fontWeight: '600' 
                }}> 
                  <Globe size={22} /> MAPA ESTRATÉGICO DE RUTAS CRÍTICAS 
                </h3> 
                <p style={{ 
                  margin: 0, 
                  color: '#94a3b8', 
                  fontSize: '0.85rem', 
                  fontFamily: 'monospace' 
                }}> 
                  Sistema de monitorización global • Actualizado: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                </p> 
              </div> 
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px' 
              }}> 
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#94a3b8', 
                  fontFamily: 'monospace', 
                  background: 'rgba(30, 41, 59, 0.7)', 
                  padding: '6px 12px', 
                  borderRadius: '6px', 
                  border: '1px solid rgba(71, 85, 105, 0.4)' 
                }}> 
                  ANÁLISIS EN TIEMPO REAL
                </div> 
                
                {/* Indicador de estado */} 
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '4px 10px', 
                  background: scoreResiliencia < 45 ? 'rgba(239, 68, 68, 0.15)' : 
                              scoreResiliencia < 75 ? 'rgba(245, 158, 11, 0.15)' : 
                              'rgba(34, 197, 94, 0.15)', 
                  borderRadius: '20px', 
                  border: `1px solid ${scoreResiliencia < 45 ? '#ef4444' : 
                                      scoreResiliencia < 75 ? '#f59e0b' : 
                                      '#22c55e'}` 
                }}> 
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: scoreResiliencia < 45 ? '#ef4444' : 
                                scoreResiliencia < 75 ? '#f59e0b' : 
                                '#22c55e', 
                    animation: 'pulse 2s infinite' 
                  }}></div> 
                  <span style={{ 
                    fontSize: '0.7rem', 
                    color: scoreResiliencia < 45 ? '#fca5a5' : 
                            scoreResiliencia < 75 ? '#fde68a' : 
                            '#86efac', 
                    fontWeight: '500' 
                  }}> 
                    {scoreResiliencia < 45 ? 'ALTA VULNERABILIDAD' : 
                      scoreResiliencia < 75 ? 'RIESGO MODERADO' : 
                      'ESTABLE'} 
                  </span> 
                </div> 
              </div> 
            </div> 
            
            {/* Leyenda visual */} 
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              marginBottom: '16px', 
              padding: '12px', 
              background: 'rgba(15, 23, 42, 0.5)', 
              borderRadius: '8px', 
              border: '1px solid rgba(71, 85, 105, 0.3)', 
              fontSize: '0.75rem' 
            }}> 
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}> 
                <div style={{ 
                  width: '16px', 
                  height: '4px', 
                  background: '#ef4444', 
                  borderRadius: '2px' 
                }}></div> 
                <span style={{ color: '#cbd5e1' }}>Ruta crítica (&gt;70%)</span> 
              </div> 
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}> 
                <div style={{ 
                  width: '12px', 
                  height: '2px', 
                  background: '#22c55e', 
                  borderRadius: '2px' 
                }}></div> 
                <span style={{ color: '#cbd5e1' }}>Ruta normal</span> 
              </div> 
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}> 
                <div style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  background: 'transparent', 
                  border: '2px solid #f59e0b', 
                  animation: 'pulse 1.5s infinite' 
                }}></div> 
                <span style={{ color: '#cbd5e1' }}>Nodo único de fallo</span> 
              </div> 
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}> 
                <div style={{ 
                  width: '14px', 
                  height: '14px', 
                  borderRadius: '50%', 
                  background: 'conic-gradient(#3b82f6, #8b5cf6, #3b82f6)', 
                  animation: 'spin 2s linear infinite' 
                }}></div> 
                <span style={{ color: '#60a5fa' }}>Punto de congestión</span> 
              </div> 
            </div> 
            
            {/* Mapa estratégico */} 
            <div style={{ 
              position: 'relative', 
              height: '280px', 
              background: 'rgba(15, 23, 42, 0.7)', 
              borderRadius: '8px', 
              border: '1px solid rgba(71, 85, 105, 0.4)', 
              padding: '0', /* Removed padding to let map fill container */
              marginBottom: '16px', 
              overflow: 'hidden' 
            }}> 
              <StrategicRoutesMap 
                corredores={corredores} 
                crisisLevel={ 
                  scoreResiliencia < 45 ? 3 : 
                  scoreResiliencia < 75 ? 2 : 
                  1 
                } 
                showAnimation={true} 
                showLabels={true}
                showLegend={false} /* Hide internal legend to avoid duplication */
                showOverlayLabels={false} /* Hide internal labels to avoid duplication */
                showCriticalDots={true}
                isGlobalGpsCrisis={isGlobalGpsCrisis}
              /> 
              
              {/* Etiquetas Consolidadas - Extremo Inferior Izquierdo (Transparentes y Compactas) */}
              <div style={{ 
                position: 'absolute', 
                bottom: '15px', 
                left: '15px',
                background: 'transparent', /* Fondo transparente como solicitó el usuario */
                padding: '0px',
                minWidth: '180px',
                zIndex: 20,
                pointerEvents: 'none' /* Permitir clicks a través */
              }}>
                <div style={{ 
                  fontSize: '0.65rem', 
                  color: '#64748b', 
                  marginBottom: '6px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px',
                  fontWeight: 'bold',
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)' 
                }}>
                  Nodos Estratégicos
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '0.7rem', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', marginRight: '6px', boxShadow: '0 0 5px #10b981' }}></div>
                  <span style={{ color: '#e2e8f0', flex: 1, fontWeight: '500' }}>VENEZUELA</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '0.7rem', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', marginRight: '6px', boxShadow: '0 0 5px #ef4444' }}></div>
                  <span style={{ color: '#e2e8f0', flex: 1, fontWeight: '500' }}>SUEZ</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '0.7rem', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', marginRight: '6px', boxShadow: '0 0 5px #f59e0b' }}></div>
                  <span style={{ color: '#e2e8f0', flex: 1, fontWeight: '500' }}>PANAMÁ</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.7rem', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', marginRight: '6px', boxShadow: '0 0 5px #3b82f6' }}></div>
                  <span style={{ color: '#e2e8f0', flex: 1, fontWeight: '500' }}>GIBRALTAR</span>
                </div>
              </div> 
            </div> 
            
            {/* Panel de interpretación mejorado */} 
            <div style={{ 
              fontSize: '0.8rem', 
              color: '#cbd5e1', 
              marginTop: '16px', 
              padding: '16px', 
              background: 'linear-gradient(to right, rgba(15, 23, 42, 0.7), rgba(30, 41, 59, 0.5))', 
              borderRadius: '8px', 
              border: '1px solid rgba(71, 85, 105, 0.4)' 
            }}> 
              <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}> 
                <div style={{ flex: 1 }}> 
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '6px', 
                    color: '#4ade80' 
                  }}> 
                    <div style={{ fontSize: '1.2rem' }}>📊</div> 
                    <strong>Interpretación estratégica:</strong> 
                  </div> 
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', lineHeight: '1.5' }}> 
                    El <strong style={{ color: '#ef4444' }}>grosor y color</strong> indican importancia crítica y nivel de congestión. 
                    Los <strong style={{ color: '#f59e0b' }}>nodos pulsantes</strong> son puntos únicos de fallo con impacto global. 
                  </p> 
                </div> 
                
                <div style={{ flex: 1 }}> 
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '6px', 
                    color: '#60a5fa' 
                  }}> 
                    <div style={{ fontSize: '1.2rem' }}>⚠️</div> 
                    <strong>Alertas activas:</strong> 
                  </div> 
                  <div style={{ fontSize: '0.75rem' }}> 
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}> 
                      <span>Suez - Alta congestión</span> 
                      <span style={{ color: '#ef4444', fontFamily: 'monospace' }}>CRÍTICO</span> 
                    </div> 
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}> 
                      <span>Gibraltar - Retrasos</span> 
                      <span style={{ color: '#f59e0b', fontFamily: 'monospace' }}>MODERADO</span> 
                    </div> 
                  </div> 
                </div> 
              </div> 
              
              <p style={{ 
                margin: 0, 
                fontSize: '0.7rem', 
                color: '#94a3b8', 
                fontStyle: 'italic', 
                borderTop: '1px solid rgba(71, 85, 105, 0.3)', 
                paddingTop: '10px' 
              }}> 
                💡 <strong>Nota:</strong> Hover sobre rutas para métricas detalladas. Clic en nodos para análisis de vulnerabilidad. 
                Los datos se actualizan cada 5 minutos. 
              </p> 
            </div> 
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {corredores.map((c, index) => {
            const colorEstado =
              c.estado === 'CORTADO'
                ? '#ef4444'
                : c.estado === 'INESTABLE'
                ? '#f97316'
                : c.estado === 'PRIORITARIO'
                ? '#22c55e'
                : '#eab308';

            const modoIcono =
              c.modo === 'MARÍTIMO' ? <Anchor size={16} /> : c.modo === 'AÉREO' ? <Globe size={16} /> : <Truck size={16} />;

            return (
              <div
                key={c.id}
                style={{
                  background: '#020617',
                  padding: '14px',
                  borderRadius: '6px',
                  border: '1px solid #14532d',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      color: '#9ca3af'
                    }}
                  >
                    {c.id}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      border: '1px solid #16a34a',
                      fontSize: '0.7rem',
                      color: '#bbf7d0'
                    }}
                  >
                    {modoIcono}
                    {c.modo}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#e5e7eb' }}>
                  <p style={{ margin: 0 }}>
                    Ruta:{' '}
                    <span style={{ color: '#a5b4fc' }}>
                      {c.origen} → {c.destino}
                    </span>
                  </p>
                  <p style={{ margin: 0 }}>
                    Capacidad útil:{' '}
                    <span style={{ fontFamily: 'monospace', color: '#4ade80' }}>{c.capacidad}%</span>
                  </p>
                  <p style={{ margin: 0 }}>
                    Retraso estimado:{' '}
                    <span style={{ fontFamily: 'monospace', color: '#facc15' }}>
                      +{c.retrasoHoras} h
                    </span>
                  </p>
                  <p style={{ margin: 0 }}>
                    Estado:{' '}
                    <span
                      style={{
                        fontFamily: 'monospace',
                        color: colorEstado
                      }}
                    >
                      {c.estado}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => simularDisrupcion(index)}
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    background: c.estado === 'CORTADO' ? '#1e293b' : '#7c2d12',
                    color: c.estado === 'CORTADO' ? '#bfdbfe' : '#fee2e2',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace'
                  }}
                >
                  {c.estado === 'CORTADO' ? 'Restablecer corredor' : 'Simular bloqueo'}
                </button>
              </div>
            );
          })}
        </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: '#020617',
            borderRadius: '8px',
            border: '1px solid #14532d',
            padding: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} style={{ color: '#4ade80' }} />
            <div>
              <h3
                style={{
                  fontSize: '0.9rem',
                  margin: 0,
                  color: '#e5e7eb'
                }}
              >
                Score de resiliencia logística
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>
                Cuanto más bajo, más cerca del colapso sistémico.
              </p>
            </div>
          </div>

          <div
            style={{
              background: '#020617',
              borderRadius: '999px',
              border: '1px solid #1f2937',
              padding: '6px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${scoreResiliencia}%`,
                transition: 'width 0.3s ease',
                height: '12px',
                borderRadius: '999px',
                background: `linear-gradient(90deg, ${colorScore}, #22c55e)`
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#e5e7eb'
              }}
            >
              {scoreResiliencia}/100
            </div>
          </div>

          <div
            style={{
              padding: '12px',
              borderRadius: '6px',
              background: 'rgba(15,23,42,0.9)',
              border: '1px dashed #14532d',
              fontSize: '0.8rem',
              color: '#9ca3af'
            }}
          >
            <p style={{ margin: 0 }}>
              Decisión activa:{' '}
              <span style={{ fontFamily: 'monospace', color: '#e5e7eb' }}>
                {decision === 'farmacos'
                  ? 'Priorizar cargamentos médicos (Aéreo primero)'
                  : decision === 'componentes'
                  ? 'Priorizar componentes estratégicos (Marítimo primero)'
                  : 'Pendiente de decisión'}
              </span>
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4
              style={{
                margin: 0,
                fontSize: '0.8rem',
                color: '#eab308',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <AlertTriangle size={16} /> Palanca de decisión del especialista
            </h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => priorizarTipo('farmacos')}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  background: '#15803d',
                  color: '#f9fafb',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
              >
                Fármacos críticos primero
              </button>
              <button
                onClick={() => priorizarTipo('componentes')}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  background: '#1e3a8a',
                  color: '#e5e7eb',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
              >
                Componentes estratégicos primero
              </button>
            </div>
            <button
              onClick={normalizarRed}
              style={{
                marginTop: '4px',
                padding: '8px 10px',
                background: '#0f172a',
                color: '#e5e7eb',
                borderRadius: '4px',
                border: '1px solid #1f2937',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'monospace'
              }}
            >
              Reequilibrar red multimodal
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN GOOGLE EARTH PARA TRANSPORTE */}
      <div style={{ marginTop: '24px', background: '#020617', padding: '16px', borderRadius: '8px', border: '1px solid #14532d' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h4 style={{ margin: 0, color: '#4ade80', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={20} /> VISUALIZACIÓN GEOESPACIAL - INFRAESTRUCTURA CRÍTICA
          </h4>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={abrirCanalSuez}
              style={{
                padding: '6px 12px',
                background: '#14532d',
                color: '#bbf7d0',
                border: '1px solid #16a34a',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Anchor size={14} /> Canal Suez
            </button>
            <button
              onClick={abrirPuertosUSA}
              style={{
                padding: '6px 12px',
                background: '#1e3a8a',
                color: '#bfdbfe',
                border: '1px solid #3b82f6',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Anchor size={14} /> Puertos USA
            </button>
            <button
              onClick={abrirRedFerroviaria}
              style={{
                padding: '6px 12px',
                background: '#7c2d12',
                color: '#fed7aa',
                border: '1px solid #ea580c',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Truck size={14} /> Red Ferroviaria
            </button>
            <button
              onClick={abrirMapaGlobal}
              style={{
                padding: '6px 12px',
                background: '#0f172a',
                color: '#e5e7eb',
                border: '1px solid #374151',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Globe size={14} /> Vista Global
            </button>
          </div>
        </div>
        
        <div style={{ 
          background: '#000', 
          height: '200px', 
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed #374151',
          position: 'relative'
        }}>
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            <Globe size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Click en los botones para explorar infraestructura crítica en Google Earth
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#4b5563' }}>
              Se abrirá en nueva pestaña. Requiere conexión a internet.
            </p>
          </div>
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            fontSize: '0.7rem',
            color: '#4b5563',
            fontFamily: 'monospace'
          }}>
            Coordenadas: 30.5931°N, 32.3215°E
          </div>
        </div>
      </div>
    </div>
  );
};

const CivilAviationDomain = ({ isGlobalGpsCrisis }) => {
  const [isSpoofed, setIsSpoofed] = useState(false);

  // Reacción automática ante crisis global
  useEffect(() => {
    if (isGlobalGpsCrisis) {
      setIsSpoofed(true);
    }
  }, [isGlobalGpsCrisis]);

  return (
    <div className="domain-view" style={{ padding: '24px', background: '#0f172a', color: '#38bdf8', border: '2px solid #0ea5e9', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Plane size={32} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>SEGURIDAD AÉREA CIVIL (ATC)</h2>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1rem' }}>🛡️ Protocolo de Protección de Espacio Aéreo</h3>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>
            Monitoreo en tiempo real de señales ADS-B y Radar Primario. Detección de anomalías por inyección de señales (Spoofing) y segregación de tráfico crítico.
          </p>
        </div>

        <h3 style={{ fontSize: '1rem', color: '#9ca3af', marginBottom: '12px', fontFamily: 'monospace' }}>RADAR DE CONTROL DE TRÁFICO AÉREO</h3>
        <ATCRadarMap 
          isSpoofed={isSpoofed} 
          onToggleSpoof={() => setIsSpoofed(!isSpoofed)} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 4px 0', color: '#ef4444', fontSize: '0.875rem' }}>AMENAZA ACTIVA: GPS SPOOFING</h4>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#fca5a5' }}>
            Riesgo de colisión por datos de telemetría falsos. Los sistemas de abordo pueden calcular rutas erróneas.
          </p>
        </div>
        <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 4px 0', color: '#22c55e', fontSize: '0.875rem' }}>SISTEMAS DE RESPALDO</h4>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#86efac' }}>
            ILS (Instrument Landing System) y VOR operativos. Comunicación por voz analógica (VHF) disponible.
          </p>
        </div>
      </div>
    </div>
  );
};

const DefenseDomain = ({ isGlobalGpsCrisis }) => {
  const [links, setLinks] = useState([
    { id: 'SAT-GEO-01', orbit: 'GEO', region: 'Cobertura Global', status: 'PRIMARIO', latency: 620, jitter: 40 },
    { id: 'SAT-MEO-07', orbit: 'MEO', region: 'Teatro Europa', status: 'RESPALDO', latency: 180, jitter: 18 },
    { id: 'SAT-LEO-21', orbit: 'LEO', region: 'Banda Polar', status: 'EN RIESGO', latency: 45, jitter: 9 }
  ]);

  // Reacción automática ante crisis global
  useEffect(() => {
    if (isGlobalGpsCrisis) {
      setLinks(current =>
        current.map(link => ({
          ...link,
          status: 'COMPROMETIDO',
          latency: Math.floor(link.latency + 200 + Math.random() * 100),
          jitter: Math.floor(link.jitter + 50 + Math.random() * 20)
        }))
      );
    }
  }, [isGlobalGpsCrisis]);

  const degradeLink = index => {
    setLinks(current =>
      current.map((link, i) =>
        i === index
          ? { ...link, status: 'DEGRADADO', latency: link.latency + 120, jitter: link.jitter + 20 }
          : link
      )
    );
  };

  const rerouteTraffic = () => {
    setLinks(current =>
      current.map(link =>
        link.status === 'DEGRADADO' || link.status === 'EN RIESGO'
          ? { ...link, status: 'RERUTEADO', latency: link.latency + 30, jitter: link.jitter - 5 }
          : link
      )
    );
  };

  const openEarthView = () => {
    const url = 'https://earth.google.com/web/@25.0,56.5,1500000a,35d,0h,0t,0r';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="domain-view" style={{ padding: '24px', background: '#050816', color: '#eab308', border: '2px solid #ca8a04', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Shield size={32} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>DEFENSA Y ENLACES SATELITALES</h2>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <SatelliteMap 
            links={links} 
            onDegrade={degradeLink} 
            onReroute={rerouteTraffic} 
            isGlobalGpsCrisis={isGlobalGpsCrisis}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {links.map((link, index) => (
          <div key={link.id} style={{ background: '#020617', padding: '16px', borderRadius: '6px', border: '1px solid #4b5563' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#9ca3af' }}>{link.id}</span>
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '999px', border: '1px solid #facc15', color: '#facc15' }}>{link.orbit}</span>
            </div>

            <p style={{ fontSize: '0.8rem', margin: '4px 0', color: '#e5e7eb' }}>
              Región: <span style={{ color: '#fbbf24' }}>{link.region}</span>
            </p>
            <p style={{ fontSize: '0.8rem', margin: '4px 0', color: '#e5e7eb' }}>
              Latencia: <span style={{ fontFamily: 'monospace', color: '#93c5fd' }}>{link.latency} ms</span>
            </p>
            <p style={{ fontSize: '0.8rem', margin: '4px 0', color: '#e5e7eb' }}>
              Jitter: <span style={{ fontFamily: 'monospace', color: '#f97316' }}>{link.jitter} ms</span>
            </p>
            <p style={{ fontSize: '0.8rem', margin: '4px 0', color: '#e5e7eb' }}>
              Estado:{' '}
              <span
                style={{
                  fontFamily: 'monospace',
                  color: link.status === 'PRIMARIO' ? '#22c55e' : link.status === 'DEGRADADO' ? '#f97316' : '#facc15'
                }}
              >
                {link.status}
              </span>
            </p>

            <button
              onClick={() => degradeLink(index)}
              style={{
                marginTop: '8px',
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: '#7c2d12',
                color: '#fee2e2',
                fontSize: '0.75rem',
                fontFamily: 'monospace'
              }}
            >
              Simular interferencia
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
          <p style={{ margin: 0 }}>Objetivo táctico: mantener conectividad segura &lt; 250 ms para teatro activo.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={rerouteTraffic}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              background: '#1d4ed8',
              color: '#e5e7eb',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Globe size={16} /> Re enrutar tráfico crítico
          </button>
          <button
            onClick={openEarthView}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: '1px solid #facc15',
              cursor: 'pointer',
              background: '#022c22',
              color: '#facc15',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'monospace'
            }}
          >
            <Globe size={16} /> Ver teatro en Google Earth
          </button>
        </div>
      </div>
    </div>
  );
};

const MiningDomain = () => {
  const [pressure, setPressure] = useState(850);
  const [temp, setTemp] = useState(65);
  const [valveStatus, setValveStatus] = useState('NOMINAL');
  const [scadaStatus, setScadaStatus] = useState('PROTEGIDO');

  const simulateCyberAttack = () => {
    setPressure(prev => prev + 450);
    setTemp(prev => prev + 35);
    setValveStatus('FALLO CRÍTICO');
    setScadaStatus('COMPROMETIDO');
  };

  const simulateSabotage2002 = () => {
    setPressure(850); // Presión normal aparente
    setTemp(65);
    setValveStatus('CERRADO (HARDWARE LOCK)');
    setScadaStatus('ACCESO DENEGADO (2002)');
  };

  const emergencyShutdown = () => {
    setPressure(0);
    setTemp(25);
    setValveStatus('CERRADO (ESD)');
    setScadaStatus('MODO MANUAL');
  };

  const openEarthMining = () => {
    const url = 'https://earth.google.com/web/@-24.0,-68.5,1200000a,45d,0h,0t,0r';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="domain-view" style={{ padding: '24px', background: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(8px)', color: '#fb923c', border: '2px solid #ea580c', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Pickaxe size={32} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>MINERÍA Y RECURSOS ENERGÉTICOS</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={{ background: '#1f2937', padding: '20px', borderRadius: '8px', border: '1px solid #7c2d12' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fdba74', margin: '0 0 16px 0' }}>
            <Zap size={20} /> EXTRACCIÓN LITIO/COBALTO
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: '#9ca3af' }}>Eficiencia Planta:</span>
              <span style={{ fontFamily: 'monospace', color: '#fff' }}>94.2%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: '#9ca3af' }}>Sensores Ambientales:</span>
              <span style={{ fontFamily: 'monospace', color: '#22c55e' }}>NORMAL</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: '#9ca3af' }}>Flota Autónoma:</span>
              <span style={{ fontFamily: 'monospace', color: '#fbbf24' }}>ACTIVA (18 Unidades)</span>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={openEarthMining}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid #f97316',
                cursor: 'pointer',
                background: '#000',
                color: '#fdba74',
                fontSize: '0.8rem',
                fontFamily: 'monospace'
              }}
            >
              Ver mina en Google Earth
            </button>
          </div>
        </div>

        <div
          style={{
            background: '#1f2937',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ea580c',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', margin: 0 }}>
            <Flame size={20} /> REFINERÍA & OLEODUCTOS
          </h3>

          <div style={{ flex: 1, minHeight: '320px' }}>
            <MiningOperationsMap 
              pressure={pressure} 
              temp={temp} 
              valveStatus={valveStatus} 
              scadaStatus={scadaStatus} 
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={simulateCyberAttack}
              style={{
                flex: 1,
                padding: '8px',
                background: '#7f1d1d',
                color: '#fecaca',
                border: '1px solid #ef4444',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'monospace'
              }}
            >
              SIMULAR ATAQUE PLC
            </button>
            <button
              onClick={simulateSabotage2002}
              style={{
                flex: 1,
                padding: '8px',
                background: '#451a03',
                color: '#fdba74',
                border: '1px solid #f97316',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'monospace'
              }}
            >
              SABOTAJE 2002 (LOCKOUT)
            </button>
            <button
              onClick={emergencyShutdown}
              style={{
                flex: 1,
                padding: '8px',
                background: '#ea580c',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'monospace'
              }}
            >
              PARADA EMERGENCIA (ESD)
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          background: 'rgba(234, 88, 12, 0.1)',
          borderRadius: '4px',
          border: '1px dashed #ea580c'
        }}
      >
        <Activity size={24} style={{ color: '#ea580c' }} />
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: '#fff' }}>ALERTA DE SEGURIDAD INDUSTRIAL (OT)</h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>
            Se detectan anomalías en el protocolo Modbus TCP. Posible inyección de comandos no autorizados en controladores de flujo.
          </p>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('transport');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [missionFailed, setMissionFailed] = useState(false);
  
  // Estado Normal (Nivel Operativo)
  const [isGlobalGpsCrisis, setIsGlobalGpsCrisis] = useState(false);

  useEffect(() => {
    if (missionFailed) return; // Stop timer if failed

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setMissionFailed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [missionFailed]);

  const handleRetry = () => {
    setTimeLeft(600);
    setMissionFailed(false);
  };

  const formatTime = seconds => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-container">
      <div className="scanline" />
      {missionFailed && <MissionFailedScreen onRetry={handleRetry} />}

      <header
        style={{
          borderBottom: '1px solid #14532d',
          background: 'rgba(17, 24, 39, 0.5)',
          backdropFilter: 'blur(4px)',
          padding: '16px',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                background: timeLeft < 60 ? '#ef4444' : '#22c55e',
                borderRadius: '50%',
                boxShadow: `0 0 10px ${timeLeft < 60 ? '#ef4444' : '#22c55e'}`,
                animation: timeLeft < 60 ? 'pulse 0.5s infinite' : 'none'
              }}
            ></div>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
                color: timeLeft < 60 ? '#ef4444' : '#22c55e',
                margin: 0,
                transition: 'color 0.5s'
              }}
            >
              CYBERSENTINEL <span style={{ color: '#fff', opacity: 0.5 }}>// SPECIALIZED DOME (VOL.3)</span>
            </h1>
          </div>

          {/* Crisis Timer Display */}
          <div style={{ 
            background: '#0f172a', 
            padding: '4px 12px', 
            borderRadius: '4px', 
            border: `1px solid ${timeLeft < 180 ? '#ef4444' : '#1e293b'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Clock size={16} color={timeLeft < 180 ? '#ef4444' : '#9ca3af'} />
            <span style={{ 
              fontFamily: 'monospace', 
              fontSize: '1rem', 
              fontWeight: 'bold',
              color: timeLeft < 60 ? '#ef4444' : timeLeft < 180 ? '#fbbf24' : '#e5e7eb'
            }}>
              T-MINUS {formatTime(timeLeft)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', fontFamily: 'monospace', alignItems: 'center' }}>
            <button
              onClick={() => window.close()}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                color: '#ef4444',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.4)';
                e.target.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <span>✕</span> EXIT DOME
            </button>
            <span style={{ color: '#6b7280' }}>|</span>
            <a
              href="http://localhost:4000/WEB_PLATFORM/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}
            >
              COMMAND CENTER (V1)
            </a>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}
            >
              STRATEGIC HUB (V2)
            </a>
            <a
              href="http://localhost:3008"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}
            >
              WAR ROOM (V4)
            </a>
            <span style={{ color: '#4ade80', borderBottom: '2px solid #22c55e' }}>SPECIALIZED DOME (V3)</span>
          </div>
        </div>
      </header>

      <GlobalStabilityMonitor isGlobalCrisis={isGlobalGpsCrisis} />

      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: '1fr 3fr',
          gap: '24px'
        }}
      >
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#111827', border: '1px solid #14532d', borderRadius: '8px', padding: '16px' }}>
            <h3
              style={{
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '16px'
              }}
            >
              Dominios Especializados
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('transport')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: activeTab === 'transport' ? 'rgba(20, 83, 45, 0.3)' : 'transparent',
                  color: activeTab === 'transport' ? '#4ade80' : '#9ca3af',
                  border: activeTab === 'transport' ? '1px solid #15803d' : 'none'
                }}
              >
                <Truck size={18} />
                <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>TRANSPORTE</span>
              </button>
              <button
                onClick={() => setActiveTab('defense')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: activeTab === 'defense' ? 'rgba(113, 63, 18, 0.3)' : 'transparent',
                  color: activeTab === 'defense' ? '#facc15' : '#9ca3af',
                  border: activeTab === 'defense' ? '1px solid #a16207' : 'none'
                }}
              >
                <Shield size={18} />
                <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>DEFENSA</span>
              </button>
              <button
                onClick={() => setActiveTab('mining')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: activeTab === 'mining' ? 'rgba(124, 45, 18, 0.3)' : 'transparent',
                  color: activeTab === 'mining' ? '#fb923c' : '#9ca3af',
                  border: activeTab === 'mining' ? '1px solid #c2410c' : 'none'
                }}
              >
                <Pickaxe size={18} />
                <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>MINERÍA</span>
              </button>
              <button
                onClick={() => setActiveTab('civil_aviation')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: activeTab === 'civil_aviation' ? 'rgba(14, 165, 233, 0.3)' : 'transparent',
                  color: activeTab === 'civil_aviation' ? '#38bdf8' : '#9ca3af',
                  border: activeTab === 'civil_aviation' ? '1px solid #0284c7' : 'none'
                }}
              >
                <Plane size={18} />
                <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>AVIACIÓN CIVIL</span>
              </button>
            </nav>
          </div>

          <div style={{ background: '#111827', border: '1px solid #14532d', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}
              >
                Estado Global
              </h3>
              <span
                style={{
                  padding: '2px 8px',
                  background: '#14532d',
                  color: '#86efac',
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  fontFamily: 'monospace'
                }}
              >
                ONLINE
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#9ca3af' }}>Amenaza:</span>
                <span style={{ color: '#eab308', fontWeight: 'bold' }}>ELEVADA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#9ca3af' }}>Complejidad:</span>
                <span style={{ color: '#c084fc', fontWeight: 'bold' }}>EXPERT</span>
              </div>
              <div style={{ paddingTop: '12px', borderTop: '1px solid #1f2937' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#4ade80',
                    fontFamily: 'monospace',
                    fontSize: '1.25rem',
                    justifyContent: 'center'
                  }}
                >
                  <Clock size={20} />
                  <span>10:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Crisis Control Panel */}
          <div style={{ background: '#111827', border: '1px solid #ef4444', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Control de Crisis
            </h3>
            <button
              onClick={() => setIsGlobalGpsCrisis(!isGlobalGpsCrisis)}
              style={{
                width: '100%',
                padding: '10px',
                background: isGlobalGpsCrisis ? '#ef4444' : '#1f2937',
                color: isGlobalGpsCrisis ? '#fff' : '#ef4444',
                border: '1px solid #ef4444',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {isGlobalGpsCrisis ? '🛑 DETENER ATAQUE GPS' : '🚀 INYECTAR CIBERATAQUE SATELITAL'}
            </button>
          </div>

          {/* Access to Level 4 */}
          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #333' }}>
             <button 
               onClick={() => window.open('http://localhost:3008', '_blank')}
               style={{
                 width: '100%',
                 padding: '12px',
                 background: '#000',
                 color: '#666',
                 border: '1px dashed #444',
                 borderRadius: '4px',
                 fontFamily: 'monospace',
                 fontSize: '0.7rem',
                 cursor: 'pointer',
                 letterSpacing: '1px',
                 textAlign: 'center'
               }}
             >
               ⚠️ ACCESS LEVEL 4 ⚠️
             </button>
          </div>
        </aside>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <SystemErrorBoundary>
            {activeTab === 'transport' && <TransportDomain isGlobalGpsCrisis={isGlobalGpsCrisis} />}
            {activeTab === 'defense' && <DefenseDomain isGlobalGpsCrisis={isGlobalGpsCrisis} />}
            {activeTab === 'mining' && <MiningDomain />}
            {activeTab === 'civil_aviation' && <CivilAviationDomain isGlobalGpsCrisis={isGlobalGpsCrisis} />}
          </SystemErrorBoundary>

          <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: '8px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: 0
                }}
              >
                <Save size={18} style={{ color: '#60a5fa' }} /> PORTAFOLIO DEL ESPECIALISTA
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace' }}>Auto-guardado: ACTIVO</span>
            </div>
            <textarea
              style={{
                width: '100%',
                background: '#000',
                border: '1px solid #374151',
                borderRadius: '4px',
                padding: '16px',
                color: '#d1d5db',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                minHeight: '100px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
              placeholder="> Ingrese su análisis geoestratégico aquí..."
            ></textarea>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button
                style={{
                  padding: '8px 24px',
                  background: '#2563eb',
                  color: '#fff',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Save size={16} /> GUARDAR ANÁLISIS
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;