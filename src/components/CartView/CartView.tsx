"use client";

import Link from "next/link";
import styles from "./CartView.module.css";
import { useCart } from "@/hooks/useCart";
import { CartItemRow } from "@/components/CartItemRow/CartItemRow";

export function CartView() {
  const { items, loading, error, total, handleIncrease, handleDecrease } =
    useCart();

  return (
    <main className={styles.container}>
      <h2 className={styles.title}>Seu Carrinho</h2>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {loading ? (
        <div className={styles.feedback}>
          <span className={styles.spinner} />
          Carregando carrinho...
        </div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🛒</span>
          <p>Seu carrinho está vazio.</p>
          <Link href="/user/products" className={styles.shopLink}>
            Ver Produtos
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.listWrapper}>
            <div className={styles.listHeader}>
              <span>Produto</span>
              <span className={styles.headerQty}>Quantidade</span>
              <span className={styles.headerTotal}>Total</span>
            </div>
            <ul className={styles.list}>
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onIncrease={(id, qty) => handleIncrease(id, qty)}
                  onDecrease={(id, qty) => handleDecrease(id, qty)}
                />
              ))}
            </ul>
          </div>

          <div className={styles.summary}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total do carrinho</span>
              <span className={styles.totalValue}>R$ {total.toFixed(2)}</span>
            </div>
            <Link href="/user/orders/new" className={styles.checkoutButton}>
              Finalizar Compra
            </Link>
          </div>
        </>
      )}
    </main>
  );
}