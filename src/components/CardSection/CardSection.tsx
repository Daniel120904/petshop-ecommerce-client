"use client";

import { useState } from "react";
import { UserCard, CardPayload } from "@/types/user";
import styles from "../SectionModule/Section.module.css";

type Props = {
  cards:    UserCard[];
  onCreate: (payload: CardPayload) => Promise<void>;
  onDelete: (cardId: number)       => Promise<void>;
};

const EMPTY: CardPayload = { nickname: "", holder: "", brand: "", number: "" };

export function CardSection({ cards, onCreate, onDelete }: Props) {
  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState<CardPayload>(EMPTY);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    setSaving(true);
    try {
      await onCreate(form);
      setForm(EMPTY);
      setAdding(false);
    } catch {
      alert("Erro ao adicionar cartão.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Cartões</h2>
        <button className={styles.btnEdit} onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancelar" : "+ Adicionar"}
        </button>
      </div>

      {cards.length === 0 && !adding && (
        <p className={styles.empty}>Nenhum cartão cadastrado.</p>
      )}

      <ul className={styles.list}>
        {cards.map((c) => (
          <li key={c.cardId} className={styles.listItem}>
            <span>{c.nickname} — **** {c.last4}</span>
            <button className={styles.btnDelete} onClick={() => onDelete(c.cardId)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      {adding && (
        <div className={styles.form}>
          <label className={styles.label}>
            Apelido
            <input className={styles.input} value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
          </label>
          <label className={styles.label}>
            Titular
            <input className={styles.input} value={form.holder}
              onChange={(e) => setForm({ ...form, holder: e.target.value })} />
          </label>
          <label className={styles.label}>
            Bandeira
            <select className={styles.input} value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}>
              <option value="">Selecione</option>
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
              <option value="elo">Elo</option>
            </select>
          </label>
          <label className={styles.label}>
            Número do Cartão
            <input className={styles.input} maxLength={19} value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })} />
          </label>
          <div className={styles.actions}>
            <button className={styles.btnSave} onClick={handleAdd} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}