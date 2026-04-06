"use client";

import styles from "./CreateCardForm.module.css";
import { useCreateCard } from "@/hooks/useCreateCard";
import { FormSection } from "@/components/FormSection/FormSection";
import { FormField } from "@/components/FormField/FormField";
import { Button } from "@/components/buttons";

type CreateCardFormProps = {
  userId: number;
};

export function CreateCardForm({ userId }: CreateCardFormProps) {
  const { formData, submitting, error, updateField, handleSubmit } =
    useCreateCard(userId);

  return (
    <main className={styles.container}>
      {error && <div className={styles.errorBanner}>{error}</div>}

      <FormSection title="Dados do Cartão">
        <div className={styles.grid2}>
          <FormField
            label="Nº do Cartão"
            required
            value={formData.numero}
            onChange={(v) => updateField("numero", v)}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
          />
          <FormField
            label="Nome impresso no Cartão"
            required
            value={formData.nome}
            onChange={(v) => updateField("nome", v)}
            placeholder="Como está no cartão"
          />
        </div>

        <div className={styles.grid2}>
          <FormField
            label="Bandeira do Cartão"
            required
            as="select"
            value={formData.bandeira}
            onChange={(v) => updateField("bandeira", v)}
            options={[
              { label: "Visa", value: "Visa" },
              { label: "Mastercard", value: "Mastercard" },
            ]}
          />
          <FormField
            label="Código de Segurança (CVV)"
            required
            value={formData.cvv}
            onChange={(v) => updateField("cvv", v)}
            placeholder="XXX"
            maxLength={4}
          />
        </div>
      </FormSection>

      <div className={styles.submitRow}>
        <Button onClick={handleSubmit} variant="success">
          {submitting ? "Salvando..." : "Salvar Cartão"}
        </Button>
      </div>
    </main>
  );
}