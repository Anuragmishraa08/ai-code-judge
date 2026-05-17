const CodeAnalysis = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <section className="analysis-card">
      <h2>AI Code Guidance</h2>
      <p><strong>Complexity estimate:</strong> {analysis.complexityEstimate}</p>
      <p><strong>Suggestion:</strong> {analysis.suggestion}</p>
      <p><strong>Hint:</strong> {analysis.hint}</p>
    </section>
  );
};

export default CodeAnalysis;
