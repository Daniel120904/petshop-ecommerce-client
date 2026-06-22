import { EditAddressForm } from "@/components/EditAddressForm/EditAddressForm";
import { Header } from "@/components/Header/Header";

type EditAddressPageProps = {
  params: Promise<{ id: string; addressId: string }>;
};

export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const { id, addressId } = await params;

  return (
    <>
      <Header title="Clientes" showBack backHref="/admin" />
      <EditAddressForm userId={Number(id)} addressId={Number(addressId)} />
    </>
  );
}