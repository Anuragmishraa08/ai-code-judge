const { spawn } = require('child_process');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');

const createTempFile = async (language, code) => {
  const extension = language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'js';
  const fileName = `submission-${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const filePath = path.join(os.tmpdir(), fileName);
  await fs.writeFile(filePath, code, 'utf8');
  return filePath;
};

const cleanupFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (_) {
    // ignore cleanup errors
  }
};

const runProcess = (command, args, input, timeoutMs) => {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ stdout: stdout.trim(), stderr: stderr.trim(), code, timedOut });
    });

    if (input) {
      child.stdin.write(input);
    }
    child.stdin.end();
  });
};

const executeCode = async ({ code, language, input = '', timeoutMs = 5000 }) => {
  const filePath = await createTempFile(language, code);
  const outputFile = path.join(os.tmpdir(), `submission-${Date.now()}-output${process.platform === 'win32' ? '.exe' : ''}`);
  const commands = {
    javascript: { command: 'node', args: [filePath] },
    python: { command: 'python', args: [filePath] },
    cpp: { build: 'g++', buildArgs: [filePath, '-O2', '-o', outputFile], run: outputFile }
  };

  if (!commands[language]) {
    await cleanupFile(filePath);
    throw new Error(`Unsupported language: ${language}`);
  }

  try {
    if (process.env.USE_DOCKER === 'true') {
      const dockerImage = language === 'python' ? 'python:3.12-slim' : language === 'cpp' ? 'gcc:latest' : 'node:20-slim';
      const workDir = '/workspace';
      const containerFile = path.basename(filePath);
      const dockerArgs = [
        'run', '--rm', '-i', '--network', 'none', '--pids-limit', '64', '--memory', '256m',
        '-v', `${path.dirname(filePath)}:${workDir}`,
        '-w', workDir,
        dockerImage
      ];

      if (language === 'cpp') {
        dockerArgs.push('g++', containerFile, '-O2', '-o', 'submission.out');
        const compileResult = await runProcess('docker', dockerArgs, '', timeoutMs);
        if (compileResult.stderr || compileResult.timedOut) {
          return compileResult;
        }
        return await runProcess('docker', ['run', '--rm', '-i', '--network', 'none', '--pids-limit', '64', '--memory', '256m',
          '-v', `${path.dirname(filePath)}:${workDir}`,
          '-w', workDir,
          dockerImage,
          './submission.out'], input, timeoutMs);
      }

      dockerArgs.push(commands[language].command, containerFile);
      return await runProcess('docker', dockerArgs, input, timeoutMs);
    }

    if (language === 'cpp') {
      const compileResult = await runProcess(commands.cpp.build, commands.cpp.buildArgs, '', timeoutMs);
      if (compileResult.stderr || compileResult.timedOut) {
        await cleanupFile(filePath);
        return compileResult;
      }
      const result = await runProcess(commands.cpp.run, [], input, timeoutMs);
      await cleanupFile(commands.cpp.run).catch(() => {});
      return result;
    }

    return await runProcess(commands[language].command, commands[language].args, input, timeoutMs);
  } finally {
    await cleanupFile(filePath);
  }
};

module.exports = { executeCode };
