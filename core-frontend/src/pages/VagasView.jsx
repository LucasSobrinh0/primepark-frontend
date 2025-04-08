// VagasView.jsx
import React, { useState, useEffect } from 'react';

const VagasView = () => {
  // Estados para as vagas, loading, erros, e controle do modal
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  
  // Estado para controle de edição (null = nova vaga; objeto = edição)
  const [editingVaga, setEditingVaga] = useState(null);
  
  // Estado da barra de pesquisa
  const [searchQuery, setSearchQuery] = useState("");

  // Estado do formulário para criar/editar vaga
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    criterios: '',
    data_planejada_inicio: ''
  });

  // Busca as vagas ao montar o componente
  useEffect(() => {
    fetchVagas();
  }, []);

  // Função para buscar vagas da API
  const fetchVagas = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/vagas/vaga/');
      if (response.ok) {
        const data = await response.json();
        // Considera tanto resposta direta (array) quanto paginada (data.results)
        const vagasList = Array.isArray(data)
          ? data
          : data.results
            ? data.results
            : [];
        setVagas(vagasList);
      } else {
        setError("Erro ao buscar vagas.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vagaId) => {
    if (!window.confirm("Tem certeza que deseja remover essa vaga?")) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/vagas/vaga/${vagaId}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Atualiza a listagem de vagas após remoção
        fetchVagas();
      } else {
        setError("Erro ao remover a vaga.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao remover a vaga.");
    }
  };

  // Abre o modal para criação e reseta estado de edição
  const handleOpenModal = () => {
    setEditingVaga(null);
    setFormData({
      titulo: '',
      descricao: '',
      criterios: '',
      data_planejada_inicio: ''
    });
    setModalOpen(true);
  };

  // Fecha o modal e reseta os estados relacionados
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingVaga(null);
    setFormData({
      titulo: '',
      descricao: '',
      criterios: '',
      data_planejada_inicio: ''
    });
  };

  // Atualiza os dados do formulário
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Abre o modal de edição, carregando os dados da vaga selecionada
  const handleEdit = (vaga) => {
    setEditingVaga(vaga);
    setFormData({
      titulo: vaga.titulo,
      descricao: vaga.descricao,
      // Converte o array de critérios para string (se for array) para facilitar edição
      criterios: Array.isArray(vaga.criterios) ? vaga.criterios.join(', ') : vaga.criterios,
      data_planejada_inicio: vaga.data_planejada_inicio || ''
    });
    setModalOpen(true);
  };

  // Lida com a submissão do formulário para criar ou atualizar a vaga
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Processa o campo "criterios": tenta parse JSON; se não funcionar, separa por vírgulas.
    let criteriosProcessed;
    try {
      criteriosProcessed = JSON.parse(formData.criterios);
    } catch (err) {
      criteriosProcessed = formData.criterios.split(',').map(item => item.trim());
    }

    const payload = {
      ...formData,
      criterios: criteriosProcessed
    };

    try {
      let response;
      if (editingVaga) {
        // Atualiza a vaga existente (utilizando PATCH)
        response = await fetch(`http://127.0.0.1:8000/api/vagas/vaga/${editingVaga.id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Cria nova vaga (utilizando POST)
        response = await fetch('http://127.0.0.1:8000/api/vagas/vaga/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        // Se a operação for bem-sucedida, fecha o modal e atualiza a listagem
        handleCloseModal();
        fetchVagas();
      } else {
        const errorData = await response.json();
        console.error("Erro ao salvar vaga:", errorData);
        setError("Erro ao salvar a vaga.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar a vaga.");
    }
  };

  // Filtra as vagas de acordo com a barra de pesquisa (por título)
  const filteredVagas = vagas.filter(vaga =>
    vaga.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="vagas-view-container" style={styles.container}>
      <h1 style={styles.header}>Gerenciamento de Vagas</h1>
      
      {error && <div style={styles.error}>{error}</div>}

      {/* Área superior: botão para criar nova vaga e pesquisa */}
      <div style={styles.topBar}>
        <button onClick={handleOpenModal} style={styles.createButton}>
          Criar Nova Vaga
        </button>
        <input
          type="text"
          placeholder="Pesquisar vaga por título..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Listagem de vagas */}
      {loading ? (
        <div>Carregando vagas...</div>
      ) : (
        <div style={styles.vagasList}>
          {filteredVagas.length === 0 ? (
            <p>Nenhuma vaga encontrada.</p>
          ) : (
            filteredVagas.map((vaga) => (
              <div key={vaga.id} style={styles.vagaCard}>
                <h2 style={styles.vagaTitle}>{vaga.titulo}</h2>
                <p style={styles.vagaDescricao}><strong>Descrição:</strong> {vaga.descricao}</p>
                <p style={styles.vagaCriterios}>
                  <strong>Critérios:</strong>{' '}
                  {Array.isArray(vaga.criterios) ? vaga.criterios.join(', ') : '-'}
                </p>
                {/* Botão para editar */}
                <button onClick={() => handleEdit(vaga)} style={styles.editButton}>
                  Editar
                </button>
                <button onClick={() => handleDelete(vaga.id)} style={styles.deleteButton}>
      Remover
    </button>
                
              </div>
            ))
          )
          }
          
        </div>
      )}

      {/* Modal para criação/edição de vaga */}
      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button onClick={handleCloseModal} style={styles.modalCloseButton}>×</button>
            <h2>{editingVaga ? "Editar Vaga" : "Criar Nova Vaga"}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>
                Título:
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                Descrição:
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  style={styles.textarea}
                />
              </label>
              <label style={styles.label}>
                Critérios (JSON ou separados por vírgulas):
                <input
                  type="text"
                  name="criterios"
                  value={formData.criterios}
                  onChange={handleChange}
                  placeholder='Ex: ["Experiência", "Portfólio"] ou Experiência, Portfólio'
                  required
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                Data Planejada de Início:
                <input
                  type="date"
                  name="data_planejada_inicio"
                  value={formData.data_planejada_inicio}
                  onChange={handleChange}
                  style={styles.input}
                />
              </label>
              <button type="submit" style={styles.submitButton}>
                {editingVaga ? "Atualizar Vaga" : "Criar Vaga"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos em objeto para facilitar a responsividade e o design moderno
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    border: 'none',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  searchInput: {
    padding: '8px 12px',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '40%'
  },
  vagasList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  vagaCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    position: 'relative'
  },
  vagaTitle: {
    margin: '0 0 10px'
  },
  vagaDescricao: {
    fontSize: '0.9rem',
    marginBottom: '10px'
  },
  vagaCriterios: {
    fontSize: '0.9rem',
    marginBottom: '10px'
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#e74c3c',
    border: 'none',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    position: 'relative',
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#3498db',
    border: 'none',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    position: 'absolute',
    bottom: '15px',
    right: '15px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '10px'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '500px',
    width: '100%',
    position: 'relative'
  },
  modalCloseButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginBottom: '10px',
    fontSize: '0.9rem'
  },
  input: {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  textarea: {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    resize: 'vertical'
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    border: 'none',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '10px'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '10px'
  }
};

export default VagasView;
