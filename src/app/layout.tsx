import { Footer } from "@/components/Footer/Footer";
import './globals.css'
import { ReactNode } from "react";
import { AuthProvider } from "@/context/authContext";

export const metadata = {
  title: "PetShop E-commerce",
  description: "Sistema E-commerce PetShop",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}