"use client";

import type { ChangeEvent, HTMLInputTypeAttribute } from "react";

import styles from "./style.module.css";

export type ControlledInputProps = {
  /** Visible and accessible field label. */
  label: string;
  /** Text shown when no value is selected. */
  placeholder?: string;
  /** Controlled value supplied by the parent. */
  value: string;
  /** Receives the next value; update the parent state in this callback. */
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  readOnly?: boolean;
  /** Disables user input. */
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  name?: string;
  id?: string;
  /** Marks the field as invalid for assistive technology. */
  invalid?: boolean;
  /** ID of the element containing error or help text. */
  describedBy?: string;
  /** Renders a textarea instead of an input. */
  multiline?: boolean;
  /** Visible row count for multiline input. */
  rows?: number;
};

/**
 * Shared controlled UI; application state and domain data remain with the consumer.
 * @param props Display and interaction options.
 */
export default function ControlledInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  readOnly = false,
  disabled = false,
  required = false,
  maxLength,
  name,
  id,
  invalid,
  describedBy,
  multiline = false,
  rows = 4,
}: ControlledInputProps) {
  const commonProps = {
    id,
    "aria-invalid": invalid || undefined,
    "aria-describedby": describedBy,
    name,
    placeholder,
    value,
    readOnly,
    disabled,
    required,
    maxLength,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value),
  };

  return (
    <label className={styles.field}>
      <span>{label}</span>
      {multiline ? (
        <textarea {...commonProps} rows={rows} />
      ) : (
        <input {...commonProps} type={type} />
      )}
    </label>
  );
}
