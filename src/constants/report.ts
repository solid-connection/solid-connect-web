import { ReasonType } from "@/types/reports";

export const reportReasons: { label: string; value: ReasonType }[] = [
  { label: "상업적 광고 및 판매", value: ReasonType.ADVERTISEMENT },
  { label: "낚시/놀림/도배", value: ReasonType.SPAM },
  { label: "개인정보 노출", value: ReasonType.PERSONAL_INFO_EXPOSURE },
  { label: "음란/선정성", value: ReasonType.PORNOGRAPHY },
  { label: "저작권 침해", value: ReasonType.COPYRIGHT_INFRINGEMENT },
  { label: "불법 행위", value: ReasonType.ILLEGAL_ACTIVITY },
  { label: "사칭/도용", value: ReasonType.IMPERSONATION },
  { label: "욕설/비하", value: ReasonType.INSULT },
];
