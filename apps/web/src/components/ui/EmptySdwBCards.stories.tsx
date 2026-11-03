import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import EmptySdwBCards from "./EmptySdwBCards";

const meta = { title: "Common/EmptyCards", component: EmptySdwBCards } satisfies Meta<typeof EmptySdwBCards>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const SearchEmpty: Story = { args: { message: "검색 결과가 없어요. 다른 검색어를 입력해주세요." } };
