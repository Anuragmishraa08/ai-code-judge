import api from './api';

export const submitSolution = async (payload) => {
  const response = await api.post('/submissions', payload);
  return response.data;
};

export const fetchSubmissions = async () => {
  const response = await api.get('/submissions');
  return response.data;
};

export const fetchSubmissionById = async (id) => {
  const response = await api.get(`/submissions/${id}`);
  return response.data;
};
