// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import de páginas
import DashboardView from '../pages/DashboardView';
import CandidaturaView from '../pages/CandidaturaView';
import VagasView from '../pages/VagasView';
import DashboardAnalitico from '../pages/DashboardAnalitico';
// ... etc

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardView />} />
      <Route path="/candidatura" element={<CandidaturaView />} />
      <Route path="/vagas" element={<VagasView />} />
      <Route path="/dashboard-analitico" element={<DashboardAnalitico />} />
      {/* etc */}
    </Routes>
  );
}

export default AppRoutes;
