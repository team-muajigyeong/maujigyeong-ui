"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { FaChevronDown } from "react-icons/fa";

import styles from "./style.module.css";

export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
  /** Accessible panel name. */
  panelLabel?: string;
};

export type AccordionProps = {
  /** Panels with unique IDs. Only one panel opens at a time. */
  items: readonly AccordionItem[];
};

/**
 * Shared controlled UI; application state and domain data remain with the consumer.
 * @param props Display and interaction options.
 */
export default function Accordion({ items }: AccordionProps) {
  const instanceId = useId();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleItem(itemId: string) {
    setExpandedId((current) => current === itemId ? null : itemId);
  }

  return (
    <div className={styles.accordion}>
      {items.map((item) => {
        const isExpanded = expandedId === item.id;
        const buttonId = `${instanceId}-${item.id}-button`;
        const panelId = `${instanceId}-${item.id}-panel`;

        return (
          <section className={styles.item} key={item.id}>
            <h3 className={styles.heading}>
              <button
                id={buttonId}
                type="button"
                className={styles.trigger}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
              >
                <span>{item.title}</span>
                <FaChevronDown aria-hidden="true" />
              </button>
            </h3>
            <div
              id={panelId}
              className={styles.panel}
              role="region"
              aria-label={item.panelLabel ?? "답변"}
              hidden={!isExpanded}
            >
              {typeof item.content === "string" ? <p>{item.content}</p> : item.content}
            </div>
          </section>
        );
      })}
    </div>
  );
}
