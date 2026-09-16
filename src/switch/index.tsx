"use client";

import { useId, useState } from "react";
import type { Dispatch, InputHTMLAttributes, ReactElement, SetStateAction } from "react";
import type { IconType } from "react-icons";

import useMount from "../internal/use-mount.js";

import styles from "./style.module.css";

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

type DeniedAttrib = "type" | "role" | "aria-checked" | "aria-disabled" | "aria-label" | "aria-labelledby";

export type SwitchProps = {
  /** Visible label associated with the switch. */
  label: string;
  /** Optional accessible name overriding the visible label. */
  ariaLabel?: string;
  icon?: ReactElement<IconType>;
  /** Controlled state. Effective only when setPressed is also supplied. */
  pressed?: boolean;
  /** Additional class on the outer label; native className targets the input. */
  labelClassName?: string;
  /** Receives the next state. Use with pressed for parent-controlled state. */
  setPressed?: Dispatch<SetStateAction<boolean>> | ((prev: boolean) => void);
  /** Receives the next state once per user change, in either state mode. */
  onChangeCallback?: (value: boolean) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, DeniedAttrib>;

/** Checkbox-based switch supporting internal state and parent-controlled state. */
export default function Switch({
  label,
  ariaLabel,
  id,
  pressed,
  setPressed,
  onChangeCallback,
  icon,
  labelClassName,
  ...attrs
}: SwitchProps) {
  const [internalPressed, setInternalPressed] = useState(false);
  const isControlled = pressed !== undefined && setPressed !== undefined;
  const didMount = useMount();
  const automatedID = useId();
  const uid = didMount ? (id ?? automatedID) : id;

  const pressedState = isControlled ? pressed : internalPressed;

  const updatePressedState = (value: boolean) => {
    if (isControlled && typeof setPressed === "function") {
      setPressed(value);
      return;
    }

    setInternalPressed(value);
  };

  return (
    <label htmlFor={uid} className={cx(styles.switchLabel, labelClassName)}>
      <b>
        <span>{label}</span>
      </b>
      {icon}
      <input
        {...attrs}
        type="checkbox"
        role="switch"
        aria-label={ariaLabel}
        checked={pressedState}
        id={uid}
        onChange={(event) => {
          const checked = event.currentTarget.checked;
          updatePressedState(checked);
          onChangeCallback?.(checked);
        }}
      />
    </label>
  );
}
