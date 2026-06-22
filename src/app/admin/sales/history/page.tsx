import { SalesListView } from "@/components/SalesListView/SalesListView";
import { Header } from "@/components/Header/Header";

const SALES_NAV = [
  { label: "Histórico", href: "/admin/sales/history" },
  { label: "Gráfico", href: "/admin/sales/graphic" },
];

export default function SalesHistoryPage() {
  return (
    <>
      <Header
        title="PetShop - Vendas"
        showBack
        backHref="/admin"
        navLinks={SALES_NAV}
      />
      <SalesListView />
    </>
  );
}
