import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { adminApi } from "@/lib/api/admin";
import { UnivApplyInfosPageContent } from "./UnivApplyInfosPageContent";

vi.mock("@/components/layout/AdminLayout", () => ({
	AdminLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		warning: vi.fn(),
		error: vi.fn(),
	},
}));

vi.mock("@/lib/api/admin", () => ({
	adminApi: {
		getHomeUniversities: vi.fn(),
		getTerms: vi.fn(),
		getUnivApplyInfoFields: vi.fn(),
		importUnivApplyInfos: vi.fn(),
	},
}));

const mockedAdminApi = vi.mocked(adminApi);

function renderPage() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});

	return render(
		<QueryClientProvider client={queryClient}>
			<UnivApplyInfosPageContent />
		</QueryClientProvider>,
	);
}

describe("UnivApplyInfosPageContent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockedAdminApi.getHomeUniversities.mockResolvedValue([{ id: 1, name: "본교", maxChoiceCount: 3 }]);
		mockedAdminApi.getTerms.mockResolvedValue([{ id: 1, label: "2026-1", isCurrent: true }]);
		mockedAdminApi.getUnivApplyInfoFields.mockResolvedValue({ languageTestTypes: [] });
		mockedAdminApi.importUnivApplyInfos.mockResolvedValue({
			successCount: 0,
			createdUniversities: [],
			failedRows: [
				{
					rowNumber: 1,
					reason: "2개 컬럼에 문제가 있습니다.",
					errors: [
						{
							header: "국가 코드",
							field: "universityCountryCode",
							value: "Belgium",
							code: "NOT_FOUND",
							message: "국가를 찾을 수 없습니다.",
						},
					],
				},
			],
		});
	});

	it("renders server cell errors inline in the import preview modal", async () => {
		renderPage();

		await screen.findByText("본교");
		await screen.findByText("2026-1");
		fireEvent.change(screen.getByLabelText("협정 대학"), { target: { value: "1" } });
		fireEvent.change(screen.getByLabelText("학기"), { target: { value: "1" } });
		fireEvent.change(screen.getByRole("textbox"), {
			target: {
				value: "| 대학명 (국문) | 국가 코드 |\n|--------------|-----------|\n|  | Belgium |",
			},
		});

		fireEvent.click(screen.getByRole("button", { name: "파싱" }));
		await screen.findByText("③ 컬럼 매핑");
		fireEvent.click(screen.getByRole("button", { name: "지원 대학 추가" }));
		fireEvent.click(await screen.findByRole("button", { name: "추가" }));

		await waitFor(() => {
			expect(within(screen.getByRole("dialog")).getByText("국가를 찾을 수 없습니다.")).toBeTruthy();
		});
	});
});
