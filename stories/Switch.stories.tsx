import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Switch from "../src/switch";

const meta = { title: "UI/Switch", component: Switch,
  args: { label: "알림 사용" } } satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Controlled: Story = { render: function Controlled(args) {
  const [pressed, setPressed] = useState(true);
  const [changes, setChanges] = useState(0);
  return <><Switch {...args} id="controlled-switch" pressed={pressed} setPressed={setPressed}
    labelClassName="consumer-label" className="consumer-input"
    onChangeCallback={() => setChanges(n => n + 1)} />
    <output>상태 {String(pressed)}, 변경 {changes}</output>
    <button onClick={() => setPressed(true)}>외부에서 켜기</button></>;
} };
export const CallbackControlled: Story = { render: function CallbackControlled(args) {
  const [pressed, setPressed] = useState(true);
  return <><Switch {...args} pressed={pressed} setPressed={() => undefined} onChangeCallback={setPressed} />
    <output>{String(pressed)}</output></>;
} };
export const Multiple: Story = { render: function Multiple() {
  return <><Switch label="첫 번째" /><Switch label="두 번째" ariaLabel="두 번째 설정" /></>;
} };
