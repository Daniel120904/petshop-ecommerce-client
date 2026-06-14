import { CreateCardForm } from "@/components/CreateCardForm/CreateCardForm";
import { Header } from "@/components/Header/Header";

type NewCardPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewCardPage({ params }: NewCardPageProps) {
  const { id } = await params;
  const userId = Number(id);

  return (
    <>
      <Header title="Clientes" showBack backHref="/admin" />
      <CreateCardForm userId={userId} />
    </>
  );
}