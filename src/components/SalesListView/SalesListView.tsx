"use client";

import styles from "./SalesListView.module.css";
import { useSales } from "@/hooks/useSales";
import { SaleStatusBadge } from "@/components/SaleStatusBadge/SaleStatusBadge";
import { SaleActionButtons } from "@/components/SaleActionButtons/SaleActionButtons";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function SalesListView() {
  const { sales, loading, error, handleUpdateStatus } =
    useSales();

  return (
    <main className={styles.container}>
      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thId}>ID</th>
              <th className={styles.thClient}>Cliente</th>
              <th className={styles.thDate}>Data</th>
              <th className={styles.thStatus}>Status</th>
              <th className={styles.thActions}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className={styles.feedbackCell}>
                  <span className={styles.spinner} />
                  Carregando vendas...
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.feedbackCell}>
                  Nenhuma venda encontrada
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className={styles.row}>
                  <td className={styles.tdId}>#{sale.id}</td>
                  <td className={styles.tdClient}>
                    {sale.user?.nome ?? `Usuário #${sale.userId}`}
                  </td>
                  <td className={styles.tdDate}>{formatDate(sale.createdAt)}</td>
                  <td className={styles.tdStatus}>
                    <SaleStatusBadge status={sale.status} />
                  </td>
                  <td className={styles.tdActions}>
                    <SaleActionButtons
                      sale={sale}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}