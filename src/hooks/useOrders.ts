"use client";

import { useState, useEffect, useCallback } from "react";
import { Order, OrderMeta } from "@/types/order";
import { fetchOrders, cancelOrder } from "@/services/orderService";

export function useOrders() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [meta, setMeta]       = useState<OrderMeta | null>(null);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchOrders(p);
      setOrders(res.data.data);
      setMeta(res.data.meta);
    } catch {
      setError("Erro ao carregar histórico de compras.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const handleCancel = async (saleId: number, reason: string) => {
    await cancelOrder(saleId, reason);
    await load(page);
  };

  return { orders, meta, page, setPage, loading, error, handleCancel };
}