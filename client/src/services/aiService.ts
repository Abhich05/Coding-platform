import apiClient from '../lib/apiClient';

export interface GenerateProblemRequest {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
}

export interface GenerateTestCasesRequest {
  title: string;
  description: string;
  language: string;
  starterCode?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface GeneratedProblem {
  title: string;
  description: string;
  difficulty: string;
  language: string;
  starterCode: string;
  tags: string[];
  testCases: TestCase[];
}

const aiService = {
  generateProblem: async (data: GenerateProblemRequest): Promise<GeneratedProblem> => {
    const response = await apiClient.post('/ai/generate-problem', data);
    return response.data.data;
  },

  generateTestCases: async (data: GenerateTestCasesRequest): Promise<TestCase[]> => {
    const response = await apiClient.post('/ai/generate-testcases', data);
    return response.data.data;
  },

  enhanceDescription: async (description: string): Promise<string> => {
    const response = await apiClient.post('/ai/enhance-description', { description });
    return response.data.data;
  },
};

export default aiService;
