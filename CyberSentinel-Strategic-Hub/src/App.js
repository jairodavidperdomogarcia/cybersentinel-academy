import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HospitalSimulator from './simulators/hospital/HospitalSimulator';
import FoodChainSimulator from './simulators/food-chain/FoodChainSimulator';
import InfrastructureSimulator from './simulators/infrastructure/InfrastructureSimulator';
import './App.css';
import './styles/global.css';

import { SimulationProvider } from './context/SimulationContext';

function App() {
  return (
    <SimulationProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="simulators/hospital" element={<HospitalSimulator />} />
            <Route path="simulators/food-chain" element={<FoodChainSimulator />} />
            <Route path="simulators/infrastructure" element={<InfrastructureSimulator />} />
          </Route>
        </Routes>
      </HashRouter>
    </SimulationProvider>
  );
}

export default App;
