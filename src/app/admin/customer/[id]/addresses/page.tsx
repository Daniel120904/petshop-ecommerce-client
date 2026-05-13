import { AddressListView } from "@/components/AddressListView/AddressListView";

type AddressesPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AddressesPage({ params }: AddressesPageProps) {
  const { id } = await params;
  const userId = Number(id);

  return (
    <>
      <AddressListView userId={userId} />
    </>
  );
}