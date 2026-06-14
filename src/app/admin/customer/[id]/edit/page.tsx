import { EditCustomerForm } from "@/components/EditCustomerForm/EditCustomerForm";
import { Header } from "@/components/Header/Header";

type EditCustomerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { id } = await params;
  const customerId = Number(id);

  return (
    <>
      <Header title="Clientes" showBack backHref="/admin" />
      <EditCustomerForm customerId={customerId} />
    </>
  );
}