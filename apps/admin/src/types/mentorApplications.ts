export type MentorApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminSiteUserResponse {
	id?: number | string;
	siteUserId?: number | string;
	nickname?: string | null;
	name?: string | null;
	email?: string | null;
	profileImageUrl?: string | null;
}

export interface AdminUniversityResponse {
	id?: number | string;
	universityId?: number | string;
	koreanName?: string | null;
	name?: string | null;
	country?: string | null;
	countryName?: string | null;
}

export interface MentorApplicationFileResponse {
	url?: string | null;
	fileUrl?: string | null;
	path?: string | null;
	originalFileName?: string | null;
}

export interface MentorApplicationCoreResponse {
	id?: number | string;
	mentorApplicationId?: number | string;
	siteUserId?: number | string;
	mentorApplicationStatus?: MentorApplicationStatus | null;
	status?: MentorApplicationStatus | null;
	preparationStatus?: string | null;
	universitySelectType?: string | null;
	country?: string | null;
	countryName?: string | null;
	universityId?: number | string | null;
	universityName?: string | null;
	term?: string | null;
	verificationFile?: string | MentorApplicationFileResponse | null;
	verificationFileUrl?: string | null;
	verificationFilePath?: string | null;
	fileUrl?: string | null;
	proofFileUrl?: string | null;
	rejectedReason?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
}

export interface MentorApplicationListItem extends MentorApplicationCoreResponse {
	mentorApplicationResponse?: MentorApplicationCoreResponse | null;
	mentorApplication?: MentorApplicationCoreResponse | null;
	siteUserResponse?: AdminSiteUserResponse | null;
	siteUser?: AdminSiteUserResponse | null;
	user?: AdminSiteUserResponse | null;
	universityResponse?: AdminUniversityResponse | null;
	university?: AdminUniversityResponse | null;
}

export interface MentorApplicationPageResponse {
	content?: MentorApplicationListItem[];
	pageNumber?: number;
	pageSize?: number;
	totalElements?: number;
	totalPages?: number;
}

export type MentorApplicationHistoryResponse = MentorApplicationListItem[] | MentorApplicationPageResponse;
