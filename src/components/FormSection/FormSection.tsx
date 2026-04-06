import styles from "./FormSection.module.css";

type FormSectionProps = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function FormSection({ title, action, children }: FormSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h4 className={styles.title}>{title}</h4>
        {action && <div>{action}</div>}
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
}