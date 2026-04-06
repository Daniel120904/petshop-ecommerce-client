"use client";

import Link from "next/link";
import styles from "./CardListView.module.css";
import { useCards } from "@/hooks/useCards";

type CardListViewProps = {
  userId: number;
};

function maskCardNumber(numero: string): string {
  return "**** **** **** " + numero.slice(-4);
}

export function CardListView({ userId }: CardListViewProps) {
  const { cards, loading, error, handleSetPreferred } = useCards(userId);

  return (
    <main className={styles.container}>
      <div className={styles.toolbar}>
        <Link
          href={`/admin/customer/${userId}/cards/new`}
          className={styles.newButton}
        >
          + Novo Cartão
        </Link>
      </div>

      {loading && (
        <div className={styles.feedback}>
          <span className={styles.spinner} />
          Carregando cartões...
        </div>
      )}

      {error && !loading && <div className={styles.errorBanner}>{error}</div>}

      {!loading && !error && (
        <div className={styles.tableWrapper}>
          {cards.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>💳</span>
              <p>Nenhum cartão encontrado</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thNumber}>Número do Cartão</th>
                  <th className={styles.thPreferred}>Preferencial</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => (
                  <tr key={card.id} className={styles.row}>
                    <td className={styles.tdNumber}>
                      <span className={styles.cardNumber}>
                        {maskCardNumber(card.numero)}
                      </span>
                      {card.preferencial && (
                        <span className={styles.badge}>Preferencial</span>
                      )}
                    </td>
                    <td className={styles.tdPreferred}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="preferencial"
                          className={styles.radio}
                          checked={card.preferencial}
                          onChange={() => handleSetPreferred(card.id)}
                        />
                      </label>
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