import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as cn, B as Button, a as axiosInstance } from "./client-Bbw56rKA.mjs";
import { R as Root2, L as List, T as Trigger, C as Content } from "../_chunks/_libs/@radix-ui/react-tabs.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import "../_chunks/_libs/asynckit.mjs";
import "../_chunks/_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_chunks/_libs/@radix-ui/react-slot.mjs";
import "../_chunks/_libs/@radix-ui/react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/axios.mjs";
import "../_chunks/_libs/form-data.mjs";
import "../_chunks/_libs/combined-stream.mjs";
import "../_libs/delayed-stream.mjs";
import "path";
import "http";
import "https";
import "url";
import "fs";
import "../_libs/mime-types.mjs";
import "../_libs/mime-db.mjs";
import "../_libs/es-set-tostringtag.mjs";
import "../_libs/get-intrinsic.mjs";
import "../_libs/es-object-atoms.mjs";
import "../_libs/es-errors.mjs";
import "../_libs/math-intrinsics.mjs";
import "../_libs/gopd.mjs";
import "../_libs/es-define-property.mjs";
import "../_libs/has-symbols.mjs";
import "../_libs/get-proto.mjs";
import "../_libs/dunder-proto.mjs";
import "../_libs/call-bind-apply-helpers.mjs";
import "../_libs/function-bind.mjs";
import "../_libs/hasown.mjs";
import "../_libs/has-tostringtag.mjs";
import "../_libs/proxy-from-env.mjs";
import "http2";
import "../_chunks/_libs/follow-redirects.mjs";
import "assert";
import "../_chunks/_libs/debug.mjs";
import "../_libs/ms.mjs";
import "tty";
import "../_chunks/_libs/supports-color.mjs";
import "os";
import "../_libs/has-flag.mjs";
import "zlib";
import "events";
import "./router-D5H6tH2r.mjs";
import "../_chunks/_libs/@tanstack/router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_chunks/_libs/@tanstack/react-router.mjs";
import "../_libs/tiny-warning.mjs";
import "../_libs/isbot.mjs";
import "../_chunks/_libs/@radix-ui/primitive.mjs";
import "../_chunks/_libs/@radix-ui/react-context.mjs";
import "../_chunks/_libs/@radix-ui/react-roving-focus.mjs";
import "../_chunks/_libs/@radix-ui/react-collection.mjs";
import "../_chunks/_libs/@radix-ui/react-id.mjs";
import "../_chunks/_libs/@radix-ui/react-use-layout-effect.mjs";
import "../_chunks/_libs/@radix-ui/react-primitive.mjs";
import "../_chunks/_libs/@radix-ui/react-use-callback-ref.mjs";
import "../_chunks/_libs/@radix-ui/react-use-controllable-state.mjs";
import "../_chunks/_libs/@radix-ui/react-direction.mjs";
import "../_chunks/_libs/@radix-ui/react-presence.mjs";
const Table = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("table", { ref, className: cn("w-full caption-bottom text-sm", className), ...props }) })
);
Table.displayName = "Table";
const TableHeader = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props })
);
TableHeader.displayName = "TableHeader";
const TableBody = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { ref, className: cn("[&_tr:last-child]:border-0", className), ...props })
);
TableBody.displayName = "TableBody";
const TableFooter = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", { ref, className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className), ...props })
);
TableFooter.displayName = "TableFooter";
const TableRow = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      ref,
      className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
      ...props
    }
  )
);
TableRow.displayName = "TableRow";
const TableHead = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      ref,
      className: cn(
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  )
);
TableHead.displayName = "TableHead";
const TableCell = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "td",
    {
      ref,
      className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
      ...props
    }
  )
);
TableCell.displayName = "TableCell";
const TableCaption = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("caption", { ref, className: cn("mt-4 text-sm text-muted-foreground", className), ...props })
);
TableCaption.displayName = "TableCaption";
const scoreApi = {
  // GPA 성적 조회
  getGpaScores: (condition, page) => axiosInstance.get("/admin/scores/gpas", { params: { ...condition, page } }).then((res) => res.data),
  // GPA 성적 수정
  updateGpaScore: (id, status, reason, score) => {
    if (!score) throw new Error("Score data is required");
    const request = {
      gpa: score.gpaScoreStatusResponse.gpaResponse.gpa,
      gpaCriteria: score.gpaScoreStatusResponse.gpaResponse.gpaCriteria,
      verifyStatus: status,
      rejectedReason: reason
    };
    return axiosInstance.put(`/admin/scores/gpas/${id}`, request);
  },
  // 어학성적 조회
  getLanguageScores: (condition, page) => axiosInstance.get("/admin/scores/language-tests", { params: { ...condition, page } }).then((res) => res.data),
  // 어학성적 수정
  updateLanguageScore: (id, status, reason, score) => {
    if (!score) throw new Error("Score data is required");
    const request = {
      languageTestType: score.languageTestScoreStatusResponse.languageTestResponse.languageTestType,
      languageTestScore: score.languageTestScoreStatusResponse.languageTestResponse.languageTestScore,
      verifyStatus: status,
      rejectedReason: reason
    };
    return axiosInstance.put(`/admin/scores/language-tests/${id}`, request);
  }
};
function ScoreVerifyButton({ currentStatus, onVerifyChange }) {
  const [showRejectInput, setShowRejectInput] = reactExports.useState(false);
  const [rejectReason, setRejectReason] = reactExports.useState("");
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: handleApprove,
        className: "rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600",
        children: "승인"
      }
    ),
    showRejectInput ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: rejectReason,
          onChange: (e) => setRejectReason(e.target.value),
          placeholder: "거절 사유",
          className: "rounded border px-2 py-1"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleReject,
          className: "rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600",
          children: "확인"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: handleReject,
        className: "rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600",
        children: "거절"
      }
    )
  ] });
}
const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800"
};
const statusLabels = {
  PENDING: "대기중",
  APPROVED: "승인됨",
  REJECTED: "거절됨"
};
function StatusBadge({ status }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`, children: statusLabels[status] });
}
const S3_BASE_URL$1 = void 0;
function GpaScoreTable({ verifyFilter }) {
  const [scores, setScores] = reactExports.useState([]);
  const [page, setPage] = reactExports.useState(1);
  const [totalPages, setTotalPages] = reactExports.useState(1);
  const [loading, setLoading] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editingGpa, setEditingGpa] = reactExports.useState(0);
  const [editingGpaCriteria, setEditingGpaCriteria] = reactExports.useState(0);
  const fetchScores = async () => {
    setLoading(true);
    try {
      const response = await scoreApi.getGpaScores({ verifyStatus: verifyFilter }, page);
      setScores(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch GPA scores:", error);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchScores();
  }, [verifyFilter, page]);
  const handleVerifyStatus = async (id, status, reason) => {
    try {
      const score = scores.find((s) => s.gpaScoreStatusResponse.id === id);
      await scoreApi.updateGpaScore(id, status, reason, score);
      fetchScores();
    } catch (error) {
      console.error("Failed to update GPA score:", error);
      toast.error("성적 상태 업데이트에 실패했습니다");
    }
  };
  const handleEdit = (score) => {
    setEditingId(score.gpaScoreStatusResponse.id);
    setEditingGpa(score.gpaScoreStatusResponse.gpaResponse.gpa);
    setEditingGpaCriteria(score.gpaScoreStatusResponse.gpaResponse.gpaCriteria);
  };
  const handleSave = async (score) => {
    try {
      await scoreApi.updateGpaScore(
        score.gpaScoreStatusResponse.id,
        score.gpaScoreStatusResponse.verifyStatus,
        score.gpaScoreStatusResponse.rejectedReason || void 0,
        {
          ...score,
          gpaScoreStatusResponse: {
            ...score.gpaScoreStatusResponse,
            gpaResponse: {
              ...score.gpaScoreStatusResponse.gpaResponse,
              gpa: editingGpa,
              gpaCriteria: editingGpaCriteria
            }
          }
        }
      );
      setEditingId(null);
      fetchScores();
      toast.success("GPA가 수정되었습니다");
    } catch (error) {
      console.error("Failed to update GPA:", error);
      toast.error("GPA 수정에 실패했습니다");
    }
  };
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white shadow", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "닉네임" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "GPA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "기준점수" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "상태" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "제출일" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "거절사유" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "인증파일" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "작업" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 9, className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: "로딩중..." })
      ] }) }) }) : scores.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 9, className: "text-center text-gray-500", children: "데이터가 없습니다" }) }) : scores.map((score) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "hover:bg-gray-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: score.gpaScoreStatusResponse.id }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: score.siteUserResponse.profileImageUrl,
              alt: "프로필",
              className: "mr-2 h-8 w-8 rounded-full"
            }
          ),
          score.siteUserResponse.nickname
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: editingId === score.gpaScoreStatusResponse.id ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            step: "0.01",
            value: editingGpa,
            onChange: (e) => setEditingGpa(Number.parseFloat(e.target.value)),
            className: "w-20 rounded border px-2 py-1"
          }
        ) }) : score.gpaScoreStatusResponse.gpaResponse.gpa }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: editingId === score.gpaScoreStatusResponse.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              step: "0.01",
              value: editingGpaCriteria,
              onChange: (e) => setEditingGpaCriteria(Number.parseFloat(e.target.value)),
              className: "w-20 rounded border px-2 py-1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => handleSave(score), variant: "default", children: "저장" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setEditingId(null), variant: "secondary", children: "취소" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          score.gpaScoreStatusResponse.gpaResponse.gpaCriteria,
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => handleEdit(score), variant: "secondary", children: "수정" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: score.gpaScoreStatusResponse.verifyStatus }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: format(new Date(score.gpaScoreStatusResponse.createdAt), "yyyy-MM-dd HH:mm") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: score.gpaScoreStatusResponse.rejectedReason || "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `${S3_BASE_URL$1}${score.gpaScoreStatusResponse.gpaResponse.gpaReportUrl}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-600 hover:text-blue-800 hover:underline",
            children: "파일 보기"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ScoreVerifyButton,
          {
            currentStatus: score.gpaScoreStatusResponse.verifyStatus,
            onVerifyChange: (status, reason) => handleVerifyStatus(score.gpaScoreStatusResponse.id, status, reason)
          }
        ) })
      ] }, score.gpaScoreStatusResponse.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-center gap-2 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => handlePageChange(page - 1), disabled: page === 1, variant: "secondary", children: "이전" }),
      Array.from({ length: totalPages }, (_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => handlePageChange(idx + 1),
          variant: page === idx + 1 ? "default" : "secondary",
          children: idx + 1
        },
        idx + 1
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => handlePageChange(page + 1), disabled: page === totalPages, variant: "secondary", children: "다음" })
    ] })
  ] });
}
const S3_BASE_URL = void 0;
const LANGUAGE_TEST_OPTIONS = [
  { value: "TOEIC", label: "TOEIC" },
  { value: "TOEFL_IBT", label: "TOEFL IBT" },
  { value: "TOEFL_ITP", label: "TOEFL ITP" },
  { value: "IELTS", label: "IELTS" },
  { value: "JLPT", label: "JLPT" },
  { value: "NEW_HSK", label: "NEW HSK" },
  { value: "DALF", label: "DALF" },
  { value: "CEFR", label: "CEFR" },
  { value: "TCF", label: "TCF" },
  { value: "TEF", label: "TEF" },
  { value: "DUOLINGO", label: "DUOLINGO" },
  { value: "ETC", label: "기타" }
];
function LanguageScoreTable({ verifyFilter }) {
  const [scores, setScores] = reactExports.useState([]);
  const [page, setPage] = reactExports.useState(1);
  const [totalPages, setTotalPages] = reactExports.useState(1);
  const [loading, setLoading] = reactExports.useState(false);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editingScore, setEditingScore] = reactExports.useState("");
  const [editingType, setEditingType] = reactExports.useState("TOEIC");
  const fetchScores = async () => {
    setLoading(true);
    try {
      const response = await scoreApi.getLanguageScores({ verifyStatus: verifyFilter }, page);
      setScores(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch Language scores:", error);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchScores();
  }, [verifyFilter, page]);
  const handleVerifyStatus = async (id, status, reason) => {
    try {
      const score = scores.find((s) => s.languageTestScoreStatusResponse.id === id);
      await scoreApi.updateLanguageScore(id, status, reason, score);
      fetchScores();
    } catch (error) {
      console.error("Failed to update Language score:", error);
      toast.error("성적 상태 업데이트에 실패했습니다");
    }
  };
  const handleEdit = (score) => {
    setEditingId(score.languageTestScoreStatusResponse.id);
    setEditingScore(score.languageTestScoreStatusResponse.languageTestResponse.languageTestScore);
    setEditingType(score.languageTestScoreStatusResponse.languageTestResponse.languageTestType);
  };
  const handleSave = async (score) => {
    try {
      await scoreApi.updateLanguageScore(
        score.languageTestScoreStatusResponse.id,
        score.languageTestScoreStatusResponse.verifyStatus,
        score.languageTestScoreStatusResponse.rejectedReason || void 0,
        {
          ...score,
          languageTestScoreStatusResponse: {
            ...score.languageTestScoreStatusResponse,
            languageTestResponse: {
              ...score.languageTestScoreStatusResponse.languageTestResponse,
              languageTestScore: editingScore,
              languageTestType: editingType
            }
          }
        }
      );
      setEditingId(null);
      fetchScores();
      toast.success("어학성적이 수정되었습니다");
    } catch (error) {
      console.error("Failed to update language score:", error);
      toast.error("어학성적 수정에 실패했습니다");
    }
  };
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white shadow", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "닉네임" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "시험종류" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "점수" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "상태" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "제출일" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "거절사유" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "인증파일" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "작업" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 9, className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: "로딩중..." })
      ] }) }) }) : scores.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 9, className: "text-center text-gray-500", children: "데이터가 없습니다" }) }) : scores.map((score) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "hover:bg-gray-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: score.languageTestScoreStatusResponse.id }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: score.siteUserResponse.profileImageUrl,
              alt: "프로필",
              className: "mr-2 h-8 w-8 rounded-full"
            }
          ),
          score.siteUserResponse.nickname
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: editingId === score.languageTestScoreStatusResponse.id ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: editingType,
            onChange: (e) => setEditingType(e.target.value),
            className: "rounded border px-2 py-1",
            children: LANGUAGE_TEST_OPTIONS.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: option.value, children: option.label }, option.value))
          }
        ) }) : LANGUAGE_TEST_OPTIONS.find(
          (option) => option.value === score.languageTestScoreStatusResponse.languageTestResponse.languageTestType
        )?.label || score.languageTestScoreStatusResponse.languageTestResponse.languageTestType }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: editingId === score.languageTestScoreStatusResponse.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: editingScore,
              onChange: (e) => setEditingScore(e.target.value),
              className: "w-20 rounded border px-2 py-1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => handleSave(score), variant: "default", children: "저장" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setEditingId(null), variant: "secondary", children: "취소" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          score.languageTestScoreStatusResponse.languageTestResponse.languageTestScore,
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => handleEdit(score), variant: "secondary", children: "수정" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: score.languageTestScoreStatusResponse.verifyStatus }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: format(new Date(score.languageTestScoreStatusResponse.createdAt), "yyyy-MM-dd HH:mm") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: score.languageTestScoreStatusResponse.rejectedReason || "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `${S3_BASE_URL}${score.languageTestScoreStatusResponse.languageTestResponse.languageTestReportUrl}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-600 hover:text-blue-800 hover:underline",
            children: "파일 보기"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ScoreVerifyButton,
          {
            currentStatus: score.languageTestScoreStatusResponse.verifyStatus,
            onVerifyChange: (status, reason) => handleVerifyStatus(score.languageTestScoreStatusResponse.id, status, reason)
          }
        ) })
      ] }, score.languageTestScoreStatusResponse.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-center gap-2 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => handlePageChange(page - 1), disabled: page === 1, variant: "secondary", children: "이전" }),
      Array.from({ length: totalPages }, (_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => handlePageChange(idx + 1),
          variant: page === idx + 1 ? "default" : "secondary",
          children: idx + 1
        },
        idx + 1
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => handlePageChange(page + 1), disabled: page === totalPages, variant: "secondary", children: "다음" })
    ] })
  ] });
}
const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
function ScoresPage() {
  const [verifyFilter, setVerifyFilter] = reactExports.useState("PENDING");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mb-6 text-2xl font-bold", children: "성적 관리" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: verifyFilter, onChange: (e) => setVerifyFilter(e.target.value), className: "rounded border p-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PENDING", children: "대기중" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "APPROVED", children: "승인됨" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "REJECTED", children: "거절됨" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "gpa", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "gpa", children: "GPA 성적" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "language", children: "어학성적" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "gpa", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GpaScoreTable, { verifyFilter }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "language", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageScoreTable, { verifyFilter }) })
    ] })
  ] });
}
export {
  ScoresPage as component
};
