import { api } from "@/lib/api";
import { Product, ProductFilters, ProductListResponse } from "@/types/product";

export async function fetchProducts(
  filters?: ProductFilters
): Promise<{ products: Product[]; meta: ProductListResponse["data"]["meta"] }> {
  const params = new URLSearchParams();
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.pageSize) params.append("pageSize", String(filters.pageSize));
  if (filters?.orderBy) params.append("orderBy", filters.orderBy);

  const query = params.toString();
  const endpoint = `/product${query ? `?${query}` : ""}`;

  const res = await api<ProductListResponse>(endpoint, { auth: true });
  return { products: res.data.data, meta: res.data.meta };
}

export async function addToCart(productId: number, quantity: number): Promise<void> {
  await api<void>("/cart", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function updateCart(productId: number, quantity: number): Promise<void> {
  await api<void>("/cart", {
    method: "PUT",
    auth: true,
    body: JSON.stringify({ items: [{ productId, quantity }] }),
  });
}

export async function fetchCartItems(): Promise<import("@/types/cart").CartItem[]> {
  const res = await api<import("@/types/cart").CartResponse>("/cart", { auth: true });
  return res.data.data;
}

export async function updateCartItemQuantity(
  productId: number,
  quantity: number
): Promise<void> {
  await api<void>("/cart", {
    method: "PUT",
    auth: true,
    body: JSON.stringify({ items: [{ productId, quantity }] }),
  });
}

export async function fetchFreight(addressId: number): Promise<number> {
  const res = await api<{ data: { value: number } }>(`/freight/check?addressId=${addressId}`, {
    method: "GET",
    auth: true,
  });
  return res.data.value;
}