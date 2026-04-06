"use client";

import Link from "next/link";
import styles from "./CustomerListView.module.css";
import { useCustomers } from "@/hooks/useCustomers";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { CustomerTable } from "@/components/CustomerTable/CustomerTable";

export function CustomerListView() {
  const { customers, loading, error, setFilters, handleDelete, handleToggleStatus } =
    useCustomers();

  return (
    <main className={styles.container}>
      <div className={styles.toolbar}>
        <SearchBar onFiltersChange={setFilters} />
        <Link href="/admin/customer/new" className={styles.newButton}>
          + Novo Cliente
        </Link>
      </div>

      {loading && (
        <div className={styles.feedback}>
          <span className={styles.spinner} />
          Carregando clientes...
        </div>
      )}

      {error && !loading && (
        <div className={styles.error}>{error}</div>
      )}

      {!loading && !error && (
        <CustomerTable
          customers={customers}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </main>
  );
}