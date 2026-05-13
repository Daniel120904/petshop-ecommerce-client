import { CardListView } from "@/components/CardListView/CardListView";

type CardsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CardsPage({ params }: CardsPageProps) {
  const { id } = await params;
  const userId = Number(id);

  return (
    <>
      <CardListView userId={userId} />
    </>
  );
}