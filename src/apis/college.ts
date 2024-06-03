import apiClient from "@/utils/axiosClient";

const getCollegeDetail = async (collegeId: number) => {
  return await apiClient.get(`/colleges/${collegeId}`);
};
