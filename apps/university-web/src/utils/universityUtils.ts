import { SHORT_LANGUAGE_TEST } from "@/constants/application";

const shortenLanguageTestName = (name: string): string | undefined => {
  if (Object.hasOwn(SHORT_LANGUAGE_TEST, name)) {
    return SHORT_LANGUAGE_TEST[name] as string;
  }
  return undefined;
};

export default shortenLanguageTestName;
