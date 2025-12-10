"use client";

import { useState } from "react";

import clsx from "clsx";

import ModalBase from "@/components/modal/ModalBase";

import useSelectReportHandler from "./_hooks/useSelectReportHandler";

import { reportReasons } from "@/constants/report";
import { ReportType } from "@/types/reports";

import { IconReport } from "@/public/svgs/mentor";

interface ReportPanelProps {
  idx: number;
}

const ReportPanel = ({ idx }: ReportPanelProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { selectedReason, handleReasonSelect } = useSelectReportHandler(idx);

  return (
    <>
      <button
        className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-gray-50"
        onClick={() => setIsExpanded(true)}
      >
        <span className="h-5 w-5">
          <IconReport />
        </span>
        <span className="typo-medium-2">Report</span>
      </button>

      <ModalBase isOpen={isExpanded} onClose={() => setIsExpanded(false)}>
        <div className="flex w-full items-center justify-center">
          <div className="w-[260px] max-w-sm rounded-lg bg-white p-3 shadow-lg">
            {/* 헤더 */}
            <div className="mb-2 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5">
                  <IconReport />
                </span>
                <h2 className="typo-sb-5 text-k-800">Report</h2>
              </div>
            </div>

            {/* 신고 사유 목록 */}
            <div className="">
              {Object.keys(ReportType).map((reasonKey: ReportType) => (
                <button
                  key={reasonKey}
                  onClick={() => handleReasonSelect(reasonKey)}
                  className={clsx(
                    "m-0 w-full border-t border-k-100 px-3 py-2 text-k-700",
                    selectedReason === reasonKey && "bg-primary-100",
                  )}
                >
                  {reportReasons[reasonKey]}
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
