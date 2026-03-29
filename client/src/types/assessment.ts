export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Example {
  id?: string;
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  constraints: string[] | { timeLimit: number; memoryLimit: number };
  examples: Example[];
  testCases: TestCase[];
  starterCode: string | {
    javascript?: string;
    python?: string;
    java?: string;
    cpp?: string;
    typescript?: string;
  };
  language?: string;
  tags?: string[];
  timeLimit?: number; // in minutes
}

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  executionTime: number;
  error?: string;
}

export interface Submission {
  id: string;
  problemId: string;
  code: string;
  language: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'error';
  results: TestResult[];
  submittedAt: Date;
  score: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  status: 'invited' | 'in-progress' | 'completed' | 'evaluated';
  score?: number;
  submittedAt?: Date;
  timeSpent?: number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  problems: Problem[];
  duration: number; // in minutes
  createdAt: Date;
  candidates: Candidate[];
  status: 'draft' | 'active' | 'closed';
}
