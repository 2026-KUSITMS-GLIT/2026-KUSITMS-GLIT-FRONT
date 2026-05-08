import type { Meta, StoryObj } from "@storybook/nextjs";

import StarIcon from "@/assets/icons/icon_star_01.svg";
import Chip from "@/components/common/Chip";

const meta = {
  title: "Common/Chip",
  component: Chip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "radio",
      options: ["default", "selected", "unselected"],
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { state: "default", children: "내용 입력" },
};

export const DefaultWithIcon: Story = {
  args: { state: "default", leftIcon: <StarIcon />, children: "내용 입력" },
};

export const Selected: Story = {
  args: { state: "selected", children: "내용 입력" },
};

export const SelectedWithIcon: Story = {
  args: { state: "selected", leftIcon: <StarIcon />, children: "내용 입력" },
};

export const Unselected: Story = {
  args: { state: "unselected", children: "내용 입력" },
};

export const UnselectedWithIcon: Story = {
  args: { state: "unselected", leftIcon: <StarIcon />, children: "내용 입력" },
};

export const AllStates: Story = {
  args: { children: null },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip>내용 입력</Chip>
      <Chip state="selected">내용 입력</Chip>
      <Chip state="unselected">내용 입력</Chip>
      <Chip leftIcon={<StarIcon />}>내용 입력</Chip>
      <Chip state="selected" leftIcon={<StarIcon />}>
        내용 입력
      </Chip>
      <Chip state="unselected" leftIcon={<StarIcon />}>
        내용 입력
      </Chip>
    </div>
  ),
};
