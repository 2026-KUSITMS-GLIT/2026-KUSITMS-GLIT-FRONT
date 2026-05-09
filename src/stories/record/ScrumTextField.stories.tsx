import type { Meta, StoryObj } from "@storybook/nextjs";

import ScrumTextField from "@/components/record/ScrumTextField";

const meta = {
  title: "Record/ScrumTextField",
  component: ScrumTextField,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ScrumTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
