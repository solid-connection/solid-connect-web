import type { VerifyStatus } from "@/types/scores";

const statusStyles = {
	PENDING: "bg-primary-100 text-primary",
	APPROVED: "bg-[#E9F7EC] text-[#15A861]",
	REJECTED: "bg-[#FFD9D9] text-[#E22A2D]",
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
