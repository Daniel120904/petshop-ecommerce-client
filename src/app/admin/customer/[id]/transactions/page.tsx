import { Header } from "@/components/Header/Header";
import { CustomerSalesView } from "@/components/CustomerSalesView/CustomerSalesView";

type CustomerTransactionsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerTransactionsPage({
  params,
}: CustomerTransactionsPageProps) {
  const { id } = await params;
  const userId = Number(id);

  return (
    <>
      <Header title="Clientes" showBack backHref="/admin" />
      <CustomerSalesView userId={userId} />
    </>
  );
}