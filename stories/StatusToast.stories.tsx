import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import StatusToast from "../src/status-toast";
const meta = { title: "UI/StatusToast", component: StatusToast,
  args: { message: "저장했습니다", duration: 5000 } } satisfies Meta<typeof StatusToast>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Error: Story = { args: { message: "저장하지 못했습니다", tone: "error" } };
export const Announcement: Story = { args: { announcement: "변경한 내용을 저장했습니다" } };
export const Repeat: Story = { args: { duration: 2000 }, render: function Repeat(args) {
  const [notificationId, setNotificationId] = useState(0);
  return <><button onClick={() => setNotificationId(n => n + 1)}>같은 메시지 다시 알림</button>
    <StatusToast {...args} notificationId={notificationId} /></>;
} };
