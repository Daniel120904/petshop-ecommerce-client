"use client";

import { useState, useEffect } from "react";
import { AddressItem, fetchAddresses } from "@/services/customerService";

export function useAddresses(userId: number) {
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      setError("ID do cliente inválido.");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const data = await fetchAddresses(userId);
        setAddresses(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar endereços."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userId]);

  return { addresses, loading, error };
}