import { axiosInstance } from "@/lib/api/client";
import type {
	MentorApplicationHistoryResponse,
	MentorApplicationPageResponse,
	MentorApplicationStatus,
} from "@/types/mentorApplications";

export interface AdminCollectionResponse<T> {
	content?: T[];
	data?: T[];
	items?: T[];
	result?: T[];
}

export type AdminCollection<T> = T[] | AdminCollectionResponse<T>;

export interface MentorApplicationCountItem {
	mentorApplicationStatus?: MentorApplicationStatus | string | null;
	status?: MentorApplicationStatus | string | null;
	name?: string | null;
	count?: number | string | null;
	total?: number | string | null;
	value?: number | string | null;
}

export type MentorApplicationCountResponse =
	| Partial<Record<MentorApplicationStatus, number | string | MentorApplicationCountItem>>
	| MentorApplicationCountItem[]
	| AdminCollectionResponse<MentorApplicationCountItem>;

export interface MentorApplicationListParams {
	page?: number;
	size?: number;
	mentorApplicationStatus?: MentorApplicationStatus;
	nickname?: string;
	createdAt?: string;
}

export interface RegionResponse {
	code?: string | null;
	regionCode?: string | null;
	koreanName?: string | null;
	name?: string | null;
}

export interface RegionPayload {
	code?: string;
	koreanName: string;
}

export interface CountryResponse {
	code?: string | null;
	koreanName?: string | null;
	name?: string | null;
	regionCode?: string | null;
	region?: string | RegionResponse | null;
}

export interface CountryPayload {
	code?: string;
	koreanName: string;
	regionCode: string;
}

const assignMentorApplicationUniversity = (mentorApplicationId: string | number, universityId: number) =>
	axiosInstance
		.post<void>(`/admin/mentor-applications/${mentorApplicationId}/assign-university`, { universityId })
		.then((res) => res.data);

export const adminApi = {
	getMentorApplicationList: (params: MentorApplicationListParams) =>
		axiosInstance.get<MentorApplicationPageResponse>("/admin/mentor-applications", { params }).then((res) => res.data),

	getCountMentorApplicationByStatus: () =>
		axiosInstance.get<MentorApplicationCountResponse>("/admin/mentor-applications/count").then((res) => res.data),

	getMentorApplicationHistoryList: (siteUserId: string | number) =>
		axiosInstance
			.get<MentorApplicationHistoryResponse>(`/admin/mentor-applications/${siteUserId}/history`)
			.then((res) => res.data),

	postApproveMentorApplication: (mentorApplicationId: string | number) =>
		axiosInstance.post<void>(`/admin/mentor-applications/${mentorApplicationId}/approve`, {}).then((res) => res.data),

	postRejectMentorApplication: (mentorApplicationId: string | number, rejectedReason: string) =>
		axiosInstance
			.post<void>(`/admin/mentor-applications/${mentorApplicationId}/reject`, { rejectedReason })
			.then((res) => res.data),

	postMappingMentorapplicationUniversity: assignMentorApplicationUniversity,

	assignMentorApplicationUniversity,

	getRegions: () => axiosInstance.get<AdminCollection<RegionResponse>>("/admin/regions").then((res) => res.data),

	createRegion: (data: RegionPayload) =>
		axiosInstance.post<RegionResponse>("/admin/regions", data).then((res) => res.data),

	updateRegion: (code: string, data: RegionPayload) =>
		axiosInstance.put<RegionResponse>(`/admin/regions/${code}`, data).then((res) => res.data),

	deleteRegion: (code: string) => axiosInstance.delete<void>(`/admin/regions/${code}`).then((res) => res.data),

	getCountries: () => axiosInstance.get<AdminCollection<CountryResponse>>("/admin/countries").then((res) => res.data),

	createCountry: (data: CountryPayload) =>
		axiosInstance.post<CountryResponse>("/admin/countries", data).then((res) => res.data),

	updateCountry: (code: string, data: CountryPayload) =>
		axiosInstance.put<CountryResponse>(`/admin/countries/${code}`, data).then((res) => res.data),

	deleteCountry: (code: string) => axiosInstance.delete<void>(`/admin/countries/${code}`).then((res) => res.data),

	get권역조회: () => axiosInstance.get<AdminCollection<RegionResponse>>("/admin/regions").then((res) => res.data),

	post권역생성: (data: RegionPayload) => axiosInstance.post("/admin/regions", data).then((res) => res.data),

	put권역수정: (code: string, data: RegionPayload) =>
		axiosInstance.put(`/admin/regions/${code}`, data).then((res) => res.data),

	delete권역삭제: (code: string) => axiosInstance.delete(`/admin/regions/${code}`).then((res) => res.data),

	get지역조회: () => axiosInstance.get<AdminCollection<CountryResponse>>("/admin/countries").then((res) => res.data),

	post지역생성: (data: CountryPayload) => axiosInstance.post("/admin/countries", data).then((res) => res.data),

	put지역수정: (code: string, data: CountryPayload) =>
		axiosInstance.put(`/admin/countries/${code}`, data).then((res) => res.data),

	delete지역삭제: (code: string) => axiosInstance.delete(`/admin/countries/${code}`).then((res) => res.data),
};
