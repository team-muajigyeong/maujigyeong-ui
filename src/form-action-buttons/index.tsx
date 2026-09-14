"use client";

import styles from "./style.module.css";

export type FormActionButtonsProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  /** Keeps the button focusable but suppresses confirmation while work is pending. */
  confirmBusy?: boolean;
  cancelDisabled?: boolean;
  className?: string;
  /** Additional class for the cancel button; owned by the consuming app. */
  cancelButtonClassName?: string;
  /** Additional class for the confirm button; owned by the consuming app. */
  confirmButtonClassName?: string;
  density?: "default" | "compact";
};

/** Renders cancel and confirm actions with consumer-owned callbacks and styles. */
export default function FormActionButtons({
  cancelLabel = "취소",
  confirmLabel = "저장",
  onCancel,
  onConfirm,
  confirmDisabled = false,
  confirmBusy = false,
  cancelDisabled = false,
  className = "",
  density = "default",
  cancelButtonClassName,
  confirmButtonClassName,
}: FormActionButtonsProps) {
  return (
    <div className={[styles.wrapper, density === "compact" ? styles.compact : "", className].filter(Boolean).join(" ")}>
      <button
        type="button"
        className={[styles.cancelButton, cancelButtonClassName].filter(Boolean).join(" ")}
        onClick={onCancel}
        disabled={cancelDisabled}
      >
        <span>{cancelLabel}</span>
      </button>
      <button
        type="button"
        className={[styles.confirmButton, confirmButtonClassName].filter(Boolean).join(" ")}
        onClick={() => { if (!confirmBusy) onConfirm(); }}
        disabled={confirmDisabled}
        aria-disabled={confirmDisabled || confirmBusy}
      >
        <span>{confirmLabel}</span>
      </button>
    </div>
  );
}
