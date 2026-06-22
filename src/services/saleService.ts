import { api } from "@/lib/api";
import { Sale, SaleFilters, SaleStatus, SaleListResponse } from "@/types/sale";
import { CreateSalePayload } from "@/types/user";

export async function fetchSales(filters?: SaleFilters): Promise<SaleResponse> {
  const params = new URLSearchParams();
  if (filters?.dataStart) params.append("dataStart", filters.dataStart);
  if (filters?.dataEnd) params.append("dataEnd", filters.dataEnd);

  const query = params.toString();
  const endpoint = `/sale${query ? `?${query}` : ""}`;

  const res = await api<SaleListResponse>(endpoint, { auth: true });
  return res.data.data;
}

export async function fetchSalesByUser(userId: number): Promise<Sale[]> {
  const res = await api<SaleListResponse>(`/sale?userId=${userId}`, { auth: true });
  return res.data.data;
}

export async function updateSaleStatus(
  saleId: number,
  status: SaleStatus
): Promise<void> {
  await api<void>(`/sale`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ status, saleId }),
  });
}

export async function createSale(payload: CreateSalePayload): Promise<void> {
  await api<void>("/sale", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}