"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatBubble } from "../ChatBubble/ChatBubble";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator";
import styles from "../ChatViewModule/ChatView.module.css";

export function ChatView() {
  const { messages, loading, send } = useChat();
  const [input, setInput]           = useState("");
  const bottomRef                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    send(input);
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className={styles.page}>
      {/* ── messages area ── */}
      <div className={styles.feed}>
        {messages.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.paw}>🐾</span>
            <p>Olá! Sou o assistente do PetShop.</p>
            <p>Me conta o que seu pet precisa!</p>
          </div>
        )}

        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* ── input bar ── */}
      <div className={styles.bar}>
        <textarea
          className={styles.textarea}
          rows={1}
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
        />
        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={loading || !input.trim()}
          aria-label="Enviar"
        >
          <SendIcon />
        </button>
      </div>
    </main>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}