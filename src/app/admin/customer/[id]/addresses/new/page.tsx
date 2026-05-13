import { CreateAddressForm } from "@/components/CreateAddressForm/CreateAddressForm";

type NewAddressPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewAddressPage({ params }: NewAddressPageProps) {
  const { id } = await params;
  const userId = Number(id);

  return (
    <>
      <CreateAddressForm userId={userId} />
    </>
  );
}