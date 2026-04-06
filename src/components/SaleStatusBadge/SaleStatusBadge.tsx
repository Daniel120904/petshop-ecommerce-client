import { SaleStatus, STATUS_CONFIG } from "@/types/sale";
import styles from "./SaleStatusBadge.module.css";

type SaleStatusBadgeProps = {
  status: SaleStatus;
};

export function SaleStatusBadge({ status }: SaleStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status.toUpperCase(),
    color: "#475569",
    bg: "#f1f5f9",
  };

  return (
    <span
      className={styles.badge}
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {config.label}
    </span>
  );
}