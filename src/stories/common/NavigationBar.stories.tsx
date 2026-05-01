import type { Meta, StoryObj } from "@storybook/nextjs";

import NavigationBar from "@/components/common/NavigationBar";

const meta = {
  title: "Common/NavigationBar",
  component: NavigationBar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story, context) =>
      context.viewMode === "docs" ? (
        <div className="flex flex-col justify-end" style={{ height: 140 }}>
          <Story />
        </div>
      ) : (
        <div className="flex h-screen flex-col items-center justify-center">
          <Story />
        </div>
      ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  args: {
    activeTab: "home",
  },
};

export const Calender: Story = {
  args: {
    activeTab: "calender",
  },
};

export const Write: Story = {
  args: {
    activeTab: "write",
  },
};

export const Report: Story = {
  args: {
    activeTab: "report",
  },
};

export const Mypage: Story = {
  args: {
    activeTab: "mypage",
  },
};
