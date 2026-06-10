"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, ProductMeta } from "@/types/product";
import { fetchProducts, addToCart } from "@/services/productService";

const PAGE_SIZE = 12;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<ProductMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [successId, setSuccessId] = useState<number | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { products, meta } = await fetchProducts({ page, pageSize: PAGE_SIZE });
      setProducts(products);
      setMeta(meta);
    } catch {
      setError("Erro ao carregar produtos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddToCart = async (productId: number) => {
    setAddingId(productId);
    try {
      await addToCart(productId, 1);
      setSuccessId(productId);
      setTimeout(() => setSuccessId(null), 2000);
    } catch {
      setError("Falha ao adicionar o produto ao carrinho.");
    } finally {
      setAddingId(null);
    }
  };

  return {
    products,
    meta,
    page,
    setPage,
    loading,
    error,
    addingId,
    successId,
    handleAddToCart,
  };
}