"use client";

import styles from "./CreateCustomerForm.module.css";
import { useCreateCustomer } from "@/hooks/useCreateCustomer";
import { FormSection } from "@/components/FormSection/FormSection";
import { FormField } from "@/components/FormField/FormField";
import { AddressCard } from "@/components/AddressCard/AddressCard";
import { CardItem } from "@/components/CardItem/CardItem";
import { Button } from "@/components/buttons";

export function CreateCustomerForm() {
  const {
    customerData,
    phone,
    addresses,
    cards,
    submitting,
    error,
    updateCustomerField,
    updatePhoneField,
    addAddress,
    removeAddress,
    updateAddress,
    addCard,
    removeCard,
    updateCard,
    handleSubmit,
  } = useCreateCustomer();

  return (
    <main className={styles.container}>
      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* Customer data */}
      <FormSection title="Dados do Cliente">
        <div className={styles.grid2}>
          <FormField
            label="Gênero"
            required
            as="select"
            value={customerData.genero}
            onChange={(v) => updateCustomerField("genero", v)}
            options={[
              { label: "Masculino", value: "Masculino" },
              { label: "Feminino", value: "Feminino" },
              { label: "Outro", value: "Outro" },
            ]}
          />
          <div className={styles.spanDouble}>
            <FormField
              label="Nome completo"
              required
              value={customerData.nome}
              onChange={(v) => updateCustomerField("nome", v)}
            />
          </div>
        </div>

        <div className={styles.grid3}>
          <FormField
            label="Data de Nascimento"
            required
            type="date"
            value={customerData.dataNascimento}
            onChange={(v) => updateCustomerField("dataNascimento", v)}
          />
          <FormField
            label="CPF"
            required
            value={customerData.cpf}
            onChange={(v) => updateCustomerField("cpf", v)}
            placeholder="000.000.000-00"
          />
          <FormField
            label="E-mail"
            required
            type="email"
            value={customerData.email}
            onChange={(v) => updateCustomerField("email", v)}
          />
        </div>

        <div className={styles.sectionDivider}>
          <span>Telefone</span>
        </div>

        <div className={styles.grid3Phone}>
          <FormField
            label="Tipo"
            required
            as="select"
            value={phone.tipo}
            onChange={(v) => updatePhoneField("tipo", v)}
            options={[
              { label: "Residencial", value: "Residencial" },
              { label: "Comercial", value: "Comercial" },
              { label: "Celular", value: "Celular" },
            ]}
          />
          <FormField
            label="DDD"
            required
            value={phone.ddd}
            onChange={(v) => updatePhoneField("ddd", v)}
            placeholder="11"
            maxLength={3}
          />
          <div className={styles.spanDouble}>
            <FormField
              label="Número"
              required
              value={phone.numero}
              onChange={(v) => updatePhoneField("numero", v)}
              placeholder="99999-9999"
            />
          </div>
        </div>

        <div className={styles.grid2}>
          <FormField
            label="Senha"
            required
            type="password"
            value={customerData.senha}
            onChange={(v) => updateCustomerField("senha", v)}
          />
          <FormField
            label="Confirmar Senha"
            required
            type="password"
            value={customerData.confirmarSenha}
            onChange={(v) => updateCustomerField("confirmarSenha", v)}
          />
        </div>
      </FormSection>

      {/* Addresses */}
      <FormSection
        title="Endereços"
        action={
          <Button onClick={addAddress} variant="primary">
            + Adicionar Endereço
          </Button>
        }
      >
        {addresses.length === 0 ? (
          <p className={styles.emptyHint}>
            Nenhum endereço adicionado. Clique em &quot;+ Adicionar Endereço&quot; para começar.
          </p>
        ) : (
          addresses.map((addr, i) => (
            <AddressCard
              key={i}
              index={i}
              data={addr}
              onChange={(field, value) => updateAddress(i, field, value)}
              onRemove={() => removeAddress(i)}
            />
          ))
        )}
      </FormSection>

      {/* Cards */}
      <FormSection
        title="Cartões"
        action={
          <Button onClick={addCard} variant="primary">
            + Adicionar Cartão
          </Button>
        }
      >
        {cards.length === 0 ? (
          <p className={styles.emptyHint}>
            Nenhum cartão adicionado. Clique em &quot;+ Adicionar Cartão&quot; para começar.
          </p>
        ) : (
          cards.map((card, i) => (
            <CardItem
              key={i}
              index={i}
              data={card}
              onChange={(field, value) => updateCard(i, field, value)}
              onRemove={() => removeCard(i)}
            />
          ))
        )}
      </FormSection>

      <div className={styles.submitRow}>
        <Button
          onClick={handleSubmit}
          variant="success"
        >
          {submitting ? "Salvando..." : "Salvar Cliente"}
        </Button>
      </div>
    </main>
  );
}