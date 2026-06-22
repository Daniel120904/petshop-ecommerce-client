import { AdminMenu } from "@/components/AdminMenu/AdminMenu";
import { Header } from "@/components/Header/Header";

export default function AdminPage() {
  return (
    <>
      <Header
        title="Administrador"
        showBack
        backHref="/admin"
      />
      <AdminMenu />
    </>
  );
}
