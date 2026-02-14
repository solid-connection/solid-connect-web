import { useState } from "react";
import type { VerifyStatus } from "@/types/scores";

interface Props {
	currentStatus: VerifyStatus;
	onVerifyChange: (status: VerifyStatus, reason?: string) => void;
}

export function ScoreVerifyButton({ currentStatus, onVerifyChange }: Props) {
	const [showRejectInput, setShowRejectInput] = useState(false);
	const [rejectReason, setRejectReason] = useState("");

	const handleApprove = () => {
		onVerifyChange("APPROVED");
	};

	const handleReject = () => {
		if (showRejectInput) {
			onVerifyChange("REJECTED", rejectReason);
			setShowRejectInput(false);
			setRejectReason("");
		} else {
			setShowRejectInput(true);
		}
	};

	if (currentStatus !== "PENDING") {
		return null;
	}

	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				onClick={handleApprove}
				className="rounded bg-[#15A861] px-3 py-1 typo-sb-11 text-k-0 hover:bg-[#10814A]"
			>
				승인
			</button>

			{showRejectInput ? (
				<div className="flex gap-2">
					<input
						type="text"
						value={rejectReason}
						onChange={(e) => setRejectReason(e.target.value)}
						placeholder="거절 사유"
						className="rounded border border-k-200 bg-k-0 px-2 py-1 typo-regular-4 text-k-700"
					/>
					<button
						type="button"
						onClick={handleReject}
						className="rounded bg-[#E22A2D] px-3 py-1 typo-sb-11 text-k-0 hover:bg-[#BA1E21]"
					>
						확인
					</button>
				</div>
			) : (
				<button
					type="button"
					onClick={handleReject}
					className="rounded bg-[#E22A2D] px-3 py-1 typo-sb-11 text-k-0 hover:bg-[#BA1E21]"
				>
					거절
				</button>
			)}
		</div>
	);
}
