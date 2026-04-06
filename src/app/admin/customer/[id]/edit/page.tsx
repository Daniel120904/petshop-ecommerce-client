import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { EditCustomerForm } from "@/components/EditCustomerForm/EditCustomerForm";

type EditCustomerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { id } = await params;
  const customerId = Number(id);

  return (
    <>
      <Header title="Editar Cliente" showBack />
      <EditCustomerForm customerId={customerId} />
      <Footer />
    </>
  );
}