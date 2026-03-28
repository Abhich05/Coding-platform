import axiosInstance from "./axiosInstance";

export const testService = {
    getTestByCode: async (code: string) => {
        const res = await axiosInstance.get(`/tests/${code}`);
        return res.data?.data ?? res.data;
    },
    submitTest: async (code: string, payload: { answers: string[]; durationSeconds: number }) => {
        const res = await axiosInstance.post(`/tests/${code}/submit`, payload);
        return res.data?.data ?? res.data;
    },
};
