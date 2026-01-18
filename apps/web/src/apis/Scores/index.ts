export { scoresApi, ScoresQueryKeys } from "./api";
export type {
  UseMyGpaScoreResponse,
  UseGetMyLanguageTestScoreResponse,
  UsePostGpaScoreRequest,
  UsePostLanguageTestScoreRequest,
} from "./api";

export { default as useGetMyGpaScore } from "./getGpaList";
export { default as useGetMyLanguageTestScore } from "./getLanguageTestList";
export { default as usePostGpaScore } from "./postCreateGpa";
export { default as usePostLanguageTestScore } from "./postCreateLanguageTest";
