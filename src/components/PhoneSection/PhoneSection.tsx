"use client";

import { useState } from "react";
import { UserPhone, PhonePayload } from "@/types/user";
import styles from "../SectionModule/Section.module.css";

type Props = {
  phones: UserPhone[];
  onCreate: (payload: PhonePayload) => Promise<void>;
  onDelete: (phoneId: number) => Promise<void>;
};

const EMPTY: PhonePayload = { ddd: "", number: "" };

export function PhoneSection({ phones, onCreate, onDelete }: Props) {
  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState<PhonePayload>(EMPTY);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    setSaving(true);
    try {
      await onCreate(form);
      setForm(EMPTY);
      setAdding(false);
    } catch {
      alert("Erro ao adicionar telefone.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Telefones</h2>
        <button className={styles.btnEdit} onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancelar" : "+ Adicionar"}
        </button>
      </div>

      {phones.length === 0 && !adding && (
        <p className={styles.empty}>Nenhum telefone cadastrado.</p>
      )}

      <ul className={styles.list}>
        {phones.map((p) => (
          <li key={p.phoneId} className={styles.listItem}>
            <span>({p.ddd}) {p.number}</span>
            <button className={styles.btnDelete} onClick={() => onDelete(p.phoneId)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      {adding && (
        <div className={styles.form}>
          <label className={styles.label}>
            DDD
            <input className={styles.input} maxLength={2} value={form.ddd}
              onChange={(e) => setForm({ ...form, ddd: e.target.value })} />
          </label>
          <label className={styles.label}>
            Número
            <input className={styles.input} value={form.number}
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