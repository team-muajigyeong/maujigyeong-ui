import type { ReactNode } from "react";

import styles from "./style.module.css";

export type SectionWithHeaderProps = {
  /** Heading level matching the consumer document hierarchy. */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visible section heading. */
  title: string;
  children?: ReactNode;
};

/** Renders a semantic section without requiring a client boundary. */
const SectionWithHeader = ({ children, level = 2, title }: SectionWithHeaderProps) => {
  const Header = `h${level}` as const;

  return (
    <section className={styles.section}>
      <Header className={styles.title}>
        <span>{title}</span>
      </Header>
      {children}
    </section>
  );
};

export default SectionWithHeader;
