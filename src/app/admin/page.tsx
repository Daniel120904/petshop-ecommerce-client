import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { AdminMenu } from "@/components/AdminMenu/AdminMenu";

export default function AdminPage() {
  return (
    <>
      <Header title="PetShop - Administrador" showBack />
      <AdminMenu />
      <Footer />
    </>
  );
}