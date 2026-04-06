"use client";

import { useState, useEffect, useCallback } from "react";
import { Sale, SaleFilters, SaleStatus } from "@/types/sale";
import { fetchSales, updateSaleStatus } from "@/services/saleService";

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filters, setFilters] = useState<SaleFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSales(
        Object.keys(filters).length > 0 ? filters : undefined
      );
      setSales(data);
    } catch {
      setError("Erro ao carregar vendas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  const handleUpdateStatus = async (saleId: number, newStatus: SaleStatus) => {
    if (!confirm("Deseja realmente alterar o status desta venda?")) return;

    setSales((prev) =>
      prev.map((s) => (s.id === saleId ? { ...s, status: newStatus } : s))
    );

    try {
      await updateSaleStatus(saleId, newStatus);
    } catch {
      setError("Erro ao atualizar status. Tente novamente.");
      loadSales();
    }
  };

  const handleFilterSubmit = (newFilters: SaleFilters) => {
    setFilters(newFilters);
  };

  return { sales, loading, error, handleUpdateStatus, handleFilterSubmit };
}