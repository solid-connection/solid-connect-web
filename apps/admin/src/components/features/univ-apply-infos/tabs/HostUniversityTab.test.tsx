import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { adminApi } from "@/lib/api/admin";
import { HostUniversityTab } from "./HostUniversityTab";

const { toastError, toastSuccess } = vi.hoisted(() => ({
	toastError: vi.fn(),
	toastSuccess: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { error: toastError, success: toastSuccess } }));
vi.mock("@tanstack/react-query", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-query")>();
	return { ...actual, useQueries: () => [] };
});

function renderTab() {
	const client = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	return render(
		<QueryClientProvider client={client}>
			<HostUniversityTab />
		</QueryClientProvider>,
	);
}

async function openCreateModal() {
	renderTab();
	fireEvent.click(await screen.findByRole("button", { name: "호스트 대학교 생성" }));
}

describe("HostUniversityTab image uploads", () => {
	beforeEach(() => {
		vi.spyOn(adminApi, "getHostUniversities").mockResolvedValue({
			content: [],
			page: 0,
			size: 20,
			totalElements: 0,
			totalPages: 0,
		});
		vi.stubGlobal("URL", {
			createObjectURL: vi.fn(() => "blob:mock-url"),
			revokeObjectURL: vi.fn(),
		});
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		toastError.mockReset();
		toastSuccess.mockReset();
	});

	it("shows logo preview immediately after file selection without calling the API", async () => {
		await openCreateModal();
		const file = new File(["logo"], "logo.png", { type: "image/png" });
		fireEvent.change(screen.getByLabelText("로고 이미지 파일"), { target: { files: [file] } });

		await waitFor(() => expect(screen.getByRole("img", { name: "로고 미리보기" })).toBeTruthy());
		expect(toastError).not.toHaveBeenCalled();
	});

	it("shows background preview immediately after file selection without calling the API", async () => {
		await openCreateModal();
		const file = new File(["bg"], "background.png", { type: "image/png" });
		fireEvent.change(screen.getByLabelText("배경 이미지 파일"), { target: { files: [file] } });

		await waitFor(() => expect(screen.getByRole("img", { name: "배경 미리보기" })).toBeTruthy());
		expect(toastError).not.toHaveBeenCalled();
	});

	it("shows an error toast and does not submit when files are not selected on create", async () => {
		const create = vi.spyOn(adminApi, "createHostUniversity").mockResolvedValue({} as never);
		await openCreateModal();

		fireEvent.change(screen.getByLabelText("한글명 *"), { target: { value: "테스트 대학교" } });
		fireEvent.change(screen.getByLabelText("영문명 *"), { target: { value: "Test University" } });
		fireEvent.change(screen.getByLabelText("표시명 *"), { target: { value: "Test U" } });
		fireEvent.change(screen.getByLabelText("국가코드 *"), { target: { value: "JP" } });
		fireEvent.change(screen.getByLabelText("권역코드 *"), { target: { value: "ASIA" } });

		fireEvent.click(screen.getByRole("button", { name: "생성" }));

		await waitFor(() => expect(toastError).toHaveBeenCalledWith("로고 및 배경 이미지를 모두 선택해 주세요."));
		expect(create).not.toHaveBeenCalled();
	});

	it("calls createHostUniversity with form data and selected files on submit", async () => {
		const create = vi.spyOn(adminApi, "createHostUniversity").mockResolvedValue({} as never);
		await openCreateModal();

		fireEvent.change(screen.getByLabelText("한글명 *"), { target: { value: "테스트 대학교" } });
		fireEvent.change(screen.getByLabelText("영문명 *"), { target: { value: "Test University" } });
		fireEvent.change(screen.getByLabelText("표시명 *"), { target: { value: "Test U" } });
		fireEvent.change(screen.getByLabelText("국가코드 *"), { target: { value: "JP" } });
		fireEvent.change(screen.getByLabelText("권역코드 *"), { target: { value: "ASIA" } });

		const logoFile = new File(["logo"], "logo.png", { type: "image/png" });
		const backgroundFile = new File(["bg"], "bg.png", { type: "image/png" });
		fireEvent.change(screen.getByLabelText("로고 이미지 파일"), { target: { files: [logoFile] } });
		fireEvent.change(screen.getByLabelText("배경 이미지 파일"), { target: { files: [backgroundFile] } });

		fireEvent.click(screen.getByRole("button", { name: "생성" }));

		await waitFor(() =>
			expect(create).toHaveBeenCalledWith(
				expect.objectContaining({ koreanName: "테스트 대학교", countryCode: "JP" }),
				logoFile,
				backgroundFile,
			),
		);
	});
});
