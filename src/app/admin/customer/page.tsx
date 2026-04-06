import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { CustomerListView } from "@/components/CustomerListView/CustomerListView";

export default function CustomerPage() {
  return (
    <>
      <Header title="Lista de Clientes" showBack />
      <CustomerListView />
      <Footer />
    </>
  );
}