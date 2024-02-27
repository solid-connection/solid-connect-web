import createApiClient from "@/lib/clientApiClient";

const apiClient = createApiClient();

const getCollegeDetail = async (collegeId: number) => {
  return await apiClient.get(`/colleges/${collegeId}`);
};
