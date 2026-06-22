import { Header } from "@/components/Header/Header";
import { CheckoutView } from "@/components/CheckoutView/CheckoutView";

const USER_NAV = [
  { label: "Produtos",             href: "/user/products" },
  { label: "Carrinho",             href: "/user/cart" },
  { label: "Chat AI",              href: "/user/chat" },
  { label: "Histórico de Compras", href: "/user/orders" },
  { label: "Perfil",               href: "/user/profile" },
];

export default function CheckoutPage() {
  return (
    <>
      <Header
        title="PetShop - Finalizar Compra"
        showBack
        backHref="/user/cart"
        navLinks={USER_NAV}
      />
      <CheckoutView />
    </>
  );
}