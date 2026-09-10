"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import styles from "./style.module.css";

export type ChoiceSelectOption = {
  /** Controlled value supplied by the parent. */
  value: string;
  /** Visible and accessible field label. */
  label: string;
};

export type ChoiceSelectProps = {
  /** Controlled value supplied by the parent. */
  value: string;
  /** Available values and their display labels. */
  options: readonly ChoiceSelectOption[];
  /** Receives the next value; update the parent state in this callback. */
  onChange: (value: string) => void;
  /** Text shown when no value is selected. */
  placeholder: string;
  /** Accessible name for the selection control. */
  ariaLabel?: string;
  /** ID of the element containing help text. */
  ariaDescribedBy?: string;
  /** Disables user input. */
  disabled?: boolean;
};

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

/**
 * Shared controlled UI; application state and domain data remain with the consumer.
 * @param props Display and interaction options.
 */
export default function ChoiceSelect({
  value,
  options,
  onChange,
  placeholder,
  ariaLabel,
  ariaDescribedBy,
  disabled = false,
}: ChoiceSelectProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isOpen, setIsOpen] = useState(false);

  const selectedIndex = useMemo(() => options.findIndex((option) => option.value === value), [options, value]);
  const selectedLabel = selectedIndex >= 0 ? options[selectedIndex]?.label ?? placeholder : placeholder;
  const accessibleLabel = ariaLabel
    ? selectedIndex >= 0
      ? `${ariaLabel}, 현재 ${selectedLabel}`
      : ariaLabel
    : undefined;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!rootRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const nextIndex = selectedIndex >= 0 ? selectedIndex : 0;
    optionRefs.current[nextIndex]?.focus();
  }, [isOpen, selectedIndex]);

  const openList = () => {
    if (disabled) {
      return;
    }

    setIsOpen(true);
  };

  const closeList = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const selectOption = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const moveFocus = (currentIndex: number, direction: 1 | -1) => {
    const nextIndex = (currentIndex + direction + options.length) % options.length;
    optionRefs.current[nextIndex]?.focus();
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        ref={buttonRef}
        type="button"
        className={cx(styles.trigger, disabled && styles.isDisabled)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`choice-list-${id}`}
        aria-label={accessibleLabel}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        onClick={() => {
          if (isOpen) {
            closeList();
            return;
          }

          openList();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openList();
          }
        }}
      >
        <span className={styles.label}>{selectedLabel}</span>
        <span className={styles.icon}>
          <FaChevronDown aria-hidden="true" />
        </span>
      </button>

      {isOpen ? (
        <div
          id={`choice-list-${id}`}
          className={styles.list}
          role="listbox"
          aria-label={ariaLabel ?? placeholder}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              id={`choice-option-${id}-${index}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={cx(styles.option, option.value === value && styles.isSelected)}
              onClick={() => {
                selectOption(option.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  moveFocus(index, 1);
                }

                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  moveFocus(index, -1);
                }

                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  selectOption(option.value);
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  closeList();
                }

                if (event.key === "Tab") {
                  setIsOpen(false);
                }
              }}
            >
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
