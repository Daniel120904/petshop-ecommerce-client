"use client";

import { useState } from "react";
import styles from "./CancelModal.module.css";

type Props = {
  orderId: number;
  onConfirm: (reason: string) => Promise<void>;
  onClose: () => void;
};

export function CancelModal({ orderId, onConfirm, onClose }: Props) {
  const [reason, setReason]   = useState("");
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  const handleConfirm = async () => {
    if (!reason.trim()) { setError("Por favor, informe o motivo do cancelamento."); return; }
    setSaving(true);
    try {
      await onConfirm(reason.trim());
    } catch {
      setError("Erro ao cancelar pedido. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Cancelar Pedido #{orderId}</h2>
        <p className={styles.desc}>
          Informe o motivo do cancelamento. Esta ação não pode ser desfeita.
        </p>

        <textarea
          className={styles.textarea}
          rows={4}
          placeholder="Ex: Comprei por engano, encontrei mais barato..."
          value={reason}
          onChange={(e) => { setReason(e.target.value); setError(""); }}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button className={styles.btnBack} onClick={onClose} disabled={saving}>
            Voltar
          </button>
          <button className={styles.btnConfirm} onClick={handleConfirm} disabled={saving}>
            {saving ? "Cancelando..." : "Confirmar Cancelamento"}
          </button>
        </div>
      </div>
    </div>
  );
}