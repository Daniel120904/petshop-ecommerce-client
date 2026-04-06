"use client";

import styles from "./ChangePasswordForm.module.css";
import { useChangePassword } from "@/hooks/useChangePassword";
import { FormSection } from "@/components/FormSection/FormSection";
import { FormField } from "@/components/FormField/FormField";
import { Button } from "@/components/buttons";

type ChangePasswordFormProps = {
  customerId: number;
};

export function ChangePasswordForm({ customerId }: ChangePasswordFormProps) {
  const { formData, submitting, error, updateField, handleSubmit } =
    useChangePassword(customerId);

  return (
    <main className={styles.container}>
      {error && <div className={styles.errorBanner}>{error}</div>}

      <FormSection title="Atualizar Senha">
        <FormField
          label="Senha Atual"
          required
          type="password"
          value={formData.senhaAtual}
          onChange={(v) => updateField("senhaAtual", v)}
        />
        <FormField
          label="Nova Senha"
          required
          type="password"
          value={formData.novaSenha}
          onChange={(v) => updateField("novaSenha", v)}
        />
        <FormField
          label="Confirmar Nova Senha"
          required
          type="password"
          value={formData.confirmarNovaSenha}
          onChange={(v) => updateField("confirmarNovaSenha", v)}
        />
      </FormSection>

      <div className={styles.submitRow}>
        <Button onClick={handleSubmit} variant="primary">
          {submitting ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </main>
  );
}