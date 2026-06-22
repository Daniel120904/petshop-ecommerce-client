import { CustomerListView } from "@/components/CustomerListView/CustomerListView";
import { Header } from "@/components/Header/Header";

export default function CustomerPage() {
  return (
    <>
      <Header title="Clientes" showBack backHref="/admin" />
      <CustomerListView />
    </>
  );
}
