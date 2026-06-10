"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProfile, UpdateUserPayload, AddressPayload, UpdateAddressPayload, PhonePayload, CardPayload } from "@/types/user";
import {
  fetchMe,
  updateMe,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  createUserPhone,
  deleteUserPhone,
  createUserCard,
  deleteUserCard,
} from "@/services/userService";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMe();
      setProfile(res.data);
    } catch {
      setError("Erro ao carregar perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleUpdateMe = async (payload: UpdateUserPayload) => {
    await updateMe(payload);
    await loadProfile();
  };

  const handleCreateAddress = async (payload: AddressPayload) => {
    await createUserAddress(payload);
    await loadProfile();
  };

  const handleUpdateAddress = async (payload: UpdateAddressPayload) => {
    await updateUserAddress(payload);
    await loadProfile();
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm("Deseja excluir este endereço?")) return;
    await deleteUserAddress(addressId);
    setProfile((prev) =>
      prev ? { ...prev, addresses: prev.addresses.filter((a) => a.adressId !== addressId) } : prev
    );
  };

  const handleCreatePhone = async (payload: PhonePayload) => {
    await createUserPhone(payload);
    await loadProfile();
  };

  const handleDeletePhone = async (phoneId: number) => {
    if (!confirm("Deseja excluir este telefone?")) return;
    await deleteUserPhone(phoneId);
    setProfile((prev) =>
      prev ? { ...prev, phones: prev.phones.filter((p) => p.phoneId !== phoneId) } : prev
    );
  };

  const handleCreateCard = async (payload: CardPayload) => {
    await createUserCard(payload);
    await loadProfile();
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm("Deseja excluir este cartão?")) return;
    await deleteUserCard(cardId);
    setProfile((prev) =>
      prev ? { ...prev, cards: prev.cards.filter((c) => c.cardId !== cardId) } : prev
    );
  };

  return {
    profile,
    loading,
    error,
    handleUpdateMe,
    handleCreateAddress,
    handleUpdateAddress,
    handleDeleteAddress,
    handleCreatePhone,
    handleDeletePhone,
    handleCreateCard,
    handleDeleteCard,
    reload: loadProfile,
  };
}