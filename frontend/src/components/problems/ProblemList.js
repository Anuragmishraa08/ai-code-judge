import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProblems } from '../../api/problems';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const data = await fetchProblems();
        setProblems(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, []);

  const filtered = filter === 'All' ? problems : problems.filter((p) => p.difficulty === filter);

  if (loading) {
    return <div className="loader">Loading problems...</div>;
  }

  if (error) {
    return <div className="error-card">{error}</div>;
  }

  return (
    <section className="problem-list">
      <h1>Practice Problems</h1>
      <div className="filter-bar">
        {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
          <button
            key={diff}
            className={`filter-btn ${filter === diff ? 'active' : ''}`}
            onClick={() => setFilter(diff)}
          >
            {diff}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="info-card">No problems found.</div>
      ) : (
        <div className="problem-grid">
          {filtered.map((problem) => (
            <article key={problem._id} className="problem-card">
              <h2>{problem.title}</h2>
              <div className="tag-row">
                <span className={`tag difficulty-${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </span>
                <span className="tag type-tag">{problem.questionType || 'Coding'}</span>
              </div>
              <p>{problem.description.substring(0, 130)}...</p>
              <Link className="button button-secondary" to={`/problems/${problem._id}`}>
                Solve Now
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProblemList;
