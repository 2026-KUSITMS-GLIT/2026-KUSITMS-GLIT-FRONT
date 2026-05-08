import type { Meta, StoryObj } from "@storybook/nextjs";

import Guidance from "@/components/record/Guidance";

const meta = {
  title: "Record/Guidance",
  component: Guidance,
  parameters: {
    layout: "centered",
  },
  decorators: [
    Story => (
      <div className="flex h-40 w-180 items-center justify-center bg-black text-white">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Guidance>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Guidance>작성 가이드</Guidance>,
};

export const Drop: Story = {
  render: () => <Guidance variant="drop">회고 작성 가이드</Guidance>,
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col items-center justify-center gap-6">
      <Guidance>작성 가이드</Guidance>
      <Guidance variant="drop">회고 작성 가이드</Guidance>
    </div>
  ),
};
