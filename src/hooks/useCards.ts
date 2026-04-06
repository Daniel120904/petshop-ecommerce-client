"use client";

import { useState, useEffect } from "react";
import { CardItem, fetchCards, updatePreferredCard } from "@/services/customerService";

export function useCards(userId: number) {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      setError("ID do cliente inválido.");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const data = await fetchCards(userId);
        setCards(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar cartões."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userId]);

  const handleSetPreferred = async (cardId: number) => {
    setCards((prev) =>
      prev.map((c) => ({ ...c, preferencial: c.id === cardId }))
    );
    try {
      await updatePreferredCard(cardId);
    } catch {
      setCards((prev) =>
        prev.map((c) => ({ ...c, preferencial: false }))
      );
      alert("Erro ao atualizar cartão preferencial.");
    }
  };

  return { cards, loading, error, handleSetPreferred };
}