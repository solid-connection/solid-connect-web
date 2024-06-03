import apiClient from "@/libs/axiosClient";

const getCollegeDetail = async (collegeId: number) => {
  return await apiClient.get(`/colleges/${collegeId}`);
};
