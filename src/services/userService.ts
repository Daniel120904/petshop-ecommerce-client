import { api } from "@/lib/api";
import {
  UserProfileResponse,
  UpdateUserPayload,
  AddressPayload,
  UpdateAddressPayload,
  PhonePayload,
  CardPayload,
} from "@/types/user";

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function fetchMe(): Promise<UserProfileResponse> {
  return await api<UserProfileResponse>("/me", { auth: true });
}

export async function updateMe(payload: UpdateUserPayload): Promise<void> {
  await api<void>("/user", {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

// ─── Address ──────────────────────────────────────────────────────────────────

export async function createUserAddress(payload: AddressPayload): Promise<void> {
  await api<void>("/address", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateUserAddress(payload: UpdateAddressPayload): Promise<void> {
  await api<void>("/address", {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteUserAddress(addressId: number): Promise<void> {
  await api<void>(`/address?addressId=${addressId}`, {
    method: "DELETE",
    auth: true,
  });
}

// ─── Phone ────────────────────────────────────────────────────────────────────

export async function createUserPhone(payload: PhonePayload): Promise<void> {
  await api<void>("/phone", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteUserPhone(phoneId: number): Promise<void> {
  await api<void>(`/phone?phoneId=${phoneId}`, {
    method: "DELETE",
    auth: true,
  });
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export async function createUserCard(payload: CardPayload): Promise<void> {
  await api<void>("/card", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteUserCard(cardId: number): Promise<void> {
  await api<void>("/card", {
    method: "DELETE",
    auth: true,
    body: JSON.stringify({ cardId }),
  });
}