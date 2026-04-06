import { Sale, SaleStatus, STATUS_ACTIONS } from "@/types/sale";
import styles from "./SaleActionButtons.module.css";

type SaleActionButtonsProps = {
  sale: Sale;
  onUpdateStatus: (saleId: number, newStatus: SaleStatus) => void;
};

export function SaleActionButtons({ sale, onUpdateStatus }: SaleActionButtonsProps) {
  const actions = STATUS_ACTIONS[sale.status];

  if (!actions || actions.length === 0) {
    return <span className={styles.noActions}>Sem ações disponíveis</span>;
  }

  return (
    <div className={styles.actions}>
      {actions.map((action) => (
        <button
          key={action.nextStatus}
          className={`${styles.btn} ${styles[action.variant]}`}
          onClick={() => onUpdateStatus(sale.id, action.nextStatus)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}