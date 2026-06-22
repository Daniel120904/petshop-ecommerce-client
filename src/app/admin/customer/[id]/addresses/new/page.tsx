import { CreateAddressForm } from "@/components/CreateAddressForm/CreateAddressForm";
import { Header } from "@/components/Header/Header";

type NewAddressPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewAddressPage({ params }: NewAddressPageProps) {
  const { id } = await params;
  const userId = Number(id);

  return (
    <>
      <Header title="Clientes" showBack backHref="/admin" />
      <CreateAddressForm userId={userId} />
    </>
  );
}