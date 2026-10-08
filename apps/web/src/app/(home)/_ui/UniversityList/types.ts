import type { UniversityCardData } from "@/types/university";

export type HomeUniversityPreview = Omit<UniversityCardData, "studentCapacity">;
export type HomeUniversityPreviewList = Record<string, HomeUniversityPreview[]>;
