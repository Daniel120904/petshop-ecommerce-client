"use client";

import { useOrders } from "@/hooks/useOrders";
import { OrderCard } from "../OrderCard/OrderCard";
import { Pagination } from "../PaginationOrders/Pagination";
import styles from "./OrdersView.module.css";

export function OrdersView() {
  const { orders, meta, page, setPage, loading, error, handleCancel } = useOrders();

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Histórico de Compras</h1>

      {loading && <p className={styles.status}>Carregando pedidos...</p>}
      {error   && <p className={`${styles.status} ${styles.error}`}>{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className={styles.empty}>
          <span>🛍️</span>
          <p>Você ainda não realizou nenhuma compra.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <div className={styles.list}>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onCancel={handleCancel} />
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </main>
  );
}