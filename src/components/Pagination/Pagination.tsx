import styles from "./Pagination.module.css";
import { ProductMeta } from "@/types/product";

type PaginationProps = {
  meta: ProductMeta;
  onPageChange: (page: number) => void;
};

export function Pagination({ meta, onPageChange }: PaginationProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.btn}
        onClick={() => onPageChange(meta.page - 1)}
        disabled={!meta.hasPrev}
      >
        ← Anterior
      </button>

      <span className={styles.info}>
        Página {meta.page} de {meta.totalPages}
      </span>

      <button
        className={styles.btn}
        onClick={() => onPageChange(meta.page + 1)}
        disabled={!meta.hasNext}
      >
        Próxima →
      </button>
    </div>
  );
}