import {
  Customer,
  CustomerFilters,
  CreateCustomerPayload,
  PhoneFormData,
  AddressFormData,
  CardFormData,
} from "@/types/customer";

const API_BASE = "http://localhost:3001/api";

export async function fetchCustomers(filters?: CustomerFilters): Promise<Customer[]> {
  const hasFilters = filters && Object.keys(filters).length > 0;
  const url = hasFilters
    ? `${API_BASE}/getUsersFiltres?${new URLSearchParams(filters as Record<string, string>).toString()}`
    : `${API_BASE}/getUsers`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Erro ao buscar clientes");
  return response.json();
}

export async function fetchCustomerById(customerId: number): Promise<
  Customer & { genero: string; dataNascimento: string; cpf: string; email: string }
> {
  const response = await fetch(`${API_BASE}/getUser?userId=${customerId}`);
  if (!response.ok) throw new Error("Usuário não encontrado");
  return response.json();
}

export async function deleteCustomer(customerId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/deleteUser?userId=${customerId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao excluir cliente");
}

export async function updateCustomerStatus(customerId: number, status: boolean): Promise<void> {
  const response = await fetch(`${API_BASE}/updateStatusUser`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: customerId, status }),
  });
  if (!response.ok) throw new Error("Erro ao atualizar status");
}

export async function createCustomer(payload: CreateCustomerPayload): Promise<{ id: number }> {
  const response = await fetch(`${API_BASE}/createUser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function updateCustomer(
  customerId: number,
  payload: Omit<CreateCustomerPayload, "senha" | "confirmarSenha">
): Promise<void> {
  const response = await fetch(`${API_BASE}/updateUser`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: customerId, ...payload }),
  });
  if (!response.ok) throw new Error(await response.text());
}

export async function createPhone(
  payload: PhoneFormData & { userId: number }
): Promise<void> {
  const response = await fetch(`${API_BASE}/createTelefone`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Erro ao salvar telefone");
}

export async function createAddress(
  payload: AddressFormData & { userId: number }
): Promise<void> {
  const response = await fetch(`${API_BASE}/createEndereco`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Erro ao salvar endereço");
}

export async function createCard(
  payload: CardFormData & { userId: number }
): Promise<void> {
  const response = await fetch(`${API_BASE}/createCartao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Erro ao salvar cartão");
}

export async function updateCustomerPassword(payload: {
  userId: number;
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
}): Promise<void> {
  const response = await fetch(`${API_BASE}/updateSenha`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await response.text());
}

export type AddressItem = {
  id: number;
  nome: string;
};

export async function fetchAddresses(userId: number): Promise<AddressItem[]> {
  const response = await fetch(`${API_BASE}/getEnderecos?userId=${userId}`);
  if (!response.ok) throw new Error("Erro ao buscar endereços");
  return response.json();
}

export type AddressDetail = AddressFormData & {
  id: number;
  userId: number;
};

export async function fetchAddressById(addressId: number): Promise<AddressDetail> {
  const response = await fetch(`${API_BASE}/getEndereco?enderecoId=${addressId}`);
  if (!response.ok) throw new Error("Erro ao buscar endereço");
  return response.json();
}

export async function updateAddress(
  addressId: number,
  payload: AddressFormData
): Promise<void> {
  const response = await fetch(`${API_BASE}/updateEndereco`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enderecoId: addressId, ...payload }),
  });
  if (!response.ok) throw new Error(await response.text());
}


export type CardItem = {
  id: number;
  numero: string;
  preferencial: boolean;
};

export async function fetchCards(userId: number): Promise<CardItem[]> {
  const response = await fetch(`${API_BASE}/getCartoes?userId=${userId}`);
  if (!response.ok) throw new Error("Erro ao buscar cartões");
  return response.json();
}

export async function updatePreferredCard(cardId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/updateCartaoPreferencial`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartaoId: cardId, preferencial: true }),
  });
  if (!response.ok) throw new Error("Erro ao atualizar cartão preferencial");
}