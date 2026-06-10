import { Header } from "@/components/Header/Header";
import { ChatView } from "@/components/ChatView/ChatView";

const USER_NAV = [
  { label: "Produtos",             href: "/user/products" },
  { label: "Carrinho",             href: "/user/cart" },
  { label: "Chat AI",              href: "/user/chat" },
  { label: "Histórico de Compras", href: "/user/orders" },
  { label: "Perfil",               href: "/user/profile" },
];

export default function ChatPage() {
  return (
    <>
      <Header
        title="PetShop - Chat AI"
        showBack
        backHref="/user"
        navLinks={USER_NAV}
      />
      <ChatView />
    </>
  );
}