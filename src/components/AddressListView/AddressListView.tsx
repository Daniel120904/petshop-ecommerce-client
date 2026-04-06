"use client";

import Link from "next/link";
import styles from "./AddressListView.module.css";
import { useAddresses } from "@/hooks/useAddresses";

type AddressListViewProps = {
  userId: number;
};

export function AddressListView({ userId }: AddressListViewProps) {
  const { addresses, loading, error } = useAddresses(userId);

  return (
    <main className={styles.container}>
      <div className={styles.toolbar}>
        <Link
          href={`/admin/customer/${userId}/addresses/new`}
          className={styles.newButton}
        >
          + Novo Endereço
        </Link>
      </div>

      {loading && (
        <div className={styles.feedback}>
          <span className={styles.spinner} />
          Carregando endereços...
        </div>
      )}

      {error && !loading && <div className={styles.errorBanner}>{error}</div>}

      {!loading && !error && (
        <div className={styles.tableWrapper}>
          {addresses.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>📍</span>
              <p>Nenhum endereço encontrado</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thName}>Nome do Endereço</th>
                  <th className={styles.thActions}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {addresses.map((address) => (
                  <tr key={address.id} className={styles.row}>
                    <td className={styles.tdName}>{address.nome}</td>
                    <td className={styles.tdActions}>
                      <Link
                        href={`/admin/customer/${userId}/addresses/${address.id}/edit`}
                        className={`${styles.actionBtn} ${styles.warning}`}
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  );
}