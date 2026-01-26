import React from 'react';
import GlobalWarRoom from './components/GlobalWarRoom/GlobalWarRoom';
import SystemErrorBoundary from './components/SystemErrorBoundary';
import './App.css';

function App() {
  // En este proyecto dedicado, GlobalWarRoom es la vista principal y única.
  // No necesitamos un botón de salida porque esta ES la aplicación.
  return (
    <div className="App">
      <SystemErrorBoundary>
        <GlobalWarRoom onExit={() => window.close()} /> 
      </SystemErrorBoundary>
    </div>
  );
}

export default App;