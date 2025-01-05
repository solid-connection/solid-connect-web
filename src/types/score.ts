export interface SubmitGpaScoreRequest {
  gpa: number;
  gpaCriteria: number;
  issueDate: string; // yyyy-MM-dd
  gpaReportUrl: string;
}

export interface SubmitLanguageTestScoreRequest {
  languageTestType: string;
  languageTestScore: string;
  issueDate: string; // yyyy-MM-dd
  languageTestReportUrl: string;
}
