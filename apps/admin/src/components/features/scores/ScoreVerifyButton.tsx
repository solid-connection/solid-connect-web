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
				className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
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
						className="rounded border px-2 py-1"
					/>
					<button
						type="button"
						onClick={handleReject}
						className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
					>
						확인
					</button>
				</div>
			) : (
				<button
					type="button"
					onClick={handleReject}
					className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
				>
					거절
				</button>
			)}
		</div>
	);
}
