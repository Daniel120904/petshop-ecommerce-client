import { AddressListView } from "@/components/AddressListView/AddressListView";
import { Header } from "@/components/Header/Header";

type AddressesPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AddressesPage({ params }: AddressesPageProps) {
  const { id } = await params;
  const userId = Number(id);

  return (
    <>
      <Header title="Clientes" showBack backHref="/admin" />
      <AddressListView userId={userId} />
    </>
  );
}