import type { VerifyStatus } from "@/types/scores";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const statusLabels = {
  PENDING: "대기중",
  APPROVED: "승인됨",
  REJECTED: "거절됨",
};

interface StatusBadgeProps {
  status: VerifyStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
