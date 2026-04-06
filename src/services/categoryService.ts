import { Category } from "@/types/category";
import { Sale, SaleFilters } from "@/types/sale";

const API_BASE = "http://localhost:3001/api";

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/getCategories`);
  if (!response.ok) throw new Error("Erro ao buscar categorias");
  return response.json();
}

export async function fetchSalesByCategories(
  filters: SaleFilters,
  categoryIds: number[]
): Promise<Sale[]> {
  const params = new URLSearchParams();
  if (filters.dataStart) params.append("dataStart", filters.dataStart);
  if (filters.dataEnd) params.append("dataEnd", filters.dataEnd);
  params.append("categoriesId", `[${categoryIds.join(",")}]`);

  const response = await fetch(`${API_BASE}/getSalesByCategories?${params.toString()}`);
  if (!response.ok) throw new Error("Erro ao buscar vendas por categorias");
  return response.json();
}