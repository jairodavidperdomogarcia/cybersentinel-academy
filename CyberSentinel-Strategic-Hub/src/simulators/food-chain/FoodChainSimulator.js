import React, { useState, useEffect } from 'react';
import './FoodChainSimulator.css';

import { useSimulations } from '../../context/SimulationContext';

const FoodChainSimulator = () => {
  const { completeSimulation } = useSimulations();
  const [restaurants, setRestaurants] = useState(100);
  const [contaminated, setContaminated] = useState(0);
  const [customersAffected, setCustomersAffected] = useState(0);
  const [reputation, setReputation] = useState(100);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(1);
  const [decisions, setDecisions] = useState([]);

  // ESCENARIOS COMPLETOS (3) - TEMA: BIO-SEGURIDAD (Vol. 2)
  const scenarios = [
    {
      id: 1,
      title: "☣️ INTEGRIDAD DE CADENA DE FRÍO",
      description: "Hackers alteran logs de temperatura en neveras IoT. Lotes de insulina parecen seguros pero están degradados. Riesgo de ineficacia masiva.",
      difficulty: "🔴🔴🔴⚪⚪",
      decisions: [
        { 
          id: 'close_all',
          text: "🔒 CUARENTENA TOTAL DE LOTES", 
          impact: { 
            reputation: -30, 
            customers: 1000,
            restaurants: -20
          },
          score: 50,
          message: "✅ Contención biológica. ✗ Desabastecimiento crítico."
        },
        { 
          id: 'update_system',
          text: "🔍 AUDITORÍA FORENSE DE SENSORES", 
          impact: { 
            reputation: -10, 
            time: -10,
            restaurants: -10
          },
          score: 30,
          message: "✅ Identificación precisa. ✗ Riesgo de uso mientras se audita."
        }
      ]
    },
    {
      id: 2, 
      title: "🧬 SECUESTRO DE DATOS GENÓMICOS",
      description: "Ransomware en base de datos de ensayos clínicos. Amenazan con corromper la integridad de datos de vacunas en desarrollo.",
      difficulty: "🔴🔴🔴🔴⚪",
      decisions: [
        { 
          id: 'freeze_payments',
          text: "🛑 PARAR ENSAYOS CLÍNICOS", 
          impact: { 
            reputation: -40, 
            restaurants: -50
          },
          score: 60,
          message: "✅ Integridad de datos salvada. ✗ Retraso de 6 meses en vacuna."
        },
        { 
          id: 'migrate_system',
          text: "🔄 RESTAURAR BACKUPS OFFLINE", 
          impact: { 
            reputation: -15, 
            time: -30
          },
          score: 45,
          message: "✅ Recuperación lenta. ✗ Pérdida de datos de las últimas 24h."
        }
      ]
    },
    {
      id: 3,
      title: "☣️ DESVÍO DE PRECURSORES QUÍMICOS",
      description: "Inventario muestra discrepancia en toxinas botulínicas. Posible desvío interno para mercado negro de armas biológicas.",
      difficulty: "🔴🔴🔴🔴🔴",
      decisions: [
        {
          id: 'recall_all',
          text: "⚠️ ALERTA BIOLÓGICA NACIONAL",
          impact: {
            reputation: -50,
            restaurants: -80,
            customers: 5000
          },
          score: 80,
          message: "✅ Seguridad Nacional activada. ✗ Pánico público masivo."
        },
        {
          id: 'trace_supply',
          text: "🕵️ OPERACIÓN TRAZABILIDAD SIGILOSA",
          impact: {
            reputation: -20,
            time: -45,
            customers: 2000
          },
          score: 65,
          message: "✅ Precisión quirúrgica. ✗ Más intoxicaciones durante investigación."
        }
      ]
    }
  ];

  // Timer de simulación
  useEffect(() => {
    let timer;
    if (isRunning && time < 600 && !gameOver) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
        
        // Evento aleatorio: posible contaminación
        if (Math.random() < 0.03 && time > 30 && contaminated < restaurants) {
          setContaminated(prev => prev + 1);
          setReputation(prev => Math.max(0, prev - 1));
        }
        
        // Auto game over si todo se contamina
        if (contaminated >= restaurants || reputation <= 0) {
          endSimulation();
        }
      }, 1000);
    } else if (time >= 600) {
      endSimulation();
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, time, gameOver, contaminated, restaurants]);

  const startSimulation = () => {
    setIsRunning(true);
    setGameOver(false);
    setTime(0);
    setScore(0);
    setCurrentScenario(1);
    setDecisions([]);
    setRestaurants(100);
    setContaminated(0);
    setCustomersAffected(0);
    setReputation(100);
  };

  const handleDecision = (decision) => {
    if (!isRunning || gameOver) return;
    
    const newDecision = {
      id: decisions.length + 1,
      text: decision.text,
      time: formatTime(time),
      score: decision.score,
      message: decision.message
    };

    setDecisions([...decisions, newDecision]);
    setScore(prev => prev + decision.score);
    
    // Aplicar impacto
    setReputation(prev => Math.max(0, prev + (decision.impact.reputation || 0)));
    setRestaurants(prev => Math.max(0, prev + (decision.impact.restaurants || 0)));
    setCustomersAffected(prev => prev + (decision.impact.customers || 0));
    setTime(prev => prev + (decision.impact.time || 0));
    
    // Avanzar escenario
    if (currentScenario < scenarios.length) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, 1500);
    } else {
      setTimeout(endSimulation, 1500);
    }
  };

  const endSimulation = () => {
    setIsRunning(false);
    setGameOver(true);
    
    // Calcular score final detallado
    const restaurantScore = (restaurants - contaminated) * 10;
    const reputationScore = reputation * 5;
    const customerPenalty = Math.max(0, 10000 - customersAffected) * 2;
    const timeBonus = Math.max(0, 600 - time) * 0.5;
    
    const finalScore = score + restaurantScore + reputationScore + customerPenalty + timeBonus;
    setScore(Math.round(finalScore));
  };

  const restartSimulation = () => {
    startSimulation();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentScenarioData = scenarios.find(s => s.id === currentScenario) || scenarios[0];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
      minHeight: '100vh',
      color: 'white',
      padding: '20px',
      fontFamily: "'Courier New', monospace"
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(52, 211, 153, 0.1)',
        border: '3px solid #34d399',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '30px',
        boxShadow: '0 0 20px rgba(52, 211, 153, 0.2)'
      }}>
        <h1 style={{ color: '#34d399', margin: 0, textShadow: '0 0 10px rgba(52, 211, 153, 0.5)' }}>☣️ BIO-SECURITY CHAIN SIMULATOR</h1>
        <p style={{ color: '#a7f3d0', margin: '5px 0 0 0' }}>
          Capítulo 8: Integridad Genómica + Bio-Logística + Amenaza NBQ
        </p>
        
        <div style={{
          display: 'flex',
          gap: '30px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ color: '#a7f3d0', fontSize: '0.9rem' }}>⏱️ TIEMPO DE RESPUESTA</div>
            <div style={{ fontSize: '1.8rem', fontFamily: 'monospace', color: '#34d399' }}>
              {formatTime(time)}
            </div>
          </div>
          <div>
            <div style={{ color: '#a7f3d0', fontSize: '0.9rem' }}>🛡️ INTEGRIDAD</div>
            <div style={{ fontSize: '1.8rem', fontFamily: 'monospace', color: '#00ff9d' }}>
              {score}
            </div>
          </div>
          <div>
            <div style={{ color: '#a7f3d0', fontSize: '0.9rem' }}>🚨 NIVEL DE AMENAZA</div>
            <div style={{ fontSize: '1.8rem', color: '#ef4444' }}>
              {currentScenario}/{scenarios.length}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '10px',
          border: '2px solid #34d399',
          textAlign: 'center',
          boxShadow: '0 0 15px rgba(52, 211, 153, 0.1)'
        }}>
          <h3 style={{ color: '#34d399', margin: '0 0 10px 0' }}>🏥 BIO-NODOS</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{restaurants}/100</div>
          <div style={{ fontSize: '0.9rem', color: '#a7f3d0' }}>Operativos</div>
        </div>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '10px',
          border: '2px solid #ef4444',
          textAlign: 'center',
          boxShadow: '0 0 15px rgba(239, 68, 68, 0.1)'
        }}>
          <h3 style={{ color: '#ef4444', margin: '0 0 10px 0' }}>🦠 COMPROMETIDOS</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{contaminated}</div>
          <div style={{ fontSize: '0.9rem', color: '#fca5a5' }}>Falla Cadena Frío</div>
        </div>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '10px',
          border: '2px solid #f59e0b',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#f59e0b', margin: '0 0 10px 0' }}>🧪 PACIENTES</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            {customersAffected.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#fcd34d' }}>Riesgo Vital</div>
        </div>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '10px',
          border: reputation > 50 ? '2px solid #3b82f6' : '2px solid #ef4444',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            color: reputation > 50 ? '#3b82f6' : '#ef4444', 
            margin: '0 0 10px 0' 
          }}>
            🏛️ CONFIANZA
          </h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{reputation}%</div>
          <div style={{ fontSize: '0.9rem', color: '#bfdbfe' }}>Estabilidad Social</div>
        </div>
      </div>

      {/* Current Scenario */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '2px solid #34d399',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: 'inset 0 0 30px rgba(52, 211, 153, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#34d399', margin: 0, textShadow: '0 0 10px rgba(52, 211, 153, 0.5)' }}>
            🚨 ALERTA ACTIVA: {currentScenarioData.title.replace('☣️ ', '').replace('🧬 ', '')}
          </h2>
          <span style={{
            background: 'rgba(239, 68, 68, 0.2)',
            padding: '5px 15px',
            borderRadius: '20px',
            fontFamily: 'monospace',
            color: '#fca5a5',
            border: '1px solid #ef4444'
          }}>
            AMENAZA: {currentScenarioData.difficulty}
          </span>
        </div>
        
        <p style={{ color: '#e5e7eb', fontSize: '1.1rem', lineHeight: '1.6', marginTop: '15px', fontFamily: 'sans-serif' }}>
          {currentScenarioData.description}
        </p>
        
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          padding: '15px',
          borderRadius: '10px',
          marginTop: '20px',
          borderLeft: '4px solid #ef4444'
        }}>
          <strong style={{ color: '#ff2e63' }}>⚠️ IMPACTO POTENCIAL:</strong>
          <ul style={{ margin: '10px 0 0 20px', color: '#ffcc80' }}>
            <li>Salud pública masiva (miles de afectados)</li>
            <li>Reputación global de marca en riesgo</li>
            <li>Cadena de suministro compleja comprometida</li>
            <li>Regulación sanitaria internacional</li>
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
          {currentScenarioData.decisions.map((decision, idx) => (
            <button
              key={decision.id}
              onClick={() => handleDecision(decision)}
              disabled={!isRunning || gameOver}
              style={{
                background: idx === 0 ? 'linear-gradient(135deg, #ff2e63, #cc0050)' :
                         idx === 1 ? 'linear-gradient(135deg, #ff9900, #cc7a00)' :
                         'linear-gradient(135deg, #9d4edd, #6a2ca8)',
                color: 'white',
                border: 'none',
                padding: '20px',
                borderRadius: '10px',
                fontSize: '1rem',
                cursor: (!isRunning || gameOver) ? 'not-allowed' : 'pointer',
                opacity: (!isRunning || gameOver) ? 0.6 : 1,
                fontFamily: 'monospace',
                fontWeight: 'bold',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}
              onMouseEnter={(e) => {
                if (isRunning && !gameOver) e.target.style.transform = 'translateY(-5px) scale(1.02)';
              }}
              onMouseLeave={(e) => {
                if (isRunning && !gameOver) e.target.style.transform = 'translateY(0) scale(1)';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>
                {decision.text.split(' ')[0]}
              </span>
              <span>{decision.text.substring(decision.text.indexOf(' ') + 1)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {!isRunning && !gameOver && (
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
            background: 'rgba(255, 153, 0, 0.2)',
            color: '#ff9900',
            border: '2px solid #ff9900',
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
      </div>

      {/* Decisions History */}
      {decisions.length > 0 && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '15px',
          padding: '25px',
          marginTop: '30px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <h3 style={{ color: '#ff9900', marginBottom: '20px' }}>📋 HISTORIAL DE DECISIONES</h3>
          
          {decisions.map(decision => (
            <div key={decision.id} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '10px',
              borderLeft: '4px solid #ff9900'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#ff9900', fontFamily: 'monospace' }}>[{decision.time}]</span>
                <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>+{decision.score} puntos</span>
              </div>
              <div style={{ color: 'white', marginTop: '5px' }}>{decision.text}</div>
              <div style={{ color: '#ffcc80', fontSize: '0.9rem', marginTop: '5px' }}>
                {decision.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Game Over Modal */}
      {gameOver && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a3a, #25254a)',
            border: '3px solid #ff9900',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#ff9900', fontSize: '2.5rem', marginBottom: '30px' }}>🎮 SIMULACIÓN TERMINADA</h2>
            
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                <span style={{ color: '#ffcc80' }}>🏥 Nodos Seguros:</span>
                <span style={{ fontWeight: 'bold' }}>{restaurants - contaminated}/100</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                <span style={{ color: '#ffcc80' }}>⭐ Reputación final:</span>
                <span style={{ fontWeight: 'bold' }}>{reputation}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                <span style={{ color: '#ffcc80' }}>☣️ Pacientes Críticos:</span>
                <span style={{ fontWeight: 'bold' }}>{customersAffected.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                <span style={{ color: '#ffcc80' }}>🎯 Puntaje final:</span>
                <span style={{ color: '#00ff9d', fontSize: '1.5rem', fontWeight: 'bold' }}>{score}</span>
              </div>
            </div>
            
            <div style={{ 
              padding: '15px', 
              background: 'rgba(255, 153, 0, 0.1)',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              {score > 800 ? '🏆 ESTRATEGA MAESTRO' : 
               score > 600 ? '🎖️ LÍDER EFICAZ' : 
               score > 400 ? '📊 GESTOR COMPETENTE' : 
               '📚 NECESITA MÁS PRÁCTICA'}
            </div>
            
            <button
              onClick={restartSimulation}
              style={{
                background: 'linear-gradient(135deg, #ff9900, #cc7a00)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '8px',
                fontSize: '1.2rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              REINICIAR
            </button>
            <button
              onClick={() => completeSimulation('bio-security')}
              style={{
                background: 'linear-gradient(135deg, #00ff9d, #00cc7a)',
                color: 'black',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '8px',
                fontSize: '1.2rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '10px'
              }}
            >
              MARCAR COMO COMPLETADO
            </button>
          </div>
        </div>
      )}

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
        <p>🍔 <strong>Capítulo 8: Cadena de Comida Rápida/Delivery</strong></p>
        <p>Impacto único: Salud pública masiva × Logística compleja × Reputación global × Pagos masivos</p>
      </div>
    </div>
  );
};

export default FoodChainSimulator;
