import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { AddressListView } from "@/components/AddressListView/AddressListView";

type AddressesPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AddressesPage({ params }: AddressesPageProps) {
  const { id } = await params;
  const userId = Number(id);

  return (
    <>
      <Header title="Lista de Endereços" showBack />
      <AddressListView userId={userId} />
      <Footer />
    </>
  );
}