import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import FormActionButtons from "../src/form-action-buttons";
const meta = { title: "UI/FormActionButtons", component: FormActionButtons,
  args: { onCancel: () => {}, onConfirm: () => {} } } satisfies Meta<typeof FormActionButtons>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: { density: "compact" } };
export const Busy: Story = { args: { confirmBusy: true, confirmLabel: "저장 중" } };
export const Disabled: Story = { args: { confirmDisabled: true, cancelDisabled: true } };
export const Interactive: Story = { render: function Interactive(args) {
  const [confirmed, setConfirmed] = useState(0);
  const [cancelled, setCancelled] = useState(0);
  const [busy, setBusy] = useState(false);
  return <><label><input type="checkbox" checked={busy} onChange={e => setBusy(e.target.checked)} />처리 중</label>
    <FormActionButtons {...args} confirmBusy={busy} cancelButtonClassName="consumer-cancel" confirmButtonClassName="consumer-confirm"
      onCancel={() => setCancelled(n => n + 1)} onConfirm={() => setConfirmed(n => n + 1)} />
    <output>확인 {confirmed}, 취소 {cancelled}</output></>;
} };
