"use client";

import { useState, useEffect, useCallback } from "react";
import { Customer, CustomerFilters } from "@/types/customer";
import {
  fetchCustomers,
  deleteCustomer,
  updateCustomerStatus,
} from "@/services/customerService";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CustomerFilters>({});

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch {
      setError("Erro ao carregar clientes. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleDelete = async (customerId: number) => {
    if (!confirm("Deseja excluir este cliente?")) return;
    try {
      await deleteCustomer(customerId);
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    } catch {
      alert("Erro ao excluir cliente.");
    }
  };

  const handleToggleStatus = async (customerId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, active: newStatus } : c))
    );
    try {
      await updateCustomerStatus(customerId, newStatus);
    } catch {
      setCustomers((prev) =>
        prev.map((c) => (c.id === customerId ? { ...c, active: currentStatus } : c))
      );
      alert("Erro ao atualizar status.");
    }
  };

  return {
    customers,
    loading,
    error,
    filters,
    setFilters,
    handleDelete,
    handleToggleStatus,
  };
}