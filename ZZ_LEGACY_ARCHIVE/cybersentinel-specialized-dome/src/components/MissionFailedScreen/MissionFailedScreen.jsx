import React from 'react';
import { AlertTriangle, RefreshCw, XOctagon } from 'lucide-react';

const MissionFailedScreen = ({ onRetry }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: '#ef4444',
      fontFamily: 'monospace'
    }}>
      <div style={{
        border: '4px solid #ef4444',
        padding: '40px',
        maxWidth: '600px',
        textAlign: 'center',
        background: '#1a0505',
        boxShadow: '0 0 50px rgba(239, 68, 68, 0.5)',
        animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both'
      }}>
        <div style={{ marginBottom: '20px' }}>
            <XOctagon size={80} strokeWidth={1.5} />
        </div>
        
        <h1 style={{ 
          fontSize: '3rem', 
          margin: '0 0 10px 0', 
          letterSpacing: '4px',
          textShadow: '2px 2px 0px #000, -1px -1px 0 #7f1d1d'
        }}>
          MISSION FAILED
        </h1>
        
        <h2 style={{ 
          fontSize: '1.5rem', 
          margin: '0 0 30px 0', 
          color: '#fca5a5' 
        }}>
          CRITICAL INCIDENT TIMEOUT
        </h2>

        <p style={{ 
          fontSize: '1rem', 
          lineHeight: '1.6', 
          marginBottom: '40px',
          color: '#cbd5e1'
        }}>
          La ventana de respuesta operativa ha expirado. Los sistemas críticos han sido comprometidos irreversiblemente. 
          <br/><br/>
          <span style={{ color: '#ef4444', fontWeight: 'bold' }}>CONSECUENCIA:</span> Pérdida total de infraestructura.
        </p>

        <button 
          onClick={onRetry}
          style={{
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            padding: '16px 32px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            margin: '0 auto',
            transition: 'transform 0.1s',
            boxShadow: '0 4px 0 #991b1b'
          }}
          onMouseDown={(e) => e.target.style.transform = 'translateY(4px)'}
          onMouseUp={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <RefreshCw size={24} /> REINICIAR SIMULACIÓN
        </button>
      </div>

      <style>
        {`
          @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
          }
        `}
      </style>
    </div>
  );
};

export default MissionFailedScreen;