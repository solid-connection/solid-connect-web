export const SCHOOL_EMAIL_RETURN_PATHS = {
  applicationApply: "/university/application/apply",
  score: "/university/score",
  gpaSubmit: "/university/score/submit/gpa",
} as const;

export type SchoolEmailReturnTo = keyof typeof SCHOOL_EMAIL_RETURN_PATHS;

export const getSchoolEmailReturnPath = (returnTo: string | null | undefined) => {
  if (!returnTo || !(returnTo in SCHOOL_EMAIL_RETURN_PATHS)) {
    return "/";
  }

  return SCHOOL_EMAIL_RETURN_PATHS[returnTo as SchoolEmailReturnTo];
};

export const getSchoolEmailVerificationPath = (returnTo: SchoolEmailReturnTo) => {
  return `/my/school-email?returnTo=${returnTo}`;
};
