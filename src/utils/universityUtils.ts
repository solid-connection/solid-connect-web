import { SHORT_LANGUAGE_TEST } from "@/constants/application";

export const shortenLanguageTestName = (name: string) => {
  if (Object.prototype.hasOwnProperty.call(SHORT_LANGUAGE_TEST, name)) {
    return SHORT_LANGUAGE_TEST[name];
  }
};
