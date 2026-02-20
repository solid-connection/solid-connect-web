import { axiosInstance } from "@/lib/api/client";

export interface MentorApplicationListParams {
	page?: number;
	size?: number;
	mentorApplicationStatus?: string;
	nickname?: string;
	createdAt?: string;
}

export interface RegionPayload {
	code?: string;
	koreanName: string;
}

export interface CountryPayload {
	code?: string;
	koreanName: string;
	regionCode: string;
}

export const adminApi = {
	getMentorApplicationList: (params: MentorApplicationListParams) =>
		axiosInstance.get("/admin/mentor-applications", { params }).then((res) => res.data),

	getCountMentorApplicationByStatus: () =>
		axiosInstance.get("/admin/mentor-applications/count").then((res) => res.data),

	getMentorApplicationHistoryList: (siteUserId: string | number) =>
		axiosInstance.get(`/admin/mentor-applications/${siteUserId}/history`).then((res) => res.data),

	postApproveMentorApplication: (mentorApplicationId: string | number) =>
		axiosInstance.post(`/admin/mentor-applications/${mentorApplicationId}/approve`, {}).then((res) => res.data),

	postRejectMentorApplication: (mentorApplicationId: string | number, rejectedReason: string) =>
		axiosInstance
			.post(`/admin/mentor-applications/${mentorApplicationId}/reject`, { rejectedReason })
			.then((res) => res.data),

	postMappingMentorapplicationUniversity: (mentorApplicationId: string | number, universityId: number) =>
		axiosInstance
			.post(`/admin/mentor-applications/${mentorApplicationId}/assign-university`, { universityId })
			.then((res) => res.data),

	get권역조회: () => axiosInstance.get("/admin/regions").then((res) => res.data),

	post권역생성: (data: RegionPayload) => axiosInstance.post("/admin/regions", data).then((res) => res.data),

	put권역수정: (code: string, data: RegionPayload) =>
		axiosInstance.put(`/admin/regions/${code}`, data).then((res) => res.data),

	delete권역삭제: (code: string) => axiosInstance.delete(`/admin/regions/${code}`).then((res) => res.data),

	get지역조회: () => axiosInstance.get("/admin/countries").then((res) => res.data),

	post지역생성: (data: CountryPayload) => axiosInstance.post("/admin/countries", data).then((res) => res.data),

	put지역수정: (code: string, data: CountryPayload) =>
		axiosInstance.put(`/admin/countries/${code}`, data).then((res) => res.data),

	delete지역삭제: (code: string) => axiosInstance.delete(`/admin/countries/${code}`).then((res) => res.data),
};
