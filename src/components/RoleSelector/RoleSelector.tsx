import { Button } from "@/components/buttons";

import styles from "./RoleSelector.module.css";

export function RoleSelector() {
  return (
    <main className={styles.container}>
      <h2>Bem-vindo! - Escolha o usuário</h2>

      <Button href="/admin" variant="success">
        Administrador
      </Button>

      <Button href="/user" variant="success">
        Cliente
      </Button>
    </main>
  );
}