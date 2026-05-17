import api from './api';

export const fetchLeaderboard = async () => {
  const response = await api.get('/leaderboard');
  return response.data;
};
