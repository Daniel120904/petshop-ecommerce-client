"use client";

import { Header } from "@/components/Header/Header";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  const titles: Record<string, string> = {
    "/admin": "Administrador",
    "/admin/sales": "Vendas",
    "/admin/customer": "Clientes",
    "/admin/product": "Produto",
  };

  const currentTitle = titles[pathname] || "Administrador";

  return (
    <>
        <Header
            title={currentTitle}
            showBack={pathname !== "/admin"}
            backHref="/admin"
        />

      {children}
    </>
  );
}

//Futuro: Colocar um cache pra voltar pro local certo