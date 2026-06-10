"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCustomerById, updateCustomer } from "@/services/customerService";

export type EditCustomerFormData = {
  nome: string;
  genero: string;
  dataNascimento: string;
  cpf: string;
};

export function useEditCustomer(customerId: number) {
  const router = useRouter();

  const [formData, setFormData] = useState<EditCustomerFormData>({
    nome: "",
    genero: "",
    dataNascimento: "",
    cpf: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCustomer() {
      try {
        const user = await fetchCustomerById(customerId);
        setFormData({
          nome: user.name ?? "",
          genero: user.genderId == 1 ? "Masculino" : user.genderId == 2 ? "Feminino" : "Outro",
          dataNascimento: user.birthday
            ? user.birthday.split("T")[0]
            : "",
          cpf: user.cpf ?? "",
        });
      } catch {
        setError("Erro ao buscar dados do cliente.");
      } finally {
        setLoading(false);
      }
    }

    loadCustomer();
  }, [customerId]);

  const updateField = (field: keyof EditCustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await updateCustomer(customerId, formData);
      router.push("/admin/customer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar cliente.");
    } finally {
      setSubmitting(false);
    }
  };

  return { formData, loading, submitting, error, updateField, handleSubmit };
}