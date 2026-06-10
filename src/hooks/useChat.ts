"use client";

import { useState, useRef } from "react";
import { sendChatMessage } from "@/services/chatService";

export type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading]   = useState(false);
  const idRef = useRef(0);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { id: ++idRef.current, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const reply = await sendChatMessage(text);
      const botMsg: ChatMessage = { id: ++idRef.current, role: "assistant", text: reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: ChatMessage = {
        id: ++idRef.current,
        role: "assistant",
        text: "Desculpe, ocorreu um erro. Tente novamente.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, send };
}