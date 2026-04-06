"use client";

import { useState, useEffect, useCallback } from "react";
import { Category } from "@/types/category";
import { Sale, SaleFilters, ChartDataPoint } from "@/types/sale";
import { fetchCategories, fetchSalesByCategories } from "@/services/categoryService";
import { fetchSales } from "@/services/saleService";

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

function groupSalesByDate(sales: Sale[]): ChartDataPoint[] {
  const grouped: Record<string, number> = {};
  sales.forEach((sale) => {
    const key = sale.createdAt.split("T")[0];
    grouped[key] = (grouped[key] ?? 0) + 1;
  });
  return Object.keys(grouped)
    .sort()
    .map((key) => ({ date: formatDateLabel(key), Vendas: grouped[key] }));
}

function groupSalesByCategoryAndDate(
  sales: Sale[],
  selectedCategories: Category[]
): ChartDataPoint[] {
  const allDatesSet = new Set<string>();
  sales.forEach((s) => allDatesSet.add(s.createdAt.split("T")[0]));
  const allDates = Array.from(allDatesSet).sort();

  const counts: Record<string, Record<string, number>> = {};
  selectedCategories.forEach((cat) => {
    counts[cat.name] = {};
  });

  sales.forEach((sale) => {
    const dateKey = sale.createdAt.split("T")[0];
    const categoriesInSale = new Set<string>();

    sale.items?.forEach((item) => {
      const catName = item.product.category.name;
      if (selectedCategories.find((c) => c.name === catName)) {
        categoriesInSale.add(catName);
      }
    });

    categoriesInSale.forEach((catName) => {
      counts[catName][dateKey] = (counts[catName][dateKey] ?? 0) + 1;
    });
  });

  return allDates.map((dateKey) => {
    const point: ChartDataPoint = { date: formatDateLabel(dateKey) };
    selectedCategories.forEach((cat) => {
      point[cat.name] = counts[cat.name][dateKey] ?? 0;
    });
    return point;
  });
}

export function useSalesChart() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [filters, setFilters] = useState<SaleFilters>({});

  const [generalData, setGeneralData] = useState<ChartDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<ChartDataPoint[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setError("Erro ao carregar categorias."));
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sales = await fetchSales(
        Object.keys(filters).length > 0 ? filters : undefined
      );
      setGeneralData(groupSalesByDate(sales));

      if (selectedCategoryIds.length > 0) {
        const salesByCat = await fetchSalesByCategories(filters, selectedCategoryIds);
        const selected = categories.filter((c) => selectedCategoryIds.includes(c.id));
        setCategoryData(groupSalesByCategoryAndDate(salesByCat, selected));
      } else {
        setCategoryData([]);
      }
    } catch {
      setError("Erro ao carregar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [filters, selectedCategoryIds, categories]);

  useEffect(() => {
    if (categories.length > 0 || selectedCategoryIds.length === 0) {
      loadData();
    }
  }, [loadData, categories.length, selectedCategoryIds.length]);

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleFilterSubmit = (newFilters: SaleFilters) => {
    setFilters(newFilters);
  };

  const selectedCategories = categories.filter((c) =>
    selectedCategoryIds.includes(c.id)
  );

  return {
    categories,
    selectedCategoryIds,
    filters,
    generalData,
    categoryData,
    selectedCategories,
    loading,
    error,
    toggleCategory,
    handleFilterSubmit,
  };
}