import styles from "../ChatViewModule/ChatView.module.css";

export function TypingIndicator() {
  return (
    <div className={`${styles.row} ${styles.rowBot}`}>
      <span className={styles.avatar}>🐾</span>
      <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.typing}`}>
        <span /><span /><span />
      </div>
    </div>
  );
}