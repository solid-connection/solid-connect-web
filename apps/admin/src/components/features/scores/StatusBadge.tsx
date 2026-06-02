import type { VerifyStatus } from "@/types/scores";

const statusStyles = {
	PENDING: "bg-primary-100 text-primary",
	APPROVED: "bg-magic-success-surface text-magic-success",
	REJECTED: "bg-magic-danger-surface text-magic-danger",
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
		<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 typo-medium-4 ${statusStyles[status]}`}>
			{statusLabels[status]}
		</span>
	);
}
