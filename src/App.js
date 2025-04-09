// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import das páginas
import Layout from './components/Layout';
import ApplyPage from './pages/ApplyPage';
import CandidaturaView from './pages/CandidaturaView.js';
import VagasView from './pages/VagasView';
import DashboardAnalitico from './pages/DashboardAnalitico';
import DashboardView from './pages/DashboardView.js';

function App() {
  return (
    <Router>
      <Routes>
        {/* ROTA EXCLUSIVA PARA O APPLY */}
        <Route path="apply" element={<ApplyPage />} />

        {/* PARA TODAS AS OUTRAS ROTAS, USAMOS O LAYOUT */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboardview" element={<DashboardView />} />
          <Route path="candidatura" element={<CandidaturaView />} />
          <Route path="vagas" element={<VagasView />} />
          <Route path="dashboard-analitico" element={<DashboardAnalitico />} />

          {/* Caso queira tratar rota inexistente */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
