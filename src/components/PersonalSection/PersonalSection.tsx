"use client";

import { useState } from "react";
import { UserProfile, UpdateUserPayload } from "@/types/user";
import styles from "../SectionModule/Section.module.css";

const GENDER_OPTIONS = [
  { value: "1", label: "Masculino" },
  { value: "2", label: "Feminino" },
  { value: "3", label: "Outro" },
];

type Props = {
  profile: UserProfile;
  onUpdate: (payload: UpdateUserPayload) => Promise<void>;
};

export function PersonalSection({ profile, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm] = useState<UpdateUserPayload>({
    name:      profile.name,
    email:     profile.email,
    cpf:       profile.cpf,
    birthday:  profile.birthday.split("T")[0],
    genderId:  profile.gender === "male" ? "1" : profile.gender === "female" ? "2" : "3",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(form);
      setEditing(false);
    } catch {
      alert("Erro ao salvar dados.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Dados Pessoais</h2>
        {!editing && (
          <button className={styles.btnEdit} onClick={() => setEditing(true)}>
            Editar
          </button>
        )}
      </div>

      {editing ? (
        <div className={styles.form}>
          <label className={styles.label}>
            Nome
            <input className={styles.input} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className={styles.label}>
            E-mail
            <input className={styles.input} type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className={styles.label}>
            CPF
            <input className={styles.input} value={form.cpf}
              onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
          </label>
          <label className={styles.label}>
            Data de Nascimento
            <input className={styles.input} type="date" value={form.birthday}
              onChange={(e) => setForm({ ...form, birthday: e.target.value })} />
          </label>
          <label className={styles.label}>
            Gênero
            <select className={styles.input} value={form.genderId}
              onChange={(e) => setForm({ ...form, genderId: e.target.value })}>
              {GENDER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>

          <div className={styles.actions}>
            <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </button>
            <button className={styles.btnCancel} onClick={() => setEditing(false)}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <dl className={styles.dl}>
          <dt>Nome</dt>       <dd>{profile.name}</dd>
          <dt>E-mail</dt>     <dd>{profile.email}</dd>
          <dt>CPF</dt>        <dd>{profile.cpf}</dd>
          <dt>Nascimento</dt> <dd>{new Date(profile.birthday).toLocaleDateString("pt-BR")}</dd>
          <dt>Gênero</dt>     <dd>{profile.gender === "male" ? "Masculino" : profile.gender === "female" ? "Feminino" : "Outro"}</dd>
        </dl>
      )}
    </section>
  );
}