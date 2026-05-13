import { EditAddressForm } from "@/components/EditAddressForm/EditAddressForm";

type EditAddressPageProps = {
  params: Promise<{ id: string; addressId: string }>;
};

export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const { id, addressId } = await params;

  return (
    <>
      <EditAddressForm userId={Number(id)} addressId={Number(addressId)} />
    </>
  );
}