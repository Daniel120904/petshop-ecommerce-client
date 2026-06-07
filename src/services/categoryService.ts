import { api } from "@/lib/api";
import { Category, CategoryResponse } from "@/types/category";
import { Sale, SaleFilters } from "@/types/sale";

export async function fetchCategories(): Promise<Category[]> {
  const res = await api<CategoryResponse>("/category", { auth: true });
  return res.data.data;
}

export async function fetchSalesByCategories(
  filters: SaleFilters,
  categoryIds: number[]
): Promise<Sale[]> {
  const params = new URLSearchParams();
  if (filters.dataStart) params.append("dataStart", filters.dataStart);
  if (filters.dataEnd) params.append("dataEnd", filters.dataEnd);
  params.append("categoriesId", `[${categoryIds.join(",")}]`);

  const res = await api<Sale[]>(`/sale/by-category?${params.toString()}`, { auth: true });
  return res;
}