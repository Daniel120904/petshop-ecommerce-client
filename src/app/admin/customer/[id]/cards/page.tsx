import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { CardListView } from "@/components/CardListView/CardListView";

type CardsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CardsPage({ params }: CardsPageProps) {
  const { id } = await params;
  const userId = Number(id);

  return (
    <>
      <Header title="Lista de Cartões" showBack />
      <CardListView userId={userId} />
      <Footer />
    </>
  );
}