import { useState, useCallback, useEffect, useRef } from 'react';
import { Problem, TestResult } from '@/types/assessment';
import { ProblemPanel } from './ProblemPanel';
import { CodeEditor } from './CodeEditor';
import { TestResults } from './TestResults';
import { Timer } from './Timer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { submissionService } from '@/services/submissionService';
import { useSubmissionStatus } from '@/hooks/useSubmissionStatus';
import { toast } from 'sonner';

interface AssessmentInterfaceProps {
  problems: Problem[];
  duration: number;
  onComplete: () => void;
  assessmentId?: string;
  candidateEmail?: string;
}

export function AssessmentInterface({ problems, duration, onComplete, assessmentId, candidateEmail }: AssessmentInterfaceProps) {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(null);
  const [currentSubmissionMongoId, setCurrentSubmissionMongoId] = useState<string | null>(null);
  // Prevents polling from showing a toast after WebSocket already resolved the result.
  const resultsReceivedRef = useRef(false);

  const currentProblem = problems[currentProblemIndex];

  // Clear results whenever the user navigates to a different problem.
  useEffect(() => {
    setResults([]);
    setIsRunning(false);
    setVerdict(null);
    setCurrentSubmissionId(null);
    setCurrentSubmissionMongoId(null);
    resultsReceivedRef.current = false;
  }, [currentProblemIndex]);
  
  // WebSocket connection for real-time updates
  const { status: submissionStatus } = useSubmissionStatus(currentSubmissionId);

  // Listen for WebSocket updates
  useEffect(() => {
    if (!submissionStatus) return;

    if (submissionStatus.type === 'progress') {
      // Show progress (optional - can add progress UI)
      console.log('Progress:', submissionStatus.progress);
    } else if (submissionStatus.type === 'completed') {
      // Extract and display results
      const result = submissionStatus.result;
      if (result?.testResults) {
        resultsReceivedRef.current = true;
        const testResults: TestResult[] = result.testResults.map((r: any, idx: number) => ({
          testCaseId: r.testId || r.testCaseIndex?.toString() || String(idx),
          passed: r.passed,
          expectedOutput: r.expectedOutput || r.expected || '',
          actualOutput: r.actualOutput || r.actual || '',
          executionTime: r.executionTime || r.runtime || 0,
          error: r.error,
        }));
        
        setResults(testResults);
        setVerdict(result.verdict ?? null);
        setIsRunning(false);
        
        const passedCount = testResults.filter(r => r.passed).length;
        const allPassed = passedCount === testResults.length;
        if (allPassed) {
          toast.success('All tests passed!', {
            description: `${passedCount}/${testResults.length} test cases passed`,
          });
        } else {
          toast.info('Some tests failed', {
            description: `${passedCount}/${testResults.length} test cases passed`,
          });
        }
      }
    } else if (submissionStatus.type === 'failed') {
      setIsRunning(false);
      toast.error('Execution failed', {
        description: submissionStatus.error || 'Please try again',
      });
    }
  }, [submissionStatus]);

  // Polling fallback
  useEffect(() => {
    if (!currentSubmissionMongoId || !isRunning) return;

    const pollInterval = setInterval(async () => {
      // Skip if WebSocket already delivered the results.
      if (resultsReceivedRef.current) {
        clearInterval(pollInterval);
        return;
      }
      try {
        const response = await submissionService.getSubmissionResult(currentSubmissionMongoId);
        if (response.success && response.data.testResults && response.data.testResults.length > 0) {
          resultsReceivedRef.current = true;
          const testResults: TestResult[] = response.data.testResults.map((r: any, idx: number) => ({
            testCaseId: r.testId || r.testCaseIndex?.toString() || String(idx),
            passed: r.passed,
            expectedOutput: r.expectedOutput || '',
            actualOutput: r.actualOutput || '',
            executionTime: r.executionTime || 0,
            error: r.error,
          }));
          
          setResults(testResults);
          setVerdict(response.data.verdict ?? null);
          setIsRunning(false);
          clearInterval(pollInterval);
          
          const passedCount = testResults.filter(r => r.passed).length;
          const allPassed = passedCount === testResults.length;
          if (allPassed) {
            toast.success('All tests passed!', {
              description: `${passedCount}/${testResults.length} test cases passed`,
            });
          } else {
            toast.info('Some tests failed', {
              description: `${passedCount}/${testResults.length} test cases passed`,
            });
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 1000); // Poll every second

    // Clear interval after 30 seconds (timeout)
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
      if (isRunning) {
        setIsRunning(false);
        toast.error('Execution timeout', {
          description: 'Please try again',
        });
      }
    }, 30000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [currentSubmissionMongoId, isRunning]);

  const runTests = useCallback(async (code: string, language: string, isSubmit: boolean) => {
    if (!assessmentId || !candidateEmail) {
      // Admin preview / demo mode — submit without a candidate session
      // We still need a candidate email to queue the job, so use a placeholder
      return simulateDemoResults(code, language, isSubmit);
    }

    setIsRunning(true);
    setResults([]);
    setVerdict(null);
    setCurrentSubmissionId(null);
    setCurrentSubmissionMongoId(null);
    resultsReceivedRef.current = false;

    try {
      const response = await submissionService.submitCode({
        assessmentId,
        candidateEmail,
        problemId: currentProblem.id,
        code,
        language,
        runOnly: !isSubmit, // Run button = only visible tests; Submit = all tests
      });

      if (response.success) {
        // Set submission IDs for WebSocket subscription and polling
        setCurrentSubmissionId(response.data.submissionId);
        setCurrentSubmissionMongoId(response.data.submissionMongoId);
        
        toast.info('Code submitted', {
          description: 'Executing test cases...',
        });
      }
    } catch (error: any) {
      setIsRunning(false);
      toast.error('Submission failed', {
        description: error.response?.data?.message || 'Please try again',
      });
    }
  }, [currentProblem, assessmentId, candidateEmail]);

  const simulateDemoResults = useCallback(async (code: string, language: string, isSubmit: boolean) => {
    setIsRunning(true);
    setResults([]);
    setVerdict(null);

    // Admin preview mode: no candidate session, so we can't execute code.
    // Show test cases as "not executed" and guide the user.
    await new Promise(resolve => setTimeout(resolve, 400));

    const testCases = isSubmit
      ? currentProblem.testCases
      : currentProblem.testCases.filter(tc => !tc.isHidden);

    const previewResults: TestResult[] = testCases.map((tc, i) => ({
      testCaseId: tc.id || String(i),
      passed: false,
      expectedOutput: tc.expectedOutput,
      actualOutput: '',
      executionTime: 0,
      error: 'Preview mode — test execution requires a candidate session.',
    }));

    setResults(previewResults);
    setIsRunning(false);

    toast.info('Preview mode', {
      description: 'Code execution is only available in a live candidate session. Share the assessment link with a candidate to run real tests.',
    });
  }, [currentProblem]);

  const handleRun = (code: string, language: string) => {
    runTests(code, language, false);
  };

  const handleSubmit = (code: string, language: string) => {
    runTests(code, language, true);
  };

  const handleTimeUp = () => {
    onComplete();
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">TA</span>
            </div>
            <span className="font-semibold text-foreground">TechAssess</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <List className="w-4 h-4" />
              Problems
            </Button>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {problems.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentProblemIndex(i)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    i === currentProblemIndex
                      ? 'bg-primary text-primary-foreground'
                      : completedProblems.has(p.id)
                        ? 'bg-success/10 text-success border border-success/30'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Timer duration={duration} onTimeUp={handleTimeUp} />
          <Button variant="gradient" onClick={onComplete}>
            Finish Assessment
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={35} minSize={25}>
            <ProblemPanel problem={currentProblem} />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={65}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={65}>
                <CodeEditor
                  problem={currentProblem}
                  onRun={handleRun}
                  onSubmit={handleSubmit}
                  isRunning={isRunning}
                />
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={35} minSize={20}>
                <TestResults
                  testCases={currentProblem.testCases}
                  results={results}
                  isRunning={isRunning}
                  verdict={verdict}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Footer Navigation */}
      <footer className="flex items-center justify-between px-4 py-3 border-t border-border bg-card">
        <Button
          variant="outline"
          onClick={() => setCurrentProblemIndex(i => Math.max(0, i - 1))}
          disabled={currentProblemIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Problem {currentProblemIndex + 1} of {problems.length}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentProblemIndex(i => Math.min(problems.length - 1, i + 1))}
          disabled={currentProblemIndex === problems.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </footer>
    </div>
  );
}
