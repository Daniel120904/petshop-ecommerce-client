"use client";

import { useState, useEffect } from "react";
import { Sale } from "@/types/sale";
import { fetchSalesByUser } from "@/services/saleService";

export function useCustomerSales(userId: number) {
  const [sales, setSales] = useState<Sale[]>([]);
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
        const data = await fetchSalesByUser(userId);
        setSales(data);
      } catch {
        setError("Erro ao carregar transações.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userId]);

  return { sales, loading, error };
}