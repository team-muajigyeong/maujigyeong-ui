"use client";

import { useId, useState } from "react";
import type { ComponentPropsWithRef, Dispatch, ReactNode, SetStateAction } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import useMount from "../internal/use-mount.js";

import styles from "./style.module.css";

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

export type AOSTextFieldProps = ComponentPropsWithRef<"input"> & {
  type?: "text" | "password" | "email" | "url" | "search" | "tel" | "date";
  /** Visible label associated with the input. */
  label: string;
  icon?: ReactNode;
  /** Controlled text value. Use with setValue; avoid mixing with native value/onChange. */
  getValue?: string;
  /** Parent state setter for getValue. Omit both props for internal state. */
  setValue?: Dispatch<SetStateAction<string>>;
  /** Default or compact field spacing. */
  density?: "default" | "compact";
  /** Floating label or stacked label above the input. */
  labelPlacement?: "floating" | "stacked";
};

/** Text input with optional icon, label layout and password visibility toggle. */
export function AOSTextField({
  getValue,
  setValue,
  icon,
  type = "text",
  className,
  id: idProps,
  label,
  density = "default",
  labelPlacement = "floating",
  ...attrs
}: AOSTextFieldProps) {
  const [isValueShown, showValue] = useState<boolean>(() => type !== "password");
  const [_getValue, _setValue] = useState<string>("");
  const [currentValue, updateValue] = [getValue ?? _getValue, setValue ?? _setValue];
  const automatedId = useId();
  const didMount = useMount();
  const uid = didMount ? (idProps ?? automatedId) : idProps;

  return (
    <label className={cx(styles["txtfield-wrapper"], styles.aos, density === "compact" && styles.compact, labelPlacement === "stacked" && styles.stacked, currentValue?.length ? styles.fill : "", className)} htmlFor={uid}>
      <span className={styles["label-text"]}>
        {icon}
        <span>{label}</span>
      </span>
      <input
        onChange={(event) => {
          updateValue(event.target.value);
        }}
        type={type !== "password" ? type : isValueShown ? "text" : "password"}
        id={uid}
        value={currentValue}
        {...attrs}
      />

      {type === "password" && (
        <button
          type="button"
          className={styles["btn-show-password"]}
          aria-label="비밀번호 보기"
          aria-pressed={isValueShown}
          onClick={() => {
            showValue(!isValueShown);
          }}
        >
          {isValueShown ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </label>
  );
}
