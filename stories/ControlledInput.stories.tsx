import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import ControlledInput from "../src/controlled-input";

const meta = {
  title: "UI/ControlledInput", component: ControlledInput,
  args: { label: "이름", value: "", placeholder: "이름을 입력하세요", onChange: () => {} },
} satisfies Meta<typeof ControlledInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Multiline: Story = { args: { multiline: true, label: "설명", rows: 4 } };
export const Disabled: Story = { args: { disabled: true, value: "비활성 입력" } };
export const Invalid: Story = { args: { invalid: true, required: true } };
export const Interactive: Story = {
  render: function Interactive(args) {
    const [value, setValue] = useState(args.value);
    return <ControlledInput {...args} value={value} onChange={setValue} />;
  },
};
