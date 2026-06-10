import styles from "./UserWelcome.module.css";

export function UserWelcome() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Bem-vindo ao E-commerce para seu Pet</h1>
      <p className={styles.subtitle}>
        Explore nossos produtos, gerencie seu carrinho e acompanhe seus pedidos.
      </p>
    </main>
  );
}