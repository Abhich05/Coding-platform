import apiClient from "../lib/apiClient";

export const adminService = {
    getStats: async () => {
        const res = await apiClient.get("/admin/stats");
        return res.data?.data ?? res.data;
    },
    getUsers: async () => {
        const res = await apiClient.get("/admin/users");
        return res.data?.data ?? res.data;
    },
    createTest: async (payload: any) => {
        const res = await apiClient.post("/admin/tests", payload);
        return res.data?.data ?? res.data;
    },
    listTests: async () => {
        const res = await apiClient.get("/admin/tests");
        return res.data?.data ?? res.data;
    },
    getTestResults: async (testId: string) => {
        const res = await apiClient.get(`/admin/tests/${testId}/results`);
        return res.data?.data ?? res.data;
    },
    sendTestLink: async (testId: string, email: string) => {
        const res = await apiClient.post(`/admin/tests/${testId}/send-link`, { email });
        return res.data?.data ?? res.data;
    },
};
