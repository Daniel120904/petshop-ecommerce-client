import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { EditAddressForm } from "@/components/EditAddressForm/EditAddressForm";

type EditAddressPageProps = {
  params: Promise<{ id: string; addressId: string }>;
};

export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const { id, addressId } = await params;

  return (
    <>
      <Header title="Editar Endereço" showBack />
      <EditAddressForm userId={Number(id)} addressId={Number(addressId)} />
      <Footer />
    </>
  );
}