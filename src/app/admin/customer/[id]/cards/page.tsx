import { CardListView } from "@/components/CardListView/CardListView";
import { Header } from "@/components/Header/Header";

type CardsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CardsPage({ params }: CardsPageProps) {
  const { id } = await params;
  const userId = Number(id);

  return (
    <>
      <Header title="Clientes" showBack backHref="/admin" />
      <CardListView userId={userId} />
    </>
  );
}