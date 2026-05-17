import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProblemById } from '../../api/problems';
import { submitSolution } from '../../api/submissions';
import CodeEditor from '../editor/CodeEditor';

const ProblemPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProblem = async () => {
      try {
        const data = await fetchProblemById(id);
        setProblem(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };
    loadProblem();
  }, [id]);

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    if (!code.trim()) {
      setError('Please write code before submitting.');
      return;
    }

    setLoading(true);
    try {
      const data = await submitSolution({ problemId: id, code, language });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!problem) {
    return <div className="loader">Loading problem details...</div>;
  }

  return (
    <section className="problem-page">
      <div className="problem-panel">
        <h1>{problem.title}</h1>
        <div className="tag-row">
          <span className={`tag difficulty-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          <span className="tag type-tag">{problem.questionType || 'Coding'}</span>
        </div>
        <p>{problem.description}</p>
        <div className="problem-meta">
          <div>
            <strong>Input Format:</strong>
            <p>{problem.inputFormat || 'Standard input'}</p>
          </div>
          <div>
            <strong>Output Format:</strong>
            <p>{problem.outputFormat || 'Standard output'}</p>
          </div>
        </div>
      </div>

      <div className="editor-panel">
        <div className="editor-toolbar">
          <label>
            Language
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </label>
          <button className="button button-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Running...' : 'Submit Code'}
          </button>
        </div>
        <CodeEditor language={language} value={code} onChange={setCode} />
      </div>

      {error && <div className="error-card">{error}</div>}

      {result && (
        <section className="results-card">
          <h2>Submission Results</h2>
          <p>
            Passed {result.submission.passedCount} / {result.submission.totalCount} tests
          </p>
          <div className="analysis-block">
            <h3>AI Feedback</h3>
            <pre>{result.submission.aiFeedback}</pre>
          </div>
          <div className="test-results">
            {result.submission.testResults.map((test, index) => (
              <div key={index} className={`test-row ${test.passed ? 'pass' : 'fail'}`}>
                <strong>Test {index + 1}:</strong> {test.passed ? 'Passed' : 'Failed'}
                {test.hidden ? (
                  <div className="hidden-test-note">Hidden test case - details are not displayed.</div>
                ) : (
                  <>
                    <div>
                      <strong>Input:</strong> <code>{test.input}</code>
                    </div>
                    <div>
                      <strong>Expected:</strong> <code>{test.expectedOutput}</code>
                    </div>
                    <div>
                      <strong>Actual:</strong> <code>{test.actualOutput || 'No output'}</code>
                    </div>
                    {test.error && (
                      <div>
                        <strong>Error:</strong> <code>{test.error}</code>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
};

export default ProblemPage;
