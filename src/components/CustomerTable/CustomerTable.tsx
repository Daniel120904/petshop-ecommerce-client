"use client";

import Link from "next/link";
import styles from "./CustomerTable.module.css";
import { Customer } from "@/types/customer";

type CustomerTableProps = {
  customers: Customer[];
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
};

export function CustomerTable({ customers, onDelete, onToggleStatus }: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🐾</span>
        <p>Nenhum cliente encontrado</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thName}>Nome</th>
            <th className={styles.thActions}>Ações</th>
            <th className={styles.thStatus}>Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className={styles.row}>
              <td className={styles.tdName}>{customer.nome}</td>
              <td className={styles.tdActions}>
                <div className={styles.actions}>
                  <Link
                    href={`/admin/customer/${customer.id}/edit`}
                    className={`${styles.actionBtn} ${styles.warning}`}
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/admin/customer/${customer.id}/password`}
                    className={`${styles.actionBtn} ${styles.secondary}`}
                  >
                    Alterar Senha
                  </Link>
                  <Link
                    href={`/admin/customer/${customer.id}/addresses`}
                    className={`${styles.actionBtn} ${styles.primary}`}
                  >
                    Endereços
                  </Link>
                  <Link
                    href={`/admin/customer/${customer.id}/cards`}
                    className={`${styles.actionBtn} ${styles.info}`}
                  >
                    Cartões
                  </Link>
                  <Link
                    href={`/admin/customer/${customer.id}/transactions`}
                    className={`${styles.actionBtn} ${styles.dark}`}
                  >
                    Transações
                  </Link>
                  <button
                    className={`${styles.actionBtn} ${styles.danger}`}
                    onClick={() => onDelete(customer.id)}
                  >
                    Excluir
                  </button>
                </div>
              </td>
              <td className={styles.tdStatus}>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={customer.status}
                    onChange={() => onToggleStatus(customer.id, customer.status)}
                    className={styles.toggleInput}
                  />
                  <span className={styles.toggleSlider} />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}