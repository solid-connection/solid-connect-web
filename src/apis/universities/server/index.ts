// Server-side exports
export { default as getRecommendedUniversity } from "./getRecommendedUniversity";
export { getUniversityDetail } from "./getUniversityDetail";
export {
  getUniversitiesByText,
  getAllUniversities,
  getCategorizedUniversities,
} from "./getSearchUniversitiesByText";
export {
  getSearchUniversitiesByFilter,
  getSearchUniversitiesAllRegions,
  type UniversitySearchFilterParams,
} from "./getSearchUniversitiesByFilter";
