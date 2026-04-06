"use client";

import { useState, useCallback } from "react";
import { CustomerFilters } from "@/types/customer";

type FilterKey = "nome" | "cpf" | "email" | "telefone";

const FILTER_KEYS: FilterKey[] = ["nome", "cpf", "email", "telefone"];

export function useSearchFilters(onFiltersChange: (filters: CustomerFilters) => void) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<FilterKey, boolean>>({
    nome: false,
    cpf: false,
    email: false,
    telefone: false,
  });

  const buildFilters = useCallback(
    (term: string, filters: Record<FilterKey, boolean>): CustomerFilters => {
      if (!term.trim()) return {};

      const checked = FILTER_KEYS.filter((k) => filters[k]);
      if (checked.length === 0) return { search: term };

      return Object.fromEntries(checked.map((k) => [k, term]));
    },
    []
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFiltersChange(buildFilters(value, activeFilters));
  };

  const handleFilterToggle = (key: FilterKey, checked: boolean) => {
    const updated = { ...activeFilters, [key]: checked };
    setActiveFilters(updated);
    onFiltersChange(buildFilters(searchTerm, updated));
  };

  const handleSelectAll = (checked: boolean) => {
    const updated = Object.fromEntries(FILTER_KEYS.map((k) => [k, checked])) as Record<FilterKey, boolean>;
    setActiveFilters(updated);
    onFiltersChange(buildFilters(searchTerm, updated));
  };

  const allSelected = FILTER_KEYS.every((k) => activeFilters[k]);

  return {
    searchTerm,
    activeFilters,
    allSelected,
    handleSearchChange,
    handleFilterToggle,
    handleSelectAll,
    FILTER_KEYS,
  };
}