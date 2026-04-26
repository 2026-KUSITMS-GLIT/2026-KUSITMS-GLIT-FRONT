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
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;


export const GradientWithIcon: Story = {
  args: { variant: "gradient", size: "lg", leftIcon: <EyeOpenIcon />, children: "텍스트 입력하기", fullWidth: true },
};

export const PrimaryLarge: Story = {
  args: { variant: "primary", size: "lg", leftIcon: <EyeOpenIcon />, rightIcon: <EyeOpenIcon />, children: "텍스트 입력하기", fullWidth: true },
};

export const GrayLarge: Story = {
  args: { variant: "gray", size: "lg", leftIcon: <EyeOpenIcon />, rightIcon: <EyeOpenIcon />, children: "텍스트 입력하기", fullWidth: true },
};

export const PrimaryMedium: Story = {
  args: { variant: "primary", size: "md", leftIcon: <EyeOpenIcon />, rightIcon: <EyeOpenIcon />, children: "텍스트 입력하기", fullWidth: false },
};

export const GrayMedium: Story = {
  args: { variant: "gray", size: "md", leftIcon: <EyeOpenIcon />, rightIcon: <EyeOpenIcon />, children: "텍스트 입력하기", fullWidth: false },
};

export const AllVariants: Story = {
  args: { children: "텍스트 입력하기" },
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-sm">
      <div className="flex flex-col gap-4">
        <Button variant="gradient" size="lg" leftIcon={<EyeOpenIcon />} fullWidth>텍스트 입력하기</Button>
      </div>

      <div className="flex flex-col gap-4">
        <Button variant="primary" size="lg" leftIcon={<EyeOpenIcon />} rightIcon={<EyeOpenIcon />} fullWidth>텍스트 입력하기</Button>
        <Button variant="gray" size="lg" leftIcon={<EyeOpenIcon />} rightIcon={<EyeOpenIcon />} fullWidth>텍스트 입력하기</Button>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <Button variant="primary" size="md" leftIcon={<EyeOpenIcon />} rightIcon={<EyeOpenIcon />} fullWidth={false}>텍스트 입력하기</Button>
        <Button variant="gray" size="md" leftIcon={<EyeOpenIcon />} rightIcon={<EyeOpenIcon />} fullWidth={false}>텍스트 입력하기</Button>
      </div>
    </div>
  ),
};
