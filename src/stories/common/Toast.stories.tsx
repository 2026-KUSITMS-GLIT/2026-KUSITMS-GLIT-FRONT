import type { Meta, StoryObj } from "@storybook/nextjs";

import Toast from "@/components/common/Toast";

const meta = {
  title: "Common/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    contents: "내용 입력",
  },
};

export const WithoutLeftIcon: Story = {
  args: {
    contents: "내용 입력",
    showLeftIcon: false,
  },
};

export const WithoutCloseButton: Story = {
  args: {
    contents: "내용 입력",
    showCloseButton: false,
  },
};

export const MaxContents: Story = {
  args: {
    contents: "최대 31글자 내용 입력 테스트입니다 여기까지",
  },
};
