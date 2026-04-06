"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AddressFormData,
  CardFormData,
  PhoneFormData,
  CreateCustomerPayload,
} from "@/types/customer";
import {
  createCustomer,
  createPhone,
  createAddress,
  createCard,
} from "@/services/customerService";

const emptyAddress = (): AddressFormData => ({
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

const emptyCard = (): CardFormData => ({
  numero: "",
  nome: "",
  bandeira: "",
  cvv: "",
});

const emptyPhone = (): PhoneFormData => ({
  tipo: "",
  ddd: "",
  numero: "",
});

const emptyCustomer = (): CreateCustomerPayload => ({
  nome: "",
  genero: "",
  dataNascimento: "",
  cpf: "",
  email: "",
  senha: "",
  confirmarSenha: "",
});

export function useCreateCustomer() {
  const router = useRouter();

  const [customerData, setCustomerData] = useState<CreateCustomerPayload>(emptyCustomer());
  const [phone, setPhone] = useState<PhoneFormData>(emptyPhone());
  const [addresses, setAddresses] = useState<AddressFormData[]>([]);
  const [cards, setCards] = useState<CardFormData[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCustomerField = (field: keyof CreateCustomerPayload, value: string) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePhoneField = (field: keyof PhoneFormData, value: string) => {
    setPhone((prev) => ({ ...prev, [field]: value }));
  };

  const addAddress = () => setAddresses((prev) => [...prev, emptyAddress()]);

  const removeAddress = (index: number) =>
    setAddresses((prev) => prev.filter((_, i) => i !== index));

  const updateAddress = (index: number, field: keyof AddressFormData, value: string) => {
    setAddresses((prev) =>
      prev.map((addr, i) => (i === index ? { ...addr, [field]: value } : addr))
    );
  };

  const addCard = () => setCards((prev) => [...prev, emptyCard()]);

  const removeCard = (index: number) =>
    setCards((prev) => prev.filter((_, i) => i !== index));

  const updateCard = (index: number, field: keyof CardFormData, value: string) => {
    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, [field]: value } : card))
    );
  };

  const validate = (): string | null => {
    if (customerData.senha !== customerData.confirmarSenha)
      return "As senhas não conferem!";
    if (addresses.length === 0)
      return "Você deve cadastrar pelo menos um endereço!";
    if (cards.length === 0)
      return "Você deve cadastrar pelo menos um cartão!";

    const hasBilling = addresses.some(
      (a) => a.tipoEndereco === "Cobrança" || a.tipoEndereco === "Cobrança e Entrega"
    );
    const hasDelivery = addresses.some(
      (a) => a.tipoEndereco === "Entrega" || a.tipoEndereco === "Cobrança e Entrega"
    );

    if (!hasBilling || !hasDelivery)
      return "É necessário cadastrar pelo menos um endereço de cobrança e um de entrega, ou um que seja ambos.";

    return null;
  };

  const handleSubmit = async () => {
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const newUser = await createCustomer(customerData);
      const userId = newUser.id;

      await createPhone({ ...phone, userId });

      for (const address of addresses) {
        await createAddress({ ...address, userId });
      }

      for (const card of cards) {
        await createCard({ ...card, userId });
      }

      router.push("/admin/customer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar cliente.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
  };
}