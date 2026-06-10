"use client";

import { useState } from "react";
import { Order } from "@/types/order";
import { CancelModal } from "../CancelModal/CancelModal";
import styles from "./OrderCard.module.css";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  processing:  { label: "Em Processamento", className: "processing"  },
  approved:    { label: "Aprovado",          className: "approved"    },
  rejected:    { label: "Reprovado",         className: "rejected"    },
  transit:     { label: "Em Trânsito",       className: "transit"     },
  delivered:   { label: "Entregue",          className: "delivered"   },
  cancelled:   { label: "Cancelado",         className: "cancelled"   },
};

const PAYMENT_LABEL: Record<string, string> = {
  pix:          "PIX",
  credit_card:  "Cartão de Crédito",
  debit_card:   "Cartão de Débito",
  boleto:       "Boleto",
};

type Props = {
  order: Order;
  onCancel: (saleId: number, reason: string) => Promise<void>;
};

export function OrderCard({ order, onCancel }: Props) {
  const [showModal, setShowModal] = useState(false);

  const statusCfg  = STATUS_CONFIG[order.status] ?? { label: order.status, className: "processing" };
  const canCancel  = ["processing", "approved"].includes(order.status);
  const dateStr    = new Date(order.createdAt).toLocaleDateString("pt-BR");
  const payLabel   = PAYMENT_LABEL[order.payment?.type] ?? order.payment?.type ?? "—";

  return (
    <>
      <article className={styles.card}>
        {/* ── Header ── */}
        <div className={styles.cardHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.orderId}>Pedido #{order.id}</span>
            <span className={styles.date}>{dateStr}</span>
          </div>
          <span className={`${styles.badge} ${styles[statusCfg.className]}`}>
            {statusCfg.label}
          </span>
        </div>

        {/* ── Items ── */}
        <ul className={styles.itemList}>
          {order.items.map((item) => (
            <li key={item.productId} className={styles.item}>
              {item.product.images?.[0] && (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className={styles.thumb}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.product.name}</span>
                <span className={styles.itemQty}>{item.quantity} unid.</span>
              </div>
              <span className={styles.itemPrice}>
                R$ {(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        {/* ── Footer ── */}
        <div className={styles.cardFooter}>
          <div className={styles.footerInfo}>
            <span className={styles.payLabel}>
              <strong>Pagamento:</strong> {payLabel}
            </span>
            {order.cancelReason && (
              <span className={styles.cancelReason}>
                <strong>Motivo do cancelamento:</strong> {order.cancelReason}
              </span>
            )}
          </div>
          <div className={styles.footerRight}>
            <span className={styles.total}>
              Total: <strong>R$ {order.finalPrice.toFixed(2)}</strong>
            </span>
            {canCancel && (
              <button
                className={styles.btnCancel}
                onClick={() => setShowModal(true)}
              >
                Cancelar Pedido
              </button>
            )}
          </div>
        </div>
      </article>

      {showModal && (
        <CancelModal
          orderId={order.id}
          onConfirm={async (reason) => {
            await onCancel(order.id, reason);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}