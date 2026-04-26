import type { Meta, StoryObj } from "@storybook/nextjs";

import TextField from "@/components/common/TextField";

const meta = {
  title: "Common/TextField",
  component: TextField,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "내용 입력",
  },
};

export const WithRightIcon: Story = {
  args: {
    placeholder: "내용 입력",
    rightIcon: <div className="size-6 bg-sea-blue-500 rounded-sm" />,
  },
};

export const ErrorState: Story = {
  args: {
    variant: "error",
    placeholder: "내용 입력",
    errorMessage: "내용 입력",
    rightIcon: <div className="size-6 bg-sea-blue-500 rounded-sm" />,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-12 mt-12">
      <div className="flex flex-col gap-2">
        <label className="text-gray-600 body-4">기본 상태</label>
        <TextField placeholder="내용 입력" rightIcon={<div className="size-6 bg-sea-blue-500 rounded-sm" />} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-gray-600 body-4">포커스(탭) 상태 - 탭해보세요!</label>
        <TextField placeholder="내용 입력" autoFocus rightIcon={<div className="size-6 bg-sea-blue-500 rounded-sm" />} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-gray-600 body-4">에러 상태</label>
        <TextField variant="error" placeholder="내용 입력" errorMessage="내용 입력" rightIcon={<div className="size-6 bg-sea-blue-500 rounded-sm" />} />
      </div>
    </div>
  ),
};
