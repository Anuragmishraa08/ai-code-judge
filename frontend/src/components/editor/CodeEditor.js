import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

const defaultTemplates = {
  javascript: `// Read input from stdin with process.stdin
// Example: node solution.js < input.txt

function main(input) {
  const data = input.trim().split('\n');
  console.log(data.join('\n'));
}

let inputData = '';
process.stdin.on('data', (chunk) => {
  inputData += chunk;
});
process.stdin.on('end', () => {
  main(inputData);
});
`,
  python: `# Read input from stdin
import sys

def main(input_data):
    lines = input_data.strip().split('\n')
    print('\n'.join(lines))

if __name__ == '__main__':
    raw = sys.stdin.read()
    main(raw)
`
};

const CodeEditor = ({ language, value, onChange }) => {
  const [code, setCode] = useState(value || defaultTemplates[language] || '');

  useEffect(() => {
    const nextCode = value || defaultTemplates[language] || '';
    setCode(nextCode);
    if (!value && nextCode) {
      onChange(nextCode);
    }
  }, [language, value, onChange]);

  const handleEditorChange = (newValue) => {
    setCode(newValue || '');
    onChange(newValue || '');
  };

  return (
    <div className="code-editor">
      <Editor
        height="420px"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={handleEditorChange}
        options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: 'on' }}
      />
    </div>
  );
};

export default CodeEditor;
