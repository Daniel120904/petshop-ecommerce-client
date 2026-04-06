"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCard } from "@/services/customerService";
import { CardFormData } from "@/types/customer";

const emptyForm = (): CardFormData => ({
  numero: "",
  nome: "",
  bandeira: "",
  cvv: "",
});

export function useCreateCard(userId: number) {
  const router = useRouter();

  const [formData, setFormData] = useState<CardFormData>(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof CardFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await createCard({
        ...formData,
        numero: formData.numero.replace(/\s+/g, ""),
        userId,
      });
      router.push(`/admin/customer/${userId}/cards`);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Erro ao salvar cartão: ${err.message}`
          : "Erro ao salvar cartão."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return { formData, submitting, error, updateField, handleSubmit };
}