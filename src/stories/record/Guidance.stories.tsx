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
      <div className="flex min-h-screen w-full items-center justify-center bg-black text-white">
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
  render: () => <Guidance variant="drop">작성 가이드</Guidance>,
};

export const AllVariants: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-black p-10">
      <div className="mx-auto flex w-222 max-w-full flex-row gap-12">
        <section className="rounded-8 border-sea-blue-300 flex flex-1 flex-col items-center gap-2 border border-dashed p-11">
          <p className="body-3 text-offwhite-300">Default</p>
          <Guidance>작성 가이드</Guidance>
        </section>

        <section className="rounded-8 border-sea-blue-300 flex flex-1 flex-col items-center gap-2 border border-dashed p-11">
          <p className="body-3 text-offwhite-300">Drop</p>
          <Guidance variant="drop">작성 가이드</Guidance>
        </section>
      </div>
    </div>
  ),
};
