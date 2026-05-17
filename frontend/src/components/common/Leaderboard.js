import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../../api/leaderboard';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchLeaderboard();
        setLeaders(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  return (
    <section className="leaderboard-page auth-card">
      <h1>Leaderboard</h1>
      {loading && <div className="loader">Loading leaderboard...</div>}
      {error && <div className="error-card">{error}</div>}
      {!loading && !error && (
        <div className="leaderboard-table">
          <div className="leaderboard-row header">
            <span>Rank</span>
            <span>Name</span>
            <span>Score</span>
            <span>Solved</span>
          </div>
          {leaders.map((leader) => (
            <div key={leader.id} className="leaderboard-row">
              <span>{leader.rank}</span>
              <span>{leader.name}</span>
              <span>{leader.score}</span>
              <span>{leader.solvedCount}</span>
            </div>
          ))}
          {leaders.length === 0 && <p className="info-card">No leaderboard data yet.</p>}
        </div>
      )}
    </section>
  );
};

export default Leaderboard;
