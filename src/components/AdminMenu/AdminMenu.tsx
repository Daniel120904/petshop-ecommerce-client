import { Button } from "@/components/buttons";
import styles from "./AdminMenu.module.css";

export function AdminMenu() {
  return (
    <main className={styles.container}>
      <h2>Área do Administrador</h2>

      <div className={styles.buttons}>
        <Button href="/admin/customer" variant="success">
          Ir para Clientes
        </Button>

        <Button href="/admin/sales/history" variant="success">
          Ir para Vendas
        </Button>
      </div>
    </main>
  );
}