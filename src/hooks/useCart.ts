"use client";

import { useState, useEffect } from "react";
import { CartItem } from "@/types/cart";
import { fetchCartItems, updateCartItemQuantity } from "@/services/productService";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCartItems();
        setItems(data);
      } catch {
        setError("Erro ao carregar o carrinho. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleIncrease = async (productId: number, currentQty: number) => {
    const newQty = currentQty + 1;
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQty } : item
      )
    );
    try {
      await updateCartItemQuantity(productId, newQty);
    } catch {
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity: currentQty } : item
        )
      );
      setError("Erro ao atualizar item.");
    }
  };

  const handleDecrease = async (productId: number, currentQty: number) => {
    const newQty = currentQty - 1;

    // Optimistically remove or decrease
    if (newQty === 0) {
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity: newQty } : item
        )
      );
    }

    try {
      // quantity: 0 tells the API to remove the item
      await updateCartItemQuantity(productId, newQty);
    } catch {
      // Revert to original state on failure
      const data = await fetchCartItems();
      setItems(data);
      setError("Erro ao atualizar item.");
    }
  };

  const total = items.reduce((sum, item) => {
    const price =
      item.product.salePrice > 0 && item.product.salePrice < item.product.price
        ? item.product.salePrice
        : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return { items, loading, error, total, handleIncrease, handleDecrease };
}