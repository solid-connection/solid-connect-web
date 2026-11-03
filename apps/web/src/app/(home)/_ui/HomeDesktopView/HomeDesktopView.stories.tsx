import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { HomeUniversityName, type ListUniversity } from "@/types/university";
import { HomeUniversitySearchProvider } from "../HomeUniversitySearchSection/_hooks/HomeUniversitySearchProvider";
import { getHomeDesktopData } from "./_utils/getHomeDesktopData";
import HomeDesktopView from "./index";

const universities: ListUniversity[] = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  term: "2027-1",
  homeUniversityName: HomeUniversityName.INHA,
  koreanName: `교환학생 파견대학교 ${index + 1}`,
  country: "독일",
  region: "유럽권",
  logoImageUrl: "/svgs/placeholders/university-logo-placeholder.svg",
  backgroundImageUrl: "/svgs/placeholders/university-background-placeholder.svg",
  studentCapacity: 3,
  languageRequirements: [{ languageTestType: "TOEFL_IBT", minScore: "80" }],
}));
const meta = {
  title: "Screens/HomeDesktop",
  component: HomeDesktopView,
  parameters: { layout: "fullscreen" },
  args: { recommendedUniversities: universities, desktopData: getHomeDesktopData(universities), newsList: [] },
  decorators: [
    (Story) => (
      <HomeUniversitySearchProvider>
        <Story />
      </HomeUniversitySearchProvider>
    ),
  ],
  beforeEach: () => {
    const previous = useAuthStore.getState();
    useAuthStore.getState().clearAccessToken();
    return () => useAuthStore.setState(previous);
  },
} satisfies Meta<typeof HomeDesktopView>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Guest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const form = canvas.getByRole("region", { name: "파견학교 검색" });
    await userEvent.click(within(form).getByRole("button", { name: "경희대" }));
    await expect(canvas.getByRole("link", { name: "학교 검색하기" })).toHaveAttribute("href", "/university/kyunghee");
  },
};
export const Authenticated: Story = {
  beforeEach: () => {
    useAuthStore
      .getState()
      .setAccessToken(`header.${btoa(JSON.stringify({ sub: 101, role: "MENTEE", exp: 7258118400 }))}.story`);
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "빠른 실행" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "성적 입력하기" })).toHaveAttribute("href", "/university/score");
    await expect(canvas.queryByRole("region", { name: "파견학교 검색" })).not.toBeInTheDocument();
  },
};
export const Empty: Story = {
  args: { recommendedUniversities: [], desktopData: getHomeDesktopData([]) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("표시할 파견학교가 없어요.")).toBeVisible();
    await expect(canvas.getByRole("link", { name: "학교 검색하기" })).toBeVisible();
  },
};
const longNames = universities.map((university) => ({
  ...university,
  koreanName: "매우 긴 이름의 국제 교환학생 파견 프로그램을 운영하는 테스트 대학교",
}));
export const LongSchoolNames: Story = {
  args: { recommendedUniversities: longNames, desktopData: getHomeDesktopData(longNames) },
};
export const NarrowContent: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 680 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const card = within(canvasElement)
      .getAllByRole("link")
      .find((link) => link.getAttribute("href") === "/university/inha/1")!;
    await expect(card.getBoundingClientRect().width).toBeGreaterThanOrEqual(220);
  },
};
export const ImageFailure: Story = {
  args: {
    recommendedUniversities: universities.map((university) => ({
      ...university,
      backgroundImageUrl: "/missing-story-image.png",
    })),
  },
  play: async ({ canvasElement }) => {
    const image = within(canvasElement).getByRole("img", {
      name: "교환학생 파견대학교 1 배경 이미지",
    }) as HTMLImageElement;
    await waitFor(() => expect(image.naturalWidth).toBeGreaterThan(0));
    await expect(image.getAttribute("src")).toContain("university-background-placeholder.svg");
  },
};
