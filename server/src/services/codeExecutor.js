import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const execPromise = promisify(exec);
const __dirname   = path.dirname(fileURLToPath(import.meta.url));

// ─── Docker images ────────────────────────────────────────────────────────────
const DOCKER_IMAGES = {
  python:     'python:3.10-slim',
  javascript: 'node:20-slim',
  typescript: 'node:20-slim',   // templates are valid JS — run with node
  java:       'openjdk:17-slim',
  cpp:        'gcc:12-slim',
};

const TEMP_BASE = path.join(__dirname, '../../temp');

// ─── Path helper ─────────────────────────────────────────────────────────────

/**
 * Docker Desktop on Windows (running docker.exe from PowerShell/cmd.exe)
 * needs forward-slash Windows paths:  C:\foo\bar  →  C:/foo/bar
 * On Linux/Mac this is a no-op.
 */
function toDockerPath(p) {
  if (process.platform !== 'win32') return p;
  return p.replace(/\\/g, '/');
}

// ─── Batch execution ─────────────────────────────────────────────────────────

/**
 * Run ALL test cases for a submission inside ONE Docker container.
 *
 * Workspace layout written to temp/sub_<id>/:
 *   code          – user's source (no extension), mounted read-only as /ws/code
 *   inputs/0.txt  – stdin for test 0
 *   inputs/1.txt  – stdin for test 1  … etc.
 *   runner.sh     – orchestrator script executed by the container
 *
 * Returns an array (same length as testCases) of:
 *   { index, stdout, stderr, exitCode, runtime, timedOut, compileError }
 */
