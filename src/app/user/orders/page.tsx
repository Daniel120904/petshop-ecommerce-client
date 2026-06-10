import { Header } from "@/components/Header/Header";
import { OrdersView } from "@/components/OrdersView/OrdersView";

const USER_NAV = [
  { label: "Produtos",             href: "/user/products" },
  { label: "Carrinho",             href: "/user/cart" },
  { label: "Chat AI",              href: "/user/chat" },
  { label: "Histórico de Compras", href: "/user/orders" },
  { label: "Perfil",               href: "/user/profile" },
];

export default function OrdersPage() {
  return (
    <>
      <Header
        title="PetShop - Histórico de Compras"
        showBack
        backHref="/user"
        navLinks={USER_NAV}
      />
      <OrdersView />
    </>
  );
}