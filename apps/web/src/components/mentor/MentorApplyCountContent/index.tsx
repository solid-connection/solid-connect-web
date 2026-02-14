"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetMentoringUncheckedCount } from "@/apis/mentor";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { UserRole } from "@/types/mentor";

const MentorApplyCountContent = () => {
	const router = useRouter();
	const { isInitialized, isAuthenticated, userRole } = useAuthStore();
	const isMentor = userRole === UserRole.MENTOR;

	const { data: count, isSuccess } = useGetMentoringUncheckedCount(
		isInitialized && isAuthenticated && isMentor,
	);

	const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

	// 신규 신청 없으면 표시
	if (!isInitialized || !isMentor || !isSuccess || !isModalOpen || count === 0)
		return null;

	return (
		<div className="fixed left-1/2 top-16 z-50 w-[80%] max-w-md -translate-x-1/2 rounded-xl bg-secondary px-6 py-4 text-white shadow-md">
			{/* close button */}
			<button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setIsModalOpen(false);
				}}
				className="absolute right-3 top-3 text-white/80 hover:text-white"
				aria-label="닫기"
			>
				✕
			</button>
			<button
				type="button"
				onClick={() => {
					setIsModalOpen(false);
					router.push("/mentor");
				}}
				className="w-full text-left"
			>
				<div className="flex items-center">
					{/* left: message */}
					<div className="flex-1">
						<h2 className="typo-sb-11">알림</h2>
						<p className="mt-1 typo-regular-2">새로운 요청이 들어왔어요!</p>
						<p className="typo-regular-2">어서 요청을 수락해주세요.</p>
					</div>

					{/* divider */}
					<div className="mx-4 h-12 w-px bg-k-300" />

					{/* right: count */}
					<div className="min-w-[80px] text-center">
						<span className="typo-regular-4">신규 신청</span>
						<div className="typo-bold-1">{count}명</div>
					</div>
				</div>
			</button>
		</div>
	);
};

export default MentorApplyCountContent;
