"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartItem } from "@/types/cart";
import { UserProfile, PaymentType } from "@/types/user";
import { fetchCartItems } from "@/services/productService";
import { fetchMe } from "@/services/userService";
import { createSale } from "@/services/saleService";

const SHIPPING = 20;

export function useCheckout() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType>("card");
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [cart, me] = await Promise.all([fetchCartItems(), fetchMe()]);
        setCartItems(cart);
        setProfile(me.data);

        // Pre-select first address and card
        if (me.data.addresses.length > 0) {
          setSelectedAddressId(me.data.addresses[0].adressId);
        }
        if (me.data.cards.length > 0) {
          setSelectedCardId(me.data.cards[0].cardId);
        }
      } catch {
        setError("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const subtotal = cartItems.reduce((sum, item) => {
    const price =
      item.product.salePrice > 0 && item.product.salePrice < item.product.price
        ? item.product.salePrice
        : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal + SHIPPING;

  const handleSubmit = async () => {
    setError(null);

    if (!selectedAddressId) {
      setError("Selecione um endereço de entrega.");
      return;
    }

    if (paymentType === "card" && !selectedCardId) {
      setError("Selecione um cartão para pagamento.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Seu carrinho está vazio.");
      return;
    }

    setSubmitting(true);
    try {
      await createSale({
        products: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        coupons: [],
        addressId: selectedAddressId,
        paymentType,
        ...(paymentType === "card" && selectedCardId
          ? { cardId: selectedCardId }
          : {}),
      });
      router.push("/user/orders");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao finalizar compra."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    cartItems,
    profile,
    loading,
    submitting,
    error,
    subtotal,
    total,
    shipping: SHIPPING,
    selectedAddressId,
    setSelectedAddressId,
    paymentType,
    setPaymentType,
    selectedCardId,
    setSelectedCardId,
    handleSubmit,
  };
}