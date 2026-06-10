import { ChatMessage } from "@/hooks/useChat";
import styles from "../ChatViewModule/ChatView.module.css";

// Converte **negrito** em <strong> e preserva quebras de linha
function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

type Props = { message: ChatMessage };

export function ChatBubble({ message }: Props) {
  const isUser = message.role === "user";
  return (
    <div className={`${styles.row} ${isUser ? styles.rowUser : styles.rowBot}`}>
      {!isUser && <span className={styles.avatar}>🐾</span>}
      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleBot}`}>
        {renderText(message.text)}
      </div>
    </div>
  );
}