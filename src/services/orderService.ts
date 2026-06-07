import { api } from "@/lib/api";
import { OrderListResponse } from "@/types/order";

export async function fetchOrders(page = 1, pageSize = 10): Promise<OrderListResponse> {
  return await api<OrderListResponse>(
    `/sale?page=${page}&pageSize=${pageSize}&orderBy=createdAt`,
    { auth: true }
  );
}

export async function cancelOrder(saleId: number, reason: string): Promise<void> {
  await api<void>("/sale/cancel", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ saleId, reason }),
  });
}