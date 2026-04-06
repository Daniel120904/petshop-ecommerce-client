import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { CreateAddressForm } from "@/components/CreateAddressForm/CreateAddressForm";

type NewAddressPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewAddressPage({ params }: NewAddressPageProps) {
  const { id } = await params;
  const userId = Number(id);

  return (
    <>
      <Header title="Novo Endereço" showBack />
      <CreateAddressForm userId={userId} />
      <Footer />
    </>
  );
}