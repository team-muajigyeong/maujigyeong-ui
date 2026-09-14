"use client";

import { useEffect, useState } from "react";

import styles from "./style.module.css";

export type StatusToastProps = {
  /** Visible message. An empty string hides the toast. */
  message: string;
  /** Alternative announcement for assistive technology. */
  announcement?: string;
  /** Visibility duration in milliseconds. Defaults to 5000. */
  duration?: number;
  /** Change this value to show the same message again. */
  notificationId?: string | number;
  /** Consumer styling, including position. */
  className?: string;
  tone?: "default" | "error";
};

/** Announces transient feedback without moving focus. */
export default function StatusToast({ message, announcement, duration = 5000, tone = "default", notificationId, className }: StatusToastProps) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timeoutId = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(timeoutId);
  }, [duration, message, notificationId]);

  return (
    <div
      className={[styles.toast, className].filter(Boolean).join(" ")}
      data-visible={message && visible ? "true" : "false"}
      data-tone={tone}
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      aria-relevant="additions text"
    >
      {announcement ? (
        <span key={notificationId}>
          <span aria-hidden="true">{message}</span>
          <span className={styles.visuallyHidden}>{announcement}</span>
        </span>
      ) : (
        <span key={notificationId}>{message}</span>
      )}
    </div>
  );
}
