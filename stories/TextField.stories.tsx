import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AOSTextField } from "../src/text-field";

const meta = { title: "UI/TextField", component: AOSTextField,
  args: { label: "입력값" } } satisfies Meta<typeof AOSTextField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Password: Story = { args: { type: "password", label: "비밀번호" } };
export const Compact: Story = { args: { density: "compact" } };
export const Stacked: Story = { args: { labelPlacement: "stacked", icon: <span aria-hidden="true">@</span> } };
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { args: { readOnly: true, getValue: "읽기 전용" } };
export const Controlled: Story = { render: function Controlled(args) {
  const [value, setValue] = useState("초기값");
  return <><AOSTextField {...args} id="controlled-field" getValue={value} setValue={setValue} />
    <output>{value}</output><button onClick={() => setValue("")}>지우기</button></>;
} };
export const Multiple: Story = { render: function Multiple() {
  return <><AOSTextField label="첫 번째" /><AOSTextField label="두 번째" /></>;
} };
export const NativeControlled: Story = { render: function NativeControlled(args) {
  const [value, setValue] = useState("");
  return <><AOSTextField {...args} labelPlacement="stacked" value={value} onChange={e => setValue(e.target.value)} />
    <output>{value}</output><button onClick={() => setValue("")}>지우기</button></>;
} };
