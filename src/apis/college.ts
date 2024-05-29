import apiClient from "@/lib/axiosClient";

const getCollegeDetail = async (collegeId: number) => {
  return await apiClient.get(`/colleges/${collegeId}`);
};
