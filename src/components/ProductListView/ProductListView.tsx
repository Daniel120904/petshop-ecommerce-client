"use client";

import styles from "./ProductListView.module.css";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { Pagination } from "@/components/Pagination/Pagination";

export function ProductListView() {
  const {
    products,
    meta,
    page,
    setPage,
    loading,
    error,
    addingId,
    successId,
    handleAddToCart,
  } = useProducts();

  return (
    <main className={styles.container}>
      {error && <div className={styles.errorBanner}>{error}</div>}

      {loading ? (
        <div className={styles.feedback}>
          <span className={styles.spinner} />
          Carregando produtos...
        </div>
      ) : products.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🐾</span>
          <p>Nenhum produto encontrado.</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isAdding={addingId === product.id}
                isSuccess={successId === product.id}
              />
            ))}
          </div>

          {meta && (
            <Pagination meta={meta} onPageChange={setPage} />
          )}
        </>
      )}
    </main>
  );
}