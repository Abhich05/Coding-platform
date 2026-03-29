import axiosInstance from "./axiosInstance";

export const adminService = {
    getStats: async () => {
        const res = await axiosInstance.get("/admin/stats");
        return res.data?.data ?? res.data;
    },
    getUsers: async () => {
        const res = await axiosInstance.get("/admin/users");
        return res.data?.data ?? res.data;
    },
    createTest: async (payload: any) => {
        const res = await axiosInstance.post("/admin/tests", payload);
        return res.data?.data ?? res.data;
    },
    listTests: async () => {
        const res = await axiosInstance.get("/admin/tests");
        return res.data?.data ?? res.data;
    },
    getTestResults: async (testId: string) => {
        const res = await axiosInstance.get(`/admin/tests/${testId}/results`);
        return res.data?.data ?? res.data;
    },
    sendTestLink: async (testId: string, email: string) => {
        const res = await axiosInstance.post(`/admin/tests/${testId}/send-link`, { email });
        return res.data?.data ?? res.data;
    },
};
