import React, { createContext, useState, useContext } from 'react';

const SimulationContext = createContext();

export const useSimulations = () => useContext(SimulationContext);

export const SimulationProvider = ({ children }) => {
  const [simulations, setSimulations] = useState({
    hospital: 'PENDIENTE',
    'bio-security': 'PENDIENTE',
    infrastructure: 'PENDIENTE',
  });

  const completeSimulation = (simulationId) => {
    setSimulations((prev) => ({ ...prev, [simulationId]: 'COMPLETADO' }));
  };

  const value = {
    simulations,
    completeSimulation,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};
