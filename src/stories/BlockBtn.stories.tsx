import BlockBtn from "@/components/button/BlockBtn";

import type { Meta, StoryObj } from "@storybook/react";

/**
 * BlockBtn은 페이지 하단이나 컨테이너 내에서 주요 액션을 위한 전체 너비 버튼 컴포넌트입니다.
 * 사용자가 다음 단계로 진행하거나 작업을 완료하는 등의 주요 동작에 사용됩니다.
 */
const meta: Meta<typeof BlockBtn> = {
  title: "Components/Button/BlockBtn",
  component: BlockBtn,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary"],
      description: "버튼의 스타일 변형",
      defaultValue: "default",
    },
    onClick: { action: "clicked", description: "클릭 핸들러 함수" },
    disabled: {
      control: "boolean",
      description: "버튼 비활성화 여부",
      defaultValue: false,
    },
    children: {
      control: "text",
      description: "버튼 내부 텍스트 또는 요소",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BlockBtn>;

/**
 * 기본 Primary 스타일 버튼입니다.
 */
export const Primary: Story = {
  args: {
    children: "확인",
    onClick: () => console.log("Primary 버튼 클릭됨"),
    variant: "default",
    disabled: false,
  },
  render: (args) => (
    <div className="w-[360px]">
      <BlockBtn {...args} />
    </div>
  ),
};

/**
 * Secondary 스타일 버튼입니다.
 */
export const Secondary: Story = {
  args: {
    children: "다음",
    onClick: () => console.log("Secondary 버튼 클릭됨"),
    variant: "secondary",
    disabled: false,
  },
  render: (args) => (
    <div className="w-[360px]">
      <BlockBtn {...args} />
    </div>
  ),
};

/**
 * 비활성화된 상태의 버튼입니다.
 */
export const Disabled: Story = {
  args: {
    children: "제출하기",
    onClick: () => console.log("Disabled 버튼 클릭됨"),
    variant: "default",
    disabled: true,
  },
  render: (args) => (
    <div className="w-[360px]">
      <BlockBtn {...args} />
    </div>
  ),
};

/**
 * 롱 텍스트가 있는 버튼입니다.
 */
export const LongText: Story = {
  args: {
    children: "이 버튼은 매우 긴 텍스트를 포함하고 있습니다",
    onClick: () => console.log("LongText 버튼 클릭됨"),
    variant: "default",
    disabled: false,
  },
  render: (args) => (
    <div className="w-[360px]">
      <BlockBtn {...args} />
    </div>
  ),
};

/**
 * 모바일 환경을 시뮬레이션하는 버튼 레이아웃입니다.
 */
export const MobileLayout: Story = {
  args: {
    children: "신청하기",
    onClick: () => console.log("MobileLayout 버튼 클릭됨"),
    variant: "default",
  },
  render: (args) => (
    <div className="flex h-[100px] w-[375px] items-end bg-white p-5">
      <BlockBtn {...args} />
    </div>
  ),
};

/**
 * 여러 버튼을 함께 보여주는 예시입니다.
 */
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex w-[375px] flex-col gap-4 p-5">
      <BlockBtn variant="default" onClick={() => console.log("확인 버튼 클릭")}>
        확인
      </BlockBtn>
      <BlockBtn variant="secondary" onClick={() => console.log("취소 버튼 클릭")}>
        취소
      </BlockBtn>
      <BlockBtn variant="default" onClick={() => {}} disabled>
        비활성화
      </BlockBtn>
    </div>
  ),
};
