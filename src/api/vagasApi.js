// src/api/vagasApi.js
import axios from './axiosConfig';

// Ajuste a URL se for diferente
const BASE_URL = `${process.env.REACT_APP_API_URL}/api/vagas/vaga/`;

export async function fetchVagas() {
  const response = await axios.get(BASE_URL);
  return response.data;
}

export async function createVaga(vaga) {
  // Se 'criterios' for string no form, mas o back-end espera array/JSON,
  // você pode converter aqui:
  if (typeof vaga.criterios === 'string') {
    try {
      vaga.criterios = JSON.parse(vaga.criterios);
    } catch {
      // se der erro, apenas coloco em array
      vaga.criterios = [vaga.criterios];
    }
  }
  const response = await axios.post(BASE_URL, vaga);
  return response.data;
}

export async function updateVaga(vagaId, vaga) {
  if (typeof vaga.criterios === 'string') {
    try {
      vaga.criterios = JSON.parse(vaga.criterios);
    } catch {
      vaga.criterios = [vaga.criterios];
    }
  }
  const response = await axios.put(`${BASE_URL}${vagaId}/`, vaga);
  return response.data;
}

export async function deleteVaga(vagaId) {
  const response = await axios.delete(`${BASE_URL}${vagaId}/`);
  return response.data;
}
