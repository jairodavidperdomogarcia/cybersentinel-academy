import React, { useState, useEffect } from 'react';
import './InfrastructureSimulator.css';

import { useSimulations } from '../../context/SimulationContext';

const InfrastructureSimulator = () => {
  const { completeSimulation } = useSimulations();
  const [cities] = useState([
    { id: 1, name: "🏙️ Capital", power: 100, critical: true },
    { id: 2, name: "🏭 Industrial", power: 100, critical: true },
    { id: 3, name: "🏖️ Costera", power: 100, critical: false },
    { id: 4, name: "⛰️ Montaña", power: 100, critical: false },
    { id: 5, name: "🌾 Rural", power: 100, critical: false },
    { id: 6, name: "🔬 Tecnológico", power: 100, critical: true },
    { id: 7, name: "⚕️ Hospitalaria", power: 100, critical: true },
    { id: 8, name: "💧 Potable", power: 100, critical: true },
    { id: 9, name: "🛰️ Comunicaciones", power: 100, critical: true },
    { id: 10, name: "🛢️ Refinería", power: 100, critical: true }
  ]);
  
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(1);

  // Timer
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const startSimulation = () => {
    setIsRunning(true);
    setTime(0);
    setScore(0);
    setCurrentScenario(1);
  };

  const handleDecision = (decision) => {
    setScore(prev => prev + 50);
    if (currentScenario < 3) {
      setTimeout(() => setCurrentScenario(prev => prev + 1), 1000);
    }
  };

  const restartSimulation = () => {
    startSimulation();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const scenarios = [
    { id: 1, title: "⚡ ATAQUE A SUBESTACIONES", description: "Hackers toman control de subestaciones principales." },
    { id: 2, title: "💥 EFECTO CASCADA", description: "Falla en sistema SCADA causa apagones progresivos." },
    { id: 3, title: "🌪️ TORMENTA GEOMAGNÉTICA", description: "Tormenta solar + ataque cibernético simultáneo." }
  ];

  const current = scenarios.find(s => s.id === currentScenario) || scenarios[0];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a1a2a 0%, #1a2a3a 100%)',
      minHeight: '100vh',
      color: 'white',
      padding: '20px',
      fontFamily: "'Segoe UI', system-ui, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0, 212, 255, 0.1)',
        border: '3px solid #00d4ff',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#00d4ff', margin: 0 }}>⚡ SIMULADOR INFRAESTRUCTURA CRÍTICA</h1>
        <p style={{ color: '#80dfff', margin: '5px 0 0 0' }}>
          Capítulo 5: Red eléctrica nacional + Efecto cascada
        </p>
        
        <div style={{
          display: 'flex',
          gap: '30px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ color: '#80dfff', fontSize: '0.9rem' }}>⏱️ TIEMPO</div>
            <div style={{ fontSize: '1.8rem', fontFamily: 'monospace', color: '#00d4ff' }}>
              {formatTime(time)}
            </div>
          </div>
          <div>
            <div style={{ color: '#80dfff', fontSize: '0.9rem' }}>🎯 SCORE</div>
            <div style={{ fontSize: '1.8rem', fontFamily: 'monospace', color: '#00ff9d' }}>
              {score}
            </div>
          </div>
          <div>
            <div style={{ color: '#80dfff', fontSize: '0.9rem' }}>🚨 ESCENARIO</div>
            <div style={{ fontSize: '1.8rem', color: '#00d4ff' }}>
              {currentScenario}/{scenarios.length}
            </div>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#00d4ff', marginBottom: '20px' }}>🏙️ MAPA DE RED ELÉCTRICA</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '15px'
        }}>
          {cities.map(city => (
            <div key={city.id} style={{
              background: 'linear-gradient(135deg, #1a3a5a, #2a4a6a)',
              padding: '15px',
              borderRadius: '10px',
              border: city.critical ? '2px solid #ff2e63' : '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>{city.name}</span>
                {city.critical && <span style={{ color: '#ff2e63', fontSize: '0.8rem' }}>CRÍTICA</span>}
              </div>
              
              <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>⚡ Energía:</span>
                  <span style={{ color: '#00ff9d', fontWeight: 'bold' }}>{city.power}%</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '6px', 
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '3px',
                  marginTop: '5px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${city.power}%`,
                    height: '100%',
                    background: '#00ff9d',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Scenario */}
      <div style={{
        background: 'rgba(0, 212, 255, 0.1)',
        border: '2px solid #00d4ff',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#00d4ff', margin: 0 }}>
          🚨 ESCENARIO {currentScenario}: {current.title}
        </h2>
        
        <p style={{ color: '#80dfff', fontSize: '1.1rem', lineHeight: '1.6', marginTop: '15px' }}>
          {current.description}
        </p>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '15px',
          borderRadius: '10px',
          marginTop: '20px',
          borderLeft: '4px solid #ff2e63'
        }}>
          <strong style={{ color: '#ff2e63' }}>⚠️ IMPACTO POTENCIAL:</strong>
          <ul style={{ margin: '10px 0 0 20px', color: '#80dfff' }}>
            <li>Colapso de red eléctrica nacional</li>
            <li>Hospitales sin energía</li>
            <li>Pérdida de sistemas de agua</li>
            <li>Caos social y económico</li>
          </ul>
        </div>
      </div>

      {/* Decision Buttons */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '25px' }}>🤔 ¿QUÉ DECIDES?</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '15px'
        }}>
          <button
            onClick={() => handleDecision('isolate')}
            disabled={!isRunning}
            style={{
              background: 'linear-gradient(135deg, #ff2e63, #cc0050)',
              color: 'white',
              border: 'none',
              padding: '20px',
              borderRadius: '10px',
              fontSize: '1rem',
              cursor: !isRunning ? 'not-allowed' : 'pointer',
              opacity: !isRunning ? 0.6 : 1,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🔌</span>
            <span>AISLAR RED NACIONAL</span>
          </button>
          
          <button
            onClick={() => handleDecision('backup')}
            disabled={!isRunning}
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #0088cc)',
              color: 'white',
              border: 'none',
              padding: '20px',
              borderRadius: '10px',
              fontSize: '1rem',
              cursor: !isRunning ? 'not-allowed' : 'pointer',
              opacity: !isRunning ? 0.6 : 1,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <span>ACTIVAR SISTEMAS RESERVA</span>
          </button>
          
          <button
            onClick={() => handleDecision('triage')}
            disabled={!isRunning}
            style={{
              background: 'linear-gradient(135deg, #9d4edd, #6a2ca8)',
              color: 'white',
              border: 'none',
              padding: '20px',
              borderRadius: '10px',
              fontSize: '1rem',
              cursor: !isRunning ? 'not-allowed' : 'pointer',
              opacity: !isRunning ? 0.6 : 1,
              fontFamily: 'monospace',
              fontWeight: 'bold',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🏥</span>
            <span>TRIAGE ENERGÉTICO</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {!isRunning && (
          <button
            onClick={startSimulation}
            style={{
              background: 'linear-gradient(135deg, #00ff9d, #00cc7a)',
              color: 'black',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '8px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              flex: 1
            }}
          >
            ▶️ INICIAR SIMULACIÓN
          </button>
        )}
        
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: 'rgba(157, 78, 221, 0.2)',
            color: '#9d4edd',
            border: '2px solid #9d4edd',
            padding: '12px 25px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            flex: 1
          }}
        >
          ← VOLVER AL DASHBOARD
        </button>
        
        <button
          onClick={restartSimulation}
          style={{
            background: 'rgba(0, 212, 255, 0.2)',
            color: '#00d4ff',
            border: '2px solid #00d4ff',
            padding: '12px 25px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            flex: 1
          }}
        >
          🔄 REINICIAR SIMULACIÓN
        </button>
        <button
          onClick={() => completeSimulation('infrastructure')}
          style={{
            background: 'rgba(0, 255, 157, 0.2)',
            color: '#00ff9d',
            border: '2px solid #00ff9d',
            padding: '12px 25px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            flex: 1
          }}
        >
          MARCAR COMO COMPLETADO
        </button>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        textAlign: 'center',
        color: '#888',
        fontSize: '0.9rem'
      }}>
        <p>⚡ <strong>Capítulo 5: Infraestructura Crítica Nacional</strong></p>
        <p>Ataque coordinado a red eléctrica + Efecto cascada + Decisiones estratégicas</p>
      </div>
    </div>
  );
};

export default InfrastructureSimulator;
