import { Header } from "@/components/Header/Header";
import { UserWelcome } from "@/components/UserWelcome/UserWelcome";

const USER_NAV = [
  { label: "Produtos",             href: "/user/products" },
  { label: "Carrinho",             href: "/user/cart" },
  { label: "Chat AI",              href: "/user/chat" },
  { label: "Histórico de Compras", href: "/user/orders" },
  { label: "Perfil",               href: "/user/profile" },
];


export default function UserHomePage() {
  return (
    <>
      <Header
        title="PetShop - Home"
        showBack
        backHref="/"
        navLinks={USER_NAV}
      />
      <UserWelcome />
    </>
  );
}