import type { Meta, StoryObj } from "@storybook/nextjs";

import CTA from "@/components/common/CTA";

const meta = {
  title: "Common/CTA",
  component: CTA,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    children: "텍스트 입력하기",
  },
} satisfies Meta<typeof CTA>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GradientLarge: Story = {
  args: {
    variant: "gradient",
    size: "lg",
    children: "다음 단계로",
  },
};

export const PrimaryLarge: Story = {
  args: {
    variant: "primary",
    size: "lg",
    children: "확인",
  },
};

export const Medium: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "중간 크기 CTA",
  },
};

export const Disabled: Story = {
  args: {
    variant: "gradient",
    size: "lg",
    children: "비활성화 CTA",
    disabled: true,
  },
};

export const AllVariants: Story = {
  args: {
    children: "텍스트 입력하기",
  },
  render: () => (
    <div className="flex w-fit flex-col gap-10 bg-gray-900 p-10">
      <div className="flex flex-col gap-4 rounded-xl border border-dashed border-cyan-400 p-6">
        <CTA variant="gradient" size="lg">
          텍스트 입력하기
        </CTA>
        <CTA variant="gradient" size="lg">
          텍스트 입력하기
        </CTA>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-dashed border-cyan-400 p-6">
        <CTA variant="gradient" size="lg">
          텍스트 입력하기
        </CTA>
        <CTA variant="gradient" size="lg">
          텍스트 입력하기
        </CTA>
        <CTA variant="primary" size="lg" disabled>
          텍스트 입력하기
        </CTA>
      </div>

      <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-cyan-400 p-6">
        <CTA variant="primary" size="md">
          텍스트 입력하기
        </CTA>
        <CTA variant="primary" size="md">
          텍스트 입력하기
        </CTA>
        <CTA variant="primary" size="md" disabled>
          텍스트 입력하기
        </CTA>
      </div>
    </div>
  ),
};
