import apiClient from "../lib/apiClient";

export const testService = {
    getTestByCode: async (code: string) => {
        const res = await apiClient.get(`/tests/${code}`);
        return res.data?.data ?? res.data;
    },
    submitTest: async (code: string, payload: { answers: string[]; durationSeconds: number }) => {
        const res = await apiClient.post(`/tests/${code}/submit`, payload);
        return res.data?.data ?? res.data;
    },
};
