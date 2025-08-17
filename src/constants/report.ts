import { ReasonType } from "@/types/reports";

export const reportReasons: { [key in ReasonType]: string } = {
  [ReasonType.ADVERTISEMENT]: "상업적 광고 및 판매",
  [ReasonType.SPAM]: "낚시/놀림/도배",
  [ReasonType.PERSONAL_INFO_EXPOSURE]: "개인정보 노출",
  [ReasonType.PORNOGRAPHY]: "음란/선정성",
  [ReasonType.COPYRIGHT_INFRINGEMENT]: "저작권 침해",
  [ReasonType.ILLEGAL_ACTIVITY]: "불법 행위",
  [ReasonType.IMPERSONATION]: "사칭/도용",
  [ReasonType.INSULT]: "욕설/비하",
};
