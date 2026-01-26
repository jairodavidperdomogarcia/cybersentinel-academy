import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import heroBg from '../assets/images/hero-bg.jpg';

import { useSimulations } from '../context/SimulationContext';

const Dashboard = () => {
  const { simulations } = useSimulations();
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const completedSimulations = Object.values(simulations).filter(status => status === 'COMPLETADO').length;
  const totalSimulations = Object.keys(simulations).length;
  const progressPercentage = (completedSimulations / totalSimulations) * 100;

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Hero Section */}
        <div className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="hero-overlay">
            <div className="cyber-header">
              <div className="header-title">
                <h1>STRATEGIC HUB</h1>
                <span className="subtitle">>> VOLUMEN 2 // TACTICAL OPERATIONS</span>
              </div>
              <div className="system-status">
                <div className="status-item">
                  <span className="status-indicator"></span>
                  SYSTEM ONLINE
                </div>
                <div style={{ marginTop: '5px', fontSize: '0.8rem', opacity: 0.7 }}>
                  SERVER TIME: {systemTime}
                </div>
                <div style={{ marginTop: '5px', fontSize: '0.8rem', color: '#00f3ff' }}>
                  SECURE CONNECTION ESTABLISHED
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Grid */}
        <div className="cyber-grid">
          {/* Card 1: Hospital */}
          <div className="cyber-card">
            <div className="card-icon">🏥</div>
            <h3>HOSPITAL SIMULATOR</h3>
            <p>
              CRISIS: Ransomware en UCI.<br/>
              OBJETIVO: Gestión de crisis y decisiones de vida/muerte en tiempo real.
            </p>
            <Link to="/simulators/hospital" className="cyber-btn">
              ACCEDER SISTEMA
            </Link>
          </div>
          
          {/* Card 2: Bio-Security */}
          <div className="cyber-card">
            <div className="card-icon">☣️</div>
            <h3>BIO-SECURITY CHAIN</h3>
            <p>
              CRISIS: Hackeo a cadena de frío.<br/>
              OBJETIVO: Integridad de bio-fármacos y contención de brote.
            </p>
            <Link to="/simulators/food-chain" className="cyber-btn">
              ACCEDER SISTEMA
            </Link>
          </div>
          
          {/* Card 3: Infrastructure (Highlight) */}
          <div className="cyber-card" style={{ borderColor: '#ef4444', boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)' }}>
            <div className="card-icon" style={{ borderColor: '#ef4444', color: '#ef4444' }}>⚡</div>
            <h3 style={{ color: '#ef4444' }}>INFRAESTRUCTURA</h3>
            <p style={{ borderLeftColor: '#ef4444' }}>
              CRISIS: Blackout masivo (WAR ROOM LINKED).<br/>
              OBJETIVO: Defensa de red eléctrica y mitigación de efectos en cascada.
            </p>
            <Link to="/simulators/infrastructure" className="cyber-btn start-btn" style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: '#ef4444', color: '#ef4444' }}>
              ACCEDER SISTEMA
            </Link>
          </div>
          
          {/* Progress Panel */}
          <div className="cyber-card progress-panel">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>📊</span>
              <h3 style={{ margin: 0 }}>ESTADO DE OPERACIONES</h3>
            </div>
            
            <div className="stats-grid">
              <div className="stat-row">
                <span className="stat-label">:: OPS HOSPITALARIAS</span>
                <span className={`stat-value ${simulations.hospital === 'COMPLETADO' ? 'completed' : ''}`}>
                  [ {simulations.hospital} ]
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">:: BIO-SEGURIDAD</span>
                <span className={`stat-value ${simulations['bio-security'] === 'COMPLETADO' ? 'completed' : ''}`}>
                  [ {simulations['bio-security']} ]
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">:: RED ELÉCTRICA</span>
                <span className={`stat-value ${simulations.infrastructure === 'COMPLETADO' ? 'completed' : 'in-progress'}`} style={{ color: simulations.infrastructure !== 'COMPLETADO' ? '#ef4444' : ''}}>
                  [ {simulations.infrastructure} ]
                </span>
              </div>
            </div>

            <div style={{ marginTop: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.8rem', color: '#00f3ff' }}>
                <span>NIVEL DE ACCESO GLOBAL</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="cyber-progress-container">
                <div className="cyber-progress-bar" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <div style={{ marginTop: '10px', textAlign: 'right', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                ID: AGENT-007 // SIMULACIONES ACTIVAS: {completedSimulations}/{totalSimulations}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
