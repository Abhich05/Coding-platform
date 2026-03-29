import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TestCase {
  testId: string;
  passed: boolean;
  runtime: number;
  memory: number;
  isHidden: boolean;
  input?: string;
  expected?: string;
  actual?: string;
  errorMessage?: string;
}

interface TestCaseResultsProps {
  results: TestCase[];
}

export function TestCaseResults({ results }: TestCaseResultsProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No test results available</p>
      </div>
    );
  }

  const activeResult = results[activeTab];

  return (
    <div className="border rounded-lg bg-white">
      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
        {results.map((result, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`
              px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors
              ${
                activeTab === idx
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <span>Test Case {idx + 1}</span>
            {result.passed ? (
              <CheckCircle className="inline ml-2 w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="inline ml-2 w-4 h-4 text-red-500" />
            )}
            {result.isHidden && (
              <EyeOff className="inline ml-1 w-3 h-3 text-gray-400" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeResult.isHidden ? (
          <div className="text-center py-12">
            <EyeOff className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h4 className="font-semibold text-gray-700 mb-2">Hidden Test Case</h4>
            <p className="text-sm text-gray-500">
              Input and output are not visible for this test case
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm">
              <span className={`font-semibold ${activeResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                {activeResult.passed ? 'Passed ✓' : 'Failed ✗'}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <div
                className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold
                ${
                  activeResult.passed
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }
              `}
              >
                {activeResult.passed ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Passed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span>Failed</span>
                  </>
                )}
              </div>

              <div className="flex gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">{activeResult.runtime}ms</span>
                </div>
                <div>
                  <span className="font-mono">{(activeResult.memory / 1024).toFixed(2)} MB</span>
                </div>
              </div>
            </div>

            {/* Input */}
            {activeResult.input && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Input</label>
                <pre className="p-4 bg-gray-50 rounded-lg border text-sm font-mono overflow-x-auto">
                  {activeResult.input}
                </pre>
              </div>
            )}

            {/* Expected Output */}
            {activeResult.expected && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Expected Output
                </label>
                <pre className="p-4 bg-gray-50 rounded-lg border text-sm font-mono overflow-x-auto">
                  {activeResult.expected}
                </pre>
              </div>
            )}

            {/* Actual Output */}
            {activeResult.actual !== undefined && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Your Output
                </label>
                <pre
                  className={`
                  p-4 rounded-lg border text-sm font-mono overflow-x-auto
                  ${
                    activeResult.passed
                      ? 'bg-green-50 border-green-300'
                      : 'bg-red-50 border-red-300'
                  }
                `}
                >
                  {activeResult.actual || '(empty output)'}
                </pre>
              </div>
            )}

            {/* Error Message */}
            {activeResult.errorMessage && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-yellow-800 mb-1">Note:</p>
                <p className="text-sm text-yellow-700">{activeResult.errorMessage}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
