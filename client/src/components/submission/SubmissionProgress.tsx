import { useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { useSubmissionStatus } from '@/hooks/useSubmissionStatus';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface SubmissionProgressProps {
  submissionId: string | null;
  onClose: () => void;
}

export function SubmissionProgress({ submissionId, onClose }: SubmissionProgressProps) {
  const { status, isConnected } = useSubmissionStatus(submissionId);

  useEffect(() => {
    // Auto-close after showing results for 3 seconds
    if (status?.status === 'completed') {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status?.status, onClose]);

  if (!submissionId) return null;

  return (
    <Dialog open={!!submissionId} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              {status?.status === 'completed' ? 'Results' : 'Evaluating Your Submission'}
            </h3>
            {!isConnected && (
              <p className="text-sm text-yellow-600 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Connecting to server...
              </p>
            )}
          </div>

          {/* Running State */}
          {status?.status === 'running' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Running test cases...</span>
                <span className="font-mono font-semibold">
                  {status.progress?.currentTest || 0} / {status.progress?.totalTests || 0}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 transition-all duration-500 ease-out"
                  style={{
                    width: `${((status.progress?.currentTest || 0) / (status.progress?.totalTests || 1)) * 100}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing code in secure sandbox...</span>
              </div>
            </div>
          )}

          {/* Queued State */}
          {status?.status === 'queued' && (
            <div className="flex flex-col items-center gap-4 py-6">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              <p className="text-sm text-gray-600">Your submission is queued...</p>
            </div>
          )}

          {/* Completed State - Accepted */}
          {status?.status === 'completed' && status.result?.verdict === 'Accepted' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto animate-in zoom-in duration-300" />
              <div>
                <h4 className="text-2xl font-bold text-green-600 mb-1">Accepted!</h4>
                <p className="text-sm text-gray-600">All test cases passed</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Runtime</span>
                  </div>
                  <div className="font-bold text-lg">{status.result.runtime}ms</div>
                  {status.result.runtimePercentile && (
                    <div className="text-xs text-gray-500 mt-1">
                      Beats {status.result.runtimePercentile}%
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <span>Memory</span>
                  </div>
                  <div className="font-bold text-lg">
                    {(status.result.memory / 1024).toFixed(2)} MB
                  </div>
                  {status.result.memoryPercentile && (
                    <div className="text-xs text-gray-500 mt-1">
                      Beats {status.result.memoryPercentile}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Completed State - Failed */}
          {status?.status === 'completed' && status.result?.verdict !== 'Accepted' && (
            <div className="text-center space-y-4">
              <XCircle className="w-16 h-16 text-red-500 mx-auto animate-in zoom-in duration-300" />
              <div>
                <h4 className="text-2xl font-bold text-red-600 mb-1">{status.result?.verdict}</h4>
                <p className="text-sm text-gray-600">
                  Passed {status.result?.passedTests || 0} / {status.result?.totalTests || 0} test cases
                </p>
              </div>

              {status.result?.verdict === 'Wrong Answer' && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-left text-sm">
                  <p className="font-semibold text-red-700 mb-2">First Failed Test:</p>
                  <p className="text-gray-700">
                    Test Case #{(status.result as any).firstFailure?.testNumber}
                  </p>
                  {!(status.result as any).firstFailure?.isHidden && (
                    <div className="mt-3 space-y-2">
                      <div>
                        <span className="text-gray-600">Input:</span>
                        <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-x-auto">
                          {(status.result as any).firstFailure?.input}
                        </pre>
                      </div>
                      <div>
                        <span className="text-gray-600">Expected:</span>
                        <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-x-auto">
                          {(status.result as any).firstFailure?.expected}
                        </pre>
                      </div>
                      <div>
                        <span className="text-gray-600">Got:</span>
                        <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-x-auto">
                          {(status.result as any).firstFailure?.actual}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {status.result?.verdict === 'Time Limit Exceeded' && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm">
                  <p className="text-yellow-800">
                    Your code took too long to execute. Try optimizing your algorithm.
                  </p>
                </div>
              )}

              {status.result?.verdict === 'Runtime Error' && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-sm">
                  <p className="text-red-800 font-semibold mb-2">Error:</p>
                  <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                    {(status.result as any).firstFailure?.error}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Failed State */}
          {status?.status === 'failed' && (
            <div className="text-center space-y-4 py-6">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              <div>
                <h4 className="text-xl font-bold text-red-600 mb-1">Submission Failed</h4>
                <p className="text-sm text-gray-600">{status.error || 'An unexpected error occurred'}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
