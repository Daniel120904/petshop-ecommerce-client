"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./CustomerDataView.module.css";
import { fetchCustomerById } from "@/services/customerService";
import { Customer } from "@/types/customer";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR");
}

function formatCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatPhone(ddd: string, number: string) {
  const n = number.replace(/(\d{4,5})(\d{4})/, "$1-$2");
  return `(${ddd}) ${n}`;
}

function formatZip(zip: string) {
  return zip.replace(/(\d{5})(\d{3})/, "$1-$2");
}

const genderLabel: Record<string, string> = {
  male: "Masculino",
  female: "Feminino",
  other: "Outro",
};

export function CustomerDataView() {
  const params = useParams();
  const router = useRouter();
  const customerId = Number(params?.id);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;

    fetchCustomerById(customerId)
      .then(setCustomer)
      .catch(() => setError("Não foi possível carregar os dados do cliente."))
      .finally(() => setLoading(false));
  }, [customerId]);

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <span className={styles.backArrow}>←</span> Voltar
        </button>
      </div>

      {loading && (
        <div className={styles.feedback}>
          <span className={styles.spinner} />
          Carregando dados...
        </div>
      )}

      {error && !loading && (
        <div className={styles.errorBox}>{error}</div>
      )}

      {!loading && !error && customer && (
        <div className={styles.card}>
          {/* Header */}
          <div className={styles.cardHeader}>
            <div className={styles.avatar}>
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.headerInfo}>
              <h1 className={styles.customerName}>{customer.name}</h1>
              <div className={styles.badges}>
                <span className={`${styles.badge} ${customer.active ? styles.badgeActive : styles.badgeInactive}`}>
                  {customer.active ? "Ativo" : "Inativo"}
                </span>
                {customer.blocked && (
                  <span className={`${styles.badge} ${styles.badgeBlocked}`}>Bloqueado</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Dados pessoais */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}></span>
              Dados Pessoais
            </h2>
            <div className={styles.grid}>
              <InfoField label="E-mail" value={customer.email} />
              <InfoField label="CPF" value={formatCPF(customer.cpf)} />
              <InfoField label="Data de Nascimento" value={formatDate(customer.birthday)} />
              <InfoField label="Gênero" value={genderLabel[customer.gender] ?? customer.gender} />
            </div>
          </section>

          {/* Telefones */}
          {customer.phones?.length > 0 && (
            <>
              <div className={styles.divider} />
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}></span>
                  Telefones
                </h2>
                <div className={styles.listCards}>
                  {customer.phones.map((phone, i) => (
                    <div key={i} className={styles.listCard}>
                      {formatPhone(phone.ddd, phone.number)}
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* Endereços */}
          {customer.addresses?.length > 0 && (
            <>
              <div className={styles.divider} />
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}></span>
                  Endereços
                </h2>
                <div className={styles.addressList}>
                  {customer.addresses.map((addr, i) => (
                    <div key={i} className={styles.addressCard}>
                      <div className={styles.addressNickname}>{addr.nickname}</div>
                      <div className={styles.addressLine}>
                        {addr.street}, {addr.number}
                        {addr.complement && ` — ${addr.complement}`}
                      </div>
                      <div className={styles.addressLine}>
                        {addr.neighborhood} · {addr.city} / {addr.abbreviation}
                      </div>
                      <div className={styles.addressLine}>CEP: {formatZip(addr.zip)}</div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </main>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoField}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  );
}