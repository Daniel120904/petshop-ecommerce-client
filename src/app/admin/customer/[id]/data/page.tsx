import { CustomerDataView } from "@/components/CustomerDataView/CustomerDataView";
import { Header } from "@/components/Header/Header";

export default function CustomerDataPage() {
  return (
    <>
      <Header title="Clientes" showBack backHref="/admin" />
      <CustomerDataView />
    </>
  );
}
