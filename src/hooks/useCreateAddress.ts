"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAddress } from "@/services/customerService";
import { AddressFormData } from "@/types/customer";

const emptyForm = (): AddressFormData => ({
  nome: "",
  tipoEndereco: "",
  tipoResidencia: "",
  tipoLogradouro: "",
  logradouro: "",
  numero: "",
  bairro: "",
  cep: "",
  cidade: "",
  estado: "",
  pais: "Brasil",
  observacoes: "",
});

export function useCreateAddress(userId: number) {
  const router = useRouter();

  const [formData, setFormData] = useState<AddressFormData>(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await createAddress({ ...formData, userId });
      router.push(`/admin/customer/${userId}/addresses`);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Erro ao criar endereço: ${err.message}`
          : "Erro ao criar endereço."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return { formData, submitting, error, updateField, handleSubmit };
}