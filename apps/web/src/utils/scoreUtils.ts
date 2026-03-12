import { LanguageTestEnum } from "@/types/score";

const validateLanguageScore = (testType: string, score: string) => {
  const numScore = Number(score);

  if (testType === LanguageTestEnum.TOEIC) {
    if (!(numScore >= 0 && numScore <= 990)) {
      // alert("TOEIC 점수는 0 ~ 990 사이여야 합니다.");
      throw new Error("TOEIC 점수는 0 ~ 990 사이여야 합니다.");
    }
  }
  if (testType === LanguageTestEnum.TOEFL_IBT) {
    if (!(numScore >= 0 && numScore <= 120)) {
      // alert("TOEFL IBT 점수는 0 ~ 120 사이여야 합니다.");
      throw new Error("TOEFL IBT 점수는 0 ~ 120 사이여야 합니다.");
    }
  }
  if (testType === LanguageTestEnum.TOEFL_ITP) {
    if (!(numScore >= 310 && numScore <= 677)) {
      throw new Error("TOEFL ITP 점수는 310 ~ 677 사이여야 합니다.");
    }
  }
  if (testType === LanguageTestEnum.IELTS) {
    if (!(numScore >= 0 && numScore <= 9)) {
      throw new Error("IELTS 점수는 0 ~ 9 사이여야 합니다.");
    }
  }
  if (testType === LanguageTestEnum.JLPT) {
    if (!(numScore >= 1 && numScore <= 5)) {
      throw new Error("JLPT 등급은 1 ~ 5 사이여야 합니다.");
    }
  }
};

export default validateLanguageScore;