export async function executeBatch({
  submissionId,
  code,
  language,
  testCases,
  timeLimit   = 2000,
  memoryLimit = 128,
}) {
  const workDir   = path.join(TEMP_BASE, `sub_${submissionId}`);
  const inputsDir = path.join(workDir, 'inputs');

  try {
    await fs.mkdir(inputsDir, { recursive: true });

    await fs.writeFile(path.join(workDir, 'code'), code, 'utf8');

    for (let i = 0; i < testCases.length; i++) {
      await fs.writeFile(
        path.join(inputsDir, `${i}.txt`),
        testCases[i].input ?? '',
        'utf8',
      );
    }

    const tlSec  = Math.max(1, Math.ceil(timeLimit / 1000));
    await fs.writeFile(
      path.join(workDir, 'runner.sh'),
      buildRunnerScript(language, testCases.length, tlSec),
      'utf8',
    );

    const image         = DOCKER_IMAGES[language] ?? 'node:20-slim';
    const containerName = `judge_${submissionId}`.replace(/[^a-zA-Z0-9_.-]/g, '_');
    // Outer wall-clock limit: per-test limit × count + 20 s overhead, max 5 min
    const outerMs = Math.min(timeLimit * testCases.length + 20_000, 5 * 60_000);

    const dockerCmd = [
      `docker run --name ${containerName} --rm`,
      `--memory ${memoryLimit}m`,
      `--memory-swap ${memoryLimit}m`,
      `--cpus 1.0`,
      `--pids-limit 128`,
      `--network none`,
      `--security-opt no-new-privileges`,
      `--tmpfs /tmp:size=128m,exec`,
      `-v "${toDockerPath(workDir)}:/ws:ro"`,
      `${image}`,
      `sh /ws/runner.sh`,
    ].join(' ');

    let rawOutput = '';
    try {
      const { stdout } = await execPromise(dockerCmd, {
        timeout:   outerMs,
        maxBuffer: 50 * 1024 * 1024,
      });
      rawOutput = stdout ?? '';
    } catch (err) {
      rawOutput = err.stdout ?? '';

      if (err.killed || err.code === 124 || err.signal === 'SIGTERM') {
        return testCases.map((_, i) => ({
          index: i, stdout: '', stderr: 'Execution timed out (global limit)',
          exitCode: 124, runtime: outerMs, timedOut: true, compileError: null,
        }));
      }

      const errMsg = ((err.stderr ?? '') + ' ' + (err.message ?? '')).trim().substring(0, 600);
      console.error(`[codeExecutor] Docker error for ${submissionId}:`, errMsg);
      return testCases.map((_, i) => ({
        index: i, stdout: '', stderr: `Infrastructure error: ${errMsg}`,
        exitCode: -1, runtime: 0, timedOut: false, compileError: null,
      }));
    }

    return parseRunnerOutput(rawOutput, testCases.length);
  } finally {
    fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

// ─── Runner script (executes INSIDE the Docker container) ───────────────────

function buildRunnerScript(language, numTests, tlSec) {
  const runCmd = {
    python:     'python -B /ws/code',
    javascript: 'node /ws/code',
    typescript: 'node /ws/code',
    java:       'java -cp /tmp Main',
    cpp:        '/tmp/bin',
  }[language] ?? 'node /ws/code';

  return `#!/bin/sh
# Generated runner — do not edit manually
NUMTESTS=${numTests}
TL=${tlSec}

# ── Compile (Java / C++ only) ────────────────────────────────────────────────
COMPILE_OK=1
case "${language}" in
  java)
    cp /ws/code /tmp/Main.java
    if ! javac -d /tmp /tmp/Main.java 2>/tmp/CE; then COMPILE_OK=0; fi
    ;;
  cpp)
    if ! g++ -O2 -std=c++17 -o /tmp/bin /ws/code 2>/tmp/CE; then COMPILE_OK=0; fi
    ;;
esac

if [ "$COMPILE_OK" -eq 0 ]; then
  printf '===COMPILE_ERROR===\\n'
  cat /tmp/CE
  printf '\\n===END===\\n'
  exit 0
fi

# ── Run each test case ────────────────────────────────────────────────────────
i=0
while [ "$i" -lt "$NUMTESTS" ]; do
  printf '===TEST_START=%d===\\n' "$i"
  ST=$(date +%s%3N 2>/dev/null || echo 0)

  timeout "$TL" ${runCmd} < "/ws/inputs/$i.txt" > /tmp/OUT 2>/tmp/ERR
  EC=$?

  ET=$(date +%s%3N 2>/dev/null || echo 0)
  RT=$(( ET - ST ))

  printf '===STDOUT===\\n'
  cat /tmp/OUT
  printf '\\n===STDERR===\\n'
  cat /tmp/ERR
  printf '\\n===META===%d===%d===\\n' "$EC" "$RT"
  printf '===TEST_END=%d===\\n' "$i"

  i=$(( i + 1 ))
done
printf '===DONE===\\n'
`;
}

// ─── Output parser ────────────────────────────────────────────────────────────

function parseRunnerOutput(raw, numTests) {
  if (raw.includes('===COMPILE_ERROR===')) {
    const after = raw.split('===COMPILE_ERROR===')[1] ?? '';
    const msg   = after.split('===END===')[0].trim().substring(0, 3000);
    return Array.from({ length: numTests }, (_, i) => ({
      index: i, stdout: '', stderr: msg,
      exitCode: 1, runtime: 0, timedOut: false, compileError: msg,
    }));
  }

  const results = [];
  for (let i = 0; i < numTests; i++) {
    const startTag = `===TEST_START=${i}===`;
    const endTag   = `===TEST_END=${i}===`;
    const si = raw.indexOf(startTag);
    const ei = raw.indexOf(endTag);

    if (si === -1 || ei === -1) {
      results.push({
        index: i, stdout: '', stderr: 'Test case did not execute',
        exitCode: -1, runtime: 0, timedOut: false, compileError: null,
      });
      continue;
    }

    const section  = raw.slice(si + startTag.length, ei);
    const soPos    = section.indexOf('===STDOUT===');
    const sePos    = section.indexOf('===STDERR===');
    const metaMatch = section.match(/===META===(-?\d+)===(\d+)===/);

    let stdout = '';
    if (soPos !== -1 && sePos !== -1) {
      stdout = section.slice(soPos + '===STDOUT==='.length, sePos);
      if (stdout.startsWith('\n')) stdout = stdout.slice(1);
      if (stdout.endsWith('\n'))   stdout = stdout.slice(0, -1);
    }

    let stderr = '';
    if (sePos !== -1 && metaMatch) {
      const metaPos = section.search(/===META===/);
      stderr = section.slice(sePos + '===STDERR==='.length, metaPos);
      if (stderr.startsWith('\n')) stderr = stderr.slice(1);
      if (stderr.endsWith('\n'))   stderr = stderr.slice(0, -1);
    }

    const exitCode = metaMatch ? parseInt(metaMatch[1], 10) : 0;
    const runtime  = metaMatch ? parseInt(metaMatch[2], 10) : 0;
    const timedOut = (exitCode === 124);

    results.push({
      index: i,
      stdout:  stdout.trim(),
      stderr:  stderr.trim().substring(0, 2000),
      exitCode,
      runtime,
      timedOut,
      compileError: null,
    });
  }
  return results;
}

// ─── Output comparison (exported for submissionQueue) ─────────────────────────

export function compareOutputs(actual, expected) {
  const normalise = (s) =>
    s.split('\n')
      .map((l) => l.trimEnd())
      .filter((l, i, a) => !(i === a.length - 1 && l === ''))
      .join('\n')
      .trim();

  const a = normalise(actual);
  const e = normalise(expected);

  if (a === e) return true;

  try { if (jsonEqual(JSON.parse(a), JSON.parse(e))) return true; } catch (_) {}

  if (a.toLowerCase() === e.toLowerCase()) return true;

  const aL = a.split('\n');
  const eL = e.split('\n');
  if (aL.length === eL.length && aL.every((al, i) => floatLineEq(al.trim(), eL[i].trim()))) return true;

  return false;
}

function jsonEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a === 'number') return Math.abs(a - b) < 1e-6;
  if (Array.isArray(a) && Array.isArray(b))
    return a.length === b.length && a.every((v, i) => jsonEqual(v, b[i]));
  if (a && b && typeof a === 'object') {
    const ka = Object.keys(a).sort();
    const kb = Object.keys(b).sort();
    return ka.join() === kb.join() && ka.every((k) => jsonEqual(a[k], b[k]));
  }
  return false;
}

function floatLineEq(a, b) {
  const na = parseFloat(a), nb = parseFloat(b);
  if (!isNaN(na) && !isNaN(nb) && String(na) === a && String(nb) === b)
    return Math.abs(na - nb) < 1e-6;
  return a === b;
}

