import { useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createProblem } from '../../api/problems';

const ProblemForm = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [questionType, setQuestionType] = useState('Coding');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [tags, setTags] = useState('');
  const [testCases, setTestCases] = useState([
    { input: '1\n2', expectedOutput: '3', hidden: false }
  ]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [bulkStatus, setBulkStatus] = useState(null);
  const [bulkError, setBulkError] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  const handleTestChange = (index, field, value) => {
    setTestCases((current) =>
      current.map((testCase, idx) => (idx === index ? { ...testCase, [field]: value } : testCase))
    );
  };

  const addTestCase = () => {
    setTestCases((current) => [...current, { input: '', expectedOutput: '', hidden: false }]);
  };

  const removeTestCase = (index) => {
    setTestCases((current) => current.filter((_, idx) => idx !== index));
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setBulkStatus(null);
    setBulkError(null);
    setImportLoading(true);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        throw new Error('JSON file must contain an array of problems.');
      }

      for (const item of data) {
        await createProblem({
          title: item.title || item.name,
          description: item.description || item.prompt,
          difficulty: item.difficulty || 'Easy',
          questionType: item.questionType || item.type || 'Coding',
          inputFormat: item.inputFormat || item.input || '',
          outputFormat: item.outputFormat || item.output || '',
          tags: item.tags || (item.tagList ? item.tagList.split(',').map((tag) => tag.trim()) : []),
          testCases: item.testCases || []
        });
      }

      setBulkStatus(`Imported ${data.length} questions successfully.`);
    } catch (err) {
      setBulkError(err.response?.data?.message || err.message || 'Failed to import questions.');
    } finally {
      setImportLoading(false);
      event.target.value = null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (user?.role !== 'admin') {
      setError('Only admin users can create problems.');
      return;
    }

    try {
      await createProblem({
        title,
        description,
        difficulty,
        inputFormat,
        outputFormat,
        testCases
      });
      setMessage('Problem created successfully.');
      setTitle('');
      setDescription('');
      setInputFormat('');
      setOutputFormat('');
      setTestCases([{ input: '1\n2', expectedOutput: '3', hidden: false }]);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <section className="problem-form">
      <h1>Admin Problem Builder</h1>
      <form onSubmit={handleSubmit} className="auth-card">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="6" required />
        <label>Difficulty</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <label>Input Format</label>
        <input value={inputFormat} onChange={(e) => setInputFormat(e.target.value)} />
        <label>Output Format</label>
        <input value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} />

        <label>Question Type</label>
        <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
          <option value="Coding">Coding</option>
          <option value="Multiple Choice">Multiple Choice</option>
          <option value="Debugging">Debugging</option>
          <option value="Algorithm">Algorithm</option>
        </select>

        <label>Tags (comma-separated)</label>
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="arrays, loops, easy" />

        <div className="upload-section">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            hidden
          />
          <button type="button" className="button button-secondary" onClick={handleImportClick} disabled={importLoading}>
            {importLoading ? 'Importing...' : 'Upload JSON Questions'}
          </button>
          <p className="upload-note">Upload a JSON file with an array of problems. Each item should include title, description, difficulty, questionType, and testCases.</p>
        </div>

        <div className="test-cases-section">
          <div className="test-cases-header">
            <h3>Test Cases</h3>
            <button type="button" className="button button-secondary" onClick={addTestCase}>
              Add Test Case
            </button>
          </div>
          {testCases.map((testCase, index) => (
            <fieldset key={index} className="test-case-fieldset">
              <legend>Test Case {index + 1}</legend>
              <label>Input</label>
              <textarea
                value={testCase.input}
                onChange={(e) => handleTestChange(index, 'input', e.target.value)}
                rows="3"
                required
              />
              <label>Expected Output</label>
              <textarea
                value={testCase.expectedOutput}
                onChange={(e) => handleTestChange(index, 'expectedOutput', e.target.value)}
                rows="3"
                required
              />
              <label>
                <input
                  type="checkbox"
                  checked={testCase.hidden}
                  onChange={(e) => handleTestChange(index, 'hidden', e.target.checked)}
                />
                Hidden test case
              </label>
              {testCases.length > 1 && (
                <button type="button" className="button button-secondary" onClick={() => removeTestCase(index)}>
                  Remove
                </button>
              )}
            </fieldset>
          ))}
        </div>

        {error && <p className="error-text">{error}</p>}
        {message && <p className="info-card">{message}</p>}
        {bulkError && <p className="error-text">{bulkError}</p>}
        {bulkStatus && <p className="info-card">{bulkStatus}</p>}
        <button className="button button-primary" type="submit">
          Create Problem
        </button>
      </form>
    </section>
  );
};

export default ProblemForm;
