import styles from "../OrdersView/OrdersView.module.css";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: Props) {
  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageBtn}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Anterior
      </button>
      <span className={styles.pageInfo}>Página {page} de {totalPages}</span>
      <button
        className={styles.pageBtn}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Próxima →
      </button>
    </div>
  );
}