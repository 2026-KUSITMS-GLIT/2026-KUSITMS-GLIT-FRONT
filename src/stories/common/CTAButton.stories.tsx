import type { Meta, StoryObj } from "@storybook/nextjs";

import EyeOpenIcon from "@/assets/icons/icon_eye_open.svg";
import CTAButton from "@/components/common/CTAButton";

const meta = {
  title: "Common/CTAButton",
  component: CTAButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CTAButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GradientWithIcon: Story = {
  args: {
    variant: "gradient",
    size: "lg",
    leftIcon: <EyeOpenIcon />,
    children: "텍스트 입력하기",
    fullWidth: true,
  },
};

export const PrimaryLarge: Story = {
  args: {
    variant: "primary",
    size: "lg",
    leftIcon: <EyeOpenIcon />,
    rightIcon: <EyeOpenIcon />,
    children: "텍스트 입력하기",
    fullWidth: true,
  },
};

export const GrayLarge: Story = {
  args: {
    variant: "gray",
    size: "lg",
    leftIcon: <EyeOpenIcon />,
    rightIcon: <EyeOpenIcon />,
    children: "텍스트 입력하기",
    fullWidth: true,
  },
};

export const PrimaryMedium: Story = {
  args: {
    variant: "primary",
    size: "md",
    leftIcon: <EyeOpenIcon />,
    rightIcon: <EyeOpenIcon />,
    children: "텍스트 입력하기",
    fullWidth: false,
  },
};

export const GrayMedium: Story = {
  args: {
    variant: "gray",
    size: "md",
    leftIcon: <EyeOpenIcon />,
    rightIcon: <EyeOpenIcon />,
    children: "텍스트 입력하기",
    fullWidth: false,
  },
};

export const AllVariants: Story = {
  args: { children: "텍스트 입력하기" },
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <div className="flex flex-col gap-4">
        <CTAButton variant="gradient" size="lg" leftIcon={<EyeOpenIcon />} fullWidth>
          텍스트 입력하기
        </CTAButton>
      </div>

      <div className="flex flex-col gap-4">
        <CTAButton
          variant="primary"
          size="lg"
          leftIcon={<EyeOpenIcon />}
          rightIcon={<EyeOpenIcon />}
          fullWidth>
          텍스트 입력하기
        </CTAButton>
        <CTAButton
          variant="gray"
          size="lg"
          leftIcon={<EyeOpenIcon />}
          rightIcon={<EyeOpenIcon />}
          fullWidth>
          텍스트 입력하기
        </CTAButton>
      </div>

      <div className="flex flex-col items-center gap-4">
        <CTAButton
          variant="primary"
          size="md"
          leftIcon={<EyeOpenIcon />}
          rightIcon={<EyeOpenIcon />}
          fullWidth={false}>
          텍스트 입력하기
        </CTAButton>
        <CTAButton
          variant="gray"
          size="md"
          leftIcon={<EyeOpenIcon />}
          rightIcon={<EyeOpenIcon />}
          fullWidth={false}>
          텍스트 입력하기
        </CTAButton>
      </div>
    </div>
  ),
};
