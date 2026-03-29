import { Queue, Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { executeBatch, compareOutputs } from './codeExecutor.js';
import Submission from '../models/Submission.js';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

// ─── Queue ────────────────────────────────────────────────────────────────────
export const submissionQueue = new Queue('code-submissions', {
  connection,
  defaultJobOptions: {
    attempts: 1,               // Don't retry — wrong code will always be wrong
    removeOnComplete: { count: 200, age: 24 * 3600 },
    removeOnFail:    { count: 200 },
  },
});

// ─── Worker ───────────────────────────────────────────────────────────────────
const worker = new Worker(
  'code-submissions',
  async (job) => {
    const {
      submissionId, submissionMongoId,
      code, language,
      testCases, timeLimit, memoryLimit,
    } = job.data;

    console.log(`▶  Processing ${submissionId} | lang=${language} | tests=${testCases.length}`);

    const results = {
      submissionId,
      verdict:     null,
      passedTests: 0,
      totalTests:  testCases.length,
      testResults: [],
      maxRuntime:  0,
    };

    // ONE container runs every test case
    const batchResults = await executeBatch({
      submissionId,
      code,
      language,
      testCases,
      timeLimit:   timeLimit   ?? 2000,
      memoryLimit: memoryLimit ?? 128,
    });

    // Compile error: same for every test
    if (batchResults.length > 0 && batchResults[0].compileError) {
      const errMsg = batchResults[0].compileError;
      results.verdict = 'Compile Error';
      for (let j = 0; j < testCases.length; j++) {
        results.testResults.push(makeResult(j, testCases[j], false, '', 0, `Compile Error: ${errMsg}`));
      }
    } else {
      for (let i = 0; i < batchResults.length; i++) {
        const r        = batchResults[i];
        const testCase = testCases[i];

        await job.updateProgress({ submissionId, currentTest: i + 1, totalTests: testCases.length });
        results.maxRuntime = Math.max(results.maxRuntime, r.runtime ?? 0);

        if (r.timedOut) {
          results.testResults.push(makeResult(i, testCase, false, '', r.runtime, 'Time Limit Exceeded'));
          if (!results.verdict) results.verdict = 'Time Limit Exceeded';
          continue;
        }

        if (r.exitCode !== 0) {
          const errMsg = (r.stderr || 'Runtime Error').substring(0, 300);
          results.testResults.push(makeResult(i, testCase, false, '', r.runtime, `Runtime Error: ${errMsg}`));
          if (!results.verdict) results.verdict = 'Runtime Error';
          continue;
        }

        const actual   = (r.stdout ?? '').trim();
        const expected = (testCase.expectedOutput ?? '').trim();
        const passed   = compareOutputs(actual, expected);

        results.testResults.push(makeResult(i, testCase, passed, actual, r.runtime));

        if (passed) {
          results.passedTests++;
        } else {
          if (!results.verdict) results.verdict = 'Wrong Answer';
        }
      }
    }

    if (!results.verdict) results.verdict = 'Accepted';

    if (submissionMongoId) {
      try {
        const sub = await Submission.findById(submissionMongoId);
        if (sub) {
          sub.testResults = results.testResults;
          sub.passedTests = results.passedTests;
          sub.totalTests  = results.totalTests;
          sub.score       = results.totalTests > 0
            ? Math.round((results.passedTests / results.totalTests) * 100)
            : 0;
          sub.status = results.verdict === 'Accepted' ? 'submitted' : 'evaluated';
          await sub.save();
        }
      } catch (err) {
        console.error('Failed to save submission results:', err.message);
      }
    }

    console.log(`✅ ${submissionId} → ${results.verdict} (${results.passedTests}/${results.totalTests})`);
    return results;
  },
  {
    connection,
    concurrency: parseInt(process.env.MAX_CONCURRENT_JOBS ?? '3'),
  }
);

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});

export { worker };

// ─── Helper: build a test result object ──────────────────────────────────────

function makeResult(index, testCase, passed, actualOutput, runtimeMs, errorMsg) {
  return {
    testCaseIndex:  index,
    testId:         testCase.id ?? testCase._id?.toString() ?? `test_${index}`,
    passed,
    isHidden:       testCase.isHidden ?? false,
    input:          testCase.isHidden ? null : (testCase.input ?? ''),
    expectedOutput: testCase.isHidden ? null : (testCase.expectedOutput ?? ''),
    actualOutput:   testCase.isHidden ? null : actualOutput,
    executionTime:  typeof runtimeMs === 'number' ? runtimeMs : 0,
    error:          errorMsg ?? (passed ? null : 'Wrong Answer'),
  };
}
