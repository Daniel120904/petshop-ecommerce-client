import { Sale, SaleFilters, SaleStatus } from "@/types/sale";

const API_BASE = "http://localhost:3001/api";

export async function fetchSales(filters?: SaleFilters): Promise<Sale[]> {
  const params = new URLSearchParams();
  if (filters?.dataStart) params.append("dataStart", filters.dataStart);
  if (filters?.dataEnd) params.append("dataEnd", filters.dataEnd);

  const query = params.toString();
  const url = `${API_BASE}/getSales${query ? `?${query}` : ""}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Erro ao buscar vendas");
  return response.json();
}

export async function updateSaleStatus(
  saleId: number,
  status: SaleStatus
): Promise<void> {
  const response = await fetch(`${API_BASE}/updateStatusSale`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: saleId, status }),
  });
  if (!response.ok) throw new Error("Erro ao atualizar status");
}