import { forwardRef } from 'react';
import { TestResult, TestCase } from '@/types/assessment';
import { CheckCircle, XCircle, Clock, Loader2, EyeOff, AlertTriangle, Timer, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TestResultsProps {
  testCases: TestCase[];
  results: TestResult[];
  isRunning: boolean;
  verdict?: string | null;
}

/** Classify the error string into a display label */
function errorKind(error?: string): 'compile' | 'runtime' | 'tle' | 'wrong' | null {
  if (!error) return null;
  const e = error.toLowerCase();
  if (e.includes('compile error') || e.includes('compilation failed')) return 'compile';
  if (e.includes('time limit')) return 'tle';
  if (e.includes('runtime error') || e.includes('segmentation') || e.includes('exception')) return 'runtime';
  return 'wrong';
}

function ErrorBadge({ kind }: { kind: ReturnType<typeof errorKind> }) {
  if (!kind) return null;
  const map = {
    compile: { label: 'Compile Error', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: <AlertTriangle className="w-3 h-3" /> },
    runtime: { label: 'Runtime Error', cls: 'bg-orange-500/10 text-orange-400 border-orange-500/30', icon: <Zap className="w-3 h-3" /> },
    tle:     { label: 'Time Limit',    cls: 'bg-blue-500/10   text-blue-400   border-blue-500/30',   icon: <Timer className="w-3 h-3" /> },
    wrong:   { label: 'Wrong Answer',  cls: 'bg-destructive/10 text-destructive border-destructive/30', icon: <XCircle className="w-3 h-3" /> },
  };
  const { label, cls, icon } = map[kind];
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border', cls)}>
      {icon}{label}
    </span>
  );
}

export const TestResults = forwardRef<HTMLDivElement, TestResultsProps>(
  function TestResults({ testCases, results, isRunning, verdict }, ref) {
    const passedCount = results.filter(r => r.passed).length;
    const allPassed   = results.length > 0 && passedCount === results.length;

    // Check if every result is a compile error (show once at top, not per-test)
    const firstError = results[0]?.error ?? '';
    const isCompileError = firstError.toLowerCase().includes('compile error');

    return (
      <div ref={ref} className="flex flex-col h-full bg-card border-t border-border">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-foreground">Test Results</h3>
            {results.length > 0 && !isRunning && (
              <span className={cn(
                'text-sm font-medium px-2 py-0.5 rounded-full',
                allPassed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
              )}>
                {passedCount}/{results.length} Passed
              </span>
            )}
          </div>
          {isRunning ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Running tests…
            </div>
          ) : verdict && !allPassed && results.length > 0 ? (
            <span className={cn(
              'text-xs font-semibold px-3 py-1 rounded-full border',
              verdict === 'Accepted'
                ? 'bg-success/10 text-success border-success/30'
                : 'bg-destructive/10 text-destructive border-destructive/30',
            )}>
              {verdict}
            </span>
          ) : null}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">

            {/* ── Compile error: show once, covers all tests ──────────── */}
            {isCompileError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-sm text-yellow-400">Compile Error</span>
                </div>
                <pre className="text-xs text-yellow-300/80 font-mono whitespace-pre-wrap leading-relaxed">
                  {firstError.replace(/^Compile Error:\s*/i, '')}
                </pre>
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {testCases.map((testCase, index) => {
                const result = results.find(r => r.testCaseId === testCase.id)
                  ?? (index < results.length ? results[index] : undefined);

                // Skip per-case render for compile errors (already shown above)
                if (isCompileError) {
                  return (
                    <motion.div
                      key={testCase.id || `test-${index}`}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-yellow-400 shrink-0" />
                        <span className="font-medium text-sm text-foreground">Test Case {index + 1}</span>
                        {testCase.isHidden && <HiddenBadge />}
                        <span className="text-xs text-yellow-400/70 ml-auto">Not executed</span>
                      </div>
                    </motion.div>
                  );
                }

                const kind = result && !result.passed ? errorKind(result.error) : null;

                return (
                  <motion.div
                    key={testCase.id || `test-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.04 }}
                    className={cn(
                      'rounded-lg border p-3 transition-all',
                      result
                        ? result.passed
                          ? 'border-success/30 bg-success/5'
                          : kind === 'tle'     ? 'border-blue-500/30 bg-blue-500/5'
                          : kind === 'runtime' ? 'border-orange-500/30 bg-orange-500/5'
                          : 'border-destructive/30 bg-destructive/5'
                        : 'border-border bg-muted/30',
                    )}
                  >
                    {/* Row 1 – title / badges */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isRunning ? (
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        ) : result ? (
                          result.passed
                            ? <CheckCircle className="w-4 h-4 text-success shrink-0" />
                            : <XCircle    className="w-4 h-4 text-destructive shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                        <span className="font-medium text-sm text-foreground">
                          Test Case {index + 1}
                        </span>
                        {testCase.isHidden && <HiddenBadge />}
                        {result && !result.passed && kind && <ErrorBadge kind={kind} />}
                      </div>
                      {result && (
                        <span className="text-xs text-muted-foreground font-mono shrink-0">
                          {result.executionTime}ms
                        </span>
                      )}
                    </div>

                    {/* Row 2 – I/O grid (visible tests only) */}
                    {!testCase.isHidden && (
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <IOBlock label="Input"    value={testCase.input} />
                        <IOBlock label="Expected" value={testCase.expectedOutput} />

                        {result && !result.passed && (kind === 'runtime' || kind === 'tle') && (
                          <div className="col-span-2">
                            <span className={cn('font-medium', kind === 'tle' ? 'text-blue-400' : 'text-orange-400')}>
                              {kind === 'tle' ? 'Time Limit Exceeded' : 'Runtime Error'}
                            </span>
                            {result.error && kind !== 'tle' && (
                              <pre className="mt-1 p-2 rounded bg-orange-500/10 text-orange-300 font-mono overflow-x-auto whitespace-pre-wrap text-xs">
                                {result.error.replace(/^Runtime Error:\s*/i, '')}
                              </pre>
                            )}
                          </div>
                        )}

                        {result && !result.passed && kind === 'wrong' && (
                          <div className="col-span-2">
                            <span className="text-destructive font-medium">Your Output:</span>
                            <pre className="mt-1 p-2 rounded bg-destructive/10 text-destructive font-mono overflow-x-auto">
                              {result.actualOutput || '(no output)'}
                            </pre>
                          </div>
                        )}

                        {result && result.passed && result.actualOutput && (
                          <div className="col-span-2">
                            <span className="text-success font-medium">Your Output:</span>
                            <pre className="mt-1 p-2 rounded bg-success/10 text-success font-mono overflow-x-auto">
                              {result.actualOutput}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Hidden test summary */}
                    {testCase.isHidden && result && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {result.passed ? '✓ Hidden test passed' : '✗ Hidden test failed'}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {testCases.length === 0 && !isRunning && (
              <div className="text-center py-10 text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Click <strong>Run</strong> to execute visible test cases</p>
                <p className="text-xs mt-1 opacity-60">Click <strong>Submit</strong> to run all test cases including hidden ones</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }
);

// ── Small helpers ─────────────────────────────────────────────────────────────
function HiddenBadge() {
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
      <EyeOff className="w-3 h-3" />Hidden
    </span>
  );
}

function IOBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground font-medium">{label}:</span>
      <pre className="mt-1 p-2 rounded bg-editor text-editor-foreground font-mono overflow-x-auto text-xs">
        {value}
      </pre>
    </div>
  );
}
