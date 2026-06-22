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
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
		toastError.mockReset();
		toastSuccess.mockReset();
	});

	it("uploads a selected logo with formatName and writes the returned URL", async () => {
		const upload = vi
			.spyOn(adminApi, "uploadAdminUniversityLogo")
			.mockResolvedValue({ fileUrl: "admin/logo/test.webp" });
		await openCreateModal();
		fireEvent.change(screen.getByLabelText("표시명 *"), { target: { value: "university_of_test" } });
		const file = new File(["logo"], "logo.png", { type: "image/png" });
		fireEvent.change(screen.getByLabelText("로고 이미지 파일"), { target: { files: [file] } });

		await waitFor(() => expect(upload).toHaveBeenCalledWith(file, "university_of_test"));
		await waitFor(() =>
			expect((screen.getByLabelText("로고 이미지 URL *") as HTMLInputElement).value).toBe("admin/logo/test.webp"),
		);
	});

	it("does not upload when formatName is blank", async () => {
		const upload = vi.spyOn(adminApi, "uploadAdminUniversityLogo");
		await openCreateModal();
		const file = new File(["logo"], "logo.png", { type: "image/png" });
		fireEvent.change(screen.getByLabelText("로고 이미지 파일"), { target: { files: [file] } });

		expect(upload).not.toHaveBeenCalled();
		expect(toastError).toHaveBeenCalledWith("표시명을 먼저 입력해 주세요.");
	});

	it("preserves the current background URL when upload fails", async () => {
		vi.spyOn(adminApi, "uploadAdminUniversityBackground").mockRejectedValue(new Error("업로드 실패"));
		await openCreateModal();
		fireEvent.change(screen.getByLabelText("표시명 *"), { target: { value: "university_of_test" } });
		const urlInput = screen.getByLabelText("배경 이미지 URL *") as HTMLInputElement;
		fireEvent.change(urlInput, { target: { value: "existing/background.webp" } });
		const file = new File(["background"], "background.png", { type: "image/png" });
		fireEvent.change(screen.getByLabelText("배경 이미지 파일"), { target: { files: [file] } });

		await waitFor(() => expect(toastError).toHaveBeenCalledWith("업로드 실패"));
		expect(urlInput.value).toBe("existing/background.webp");
	});
});
