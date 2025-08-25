import { ReportType } from "@/types/reports";

export const reportReasons: { [key in ReportType]: string } = {
  [ReportType.ADVERTISEMENT]: "상업적 광고 및 판매",
  [ReportType.SPAM]: "낚시/놀림/도배",
  [ReportType.PERSONAL_INFO_EXPOSURE]: "개인정보 노출",
  [ReportType.PORNOGRAPHY]: "음란/선정성",
  [ReportType.COPYRIGHT_INFRINGEMENT]: "저작권 침해",
  [ReportType.ILLEGAL_ACTIVITY]: "불법 행위",
  [ReportType.IMPERSONATION]: "사칭/도용",
  [ReportType.INSULT]: "욕설/비하",
};
