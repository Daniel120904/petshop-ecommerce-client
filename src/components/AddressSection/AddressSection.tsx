"use client";

import { useState } from "react";
import { UserAddress, AddressPayload, UpdateAddressPayload } from "@/types/user";
import styles from "../SectionModule/Section.module.css";

type Props = {
  addresses: UserAddress[];
  onCreate:  (payload: AddressPayload)        => Promise<void>;
  onUpdate:  (payload: UpdateAddressPayload)  => Promise<void>;
  onDelete:  (addressId: number)              => Promise<void>;
};

const EMPTY_FORM: AddressPayload = {
  street: "", nickname: "", number: "", complement: "",
  neighborhood: "", zip: "", city: "", state: "", observation: "",
};

export function AddressSection({ addresses, onCreate, onUpdate, onDelete }: Props) {
  const [adding, setAdding]       = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm]           = useState<AddressPayload>(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setAdding(true); };
  const openEdit = (a: UserAddress) => {
    setForm({ street: a.street, nickname: a.nickname, number: a.number,
      complement: a.complement, neighborhood: a.neighborhood, zip: a.zip,
      city: a.city, state: a.state, observation: "" });
    setEditingId(a.adressId);
    setAdding(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId !== null) {
        await onUpdate({ ...form, addressId: editingId });
      } else {
        await onCreate(form);
      }
      setAdding(false);
      setEditingId(null);
    } catch {
      alert("Erro ao salvar endereço.");
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof AddressPayload) => (
    <label className={styles.label}>
      {label}
      <input className={styles.input} value={form[key] ?? ""}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
    </label>
  );

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Endereços</h2>
        <button className={styles.btnEdit} onClick={adding ? () => setAdding(false) : openAdd}>
          {adding ? "Cancelar" : "+ Adicionar"}
        </button>
      </div>

      {addresses.length === 0 && !adding && (
        <p className={styles.empty}>Nenhum endereço cadastrado.</p>
      )}

      <ul className={styles.list}>
        {addresses.map((a) => (
          <li key={a.adressId} className={styles.listItem}>
            <div>
              <strong>{a.nickname}</strong>
              <p className={styles.addressLine}>
                {a.street}, {a.number}{a.complement ? ` - ${a.complement}` : ""} · {a.neighborhood} · {a.city}/{a.abbreviation} · {a.zip}
              </p>
            </div>
            <div className={styles.rowActions}>
              <button className={styles.btnEdit} onClick={() => openEdit(a)}>Editar</button>
              <button className={styles.btnDelete} onClick={() => onDelete(a.adressId)}>Remover</button>
            </div>
          </li>
        ))}
      </ul>

      {adding && (
        <div className={styles.form}>
          {field("Apelido", "nickname")}
          {field("Rua", "street")}
          {field("Número", "number")}
          {field("Complemento", "complement")}
          {field("Bairro", "neighborhood")}
          {field("CEP", "zip")}
          {field("Cidade", "city")}
          {field("Estado (sigla)", "state")}
          {field("Observação", "observation")}
          <div className={styles.actions}>
            <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}