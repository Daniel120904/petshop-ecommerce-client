"use client";

import styles from "./CreateAddressForm.module.css";
import { useCreateAddress } from "@/hooks/useCreateAddress";
import { FormSection } from "@/components/FormSection/FormSection";
import { FormField } from "@/components/FormField/FormField";
import { Button } from "@/components/buttons";

type CreateAddressFormProps = {
  userId: number;
};

export function CreateAddressForm({ userId }: CreateAddressFormProps) {
  const { formData, submitting, error, updateField, handleSubmit } =
    useCreateAddress(userId);

  return (
    <main className={styles.container}>
      {error && <div className={styles.errorBanner}>{error}</div>}

      <FormSection title="Dados do Endereço">
        <div className={styles.grid2}>
          <FormField
            label="Nome do Endereço"
            required
            value={formData.nome}
            onChange={(v) => updateField("nome", v)}
            placeholder="Ex: Casa, Trabalho..."
          />
          <FormField
            label="Tipo de Endereço"
            required
            as="select"
            value={formData.tipoEndereco}
            onChange={(v) => updateField("tipoEndereco", v)}
            options={[
              { label: "Cobrança", value: "Cobrança" },
              { label: "Entrega", value: "Entrega" },
              { label: "Cobrança e Entrega", value: "Cobrança e Entrega" },
            ]}
          />
        </div>

        <div className={styles.grid2}>
          <FormField
            label="Tipo de Residência"
            required
            as="select"
            value={formData.tipoResidencia}
            onChange={(v) => updateField("tipoResidencia", v)}
            options={[
              { label: "Casa", value: "Casa" },
              { label: "Apartamento", value: "Apartamento" },
              { label: "Outro", value: "Outro" },
            ]}
          />
          <FormField
            label="Tipo de Logradouro"
            required
            as="select"
            value={formData.tipoLogradouro}
            onChange={(v) => updateField("tipoLogradouro", v)}
            options={[
              { label: "Rua", value: "Rua" },
              { label: "Avenida", value: "Avenida" },
              { label: "Travessa", value: "Travessa" },
            ]}
          />
        </div>

        <div className={styles.grid3}>
          <div className={styles.spanDouble}>
            <FormField
              label="Logradouro"
              required
              value={formData.logradouro}
              onChange={(v) => updateField("logradouro", v)}
            />
          </div>
          <FormField
            label="Número"
            required
            value={formData.numero}
            onChange={(v) => updateField("numero", v)}
          />
        </div>

        <div className={styles.grid2}>
          <FormField
            label="Bairro"
            required
            value={formData.bairro}
            onChange={(v) => updateField("bairro", v)}
          />
          <FormField
            label="CEP"
            required
            value={formData.cep}
            onChange={(v) => updateField("cep", v)}
            placeholder="00000-000"
          />
        </div>

        <div className={styles.grid3}>
          <FormField
            label="Cidade"
            required
            value={formData.cidade}
            onChange={(v) => updateField("cidade", v)}
          />
          <FormField
            label="Estado"
            required
            value={formData.estado}
            onChange={(v) => updateField("estado", v)}
          />
          <FormField
            label="País"
            required
            value={formData.pais}
            onChange={(v) => updateField("pais", v)}
          />
        </div>

        <FormField
          label="Observações"
          as="textarea"
          value={formData.observacoes}
          onChange={(v) => updateField("observacoes", v)}
          placeholder="Complemento, referência..."
        />
      </FormSection>

      <div className={styles.submitRow}>
        <Button onClick={handleSubmit} variant="success">
          {submitting ? "Salvando..." : "Salvar Endereço"}
        </Button>
      </div>
    </main>
  );
}