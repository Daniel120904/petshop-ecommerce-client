import { Header } from "@/components/Header/Header";
import { SalesChartView } from "@/components/SalesChartView/SalesChartView";

const SALES_NAV = [
  { label: "Histórico", href: "/admin/sales/history" },
  { label: "Gráfico",   href: "/admin/sales/graphic" },
];

export default function SalesGraphicPage() {
  return (
    <>
      <Header
        title="PetShop - Vendas"
        showBack
        backHref="/admin"
        navLinks={SALES_NAV}
      />
      <SalesChartView />
    </>
  );
}