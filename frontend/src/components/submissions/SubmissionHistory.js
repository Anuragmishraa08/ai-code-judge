import { useEffect, useState } from 'react';
import { fetchSubmissions } from '../../api/submissions';

const SubmissionHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const data = await fetchSubmissions();
        setSubmissions(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  if (loading) {
    return <div className="loader">Loading your submissions...</div>;
  }

  if (error) {
    return <div className="error-card">{error}</div>;
  }

  return (
    <section className="submission-history">
      <h1>Submission History</h1>
      {submissions.length === 0 ? (
        <div className="info-card">No submissions yet. Start solving a problem!</div>
      ) : (
        submissions.map((submission) => (
          <article key={submission._id} className="submission-card">
            <div className="submission-header">
              <strong>{submission.problem?.title || 'Untitled problem'}</strong>
              <span>{new Date(submission.createdAt).toLocaleString()}</span>
            </div>
            <div className="submission-summary">
              <span>{submission.language.toUpperCase()}</span>
              <span>
                {submission.passedCount} / {submission.totalCount} passed
              </span>
              <span>Status: {submission.status}</span>
            </div>
            <pre className="submission-feedback">{submission.aiFeedback}</pre>
          </article>
        ))
      )}
    </section>
  );
};

export default SubmissionHistory;
