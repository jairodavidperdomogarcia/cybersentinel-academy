import React, { useState, useEffect, useCallback } from 'react';
import './HospitalSimulator.css';

import { useSimulations } from '../../context/SimulationContext';

const HospitalSimulator = () => {
  const { completeSimulation } = useSimulations();
  const [patients, setPatients] = useState([]);
  const [time, setTime] = useState(45 * 60); // 45 minutos
  const [decisions, setDecisions] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Inicializar pacientes
  useEffect(() => {
    const initialPatients = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Paciente_${String(i + 1).padStart(3, '0')}`,
      condition: ['estable', 'grave', 'crítico'][Math.floor(Math.random() * 3)],
      devices: ['ventilador', 'monitor', 'bomba_insulina'].slice(0, Math.floor(Math.random() * 3) + 1),
      status: 'vivo',
      vitalSigns: {
        heartRate: 70 + Math.floor(Math.random() * 40),
        oxygen: 95 + Math.floor(Math.random() * 5)
      }
    }));
    setPatients(initialPatients);
    setIsRunning(true);
  }, []);

  const endSimulation = useCallback(() => {
    setIsRunning(false);
    setGameOver(true);
    
    const patientsAlive = patients.filter(p => p.status === 'vivo').length;
    const finalScore = score + (patientsAlive * 100);
    setScore(finalScore);
  }, [patients, score]);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0 && !gameOver) {
      timer = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            endSimulation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, time, gameOver, endSimulation]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDecision = (decisionType) => {
    if (gameOver) return;

    const decision = {
      id: decisions.length + 1,
      type: decisionType,
      time: formatTime(time),
      consequences: getConsequences(decisionType)
    };

    setDecisions([...decisions, decision]);
    applyConsequences(decisionType);
  };

  const getConsequences = (decisionType) => {
    const consequences = {
      isolate: {
        good: 'Ransomware contenido en red aislada',
        bad: '25 pacientes sin monitoreo inmediato',
        score: 50
      },
      backup: {
        good: 'Energía de reserva activada en UCI',
        bad: 'Quirófanos electivos cancelados',
        score: 30
      },
      evacuate: {
        good: 'Pacientes en movimiento a áreas seguras',
        bad: 'Riesgo durante transporte',
        score: 70
      }
    };
    return consequences[decisionType] || { good: '', bad: '', score: 0 };
  };

  const applyConsequences = (decisionType) => {
    let newScore = score;
    let updatedPatients = [...patients];

    if (decisionType === 'isolate') {
      // Algunos pacientes empeoran sin monitoreo
      updatedPatients = updatedPatients.map(p => 
        Math.random() > 0.7 ? { ...p, condition: 'crítico' } : p
      );
      newScore += 50;
    } else if (decisionType === 'evacuate') {
      // Evacuación exitosa para algunos
      updatedPatients = updatedPatients.map(p => 
        Math.random() > 0.5 ? { ...p, status: 'evacuado' } : p
      );
      newScore += 70;
    }

    setPatients(updatedPatients);
    setScore(newScore);
  };

  const restartSimulation = () => {
    setTime(45 * 60);
    setDecisions([]);
    setScore(0);
    setGameOver(false);
    setIsRunning(true);
    
    // Reiniciar pacientes
    const initialPatients = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Paciente_${String(i + 1).padStart(3, '0')}`,
      condition: ['estable', 'grave', 'crítico'][Math.floor(Math.random() * 3)],
      devices: ['ventilador', 'monitor', 'bomba_insulina'].slice(0, Math.floor(Math.random() * 3) + 1),
      status: 'vivo',
      vitalSigns: {
        heartRate: 70 + Math.floor(Math.random() * 40),
        oxygen: 95 + Math.floor(Math.random() * 5)
      }
    }));
    setPatients(initialPatients);
  };

  return (
    <div className="hospital-simulator">
      <div className="simulator-header">
        <h1>🏥 SIMULADOR HOSPITALARIO</h1>
        <div className="simulator-stats">
          <div className="stat">
            <span className="label">TIEMPO:</span>
            <span className="value">{formatTime(time)}</span>
          </div>
          <div className="stat">
            <span className="label">PACIENTES:</span>
            <span className="value">{patients.filter(p => p.status === 'vivo').length}/{patients.length}</span>
          </div>
          <div className="stat">
            <span className="label">SCORE:</span>
            <span className="value">{score}</span>
          </div>
        </div>
      </div>

      <div className="simulator-content">
        {/* Panel izquierdo: Pacientes */}
        <div className="patients-panel">
          <h3>👨‍⚕️ MONITOR DE PACIENTES</h3>
          <div className="patients-grid">
            {patients.map(patient => (
              <div key={patient.id} className={`patient-card ${patient.condition}`}>
                <div className="patient-info">
                  <span className="patient-name">{patient.name}</span>
                  <span className={`patient-status ${patient.status}`}>
                    {patient.status.toUpperCase()}
                  </span>
                </div>
                <div className="patient-vitals">
                  <div className="vital">
                    <span className="label">❤️</span>
                    <span>{patient.vitalSigns.heartRate} BPM</span>
                  </div>
                  <div className="vital">
                    <span className="label">💨</span>
                    <span>{patient.vitalSigns.oxygen}% O2</span>
                  </div>
                </div>
                <div className="patient-devices">
                  {patient.devices.map((device, idx) => (
                    <span key={idx} className="device-tag">{device}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel derecho: Decisiones */}
        <div className="decisions-panel">
          <div className="scenario-info">
            <h3>🚨 ESCENARIO</h3>
            <p><strong>Ransomware detectado en red hospitalaria.</strong> Sistemas de monitoreo UCI comprometidos. El tiempo corre...</p>
          </div>

          <div className="decision-options">
            <h3>¿QUÉ DECIDES?</h3>
            <button 
              className="btn btn-danger"
              onClick={() => handleDecision('isolate')}
              disabled={gameOver}
            >
              🔒 AISLAR RED COMPLETA
            </button>
            <button 
              className="btn btn-warning"
              onClick={() => handleDecision('backup')}
              disabled={gameOver}
            >
              ⚡ ACTIVAR ENERGÍA RESERVA
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => handleDecision('evacuate')}
              disabled={gameOver}
            >
              🚑 INICIAR EVACUACIÓN UCI
            </button>
          </div>

          {/* Historial de decisiones */}
          <div className="decisions-log">
            <h3>📋 HISTORIAL</h3>
            <div className="log-entries">
              {decisions.map(decision => (
                <div key={decision.id} className="log-entry">
                  <span className="log-time">[{decision.time}]</span>
                  <span className="log-action">{decision.type.toUpperCase()}</span>
                  <div className="log-consequences">
                    <span className="good">✓ {decision.consequences.good}</span>
                    <span className="bad">✗ {decision.consequences.bad}</span>
                  </div>
                </div>
              ))}
              {decisions.length === 0 && (
                <p className="empty-log">No hay decisiones aún...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2>🎮 SIMULACIÓN TERMINADA</h2>
            <div className="final-stats">
              <div className="final-stat">
                <span className="label">PACIENTES SALVADOS:</span>
                <span className="value">{patients.filter(p => p.status === 'vivo' || p.status === 'evacuado').length}/10</span>
              </div>
              <div className="final-stat">
                <span className="label">DECISIONES TOMADAS:</span>
                <span className="value">{decisions.length}</span>
              </div>
              <div className="final-stat">
                <span className="label">PUNTAJE FINAL:</span>
                <span className="value score">{score}</span>
              </div>
            </div>
            
            <div className="final-badge">
              {score > 800 ? '🏆 MASTER STRATEGIST' : 
               score > 500 ? '🎖️ COMPETENT LEADER' : 
               '📚 NEEDS PRACTICE'}
            </div>
            
            <div className="game-over-actions">
              <button className="btn btn-primary" onClick={restartSimulation}>
                REPETIR SIMULACIÓN
              </button>
              <button className="btn btn-success" onClick={() => completeSimulation('hospital')}>
                MARCAR COMO COMPLETADO
              </button>
              <a href="/" className="btn btn-secondary">
                VOLVER AL DASHBOARD
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalSimulator;
