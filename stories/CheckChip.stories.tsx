import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import CheckChip from "../src/check-chip";

const meta = {
  title: "UI/CheckChip", component: CheckChip,
  args: { label: "알림 받기", description: "선택 옵션에 대한 설명", checked: false, onChange: () => {} },
} satisfies Meta<typeof CheckChip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Interactive: Story = {
  render: function Interactive(args) {
    const [checked, setChecked] = useState(args.checked);
    return <CheckChip {...args} checked={checked} onChange={setChecked} />;
  },
};
