"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCustomerPassword } from "@/services/customerService";

type PasswordFormData = {
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
};

export function useChangePassword(customerId: number) {
  const router = useRouter();

  const [formData, setFormData] = useState<PasswordFormData>({
    senhaAtual: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof PasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (formData.novaSenha !== formData.confirmarNovaSenha) {
      setError("As senhas não conferem!");
      return;
    }

    setSubmitting(true);
    try {
      await updateCustomerPassword({ userId: customerId, ...formData });
      router.push("/admin/customer");
    } catch (err) {
      setError(
        err instanceof Error
          ? `Erro ao atualizar senha: ${err.message}`
          : "Erro ao atualizar senha."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return { formData, submitting, error, updateField, handleSubmit };
}