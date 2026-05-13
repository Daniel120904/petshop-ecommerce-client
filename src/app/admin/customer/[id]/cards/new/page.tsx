import { CreateCardForm } from "@/components/CreateCardForm/CreateCardForm";

type NewCardPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewCardPage({ params }: NewCardPageProps) {
  const { id } = await params;
  const userId = Number(id);

  return (
    <>
      <CreateCardForm userId={userId} />
    </>
  );
}