// src/pages/DashboardView.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/DashboardView.css';

function DashboardView() {
  return (
    <div className="dashboard-container">
      {/* Conteúdo Principal */}
      <div className="main-content">
        <h1>Bem-vindo(a) ao Painel RH</h1>
        <p>Aqui você pode gerenciar Vagas, Candidatos e ver estatísticas.</p>
        <p>
          Se quiser, pode adicionar um resumo rápido, por exemplo “quantos candidatos 
          no total”, etc. Mas vamos deixar isso para o Dashboard Analítico completo.
        </p>
      </div>
    </div>
  );
}

export default DashboardView;
