import apiClient from '../lib/apiClient';

export interface SubmissionData {
  assessmentId: string;
  candidateEmail: string;
  problemId: string;
  code: string;
  language: string;
  runOnly?: boolean; // true = "Run" button (visible tests only), false/undefined = "Submit" (all tests)
}

export const submissionService = {
  async submitCode(data: SubmissionData) {
    const response = await apiClient.post('/submissions', data);
    return response.data;
  },

  async getSubmissionResult(submissionMongoId: string) {
    const response = await apiClient.get(`/submissions/result/${submissionMongoId}`);
    return response.data;
  },

  async getCandidateSubmissions(assessmentId: string, email: string) {
    const response = await apiClient.get(`/submissions/assessment/${assessmentId}/candidate/${email}`);
    return response.data;
  },

  async getAssessmentSubmissions(assessmentId: string) {
    const response = await apiClient.get(`/submissions/assessment/${assessmentId}`);
    return response.data;
  },

  async completeAssessment(data: { assessmentId: string; candidateEmail: string; timeSpent: number }) {
    const response = await apiClient.post('/submissions/complete', data);
    return response.data;
  },

  async flagActivity(data: { 
    assessmentId: string; 
    candidateEmail: string; 
    problemId: string; 
    activityType: 'tabSwitch' | 'copyPaste';
  }) {
    const response = await apiClient.post('/submissions/flag', data);
    return response.data;
  },
};
