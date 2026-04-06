"use client";

import styles from "./EditCustomerForm.module.css";
import { useEditCustomer } from "@/hooks/useEditCustomer";
import { FormSection } from "@/components/FormSection/FormSection";
import { FormField } from "@/components/FormField/FormField";
import { Button } from "@/components/buttons";

type EditCustomerFormProps = {
  customerId: number;
};

export function EditCustomerForm({ customerId }: EditCustomerFormProps) {
  const { formData, loading, submitting, error, updateField, handleSubmit } =
    useEditCustomer(customerId);

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.feedback}>
          <span className={styles.spinner} />
          Carregando dados do cliente...
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      {error && <div className={styles.errorBanner}>{error}</div>}

      <FormSection title="Dados do Cliente">
        <div className={styles.grid2}>
          <FormField
            label="Gênero"
            required
            as="select"
            value={formData.genero}
            onChange={(v) => updateField("genero", v)}
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
              value={formData.nome}
              onChange={(v) => updateField("nome", v)}
            />
          </div>
        </div>

        <div className={styles.grid3}>
          <FormField
            label="Data de Nascimento"
            required
            type="date"
            value={formData.dataNascimento}
            onChange={(v) => updateField("dataNascimento", v)}
          />
          <FormField
            label="CPF"
            required
            value={formData.cpf}
            onChange={(v) => updateField("cpf", v)}
            placeholder="000.000.000-00"
          />
          <FormField
            label="E-mail"
            required
            type="email"
            value={formData.email}
            onChange={(v) => updateField("email", v)}
          />
        </div>
      </FormSection>

      <div className={styles.submitRow}>
        <Button onClick={handleSubmit} variant="success">
          {submitting ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </main>
  );
}