import React from 'react';
import { Link, Outlet } from 'react-router-dom'; // Note o uso do Outlet
import "./Layout.css"

export default function Layout() {
  return (
    <div className="layout-container">
      <aside className="sidebar-menu">
        <h2>RH</h2>
        <ul>
          <li><Link to="/dashboardview">Início</Link></li>
          <li><Link to="/candidatura">Candidatos</Link></li>
          <li><Link to="/vagas">Vagas</Link></li>
          <li><Link to="/dashboard-analitico">Dashboard Analítico</Link></li>
        </ul>
      </aside>
      <main className="main-content">
        {/* Aqui o Outlet renderiza as rotas-filhas */}
        <Outlet />
      </main>
    </div>
  );
}
