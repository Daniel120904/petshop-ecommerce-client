import { Header } from "@/components/Header/Header";
import { ProfileView } from "@/components/ProfileView/ProfileView";

const USER_NAV = [
  { label: "Produtos",             href: "/user/products" },
  { label: "Carrinho",             href: "/user/cart" },
  { label: "Chat AI",              href: "/user/chat" },
  { label: "Histórico de Compras", href: "/user/orders" },
  { label: "Perfil",               href: "/user/profile" },
];

export default function ProfilePage() {
  return (
    <>
      <Header
        title="PetShop - Meu Perfil"
        showBack
        backHref="/user"
        navLinks={USER_NAV}
      />
      <ProfileView />
    </>
  );
}