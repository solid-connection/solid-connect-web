import { SHORT_LANGUAGE_TEST } from "@/constants/application";

export const shortenLanguageTestName = (name: string) => {
  if (SHORT_LANGUAGE_TEST.hasOwnProperty(name)) {
    return SHORT_LANGUAGE_TEST[name];
  }
  return name;
};
