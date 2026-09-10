"use client";

import { useId } from "react";
import styles from "./style.module.css";

export type CheckChipProps = {
  /** Visible and accessible field label. */
  label: string;
  /** Additional description associated with the input. */
  description?: string;
  /** Controlled selection state. */
  checked: boolean;
  /** Receives the next value; update the parent state in this callback. */
  onChange: (checked: boolean) => void;
};

/**
 * Shared controlled UI; application state and domain data remain with the consumer.
 * @param props Display and interaction options.
 */
export default function CheckChip({ label, description, checked, onChange }: CheckChipProps) {
  const id = useId();
  return (
    <label className={[styles.chip, checked ? styles.isChecked : ""].filter(Boolean).join(" ")}>
      <input
        type="checkbox"
        checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={description ? `${id}-description` : undefined}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.text}>
        <span id={`${id}-label`} className={styles.label}>{label}</span>
        {description ? <span id={`${id}-description`} className={styles.description}>{description}</span> : null}
      </span>
    </label>
  );
}
