import { EditCustomerForm } from "@/components/EditCustomerForm/EditCustomerForm";

type EditCustomerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { id } = await params;
  const customerId = Number(id);

  return (
    <>
      <EditCustomerForm customerId={customerId} />
    </>
  );
}