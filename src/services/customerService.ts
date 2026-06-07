import { api } from "@/lib/api";
import {
  Customer,
  CreateCustomerPayload,
  PhoneFormData,
  AddressFormData,
  CardFormData,
  CustomerResponse,
  FindCustomer,
} from "@/types/customer";

// ─── Customer ─────────────────────────────────────────────────────────────────

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await api<CustomerResponse>("/user", { auth: true });

  return res.data;
}

export async function fetchCustomerById(customerId: number): Promise<
  Customer
> {
  const res = await api<FindCustomer>(
    `/user/${customerId}`,
    { auth: true }
  );
  return res.data;
}

export async function deleteCustomer(customerId: number): Promise<void> {
  await api<void>(`/user/${customerId}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function updateCustomerStatus(customerId: number, status: boolean): Promise<void> {
  await api<void>(`/user/active`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ userId: customerId, active: status }),
  });
}

export async function createCustomer(payload: CreateCustomerPayload): Promise<{ id: number }> {
  const res = await api<{ id: number }>("/user", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
  return res;
}

//"Mahas arruma aqui o balho pro master atualizar usuario"
export async function updateCustomer( 
  customerId: number,
  payload: Omit<CreateCustomerPayload, "senha" | "confirmarSenha">
): Promise<void> {
  await api<void>(`/user/${customerId}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

//"Mahas arruma aqui, tota para atualizar a senha de um usuario"
export async function updateCustomerPassword(payload: {
  userId: number;
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
}): Promise<void> {
  const { userId, ...body } = payload;
  await api<void>(`/password`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(body),
  });
}

// ─── Address ──────────────────────────────────────────────────────────────────

export type AddressItem = {
  id: number;
  nome: string;
};

export type AddressDetail = AddressFormData & {
  id: number;
  userId: number;
};

export async function fetchAddresses(userId: number): Promise<AddressItem[]> {
  const res = await api<AddressItem[]>(`/user/${userId}/address`, { auth: true });
  return res;
}

export async function fetchAddressById(addressId: number): Promise<AddressDetail> {
  const res = await api<AddressDetail>(`/address/${addressId}`, { auth: true });
  return res;
}

export async function createAddress(
  payload: AddressFormData & { userId: number }
): Promise<void> {
  const { userId, ...body } = payload;
  await api<void>(`/user/${userId}/address`, {
    method: "POST",
    auth: true,
    body: JSON.stringify(body),
  });
}

export async function updateAddress(
  addressId: number,
  payload: AddressFormData
): Promise<void> {
  await api<void>(`/address/${addressId}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

// ─── Phone ────────────────────────────────────────────────────────────────────

export async function createPhone(
  payload: PhoneFormData & { userId: number }
): Promise<void> {
  const { userId, ...body } = payload;
  await api<void>(`/user/${userId}/phone`, {
    method: "POST",
    auth: true,
    body: JSON.stringify(body),
  });
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export type CardItem = {
  id: number;
  numero: string;
  preferencial: boolean;
};

export async function fetchCards(userId: number): Promise<CardItem[]> {
  const res = await api<CardItem[]>(`/user/${userId}/card`, { auth: true });
  return res;
}

export async function createCard(
  payload: CardFormData & { userId: number }
): Promise<void> {
  const { userId, ...body } = payload;
  await api<void>(`/user/${userId}/card`, {
    method: "POST",
    auth: true,
    body: JSON.stringify(body),
  });
}

export async function updatePreferredCard(cardId: number): Promise<void> {
  await api<void>(`/card/${cardId}/preferred`, {
    method: "PUT",
    auth: true,
  });
}