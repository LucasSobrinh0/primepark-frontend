import React, { useState, useEffect } from 'react';
import '../styles/CandidaturaView.css';

// Mapeamentos para tradução de status e escolaridade
const STATUS_CHOICES = [
  { value: 'NAO_SELECIONADO', label: 'Não selecionado' },
  { value: 'EM_ANDAMENTO', label: 'Em andamento' },
  { value: 'CONTRATADO', label: 'Contratado' },
  { value: 'NAO_APTO', label: 'Não apto no momento' },
];

const ESCOLARIDADE_MAP = {
  EMI: 'Ensino Médio Incompleto',
  EMC: 'Ensino Médio Completo',
  ESI: 'Ensino Superior Incompleto',
  ESC: 'Ensino Superior Completo',
};



function CandidaturaView() {
  // Estados para candidatos, applications, vagas e configurações da tabela
  const [rhObservacoes, setRhObservacoes] = useState('');
  const [candidatos, setCandidatos] = useState([]);
  const [applications, setApplications] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [rowStates, setRowStates] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCandidato, setSelectedCandidato] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  // --------------------------------------------------------------------------
  // Busca os candidatos conforme filtros e paginação
  // --------------------------------------------------------------------------
  const fetchCandidatos = async () => {
    try {
      let url = `${process.env.REACT_APP_API_URL}/api/candidatura/list/?page=${page}`;
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          url += `&${key}=${encodeURIComponent(filters[key])}`;
        }
      });
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        setCandidatos(data.results);
        const pageSize = 10;
        setTotalPages(Math.ceil(data.count / pageSize));
      } else {
        console.error('Erro ao buscar candidatos:', resp.status);
      }
    } catch (error) {
      console.error('Erro ao buscar candidatos:', error);
    }
  };

  // --------------------------------------------------------------------------
  // Busca as applications (vínculo candidato-vaga)
  // --------------------------------------------------------------------------
  const fetchApplications = async () => {
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URL}/api/vagas/application/`);
      if (resp.ok) {
        const data = await resp.json();
        setApplications(data.results || data);
      } else {
        console.error('Erro ao buscar applications:', resp.status);
      }
    } catch (error) {
      console.error('Erro ao buscar applications:', error);
    }
  };

  // --------------------------------------------------------------------------
  // Busca as vagas disponíveis
  // --------------------------------------------------------------------------
  const fetchVagas = async () => {
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_URL}/api/vagas/vaga/`);
      if (resp.ok) {
        const data = await resp.json();
        setVagas(data.results || data);
      } else {
        console.error('Erro ao buscar vagas:', resp.status);
      }
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
    }
  };

  // Atualiza candidatos sempre que filtros ou página mudam
  useEffect(() => {
    fetchCandidatos();
  }, [filters, page]);

  // Busca applications e vagas na montagem do componente
  useEffect(() => {
    fetchApplications();
    fetchVagas();
  }, []);

  // Sincroniza os estados das linhas conforme candidatos e applications mudam
  useEffect(() => {
    const newStates = candidatos.map(c => {
      const app = applications.find(a => a.candidatura === c.id);
      if (app) {
        return {
          applicationId: app.id,
          selectedVaga: app.vaga,
          selectedStatus: app.status,
        };
      } else {
        return {
          applicationId: null,
          selectedVaga: '',
          selectedStatus: 'EM_ANDAMENTO',
        };
      }
    });
    setRowStates(newStates);
  }, [candidatos, applications]);

  // Handler para alteração dos filtros
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };


  // Abre o modal de detalhes
  const handleOpenDetails = (cand) => {
    setSelectedCandidato(cand);

    // Acha a Application ligada ao candidato
    const appData = applications.find(a => a.candidatura === cand.id);
    // Se já existir observações, carrega; caso contrário, deixa vazio
    setRhObservacoes(appData?.observacoes || '');

    setOpenDetailModal(true);
  };

  // Fecha o modal de detalhes
  const handleCloseDetails = () => {
    setSelectedCandidato(null);
    setOpenDetailModal(false);
  };

  // Handlers para alteração de vaga e status na linha
  const handleChangeVaga = (index, vagaId) => {
    const updated = [...rowStates];
    updated[index].selectedVaga = vagaId;
    setRowStates(updated);
  };

  const handleChangeStatus = (index, status) => {
    const updated = [...rowStates];
    updated[index].selectedStatus = status;
    setRowStates(updated);
  };

  // Função para salvar (criar ou atualizar) a aplicação de um candidato
  const handleSaveRow = async (index) => {
    const appData = rowStates[index];
    const candidate = candidatos[index];
    if (!appData.selectedVaga) {
      alert("Por favor, selecione uma vaga.");
      return;
    }
    const payload = {
      candidatura: candidate.id,
      vaga: appData.selectedVaga,
      status: appData.selectedStatus,
    };
    if (appData.applicationId) {
      try {
        const resp = await fetch(
          `${process.env.REACT_APP_API_URL}/api/vagas/application/update/${appData.applicationId}/`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }
        );
        if (resp.ok) {
          alert("Aplicação atualizada com sucesso!");
          fetchApplications();
        } else {
          console.error("Erro ao atualizar a aplicação:", resp.status);
          alert("Erro ao atualizar a aplicação.");
        }
      } catch (error) {
        console.error("Erro ao atualizar a aplicação:", error);
        alert("Erro ao atualizar a aplicação.");
      }
    } else {
      try {
        const resp = await fetch(
          `${process.env.REACT_APP_API_URL}/api/vagas/application/create/`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }
        );
        if (resp.ok) {
          alert("Aplicação criada com sucesso!");
          const data = await resp.json();
          const newStates = [...rowStates];
          newStates[index].applicationId = data.id;
          setRowStates(newStates);
          fetchApplications();
        } else {
          console.error("Erro ao criar a aplicação:", resp.status);
          alert("Erro ao criar a aplicação.");
        }
      } catch (error) {
        console.error("Erro ao criar a aplicação:", error);
        alert("Erro ao criar a aplicação.");
      }
    }
  };
  const handleSaveObservacoes = async () => {
    if (!selectedCandidato) return;
  
    try {
      // Localiza de novo a Application do candidato selecionado
      const appData = applications.find(a => a.candidatura === selectedCandidato.id);
      if (!appData) {
        alert('Nenhuma Application encontrada para este candidato.');
        return;
      }
  
      // O payload que enviaremos pro backend
      const payload = { observacoes: rhObservacoes };
  
      // Faz PATCH no endpoint de update da Application
      const resp = await fetch(
        `${process.env.REACT_APP_API_URL}/api/vagas/application/update/${appData.id}/`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
  
      if (resp.ok) {
        alert('Observações atualizadas com sucesso!');
        // Se quiser atualizar a tela local, recarregue as applications:
        fetchApplications();
      } else {
        alert('Erro ao atualizar observações.');
      }
    } catch (error) {
      console.error('Erro ao salvar observações:', error);
    }
  };
  // Modal para mostrar os detalhes completos do candidato
  const renderModalDetails = () => {
    if (!selectedCandidato) return null;
    return (
      <div className="modal-overlay" onClick={handleCloseDetails}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={handleCloseDetails}>&times;</button>
          <h2>Detalhes do Candidato</h2>
          <p><strong>Nome:</strong> {selectedCandidato.nome}</p>
          <p><strong>E-mail:</strong> {selectedCandidato.email}</p>
          <p><strong>Telefone:</strong> {selectedCandidato.telefone}</p>
          <p><strong>Cidade/UF:</strong> {selectedCandidato.cidade} / {selectedCandidato.uf}</p>
          <p><strong>Bairro:</strong> {selectedCandidato.bairro ? selectedCandidato.bairro : '-'}</p>
          <p><strong>Data de Nascimento:</strong> {selectedCandidato.data_nascimento}</p>
          <p>
            <strong>Escolaridade:</strong> {ESCOLARIDADE_MAP[selectedCandidato.escolaridade] || selectedCandidato.escolaridade}
          </p>
          <p><strong>Sobre:</strong> {selectedCandidato.sobre_voce}</p>
          <p><strong>LGPD Aceita?</strong> {selectedCandidato.aceita_lgpd ? 'Sim' : 'Não'}</p>
          <p><strong>Observações (RH):</strong></p>
          <textarea
            value={rhObservacoes}
            onChange={(e) => setRhObservacoes(e.target.value)}
            style={{ width: '100%', height: '80px' }}
          />
          <button onClick={handleSaveObservacoes}>Salvar Observações</button>
          {selectedCandidato.curriculo && (
            <p>
              <strong>Currículo:</strong>
              <a href={selectedCandidato.curriculo} target="_blank" rel="noopener noreferrer">
                Baixar PDF
              </a>
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="candidatura-container">
      <h1 className="header-title">Candidaturas</h1>
      {/* Área de filtros ampliada */}
      <div className="filtros">
        <div className="filter-group">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            name="nome"
            id="nome"
            placeholder="Filtrar por nome"
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="escolaridade">Escolaridade:</label>
          <select name="escolaridade" id="escolaridade" onChange={handleFilterChange} className="filter-input">
            <option value="">Todos</option>
            <option value="EMI">Ensino Médio Incompleto</option>
            <option value="EMC">Ensino Médio Completo</option>
            <option value="ESI">Ensino Superior Incompleto</option>
            <option value="ESC">Ensino Superior Completo</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="uf">Estado:</label>
          <select name="uf" id="uf" onChange={handleFilterChange} className="filter-input">
            <option value="">Todos</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="SP">São Paulo</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="cidade">Cidade:</label>
          <input
            type="text"
            name="cidade"
            id="cidade"
            placeholder="Filtrar por cidade"
            onChange={handleFilterChange}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="status">Status:</label>
          <select name="status" id="status" onChange={handleFilterChange} className="filter-input">
            <option value="">Todos</option>
            {STATUS_CHOICES.map(choice => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="vaga">Vaga:</label>
          <select name="vaga" id="vaga" onChange={handleFilterChange} className="filter-input">
            <option value="">Todas</option>
            {vagas.map(vaga => (
              <option key={vaga.id} value={vaga.id}>
                {vaga.titulo}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Tabela de candidatos */}
      <div className="table-responsive">
        <table className="candidaturas-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cidade</th>
              <th>Sobre</th>
              <th>Criado Em</th>
              <th>Vaga</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {candidatos.map((cand, index) => (
              <tr key={cand.id}>
                <td>{cand.nome}</td>
                <td>{cand.cidade}</td>
                <td>{cand.sobre_voce}</td>
                <td>{new Date(cand.criado_em).toLocaleDateString()}</td>
                <td>
                  <select
                    value={rowStates[index]?.selectedVaga || ''}
                    onChange={(e) => handleChangeVaga(index, e.target.value)}
                    className="select-input"
                  >
                    <option value="">Selecione</option>
                    {vagas.map(vaga => (
                      <option key={vaga.id} value={vaga.id}>
                        {vaga.titulo}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={rowStates[index]?.selectedStatus || 'EM_ANDAMENTO'}
                    onChange={(e) => handleChangeStatus(index, e.target.value)}
                    className="select-input"
                  >
                    {STATUS_CHOICES.map(choice => (
                      <option key={choice.value} value={choice.value}>
                        {choice.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="acoes-cell">
                  <button className="btn btn-details" onClick={() => handleOpenDetails(cand)}>
                    Ver Detalhes
                  </button>
                  <button className="btn btn-save" onClick={() => handleSaveRow(index)}>
                    Salvar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginação */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
          <button key={pg} onClick={() => setPage(pg)} disabled={page === pg} className="pagination-btn">
            {pg}
          </button>
        ))}
      </div>
      {openDetailModal && renderModalDetails()}
    </div>
  );
}

export default CandidaturaView;
