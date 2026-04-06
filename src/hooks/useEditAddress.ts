"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAddressById, updateAddress } from "@/services/customerService";
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

export function useEditAddress(userId: number, addressId: number) {
  const router = useRouter();

  const [formData, setFormData] = useState<AddressFormData>(emptyForm());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!addressId || isNaN(addressId)) {
      setError("ID do endereço inválido.");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const data = await fetchAddressById(addressId);
        setFormData({
          nome: data.nome ?? "",
          tipoEndereco: data.tipoEndereco ?? "",
          tipoResidencia: data.tipoResidencia ?? "",
          tipoLogradouro: data.tipoLogradouro ?? "",
          logradouro: data.logradouro ?? "",
          numero: data.numero ?? "",
          bairro: data.bairro ?? "",
          cep: data.cep ?? "",
          cidade: data.cidade ?? "",
          estado: data.estado ?? "",
          pais: data.pais ?? "Brasil",
          observacoes: data.observacoes ?? "",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? `Erro ao carregar endereço: ${err.message}`
            : "Erro ao carregar endereço."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [addressId]);

  const updateField = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await updateAddress(addressId, formData);
      router.push(`/admin/customer/${userId}/addresses`);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Erro ao atualizar endereço: ${err.message}`
          : "Erro ao atualizar endereço."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return { formData, loading, submitting, error, updateField, handleSubmit };
}