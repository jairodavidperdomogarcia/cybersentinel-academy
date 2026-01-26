import React from 'react';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';

class SystemErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la UI de repuesto.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // También puedes registrar el error en un servicio de reporte de errores
    console.error("SYSTEM CRITICAL FAILURE:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier interfaz de repuesto personalizada
      return (
        <div style={{
          height: '100%',
          width: '100%',
          backgroundColor: '#000000',
          backgroundImage: 'radial-gradient(circle at 50% 50%, #1a0505 0%, #000000 100%)',
          color: '#ef4444',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Courier New', monospace",
          padding: '2rem',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Scanlines Effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
            backgroundSize: '100% 2px, 3px 100%',
            pointerEvents: 'none',
            zIndex: 1
          }} />

          <div style={{ 
            border: '2px solid #ef4444', 
            padding: '40px', 
            maxWidth: '600px', 
            width: '100%',
            backgroundColor: 'rgba(20, 0, 0, 0.8)',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
            position: 'relative',
            zIndex: 2,
            animation: 'pulse-border 2s infinite'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #7f1d1d', paddingBottom: '15px' }}>
              <AlertTriangle size={48} color="#ef4444" />
              <div>
                <h1 style={{ margin: 0, fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Fallo Crítico del Sistema</h1>
                <span style={{ fontSize: '0.8rem', color: '#f87171' }}>CÓDIGO DE ERROR: 0xCRASH_KERNEL_PANIC</span>
              </div>
            </div>

            <div style={{ marginBottom: '30px', background: '#000', padding: '15px', borderRadius: '4px', border: '1px solid #333' }}>
              <p style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={14} />
                <span style={{ color: '#fff' }}>root@cybersentinel:~$</span> ./diagnose_error.sh
              </p>
              <pre style={{ 
                margin: 0, 
                whiteSpace: 'pre-wrap', 
                color: '#f87171', 
                fontSize: '0.85rem',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button 
                onClick={this.handleReset}
                style={{
                  background: '#ef4444',
                  color: '#000',
                  border: 'none',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#dc2626'}
                onMouseOut={(e) => e.target.style.background = '#ef4444'}
              >
                <RefreshCw size={18} />
                Reiniciar Subsistema
              </button>
            </div>
          </div>
          
          <style>{`
            @keyframes pulse-border {
              0% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.2); border-color: #ef4444; }
              50% { box-shadow: 0 0 25px rgba(239, 68, 68, 0.5); border-color: #f87171; }
              100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.2); border-color: #ef4444; }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default SystemErrorBoundary;
