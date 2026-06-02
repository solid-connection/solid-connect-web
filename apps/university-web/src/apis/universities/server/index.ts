// Server-side exports
export { default as getRecommendedUniversity } from "./getRecommendedUniversity";
export {
  getSearchUniversitiesAllRegions,
  getSearchUniversitiesByFilter,
  type UniversitySearchFilterParams,
} from "./getSearchUniversitiesByFilter";
export { getAllUniversities, getCategorizedUniversities, getUniversitiesByText } from "./getSearchUniversitiesByText";
export {
  getUniversityDetail,
  getUniversityDetailForSsg,
  getUniversityDetailWithStatus,
  type UniversityDetailFetchResult,
} from "./getUniversityDetail";
