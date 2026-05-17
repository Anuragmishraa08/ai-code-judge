import api from './api';

export const fetchProblems = async () => {
  const response = await api.get('/problems');
  return response.data;
};

export const fetchProblemById = async (id) => {
  const response = await api.get(`/problems/${id}`);
  return response.data;
};

export const createProblem = async (payload) => {
  const response = await api.post('/problems', payload);
  return response.data;
};

export const updateProblem = async (id, payload) => {
  const response = await api.put(`/problems/${id}`, payload);
  return response.data;
};

export const deleteProblem = async (id) => {
  const response = await api.delete(`/problems/${id}`);
  return response.data;
};
