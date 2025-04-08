export default function ApplyPage() {
  // Poderíamos controlar estado se quisermos, mas para um MVP
  // é possível apenas submeter via "FormData"

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target; 
    const formData = new FormData(form);

    // Se algum campo no seu Model for diferente do name="" do input,
    // adapte aqui antes de enviar (ou use o state do React).
    // Por ex: se o input se chama "Data_Nascimento" mas no back-end é "data_nascimento",
    // faça:
    // formData.append('data_nascimento', formData.get('Data_Nascimento'));
    // formData.delete('Data_Nascimento');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/candidatura/create/`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Candidatura enviada com sucesso!');
        form.reset();
      } else {
        const errorData = await response.json();
        console.error('Erro:', errorData);
        alert('Falha ao enviar candidatura. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro na comunicação com o servidor. Tente novamente mais tarde.');
    }
  };

  return (
    <div style={styles.container}>
      {/* Coluna Esquerda: Título e Texto Centralizados */}
      <div style={styles.leftColumn}>
        <h1 style={styles.title}>Prime Park - Trabalhe Conosco</h1>
        <p style={styles.paragraph}>
          Para que você possa apresentar as suas informações pessoais para se candidatar a qualquer vaga ou oportunidade de emprego à qualquer empresa vinculada ao Vilarouca, 
          você irá nos fornecer dados pessoais...
        </p>
      </div>

      {/* Coluna Direita: Formulário em "cartão" */}
      <div style={styles.rightColumn}>
        <form style={styles.formContainer} onSubmit={handleSubmit}>

          <label style={styles.label}>
            Nome
            <input type="text" name="nome" style={styles.input} required />
          </label>

          <label style={styles.label}>
            E-mail
            <input type="email" name="email" style={styles.input} required />
          </label>

          <label style={styles.label}>
            Telefone
            <input type="tel" name="telefone" style={styles.input} required />
          </label>

          <label style={styles.label}>
            Data de Nascimento
            <input type="date" name="data_nascimento" style={styles.input} required />
          </label>

          <label style={styles.label}>
            Estado
            <select name="uf" style={styles.input} required>
              <option value="">Selecione...</option>
              <option value="MT">MT</option>
              <option value="MS">MS</option>
              <option value="SP">SP</option>
            </select>
          </label>

          <label style={styles.label}>
            Cidade
            <input type="text" name="cidade" style={styles.input} required />
          </label>

          {/* Campo opcional: Bairro */}
          <label style={styles.label}>
            Bairro <span style={{ fontStyle: 'italic', color: '#666' }}>(opcional)</span>
            <input type="text" name="bairro" style={styles.input} />
          </label>

          <label style={styles.label}>
            Escolaridade
            <select name="escolaridade" style={styles.input} required>
              <option value="">Selecione...</option>
              <option value="EMI">Ensino Médio Incompleto</option>
              <option value="EMC">Ensino Médio Completo</option>
              <option value="ESI">Ensino Superior Incompleto</option>
              <option value="ESC">Ensino Superior Completo</option>
            </select>
          </label>

          <label style={styles.label}>
            Fale sobre você
            <textarea
              name="sobre_voce"
              placeholder="Fale um pouco sobre suas experiências..."
              maxLength={300}
              style={{ ...styles.input, height: '80px', resize: 'vertical' }}
              required
            />
          </label>

          <label style={styles.label}>
            Envie seu currículo (PDF até 5MB)
            <input type="file" accept="application/pdf" name="curriculo" style={styles.inputFile} required />
          </label>

          <div style={styles.lgpdContainer}>
            <input type="checkbox" name="aceita_lgpd" id="lgpd" style={{ marginRight: '0.5rem' }} />
            <label htmlFor="lgpd" style={styles.lgpdLabel}>
              Li e aceito a LGPD
            </label>
          </div>

          <input type="submit" value="Enviar" style={styles.submitButton} />
        </form>
      </div>
    </div>
  );
}

// Estilos
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    boxSizing: 'border-box',
    flexWrap: 'wrap',
  },
  leftColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    minWidth: '250px',
  },
  rightColumn: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    minWidth: '300px',
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '1rem',
    color: '#2c3e50',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#555',
    maxWidth: '600px',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: '450px',
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
    fontWeight: 'bold',
    color: '#444',
  },
  input: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  inputFile: {
    marginTop: '0.5rem',
    fontSize: '0.9rem',
    border: 'none',
  },
  lgpdContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  lgpdLabel: {
    fontWeight: 'normal',
    color: '#444',
  },
  submitButton: {
    cursor: 'pointer',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    alignSelf: 'flex-start',
    transition: 'background-color 0.2s ease-in-out',
  },
};
