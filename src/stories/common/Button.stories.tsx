import type { Meta, StoryObj } from "@storybook/nextjs";

import EyeOpenIcon from "@/assets/icons/icon_eye_open.svg";
import Button from "@/components/common/Button";

const meta = {
  title: "Common/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    children: "버튼 텍스트",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
  },
};

export const Secondary: Story = {
  args: {
    variant: "gray",
    size: "md",
  },
};

export const WithIcons: Story = {
  args: {
    variant: "primary",
    size: "md",
    leftIcon: <EyeOpenIcon />,
    rightIcon: <EyeOpenIcon />,
    children: "보기",
  },
};

export const FullWidth: Story = {
  args: {
    variant: "primary",
    size: "lg",
    fullWidth: true,
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    size: "md",
    disabled: true,
  },
};

export const AllVariants: Story = {
  args: {
    children: "버튼 텍스트",
  },
  render: () => (
    <div className="flex w-83.75 flex-col gap-8 bg-gray-900 p-10">
      <div className="flex flex-col items-start gap-3">
        <Button variant="primary" size="lg">
          Large Primary
        </Button>
        <Button variant="gray" size="lg">
          Large Secondary
        </Button>
        <Button variant="primary" size="lg" disabled>
          Large Disabled
        </Button>
      </div>

      <div className="flex flex-col items-start gap-3">
        <Button variant="primary" size="md">
          Medium Primary
        </Button>
        <Button variant="gray" size="md">
          Medium Secondary
        </Button>
        <Button variant="primary" size="md" disabled>
          Medium Disabled
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <Button variant="primary" size="lg" leftIcon={<EyeOpenIcon />} rightIcon={<EyeOpenIcon />}>
          아이콘 버튼
        </Button>
        <Button variant="primary" size="lg" fullWidth>
          전체 너비 버튼
        </Button>
      </div>
    </div>
  ),
};
