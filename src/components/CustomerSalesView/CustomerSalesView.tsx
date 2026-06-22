"use client";

import styles from "./CustomerSalesView.module.css";
import { useCustomerSales } from "@/hooks/useCustomerSales";
import { SaleStatusBadge } from "@/components/SaleStatusBadge/SaleStatusBadge";

const FALLBACK_IMAGE = "https://placehold.co/40x40/e2e8f0/94a3b8?text=?";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type CustomerSalesViewProps = {
  userId: number;
};

export function CustomerSalesView({ userId }: CustomerSalesViewProps) {
  const { sales, loading, error } = useCustomerSales(userId);

  return (
    <main className={styles.container}>
      {loading && (
        <div className={styles.feedback}>
          <span className={styles.spinner} />
          Carregando transações...
        </div>
      )}

      {error && !loading && <div className={styles.errorBanner}>{error}</div>}

      {!loading && !error && sales.length === 0 && (
        <div className={styles.empty}>
          <p>Nenhuma transação encontrada para este cliente.</p>
        </div>
      )}

      {!loading && !error && sales.length > 0 && (
        <div className={styles.list}>
          {sales.map((sale) => (
            <div key={sale.id} className={styles.saleCard}>
              <div className={styles.saleHeader}>
                <div className={styles.saleHeaderLeft}>
                  <span className={styles.saleId}>Pedido #{sale.id}</span>
                  <span className={styles.saleDate}>{formatDate(sale.createdAt)}</span>
                </div>
                <div className={styles.saleHeaderRight}>
                  <SaleStatusBadge status={sale.status} />
                  <span className={styles.saleTotal}>
                    {formatCurrency(sale.finalPrice)}
                  </span>
                </div>
              </div>

              <ul className={styles.itemList}>
                {sale.items.map((item) => {
                  const image = item.product.images?.[0] ?? FALLBACK_IMAGE;
                  return (
                    <li key={item.productId} className={styles.item}>
                      <img
                        src={image}
                        alt={item.product.name}
                        className={styles.itemImage}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                      <span className={styles.itemName}>{item.product.name}</span>
                      <span className={styles.itemQty}>x{item.quantity}</span>
                      <span className={styles.itemPrice}>
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className={styles.saleFooter}>
                <span className={styles.paymentInfo}>
                  {sale.payment.type === "pix" ? "Pix" : "Cartão"} ·{" "}
                  {formatCurrency(sale.payment.amount)}
                </span>
                {sale.cancelReason && (
                  <span className={styles.cancelReason}>
                    Motivo: {sale.cancelReason}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}