import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { CreateCardForm } from "@/components/CreateCardForm/CreateCardForm";

type NewCardPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewCardPage({ params }: NewCardPageProps) {
  const { id } = await params;
  const userId = Number(id);

  return (
    <>
      <Header title="Adicionar Cartão" showBack />
      <CreateCardForm userId={userId} />
      <Footer />
    </>
  );
}