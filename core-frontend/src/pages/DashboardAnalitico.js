// src/pages/DashboardAnalitico.js
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
// ou import as needed
import axios from '../api/axiosConfig';

function DashboardAnalitico() {
  const [candidatosPorVaga, setCandidatosPorVaga] = useState([]);
  const [candidatosPorUf, setCandidatosPorUf] = useState([]);
  const [statusCounts, setStatusCounts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const resp = await axios.get('http://127.0.0.1:8000/api/vagas/dashboard/');
      setCandidatosPorVaga(resp.data.candidatos_por_vaga);
      setCandidatosPorUf(resp.data.candidatos_por_uf);
      setStatusCounts(resp.data.status_counts);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    }
  };

  // Convertendo dados para formatação Recharts
  const vagaData = candidatosPorVaga.map(item => ({
    name: item['vaga__titulo'] || 'Sem vaga',
    total: item.total,
  }));

  const ufData = candidatosPorUf.map(item => ({
    uf: item.uf || 'N/A',
    total: item.total,
  }));

  const statusData = statusCounts.map(item => ({
    status: item.status,
    total: item.total,
  }));

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#d84f4f'];

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard Analítico</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {/* Gráfico 1: Candidatos por Vaga (BarChart) */}
        <div style={{ flex: '1 1 300px', minWidth: '300px', height: '300px' }}>
          <h2>Candidatos por Vaga</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vagaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 2: Candidatos por UF (PieChart) */}
        <div style={{ flex: '1 1 300px', minWidth: '300px', height: '300px' }}>
          <h2>Candidatos por UF</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ufData}
                dataKey="total"
                nameKey="uf"
                outerRadius={100}
                fill="#82ca9d"
                label
              >
                {ufData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 3: Status Counts (BarChart ou PieChart) */}
        <div style={{ flex: '1 1 300px', minWidth: '300px', height: '300px' }}>
          <h2>Status dos Processos</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardAnalitico;
