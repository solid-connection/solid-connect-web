"use client";

import { useState } from "react";

import clsx from "clsx";

import ModalBase from "@/components/modal/ModalBase";

import { reportReasons } from "@/constants/report";
import { ReasonType } from "@/types/reports";

import { IconReport } from "@/public/svgs/mentor";

const ReportPanel = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedReason, setSelectedReason] = useState<ReasonType | null>(null);

  const handleReasonSelect = (reason: ReasonType) => {
    setSelectedReason(reason);
  };

  return (
    <>
      <button
        className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-gray-50"
        onClick={() => setIsExpanded(true)}
      >
        <IconReport />
        <span className="text-[14px] font-medium">Report</span>
      </button>

      <ModalBase isOpen={isExpanded} onClose={() => setIsExpanded(false)}>
        <div className="flex w-full items-center justify-center">
          <div className="w-[260px] max-w-sm rounded-lg bg-white p-3 shadow-lg">
            {/* 헤더 */}
            <div className="mb-2 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <IconReport />
                <h2 className="text-lg font-semibold text-k-800">Report</h2>
              </div>
            </div>

            {/* 신고 사유 목록 */}
            <div className="">
              {reportReasons.map((reason) => (
                <button
                  key={reason.value}
                  onClick={() => handleReasonSelect(reason.value)}
                  className={clsx(
                    "m-0 w-full border-t border-k-100 px-3 py-2 text-k-700",
                    selectedReason === reason.value && "bg-primary-100",
                  )}
                >
                  {reason.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ModalBase>
    </>
  );
};

export default ReportPanel;
