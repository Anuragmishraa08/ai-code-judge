let OpenAIApi;
try {
  const { Configuration } = require('openai');
  OpenAIApi = require('openai').OpenAIApi;
} catch (err) {
  OpenAIApi = null;
}

const mockAnalyze = ({ code, language, problemTitle }) => {
  const complexityEstimate = 'O(n)';
  const suggestion =
    'Check whether your solution handles all edge cases and avoid repeated work inside loops. If test cases are large, prefer using built-in data structures and avoid quadratic behavior.';
  const hint =
    'Focus on input parsing and algorithmic structure first. For search or sorting problems, consider whether a greedy or divide-and-conquer strategy is a better fit.';

  return {
    complexityEstimate,
    suggestion,
    hint,
    summary: `Analyzed ${language} code for problem: ${problemTitle}`
  };
};

const analyzeCode = async ({ code, language, problemTitle, problemDescription }) => {
  const openAiKey = process.env.OPENAI_API_KEY;
  if (!openAiKey || !OpenAIApi) {
    return mockAnalyze({ code, language, problemTitle, problemDescription });
  }

  try {
    const { Configuration } = require('openai');
    const configuration = new Configuration({ apiKey: openAiKey });
    const openai = new OpenAIApi(configuration);
    const prompt = `You are a coding judge assistant. Analyze the following ${language} solution for the problem titled \"${problemTitle}\" with the description:\n\n${problemDescription}\n\nProvide a JSON object with keys: summary, complexityEstimate, suggestion, hint. Keep values concise.`;

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You provide structured code analysis for a programming judge platform.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 250
    });

    const text = response.data.choices?.[0]?.message?.content || '';
    const parsed = JSON.parse(text.trim());

    return {
      summary: parsed.summary || `Analyzed ${language} code for problem: ${problemTitle}`,
      complexityEstimate: parsed.complexityEstimate || 'O(n)',
      suggestion: parsed.suggestion || 'Review your algorithm and edge cases.',
      hint: parsed.hint || 'Try to simplify input processing and keep logic clean.'
    };
  } catch (error) {
    console.error('OpenAI analysis failed:', error.message || error);
    return mockAnalyze({ code, language, problemTitle, problemDescription });
  }
};

module.exports = { analyzeCode };
