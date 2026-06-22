import { CreateCustomerForm } from "@/components/CreateCustomerForm/CreateCustomerForm";
import { Header } from "@/components/Header/Header";

export default function NewCustomerPage() {
  return (
    <>
      <Header title="Clientes" showBack backHref="/admin" />
      <CreateCustomerForm />
    </>
  );
}
